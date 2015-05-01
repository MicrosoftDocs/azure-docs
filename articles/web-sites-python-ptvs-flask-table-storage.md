<properties 
	pageTitle="Flask and Azure Table Storage on Azure with Python Tools 2.1 for Visual Studio" 
	description="Learn how to use the Python Tools for Visual Studio to create a Flask web app that stores data in Azure Table Storage and deploy it to Azure App Service Web Apps." 
	services="app-service\web"
	tags="python"
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
	ms.date="04/16/2015" 
	ms.author="huguesv"/>




# Flask and Azure Table Storage on Azure with Python Tools 2.1 for Visual Studio 

In this tutorial, we'll use [Python Tools for Visual Studio] to create a simple polls web app using one of the PTVS sample templates. This tutorial is also available as a [video](https://www.youtube.com/watch?v=qUtZWtPwbTk).

The polls web app defines an abstraction for its repository, so you can easily switch between different types of repositories (In-Memory, Azure Table Storage, MongoDB).

We'll learn how to create an Azure Storage account, how to configure the web app to use Azure Table Storage, and how to publish the web app to [Azure App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714).

See the [Python Developer Center] for more articles that cover development of Azure App Service Web Apps with PTVS using Bottle, Flask and Django web frameworks, with MongoDB, Azure Table Storage, MySQL and SQL Database services. While this article focuses on App Service, the steps are similar when developing [Azure Cloud Services].

## Prerequisites

 - Visual Studio 2012 or 2013
 - [Python Tools 2.1 for Visual Studio]
 - [Python Tools 2.1 for Visual Studio Samples VSIX]
 - [Azure SDK Tools for VS 2013] or [Azure SDK Tools for VS 2012]
 - [Python 2.7 32-bit] or [Python 3.4 32-bit]

