---
title: Container workloads
description: Learn how to run and scale apps from container images on Azure Batch. Create a pool of compute nodes that support running container tasks.
ms.topic: how-to
ms.date: 08/18/2021
ms.devlang: csharp, python
ms.custom: "seodec18, devx-track-csharp"
---
# Run container applications on Azure Batch

Azure Batch lets you run and scale large numbers of batch computing jobs on Azure. Batch tasks can run directly on virtual machines (nodes) in a Batch pool, but you can also set up a Batch pool to run tasks in Docker-compatible containers on the nodes. This article shows you how to create a pool of compute nodes that support running container tasks, and then run container tasks on the pool.

The code examples here use the Batch .NET and Python SDKs. You can also use other Batch SDKs and tools, including the Azure portal, to create container-enabled Batch pools and to run container tasks.

## Why use containers?

Using containers provides an easy way to run Batch tasks without having to manage an environment and dependencies to run applications. Containers deploy applications as lightweight, portable, self-sufficient units that can run in several different environments. For example, build and test a container locally, then upload the container image to a registry in Azure or elsewhere. The container deployment model ensures that the runtime environment of your application is always correctly installed and configured wherever you host the application. Container-based tasks in Batch can also take advantage of features of non-container tasks, including application packages and management of resource files and output files.

## Prerequisites

You should be familiar with container concepts and how to create a Batch pool and job.

- **SDK versions**: The Batch SDKs support container images as of the following versions:
  - Batch REST API version 2017-09-01.6.0
  - Batch .NET SDK version 8.0.0
  - Batch Python SDK version 4.0
  - Batch Java SDK version 3.0
  - Batch Node.js SDK version 3.0

- **Accounts**: In your Azure subscription, you need to create a [Batch account](accounts.md) and optionally an Azure Storage account.

- **A supported VM image**: Containers are only supported in pools created with the Virtual Machine Configuration, from a supported image (listed in the next section). If you provide a custom image, see the considerations in the following section and the requirements in [Use a managed custom image to create a pool of virtual machines](batch-custom-images.md).

Keep in mind the following limitations:

- Batch provides RDMA support only for containers running on Linux pools.
- For Windows container workloads, we recommend choosing a multicore VM size for your pool.

## Supported virtual machine images

