---
title: FAQ - Back up SAP HANA databases on Azure VMs
description: In this article, discover answers to common questions about backing up SAP HANA databases using the Azure Backup service.
ms.topic: conceptual
ms.date: 11/7/2019
---

# Frequently asked questions – Back up SAP HANA databases on Azure VMs

This article answers common questions about backing up SAP HANA databases using the Azure Backup service.

## Backup

### How many full backups are supported per day?

We support only one full backup per day. You cannot have differential backup and full backup triggered on the same day.

### Do successful backup jobs create alerts?

No. Successful backup jobs don't generate alerts. Alerts are sent only for backup jobs that fail. Detailed behavior for portal alerts is documented [here](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-built-in-monitor). However, if you are interested having alerts even for successful jobs, you can use [Azure Monitor](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-use-azuremonitor).

### Can I see scheduled backup jobs in the Backup Jobs menu?

The Backup Job menu will only show ad-hoc backup jobs. For scheduled jobs, use [Azure Monitor](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-use-azuremonitor).

### Are future databases automatically added for backup?

No, this is not currently supported.

### If I delete a database from an instance, what will happen to the backups?

If a database is dropped from an SAP HANA instance, the database backups are still attempted. This implies that the deleted database begins to show up as unhealthy under **Backup Items** and is still protected.
The correct way to stop protecting this database is to perform **Stop Backup with delete data** on this database.

### If I change the name of the database after it has been protected, what will the behavior be?

A renamed database is treated as a new database. Therefore, the service will treat this situation as if the database were not found and with fail the backups. The renamed database will appear as a new database and must be configured for protection.

### What are the prerequisites to back up SAP HANA databases on an Azure VM?

Refer to the [prerequisites](tutorial-backup-sap-hana-db.md#prerequisites) and [What the pre-registration script does](tutorial-backup-sap-hana-db.md#what-the-pre-registration-script-does) sections.

### What permissions should be set for Azure to be able to back up SAP HANA databases?

Running the pre-registration script sets the required permissions to allow Azure to back up SAP HANA databases. You can find more what the pre-registration script does [here](tutorial-backup-sap-hana-db.md#what-the-pre-registration-script-does).

### Will backups work after migrating SAP HANA from 1.0 to 2.0?

Refer to [this section](https://docs.microsoft.com/azure/backup/backup-azure-sap-hana-database-troubleshoot#upgrading-from-sap-hana-10-to-20) of the troubleshooting guide.

### Can Azure HANA Backup be set up against a virtual IP (load balancer) and not a virtual machine?

Currently we do not have the capability to set up the solution against a virtual IP alone. We need a virtual machine to execute the solution.

### I have a SAP HANA System Replication (HSR), how should I configure backup for this setup?

The primary and secondary nodes of the HSR will be treated as two individual, un-related VMs. You need to configure backup on the primary node and when the fail-over happens, you need to configure backup on the secondary node (which now becomes the primary node). There is no automatic 'fail-over' of backup to the other node.

## Restore

### Why can't I see the HANA system I want my database to be restored to?

Check if all the prerequisites for the restore to target SAP HANA instance are met. For more information, see [Prerequisites - Restore SAP HANA databases in Azure VM](https://docs.microsoft.com/azure/backup/sap-hana-db-restore#prerequisites).

### Why is the Overwrite DB restore failing for my database?

Ensure that the **Force Overwrite** option is selected while restoring.

### Why do I see the "Source and target systems for restore are incompatible" error?

Refer to the SAP HANA Note [1642148](https://launchpad.support.sap.com/#/notes/1642148) to see what restore types are currently supported.

## Next steps

Learn how to [back up SAP HANA databases](https://docs.microsoft.com/azure/backup/backup-azure-sap-hana-database) running on Azure VMs.
