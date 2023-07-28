---
title: 'Microsoft Entra ID licensing'
description: This article documents licensing requirements for Microsoft Entra ID features.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/02/2023
ms.subservice: hybrid
ms.author: barclayn
---

# Microsoft Entra ID licensing fundamentals

This article discusses Entra services' licensing. It is intended for IT decision makers, IT administrators, and IT professionals who are considering Entra services for their organizations. This article is not intended for end users.

## Access reviews

You need a valid Azure AD Premium (P2) license for each person, other than Global administrators or User administrators, who will create or do access reviews. For more information, see [Access reviews license requirements](access-reviews-overview.md).

You might also need other Identity Governance features, such as [entitlement lifecycle management](entitlement-management-overview.md) or PIM. In that case, you might also need related licenses. For more information, see [Azure Active Directory pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

## App provisioning

An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). [!INCLUDE [active-directory-p1-license.md](../../../includes/active-directory-p1-license.md)]

## App proxy

Azure AD Application Proxy, requires Azure AD Premium P1 or P2 licenses. For more information about licensing, see [Azure Active Directory Pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing)

## Authentication

No licensing requirements ????

## Cloud sync

No licensing requirements (Correct?)

## Conditional access

[!INCLUDE [Active Directory P1 license](../../../includes/active-directory-p1-license.md)]

Customers with [Microsoft 365 Business Premium licenses](/office365/servicedescriptions/office-365-service-descriptions-technet-library) also have access to Conditional Access features. 

Risk-based policies require access to [Identity Protection](../identity-protection/overview-identity-protection.md), which is an Azure AD P2 feature.

Other products and features that may interact with Conditional Access policies require appropriate licensing for those products and features.

When licenses required for Conditional Access expire, policies aren't automatically disabled or deleted. This grants customers the ability to migrate away from Conditional Access policies without a sudden change in their security posture. Remaining policies can be viewed and deleted, but no longer updated. 

[Security defaults](../fundamentals/concept-fundamentals-security-defaults.md) help protect against identity-related attacks and are available for all customers.  


## Features in preview


### Feature A

Place holder

### Feature B

Place holder

## Hybrid




## Identity protection




## Managed identities for Azure resources

 There are no licensing requirements for using managed identities for Azure resources. Managed identities is a feature of Azure Active Directory (Azure AD) that provides an automatically managed identity for applications to use when connecting to resources that support Azure AD authentication. One of the benefits of using managed identities is that you don’t need to manage credentials, and they can be used at no extra cost. For more information, see [What is managed identities for Azure resources?](../managed-identities-azure-resources/overview.md).

## Multi tenant organizations



## Privileged identity management


## Reports and monitoring




## Roles




## SaaS apps


|Feature|Free|Microsoft Entra ID P1|Microsoft Entra ID P2|Microsoft Entra ID Governance|
|-----|-----|-----|-----|-----|
|Cloud authentication (Pass-through authentication, password hash synchronization)|x|x|x||
|Federated authentication (Active Directory Federation Services or federation with other identity providers)|x|x|x||
|Single sign-on (SSO) unlimited|x|x|x||
|Software as a service (SaaS) apps with modern authentication (Microsoft Entra ID application gallery apps, SAML, and OAUTH 2.0)|x|x|x||
|Group assignment to applications||x|x||
|Cloud app discovery (Microsoft Defender for Cloud Apps)||x|x||
|Application proxy for on-premises, header-based, and integrated Windows authentication||x|x||
|Secure hybrid access partnerships (Kerberos, NTLM, LDAP, RDP, and SSH authentication)|x|x|x||
|Service level agreement||x|x||
|Customizable user sign-in page|x|x|x||


## Verified ID

Verified ID is currently included with any Azure Active Directory subscription, including Azure AD Free, at no additional cost. For information about Verified ID and how to enable it, see [Verified ID overview](../verifiable-credentials/overview.md).


## Workload Identities

|Feature|Free|Microsoft Entra ID P1|Microsoft Entra ID P2|Microsoft Entra ID Governance|
|-----|-----|-----|-----|-----|
|Cloud authentication (Pass-through authentication, password hash synchronization)|x|x|x||
|Federated authentication (Active Directory Federation Services or federation with other identity providers)|x|x|x||
|Single sign-on (SSO) unlimited|x|x|x||
|Software as a service (SaaS) apps with modern authentication (Microsoft Entra ID application gallery apps, SAML, and OAUTH 2.0)|x|x|x||
|Group assignment to applications||x|x||
|Cloud app discovery (Microsoft Defender for Cloud Apps)||x|x||
|Application proxy for on-premises, header-based, and integrated Windows authentication||x|x||
|Secure hybrid access partnerships (Kerberos, NTLM, LDAP, RDP, and SSH authentication)|x|x|x||
|Service level agreement||x|x||
|Customizable user sign-in page|x|x|x||

