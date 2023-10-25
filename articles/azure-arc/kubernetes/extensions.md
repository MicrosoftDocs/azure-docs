---
title: "Deploy and manage Azure Arc-enabled Kubernetes cluster extensions"
ms.custom: event-tier1-build-2022, ignite-2022, devx-track-azurecli
ms.date: 04/27/2023
ms.topic: how-to
description: "Create and manage extension instances on Azure Arc-enabled Kubernetes clusters."
---

# Deploy and manage Azure Arc-enabled Kubernetes cluster extensions

You can create extension instances in an Arc-enabled Kubernetes cluster, setting required and optional parameters including options related to updates and configurations. You can also view, list, update, and delete extension instances.

Before you begin, read the [conceptual overview of Arc-enabled Kubernetes cluster extensions](conceptual-extensions.md) and review the [list of currently available extensions](extensions-release.md).

## Prerequisites

* The latest version of [Azure CLI](/cli/azure/install-azure-cli).
* The latest versions of the `connectedk8s` and `k8s-extension` Azure CLI extensions. Install these extensions by running the following commands:
  
    ```azurecli
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    ```

    If the `connectedk8s` and `k8s-extension` extensions are already installed, make sure they're updated to the latest version using the following commands:

    ```azurecli
    az extension update --name connectedk8s
    az extension update --name k8s-extension
    ```

