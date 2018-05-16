---
title: "Azure Dev Spaces | Microsoft Docs"
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "tutorial"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
manager: "douge"
---
# Azure Dev Spaces
Azure Dev Spaces helps you develop with speed on Kubernetes. With Azure Dev Spaces, you also add full development capabilities such as debugging to your Azure Kubernetes containers, and you can iteratively develop containers in the cloud using familiar tools like VS Code, Visual Studio, or the command line. Azure Dev Spaces is especially relevant in team development where isolation of individual code branches in their own spaces is a critical part of the development lifecycle.

## How Azure Dev Spaces simplifies Kubernetes development 

This approach carries several benefits:

* Get an infrastructure-less development environment that is representative of production, with full access to cloud resources.
* Debug Node.js and .NET Core containers directly in Kubernetes with VS Code or Visual Studio. All other languages can be developed with the command-line interface.
* Share a Kubernetes instance across your development team to save costs and to minimize local machine setup for new team members.
* Develop your code in isolation, and do end-to-end testing with other components without replicating or mocking up dependencies.

[!INCLUDE[](includes/get-started.md)]

![](media/azure-dev-spaces/vscode-overview.png)