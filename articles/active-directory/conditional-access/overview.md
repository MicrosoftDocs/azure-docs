---
title: What is Conditional Access in Azure Active Directory?
description: Learn how Conditional Access is at the heart of the new identity-driven control plane.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: overview
ms.date: 06/20/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: kvenkit

ms.collection: M365-identity-device-management
ms.custom: zt-include
---
# What is Conditional Access?

Microsoft is providing Conditional Access templates to organizations in report-only mode starting in January of 2023. We may add more policies as new threats emerge.

The modern security perimeter extends beyond an organization's network perimeter to include user and device identity. Organizations now use identity-driven signals as part of their access control decisions.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4MwZs]

Azure AD Conditional Access brings signals together, to make decisions, and enforce organizational policies. Conditional Access is Microsoft's [Zero Trust policy engine](/security/zero-trust/deploy/identity) taking signals from various sources into account when enforcing policy decisions.

:::image type="content" source="media/overview/conditional-access-signal-decision-enforcement.png" alt-text="Diagram showing concept of Conditional Access signals plus decision to enforce organizational policy.":::

Conditional Access policies at their simplest are if-then statements, if a user wants to access a resource, then they must complete an action. Example: A payroll manager wants to access the payroll application and is required to do multifactor authentication to access it.

Administrators are faced with two primary goals:

- Empower users to be productive wherever and whenever
- Protect the organization's assets

Use Conditional Access policies to apply the right access controls when needed to keep your organization secure.

> [!IMPORTANT]
> Conditional Access policies are enforced after first-factor authentication is completed. Conditional Access isn't intended to be an organization's first line of defense for scenarios like denial-of-service (DoS) attacks, but it can use signals from these events to determine access.

## Common signals

Conditional Access takes signals from various sources into account when making access decisions. 

:::image type="content" source="media/overview/conditional-access-central-policy-engine-zero-trust.png" alt-text="Diagram showing Conditional Access as the Zero Trust policy engine aggregating signals from various sources.":::

These signals include:

- User or group membership
   - Policies can be targeted to specific users and groups giving administrators fine-grained control over access.
- IP Location information
   - Organizations can create trusted IP address ranges that can be used when making policy decisions. 
   - Administrators can specify entire countries/regions IP ranges to block or allow traffic from.
- Device
   - Users with devices of specific platforms or marked with a specific state can be used when enforcing Conditional Access policies.
   - Use filters for devices to target policies to specific devices like privileged access workstations.
- Application
   - Users attempting to access specific applications can trigger different Conditional Access policies. 
- Real-time and calculated risk detection
   - Signals integration with [Azure AD Identity Protection](../identity-protection/overview-identity-protection.md) allows Conditional Access policies to identify and remediate risky users and sign-in behavior.
- [Microsoft Defender for Cloud Apps](/defender-cloud-apps/what-is-defender-for-cloud-apps)
   - Enables user application access and sessions to be monitored and controlled in real time. This integration increases visibility and control over access to and activities done within your cloud environment.

## Common decisions

- Block access
   - Most restrictive decision
- Grant access
   - Less restrictive decision, can require one or more of the following options:
      - Require multifactor authentication
      - Require authentication strength
      - Require device to be marked as compliant
      - Require Hybrid Azure AD joined device
      - Require approved client app
      - Require app protection policy
      - Require password change
      - Require terms of use

## Commonly applied policies

Many organizations have [common access concerns that Conditional Access policies can help with](concept-conditional-access-policy-common.md) such as:

- Requiring multifactor authentication for users with administrative roles
- Requiring multifactor authentication for Azure management tasks
- Blocking sign-ins for users attempting to use legacy authentication protocols
- Requiring trusted locations for Azure AD Multifactor Authentication registration
- Blocking or granting access from specific locations
- Blocking risky sign-in behaviors
- Requiring organization-managed devices for specific applications

Administrators can create policies from scratch or start from a template policy in the portal or using the Microsoft Graph API.

## Administrator experience

Administrators with the [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) role can manage policies in Azure AD. 

Conditional Access is found in the Azure portal under **Azure Active Directory** > **Security** > **Conditional Access**.

:::image type="content" source="media/overview/conditional-access-overview.png" alt-text="Screenshot of the Conditional Access overview page in the Azure portal." lightbox="media/overview/conditional-access-overview.png":::

- The **Overview** page provides a summary of policy state, users, devices, and applications as well as general and security alerts with suggestions. 
- The **Coverage** page provides a synopsis of applications with and without Conditional Access policy coverage over the last seven days. 
- The **Monitoring** page allows administrators to see a graph of sign-ins that can be filtered to see potential gaps in policy coverage.

## License requirements

[!INCLUDE [Active Directory P1 license](../../../includes/active-directory-p1-license.md)]

Customers with [Microsoft 365 Business Premium licenses](/office365/servicedescriptions/office-365-service-descriptions-technet-library) also have access to Conditional Access features. 

Risk-based policies require access to [Identity Protection](../identity-protection/overview-identity-protection.md), which is an Azure AD P2 feature.

Other products and features that may interact with Conditional Access policies require appropriate licensing for those products and features.

When licenses required for Conditional Access expire, policies aren't automatically disabled or deleted. This grants customers the ability to migrate away from Conditional Access policies without a sudden change in their security posture. Remaining policies can be viewed and deleted, but no longer updated. 

[Security defaults](../fundamentals/security-defaults.md) help protect against identity-related attacks and are available for all customers.  

[!INCLUDE [active-directory-zero-trust](../../../includes/active-directory-zero-trust.md)]

## Next steps

- [Building a Conditional Access policy piece by piece](concept-conditional-access-policies.md)
- [Plan your Conditional Access deployment](plan-conditional-access.md)
