---
title: Set up the Azure Storage connector to stream logs to Microsoft Sentinel
description: Learn how to set up the Azure Storage Blob connector to ingest logs from Azure Storage into Microsoft Sentinel using the Codeless Connector Framework.
author: EdB-MSFT
ms.author: edbaynash
ms.reviewer: edbaynash
ms.date: 02/08/2026
ms.topic: how-to
ms.service: microsoft-sentinel

#customer intent: As a security engineer, I want to set up an Azure Storage Blob connector so that I can ingest logs from Azure Storage into Microsoft Sentinel.

---

# Set up your Azure Storage connector to stream logs to Microsoft Sentinel

The Azure Storage Blob connector simplifies collecting logs from Azure Storage. It lets ISVs and users build scalable connectors on top of Azure Storage integrations through the fully managed Codeless Connector Framework (CCF).

This article summarizes the connector resources and provides steps to create and validate your first Azure Storage connector.

## Prerequisites

Before you begin, ensure you have:

- An Azure Storage account with hierarchical namespace enabled (Azure Data Lake Storage Gen2) and a container that holds the log files.
- A Microsoft Sentinel workspace with a Microsoft Sentinel Contributor or higher role to create data connectors.
- Owner or EventGrid Contributor role permissions on the storage account to create Event Grid system topics and subscriptions. 

> [!NOTE]
> Make sure the **Microsoft.EventGrid** resource provider is registered in the subscription that contains the storage account.

## Connector resource overview

The Azure Storage Blob connector uses a queue-based blob-pointer model to subscribe to blob-created events in your storage account. An Event Grid system topic subscription listens for blob creation activity and pushes events, based on configurable filtering criteria, to an Azure Storage queue. Multiple connector instances can ingest from the same container while scoping files by folder and file pattern. You can control filtering through the portal or the connector ARM template by setting blob prefix and suffix patterns.

:::image type="content" source="./media/setup-azure-storage-connector/overview-diagram.png" lightbox="./media/setup-azure-storage-connector/overview-diagram.png" alt-text="A diagram showing the Azure Storage Blob connector architecture, including blob created events, Event Grid, storage queue, and Microsoft Sentinel ingestion flow.":::

The Microsoft Sentinel connector:

- Polls the Azure Storage queue for blob-created messages.
- Fetches files from the Azure Storage Blob container based on the path in the queue message.
- Deletes the queue message after successful forwarding.

The connector authenticates to the Storage Account by using a service principal accessible to the connector application. For the application IDs per cloud and the full template schema, see the [Azure Storage Blob connectors API reference](data-connection-rules-reference-azure-storage.md). Use the ARM template automation to verify that the service principal exists and to apply the required role assignments on the storage account.

## Create an Azure Storage Blob connector

1. Review and adapt the example ARM template in the [Azure Storage Blob connectors API reference](data-connection-rules-reference-azure-storage.md#build-the-azure-storage-blob-ccf-data-connector). Set the container name, queue name (if not auto-created), blob prefix/suffix filters, and destination table mapping.
2. Deploy the template by following [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md#data-connection-rules). Ensure the deployment scope matches the storage account and Microsoft Sentinel workspace.
3. After deployment, confirm the connector instance is created in Microsoft Sentinel and that the Event Grid subscription status is **Healthy**.

## Validate the connector

- Upload a sample file that matches your prefix/suffix filter and confirm that queue messages are created and consumed.
- Verify ingestion in the target table in Microsoft Sentinel and check for errors in the connector health blade.
- If you use network restrictions, confirm that the connector-managed resources can reach the blob and queue endpoints.

## Troubleshooting

For troubleshooting steps, see [Troubleshoot Azure Storage Blob connector issues](azure-storage-blob-connector-troubleshoot.md).

## Related content

- [Azure Storage Blob connectors API reference](data-connection-rules-reference-azure-storage.md)
- [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md)
- [Enable network security on connector integrated storage resources](enable-storage-network-security.md)
- [Troubleshoot Azure Storage Blob connector issues](azure-storage-blob-connector-troubleshoot.md)
