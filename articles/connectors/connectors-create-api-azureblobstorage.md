---
title: Connect to Azure Blob Storage
description: Create and manage blobs in Azure storage accounts by using Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: logicappspm
ms.topic: conceptual
ms.date: 06/23/2021
tags: connectors
---

# Create and manage blobs in Azure Blob Storage by using Azure Logic Apps

You can access and manage files stored as blobs in your Azure storage account within Azure Logic Apps using the [Azure Blob Storage connector](/connectors/azureblobconnector/). This connector provides triggers and actions for blob operations within your logic app workflows. You can use these operations to automate tasks and workflows for managing the files in your storage account. [Available connector actions](/connectors/azureblobconnector/#actions) include checking, deleting, reading, and uploading blobs. The [available trigger](/connectors/azureblobconnector/#triggers) fires when a blob is added or modified. 

You can connect to Blob Storage from both Standard and Consumption logic app resource types. You can use the connector with logic apps in a single-tenant, multi-tenant, or integration service environment (ISE). For logic apps in a single-tenant environment, Blob Storage provides built-in operations and also managed connector operations.

> [!NOTE]
> For logic apps in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), 
> this connector's ISE-labeled version uses the [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) instead.

For more technical details about this connector, such as triggers, actions, and limits, see the [connector's reference page](/connectors/azureblobconnector/).

You can also [use a managed identity with an HTTP trigger or action to do blob operations](#access-blob-storage-with-managed-identities) instead the Blob Storage connector.

> [!IMPORTANT]
> Logic apps can't directly access storage accounts that are behind firewalls if they're both in the same region. As a workaround, 
> you can have your logic apps and storage account in different regions. For more information about enabling access from Azure Logic 
> Apps to storage accounts behind firewalls, see the [Access storage accounts behind firewalls](#access-storage-accounts-behind-firewalls) section later in this topic.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).
- An [Azure storage account and storage container](../storage/blobs/storage-quickstart-blobs-portal.md)
- A logic app workflow from which you want to access your Blob Storage account. If you want to start your logic app with a Blob Storage trigger, you need a [blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Limits

- By default, Blob Storage actions can read or write files that are *50 MB or smaller*. To handle files larger than 50 MB but up to 1024 MB, Blob Storage actions support [message chunking](../logic-apps/logic-apps-handle-large-messages.md). The [**Get blob content** action](/connectors/azureblobconnector/#get-blob-content) implicitly uses chunking.
- The Blob Storage triggers don't support chunking. When requesting file content, triggers select only files that are 50 MB or smaller. To get files larger than 50 MB, follow this pattern:
  - Use a Blob Storage trigger that returns file properties, such as [**When a blob is added or modified (properties only)**](/connectors/azureblobconnector/#when-a-blob-is-added-or-modified-(properties-only)).
  - Follow the trigger with the Blob Storage [**Get blob content** action](/connectors/azureblobconnector/#get-blob-content), which reads the complete file and implicitly uses chunking.

## Add Blob Storage trigger

In Logic Apps, every logic app must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific event happens or when a specific condition is met. 

This connector has one available trigger, called either [**When a blob is Added or Modified in Azure Storage** or **When a blob is added or modified (properties only)**](/connectors/azureblobconnector/#when-a-blob-is-added-or-modified-(properties-only)). The trigger fires when a blob's properties are added or updated in your storage container. Each time, the Logic Apps engine creates a logic app instance and starts running your workflow.

### [Single-tenant](#tab/single-tenant)

To add a Blob Storage action in a single-tenant logic app that uses a Standard plan:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open your workflow in the designer.
1. In the search box, enter `Azure blob` as your filter. From the triggers list, select the trigger named **When a blob is Added or Modified in Azure Storage**.
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-trigger-add.png" alt-text="Screenshot of Standard logic app in designer, showing selection of trigger named When a blob is Added or Modified in Azure Storage.":::
1. If you're prompted for connection details, [create your blob storage connection now](#connect-to-storage-account).
1. Provide the necessary information for the trigger.
    1. Under the **Parameters** tab, add the **Blob Path** to the blob you want to monitor.
        To find your blob path, open your storage account in the Azure portal. In the navigation menu, under **Data Storage**, select **Containers**. Select your blob container. On the container navigation menu, under **Settings**, select **Properties**. Copy the **URL** value, which is the path to the blob. The path resembles `https://{your-storage-account}.blob.core.windows.net/{your-blob}`.
        :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-trigger-configure.png" alt-text="Screenshot of Standard logic app in designer, showing parameters configuration for blob storage trigger.":::
    1. Configure other trigger settings as needed.
    1. Select **Done**.
1. Add one or more actions to your workflow.
1. In the designer toolbar, select **Save** to save your changes.

### [Multi-tenant](#tab/multi-tenant)

To add a Blob Storage action in a multi-tenant logic app that uses a Consumption plan:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open your workflow in the Logic Apps Designer.
1. In the search box, enter "Azure blob" as your filter. From the triggers list, select the trigger **When a blob is added or modified (properties only)**.
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-trigger-add.png" alt-text="Screenshot of Consumption logic app in designer, showing selection of blob storage trigger.":::
1. If you're prompted for connection details, [create your blob storage connection now](#connect-to-storage-account).
1. Provide the necessary information for the trigger.
    1. For **Container**, select the folder icon to choose your blob storage container. Or, enter the path manually.
    1. Configure other trigger settings as needed.
        :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-trigger-configure.png" alt-text="Screenshot of Consumption logic app in designer, showing parameters configuration for blob storage trigger.":::
1. Add one or more actions to your workflow.
1. In the designer toolbar, select **Save** to save your changes.

---

<a name="add-action"></a>

## Add Blob Storage action

In Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a step in your workflow that follows a trigger or another action.

### [Single-tenant](#tab/single-tenant)

For logic apps in a single-tenant environment:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open your workflow in the Logic Apps Designer.
1. Add a trigger. This example starts with the [**Recurrence** trigger](../connectors/connectors-native-recurrence.md).
1. Add a new step to your workflow. In the search box, enter "Azure blob" as your filter. Then, select the Blob Storage action that you want to use. This example uses **Reads Blob Content from Azure Storage**. 
   :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-action-add.png" alt-text="Screenshot of Standard logic app in designer, showing list of available Blob Storage actions.":::
1. If you're prompted for connection details, [create a connection to your Blob Storage account](#connect-to-storage-account).
1. Provide the necessary information for the action.
    1. For **Container Name**, enter the path for the blob container you want to use.
    1. For **Blob name**, enter the path for the blob you want to use.
        :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-action-configure.png" alt-text="Screenshot of Standard logic app in designer, showing selection of Blob Storage trigger.":::
    1. Configure other action settings as needed.
1. On the designer toolbar, select **Save**. 
1. Test your logic app to make sure your selected container contains a blob. 

> [!TIP]
> This example only reads the contents of a blob. To view the contents, add another action that creates a file with the blob by using another connector. For example, add a OneDrive action that creates a file based on the blob contents.

### [Multi-tenant](#tab/multi-tenant)

For logic apps in a multi-tenant environment:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open your workflow in the Logic Apps Designer.
1. Add a trigger. This example starts with the [**Recurrence** trigger](../connectors/connectors-native-recurrence.md).
1. Add a new step to your workflow. In the search box, enter "Azure blob" as your filter. Then, select the Blob Storage action that you want to use. This example uses **Get blob content**.
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-action-add.png" alt-text="Screenshot of Consumption logic app in designer, showing list of available Blob Storage actions.":::
1. If you're prompted for connection details, [create a connection to your Blob Storage account](#connect-to-storage-account).
1. Provide the necessary information for the action.
    1. For **Blob**, select the folder icon to choose your blob storage container. Or, enter the path manually.
        :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-action-configure.png" alt-text="Screenshot of Consumption logic app in designer, showing configuration of Blob Storage action.":::
    1. Configure other action settings as needed.

---

## Connect to storage account

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

Before you can configure your [blob storage trigger](#add-blob-storage-trigger) or [blob storage action](#add-blob-storage-action), you need to connect to a storage account. A connection requires the following properties.

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection Name** | Yes | <*connection-name*> | The name to create for your connection |
| **Azure Blob Storage Connection String** | Yes | <*storage-account*> | Select your storage account from the list, or provide a string. |

> [!TIP]
> To find a connection string, go to the storage account's page. In the navigation menu, under **Security + networking**, select **Access keys**. Select **Show keys**. Copy one of the two available connection string values.

### [Single-tenant](#tab/single-tenant)

For logic apps in a single-tenant environment:

1. For **Connection name**, enter a name for your connection.
1. For **Azure Blob Storage Connection String**, enter the connection string for the storage account you want to use.
1. Select **Create** to establish your connection.
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/standard-connection-create.png" alt-text="Screenshot of Standard logic app in designer, showing prompt to add a new connection to a blob storage step.":::

If you already have an existing connection, but you want to choose a different one, select **Change connection** in the step's editor.

If you have problems connecting to your storage account, see [how to access storage accounts behind firewalls](#access-storage-accounts-behind-firewalls).

### [Multi-tenant](#tab/multi-tenant)

For logic apps in a multi-tenant environment:

1. For **Connection name**, enter a name for your connection.
1. For **Storage Account**, select the storage account that your blob container is in. Or, select **Manually enter connection information** to provide the path yourself.
1. Select **Create** to establish your connection.
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/consumption-connection-create.png" alt-text="Screenshot of Consumption logic app in designer, showing prompt to add a new connection to a blob storage step.":::

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

Logic apps can't directly access storage accounts behind firewalls when they're both in the same region. As a workaround, put your logic apps in a different region than your storage account. Then, give access to the [outbound IP addresses for the managed connectors in your region](../logic-apps/logic-apps-limits-and-config.md#outbound).

> [!NOTE]
> This solution doesn't apply to the Azure Table Storage connector and Azure Queue Storage connector. Instead, to access your Table Storage or Queue Storage, [use the built-in HTTP trigger and actions](../logic-apps/logic-apps-http-endpoint.md).

To add your outbound IP addresses to the storage account firewall:

1. Note the [outbound IP addresses](../logic-apps/logic-apps-limits-and-config.md#outbound) for your logic app's region.
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open your storage account's page. In the navigation menu, under **Security + networking**, select **Networking**. 
1. Under **Allow access from**, select the **Selected networks** option. Related settings now appear on the page.
1. Under **Firewall**, add the IP addresses or ranges that need access. 
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/storage-ip-configure.png" alt-text="Screenshot of blob storage account networking page in Azure portal, showing firewall settings to add IP addresses and ranges to the allowlist.":::

### Access storage accounts through trusted virtual network

You can put the storage account in an Azure virtual network that you manage, and then add that virtual network to the trusted virtual networks list. To give your logic app access to the storage account through a [trusted virtual network](../virtual-network/virtual-networks-overview.md), you need to deploy that logic app to an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), which can connect to resources in a virtual network. You can then add the subnets in that ISE to the trusted list. Azure Storage connectors, such as the Blob Storage connector, can directly access the storage container. This setup is the same experience as using the service endpoints from an ISE.

### Access storage accounts through Azure API Management

If you use a dedicated tier for [API Management](../api-management/api-management-key-concepts.md), you can front the Storage API by using API Management and permitting the latter's IP addresses through the firewall. Basically, add the Azure virtual network that's used by API Management to the storage account's firewall setting. You can then use either the API Management action or the HTTP action to call the Azure Storage APIs. However, if you choose this option, you have to handle the authentication process yourself. For more info, see [Simple enterprise integration architecture](/azure/architecture/reference-architectures/enterprise-integration/basic-enterprise-integration).

## Access Blob Storage with managed identities

If you want to access Blob Storage without using this Logic Apps connector, you can use [managed identities for authentication](../active-directory/managed-identities-azure-resources/overview.md) instead. You can create an exception that gives Microsoft trusted services, such as a managed identity, access to your storage account through a firewall.

To use managed identities in your logic app to access Blob Storage:

1. [Configure access to your storage account](#configure-storage-account-access)
1. [Create a role assignment for your logic app](#create-role-assignment-for-logic-app)
1. [Enable support for the managed identity in your logic app](#enable-support-for-managed-identity-in-logic-app)

> [!NOTE]
> Limitations for this solution:
> - You can *only* use the HTTP trigger or action in your workflow.
> - You must set up a managed identity to authenticate your storage account connection.
> - You can't use built-in Blob Storage operations if you authenticate with a managed identity.
> - For logic apps in a single-tenant environment, only the system-assigned managed identity is available and supported, not the user-assigned managed identity.

### Configure storage account access

To set up the exception and managed identity support, first configure appropriate access to your storage account:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open your storage account's page. In the navigation menu, under **Security + networking**, select **Networking**. 
1. Under **Allow access from**, select the **Selected networks** option. Related settings now appear on the page.
1. If you need to access the storage account from your computer, under **Firewall**, enable **Add your client IP address**.
1. Under **Exceptions**, enable **Allow trusted Microsoft services to access this storage account**. 
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/storage-networking-configure.png" alt-text="Screenshot of blob storage account networking page in Azure portal, showing settings to allow selected networks, client IP address, and trusted Microsoft services.":::
1. Select **Save**.

> [!TIP]
> If you receive a **403 Forbidden** error when you try to connect to the storage account from your workflow, there are multiple possible causes. Try the following resolution before moving on to additional steps. First, disable the setting **Allow trusted Microsoft services to access this storage account** and save your changes. Then, re-enable the setting, and save your changes again. 

### Create role assignment for logic app

Next, [enable managed identity support](../logic-apps/create-managed-service-identity.md) on your logic app.

1. Open your logic app in the Azure portal.
1. In the navigation menu, under **Settings**, select **Identity.**
1. Under **System assigned**, set **Status** to **On**. This setting might already be enabled.
1. Under **Permissions**, select **Azure role assignments**.
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/role-assignment-add-1.png" alt-text="Screenshot of logic app menu in Azure portal, showing identity settings pane with button to add Azure role assignment permissions.":::
1. On the **Azure role assignments** pane, select **Add role assignment**.
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/role-assignment-add-2.png" alt-text="Screenshot of logic app role assignments pane, showing selected subscription and button to add a new role assignment.":::
1. Configure the new role assignment as follows.
    1. For **Scope**, select **Storage**.
    1. For **Subscription**, choose the subscription that your storage account is in.
    1. For **Resource**, choose the storage account that you want to access from your logic app.
    1. For **Role**, select the appropriate permissions for your scenario. This example uses **Storage Blob Data Contributor**, which allows read, write, and delete access to blob containers and date. Hover over the information icon next to a role in the drop-down menu for permissions details.
    1. Select **Save** to finish creating the role assignment.
        :::image type="content" source="./media/connectors-create-api-azureblobstorage/role-assignment-configure.png" alt-text="Screenshot of role assignment configuration pane, showing settings for scope, subscription, resource, and role.":::

### Enable support for managed identity in logic app

Next, add an [HTTP trigger or action](connectors-native-http.md) in your workflow. Make sure to [set the authentication type to use the managed identity](../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity). 

The steps are the same for logic apps in both single-tenant and multi-tenant environments.

1. Open your workflow in the Logic Apps Designer.
1. Add a new step to your workflow with an **HTTP** trigger or action, depending on your scenario.
1. Configure all required parameters for your **HTTP** trigger or action.
    1. Choose a **Method** for your request. This example uses the HTTP PUT method.
    1. Enter the **URI** for your blob. The path resembles `https://{your-storage-account}.blob.core.windows.net/{your-blob}`.
    1. Under **Headers**, add the blob type header `x-ms-blob-type` with the value `BlockBlob`.
    1. Under **Headers**, also add the API version header `x-ms-version` with the appropriate value. For more information, see [Authenticate access with managed identity](../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity) and [Versioning for Azure Storage services](/rest/api/storageservices/versioning-for-the-azure-storage-services#specifying-service-versions-in-requests).
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/managed-identity-connect.png" alt-text="Screenshot of Logic Apps Designer, showing required HTTP PUT action parameters.":::
1. Select **Add a new parameter** and choose **Authentication** to [configure the managed identity](../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity).
    1. Under **Authentication**, for **Authentication type**, choose **Managed identity**.
    1. For **Managed identity**, choose **System-assigned managed identity**.
    :::image type="content" source="./media/connectors-create-api-azureblobstorage/managed-identity-authenticate.png" alt-text="Screenshot of Logic Apps Designer, showing HTTP action authentication parameter settings for managed identity.":::
1. In the Logic Apps Designer toolbar, select **Save**.

Now, you can call the [Blob service REST API](/rest/api/storageservices/blob-service-rest-api) to run any necessary storage operations.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Logic Apps connectors](../connectors/apis-list.md)
