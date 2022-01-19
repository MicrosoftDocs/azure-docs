---
title: Compare Azure Government and global Azure
description: Describe feature differences between Azure Government and global Azure.
ms.service: azure-government
ms.topic: article
author: stevevi
ms.author: stevevi
ms.custom: references_regions
recommendations: false
ms.date: 12/07/2021
---

# Compare Azure Government and global Azure

Microsoft Azure Government uses same underlying technologies as global Azure, which includes the core components of [Infrastructure-as-a-Service (IaaS)](https://azure.microsoft.com/overview/what-is-iaas/), [Platform-as-a-Service (PaaS)](https://azure.microsoft.com/overview/what-is-paas/), and [Software-as-a-Service (SaaS)](https://azure.microsoft.com/overview/what-is-saas/). Both Azure and Azure Government have the same comprehensive security controls in place and the same Microsoft commitment on the safeguarding of customer data. Whereas both cloud environments are assessed and authorized at the FedRAMP High impact level, Azure Government provides an extra layer of protection to customers through contractual commitments regarding storage of customer data in the United States and limiting potential access to systems processing customer data to [screened US persons](./documentation-government-plan-security.md#screening). These commitments may be of interest to customers using the cloud to store or process data subject to US export control regulations.

## Export control implications

You are responsible for designing and deploying your applications to meet [US export control requirements](./documentation-government-overview-itar.md) such as the requirements prescribed in the EAR, ITAR, and DoE 10 CFR Part 810. In doing so, you should not include sensitive or restricted information in Azure resource names, as explained in [Considerations for naming Azure resources](./documentation-government-concept-naming-resources.md).

## Guidance for developers

Azure Government services operate the same way as the corresponding services in global Azure, which is why most of the existing online Azure documentation applies equally well to Azure Government. However, there are some key differences that developers working on applications hosted in Azure Government must be aware of. For more information, see [Guidance for developers](./documentation-government-developer-guide.md). As a developer, you must know how to connect to Azure Government and once you connect you will mostly have the same experience as in global Azure.

> [!NOTE]
> This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [**Introducing the new Azure PowerShell Az module**](/powershell/azure/new-azureps-module-az). For Az module installation instructions, see [**Install the Azure Az PowerShell module**](/powershell/azure/install-az-ps).

You can use AzureCLI or PowerShell to obtain Azure Government endpoints for services you provisioned:

- Use **Azure CLI** to run the [az cloud show](/cli/azure/cloud#az_cloud_show) command and provide `AzureUSGovernment` as the name of the target cloud environment. For example,

  ```azurecli
  az cloud show --name AzureUSGovernment
  ```

  should get you different endpoints for Azure Government.

- Use a **PowerShell** cmdlet such as [Get-AzureEnvironment](/powershell/module/servicemanagement/azure.service/get-azureenvironment) to get endpoints and metadata for an instance of Azure service. For example,

  ```powershell
  Get-AzureEnvironment -Name AzureUSGovernment
  ```

  should get you properties for Azure Government. This cmdlet gets environments from your subscription data file.

Table below lists API endpoints in Azure vs. Azure Government for accessing and managing some of the more common services. If you provisioned a service that isn't listed in the table below, see the Azure CLI and PowerShell examples above for suggestions on how to obtain the corresponding Azure Government endpoint.

</br>

|Service category|Service name|Azure Public|Azure Government|Notes|
|-----------|-----------|-------|----------|----------------------|
|**AI + machine learning**|Azure Bot Service|botframework.com|botframework.azure.us||
||Azure Form Recognizer|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Computer Vision|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Custom Vision|cognitiveservices.azure.com|cognitiveservices.azure.us </br>[Portal](https://www.customvision.azure.us/)||
||Content Moderator|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Face API|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Language Understanding|cognitiveservices.azure.com|cognitiveservices.azure.us </br>[Portal](https://luis.azure.us/)||
||Personalizer|cognitiveservices.azure.com|cognitiveservices.azure.us||
||QnA Maker|cognitiveservices.azure.com|cognitiveservices.azure.us||
||Speech service|See [STT API docs](../cognitive-services/speech-service/rest-speech-to-text.md#regions-and-endpoints)|[Speech Studio](https://speech.azure.us/)</br></br>See [Speech service endpoints](../cognitive-services/Speech-Service/sovereign-clouds.md)</br></br>**Speech translation endpoints**</br>Virginia: `https://usgovvirginia.s2s.speech.azure.us`</br>Arizona: `https://usgovarizona.s2s.speech.azure.us`</br>||
||Text Analytics|cognitiveservices.azure.com|cognitiveservices.azure.us||
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
||Azure Resource Manager|management.azure.com|management.usgovcloudapi.net||
||Gallery URL|gallery.azure.com|gallery.azure.us||
||Microsoft Azure portal|portal.azure.com|portal.azure.us||
||Microsoft Intune|enterpriseregistration.windows.net|enterpriseregistration.microsoftonline.us|Enterprise registration|
|||manage.microsoft.com|\manage.microsoft.us|Enterprise enrollment|
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

Microsoft's goal for Azure Government is to match service availability in Azure. For service availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia). Services available in Azure Government are listed by category and whether they are Generally Available or available through Preview. If a service is available in Azure Government, that fact is not reiterated in the rest of this article. Instead, you are encouraged to review [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia) for the latest, up-to-date information on service availability.

In general, service availability in Azure Government implies that all corresponding service features are available to you. Variations to this approach and other applicable limitations are tracked and explained in this article based on the main service categories outlined in the [online directory of Azure services](https://azure.microsoft.com/services/). Other considerations for service deployment and usage in Azure Government are also provided.

## AI + machine learning

This section outlines variations and considerations when using **Azure Bot Service**, **Azure Machine Learning**, and **Cognitive Services** in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=machine-learning-service,bot-service,cognitive-services&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).  

### [Azure Bot Service](/azure/bot-service/)

The following Azure Bot Service **features are not currently available** in Azure Government (updated 8/16/2021):

- Bot Framework Composer integration
- Channels (due to availability of dependent services)
  - Teams Channel
  - Direct Line Speech Channel
  - Telephony Channel (Preview)
  - Microsoft Search Channel (Preview)
  - Kik Channel (deprecated)

For more information, see [How do I create a bot that uses US Government data center](/azure/bot-service/bot-service-resources-faq-ecosystem#how-do-i-create-a-bot-that-uses-the-us-government-data-center).

### [Azure Machine Learning](../machine-learning/overview-what-is-azure-machine-learning.md)

For feature variations and limitations, see [Azure Machine Learning feature availability across cloud regions](../machine-learning/reference-machine-learning-cloud-parity.md).

### [Cognitive Services: Content Moderator](../cognitive-services/content-moderator/overview.md)

The following Content Moderator **features are not currently available** in Azure Government:

- Review UI and Review APIs.

### [Cognitive Services: Language Understanding (LUIS)](../cognitive-services/luis/what-is-luis.md)

The following Language Understanding **features are not currently available** in Azure Government:

- Speech Requests
- Prebuilt Domains

### [Cognitive Services: Speech](../cognitive-services/speech-service/overview.md)

For feature variations and limitations, including API endpoints, see [Speech service in sovereign clouds](../cognitive-services/Speech-Service/sovereign-clouds.md).

### [Cognitive Services: Translator](../cognitive-services/translator/translator-overview.md)

The following Translator **features are not currently available** in Azure Government:

- Custom Translator
- Translator Hub

## Analytics

This section outlines variations and considerations when using Analytics services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=data-share,power-bi-embedded,analysis-services,event-hubs,data-lake-analytics,storage,data-catalog,data-factory,synapse-analytics,stream-analytics,databricks,hdinsight&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure HDInsight](../hdinsight/hdinsight-overview.md)

For secured virtual networks, you will want to allow network security groups (NSGs) access to certain IP addresses and ports. For Azure Government, you should allow the following IP addresses (all with an Allowed port of 443):

|**Region**|**Allowed IP addresses**|**Allowed port**|
|------|--------------------|------------|
|US DoD Central|52.180.249.174 </br> 52.180.250.239|443|
|US DoD East|52.181.164.168 </br>52.181.164.151|443|
|US Gov Texas|52.238.116.212 </br> 52.238.112.86|443|
|US Gov Virginia|13.72.49.126 </br> 13.72.55.55 </br> 13.72.184.124 </br> 13.72.190.110| 443|
|US Gov Arizona|52.127.3.176 </br> 52.127.3.178| 443|

For a demo on how to build data-centric solutions on Azure Government using HDInsight, see Cognitive Services, HDInsight, and Power BI on Azure Government.

### [Power BI](/power-bi/service-govus-overview)

For usage guidance, feature variations, and limitations, see [Power BI for US government customers](/power-bi/admin/service-govus-overview). For a demo on how to build data-centric solutions on Azure Government using Power BI, see Cognitive Services, HDInsight, and Power BI on Azure Government.

### [Power BI Embedded](/azure/power-bi-embedded/)

To learn how to embed analytical content within your business process application, see [Tutorial: Embed a Power BI content into your application for national clouds](/power-bi/developer/embedded/embed-sample-for-customers-national-clouds).

## Databases

This section outlines variations and considerations when using Databases services in the Azure Government environment.  For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-api-for-fhir,data-factory,sql-server-stretch-database,redis-cache,database-migration,synapse-analytics,postgresql,mariadb,mysql,sql-database,cosmos-db&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Database for MySQL](../mysql/index.yml)

The following Azure Database for MySQL **features are not currently available** in Azure Government:

- Advanced Threat Protection

### [Azure Database for PostgreSQL](../postgresql/index.yml)

The following Azure Database for PostgreSQL **features are not currently available** in Azure Government:

- Hyperscale (Citus) and Flexible server deployment options
- The following features of the Single server deployment option
  - Advanced Threat Protection
  - Backup with long-term retention

### [Azure SQL Managed Instance](../azure-sql/managed-instance/sql-managed-instance-paas-overview.md)

The following Azure SQL Managed Instance **features are not currently available** in Azure Government:

- Long-term retention

## Identity

This section outlines variations and considerations when using Identity services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=information-protection,active-directory-ds,active-directory&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Active Directory Premium P1 and P2](../active-directory/index.yml)

The following features have known limitations in Azure Government:

- Limitations with B2B Collaboration in supported Azure US Government tenants:
  - For more information about B2B collaboration limitations in Azure Government and to find out if B2B collaboration is available in your Azure Government tenant, see [Limitations of Azure AD B2B collaboration](../active-directory/external-identities/current-limitations.md#azure-us-government-clouds).
  - B2B collaboration via Power BI is not supported. When you invite a guest user from within Power BI, the B2B flow is not used and the guest user won't appear in the tenant's user list. If a guest user is invited through other means, they'll appear in the Power BI user list, but any sharing request to the user will fail and display a 403 Forbidden error.
  - Microsoft 365 Groups are not supported for B2B users and can't be enabled.

- Limitations with multifactor authentication:
  - Hardware OATH tokens are not available in Azure Government.
  - Trusted IPs are not supported in Azure Government. Instead, use Conditional Access policies with named locations to establish when multifactor authentication should and should not be required based off the user's current IP address.

- Limitations with Azure AD join:
  - Enterprise state roaming for Windows 10 devices is not available

## Management and governance

This section outlines variations and considerations when using Management and Governance services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=managed-applications,azure-policy,network-watcher,monitor,traffic-manager,automation,scheduler,site-recovery,cost-management,backup,blueprints,advisor&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Automation](../automation/overview.md)

The following Automation **features are not currently available** in Azure Government:

- Automation analytics solution

### [Azure Advisor](../advisor/advisor-overview.md)

The following Azure Advisor recommendation **features are not currently available** in Azure Government:

- Cost
  - (Preview) Consider App Service stamp fee reserved capacity to save over your on-demand costs.
  - (Preview) Consider Azure Data Explorer reserved capacity to save over your pay-as-you-go costs.
  - (Preview) Consider Azure Synapse Analytics (formerly SQL DW) reserved capacity to save over your pay-as-you-go costs.
  - (Preview) Consider Blob storage reserved capacity to save on Blob v2 and and Data Lake Storage Gen2 costs.
  - (Preview) Consider Blob storage reserved instance to save on Blob v2 and and Data Lake Storage Gen2 costs.
  - (Preview) Consider Cache for Redis reserved capacity to save over your pay-as-you-go costs.
  - (Preview) Consider Cosmos DB reserved capacity to save over your pay-as-you-go costs.
  - (Preview) Consider Database for MariaDB reserved capacity to save over your pay-as-you-go costs.
  - (Preview) Consider Database for MySQL reserved capacity to save over your pay-as-you-go costs.
  - (Preview) Consider Database for PostgreSQL reserved capacity to save over your pay-as-you-go costs.
  - (Preview) Consider SQL DB reserved capacity to save over your pay-as-you-go costs.
  - (Preview) Consider SQL PaaS DB reserved capacity to save over your pay-as-you-go costs.
  - Consider App Service stamp fee reserved instance to save over your on-demand costs.
  - Consider Azure Synapse Analytics (formerly SQL DW) reserved instance to save over your pay-as-you-go costs.
  - Consider Cache for Redis reserved instance to save over your pay-as-you-go costs.
  - Consider Cosmos DB reserved instance to save over your pay-as-you-go costs.
  - Consider Database for MariaDB reserved instance to save over your pay-as-you-go costs.
  - Consider Database for MySQL reserved instance to save over your pay-as-you-go costs.
  - Consider Database for PostgreSQL reserved instance to save over your pay-as-you-go costs.
  - Consider SQL PaaS DB reserved instance to save over your pay-as-you-go costs.
- Operational
  - Add Azure Monitor to your virtual machine (VM) labeled as production.
  - Delete and recreate your pool using a VM size that will soon be retired.
  - Enable Traffic Analytics to view insights into traffic patterns across Azure resources.
  - Enforce 'Add or replace a tag on resources' using Azure Policy.
  - Enforce 'Allowed locations' using Azure Policy.
  - Enforce 'Allowed virtual machine SKUs' using Azure Policy.
  - Enforce 'Audit VMs that do not use managed disks' using Azure Policy.
  - Enforce 'Inherit a tag from the resource group' using Azure Policy.
  - Update Azure Spring Cloud API Version.
  - Update your outdated Azure Spring Cloud SDK to the latest version.
  - Upgrade to the latest version of the Immersive Reader SDK.
- Performance
  - Accelerated Networking may require stopping and starting the VM.
  - Arista Networks vEOS Router may experience high CPU utilization, reduced throughput and high latency.
  - Barracuda Networks NextGen Firewall may experience high CPU utilization, reduced throughput and high latency.
  - Cisco Cloud Services Router 1000V may experience high CPU utilization, reduced throughput and high latency.
  - Consider increasing the size of your NVA to address persistent high CPU.
  - Distribute data in server group to distribute workload among nodes.
  - More than 75% of your queries are full scan queries.
  - NetApp Cloud Volumes ONTAP may experience high CPU utilization, reduced throughput and high latency.
  - Palo Alto Networks VM-Series Firewall may experience high CPU utilization, reduced throughput and high latency.
  - Reads happen on most recent data.
  - Rebalance data in Hyperscale (Citus) server group to distribute workload among worker nodes more evenly.
  - Update Attestation API Version.
  - Update Key Vault SDK Version.
  - Update to the latest version of your Arista VEOS product for Accelerated Networking support.
  - Update to the latest version of your Barracuda NG Firewall product for Accelerated Networking support.
  - Update to the latest version of your Check Point product for Accelerated Networking support.
  - Update to the latest version of your Cisco Cloud Services Router 1000V product for Accelerated Networking support.
  - Update to the latest version of your F5 BigIp product for Accelerated Networking support.
  - Update to the latest version of your NetApp product for Accelerated Networking support.
  - Update to the latest version of your Palo Alto Firewall product for Accelerated Networking support.
  - Upgrade your ExpressRoute circuit bandwidth to accommodate your bandwidth needs.
  - Use SSD Disks for your production workloads.
  - vSAN capacity utilization has crossed critical threshold.
- Reliability
  - Avoid hostname override to ensure site integrity.
  - Check Point Virtual Machine may lose Network Connectivity.
  - Drop and recreate your HDInsight clusters to apply critical updates.
  - Upgrade device client SDK to a supported version for IotHub.
  - Upgrade to the latest version of the Azure Connected Machine agent.

The calculation for recommending that you should right-size or shut down underutilized virtual machines in Azure Government is as follows:

- Advisor monitors your virtual machine usage for seven days and identifies low-utilization virtual machines.
- Virtual machines are considered low utilization if their CPU utilization is 5% or less and their network utilization is less than 2%, or if the current workload can be accommodated by a smaller virtual machine size.

If you want to be more aggressive at identifying underutilized virtual machines, you can adjust the CPU utilization rule on a per subscription basis.

### [Azure Cost Management and Billing](../cost-management-billing/cost-management-billing-overview.md)

The following Azure Cost Management + Billing **features are not currently available** in Azure Government:

- Cost Management + Billing for cloud solution providers (CSPs)

### [Azure Lighthouse](../lighthouse/overview.md)

The following Azure Lighthouse **features are not currently available** in Azure Government:

- Managed Service offers published to Azure Marketplace
- Delegation of subscriptions across a national cloud and the Azure public cloud, or across two separate national clouds, is not supported
- Privileged Identity Management (PIM) feature is not enabled, for example, just-in-time (JIT) / eligible authorization capability

### [Azure Monitor](../azure-monitor/overview.md)

Azure Monitor enables the same features in both Azure and Azure Government.

- System Center Operations Manager 2019 is supported equally well in both Azure and Azure Government.

The following options are available for previous versions of System Center Operations Manager:

- Integrating System Center Operations Manager 2016 with Azure Government requires an updated Advisor management pack that is included with Update Rollup 2 or later.
- System Center Operations Manager 2012 R2 requires an updated Advisor management pack included with Update Rollup 3 or later.

For more information, see [Connect Operations Manager to Azure Monitor](../azure-monitor/agents/om-agents.md).

**Frequently asked questions**

- Can I migrate data from Azure Monitor logs in Azure to Azure Government?
  - No. It is not possible to move data or your workspace from Azure to Azure Government.
- Can I switch between Azure and Azure Government workspaces from the Operations Management Suite portal?
  - No. The portals for Azure and Azure Government are separate and do not share information.

#### [Application Insights](../azure-monitor/app/app-insights-overview.md)

Application Insights (part of Azure Monitor) enables the same features in both Azure and Azure Government. This section describes the supplemental configuration that is required to use Application Insights in Azure Government.

**Visual Studio** - In Azure Government, you can enable monitoring on your ASP.NET, ASP.NET Core, Java, and Node.js based applications running on Azure App Service. For more information, see [Application monitoring for Azure App Service overview](../azure-monitor/app/azure-web-apps.md). In Visual Studio, go to Tools|Options|Accounts|Registered Azure Clouds|Add New Azure Cloud and select Azure US Government as the Discovery endpoint. After that, adding an account in File|Account Settings will prompt you for which cloud you want to add from.

**SDK endpoint modifications** - In order to send data from Application Insights to an Azure Government region, you will need to modify the default endpoint addresses that are used by the Application Insights SDKs. Each SDK requires slightly different modifications, as described in [Application Insights overriding default endpoints](../azure-monitor/app/custom-endpoints.md).

**Firewall exceptions** - Application Insights uses several IP addresses. You might need to know these addresses if the app that you are monitoring is hosted behind a firewall. For more information, see [IP addresses used by Azure Monitor](../azure-monitor/app/ip-addresses.md) from where you can download Azure Government IP addresses.

>[!NOTE]
>Although these addresses are static, it's possible that we will need to change them from time to time. All Application Insights traffic represents outbound traffic except for availability monitoring and webhooks, which require inbound firewall rules.

You need to open some **outgoing ports** in your server's firewall to allow the Application Insights SDK and/or Status Monitor to send data to the portal:

|Purpose|URL|IP address|Ports|
|-------|---|----------|-----|
|Telemetry|dc.applicationinsights.us|23.97.4.113|443|

## Media

This section outlines variations and considerations when using Media services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=cdn,media-services&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Media Services](../media-services/previous/index.yml)

For Azure Media Services v3 feature variations in Azure Government, see [Azure Media Services v3 clouds and regions availability](../media-services/latest/azure-clouds-regions.md#us-government-cloud).

## Migration

This section outlines variations and considerations when using Migration services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=database-migration,cost-management,azure-migrate,site-recovery&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Migrate](../migrate/migrate-services-overview.md)

The following Azure Migrate **features are not currently available** in Azure Government:

- Containerizing Java Web Apps on Apache Tomcat (on Linux servers) and deploying them on Linux containers on App Service.
- Containerizing Java Web Apps on Apache Tomcat (on Linux servers) and deploying them on Linux containers on Azure Kubernetes Service (AKS).
- Containerizing ASP.NET apps and deploying them on Windows containers on AKS.
- Containerizing ASP.NET apps and deploying them on Windows containers on App Service.
- You can only create assessments for Azure Government as target regions and using Azure Government offers.

For more information, see [Azure Migrate support matrix](../migrate/migrate-support-matrix.md#supported-geographies-azure-government). For a list of Azure Government URLs needed by the Azure Migrate appliance when connecting to the internet, see [Azure Migrate appliance URL access](../migrate/migrate-appliance.md#url-access).

## Networking

This section outlines variations and considerations when using Networking services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-bastion,frontdoor,virtual-wan,dns,ddos-protection,cdn,azure-firewall,network-watcher,load-balancer,vpn-gateway,expressroute,application-gateway,virtual-network&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure ExpressRoute](../expressroute/index.yml)

For an overview of ExpressRoute, see [What is Azure ExpressRoute?](../expressroute/expressroute-introduction.md). For an overview of how **BGP communities** are used with ExpressRoute in Azure Government, see [BGP community support in National Clouds](../expressroute/expressroute-routing.md#bgp-community-support-in-national-clouds).

### [Private Link](../private-link/private-link-overview.md)

For Private Link services availability, see [Azure Private Link availability](../private-link/availability.md).

### [Traffic Manager](../traffic-manager/traffic-manager-overview.md)

Traffic Manager health checks can originate from certain IP addresses for Azure Government. Review the [IP addresses in the JSON file](https://azuretrafficmanagerdata.blob.core.windows.net/probes/azure-gov/probe-ip-ranges.json) to ensure that incoming connections from these IP addresses are allowed at the endpoints to check its health status.

## Security

This section outlines variations and considerations when using Security services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-sentinel,azure-dedicated-hsm,information-protection,application-gateway,vpn-gateway,security-center,key-vault,active-directory-ds,ddos-protection,active-directory&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Microsoft Defender for IoT](../defender-for-iot/index.yml)

For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-defender-for-iot).

### [Azure Information Protection](/azure/information-protection/what-is-information-protection)

Azure Information Protection Premium is part of the [Enterprise Mobility + Security](/enterprise-mobility-security) suite. For details on this service and how to use it, see the [Azure Information Protection Premium Government Service Description](/enterprise-mobility-security/solutions/ems-aip-premium-govt-service-description).

### [Microsoft Defender for Cloud](../defender-for-cloud/defender-for-cloud-introduction.md)

For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-defender-for-cloud).

### [Microsoft Sentinel](../sentinel/overview.md)

For feature variations and limitations, see [Cloud feature availability for US Government customers](../security/fundamentals/feature-availability.md#microsoft-sentinel).

## Storage

This section outlines variations and considerations when using Storage services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=hpc-cache,managed-disks,storsimple,backup,storage&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure managed disks](../virtual-machines/managed-disks-overview.md)

The following Azure managed disks **features are not currently available** in Azure Government:

- Zone-redundant storage (ZRS)

### [Azure NetApp Files](../azure-netapp-files/index.yml)

For Azure NetApp Files feature availability in Azure Government and how to access the Azure NetApp Files service within Azure Government, see [Azure NetApp Files for Azure Government](../azure-netapp-files/azure-government.md).

### [Azure Import/Export](../import-export/storage-import-export-service.md)

With Import/Export jobs for US Gov Arizona or US Gov Texas, the mailing address is for US Gov Virginia. The data is loaded into selected storage accounts from the US Gov Virginia region. For all jobs, we recommend that you rotate your storage account keys after the job is complete to remove any access granted during the process. For more information, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md).

