---
title: (DEPRECATED) Azure Container Service tutorial - Deploy Application
description: Azure Container Service tutorial - Deploy Application
author: iainfoulds

ms.service: container-service
ms.topic: tutorial
ms.date: 02/26/2018
ms.author: iainfou
ms.custom: mvc
---

# (DEPRECATED) Run applications in Kubernetes

> [!TIP]
> For the updated version this tutorial that uses Azure Kubernetes Service, see [Tutorial: Run applications in Azure Kubernetes Service (AKS)](../../aks/tutorial-kubernetes-deploy-application.md).

[!INCLUDE [ACS deprecation](../../../includes/container-service-kubernetes-deprecation.md)]

In this tutorial, part four of seven, a sample application is deployed into a Kubernetes cluster. Steps completed include:

> [!div class="checklist"]
> * Update Kubernetes manifest files
> * Run application in Kubernetes
> * Test the application

In subsequent tutorials, this application is scaled out, updated, and Log Analytics is configured to monitor the Kubernetes cluster.

This tutorial assumes a basic understanding of Kubernetes concepts, for detailed information on Kubernetes see the [Kubernetes documentation](https://kubernetes.io/docs/home/).

## Before you begin

In previous tutorials, an application was packaged into a container image, this image was uploaded to Azure Container Registry, and a Kubernetes cluster was created. 

To complete this tutorial, you need the pre-created `azure-vote-all-in-one-redis.yml` Kubernetes manifest file. This file was downloaded with the application source code in a previous tutorial. Verify that you have cloned the repo, and that you have changed directories into the cloned repo.

If you have not done these steps, and would like to follow along, return to [Tutorial 1 – Create container images](./container-service-tutorial-kubernetes-prepare-app.md). 

## Update manifest file

In this tutorial, Azure Container Registry (ACR) has been used to store a container image. Before running the application, the ACR login server name needs to be updated in the Kubernetes manifest file.

Get the ACR login server name with the [az acr list](/cli/azure/acr#az-acr-list) command.

```azurecli-interactive
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

The manifest file has been pre-created with a login server name of `microsoft`. Open the file with any text editor. In this example, the file is opened with `vi`.

```bash
vi azure-vote-all-in-one-redis.yml
```

Replace `microsoft` with the ACR login server name. This value is found on line **47** of the manifest file.

```yaml
containers:
- name: azure-vote-front
  image: microsoft/azure-vote-front:v1
```

Save and close the file.

## Deploy application

Use the [kubectl create](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create) command to run the application. This command parses the manifest file and create the defined Kubernetes objects.

```console
kubectl create -f azure-vote-all-in-one-redis.yml
```

Output:

```output
deployment "azure-vote-back" created
service "azure-vote-back" created
deployment "azure-vote-front" created
service "azure-vote-front" created
```

## Test application

A [Kubernetes service](https://kubernetes.io/docs/concepts/services-networking/service/) is created which exposes the application to the internet. This process can take a few minutes. 

To monitor progress, use the [kubectl get service](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command with the `--watch` argument.

```console
kubectl get service azure-vote-front --watch
```

Initially, the **EXTERNAL-IP** for the `azure-vote-front` service appears as `pending`. Once the EXTERNAL-IP address has changed from `pending` to an `IP address`, use `CTRL-C` to stop the kubectl watch process.

```output
NAME               CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
azure-vote-front   10.0.42.158   <pending>     80:31873/TCP   1m
azure-vote-front   10.0.42.158   52.179.23.131 80:31873/TCP   2m
```

To see the application, browse to the external IP address.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/azure-vote.png)

## Next steps

In this tutorial, the Azure vote application was deployed to an Azure Container Service Kubernetes cluster. Tasks completed include:  

> [!div class="checklist"]
> * Download Kubernetes manifest files
> * Run the application in Kubernetes
> * Tested the application

Advance to the next tutorial to learn about scaling both a Kubernetes application and the underlying Kubernetes infrastructure. 

> [!div class="nextstepaction"]
> [Scale Kubernetes application and infrastructure](./container-service-tutorial-kubernetes-scale.md)
