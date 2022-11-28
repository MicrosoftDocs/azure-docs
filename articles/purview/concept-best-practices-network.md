---
title: Microsoft Purview network architecture and best practices
description: This article provides examples of Microsoft Purview network architecture options and describes best practices.
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 03/04/2022
ms.custom: fasttrack-edit
---

# Microsoft Purview network architecture and best practices

Microsoft Purview is a platform as a service (PaaS) solution for data governance. Microsoft Purview accounts have public endpoints that are accessible through the internet to connect to the service. However, all endpoints are secured through Azure Active Directory (Azure AD) logins and role-based access control (RBAC).

For an added layer of security, you can create private endpoints for your Microsoft Purview account. You then get a private IP address from your virtual network in Azure to the Microsoft Purview account and its managed resources. This address will restrict all traffic between your virtual network and the Microsoft Purview account to a private link for user interaction with the APIs and Microsoft Purview governance portal, or for scanning and ingestion. 

Currently, the Microsoft Purview firewall provides access control for the public endpoint of your purview account. You can use the firewall to allow all access or to block all access through the public endpoint when using private endpoints. 

Based on your network, connectivity, and security requirements, you can set up and maintain Microsoft Purview accounts to access underlying services or ingestion. Use this best practices guide to define and prepare your network environment so you can access Microsoft Purview and scan data sources from various locations in your network or cloud. 

This guide covers the following network options: 

