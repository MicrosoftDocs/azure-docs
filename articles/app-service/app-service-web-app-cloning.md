---
title: Web App Cloning using PowerShell
description: Learn how to clone your Web Apps to new Web Apps using PowerShell.
services: app-service\web
documentationcenter: ''
author: ahmedelnably
manager: stefsch
editor: ''

ms.assetid: f9a5cfa1-fbb0-41e6-95d1-75d457347a35
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/14/2016
ms.author: aelnably

---
# Azure App Service App Cloning Using PowerShell
With the release of Microsoft Azure PowerShell version 1.1.0, a new option has been added to `New-AzureRMWebApp` that lets you clone an existing Web App to a newly created app in a different region or in the same region. This option enables customers to deploy a number of apps across different regions quickly and easily.

App cloning is currently only supported for premium tier app service plans. The new feature uses the same limitations as Web Apps Backup feature, see [Back up a web app in Azure App Service](web-sites-backup.md).

[!INCLUDE [app-service-web-to-api-and-mobile](../../includes/app-service-web-to-api-and-mobile.md)]

## Cloning an existing App
Scenario: An existing web app in South Central US region, and you want to clone the contents to a new web app in North Central US region. It can be accomplished by using the Azure Resource Manager version of the PowerShell cmdlet to create a new web app with the `-SourceWebApp` option.

Knowing the resource group name that contains the source web app, you can use the following PowerShell command to get the source web app's information (in this case named `source-webapp`):

```PowerShell
$srcapp = Get-AzureRmWebApp -ResourceGroupName SourceAzureResourceGroup -Name source-webapp
```

To create a new App Service Plan, you can use `New-AzureRmAppServicePlan` command as in the following example

```PowerShell
New-AzureRmAppServicePlan -Location "South Central US" -ResourceGroupName DestinationAzureResourceGroup -Name NewAppServicePlan -Tier Premium
```

Using the `New-AzureRmWebApp` command, you can create the new web app in the North Central US region, and tie it to an existing premium tier App Service Plan. Moreover, you can use the same resource group as the source web app, or define a new resource group, as shown in the following command:

```PowerShell
$destapp = New-AzureRmWebApp -ResourceGroupName DestinationAzureResourceGroup -Name dest-webapp -Location "North Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp
```

To clone an existing web app including all associated deployment slots, you need to use the `IncludeSourceWebAppSlots` parameter. The following PowerShell command demonstrates the use of that parameter with the `New-AzureRmWebApp` command:

```PowerShell
$destapp = New-AzureRmWebApp -ResourceGroupName DestinationAzureResourceGroup -Name dest-webapp -Location "North Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp -IncludeSourceWebAppSlots
```

To clone an existing web app within the same region, you need to create a new resource group and a new app service plan in the same region, and then use the following PowerShell command to clone the web app

```PowerShell
$destapp = New-AzureRmWebApp -ResourceGroupName NewAzureResourceGroup -Name dest-webapp -Location "South Central US" -AppServicePlan NewAppServicePlan -SourceWebApp $srcap
```

## Cloning an existing App to an App Service Environment
Scenario: An existing web app in South Central US region, and you want to clone the contents to a new web app to an existing App Service Environment (ASE).

Knowing the resource group name that contains the source web app, you can use the following PowerShell command to get the source web app's information (in this case named `source-webapp`):

```PowerShell
$srcapp = Get-AzureRmWebApp -ResourceGroupName SourceAzureResourceGroup -Name source-webapp
```

Knowing the ASE's name, and the resource group name that the ASE belongs to, you can create the new web app in the existing ASE, as shown in the following command:

```PowerShell
$destapp = New-AzureRmWebApp -ResourceGroupName DestinationAzureResourceGroup -Name dest-webapp -Location "North Central US" -AppServicePlan DestinationAppServicePlan -ASEName DestinationASE -ASEResourceGroupName DestinationASEResourceGroupName -SourceWebApp $srcapp
```

The `Location` parameter is required due to legacy reason, but it is ignored when you create the app in an ASE. 

## Cloning an existing App Slot
Scenario: You want to clone an existing Web App Slot to either a new Web App or a new Web App slot. The new Web App can be in the same region as the original Web App slot or in a different region.

Knowing the resource group name that contains the source web app, you can use the following PowerShell command to get the source web app slot's information (in this case named `source-webappslot`) tied to Web App `source-webapp`:

```PowerShell
$srcappslot = Get-AzureRmWebAppSlot -ResourceGroupName SourceAzureResourceGroup -Name source-webapp -Slot source-webappslot
```

The following command demonstrates creating a clone of the source web app to a new web app:

```PowerShell
$destapp = New-AzureRmWebApp -ResourceGroupName DestinationAzureResourceGroup -Name dest-webapp -Location "North Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcappslot
```

## Configuring Traffic Manager while cloning an app
Creating multi-region web apps and configuring Azure Traffic Manager to route traffic to all these web apps, is an important scenario to ensure that customers' apps are highly available. When cloning an existing web app, you have the option to connect both web apps to either a new traffic manager profile or an existing one. Only Azure Resource Manager version of Traffic Manager is supported.

### Creating a new Traffic Manager profile while cloning an app
Scenario: You want to clone a web app to another region, while configuring an Azure Resource Manager traffic manager profile that includes both web apps. The following command demonstrates creating a clone of the source web app to a new web app while configuring a new Traffic Manager profile:

```PowerShell
$destapp = New-AzureRmWebApp -ResourceGroupName DestinationAzureResourceGroup -Name dest-webapp -Location "South Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp -TrafficManagerProfileName newTrafficManagerProfile
```

### Adding new cloned Web App to an existing Traffic Manager profile
Scenario: You already have an Azure Resource Manager traffic manager profile and want to add both web apps as endpoints. To do so, you first need to assemble the existing traffic manager profile ID. You need the subscription ID, the resource group name, and the existing traffic manager profile name.

```PowerShell
$TMProfileID = "/subscriptions/<Your subscription ID goes here>/resourceGroups/<Your resource group name goes here>/providers/Microsoft.TrafficManagerProfiles/ExistingTrafficManagerProfileName"
```

After having the traffic manger ID, the following command demonstrates creating a clone of the source web app to a new web app while adding them to an existing Traffic Manager profile:

```PowerShell
$destapp = New-AzureRmWebApp -ResourceGroupName <Resource group name> -Name dest-webapp -Location "South Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp -TrafficManagerProfileId $TMProfileID
```

## Current Restrictions
This feature is currently in preview, and new capabilities are added over time. Here are the known restrictions on the current version of app cloning:

* Auto scale settings are not cloned
* Backup schedule settings are not cloned
* VNET settings are not cloned
* App Insights are not automatically set up on the destination web app
* Easy Auth settings are not cloned
* Kudu Extension are not cloned
* TiP rules are not cloned
* Database content is not cloned
* Outbound IP Addresses changes if cloning to a different scale unit

### References
* [Web App Cloning](app-service-web-app-cloning.md)
* [Back up a web app in Azure App Service](web-sites-backup.md)
* [Azure Resource Manager support for Azure Traffic Manager Preview](../traffic-manager/traffic-manager-powershell-arm.md)
* [Introduction to App Service Environment](environment/intro.md)
* [Using Azure PowerShell with Azure Resource Manager](../azure-resource-manager/powershell-azure-resource-manager.md)

