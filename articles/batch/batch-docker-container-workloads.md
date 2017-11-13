---
title: Docker container workloads on Azure Batch | Microsoft Docs
description: Learn how to run applications from Docker container images on Azure Batch.
services: batch
author: v-dotren
manager: timlt

ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.workload: na
ms.date: 11/02/2017
ms.author: v-dotren

---

# Run Docker container applications on Azure Batch

Azure Batch lets you run and scale very large numbers of batch computing jobs on Azure. Until now, Batch tasks have run directly on virtual machines (VMs) in a Batch pool, but now you can set up a Batch pool to run tasks in Docker containers.

Using containers provides an easy way to run Batch tasks without having to manage application packages and dependencies. Containers deploy applications as lightweight, portable, self-sufficient units that can run in a variety of environments. For example, you can build and test a container locally, then upload the container image to a registry in Azure or elsewhere. The container deployment model ensures that the runtime environment of your application is always correctly installed and configured, regardless of where you host the application. This tutorial shows you how to use the Batch .NET SDK to create a pool of compute nodes that support running container tasks, and how to run container tasks on the pool.

This article assumes familiarity with Docker container concepts and how to create a Batch pool and job using the .NET SDK. The code snippets are meant to be used in a client application similar to the [DotNetTutorial sample](batch-dotnet-get-started.md), and are examples of code you would need to support container applications in Batch.


## Prerequisites

* SDK versions: The Batch SDKs support container images in the following versions:
    * Batch REST API version 2017-09-01.6.0
    * Batch .NET SDK version 8.0.0
    * Batch Python SDK version 4.0
    * Batch Java SDK version 3.0
    * Batch Node.js SDK version 3.0

* Accounts: On your Azure account, you need to create a Batch account and optionally a general-purpose Storage account.

* A supported VM image. Containers are only supported in pools created with the Virtual Machine Configuration from images detailed in the following section, "Supported virtual machine images."

* If you provide a custom image, your application must use Azure Active Directory (Azure AD) authentication in order to run container-based workloads. If you use an Azure Marketplace image, you don't need AAD authentication; shared key authentication will work. Azure Batch support for Azure AD is documented in [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).


## Supported virtual machine images

You need to provide a Windows or Linux image to create a pool of VM compute nodes.

### Windows images

For Windows container workloads, Batch currently supports custom images that you create from VMs running Docker on Windows, or you can use the Windows Server 2016 Datacenter with Containers image from the Azure Marketplace. This image is compatible with the `batch.node.windows amd64` node agent SKU ID. The type of container supported is currently limited to Docker.

### Linux images

For Linux container workloads, Batch currently supports only custom images that you create from VMs running Docker on the following Linux distributions: Ubuntu 16.04 LTS or CentOS 7.3. If you choose to provide your own custom Linux image, see the instructions in [Use a managed custom image to create a pool of virtual machines](batch-custom-images.md).

