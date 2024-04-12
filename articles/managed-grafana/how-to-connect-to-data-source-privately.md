---
title: How to connect to a data source privately in Azure Managed Grafana
description: Learn how to connect an Azure Managed Grafana instance to a data source using Managed Private Endpoint
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 02/05/2024
--- 

# Connect to a data source privately

In this guide, you learn how to connect your Azure Managed Grafana instance to a data source using Managed Private Endpoint. Azure Managed Grafana’s managed private endpoints are endpoints created in a Managed Virtual Network that the Azure Managed Grafana service uses. They establish private links from that network to your Azure data sources. Azure Managed Grafana sets up and manages these private endpoints on your behalf. You can create managed private endpoints from your Azure Managed Grafana to access other Azure managed services (for example, Azure Monitor private link scope or Azure Monitor workspace) and your own self-hosted data sources (for example, connecting to your self-hosted Prometheus behind a private link service).

When you use managed private endpoints, traffic between your Azure Managed Grafana and its data sources traverses exclusively over the Microsoft backbone network without going through the internet. Managed private endpoints protect against data exfiltration. A managed private endpoint uses a private IP address from your Managed Virtual Network to effectively bring your Azure Managed Grafana workspace into that network. Each managed private endpoint is mapped to a specific resource in Azure and not the entire service. Customers can limit connectivity to only resources approved by their organizations.

A private endpoint connection is created in a "Pending" state when you create a managed private endpoint in your Azure Managed Grafana workspace. An approval workflow is started. The private link resource owner is responsible for approving or rejecting the new connection. If the owner approves the connection, the private link is established. Otherwise, the private link isn't set up. Azure Managed Grafana shows the current connection status. Only a managed private endpoint in an approved state can be used to send traffic to the private link resource that is connected to the managed private endpoint.

While managed private endpoints are free, there may be charges associated with private link usage on a data source. For more information, see your data source’s pricing details.

> [!NOTE]
> Managed private endpoints are currently only available in Azure Global.

## Supported data sources

Managed private endpoints work with Azure services that support private link. Using them, you can connect your Azure Managed Grafana workspace to the following Azure data stores over private connectivity:

- Azure Cosmos DB for Mongo DB
- Azure Cosmos DB for PostgreSQL
- Azure Data Explorer
- Azure Monitor private link scope (for example, Log Analytics workspace)
- Azure Monitor workspace, for Managed Service for Prometheus
- Azure SQL managed instance
- Azure SQL server
- Private link services

## Prerequisites

To follow the steps in this guide, you must have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance in the Standard tier. If you don't have one yet, [create a new instance](quickstart-managed-grafana-portal.md).

## Create a managed private endpoint for Azure Monitor workspace

You can create a managed private endpoint in your Azure Managed Grafana workspace to connect to a [supported data source](#supported-data-sources) using a private link.

1. In the Azure portal, navigate to your Grafana workspace and then select **Networking**.
1. Select **Managed Private Endpoint**, and then select **Create**.

   :::image type="content" source="media/managed-private-endpoint/create.png" alt-text="Screenshot of the Azure portal create managed private endpoint." lightbox="media/managed-private-endpoint/create.png":::

1. In the *New managed private endpoint* pane, fill out required information for resource to connect to.

   :::image type="content" source="media/managed-private-endpoint/new-details-azure-monitor.png" alt-text="Screenshot of the Azure portal new managed private endpoint details for Azure Monitor workspace.":::

1. Select an Azure *Resource type* (for example, **Microsoft.Monitor/accounts** for Azure Monitor Managed Service for Prometheus).
1. Select **Create** to add the managed private endpoint resource.
1. Contact the owner of target Azure Monitor workspace to approve the connection request.

> [!NOTE]
> After the new private endpoint connection is approved, all network traffic between your Azure Managed Grafana workspace and the selected data source will flow only through the Azure backbone network.

## Create a managed private endpoint to Azure Private Link service

If you have a data source internal to your virtual network, such as an InfluxDB server hosted on an Azure virtual machine, or a Loki server hosted inside your AKS cluster, you can connect your Azure Managed Grafana to it. You first need to add a private link access to that resource using the Azure Private Link service. The exact steps required to set up a private link is dependent on the type of Azure resource. Refer to the documentation of the hosting service you have. For example, [this article](https://cloud-provider-azure.sigs.k8s.io/topics/pls-integration/) describes how to create a private link service in Azure Kubernetes Service by specifying a kubernetes service object.

Once you've set up the private link service, you can create a managed private endpoint in your Grafana workspace that connects to the new private link.

1. In the Azure portal, navigate to your Grafana resource and then select **Networking**.
1. Select **Managed Private Endpoint**, and then select **Create**.

   :::image type="content" source="media/managed-private-endpoint/create.png" alt-text="Screenshot of the Azure portal create managed private endpoint." lightbox="media/managed-private-endpoint/create.png":::

1. In the *New managed private endpoint* pane, fill out required information for resource to connect to.

   :::image type="content" source="media/managed-private-endpoint/new-details-private-link.png" alt-text="Screenshot of the Azure portal new managed private endpoint details for Private link services.":::

   > [!TIP]
   > The *Domain name* field is optional. If you specify a domain name, Azure Managed Grafana will ensure that this domain name will be resolved to the managed private endpoint's private IP inside this Grafana's service managed network. You can use this domain name in your Grafana data source's URL configuration instead of the private IP address. You will be required to use the domain name if you enabled TLS or Server Name Indication (SNI) for your self-hosted data store.

1. Select **Create** to add the managed private endpoint resource.
1. Contact the owner of target private link service to approve the connection request.
1. After the connection request is approved, select **Refresh** to ensure the connection status is **Approved** and private IP address is shown.

> [!NOTE]
> The **Refresh** step cannot be skipped, since refreshing triggers a network sync operation by Azure Managed Grafana. Once the new managed private endpoint connection is shown approved, all network traffic between your Azure Managed Grafana workspace and the selected data source will only flow through the Azure backbone network.

## Next steps

In this how-to guide, you learned how to configure private access between an Azure Managed Grafana workspace and a data source. To learn how to set up private access from your users to an Azure Managed Grafana workspace, see [Set up private access](how-to-set-up-private-access.md).
