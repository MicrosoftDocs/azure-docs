---
title: Install Cloud Backup for Virtual Machines
description: Restore Virtual Machines enable you to restore Virtual Machines from the cloud backup to the vCenter. 
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/20/2022
ms.custom: references_regions
---

# Restore Virtual Machines using Cloud Backup

Restore Virtual Machines enable you to restore Virtual Machines from the cloud backup to the vCenter. 

This topic covers how to:
* Restore Virtual Machines from backups
* Restore deleted Virtual Machines from backups
* Restore VMDKs from backups
* Recovery of Cloud Backup for Virtual Machines internal database

## Restore Virtual Machines from backups

When you restore a Virtual Machine, you can overwrite the existing content with the backup copy that you select, or you can make a copy of the Virtual Machine.

You can restore Virtual Machines to the original datastore mounted on the original ESXi host (this overwrites the original Virtual Machine).

### Before you begin

* A backup must exist.
You must have created a backup of the Virtual Machine using the Cloud Backup for Virtual Machines before you can restore the Virtual Machine.
NOTE: Restore operations cannot finish successfully if there are snapshots of the Virtual Machine that were performed by software other than the Cloud Backup for Virtual Machines.
•	The Virtual Machine must not be in transit.
The Virtual Machine that you want to restore must not be in a state of vMotion or Storage vMotion.
•	HA configuration errors
Ensure there are no HA configuration errors displayed on the vCenter ESXi Host Summary screen before restoring backups to a different location.
•	Restoring to a different location
