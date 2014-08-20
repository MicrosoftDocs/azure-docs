<properties title="Flask and Azure Table Storage on Azure with Python Tools 2.1 for Visual Studio" pageTitle="Flask and Azure Table Storage on Azure with Python Tools 2.1 for Visual Studio" description="Learn how to use the Python Tools for Visual Studio to create a Flask application that stores data in a Azure Table Storage database instance and can be deployed to a web site." metaKeywords="" services="" solutions="" documentationCenter="Python" authors="huvalo" videoId="" scriptId="" />

# Flask and Azure Table Storage on Azure with Python Tools 2.1 for Visual Studio 

In this tutorial, we'll create a simple polls application using one of the PTVS sample templates.

The polls application defines an abstraction for its repository, so you can easily switch between different types of repositories (In-Memory, Azure Table Storage, MongoDB).

We'll learn how to create an Azure Storage account, how to configure the application to use Azure Table Storage, and how to publish the application to an Azure Website.

+ [Prerequisites] 
+ [Create the Project]
+ [Create an Azure Storage Account]
+ [Configure the Project]
+ [Explore the Azure Table Storage]
+ [Publish to an Azure Website]
+ [Configure the Azure Website]
+ [Next steps]

## Prerequisites

 - Visual Studio 2012 or 2013
 - [Python Tools 2.1 for Visual Studio][]
 - [Python Tools 2.1 for Visual Studio Samples VSIX][]
 - [Azure SDK Tools for VS 2013][] or [Azure SDK Tools for VS 2012][]
 - [Python 2.7 32-bit][] or [Python 3.4 32-bit][]

## Create the Project

In this section, we'll create a Visual Studio project using a sample template.  We'll create a virtual environment and install required packages.  Then we'll run the application locally using the default in-memory repository.

1.  In Visual Studio, select **File**, **New Project**.

1.  The project templates from the PTVS Samples VSIX are available under **Python**, **Samples**.  Select **Polls Flask Web Project** and click OK create the project.

  	![][1]

1.  You will be prompted to install external packages.  Select **Install into a virtual environment**.

  	![][2]

1.  Select **Python 2.7** or **Python 3.4** as the base interpreter.

  	![][3]

1.  Confirm that the application works by pressing <kbd>F5</kbd>.  By default, the application uses an in-memory repository which doesn't require any configuration.  All data is lost when the web server is stopped.

1.  Click **Create Sample Polls**, then click on a poll and vote.

  	![][4]

## Create an Azure Storage Account

To use storage operations, you need an Azure storage account. You can create a storage account by following these steps.

1.  Log into the [Azure Management Portal][].

1.  At the bottom of the navigation pane, click **NEW**.

  	![][5]

1.  Click **DATA SERVICES**, then **STORAGE**, and then click **QUICK CREATE**.

  	![][6]

1.  In URL, type a subdomain name to use in the URI for the storage account.  The entry can contain from 3-24 lowercase letters and numbers. This value  becomes the host name within the URI that is used to address Blob, Queue, or Table resources for the subscription.

1.  Choose a Region/Affinity Group in which to locate the storage. If you will be using storage from your Azure application, select the same region where you will deploy your application.

1.  Optionally, you can enable geo-replication.  With geo-replication, Azure Storage now keeps your data durable in two locations. In both locations, Azure Storage constantly maintains multiple healthy replicas of your data.

1.  Click **CREATE STORAGE ACCOUNT**.

## Configure the Project

In this section, we'll configure our application to use the storage account we just created.  We'll see how to obtain connection settings from the Azure portal.  Then we'll run the application locally.

1.  In [Azure Management Portal][], click on the storage account created in the previous section.

1.  Click on **MANAGE ACCESS KEYS**.

  	![][7]

1.  In Visual Studio, right-click on your project node in Solution Explorer and select **Properties**.  Click on the **Debug** tab.

  	![][8]

1.  Set the values of environment variables required by the application in **Debug Server Command**, **Environment**.

        REPOSITORY_NAME=azuretablestorage
        STORAGE_NAME=<storage account name>
        STORAGE_KEY=<primary access key>

    This will set the environment variables when you **Start Debugging**.  If you want the variables to be set when you **Start Without Debugging**, set the same values under **Run Server Command** as well.

    Alternatively, you can define environment variables using the Windows Control Panel.  This is a better option if you want to avoid storing credentials in source code / project file.  Note that you will need to restart Visual Studio for the new environment values to be available to the application.

1.  The code that implements the Azure Table Storage repository is in **models/azuretablestorage.py**.  See the [documentation] for more information on how to use Table Service from Python.

1.  Run the application with <kbd>F5</kbd>.  Polls that are created with **Create Sample Polls** and the data submitted by voting will be serialized in Azure Table Storage.

1.  Browse to the **About** page to verify that the application is using the **Azure Table Storage** repository.

  	![][9]

## Explore the Azure Table Storage

It's easy to view and edit storage tables using Server Explorer in Visual Studio.  In this section we'll use Server Explorer to view the contents of the polls application tables.

> [WACOM.NOTE] This requires Microsoft Azure Tools to be installed, which are available as part of the [Azure SDK for .NET][].

1.  Open **Server Explorer**.  Expand **Azure**, **Storage**, your storage account, then **Tables**.

  	![][10]

1.  Double-click on the **polls** or **choices** table to view the contents of the table in a document window, as well as add/remove/edit entities.

  	![][11]

## Publish to an Azure Website

PTVS provides an easy way to deploy your web application to an Azure Website.

