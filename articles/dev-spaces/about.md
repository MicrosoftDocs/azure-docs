---
title: "Introduction to Azure Dev Spaces"
titleSuffix: Azure Dev Spaces
author: zr-msft
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.author: zarhoads
ms.date: 05/07/2019
ms.topic: "overview"
description: "Introduction to Azure Dev Spaces"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, kubectl, k8s"
manager: gwallace
---

# Azure Dev Spaces

Azure Dev Spaces is a rapid, iterative Kubernetes development experience for teams in Azure Kubernetes Service (AKS) clusters. You can collaborate with your team in a shared AKS cluster. Azure Dev Spaces also allows you to test all the components of your application in AKS without replicating or mocking up dependencies. You can iteratively run and debug containers directly in AKS with minimal development machine setup.

![](media/azure-dev-spaces/collaborate-graphic.gif)


## How Azure Dev Spaces simplifies Kubernetes development

Azure Dev Spaces helps teams to focus on the development and rapid iteration of their microservice application by allowing teams to work directly with their entire microservices architecture or application running in AKS. Azure Dev Spaces also provides a way to independently update portions of your microservices architecture in isolation without affecting the rest of the AKS cluster or other developers. Azure Dev Spaces is for development and testing in lower-level development and testing environments and is not intended to run on production AKS clusters.

Since teams can work with the entire application and collaborate directly in AKS, Azure Dev Spaces:

* Minimizes local machine setup
* Decreases setup time for new developers on the team
* Increases a team's velocity through faster iteration
* Reduces the number of redundant development and integration environments since team members can share a cluster
* Removes the need to replicate or mock up dependencies
* Improves collaboration across development teams as well as the teams they work with, such as DevOps teams

Azure Dev Spaces provides tooling to generate Docker and Kubernetes assets for your projects. This tooling allows you to easily add new and existing applications to both a dev space and other AKS clusters.

For more information on how Azure Dev Spaces works, see [How Azure Dev Spaces works and is configured][how-dev-spaces-works].

## Supported regions and configurations

Azure Dev Spaces is supported only by AKS clusters in the **East US**, **East US 2**, **Central US**, **West US 2**, **North Europe**, **West Europe**, **UK South**, **Southeast Asia**, **Australia East**, **Canada Central**, and **Canada East** regions. Azure Dev Spaces supports using the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) or [Visual Studio Code](https://code.visualstudio.com/download) with the [Azure Dev Spaces extension](https://marketplace.visualstudio.com/items?itemName=azuredevspaces.azds) installed on Linux, MacOS, or Windows 8 or greater to build and run your applications on AKS. It also supports using [Visual Studio](https://aka.ms/vsdownload?utm_source=mscom&utm_campaign=msdocs) installed on Windows 8 or greater. For Visual Studio 2019, you will need the Azure Development workload. For Visual Studio 2017, you will need the Web Development workload and [Visual Studio Tools for Kubernetes](https://aka.ms/get-vsk8stools).

## Next steps

Learn more about rapid, iterative development for teams with Azure Dev Spaces with the team development quickstart.

> [!div class="nextstepaction"]
> [Team Development quickstart](quickstart-team-development.md)


[how-dev-spaces-works]: how-dev-spaces-works.md
[team-development-quickstart]: quickstart-team-development.md
