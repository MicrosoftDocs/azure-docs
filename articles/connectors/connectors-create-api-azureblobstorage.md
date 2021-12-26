---
title: Connect to Azure Blob Storage
description: Create and manage blobs in Azure storage accounts by using Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/11/2021
tags: connectors
---

# Create and manage blobs in Azure Blob Storage by using Azure Logic Apps

From your workflow in Azure Logic Apps, you can access and manage files stored as blobs in your Azure storage account by using the [Azure Blob Storage connector](/connectors/azureblobconnector/). This connector provides triggers and actions that your workflow can use for blob operations. You can then automate tasks to manage files in your storage account. For example, [connector actions](/connectors/azureblobconnector/#actions) include checking, deleting, reading, and uploading blobs. The [available trigger](/connectors/azureblobconnector/#triggers) fires when a blob is added or modified.

You can connect to Blob Storage from both **Logic App (Consumption)** and **Logic App (Standard)** resource types. You can use the connector with logic app workflows in multi-tenant Azure Logic Apps, single-tenant Azure Logic Apps, and the integration service environment (ISE). With **Logic App (Standard)**, Blob Storage provides built-in operations *and* managed connector operations.

> [!IMPORTANT]
> A logic app workflow can't directly access a storage account behind a firewall if they're both in the same region. 
> As a workaround, your logic app and storage account can be in different regions. For more information about enabling access from Azure Logic Apps to storage accounts behind firewalls, review the [Access storage accounts behind firewalls](#access-storage-accounts-behind-firewalls) section later in this topic.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [Azure storage account and storage container](../storage/blobs/storage-quickstart-blobs-portal.md)

- A logic app workflow from which you want to access your Blob Storage account. If you want to start your workflow with a Blob Storage trigger, you need a [blank logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Limits

- For logic app workflows running in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), this connector's ISE-labeled version uses the [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) instead.

- By default, Blob Storage actions can read or write files that are *50 MB or smaller*. To handle files larger than 50 MB but up to 1024 MB, Blob Storage actions support [message chunking](../logic-apps/logic-apps-handle-large-messages.md). The [**Get blob content** action](/connectors/azureblobconnector/#get-blob-content) implicitly uses chunking.

- Blob Storage triggers don't support chunking. When requesting file content, triggers select only files that are 50 MB or smaller. To get files larger than 50 MB, follow this pattern:

  - Use a Blob Storage trigger that returns file properties, such as [**When a blob is added or modified (properties only)**](/connectors/azureblobconnector/#when-a-blob-is-added-or-modified-(properties-only)).

  - Follow the trigger with the Blob Storage [**Get blob content** action](/connectors/azureblobconnector/#get-blob-content), which reads the complete file and implicitly uses chunking.

## Connector reference

For more technical details about this connector, such as triggers, actions, and limits, review the [connector's reference page](/connectors/azureblobconnector/). If you don't want to use the Blob Storage connector, you can the [use HTTP trigger or action along with a a managed identity for blob operations instead](#access-blob-storage-with-managed-identities).

## Add Blob Storage trigger

In Azure Logic Apps, every workflow must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific event happens or when a specific condition is met.

This connector has one available trigger, called either [**When a blob is Added or Modified in Azure Storage** or **When a blob is added or modified (properties only)**](/connectors/azureblobconnector/#when-a-blob-is-added-or-modified-(properties-only)). The trigger fires when a blob's properties are added or updated in your storage container. Each time, the Azure Logic Apps engine creates a logic app instance and starts running your workflow.

### [Consumption](#tab/consumption)

To add an Azure Blob Storage trigger to a logic app workflow in multi-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. In the designer search box, enter `Azure blob` as your filter. From the triggers list, select the trigger named **When a blob is added or modified (properties only)**.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-trigger-add.png" alt-text="Screenshot showing Azure portal and workflow designer with a Consumption logic app and the trigger named 'When a blob is added or modified (properties only)' selected.":::

1. If you're prompted for connection details, [create your Azure Blob Storage connection now](#connect-blob-storage-account).

1. Provide the necessary information for the trigger.

   1. For the **Container** property value, select the folder icon to browse for your blob storage container. Or, enter the path manually.

   1. Configure other trigger settings as needed.

      :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-trigger-configure.png" alt-text="Screenshot showing Azure Blob trigger with parameters configuration.":::

1. Add one or more actions to your workflow.

1. On the designer toolbar, select **Save** to save your changes.

### [Standard](#tab/standard)

To add an Azure Blob trigger to a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. On the designer, select **Choose an operation**. In the **Add a trigger** pane that opens, under the **Choose an operation** search box, select either **Built-in** to find the **Azure Blob** *built-in* trigger, or select **Azure** to find the **Azure Blob Storage** *managed connector* trigger.

1. In the search box, enter `Azure blob`. From the triggers list, select the trigger named **When a blob is Added or Modified in Azure Storage**.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-trigger-add.png" alt-text="Screenshot showing Azure portal, workflow designer, Standard logic app workflow and Azure Blob trigger selected.":::

1. If you're prompted for connection details, [create your Azure Blob Storage connection now](#connect-blob-storage-account).

1. Provide the necessary information for the trigger. On the **Parameters** tab, add the **Blob Path** for the blob that you want to monitor.

   1. To find your blob path, open your storage account in the Azure portal.

   1. In the navigation menu, under **Data Storage**, select **Containers**.

   1. Select your blob container. On the container navigation menu, under **Settings**, select **Properties**.

   1. Copy the **URL** value, which is the path to the blob. The path resembles `https://<storage-container-name>/<folder-name>/{name}`. Provide your container name and folder name instead, but keep the `{name}` literal string.

      :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-trigger-configure.png" alt-text="Screenshot showing the workflow designer for a Standard logic app workflow with a Blob Storage trigger and parameters configuration.":::

1. Continue creating your workflow by adding one or more actions.

1. On the designer toolbar, select **Save** to save your changes.

---

<a name="add-action"></a>

## Add Blob Storage action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a step in your workflow that follows a trigger or another action.

### [Consumption](#tab/consumption)

To add an Azure Blob Storage action to a logic app workflow in multi-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**Recurrence** trigger](connectors-native-recurrence.md).

1. Under the trigger or action where you want to add the Blob Storage action, select **New step** or **Add an action**, if between steps.

1. In the designer search box, enter `Azure blob`. Select the Blob Storage action that you want to use.

   This example uses the action named **Get blob content**.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-action-add.png" alt-text="Screenshot of Consumption logic app in designer, showing list of available Blob Storage actions.":::

1. If you're prompted for connection details, [create a connection to your Blob Storage account](#connect-blob-storage-account).

1. Provide the necessary information for the action.

    1. For the **Blob** property value, select the folder icon to browse for your blob storage container. Or, enter the path manually.

       :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-action-configure.png" alt-text="Screenshot of Consumption logic app in designer, showing configuration of Blob Storage action.":::

    1. Configure other action settings as needed.

### [Standard](#tab/standard)

To add an Azure Blob action to a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), pen your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**Recurrence** trigger](connectors-native-recurrence.md).

1. Under the trigger or action where you want to add the Blob Storage action, select **Insert a new step** (**+**) > **Add an action**.

1. On the designer, make sure that **Add an operation** is selected. In the **Add an action** pane that opens, under the **Choose an operation** search box, select either **Built-in** to find the **Azure Blob** *built-in* actions, or select **Azure** to find the **Azure Blob Storage** *managed connector* actions.

1. In the search box, enter `Azure blob`. Select the Azure Blob action that you want to use.

   This example uses the action named **Reads Blob Content from Azure Storage**, which only reads the blob content. To later view the content, add a different action that creates a file with the blob content using another connector. For example, you can add a OneDrive action that creates a file based on the blob content.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-action-add.png" alt-text="Screenshot showing the Azure portal and workflow designer with a Standard logic app workflow and the available Azure Blob Storage actions.":::

1. If you're prompted for connection details, [create a connection to your Blob Storage account](#connect-blob-storage-account).

1. Provide the necessary information for the action.

    1. For **Container Name**, enter the path for the blob storage container that you want to use.

    1. For the **Blob name** property value, enter the path for the blob that you want to use.

       :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-action-configure.png" alt-text="Screenshot of Standard logic app in designer, showing selection of Blob Storage trigger.":::

    1. Configure other action settings as needed.

1. On the designer toolbar, select **Save**.

1. Test your logic app to make sure your selected container contains a blob.

---

<a name="connect-blob-storage-account"></a>

## Connect to Blob Storage account

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

### [Consumption](#tab/consumption)

Before you can configure your [Azure Blob Storage trigger](#add-blob-storage-trigger) or [Azure Blob Storage action](#add-blob-storage-action), you need to connect to a storage account. A connection requires the following properties:

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection name** | Yes | <*connection-name*> | The name to use for your connection. |
| **Storage Account** | Yes | <*storage-account*> | Select your storage account from the list, or provide a string. <p>**Note**: To find the connection string, go to the storage account's page. In the navigation menu, under **Security + networking**, select **Access keys** > **Show keys**. Copy one of the available connection string values. |
|||||

To create an Azure Blob Storage connection from a logic app workflow in multi-tenant Azure Logic Apps, follow these steps:

1. For **Connection name**, provide a name for your connection.

1. For **Storage Account**, select the storage account where your blob container exists. Or, select **Manually enter connection information** to provide the path yourself.

1. Select **Create** to establish your connection.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-connection-create.png" alt-text="Screenshot showing the workflow designer with a Consumption logic app workflow and a prompt to add a new connection for the Azure Blob Storage step.":::

> [!NOTE]
> After you create your connection, if you have a different existing Azure Blob storage connection 
> that you want to use instead, select **Change connection** in the trigger or action details editor.

If you have problems connecting to your storage account, review [how to access storage accounts behind firewalls](#access-storage-accounts-behind-firewalls).

### [Standard](#tab/standard)

Before you can configure your [Azure Blob trigger](#add-blob-storage-trigger) or [Azure Blob action](#add-blob-storage-action), you need to connect to a storage account. A connection requires the following properties:

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection name** | Yes | <*connection-name*> | The name to use for your connection. |
| **Azure Blob Storage Connection String** | Yes | <*storage-account*> | Select your storage account from the list, or provide a string. <p>**Note**: To find the connection string, go to the storage account's page. In the navigation menu, under **Security + networking**, select **Access keys** > **Show keys**. Copy one of the available connection string values. |
|||||

To create an Azure Blob Storage connection from a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. For **Connection name**, enter a name for your connection.

1. For **Azure Blob Storage Connection String**, enter the connection string for the storage account that you want to use.

1. Select **Create** to establish your connection.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-connection-create.png" alt-text="Screenshot that shows the workflow designer with a Standard logic app workflow and a prompt to add a new connection for the Azure Blob Storage step.":::

> [!NOTE]
> After you create your connection, if you have a different existing Azure Blob storage connection 
> that you want to use instead, select **Change connection** in the trigger or action details editor.

If you have problems connecting to your storage account, review [how to access storage accounts behind firewalls](#access-storage-accounts-behind-firewalls).

---

## Access storage accounts behind firewalls

You can add network security to an Azure storage account by [restricting access with a firewall and firewall rules](../storage/common/storage-network-security.md). However, this setup creates a challenge for Azure and other Microsoft services that need access to the storage account. Local communication in the data center abstracts the internal IP addresses, so you can't set up firewall rules with IP restrictions.

To access storage accounts behind firewalls using the Blob Storage connector:

- [Access storage accounts in other regions](#access-storage-accounts-in-other-regions)
- [Access storage accounts through a trusted virtual network](#access-storage-accounts-through-trusted-virtual-network)

Other solutions for accessing storage accounts behind firewalls:

- [Access storage accounts as a trusted service with managed identities](#access-blob-storage-with-managed-identities)
- [Access storage accounts through Azure API Management](#access-storage-accounts-through-azure-api-management)

### Access storage accounts in other regions

Logic app workflows can't directly access storage accounts behind firewalls when they're both in the same region. As a workaround, put your logic app resources in a different region than your storage account. Then, give access to the [outbound IP addresses for the managed connectors in your region](/connectors/common/outbound-ip-addresses#azure-logic-apps).

> [!NOTE]
> This solution doesn't apply to the Azure Table Storage connector and Azure Queue Storage connector. 
> Instead, to access your Table Storage or Queue Storage, [use the built-in HTTP trigger and action](../logic-apps/logic-apps-http-endpoint.md).

To add your outbound IP addresses to the storage account firewall, follow these steps:

1. Note the [managed connector outbound IP addresses](/connectors/common/outbound-ip-addresses#azure-logic-apps) for your logic app resource's region.

1. In the [Azure portal](https://portal.azure.com), find and open your storage account resource.

1. On the storage account navigation menu, under **Security + networking**, select **Networking**.

   1. Under **Allow access from**, select **Selected networks**, which shows the relevant settings.

   1. Under **Firewall**, add the IP addresses or ranges that need access. If you need to access the storage account from your computer, select **Add your client IP address**.

      :::image type="content" source="./media/connectors-create-api-azureblobstorage/storage-ip-configure.png" alt-text="Screenshot of blob storage account networking page in Azure portal, showing firewall settings to add IP addresses and ranges to the allowlist.":::

   1. When you're done, select **Save**.

### Access storage accounts through trusted virtual network

You can put the storage account in an Azure virtual network that you manage, and then add that virtual network to the trusted virtual networks list. To give your logic app access to the storage account through a [trusted virtual network](../virtual-network/virtual-networks-overview.md), you need to deploy that logic app to an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), which can connect to resources in a virtual network. You can then add the subnets in that ISE to the trusted list. Azure Storage connectors, such as the Blob Storage connector, can directly access the storage container. This setup is the same experience as using the service endpoints from an ISE.

### Access storage accounts through Azure API Management

If you use a dedicated tier for [API Management](../api-management/api-management-key-concepts.md), you can front the Storage API by using API Management and permitting the latter's IP addresses through the firewall. Basically, add the Azure virtual network that's used by API Management to the storage account's firewall setting. You can then use either the API Management action or the HTTP action to call the Azure Storage APIs. However, if you choose this option, you have to handle the authentication process yourself. For more info, see [Simple enterprise integration architecture](/azure/architecture/reference-architectures/enterprise-integration/basic-enterprise-integration).

## Access Blob Storage with managed identities

If you want to access Blob Storage without using this connector, you can use [managed identities for authentication](../active-directory/managed-identities-azure-resources/overview.md) instead. You can create an exception that gives Microsoft trusted services, such as a managed identity, access to your storage account through a firewall.

To use managed identities in your logic app to access Blob Storage, follow these steps:

1. [Configure access to your storage account](#configure-storage-account-access).

1. [Create a role assignment for your logic app](#create-role-assignment-logic-app).

1. [Enable support for the managed identity in your logic app](#enable-managed-identity-support).

> [!NOTE]
> Limitations for this solution:
>
> - You can *only* use the HTTP trigger or action in your workflow.
> - You must set up a managed identity to authenticate your storage account connection.
> - You can't use built-in Blob Storage operations if you authenticate with a managed identity.
> - For logic apps in a single-tenant environment, only the system-assigned managed identity is 
> available and supported, not the user-assigned managed identity.

### Configure storage account access

To set up the exception and managed identity support, first configure appropriate access to your storage account:

1. In the [Azure portal](https://portal.azure.com), find and open your storage account resource.

1. On the storage account navigation menu, under **Security + networking**, select **Networking**.

   1. Under **Allow access from**, select **Selected networks**, which shows the relevant settings.

   1. If you need to access the storage account from your computer, under **Firewall**, select **Add your client IP address**.

   1. Under **Exceptions**, select **Allow trusted Microsoft services to access this storage account**.

      :::image type="content" source="./media/connectors-create-api-azureblobstorage/storage-networking-configure.png" alt-text="Screenshot showing Azure portal and Blob Storage account networking pane with allow settings.":::

   1. When you're done, select **Save**.

> [!NOTE]
> If you receive a **403 Forbidden** error when you try to connect to the storage account from your workflow, 
> multiple possible causes exist. Try the following resolution before moving on to additional steps. First, 
> disable the setting **Allow trusted Microsoft services to access this storage account** and save your changes. 
> Then, re-enable the setting, and save your changes again.

<a name="create-role-assignment-logic-app"></a>

### Create role assignment for logic app

Next, [enable managed identity support](../logic-apps/create-managed-service-identity.md) on your logic app resource.

The following steps are the same for Consumption logic apps in multi-tenant environments and Standard logic apps in single-tenant environments.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. On the logic app resource navigation menu, under **Settings**, select **Identity.**

1. On the **System assigned** pane, set **Status** to **On**, if not already enabled, select **Save**, and confirm your changes. Under **Permissions**, select **Azure role assignments**.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/role-assignment-add-1.png" alt-text="Screenshot showing the Azure portal and logic app resource menu with the 'Identity' settings pane and 'Azure role assignment permissions' button.":::

1. On the **Azure role assignments** pane, select **Add role assignment**.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/role-assignment-add-2.png" alt-text="Screenshot showing the logic app role assignments pane with the selected subscription and button to add a new role assignment.":::

1. On the **Add role assignments** pane, set up the new role assignment with the following values:

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Scope** | <*resource-scope*> | The resource set where you want to apply the role assignment. For this example, select **Storage**. |
   | **Subscription** | <*Azure-subscription*> | The Azure subscription for your storage account. |
   | **Resource** | <*storage-account-name*> | The name for the storage account that you want to access from your logic app workflow. |
   | **Role** | <*role-to-assign*> | The role that your scenario requires for your workflow to work with the resource. This example requires **Storage Blob Data Contributor**, which allows read, write, and delete access to blob containers and date. For permissions details, move your mouse over the information icon next to a role in the drop-down menu. |
   ||||

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/role-assignment-configure.png" alt-text="Screenshot of role assignment configuration pane, showing settings for scope, subscription, resource, and role.":::

1. When you're done, select **Save** to finish creating the role assignment.

<a name="enable-managed-identity-support"></a>

### Enable managed identity support on logic app

Next, add an [HTTP trigger or action](connectors-native-http.md) in your workflow. Make sure to [set the authentication type to use the managed identity](../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity).

The following steps are the same for Consumption logic apps in multi-tenant environments and Standard logic apps in single-tenant environments.

1. Open your logic app workflow in the designer.

1. Based on your scenario, add an **HTTP** trigger or action to your workflow. Set up the required parameter values.

   1. Select a **Method** for your request. This example uses the HTTP **PUT** method.

   1. Enter the **URI** for your blob. The path resembles `https://<storage-container-name>/<folder-name>/{name}`. Provide your container name and folder name instead, but keep the `{name}` literal string.

   1. Under **Headers**, add the following items:

      - The blob type header `x-ms-blob-type` with the value `BlockBlob`.

      - The API version header `x-ms-version` with the appropriate value.

      For more information, see [Authenticate access with managed identity](../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity) and [Versioning for Azure Storage services](/rest/api/storageservices/versioning-for-the-azure-storage-services#specifying-service-versions-in-requests).

    :::image type="content" source="./media/connectors-create-api-azureblobstorage/managed-identity-connect.png" alt-text="Screenshot showing the workflow designer and HTTP trigger or action with the required 'PUT' parameters.":::

1. From the **Add a new parameter** list, select **Authentication** to [configure the managed identity](../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity).

    1. Under **Authentication**, for the **Authentication type** property, select **Managed identity**.

    1. For the **Managed identity** property, select **System-assigned managed identity**.

    :::image type="content" source="./media/connectors-create-api-azureblobstorage/managed-identity-authenticate.png" alt-text="Screenshot showing the workflow designer and HTTP action with the managed identity authentication parameter settings.":::

1. When you're done, on the designer toolbar, select **Save**.

Now, you can call the [Blob service REST API](/rest/api/storageservices/blob-service-rest-api) to run any necessary storage operations.

## Next steps

[Connectors overview for Azure Logic Apps](apis-list.md)