---
title: Compare Azure Government and global Azure | Microsoft Docs
description: Describe feature differences between Azure Government and global Azure.
services: azure-government
cloud: gov
documentationcenter: ''

ms.service: azure-government
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 04/14/2021
---

# Compare Azure Government and global Azure

Microsoft Azure Government uses same underlying technologies as global Azure, which includes the core components of [Infrastructure-as-a-Service (IaaS)](https://azure.microsoft.com/overview/what-is-iaas/), [Platform-as-a-Service (PaaS)](https://azure.microsoft.com/overview/what-is-paas/), and [Software-as-a-Service (SaaS)](https://azure.microsoft.com/overview/what-is-saas/). Both Azure and Azure Government have the same comprehensive security controls in place, as well as the same Microsoft commitment on the safeguarding of customer data. Whereas both cloud environments are assessed and authorized at the FedRAMP High impact level, Azure Government provides an additional layer of protection to customers through contractual commitments regarding storage of customer data in the United States and limiting potential access to systems processing customer data to [screened US persons](./documentation-government-plan-security.md#screening). These commitments may be of interest to customers using the cloud to store or process data subject to US export control regulations.

### Export control implications

Customers are responsible for designing and deploying their applications to meet [US export control requirements](./documentation-government-overview-itar.md) such as the requirements prescribed in the EAR, ITAR, and DoE 10 CFR Part 810. In doing so, customers should not include sensitive or restricted information in Azure resource names, as explained in [Considerations for naming Azure resources](./documentation-government-concept-naming-resources.md).

### Guidance for developers

Azure Government services operate the same way as the corresponding services in global Azure, which is why most of the existing online Azure documentation applies equally well to Azure Government. However, there are some key differences that developers working on applications hosted in Azure Government must be aware of. For detailed information, see [Guidance for developers](./documentation-government-developer-guide.md). As a developer, you must know how to connect to Azure Government and once you connect you will mostly have the same experience as in global Azure. Table below lists API endpoints in Azure vs. Azure Government for accessing and managing various services.

|Service category|Service name|Azure Public|Azure Government|Notes|
|-----------|-----------|-------|----------|----------------------|
|**AI + Machine Learning**|Azure Bot Service|\*.botframework.com|\*.botframework.azure.us||
||Computer Vision|See [Computer Vision docs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa)|\*.cognitiveservices.azure.us||
||    Custom Vision|See [Training](https://go.microsoft.com/fwlink/?linkid=865445) and [Prediction](https://go.microsoft.com/fwlink/?linkid=865446) API references|\*.cognitiveservices.azure.us </br>[Portal](https://www.customvision.azure.us/)||
||Content Moderator|See [Content Moderator docs](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c)|\*.cognitiveservices.azure.us||
||Face|See [Face API docs](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236)|\*.cognitiveservices.azure.us||
||Form Recognizer|See [Form Recognizer docs](../cognitive-services/form-recognizer/quickstarts/client-library.md#prerequisites)|\*.cognitiveservices.azure.us||
||Language Understanding|See [LUIS REST API docs](../cognitive-services/luis/developer-reference-resource.md)|\*.cognitiveservices.azure.us </br>[Portal](https://luis.azure.us/)||
||Personalizer|See [Personalizer docs](../cognitive-services/personalizer/quickstart-personalizer-sdk.md#prerequisites)|\*.cognitiveservices.azure.us||
||QnA Maker|See [QnA Maker docs](../cognitive-services/qnamaker/how-to/set-up-qnamaker-service-azure.md)|\*.cognitiveservices.azure.us||
||Speech service|See [STT API docs](../cognitive-services/speech-service/rest-speech-to-text.md#regions-and-endpoints)|[Speech Studio](https://speech.azure.us/)</br></br>See [Speech service endpoints](../cognitive-services/Speech-Service/sovereign-clouds.md)</br></br>**Speech translation endpoints**</br>Virginia: `https://usgovvirginia.s2s.speech.azure.us`</br>Arizona: `https://usgovarizona.s2s.speech.azure.us`</br>||
||Translator|See [Translator API docs](../cognitive-services/translator/reference/v3-0-reference.md#base-urls)|\*.cognitiveservices.azure.us||
|**Analytics**|HDInsight|\*.azurehdinsight.net|\*.azurehdinsight.us||
||Power BI|app.powerbi.com|app.powerbigov.us|[Power BI US Gov](https://powerbi.microsoft.com/documentation/powerbi-service-govus-overview/)|
|**Compute**|Batch|\*.batch.azure.com|\*.batch.usgovcloudapi.net||
||Cloud Services|\*.cloudapp.net|\*.usgovcloudapp.net||
||Azure Functions|\*.azurewebsites.net|\*.azurewebsites.us||
||Service Fabric|\*.cloudapp.azure.com|\*.cloudapp.usgovcloudapi.net||
|**Containers**|Container Registry Suffix|\*.azurecr.io|\*.azurecr.us||
|**Databases**|Azure Cache for Redis|\*.redis.cache.windows.net|\*.redis.cache.usgovcloudapi.net|See [How to connect to other clouds](../azure-cache-for-redis/cache-how-to-manage-redis-cache-powershell.md#how-to-connect-to-other-clouds)|
||Azure Cosmos DB|\*.documents.azure.com|\*.documents.azure.us||
||Azure Database for MariaDB|\*.mariadb.database.azure.com|\*.mariadb.database.usgovcloudapi.net||
||Azure Database for MySQL|\*.mysql.database.azure.com|\*.mysql.database.usgovcloudapi.net||
||Azure Database for PostgreSQL|\*.postgres.database.azure.com|\*.postgres.database.usgovcloudapi.net||
||Azure SQL Database|\*.database.windows.net|\*.database.usgovcloudapi.net||
|**Integration**|Service Bus|\*.servicebus.windows.net|\*.servicebus.usgovcloudapi.net||
|**Internet of Things**|Azure Event Hubs|\*.servicebus.windows.net|\*.servicebus.usgovcloudapi.net||
||Azure IoT Hub|\*.azure-devices.net|\*.azure-devices.us||    
||Azure Maps|atlas.microsoft.com|atlas.azure.us||
||Notification Hubs|\*.servicebus.windows.net|\*.servicebus.usgovcloudapi.net||
|**Management and Governance**|Azure Monitor logs|mms.microsoft.com|oms.microsoft.us|Log Analytics workspace portal|
|||*workspaceId*.ods.opinsights.azure.com|*workspaceId*.ods.opinsights.azure.us|[Data collector API](../azure-monitor/logs/data-collector-api.md)|
|||\*.ods.opinsights.azure.com|\*.ods.opinsights.azure.us||
|||\*.oms.opinsights.azure.com|\*.oms.opinsights.azure.us||
|||portal.loganalytics.io|portal.loganalytics.us||
|||api.loganalytics.io|api.loganalytics.us||
|||docs.loganalytics.io|docs.loganalytics.us||
||Azure Automation|\*.azure-automation.net|\*.azure-automation.us||
||Portal and Cloud Shell|https:\//portal.azure.com|https:\//portal.azure.us||
||Gallery URL|https:\//gallery.azure.com/|https:\//gallery.azure.us/||
|**Migration**|Azure Site Recovery|\*.hypervrecoverymanager.windowsazure.com|\*.hypervrecoverymanager.windowsazure.us|Site Recovery service|
|||\*.backup.windowsazure.com/|\*.backup.windowsazure.us/|Protection service|
|||\*.blob.core.windows.net/|\*.blob.core.usgovcloudapi.net/|Storing VM snapshots|
|||[Public download MySQL](https://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi)|[Gov download MySQL](https://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi)|Download MySQL|
|**Networking**|Traffic Manager|\*.trafficmanager.net|\*.usgovtrafficmanager.net||
|**Security**|Azure Active Directory|https:\//login.microsoftonline.com|https:\//login.microsoftonline.us||
||Key Vault|\*.vault.azure.net|\*.vault.usgovcloudapi.net|Endpoint|
|||cfa8b339-82a2-471a-a3c9-0fc0be7a4093|7e7c393b-45d0-48b1-a35e-2905ddf8183c|Service Principal ID|
|||Azure Key Vault|Azure Key Vault|Service Principal Name|
|**Storage**|Blob|\*.blob.core.windows.net|\*.blob.core.usgovcloudapi.net||
||Queue|\*.queue.core.windows.net|\*.queue.core.usgovcloudapi.net||
||Table|\*.table.core.windows.net|\*.table.core.usgovcloudapi.net||
||File|\*.file.core.windows.net|\*.file.core.usgovcloudapi.net||
|**Web**|API Management Gateway|\*.azure-api.net|\*.azure-api.us||
||API Management Portal|\*.portal.azure-api.net|\*.portal.azure-api.us||
||API Management management|\*.management.azure-api.net|\*.management.azure-api.us||
||App Configuration|\*.azconfig.io|\*.azconfig.azure.us|Endpoint|
||App Service|\*.azurewebsites.net|\*.azurewebsites.us|Endpoint|
|||abfa0a7c-a6b6-4736-8310-5855508787cd|6a02c803-dafd-4136-b4c3-5a6f318b4714|Service Principal ID|
||Azure Cognitive Search|\*.search.windows.net|\*.search.windows.us||

### Service availability

Microsoft's goal is to enable 100% parity in service availability between Azure and Azure Government. For service availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia). Services available in Azure Government are listed by category and whether they are Generally Available or available through Preview. If a service is available in Azure Government, that fact is not reiterated in the rest of this article. Instead, customers are encouraged to review [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia) for the latest, up-to-date information on service availability.

In general, service availability in Azure Government implies that all corresponding service features are available to customers. Variations to this approach and other applicable limitations are tracked and explained in this article based on the main service categories outlined in the [online directory of Azure services](https://azure.microsoft.com/services/). Additional considerations for service deployment and usage in Azure Government are also provided.

## AI + Machine Learning

This section outlines variations and considerations when using **Azure Bot Service**, **Azure Machine Learning**, and **Cognitive Services** in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=machine-learning-service,bot-service,cognitive-services&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).  

### [Azure Bot Service](/azure/bot-service/)

The following Azure Bot Service **features are not currently available** in Azure Government:

- BotBuilder V3 Bot Templates
- Channels
    - Cortana channel
    - Skype for Business Channel
    - Teams Channel
    - Slack Channel
    - Office 365 Email Channel
    - Facebook Messenger Channel
    - Telegram Channel
    - Kik Messenger Channel
    - GroupMe Channel
    - Skype Channel
- Application Insights related capabilities including the Analytics Tab
- Speech Priming Feature
- Payment Card Feature

Commonly used services in bot applications that are not currently available in Azure Government:

- Application Insights
- Speech Service

For more information, see [How do I create a bot that uses US Government data center](/azure/bot-service/bot-service-resources-faq-ecosystem#how-do-i-create-a-bot-that-uses-the-us-government-data-center).

### [Azure Machine Learning](../machine-learning/overview-what-is-azure-ml.md)

For feature variations and limitations, see [Azure Machine Learning sovereign cloud parity](../machine-learning/reference-machine-learning-cloud-parity.md).

### [Content Moderator](../cognitive-services/content-moderator/overview.md)

The following Content Moderator **features are not currently available** in Azure Government:

- Review UI and Review APIs.

### [Language Understanding](../cognitive-services/luis/what-is-luis.md)

The following Language Understanding **features are not currently available** in Azure Government:

- Speech Requests
- Prebuilt Domains

### [Speech service](../cognitive-services/speech-service/overview.md)

The following Speech service **features are not currently available** in Azure Government:

- Custom Voice

See details of supported locales by features in [Speech service supported regions](../cognitive-services/speech-service/regions.md). For additional information including API endpoints, see [Speech service in sovereign clouds](../cognitive-services/Speech-Service/sovereign-clouds.md).

### [Translator](../cognitive-services/translator/translator-info-overview.md)

The following Translator **features are not currently available** in Azure Government:

- Custom Translator
- Translator Hub


## Analytics

This section outlines variations and considerations when using Analytics services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=data-share,power-bi-embedded,analysis-services,event-hubs,data-lake-analytics,storage,data-catalog,data-factory,synapse-analytics,stream-analytics,databricks,hdinsight&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

### [Azure Data Factory](../data-factory/index.yml)

The following Data Factory **features are not currently available** in Azure Government:

- Mapping data flows

### [Azure Databricks](/azure/databricks/scenarios/what-is-azure-databricks)

For access to Azure Databricks in an Azure Government environment, contact your Microsoft or Databricks account representative.

### [HDInsight](../hdinsight/hadoop/apache-hadoop-introduction.md)

The following HDInsight **features are not currently available** in Azure Government:

- HDInsight on Windows
- Azure Data Lake Storage

Azure Blob Storage is the only available storage option currently.

For secured virtual networks, you will want to allow network security groups (NSGs) access to certain IP addresses and ports. For Azure Government, you should allow the following IP addresses (all with an Allowed port of 443):

|**Region**|**Allowed IP addresses**|**Allowed port**|
|------|--------------------|------------|
|US DoD Central|52.180.249.174 </br> 52.180.250.239|443|
|US DoD East|52.181.164.168 </br>52.181.164.151|443|
|US Gov Texas|52.238.116.212 </br> 52.238.112.86|443|
|US Gov Virginia|13.72.49.126 </br> 13.72.55.55 </br> 13.72.184.124 </br> 13.72.190.110| 443|
|US Gov Arizona|52.127.3.176 </br> 52.127.3.178| 443|

You can see a demo on how to build data-centric solutions on Azure Government using [HDInsight](https://channel9.msdn.com/Blogs/Azure/Cognitive-Services-HDInsight-and-Power-BI-on-Azure-Government).

### [Power BI](/power-bi/service-govus-overview)

The following Power BI **features are not currently available** in Azure Government:

- Portal support

You can see a demo on [how to build data-centric solutions on Azure Government using Power BI](https://channel9.msdn.com/Blogs/Azure/Cognitive-Services-HDInsight-and-Power-BI-on-Azure-Government/).

> [!NOTE]
> The content pack that typically makes activity logs and such available is not intended for use on Government tenants. The intention is to use Log Analytics for the purpose of the logs that aren't available through the content pack.

### [Power BI Embedded](/azure/power-bi-embedded/)

The following Power BI Embedded **features are not yet available** in Azure Government:

- Portal support


## Compute

This section outlines variations and considerations when using Compute services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud,azure-vmware-cloudsimple,cloud-services,batch,container-instances,app-service,service-fabric,functions,kubernetes-service,virtual-machine-scale-sets,virtual-machines&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

### [Virtual Machines](../virtual-machines/sizes.md)

The following Virtual Machines **features are not currently available** in Azure Government:

- Settings
    - Continuous delivery
- Operations
    - Auto shutdown
- Monitoring
    - Application Insights
- Support + troubleshooting
    - Ubuntu Advantage support plan

### [Azure Functions](../azure-functions/index.yml)

When connecting your function app to Application Insights in Azure Government, make sure you use [`APPLICATIONINSIGHTS_CONNECTION_STRING`](../azure-functions/functions-app-settings.md#applicationinsights_connection_string), which lets you customize the Application Insights endpoint.


## Databases

This section outlines variations and considerations when using Databases services in the Azure Government environment.  For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-api-for-fhir,data-factory,sql-server-stretch-database,redis-cache,database-migration,synapse-analytics,postgresql,mariadb,mysql,sql-database,cosmos-db&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

### [Azure Database for MySQL](../mysql/index.yml)

The following Azure Database for MySQL **features are not currently available** in Azure Government:

- Advanced Threat Protection
- Private endpoint connections

### [Azure Database for PostgreSQL](../postgresql/index.yml)

The following Azure Database for PostgreSQL **features are not currently available** in Azure Government:

- Hyperscale (Citus) and Flexible server deployment options
- The following features of the Single server deployment option
   - Advanced Threat Protection
   - Private endpoint connections


## Developer Tools

This section outlines variations and considerations when using Developer Tools services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=app-configuration,devtest-lab,lab-services,azure-devops&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

### [Azure DevTest Labs](../devtest-labs/devtest-lab-overview.md)

The following Azure DevTest Labs **features are not currently available** in Azure Government:

- Auto shutdown feature for Azure Compute VMs; however, setting auto shutdown for [Labs](https://azure.microsoft.com/updates/azure-devtest-labs-auto-shutdown-notification/) and [Lab Virtual Machines](https://azure.microsoft.com/updates/azure-devtest-labs-set-auto-shutdown-for-a-single-lab-vm/) is available.


## Internet of Things

This section outlines variations and considerations when using Internet of Things services in the Azure Government environment.  For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=api-management,cosmos-db,notification-hubs,logic-apps,stream-analytics,machine-learning-studio,machine-learning-service,event-grid,functions,azure-rtos,azure-maps,iot-central,iot-hub&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

### [Azure IoT Hub](../iot-hub/index.yml)

If you are using the IoT Hub connection string (instead of the Event Hub-compatible settings) with the Microsoft Azure Service Bus .NET client library to receive telemetry or operations monitoring events, then be sure to use `WindowsAzure.ServiceBus` NuGet package version 4.1.2 or higher.


## Management and Governance

This section outlines variations and considerations when using Management and Governance services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=managed-applications,azure-policy,network-watcher,monitor,traffic-manager,automation,scheduler,site-recovery,cost-management,backup,blueprints,advisor&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

> [!NOTE]
>This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [**Introducing the new Azure PowerShell Az module**](/powershell/azure/new-azureps-module-az). For Az module installation instructions, see [**Install Azure PowerShell**](/powershell/azure/install-az-ps).

### [Application Insights](../azure-monitor/overview.md)

This section describes the supplemental configuration that is required to use Application Insights (part of Azure Monitor) in Azure Government.

**Enable Application Insights for [ASP.NET](#web) & [ASP.NET Core](#web) with Visual Studio**

Azure Government customers can enable Application Insights with a [codeless agent](../azure-monitor/app/azure-web-apps.md) for their Azure App Services hosted applications or via the traditional **Add Applications Insights Telemetry** button in Visual Studio, which requires a small manual workaround. Customers experiencing the associated issue may see error messages like "There is no Azure subscription associated with this account" or "The selected subscription does not support Application Insights" even though the `microsoft.insights` resource provider has a status of registered for the subscription. To mitigate this issue, you must perform the following steps:

1. Switch Visual Studio to [target the Azure Government cloud](./documentation-government-welcome.md).
2. Create (or if already existing, set) the User Environment variable for `AzureGraphApiVersion` as follows:

   - Variable name: `AzureGraphApiVersion`
   - Variable value: `2014-04-01`
   
   To create a User Environment variable go to **Control Panel > System > Advanced system settings > Advanced > Environment Variables**.

3. Make the appropriate Application Insights SDK endpoint modifications for either [ASP.NET](#web) or [ASP.NET Core](#web) depending on your project type.

**Snapshot Debugger** is now available for Azure Government customers. To use Snapshot Debugger the only additional prerequisite is to ensure that you are using [Snapshot Collector version 1.3.5](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.5-pre-1906.403) or later. Then simply follow the standard [Snapshot Debugger documentation](../azure-monitor/app/snapshot-debugger.md).

**SDK endpoint modifications** - In order to send data from Application Insights to the Azure Government region, you will need to modify the default endpoint addresses that are used by the Application Insights SDKs. Each SDK requires slightly different modifications, as described in [Application Insights overriding default endpoints](../azure-monitor/app/custom-endpoints.md).

>[!NOTE]
>[**Connection strings**](../azure-monitor/app/sdk-connection-string.md?tabs=net) are the new preferred method of setting custom endpoints within Application Insights.

**Firewall exceptions** - Application Insights uses several IP addresses. You might need to know these addresses if the app that you are monitoring is hosted behind a firewall.

>[!NOTE]
>Although these addresses are static, it's possible that we will need to change them from time to time. All Application Insights traffic represents outbound traffic except for availability monitoring and webhooks, which require inbound firewall rules.

You need to open some **outgoing ports** in your server's firewall to allow the Application Insights SDK and/or Status Monitor to send data to the portal:

|Purpose|URL|IP address|Ports|
|-------|---|----------|-----|
|Telemetry|dc.applicationinsights.us|23.97.4.113|443|

### [Azure Lighthouse](../lighthouse/overview.md)

The following Azure Lighthouse **features are not currently available** in Azure Government:
- Managed Service offers published to Azure Marketplace

### [Azure Monitor](../azure-monitor/logs/data-platform-logs.md)

The following Azure Monitor **features are not currently available** in Azure Government:

- Solutions that are in preview in Microsoft Azure, including:
    - Windows 10 Upgrade Analytics solution
    - Application Insights solution
    - Azure Networking Security Group Analytics solution
    - Azure Automation Analytics solution
    - Key Vault Analytics solution
- Solutions and features that require updates to on-premises software, including:
    - Surface Hub solution
- Features that are in preview in global Azure, including:
    - Export of data to Power BI
- Azure metrics and Azure diagnostics

The following Azure Monitor **features behave differently** in Azure Government:

- To connect your System Center Operations Manager management group to Azure Monitor logs, you need to download and import updated management packs.
    - System Center Operations Manager 2016
        1. Install [Update Rollup 2 for System Center Operations Manager 2016](https://support.microsoft.com/help/3209591).
        1. Import the management packs included as part of Update Rollup 2 into Operations Manager. For information about how to import a management pack from a disk, see [How to import an Operations Manager Management Pack](/previous-versions/system-center/system-center-2012-R2/hh212691(v=sc.12)).
        1. To connect Operations Manager to Azure Monitor logs, follow the steps in [Connect Operations Manager to Azure Monitor](../azure-monitor/agents/om-agents.md).
    - System Center Operations Manager 2012 R2 UR3 (or later) / Operations Manager 2012 SP1 UR7 (or later)
        1. Download and save the [updated management packs](https://go.microsoft.com/fwlink/?LinkId=828749).
        1. Unzip the file that you downloaded.
        1. Import the management packs into Operations Manager. For information about how to import a management pack from a disk, see [How to import an Operations Manager Management Pack](/previous-versions/system-center/system-center-2012-R2/hh212691(v=sc.12)).
        1. To connect Operations Manager to Azure Monitor logs, follow the steps in [Connect Operations Manager to Azure Monitor](../azure-monitor/agents/om-agents.md).
- For more information about using computer groups from Configuration Manager, see [Connect Configuration Manager to Azure Monitor](../azure-monitor/logs/collect-sccm.md).

**Frequently asked questions**
- Can I migrate data from Azure Monitor logs in Azure to Azure Government?
    - No. It is not possible to move data or your workspace from Azure to Azure Government.
- Can I switch between Azure and Azure Government workspaces from the Operations Management Suite portal?
    - No. The portals for Azure and Azure Government are separate and do not share information.

### [Azure Advisor](../advisor/advisor-overview.md)

The following Azure Advisor recommendation **features are not currently available** in Azure Government:

- High Availability
    - Configure your VPN gateway to active-active for connection resilience
    - Create Azure Service Health alerts to be notified when Azure issues affect you
    - Configure Traffic Manager endpoints for resiliency
    - Use soft delete for your Azure Storage Account
- Performance
    - Improve App Service performance and reliability
    - Reduce DNS time to live on your Traffic Manager profile to fail over to healthy endpoints faster
    - Improve Azure Synapse Analytics performance
    - Use Premium Storage
    - Migrate your Storage Account to Azure Resource Manager
- Cost
    - Buy reserved virtual machines instances to save money over pay-as-you-go costs
    - Eliminate unprovisioned ExpressRoute circuits
    - Delete or reconfigure idle virtual network gateways

The calculation for recommending that you should right-size or shut down underutilized virtual machines in Azure Government is as follows:

- Advisor monitors your virtual machine usage for 7 days and identifies low-utilization virtual machines.
- Virtual machines are considered low utilization if their CPU utilization is 5% or less and their network utilization is less than 2%, or if the current workload can be accommodated by a smaller virtual machine size.

If you want to be more aggressive at identifying underutilized virtual machines, you can adjust the CPU utilization rule on a per subscription basis.


## Media

This section outlines variations and considerations when using Media services in the Azure Government environment.
For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=cdn,media-services&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia). For Azure Media Services v3 availability, see [Azure clouds and regions in which Media Services v3 exists](../media-services/latest/azure-clouds-regions.md).

### [Media Services](../media-services/previous/index.yml)

For information on how to connect to Media Services v2, see [Access the Azure Media Services API with Azure AD authentication](../media-services/previous/media-services-use-aad-auth-to-access-ams-api.md). The following Media Services **features are not currently available** in Azure Government:

- Analyzing – the Azure Media Indexer 2 Preview Azure Media Analytics media processor is not available in Azure Government.
- CDN integration – there is no CDN integration with streaming endpoints in Azure Government data centers.

### Media Services Video Indexer

For more information, see [Create a Video Indexer account](../media-services/video-indexer/connect-to-azure.md#video-indexer-in-azure-government).


## Migration

This section outlines variations and considerations when using Migration services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=database-migration,cost-management,azure-migrate,site-recovery&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

### [Azure Migrate](../migrate/migrate-services-overview.md)

The following Azure Migrate **features are not currently available** in Azure Government:

- Dependency visualization functionality as Azure Migrate depends on Service Map for dependency visualization which is currently unavailable in Azure Government.
- You can only create assessments for Azure Government as target regions and using Azure Government offers.


## Networking

This section outlines variations and considerations when using Networking services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-bastion,frontdoor,virtual-wan,dns,ddos-protection,cdn,azure-firewall,network-watcher,load-balancer,vpn-gateway,expressroute,application-gateway,virtual-network&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

### [Azure ExpressRoute](../expressroute/index.yml)

Azure ExpressRoute is used to create private connections between Azure Government datacenters and customer's on-premises infrastructure or a colocation facility. ExpressRoute connections do not go over the public Internet — they offer optimized pathways (shortest hops, lowest latency, highest performance, etc.) and Azure Government geo-redundant regions.

- By default, all Azure Government ExpressRoute connectivity is configured active-active redundant with support for bursting, and it delivers up to 10 G circuit capacity (smallest is 50 MB).
- Microsoft owns and operates all fiber infrastructure between Azure Government regions and Azure Government ExpressRoute Meet-Me locations.
- Azure Government ExpressRoute provides connectivity to Microsoft Azure, Microsoft 365, and Dynamics 365 cloud services.

Aside from ExpressRoute, customers can also use an [IPSec protected VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) (site-to-site for a typical organization) to connect securely from their on-premises infrastructure to Azure Government. For network services to support Azure Government customer applications and solutions, it is strongly recommended that ExpressRoute (private connectivity) is implemented to connect to Azure Government. If VPN connections are used, the following should be considered:

- Customers should contact their authorizing official/agency to determine whether private connectivity or other secure connection mechanism is required and to identify any additional restrictions to consider.
- Customers should decide whether to mandate that the site-to-site VPN is routed through a private connectivity zone.
- Customers should obtain either a Multi-Protocol Label Switching (MPLS) circuit or VPN with a licensed private connectivity access provider.

All customers who utilize a private connectivity architecture should validate that an appropriate implementation is established and maintained for the customer connection to the Gateway Network/Internet (GN/I) edge router demarcation point for Azure Government. Similarly, your organization must establish network connectivity between your on-premises environment and Gateway Network/Customer (GN/C) edge router demarcation point for Azure Government.

### BGP communities

This section provides an overview of how BGP communities are used with ExpressRoute in Azure Government. Microsoft advertises routes in the public peering and Microsoft peering paths, with routes tagged with appropriate community values. The rationale for doing so and the details on community values are described below.

If you are connecting to Microsoft through ExpressRoute at any one peering location within the Azure Government region, you will have access to all Microsoft cloud services across all regions within the government boundary. For example, if you connected to Microsoft in Washington D.C. through ExpressRoute, you would have access to all Microsoft cloud services hosted in Azure Government. [ExpressRoute overview](../expressroute/expressroute-introduction.md) provides details on locations and partners, as well as a list of peering locations for Azure Government.

You can purchase more than one ExpressRoute circuit. Having multiple connections offers you significant benefits on high availability due to geo-redundancy. In cases where you have multiple ExpressRoute circuits, you will receive the same set of prefixes advertised from Microsoft on the public peering and Microsoft peering paths. This means you will have multiple paths from your network into Microsoft. This can potentially cause sub-optimal routing decisions to be made within your network. As a result, you may experience sub-optimal connectivity experiences to different services.

Microsoft tags prefixes advertised through public peering and Microsoft peering with appropriate BGP community values indicating the region the prefixes are hosted in. You can rely on the community values to make appropriate routing decisions to offer optimal routing to customers. For additional details, see [Optimize ExpressRoute routing](../expressroute/expressroute-optimize-routing.md).

|Azure Government region|BGP community value|
|-----------------------|-------------------|
|US Gov Arizona|12076:51106|
|US Gov Virginia|12076:51105|
|US Gov Texas|12076:51108|
|US DoD Central|12076:51209|
|US DoD East|12076:51205|

All routes advertised from Microsoft are tagged with the appropriate community value.

In addition to the above, Microsoft also tags prefixes based on the service they belong to. This tagging applies only to the Microsoft peering. The table below provides a mapping of service to BGP community value.

|Service in national clouds|BGP community value|
|--------------------------|-------------------|
|Exchange Online|12076:5110|
|SharePoint Online|12076:5120|
|Skype for Business Online|12076:5130|
|Dynamics 365|12076:5140|
|Other Office 365 Online services|12076:5200|

>[!NOTE]
>Microsoft does not honor any BGP community values that you set on the routes advertised to Microsoft.

### [Traffic Manager](../traffic-manager/traffic-manager-overview.md)

Traffic Manager health checks can originate from certain IP addresses for Azure Government. Review the [IP addresses in the JSON file](https://azuretrafficmanagerdata.blob.core.windows.net/probes/azure-gov/probe-ip-ranges.json) to ensure that incoming connections from these IP addresses are allowed at the endpoints to check its health status.


## Security

This section outlines variations and considerations when using Security services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-sentinel,azure-dedicated-hsm,information-protection,application-gateway,vpn-gateway,security-center,key-vault,active-directory-ds,ddos-protection,active-directory&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

### [Azure Active Directory Premium P1 and P2](../active-directory/index.yml)

The following features have known limitations in Azure Government:

- Limitations with B2B collaboration in supported Azure Government tenants:
    - B2B collaboration is available in most Azure Government tenants created after June, 2019. Over time, more tenants will get access to this functionality. See [How can I tell if B2B collaboration is available in my Azure Government tenant?](../active-directory/external-identities/current-limitations.md#how-can-i-tell-if-b2b-collaboration-is-available-in-my-azure-us-government-tenant)
    - B2B collaboration is currently only supported between tenants that are both within Azure US Government cloud and that both support B2B collaboration. If you invite a user in a tenant that isn't part of the Azure Government cloud or that doesn't yet support B2B collaboration, the invitation will fail or the user will be unable to redeem the invitation.
    - B2B collaboration via Power BI is not supported. When you invite a guest user from within Power BI, the B2B flow is not used and the guest user won't appear in the tenant's user list. If a guest user is invited through other means, they'll appear in the Power BI user list, but any sharing request to the user will fail and display a 403 Forbidden error.
    - Microsoft 365 Groups are not supported for B2B users and can't be enabled.
    - Some SQL tools such as SQL Server Management Studio (SSMS) require you to set the appropriate cloud parameter. In the tool's Azure service setup options, set the cloud parameter to Azure Government.

- Limitations with multi-factor authentication:
    - Hardware OATH tokens are not available in Azure Government.
    - Trusted IPs are not supported in Azure Government. Instead, use Conditional Access policies with named locations to establish when multi-factor authentication should and should not be required based off the user's current IP address.

- Limitations with Azure AD Join:
    - Enterprise state roaming for Windows 10 devices is not available
    
- Limitations with Azure AD self-service password reset (SSPR):
    - Azure AD SSPR from Windows 10 login screen is not available

### [Azure Information Protection](/azure/information-protection/what-is-information-protection)

Azure Information Protection Premium is part of the [Enterprise Mobility + Security](/enterprise-mobility-security) suite. For details on this service and how to use it, see the [Azure Information Protection Premium Government Service Description](/enterprise-mobility-security/solutions/ems-aip-premium-govt-service-description).

### [Azure Security Center](../security-center/security-center-introduction.md)

The following Azure Security Center **features are not currently available** in Azure Government:

- **1st and 3rd party integrations**
    - [Connect AWS account](../security-center/quickstart-onboard-aws.md)
    - [Connect GCP account](../security-center/quickstart-onboard-gcp.md)
    - [Integrated vulnerability assessment for machines (powered by Qualys)](../security-center/deploy-vulnerability-assessment-vm.md).

    > [!NOTE]
    > Security Center internal assessments are provided to discover security misconfigurations, based on Common Configuration Enumeration such as password policy, windows FW rules, local machine audit and security policy, and additional OS hardening settings.

- **Threat detection**
    - [Azure Defender for App Service](../security-center/defender-for-app-service-introduction.md).
    - [Azure Defender for Key Vault](../security-center/defender-for-key-vault-introduction.md)
    - *Specific detections*: Detections based on VM log periodic batches, Azure core router network logs, and threat intelligence reports.

    > [!NOTE]
    > Near real-time alerts generated based on security events and raw data collected from the VMs are captured and displayed.

- **Environment hardening**
    - [Adaptive network hardening](../security-center/security-center-adaptive-network-hardening.md)

- **Preview features**
    - [Recommendation exemption rules](../security-center/exempt-resource.md)
    - [Azure Defender for Resource Manager](../security-center/defender-for-resource-manager-introduction.md)
    - [Azure Defender for DNS](../security-center/defender-for-dns-introduction.md)

**Azure Security Center FAQ**

For Azure Security Center FAQ, see [Azure Security Center frequently asked questions public documentation](../security-center/faq-general.md). Additional FAQ for Azure Security Center in Azure Government are listed below.

**What will customers be charged for Azure Security Center in Azure Government?**</br>
Azure Security Center's integrated cloud workload protection platform (CWPP), Azure Defender, brings advanced, intelligent, protection of your Azure and hybrid resources and workloads. Azure Defender is free for the first 30 days. Should you choose to continue to use public preview or generally available features of Azure Defender beyond 30 days, we automatically start to charge for the service.

**Is Azure Security Center available for DoD customers?**</br>
Azure Security Center is deployed in Azure Government regions but not in Azure Government for DoD regions. Azure resources created in DoD regions can still utilize Security Center capabilities. However, using it will result in Security Center collected data being moved out from DoD regions and stored in Azure Government regions. By default, all Security Center features which collect and store data are disabled for resources hosted in DoD regions. The type of data collected and stored varies depending on the selected feature. Customers who want to enable Azure Security Center features for DoD resources are advised to consider data separation and protection requirements before doing so.

### [Azure Sentinel](../sentinel/overview.md)

The following **features have known limitations** in Azure Government:

- Office 365 data connector
    - The Office 365 data connector can be used only for [Office 365 GCC High and Office 365 DoD](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod). Office 365 GCC can be accessed only from global (commercial) Azure.

- AWS CloudTrail data connector
    - The AWS CloudTrail data connector can be used only for [AWS in the Public Sector](https://aws.amazon.com/government-education/).

### [Enterprise Mobility + Security (EMS)](/enterprise-mobility-security)

For information about EMS suite capabilities in Azure Government, see the [Enterprise Mobility + Security for US Government Service Description](/enterprise-mobility-security/solutions/ems-govt-service-description).


## Storage

This section outlines variations and considerations when using Storage services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=hpc-cache,managed-disks,storsimple,backup,storage&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

### [Azure Storage](../storage/index.yml)

For a Quickstart that will help you get started with Storage in Azure Government, see [Develop with Storage API on Azure Government](./documentation-government-get-started-connect-to-storage.md).

**Storage pairing in Azure Government**</br>
Azure relies on [paired regions](../best-practices-availability-paired-regions.md) to deliver [geo-redundant storage](../storage/common/storage-redundancy.md). The following table shows the primary and secondary region pairings in Azure Government.

|Geography|Regional Pair A|Regional Pair B|
|---------|---------------|---------------|
|US Government|US Gov Arizona|US Gov Texas|
|US Government|US Gov Virginia|US Gov Texas|

Table in Guidance for developers section shows URL endpoints for main Azure Storage services.

> [!NOTE]
> All your scripts and code need to account for the appropriate endpoints. See [**Configure Azure Storage Connection Strings**](../storage/common/storage-configure-connection-string.md).

For more information on APIs, see [Cloud Storage Account Constructor](/java/api/com.microsoft.azure.storage.cloudstorageaccount.cloudstorageaccount).

The endpoint suffix to use in these overloads is *core.usgovcloudapi.net*.

> [!NOTE]
> If error 53 ("The network path was not found") is returned while you're [**mounting the file share**](../storage/files/storage-dotnet-how-to-use-files.md), a firewall might be blocking the outbound port. Try mounting the file share on VM that's in the same Azure subscription as the storage account.

When you're deploying the **StorSimple** Manager service, use the [https://portal.azure.us/](https://portal.azure.us/) URL for the Azure Government portal. For deployment instructions for [StorSimple Virtual Array](../storsimple/storsimple-ova-system-requirements.md), see StorSimple Virtual Array system requirements. For the StorSimple 8000 series, see [StorSimple software, high availability, and networking requirements](../storsimple/storsimple-8000-system-requirements.md) and go to the **Deploy** section from the left menu. For more information on StorSimple, see the [StorSimple documentation](../storsimple/index.yml).

### [Azure Import/Export](../import-export/storage-import-export-service.md)

With Import/Export jobs for US Gov Arizona or US Gov Texas, the mailing address is for US Gov Virginia. The data is loaded into selected storage accounts from the US Gov Virginia region.

For DoD IL5 data, use a DoD region storage account to ensure that data is loaded directly into the DoD regions. For more information, see [Azure Import/Export IL5 isolation guidance](./documentation-government-impact-level-5.md#azure-importexport-service).

For all jobs, we recommend that you rotate your storage account keys after the job is complete to remove any access granted during the process. For more information, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md).


## Web

This section outlines variations and considerations when using Web services in the Azure Government environment. For service availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud,signalr-service,api-management,notification-hubs,search,cdn,app-service-linux,app-service&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia).

### [API Management](../api-management/index.yml)

The following API Management **features are not currently available** in Azure Government:

- Azure AD B2C integration

### [App Service](../app-service/overview.md)

The following App Service **features are not currently available** in Azure Government:

- Resource
    - App Service Certificate
- Deployment
    - Deployment options: only Local Git Repository and External Repository are available
- Development tools
    - Resource explorer


## Next steps

Learn more about Azure Government:

- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)

Start using Azure Government:

- [Guidance for developers](./documentation-government-developer-guide.md)
- [Connect with the Azure Government portal](./documentation-government-get-started-connect-with-portal.md)
