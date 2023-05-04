---
title: Use a private link for data ingestion
description: Overview of private link for secure data ingestion to Azure Monitor workspace from virtual networks.
author: EdB-MSFT
ms.author: edbaynash 
ms.reviewer: tbd
ms.topic: conceptual
ms.date: 03/28/2023
---

# Private Link for data ingestion for Managed Prometheus and Azure Monitor workspace

Configuration for Private Link of data ingestion for Managed Prometheus and the Azure Monitor workspace that stores the data is done on the Data Collection Endpoints (DCE) that are associated with the workspace. Refer to the [Azure Monitor private link documentation](../logs/private-link-configure.md) to define your Azure Monitor Private Link scope (AMPLS) and then associate your DCEs with the AMPLS.

To find the DCEs associated with your Azure Monitor workspace:

1. Open the Azure Monitor workspaces menu in the Azure portal
2. Select your workspace
3. Select Data Collection Endpoints from the workspace menu

:::image type="content" source="media/private-link-data-ingestion/amw-data-collection-endpoints.jpg" alt-text="A screenshot show the data collection endpoints page for an Azure Monitor workspace" lightbox="media/private-link-data-ingestion/amw-data-collection-endpoints.jpg" :::

The page displays all of the DCEs that are associated with the Azure Monitor workspace and that enable data ingestion into the workspace. Select the DCE you want to configure with Private Link and then follow the steps to [create an Azure Monitor private link scope](../logs/private-link-configure.md) to complete the process.

> [!NOTE]
> Please refer to [use private endpoints for queries](azure-monitor-workspace-private-endpoint.md) for details on how to configure private link for querying data from your Azure Monitor workspace.

## Private link ingestion from a private AKS cluster

The below steps show how to setup Managed Prometheus and the AKS add-on to collect and ingest data from a private AKS cluster into an Azure Monitor workspace using an Azure Monitor Private Link scope.

Steps involved:

1. [Create your private AKS cluster](https://learn.microsoft.com/azure/aks/private-clusters).

1.  [Create a private endpoint](https://learn.microsoft.com/azure/aks/private-clusters#create-a-private-endpoint-resource) in the AKS VNET to access the cluster. Follow the steps in the linked document to then create a private DNS zone, an A record, and then link the private DNS zone to the virtual network.
1. [Create an Azure Monitor Private Link scope](https://learn.microsoft.com/azure/azure-monitor/logs/private-link-configure#create-a-private-link-connection-through-the-azure-portal).
1. [Connect the Azure Monitor Private Link scope to another private endpoint](https://learn.microsoft.com/azure/azure-monitor/logs/private-link-configure#connect-to-a-private-endpoint) in the virtual network used by the private AKS cluster. This private endpoint will be used to access your Data Collection Endpoint(s).
1. Navigate to your Azure Monitor workspace in the portal. You may now [onboard the private cluster](https://learn.microsoft.com/azure/azure-monitor/essentials/prometheus-metrics-enable?tabs=azure-portal#enable-prometheus-metric-collection) to Managed Prometheus.  
As part of onboarding, a Data Collection Endpoint resource will be created that your private AKS cluster needs access to in order to have Prometheus metrics sent into the Azure Monitor workspace. At this point it won't yet have access to it since the Data Collection Endpoint is not yet associated with your Azure Monitor Private Link scope. 
1. Choose 'Data Collection Endpoints' from the Azure Monitor workspace menu. By default, the name of the Data Collection Endpoint uses this pattern 'MSProm-<azureMonitorWorkspaceLocation>-<clusterName>'. Looks for the Data Collection Endpoint that ends with the name of the cluster you just onboarded and select it.
1. The Data Collection Endpoint page loads with the Network Isolation page pre-selected. From this page select **Add** and choose the Azure Monitor Private Link scope you created.  It takes a few minutes for the settings to propagate. Once completed, data from your private AKS cluster will be ingested into your Azure Monitor workspace over the private link.
1. Verify that data is being ingested

## Private link ingestion for remote write

The following step show how to set up remote write for a Kubernetes cluster over a private link VNET and an Azure Monitor Private Link scope.

It is assumed that you have  your on-premise Kubernetes cluster.

1. [Create your Azure virtual network](https://learn.microsoft.com/azure/virtual-network/quick-create-portal).

1.  Configure the on-premise cluster to connect to an Azure VNET using a [VPN gateway](https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoutes](https://learn.microsoft.com/azure/expressroute/expressroute-locations) with private-peering.
1. [Create an Azure Monitor Private Link scope](https://learn.microsoft.com/azure/azure-monitor/logs/private-link-configure#create-a-private-link-connection-through-the-azure-portal).
1. [Connect the Azure Monitor Private Link scope to a private endpoint](https://learn.microsoft.com/azure/azure-monitor/logs/private-link-configure#connect-to-a-private-endpoint) in the virtual network used by the on-premise cluster. This private endpoint will be used to access your Data Collection Endpoint(s).
1.  Navigate to your Azure Monitor workspace in the Azure portal.  A part of creating your Azure Monitor workspace a system Data Collection Endpoint is created that you can use to ingest data via remote write.
1. Choose **Data Collection Endpoints** from the Azure Monitor workspace menu. 
1. Select the system Data Collection Endpoint. The system Data Collection Endpoint has a default name that is the same as the name of your Azure Monitor workspace. 
1. The Data Collection Endpoint loads with the Network Isolation page pre-selected. Select **Add** and choose the Azure Monitor Private Link scope you created. It takes a few minutes for the settings to propagate. Once completed, data from your private AKS cluster will be ingested into your Azure Monitor workspace over the private link.
1. Verify that data is being ingested 



## Verify that data is being ingested

To verify data is being ingested, try one of the following:

-  Open the Workbooks page from your Azure Monitor workspace and select the **Prometheus Explorer** tile.  For more information on Azure Monitor workspace  Workbooks, see [Workbooks overview](./prometheus-workbooks.md). 

 -  Use a linked Grafana Instance. For mor information on linking a Grafana instance to your workspace, see [Link a Grafana workspace](./azure-monitor-workspace-manage?tabs=azure-portal.md#link-a-grafana-workspace) with your Azure Monitor workspace.
## Next steps

- [Configure Public Access settings](azure-monitor-workspace-network-public-access.md)
- [Managed Grafana network settings](../TBD/doc_that_covers_private_link_for_query.md)
- [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md)
- [Verify remote write is working correctly](prometheus-remote-write.md#verify-remote-write-is-working-correctly)
