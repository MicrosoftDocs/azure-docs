---
title: Connect to Azure Blob Storage
description: Create and manage blobs in Azure storage accounts by using Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: conceptual
ms.date: 02/21/2020
tags: connectors
---

# Create and manage blobs in Azure Blob Storage by using Azure Logic Apps

This article shows how you can access and manage files stored as blobs in your Azure storage account from inside a logic app with the Azure Blob Storage connector. That way, you can create logic apps that automate tasks and workflows for managing your files. For example, you can build logic apps that create, get, update, and delete files in your storage account.

Suppose that you have a tool that gets updated on an Azure website. which acts as the trigger for your logic app. When this event happens, you can have your logic app update some file in your blob storage container, which is an action in your logic app.

If you're new to logic apps, review [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). For connector-specific technical information, see the [Azure Blob Storage connector reference](https://docs.microsoft.com/connectors/azureblobconnector/).

> [!IMPORTANT]
> Logic apps can't directly access storage accounts that are behind firewalls if they're both in the same region. As a workaround, 
> you can have your logic apps and storage account in different regions. For more information about enabling access from Azure Logic 
> Apps to storage accounts behind firewalls, see the [Access storage accounts behind firewalls](#storage-firewalls) section later in this topic.

<a name="blob-storage-limits"></a>

## Limits

* By default, Azure Blob Storage actions can read or write files that are *50 MB or smaller*. To handle files larger than 50 MB but up to 1024 MB, Azure Blob Storage actions support [message chunking](../logic-apps/logic-apps-handle-large-messages.md). The **Get blob content** action implicitly uses chunking.

* Azure Blob Storage triggers don't support chunking. When requesting file content, triggers select only files that are 50 MB or smaller. To get files larger than 50 MB, follow this pattern:

  * Use an Azure Blob Storage trigger that returns file properties, such as **When a blob is added or modified (properties only)**.

  * Follow the trigger with the Azure Blob Storage **Get blob content** action, which reads the complete file and implicitly uses chunking.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* An [Azure storage account and storage container](../storage/blobs/storage-quickstart-blobs-portal.md)

* The logic app where you need access to your Azure blob storage account. To start your logic app with an Azure Blob Storage trigger, you need a [blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

<a name="add-trigger"></a>

## Add blob storage trigger

In Azure Logic Apps, every logic app must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific event happens or when a specific condition is met. Each time the trigger fires, the Logic Apps engine creates a logic app instance and starts running your app's workflow.

This example shows how you can start a logic app workflow with the **When a blob is added or modified (properties only)** trigger when a blob's properties gets added or updated in your storage container.

1. In the [Azure portal](https://portal.azure.com) or Visual Studio, create a blank logic app, which opens Logic App Designer. This example uses the Azure portal.

2. In the search box, enter "azure blob" as your filter. From the triggers list, select the trigger you want.

   This example uses this trigger: **When a blob is added or modified (properties only)**

   ![Select Azure Blob Storage trigger](./media/connectors-create-api-azureblobstorage/add-azure-blob-storage-trigger.png)

3. If you're prompted for connection details, [create your blob storage connection now](#create-connection). Or, if your connection already exists, provide the necessary information for the trigger.

   For this example, select the container and folder you want to monitor.

   1. In the **Container** box, select the folder icon.

   2. In the folder list, choose the right-angle bracket ( **>** ), and then browse until you find and select the folder you want.

      ![Select storage folder to use with trigger](./media/connectors-create-api-azureblobstorage/trigger-select-folder.png)

   3. Select the interval and frequency for how often you want the trigger to check the folder for changes.

4. When you're done, on the designer toolbar, choose **Save**.

5. Now continue adding one or more actions to your logic app for the tasks you want to perform with the trigger results.

<a name="add-action"></a>

## Add blob storage action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a step in your workflow that follows a trigger or another action. For this example, the logic app starts with the [Recurrence trigger](../connectors/connectors-native-recurrence.md).

1. In the [Azure portal](https://portal.azure.com) or Visual Studio, open your logic app in Logic App Designer. This example uses the Azure portal.

2. In the Logic App Designer, under the trigger or action, choose **New step**.

   ![Add new step to logic app workflow](./media/connectors-create-api-azureblobstorage/add-new-step-logic-app-workflow.png) 

   To add an action between existing steps, move your mouse over the connecting arrow. Choose the plus sign (**+**) that appears, and select **Add an action**.

3. In the search box, enter "azure blob" as your filter. From the actions list, select the action you want.

   This example uses this action: **Get blob content**

   ![Select Azure Blob Storage action](./media/connectors-create-api-azureblobstorage/add-azure-blob-storage-action.png)

4. If you're prompted for connection details, [create your Azure Blob Storage connection now](#create-connection).
Or, if your connection already exists, provide the necessary information for the action.

   For this example, select the file you want.

   1. From the **Blob** box, select the folder icon.
  
      ![Select storage folder to use with action](./media/connectors-create-api-azureblobstorage/action-select-folder.png)

   2. Find and select the file you want based on the blob's **ID** number. You can find this **ID** number in the blob's metadata that is returned by the previously described blob storage trigger.

5. When you're done, on the designer toolbar, choose **Save**.
To test your logic app, make sure that the selected folder contains a blob.

This example only gets the contents for a blob. To view the contents, add another action that creates a file with the blob by using another connector. For example, add a OneDrive action that creates a file based on the blob contents.

<a name="create-connection"></a>

## Connect to storage account

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. When you're prompted to created the connection, provide this information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | The name to create for your connection |
   | **Storage Account** | Yes | <*storage-account*> | Select your storage account from the list. |
   ||||

   For example:

   ![Create Azure Blob storage account connection](./media/connectors-create-api-azureblobstorage/create-storage-account-connection.png) 

1. When you're ready, select **Create**

1. After you create your connection, continue with [Add blob storage trigger](#add-trigger) or [Add blob storage action](#add-action).

## Connector reference

For more technical details about this connector, such as triggers, actions, and limits as described by the connector's Swagger file, see the [connector's reference page](https://docs.microsoft.com/connectors/azureblobconnector/).

> [!NOTE]
> For logic apps in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), 
> this connector's ISE-labeled version uses the [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) instead.

<a name="storage-firewalls"></a>

## Access storage accounts behind firewalls

You can add network security to an Azure storage account by restricting access with a [firewall and firewall rules](../storage/common/storage-network-security.md). However, this setup creates a challenge for Azure and other Microsoft services that need access to the storage account. Local communication in the datacenter abstracts the internal IP addresses, so you can't set up firewall rules with IP restrictions. For more information, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).

Here are various options for accessing storage accounts behind firewalls from Azure Logic Apps by using either the Azure Blob Storage connector or other solutions:

* Azure Storage Blob connector

  * [Access storage accounts in other regions](#access-other-regions)
  * [Access storage accounts through a trusted virtual network](#access-trusted-virtual-network)

* Other solutions

  * [Access storage accounts as a trusted service with managed identities](#access-trusted-service)
  * [Access storage accounts through Azure API Management](#access-api-management)

<a name="access-other-regions"></a>

### Problems accessing storage accounts in the same region

Logic apps can't directly access storage accounts behind firewalls when they're both in the same region. As a workaround, put your logic apps in a region that differs from your storage account and give access to the [outbound IP addresses for the managed connectors in your region](../logic-apps/logic-apps-limits-and-config.md#outbound).

> [!NOTE]
> This solution doesn't apply to the Azure Table Storage connector and Azure Queue Storage connector. Instead, to access your Table Storage or Queue Storage, use the built-in HTTP trigger and actions.

<a name="access-trusted-virtual-network"></a>

### Access storage accounts through a trusted virtual network

You can put the storage account in an Azure virtual network that you manage, and then add that virtual network to the trusted virtual networks list. To have your logic app access the storage account through a [trusted virtual network](../virtual-network/virtual-networks-overview.md), you need to deploy that logic app to an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), which can connect to resources in a virtual network. You can then add the subnets in that ISE to the trusted list. Azure Storage connectors, such as the Blob Storage connector, can directly access the storage container. This setup is the same experience as using the service endpoints from an ISE.

<a name="access-trusted-service"></a>

### Access storage accounts as a trusted service with managed identities

To give Microsoft trusted services access to a storage account through a firewall, you can set up an exception on that storage account for those services. This solution permits Azure services that support [managed identities for authentication](../active-directory/managed-identities-azure-resources/overview.md) to access storage accounts behind firewalls as trusted services. Specifically, for a logic app in global multi-tenant Azure to access these storage accounts, you first [enable managed identity support](../logic-apps/create-managed-service-identity.md) on the logic app. Then, you use the HTTP action or trigger in your logic app and [set their authentication type to use your logic app's managed identity](../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity). For this scenario, you can use *only* the HTTP action or trigger.

To set up the exception and managed identity support, follow these general steps:

1. On your storage account, under **Settings**, select **Firewalls and virtual networks**. Under **Allow access from**, select the **Selected networks** option so that the related settings appear.

1. Under **Exceptions**, select **Allow trusted Microsoft services to access this storage account**, and then select **Save**.

   ![Select exception that allows Microsoft trusted services](./media/connectors-create-api-azureblobstorage/allow-trusted-services-firewall.png)

1. In your logic app's settings, [enable support for the managed identity](../logic-apps/create-managed-service-identity.md).

1. In your logic app's workflow, add and set up the HTTP action or trigger to access the storage account or entity.

   > [!IMPORTANT]
   > For outgoing HTTP action or trigger calls to Azure Storage accounts, 
   > make sure that the request header includes the `x-ms-version` property 
   > and the API version for the operation that you want to run on the storage account. 
   > For more information, see [Authenticate access with managed identity](../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity) and 
   > [Versioning for Azure Storage services](https://docs.microsoft.com/rest/api/storageservices/versioning-for-the-azure-storage-services#specifying-service-versions-in-requests).

1. On that action, [select the managed identity](../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity) to use for authentication.

<a name="access-api-management"></a>

### Access storage accounts through Azure API Management

If you use a dedicated tier for [API Management](../api-management/api-management-key-concepts.md), you can front the Storage API by using API Management and permitting the latter's IP addresses through the firewall. Basically, add the Azure virtual network that's used by API Management to the storage account's firewall setting. You can then use either the API Management action or the HTTP action to call the Azure Storage APIs. However, if you choose this option, you have to handle the authentication process yourself. For more info, see [Simple enterprise integration architecture](https://aka.ms/aisarch).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
