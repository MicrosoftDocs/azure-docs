---
title: Azure Business Continuity center support matrix
description: Provides a summary of support settings and limitations for the Azure Business Continuity center service.
ms.topic: conceptual
ms.date: 11/15/2023
ms.custom:
  - references_regions
  - ignite-2023
ms.service: azure-business-continuity-center
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure Business Continuity center (preview)

This article describes supportable scenarios and limitations.

You can use [Azure Business Continuity center](business-continuity-center-overview.md), a cloud-native unified business continuity and disaster recovery (BCDR) management platform in Azure to manage your protection estate across solutions and environments. This helps enterprises to govern, monitor, operate, and analyze backups and replication at scale. This article summarizes the solutions and scenarios that ABC center supports for each workload type.

## Supported regions

Azure Business Continuity center currently supports the following region: West Central US.

>[!Note]
>To manage Azure resources using Azure Business Continuity center in other regions, write to us at [ABCRegionExpansion@microsoft.com](mailto:ABCRegionExpansion@microsoft.com).

## Supported solutions and datasources

The following table lists all supported scenarios:

| Solution | Resource/datasource type |
| --- | --- |
| [Azure Backup](/azure/backup/) | - Azure VM backup <br> - SQL in Azure VM backup <br> - SAP HANA on Azure VM backup <br> - Azure Files backup <br> - Azure Blobs backup <br> - Azure Managed Disks backup <br> - Azure Database for PostgreSQL Server backup <br> - Azure Kubernetes services |
| [Azure Site Recovery](/azure/site-recovery/) | - Azure to Azure disaster recovery <br> - VMware and Physical to Azure disaster recovery |

## Supported scenarios

The following table lists all supported scenarios:

