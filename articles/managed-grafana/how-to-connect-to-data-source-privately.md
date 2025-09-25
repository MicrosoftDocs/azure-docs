---
title: How to connect to a data source privately in Azure Managed Grafana
description: Learn how to connect an Azure Managed Grafana workspace to a data source using Managed Private Endpoint.
ms.service: azure-managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 08/19/2025
ms.custom: sfi-image-nochange
#customer intent: As a Grafana user, I want to connect an Azure Managed Grafana workspace a data source using Managed Private Endpoint, so that the traffic stays on the Azure network instead of the internet.
--- 

# Connect to a data source privately

In this guide, you learn how to connect your Azure Managed Grafana workspace to a data source using Managed Private Endpoint. Managed private endpoints for Azure Managed Grafana are endpoints created in a Managed Virtual Network that the Azure Managed Grafana service uses. They establish private links from that network to your Azure data sources. Azure Managed Grafana sets up and manages these private endpoints on your behalf.

You can create managed private endpoints from your Azure Managed Grafana to access:

- Other Azure managed services, for example, Azure Monitor private link scope or Azure Monitor workspace
- Your own self-hosted data sources, for example, connecting to your self-hosted Prometheus behind a private link service

When you use managed private endpoints, traffic between your Azure Managed Grafana and its data sources travels only over the Microsoft backbone network instead of the internet. A managed private endpoint uses a private IP address from your Managed Virtual Network to effectively bring your Azure Managed Grafana workspace into that network. Managed private endpoints protect against data exfiltration. Each managed private endpoint is mapped to a specific resource in Azure and not the entire service. You can limit connectivity to only resources approved by your organization.

## Prerequisites

To follow the procedures in this guide, you must have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana workspace in the Standard tier. If you don't have one yet, [create a new instance](quickstart-managed-grafana-portal.md).

## Supported data sources

Managed private endpoints work with Azure services that support private link. Using them, you can connect your Azure Managed Grafana workspace to the following Azure data stores over private connectivity:

- Azure Cosmos DB for Mongo DB ([RU](/azure/cosmos-db/mongodb/introduction#request-unit-ru-architecture) and [vCore](/azure/cosmos-db/mongodb/introduction#vcore-architecture-recommended) architectures)
- Azure Cosmos DB for PostgreSQL
- Azure Data Explorer
- Azure Monitor private link scope (for example, Log Analytics workspace)
- Azure Monitor workspace, for Managed Service for Prometheus
- Azure SQL managed Instance
- Azure SQL server
- Azure Databricks
- Private link services

When you create a managed private endpoint in your Azure Managed Grafana workspace, a private endpoint connection is created in a *Pending* state. This action begins an approval workflow. The private link resource owner is responsible for approving or rejecting the new connection. If the owner approves the connection, the private link is established. Otherwise, the private link isn't set up.

Azure Managed Grafana shows the current connection status. Only a managed private endpoint in an *approved* state can be used to send traffic to the private link resource that is connected to the managed private endpoint.

Managed private endpoints are free. There can be charges associated with private link usage on a data source. For more information, see pricing details for your data source.

> [!NOTE]
> If you run a private data source in an Azure Kubernetes Service (AKS) cluster, if the service `externalTrafficPolicy` is set to local, Azure Private Link Service needs to use a different subnet than the Pod’s subnet. If the same subnet is required, the service should use Cluster `externalTrafficPolicy`. See [Cloud Provider Azure](https://cloud-provider-azure.sigs.k8s.io/topics/pls-integration/#restrictions).

## Create a managed private endpoint for Azure Monitor workspace

You can create a managed private endpoint in your Azure Managed Grafana workspace to connect to a [supported data source](#supported-data-sources) using a private link.

1. In the Azure portal, navigate to your Grafana workspace and then select **Settings** > **Networking**.
1. Select **Managed Private Endpoint**, and then select **Add**.

   :::image type="content" source="media/managed-private-endpoint/create.png" alt-text="Screenshot of the Azure portal add managed private endpoint." lightbox="media/managed-private-endpoint/create.png":::

1. In the **New managed private endpoint** pane, fill out required information for resource to connect to.

   :::image type="content" source="media/managed-private-endpoint/new-details-azure-monitor.png" alt-text="Screenshot of the Azure portal new managed private endpoint details for Azure Monitor workspace." lightbox="media/managed-private-endpoint/new-details-azure-monitor.png":::

1. Select an Azure **Resource type**, for example, **Microsoft.Monitor/accounts** for Azure Monitor Managed Service for Prometheus.
1. Select **Create** to add the managed private endpoint resource.
1. Contact the owner of target Azure Monitor workspace to approve the connection request.

> [!NOTE]
> After the new private endpoint connection is approved, all network traffic between your Azure Managed Grafana workspace and the selected data source flows only through the Azure backbone network.

## Create a managed private endpoint to Azure Private Link service

If you have a data source internal to your virtual network, you can connect your Azure Managed Grafana to it. Examples include an InfluxDB server hosted on an Azure virtual machine and a Loki server hosted inside your AKS cluster.

You first need to add a private link access to that resource using the Azure Private Link service. The exact steps to set up a private link depend on the type of Azure resource. Refer to the documentation of the hosting service. For example, [Azure Private Link Service Integration](https://cloud-provider-azure.sigs.k8s.io/topics/pls-integration/) describes how to create a private link service in Azure Kubernetes Service by specifying a kubernetes service object.

After you set up the private link service, you can create a managed private endpoint in your Grafana workspace that connects to the new private link.

1. In the Azure portal, navigate to your Grafana resource and then select **Settings** > **Networking**.
1. Select **Managed Private Endpoint**, and then select **Add**.

   :::image type="content" source="media/managed-private-endpoint/create.png" alt-text="Screenshot of the Azure portal add managed private endpoint." lightbox="media/managed-private-endpoint/create.png":::

1. In the **New managed private endpoint** pane, fill out required information for resource to connect to.

   :::image type="content" source="media/managed-private-endpoint/new-details-private-link.png" alt-text="Screenshot of the Azure portal new managed private endpoint details for Private link services." lightbox="media/managed-private-endpoint/new-details-private-link.png":::

   > [!TIP]
   > The *Domain name* field is optional. If you specify a domain name, Azure Managed Grafana ensures that this domain name resolves to the managed private endpoint's private IP inside this Grafana's service managed network. You can use this domain name in your Grafana data source's URL configuration instead of the private IP address. You must use the domain name if you enabled TLS or Server Name Indication (SNI) for your self-hosted data store.

1. Select **Create** to add the managed private endpoint resource.
1. Contact the owner of target private link service to approve the connection request.
1. After the connection request is approved, select **Refresh** to ensure the connection status is **Approved** and private IP address is shown.

> [!NOTE]
> You can't skip the **Refresh** step. Refreshing triggers a network sync operation by Azure Managed Grafana. After the new managed private endpoint connection is shown approved, all network traffic between your Azure Managed Grafana workspace and the selected data source flows only through the Azure backbone network.

## Next step

In this how-to guide, you learned how to configure private access between an Azure Managed Grafana workspace and a data source.

To learn how to set up private access from your users to an Azure Managed Grafana workspace, see:

> [!div class="nextstepaction"]
> [Set up private access](how-to-set-up-private-access.md)
