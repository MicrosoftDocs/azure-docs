---
title: Exposing SAP legacy middleware with Azure PaaS securely
description: Learn about securely exposing SAP Process Orchestration on Azure.
author: MartinPankraz

ms.service: virtual-machines-sap
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 07/19/2022
ms.author: mapankra

---
# Exposing SAP legacy middleware with Azure PaaS securely

Enabling internal systems and external partners to interact with SAP backends is a common requirement. Existing SAP landscapes often rely on the legacy middleware [SAP Process Orchestration](https://help.sap.com/docs/SAP_NETWEAVER_750/bbd7c67c5eb14835843976b790024ec6/8e995afa7a8d467f95a473afafafa07e.html)(PO) or [Process Integration](https://help.sap.com/docs/SAP_NETWEAVER_750/bbd7c67c5eb14835843976b790024ec6/8e995afa7a8d467f95a473afafafa07e.html)(PI) for their integration and transformation needs. For simplicity the term "SAP Process Orchestration" will be used in this article but associated with both offerings.

This article describes configuration options on Azure with emphasis on Internet-facing implementations.

> [!NOTE]
> SAP mentions [SAP IntegrationSuite](https://discovery-center.cloud.sap/serviceCatalog/integration-suite?region=all) - specifically [SAP CloudIntegration](https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/9af2f05c7eb04457aee5906fd8553e00.html) - running on [Business TechnologyPlatform](https://www.sap.com/products/business-technology-platform.html)(BTP) as the successor for SAP PO/PI. Both the BTP platform and the services are available on Azure. For more information, see [SAP DiscoveryCenter](https://discovery-center.cloud.sap/serviceCatalog/integration-suite?region=all&tab=service_plan&provider=azure). See SAP OSS note [1648480](https://launchpad.support.sap.com/#/notes/1648480) for more info about the maintenance support timeline for the legacy component.

## Overview

Existing implementations based on SAP middleware often relied on SAP's proprietary dispatching technology called [SAP WebDispatcher](https://help.sap.com/docs/ABAP_PLATFORM_NEW/683d6a1797a34730a6e005d1e8de6f22/488fe37933114e6fe10000000a421937.html). It operates on layer 7 of the [OSI model](https://en.wikipedia.org/wiki/OSI_model), acts as a reverse-proxy and addresses load balancing needs for the downstream SAP application workloads like SAP ERP, SAP Gateway, or SAP Process Orchestration.

Dispatching approaches range from traditional reverse proxies like Apache, to Platform-as-a-Service (PaaS) options like the [Azure Load Balancer](../../../load-balancer/load-balancer-overview.md), or the opinionated SAP WebDispatcher. The overall concepts described in this article apply to the options mentioned. Have a look at SAP's [wiki](https://wiki.scn.sap.com/wiki/display/SI/Can+I+use+a+different+load+balancer+instead+of+SAP+Web+Dispatcher) for their guidance on using non-SAP load balancers.

> [!NOTE]
> All described setups in this article assume a hub-spoke networking topology, where shared services are deployed into the hub. Given the criticality of SAP, even more isolation may be desirable. For more information, see our SAP perimeter-network design (also known as DMZ) [guide](/azure/architecture/guide/sap/sap-internet-inbound-outbound#network-design).

## Primary Azure services used 

[Azure Application Gateway](../../../application-gateway/how-application-gateway-works.md) handles public [internet-based](../../../application-gateway/configuration-front-end-ip.md) and/or [internal private](../../../application-gateway/configuration-front-end-ip.md) http routing and [encrypted tunneling across Azure subscriptions](../../../application-gateway/private-link.md), [security](../../../application-gateway/features.md), and [auto-scaling](../../../application-gateway/application-gateway-autoscaling-zone-redundant.md) for instance. Azure Application Gateway is focused on exposing web applications, hence offers a Web Application Firewall. Workloads in other virtual networks (VNet) that shall communicate with SAP through the Azure Application Gateway can be connected via [private links](../../../application-gateway/private-link-configure.md) even cross-tenant.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/private-link.png" alt-text="Diagram that shows cross tenant communication via Azure Application Gateway.":::

[Azure Firewall](../../../firewall/overview.md) handles public internet-based and/or internal private routing for traffic types on Layer 4-7 of the OSI model. It offers filtering and threat intelligence, which feeds directly from Microsoft Cyber Security.

[Azure API Management](../../../api-management/api-management-key-concepts.md) handles public internet-based and/or internal private routing specifically for APIs. It offers request throttling, usage quota and limits, governance features like policies, and API keys to slice and dice services per client.

[VPN Gateway](../../../vpn-gateway/vpn-gateway-about-vpngateways.md) and [Azure ExpressRoute](../../../expressroute/expressroute-introduction.md) serve as entry points to on-premises networks. Both components are abbreviated on the diagrams as VPN and XR.

## Setup considerations

Integration architecture needs differ depending on the interface used. SAP-proprietary technologies like [intermediate Document framework](https://help.sap.com/docs/SAP_DATA_SERVICES/e54136ab6a4a43e6a370265bf0a2d744/577710e16d6d1014b3fc9283b0e91070.html) (ALE/iDoc), [Business Application Programming Interface](https://help.sap.com/docs/SAP_ERP/c5a8d544836649a1af6eaef358d08e3f/4dc89000ebfc5a9ee10000000a42189b.html) (BAPI), [transactional Remote Function Calls](https://help.sap.com/docs/SAP_NETWEAVER_700/108f625f6c53101491e88dc4cf51a6cc/4899b963ee2b73e7e10000000a42189b.html) (tRFC), or plain [RFC](https://help.sap.com/docs/SAP_ERP/be79bfef64c049f88262cf6cb5de1c1f/0502cbfa1c2f184eaa6ba151d1aaf4fe.html) require a specific runtime environment and operate on layer 4-7 of the OSI model, unlike modern APIs that typically rely on http-based communication (layer 7 of the OSI model). Because of that the interfaces can't be treated the same way.

This article focuses on modern APIs and http (that includes integration scenarios like [AS2](https://wikipedia.org/wiki/AS2)). [FTP](https://wikipedia.org/wiki/File_Transfer_Protocol) will serve as an example to handle `non-http` integration needs. For more information about the different Microsoft load balancing solutions, see [this article](/azure/architecture/guide/technology-choices/load-balancing-overview).

> [!NOTE]
> SAP publishes dedicated [connectors](https://support.sap.com/en/product/connectors.html) for their proprietary interfaces. Check SAP's documentation for [Java](https://support.sap.com/en/product/connectors/jco.html), and [.NET](https://support.sap.com/en/product/connectors/msnet.html) for example. They are supported by [Microsoft Gateways](../../../data-factory/connector-sap-table.md?tabs=data-factory#prerequisites) too. Be aware that iDocs can also be posted via [http](https://blogs.sap.com/2012/01/14/post-idoc-to-sap-erp-over-http-from-any-application/).

Security concerns require the usage of [Firewalls](../../../firewall/features.md) for lower-level protocols and [Web Application Firewalls](../../../web-application-firewall/overview.md) (WAF) to address http-based traffic with [Transport Layer Security](https://wikipedia.org/wiki/Transport_Layer_Security) (TLS). To be effective, TLS sessions need to be terminated at the WAF level. Supporting zero-trust approaches, it's advisable to [re-encrypt](../../../application-gateway/ssl-overview.md) again afterwards to ensure end-to-encryption.

Integration protocols such as AS2 may raise alerts by standard WAF rules. We recommend using our [Application Gateway WAF triage workbook](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20WAF/Workbook%20-%20AppGw%20WAF%20Triage%20Workbook) to identify and better understand why the rule is triggered, so you can remediate effectively and securely. The standard rules are provided by Open Web Application Security Project (OWASP). For more information, see the [SAP on Azure webcast](https://www.youtube.com/watch?v=kAnWTqKlGGo) for a detailed video session on this topic with emphasis on SAP Fiori exposure.

In addition, security can be further enhanced with [mutual TLS](../../../application-gateway/mutual-authentication-overview.md) (mTLS) - also referred to as mutual authentication. Unlike normal TLS, it also verifies the client identity.

> [!NOTE]
> VM pools require a load balancer. For better readability it is not shown explicitly on the diagrams below.

> [!NOTE]
> In case SAP specific balancing features provided by the SAP WebDispatcher aren't required, they can be replaced by an Azure Load Balancer giving the benefit of a managed PaaS offering compared to an Infrastructure-as-a-Service setup.

## Scenario 1.A: Inbound http connectivity focused

The SAP WebDispatcher **doesn't** offer a Web Application Firewall. Because of that Azure Application Gateway is recommended for a more secure setup. The WebDispatcher and "Process Orchestration" remain in charge to protect the SAP backend from request overload with [sizing guidance](https://help.sap.com/docs/ABAP_PLATFORM_NEW/683d6a1797a34730a6e005d1e8de6f22/489ab14248c673e8e10000000a42189b.html) and [concurrent request limits](https://help.sap.com/docs/ABAP_PLATFORM/683d6a1797a34730a6e005d1e8de6f22/3a450194bf9c4797afb6e21b4b22ad2a.html). There's **no** throttling capability available in the SAP workloads.

Unintentional access can be avoided through [Access Control Lists](https://help.sap.com/docs/ABAP_PLATFORM_NEW/683d6a1797a34730a6e005d1e8de6f22/0c39b84c3afe4d2d9f9f887a32914ecd.html) on the SAP WebDispatcher.

One of the scenarios for SAP Process Orchestration communication is inbound flow. Traffic may originate from On-premises, external apps/users or an internal system. See below an example with focus on https.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/inbound-1a.png" alt-text="Diagram that shows inbound http scenario with SAP Process Orchestration on Azure.":::

## Scenario 1.B: Outbound http/ftp connectivity focused

For the reverse communication direction "Process Orchestration" may leverage the VNet routing to reach workloads on-premises or Internet-based targets via the Internet breakout. Azure Application Gateway acts as a reverse proxy in such scenarios. For `non-http` communication, consider adding Azure Firewall. For more information, see [Scenario 4](#scenario-4-file-based) and [Comparing Gateway components](#comparing-gateway-setups).

The outbound scenario below shows two possible methods. One using HTTPS via the Azure Application Gateway calling a Webservice (for example SOAP adapter) and the other using SFTP (FTP over SSH) via the Azure Firewall transferring files to a business partner's S/FTP server.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/outbound-1b.png" alt-text="Diagram that shows an outbound scenario with SAP Process Orchestration on Azure.":::

## Scenario 2: API Management focused

Compared to scenario 1, the introduction of [Azure API Management (APIM) in internal mode](../../../api-management/api-management-using-with-internal-vnet.md) (private IP only and VNet integration) adds built-in capabilities like:

- [Throttling](../../../api-management/api-management-sample-flexible-throttling.md),
- [API governance](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops),
- Additional security options like [modern authentication flows](../../../api-management/api-management-howto-protect-backend-with-aad.md),
- [Azure Active Directory](../../../active-directory/develop/active-directory-v2-protocols.md) integration and
- The opportunity to add the SAP APIs to a central company-wide API solution.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/inbound-api-management-2.png" alt-text="Diagram that shows an inbound scenario with Azure API Management and SAP Process Orchestration on Azure.":::

When a web application firewall isn't required, Azure API Management can be deployed in external mode (using a public IP). That simplifies the setup, while keeping the throttling and API governance capabilities. [Basic protection](/azure/cloud-services/cloud-services-configuration-and-management-faq#what-are-the-features-and-capabilities-that-azure-basic-ips-ids-and-ddos-provides-) is implemented for all Azure PaaS offerings.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/inbound-api-management-ext-2.png" alt-text="Diagram that shows an inbound scenario with Azure API Management in external mode and SAP Process Orchestration.":::

## Scenario 3: Global reach

Azure Application Gateway is a region-bound service. Compared to the above scenarios [Azure Front Door](../../../frontdoor/front-door-overview.md) ensures cross-region global routing including a web application firewall. Look at [this comparison](/azure/architecture/guide/technology-choices/load-balancing-overview) for more details about the differences.

> [!NOTE]
> Condensed SAP WebDispatcher, Process Orchestration, and backend into single image for better readability.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/inbound-global-3.png" alt-text="Diagram that shows a global reach scenario with SAP Process Orchestration on Azure.":::

## Scenario 4: File-based

`Non-http` protocols like FTP can't be addressed with Azure API Management, Application Gateway, or Front Door like shown in scenarios beforehand. Instead the managed Azure Firewall or equivalent Network Virtual Appliance (NVA) takes over the role of securing inbound requests.

Files need to be stored before they can be processed by SAP. It's recommended to use [SFTP](../../../storage/blobs/secure-file-transfer-protocol-support.md). Azure Blob Storage supports SFTP natively. 

> [!NOTE]
> At the time of writing this article [the feature](../../../storage/blobs/secure-file-transfer-protocol-support.md) is still in preview.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/file-blob-4.png" alt-text="Diagram that shows a file-based scenario with Azure Blob and SAP Process Orchestration on Azure.":::

There are alternative SFTP options available on the Azure Marketplace if necessary.

See below a variation with integration targets externally and on-premises. Different flavors of secure FTP illustrate the communication path.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/file-azure-firewall-4.png" alt-text="Diagram that shows a file-based scenario with on-premises file share and external party using SAP Process Orchestration on Azure.":::

For more information, see the [Azure Files docs](../../../storage/files/files-nfs-protocol.md) for insights into NFS file shares as alternative to Blob Storage.

## Scenario 5: SAP RISE specific

SAP RISE deployments are technically identical to the scenarios described before with the exception that the target SAP workload is managed by SAP itself. The concepts described can be applied here as well.

Below diagrams describe two different setups as examples. For more information, see our [SAP RISE reference guide](../../../virtual-machines/workloads/sap/sap-rise-integration.md#virtual-network-peering-with-sap-riseecs).

> [!IMPORTANT]
> Contact SAP to ensure communications ports for your scenario are allowed and opened in Network Security Groups.

### Scenario 5.A: Http inbound

In the first setup, the integration layer including "SAP Process Orchestration" and the complete inbound path is governed by the customer. Only the final SAP target runs on the RISE subscription. Communication to the RISE hosted workload is configured through virtual network peering - typically over the hub. A potential integration could be iDocs posted to the SAP ERP Webservice `/sap/bc/idoc_xml` by an external party.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/rise-5a.png" alt-text="Diagram that shows an inbound scenario with Azure API Management and self-hosted SAP Process Orchestration on Azure in the RISE context.":::

This second example shows a setup, where SAP RISE runs the whole integration chain except for the API Management layer.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/rise-api-management-5a.png" alt-text="Diagram that shows an inbound scenario with Azure API Management and SAP-hosted SAP Process Orchestration on Azure in the RISE context.":::

### Scenario 5.B: File outbound

In this scenario, the SAP-managed "Process Orchestration" instance writes files to the customer managed file share on Azure or to a workload sitting on-premises. The breakout needs to be handled by the customer.

> [!NOTE]
> At the time of writing this article the [Azure Blob Storage SFTP feature](../../../storage/blobs/secure-file-transfer-protocol-support.md) is still in preview.

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/rise-5b.png" alt-text="Diagram that shows a file share scenario with SAP Process Orchestration on Azure in the RISE context.":::

## Comparing gateway setups

> [!NOTE]
> Performance and cost metrics assume production grade tiers. For more information, see the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) and Azure docs for [Azure Firewall](../../../firewall/firewall-performance.md), [Azure Application Gateway (incl. Web Application Firewall - WAF)](../../../application-gateway/high-traffic-support.md), and [Azure API Management](../../../api-management/api-management-capacity.md).

:::image type="content" source="media/expose-sap-process-orchestration-on-azure/compare.png" alt-text="A table that compares the different gateway components discussed in this article.":::

Depending on the integration protocols required you may need multiple components. Find more details about the benefits of the various combinations of chaining Azure Application Gateway with Azure Firewall [here](/azure/architecture/example-scenario/gateway/firewall-application-gateway#application-gateway-before-firewall).

## Integration rule of thumb

Which integration flavor described in this article fits your requirements best, needs to be evaluated on a case-by-case basis. Consider enabling the following capabilities:

- [Request throttling](../../../api-management/api-management-sample-flexible-throttling.md) using API Management

- [Concurrent request limits](https://help.sap.com/docs/ABAP_PLATFORM/683d6a1797a34730a6e005d1e8de6f22/3a450194bf9c4797afb6e21b4b22ad2a.html) on the SAP WebDispatcher

- [Mutual TLS](../../../application-gateway/mutual-authentication-overview.md) to verify client and receiver

- Web Application Firewall and [re-encrypt after TLS-termination](../../../application-gateway/ssl-overview.md)

- A [Firewall](../../../firewall/features.md) for `non-http` integrations

- [High-availability](../../../virtual-machines/workloads/sap/sap-high-availability-architecture-scenarios.md) and [disaster recovery](/azure/cloud-adoption-framework/scenarios/sap/eslz-business-continuity-and-disaster-recovery) for the VM-based SAP integration workloads

- Modern [authentication mechanisms like OAuth2](../../../api-management/sap-api.md#production-considerations) where applicable

- Utilize a managed key store like [Azure Key Vault](../../../key-vault/general/overview.md) for all involved credentials, certificates, and keys

## Alternatives to SAP Process Orchestration with Azure Integration Services

The integration scenarios covered by SAP Process Orchestration can be natively addressed with the [Azure Integration Service portfolio](https://azure.microsoft.com/product-categories/integration/). Have a look at the [Azure Logic Apps connectors](../../../logic-apps/logic-apps-using-sap-connector.md) for your desired SAP interfaces to get started. The connector guide contains more details for [AS2](../../../logic-apps/logic-apps-enterprise-integration-as2.md), [EDIFACT](../../../logic-apps/logic-apps-enterprise-integration-edifact.md) etc. too. See [this blog series](https://blogs.sap.com/2022/08/30/port-your-legacy-sap-middleware-flows-to-cloud-native-paas-solutions/) for insights on how to design SAP iFlow patterns with cloud-native means.

## Next steps

[Protect APIs with Application Gateway and API Management](/azure/architecture/reference-architectures/apis/protect-apis)

[Integrate API Management in an internal virtual network with Application Gateway](../../../api-management/api-management-howto-integrate-internal-vnet-appgateway.md)

[Deploy the Application Gateway WAF triage workbook to better understand SAP related WAF alerts](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20WAF/Workbook%20-%20AppGw%20WAF%20Triage%20Workbook)

[Understand Azure Application Gateway and Web Application Firewall for SAP](https://blogs.sap.com/2020/12/03/sap-on-azure-application-gateway-web-application-firewall-waf-v2-setup-for-internet-facing-sap-fiori-apps/)

[Understand implication of combining Azure Firewall and Azure Application Gateway](/azure/architecture/example-scenario/gateway/firewall-application-gateway#application-gateway-before-firewall)

[Work with SAP OData APIs in Azure API Management](../../../api-management/sap-api.md)