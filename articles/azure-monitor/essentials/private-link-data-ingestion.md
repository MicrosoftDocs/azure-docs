---
title: Use a private link for Managed Prometheus data ingestion
description: Overview of private link for secure data ingestion to Azure Monitor workspace from virtual networks.
author: EdB-MSFT
ms.author: edbaynash 
ms.reviewer: tbd
ms.topic: conceptual
ms.date: 03/28/2023
---

# Private Link for data ingestion for Managed Prometheus and Azure Monitor workspace

Private links for data ingestion for Managed Prometheus are configured on the Data Collection Endpoints (DCE) of the workspace that stores the data.

This article shows you how to configure the DCEs associated with your Azure Monitor workspace to use a Private Link for data ingestion.

To define your Azure Monitor Private Link scope (AMPLS), see [Azure Monitor private link documentation](../logs/private-link-configure.md),  then associate your DCEs with the AMPLS.

Find the DCEs associated with your Azure Monitor workspace.

1. Open the Azure Monitor workspaces menu in the Azure portal
2. Select your workspace
3. Select Data Collection Endpoints from the workspace menu

:::image type="content" source="media/private-link-data-ingestion/azure-monitor-workspace-data-collection-endpoints.png" alt-text="A screenshot show the data collection endpoints page for an Azure Monitor workspace." lightbox="media/private-link-data-ingestion/azure-monitor-workspace-data-collection-endpoints.png" :::

The page displays all of the DCEs that are associated with the Azure Monitor workspace and that enable data ingestion into the workspace. Select the DCE you want to configure with Private Link and then follow the steps to [create an Azure Monitor private link scope](../logs/private-link-configure.md) to complete the process.

Once this is done, navigate to the DCR resource which was created during managed prometheus enablement from the Azure portal and choose 'Resources' under Configuration menu.
In the Data collection endpoint dropdown, pick a DCE in the same region as the AKS cluster. If the Azure Monitor Workspace is in the same region as the AKS cluster, you can reuse the DCE created during managed prometheus enablement. If not, create a DCE in the same region as the AKS cluster and pick that in the dropdown. 

> [!NOTE]
> Please refer to [Connect to a data source privately](../../../articles/managed-grafana/how-to-connect-to-data-source-privately.md) for details on how to configure private link for querying data from your Azure Monitor workspace using Grafana.
>
> Please refer to [use private endpoints for queries](azure-monitor-workspace-private-endpoint.md) for details on how to configure private link for querying data from your Azure Monitor workspace using workbooks (non-grafana).

## Private link ingestion from a private AKS cluster

A private Azure Kubernetes Service cluster can by default, send data to Managed Prometheus and your Azure Monitor workspace over the public network, and to the public Data Collection Endpoint.

If you choose to use an Azure Firewall to limit the egress from your cluster, you can implement one of the following:

+ Open a path to the public ingestion endpoint. Update the routing table with the following two endpoints:
  - *.handler.control.monitor.azure.com
  - *.ingest.monitor.azure.com
+ Enable the Azure Firewall to access the Azure Monitor Private Link scope and Data Collection Endpoint that's used for data ingestion

## Private link ingestion for remote write

The following steps show how to set up remote write for a Kubernetes cluster over a private link VNET and an Azure Monitor Private Link scope.

The following are the steps for setting up remote write for a Kubernetes cluster over a private link VNET and an Azure Monitor Private Link scope. 

We start with your on-premises Kubernetes cluster.

1. Create your Azure virtual network.
1. Configure the on-premises cluster to connect to an Azure VNET using a VPN gateway or ExpressRoutes with private-peering.
1. Create an Azure Monitor Private Link scope.
1. Connect the Azure Monitor Private Link scope to a private endpoint in the virtual network used by the on-premises cluster. This private endpoint is used to access your Data Collection Endpoint(s).
1. Navigate to your Azure Monitor workspace in the portal. As part of creating your Azure Monitor workspace a system Data Collection Endpoint is created that you can use to ingest data via remote write.
1. Choose **Data Collection Endpoints** from the Azure Monitor workspace menu. 
1. By default, the system Data Collection Endpoint has the same name as your Azure Monitor workspace. Select this Data Collection Endpoint.
1. The Data Collection Endpoint, Network Isolation page displays. From this page, select **Add** and choose the Azure Monitor Private Link scope you created. It takes a few minutes for the settings to propagate. Once completed, data from your private AKS cluster is ingested into your Azure Monitor workspace over the private link.


## Verify that data is being ingested

To verify data is being ingested, try one of the following methods:

- Open the Workbooks page from your Azure Monitor workspace and select the **Prometheus Explorer** tile.  For more information on Azure Monitor workspace  Workbooks, see [Workbooks overview](./prometheus-workbooks.md).

 -  Use a linked Grafana Instance. For more information on linking a Grafana instance to your workspace, see [Link a Grafana workspace](./azure-monitor-workspace-manage.md?tabs=azure-portal.md#link-a-grafana-workspace) with your Azure Monitor workspace.
 
## Next steps

- [Managed Grafana network settings](https://aka.ms/ags/mpe)
- [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md)
- [Verify remote write is working correctly](./prometheus-remote-write.md#verify-remote-write-is-working-correctly)
