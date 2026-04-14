---
title: Troubleshoot Azure Storage Blob connector issues - Microsoft Sentinel
description: Troubleshoot Azure Storage Blob connector issues in Microsoft Sentinel.
author: EdB-MSFT
ms.author: edbaynash
ms.topic: troubleshooting
ms.date: 02/19/2026
ms.service: microsoft-sentinel

#Customer intent: As a security engineer, I want to troubleshoot Azure Storage Blob connector issues so that I can ensure seamless log ingestion into Microsoft Sentinel.

---

# Troubleshoot Azure Storage Blob connector issues

The Azure Storage Blob connector simplifies the process of ingesting data from Azure Storage Blobs to Microsoft Sentinel.

This article describes how to quickly identify the cause of issues occurring with the Azure Storage Blob connector so you can find the steps needed to resolve the issues.

Learn how to [connect Microsoft Sentinel to Azure Storage Blob to ingest data](setup-azure-storage-connector.md).

## Microsoft Sentinel doesn't receive data from the Azure Storage Blob connector

The logs for the Azure Storage Blob connector aren't visible in the Microsoft Sentinel workspace for more than 30 minutes after the connector was connected.

Before you search for a cause and solution, review these considerations:

- It can take around 20-30 minutes from the moment the connector is connected until data is ingested into the workspace.
- The connector's connection status indicates that a collection rule exists; it doesn't indicate that data was ingested. If the status of the Azure Storage Blob connector is green, there's a collection rule for one of the data types, but still no data.

### Determine the cause of your problem

In this section, we cover these causes:

