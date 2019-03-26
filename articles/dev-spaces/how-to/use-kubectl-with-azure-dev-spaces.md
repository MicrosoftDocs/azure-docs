---
title: "How to use kubectl with Azure Dev Spaces"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
author: zr-msft
ms.author: zarhoads
ms.date: "05/11/2018"
ms.topic: "conceptual"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s "
---
# Use kubectl with an Azure Dev Space

You can access the Kubernetes cluster within an Azure Dev Space, and use existing Kubernetes tools like `kubectl`.

Running `az aks use-dev-spaces` command will automatically add a `kubectl` configuration context for you, so kubectl should already be connected to your Azure Dev Spaces Kubernetes cluster. Examples:
- Confirm the current context: `kubectl config current-context`
- List all available contexts: `kubectl config get-contexts`. 
- Change context: `kubectl config use-context <context-name>`
- View the Kubernetes dashboard: run `kubectl proxy`, then open your browser to the address that this command emits (append `/ui` to the URL to navigate to the Kubernetes dashboard).
- List the running services in the default Azure Dev Spaces space named *default*: `kubectl get services --namespace=default`