[AZURE.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Create the Project

In this section, we'll create a Visual Studio project using a sample template. We'll create a virtual environment and install required packages. Then we'll run the application locally using the default in-memory repository.

1.  In Visual Studio, select **File**, **New Project**.

1.  The project templates from the PTVS Samples VSIX are available under **Python**, **Samples**. Select **Polls Flask Web Project** and click OK to create the project.

  	![New Project Dialog](./media/web-sites-python-ptvs-flask-table-storage/PollsFlaskNewProject.png)

1.  You will be prompted to install external packages. Select **Install into a virtual environment**.

  	![External Packages Dialog](./media/web-sites-python-ptvs-flask-table-storage/PollsFlaskExternalPackages.png)

1.  Select **Python 2.7** or **Python 3.4** as the base interpreter.

  	![Add Virtual Environment Dialog](./media/web-sites-python-ptvs-flask-table-storage/PollsCommonAddVirtualEnv.png)

1.  Confirm that the application works by pressing `F5`. By default, the application uses an in-memory repository which doesn't require any configuration. All data is lost when the web server is stopped.

1.  Click **Create Sample Polls**, then click on a poll and vote.

  	![Web Browser](./media/web-sites-python-ptvs-flask-table-storage/PollsFlaskInMemoryBrowser.png)

## Create an Azure Storage Account

To use storage operations, you need an Azure storage account. You can create a storage account by following these steps.

1.  Log into the [Azure Portal].

2. Click the **New** icon on the bottom left of the portal, then click **Data + Storage** > **Storage**. Give the storage account a unique name and create a new [resource group](resource-group-overview.md) for it.

  	<!-- ![New Button](./media/web-sites-python-ptvs-flask-table-storage/PollsCommonAzurePlusNew.png) -->

	When the storage account has been created, the **Notifications** button will flash a green **SUCCESS** and the storage account's blade is open to show that it belongs to the new resource group you created.

5. Click the **Settings** part in the storage account's blade. Take note of the account name and the primary key.

	We will need this information to configure your project in the next section.

## Configure the Project

In this section, we'll configure our application to use the storage account we just created. We'll see how to obtain connection settings from the Azure portal. Then we'll run the application locally.

1.  In Visual Studio, right-click on your project node in Solution Explorer and select **Properties**. Click on the **Debug** tab.

  	![Project Debug Settings](./media/web-sites-python-ptvs-flask-table-storage/PollsFlaskAzureTableStorageProjectDebugSettings.png)

1.  Set the values of environment variables required by the application in **Debug Server Command**, **Environment**.

        REPOSITORY_NAME=azuretablestorage
        STORAGE_NAME=<storage account name>
        STORAGE_KEY=<primary access key>

    This will set the environment variables when you **Start Debugging**. If you want the variables to be set when you **Start Without Debugging**, set the same values under **Run Server Command** as well.

    Alternatively, you can define environment variables using the Windows Control Panel. This is a better option if you want to avoid storing credentials in source code / project file. Note that you will need to restart Visual Studio for the new environment values to be available to the application.

1.  The code that implements the Azure Table Storage repository is in **models/azuretablestorage.py**. See the [documentation] for more information on how to use Table Service from Python.

1.  Run the application with `F5`. Polls that are created with **Create Sample Polls** and the data submitted by voting will be serialized in Azure Table Storage.

1.  Browse to the **About** page to verify that the application is using the **Azure Table Storage** repository.

  	![Web Browser](./media/web-sites-python-ptvs-flask-table-storage/PollsFlaskAzureTableStorageAbout.png)

## Explore the Azure Table Storage

It's easy to view and edit storage tables using Server Explorer in Visual Studio. In this section we'll use Server Explorer to view the contents of the polls application tables.

> [AZURE.NOTE] This requires Microsoft Azure Tools to be installed, which are available as part of the [Azure SDK for .NET].

1.  Open **Server Explorer**. Expand **Azure**, **Storage**, your storage account, then **Tables**.

  	<!-- ![Server Explorer](./media/web-sites-python-ptvs-flask-table-storage/PollsCommonServerExplorer.png) -->

1.  Double-click on the **polls** or **choices** table to view the contents of the table in a document window, as well as add/remove/edit entities.

  	<!-- ![Table Query Results](./media/web-sites-python-ptvs-flask-table-storage/PollsCommonServerExplorerTable.png) -->

## Publish the web app to Azure App Service

The Azure .NET SDK provides an easy way to deploy your web app to Azure App Service.

1.  Click on **Microsoft Azure Web Apps**.

1.  Click on **New** to create a new web app.

1.  Fill in the following fields and click **Create**.
	-	**Web App name**
	-	**App Service plan**
	-	**Resource group**
	-	**Region**
	-	Leave **Database server** set to **No database**

  	<!-- ![Create Site on Microsoft Azure Dialog](./media/web-sites-python-ptvs-flask-table-storage/PollsCommonCreateWebSite.png) -->

1.  Accept all other defaults and click **Publish**.

1.  Your web browser will open automatically to the published web app. If you browse to the about page, you'll see that it uses the **In-Memory** repository, not the **Azure Table Storage** repository.

    That's because the environment variables are not set on the Web Apps instance in Azure App Service, so it uses the default values specified in **settings.py**.

## Configure the Web Apps instance

In this section, we'll configure environment variables for the Web Apps instance.

1.  In [Azure Portal], open the web app's blade by clicking **Browse** > **Web Apps** > your web app name.

1.  In your web app's blade, click **All Settings**, then click **Application Settings**.

  	<!-- ![Top Menu](./media/web-sites-python-ptvs-flask-table-storage/PollsCommonWebSiteTopMenu.png) -->

1.  Scroll down to the **app settings** section and set the values for **REPOSITORY\_NAME**, **STORAGE\_NAME** and **STORAGE\_KEY** as described in the section above.

  	<!-- ![App Settings](./media/web-sites-python-ptvs-flask-table-storage/PollsCommonWebSiteConfigureSettingsTableStorage.png) -->

1. Click on **SAVE**, then **RESTART** and finally **BROWSE**.

  	<!-- ![Bottom Menu](./media/web-sites-python-ptvs-flask-table-storage/PollsCommonWebSiteConfigureBottomMenu.png) -->

1.  You should see the web app working as expected, using the **Azure Table Storage** repository.

    Congratulations!

  	![Web Browser](./media/web-sites-python-ptvs-flask-table-storage/PollsFlaskAzureBrowser.png)

## Next steps

Follow these links to learn more about Python Tools for Visual Studio, Flask and Azure Table Storage.

- [Python Tools for Visual Studio Documentation]
  - [Web Projects]
  - [Cloud Service Projects]
  - [Remote Debugging on Microsoft Azure]
- [Flask Documentation]
- [Azure Storage]
- [Azure SDK for Python]
- [How to Use the Table Storage Service from Python]

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the portal](http://go.microsoft.com/fwlink/?LinkId=529715)


<!--Link references-->
[Python Developer Center]: /develop/python/
[Azure Cloud Services]: cloud-services-python-ptvs.md
[documentation]: storage-python-how-to-use-table-storage.md
[How to Use the Table Storage Service from Python]: storage-python-how-to-use-table-storage.md

<!--External Link references-->
[Azure Management Portal]: https://portal.azure.com
[Azure SDK for .NET]: http://azure.microsoft.com/downloads/
[Python Tools for Visual Studio]: http://aka.ms/ptvs
[Python Tools 2.1 for Visual Studio]: http://go.microsoft.com/fwlink/?LinkId=517189
[Python Tools 2.1 for Visual Studio Samples VSIX]: http://go.microsoft.com/fwlink/?LinkId=517189
[Azure SDK Tools for VS 2013]: http://go.microsoft.com/fwlink/?LinkId=323510
[Azure SDK Tools for VS 2012]: http://go.microsoft.com/fwlink/?LinkId=323511
[Python 2.7 32-bit]: http://go.microsoft.com/fwlink/?LinkId=517190 
[Python 3.4 32-bit]: http://go.microsoft.com/fwlink/?LinkId=517191
[Python Tools for Visual Studio Documentation]: http://pytools.codeplex.com/documentation
[Flask Documentation]: http://flask.pocoo.org/
[Remote Debugging on Microsoft Azure]: http://pytools.codeplex.com/wikipage?title=Features%20Azure%20Remote%20Debugging
[Web Projects]: http://pytools.codeplex.com/wikipage?title=Features%20Web%20Project
[Cloud Service Projects]: http://pytools.codeplex.com/wikipage?title=Features%20Cloud%20Project
[Azure Storage]: http://azure.microsoft.com/documentation/services/storage/
[Azure SDK for Python]: https://github.com/Azure/azure-sdk-for-python
