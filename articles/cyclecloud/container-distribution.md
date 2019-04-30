---
title: Run Azure CycleCloud in a Container Instance | Microsoft Docs
description: Run Azure CycleCloud in a Container Instance for quick and easy use.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Run Azure CycleCloud in a Container Instance

Running Azure CycleCloud in a [Container Instance](https://azure.microsoft.com/en-us/services/container-instances/) is an excellent solution for customers who use CycleCloud intermittently and wish to shut it down between job runs to avoid the costs associated with long-running virtual machines.

## Prerequisites

You will need to have [Docker](https://www.docker.com) installed and running on the machine or server you will access CycleCloud from. Download the appropriate [install package](https://www.docker.com/get-started) for your OS and follow Docker's installation instructions.

## CycleCloud Container Image

Once Docker is set up and working, you can run the following command to pull down the Azure CycleCloud container image from Microsoft's Container Registry:

```azurecli-interactive
docker run mcr.microsoft.com/hpc/azure-cyclecloud
```

## Configuration

The container runs web applications for http (80) and https (443). As CycleCloud is running a JVM (Java Virtual Machine), the HeapSize of the JVM and the memory allocated to the container should be coordinated. It is recommended that the HeapSize be set to one half the container memory allocation. Use the command `docker run -m` with an environment variable specified in MB. For example:

```azurecli-interactive
docker run -m 2G -e "JAVA_HEAP_SIZE=1024" -p 8080:80 -p 8443:443 myrepo/cyclecloud:$ver
```

> [!WARNING]
> If the CycleCloud service fails, the container process will terminate and all cluster data will be lost. To avoid this scenario, configure your container instance to be backed with persistent storage.

## Persistent Storage

If the Azure Container Instance should fail, your data could be lost. Recovering the managed running state your of HPC clusters would not be possible. It is strongly advised to configure the Azure Container Instance to be backed with durable storage from [Azure File Share](https://docs.microsoft.com/en-us/azure/storage/files/storage-how-to-create-file-share).

Provided that an Azure File Share is mounted at `/azurecyclecloud`, the CycleCloud container will use durable storage for:

* Logs
* Backup Recovery Points

For a better understanding of Azure File Share, please see the documentation demonstrating the [integration with Azure Container Instance](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files).

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

Optionally, you can add an additional environment variable for the fully qualified domain name. In this case, CycleCloud will try to create valid a SSL certificate:

``` sample
FQDN="https://${CIDNSName}.${Location}.azurecontainer.io"
...
-e JAVA_HEAP_SIZE=2048 FQDN=${FQDN}
```

## Recover the SSH Keypair

CycleCloud creates a keypair to be used for administrative access to nodes. This keypair will be printed to the `stdout` of the container image, and should be retained.

A unique ssh keypair for the container appears in the standard output of the container process. Retain this keypair for admin access to the CycleCloud clusters. In the Azure Container Instance, this can be found in the **Container** menu under the **Logs** tab.

``` sample
Private Key for admin access to nodes.  Retain for cyclecloud cli and ssh access.
-----BEGIN RSA PRIVATE KEY-----
MIIJKAIBAAKCAgEAhdhrHdfirGEEsps2R+EZP5Zq/2TLA/JQPNYwFtcTvA0cJ3O0
wRR/U8HdDswFpAvj2T00ptQqWFb7prMB1/5ualKFjYkJ/7Azxx13F+qWh3z14dDq
xwUPhQleZ9XPaIAYDew5eGibxuaFbkXmmxWsacW1K9hXFwXnq58Rs23Q/x4/xw08
FDcIvh7FjR6h13zOj6He0sRW7z0myRgj88nPziiWYB5pm9jykHnNUWiYwYssSuDX
...
IfDYB4iMRwKiJdXIs773U6JtuoRWj5IbcIjxdK6YzayyTZJJw3ejEWl2F6aSrMvs
W7d1HjlAz0LMqNLV3XLTThXXxK5dOBbExDYvE2KQe/6Wf9ZSfLAr8BcZe+PXPESX
mVa3tFI9HfSz2qjsB1YLRfZYiMR+BzCI9uOyu9bIu2VLUX1fjgIDJ6XYtcOQAJP0
6y5HC9t1sZuhiaYHQvkh0YUTLZejch4BCzd9EknsccHxEjU+Fbf8CVjm1ZU=
-----END RSA PRIVATE KEY-----
```

## Autoconfig
To bring up an Azure CycleCloud container with a user pre-created, add the following environment variables to the docker run command:

```azurecli-interactive
$ docker run -m 4G -p 80:80 -p 443:443 \
-e "JAVA_HEAP_SIZE=2048" \
-e CYCLECLOUD_AUTOCONFIG=true \
-e CYCLECLOUD_USERNAME=$YOUR-USER-NAME \
-e CYCLECLOUD_PASSWORD=$PASSWORD \
-e CYCLECLOUD_USER_PUB_KEY=$SSH_PUBLIC_KEY \
mcr.microsoft.com/hpc/azure-cyclecloud
```

With this, all clusters nodes started will have this user created and the SSH public key staged in their authorized_keys file. You can also login to the CycleCloud web interface using the username and password as credentials.
