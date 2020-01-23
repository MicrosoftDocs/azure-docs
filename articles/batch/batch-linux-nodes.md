---
title: Run Linux on virtual machine compute nodes - Azure Batch | Microsoft Docs
description: Learn how to process your parallel compute workloads on pools of Linux virtual machines in Azure Batch.
services: batch
documentationcenter: python
author: ju-shim
manager: gwallace
editor: ''

ms.assetid: dc6ba151-1718-468a-b455-2da549225ab2
ms.service: batch
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: na
ms.date: 06/01/2018
ms.author: jushiman
ms.custom: H1Hack27Feb2017

---
# Provision Linux compute nodes in Batch pools

You can use Azure Batch to run parallel compute workloads on both Linux and Windows virtual machines. This article details how to create pools of Linux compute nodes in the Batch service by using both the [Batch Python][py_batch_package] and [Batch .NET][api_net] client libraries.

> [!NOTE]
> Application packages are supported on all Batch pools created after 5 July 2017. They are supported on Batch pools created between 10 March 2016 and 5 July 2017 only if the pool was created using a Cloud Service configuration. Batch pools created prior to 10 March 2016 do not support application packages. For more information about using application packages to deploy your applications to your Batch nodes, see [Deploy applications to compute nodes with Batch application packages](batch-application-packages.md).
>
>

## Virtual machine configuration
When you create a pool of compute nodes in Batch, you have two options from which to select the node size and operating system: Cloud Services Configuration and Virtual Machine Configuration.

**Cloud Services Configuration** provides Windows compute nodes *only*. Available compute node sizes are listed in [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md), and available operating systems are listed in the [Azure Guest OS releases and SDK compatibility matrix](../cloud-services/cloud-services-guestos-update-matrix.md). When you create a pool that contains Azure Cloud Services nodes, you specify the node size and the OS family, which are described in the previously mentioned articles. For pools of Windows compute nodes, Cloud Services is most commonly used.

**Virtual Machine Configuration** provides both Linux and Windows images for compute nodes. Available compute node sizes are listed in [Sizes for virtual machines in Azure](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) (Linux) and [Sizes for virtual machines in Azure](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) (Windows). When you create a pool that contains Virtual Machine Configuration nodes, you must specify the size of the nodes, the virtual machine image reference, and the Batch node agent SKU to be installed on the nodes.

### Virtual machine image reference

The Batch service uses [virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) to provide compute nodes in the Virtual Machine Configuration. You can specify an image from the [Azure Marketplace][vm_marketplace], or provide a custom image that you have prepared. For more details about custom images, see [Create a pool with the Shared Image Gallery](batch-sig-images.md).

When you configure a virtual machine image reference, you specify the properties of the virtual machine image. The following properties are required when you create a virtual machine image reference:

| **Image reference properties** | **Example** |
| --- | --- |
| Publisher |Canonical |
| Offer |UbuntuServer |
| SKU |14.04.4-LTS |
| Version |latest |

