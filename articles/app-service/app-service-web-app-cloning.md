---
title: Clone an App by Using PowerShell
description: Learn how to clone your App Service app to a new app by using PowerShell. Learn about various cloning scenarios, including Traffic Manager integration.
ms.assetid: f9a5cfa1-fbb0-41e6-95d1-75d457347a35
ms.topic: how-to
ms.date: 05/02/2025
ms.custom: devx-track-azurepowershell
author: msangapu-msft
ms.author: msangapu
---
# Clone an Azure App Service app by using PowerShell

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

This article explains how you can clone an existing App Service app to create a new app in a different region or in the same region. You can deploy multiple apps across different regions quickly and easily.

App cloning is supported in Standard tiers and higher, and in Isolated tiers. The feature has the same limitations as the App Service Backup feature, see [Back up an app in Azure App Service](manage-backup.md).

## Clone an existing app

Scenario: You want to clone the contents of an existing app in the South Central US region to a new app in the North Central US region. You can use the Azure Resource Manager version of the PowerShell cmdlet to create a new app by using the `-SourceWebApp` option.

When you know the name of the resource group that contains the source app, you can use the following PowerShell command to get the source app's information, in this case named `source-webapp`:

```powershell
$srcapp = Get-AzWebApp -ResourceGroupName SourceAzureResourceGroup -Name source-webapp
```

To create a new App Service plan, you can use the `New-AzAppServicePlan` command shown in the following example:

```powershell
New-AzAppServicePlan -Location "North Central US" -ResourceGroupName DestinationAzureResourceGroup -Name DestinationAppServicePlan -Tier Standard
```

By using the `New-AzWebApp` command, you can create the new app in the North Central US region, and tie it to an existing App Service plan. Moreover, you can use the same resource group as the source app, or define a new resource group. See the following command:

```powershell
$destapp = New-AzWebApp -ResourceGroupName DestinationAzureResourceGroup -Name dest-webapp -Location "North Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp
```

To clone an existing app, including all associated deployment slots, you need to use the `IncludeSourceWebAppSlots` parameter. This parameter is supported only for cloning an entire app including all of its slots. The following PowerShell command demonstrates the use of that parameter with the `New-AzWebApp` command:

```powershell
$destapp = New-AzWebApp -ResourceGroupName DestinationAzureResourceGroup -Name dest-webapp -Location "North Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp -IncludeSourceWebAppSlots
```

To clone an existing app within the same region, create a new resource group and a new App Service plan in the same region. Then, use the following PowerShell command to clone the app:

```powershell
$destapp = New-AzWebApp -ResourceGroupName NewAzureResourceGroup -Name dest-webapp -Location "South Central US" -AppServicePlan NewAppServicePlan -SourceWebApp $srcapp
```

## Clone an existing app to an App Service Environment

Scenario: You want to clone the contents of an existing app in the South Central US region to a new app in an existing App Service Environment.

When you know the name of the resource group that contains the source app, you can use the following PowerShell command to get the source app's information, in this case named `source-webapp`:

```powershell
$srcapp = Get-AzWebApp -ResourceGroupName SourceAzureResourceGroup -Name source-webapp
```

With the App Service Environment's name, and the name of the resource group that the App Service Environment belongs to, you can create the new app in the existing App Service Environment. The process is shown in the following command:

```powershell
$destapp = New-AzWebApp -ResourceGroupName DestinationAzureResourceGroup -Name dest-webapp -Location "North Central US" -AppServicePlan DestinationAppServicePlan -ASEName DestinationASE -ASEResourceGroupName DestinationASEResourceGroupName -SourceWebApp $srcapp
```

The `Location` parameter is required for legacy reasons, but it's ignored when you create the app in an App Service Environment.

## Clone an existing app slot

Scenario: You want to clone an existing deployment slot of an app to either a new app or a new slot. The new app can be in the same region as the original app slot or in a different region.

When you know the name of the resource group that contains the source app, you can use the following PowerShell command to get the source app slot's information (in this case named `source-appslot`) tied to `source-app`:

```powershell
$srcappslot = Get-AzWebAppSlot -ResourceGroupName SourceAzureResourceGroup -Name source-app -Slot source-appslot
```

The following command demonstrates how to create a clone of the source app to a new app:

```powershell
$destapp = New-AzWebApp -ResourceGroupName DestinationAzureResourceGroup -Name dest-app -Location "North Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcappslot
```

## Configure Traffic Manager while cloning an app

When you create multi-region apps and configure Azure Traffic Manager to route traffic to these apps, we recommend that customer apps are highly available. When you clone an existing app, you can connect both apps to either a new Traffic Manager profile or an existing one. Only the Azure Resource Manager version of Traffic Manager is supported.

### Create a new Traffic Manager profile while cloning an app

Scenario: You want to clone an app to another region, while configuring an Azure Resource Manager Traffic Manager profile that includes both apps. The following command demonstrates how to create a clone of the source app to a new app while configuring a new Traffic Manager profile:

```powershell
$destapp = New-AzWebApp -ResourceGroupName DestinationAzureResourceGroup -Name dest-webapp -Location "South Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp -TrafficManagerProfileName newTrafficManagerProfile
```

### Add a new cloned app to an existing Traffic Manager profile

Scenario: You already have an Azure Resource Manager Traffic Manager profile and want to add both apps as endpoints. First, assemble the existing Traffic Manager profile ID. You need the subscription ID, the resource group name, and the existing Traffic Manager profile name.

```powershell
$TMProfileID = "/subscriptions/<Your subscription ID goes here>/resourceGroups/<Your resource group name goes here>/providers/Microsoft.TrafficManagerProfiles/ExistingTrafficManagerProfileName"
```

After you have the Traffic Manager ID, the following command demonstrates how to create a clone of the source app to a new app while adding them to an existing Traffic Manager profile:

```powershell
$destapp = New-AzWebApp -ResourceGroupName <Resource group name> -Name dest-webapp -Location "South Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp -TrafficManagerProfileId $TMProfileID
```

> [!NOTE]
> If you receive an error that states **SSL validation on the traffic manager hostname is failing**, we suggest that you use the `-IgnoreCustomHostNames` attribute in the PowerShell cmdlet while you perform the clone operation. Alternatively, you can use the Azure portal.

## Current restrictions

Here are the known restrictions of app cloning:

* Autoscale settings aren't cloned.
* Backup schedule settings aren't cloned.
* Virtual network settings aren't cloned.
* Application Insights isn't automatically set up on the destination app.
* Easy Auth settings aren't cloned.
* Kudu extensions aren't cloned.
* TiP rules aren't cloned.
* Database content isn't cloned.
* Outbound IP addresses change if you clone to a different scale unit.
* Linux apps aren't available.
* Managed identities aren't cloned.
* Function apps aren't available.

## Related content

* [Back up and restore your app in Azure App Service](manage-backup.md)
* [Using PowerShell to manage Traffic Manager](../traffic-manager/traffic-manager-powershell-arm.md)
* [App Service Environment overview](environment/intro.md)
* [Manage Azure resources by using Azure PowerShell](../azure-resource-manager/management/manage-resources-powershell.md)
