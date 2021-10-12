---
title: "Azure Arc-enabled Kubernetes cluster extensions"
services: azure-arc
ms.service: azure-arc
ms.date: 06/18/2021
ms.topic: article
author: shashankbarsin
ms.author: shasb
description: "Deploy and manage lifecycle of extensions on Azure Arc-enabled Kubernetes"
---

# Deploy and manage Azure Arc-enabled Kubernetes cluster extensions

The Kubernetes extensions feature enables the following on Azure Arc-enabled Kubernetes clusters:

* Azure Resource Manager-based deployment of cluster extension.
* Lifecycle management of extension Helm charts.

In this article, you learn:
> [!div class="checklist"]
> * Current available Azure Arc-enabled Kubernetes cluster extensions.
> * How to create extension instances.
> * Required and optional parameters.
> * How to view, list, update, and delete extension instances. 

A conceptual overview of this feature is available in [Cluster extensions - Azure Arc-enabled Kubernetes](conceptual-extensions.md) article.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

- [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version >= 2.16.0.
- `connectedk8s` (version >= 1.1.0) and `k8s-extension` (version >= 0.2.0) Azure CLI extensions. Install these Azure CLI extensions by running the following commands:
  
    ```azurecli
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    ```
    
    If the `connectedk8s` and `k8s-extension` extension are already installed, you can update them to the latest version using the following command:

    ```azurecli
    az extension update --name connectedk8s
    az extension update --name k8s-extension
    ```

- An existing Azure Arc-enabled Kubernetes connected cluster.
    - If you haven't connected a cluster yet, use our [quickstart](quickstart-connect-cluster.md).
    - [Upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to version >= 1.1.0.

## Currently available extensions

| Extension | Description |
| --------- | ----------- |
| [Azure Monitor](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json) | Provides visibility into the performance of workloads deployed on the Kubernetes cluster. Collects memory and CPU utilization metrics from controllers, nodes, and containers. |
| [Azure Defender](../../security-center/defender-for-kubernetes-azure-arc.md?toc=/azure/azure-arc/kubernetes/toc.json) | Gathers information related to security like audit log data from the Kubernetes cluster. Provides recommendations and threat alerts based on gathered data. |
| [Azure Arc-enabled Open Service Mesh](tutorial-arc-enabled-open-service-mesh.md) | Deploys Open Service Mesh on the cluster and enables capabilities like mTLS security, fine grained access control, traffic shifting, monitoring with Azure Monitor or with open source add-ons of Prometheus and Grafana, tracing with Jaeger, integration with external certification management solution. |
| [Azure Arc-enabled Data Services](../../azure-arc/kubernetes/custom-locations.md#create-custom-location) | Makes it possible for you to run Azure data services on-prem, at the edge, and in public clouds using Kubernetes and the infrastructure of your choice. |
| [Azure App Service on Azure Arc](../../app-service/overview-arc-integration.md) | Allows you to provision an App Service Kubernetes environment on top of Azure Arc-enabled Kubernetes clusters. |
| [Event Grid on Kubernetes](../../event-grid/kubernetes/overview.md) | Create and manage event grid resources such as topics and event subscriptions on top of Azure Arc-enabled Kubernetes clusters. |
| [Azure API Management on Azure Arc](../../api-management/how-to-deploy-self-hosted-gateway-azure-arc.md) | Deploy and manage API Management gateway on Azure Arc-enabled Kubernetes clusters. |
| [Azure Arc-enabled Machine Learning](../../machine-learning/how-to-attach-arc-kubernetes.md) | Deploy and run Azure Machine Learning on Azure Arc-enabled Kubernetes clusters. |

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
> * The service is unable to retain sensitive information for more than 48 hours. If Azure Arc-enabled Kubernetes agents don't have network connectivity for more than 48 hours and cannot determine whether to create an extension on the cluster, then the extension transitions to `Failed` state. Once in `Failed` state, you will need to run `k8s-extension create` again to create a fresh extension Azure resource.
> * Azure Monitor for containers is a singleton extension (only one required per cluster). You'll need to clean up any previous Helm chart installations of Azure Monitor for containers (without extensions) before installing the same via extensions. Follow the instructions for [deleting the Helm chart before running `az k8s-extension create`](../../azure-monitor/containers/container-insights-optout-hybrid.md).

**Required parameters**

| Parameter name | Description |
|----------------|------------|
| `--name` | Name of the extension instance |
| `--extension-type` | The type of extension you want to install on the cluster. For example: Microsoft.AzureMonitor.Containers, microsoft.azuredefender.kubernetes | 
| `--scope` | Scope of installation for the extension - `cluster` or `namespace` |
| `--cluster-name` | Name of the Azure Arc-enabled Kubernetes resource on which the extension instance has to be created |
| `--resource-group` | The resource group containing the Azure Arc-enabled Kubernetes resource |
| `--cluster-type` | The cluster type on which the extension instance has to be created. Current only `connectedClusters`, which corresponds to Azure Arc-enabled Kubernetes, is an accepted value |

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

## Next steps

Learn more about the cluster extensions currently available for Azure Arc-enabled Kubernetes:

> [!div class="nextstepaction"]
> [Azure Monitor](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json)
> [Azure Defender](../../security-center/defender-for-kubernetes-azure-arc.md?toc=/azure/azure-arc/kubernetes/toc.json)
> [Azure Arc-enabled Open Service Mesh](tutorial-arc-enabled-open-service-mesh.md)
> 
> [!div class="nextstepaction"]
> [Azure Defender](../../security-center/defender-for-kubernetes-azure-arc.md?toc=/azure/azure-arc/kubernetes/toc.json)
> 
> [!div class="nextstepaction"]
> [Azure App Service on Azure Arc](../../app-service/overview-arc-integration.md)
> 
> [!div class="nextstepaction"]
> [Event Grid on Kubernetes](../../event-grid/kubernetes/overview.md)
> 
> [!div class="nextstepaction"]
> [Azure API Management on Azure Arc](../../api-management/how-to-deploy-self-hosted-gateway-azure-arc.md)
