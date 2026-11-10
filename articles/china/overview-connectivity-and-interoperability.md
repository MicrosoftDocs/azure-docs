---
title: Azure in China cross-border connectivity and interoperability
description: Learn about Cross-border connectivity and interoperability for Azure in China. See diagrams that show IaaS and PaaS interoperability designs.
ms.topic: concept-article
ms.date: 07/20/2020
---

# Cross-border connectivity and interoperability

## Cross-border connectivity

### Network latency in China

In general, network latency between Azure China and Azure global regions is inevitable due to unpredictable network connections. For cross-border data transfers between Azure China and Azure global, latency is typically about three times higher than for data transfers within Azure global regions. It is a best practice to:

* Host the workload targeting Chinese users on Azure in China.
* Deploy the workload to the closest Azure region for users located outside of China.

### Through VPN site-to-site or ExpressRoute

If you host your workload within China, please consider global connectivity and interoperability from a hybrid cloud scenario. For more information, see [Cross-border connectivity and interoperability](overview-connectivity-and-interoperability.md).

## Azure Active Directory federation

Azure Active Directory (Azure AD) has features to support all common scenarios. The guides [Authentication with on-premises Active Directory](/azure/app-service/overview-authentication-authorization) and [Azure AD Connect](/azure/active-directory/hybrid/whatis-hybrid-identity) show recommended ways and mechanisms for cloud authentication with on-premises Active Directory. It supports:

* Multi-national corporations that have multiple domains.
* Multi-national corporations that have a unified domain. Please note this solution doesn't support Dynamics 365 F&O Cross-Tenant integration services with Microsoft 365, Power BI, or Azure services.

### Implementation and considerations

* [Managing custom domain names in your Azure Active Directory](/azure/active-directory/active-directory-add-manage-domain-names)
* [Custom installation of Azure AD Connect](/azure/active-directory/connect/active-directory-aadconnect-get-started-custom)
* [Configuring federation with AD FS](/azure/active-directory/connect/active-directory-aadconnect-get-started-custom#configuring-federation-with-ad-fs)

## Cross-border interoperability

Although Azure in China regions are disconnected from Azure global regions, you can still link between cross-border regions using one of the following solutions.

**1. Connection via two individual ExpressRoute circuits**

:::image type="content" source="media/overview-connectivity-and-interoperability/iaas-paas.png" lightbox="media/overview-connectivity-and-interoperability/iaas-paas.png" alt-text="A diagram showing the connection between Azure in China regions and Azure global regions via two individual ExressRoute circuits." border="false":::

Linking across both infrastructure as a service (IaaS) and platform as a service (PaaS) is supported.

**2. Connection via China Express model**

:::image type="content" source="media/overview-connectivity-and-interoperability/express.png" lightbox="media/overview-connectivity-and-interoperability/express.png" alt-text="A diagram showing the connection between Azure in China regions and Azure global regions via China Express model." border="false":::

This model only supports a link between infrastructure as a service (IaaS).

China Express provides a one-stop service for customers, requiring only one contract with the selected telecommunications operator, which reduces the business complexity.

**3. Connection via VPN model**

:::image type="content" source="media/overview-connectivity-and-interoperability/vpn-diagram.png" lightbox="media/overview-connectivity-and-interoperability/vpn-diagram.png" alt-text="A diagram showing the connection between Azure in China regions and Azure global regions via a VPN model." border="false":::

Linking across both infrastructure as a service (IaaS) and platform as a service (PaaS) is supported.

If you need support, contact your Microsoft representative.