1. [The data isn't ingested to the Azure Storage Blob container.](#cause-1-the-data-isnt-ingested-to-the-azure-storage-blob-container)
1. [The Azure Storage queue isn't receiving notifications for blob created events.](#cause-2-the-azure-storage-queue-isnt-receiving-notifications-for-blob-created-events)
1. [The Azure Storage Blob connector permissions or networking policies aren't set properly.](#cause-3-the-azure-storage-blob-connector-permissions-or-networking-policies-arent-set-properly)
1. [The queue message content or Azure Storage Blob data format is invalid.](#cause-4-the-queue-message-content-or-azure-storage-blob-data-format-is-invalid)
1. [The DCR or DCE configuration is incorrect.](#cause-5-the-dcr-or-dce-configuration-is-incorrect)

> [!TIP]
> If the health feature isn't enabled, [enable it](enable-monitoring.md).

### Cause 1: The data isn't ingested to the Azure Storage Blob container

The upstream system isn't successfully delivering data to the expected storage container.

#### Solution: Verify data ingress on the storage account

1. Verify that the storage account has hierarchical namespace enabled (Azure Data Lake Storage Gen2). The connector requires ADLS Gen2 storage accounts.
1. In the Azure portal, navigate to the storage account and review the **Metrics** to confirm ingress activity.
1. Check that the expected storage container is receiving blobs.
1. If the container is empty, review the upstream producing system for issues delivering data to the account.

### Cause 2: The Azure Storage queue isn't receiving notifications for blob created events

Event Grid system topics facilitate blob created events from the source storage account to the target storage queue. If the system topic or subscription isn't configured correctly, events won't flow to the queue.

#### Solution: Verify Event Grid system topic and subscription

1. Check the resource group's deployments for any failures when creating the system topic resources. If a system topic already exists on the storage account from a different configuration, it might conflict with the connector's subscription.
1. If the Event Grid system topic and subscription were successfully created, review the metrics of the Event Grid subscription. Consider [enabling diagnostic logs](/azure/event-grid/enable-diagnostic-logs-topic).
1. Verify that the subscription source maps to the correct storage account and target queue.
1. Review the filtering criteria specified under **Additional Features** to ensure it matches expected patterns.
1. The Event Grid subscription's metrics should show events that match the blob created criteria. If the metrics indicate **Delivery Failed Events**, review the Event Grid's diagnostic logs and continue to the next section for policy-related issues.
1. Check the storage queue metrics to confirm messages are arriving. In the Azure portal, navigate to the storage account, select **Queues**, and review the **Approximate Messages Count** for the connector queue. If the queue is empty but Event Grid shows successful deliveries, the connector might be consuming messages but failing to process the referenced blobs.

:::image type="content" source="./media/azure-storage-blob-connector-troubleshoot/event-grid-subscription-metrics.png" lightbox="./media/azure-storage-blob-connector-troubleshoot/event-grid-subscription-metrics.png" alt-text="Screenshot showing an Event Grid subscription metrics chart.":::

### Cause 3: The Azure Storage Blob connector permissions or networking policies aren't set properly

This issue is caused by incorrect role-based access policies applied to the storage account(s) hosting the blob container and/or the message queue, or by network security settings blocking traffic.

#### Solution: Verify permissions and networking

Review the [Set up your Azure Storage connector](setup-azure-storage-connector.md) documentation and ensure the following are in place:

**Service principal and RBAC checks:**

1. Verify that the application ID of the service principal matches the application IDs per Azure environment specified in the [Azure Storage Blob connectors API reference](data-connection-rules-reference-azure-storage.md#authentication-configuration).
1. Verify that the service principal has the **Storage Blob Data Reader** role on the storage accounts hosting the blob container.
1. Verify that the service principal has the **Storage Queue Data Contributor** role on the storage accounts hosting the message queues.

> [!TIP]
> Clues to failures of this kind are exposed on connectivity check issues during installation and in the `SentinelHealth` table for active connectors.

**Network security checks:**

If the service principal and RBAC troubleshooting doesn't surface an issue, the network security settings on the storage account(s) might be causing the problem. The network security solution for this connector relies on [Network Security Perimeter](/azure/private-link/network-security-perimeter-concepts) based protection. Review the [Enable network security](enable-storage-network-security.md) documentation to ensure all steps were followed correctly, and check the following:

- If you aren't using NSP to protect the resource, check the storage account's **Networking** blade to ensure public network access is enabled.
- Verify that the storage account isn't using selected network limits via IPv4 CIDR addresses. This approach doesn't work with the connector's IP traffic due to the documented [storage firewall limitations](/azure/storage/common/storage-network-security-limitations#restrictions-for-ip-network-rules) around IP ranges and region affinity of the caller and the account.
- If NSP is being used to protect the account, enable the [perimeter's diagnostic logs](/azure/private-link/network-security-perimeter-diagnostic-logs) to troubleshoot. NSP rules only apply to resources in **Enforced** access mode. Alternatively, **Transition** mode doesn't apply the rules on the resource while continuing to collect telemetry on traffic patterns. Review the profile associated with the storage account(s):
  - Check that inbound rules for the producer are in place. Check for blob write failures on the producer.
  - Check that inbound rules for the connector are in place per the [Enable network security](enable-storage-network-security.md) documentation. Verify that the `Scuba` service tag IP ranges are included in the NSP inbound rules.
  - Check that inbound rules include a rule for the subscription of the storage account and Event Grid system topic. 
  - Ensure the Event Grid system topic subscription is using **System Assigned** managed identity-based delivery.

  :::image type="content" source="./media/azure-storage-blob-connector-troubleshoot/system-topic-managed-identity-type.png" lightbox="./media/azure-storage-blob-connector-troubleshoot/system-topic-managed-identity-type.png" alt-text="Screenshot of Network Security Perimeter rules showing inbound rules for the producer and connector, including Scuba service tag and subscription rule.":::


### Cause 4: The queue message content or Azure Storage Blob data format is invalid

The blob data format or queue message structure doesn't match the expected configuration.

#### Solution: Verify data format and queue messages

1. Check the `SentinelHealth` table for clues about invalid messages by running the following query:

    ```kusto
    SentinelHealth
    | where TimeGenerated > ago(1d)
    | where SentinelResourceKind == "StorageAccountBlobContainer"
    | where Status != "Success"
    | distinct TimeGenerated, OperationName, SentinelResourceName, Status, Description
    ```

1. If the health data references invalid data, verify that the format of the blobs uploaded to storage matches the serialization and compression model set in the connector's response configuration. The connector supports the following formats: **JSON**, **CSV**, **XML**, and **Parquet**. For more information, see the [response configuration](data-connection-rules-reference-azure-storage.md#response-configuration) in the API reference.
1. Queue message format exceptions result from messages in the queue not aligning to the `EventGridSchema` for `BlobCreated` events. Check the Event Grid subscription's **Filters** section to confirm:
   - The filter is set to **Blob Created**.
   - The event schema is **EventGridSchema**.

   :::image type="content" source="./media/azure-storage-blob-connector-troubleshoot/system-topic-filters.png" lightbox="./media/azure-storage-blob-connector-troubleshoot/system-topic-filters.png" alt-text="Screenshot of Event Grid system topic filters.":::

### Cause 5: The DCR or DCE configuration is incorrect

The Data Collection Rule (DCR) or Data Collection Endpoint (DCE) referenced by the connector is misconfigured, causing ingestion failures after the connector successfully reads the blob data.

#### Solution: Verify the DCR and DCE configuration

1. Verify that the DCE referenced in the connector's `dcrConfig.dataCollectionEndpoint` property is accessible and in the same region as the Log Analytics workspace.
1. Verify that the DCR immutable ID in `dcrConfig.dataCollectionRuleImmutableId` is correct. You can find the immutable ID by viewing the DCR resource properties in the Azure portal or using the [DCR API](/rest/api/monitor/data-collection-rules/get).
1. Verify that the `streamName` in the connector configuration matches the `streamDeclarations` defined in the DCR.
1. If the DCR uses a KQL transformation query, test the query independently in the Log Analytics workspace to ensure it's valid.
1. Verify that the destination table defined in the DCR exists in the Log Analytics workspace and has the expected schema.
1. For more information on configuring the DCR, see the [DCR configuration](data-connection-rules-reference-azure-storage.md#dcr-configuration) section in the API reference.

## Next steps

In this article, you learned how to quickly identify causes and resolve common issues with the Azure Storage Blob connector.

We welcome feedback, suggestions, requests for features, bug reports or improvements and additions. Go to the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel) to create an issue or fork and upload a contribution.

## Related content

- [Set up your Azure Storage connector to stream logs to Microsoft Sentinel](setup-azure-storage-connector.md)
- [Azure Storage Blob data connector reference for the Codeless Connector Framework](data-connection-rules-reference-azure-storage.md)
- [Enable network security on connector integrated storage resources](enable-storage-network-security.md)
- [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md)
