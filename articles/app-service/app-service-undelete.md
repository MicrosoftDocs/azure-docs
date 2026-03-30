---
title: Restore Deleted Apps
description: Restore a deleted app in Azure App Service to another similar app created in the same region.
author: seligj95
ms.author: jordanselig
ms.date: 03/23/2026
ms.topic: how-to
ms.service: azure-app-service
ms.custom:
  - devx-track-azurepowershell
  - sfi-ropc-nochange
#customer intent: As an App Service developer, I want to restore a deleted app in Azure App Service, so I can continue to use the app content and configuration settings.
---

# Restore a deleted app in App Service

If you deleted an app in Azure App Service, you can restore the app and continue to use the existing contents and settings. The process overwrites another _target_ app with the contents and settings of the deleted web app.

There are several conditions for restoring a deleted app:

- The deleted app must be created in a paid Azure App Service plan. Apps created in the Free and Shared tiers aren't supported.
- The deleted app must be present in the system. Deleted apps are purged from the system 30 days after the initial deletion. After an app is purged, it can't be restored.
- If the app is hosted on and then deleted from an App Service Environment, it can be restored only if the corresponding App Service Environment still exists.
- You can't restore a function app hosted on the Consumption plan or Elastic Premium plan.

This article describes how to restore a deleted web app by following procedures for the Azure portal or Azure PowerShell. You can also [restore a deleted Azure Functions app](#restore-a-deleted-azure-functions-app).

## Prerequisites

- To complete the restore in the **Azure portal**, you need an existing target app that is the same type as the deleted app, and created in the same region.

## Restore a deleted web app

You can restore a deleted web app in Azure App Service in the Azure portal or by using the [`Az PowerShell module`](/powershell/azure/).

- If you use PowerShell, you can restore to an existing app or create a new app.

- In the Azure portal, you can restore only to an existing web app.

- Both options allow you to restore the deleted content only, or both the content and the configuration settings.

- The restore process doesn't include any custom domains, bindings, or certificates that might be imported to the deleted app. After you restore the deleted app, you need to reimport these settings.

# [Azure portal](#tab/portal)

1. In the Azure portal, go to **App Services**.

1. In the top menubar, select **Manage Deleted Apps**. The **Manage Deleted App Services** pane opens.

1. Select the **Subscription** that contains the deleted app.

1. Use the **Deleted App Service** dropdown list and select the deleted app.

   > [!NOTE]
   > The list shows only apps deleted in the last 30 days.

   After you select the deleted app, the pane refreshes to show the app region and type.

1. Use the **Replacement App Service** dropdown list and select the existing app to use as the target for the restore process.

1. By default, only app content is restored. If you want to also restore the app configuration, select the **Restore App Configuration** checkbox.

1. Select **Recover**.

# [Azure PowerShell](#tab/azure-powershell)

Run the following commands to restore the deleted web app.

> [!NOTE]
> The following sections provide information for restoring a web app. To restore a deleted Azure Functions app, see [Restore a deleted Azure Functions app](#restore-a-deleted-azure-functions-app) later in this article.

### Identify the deleted app to restore

1. Re-register the App Service resource provider, which ensures the system can retrieve the list of deleted apps:

   ```powershell
   Register-AzResourceProvider -ProviderNamespace "Microsoft.Web"
   ```

1. Retrieve the list of deleted apps with the `Get-AzDeletedWebApp` command:

   ```powershell
   Get-AzDeletedWebApp
   ```

   The output shows detailed information for each deleted app:

   - **Deleted Site ID**: Unique identifier for the app, which is used for scenarios where multiple apps with the same name are deleted.
   - **Subscription ID**: Subscription that contains the deleted resource.
   - **Location**: Location of the original app.
   - **Resource Group Name**: Name of the original resource group.
   - **Name**: Name of the original app.
   - **Slot**: Name of the slot, such as _Production_.
   - **Deletion Time**: Date (mm/dd/yyyy) and time when the app was deleted.

1. Review the list and find the deleted web app you want to restore.

   To see the details for a specific deleted app, run the command again with the app name and location.

   Replace the `<deleted-app-name>` and `<deleted-app-location>` values with the deleted app information.

   ```powershell
   Get-AzDeletedWebApp -Name <deleted-app-name> -Location <deleted-app-location> 
   ```

### Restore the deleted web app

After you identify the deleted app to restore, use the [`Restore-AzDeletedWebApp`](/powershell/module/az.websites/restore-azdeletedwebapp) command. 

- The command restores a deleted web app into a target web app. The process overwrites the target app with the contents and settings of the deleted web app.

- The command requires various parameters for information about the deleted app or target app:

   - `Name`: The name of the deleted app or the target app, as indicated by the command.
   - `ResourceGroupName`: The name of the resource group that contains the deleted app.
   - `Slot`: The slot of the deleted app to restore in the target app.
   - `TargetResourceGroupName`: The name of the resource group that contains the target app.
   - `TargetName`: The name of the target app. If you want the command to create a new app, specify a globally unique name.
   - `TargetAppServicePlanName`: The App Service plan to link with the target app.

- When the target parameters aren't specified, the command sets the target values by using the deleted web app's resource group, name, and slot.

- If the target web app doesn't exist, the command creates a new app in the specified App Service plan.

- By default, the command restores both your app configuration and any content. To restore the content only, use the `-RestoreContentOnly` flag.

The following sections provide examples for using the `Restore-AzDeletedWebApp` command in different scenarios. Replace the various `<placeholder>` parameter values with the indicated information for your deleted app or the target app.

#### Restore to the original app name

```powershell
Restore-AzDeletedWebApp -TargetResourceGroupName <target-resource-group> -Name <deleted-app-name> -TargetAppServicePlanName <target-app-service-plan>
```

#### Restore to a different app name

```powershell
Restore-AzDeletedWebApp -ResourceGroupName <deleted-app-resource-group> -Name <deleted-app-name> -TargetResourceGroupName <target-resource-group> -TargetName <target-app-name> -TargetAppServicePlanName <target-app-service-plan>
```

#### Restore a slot to the target app

```powershell
Restore-AzDeletedWebApp -TargetResourceGroupName <target-resource-group> -Name <target-app-name> -TargetAppServicePlanName <target-app-service-plan> -Slot <deleted-app-slot>
```

> [!NOTE]
> Deployment slots aren't restored as part of your app. To restore a staging slot, use the `-Slot <slot-name>` flag. The command restores the original slot to the target app's production slot.

#### Restore only site content to the target app

```powershell
Restore-AzDeletedWebApp -TargetResourceGroupName <target-resource-group> -Name <deleted-app-name> -TargetAppServicePlanName <target-app-service-plan> -RestoreContentOnly
```

#### Restore when multiple deleted apps have same name (deleted site ID)

If multiple deleted apps have the same name, you can restore a specific app by specifying the site ID for the deleted app.

The `Get-AzDeletedWebApp` command returns the deleted site ID for the app version. The site ID has the form `/subscriptions/<deleted-app-subscription>/providers/Microsoft.Web/locations/<deleted-app-location>/deletedSites/<deleted-app-site-ID>`.

To restore the specific app, specify the deleted site ID:

```powershell
$deletedSite = Get-AzDeletedWebApp -ResourceGroupName <deleted-app-resource-group> -Name <deleted-app-name>
   
Restore-AzDeletedWebApp -TargetResourceGroupName <target-app-resource-group> -TargetName <target-app-name> -TargetAppServicePlanName <target-app-service-plan> -InputObject $deletedSite[0]
```

---

## Restore a deleted Azure Functions app

If a function app hosted on a Dedicated App Service plan is deleted, you can restore the app, as long as it uses the default App Service storage.

### Restore an app in a Dedicated App Service plan

To restore a function app in a new Dedicated App Service plan, follow the process to use the `Restore-AzDeletedWebApp` command, as described in [Restore when multiple deleted apps have same name (deleted site ID)](#restore-when-multiple-deleted-apps-have-same-name-deleted-site-id). For more information, see [Create a function app in the Azure portal](/azure/azure-functions/functions-create-function-app-portal#create-a-function-app).

### Restore an app in a Consumption plan or Elastic premium plan

If the deleted function app is hosted in a Consumption plan or Elastic premium plan, you can't use the `Restore-AzDeletedWebApp` command. The operation isn't supported because the content resides on Azure Files in a storage account.

A workaround is available, if you didn't hard delete the Azure Files storage account, or if the account exists and you didn't delete file shares.

Follow these steps:

1. Create a new function app in a Consumption or Premium plan. For more information, see [Create a function app in the Azure portal](/azure/azure-functions/functions-create-function-app-portal#create-a-function-app).

1. Set the following [app settings](/azure/azure-functions/functions-how-to-use-azure-function-app-settings?tabs=portal#settings) to refer to the old storage account, which contains the content from the previous app.

   | App setting | Suggested value |
   |---|---|
   | `AzureWebJobsStorage` | Connection string for the storage account used by the deleted app. |
   | `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` | Connection string for the storage account used by the deleted app. |
   | `WEBSITE_CONTENTSHARE` | File share on storage account used by the deleted app. |

## Related content

- [Get-AzDeletedWebApp](/powershell/module/az.websites/get-azdeletedwebapp) command reference
- [Restore-AzDeletedWebApp](/powershell/module/az.websites/restore-azdeletedwebapp) command reference
