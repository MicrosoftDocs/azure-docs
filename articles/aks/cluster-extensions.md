---
title: "Cluster extensions"
services: aks
ms.service: aks
ms.date: 10/13/2021
ms.topic: article
author: ponatara
ms.author: ponatara
description: "Deploy and manage lifecycle of extensions on AKS"
---

# Deploy and manage cluster extensions

Cluster extensions provides an Azure Resource Manager driven experience for installation and lifecycle management of services like Azure Machine Learning and Dapr on 
the AKS cluster. This feature enables:

* Azure Resource Manager-based deployment of extensions, including at-scale deployments across AKS clusters.
* Lifecycle management of the extension (Update, Delete) from Azure Resource Manager.

In this article, you will learn about:
> [!div class="checklist"]
> * How to create an extension instance.
> * Available cluster extensions on AKS.
> * How to view, list, update, and delete extension instances. 

A conceptual overview of this feature is available in [Cluster extensions - Azure Arc-enabled Kubernetes](conceptual-extensions.md) article.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

### 1. Register providers for cluster extensions

#### [Azure CLI](#tab/azure-cli)

1. Enter the following commands:
    ```azurecli
    az provider register --namespace Microsoft.KubernetesConfiguration
    ```
2. Monitor the registration process. Registration may take up to 10 minutes.
    ```azurecli
    az provider show -n Microsoft.KubernetesConfiguration -o table
    ```

    Once registered, you should see the `RegistrationState` state for these namespaces change to `Registered`.

#### [Azure PowerShell](#tab/azure-powershell)

1. Enter the following commands:
    ```azurepowershell
    Register-AzResourceProvider -ProviderNamespace Microsoft.KubernetesConfiguration
    ```
1. Monitor the registration process. Registration may take up to 10 minutes.
    ```azurepowershell
    Get-AzResourceProvider -ProviderNamespace Microsoft.KubernetesConfiguration
    ```

    Once registered, you should see the `RegistrationState` state for these namespaces change to `Registered`.

