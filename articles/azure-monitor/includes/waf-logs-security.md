---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 08/24/2023
---

### Design checklist

> [!div class="checklist"]
> - Determine whether to combine your operational data and your security data in the same Log Analytics workspace.
> - Configure access for different types of data in the workspace required for different roles in your organization.
> - Consider using Azure private link to remove access to your workspace from public networks.
> - Use customer managed keys if you require your own encryption key to protect data and saved queries in your workspaces.
> - Export audit data for long term retention or immutability.
> - Configure log query auditing to track which users are running queries.
> - Determine a strategy to filter or obfuscate sensitive data in your workspace.
> - Purge sensitive data that was accidentally collected.
> - Enable Customer Lockbox for Microsoft Azure to approve or reject Microsoft data access requests.


### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Determine whether to combine your operational data and your security data in the same Log Analytics workspace. | Your decision whether to combine this data depends on your particular security requirements. Combining them in a single workspace gives you better visibility across all your data, although your security team might require a dedicated workspace. See [Design a Log Analytics workspace strategy](../logs/workspace-design.md) for details on making this decision for your environment balancing it with criteria in other pillars.<br><br>Tradeoff: There are potential cost implications to enabling Sentinel in your workspace. See details in [Design a Log Analytics workspace architecture](../logs/workspace-design.md). |
| Configure access for different types of data in the workspace required for different roles in your organization. | Set the [access control mode](../logs/manage-access.md#access-control-mode) for the workspace to *Use resource or workspace permissions* to allow resource owners to use [resource-context](../logs/manage-access.md#access-mode) to access their data without being granted explicit access to the workspace. This simplifies your workspace configuration and helps to ensure users will not be able to access data they shouldn't.<br><br>Assign the appropriate [built-in role](../logs/manage-access.md#azure-rbac) to grant workspace permissions to administrators at either the subscription, resource group, or workspace level depending on their scope of responsibilities.<br><br>Leverage [table level RBAC](../logs/manage-access.md#set-table-level-read-access) for users who require access to a set of tables across multiple resources. Users with table permissions have access to all the data in the table regardless of their resource permissions.<br><br>See [Manage access to Log Analytics workspaces](../logs/manage-access.md) for details on the different options for granting access to data in the workspace. |
| Consider using Azure private link to remove access to your workspace from public networks. | Connections to public endpoints are secured with end-to-end encryption. If you require a private endpoint, you can use [Azure private link](../logs/private-link-security.md) to allow resources to connect to your Log Analytics workspace through authorized private networks. Private link can also be used to force workspace data ingestion through ExpressRoute or a VPN. See [Design your Azure Private Link setup](../logs/private-link-design.md) to determine the best network and DNS topology for your environment. |
| Use customer managed keys if you require your own encryption key to protect data and saved queries in your workspaces. | Azure Monitor ensures that all data and saved queries are encrypted at rest using Microsoft-managed keys (MMK). If you require your own encryption key and collect enough data for a [dedicated cluster](../logs/logs-dedicated-clusters.md), use [customer-managed key](../logs/customer-managed-keys.md) for greater flexibility and key lifecycle control. If you use Microsoft Sentinel, then make sure that you're familiar with the considerations at [Set up Microsoft Sentinel customer-managed key](../../sentinel/customer-managed-keys.md#considerations).  |
| Export audit data for long term retention or immutability. | You might have collected audit data in your workspace that's subject to regulations requiring its long term retention. Data in a Log Analytics workspace can’t be altered, but it can be [purged](../logs/personal-data-mgmt.md#exporting-and-deleting-personal-data). Use [data export](../logs/logs-data-export.md) to send data to an Azure storage account with [immutability policies](../../storage/blobs/immutable-policy-configure-version-scope.md) to protect against data tampering. Not every type of logs has the same relevance for compliance, auditing, or security, so determine the specific data types that should be exported. |
| Configure log query auditing to track which users are running queries. | [Log query auditing](../logs/query-audit.md) records the details for each query that's run in a workspace. Treat this audit data as security data and secure the [LAQueryLogs](/azure/azure-monitor/reference/tables/laquerylogs) table appropriately. Configure the audit logs for each workspace to be sent to the local workspace, or consolidate in a dedicated security workspace if you separate your operational and security data. Use [Log Analytics workspace insights](../logs/log-analytics-workspace-insights-overview.md) to periodically review this data and consider creating log search alert rules to proactively notify you if unauthorized users are attempting to run queries. |
| Determine a strategy to filter or obfuscate sensitive data in your workspace. | You might be collecting data that includes [sensitive information](../logs/personal-data-mgmt.md). Filter records that shouldn't be collected using the configuration for the particular data source. Use a [transformation](../essentials/data-collection-transformations.md) if only particular columns in the data should be removed or obfuscated.<br><br>If you have standards that require the original data to be unmodified, then you can use the ['h' literal](/azure/data-explorer/kusto/query/scalar-data-types/string#obfuscated-string-literals) in KQL queries to obfuscate query results displayed in workbooks. |
| Purge sensitive data that was accidentally collected. | Check periodically for private data that might have been accidentally collected in your workspace and use [data purge](../logs/personal-data-mgmt.md#exporting-and-deleting-personal-data) to remove it. |
|Enable Customer Lockbox for Microsoft Azure to approve or reject Microsoft data access requests.|[Customer Lockbox for Microsoft Azure](../../security/fundamentals/customer-lockbox-overview.md) provides you with an interface to review and approve or reject customer data access requests. It's used in cases where a Microsoft engineer needs to access customer data, whether in response to a customer-initiated support ticket or a problem identified by Microsoft.|

