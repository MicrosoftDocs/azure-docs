---
title: Restore deleted apps
description: Learn how to restore a deleted app in Azure App Service. Avoid the headache of an accidentally deleted app.
author: btardif
ms.author: byvinyal
ms.date: 9/23/2019
ms.topic: article
---

# Restore deleted App Service app Using PowerShell

If you happened to accidentally delete your app in Azure App Service, you can restore it using the commands from the [Az PowerShell module](https://docs.microsoft.com/powershell/azure/?view=azps-2.6.0&viewFallbackFrom=azps-2.2.0).

> [!NOTE]
> Deleted apps are purged from the system 30 days after the initial deletion. Once an app has been purged, it can't be recovered.
>

## Re-register App Service resource provider
Some customers might come across an issue where retrieving the list of deleted apps fails. To resolve the issue, run the following command:

```powershell
 Register-AzResourceProvider -ProviderNamespace "Microsoft.Web"
```

## List deleted apps

To get the collection of deleted apps, you can use `Get-AzDeletedWebApp`.

For details on a specific deleted app you can use:

```powershell
Get-AzDeletedWebApp -Name <your_deleted_app> -Location <your_deleted_app_location> 
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
>[!NOTE]
> `Restore-AzDeletedWebApp` isn't supported for function apps.

Once the app you want to restore has been identified, you can restore it using `Restore-AzDeletedWebApp`.

```powershell
Restore-AzDeletedWebApp -ResourceGroupName <my_rg> -Name <my_app> -TargetAppServicePlanName <my_asp>
```
> [!NOTE]
> Deployment slots are not restored as part of your app. If you need to restore a staging slot use the `-Slot <slot-name>`  flag.
>

The inputs for command are:

- **Resource Group**: Target resource group where the app will be restored
- **Name**: Name for the app, should be globally unique.
- **TargetAppServicePlanName**: App Service plan linked to the app

By default `Restore-AzDeletedWebApp` will restore both your app configuration as well any content. If you want to only restore content, you use the `-RestoreContentOnly` flag with this commandlet.

> [!NOTE]
> If the app was hosted on and then deleted from an App Service Environment then it can be restored only if the corresponding App Service Environment still exist.
>

You can find the full commandlet reference here: [Restore-AzDeletedWebApp](https://docs.microsoft.com/powershell/module/az.websites/restore-azdeletedwebapp).
