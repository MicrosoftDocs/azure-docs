---
title: "Azure Arc-enabled Kubernetes cluster extensions"
services: azure-arc
ms.service: azure-arc
ms.custom: event-tier1-build-2022, ignite-2022
ms.date: 10/12/2022
ms.topic: how-to
description: "Deploy and manage lifecycle of extensions on Azure Arc-enabled Kubernetes"
---

# Deploy and manage Azure Arc-enabled Kubernetes cluster extensions

The Kubernetes extensions feature enables the following on Azure Arc-enabled Kubernetes clusters:

* Azure Resource Manager-based deployment of cluster extension.
* Lifecycle management of extension Helm charts.

In this article, you learn:
> [!div class="checklist"]

> * Which Azure Arc-enabled Kubernetes cluster extensions are currently available.
> * How to create extension instances.
> * Required and optional parameters.
> * How to view, list, update, and delete extension instances.

A conceptual overview of this feature is available in [Cluster extensions - Azure Arc-enabled Kubernetes](conceptual-extensions.md).

## Prerequisites

* [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version >= 2.16.0.
* `connectedk8s` (version >= 1.2.0) and `k8s-extension` (version >= 1.0.0) Azure CLI extensions. Install the latest version of these Azure CLI extensions by running the following commands:
  
    ```azurecli
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    ```

    If the `connectedk8s` and `k8s-extension` extension are already installed, you can update them to the latest version using the following command:

    ```azurecli
    az extension update --name connectedk8s
    az extension update --name k8s-extension
    ```

* An existing Azure Arc-enabled Kubernetes connected cluster.
  * If you haven't connected a cluster yet, use our [quickstart](quickstart-connect-cluster.md).
  * [Upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to version >= 1.5.3.

## Currently available extensions

The following extensions are currently available.

| Extension | Description |
| --------- | ----------- |
| [Azure Monitor for containers](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json&bc=/azure/azure-arc/kubernetes/breadcrumb/toc.json) | Provides visibility into the performance of workloads deployed on the Kubernetes cluster. Collects memory and CPU utilization metrics from controllers, nodes, and containers. |
| [Azure Policy](../../governance/policy/concepts/policy-for-kubernetes.md?toc=/azure/azure-arc/kubernetes/toc.json&bc=/azure/azure-arc/kubernetes/breadcrumb/toc.json) | Azure Policy extends [Gatekeeper](https://github.com/open-policy-agent/gatekeeper), an admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/) (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. |
| [Azure Key Vault Secrets Provider](tutorial-akv-secrets-provider.md) | The Azure Key Vault Provider for Secrets Store CSI Driver allows for the integration of Azure Key Vault as a secrets store with a Kubernetes cluster via a CSI volume. |
| [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-kubernetes-azure-arc.md?toc=/azure/azure-arc/kubernetes/toc.json&bc=/azure/azure-arc/kubernetes/breadcrumb/toc.json) | Gathers information related to security like audit log data from the Kubernetes cluster. Provides recommendations and threat alerts based on gathered data. |
| [Azure Arc-enabled Open Service Mesh](tutorial-arc-enabled-open-service-mesh.md) | Deploys Open Service Mesh on the cluster and enables capabilities like mTLS security, fine grained access control, traffic shifting, monitoring with Azure Monitor or with open source add-ons of Prometheus and Grafana, tracing with Jaeger, integration with external certification management solution. |
| [Azure Arc-enabled Data Services](../../azure-arc/kubernetes/custom-locations.md#create-custom-location) | Makes it possible for you to run Azure data services on-premises, at the edge, and in public clouds using Kubernetes and the infrastructure of your choice. |
| [Azure App Service on Azure Arc](../../app-service/overview-arc-integration.md) | Allows you to provision an App Service Kubernetes environment on top of Azure Arc-enabled Kubernetes clusters. |
| [Azure Event Grid on Kubernetes](../../event-grid/kubernetes/overview.md) | Create and manage event grid resources such as topics and event subscriptions on top of Azure Arc-enabled Kubernetes clusters. |
| [Azure API Management on Azure Arc](../../api-management/how-to-deploy-self-hosted-gateway-azure-arc.md) | Deploy and manage API Management gateway on Azure Arc-enabled Kubernetes clusters. |
| [Azure Arc-enabled Machine Learning](../../machine-learning/how-to-attach-kubernetes-anywhere.md) | Deploy and run Azure Machine Learning on Azure Arc-enabled Kubernetes clusters. |
| [Flux (GitOps)](./conceptual-gitops-flux2.md) | Use GitOps with Flux to manage cluster configuration and application deployment. |
| [Dapr extension for Azure Kubernetes Service (AKS) and Arc-enabled Kubernetes](../../aks/dapr.md)| Eliminates the overhead of downloading Dapr tooling and manually installing and managing the runtime on your clusters. |

> [!NOTE]
> Installing Azure Arc extensions on [AKS hybrid clusters provisioned from Azure](#aks-hybrid-clusters-provisioned-from-azure-preview) is currently in preview, with support for the Azure Arc-enabled Open Service Mesh, Azure Key Vault Secrets Provider, Flux (GitOps) and Microsoft Defender for Cloud extensions.

### Extension scope

Extension installations on the Arc-enabled Kubernetes cluster are either *cluster-scoped* or *namespace-scoped*. 

A cluster-scoped extension will be installed in the `release-namespace` specified during extension creation. Typically, only one instance of the cluster-scoped extension and its components, such as pods, operators, and Custom Resource Definitions (CRDs), are installed in the release namespace on the cluster.

A namespace-scoped extension can be installed in a given namespace provided using the `–namespace` property. Since the extension can be deployed at a namespace scope, multiple instances of the namespace-scoped extension and its components can run on the cluster.  Each extension instance has permissions on the namespace where it is deployed to. All the above extensions are cluster-scoped except Event Grid on Kubernetes.

All of the extensions listed above are cluster-scoped, except for [Azure API Management on Azure Arc](../../api-management/how-to-deploy-self-hosted-gateway-azure-arc.md) .

## Usage of cluster extensions

### Create extensions instance

Create a new extension instance with `k8s-extension create`, passing in values for the mandatory parameters. The below command creates an Azure Monitor for containers extension instance on your Azure Arc-enabled Kubernetes cluster:

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
> The service is unable to retain sensitive information for more than 48 hours. If Azure Arc-enabled Kubernetes agents don't have network connectivity for more than 48 hours and cannot determine whether to create an extension on the cluster, then the extension transitions to `Failed` state. Once in `Failed` state, you will need to run `k8s-extension create` again to create a fresh extension Azure resource.
>
> Azure Monitor for containers is a singleton extension (only one required per cluster). You'll need to clean up any previous Helm chart installations of Azure Monitor for containers (without extensions) before installing the same via extensions. Follow the instructions for [deleting the Helm chart before running `az k8s-extension create`](../../azure-monitor/containers/container-insights-optout-hybrid.md).

**Required parameters**

| Parameter name | Description |
|----------------|------------|
| `--name` | Name of the extension instance |
| `--extension-type` | The type of extension you want to install on the cluster. For example: Microsoft.AzureMonitor.Containers, microsoft.azuredefender.kubernetes | 
| `--scope` | Scope of installation for the extension - `cluster` or `namespace` |
| `--cluster-name` | Name of the Azure Arc-enabled Kubernetes resource on which the extension instance has to be created |
| `--resource-group` | The resource group containing the Azure Arc-enabled Kubernetes resource |
| `--cluster-type` | The cluster type on which the extension instance has to be created. For most scenarios, use `connectedClusters`, which corresponds to Azure Arc-enabled Kubernetes. |

> [!NOTE]
> When working with [AKS hybrid clusters provisioned from Azure](#aks-hybrid-clusters-provisioned-from-azure-preview) you must set `--cluster-type` to use `provisionedClusters` and also add `--cluster-resource-provider microsoft.hybridcontainerservice` to the command. Installing Azure Arc extensions on AKS hybrid clusters provisioned from Azure is currently in preview.

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

### List all extensions installed on the cluster

List all extensions installed on a cluster with `k8s-extension list`, passing in values for the mandatory parameters.

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

### Delete extension instance

Delete an extension instance on a cluster with `k8s-extension delete`, passing in values for the mandatory parameters.

```azurecli
az k8s-extension delete --name azuremonitor-containers --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

>[!NOTE]
> The Azure resource representing this extension gets deleted immediately. The Helm release on the cluster associated with this extension is only deleted when the agents running on the Kubernetes cluster have network connectivity and can reach out to Azure services again to fetch the desired state.

> [!NOTE]
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

Learn more about the cluster extensions currently available for Azure Arc-enabled Kubernetes:

* [Azure Monitor](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json)
* [Microsoft Defender for Cloud](../../security-center/defender-for-kubernetes-azure-arc.md?toc=/azure/azure-arc/kubernetes/toc.json)
* [Azure Arc-enabled Open Service Mesh](tutorial-arc-enabled-open-service-mesh.md)
* [Microsoft Defender for Cloud](../../security-center/defender-for-kubernetes-azure-arc.md?toc=/azure/azure-arc/kubernetes/toc.json)
* [Azure App Service on Azure Arc](../../app-service/overview-arc-integration.md)
* [Event Grid on Kubernetes](../../event-grid/kubernetes/overview.md)
* [Azure API Management on Azure Arc](../../api-management/how-to-deploy-self-hosted-gateway-azure-arc.md)
