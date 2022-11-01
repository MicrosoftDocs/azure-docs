---
title: Update Container insights for metrics | Microsoft Docs
description: This article describes how you update Container insights to enable the custom metrics feature that supports exploring and alerting on aggregated metrics.
ms.topic: conceptual
ms.date: 08/29/2022 
ms.custom: devx-track-azurecli
ms.reviewer: viviandiec

---

# Update Container insights to enable metrics

Container insights now includes support for collecting metrics from Azure Kubernetes Service (AKS) and Azure Arc-enabled Kubernetes cluster nodes and pods, and then writing those metrics to the Azure Monitor metrics store. With this support, you can present timely aggregate calculations (average, count, maximum, minimum, sum) in performance charts, pin performance charts in Azure portal dashboards, and take advantage of metric alerts.

This feature enables the following metrics:

| Metric namespace | Metric | Description |
|------------------|--------|-------------|
| Insights.container/nodes | cpuUsageMillicores, cpuUsagePercentage, memoryRssBytes, memoryRssPercentage, memoryWorkingSetBytes, memoryWorkingSetPercentage, cpuUsageAllocatablePercentage, memoryWorkingSetAllocatablePercentage, memoryRssAllocatablePercentage, nodesCount, diskUsedPercentage, | As *node* metrics, they include host as a dimension. They also include the node's name as a value for the host dimension. |
| Insights.container/pods | podCount, completedJobsCount, restartingContainerCount, oomKilledContainerCount, podReadyPercentage | As *pod* metrics, they include the following as dimensions: ControllerName, Kubernetes namespace, name, phase. |
| Insights.container/containers | cpuExceededPercentage, memoryRssExceededPercentage, memoryWorkingSetExceededPercentage, cpuThresholdViolated, memoryRssThresholdViolated, memoryWorkingSetThresholdViolated | |
| Insights.container/persistentvolumes | pvUsageExceededPercentage, pvUsageThresholdViolated | |

To support these capabilities, the feature includes these containerized agents:

- Version *microsoft/oms:ciprod05262020* for AKS
- Version *microsoft/oms:ciprod09252020* for Azure Arc-enabled Kubernetes clusters

New deployments of AKS automatically include this configuration and the metric-collecting capabilities. You can update your cluster to support this feature from the Azure portal, Azure PowerShell, or the Azure CLI. With Azure PowerShell and the Azure CLI, you can enable the feature for each cluster or for all clusters in your subscription.

Either process assigns the *Monitoring Metrics Publisher* role to the cluster's service principal or the user-assigned MSI for the monitoring add-on. The data that the agent collects from the agent can then be published to your cluster resource. 

Monitoring Metrics Publisher has permission only to push metrics to the resource. It can't alter any state, update the resource, or read any data. For more information, see [Monitoring Metrics Publisher role](../../role-based-access-control/built-in-roles.md#monitoring-metrics-publisher). The Monitoring Metrics Publisher role requirement doesn't apply to Azure Arc-enabled Kubernetes clusters.

> [!IMPORTANT]
> Azure Arc-enabled Kubernetes clusters already have the minimum required agent version, so an update isn't necessary. The assignment of Monitoring Metrics Publisher role to the cluster's service principal or user-assigned MSI for the monitoring add-on happens automatically when you're using the Azure portal, Azure PowerShell, or the Azure CLI.

## Prerequisites

Before you update your cluster, confirm the following:

