---
title: Run Linux on virtual machine compute nodes
description: Learn how to process parallel compute workloads on pools of Linux virtual machines in Azure Batch.
ms.topic: how-to
ms.date: 05/18/2023
ms.devlang: csharp, python
ms.custom: H1Hack27Feb2017, devx-track-python, devx-track-csharp, devx-track-dotnet, devx-track-linux
zone_pivot_groups: programming-languages-batch-linux-nodes
---
# Provision Linux compute nodes in Batch pools

You can use Azure Batch to run parallel compute workloads on both Linux and Windows virtual machines. This article details how to create pools of Linux compute nodes in the Batch service by using both the [Batch Python](https://pypi.python.org/pypi/azure-batch) and [Batch .NET](/dotnet/api/microsoft.azure.batch) client libraries. 

## Virtual Machine Configuration

When you create a pool of compute nodes in Batch, you have two options from which to select the node size and operating system: Cloud Services Configuration and Virtual Machine Configuration. [Virtual Machine Configuration](nodes-and-pools.md#virtual-machine-configuration) pools are composed of Azure VMs, which may be created from either Linux or Windows images. When you create a pool with Virtual Machine Configuration, you specify an [available compute node size](../virtual-machines/sizes.md), the virtual machine image reference to be installed on the nodes,and the Batch node agent SKU (a program that runs on each node and provides an interface between the node and the Batch service).

### Virtual machine image reference

The Batch service uses [virtual machine scale sets](../virtual-machine-scale-sets/overview.md) to provide compute nodes in the Virtual Machine Configuration. You can specify an image from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/compute?filters=virtual-machine-images&page=1), or [use the Azure Compute Gallery to prepare a custom image](batch-sig-images.md).

When you create a virtual machine image reference, you must specify the following properties:

| **Image reference property** | **Example** |
| --- | --- |
| Publisher |Canonical |
| Offer |UbuntuServer |
| SKU |20.04-LTS |
| Version |latest |

> [!TIP]
> You can learn more about these properties and how to specify Marketplace images in [Find Linux VM images in the Azure Marketplace with the Azure CLI](../virtual-machines/linux/cli-ps-findimage.md). Note that some Marketplace images are not currently compatible with Batch.

### List of virtual machine images

Not all Marketplace images are compatible with the currently available Batch node agents. To list all supported Marketplace virtual machine images for the Batch service and their corresponding node agent SKUs, use [list_supported_images](/python/api/azure-batch/azure.batch.operations.AccountOperations#list-supported-images-account-list-supported-images-options-none--custom-headers-none--raw-false----operation-config-) (Python), [ListSupportedImages](/dotnet/api/microsoft.azure.batch.pooloperations.listsupportedimages) (Batch .NET), or the corresponding API in another language SDK.

### Node agent SKU

The [Batch node agent](https://github.com/Azure/Batch/blob/master/changelogs/nodeagent/CHANGELOG.md) is a program that runs on each node in the pool and provides the command-and-control interface between the node and the Batch service. There are different implementations of the node agent, known as SKUs, for different operating systems. Essentially, when you create a Virtual Machine Configuration, you first specify the virtual machine image reference, and then you specify the node agent to install on the image. Typically, each node agent SKU is compatible with multiple virtual machine images. To view the supported node agent SKUs and virtual machine image compatibilities, you can use the [Azure Batch CLI command](/cli/azure/batch/pool#supported-images):

```azurecli-interactive
az batch pool supported-images list
```

For more information, you can refer to [Account - List Supported Images - REST API (Azure Batch Service) | Microsoft Docs](/rest/api/batchservice/account/list-supported-images).


::: zone pivot="programming-language-python"
## Create a Linux pool: Batch Python

The following code snippet shows an example of how to use the [Microsoft Azure Batch Client Library for Python](https://pypi.python.org/pypi/azure-batch) to create a pool of Ubuntu Server compute nodes. For more details about the Batch Python module, view the [reference documentation](/python/api/overview/azure/batch).

This snippet creates an [ImageReference](/python/api/azure-mgmt-batch/azure.mgmt.batch.models.imagereference) explicitly and specifies each of its properties (publisher, offer, SKU, version). In production code, however, we recommend that you use the [list_supported_images](/python/api/azure-batch/azure.batch.operations.AccountOperations#list-supported-images-account-list-supported-images-options-none--custom-headers-none--raw-false----operation-config-) method to select from the available image and node agent SKU combinations at runtime.

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
vm_size = "STANDARD_D2_V3"
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
# virtual machine image to install on the nodes
ir = batchmodels.ImageReference(
    publisher="Canonical",
    offer="UbuntuServer",
    sku="20.04-LTS",
    version="latest")

# Create the VirtualMachineConfiguration, specifying
# the VM image reference and the Batch node agent
# to install on the node
vmc = batchmodels.VirtualMachineConfiguration(
    image_reference=ir,
    node_agent_sku_id="batch.node.ubuntu 20.04")

# Assign the virtual machine configuration to the pool
new_pool.virtual_machine_configuration = vmc

# Create pool in the Batch service
client.pool.add(new_pool)
```

As mentioned earlier, we recommend using the [list_supported_images](/python/api/azure-batch/azure.batch.operations.AccountOperations#list-supported-images-account-list-supported-images-options-none--custom-headers-none--raw-false----operation-config-) method to dynamically select from the currently supported node agent/Marketplace image combinations (rather than creating an [ImageReference](/python/api/azure-mgmt-batch/azure.mgmt.batch.models.imagereference) explicitly). The following Python snippet shows how to use this method.

```python
# Get the list of supported images from the Batch service
images = client.account.list_supported_images()

# Obtain the desired image reference
image = None
for img in images:
  if (img.image_reference.publisher.lower() == "canonical" and
        img.image_reference.offer.lower() == "ubuntuserver" and
        img.image_reference.sku.lower() == "20.04-lts"):
    image = img
    break

if image is None:
  raise RuntimeError('invalid image reference for desired configuration')

# Create the VirtualMachineConfiguration, specifying the VM image
# reference and the Batch node agent to be installed on the node
vmc = batchmodels.VirtualMachineConfiguration(
    image_reference=image.image_reference,
    node_agent_sku_id=image.node_agent_sku_id)
```
::: zone-end

::: zone pivot="programming-language-csharp"
## Create a Linux pool: Batch .NET

The following code snippet shows an example of how to use the [Batch .NET](https://www.nuget.org/packages/Microsoft.Azure.Batch/) client library to create a pool of Ubuntu Server compute nodes. For more details about Batch .NET, view the [reference documentation](/dotnet/api/microsoft.azure.batch).

The following code snippet uses the [PoolOperations.ListSupportedImages](/dotnet/api/microsoft.azure.batch.pooloperations.listsupportedimages) method to select from the list of currently supported Marketplace image and node agent SKU combinations. This technique is recommended, because the list of supported combinations may change from time to time. Most commonly, supported combinations are added.

```csharp
// Pool settings
const string poolId = "LinuxNodesSamplePoolDotNet";
const string vmSize = "STANDARD_D2_V3";
const int nodeCount = 1;

// Obtain a collection of all available node agent SKUs.
// This allows us to select from a list of supported
// VM image/node agent combinations.
List<ImageInformation> images =
    batchClient.PoolOperations.ListSupportedImages().ToList();

// Find the appropriate image information
ImageInformation image = null;
foreach (var img in images)
{
    if (img.ImageReference.Publisher == "Canonical" &&
        img.ImageReference.Offer == "UbuntuServer" &&
        img.ImageReference.Sku == "20.04-LTS")
    {
        image = img;
        break;
    }
}

// Create the VirtualMachineConfiguration for use when actually
// creating the pool
VirtualMachineConfiguration virtualMachineConfiguration =
    new VirtualMachineConfiguration(image.ImageReference, image.NodeAgentSkuId);

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

Although the previous snippet uses the [PoolOperations.istSupportedImages](/dotnet/api/microsoft.azure.batch.pooloperations.listsupportedimages) method to dynamically list and select from supported image and node agent SKU combinations (recommended), you can also configure an [ImageReference](/dotnet/api/microsoft.azure.batch.imagereference) explicitly:

```csharp
ImageReference imageReference = new ImageReference(
    publisher: "Canonical",
    offer: "UbuntuServer",
    sku: "20.04-LTS",
    version: "latest");
```
::: zone-end

## Connect to Linux nodes using SSH

During development or while troubleshooting, you may find it necessary to sign in to the nodes in your pool. Unlike Windows compute nodes, you can't use Remote Desktop Protocol (RDP) to connect to Linux nodes. Instead, the Batch service enables SSH access on each node for remote connection.

::: zone pivot="programming-language-python"
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

This code will have output similar to the following example. In this case, the pool contains four Linux nodes.

```
Password:
tvm-1219235766_1-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50000
tvm-1219235766_2-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50003
tvm-1219235766_3-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50002
tvm-1219235766_4-20160414t192511z | ComputeNodeState.idle | 13.91.7.57 | 50001
```
::: zone-end

Instead of a password, you can specify an SSH public key when you create a user on a node.
::: zone pivot="programming-language-python"
In the Python SDK, use the **ssh_public_key** parameter on [ComputeNodeUser](/python/api/azure-batch/azure.batch.models.computenodeuser).
::: zone-end
::: zone pivot="programming-language-csharp"
In .NET, use the [ComputeNodeUser.SshPublicKey](/dotnet/api/microsoft.azure.batch.computenodeuser.sshpublickey#Microsoft_Azure_Batch_ComputeNodeUser_SshPublicKey) property.
::: zone-end

## Pricing

Azure Batch is built on Azure Cloud Services and Azure Virtual Machines technology. The Batch service itself is offered at no cost, which means you are charged only for the compute resources (and associated costs that entails) that your Batch solutions consume. When you choose **Virtual Machine Configuration**, you are charged based on the [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/) structure.

If you deploy applications to your Batch nodes using [application packages](batch-application-packages.md), you are also charged for the Azure Storage resources that your application packages consume.

## Next steps

- Explore the [Python code samples](https://github.com/Azure/azure-batch-samples/tree/master/Python/Batch) in the [azure-batch-samples GitHub repository](https://github.com/Azure/azure-batch-samples) to see how to perform common Batch operations, such as pool, job, and task creation. The [README](https://github.com/Azure/azure-batch-samples/blob/master/Python/Batch/README.md) that accompanies the Python samples has details about how to install the required packages.
- Learn about using [Azure Spot VMs](batch-spot-vms.md) with Batch.
