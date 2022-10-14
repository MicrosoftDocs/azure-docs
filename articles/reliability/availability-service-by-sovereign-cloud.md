---
title: Availability of services by sovereign cloud
description: Learn how services are supported for each sovereign cloud
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 07/19/2022
ms.author: anaharris
ms.reviewer: cynthn
ms.custom: references_regions
---

# Availability of services by sovereign cloud  

Although availability of services across Azure regions depends on a region's type, there are public clouds that may not support or only partially support certain services. The article shows which services are available for regions of particular sovereign clouds.

Azure regional services are presented in the following tables by sovereign cloud. Note that some services are non-regional, which means that they're available globally regardless of region. Non-regional services are not mentioned in these tables. For information and a complete list of non-regional services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).


## China

### AI + machine learning

This section outlines variations and considerations when using Azure Bot Service, Azure Machine Learning, and Cognitive Services in the Azure China environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
|Azure Machine learning| See [Azure Machine Learning feature availability across US Gov cloud regions](../machine-learning/reference-machine-learning-cloud-parity.md#azure-china-21vianet). | |
| Cognitive Services: Speech| See [Cognitive Services: US Gov Sovereign Cloud - Speech service](../cognitive-services/speech-service/sovereign-clouds.md?tabs=c-sharp.md#azure-china)  ||

### Media

This section outlines variations and considerations when using Media services in the Azure China environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure Media Services | For Azure Media Services v3 feature variations in Azure Government, see [Azure Media Services v3 clouds and regions availability](/azure/media-services/latest/azure-clouds-regions#china).  |  

### Networking

This section outlines variations and considerations when using Networking services in the Azure China environment. 

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Private Link| <li>For Private Link services availability, see [Azure Private Link availability](../private-link/availability.md).<li>For Private DNS zone names, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md#government). |

### China REST endpoints

| REST endpoint | Global Azure | Azure China |
|---------------|--------------|------------------|
| Management plane |	`https://management.azure.com/` |	`https://management.chinacloudapi.cn/` |
| Data plane |	`https://{location}.experiments.azureml.net`	| `https://{location}.experiments.ml.azure`.cn |
| Azure Active Directory	| `https://login.microsoftonline.com`	 | `https://login.chinacloudapi.cn` |



## US Government

Azure Government is a cloud services platform built upon the foundational principles of security, privacy, and compliance. Customers eligible for Azure Government benefit from a physically isolated instance of Azure.

For tutorials, how-to or get started guides, and information on deployment and compliance see [Azure Government documentation](../azure-government/index.yml).

### AI + machine learning

This section outlines variations and considerations when using Azure Bot Service, Azure Machine Learning, and Cognitive Services in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|------------|---|
| Azure Bot Service |<ul><li>Bot Framework Composer integration<li> Channels (due to availability of dependent services):<ul><li> Teams Channel<li> Direct Line Speech Channel<li> Telephony Channel (Preview)<li> Microsoft Search Channel (Preview)<li> Kik Channel (deprecated)</ul></ul>|
|Azure Machine learning| See [Azure Machine Learning feature availability across US Gov cloud regions](../machine-learning/reference-machine-learning-cloud-parity.md#azure-government). | |
| Cognitive Services: Content Moderator| <li>Review UI and Review APIs ||
| Cognitive Services: Language Understanding (LUIS)|  <li>Speech Requests<li>Prebuilt Domains ||
| Cognitive Services: Speech| See [Cognitive Services: US Gov Sovereign Cloud - Speech service](../cognitive-services/speech-service/sovereign-clouds.md?tabs=c-sharp#azure-government-united-states)  ||
| Cognitive Services: Translator|  <li>Custom Translator<li>Translator Hub ||

### Analytics

This section outlines variations and considerations when using Analytics services in the Azure Government environment. 

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure HDInsight |For secured virtual networks, you'll want to allow network security groups (NSGs) access to certain IP addresses and ports. For Azure Government, you should allow all IP addresses (all with an Allowed port of 443) in the [Network Security Groups IP address and ports table](#hdinsight-network-security-groups-ip-address-and-ports). |  |
| Power BI]| See [Power BI for US government customers](/power-bi/enterprise/service-govus-overview).|  |
| Power BI Embedded| See [Tutorial: Embed Power BI content into your application for national clouds](/power-bi/developer/embedded/embed-sample-for-customers-national-clouds). | |


#### HDInsight: Network Security Groups IP address and ports
 <!-- move content--> 
|Region|Allowed IP addresses|Allowed port|
|------|--------------------|------------|
|US DoD Central|52.180.249.174 </br> 52.180.250.239|443|
|US DoD East|52.181.164.168 </br>52.181.164.151|443|
|US Gov Texas|52.238.116.212 </br> 52.238.112.86|443|
|US Gov Virginia|13.72.49.126 </br> 13.72.55.55 </br> 13.72.184.124 </br> 13.72.190.110| 443|
|US Gov Arizona|52.127.3.176 </br> 52.127.3.178| 443|

### Databases

This section outlines variations and considerations when using Databases services in the Azure Government environment. 

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure Database for MySQL |<ul><li>Advanced Threat Protection</ul> |  
| Azure Database for PostgreSQL|<ul><li>Hyperscale (Citus) deployment option<li>The following features of the Single server deployment option<ul><li>Advanced Threat Protection<<li>Backup with long-term retention</ul></ul> |  |
| Azure SQL Managed Instance| <ul><li>Long-term retention</ul>  |  


### Developer Tools

This section outlines variations and considerations when using Developer tools in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Enterprise Dev/Test subscription offer |   Enterprise Dev/Test subscription offer in existing or separate tenant is currently available only in Azure public as documented in [Azure EA portal administration](/azure/cost-management-billing/manage/ea-portal-administration#enterprise-devtest-offer). |  

### Identity

This section outlines variations and considerations when using Identity services in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure Active Directory Premium P1 and P2 | <!-- move content--> <ul><li>Limitations with B2B Collaboration in supported Azure US Government tenants:<ul><li>For more information about B2B collaboration limitations in Azure Government and to find out if B2B collaboration is available in your Azure Government tenant, see [Azure AD B2B in government and national clouds](../active-directory/external-identities/b2b-government-national-clouds.md). <li>B2B collaboration via Power BI isn't supported. When you invite a guest user from within Power BI, the B2B flow isn't used and the guest user won't appear in the tenant's user list. If a guest user is invited through other means, they'll appear in the Power BI user list, but any sharing request to the user will fail and display a 403 Forbidden error.</ul><li>Limitations with multi-factor authentication:<ul><li>Trusted IPs isn't supported in Azure Government. Instead, use Conditional Access policies with named locations to establish when multi-factor authentication should and shouldn't be required based off the user's current IP address. </ul></ul><p>For more information, see [Azure Active Directory feature availability for US Gov](../active-directory/authentication/feature-availability.md).| |

### Management and Governance

This section outlines variations and considerations when using Management and Governance services in the Azure Government environment. 

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Automation| <li>Automation analytics solution |  
| Azure Advisor| <!-- move content--> Content is large enough to have its own page in product TOC. See [Azure Advisor](/azure/azure-government/compare-azure-government-global-azure#azure-advisor) |  |
| Azure Lighthouse)| <li>Managed Service offers published to Azure Marketplace<li>Delegation of subscriptions across a national cloud and the Azure public cloud, or across two separate national clouds, isn't supported<li>Privileged Identity Management (PIM) feature isn't enabled, for example, just-in-time (JIT) / eligible authorization capability |  
| Azure Monitor| <!-- move content--> There is information on [this page](/azure/azure-government/compare-azure-government-global-azure#azure-monitor)) that should be put entirely on the product pages: For more information, see [Connect Operations Manager to Azure Monitor](../azure-monitor/agents/om-agents.md). |  
| [Application Insights](../azure-government/compare-azure-government-global-azure.md#application-insights)|  <!-- move content-->  Content needs to be moved to its own page. |  

### Cost Management and Billing

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure Cost Management + Billing | <li>Cost Management + Billing for cloud solution providers (CSPs)  |   


### Media

This section outlines variations and considerations when using Media services in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure Media Services | For Azure Media Services v3 feature variations in Azure Government, see [Azure Media Services v3 clouds and regions availability](/azure/media-services/latest/azure-clouds-regions#us-government-cloud).  |   

### Migration

This section outlines variations and considerations when using Migration services in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure Migrate|  <!-- move content--> Content should be in its own page. Links are provided in this page: [Azure Migrate](../azure-government/compare-azure-government-global-azure.md#azure-migrate)|   |

### Networking

This section outlines variations and considerations when using Networking services in the Azure Government environment. 

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure ExpressRoute | For an overview of how BGP communities are used with ExpressRoute in Azure Government, see [BGP community support in National Clouds](../expressroute/expressroute-routing.md#bgp-community-support-in-national-clouds). |   
| Private Link| <li>For Private Link services availability, see [Azure Private Link availability](../private-link/availability.md).<li>For Private DNS zone names, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md#government). |   
| Traffic Manager| Traffic Manager health checks can originate from certain IP addresses for Azure Government. Review the [IP addresses in the JSON file](https://azuretrafficmanagerdata.blob.core.windows.net/probes/azure-gov/probe-ip-ranges.json) to ensure that incoming connections from these IP addresses are allowed at the endpoints to check its health status. |   


### Security

This section outlines variations and considerations when using Security services in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Microsoft Defender for IoT | For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-defender-for-iot). |   
| Azure Information Protection|See [Azure Information Protection Premium Government Service Description](/azure/enterprise-mobility-security/solutions/ems-aip-premium-govt-service-description). |  |
| Microsoft Defender for Cloud | For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-defender-for-cloud). |  
| Microsoft Sentinel| For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-sentinel). |  

### Storage

This section outlines variations and considerations when using Storage services in the Azure Government environment.


| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| [Azure Managed Disks](../azure-government/compare-azure-government-global-azure.md#azure-managed-disks) | <ul><li>Zone-redundant storage (ZRS)</ul> |   
| Azure NetApp Files| For Azure NetApp Files feature availability in Azure Government and how to access the Azure NetApp Files service within Azure Government, see [Azure NetApp Files for Azure Government](../azure-netapp-files/azure-government.md). |   
| [Azure Import/Export](../azure-government/compare-azure-government-global-azure.md#azure-importexport) | With Import/Export jobs for US Gov Arizona or US Gov Texas, the mailing address is for US Gov Virginia. The data is loaded into selected storage accounts from the US Gov Virginia region. For all jobs, we recommend that you rotate your storage account keys after the job is complete to remove any access granted during the process. For more information, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md?tabs=azure-portal).|  


### Web

This section outlines variations and considerations when using Web services in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| API Management |  <ul><li>Azure AD B2C integration</ul> |   
| App Service| <ul><li>App Service Certificate resource<li>App Service Managed Certificate resource<li>App Service Domain resource<li>Deployment options: only Local Git Repository and External Repository are available</ul>   |   |
| Azure Functions|<li>When connecting your Functions app to Application Insights in Azure Government, make sure you use [APPLICATIONINSIGHTS_CONNECTION_STRING](../azure-functions/functions-app-settings.md#applicationinsights_connection_string), which lets you customize the Application Insights endpoint.  |  |

### US Government REST endpoints

To view the US Government REST endpoints, go to [Azure Government Documentation: Guidance for developers](../azure-government/compare-azure-government-global-azure.md#guidance-for-developers).



## Next steps

To start using Azure Government, see [Guidance for developers](../azure-government/documentation-government-developer-guide.md). 