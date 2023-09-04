---
title: Quickstart - Back up an SAP HANA database with Azure CLI
description: In this quickstart, learn how to create a Recovery Services vault, enable protection on an SAP HANA System Replication database, and create the initial recovery point with Azure CLI.
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 06/20/2023
ms.custom: mvc, devx-track-azurecli, mode-api
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Back up SAP HANA System Replication on Azure VMs using Azure CLI

This quickstart describes how to protect SAP HANA System Replication (HSR) using Azure CLI.

SAP HANA databases are critical workloads that require a low recovery-point objective (RPO) and long-term retention. This article describes how you can back up SAP HANA databases that are running on Azure virtual machines (VMs) to an Azure Backup Recovery Services vault by using Azure Backup.

For more information about the supported configurations and scenarios, see [SAP HANA backup support matrix](sap-hana-backup-support-matrix.md).

## Create a Recovery Services vault

A Recovery Services vault is a logical container that stores the backup data for each protected resource, such as SAP HANA database data. When the backup job for a protected resource runs, it creates a recovery point in the Recovery Services vault. You can then use one of these recovery points to restore data to a given point in time.

To create a Recovery Services vault, run the following command:

```azurecli-interactive
az backup vault create --resource-group hanarghsr2     --name hanavault10     --location westus2
```

By default, the Recovery Services vault is set for Geo-Redundant storage. Geo-Redundant storage ensures your backup data is replicated to a secondary Azure region that's hundreds of miles away from the primary region. If the storage redundancy setting needs to be modified, use [az backup vault backup-properties set](/cli/azure/backup/vault/backup-properties#az-backup-vault-backup-properties-set) cmdlet.

## Register and protect SAP HANA running on Azure VM

When a failover occurs, the users are replicated to the new primary, but `hdbuserstore` isn't replicated. So, you need to create the same key in all nodes of the HSR setup, which allows the Azure Backup service to connect to any new primary node automatically, without any manual intervention.
Follow these steps:

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

## Check the registration of primary and secondary servers to the vault

To check if primary and secondary servers are registered to the  vault, run the following command:

```azurecli
az backup container list --resource-group hanarghsr2 --vault-name hanavault10 --output table --backup-management-type AzureWorkload 
Name                                             Friendly Name    Resource Group    Type           Registration Status
-----------------------------------------------  ---------------  ----------------  -------------  ---------------------
VMAppContainer;Compute;hanarghsr2;hsr-primary    hsr-primary      hanarghsr2        AzureWorkload  Registered
VMAppContainer;Compute;hanarghsr2;hsr-secondary  hsr-secondary    hanarghsr2        AzureWorkload  Registered
```

## View the item list for protection

To check the items that you can protect, run the following command:

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

## Rediscover the database

If the database isn't in the item list that can be protected or to rediscover the database, reinitiate discovery on the physical primary VM by running the following command:

```azurecli
az backup protectable-item initialize --resource-group hanarghsr2 --vault-name hanavault10 --container-name "VMAppContainer;Compute;hanarghsr2;hsr-primary" --workload-type SAPHanaDatabase
```

## Enable protection for the database

To enable protection for the database listed under the HSR System with required backup policy, run the following command:

```azurecli
az backup protection enable-for-azurewl --resource-group hanarghsr2 --vault-name hanavault10 --policy-name hanahsr --protectable-item-name "saphanadatabase;hsrtestps2;DB1"  --protectable-item-type SAPHanaDatabase --workload-type SAPHanaDatabase --output table --server-name HsrTestP2

az backup protection enable-for-azurewl --resource-group hanarghsr2 --vault-name hanavault10 --policy-name hanahsr --protectable-item-name "saphanadatabase;hsrtestps2;systemdb"  --protectable-item-type SAPHanaDatabase --workload-type SAPHanaDatabase --output table --server-name hsr-secondary 
```

## Run an on-demand backup

To initiate a backup job manually, run the following command:

```azurecli
az backup protection backup-now --resource-group hanarghsr2 --item-name "saphanadatabase;hsrtestps2;db1" --container-name "hanahsrcontainer;hsrtestp2" --vault-name hanavault10  --backup-type Full --retain-until 01-01-2030 --output table  

Name                                  Operation      Status      Item Name          Backup Management Type    Start Time UTC                    Duration
------------------------------------  -------------  ----------  -----------------  ------------------------  --------------------------------  --------------

591f1840-4d6a-4464-8f3a-18e586f11bfc  Backup (Full)  InProgress  ARV [hsr-primary]  AzureWorkload             2023-04
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Restore SAP HANA System Replication databases on Azure VMs using Azure CLI](quick-restore-hana-cli.md)
