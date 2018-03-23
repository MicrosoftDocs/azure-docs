---
title: "How to use kubectl with a Connected Environment | Microsoft Docs"
author: "ghogen"
ms.author: "ghogen"
ms.date: "03/12/2018"
ms.topic: "article"

description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "douge"
---
# Use `kubectl` with a Connected Environment

You can access the Kubernetes cluster within a Connected Environment, and use existing Kubernetes tools like `kubectl`.

Running `vsce env create` or `vsce env select` will automatically add a `kubectl` configuration context for you, so kubectl should already be connected to your VSCE Kubernetes cluster. Examples:
- Confirm the current context: `kubectl config current-context`
- List all available contexts: `kubectl config get-contexts`. A kubernetes cluster created by VSCE will be named something like "vsce-<guid>".
- Change context: `kubectl config use-context <context-name>`
- View the Kubernetes dashboard: run `kubectl proxy`, then open your browser to the address that this command emits (append `/ui` to the URL to navigate to the Kubernetes dashboard).
- List the running services in the default VSCE space named *mainline*: `kubectl get services --namespace=mainline`

