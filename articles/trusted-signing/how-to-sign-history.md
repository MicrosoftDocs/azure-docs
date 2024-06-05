---
title: Access signed transactions in Trusted Signing 
description: Learn how to access signed transactions in Trusted Signing in the Azure portal. 
author: mehasharma 
ms.author: mesharm 
ms.service: trusted-signing 
ms.topic: how-to 
ms.date: 04/12/2024 
---

# Access signed transactions in Trusted Signing

You can use diagnostic settings to route your Trusted Signing account platform metrics, resource logs, and activity log to various destinations. For each Azure resource that you use, you must configure a separate diagnostic setting. Similarly, each Trust Signing account should have its own settings configured.

Currently, you can choose from four log routing options for Trusted Signing in Azure:

- **Log Analytics workspace**: A Log Analytics workspace serves as a distinct environment for log data. Each workspace has its own data repository and configuration. It’s the designated destination for your data. If you haven’t already set up a workspace, create one before you proceed. For more information, see the [Log Analytics workspace overview](/azure/azure-monitor/logs/log-analytics-workspace-overview).
- **Azure Storage account**: An Azure Storage account houses all your Storage data objects, including blobs, files, queues, and tables. It offers a unique namespace for your Storage data, and it's accessible globally via HTTP or HTTPS.

  To set up your storage account:

  1. For **Select your Subscription**, select the Azure subscription that you want to use.
  1. For **Choose a Storage Account**, specify the Azure Storage account where you want to store your data.
  1. For **Azure Storage Lifecycle Policy**, use the Azure Storage Lifecycle Policy to manage how long your logs are retained.

   For more information, see the [Azure Storage account overview](/azure/storage/common/storage-account-overview?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json).
- **Event hub**: Azure Event Hubs is a cloud-native data streaming service that can handle millions of events per second with low latency. It seamlessly streams data from any source to any destination. When you set up your event hub, you can specify the subscription to which the event hub belongs.

   For more information, see the [Event Hubs overview](/azure/event-hubs/event-hubs-about).
- **Partner solution**: You can send platform metrics and logs to certain Azure Monitor partners.

Remember that each setting can have no more than one of each type of destination. If you need to delete, rename, move, or migrate a resource across resource groups or subscriptions, first delete its diagnostic settings.

For more information, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings) and [Create diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/create-diagnostic-settings).

This article demonstrates an example of how to view signing transactions by using an *Azure Storage account*.

## Prerequisites

To complete the steps in this article, you need:

- An Azure subscription.
- A Trusted Signing account.
- The ability to create a storage account in an Azure subscription. (Note that billing for storage accounts is separate from billing for Trusted Signing resources.)  

## Send signing transactions to a storage account

[Create a storage account](/azure/storage/common/storage-account-create?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) guides you through the steps to create a storage account in the same region as your Trusted Signing account. (A basic storage account is sufficient.)

To access and send signing transactions to your storage account:  

1. In the Azure portal, go to your Trusted Signing account.
1. On the Trusted Signing account **Overview** pane, in the resource menu under **Monitoring**, select **Diagnostic settings**.
1. On the **Diagnostic settings** pane, select **+ Add diagnostic setting**.

   :::image type="content" source="media/trusted-signing-diagnostic-settings.png" alt-text="Screenshot that shows adding a diagnostic setting." lightbox="media/trusted-signing-diagnostic-settings.png":::

1. On the **Diagnostic setting** pane:

   1. Enter a name for the diagnostic setting.
   1. Under **Logs** > **Categories**, select the **Sign Transactions** checkbox.
   1. Under **Destination details**, select the **Archive to a storage account** checkbox.
   1. Select the subscription and storage account that you want to use.

   :::image type="content" source="media/trusted-signing-select-storage-account-subscription.png" alt-text="Screenshot that shows configuring a diagnostic setting for a storage account." lightbox="media/trusted-signing-select-storage-account-subscription.png":::

1. Select **Save**. A pane displays a list of all diagnostic settings that were created for this code signing account.  
1. After you create a diagnostic setting, wait for 10 to 15 minutes for the events to begin to be ingested in the storage account you created.  
1. Go to the storage account.  
1. In your storage account resource menu under **Data storage**, go to **Containers**.
1. In the list, select the container named `insights-logs-signtransactions`. Go to the date and time you want to view to download the log.