* An existing Azure Arc-enabled Kubernetes connected cluster, with at least one node of operating system and architecture type `linux/amd64`. If deploying [Flux (GitOps)](extensions-release.md#flux-gitops), you can use an ARM64-based cluster without a `linux/amd64` node.
  * If you haven't connected a cluster yet, use our [quickstart](quickstart-connect-cluster.md).
  * [Upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to the latest version.

> [!NOTE]
> Installing Azure Arc extensions on [AKS hybrid clusters provisioned from Azure](extensions.md#aks-hybrid-clusters-provisioned-from-azure-preview) is currently in preview, with support for the Azure Arc-enabled Open Service Mesh, Azure Key Vault Secrets Provider, Flux (GitOps) and Microsoft Defender for Cloud extensions.

## Create extension instance

To create a new extension instance, use `k8s-extension create`, passing in values for the required parameters.

This example creates an [Azure Monitor Container Insights](extensions-release.md#azure-monitor-container-insights) extension instance on an Azure Arc-enabled Kubernetes cluster:

```azurecli
az k8s-extension create --name azuremonitor-containers  --extension-type Microsoft.AzureMonitor.Containers --scope cluster --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

**Output:**

```json
{
  "autoUpgradeMinorVersion": true,
  "configurationProtectedSettings": null,
  "configurationSettings": {
    "logAnalyticsWorkspaceResourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/defaultresourcegroup-eus/providers/microsoft.operationalinsights/workspaces/defaultworkspace-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-eus"
  },
  "creationTime": "2021-04-02T12:13:06.7534628+00:00",
  "errorInfo": {
    "code": null,
    "message": null
  },
  "extensionType": "microsoft.azuremonitor.containers",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/demo/providers/Microsoft.Kubernetes/connectedClusters/demo/providers/Microsoft.KubernetesConfiguration/extensions/azuremonitor-containers",
  "identity": null,
  "installState": "Pending",
  "lastModifiedTime": "2021-04-02T12:13:06.753463+00:00",
  "lastStatusTime": null,
  "name": "azuremonitor-containers",
  "releaseTrain": "Stable",
  "resourceGroup": "demo",
  "scope": {
    "cluster": {
      "releaseNamespace": "azuremonitor-containers"
    },
    "namespace": null
  },
  "statuses": [],
  "systemData": null,
  "type": "Microsoft.KubernetesConfiguration/extensions",
  "version": "2.8.2"
}
```

> [!NOTE]
> The service is unable to retain sensitive information for more than 48 hours. If Azure Arc-enabled Kubernetes agents don't have network connectivity for more than 48 hours and can't determine whether to create an extension on the cluster, the extension transitions to `Failed` state. Once that happens, you'll need to run `k8s-extension create` again to create a fresh extension Azure resource.
>
> Azure Monitor Container Insights is a singleton extension (only one required per cluster). You'll need to clean up any previous Helm chart installations of Azure Monitor Container Insights (without extensions) before installing the same via extensions. Follow the instructions for [deleting the Helm chart](../../azure-monitor/containers/container-insights-optout-hybrid.md)  before running `az k8s-extension create`.

### Required parameters

The following parameters are required when using `az k8s-extension create` to create an extension instance.

| Parameter name | Description |
|----------------|------------|
| `--name` | Name of the extension instance |
| `--extension-type` | The [type of extension](extensions-release.md) you want to install on the cluster. For example: Microsoft.AzureMonitor.Containers, microsoft.azuredefender.kubernetes |
| `--scope` | [Scope of installation](conceptual-extensions.md#extension-scope) for the extension: `cluster` or `namespace` |
| `--cluster-name` | Name of the Azure Arc-enabled Kubernetes resource on which the extension instance has to be created |
| `--resource-group` | The resource group containing the Azure Arc-enabled Kubernetes resource |
| `--cluster-type` | The cluster type on which the extension instance has to be created. For most scenarios, use `connectedClusters`, which corresponds to Azure Arc-enabled Kubernetes clusters. |

> [!NOTE]
> When working with [AKS hybrid clusters provisioned from Azure](#aks-hybrid-clusters-provisioned-from-azure-preview), you must set `--cluster-type` to use `provisionedClusters` and also add `--cluster-resource-provider microsoft.hybridcontainerservice` to the command. Installing Azure Arc extensions on AKS hybrid clusters provisioned from Azure is currently in preview.

### Optional parameters

Use one or more of these optional parameters as needed for your scenarios, along with the required parameters.

> [!NOTE]
> You can choose to automatically upgrade your extension instance to the latest minor and patch versions by setting `auto-upgrade-minor-version` to `true`, or you can instead set the version of the extension instance manually using the `--version` parameter. We recommend enabling automatic upgrades for minor and patch versions so that you always have the latest security patches and capabilities.
>
> Because major version upgrades may include breaking changes, automatic upgrades for new major versions of an extension instance aren't supported. You can choose when to [manually upgrade extension instances](#upgrade-extension-instance) to a new major version.


| Parameter name | Description |
|--------------|------------|
| `--auto-upgrade-minor-version` | Boolean property that determines whether the extension minor version is automatically upgraded. The default setting is `true`. If this parameter is set to `true`, you can't set the `version` parameter, as the version will be dynamically updated. If set to `false`, the extension won't be automatically upgraded, even for patch versions. |
| `--version` | Version of the extension to be installed (specific version to pin the extension instance to). Must not be supplied if `auto-upgrade-minor-version` is set to `true`. |
| `--configuration-settings` | Settings that can be passed into the extension to control its functionality. These are passed in as space-separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-settings-file` can't be used in the same command. |
| `--configuration-settings-file` | Path to a JSON file with `key=value` pairs to be used for passing configuration settings into the extension. If this parameter is used in the command, then `--configuration-settings` can't be used in the same command. |
| `--configuration-protected-settings` | Settings that aren't retrievable using `GET` API calls or `az k8s-extension show` commands. Typically used to pass in sensitive settings. These are passed in as space-separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-protected-settings-file` can't be used in the same command. |
| `--configuration-protected-settings-file` | Path to a JSON file with `key=value` pairs to be used for passing sensitive settings into the extension. If this parameter is used in the command, then `--configuration-protected-settings` can't be used in the same command. |
| `--release-namespace` | This parameter indicates the namespace within which the release will be created. Only relevant if `scope` is set to `cluster`. |
| `--release-train` |  Extension authors can publish versions in different release trains such as `Stable`, `Preview`, etc. If this parameter isn't set explicitly, `Stable` is used as default.  |
| `--target-namespace` | Indicates the namespace within which the release will be created. Permission of the system account created for this extension instance will be restricted to this namespace. Only relevant if `scope` is set to `namespace`. |

## Show extension details

To view details of a currently installed extension instance, use `k8s-extension show`, passing in values for the mandatory parameters.

```azurecli
az k8s-extension show --name azuremonitor-containers --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

**Output:**

```json
{
  "autoUpgradeMinorVersion": true,
  "configurationProtectedSettings": null,
  "configurationSettings": {
    "logAnalyticsWorkspaceResourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/defaultresourcegroup-eus/providers/microsoft.operationalinsights/workspaces/defaultworkspace-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-eus"
  },
  "creationTime": "2021-04-02T12:13:06.7534628+00:00",
  "errorInfo": {
    "code": null,
    "message": null
  },
  "extensionType": "microsoft.azuremonitor.containers",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/demo/providers/Microsoft.Kubernetes/connectedClusters/demo/providers/Microsoft.KubernetesConfiguration/extensions/azuremonitor-containers",
  "identity": null,
  "installState": "Installed",
  "lastModifiedTime": "2021-04-02T12:13:06.753463+00:00",
  "lastStatusTime": "2021-04-02T12:13:49.636+00:00",
  "name": "azuremonitor-containers",
  "releaseTrain": "Stable",
  "resourceGroup": "demo",
  "scope": {
    "cluster": {
      "releaseNamespace": "azuremonitor-containers"
    },
    "namespace": null
  },
  "statuses": [],
  "systemData": null,
  "type": "Microsoft.KubernetesConfiguration/extensions",
  "version": "2.8.2"
}
```

## List all extensions installed on the cluster

To view a list of all extensions installed on a cluster, use  `k8s-extension list`, passing in values for the mandatory parameters.

```azurecli
az k8s-extension list --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

**Output:**

```json
[
  {
    "autoUpgradeMinorVersion": true,
    "creationTime": "2020-09-15T02:26:03.5519523+00:00",
    "errorInfo": {
      "code": null,
      "message": null
    },
    "extensionType": "Microsoft.AzureMonitor.Containers",
    "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRg/providers/Microsoft.Kubernetes/connectedClusters/myCluster/providers/Microsoft.KubernetesConfiguration/extensions/myExtInstanceName",
    "identity": null,
    "installState": "Pending",
    "lastModifiedTime": "2020-09-15T02:48:45.6469664+00:00",
    "lastStatusTime": null,
    "name": "myExtInstanceName",
    "releaseTrain": "Stable",
    "resourceGroup": "myRG",
    "scope": {
      "cluster": {
        "releaseNamespace": "myExtInstanceName1"
      }
    },
    "statuses": [],
    "type": "Microsoft.KubernetesConfiguration/extensions",
    "version": "0.1.0"
  },
  {
    "autoUpgradeMinorVersion": true,
    "creationTime": "2020-09-02T00:41:16.8005159+00:00",
    "errorInfo": {
      "code": null,
      "message": null
    },
    "extensionType": "microsoft.azuredefender.kubernetes",
    "id": "/subscriptions/0e849346-4343-582b-95a3-e40e6a648ae1/resourceGroups/myRg/providers/Microsoft.Kubernetes/connectedClusters/myCluster/providers/Microsoft.KubernetesConfiguration/extensions/defender",
    "identity": null,
    "installState": "Pending",
    "lastModifiedTime": "2020-09-02T00:41:16.8005162+00:00",
    "lastStatusTime": null,
    "name": "microsoft.azuredefender.kubernetes",
    "releaseTrain": "Stable",
    "resourceGroup": "myRg",
    "scope": {
      "cluster": {
        "releaseNamespace": "myExtInstanceName2"
      }
    },
    "type": "Microsoft.KubernetesConfiguration/extensions",
    "version": "0.1.0"
  }
]
```

## Update extension instance

> [!NOTE]
> Refer to documentation for the specific extension type to understand the specific settings in `--configuration-settings` and `--configuration-protected-settings` that are able to be updated. For `--configuration-protected-settings`, all settings are expected to be provided, even if only one setting is being updated. If any of these settings are omitted, those settings will be considered obsolete and deleted.

To update an existing extension instance, use `k8s-extension update`, passing in values for the mandatory and optional parameters. The mandatory and optional parameters are slightly different than those used to create an extension instance.

This example updates the `auto-upgrade-minor-version` setting for an Azure Machine Learning extension instance to `true`:

```azurecli
az k8s-extension update --name azureml --extension-type Microsoft.AzureML.Kubernetes --scope cluster --cluster-name <clusterName> --resource-group <resourceGroupName> --auto-upgrade-minor-version true --cluster-type managedClusters
```

### Required parameters for update

| Parameter name | Description |
|----------------|------------|
| `--name` | Name of the extension instance |
| `--cluster-name` | Name of the cluster on which the extension instance has to be created |
| `--resource-group` | The resource group containing the cluster |
| `--cluster-type` | The cluster type on which the extension instance has to be created. For Azure Arc-enabled Kubernetes clusters, use `connectedClusters`. For AKS clusters, use `managedClusters`.|

### Optional parameters for update

| Parameter name | Description |
|--------------|------------|
| `--auto-upgrade-minor-version` | Boolean property that specifies whether the extension minor version is automatically upgraded. The default setting is `true`.  If this parameter is set to true, you can't set the `version` parameter, as the version will be dynamically updated. If set to `false`, the extension won't be automatically upgraded, even for patch versions. |
| `--version` | Version of the extension to be installed (specific version to pin the extension instance to). Must not be supplied if auto-upgrade-minor-version is set to `true`. |
| `--configuration-settings` | Settings that can be passed into the extension to control its functionality.These are passed in as space-separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-settings-file` can't be used in the same command.  Only the settings that require an update need to be provided. The provided settings will be replaced with the specified values. |
| `--configuration-settings-file` | Path to the JSON file with `key=value` pairs to be used for passing in configuration settings to the extension. If this parameter is used in the command, then `--configuration-settings` can't be used in the same command. |
| `--configuration-protected-settings` | Settings that aren't retrievable using `GET` API calls or `az k8s-extension show` commands. Typically used to pass in sensitive settings. These are passed in as space-separated `key=value` pairs after the parameter name. If this parameter is used in the command, then `--configuration-protected-settings-file` can't be used in the same command. When you update a protected setting, all of the protected settings are expected to be specified. If any of these settings are omitted, those settings will be considered obsolete and deleted.  |
| `--configuration-protected-settings-file` | Path to a JSON file with `key=value` pairs to be used for passing in sensitive settings to the extension. If this parameter is used in the command, then `--configuration-protected-settings` can't be used in the same command. |
| `--scope` | Scope of installation for the extension - `cluster` or `namespace`. |
| `--release-train` | Extension authors can publish versions in different release trains such as `Stable`, `Preview`, etc. If this parameter isn't set explicitly, `Stable` is used as default.  |

## Upgrade extension instance

As noted earlier, if you set `auto-upgrade-minor-version` to true, the extension will automatically be upgraded when a new minor version is released. For most scenarios, we recommend enabling automatic upgrades. If you set `auto-upgrade-minor-version` to false, you'll have to upgrade the extension manually if you want a newer version.

Manual upgrades are also required to get a new major instance of an extension. You can choose when to upgrade in order to avoid any unexpected breaking changes with major version upgrades.

To manually upgrade an extension instance, use `k8s-extension update` and set the `version` parameter to specify a version.

This example updates an Azure Machine Learning extension instance to version x.y.z:

```azurecli
az k8s-extension update --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters --name azureml --version x.y.z
```

## Delete extension instance

To delete an extension instance on a cluster, use `k8s-extension delete`, passing in values for the mandatory parameters:

```azurecli
az k8s-extension delete --name azuremonitor-containers --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

> [!NOTE]
> The Azure resource representing this extension gets deleted immediately. The Helm release on the cluster associated with this extension is only deleted when the agents running on the Kubernetes cluster have network connectivity and can reach out to Azure services again to fetch the desired state.

> [!IMPORTANT]
> When working with [AKS hybrid clusters provisioned from Azure](#aks-hybrid-clusters-provisioned-from-azure-preview), you must add `--yes` to the delete command. Installing Azure Arc extensions on AKS hybrid clusters provisioned from Azure is currently in preview.

## AKS hybrid clusters provisioned from Azure (preview)

You can deploy extensions to AKS hybrid clusters provisioned from Azure. However, there are a few key differences to keep in mind in order to deploy successfully:

* The value for the `--cluster-type` parameter must be `provisionedClusters`.
* You must add `--cluster-resource-provider microsoft.hybridcontainerservice` to your commands.
* When deleting an extension instance, you must add `--yes` to the command:

   ```azurecli
   az k8s-extension delete --name azuremonitor-containers --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type provisionedClusters --cluster-resource-provider microsoft.hybridcontainerservice --yes
   ```

In addition, you must be using the latest version of the Azure CLI `k8s-extension` module (version >= 1.3.3). Use the following commands to add or update to the latest version:

```azurecli
# add if you do not have this installed
az extension add --name k8s-extension

# update if you do have the module installed
az extension update --name k8s-extension
```

> [!IMPORTANT]
> Installing Azure Arc extensions on AKS hybrid clusters provisioned from Azure is currently in preview.

## Next steps

* Review the [az k8s-extension CLI reference](/cli/azure/k8s-extension) for a comprehensive list of commands and parameters.
* Learn more about [how extensions work with Arc-enabled Kubernetes clusters](conceptual-extensions.md).
* Review the [cluster extensions currently available for Azure Arc-enabled Kubernetes](extensions-release.md).
