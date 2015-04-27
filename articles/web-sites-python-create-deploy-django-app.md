<properties 
	pageTitle="Creating web apps with Django in Azure" 
	description="A tutorial that introduces you to running a Python web app in Azure App Service Web Apps." 
	services="app-service\web" 
	documentationCenter="python" 
	authors="huguesv" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="04/15/2015" 
	ms.author="huguesv"/>




# Creating web apps with Django in Azure

This tutorial describes how to get started running Python on [Azure App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714). Web Apps provides limited free hosting and rapid deployment, and you can use Python! As your app grows, you can switch to paid hosting, and you can also integrate with all of the other Azure services.

You will create an application using the Django web framework (see alternate versions of this tutorial for [Flask](web-sites-python-create-deploy-flask-app.md) and [Bottle](web-sites-python-create-deploy-bottle-app.md)). You will create the web app from the Azure Marketplace, set up Git deployment, and clone the repository locally. Then you will run the application locally, make changes, commit and push them to Azure. The tutorial shows how to do this from Windows or Mac/Linux.

[AZURE.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.


## Prerequisites

- Windows, Mac or Linux
- Python 2.7 or 3.4
- setuptools, pip, virtualenv (Python 2.7 only)
- Git
- [Python Tools 2.1 for Visual Studio] (optional)

**Note**: TFS publishing is currently not supported for Python projects.

### Windows

If you don't already have Python 2.7 or 3.4 installed (32-bit), we recommend installing [Azure SDK for Python 2.7] or [Azure SDK for Python 3.4] using Web Platform Installer. This installs the 32-bit version of Python, setuptools, pip, virtualenv, etc (32-bit Python is what's installed on the Azure host machines). Alternatively, you can get Python from [python.org].

For Git, we recommend [Git for Windows] or [GitHub for Windows]. If you use Visual Studio, you can use the integrated Git support.

We also recommend installing [Python Tools 2.1 for Visual Studio]. This is optional, but if you have [Visual Studio], including the free Visual Studio Community 2013 or Visual Studio Express 2013 for Web, then this will give you a great Python IDE.

### Mac/Linux

You should have Python and Git already installed, but make sure you have either Python 2.7 or 3.4.


## Web App Creation on Portal

