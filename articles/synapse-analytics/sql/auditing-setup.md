---
title: Set up Auditing
titleSuffix: Azure Synapse Analytics
description: Set up Azure Synapse Analytics auditing to Azure Storage, Log Analytics, or Event Hubs.
author: sravanisaluru
ms.author: srsaluru
ms.reviewer: vanto
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: how-to
---

# Set up auditing for Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

In this article, you learn how to set up auditing for your logical server or database in Azure Synapse Analytics.

## Configure auditing for your server

The default auditing policy includes the following set of action groups, which audit all the queries and stored procedures executed against the database, as well as successful and failed sign-ins:

- `BATCH_COMPLETED_GROUP`
- `SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP`
- `FAILED_DATABASE_AUTHENTICATION_GROUP`

For custom filters and programmatic configuration, see [Manage Azure Synapse Analytics auditing using APIs](auditing-manage-using-api.md).

> [!NOTE]
> You can't enable auditing on a paused dedicated SQL pool. [Quickstart: Pause and resume compute in dedicated SQL pool via the Azure portal](../sql-data-warehouse/pause-and-resume-compute-portal.md) before you configure auditing.
>
> When you configure auditing to a Log Analytics workspace or to an Event Hubs destination in the Azure portal or PowerShell cmdlet, a [Diagnostic Setting](/azure/azure-monitor/essentials/diagnostic-settings) is created with `SQLSecurityAuditEvents` category enabled.
1. In the [Azure portal](https://portal.azure.com), open the Synapse SQL server resource.
1. Under **Security**, select **Auditing**.
1. Enable auditing at the server or database level. A server-level policy applies to every database on that server. For guidance about selecting a scope, see [Auditing policy at the server and database level](auditing-server-level-database-level.md).
1. Select one or more destinations: Azure Storage, Log Analytics, or Event Hubs.
1. Configure each destination, and then save the policy.

## Audit to Azure Storage destination

To configure writing audit logs to a storage account, select **Storage**, choose an account, and set the retention period.

- If the account is behind a virtual network or firewall, auditing uses the server's system-assigned managed identity. Grant that identity the **Storage Blob Data Contributor** role.
- If the account isn't behind a virtual network or firewall, the portal configures storage access key authentication.

A retention value of `0` means unlimited retention. If you change from unlimited retention to a finite period, the new period applies only to logs written after the change.

For protected storage accounts, see [Write audit logs to a storage account behind a virtual network and firewall](audit-write-storage-account-behind-vnet-firewall.md).

> [!WARNING]  
> For storage authentication, use Managed Identity. Storage Access Keys pose a security risk because if they're compromised, unauthorized individuals can access your storage account, potentially reading, writing, or deleting your data. To mitigate these risks, rotate your keys regularly and use Azure Key Vault to manage and rotate your keys securely.

## Audit to Log Analytics destination

Select **Log Analytics**, choose a Log Analytics workspace, and save the policy. If you need a workspace, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).

## Audit to Event Hubs destination

Select **Event Hubs**, choose an event hub in the same region as the Synapse SQL resource, and save the policy.

When you configure auditing with Azure external monitors (for example, Event Hubs or Log Analytics) as the target, the system creates an additional diagnostic settings resource named *SQLSecurityAuditEvents_XXXX-XXXX-XXX*. This resource is critical for the proper functioning of auditing.

If you delete the diagnostic settings, either intentionally or unintentionally, the auditing functionality stops working, and audit logs aren't sent to the target location. To prevent this problem, configure alerts for the deletion of diagnostic settings to notify users and take necessary actions. For more information about creating action groups and configuring alerts, see [Action groups](/azure/azure-monitor/alerts/action-groups) and [Create or edit an activity log, service health, or resource health alert rule](/azure/azure-monitor/alerts/alerts-create-activity-log-alert-rule).

> [!NOTE]  
> If you use multiple targets like a storage account, Log Analytics, or Event Hubs, ensure you have permissions for all the targets. Otherwise, saving audit configuration fails because the system tries to save the settings for all targets.

## Related content

- [Auditing in Azure Synapse Analytics](auditing-overview.md)
- [Analyze Azure Synapse Analytics audit logs and reports](auditing-analyze-audit-logs.md)
- [Auditing using managed identity in Azure Synapse Analytics](auditing-managed-identity.md)
- [Azure Monitor diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings)
