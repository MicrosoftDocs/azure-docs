---
title: Introduction to Azure Kubernetes Service
description: Azure Kubernetes Service makes it simple to deploy and manage container-based applications on Azure.
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: overview
ms.date: 06/13/2018
ms.author: iainfou
ms.custom: mvc
---

# Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) makes it simple to deploy a managed Kubernetes cluster in Azure. AKS reduces the complexity and operational overhead of managing Kubernetes by offloading much of that responsibility to Azure. As a hosted Kubernetes service, Azure handles critical tasks like health monitoring and maintenance for you. In addition, the service is free, you only pay for the agent nodes within your clusters, not for the masters.

This document provides an overview on the features of Azure Kubernetes Service (AKS).

## Flexible deployment options

Azure Kubernetes Service offers portal, command line, and template driven deployment options (Resource Manager templates and Terraform). When deploying an AKS cluster, the Kubernetes master and all nodes are deployed and configured for you. Additional features such as advanced networking, Azure Active Directory integration, and monitoring can also be configured during the deployment process.

For more information, see both the [AKS portal quickstart][aks-portal] or the [AKS CLI quickstart][aks-cli].

## Identity and security management

AKS clusters support [Role-Based Access Control (RBAC)][kubernetes-rbac]. An AKS cluster can also be configured to integrate with Azure Active Directory. In this configuration, Kubernetes access can be configured based on Azure Active Directory identity and group membership.

For more information, see, [Integrate Azure Active Directory with AKS][aks-aad].

## Integrated logging and monitoring

Container health gives you performance visibility by collecting memory and processor metrics from containers, nodes, and controllers. Container logs are also collected. This data is stored in your Log Analytics workspace, and is available through the Azure portal, Azure CLI, or a REST endpoint.

For more information, see [Monitor Azure Kubernetes Service container health][container-health].

## Cluster node scaling

As demand for resources increases, the nodes of an AKS cluster can be scaled out to match. If resource demand drops, nodes can be removed by scaling in the cluster. AKS scale operations can be completed using the Azure portal or the Azure CLI.

For more information, see [Scale an Azure Kubernetes Service (AKS) cluster][aks-scale].

## Cluster node upgrades

Azure Kubernetes Service offers multiple Kubernetes versions. As new versions become available in AKS, your cluster can be upgraded using the Azure portal or Azure CLI. During the upgrade process, nodes are carefully cordoned and drained to minimize disruption to running applications.

For more information, see [Upgrade an Azure Kubernetes Service (AKS) cluster][aks-upgrade].

## HTTP application routing

The HTTP Application Routing solution makes it easy to access applications deployed to your AKS cluster. When enabled, the HTTP application routing solution configures an ingress controller in your AKS cluster. As applications are deployed, publicly accessible DNS names are auto configured.

For more information, see [HTTP application routing][aks-http-routing].

## GPU enabled nodes

AKS supports the creation of GPU enabled node pools. Azure currently provides single or multiple GPU enabled VMs. GPU enabled VMs are designed for compute-intensive, graphics-intensive, and visualization workloads.

For more information, see [Using GPUs on AKS][aks-gpu].

## Development tooling integration

Kubernetes has a rich ecosystem of development and management tools such as Helm, Draft, and the Kubernetes extension for Visual Studio Code. These tools work seamlessly with Azure Kubernetes Service.

Additionally, Azure Dev Spaces provides a rapid, iterative Kubernetes development experience for teams. With minimal configuration, you can run and debug containers directly in Azure Kubernetes Service (AKS).

For more information, see [Azure Dev Spaces][azure-dev-spaces].

Azure DevOps project provides a simple solution for bringing existing code and Git repository into Azure. The DevOps project automatically creates Azure resources such as AKS, a release pipeline in Azure DevOps Services that includes a build pipeline for CI, sets up a release pipeline for CD, and then creates an Azure Application Insights resource for monitoring.

For more information, see [Azure DevOps project][azure-devops].

## Virtual network integration

An AKS cluster can be deployed into an existing VNet. In this configuration, every pod in the cluster is assigned an IP address in the VNet, and can directly communicate with other pods in the cluster, and other nodes in the VNet. Pods can connect also to other services in a peered VNet, and to on-premises networks over ExpressRoute and site-to-site (S2S) VPN connections.

For more information, see the [AKS networking overview][aks-networking].

## Private container registry

Integrate with Azure Container Registry (ACR) for private storage of your Docker images.

For more information, see [Azure Container Registry (ACR)][acr-docs].

## Storage volume support

Azure Kubernetes Service (AKS) support mounting storage volumes for persistent data. AKS clusters are created with support for Azure Files and Azure Disks.

For more information, see [Azure Files][azure-files] and [Azure Disks][azure-disk].

## Docker image support

Azure Kubernetes Service (AKS) supports the Docker image format.

## Kubernetes certification

Azure Kubernetes Service (AKS) has been CNCF certified as Kubernetes conformant.

## Regulatory compliance

Azure Kubernetes Service (AKS) is compliant with SOC, ISO, and PCI DSS.

## Next steps

Learn more about deploying and managing AKS with the AKS quickstart.

> [!div class="nextstepaction"]
> [AKS quickstart][aks-cli]

<!-- LINKS - external -->
[acs-engine]: https://github.com/Azure/acs-engine
[draft]: https://github.com/Azure/draft
[helm]: https://helm.sh/
[kubectl-overview]: https://kubernetes.io/docs/user-guide/kubectl-overview/
[kubernetes-rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/

<!-- LINKS - internal -->
[acr-docs]: ../container-registry/container-registry-intro.md
[aks-aad]: ./aad-integration.md
[aks-cli]: ./kubernetes-walkthrough.md
[aks-gpu]: ./gpu-cluster.md
[aks-http-routing]: ./http-application-routing.md
[aks-networking]: ./networking-overview.md
[aks-portal]: ./kubernetes-walkthrough-portal.md
[aks-scale]: ./scale-cluster.md
[aks-upgrade]: ./upgrade-cluster.md
[azure-dev-spaces]: https://docs.microsoft.com/en-us/azure/dev-spaces/azure-dev-spaces
[azure-devops]: https://docs.microsoft.com/en-us/azure/devops-project/overview
[azure-disk]: ./azure-disks-dynamic-pv.md
[azure-files]: ./azure-files-dynamic-pv.md
[container-health]: ../monitoring/monitoring-container-health.md

