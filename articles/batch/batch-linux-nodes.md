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

# Provision Linux compute nodes in Azure Batch pools

Azure Batch enables you to run parallel compute workloads on both Linux and Windows virtual machines. This article details how to create pools of Linux compute nodes in the Batch service using both the [Batch Python][py_batch_package] and [Batch .NET][api_net] client libraries.

> [AZURE.NOTE] Linux support in Batch is currently in preview. Some aspects of the feature discussed here may change prior to general availability.

## Virtual Machine Configuration

When you create a pool of compute nodes in Batch, you have two options from which to select the node size and operating system: **Cloud Services** and **Virtual Machine Configuration**.

**Cloud Services** provides Windows compute nodes *only*. Available compute node sizes are listed in [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md), and available operating systems are listed in the [Azure Guest OS releases and SDK compatibility matrix](../cloud-services/cloud-services-guestos-update-matrix.md). When you specify a pool containing Cloud Services nodes, you need to specify only the node size and its "OS Family" which are found in these articles. When creating pools of Windows compute nodes, Cloud Services is most commonly used.

**Virtual Machine Configuration** provides both Linux and Windows images for compute nodes. Available compute node sizes are listed in [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-linux-sizes.md) (Linux) and [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-windows-sizes.md) (Windows). When you specify a pool containing Virtual Machine Configuration nodes, you must specify the node size as well as several additional properties:

| Property		    | Example				   |
| ----------------- | ------------------------ |
| Publisher			| Canonical                |
| Offer				| UbuntuServer             |
| SKU				| 14.04.4-LTS              |
| Version			| latest				   |
| Node agent SKU ID	| batch.node.ubuntu 14.04  |

