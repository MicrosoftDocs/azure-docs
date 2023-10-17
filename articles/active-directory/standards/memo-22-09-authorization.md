---
title: Meet authorization requirements of memorandum 22-09 
description: Learn how to meet authorization requirements outlined in OMB memorandum 22-09.
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 05/01/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Meet authorization requirements of memorandum 22-09

This article series has guidance to employ Microsoft Entra ID as a centralized identity management system when implementing Zero Trust principles. See, US Office of Management and Budget (OMB) [M 22-09 Memorandum for the Heads of Executive Departments and Agencies](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf).

The memo requirements are enforcement types in multifactor authentication policies, and controls for devices, roles, attributes, and privileged access management.

## Device-based controls

A memorandum 22-09 requirement is at least one device-based signal for authorization decisions to access a system or application. Enforce the requirement by using Conditional Access. Apply several device signals during the authorization. See the following table for the signal and the requirement to retrieve the signal.

| Signal| Signal retrieval |
| - | - |
| Device is managed| Integration with Intune or another mobile device management (MDM) solution supporting integration. 
Microsoft Entra hybrid joined| Active Directory manages the device, and it qualifies. 
| Device is compliant| Integration with Intune or another MDM solution supporting the integration. See, [Create a compliance policy in Microsoft Intune](/mem/intune/protect/device-compliance-get-started). |
| Threat signals| Microsoft Defender for Endpoint and other endpoint detection and response (EDR) tools have Microsoft Entra ID and Intune integrations that send threat signals to deny access. Threat signals support the compliant status signal. |
| Cross-tenant access policies (public preview)| Trust device signals from devices in other organizations. |

##  Role-based controls

Use role-based access control (RBAC) to enforce authorizations through role assignments in a particular scope. For example, assign access by using entitlement management features, including access packages and access reviews. Manage authorizations with self-service requests and use automation to manage lifecycle. For example, automatically end access based on criteria.

Learn more:

* [What is entitlement management?](../governance/entitlement-management-overview.md) 
* [Create a new access package in entitlement management](../governance/entitlement-management-access-package-create.md)
* [What are access reviews?](../governance/access-reviews-overview.md)

## Attribute-based controls

Attribute-based access control (ABAC) uses metadata assigned to a user or resource to permit or deny access during authentication. See the following sections to create authorizations by using ABAC enforcements for data and resources through authentication. 

### Attributes assigned to users

Use attributes assigned to users, stored in Microsoft Entra ID, to create user authorizations. Users are automatically assigned to dynamic groups based on a rule set you define during group creation. Rules add or remove a user from the group based on rule evaluation against the user and their attributes. We recommend you maintain attributes and don't set static attributes on creation day.

Learn more: [Create or update a dynamic group in Microsoft Entra ID](../enterprise-users/groups-create-rule.md)

### Attributes assigned to data

With Microsoft Entra ID, you can integrate authorization to the data. See the following sections to integrate authorization. You can configure authentication in Conditional Access policies: restrict actions users take in an application or on data. These authentication policies are then mapped in the data source. 

Data sources can be Microsoft Office files like Word, Excel, or SharePoint sites mapped to authentication. Use authentication assigned to data in applications. This approach requires integration with the application code and for developers to adopt the capability. Use authentication integration with Microsoft Defender for Cloud Apps to control actions taken on data through session controls. 

Combine dynamic groups with authentication context to control user access mappings between the data and the user attributes. 

Learn more:

* [Conditional Access: Cloud apps, actions, and authentication context](../conditional-access/concept-conditional-access-cloud-apps.md)
* [Developer guide to Conditional Access authentication context](../develop/developer-guide-conditional-access-authentication-context.md)
* [Session policies](/defender-cloud-apps/session-policy-aad)

### Attributes assigned to resources

Azure includes attribute-based access control (Azure ABAC) for storage. Assign metadata tags on data stored in an Azure Blob Storage account. Assign the metadata to users by using role assignments to grant access.  

Learn more: [What is Azure attribute-based access control?](../../role-based-access-control/conditions-overview.md)

## Privileged access management 

The memo cites the inefficiency of using of privileged access management tools with single-factor ephemeral credentials to access systems. These technologies include password vaults that accept multifactor authentication sign-in for an admin. These tools generate a password for an alternate account to access the system. System access occurs with a single factor.

Microsoft tools implement Privileged Identity Management (PIM) for privileged systems with Microsoft Entra ID as the central identity management system. Enforce multifactor authentication for most privileged systems that are applications, infrastructure elements, or devices. 

Use PIM for a privileged role, when it's implemented with Microsoft Entra identities. Identify privileged systems that require protections to prevent lateral movement. 

Learn more: 

* [What is Microsoft Entra Privileged Identity Management?](../privileged-identity-management/pim-configure.md)
* [Plan a Privileged Identity Management deployment](../privileged-identity-management/pim-deployment-plan.md)

## Next steps

* [Meet identity requirements of memorandum 22-09 with Microsoft Entra ID](memo-22-09-meet-identity-requirements.md)
* [Memo 22-09 enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)
* [Meet multifactor authentication requirements of memorandum 22-09](memo-22-09-multi-factor-authentication.md)
* [Other areas of Zero Trust addressed in memorandum 22-09](memo-22-09-other-areas-zero-trust.md)
* [Securing identity with Zero Trust](/security/zero-trust/deploy/identity)
