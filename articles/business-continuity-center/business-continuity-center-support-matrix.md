---
title: Azure Business Continuity Center support matrix
description: Provides a summary of support settings and limitations for the Azure Business Continuity center service.
ms.topic: reference
ms.date: 11/19/2024
ms.custom:
  - references_regions
  - ignite-2023
  - ignite-2024
ms.service: azure-business-continuity-center
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure Business Continuity Center

This article describes supportable scenarios and limitations.

You can use [Azure Business Continuity Center](business-continuity-center-overview.md), a cloud-native unified business continuity and disaster recovery (BCDR) management platform in Azure to manage your protection estate across solutions and environments. This feature helps enterprises to govern, monitor, operate, and analyze backups and replication at scale. This article summarizes the solutions and scenarios that Azure Business Continuity Center supports for each workload type.

## Supported regions

Azure Business Continuity Center supports all Azure regions.

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
| Monitoring | View all backup and site recovery jobs. | All Solutions and datasource types from [this section](#supported-solutions-and-datasources). | - Seven days’ worth of jobs available out of the box. <br><br> - Each filter/drop-down supports a maximum of 1000 items. Hence, if you want to filter the grid for a particular vault, there might be scenarios where you might not see the desired vault if you have more than 1,000 vaults. In these cases, choosing the **All** option in filter helps you aggregate data across your entire set of subscriptions and vaults that you have access to. |
| Monitoring | View Azure Monitor alerts at scale | **Azure Backup**: <br><br> - Azure Virtual Machine <br> - Azure Database for PostgreSQL server <br> - SQL in Azure VM <br> - SAP HANA in Azure VM <br> - Azure Files <br> - Azure Blobs <br> - Azure Disks <br><br> **Azure Site Recovery**: <br><br> - Azure to Azure disaster recovery <br> - VMware and Physical to Azure disaster recovery | See [Alerts documentation](tutorial-monitor-alerts-metrics.md#monitor-alerts). |
| Monitoring | View the Azure Backup metrics and write metric alert rules. | **Azure Backup**: <br><br> - Azure Virtual Machine <br> - SQL in Azure VM <br> - SAP HANA in Azure VM <br> - Azure Files <br> - Azure Blobs (Restore Health Events metric only) <br> - Azure Kubernetes Services | See [Metrics documentation](tutorial-monitor-alerts-metrics.md#view-metrics). |
| Reporting | View historical data of your Backup and Site Recovery estate in Reports | **Azure Backup**: <br><br> - Azure Files <br> - Azure Virtual Machine <br> - SAP HANA in Azure VM <br> - SQL in Azure VM <br> - Azure Disk <br> - Azure Database for PostgreSQL Server <br> - Azure Blob <br> - Azure Backup Agent <br> - Azure Backup Server <br> - Data Protection Manager (DPM) <br><br> **Azure Site Recovery**: <br><br> - Azure to Azure disaster recovery <br> - VMware and Physical to Azure disaster recovery | [Shows data based on the LA workspace retention](tutorial-reporting-for-data-insights.md#view-reports-in-azure-business-continuity-center). |
| Security | View security level | Only for the Azure Backup supported datasources given in [this section](#supported-solutions-and-datasources), and vaults. |        |
| Governance | View resources not configured for protection. | **Azure Backup**: <br><br> - Azure VM backup <br> - Azure Storage account (with no file or blobs protected) <br> - Azure Managed Disks backup <br> - Azure Database for PostgreSQL Server backup <br> - Azure Kubernetes services <br><br> **Azure Site Recovery**: <br><br> - Azure to Azure disaster recovery |            |
| Governance | View all protected items across solutions. | All solutions and datasource types as given in [this section](#supported-solutions-and-datasources). | Same as previous. |
| Governance | View and assign built-in and custom Azure Policies under category Azure Backup and Azure Site Recovery. | N/A |	N/A |
| Manage | View all protection policies – backup policies for Azure Backup and Replication policies for Azure Site Recovery. | All solutions and datasource types given in [this section](#supported-solutions-and-datasources). | Same as previous. |
| Manage | View all vaults. | All solutions and datasource types given in [this section](#supported-solutions-and-datasources). | Same as previous. |
| Action | Configure protection (backup and replication). | All solutions and datasource types given in [this section](#supported-solutions-and-datasources).   <br><br> **Azure Backup** <br><br>  - Azure Virtual Machine <br>   - Azure disk backup    <br>  - Azure Database for PostgreSQL Server backup   <br> - Azure Kubernetes services    <br><br> **Azure Site Recovery**   <br><br>  - Azure Virtual Machine | See support matrices for [Azure Backup](/azure/backup/backup-support-matrix) and [Azure Site Recovery](/en-us/azure/site-recovery/azure-to-azure-support-matrix). |
| Action | Enhance protection (configure backup or replication existing protected item). | Only for Azure Virtual Machine. |         |
| Action | Recover action is a collection of all actions related to recovery like: <br><br> - For backup: restore, restore to secondary region, file recovery. <br> - For replication: Failover, test failover, test failover cleanup. | Depends on the datasource type chosen. [Learn more](#supported-scenarios) about each action to recover. |             |
Action | Restore. | Only for Azure Backup supported datasources given in [this section](#supported-solutions-and-datasources). |         |
| Action | Restore to secondary region. | Only for Azure Backup supported datasources – Azure Virtual Machines, SQL in Azure VM, SAP HANA in Azure VM, Azure Database for PostgreSQL server. | See the [cross-region restore documentation](/azure/backup/backup-create-rs-vault#set-cross-region-restore). |
| Action | File recovery. | Only for Azure Backup supported datasources – Azure Virtual Machines and Azure Files. |         |
| Action | Delete. | Only for Azure Backup supported datasources given in [this section](#supported-solutions-and-datasources). |           |
| Action | Execute on-demand backup. | Only for Azure Backup supported datasources given in [this section](#supported-solutions-and-datasources). | See support matrices for [Azure VM backup](/azure/backup/backup-azure-database-postgresql-support-matrix) and [Azure Database for PostgreSQL Server backup](/azure/backup/backup-azure-database-postgresql-support-matrix). |
| Action | Stop backup. | Only for Azure Backup supported datasources given in [this section](#supported-solutions-and-datasources). | See support matrices for [Azure VM backup](/azure/backup/backup-azure-database-postgresql-support-matrix) and [Azure Database for PostgreSQL Server backup](/azure/backup/backup-azure-database-postgresql-support-matrix). |
| Action | Create vault. | All Solutions and datasource types given in [this section](#supported-solutions-and-datasources). | See [support matrices for Recovery Services vault](/azure/backup/backup-support-matrix#vault-support). |
| Action | Create Protection (backup and replication) policy. All solutions and datasource types given in [this section](#supported-solutions-and-datasources). | See the [Backup policy support matrices for Recovery Services vault](/azure/backup/backup-support-matrix#vault-support). |
| Action | Disable replication. | Only for Azure Site Recovery supported datasources given in [this section](#supported-solutions-and-datasources). |       |
| Action | Failover. | Only for Azure Site Recovery supported datasources given in [this section](#supported-solutions-and-datasources). |        |
| Action | Test Failover. | Only for Azure Site Recovery supported datasources given in [this section](#supported-solutions-and-datasources). |        |
| Action | Cleanup test failover. | Only for Azure Site Recovery supported datasources given [this section](#supported-solutions-and-datasources).|         |
| Action | Commit. | Only for Azure Site Recovery supported datasources given in [this section](#supported-solutions-and-datasources). |        |

## Unsupported scenarios

This table lists the solutions and scenarios that are unsupported in Azure Business Continuity Center for each workload type:

| Category | Scenario |
| --- | --- |
| Monitor | Azure Site Recovery replication and failover health aren't yet available in Azure Business Continuity Center. You can continue to access these views via the individual vault pane. |
| Monitor | Metrics view isn't yet supported for Azure Database for Azure Backup protected items of Azure Disks, Azure Database for PostgreSQL and for Azure Site Recovery protected items. |
| Reporting | Azure Backup: <br><br> - Azure Kubernetes Service <br> - Azure Database for PostgreSQL Flexible Server <br> - Azure Database for MySQL Flexible Server  |
| Govern | Protectable resources view currently only shows Azure resources. It doesn't show hosted items in Azure resources like SQL databases in Azure Virtual machines, SAP HANA databases in Azure Virtual machines, Blobs, and files in Azure Storage accounts. |
| Actions | Undelete action isn't available for Azure Backup protected items of Azure Virtual machine, SQL in Azure Virtual machine, SAP in Azure Virtual machine, and Files (Azure Storage account). |
| Actions | Backup Now, change policy, and resume backup actions aren't available for Azure Backup protected items of Blobs (Azure Storage account), Azure Disks, Kubernetes Services, and Azure Database for PostgreSQL. |
| Actions | Configuring vault settings at scale is currently not supported from Backup center |
| Actions | Reprotect action isn't available for Azure Site Recovery replicated items of Azure Virtual machine. |
| Actions | Move, delete isn't available for vaults in Azure Business Continuity Center and can only be performed directly from individual vault pane. |

>[!Note]
>Protection details for Azure Classic Virtual Machines and Azure Classic storage account protected by Azure Backup are currently not included in the Azure Business Continuity.

## Next steps

- [About Azure Business Continuity Center](business-continuity-center-overview.md).
