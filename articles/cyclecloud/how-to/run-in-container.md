---
title: Run CycleCloud in a Container Instance
description: Know how to run Azure CycleCloud in a container instance, which is useful for intermittent CycleCloud users who want to shut it down between job runs.
author: mvrequa
ms.date: 01/21/2020
ms.author: adjohnso
---

# Run Azure CycleCloud in a Container Instance

Running Azure CycleCloud in a [Container Instance](https://azure.microsoft.com/services/container-instances/) is an excellent solution for customers who use CycleCloud intermittently and wish to shut it down between job runs to avoid the costs associated with long-running virtual machines.

## Prerequisites

You will need to have [Docker](https://www.docker.com) installed and running on the machine or server you will access CycleCloud from. Download the appropriate [install package](https://www.docker.com/get-started) for your OS and follow Docker's installation instructions.

## CycleCloud Container Image

Once Docker is set up and working, you can run the following command to pull down the CycleCloud container image from Microsoft's Container Registry:

```sh
docker run mcr.microsoft.com/hpc/azure-cyclecloud
```

That's it! The container will start and CycleCloud will be accessible via web browser
 at _https://localhost_. From there, follow the configuration menus.

## Configuration

The container runs web applications for http (80) and https (443). As CycleCloud is running a JVM (Java Virtual Machine), the HeapSize of the JVM and the memory allocated to the container should be coordinated. It is recommended that the HeapSize be set to one half the container memory allocation. Use the command `docker run -m` with an environment variable specified in MB. For example:

```sh
docker run -m 2G -e "JAVA_HEAP_SIZE=1024" -p 8080:80 -p 8443:443 myrepo/cyclecloud:$ver
```

> [!WARNING]
> If the CycleCloud service fails, the container process will terminate and all cluster data will be lost. To avoid this scenario, configure your container instance to be backed with persistent storage.

## Persistent Storage

If the Azure Container Instance should fail, your data could be lost and recovering the managed running state your of HPC clusters would not be possible. It is strongly advised to configure the Azure Container Instance to be backed with durable storage from [Azure File Share](https://docs.microsoft.com/azure/storage/files/storage-how-to-create-file-share).

Provided that an Azure File Share is mounted at `/azurecyclecloud`, the CycleCloud container will use durable storage for:

* Logs
* Backup Recovery Points

For a better understanding of Azure File Share, please see the documentation demonstrating the [integration with Azure Container Instance](https://docs.microsoft.com/azure/container-instances/container-instances-volume-azure-files).

In the example below, a storage share will be mounted at /azurecyclecloud and will collect logs and backup points. With this configuration, the Azure CycleCloud data can be recovered from failure or used to migrate to hosting in another service, such as a Virtual Machine.

``` sample
az container create \
  --resource-group ${ResourceGroup} \
  --location ${Location} \
  --name ${Name} \
  --dns-name-label ${DNSName} \
  --image mcr.microsoft.com/hpc/azure-cyclecloud \
  --ip-address public \
  --ports 80 443 \
  --cpu 2 \
  --memory 4 \
  -e JAVA_HEAP_SIZE=2048 \
  --azure-file-volume-account-name ${STORAGE_ACCOUNT_NAME} \
  --azure-file-volume-account-key ${STORAGE_KEY} \
  --azure-file-volume-share-name ${SHARE_NAME} \
  --azure-file-volume-mount-path /azurecyclecloud
  ```

## Supported Versions

Supported versions of the CycleCloud Container Image can be found in the product [dockerhub page](https://hub.docker.com/r/microsoft/azure-cyclecloud/). The image can be launched as an Azure Container instance (using existing resource group, location, and preferred container and dns names). CycleCloud has SSL certificate generation included, so if you specify the arguments twice (once for az cli and again to set environment variables), then the container is able to establish valid SSL certificates automatically.

``` sample
#!/bin/bash
ResourceGroup="rg-name"
Location="westus2"
CIName="ci-name"
CIDNSName="ci-name"

az container create -g ${ResourceGroup} \
  --location ${Location} \
  --name ${CIName} \
  --dns-name-label ${CIDNSName} \
  --image mcr.microsoft.com/hpc/azure-cyclecloud \
  --ip-address public \
  --ports 80 443 \
  --cpu 2 --memory 4 \
  -e JAVA_HEAP_SIZE=2048
```

In the above example, the container and the cyclecloud UI will be available at `https://${CIDNSName}.${Location}.azurecontainer.io`.

## Additional Configuration

The container runs web applications for http (80) and https (443). As CycleCloud is running a JVM (Java Virtual Machine), the HeapSize of the JVM and the memory allocated to the container should be coordinated. It is recommended that the HeapSize be set to one half the container memory allocation. Use the command `docker run -m` with an environment variable specified in MB. For example:

```sh
docker run -m 2G -e "JAVA_HEAP_SIZE=1024" -p 8080:80 -p 8443:443 mcr.microsoft.com/hpc/azure-cyclecloud
```