Use one of the following supported Windows or Linux images to create a pool of VM compute nodes for container workloads. For more information about Marketplace images that are compatible with Batch, see [List of virtual machine images](batch-linux-nodes.md#list-of-virtual-machine-images).

### Windows support

Batch supports Windows server images that have container support designations. Typically these image sku names are suffixed with `-with-containers` or `-with-containers-smalldisk`. Additionally, [the API to list all supported images in Batch](batch-linux-nodes.md#list-of-virtual-machine-images) will denote a `DockerCompatible` capability if the image supports Docker containers.

You can also create custom images from VMs running Docker on Windows.

### Linux support

For Linux container workloads, Batch currently supports the following Linux images published by Microsoft Azure Batch in the Azure Marketplace without the need for a custom image.

#### VM sizes without RDMA

- Publisher: `microsoft-azure-batch`
  - Offer: `centos-container`
  - Offer: `ubuntu-server-container`

#### VM sizes with RDMA

- Publisher: `microsoft-azure-batch`
  - Offer: `centos-container-rdma`
  - Offer: `ubuntu-server-container-rdma`

These images are only supported for use in Azure Batch pools and are geared for Docker container execution. They feature:

- A pre-installed Docker-compatible [Moby](https://github.com/moby/moby) container runtime
- Pre-installed NVIDIA GPU drivers and NVIDIA container runtime, to streamline deployment on Azure N-series VMs
- VM images with the suffix of '-rdma' are pre-configured with support for InfiniBand RDMA VM sizes. These VM images should not be used with VM sizes that do not have InfiniBand support.

You can also create custom images from VMs running Docker on one of the Linux distributions that is compatible with Batch. If you choose to provide your own custom Linux image, see the instructions in [Use a managed custom image to create a pool of virtual machines](batch-custom-images.md).

For Docker support on a custom image, install [Docker Community Edition (CE)](https://www.docker.com/community-edition) or [Docker Enterprise Edition (EE)](https://docker-docs.netlify.app/ee/).

Additional considerations for using a custom Linux image:

- To take advantage of the GPU performance of Azure N-series sizes when using a custom image, pre-install NVIDIA drivers. Also, you need to install the Docker Engine Utility for NVIDIA GPUs, [NVIDIA Docker](https://github.com/NVIDIA/nvidia-docker).
- To access the Azure RDMA network, use an RDMA-capable VM size. Necessary RDMA drivers are installed in the CentOS HPC and Ubuntu images supported by Batch. Additional configuration may be needed to run MPI workloads. See [Use RDMA-capable or GPU-enabled instances in Batch pool](batch-pool-compute-intensive-sizes.md).

## Container configuration for Batch pool

To enable a Batch pool to run container workloads, you must specify [ContainerConfiguration](/dotnet/api/microsoft.azure.batch.containerconfiguration) settings in the pool's [VirtualMachineConfiguration](/dotnet/api/microsoft.azure.batch.virtualmachineconfiguration) object. (This article provides links to the Batch .NET API reference. Corresponding settings are in the [Batch Python](/python/api/overview/azure/batch) API.)

You can create a container-enabled pool with or without prefetched container images, as shown in the following examples. The pull (or prefetch) process lets you pre-load container images from either Docker Hub or another container registry on the Internet. For best performance, use an [Azure container registry](../container-registry/container-registry-intro.md) in the same region as the Batch account.

The advantage of prefetching container images is that when tasks first start running they don't have to wait for the container image to download. The container configuration pulls container images to the VMs when the pool is created. Tasks that run on the pool can then reference the list of container images and container run options.

### Pool without prefetched container images

To configure a container-enabled pool without prefetched container images, define `ContainerConfiguration` and `VirtualMachineConfiguration` objects as shown in the following examples. These examples use the Ubuntu Server for Azure Batch container pools image from the Marketplace.

**Note**: Ubuntu server version used in the example is for illustration purposes. Feel free to change the node_agent_sku_id to the version you are using.

```python
image_ref_to_use = batch.models.ImageReference(
    publisher='microsoft-azure-batch',
    offer='ubuntu-server-container',
    sku='16-04-lts',
    version='latest')

"""
Specify container configuration. This is required even though there are no prefetched images.
"""

container_conf = batch.models.ContainerConfiguration()

new_pool = batch.models.PoolAddParameter(
    id=pool_id,
    virtual_machine_configuration=batch.models.VirtualMachineConfiguration(
        image_reference=image_ref_to_use,
        container_configuration=container_conf,
        node_agent_sku_id='batch.node.ubuntu 16.04'),
    vm_size='STANDARD_D1_V2',
    target_dedicated_nodes=1)
...
```

```csharp
ImageReference imageReference = new ImageReference(
    publisher: "microsoft-azure-batch",
    offer: "ubuntu-server-container",
    sku: "16-04-lts",
    version: "latest");

// Specify container configuration. This is required even though there are no prefetched images.
ContainerConfiguration containerConfig = new ContainerConfiguration();

// VM configuration
VirtualMachineConfiguration virtualMachineConfiguration = new VirtualMachineConfiguration(
    imageReference: imageReference,
    nodeAgentSkuId: "batch.node.ubuntu 16.04");
virtualMachineConfiguration.ContainerConfiguration = containerConfig;

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    targetDedicatedComputeNodes: 1,
    virtualMachineSize: "STANDARD_D1_V2",
    virtualMachineConfiguration: virtualMachineConfiguration);
```

### Prefetch images for container configuration

To prefetch container images on the pool, add the list of container images (`container_image_names`, in Python) to the `ContainerConfiguration`.

The following basic Python example shows how to prefetch a standard Ubuntu container image from [Docker Hub](https://hub.docker.com).

```python
image_ref_to_use = batch.models.ImageReference(
    publisher='microsoft-azure-batch',
    offer='ubuntu-server-container',
    sku='16-04-lts',
    version='latest')

"""
Specify container configuration, fetching the official Ubuntu container image from Docker Hub.
"""

container_conf = batch.models.ContainerConfiguration(
    container_image_names=['ubuntu'])

new_pool = batch.models.PoolAddParameter(
    id=pool_id,
    virtual_machine_configuration=batch.models.VirtualMachineConfiguration(
        image_reference=image_ref_to_use,
        container_configuration=container_conf,
        node_agent_sku_id='batch.node.ubuntu 16.04'),
    vm_size='STANDARD_D1_V2',
    target_dedicated_nodes=1)
...
```

The following C# example assumes that you want to prefetch a TensorFlow image from [Docker Hub](https://hub.docker.com). This example includes a start task that runs in the VM host on the pool nodes. You might run a start task in the host, for example, to mount a file server that can be accessed from the containers.

```csharp
ImageReference imageReference = new ImageReference(
    publisher: "microsoft-azure-batch",
    offer: "ubuntu-server-container",
    sku: "16-04-lts",
    version: "latest");

ContainerRegistry containerRegistry = new ContainerRegistry(
    registryServer: "https://hub.docker.com",
    userName: "UserName",
    password: "YourPassword"                
);

// Specify container configuration, prefetching Docker images
ContainerConfiguration containerConfig = new ContainerConfiguration();
containerConfig.ContainerImageNames = new List<string> { "tensorflow/tensorflow:latest-gpu" };
containerConfig.ContainerRegistries = new List<ContainerRegistry> { containerRegistry };

// VM configuration
VirtualMachineConfiguration virtualMachineConfiguration = new VirtualMachineConfiguration(
    imageReference: imageReference,
    nodeAgentSkuId: "batch.node.ubuntu 16.04");
virtualMachineConfiguration.ContainerConfiguration = containerConfig;

// Set a native host command line start task
StartTask startTaskContainer = new StartTask( commandLine: "<native-host-command-line>" );

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    virtualMachineSize: "Standard_NC6",
    virtualMachineConfiguration: virtualMachineConfiguration);

// Start the task in the pool
pool.StartTask = startTaskContainer;
...
```

### Prefetch images from a private container registry

You can also prefetch container images by authenticating to a private container registry server. In the following examples, the `ContainerConfiguration` and `VirtualMachineConfiguration` objects prefetch a private TensorFlow image from a private Azure container registry. The image reference is the same as in the previous example.

```python
image_ref_to_use = batch.models.ImageReference(
        publisher='microsoft-azure-batch',
        offer='ubuntu-server-container',
        sku='16-04-lts',
        version='latest')

# Specify a container registry
container_registry = batch.models.ContainerRegistry(
        registry_server="myRegistry.azurecr.io",
        user_name="myUsername",
        password="myPassword")

# Create container configuration, prefetching Docker images from the container registry
container_conf = batch.models.ContainerConfiguration(
        container_image_names = ["myRegistry.azurecr.io/samples/myImage"],
        container_registries =[container_registry])

new_pool = batch.models.PoolAddParameter(
            id="myPool",
            virtual_machine_configuration=batch.models.VirtualMachineConfiguration(
                image_reference=image_ref_to_use,
                container_configuration=container_conf,
                node_agent_sku_id='batch.node.ubuntu 16.04'),
            vm_size='STANDARD_D1_V2',
            target_dedicated_nodes=1)
```

```csharp
// Specify a container registry
ContainerRegistry containerRegistry = new ContainerRegistry(
    registryServer: "myContainerRegistry.azurecr.io",
    userName: "myUserName",
    password: "myPassword");

// Create container configuration, prefetching Docker images from the container registry
ContainerConfiguration containerConfig = new ContainerConfiguration();
containerConfig.ContainerImageNames = new List<string> {
        "myContainerRegistry.azurecr.io/tensorflow/tensorflow:latest-gpu" };
containerConfig.ContainerRegistries = new List<ContainerRegistry> { containerRegistry } );

// VM configuration
VirtualMachineConfiguration virtualMachineConfiguration = new VirtualMachineConfiguration(
    imageReference: imageReference,
    nodeAgentSkuId: "batch.node.ubuntu 16.04");
virtualMachineConfiguration.ContainerConfiguration = containerConfig;

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    targetDedicatedComputeNodes: 4,
    virtualMachineSize: "Standard_NC6",
    virtualMachineConfiguration: virtualMachineConfiguration);
...
```

### Managed identity support for ACR

When accessing containers stored in [Azure Container Registry](https://azure.microsoft.com/services/container-registry), either a username/password or a managed identity can be used to authenticate with the service. To use a managed identity, first ensure that the identity has been [assigned to the pool](managed-identity-pools.md) and that the identity has the `AcrPull` role assigned for the container registry you wish to access. Then, simply tell Batch which identity to use when authenticating with ACR.

```csharp
ContainerRegistry containerRegistry = new ContainerRegistry(
    registryServer: "myContainerRegistry.azurecr.io",
    identityReference: new ComputeNodeIdentityReference() { ResourceId = "/subscriptions/SUB/resourceGroups/RG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity-name" }
);

// Create container configuration, prefetching Docker images from the container registry
ContainerConfiguration containerConfig = new ContainerConfiguration();
containerConfig.ContainerImageNames = new List<string> {
        "myContainerRegistry.azurecr.io/tensorflow/tensorflow:latest-gpu" };
containerConfig.ContainerRegistries = new List<ContainerRegistry> { containerRegistry } );

// VM configuration
VirtualMachineConfiguration virtualMachineConfiguration = new VirtualMachineConfiguration(
    imageReference: imageReference,
    nodeAgentSkuId: "batch.node.ubuntu 16.04");
virtualMachineConfiguration.ContainerConfiguration = containerConfig;

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    targetDedicatedComputeNodes: 4,
    virtualMachineSize: "Standard_NC6",
    virtualMachineConfiguration: virtualMachineConfiguration);
...
```

## Container settings for the task

To run a container task on a container-enabled pool, specify container-specific settings. Settings include the image to use, registry, and container run options.

- Use the `ContainerSettings` property of the task classes to configure container-specific settings. These settings are defined by the [TaskContainerSettings](/dotnet/api/microsoft.azure.batch.taskcontainersettings) class. Note that the `--rm` container option doesn't require an additional `--runtime` option since it is taken care of by Batch.

- If you run tasks on container images, the [cloud task](/dotnet/api/microsoft.azure.batch.cloudtask) and [job manager task](/dotnet/api/microsoft.azure.batch.cloudjob.jobmanagertask) require container settings. However, the [start task](/dotnet/api/microsoft.azure.batch.starttask), [job preparation task](/dotnet/api/microsoft.azure.batch.cloudjob.jobpreparationtask), and [job release task](/dotnet/api/microsoft.azure.batch.cloudjob.jobreleasetask) do not require container settings (that is, they can run within a container context or directly on the node).

- For Windows, tasks must be run with [ElevationLevel](/rest/api/batchservice/task/add#elevationlevel) set to `admin`.

- For Linux, Batch will map the user/group permission to the container. If access to any folder within the container requires Administrator permission, you may need to run the task as pool scope with admin elevation level. This will ensure Batch runs the task as root in the container context. Otherwise, a non-admin user may not have access to those folders.

- For container pools with GPU-enabled hardware, Batch will automatically enable GPU for container tasks, so you shouldn't include the `–gpus` argument.

### Container task command line

When you run a container task, Batch automatically uses the [docker create](https://docs.docker.com/engine/reference/commandline/create/) command to create a container using the image specified in the task. Batch then controls task execution in the container.

As with non-container Batch tasks, you set a command line for a container task. Because Batch automatically creates the container, the command line only specifies the command or commands that will run in the container.

If the container image for a Batch task is configured with an [ENTRYPOINT](https://docs.docker.com/engine/reference/builder/#exec-form-entrypoint-example) script, you can set your command line to either use the default ENTRYPOINT or override it:

- To use the default ENTRYPOINT of the container image, set the task command line to the empty string `""`.

- To override the default ENTRYPOINT, or if the image doesn't have an ENTRYPOINT, set a command line appropriate for the container, for example, `/app/myapp` or `/bin/sh -c python myscript.py`.

Optional [ContainerRunOptions](/dotnet/api/microsoft.azure.batch.taskcontainersettings.containerrunoptions) are additional arguments you provide to the `docker create` command that Batch uses to create and run the container. For example, to set a working directory for the container, set the `--workdir <directory>` option. See the [docker create](https://docs.docker.com/engine/reference/commandline/create/) reference for additional options.

### Container task working directory

A Batch container task executes in a working directory in the container that is very similar to the directory Batch sets up for a regular (non-container) task. Note that this working directory is different from the [WORKDIR](https://docs.docker.com/engine/reference/builder/#workdir) if configured in the image, or the default container working directory (`C:\`  on a Windows container, or `/` on a Linux container).

For a Batch container task:

- All directories recursively below the `AZ_BATCH_NODE_ROOT_DIR` on the host node (the root of Azure Batch directories) are mapped into the container
- All task environment variables are mapped into the container
- The task working directory `AZ_BATCH_TASK_WORKING_DIR` on the node is set the same as for a regular task and mapped into the container.

These mappings allow you to work with container tasks in much the same way as non-container tasks. For example, install applications using application packages, access resource files from Azure Storage, use task environment settings, and persist task output files after the container stops.

### Troubleshoot container tasks

If your container task doesn't run as expected, you might need to get information about the WORKDIR or ENTRYPOINT configuration of the container image. To see the configuration, run the [docker image inspect](https://docs.docker.com/engine/reference/commandline/image_inspect/) command.

If needed, adjust the settings of the container task based on the image:

- Specify an absolute path in the task command line. If the image's default ENTRYPOINT is used for the task command line, ensure that an absolute path is set.
- In the task's container run options, change the working directory to match the WORKDIR in the image. For example, set `--workdir /app`.

## Container task examples

The following Python snippet shows a basic command line running in a container created from a fictitious image pulled from Docker Hub. Here, the `--rm` container option removes the container after the task finishes, and the `--workdir` option sets a working directory. The command line overrides the container ENTRYPOINT with a simple shell command that writes a small file to the task working directory on the host.

```python
task_id = 'sampletask'
task_container_settings = batch.models.TaskContainerSettings(
    image_name='myimage',
    container_run_options='--rm --workdir /')
task = batch.models.TaskAddParameter(
    id=task_id,
    command_line='/bin/sh -c \"echo \'hello world\' > $AZ_BATCH_TASK_WORKING_DIR/output.txt\"',
    container_settings=task_container_settings
)
```

The following C# example shows basic container settings for a cloud task:

```csharp
// Simple container task command
string cmdLine = "c:\\app\\myApp.exe";

TaskContainerSettings cmdContainerSettings = new TaskContainerSettings (
    imageName: "myimage",
    containerRunOptions: "--rm --workdir c:\\app"
    );

CloudTask containerTask = new CloudTask (
    id: "Task1",
    commandline: cmdLine);
containerTask.ContainerSettings = cmdContainerSettings;
```

## Next steps

- For easy deployment of container workloads on Azure Batch through [Shipyard recipes](https://github.com/Azure/batch-shipyard/tree/master/recipes), see the [Batch Shipyard](https://github.com/Azure/batch-shipyard) toolkit.
- For information on installing and using Docker CE on Linux, see the [Docker](https://docs.docker.com/engine/installation/) documentation.
- Learn how to [Use a managed custom image to create a pool of virtual machines](batch-custom-images.md).
- Learn more about the [Moby project](https://mobyproject.org/), a framework for creating container-based systems.
