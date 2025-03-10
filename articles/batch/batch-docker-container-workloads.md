---
title: Container workloads on Azure Batch
description: Learn how to run and scale apps from container images on Azure Batch. Create a pool of compute nodes that support running container tasks.
ms.topic: how-to
ms.date: 06/10/2024
ms.devlang: csharp
ms.custom: devx-track-csharp, linux-related-content
---

# Use Azure Batch to run container workloads

Azure Batch lets you run and scale large numbers of batch computing jobs on Azure. Batch tasks can run directly on virtual machines (nodes) in a Batch pool, but you can also set up a Batch pool to run tasks in Docker-compatible containers on the nodes. This article shows you how to create a pool of compute nodes that support running container tasks, and then run container tasks on the pool.

The code examples here use the Batch .NET and Python SDKs. You can also use other Batch SDKs and tools, including the Azure portal, to create container-enabled Batch pools and to run container tasks.

## Why use containers?

Containers provide an easy way to run Batch tasks without having to manage an environment and dependencies to run applications. Containers deploy applications as lightweight, portable, self-sufficient units that can run in several different environments. For example, build and test a container locally, then upload the container image to a registry in Azure or elsewhere. The container deployment model ensures that the runtime environment of your application is always correctly installed and configured wherever you host the application. Container-based tasks in Batch can also take advantage of features of non-container tasks, including application packages and management of resource files and output files.

## Prerequisites

You should be familiar with container concepts and how to create a Batch pool and job.

- **SDK versions**: The Batch SDKs support container images as of the following versions:
  - Batch REST API version 2017-09-01.6.0
  - Batch .NET SDK version 8.0.0
  - Batch Python SDK version 4.0
  - Batch Java SDK version 3.0
  - Batch Node.js SDK version 3.0

- **Accounts**: In your Azure subscription, you need to create a [Batch account](accounts.md) and optionally an Azure Storage account.

- **A supported virtual machine (VM) image**: Containers are only supported in pools created with the Virtual Machine Configuration, from a supported image (listed in the next section). If you provide a custom image, see the considerations in the following section and the requirements in [Use a managed image to create a custom image pool](batch-custom-images.md).

> [!NOTE]
> From Batch SDK versions:
> - Batch .NET SDK version 16.0.0
> - Batch Python SDK version 14.0.0
> - Batch Java SDK version 11.0.0
> - Batch Node.js SDK version 11.0.0

Currently, the `containerConfiguration` requires `Type` property to be passed and the supported values are: `ContainerType.DockerCompatible` and `ContainerType.CriCompatible`.

Keep in mind the following limitations:

- Batch provides remote direct memory access (RDMA) support only for containers that run on Linux pools.
- For Windows container workloads, you should choose a multicore VM size for your pool.

> [!IMPORTANT]
> Docker, by default, creates a network bridge with a subnet specification of `172.17.0.0/16`. If you are specifying a
> [virtual network](batch-virtual-network.md) for your pool, ensure that there are no conflicting IP ranges.

## Supported VM images

