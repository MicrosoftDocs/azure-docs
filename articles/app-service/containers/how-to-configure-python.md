---
title: Configure built-in Python image in Azure App Service
description: This tutorial describes options for authoring and configuring a Python application on Azure App Service, with the built-in Python image.
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
ms.date: 09/25/2018
ms.author: astay;cephalin
ms.custom: mvc

---

# Configure built-in Python image in Azure App Service (Preview)

This article shows how to configure the Python built-in image in [App Service on Linux](app-service-linux-intro.md) to run your Python applications.

## Python version

The Python runtime in App Service on Linux uses version `python-3.7.0`.

## Supported frameworks

All versions of Web Server Gateway Interface(WSGI) compliant web frameworks that are compatible with the `python-3.7` runtime are supported.

## Package management

During Git publishing, the Kudu engine looks for [requirements.txt](https://pip.pypa.io/en/stable/user_guide/#requirements-files) in the repository root and automatically install the packages in Azure using `pip`.

To generate this file before publishing, navigate to the repository root and run the following command in your Python environment:

```bash
pip freeze > requirements.txt
```

## Configure your Python app

The built-in Python image in App Service uses the [Gunicorn](http://gunicorn.org/) server to run your Python application. Gunicorn is a Python WSGI HTTP Server for UNIX. App Service automates configures Gunicorn automatically for Django and Flask projects.

### Django app

If you publish a Django project that contains a `wsgi.py` module, Azure automatically calls Gunicorn using the following command:

```bash
gunicorn <path_to_wsgi>
```

### Flask app

If you're publishing a Flask app, and the entry point is in an `application.py` or `app.py` module, Azure automatically calls Gunicorn using one of the following commands, respectively:

```bash
gunicorn application:app
```

Or 

```bash
gunicorn app:app
```

### Customize start-up

To define a custom entry point for your app, first create a _.txt_ file with a custom Gunicorn command and place it at the root of your project. For example, to start the server with the module _helloworld.py_ and the variable `app`, create a _startup.txt_ with the following content:

```bash
gunicorn helloworld:app
```

In the [Application settings](../web-sites-configure.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) page, pick **Python|3.7** as the **Runtime Stack** and provide the name of your **Startup File** from the previous step. For example, _startup.txt_.
