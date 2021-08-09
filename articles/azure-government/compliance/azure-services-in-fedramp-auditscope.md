---
title: Azure Services in FedRAMP and DoD SRG Audit Scope
description: This article contains tables for Azure Public and Azure Government that illustrate what FedRAMP (Moderate vs. High) and DoD SRG (Impact level 2, 4, 5 or 6) audit scope a given service has reached.
author: Jain-Garima  
ms.author: gjain
ms.date: 08/04/2021
ms.topic: article
ms.service: azure-government
ms.reviewer: rochiou
---

# Azure services by FedRAMP and DoD CC SRG audit scope

Microsoft's government cloud services meet the demanding requirements of the US Federal Risk & Authorization Management Program (FedRAMP) and of the US Department of Defense, from information impact levels 2 through 6. By deploying protected services including Azure Government, Office 365 U.S. Government, and Dynamics 365 Government, federal and defense agencies can leverage a rich array of compliant services.

This article provides a detailed list of in-scope cloud services across Azure Public and Azure Government for FedRAMP and DoD CC SRG compliance offerings.

#### Terminology/symbols used

* DoD CC SRG = Department of Defense Cloud Computing Security Requirements Guide
* IL = Impact Level
* FedRAMP = Federal Risk and Authorization Management Program  
* 3PAO = Third Party Assessment Organization
* JAB = Joint Authorization Board 
* :heavy_check_mark: = indicates the service has achieved this audit scope.
* Planned 2021 = indicates the service will be reviewed by 3PAO and JAB in 2021. Once the service is authorized, status will be updated 

## Azure public services by audit scope
| _Last Updated: August 2021_ |

