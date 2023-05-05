---
title: "Migrate MySQL on-premises to Azure Database for MySQL: Post Migration Management"
description: "Once the migration has been successfully completed, the next phase it to manage the new cloud-based data workload resources."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: rothja
ms.author: jroth
ms.reviewer: maghan
ms.custom:
ms.date: 06/21/2021
---

# Migrate MySQL on-premises to Azure Database for MySQL: Post Migration Management

[!INCLUDE[applies-to-mysql-single-flexible-server](../../includes/applies-to-mysql-single-flexible-server.md)]

## Prerequisites

[Data migration with MySQL Workbench](09-data-migration-with-mysql-workbench.md)

## Monitoring and alerts

Once the migration has been successfully completed, the next phase it to manage the new cloud-based data workload resources. Management operations include both control plane and data plane activities. Control plane activities are those related to the Azure resources versus data plane, which is **inside** the Azure resource (in this case MySQL).

Azure Database for MySQL provides for the ability to monitor both of these types of operational activities using Azure-based tools such as [Azure Monitor,](../../../azure-monitor/overview.md) [Log Analytics](../../../azure-monitor/logs/log-analytics-overview.md) and [Microsoft Sentinel](../../../sentinel/overview.md). In addition to the Azure-based tools, security information and event management (SIEM) systems can be configured to consume these logs as well.

Whichever tool is used to monitor the new cloud-based workloads, alerts need to be created to warn Azure and database administrators of any suspicious activity. If a particular alert event has a well-defined remediation path, alerts can fire automated [Azure run books](../../../automation/learn/powershell-runbook-managed-identity.md) to address the event.

The first step to creating a fully monitored environment is to enable MySQL log data to flow into Azure Monitor. Reference [Configure and access audit logs for Azure Database for MySQL in the Azure portal](../../howto-configure-audit-logs-portal.md) for more information.

Once log data is flowing, use the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/) query language to query the various log information. Administrators unfamiliar with KQL can find a SQL to KQL cheat sheet [here](/azure/data-explorer/kusto/query/sqlcheatsheet) or the [Get started with log queries in Azure Monitor](../../../azure-monitor/logs/get-started-queries.md) page.

For example, to get the memory usage of the Azure Database for MySQL:

```
AzureMetrics
| where TimeGenerated \> ago(15m)
| limit 10
| where ResourceProvider == "MICROSOFT.DBFORMYSQL"
| where MetricName == "memory\_percent"
| project TimeGenerated, Total, Maximum, Minimum, TimeGrain, UnitName 
| top 1 by TimeGenerated
```
To get the CPU usage:

```
AzureMetrics
| where TimeGenerated \> ago(15m)
| limit 10
| where ResourceProvider == "MICROSOFT.DBFORMYSQL"
| where MetricName == "cpu\_percent"
| project TimeGenerated, Total, Maximum, Minimum, TimeGrain, UnitName 
| top 1 by TimeGenerated
```
Once you've created the KQL query, you then create [log alerts](../../../azure-monitor/alerts/alerts-unified-log.md) based of these queries.

## Server parameters

As part of the migration, it's likely the on-premises [server parameters](../../concepts-server-parameters.md) were modified to support a fast egress. Also, modifications were made to the Azure Database for MySQL parameters to support a fast ingress. The Azure server parameters should be set back to their original on-premises workload optimized values after the migration.

However, be sure to review and make server parameters changes that are appropriate for the workload and the environment. Some values that were great for an on-premises environment, may not be optimal for a cloud-based environment. Additionally, when planning to migrate the current on-premises parameters to Azure, verify that they can in fact be set.

Some parameters aren't allowed to be modified in Azure Database for MySQL.

## PowerShell module

The Azure portal and Windows PowerShell can be used for managing the Azure Database for MySQL. To get started with PowerShell, install the Azure PowerShell cmdlets for MySQL with the following PowerShell command:

`Install-Module -Name Az.MySql`

After the modules are installed, reference tutorials like the following to learn ways you can take advantage of scripting your management activities:

  - [Tutorial: Design an Azure Database for MySQL using PowerShell](../../tutorial-design-database-using-powershell.md)

  - [How to back up and restore an Azure Database for MySQL server using PowerShell](../../howto-restore-server-powershell.md)

  - [Configure server parameters in Azure Database for MySQL using PowerShell](../../howto-configure-server-parameters-using-powershell.md)

  - [Auto grow storage in Azure Database for MySQL server using PowerShell](../../howto-auto-grow-storage-powershell.md)

  - [How to create and manage read replicas in Azure Database for MySQL using PowerShell](../../howto-read-replicas-powershell.md)

  - [Restart Azure Database for MySQL server using PowerShell](../../howto-restart-server-powershell.md)

## Azure Database for MySQL upgrade process

Since Azure Database for MySQL is a PaaS offering, administrators aren't responsible for the management of the updates on the operating system or the MySQL software. However, it's important to be aware the upgrade process can be random and when being deployed, can stop the MySQL server workloads. Plan for these downtimes by rerouting the workloads to a read replica in the event the particular instance goes into maintenance mode.

> [!NOTE]
> This style of failover architecture may require changes to the applications data layer to support this type of failover scenario. If the read replica is maintained as a read replica and is not promoted, the application can only read data and it may fail when any operation attempts to write information to the database.

The [Planned maintenance notification](../../concepts-monitoring.md#planned-maintenance-notification) feature informs resource owners up to 72 hours in advance of installation of an update or critical security patch. Database administrators may need to notify application users of planned and unplanned maintenance.

> [!NOTE]
> Azure Database for MySQL maintenance notifications are incredibly important. The database maintenance can take your database and connected applications down for a period of time.

## WWI scenario

WWI decided to utilize the Azure Activity logs and enable MySQL logging to flow to a [Log Analytics workspace.](../../../azure-monitor/logs/workspace-design.md) This workspace is configured to be a part of [Microsoft Sentinel](../../../sentinel/index.yml) such that any [Threat Analytics](../../concepts-security.md#threat-protection) events would be surfaced, and incidents created.

The MySQL DBAs installed the Azure Database for [MySQL Azure PowerShell cmdlets](../../quickstart-create-mysql-server-database-using-azure-powershell.md) to make managing the MySQL Server automated versus having to log to the Azure portal each time.

## Management checklist

  - Create resource alerts for common things like CPU and Memory.

  - Ensure the server parameters are configured for the target data workload after migration.

  - Script common administrative tasks.

  - Set up notifications for maintenance events such as upgrades and patches. Notify users as necessary.  


## Next steps

> [!div class="nextstepaction"]
> [Optimization](./11-optimization.md)
