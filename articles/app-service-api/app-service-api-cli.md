<properties
	pageTitle="The Azure CLI and API Apps | Microsoft Azure"
	description="How to use the Microsoft Azure Command-line Interface (CLI) for Mac, Linux, and Windows with Azure API Apps."
	editor="jimbe"
	manager="wpickett"
	documentationCenter=""
	authors="tdykstra"
	services="app-service\api"/>

<tags
	ms.service="app-service-api"
	ms.workload="web"
	ms.tgt_pltfrm="command-line-interface"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/20/2015"
	ms.author="tdykstra"/>

# The Azure Command-line Interface (CLI) and API apps

This article shows how to create, manage, and delete API apps in Azure App Service, using the Azure Command-Line Interface (CLI) for Mac, Linux, and Windows. 

## Prerequisites

This article assumes you have installed the Azure CLI and know how to perform basic tasks. For an introduction to the CLI, see [Install and Configure the Azure CLI](../xplat-cli-install.md). 

> [AZURE.NOTE] The instructions for [connecting to an Azure subscription ](../xplat-cli-connect.md) offer two alternatives:  log in using a work or school account, and download a *.publishsettings* file. For API apps, the *.publishsettings* file authentication method will not work. This is because you have to use Resource Management mode (introduced in the next section) to work with API apps, and the *.publishsettings* file authentication method doesn't work with Resource Manager. 

## Enable Resource Management mode

The CLI can be used in [Service Management (asm)](../virtual-machines/virtual-machines-command-line-tools.md) mode or [Resource Management (arm)](../xplat-cli-azure-resource-manager.md) mode. For API apps you have to use Resource Management mode.  Because `arm` mode is not enabled by default, use the `config mode arm` command to enable it.

	azure config mode arm

## List commands available for working with API apps

To see all the commands currently available for working with API apps, run the `apiapp` command.

	azure apiapp

## List all API apps in a subscription or resource group

To list all the API apps you have in your subscription, run the `apiapp list` command with no parameters.

	azure apiapp list

The list shows the resource group, API app name, package ID, and URL of each API app.

	info:    Executing command apiapp list
	info:    Listing ApiApps
	data:    Resource Group  Name           Package Id        Url                                                                       
	data:    --------------  -------------  ----------------  --------------------------------------------------------------------------
	data:    mygroup         SimpleDropbox  Microsoft.ApiApp  https://microsoft-apiappf1bbba377c6d4aa1f03146cadd6.azurewebsites.net
	info:    apiapp list command OK

To limit the list to a specified resource group, add the group (`-g`) parameter.

	azure apiapp list -g <resource group name>

For example:

	azure apiapp list -g mygroup

To add API app version and access level information to the list, add the details (`-d`) parameter.

	azure apiapp list -d

The `list` output with the additional fields looks like this example:

	info:    Executing command apiapp list
	info:    Listing ApiApps
	data:    Resource Group  Name           Package Id     Version  Auth                 Url                                                                       
	data:    --------------  -------------  -------------  -------  -------------------  --------------------------------------------------------------------------
	data:    mygroup         SimpleDropbox  SimpleDropbox  1.0.0    PublicAuthenticated  https://microsoft-apiappf1bbba377cbd2a3aa1f03146c6.azurewebsites.net
	info:    apiapp list command OK

### List details about an API app

To list details for one API app, use the `apiapp show` command with the group (`-g`) and API app name (`-n`) parameters.

	azure apiapp show -g <resource group name> -n <API app name>

For example:

	azure apiapp show -g mygroup -n SimpleDropbox

The output looks like this:

	info:    Executing command apiapp show
	info:    Getting ApiApp
	data:    Name:              SimpleDropbox
	data:    Location:          West US
	data:    Resource Group:    mygroup
	data:    Package Id:        SimpleDropbox
	data:    Package Version:   1.0.0
	data:    Update Policy:     Disabled
	data:    Access Level:      PublicAuthenticated
	data:    Hosting site name: microsoft-apiappf1bbba377c6d4bd2a36cadd6
	data:    Gateway name:      SD1aeb4ae60b7cb4f3d966dfa43b6607f30
	info:    apiapp show command OK

## Create an API app

