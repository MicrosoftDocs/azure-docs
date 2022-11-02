---
title: Memo 22-09 authorization requirements 
description: Get guidance on meeting authorization requirements outlined in US government OMB memorandum 22-09.
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 3/10/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Meet authorization requirements of memorandum 22-09

This series of articles offers guidance for employing Azure Active Directory (Azure AD) as a centralized identity management system for implementing Zero Trust principles, as described in the US federal government's Office of Management and Budget (OMB) [memorandum 22-09](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf).

The memo requires specific types of enforcement within your multifactor authentication (MFA) policies. Specifically, you must account for device-based controls, role-based controls, attribute-based controls, and privileged access management.


## Device-based controls

Memorandum 22-09 specifically requires the use of at least one device-based signal when you're making an authorization decision to access a system or application. You can enforce this requirement by using conditional access. Several device signals can be applied during the authorization. The following table describes the signal and the requirements to retrieve the signal:

| Signal| Signal retrieval |
| - | - |
| Device must be managed| Integration with Intune or another mobile device management (MDM) solution that supports this integration is required. 
Hybrid Azure AD joined| The device is managed by Active Directory and qualifies. 
| Device must be compliant| Integration with Intune or another MDM solution that supports this integration is required. For more information, see [Use device compliance policies to set rules for devices you manage with Intune](/mem/intune/protect/device-compliance-get-started). |
| Threat signals| Microsoft Defender for Endpoint and other endpoint detection and response (EDR) tools have integrations with Azure AD and Intune to send threat signals that can be used to deny access. Threat signals are part of the compliant status signal. |
| Cross-tenant access policies (public preview)| These policies permit an organization to trust device signals from devices that belong to other organizations. |

##  Role-based controls

Role-based access control (RBAC) is an important way to enforce basic authorizations through assignments of users to a role in a particular scope. Azure AD has tools that make RBAC assignment and lifecycle management easier. For example, you can assign access by using [entitlement management](../governance/entitlement-management-overview.md) features, including [access packages](../governance/entitlement-management-access-package-create.md) and [access reviews](../governance/access-reviews-overview.md). 

These features ease the burden of managing authorizations by providing self-service requests and automated functions to manage the lifecycle. For example, you can automatically end access based on specific criteria.

## Attribute-based controls

Attribute-based access control (ABAC) relies on metadata assigned to a user or resource as a mechanism to permit or deny access during authentication. There are several ways to create authorizations by using ABAC enforcements for data and resources through authentication. 

### Attributes assigned to users

You can use attributes assigned to users and stored in Azure AD to create authorizations for users. Users can be automatically assigned to [dynamic groups](../enterprise-users/groups-create-rule.md) based on a particular ruleset that you define during group creation. Rules are configured to add or remove a user from the group based on the evaluation of the rule against the user and one or more of their attributes. This feature has greater value when your attributes are maintained and not statically set on users from the day of creation.

### Attributes assigned to data

Azure AD allows integration of an authorization directly to the data. You can integrate authorization in multiple ways.

You can configure [authentication context](../conditional-access/concept-conditional-access-cloud-apps.md) within conditional access policies. This allows you to, for example, restrict which actions a user can take within an application or on specific data. These authentication contexts are then mapped within the data source itself. 

Data sources can be Microsoft Office files like Word and Excel, or SharePoint sites that are mapped to your authentication context. For an example of this integration, see [Manage site access based on sensitivity label](/sharepoint/authentication-context-example). 

You can also use authentication context assigned to data directly in your applications. This approach requires integration with the application code and [developers](../develop/developer-guide-conditional-access-authentication-context.md) to adopt this capability. You can use authentication context integration with Microsoft Defender for Cloud Apps to control [actions taken on data through session controls](/defender-cloud-apps/session-policy-aad). 

If you combine dynamic groups with authentication context, you can control user access mappings between the data and the user attributes. 

### Attributes assigned to resources

Azure includes [ABAC for Storage](../../role-based-access-control/conditions-overview.md), which allows the assignment of metadata tags on data stored in an Azure Blob Storage account. You can then assign this metadata to users by using role assignments to grant access.  

## Privileged access management 

The memo specifically calls out the use of privileged access management tools that use single-factor ephemeral credentials for accessing systems as insufficient. These technologies often include password vault products that accept MFA sign-in for an admin and produce a generated password for an alternate account that's used to access the system. The system is still accessed with a single factor.

Microsoft has tools for implementing [Privileged Identity Management](../privileged-identity-management/pim-configure.md) (PIM) for privileged systems with the central identity management system of Azure AD. You can enforce MFA for most privileged systems directly, whether these systems are applications, infrastructure elements, or devices. 

Azure also features PIM capabilities to step up into a specific privileged role. This requires implementation of PIM with Azure AD identities, along with identifying systems that are privileged and require additional protections to prevent lateral movement. For configuration guidance, see [Plan a Privileged Identity Management deployment](../privileged-identity-management/pim-deployment-plan.md).

## Next steps

The following articles are part of this documentation set:

[Meet identity requirements of memorandum 22-09](memo-22-09-meet-identity-requirements.md)

[Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)

[Multifactor authentication](memo-22-09-multi-factor-authentication.md)

[Other areas of Zero Trust](memo-22-09-other-areas-zero-trust.md)

For more information about Zero Trust, see:

[Securing identity with Zero Trust](/security/zero-trust/deploy/identity)
