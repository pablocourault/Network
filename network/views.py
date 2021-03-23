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
       posteo.megusta.remove(request.user)
       posteo.save()
       booleanvalue = 'False' 
    else:
        posteo.cantidad_megusta  +=1
        posteo.megusta.add(request.user)
        posteo.save()
        booleanvalue = 'True'

    return JsonResponse({'likes': posteo.cantidad_megusta, 'megusta': booleanvalue})


def profile(request, nombre):

    usuarioprf = User.objects.get(username=nombre)

    profile = Profile.objects.get(usuario=usuarioprf)
    profilename = nombre

    lista_posts = Posts.objects.filter(usuario=usuarioprf.id).order_by('-post_date')
    paginator = Paginator(lista_posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    if request.user in profile.seguidores.all():
        accion = 'Unfollow'
    else:
        accion = 'Follow'

    if request.user.is_authenticated:
        perfil = Profile.objects.get(usuario=request.user)
        return render(request, "network/profile.html",{"perfil": perfil,'page_obj': page_obj,
                                                       'profile': profile,
                                                       'profilename': profilename,
                                                       'accion': accion })
    else:
        return render(request, "network/profile.html",{'page_obj': page_obj, 
                                                       'profile': profile,
                                                       'profilename': profilename})


@login_required
def follows(request, accion, usertofollow):

    if accion == 'Follow':

        # busco el user para después poder buscar el profile
        usuariotofollow = User.objects.get(username=usertofollow)
        profiletofollow = Profile.objects.get(usuario=usuariotofollow)

        profilerequest = Profile.objects.get(usuario=request.user)

        profilerequest.cantidad_seguidos +=1
        profilerequest.siguiendo.add(usuariotofollow)
        profilerequest.save()

        profiletofollow.cantidad_seguidores +=1
        profiletofollow.seguidores.add(request.user)
        profiletofollow.save()

        seguidores = profiletofollow.cantidad_seguidores
        action = 'Unfollow'

    if accion == 'Unfollow':

        # busco el user para después poder buscar el profile
        usuariotounfollow = User.objects.get(username=usertofollow)
        profiletounfollow = Profile.objects.get(usuario=usuariotounfollow)

        profilerequest = Profile.objects.get(usuario=request.user)

        profilerequest.cantidad_seguidos -=1
        profilerequest.siguiendo.remove(usuariotounfollow)
        profilerequest.save()

        profiletounfollow.cantidad_seguidores -=1
        profiletounfollow.seguidores.remove(request.user)
        profiletounfollow.save()

        seguidores = profiletounfollow.cantidad_seguidores
        action = 'Follow'

    return JsonResponse({'seguidores': seguidores, 'action': action})


@login_required
def following(request):

    perfil = Profile.objects.get(usuario=request.user)
    following_users = perfil.siguiendo.all()

    lista_posts = Posts.objects.all().order_by('-post_date').filter(usuario__in=following_users)

    paginator = Paginator(lista_posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/index.html",{'perfil': perfil,
                                                 'page_obj': page_obj,
                                                 'following': True})

@csrf_exempt
@login_required
def edit(request):
    if request.method == "POST":
         data = json.loads(request.body)
         idpostaactualizar = data.get("postupdated")
         contenidoaactualizar = data.get("contentupdated")
         posteo = Posts.objects.get(id=idpostaactualizar)

         if posteo.usuario == request.user:
             posteo.contents = contenidoaactualizar
             posteo.save()
             return JsonResponse({'contenidoaactualizar': contenidoaactualizar}, status=201)
         else:
             return JsonResponse({'error': 'el usuario no tiene autorización'}, status=400)
    else:
        return JsonResponse({'error': 'POST request required.'}, status=400)

