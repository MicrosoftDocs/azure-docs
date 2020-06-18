---
title: "What is Azure Dev Spaces?"
services: azure-dev-spaces
ms.date: 05/07/2019
ms.topic: "overview"
description: "Learn how Azure Dev Spaces provides a rapid, iterative Kubernetes development experience for teams in Azure Kubernetes Service clusters"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, kubectl, k8s"
manager: gwallace
#Customer intent: As a developer, I want understand what Azure Dev Spaces is so that I can use it.
---

# What is Azure Dev Spaces?

Azure Dev Spaces provides a rapid, iterative Kubernetes development experience for teams in Azure Kubernetes Service (AKS) clusters. Azure Dev Spaces also allows you to debug and test all the components of your application in AKS with minimal development machine setup, without replicating or mocking up dependencies.

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

Azure Dev Spaces is supported only by AKS clusters in [some regions][supported-regions]. Azure Dev Spaces supports using the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) or [Visual Studio Code](https://code.visualstudio.com/download) with the [Azure Dev Spaces extension](https://marketplace.visualstudio.com/items?itemName=azuredevspaces.azds) installed on Linux, macOS, or Windows 8 or greater to build and run your applications on AKS. It also supports using [Visual Studio 2019](https://aka.ms/vsdownload?utm_source=mscom&utm_campaign=msdocs) installed on Windows with the Azure Development workload.

## Next steps

Learn more about rapid, iterative development for teams with Azure Dev Spaces with the [team development quickstart][team-development-quickstart].

[how-dev-spaces-works]: how-dev-spaces-works.md
[supported-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service
[team-development-quickstart]: quickstart-team-development.md
