<properties
	pageTitle="Linux nodes in Azure Batch pools | Microsoft Azure"
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
	ms.date="04/19/2016"
	ms.author="marsma" />

# Provision Linux compute nodes in Azure Batch pools

Azure Batch enables you to run parallel compute workloads on both Linux and Windows virtual machines. This article details how to create pools of Linux compute nodes in the Batch service using both the [Batch Python][py_batch_package] and [Batch .NET][api_net] client libraries.

> [AZURE.NOTE] Linux support in Batch is currently in preview. Some aspects of the feature discussed here may change prior to general availability. [Application packages](batch-application-packages.md) and [multi-instance tasks](batch-mpi.md) are **currently unsupported** on Linux compute nodes.

## Virtual Machine Configuration

When you create a pool of compute nodes in Batch, you have two options from which to select the node size and operating system: **Cloud Services Configuration** and **Virtual Machine Configuration**.

**Cloud Services Configuration** provides Windows compute nodes *only*. Available compute node sizes are listed in [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md), and available operating systems are listed in the [Azure Guest OS releases and SDK compatibility matrix](../cloud-services/cloud-services-guestos-update-matrix.md). When you create a pool containing Cloud Services nodes, you need to specify only the node size and its "OS Family" which are found in these articles. When creating pools of Windows compute nodes, Cloud Services is most commonly used.

**Virtual Machine Configuration** provides both Linux and Windows images for compute nodes. Available compute node sizes are listed in [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-linux-sizes.md) (Linux) and [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-windows-sizes.md) (Windows). When you create a pool containing Virtual Machine Configuration nodes, you must specify not only the size of the nodes, but also the **virtual machine image reference** and the Batch **node agent SKU** to be installed on the nodes.

### Virtual machine image reference

The Batch service uses [Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) under the hood to provide Linux compute nodes, and the operating system images for these virtual machines are provided by the [Azure Virtual Machines Marketplace][vm_marketplace]. When you configure a virtual machine image reference, you specify the properties of a Marketplace virtual machine image. The following properties are required when creating a virtual machine image reference:

| **Image reference properties** | **Example** |
| ----------------- | ------------------------ |
| Publisher			| Canonical                |
| Offer				| UbuntuServer             |
| SKU				| 14.04.4-LTS              |
| Version			| latest				   |

