---
title: Auditing
titleSuffix: Azure Synapse Analytics
description: Azure Synapse Analytics auditing tracks SQL events and writes them to Azure Storage, Log Analytics, or Event Hubs.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: peskount, srsaluru, vanto, mathoma
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
---

# Auditing in Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]


Azure Synapse Analytics auditing tracks database events and writes them to Azure Storage, an Azure Monitor Log Analytics workspace, or Azure Event Hubs.

Auditing helps you:

- Retain an audit trail of selected events.
- Understand database activity and investigate discrepancies or anomalies.
- Report on activity by using queries, workbooks, and downstream monitoring tools.
- Support regulatory and organizational compliance requirements. Auditing doesn't guarantee compliance by itself.


## Overview

You can use SQL Database auditing to:

- **Retain** an audit trail of selected events. You can define categories of database actions to be audited.
- **Report** on database activity. You can use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
- **Analyze** reports. You can find suspicious events, unusual activity, and trends.

> [!IMPORTANT]
> Auditing is optimized for the availability and performance of the SQL pool. During periods of very high activity or network load, transactions might proceed without every selected event being recorded.


### Recommended auditing approach for large OLTP workloads

For environments with many databases running heavy OLTP workloads, using server-level auditing with default settings can lead to very large audit volumes across the logical server. Since all events from all databases are written into the same audit folder, querying audit logs for a single database becomes slow and operationally expensive. To improve performance and reduce noise:

   - **Switch to database-level auditing**. Each database writes to its own audit log folder, reducing the total volume scanned and making retrieval faster.
   - **Review the audit configuration**. Determine whether capturing all batch-completed events is necessary, or if a custom filtered configuration can meet your security and compliance requirements.

## Protect sensitive information in audit logs

Audited statement text can contain sensitive values when applications concatenate those values into dynamic SQL. Use parameters for data values, avoid embedding secrets or personal data in query text, and restrict audit-log access to authorized users.

Permissions on the audit destination control access outside the SQL engine. Apply least privilege to Azure Storage, Log Analytics, and Event Hubs, and monitor access to those resources.

## Limitations

- You can't enable auditing on a paused dedicated SQL pool. Resume the pool before enabling the policy.
- User-assigned managed identities aren't supported for auditing in Azure Synapse Analytics.
- A system-assigned managed identity is supported for an Azure Storage destination when the storage account is behind a virtual network or firewall. Managed identities aren't supported for Azure Synapse unless the storage account is behind a virtual network or firewall.
- Synapse SQL pools support only the default audit action groups.
- Auditing isn't supported on databases with names that contain the `?` character. This limitation applies to both **server-level** and **database-level** auditing, as databases with `?` in their names are *no longer supported on Azure*.
- Audit records store up to 4,000 characters in the `statement` and `data_sensitivity_information` fields. Additional characters are truncated.

## Remarks

- Events initiated by `SQLDBControlPlaneFirstPartyApp` in the Activity log are an internal Azure function of the [Azure SQL Database control plane](/azure/azure-resource-manager/management/control-plane-and-data-plane#control-plane). Events initiated by `SQLDBControlPlaneFirstPartyApp` are part of an internal synchronization operation between the SQL engine and Azure Resource Manager. These events are a normal part of Azure SQL Database management and are required for correct resource representation and operation in Azure.
- **Premium storage** with **BlockBlobStorage** is supported. Standard storage is supported. However, to write audit logs to a storage account behind a virtual network or firewall, you must use a **general-purpose v2 storage account**. If you use a general-purpose v1 or Blob Storage account, [upgrade to a general-purpose v2 storage account](/azure/storage/common/storage-account-upgrade). For specific instructions, see [Write audit logs to a storage account behind a virtual network and firewall](audit-write-storage-account-behind-vnet-firewall.md). For more information, see [Types of storage accounts](/azure/storage/common/storage-account-overview#types-of-storage-accounts).
- When you enable SQL auditing and configure **outbound networking** restrictions, you must allow list the fully qualified domain names of your auditing storage account to ensure audit events can reach the destination. If you don't allow list the storage endpoint, audit traffic is blocked, resulting in audit event loss. After adding the required storage account FQDNs to the allow list, you must **re-save** your auditing configuration to resume normal audit event flow.
- **Hierarchical namespace** for all types of **standard storage account** and **premium storage account with BlockBlobStorage** is supported.
- Audit logs are written to **Append Blobs** in an Azure Blob Storage on your Azure subscription.
- Audit logs are in .xel format and can be opened with [SQL Server Management Studio (SSMS)](/ssms/sql-server-management-studio-ssms).
- To configure an immutable log store for the server or database-level audit events, follow the [instructions provided by Azure Storage](/azure/storage/blobs/immutable-time-based-retention-policy-overview#allow-protected-append-blobs-writes). When configuring immutable blob storage for auditing, ensure that **Allow protected append writes** is set to either **Append blobs** or **Block and append blobs**. The **None** option isn't supported. For time-based retention policies, the storage account's retention interval must be shorter than the SQL Auditing retention setting. Configurations where the storage policy is set, but SQL Auditing retention is `0`, aren't supported.
- You can write audit logs to an Azure Storage account behind a virtual network or firewall.
- For details about the log format, hierarchy of the storage folder, and naming conventions, see [audit log format](audit-log-format.md).
- When using Microsoft Entra authentication, failed logins records *don't* appear in the SQL audit log. To view failed login audit records, you need to visit the [Microsoft Entra admin center](https://entra.microsoft.com), which logs details of these events.
- After you configure your auditing settings, you can turn on the new threat detection feature and configure emails to receive security alerts. When you use threat detection, you receive proactive alerts on anomalous database activities that can indicate potential security threats. For more information, see [SQL Advanced Threat Protection](threat-detection-overview.md).
- After a database with auditing enabled is copied to another [logical server](logical-servers.md), you might receive an email notifying you that the audit failed. This condition is a known issue and auditing should work as expected on the newly copied database.

## Related content

- [Set up auditing for Azure Synapse Analytics](auditing-setup.md)
- [Azure Synapse Analytics audit log format](audit-log-format.md)
- [Analyze Azure Synapse Analytics audit logs and reports](auditing-analyze-audit-logs.md)
- [Auditing best practices for production environments](auditing-best-practices.md)
- [Auditing using managed identity in Azure Synapse Analytics](auditing-managed-identity.md)
