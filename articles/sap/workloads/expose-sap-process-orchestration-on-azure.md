---
title: Expose SAP legacy middleware securely with Azure PaaS
description: Learn about securely exposing SAP Process Orchestration on Azure.
author: MartinPankraz

ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 07/19/2022
ms.author: mapankra

---
# Expose SAP legacy middleware securely with Azure PaaS

Enabling internal systems and external partners to interact with SAP back ends is a common requirement. Existing SAP landscapes often rely on the legacy middleware [SAP Process Orchestration (PO)](https://help.sap.com/docs/SAP_NETWEAVER_750/bbd7c67c5eb14835843976b790024ec6/8e995afa7a8d467f95a473afafafa07e.html) or [Process Integration (PI)](https://help.sap.com/docs/SAP_NETWEAVER_750/bbd7c67c5eb14835843976b790024ec6/8e995afa7a8d467f95a473afafafa07e.html) for their integration and transformation needs. For simplicity, this article uses the term *SAP Process Orchestration* to refer to both offerings.

This article describes configuration options on Azure, with emphasis on internet-facing implementations.

> [!NOTE]
> SAP mentions [SAP Integration Suite](https://discovery-center.cloud.sap/serviceCatalog/integration-suite?region=all)--specifically, [SAP Cloud Integration](https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/9af2f05c7eb04457aee5906fd8553e00.html)--running on [Business Technology Platform (BTP)](https://www.sap.com/products/business-technology-platform.html) as the successor for SAP PO and PI. Both the BTP platform and the services are available on Azure. For more information, see [SAP Discovery Center](https://discovery-center.cloud.sap/serviceCatalog/integration-suite?region=all&tab=service_plan&provider=azure). For more info about the maintenance support timeline for the legacy components, see SAP OSS note [1648480](https://launchpad.support.sap.com/#/notes/1648480).

## Overview

Existing implementations based on SAP middleware have often relied on SAP's proprietary dispatching technology called [SAP Web Dispatcher](https://help.sap.com/docs/ABAP_PLATFORM_NEW/683d6a1797a34730a6e005d1e8de6f22/488fe37933114e6fe10000000a421937.html). This technology operates on layer 7 of the [OSI model](https://en.wikipedia.org/wiki/OSI_model). It acts as a reverse proxy and addresses load-balancing needs for downstream SAP application workloads like SAP Enterprise Resource Planning (ERP), SAP Gateway, or SAP Process Orchestration.

Dispatching approaches include traditional reverse proxies like Apache, platform as a service (PaaS) options like [Azure Load Balancer](../../load-balancer/load-balancer-overview.md), and the opinionated SAP Web Dispatcher. The overall concepts described in this article apply to the options mentioned. For guidance on using non-SAP load balancers, see SAP's [wiki](https://wiki.scn.sap.com/wiki/display/SI/Can+I+use+a+different+load+balancer+instead+of+SAP+Web+Dispatcher).

> [!NOTE]
> All described setups in this article assume a hub-and-spoke network topology, where shared services are deployed into the hub. Based on the criticality of SAP, you might need even more isolation. For more information, see the SAP [design guide for perimeter networks](/azure/architecture/guide/sap/sap-internet-inbound-outbound#network-design).

## Primary Azure services 

[Azure Application Gateway](../../application-gateway/how-application-gateway-works.md) handles public [internet-based](../../application-gateway/configuration-frontend-ip.md) and [internal private](../../application-gateway/configuration-frontend-ip.md) HTTP routing, along with [encrypted tunneling across Azure subscriptions](../../application-gateway/private-link.md). Examples include [security](../../application-gateway/features.md) and [autoscaling](../../application-gateway/application-gateway-autoscaling-zone-redundant.md). 

Azure Application Gateway is focused on exposing web applications, so it offers a web application firewall (WAF). Workloads in other virtual networks that will communicate with SAP through Azure Application Gateway can be connected via [private links](../../application-gateway/private-link-configure.md), even across tenants.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/private-link.png" alt-text="Diagram that shows cross-tenant communication via Azure Application Gateway.":::

[Azure Firewall](../../firewall/overview.md) handles public internet-based and internal private routing for traffic types on layers 4 to 7 of the OSI model. It offers filtering and threat intelligence that feed directly from Microsoft Security.

[Azure API Management](../../api-management/api-management-key-concepts.md) handles public internet-based and internal private routing specifically for APIs. It offers request throttling, usage quota and limits, governance features like policies, and API keys to break down services per client.

[Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md) and [Azure ExpressRoute](../../expressroute/expressroute-introduction.md) serve as entry points to on-premises networks. They're abbreviated in the diagrams as VPN and XR.

## Setup considerations

Integration architecture needs differ, depending on the interface that an organization uses. SAP-proprietary technologies like [Intermediate Document (IDoc) framework](https://help.sap.com/docs/SAP_DATA_SERVICES/e54136ab6a4a43e6a370265bf0a2d744/577710e16d6d1014b3fc9283b0e91070.html), [Business Application Programming Interface (BAPI)](https://help.sap.com/docs/SAP_ERP/c5a8d544836649a1af6eaef358d08e3f/4dc89000ebfc5a9ee10000000a42189b.html), [transactional Remote Function Calls (tRFCs)](https://help.sap.com/docs/SAP_NETWEAVER_700/108f625f6c53101491e88dc4cf51a6cc/4899b963ee2b73e7e10000000a42189b.html), or plain [RFCs](https://help.sap.com/docs/SAP_ERP/be79bfef64c049f88262cf6cb5de1c1f/0502cbfa1c2f184eaa6ba151d1aaf4fe.html) require a specific runtime environment. They operate on layers 4 to 7 of the OSI model, unlike modern APIs that typically rely on HTP-based communication (layer 7 of the OSI model). Because of that, the interfaces can't be treated the same way.

This article focuses on modern APIs and HTTP, including integration scenarios like [Applicability Statement 2 (AS2)](https://wikipedia.org/wiki/AS2). [File Transfer Protocol (FTP)](https://wikipedia.org/wiki/File_Transfer_Protocol) serves as an example to handle non-HTTP integration needs. For more information about Microsoft load-balancing solutions, see [Load-balancing options](/azure/architecture/guide/technology-choices/load-balancing-overview).

> [!NOTE]
> SAP publishes dedicated [connectors](https://support.sap.com/en/product/connectors.html) for its proprietary interfaces. Check SAP's documentation for [Java](https://support.sap.com/en/product/connectors/jco.html) and [.NET](https://support.sap.com/en/product/connectors/msnet.html), for example. They're supported by [Microsoft gateways](../../data-factory/connector-sap-table.md?tabs=data-factory#prerequisites) too. Be aware that IDocs can also be posted via [HTTP](https://blogs.sap.com/2012/01/14/post-idoc-to-sap-erp-over-http-from-any-application/).

Security concerns require the usage of [firewalls](../../firewall/features.md) for lower-level protocols and [WAFs](../../web-application-firewall/overview.md) to address HTTP-based traffic with [Transport Layer Security (TLS)](https://wikipedia.org/wiki/Transport_Layer_Security). To be effective, TLS sessions need to be terminated at the WAF level. To support zero-trust approaches, we recommend that you [re-encrypt](../../application-gateway/ssl-overview.md) again afterward to provide end-to-encryption.

Integration protocols such as AS2 can raise alerts by using standard WAF rules. We recommend using the [Application Gateway WAF triage workbook](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20WAF/Workbook%20-%20AppGw%20WAF%20Triage%20Workbook) to identify and better understand why the rule is triggered, so you can remediate effectively and securely. Open Web Application Security Project (OWASP) provides the standard rules. For a detailed video session on this topic with emphasis on SAP Fiori exposure, see the [SAP on Azure webcast](https://www.youtube.com/watch?v=kAnWTqKlGGo).

You can further enhance security by using [mutual TLS (mTLS)](../../application-gateway/mutual-authentication-overview.md), which is also called mutual authentication. Unlike normal TLS, it verifies the client identity.

> [!NOTE]
> Virtual machine (VM) pools require a load balancer. For better readability, the diagrams in this article don't show a load balancer.

> [!NOTE]
> If you don't need SAP-specific balancing features that SAP Web Dispatcher provides, you can replace them with Azure Load Balancer. This replacement gives the benefit of a managed PaaS offering instead of an infrastructure as a service (IaaS) setup.

## Scenario: Inbound HTTP connectivity focused

SAP Web Dispatcher doesn't offer a WAF. Because of that, we recommend Azure Application Gateway for a more secure setup. SAP Web Dispatcher and Process Orchestration remain in charge to help protect the SAP back end from request overload with [sizing guidance](https://help.sap.com/docs/ABAP_PLATFORM_NEW/683d6a1797a34730a6e005d1e8de6f22/489ab14248c673e8e10000000a42189b.html) and [concurrent request limits](https://help.sap.com/docs/ABAP_PLATFORM/683d6a1797a34730a6e005d1e8de6f22/3a450194bf9c4797afb6e21b4b22ad2a.html). No throttling capability is available in the SAP workloads.

You can avoid unintentional access through [access control lists](https://help.sap.com/docs/ABAP_PLATFORM_NEW/683d6a1797a34730a6e005d1e8de6f22/0c39b84c3afe4d2d9f9f887a32914ecd.html) on SAP Web Dispatcher.

One of the scenarios for SAP Process Orchestration communication is inbound flow. Traffic might originate from on-premises, external apps or users, or an internal system. The following example focuses on HTTPS.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/inbound-1a.png" alt-text="Diagram that shows an inbound HTTP scenario with SAP Process Orchestration on Azure.":::

## Scenario: Outbound HTTP/FTP connectivity focused

For the reverse communication direction, SAP Process Orchestration can use virtual network routing to reach on-premises workloads or internet-based targets via the internet breakout. Azure Application Gateway acts as a reverse proxy in such scenarios. For non-HTTP communication, consider adding Azure Firewall. For more information, see [Scenario: File based](#scenario-file-based) and [Comparison of Gateway components](#comparison-of-gateway-setups) later in this article.

The following outbound scenario shows two possible methods. One uses HTTPS via Azure Application Gateway calling a web service (for example, SOAP adapter). The other uses FTP over SSH (SFTP) via Azure Firewall transferring files to a business partner's SFTP server.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/outbound-1b.png" alt-text="Diagram that shows an outbound scenario with SAP Process Orchestration on Azure.":::

## Scenario: API Management focused

Compared to the scenarios for inbound and outbound connectivity, the introduction of [Azure API Management in internal mode](../../api-management/api-management-using-with-internal-vnet.md) (private IP only and virtual network integration) adds built-in capabilities like:

- [Throttling](../../api-management/api-management-sample-flexible-throttling.md).
- [API governance](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops).
- Additional security options like [modern authentication flows](../../api-management/api-management-howto-protect-backend-with-aad.md).
- [Microsoft Entra ID](../../active-directory/develop/active-directory-v2-protocols.md) integration.
- The opportunity to add SAP APIs to a central API solution across the company.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/inbound-api-management-2.png" alt-text="Diagram that shows an inbound scenario with Azure API Management and SAP Process Orchestration on Azure.":::

When you don't need a WAF, you can deploy Azure API Management in external mode by using a public IP address. That deployment simplifies the setup while keeping the throttling and API governance capabilities. [Basic protection](/azure/cloud-services/cloud-services-configuration-and-management-faq#what-are-the-features-and-capabilities-that-azure-basic-ips-ids-and-ddos-provides-) is implemented for all Azure PaaS offerings.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/inbound-api-management-ext-2.png" alt-text="Diagram that shows an inbound scenario with Azure API Management in external mode and SAP Process Orchestration.":::

## Scenario: Global reach

Azure Application Gateway is a region-bound service. Compared to the preceding scenarios, [Azure Front Door](../../frontdoor/front-door-overview.md) ensures cross-region global routing, including a web application firewall. For details about the differences, see [this comparison](/azure/architecture/guide/technology-choices/load-balancing-overview).

The following diagram condenses SAP Web Dispatcher, SAP Process Orchestration, and the back end into single image for better readability.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/inbound-global-3.png" alt-text="Diagram that shows a global reach scenario with SAP Process Orchestration on Azure.":::

## Scenario: File-based

Non-HTTP protocols like FTP can't be addressed with Azure API Management, Application Gateway, or Azure Front Door as shown in the preceding scenarios. Instead, the managed Azure Firewall instance or the equivalent network virtual appliance (NVA) takes over the role of securing inbound requests.

Files need to be stored before SAP can process them. We recommend that you use [SFTP](../../storage/blobs/secure-file-transfer-protocol-support.md). Azure Blob Storage supports SFTP natively. 

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/file-blob-4.png" alt-text="Diagram that shows a file-based scenario with Azure Blob Storage and SAP Process Orchestration on Azure.":::

Alternative SFTP options are available in Azure Marketplace if necessary.

The following diagram shows a variation of this scenario with integration targets externally and on-premises. Different types of secure FTP illustrate the communication path.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/file-azure-firewall-4.png" alt-text="Diagram that shows a file-based scenario with on-premises file share and external party using SAP Process Orchestration on Azure.":::

For insights into Network File System (NFS) file shares as an alternative to Blob Storage, see [NFS file shares in Azure Files](../../storage/files/files-nfs-protocol.md).

## Scenario: SAP RISE specific

SAP RISE deployments are technically identical to the scenarios described earlier, with the exception that SAP itself manages the target SAP workload. The described concepts can be applied here.

The following diagrams show two setups as examples. For more information, see the [SAP RISE reference guide](rise-integration.md#virtual-network-peering-with-sap-riseecs).

> [!IMPORTANT]
> Contact SAP to ensure that communication ports for your scenario are allowed and opened in NSGs.

### HTTP inbound

In the first setup, the customer governs the integration layer, including SAP Process Orchestration and the complete inbound path. Only the final SAP target runs on the RISE subscription. Communication to the RISE-hosted workload is configured through virtual network peering, typically over the hub. A potential integration could be IDocs posted to the SAP ERP web service `/sap/bc/idoc_xml` by an external party.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/rise-5a.png" alt-text="Diagram that shows an inbound scenario with Azure API Management and self-hosted SAP Process Orchestration on Azure in the RISE context.":::

This second example shows a setup where SAP RISE runs the whole integration chain, except for the API Management layer.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/rise-api-management-5a.png" alt-text="Diagram that shows an inbound scenario with Azure API Management and SAP-hosted SAP Process Orchestration on Azure in the RISE context.":::

### File outbound

In this scenario, the SAP-managed Process Orchestration instance writes files to the customer-managed file share on Azure or to a workload sitting on-premises. The customer handles the breakout.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/rise-5b.png" alt-text="Diagram that shows a file share scenario with SAP Process Orchestration on Azure in the RISE context.":::

## Comparison of gateway setups

> [!NOTE]
> Performance and cost metrics assume production-grade tiers. For more information, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/). Also see the following articles: [Azure Firewall performance](../../firewall/firewall-performance.md), [Application Gateway high-traffic support](../../application-gateway/high-traffic-support.md), and [Capacity of an Azure API Management instance](../../api-management/api-management-capacity.md).

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/compare.png" alt-text="A table that compares the gateway components discussed in this article.":::

Depending on the integration protocols you're using, you might need multiple components. For more information about the benefits of the various combinations of chaining Azure Application Gateway with Azure Firewall, see [Azure Firewall and Application Gateway for virtual networks](/azure/architecture/example-scenario/gateway/firewall-application-gateway#application-gateway-before-firewall).

## Integration rule of thumb

To determine which integration scenarios described in this article best fit your requirements, evaluate them on a case-by-case basis. Consider enabling the following capabilities:

- [Request throttling](../../api-management/api-management-sample-flexible-throttling.md) by using API Management

- [Concurrent request limits](https://help.sap.com/docs/ABAP_PLATFORM/683d6a1797a34730a6e005d1e8de6f22/3a450194bf9c4797afb6e21b4b22ad2a.html) on SAP Web Dispatcher

- [Mutual TLS](../../application-gateway/mutual-authentication-overview.md) to verify the client and the receiver

- WAF and [re-encryption after TLS termination](../../application-gateway/ssl-overview.md)

- [Azure Firewall](../../firewall/features.md) for non-HTTP integrations

- [High availability](../../virtual-machines/workloads/sap/sap-high-availability-architecture-scenarios.md) and [disaster recovery](/azure/cloud-adoption-framework/scenarios/sap/eslz-business-continuity-and-disaster-recovery) for VM-based SAP integration workloads

- Modern [authentication mechanisms like OAuth2](../../api-management/sap-api.md#production-considerations), where applicable

- A managed key store like [Azure Key Vault](../../key-vault/general/overview.md) for all involved credentials, certificates, and keys

## Alternatives to SAP Process Orchestration with Azure Integration Services

With the [Azure Integration Services portfolio](https://azure.microsoft.com/product-categories/integration/), you can natively address the integration scenarios that SAP Process Orchestration covers. For insights on how to design SAP IFlow patterns through cloud-native means, see [this blog series](https://blogs.sap.com/2022/08/30/port-your-legacy-sap-middleware-flows-to-cloud-native-paas-solutions/). The connector guide contains more details about [AS2](../../logic-apps/logic-apps-enterprise-integration-as2.md) and [EDIFACT](../../logic-apps/logic-apps-enterprise-integration-edifact.md).

For more information, view the [Azure Logic Apps connectors](../../logic-apps/logic-apps-using-sap-connector.md) for your desired SAP interfaces. 

## Next steps

[Protect APIs with Application Gateway and API Management](/azure/architecture/reference-architectures/apis/protect-apis)

[Integrate API Management in an internal virtual network with Application Gateway](../../api-management/api-management-howto-integrate-internal-vnet-appgateway.md)

[Deploy the Application Gateway WAF triage workbook to better understand SAP-related WAF alerts](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20WAF/Workbook%20-%20AppGw%20WAF%20Triage%20Workbook)

[Understand the Application Gateway WAF for SAP](https://blogs.sap.com/2020/12/03/sap-on-azure-application-gateway-web-application-firewall-waf-v2-setup-for-internet-facing-sap-fiori-apps/)

[Understand implications of combining Azure Firewall and Azure Application Gateway](/azure/architecture/example-scenario/gateway/firewall-application-gateway#application-gateway-before-firewall)

[Work with SAP OData APIs in Azure API Management](../../api-management/sap-api.md)
