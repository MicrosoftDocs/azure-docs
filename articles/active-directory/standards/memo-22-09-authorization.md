---
title: Memo 22-09 authorization requirements  | Azure Active Directory
description: Guidance on meeting authorization requirements outlined in US government OMB memorandum 22-09
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: barbaraselden
ms.author: baselden
manager: martinco
ms.reviewer: martinco
ms.date: 3/10/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Authorization requirements for memo 22-09

This series of articles offer guidance for employing Azure Active Directory (Azure AD) as a centralized identity management system for implementing Zero Trust principles as described by the US Federal Government’s Office of Management and Budget (OMB) [Memorandum M-22-09](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf). Throughout this document. We refer to it as “The memo.”

[Memorandum M-22-09](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf) requires specific types of enforcement within your MFA policies. Specifically, you must account for device-based, role-based, attribute-based controls, and privileged access management.

 

## Device-based controls

M-22-09 specifically requires the use of at least one device-based signal when making an authorization decision to access a system or application. This requirement can be enforced using Conditional Access and there are several device signals that can be applied during the authorization. The following table describes the signal and the requirements to retrieve the signal:

| Signal| Signal retrieval |
| - | - |
| Device must be managed| Integration with Intune or another MDM that supports this integration are required. Hybrid Azure AD joined since the device is managed by active directory also qualifies |
| Device must be compliant| Integration with Intune or other MDM’s that support this integration are required. For more information, see [Use device compliance policies to set rules for devices you manage with Intune](/mem/intune/protect/device-compliance-get-started) |
| Threat signals| Microsoft Defender for Endpoint and other EDR tools have integrations with Azure AD and Intune to send threat signals that can be used to deny access. Threat signals are part of the compliant status signal |
| Cross tenant access policies| permits an organization to trust device signals from devices belonging to other organizations. (public preview) |

##  Role-based access controls

Role based access control (RBAC role) remains an important way to enforce basic authorizations through assignments of users to a role in a particular scope. Azure AD has tools that make RBAC assignment and lifecycle management easier. This includes assigning access using [entitlement management](../governance/entitlement-management-overview.md) features, include [Access Packages](../governance/entitlement-management-access-package-create.md) and [Access Reviews](../governance/access-reviews-overview.md). These ease the burden of managing authorizations by providing self-service requests and automated functions to managed the lifecycle, for example by automatically ending access based of specific criteria.

## Attribute-based controls

Attribute based access controls rely on metadata assigned to a user or resource as a mechanism to permit or deny access during authentication. There are several ways you can create authorizations using ABAC enforcements for data and resources through authentication. 

### Attributes assigned to users

Attributes assigned to users and stored in Azure AD can be leveraged to create authorizations for users. This is achieved through the automatic assignment of users to [Dynamic Groups](../enterprise-users/groups-create-rule.md) based on a particular ruleset defined during group creation. Rules are configured to add or remove a user from the group based on the evaluation of the rule against the user and one or more of their attributes. This feature has greater value when your attributes are maintained and not statically set on users from the day of creation.

### Attributes assigned to data

Azure AD allows integration of an authorization directly to the data. You can create integrate authorization in multiple ways.

You can configure [authentication context](../conditional-access/concept-conditional-access-cloud-apps.md) within Conditional Access Policies. This allows you to, for example, restrict which actions a user can take within an application or on specific data. These authentication contexts are then mapped within the data source itself. Data sources can be office files like word and excel or SharePoint sites that use  mapped to your authentication context. An example of this integration is shown [here](%20/sharepoint/authentication-context-example). 

You can also leverage authentication context assigned to data directly in your applications. This requires integration with the application code and [developers](%20../develop/developer-guide-conditional-access-authentication-context.md) to adopt this capability. Authentication context integration with Microsoft Defender for Cloud Apps can be used to control [actions taken on data using session controls](/defender-cloud-apps/session-policy-aad). Dynamic groups mentioned previously when combined with Authentication context allow you to control user access mappings between the data and the user attributes. 

### Attributes assigned to resources

Azure includes [ABAC for Storage](../../role-based-access-control/conditions-overview.md) which allows the assignment of metadata tags on data stored in an Azure blob storage account. This metadata can then be assigned to users using role assignments to grant access. 

## Privileged Access Management 

The memo specifically calls out the use of privileged access management tools that leverage single factor ephemeral credentials for accessing systems as insufficient. These technologies often include password vault products that accept MFA logon for an admin and produce a generated password for an alternate account used to access the system. The system being accessed is still accessed with a single factor. Microsoft has tools for implementing [Privileged identity management](../privileged-identity-management/pim-configure.md) (PIM) for privileged systems with the central identity management system of Azure AD. Using the methods described in the MFA section you can enforce MFA for most privileged systems directly, whether these are applications, infrastructure, or devices. Azure also features PIM capabilities to step up into a specific privileged role. This requires implementation of PIM with Azure AD identities and identifying those systems that are privileged and require additional protections to prevent lateral movement. For more information, see the [Privileged Identity mangement deployment plan](../privileged-identity-management/pim-deployment-plan.md).

## Next steps

The following articles are a part of this documentation set:

[Meet identity requirements of Memorandum 22-09](memo-22-09-meet-identity-requirements.md)

[Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)

[Multi-factor authentication](memo-22-09-multi-factor-authentication.md)

[Authorization](memo-22-09-authorization.md)

[Other areas of Zero Trust](memo-22-09-other-areas-zero-trust.md)

Additional Zero Trust Documentation

[Securing identity with Zero Trust](/security/zero-trust/deploy/identity)
