---
title: What is Conditional Access in Azure Active Directory?
description: Learn how Conditional Access is at the heart of the new identity driven control plane.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: overview
ms.date: 09/17/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# What is Conditional Access?

The modern security perimeter now extends beyond an organization's network to include user and device identity. Organizations can utilize these identity signals as part of their access control decisions. 

Conditional Access is the tool used by Azure Active Directory to bring signals together, to make decisions, and enforce organizational policies. Conditional Access is at the heart of the new identity driven control plane.

![Conceptual Conditional signal plus decision to get enforcement](./media/overview/conditional-access-signal-decision-enforcement.png)

Conditional Access policies at their simplest are if-then statements, if a user wants to access a resource, then they must complete an action. Example: A payroll manager wants to access the payroll application and is required to perform multi-factor authentication to access it.

Administrators are faced with two primary goals:

- Empower users to be productive wherever and whenever
- Protect the organization's assets

By using Conditional Access policies, you can apply the right access controls when needed to keep your organization secure and stay out of your user’s way when not needed.

![Conceptual Conditional Access process flow](./media/overview/conditional-access-overview-how-it-works.png)

Conditional Access policies are enforced after the first-factor authentication has been completed. Conditional Access is not intended as an organization's first line of defense for scenarios like denial-of-service (DoS) attacks, but can use signals from these events to determine access.

## Common signals

Common signals that Conditional Access can take in to account when making a policy decision include the following signals:

- User or group membership
   - Policies can be targeted to specific users and groups giving administrators fine-grained control over access.
- IP Location information
   - Organizations can create trusted IP address ranges that can be used when making policy decisions. 
   - Administrators can specify entire countries IP ranges to block or allow traffic from.
- Device
   - Users with devices of specific platforms or marked with a specific state can be used when enforcing Conditional Access policies.
- Application
   - Users attempting to access specific applications can trigger different Conditional Access policies. 
- Real-time and calculated risk detection
   - Signals integration with Azure AD Identity Protection allows Conditional Access policies to identify risky sign-in behavior. Policies can then force users to perform password changes or multi-factor authentication to reduce their risk level or be blocked from access until an administrator takes manual action.
- Microsoft Cloud App Security (MCAS)
   - Enables user application access and sessions to be monitored and controlled in real time, increasing visibility and control over access to and activities performed within your cloud environment.

## Common decisions

- Block access
   - Most restrictive decision
- Grant access
   - Least restrictive decision, can still require one or more of the following options:
      - Require multi-factor authentication
      - Require device to be marked as compliant
      - Require Hybrid Azure AD joined device
      - Require approved client app
      - Require app protection policy (preview)

## Commonly applied policies

Many organizations have common access concerns that Conditional Access policies can help with such as:

- Requiring multi-factor authentication for users with administrative roles
- Requiring multi-factor authentication for Azure management tasks
- Blocking sign-ins for users attempting to use legacy authentication protocols
- Requiring trusted locations for Azure Multi-Factor Authentication registration
- Blocking or granting access from specific locations
- Blocking risky sign-in behaviors
- Requiring organization-managed devices for specific applications

## License requirements

[!INCLUDE [Active Directory P1 license](../../../includes/active-directory-p1-license.md)]

Customers with [Microsoft 365 Business licenses](https://docs.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-business-service-description) also have access to Conditional Access features. 

## Next steps

To learn how to implement Conditional Access in your environment, see [Plan your Conditional Access deployment in Azure Active Directory](plan-conditional-access.md).

[Learn about Identity Protection](../identity-protection/overview-v2.md)

[Learn about Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/what-is-cloud-app-security)

[Learn about Microsoft Intune](https://docs.microsoft.com/intune/index)