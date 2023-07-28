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
ms.date: 07/28/2023
ms.subservice: hybrid
ms.author: barclayn
---

# Microsoft Entra ID licensing fundamentals

This article discusses Entra services' licensing. It is intended for IT decision makers, IT administrators, and IT professionals who are considering Entra services for their organizations. This article is not intended for end users.

## Access reviews

You need a valid Azure AD Premium (P2) license for each person, other than Global administrators or User administrators, who will create or do access reviews. For more information, see [Access reviews license requirements](../governance/access-reviews-overview.md).

You might also need other Identity Governance features, such as [entitlement lifecycle management](../governance/entitlement-management-overview.md) or PIM. In that case, you might also need related licenses. For more information, see [Azure Active Directory pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

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

You will need either Microsoft Entra ID Governance licenses or Azure AD Premium P2 licenses to use PIM and all of its settings. Currently, you can scope an access review to service principals with access to Azure AD and Azure resource roles with an Microsoft Entra Premuim P2 or Microsoft Entra ID Governance edition active in your tenant. 

### Licenses you must have

Ensure that your tenant has either Microsoft Entra ID Governance or Microsoft Azure AD Premium P2 licenses for all users whose identities or access is governed or who interact with an identity governance feature.


### Example license scenarios

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| Woodgrove Bank has 10 administrators for different departments and 2 Global Administrators that configure and manage PIM. They make five administrators eligible. | Five licenses for the administrators who are eligible | 5 |
| Graphic Design Institute has 25 administrators of which 14 are managed through PIM. Role activation requires approval and there are three different users in the organization who can approve activations. | 14 licenses for the eligible roles + three approvers | 17 |
| Contoso has 50 administrators of which 42 are managed through PIM. Role activation requires approval and there are five different users in the organization who can approve activations. Contoso also does monthly reviews of users assigned to administrator roles and reviewers are the users’ managers of which six are not in administrator roles managed by PIM. | 42 licenses for the eligible roles + five approvers + six reviewers | 53 |

### When a license expires

If a Microsoft Azure AD Premuim P2, Microsoft Entra ID Governance, or trial license expires, Privileged Identity Management features will no longer be available in your directory:

- Permanent role assignments to Azure AD roles will be unaffected.
- The Privileged Identity Management service in the Azure portal, as well as the Graph API cmdlets and PowerShell interfaces of Privileged Identity Management, will no longer be available for users to activate privileged roles, manage privileged access, or perform access reviews of privileged roles.
- Eligible role assignments of Azure AD roles will be removed, as users will no longer be able to activate privileged roles.
- Any ongoing access reviews of Azure AD roles will end, and Privileged Identity Management configuration settings will be removed.
- Privileged Identity Management will no longer send emails on role assignment changes.




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

Verified ID is currently included with any Azure Active Directory subscription, including Azure AD Free, at no additional cost. For information about Verified ID and how to enable it, see [Verified ID overview](../verifiable-credentials/decentralized-identifier-overview.md).


## Workload Identities

[Microsoft Entra Workload Identities](workload-identities-overview.md) is now available in two editions: **Free** and **Workload Identities Premium**. The free edition of workload identities is included with a subscription of a commercial online service such as [Azure](https://azure.microsoft.com/) and [Power Platform](https://powerplatform.microsoft.com/). The Workload
Identities Premium offering is available through a Microsoft representative, the [Open Volume License
Program](https://www.microsoft.com/licensing/how-to-buy/how-to-buy), and the [Cloud Solution Providers program](../../lighthouse/concepts/cloud-solution-provider.md). Azure and Microsoft 365 subscribers can also purchase Workload
Identities Premium online.

For more information, see [what are workload identities?](workload-identities-overview.md)

>[!NOTE]
>Workload Identities Premium is a standalone product and isn't included in other premium product plans. All subscribers require a license to use Workload Identities Premium features.

Learn more about [Workload Identities
pricing](https://www.microsoft.com/security/business/identity-access/microsoft-entra-workload-identities#office-StandaloneSKU-k3hubfz).

### What features are included in Workload Identities Premium plan and which features are free? 

|Capabilities | Description | Free | Premium |                 
|:--------|:----------|:------------|:-----------|
| **Authentication and authorization**|  | | |
| Create, read, update, delete workload identities  | Create and update identities for securing service to service access  | Yes |  Yes |
| Authenticate workload identities and tokens to access resources |  Use Azure Active Directory (Azure AD) to protect resource access |  Yes|  Yes |
| Workload identities sign-in activity and audit trail |   Monitor and track workload identity behavior  |  Yes |  Yes |
| **Managed identities**| Use Azure AD identities in Azure without handling credentials |  Yes| Yes |
| Workload identity federation | Use workloads tested by external Identity Providers (IdPs) to access Azure AD protected resources | Yes | Yes |
|  **Conditional Access (CA)**     |   |   |    
| CA policies for workload identities |Define the condition in which a workload can access a resource, such as an IP range | |  Yes | 
|**Lifecycle Management**|    |    |   |
|Access reviews for service provider-assigned privileged roles  |   Closely monitor workload identities with impactful permissions |    |  Yes |
|**Identity Protection**  |  | |
|Identity Protection for workload identities  | Detect and remediate compromised workload identities | | Yes |                                                                            

## Next steps

- [Azure AD pricing](https://azure.microsoft.com/pricing/details/active-directory/)
- [Azure AD B2C pricing](https://azure.microsoft.com/pricing/details/active-directory-b2c/)