### 2. Setup [Azure CLI](#tab/azure-cli) extension for cluster extensions
- [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version >= 2.16.0.
-  `k8s-extension` (version >= 1.0.0) Azure CLI extension. Install this Azure CLI extensions by running the following commands:
  
    ```azurecli
    az extension add --name k8s-extension
    ```
    
    If the `k8s-extension` extension is already installed, you can update it to the latest version using the following command:

    ```azurecli
    az extension update --name k8s-extension
    ```

## Currently available extensions

>[!NOTE]
> Cluster extensions provides a platform for different extensions to be installed and managed on an AKS cluster. If you are facing issues while using any of these extensions, please open a support ticket with the respective service. 

| Extension | Description |
| --------- | ----------- |
| [Azure Machine Learning](TBD) |TBD|
| [Dapr](TBD) |TBD|


## Supported Regions

Cluster extensions can be used on AKS clusters in the regions listed against [Azure Arc enabled Kubernetes](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=azure-arc&regions=all). 

>[!NOTE]
> The list of supported regions will continue to expand as we rollout this functionality to more regions where AKS is available. 

## Usage of cluster extensions

### Create extensions instance

Create a new extension instance with `k8s-extension create`, passing in values for the mandatory parameters. The below command creates an Azure Machine Learning extension instance on your AKS cluster:

```azurecli
az k8s-extension create --name aml-compute --extension-type Microsoft.AzureML.Kubernetes --scope cluster --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters --configuration-settings enableInference=True allowInsecureConnections=True

```

**Output:**

```json
TBD
```

> [!NOTE]
> * The Cluster Extensions service is unable to retain sensitive information for more than 48 hours. If the cluster extension agents don't have network connectivity for more than 48 hours and cannot determine whether to create an extension on the cluster, then the extension transitions to `Failed` state. Once in `Failed` state, you will need to run `k8s-extension create` again to create a fresh extension instance.

**Required parameters**

| Parameter name | Description |
|----------------|------------|
| `--name` | Name of the extension instance |
| `--extension-type` | The type of extension you want to install on the cluster. For example: Microsoft.AzureML.Kubernetes | 
| `--scope` | Scope of installation for the extension - `cluster` or `namespace` |
| `--cluster-name` | Name of the AKS cluster on which the extension instance has to be created |
| `--resource-group` | The resource group containing the AKS cluster |
| `--cluster-type` | The cluster type on which the extension instance has to be created. Specify `managedClusters` as it maps to AKS clusters|

**Optional parameters**

| Parameter name | Description |
|--------------|------------|
| `--auto-upgrade-minor-version` | Boolean property that specifies if the extension minor version will be upgraded automatically or not. Default: `true`.  If this parameter is set to true, you cannot set `version` parameter, as the version will be dynamically updated. If set to `false`, extension will not be auto-upgraded even for patch versions. |
| `--version` | Version of the extension to be installed (specific version to pin the extension instance to). Must not be supplied if auto-upgrade-minor-version is set to `true`. |
| `--configuration-settings` | Settings that can be passed into the extension to control its functionality. They are to be passed in as space separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-settings-file` can't be used in the same command. |
| `--configuration-settings-file` | Path to the JSON file having key value pairs to be used for passing in configuration settings to the extension. If this parameter is used in the command, then `--configuration-settings` can't be used in the same command. |
| `--configuration-protected-settings` | These settings are not retrievable using `GET` API calls or `az k8s-extension show` commands, and are thus used to pass in sensitive settings. They are to be passed in as space separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-protected-settings-file` can't be used in the same command. |
| `--configuration-protected-settings-file` | Path to the JSON file having key value pairs to be used for passing in sensitive settings to the extension. If this parameter is used in the command, then `--configuration-protected-settings` can't be used in the same command. |
| `--release-namespace` | This parameter indicates the namespace within which the release is to be created. This parameter is only relevant if `scope` parameter is set to `cluster`. |
| `--release-train` |  Extension  authors can publish versions in different release trains such as `Stable`, `Preview`, etc. If this parameter is not set explicitly, `Stable` is used as default. This parameter can't be used when `autoUpgradeMinorVersion` parameter is set to `false`. |
| `--target-namespace` | This parameter indicates the namespace within which the release will be created. Permission of the system account created for this extension instance will be restricted to this namespace. This parameter is only relevant if the `scope` parameter is set to `namespace`. |


### Show details of an extension instance

View details of a currently installed extension instance with `k8s-extension show`, passing in values for the mandatory parameters:

```azurecli
az k8s-extension show --name azureml --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

**Output:**

```json
{
 
```

### List all extensions installed on the cluster

List all extensions installed on a cluster with `k8s-extension list`, passing in values for the mandatory parameters.

```azurecli
az k8s-extension list --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

**Output:**

```json

```

### Update extension instance

Update an existing extension instance with `k8s-extension update`, passing in values for the mandatory parameters. The below command updates the auto-upgrade setting for an Azure Machine Learning extension instance:

```azurecli
az k8s-extension update --name azureml-arc --extension-type Microsoft.AzureML.Kubernetes --scope cluster --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

**Output:**

```json
TBD
```

**Required parameters**

| Parameter name | Description |
|----------------|------------|
| `--name` | Name of the extension instance |
| `--extension-type` | The type of extension you want to install on the cluster. For example: Microsoft.AzureML.Kubernetes | 
| `--scope` | Scope of installation for the extension - `cluster` or `namespace` |
| `--cluster-name` | Name of the AKS cluster on which the extension instance has to be created |
| `--resource-group` | The resource group containing the AKS cluster |
| `--cluster-type` | The cluster type on which the extension instance has to be created. Specify `managedClusters` as it maps to AKS clusters|


**Optional parameters**

| Parameter name | Description |
|--------------|------------|
| `--auto-upgrade-minor-version` | Boolean property that specifies if the extension minor version will be upgraded automatically or not. Default: `true`.  If this parameter is set to true, you cannot set `version` parameter, as the version will be dynamically updated. If set to `false`, extension will not be auto-upgraded even for patch versions. |
| `--version` | Version of the extension to be installed (specific version to pin the extension instance to). Must not be supplied if auto-upgrade-minor-version is set to `true`. |
| `--configuration-settings` | Settings that can be passed into the extension to control its functionality. Only the settings that require an update need to be provided. The provided settings would be replaced with the provided values. They are to be passed in as space separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-settings-file` can't be used in the same command. |
| `--configuration-settings-file` | Path to the JSON file having key value pairs to be used for passing in configuration settings to the extension. If this parameter is used in the command, then `--configuration-settings` can't be used in the same command. |
| `--configuration-protected-settings` | These settings are not retrievable using `GET` API calls or `az k8s-extension show` commands, and are thus used to pass in sensitive settings. When updating a setting, all settings are expected to be provided. If some settings are omitted, those settings would be considered obsolete and deleted. They are to be passed in as space separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-protected-settings-file` can't be used in the same command. |
| `--configuration-protected-settings-file` | Path to the JSON file having key value pairs to be used for passing in sensitive settings to the extension. If this parameter is used in the command, then `--configuration-protected-settings` can't be used in the same command. |
| `--release-train` |  Extension  authors can publish versions in different release trains such as `Stable`, `Preview`, etc. If this parameter is not set explicitly, `Stable` is used as default. This parameter can't be used when `autoUpgradeMinorVersion` parameter is set to `false`. |

>[!NOTE]
> Refer to documentation of the extension type (Eg: Azure ML, Dapr) to learn about the specific settings under ConfigurationSetting and ConfigurationProtectedSettings that are allowed to be updated. For ConfigurationProtectedSettings, all settings are expected to be provided during an update of a single setting. If some settings are omitted, those settings would be considered obsolete and deleted. 

### Delete extension instance

Delete an extension instance on a cluster with `k8s-extension delete`, passing in values for the mandatory parameters.

```azurecli
az k8s-extension delete --name azuremonitor-containers --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

>[!NOTE]
> The Azure resource representing this extension gets deleted immediately. The Helm release on the cluster associated with this extension is only deleted when the agents running on the Kubernetes cluster have network connectivity and can reach out to Azure services again to fetch the desired state.

## Next steps

Learn more about the cluster extensions currently available for AKS:

> [!div class="nextstepaction"]
> [Azure Machine Learning](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json)
> [Dapr](../../security-center/defender-for-kubernetes-azure-arc.md?toc=/azure/azure-arc/kubernetes/toc.json)