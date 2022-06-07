---
title: "Move Arc-enabled Kubernetes clusters between regions"
services: azure-arc
ms.service: azure-arc
ms.date: 03/03/2021
ms.topic: how-to
ms.custom: subject-moving-resources
author: anraghun
ms.author: anraghun
description: "Manually move your Azure Arc-enabled Kubernetes between regions"
keywords: "Kubernetes, Arc, Azure, K8s, containers, region, move"
#Customer intent: As a Kubernetes cluster administrator, I want to move my Arc-enabled Kubernetes cluster to another Azure region.
---

# Move Arc-enabled Kubernetes clusters across Azure regions

This article describes how to move Arc-enabled Kubernetes clusters (or connected cluster resources) to a different Azure region. You might move your resources to another region for a number of reasons. For example, to take advantage of a new Azure region, to deploy features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements.

## Prerequisites

- Ensure that Azure Arc-enabled Kubernetes resource (Microsoft.Kubernetes/connectedClusters) is supported in the target region.
- Ensure that Azure Arc-enabled Kubernetes configuration (Microsoft.KubernetesConfiguration/SourceControlConfigurations, Microsoft.KubernetesConfiguration/Extensions, Microsoft.KubernetesConfiguration/FluxConfigurations) resources are supported in the target region. 
- Ensure that the Arc-enabled services you've deployed on top are supported in the target region.
- Ensure you have network access to the api server of your underlying Kubernetes cluster.

## Prepare

Before you begin, it's important to understand what moving these resources mean.

### Kubernetes configurations

Source control configurations, Flux configurations and extensions are child resources to the connected cluster resource. In order to move these resources, you'll first need to move the parent connected cluster resource.

### Connected cluster 

The connectedClusters resource is the ARM representation of your Kubernetes clusters outside of Azure (on-premises, another cloud, edge...). The underlying infrastructure lies in your environment and Arc provides a first-class representation of the cluster on Azure, by installing agents on your cluster.

When it comes to "moving" your Arc connected cluster, it means deleting the ARM resource in the source region, cleaning up the agents on your cluster and re-onboarding your cluster again in the target region.

## Move

### Kubernetes configurations

1. Do a LIST of all configuration resources in the source cluster (the cluster to be moved) and save the response body to be used as the request body when re-creating these resources.
    - [Microsoft.KubernetesConfiguration/SourceControlConfigurations](/cli/azure/k8s-configuration?view=azure-cli-latest&preserve-view=true#az-k8sconfiguration-list)
    - [Microsoft.KubernetesConfiguration/Extensions](/cli/azure/k8s-extension?view=azure-cli-latest&preserve-view=true#az-k8s-extension-list)
    - [Microsoft.KubernetesConfiguration/FluxConfigurations](/cli/azure/k8s-configuration/flux?view=azure-cli-latest&preserve-view=true#az-k8s-configuration-flux-list)
    > [!NOTE]
    > LIST/GET of configuration resources **do not** return `ConfigurationProtectedSettings`.
    > For such cases, the only option is to save the original request body and reuse them while creating the resources in the new region.
2. [Delete](./move-regions.md#kubernetes-configurations-3) the above configuration resources.
2. Ensure the Arc connected cluster is up and running in the new region. This is the target cluster.
3. Re-create each of the configuration resources obtained in the LIST command from the source cluster on the target cluster.

### Connected cluster

1. [Delete](./move-regions.md#connected-cluster-3) the previous Arc deployment from the underlying Kubernetes cluster.
2. With network access to the underlying Kubernetes cluster, run [this command](./quickstart-connect-cluster.md?tabs=azure-cli#connect-an-existing-kubernetes-cluster) to create the Arc connected cluster in the new region.
> [!NOTE]
> The above command creates the cluster by default in the same location as its resource group.
> Use the `--location` parameter to explicitly provide the target region value.

## Verify

### Kubernetes configurations

Do a LIST of all configuration resources in the target cluster. This should match the LIST response from the source cluster.

### Connected cluster

1. Run `az connectedk8s show -n <connected-cluster-name> -g <resource-group>` and ensure the `connectivityStatus` value is `Connected`.
2. Run [this command](./quickstart-connect-cluster.md?tabs=azure-cli#view-azure-arc-agents-for-kubernetes) to verify all Arc agents are successfully deployed on the underlying cluster.

## Clean up source resources

### Kubernetes configurations

Delete each of the configuration resources returned in the LIST command in the source cluster:
- [Microsoft.KubernetesConfiguration/SourceControlConfigurations](/cli/azure/k8s-configuration?view=azure-cli-latest&preserve-view=true#az-k8s-configuration-delete)
- [Microsoft.KubernetesConfiguration/Extensions](/cli/azure/k8s-extension?view=azure-cli-latest&preserve-view=true#az-k8s-extension-delete)
- [Microsoft.KubernetesConfiguration/FluxConfigurations](/cli/azure/k8s-configuration/flux?view=azure-cli-latest&preserve-view=true#az-k8s-configuration-flux-delete)

> [!NOTE]
> This step may be skipped if the parent Arc connected cluster is also being deleted. Doing so would automatically remove the configuration resources on top.

### Connected cluster

With network access to the underlying Kubernetes cluster, run [this command](./quickstart-connect-cluster.md?tabs=azure-cli#clean-up-resources) to delete the Arc connected cluster. This command will clean up the Arc footprint on the underlying cluster as well as on ARM.