There are two ways to create an API app. You can use imperative CLI commands to create Azure resources individually, or you can use declarative syntax in a template to define all of the required resources together and deploy that template with a CLI command. For the declarative approach, see [Next steps](#next-steps).

To create an API app using the imperative approach, perform the following steps:

1. Choose a valid location
1. Create or find a resource group to use
2. Create or find an App Service plan to use
4. Create the API app

### Choose a valid location

When you create a resource group, you need to specify a location. Here are some of the locations that are valid for API apps.

* East US
* West US
* South Central US
* North Europe
* East Asia
* Japan East
* West Europe
* Southeast Asia
* Japan West
* North Central US
* Central US
* Brazil South
* East US 2

To get a complete and up-to-date list of locations, use the `location list` command, and see the `Microsoft.AppService/apiapps` resource provider line.

	azure location list

Here is sample output from the `location list` command.

	info:    Executing command location list
	info:    Getting Resource Providers
	data:    Name                                                                Location                                                                                                                                                   
	data:    ------------------------------------------------------------------  -----------------------------------------------------------------------------------------------------------------------------------------------------------
	data:    Microsoft.ApiManagement/service                                     East US,North Central US,South Central US,West US,North Europe,West Europe,East Asia,Southeast Asia,Japan East,Japan West,Brazil South                     
	data:    Microsoft.AppService/apiapps                                        East US,West US,South Central US,North Europe,East Asia,Japan East,West Europe,Southeast Asia,Japan West,North Central US,Central US,Brazil South,East US 2
	data:    Microsoft.AppService/appIdentities                                  East US,West US,South Central US,North Europe,East Asia,Japan East,West Europe,Southeast Asia,Japan West,North Central US,Central US,Brazil South,East US 2
	info:    location list command OK

### Create or find a resource group to use

To create a resource group use the `group create` command with the name (`n`) and location (`l`) parameters.

	azure group create -n <name> -l <location>

For example:

	azure group create -n "mygroup" -l "West US"

To find an existing resource group, use the `group list` command, and choose a resource group in a location valid for API apps.

	azure group list

### Create or find an App Service plan to use

To create an App Service plan, use the `resource create` command and use the resource type parameter (`-r`) to specify that the type of resource you want to create is an App Service plan.

	azure resource create -g <resource group> -n <app service plan name> -r "Microsoft.Web/serverfarms" -l <location> -o <api version> -p "{\"sku\": {\"tier\": \"<pricing tier>\"}, \"numberOfWorkers\" : <number of workers>, \"workerSize\": \"<worker size>\"}"
	
For example:

	azure resource create -g mygroup -n myplan -r "Microsoft.Web/serverfarms" -l "West US" -o "2015-06-01" -p "{\"sku\": {\"tier\": \"Standard\"}, \"numberOfWorkers\" : 1, \"workerSize\": \"Small\"}"

The JSON string for the `properties` (`-p`) parameter is required due to some recent changes in the REST API; in the future the `-p` parameter will be optional.

The sample command specifies the latest API version as of the date this article was written. To check if a later version is available, use the `provider show` command and see the `apiVersions` array for the `sites` object in the `resourceTypes` array.

	azure provider show -n Microsoft.Web --json
   
Here is a sample of the `sites` object in the command output.

	{
	  "resourceTypes": [
	    {
	      "apiVersions": [
	        "2015-06-01",
	        "2015-05-01",
	        "2015-04-01",
	        "2014-04-01"
	      ],
	      "locations": [
	        "East Asia",
	        "East US",
	        "Japan East",
	        "Japan West",
	        "North Europe",
	        "West Europe",
	        "West US",
	        "Southeast Asia",
	        "Central US",
	        "East US 2"
	      ],
	      "properties": {},
	      "name": "sites"
	    }

To list existing App Service plans, use the `resource list` command and specify App Service plan as the resource type by using the `-r` parameter.

	azure resource list -r Microsoft.Web/serverfarms

The output looks like this:

	info:    Executing command resource list
	info:    Listing resources
	data:    Id                                                                                                                                           Name             Resource Group          Type                       Parent  Location  Tags
	data:    -------------------------------------------------------------------------------------------------------------------------------------------  ---------------  ----------------------  -------------------------  ------  --------  ----
	data:    /subscriptions/aeb4ae60-b7cb-4f3d-966d-fa43b6607f30/resourceGroups/ContosoAdsGroup/providers/Microsoft.Web/serverFarms/ContosoAdsPlan        ContosoAdsPlan   ContosoAdsGroup         Microsoft.Web/serverFarms          westus    null
	info:    resource list command OK

### Create an empty (custom) API app

To create an empty API app (one that you will write the code for yourself), use the `apiapp create` command and specify the `Microsoft.ApiApp` Nuget package (`-u` parameter).

	azure apiapp create -g <resource group name> -n <API app name> -p <app service plan name> -u Microsoft.ApiApp

For example:

	azure apiapp create -g mygroup -n newapiapp -p myplan -u Microsoft.ApiApp

The output reports progress as the API app is created.

	info:    Executing command apiapp create
	info:    Checking resource group and app service plan
	info:    Getting package metadata
	info:    Creating deployment
	info:    Waiting for deployment completion
	info:    Deployment started:
	data:    Subscription Id: aeb4ae60-b7cb-4f3d-966d-fa43b6607f30
	data:    Resource Group:  mygroup
	data:    Deployment Name: AppServiceDeployment_f67fa710-d565-43cf-8c9c-
	                          d515dd2eb903
	data:    Correlation Id:  a7894287-c585-46d5-96a4-feac4b2f48c6
	data:    Timestamp:       2015-07-21T23:20:12.8858274Z
	data:    
	data:    Operation           State         Status        Resource                                          
	data:    ------------------- ------------- ------------- --------------------------------------------------
	data:    E8D88DA720375394    Succeeded     OK            /subscriptions/aeb4ae60-b7cb-4f3d-aeb4ae60-b6607f30/resourceGroups/mygroup/providers/Microsoft.Web/sites/Microsoft-ApiApp33056917d6e34238b2606d71caf73b6a
	data:    FC31834D2E73D10E    Succeeded     Created       /subscriptions/aeb4ae60-b7cb-4f3d-aeb4ae60-b6607f30/resourceGroups/mygroup/providers/Microsoft.Web/sites/Microsoft-ApiApp33056917d6e34238b2606d71caf73b6a/providers/Microsoft.Resources/links/apiApp
	data:    C5B48DAF91306BB4    Succeeded     OK            /subscriptions/aeb4ae60-b7cb-4f3d-aeb4ae60-b6607f30/resourceGroups/mygroup/providers/Microsoft.Web/sites/Microsoft-ApiApp33056917d6e34238b2606d71caf73b6a/siteextensions/Microsoft.ApiApp
	data:    F4B943428026A1B2    Succeeded     Created       /subscriptions/aeb4ae60-b7cb-4f3d-aeb4ae60-b6607f30/resourceGroups/mygroup/providers/Microsoft.AppService/apiapps/newapiapp
	data:    4B3A935892415369    Succeeded     Created       /subscriptions/aeb4ae60-b7cb-4f3d-aeb4ae60-b6607f30/resourceGroups/mygroup/providers/Microsoft.AppService/apiapps/newapiapp/providers/Microsoft.Resources/links/apiAppSite
	info:    Deployment complete with status: Succeeded
	info:    apiapp create command OK

#### Create an API app from the Marketplace

To get a list of API app packages available in the Marketplace, use the `group template list` command and specify API apps by using the category (`-c`) parameter.

	azure group template list -c apiapps

The output looks like this example:

	info:    Executing command group template list
	info:    Listing gallery resource group templates
	data:    Publisher      Name                                                  
	data:    -------------  ------------------------------------------------------
	data:    Microsoft      Microsoft.Template.1.0.1                              
	data:    microsoft_com  microsoft_com.MicrosoftSharePointConnector.0.2.2      
	data:    microsoft_com  microsoft_com.FTPConnector.0.2.2                      
	info:    group template list command OK

To create an API app from the Marketplace use the `apiapap create` command and specify the name of the API app you want to create by using the NuGet package (`-u`) parameter. 

	azure apiapp create -g <resource group name> -n <API app name> -p <app service plan name> -u <marketplace name>

The value to use for the `-u` parameter is the middle section of the marketplace name. For example, for microsoft_com.MicrosoftSqlConnector.0.2.2, the command looks like this:

	azure apiapp create -g mygroup -n mysqlconnector -p myplan -u MicrosoftSqlConnector
	
If any API app template parameters are required, such as server names and connection strings for a SQL connector, you'll be prompted for the required data. You have the option to use the `--parameters` or `--parameters-file` to pass in the parameter values. For more information about parameters files, see [Provision an API app with a new gateway](app-service-api-arm-new-gateway-provision.md).

## Next steps

This article has shown how to use individual Azure CLI commands to work with custom API apps or API apps that you create from Marketplace templates. For information about how to use custom templates to automate API app creation, see these resources:

* [Provision an API app with an existing gateway](app-service-api-arm-existing-gateway-provision.md)
* [Provision an API app with a new gateway](app-service-api-arm-new-gateway-provision.md)

For more information about how to use Azure command line utilities with Azure Resource Manager, see these resources:
 
* [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](../xplat-cli-azure-resource-manager.md).
* [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md)
 
