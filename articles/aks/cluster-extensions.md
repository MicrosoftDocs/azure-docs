---
title: Cluster extensions for Azure Kubernetes Service (AKS)
description: Learn how to deploy and manage the lifecycle of extensions on Azure Kubernetes Service (AKS)
ms.service: container-service
ms.custom: event-tier1-build-2022
ms.date: 09/29/2022
ms.topic: article
author: nickomang
ms.author: nickoman
---

# Deploy and manage cluster extensions for Azure Kubernetes Service (AKS)

Cluster extensions provide an Azure Resource Manager driven experience for installation and lifecycle management of services like Azure Machine Learning (ML) on an AKS cluster. This feature enables:

* Azure Resource Manager-based deployment of extensions, including at-scale deployments across AKS clusters.
* Lifecycle management of the extension (Update, Delete) from Azure Resource Manager.

In this article, you'll learn about:
> [!div class="checklist"]

> * How to create an extension instance.
> * Available cluster extensions on AKS.
> * How to view, list, update, and delete extension instances.

A conceptual overview of this feature is available in [Cluster extensions - Azure Arc-enabled Kubernetes][arc-k8s-extensions] article.

## Prerequisites

> [!IMPORTANT]
> Ensure that your AKS cluster is created with a managed identity, as cluster extensions won't work with service principal-based clusters.
>
> For new clusters created with `az aks create`, managed identity is configured by default. For existing service principal-based clusters that need to be switched over to managed identity, it can be enabled by running `az aks update` with the `--enable-managed-identity` flag. For more information, see [Use managed identity][use-managed-identity].

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI](/cli/azure/install-azure-cli) version >= 2.16.0 installed.

> [!NOTE]
> If you have enabled [AAD-based pod identity][use-azure-ad-pod-identity] on your AKS cluster or are considering implementing it,
> we recommend you first review [Migrate to workload identity][migrate-workload-identity] to understand our
> recommendations and options to set up your cluster to use an Azure AD workload identity (preview).
> This authentication method replaces pod-managed identity (preview), which integrates with the Kubernetes native capabilities
> to federate with any external identity providers.

### Set up the Azure CLI extension for cluster extensions

> [!NOTE]
> The minimum supported version for the `k8s-extension` Azure CLI extension is `1.0.0`. If you are unsure what version you have installed, run `az extension show --name k8s-extension` and look for the `version` field.

You'll also need the `k8s-extension` Azure CLI extension. Install the extension by running the following command:
  
```azurecli-interactive
az extension add --name k8s-extension
```

If the `k8s-extension` extension is already installed, you can update it to the latest version using the following command:

```azurecli-interactive
az extension update --name k8s-extension
```

## Currently available extensions

>[!NOTE]
> Cluster extensions provides a platform for different extensions to be installed and managed on an AKS cluster. If you are facing issues while using any of these extensions, please open a support ticket with the respective service.

| Extension | Description |
| --------- | ----------- |
| [Dapr][dapr-overview] | Dapr is a portable, event-driven runtime that makes it easy for any developer to build resilient, stateless and stateful applications that run on cloud and edge. |
| [Azure ML][azure-ml-overview] | Use Azure Kubernetes Service clusters to train, inference, and manage machine learning models in Azure Machine Learning. |
| [Flux (GitOps)][gitops-overview] | Use GitOps with Flux to manage cluster configuration and application deployment. |

## Supported regions and Kubernetes versions

Cluster extensions can be used on AKS clusters in the regions listed in [Azure Arc enabled Kubernetes region support][arc-k8s-regions].

For supported Kubernetes versions, refer to the corresponding documentation for each extension.

## Usage of cluster extensions

> [!NOTE]
> The samples provided in this article are not complete, and are only meant to showcase functionality. For a comprehensive list of commands and their parameters, please see the [az k8s-extension CLI reference][k8s-extension-reference].

### Create extensions instance

Create a new extension instance with `k8s-extension create`, passing in values for the mandatory parameters. The below command creates an Azure Machine Learning extension instance on your AKS cluster:

```azurecli
az k8s-extension create --name aml-compute --extension-type Microsoft.AzureML.Kubernetes --scope cluster --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters --configuration-settings enableInference=True allowInsecureConnections=True
```

> [!NOTE]
> The Cluster Extensions service is unable to retain sensitive information for more than 48 hours. If the cluster extension agents don't have network connectivity for more than 48 hours and can't determine whether to create an extension on the cluster, then the extension transitions to `Failed` state. Once in `Failed` state, you will need to run `k8s-extension create` again to create a fresh extension instance.

#### Required parameters

| Parameter name | Description |
|----------------|------------|
| `--name` | Name of the extension instance |
| `--extension-type` | The type of extension you want to install on the cluster. For example: Microsoft.AzureML.Kubernetes | 
| `--cluster-name` | Name of the AKS cluster on which the extension instance has to be created |
| `--resource-group` | The resource group containing the AKS cluster |
| `--cluster-type` | The cluster type on which the extension instance has to be created. Specify `managedClusters` as it maps to AKS clusters|

