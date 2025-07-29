---
title: Run CycleCloud in a Container Instance
description: Know how to run Azure CycleCloud in a container instance, which is useful for intermittent CycleCloud users who want to shut it down between job runs.
author: mvrequa
ms.date: 07/01/2025
ms.author: adjohnso
---

# Run Azure CycleCloud in a Container Instance

Running Azure CycleCloud in a [Container Instance](https://azure.microsoft.com/services/container-instances/) is an excellent solution for customers who use CycleCloud intermittently and want to shut it down between job runs to avoid the costs associated with long-running virtual machines.

## Prerequisites

You need to have [Docker](https://www.docker.com) installed and running on the machine or server you use to access CycleCloud. Download the appropriate [install package](https://www.docker.com/get-started) for your operating system and follow Docker's installation instructions.

## CycleCloud container image

After you set up Docker, run the following command to get the CycleCloud container image from Microsoft Container Registry:

```sh
docker run mcr.microsoft.com/hpc/azure-cyclecloud
```

That's it! The container starts, and you can access CycleCloud through a web browser at _https://localhost_. From there, follow the configuration menus.

## Configuration

The container runs web applications for HTTP (80) and HTTPS (443). Because CycleCloud runs on a JVM (Java Virtual Machine), you need to coordinate the HeapSize of the JVM with the memory you allocate to the container. We recommend setting the HeapSize to half of the container memory allocation. Use the `docker run -m` command with an environment variable specified in MB. For example:

```sh
docker run -m 2G -e "JAVA_HEAP_SIZE=1024" -p 8080:80 -p 8443:443 myrepo/cyclecloud:$ver
```

> [!WARNING]
> If the CycleCloud service fails, the container process terminates and all cluster data is lost. To avoid this scenario, configure your container instance to use persistent storage.

## Persistent storage

If the Azure Container Instance fails, you could lose your data. You also can't recover the managed running state of your HPC clusters. We strongly recommend that you configure the Azure Container Instance to use durable storage from [Azure File Share](/azure/storage/files/storage-how-to-create-file-share).

If you mount an Azure File Share at `/azurecyclecloud`, the CycleCloud container uses durable storage for:

* Logs
* Backup recovery points

For more information about Azure File Share, see the documentation on [integration with Azure Container Instance](/azure/container-instances/container-instances-volume-azure-files).

In the following example, a storage share is mounted at `/azurecyclecloud` to collect logs and backup points. With this configuration, you can recover Azure CycleCloud data from failure or use it to migrate hosting to another service, such as a virtual machine.

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

## Supported versions

You can find supported versions of the CycleCloud Container Image on the product [Docker Hub page](https://hub.docker.com/r/microsoft/hpc-azure-cyclecloud). You can launch the image as an Azure Container instance by using an existing resource group and location, and by choosing your preferred container and DNS names. CycleCloud includes SSL certificate generation, so if you specify the arguments twice (once for Azure CLI and again to set environment variables), the container can automatically establish valid SSL certificates.

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

In the preceding example, you can access the container and the CycleCloud UI at `https://${CIDNSName}.${Location}.azurecontainer.io`.

## Additional configuration

The container runs web applications for HTTP (80) and HTTPS (443). Because CycleCloud runs a JVM (Java Virtual Machine), you need to coordinate the HeapSize of the JVM with the memory you allocate to the container. We recommend setting the HeapSize to half of the container memory allocation. Use the `docker run -m` command with an environment variable specified in MB. For example:

```sh
docker run -m 2G -e "JAVA_HEAP_SIZE=1024" -p 8080:80 -p 8443:443 mcr.microsoft.com/hpc/azure-cyclecloud
```
