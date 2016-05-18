<properties
	pageTitle="ARM based PowerShell commands for Azure Web App"
	description="Learn how to use the new ARM based PowerShell commands for Azure Web Apps."
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
	ms.date="05/18/2016"
	ms.author="ahmedelnably"/>

# Azure Web App ARM PowerShell#

With the release of Microsoft Azure PowerShell version 1.0.0 new commands have been added that would give the user the ability to use ARM based PowerShell commands to manage his Web Apps.

To learn about how to manage Resource groups, see [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md)

## Managing App Service Plans ##

### Create an App Service Plan ###
To create a new app service plan, use the **New-AzureRmAppServicePlan** cmdlet.

The command uses the Name parameter to specify a name for the app service plan, Location parameter to specify its location, ResourceGroupName parameter to specify which resource group will include the newly created app service plan, Tier parameter to specify the desired pricing tier (Default is Free), WorkerSize parameter to specify the size of workers (Default is small if the Tier parameter was specified as Basic, and NumberofWorkers parameter to specify the number of workers in the app service plan (Default is 1), Standard or Premium). 

	New-AzureRmAppServicePlan -Name ContosoAppServicePlan -Location "South Central US" -ResourceGroupName  ContosoAzureResourceGroup -Tier Premium -WorkerSize Large -NumberofWorkers 10

### List Existing App Service Plans ###

To list the existing app service plans, use the **Get-AzureRmAppServicePlan** cmdlet.

To list all app service plans under your subscription, use:

    Get-AzureRmAppServicePlan

To list all app service plans under a specific resource group, use:

    Get-AzureRmAppServicePlan -ResourceGroupname ContosoAzureResourceGroup

To get a specific app service plan, use:

    Get-AzureRmAppServicePlan -Name ContosoAppServicePlan


### Configure an existing App Service Plan ###

To change the settings for an existing app service plan, use the **Set-AzureRmAppServicePlan** cmdlet, you can change the tier, worker size, and the number of workers 

    Set-AzureRmAppServicePlan -Name ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -Tier Standard -WorkerSize Medium -NumberofWorkers 9

### Delete an existing App Service Plan ###

To delete an existing app service plan, all assigned web apps need to be moved or deleted first, then using the **Remove-AzureRmAppServicePlan** cmdlet you can delete the app service plan

    Remove-AzureRmAppServicePlan -Name ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup

## Managing App Service Web Apps ##

### Create a new Web App ###

To create a new web app, use the New-AzureRmWebApp cmdlet.

The command uses the Name parameter to specify a name for the web app, AppServicePlan to host the web app, ResourceGroupName parameter to specify which resource group host the App service plan, and Location parameter to specify the web app location.

    New-AzureRmWebApp -Name ContosoWebApp -AppServicePlan ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -Location "South Central US"

To create a new web app in an App Service Environment (ASE), the same command can be used with extra parameters to specify the ASE name and the resource group name that the ASE belongs to.

    New-AzureRmWebApp -Name ContosoWebApp -AppServicePlan ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -Location "South Central US"  -ASEName ContosoASEName -ASEResourceGroupName ContosoASEResourceGroupName

To learn more about app service environment, check [Introduction to App Service Environment](app-service-app-service-environment-intro.md)

### List existing Web Apps ###

To list the existing web apps, use the **Get-AzureRmWebApp** cmdlet.

To list all web apps under your subscription, use:

    Get-AzureRmWebApp

To list all web apps under a specific resource group, use:

    Get-AzureRmWebApp -ResourceGroupname ContosoAzureResourceGroup

To get a specific web app, use:

    Get-AzureRmWebApp -Name ContosoWebApp

### Configure an existing Web App ###

### Change the state of an existing Web App ###

#### Restart a web app ####

To restart a web app, you must specify the name and resource group of the web app.

    Restart-AzureRmWebapp -Name ContosoWebApp -ResourceGroupname ContosoAzureResourceGroup

#### Stop a web app ####

To stop a web app, you must specify the name and resource group of the web app.

    Stop-AzureRmWebapp -Name ContosoWebApp -ResourceGroupname ContosoAzureResourceGroup

#### Start a web app ####

To start a web app, you must specify the name and resource group of the web app.

    Start-AzureRmWebapp -Name ContosoWebApp -ResourceGroupname ContosoAzureResourceGroup

### Manage Web App Publishing profiles ###

Each web app has a publishing profile that is needed to publish your apps, a number of operations can be executed on publishing profiles.

#### Get Publishing Profile ####

To get the publishing profile for a web app, use:

    Get-AzureRmWebAppPublishingProfile -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup -OutputFile .\publishingprofile.txt

Note that this will echo the publishing profile to the command line

#### Reset Publishing Profile ####

To reset the publishing profile for a web app, use:

    Reset-AzureRmWebAppPublishingProfile -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup

### Manage Web App Certificates ###

To learn about how to manage web app certificates, see [SSL Certificates binding using PowerShell](app-service-web-app-cloning.md)

### Delete an existing Web App ###

To delete an existing web app you can use the **Remove-AzureRmWebApp** cmdlet, you need to specify the name of the web app and the resource group name

    Remove-AzureRmWebApp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup


### References ###
- [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md)
- [Introduction to App Service Environment](app-service-app-service-environment-intro.md)
- [SSL Certificates binding using PowerShell](app-service-web-app-cloning.md)
