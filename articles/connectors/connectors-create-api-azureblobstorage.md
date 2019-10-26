---
title: Connect to Azure Blob Storage - Azure Logic Apps
description: Create and manage blobs in Azure storage with Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
manager: carmonm
ms.reviewer: klam, LADocs
ms.topic: conceptual
ms.date: 10/28/2019
tags: connectors
---

# Create and manage blobs in Azure Blob Storage by using Azure Logic Apps

This article shows how you can access and manage files stored as blobs in your Azure storage account from inside a logic app with the Azure Blob Storage connector. That way, you can create logic apps that automate tasks and workflows for managing your files. For example, you can build logic apps that create, get, update, and delete files in your storage account.

Suppose that you have a tool that gets updated on an Azure website. which acts as the trigger for your logic app. When this event happens, you can have your logic app update some file in your blob storage container, which is an action in your logic app.

If you're new to logic apps, review [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). For connector-specific technical information, see the [Azure Blob Storage connector reference](/connectors/azureblobconnector/).

<a name="blob-storage-limits"></a>

## Limits

* By default, Azure Blob Storage actions can read or write files that are *50 MB or smaller*. To handle files larger than 50 MB but up to 1024 MB, Azure Blob Storage actions support [message chunking](../logic-apps/logic-apps-handle-large-messages.md). The **Get blob content** action implicitly uses chunking.

* Azure Blob Storage triggers don't support chunking. When requesting file content, triggers select only files that are 50 MB or smaller. To get files larger than 50 MB, follow this pattern:

  * Use an Azure Blob Storage trigger that returns file properties, such as **When a blob is added or modified (properties only)**.

  * Follow the trigger with the Azure Blob Storage **Get blob content** action, which reads the complete file and implicitly uses chunking.

<a name="storage-firewalls"></a>

## Storage accounts with firewalls

On an Azure storage account, you can add network security by restricting access with a [firewall and firewall rules](../storage/common/storage-network-security.md). However, this setup poses a challenge for Azure services that need access to the storage account. Local communication in the datacenter abstracts the internal IP addresses, so you can't set up firewall rules with IP restrictions. For more information, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).

Logic apps can't directly access storage accounts that have firewall rules and are in the same region. However, if you permit access for the [outbound IP addresses for managed connectors in your region](../logic-apps/logic-apps-limits-and-config.md#outbound), your logic apps can access storage accounts in a different region except when you use the Azure Table Storage connector or Azure Queue Storage connector. To access your Table Storage or Queue Storage, you can still use the HTTP trigger and actions.

Here are other options that permit access to the storage account from Microsoft and Azure services:

* Put the storage account in an Azure virtual network that you manage, and then [add that virtual network to the trusted virtual networks list](#access-trusted-virtual-network).

* [Add an exception for trusted services](#access-trusted-service) to access the storage account.

* Access the storage account by using [Azure API Management](#access-api-management).

<a name="access-trusted-virtual-network"></a>

### Access to storage accounts through a trusted virtual network

For a logic app to access a storage account through a trusted virtual network, you need to deploy the logic app to an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), which can connect to resources in a virtual network. You can then add the subnets in that ISE to the trusted list. Azure Storage connectors, such as the Blob Storage connector, can directly access the storage container. This setup is the same experience as using the service endpoints from an ISE.

<a name="access-trusted-service"></a>

### Access to storage accounts as a trusted service

Some services support using managed identities to access a storage account. When you [enable managed identity support on your logic app](../logic-apps/create-managed-service-identity.md), you can then [use the managed identity in an HTTP action](../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity) to authenticate access at runtime. Connectors don't yet support creating connections that use managed identities.

Also, for logic apps in the global multi-tenant Azure service to access a storage account through a firewall, in your storage account's **Firewalls and virtual networks** settings, select the **Allow trusted Microsoft services to access this storage account** setting.

![Allow trusted services](./media/connectors-create-api-azureblobstorage/allow-trusted-services-firewall.png)

<a name="access-api-management"></a>

### Access to storage accounts through API Management

If you use a dedicated tier for Azure API Management, you can front the Storage API by using API Management and permitting the latter's IP addresses through the firewall. Basically, add the Azure virtual network that's used by API Management to the storage account's firewall setting. You can then use either the API Management action or the HTTP action to call the Azure Storage APIs. However, if you choose this option, you have to handle the authentication process yourself. For more info, see [Simple enterprise integration architecture](https://aka.ms/aisarch).

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

   ![Select trigger](./media/connectors-create-api-azureblobstorage/azure-blob-trigger.png)

3. If you're prompted for connection details, [create your blob storage connection now](#create-connection). Or, if your connection already exists, provide the necessary information for the trigger.

   For this example, select the container and folder you want to monitor.

   1. In the **Container** box, select the folder icon.

   2. In the folder list, choose the right-angle bracket ( **>** ), and then browse until you find and select the folder you want.

      ![Select folder](./media/connectors-create-api-azureblobstorage/trigger-select-folder.png)

   3. Select the interval and frequency for how often you want the trigger to check the folder for changes.

4. When you're done, on the designer toolbar, choose **Save**.

5. Now continue adding one or more actions to your logic app for the tasks you want to perform with the trigger results.

<a name="add-action"></a>

## Add blob storage action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a step in your workflow that follows a trigger or another action. For this example, the logic app starts with the [Recurrence trigger](../connectors/connectors-native-recurrence.md).

1. In the [Azure portal](https://portal.azure.com) or Visual Studio, open your logic app in Logic App Designer. This example uses the Azure portal.

2. In the Logic App Designer, under the trigger or action, choose **New step**.

   ![Add an action](./media/connectors-create-api-azureblobstorage/add-action.png) 

   To add an action between existing steps, move your mouse over the connecting arrow. Choose the plus sign (**+**) that appears, and select **Add an action**.

3. In the search box, enter "azure blob" as your filter. From the actions list, select the action you want.

   This example uses this action: **Get blob content**

   ![Select action](./media/connectors-create-api-azureblobstorage/azure-blob-action.png)

4. If you're prompted for connection details, [create your Azure Blob Storage connection now](#create-connection).
Or, if your connection already exists, provide the necessary information for the action.

   For this example, select the file you want.

   1. From the **Blob** box, select the folder icon.
  
      ![Select folder](./media/connectors-create-api-azureblobstorage/action-select-folder.png)

   2. Find and select the file you want based on the blob's **Id** number. You can find this **Id** number in the blob's metadata that is returned by the previously described blob storage trigger.

5. When you're done, on the designer toolbar, choose **Save**.
To test your logic app, make sure that the selected folder contains a blob.

This example only gets the contents for a blob. To view the contents, add another action that creates a file with the blob by using another connector. For example, add a OneDrive action that creates a file based on the blob contents.

<a name="create-connection"></a>

## Connect to storage account

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

[!INCLUDE [Create a connection to Azure blob storage](../../includes/connectors-create-api-azureblobstorage.md)]

## Connector reference

For technical details, such as triggers, actions, and limits, 
as described by the connector's Open API (formerly Swagger) file, 
see the [connector's reference page](/connectors/azureblobconnector/).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
