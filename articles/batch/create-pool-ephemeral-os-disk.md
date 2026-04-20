---
title: Use ephemeral OS disk nodes for Azure Batch pools
description: Learn how and why to create a Batch pool that uses ephemeral OS disk nodes.
ms.topic: how-to
ms.date: 03/06/2026
ms.devlang: csharp
# Customer intent: "As a cloud architect, I want to configure Azure Batch pools with ephemeral OS disks, so that I can reduce costs and improve application performance for stateless workloads."
---

# Use ephemeral OS disk nodes for Azure Batch pools

Some Azure virtual machine (VM) series support the use of [ephemeral OS disks](/azure/virtual-machines/ephemeral-os-disks), which create the OS disk on the node virtual machine local storage. The default Batch pool configuration uses [Azure managed disks](/azure/virtual-machines/managed-disks-overview) for the node OS disk, where the managed disk is like a physical disk, but virtualized and persisted in remote Azure Storage.

For Batch workloads, the main benefits of using ephemeral OS disks are reduced costs associated with pools, the potential for faster node start time, and improved application performance due to better OS disk performance. When choosing whether ephemeral OS disks should be used for your workload, consider the following impacts:

- There's lower read/write latency to ephemeral OS disks, which may lead to improved application performance.
- There's no storage cost for ephemeral OS disks, whereas there's a cost for each managed OS disk.
- Reimage for compute nodes is faster for ephemeral disks compared to managed disks, when supported by Batch.
- Node start time may be slightly faster when ephemeral OS disks are used.
- Ephemeral OS disks aren't highly durable and available; when a VM is removed for any reason, the OS disk is lost. Since Batch workloads are inherently stateless, and don't normally rely on changes to the OS disk being persisted, ephemeral OS disks are appropriate to use for most Batch workloads.
- Ephemeral OS disks aren't currently supported by all Azure VM series. If a VM size doesn't support an ephemeral OS disk, a managed OS disk must be used.

> [!NOTE]
> Ephemeral OS disk configuration is only applicable to 'virtualMachineConfiguration' pools, and aren't supported by 'cloudServiceConfiguration’ pools. We recommend using 'virtualMachineConfiguration for your Batch pools, as 'cloudServiceConfiguration' pools do not support all features and no new capabilities are planned.

## VM series support

To determine whether a VM series supports ephemeral OS disks, check the documentation for each VM instance. For example, the [Ddv4 and Ddsv4-series](/azure/virtual-machines/ddv4-ddsv4-series) supports ephemeral OS disks.

Alternately, you can programmatically query to check the 'EphemeralOSDiskSupported' capability. An example PowerShell cmdlet to query this capability is provided in the [ephemeral OS disk frequently asked questions](/azure/virtual-machines/ephemeral-os-disks-faq).

## Create a pool that uses ephemeral OS disks

The `EphemeralOSDiskSettings` property isn't set by default. You must set this property in order to configure ephemeral OS disk use on the pool nodes.

> [!TIP]
> Ephemeral OS disks cannot be used in conjunction with Spot VMs in Batch pools due to the service managed eviction policy.

The following example shows how to create a Batch pool where the nodes use ephemeral OS disks and not managed disks.

### Code examples

This code snippet shows how to create a pool with ephemeral OS disks using the azure-mgmt-batch Python SDK with the ephemeral OS disk using the temporary disk (cache).

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.batch import BatchManagementClient
from azure.mgmt.batch.models import (
    BatchAccountPoolData,
    DeploymentConfiguration,
    VirtualMachineConfiguration,
    ImageReference,
    OSDisk,
    DiffDiskSettings,
    DiffDiskPlacement,
)


def create_pool_with_ephemeral_os_disk():
    client = BatchManagementClient(
        credential=DefaultAzureCredential(),
        subscription_id="subscriptionId",
    )

    pool = client.pool.create(
        resource_group_name="resourceGroupName",
        account_name="accountName",
        pool_name="ephemeralOSDiskPool",
        parameters=BatchAccountPoolData(
            vm_size="standard_ds1_v2",
            deployment_configuration=DeploymentConfiguration(
                virtual_machine_configuration=VirtualMachineConfiguration(
                    image_reference=ImageReference(
                        publisher="Canonical",
                        offer="UbuntuServer",
                        sku="22.04-LTS",
                    ),
                    node_agent_sku_id="batch.node.ubuntu 22.04",
                    os_disk=OSDisk(
                        ephemeral_os_disk_settings=DiffDiskSettings(
                            placement=DiffDiskPlacement.CACHE_DISK
                        )
                    ),
                )
            ),
        ),
    )
```

This is the same code snippet but for creating a pool with ephemeral OS disks using the Azure.ResourceManager.Batch SDK and C#.

```csharp
using Azure;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.Batch;
using Azure.ResourceManager.Batch.Models;

//...

public async Task SetEphemeralOSDisk()
{
    ArmClient client = new ArmClient(new DefaultAzureCredential());

    ResourceIdentifier batchAccountResourceId =
        BatchAccountResource.CreateResourceIdentifier("subscriptionId", "resourceGroupName", "accountName");
    BatchAccountResource batchAccount = client.GetBatchAccountResource(batchAccountResourceId);

    BatchAccountPoolCollection poolCollection = batchAccount.GetBatchAccountPools();

    BatchAccountPoolData poolData = new BatchAccountPoolData()
    {
        VmSize = "standard_ds1_v2",
        DeploymentConfiguration = new BatchDeploymentConfiguration()
        {
            VmConfiguration = new BatchVmConfiguration(
                imageReference: new BatchImageReference()
                {
                    Publisher = "Canonical",
                    Offer = "UbuntuServer",
                    Sku = "22.04-LTS"
                },
                nodeAgentSkuId: "batch.node.ubuntu 22.04")
            {
                OSDisk = new BatchOSDisk()
                {
                    EphemeralOSDiskSettings = new DiffDiskSettings()
                    {
                        Placement = BatchDiffDiskPlacement.CacheDisk
                    }
                }
            }
        }
    };

    ArmOperation<BatchAccountPoolResource> pool = await poolCollection.CreateOrUpdateAsync(
        WaitUntil.Completed, "ephemeralOSDiskPool", poolData);
}
```

## Next steps

- See the [Ephemeral OS Disks FAQ](/azure/virtual-machines/ephemeral-os-disks-faq).
- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about [costs that may be associated with Azure Batch workloads](budget.md).
