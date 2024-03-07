---
title: Identity and security in Azure with SAP RISE| Microsoft Docs
description: Describes integration scenarios of Azure security, identity and monitoring services with SAP RISE managed workloads
services: virtual-machines-linux,virtual-machines-windows
author: msftrobiro
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.date: 12/21/2023
ms.author: robiro
---

# Azure identity and security services with SAP RISE

This article details integration of Azure identity and security services with an SAP RISE workload. Additionally use of some Azure monitoring services are explained for an SAP RISE landscape.

## Single sign-on for SAP 

Single sign-On (SSO) is configured for many SAP environments. With SAP workloads running in ECS/RISE, steps to implement do not differ from a natively run SAP system. The integration steps with Microsoft Entra ID based SSO are available for typical ECS/RISE managed workloads:
- [Tutorial: Microsoft Entra Single sign-on (SSO) integration with SAP NetWeaver](../../active-directory/saas-apps/sap-netweaver-tutorial.md)
- [Tutorial: Microsoft Entra single sign-on (SSO) integration with SAP Fiori](../../active-directory/saas-apps/sap-fiori-tutorial.md)
- [Tutorial: Microsoft Entra integration with SAP HANA](../../active-directory/saas-apps/saphana-tutorial.md)

| SSO method | Identity Provider     | Typical use case                 | Implementation                    |
| :--------- | :-------------------: | :------------------------------- | :-------------------------------- |
| SAML/OAuth | Microsoft Entra ID    | SAP Fiori, Web GUI, Portal, HANA | Configuration by customer         |
| SNC        | Microsoft Entra ID    | SAP GUI                          | Configuration by customer         |
| SPNEGO     | Active Directory (AD) | Web GUI, SAP Enterprise Portal   | Configuration by customer and SAP |

SSO against Active Directory (AD) of your Windows domain for ECS/RISE managed SAP environment, with SAP SSO Secure Login Client requires AD integration for end user devices. With SAP RISE, any Windows systems are not integrated with the customer's active directory domain. The domain integration isn't necessary for SSO with AD/Kerberos as the domain security token is read on the client device and exchanged securely with SAP system. Contact SAP if you require any changes to integrate AD based SSO or using third party products other than SAP SSO Secure Login Client, as some configuration on RISE managed systems might be required.

## Microsoft Sentinel with SAP RISE

