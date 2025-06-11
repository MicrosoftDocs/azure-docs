---
title: Edit and manage logic app workflows in the Azure portal
description: Edit, enable, disable, or delete logic app resources and their workflows using the Azure portal.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.custom: mvc
ms.date: 03/17/2025
---

# Edit and manage logic app workflows in the Azure portal

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This guide shows how to manage Consumption or Standard logic app workflows using the Azure portal and perform tasks such as edit, disable, enable, and delete workflows.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An existing Consumption or Standard logic app workflow

<a name="find-logic-app"></a>

## Find and open a logic app resource

1. In the [Azure portal](https://portal.azure.com) search box, enter **logic apps**, and select **Logic apps**.

1. From the logic apps list, find your logic app resource by either browsing or filtering the list.

1. To open your logic app resource, select the app that you want to manage.

## View logic app properties

1. In the Azure portal, [find and open your logic app resource](#find-logic-app).

1. From your logic app's menu, under **Settings**, select **Properties**.

1. On the **Properties** pane, you can view and copy the following information about your logic app resource, for example:

   **Consumption**

   * **Name**
   * **Resource ID**
   * **Resource group**
   * **Location**
   * **Type** 
   * **Subscription Name**
   * **Subscription ID**
   * **Access Endpoint**
   * **Runtime outgoing IP addresses**
   * **Access endpoint IP addresses**
   * **Connector outgoing IP addresses**

   **Standard**

   * **Status**
   * **URL**
   * **Virtual IP address**
   * **Mode**
   * **Outbound IP address**
   * **Additional Outbound IP Addresses**
   * **FTP/deployment user**
   * **FTP host name**
   * **FTP diagnostic logs**
   * **FTP host name**
   * **FTPS diagnostic logs**
   * **Resource ID**
   * **Location**
   * **Resource Group**
   * **Subscription name**
   * **Subscription ID**

<a name="view-connections"></a>

## View connections

When you create connections in a workflow using [connectors managed by Microsoft](../connectors/managed.md), these connections are separate Azure resources with their own resource definitions and are hosted in global, multitenant Azure. Standard logic app workflows can also use [built-in service provider connectors](/azure/logic-apps/connectors/built-in/reference/) that natively run and are powered by the single-tenant Azure Logic Apps runtime. To view and manage these connections, follow these steps, based on the logic app resource type:

### [Consumption](#tab/consumption)

1. In the Azure portal, [find and open your logic app resource](#find-logic-app).

1. From the logic app menu, under **Development Tools**, select **API connections**.

1. On the **API connections** page, select a specific connection instance, which shows more information about that connection. To view the underlying connection resource definition, select **JSON View**.

### [Standard](#tab/standard)

1. In the Azure portal, [find and open your logic app resource](#find-logic-app).

1. From the logic app menu, under **Workflows**, select **Connections**.

1. Based on the connection type that you want to view, select one of the following options:

   | Option | Description |
   |--------|-------------|
   | **API Connections** | Connections created by globally hosted, multitenant Azure connectors. To view the underlying connection resource definition, select **JSON View**. |
   | **Service Provider Connections** | Connections created by built-in, service provider connectors, based on the service provider interface implementation. To view more information about a specific connection instance, in the **View Details** column, select the eye icon. To view the selected connection's underlying resource definition, select **JSON View**. |
   | **Function Connections** | Connections to functions in an associated function app. To view more information about a function, in the **View Details** column, select the eye icon. |
   | **JSON View** | The underlying resource definitions for all connections across workflows in the logic app resource |

---

<a name="add-workflow-portal"></a>

## Add blank workflow to logic app (Standard only)

While a Consumption logic app can have only one workflow, a Standard logic app resource can have multiple workflows. You can add blank workflows to a deployed Standard logic app resource and continue building the workflow in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), select your deployed Standard logic app resource.

1. On the logic app resource menu, under **Workflows**, select **Workflows**.

1. On the **Workflows** page toolbar, select **Add** > **Add**.

   :::image type="content" source="media/manage-logic-apps-with-azure-portal/add-new-workflow.png" alt-text="Screenshot shows selected logic app Workflows page and toolbar with Add command selected.":::

1. In the **New workflow** pane, provide the workflow name. Select either **Stateful** or **Stateless** **>** **Create**.

1. After the new workflow appears on the **Workflows** page, select that workflow to open the designer so you can build your workflow.

<a name="disable-enable-logic-apps"></a>

## Disable or enable a deployed logic app

Deployed Consumption and Standard logic apps have different ways to disable and enable their activity. 

### [Consumption](#tab/consumption)

<a name="considerations-stop-consumption-logic-apps"></a>

#### Considerations for disabling a deployed Consumption logic app

Disabling a Consumption logic app affects all workflow instances in the following ways:

* Azure Logic Apps continues all in-progress and pending workflow instances until they finish running. Based on the volume or backlog, this process might take time to complete.

* Azure Logic Apps doesn't create or run new workflow instances.

* You can resubmit workflow runs while the logic app is disabled.

* The workflow trigger doesn't fire while the logic app is disabled. However, the trigger state remembers the point where you disabled the logic app. When you restart the logic app, the trigger fires for all unprocessed items since the last workflow run.

  To stop the trigger from firing on all unprocessed items since the last workflow run, you must [clear the trigger state](#post-stoppage).

<a name="disable-enable-consumption-logic-apps"></a>

#### Disable or enable a deployed Consumption logic app

You can disable or enable one or multiple Consumption logic apps at the same time.

1. In the [Azure portal](https://portal.azure.com) search box, enter **logic apps**, and select **Logic apps**.

1. On the **Logic apps** page, view only the Consumption logic apps using the **Plan** filter.

1. Based on whether you're disabling or enabling your logic apps, view only the **Enabled** or **Disabled** logic apps using the **Status** filter.

1. In the checkbox column, select one or multiple logic apps.

   * To stop the selected running logic apps, select **Disable/Stop**.
   * To restart the selected stopped logic apps, select **Enable/Start**.

1. Confirm your selection.

1. To check whether your task succeeded or failed, on main Azure toolbar, open the **Notifications** list (bell icon).

### [Standard](#tab/standard)

You can stop, start, or restart a Standard logic app, which affects all workflow instances. You can also restart a Standard logic app without first stopping its activity. Your Standard logic app can have multiple workflows, so you can either stop the entire logic app, or you can disable or enable individual workflows.

Stopping a Standard logic app versus disabling a child workflow have different effects, so review the following considerations before you continue:

- [Considerations for disabling Standard logic apps](#considerations-stop-standard-logic-apps)
- [Considerations for disabling a Standard workflow](#considerations-disable-enable-standard-workflows)

<a name="considerations-stop-standard-logic-apps"></a>

#### Considerations for disabling Standard logic apps

Disabling a Standard logic app affects all its workflow instances in the following ways:

* Azure Logic Apps immediately cancels all in-progress and pending workflow runs.

* Azure Logic Apps doesn't create or run new workflow instances.

* You can resubmit workflow runs while the logic app is disabled.

* Workflow triggers don't fire while the logic app is disabled. However, the trigger states remember the point where you disabled the logic app. When you re-enable the logic app, the triggers fire for all unprocessed items since the last time that the corresponding workflows ran.

  To stop the triggers from firing on all unprocessed items since the last time that the workflows ran, you must [clear the trigger state for each workflow](#post-stoppage).

<a name="disable-enable-standard-logic-apps"></a>

#### Disable or enable deployed Standard logic apps

You can disable or enable one or multiple Standard logic apps at the same time.

1. In the [Azure portal](https://portal.azure.com) search box, enter **logic apps**, and select **Logic apps**.

1. On the **Logic apps** page, view only the Standard logic apps using the **Plan** filter.

1. Based on whether you're disabling or enabling your logic apps, view only the **Enabled** or **Disabled** logic apps using the **Status** filter.

1. In the checkbox column, select one or multiple logic apps.

   * To stop the selected logic apps, select **Disable/Stop**.
   * To restart the selected logic apps, select **Enable/Start**.

1. Confirm your selection.

1. To check whether your task succeeded or failed, on main Azure toolbar, open the **Notifications** list (bell icon).

<a name="restart-standard-logic-app"></a>

#### Restart a deployed Standard logic app without disabling

You can restart a single Standard logic app at any time.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, select **Overview**.

1. On the **Overview** page toolbar, select **Restart**.

1. To check whether your task succeeded or failed, on main Azure toolbar, open the **Notifications** list (bell icon).

<a name="considerations-disable-enable-standard-workflows"></a>

#### Considerations for disabling Standard workflows

Disabling a workflow affects all its workflow instances in the following ways:

* Azure Logic Apps continues all in-progress and pending workflow runs until they finish. Based on the volume or backlog, this process might take time to complete.

  > [!TIP]
  >
  > To reduce costs resulting from resources and workflow instances that might otherwise take longer 
  > to scale down in nonproduction environments for load and performance testing, you can manually 
  > stop a workflow. This action cancels in-progress and pending workflow runs.
  >
  > For this task, add the following settings to the host settings for your Standard logic app resource:
  >
  > **Important**: Use following settings only in nonproduction environments. Follow each 
  > workflow ID with a colon (**:**), and separate workflow IDs with a semicolon (**;**):
  >
  > **`"Jobs.SuspendedJobPartitionPrefixes": "<workflow-ID>:;<workflow-ID>:",`**
  >
  > **`"Jobs.CleanupJobPartitionPrefixes": "<workflow-ID>:;<workflow-ID>:"`**
  >
  > For more information, see [Edit host and app settings for Standard logic apps](edit-app-settings-host-settings.md).

* Azure Logic Apps doesn't create or run new workflow instances.

* You can resubmit workflow runs while the workflow is disabled.

* The workflow trigger doesn't fire while the logic app or workflow is disabled. However, the trigger state remembers the point where you disabled the workflow. When you restart the logic app or enable the workflow, the trigger fires for all unprocessed items since the last workflow run.

  To stop the trigger from firing on all unprocessed items since the last workflow run, you must [clear the trigger state](#post-stoppage).

<a name="disable-enable-standard-workflows"></a>

#### Disable or enable Standard workflows

To stop the trigger from firing the next time when the trigger condition is met, disable your workflow. You can disable or enable one or multiple Standard logic apps at the same time.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Workflows**, select **Workflows**.

1. In the checkbox column, select the workflow to disable or enable.

1. On the **Workflows** page toolbar, select **Disable** or **Enable**, based on the current activity state.

1. To confirm whether your operation succeeded or failed, on main Azure toolbar, open the **Notifications** list (bell icon).

---

<a name="post-stoppage"></a>

## Post logic app or workflow stoppage

While a logic app is stopped or a workflow is disabled, the workflow trigger doesn't fire the next time that the trigger condition is met. However, the trigger state remembers the point at where you stopped the logic app or disabled the workflow. When you restart the logic app or re-enable the workflow, the trigger fires for all unprocessed items since the last workflow run.

To stop the trigger from firing on all unprocessed items since the last workflow run, you must clear the trigger state before you restart the logic app or re-enable the workflow.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app workflow, and edit any part of the workflow trigger.

1. Save your changes. This step resets your trigger's current state.

1. [Restart your logic app](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=consumption#disable-enable-logic-apps).

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app workflow, and edit any part of the workflow trigger.

1. Save your changes. This step resets the trigger's current state.

1. Repeat for each existing workflow.

1. [Restart your logic app](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=standard#disable-enable-logic-apps).

---

<a name="delete-logic-apps"></a>

## Delete logic apps

### [Consumption](#tab/consumption)

<a name="considerations-delete-consumption-logic-apps"></a>

#### Considerations for deleting Consumption logic apps

You can't recover a deleted Consumption logic app resource. Deleting a Consumption logic app affects all its workflow instances in the following ways:

* Azure Logic Apps makes a best effort to cancel any in-progress and pending workflow runs.

  Even with a large volume or backlog, most runs are canceled before they finish or start. However, the cancellation process might take time to complete. Meanwhile, some runs might get picked up for execution while the service works through the cancellation process.

* Azure Logic Apps doesn't create or run new workflow instances.

* If you delete a logic app and workflow, but you then recreate the same logic app and workflow, the recreated workflow doesn't have the same metadata as the deleted workflow.

  [!INCLUDE [refresh-metadata-caller-workflow](includes/refresh-metadata-caller-workflow.md)]

<a name="delete-consumption-logic-apps"></a>

#### Delete Consumption logic apps

You can delete one or multiple Consumption logic apps at the same time.

1. In the [Azure portal](https://portal.azure.com) search box, enter **logic apps**, and select **Logic apps**.

1. On the **Logic apps** page, view only the Consumption logic apps using the **Plan** filter.

1. In the checkbox column, select one or multiple logic apps to delete. On the toolbar, select **Delete**.

1. When the confirmation box appears, enter **yes**, and select **Delete**.

1. To check whether your task succeeded or failed, on main Azure toolbar, open the **Notifications** list (bell icon).

### [Standard](#tab/standard)

You can delete one or multiple Standard logic apps at the same time. A Standard logic app can have multiple workflows, so you can either delete the entire logic app or delete individual workflows.

<a name="considerations-delete-standard-logic-apps"></a>

#### Considerations for deleting Standard logic apps

Deleting a Standard logic app affects all its workflow instances in the following ways:

* Azure Logic Apps immediately cancels any in-progress and pending workflow runs. However, the platform doesn't run cleanup tasks on the storage used by the logic app.

* Azure Logic Apps doesn't create or run new workflow instances.

* Although you can [manually recover deleted Standard logic apps](#recover-deleted-standard-logic-apps), using source control to manage your Standard logic apps makes recovery and redeployment much easier.

* If you don't use source control, and you might have to later recover a deleted Standard logic app, make sure to save any custom settings that you need for recovery before you delete the logic app.

  1. In the [Azure portal](https://portal.azure.com), go to the Standard logic app.

  1. On the logic app menu, under **Settings**, select **Environment variables**.

  1. On the **App settings** tab, find, copy, and save any custom app settings and values that you need for later recovery.

  1. On the logic app menu, under **Settings**, select **Configuration**.

  1. On each settings tab, note any custom settings that you need for later recovery.

* If you delete a logic app and its workflows, but you then recreate the same logic app and workflows, the recreated logic app and workflows don't have the same metadata as the deleted resources.

  [!INCLUDE [refresh-metadata-caller-workflow](includes/refresh-metadata-caller-workflow.md)]

<a name="delete-standard-logic-apps"></a>

#### Delete Standard logic apps

1. In the [Azure portal](https://portal.azure.com) search box, enter **logic apps**, and select **Logic apps**.

1. On the **Logic apps** page, view only the Standard logic apps using the **Plan** filter.

1. In the checkbox column, select one or multiple logic apps to delete. On the toolbar, select **Delete**.

1. When the confirmation box appears, enter **yes**, and select **Delete**.

1. To check whether your task succeeded or failed, on main Azure toolbar, open the **Notifications** list (bell icon).

<a name="considerations-delete-standard-workflows"></a>

#### Considerations for deleting Standard workflows

You can delete one or multiple Standard workflows at the same time. Deleting a Standard workflow affects its workflow instances in the following ways:

* Azure Logic Apps immediately cancels any in-progress and pending workflow runs. The platform also performs cleanup tasks on the storage used by the workflow.

* Azure Logic Apps doesn't create or run new workflow instances.

* If you delete a workflow, but you then recreate the same workflow, the recreated workflow doesn't have the same metadata as the deleted workflow.

  [!INCLUDE [refresh-metadata-caller-workflow](includes/refresh-metadata-caller-workflow.md)]

<a name="delete-standard-workflows"></a>

#### Delete Standard workflows

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Workflows**, select **Workflows**. In the checkbox column, select a single or multiple workflows to delete.

1. On the toolbar, select **Delete**.

1. To confirm whether your operation succeeded or failed, on main Azure toolbar, open the **Notifications** list (bell icon).

<a name="recover-deleted-standard-logic-apps"></a>

## Recover a deleted Standard logic app

The steps to recover a deleted Standard logic app vary based on whether you use source control and the hosting option for your logic app.

Before you try to recover a deleted logic app, review the following considerations:

* The run history from the deleted logic app is unavailable in the recovered logic app.

* If your workflow starts with the **Request** trigger, the callback URL for the recovered logic app differs from the URL for the deleted logic app.

#### With source control

If you use source control, you can recover a deleted Standard logic app resource, based on the hosting option:

| Hosting option | Prerequisites | Recovery steps |
|----------------|---------------|----------------|
| **Workflow Service Plan** | None | Redeploy your logic app. |
| **App Service Environment V3** | Before you delete your app, download the Standard logic app from the Azure portal. For more information, see [Download Standard logic app artifacts from portal](/azure/logic-apps/set-up-devops-deployment-single-tenant-azure-logic-apps?tabs=github#download-standard-logic-app-artifacts-from-portal). | Redeploy your logic app. |

#### Without source control

To recover a deleted Standard logic app that uses the **Workflow Service Plan** hosting option and runs in single-tenant Azure Logic Apps, try the following steps:

##### 1. Get storage metadata 

1. In the [Azure portal](https://portal.azure.com), confirm that the storage account used by your logic app still exists. If the storage account is deleted, you have to [first recover the deleted storage account](/azure/storage/common/storage-account-recover).

   1. To identify the storage account name, open your logic app.

   1. On the logic app menu, under **Settings**, select **Environment variables**.

   1. On the **Environment variables** page, under **App settings**, find the app setting named [**AzureWebJobsStorage**](/azure/logic-apps/edit-app-settings-host-settings?tabs=azure-portal#reference-for-app-settings---localsettingsjson).

1. Go to the storage account. On the storage account menu, under **Security + networking**, select **Access keys**.

1. On the **Access keys** page, copy and save the primary connection string somewhere secure for later use in this guide.

   The connection string uses the following format:

   **DefaultEndpointsProtocol=https;AccountName=<*storage-account-name*>;AccountKey=<*access-key*>;EndpointSuffix=core.windows.net**

1. On the storage account menu, under **Data storage**, select **File shares**. Copy and save the file share name for later use in this guide.

> [!IMPORTANT]
>
> When you handle sensitive information, such as connection strings that include usernames, passwords, 
> access keys, and so on, make sure that you use the most secure authentication flow available.
>
> For example, Standard logic app workflows don't support secure data types, such as **`securestring`** 
> and **`secureobject`**, aren't supported. Microsoft recommends that you authenticate access to Azure 
> resources with a [managed identity](/entra/identity/managed-identities-azure-resources/overview) 
> when possible, and assign a role with the least necessary privilege.
>
> If the managed identity capability is unavailable, secure your connection strings through other measures, 
> such as [Azure Key Vault](/azure/key-vault/general/overview), which you can use with 
> [app settings](/azure/logic-apps/edit-app-settings-host-settings?tabs=azure-portal#reference-for-app-settings---localsettingsjson) in your Standard logic app resource. 
> You can then [directly reference these secure strings](/azure/app-service/app-service-key-vault-references). 
>
> Similar to ARM templates, where you can define environment variables at deployment time, you can define app 
> settings in your [logic app workflow definition](/azure/templates/microsoft.logic/workflows). You can then 
> capture dynamically generated infrastructure values, such as connection endpoints, storage strings, and so on. 
> For more information, see [Application types for the Microsoft identity platform](/entra/identity-platform/v2-app-types).

##### 2. Create new Standard logic app

1. In the [Azure portal](https://portal.azure.com), create a new Standard logic app resource with the same hosting option and pricing tier. You can use either a new name or reuse the name from the deleted logic app.

1. Before you continue, [disable the new logic app](#disable-enable-standard-logic-apps).

1. On the logic app menu, under **Settings**, select **Environment variables**. On the **App settings** tab, update the following values. Make sure to save your changes when you finish.

   | App setting | Replacement value |
   |-------------|-------------------|
   | **AzureWebJobsStorage** | Replace the existing value with the previously copied connection string from your storage account. |
   | **WEBSITE_CONTENTAZUREFILECONNECTIONSTRING** | Replace the existing value with the previously copied connection string from your storage account. |
   | **WEBSITE_CONTENTSHARE** | Replace the existing value with the previously copied file share name. |

1. On your logic app menu, under **Workflows**, select **Connections**.

1. Open each connection. On the connection menu, under **Settings**, select **Access policies**.

1. In the **Action** column, select **Delete** to delete the access policy for the deleted logic app.

1. On the **Access policies** toolbar, select **Add** so you can add a new access policy, and select your replacement logic app.

1. Return to your replacement logic app.

1. If you have custom settings to restore, on the logic app menu, under Settings, selects **Environment variables** or **Configuration**, based on the types of settings that you have.

1. When you're done, restart your logic app.

---

<a name="manage-logic-app-versions"></a>

## Manage logic app versions (Consumption only)

When you save changes to your Consumption logic app workflow, Azure saves the version before you made your changes, and your edited version becomes the current version. You can view these previous versions, select a previous version to promote over the current version, and edit the selected version before you finish the promotion process.

<a name="find-version-history"></a>

### View previous versions

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app.

1. On the logic app menu, under **Development Tools**, select **Versions**.

   :::image type="content" source="media/manage-logic-apps-with-azure-portal/logic-apps-menu-versions.png" alt-text="Screenshot shows Azure portal, Consumption logic app menu with Versions selected, and previous logic app versions.":::

1. From the **Version** list, select the workflow version that you want.

   To filter the list, in the **Versions** page search bar, enter the version ID, if you know the ID.

   The **History version** page shows the selected version in read-only mode. You can change between the designer view and code view.

   :::image type="content" source="media/manage-logic-apps-with-azure-portal/history-version.png" alt-text="Screenshot shows history version page with designer view and code view options.":::

<a name="promote-previous-versions"></a>

### Promote a previous version over the current version

1. In the [Azure portal](https://portal.azure.com), [view the previous version that you want to promote](#find-version-history).

1. On the **History version** toolbar, select **Promote**.

   :::image type="content" source="media/manage-logic-apps-with-azure-portal/promote-button.png" alt-text="Screenshot shows History version page toolbar with selected Promote button.":::

   The workflow designer opens the selected workflow version.

1. Optionally make any edits that you want to the workflow.

   You can change between **Designer** and **Code view**. You can also update the **Parameters**.

1. To save any updates and finish promotion, on the designer toolbar, select **Save**. To cancel your changes, select **Discard**.

When you view your logic app version history again, the promoted version now appears first in the list with a new identifier.

## Related content

* [Monitor logic apps](monitor-logic-apps.md)
