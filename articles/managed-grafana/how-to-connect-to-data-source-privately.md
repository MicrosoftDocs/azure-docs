---
title: How to connect to a data source privately in Azure Managed Grafana
description: Learn how to connect an Azure Managed Grafana instance to a data source using Managed Private Endpoint
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 10/06/2023
--- 

# Connect to a data source privately (preview)

In this guide, you learn how to connect your Azure Managed Grafana instance to a data source using Managed Private Endpoint. Azure Managed Grafana’s managed private endpoints are endpoints created in a Managed Virtual Network that the Managed Grafana service uses. They establish private links from that network to your Azure data sources. Azure Managed Grafana sets up and manages these private endpoints on your behalf. You can create managed private endpoints from your Azure Managed Grafana to access other Azure managed services (for example, Azure Monitor private link scope or Azure Monitor workspace).

When you use managed private endpoints, traffic between your Azure Managed Grafana and its data sources traverses exclusively over the Microsoft backbone network without going through the internet. Managed private endpoints protect against data exfiltration. A managed private endpoint uses a private IP address from your Managed Virtual Network to effectively bring your Azure Managed Grafana workspace into that network. Each managed private endpoint is mapped to a specific resource in Azure and not the entire service. Customers can limit connectivity to only resources approved by their organizations.

A private endpoint connection is created in a "Pending" state when you create a managed private endpoint in your Managed Grafana workspace. An approval workflow is started. The private link resource owner is responsible for approving or rejecting the new connection. If the owner approves the connection, the private link is established. Otherwise, the private link won't be set up. Managed Grafana shows the current connection status. Only a managed private endpoint in an approved state can be used to send traffic to the private link resource that is connected to the managed private endpoint.

While managed private endpoints are free, there may be charges associated with private link usage on a data source. For more information, see your data source’s pricing details.

> [!IMPORTANT]
> Managed Private Endpoint is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported Azure data sources

Managed private endpoints work with Azure services that support private link. Using them, you can connect your Managed Grafana workspace to the following Azure data stores over private connectivity:

1.	Azure Monitor private link scope (for example, Log Analytics workspace)
1.	Azure Monitor workspace, for Managed Service for Prometheus
1.	Azure Data Explorer
1.	Azure Cosmos DB for Mongo DB
1.	Azure SQL server

## Prerequisites

To follow the steps in this guide, you must have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance in the Standard tier. If you don't have one yet, [create a new instance](quickstart-managed-grafana-portal.md).

## Create a managed private endpoint for Azure Monitor workspace

You can create a managed private endpoint in your Managed Grafana workspace to connect to a [supported Azure data source](#supported-azure-data-sources) using a private link.

1. In the Azure portal, navigate to your Grafana workspace and then select **Networking (Preview)**.
1. Select **Managed private endpoint**, and then select **Create**.

   :::image type="content" source="media/managed-private-endpoint/create-mpe.png" alt-text="Screenshot of the Azure portal create managed private endpoint." lightbox="media/managed-private-endpoint/create-mpe.png":::

1. In the *New managed private endpoint* pane, fill out required information for resource to connect to.

   :::image type="content" source="media/managed-private-endpoint/new-mpe-details.png" alt-text="Screenshot of the Azure portal new managed private endpoint details." lightbox="media/managed-private-endpoint/new-mpe-details.png":::

1. Select an Azure *Resource type* (for example, **Microsoft.Monitor/accounts** for Azure Monitor Managed Service for Prometheus).
1. Click **Create** to add the managed private endpoint resource.
1. Contact the owner of target Azure Monitor workspace to approve the connection request.

> [!NOTE]
> After the new private endpoint connection is approved, all network traffic between your Managed Grafana workspace and the selected data source will flow only through the Azure backbone network.

## Create a managed private endpoint to Azure Private Link service

If you have a data source internal to your virtual network, such as an InfluxDB server hosted on an Azure virtual machine, you can connect your Managed Grafana workspace to it. You first need to add a private link access to that resource using the Azure Private Link service. The exact steps required to set up a private link is dependent on the type of Azure resource. Refer to the documentation of the hosting service you have. For example, [this article](../aks/private-clusters.md#use-a-private-endpoint-connection) describes to configure a private link to an Azure Kubernetes Service cluster.

Once you've set up the private link service, you can create a managed private endpoint in your Grafana workspace that connects to the new private link.

1. In the Azure portal, navigate to your Grafana resource and then select **Networking (Preview)**.
1. Select **Managed private endpoint**, and then select **Create**.

   :::image type="content" source="media/managed-private-endpoint/create-mpe.png" alt-text="Screenshot of the Azure portal create managed private endpoint." lightbox="media/managed-private-endpoint/create-mpe.png":::

1. In the *New managed private endpoint* pane, fill out required information for resource to connect to.

   > [!TIP]
   > The *Private link service url* field is optional unless you need TLS. If you specify a URL, Managed Grafana will ensure that the host IP address for that URL matches the private endpoint's IP address. Due to security reasons, AMG have an allowed list of the URL.

1. Click **Create** to add the managed private endpoint resource.
1. Contact the owner of target Azure Monitor workspace to approve the connection request.
1. After the connection request is approved, click **Refresh** to see the connection status and private IP address.

> [!NOTE]
> After the new private endpoint connection is approved, all network traffic between your Managed Grafana workspace and the selected data source will flow only through the Azure backbone network.

## Next steps

In this how-to guide, you learned how to configure private access between a Managed Grafana workspace and a data source. To learn how to set up private access from your users to a Managed Grafana workspace, see [Set up private access](how-to-set-up-private-access.md).
