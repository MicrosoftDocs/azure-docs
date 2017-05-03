---
title: Using ACR with an Azure DC/OS cluster | Microsoft Docs
description: Use an Azure Container Registry with a DC/OS cluster in Azure Container Service
services: container-service
documentationcenter: ''
author: julienstroheker
manager: dcaro
editor: ''
tags: acs, azure-container-service, acr, azure-container-registry
keywords: Docker, Containers, Micro-services, Mesos, Azure, FileShare, cifs

ms.assetid:
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/23/2017
ms.author: juliens

---
# Use ACR with a DC/OS cluster to deploy your application

In this article, we'll explore how to use a private container register such as ACR (Azure Container Registry) with a DC/OS cluster. Using ACR allows you to store images privately and keep the control on it such as the versions and/or the updates for example.

Before working through this example, you need: 
* A DC/OS cluster that is configured in Azure Container Service. See [Deploy an Azure Container Service cluster](container-service-deployment.md).
* A Azure Container Service deployed. See [Create a private Docker container registry using the Azure portal](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-portal) or [Create a private Docker container registry using the Azure CLI 2.0](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-azure-cli)
* A File share that is configured inside your DC/OS cluster. See [Create and mount a file share to a DC/OS cluster](container-service-dcos-fileshare.md)
* To understand how to deploy a Docker image in a DC/OS cluster by using the [Web UI](container-service-mesos-marathon-ui.md) or the [REST API](container-service-mesos-marathon-rest.md)

## Manage the authentication inside your cluster

The conventional way to push and pull image from a private registry is to be, first, authenticated on it. To do it, you have to use the `docker login` command line on any docker client process who will need to use your private registry.
When it comes to the production world, using DC/OS in our case, you want to make sure that you are able to pull images from any node. It means that you want to automate the authentication process, and don't run the command line on each machines, because as you can imagine, depending on the size of your cluster, it could be a problematic and heavy operation. 

Assuming that you already [setup a file share inside your DC/OS](container-service-dcos-fileshare.md), we will leverage it by doing:

### From any client machine [Recommended Method]

The following commands are runnable on any environments (Windows/Mac/Linux)  :

