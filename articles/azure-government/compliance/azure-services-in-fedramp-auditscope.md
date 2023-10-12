---
title: Azure and other Microsoft cloud services compliance scope
description: This article tracks FedRAMP and DoD compliance scope for Azure, Dynamics 365, Microsoft 365, and Power Platform cloud services across Azure, Azure Government, and Azure Government Secret cloud environments.
author: stevevi
ms.author: stevevi
ms.topic: article
ms.service: azure-government
ms.custom: references_regions
recommendations: false
ms.date: 07/26/2023
---

# Azure, Dynamics 365, Microsoft 365, and Power Platform services compliance scope

Microsoft Azure cloud environments meet demanding US government compliance requirements that produce formal authorizations, including:

- [Federal Risk and Authorization Management Program](https://www.fedramp.gov/) (FedRAMP)
- Department of Defense (DoD) Cloud Computing [Security Requirements Guide](https://public.cyber.mil/dccs/dccs-documents/) (SRG) Impact Level (IL) 2, 4, 5, and 6
- [Intelligence Community Directive (ICD) 503](http://www.dni.gov/files/documents/ICD/ICD_503.pdf)
- [Joint Special Access Program (SAP) Implementation Guide (JSIG)](https://www.dcsa.mil/portals/91/documents/ctp/nao/JSIG_2016April11_Final_(53Rev4).pdf)

**Azure** (also known as Azure Commercial, Azure Public, or Azure Global) maintains the following authorizations that pertain to all Azure public regions in the United States:

- [FedRAMP High](/azure/compliance/offerings/offering-fedramp) Provisional Authorization to Operate (P-ATO) issued by the FedRAMP Joint Authorization Board (JAB)
- [DoD IL2](/azure/compliance/offerings/offering-dod-il2) Provisional Authorization (PA) issued by the Defense Information Systems Agency (DISA)

**Azure Government** maintains the following authorizations that pertain to Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia (US Gov regions):

- [FedRAMP High](/azure/compliance/offerings/offering-fedramp) P-ATO issued by the JAB
- [DoD IL2](/azure/compliance/offerings/offering-dod-il2) PA issued by DISA
- [DoD IL4](/azure/compliance/offerings/offering-dod-il4) PA issued by DISA
- [DoD IL5](/azure/compliance/offerings/offering-dod-il5) PA issued by DISA

For current Azure Government regions and available services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

> [!NOTE]
>
> - Some Azure services deployed in Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia (US Gov regions) require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in **[Isolation guidelines for Impact Level 5 workloads](../documentation-government-impact-level-5.md).**
> - For DoD IL5 PA compliance scope in Azure Government regions US DoD Central and US DoD East (US DoD regions), see **[US DoD regions IL5 audit scope](../documentation-government-overview-dod.md#us-dod-regions-il5-audit-scope).**

**Azure Government Secret** maintains:

- [DoD IL6](/azure/compliance/offerings/offering-dod-il6) PA issued by DISA
- [JSIG PL3](/azure/compliance/offerings/offering-jsig) ATO (for authorization details, contact your Microsoft account representative)

**Azure Government Top Secret** maintains:

- [ICD 503](/azure/compliance/offerings/offering-icd-503) ATO with facilities at ICD 705 (for authorization details, contact your Microsoft account representative)
- [JSIG PL3](/azure/compliance/offerings/offering-jsig) ATO (for authorization details, contact your Microsoft account representative)

This article provides a detailed list of Azure, Dynamics 365, Microsoft 365, and Power Platform cloud services in scope for FedRAMP High, DoD IL2, DoD IL4, DoD IL5, and DoD IL6 authorizations across Azure, Azure Government, and Azure Government Secret cloud environments. For other authorization details in Azure Government Secret and Azure Government Top Secret, contact your Microsoft account representative.

## Azure public services by audit scope
*Last updated: June 2023*

### Terminology used

- FedRAMP High = FedRAMP High Provisional Authorization to Operate (P-ATO) in Azure
- DoD IL2 = DoD SRG Impact Level 2 Provisional Authorization (PA) in Azure
- &#x2705; = service is included in audit scope and has been authorized

| Service | FedRAMP High | DoD IL2 |
| ------- |:------------:|:-------:|
| [Advisor](../../advisor/index.yml) | &#x2705; | &#x2705; |
| [AI Builder](/ai-builder/) | &#x2705; | &#x2705; |
| [Analysis Services](../../analysis-services/index.yml) | &#x2705; | &#x2705; |
| [API Management](../../api-management/index.yml) | &#x2705; | &#x2705; |
| [App Configuration](../../azure-app-configuration/index.yml) | &#x2705; | &#x2705; |
| [App Service](../../app-service/index.yml) | &#x2705; | &#x2705; |
| [Application Gateway](../../application-gateway/index.yml) | &#x2705; | &#x2705; |
| [Automation](../../automation/index.yml) | &#x2705; | &#x2705; |
| [Microsoft Entra ID (Free)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; |
| [Microsoft Entra ID (Premium P1 + P2)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; |
| [Azure Active Directory B2C](../../active-directory-b2c/index.yml) | &#x2705; | &#x2705; |
| [Microsoft Entra Domain Services](../../active-directory-domain-services/index.yml) | &#x2705; | &#x2705; |
| [Microsoft Entra provisioning service](../../active-directory/app-provisioning/how-provisioning-works.md)| &#x2705; | &#x2705; |
| [Microsoft Entra multifactor authentication](../../active-directory/authentication/concept-mfa-howitworks.md) | &#x2705; | &#x2705; |
| [Azure API for FHIR](../../healthcare-apis/azure-api-for-fhir/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Azure Arc-enabled servers](../../azure-arc/servers/index.yml) | &#x2705; | &#x2705; |
| [Azure Arc-enabled Kubernetes](../../azure-arc/kubernetes/index.yml) | &#x2705; | &#x2705; |
| [Azure Cache for Redis](../../azure-cache-for-redis/index.yml) | &#x2705; | &#x2705; |
| [Azure Cosmos DB](../../cosmos-db/index.yml) | &#x2705; | &#x2705; |
| [Azure Database for MariaDB](../../mariadb/index.yml) | &#x2705; | &#x2705; |
| [Azure Database for MySQL](../../mysql/index.yml) | &#x2705; | &#x2705; |
| [Azure Database for PostgreSQL](../../postgresql/index.yml) | &#x2705; | &#x2705; |
| [Azure Databricks](/azure/databricks/) **&ast;&ast;** | &#x2705; | &#x2705; |
| [Azure for Education](https://azureforeducation.microsoft.com/) | &#x2705; | &#x2705; |
| [Azure Information Protection](/azure/information-protection/) | &#x2705; | &#x2705; |
| [Azure Kubernetes Service (AKS)](../../aks/index.yml) | &#x2705; | &#x2705; |
| [Azure Marketplace portal](https://azuremarketplace.microsoft.com/) | &#x2705; | &#x2705; |
| [Azure Maps](../../azure-maps/index.yml) | &#x2705; | &#x2705; |
| [Azure Monitor](../../azure-monitor/index.yml) (incl. [Application Insights](../../azure-monitor/app/app-insights-overview.md), [Log Analytics](../../azure-monitor/logs/data-platform-logs.md), and [Application Change Analysis](../../azure-monitor/app/change-analysis.md)) | &#x2705; | &#x2705; |
| [Azure NetApp Files](../../azure-netapp-files/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Azure OpenAI](../../ai-services/openai/index.yml) | &#x2705; | &#x2705; |
| [Azure Policy](../../governance/policy/index.yml) | &#x2705; | &#x2705; |
| [Azure Policy's guest configuration](../../governance/machine-configuration/overview.md) | &#x2705; | &#x2705; |
| [Azure Red Hat OpenShift](../../openshift/index.yml) | &#x2705; | &#x2705; |
| [Azure Resource Manager](../../azure-resource-manager/management/index.yml) | &#x2705; | &#x2705; |
| [Azure Service Manager (RDFE)](/previous-versions/azure/ee460799(v=azure.100)) | &#x2705; | &#x2705; |
| [Azure Sign-up portal](https://signup.azure.com/) | &#x2705; | &#x2705; |
| [Azure Sphere](/azure-sphere/) | &#x2705; | &#x2705; |
| [Azure Spring Apps](../../spring-apps/index.yml) | &#x2705; | &#x2705; |
| [Azure Stack Edge](../../databox-online/index.yml) (formerly Data Box Edge) **&ast;** | &#x2705; | &#x2705; |
| [Azure Stack HCI](/azure-stack/hci/) | &#x2705; | &#x2705; |
| [Azure Video Indexer](../../azure-video-indexer/index.yml) | &#x2705; | &#x2705; |
| [Azure Virtual Desktop](../../virtual-desktop/index.yml) (formerly Windows Virtual Desktop) | &#x2705; | &#x2705; |
| [Azure VMware Solution](../../azure-vmware/index.yml) | &#x2705; | &#x2705; |
| [Backup](../../backup/index.yml) | &#x2705; | &#x2705; |
| [Bastion](../../bastion/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Batch](../../batch/index.yml) | &#x2705; | &#x2705; |
| [Blueprints](../../governance/blueprints/index.yml) | &#x2705; | &#x2705; |
| [Bot Service](/azure/bot-service/) | &#x2705; | &#x2705; |
| [Cloud Services](../../cloud-services/index.yml) | &#x2705; | &#x2705; |
| [Cloud Shell](../../cloud-shell/overview.md) | &#x2705; | &#x2705; |
| [Cognitive Search](../../search/index.yml) (formerly Azure Search) | &#x2705; | &#x2705; |
| [Azure AI services: Anomaly Detector](../../ai-services/anomaly-detector/index.yml) | &#x2705; | &#x2705; |
| [Azure AI services: Computer Vision](../../ai-services/computer-vision/index.yml) | &#x2705; | &#x2705; |
| [Azure AI services: Content Moderator](../../ai-services/content-moderator/index.yml) | &#x2705; | &#x2705; |
| [Azure AI services: Containers](../../ai-services/cognitive-services-container-support.md) | &#x2705; | &#x2705; |
| [Azure AI services: Custom Vision](../../ai-services/custom-vision-service/index.yml) | &#x2705; | &#x2705; |
| [Azure AI services: Face](../../ai-services/computer-vision/overview-identity.md) | &#x2705; | &#x2705; |
| [Azure AI Language Understanding (LUIS)](../../ai-services/luis/index.yml) </br> (part of [Azure AI Language](../../ai-services/language-service/index.yml)) | &#x2705; | &#x2705; |
| [Azure AI services: Personalizer](../../ai-services/personalizer/index.yml) | &#x2705; | &#x2705; |
| [Azure AI services: QnA Maker](../../ai-services/qnamaker/index.yml) </br> (part of [Azure AI Language](../../ai-services/language-service/index.yml)) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Azure AI services: Speech](../../ai-services/speech-service/index.yml) | &#x2705; | &#x2705; |
| [Azure AI services: Text Analytics](../../ai-services/language-service/concepts/migrate.md#do-i-need-to-migrate-to-the-language-service-if-i-am-using-text-analytics) <br> (part of [Azure AI Language](../../ai-services/language-service/index.yml)) | &#x2705; | &#x2705; |
| [Azure AI services: Translator](../../ai-services/translator/index.yml) | &#x2705; | &#x2705; |
| [Container Instances](../../container-instances/index.yml) | &#x2705; | &#x2705; |
| [Container Registry](../../container-registry/index.yml) | &#x2705; | &#x2705; |
| [Content Delivery Network (CDN)](../../cdn/index.yml) | &#x2705; | &#x2705; |
| [Cost Management and Billing](../../cost-management-billing/index.yml) | &#x2705; | &#x2705; |
| [Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md) | &#x2705; | &#x2705; |
| [Data Box](../../databox/index.yml) **&ast;** | &#x2705; | &#x2705; |
| [Data Explorer](/azure/data-explorer/) | &#x2705; | &#x2705; |
| [Data Factory](../../data-factory/index.yml) | &#x2705; | &#x2705; |
| [Data Share](../../data-share/index.yml) | &#x2705; | &#x2705; |
| [Database Migration Service](../../dms/index.yml) | &#x2705; | &#x2705; |
| [Dataverse](/powerapps/maker/data-platform/) (incl. [Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/export-to-data-lake)) | &#x2705; | &#x2705; |
| [DDoS Protection](../../ddos-protection/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Dedicated HSM](../../dedicated-hsm/index.yml) | &#x2705; | &#x2705; |
| [DevTest Labs](../../devtest-labs/index.yml) | &#x2705; | &#x2705; |
| [DNS](../../dns/index.yml) | &#x2705; | &#x2705; |
| [Dynamics 365 Chat (Omnichannel Engagement Hub)](/dynamics365/omnichannel/introduction-omnichannel) | &#x2705; | &#x2705; |
| [Dynamics 365 Commerce](/dynamics365/commerce/)| &#x2705; | &#x2705; |
| [Dynamics 365 Customer Service](/dynamics365/customer-service/overview)| &#x2705; | &#x2705; |
| [Dynamics 365 Field Service](/dynamics365/field-service/overview)| &#x2705; | &#x2705; |
| [Dynamics 365 Finance](/dynamics365/finance/)| &#x2705; | &#x2705; |
| [Dynamics 365 Guides](/dynamics365/mixed-reality/guides/)| &#x2705; | &#x2705; |
| [Dynamics 365 Sales](/dynamics365/sales/help-hub) | &#x2705; | &#x2705; |
| [Dynamics 365 Sales Professional](/dynamics365/sales/overview#dynamics-365-sales-professional) | &#x2705; | &#x2705; |
| [Dynamics 365 Supply Chain Management](/dynamics365/supply-chain/)| &#x2705; | &#x2705; |
| [Event Grid](../../event-grid/index.yml) | &#x2705; | &#x2705; |
| [Event Hubs](../../event-hubs/index.yml) | &#x2705; | &#x2705; |
| [ExpressRoute](../../expressroute/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [File Sync](../../storage/file-sync/index.yml) | &#x2705; | &#x2705; |
| [Firewall](../../firewall/index.yml)  | &#x2705; | &#x2705; |
| [Firewall Manager](../../firewall-manager/index.yml)  | &#x2705; | &#x2705; |
| [Azure AI Document Intelligence](../../ai-services/document-intelligence/index.yml) | &#x2705; | &#x2705; |
| [Front Door](../../frontdoor/index.yml) | &#x2705; | &#x2705; |
| [Functions](../../azure-functions/index.yml) | &#x2705; | &#x2705; |
| [GitHub AE](https://docs.github.com/github-ae@latest/admin/overview/about-github-ae) | &#x2705; | &#x2705; |
| [Health Bot](/healthbot/) | &#x2705; | &#x2705; |
| [HDInsight](../../hdinsight/index.yml) | &#x2705; | &#x2705; |
| [HPC Cache](../../hpc-cache/index.yml) | &#x2705; | &#x2705; |
| [Immersive Reader](../../ai-services/immersive-reader/index.yml) | &#x2705; | &#x2705; |
| [Import/Export](../../import-export/index.yml) | &#x2705; | &#x2705; |
| [Internet Analyzer](../../internet-analyzer/index.yml) | &#x2705; | &#x2705; |
| [IoT Hub](../../iot-hub/index.yml) | &#x2705; | &#x2705; |
| [Key Vault](../../key-vault/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Lab Services](../../lab-services/index.yml) | &#x2705; | &#x2705; |
| [Lighthouse](../../lighthouse/index.yml) | &#x2705; | &#x2705; |
| [Load Balancer](../../load-balancer/index.yml) | &#x2705; | &#x2705; |
| [Logic Apps](../../logic-apps/index.yml) | &#x2705; | &#x2705; |
| [Machine Learning](../../machine-learning/index.yml) | &#x2705; | &#x2705; |
| [Managed Applications](../../azure-resource-manager/managed-applications/index.yml) | &#x2705; | &#x2705; |
| [Media Services](/azure/media-services/) | &#x2705; | &#x2705; |
| [Metrics Advisor](../../ai-services/metrics-advisor/index.yml) | &#x2705; | &#x2705; |
| [Microsoft 365 Defender](/microsoft-365/security/defender/) (formerly Microsoft Threat Protection) | &#x2705; | &#x2705; |
| [Microsoft Azure Attestation](../../attestation/index.yml)| &#x2705; | &#x2705; |
| [Microsoft Azure portal](https://azure.microsoft.com/features/azure-portal/)| &#x2705; | &#x2705; |
| [Microsoft Defender for Cloud](../../defender-for-cloud/index.yml) (formerly Azure Security Center) | &#x2705; | &#x2705; |
| [Microsoft Defender for Cloud Apps](/defender-cloud-apps/) (formerly Microsoft Cloud App Security) | &#x2705; | &#x2705; |
| [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) (formerly Microsoft Defender Advanced Threat Protection) | &#x2705; | &#x2705; |
| [Microsoft Defender for Identity](/defender-for-identity/) (formerly Azure Advanced Threat Protection) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Microsoft Defender for IoT](../../defender-for-iot/index.yml) (formerly Azure Security for IoT) | &#x2705; | &#x2705; |
| [Microsoft Graph](/graph/) | &#x2705; | &#x2705; |
| [Microsoft Intune](/mem/intune/) | &#x2705; | &#x2705; |
| [Microsoft Purview](../../purview/index.yml) (incl. Data Map, Data Estate Insights, and governance portal) | &#x2705; | &#x2705; |
| [Microsoft Sentinel](../../sentinel/index.yml) (formerly Azure Sentinel) | &#x2705; | &#x2705; |
| [Microsoft Stream](/stream/) | &#x2705; | &#x2705; |
| [Microsoft Threat Experts](/microsoft-365/security/defender-endpoint/microsoft-threat-experts) | &#x2705; | &#x2705; |
| [Migrate](../../migrate/index.yml) | &#x2705; | &#x2705; |
| [Network Watcher](../../network-watcher/index.yml) (incl. [Traffic Analytics](../../network-watcher/traffic-analytics.md)) | &#x2705; | &#x2705; |
| [Notification Hubs](../../notification-hubs/index.yml) | &#x2705; | &#x2705; |
| [Open Datasets](../../open-datasets/index.yml) | &#x2705; | &#x2705; |
| [Peering Service](../../peering-service/index.yml) | &#x2705; | &#x2705; |
| [Planned Maintenance for VMs](../../virtual-machines/maintenance-and-updates.md) | &#x2705; | &#x2705; |
| [Power Apps](/powerapps/) | &#x2705; | &#x2705; |
| [Power Apps Portal](https://powerapps.microsoft.com/portals/) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Power Automate](/power-automate/) (formerly Microsoft Flow) | &#x2705; | &#x2705; |
| [Power BI](/power-bi/fundamentals/) | &#x2705; | &#x2705; |
| [Power BI Embedded](/power-bi/developer/embedded/) | &#x2705; | &#x2705; |
| [Power Data Integrator for Dataverse](/power-platform/admin/data-integrator) (formerly Dynamics 365 Integrator App) | &#x2705; | &#x2705; |
| [Power Virtual Agents](/power-virtual-agents/) | &#x2705; | &#x2705; |
| [Private Link](../../private-link/index.yml) | &#x2705; | &#x2705; |
| [Public IP](../../virtual-network/ip-services/public-ip-addresses.md) | &#x2705; | &#x2705; |
| [Resource Graph](../../governance/resource-graph/index.yml) | &#x2705; | &#x2705; |
| [Resource Mover](../../resource-mover/index.yml) | &#x2705; | &#x2705; |
| [Route Server](../../route-server/index.yml) | &#x2705; | &#x2705; |
| [Scheduler](../../scheduler/index.yml) (replaced by [Logic Apps](../../logic-apps/index.yml)) | &#x2705; | &#x2705; |
| [Service Bus](../../service-bus-messaging/index.yml) | &#x2705; | &#x2705; |
| [Service Fabric](../../service-fabric/index.yml) | &#x2705; | &#x2705; |
| [Service Health](../../service-health/index.yml) | &#x2705; | &#x2705; |
| [SignalR Service](../../azure-signalr/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Site Recovery](../../site-recovery/index.yml) | &#x2705; | &#x2705; |
| [SQL Database](/azure/azure-sql/database/sql-database-paas-overview) | &#x2705; | &#x2705; |
| [SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview) | &#x2705; | &#x2705; |
| [SQL Server Registry](/sql/sql-server/end-of-support/sql-server-extended-security-updates) | &#x2705; | &#x2705; |
| [SQL Server Stretch Database](../../sql-server-stretch-database/index.yml) | &#x2705; | &#x2705; |
| [Storage: Archive](../../storage/blobs/access-tiers-overview.md) | &#x2705; | &#x2705; |
| [Storage: Blobs](../../storage/blobs/index.yml) (incl. [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md)) | &#x2705; | &#x2705; |
| [Storage: Disks (incl. managed disks)](../../virtual-machines/managed-disks-overview.md) | &#x2705; | &#x2705; |
| [Storage: Files](../../storage/files/index.yml) | &#x2705; | &#x2705; |
| [Storage: Queues](../../storage/queues/index.yml) | &#x2705; | &#x2705; |
| [Storage: Tables](../../storage/tables/index.yml) | &#x2705; | &#x2705; |
| [StorSimple](../../storsimple/index.yml) | &#x2705; | &#x2705; |
| [Stream Analytics](../../stream-analytics/index.yml) | &#x2705; | &#x2705; |
| [Synapse Analytics](../../synapse-analytics/index.yml) | &#x2705; | &#x2705; |
| [Time Series Insights](../../time-series-insights/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Traffic Manager](../../traffic-manager/index.yml) | &#x2705; | &#x2705; |
| [Virtual Machine Scale Sets](../../virtual-machine-scale-sets/index.yml) | &#x2705; | &#x2705; |
| [Virtual Machines](../../virtual-machines/index.yml) (incl. [Reserved VM Instances](../../virtual-machines/prepay-reserved-vm-instances.md)) | &#x2705; | &#x2705; |
| [Virtual Network](../../virtual-network/index.yml) | &#x2705; | &#x2705; |
| [Virtual Network NAT](../../virtual-network/nat-gateway/index.yml) | &#x2705; | &#x2705; |
| [Virtual WAN](../../virtual-wan/index.yml) | &#x2705; | &#x2705; |
| [VM Image Builder](../../virtual-machines/image-builder-overview.md) | &#x2705; | &#x2705; |
| [VPN Gateway](../../vpn-gateway/index.yml) | &#x2705; | &#x2705; |
| [Web Application Firewall](../../web-application-firewall/index.yml) | &#x2705; | &#x2705; |
| [Windows 10 IoT Core Services](/windows-hardware/manufacture/iot/iotcoreservicesoverview) | &#x2705; | &#x2705; |

**&ast;** FedRAMP High authorization for edge devices (such as Azure Data Box and Azure Stack Edge) applies only to Azure services that support on-premises, customer-managed devices. For example, FedRAMP High authorization for Azure Data Box covers datacenter infrastructure services and Data Box pod and disk service, which are the online software components supporting your Data Box hardware appliance. You are wholly responsible for the authorization package that covers the physical devices. For assistance with accelerating your onboarding and authorization of devices, contact your Microsoft account representative.

**&ast;&ast;** FedRAMP High authorization for Azure Databricks is applicable to limited regions in Azure. To configure Azure Databricks for FedRAMP High use, contact your Microsoft or Databricks representative.

## Azure Government services by audit scope
*Last updated: June 2023*

### Terminology used

- Azure Government = Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia (US Gov regions)
- FedRAMP High = FedRAMP High Provisional Authorization to Operate (P-ATO) in Azure Government
- DoD IL2 = DoD SRG Impact Level 2 Provisional Authorization (PA) in Azure Government
- DoD IL4 = DoD SRG Impact Level 4 Provisional Authorization (PA) in Azure Government
- DoD IL5 = DoD SRG Impact Level 5 Provisional Authorization (PA) in Azure Government
- DoD IL6 = DoD SRG Impact Level 6 Provisional Authorization (PA) in Azure Government Secret
- &#x2705; = service is included in audit scope and has been authorized

> [!NOTE]
>
> - Some services deployed in Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia (US Gov regions) require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in **[Isolation guidelines for Impact Level 5 workloads](../documentation-government-impact-level-5.md).**
> - For DoD IL5 PA compliance scope in Azure Government regions US DoD Central and US DoD East (US DoD regions), see **[US DoD regions IL5 audit scope](../documentation-government-overview-dod.md#us-dod-regions-il5-audit-scope).**

| Service | FedRAMP High | DoD IL2 | DoD IL4 | DoD IL5 | DoD IL6 |
| ------- |:------------:|:-------:|:-------:|:-------:|:-------:|
| [Advisor](../../advisor/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [AI Builder](/ai-builder/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Analysis Services](../../analysis-services/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [API Management](../../api-management/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [App Configuration](../../azure-app-configuration/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [App Service](../../app-service/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Application Gateway](../../application-gateway/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Automation](../../automation/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Entra ID (Free and Basic)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Entra ID (Premium P1 + P2)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Entra Domain Services](../../active-directory-domain-services/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Entra multifactor authentication](../../active-directory/authentication/concept-mfa-howitworks.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure API for FHIR](../../healthcare-apis/azure-api-for-fhir/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Arc-enabled Kubernetes](../../azure-arc/kubernetes/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Arc-enabled servers](../../azure-arc/servers/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Azure Cache for Redis](../../azure-cache-for-redis/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Cosmos DB](../../cosmos-db/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure CXP Nomination Portal](https://cxp.azure.com/nominationportal/nominationform/fasttrack) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Database for MariaDB](../../mariadb/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Database for MySQL](../../mysql/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Database for PostgreSQL](../../postgresql/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Databricks](/azure/databricks/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Information Protection](/azure/information-protection/) **&ast;&ast;** | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Kubernetes Service (AKS)](../../aks/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Maps](../../azure-maps/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Monitor](../../azure-monitor/index.yml) (incl. [Application Insights](../../azure-monitor/app/app-insights-overview.md) and [Log Analytics](../../azure-monitor/logs/data-platform-logs.md)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure NetApp Files](../../azure-netapp-files/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Policy](../../governance/policy/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Policy's guest configuration](../../governance/machine-configuration/overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Red Hat OpenShift](../../openshift/index.yml) | &#x2705; | &#x2705; | &#x2705; |  |  |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Azure Resource Manager](../../azure-resource-manager/management/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Service Manager (RDFE)](/previous-versions/azure/ee460799(v=azure.100)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Sign-up portal](https://signup.azure.com/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Stack Bridge](/azure-stack/operator/azure-stack-usage-reporting) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Stack Edge](../../databox-online/index.yml) (formerly Data Box Edge) **&ast;** | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Stack HCI](/azure-stack/hci/) | &#x2705; | &#x2705; | &#x2705; |  |  |
| [Azure Video Indexer](../../azure-video-indexer/index.yml)  | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Virtual Desktop](../../virtual-desktop/index.yml) (formerly Windows Virtual Desktop) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Backup](../../backup/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Bastion](../../bastion/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Batch](../../batch/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blueprints](../../governance/blueprints/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Bot Service](/azure/bot-service/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Cloud Services](../../cloud-services/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Cloud Shell](../../cloud-shell/overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Cognitive Search](../../search/index.yml) (formerly Azure Search) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure AI services: Computer Vision](../../ai-services/computer-vision/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: Content Moderator](../../ai-services/content-moderator/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI containers](../../ai-services/cognitive-services-container-support.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: Custom Vision](../../ai-services/custom-vision-service/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: Face](../../ai-services/computer-vision/overview-identity.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: LUIS](../../ai-services/luis/index.yml) </br> (part of [Azure AI Language](../../ai-services/language-service/index.yml)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure AI services: Personalizer](../../ai-services/personalizer/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: QnA Maker](../../ai-services/qnamaker/index.yml) </br> (part of [Azure AI Language](../../ai-services/language-service/index.yml)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI Speech](../../ai-services/speech-service/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: Text Analytics](../../ai-services/language-service/concepts/migrate.md#do-i-need-to-migrate-to-the-language-service-if-i-am-using-text-analytics) </br> (part of [Azure AI Language](../../ai-services/language-service/index.yml)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: Translator](../../ai-services/translator/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Container Instances](../../container-instances/index.yml)| &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Container Registry](../../container-registry/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Content Delivery Network (CDN)](../../cdn/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Cost Management and Billing](../../cost-management-billing/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Data Box](../../databox/index.yml) **&ast;** | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Data Explorer](/azure/data-explorer/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Data Factory](../../data-factory/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Data Share](../../data-share/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Database Migration Service](../../dms/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Dataverse](/powerapps/maker/data-platform/) (formerly Common Data Service) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [DDoS Protection](../../ddos-protection/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Dedicated HSM](../../dedicated-hsm/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [DevTest Labs](../../devtest-labs/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [DNS](../../dns/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Dynamics 365 Chat (Omnichannel Engagement Hub)](/dynamics365/omnichannel/introduction-omnichannel) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Dynamics 365 Customer Insights](/dynamics365/customer-insights/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Dynamics 365 Customer Service](/dynamics365/customer-service/overview) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Dynamics 365 Customer Voice](/dynamics365/customer-voice/about) (formerly Forms Pro) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Dynamics 365 Field Service](/dynamics365/field-service/overview) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Dynamics 365 Finance](/dynamics365/finance/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Dynamics 365 Project Service Automation](/dynamics365/project-operations/psa/overview) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Dynamics 365 Sales](/dynamics365/sales/help-hub) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Dynamics 365 Supply Chain Management](/dynamics365/supply-chain/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Event Grid](../../event-grid/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Event Hubs](../../event-hubs/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [ExpressRoute](../../expressroute/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [File Sync](../../storage/file-sync/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Firewall](../../firewall/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Firewall Manager](../../firewall-manager/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI Document Intelligence](../../ai-services/document-intelligence/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Front Door](../../frontdoor/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Functions](../../azure-functions/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [GitHub AE](https://docs.github.com/en/github-ae@latest/admin/overview/about-github-ae) | &#x2705; | &#x2705; | &#x2705; | | |
| [HDInsight](../../hdinsight/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [HPC Cache](../../hpc-cache/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Import/Export](../../import-export/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [IoT Hub](../../iot-hub/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Key Vault](../../key-vault/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Lab Services](../../lab-services/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Lighthouse](../../lighthouse/index.yml)| &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Load Balancer](../../load-balancer/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Logic Apps](../../logic-apps/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Machine Learning](../../machine-learning/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Managed Applications](../../azure-resource-manager/managed-applications/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Media Services](/azure/media-services/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft 365 Defender](/microsoft-365/security/defender/) (formerly Microsoft Threat Protection) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Azure portal](../../azure-portal/index.yml) | &#x2705; | &#x2705; | &#x2705;| &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Microsoft Azure Government portal](../documentation-government-get-started-connect-with-portal.md) | &#x2705; | &#x2705; | &#x2705;| &#x2705; | |
| [Microsoft Defender for Cloud](../../defender-for-cloud/index.yml) (formerly Azure Security Center) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Defender for Cloud Apps](/defender-cloud-apps/) (formerly Microsoft Cloud App Security) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) (formerly Microsoft Defender Advanced Threat Protection) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Defender for Identity](/defender-for-identity/) (formerly Azure Advanced Threat Protection) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Defender for IoT](../../defender-for-iot/index.yml) (formerly Azure Security for IoT) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Graph](/graph/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Intune](/mem/intune/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Sentinel](../../sentinel/index.yml) (formerly Azure Sentinel) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Stream](/stream/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Migrate](../../migrate/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Network Watcher](../../network-watcher/index.yml) (incl. [Traffic Analytics](../../network-watcher/traffic-analytics.md)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Notification Hubs](../../notification-hubs/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Peering Service](../../peering-service/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Planned Maintenance for VMs](../../virtual-machines/maintenance-and-updates.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Power Apps](/powerapps/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Power Automate](/power-automate/) (formerly Microsoft Flow) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Power BI](/power-bi/fundamentals/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Power BI Embedded](/power-bi/developer/embedded/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Power Data Integrator for Dataverse](/power-platform/admin/data-integrator) (formerly Dynamics 365 Integrator App) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Power Query Online](/power-query/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Power Virtual Agents](/power-virtual-agents/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Private Link](../../private-link/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Public IP](../../virtual-network/ip-services/public-ip-addresses.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Resource Graph](../../governance/resource-graph/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Resource Mover](../../resource-mover/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Route Server](../../route-server/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Scheduler](../../scheduler/index.yml) (replaced by [Logic Apps](../../logic-apps/index.yml)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Service Bus](../../service-bus-messaging/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Service Fabric](../../service-fabric/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Service Health](../../service-health/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [SignalR Service](../../azure-signalr/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Site Recovery](../../site-recovery/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [SQL Database](/azure/azure-sql/database/sql-database-paas-overview) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [SQL Server Stretch Database](../../sql-server-stretch-database/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Storage: Archive](../../storage/blobs/access-tiers-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Storage: Blobs](../../storage/blobs/index.yml) (incl. [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Storage: Disks (incl. managed disks)](../../virtual-machines/managed-disks-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Storage: Files](../../storage/files/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Storage: Queues](../../storage/queues/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Storage: Tables](../../storage/tables/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [StorSimple](../../storsimple/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Stream Analytics](../../stream-analytics/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Synapse Analytics](../../synapse-analytics/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Synapse Link for Dataverse](/powerapps/maker/data-platform/export-to-data-lake) | &#x2705; | &#x2705; | &#x2705; | | |
| [Traffic Manager](../../traffic-manager/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Machine Scale Sets](../../virtual-machine-scale-sets/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Machines](../../virtual-machines/index.yml) (incl. [Reserved VM Instances](../../virtual-machines/prepay-reserved-vm-instances.md)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Network](../../virtual-network/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Network NAT](../../virtual-network/nat-gateway/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Virtual WAN](../../virtual-wan/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [VM Image Builder](../../virtual-machines/image-builder-overview.md) | &#x2705; | &#x2705; | &#x2705; |  |  |
| [VPN Gateway](../../vpn-gateway/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Web Application Firewall](../../web-application-firewall/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |

**&ast;** Authorizations for edge devices (such as Azure Data Box and Azure Stack Edge) apply only to Azure services that support on-premises, customer-managed devices. You are wholly responsible for the authorization package that covers the physical devices. For assistance with accelerating your onboarding and authorization of devices, contact your Microsoft account representative.

**&ast;&ast;** Azure Information Protection (AIP) is part of the Microsoft Purview Information Protection solution - it extends the labeling and classification functionality provided by Microsoft 365. Before AIP can be used for DoD workloads at a given impact level (IL), the corresponding Microsoft 365 services must be authorized at the same IL.

## Next steps

- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Azure Government overview](../documentation-government-welcome.md)
- [Azure Government security](../documentation-government-plan-security.md)
- [FedRAMP High](/azure/compliance/offerings/offering-fedramp)
- [DoD Impact Level 2](/azure/compliance/offerings/offering-dod-il2)
- [DoD Impact Level 4](/azure/compliance/offerings/offering-dod-il4)
- [DoD Impact Level 5](/azure/compliance/offerings/offering-dod-il5)
- [DoD Impact Level 6](/azure/compliance/offerings/offering-dod-il6)
- [Azure Government isolation guidelines for Impact Level 5 workloads](../documentation-government-impact-level-5.md)
- [Azure guidance for secure isolation](../azure-secure-isolation-guidance.md)