The [SAP RISE certified](https://www.sap.com/dmc/exp/2013_09_adpd/enEN/#/solutions?id=s:33db1376-91ae-4f36-a435-aafa892a88d8) Microsoft Sentinel solution for SAP applications allows you to monitor, detect, and respond to suspicious activities. Microsoft Sentinel guards your critical data against sophisticated cyberattacks for SAP systems hosted on Azure, other clouds, or on-premises infrastructure. 

The solution allows you to gain visibility to user activities on SAP RISE/ECS and the SAP business logic layers and apply Sentinel’s built-in content.
-	Use a single console to monitor all your enterprise estate including SAP instances in SAP RISE/ECS on Azure and other clouds, SAP Azure native and on-premises estate
-	Detect and automatically respond to threats: detect suspicious activity including privilege escalation, unauthorized changes, sensitive transactions, data exfiltration and more with out-of-the-box detection capabilities
-	Correlate SAP activity with other signals: more accurately detect SAP threats by cross-correlating across endpoints, Microsoft Entra data and more
-	Customize based on your needs - build your own detections to monitor sensitive transactions and other business risks
-	Visualize the data with built-in workbooks

:::image type="complex" source="./media/sap-rise-integration/sap-rise-sentinel.png" alt-text="Connecting Sentinel with SAP RISE/ECS":::
   This diagram shows an example of Microsoft Sentinel connected through an intermediary VM or container to SAP managed SAP system. The intermediary VM or container runs in customer's own subscription with configured SAP data connector agent.
:::image-end:::

For SAP RISE/ECS, the Microsoft Sentinel solution must be deployed in customer's Azure subscription. All parts of the Sentinel solution are managed by customer and not by SAP. Private network connectivity from customer's vnet is needed to reach the SAP landscapes managed by SAP RISE/ECS. Typically, this connection is over the established vnet peering or through alternatives described in this document.

To enable the solution, only an authorized RFC user is required and nothing needs to be installed on the SAP systems. The container-based [SAP data collection agent](../../sentinel/sap/deployment-overview.md) included with the solution can be installed either on VM or AKS/any Kubernetes environment. The collector agent uses an SAP service user to consume application log data from your SAP landscape through RFC interface using standard RFC calls. 
- Authentication methods supported in SAP RISE: SAP username and password or X509/SNC certificates
- Only RFC based connections are possible currently with SAP RISE/ECS environments

Note for running Microsoft Sentinel in an SAP RISE/ECS environment:
- The following log fields/source require an SAP transport change request: Client IP address information from SAP security audit log, DB table logs (preview), spool output log. Sentinel's built-in content (detections, workbooks and playbooks) provides extensive coverage and correlation without those log sources.
-	SAP infrastructure and operating system logs aren't available to Sentinel in RISE, including VMs running SAP, SAPControl data sources, network resources placed within ECS. SAP monitors elements of the Azure infrastructure and operation system independently.

Use prebuilt playbooks for security, orchestration, automation and response capabilities (SOAR) to react to threats quickly. A popular first scenario is SAP user blocking with intervention option from Microsoft Teams. The integration pattern can be applied to any incident type and target service spanning towards SAP Business Technology Platform (BTP) or Microsoft Entra ID with regard to reducing the attack surface.

For more information on Microsoft Sentinel and SOAR for SAP, see the blog series [From zero to hero security coverage with Microsoft Sentinel for your critical SAP security signals](https://blogs.sap.com/2023/05/22/from-zero-to-hero-security-coverage-with-microsoft-sentinel-for-your-critical-sap-security-signals-blog-series/).

:::image type="complex" source="./media/sap-rise-integration/sap-rise-sentinel-adaptive-card.png" alt-text="Using Sentinel SOAR capability with SAP RISE/ECS":::
   This image shows an SAP incident detected by Sentinel offering the option to block the suspicious user on the SAP ERP, SAP Business Technology Platform or Microsoft Entra ID.
:::image-end:::

For more information on Microsoft Sentinel and SAP, including a deployment guide, see [Sentinel product documentation](../../sentinel/sap/deployment-overview.md).

## Azure Monitoring for SAP with SAP RISE

[Azure Monitor for SAP solutions](../monitor/about-azure-monitor-sap-solutions.md) is an Azure-native solution for monitoring your SAP system. It extends the Azure monitor platform monitoring capability with support to gather data about SAP NetWeaver, database, and operating system details.

SAP RISE/ECS is a fully managed service for your SAP landscape and thus Azure Monitoring for SAP is not intended to be utilized for such managed environment. SAP RISE/ECS doesn't support any integration with Azure Monitor for SAP solutions. SAP's own monitoring and reporting is used and provided to the customer as defined by your service description with SAP.

## Azure Center for SAP Solutions

As with Azure Monitoring for SAP solutions, SAP RISE/ECS doesn't support any integration with [Azure Center for SAP Solutions](../center-sap-solutions/overview.md) in any capability. All SAP RISE workloads are deployed by SAP and running in SAP's Azure tenant and subscription, without any access by customer to the Azure resources.

## Next steps
Check out the documentation:

- [Integrating Azure with SAP RISE overview](./rise-integration.md)
- [Network connectivity options in Azure with SAP RISE](./rise-integration-network.md)
- [Integrating Azure services with SAP RISE](./rise-integration-services.md)
- [Deploy Microsoft Sentinel solution for SAP® applicationsE](../../sentinel/sap/deployment-overview.md)