> [AZURE.TIP] You can find out more about these properties and how to list marketplace images in [Navigate and select Linux virtual machine images in Azure with CLI or Powershell](../virtual-machines/virtual-machines-linux-cli-ps-findimage.md). Note that not all Marketplace images are currently compatible with Batch--see [Node agent SKU](#node-agent-sku) below.

### Node agent SKU

The Batch node agent is a program that runs on each node in the pool, and provides the command-and-control interface between the node and the Batch service. There are different implementations of the node agent, known as SKUs, for different operating systems. Essentially, when creating a Virtual Machine Configuration, you first specify the virtual machine image reference, and then specify which node agent to install on the image. Typically, each node agent SKU is compatible with multiple virtual machine images. Here are a few examples of node agent SKUs:

* batch.node.ubuntu 14.04
* batch.node.centos 7
* batch.node.windows amd64

> [AZURE.IMPORTANT] Not all virtual machine images available in the Marketplace are compatible with the currently available Batch node agents. You must use the Batch SDKs to list the available node agent SKUs and the virtual machine images with which they are compatible. See the [List of Virtual Machine images](#list-of-virtual-machine-images) below for more information.

## Create a Linux pool: Batch Python

The following code snippet shows the creation of a pool of Ubuntu Server compute nodes using the [Microsoft Azure Batch Client Library for Python][py_batch_package]. Reference documentation for the Batch Python module can be found at [azure.batch package ][py_batch_docs] on Read the Docs.

In this snippet, we create an [ImageReference][py_imagereference] explicitly, specifying each of its properties (publisher, offer, sku, version). We recommend, however, that in production code you use the [list_node_agent_skus][py_list_skus] method to determine and select from the available image and node agent SKU combinations at runtime.

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

# Create an ImageReference which specifies the Marketplace
# virtual machine image to install on the nodes.
ir = batchmodels.ImageReference(
    publisher = "Canonical",
    offer = "UbuntuServer",
    sku = "14.04.2-LTS",
    version = "latest")

# Create the VirtualMachineConfiguration, specifying
# the VM image reference and the Batch node agent to
# be installed on the node.
vmc = batchmodels.VirtualMachineConfiguration(
    image_reference = ir,
    node_agent_sku_id = "batch.node.ubuntu 14.04")

# Assign the virtual machine configuration to the pool
new_pool.virtual_machine_configuration = vmc

# Create pool in the Batch service
client.pool.add(new_pool)
```

As mentioned above, we recommend that instead of creating the [ImageReference][py_imagereference] explicitly, you use the [list_node_agent_skus][py_list_skus] method to dynamically select from the currently supported node agent/Marketplace image combinations. The following Python snippet shows usage of this method.

```python
# Get the list of node agents from the Batch service
nodeagents = client.account.list_node_agent_skus()

# Obtain the desired node agent
ubuntu1404agent = next(agent for agent in nodeagents if "ubuntu 14.04" in agent.id)

# Pick the first image reference from the list of verified references
ir = ubuntu1404agent.verified_image_references[0]

# Create the VirtualMachineConfiguration, specifying the VM image
# reference and the Batch node agent to be installed on the node.
vmc = batchmodels.VirtualMachineConfiguration(
    image_reference = ir,
    node_agent_sku_id = ubuntu1404agent.id)
```

## Create a Linux pool: Batch .NET

The following code snippet shows the creation of a pool of Ubuntu Server compute nodes using the [Batch .NET][nuget_batch_net] client library. You can find the [Batch .NET reference documentation][api_net] on MSDN.

The code snippet below uses the [PoolOperations][net_pool_ops].[ListNodeAgentSkus][net_list_skus] method to select from the list of currently supported Marketplace image and node agent SKU combinations. This technique is desirable because the list of supported combinations may change from time to time (most commonly, supported combinations added).

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
    imageRef.SkuId.Contains("14.04");

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
    new VirtualMachineConfiguration(
        imageReference: imageReference,
        nodeAgentSkuId: ubuntuAgentSku.Id);

// Create the unbound pool object using the VirtualMachineConfiguration
// created above
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    virtualMachineSize: vmSize,
    virtualMachineConfiguration: virtualMachineConfiguration,
    targetDedicated: nodeCount);

// Commit the pool to the Batch service
pool.Commit();
```

Although the snippet above uses the [PoolOperations][net_pool_ops].[ListNodeAgentSkus][net_list_skus] method to dynamically list and select from supported image and node agent SKU combinations (recommended), you can also configure an [ImageReference][net_imagereference] explicitly:

```csharp
ImageReference imageReference = new ImageReference(
    publisher: "Canonical",
    offer: "UbuntuServer",
    skuId: "14.04.2-LTS",
    version: "latest");
```

## List of Virtual Machine images

The table below lists which Marketplace virtual machine images are compatible with the available Batch node agents **at the time of this writing**. It is important to note that this list is not definitive, as images and node agents may be added or removed at any time. We recommend that your Batch applications and services always use [list_node_agent_skus][py_list_skus] (Python) and [ListNodeAgentSkus][net_list_skus] (Batch .NET) to determine and select from the currently available SKUs.

> [AZURE.WARNING] The list below may change at any time. Always use the **list node agent SKU** methods available in the Batch APIs to list and then select from the compatible virtual machine and node agent SKUs when you run your Batch jobs.

| **Publisher** | **Offer** | **Image SKU** | **Version** | **Node Agent SKU ID** |
| ------- | ------- | ------- | ------- | ------- |
| Canonical | UbuntuServer | 14.04.0-LTS | latest | batch.node.ubuntu 14.04 |
| Canonical | UbuntuServer | 14.04.1-LTS | latest | batch.node.ubuntu 14.04 |
| Canonical | UbuntuServer | 14.04.2-LTS | latest | batch.node.ubuntu 14.04 |
| Canonical | UbuntuServer | 14.04.3-LTS | latest | batch.node.ubuntu 14.04 |
| Canonical | UbuntuServer | 14.04.4-LTS | latest | batch.node.ubuntu 14.04 |
| Canonical | UbuntuServer | 15.10 | latest | batch.node.debian 8 |
| Credativ | Debian | 8 | latest | batch.node.debian 8 |
| OpenLogic | CentOS | 7.0 | latest | batch.node.centos 7 |
| OpenLogic | CentOS | 7.1 | latest | batch.node.centos 7 |
| OpenLogic | CentOS | 7.2 | latest | batch.node.centos 7 |
| Oracle | Oracle-Linux-7 | OL70 | latest | batch.node.centos 7 |
| SUSE | SLES | 12 | latest | batch.node.opensuse 42.1 |
| SUSE | SLES | 12-SP1 | latest | batch.node.opensuse 42.1 |
| SUSE | SLES-HPC | 12 | latest | batch.node.opensuse 42.1 |
| SUSE | openSUSE | 13.2 | latest | batch.node.opensuse 13.2 |
| SUSE | openSUSE-Leap | 42.1 | latest | batch.node.opensuse 42.1 |
| MicrosoftWindowsServer | WindowsServer | 2008-R2-SP1 | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | 2012-Datacenter | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | 2012-R2-Datacenter | latest | batch.node.windows amd64 |
| MicrosoftWindowsServer | WindowsServer | Windows-Server-Technical-Preview | latest | batch.node.windows amd64 |

## Connect to Linux nodes

During development or while troubleshooting, you may find it necessary to log in to the nodes in your pool. Unlike Windows compute nodes, you cannot use Remote Desktop Protocol (RDP) to connect to Linux nodes. Instead, the Batch service enables SSH access on each node for remote connection.

The following Python code snippet creates a user on each node in a pool--required for remote connection--then prints the SSH connection information for each node.

```python
import getpass

# Specify the username and prompt for a password
username = "linuxuser"
password = getpass.getpass()

# Create the user that will be added to each node
# in the pool
user = batchmodels.ComputeNodeUser(username)
user.password = password
user.is_admin = True
user.expiry_time = (datetime.datetime.today() + datetime.timedelta(days=30)).isoformat()

# Get the list of nodes in the pool
nodes = client.compute_node.list(pool_id)

# Add the user to each node in the pool and print
# the connection information for the node
for node in nodes:
    # Add the user to the node
    client.compute_node.add_user(pool_id, node.id, user)

    # Obtain SSH login information for the node
    login = client.compute_node.get_remote_login_settings(pool_id,
                                                          node.id)

    # Print the connection info for the node
    print("{0} | {1} | {2} | {3}".format(node.id,
                                         node.state,
                                         login.remote_login_ip_address,
                                         login.remote_login_port))
```

Here is sample output for the code above for a pool containing four Linux nodes:

```
Password:
tvm-1219235766_1-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50000
tvm-1219235766_2-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50003
tvm-1219235766_3-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50002
tvm-1219235766_4-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50001
```

Note that instead of a password, you can specify an SSH public key when creating a user on a node. In the Python SDK, this done using the **ssh_public_key** parameter on [ComputeNodeUser][py_computenodeuser], and in .NET, this is done with the [ComputeNodeUser][net_computenodeuser].[SshPublicKey][net_ssh_key] property.

## Pricing

Azure Batch is built on Azure Cloud Services and Azure Virtual Machines technology. The Batch service itself is offered at no cost, which means you are charged only for the compute resources consumed by your Batch solutions. When you choose **Cloud Services Configuration** you will be charged based on the [Cloud Services pricing][cloud_services_pricing] structure. When you choose **Virtual Machine Configuration**, you will be charged based on the [Virtual Machines pricing][vm_pricing] structure.

## Next steps

### Batch Python code samples

Check out the [Python code samples][github_samples_py] in the [azure-batch-samples][github_samples] repository on GitHub for several scripts that show you how to perform common Batch operations such as pool, job, and task creation, and more. The [README][github_py_readme] that accompanies the Python samples has details on installing the required packages.

### Batch Forum

The [Azure Batch Forum][forum] on MSDN is a great place to discuss Batch and ask questions about the service. Head on over to read helpful "stickied" posts, and post your questions as they arise while you build your Batch solutions.

[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_net_mgmt]: https://msdn.microsoft.com/library/azure/mt463120.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[cloud_services_pricing]: https://azure.microsoft.com/pricing/details/cloud-services/
[forum]: https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=azurebatch
[github_py_readme]: https://github.com/Azure/azure-batch-samples/blob/master/Python/Batch/README.md
[github_samples]: https://github.com/Azure/azure-batch-samples
[github_samples_py]: https://github.com/Azure/azure-batch-samples/tree/master/Python/Batch
[portal]: https://portal.azure.com
[net_cloudpool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_computenodeuser]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenodeuser.aspx
[net_imagereference]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.imagereference.aspx
[net_list_skus]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.listnodeagentskus.aspx
[net_pool_ops]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.aspx
[net_ssh_key]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenodeuser.sshpublickey.aspx
[nuget_batch_net]: https://www.nuget.org/packages/Azure.Batch/
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx
[py_account_ops]: http://azure-sdk-for-python.readthedocs.org/en/dev/ref/azure.batch.operations.html#azure.batch.operations.AccountOperations
[py_azure_sdk]: https://pypi.python.org/pypi/azure
[py_batch_docs]: http://azure-sdk-for-python.readthedocs.org/en/dev/ref/azure.batch.html
[py_batch_package]: https://pypi.python.org/pypi/azure-batch
[py_computenodeuser]: http://azure-sdk-for-python.readthedocs.org/en/dev/ref/azure.batch.models.html#azure.batch.models.ComputeNodeUser
[py_imagereference]: http://azure-sdk-for-python.readthedocs.org/en/dev/ref/azure.batch.models.html#azure.batch.models.ImageReference
[py_list_skus]: http://azure-sdk-for-python.readthedocs.org/en/dev/ref/azure.batch.operations.html#azure.batch.operations.AccountOperations.list_node_agent_skus
[vm_marketplace]: https://azure.microsoft.com/marketplace/virtual-machines/
[vm_pricing]: https://azure.microsoft.com/pricing/details/virtual-machines/

[1]: ./media/batch-application-packages/app_pkg_01.png "Application packages high-level diagram"
