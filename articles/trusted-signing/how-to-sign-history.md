---
title: Access signed transactions in Trusted Signing 
description: How-to access signed transactions in Trusted Signing in Azure portal. 
author: mehasharma 
ms.author: mesharm 
ms.service: trusted-signing 
ms.topic: how-to 
ms.date: 04/12/2024 
---

# Access signed transactions in Trusted Signing

Azure Monitor’s Diagnostic Settings enable you to route platform metrics, resource logs, and the activity log to various destinations. For each Azure resource, you need to configure its own diagnostic setting. Similarly, each Trust Signing account should have its own settings established.
Currently there are four different options enabled:

- **Log Analytics workspace**: A Log Analytics workspace serves as a distinct environment for log data. Each workspace has its own data repository and configuration. It’s the designated destination for sending your data. If you haven’t already set up a workspace, create one before proceeding. For additional details, refer to the [Log Analytics workspace Overview.](/azure/azure-monitor/logs/log-analytics-workspace-overview) 
- **Storage Account**: An Azure storage account houses all your Azure Storage data objects, including blobs, files, queues, and tables. It offers a unique namespace for your Azure Storage data, accessible globally via HTTP or HTTPS. When setting up your storage account, follow these steps:
  - Select your Subscription: Choose the appropriate subscription.
  - Choose a Storage Account: Specify the storage account where you want to store your data.
  - Azure Storage Lifecycle Policy: Utilize the Azure Storage Lifecycle Policy to manage how long your logs are retained.
For additional information, refer to the [Storage account Overview](/azure/storage/common/storage-account-overview?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json)
- **Event Hub**: Azure Event Hubs is a cloud-native data streaming service that can handle millions of events per second with low latency. It seamlessly streams data from any source to any destination. When configuring it, you can specify the subscription to which the event hub belongs. For additional information, refer to the [Event Hubs Overview](/azure/event-hubs/event-hubs-about)
- **Partner Solution**: You can send platform metrics and logs to certain Azure Monitor partners.

Remember, each setting can have no more than one of each of the destination types. If you need to delete a resource, rename, or move a resource, or migrate it across resource groups or subscriptions, first delete its diagnostic settings.

For more detailed information, you can refer to the official Microsoft documentation on [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings) and [Creating diagnostic settings in Azure Monitor.](/azure/azure-monitor/essentials/create-diagnostic-settings)

Following is an example of how to view signing transactions through storage account.

## Prerequisites:  

- Ability to create storage accounts in a subscription. (Note: The billing of storage accounts is separate from Trusted Signing resources.)  
- Sign in to the Azure portal.

## Send signing transactions to storage account

Follow the steps to access and send signing transactions to your storage account:  

1. Follow this guide to create Storage accounts, [Create a storage account - Azure Storage | Microsoft Learn](/azure/storage/common/storage-account-create?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json), in the same region as your trusted signing account (Basic storage account is sufficient).
2. Navigate to your trusted signing account in the Azure portal.
3. On the trusted signing account overview page, locate **Diagnostics Settings** under Monitoring section.

:::image type="content" source="media/trusted-signing-diagnostic-settings.png" alt-text="Screenshot of trusted-signing-diagnostic-settings." lightbox="media/trusted-signing-diagnostic-settings.png":::

4. Select Diagnostics Settings on the left-side blade and click **+ Add diagnostic setting** link on the left side.
5. From **Diagnostics setting** page, select **Sign Transactions** category and choose ‘Archive to a storage account’ option and select the subscription and Storage account that you newly created or already have.

:::image type="content" source="media/trusted-signing-select-storage-account-subscription.png" alt-text="Screenshot of trusted-signing-select-storage-account-subscription." lightbox="media/trusted-signing-select-storage-account-subscription.png":::


6. After selecting subscription & storage account, click **Save**. This action brings you to previous page where it displays list of all diagnostics settings created for this code sign account.  
7. After creating a diagnostic setting, wait for 10-15 mins before the events begin to get ingested to the newly created storage account.  
Navigate to the storage account created previously.  
8. From storage account resource, navigate to **Containers** under **Data storage**.
9. From the list, select container named **insights-logs-signtransactions** and navigate to the date and time you're looking to download the log.