> [!TIP]
> You can learn more about these properties and how to list Marketplace images in [Navigate and select Linux virtual machine images in Azure with CLI or PowerShell](../virtual-machines/linux/cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). Note that not all Marketplace images are currently compatible with Batch. For more information, see [Node agent SKU](#node-agent-sku).
>
>

### Node agent SKU
The Batch node agent is a program that runs on each node in the pool and provides the command-and-control interface between the node and the Batch service. There are different implementations of the node agent, known as SKUs, for different operating systems. Essentially, when you create a Virtual Machine Configuration, you first specify the virtual machine image reference, and then you specify the node agent to install on the image. Typically, each node agent SKU is compatible with multiple virtual machine images. Here are a few examples of node agent SKUs:

* batch.node.ubuntu 14.04
* batch.node.centos 7
* batch.node.windows amd64

> [!IMPORTANT]
> Not all virtual machine images that are available in the Marketplace are compatible with the currently available Batch node agents. Use the Batch SDKs to list the available node agent SKUs and the virtual machine images with which they are compatible. See the [List of Virtual Machine images](#list-of-virtual-machine-images) later in this article for more information and examples of how to retrieve a list of valid images at runtime.
>
>

## Create a Linux pool: Batch Python
The following code snippet shows an example of how to use the [Microsoft Azure Batch Client Library for Python][py_batch_package] to create a pool of Ubuntu Server compute nodes. Reference documentation for the Batch Python module can be found at [azure.batch package][py_batch_docs] on Read the Docs.

This snippet creates an [ImageReference][py_imagereference] explicitly and specifies each of its properties (publisher, offer, SKU, version). In production code, however, we recommend that you use the [list_node_agent_skus][py_list_skus] method to determine and select from the available image and node agent SKU combinations at runtime.

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
pool_id = "LinuxNodesSamplePoolPython"
vm_size = "STANDARD_A1"
node_count = 1

# Initialize the Batch client
creds = batchauth.SharedKeyCredentials(account, key)
config = batch.BatchServiceClientConfiguration(creds, batch_url)
client = batch.BatchServiceClient(creds, batch_url)

# Create the unbound pool
new_pool = batchmodels.PoolAddParameter(id=pool_id, vm_size=vm_size)
new_pool.target_dedicated = node_count

# Configure the start task for the pool
start_task = batchmodels.StartTask()
start_task.run_elevated = True
start_task.command_line = "printenv AZ_BATCH_NODE_STARTUP_DIR"
new_pool.start_task = start_task

# Create an ImageReference which specifies the Marketplace
# virtual machine image to install on the nodes.
ir = batchmodels.ImageReference(
    publisher="Canonical",
    offer="UbuntuServer",
    sku="14.04.2-LTS",
    version="latest")

# Create the VirtualMachineConfiguration, specifying
# the VM image reference and the Batch node agent to
# be installed on the node.
vmc = batchmodels.VirtualMachineConfiguration(
    image_reference=ir,
    node_agent_sku_id="batch.node.ubuntu 14.04")

# Assign the virtual machine configuration to the pool
new_pool.virtual_machine_configuration = vmc

# Create pool in the Batch service
client.pool.add(new_pool)
```

As mentioned previously, we recommend that instead of creating the [ImageReference][py_imagereference] explicitly, you use the [list_node_agent_skus][py_list_skus] method to dynamically select from the currently supported node agent/Marketplace image combinations. The following Python snippet shows how to use this method.

```python
# Get the list of node agents from the Batch service
nodeagents = client.account.list_node_agent_skus()

# Obtain the desired node agent
ubuntu1404agent = next(
    agent for agent in nodeagents if "ubuntu 14.04" in agent.id)

# Pick the first image reference from the list of verified references
ir = ubuntu1404agent.verified_image_references[0]

# Create the VirtualMachineConfiguration, specifying the VM image
# reference and the Batch node agent to be installed on the node.
vmc = batchmodels.VirtualMachineConfiguration(
    image_reference=ir,
    node_agent_sku_id=ubuntu1404agent.id)
```

## Create a Linux pool: Batch .NET
The following code snippet shows an example of how to use the [Batch .NET][nuget_batch_net] client library to create a pool of Ubuntu Server compute nodes. You can find the [Batch .NET reference documentation][api_net] on docs.microsoft.com.

The following code snippet uses the [PoolOperations][net_pool_ops].[ListNodeAgentSkus][net_list_skus] method to select from the list of currently supported Marketplace image and node agent SKU combinations. This technique is desirable because the list of supported combinations may change from time to time. Most commonly, supported combinations are added.

```csharp
// Pool settings
const string poolId = "LinuxNodesSamplePoolDotNet";
const string vmSize = "STANDARD_A1";
const int nodeCount = 1;

// Obtain a collection of all available node agent SKUs.
// This allows us to select from a list of supported
// VM image/node agent combinations.
List<NodeAgentSku> nodeAgentSkus =
    batchClient.PoolOperations.ListNodeAgentSkus().ToList();

// Define a delegate specifying properties of the VM image
// that we wish to use.
Func<ImageReference, bool> isUbuntu1404 = imageRef =>
    imageRef.Publisher == "Canonical" &&
    imageRef.Offer == "UbuntuServer" &&
    imageRef.Sku.Contains("14.04");

// Obtain the first node agent SKU in the collection that matches
// Ubuntu Server 14.04. Note that there are one or more image
// references associated with this node agent SKU.
NodeAgentSku ubuntuAgentSku = nodeAgentSkus.First(sku =>
    sku.VerifiedImageReferences.Any(isUbuntu1404));

// Select an ImageReference from those available for node agent.
ImageReference imageReference =
    ubuntuAgentSku.VerifiedImageReferences.First(isUbuntu1404);

// Create the VirtualMachineConfiguration for use when actually
// creating the pool
VirtualMachineConfiguration virtualMachineConfiguration =
    new VirtualMachineConfiguration(imageReference, ubuntuAgentSku.Id);

// Create the unbound pool object using the VirtualMachineConfiguration
// created above
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    virtualMachineSize: vmSize,
    virtualMachineConfiguration: virtualMachineConfiguration,
    targetDedicatedComputeNodes: nodeCount);

// Commit the pool to the Batch service
await pool.CommitAsync();
```

Although the previous snippet uses the [PoolOperations][net_pool_ops].[ListNodeAgentSkus][net_list_skus] method to dynamically list and select from supported image and node agent SKU combinations (recommended), you can also configure an [ImageReference][net_imagereference] explicitly:

```csharp
ImageReference imageReference = new ImageReference(
    publisher: "Canonical",
    offer: "UbuntuServer",
    sku: "14.04.2-LTS",
    version: "latest");
```

## List of virtual machine images
The following table lists the Marketplace virtual machine images that are compatible with the available Batch node agents when this article was last updated. It is important to note that this list is not definitive because images and node agents may be added or removed at any time. We recommend that your Batch applications and services always use [list_node_agent_skus][py_list_skus] (Python) or [ListNodeAgentSkus][net_list_skus] (Batch .NET) to determine and select from the currently available SKUs.

> [!WARNING]
> The following list may change at any time. Always use the **list node agent SKU** methods available in the Batch APIs to list the compatible virtual machine and node agent SKUs when you run your Batch jobs.
>
>

| **Publisher** | **Offer** | **Image SKU** | **Version** | **Node agent SKU ID** |
| ------------- | --------- | ------------- | ----------- | --------------------- |
| batch | rendering-centos73 | rendering | latest | batch.node.centos 7 |
| batch | rendering-windows2016 | rendering | latest | batch.node.windows amd64 |
| Canonical | UbuntuServer | 16.04-LTS | latest | batch.node.ubuntu 16.04 |
| Canonical | UbuntuServer | 14.04.5-LTS | latest | batch.node.ubuntu 14.04 |
| Credativ | Debian | 9 | latest | batch.node.debian 9 |
| Credativ | Debian | 8 | latest | batch.node.debian 8 |
| microsoft-ads | linux-data-science-vm | linuxdsvm | latest | batch.node.centos 7 |
| microsoft-ads | standard-data-science-vm | standard-data-science-vm | latest | batch.node.windows amd64 |
| microsoft-azure-batch | centos-container | 7-4 | latest | batch.node.centos 7 |
| microsoft-azure-batch | centos-container-rdma | 7-4 | latest | batch.node.centos 7 |
| microsoft-azure-batch | ubuntu-server-container | 16-04-lts | latest | batch.node.ubuntu 16.04 |
| microsoft-azure-batch | ubuntu-server-container-rdma | 16-04-lts | latest | batch.node.ubuntu 16.04 |
| MicrosoftWindowsServer | WindowsServer | 2016-Datacenter | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | 2016-Datacenter-smalldisk | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | 2016-Datacenter-with-Containers | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | 2012-R2-Datacenter | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | 2012-R2-Datacenter-smalldisk | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | 2012-Datacenter | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | 2012-Datacenter-smalldisk | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | 2008-R2-SP1 | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | 2008-R2-SP1-smalldisk | latest | batch.node.windows amd64 |
| OpenLogic | CentOS | 7.4 | latest | batch.node.centos 7 |
| OpenLogic | CentOS-HPC | 7.4 | latest | batch.node.centos 7 |
| OpenLogic | CentOS-HPC | 7.3 | latest | batch.node.centos 7 |
| OpenLogic | CentOS-HPC | 7.1 | latest | batch.node.centos 7 |
| Oracle | Oracle-Linux | 7.4 | latest | batch.node.centos 7 |
| SUSE | SLES-HPC | 12-SP2 | latest | batch.node.opensuse 42.1 |

## Connect to Linux nodes using SSH
During development or while troubleshooting, you may find it necessary to sign in to the nodes in your pool. Unlike Windows compute nodes, you cannot use Remote Desktop Protocol (RDP) to connect to Linux nodes. Instead, the Batch service enables SSH access on each node for remote connection.

The following Python code snippet creates a user on each node in a pool, which is required for remote connection. It then prints the secure shell (SSH) connection information for each node.

```python
import datetime
import getpass
import azure.batch.batch_service_client as batch
import azure.batch.batch_auth as batchauth
import azure.batch.models as batchmodels

# Specify your own account credentials
batch_account_name = ''
batch_account_key = ''
batch_account_url = ''

# Specify the ID of an existing pool containing Linux nodes
# currently in the 'idle' state
pool_id = ''

# Specify the username and prompt for a password
username = 'linuxuser'
password = getpass.getpass()

# Create a BatchClient
credentials = batchauth.SharedKeyCredentials(
    batch_account_name,
    batch_account_key
)
batch_client = batch.BatchServiceClient(
    credentials,
    base_url=batch_account_url
)

# Create the user that will be added to each node in the pool
user = batchmodels.ComputeNodeUser(username)
user.password = password
user.is_admin = True
user.expiry_time = \
    (datetime.datetime.today() + datetime.timedelta(days=30)).isoformat()

# Get the list of nodes in the pool
nodes = batch_client.compute_node.list(pool_id)

# Add the user to each node in the pool and print
# the connection information for the node
for node in nodes:
    # Add the user to the node
    batch_client.compute_node.add_user(pool_id, node.id, user)

    # Obtain SSH login information for the node
    login = batch_client.compute_node.get_remote_login_settings(pool_id,
                                                                node.id)

    # Print the connection info for the node
    print("{0} | {1} | {2} | {3}".format(node.id,
                                         node.state,
                                         login.remote_login_ip_address,
                                         login.remote_login_port))
```

Here is sample output for the previous code for a pool that contains four Linux nodes:

```
Password:
tvm-1219235766_1-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50000
tvm-1219235766_2-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50003
tvm-1219235766_3-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50002
tvm-1219235766_4-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50001
```

Instead of a password, you can specify an SSH public key when you create a user on a node. In the Python SDK, use the **ssh_public_key** parameter on [ComputeNodeUser][py_computenodeuser]. In .NET, use the [ComputeNodeUser][net_computenodeuser].[SshPublicKey][net_ssh_key] property.

## Pricing
Azure Batch is built on Azure Cloud Services and Azure Virtual Machines technology. The Batch service itself is offered at no cost, which means you are charged only for the compute resources that your Batch solutions consume. When you choose **Cloud Services Configuration**, you are charged based on the [Cloud Services pricing][cloud_services_pricing] structure. When you choose **Virtual Machine Configuration**, you are charged based on the [Virtual Machines pricing][vm_pricing] structure. 

If you deploy applications to your Batch nodes using [application packages](batch-application-packages.md), you are also charged for the Azure Storage resources that your application packages consume. In general, the Azure Storage costs are minimal. 

## Next steps

The [Python code samples][github_samples_py] in the [azure-batch-samples][github_samples] repository on GitHub contain scripts that show you how to perform common Batch operations, such as pool, job, and task creation. The [README][github_py_readme] that accompanies the Python samples has details about how to install the required packages.

[api_net]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[api_net_mgmt]: https://msdn.microsoft.com/library/azure/mt463120.aspx
[api_rest]: https://msdn.microsoft.com/library/azure/dn820158.aspx
[cloud_services_pricing]: https://azure.microsoft.com/pricing/details/cloud-services/
[github_py_readme]: https://github.com/Azure/azure-batch-samples/blob/master/Python/Batch/README.md
[github_samples]: https://github.com/Azure/azure-batch-samples
[github_samples_py]: https://github.com/Azure/azure-batch-samples/tree/master/Python/Batch
[github_samples_pyclient]: https://github.com/Azure/azure-batch-samples/blob/master/Python/Batch/article_samples/python_tutorial_client.py
[portal]: https://portal.azure.com
[net_cloudpool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_computenodeuser]: /dotnet/api/microsoft.azure.batch.computenodeuser?view=azure-dotnet
[net_imagereference]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.imagereference.aspx
[net_list_skus]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.listnodeagentskus.aspx
[net_pool_ops]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.aspx
[net_ssh_key]: /dotnet/api/microsoft.azure.batch.computenodeuser.sshpublickey?view=azure-dotnet#Microsoft_Azure_Batch_ComputeNodeUser_SshPublicKey
[nuget_batch_net]: https://www.nuget.org/packages/Microsoft.Azure.Batch/
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx
[py_account_ops]: http://azure-sdk-for-python.readthedocs.org/en/dev/ref/azure.batch.operations.html#azure.batch.operations.AccountOperations
[py_azure_sdk]: https://pypi.python.org/pypi/azure
[py_batch_docs]: https://azure.github.io/azure-sdk-for-python/ref/Batch.html
[py_batch_package]: https://pypi.python.org/pypi/azure-batch
[py_computenodeuser]: /python/api/azure-batch/azure.batch.models.computenodeuser
[py_imagereference]: /python/api/azure-mgmt-batch/azure.mgmt.batch.models.imagereference
[py_list_skus]: https://docs.microsoft.com/python/api/azure-batch/azure.batch.operations.AccountOperations?view=azure-python
[vm_marketplace]: https://azure.microsoft.com/marketplace/virtual-machines/
[vm_pricing]: https://azure.microsoft.com/pricing/details/virtual-machines/
