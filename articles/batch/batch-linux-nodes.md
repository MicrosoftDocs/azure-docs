<properties
	pageTitle="Run parallel compute workloads on Linux virtual machines in Azure Batch | Microsoft Azure"
	description="Learn how to process your parallel compute workloads on pools of Linux virtual machines in Azure Batch."
	services="batch"
	documentationCenter="python"
	authors="mmacy"
	manager="timlt"
	editor="" />

<tags
	ms.service="batch"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-linux"
	ms.workload="na"
	ms.date="04/15/2016"
	ms.author="marsma" />

# Use Linux compute nodes in Azure Batch pools

Azure Batch enables you to run parallel compute workloads on both Linux and Windows virtual machines. This article details how to create pools of Linux compute nodes in the Batch service using using both the [Batch Python SDK][py_batch_package] and [Batch .NET][api_net] client library.

> [AZURE.NOTE] Linux support in Batch is currently in preview. Some aspects of the feature discussed here may change prior to general availability.

## Cloud Services vs. Virtual Machine Configuration

When you create a pool of compute nodes in Batch, you have two options from which to select the node size and operating system: **Cloud Services** and **Virtual Machine Configuration**. When you select either type, you must specify both the operating system and the size of the nodes.

**Cloud Services** provides Windows compute nodes *only*. Available compute node sizes are listed in [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md), and available operating systems are listed in the [Azure Guest OS releases and SDK compatibility matrix](../cloud-services/cloude-services-guestos-update-matrix.md). When you specify a pool containing Cloud Services nodes, you need specify only the node size and its "OS Family" found in these articles.

**Virtual Machine Configuration** provides both Linux and Windows images for compute nodes. Available compute node sizes are listed in [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-linux-sizes.md) (Linux) and [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-windows-sizes.md) (Windows). When you specify a pool containing Virtual Machine Configuration nodes, you must specify the node size as well as several properties of the operating system:

 * Publisher
 * Offer
 * SKU
 * Version

This is because the Batch service uses [Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) under the hood to provide Linux compute nodes, and the operating system images for these virtual machines are provided by the Azure Marketplace. Because list of available images (SKUs) changes periodically, there is no definitive list detailing the available images. However, the Batch SDKs provide the ability to list the available SKUs, which we discuss below.

## Create a Linux pool: Batch Python

Content here.

```python
# Import the required modules from the
# Azure Batch Client Library for Python
import azure.batch.batch_service_client as batch
import azure.batch.batch_auth as batchauth
import azure.batch.models as batchmodels

# Specify Batch account credentials
account = "<batch-account-name>"
key = "<batch-account-key>"
batch_url = "<batch-account-url>"

# Pool settings
pool_id = "mylinuxpool"
vm_size = "STANDARD_A1"
node_count = 1

# Initialize the Batch client
creds = batchauth.SharedKeyCredentials(account, key)
config = batch.BatchServiceClientConfiguration(creds, base_url = batch_url)
client = batch.BatchServiceClient(config)

# Create the unbound pool
new_pool = batchmodels.PoolAddParameter(id = pool_id, vm_size = vm_size)
new_pool.target_dedicated = node_count

# Configure the start task for the pool
start_task = batchmodels.StartTask()
start_task.run_elevated = True
start_task.command_line = "printenv AZ_BATCH_NODE_STARTUP_DIR"
new_pool.start_task = start_task

# First create an ImageReference
ir = batchmodels.ImageReference(
    publisher = "Canonical",
    offer = "UbuntuServer",
    sku = "14.04.2-LTS",
    version = "latest")

# Create a VirtualMachineConfiguration using the
# ImageReference and specifying the node agent SKU ID
vmc = batchmodels.VirtualMachineConfiguration(
    image_reference = ir,
    node_agent_sku_id = "Batch.Node.Ubuntu 14.04")

# Assign the VM config to the pool
new_pool.virtual_machine_configuration = vmc

# Create pool in the Batch service
client.pool.add(new_pool)
```

## Create a Linux pool: Batch .NET

Content here.

```csharp
// Obtain a collection of all available node agent SKUs
List<NodeAgentSku> nodeAgentSkus =
    batchClient.PoolOperations.ListNodeAgentSkus().ToList();

// Define a delegate specifying properties for the VM image
Func<ImageReference, bool> ubuntuImageScanner = imageRef =>
    imageRef.Publisher == "Canonical" &&
    imageRef.Offer == "UbuntuServer" &&
    imageRef.SkuId.Contains("14.04");

NodeAgentSku ubuntuSku = nodeAgentSkus.First(sku =>
    sku.VerifiedImageReferences.FirstOrDefault(ubuntuImageScanner) != null);

ImageReference imageReference =
    ubuntuSku.VerifiedImageReferences.First(ubuntuImageScanner);

VirtualMachineConfiguration virtualMachineConfiguration =
    new VirtualMachineConfiguration(
        imageReference: imageReference,
        nodeAgentSkuId: ubuntuSku.Id);

CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    virtualMachineSize: "STANDARD_A1",
    virtualMachineConfiguration: virtualMachineConfiguration,
    targetDedicated: 1);

pool.Commit();
```

## List the available images (SKUs)

Description of why you'd want to do this here.

### Batch .NET

Description here.

```csharp
// Obtain a collection of all available node agent SKUs
List<NodeAgentSku> nodeAgentSkus =
    batchClient.PoolOperations.ListNodeAgentSkus().ToList();

// Display the available SKUs
foreach (NodeAgentSku sku in nodeAgentSkus)
{
    Console.WriteLine("{0} | {1}", sku.Id, sku.OSType);

    foreach (ImageReference imgSku in sku.VerifiedImageReferences)
    {
        Console.WriteLine("    {0} | {1} | {2} | {3}",
            imgSku.Offer, imgSku.Publisher, imgSku.SkuId, imgSku.Version);
    }
}
```

### Batch Python

Description here.

```
python code snippet here
```

## Pricing

Azure Batch is built on Azure Cloud Services and Azure Virtual Machines technology. The Batch service itself is offered at no cost, which means you are charged only for the compute resources consumed by your Batch solutions. When creating a pool with either the [Azure portal][portal] or one of the APIs (e.g. REST, .NET, Python) you can choose the type of pool to create. If you choose Cloud Services (which is Windows only) you will be charged based on the Cloud Services pricing structure. If you choose Virtual Machines (which provides Linux), you will be charged based on Linux Virtual Machines pricing structure.

## Wrapping up

Content here.

## Next steps

* Next step #1

* Next step #2

[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_net_mgmt]: https://msdn.microsoft.com/library/azure/mt463120.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[github_samples]: https://github.com/Azure/azure-batch-samples
[portal]: https://portal.azure.com
[storage_pricing]: https://azure.microsoft.com/pricing/details/storage/
[net_cloudpool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx
[py_azure_sdk]: https://pypi.python.org/pypi/azure
[py_batch_docs]: http://azure-sdk-for-python.readthedocs.org/en/dev/ref/azure.batch.html
[py_batch_package]: https://pypi.python.org/pypi/azure-batch
[vm_marketplace]: https://azure.microsoft.com/marketplace/virtual-machines/

[1]: ./media/batch-application-packages/app_pkg_01.png "Application packages high-level diagram"