- Use [Azure public endpoints](#option-1-use-public-endpoints). 
- Use [private endpoints](#option-2-use-private-endpoints). 
- Use [private endpoints and allow public access on the same Microsoft Purview account](#option-3-use-both-private-and-public-endpoints). 

This guide describes a few of the most common network architecture scenarios for Microsoft Purview. Though you're not limited to those scenarios, keep in mind the [limitations](#current-limitations) of the service when you're planning networking for your Microsoft Purview accounts. 

## Prerequisites

To understand what network option is the most suitable for your environment, we suggest that you perform the following actions first: 

- Review your network topology and security requirements before registering and scanning any data sources in Microsoft Purview. For more information, see [Define an Azure network topology](/azure/cloud-adoption-framework/ready/azure-best-practices/define-an-azure-network-topology). 

- Define your [network connectivity model for PaaS services](/azure/cloud-adoption-framework/ready/azure-best-practices/connectivity-to-azure-paas-services). 

## Option 1: Use public endpoints 

By default, you can use Microsoft Purview accounts through public endpoints accessible through the internet. Allow public networks in your Microsoft Purview account if you have the following requirements: 

- No private connectivity is required when scanning or connecting to Microsoft Purview endpoints. 
- All data sources are SaaS applications only. 
- All data sources have a public endpoint that's accessible through the internet. 
- Business users require access to a Microsoft Purview account and the Microsoft Purview governance portal through the internet. 

### Integration runtime options 

To scan data sources while the Microsoft Purview account firewall is set to allow public access, you can use both the Azure integration runtime and a [self-hosted integration runtime](./manage-integration-runtimes.md). How you use them depends on the [supportability of your data sources](manage-data-sources.md).  

Here are some best practices:

- You can use the Azure integration runtime or a self-hosted integration runtime to scan Azure data sources such as Azure SQL Database or Azure Blob Storage. We recommend that you use the Azure integration runtime to scan Azure data sources when possible, to reduce cost and administrative overhead. 
  
- To scan multiple Azure data sources, use a public network and the Azure integration runtime. The following steps show the communication flow at a high level when you're using the Azure integration runtime to scan a data source in Azure:

  :::image type="content" source="media/concept-best-practices/network-azure-runtime.png" alt-text="Screenshot that shows the connection flow between Microsoft Purview, the Azure runtime, and data sources."lightbox="media/concept-best-practices/network-azure-runtime.png":::

  1. A manual or automatic scan is initiated from the Microsoft Purview Data Map through the Azure integration runtime. 
   
  2. The Azure integration runtime connects to the data source to extract metadata.

  3. Metadata is queued in Microsoft Purview managed storage and stored in Azure Blob Storage. 

  4. Metadata is sent to the Microsoft Purview Data Map. 

- Scanning on-premises and VM-based data sources always requires using a self-hosted integration runtime. The Azure integration runtime isn't supported for these data sources. The following steps show the communication flow at a high level when you're using a self-hosted integration runtime to scan a data source. The first diagram shows a scenario where resources are within Azure or on a VM in Azure. The second diagram shows a scenario with on-premises resources. The steps between the two are the same from Microsoft Purview's perspective:

  :::image type="content" source="media/concept-best-practices/network-self-hosted-runtime.png" alt-text="Screenshot that shows the connection flow between Microsoft Purview, a self-hosted runtime, and data sources."lightbox="media/concept-best-practices/network-self-hosted-runtime.png":::

  :::image type="content" source="media/concept-best-practices/security-self-hosted-runtime-on-premises.png" alt-text="Screenshot that shows the connection flow between Microsoft Purview, an on-premises self-hosted runtime, and data sources in on-premises network."lightbox="media/concept-best-practices/security-self-hosted-runtime-on-premises.png":::

  1. A manual or automatic scan is triggered. Microsoft Purview connects to Azure Key Vault to retrieve the credential to access a data source.
   
  2. The scan is initiated from the Microsoft Purview Data Map through a self-hosted integration runtime. 
   
  3. The self-hosted integration runtime service from the VM or on-premises machine connects to the data source to extract metadata.

  4. Metadata is processed in the machine's memory for the self-hosted integration runtime. Metadata is queued in Microsoft Purview managed storage and then stored in Azure Blob Storage. Actual data never leaves the boundary of your network.

  5. Metadata is sent to the Microsoft Purview Data Map. 

### Authentication options  

When you're scanning a data source in Microsoft Purview, you need to provide a credential. Microsoft Purview can then read the metadata of the assets by using the Azure integration runtime in the destination data source. When you're using a public network, authentication options and requirements vary based on the following factors: 

- **Data source type**. For example, if the data source is Azure SQL Database, you need to use SQL authentication with db_datareader access to each database. This can be a user-managed identity or a Microsoft Purview managed identity. Or it can be a service principal in Azure Active Directory added to SQL Database as db_datareader. 

  If the data source is Azure Blob Storage, you can use a Microsoft Purview managed identity, or a service principal in Azure Active Directory added as a Blob Storage Data Reader role on the Azure storage account. Or use the storage account's key.  

- **Authentication type**. We recommend that you use a Microsoft Purview managed identity to scan Azure data sources when possible, to reduce administrative overhead. For any other authentication types, you need to [set up credentials for source authentication inside Microsoft Purview](manage-credentials.md): 

  1. Generate a secret inside an Azure key vault. 
  1. Register the key vault inside Microsoft Purview.  
  1. Inside Microsoft Purview, create a new credential by using the secret saved in the key vault. 

- **Runtime type that's used in the scan**. Currently, you can't use a Microsoft Purview managed identity with a self-hosted integration runtime. 

### Other considerations  

- If you choose to scan data sources using public endpoints, your self-hosted integration runtime VMs must have outbound access to data sources and Azure endpoints. 

- Your self-hosted integration runtime VMs must have [outbound connectivity to Azure endpoints](manage-integration-runtimes.md#networking-requirements). 

- Your Azure data sources must allow public access. If a service endpoint is enabled on the data source, make sure you _allow Azure services on the trusted services list_ to access your Azure data sources. The service endpoint routes traffic from the virtual network through an optimal path to Azure. 

## Option 2: Use private endpoints 

Similar to other PaaS solutions, Microsoft Purview doesn't support deploying directly into a virtual network. So you can't use certain networking features with the offering's resources, such as network security groups, route tables, or other network-dependent appliances such as Azure Firewall. Instead, you can use private endpoints that can be enabled on your virtual network. You can then disable public internet access to securely connect to Microsoft Purview. 

You must use private endpoints for your Microsoft Purview account if you have any of the following requirements: 

- You need to have end-to-end network isolation for Microsoft Purview accounts and data sources. 

- You need to [block public access](./catalog-private-link-end-to-end.md#firewalls-to-restrict-public-access) to your Microsoft Purview accounts. 

- Your PaaS data sources are deployed with private endpoints, and you've blocked all access through the public endpoint. 

- Your on-premises or IaaS data sources can't reach public endpoints. 

### Design considerations  

- To connect to your Microsoft Purview account privately and securely, you need to deploy an account and a portal private endpoint. For example, this deployment is necessary if you intend to connect to Microsoft Purview through the API or use the Microsoft Purview governance portal.

- If you need to connect to the Microsoft Purview governance portal by using private endpoints, you have to deploy both account and portal private endpoints. 

- To scan data sources through private connectivity, you need to configure at least one account and one ingestion private endpoint for Microsoft Purview. You must configure scans by using a self-hosted integration runtime through an authentication method other than a Microsoft Purview managed identity. 

- Review [Support matrix for scanning data sources through an ingestion private endpoint](catalog-private-link.md#support-matrix-for-scanning-data-sources-through-ingestion-private-endpoint) before you set up any scans.

- Review [DNS requirements](catalog-private-link-name-resolution.md#deployment-options). If you're using a custom DNS server on your network, clients must be able to resolve the fully qualified domain name (FQDN) for the Microsoft Purview account endpoints to the private endpoint's IP address. 

### Integration runtime options 

- If your data sources are in Azure, you need to set up and use a self-hosted integration runtime on a Windows virtual machine that's deployed inside the same or a peered virtual network where Microsoft Purview ingestion private endpoints are deployed. The Azure integration runtime won't work with ingestion private endpoints. 

- To scan on-premises data sources, you can also install a self-hosted integration runtime either on an on-premises Windows machine or on a VM inside an Azure virtual network. 

- When you're using private endpoints with Microsoft Purview, you need to allow network connectivity from data sources to the self-hosted integration VM on the Azure virtual network where Microsoft Purview private endpoints are deployed.  

- We recommend allowing automatic upgrade of the self-hosted integration runtime. Make sure you open required outbound rules in your Azure virtual network or on your corporate firewall to allow automatic upgrade. For more information, see [Self-hosted integration runtime networking requirements](manage-integration-runtimes.md#networking-requirements).

### Authentication options  

- You can't use a Microsoft Purview managed identity to scan data sources through ingestion private endpoints. Use a service principal, an account key, or SQL authentication, based on data source type.

- Make sure that your credentials are stored in an Azure key vault and registered inside Microsoft Purview.

- You must create a credential in Microsoft Purview based on each secret that you create in the Azure key vault. You need to assign, at minimum, _get_ and _list_ access for secrets for Microsoft Purview on the Key Vault resource in Azure. Otherwise, the credentials won't work in the Microsoft Purview account. 

### Current limitations 

- Scanning multiple Azure sources by using the entire subscription or resource group through ingestion private endpoints and a self-hosted integration runtime isn't supported when you're using private endpoints for ingestion. Instead, you can register and scan data sources individually. 

- For limitations related to Microsoft Purview private endpoints, see [Known limitations](catalog-private-link-troubleshoot.md#known-limitations).

- For limitations related to the Private Link service, see [Azure Private Link limits](../azure-resource-manager/management/azure-subscription-service-limits.md#private-link-limits). 

### Private endpoint scenarios 

#### Single virtual network, single region  

In this scenario, all Azure data sources, self-hosted integration runtime VMs, and Microsoft Purview private endpoints are deployed in the same virtual network in an Azure subscription.   

If on-premises data sources exist, connectivity is provided through a site-to-site VPN or Azure ExpressRoute connectivity to an Azure virtual network where Microsoft Purview private endpoints are deployed. 

This architecture is suitable mainly for small organizations or for development, testing, and proof-of-concept scenarios. 

:::image type="content" source="media/concept-best-practices/network-pe-single-vnet.png" alt-text="Screenshot that shows Microsoft Purview with private endpoints in a single virtual network scenario."lightbox="media/concept-best-practices/network-pe-single-vnet.png":::

#### Single region, multiple virtual networks 

To connect two or more virtual networks in Azure together, you can use [virtual network peering](../virtual-network/virtual-network-peering-overview.md). Network traffic between peered virtual networks is private and is kept on the Azure backbone network. 

Many customers build their network infrastructure in Azure by using the hub-and-spoke network architecture, where: 

- Networking shared services (such as network virtual appliances, ExpressRoute/VPN gateways, or DNS servers) are deployed in the hub virtual network. 
- Spoke virtual networks consume those shared services via virtual network peering. 

In hub-and-spoke network architectures, your organization's data governance team can be provided with an Azure subscription that includes a virtual network (hub). All data services can be located in a few other subscriptions connected to the hub virtual network through a virtual network peering or a site-to-site VPN connection. 

In a hub-and-spoke architecture, you can deploy Microsoft Purview and one or more self-hosted integration runtime VMs in the hub subscription and virtual network. You can register and scan data sources from other virtual networks from multiple subscriptions in the same region. 

The self-hosted integration runtime VMs can be deployed inside the same Azure virtual network or a peered virtual network where the account and ingestion private endpoints are deployed.

:::image type="content" source="media/concept-best-practices/network-pe-multi-vnet.png" alt-text="Screenshot that shows Microsoft Purview with private endpoints in a scenario of multiple virtual networks."lightbox="media/concept-best-practices/network-pe-multi-vnet.png":::

You can optionally deploy another self-hosted integration runtime in the spoke virtual networks. 

#### Multiple regions, multiple virtual networks

If your data sources are distributed across multiple Azure regions in one or more Azure subscriptions, you can use this scenario.

For performance and cost optimization, we highly recommended deploying one or more self-hosted integration runtime VMs in each region where data sources are located.   

:::image type="content" source="media/concept-best-practices/network-pe-multi-region.png" alt-text="Screenshot that shows Microsoft Purview with private endpoints in a scenario of multiple virtual networks and multiple regions."lightbox="media/concept-best-practices/network-pe-multi-region.png":::

### DNS configuration with private endpoints

#### Name resolution for multiple Microsoft Purview accounts

It's recommended to follow these recommendations, if your organization needs to deploy and maintain multiple Microsoft Purview accounts using private endpoints:

1. Deploy at least one _account_ private endpoint for each Microsoft Purview account.
2. Deploy at least one set of _ingestion_ private endpoints for each Microsoft Purview account.
3. Deploy one _portal_ private endpoint for one of the Microsoft Purview accounts in your Azure environments. Create one DNS A record for _portal_ private endpoint to resolve `web.purview.azure.com`. The _portal_ private endpoint can be used by all purview accounts in the same Azure virtual network or virtual networks connected through VNet peering.

:::image type="content" source="media/concept-best-practices/network-pe-dns.png" alt-text="Screenshot that shows how to handle private endpoints and DNS records for multiple Microsoft Purview accounts."lightbox="media/concept-best-practices/network-pe-dns.png":::

This scenario also applies if multiple Microsoft Purview accounts are deployed across multiple subscriptions and multiple VNets that are connected through VNet peering. _Portal_ private endpoint mainly renders static assets related to the Microsoft Purview governance portal, thus, it's independent of Microsoft Purview account, therefore, only one _portal_ private endpoint is needed to visit all Microsoft Purview accounts in the Azure environment if VNets are connected.

:::image type="content" source="media/concept-best-practices/network-pe-dns-multi-vnet.png" alt-text="Screenshot that shows how to handle private endpoints and DNS records for multiple Microsoft Purview accounts in multiple vnets."lightbox="media/concept-best-practices/network-pe-dns-multi-vnet.png":::

> [!NOTE]
> You may need to deploy separate _portal_ private endpoints for each Microsoft Purview account in the scenarios where Microsoft Purview accounts are deployed in isolated network segmentations.
> Microsoft Purview _portal_ is static contents for all customers without any customer information. Optionally, you can use public network, (without portal private endpoint) to launch `web.purview.azure.com` if your end users are allowed to launch the Internet.

## Option 3: Use both private and public endpoints

You might choose an option in which a subset of your data sources uses private endpoints, and at the same time, you need to scan either of the following:

- Other data sources that are configured with a [service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md)
- Data sources that have a public endpoint that's accessible through the internet

If you need to scan some data sources by using an ingestion private endpoint and some data sources by using public endpoints or a service endpoint, you can:

1. Use private endpoints for your Microsoft Purview account.
1. Set **Public network access** to **allow** on your Microsoft Purview account.

### Integration runtime options 

- To scan an Azure data source that's configured with a private endpoint, you need to set up and use a self-hosted integration runtime on a Windows virtual machine that's deployed inside the same or a peered virtual network where Microsoft Purview account and ingestion private endpoints are deployed. 

  When you're using a private endpoint with Microsoft Purview, you need to allow network connectivity from data sources to a self-hosted integration VM on the Azure virtual network where Microsoft Purview private endpoints are deployed.  

- To scan an Azure data source that's configured to allow a public endpoint, you can use the Azure integration runtime. 

- To scan on-premises data sources, you can also install a self-hosted integration runtime on either an on-premises Windows machine or a VM inside an Azure virtual network. 

- We recommend allowing automatic upgrade for a self-hosted integration runtime. Make sure you open required outbound rules in your Azure virtual network or on your corporate firewall to allow automatic upgrade. For more information, see [Self-hosted integration runtime networking requirements](manage-integration-runtimes.md#networking-requirements).

### Authentication options  

- To scan an Azure data source that's configured to allow a public endpoint, you can use any authentication option, based on the data source type.
  
- If you use an ingestion private endpoint to scan an Azure data source that's configured with a private endpoint:

  - You can't use a Microsoft Purview managed identity. Instead, use a service principal, an account key, or SQL authentication, based on the data source type. 
  
  - Make sure that your credentials are stored in an Azure key vault and registered inside Microsoft Purview.

  - You must create a credential in Microsoft Purview based on each secret that you create in Azure Key Vault. At minimum, assign _get_ and _list_ access for secrets for Microsoft Purview on the Key Vault resource in Azure. Otherwise, the credentials won't work in the Microsoft Purview account. 

## Self-hosted integration runtime network and proxy recommendations

For scanning data sources across your on-premises and Azure networks, you may need to deploy and use one or multiple [self-hosted integration runtime virtual machines](manage-integration-runtimes.md) inside an Azure VNet or an on-premises network, for any of the scenarios mentioned earlier in this document. 

- To simplify management, when possible, use Azure runtime and [Microsoft Purview Managed runtime](catalog-managed-vnet.md) to scan Azure data sources.
 
- The Self-hosted integration runtime service can communicate with Microsoft Purview through public or private network over port 443. For more information, see, [self-hosted integration runtime networking requirements](manage-integration-runtimes.md#networking-requirements).

- One self-hosted integration runtime VM can be used to scan one or multiple data sources in Microsoft Purview, however, self-hosted integration runtime must be only registered for Microsoft Purview and can't be used for Azure Data Factory or Azure Synapse at the same time.

- You can register and use one or multiple self-hosted integration runtimes in one Microsoft Purview account. It's recommended to place at least one self-hosted integration runtime VM in each region or on-premises network where your data sources reside. 

- It's recommended to define a baseline for required capacity for each self-hosted integration runtime VM and scale the VM capacity based on demand. 

- It's recommended to set up network connection between self-hosted integration runtime VMs and Microsoft Purview and its managed resources through private network, when possible.

- Allow outbound connectivity to download.microsoft.com, if auto-update is enabled.

- The self-hosted integration runtime service doesn't require outbound internet connectivity, if self-hosted integration runtime VMs are deployed in an Azure VNet or in the on-premises network that is connected to Azure through an ExpressRoute or Site to Site VPN connection. In this case, the scan and metadata ingestion process can be done through private network.  

- Self-hosted integration runtime can communicate Microsoft Purview and its managed resources directly or through [a proxy server](manage-integration-runtimes.md#proxy-server-considerations). Avoid using proxy settings if self-hosted integration runtime VM is inside an Azure VNet or connected through ExpressRoute or Site to Site VPN connection.

- Review supported scenarios, if you need to use self-hosted integration runtime with [proxy setting](manage-integration-runtimes.md#proxy-server-considerations).

## Next steps
-  [Use private endpoints for secure access to Microsoft Purview](./catalog-private-link.md)
