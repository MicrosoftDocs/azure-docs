---
title: Connect Stream Analytics jobs to resources in an Azure Virtual Network (VNET)
description: This article describes how to connect an Azure Stream Analytics job with resources that are in a VNET.
author: ahartoon
ms.author: anboisve
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 08/08/2023
ms.custom:
---
# Connect Stream Analytics jobs to resources in an Azure Virtual Network (VNET)

Your Stream Analytics jobs make outbound connections to your input and output Azure resources to process data in real time and produce results. These input and output resources (for example, Azure Event Hubs and Azure SQL Database) could be behind an Azure firewall or in an Azure Virtual Network (VNET). Stream Analytics service operates from networks that can't be directly included in your network rules.

However, there are several ways to securely connect your Stream Analytics jobs to your input and output resources in such scenarios.
* [Run your Azure Stream Analytics job in an Azure Virtual Network (Public preview)](../stream-analytics/run-job-in-virtual-network.md)  
* Use private endpoints in Stream Analytics clusters.
* Use Managed Identity authentication mode coupled with 'Allow trusted services' networking setting.

Your Stream Analytics job does not accept any inbound connection.

## Run your Azure Stream Analytics job in an Azure Virtual Network (Public preview)
Virtual network (VNET) support enables you to lock down access to Azure Stream Analytics to your virtual network infrastructure. This capability provides you with the benefits of network isolation and can be accomplished by [deploying a containerized instance of your ASA job inside your Virtual Network](../virtual-network/virtual-network-for-azure-services.md). Your VNET injected ASA job can then privately access your resources within the virtual network via: 

- [Private endpoints](../private-link/private-endpoint-overview.md), which connect your VNet injected ASA job to your data sources over private links powered by Azure Private Link.   
- [Service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md), which connect your data sources to your VNet injected ASA job. 
- [Service tags](../virtual-network/service-tags-overview.md), which allow or deny traffic to Azure Stream Analytics. 

Currently, VNET integration is only available in **select regions**.  Visit [this](../stream-analytics/run-job-in-virtual-network.md) page for most recent list of VNET enabled regions and how to request it in your region.

## Private endpoints in Stream Analytics clusters.
[Stream Analytics clusters](./cluster-overview.md) is a single tenant dedicated compute cluster where you can run your Stream Analytics jobs. You can create managed private endpoints in your Stream Analytics cluster, which allows any jobs running on your cluster to make a secure outbound connection to your input and output resources.

The creation of private endpoints in your Stream Analytics cluster is a [two step operation](./private-endpoints.md). This option is best suited for medium to large streaming workloads as the minimum size of a Stream Analytics cluster is 12 SU V2 or 36 SU V1s (SUs can be shared by different jobs in various subscriptions or environments like development, test, and production).  See [Azure Stream Analytics cluster](../stream-analytics/cluster-overview.md) for more information.

## Managed identity authentication with 'Allow trusted services' configuration
Some Azure services provide **Allow trusted Microsoft services** networking setting, which when enabled, allows your Stream Analytics jobs to securely connect to your resource using strong authentication. This option allows you to connect your jobs to your input and output resources without requiring a Stream Analytics cluster and private endpoints. Configuring your job to use this technique is a 2-step operation:
* Use Managed Identity authentication mode when configuring input or output in your Stream Analytics job.
* Grant your specific Stream Analytics jobs explicit access to your target resources by assigning an Azure role to the job's system-assigned managed identity. 

Enabling **Allow trusted Microsoft services** does not grant blanket access to any job. This gives you full control of which specific Stream Analytics jobs can access your resources securely. 

Your jobs can connect to the following Azure services using this technique:
1. [Blob Storage or Azure Data Lake Storage Gen2](./blob-output-managed-identity.md) - can be your job's storage account, streaming input or output.
2. [Azure Event Hubs](./event-hubs-managed-identity.md) - can be your job's streaming input or output.

If your jobs need to connect to other input or output types, you could write from Stream Analytics to Event Hubs output first and then to any destination of your choice using Azure Functions. If you want to directly write from Stream Analytics to other output types secured in a VNet or firewall, then the only option is to use private endpoints in Stream Analytics clusters.

## Next steps

* [Create and remove Private Endpoints in Stream Analytics clusters](./private-endpoints.md)
* [Connect to Event Hubs in a VNet using Managed Identity authentication](./event-hubs-managed-identity.md)
* [Connect to Blob storage and ADLS Gen2 in a VNet using Managed Identity authentication](./blob-output-managed-identity.md)