1.  In **Solution Explorer**, right-click on the project node and select **Publish**.

  	![][12]

1.  Click on **Microsoft Azure Websites**.

1.  Click on **New** to create a new site.

1.  Select a **Site name** and a **Region** and click **Create**.

  	![][13]

1.  Accept all other defaults and click **Publish**.

1.  Your web browser will open automatically to the published site.  If you browse to the about page, you'll see that it uses the **In-Memory** repository, not the **Azure Table Storage** repository.

    That's because the environment variables are not set on the Azure Website, so it uses the default values specified in **settings.py**.

## Configure the Azure Website

In this section, we'll configure environment variables for the site.

1.  In [Azure Management Portal][], click on the site created in the previous section.

1.  In the top menu, click on **CONFIGURE**.

  	![][14]

1.  Scroll down to the **app settings** section and set the values for **REPOSITORY\_NAME**, **STORAGE\_NAME** and **STORAGE\_KEY** as described in the section above.

  	![][15]

1. In the bottom menu, click on **SAVE**, then **RESTART** and finally **BROWSE**.

  	![][16]

1.  You should see the application working as expected, using the **Azure Table Storage** repository.

    Congratulations!

  	![][17]

## Next steps

Follow these links to learn more about Python Tools for Visual Studio, Flask and Azure Table Storage.

- [Python Tools for Visual Studio Documentation][]
  - [Web Projects][]
  - [Cloud Service Projects][]
  - [Remote Debugging on Microsoft Azure][]
- [Flask Documentation][]
- [Azure Storage][]
- [Azure SDK for Python][]
- [How to Use the Table Storage Service from Python][]


<!--Anchors-->
[Prerequisites]: #prerequisites
[Create the Project]: #create-the-project
[Create an Azure Storage Account]: #create-an-azure-storage-account
[Configure the Project]: #configure-the-project
[Explore the Azure Table Storage]: #explore-the-azure-table-storage
[Publish to an Azure Website]: #publish-to-an-azure-website
[Configure the Azure Website]: #configure-the-azure-website
[Next steps]: #next-steps

<!--Image references-->
[1]: ./media/python-ptvs-flask-table-storage/PollsFlaskNewProject.png
[2]: ./media/python-ptvs-flask-table-storage/PollsFlaskExternalPackages.png
[3]: ./media/python-ptvs-flask-table-storage/PollsCommonAddVirtualEnv.png
[4]: ./media/python-ptvs-flask-table-storage/PollsFlaskInMemoryBrowser.png
[5]: ./media/python-ptvs-flask-table-storage/PollsCommonAzurePlusNew.png
[6]: ./media/python-ptvs-flask-table-storage/PollsCommonAzureStorageCreate.png
[7]: ./media/python-ptvs-flask-table-storage/PollsCommonAzureTableStorageManageKeys.png
[8]: ./media/python-ptvs-flask-table-storage/PollsFlaskAzureTableStorageProjectDebugSettings.png
[9]: ./media/python-ptvs-flask-table-storage/PollsFlaskAzureTableStorageAbout.png
[10]: ./media/python-ptvs-flask-table-storage/PollsCommonServerExplorer.png
[11]: ./media/python-ptvs-flask-table-storage/PollsCommonServerExplorerTable.png
[12]: ./media/python-ptvs-flask-table-storage/PollsCommonPublishWebSiteDialog.png
[13]: ./media/python-ptvs-flask-table-storage/PollsCommonCreateWebSite.png
[14]: ./media/python-ptvs-flask-table-storage/PollsCommonWebSiteTopMenu.png
[15]: ./media/python-ptvs-flask-table-storage/PollsCommonWebSiteConfigureSettingsTableStorage.png
[16]: ./media/python-ptvs-flask-table-storage/PollsCommonWebSiteConfigureBottomMenu.png
[17]: ./media/python-ptvs-flask-table-storage/PollsFlaskAzureBrowser.png

<!--Link references-->
[documentation]: ../storage-python-how-to-use-table-storage/
[How to Use the Table Storage Service from Python]: ../storage-python-how-to-use-table-storage/

<!--External Link references-->
[Azure Management Portal]: https://manage.windowsazure.com
[Azure SDK for .NET]: http://azure.microsoft.com/en-us/downloads/
[Python Tools 2.1 for Visual Studio]: http://pytools.codeplex.com/releases
[Python Tools 2.1 for Visual Studio Samples VSIX]: http://pytools.codeplex.com/releases
[Azure SDK Tools for VS 2013]: http://go.microsoft.com/fwlink/p/?linkid=323510 
[Azure SDK Tools for VS 2012]: http://go.microsoft.com/fwlink/p/?linkid=323511
[Python 2.7 32-bit]: https://www.python.org/ftp/python/2.7.8/python-2.7.8.msi 
[Python 3.4 32-bit]: https://www.python.org/ftp/python/3.4.1/python-3.4.1.msi
[Python Tools for Visual Studio Documentation]: http://pytools.codeplex.com/documentation
[Flask Documentation]: http://flask.pocoo.org/
[Remote Debugging on Microsoft Azure]: http://pytools.codeplex.com/wikipage?title=Features%20Azure%20Remote%20Debugging
[Web Projects]: http://pytools.codeplex.com/wikipage?title=Features%20Web%20Project
[Cloud Service Projects]: http://pytools.codeplex.com/wikipage?title=Features%20Cloud%20Project
[Azure Storage]: http://azure.microsoft.com/en-us/documentation/services/storage/
[Azure SDK for Python]: https://github.com/Azure/azure-sdk-for-python
