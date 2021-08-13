---
title: Azure and other Microsoft cloud services compliance scope
description: This article tracks FedRAMP, DoD, and ICD 503 compliance scope for Azure, Dynamics 365, Microsoft 365, and Power Platform cloud services across Azure, Azure Government, and Azure Government Secret cloud environments.
ms.topic: article
ms.service: azure-government
ms.custom: references_regions
ms.date: 08/12/2021
---

# Azure, Dynamics 365, Microsoft 365, and Power Platform services compliance scope

Microsoft Azure cloud environments meet demanding US government compliance requirements that produce formal authorizations, including:

- [Federal Risk and Authorization Management Program](https://www.fedramp.gov/) (FedRAMP)
- Department of Defense (DoD) Cloud Computing [Security Requirements Guide](https://dl.dod.cyber.mil/wp-content/uploads/cloud/SRG/index.html) (SRG) Impact Level (IL) 2, 4, 5, and 6
- [Intelligence Community Directive (ICD) 503](http://www.dni.gov/files/documents/ICD/ICD_503.pdf)

**Azure** (also known as Azure Commercial, Azure Public, or Azure Global) maintains the following authorizations:

- [FedRAMP High](/azure/compliance/offerings/offering-fedramp) Provisional Authorization to Operate (P-ATO) issued by the FedRAMP Joint Authorization Board (JAB)
- [DoD IL2](/azure/compliance/offerings/offering-dod-il2) Provisional Authorization (PA) issued by the Defense Information Systems Agency (DISA)

**Azure Government** maintains the following authorizations that pertain to Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia:

- [FedRAMP High](/azure/compliance/offerings/offering-fedramp) P-ATO issued by the JAB
- [DoD IL2](/azure/compliance/offerings/offering-dod-il2) PA issued by DISA
- [DoD IL4](/azure/compliance/offerings/offering-dod-il4) PA issued by DISA
- [DoD IL5](/azure/compliance/offerings/offering-dod-il5) PA issued by DISA

For current Azure Government regions and available services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

> [!NOTE]
>
> - Some Azure services deployed in Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in **[Isolation guidelines for Impact Level 5 workloads](../documentation-government-impact-level-5.md).**
> - For DoD IL5 PA compliance scope in Azure Government DoD regions (US DoD Central and US DoD East), see **[Azure Government DoD regions IL5 audit scope](../documentation-government-overview-dod.md#azure-government-dod-regions-il5-audit-scope).**

**Azure Government Secret** maintains:

- [DoD IL6](/azure/compliance/offerings/offering-dod-il6) PA issued by DISA
- [ICD 503](/azure/compliance/offerings/offering-icd-503) with facilities at ICD 705 (for authorization details, contact your Microsoft account representative)

This article provides a detailed list of Azure, Dynamics 365, Microsoft 365, and Power Platform cloud services in scope for the above authorizations across Azure, Azure Government, and Azure Government Secret cloud environments.

## Azure public services by audit scope
*Last Updated: August 2021*

### Terminology used

- FedRAMP High = FedRAMP High Provisional Authorization to Operate (P-ATO) in Azure
- DoD IL2 = DoD SRG Impact Level 2 Provisional Authorization (PA) in Azure
- &#x2705; = service is included in audit scope and has been authorized
- Planned 2021 = service will undergo a FedRAMP High assessment in 2021 - once the service is authorized, status will be updated

| Service | DoD IL2 | FedRAMP High | Planned 2021 |
| ------- |:--------:|:------------:|:------------:|
| [API Management](https://azure.microsoft.com/services/api-management/) | &#x2705; | &#x2705; | |
| [App Configuration](https://azure.microsoft.com/services/app-configuration/) | &#x2705; | &#x2705; | |
| [Application Gateway](https://azure.microsoft.com/services/application-gateway/) | &#x2705; | &#x2705; | |
| [Automation](https://azure.microsoft.com/services/automation/) | &#x2705; | &#x2705; | |
| [Azure Active Directory (Free and Basic)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; | |
| [Azure Active Directory (Premium P1 + P2)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; | |
| [Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/) | &#x2705; | &#x2705; | |
| [Azure Active Directory Domain Services](https://azure.microsoft.com/services/active-directory-ds/) | &#x2705; | &#x2705; | |
| [Azure Active Directory Provisioning Service](../../active-directory/app-provisioning/user-provisioning.md)| &#x2705; | &#x2705; | |
| [Azure Advisor](https://azure.microsoft.com/services/advisor/) | &#x2705; | &#x2705; | |
| [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) | &#x2705; | &#x2705; | |
| [Azure Arc-enabled Servers](../../azure-arc/servers/overview.md) | &#x2705; | &#x2705; | |
| [Azure Archive Storage](https://azure.microsoft.com/services/storage/archive/) | &#x2705; | &#x2705; | |
| [Azure Backup](https://azure.microsoft.com/services/backup/) | &#x2705; | &#x2705; | |
| [Azure Bastion](https://azure.microsoft.com/services/azure-bastion/) | &#x2705; | &#x2705; | |
| **Service** | **DoD IL2** | **FedRAMP High** | **Planned 2021** |
| [Azure Blueprints](https://azure.microsoft.com/services/blueprints/) | &#x2705; | &#x2705; | |
| [Azure Bot Service](/azure/bot-service/) | &#x2705; | &#x2705; | |
| [Azure Cache for Redis](https://azure.microsoft.com/services/cache/) | &#x2705; | &#x2705; | |
| [Azure Cloud Services](https://azure.microsoft.com/services/cloud-services/) | &#x2705; | &#x2705; | |
| [Azure Cognitive Search](https://azure.microsoft.com/services/search/) | &#x2705; | &#x2705; | |
| [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) | &#x2705; | &#x2705; | |
| [Azure Cost Management and Billing](https://azure.microsoft.com/services/cost-management/) | &#x2705; | &#x2705; | |
| [Azure Data Box](https://azure.microsoft.com/services/databox/) **&ast;** | &#x2705; | &#x2705; | |
| [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/) | &#x2705; | &#x2705; | |
| [Azure Data Share](https://azure.microsoft.com/services/data-share/) | &#x2705; | &#x2705; | |
| [Azure Database for MariaDB](https://azure.microsoft.com/services/mariadb/) | &#x2705; | &#x2705; | |
| [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/) | &#x2705; | &#x2705; | |
| [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) | &#x2705; | &#x2705; | |
| [Azure Database Migration Service](https://azure.microsoft.com/services/database-migration/) | &#x2705; | &#x2705; | |
| [Azure Databricks](https://azure.microsoft.com/services/databricks/) **&ast;&ast;** | &#x2705; | &#x2705; | |
| **Service** | **DoD IL2** | **FedRAMP High** | **Planned 2021** |
| [Azure DDoS Protection](https://azure.microsoft.com/services/ddos-protection/) | &#x2705; | &#x2705; | |
| [Azure Dedicated HSM](https://azure.microsoft.com/services/azure-dedicated-hsm/) | &#x2705; | &#x2705; | |
| [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab/) | &#x2705; | &#x2705; | |
| [Azure DNS](https://azure.microsoft.com/services/dns/) | &#x2705; | &#x2705; | |
| [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) | &#x2705; | &#x2705; | |
| [Azure File Sync](../../storage/file-sync/file-sync-introduction.md) | &#x2705; | &#x2705; | |
| [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/)  | &#x2705; | &#x2705; | |
| [Azure Firewall Manager](https://azure.microsoft.com/services/firewall-manager/)  | &#x2705; | &#x2705; | |
| [Azure for Education](https://azure.microsoft.com/developer/students/) | &#x2705; | &#x2705; | |
| [Azure Form Recognizer](https://azure.microsoft.com/services/form-recognizer/) | &#x2705; | &#x2705; | |
| [Azure Front Door](https://azure.microsoft.com/services/frontdoor/) | &#x2705; | &#x2705; | |
| [Azure Functions](https://azure.microsoft.com/services/functions/) | &#x2705; | &#x2705; | |
| [Azure Health Bot](/healthbot/) | &#x2705; | &#x2705; | |
| [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/) | &#x2705; | &#x2705; | |
| [Azure Healthcare APIs](https://azure.microsoft.com/services/healthcare-apis/) (formerly Azure API for FHIR) | &#x2705; | &#x2705; | |
| **Service** | **DoD IL2** | **FedRAMP High** | **Planned 2021** |
| [Azure HPC Cache](https://azure.microsoft.com/services/hpc-cache/) | &#x2705; | &#x2705; | |
| [Azure Information Protection](https://azure.microsoft.com/services/information-protection/) | &#x2705; | &#x2705; | |
| [Azure Internet Analyzer](https://azure.microsoft.com/services/internet-analyzer/) | &#x2705; | &#x2705; | |
| [Azure IoT Central](https://azure.microsoft.com/services/iot-central/) | | | &#x2705; |
| [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) | &#x2705; | &#x2705; | |
| [Azure IoT Security](https://azure.microsoft.com/overview/iot/security/) | &#x2705; | &#x2705; | |
| [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) | &#x2705; | &#x2705; | |
| [Azure Lab Services](https://azure.microsoft.com/services/lab-services/) | &#x2705; | &#x2705; | |
| [Azure Lighthouse](https://azure.microsoft.com/services/azure-lighthouse/) | &#x2705; | &#x2705; | |
| [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) | &#x2705; | &#x2705; | |
| [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/) | &#x2705; | &#x2705; | |
| [Azure Managed Applications](https://azure.microsoft.com/services/managed-applications/) | &#x2705; | &#x2705; | |
| [Azure Marketplace portal](https://azuremarketplace.microsoft.com/) | &#x2705; | &#x2705; | |
| [Azure Maps](https://azure.microsoft.com/services/azure-maps/) | &#x2705; | &#x2705; | |
| [Azure Media Services](https://azure.microsoft.com/services/media-services/) | &#x2705; | &#x2705; | |
| **Service** | **DoD IL2** | **FedRAMP High** | **Planned 2021** |
| [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | &#x2705; | &#x2705; | |
| [Azure Monitor](https://azure.microsoft.com/services/monitor/) (incl. [Application Insights](../../azure-monitor/app/app-insights-overview.md), [Log Analytics](../../azure-monitor/logs/data-platform-logs.md), and [Application Change Analysis](../../azure-monitor/app/change-analysis.md)) | &#x2705; | &#x2705; | |
| [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) | &#x2705; | &#x2705; | |
| [Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/) | &#x2705; | &#x2705; | |
| [Azure Peering Service](../../peering-service/about.md) | &#x2705; | &#x2705; | |
| [Azure Policy](https://azure.microsoft.com/services/azure-policy/) | &#x2705; | &#x2705; | |
| [Azure Policy Guest Configuration](../../governance/policy/concepts/guest-configuration.md) | &#x2705; | &#x2705; | |
| [Azure Public IP](../../virtual-network/public-ip-addresses.md) | &#x2705; | &#x2705; | |
| [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/) | &#x2705; | &#x2705; | |
| [Azure Resource Graph](../../governance/resource-graph/overview.md) | &#x2705; | &#x2705; | |
| [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/) | &#x2705; | &#x2705; | |
| [Azure Scheduler](../../scheduler/scheduler-intro.md) | &#x2705; | &#x2705; | |
| [Azure Security Center](https://azure.microsoft.com/services/security-center/) | &#x2705; | &#x2705; | |
| [Azure Service Fabric](https://azure.microsoft.com/services/service-fabric/) | &#x2705; | &#x2705; | |
| [Azure Service Health](https://azure.microsoft.com/features/service-health/) | &#x2705; | &#x2705; | |
| **Service** | **DoD IL2** | **FedRAMP High** | **Planned 2021** |
| [Azure Service Manager (RDFE)](/previous-versions/azure/ee460799(v=azure.100)) | &#x2705; | &#x2705; | |
| [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/) (incl. [UEBA](../../sentinel/identify-threats-with-entity-behavior-analytics.md#what-is-user-and-entity-behavior-analytics-ueba)) | &#x2705; | &#x2705; | |
| [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/) | &#x2705; | &#x2705; | |
| [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/) | &#x2705; | &#x2705; | |
| [Azure Sphere](https://azure.microsoft.com/services/azure-sphere/) | &#x2705; | &#x2705; | |
| [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) (incl. [Azure SQL Managed Instance](https://azure.microsoft.com/products/azure-sql/managed-instance/)) | &#x2705; | &#x2705; | |
| [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/) (formerly Data Box Edge) **&ast;** | &#x2705; | &#x2705; | |
| [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) | &#x2705; | &#x2705; | |
| [Azure Synapse Analytics](https://azure.microsoft.com/services/synapse-analytics/) | &#x2705; | &#x2705; | |
| [Azure Time Series Insights](https://azure.microsoft.com/services/time-series-insights/) | &#x2705; | &#x2705; | |
| [Azure Video Analyzer](https://azure.microsoft.com/products/video-analyzer/) | &#x2705; | &#x2705; | |
| [Azure Virtual Desktop](https://azure.microsoft.com/services/virtual-desktop/) (formerly Windows Virtual Desktop) | &#x2705; | &#x2705; | |
| [Azure VMware Solution](https://azure.microsoft.com/services/azure-vmware/) | | | &#x2705; |
| [Azure Web Application Firewall)](https://azure.microsoft.com/services/web-application-firewall/) | &#x2705; | &#x2705; | |
| [Batch](https://azure.microsoft.com/services/batch/) | &#x2705; | &#x2705; | |
| **Service** | **DoD IL2** | **FedRAMP High** | **Planned 2021** |
| [Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) | &#x2705; | &#x2705; | |
| [Cognitive Services: Computer Vision](https://azure.microsoft.com/services/cognitive-services/computer-vision/) | &#x2705; | &#x2705; | |
| [Cognitive Services: Content Moderator](https://azure.microsoft.com/services/cognitive-services/content-moderator/) | &#x2705; | &#x2705; | |
| [Cognitive Services Containers](../../cognitive-services/cognitive-services-container-support.md) | &#x2705; | &#x2705; | |
| [Cognitive Services: Custom Vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/) | &#x2705; | &#x2705; | |
| [Cognitive Services: Face API](https://azure.microsoft.com/services/cognitive-services/face/) | &#x2705; | &#x2705; | |
| [Cognitive Services: Language Understanding (LUIS)](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/) | &#x2705; | &#x2705; | |
| [Cognitive Services: Personalizer](https://azure.microsoft.com/services/cognitive-services/personalizer/) | &#x2705; | &#x2705; | |
| [Cognitive Services: QnA Maker](https://azure.microsoft.com/services/cognitive-services/qna-maker/) | &#x2705; | &#x2705; | |
| [Cognitive Services: Speech](https://azure.microsoft.com/services/cognitive-services/speech-services/) | &#x2705; | &#x2705; | |
| [Cognitive Services: Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/) | &#x2705; | &#x2705; | |
| [Cognitive Services: Translator](https://azure.microsoft.com/services/cognitive-services/translator/) | &#x2705; | &#x2705; | |
| [Container Instances](https://azure.microsoft.com/services/container-instances/) | &#x2705; | &#x2705; | |
| [Container Registry](https://azure.microsoft.com/services/container-registry/) | &#x2705; | &#x2705; | |
| [Content Delivery Network](https://azure.microsoft.com/services/cdn/) | &#x2705; | &#x2705; | |
| **Service** | **DoD IL2** | **FedRAMP High** | **Planned 2021** |
| [Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md) | &#x2705; | &#x2705; | |
| [Data Factory](https://azure.microsoft.com/services/data-factory/) | &#x2705; | &#x2705; | |
| [Dataverse](/powerapps/maker/common-data-service/data-platform-intro) (formerly Common Data Service) | &#x2705; | &#x2705; | |
| [Dynamics 365 Chat (Omnichannel Engagement Hub)](/dynamics365/omnichannel/introduction-omnichannel) | &#x2705; | &#x2705; | |
| [Dynamics 365 Commerce](https://dynamics.microsoft.com/commerce/overview/)| &#x2705; | &#x2705; | |
| [Dynamics 365 Customer Service](https://dynamics.microsoft.com/customer-service/overview/)| &#x2705; | &#x2705; | |
| [Dynamics 365 Field Service](https://dynamics.microsoft.com/field-service/overview/)| &#x2705; | &#x2705; | |
| [Dynamics 365 Finance](https://dynamics.microsoft.com/finance/overview/)| &#x2705; | &#x2705; | |
| [Dynamics 365 Guides](https://dynamics.microsoft.com/mixed-reality/guides/)| &#x2705; | &#x2705; | |
| [Dynamics 365 Sales](https://dynamics.microsoft.com/sales/overview/) | | | &#x2705; |
| [Dynamics 365 Sales Professional](https://dynamics.microsoft.com/sales/professional/) | | | &#x2705; |
| [Dynamics 365 Supply Chain Management](https://dynamics.microsoft.com/supply-chain-management/overview/)| &#x2705; | &#x2705; | |
| [Event Grid](https://azure.microsoft.com/services/event-grid/) | &#x2705; | &#x2705; | |
| [Event Hubs](https://azure.microsoft.com/services/event-hubs/) | &#x2705; | &#x2705; | |
| [GitHub AE](https://docs.github.com/github-ae@latest/admin/overview/about-github-ae) | &#x2705; | &#x2705; | |
| **Service** | **DoD IL2** | **FedRAMP High** | **Planned 2021** |
| [GitHub Codespaces](https://visualstudio.microsoft.com/services/github-codespaces/) (formerly Visual Studio Codespaces) | &#x2705; | &#x2705; | |
| [Import/Export](https://azure.microsoft.com/services/storage/import-export/) | &#x2705; | &#x2705; | |
| [Key Vault](https://azure.microsoft.com/services/key-vault/) | &#x2705; | &#x2705; | |
| [Load Balancer](https://azure.microsoft.com/services/load-balancer/) | &#x2705; | &#x2705; | |
| [Microsoft 365 Defender](/microsoft-365/security/defender/) (formerly Microsoft Threat Protection) | &#x2705; | &#x2705; | |
| [Microsoft Azure Attestation](https://azure.microsoft.com/services/azure-attestation/)| &#x2705; | &#x2705; | |
| [Microsoft Azure Marketplace portal](https://azuremarketplace.microsoft.com/marketplace/)| &#x2705; | &#x2705; | |
| [Microsoft Azure portal](https://azure.microsoft.com/features/azure-portal/)| &#x2705; | &#x2705; | |
| [Microsoft Cloud App Security](/cloud-app-security/what-is-cloud-app-security) | &#x2705; | &#x2705; | |
| [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) (formerly Microsoft Defender Advanced Threat Protection) | &#x2705; | &#x2705; | |
| [Microsoft Defender for Identity](/defender-for-identity/what-is) (formerly Azure Advanced Threat Protection) | &#x2705; | &#x2705; | |
| [Microsoft Graph](/graph/overview) | &#x2705; | &#x2705; | |
| [Microsoft Intune](/mem/intune/fundamentals/) | &#x2705; | &#x2705; | |
| [Microsoft Stream](/stream/overview) | &#x2705; | &#x2705; | |
| [Microsoft Threat Experts](/microsoft-365/security/defender-endpoint/microsoft-threat-experts) | &#x2705; | &#x2705; | |
| **Service** | **DoD IL2** | **FedRAMP High** | **Planned 2021** |
| [Multifactor Authentication](../../active-directory/authentication/concept-mfa-howitworks.md) | &#x2705; | &#x2705; | |
| [Network Watcher](https://azure.microsoft.com/services/network-watcher/) incl. [Traffic Analytics](../../network-watcher/traffic-analytics.md)  | &#x2705; | &#x2705; | |
| [Notification Hubs](https://azure.microsoft.com/services/notification-hubs/) | &#x2705; | &#x2705; | |
| [Power AI Builder](/ai-builder/overview) | &#x2705; | &#x2705; | |
| [Power Apps](/powerapps/powerapps-overview) | &#x2705; | &#x2705; | |
| [Power Apps Portal](https://powerapps.microsoft.com/portals/) | &#x2705; | &#x2705; | |
| [Power Automate](/power-automate/getting-started) (formerly Microsoft Flow) | &#x2705; | &#x2705; | |
| [Power BI Embedded](https://azure.microsoft.com/services/power-bi-embedded/) | &#x2705; | &#x2705; | |
| [Power Data Integrator](/power-platform/admin/data-integrator) (formerly Dynamics 365 Integrator App) | &#x2705; | &#x2705; | |
| [Power Virtual Agents](/power-virtual-agents/fundamentals-what-is-power-virtual-agents) | &#x2705; | &#x2705; | |
| [Private Link](https://azure.microsoft.com/services/private-link/) | &#x2705; | &#x2705; | |
| [Service Bus](https://azure.microsoft.com/services/service-bus/) | &#x2705; | &#x2705; | |
| [SQL Server Registry](/sql/sql-server/end-of-support/sql-server-extended-security-updates) | &#x2705; | &#x2705; | |
| [SQL Server Stretch Database](https://azure.microsoft.com/services/sql-server-stretch-database/) | &#x2705; | &#x2705; | |
| [Storage: Blobs](https://azure.microsoft.com/services/storage/blobs/) (incl. [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md)) | &#x2705; | &#x2705; | |
| **Service** | **DoD IL2** | **FedRAMP High** | **Planned 2021** |
| [Storage: Data Movement)](../../storage/common/storage-use-data-movement-library.md) | &#x2705; | &#x2705; | |
| [Storage: Disks](https://azure.microsoft.com/services/storage/disks/) incl. [Managed disks](../../virtual-machines/managed-disks-overview.md) | &#x2705; | &#x2705; | |
| [Storage: Files](https://azure.microsoft.com/services/storage/files/) | &#x2705; | &#x2705; | |
| [Storage: Queues](https://azure.microsoft.com/services/storage/queues/) | &#x2705; | &#x2705; | |
| [Storage: Tables](https://azure.microsoft.com/services/storage/tables/) | &#x2705; | &#x2705; | |
| [StorSimple](https://azure.microsoft.com/services/storsimple/) | &#x2705; | &#x2705; | |
| [Traffic Manager](https://azure.microsoft.com/services/traffic-manager/) | &#x2705; | &#x2705; | |
| [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/) | &#x2705; | &#x2705; | |
| [Virtual Machines (incl. Reserved Instances)](https://azure.microsoft.com/services/virtual-machines/) | &#x2705; | &#x2705; | |
| [Virtual Network](https://azure.microsoft.com/services/virtual-network/) | &#x2705; | &#x2705; | |
| [Virtual Network NAT](../../virtual-network/nat-gateway/nat-overview.md) | &#x2705; | &#x2705; | |
| [Virtual WAN](https://azure.microsoft.com/services/virtual-wan/) | &#x2705; | &#x2705; | |
| [VPN Gateway](https://azure.microsoft.com/services/vpn-gateway/) | &#x2705; | &#x2705; | |
| [Web Apps (App Service)](https://azure.microsoft.com/services/app-service/web/) | &#x2705; | &#x2705; | |
| [Windows 10 IoT Core Services](https://azure.microsoft.com/services/windows-10-iot-core/) | &#x2705; | &#x2705; | |

**&ast;** FedRAMP High authorization for edge devices (such as Azure Data Box and Azure Stack Edge) applies only to Azure services that support on-premises, customer-managed devices. For example, FedRAMP High authorization for Azure Data Box covers datacenter infrastructure services and Data Box pod and disk service, which are the online software components supporting your Data Box hardware appliance. You are wholly responsible for the authorization package that covers the physical devices. For assistance with accelerating your onboarding and authorization of devices, contact your Microsoft account representative.

**&ast;&ast;** FedRAMP High authorization for Azure Databricks is applicable to limited regions in Azure. To configure Azure Databricks for FedRAMP High use, contact your Microsoft or Databricks representative.

## Azure Government services by audit scope
*Last Updated: August 2021*

### Terminology used

- Azure Government = Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia
- FR High = FedRAMP High Provisional Authorization to Operate (P-ATO) in Azure Government
- DoD IL2 = DoD SRG Impact Level 2 Provisional Authorization (PA) in Azure Government
- DoD IL4 = DoD SRG Impact Level 4 Provisional Authorization (PA) in Azure Government
- DoD IL5 = DoD SRG Impact Level 5 Provisional Authorization (PA) in Azure Government
- DoD IL6 = DoD SRG Impact Level 6 Provisional Authorization (PA) in Azure Government Secret
- ICD 503 Secret = Intelligence Community Directive 503 Authorization to Operate (ATO) in Azure Government Secret
- &#x2705; = service is included in audit scope and has been authorized

> [!NOTE]
>
> - Some services deployed in Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in **[Isolation guidelines for Impact Level 5 workloads](../documentation-government-impact-level-5.md).**
> - For DoD IL5 PA compliance scope in Azure Government DoD regions (US DoD Central and US DoD East), see **[Azure Government DoD regions IL5 audit scope](../documentation-government-overview-dod.md#azure-government-dod-regions-il5-audit-scope).**

| Service | FR High / DoD IL2 | DoD IL4 | DoD IL5 | DoD IL6 | ICD 503 Secret |
| ------- |:-----------------:|:-------:|:-------:|:-------:|:--------------:|
| [API Management](https://azure.microsoft.com/services/api-management/) | &#x2705; | &#x2705; | &#x2705; | | |
| [App Configuration](https://azure.microsoft.com/services/app-configuration/) | &#x2705; | | | | |
| [Application Gateway](https://azure.microsoft.com/services/application-gateway/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Automation](https://azure.microsoft.com/services/automation/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Active Directory (Free and Basic)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Active Directory (Premium P1 + P2)](../../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Active Directory Domain Services](https://azure.microsoft.com/services/active-directory-ds/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Advisor](https://azure.microsoft.com/services/advisor/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Archive Storage](https://azure.microsoft.com/services/storage/archive/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Backup](https://azure.microsoft.com/services/backup/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Bastion](https://azure.microsoft.com/services/azure-bastion/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Blueprints](https://azure.microsoft.com/services/blueprints/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Bot Service](/azure/bot-service/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Cache for Redis](https://azure.microsoft.com/services/cache/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FR High / DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** | **ICD 503 Secret** |
| [Azure Cloud Services](https://azure.microsoft.com/services/cloud-services/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Cognitive Search](https://azure.microsoft.com/services/search/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Cost Management and Billing](https://azure.microsoft.com/services/cost-management/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Data Box](https://azure.microsoft.com/services/databox/) **&ast;** | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Data Share](https://azure.microsoft.com/services/data-share/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Database for MariaDB](https://azure.microsoft.com/services/mariadb/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Database Migration Service](https://azure.microsoft.com/services/database-migration/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Databricks](https://azure.microsoft.com/services/databricks/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure DDoS Protection](https://azure.microsoft.com/services/ddos-protection/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Dedicated HSM](https://azure.microsoft.com/services/azure-dedicated-hsm/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab/) | &#x2705; | &#x2705; | &#x2705; | | |
| **Service** | **FR High / DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** | **ICD 503 Secret** |
| [Azure DNS](https://azure.microsoft.com/services/dns/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure File Sync](../../storage/file-sync/file-sync-introduction.md) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Form Recognizer](https://azure.microsoft.com/services/form-recognizer/) | &#x2705; | | | | |
| [Azure Front Door](https://azure.microsoft.com/services/frontdoor/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Functions](https://azure.microsoft.com/services/functions/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Healthcare APIs](https://azure.microsoft.com/services/healthcare-apis/) (formerly Azure API for FHIR) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure HPC Cache](https://azure.microsoft.com/services/hpc-cache/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Information Protection](https://azure.microsoft.com/services/information-protection/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure IoT Security](https://azure.microsoft.com/overview/iot/security/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Lab Services](https://azure.microsoft.com/services/lab-services/) | &#x2705; | &#x2705; | &#x2705; | | |
| **Service** | **FR High / DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** | **ICD 503 Secret** |
| [Azure Lighthouse](https://azure.microsoft.com/services/azure-lighthouse/)| &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Managed Applications](https://azure.microsoft.com/services/managed-applications/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Maps](https://azure.microsoft.com/services/azure-maps/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Media Services](https://azure.microsoft.com/services/media-services/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Monitor](https://azure.microsoft.com/services/monitor/) (incl. [Log Analytics](../../azure-monitor/logs/data-platform-logs.md)) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Peering Service](../../peering-service/about.md) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Policy](https://azure.microsoft.com/services/azure-policy/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Policy Guest Configuration](../../governance/policy/concepts/guest-configuration.md) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Public IP](../../virtual-network/public-ip-addresses.md) | &#x2705; | | | | |
| [Azure Resource Graph](../../governance/resource-graph/overview.md) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FR High / DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** | **ICD 503 Secret** |
| [Azure Scheduler](../../scheduler/scheduler-intro.md) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Security Center](https://azure.microsoft.com/services/security-center/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Service Fabric](https://azure.microsoft.com/services/service-fabric/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Service Health](https://azure.microsoft.com/features/service-health/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Service Manager (RDFE)](/previous-versions/azure/ee460799(v=azure.100)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure SQL Managed Instance](https://azure.microsoft.com/products/azure-sql/managed-instance/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Stack Bridge](/azure-stack/operator/azure-stack-usage-reporting) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/) (formerly Data Box Edge) **&ast;** | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Synapse Analytics](https://azure.microsoft.com/services/synapse-analytics/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/export-to-data-lake) | &#x2705; | | | | |
| **Service** | **FR High / DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** | **ICD 503 Secret** |
| [Azure Virtual Desktop](https://azure.microsoft.com/services/virtual-desktop/) (formerly Windows Virtual Desktop) | &#x2705; | &#x2705; | &#x2705; | | |
| [Azure Web Application Firewall)](https://azure.microsoft.com/services/web-application-firewall/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Batch](https://azure.microsoft.com/services/batch/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Cognitive Services: Computer Vision](https://azure.microsoft.com/services/cognitive-services/computer-vision/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Cognitive Services: Content Moderator](https://azure.microsoft.com/services/cognitive-services/content-moderator/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Cognitive Services: Custom Vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Cognitive Services: Face API](https://azure.microsoft.com/services/cognitive-services/face/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Cognitive Services: Language Understanding (LUIS)](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Cognitive Services: Personalizer](https://azure.microsoft.com/services/cognitive-services/personalizer/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Cognitive Services: QnA Maker](https://azure.microsoft.com/services/cognitive-services/qna-maker/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Cognitive Services: Speech](https://azure.microsoft.com/services/cognitive-services/speech-services/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Cognitive Services: Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Cognitive Services: Translator](https://azure.microsoft.com/services/cognitive-services/translator/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Container Instances](https://azure.microsoft.com/services/container-instances/)| &#x2705; | &#x2705; | &#x2705; | | |
| **Service** | **FR High / DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** | **ICD 503 Secret** |
| [Container Registry](https://azure.microsoft.com/services/container-registry/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Content Delivery Network](https://azure.microsoft.com/services/cdn/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md) | &#x2705; | &#x2705; | &#x2705; | | |
| [Data Factory](https://azure.microsoft.com/services/data-factory/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Dataverse](/powerapps/maker/common-data-service/data-platform-intro) (formerly Common Data Service) | &#x2705; | &#x2705; | &#x2705; | | |
| [Dynamics 365 Chat (Omnichannel Engagement Hub)](/dynamics365/omnichannel/introduction-omnichannel) | &#x2705; | &#x2705; | &#x2705; | | |
| [Dynamics 365 Customer Insights](/dynamics365/customer-insights/audience-insights/overview) | &#x2705; | &#x2705; | &#x2705; | | |
| [Dynamics 365 Customer Voice](/dynamics365/customer-voice/about) (formerly Forms Pro) | &#x2705; | &#x2705; | &#x2705; | | |
| [Dynamics 365 Customer Service](/dynamics365/customer-service/overview) | &#x2705; | &#x2705; | &#x2705; | | |
| [Dynamics 365 Field Service](/dynamics365/field-service/overview) | &#x2705; | &#x2705; | &#x2705; | | |
| [Dynamics 365 Project Service Automation](/dynamics365/project-operations/psa/overview) | &#x2705; | &#x2705; | &#x2705; | | |
| [Dynamics 365 Sales](https://dynamics.microsoft.com/sales/overview/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Event Grid](https://azure.microsoft.com/services/event-grid/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Event Hubs](https://azure.microsoft.com/services/event-hubs/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [GitHub AE](https://docs.github.com/en/github-ae@latest/admin/overview/about-github-ae) | &#x2705; | | | | |
| **Service** | **FR High / DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** | **ICD 503 Secret** |
| [Import/Export](https://azure.microsoft.com/services/storage/import-export/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Key Vault](https://azure.microsoft.com/services/key-vault/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Load Balancer](https://azure.microsoft.com/services/load-balancer/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft 365 Defender](/microsoft-365/security/defender/) (formerly Microsoft Threat Protection) | &#x2705; | | | | |
| [Microsoft Azure portal](https://azure.microsoft.com/features/azure-portal/) | &#x2705; | &#x2705; | &#x2705;| &#x2705; | &#x2705; |
| [Microsoft Azure Government portal](../documentation-government-get-started-connect-with-portal.md) | &#x2705; | &#x2705; | &#x2705;| &#x2705; | &#x2705; |
| [Microsoft Cloud App Security](/cloud-app-security/what-is-cloud-app-security)| &#x2705; | &#x2705; | &#x2705; | | |
| [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) (formerly Microsoft Defender Advanced Threat Protection) | &#x2705; | &#x2705; | &#x2705; | | |
| [Microsoft Defender for Identity](/defender-for-identity/what-is) | &#x2705; | &#x2705; | &#x2705; | | |
| [Microsoft Graph](/graph/overview) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Microsoft Intune](/mem/intune/fundamentals/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Microsoft Stream](/stream/overview) | &#x2705; | &#x2705; | &#x2705; | | |
| [Multifactor Authentication](../../active-directory/authentication/concept-mfa-howitworks.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Network Watcher](https://azure.microsoft.com/services/network-watcher/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Network Watcher Traffic Analytics](../../network-watcher/traffic-analytics.md) | &#x2705; | &#x2705; | &#x2705; | | |
| **Service** | **FR High / DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** | **ICD 503 Secret** |
| [Notification Hubs](https://azure.microsoft.com/services/notification-hubs/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Planned Maintenance for VMs](../../virtual-machines/maintenance-control-portal.md) | &#x2705; | | | | |
| [Power Apps](/powerapps/powerapps-overview) | &#x2705; | &#x2705; | &#x2705; | | |
| [Power Automate](/power-automate/getting-started) (formerly Microsoft Flow) | &#x2705; | &#x2705; | &#x2705; | | |
| [Power BI](https://powerbi.microsoft.com/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Power BI Embedded](https://azure.microsoft.com/services/power-bi-embedded/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Power Data Integrator](/power-platform/admin/data-integrator) (formerly Dynamics 365 Integrator App) | &#x2705; | &#x2705; | &#x2705; | | |
| [Power Query Online](/powerquery.microsoft.com/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Power Virtual Agents](/power-virtual-agents/fundamentals-what-is-power-virtual-agents) | &#x2705; | | | | |
| [Private Link](https://azure.microsoft.com/services/private-link/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Service Bus](https://azure.microsoft.com/services/service-bus/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [SQL Server Stretch Database](https://azure.microsoft.com/services/sql-server-stretch-database/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Storage: Blobs](https://azure.microsoft.com/services/storage/blobs/) (incl. [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md)) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Storage: Disks](https://azure.microsoft.com/services/storage/disks/) incl. [Managed disks](../../virtual-machines/managed-disks-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Storage: Files](https://azure.microsoft.com/services/storage/files/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Service** | **FR High / DoD IL2** | **DoD IL4** | **DoD IL5** | **DoD IL6** | **ICD 503 Secret** |
| [Storage: Queues](https://azure.microsoft.com/services/storage/queues/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Storage: Tables](https://azure.microsoft.com/services/storage/tables/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [StorSimple](https://azure.microsoft.com/services/storsimple/) | &#x2705; | &#x2705; | &#x2705; | | |
| [Traffic Manager](https://azure.microsoft.com/services/traffic-manager/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Machines](https://azure.microsoft.com/services/virtual-machines/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Network](https://azure.microsoft.com/services/virtual-network/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Virtual Network NAT](../../virtual-network/nat-gateway/nat-overview.md) | &#x2705; | &#x2705; | &#x2705; | | |
| [Virtual WAN](https://azure.microsoft.com/services/virtual-wan/) | &#x2705; | | | &#x2705; | &#x2705; |
| [VPN Gateway](https://azure.microsoft.com/services/vpn-gateway/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Web Apps (App Service)](https://azure.microsoft.com/services/app-service/web/) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |

**&ast;** Authorizations for edge devices (such as Azure Data Box and Azure Stack Edge) apply only to Azure services that support on-premises, customer-managed devices. You are wholly responsible for the authorization package that covers the physical devices. For assistance with accelerating your onboarding and authorization of devices, contact your Microsoft account representative.
