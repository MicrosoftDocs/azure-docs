---
title: Restore deleted apps
description: Learn how to restore a deleted app in Azure App Service. Avoid the headache of an accidentally deleted app.
author: seligj95
ms.author: jordanselig
ms.date: 10/4/2023
ms.topic: article 
ms.custom: devx-track-azurepowershell
---

# Restore deleted App Service app Using PowerShell

If you happened to accidentally delete your app in Azure App Service, you can restore it using the commands from the [Az PowerShell module](/powershell/azure/).

> [!NOTE]
> - Deleted apps are purged from the system 30 days after the initial deletion. After an app is purged, it can't be recovered.
> - Undelete functionality isn't supported for function apps hosted on the Consumption plan or Elastic Premium plan.
> - App Service apps running in an App Service Environment don't support snapshots. Therefore, undelete functionality and clone functionality aren't supported for App Service apps running in an App Service Environment.
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
>- `Restore-AzDeletedWebApp` isn't supported for function apps hosted on the Consumption plan or Elastic Premium plan.
>- The Restore-AzDeletedWebApp cmdlet restores a deleted web app. The web app specified by TargetResourceGroupName, TargetName, and TargetSlot will be overwritten with the contents and settings of the deleted web app. If the target parameters are not specified, they will automatically be filled with the deleted web app's resource group, name, and slot. If the target web app does not exist, it will automatically be created in the app service plan specified by TargetAppServicePlanName.
>- By default `Restore-AzDeletedWebApp` will restore both your app configuration as well any content. If you want to only restore content, you use the **`-RestoreContentOnly`** flag with this commandlet.
>- Custom domains, bindings, or certs that you import to your app won't be restored. You'll need to re-add them after your app is restored. 


After identifying the app you want to restore, you can restore it using `Restore-AzDeletedWebApp`, as shown in the following examples.
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
> The commandlet is restoring original slot to the target app's production slot.
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

- **Target Resource Group**: Target resource group where the app is to be restored
- **TargetName**: Target app for the deleted app to be restored to
- **TargetAppServicePlanName**: App Service plan linked to the app
- **Name**: Name for the app, should be globally unique.
- **ResourceGroupName**: Original resource group for the deleted app 
- **Slot**: Slot for the deleted app 
- **RestoreContentOnly**: By default `Restore-AzDeletedWebApp` restores both your app configuration as well any content. If you want to only restore content, you can use the `-RestoreContentOnly` flag with this commandlet.

> [!NOTE]
> If the app was hosted on and then deleted from an App Service Environment, it can be restored only if the corresponding App Service Environment still exists.

## Restore deleted function app 

If the function app was hosted on a **Dedicated app service plan**, it can be restored, as long as it was using the default App Service storage.

1. Fetch the DeletedSiteId of the app version you want to restore, using Get-AzDeletedWebApp cmdlet:

```powershell
Get-AzDeletedWebApp -ResourceGroupName <RGofDeletedApp> -Name <NameofApp> 
```
2. Create a new function app in a Dedicated plan. Refer to the instructions for [how to create an app in the portal](../azure-functions/functions-create-function-app-portal.md#create-a-function-app).
3. Restore to the newly created function app using this cmdlet:

```powershell
Restore-AzDeletedWebApp -ResourceGroupName <RGofnewapp> -Name <newApp> -deletedId "/subscriptions/xxxx/providers/Microsoft.Web/locations/xxxx/deletedSites/xxxx"
```

Currently there's no support for Undelete (Restore-AzDeletedWebApp) Function app that's hosted in a Consumption plan or Elastic premium plan since the content resides on Azure Files in a Storage account. If you haven't 'hard' deleted that Azure Files storage account, or if the account exists and file shares haven't been deleted, then you may use the steps as workaround:
 

1. Create a new function app in a Consumption or Premium plan. Refer the instructions for [how to create an app in the portal](../azure-functions/functions-create-function-app-portal.md#create-a-function-app).
2. Set the following [app settings](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings) to refer to the old storage account , which contains the content from the previous app.

    | App Setting      | Suggested value  | 
    | ------------ | ---------------- | 
    | **AzureWebJobsStorage** | Connection String for the storage account used by the deleted app. | 
    | **WEBSITE_CONTENTAZUREFILECONNECTIONSTRING** | Connection String for the storage account used by the deleted app. | 
    | **WEBSITE_CONTENTSHARE** | File share on storage account used by the deleted app. | 


