---
title: Enable private link with Container insights
description: Learn how to enable private link on an Azure Kubernetes Service (AKS) cluster.
ms.topic: conceptual
ms.date: 06/05/2024
ms.custom: devx-track-azurecli
ms.reviewer: aul
---

# Enable private link for Kubernetes monitoring
This article describes how to configure monitoring for your Kubernetes cluster for 

[Azure Private Link](../../private-link/private-link-overview.md) enables you to access Azure platform as a service (PaaS) resources to your virtual network by using private endpoints. An [Azure Monitor Private Link Scope (AMPLS)](../logs/private-link-security.md) connects a private endpoint to a set of Azure Monitor resources to define the boundaries of your monitoring network. 

> [!NOTE]
> - See [Connect to a data source privately](../../../articles/managed-grafana/how-to-connect-to-data-source-privately.md) for details on how to configure private link to query data from your Azure Monitor workspace using Grafana.
> - See [Use private endpoints for Managed Prometheus and Azure Monitor workspace](../essentials/azure-monitor-workspace-private-endpoint.md) for details on how to configure private link to query data from your Azure Monitor workspace using workbooks.


## Prerequisites
This article describes how to connect your cluster to an existing Azure Monitor Private Link Scope (AMPLS). Create an AMPLS following the guidance in [Configure your private link](../logs/private-link-configure.md).

## Managed Prometheus

### Configure DCEs
Private links for data ingestion for Managed Prometheus are configured on the Data Collection Endpoints (DCE) of the workspace that stores the data. To identify the DCEs associated with your Azure Monitor workspace, select **Data Collection Endpoints** from your Azure Monitor workspace in the Azure portal.

:::image type="content" source="media/kubernetes-monitoring-private-link/azure-monitor-workspace-data-collection-endpoints.png" alt-text="A screenshot show the data collection endpoints page for an Azure Monitor workspace." lightbox="media/kubernetes-monitoring-private-link/azure-monitor-workspace-data-collection-endpoints.png" :::

If your AKS cluster isn't in the same region as your Azure Monitor workspace, then you need to [create another DCE](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint) in the same region as the AKS cluster. In this case, open the data collection rule (DCR ) created when you enabled Managed Prometheus. This DCR will be named **MSPrometheus-\<clusterName\>-\<clusterRegion\>**. The cluster will be listed on the **Resources** page. On the **Data collection endpoint** dropdown, select the DCE in the same region as the AKS cluster.

:::image type="content" source="media/kubernetes-monitoring-private-link/azure-monitor-workspace-data-collection-rule.png" alt-text="A screenshot show the data collection rules page for an Azure Monitor workspace." lightbox="media/kubernetes-monitoring-private-link/azure-monitor-workspace-data-collection-rule.png" :::


## Ingestion from a private AKS cluster
By default, a private AKS cluster can send data to Managed Prometheus and your Azure Monitor workspace over the public network using a public Data Collection Endpoint.

If you choose to use an Azure Firewall to limit the egress from your cluster, you can implement one of the following:

- Open a path to the public ingestion endpoint. Update the routing table with the following two endpoints:
  - `*.handler.control.monitor.azure.com`
  - `*.ingest.monitor.azure.com`
- Enable the Azure Firewall to access the Azure Monitor Private Link scope and DCE that's used for data ingestion.

## Private link ingestion for remote write
Use the following steps to set up remote write for a Kubernetes cluster over a private link virtual network and an Azure Monitor Private Link scope.

1. Create your Azure virtual network.
1. Configure the on-premises cluster to connect to an Azure VNET using a VPN gateway or ExpressRoutes with private-peering.
1. Create an Azure Monitor Private Link scope.
1. Connect the Azure Monitor Private Link scope to a private endpoint in the virtual network used by the on-premises cluster. This private endpoint is used to access your DCEs.
1. From your Azure Monitor workspace in the portal, select **Data Collection Endpoints** from the Azure Monitor workspace menu. 
1. You'll have at least one DCE which will have the same name as your workspace. Click on the DCE to open its details.
1. Select the **Network Isolation** page for the DCE. 
2. Click **Add** and select your Azure Monitor Private Link scope. It takes a few minutes for the settings to propagate. Once completed, data from your private AKS cluster is ingested into your Azure Monitor workspace over the private link.


## Container insights
For Container insights, the cluster needs access to the Log Analytics workspace. 

### Cluster using managed identity authentication

### Prerequisites
- Create an Azure Monitor Private Link Scope (AMPLS) following the guidance in [Configure your private link](../logs/private-link-configure.md).
- The template must be deployed in the same resource group as the cluster.


### [CLI](#tab/cli)

#### Existing AKS Cluster 

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
Use the following procedures to enable network isolation by connecting your cluster to the Log Analytics workspace using [Azure Private Link](../logs/private-link-security.md) if your cluster is not using managed identity authentication. This requires a [private AKS cluster](../../aks/private-clusters.md).

1. Create a private AKS cluster following the guidance in [Create a private Azure Kubernetes Service cluster](../../aks/private-clusters.md).

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
