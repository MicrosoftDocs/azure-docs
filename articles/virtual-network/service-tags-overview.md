---
title: Azure service tags overview
titlesuffix: Azure Virtual Network
description: Learn about service tags. Service tags help minimize the complexity of security rule creation.
services: virtual-network
documentationcenter: na
author: jispar
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/22/2019
ms.author: jispar
ms.reviewer: kumud
---

# Virtual network service tags 
<a name="network-service-tags"></a>

A service tag represents a group of IP address prefixes from a given Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, minimizing the complexity of frequent updates to network security rules. 

You can use service tags to define network access controls on [network security groups](https://docs.microsoft.com/azure/virtual-network/security-overview#security-rules) or [Azure Firewall](https://docs.microsoft.com/azure/firewall/service-tags). Use service tags in place of specific IP addresses when you create security rules. By specifying the service tag name (for example, **ApiManagement**) in the appropriate *source* or *destination* field of a rule, you can allow or deny the traffic for the corresponding service. 

You can use service tags to achieve network isolation and protect your Azure resources from the general Internet while accessing Azure services that have public endpoints. Create inbound/outbound network security group rules to deny traffic to/from **Internet** and allow traffic to/from **AzureCloud** or other [available service tags](#available-service-tags) of specific Azure services. 

## Available service tags
The following table includes all the service tags available for use in [network security group](https://docs.microsoft.com/azure/virtual-network/security-overview#security-rules) rules.

The columns indicate whether the tag:

- Is suitable for rules that cover inbound or outbound traffic.
- Supports [regional](https://azure.microsoft.com/regions) scope.
- Is usable in [Azure Firewall](https://docs.microsoft.com/azure/firewall/service-tags) rules.

By default, service tags reflect the ranges for the entire cloud. Some service tags also allow more granular control by restricting the corresponding IP ranges to a specified region. For example, the service tag **Storage** represents Azure Storage for the entire cloud, but **Storage.WestUS** narrows the range to only the storage IP address ranges from the WestUS region. The following table indicates whether each service tag supports such regional scope.  

| Tag | Purpose | Can use inbound or outbound? | Can be regional? | Can use with Azure Firewall? |
| --- | -------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **ApiManagement** | Management traffic for Azure API Management-dedicated deployments. | Both | No | Yes |
| **ApplicationInsightsAvailability** | Application Insights Availability. | Both | No | No |
| **AppService**    | Azure App Service. This tag is recommended for outbound security rules to web app front ends. | Outbound | Yes | Yes |
| **AppServiceManagement** | Management traffic for deployments dedicated to App Service Environment. | Both | No | Yes |
| **AzureActiveDirectory** | Azure Active Directory. | Outbound | No | Yes |
| **AzureActiveDirectoryDomainServices** | Management traffic for deployments dedicated to Azure Active Directory Domain Services. | Both | No | Yes |
| **AzureAdvancedThreatProtection** | Azure Advanced Threat Protection. | Outbound | No | No |
| **AzureBackup** |Azure Backup.<br/><br/>*Note:* This tag has a dependency on the **Storage** and **AzureActiveDirectory** tags. | Outbound | No | Yes |
| **AzureBotService** | Azure Bot Service. | Outbound | No | No |
| **AzureCloud** | All [datacenter public IP addresses](https://www.microsoft.com/download/details.aspx?id=41653). | Outbound | Yes | Yes |
| **AzureCognitiveSearch** | Azure Cognitive Search (if using indexers with a skillset). | Both | No | No |
| **AzureConnectors** | Azure Logic Apps connectors for probe/back-end connections. | Inbound | Yes | Yes |
| **AzureContainerRegistry** | Azure Container Registry. | Outbound | Yes | Yes |
| **AzureCosmosDB** | Azure Cosmos DB. | Outbound | Yes | Yes |
| **AzureDatabricks** | Azure Databricks. | Both | No | No |
| **AzureDataExplorerManagement** | Azure Data Explorer Management. | Inbound | No | No |
| **AzureDataLake** | Azure Data Lake. | Outbound | No | Yes |
| **AzureEventGrid** | Azure Event Grid. <br/><br/>*Note:* This tag covers Azure Event Grid endpoints in US South Central, US East, US East 2, US West 2, and US Central only. | Both | No | No |
| **AzureFrontDoor** | Azure Front Door. | Both | No | No |
| **AzureInformationProtection** | Azure Information Protection.<br/><br/>*Note:* This tag has a dependency on the **AzureActiveDirectory** and **AzureFrontDoor.Frontend** tags. Please also whitelist following IPs (this dependency will be removed soon): 13.107.6.181 & 13.107.9.181. | Outbound | No | No |
| **AzureIoTHub** | Azure IoT Hub. | Outbound | No | No |
| **AzureKeyVault** | Azure Key Vault.<br/><br/>*Note:* This tag has a dependency on the **AzureActiveDirectory** tag. | Outbound | Yes | Yes |
| **AzureLoadBalancer** | The Azure infrastructure load balancer. The tag translates to the [virtual IP address of the host](security-overview.md#azure-platform-considerations) (168.63.129.16) where the Azure health probes originate. If you're not using Azure Load Balancer, you can override this rule. | Both | No | No |
| **AzureMachineLearning** | Azure Machine Learning. | Both | No | Yes |
| **AzureMonitor** | Log Analytics, Application Insights, AzMon, and custom metrics (GiG endpoints).<br/><br/>*Note:* For Log Analytics, this tag has a dependency on the **Storage** tag. | Outbound | No | Yes |
| **AzurePlatformDNS** | The basic infrastructure (default) DNS service.<br/><br>You can use this tag to disable the default DNS. Be cautious when you use this tag. We recommend that you read [Azure platform considerations](https://docs.microsoft.com/azure/virtual-network/security-overview#azure-platform-considerations). We also recommend that you perform testing before you use this tag. | Outbound | No | No |
| **AzurePlatformIMDS** | Azure Instance Metadata Service (IMDS), which is a basic infrastructure service.<br/><br/>You can use this tag to disable the default IMDS. Be cautious when you use this tag. We recommend that you read [Azure platform considerations](https://docs.microsoft.com/azure/virtual-network/security-overview#azure-platform-considerations). We also recommend that you perform testing before you use this tag. | Outbound | No | No |
| **AzurePlatformLKM** | Windows licensing or key management service.<br/><br/>You can use this tag to disable the defaults for licensing. Be cautious when you use this tag. We recommend that you read [Azure platform considerations](https://docs.microsoft.com/azure/virtual-network/security-overview#azure-platform-considerations).  We also recommend that you perform testing before you use this tag. | Outbound | No | No |
| **AzureResourceManager** | Azure Resource Manager. | Outbound | No | No |
| **AzureSiteRecovery** | Azure Site Recovery.<br/><br/>*Note:* This tag has a dependency on the **Storage**, **AzureActiveDirectory**, and **EventHub** tags. | Outbound | No | No |
| **AzureTrafficManager** | Azure Traffic Manager probe IP addresses.<br/><br/>For more information on Traffic Manager probe IP addresses, see [Azure Traffic Manager FAQ](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs). | Inbound | No | Yes |  
| **BatchNodeManagement** | Management traffic for deployments dedicated to Azure Batch. | Both | No | Yes |
| **CognitiveServicesManagement** | The address ranges for traffic for Azure Cognitive Services. | Outbound | No | No |
| **Dynamics365ForMarketingEmail** | The address ranges for the marketing email service of Dynamics 365. | Outbound | Yes | No |
| **ElasticAFD** | Elastic Azure Front Door. | Both | No | No |
| **EventHub** | Azure Event Hubs. | Outbound | Yes | Yes |
| **GatewayManager** | Management traffic for deployments dedicated to Azure VPN Gateway and Application Gateway. | Inbound | No | No |
| **GuestAndHybridManagement** | Azure Automation and Guest Configuration. | Both | No | Yes |
| **HDInsight** | Azure HDInsight. | Inbound | Yes | No |
| **Internet** | The IP address space that's outside the virtual network and reachable by the public internet.<br/><br/>The address range includes the [Azure-owned public IP address space](https://www.microsoft.com/download/details.aspx?id=41653). | Both | No | No |
| **MicrosoftCloudAppSecurity** | Microsoft Cloud App Security. | Outbound | No | No |
| **MicrosoftContainerRegistry** | Azure Container Registry. | Outbound | Yes | Yes |
| **ServiceBus** | Azure Service Bus traffic that uses the Premium service tier. | Outbound | Yes | Yes |
| **ServiceFabric** | Azure Service Fabric. | Outbound | No | No |
| **Sql** | Azure SQL Database, Azure Database for MySQL, Azure Database for PostgreSQL, and Azure SQL Data Warehouse.<br/><br/>*Note:* This tag represents the service, but not specific instances of the service. For example, the tag represents the Azure SQL Database service, but not a specific SQL database or server. | Outbound | Yes | Yes |
| **SqlManagement** | Management traffic for SQL-dedicated deployments. | Both | No | Yes |
| **Storage** | Azure Storage. <br/><br/>*Note:* This tag represents the service, but not specific instances of the service. For example, the tag represents the Azure Storage service, but not a specific Azure Storage account. | Outbound | Yes | Yes |
| **VirtualNetwork** | The virtual network address space (all IP address ranges defined for the virtual network), all connected on-premises address spaces, [peered](virtual-network-peering-overview.md) virtual networks, virtual networks connected to a [virtual network gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%3ftoc.json), the [virtual IP address of the host](security-overview.md#azure-platform-considerations), and address prefixes used on [user-defined routes](virtual-networks-udr-overview.md). This tag might also contain default routes. | Both | No | No |

>[!NOTE]
>In the classic deployment model (before Azure Resource Manager), a subset of the tags listed in the previous table are supported. These tags are spelled differently:
>
>| Classic spelling | Equivalent Resource Manager tag |
>|---|---|
>| AZURE_LOADBALANCER | AzureLoadBalancer |
>| INTERNET | Internet |
>| VIRTUAL_NETWORK | VirtualNetwork |

> [!NOTE]
> Service tags of Azure services denote the address prefixes from the specific cloud being used. For example, the underlying IP ranges that correspond to the **Sql** tag value on the Azure Public cloud will be different from the underlying ranges on the Azure China cloud.

> [!NOTE]
> If you implement a [virtual network service endpoint](virtual-network-service-endpoints-overview.md) for a service, such as Azure Storage or Azure SQL Database, Azure adds a [route](virtual-networks-udr-overview.md#optional-default-routes) to a virtual network subnet for the service. The address prefixes in the route are the same address prefixes, or CIDR ranges, as those of the corresponding service tag.

## Service tags on-premises  
You can obtain the current service tag and range information to include as part of your on-premises firewall configurations. This information is the current point-in-time list of the IP ranges that correspond to each service tag. You can obtain the information programmatically or via a JSON file download, as described in the following sections.

### Use the Service Tag Discovery API (public preview)
You can programmatically retrieve the current list of service tags together with IP address range details:

- [REST](https://docs.microsoft.com/rest/api/virtualnetwork/servicetags/list)
- [Azure PowerShell](https://docs.microsoft.com/powershell/module/az.network/Get-AzNetworkServiceTag?view=azps-2.8.0&viewFallbackFrom=azps-2.3.2)
- [Azure CLI](https://docs.microsoft.com/cli/azure/network?view=azure-cli-latest#az-network-list-service-tags)

> [!NOTE]
> While it's in public preview, the Discovery API might return information that's less current than information returned by the JSON downloads. (See the next section.)


### Discover service tags by using downloadable JSON files 
You can download JSON files that contain the current list of service tags together with IP address range details. These lists are updated and published weekly. Locations for each cloud are:

- [Azure Public](https://www.microsoft.com/download/details.aspx?id=56519)
- [Azure US Government](https://www.microsoft.com/download/details.aspx?id=57063)  
- [Azure China](https://www.microsoft.com/download/details.aspx?id=57062) 
- [Azure Germany](https://www.microsoft.com/download/details.aspx?id=57064)   

> [!NOTE]
>A subset of this information has been published in XML files for [Azure Public](https://www.microsoft.com/download/details.aspx?id=41653), [Azure China](https://www.microsoft.com/download/details.aspx?id=42064), and [Azure Germany](https://www.microsoft.com/download/details.aspx?id=54770). These XML downloads will be deprecated by June 30, 2020 and will no longer be available after that date. You should migrate to using the Discovery API or JSON file downloads as described in the previous sections.

### Tips 
- You can detect updates from one publication to the next by noting increased *changeNumber* values in the JSON file. Each subsection (for example, **Storage.WestUS**) has its own *changeNumber* that's incremented as changes occur. The top level of the file's *changeNumber* is incremented when any of the subsections is changed.
- For examples of how to parse the service tag information (for example, get all address ranges for Storage in WestUS), see the [Service Tag Discovery API PowerShell](https://aka.ms/discoveryapi_powershell) documentation.

## Next steps
- Learn how to [create a network security group](tutorial-filter-network-traffic.md).
