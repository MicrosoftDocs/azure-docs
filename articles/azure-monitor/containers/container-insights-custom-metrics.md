---
title: Custom metrics collected by Container insights
description: Describes the custom metrics collected for a Kubernetes cluster by Container insights in Azure Monitor.
ms.topic: conceptual
ms.custom: ignite-2022, devx-track-azurecli
ms.date: 09/28/2022 
ms.reviewer: viviandiec
---

# Metrics collected by Container insights
Container insights collects [custom metrics](../essentials/metrics-custom-overview.md) from Azure Kubernetes Service (AKS) and Azure Arc-enabled Kubernetes cluster nodes and pods. With custom metrics, you can:

- Present timely aggregate calculations (average, count, maximum, minimum, and sum) in performance charts.
- Pin performance charts in Azure portal dashboards.
- Take advantage of [metric alerts](../alerts/alerts-types.md#metric-alerts).

> [!NOTE]
> This article describes collection of custom metrics from Kubernetes clusters. You can also collect Prometheus metrics as described in [Collect Prometheus metrics with Container insights](container-insights-prometheus.md).

## Use custom metrics
Custom metrics collected by Container insights can be accessed with the same methods as custom metrics collected from other data sources, including [metrics explorer](../essentials/metrics-getting-started.md) and [metrics alerts](../alerts/alerts-types.md#metric-alerts).

## Metrics collected
The following sections describe the metric values collected for your cluster.

### Node metrics

**Namespace:** `Insights.container/nodes`<br>
**Dimensions:** `host`

|Metric |Description |
|----|------------|
|cpuUsageMillicores |CPU utilization in millicores by host.|
|cpuUsagePercentage, cpuUsageAllocatablePercentage (preview) |CPU usage percentage by node and allocatable, respectively.|
|memoryRssBytes |Memory RSS utilization in bytes by host.|
|memoryRssPercentage, memoryRssAllocatablePercentage (preview) |Memory RSS usage percentage by host and allocatable, respectively.|
|memoryWorkingSetBytes |Memory Working Set utilization in bytes by host.|
|memoryWorkingSetPercentage, memoryRssAllocatablePercentage (preview) |Memory Working Set usage percentage by host and allocatable, respectively.|
|nodesCount |Count of nodes by status.|
|diskUsedPercentage |Percentage of disk used on the node by device.|

### Pod metrics
**Namespace:** `Insights.container/pods`<br>
**Dimensions:** `controllerName`, `Kubernetes namespace`

|Metric |Description |
|----|------------|
|podCount |Count of pods by controller, namespace, node, and phase.|
|completedJobsCount |Completed jobs count older user configurable threshold (default is six hours) by controller, Kubernetes namespace. |
|restartingContainerCount |Count of container restarts by controller and Kubernetes namespace.|
|oomKilledContainerCount |Count of OOMkilled containers by controller and Kubernetes namespace.|
|podReadyPercentage |Percentage of pods in ready state by controller and Kubernetes namespace.|

### Container metrics
**Namespace:** `Insights.container/containers`<br>
**Dimensions:** `containerName`, `controllerName`, `Kubernetes namespace`, `podName`

|Metric |Description |
|----|------------|
|(Old)cpuExceededPercentage |CPU utilization percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, and pod name.<br> Collected  |
|(New)cpuThresholdViolated |Metric triggered when CPU utilization percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, and pod name.<br> Collected  |
|(Old)memoryRssExceededPercentage |Memory RSS percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, and pod name.|
|(New)memoryRssThresholdViolated |Metric triggered when Memory RSS percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, and pod name.|
|(Old)memoryWorkingSetExceededPercentage |Memory Working Set percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, and pod name.|
|(New)memoryWorkingSetThresholdViolated |Metric triggered when Memory Working Set percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, and pod name.|

### Persistent volume metrics

**Namespace:** `Insights.container/persistentvolumes`<br>
**Dimensions:** `kubernetesNamespace`, `node`, `podName`, `volumeName`

|Metric |Description |
|----|------------|
|(Old)pvUsageExceededPercentage |Persistent volume (PV) utilization percentage for persistent volumes exceeding user configurable threshold (default is 60.0) by claim name, Kubernetes namespace, volume name, pod name, and node name.|
|(New)pvUsageThresholdViolated |Metric triggered when PV utilization percentage for persistent volumes exceeding user configurable threshold (default is 60.0) by claim name, Kubernetes namespace, volume name, pod name, and node name.|

## Enable custom metrics
If your cluster uses [managed identity authentication](container-insights-onboard.md#authentication) for Container insights, custom metrics will be enabled for you. If not, you need to enable custom metrics by using one of the following methods.

This process assigns the *Monitoring Metrics Publisher* role to the cluster's service principal. Monitoring Metrics Publisher has permission only to push metrics to the resource. It can't alter any state, update the resource, or read any data. For more information, see [Monitoring Metrics Publisher role](../../role-based-access-control/built-in-roles.md#monitoring-metrics-publisher). The Monitoring Metrics Publisher role requirement doesn't apply to Azure Arc-enabled Kubernetes clusters.

### Prerequisites

Before you update your cluster:

- See the supported regions for custom metrics at [Supported regions](../essentials/metrics-custom-overview.md#supported-regions).
- Confirm that you're a member of the [Owner](../../role-based-access-control/built-in-roles.md#owner) role on the AKS cluster resource to enable collection of custom performance metrics for nodes and pods. This requirement doesn't apply to Azure Arc-enabled Kubernetes clusters.

### Enablement options
Use one of the following methods to enable custom metrics for either a single cluster or all clusters in your subscription.

#### [Azure portal](#tab/portal)

1. Select the **Insights** menu for the cluster in the Azure portal.
1. On the banner that appears at the top of the pane, select **Enable** to start the update.

   :::image type="content" source="./media/container-insights-update-metrics/portal-banner-enable-01.png" alt-text="Screenshot that shows the Azure portal with the banner for upgrading an AKS cluster." lightbox="media/container-insights-update-metrics/portal-banner-enable-01.png":::

   The process can take several seconds to finish. You can track its progress under **Notifications** from the menu.

### [CLI](#tab/cli)

#### Update a single cluster
In the following command, edit the values for `subscriptionId`, `resourceGroupName`, and `clusterName` by using the values on the **AKS Overview** page for the AKS cluster. The value of `clientIdOfSPN` is returned when you run the command `az aks show`.

```azurecli
az login
az account set --subscription "<subscriptionName>"
az aks show -g <resourceGroupName> -n <clusterName> --query "servicePrincipalProfile"
az aks show -g <resourceGroupName> -n <clusterName> --query "addonProfiles.omsagent.identity"
az role assignment create --assignee <clientIdOfSPN> --scope <clusterResourceId> --role "Monitoring Metrics Publisher" 
```

To get the value for `clientIdOfSPNOrMsi`, run the command `az aks show` as shown in the following example. If the `servicePrincipalProfile` object has a valid `objectid` value, you can use that. Otherwise, if it's set to `msi`, pass in the object ID from `addonProfiles.omsagent.identity.objectId`.

```azurecli
az login
az account set --subscription "<subscriptionName>"
az aks show -g <resourceGroupName> -n <clusterName> --query "servicePrincipalProfile"
az aks show -g <resourceGroupName> -n <clusterName> --query "addonProfiles.omsagent.identity" 
az role assignment create --assignee <clientIdOfSPNOrMsi> --scope <clusterResourceId> --role "Monitoring Metrics Publisher"
```

>[!NOTE]
>If you want to perform the role assignment with your user account, use the `--assignee` parameter as shown in the example. If you want to perform the role assignment with a service principal name (SPN), use the `--assignee-object-id` and `--assignee-principal-type` parameters instead of the `--assignee` parameter.

#### Update all clusters
Run the following command to update all clusters in your subscription. Edit the value for `subscriptionId` by using the value on the **AKS Overview** page for the AKS cluster.

```azurecli
az login
az account set --subscription "Subscription Name"
curl -sL https://aka.ms/ci-md-onboard-atscale | bash -s subscriptionId   
```

The configuration change can take a few seconds to finish. When it's finished, a message like the following one appears and includes the result:

```azurecli
completed role assignments for all AKS clusters in subscription: <subscriptionId>
```

### [PowerShell](#tab/powershell)

#### Update a single cluster

To enable custom metrics for a specific cluster:

1. [Download the *mdm_onboarding.ps1* script from GitHub](https://github.com/microsoft/OMS-docker/blob/ci_feature_prod/docs/aks/mdmonboarding/mdm_onboarding.ps1) and save it to a local folder.

1. Run the following command. Edit the values for `subscriptionId`, `resourceGroupName`, and `clusterName` by using the values on the **AKS Overview** page for the AKS cluster.

    ```powershell
    .\mdm_onboarding.ps1 subscriptionId <subscriptionId> resourceGroupName <resourceGroupName> clusterName <clusterName>
    ```

    The configuration change can take a few seconds to finish. When it's finished, a message like the following one appears and includes the result:

    ```powershell
    Successfully added Monitoring Metrics Publisher role assignment to cluster : <clusterName>
    ```

#### Update all clusters

To enable custom metrics for all clusters in your subscription:

1. [Download the *mdm_onboarding_atscale.ps1* script from GitHub](https://github.com/microsoft/OMS-docker/blob/ci_feature_prod/docs/aks/mdmonboarding/mdm_onboarding_atscale.ps1) and save it to a local folder.
1. Run the following command. Edit the value for `subscriptionId` by using the value on the **AKS Overview** page for the AKS cluster.

    ```powershell
    .\mdm_onboarding_atscale.ps1 subscriptionId
    ```
    The configuration change can take a few seconds to finish. When it's finished, a message like the following one appears and includes the result:

    ```powershell
    Completed adding role assignment for the aks clusters in subscriptionId :<subscriptionId>
    ```

---

## Verify the update
To verify that custom metrics are enabled, open [metrics explorer](../essentials/metrics-getting-started.md) and verify from **Metric namespace** that **insights** is listed.

## Next steps

- [Create alerts based on custom metrics collected for the cluster](container-insights-metric-alerts.md)
- [Collect Prometheus metrics from your AKS cluster](container-insights-prometheus.md)
