---
title: Compare Azure Government and global Azure
description: Describe feature differences between Azure Government and global Azure.
ms.service: azure-government
ms.topic: article
author: EliotSeattle
ms.author: eliotgra
ms.custom: references_regions
recommendations: false
ms.date: 06/08/2023
---

# Compare Azure Government and global Azure

Microsoft Azure Government uses same underlying technologies as global Azure, which includes the core components of [Infrastructure-as-a-Service (IaaS)](https://azure.microsoft.com/overview/what-is-iaas/), [Platform-as-a-Service (PaaS)](https://azure.microsoft.com/overview/what-is-paas/), and [Software-as-a-Service (SaaS)](https://azure.microsoft.com/overview/what-is-saas/). Both Azure and Azure Government have the same comprehensive security controls in place and the same Microsoft commitment on the safeguarding of customer data. Whereas both cloud environments are assessed and authorized at the FedRAMP High impact level, Azure Government provides an extra layer of protection to customers through contractual commitments regarding storage of customer data in the United States and limiting potential access to systems processing customer data to [screened US persons](./documentation-government-plan-security.md#screening). These commitments may be of interest to customers using the cloud to store or process data subject to US export control regulations.

## Export control implications

You're responsible for designing and deploying your applications to meet [US export control requirements](./documentation-government-overview-itar.md) such as the requirements prescribed in the EAR, ITAR, and DoE 10 CFR Part 810. In doing so, you shouldn't include sensitive or restricted information in Azure resource names, as explained in [Considerations for naming Azure resources](./documentation-government-concept-naming-resources.md).

## Guidance for developers

Most of the currently available technical content assumes that applications are being developed on global Azure rather than on Azure Government. For this reason, it’s important to be aware of two key differences in applications that you develop for hosting in Azure Government.

- Certain services and features that are in specific regions of global Azure might not be available in Azure Government.

- Feature configurations in Azure Government might differ from those in global Azure.

Therefore, it's important to review your sample code and configurations to ensure that you are building within the Azure Government cloud services environment.

For more information, see [Azure Government developer guide](./documentation-government-developer-guide.md). 

> [!NOTE]
> This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [**Introducing the new Azure PowerShell Az module**](/powershell/azure/new-azureps-module-az). For Az module installation instructions, see [**Install the Azure Az PowerShell module**](/powershell/azure/install-azure-powershell).

You can use AzureCLI or PowerShell to obtain Azure Government endpoints for services you provisioned:

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

Table below lists API endpoints in Azure vs. Azure Government for accessing and managing some of the more common services. If you provisioned a service that isn't listed in the table below, see the Azure CLI and PowerShell examples above for suggestions on how to obtain the corresponding Azure Government endpoint.

</br>

|Service category|Service name|Azure Public|Azure Government|Notes|
|-----------|-----------|-------|----------|----------------------|
|**AI + machine learning**|Azure Bot Service|botframework.com|botframework.azure.us||
||Azure AI Document Intelligence|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Computer Vision|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Custom Vision|cognitiveservices.azure.com|cognitiveservices.azure.us </br>[Portal](https://www.customvision.azure.us/)||
||Content Moderator|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Face API|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Language Understanding|cognitiveservices.azure.com|cognitiveservices.azure.us </br>[Portal](https://luis.azure.us/)|Part of [Azure AI Language](../ai-services/language-service/index.yml)|
||Personalizer|cognitiveservices.azure.com|cognitiveservices.azure.us||
||QnA Maker|cognitiveservices.azure.com|cognitiveservices.azure.us|Part of [Azure AI Language](../ai-services/language-service/index.yml)|
||Speech service|See [STT API docs](../ai-services/speech-service/rest-speech-to-text-short.md#regions-and-endpoints)|[Speech Studio](https://speech.azure.us/)</br></br>See [Speech service endpoints](../ai-services/Speech-Service/sovereign-clouds.md)</br></br>**Speech translation endpoints**</br>Virginia: `https://usgovvirginia.s2s.speech.azure.us`</br>Arizona: `https://usgovarizona.s2s.speech.azure.us`</br>||
||Text Analytics|cognitiveservices.azure.com|cognitiveservices.azure.us|Part of [Azure AI Language](../ai-services/language-service/index.yml)|
||Translator|See [Translator API docs](../ai-services/translator/reference/v3-0-reference.md#base-urls)|cognitiveservices.azure.us||
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
|**Identity**|Microsoft Entra ID|login.microsoftonline.com|login.microsoftonline.us||
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

## Service availability

Microsoft's goal for Azure Government is to match service availability in Azure. For service availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). Services available in Azure Government are listed by category and whether they're Generally Available or available through Preview. If a service is available in Azure Government, that fact isn't reiterated in the rest of this article. Instead, you're encouraged to review [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true) for the latest, up-to-date information on service availability.

In general, service availability in Azure Government implies that all corresponding service features are available to you. Variations to this approach and other applicable limitations are tracked and explained in this article based on the main service categories outlined in the [online directory of Azure services](https://azure.microsoft.com/services/). Other considerations for service deployment and usage in Azure Government are also provided.

## AI + machine learning

This section outlines variations and considerations when using **Azure Bot Service**, **Azure Machine Learning**, and **Cognitive Services** in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=machine-learning-service,bot-service,cognitive-services&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [Azure Bot Service](/azure/bot-service/)

The following Azure Bot Service **features aren't currently available** in Azure Government:

- Bot Framework Composer integration
- Channels (due to availability of dependent services)
  - Direct Line Speech Channel
  - Telephony Channel (Preview)
  - Microsoft Search Channel (Preview)
  - Kik Channel (deprecated)

For information on how to deploy Bot Framework and Azure Bot Service bots to Azure Government, see [Configure Bot Framework bots for US Government customers](/azure/bot-service/how-to-deploy-gov-cloud-high).

### [Azure Machine Learning](../machine-learning/index.yml)

For feature variations and limitations, see [Azure Machine Learning feature availability across cloud regions](../machine-learning/reference-machine-learning-cloud-parity.md).

<a name='cognitive-services-content-moderator'></a>

### [Azure AI services: Content Moderator](../ai-services/content-moderator/index.yml)

The following Content Moderator **features aren't currently available** in Azure Government:

- Review UI and Review APIs.

<a name='cognitive-services-language-understanding-luis'></a>

### [Azure AI Language Understanding (LUIS)](../ai-services/luis/index.yml)

The following Language Understanding **features aren't currently available** in Azure Government:

- Speech Requests
- Prebuilt Domains

Azure AI Language Understanding (LUIS) is part of [Azure AI Language](../ai-services/language-service/index.yml).

<a name='cognitive-services-speech'></a>

### [Azure AI Speech](../ai-services/speech-service/index.yml)

For feature variations and limitations, including API endpoints, see [Speech service in sovereign clouds](../ai-services/speech-service/sovereign-clouds.md).

<a name='cognitive-services-translator'></a>

### [Azure AI services: Translator](../ai-services/translator/index.yml)

For feature variations and limitations, including API endpoints, see [Translator in sovereign clouds](../ai-services/translator/sovereign-clouds.md).

## Analytics

This section outlines variations and considerations when using Analytics services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=data-share,power-bi-embedded,analysis-services,event-hubs,data-lake-analytics,storage,data-catalog,data-factory,synapse-analytics,stream-analytics,databricks,hdinsight&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [Azure HDInsight](../hdinsight/index.yml)

For secured virtual networks, you'll want to allow network security groups (NSGs) access to certain IP addresses and ports. For Azure Government, you should allow the following IP addresses (all with an Allowed port of 443):

|**Region**|**Allowed IP addresses**|**Allowed port**|
|------|--------------------|------------|
|US DoD Central|52.180.249.174 </br> 52.180.250.239|443|
|US DoD East|52.181.164.168 </br>52.181.164.151|443|
|US Gov Texas|52.238.116.212 </br> 52.238.112.86|443|
|US Gov Virginia|13.72.49.126 </br> 13.72.55.55 </br> 13.72.184.124 </br> 13.72.190.110| 443|
|US Gov Arizona|52.127.3.176 </br> 52.127.3.178| 443|

For a demo on how to build data-centric solutions on Azure Government using HDInsight, see Azure AI services, HDInsight, and Power BI on Azure Government.

### [Power BI](/power-bi/fundamentals/)

For usage guidance, feature variations, and limitations, see [Power BI for US government customers](/power-bi/admin/service-govus-overview). For a demo on how to build data-centric solutions on Azure Government using Power BI, see Azure AI services, HDInsight, and Power BI on Azure Government.

### [Power BI Embedded](/power-bi/developer/embedded/)

To learn how to embed analytical content within your business process application, see [Tutorial: Embed a Power BI content into your application for national clouds](/power-bi/developer/embedded/embed-sample-for-customers-national-clouds).

## Databases

This section outlines variations and considerations when using Databases services in the Azure Government environment.  For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-api-for-fhir,data-factory,sql-server-stretch-database,redis-cache,database-migration,synapse-analytics,postgresql,mariadb,mysql,sql-database,cosmos-db&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [Azure Database for MySQL](../mysql/index.yml)

The following Azure Database for MySQL **features aren't currently available** in Azure Government:

- Advanced Threat Protection

### [Azure Database for PostgreSQL](../postgresql/index.yml)

For Flexible Server availability in Azure Government regions, see [Azure Database for PostgreSQL – Flexible Server](../postgresql/flexible-server/overview.md#azure-regions).

The following Azure Database for PostgreSQL **features aren't currently available** in Azure Government:

- Azure Cosmos DB for PostgreSQL, formerly Azure Database for PostgreSQL – Hyperscale (Citus). For more information about supported regions, see [Regional availability for Azure Cosmos DB for PostgreSQL](../cosmos-db/postgresql/resources-regions.md).
- The following features of the Single Server deployment option
  - Advanced Threat Protection
  - Backup with long-term retention

## Developer tools

This section outlines variations and considerations when using Developer tools in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=load-testing,app-configuration,devtest-lab,lab-services,azure-devops&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [Enterprise Dev/Test subscription offer](https://azure.microsoft.com/offers/ms-azr-0148p/)

- Enterprise Dev/Test subscription offer in existing or separate tenant is currently available only in Azure public as documented in [Azure EA portal administration](../cost-management-billing/manage/ea-portal-administration.md#enterprise-devtest-offer).

## Identity

This section outlines variations and considerations when using Identity services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=information-protection,active-directory-ds,active-directory&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

<a name='azure-active-directory-premium-p1-and-p2'></a>

### [Microsoft Entra ID P1 and P2](../active-directory/index.yml)

For feature variations and limitations, see [Cloud feature availability](../active-directory/authentication/feature-availability.md).

For information on how to use Power BI capabilities for collaboration between Azure and Azure Government, see [Cross-cloud B2B](/power-bi/enterprise/service-admin-azure-ad-b2b#cross-cloud-b2b).

The following features have known limitations in Azure Government:

- Limitations with B2B Collaboration in supported Azure US Government tenants:
  - For more information about B2B collaboration limitations in Azure Government and to find out if B2B collaboration is available in your Azure Government tenant, see [Microsoft Entra B2B in government and national clouds](../active-directory/external-identities/b2b-government-national-clouds.md).

- Limitations with multi-factor authentication:
    - Trusted IPs isn't supported in Azure Government. Instead, use Conditional Access policies with named locations to establish when multi-factor authentication should and shouldn't be required based off the user's current IP address.

### [Azure Active Directory B2C](../active-directory-b2c/index.yml)

Azure Active Directory B2C is **not available** in Azure Government.

### [Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-overview.md)

The Microsoft Authentication Library (MSAL) enables developers to acquire security tokens from the Microsoft identity platform to authenticate users and access secured web APIs. For feature variations and limitations, see [National clouds and MSAL](../active-directory/develop/msal-national-cloud.md).

## Management and governance

This section outlines variations and considerations when using Management and Governance services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=managed-applications,azure-policy,network-watcher,monitor,traffic-manager,automation,scheduler,site-recovery,cost-management,backup,blueprints,advisor&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [Automation](../automation/index.yml)

The following Automation **features aren't currently available** in Azure Government:

- Automation analytics solution

### [Azure Advisor](../advisor/index.yml)

For feature variations and limitations, see [Azure Advisor in sovereign clouds](../advisor/advisor-sovereign-clouds.md).

### [Azure Lighthouse](../lighthouse/index.yml)

The following Azure Lighthouse **features aren't currently available** in Azure Government:

- Managed Service offers published to Azure Marketplace
- Delegation of subscriptions across a national cloud and the Azure public cloud, or across two separate national clouds, isn't supported
- Privileged Identity Management (PIM) feature isn't enabled, for example, just-in-time (JIT) / eligible authorization capability

### [Azure Monitor](../azure-monitor/index.yml)

Azure Monitor enables the same features in both Azure and Azure Government.

- System Center Operations Manager 2019 is supported equally well in both Azure and Azure Government.

The following options are available for previous versions of System Center Operations Manager:

- Integrating System Center Operations Manager 2016 with Azure Government requires an updated Advisor management pack that is included with Update Rollup 2 or later.
- System Center Operations Manager 2012 R2 requires an updated Advisor management pack included with Update Rollup 3 or later.

For more information, see [Connect Operations Manager to Azure Monitor](../azure-monitor/agents/om-agents.md).

**Frequently asked questions**

- Can I migrate data from Azure Monitor logs in Azure to Azure Government?
  - No. It isn't possible to move data or your workspace from Azure to Azure Government.
- Can I switch between Azure and Azure Government workspaces from the Operations Management Suite portal?
  - No. The portals for Azure and Azure Government are separate and don't share information.

#### [Application Insights](../azure-monitor/app/app-insights-overview.md)

Application Insights (part of Azure Monitor) enables the same features in both Azure and Azure Government. This section describes the supplemental configuration that is required to use Application Insights in Azure Government.

**Visual Studio** – In Azure Government, you can enable monitoring on your ASP.NET, ASP.NET Core, Java, and Node.js based applications running on Azure App Service. For more information, see [Application monitoring for Azure App Service overview](../azure-monitor/app/azure-web-apps.md). In Visual Studio, go to Tools|Options|Accounts|Registered Azure Clouds|Add New Azure Cloud and select Azure US Government as the Discovery endpoint. After that, adding an account in File|Account Settings will prompt you for which cloud you want to add from.

**SDK endpoint modifications** – In order to send data from Application Insights to an Azure Government region, you'll need to modify the default endpoint addresses that are used by the Application Insights SDKs. Each SDK requires slightly different modifications, as described in [Application Insights overriding default endpoints](/previous-versions/azure/azure-monitor/app/create-new-resource#override-default-endpoints).

**Firewall exceptions** – Application Insights uses several IP addresses. You might need to know these addresses if the app that you're monitoring is hosted behind a firewall. For more information, see [IP addresses used by Azure Monitor](../azure-monitor/app/ip-addresses.md) from where you can download Azure Government IP addresses.

>[!NOTE]
>Although these addresses are static, it's possible that we'll need to change them from time to time. All Application Insights traffic represents outbound traffic except for availability monitoring and webhooks, which require inbound firewall rules.

You need to open some **outgoing ports** in your server's firewall to allow the Application Insights SDK and/or Status Monitor to send data to the portal:

|Purpose|URL|IP address|Ports|
|-------|---|----------|-----|
|Telemetry|dc.applicationinsights.us|23.97.4.113|443|

### [Cost Management and Billing](../cost-management-billing/index.yml)

The following Azure Cost Management + Billing **features aren't currently available** in Azure Government:

- Cost Management + Billing for cloud solution providers (CSPs)

## Media

This section outlines variations and considerations when using Media services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=cdn,media-services&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [Media Services](/azure/media-services/)

For Azure Media Services v3 feature variations in Azure Government, see [Azure Media Services v3 clouds and regions availability](/azure/media-services/latest/azure-clouds-regions#us-government-cloud).

## Migration

This section outlines variations and considerations when using Migration services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=database-migration,cost-management,azure-migrate,site-recovery&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [Azure Migrate](../migrate/index.yml)

The following Azure Migrate **features aren't currently available** in Azure Government:

- Containerizing Java Web Apps on Apache Tomcat (on Linux servers) and deploying them on Linux containers on App Service.
- Containerizing Java Web Apps on Apache Tomcat (on Linux servers) and deploying them on Linux containers on Azure Kubernetes Service (AKS).
- Containerizing ASP.NET apps and deploying them on Windows containers on AKS.
- Containerizing ASP.NET apps and deploying them on Windows containers on App Service.
- You can only create assessments for Azure Government as target regions and using Azure Government offers.

For more information, see [Azure Migrate support matrix](../migrate/migrate-support-matrix.md#azure-government). For a list of Azure Government URLs needed by the Azure Migrate appliance when connecting to the internet, see [Azure Migrate appliance URL access](../migrate/migrate-appliance.md#url-access).

## Networking

This section outlines variations and considerations when using Networking services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-bastion,frontdoor,virtual-wan,dns,ddos-protection,cdn,azure-firewall,network-watcher,load-balancer,vpn-gateway,expressroute,application-gateway,virtual-network&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [Azure ExpressRoute](../expressroute/index.yml)

For an overview of ExpressRoute, see [What is Azure ExpressRoute?](../expressroute/expressroute-introduction.md). For an overview of how **BGP communities** are used with ExpressRoute in Azure Government, see [BGP community support in National Clouds](../expressroute/expressroute-routing.md#bgp-community-support-in-national-clouds).

### [Azure Front Door](../frontdoor/index.yml)

Azure Front Door Standard and Premium tiers are available in public preview in Azure Government regions US Gov Arizona and US Gov Texas. During public preview, the following Azure Front Door **features aren't supported** in Azure Government:

- Managed certificate for enabling HTTPS; instead, you need to use your own certificate.
- [Migration](../frontdoor/tier-migration.md) from classic to Standard/Premium tier.
- [Managed identity integration](../frontdoor/managed-identity.md) for Azure Front Door Standard/Premium access to Azure Key Vault for your own certificate.
- [Tier upgrade](../frontdoor/tier-upgrade.md) from Standard to Premium.
- Web Application Firewall (WAF) policies creation via WAF portal extension; instead, WAF policies can be created via Azure Front Door Standard/Premium portal extension. Updates and deletions to WAF policies and rules are supported on WAF portal extension.

### [Private Link](../private-link/index.yml)

- For Private Link services availability, see [Azure Private Link availability](../private-link/availability.md).
- For Private DNS zone names, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md#government).

### [Traffic Manager](../traffic-manager/index.yml)

Traffic Manager health checks can originate from certain IP addresses for Azure Government. Review the [IP addresses in the JSON file](https://azuretrafficmanagerdata.blob.core.windows.net/probes/azure-gov/probe-ip-ranges.json) to ensure that incoming connections from these IP addresses are allowed at the endpoints to check its health status.

## Security

This section outlines variations and considerations when using Security services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=payment-hsm,azure-sentinel,azure-dedicated-hsm,information-protection,application-gateway,vpn-gateway,security-center,key-vault,active-directory-ds,ddos-protection,active-directory&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/)

For feature variations and limitations, see [Microsoft Defender for Endpoint for US Government customers](/microsoft-365/security/defender-endpoint/gov).

### [Microsoft Defender for IoT](../defender-for-iot/index.yml)

For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-defender-for-iot).

### [Azure Information Protection](/azure/information-protection/)

Azure Information Protection Premium is part of the [Enterprise Mobility + Security](/enterprise-mobility-security) suite. For details on this service and how to use it, see [Azure Information Protection Premium Government Service Description](/enterprise-mobility-security/solutions/ems-aip-premium-govt-service-description).

### [Microsoft Defender for Cloud](../defender-for-cloud/index.yml)

For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-defender-for-cloud).

### [Microsoft Sentinel](../sentinel/index.yml)

For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-sentinel).

## Storage

This section outlines variations and considerations when using Storage services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=hpc-cache,managed-disks,storsimple,backup,storage&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [Azure NetApp Files](../azure-netapp-files/index.yml)

For Azure NetApp Files feature availability in Azure Government and how to access the Azure NetApp Files service within Azure Government, see [Azure NetApp Files for Azure Government](../azure-netapp-files/azure-government.md).

### [Azure Import/Export](../import-export/index.yml)

With Import/Export jobs for US Gov Arizona or US Gov Texas, the mailing address is for US Gov Virginia. The data is loaded into selected storage accounts from the US Gov Virginia region. For all jobs, we recommend that you rotate your storage account keys after the job is complete to remove any access granted during the process. For more information, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md).

## Web

This section outlines variations and considerations when using Web services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud,signalr-service,api-management,notification-hubs,search,cdn,app-service-linux,app-service&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### [API Management](../api-management/index.yml)

The following API Management **features aren't currently available** in Azure Government:

- Azure AD B2C integration

### [App Service](../app-service/index.yml)

The following App Service **resources aren't currently available** in Azure Government:

- App Service Certificate
- App Service Managed Certificate
- App Service Domain

The following App Service **features aren't currently available** in Azure Government:

- Deployment
  - Deployment options: only Local Git Repository and External Repository are available

### [Azure Functions](../azure-functions/index.yml)

When connecting your Functions app to Application Insights in Azure Government, make sure you use [`APPLICATIONINSIGHTS_CONNECTION_STRING`](../azure-functions/functions-app-settings.md#applicationinsights_connection_string), which lets you customize the Application Insights endpoint.

## Next steps

Learn more about Azure Government:

- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Azure Government overview](./documentation-government-welcome.md)
- [Azure support for export controls](./documentation-government-overview-itar.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Azure Government security](./documentation-government-plan-security.md)
- [Azure guidance for secure isolation](./azure-secure-isolation-guidance.md)

Start using Azure Government:

- [Guidance for developers](./documentation-government-developer-guide.md)
- [Connect with the Azure Government portal](./documentation-government-get-started-connect-with-portal.md)
