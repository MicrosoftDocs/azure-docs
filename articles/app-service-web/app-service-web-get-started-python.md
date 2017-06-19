---
title: Cree una aplicación web Python en Azure | Microsoft Docs
description: Implemente su primer "Hello World"  en Azure App Service Web Apps en cuestión de minutos.
services: app-service\web
documentationcenter: ''
author: syntaxc4
manager: erikre
editor: ''

ms.assetid: 928ee2e5-6143-4c0c-8546-366f5a3d80ce
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 03/17/2017
ms.author: cfowler
ms.custom: mvc
---
# Cree una aplicación web Python en Azure

[Aplicaciones Azure web](https://docs.microsoft.com/azure/app-service-web/app-service-web-overview) proporciona un servicio de alojamiento web altamente escalable y auto-reparable. Este inicio rápido explica cómo desarrollar e implementar una aplicación de Python en Azure Web Apps. Crea la aplicación web utilizando la [CLI de Azure] (https://docs.microsoft.com/cli/azure/get-started-with-azure-cli), y utiliza Git para implementar código de ejemplo de Python en la aplicación web.


![Ejemplo de aplicación que se ejecuta en Azure](media/app-service-web-get-started-python/hello-world-in-browser.png)

Puede seguir los pasos que se indican a continuación utilizando una máquina Mac, Windows o Linux. Una vez que se han instalado los requisitos previos, se tardan unos cinco minutos en completar los pasos.
## Requisitos previos

Para completar este tutorial:

1. [Instalar Git](https://git-scm.com/)
1. [Instalar Python](https://www.python.org/downloads/)
1. [Instalar Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli)

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Descargar la muestra

En una ventana de terminal, ejecute el comando siguiente para clonar el repositorio de ejemplo de la aplicación en su máquina local.

```bash
git clone https://github.com/Azure-Samples/python-docs-hello-world
```

Cambie el directorio que contiene el código abierto.

```bash
cd Python-docs-hello-world
```

## Ejecute la aplicación locamente

Ejecute la aplicación localmente abriendo una ventana de terminal y utilizando el comando `Python` para iniciar el servidor web Python incorporado.

```bash
python main.py
```

Abra un navegador web y navegue hasta la aplicación de ejemplo en http://localhost:5000.

Puede ver el mensaje ** Hello World ** de la aplicación de ejemplo que se muestra en la página.

![Ejemplo de aplicación que se ejecuta localmente](media/app-service-web-get-started-python/localhost-hello-world-in-browser.png)

En la ventana del terminal, presione ** Ctrl + C ** para salir del servidor web.

[!INCLUDE [Inicio de sesión en Azure](../../includes/login-to-azure.md)] 

[!INCLUDE [Configurar usuario de implementación](../../includes/configure-deployment-user.md)] 

[!INCLUDE [Crear grupo de recursos](../../includes/app-service-web-create-resource-group.md)] 

[!INCLUDE [Crear un plan de servicio de aplicaciones](../../includes/app-service-web-create-app-service-plan.md)] 

[!INCLUDE [Crear una aplicación web](../../includes/app-service-web-create-web-app.md)] 

![Página de aplicación web vacía](media/app-service-web-get-started-python/app-service-web-service-created.png)

Has creado una nueva aplicación web vacía en Azure.

## Configurar para utilizar Python

Utilizar el [az appservice web config update](/cli/azure/app-service/web/config#update) comando para configurar la aplicación web para usar la versión de Python `3.4`.

```azurecli-interactive
az appservice web config update --python-version 3.4 --name <app_name> --resource-group myResourceGroup
```

Establecer la versión de Python de esta manera utiliza un contenedor predeterminado proporcionado por la plataforma. Para usar su propio contenedor, consulte la referencia CLI [Actualización de az appservice web config container](https://docs.microsoft.com/cli/azure/appservice/web/config/container#update) command.

[!INCLUDE [Configurar el git local](../../includes/app-service-web-configure-local-git.md)] 

[!INCLUDE [Empuje a Azure](../../includes/app-service-web-git-push-to-azure.md)] 

```bash
Counting objects: 18, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (16/16), done.
Writing objects: 100% (18/18), 4.31 KiB | 0 bytes/s, done.
Total 18 (delta 4), reused 0 (delta 0)
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id '44e74fe7dd'.
remote: Generating deployment script.
remote: Generating deployment script for python Web Site
remote: Generated deployment script files
remote: Running deployment command...
remote: Handling python deployment.
remote: KuduSync.NET from: 'D:\home\site\repository' to: 'D:\home\site\wwwroot'
remote: Deleting file: 'hostingstart.html'
remote: Copying file: '.gitignore'
remote: Copying file: 'LICENSE'
remote: Copying file: 'main.py'
remote: Copying file: 'README.md'
remote: Copying file: 'requirements.txt'
remote: Copying file: 'virtualenv_proxy.py'
remote: Copying file: 'web.2.7.config'
remote: Copying file: 'web.3.4.config'
remote: Detected requirements.txt.  You can skip Python specific steps with a .skipPythonDeployment file.
remote: Detecting Python runtime from site configuration
remote: Detected python-3.4
remote: Creating python-3.4 virtual environment.
remote: .................................
remote: Pip install requirements.
remote: Successfully installed Flask click itsdangerous Jinja2 Werkzeug MarkupSafe
remote: Cleaning up...
remote: .
remote: Overwriting web.config with web.3.4.config
remote:         1 file(s) copied.
remote: Finished successfully.
remote: Running post deployment command(s)...
remote: Deployment successful.
To https://<app_name>.scm.azurewebsites.net/<app_name>.git
 * [new branch]      master -> master
```

## Navegar a la aplicación

Vaya a la aplicación implementada utilizando su navegador web.

```bash
http://<app_name>.azurewebsites.net
```

El código de ejemplo de Python se está ejecutando en una aplicación web de Azure App Service.

![Ejemplo de aplicación que se ejecuta en Azure](media/app-service-web-get-started-python/hello-world-in-browser.png)

**Felicitaciones!** Has implementado tu primera aplicación de Python en el servicio de aplicaciones.

## Actualizar y desplegar el código

Utilizando un editor de texto local, abra el archivo `main.py` en la aplicación Python y realice un pequeño cambio en el texto junto a la instrucción` return`:

```python
return 'Hello, Azure!'
```

Configure sus cambios en Git y luego presione los cambios de código en Azure.

```bash
git commit -am "updated output"
git push azure master
```

Una vez que se haya completado la implementación, vuelva a la ventana del navegador que se abrió en el paso [Examinar a la aplicación] (# exploración a la aplicación) y actualice la página.

![Aplicación de ejemplo actualizada que se ejecuta en Azure](media/app-service-web-get-started-python/hello-azure-in-browser.png)

## Administrar tu nueva aplicación web de Azure

Ir a la [Portal de Azure](https://portal.azure.com) Para administrar la aplicación web que creaste.

En el menú de la izquierda, haga clic en **App Services**, y luego haga clic en el nombre de su aplicación web Azure.

![Navegación por el portal a la aplicación web de Azure](./media/app-service-web-get-started-nodejs-poc/nodejs-docs-hello-world-app-service-list.png)

Verá su página de descripción de las aplicaciones web. Aquí, puede realizar tareas básicas de administración como examinar, detener, iniciar, reiniciar y eliminar. 

![App Service blade en el portal de Azure](media/app-service-web-get-started-nodejs-poc/nodejs-docs-hello-world-app-service-detail.png)

El menú de la izquierda contiene distintas páginas para configurar la aplicación.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Próximos pasos

> [!div class="nextstepaction"]
> [Python con PostgreSQL](app-service-web-tutorial-docker-python-postgresql-app.md)
