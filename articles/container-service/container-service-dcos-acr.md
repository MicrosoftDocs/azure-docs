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

In this article, we'll explore how to use a private container register such as ACR (Azure Container Registry) with a DC/OS cluster. Using ACR allows you to store images privatly and keep the control on it such as the versions and/or the updates for example.

Before working through this example, you need : 
* A DC/OS cluster that is configured in Azure Container Service. See [Deploy an Azure Container Service cluster](container-service-deployment.md).
* A Azure Container Service deployed. See [Create a private Docker container registry using the Azure portal](https://docs.microsoft.com/en-ca/azure/container-registry/container-registry-get-started-portal) or [Create a private Docker container registry using the Azure CLI 2.0](https://docs.microsoft.com/en-ca/azure/container-registry/container-registry-get-started-azure-cli)
* A File share that is configured inside your DC/OS cluster. See [Create and mount a file share to a DC/OS cluster](container-service-dcos-fileshare.md)
* To understand how to deploy a Docker image in a DC/OS cluster by using the [Web UI](container-service-mesos-marathon-ui.md) or the [REST API](container-service-mesos-marathon-rest.md)

## Manage the authentication inside your cluster

Using a private registry, the first step is to be authenticated on it. The do it, you will need to use the `docker login` command line.

The problem here is you have to do it on each nodes of your cluster. As you can imagine, depending the size of your cluster it could be a problematic opperation. 

According that you already setup a file share inside your DC/OS, which is a best practice, we will leverage it by doing :

1. First, SSH to the master (or the first master) of your DC/OS-based cluster. For example, `ssh userName@masterFQDN –A –p 22`, where the masterFQDN is the fully qualified domain name of the master VM.

2. Initiate the authentication to your ACR service by using the following command : `sudo docker login --username=<USERNAME> --password=<PASSWORD> <ACR-REGISTRY-NAME>.azurecr.io`. (You have to replace the 'USERNAME', 'PASSWORD'and 'ACR-REGISTRY-NAME' variables with the values provided on your Azure Portal)

3. It is intereting to know that when you are doing a `docker login` operation, the values are stored locally on the machine under your home folder `~/.docker`. We will compress the contain of this `.docker` folder by using the `tar czf` command.

4. The final step it copy the tar file taht we just create inside the file share. This operation will allow at all the virtual machines inside our cluster to use this credential to be authenticated with your Azure Container Registry.

To wrap up, here is an example using the following setup :
* ACR name : **`demodcos`**
* Username : **`demodcos`**
* Password : **`+js+/=I1=L+D=+eRpU+/=wI/AjvDo=J0`**
* Mount point inside the cluster : **`/mnt/share`**

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

Supposedly you already pushed the images that you want to deploy inside your container registry. See [Push your first image to a private Docker container registry using the Docker CLI](https://docs.microsoft.com/en-ca/azure/container-registry/container-registry-get-started-docker-cli)

Let's say we want to deploy the **simple-web** image, with the **2.1** tag, from our private registry hosted on Azure (ACR), we will use the following configuration :

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

## Next steps
* Read more about [managing your DC/OS containers](container-service-mesos-marathon-ui.md).
* DC/OS container management through the [Marathon REST API](container-service-mesos-marathon-rest.md).