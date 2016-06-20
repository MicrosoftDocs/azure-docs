<properties
	pageTitle="Azure Resource Manager-based PowerShell commands for Azure Web App | Microsoft Azure"
	description="Learn how to use the new Azure Resource Manager-based PowerShell commands to manage your Azure Web Apps."
	services="app-service\web"
	documentationCenter=""
	authors="ahmedelnably"
	manager="stefsch"
	editor=""/>

<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/14/2016"
	ms.author="aelnably"/>

# Using Azure Resource Manager-Based PowerShell to Manage Azure Web Apps#

With the release of Microsoft Azure PowerShell version 1.0.0 new commands have been added, that give the user the ability to use Azure Resource Manager-based PowerShell commands to manage Web Apps.

To learn about managing Resource Groups, see [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md). 

To learn about the full list of parameters and options for the Web App Azure Resource Manager PowerShell cmdlets, see the [full Cmdlet Reference of Web App Azure Resource Manager-based PowerShell Cmdlets](https://msdn.microsoft.com/library/mt619237.aspx)

## Managing App Service Plans ##

### Create an App Service Plan ###
To create a new app service plan, use the **New-AzureRmAppServicePlan** cmdlet.

Following are descriptions of the different parameters:

- 	**Name**: name of the app service plan.
- 	**Location**: service plan location.
- 	**ResourceGroupName**: resource group that includes the newly created app service plan.
- 	**Tier**:  the desired pricing tier (Default is Free, other options are Shared, Basic, Standard, and Premium.)
- 	**WorkerSize**: the size of workers (Default is small if the Tier parameter was specified as Basic, Standard or Premium. Other options are Medium, and Large.)
- 	**NumberofWorkers**: the number of workers in the app service plan (Default value is 1). 

Example to use this cmdlet:

    New-AzureRmAppServicePlan -Name ContosoAppServicePlan -Location "South Central US" -ResourceGroupName ContosoAzureResourceGroup -Tier Premium -WorkerSize Large -NumberofWorkers 10

### Create an App Service Plan in an App Service Environment ###
To create a new app service plan in an app service environment, the same command **New-AzureRmAppServicePlan** command can be used with extra parameters to specify the ASE name and the resource group name that the ASE belongs to.

Example to use this cmdlet:

    New-AzureRmAppServicePlan -Name ContosoAppServicePlan -Location "South Central US" -ResourceGroupName ContosoAzureResourceGroup -AseName constosoASE -AseResourceGroupName contosoASERG -Tier Premium -WorkerSize Large -NumberofWorkers 10

To learn more about app service environment, check [Introduction to App Service Environment](app-service-app-service-environment-intro.md)

### List Existing App Service Plans ###

To list the existing app service plans, use **Get-AzureRmAppServicePlan** cmdlet.

To list all app service plans under your subscription, use: 

    Get-AzureRmAppServicePlan

To list all app service plans under a specific resource group, use:

    Get-AzureRmAppServicePlan -ResourceGroupname ContosoAzureResourceGroup

To get a specific app service plan, use:

    Get-AzureRmAppServicePlan -Name ContosoAppServicePlan


### Configure an existing App Service Plan ###

To change the settings for an existing app service plan, use the **Set-AzureRmAppServicePlan** cmdlet. You can change the tier, worker size, and the number of workers 

    Set-AzureRmAppServicePlan -Name ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -Tier Standard -WorkerSize Medium -NumberofWorkers 9

#### Scaling an App Service Plan ####

To scale an existing App Service Plan, use:

    Set-AzureRmAppServicePlan -Name ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -NumberofWorkers 9

#### Changing the worker size of an App Service Plan ####

To change the size of workers in an existing App Service Plan, use:

    Set-AzureRmAppServicePlan -Name ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -WorkerSize Medium

#### Changing the Tier of an App Service Plan ####

To change the tier of an existing App Service Plan, use:

    Set-AzureRmAppServicePlan -Name ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -Tier Standard

### Delete an existing App Service Plan ###

To delete an existing app service plan, all assigned web apps need to be moved or deleted first and then using the **Remove-AzureRmAppServicePlan** cmdlet you can delete the app service plan.

    Remove-AzureRmAppServicePlan -Name ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup

## Managing App Service Web Apps ##

### Create a new Web App ###

To create a new web app, use the **New-AzureRmWebApp** cmdlet.

Following are descriptions of the different parameters:

- **Name**: name for the web app.
- **AppServicePlan**: name for the service plan used to host the web app.
- **ResourceGroupName**: resource group that hosts the App service plan.
- **Location**: the web app location.

Example to use this cmdlet:

    New-AzureRmWebApp -Name ContosoWebApp -AppServicePlan ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -Location "South Central US"

### Create a new Web App in an App Service Environment ###

To create a new web app in an App Service Environment (ASE), the same **New-AzureRmWebApp** command can be used with extra parameters to specify the ASE name and the resource group name that the ASE belongs to.

    New-AzureRmWebApp -Name ContosoWebApp -AppServicePlan ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -Location "South Central US"  -ASEName ContosoASEName -ASEResourceGroupName ContosoASEResourceGroupName

To learn more about app service environment, check [Introduction to App Service Environment](app-service-app-service-environment-intro.md)

### Delete an existing Web App ###

To delete an existing web app you can use the **Remove-AzureRmWebApp** cmdlet, you need to specify the name of the web app and the resource group name.

    Remove-AzureRmWebApp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup


### List existing Web Apps ###

To list the existing web apps, use the **Get-AzureRmWebApp** cmdlet.

To list all web apps under your subscription, use:

    Get-AzureRmWebApp

To list all web apps under a specific resource group, use:

    Get-AzureRmWebApp -ResourceGroupname ContosoAzureResourceGroup

To get a specific web app, use:

    Get-AzureRmWebApp -Name ContosoWebApp

### Configure an existing Web App ###

To change the settings and configurations for an existing web app, use the **Set-AzureRmWebApp** cmdlet. For a full list of parameters, check the [Cmdlet reference link](https://msdn.microsoft.com/library/mt652487.aspx)

Example (1): use this cmdlet to change connection strings

	$connectionstrings = @{ ContosoConn1 = @{ Type = “MySql”; Value = “MySqlConn”}; ContosoConn2 = @{ Type = “SQLAzure”; Value = “SQLAzureConn”} }
	Set-AzureRmWebApp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup -ConnectionStrings $connectionstrings

Example (2): add example for app settings

	$appsettings = @{appsetting1 = "appsetting1value"; appsetting2 = "appsetting2value"}
	Set-AzureRmWebApp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup -AppSettings $appsettings


Example (3):  set the web app to run in 64-bit mode

	Set-AzureRmWebApp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup -Use32BitWorkerProcess $False

### Change the state of an existing Web App ###

#### Restart a web app ####

To restart a web app, you must specify the name and resource group of the web app.

    Restart-AzureRmWebapp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup

#### Stop a web app ####

To stop a web app, you must specify the name and resource group of the web app.

    Stop-AzureRmWebapp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup

#### Start a web app ####

To start a web app, you must specify the name and resource group of the web app.

    Start-AzureRmWebapp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup

### Manage Web App Publishing profiles ###

Each web app has a publishing profile that can be used to publish your apps, a number of operations can be executed on publishing profiles.

#### Get Publishing Profile ####

To get the publishing profile for a web app, use:

    Get-AzureRmWebAppPublishingProfile -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup -OutputFile .\publishingprofile.txt

Note that this will echo the publishing profile to the command line as well output the publishing profile to a text file.

#### Reset Publishing Profile ####

To reset both the publishing password for FTP and web deploy for a web app, use:

    Reset-AzureRmWebAppPublishingProfile -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup

### Manage Web App Certificates ###

To learn about how to manage web app certificates, see [SSL Certificates binding using PowerShell](app-service-web-app-powershell-ssl-binding.md)



### Next Steps ###
- To learn about Azure Resource Manager PowerShell support, see [Using Azure PowerShell with Azure Resource Manager.](../powershell-azure-resource-manager.md)
- To learn about App Service Environments, see [Introduction to App Service Environment.](app-service-app-service-environment-intro.md)
- To learn about managing App Service SSL certificates using PowerShell, see [SSL Certificates binding using PowerShell.](app-service-web-app-powershell-ssl-binding.md)
- To learn about the full list of Azure Resource Manager-based PowerShell cmdlets for Azure Web Apps, see [Azure Cmdlet Reference of Web Apps Azure Resource Manager PowerShell Cmdlets.](https://msdn.microsoft.com/library/mt619237.aspx)
