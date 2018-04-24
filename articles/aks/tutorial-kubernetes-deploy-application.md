---
title: Kubernetes on Azure tutorial  - Deploy Application
description: AKS tutorial - Deploy Application
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: tutorial
ms.date: 02/22/2018
ms.author: nepeters
ms.custom: mvc
---

# Tutorial: Run applications in Azure Kubernetes Service (AKS)

In this tutorial, part four of eight, a sample application is deployed into a Kubernetes cluster. Steps completed include:

> [!div class="checklist"]
> * Update Kubernetes manifest files
> * Run application in Kubernetes
> * Test the application

In subsequent tutorials, this application is scaled out, updated, and Log Analytics is configured to monitor the Kubernetes cluster.

This tutorial assumes a basic understanding of Kubernetes concepts, for detailed information on Kubernetes see the [Kubernetes documentation][kubernetes-documentation].

## Before you begin

In previous tutorials, an application was packaged into a container image, this image was uploaded to Azure Container Registry, and a Kubernetes cluster was created.

To complete this tutorial, you need the pre-created `azure-vote-all-in-one-redis.yaml` Kubernetes manifest file. This file was downloaded with the application source code in a previous tutorial. Verify that you have cloned the repo, and that you have changed directories into the cloned repo.

If you have not done these steps, and would like to follow along, return to [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

## Update manifest file

In this tutorial, Azure Container Registry (ACR) has been used to store a container image. Before running the application, the ACR login server name needs to be updated in the Kubernetes manifest file.

Get the ACR login server name with the [az acr list][az-acr-list] command.

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

The manifest file has been pre-created with a login server name of `microsoft`. Open the file with any text editor. In this example, the file is opened with `nano`.

```console
nano azure-vote-all-in-one-redis.yaml
```

Replace `microsoft` with the ACR login server name. This value is found on line **47** of the manifest file.

```yaml
containers:
- name: azure-vote-front
  image: microsoft/azure-vote-front:v1
```

The above code then becomes.

```yaml
containers:
- name: azure-vote-front
  image: <acrName>.azurecr.io/azure-vote-front:v1
```

Save and close the file.

## Deploy application

Use the [kubectl create][kubectl-create] command to run the application. This command parses the manifest file and creates the defined Kubernetes objects.

```azurecli
kubectl create -f azure-vote-all-in-one-redis.yaml
```

Output:

```
deployment "azure-vote-back" created
service "azure-vote-back" created
deployment "azure-vote-front" created
service "azure-vote-front" created
```

## Test application

A [Kubernetes service][kubernetes-service] is created which exposes the application to the internet. This process can take a few minutes.

To monitor progress, use the [kubectl get service][kubectl-get] command with the `--watch` argument.

```azurecli
kubectl get service azure-vote-front --watch
```

Initially the *EXTERNAL-IP* for the *azure-vote-front* service appears as *pending*.

```
azure-vote-front   10.0.34.242   <pending>     80:30676/TCP   7s
```

Once the *EXTERNAL-IP* address has changed from *pending* to an *IP address*, use `CTRL-C` to stop the kubectl watch process.

```
azure-vote-front   10.0.34.242   52.179.23.131   80:30676/TCP   2m
```

To see the application, browse to the external IP address.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/azure-vote.png)

If the application did not load, it might be due to an authorization problem with your image registry.

Please follow these steps to [allow access via a Kubernetes secret](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-auth-aks#access-with-kubernetes-secret).

## Next steps

In this tutorial, the Azure vote application was deployed to a Kubernetes cluster in AKS. Tasks completed include:

> [!div class="checklist"]
> * Download Kubernetes manifest files
> * Run the application in Kubernetes
> * Tested the application

Advance to the next tutorial to learn about scaling both a Kubernetes application and the underlying Kubernetes infrastructure.

> [!div class="nextstepaction"]
> [Scale Kubernetes application and infrastructure][aks-tutorial-scale]

<!-- LINKS - external -->
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-documentation]: https://kubernetes.io/docs/home/
[kubernetes-service]: https://kubernetes.io/docs/concepts/services-networking/service/

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[aks-tutorial-scale]: ./tutorial-kubernetes-scale.md
[az-acr-list]: /cli/azure/acr#list
