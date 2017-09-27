---
title: Azure service availability in China | Microsoft Docs
description: This article highlights the services available in global Azure and Azure China  21Vianet 21Vianet side-by-side, making for an easy comparison of the two. 
services: china
cloud: na
documentationcenter: na
author: v-wimarc
manager: edprice

ms.assetid: na
ms.service: china
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/29/2017
ms.author: v-wimarc
---
# Azure service availability in China

The following tables compare services available in global Azure and Microsoft Azure operated by 21Vianet (Azure China  21Vianet). In the tables, GA means *general availability* and Preview means *available in preview*.

> [!NOTE]
> New services continue to be added. For the latest services, go to [http://www.azure.cn/](http://www.azure.cn/).

## Compute services
----------------

| Services                   | Global Azure                                                                                                                                                                                              | Azure China  21Vianet                                                                                                                                     |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| Virtual machines           | A series Basic <br>A series Standard <br>Av2 series <br>D series <br>Dv2 series <br>F series <br>G series <br>N series <br>H series <br>A8, A9 network optimized <br>A10, A11 compute optimized <br>Disk Encryption - Linux <br>Disk Encryption – Windows | A series Basic <br>A series Standard <br>Av2 series <br>D series <br>Dv2 series <br>F series <br>Disk Encryption - Linux (Preview) <br>Disk Encryption - Windows (Preview)  |
| Virtual Machine Scale Sets | Supported for all VM types                                                                                                                                                                                | Supported for all VM types                                                                                                                      |
| Azure Cloud Services       | A series <br>D series <br>Dv2 series <br>G series <br>A8, A9 network optimized <br>A10, A11 compute optimized                                                                                                                 | A series <br>D series <br>Dv2 series                                                                                                                    |
| Azure Batch                | GA                                                                                                                                                                                                        | GA                                                                                                                                              |
| Azure Service Fabric       | GA <br>Service Fabric for Linux (Preview)                                                                                                                                                                     | GA Service <br>Fabric for Linux (Preview)                                                                                                           |
| Azure Functions            | Preview                                                                                                                                                                                                   | *Not available*                                                                                                                                 |
| Azure Container Service    | GA                                                                                                                                                                                                        | *Not available*                                                                                                                                 |
| Azure Container Registry   | Preview                                                                                                                                                                                                   | *Not available*                                                                                                                                 |
|

## Storage services
----------------

| Services                                        | Global Azure                                                | Azure China  21Vianet                                                 |
|-------------------------------------------------|-------------------------------------------------------------|-------------------------------------------------------------|
| Azure Storage <br>(Blob, Queue, File, Disk, Table)  | Standard Storage<br> Premium Storage <br>Storage Service Encryption | Standard Storage <br>Premium Storage <br>Storage Service Encryption |
| Hot/Cool Blob Storage Tiers                     | GA                                                          | GA                                                          |
| Azure StorSimple                                | StorSimple 5000 <br>StorSimple <br>7000 StorSimple 8000             | StorSimple 5000<br> StorSimple 7000                             |
| Azure Backup                                    | File backup <br>IaaS VM backup                                  | File backup <br>IaaS VM backup                                  |
| Azure Site Recovery                             | GA <br>Supports: <br>- On-premises VMM to Azure <br>- On-premises Hyper-V to Azure <br>- On-premises VMware or physical server to Azure (preview) <br>- On-premises VMware site to another <br>- Protect SQL Server (preview                                             | GA <br>Supports:<br>- On-premises VMM to Azure  <br>- On-premises Hyper-V to Azure                                             |
| Azure Import/Export                             | GA                                                          | GA                                                          |
| Azure Managed Disks                             | GA                                                          | *Not available*                                             |
|




## Networking services
-------------------

| Services                  | Global Azure                                                                                 | Azure China  21Vianet                                                                                 |
|---------------------------|----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| Virtual networks          | Static/Dynamic Routing VPN Gateway <br>Standard VPN Gateway <br>High Performance VPN Gateway         | Static/Dynamic Routing VPN Gateway <br>Standard VPN Gateway <br>High Performance VPN Gateway        |
| Azure ExpressRoute        | Provides the following port speeds:<br> 50 Mbps  <br>100 Mbps <br>200 Mbps <br>500 Mbps <br>1 Gbps <br>2 Gbps <br>5 Gbps <br>10 Gbps | Provides the following port speeds: <br>50 Mbps <br>100 Mbps <br>200 Mbps <br>500 Mbps <br>1 Gbps <br>2 Gbps <br>5 Gbps <br>10 Gbps |
| Azure DNS                 | GA                                                                                           | *Not available*                                                                             |
| Azure Traffic Manager     | GA                                                                                           | GA                                                                                          |
| Azure Load Balancer       | GA                                                                                           | GA                                                                                          |
| Azure Network Watcher     | GA                                                                                           | *Not available*                                                                             |
| Azure Application Gateway | GA                                                                                           | GA                                                                                          |
|

## Web and mobile services
-----------------------

| Services                  | Global Azure                                            | Azure China  21Vianet                                             |
|---------------------------|---------------------------------------------------------|---------------------------------------------------------|
| Azure Mobile App Service  | Free <br>Shared <br>Basic <br>Standard <br>Premium  <br><br>Available services: <br>- Web App<br>- Mobile App<br>- API App<br>- Logic App<br>- Web App on Linux (Preview)| Free <br>Shared <br>Basic <br>Standard <br>Premium  <br><br>Available services: <br>- Web Apps<br>- Mobile Apps <br>- API Apps|
| Azure Mobile Engagement   | GA                                                      | *Not available*                                         |
| Azure Search              | Free <br>Basic <br>Standard S1 <br>Standard S2<br> Standard S3          | *Not available*                                         |
|

 

## Databases
---------

| Services                    | Global Azure                                                                                                              | Azure China  21Vianet                                                                                                               |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| SQL Database                | Single database <br>(Basic, Standard, Premium, Geo-replication)  <br><br>Elastic database <br>(Basic, Standard, Premium, Geo-replication) | Single database <br>(Basic, Standard, Premium, Geo-replication)  <br><br>Elastic database <br>(Basic, Standard, Premium, Geo-replication) |
| SQL Data Warehouse          | GA                                                                                                                        | GA                                                                                                                        |
| SQL Server Stretch Database | GA                                                                                                                        | GA                                                                                                                        |
| Azure Redis Cache           | Basic <br>Standard <br>Premium                                                                                                    | Basic <br>Standard <br>Premium                                                                                                    |
| Azure DocumentDB            | GA                                                                                                                        | GA                                                                                                                        |
| MySQL Database on Azure     | *Not available*                                                                                                           | MS1 <br>MS2 <br>MS3 <br>MS4 <br>MS5 <br>MS6                                                                                                   |
|

## Intelligence and analytics services
-----------------------------------

| Services                     | Global Azure                                                  | Azure China  21Vianet                                                   |
|------------------------------|---------------------------------------------------------------|---------------------------------------------------------------|
| Cortana Intelligence Suite   | GA                                                            | *Not available*                                                            |
| Microsoft Cognitive Services | GA for Bing APIs, Translator APIs; in preview for other APIs  | In preview for Computer Vision API, Face API, and Emotion API |
| Azure HDInsight              | Hbase, Storm, R Server, Spark, Kafka<br><br> HDInsight on Linux<br>- General-purpose node<br>- Optimized node<br>- A10, A11 compute-intensive node<br>       | Hbase, Storm, R Server Spark, Kafka <br><br>HDInsight on Linux<br>- General-purpose node<br>- Optimized node<br>        |
| Azure Machine Learning       | Free <br>Standard                                                 | *Not available*                                               |
| Azure Stream Analytics       | GA                                                            | GA                                                            |
| Azure Bot Service            | Preview                                                       | *Not available*                                               |
| Azure Data Factory           | Low frequency <br>High frequency                                  | *Not available*                                               |
| Azure Data Lake Store        | GA                                                            | *Not available*                                               |
| Azure Data Lake Analytics    | GA                                                            | *Not available*                                               |
| Microsoft Power BI <br>(SaaS)          | GA                                                            | GA                                                                                                          |
| Power BI <br>(PaaS, embedded)                     | GA                                                            | GA                                                            |
|              |                                                               |                                                               |




## Internet of Things (IoT) services
---------------------------------

| Services                | Global Azure        | Azure China  21Vianet         |
|-------------------------|---------------------|---------------------|
| Azure Events Hub        | Basic <br>Standard      | Basic <br>Standard      |
| Azure IoT Hub           | GA                  | GA                  |
| Azure IoT Suite         | GA                  | GA                  |
| Azure Stream Analytics  | GA                  | GA                  |
| Azure Notification Hubs | Free <br>Basic <br>Standard | Free <br>Basic <br>Standard |
|

## Media services and Azure Content Delivery Network (CDN)
-------------------------------------------------------

| Services        | Global Azure                                                                                       | Azure China  21Vianet                     |
|-----------------|----------------------------------------------------------------------------------------------------|---------------------------------|
| Media services  | Encoding <br>Indexing <br>Streaming <br>DRM <br>Support for multi-DRM: PlayReady, Widevine, and FairPlay streaming | Encoding <br>Indexing <br>Streaming <br>DRM |
| CDN             | Provided by EdgeCast                                                                               | Provided by local CDN provider  |
|

## Enterprise integration
----------------------

| Services               | Global Azure                          | Azure China  21Vianet     |
|------------------------|---------------------------------------|-----------------|
| Azure BizTalk Services | Free <br>Developer <br>Basic <br>Standard <br>Premium | *Not available* |
| Azure Service Bus      | Basic <br>Standard <br>Premium                | Basic <br>Standard  |
| Azure API Management   | Developer <br>Standard <br>Premium            | *Not available* |
| Azure Logic Apps       | GA                                    | *Not available* |
| Azure Data Catalog     | Free <br>Standard                         | *Not available* |
|

## Security and identity services
------------------------------

| Services                          | Global Azure       | Azure China  21Vianet                                                      |
|-----------------------------------|--------------------|------------------------------------------------------------------|
| Azure Active Directory (AD)       | Free <br>Basic <br>Premium | Free <br>(Self-service password change is available)                 |
| Azure AD B2C                      | GA                 | *Not available*                                                  |
| Azure AD Domain Services          | GA                 | *Not available*                                                  |
| Azure Multi-Factor Authentication | GA                 | GA                                                               |
| Azure Key Vault                   | Standard <br>Premium   | Standard <br>Premium  <br>No support for hardware security modules (HSM) |
| Azure Security Center             | Free Standard      | *Not available*                                                  |
|

## Developer tools
---------------

| Services                    | Global Azure                | Azure China  21Vianet     |
|-----------------------------|-----------------------------|-----------------|
| Visual Studio Team Services | Basic <br>Professional <br>Advanced | *Not available* |
| Application Insights        | Free <br>Basic <br>Enterprise       | *Not available* |
| Azure Dev Test Labs         | Free                        | *Not available* |
| HockeyApp                   | GA                          | *Not available* |
|

## Monitoring and management
-------------------------

| Services                   | Global Azure                                 | Azure China  21Vianet           |
|----------------------------|----------------------------------------------|-----------------------|
| Azure Portal               | GA                                           | Preview               |
| Azure Resource Manager     | GA                                           | GA                    |
| Azure Marketplace          | GA                                           | Preview               |
| Azure Scheduler            | Free <br>Standard <br>Premium                        | Free <br>Standard <br>Premium |
| Azure Automation           | Free <br>Basic <br>Desired State Configuration (DSC) | Free <br>Basic            |
| Azure Operational Insights | Free <br>Standard <br>Premium                        | *Not available*       |
| Azure Log Analytics        | Free <br>Standard <br>Premium                        | *Not available*       |
|

## Next steps
- [Check for new services](http://www.azure.cn/)


