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

| Recommendation | Benefit |
|:---|:---|
| Determine whether to combine your operational data and your security data in the same workspace. | Your decision whether to combine this data depends on your particular security requirements. Combining them in a single workspace you better visibility across all your data although your security team may require a dedicated workspace. See [Design a Log Analytics workspace architecture](../logs/workspace-design.md) for details on making this decision for your environment. |
| Link the workspace to a dedicated cluster to take advantage of additional security features. | Workspaces linked to [dedicated clusters](../logs/logs-dedicated-clusters.md) have the following capabilities:<br>- [Double encryption](../../storage/common/storage-service-encryption.md#doubly-encrypt-data-with-infrastructure-encryption) which enables a second level of data encryption using separate algorithm and keys.<br>- [Lockbox](../logs/customer-managed-keys.md#customer-lockbox-preview) which allows data access control during support cases.<br>- [Customer-managed keys](../logs/customer-managed-keys.md) which allows you to use your own keys to encrypt data for workspaces in the cluster. |
| Use your own encryption key to protect the data and saved queries in your workspaces. | Azure Monitor ensures that all data and saved queries are encrypted at rest using Microsoft-managed keys (MMK). Use [customer-managed key](../logs/customer-managed-keys.md) for higher protection level and control.  |
| Define workspace data required for different roles in your organization. | [Manage access to Log Analytics workspaces](../logs/manage-access.md) describes the different options for granting access to data in the workspace.  Don't grant workspace permissions for users who only require permissions to data related to their resources but instead have those users access the workspace using [resource-context](../logs/manage-access.md#access-mode). |
| Set the access control mode for the workspace to *Use resource or workspace permissions*. | This is the default [access control mode](../logs/manage-access.md#access-control-mode) and ensures that resource owners can access data related to their resources without being granted explicit access to the workspace. |
| Deny workspace permissions for users who only require access to data for their resources. | Resource owners can access the workspace using [resource-context](../logs/manage-access.md#access-mode) without requiring explicit workspace permissions. This simplifies your workspace configuration and helps to ensure users will not be able to access data they shouldn't. |
| Grant workspace permissions to those users who need access to a wide variety of resources. | Assign the appropriate [built-in role](../logs/manage-access.md#azure-rbac) to administrators at either the subscription, resource group, or workspace level depending on their scope of responsibilities. |
| Leverage table level RBAC for users who require access to a set of tables across multiple resources. | For users with unique set of access requirements, [create a custom role](../logs/manage-access.md#set-table-level-read-access) explicitly granting them access to specific tables in the workspace. Users with table permissions have access to all the data in the table regardless of their resource permissions.
| Use Azure private link to increase your network security. | [Azure private link](../logs/private-link-security.md) allows your resources to connect to your Log Analytics workspace without opening any public network access and ensures that your monitoring data is only accessed through authorized private networks. See [Design your Azure Private Link setup](../logs/private-link-design.md) to deterimine the best network and DNS topology for your environment. |
| Export audit data for long term retention or immutability | You may have collected audit data subject to regulations requiring its long term retention. Data in a Log Analytics workspace can’t be altered, but it can be purged. Use [data export](../logs/logs-data-export.md) to send data to an Azure storage account with [immutability policies](../../storage/blobs/immutable-policy-configure-version-scope.md) to keep data tamper protected. Not every type of logs has the same relevance for compliance, auditing, or security, so determine the specific data types that should be exported. 
| Configure log query auditing to track which users are running queries. | [Log query auditing](../logs/query-audit.md) stores the detailed query and user for each query that's run in a workspace. Treat this audit data as security data and secure the [LAQueryLogs](/azure/azure-monitor/reference/tables/laquerylogs) table appropriately. Configure the audit logs for each workspace to be sent to the local workspace, or consolidate in a dedicated security workspace if you separate your operational and security data and consider the query logs to be sensitive information. |
| Determine a strategy to filter or obfuscate sensitive data in your workspace. | You may be collecting data that includes [sensitive information](../logs/personal-data-mgmt.md). Filter records that shouldn't be collected using the configuration for the particular data source. Use a [transformation](../essentials/data-collection-transformations.md) if only particular columns in the data should be removed or obfuscated.<br><br>If you have standards that require the original data to be unmodified, then use the ['h' literal](/azure/data-explorer/kusto/query/scalar-data-types/string#obfuscated-string-literals) in KQL queries to obfuscate query results. |
| Purge sensitive data that was accidentally collected. | Check periodically for private data that may have been accidentally collected in your workspace and use [data purge](../logs/personal-data-mgmt.md#exporting-and-deleting-personal-data) to remove it. |


