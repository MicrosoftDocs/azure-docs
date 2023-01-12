---
title: "Move Arc-enabled Kubernetes clusters between regions"
ms.date: 12/20/2022
ms.topic: how-to
ms.custom: subject-moving-resources
description: "Manually move your Azure Arc-enabled Kubernetes and connected cluster resources between regions."
---

# Move Arc-enabled Kubernetes clusters across Azure regions

In some circumstances, you may want to move your [Arc-enabled Kubernetes clusters](overview.md) to another region. For example, you might want to deploy features or services that are only available in specific regions, or you need to change regions due to internal policy and governance requirements or capacity planning considerations.

This article describes how to move Arc-enabled Kubernetes clusters and any connected cluster resources to a different Azure region.

## Prerequisites

- Ensure that Azure Arc-enabled Kubernetes resources (`Microsoft.Kubernetes/connectedClusters`) are [supported in the target region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-arc).
- Ensure that any Azure Arc-enabled Kubernetes configuration resources (`Microsoft.KubernetesConfiguration/SourceControlConfigurations`, `Microsoft.KubernetesConfiguration/Extensions`, `Microsoft.KubernetesConfiguration/FluxConfigurations`) are supported in the target region.
- Ensure that the Arc-enabled services you've deployed on top of the cluster are supported in the target region.
- Ensure you have network access to the API server of your underlying Kubernetes cluster.

## Prepare

Before you begin, it's important to understand what moving these resources involves.

The `connectedClusters` resource is the Azure Resource Manager representation of a Kubernetes cluster outside of Azure (such as on-premises, another cloud, or edge). The underlying infrastructure lies in your environment, and Azure Arc provides a representation of the cluster on Azure by installing agents on the cluster.

Moving a connected cluster to a new region means deleting the ARM resource in the source region, cleaning up the agents on your cluster, and then connecting your cluster again in the target region.

Source control configurations, [Flux configurations](conceptual-gitops-flux2.md) and [extensions](conceptual-extensions.md) within the cluster are child resources of the connected cluster resource. To move these resources, you'll need to save details about the resources, then move the parent `connectedClusters` resource. After that, you can recreate the child resources in the target cluster resource.

## Move

1. Do a LIST to get all configuration resources in the source cluster (the cluster to be moved) and save the response body:

   - [Microsoft.KubernetesConfiguration/SourceControlConfigurations](/cli/azure/k8s-configuration?view=azure-cli-latest&preserve-view=true#az-k8sconfiguration-list)
   - [Microsoft.KubernetesConfiguration/Extensions](/cli/azure/k8s-extension?view=azure-cli-latest&preserve-view=true#az-k8s-extension-list)
   - [Microsoft.KubernetesConfiguration/FluxConfigurations](/cli/azure/k8s-configuration/flux?view=azure-cli-latest&preserve-view=true#az-k8s-configuration-flux-list)

   > [!NOTE]
   > LIST/GET of configuration resources **do not** return `ConfigurationProtectedSettings`. For such cases, the only option is to save the original request body and reuse them while creating the resources in the new region.

1. [Delete](./move-regions.md#clean-up-source-resources) the previous Arc deployment from the underlying Kubernetes cluster.
1. With network access to the underlying Kubernetes cluster, run [this command](./quickstart-connect-cluster.md?tabs=azure-cli#connect-an-existing-kubernetes-cluster) to connect that cluster in the new region.

   > [!NOTE]
   > The above command creates the cluster by default in the same location as its resource group. Use the `--location` parameter to explicitly provide the target region value.

1. [Verify](#verify) that the Arc connected cluster is successfully running in the new region. This is the target cluster.
1. Using the response body you saved, recreate each of the configuration resources obtained in the LIST command from the source cluster on the target cluster.

If you don't need to move the cluster, but want to move configuration resources to an Arc-enabled Kubernetes cluster in a different region, do the following:

1. Do a LIST to get all configuration resources in the source cluster as noted above, and save the response body.
1. Delete the resources from the source cluster.
1. In the target cluster, recreate each of the configuration resources obtained in the LIST command from the source cluster.

## Verify

1. Run `az connectedk8s show -n <connected-cluster-name> -g <resource-group>` and ensure the `connectivityStatus` value is `Connected`.
1. Run [this command](./quickstart-connect-cluster.md?tabs=azure-cli#view-azure-arc-agents-for-kubernetes) to verify all Arc agents are successfully deployed on the underlying cluster.
1. Do a LIST of all configuration resources in the target cluster. This should match the original LIST response from the source cluster.

## Clean up source resources

With network access to the underlying Kubernetes cluster, run [this command](./quickstart-connect-cluster.md?tabs=azure-cli#clean-up-resources) to delete the Arc connected cluster. This command deletes the Azure Arc-enabled Kubernetes cluster resource, any associated configuration resources, and any agents running on the cluster.

If you need to delete individual configuration resources in the source cluster without deleting the cluster resource, you can delete these resources individually:

- [Microsoft.KubernetesConfiguration/SourceControlConfigurations](/cli/azure/k8s-configuration?view=azure-cli-latest&preserve-view=true#az-k8s-configuration-delete)
- [Microsoft.KubernetesConfiguration/Extensions](/cli/azure/k8s-extension?view=azure-cli-latest&preserve-view=true#az-k8s-extension-delete)
- [Microsoft.KubernetesConfiguration/FluxConfigurations](/cli/azure/k8s-configuration/flux?view=azure-cli-latest&preserve-view=true#az-k8s-configuration-flux-delete)
