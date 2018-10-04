---
title: Configure Python apps for Azure App Service on Linux
description: This tutorial describes options for authoring and configuring Python apps for Azure App Service on Linux.
services: app-service\web
documentationcenter: ''
author: cephalin
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 10/04/2018
ms.author: astay;cephalin;kraigb
ms.custom: mvc

---

# Configure your Python app for the Azure App Service on Linux

This article describes how [Azure App Service on Linux](app-service-linux-intro.md) runs Python apps, and how you can customize the behavior of App Service when needed.

## Container characteristics

Python apps deployed to App Service on Linux run within a Docker container that's defined in the GitHub repository, [Azure-App-Service/python container](https://github.com/Azure-App-Service/python/tree/master/3.7.0).

This container has the following characteristics:

- The base container image is `python-3.7.0-slim-stretch`, which means apps are run with Python 3.7. If you require a different version of Python, you must build and deploy your own container image instead. For more information, see [Use a custom Docker image for Web App for Containers](tutorial-custom-docker-image.md).

- Apps are run using the [Gunicorn WSGI HTTP Server](http://gunicorn.org/), using the additional arguments `--bind=0.0.0.0 --timeout 600`.

- By default, the base image includes the Flask web framework, but the container supports other frameworks that are WSGI-compliant and compatible with Python 3.7, such as Django.

- To install additional packages, such as Django, create a [*requirements.txt*](https://pip.pypa.io/en/stable/user_guide/#requirements-files) file in the root of your project using `pip freeze > requirements.txt`. You must then publish to App Service from Git, during which Kudu engine automatically runs `pip install -r requirements.txt` to install your app's dependencies.

- The container's startup process is driven by the code in [*entrypoint.sh*](https://github.com/Azure-App-Service/python/blob/master/3.7.0/entrypoint.py). That process is what's described in this article and allows for customization.

## Container startup process and customizations

During startup, the App Service on Linux container runs the following steps:

1. Check for and apply a custom startup command file, if provided.
1. Check for the existence of a Django app's *wsgi.py* file, and if so, launch Gunicorn using that file.
1. Check for a file named *application.py*, as is typical with Flask, and if found, launch Gunicorn using `application:app`.
1. If no other app is found, start a default app that's built into the container.

The following sections provide additional details for each option.

### Custom startup command file

You can control the container's startup behavior by providing a file that contains a custom startup command.

1. In the root of your project, create a file named *startup.txt* (or any name you want) that contains the custom Gunicorn command to start your app. For example, if you have a Flask app whose main module is *hello.py* and the Flask app object is named `myapp`, then the command file must contain at least the following contents:

    ```bash
    gunicorn --bind=0.0.0.0 --timeout 600 hello:myapp
    ```

1. You can also add any additional arguments for Gunicorn to the command file, such as `--workers=4`. For more information, see [Running Gunicorn](http://docs.gunicorn.org/en/stable/run.html) (docs.gunicorn.org).

1. Deploy the command file to App Service.

1. In the [Application settings](../web-sites-configure.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) page, go to the **Runtime** settings, set the **Stack** option to **Python 3.7**, and specify the name of your file, such as *startup.txt*, in the **Startup File** field.

1. Restart the App Service.

> [!Warning]
> App Service ignores any errors that occur when processing a custom command file, then continues its startup process by looking for Django and Flask apps.

### Django app

For Django apps, App Service looks for a file named `wsgi.py` within your app code, and then runs Gunicorn using the following command:

```bash
# <module> is the path to the folder containing wsgi.py
gunicorn --bind=0.0.0.0 --timeout 600 <module>.wsgi
```

If you want more specific control over the startup command, use a [custom startup command file](#custom-startup-command-file) and replace `<module>` with the name of the module that contains *wsgi.py*.

### Flask app

For Flask, App Service looks for a file named *application.py* and starts Gunicorn as follows:

```bash
gunicorn --bind=0.0.0.0 --timeout 600 application:app
```

If your main app module is contained in a different file, use a different name for the app object, or you want to provide additional arguments to Gunicorn, use a [custom startup command file](#custom-startup-command-file). That section given an example for Flask using entry code in *hello.py* and a Flask app object named `myapp`.

### Default behavior

If the App Service doesn't find a custom command file, a Django app, or a Flask app, then it runs a default app, located in the _opt/defaultsite_ folder, using the following command:

```bash
gunicorn --bind=0.0.0.0 --chdir /opt/defaultsite application:app
```

The default app appears as follows:

![Default App Service on Linux web page](media/how-to-configure-python/default-python-app.png)

## Troubleshooting

- **You see the default app after deploying your own app code.**  The default app appears because you either haven't actually deployed your app code to App Service, or App Service failed to find your app code and ran the default app instead.
  - Restart the App Service, wait 15-20 seconds, and check the app again.
  - Use SSH or the Kudu console to connect directly to the App Service and verify that your files exist under *site/wwwroot*. If your files don't exist, review your deployment process and redeploy the app.
  - If your files exist, then App Service wasn't able to identify your specific startup file. Check that your app is structured as App Service expects for [Django](#django-app) or [Flask](#flask-app), or use a [custom startup command file](#custom-startup-command-file).

- **You see the message "Service Unavailable" in the browser.** The browser has timed out waiting for a response from App Service, which indicates that App Service started the Gunicorn server, but the arguments that specify the app code are incorrect.
  - Refresh the browser, especially if you're using the lowest pricing tiers in your App Service Plan. The app may take longer to start up when using free tiers, for example, and becomes responsive after you refresh the browser.
  - Check that your app is structured as App Service expects for [Django](#django-app) or [Flask](#flask-app), or use a [custom startup command file](#custom-startup-command-file).
  - Use SSH or the Kudu Console to connect to the App Service, then examine the diagnostic logs stored in the *LogFiles* folder. For more information on logging, see [Enable diagnostics logging for web apps in Azure App Service](../web-sites-enable-diagnostic-log.md).