These additional properties are required because the Batch service uses [Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) under the hood to provide Linux compute nodes, and the operating system images for these virtual machines are provided by the [Azure Marketplace][vm_marketplace]. Because the list of available images (SKUs) changes periodically, there is no definitive list of the available images. However, the Batch SDKs provide the ability to list the available SKUs, which we discuss below in [List of virtual machine images](#list-of-virtual-machine-images).

## Create a Linux pool: Batch Python

The following code snippet shows the creation of a pool of Ubuntu Server compute nodes using the [Microsoft Azure Batch Client Library for Python][py_batch_package]. Reference documentation for the Batch Python module can be found at [azure.batch package ][py_batch_docs] on Read the Docs.

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

# Create an ImageReference which is used
# in creating the VirtualMachineConfiguration
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

The following code snippet shows the creation of a pool of Ubuntu Server compute nodes using the [Batch .NET][nuget_batch_net] client library. You can find the [Batch .NET reference documentation][api_net] on MSDN.

```csharp
// Obtain a collection of all available node agent SKUs
List<NodeAgentSku> nodeAgentSkus =
    batchClient.PoolOperations.ListNodeAgentSkus().ToList();

// Define a delegate specifying properties for the VM image
Func<ImageReference, bool> ubuntuImageScanner = imageRef =>
    imageRef.Publisher == "Canonical" &&
    imageRef.Offer == "UbuntuServer" &&
    imageRef.SkuId.Contains("14.04");

// Obtain the first SKU in the collection for Ubuntu Server 14.04
NodeAgentSku ubuntuSku = nodeAgentSkus.First(sku =>
    sku.VerifiedImageReferences.FirstOrDefault(ubuntuImageScanner) != null);

// Create an ImageReference which require by the
// VirtualMachineConfiguration
ImageReference imageReference =
    ubuntuSku.VerifiedImageReferences.First(ubuntuImageScanner);

// Create the VirtualMachineConfiguration for use
// when actually creating the pool
VirtualMachineConfiguration virtualMachineConfiguration =
    new VirtualMachineConfiguration(
        imageReference: imageReference,
        nodeAgentSkuId: ubuntuSku.Id);

// Create the unbound pool object using the
// VirtualMachineConfiguration created above
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    virtualMachineSize: "STANDARD_A1",
    virtualMachineConfiguration: virtualMachineConfiguration,
    targetDedicated: 1);

// Commit the pool to the Batch service
pool.Commit();
```

The code snippet above uses the [PoolOperations][net_pool_ops].[ListNodeAgentSkus][net_list_skus] method to select a virtual machine image from the currently available Marketplace images. This technique is desirable because the list of available images may change from time to time (most commonly, images are added). You can, however, configure an ImageReference directly as is done in the Python code snippet. For example:

```csharp
ImageReference imageReference = new ImageReference(
    publisher: "Canonical",
    offer: "UbuntuServer",
    skuId: "14.04.2-LTS",
    version: "latest");
```

## List of Virtual Machine images

The table below lists the available Linux images **at the time of this writing**. It is important to note that this list is not definitive, as images may be added or removed at any time. We recommend that your Batch applications and services *always* use [list_node_agent_skus][py_list_skus] (Python) and [ListNodeAgentSkus][net_list_skus] (Batch .NET) to determine and select from the currently available SKUs.

> [AZURE.WARNING] The list below may change at any time. Always use the **list node agent SKU** methods available in the Batch APIs to list and then select from the available SKUs when you run your Batch jobs.

| Publisher   | Offer 	  	   | Image SKU 	 | Version | Node agent SKU ID        |
| ----------- | -------------- | ----------- | ------- | ------------------------ |
| Canonical   | UbuntuServer   | 14.04.0-LTS | latest  | batch.node.ubuntu 14.04  |
| Canonical   | UbuntuServer   | 14.04.1-LTS | latest  | batch.node.ubuntu 14.04  |
| Canonical   | UbuntuServer   | 14.04.2-LTS | latest  | batch.node.ubuntu 14.04  |
| Canonical   | UbuntuServer   | 14.04.3-LTS | latest  | batch.node.ubuntu 14.04  |
| Canonical   | UbuntuServer   | 14.04.4-LTS | latest  | batch.node.ubuntu 14.04  |
| Canonical   | UbuntuServer   | 15.10 		 | latest  | batch.node.debian 8      |
| Credativ    | Debian 		   | 8 			 | latest  | batch.node.debian 8      |
| OpenLogic   | CentOS 		   | 7.0 		 | latest  | batch.node.centos 7      |
| OpenLogic   | CentOS 		   | 7.1 		 | latest  | batch.node.centos 7      |
| OpenLogic   | CentOS 		   | 7.2 		 | latest  | batch.node.centos 7      |
| Oracle      | Oracle-Linux-7 | OL70 		 | latest  | batch.node.centos 7      |
| SUSE  	  | SLES 		   | 12 		 | latest  | batch.node.opensuse 42.1 |
| SUSE  	  | SLES 		   | 12-SP1 	 | latest  | batch.node.opensuse 42.1 |
| SUSE  	  | SLES-HPC 	   | 12 		 | latest  | batch.node.opensuse 42.1 |
| SUSE  	  | openSUSE 	   | 13.2 		 | latest  | batch.node.opensuse 13.2 |
| SUSE  	  | openSUSE-Leap  | 42.1 		 | latest  | batch.node.opensuse 42.1 |

## Pricing

Azure Batch is built on Azure Cloud Services and Azure Virtual Machines technology. The Batch service itself is offered at no cost, which means you are charged only for the compute resources consumed by your Batch solutions. When you choose **Cloud Services** you will be charged based on the [Cloud Services pricing][cloud_services_pricing] structure. When you choose **Virtual Machine Configuration**, you will be charged based on the [Virtual Machines pricing][vm_pricing] structure.

## Next steps

* Next step #1

* Next step #2

[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_net_mgmt]: https://msdn.microsoft.com/library/azure/mt463120.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[cloud_services_pricing]: https://azure.microsoft.com/pricing/details/cloud-services/
[github_samples]: https://github.com/Azure/azure-batch-samples
[portal]: https://portal.azure.com
[net_cloudpool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_list_skus]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.listnodeagentskus.aspx
[net_pool_ops]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.aspx
[nuget_batch_net]: https://www.nuget.org/packages/Azure.Batch/
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx
[py_account_ops]: http://azure-sdk-for-python.readthedocs.org/en/dev/ref/azure.batch.operations.html#azure.batch.operations.AccountOperations
[py_azure_sdk]: https://pypi.python.org/pypi/azure
[py_batch_docs]: http://azure-sdk-for-python.readthedocs.org/en/dev/ref/azure.batch.html
[py_batch_package]: https://pypi.python.org/pypi/azure-batch
[py_list_skus]: http://azure-sdk-for-python.readthedocs.org/en/dev/ref/azure.batch.operations.html#azure.batch.operations.AccountOperations.list_node_agent_skus
[vm_marketplace]: https://azure.microsoft.com/marketplace/virtual-machines/
[vm_pricing]: https://azure.microsoft.com/pricing/details/virtual-machines/

[1]: ./media/batch-application-packages/app_pkg_01.png "Application packages high-level diagram"
