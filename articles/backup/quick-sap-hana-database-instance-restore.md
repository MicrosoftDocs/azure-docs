---
title: Quickstart - Restore the entire SAP HANA system to a snapshot restore point using Azure Backup
description: In this quickstart, learn how to restore the entire SAP HANA system to a snapshot restore point.
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 11/26/2024
ms.custom: mvc, mode-api, engagement-fy24
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Quickstart: Restore the entire SAP HANA database to a snapshot restore point

This quickstart describes how to restore the entire SAP HANA to a snapshot restore point using the Azure portal.

Azure Backup now allows you to restore the SAP HANA snapshot and storage snapshot as disks by selecting Attach and then mount them to the target machine.

>[!Note]
>Currently, Azure Backup doesn't automatically restore the HANA system to the required point.

For more information about the supported configurations and scenarios, see [SAP HANA backup support matrix](sap-hana-backup-support-matrix.md).

## Prerequisites

Before you start restoring the database, consider the following prerequisites:

- Ensure that you have the backup configured and have the recovery points created to do restore. Learn more about the [configuration of backup for HANA database instance snapshots on Azure VM](sap-hana-database-instances-backup.md).  
- Ensure that you have the [required permissions for the snapshot restore](sap-hana-database-instances-restore.md#permissions-required-for-the-snapshot-restore).

## Restore the database

[!INCLUDE [How to restore the entire SAP HANA system to a snapshot restore point](../../includes/backup-azure-restore-entire-sap-hana-system-to-snapshot-restore-point.md)]

## Next steps

> [!div class="nextstepaction"]
> [Troubleshoot backup of SAP HANA databases instance snapshot on Azure](sap-hana-database-instance-troubleshoot.md)
