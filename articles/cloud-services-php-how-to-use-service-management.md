<properties 
	pageTitle="How to use Azure service management APIs (PHP)" 
	description="Learn how to use the Azure PHP Service Management APIs to manage cloud services and other Azure applications." 
	services="web-sites" 
	documentationCenter="php" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="cloud-services" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="PHP" 
	ms.topic="article" 
	ms.date="11/17/2014" 
	ms.author="tomfitz"/>

# How to use Service Management from PHP

This guide will show you how to programmatically perform common service management tasks from PHP. The [ServiceManagementRestProxy] class in the [Azure SDK for PHP][download-SDK-PHP] supports programmatic access to much of the service management-related functionality that is available in the [management portal][management-portal] (such as **creating, updating, and deleting cloud services, deployments, storage services, and affinity groups**). This functionality can be useful in building applications that need programmatic access to service management. 

## What is Service Management
The Service Management API provides programmatic access to much of the service management functionality available through the [management portal][management-portal]. The Azure SDK for PHP allows you to manage your cloud services, storage accounts, and affinity groups.

To use the Service Management API, you will need to [create an Azure account][win-azure-account]. 

## Concepts
The Azure SDK for PHP wraps the [Azure Service Management API][svc-mgmt-rest-api], which is a REST API. All API operations are performed over SSL and mutually authenticated using X.509 v3 certificates. The management service may be accessed from within a service running in Azure, or directly over the Internet from any application that can send an HTTPS request and receive an HTTPS response.

## Create a PHP application

The only requirement for creating a PHP application that uses Azure Service Management is the referencing of classes in the Azure SDK for PHP from within your code. You can use any development tools to create your application, including Notepad.

In this guide, you will use service features which can be called within a PHP application locally, or in code running within an Azure web role, worker role, or website.

## Get the Azure Client Libraries

[AZURE.INCLUDE [get-client-libraries](../includes/get-client-libraries.md)]

## How to: Connect to service management

