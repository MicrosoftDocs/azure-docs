---
title: "What is Azure Dev Spaces?"
services: azure-dev-spaces
ms.date: 05/26/2021
ms.topic: "overview"
description: "Learn how Azure Dev Spaces provides a rapid, iterative Kubernetes development experience for teams in Azure Kubernetes Service clusters"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, kubectl, k8s"
manager: gwallace
#Customer intent: As a developer, I want understand what Azure Dev Spaces is so that I can use it.
---

# What is Azure Dev Spaces?

> [!IMPORTANT]
> Azure Dev Spaces is retired as of May 15, 2021. Customers should use [Bridge to Kubernetes](/visualstudio/containers/overview-bridge-to-kubernetes?view=vs-2019).

Azure Dev Spaces provides a rapid, iterative Kubernetes development experience for teams in Azure Kubernetes Service (AKS) clusters. Azure Dev Spaces also allows you to debug and test all the components of your application in AKS with minimal development machine setup, without replicating or mocking up dependencies.

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

## Next steps

> [!div class="nextstepaction"]
> [Bridge to Kubernetes](/visualstudio/containers/overview-bridge-to-kubernetes?view=vs-2019)