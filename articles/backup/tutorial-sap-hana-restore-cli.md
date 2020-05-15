---
title: Tutorial - SAP HANA DB restore on Azure using CLI 
description: In this tutorial, learn how to restore SAP HANA databases running on an Azure VM from an Azure Backup Recovery Services vault using Azure CLI.
ms.topic: tutorial
ms.date: 12/4/2019
---

# Tutorial: Restore SAP HANA databases in an Azure VM using Azure CLI

Azure CLI is used to create and manage Azure resources from the command line or through scripts. This documentation details how to restore a backed-up SAP HANA database on an Azure VM - using Azure CLI. You can also perform these steps using the [Azure portal](https://docs.microsoft.com/azure/backup/sap-hana-db-restore).

Use [Azure Cloud Shell](tutorial-sap-hana-backup-cli.md) to run CLI commands.

By the end of this tutorial you'll be able to:

> [!div class="checklist"]
>
> * View restore points for a backed-up database
> * Restore a database

This tutorial assumes you have an SAP HANA database running on Azure VM that is backed-up using Azure Backup. If you've used [Back up an SAP HANA database in Azure using CLI](tutorial-sap-hana-backup-cli.md) to back up your SAP HANA database, then you're using the following resources:

* a resource group named *saphanaResourceGroup*
* a vault named *saphanaVault*
* protected container named *VMAppContainer;Compute;saphanaResourceGroup;saphanaVM*
* backed-up database/item named *saphanadatabase;hxe;hxe*
* resources in the *westus2* region

## View restore points for a backed-up database

To view the list of all the recovery points for a database, use the [az backup recoverypoint list](https://docs.microsoft.com/cli/azure/backup/recoverypoint?view=azure-cli-latest#az-backup-recoverypoint-show-log-chain) cmdlet as follows:

```azurecli-interactive
az backup recoverypoint list --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --item-name saphanadatabase;hxe;hxe \
   --output table
```

The list of recovery points will look as follows:

```output
Name                      Time                               BackupManagementType   Item Name               RecoveryPointType
-------------------       ---------------------------------  ---------------------  ----------------------  ------------------
7660777527047692711       2019-12-10T04:00:32.346000+00:00   AzureWorkload          SAPHanaDtabase;hxe;hxe  Full
7896624824685666836       2019-12-15T10:33:32.346000+00:00   AzureWorkload          SAPHanaDtabase;hxe;hxe  Differential
DefaultRangeRecoveryPoint                                    AzureWorkload          SAPHanaDtabase;hxe;hxe  Log
```

As you can see, the list above contains three recovery points: one each for full, differential, and log backup.

>[!NOTE]
>You can also view the start and end points of every unbroken log backup chain, using the [az backup recoverypoint show-log-chain](https://docs.microsoft.com/cli/azure/backup/recoverypoint?view=azure-cli-latest#az-backup-recoverypoint-show-log-chain) cmdlet.

## Prerequisites to restore a database

Ensure that the following prerequisites are met before restoring a database:

* You can restore the database only to an SAP HANA instance that is in the same region
* The target instance must be registered with the same vault as the source
* Azure Backup can't identify two different SAP HANA instances on the same VM. Therefore, restoring data from one instance to another on the same VM isn't possible.

## Restore a database

Azure Backup can restore SAP HANA databases that are running on Azure VMs as follows:

* Restore to a specific date or time (to the second) by using log backups. Azure Backup automatically determines the appropriate full, differential backups and the chain of log backups that are required to restore based on the selected time.
* Restore to a specific full or differential backup to restore to a specific recovery point.

To restore a database, use the [az restore restore-azurewl](https://docs.microsoft.com/cli/azure/backup/restore?view=azure-cli-latest#az-backup-restore-restore-azurewl) cmdlet, which requires a recovery config object as one of the inputs. This object can be generated using the [az backup recoveryconfig show](https://docs.microsoft.com/cli/azure/backup/recoveryconfig?view=azure-cli-latest#az-backup-recoveryconfig-show) cmdlet. The recovery config object contains all the details to perform a restore. One of them being the restore mode – **OriginalWorkloadRestore** or **AlternateWorkloadRestore**.

>[!NOTE]
> **OriginalWorkloadRestore** - Restore the data to the same SAP HANA instance as the original source. This option overwrites the original database. <br>
> **AlternateWorkloadRestore** - Restore the database to an alternate location and keep the original source database.

## Restore to alternate location

To restore a database to an alternate location, use **AlternateWorkloadRestore** as the restore mode. You must then choose the restore point, which could either be a previous point-in-time or any of the previous restore points.

In this tutorial, you'll restore to a previous restore point. [View the list of restore points](#view-restore-points-for-a-backed-up-database) for the database and choose the point you want to restore to. This tutorial will use the restore point with the name *7660777527047692711*.

Using the above restore point name and the restore mode, let's create the recovery config object using the [az backup recoveryconfig show](https://docs.microsoft.com/cli/azure/backup/recoveryconfig?view=azure-cli-latest#az-backup-recoveryconfig-show) cmdlet. Let's look at what each of the remaining parameters in this cmdlet mean:

* **--target-item-name** This is the name that the restored database will be using. In this case, we used the name *restored_database*.
* **--target-server-name** This is the name of an SAP HANA server that is successfully registered to a recovery services vault and lies in the same region as the database to be restored. For this tutorial, we'll restore the database to the same SAP HANA server that we have protected, named *hxehost*.
* **--target-server-type** For the restore of SAP HANA databases, **SapHanaDatabase** must be used.

```azurecli-interactive

az backup recoveryconfig show --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --item-name saphanadatabase;hxe;hxe \
    --restore-mode AlternateWorkloadRestore \
    --rp-name 7660777527047692711 \
    --target-item-name restored_database \
    --target-server-name hxehost \
    --target-server-type HANAInstance \
    --workload-type SAPHANA \
    --output json
```

The response to the above query will be a recovery config object that looks something like this:

```output
"{\"restore_mode\": \"OriginalLocation\", \"container_uri\": \" VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \", \"item_uri\": \"SAPHanaDatabase;hxe;hxe\", \"recovery_point_id\": \"DefaultRangeRecoveryPoint\", \"log_point_in_time\": \"28-11-2019-09:53:00\", \"item_type\": \"SAPHana\", \"source_resource_id\": \"/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/saphanaResourceGroup/providers/Microsoft.Compute/virtualMachines/saphanavm\", \"database_name\": null, \"container_id\": null, \"alternate_directory_paths\": null}"
```

Now, to restore the database run the [az restore restore-azurewl](https://docs.microsoft.com/cli/azure/backup/restore?view=azure-cli-latest#az-backup-restore-restore-azurewl) cmdlet. To use this command, we will enter the above json output that is saved to a file named *recoveryconfig.json*.

```azurecli-interactive
az backup restore restore-azurewl --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --restore-config recoveryconfig.json \
    --output table
```

The output will look like this:

```output
Name                                  Resource
------------------------------------  -------
5b198508-9712-43df-844b-977e5dfc30ea  SAPHANA
```

The response will give you the job name. This job name can be used to track the job status using [az backup job show](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-show) cmdlet.

## Restore and overwrite

To restore to the original location, we'll use **OrignialWorkloadRestore** as the restore mode. You must then choose the restore point, which could either be a previous point-in-time or any of the previous restore points.

For this tutorial, we'll choose the previous point-in-time “28-11-2019-09:53:00” to restore to. You can provide this restore point in the following formats: dd-mm-yyyy, dd-mm-yyyy-hh:mm:ss. To choose a valid point-in-time to restore to, use the [az backup recoverypoint show-log-chain](https://docs.microsoft.com/cli/azure/backup/recoverypoint?view=azure-cli-latest#az-backup-recoverypoint-show-log-chain) cmdlet, which lists the intervals of unbroken log chain backups.

```azurecli-interactive
az backup recoveryconfig show --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --item-name saphanadatabase;hxe;hxe \
    --restore-mode OriginalWorkloadRestore \
    --log-point-in-time 28-11-2019-09:53:00 \
    --output json
```

The response to the above query will be a recovery config object that looks as follows:

```output
"{\"restore_mode\": \"OriginalLocation\", \"container_uri\": \" VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \", \"item_uri\": \"SAPHanaDatabase;hxe;hxe\", \"recovery_point_id\": \"DefaultRangeRecoveryPoint\", \"log_point_in_time\": \"28-11-2019-09:53:00\", \"item_type\": \"SAPHana\", \"source_resource_id\": \"/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/saphanaResourceGroup/providers/Microsoft.Compute/virtualMachines/saphanavm\", \"database_name\": null, \"container_id\": null, \"alternate_directory_paths\": null}"
```

Now, to restore the database run the [az restore restore-azurewl](https://docs.microsoft.com/cli/azure/backup/restore?view=azure-cli-latest#az-backup-restore-restore-azurewl) cmdlet. To use this command, we will enter the above json output that is saved to a file named *recoveryconfig.json*.

```azurecli-interactive
az backup restore restore-azurewl --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --restore-config recoveryconfig.json \
    --output table
```

The output will look like this:

```output
Name                                  Resource
------------------------------------  --------
5b198508-9712-43df-844b-977e5dfc30ea  SAPHANA
```

The response will give you the job name. This job name can be used to track the job status using the [az backup job show](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-show) cmdlet.

## Next steps

* To learn how to manage SAP HANA databases that are backed up using Azure CLI, continue to the tutorial [Manage an SAP HANA database in Azure VM using CLI](tutorial-sap-hana-backup-cli.md)

* To learn how to restore an SAP HANA database running in Azure VM using the Azure portal, refer to [Restore an SAP HANA databases on Azure VMs](https://docs.microsoft.com/azure/backup/sap-hana-db-restore)
