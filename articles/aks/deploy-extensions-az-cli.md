---
title: Deploy and manage cluster extensions by using the Azure CLI
description: Learn how to use Azure CLI to deploy and manage extensions for Azure Kubernetes Service clusters.
ms.date: 05/15/2023
ms.topic: article
ms.custom: devx-track-azurecli
author: JnHs
ms.author: jenhayes
---

# Deploy and manage cluster extensions by using Azure CLI

You can create extension instances in an AKS cluster, setting required and optional parameters including options related to updates and configurations. You can also view, list, update, and delete extension instances.

Before you begin, read about [cluster extensions](cluster-extensions.md).

> [!NOTE]
>The examples provided in this article are not complete, and are only meant to showcase functionality. For a comprehensive list of commands and their parameters, see the [az k8s-extension CLI reference](/cli/azure/k8s-extension).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* The `Microsoft.ContainerService` and `Microsoft.KubernetesConfiguration` resource providers must be registered on your subscription. To register these providers, run the following command:

  ```azurecli-interactive
  az provider register --namespace Microsoft.ContainerService --wait 
  az provider register --namespace Microsoft.KubernetesConfiguration --wait 
  ```

* An AKS cluster. This cluster must have been created with a managed identity, as cluster extensions won't work with service principal-based clusters. For new clusters created with `az aks create`, managed identity is configured by default. For existing service principal-based clusters, switch to manage identity by running `az aks update` with the `--enable-managed-identity` flag. For more information, see [Use managed identity][use-managed-identity].
* [Azure CLI](/cli/azure/install-azure-cli) version >= 2.16.0 installed. We recommend using the latest version.
* The latest version of the `k8s-extension` Azure CLI extensions. Install the extension by running the following command:

  ```azurecli
  az extension add --name k8s-extension
  ```
  
  If the extension is already installed, make sure you're running the latest version by using the following command:
  
  ```azurecli
  az extension update --name k8s-extension
  ```

## Create extension instance

Create a new extension instance with `k8s-extension create`, passing in values for the mandatory parameters. This example command creates an Azure Machine Learning extension instance on your AKS cluster:

```azurecli
az k8s-extension create --name azureml --extension-type Microsoft.AzureML.Kubernetes --scope cluster --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters --configuration-settings enableInference=True allowInsecureConnections=True inferenceRouterServiceType=LoadBalancer
```

This example command creates a sample Kubernetes application (published on Marketplace) on your AKS cluster:

```azurecli
az k8s-extension create --name voteapp --extension-type Contoso.AzureVoteKubernetesAppTest --scope cluster --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters --plan-name testPlanID --plan-product testOfferID --plan-publisher testPublisherID --configuration-settings title=VoteAnimal value1=Cats value2=Dogs
```

> [!NOTE]
> The Cluster Extensions service is unable to retain sensitive information for more than 48 hours. If the cluster extension agents don't have network connectivity for more than 48 hours and can't determine whether to create an extension on the cluster, then the extension transitions to `Failed` state. Once in `Failed` state, you'll need to run `k8s-extension create` again to create a fresh extension instance.

### Required parameters

| Parameter name | Description |
|----------------|------------|
| `--name` | Name of the extension instance |
| `--extension-type` | The type of extension you want to install on the cluster. For example: `Microsoft.AzureML.Kubernetes` |
| `--cluster-name` | Name of the AKS cluster on which the extension instance has to be created |
| `--resource-group` | The resource group containing the AKS cluster |
| `--cluster-type` | The cluster type on which the extension instance has to be created. Specify `managedClusters` as it maps to AKS clusters|

### Optional parameters

| Parameter name | Description |
|--------------|------------|
| `--auto-upgrade-minor-version` | Boolean property that specifies if the extension minor version will be upgraded automatically or not. Default: `true`.  If this parameter is set to true, you can't set `version` parameter, as the version will be dynamically updated. If set to `false`, extension won't be auto-upgraded even for patch versions. |
| `--version` | Version of the extension to be installed (specific version to pin the extension instance to). Must not be supplied if auto-upgrade-minor-version is set to `true`. |
| `--configuration-settings` | Settings that can be passed into the extension to control its functionality. Pass values as space separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-settings-file` can't be used in the same command. |
| `--configuration-settings-file` | Path to the JSON file having key value pairs to be used for passing in configuration settings to the extension. If this parameter is used in the command, then `--configuration-settings` can't be used in the same command. |
| `--configuration-protected-settings` | These settings are not retrievable using `GET` API calls or `az k8s-extension show` commands, and are thus used to pass in sensitive settings. Pass values as space separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-protected-settings-file` can't be used in the same command. |
| `--configuration-protected-settings-file` | Path to the JSON file having key value pairs to be used for passing in sensitive settings to the extension. If this parameter is used in the command, then `--configuration-protected-settings` can't be used in the same command. |
| `--scope` | Scope of installation for the extension - `cluster` or `namespace` |
| `--release-namespace` | This parameter indicates the namespace within which the release is to be created. This parameter is only relevant if `scope` parameter is set to `cluster`. |
| `--release-train` |  Extension  authors can publish versions in different release trains such as `Stable`, `Preview`, etc. If this parameter isn't set explicitly, `Stable` is used as default. This parameter can't be used when `--auto-upgrade-minor-version` parameter is set to `false`. |
| `--target-namespace` | This parameter indicates the namespace within which the release will be created. Permission of the system account created for this extension instance will be restricted to this namespace. This parameter is only relevant if the `scope` parameter is set to `namespace`. |
|`--plan-name` | **Plan ID** of the extension, found on the Marketplace page in the Azure portal under **Usage Information + Support**. |
|`--plan-product` | **Product ID** of the extension, found on the Marketplace page in the Azure portal under **Usage Information + Support**. An example of this is the name of the ISV offering used. |
|`--plan-publisher` | **Publisher ID** of the extension, found on the Marketplace page in the Azure portal under **Usage Information + Support**. |

