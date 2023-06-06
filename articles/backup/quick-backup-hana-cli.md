---
title: Quickstart - Back up a SAP HANA database with Azure CLI
description: In this Quickstart, learn how to create a Recovery Services vault, enable protection on a SAP HANA database, and create the initial recovery point with Azure CLI.
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 06/20/2023
ms.custom: mvc, devx-track-azurecli, mode-api
ms.service: backup
author: jyothisuri
ms.author: jsuri
---

# Back up SAP HANA System Replication databases on Azure VMs using Azure CLI

This quickstart describes how to protect SAP HANA System Replication (HSR) using Azure CLI.

SAP HANA databases are critical workloads that require a low recovery-point objective (RPO) and long-term retention. This article describes how you can back up SAP HANA databases that are running on Azure virtual machines (VMs) to an Azure Backup Recovery Services vault by using Azure Backup.

>[! Note]
>For more information about the supported configurations and scenarios, see [SAP HANA backup support matrix](sap-hana-backup-support-matrix.md).

## Create a Recovery Services vault

A Recovery Services vault is a logical container that stores the backup data for each protected resource, such as SAP HANA database data. When the backup job for a protected resource runs, it creates a recovery point in the Recovery Services vault. You can then use one of these recovery points to restore data to a given point in time.

To create a Recovery Services vault, run the following command:

```azurecli-interactive
az backup vault create --resource-group hanarghsr2     --name hanavault10     --location westus2
```

By default, the Recovery Services vault is set for Geo-Redundant storage. Geo-Redundant storage ensures your backup data is replicated to a secondary Azure region that's hundreds of miles away from the primary region. If the storage redundancy setting needs to be modified, use [az backup vault backup-properties set](/cli/azure/backup/vault/backup-properties#az-backup-vault-backup-properties-set) cmdlet.

## Register and protect SAP HANA running on Azure VM

To register and protect the SAP HANA database running on primary Azure VM, run the following command:

```azurecli
az backup container register --resource-group hanarghsr2 --vault-name hanavault10 --workload-type SAPHANA --backup-management-type AzureWorkload --resource-id "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/hanarghsr2/providers/Microsoft.Compute/virtualMachines/hsr-primary"
```

To register and protect the SAP HANA database running on secondary Azure VM, run the following command:

```azurecli
az backup container register --resource-group hanarghsr2 --vault-name hanavault10 --workload-type SAPHANA --backup-management-type AzureWorkload --resource-id "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/hanarghsr2/providers/Microsoft.Compute/virtualMachines/hsr-secondary"
```

To identify `resource-id`, run the following command:

```azurecli
az vm show --name hsr-primary --resource-group hanarghsr2
```

For example, `id` is `/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/hanarghsr2/providers/Microsoft.Compute/virtualMachines/hsr-primary`.







## Next steps

In this quickstart, you created a Recovery Services vault, enabled protection on a VM, and created the initial recovery point. To learn more about Azure Backup and Recovery Services, continue to the tutorials.

> [!div class="nextstepaction"]
> []()
