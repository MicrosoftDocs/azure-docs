---
title: Restore Deleted Apps
description: Learn how to restore a deleted app in Azure App Service. Avoid the headache of an accidentally deleted app.
author: seligj95
ms.author: jordanselig
ms.date: 10/4/2023
ms.topic: how-to
ms.custom: devx-track-azurepowershell
---

# Restore a deleted App Service app

If you accidentally deleted an app in Azure App Service, you can now restore it by using the Azure portal or PowerShell.

## Restore deleted App Service app by using the Azure portal

If you deleted your app in Azure App Service, you can restore it from the portal by following these steps:

1. Go to App Services in the Azure portal.
1. Select **Manage Deleted Apps**.
1. Select **Subscription**.
1. From the dropdown, select the deleted app. Apps deleted in the last 30 days show in the dropdown list.
1. Select the destination app from the dropdown that correlates to where you want to restore your app.
1. If you would like to restore the deleted app to a slot of the destination app, select the slot checkbox and select available slots from the dropdown.
1. By default, only app content is restored. If you want app configuration to also be restored, select **Restore App configuration**.

## Restore a deleted App Service app by using PowerShell

If you deleted your app in Azure App Service, you can restore it by using the commands from the [`Az PowerShell module`](/powershell/azure/).

> [!NOTE]
> * Deleted apps are purged from the system 30 days after the initial deletion. After an app is purged, it can't be recovered.
> * Undelete functionality isn't supported for function apps hosted on the Consumption plan or Elastic Premium plan.

## Re-register App Service resource provider

Some customers might experience failure to retrieve the list of deleted apps. To resolve the issue, run the following command:

```powershell
 Register-AzResourceProvider -ProviderNamespace "Microsoft.Web"
```

## List deleted apps

To access the collection of deleted apps, you can use `Get-AzDeletedWebApp`.

For details on a specific deleted app you can use:

```powershell
Get-AzDeletedWebApp -Name <your_deleted_app> -Location <your_deleted_app_location> 
```

The detailed information includes:

* **`DeletedSiteId`**: Unique identifier for the app, used for scenarios where multiple apps with the same name were deleted
* **`SubscriptionID`**: Subscription containing the deleted resource
* **Location**: Location of the original app
* **`ResourceGroupName`**: Name of the original resource group
* **Name**: Name of the original app
* **Slot**: Name of the slot
* **Deletion Time**: When the app was deleted

## Restore deleted app

>[!NOTE]
>
>* `Restore-AzDeletedWebApp` isn't supported for function apps hosted on the Consumption plan or Elastic Premium plan.
>* The `Restore-AzDeletedWebApp` cmdlet restores a deleted web app. The web app specified by `TargetResourceGroupName`, `TargetName`, and `TargetSlot` is overwritten with the contents and settings of the deleted web app. If the target parameters aren't specified, they're automatically filled with the deleted web app's resource group, name, and slot. If the target web app doesn't exist, it's automatically created in the App Service plan specified by `TargetAppServicePlanName`.
>* By default `Restore-AzDeletedWebApp` restores both your app configuration and any content. If you want to only restore content, you use the `-RestoreContentOnly` flag with this cmdlet.
>* Custom domains, bindings, or certs that you import to your app isn't restored. You'll need to add them again after your app is restored.

After identifying the app you want to restore, you can restore it by using `Restore-AzDeletedWebApp`, as shown in the following examples.
>You can find the full cmdlet reference here: [`Restore-AzDeletedWebApp`](/powershell/module/az.websites/restore-azdeletedwebapp).

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
> Deployment slots aren't restored as part of your app. If you need to restore a staging slot, use the `-Slot <slot-name>` flag.
> The cmdlet restores the original slot to the target app's production slot.
> By default, `Restore-AzDeletedWebApp` restores both your app configuration as well any content to the target app. If you want to only restore content, you use the `-RestoreContentOnly` flag with this cmdlet.

> Restore only site content to the target app:

```powershell
Restore-AzDeletedWebApp -TargetResourceGroupName <my_rg> -Name <my_app> -TargetAppServicePlanName <my_asp> -RestoreContentOnly
```
>Restore used for scenarios where multiple apps with the same name have been deleted with `-DeletedSiteId`
```powershell
Restore-AzDeletedWebApp -ResourceGroupName <original_rg> -Name <original_app> -DeletedId /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.Web/locations/location/deletedSites/1234 -TargetAppServicePlanName <my_asp>

```

The inputs for command are:

- **`Target Resource Group`**: Target resource group to which you're restoring the app.
- **`TargetName`**: Target app to which you're restoring the deleted app.
- **`TargetAppServicePlanName`**: App Service plan linked to the app.
- **Name**: Name for the app. We recommend that it's globally unique.
- **`ResourceGroupName`**: Original resource group for the deleted app, you can get it from `Get-AzDeletedWebApp -Name <your_deleted_app> -Location <your_deleted_app_location>` 
- **Slot**: Slot for the deleted app.
- **`RestoreContentOnly`**: By default `Restore-AzDeletedWebApp` restores both your app configuration as well any content. If you want to only restore content, you can use the `-RestoreContentOnly` flag with this cmdlet.

> [!NOTE]
> If the app was hosted on and then deleted from an App Service Environment, it can be restored only if the corresponding App Service Environment still exists.

## Restore deleted Azure Functions app

If the function app was hosted on a **Dedicated app service plan**, it can be restored, as long as it used the default App Service storage.

1. Fetch the `DeletedSiteId` of the app version you want to restore, by using `Get-AzDeletedWebApp` cmdlet:

```powershell
Get-AzDeletedWebApp -ResourceGroupName <RGofDeletedApp> -Name <NameofApp> 
```

1. Create a new function app in a Dedicated plan. Refer to the instructions for [how to create an app in the portal](../azure-functions/functions-create-function-app-portal.md#create-a-function-app).
1. Restore to the newly created function app by using this cmdlet:

```powershell
Restore-AzDeletedWebApp -ResourceGroupName <RGofnewapp> -Name <newApp> -deletedId "/subscriptions/xxxx/providers/Microsoft.Web/locations/xxxx/deletedSites/xxxx"
```

Currently there's no support to undelete (`Restore-AzDeletedWebApp`) a function app hosted in a Consumption plan or Elastic premium plan because the content resides on Azure Files in a storage account. If you didn't hard delete that Azure Files storage account, or if the account exists and file shares weren't deleted, then you can use the following steps as a workaround:

1. Create a new function app in a Consumption or Premium plan. Refer the instructions for [how to create an app in the portal](../azure-functions/functions-create-function-app-portal.md#create-a-function-app).
1. Set the following [app settings](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings) to refer to the old storage account, which contains the content from the previous app.

    | App Setting      | Suggested value  | 
    | ------------ | ---------------- | 
    | **AzureWebJobsStorage** | Connection String for the storage account used by the deleted app. | 
    | **WEBSITE_CONTENTAZUREFILECONNECTIONSTRING** | Connection String for the storage account used by the deleted app. | 
    | **WEBSITE_CONTENTSHARE** | File share on storage account used by the deleted app. | 
