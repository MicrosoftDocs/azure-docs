---
title: How to connect to a data source privately in Azure Managed Grafana
description: Learn how to connect an Azure Managed Grafana instance to a data source using Managed Private Endpoint
ms.service: managed-grafana
ms.topic: how-to
author: mcleanbyron
ms.author: mcleans
ms.date: 5/18/2023
--- 

# Connect to a data source privately (preview)

In this guide, you'll learn how to connect your Azure Managed Grafana instance to a data source using Managed Private Endpoint. Azure Managed Grafana’s managed private endpoints are endpoints created in a Managed Virtual Network that the Managed Grafana service uses. They establish private links from that network to your Azure data sources. Azure Managed Grafana sets up and manages these private endpoints on your behalf. You can create managed private endpoints from your Azure Managed Grafana to access other Azure managed services (e.g., Azure Monitor private link scope or Azure Monitor workspace) and, through the Azure Private Link service, resources inside of your virtual network.

When you use managed private endpoints, traffic between your Azure Managed Grafana and its data sources traverse exclusivelyover the Microsoft backbone network without going through the internet. Managed private endpoints protect against data exfiltration. A managed private endpoint uses a private IP address from your Managed Virtual Network to effectively bring your Azure Managed Grafana workspace into that network. Each managed private endpoint is mapped to a specific resource in Azure and not the entire service. Customers can limit connectivity to only resources approved by their organizations.

A private endpoint connection is created in a "Pending" state when you create a managed private endpoint in Azure Managed Grafana. An approval workflow is started. The private link resource owner is responsible for approving or rejecting the new connection. If the owner approves the connection, the private link is established. But, if the owner doesn't approve the connection, then the private link won't be set up. In either case, the managed private endpoint will be updated with the status of the connection. Only a managed private endpoint in an approved state can be used to send traffic to the private link resource that is connected to the managed private endpoint.

Note that, while managed private endpoints are free, there may be charges associated with private link usage on a data source. Refer to your data source’s pricing details for more information.

> [!IMPORTANT]
> Managed Private Endpoint is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported data sources

Managed private endpoints work with Azure services that support private link. Using them, you can connect your Managed Grafana workspace to the following Azure data stores over private connectivity:

1.	Azure Monitor private link scope (e.g. Log Analytics workspace)
2.	Azure Monitor workspace, for Managed Service for Prometheus
3.	Azure Data Explorer
4.	Azure Cosmos DB for Mongo DB
5.	Azure SQL server

You also can use manage private endpoints with resources inside of your own virtual network via Azure Private Link service (PLS). For example, if you have a self-hosted InfluxDB in an AKS cluster that you want to use as a Grafana data source, you can add a private link to expose the database on an internal IP address and a managed private endpoint in Grafana to connect to it. With the Private Link service and managed private links, your Grafana workspace can access many private data sources.

## Prerequisites

To follow the steps in this guide, you must have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create a new instance](quickstart-managed-grafana-portal.md).

## Create a managed private endpoint for Azure Monitor workspace

You can create a managed private endpoint for your Managed Grafana workspace to connect to an Azure Monitor workspace, for example, using Managed Service for Prometheus.

1. In the Azure portal, navigate to your Grafana workspace and then select **Networking (Preview)**.
2. Select **Managed private endpoint**, and then select **Create**.
3. In the *New managed private endpoint* pane, fill out required information for resource to connect to.
4. Select **Create** to add the managed private endpoint resource.
5. Contact the owner of target Azure Monitor workspace to approve the connection request.

> [!NOTE]
> After the new private endpoint connection is approved, all network traffic between your Managed Grafana workspace and the selected data source will flow only through the Azure backbone network.

## Create a managed private endpoint to Azure Private Link service

If you have an Azure resource internal to your virtual network, such as a self-hosted data store, you can connect your Managed Grafana workspace to it using a managed private endpoint. You’ll first add a private link access to that resource using the Azure Private Link service. The exact steps required to set up a private link is dependent on the type of resource. For example, if your data store is running on Azure Kubernetes Service (AKS), this documentation can help you configure a private link. After that, you can create a managed private endpoint for your Grafana workspace to connect to the new private link.

1. In the Azure portal, navigate to your Grafana resource and then select **Networking (Preview)**.
2. Select **Managed private endpoint**, and then select **Create**.
3. In the *New managed private endpoint* pane, fill out the resource details with the following information. The *Private link service url* field is optional. If you specify an URL, the Azure Managed Grafana service will ensure that the host IP address from the DNS resolution of that URL matches the private IP address of the private endpoint. Due to security reasons, AMG have an allowed list of the URL. An URL is required if you need TLS. If you don’t provide this URL, you will see a private IP address after the private endpoint connection is approved. In either case, you will subsequently use the information from this field in your data source configuration.
4. Select **Create** to add the managed private endpoint resource.
5. Contact the owner of target private link resource to approve the connection request.
6. After the associated private endpoint connection is approved, please click the **Refresh** button. This will inform Azure Managed Grafana to check and update the connection status. Then the connection status will be updated to Approved and the private IP will show up.

> [!NOTE]
> After the new private endpoint connection is approved, all network traffic between your Managed Grafana workspace and the selected data source will flow only through the Azure backbone network.

## Next steps

In this how-to guide, you learned how to configure private access between a Managed Grafana workspace and a data source. To learn how to set up private access from your users to a Managed Grafana workspace, see [Set up private access](how-to-set-up-private-access.md).
