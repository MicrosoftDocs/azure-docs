---
title: Introduction to Azure Kubernetes Service
description: Azure Kubernetes Service makes it simple to deploy and manage container-based applications on Azure.
services: container-service
author: neilpeterson
manager: jeconnoc

ms.service: container-service
ms.topic: overview
ms.date: 06/13/2018
ms.author: nepeters
ms.custom: mvc
---

# Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) makes it simple to create, configure, and manage a cluster of virtual machines that are preconfigured to run containerized applications. This enables you to use your existing skills, or draw upon a large and growing body of community expertise, to deploy and manage container-based applications on Microsoft Azure.

By using AKS, you can take advantage of the enterprise-grade features of Azure, while still maintaining application portability through Kubernetes and the Docker image format.

## Managed Kubernetes in Azure

AKS reduces the complexity and operational overhead of managing a Kubernetes cluster by offloading much of that responsibility to Azure. As a hosted Kubernetes service, Azure handles critical tasks like health monitoring and maintenance for you. In addition, you pay only for the agent nodes within your clusters, not for the masters.

## Using Azure Kubernetes Service (AKS)

The goal of AKS is to provide a container hosting environment by using open-source tools and technologies that are popular among customers today. To this end, we expose the standard Kubernetes API endpoints. By using these standard endpoints, you can leverage any software that is capable of talking to a Kubernetes cluster. For example, you might choose [kubectl][kubectl-overview], [helm][helm], or [draft][draft].

## Flexible deployment options

Azure Kubernetes Service offers a portal, command line, and template driven deployment options. When deploying an AKS cluster, the master and all nodes are deployed and configured for you. Additional features such as advanced networking, Azure Active Directory integration, and logging and monitoring can be configured during the deployment process.

For more information, see both the [AKS portal quickstart][aks-portal] and the [AKS CLI quickstart][aks-cli].

## Identity and security management

AKS clusters are RBAC enabled by default. An AKS cluster can also be configured to integrate with Azure Active Directory. In this configuration Kubernetes access can be configured based on Azure Active Directory identity and group membership.

For more information, see, [Integrate Azure Active Directory with AKS][aks-aad].

## Integrated logging and monitoring

Container health gives you performance monitoring ability by collecting memory and processor metrics from controllers, nodes, and containers available in Kubernetes through the Metrics API. After enabling container health, these metrics are automatically collected for you using a containerized version of the OMS Agent for Linux and stored in your Log Analytics workspace.

For more information, see [Monitor Azure Kubernetes Service container health][container-health].

## Cluster scaling

## Cluster upgrades

## HTTP application routing

## GPU enabled nodes

## Private container registry

## Next steps

Learn more about deploying and managing AKS with the AKS quickstart.

> [!div class="nextstepaction"]
> [AKS Tutorial][aks-quickstart]

<!-- LINKS - external -->
[acs-engine]: https://github.com/Azure/acs-engine
[draft]: https://github.com/Azure/draft
[helm]: https://helm.sh/
[kubectl-overview]: https://kubernetes.io/docs/user-guide/kubectl-overview/

<!-- LINKS - internal -->
[aks-aad]: ./aad-integration.md
[aks-cli]: ./kubernetes-walkthrough.md
[aks-portal]: ./kubernetes-walkthrough-portal.md
[container-health]: ../monitoring/monitoring-container-health.md

