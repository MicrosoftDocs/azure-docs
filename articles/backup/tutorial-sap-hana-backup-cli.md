---
title: Tutorial - SAP HANA DB backup on Azure using Azure CLI 
description: In this tutorial, learn how to back up SAP HANA databases running on an Azure VM to an Azure Backup Recovery Services vault using Azure CLI.
ms.topic: tutorial
ms.date: 12/4/2019 
ms.custom: devx-track-azurecli
---

# Tutorial: Back up SAP HANA databases in an Azure VM using Azure CLI

Azure CLI is used to create and manage Azure resources from the Command Line or through scripts. This documentation details how to back up an SAP HANA database and trigger on-demand backups - all using Azure CLI. You can also perform these steps using the [Azure portal](./backup-azure-sap-hana-database.md).

This document assumes that you already have an SAP HANA database installed on an Azure VM. (You can also [create a VM using Azure CLI](../virtual-machines/linux/quick-create-cli.md)). By the end of this tutorial, you'll be able to:

> [!div class="checklist"]
>
> * Create a Recovery Services vault
> * Register SAP HANA instance and discover database(s) on it
> * Enable backup on an SAP HANA database
> * Trigger an on-demand backup

Check out the [scenarios that we currently support](./sap-hana-backup-support-matrix.md#scenario-support) for SAP HANA.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0.30 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a Recovery Services vault

A Recovery Services vault is a logical container that stores the backup data for each protected resource, such as Azure VMs or workloads running on Azure VMs - like SQL or HANA databases. When the backup job for a protected resource runs, it creates a recovery point inside the Recovery Services vault. You can then use one of these recovery points to restore data to a given point in time.

Create a Recovery Services vault with [az backup vault create](/cli/azure/backup/vault#az_backup_vault_create). Specify the same resource group and location as the VM you wish to protect. Learn how to create a VM using Azure CLI with this [VM quickstart](../virtual-machines/linux/quick-create-cli.md).

For this tutorial, we'll be using the following:

* a resource group named *saphanaResourceGroup*
* a VM named *saphanaVM*
* resources in the *westus2* location.

We'll be creating a vault named *saphanaVault*.

```azurecli-interactive
az backup vault create --resource-group saphanaResourceGroup \
    --name saphanaVault \
    --location westus2
```

By default, the Recovery Services vault is set for Geo-Redundant storage. Geo-Redundant storage ensures your backup data is replicated to a secondary Azure region that's hundreds of miles away from the primary region. If the storage redundancy setting needs to be modified, use the [az backup vault backup-properties set](/cli/azure/backup/vault/backup-properties#az_backup_vault_backup_properties_set) cmdlet.

```azurecli
az backup vault backup-properties set \
    --name saphanaVault  \
    --resource-group saphanaResourceGroup \
    --backup-storage-redundancy "LocallyRedundant/GeoRedundant"
```

To see if your vault was successfully created, use the [az backup vault list](/cli/azure/backup/vault#az_backup_vault_list) cmdlet. You'll see the following response:

```output
Location   Name             ResourceGroup
---------  ---------------  -------------  
westus2    saphanaVault     saphanaResourceGroup
```

## Register and protect the SAP HANA instance

For the SAP HANA instance (the VM with SAP HANA installed on it) to be discovered by the Azure services, a [pre-registration script](https://aka.ms/scriptforpermsonhana) must be run on the SAP HANA machine. Make sure that all the [prerequisites](./tutorial-backup-sap-hana-db.md#prerequisites) are met before running the script. To learn more about what the script does, refer to the [What the pre-registration script does](tutorial-backup-sap-hana-db.md#what-the-pre-registration-script-does) section.

Once the script is run, the SAP HANA instance can be registered with the Recovery Services vault we created earlier. To register the instance, use the [az backup container register](/cli/azure/backup/container#az_backup_container_register) cmdlet. *VMResourceId* is the resource ID of the VM that you created to install SAP HANA.

```azurecli-interactive
az backup container register --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --location westus2 \
    --workload-type SAPHANA \
    --backup-management-type AzureWorkload \
    --resource-id VMResourceId
```

>[!NOTE]
>If the VM isn't in the same resource group as the vault, then *saphanaResourceGroup* refers to the resource group where the vault was created.

Registering the SAP HANA instance automatically discovers all its current databases. However, to discover any new databases that may be added in the future refer to the [Discovering new databases added to the registered SAP HANA](tutorial-sap-hana-manage-cli.md#protect-new-databases-added-to-an-sap-hana-instance) instance section.

To check if the SAP HANA instance is successfully registered with your vault, use the [az backup container list](/cli/azure/backup/container#az_backup_container_list) cmdlet. You'll see the following response:

```output
Name                                                    Friendly Name    Resource Group        Type           Registration Status
------------------------------------------------------  --------------   --------------------  ---------      ----------------------
VMAppContainer;Compute;saphanaResourceGroup;saphanaVM   saphanaVM        saphanaResourceGroup  AzureWorkload  Registered
```

>[!NOTE]
> The column “name” in the above output refers to the container name. This container name will be used in the next sections to enable backups and trigger them. Which in this case, is *VMAppContainer;Compute;saphanaResourceGroup;saphanaVM*.

## Enable backup on SAP HANA database

The [az backup protectable-item list](/cli/azure/backup/protectable-item#az_backup_protectable_item_list) cmdlet lists out all the databases discovered on the SAP HANA instance that you registered in the previous step.

```azurecli-interactive
az backup protectable-item list --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --workload-type SAPHANA \
    --output table
```

You should find the database that you want to back up in this list, which will look as follows:

```output
Name                           Protectable Item Type    ParentName    ServerName    IsProtected
-----------------------------  ----------------------   ------------  -----------   ------------
saphanasystem;hxe              SAPHanaSystem            HXE           hxehost       NotProtected  
saphanadatabase;hxe;systemdb   SAPHanaDatabase          HXE           hxehost       NotProtected
saphanadatabase;hxe;hxe        SAPHanaDatabase          HXE           hxehost       NotProtected
```

As you can see from the above output, the SID of the SAP HANA system is HXE. In this tutorial, we'll configure backup for the *saphanadatabase;hxe;hxe* database that resides on the *hxehost* server.

To protect and configure backup on a database, one at a time, we use the [az backup protection enable-for-azurewl](/cli/azure/backup/protection#az_backup_protection_enable_for_azurewl) cmdlet. Provide the name of the policy that you want to use. To create a policy using CLI, use the [az backup policy create](/cli/azure/backup/policy#az_backup_policy_create) cmdlet. For this tutorial, we'll be using the *sapahanaPolicy* policy.

```azurecli-interactive
az backup protection enable-for-azurewl --resource-group saphanaResourceGroup \
    --policy-name saphanaPolicy \
    --protectable-item-name "saphanadatabase;hxe;hxe"  \
    --protectable-item-type SAPHANADatabase \
    --server-name hxehost \
    --workload-type SAPHANA \
    --output table
```

You can check if the above backup configuration is complete using the [az backup job list](/cli/azure/backup/job#az_backup_job_list) cmdlet. The output will display as follows:

```output
Name                                  Operation         Status     Item Name   Start Time UTC
------------------------------------  ---------------   ---------  ----------  -------------------  
e0f15dae-7cac-4475-a833-f52c50e5b6c3  ConfigureBackup   Completed  hxe         2019-12-03T03:09:210831+00:00  
```

The [az backup job list](/cli/azure/backup/job#az_backup_job_list) cmdlet lists out all the backup jobs (scheduled or on-demand) that have run or are currently running on the protected database, in addition to other operations like register, configure backup, and delete backup data.

>[!NOTE]
>Azure Backup doesn’t automatically adjust for daylight saving time changes when backing up a SAP HANA database running in an Azure VM.
>
>Modify the policy manually as needed.

## Trigger an on-demand backup

While the section above details how to configure a scheduled backup, this section talks about triggering an on-demand backup. To do this, we use the [az backup protection backup-now](/cli/azure/backup/protection#az_backup_protection_backup_now) cmdlet.

>[!NOTE]
> The retention policy of an on-demand backup is determined by the underlying retention policy for the database.

```azurecli-interactive
az backup protection backup-now --resource-group saphanaResourceGroup \
    --item-name saphanadatabase;hxe;hxe \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --backup-type Full
    --retain-until 01-01-2040
    --output table
```

The output will display as follows:

```output
Name                                  ResourceGroup
------------------------------------  -------------
e0f15dae-7cac-4475-a833-f52c50e5b6c3  saphanaResourceGroup
```

The response will give you the job name. This job name can be used to track the job status using the [az backup job show](/cli/azure/backup/job#az_backup_job_show) cmdlet.

>[!NOTE]
>Log backups are automatically triggered and managed by SAP HANA internally.

## Next steps

* To learn how to restore an SAP HANA database in Azure VM using CLI, continue to the tutorial – [Restore an SAP HANA database in Azure VM using CLI](tutorial-sap-hana-restore-cli.md)

* To learn how to back up an SAP HANA database running in Azure VM using Azure portal, refer to [Backup an SAP HANA databases on Azure VMs](./backup-azure-sap-hana-database.md)
