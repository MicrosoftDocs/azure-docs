---
title: Azure and other Microsoft cloud services compliance scope
description: FedRAMP & DoD compliance scope for Azure, Dynamics 365, Microsoft 365, and Power Platform for Azure, Azure Government, & Azure Government Secret.
author: gjain
ms.author: eliotgra
ms.topic: article
ms.service: azure-government
ms.custom: references_regions
recommendations: false
ms.date: 01/27/2025
---

# Azure, Dynamics 365, Microsoft 365, and Power Platform services compliance scope

Microsoft Azure cloud environments meet demanding US government compliance requirements that produce formal authorizations, including:

- [Federal Risk and Authorization Management Program](https://www.fedramp.gov/) (FedRAMP)
- Department of Defense (DoD) Cloud Computing [Security Requirements Guide](https://public.cyber.mil/dccs/dccs-documents/) (SRG) Impact Level (IL) 2, 4, 5, and 6
- [Joint Special Access Program (SAP) Implementation Guide (JSIG)](https://www.dcsa.mil/portals/91/documents/ctp/nao/JSIG_2016April11_Final_(53Rev4).pdf)

**Azure** (also known as Azure Commercial, Azure Public, or Azure Global) maintains the following authorizations that pertain to all Azure public regions in the United States:

- [FedRAMP High](/azure/compliance/offerings/offering-fedramp) Provisional Authorization to Operate (P-ATO) issued by the FedRAMP Joint Authorization Board (JAB)
- [DoD IL2](/azure/compliance/offerings/offering-dod-il2) Provisional Authorization (PA) issued by the Defense Information Systems Agency (DISA)

**Azure Government** maintains the following authorizations that pertain to Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia (US Gov regions):

- [FedRAMP High](/azure/compliance/offerings/offering-fedramp) P-ATO issued by the JAB
- [DoD IL2](/azure/compliance/offerings/offering-dod-il2) PA issued by DISA
- [DoD IL4](/azure/compliance/offerings/offering-dod-il4) PA issued by DISA
- [DoD IL5](/azure/compliance/offerings/offering-dod-il5) PA issued by DISA

For current Azure Government regions and available services, see [Products available by region](https://go.microsoft.com/fwlink/?linkid=2274941&clcid=0x409).

> [!NOTE]
>
> - Some Azure services deployed in Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia (US Gov regions) require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in **[Isolation guidelines for Impact Level 5 workloads](../documentation-government-impact-level-5.md).**
> - For DoD IL5 PA compliance scope in Azure Government regions US DoD Central and US DoD East (US DoD regions), see **[US DoD regions IL5 audit scope](../documentation-government-overview-dod.md#us-dod-regions-il5-audit-scope).**
> - For full list of M365 GCC high services authorized for FedRAMP High, see **[Microsoft Office 365 GCC High FedRAMP Marketplace](https://marketplace.fedramp.gov/products/FR1824057433)**. Azure Communication Services operates under the same infrastructure that powers Microsoft Teams and obtained FedRAMP High accreditation as part of the M365 GCC-High service offering.

**Azure Government Secret** maintains:

- [DoD IL6](/azure/compliance/offerings/offering-dod-il6) PA issued by DISA
- [JSIG PL3](/azure/compliance/offerings/offering-jsig) ATO (for authorization details, contact your Microsoft account representative)

**Azure Government Top Secret** maintains:

- [ICD 503](/azure/compliance/offerings/offering-icd-503) ATO with facilities at ICD 705 (for authorization details, contact your Microsoft account representative)
- [JSIG PL3](/azure/compliance/offerings/offering-jsig) ATO (for authorization details, contact your Microsoft account representative)

This article provides a detailed list of Azure, Dynamics 365, Microsoft 365, and Power Platform cloud services in scope for FedRAMP High, DoD IL2, DoD IL4, DoD IL5, and DoD IL6 authorizations across Azure, Azure Government, and Azure Government Secret cloud environments. For other authorization details in Azure Government Secret and Azure Government Top Secret, contact your Microsoft account representative.

## Azure public services by audit scope
*Last updated: January 2025*

### Terminology used

- FedRAMP High = FedRAMP High Provisional Authorization to Operate (P-ATO) in Azure
- DoD IL2 = DoD SRG Impact Level 2 Provisional Authorization (PA) in Azure
- &#x2705; = service is included in audit scope and has been authorized

| Service | FedRAMP High | DoD IL2 |
| ------- |:------------:|:-------:|
| [Advisor](/azure/advisor/) | &#x2705; | &#x2705; |
| [AI Builder](/ai-builder/) | &#x2705; | &#x2705; |
| [Analysis Services](../../analysis-services/index.yml) | &#x2705; | &#x2705; |
| [API Management](../../api-management/index.yml) | &#x2705; | &#x2705; |
| [App Configuration](../../azure-app-configuration/index.yml) | &#x2705; | &#x2705; |
| [App Service](../../app-service/index.yml) | &#x2705; | &#x2705; |
| [Application Gateway](../../application-gateway/index.yml) | &#x2705; | &#x2705; |
| [Automation](../../automation/index.yml) | &#x2705; | &#x2705; |
| [Microsoft Entra ID (Free)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) **&ast;**| &#x2705; | &#x2705; |
| [Microsoft Entra ID (P1 + P2)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; |
| [Azure Active Directory B2C](../../active-directory-b2c/index.yml) | &#x2705; | &#x2705; |
| [Microsoft Entra Domain Services](../../active-directory-domain-services/index.yml) | &#x2705; | &#x2705; |
| [Microsoft Entra provisioning service](../../active-directory/app-provisioning/how-provisioning-works.md)| &#x2705; | &#x2705; |
| [Microsoft Entra multifactor authentication](../../active-directory/authentication/concept-mfa-howitworks.md) | &#x2705; | &#x2705; |
| [Azure Health Data Services](../../healthcare-apis/azure-api-for-fhir/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Azure Arc-enabled servers](/azure/azure-arc/servers/) | &#x2705; | &#x2705; |
| [Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/) | &#x2705; | &#x2705; |
| [Azure Cache for Redis](../../azure-cache-for-redis/index.yml) | &#x2705; | &#x2705; |
| [Azure Cosmos DB](/azure/cosmos-db/) | &#x2705; | &#x2705; |
| [Azure Container Apps](../../container-apps/index.yml) | &#x2705; | &#x2705; |
| [Azure Database for MySQL](/azure/mysql/) | &#x2705; | &#x2705; |
| [Azure Database for PostgreSQL](/azure/postgresql/) | &#x2705; | &#x2705; |
| [Azure Databricks](/azure/databricks/) **&ast;&ast;** | &#x2705; | &#x2705; |
| [Azure Fluid Relay](../../azure-fluid-relay/index.yml) | &#x2705; | &#x2705; |
| [Azure for Education](https://azureforeducation.microsoft.com/) | &#x2705; | &#x2705; |
| [Azure Information Protection](/azure/information-protection/) | &#x2705; | &#x2705; |
| [Azure Kubernetes Service (AKS)](/azure/aks/) | &#x2705; | &#x2705; |
| [Azure Managed Grafana](../../managed-grafana/index.yml) | &#x2705; | &#x2705; |
| [Azure Marketplace portal](https://azuremarketplace.microsoft.com/) | &#x2705; | &#x2705; |
| [Azure Maps](../../azure-maps/index.yml) | &#x2705; | &#x2705; |
| [Azure Monitor](/azure/azure-monitor/) (incl. [Application Insights](/azure/azure-monitor/app/app-insights-overview), [Log Analytics](/azure/azure-monitor/logs/data-platform-logs), and [Application Change Analysis](/azure/azure-monitor/app/change-analysis)) | &#x2705; | &#x2705; |
| [Azure NetApp Files](../../azure-netapp-files/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Azure OpenAI](/azure/ai-services/openai/) | &#x2705; | &#x2705; |
| [Azure Policy](../../governance/policy/index.yml) | &#x2705; | &#x2705; |
| [Azure Policy's guest configuration](../../governance/machine-configuration/overview.md) | &#x2705; | &#x2705; |
| [Azure Red Hat OpenShift](../../openshift/index.yml) | &#x2705; | &#x2705; |
| [Azure Resource Manager](../../azure-resource-manager/management/index.yml) | &#x2705; | &#x2705; |
| [Azure Service Manager (RDFE)](/previous-versions/azure/ee460799(v=azure.100)) | &#x2705; | &#x2705; |
| [Azure Sign-up portal](https://signup.azure.com/) | &#x2705; | &#x2705; |
| [Azure Sphere](/azure-sphere/) | &#x2705; | &#x2705; |
| [Azure Spring Apps](../../spring-apps/index.yml) | &#x2705; | &#x2705; |
| [Azure Stack Edge](../../databox-online/index.yml) (formerly Data Box Edge) **&ast;&ast;&ast;** | &#x2705; | &#x2705; |
| [Azure Local](/azure-stack/hci/) **&ast;&ast;&ast;** | &#x2705; | &#x2705; |
| [Azure Static WebApps](../../static-web-apps/index.yml) | &#x2705; | &#x2705; |
| [Azure Video Indexer](/azure/azure-video-indexer/) | &#x2705; | &#x2705; |
| [Azure Virtual Desktop](../../virtual-desktop/index.yml) (formerly Windows Virtual Desktop) | &#x2705; | &#x2705; |
| [Azure VMware Solution](../../azure-vmware/index.yml) | &#x2705; | &#x2705; |
| [Azure Web PubSub](../../azure-web-pubsub/index.yml) | &#x2705; | &#x2705; |
| [Backup](../../backup/index.yml) | &#x2705; | &#x2705; |
| [Bastion](../../bastion/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Batch](../../batch/index.yml) | &#x2705; | &#x2705; |
| [Blueprints](../../governance/blueprints/index.yml) | &#x2705; | &#x2705; |
| [Bot Service](/azure/bot-service/) | &#x2705; | &#x2705; |
| [Cloud Services](../../cloud-services/index.yml) | &#x2705; | &#x2705; |
| [Cloud Shell](../../cloud-shell/overview.md) | &#x2705; | &#x2705; |
| [Azure AI Health Bot](/healthbot/) | &#x2705; | &#x2705; |
| [Azure AI Search](/azure/search/) (formerly Azure Cognitive Search) | &#x2705; | &#x2705; |
| [Azure AI services: Anomaly Detector](/azure/ai-services/anomaly-detector/) | &#x2705; | &#x2705; |
| [Azure AI services: Computer Vision](/azure/ai-services/computer-vision/) | &#x2705; | &#x2705; |
| [Azure AI services: Content Moderator](/azure/ai-services/content-moderator/) | &#x2705; | &#x2705; |
| [Azure AI services: Containers](/azure/ai-services/cognitive-services-container-support) | &#x2705; | &#x2705; |
| [Azure AI services: Custom Vision](/azure/ai-services/custom-vision-service/) | &#x2705; | &#x2705; |
| [Azure AI services: Face](/azure/ai-services/computer-vision/overview-identity) | &#x2705; | &#x2705; |
| [Azure AI Language Understanding (LUIS)](/azure/ai-services/luis/) </br> (part of [Azure AI Language](/azure/ai-services/language-service/)) | &#x2705; | &#x2705; |
| [Azure AI services: Personalizer](/azure/ai-services/personalizer/) | &#x2705; | &#x2705; |
| [Azure AI services: QnA Maker](/azure/ai-services/qnamaker/) </br> (part of [Azure AI Language](/azure/ai-services/language-service/)) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Azure AI services: Speech](/azure/ai-services/speech-service/) | &#x2705; | &#x2705; |
| [Azure AI services: Text Analytics](/azure/ai-services/language-service/concepts/migrate#do-i-need-to-migrate-to-the-language-service-if-i-am-using-text-analytics) <br> (part of [Azure AI Language](/azure/ai-services/language-service/)) | &#x2705; | &#x2705; |
| [Azure AI services: Translator](/azure/ai-services/translator/) | &#x2705; | &#x2705; |
| [Container Instances](/azure/container-instances/) | &#x2705; | &#x2705; |
| [Container Registry](/azure/container-registry/) | &#x2705; | &#x2705; |
| [Content Delivery Network (CDN)](../../cdn/index.yml) | &#x2705; | &#x2705; |
| [Cost Management and Billing](../../cost-management-billing/index.yml) | &#x2705; | &#x2705; |
| [Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md) | &#x2705; | &#x2705; |
| [Data Box](../../databox/index.yml) **&ast;&ast;&ast;** | &#x2705; | &#x2705; |
| [Data Explorer](/azure/data-explorer/) | &#x2705; | &#x2705; |
| [Data Factory](../../data-factory/index.yml) | &#x2705; | &#x2705; |
| [Data Share](../../data-share/index.yml) | &#x2705; | &#x2705; |
| [Database Migration Service](/azure/dms/) | &#x2705; | &#x2705; |
| [Dataverse](/powerapps/maker/data-platform/) (incl. [Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/export-to-data-lake)) | &#x2705; | &#x2705; |
| [DDoS Protection](../../ddos-protection/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Dedicated HSM](/azure/dedicated-hsm/) | &#x2705; | &#x2705; |
| [DevTest Labs](../../devtest-labs/index.yml) | &#x2705; | &#x2705; |
| [DNS](../../dns/index.yml) | &#x2705; | &#x2705; |
| [Omnichannel for Customer Service (Formerly Dynamics 365 Chat and Omnichannel Engagement Hub)](/dynamics365/omnichannel/introduction-omnichannel) | &#x2705; | &#x2705; |
| [Dynamics 365 Commerce](/dynamics365/commerce/)| &#x2705; | &#x2705; |
| [Dynamics 365 Customer Service](/dynamics365/customer-service/overview)| &#x2705; | &#x2705; |
| [Dynamics 365 Field Service](/dynamics365/field-service/overview)| &#x2705; | &#x2705; |
| [Dynamics 365 Finance](/dynamics365/finance/)| &#x2705; | &#x2705; |
| [Dynamics 365 Fraud Protection](/dynamics365/fraud-protection/)| &#x2705; | &#x2705; |
| [Dynamics 365 Guides](/dynamics365/mixed-reality/guides/)| &#x2705; | &#x2705; |
| [Dynamics 365 Sales](/dynamics365/sales/help-hub) | &#x2705; | &#x2705; |
| [Dynamics 365 Intelligent Order Management](/dynamics365/intelligent-order-management/) | &#x2705; | &#x2705; |
| [Dynamics 365 Sales Professional](/dynamics365/sales/overview#dynamics-365-sales-professional) | &#x2705; | &#x2705; |
| [Dynamics 365 Supply Chain Management](/dynamics365/supply-chain/)| &#x2705; | &#x2705; |
| [Event Grid](../../event-grid/index.yml) | &#x2705; | &#x2705; |
| [Event Hubs](../../event-hubs/index.yml) | &#x2705; | &#x2705; |
| [ExpressRoute](../../expressroute/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [File Sync](../../storage/file-sync/index.yml) | &#x2705; | &#x2705; |
| [Firewall](../../firewall/index.yml)  | &#x2705; | &#x2705; |
| [Firewall Manager](../../firewall-manager/index.yml)  | &#x2705; | &#x2705; |
| [Azure AI Document Intelligence](/azure/ai-services/document-intelligence/) | &#x2705; | &#x2705; |
| [Front Door](../../frontdoor/index.yml) | &#x2705; | &#x2705; |
| [Functions](../../azure-functions/index.yml) | &#x2705; | &#x2705; |
| [HDInsight](../../hdinsight/index.yml) | &#x2705; | &#x2705; |
| [HPC Cache](../../hpc-cache/index.yml) | &#x2705; | &#x2705; |
| [Immersive Reader](/azure/ai-services/immersive-reader/) | &#x2705; | &#x2705; |
| [Import/Export](../../import-export/index.yml) | &#x2705; | &#x2705; |
| [Internet Analyzer](../../internet-analyzer/index.yml) | &#x2705; | &#x2705; |
| [IoT Hub](../../iot-hub/index.yml) | &#x2705; | &#x2705; |
| [Key Vault](/azure/key-vault/) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Lab Services](../../lab-services/index.yml) | &#x2705; | &#x2705; |
| [Lighthouse](/azure/lighthouse/) | &#x2705; | &#x2705; |
| [Load Balancer](../../load-balancer/index.yml) | &#x2705; | &#x2705; |
| [Logic Apps](../../logic-apps/index.yml) | &#x2705; | &#x2705; |
| [Machine Learning](/azure/machine-learning/) | &#x2705; | &#x2705; |
| [Managed Applications](../../azure-resource-manager/managed-applications/index.yml) | &#x2705; | &#x2705; |
| [Media Services](/azure/media-services/) | &#x2705; | &#x2705; |
| [Metrics Advisor](/azure/ai-services/metrics-advisor/) | &#x2705; | &#x2705; |
| [Microsoft Azure Attestation](/azure/attestation/)| &#x2705; | &#x2705; |
| [Microsoft Azure portal](https://azure.microsoft.com/features/azure-portal/)| &#x2705; | &#x2705; |
| [Microsoft Defender for Cloud](/azure/defender-for-cloud/) (formerly Azure Security Center) | &#x2705; | &#x2705; |
| [Microsoft Defender for Cloud Apps](/defender-cloud-apps/) (formerly Microsoft Cloud App Security) | &#x2705; | &#x2705; |
| [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) (formerly Microsoft Defender Advanced Threat Protection) | &#x2705; | &#x2705; |
| [Microsoft Defender for Identity](/defender-for-identity/) (formerly Azure Advanced Threat Protection) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Microsoft Defender for IoT](../../defender-for-iot/index.yml) (formerly Azure Security for IoT) | &#x2705; | &#x2705; |
| [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/) | &#x2705; | &#x2705; |
| [Microsoft Defender Threat Intelligence](/defender/threat-intelligence/what-is-microsoft-defender-threat-intelligence-defender-ti) | &#x2705; | &#x2705; |
| [Microsoft Entra ID Governance](/entra/id-governance/) | &#x2705; | &#x2705; |
| [Microsoft Fabric](/fabric/) | &#x2705; | &#x2705; |
| [Microsoft Graph](/graph/) | &#x2705; | &#x2705; |
| [Microsoft Intune](/mem/intune/) | &#x2705; | &#x2705; |
| [Microsoft Purview](../../purview/index.yml) (incl. Data Map, Data Estate Insights, and governance portal) | &#x2705; | &#x2705; |
| [Microsoft Secure Score](/defender-xdr/microsoft-secure-score/) | &#x2705; | &#x2705; |
| [Microsoft Sentinel](../../sentinel/index.yml) (formerly Azure Sentinel) | &#x2705; | &#x2705; |
| [Microsoft Stream](/stream/) | &#x2705; | &#x2705; |
| [Microsoft Threat Experts](/microsoft-365/security/defender-endpoint/microsoft-threat-experts) | &#x2705; | &#x2705; |
| [Migrate](../../migrate/index.yml) | &#x2705; | &#x2705; |
| [Network Watcher](../../network-watcher/index.yml) (incl. [Traffic Analytics](../../network-watcher/traffic-analytics.md)) | &#x2705; | &#x2705; |
| [Notification Hubs](../../notification-hubs/index.yml) | &#x2705; | &#x2705; |
| [Open Datasets](/azure/open-datasets/) | &#x2705; | &#x2705; |
| [Peering Service](../../peering-service/index.yml) | &#x2705; | &#x2705; |
| [Planned Maintenance for VMs](/azure/virtual-machines/maintenance-and-updates) | &#x2705; | &#x2705; |
| [Power Apps](/powerapps/) | &#x2705; | &#x2705; |
| [Power Pages](https://powerapps.microsoft.com/portals/) (formerly PowerApps Portal)| &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Power Automate](/power-automate/) (formerly Microsoft Flow) | &#x2705; | &#x2705; |
| [Power BI](/power-bi/fundamentals/) | &#x2705; | &#x2705; |
| [Power BI Embedded](/power-bi/developer/embedded/) | &#x2705; | &#x2705; |
| [Power Data Integrator for Dataverse](/power-platform/admin/data-integrator) (formerly Dynamics 365 Integrator App) | &#x2705; | &#x2705; |
| [Microsoft Copilot Studio](/power-virtual-agents/) | &#x2705; | &#x2705; |
| [Private Link](../../private-link/index.yml) | &#x2705; | &#x2705; |
| [Public IP](../../virtual-network/ip-services/public-ip-addresses.md) | &#x2705; | &#x2705; |
| [Resource Graph](../../governance/resource-graph/index.yml) | &#x2705; | &#x2705; |
| [Resource Mover](../../resource-mover/index.yml) | &#x2705; | &#x2705; |
| [Route Server](../../route-server/index.yml) | &#x2705; | &#x2705; |
| [Scheduler](../../scheduler/index.yml) (replaced by [Logic Apps](../../logic-apps/index.yml)) | &#x2705; | &#x2705; |
| [Service Bus](../../service-bus-messaging/index.yml) | &#x2705; | &#x2705; |
| [Service Fabric](/azure/service-fabric/) | &#x2705; | &#x2705; |
| [Service Health](/azure/service-health/) | &#x2705; | &#x2705; |
| [SignalR Service](../../azure-signalr/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Site Recovery](../../site-recovery/index.yml) | &#x2705; | &#x2705; |
| [SQL Database](/azure/azure-sql/database/sql-database-paas-overview) | &#x2705; | &#x2705; |
| [SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview) | &#x2705; | &#x2705; |
| [SQL Server Stretch Database](../../sql-server-stretch-database/index.yml) | &#x2705; | &#x2705; |
| [Storage: Archive](../../storage/blobs/access-tiers-overview.md) | &#x2705; | &#x2705; |
| [Storage: Blobs](../../storage/blobs/index.yml) (incl. [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md)) | &#x2705; | &#x2705; |
| [Storage: Disks (incl. managed disks)](/azure/virtual-machines/managed-disks-overview) | &#x2705; | &#x2705; |
| [Storage: Files](../../storage/files/index.yml) | &#x2705; | &#x2705; |
| [Storage: Queues](../../storage/queues/index.yml) | &#x2705; | &#x2705; |
| [Storage: Tables](../../storage/tables/index.yml) | &#x2705; | &#x2705; |
| [StorSimple](../../storsimple/index.yml) | &#x2705; | &#x2705; |
| [Stream Analytics](../../stream-analytics/index.yml) | &#x2705; | &#x2705; |
| [Synapse Analytics](../../synapse-analytics/index.yml) | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** |
| [Traffic Manager](../../traffic-manager/index.yml) | &#x2705; | &#x2705; |
| [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/) | &#x2705; | &#x2705; |
| [Virtual Machines](/azure/virtual-machines/) | &#x2705; | &#x2705; |
| [Virtual Network](../../virtual-network/index.yml) | &#x2705; | &#x2705; |
| [Virtual Network NAT](../../virtual-network/nat-gateway/index.yml) | &#x2705; | &#x2705; |
| [Virtual WAN](../../virtual-wan/index.yml) | &#x2705; | &#x2705; |
| [VM Image Builder](/azure/virtual-machines/image-builder-overview) | &#x2705; | &#x2705; |
| [VPN Gateway](../../vpn-gateway/index.yml) | &#x2705; | &#x2705; |
| [Web Application Firewall](../../web-application-firewall/index.yml) | &#x2705; | &#x2705; |
| [Windows 10 IoT Core Services](/windows-hardware/manufacture/iot/iotcoreservicesoverview) | &#x2705; | &#x2705; |

**&ast;** FedRAMP High and DoD SRG Impact Level 2 authorization for Microsoft Entra ID applies to Microsoft Entra External ID. To learn more about Entra External ID, refer to the documentation [here](/entra/)

**&ast;&ast;** FedRAMP High authorization for Azure Databricks is applicable to limited regions in Azure. To configure Azure Databricks for FedRAMP High use, contact your Microsoft or Databricks representative.

**&ast;&ast;&ast;** FedRAMP High authorization for edge devices (such as Azure Data Box, Azure Stack Edge and Azure Local) applies only to Azure services that support on-premises, customer-managed devices. For example, FedRAMP High authorization for Azure Data Box covers datacenter infrastructure services and Data Box pod and disk service, which are the online software components supporting your Data Box hardware appliance. You are wholly responsible for the authorization package that covers the physical devices. For assistance with accelerating your onboarding and authorization of devices, contact your Microsoft account representative.

## Azure Government services by audit scope
*Last updated: August 2024*

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
| [Advisor](/azure/advisor/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [AI Builder](/ai-builder/) | &#x2705; | &#x2705; | &#x2705; | &#x2705;| |
| [Analysis Services](../../analysis-services/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [API Management](../../api-management/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [App Configuration](../../azure-app-configuration/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [App Service](../../app-service/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Application Gateway](../../application-gateway/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Automation](../../automation/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Entra ID (Free)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Entra ID (P1 + P2)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Entra Domain Services](../../active-directory-domain-services/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Entra ID Governance](/entra/) | &#x2705; | &#x2705; | | | |
| [Microsoft Entra multifactor authentication](../../active-directory/authentication/concept-mfa-howitworks.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure API for FHIR](../../healthcare-apis/azure-api-for-fhir/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Arc-enabled servers](/azure/azure-arc/servers/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Azure Cache for Redis](../../azure-cache-for-redis/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Cosmos DB](/azure/cosmos-db/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure CXP Nomination Portal](https://cxp.azure.com/nominationportal/nominationform/fasttrack) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Database for MySQL](/azure/mysql/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Database for PostgreSQL](/azure/postgresql/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Databricks](/azure/databricks/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Fluid Relay](../../azure-fluid-relay/index.yml) | &#x2705; | &#x2705; | |  |  |
| [Azure Information Protection](/azure/information-protection/) **&ast;&ast;** | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Kubernetes Service (AKS)](/azure/aks/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Managed Grafana](../../managed-grafana/index.yml) | &#x2705; | &#x2705; | |  |  |
| [Azure Maps](../../azure-maps/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Monitor](/azure/azure-monitor/) (incl. [Application Insights](/azure/azure-monitor/app/app-insights-overview) and [Log Analytics](/azure/azure-monitor/logs/data-platform-logs)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure NetApp Files](../../azure-netapp-files/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure OpenAI](/azure/ai-services/openai/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Policy](../../governance/policy/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Policy's guest configuration](../../governance/machine-configuration/overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Red Hat OpenShift](../../openshift/index.yml) | &#x2705; | &#x2705; | &#x2705; |  |  |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Azure Resource Manager](../../azure-resource-manager/management/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Service Manager (RDFE)](/previous-versions/azure/ee460799(v=azure.100)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Sign-up portal](https://signup.azure.com/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure Stack](/azure-stack/operator/azure-stack-usage-reporting) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Stack Edge](../../databox-online/index.yml) (formerly Data Box Edge) **&ast;** | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Local](/azure-stack/hci/)  **&ast;** | &#x2705; | &#x2705; | &#x2705; | &#x2705; |  |
| [Azure Video Indexer](/azure/azure-video-indexer/)  | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Virtual Desktop](../../virtual-desktop/index.yml) (formerly Windows Virtual Desktop) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure VMware Solution](../../azure-vmware/index.yml) | &#x2705; | &#x2705; | &#x2705; |  |  |
| [Backup](../../backup/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Bastion](../../bastion/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Batch](../../batch/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blueprints](../../governance/blueprints/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Bot Service](/azure/bot-service/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Cloud Services](../../cloud-services/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Cloud Shell](../../cloud-shell/overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Azure AI Search](/azure/search/) (formerly Azure Cognitive Search) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure AI services: Computer Vision](/azure/ai-services/computer-vision/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: Content Moderator](/azure/ai-services/content-moderator/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI containers](/azure/ai-services/cognitive-services-container-support) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: Custom Vision](/azure/ai-services/custom-vision-service/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: Face](/azure/ai-services/computer-vision/overview-identity) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: LUIS](/azure/ai-services/luis/) </br> (part of [Azure AI Language](/azure/ai-services/language-service/)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure AI services: Personalizer](/azure/ai-services/personalizer/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: QnA Maker](/azure/ai-services/qnamaker/) </br> (part of [Azure AI Language](/azure/ai-services/language-service/)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI Speech](/azure/ai-services/speech-service/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: Text Analytics](/azure/ai-services/language-service/concepts/migrate#do-i-need-to-migrate-to-the-language-service-if-i-am-using-text-analytics) </br> (part of [Azure AI Language](/azure/ai-services/language-service/)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Azure AI services: Translator](/azure/ai-services/translator/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Container Instances](/azure/container-instances/)| &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Container Registry](/azure/container-registry/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Content Delivery Network (CDN)](../../cdn/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Cost Management and Billing](../../cost-management-billing/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Data Box](../../databox/index.yml) **&ast;** | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Data Explorer](/azure/data-explorer/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Data Factory](../../data-factory/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Data Share](../../data-share/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Database Migration Service](/azure/dms/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Dataverse](/powerapps/maker/data-platform/) (formerly Common Data Service) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [DDoS Protection](../../ddos-protection/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Dedicated HSM](/azure/dedicated-hsm/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
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
| [Azure AI Document Intelligence](/azure/ai-services/document-intelligence/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Front Door](../../frontdoor/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Functions](../../azure-functions/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [HDInsight](../../hdinsight/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [HPC Cache](../../hpc-cache/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Import/Export](../../import-export/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [IoT Hub](../../iot-hub/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Key Vault](/azure/key-vault/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Lab Services](../../lab-services/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Lighthouse](/azure/lighthouse/)| &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Load Balancer](../../load-balancer/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Logic Apps](../../logic-apps/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Machine Learning](/azure/machine-learning/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Managed Applications](../../azure-resource-manager/managed-applications/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Media Services](/azure/media-services/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Azure portal](/azure/azure-portal/) | &#x2705; | &#x2705; | &#x2705;| &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Microsoft Azure Government portal](../documentation-government-get-started-connect-with-portal.md) | &#x2705; | &#x2705; | &#x2705;| &#x2705; | |
| [Microsoft Defender for Cloud](/azure/defender-for-cloud/) (formerly Azure Security Center) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Defender for Cloud Apps](/defender-cloud-apps/) (formerly Microsoft Cloud App Security) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) (formerly Microsoft Defender Advanced Threat Protection) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Defender for Identity](/defender-for-identity/) (formerly Azure Advanced Threat Protection) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Defender for IoT](../../defender-for-iot/index.yml) (formerly Azure Security for IoT) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Defender Vulnerability Management](../../defender-for-iot/index.yml) | &#x2705; | &#x2705; | &#x2705; |  | |
| [Microsoft Graph](/graph/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Intune](/mem/intune/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Purview](../../purview/index.yml) (incl. Data Map, Data Estate Insights, and governance portal) | &#x2705; | &#x2705; | &#x2705; | | |
| [Microsoft Sentinel](../../sentinel/index.yml) (formerly Azure Sentinel) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Stream](/stream/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Migrate](../../migrate/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Network Watcher](../../network-watcher/index.yml) (incl. [Traffic Analytics](../../network-watcher/traffic-analytics.md)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Notification Hubs](../../notification-hubs/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Peering Service](../../peering-service/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Planned Maintenance for VMs](/azure/virtual-machines/maintenance-and-updates) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Power Apps](/powerapps/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Power Pages](https://powerapps.microsoft.com/portals/) (formerly PowerApps Portal)| &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Power Automate](/power-automate/) (formerly Microsoft Flow) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Power BI](/power-bi/fundamentals/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Power BI Embedded](/power-bi/developer/embedded/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Power Data Integrator for Dataverse](/power-platform/admin/data-integrator) (formerly Dynamics 365 Integrator App) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Microsoft Copilot Studio](/power-virtual-agents/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Private Link](../../private-link/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Public IP](../../virtual-network/ip-services/public-ip-addresses.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Resource Graph](../../governance/resource-graph/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Resource Mover](../../resource-mover/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Route Server](../../route-server/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Scheduler](../../scheduler/index.yml) (replaced by [Logic Apps](../../logic-apps/index.yml)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Service Bus](../../service-bus-messaging/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Service Fabric](/azure/service-fabric/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Service Health](/azure/service-health/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [SignalR Service](../../azure-signalr/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Site Recovery](../../site-recovery/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [SQL Database](/azure/azure-sql/database/sql-database-paas-overview) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [SQL Server Stretch Database](../../sql-server-stretch-database/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Storage: Archive](../../storage/blobs/access-tiers-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Storage: Blobs](../../storage/blobs/index.yml) (incl. [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Storage: Disks (incl. managed disks)](/azure/virtual-machines/managed-disks-overview) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Storage: Files](../../storage/files/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Storage: Queues](../../storage/queues/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Storage: Tables](../../storage/tables/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [StorSimple](../../storsimple/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Stream Analytics](../../stream-analytics/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Synapse Analytics](../../synapse-analytics/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FedRAMP High** | **DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** |
| [Synapse Link for Dataverse](/powerapps/maker/data-platform/export-to-data-lake) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Traffic Manager](../../traffic-manager/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Machines](/azure/virtual-machines/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Network](../../virtual-network/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Network NAT](../../virtual-network/nat-gateway/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |
| [Virtual WAN](../../virtual-wan/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [VM Image Builder](/azure/virtual-machines/image-builder-overview) | &#x2705; | &#x2705; | &#x2705; |  |  |
| [VPN Gateway](../../vpn-gateway/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Web Application Firewall](../../web-application-firewall/index.yml) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | |

**&ast;** Authorizations for edge devices (such as Azure Data Box, Azure Stack Edge and Azure Local) apply only to Azure services that support on-premises, customer-managed devices. You are wholly responsible for the authorization package that covers the physical devices. For assistance with accelerating your onboarding and authorization of devices, contact your Microsoft account representative.

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
