<properties linkid="web-sites-python-ptvs-django-mysql" title="Django and MySQL on Azure with Python Tools 2.1 for Visual Studio" pageTitle="Django and MySQL on Azure with Python Tools 2.1 for Visual Studio" description="Learn how to use the Python Tools for Visual Studio to create a Django application that stores data in a MySQL database instance and can be deployed to a web site." metaKeywords="" services="" solutions="" documentationCenter="Python" authors="huvalo" videoId="" scriptId="" manager="wpickett" editor="" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="python" ms.topic="article" ms.date="10/10/2014" ms.author="huvalo" />




# Django and MySQL on Azure with Python Tools 2.1 for Visual Studio 

In this tutorial, we'll create a simple polls application using one of the PTVS sample templates. This tutorial is also available as a [video](https://www.youtube.com/watch?v=oKCApIrS0Lo).

We'll learn how to use a MySQL service hosted on Azure, how to configure the application to use MySQL, and how to publish the application to an Azure Website.

See the [Python Developer Center][] for more articles that cover development of Azure Websites with PTVS using Bottle, Flask and Django web frameworks, with MongoDB, Azure Table Storage, MySQL and SQL Database services.  While this article focuses on Azure Websites, the steps are similar when developing [Azure Cloud Services][].

+ [Prerequisites](#prerequisites)
+ [Create the Project](#create-the-project)
+ [Create a MySQL Database](#create-a-mysql-database)
+ [Configure the Project](#configure-the-project)
+ [Publish to an Azure Website](#publish-to-an-azure-website)
+ [Next steps](#next-steps)

##<a name="prerequisites"></a>Prerequisites

 - Visual Studio 2012 or 2013
 - [Python Tools 2.1 for Visual Studio][]
 - [Python Tools 2.1 for Visual Studio Samples VSIX][]
 - [Azure SDK Tools for VS 2013][] or [Azure SDK Tools for VS 2012][]
 - [Python 2.7 32-bit][]

[WACOM.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

> [WACOM.NOTE]
> If you want to get started with Azure Websites before signing up for an account, go to <a href="https://trywebsites.azurewebsites.net/?language=python">https://trywebsites.azurewebsites.net</a>, where you can immediately create a short-lived ASP.NET starter site in Azure Websites for free. No credit card required, no commitments.

##<a name="create-the-project"></a>Create the Project

In this section, we'll create a Visual Studio project using a sample template. We'll create a virtual environment and install required packages.  We'll create a local database using sqlite.  Then we'll run the application locally.

1.  In Visual Studio, select **File**, **New Project**.

1.  The project templates from the PTVS Samples VSIX are available under **Python**, **Samples**.  Select **Polls Django Web Project** and click OK to create the project.

  	![New Project Dialog](./media/web-sites-python-ptvs-django-mysql/PollsDjangoNewProject.png)

1.  You will be prompted to install external packages.  Select **Install into a virtual environment**.

  	![External Packages Dialog](./media/web-sites-python-ptvs-django-mysql/PollsDjangoExternalPackages.png)

1.  Select **Python 2.7** as the base interpreter.

  	![Add Virtual Environment Dialog](./media/web-sites-python-ptvs-django-mysql/PollsCommonAddVirtualEnv.png)

1.  Right-click the project node and select **Python**, **Django Sync DB**.

  	![Django Sync DB Command](./media/web-sites-python-ptvs-django-mysql/PollsDjangoSyncDB.png)

1.  This will open a Django Management Console.  Follow the prompts to create a user.

    This will create a sqlite database in the project folder.

  	![Django Management Console Window](./media/web-sites-python-ptvs-django-mysql/PollsDjangoConsole.png)

1.  Confirm that the application works by pressing <kbd>F5</kbd>.

1.  Click **Log in** from the navigation bar at the top.

  	![Web Browser](./media/web-sites-python-ptvs-django-mysql/PollsDjangoCommonBrowserLocalMenu.png)

1.  Enter the credentials for the user you created when you synchronized the database.

  	![Web Browser](./media/web-sites-python-ptvs-django-mysql/PollsDjangoCommonBrowserLocalLogin.png)

1.  Click **Create Sample Polls**.

  	![Web Browser](./media/web-sites-python-ptvs-django-mysql/PollsDjangoCommonBrowserNoPolls.png)

1.  Click on a poll and vote.

  	![Web Browser](./media/web-sites-python-ptvs-django-mysql/PollsDjangoSqliteBrowser.png)

##<a name="create-a-mysql-database"></a>Create a MySQL Database

For the database, we'll create a ClearDB MySQL hosted database on Azure.

As an alternative, you can create your own Virtual Machine running in Azure, then install and administer MySQL yourself.

You can create a database with a free plan by following these steps.

1.  Log into the [Azure Management Portal][].

1.  At the bottom of the navigation pane, click **NEW**.

  	![New Button](./media/web-sites-python-ptvs-django-mysql/PollsCommonAzurePlusNew.png)

1.  Click **STORE**, then **ClearDB MySQL Database**.

  	![Choose Add-on Dialog](./media/web-sites-python-ptvs-django-mysql/PollsDjangoClearDBAddon1.png)

1.  In Name, type a name to use for the database service.

1.  Choose a Region/Affinity Group in which to locate the database service. If you will be using the database from your Azure application, select the same region where you will deploy your application.

  	![Personalize Add-on Dialog](./media/web-sites-python-ptvs-django-mysql/PollsDjangoClearDBAddon2.png)

1.  Click **PURCHASE**.

##<a name="configure-the-project"></a>Configure the Project

In this section, we'll configure our application to use the MySQL database we just created.  We'll see how to obtain connection settings from the Azure portal.  We'll also install additional Python packages required to use MySQL databases with Django.  Then we'll run the application locally.

1.  In [Azure Management Portal][], click on **ADD-ONS**, then click on the ClearDB MySQL Database service you created earlier.

1.  Click on **CONNECTION INFO**.  You can use the copy button to put the value of **CONNECTIONSTRING** on the clipboard.

  	![Connection Info Dialog](./media/web-sites-python-ptvs-django-mysql/PollsDjangoMySQLConnectionInfo.png)

1.  In Visual Studio, open **settings.py**, from the *ProjectName* folder.  Temporarily paste the connection string in the editor.  The connection string is in this format:

        Database=<NAME>;Data Source=<HOST>;User Id=<USER>;Password=<PASSWORD>

    Change the default database **ENGINE** to use MySQL, and set the values for **NAME**, **USER**, **PASSWORD** and **HOST** from the **CONNECTIONSTRING**.

        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.mysql',
                'NAME': '<Database>',
                'USER': '<User Id>',
                'PASSWORD': '<Password>',
                'HOST': '<Data Source>',
                'PORT': '',
            }
        }


1.  In Solution Explorer, under **Python Environments**, right-click on the virtual environment and select **Install Python Package**.

1. Install the package `mysql-python` using **easy_install**.

  	![Install Package Dialog](./media/web-sites-python-ptvs-django-mysql/PollsDjangoMySQLInstallPackage.png)

1.  Right-click the project node and select **Python**, **Django Sync DB**.  

    This will create the tables for the MySQL database we created in the previous section.  Follow the prompts to create a user, which doesn't have to match the user in the sqlite database created in the first section.

  	![Django Management Console Window](./media/web-sites-python-ptvs-django-mysql/PollsDjangoConsole.png)

1.  Run the application with <kbd>F5</kbd>.  Polls that are created with **Create Sample Polls** and the data submitted by voting will be serialized in the MySQL database.

##<a name="publish-to-an-azure-website"></a>Publish to an Azure Website

PTVS provides an easy way to deploy your web application to an Azure Website.

1.  In **Solution Explorer**, right-click on the project node and select **Publish**.

  	![Publish Web Dialog](./media/web-sites-python-ptvs-django-mysql/PollsCommonPublishWebSiteDialog.png)

1.  Click on **Microsoft Azure Websites**.

1.  Click on **New** to create a new site.

1.  Select a **Site name** and a **Region** and click **Create**.

  	![Create Site on Microsoft Azure Dialog](./media/web-sites-python-ptvs-django-mysql/PollsCommonCreateWebSite.png)

1.  Accept all other defaults and click **Publish**.

1.  Your web browser will open automatically to the published site.  You should see the application working as expected, using the **MySQL** database hosted on Azure.

    Congratulations!

  	![Web Browser](./media/web-sites-python-ptvs-django-mysql/PollsDjangoAzureBrowser.png)

##<a name="next-steps"></a>Next steps

Follow these links to learn more about Python Tools for Visual Studio, Django and MySQL.

- [Python Tools for Visual Studio Documentation][]
  - [Web Projects][]
  - [Cloud Service Projects][]
  - [Remote Debugging on Microsoft Azure][]
- [Django Documentation][]
- [MySQL][]


<!--Link references-->
[Python Developer Center]: /en-us/develop/python/
[Azure Cloud Services]: ../cloud-services-python-ptvs/

<!--External Link references-->
[Azure Management Portal]: https://manage.windowsazure.com
[Python Tools 2.1 for Visual Studio]: http://go.microsoft.com/fwlink/?LinkId=517189
[Python Tools 2.1 for Visual Studio Samples VSIX]: http://go.microsoft.com/fwlink/?LinkId=517189
[Azure SDK Tools for VS 2013]: http://go.microsoft.com/fwlink/?LinkId=323510
[Azure SDK Tools for VS 2012]: http://go.microsoft.com/fwlink/?LinkId=323511
[Python 2.7 32-bit]: http://go.microsoft.com/fwlink/?LinkId=517190 
[Python Tools for Visual Studio Documentation]: http://pytools.codeplex.com/documentation
[Remote Debugging on Microsoft Azure]: http://pytools.codeplex.com/wikipage?title=Features%20Azure%20Remote%20Debugging
[Web Projects]: http://pytools.codeplex.com/wikipage?title=Features%20Web%20Project
[Cloud Service Projects]: http://pytools.codeplex.com/wikipage?title=Features%20Cloud%20Project
[Django Documentation]: https://www.djangoproject.com/
[MySQL]: http://www.mysql.com/