| Azure Service| DoD CC SRG IL 2 | FedRAMP Moderate | FedRAMP High | Planned 2021 |
| ------------ |:---------------:|:----------------:|:------------:|:------------:|
| [AI Builder](/ai-builder/overview) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [API Management](https://azure.microsoft.com/services/api-management/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Application Change Analysis](../../azure-monitor/app/change-analysis.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Application Gateway](https://azure.microsoft.com/services/application-gateway/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Automation](https://azure.microsoft.com/services/automation/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Active Directory (Free and Basic)](https://azure.microsoft.com/services/active-directory/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Active Directory (Premium P1 + P2)](https://azure.microsoft.com/services/active-directory/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Active Directory Domain Services](https://azure.microsoft.com/services/active-directory-ds/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Active Directory Provisioning Service](../../active-directory/app-provisioning/user-provisioning.md)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Defender for Identity](https://azure.microsoft.com/features/azure-advanced-threat-protection/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Advisor](https://azure.microsoft.com/services/advisor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure App Configuration](https://azure.microsoft.com/services/app-configuration/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure API for FHIR](https://azure.microsoft.com/services/azure-api-for-fhir/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Arc enabled Servers](../../azure-arc/servers/overview.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Bastion](https://azure.microsoft.com/services/azure-bastion/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Blueprints](https://azure.microsoft.com/services/blueprints/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Bot Service](/azure/bot-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Archive Storage](https://azure.microsoft.com/services/storage/archive/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Cost Management](https://azure.microsoft.com/services/cost-management/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Stack Edge (Data Box Edge)](https://azure.microsoft.com/services/databox/edge/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Data Box](https://azure.microsoft.com/services/databox/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:**&ast;**  |  |
| [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Data Share](https://azure.microsoft.com/services/data-share/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Database for MariaDB](https://azure.microsoft.com/services/mariadb/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Database Migration Service](https://azure.microsoft.com/services/database-migration/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Databricks](https://azure.microsoft.com/services/databricks/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:**&ast;&ast;** |  |
| [Azure DDoS Protection](https://azure.microsoft.com/services/ddos-protection/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Dedicated HSM](https://azure.microsoft.com/services/azure-dedicated-hsm/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure DNS](https://azure.microsoft.com/services/dns/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure for Education](https://azure.microsoft.com/developer/students/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure File Sync](https://azure.microsoft.com/services/storage/files/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Firewall Manager](https://azure.microsoft.com/services/firewall-manager/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Front Door](https://azure.microsoft.com/services/frontdoor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure HPC Cache](https://azure.microsoft.com/services/hpc-cache/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Information Protection](https://azure.microsoft.com/services/information-protection/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Intune](/intune/what-is-intune) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure IoT Security](https://azure.microsoft.com/overview/iot/security/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Internet Analyzer](https://azure.microsoft.com/services/internet-analyzer/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Lab Services](https://azure.microsoft.com/services/lab-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Lighthouse](https://azure.microsoft.com/services/azure-lighthouse/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Machine Learning Services](https://azure.microsoft.com/services/machine-learning-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Managed Applications](https://azure.microsoft.com/services/managed-applications/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Marketplace Portal](https://azuremarketplace.microsoft.com/en-us)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Maps](https://azure.microsoft.com/services/azure-maps/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Monitor](https://azure.microsoft.com/services/monitor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure NetApp Files](https://azure.microsoft.com/services/netapp/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Policy](https://azure.microsoft.com/services/azure-policy/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Private Link](https://azure.microsoft.com/services/private-link/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Public IP](../../virtual-network/public-ip-addresses.md)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure RedHat OpenShift](https://azure.microsoft.com/services/openshift/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Resource Graph](../../governance/resource-graph/overview.md)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Cognitive Search](https://azure.microsoft.com/services/search/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Service Manager (RDFE)](/previous-versions/azure/ee460799(v=azure.100)) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Service Health](https://azure.microsoft.com/features/service-health/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Sphere](https://azure.microsoft.com/services/azure-sphere/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure VMware Solution](https://azure.microsoft.com/services/azure-vmware/) |  |  |  | :heavy_check_mark: |
| [Backup](https://azure.microsoft.com/services/backup/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Batch](https://azure.microsoft.com/services/batch/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cloud Services](https://azure.microsoft.com/services/cloud-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Computer Vision](https://azure.microsoft.com/services/cognitive-services/computer-vision/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Content Moderator](https://azure.microsoft.com/services/cognitive-services/content-moderator/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services Containers](../../cognitive-services/cognitive-services-container-support.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Custom Vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Face](https://azure.microsoft.com/services/cognitive-services/face/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Form Recognizer](https://azure.microsoft.com/services/cognitive-services/form-recognizer/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Language Understanding](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services Personalizer](https://azure.microsoft.com/services/cognitive-services/personalizer/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: QnA Maker](https://azure.microsoft.com/services/cognitive-services/qna-maker/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Speech Services](https://azure.microsoft.com/services/cognitive-services/directory/speech/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Translator Text](https://azure.microsoft.com/services/cognitive-services/speech-translation/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cognitive Services: Video Indexer](https://azure.microsoft.com/services/media-services/video-indexer/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Container Instances](https://azure.microsoft.com/services/container-instances/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Container Registry](https://azure.microsoft.com/services/container-registry/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Content Delivery Network](https://azure.microsoft.com/services/cdn/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Data Factory](https://azure.microsoft.com/services/data-factory/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Data Integrator](/power-platform/admin/data-integrator) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Dynamics 365 Commerce](https://dynamics.microsoft.com/commerce/overview/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Dynamics 365 Customer Service](https://dynamics.microsoft.com/customer-service/overview/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Dynamics 365 Field Service](https://dynamics.microsoft.com/field-service/overview/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Dynamics 365 Finance](https://dynamics.microsoft.com/finance/overview/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Dynamics 365 Guides](/dynamics365/mixed-reality/guides/get-started)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Dynamics 365 Sales](/dynamics365/sales-enterprise/overview) |  |  |  | :heavy_check_mark: |
| [Dynamics 365 Sales Professional](/dynamics365/sales-professional/sales-professional-overview) |  |  |  | :heavy_check_mark: |
| [Dynamics 365 Supply Chain](https://dynamics.microsoft.com/supply-chain-management/overview/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Dynamics 365 Chat (Dynamics 365 Omni-Channel Engagement Hub)](/dynamics365/omnichannel/introduction-omnichannel) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Dataverse (Common Data Service)](/powerapps/maker/common-data-service/data-platform-intro) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Event Grid](https://azure.microsoft.com/services/event-grid/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Defender for Endpoint](/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Event Hubs](https://azure.microsoft.com/services/event-hubs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [ExpressRoute](https://azure.microsoft.com/services/expressroute/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Power Automate](https://powerplatform.microsoft.com/power-automate/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Functions](https://azure.microsoft.com/services/functions/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | |
| [GitHub AE](https://docs.github.com/en/github-ae@latest/admin/overview/about-github-ae) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | |
| [Guest Configuration](../../governance/policy/concepts/guest-configuration.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | |
| [HDInsight](https://azure.microsoft.com/services/hdinsight/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Import / Export](https://azure.microsoft.com/services/storage/import-export/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [IoT Central](https://azure.microsoft.com/services/iot-central/) |  |  |  | :heavy_check_mark: |
| [IoT Hub](https://azure.microsoft.com/services/iot-hub/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Key Vault](https://azure.microsoft.com/services/key-vault/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Load Balancer](https://azure.microsoft.com/services/load-balancer/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Log Analytics](../../azure-monitor/logs/data-platform-logs.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Logic Apps](https://azure.microsoft.com/services/logic-apps/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Media Services](https://azure.microsoft.com/services/media-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft 365 Defender](/microsoft-365/security/defender/microsoft-365-defender?view=o365-worldwide) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Azure Attestation](https://azure.microsoft.com/services/azure-attestation/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Azure portal](https://azure.microsoft.com/features/azure-portal/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Azure Peering Service](../../peering-service/about.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Cloud App Security](/cloud-app-security/what-is-cloud-app-security) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Graph](https://developer.microsoft.com/en-us/graph)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Health Bot](/healthbot/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Power Apps](/powerapps/powerapps-overview) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Power Apps Portal](https://powerapps.microsoft.com/portals/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Stream](/stream/overview) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Microsoft Threat Experts](/windows/security/threat-protection/microsoft-defender-atp/microsoft-threat-experts) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Multi-Factor Authentication](../../active-directory/authentication/concept-mfa-howitworks.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Network Watcher](https://azure.microsoft.com/services/network-watcher/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Network Watcher Traffic Analytics](../../network-watcher/traffic-analytics.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Notification Hubs](https://azure.microsoft.com/services/notification-hubs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Power BI Embedded](https://azure.microsoft.com/services/power-bi-embedded/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Power Virtual Agents](/power-virtual-agents/fundamentals-what-is-power-virtual-agents) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Redis Cache](https://azure.microsoft.com/services/cache/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Scheduler](../../scheduler/scheduler-intro.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Security Center](https://azure.microsoft.com/services/security-center/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Service Bus](https://azure.microsoft.com/services/service-bus/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Service Fabric](https://azure.microsoft.com/services/service-fabric/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Synapse Analytics](https://azure.microsoft.com/services/sql-data-warehouse/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [SQL Database](https://azure.microsoft.com/services/sql-database/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [SQL Server Stretch Database](https://azure.microsoft.com/services/sql-server-stretch-database/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Storage: Blobs (Incl. Azure Data Lake Storage Gen2](https://azure.microsoft.com/services/storage/blobs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Storage: Disks (incl. Managed Disks)](https://azure.microsoft.com/services/storage/disks/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Storage: Files](https://azure.microsoft.com/services/storage/files/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Storage: Queues](https://azure.microsoft.com/services/storage/queues/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Storage: Tables](https://azure.microsoft.com/services/storage/tables/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [StorSimple](https://azure.microsoft.com/services/storsimple/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Time Series Insights](https://azure.microsoft.com/services/time-series-insights/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Traffic Manager](https://azure.microsoft.com/services/traffic-manager/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [UEBA for Sentinel](../../sentinel/identify-threats-with-entity-behavior-analytics.md#what-is-user-and-entity-behavior-analytics-ueba) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Virtual Machines (incl. Reserved Instances)](https://azure.microsoft.com/services/virtual-machines/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Virtual Network](https://azure.microsoft.com/services/virtual-network/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Virtual Network NAT](../../virtual-network/nat-gateway/nat-overview.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Virtual WAN](https://azure.microsoft.com/services/virtual-wan/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Visual Studio Codespaces](https://azure.microsoft.com/services/visual-studio-online/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [VPN Gateway](https://azure.microsoft.com/services/vpn-gateway/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Web Apps (App Service)](https://azure.microsoft.com/services/app-service/web/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Web Application Firewall)](https://azure.microsoft.com/services/web-application-firewall/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Windows 10 IoT Core Services](https://azure.microsoft.com/services/windows-10-iot-core/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Azure Virtual Desktop](https://azure.microsoft.com/services/virtual-desktop/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |

**&ast;** FedRAMP high certification covers Datacenter Infrastructure Services & Databox Pod and Disk Service which are the online software components supporting Data Box hardware appliance.

**&ast;&ast;** FedRAMP High certification for Azure Databricks is applicable for limited regions in Azure Commercial. To configure Azure Databricks for FedRAMP High use, please reach out to your Microsoft or Databricks Representative.

## Azure Government services by audit scope
| _Last Updated: July 2021_ |

| Azure Service | DoD CC SRG IL 2 | DoD CC SRG IL 4 | DoD CC SRG IL 5 (Azure Gov)**&ast;** | DoD CC SRG IL 5 (Azure DoD) **&ast;&ast;** | FedRAMP High | DoD CC SRG IL 6 
| ------------- |:---------------:|:---------------:|:---------------:|:------------:|:------------:|:------------:
| [API Management](https://azure.microsoft.com/services/api-management/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Application Gateway](https://azure.microsoft.com/services/application-gateway/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| [Automation](https://azure.microsoft.com/services/automation/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Active Directory (Free and Basic)](https://azure.microsoft.com/services/active-directory/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| [Azure Active Directory (Premium P1 + P2)](https://azure.microsoft.com/services/active-directory/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| [Azure Active Directory Domain Services](https://azure.microsoft.com/services/active-directory-ds/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Microsoft Defender for Identity](https://azure.microsoft.com/features/azure-advanced-threat-protection/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Advisor](https://azure.microsoft.com/services/advisor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure API for FHIR](https://azure.microsoft.com/services/azure-api-for-fhir/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure App Configuration](https://azure.microsoft.com/services/app-configuration/)  | :heavy_check_mark: |  |  |  | :heavy_check_mark: |
| [Azure Bastion](https://azure.microsoft.com/services/azure-bastion/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Blueprints](https://azure.microsoft.com/services/blueprints/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Bot Service](/azure/bot-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Archive Storage](https://azure.microsoft.com/services/storage/archive/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Container Registry](https://azure.microsoft.com/services/container-registry/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: 
| [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  :heavy_check_mark: |
| [Azure Cost Management](https://azure.microsoft.com/services/cost-management/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Cognitive Search](https://azure.microsoft.com/services/search/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Stack Edge (Data Box Edge)](https://azure.microsoft.com/services/databox/edge/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Data Box](https://azure.microsoft.com/services/databox/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Data Factory](https://azure.microsoft.com/services/data-factory/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Database Migration Service](https://azure.microsoft.com/services/database-migration/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |  :heavy_check_mark: |
| [Azure Data Share](https://azure.microsoft.com/services/data-share/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Databricks](https://azure.microsoft.com/services/databricks/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure DB for MySQL](https://azure.microsoft.com/services/mysql/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure DB for PostgreSQL](https://azure.microsoft.com/services/postgresql/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure DB for MariaDB](https://azure.microsoft.com/services/mariadb/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure DDoS Protection](https://azure.microsoft.com/services/ddos-protection/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Dedicated HSM](https://azure.microsoft.com/services/azure-dedicated-hsm/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure DNS](https://azure.microsoft.com/services/dns/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Event Grid](https://azure.microsoft.com/services/event-grid/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure File Sync](https://azure.microsoft.com/services/storage/files/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Front Door](https://azure.microsoft.com/services/frontdoor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure HPC Cache](https://azure.microsoft.com/services/hpc-cache/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Information Protection](https://azure.microsoft.com/services/information-protection/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Microsoft Intune](/intune/what-is-intune) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure IoT Security](https://azure.microsoft.com/overview/iot/security/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Lighthouse](https://azure.microsoft.com/services/azure-lighthouse/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Lab Services](https://azure.microsoft.com/services/lab-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Managed Applications](https://azure.microsoft.com/services/managed-applications/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| [Azure Maps](https://azure.microsoft.com/services/azure-maps/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Monitor](https://azure.microsoft.com/services/monitor/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure NetApp Files](https://azure.microsoft.com/services/netapp/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Policy](https://azure.microsoft.com/services/azure-policy/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Private Link](https://azure.microsoft.com/services/private-link/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Public IP](../../virtual-network/public-ip-addresses.md) | :heavy_check_mark: |  |  |  | :heavy_check_mark: |
| [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Resource Graph](../../governance/resource-graph/overview.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Security Center](https://azure.microsoft.com/services/security-center/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Azure Service Health](https://azure.microsoft.com/features/service-health/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Service Manager (RDFE)](/previous-versions/azure/ee460799(v=azure.100)) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Stack Hub](/azure-stack/operator/azure-stack-overview)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Backup](https://azure.microsoft.com/services/backup/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Batch](https://azure.microsoft.com/services/batch/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Cloud Services](https://azure.microsoft.com/services/cloud-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Cognitive Services: Computer Vision](https://azure.microsoft.com/services/cognitive-services/computer-vision/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Cognitive Services: Content Moderator](https://azure.microsoft.com/services/cognitive-services/content-moderator/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Cognitive Services: Face](https://azure.microsoft.com/services/cognitive-services/face/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Cognitive Services: Form Recognizer](https://azure.microsoft.com/services/cognitive-services/form-recognizer/)  | :heavy_check_mark: |  |  |  | :heavy_check_mark: |
| [Cognitive Services: Language Understanding](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Cognitive Services: Speech Services](https://azure.microsoft.com/services/cognitive-services/directory/speech/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Cognitive Services: Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Cognitive Services: Translator](https://azure.microsoft.com/services/cognitive-services/translator/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Cognitive Services: Custom Vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Cognitive Services Personalizer](https://azure.microsoft.com/services/cognitive-services/personalizer/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Cognitive Services: QnA Maker](https://azure.microsoft.com/services/cognitive-services/qna-maker/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Container Instances](https://azure.microsoft.com/services/container-instances/)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Content Delivery Network](https://azure.microsoft.com/services/cdn/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Data Integrator](/power-platform/admin/data-integrator) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Dynamics 365 Chat (Dynamics 365 Service Omni-Channel Engagement Hub)](/dynamics365/omnichannel/introduction-omnichannel) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Dynamics 365 Customer Voice](/forms-pro/get-started) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Dynamics 365 Customer Insights](/dynamics365/ai/customer-insights/overview)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Dataverse (Common Data Service)](/dynamics365/customerengagement/on-premises/overview)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Dynamics 365 Customer Service](/dynamics365/customer-service/overview)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Dynamics 365 Field Service](/dynamics365/field-service/overview)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Dynamics 365 Project Service Automation](/dynamics365/project-service/overview)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Dynamics 365 Sales](/dynamics365/sales-enterprise/overview)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Event Hubs](https://azure.microsoft.com/services/event-hubs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/export-to-data-lake) | :heavy_check_mark: |  |  |  | :heavy_check_mark: |
| [ExpressRoute](https://azure.microsoft.com/services/expressroute/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Power Automate](/flow/getting-started) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| [Functions](https://azure.microsoft.com/services/functions/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [GitHub AE](https://docs.github.com/en/github-ae@latest/admin/overview/about-github-ae)  | :heavy_check_mark: |  |  |  | :heavy_check_mark: |
| [Guest Configuration](../../governance/policy/concepts/guest-configuration.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |  
| [HDInsight](https://azure.microsoft.com/services/hdinsight/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Import / Export](https://azure.microsoft.com/services/storage/import-export/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [IoT Hub](https://azure.microsoft.com/services/iot-hub/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Key Vault](https://azure.microsoft.com/services/key-vault/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Load Balancer](https://azure.microsoft.com/services/load-balancer/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Log Analytics](../../azure-monitor/logs/data-platform-logs.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Logic Apps](https://azure.microsoft.com/services/logic-apps/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Machine Learning Services](https://azure.microsoft.com/services/machine-learning-service/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Media Services](https://azure.microsoft.com/services/media-services/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Microsoft Azure Peering Service](../../peering-service/about.md)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Microsoft Azure portal](https://azure.microsoft.com/features/azure-portal/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Microsoft Cloud App Security](/cloud-app-security/what-is-cloud-app-security)| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Microsoft Defender for Endpoint](/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| [Microsoft 365 Defender](/microsoft-365/security/defender/microsoft-365-defender?view=o365-worldwide)  | :heavy_check_mark: |  |  |  | :heavy_check_mark: |
| [Microsoft Graph](/graph/overview) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Power Apps](/powerapps/powerapps-overview) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| [Power Apps Portal](https://powerapps.microsoft.com/portals/)  | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: | 
| [Microsoft Stream](/stream/overview) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Multi-Factor Authentication](../../active-directory/authentication/concept-mfa-howitworks.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: |
| [Network Watcher](https://azure.microsoft.com/services/network-watcher/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Network Watcher(Traffic Analytics)](../../network-watcher/traffic-analytics.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Notification Hubs](https://azure.microsoft.com/services/notification-hubs/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Planned Maintenance](../../virtual-machines/maintenance-control-portal.md)  | :heavy_check_mark: |  |  |  | :heavy_check_mark: |
| [Power BI](https://powerbi.microsoft.com/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Power BI Embedded](https://azure.microsoft.com/services/power-bi-embedded/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Power Virtual Agents](/power-virtual-agents/fundamentals-what-is-power-virtual-agents)  | :heavy_check_mark: |  |  |  | :heavy_check_mark: |
| [Redis Cache](https://azure.microsoft.com/services/cache/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Scheduler](../../scheduler/scheduler-intro.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Service Bus](https://azure.microsoft.com/services/service-bus/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Service Fabric](https://azure.microsoft.com/services/service-fabric/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Azure Synapse Analytics](https://azure.microsoft.com/services/sql-data-warehouse/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [SQL Database](https://azure.microsoft.com/services/sql-database/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [SQL Server Stretch Database](https://azure.microsoft.com/services/sql-server-stretch-database/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Storage: Blobs (Incl. Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Storage: Disks (incl. Managed Disks)](https://azure.microsoft.com/services/storage/disks/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Storage: Files](https://azure.microsoft.com/services/storage/files/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Storage: Queues](https://azure.microsoft.com/services/storage/queues/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Storage: Tables](https://azure.microsoft.com/services/storage/tables/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [StorSimple](https://azure.microsoft.com/services/storsimple/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Traffic Manager](https://azure.microsoft.com/services/traffic-manager/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Virtual Machines](https://azure.microsoft.com/services/virtual-machines/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Virtual Network](https://azure.microsoft.com/services/virtual-network/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Virtual Network NAT](../../virtual-network/nat-gateway/nat-overview.md)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 
| [Virtual WAN](https://azure.microsoft.com/services/virtual-wan/) | :heavy_check_mark: |  |  |  | :heavy_check_mark: | :heavy_check_mark: 
| [VPN Gateway](https://azure.microsoft.com/services/vpn-gateway/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Web Apps (App Service)](https://azure.microsoft.com/services/app-service/web/) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Web Application Firewall)](https://azure.microsoft.com/services/web-application-firewall/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: |
| [Azure Virtual Desktop](https://azure.microsoft.com/services/virtual-desktop/)  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | 


**&ast;** DoD CC SRG IL5 (Azure Gov) column shows DoD CC SRG IL5 certification status of services in Azure Government. For details, please refer to [Azure Government Isolation Guidelines for Impact Level 5](../documentation-government-impact-level-5.md)

**&ast;&ast;** DoD CC SRG IL5 (Azure DoD) column shows DoD CC SRG IL5 certification status for services in Azure Government DoD regions.