| Category | Scenario | Supported solution and workloads | Limits |
| --- | --- | --- | --- |
| Monitoring | View all backup and site recovery jobs. | All Solutions and datasource types from above table. | - Seven days’ worth of jobs available out of the box. <br><br> - Each filter/drop-down supports a maximum of 1000 items. Hence, if you want to filter the grid for a particular vault, there might be scenarios where you might not see the desired vault if you have more than 1000 vaults. In these cases, choosing the ‘All’ option in filter helps you aggregate data across your entire set of subscriptions and vaults that you have access to. |
| Monitoring | View Azure Monitor alerts at scale | **Azure Backup**: <br><br> - Azure Virtual Machine <br> - Azure Database for PostgreSQL server <br> - SQL in Azure VM <br> - SAP HANA in Azure VM <br> - Azure Files <br> - Azure Blobs <br> - Azure Disks <br><br> **Azure Site Recovery**: <br><br> - Azure to Azure disaster recovery <br> - VMware and Physical to Azure disaster recovery | See [Alerts documentation](/azure/backup/backup-azure-monitoring-built-in-monitor#azure-monitor-alerts-for-azure-backup). |
| Monitoring | View Azure Backup metrics and write metric alert rules. | **Azure Backup**: <br><br> - Azure Virtual Machine <br> - SQL in Azure VM <br> - SAP HANA in Azure VM <br> - Azure Files <br> - Azure Blobs (Restore Health Events metric only) <br> - Azure Kubernetes Services | See [Metrics documentation](/azure/backup/metrics-overview#supported-scenarios). |
| Security | View security level | Only for the Azure Backup supported datasources given in the above table, and vaults. |        |
| Governance | View resources not configured for protection. | **Azure Backup**: <br><br> - Azure VM backup <br> - Azure Storage account (with no file or blobs protected) <br> - Azure Managed Disks backup <br> - Azure Database for PostgreSQL Server backup <br> - Azure Kubernetes services <br><br> **Azure Site Recovery**: <br><br> - Azure to Azure disaster recovery |            |
| Governance | View all protected items across solutions. | All solutions and datasource types as given in the above table. | Same as previous. |
| Governance | View and assign built-in and custom Azure Policies under category Azure Backup and Azure Site Recovery. | N/A |	N/A |
| Manage | View all protection policies – backup policies for Azure Backup and Replication policies for Azure Site Recovery. | All solutions and datasource types given in the above table. | Same as previous. |
| Manage | View all vaults. | All solutions and datasource types given in the above table. | Same as previous. |
| Action | Configure protection (backup and replication). | All solutions and datasource types given in the above table.   <br><br> **Azure Backup** <br><br>  - Azure Virtual Machine <br>   - Azure disk backup    <br>  - Azure Database for PostgreSQL Server backup   <br> - Azure Kubernetes services    <br><br> **Azure Site Recovery**   <br><br>  - Azure Virtual Machine | See support matrices for [Azure Backup](/azure/backup/backup-support-matrix) and [Azure Site Recovery](/en-us/azure/site-recovery/azure-to-azure-support-matrix). |
| Action | Enhance protection (configure backup or replication existing protected item). | Only for Azure Virtual Machine. |         |
| Action | Recover action is a collection of all actions related to recovery like: <br><br> - For backup: restore, restore to secondary region, file recovery. <br> - For replication: Failover, test failover, test failover cleanup. | Depends on the datasource type chosen. [Learn more](#supported-scenarios) about each action to recover. |             |
Action | Restore. | Only for Azure Backup supported datasources given in the above table. |         |
| Action | Restore to secondary region. | Only for Azure Backup supported datasources – Azure Virtual Machines, SQL in Azure VM, SAP HANA in Azure VM, Azure Database for PostgreSQL server. | See the [cross-region restore documentation](/azure/backup/backup-create-rs-vault#set-cross-region-restore). |
| Action | File recovery. | Only for Azure Backup supported datasources – Azure Virtual Machines and Azure Files. |         |
| Action | Delete. | Only for Azure Backup supported datasources given in the above table. |           |
| Action | Execute on-demand backup. | Only for Azure Backup supported datasources given in the above table. | See support matrices for [Azure VM backup](/azure/backup/backup-azure-database-postgresql-support-matrix) and [Azure Database for PostgreSQL Server backup](/azure/backup/backup-azure-database-postgresql-support-matrix). |
| Action | Stop backup. | Only for Azure Backup supported datasources given in the above table. | See support matrices for [Azure VM backup](/azure/backup/backup-azure-database-postgresql-support-matrix) and [Azure Database for PostgreSQL Server backup](/azure/backup/backup-azure-database-postgresql-support-matrix). |
| Action | Create vault. | All Solutions and datasource types given in the above table. | See [support matrices for Recovery Services vault](/azure/backup/backup-support-matrix#vault-support). |
| Action | Create Protection (backup and replication) policy. All solutions and datasource types given in the above table. | See the [Backup policy support matrices for Recovery Services vault](/azure/backup/backup-support-matrix#vault-support). |
| Action | Disable replication. | Only for Azure Site Recovery supported datasources given in the above table. |       |
| Action | Failover. | Only for Azure Site Recovery supported datasources given in the above table. |        |
| Action | Test Failover. | Only for Azure Site Recovery supported datasources given in the above table. |        |
| Action | Cleanup test failover. | Only for Azure Site Recovery supported datasources given in the above table.|         |
| Action | Commit. | Only for Azure Site Recovery supported datasources given in the above table. |        |

## Unsupported scenarios

This table lists the solutions and scenarios that are unsupported in Azure Business Continuity center for each workload type:

| Category | Scenario |
| --- | --- |
| Monitor | Azure Site Recovery replication and failover health are not yet available in Azure Business Continuity center. You can continue to access these views via the individual vault pane. |
| Monitor | Metrics view is not yet supported for Azure Database for Azure Backup protected items of Azure Disks, Azure Database for PostgreSQL and for Azure Site Recovery protected items. |
| Govern | Protectable resources view currently only shows Azure resources. It doesn't show hosted items in Azure resources like SQL databases in Azure Virtual machines, SAP HANA databases in Azure Virtual machines, Blobs and files in Azure Storage accounts. |
| Actions | Undelete action is not available for Azure Backup protected items of Azure Virtual machine, SQL in Azure Virtual machine, SAP in Azure Virtual machine, and Files (Azure Storage account). |
| Actions | Backup Now, change policy, and resume backup actions are not available for Azure Backup protected items of Blobs (Azure Storage account), Azure Disks, Kubernetes Services, and Azure Database for PostgreSQL. |
| Actions | Configuring vault settings at scale is currently not supported from Backup center |
| Actions | Re-protect action is not available for Azure Site Recovery replicated items of Azure Virtual machine. |
| Actions | Move, delete is not available for vaults in Azure Business Continuity Center and can only be performed directly from individual vault pane. |

>[!Note]
>Protection details for Azure Classic Virtual Machines and Azure Classic storage account protected by Azure Backup are currently not included in the Azure Business Continuity (preview).

## Next steps

- [About Azure Business Continuity center (preview)](business-continuity-center-overview.md).
