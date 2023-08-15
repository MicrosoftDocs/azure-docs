---
title: Quickstart - Restore an SAP HANA database with Azure CLI
description: In this quickstart, learn how to restore SAP HANA System Replication database with Azure CLI.
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 06/20/2023
ms.custom: mvc, devx-track-azurecli, mode-api
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Restore SAP HANA System Replication on Azure VMs using Azure CLI

This quickstart describes how to restore SAP HANA System Replication (HSR) using Azure CLI.

SAP HANA databases are critical workloads that require a low recovery-point objective (RPO) and long-term retention. This article describes how you can back up SAP HANA databases that are running on Azure virtual machines (VMs) to an Azure Backup Recovery Services vault by using Azure Backup.

>[!Note]
>- Original Location Recovery (OLR) is currently not supported for HSR.
>- Restore to HSR instance isn't supported. However, restore only to HANA instance is supported.

For more information about the supported configurations and scenarios, see [SAP HANA backup support matrix](sap-hana-backup-support-matrix.md).

## View the restore points for a protected database

Before you restore the database, view the available restore points of the protected database by running the following command:

```azurecli
az backup recoverypoint list --resource-group hanarghsr2 --vault-name hanavault10 --container-name "hanahsrcontainer;hsrtestps2" --item-name "saphanadatabase;hsrtestpradeep2;db1" --output table

abc@Azure:~$ az backup recoverypoint list --resource-group hanarghsr2 --vault-name hanavault10 --container-name "hanahsrcontainer;hsrtestps2" --item-name "saphanadatabase;hsrtestps2;db1" --output table
```

The list of recovery points will look as follows:

```Output
Name                       Time                              BackupManagementType    Item Name                            RecoveryPointType
-------------------------  --------------------------------  ----------------------  -----------------------------------  -------------------
62640091676331             2023-05-04T08:13:09.469000+00:00  AzureWorkload           SAPHanaDatabase;hsrtestps2;db1  Full
68464937558101             2023-05-04T07:49:02.988000+00:00  AzureWorkload           SAPHanaDatabase;hsrtestps2;db1  Full
56015648627567             2023-05-04T07:27:54.425000+00:00  AzureWorkload           SAPHanaDatabase;hsrtestps2;db1  Full
DefaultRangeRecoveryPoint                                    AzureWorkload           SAPHanaDatabase;hsrtestps2;db1  Log
arvind@Azure:~$
```

>[!Note]
>If the command fails to extract the backup management type, check if the container name specified is complete or try using container friendly name instead.

## Restore to an alternate location

To restore the database using Alternate Location Restore (ALR), run the following command:

```azurecli
az backup recoveryconfig show --resource-group hanarghsr2 --vault-name hanavault10 --container-name "hanahsrcontainer;hsrtestps2" --item-name "saphanadatabase;hsrtestps2;db1" --restore-mode AlternateWorkloadRestore --log-point-in-time 04-05-2023-08:27:54 --target-item-name restored_DB_pradeep  --target-server-name hsr-primary --target-container-name  hsr-primary --target-server-type HANAInstance --backup-management-type AzureWorkload --workload-type SAPHANA --output json > recoveryInput.json

 arvind@Azure:~$ cat recoveryInput.json
{
  "alternate_directory_paths": null,
  "container_id": "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/hanarghsr2/providers/Microsoft.RecoveryServices/vaults/hanavault10/backupFabrics/Azure/protectionContainers/vmappcontainer;compute;hanarghsr2;hsr-primary",
  "container_uri": "HanaHSRContainer;hsrtestps2",
  "database_name": "ARV/restored_DB_p2",
  "filepath": null,
  "item_type": "SAPHana",
  "item_uri": "SAPHanaDatabase;hsrtestps2;db1",
  "log_point_in_time": "04-05-2023-08:27:54",
  "recovery_mode": null,
  "recovery_point_id": "DefaultRangeRecoveryPoint",
  "restore_mode": "AlternateLocation",
  "source_resource_id": null,
  "workload_type": "SAPHanaDatabase"
}
arvind@Azure:~$

az backup restore restore-azurewl --resource-group hanarghsr2 --vault-name hanavault10 --recovery-config recoveryInput.json --output table
```

## Restore as files:

To restore the database as files, run the following command:

```azurecli
az backup recoveryconfig show --resource-group hanarghsr2 \
    --vault-name hanavault10 \
    --container-name "hanahsrcontainer;hsrtestps2" \
    --item-name "saphanadatabase;hsrtestps2;arv" \
    --restore-mode RestoreAsFiles \
    --log-point-in-time 18-04-2023-09:53:00 \
    --rp-name DefaultRangeRecoveryPoint \
    --target-container-name "VMAppContainer;Compute;hanarghsr2;hsr-primary"  \
    --filepath /home/abc \
    --output json
	
	az backup restore restore-azurewl --resource-group hanarghsr2 \
    --vault-name hanavault10 \
    --restore-config recoveryconfig.json \
    --output json

az backup recoveryconfig show --resource-group hanarghsr2     --vault-name hanavault10     --container-name "hanahsrcontainer;hsrtestps2"     --item-name "saphanadatabase;hsrtestps2;arv"     --restore-mode RestoreAsFiles     --log-point-in-time 18-04-2023-09:53:00     --rp-name DefaultRangeRecoveryPoint     --target-container-name "VMAppContainer;Compute;hanarghsr2;hsr-primary"      --filepath /home/abc     --output json  > recoveryconfig.json
```

## Next steps

> [!div class="nextstepaction"]
> [Troubleshoot backup of SAP HANA databases on Azure](backup-azure-sap-hana-database-troubleshoot.md)