## Web

This section outlines variations and considerations when using Web services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud,signalr-service,api-management,notification-hubs,search,cdn,app-service-linux,app-service&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [API Management](../api-management/index.yml)

The following API Management **features are not currently available** in Azure Government:

- Azure AD B2C integration

### [App Service](../app-service/overview.md)

The following App Service **resources are not currently available** in Azure Government:

- App Service Certificate
- App Service Managed Certificate
- App Service Domain

The following App Service **features are not currently available** in Azure Government:

- Deployment
  - Deployment options: only Local Git Repository and External Repository are available

### [Azure Functions](../azure-functions/index.yml)

When connecting your Functions app to Application Insights in Azure Government, make sure you use [`APPLICATIONINSIGHTS_CONNECTION_STRING`](../azure-functions/functions-app-settings.md#applicationinsights_connection_string), which lets you customize the Application Insights endpoint.

## Next steps

Learn more about Azure Government:

- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Azure Government overview](./documentation-government-welcome.md)
- [Azure support for export controls](./documentation-government-overview-itar.md)
- [Azure Government security](./documentation-government-plan-security.md)
- [Azure guidance for secure isolation](./azure-secure-isolation-guidance.md)

Start using Azure Government:

- [Guidance for developers](./documentation-government-developer-guide.md)
- [Connect with the Azure Government portal](./documentation-government-get-started-connect-with-portal.md)
