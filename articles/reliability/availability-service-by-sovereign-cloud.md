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
| [Limited]()| Limited | Limited indicates that some features may not be available or may have limitations within those features themselves. |
| [Variations]() | Variations | Variations indicates that all features are supported, but with some variations.|



## China

### AI + machine learning

This section outlines variations and considerations when using Azure Bot Service, Azure Machine Learning, and Cognitive Services in the Azure China environment.

| Product | CH-East |  CH-East-2 | CH-North | CH-North-2  |CH-North-3|
|---------|--------|------------|----------|-------------|-----------|
| [Machine learning](../machine-learning/reference-machine-learning-cloud-parity.md#azure-china-21vianet)|&#10060; | [Limited]()| &#10060;|&#10060;| &#10060; |
| [Cognitive Services: Speech](../cognitive-services/speech-service/sovereign-clouds?tabs=c-sharp#azure-china)| &#10060;|  [Limited]() | &#10060;|  [Limited]() | &#10060;

### Media

This section outlines variations and considerations when using Media services in the Azure China environment.

| Product | CH-East |  CH-East-2 | CH-North | CH-North-2  |CH-North-3|
|---------|--------|------------|------------|------------|------------|
| [Azure Media Services](../media-services/latest/azure-clouds-regions.md#china)  | [Limited]()  |  [Limited]()   | [Limited]()  |[Limited]()   | [Limited]()  | 

### Networking

This section outlines variations and considerations when using Networking services in the Azure Government environment. 

| Product | CH-East |  CH-East-2 | CH-North | CH-North-2  |CH-North-3|
|---------|--------|------------|------------|------------|------------|
| [Private Link](../private-link/availability.md) | [Limited]() |  [Limited]() | [Limited]()| [Limited]()| [Limited]()

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
| [Azure Bot Service](../azure-government/compare-azure-government-global-azure.md#azure-bot-service) | [Limited]() | [Limited]() |
| [Azure Machine learning](../machine-learning/reference-machine-learning-cloud-parity.md#azure-government)|  [Limited]() |  [Limited]() |
| [Cognitive Services: Content Moderator](../azure-government/compare-azure-government-global-azure.md#cognitive-services-content-moderator)|  [Limited]() |  [Limited]() |
| [Cognitive Services: Language Understanding (LUIS)](../azure-government/compare-azure-government-global-azure.md#cognitive-services-language-understanding-luis)|  [Limited]() |  [Limited]() |
| [Cognitive Services: Speech](../cognitive-services/speech-service/sovereign-clouds?tabs=c-sharp#azure-government-united-states)|  [Limited]() |  [Limited]() |
| [Cognitive Services: Translator](../azure-government/compare-azure-government-global-azure.md#cognitive-services-translator)|  [Limited]() |  [Limited]() |

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
| [Azure Database for MySQL](../azure-government/compare-azure-government-global-azure.md#azure-database-for-mysql) | [Limited]() |  [Limited]() 
| [Azure Database for PostgreSQL](../azure-government/compare-azure-government-global-azure.md#azure-database-for-postgresql)|[Limited]() | [Limited]() |
| [Azure SQL Managed Instance](../azure-government/compare-azure-government-global-azure.md#azure-sql-managed-instance)| [Limited]() | [Limited]() 


### Developer Tools

This section outlines variations and considerations when using Developer tools in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Enterprise Dev/Test subscription offer](../azure-government/compare-azure-government-global-azure.md#enterprise-devtest-subscription-offer) |   [Limited]() |  [Limited]()

### Identity

This section outlines variations and considerations when using Identity services in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure Active Directory Premium P1 and P2](../azure-government/compare-azure-government-global-azure.md#azure-active-directory-premium-p1-and-p2) |   [Limited]() |  [Limited]()

### Management and Governance

This section outlines variations and considerations when using Management and Governance services in the Azure Government environment. 

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Automation](../azure-government/compare-azure-government-global-azure.md#automation) | [Limited]() |  [Limited]() 
| [Azure Advisor](../azure-government/compare-azure-government-global-azure.md#azure-advisor)|[Limited]() | [Limited]() |
| [Azure Lighthouse](../azure-government/compare-azure-government-global-azure.md#azure-lighthouse)| [Limited]() | [Limited]() 
| [Azure Monitor](../azure-government/compare-azure-government-global-azure.md#azure-monitor)| [Limited]() | [Limited]() 
| [Application Insights](../azure-government/compare-azure-government-global-azure.md#application-insights)| [Limited]() | [Limited]() 

### Cost Management and Billing

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure Cost Management + Billing](../azure-government/compare-azure-government-global-azure.md#cost-management-and-billing) | [Limited]() |  [Limited]() 


### Media

This section outlines variations and considerations when using Media services in the Azure Government environment.

| Product | US-Virginia | US-Texas | US-Arizona |
|---------|--------|------------|------------|
| [Azure Media Services](../media-services/latest/azure-clouds-regions.md#us-government-cloud) |[Limited]()  |  [Limited]() 

### Migration

This section outlines variations and considerations when using Migration services in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure Migrate](../azure-government/compare-azure-government-global-azure.md#azure-migrate) | [Limited]() |  [Limited]() 

### Networking

This section outlines variations and considerations when using Networking services in the Azure Government environment. 

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure ExpressRoute](../azure-government/compare-azure-government-global-azure.md#azure-expressroute) | [Limited]() |  [Limited]() 
| [Private Link](../private-link/availability.md) | [Limited]() |  [Limited]() 
| [Traffic Manager](../azure-government/compare-azure-government-global-azure.md#traffic-manager) | [Limited]() |  [Limited]() 


### Security

This section outlines variations and considerations when using Security services in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Microsoft Defender for IoT](../azure-government/compare-azure-government-global-azure.md#automation) | [Limited]() |  [Limited]() 
| [Azure Information Protection](../azure-government/compare-azure-government-global-azure.md#azure-information-protection)|&#x2705;  | &#x2705;  |
| [Microsoft Defender for Cloud](../security/fundamentals/feature-availability.md#microsoft-defender-for-cloud)| [Limited]() | [Limited]() 
| [Microsoft Sentinel](../security/fundamentals/feature-availability.md#microsoft-sentinel)| [Limited]() | [Limited]() 

### Storage

This section outlines variations and considerations when using Storage services in the Azure Government environment.


| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Azure Managed Disks](../azure-government/compare-azure-government-global-azure.md#azure-managed-disks) | [Limited]() |  [Limited]() 
| [Azure NetApp Files](../azure-netapp-files/azure-government.md) | [Limited]() |  [Limited]() 
| [Azure Import/Export](../azure-government/compare-azure-government-global-azure.md#azure-importexport) |&#x2705; |  &#x2705;; 


### Web

This section outlines variations and considerations when using Web services in the Azure Government environment.

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [API Management](../azure-government/compare-azure-government-global-azure.md#api-management) | [Limited]() |  [Limited]() 
| [App Service](../azure-government/compare-azure-government-global-azure.md#app-service)|[Limited]()  |  [Limited]() |
| [Azure Functions](../azure-government/compare-azure-government-global-azure.md#app-service)|&#x2705;  | &#x2705;  |

### US Government REST endpoints

To view the US Government REST endpoints, go to [Azure Government Documentation: Guidance for developers](../azure-government/compare-azure-government-global-azure.md#guidance-for-developers).


## Next steps

-[Azure services and regions that support availability zones](az-service-support.md)