---
title: Azure Services in FedRAMP and DoD SRG Audit Scope
description: This article contains tables for Azure Public and Azure Government that illustrate what FedRAMP (Moderate vs. High) and DoD SRG (Impact level 2, 4, or 5) audit scope a given service has reached.
author: davib
ms.author: davib 
ms.date: 5/17/2019
ms.topic: article
ms.service: security
ms.reviewer: rochiou
---

# Azure services by FedRAMP and DoD CC SRG audit scope

Microsoft’s government cloud services meet the demanding requirements of the US Federal Risk & Authorization Management Program (FedRAMP) and of the US Department of Defense, from information impact levels 2 through 5. By deploying protected services including Azure Government, Office 365 U.S. Government, and Dynamics 365 Government, federal and defense agencies can leverage a rich array of compliant services.

This article provides a detailed list of in-scope cloud services across Azure and Azure Government for FedRAMP and DoD CC SRG compliance offerings.

#### Terminology/Symbols used

* DoD CC SRG = Department of Defense Cloud Computing Security Requirements Guide
* IIL = Information Impact Level
* FedRAMP = Federal Risk and Authorization Management Program  
* :heavy_check_mark: = indicates the service has achieved this audit scope.

## Azure public services by audit scope
| _Last Updated: May 2019_ |

