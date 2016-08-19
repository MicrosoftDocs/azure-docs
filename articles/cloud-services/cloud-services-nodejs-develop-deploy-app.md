<properties
	pageTitle="Node.js Getting Started Guide | Microsoft Azure"
	description="Learn how to create a simple Node.js web application and deploy it to an Azure cloud service."
	services="cloud-services"
	documentationCenter="nodejs"
	authors="rmcmurray"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="cloud-services"
	ms.workload="tbd"
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs"
	ms.topic="hero-article"
	ms.date="08/11/2016" 
	ms.author="robmcm"/>

# Build and deploy a Node.js application to an Azure Cloud Service

> [AZURE.SELECTOR]
- [Node.js](cloud-services-nodejs-develop-deploy-app.md)
- [.NET](cloud-services-dotnet-get-started.md)

This tutorial shows how to create a simple Node.js application running in an Azure Cloud Service. Cloud Services are the building blocks of scalable cloud applications in Azure. They allow the separation and independent management and scale-out of front-end and back-end components of your application.  Cloud Services provide a robust dedicated virtual machine for hosting each role reliably.

For more information on Cloud Services, and how they compare to Azure Websites and Virtual machines, see [Azure Websites, Cloud Services and Virtual Machines comparison].

>[AZURE.TIP] Looking to build a simple website? If your scenario involves just a simple website front-end, consider [using a lightweight web app]. You can easily upgrade to a Cloud Service as your web app grows and your requirements change.

By following this tutorial, you will build a simple web application hosted inside a web role. You will use the compute emulator to test your application locally, then deploy it using PowerShell command-line tools.

The application is a simple "hello world" application:

![A web browser displaying the Hello World web page][A web browser displaying the Hello World web page]

## Prerequisites

> [AZURE.NOTE] This tutorial uses Azure PowerShell, which requires Windows.

- Install and configure [Azure Powershell].
- Download and install the [Azure SDK for .NET 2.7]. In the install setup, select:
    - MicrosoftAzureAuthoringTools
    - MicrosoftAzureComputeEmulator


## Create an Azure Cloud Service project

Perform the following tasks to create a new Azure Cloud Service project, along with basic Node.js scaffolding:

1. Run **Windows PowerShell** as Administrator; from the **Start Menu** or **Start Screen**, search for **Windows PowerShell**.

2. [Connect PowerShell] to your subscription.

3. Enter the following PowerShell cmdlet to create to create the project:

        New-AzureServiceProject helloworld

	![The result of the New-AzureService helloworld command][The result of the New-AzureService helloworld command]

	The **New-AzureServiceProject** cmdlet generates a basic structure for publishing a Node.js application to a Cloud Service. It contains configuration files necessary for publishing to Azure. The cmdlet also changes your working directory to the directory for the service.

	The cmdlet creates the following files:

	-   **ServiceConfiguration.Cloud.cscfg**,
        **ServiceConfiguration.Local.cscfg** and **ServiceDefinition.csdef**:
        Azure-specific files necessary for publishing your
        application. For more information, see
        [Overview of Creating a Hosted Service for Azure].

	-   **deploymentSettings.json**: Stores local settings that are used by
        the Azure PowerShell deployment cmdlets.

4.  Enter the following command to add a new web role:

        Add-AzureNodeWebRole

	![The output of the Add-AzureNodeWebRole command][The output of the Add-AzureNodeWebRole command]

	The **Add-AzureNodeWebRole** cmdlet creates a basic Node.js application. It also modifies the **.csfg** and **.csdef** files to add configuration entries for the new role.

	> [AZURE.NOTE] If you do not specify a role name, a default name is used. You can provide a name as the first cmdlet parameter: `Add-AzureNodeWebRole MyRole`

The Node.js app is defined in the file **server.js**, located in the directory for the web role (**WebRole1** by default). Here is the code:

	var http = require('http');
	var port = process.env.port || 1337;
	http.createServer(function (req, res) {
	    res.writeHead(200, { 'Content-Type': 'text/plain' });
	    res.end('Hello World\n');
	}).listen(port);

This code is essentially the same as the "Hello World" sample on the [nodejs.org] website, except it uses the port number assigned by the cloud environment.

## Deploy the application to Azure

	[AZURE.INCLUDE [create-account-note](../../includes/create-account-note.md)]

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

To publish, run the following commands:

  	$ServiceName = "NodeHelloWorld" + $(Get-Date -Format ('ddhhmm'))   
	Publish-AzureServiceProject -ServiceName $ServiceName  -Location "East US" -Launch