#### Optional parameters

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
| `--release-train` |  Extension  authors can publish versions in different release trains such as `Stable`, `Preview`, etc. If this parameter isn't set explicitly, `Stable` is used as default. This parameter can't be used when `autoUpgradeMinorVersion` parameter is set to `false`. |
| `--target-namespace` | This parameter indicates the namespace within which the release will be created. Permission of the system account created for this extension instance will be restricted to this namespace. This parameter is only relevant if the `scope` parameter is set to `namespace`. |

### Show details of an extension instance

View details of a currently installed extension instance with `k8s-extension show`, passing in values for the mandatory parameters:

```azurecli
az k8s-extension show --name azureml --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

### List all extensions installed on the cluster

List all extensions installed on a cluster with `k8s-extension list`, passing in values for the mandatory parameters.

```azurecli
az k8s-extension list --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

### Update extension instance

> [!NOTE]
> Refer to documentation of the extension type (Eg: Azure ML) to learn about the specific settings under ConfigurationSetting and ConfigurationProtectedSettings that are allowed to be updated. For ConfigurationProtectedSettings, all settings are expected to be provided during an update of a single setting. If some settings are omitted, those settings would be considered obsolete and deleted.

Update an existing extension instance with `k8s-extension update`, passing in values for the mandatory parameters. The below command updates the auto-upgrade setting for an Azure Machine Learning extension instance:

```azurecli
az k8s-extension update --name azureml --extension-type Microsoft.AzureML.Kubernetes --scope cluster --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

**Required parameters**

| Parameter name | Description |
|----------------|------------|
| `--name` | Name of the extension instance |
| `--extension-type` | The type of extension you want to install on the cluster. For example: Microsoft.AzureML.Kubernetes |
| `--cluster-name` | Name of the AKS cluster on which the extension instance has to be created |
| `--resource-group` | The resource group containing the AKS cluster |
| `--cluster-type` | The cluster type on which the extension instance has to be created. Specify `managedClusters` as it maps to AKS clusters|

**Optional parameters**

| Parameter name | Description |
|--------------|------------|
| `--auto-upgrade-minor-version` | Boolean property that specifies if the extension minor version will be upgraded automatically or not. Default: `true`.  If this parameter is set to true, you cannot set `version` parameter, as the version will be dynamically updated. If set to `false`, extension won't be auto-upgraded even for patch versions. |
| `--version` | Version of the extension to be installed (specific version to pin the extension instance to). Must not be supplied if auto-upgrade-minor-version is set to `true`. |
| `--configuration-settings` | Settings that can be passed into the extension to control its functionality. Only the settings that require an update need to be provided. The provided settings would be replaced with the provided values. Pass values as space separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-settings-file` can't be used in the same command. |
| `--configuration-settings-file` | Path to the JSON file having key value pairs to be used for passing in configuration settings to the extension. If this parameter is used in the command, then `--configuration-settings` can't be used in the same command. |
| `--configuration-protected-settings` | These settings are not retrievable using `GET` API calls or `az k8s-extension show` commands, and are thus used to pass in sensitive settings. When you update a setting, all settings are expected to be specified. If some settings are omitted, those settings would be considered obsolete and deleted. Pass values as space separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-protected-settings-file` can't be used in the same command. |
| `--configuration-protected-settings-file` | Path to the JSON file having key value pairs to be used for passing in sensitive settings to the extension. If this parameter is used in the command, then `--configuration-protected-settings` can't be used in the same command. |
| `--scope` | Scope of installation for the extension - `cluster` or `namespace` |
| `--release-train` |  Extension  authors can publish versions in different release trains such as `Stable`, `Preview`, etc. If this parameter isn't set explicitly, `Stable` is used as default. This parameter can't be used when `autoUpgradeMinorVersion` parameter is set to `false`. |

### Delete extension instance

>[!NOTE]
> The Azure resource representing this extension gets deleted immediately. The Helm release on the cluster associated with this extension is only deleted when the agents running on the Kubernetes cluster have network connectivity and can reach out to Azure services again to fetch the desired state.

Delete an extension instance on a cluster with `k8s-extension delete`, passing in values for the mandatory parameters.

```azurecli
az k8s-extension delete --name azureml --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

<!-- LINKS -->
<!-- INTERNAL -->
[arc-k8s-extensions]: ../azure-arc/kubernetes/conceptual-extensions.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[azure-ml-overview]: ../machine-learning/how-to-attach-kubernetes-anywhere.md
[dapr-overview]: ./dapr.md
[gitops-overview]: ../azure-arc/kubernetes/conceptual-gitops-flux2.md
[k8s-extension-reference]: /cli/azure/k8s-extension
[use-managed-identity]: ./use-managed-identity.md
[migrate-workload-identity]: workload-identity-overview.md

<!-- EXTERNAL -->
[arc-k8s-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc&regions=all