You can use [Docker Community Edition (CE)](https://www.docker.com/community-edition) or [Docker Enterprise Edition (EE)](https://www.docker.com/enterprise-edition).

If you want to take advantage of the GPU performance of Azure NC or NV VM sizes, you need to install NVIDIA drivers on the image. Also, you need to install and run the Docker Engine Utility for NVIDIA GPUs, [NVIDIA Docker](https://github.com/NVIDIA/nvidia-docker).

To access the Azure RDMA network, use VMs of the following sizes: A8, A9, H16r, H16mr, or NC24r. Necessary RDMA drivers are installed in the CentOS 7.3 HPC and Ubuntu 16.04 LTS images from the Azure Marketplace. Additional configuration may be needed to run MPI workloads. See [Use RDMA-capable or GPU-enabled instances in Batch pool](batch-pool-compute-intensive-sizes.md).


## Limitations

* Batch provides RDMA and MPI support only for containers running on Linux pools.

* Batch currently does not support Windows images with Windows Hyper-V containers.


## Authenticate using Azure Active Directory

If you use a custom VM image to create the Batch pool, your client application must authenticate using Azure AD integrated authentication (shared key authentication does not work). Before running the application, make sure you register it in Azure AD to establish an identity for it and to specify its permissions to other applications.

Also, when you use a custom VM image, you need to grant IAM access control to the application to access the VM image. In Azure Portal, open **All resources**, select the container image, and from the **Access control (IAM)** section of the image blade, and click **Add**. In the **Add permissions** blade, specify a **Role**, in **Assign access to**, select **Azure AD user, group, or application**, then in **Select** enter the application name.

In your application, pass an Azure AD authentication token when you create the Batch client using [BatchClient.Open](/dotnet/api/microsoft.azure.batch.batchclient.open#Microsoft_Azure_Batch_BatchClient_Open_Microsoft_Azure_Batch_Auth_BatchTokenCredentials_), as described in [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).


## Reference a VM image for pool creation

In your application code, provide a reference to the VM image to use in creating the compute nodes of the pool. You do this by creating an [ImageReference](/dotnet/api/microsoft.azure.batch.imagereference) object. You can specify the image to use in one of the following ways:

* If you are using a custom image, provide an ARM resource identifier for the virtual machine image. The image identifier has a path format as shown in the following example:

  ```csharp
  // Provide a reference to a custom image using an image ID
  ImageReference imageReference = new ImageReference("/subscriptions/{subscription-ID}/resourceGroups/{resource-group}/providers/Microsoft.Compute/images/{imageName}");
  ```

    To obtain this image ID from the Azure Portal, open **All resources**, select the custom image, and from the **Overview** section of the image blade, copy the path in **Resource ID**.

* If you are using an [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/compute?page=1&subcategories=windows-based) image, provide a group of parameters describing the image: the offer type, publisher, SKU, and version of the image, as listed in [List of virtual machine images](batch-linux-nodes.md#list-of-virtual-machine-images):

  ```csharp
  // Provide a reference to an Azure Marketplace image for
  // "Windows Server 2016 Datacenter with Containers"
  ImageReference imageReference = new ImageReference(
    publisher: "MicrosoftWindowsServer",
    offer: "WindowsServer",
    sku: "2016-Datacenter-with-Containers",
    version: "latest");
  ```


## Container configuration for Batch pool

The Batch pool is the collection of compute nodes on which Batch executes tasks in a job. When you create the pool, you provide it with the VM configuration for the compute nodes. The [VirtualMachineConfiguration](/dotnet/api/microsoft.azure.batch.virtualmachineconfiguration) object contains a reference to the [ContainerConfiguration](/dotnet/api/microsoft.azure.batch.containerconfiguration) object. To enable container workloads on the pool, specify the `ContainerConfiguration` settings. The VM configuration is also where you specify the image reference and the image's node agent SKU ID, as shown in the following examples.

There are several options for pool creation. You can create a pool with or without prefetched container images. 

The pull (or prefetch) process lets you pre-load container images either from Docker Hub or another container registry on the Internet. The advantage of prefetching container images is that when tasks first start running they don't have to wait for the container image to download. The container configuration copies container images to the VMs when the pool is created. Tasks that run on the pool can then reference the list of container images and container run options.



### Pool without prefetched container images

To configure the pool without prefetched container images, use a `ContainerConfiguration` as shown in the following example. This example assumes that you are using a custom Ubuntu 16.04 LTS image with Docker Engine installed.

```csharp
// Specify container configuration
ContainerConfiguration containerConfig = new ContainerConfiguration(
    type: "Docker");

// VM configuration
VirtualMachineConfiguration virtualMachineConfiguration = new VirtualMachineConfiguration(
    imageReference: imageReference,
    containerConfiguration: containerConfig,
    nodeAgentSkuId: "batch.node.ubuntu 16.04");

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    targetDedicatedComputeNodes: 20,
    virtualMachineSize: "Standard_D3_v2",
    virtualMachineConfiguration: virtualMachineConfiguration);

// Commit pool creation
pool.Commit();
```

### Prefetch images for container configuration

To prefetch container images on the pool, add the list of container images (`containerImageNames`) to the container configuration, and give the image list a name. The following example assumes that you are using a custom Ubuntu 16.04 LTS image, prefetch a TensorFlow image from the [Google container registry](https://cloud.google.com/container-registry/), and start TensorFlow in a start task.

```csharp
// Specify container configuration, prefetching Docker images
ContainerConfiguration containerConfig = new ContainerConfiguration(
    type: "Docker",
    containerImageNames: new List<string> { "gcr.io/tensorflow/tensorflow:latest-gpu" } );

// VM configuration
VirtualMachineConfiguration virtualMachineConfiguration = new VirtualMachineConfiguration(
    imageReference: imageReference,
    containerConfiguration: containerConfig,
    nodeAgentSkuId: "batch.node.ubuntu 16.04");

// Set a native command line start task
StartTask startTaskNative = new StartTask( CommandLine: "<native-host-command-line>" );

// Define container settings
TaskContainerSettings startTaskContainerSettings = new TaskContainerSettings (
    imageName: "gcr.io/tensorflow/tensorflow:latest-gpu");
StartTask startTaskContainer = new StartTask(
    CommandLine: "<docker-image-command-line>",
    TaskContainerSettings: startTaskContainerSettings);

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    targetDedicatedComputeNodes: 20,
    virtualMachineSize: "Standard_H16r",
    virtualMachineConfiguration: virtualMachineConfiguration, startTaskContainer);

// Commit pool creation
pool.Commit();
```

Alternatively, if you wanted to use an image from an Azure container registry, you could prefetch the Microsoft Azure CLI Docker Image from the [Docker Hub](https://hub.docker.com/r/microsoft/azure-cli/) registry, and define the container settings as follows:

```csharp
// Define container settings
TaskContainerSettings startTaskContainerSettings = new TaskContainerSettings (
    imageName: "microsoft/cntk:2.1-gpu-python3.5-cuda8.0-cudnn6.0");
StartTask startTaskContainer = new StartTask(
    CommandLine: "<docker-image-command-line>",
    TaskContainerSettings: startTaskContainerSettings);
```


### Prefetch images from a private container registry

You can also prefetch container images by authenticating to a private container registry server. The following example assumes that you are using a custom Ubuntu 16.04 LTS image and are prefetching a private TensorFlow image from a private Azure container registry. Because the example TensorFlow image is the GPU version, the custom image should have the NVIDIA driver installed, and it should use NC instead of H16R SKU for RDMA (the standard Ubuntu image might not support RDMA).

```csharp
// Specify a container registry
ContainerRegistry containerRegistry = new ContainerRegistry (
	registryServer: <myContainerRegistry>.azurecr.io,
    username: <myUserName>, password: myPassword);

// Create container configuration, prefetching Docker images from the container registry
ContainerConfiguration containerConfig = new ContainerConfiguration(
    type: "Docker",
    containerImageNames: new List<string> {
        "<myContainerRegistry>.azurecr.io/tensorflow/tensorflow:latest-gpu" },
    containerRegistries: new List<ContainerRegistry> { containerRegistry } );

// VM configuration
VirtualMachineConfiguration virtualMachineConfiguration = new VirtualMachineConfiguration(
    imageReference: imageReference,
    containerConfiguration: containerConfig,
    nodeAgentSkuId: "batch.node.ubuntu 16.04");

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId, targetDedicatedComputeNodes: 20, virtualMachineSize: "Standard_D3_v2",
    virtualMachineConfiguration: virtualMachineConfiguration);

// Commit pool creation
pool.Commit();
```


## Container settings for the task

When you set up tasks to run on the compute nodes, you must specify container-specific settings such as task run options, images to use, and registry.

Use the ContainerSettings property of the task classes to configure container-specific settings. These settings are defined by the [TaskContainerSettings](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.taskcontainersettings) class.

If you run tasks on container images, the [cloud task](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudtask) and [job manager task](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudjob.jobmanagertask) require container settings. However, the [start task](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.starttask), [job preparation task]((https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudjob.jobpreparationtask)), and [job release task]((https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudjob.jobreleasetask)) do not require container settings (that is, they can run within a container context or directly on the node).

When you configure the container settings, all directories recursively below the `AZ_BATCH_NODE_ROOT_DIR` (the root of Azure Batch directories on the node) are mapped into the container, all task environment variables are mapped into the container, and the task command line is executed in the container.

The code example in [Prefetch images for container configuration](#prefetch-images-for-container-configuration) shows how you specify a container configuration for a cloud task and start task. The following code example shows how you specify container configuration for a cloud task:

```csharp
// Simple task command

string cmdLine = "<my-command-line>";

TaskContainerSettings cmdContainerSettings = new TaskContainerSettings (
    imageName: "gcr.io/tensorflow/tensorflow:latest-gpu",
    containerRunOptions: "-rm -read-only"
    );

CloudTask containerTask = new CloudTask (
    id: "Task1",
    containerSettings: cmdContainerSettings,
    commandLine: cmdLine); 
```


## Next steps

* For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).

* For more information on installing and using Docker CE on Linux, see the [Docker](https://docs.docker.com/engine/installation/) documentation.

* For more information on using custom images, see [Use a managed custom image to create a pool of virtual machines ](batch-custom-images.md).
