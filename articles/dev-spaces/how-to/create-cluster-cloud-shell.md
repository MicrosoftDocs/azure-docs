---
title: "How to create a Kubernetes cluster enabled for Azure Dev Spaces using Azure Cloud Shell"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
author: zr-msft
ms.author: zarhoads
ms.date: "10/04/2018"
ms.topic: "conceptual"
description: "Learn how to quickly create a Kubernetes cluster enabled for Azure Dev Spaces directly from your browser without installing anything."
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s"
---
# Create a Kubernetes cluster using Azure Cloud Shell

You can use [Azure Cloud Shell](/azure/cloud-shell) to create an Azure Kubernetes Service cluster by using the **Try It** button from this page. If you aren't signed in, follow the prompts to sign in with an Azure account, then type the commands at the Azure Cloud Shell prompt when it appears.

## Create the cluster

First, create the resource group in a [region that supports Azure Dev Spaces][supported-regions].

```azurecli-interactive
az group create --name MyResourceGroup --location <region>
```

Create a Kubernetes cluster with the following command:

```azurecli-interactive
az aks create -g MyResourceGroup -n MyAKS --location <region> --disable-rbac --generate-ssh-keys
```

It takes a few minutes to create the cluster.  When complete, the output is shown in the JSON format. Look for `provisioningState` and verify it's `Succeeded`.

## Next steps

See [Azure Dev Spaces](/azure/dev-spaces/) for links to full tutorials.

> [!IMPORTANT]
> Many of the Azure Dev Spaces quickstarts and tutorials use the Azure Dev Spaces CLI to perform operations. You cannot install the Azure Dev Spaces CLI in the Azure Cloud Shell.


[supported-regions]: ../about.md#supported-regions-and-configurations