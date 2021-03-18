import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from .models import User, Profile, Posts


def index(request):

    lista_posts = Posts.objects.all().order_by('-post_date')
    paginator = Paginator(lista_posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    if request.user.is_authenticated:
        perfil = Profile.objects.get(usuario=request.user)
        return render(request, "network/index.html",{"perfil": perfil,'page_obj': page_obj})
    else:
        return render(request, "network/index.html",{'page_obj': page_obj})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
           
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")



def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            profile = Profile(usuario=user)
            profile.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def publish(request):

     # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

     # Check emptypost

    data = json.loads(request.body)
    contenido = data.get("contenido","")

    if len(contenido) == 0:
        return JsonResponse({"error": "empty post."}, status=400)

    profileavatar = Profile.objects.get(usuario=request.user)

    posteo = Posts(usuario=request.user, avatar=profileavatar.avatar, contents=contenido)
    posteo.save()

    return JsonResponse({"message": "Post published successfully."}, status=201)


@csrf_exempt
@login_required
def likescounter(request, postid):

    posteo = Posts.objects.get(id=postid)

    if request.user in posteo.megusta.all():
       posteo.cantidad_megusta -=1
       posteo.save()
    else:
        posteo.cantidad_megusta  +=1
        posteo.save()

    cantidad = posteo.cantidad_megusta

    data = {
        'likes': cantidad}

    return JsonResponse(data)
