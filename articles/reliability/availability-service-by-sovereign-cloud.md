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

## Legend

Product support is represented by the following symbols:

| Symbol | Meaning | Description |
|---------|--------|----------|
| &#10060; | Unsupported | Unsupported means that the product is not available in that particular region. |
| &#x2705; | Supported | Supported means that the product is available in that particular region and in no way differs from the public cloud offering. |
| &#x26A0; | Partial support | Partial support for any region indicates that the product features offered for the public cloud are not all available for that particular region. Product features for that product could have GA, Preview, or Deprecating public status. Select the product name to get more information as to which features are supported and any other limitations to that support.|

## China

### AI + machine learning

This section outlines variations and considerations when using Azure Bot Service, Azure Machine Learning, and Cognitive Services in the Azure China environment.

| Product | CH-East |  CH-East-2 | CH-North | CH-North-2  |CH-North-3|
|---------|--------|------------|----------|-------------|-----------|
| [Machine learning](../machine-learning/reference-machine-learning-cloud-parity.md#azure-china-21vianet)|&#10060; | &#x26A0;| &#10060;|&#10060;| &#10060; |
| [Cognitive Services: Speech](../cognitive-services/speech-service/sovereign-clouds?tabs=c-sharp#azure-china)| &#10060;|  &#x26A0; | &#10060;|  &#x26A0; | &#10060;

### Media

This section outlines variations and considerations when using Media services in the Azure China environment.

| Product | CH-East |  CH-East-2 | CH-North | CH-North-2  |CH-North-3|
|---------|--------|------------|------------|------------|------------|
| [Azure Media Services](../media-services/latest/azure-clouds-regions.md#china)  | &#x26A0;  |  &#x26A0;   | &#x26A0;  |&#x26A0;   | &#x26A0;  | 

### Networking

This section outlines variations and considerations when using Networking services in the Azure Government environment. 

| Product | CH-East |  CH-East-2 | CH-North | CH-North-2  |CH-North-3|
|---------|--------|------------|------------|------------|------------|
| [Private Link](../private-link/availability.md) | &#x26A0; |  &#x26A0; | &#x26A0;| &#x26A0;| &#x26A0;

### China REST endpoints

| REST endpoint | Global Azure | China-Government |
|---------------|--------------|------------------|
| Management plane |	`https://management.azure.com/` |	`https://management.chinacloudapi.cn/` |
| Data plane |	`https://{location}.experiments.azureml.net`	| `https://{location}.experiments.ml.azure`.cn |
| Azure Active Directory	| `https://login.microsoftonline.com`	 | `https://login.chinacloudapi.cn` |



## US Government

Azure Government is a cloud services platform built upon the foundational principles of security, privacy, and compliance. Customers eligible for Azure Government benefit from a physically isolated instance of Azure.

For tutorials, how-to or get started guides, and information on deployment and compliance see [Azure Government documentation](../azure-government/index.yml).

### AI + machine learning

This section outlines variations and considerations when using Azure Bot Service, Azure Machine Learning, and Cognitive Services in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure Bot Service](../azure-government/compare-azure-government-global-azure.md#azure-bot-service) | &#x26A0; | &#x26A0; |
| [Azure Machine learning](../machine-learning/reference-machine-learning-cloud-parity.md#azure-government)|  &#x26A0; |  &#x26A0; |
| [Cognitive Services: Content Moderator](../azure-government/compare-azure-government-global-azure.md#cognitive-services-content-moderator)|  &#x26A0; |  &#x26A0; |
| [Cognitive Services: Language Understanding (LUIS)](../azure-government/compare-azure-government-global-azure.md#cognitive-services-language-understanding-luis)|  &#x26A0; |  &#x26A0; |
| [Cognitive Services: Speech](../cognitive-services/speech-service/sovereign-clouds?tabs=c-sharp#azure-government-united-states)|  &#x26A0; |  &#x26A0; |
| [Cognitive Services: Translator](../azure-government/compare-azure-government-global-azure.md#cognitive-services-translator)|  &#x26A0; |  &#x26A0; |

### Analytics

This section outlines variations and considerations when using Analytics services in the Azure Government environment. 

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure HDInsight](../azure-government/compare-azure-government-global-azure.md#azure-hdinsight) | &#x2705; |  &#x2705; 
| [Power BI](../power-bi/enterprise/service-govus-overview.md)| &#x2705; | &#x2705; |
| [Power BI Embedded](../power-bi/developer/embedded/embed-sample-for-customers-national-clouds.md)| &#x2705; | &#x2705; 

### Databases

This section outlines variations and considerations when using Databases services in the Azure Government environment. 

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure Database for MySQL](../azure-government/compare-azure-government-global-azure.md#azure-database-for-mysql) | &#x26A0; |  &#x26A0; 
| [Azure Database for PostgreSQL](../azure-government/compare-azure-government-global-azure.md#azure-database-for-postgresql)|&#x26A0; | &#x26A0; |
| [Azure SQL Managed Instance](../azure-government/compare-azure-government-global-azure.md#azure-sql-managed-instance)| &#x26A0; | &#x26A0; 


### Developer Tools

This section outlines variations and considerations when using Developer tools in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Enterprise Dev/Test subscription offer](../azure-government/compare-azure-government-global-azure.md#enterprise-devtest-subscription-offer) |   &#x26A0; |  &#x26A0;

### Identity

This section outlines variations and considerations when using Identity services in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure Active Directory Premium P1 and P2](../azure-government/compare-azure-government-global-azure.md#azure-active-directory-premium-p1-and-p2) |   &#x26A0; |  &#x26A0;

### Management and Governance

This section outlines variations and considerations when using Management and Governance services in the Azure Government environment. 

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Automation](../azure-government/compare-azure-government-global-azure.md#automation) | &#x26A0; |  &#x26A0; 
| [Azure Advisor](../azure-government/compare-azure-government-global-azure.md#azure-advisor)|&#x26A0; | &#x26A0; |
| [Azure Lighthouse](../azure-government/compare-azure-government-global-azure.md#azure-lighthouse)| &#x26A0; | &#x26A0; 
| [Azure Monitor](../azure-government/compare-azure-government-global-azure.md#azure-monitor)| &#x26A0; | &#x26A0; 
| [Application Insights](../azure-government/compare-azure-government-global-azure.md#application-insights)| &#x26A0; | &#x26A0; 

### Cost Management and Billing

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure Cost Management + Billing](../azure-government/compare-azure-government-global-azure.md#cost-management-and-billing) | &#x26A0; |  &#x26A0; 


### Media

This section outlines variations and considerations when using Media services in the Azure Government environment.

| Product | US-Virginia | US-Texas | US-Arizona |
|---------|--------|------------|------------|
| [Azure Media Services](../media-services/latest/azure-clouds-regions.md#us-government-cloud) |&#x26A0;  |  &#x26A0; 

### Migration

This section outlines variations and considerations when using Migration services in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure Migrate](../azure-government/compare-azure-government-global-azure.md#azure-migrate) | &#x26A0; |  &#x26A0; 

### Networking

This section outlines variations and considerations when using Networking services in the Azure Government environment. 

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure ExpressRoute](../azure-government/compare-azure-government-global-azure.md#azure-expressroute) | &#x26A0; |  &#x26A0; 
| [Private Link](../private-link/availability.md) | &#x26A0; |  &#x26A0; 
| [Traffic Manager](../azure-government/compare-azure-government-global-azure.md#traffic-manager) | &#x26A0; |  &#x26A0; 


### Security

This section outlines variations and considerations when using Security services in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Microsoft Defender for IoT](../azure-government/compare-azure-government-global-azure.md#automation) | &#x26A0; |  &#x26A0; 
| [Azure Information Protection](../azure-government/compare-azure-government-global-azure.md#azure-information-protection)|&#x2705;  | &#x2705;  |
| [Microsoft Defender for Cloud](../security/fundamentals/feature-availability.md#microsoft-defender-for-cloud)| &#x26A0; | &#x26A0; 
| [Microsoft Sentinel](../security/fundamentals/feature-availability.md#microsoft-sentinel)| &#x26A0; | &#x26A0; 

### Storage

This section outlines variations and considerations when using Storage services in the Azure Government environment.


| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure Managed Disks](../azure-government/compare-azure-government-global-azure.md#azure-managed-disks) | &#x26A0; |  &#x26A0; 
| [Azure NetApp Files](../azure-netapp-files/azure-government.md) | &#x26A0; |  &#x26A0; 
| [Azure Import/Export](../azure-government/compare-azure-government-global-azure.md#azure-importexport) |&#x2705; |  &#x2705;; 


### Web

This section outlines variations and considerations when using Web services in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [API Management](../azure-government/compare-azure-government-global-azure.md#api-management) | &#x26A0; |  &#x26A0; 
| [App Service](../azure-government/compare-azure-government-global-azure.md#app-service)|&#x26A0;  |  &#x26A0; |
| [Azure Functions](../azure-government/compare-azure-government-global-azure.md#app-service)|&#x2705;  | &#x2705;  |

### US Government REST endpoints

To view the US Government REST endpoints, go to [Azure Government Documentation: Guidance for developers](../azure-government/compare-azure-government-global-azure.md#guidance-for-developers).


## Next steps

-[Azure services and regions that support availability zones](az-service-support.md)