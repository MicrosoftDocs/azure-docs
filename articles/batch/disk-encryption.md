---
title: Create a pool with disk encryption enabled
description: Learn how to use disk encryption configuration to encrypt nodes with a platform-managed key.
author: pkshultz
ms.topic: how-to
ms.date: 01/27/2021
ms.author: peshultz
ms.custom: references_regions
---

# Create a pool with disk encryption enabled

When you create an Azure Batch pool using [Virtual Machine Configuration](nodes-and-pools.md#virtual-machine-configuration), you can encrypt compute nodes in the pool with a platform-managed key by specifying the disk encryption configuration.

This article explains how to create a Batch pool with disk encryption enabled.

> [!IMPORTANT]
> Support for encryption at host using a platform-managed key in Azure Batch is currently in public preview for the East US, West US 2, South Central US, US Gov Virginia, and US Gov Arizona regions.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Why use a pool with disk encryption configuration?

With a Batch pool, you can access and store data on the OS and temporary disks of the compute node. Encrypting the server-side disk with a platform-managed key will safeguard this data with low overhead and convenience.

Batch will apply one of these disk encryption technologies on compute nodes, based on pool configuration and regional supportability.

- [Managed disk encryption at rest with platform-managed keys](../virtual-machines/disk-encryption.md#platform-managed-keys)
- [Encryption at host using a platform-managed Key](../virtual-machines/disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data)
- [Azure Disk Encryption](../security/fundamentals/azure-disk-encryption-vms-vmss.md)

You won't be able to specify which encryption method will be applied to the nodes in your pool. Instead, you provide the target disks you want to encrypt on their nodes, and Batch can choose the appropriate encryption method, ensuring the specified disks are encrypted on the compute node.

> [!IMPORTANT]
> If you are creating your pool with a [custom image](batch-sig-images.md), you can enable disk encryption only if using Windows VMs.

## Azure portal

When creating a Batch pool in the the Azure portal, select either **TemporaryDisk** or **OsAndTemporaryDisk** under **Disk Encryption Configuration**.

:::image type="content" source="media/disk-encryption/portal-view.png" alt-text="Screenshot of the Disk Encryption Configuration option in the Azure portal.":::

After the pool is created, you can see the disk encryption configuration targets in the pool's **Properties** section.

:::image type="content" source="media/disk-encryption/configuration-target.png" alt-text="Screenshot showing the disk encryption configuration targets in the Azure portal.":::

## Examples

The following examples show how to encrypt the OS and temporary disks on a Batch pool using the Batch .NET SDK, the Batch REST API, and the Azure CLI.

### Batch .NET SDK

```csharp
pool.VirtualMachineConfiguration.DiskEncryptionConfiguration = new DiskEncryptionConfiguration(
    targets: new List<DiskEncryptionTarget> { DiskEncryptionTarget.OsDisk, DiskEncryptionTarget.TemporaryDisk }
    );
```

### Batch REST API

REST API URL:

```
POST {batchURL}/pools?api-version=2020-03-01.11.0
client-request-id: 00000000-0000-0000-0000-000000000000
```

Request body:

```
"pool": {
    "id": "pool2",
    "vmSize": "standard_a1",
    "virtualMachineConfiguration": {
        "imageReference": {
            "publisher": "Canonical",
            "offer": "UbuntuServer",
            "sku": "18.04-LTS"
        },
        "diskEncryptionConfiguration": {
            "targets": [
                "OsDisk",
                "TemporaryDisk"
            ]
        }
        "nodeAgentSKUId": "batch.node.ubuntu 18.04"
    },
    "resizeTimeout": "PT15M",
    "targetDedicatedNodes": 5,
    "targetLowPriorityNodes": 0,
    "taskSlotsPerNode": 3,
    "enableAutoScale": false,
    "enableInterNodeCommunication": false
}
```

### Azure CLI

```azurecli-interactive
az batch pool create \
    --id diskencryptionPool \
    --vm-size Standard_DS1_V2 \
    --target-dedicated-nodes 2 \
    --image canonical:ubuntuserver:18.04-LTS \
    --node-agent-sku-id "batch.node.ubuntu 18.04" \
    --disk-encryption-targets OsDisk TemporaryDisk
```

## Next steps

- Learn more about [server-side encryption of Azure Disk Storage](../virtual-machines/disk-encryption.md).
- For an in-depth overview of Batch, see [Batch service workflow and resources](batch-service-workflow-features.md).