- **-ServiceName** specifies the name for the deployment. This must be a unique name, otherwise the publish process will fail. The **Get-Date** command tacks on a date/time string that should make the name unique.

- **-Location** specifies the datacenter that the application will be hosted in. To see a list of available datacenters, use the **Get-AzureLocation** cmdlet.

- **-Launch** opens a browser window and navigates to the hosted service after deployment has completed.

After publishing succeeds, you will see a response similar to the following:

![The output of the Publish-AzureService command][The output of the Publish-AzureService command]

> [AZURE.NOTE]
> It can take several minutes for the application to deploy and become available when first published.

Once the deployment has completed, a browser window will open and navigate to the cloud service.

![A browser window displaying the hello world page; the URL indicates the page is hosted on Azure.][A browser window displaying the hello world page; the URL indicates the page is hosted on Azure.]

Your application is now running on Azure.

The **Publish-AzureServiceProject** cmdlet performs the following steps:

1.  Creates a package to deploy. The package contains all the files in your application folder.

2.  Creates a new **storage account** if one does not exist. The Azure storage account is used to store the application package during deployment. You can safely delete the storage account after deployment is done.

3.  Creates a new **cloud service** if one does not already exist. A **cloud service** is the container in which your application is hosted when it is deployed to Azure. For more information, see [Overview of Creating a Hosted Service for Azure].

4.  Publishes the deployment package to Azure.


## Stopping and deleting your application

After deploying your application, you may want to disable it so you can avoid extra costs. Azure bills web role instances per hour of server time consumed. Server time is consumed once your application is deployed, even if the instances are not running and are in the stopped state.

1.  In the Windows PowerShell window, stop the service deployment created in the previous section with the following cmdlet:

        Stop-AzureService

	Stopping the service may take several minutes. When the service is stopped, you receive a message indicating that it has stopped.

	![The status of the Stop-AzureService command][The status of the Stop-AzureService command]

2.  To delete the service, call the following cmdlet:

        Remove-AzureService

	When prompted, enter **Y** to delete the service.

	Deleting the service may take several minutes. After the service has been deleted you receive a message indicating that the service was deleted.

	![The status of the Remove-AzureService command][The status of the Remove-AzureService command]

	> [AZURE.NOTE] Deleting the service does not delete the storage account that was created when the service was initially published, and you will continue to be billed for storage used. For more information on deleting a storage account, see [How to Delete a Storage Account from an Azure Subscription].

## Next steps

For more information, see the [Node.js Developer Center].

<!-- URL List -->

[Azure Websites, Cloud Services and Virtual Machines comparison]: ../app-service-web/choose-web-site-cloud-service-vm.md
[using a lightweight web app]: ../app-service-web/web-sites-nodejs-develop-deploy-mac.md">
[Azure Powershell]: ../powershell-install-configure.md
[Azure SDK for .NET 2.7]: http://www.microsoft.com/en-us/download/details.aspx?id=48178
[Connect PowerShell]: ../powershell-install-configure.md#how-to-connect-to-your-subscription
[nodejs.org]: http://nodejs.org/
[How to Delete a Storage Account from an Azure Subscription]: ../storage/how-to-manage-a-storage-account.md
[Overview of Creating a Hosted Service for Azure]: https://azure.microsoft.com/documentation/services/cloud-services/
[Node.js Developer Center]: https://azure.microsoft.com/develop/nodejs/

<!-- IMG List -->

[The result of the New-AzureService helloworld command]: ./media/cloud-services-nodejs-develop-deploy-app/node9.png
[The output of the Add-AzureNodeWebRole command]: ./media/cloud-services-nodejs-develop-deploy-app/node11.png
[A web browser displaying the Hello World web page]: ./media/cloud-services-nodejs-develop-deploy-app/node14.png
[The output of the Publish-AzureService command]: ./media/cloud-services-nodejs-develop-deploy-app/node19.png
[The full status output of the Publish-AzureService command]: ./media/cloud-services-nodejs-develop-deploy-app/node20.png
[A browser window displaying the hello world page; the URL indicates the page is hosted on Azure.]: ./media/cloud-services-nodejs-develop-deploy-app/node21.png
[The status of the Stop-AzureService command]: ./media/cloud-services-nodejs-develop-deploy-app/node48.png
[The status of the Remove-AzureService command]: ./media/cloud-services-nodejs-develop-deploy-app/node49.png
