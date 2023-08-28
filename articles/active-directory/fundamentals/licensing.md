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
ms.date: 08/28/2023
ms.subservice: hybrid
ms.author: barclayn
---

# Microsoft Entra ID licensing

This article discusses Entra services' licensing. It is intended for IT decision makers, IT administrators, and IT professionals who are considering Entra services for their organizations. This article is not intended for end users. For detailed licensing information, review [Microsoft Entra Plans & Pricing](https://www.microsoft.com/en-us/security/business/microsoft-entra-pricing?rtc=1)

## Types of licenses

The following licenses are available for use with Microsoft Entra ID.  The type of licenses you need will depend on the features you're using.

- **Free** - Included with Microsoft cloud subscriptions such as Microsoft Azure, Microsoft 365, and others.1
- **Microsoft Azure AD P1** - Azure Active Directory P1 (becoming Microsoft Entra ID P1) is available as a standalone or included with Microsoft 365 E3 for enterprise customers and Microsoft 365 Business Premium for small to medium businesses. 
- **Microsoft Azure AD P2** - Azure Active Directory P2 (becoming Microsoft Entra ID P2) is available as a standalone or included with Microsoft 365 E5 for enterprise customers.
- **Microsoft Entra ID Governance** - Entra ID Governance is an advanced set of identity governance capabilities available for Microsoft Entra ID P1 and P2 customers.

>[!NOTE]
>Microsoft Entra ID Governance scenarios may depends upon other features that aren't covered by Microsoft Entra ID Governance.  These features may have additional licensing requirements.  See [Governance capabilities in other Microsoft Entra features](../governance/identity-governance-overview.md#governance-capabilities-in-other-microsoft-entra-features) for more information on governance scenarios that rely on additional features.

## Access reviews

You need a valid Azure AD Premium (P2) license for each person, other than Global administrators or User administrators, who will create or do access reviews. For more information, see [Access reviews license requirements](../governance/access-reviews-overview.md).

You might also need other Identity Governance features, such as [entitlement lifecycle management](../governance/entitlement-management-overview.md) or PIM. In that case, you might also need related licenses. For more information, see [Azure Active Directory pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

## App provisioning

An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). [!INCLUDE [active-directory-p1-license.md](../../../includes/active-directory-p1-license.md)]

## App proxy

Azure AD Application Proxy, requires Azure AD Premium P1 or P2 licenses. For more information about licensing, see [Azure Active Directory Pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing)

## Authentication

The following table provides a list of the features that are available in the various versions of Azure AD for Multi-Factor Authentication. Plan out your needs for securing user authentication, then determine which approach meets those requirements. For example, although Azure AD Free provides security defaults that provide Azure AD Multi-Factor Authentication, only the mobile authenticator app can be used for the authentication prompt, including SMS and phone calls. This approach may be a limitation if you can't ensure the mobile authentication app is installed on a user's personal device.


| Feature | Azure AD Free - Security defaults (enabled for all users) | Azure AD Free - Global Administrators only | Office 365 | Azure AD Premium P1 | Azure AD Premium P2 | 
| --- |:---:|:---:|:---:|:---:|:---:|
| Protect Azure AD tenant admin accounts with MFA | ● | ● (*Azure AD Global Administrator* accounts only) | ● | ● | ● |
| Mobile app as a second factor | ● | ● | ● | ● | ● |
| Phone call as a second factor | ● | | ● | ● | ● |
| SMS as a second factor | ● | ● | ● | ● | ● |
| Admin control over verification methods | | ● | ● | ● | ● |
| Fraud alert | | | | ● | ● |
| MFA Reports | | | | ● | ● |
| Custom greetings for phone calls | | | | ● | ● |
| Custom caller ID for phone calls | | | | ● | ● |
| Trusted IPs | | | | ● | ● |
| Remember MFA for trusted devices | | ● | ● | ● | ● |
| MFA for on-premises applications | | | | ● | ● |
| Conditional access | | | | ● | ● |
| Risk-based conditional access | | | | | ● |s

## Cloud sync

No licensing requirements (Correct?)

## Conditional access

[!INCLUDE [Active Directory P1 license](../../../includes/active-directory-p1-license.md)]

Customers with [Microsoft 365 Business Premium licenses](/office365/servicedescriptions/office-365-service-descriptions-technet-library) also have access to Conditional Access features. 

Risk-based policies require access to [Identity Protection](../identity-protection/overview-identity-protection.md), which is an Azure AD P2 feature.

Other products and features that may interact with Conditional Access policies require appropriate licensing for those products and features.

When licenses required for Conditional Access expire, policies aren't automatically disabled or deleted. This grants customers the ability to migrate away from Conditional Access policies without a sudden change in their security posture. Remaining policies can be viewed and deleted, but no longer updated. 

[Security defaults](../fundamentals/concept-fundamentals-security-defaults.md) help protect against identity-related attacks and are available for all customers.  



## Hybrid

### Azure AD connect

### What else?


## Identity protection






[!INCLUDE [Managed identities](../includes/licensing-managed-identities.md)]

## Multi tenant organizations