1. Make sure that you are meeting the following prerequisites :
  * TAR tool
    * [Windows](http://gnuwin32.sourceforge.net/packages/gtar.htm)
  * Docker 
    * [Windows](https://www.docker.com/docker-windows)
    * [MAC](https://www.docker.com/docker-mac)
    * [Ubuntu](https://www.docker.com/docker-ubuntu)
    * [Others](https://www.docker.com/get-docker)
  * File share mounted inside your cluster, [with the following method](container-service-dcos-fileshare.md)

2. Initiate the authentication to your ACR service by using the following command with your favorite terminal: `sudo docker login --username=<USERNAME> --password=<PASSWORD> <ACR-REGISTRY-NAME>.azurecr.io`. You have to replace the `USERNAME`, `PASSWORD`and `ACR-REGISTRY-NAME` variables with the values provided on your Azure portal

3. It is interesting to know that when you are doing a `docker login` operation, the values are stored locally on the machine under your home folder (`cd ~/.docker` on Mac and Linux or `cd %HOMEPATH%` on Windows). We will compress the contain of this folder by using the `tar czf` command.

4. The final step is to copy the tar file that we just created, inside the file share [that you should have created as prerequisite](container-service-dcos-fileshare.md). You can do it by using the Azure-CLI with the following command `az storage file upload -s <shareName> --account-name <storageAccountName> --account-key <storageAccountKey> -source <pathToTheTarFile>`

To wrap up, here is an example using the following setup (Using a windows environment):
* ACR name: **`demodcos`**
* Username: **`demodcos`**
* Password: **`+js+/=I1=L+D=+eRpU+/=wI/AjvDo=J0`**
* Storage Account Name: **`anystorageaccountname`**
* Storage Account Key: **`aYGl6Nys4De5J3VPldT1rXxz2+VjgO7dgWytnoWClurZ/l8iO5c5N8xXNS6mpJhSc9xh+7zkT7Mr+xIT4OIVMg==`**
* Share name created inside the storage account: **`share`**
* Path of the tar archive to upload: **`%HOMEPATH%/.docker/docker.tar.gz`**

```bash
# Changing directory to the home folder of the default user
cd %HOMEPATH%

# Authentication into my ACR
docker login --username=demodcos --password=+js+/=I1=L+D=+eRpU+/=wI/AjvDo=J0 demodcos.azurecr.io

# Tar the contains of the .docker folder
tar czf docker.tar.gz .docker

# Upload the tar archive in the fileshare
az storage file upload -s share --account-name anystorageaccountname --account-key aYGl6Nys4De5J3VPldT1rXxz2+VjgO7dgWytnoWClurZ/l8iO5c5N8xXNS6mpJhSc9xh+7zkT7Mr+xIT4OIVMg== --source %HOMEPATH%/docker.tar.gz
```

### From the master [Not recommended Method]

Executing operation from the master are not recommended to avoid mistakes and impact on the whole environments.

1. First, SSH to the master (or the first master) of your DC/OS-based cluster. For example, `ssh userName@masterFQDN –A –p 22`, where the masterFQDN is the fully qualified domain name of the master VM. [More infos by clicking here](https://docs.microsoft.com/azure/container-service/container-service-connect#connect-to-a-dcos-or-swarm-cluster)

2. Initiate the authentication to your ACR service by using the following command: `sudo docker login --username=<USERNAME> --password=<PASSWORD> <ACR-REGISTRY-NAME>.azurecr.io`. You have to replace the `USERNAME`, `PASSWORD`and `ACR-REGISTRY-NAME` variables with the values provided on your Azure portal

3. It is interesting to know that when you are doing a `docker login` operation, the values are stored locally on the machine under your home folder `~/.docker`. We will compress the contain of this folder by using the `tar czf` command.

4. The final step is to copy the tar file that we just created, inside the file share. This operation will allow, at all the virtual machines inside our cluster, to use this credential and be authenticated on your Azure Container Registry.

To wrap up, here is an example using the following setup:
* ACR name: **`demodcos`**
* Username: **`demodcos`**
* Password: **`+js+/=I1=L+D=+eRpU+/=wI/AjvDo=J0`**
* Mount point inside the cluster: **`/mnt/share`**

```bash
# Changing directory to the home folder of the default user
cd ~

# Authentication into my ACR
sudo docker login --username=demodcos --password=+js+/=I1=L+D=+eRpU+/=wI/AjvDo=J0 demodcos.azurecr.io

# Tar the contains of the .docker folder
sudo tar czf docker.tar.gz .docker

# Copy of the tar file in the file share of my cluster
sudo cp docker.tar.gz /mnt/share
```


## Deploy an image from ACR with Marathon

Supposedly you already pushed the images that you want to deploy inside your container registry. See [Push your first image to a private Docker container registry using the Docker CLI](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-docker-cli)

Let's say we want to deploy the **simple-web** image, with the **2.1** tag, from our private registry hosted on Azure (ACR), we will use the following configuration:

```json
{
  "id": "myapp",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "demodcos.azurecr.io/simple-web:2.1",
      "network": "BRIDGE",
      "portMappings": [
        { "hostPort": 0, "containerPort": 80, "servicePort": 10000 }
      ],
      "forcePullImage":true
    }
  },
  "instances": 3,
  "cpus": 0.1,
  "mem": 65,
  "healthChecks": [{
      "protocol": "HTTP",
      "path": "/",
      "portIndex": 0,
      "timeoutSeconds": 10,
      "gracePeriodSeconds": 10,
      "intervalSeconds": 2,
      "maxConsecutiveFailures": 10
  }],
  "labels":{
    "HAPROXY_GROUP":"external",
    "HAPROXY_0_VHOST":"YOUR FQDN",
    "HAPROXY_0_MODE":"http"
  },
  "uris":  [
       "file:///mnt/share/docker.tar.gz"
   ]
}
```

> [!NOTE] 
> As you can see, we are using the **uris** option to specify where are stored our credentials.
>

## Next steps
* Read more about [managing your DC/OS containers](container-service-mesos-marathon-ui.md).
* DC/OS container management through the [Marathon REST API](container-service-mesos-marathon-rest.md).