The first step in creating your app is to create the web app via the [Azure Portal](https://portal.azure.com). 

1. Log into the Azure Portal and click the **NEW** button in the bottom left corner. 
2. Click **Web + Mobile** > **Azure Marketplace** > **Web Apps**.
3. In the search box, type "python".
4. In the search results, select **Django**, then click **Create**.
5. Configure the new Django app, such as creating a new App Service plan and a new resource group for it. Then, click **Create**.
6. Configure Git publishing for your newly created web app by following the instructions at [Continuous deployment using GIT in Azure App Service](web-sites-publish-source-control.md).

## Application Overview

### Git repository contents

Here's an overview of the files you'll find in the initial Git repository, which we'll clone in the next section.

    \app\__init__.py
    \app\forms.py
    \app\models.py
    \app\tests.py
    \app\views.py
    \app\static\content\
    \app\static\fonts\
    \app\static\scripts\
    \app\templates\about.html
    \app\templates\contact.html
    \app\templates\index.html
    \app\templates\layout.html
    \app\templates\login.html
    \app\templates\loginpartial.html
    \DjangoWebProject\__init__.py
    \DjangoWebProject\settings.py
    \DjangoWebProject\urls.py
    \DjangoWebProject\wsgi.py

Main sources for the application. Consists of 3 pages (index, about, contact) with a master layout. Static content and scripts include bootstrap, jquery, modernizr and respond.

    \manage.py

Local management and development server support. Use this to run the application locally, synchronize the database, etc.

    \db.sqlite3

Default database. Includes the necessary tables for the application to run, but does not contain any users (synchronize the database to create a user).

    \DjangoWebProject.pyproj
    \DjangoWebProject.sln

Project files for use with [Python Tools for Visual Studio](http://pytools.codeplex.com).

    \ptvs_virtualenv_proxy.py

IIS proxy for virtual environments and PTVS remote debugging support.

    \requirements.txt

External packages needed by this application. The deployment script will pip install the packages listed in this file.
 
    \web.2.7.config
    \web.3.4.config

IIS configuration files. The deployment script will use the appropriate web.x.y.config and copy it as web.config.

### Optional files - Customizing deployment

[AZURE.INCLUDE [web-sites-python-customizing-deployment](../includes/web-sites-python-customizing-deployment.md)]

### Optional files - Python runtime

[AZURE.INCLUDE [web-sites-python-customizing-runtime](../includes/web-sites-python-customizing-runtime.md)]

### Additional files on server

Some files exist on the server but are not added to the git repository. These are created by the deployment script.

    \web.config

IIS configuration file. Created from web.x.y.config on every deployment.

    \env\

Python virtual environment. Created during deployment if a compatible virtual environment doesn't already exist on the web app. Packages listed in requirements.txt are pip installed, but pip will skip installation if the packages are already installed.

The next 3 sections describe how to proceed with the web app development under 3 different environments:

- Windows, with Python Tools for Visual Studio
- Windows, with command line
- Mac/Linux, with command line


## Web app development - Windows - Python Tools for Visual Studio

### Clone the repository

First, clone the repository using the URL provided on the Azure Portal. For more information, see [Continuous deployment using GIT in Azure App Service](web-sites-publish-source-control.md).

Open the solution file (.sln) that is included in the root of the repository.

![](./media/web-sites-python-create-deploy-django-app/ptvs-solution-django.png)

### Create virtual environment

Now we'll create a virtual environment for local development. Right-click on **Python Environments** select **Add Virtual Environment...**.

- Make sure the name of the environment is `env`.

- Select the base interpreter. Make sure to use the same version of Python that is selected for your web app (in runtime.txt or the **Application Settings** blade of your web app in the Azure Portal).

- Make sure the option to download and install packages is checked.

![](./media/web-sites-python-create-deploy-django-app/ptvs-add-virtual-env-27.png)

Click **Create**. This will create the virtual environment, and install dependencies listed in requirements.txt.

### Create a superuser

The database included with the application does not have any superuser defined. In order to use the sign-in functionality in the application, or the Django admin interface (if you decide to enable it), you'll need to create a superuser.

Run this from the command-line from your project folder:

    env\scripts\python manage.py createsuperuser

Follow the prompts to set the user name, password, etc.

### Run using development server

Press F5 to start debugging, and your web browser will open automatically to the page running locally.

![](./media/web-sites-python-create-deploy-django-app/windows-browser-django.png)

You can set breakpoints in the sources, use the watch windows, etc. See the [PTVS documentation] for more information on the various features.

### Make changes

Now you can experiment by making changes to the application sources and/or templates.

After you've tested your changes, commit them to the Git repository:

![](./media/web-sites-python-create-deploy-django-app/ptvs-commit-django.png)

### Install more packages

Your application may have dependencies beyond Python and Django.

You can install additional packages using pip. To install a package, right-click on the virtual environment and select **Install Python Package**.

For example, to install the Azure SDK for Python, which gives you access to Azure storage, service bus and other Azure services, enter `azure`:

![](./media/web-sites-python-create-deploy-django-app/ptvs-install-package-dialog.png)

Right-click on the virtual environment and select **Generate requirements.txt** to update requirements.txt.

Then, commit the changes to requirements.txt to the Git repository.

### Deploy to Azure

To trigger a deployment, click on **Sync** or **Push**. Sync does both a push and a pull.

![](./media/web-sites-python-create-deploy-django-app/ptvs-git-push.png)

The first deployment will take some time, as it will create a virtual environment, install packages, etc.

Visual Studio doesn't show the progress of the deployment. If you'd like to review the output, see the section on [Troubleshooting - Deployment](#troubleshooting-deployment).

Browse to the Azure URL to view your changes.


## Web app development - Windows - command line

### Clone the repository

First, clone the repository using the URL provided on the Azure Portal, and add the Azure repository as a remote. For more information, see [Continuous deployment using GIT in Azure App Service](web-sites-publish-source-control.md).

    git clone <repo-url>
    cd <repo-folder>
    git remote add azure <repo-url> 

### Create virtual environment

We'll create a new virtual environment for development purposes (do not add it to the repository). Virtual environments in Python are not relocatable, so every developer working on the application will create their own locally.

Make sure to use the same version of Python that is selected for your web app (in runtime.txt or the Application Settings blade of your web app in the Azure Portal).

For Python 2.7:

    c:\python27\python.exe -m virtualenv env

For Python 3.4:

    c:\python34\python.exe -m venv env

Install any external packages required by your application. You can use the requirements.txt file at the root of the repository to install the packages in your virtual environment:

    env\scripts\pip install -r requirements.txt

### Create a superuser

The database included with the application does not have any superuser defined. In order to use the sign-in functionality in the application, or the Django admin interface (if you decide to enable it), you'll need to create a superuser.

Run this from the command-line from your project folder:

    env\scripts\python manage.py createsuperuser

Follow the prompts to set the user name, password, etc.

### Run using development server

You can launch the application under a development server with the following command:

    env\scripts\python manage.py runserver

The console will display the URL and port the server listens to:

![](./media/web-sites-python-create-deploy-django-app/windows-run-local-django.png)

Then, open your web browser to that URL.

![](./media/web-sites-python-create-deploy-django-app/windows-browser-django.png)

### Make changes

Now you can experiment by making changes to the application sources and/or templates.

After you've tested your changes, commit them to the Git repository:

    git add <modified-file>
    git commit -m "<commit-comment>"

### Install more packages

Your application may have dependencies beyond Python and Django.

You can install additional packages using pip. For example, to install the Azure SDK for Python, which gives you access to Azure storage, service bus and other Azure services, type:

    env\scripts\pip install azure

Make sure to update requirements.txt:

    env\scripts\pip freeze > requirements.txt

Commit the changes:

    git add requirements.txt
    git commit -m "Added azure package"

### Deploy to Azure

To trigger a deployment, push the changes to Azure:

    git push azure master

You will see the output of the deployment script, including virtual environment creation, installation of packages, creation of web.config.

Browse to the Azure URL to view your changes.


## Web app development - Mac/Linux - command line

### Clone the repository

First, clone the repository using the URL provided on the Azure Portal, and add the Azure repository as a remote. For more information, see [Continuous deployment using GIT in Azure App Service](web-sites-publish-source-control.md).

    git clone <repo-url>
    cd <repo-folder>
    git remote add azure <repo-url> 

### Create virtual environment

We'll create a new virtual environment for development purposes (do not add it to the repository). Virtual environments in Python are not relocatable, so every developer working on the application will create their own locally.

Make sure to use the same version of Python that is selected for your web app (in runtime.txt or the Application Settings blade of your web app in the Azure Portal).

For Python 2.7:

    python -m virtualenv env

For Python 3.4:

    python -m venv env

Install any external packages required by your application. You can use the requirements.txt file at the root of the repository to install the packages in your virtual environment:

    env/bin/pip install -r requirements.txt

### Create a superuser

The database included with the application does not have any superuser defined. In order to use the sign-in functionality in the application, or the Django admin interface (if you decide to enable it), you'll need to create a superuser.

Run this from the command-line from your project folder:

    env/bin/python manage.py createsuperuser

Follow the prompts to set the user name, password, etc.

### Run using development server

You can launch the application under a development server with the following command:

    env/bin/python manage.py runserver

The console will display the URL and port the server listens to:

![](./media/web-sites-python-create-deploy-django-app/mac-run-local-django.png)

Then, open your web browser to that URL.

![](./media/web-sites-python-create-deploy-django-app/mac-browser-django.png)

### Make changes

Now you can experiment by making changes to the application sources and/or templates.

After you've tested your changes, commit them to the Git repository:

    git add <modified-file>
    git commit -m "<commit-comment>"

### Install more packages

Your application may have dependencies beyond Python and Django.

You can install additional packages using pip. For example, to install the Azure SDK for Python, which gives you access to Azure storage, service bus and other Azure services, type:

    env/bin/pip install azure

Make sure to update requirements.txt:

    env/bin/pip freeze > requirements.txt

Commit the changes:

    git add requirements.txt
    git commit -m "Added azure package"

### Deploy to Azure

To trigger a deployment, push the changes to Azure:

    git push azure master

You will see the output of the deployment script, including virtual environment creation, installation of packages, creation of web.config.

Browse to the Azure URL to view your changes.


## Troubleshooting - Package Installation

[AZURE.INCLUDE [web-sites-python-troubleshooting-package-installation](../includes/web-sites-python-troubleshooting-package-installation.md)]


## Troubleshooting - Virtual Environment

[AZURE.INCLUDE [web-sites-python-troubleshooting-virtual-environment](../includes/web-sites-python-troubleshooting-virtual-environment.md)]


## Troubleshooting - Static Files

Django has the concept of collecting static files. This takes all the static files from their original location and copies them to a single folder. For this application, they are copied to `/static`.

This is done because static files may come from different Django 'apps'. For example, the static files from the Django admin interfaces are located in a Django library subfolder in the virtual environment. Static files defined by this application are located in `/app/static`. As you use more Django 'apps', you'll have static files located in multiple places.

When running the application in debug mode, the application serves the static files from their original location.

When running the application in release mode, the application does **not** serve the static files. It is the responsibility of the web server to serve the files. For this application, IIS will serve the static files from `/static`.

The collection of static files is done automatically as part of the deployment script, clearing previously collected files. This means the collection occurs on every deployment, slowing down deployment a bit, but it ensures that obsolete files won't be available, avoiding a potential security issue. 

If you want to skip collection of static files for your Django application:

    \.skipDjango 

Then you'll need to do the collection manually on your local machine:

    env\scripts\python manage.py collectstatic

Then remove the `\static` folder from `.gitignore` and add it to the Git repository.


## Troubleshooting - Settings

Various settings for the application can be changed in `DjangoWebProject/settings.py`.

For developer convenience, debug mode is enabled. One nice side effect of that is you'll be able to see images and other static content when running locally, without having to collect static files.

To disable debug mode:

    DEBUG = False

When debug is disabled, the value for `ALLOWED_HOSTS` needs to be updated to include the Azure host name. For example:

    ALLOWED_HOSTS = (
        'pythonapp.azurewebsites.net',
    )

or to enable any:

    ALLOWED_HOSTS = (
        '*',
    )
 
In practice, you may want to do something more complex to deal with switching between debug and release mode, and getting the host name.

You can set environment variables through the Azure portal **CONFIGURE** page, in the **app settings** section.  This can be useful for setting values that you may not want to appear in the sources (connection strings, passwords, etc), or that you want to set differently between Azure and your local machine. In `settings.py`, you can query the environment variables using `os.getenv`.


## Using a Database

The database that is included with the application is a sqlite database. This is a convenient and useful default database to use for development, as it requires almost no setup. The database is stored in the db.sqlite3 file in the project folder.

Azure provides database services which are easy to use from a Django application. Tutorials for using [SQL Database] and [MySQL] from a Django application show the steps necessary to create the database service, change the database settings in `DjangoWebProject/settings.py`, and the libraries required to install.

Of course, if you prefer to manage your own database servers, you can do so using Windows or Linux virtual machines running on Azure.


## Django Admin Interface

Once you start building your models, you'll want to populate the database with some data. An easy way to do add and edit content interactively is to use the Django administration interface.

The code for the admin interface is commented out in the application sources, but it's clearly marked so you can easily enable it (search for 'admin').

After it's enabled, synchronize the database, run the application and navigate to `/admin`.


## Next Steps

Follow these links to learn more about Django and Python Tools for Visual Studio: 
 
- [Django Documentation]
- [Python Tools for Visual Studio Documentation]

For information on using SQL Database and MySQL:

- [Django and SQL Database on Azure with Python Tools 2.1 for Visual Studio]
- [Django and MySQL on Azure with Python Tools 2.1 for Visual Studio]

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)


<!--Link references-->
[Django and MySQL on Azure with Python Tools 2.1 for Visual Studio]: web-sites-python-ptvs-django-mysql.md
[Django and SQL Database on Azure with Python Tools 2.1 for Visual Studio]: web-sites-python-ptvs-django-sql.md
[SQL Database]: web-sites-python-ptvs-django-sql.md
[MySQL]: web-sites-python-ptvs-django-mysql.md


<!--External Link references-->
[Azure SDK for Python 2.7]: http://go.microsoft.com/fwlink/?linkid=254281
[Azure SDK for Python 3.4]: http://go.microsoft.com/fwlink/?linkid=516990
[python.org]: http://www.python.org/
[Git for Windows]: http://msysgit.github.io/
[GitHub for Windows]: https://windows.github.com/
[Python Tools for Visual Studio]: http://aka.ms/ptvs
[Python Tools 2.1 for Visual Studio]: http://go.microsoft.com/fwlink/?LinkId=517189
[Visual Studio]: http://www.visualstudio.com/
[PTVS documentation]: http://pytools.codeplex.com/documentation
[Python Tools for Visual Studio Documentation]: http://pytools.codeplex.com/documentation 
[Django Documentation]: https://www.djangoproject.com/