In the source tenant: Using this feature requires Azure AD Premium P1 licenses. Each user who is synchronized with cross-tenant synchronization must have a P1 license in their home/source tenant. To find the right license for your requirements, see [Compare generally available features of Azure AD](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

In the target tenant: Cross-tenant sync relies on the Azure AD External Identities billing model. To understand the external identities licensing model, see [MAU billing model for Azure AD External Identities](../external-identities/external-identities-pricing.md). You also need at least one Azure AD Premium P1 license in the target tenant to enable auto-redemption.


## Privileged identity management

To use Privileged Identity Management (PIM) in Azure Active Directory (Azure AD), part of Microsoft Entra, a tenant must have a valid license. Licenses must also be assigned to the administrators and relevant users. This article describes the license requirements to use Privileged Identity Management.  To use Privileged Identity Management, you must have one of the following licenses:


### Valid licenses for PIM

You'll need either Microsoft Entra ID Governance licenses or Azure AD Premium P2 licenses to use PIM and all of its settings. Currently, you can scope an access review to service principals with access to Azure AD and Azure resource roles with a Microsoft Entra Premuim P2 or Microsoft Entra ID Governance edition active in your tenant. The licensing model for service principals will be finalized for general availability of this feature and additional licenses may be required. 

### Licenses you must have for PIM
Ensure that your directory has Microsoft Entra Premuim P2 or Microsoft Entra ID Governance licenses for the following categories of users:

- Users with eligible and/or time-bound assignments to Azure AD or Azure roles managed using PIM
- Users with eligible and/or time-bound assignments as members or owners of PIM for Groups
- Users able to approve or reject activation requests in PIM
- Users assigned to an access review
- Users who perform access reviews


### Example license scenarios for PIM

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| Woodgrove Bank has 10 administrators for different departments and 2 Global Administrators that configure and manage PIM. They make five administrators eligible. | Five licenses for the administrators who are eligible | 5 |
| Graphic Design Institute has 25 administrators of which 14 are managed through PIM. Role activation requires approval and there are three different users in the organization who can approve activations. | 14 licenses for the eligible roles + three approvers | 17 |
| Contoso has 50 administrators of which 42 are managed through PIM. Role activation requires approval and there are five different users in the organization who can approve activations. Contoso also does monthly reviews of users assigned to administrator roles and reviewers are the users’ managers of which six aren't in administrator roles managed by PIM. | 42 licenses for the eligible roles + five approvers + six reviewers | 53 |

### When a license expires for PIM

If a Microsoft Azure AD Premuim P2, Microsoft Entra ID Governance, or trial license expires, Privileged Identity Management features will no longer be available in your directory:

- Permanent role assignments to Azure AD roles will be unaffected.
- The Privileged Identity Management service in the Azure portal, as well as the Graph API cmdlets and PowerShell interfaces of Privileged Identity Management, will no longer be available for users to activate privileged roles, manage privileged access, or perform access reviews of privileged roles.
- Eligible role assignments of Azure AD roles will be removed, as users will no longer be able to activate privileged roles.
- Any ongoing access reviews of Azure AD roles will end, and Privileged Identity Management configuration settings will be removed.
- Privileged Identity Management will no longer send emails on role assignment changes.

## Role based access control

Using built-in roles in Azure AD is free. Using custom roles require an Azure AD Premium P1 license for every user with a custom role assignment. To find the right license for your requirements, see [Comparing generally available features of the Free and Premium editions](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

## Reports and monitoring

The required roles and licenses may vary based on the report. Global Administrator can access all reports, but we recommend using a role with least privilege access to align with the [Zero Trust guidance](/security/zero-trust/zero-trust-overview).

| Log / Report | Roles | Licenses |
|--|--|--|
| Audit | Report Reader<br>Security Reader<br>Security Administrator<br>Global Reader | All editions of Azure AD |
| Sign-ins | Report Reader<br>Security Reader<br>Security Administrator<br>Global Reader | All editions of Azure AD |
| Provisioning | Same as audit and sign-ins, plus<br>Security Operator<br>Application Administrator<br>Cloud App Administrator<br>A custom role with `provisioningLogs` permission | Premium P1/P2 |
| Usage and insights | Security Reader<br>Reports Reader<br> Security Administrator | Premium P1/P2 |
| Identity Protection* | Security Administrator<br>Security Operator<br>Security Reader<br>Global Reader | Azure AD Free/Microsoft 365 Apps<br>Azure AD Premium P1/P2 |

*The level of access and capabilities for Identity Protection varies with the role and license. For more information, see the [license requirements for Identity Protection](../identity-protection/overview-identity-protection.md#license-requirements).


[!INCLUDE [Verified ID](../includes/licensing-roles.md)]

[!INCLUDE [Verified ID](../includes/licensing-verified-id.md)]

[!INCLUDE [features-preview](../includes/licensing-features-preview.md)]

## Next steps

- [Azure AD pricing](https://azure.microsoft.com/pricing/details/active-directory/)
- [Azure AD B2C pricing](https://azure.microsoft.com/pricing/details/active-directory-b2c/)

