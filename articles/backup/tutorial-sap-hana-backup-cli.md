---
title: Tutorial - SAP HANA DB backup on Azure using Azure CLI 
description: In this tutorial, learn how to back up SAP HANA databases running on an Azure VM to an Azure Backup Recovery Services vault using Azure CLI.
ms.topic: tutorial
ms.date: 06/20/2023
ms.custom: devx-track-azurecli
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Back up SAP HANA databases in an Azure VM using Azure CLI

This tutorial describes how to back up SAP HANA database instance and SAP HANA System Replication (HSR) instance using Azure CLI.

Azure CLI is used to create and manage Azure resources from the Command Line or through scripts. This documentation details how to back up an SAP HANA database and trigger on-demand backups - all using Azure CLI. You can also perform these steps using the [Azure portal](./backup-azure-sap-hana-database.md).

This document assumes that you already have an SAP HANA database installed on an Azure VM. (You can also [create a VM using Azure CLI](../virtual-machines/linux/quick-create-cli.md)).

For more information on the supported scenarios, see the [support matrix](./sap-hana-backup-support-matrix.md#scenario-support) for SAP HANA.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0.30 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a Recovery Services vault

A Recovery Services vault is a logical container that stores the backup data for each protected resource, such as Azure VMs or workloads running on Azure VMs - like SQL or HANA databases. When the backup job for a protected resource runs, it creates a recovery point inside the Recovery Services vault. You can then use one of these recovery points to restore data to a given point in time.

Create a Recovery Services vault with [az backup vault create](/cli/azure/backup/vault#az-backup-vault-create). Specify the same resource group and location as the VM you wish to protect. Learn how to create a VM using Azure CLI with this [VM quickstart](../virtual-machines/linux/quick-create-cli.md).

**Choose a database type**:
# [HANA database](#tab/hana-database)


For this tutorial, we'll be using:

* a resource group named *saphanaResourceGroup*
* a VM named *saphanaVM*
* resources in the *westus2* location.

We'll be creating a vault named *saphanaVault*.

```azurecli-interactive
az backup vault create --resource-group saphanaResourceGroup \
    --name saphanaVault \
    --location westus2
```

By default, the Recovery Services vault is set for Geo-Redundant storage. Geo-Redundant storage ensures your backup data is replicated to a secondary Azure region that's hundreds of miles away from the primary region. If the storage redundancy setting needs to be modified, use the [az backup vault backup-properties set](/cli/azure/backup/vault/backup-properties#az-backup-vault-backup-properties-set) cmdlet.

```azurecli
az backup vault backup-properties set \
    --name saphanaVault  \
    --resource-group saphanaResourceGroup \
    --backup-storage-redundancy "LocallyRedundant/GeoRedundant"
```

To see if your vault was successfully created, use the [az backup vault list](/cli/azure/backup/vault#az-backup-vault-list) cmdlet. You'll see the following response:

```output
Location   Name             ResourceGroup
---------  ---------------  -------------  
westus2    saphanaVault     saphanaResourceGroup
```

# [HSR](#tab/hsr)

To create the Recovery Services vault for HSR instance protection, run the following command:

```azurecli
az backup vault create --resource-group hanarghsr2     --name hanavault10     --location westus2
```

---

## Register and protect the SAP HANA instance

For the SAP HANA instance (the VM with SAP HANA installed on it) to be discovered by the Azure services, a [pre-registration script](https://aka.ms/scriptforpermsonhana) must be run on the SAP HANA machine. Make sure that all the [prerequisites](./tutorial-backup-sap-hana-db.md#prerequisites) are met before running the script. To learn more about what the script does, refer to the [What the pre-registration script does](tutorial-backup-sap-hana-db.md#what-the-pre-registration-script-does) section.

Once the script is run, the SAP HANA instance can be registered with the Recovery Services vault we created earlier. 

**Choose a database type**

# [HANA database](#tab/hana-database)

To register and protect database instance, follow these steps:

1. To register the instance, use the [az backup container register](/cli/azure/backup/container#az-backup-container-register) command. *VMResourceId* is the resource ID of the VM that you created to install SAP HANA.

    ```azurecli-interactive
    az backup container register --resource-group saphanaResourceGroup \
        --vault-name saphanaVault \
        --workload-type SAPHANA \
        --backup-management-type AzureWorkload \
        --resource-id VMResourceId
    ```

   >[!NOTE]
   >If the VM isn't in the same resource group as the vault, then *saphanaResourceGroup* refers to the resource group where the vault was created.

   Registering the SAP HANA instance automatically discovers all its current databases. However, to discover any new databases that may be added in the future refer to the [Discovering new databases added to the registered SAP HANA](tutorial-sap-hana-manage-cli.md#protect-new-databases-added-to-an-sap-hana-instance) instance section.

1. To check if the SAP HANA instance is successfully registered with your vault, use the [az backup container list](/cli/azure/backup/container#az-backup-container-list) cmdlet. You'll see the following response:

    ```output
    Name                                                    Friendly Name    Resource Group        Type           Registration Status
    ------------------------------------------------------  --------------   --------------------  ---------      ----------------------
    VMAppContainer;Compute;saphanaResourceGroup;saphanaVM   saphanaVM        saphanaResourceGroup  AzureWorkload  Registered
    ```

   >[!NOTE]
   > The column “name” in the above output refers to the container name. This container name will be used in the next sections to enable backups and trigger them. Which in this case, is *VMAppContainer;Compute;saphanaResourceGroup;saphanaVM*.


# [HSR](#tab/hsr)

To register and protect database instance, follow these steps:

1. To register and protect the SAP HANA database running on primary Azure VM, run the following command:

    ```azurecli
    az backup container register --resource-group hanarghsr2 --vault-name hanavault10 --workload-type SAPHANA --backup-management-type AzureWorkload --resource-id "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/hanarghsr2/providers/Microsoft.Compute/virtualMachines/hsr-primary"
    ```

1. To register and protect the SAP HANA database running on secondary Azure VM, run the following command:

    ```azurecli
    az backup container register --resource-group hanarghsr2 --vault-name hanavault10 --workload-type SAPHANA --backup-management-type AzureWorkload --resource-id "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/hanarghsr2/providers/Microsoft.Compute/virtualMachines/hsr-secondary"
    ```

   To identify `resource-id`, run the following command:

    ```azurecli
    az vm show --name hsr-primary --resource-group hanarghsr2
    ```

    For example, `id` is `/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/hanarghsr2/providers/Microsoft.Compute/virtualMachines/hsr-primary`.

1. To check if primary and secondary servers are registered to the vault, run the following command:

    ```azurecli
    az backup container list --resource-group hanarghsr2 --vault-name hanavault10 --output table --backup-management-type AzureWorkload 
    Name                                             Friendly Name    Resource Group    Type           Registration Status
    -----------------------------------------------  ---------------  ----------------  -------------  ---------------------
    VMAppContainer;Compute;hanarghsr2;hsr-primary    hsr-primary      hanarghsr2        AzureWorkload  Registered
    VMAppContainer;Compute;hanarghsr2;hsr-secondary  hsr-secondary    hanarghsr2        AzureWorkload  Registered
    ```

---

## Enable backup on SAP HANA database

The [az backup protectable-item list](/cli/azure/backup/protectable-item#az-backup-protectable-item-list) cmdlet lists out all the databases discovered on the SAP HANA instance that you registered in the previous step.

**Choose a database type**

# [HANA database](#tab/hana-database)

To enable database instance backup, follow these steps:

1. To list the database to be protected, run the following command:

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

   As you can see from the above output, the SID of the SAP HANA system is HXE. In this tutorial, we'll configure backup for the `saphanadatabase;hxe;hxe` database that resides on the `hxehost` server.

1. To protect and configure the backups on a database, one at a time, we use the [az backup protection enable-for-azurewl](/cli/azure/backup/protection#az-backup-protection-enable-for-azurewl) cmdlet. Provide the name of the policy that you want to use. To create a policy using CLI, use the [az backup policy create](/cli/azure/backup/policy#az-backup-policy-create) cmdlet. For this tutorial, we'll be using the *sapahanaPolicy* policy.

    ```azurecli-interactive
    az backup protection enable-for-azurewl --resource-group saphanaResourceGroup \
        --vault-name saphanaVault \
        --policy-name saphanaPolicy \
        --protectable-item-name "saphanadatabase;hxe;hxe"  \
        --protectable-item-type SAPHANADatabase \
        --server-name hxehost \
        --workload-type SAPHANA \
        --output table
    ```

1. To check if the above backup configuration is complete, use the [az backup job list](/cli/azure/backup/job#az-backup-job-list) cmdlet. The output will display as follows:

    ```output
    Name                                  Operation         Status     Item Name   Start Time UTC
    ------------------------------------  ---------------   ---------  ----------  -------------------  
    e0f15dae-7cac-4475-a833-f52c50e5b6c3  ConfigureBackup   Completed  hxe         2019-12-03T03:09:210831+00:00  
    ```

The [az backup job list](/cli/azure/backup/job#az-backup-job-list) cmdlet lists out all the backup jobs (scheduled or on-demand) that have run or are currently running on the protected database, in addition to other operations like register, configure backup, and delete backup data.

>[!NOTE]
>Azure Backup doesn’t automatically adjust for daylight saving time changes when backing up a SAP HANA database running in an Azure VM.
>
>Modify the policy manually as needed.

### Get the container name

To get container name, run the following command. [Learn about this CLI command](/cli/azure/backup/container#az-backup-container-list).

```azurecli
    az backup item list --resource-group <resource group name> --vault-name <vault name>

```

# [HSR](#tab/hsr)

To enable database instance backup, follow these steps:

1. To check the items that you can protect, run the following command:

    ```azurecli
    az backup protectable-item list --resource-group hanarghsr2 --vault-name hanavault10 --workload-type SAPHANA --output table

    pradeep [ ~ ]$ az backup protectable-item list --resource-group hanarghsr2 --vault-name hanavault10 --workload-type SAPHANA --output table
    Name                                                 Protectable Item Type    ParentName       ServerName     IsProtected
    ---------------------------------------------------  -----------------------  ---------------  -------------  -------------
    saphanasystem;arv                                    SAPHanaSystem            ARV              hsr-primary    NotProtected
    saphanasystem;arv                                    SAPHanaSystem            ARV              hsr-secondary  NotProtected
    hanahsrcontainer;hsrtestps2                     HanaHSRContainer         HsrTestP2  hsr-primary    NotProtected
    saphanadatabase;hsrtestps2;arv                  SAPHanaDatabase          HsrTestP2  hsr-primary    NotProtected
    saphanadatabase;hsrtestps2;2;DB1  SAPHanaDatabase          HsrTestP2  hsr-primary    NotProtected
    saphanadatabase;hsrtestps2;systemdb             SAPHanaDatabase          HsrTestP2  hsr-primary    NotProtected
    ```

   If the database isn't in the item list that can be protected or to rediscover the database, reinitiate discovery on the physical primary VM by running the following command:

    ```azurecli
    az backup protectable-item initialize --resource-group hanarghsr2 --vault-name hanavault10 --container-name "VMAppContainer;Compute;hanarghsr2;hsr-primary" --workload-type SAPHanaDatabase
    ```

1. To enable protection for the database listed under the HSR System with required backup policy, run the following command:

    ```azurecli
    az backup protection enable-for-azurewl --resource-group hanarghsr2 --vault-name hanavault10 --policy-name hanahsr --protectable-item-name "saphanadatabase;hsrtestps2;DB1"  --protectable-item-type SAPHanaDatabase --workload-type SAPHanaDatabase --output table --server-name HsrTestP2

    az backup protection enable-for-azurewl --resource-group hanarghsr2 --vault-name hanavault10 --policy-name hanahsr --protectable-item-name "saphanadatabase;hsrtestps2;systemdb"  --protectable-item-type SAPHanaDatabase --workload-type SAPHanaDatabase --output table --server-name hsr-secondary 
    ```

---

## Trigger an on-demand backup

While the section above details how to configure a scheduled backup, this section talks about triggering an on-demand backup. To do this, we use the [az backup protection backup-now](/cli/azure/backup/protection#az-backup-protection-backup-now) command.

>[!NOTE]
>The retention period of this backup is determined by the type of on-demand backup you have run.
>- *On-demand full backups* are retained for a minimum of *45 days* and a maximum of *99 years*.
>- *On-demand differential backups* are retained as per the *log retention set in the policy*.
>- *On-demand incremental backups* aren't currently supported.

**Choose a database type**

# [HANA database](#tab/hana-database)

To run an on-demand backup, run the following command:

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

The response will give you the job name. This job name can be used to track the job status using the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

>[!NOTE]
>Log backups are automatically triggered and managed by SAP HANA internally.

# [HSR](#tab/hsr)

To run an on-demand backup, run the following command:

```azurecli
az backup protection backup-now --resource-group hanarghsr2 --item-name "saphanadatabase;hsrtestps2;db1" --container-name "hanahsrcontainer;hsrtestp2" --vault-name hanavault10  --backup-type Full --retain-until 01-01-2030 --output table  
```

The output will display as follows:

```Output
Name                                  Operation      Status      Item Name          Backup Management Type    Start Time UTC                    Duration
------------------------------------  -------------  ----------  -----------------  ------------------------  --------------------------------  --------------

591f1840-4d6a-4464-8f3a-18e586f11bfc  Backup (Full)  InProgress  ARV [hsr-primary]  AzureWorkload             2023-04
```

---

## Next steps

* To learn how to restore an SAP HANA database in Azure VM using CLI, continue to the tutorial – [Restore an SAP HANA database in Azure VM using CLI](tutorial-sap-hana-restore-cli.md)

* To learn how to back up an SAP HANA database running in Azure VM using Azure portal, refer to [Backup an SAP HANA databases on Azure VMs](./backup-azure-sap-hana-database.md)
