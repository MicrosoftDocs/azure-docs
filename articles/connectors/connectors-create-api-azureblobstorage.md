---
title: Connect to Azure Blob Storage
description: Create workflows that manage blobs in Azure storage accounts using Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/18/2022
tags: connectors
---

# Create and manage blobs in Azure Blob Storage by using Azure Logic Apps

From your workflow in Azure Logic Apps, you can access and manage files stored as blobs in your Azure storage account by using the [Azure Blob Storage connector](/connectors/azureblobconnector/). This connector provides triggers and actions that your workflow can use for blob operations. You can then automate tasks to manage files in your storage account. For example, [connector actions](/connectors/azureblobconnector/#actions) include checking, deleting, reading, and uploading blobs. The [available trigger](/connectors/azureblobconnector/#triggers) fires when a blob is added or modified.

You can connect to Blob Storage from both **Logic App (Consumption)** and **Logic App (Standard)** resource types. You can use the connector with logic app workflows in multi-tenant Azure Logic Apps, single-tenant Azure Logic Apps, and the integration service environment (ISE). With **Logic App (Standard)**, you can use either the *built-in* **Azure Blob** operations or the **Azure Blob Storage** managed connector operations.

> [!IMPORTANT]
> A logic app workflow can't directly access a storage account behind a firewall if they're both in the same region. 
> As a workaround, your logic app and storage account can be in different regions. For more information about enabling access from Azure Logic Apps to storage accounts behind firewalls, review the [Access storage accounts behind firewalls](#access-storage-accounts-behind-firewalls) section later in this topic.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [Azure storage account and storage container](../storage/blobs/storage-quickstart-blobs-portal.md)

- A logic app workflow from which you want to access your Azure Storage account. If you want to start your workflow with a Blob trigger, you need a [blank logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Limits

- For logic app workflows running in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), this connector's ISE-labeled version uses the [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) instead.

- By default, Blob actions can read or write files that are *50 MB or smaller*. To handle files larger than 50 MB but up to 1024 MB, Blob actions support [message chunking](../logic-apps/logic-apps-handle-large-messages.md). The [**Get blob content** action](/connectors/azureblobconnector/#get-blob-content) implicitly uses chunking.

- Blob triggers don't support chunking. When a trigger requests file content, the trigger selects only files that are 50 MB or smaller. To get files larger than 50 MB, follow this pattern:

  - Use a Blob trigger that returns file properties, such as [**When a blob is added or modified (properties only)**](/connectors/azureblobconnector/#when-a-blob-is-added-or-modified-(properties-only)).

  - Follow the trigger with the Blob action named [**Get blob content**](/connectors/azureblobconnector/#get-blob-content), which reads the complete file and implicitly uses chunking.

## Connector reference

For more technical details about this connector, such as triggers, actions, and limits, review the [connector's reference page](/connectors/azureblobconnector/). If you don't want to use the Blob operations, you can use the [use HTTP trigger or action along with a a managed identity for blob operations instead](#access-blob-storage-with-managed-identities).

<a name="add-trigger"></a>

## Add a Blob trigger

In Azure Logic Apps, every workflow must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific event happens or when a specific condition is met.

Only one Blob trigger exists and has either of the following names, based on whether you're working with a Consumption or Standard logic app workflow:

| Logic app type | Trigger name | Description |
|----------------|--------------|-------------|
| Consumption | Managed connector only: **When a blob is added or modified (properties only)** | The trigger fires when a blob's properties are added or updated in your storage container's root folder. |
| Standard | - Built-in: **When a blob is Added or Modified in Azure Storage** <br><br>- Managed connector: **When a blob is added or modified (properties only)** | - Built-in: The trigger fires when a blob is added or updated in your storage container. The trigger also fires for any nested folders in your storage container, not just the root folder. <br><br>- Managed connector: The trigger fires when a blob's properties are added or updated in your storage container's root folder. |
||||

When the trigger fires each time, Azure Logic Apps creates a logic app instance and starts running the workflow.

### [Consumption](#tab/consumption)

To add a Blob trigger to a logic app workflow in multi-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. Under the designer search box, make sure that **All** is selected. In the search box, enter **Azure blob**. From the **Triggers** list, select the trigger named **When a blob is added or modified (properties only)**.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-trigger-add.png" alt-text="Screenshot showing Azure portal and workflow designer with a Consumption logic app and the trigger named 'When a blob is added or modified (properties only)' selected.":::

1. If you're prompted for connection details, [create a connection to your Azure Blob Storage account](#connect-blob-storage-account).

1. Provide the necessary information for the trigger.

   1. For the **Container** property value, select the folder icon to browse for your blob storage container. Or, enter the path manually using the syntax **/<*container-name*>**, for example:

      :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-trigger-configure.png" alt-text="Screenshot showing Azure Blob trigger with parameters configuration.":::

   1. Configure other trigger settings as needed.

1. Add one or more actions to your workflow.

1. On the designer toolbar, select **Save** to save your changes.

### [Standard](#tab/standard)

To add a Blob trigger to a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. On the designer, select **Choose an operation**.

1. In the **Add a trigger** pane that opens, under the **Choose an operation** search box, you can select either **Built-in** to find the **Azure Blob** *built-in* trigger, or select **Azure** to find the **Azure Blob Storage** *managed connector* trigger.

   This example uses the built-in **Azure Blob** trigger.

1. Under the search box, select **Built-in**. In the search box, enter **Azure blob**.

1. From the **Triggers** list, select the built-in trigger named **When a blob is Added or Modified in Azure Storage**.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-trigger-add.png" alt-text="Screenshot showing Azure portal, workflow designer, Standard logic app workflow and Azure Blob trigger selected.":::

1. If you're prompted for connection details, [create a connection to your Azure Storage account](#connect-blob-storage-account).

1. Provide the necessary information for the trigger. On the **Parameters** tab, in the **Blob Path** property, enter the name of the folder that you want to monitor.

   1. To find the folder name, open your storage account in the Azure portal.

   1. In the navigation menu, under **Data Storage**, select **Containers**.

   1. Select your blob container. Find the name for the folder that you want to monitor.

   1. Return to the workflow designer. In the trigger's **Blob Path** property, enter the path for the container, folder, or blob, based on whether you're checking for new blobs or changes to an existing blob. The syntax varies based on the check that you want to run and any filtering that you want to use:

      | Task | Path syntax |
      |------|-------------|
      | Check the root folder for a newly added blob. | **<*container-name*>** |
      | Check the root folder for changes to a specific blob. | **<*container-name*>/<*blob-name*>.<*blob-extension*>** |
      | Check the root folder for changes to any blobs with the same extension, for example, **.txt**. | **<*container-name*>/{name}.txt** <br><br>**Important**: Make sure that you use **{name}** as a literal. |
      | Check the root folder for changes to any blobs with names starting with a specific string, for example, **Sample-**. | **<*container-name*>/Sample-{name}** <br><br>**Important**: Make sure that you use **{name}** as a literal. |
      | Check a subfolder for a newly added blob. | **<*container-name*>/<*subfolder*>** |
      | Check a subfolder for changes to a specific blob. | **<*container-name*>/<*subfolder*>/<*blob-name*>.<*blob-extension*>** |
      |||

      For more syntax and filtering options, review [Azure Blob storage trigger for Azure Functions](../azure-functions/functions-bindings-storage-blob-trigger.md#blob-name-patterns).

      The following example shows a trigger setup that checks the root folder for a newly added blob:

      :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-trigger-root-folder.png" alt-text="Screenshot showing the workflow designer for a Standard logic app workflow with an Azure Blob trigger set up for the root folder.":::

      The following example shows a trigger setup that checks a subfolder for changes to an existing blob:

      :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-trigger-sub-folder-existing-blob.png" alt-text="Screenshot showing the workflow designer for a Standard logic app workflow with an Azure Blob trigger set up for a subfolder and specific blob.":::

1. Continue creating your workflow by adding one or more actions.

1. On the designer toolbar, select **Save** to save your changes.

---

<a name="add-action"></a>

## Add a Blob action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a step in your workflow that follows a trigger or another action.

### [Consumption](#tab/consumption)

To add a Blob action to a logic app workflow in multi-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**Recurrence** trigger](connectors-native-recurrence.md).

1. Under the trigger or action where you want to add the Blob action, select **New step** or **Add an action**, if between steps.

1. Under the designer search box, make sure that **All** is selected. In the search box, enter **Azure blob**. Select the Blob action that you want to use.

   This example uses the action named **Get blob content**.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-action-add.png" alt-text="Screenshot showing Consumption logic app in designer with available Blob actions.":::

1. If you're prompted for connection details, [create a connection to your Azure Storage account](#connect-blob-storage-account).

1. Provide the necessary information for the action.

   For example, in the **Get blob content** action, provide your storage account name. For the **Blob** property value, select the folder icon to browse for your storage container or folder. Or, enter the path manually.

   | Task | Blob path syntax |
   |------|------------------|
   | Get the content from a specific blob in the root folder. | **/<*container-name*>/<*blob-name*>** |
   | Get the content from a specific blob in a subfolder. | **/<*container-name*>/<*subfolder*>/<*blob-name*>** |
   |||

   The following example shows the action setup that gets the content from a blob in the root folder:

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-action-root-folder.png" alt-text="Screenshot showing Consumption logic app in designer with Blob action setup for root folder.":::

   The following example shows the action setup that gets the content from a blob in the subfolder:

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-action-sub-folder.png" alt-text="Screenshot showing Consumption logic app in designer with Blob action setup for subfolder.":::

1. Set up other action settings as needed.

### [Standard](#tab/standard)

To add an Azure Blob action to a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), pen your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**Recurrence** trigger](connectors-native-recurrence.md).

1. Under the trigger or action where you want to add the Blob action, select **Insert a new step** (**+**) > **Add an action**.

1. On the designer, make sure that **Add an operation** is selected. In the **Add an action** pane that opens, under the **Choose an operation** search box, select either **Built-in** to find the **Azure Blob** *built-in* actions, or select **Azure** to find the **Azure Blob Storage** *managed connector* actions.

1. In the search box, enter **Azure blob**. Select the Azure Blob action that you want to use.

   This example uses the action named **Reads Blob Content from Azure Storage**, which only reads the blob content. To later view the content, add a different action that creates a file with the blob content using another connector. For example, you can add a OneDrive action that creates a file based on the blob content.

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-action-add.png" alt-text="Screenshot showing the Azure portal and workflow designer with a Standard logic app workflow and the available Azure Blob Storage actions.":::

1. If you're prompted for connection details, [create a connection to your Azure Storage account](#connect-blob-storage-account).

1. For the action, provide the necessary information, which includes the following values for the **Read Blob Content from Azure Storage** action:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Container Name** | Yes | The name for the storage container that you want to use |
   | **Blob name** | Yes | The name or path for the blob that you want to use |
   ||||

   The following example shows the information for a specific blob in the root folder:

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-action-root-folder.png" alt-text="Screenshot showing Standard logic app in designer with Blob action setup for root folder.":::

   The following example shows the information for a specific blob in a subfolder:

   :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-action-subfolder.png" alt-text="Screenshot showing Standard logic app in designer with Blob action setup for subfolder.":::

1. Configure any other action settings as needed.

1. On the designer toolbar, select **Save**.

1. Test your logic app to make sure your selected container contains a blob.

---

<a name="connect-blob-storage-account"></a>

## Connect to Azure Storage account

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

### [Consumption](#tab/consumption)

Before you can configure your [Azure Blob Storage trigger](#add-trigger) or [Azure Blob Storage action](#add-action), you need to connect to your Azure Storage account.

Based on the [authentication type that your storage account requires](../storage/common/authorize-data-access.md), you have to provide a connection name and select the authentication type at a minimum.

For example, if your storage account requires *access key* authorization, you have to provide the following information:

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection name** | Yes | <*connection-name*> | The name to use for your connection. |
| **Authentication type** | Yes | - **Access Key** <br><br>- **Azure AD Integrated** <br><br>- **Logic Apps Managed Identity (Preview)** | The authentication type to use for your connection. For more information, review [Authentication types for triggers and actions that support authentication - Secure access and data](../logic-apps/logic-apps-securing-a-logic-app.md#authentication-types-for-triggers-and-actions-that-support-authentication). |
| **Azure Storage Account name** | Yes, <br>but only for access key authentication | <*storage-account-name*> | The name for the Azure storage account where your blob container exists. <br><br><br><br>**Note**: To find the storage account name, open your storage account resource in the Azure portal. In the resource menu, under **Security + networking**, select **Access keys**. Under **Storage account name**, copy and save the name. |
| **Azure Storage Account Access Key** | Yes, <br>but only for access key authentication | <*storage-account-access-key*> | The access key for your Azure storage account. <br><br><br><br>**Note**: To find the access key, open your storage account resource in the Azure portal. In the resource menu, under **Security + networking**, select **Access keys** > **Show keys**. Copy and save one of the key values. |
|||||

The following example shows how a connection using access key authentication might appear:

:::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-connection-create.png" alt-text="Screenshot showing the workflow designer with a Consumption logic app workflow and a prompt to add a new connection for the Azure Blob Storage step.":::

> [!NOTE]
> After you create your connection, if you have a different existing Azure Blob storage connection 
> that you want to use instead, select **Change connection** in the trigger or action details editor.

If you have problems connecting to your storage account, review [how to access storage accounts behind firewalls](#access-storage-accounts-behind-firewalls).

### [Standard](#tab/standard)

Before you can configure your [Azure Blob trigger](#add-trigger) or [Azure Blob action](#add-action), you need to connect to your Azure Storage account. A connection requires the following properties:

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection name** | Yes | <*connection-name*> | The name to use for your connection. |
| **Azure Blob Storage Connection String** | Yes | <*storage-account*> | Select your storage account from the list, or provide a string. <br><br><br><br>**Note**: To find the connection string, go to the storage account's page. In the navigation menu, under **Security + networking**, select **Access keys** > **Show keys**. Copy one of the available connection string values. |
|||||

To create an Azure Blob Storage connection from a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. For **Connection name**, enter a name for your connection.

1. For **Azure Blob Storage Connection String**, enter the connection string for the storage account that you want to use.

1. Select **Create** to finish creating your connection.

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
