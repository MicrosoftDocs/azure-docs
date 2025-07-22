---
title: Microsoft Sentinel solutions for SAP - Partner Add-ons
description: Discover partners specializing in Microsoft Sentinel for SAP integration solutions, consulting, and managed services.
author: MartinPankraz
ms.author: mapankra
ms.topic: conceptual
ms.date: 07/10/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security

#Customer intent: As a security operations team member, I want to understand the partner landscape and add-ons available to the SAP capabilities of Microsoft Sentinel Solution for SAP.

---

# Microsoft Sentinel solution for SAP - Partner add-ons

Microsoft Sentinel provides a flexible platform that enables SAP and Microsoft partners to deliver integrated security solutions through the Microsoft Sentinel Content Hub. 

Add-ons enable further correlational capabilities for the Microsoft Sentinel Solution for SAP applications. SAP signals are correlated with signals from other Microsoft and third-party solutions, enabling comprehensive threat detection and response across the entire IT landscape using the Microsoft unified Security Operations platform.

:::image type="content" source="media/partner/solution-overview.png" alt-text="Diagram that shows correlation of a user compromise involving SAP through Microsoft Sentinel solution for SAP." border="false" lightbox="media/partner/solution-overview.png":::

This article provides an overview of the partner ecosystem that builds upon and specializes in integration with the [Microsoft Sentinel Solution for SAP applications](solution-overview.md).

## Partner contributions

These solutions include ready-to-use connectors activating the Microsoft internal log streams such as AS ABAP Security Audit Log. Furthermore, specialized workbooks, dedicated analytics rules, and playbooks are provided.

### Solutions provided by SAP as vendor

Choose from Microsoft Sentinel solution add-ons build by SAP for SAP.

| Name | Description | Azure Marketplace link |
|------|-------------|-------------------|
| [SAP LogServ (RISE), S/4HANA Cloud private edition](https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/sap-logserv-integration-with-microsoft-sentinel-for-sap-rise-customers-is/bc-p/14089301) | SAP LogServ is an SAP Enterprise Cloud Services (ECS) service aimed at collection, storage, forwarding, and access of logs. LogServ centralizes the logs from all systems, and ECS services used by a registered customer. Main Features include: Near real-time log collection with ability to integrate into Microsoft Sentinel. LogServ complements the existing SAP application layer capabilities of the Microsoft Sentinel Solutions for SAP. SAP LogServ includes logs like: SAP HANA database, AS JAVA, SAP Web Dispatcher, SAP Cloud Connector, Operating System, third-party Databases, Network, DNS, Proxy, Firewall, etc. | [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/sap_jasondau.azure-sentinel-solution-saplogserv?tab=Overview) |
| [SAP Enterprise Threat Detection, cloud edition (ETD)](https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/sap-enterprise-threat-detection-cloud-edition-joins-forces-with-microsoft/ba-p/13942075) | The SAP Enterprise Threat Detection, cloud edition (ETD) solution enables ingestion of security alerts from ETD into Microsoft Sentinel, supporting cross-correlation, alerting, and threat hunting. ETD supplies curated alerts from SAP ERP, SuccessFactors, Ariba, and other SAP SaaS applications. | [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/sap_jasondau.azure-sentinel-solution-sapetd?tab=Overview) |

### Solutions provided by specialized SAP security vendors

| Name | Description | Azure Marketplace link |
|------|-------------|-------------------|
| SecurityBridge | SecurityBridge provides advanced SAP security monitoring and threat detection solutions with native integration into Microsoft Sentinel Solution for SAP and Microsoft Entra ID. Specialized in SAP vulnerability management, ABAP code scanning, and real-time security monitoring across SAP landscapes. | [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/securitybridge1647511278080.securitybridge-sentinel-app-1?tab=Overview) |

### Solutions provided by the community

Extension patterns available for the agentless data connector of the Microsoft Sentinel Solution for SAP applications enable individual enhancements and extended scope of the Microsoft provided solution. Customers, partners, and individual community members share their artifacts via [this official repos](https://github.com/Azure-Samples/Sentinel-For-SAP-Community).

:::image type="content" source="media/partner/overview.png" alt-text="Diagram that shows the community extension pattern for the agentless Microsoft Sentinel solution for SAP." border="false" lightbox="media/partner/overview.png":::

Get started from the [contribution guide](https://github.com/Azure-Samples/Sentinel-For-SAP-Community?tab=readme-ov-file#contributing-) or reach out via [GitHub issues](https://github.com/Azure-Samples/Sentinel-For-SAP-Community/issues).

## Implementation and managed services partners 

Implementation and managed services partners apply above solutions in addition to your Sentinel solution for SAP applications and offer hands-on support. This involves helping set up the Microsoft Sentinel Solution for SAP and your chosen add-on, delivering managed Security Operations Center (SOC), compliance monitoring, and continuous improvement.

Discover partner solutions from the Azure marketplace or from the [Microsoft Solution Partner finder](https://appsource.microsoft.com/marketplace/partner-dir).

| Partner | Azure Marketplace link |
|------|-------------|-------------------|
| Delaware | [Protecting SAP: 3 day workshop](https://azuremarketplace.microsoft.com/marketplace/consulting-services/delaware.sec_protect_sap?search=Delaware&page=1) |
| EY | [EY Application Threat Detection and Response Service for SAP (TDR)](https://azuremarketplace.microsoft.com/marketplace/apps/ey_global.ey_application_tdr_for_sap?tab=Overview) |
| IBM | [IBM Threat Management with Microsoft’s SAP Threat Monitoring Solution for Microsoft Azure](https://azuremarketplace.microsoft.com/marketplace/consulting-services/ibm-ny-armonk-hq-6205522-ibmsecurity-xftm.ibm-security-svcs-threatmanagement-sapthreatmon?page=1&search=ibm%20security%20services) |
| PWC | [Secure SAP on Microsoft Cloud](https://azuremarketplace.microsoft.com/marketplace/apps/pwc.secure_sap_on_microsoft_cloud?tab=Overview) |

> [!TIP]
> You're a partner looking to expand your SAP Security offerings and get listed? Reach out to the Microsoft Sentinel for SAP team through [GitHub issues](https://github.com/Azure-Samples/Sentinel-For-SAP-Community/issues).

## Next steps

- [Learn more about Microsoft Sentinel Solution for SAP applications](solution-overview.md).

- [Learn more about Microsoft Sentinel Solution for SAP BTP](sap-btp-solution-overview.md).
