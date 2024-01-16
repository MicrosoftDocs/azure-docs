---
title: Enable private link with Container insights
description: Learn how to enable private link on an Azure Kubernetes Service (AKS) cluster.
ms.topic: conceptual
ms.date: 10/18/2023
ms.custom: ignite-2022, devx-track-azurecli
ms.reviewer: aul
---

# Enable private link with Container insights
This article describes how to configure Container insights to use Azure Private Link for your AKS cluster.


## Cluster using managed identity authentication
Use the following procedures to enable network isolation by connecting your cluster to the Log Analytics workspace using [Azure Private Link](../logs/private-link-security.md) if your cluster is using managed identity authentication.

1. Follow the steps in [Enable network isolation for the Azure Monitor agent](../agents/azure-monitor-agent-data-collection-endpoint.md#enable-network-isolation-for-azure-monitor-agent) to create a data collection endpoint (DCE) and add it to your Azure Monitor private link service (AMPLS).

1. Create an association between the cluster and the DCE by using the following API call. For information on this call, see [Data collection rule associations - Create](/rest/api/monitor/data-collection-rule-associations/create). The DCR association name must be **configurationAccessEndpoint**, and `resourceUri` is the resource ID of the AKS cluster.

    ```rest
    PUT https://management.azure.com/{cluster-resource-id}/providers/Microsoft.Insights/dataCollectionRuleAssociations/configurationAccessEndpoint?api-version=2021-04-01
    {
    "properties": {
        "dataCollectionEndpointId": "{data-collection-endpoint-resource-id}"
        }
    }
    ```

    For example, using Azure CLI:

    ```rest
    PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/my-aks-cluster/providers/Microsoft.Insights/dataCollectionRuleAssociations/configurationAccessEndpoint?api-version=2021-04-01

    {
    "properties": {
        "dataCollectionEndpointId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Insights/dataCollectionEndpoints/myDataCollectionEndpoint"
        }
    }
    ```


### Cluster using legacy authentication
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

