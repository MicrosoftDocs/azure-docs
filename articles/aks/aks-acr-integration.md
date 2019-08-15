---
title: Integrate Azure Container Registry with Azure Kubernetes Service
description: Learn how to integrate Azure Kubernetes Service (AKS) with Azure Container Registry (ACR)
services: container-service
author: mlearned
manager: gwallace

ms.service: container-service
ms.topic: article
ms.date: 08/14/2018
ms.author: mlearned
---

# Authenticate with Azure Container Registry from Azure Kubernetes Service

When you're using Azure Container Registry (ACR) with Azure Kubernetes Service (AKS), an authentication mechanism needs to be established. This article details the recommended configurations for authentication between these two Azure services.

You can set up the AKS to ACR integration in a few simple commands with the Azure CLI and the aks-preview 0.4.8 extension.

## Before you begin

Subscription contributors can create the AKS cluster and the ACR, but you can't assign the **ACRPull** role to the AKS service principal unless you are an **Azure subscription owner**. However, AKS can create the role assignment for the acr resource ID if the ACR is in the same resource group as the AKS cluster if you are a contributor in the subscription.

* **Owner** role on the **Azure subscription** if AKS and ACR are in different resource groups or **Contributor** role on the **Azure subscription** if AKS and ACR are in the same resource group
* You also need the Azure CLI version 2.0.70 or later and the aks-preview 0.4.8 extension
* You need [Docker installed](https://docs.docker.com/install/) on your client, and you need access to [docker hub](https://hub.docker.com/)

## Install latest AKS CLI preview extensionTo use Windows Server containers, you need the *aks-preview* CLI extension version 0.4.8 or higher. 

Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, then check for any available updates using the [az extension update][az-extension-update] command::

```azurecli
az extension remove --name aks-preview 
az extension add -y --name aks-preview
```

## Create a new AKS cluster with ACR integration

You can set up AKS and ACR integration during the initial creation of your AKS cluster.  To allow an AKS cluster to interact with ACR, an Azure Active Directory **service principal** is used. The following CLI command creates an ACR in the resource group you specify and configures the appropriate **ACRPull** role for the service principal. If the *acr-name* doesn't exist, a default ACR name of `aks<resource-group>acr` is automatically created.  Supply valid values for your parameters below.
```azurecli
az aks create -n myAKSCluster -g myResourceGroup -enable-acr [acr <acr-name-or-resource-id>]
```

## Create ACR integration for existing AKS clusters

Integrate ACR with existing ACR clusters by supplying valid values for **acr-name** and **acr-resource-id** below.

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --enable-acr --acr <acrName>
az aks create -n myAKSCluster -g myResourceGroup --enable-acr --acr-resource-id <--acr>
```

## Log in to your ACR

```azurecli
acrloginservername=$(az acr show -n myAKSCluster -g myResourceGroup --query loginServer -o tsv)
az acr login -n <acrName>
```

## Pull an image from docker hub and push to your ACR

```console
docker pull nginx
```

```
$ docker tag nginx $acrloginservername/nginx:v1
$ docker push someacr1.azurecr.io/nginx:v1

The push refers to repository [someacr1.azurecr.io/nginx]
fe6a7a3b3f27: Pushed
d0673244f7d4: Pushed
d8a33133e477: Pushed
v1: digest: sha256:dc85890ba9763fe38b178b337d4ccc802874afe3c02e6c98c304f65b08af958f size: 948
```

## Update the state and verify pods

Perform the following steps to verify your deployment.

```azurecli
az aks get-credentials -g myResourceGroup -n myAKSCluster
```

View the yaml file, and edit the image property by replacing the value with your ACR login server, image, and tag.

```
$ cat acr-nginx.yaml

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
        image: TODO <replace this image property with you acr login server, image and tag>
        ports:
        - containerPort: 80

$ kubectl apply -f acr-nginx.yaml
$ kubectl get pods

You should have two running pods.

NAME                                 READY   STATUS    RESTARTS   AGE
nginx0-deployment-669dfc4d4b-x74kr   1/1     Running   0          20s
nginx0-deployment-669dfc4d4b-xdpd6   1/1     Running   0          20s
```

<!-- LINKS - external -->
[AKS AKS CLI]:  https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-create