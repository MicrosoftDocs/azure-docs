---
title: Restore deleted App Service apps - Azure App Service
description: Learn how to restore a deleted App Service app using PowerShell.
author: btardif
ms.author: byvinyal
ms.date: 9/23/2019
ms.topic: article
ms.service: app-service
---

# Restore deleted App Service app Using PowerShell

If you happened to accidentally delete your app in Azure App Service, you can restore it using the commands from the [Az PowerShell module](https://docs.microsoft.com/powershell/azure/?view=azps-2.6.0&viewFallbackFrom=azps-2.2.0).

## List deleted apps

To get the collection of deleted apps, you can use `Get-AzDeletedWebApp`.

For details on a specific deleted app you can use:

```powershell
Get-AzDeletedWebApp -Name <your_deleted_app>
```

The detailed information includes:

- **DeletedSiteId**: Unique identifier for the app, used for scenarios where multiple apps with the same name have been deleted
- **SubscriptionID**: Subscription containing the deleted resource
- **Location**: Location of the original app
- **ResourceGroupName**: Name of the original resource group
- **Name**: Name of the original app.
- **Slot**: the name of the slot.
- **Deletion Time**: When was the app deleted  

## Restore deleted app

Once the app you want to restore has been identified, you can restore it using `Restore-AzDeletedWebApp`.

```powershell
Restore-AzDeletedWebApp -ResourceGroupName <my_rg> -Name <my_app> -TargetAppServicePlanName <my_asp>
```

The inputs for command are:

- **Resource Group**: Target resource group where the app will be restored
- **Name**: Name for the app, should be globally unique.
- **TargetAppServicePlanName**: App Service plan linked to the app

By default `Restore-AzDeletedWebApp` will restore both your app configuration as well a content. If you want to only restore content, you use the `-RestoreContentOnly` flag with this commandlet.