* Custom metrics are available in only a subset of Azure regions. [See a list of supported regions](../essentials/metrics-custom-overview.md#supported-regions).

* You're a member of the [Owner](../../role-based-access-control/built-in-roles.md#owner) role on the AKS cluster resource to enable collection of custom performance metrics for nodes and pods. This requirement does not apply to Azure Arc-enabled Kubernetes clusters.

If you choose to use the Azure CLI, you first need to install and use it locally. You must be running the Azure CLI version 2.0.59 or later. To identify your version, run `az --version`. If you need to install or upgrade the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Update one cluster by using the Azure portal

To update an existing AKS cluster monitored by Container insights:

1. Select the cluster to view its health from the multiple-cluster view in Azure Monitor or directly from the cluster by selecting **Insights** from the left pane.

2. In the banner that appears at the top of the pane, select **Enable** to start the update. 

   :::image type="content" source="./media/container-insights-update-metrics/portal-banner-enable-01.png" alt-text="Screenshot of the Azure portal that shows the banner for upgrading an AKS cluster." lightbox="media/container-insights-update-metrics/portal-banner-enable-01.png":::

   The process can take several seconds to finish. You can track its progress under **Notifications** from the menu.

## Update all clusters by using the Azure CLI

To update all clusters in your subscription by using Bash in the Azure CLI, run the following command. Edit the value for `subscriptionId` by using the value from the **AKS Overview** page for the AKS cluster.

```azurecli
az login
az account set --subscription "Subscription Name"
curl -sL https://aka.ms/ci-md-onboard-atscale | bash -s subscriptionId   
```

The configuration change can take a few seconds to finish. When it's finished, a message like the following one appears and includes the result:

```azurecli
completed role assignments for all AKS clusters in subscription: <subscriptionId>
```

## Update one cluster by using the Azure CLI

To update a specific cluster in your subscription by using Azure CLI, run the following command. Edit the values for `subscriptionId`, `resourceGroupName`, and `clusterName` by using the values on the **AKS Overview** page for the AKS cluster. The value of `clientIdOfSPN` is returned when you run the command `az aks show`.

```azurecli
az login
az account set --subscription "<subscriptionName>"
az aks show -g <resourceGroupName> -n <clusterName> --query "servicePrincipalProfile"
az aks show -g <resourceGroupName> -n <clusterName> --query "addonProfiles.omsagent.identity"
az role assignment create --assignee <clientIdOfSPN> --scope <clusterResourceId> --role "Monitoring Metrics Publisher" 
```


To get the value for `clientIdOfSPNOrMsi`, you can run the command `az aks show` as shown in the following example. If the `servicePrincipalProfile` object has a valid `objectid` value, you can use that. Otherwise, if it's set to `msi`, you need to pass in the Object ID from `addonProfiles.omsagent.identity.objectId`.

```azurecli
az login
az account set --subscription "<subscriptionName>"
az aks show -g <resourceGroupName> -n <clusterName> --query "servicePrincipalProfile"
az aks show -g <resourceGroupName> -n <clusterName> --query "addonProfiles.omsagent.identity" 
az role assignment create --assignee <clientIdOfSPNOrMsi> --scope <clusterResourceId> --role "Monitoring Metrics Publisher"
```

>[!NOTE]
>If you want to perform the role assignment with your user account, use the `--assignee` parameter as shown in the example. If you want to perform the role assignment with a service principal name (SPN), use the `--assignee-object-id` and `--assignee-principal-type` parameters instead of the `--assignee` parameter.

## Update all clusters by using Azure PowerShell

To update all clusters in your subscription by using Azure PowerShell:

1. [Download](https://github.com/microsoft/OMS-docker/blob/ci_feature_prod/docs/aks/mdmonboarding/mdm_onboarding_atscale.ps1) the *mdm_onboarding_atscale.ps1* script from GitHub and save it to a local folder.
2. Run the following command. Edit the value for `subscriptionId` by using the value from the **AKS Overview** page for the AKS cluster.

    ```powershell
    .\mdm_onboarding_atscale.ps1 subscriptionId
    ```
    The configuration change can take a few seconds to finish. When it's finished, a message like the following one appears and includes the result:

    ```powershell
    Completed adding role assignment for the aks clusters in subscriptionId :<subscriptionId>
    ```

## Update one cluster by using Azure PowerShell

To update a specific cluster by using Azure PowerShell:

1. [Download](https://github.com/microsoft/OMS-docker/blob/ci_feature_prod/docs/aks/mdmonboarding/mdm_onboarding.ps1) the *mdm_onboarding.ps1* script from GitHub and save it to a local folder.

2. Run the following command. Edit the values for `subscriptionId`, `resourceGroupName`, and `clusterName` by using the values on the **AKS Overview** page for the AKS cluster.

    ```powershell
    .\mdm_onboarding.ps1 subscriptionId <subscriptionId> resourceGroupName <resourceGroupName> clusterName <clusterName>
    ```

    The configuration change can take a few seconds to finish. When it's finished, a message like the following one appears and includes the result:

    ```powershell
    Successfully added Monitoring Metrics Publisher role assignment to cluster : <clusterName>
    ```

## Verify the update

After you update Container insights by using one of the methods described earlier, go to the Azure Monitor metrics explorer and verify from **Metric namespace** that **insights** is listed. If it is, you can start setting up [metric alerts](../alerts/alerts-metric.md) or pinning your charts to [dashboards](../../azure-portal/azure-portal-dashboards.md).  
