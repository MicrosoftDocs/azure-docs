---
title: Azure Purview network architecture and best practices
description: This article provides examples of Azure Purview network architecture options and describes best practices.
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 09/29/2021
---

# Azure Purview network architecture and best practices

Azure Purview is a platform as a service (PaaS) solution for data governance. Azure Purview accounts have public endpoints that are accessible through the internet to connect to Azure Purview. However, all endpoints are secured using Azure Active Directory (Azure AD) logins and RBAC with fine-grained access control.

For an added layer of security, you can create private endpoints for your Azure Purview account, which assigns a private IP address from your virtual network in Azure to the Azure Purview account and its managed resources. This will restrict all traffic between your virtual network and the Azure Purview account to a private link in cases where users are interacting with the APIs, Azure Purview Studio, or for scanning and ingestion. 

Currently, Azure Purview firewall provides access control for the public endpoint of your purview account. You can use the firewall to allow all or to block all access through the public endpoint when using private endpoints. 

Based on your network and security requirements, you can set up and maintain Azure Purview accounts to access Azure Purview underlying services or ingestion. You can base the accounts on any of the following network options: 

- Use [Azure public endpoints](#option-1---use-public-endpoints). 
- Use [private endpoints](#option-2---use-private-endpoints). 
- Use [private endpoints and allow public access on the same Azure Purview account](#option-3---use-both-private-endpoint-and-public-endpoints). 

To understand what option is the most suitable for your environment, we suggest you perform the following actions first: 

- Review your network topology and security requirements before registering and scanning any data sources in Azure Purview. For more information, see [define an Azure network topology](/cloud-adoption-framework/ready/azure-best-practices/define-an-azure-network-topology). 

- Define your [network connectivity model for PaaS services](/cloud-adoption-framework/ready/azure-best-practices/connectivity-to-azure-paas-services). 

Use this best practices guide to define and prepare your network environment for Azure Purview so you can access Azure Purview and scan data sources from various locations in your network or cloud, based on network, connectivity and security requirements.

We have documented few most common network architecture scenarios for Azure Purview in this guide, however, the options are not limited to this document. Review Azure Purview limitations when planning networking for your Azure Purview accounts. 

The intended audience for this guide includes:

- Data architecture team 
- Network team  
- Data security team 

## Option 1: Use public endpoints 

By default, You can use Azure Purview accounts through public endpoints accessible through the internet. Allow public network in your Azure Purview account, if you have the following requirements: 

- No private connectivity is required when scanning or connecting to Azure Purview endpoints. 
- All Data sources are SaaS applications only. 
- All data sources have a public endpoint, accessible through the internet. 
- Business users require access to Azure Purview account and Azure Purview Studio through the internet. 

### Integration runtime options 

To scan data sources while Azure Purview account firewall is set to Allow Public Access, you can use both Azure integration runtime and [self-hosted integration runtime](./manage-integration-runtimes.md), according to your [data sources supportability](manage-data-sources.md).  

- You may use Azure integration runtime or a self-hosted integration runtime to scan Azure data sources such as Azure SQL Database or Azure Blob Storage.  

- We recommend that you use Azure integration runtime to scan Azure data sources when possible, to reduce cost and administrative overhead. 
  
- To scan multiple Azure data sources, use public network and the Azure integration runtime. The following steps show the communication flow at very high level, when using Azure integration runtime to scan a data source in Azure:

  :::image type="content" source="media/concept-best-practices/network-azure-runtime.png" alt-text="Screenshot that shows the connection flow between Azure Purview, runtime and data sources."lightbox="media/concept-best-practices/network-azure-runtime.png":::

  1. A manual or an automatic scan is initiated from the Azure Purview data map using Azure integration runtime. 
   
  2. Azure integration runtime connects to the data source to extract metadata.

  3. Metadata is queued in Azure Purview's managed storage and stored in Azure blob storage. 

  4. Metadata is sent to Azure Purview data map. 

- Scanning an on-premises and a VM-based data sources always requires using a self-hosted integration runtime. Azure integration runtime is not supported for these data sources. The following steps show the communication flow at very high level, when using a self-hosted integration runtime to scan a data source:

  :::image type="content" source="media/concept-best-practices/network-self-hosted-runtime.png" alt-text="Screenshot that shows the connection flow between Azure Purview, self-hosted runtime, and data sources."lightbox="media/concept-best-practices/network-self-hosted-runtime.png":::

  1. A manual or an automatic scan is triggered. Azure purview connects to Azure Key Vault to retrieve the credential to access a data source.
   
  2. Scan is initiated from the Azure Purview data map using a self-hosted integration runtime. 
   
  3. The self-hosted integration runtime service from the virtual machine connects to the data source to extract metadata.

  4. Metadata is processed in self-hosted integration runtime VM memory. Metadata is queued in Azure Purview's managed storage and then stored in Azure blob storage. 

  5. Metadata is sent to Azure Purview data map. 

### Authentication options  

When scanning a data source in Azure Purview, you need to provide a credential, so Azure Purview can read metadata of the assets using the Azure integration runtime in the destination data source. Using public network, authentication options and requirements vary based on the following factors: 

- **Data source type**. For example, if the data source is an Azure SQL Database, you need to use a SQL authentication with db_datareader access to each database. This can be a user or Azure Purview managed identity or a Service Principal in your Azure Active Directory added to the Azure SQL Database as db_datareader. If the data source is an Azure Blob Storage, you can use Azure Purview managed identity or a Service Principal in your Azure Active Directory added as Storage Blob Data Reader role on the Azure Storage Account or simply use Storage Account's key.  

- **Authentication type**. We recommend that you use an Azure Purview managed identity to scan Azure data sources when possible, to reduce administrative overhead. For any other authentication types, you need to [setup credentials for source authentication inside Azure Purview](manage-credentials.md): 

  - Generate a secret inside an Azure key vault. 
  - Register the key vault inside Azure Purview.  
  - Inside Azure Purview, create a new credential by using the secret saved in the Azure key vault. 

- **Runtime type that's used in the scan**. Currently, you can't use an Azure Purview managed identity with self-hosted integration runtime. 

### Additional considerations  

- If you choose to scan data sources using public endpoints, your on-premises or VM-based data sources must have an outbound connectivity to Azure endpoints. 

- Your self-hosted integration runtime VMs must have [outbound connectivity to Azure endpoints](manage-integration-runtimes.md#networking-requirements). 

- Your Azure data sources must allow public access, however, if service endpoint is enabled on the data source, make sure you _allow Azure services on the trusted services list_ to access your Azure data sources. The service endpoint routes traffic from the virtual network through an optimal path to the Azure. 

## Option 2: Use private endpoints 

You can use [Azure private endpoints](../private-link/private-endpoint-overview.md) for your Azure Purview accounts, if you need to scan Azure IaaS and PaaS data sources inside Azure virtual networks and on-premises data sources through a private connection or to allow users on a virtual network to securely access Azure Purview over a [Private Link](../private-link/private-link-overview.md). 

Similar to other PaaS solutions, Azure Purview does not support deploying directly into a virtual network, because of this you cannot leverage certain networking features with the offering's resources such as network security groups, route tables, or other network-dependent appliances such as Azure Firewall. Instead, you can use private endpoints that can be enabled on your virtual network and you can disable public internet access to securely connect to Azure Purview. 

You must use private endpoints for your Azure Purview account, if you need to fulfill any of the following requirements: 

- You need to have an end-to-end network isolation for Azure Purview accounts and data sources. 

- You need to [block public access](./catalog-private-link-end-to-end.md#firewalls-to-restrict-public-access) to your Azure Purview accounts. 

- Your PaaS data sources are deployed with private endpoints and you have blocked all access through the public endpoint. 

- Your on-premises or IaaS data sources cannot reach public endpoints. 

### Design considerations  

- To connect to your Azure Purview account privately and securely, you need to deploy an account and a portal private endpoint. (For example, if you intent to connect to Azure Purview through the API or launch Azure Purview Studio). 

- If you need to connect to Azure Purview Studio using private endpoints, you have to deploy both account and portal private endpoints. 

- To scan data sources through private connectivity, you need to configure at least one account and one ingestion private endpoint for Azure Purview. Scans must be configured using a self-hosted integration runtime using an authentication method other than Azure Purview managed identity. 

- Review [Support matrix for scanning data sources through ingestion private endpoint](catalog-private-link.md#support-matrix-for-scanning-data-sources-through-ingestion-private-endpoint) before setting up any scans.

- Review [DNS requirements](catalog-private-link-name-resolution.md#deployment-options). If you are using a custom DNS server on your network, clients must be able to resolve the FQDN for the Azure Purview account endpoints to the Private Endpoint IP address. 

### Integration runtime options 

- If your data sources are located in Azure, you need to setup and use a self-hosted integration runtime on a Windows virtual machine that is deployed inside the same virtual network where Azure Purview ingestion private endpoints are deployed. Azure integration runtime will not work with ingestion private endpoints. 

- To scan on-premises data sources, you can also install a self-hosted integration runtime either on an on-premises Windows machine or a VM inside Azure virtual network. 

- When using private endpoint with Azure Purview, you need to allow network connectivity from data sources to self-hosted integration VM on the Azure virtual network where Azure Purview private endpoints are deployed.  

- We recommend allowing self-hosted integration runtime auto-upgrade. Make sure you open required outbound rules in your Azure virtual network or on your corporate firewall to allow auto-upgrade. For more information, see [Self-hosted integration runtime networking requirements](manage-integration-runtimes.md#networking-requirements).

### Authentication options  

- You cannot use Azure Purview managed identity (MSI) to scan data sources through ingestion private endpoints. Use Service principal, Account Key or SQL Authentication based on data source type.

- Make sure that your credentials are stored in an Azure key vault, and registered inside Azure Purview.

- You are required to create a credential in Azure Purview based of each secret that you create in the Azure key vault. You need to assign at minimum _get_ and _list_ access for secrets for your Azure Purview on the Key Vault resource in Azure, otherwise, the credentials won't work in Azure Purview account. 

### Current limitations 

- Scanning Azure multiple sources using the entire subscription or resources group using ingestion private endpoints and self-hosted integration runtime is not supported when using private endpoints for ingestion, instead you can register and scan data sources individually. 

- For limitation related to Azure Purview private endpoints, see [Known limitations](catalog-private-link-troubleshoot.md#known-limitations) 

- For limitations related to Private Link service, see [Azure Private Link limits](../azure-resource-manager/management/azure-subscription-service-limits.md#private-link-limits). 

### Private endpoint scenarios 

#### Scenario 1: Single virtual network, single region  

In this scenario all Azure data sources, self-hosted integration runtime VMs and Azure Purview private endpoints are deployed in the same virtual network in an Azure Subscription.   

If on-premises data sources exist, connectivity is provided through a Site to Site VPN or ExpressRoute connectivity to Azure virtual network where Azure Purview private endpoints are deployed. 

This architecture is suitable mainly for small organizations or development, testing and proof of concepts scenarios. 

  :::image type="content" source="media/concept-best-practices/network-pe-single-vnet.png" alt-text="Screenshot that shows Azure Purview with private endpoints in a single virtual network scenario."lightbox="media/concept-best-practices/network-pe-single-vnet.png":::

#### Scenario 2: Single region, multiple virtual networks 

To connect two or more virtual networks in Azure together, you can use [virtual network peering](../virtual-network/virtual-network-peering-overview.md). Network traffic between peered virtual networks is private and is kept on the Azure backbone network. 

Many customers build their network infrastructure in Azure using the hub and spoke network architecture, where: 

- Networking shared services (such as network virtual appliances, ExpressRoute/VPN gateways, or DNS servers) are deployed in the hub virtual network 
- Spoke virtual networks consume those shared services via virtual network peering. 

In hub and spoke network architectures, your organization's data governance team can be provided with an Azure subscription, which includes a virtual network (Hub) and all data services can be located in few other subscriptions connected to the hub virtual network through a virtual network peering or a Site-to-Site VPN connection. In this architecture, you can deploy Azure Purview and one or more self-hosted integration runtime VMs in the hub subscription and virtual network and register and scan data sources from other virtual networks from multiple subscriptions in the same region. 

self-hosted integration runtime VMs must be in the same virtual network as ingestion private endpoint but they can be in a separate subnet.

  :::image type="content" source="media/concept-best-practices/network-pe-multi-vnet.png" alt-text="Screenshot that shows Azure Purview with private endpoints in a scenario of multiple virtual networks."lightbox="media/concept-best-practices/network-pe-multi-vnet.png":::

You can optionally deploy additional self-hosted integration runtime in the spoke virtual networks. In tha case an additional account and ingestion private endpoint must be deployed in the spoke virtual network. 

#### Scenario 3: Multiple regions, multiple virtual networks

If your data sources are distributed across multiple Azure regions in one or more Azure subscriptions, you can use this scenario.

For performance and cost optimization purposes, it is highly recommended deploying one or more self-hosted integration runtime VMs in each region where data sources are located. In that case you need to deploy an additional account and ingestion private endpoint for Azure Purview account in the region and virtual network where self-hosted integration runtime VMs are located.  

If you need to register and scan any Azure Data Lake Storage (Gen 2) resources from other regions, it is required to have a local self-hosted integration runtime VM in the region where the data source is located. 

  :::image type="content" source="media/concept-best-practices/network-pe-multi-region.png" alt-text="Screenshot that shows Azure Purview with private endpoints in a scenario of multiple virtual networks and multiple regions."lightbox="media/concept-best-practices/network-pe-multi-region.png":::

## Option 3: Use both private endpoint and public endpoints

This option is needed when you have a subset of your data sources using private endpoints and at the same time, you need to scan other data sources that are configured with [Service Endpoint](../virtual-network/virtual-network-service-endpoints-overview.md) or data sources that have a public endpoint that is accessible through the internet.

You can use private endpoints for your Azure Purview account, and set **Public network access** to _allow_ on your Azure Purview account, if you need to fulfill any of the following requirements:
  
You are required to scan some data sources using ingestion private endpoint and some data sources using public endpoints or service endpoint.

### Integration runtime options 

- To scan an Azure data source that is configured with a private endpoint, you need to setup and use a self-hosted integration runtime on a Windows virtual machine that is deployed inside the same virtual network where Azure Purview ingestion private endpoints are deployed. When using private endpoint with Azure Purview, you need to allow network connectivity from data sources to self-hosted integration VM on the Azure virtual network where Azure Purview private endpoints are deployed.  

- To scan an Azure data source that is configured to allow public endpoint, you can use the Azure integration runtime. 

- To scan on-premises data sources, you can also install a self-hosted integration runtime either on an on-premises Windows machine or a VM inside Azure virtual network. 

- We recommend allowing self-hosted integration runtime auto-upgrade. Make sure you open required outbound rules in your Azure virtual network or on your corporate firewall to allow auto-upgrade. For more information, see [Self-hosted integration runtime networking requirements](manage-integration-runtimes.md#networking-requirements).

### Authentication options  

- To scan an Azure data source that is configured to allow public endpoint, you can use any authentication option, based on data source type.
  
- Using ingestion private endpoint to scan an Azure data source that is configured with a private endpoint:
  - You cannot use Azure Purview managed identity (MSI), instead, use Service principal, Account Key or SQL Authentication based on data source type. 
  
  - Make sure that your credentials are stored in an Azure key vault, and registered inside Azure Purview.

  - You are required to create a credential in Azure Purview based of each secret that you create in Azure Key Vault. You need to assign at minimum _get_ and _list_ access for secrets for your Azure Purview on the Key Vault resource in Azure, otherwise, the credentials won't work in Azure Purview account. 

## Next steps
-  [Use private endpoints for secure access to Azure Purview](./catalog-private-link.md)
