---
title: "Configurations and GitOps"
services: azure-arc
ms.service: azure-arc
ms.date: 02/08/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article provides a conceptual overview of GitOps and configurations capability of Azure Arc enabled Kubernetes."
keywords: "Kubernetes, Arc, Azure, containers, configuration, GitOps"
---

# Configurations and GitOps

## GitOps

In relation to Kubernetes, GitOps is the practice of declaring the desired state of Kubernetes configuration in a Git repository followed by a polling and pull-based deployment of these configurations to the cluster using an operator. The Git repository can contain YAML-format manifests that describe any valid Kubernetes resources, including Namespaces, ConfigMaps, Deployments, DaemonSets, etc. It may also contain Helm charts for deploying applications.

[Flux](https://docs.fluxcd.io/), a popular open-source tool in the space of GitOps, can be deployed on the Kubernetes cluster to facilitate such flow of desired configurations from a Git repo to a Kubernetes cluster. Flux supports deployment of its operator at both cluster and namespace scope. A flux operator deployed with namespace scope is only able to deploy Kubernetes objects within that specific namespace and is not allowed to do so in other namespaces. The choice of cluster/namespace scope is useful in being able to achieve multi-tenant deployment patterns on the same Kubernetes cluster.

## Configurations

![Configurations architecture](./media/conceptual-configurations.png)

The connection between your cluster and a Git repository is created as a `Microsoft.KubernetesConfiguration/sourceControlConfigurations` extension resource on top of the Azure Arc enabled Kubernetes resource (represented by `Microsoft.Kubernetes/connectedClusters`) in Azure Resource Manager. The `sourceControlConfiguration` resource properties are used to deploy Flux operator on the cluster with the appropriate parameters such as which Git repo to pull manifests from and what polling interval to pull them at. The `sourceControlConfiguration` data is stored encrypted, at rest in an Azure Cosmos DB database to ensure data confidentiality.

The `config-agent` running in your cluster is responsible for watching for:
* Tracking new or updated `sourceControlConfiguration` extension resources on the Azure Arc enabled Kubernetes resource
* For deploying a Flux operator to watch the Git repository for each `sourceControlConfiguration`
* Applying any updates made to any `sourceControlConfiguration`. 

It is possible to create multiple namespace scoped `sourceControlConfiguration` resources on the same Azure Arc enabled Kubernetes cluster to achieve multi-tenancy.

> [!NOTE]
> 1. Because the config-agent needs to watch for new or updated `sourceControlConfiguration` extension resources to be available on Azure Arc enabled Kubernetes resource, the agents needs to obtain connectivity for the desired state to be pulled down to the cluster. So during the course of time when the agents weren't able to connect to Azure, the desired state properties declared on the `sourceControlConfiguration` resource in Azure Resource Manager are not applied on the cluster.
> 2. Sensitive customer inputs like private key, known hosts content, HTTPS username, token/password are not stored for greater than 48 hours in the Azure Arc enabled Kubernetes services. It is thus advisable to have the clusters come online as regularly as possible, especially if such sensitive inputs are being used for configurations.

## At-scale enforcement of configurations

The Azure Resource Manager representation of configurations makes it possible to use Azure Policy to automate the creation of the same configuration on top of all Azure Arc enabled Kubernetes resources within the scope of a subscription or a resource group. 

This at-scale enforcement is particularly useful in ensuring that a common baseline configuration that can include configurations like ClusterRoleBindings, RoleBindings, NetworkPolicy to be applied across the entire fleet/inventory of Azure Arc enabled Kubernetes clusters.
