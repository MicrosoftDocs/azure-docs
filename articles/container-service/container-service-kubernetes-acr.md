---
title: Container registry with Azure Kubernetes cluster | Microsoft Docs
description: Use a private Azure container registry with a Kubernetes cluster in Azure Container Service
services: container-service
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Containers, Micro-services, Kubernetes, Azure

ms.assetid: f0ab5645-2636-42de-b23b-4c3a7e3aa8bb
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/05/2017
ms.author: danlep

---
# Pull images from an Azure container registry to Kubernetes in Container Service

For your container deployments, Azure Container Service can pull images from Docker Hub or from private Docker container registries, including ones created in the [Azure Container Registry](../container-registry/container-registry-intro.md) service. This tutorial shows basic steps to pull images from an Azure container registry to Kubernetes in Azure Container Service. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create an Azure container registry
> * Push an image to the container registry
> * Create and connect to a Kubernetes cluster 
> * Pull an image from the registry to Kubernetes
> * Use other private registries with Kubernetes

This tutorial requires the Azure CLI version 2.0.4 or later. To find the CLI version run `az --version`. If you need to upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

To push and pull Docker images from your registry, install [Docker](https://docs.docker.com/engine/installation/) for your platform. For this tutorial, you can use Docker Community Edition.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Private registry overview

Docker containers are built from images pulled from public or private container registries. While you might test with images from a public registry such as [Docker Hub](https://hub.docker.com/), for greater control over image versions, security, and updates in your container deployments, using a private registry is usually recommended. 

An example of a private registry is the [Docker Trusted Registry](https://docs.docker.com/datacenter/dtr/2.0/), which can be installed on-premises or in a virtual private cloud. There are also cloud-based private container registry services including [Azure Container Registry](../container-registry/container-registry-intro.md).

Using an Azure container registry with a Kubernetes cluster in Azure Container Service gives you the option to locate the registry close to your cluster. It also simplifies authentication to the registry from the cluster, because the [Azure Active Directory service principal](container-service-kubernetes-service-principal.md) configured for Kubernetes in Azure can authenticate automatically to the registry. However, you can use other private registries with Container Service, even one deployed on your container cluster. (Additional configuration is required for using other private registries.)



## Create an Azure container registry

Before you can create a container registry, create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named *myRGRegistry* in the eastus location.

```azurecli-interactive 
az group create --name myRGRegistry --location eastus
```

Now create a container registry with [az acr create](/cli/azure/acr#create). The following example creates a registry named *myACRegistry*, and enables an admin user account for basic authentication. You specify the `Basic` SKU in this example.

```azurecli-interactive 
az acr create --name myACRegistry --resource-group myRGRegistry --admin-enabled --sku Basic
```

Output similar to the following appears. Note the value of `loginServer`, which is the fully qualified name of the container registry. In this example, it is `myacregistry.azurecr.io`.

```azurecli
{
  "adminUserEnabled": true,
  "creationDate": "2017-06-05T23:28:03.266566+00:00",
  "id": "/subscriptions/xxxxxx1c-c67e-4760-9ed6-xxxxxxxxecff/resourcegroups/myRGRegistry/providers/Microsoft.ContainerRe
gistry/registries/myACRegistry",
  "location": "eastus",
  "loginServer": "myacregistry.azurecr.io",
  "name": "myACRegistry",
  "provisioningState": "Succeeded",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "storageAccount": {
    "name": "myacregistry1234567"
  },
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}

```
## Get registry credentials
To manage images in an Azure container registry, you can authenticate with the admin user name and password. The user name is the same as the registry name (*myACRegistry* in this example). Get the registry password by running the following command:

```azurecli-interactive 
az acr credential show --name myACRegistry --query passwords[0].value
```

## Push an image to the container registry

Use the [Docker Command-Line Interface](https://docs.docker.com/engine/reference/commandline/cli/) (Docker CLI) for login, push, pull, and other operations on your container registry. 

Log in to your Azure container registry with the user name and password you obtained in the previous step. Specify the fully qualified registry name, which is the value of `loginServer` - in this case, `myacregistry.azurecr.io`.

```bash 
docker login myacregistry.azurecr.io --username myACRegistry --password <yourPassword>
```

As an example, push an NGINX image to the registy. First pull the Docker official image locally:

```bash
docker pull nginx
```
Tag the image with a name in your registry, in this case in the `samples` namespace:

```bash
docker tag nginx myacregistry.azurecr.io/samples/nginx
```

Now push the image to your registry:

```bash
docker push myacregistry.azurecr.io/samples/nginx
```

To verify that the image is in your registry, start an NGINX container locally:

```bash
docker run -it --rm -p 8080:80 myacregistry.azurecr.io/samples/nginx
```

Browse to http://localhost:8080 to view the running container.



To stop the running container, press [CTRL]+[C].

## Create a Kubernetes cluster

Create a Kubernetes cluster that can pull images from your Azure container registry. For steps, see the [Kubernetes cluster - Linux quick start](container-service-kubernetes-walkthrough.md).

To simplify authentication from the cluster to the registry, create a Kubernetes cluster named *myK8sCluster* in the same resource group as the registry (*myRGRegistry* in this example):

```azurecli-interactive 
az acs create --orchestrator-type=kubernetes \
    --resource-group myRGRegistry \
    --name=myK8sCluster \
    --agent-count=2 \
    --generate-ssh-keys 
```

Use the following commands to install the `kubectl` command-line tool and to get the cluster credentials:

```azurecli-interactive 
az acs kubernetes install-cli 

az acs kubernetes get-credentials --resource-group=myRGRegistry --name=myK8sCluster

```
To verify the connection to your cluster from your machine, try running:

```bash
kubectl get nodes
```

`kubectl` lists the master and agent nodes.
NAME                    STATUS                     AGE       VERSION
k8s-agent-98dc3136-0    Ready                      5m        v1.5.3
k8s-agent-98dc3136-1    Ready                      5m        v1.5.3
k8s-master-98dc3136-0   Ready,SchedulingDisabled   5m        v1.5.3

## Pull from Azure container registry to Kubernetes

Now, deploy a container by pulling an images from your Azure container registry. Specify the fully qualified image name in your object configuration or when specifying an image with `kubectl`. 

For example, to use `kubectl run` to deploy a Kubernetes container app from the NGINX image in your Azure container registry, specify the fully qualified image name, `myacregistry.azurecr.io/samples/nginx`:

```bash
kubectl run myimage --image myacregistry.azurecr.io/samples/nginx
```



Similarly, to deploy a Kubernetes object from a YAML or JSON [configuration file](https://kubernetes.io/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/#how-to-create-objects), provide the fully qualified image name in the `containers:image` specification:

```YAML
...
spec:
  containers:
    - name: mynginx
      image: myacregistry.azurecr.io/samples/nginx

...
```



## Pull from another private registry
To use a private registry other than an Azure container registry with your Kubernetes cluster, an additional step is needed to configure an *image pull secret*. To create a secret, run the `kubectl create secret docker-registry` command. Then, reference the pull secret in a pod definition. For details, see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).

The following example creates the secret named `myregistrykey` using the login credentials for the private registry server `mycr.contoso.io`:


```bash
kubectl create secret docker-registry myregistrykey --docker-server=mycr.contoso.io --docker-username=myUsername --docker-password=myPassword --docker-email=myEmail
```

> [!TIP]
>If you need to access multiple registries, you can create one secret for each registry.
>

Then, deploy pods from an image in the private registry by adding an `imagePullSecrets` section to a pod definition. The following configuration file shows how to specify an NGINX image from a private registry and the image pull secret:

```YAML
apiVersion: v1
kind: Pod
metadata:
  name: mynginx
  labels:
    app: mydemo

spec:
  containers:
    - name: mynginx
      image: mycr.contoso.io/samples/nginx
      ports:
        - containerPort: 8001
  imagePullSecrets:
    - name: myregistrykey
```



## Next steps

In this tutorial, you learned about how to use an Azure container registry with Kubernetes in Azure Container Service, including how to:

> [!div class="checklist"]
> * Create an Azure container registry
> * Push an image to the container registry
> * Create and connect to a Kubernetes cluster 
> * Pull an image from the registry to Kubernetes
> * Use other private registries with Kubernetes

Advance to the next tutorial to learn about XXXX.

> [!div class="nextstepaction"]
> [XXX tutorial](./tutorial-manage-disks.md)
