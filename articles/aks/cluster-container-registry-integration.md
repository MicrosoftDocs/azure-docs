---
title: Integrate Azure Container Registry with Azure Kubernetes Service
description: Learn how to integrate Azure Kubernetes Service (AKS) with Azure Container Registry (ACR)
services: container-service
manager: gwallace
ms.topic: article
ms.date: 02/25/2020

---

# Authenticate with Azure Container Registry from Azure Kubernetes Service

When you're using Azure Container Registry (ACR) with Azure Kubernetes Service (AKS), an authentication mechanism needs to be established. This article provides examples for configuring authentication between these two Azure services. 

You can set up the AKS to ACR integration in a few simple commands with the Azure CLI. This integration assigns the AcrPull role to the service principal associated to the AKS Cluster.

## Before you begin

These examples require:

* **Owner** or **Azure account administrator** role on the **Azure subscription**
* Azure CLI version 2.0.73 or later

To avoid needing an **Owner** or **Azure account administrator** role, you can configure a service principal manually or use an existing service principal to authenticate ACR from AKS. For more information, see [ACR authentication with service principals](../container-registry/container-registry-auth-service-principal.md) or [Authenticate from Kubernetes with a pull secret](../container-registry/container-registry-auth-kubernetes.md).

## Create a new AKS cluster with ACR integration

You can set up AKS and ACR integration during the initial creation of your AKS cluster.  To allow an AKS cluster to interact with ACR, an Azure Active Directory **service principal** is used. The following CLI command allows you to authorize an existing ACR in your subscription and configures the appropriate **ACRPull** role for the service principal. Supply valid values for your parameters below.

```azurecli
# set this to the name of your Azure Container Registry.  It must be globally unique
MYACR=myContainerRegistry

# Run the following line to create an Azure Container Registry if you do not already have one
az acr create -n $MYACR -g myContainerRegistryResourceGroup --sku basic

# Create an AKS cluster with ACR integration
az aks create -n myAKSCluster -g myResourceGroup --generate-ssh-keys --attach-acr $MYACR
```

Alternatively, you can specify the ACR name using an ACR resource ID, which has the following format:

`/subscriptions/\<subscription-id\>/resourceGroups/\<resource-group-name\>/providers/Microsoft.ContainerRegistry/registries/\<name\>` 

```azurecli
az aks create -n myAKSCluster -g myResourceGroup --generate-ssh-keys --attach-acr /subscriptions/<subscription-id>/resourceGroups/myContainerRegistryResourceGroup/providers/Microsoft.ContainerRegistry/registries/myContainerRegistry
```

This step may take several minutes to complete.

## Configure ACR integration for existing AKS clusters

Integrate an existing ACR with existing AKS clusters by supplying valid values for **acr-name** or **acr-resource-id** as below.

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --attach-acr <acrName>
```

or,

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --attach-acr <acr-resource-id>
```

You can also remove the integration between an ACR and an AKS cluster with the following

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --detach-acr <acrName>
```

or

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --detach-acr <acr-resource-id>
```

## Working with ACR & AKS

### Import an image into your ACR

Import an image from docker hub into your ACR by running the following:


```azurecli
az acr import  -n <myContainerRegistry> --source docker.io/library/nginx:latest --image nginx:v1
```

### Deploy the sample image from ACR to AKS

Ensure you have the proper AKS credentials

```azurecli
az aks get-credentials -g myResourceGroup -n myAKSCluster
```

Create a file called **acr-nginx.yaml** that contains the following:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx0-deployment
  labels:
    app: nginx0-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx0
  template:
    metadata:
      labels:
        app: nginx0
    spec:
      containers:
      - name: nginx
        image: <replace this image property with you acr login server, image and tag>
        ports:
        - containerPort: 80
```

Next, run this deployment in your AKS cluster:

```console
kubectl apply -f acr-nginx.yaml
```

You can monitor the deployment by running:

```console
kubectl get pods
```

You should have two running pods.

```output
NAME                                 READY   STATUS    RESTARTS   AGE
nginx0-deployment-669dfc4d4b-x74kr   1/1     Running   0          20s
nginx0-deployment-669dfc4d4b-xdpd6   1/1     Running   0          20s
```

<!-- LINKS - external -->
[AKS AKS CLI]:  https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-create
