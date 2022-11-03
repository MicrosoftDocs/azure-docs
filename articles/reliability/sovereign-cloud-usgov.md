---
title: Availability of services for US Government 
description: Learn how services are supported for US Government 
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 10/27/2022
ms.author: anaharris
ms.custom: references_regions
---

# Availability of services for US Government 

Azure Government services operate the same way as the corresponding services in global Azure, which is why most of the existing online Azure documentation applies equally well to Azure Government. However, there are some key differences that developers working on applications hosted in Azure Government must be aware of.

For tutorials, how-to or get started guides, and information on deployment and compliance see [Azure Government documentation](../azure-government/index.yml).

## Service availability

Microsoft's goal for Azure Government is to match service availability in Azure. For service availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). Services available in Azure Government are listed by category and whether they're Generally Available or available through Preview. If a service is available in Azure Government, that fact isn't reiterated in the rest of this article. Instead, you're encouraged to review [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true) for the latest, up-to-date information on service availability.

In general, service availability in Azure Government implies that all corresponding service features are available to you. Variations to this approach and other applicable limitations are tracked and explained in this article based on the main service categories outlined in the [online directory of Azure services](https://azure.microsoft.com/services/). Other considerations for service deployment and usage in Azure Government are also provided.



### AI + machine learning

This section outlines variations and considerations when using Azure Bot Service, Azure Machine Learning, and Cognitive Services in the Azure Government environment.

| Product | Feature variations |
|---------|------------|
| Azure Bot Service |The following features **are not** currently available:</br> <ul><li>Bot Framework Composer integration<li> Channels (due to availability of dependent services):<ul><li> Teams Channel<li> Direct Line Speech Channel<li> Telephony Channel (Preview)<li> Microsoft Search Channel (Preview)<li> Kik Channel (deprecated)</ul></ul>|
|Azure Machine learning| See [Azure Machine Learning feature availability across US Gov cloud regions](../machine-learning/reference-machine-learning-cloud-parity.md#azure-government). | |
| Cognitive Services: Content Moderator| The following features **are not** currently available:</br><li>Review UI and Review APIs ||
| Cognitive Services: Language Understanding (LUIS)|  The following features **are not** currently available:</br><li>Speech Requests<li>Prebuilt Domains ||
| Cognitive Services: Speech| See [Cognitive Services: US Gov Sovereign Cloud - Speech service](../cognitive-services/speech-service/sovereign-clouds.md?tabs=c-sharp#azure-government-united-states)  ||
| Cognitive Services: Translator|For feature variations and limitations, including API endpoints, see [Translator in sovereign clouds](../cognitive-services/translator/sovereign-clouds.md?tabs=us).|

### Analytics

This section outlines variations and considerations when using Analytics services in the Azure Government environment. 

| Product | Feature variations |
|---------|--------|
| Azure HDInsight |For secured virtual networks, you'll want to allow network security groups (NSGs) access to certain IP addresses and ports. For Azure Government, you should allow all IP addresses (all with an Allowed port of 443) in the [Network Security Groups IP address and ports table](#hdinsight-network-security-groups-ip-address-and-ports). |  |
| Power BI| See [Power BI for US government customers](/power-bi/enterprise/service-govus-overview).|  |
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

| Product | Feature variations |
|---------|--------|
| Azure Database for MySQL | The following features **are not** currently available:</br><ul><li>Advanced Threat Protection</ul> |  
| Azure Database for PostgreSQL| The following features **are not** currently available:</br><ul><li>Hyperscale (Citus) deployment option<li>The following features of the Single server deployment option<ul><li>Advanced Threat Protection<<li>Backup with long-term retention</ul></ul> |  |
| Azure SQL Managed Instance|  The following features **are not** currently available:</br><ul><li>Long-term retention</ul>  |  


### Developer Tools

This section outlines variations and considerations when using Developer tools in the Azure Government environment.

| Product |Feature variations |
|---------|--------|
| Enterprise Dev/Test subscription offer |   Enterprise Dev/Test subscription offer in existing or separate tenant is currently available only in Azure public as documented in [Azure EA portal administration](/azure/cost-management-billing/manage/ea-portal-administration#enterprise-devtest-offer). |  

### Identity

This section outlines variations and considerations when using Identity services in the Azure Government environment.

| Product | Feature variations |
|---------|--------|
| Azure Active Directory Premium P1 and P2 |  The following features **have known limitations** :</br><ul><li>B2B Collaboration in supported Azure US Government tenants:<ul><li>For more information about B2B collaboration limitations in Azure Government and to find out if B2B collaboration is available in your Azure Government tenant, see [Azure AD B2B in government and national clouds](../active-directory/external-identities/b2b-government-national-clouds.md). <li>B2B collaboration via Power BI isn't supported. When you invite a guest user from within Power BI, the B2B flow isn't used and the guest user won't appear in the tenant's user list. If a guest user is invited through other means, they'll appear in the Power BI user list, but any sharing request to the user will fail and display a 403 Forbidden error.</ul><li>Multi-factor authentication:<ul><li>Trusted IPs isn't supported in Azure Government. Instead, use Conditional Access policies with named locations to establish when multi-factor authentication should and shouldn't be required based off the user's current IP address. </ul></ul><p>For more information, see [Azure Active Directory feature availability for US Gov](../active-directory/authentication/feature-availability.md).| |

### Management and Governance

This section outlines variations and considerations when using Management and Governance services in the Azure Government environment. 

| Product | Feature variations|
|---------|--------|
| Automation|  The following features **are not** currently available:</br><li>Automation analytics solution |  
| Azure Advisor| See [Azure Advisor](/azure/azure-government/compare-azure-government-global-azure#azure-advisor) |  |
| Azure Lighthouse|  The following features **are not** currently available:</br><li>Managed Service offers published to Azure Marketplace<li>Delegation of subscriptions across a national cloud and the Azure public cloud, or across two separate national clouds, isn't supported<li>Privileged Identity Management (PIM) feature isn't enabled, for example, just-in-time (JIT) / eligible authorization capability |  
| Azure Monitor| <!-- move content--> There is information on [this page](/azure/azure-government/compare-azure-government-global-azure#azure-monitor)) that should be put entirely on the product pages: For more information, see [Connect Operations Manager to Azure Monitor](../azure-monitor/agents/om-agents.md). |  
| [Application Insights](../azure-government/compare-azure-government-global-azure.md#application-insights)|  <!-- move content-->  Content needs to be moved to its own page. |  

### Cost Management and Billing

| Product | Unsupported, limited, and/or modified features |
|---------|--------|
| Azure Cost Management + Billing | Cost Management + Billing for cloud solution providers (CSPs)  |   


### Media

This section outlines variations and considerations when using Media services in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features |
|---------|--------|
| Azure Media Services | For Azure Media Services v3 feature variations in Azure Government, see [Azure Media Services v3 clouds and regions availability](/azure/media-services/latest/azure-clouds-regions#us-government-cloud).  |   

### Migration

This section outlines variations and considerations when using Migration services in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features |
|---------|--------|
| Azure Migrate|  <!-- move content--> Content should be in its own page. Links are provided in this page: [Azure Migrate](../azure-government/compare-azure-government-global-azure.md#azure-migrate)|   |

### Networking

This section outlines variations and considerations when using Networking services in the Azure Government environment. 

| Product | Unsupported, limited, and/or modified features 
|---------|--------|
| Azure ExpressRoute | For an overview of how BGP communities are used with ExpressRoute in Azure Government, see [BGP community support in National Clouds](../expressroute/expressroute-routing.md#bgp-community-support-in-national-clouds). |   
| Private Link| <li>For Private Link services availability, see [Azure Private Link availability](../private-link/availability.md).<li>For Private DNS zone names, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md#government). |   
| Traffic Manager| Traffic Manager health checks can originate from certain IP addresses for Azure Government. Review the [IP addresses in the JSON file](https://azuretrafficmanagerdata.blob.core.windows.net/probes/azure-gov/probe-ip-ranges.json) to ensure that incoming connections from these IP addresses are allowed at the endpoints to check its health status. |   


### Security

This section outlines variations and considerations when using Security services in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features |
|---------|--------|
| Microsoft Defender for IoT | For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-defender-for-iot). |   
| Azure Information Protection|See [Azure Information Protection Premium Government Service Description](/azure/enterprise-mobility-security/solutions/ems-aip-premium-govt-service-description). |  |
| Microsoft Defender for Cloud | For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-defender-for-cloud). |  
| Microsoft Sentinel| For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-sentinel). |  

### Storage

This section outlines variations and considerations when using Storage services in the Azure Government environment.


| Product | Unsupported, limited, and/or modified features |
|---------|--------|
| [Azure Managed Disks](../azure-government/compare-azure-government-global-azure.md#azure-managed-disks) | <ul><li>Zone-redundant storage (ZRS)</ul> |   
| Azure NetApp Files| For Azure NetApp Files feature availability in Azure Government and how to access the Azure NetApp Files service within Azure Government, see [Azure NetApp Files for Azure Government](../azure-netapp-files/azure-government.md). |   
| [Azure Import/Export](../azure-government/compare-azure-government-global-azure.md#azure-importexport) | With Import/Export jobs for US Gov Arizona or US Gov Texas, the mailing address is for US Gov Virginia. The data is loaded into selected storage accounts from the US Gov Virginia region. For all jobs, we recommend that you rotate your storage account keys after the job is complete to remove any access granted during the process. For more information, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md?tabs=azure-portal).|  


### Web

This section outlines variations and considerations when using Web services in the Azure Government environment.

| Product | Unsupported, limited, and/or modified features |
|---------|--------|
| API Management |  <ul><li>Azure AD B2C integration</ul> |   
| App Service| <ul><li>App Service Certificate resource<li>App Service Managed Certificate resource<li>App Service Domain resource<li>Deployment options: only Local Git Repository and External Repository are available</ul>   |   |
| Azure Functions|<li>When connecting your Functions app to Application Insights in Azure Government, make sure you use [APPLICATIONINSIGHTS_CONNECTION_STRING](../azure-functions/functions-app-settings.md#applicationinsights_connection_string), which lets you customize the Application Insights endpoint.  |  |


## US Government Cloud REST endpoints

> [!NOTE]
> This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [**Introducing the new Azure PowerShell Az module**](/powershell/azure/new-azureps-module-az). For Az module installation instructions, see [**Install the Azure Az PowerShell module**](/powershell/azure/install-az-ps).

You can use AzureCLI or PowerShell to obtain Azure Government endpoints for services that you've provisioned:

- Use **Azure CLI** to run the [az cloud show](/cli/azure/cloud#az-cloud-show) command and provide `AzureUSGovernment` as the name of the target cloud environment. For example,

  ```azurecli
  az cloud show --name AzureUSGovernment
  ```

  should get you different endpoints for Azure Government.

- Use a **PowerShell** cmdlet such as [Get-AzEnvironment](/powershell/module/az.accounts/get-azenvironment) to get endpoints and metadata for an instance of Azure service. For example,

  ```powershell
  Get-AzEnvironment -Name AzureUSGovernment
  ```

  should get you properties for Azure Government. This cmdlet gets environments from your subscription data file.


The table below lists API endpoints in Azure vs. Azure Government for accessing and managing some of the more common services. If you've provisioned a service that isn't listed in the table below, see the Azure CLI and PowerShell examples above for suggestions on how to obtain the corresponding Azure Government endpoint.

</br>

|Service category|Service name|Azure Public|Azure Government|Notes|
|-----------|-----------|-------|----------|----------------------|
|**AI + machine learning**|Azure Bot Service|botframework.com|botframework.azure.us||
||Azure Form Recognizer|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Computer Vision|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Custom Vision|cognitiveservices.azure.com|cognitiveservices.azure.us </br>[Portal](https://www.customvision.azure.us/)||
||Content Moderator|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Face API|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Language Understanding|cognitiveservices.azure.com|cognitiveservices.azure.us </br>[Portal](https://luis.azure.us/)|Part of [Cognitive Services for Language](../cognitive-services/language-service/index.yml)|
||Personalizer|cognitiveservices.azure.com|cognitiveservices.azure.us||
||QnA Maker|cognitiveservices.azure.com|cognitiveservices.azure.us|Part of [Cognitive Services for Language](../cognitive-services/language-service/index.yml)|
||Speech service|See [STT API docs](../cognitive-services/speech-service/rest-speech-to-text-short.md#regions-and-endpoints)|[Speech Studio](https://speech.azure.us/)</br></br>See [Speech service endpoints](../cognitive-services/Speech-Service/sovereign-clouds.md)</br></br>**Speech translation endpoints**</br>Virginia: `https://usgovvirginia.s2s.speech.azure.us`</br>Arizona: `https://usgovarizona.s2s.speech.azure.us`</br>||
||Text Analytics|cognitiveservices.azure.com|cognitiveservices.azure.us|Part of [Cognitive Services for Language](../cognitive-services/language-service/index.yml)|
||Translator|See [Translator API docs](../cognitive-services/translator/reference/v3-0-reference.md#base-urls)|cognitiveservices.azure.us||
|**Analytics**|Azure HDInsight|azurehdinsight.net|azurehdinsight.us||
||Event Hubs|servicebus.windows.net|servicebus.usgovcloudapi.net||
||Power BI|app.powerbi.com|app.powerbigov.us|[Power BI US Gov](https://powerbi.microsoft.com/documentation/powerbi-service-govus-overview/)|
|**Compute**|Batch|batch.azure.com|batch.usgovcloudapi.net||
||Cloud Services|cloudapp.net|usgovcloudapp.net||
|**Containers**|Azure Service Fabric|cloudapp.azure.com|cloudapp.usgovcloudapi.net||
||Container Registry|azurecr.io|azurecr.us||
|**Databases**|Azure Cache for Redis|redis.cache.windows.net|redis.cache.usgovcloudapi.net|See [How to connect to other clouds](../azure-cache-for-redis/cache-how-to-manage-redis-cache-powershell.md#how-to-connect-to-other-clouds)|
||Azure Cosmos DB|documents.azure.com|documents.azure.us||
||Azure Database for MariaDB|mariadb.database.azure.com|mariadb.database.usgovcloudapi.net||
||Azure Database for MySQL|mysql.database.azure.com|mysql.database.usgovcloudapi.net||
||Azure Database for PostgreSQL|postgres.database.azure.com|postgres.database.usgovcloudapi.net||
||Azure SQL Database|database.windows.net|database.usgovcloudapi.net||
|**Identity**|Azure AD|login.microsoftonline.com|login.microsoftonline.us||
|||certauth.login.microsoftonline.com|certauth.login.microsoftonline.us||
|||passwordreset.microsoftonline.com|passwordreset.microsoftonline.us||
|**Integration**|Service Bus|servicebus.windows.net|servicebus.usgovcloudapi.net||
|**Internet of Things**|Azure IoT Hub|azure-devices.net|azure-devices.us||
||Azure Maps|atlas.microsoft.com|atlas.azure.us||
||Notification Hubs|servicebus.windows.net|servicebus.usgovcloudapi.net||
|**Management and governance**|Azure Automation|azure-automation.net|azure-automation.us||
||Azure Monitor|mms.microsoft.com|oms.microsoft.us|Log Analytics workspace portal|
|||ods.opinsights.azure.com|ods.opinsights.azure.us|[Data collector API](../azure-monitor/logs/data-collector-api.md)|
|||oms.opinsights.azure.com|oms.opinsights.azure.us||
|||portal.loganalytics.io|portal.loganalytics.us||
|||api.loganalytics.io|api.loganalytics.us||
|||docs.loganalytics.io|docs.loganalytics.us||
|||adx.monitor.azure.com|adx.monitor.azure.us|[Data Explorer queries](/azure/data-explorer/query-monitor-data)|
||Azure Resource Manager|management.azure.com|management.usgovcloudapi.net||
||Cost Management|consumption.azure.com|consumption.azure.us||
||Gallery URL|gallery.azure.com|gallery.azure.us||
||Microsoft Azure portal|portal.azure.com|portal.azure.us||
||Microsoft Intune|enterpriseregistration.windows.net|enterpriseregistration.microsoftonline.us|Enterprise registration|
|||manage.microsoft.com|manage.microsoft.us|Enterprise enrollment|
|**Migration**|Azure Site Recovery|hypervrecoverymanager.windowsazure.com|hypervrecoverymanager.windowsazure.us|Site Recovery service|
|||backup.windowsazure.com|backup.windowsazure.us|Protection service|
|||blob.core.windows.net|blob.core.usgovcloudapi.net|Storing VM snapshots|
|**Networking**|Traffic Manager|trafficmanager.net|usgovtrafficmanager.net||
|**Security**|Key Vault|vault.azure.net|vault.usgovcloudapi.net||
|**Storage**|Azure Backup|backup.windowsazure.com|backup.windowsazure.us||
||Blob|blob.core.windows.net|blob.core.usgovcloudapi.net||
||Queue|queue.core.windows.net|queue.core.usgovcloudapi.net||
||Table|table.core.windows.net|table.core.usgovcloudapi.net||
||File|file.core.windows.net|file.core.usgovcloudapi.net||
|**Virtual desktop infrastructure**|Azure Virtual Desktop|See [AVD docs](../virtual-desktop/safe-url-list.md)|See [AVD docs](../virtual-desktop/safe-url-list.md)||
|**Web**|API Management|management.azure.com|management.usgovcloudapi.net||
||API Management Gateway|azure-api.net|azure-api.us||
||API Management management|management.azure-api.net|management.azure-api.us||
||API Management Portal|portal.azure-api.net|portal.azure-api.us||
||App Configuration|azconfig.io|azconfig.azure.us||
||App Service|azurewebsites.net|azurewebsites.us||
||Azure Cognitive Search|search.windows.net|search.windows.us||
||Azure Functions|azurewebsites.net|azurewebsites.us||



## Next steps

To start using Azure Government, see [Guidance for developers](../azure-government/documentation-government-developer-guide.md). 