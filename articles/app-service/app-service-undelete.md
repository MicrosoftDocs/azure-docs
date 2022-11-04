---
title: Restore deleted apps
description: Learn how to restore a deleted app in Azure App Service. Avoid the headache of an accidentally deleted app.
author: seligj95
ms.author: jordanselig
ms.date: 11/4/2022
ms.topic: article 
ms.custom: devx-track-azurepowershell
---

# Restore deleted App Service app Using PowerShell

If you happened to accidentally delete your app in Azure App Service, you can restore it using the commands from the [Az PowerShell module](/powershell/azure/).

> [!NOTE]
> - Deleted apps are purged from the system 30 days after the initial deletion. After an app is purged, it can't be recovered.
> - Undelete functionality isn't supported for the Consumption plan.
> - Apps Service apps running in an App Service Environment don't support snapshots. Therefore, undelete functionality and clone functionality aren't supported for App Service apps running in an App Service Environment.
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
>- `Restore-AzDeletedWebApp` isn't supported for function apps.
>- The Restore-AzDeletedWebApp cmdlet restores a deleted web app. The web app specified by TargetResourceGroupName, TargetName, and TargetSlot will be overwritten with the contents and settings of the deleted web app. If the target parameters are not specified, they will automatically be filled with the deleted web app's resource group, name, and slot. If the target web app does not exist, it will automatically be created in the app service plan specified by TargetAppServicePlanName.
>- By default `Restore-AzDeletedWebApp` will restore both your app configuration as well any content. If you want to only restore content, you use the **`-RestoreContentOnly`** flag with this commandlet.


Once the app you want to restore has been identified, you can restore it using `Restore-AzDeletedWebApp`, please see below examples
>*You can find the full commandlet reference here: **[Restore-AzDeletedWebApp](/powershell/module/az.websites/restore-azdeletedwebapp)*** .

>Restore to the original app name:
```powershell
Restore-AzDeletedWebApp -TargetResourceGroupName <my_rg> -Name <my_app> -TargetAppServicePlanName <my_asp>
```

>Restore to a different app name:
```powershell
Restore-AzDeletedWebApp -ResourceGroupName <original_rg> -Name <original_app> -TargetResourceGroupName <target_rg> -TargetName <target_app> -TargetAppServicePlanName <target_asp>
```

>Restore a slot to target app:
```powershell
Restore-AzDeletedWebApp -TargetResourceGroupName <my_rg> -Name <my_app> -TargetAppServicePlanName <my_asp> -Slot <original_slot>
```

> [!NOTE]
> Deployment slots are not restored as part of your app. If you need to restore a staging slot, use the `-Slot <slot-name>`  flag.
> By default `Restore-AzDeletedWebApp` will restore both your app configuration as well any content to target app. If you want to only restore content, you use the `-RestoreContentOnly` flag with this commandlet.

>Restore only site content to the target app
```powershell
Restore-AzDeletedWebApp -TargetResourceGroupName <my_rg> -Name <my_app> -TargetAppServicePlanName <my_asp> -RestoreContentOnly
```

>Restore used for scenarios where multiple apps with the same name have been deleted with `-DeletedSiteId`
```powershell
Restore-AzDeletedWebApp -ResourceGroupName <original_rg> -Name <original_app> -DeletedId /subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Web/locations/location/deletedSites/1234 -TargetAppServicePlanName <my_asp>

```

The inputs for command are:

- **Target Resource Group**: Target resource group where the app will be restored
- **TargetName**: Target app for the deleted app to be restored to
- **TargetAppServicePlanName**: App Service plan linked to the app
- **Name**: Name for the app, should be globally unique.
- **ResourceGroupName**: Original resource group for the deleted app 
- **Slot**: Slot for the deleted app 
- **RestoreContentOnly**: y default `Restore-AzDeletedWebApp` will restore both your app configuration as well any content. If you want to only restore content, you use the `-RestoreContentOnly` flag with this commandlet.

> [!NOTE]
> If the app was hosted on and then deleted from an App Service Environment, it can be restored only if the corresponding App Service Environment still exists.



