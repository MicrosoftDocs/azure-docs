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

#### Design

| Recommendation | Description |
|:---|:---|
| Determine whether to combine your operational data and your security data in the same workspace. | Your decision whether to combine this data depends on your particular security requirements. Combining them in a single workspace you better visibility across all your data although your security team may require a dedicated workspace. See [Design a Log Analytics workspace architecture](../logs/workspace-design.md) for details on making this decision for your environment. |
| Link the workspace to a dedicated cluster to take advantage of additional security features. | Workspaces linked to [dedicated clusters](../logs/logs-dedicated-clusters.md) have the following capabilities:<br>- [Double encryption](../../storage/common/storage-service-encryption.md#doubly-encrypt-data-with-infrastructure-encryption) which enables a second level of data encryption using separate algorithm and keys.<br>- [Lockbox](../logs/customer-managed-keys.md#customer-lockbox-preview) which allows data access control during support cases.<br>- [Customer-managed keys](../logs/customer-managed-keys.md) which allows you to use your own keys to encrypt data for workspaces in the cluster. |
| Use your own encryption key to protect the data and saved queries in your workspaces. | Azure Monitor ensures that all data and saved queries are encrypted at rest using Microsoft-managed keys (MMK). Use [customer-managed key](../logs/customer-managed-keys.md) for higher protection level and control.  |

#### Permissions

| Recommendation | Description |
|:---|:---|
| Assign only required permissions to users accessing Azure Monitor data | No RBAC required for resource owners who only need access to their data in resource-centric mode.<br><br>Assign roles.<br><br>RBAC for users who require access to data for multiple resources.<br><br>Table level RBAC for unique tables. This will give user access to all data in the table even for resources they have no access to. Use transformations to send data to multiple tables, each with unique RBAC. |
| 


#### Auditing

| Recommendation | Description |
|:---|:---|
| Export audit data for long term retention or immutability | You may have collected audit data subject to regulations requiring its long term retention. Data in a Log Analytics workspace can’t be altered, but it can be purged. Use [data export](../logs/logs-data-export.md) to send data to an Azure storage account with [immutability policies](../../storage/blobs/immutable-policy-configure-version-scope.md) to keep data tamper protected. Not every type of logs has the same relevance for compliance, auditing, or security, so determine the specific data types that should be exported. 
| Configure log query auditing to track which users are running queries. | [Log query auditing](../logs/query-audit.md) stores the detailed query and user for each query that's run in a workspace. Treat this audit data as security data and secure the [LAQueryLogs](/azure/azure-monitor/reference/tables/laquerylogs) table appropriately. Configure the audit logs for each workspace to be sent to the local workspace, or consolidate in a dedicated security workspace if you separate your operational and security data and consider the query logs to be sensitive information. |

#### Sensitive data


| Recommendation | Description |
|:---|:---|
| Determine a strategy to filter or obfuscate sensitive data in your workspace. | You may be collecting data that includes [sensitive information](../logs/personal-data-mgmt.md). Filter records that shouldn't be collected using the configuration for the particular data source. Use a [transformation](../essentials/data-collection-transformations.md) if only particular columns in the data should be removed or obfuscated.<br><br>If you have standards that require the original data to be unmodified, then use the ['h' literal](/azure/data-explorer/kusto/query/scalar-data-types/string#obfuscated-string-literals) in KQL queries to obfuscate query results. |
| Purge sensitive data that was accidentally collected. | Check periodically for private data that may have been accidentally collected in your workspace and use [data purge](../logs/personal-data-mgmt.md#exporting-and-deleting-personal-data) to remove it. |