| Azure Service| DoD CC SRG IIL 2 | FedRAMP Moderate | FedRAMP High | Planned 2019 |
| ------------ |:---------------:|:----------------:|:------------:|:------------:|
| [API Management](https://azure.microsoft.com/en-us/services/api-management/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [App Service: API Apps](https://azure.microsoft.com/en-us/services/app-service/api/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [App Service: Mobile Apps](https://azure.microsoft.com/en-us/services/app-service/mobile/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [App Service: Web Apps](https://azure.microsoft.com/en-us/services/app-service/web/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Application Gateway](https://azure.microsoft.com/en-us/services/application-gateway/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Automation](https://azure.microsoft.com/en-us/services/automation/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Active Directory (Free and Basic)](https://azure.microsoft.com/en-us/services/active-directory/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Active Directory (Premium P1 + P2)](https://azure.microsoft.com/en-us/services/active-directory/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Active Directory B2C](https://azure.microsoft.com/en-us/services/active-directory-b2c/) |  |  |  | :heavy_check_mark: |
| [Azure Active Directory Domain Services](https://azure.microsoft.com/en-us/services/active-directory-ds/) | |  |  | :heavy_check_mark: |
| [Azure Advanced Threat Protection](https://azure.microsoft.com/en-us/features/azure-advanced-threat-protection/) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Advisor](https://azure.microsoft.com/en-us/services/advisor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Analysis Services](https://azure.microsoft.com/en-us/services/analysis-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Container Service](https://docs.microsoft.com/en-us/azure/container-service/) |  |  |  | :heavy_check_mark: |
| [Azure Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Data Lake Storage Gen1](https://azure.microsoft.com/en-us/services/storage/data-lake-storage/) |  |  |  | :heavy_check_mark: |
| [Azure Database for MySQL](https://azure.microsoft.com/en-us/services/mysql/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/services/postgresql/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Database Migration Service](https://azure.microsoft.com/en-us/services/database-migration/) |  |  |  | :heavy_check_mark: |
| [Azure Databricks](https://azure.microsoft.com/en-us/services/databricks/) ** |  |  |  |  |
| [Azure DDoS Protection](https://azure.microsoft.com/en-us/services/ddos-protection/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure DevOps (formerly VSTS)](https://azure.microsoft.com/en-us/services/devops/) | |  |  | :heavy_check_mark: |
| [Azure DevTest Labs](https://azure.microsoft.com/en-us/services/devtest-lab/) |  |  |  | :heavy_check_mark: |
| [Azure DNS](https://azure.microsoft.com/en-us/services/dns/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure File Sync](https://azure.microsoft.com/en-us/services/storage/files/) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Front Door](https://azure.microsoft.com/en-us/services/frontdoor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Information Protection](https://azure.microsoft.com/en-us/services/information-protection/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Intune](https://docs.microsoft.com/en-us/intune/what-is-intune) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/) | |  |  | :heavy_check_mark: |
| [Azure Maps](https://azure.microsoft.com/en-us/services/azure-maps/) |  |  |  | :heavy_check_mark: |
| [Azure Migrate](https://azure.microsoft.com/en-us/services/azure-migrate/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Monitor](https://azure.microsoft.com/en-us/services/monitor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Policy](https://azure.microsoft.com/en-us/services/azure-policy/) |  |  |  | :heavy_check_mark: |
| [Azure Resource Manager](https://azure.microsoft.com/en-us/features/resource-manager/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Search](https://azure.microsoft.com/en-us/services/search/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Service Manager (RDFE)](https://docs.microsoft.com/en-us/previous-versions/azure/ee460799(v=azure.100)) | :heavy_check_mark: | :heavy_check_mark: |  |  |
| [Azure Site Recovery](https://azure.microsoft.com/en-us/services/site-recovery/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Backup](https://azure.microsoft.com/en-us/services/backup/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Batch](https://azure.microsoft.com/en-us/services/batch/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [BizTalk Services](https://azure.microsoft.com/en-us/services/biztalk-services/) |  |  |  |  |
| [Cloud Shell](https://azure.microsoft.com/en-us/features/cloud-shell/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cloud Services](https://azure.microsoft.com/en-us/services/cloud-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Computer Vision](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Content Moderator](https://azure.microsoft.com/en-us/services/cognitive-services/content-moderator/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Custom Vision](https://azure.microsoft.com/en-us/services/cognitive-services/custom-vision-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Face](https://azure.microsoft.com/en-us/services/cognitive-services/face/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Language Understanding](https://azure.microsoft.com/en-us/services/cognitive-services/language-understanding-intelligent-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: QnA Maker](https://azure.microsoft.com/en-us/services/cognitive-services/qna-maker/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Speech Services](https://azure.microsoft.com/en-us/services/cognitive-services/directory/speech/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Text Analytics](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Translator Text](https://azure.microsoft.com/en-us/services/cognitive-services/speech-translation/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Video Indexer](https://azure.microsoft.com/en-us/services/media-services/video-indexer/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Container Instances](https://azure.microsoft.com/en-us/services/container-instances/) |  |  |  | :heavy_check_mark: |
| [Container Registry](https://azure.microsoft.com/en-us/services/container-registry/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Content Delivery Network](https://azure.microsoft.com/en-us/services/cdn/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Data Catalog](https://azure.microsoft.com/en-us/services/data-catalog/) |  |  |  | :heavy_check_mark: |
| [Data Factory](https://azure.microsoft.com/en-us/services/data-factory/) |  |  |  | :heavy_check_mark: |
| [Data Lake Analytics](https://azure.microsoft.com/en-us/services/data-lake-analytics/) |  |  |  |  |
| [Event Grid](https://azure.microsoft.com/en-us/services/event-grid/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Defender Advanced Threat Protection](https://docs.microsoft.com/en-us/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Event Hubs](https://azure.microsoft.com/en-us/services/event-hubs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [ExpressRoute](https://azure.microsoft.com/en-us/services/expressroute/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Flow](https://docs.microsoft.com/en-us/flow/getting-started) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Functions](https://azure.microsoft.com/en-us/services/functions/) |  |  |  | :heavy_check_mark: |
| [HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Import / Export](https://azure.microsoft.com/en-us/services/storage/import-export/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [IoT Central](https://azure.microsoft.com/en-us/services/iot-central/) |  |  |  | :heavy_check_mark: |
| [IoT Hub](https://azure.microsoft.com/en-us/services/iot-hub/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Key Vault](https://azure.microsoft.com/en-us/services/key-vault/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Load Balancer](https://azure.microsoft.com/en-us/services/load-balancer/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Log Analytics](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/data-platform-logs) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Logic Apps](https://azure.microsoft.com/en-us/services/logic-apps/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Machine Learning Services](https://azure.microsoft.com/en-us/services/machine-learning-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Machine Learning Studio](https://azure.microsoft.com/en-us/services/machine-learning-studio/) |  |  |  | :heavy_check_mark: |
| [Media Services](https://azure.microsoft.com/en-us/services/media-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Azure portal](https://azure.microsoft.com/en-us/features/azure-portal/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Cloud App Security](https://docs.microsoft.com/en-us/cloud-app-security/what-is-cloud-app-security) | |  |  | :heavy_check_mark: |
| [Microsoft Genomics](https://azure.microsoft.com/en-us/services/genomics/) |  |  |  | :heavy_check_mark: |
| [Microsoft PowerApps](https://docs.microsoft.com/en-us/powerapps/powerapps-overview) | | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Stream](https://docs.microsoft.com/en-us/stream/overview) | | :heavy_check_mark: | :heavy_check_mark: |  |
| [Multi-Factor Authentication](https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-mfa-howitworks) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Network Watcher](https://azure.microsoft.com/en-us/services/network-watcher/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Network Watcher Traffic Analytics](https://docs.microsoft.com/en-us/azure/network-watcher/traffic-analytics) |  |  |  | :heavy_check_mark: |
| [Notification Hubs](https://azure.microsoft.com/en-us/services/notification-hubs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Power BI Embedded](https://azure.microsoft.com/en-us/services/power-bi-embedded/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Redis Cache](https://azure.microsoft.com/en-us/services/cache/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Scheduler](https://azure.microsoft.com/en-us/services/scheduler/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Security Center](https://azure.microsoft.com/en-us/services/security-center/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Service Bus](https://azure.microsoft.com/en-us/services/service-bus/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [SQL Data Warehouse](https://azure.microsoft.com/en-us/services/sql-data-warehouse/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [SQL Database](https://azure.microsoft.com/en-us/services/sql-database/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [SQL Server Stretch Database](https://azure.microsoft.com/en-us/services/sql-server-stretch-database/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Storage: Blobs](https://azure.microsoft.com/en-us/services/storage/blobs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Storage: Disks (incl. Managed Disks)](https://azure.microsoft.com/en-us/services/storage/disks/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Storage: Files](https://azure.microsoft.com/en-us/services/storage/files/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Storage: Queues](https://azure.microsoft.com/en-us/services/storage/queues/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Storage: Tables](https://azure.microsoft.com/en-us/services/storage/tables/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [StorSimple](https://azure.microsoft.com/en-us/services/storsimple/) |  |  |  | :heavy_check_mark: |
| [Stream Analytics](https://azure.microsoft.com/en-us/services/stream-analytics/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Time Series Insights](https://azure.microsoft.com/en-us/services/time-series-insights/) |  |  |  | :heavy_check_mark: |
| [Traffic Manager](https://azure.microsoft.com/en-us/services/traffic-manager/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Virtual Machine Scale Sets](https://azure.microsoft.com/en-us/services/virtual-machine-scale-sets/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Virtual Machines (incl. Reserved Instances)](https://azure.microsoft.com/en-us/services/virtual-machines/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Virtual Network](https://azure.microsoft.com/en-us/services/virtual-network/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [VPN Gateway](https://azure.microsoft.com/en-us/services/vpn-gateway/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |

&ast;&ast; Azure Databricks SOC attestation includes SOC 2 Type 2 report only

## Azure government services by audit scope
| _Last Updated: May 2019_ |

| Azure Service | DoD CC SRG IIL 2 | DoD CC SRG IIL 4 | DoD CC SRG IIL 5 | FedRAMP High | Planned 2019
| ------------- |:---------------:|:---------------:|:---------------:|:------------:|:------------:
| [API Management](https://azure.microsoft.com/en-us/services/api-management/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [App Service: API Apps](https://azure.microsoft.com/en-us/services/app-service/api/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [App Service: Mobile Apps](https://azure.microsoft.com/en-us/services/app-service/mobile/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [App Service: Web Apps](https://azure.microsoft.com/en-us/services/app-service/web/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Application Gateway](https://azure.microsoft.com/en-us/services/application-gateway/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Automation](https://azure.microsoft.com/en-us/services/automation/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Active Directory (Free and Basic)](https://azure.microsoft.com/en-us/services/active-directory/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Active Directory (Premium P1 + P2)](https://azure.microsoft.com/en-us/services/active-directory/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Advisor](https://azure.microsoft.com/en-us/services/advisor/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Azure Analysis Services](https://azure.microsoft.com/en-us/services/analysis-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure DB for MySQL](https://azure.microsoft.com/en-us/services/mysql/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure DB for PostgreSQL](https://azure.microsoft.com/en-us/services/postgresql/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure DDoS Protection](https://azure.microsoft.com/en-us/services/ddos-protection/) |  |  |  |  | :heavy_check_mark:
| [Azure DNS](https://azure.microsoft.com/en-us/services/dns/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure File Sync](https://azure.microsoft.com/en-us/services/storage/files/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Azure Front Door](https://azure.microsoft.com/en-us/services/frontdoor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Information Protection](https://azure.microsoft.com/en-us/services/information-protection/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Lab Services](https://azure.microsoft.com/en-us/services/lab-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Migrate](https://azure.microsoft.com/en-us/services/azure-migrate/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Azure Monitor](https://azure.microsoft.com/en-us/services/monitor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Policy](https://azure.microsoft.com/en-us/services/azure-policy/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Azure Resource Manager](https://azure.microsoft.com/en-us/features/resource-manager/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:**&ast;** | :heavy_check_mark: |
| [Azure Security Center](https://azure.microsoft.com/en-us/services/security-center/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Azure Service Manager (RDFE)](https://docs.microsoft.com/en-us/previous-versions/azure/ee460799(v=azure.100)) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Site Recovery](https://azure.microsoft.com/en-us/services/site-recovery/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Backup](https://azure.microsoft.com/en-us/services/backup/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Batch](https://azure.microsoft.com/en-us/services/batch/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Cloud Services](https://azure.microsoft.com/en-us/services/cloud-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Cognitive Services: Custom Speech](https://aka.ms/speechcustomization) |  |  |  |  |
| [Cognitive Services: Translator Speech](https://azure.microsoft.com/en-us/services/cognitive-services/directory/speech/) |  |  |  |  |
| [Cognitive Services: Translator Text](https://azure.microsoft.com/en-us/services/cognitive-services/speech-translation/) |  |  |  |  | :heavy_check_mark:
| [Event Hubs](https://azure.microsoft.com/en-us/services/event-hubs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [ExpressRoute](https://azure.microsoft.com/en-us/services/expressroute/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Flow](https://docs.microsoft.com/en-us/flow/getting-started) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Functions](https://azure.microsoft.com/en-us/services/functions/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Import / Export](https://azure.microsoft.com/en-us/services/storage/import-export/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [IoT Hub](https://azure.microsoft.com/en-us/services/iot-hub/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Key Vault](https://azure.microsoft.com/en-us/services/key-vault/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Load Balancer](https://azure.microsoft.com/en-us/services/load-balancer/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Log Analytics](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/data-platform-logs) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Logic Apps](https://azure.microsoft.com/en-us/services/logic-apps/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Media Services](https://azure.microsoft.com/en-us/services/media-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Microsoft Azure portal](https://azure.microsoft.com/en-us/features/azure-portal/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:**&ast;** | :heavy_check_mark: |
| [Microsoft Graph](https://docs.microsoft.com/en-us/graph/overview) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Microsoft PowerApps](https://docs.microsoft.com/en-us/powerapps/powerapps-overview) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Microsoft Stream](https://docs.microsoft.com/en-us/stream/overview) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: |
| [Multi-Factor Authentication](https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-mfa-howitworks) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Network Watcher](https://azure.microsoft.com/en-us/services/network-watcher/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Notification Hubs](https://azure.microsoft.com/en-us/services/notification-hubs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:**&ast;** | :heavy_check_mark: |
| [Power BI Embedded](https://azure.microsoft.com/en-us/services/power-bi-embedded/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Redis Cache](https://azure.microsoft.com/en-us/services/cache/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Scheduler](https://azure.microsoft.com/en-us/services/scheduler/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Service Bus](https://azure.microsoft.com/en-us/services/service-bus/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [SQL Data Warehouse](https://azure.microsoft.com/en-us/services/sql-data-warehouse/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [SQL Database](https://azure.microsoft.com/en-us/services/sql-database/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [SQL Server Stretch Database](https://azure.microsoft.com/en-us/services/sql-server-stretch-database/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Storage: Blobs](https://azure.microsoft.com/en-us/services/storage/blobs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Storage: Disks (incl. Managed Disks)](https://azure.microsoft.com/en-us/services/storage/disks/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Storage: Files](https://azure.microsoft.com/en-us/services/storage/files/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Storage: Queues](https://azure.microsoft.com/en-us/services/storage/queues/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Storage: Tables](https://azure.microsoft.com/en-us/services/storage/tables/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [StorSimple](https://azure.microsoft.com/en-us/services/storsimple/) | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark:
| [Traffic Manager](https://azure.microsoft.com/en-us/services/traffic-manager/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Virtual Machine Scale Sets](https://azure.microsoft.com/en-us/services/virtual-machine-scale-sets/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Virtual Machines](https://azure.microsoft.com/en-us/services/virtual-machines/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Virtual Network](https://azure.microsoft.com/en-us/services/virtual-network/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [VPN Gateway](https://azure.microsoft.com/en-us/services/vpn-gateway/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

**&ast;** Some services such as the Azure portal and Azure Resource Manager do not store or process DoD CC SRG IIL 5 content, however still inherit the IIL5 control set.
