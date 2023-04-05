---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - 

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Link the workspace to a [dedicated cluster](../logs/logs-dedicated-clusters.md) to take advantage of additional security features. | Workspaces linked to dedicated clusters have the following capabilities:<br>- [Double encryption](../../storage/common/storage-service-encryption.md#doubly-encrypt-data-with-infrastructure-encryption) which enables a second level of data encryption using separate algorithm and keys.<br>[Lockbox](../logs/customer-managed-keys.md#customer-lockbox-preview) which allows data access control during support cases.<br>- [Customer-managed keys](/logs/customer-managed-keys.md) which allows you to use your own keys to encrypt data in the cluster. |
| Customer-managed keys | Azure Monitor ensures that all data and saved queries are encrypted at rest using Microsoft-managed keys (MMK). Use [customer-managed key](/logs/customer-managed-keys.md) for higher protection level and control.  |
| Assign only required permissions to users accessing Azure Monitor data | No RBAC required for resource owners who only need access to their data in resource-centric mode.<br><br>Assign roles.<br><br>RBAC for users who require access to data for multiple resources.<br><br>Table level RBAC for unique tables. This will give user access to all data in the table even for resources they have no access to. Use transformations to send data to multiple tables, each with unique RBAC. |
| Filter or obfuscate sensitive data | Either filter or obfuscate private data at the source so it isn’t sent to Azure monitor, or use a transformation to filter or obfuscate sensitive data before it’s stored.<br><br>This modifies the data from its original form which may be unacceptable for particular auditing. If this is unacceptable, then obfuscate the data at visualization. |
| Purge private data that may have been ingested in error. | Private data can be removed from a Log Analytics workspace using purge (not intended as recuring operation). See Managing personal data in Azure Monitor Log Analytics and Application Insights |
| Configure [log query auditing](../logs/query-audit.md) to track which users are running queries. | Log query auditing stores the detailed query and user for each query that's run in a workspace. Treat this audit data as security data and secure the [LAQueryLogs](/azure/azure-monitor/reference/tables/laquerylogs) table appropriately. Configure the audit logs to be sent to the local workspace, or consolidate in a centralized workspace if this is how you |