## Show details of an extension instance

To view details of a currently installed extension instance, use `k8s-extension show`, passing in values for the mandatory parameters.

```azurecli
az k8s-extension show --name azureml --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

## List all extensions installed on the cluster

To list all extensions installed on a cluster, use `k8s-extension list`, passing in values for the mandatory parameters.

```azurecli
az k8s-extension list --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

## Update extension instance

> [!NOTE]
> Refer to documentation for the specific extension type to understand the specific settings in `--configuration-settings` and `--configuration-protected-settings` that are able to be updated. For `--configuration-protected-settings`, all settings are expected to be provided, even if only one setting is being updated. If any of these settings are omitted, those settings will be considered obsolete and deleted.

To update an existing extension instance, use `k8s-extension update`, passing in values for the mandatory parameters. The following command updates the auto-upgrade setting for an Azure Machine Learning extension instance:

```azurecli
az k8s-extension update --name azureml --extension-type Microsoft.AzureML.Kubernetes --scope cluster --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

### Required parameters for update

| Parameter name | Description |
|----------------|------------|
| `--name` | Name of the extension instance |
| `--extension-type` | The type of extension you want to install on the cluster. For example: Microsoft.AzureML.Kubernetes |
| `--cluster-name` | Name of the AKS cluster on which the extension instance has to be created |
| `--resource-group` | The resource group containing the AKS cluster |
| `--cluster-type` | The cluster type on which the extension instance has to be created. Specify `managedClusters` as it maps to AKS clusters|

If updating a Kubernetes application procured through Marketplace, the following parameters are also required:

| Parameter name | Description |
|----------------|------------|
|`--plan-name` | **Plan ID** of the extension, found on the Marketplace page in the Azure portal under **Usage Information + Support**. |
|`--plan-product` | **Product ID** of the extension, found on the Marketplace page in the Azure portal under **Usage Information + Support**. An example of this is the name of the ISV offering used. |
|`--plan-publisher` | **Publisher ID** of the extension, found on the Marketplace page in the Azure portal under **Usage Information + Support**. |

### Optional parameters for update

| Parameter name | Description |
|--------------|------------|
| `--auto-upgrade-minor-version` | Boolean property that specifies if the extension minor version will be upgraded automatically or not. Default: `true`.  If this parameter is set to true, you cannot set `version` parameter, as the version will be dynamically updated. If set to `false`, extension won't be auto-upgraded even for patch versions. |
| `--version` | Version of the extension to be installed (specific version to pin the extension instance to). Must not be supplied if auto-upgrade-minor-version is set to `true`. |
| `--configuration-settings` | Settings that can be passed into the extension to control its functionality. Only the settings that require an update need to be provided. The provided settings would be replaced with the provided values. Pass values as space separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-settings-file` can't be used in the same command. |
| `--configuration-settings-file` | Path to the JSON file having key value pairs to be used for passing in configuration settings to the extension. If this parameter is used in the command, then `--configuration-settings` can't be used in the same command. |
| `--configuration-protected-settings` | These settings are not retrievable using `GET` API calls or `az k8s-extension show` commands, and are thus used to pass in sensitive settings. When you update a setting, all settings are expected to be specified. If some settings are omitted, those settings would be considered obsolete and deleted. Pass values as space separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-protected-settings-file` can't be used in the same command. |
| `--configuration-protected-settings-file` | Path to the JSON file having key value pairs to be used for passing in sensitive settings to the extension. If this parameter is used in the command, then `--configuration-protected-settings` can't be used in the same command. |
| `--scope` | Scope of installation for the extension - `cluster` or `namespace` |
| `--release-train` |  Extension authors can publish versions in different release trains such as `Stable`, `Preview`, etc. If this parameter isn't set explicitly, `Stable` is used as default. This parameter can't be used when `autoUpgradeMinorVersion` parameter is set to `false`. |


## Delete extension instance

To delete an extension instance on a cluster, use `k8s-extension-delete`, passing in values for the mandatory parameters.

```azurecli
az k8s-extension delete --name azureml --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

>[!NOTE]
> The Azure resource representing this extension gets deleted immediately. The Helm release on the cluster associated with this extension is only deleted when the agents running on the Kubernetes cluster have network connectivity and can reach out to Azure services again to fetch the desired state.

## Next steps

* View the list of [currently available cluster extensions](cluster-extensions.md#currently-available-extensions).
* Learn about [Kubernetes applications available through Marketplace](deploy-marketplace.md).

<!-- LINKS -->
[arc-k8s-extensions]: ../azure-arc/kubernetes/conceptual-extensions.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[azure-ml-overview]: ../machine-learning/how-to-attach-kubernetes-anywhere.md
[dapr-overview]: ./dapr.md
[gitops-overview]: ../azure-arc/kubernetes/conceptual-gitops-flux2.md
[gitops-support]: ../azure-arc/kubernetes/extensions-release.md#flux-gitops
[gitops-tutorial]: ../azure-arc/kubernetes/tutorial-use-gitops-flux2.md
[k8s-extension-reference]: /cli/azure/k8s-extension
[use-managed-identity]: ./use-managed-identity.md
[workload-identity-overview]: workload-identity-overview.md
[use-azure-ad-pod-identity]: use-azure-ad-pod-identity.md
