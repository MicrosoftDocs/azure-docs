---
title: Build more resilient hybrid authentication in Azure Active Directory
description: A guide for architects and IT administrators on building a resilient hybrid infrastructure.
services: active-directory
author: janicericketts
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 11/16/2022
ms.author: jricketts
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---
# Build resilience in your hybrid architecture

Hybrid authentication allows users to access cloud-based resources with their identities mastered on premises. A hybrid infrastructure includes both cloud and on premises components.

* Cloud components include Azure Active Directory (Azure AD), Azure resources and services, your organization's cloud-based apps, and SaaS applications.
* on premises components include on premises applications, resources like SQL databases, and an identity provider like Windows Server Active Directory. 

> [!IMPORTANT]
> As you plan for resilience in your hybrid infrastructure, it's key to minimize dependencies and single points of failure. 

Microsoft offers three mechanisms for hybrid authentication. The options are listed in order of resilience. We recommend that you implement password hash synchronization, if possible.

* [Password hash synchronization](../hybrid/whatis-phs.md) (PHS) uses Azure AD Connect to sync the identity and a hash-of-the-hash of the password to Azure AD. It enables users to sign in to cloud-based resources with their password mastered on premises. PHS has on premises dependencies only for synchronization, not for authentication.
* [Pass-through Authentication](../hybrid/how-to-connect-pta.md) (PTA) redirects users to Azure AD for sign-in. Then, the username and password are validated against Active Directory on premises through an agent that is deployed in the corporate network. PTA has an on premises footprint of its Azure AD PTA agents that reside on servers on premises.
* [Federation](../hybrid/whatis-fed.md) customers deploy a federation service such as Active Directory Federation Services (ADFS). Then Azure AD validates the SAML assertion produced by the federation service. Federation has the highest dependency on on-premises infrastructure and, therefore, more failure points. 

You may be using one or more of these methods in your organization. For more information, see [Choose the right authentication method for your Azure AD hybrid identity solution](../hybrid/choose-ad-authn.md). This article contains a decision tree that can help you decide on your methodology.

## Password hash synchronization

The simplest and most resilient hybrid authentication option for Azure AD is [Password Hash Synchronization](../hybrid/whatis-phs.md). It doesn't have any on premises identity infrastructure dependency when processing authentication requests. After identities with password hashes are synchronized to Azure AD, users can authenticate to cloud resources with no dependency on the on premises identity components. 

![Architecture diagram of PHS](./media/resilience-in-hybrid/admin-resilience-password-hash-sync.png)

If you choose this authentication option, you won't experience disruption when on premises identity components become unavailable. On premises disruption can occur for many reasons, including hardware failure, power outages, natural disasters, and malware attacks. 

### How do I implement PHS?

To implement PHS, see the following resources:

* [Implement password hash synchronization with Azure AD Connect](../hybrid/how-to-connect-password-hash-synchronization.md)
* [Enable password hash synchronization](../hybrid/how-to-connect-password-hash-synchronization.md)

If your requirements are such that you can't use PHS, use Pass-through Authentication.

## Pass-through Authentication

Pass-through Authentication has a dependency on authentication agents that reside on premises on servers. A persistent connection, or service bus, is present between Azure AD and the on premises PTA agents. The firewall, servers hosting the authentication agents, and the on premises Windows Server Active Directory (or other identity provider) are all potential failure points. 

![Architecture diagram of PTA](./media/resilience-in-hybrid/admin-resilience-pass-through-authentication.png)

### How do I implement PTA?

To implement Pass-through Authentication, see the following resources.

* [How Pass-through Authentication works](../hybrid/how-to-connect-pta-how-it-works.md)
* [Pass-through Authentication security deep dive](../hybrid/how-to-connect-pta-security-deep-dive.md)
* [Install Azure AD Pass-through Authentication](../hybrid/how-to-connect-pta-quick-start.md)

* If you're using PTA, define a [highly available topology](../hybrid/how-to-connect-pta-quick-start.md).

 ## Federation

Federation involves the creation of a trust relationship between Azure AD and the federation service, which includes the exchange of endpoints, token signing certificates, and other metadata. When a request comes to Azure AD, it reads the configuration and redirects the user to the endpoints configured. At that point, the user interacts with the federation service, which issues a SAML assertion that is validated by Azure AD. 

The following diagram shows a topology of an enterprise AD FS deployment that includes redundant federation and web application proxy servers across multiple on premises data centers. This configuration relies on enterprise networking infrastructure components like DNS, Network Load Balancing with geo-affinity capabilities, and firewalls. All on premises components and connections are susceptible to failure. Visit the [AD FS Capacity Planning Documentation](/windows-server/identity/ad-fs/design/planning-for-ad-fs-server-capacity) for more information.

> [!NOTE]
>  Federation has the highest number of on premises dependencies and, therefore, the most potential points of failure. While this diagram shows AD FS, other on premises identity providers are subject to similar design considerations to achieve high availability, scalability, and fail over.

![Architecture diagram of federation](./media/resilience-in-hybrid/admin-resilience-federation.png)

 ### How do I implement federation?

If you're implementing a federated authentication strategy or want to make it more resilient, see the following resources.

* [What is federated authentication](../hybrid/whatis-fed.md)
* [How federation works](../hybrid/how-to-connect-fed-whatis.md)
* [Azure AD federation compatibility list](../hybrid/how-to-connect-fed-compatibility.md)
* Follow the [AD FS capacity planning documentation](/windows-server/identity/ad-fs/design/planning-for-ad-fs-server-capacity)
* [Deploying AD FS in Azure IaaS](/windows-server/identity/ad-fs/deployment/how-to-connect-fed-azure-adfs)
* [Enable PHS](../hybrid/tutorial-phs-backup.md) along with your federation

## Next steps

### Resilience resources for administrators and architects
 
* [Build resilience with credential management](resilience-in-credentials.md)
* [Build resilience with device states](resilience-with-device-states.md)
* [Build resilience by using Continuous Access Evaluation (CAE)](resilience-with-continuous-access-evaluation.md)
* [Build resilience in external user authentication](resilience-b2b-authentication.md)
* [Build resilience in application access with Application Proxy](resilience-on premises-access.md)

### Resilience resources for developers

* [Build IAM resilience in your applications](resilience-app-development-overview.md)
* [Build resilience in your CIAM systems](resilience-b2c.md)