To connect to the Service Management endpoint, you need your Azure subscription ID and the path to a valid management certificate. You can obtain your subscription ID through the [management portal][management-portal], and you can create management certificates in a number of ways. In this guide [OpenSSL](http://www.openssl.org/) is used, which you can [download for Windows](http://www.openssl.org/related/binaries.html) and run in a console.

You actually need to create two certificates, one for the server (a `.cer` file) and one for the client (a `.pem` file). To create the `.pem` file, execute this:

	`openssl req -x509 -nodes -days 365 -newkey rsa:1024 -keyout mycert.pem -out mycert.pem`

To create the `.cer` certificate, execute this:

	`openssl x509 -inform pem -in mycert.pem -outform der -out mycert.cer`

For more information about Azure certificates, see [Overview of Certificates in Azure](http://msdn.microsoft.com/library/azure/gg981929.aspx). For a complete description of OpenSSL parameters, see the documentation at [http://www.openssl.org/docs/apps/openssl.html](http://www.openssl.org/docs/apps/openssl.html).

If you have downloaded and imported your publish settings file using the [Azure Command Line Tools][command-line-tools], you can use the `.pem` file that the tools create instead of creating your own. The tools create a `.cer` for you and upload it to Azure, and they put the corresponding `.pem` file in the `.azure` directory on your computer (in your user directory).

After you have created these files, you will need to upload the `.cer` file to Azure via the [management portal][management-portal], and you will need to make note of where you saved the `.pem` file.

After you have obtained your subscription ID, created a certificate, and uploaded the `.cer` file to Azure, you can connect to the Azure management endpoint by creating a connection string and passing it to the **createServiceManagementService** method on the **ServicesBuilder** class:

	require_once 'vendor\autoload.php';
	
	use WindowsAzure\Common\ServicesBuilder;

	$conn_string = "SubscriptionID=<your_subscription_id>;CertificatePath=<path_to_.pem_certificate>";

	$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);

In the example above, `$serviceManagementRestProxy` is a [ServiceManagementRestProxy] object. The **ServiceManagementRestProxy** class is the primary class used to manage Azure services. 

## How to: List Available Locations

To list the locations that are available for hosting services, use the **ServiceManagementRestProxy->listLocations** method:

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;

	try{
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
	
		$result = $serviceManagementRestProxy->listLocations();
	
		$locations = $result->getLocations();

		foreach($locations as $location){
		      echo $location->getName()."<br />";
		}
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

When you create a cloud service, storage service, or affinity group, you will need to provide a valid location. The **listLocations** method will always return an up-to-date list of the currently available locations. As of this writing, the available locations are:

- Anywhere US 
- Anywhere Europe 
- West Europe 
- Anywhere Asia 
- Southeast Asia 
- East Asia 
- North Central US 
- North Europe 
- South Central US 
- West US 
- East US

In the code examples that follow, locations are passed to methods as strings. However, you can also pass locations as enumerations using the <code>WindowsAzure\ServiceManagement\Models\Locations</code> class. For example, instead of passing "West US" to a method that accepts a location, you could pass <code>Locations::WEST_US</code>.

## How to: Create a cloud service

When you create an application and run it in Azure, the code and configuration together are called an Azure [cloud service]  - known as a *hosted service* in earlier Azure releases. The **createHostedServices** method allows you to create a new hosted service by providing a hosted service name (which must be unique in Azure), a label (the base 64-endcoded hosted service name), and a **CreateServiceOptions** object. The [CreateServiceOptions] object allows you to set the location *or* the affinity group for your service. 

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\ServiceManagement\Models\CreateServiceOptions;
	use WindowsAzure\Common\ServiceException;

	try{
		// Create REST proxy.
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
		
        $name = "myhostedservice";
        $label = base64_encode($name);
        $options = new CreateServiceOptions();
        $options->setLocation('West US');
		// Instead of setLocation, you can use setAffinityGroup
		// to set an affinity group.

        $result = $serviceManagementRestProxy->createHostedService($name, $label, $options);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

You can list all the hosted services for your subscription with the **listHostedServices** method, which returns a [ListHostedServicesResult] object. Calling the **getHostedServices** method then allows you to loop through an array of [HostedServices] objects and retrieve service properties:

	$listHostedServicesResult = $serviceManagementRestProxy->listHostedServices();

	$hosted_services = $listHostedServicesResult->getHostedServices();

	foreach($hosted_services as $hosted_service){
		echo "Service name: ".$hosted_service->getName()."<br />";
		echo "Management URL: ".$hosted_service->getUrl()."<br />";
		echo "Affinity group: ".$hosted_service->getAffinityGroup()."<br />";
		echo "Location: ".$hosted_service->getLocation()."<br />";
		echo "------<br />";
		}

If you want to get information about a particular hosted service, you can do so by passing the hosted service name to the **getHostedServiceProperties** method:

	$getHostedServicePropertiesResult = $serviceManagementRestProxy->getHostedServiceProperties("myhostedservice");
		
	$hosted_service = $getHostedServicePropertiesResult->getHostedService();
		
	echo "Service name: ".$hosted_service->getName()."<br />";
	echo "Management URL: ".$hosted_service->getUrl()."<br />";
	echo "Affinity group: ".$hosted_service->getAffinityGroup()."<br />";
	echo "Location: ".$hosted_service->getLocation()."<br />";

After you have created a cloud service, you can deploy your code to the service with the [createDeployment](#CreateDeployment) method.

##<a id="DeleteCloudService"></a>How to: Delete a cloud service

You can delete a cloud service by passing the service name to the **deleteHostedService** method:

	$serviceManagementRestProxy->deleteHostedService("myhostedservice");

Note that before you can delete a service, all deployments for the the service must first be deleted. (See [How to: Delete a deployment](#DeleteDeployment) for details.)

## How to: Create a deployment

The **createDeployment** method uploads a new [service package] and creates a new deployment in the staging or production environment. The parameters for this method are as follows:

* **$name**: The name of the hosted service.
* **$deploymentName**: The name of the deployment.
* **$slot**: An enumeration indicating the staging or production slot.
* **$packageUrl**: The URL for the deployment package (a .cspgk file). The package file must be stored in an Azure Blob Storage account under the same subscription as the hosted service to which the package is being uploaded. You can create a deployment package with the [Azure PowerShell cmdlets], or with the [cspack commandline tool].
* **$configuration**: The service configuration file (.cscfg file).
* **$label**: The base 64-encoded hosted service name.

The following example creates a new deployement in the production slot of a hosted service called `myhostedservice`:


	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\ServiceManagement\Models\DeploymentSlot;
	use WindowsAzure\Common\ServiceException;

	try{
		// Create REST proxy.
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
		
        $name = "myhostedservice";
		$deploymentName = "v1";
        $slot = DeploymentSlot::PRODUCTION;
		$packageUrl = "URL_for_.cspkg_file";
		$configuration = base64_encode(file_get_contents('path_to_.cscfg_file'));
		$label = base64_encode($name);

        $result = $serviceManagementRestProxy->createDeployment($name,
														 $deploymentName,
														 $slot,
														 $packageUrl,
														 $configuration,
														 $label);
		
		$status = $serviceManagementRestProxy->getOperationStatus($result);
		echo "Operation status: ".$status->getStatus()."<br />";
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

Note in the example above that the status of the **createDeployment** operation can be retrieved by passing the result returned by **createDeployment** to the **getOperationStatus** method.

You can access deployment properties with the **getDeployment** method. The following example retrieves a deployment by specifying the deployment slot in the [GetDeploymentOptions] object, but you could instead specify the deployment name. The example also iterates through all the instances for the deployment:

	$options = new GetDeploymentOptions();
	$options->setSlot(DeploymentSlot::PRODUCTION);
		
	$getDeploymentResult = $serviceManagementRestProxy->getDeployment("myhostedservice", $options);
	$deployment = $getDeploymentResult->getDeployment();

	echo "Name: ".$deployment->getName()."<br />";
	echo "Slot: ".$deployment->getSlot()."<br />";
	echo "Private ID: ".$deployment->getPrivateId()."<br />";
	echo "Status: ".$deployment->getStatus()."<br />";
	echo "Instances: <br />";
	foreach($deployment->getroleInstanceList() as $roleInstance){
		echo "Instance name: ".$roleInstance->getInstanceName()."<br />";
		echo "Instance status: ".$roleInstance->getInstanceStatus()."<br />";
		echo "Instance size: ".$roleInstance->getInstanceSize()."<br />";
	}
	echo "------<br />";

## How to: Update a deployment

A deployment can be updated by using the **changeDeploymentConfiguration** method or the **updateDeploymentStatus** method.

The **changeDeploymentConfiguration** method allows you to upload a new service configuration (`.cscfg`) file, which will change any of several service settings (including the number of instances in a deployment). For more information, see [Azure Service Configuration Schema (.cscfg)]. The following example demonstrates how to upload a new service configuration file:

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\ServiceManagement\Models\ChangeDeploymentConfigurationOptions;
	use WindowsAzure\ServiceManagement\Models\DeploymentSlot;
	use WindowsAzure\Common\ServiceException;

	try{
		// Create REST proxy.
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
		
        $name = "myhostedservice";
		$configuration = base64_encode(file_get_contents('path to .cscfg file'));
		$options = new ChangeDeploymentConfigurationOptions();
		$options->setSlot(DeploymentSlot::PRODUCTION);

        $result = $serviceManagementRestProxy->changeDeploymentConfiguration($name, $configuration, $options);
		
		$status = $serviceManagementRestProxy->getOperationStatus($result);
		echo "Operation status: ".$status->getStatus()."<br />";
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

Note in the example above that the status of the **changeDeploymentConfiguration** operation can be retrieved by passing the result returned by **changeDeploymentConfiguration** to the **getOperationStatus** method.

The **updateDeploymentStatus** method allows you to set a deployment status to RUNNING or SUSPENDED. The following example demonstrates how to set the status to RUNNING for a deployment in the production slot of a hosted service called `myhostedservice`:

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\ServiceManagement\Models\DeploymentStatus;
	use WindowsAzure\ServiceManagement\Models\DeploymentSlot;
	use WindowsAzure\ServiceManagement\Models\GetDeploymentOptions;
	use WindowsAzure\Common\ServiceException;
	
	try{
		// Create REST proxy.
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
		
		$options = new GetDeploymentOptions();
		$options->setSlot(DeploymentSlot::PRODUCTION);
		
        $result = $serviceManagementRestProxy->updateDeploymentStatus("myhostedservice", DeploymentStatus::RUNNING, $options);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

## How to: Move deployments between staging and production

Azure provides two deployment environments: staging and production. Typically a service is deployed to the staging environment to test it before deploying the service to the production environment. When it is time to promote the service in staging to the production environment, you can do so without redeploying the service. This can be done by swapping the deployments. (For more information on swapping deployments, see [Overview of Managing Deployments in Azure].)

The following example shows how to use the **swapDeployment** method to swap two deployments (with deployment names `v1` and `v2`). In the example, prior to calling **swapDeployment**, deployment `v1` is in the production slot and deployment `v2` is in the staging slot. After calling **swapDeployment**, `v2` is in production and `v1` is in staging.  

	require_once 'vendor\autoload.php';	

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;

	try{
		// Create REST proxy.
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
		
		$result = $serviceManagementRestProxy->swapDeployment("myhostedservice", "v2", "v1");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

## How to: Delete a deployment

To delete a deployment, use the **deleteDeployment** method. The following example shows how to delete a deployment in the staging environment by using the **setSlot** method on a [GetDeploymentOptions] object, then passing it to **deleteDeployment**. Instead of specifying a deployment by slot, you can use the **setName** method on the [GetDepolymentOptions] class to specify a deployment by deployment name.

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\ServiceManagement\Models\GetDeploymentOptions;
	use WindowsAzure\ServiceManagement\Models\DeploymentSlot;
	use WindowsAzure\Common\ServiceException;

	try{
		// Create REST proxy.
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
		
		$options = new GetDeploymentOptions();
		$options->setSlot(DeploymentSlot::STAGING);
		
		$result = $serviceManagementRestProxy->deleteDeployment("myhostedservice", $options);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

## How to: Create a storage service

A [storage service] gives you access to Azure [Blobs][azure-blobs], [Tables][azure-tables], and [Queues][azure-queues]. To create a storage service, you need a name for the service (between 3 and 24 lowercase characters and unique within Azure), a label (a base-64 encoded name for the service, up to 100 characters), and either a location or an affinity group. Providing a description for the service is optional. The location, affinity group, and description are set in a [CreateServiceOptions] object, which is passed to the **createStorageService** method. The following example shows how to create a storage service by specifying a location. If you want to use an affinity group, you have to create an affinity group first (see [How to: Create an affinity group](#CreateAffinityGroup)) and set it with the **CreateServiceOptions->setAffinityGroup** method.

	require_once 'vendor\autoload.php';
	 
	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\ServiceManagement\Models\CreateServiceOptions;
	use WindowsAzure\Common\ServiceException;
	 
	 
	try{
		// Create REST proxy.
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
		
        $name = "mystorageaccount";
        $label = base64_encode($name);
        $options = new CreateServiceOptions();
        $options->setLocation('West US');
		$options->setDescription("My storage account description.");

        $result = $serviceManagementRestProxy->createStorageService($name, $label, $options);

		$status = $serviceManagementRestProxy->getOperationStatus($result);
		echo "Operation status: ".$status->getStatus()."<br />";
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

Note in the example above that the status of the **createStorageService** operation can be retrieved by passing the result returned by **createStorageService** to the **getOperationStatus** method.  

You can list your storage accounts and their properties with the **listStorageServices** method:

	// Create REST proxy.
	$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
	$getStorageServicesResult = $serviceManagementRestProxy->listStorageServices();
	$storageServices = $getStorageServicesResult->getStorageServices();

	foreach($storageServices as $storageService){
		echo "Service name: ".$storageService->getName()."<br />";
		echo "Service URL: ".$storageService->getUrl()."<br />";
		echo "Affinity group: ".$storageService->getAffinityGroup()."<br />";
		echo "Location: ".$storageService->getLocation()."<br />";
		echo "------<br />";
	}

## How to: Delete a storage service

You can delete a storage service by passing the storage service name to the **deleteStorageService** method. Deleting a storage service will delete all data stored in the service (blobs, tables and queues).

	require_once 'vendor\autoload.php';
	
	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;

	try{
		// Create REST proxy.
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
		
		$serviceManagementRestProxy->deleteStorageService("mystorageservice");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

## How to: Create an affinity group

An affinity group is a logical grouping of Azure services that tells Azure to locate the services for optimized performance. For example, you might create an affinity group in the “West US” location, then create a [cloud Service](#CreateCloudService) in that affinity group. If you then create a storage service in the same affinity group, Azure knows to put it in the “West US” location and optimize within the data center for the best performance with the cloud services in the same affinity group.

To create an affinity group, you need a name, label (the base 64-encoded name), and location. You can optionally provide a description:

	require_once 'vendor\autoload.php';
	
	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\ServiceManagement\Models\CreateAffinityGroupOptions;
	use WindowsAzure\Common\ServiceException;
	 
	try{
		// Create REST proxy.
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
		
        $name = "myAffinityGroup";
        $label = base64_encode($name);
        $location = "West US";

        $options = new CreateAffinityGroupOptions();
		$options->setDescription = "My affinity group description.";
		
        $serviceManagementRestProxy->createAffinityGroup($name, $label, $location, $options);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

After you have created an affinity group, you can specify the group (instead of a location) when [creating a storage service](#CreateStorageService).

You can list affinity groups and inspect their properties by calling the  **listAffinityGroups** method, then calling the appropriate methods on the [AffinityGroup] class:

	$result = $serviceManagementRestProxy->listAffinityGroups();
	
	$groups = $result->getAffinityGroups();

	foreach($groups as $group){
		echo "Name: ".$group->getName()."<br />";
		echo "Description: ".$group->getDescription()."<br />";
		echo "Location: ".$group->getLocation()."<br />";
		echo "------<br />";
	}

## How to: Delete an affinity group
	
You can delete an affinity group by passing the group name to the **deleteAffinityGroup** method. Note that before you can delete an affinity group, the affinity group must be disassociated from any services (or services that use the affintiy group must be deleted).

	require_once 'vendor\autoload.php';
	
	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;

	try{
		// Create REST proxy.
		$serviceManagementRestProxy = ServicesBuilder::getInstance()->createServiceManagementService($conn_string);
		
		// An affinity group must be disassociated from all services 
		// before it can be deleted.
		$serviceManagementRestProxy->deleteAffinityGroup("myAffinityGroup");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/library/windowsazure/ee460801
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

[ServiceManagementRestProxy]: https://github.com/WindowsAzure/azure-sdk-for-php/blob/master/WindowsAzure/ServiceManagement/ServiceManagementRestProxy.php
[management-portal]: https://manage.windowsazure.com/
[svc-mgmt-rest-api]: http://msdn.microsoft.com/library/windowsazure/ee460799.aspx
[win-azure-account]: /pricing/free-trial/
[storage-account]: storage-create-storage-account.md

[download-SDK-PHP]: php-download-sdk.md
[command-line-tools]: virtual-machines-command-line-tools.md
[Composer]: http://getcomposer.org/
[ServiceManagementSettings]: https://github.com/WindowsAzure/azure-sdk-for-php/blob/master/WindowsAzure/ServiceManagement/ServiceManagementSettings.php

[cloud service]: cloud-services-what-is.md
[CreateServiceOptions]: https://github.com/WindowsAzure/azure-sdk-for-php/blob/master/WindowsAzure/ServiceManagement/Models/CreateServiceOptions.php
[ListHostedServicesResult]: https://github.com/WindowsAzure/azure-sdk-for-php/blob/master/WindowsAzure/ServiceManagement/Models/ListHostedServicesResult.php

[service package]: http://msdn.microsoft.com/library/windowsazure/gg433093
[Azure PowerShell cmdlets]: install-configure-powershell.md
[cspack commandline tool]: http://msdn.microsoft.com/library/windowsazure/gg432988.aspx
[GetDeploymentOptions]: https://github.com/WindowsAzure/azure-sdk-for-php/blob/master/WindowsAzure/ServiceManagement/Models/GetDeploymentOptions.php
[ListHostedServicesResult]: https://github.com/WindowsAzure/azure-sdk-for-php/blob/master/WindowsAzure/ServiceManagement/Models/GetDeploymentOptions.php

[Overview of Managing Deployments in Azure]: http://msdn.microsoft.com/library/windowsazure/hh386336.aspx
[storage service]: storage-whatis-account.md
[azure-blobs]: storage-php-how-to-use-blobs.md
[azure-tables]: storage-php-how-to-use-table-storage.md
[azure-queues]: storage-php-how-to-use-queues.md
[AffinityGroup]: https://github.com/WindowsAzure/azure-sdk-for-php/blob/master/WindowsAzure/ServiceManagement/Models/AffinityGroup.php


[Azure Service Configuration Schema (.cscfg)]: http://msdn.microsoft.com/library/windowsazure/ee758710.aspx
