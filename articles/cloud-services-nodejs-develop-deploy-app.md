<properties 
	pageTitle="Node.js Getting Started Guide - Azure Tutorial" 
	description="Learn how to create a simple Node.js web application and deploy it to an Azure cloud service." 
	services="cloud-services" 
	documentationCenter="nodejs" 
	authors="MikeWasson" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="cloud-services" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="hero-article" 
	ms.date="02/24/2015" 
	ms.author="mwasson"/>


# Build and deploy a Node.js application to an Azure Cloud Service

> [AZURE.SELECTOR]
- [Node.js](cloud-services-nodejs-develop-deploy-app.md)
- [.NET](cloud-services-dotnet-get-started.md)

This tutorial shows how to create a simple Node.js application running 
in an Azure Cloud Service. Cloud Services are the building blocks of 
scalable cloud applications in Azure. They allow the separation and independent
management and scale-out of front-end and back-end components of your application.  Cloud Services 
provide a robust dedicated virtual machine for hosting each role reliably.

For more information on Cloud Services, and how they compare to Azure Websites and Virtual machines, see [Azure Websites, Cloud Services and Virtual Machines comparison](http://azure.microsoft.com/documentation/articles/choose-web-site-cloud-service-vm/).

>[AZURE.TIP] Looking to build a simple website? If your scenario involves just a simple website front-end, consider <a href="/documentation/articles/web-sites-nodejs-develop-deploy-mac/">using a lightweight Azure Website.</a> You can easily upgrade to a Cloud Service as your website grows and your requirements change.


By following this tutorial, you will build a simple web application hosted inside a web role. You
will use the compute emulator to test your application locally, then deploy it
using PowerShell command-line tools.

The application is a simple "hello world" application:

<p><img src="https://wacomdpsstablestorage.blob.core.windows.net/articlesmedia/demo-ppe.windowsazure.com/documentation/articles/cloud-services-nodejs-develop-deploy-app/20140107035927/node21.png" alt="A browser window displaying the hello world page. The URL indicates the page is hosted on Azure.">
</p>

## Prerequisites

> [AZURE.NOTE] This tutorial uses Azure PowerShell, which requires Windows.

- Install the Azure SDK for Node.js: <a href="http://go.microsoft.com/fwlink/?LinkId=254279">Windows installer</a> 

- Install and configure [Azure Powershell](install-configure-powershell.md).


## Create an Azure Cloud Service project

Perform the following tasks to create a new Azure Cloud Service project, along with basic Node.js scaffolding:


1. Run **Azure PowerShell** as Administrator. (From the **Start Menu** or **Start Screen**, search for **Azure PowerShell**.)

2.  Enter the following PowerShell cmdlet to create to create the project:

        New-AzureServiceProject helloworld

	![The result of the New-AzureService helloworld command](./media/cloud-services-nodejs-develop-deploy-app/node9.png)

	The **New-AzureServiceProject** cmdlet generates a basic structure for publishing a Node.js application to a Cloud Service. It contains configuration files necessary for publishing to Azure. The cmdlet also changes your working directory to the directory for the service.

	The cmdlet creates the following files:

	-   **ServiceConfiguration.Cloud.cscfg**,
        **ServiceConfiguration.Local.cscfg** and **ServiceDefinition.csdef**: 
        Azure-specific files necessary for publishing your
        application. For more information, see
        [Overview of Creating a Hosted Service for Azure][].

	-   **deploymentSettings.json**: Stores local settings that are used by
        the Azure PowerShell deployment cmdlets.

4.  Enter the following command to add a new web role:

        Add-AzureNodeWebRole
	
	![The output of the Add-AzureNodeWebRole command.](./media/cloud-services-nodejs-develop-deploy-app/node11.png)

	The **Add-AzureNodeWebRole** cmdlet creates a basic Node.js application. It also modifies the **.csfg** and **.csdef** files to add configuration entries for the new role.

	> [AZURE.NOTE] If you do not specify a role name, a default name is used. You can provide a name as the first cmdlet parameter: `Add-AzureNodeWebRole MyRole`


The Node.js app is defined in the file **server.js**, located in the directory for the web role (**WebRole1** by default). Here is the code:

	var http = require('http');
	var port = process.env.port || 1337;
	http.createServer(function (req, res) {
	    res.writeHead(200, { 'Content-Type': 'text/plain' });
	    res.end('Hello World\n');
	}).listen(port);

This code is essentially the same as the "Hello World" sample on the [nodejs.org][] website, except it uses the port number assigned by the cloud environment.


## Run the application locally in the emulator

One of the tools installed by the Azure SDK is the Azure
compute emulator, which allows you to test your application locally. The
compute emulator simulates the environment your application will run in
when it is deployed to the cloud. 

1.  Enter the following Azure PowerShell cmdlet to run your service in the emulator:

        Start-AzureEmulator -Launch

	Use the **-Launch** parameter to automatically open a browser window when the web role is running in the emulator. The browser window should display "Hello World," as shown in the screenshot below. 

	![A web browser displaying the Hello World web page](./media/cloud-services-nodejs-develop-deploy-app/node14.png)

2.  To stop the compute emulator, use the **Stop-AzureEmulator** cmdlet:
	
		Stop-AzureEmulator

## Deploy the application to Azure

	[AZURE.INCLUDE [create-account-note](../includes/create-account-note.md)]


### Download the Azure publishing settings

To deploy your application to Azure, you must first download the publishing settings for your Azure subscription. 

1.  Run the following Azure PowerShell cmdlet:

        Get-AzurePublishSettingsFile

	This will use your browser to navigate to the publish settings download page. You may be prompted to log in with a Microsoft Account. If so, use the account associated with your Azure subscription.

	Save the downloaded profile to a file location you can easily access.

2.  Run following cmdlet to import the publishing profile you downloaded:

        Import-AzurePublishSettingsFile [path to file]


	> [AZURE.NOTE] After importing the publish settings, consider deleting the downloaded .publishSettings file, because it contains information that could allow someone to access your account.
    

### Publish the application

To publish, run the **Publish-AzureServiceProject** cmdlet as follows:

    Publish-AzureServiceProject -ServiceName NodeHelloWorld -Location "East US" -Launch

- **-ServiceName** specifies the name for the deployment. This must be a unique name, otherwise the publish process will fail.

- **-Location** specifies the datacenter that the application will be hosted in. To see a list of available datacenters, use the **Get-AzureLocation** cmdlet.

- **-Launch** opens a browser window and navigates to the hosted service after deployment has completed.

After publishing succeeds, you will see a response similar to the following:

![The output of the Publish-AzureService command](./media/cloud-services-nodejs-develop-deploy-app/node19.png)

> [AZURE.NOTE]
> It can take 5 - 7 minutes for the application to deploy and become available when first published.

Once the deployment has completed, a browser window will open and navigate to the cloud service.


![A browser window displaying the hello world page. The URL indicates the page is hosted on Azure.](./media/cloud-services-nodejs-develop-deploy-app/node21.png)

Your application is now running on Azure!

The **Publish-AzureServiceProject** cmdlet performs the following steps:

1.  Creates a package to deploy. The package contains all the files in your application folder.

2.  Creates a new **storage account** if one does not exist. The Azure storage account is used to store the application package during deployment. You can safely delete the storage account after deployment is done.

3.  Creates a new **cloud service** if one does not already exist. A **cloud service** is the container in which your application is hosted when it is deployed to Azure. For more information, see [Overview of Creating a Hosted Service for Azure][].

4.  Publishes the deployment package to Azure.



## Stopping and deleting your application

After deploying your application, you may want to disable it so you can avoid extra costs. Azure bills web role instances per hour of server time consumed. Server time is consumed once your application is deployed, even if the instances are not running and are in the stopped state.

1.  In the Windows PowerShell window, stop the service deployment created in the previous section with the following cmdlet:

        Stop-AzureService

	Stopping the service may take several minutes. When the service is stopped, you receive a message indicating that it has stopped.

	![The status of the Stop-AzureService command](./media/cloud-services-nodejs-develop-deploy-app/node48.png)

2.  To delete the service, call the following cmdlet:

        Remove-AzureService

	When prompted, enter **Y** to delete the service.

	Deleting the service may take several minutes. After the service has been deleted you receive a message indicating that the service was deleted.

	![The status of the Remove-AzureService command](./media/cloud-services-nodejs-develop-deploy-app/node49.png)

	> [AZURE.NOTE] Deleting the service does not delete the storage account that was created when the service was initially published, and you will continue to be billed for storage used. For more information on deleting a storage account, see [How to Delete a Storage Account from an Azure Subscription](http://msdn.microsoft.com/library/windowsazure/hh531562.aspx).


[The Windows Start menu with the Azure SDK Node.js entry expanded]: ./media/cloud-services-nodejs-develop-deploy-app/azure-powershell-menu.png
[mkdir]: ./media/cloud-services-nodejs-develop-deploy-app/getting-started-6.png
[nodejs.org]: http://nodejs.org/
[A directory listing of the helloworld folder.]: ./media/cloud-services-nodejs-develop-deploy-app/getting-started-7.png
[Overview of Creating a Hosted Service for Azure]: http://msdn.microsoft.com/library/windowsazure/jj155995.aspx
[A directory listing of the WebRole1 folder]: ./media/cloud-services-nodejs-develop-deploy-app/getting-started-8.png
[The menu displayed when right-clicking the Azure emulator from the task bar.]: ./media/cloud-services-nodejs-develop-deploy-app/getting-started-11.png
[A browser window displaying http://www.windowsazure.com/ with the Free Trial link highlighted]: ./media/cloud-services-nodejs-develop-deploy-app/getting-started-12.png
[A browser window displaying the liveID sign in page]: ./media/cloud-services-nodejs-develop-deploy-app/getting-started-13.png
[Internet Explorer displaying the save as dialog for the publishSettings file.]: ./media/cloud-services-nodejs-develop-deploy-app/getting-started-14.png

[The full status output of the Publish-AzureService command]: ./media/cloud-services-nodejs-develop-deploy-app/node20.png
[How to Delete a Storage Account from an Azure Subscription]: https://www.windowsazure.com/manage/services/storage/how-to-manage-a-storage-account/
[powershell-menu]: ./media/cloud-services-nodejs-develop-deploy-app/azure-powershell-start.png