Use one of the following supported Windows or Linux images to create a pool of VM compute nodes for container workloads. For more information about Marketplace images that are compatible with Batch, see [List of virtual machine images](batch-linux-nodes.md#list-of-virtual-machine-images).

### Windows support

Batch supports Windows server images that have container support designations.
[The API to list all supported images in Batch](batch-linux-nodes.md#list-of-virtual-machine-images) denotes
a `DockerCompatible` capability if the image supports Docker containers. Batch allows, but doesn't directly
support, images published by Mirantis with capability noted as `DockerCompatible`. These images may only be
deployed under a User Subscription pool allocation mode Batch account.

You can also create a [custom image](batch-sig-images.md) to enable container functionality on Windows.

> [!NOTE]
> The image SKUs `-with-containers` or `-with-containers-smalldisk` are retired. Please see the [announcement](https://techcommunity.microsoft.com/t5/containers/updates-to-the-windows-container-runtime-support/ba-p/2788799) for details and alternative container runtime options.

### Linux support

For Linux container workloads, Batch currently supports the following Linux images published in the Azure Marketplace
without the need for a custom image.

- Publisher: `microsoft-dsvm`
  - Offer: `ubuntu-hpc`
- Publisher: `almalinux`
  - Offer: `8-hpc-gen1`
  - Offer: `8-hpc-gen2`

#### Alternate image options

Currently there are other images published by `microsoft-azure-batch` that support container workloads:

- Publisher: `microsoft-azure-batch`
  - Offer: `ubuntu-server-container`
  - Offer: `ubuntu-server-container-rdma` (For use exclusively on VM SKUs with Infiniband)

> [!WARNING]
> It is recommended to use images other than those published by `microsoft-azure-batch` as these
> images are deprecated due to imminent image end-of-life.

#### Notes
  The docker data root of the above images lies in different places:
  - For the HPC image, or `microsoft-dsvm` (Offer: `ubuntu-hpc`, etc.), the docker data root is unchanged from the Docker default, which is _/var/lib/docker_ on Linux and _C:\ProgramData\Docker_ on Windows. These folders are located on the OS disk.

  For non-Batch published images, the OS disk has the potential risk of being filled up quickly as container images are downloaded.

#### Potential solutions for customers

Change the docker data root in a start task when creating a pool in BatchExplorer. Here's an example of the Start Task command:
```csharp
1)  sudo systemctl stop docker
2)  sudo vi /lib/systemd/system/docker.service
    +++
    FROM:
    ExecStart=/usr/bin/docker daemon -H fd://
    TO:
    ExecStart=/usr/bin/docker daemon -g /new/path/docker -H fd://
    +++
3)  sudo systemctl daemon-reload
4)  sudo systemctl start docker
```

These images are only supported for use in Azure Batch pools and are geared for Docker container execution. They feature:

- A pre-installed Docker-compatible [Moby container runtime](https://github.com/moby/moby).
- Pre-installed NVIDIA GPU drivers and NVIDIA container runtime, to streamline deployment on Azure N-series VMs.
- VM images with the suffix of `-rdma` are pre-configured with support for InfiniBand RDMA VM sizes. These VM images shouldn't be used with VM sizes that don't have InfiniBand support.

You can also create [custom images](batch-sig-images.md) compatible for Batch containers on one of the Linux distributions
that's compatible with Batch. For Docker support on a custom image, install a suitable Docker-compatible runtime, such as
a version of [Docker](https://www.docker.com) or
[Mirantis Container Runtime](https://www.mirantis.com/software/mirantis-container-runtime/). Installing just
a Docker-CLI compatible tool is insufficient; a Docker Engine compatible runtime is required.

> [!IMPORTANT]
> Neither Microsoft or Azure Batch will provide support for issues related to Docker (any version or edition),
> Mirantis Container Runtime, or Moby runtimes. Customers electing to use these runtimes in their images should reach
> out to the company or entity providing support for runtime issues.

More considerations for using a custom Linux image:

- To take advantage of the GPU performance of Azure N-series sizes when using a custom image, pre-install NVIDIA drivers. Also, you need to install the Docker Engine Utility for NVIDIA GPUs, [NVIDIA Docker](https://github.com/NVIDIA/nvidia-docker).
- To access the Azure RDMA network, use an RDMA-capable VM size. Necessary RDMA drivers are installed in the CentOS HPC and Ubuntu images supported by Batch. Extra configuration may be needed to run MPI workloads. See [Use RDMA or GPU instances in Batch pool](batch-pool-compute-intensive-sizes.md).

## Container configuration for Batch pool

To enable a Batch pool to run container workloads, you must specify [ContainerConfiguration](/dotnet/api/microsoft.azure.batch.containerconfiguration) settings in the pool's [VirtualMachineConfiguration](/dotnet/api/microsoft.azure.batch.virtualmachineconfiguration) object. This article provides links to the Batch .NET API reference. Corresponding settings are in the [Batch Python](/python/api/overview/azure/batch) API.

You can create a container-enabled pool with or without prefetched container images, as shown in the following examples. The pull (or prefetch) process lets you preload container images from either Docker Hub or another container registry on the Internet. For best performance, use an [Azure container registry](/azure/container-registry/container-registry-intro) in the same region as the Batch account.

The advantage of prefetching container images is that when tasks first start running, they don't have to wait for the container image to download. The container configuration pulls container images to the VMs when the pool is created. Tasks that run on the pool can then reference the list of container images and container run options.

> [!NOTE]
> Docker Hub limits the number of image pulls. Ensure that your workload doesn't
> [exceed published rate limits](https://docs.docker.com/docker-hub/download-rate-limit/) for Docker
> Hub-based images. It's recommended to use
> [Azure Container Registry](/azure/container-registry/container-registry-intro) directly or leverage
> [Artifact cache in ACR](/azure/container-registry/container-registry-artifact-cache).

### Pool without prefetched container images

To configure a container-enabled pool without prefetched container images, define `ContainerConfiguration` and `VirtualMachineConfiguration` objects as shown in the following examples. These examples use the Ubuntu Server for Azure Batch container pools image from the Marketplace.

**Note**: Ubuntu server version used in the example is for illustration purposes. Feel free to change the *node_agent_sku_id* to the version you're using.

```python
image_ref_to_use = batch.models.ImageReference(
    publisher='microsoft-dsvm',
    offer='ubuntu-hpc',
    sku='2204',
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
        node_agent_sku_id='batch.node.ubuntu 22.04'),
    vm_size='STANDARD_D2S_V3',
    target_dedicated_nodes=1)
...
```

```csharp
ImageReference imageReference = new ImageReference(
    publisher: "microsoft-dsvm",
    offer: "ubuntu-hpc",
    sku: "2204",
    version: "latest");

// Specify container configuration. This is required even though there are no prefetched images.
ContainerConfiguration containerConfig = new ContainerConfiguration();

// VM configuration
VirtualMachineConfiguration virtualMachineConfiguration = new VirtualMachineConfiguration(
    imageReference: imageReference,
    nodeAgentSkuId: "batch.node.ubuntu 22.04");
virtualMachineConfiguration.ContainerConfiguration = containerConfig;

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    targetDedicatedComputeNodes: 1,
    virtualMachineSize: "STANDARD_D2S_V3",
    virtualMachineConfiguration: virtualMachineConfiguration);
```

### Prefetch images for container configuration

To prefetch container images on the pool, add the list of container images (`container_image_names` in Python) to the `ContainerConfiguration`.

The following basic Python example shows how to prefetch a standard Ubuntu container image from [Docker Hub](https://hub.docker.com).

```python
image_ref_to_use = batch.models.ImageReference(
    publisher='microsoft-dsvm',
    offer='ubuntu-hpc',
    sku='2204',
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
        node_agent_sku_id='batch.node.ubuntu 22.04'),
    vm_size='STANDARD_D2S_V3',
    target_dedicated_nodes=1)
...
```

The following C# example assumes that you want to prefetch a TensorFlow image from [Docker Hub](https://hub.docker.com). This example includes a start task that runs in the VM host on the pool nodes. You might run a start task in the host, for example, to mount a file server that can be accessed from the containers.

```csharp
ImageReference imageReference = new ImageReference(
    publisher: "microsoft-dsvm",
    offer: "ubuntu-hpc",
    sku: "2204",
    version: "latest");

ContainerRegistry containerRegistry = new ContainerRegistry(
    registryServer: "https://hub.docker.com",
    identityReference: new ComputeNodeIdentityReference() { ResourceId = "/subscriptions/SUB/resourceGroups/RG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity-name" }
);

// Specify container configuration, prefetching Docker images
ContainerConfiguration containerConfig = new ContainerConfiguration();
containerConfig.ContainerImageNames = new List<string> { "tensorflow/tensorflow:latest-gpu" };
containerConfig.ContainerRegistries = new List<ContainerRegistry> { containerRegistry };

// VM configuration
VirtualMachineConfiguration virtualMachineConfiguration = new VirtualMachineConfiguration(
    imageReference: imageReference,
    nodeAgentSkuId: "batch.node.ubuntu 22.04");
virtualMachineConfiguration.ContainerConfiguration = containerConfig;

// Set a native host command line start task
StartTask startTaskContainer = new StartTask( commandLine: "<native-host-command-line>" );

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    virtualMachineSize: "Standard_NC6S_V3",
    virtualMachineConfiguration: virtualMachineConfiguration);

// Start the task in the pool
pool.StartTask = startTaskContainer;
...
```

### Prefetch images from a private container registry

You can also prefetch container images by authenticating to a private container registry server. In the following examples, the `ContainerConfiguration` and `VirtualMachineConfiguration` objects prefetch a private TensorFlow image from a private Azure container registry. The image reference is the same as in the previous example.

```python
image_ref_to_use = batch.models.ImageReference(
    publisher='microsoft-dsvm',
    offer='ubuntu-hpc',
    sku='2204',
    version='latest')

# Specify a container registry
subscription_id = "yyyy-yyy-yyy-yyy-yyy"
resource_group_name = "TestRG"
user_assigned_identity_name = "testUMI"
resource_id = f"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{user_assigned_identity_name}"

container_registry = batch.models.ContainerRegistry(
        registry_server="myRegistry.azurecr.io",
        identity_reference = ComputeNodeIdentityReference(resource_id = resource_id))

# Create container configuration, prefetching Docker images from the container registry
container_conf = batch.models.ContainerConfiguration(
        container_image_names = ["myRegistry.azurecr.io/samples/myImage"],
        container_registries =[container_registry])

new_pool = batch.models.PoolAddParameter(
            id="myPool",
            virtual_machine_configuration=batch.models.VirtualMachineConfiguration(
                image_reference=image_ref_to_use,
                container_configuration=container_conf,
                node_agent_sku_id='batch.node.ubuntu 22.04'),
            vm_size='STANDARD_D2S_V3',
            target_dedicated_nodes=1)
```

```csharp
// Specify a container registry
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
    nodeAgentSkuId: "batch.node.ubuntu 22.04");
virtualMachineConfiguration.ContainerConfiguration = containerConfig;

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    targetDedicatedComputeNodes: 2,
    virtualMachineSize: "Standard_NC6S_V3",
    virtualMachineConfiguration: virtualMachineConfiguration);
...
```

### Managed identity support for ACR

When you access containers stored in [Azure Container Registry](https://azure.microsoft.com/services/container-registry),
a managed identity can be used to authenticate with the service. To use a managed identity,
first ensure that the identity has been [assigned to the pool](managed-identity-pools.md) and that the identity has the
`AcrPull` role assigned for the container registry you wish to access. Then, instruct Batch with which identity to use
when authenticating with ACR.

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
    nodeAgentSkuId: "batch.node.ubuntu 22.04");
virtualMachineConfiguration.ContainerConfiguration = containerConfig;

// Create pool
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    targetDedicatedComputeNodes: 2,
    virtualMachineSize: "Standard_NC6S_V3",
    virtualMachineConfiguration: virtualMachineConfiguration);
...
```

## Container settings for the task

To run a container task on a container-enabled pool, specify container-specific settings. Settings include the image to use, registry, and container run options.

- Use the `ContainerSettings` property of the task classes to configure container-specific settings. These settings are defined by the [TaskContainerSettings](/dotnet/api/microsoft.azure.batch.taskcontainersettings) class. The `--rm` container option doesn't require another `--runtime` option since it's taken care of by Batch.

- If you run tasks on container images, the [cloud task](/dotnet/api/microsoft.azure.batch.cloudtask) and [job manager task](/dotnet/api/microsoft.azure.batch.cloudjob.jobmanagertask) require container settings. However, the [start task](/dotnet/api/microsoft.azure.batch.starttask), [job preparation task](/dotnet/api/microsoft.azure.batch.cloudjob.jobpreparationtask), and [job release task](/dotnet/api/microsoft.azure.batch.cloudjob.jobreleasetask) don't require container settings (that is, they can run within a container context or directly on the node).

- For Linux, Batch maps the user/group permission to the container. If access to any folder within the container requires Administrator permission, you may need to run the task as pool scope with admin elevation level. This ensures that Batch runs the task as root in the container context. Otherwise, a non-admin user might not have access to those folders.

- For container pools with GPU-enabled hardware, Batch automatically enables GPU for container tasks, so you shouldn't include the `–gpus` argument.

### Container task command line

When you run a container task, Batch automatically uses the [docker create](https://docs.docker.com/engine/reference/commandline/create/) command to create a container using the image specified in the task. Batch then controls task execution in the container.

As with non-container Batch tasks, you set a command line for a container task. Because Batch automatically creates the container, the command line only specifies the command or commands that run in the container.

The following are the default behaviors Batch applies to Docker container tasks:

- Batch will run the container with the specified task commandline as the [CMD](https://docs.docker.com/reference/dockerfile/#cmd).
- Batch won't interfere with the specified [ENTRYPOINT](https://docs.docker.com/reference/dockerfile/#entrypoint) of the container image.
- Batch will override the [WORKDIR](https://docs.docker.com/reference/dockerfile/#workdir) with the [Batch task working directory](batch-compute-node-environment-variables.md).

Ensure that you review the Docker documentation between ENTRYPOINT and CMD so you understand the
interaction effects that can arise when container images have a specified ENTRYPOINT and you also
specify a task commandline.

If you would like to override the container image ENTRYPOINT, you can specify the `--entrypoint <args>`
argument as a containerRunOption. Refer to the optional [ContainerRunOptions](/dotnet/api/microsoft.azure.batch.taskcontainersettings.containerrunoptions)
for arguments that you can provide to the `docker create` command that Batch uses to create and run the
container. For example, to set a working directory for the container, set the `--workdir <directory>`
option.

The following are some examples of container image and Batch container options or task command lines
and their effect:

- Container image ENTRYPOINT isn't specified, and Batch task commandline is "/bin/sh -c python myscript.py".
  - Batch creates the container with the Batch task commandline as specified and runs it in the Batch
    task working directory. This may result in failure if "myscript.py" isn't in the Batch task working
    directory.
  - If the task commandline was specified as "/bin/sh -c python /path/to/script/myscript.py", then this task may
    work correctly even with the working directory set as the Batch task working directory if all dependencies
    for the script are satisfied.
- Container image ENTRYPOINT is specified as "./myscript.sh", and Batch task commandline is empty.
  - Batch creates the container relying on the ENTRYPOINT and runs it in the Batch task working directory. This
    task may result in failure if the container image WORKDIR isn't the same as the Batch task working
    directory, which is dependent upon various factors such as the operating system, job ID, task ID, etc.
  - If "--workdir /path/to/script" was specified as a containerRunOption, then this task may work correctly if
    all dependencies for the script are satisfied.
- Container image ENTRYPOINT isn't specified, Batch task commandline is "./myscript.sh", and WORKDIR is overridden in ContainerRunOptions as "--workdir /path/to/script".
  - Batch creates the container with the working directory to "/path/to/script" and execute the
    commandline "./myscript.sh", which is successful as the script is found in the specified working directory.

### Container task working directory

A Batch container task executes in a working directory in the container that's similar to the directory that Batch sets up for a regular (non-container) task. This working directory is different from the [WORKDIR](https://docs.docker.com/engine/reference/builder/#workdir) if configured in the image, or the default container working directory (`C:\`  on a Windows container, or `/` on a Linux container).

For a Batch container task:

- All directories recursively below the `AZ_BATCH_NODE_ROOT_DIR` on the host node (the root of Azure Batch directories) are mapped into the container.
- All task environment variables are mapped into the container.
- The task working directory `AZ_BATCH_TASK_WORKING_DIR` on the node is set the same as for a regular task and mapped into the container.

> [!IMPORTANT]
> For Windows container pools on VM families with ephemeral disks, the entire ephemeral disk is mapped to container space
> due to Windows container limitations.

These mappings allow you to work with container tasks in much the same way as non-container tasks. For example, install applications using application packages, access resource files from Azure Storage, use task environment settings, and persist task output files after the container stops.

Regardless of how the WORKDIR is set for a container image, both `stdout.txt` and `stderr.txt`
are captured into the `AZ_BATCH_TASK_DIR`.

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

- For information on installing and using Docker CE on Linux, see the [Docker documentation](https://docs.docker.com/engine/installation).
- Learn how to [Use a managed image to create a custom image pool](batch-custom-images.md).
- Learn more about the [Moby project](https://mobyproject.org), a framework for creating container-based systems.
