---
title: Integrate Azure Container Registry with Azure Kubernetes Service
description: Learn how to provide access to images in your private container registry from Azure Kubernetes Service by using an Azure Active Directory service principal.
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

Subscription contributors can create the AKS cluster and the ACR, but cannot assign the **ACRPull** role to the AKS service principal unless they are an **Azure subscription owner**. AKS can only perform a role assignment for the acr resource ID if the ACR is in the same resource group as the AKS cluster in case the user is a contributor in the subscription and not the Owner.

* **Owner** role on the **Azure subscription** if AKS and ACR are in different resource groups or **Contributor** role on the **Azure subscription** if AKS and ACR reside in the same resource group
* You also need the Azure CLI version 2.0.70 or later
* You need [Docker installed](https://docs.docker.com/install/) on your client, and you need access to [docker hub](https://hub.docker.com/)

## Install latest AKS CLI preview extension

Ensure you have created and AKS cluster and added the ACR integration with the steps above.  Remove and update the AKS CLI preview extension

```azurecli
az extension remove --name aks-preview 
az extension add -y --name aks-preview
```

## Create a new AKS cluster with ACR integration

You can set up AKS and ACR integration during the initial creation of your AKS cluster.  To allow an AKS cluster to interact with ACR, an Azure Active Directory **service principal** is used. The following CLI command creates an ACR in the resource group you specify and configures the appropriate **ACRPull** role for the service principal. If the *acr-name* does not exist, a default ACR name of `aks-<cluster-name>-acr` is automatically created.  Supply valid values for your parameters below.
```azurecli
az aks create -n myAKSCluster -g myResourceGroup -enable-acr [--acr <acrName>]
```

Optionally, you can also specify **acr-resource-id** of an existing acr in the resource group you specified for the aks cluster with the following command.  Supply your valid values for the parameters below.
```azurecli
az aks create -n myAKSCluster  -g myResourceGroup --enable-acr [--acr-resource-id <your-acr-resource-id>]
```

## Create ACR integration for existing AKS clusters

For existing AKS clusters, you can add integration with an existing ACR. You must supply valid values for **acr-name** and **acr-resource-id** or the commands will fail.

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --enable-acr --acr <acrName>
az aks create -n myAKSCluster -g myResourceGroup --enable-acr --acr-resource-id <your-acr-resource-id>
```

## Set variable and login to your ACR

Log in to your ACR.

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

## Update the image property for the nginx container

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
```


## Update the state and verify pods

You should have two running pods.

```
$ kubectl apply -f acr-nginx.yaml
$ kubectl get pods

NAME                                 READY   STATUS    RESTARTS   AGE
nginx0-deployment-669dfc4d4b-x74kr   1/1     Running   0          20s
nginx0-deployment-669dfc4d4b-xdpd6   1/1     Running   0          20s
```

<!-- LINKS - external -->
[AKS AKS CLI]:  https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-create