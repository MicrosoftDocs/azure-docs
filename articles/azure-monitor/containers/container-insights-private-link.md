---
title: Enable private link with Container insights
description: Learn how to enable private link on an Azure Kubernetes Service (AKS) cluster.
ms.topic: conceptual
ms.date: 06/05/2024
ms.custom: devx-track-azurecli
ms.reviewer: aul
---

# Enable private link with Container insights
This article describes how to configure Container insights to use Azure Private Link for your AKS cluster.


## Cluster using managed identity authentication

### [CLI](#tab/cli)


### Prerequisites
 - Azure CLI version 2.61.0 or higher.
 - Create an Azure Monitor Private Link Scope (AMPLS) following the guidance in [Configure your private link](../logs/private-link-configure.md).


### Existing AKS Cluster 

**Use default Log Analytics workspace**

```azurecli
az aks enable-addons --addon monitoring --name <cluster-name> --resource-group <cluster-resource-group-name> --ampls-resource-id "<azure-monitor-private-link-scope-resource-id>"
```

Example:

```azurecli
az aks enable-addons --addon monitoring --name "my-cluster" --resource-group "my-resource-group" --workspace-resource-id "/subscriptions/my-subscription/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace" --ampls-resource-id "/subscriptions/my-subscription /resourceGroups/my-resource-group/providers/microsoft.insights/privatelinkscopes/my-ampls-resource"
```

**Use existing Log Analytics workspace**

```azurecli
az aks enable-addons --addon monitoring --name <cluster-name> --resource-group <cluster-resource-group-name> --workspace-resource-id <workspace-resource-id> --ampls-resource-id "<azure-monitor-private-link-scope-resource-id>"
```

Example:

```azurecli
az aks enable-addons --addon monitoring --name "my-cluster" --resource-group "my-resource-group" --workspace-resource-id "/subscriptions/my-subscription/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace" --ampls-resource-id "/subscriptions/my-subscription /resourceGroups/ my-resource-group/providers/microsoft.insights/privatelinkscopes/my-ampls-resource"
```

### New AKS cluster

```azurecli
az aks create --resource-group rgName --name clusterName --enable-addons monitoring --workspace-resource-id "workspaceResourceId" --ampls-resource-id "azure-monitor-private-link-scope-resource-id"
```

Example:

```azurecli
az aks create --resource-group "my-resource-group"  --name "my-cluster"  --enable-addons monitoring --workspace-resource-id "/subscriptions/my-subscription/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace" --ampls-resource-id "/subscriptions/my-subscription /resourceGroups/ my-resource-group/providers/microsoft.insights/privatelinkscopes/my-ampls-resource"
```


### [ARM](#tab/arm)

The following sections provide links to the template and parameter files for enabling private link with Container insights on an AKS and Arc-enabled clusters. 

Edit the values in the parameter file and deploy the template using any valid method for deploying ARM templates. Retrieve the **resource ID** of the resources from the **JSON** View of their **Overview** page.

 Based on your requirements, you can configure other parameters such `streams`, `enableContainerLogV2`, `enableSyslog`, `syslogLevels`, `syslogFacilities`, `dataCollectionInterval`, `namespaceFilteringModeForDataCollection` and `namespacesForDataCollection`. 

### Prerequisites
- Create an Azure Monitor Private Link Scope (AMPLS) following the guidance in [Configure your private link](../logs/private-link-configure.md).
- The template must be deployed in the same resource group as the cluster.

### AKS cluster

**Template file:** https://aka.ms/aks-enable-monitoring-msi-onboarding-template-file<br>
**Parameter file:** https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file


| Parameter | Description |
|:---|:---|
| `aksResourceId`| Resource ID of the cluster. |
| `aksResourceLocation` | Azure Region of the cluster. |
| `workspaceResourceId`| Resource ID of the  Log Analytics workspace. |
| `workspaceRegion`	| Region of the Log Analytics workspace. |
| `resourceTagValues` | Tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name will be MSCI-\<clusterName\>-\<clusterRegion\>, and this resource created in an AKS clusters resource group. For first time onboarding, you can set arbitrary tag values. |
| `useAzureMonitorPrivateLinkScope` | Boolean flag to indicate whether Azure Monitor link scope is used or not. |
| `azureMonitorPrivateLinkScopeResourceId` | Resource ID of the Azure Monitor Private link scope.   This only used if `useAzureMonitorPrivateLinkScope` is set to **true**. |

### Arc-enabled Kubernetes cluster

**Template file:** https://aka.ms/arc-k8s-azmon-extension-msi-arm-template<br>
**Parameter file:** https://aka.ms/arc-k8s-azmon-extension-msi-arm-template-params

| Parameter | Description |
|:---|:---|
| `clusterResourceId` | Resource ID of the cluster. |
| `clusterRegion` | Azure Region of the cluster. |
| `workspaceResourceId` | Resource ID of the  Log Analytics workspace. |
| `workspaceRegion` | Region of the Log Analytics workspace. |
| `workspaceDomain`	| Domain of the Log Analytics workspace:<br>`opinsights.azure.com` for Azure public cloud<br>`opinsights.azure.us` for Azure US Government<br>`opinsights.azure.cn` for Azure China Cloud |
| `resourceTagValues` | Tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name will be MSCI-\<clusterName\>-\<clusterRegion\>, and this resource created in an AKS clusters resource group. For first time onboarding, you can set arbitrary tag values. |
| `useAzureMonitorPrivateLinkScope` | Boolean flag to indicate whether Azure Monitor link scope is used or not. |
| `azureMonitorPrivateLinkScopeResourceId` | Resource ID of the Azure Monitor Private link scope.   This is only used if `useAzureMonitorPrivateLinkScope` is set to **true**. |

---

## Cluster using legacy authentication
Use the following procedures to enable network isolation by connecting your cluster to the Log Analytics workspace using [Azure Private Link](../logs/private-link-security.md) if your cluster is not using managed identity authentication. This requires a [private AKS cluster](/azure/aks/private-clusters).

1. Create a private AKS cluster following the guidance in [Create a private Azure Kubernetes Service cluster](/azure/aks/private-clusters).

2. Disable public Ingestion on your Log Analytics workspace. 

    Use the following command to disable public ingestion on an existing workspace.

    ```cli
    az monitor log-analytics workspace update --resource-group <azureLogAnalyticsWorkspaceResourceGroup> --workspace-name <azureLogAnalyticsWorkspaceName>  --ingestion-access Disabled
    ```

    Use the following command to create a new workspace with public ingestion disabled.

    ```cli
    az monitor log-analytics workspace create --resource-group <azureLogAnalyticsWorkspaceResourceGroup> --workspace-name <azureLogAnalyticsWorkspaceName>  --ingestion-access Disabled
    ```

3. Configure private link by following the instructions at [Configure your private link](../logs/private-link-configure.md). Set ingestion access to public and then set to private after the private endpoint is created but before monitoring is enabled. The private link resource region must be same as AKS cluster region. 

4. Enable monitoring for the AKS cluster.

    ```cli
    az aks enable-addons -a monitoring --resource-group <AKSClusterResourceGorup> --name <AKSClusterName> --workspace-resource-id <workspace-resource-id>
    ```



## Next steps

* If you experience issues while you attempt to onboard the solution, review the [Troubleshooting guide](container-insights-troubleshoot.md).
* With monitoring enabled to collect health and resource utilization of your AKS cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.
