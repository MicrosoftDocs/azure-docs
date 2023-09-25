---
title: Plan a Microsoft Entra B2B collaboration deployment
description: A guide for architects and IT administrators on securing and governing external access to internal resources 
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 4/28/2023
ms.author: gasinh
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Plan a Microsoft Entra B2B collaboration deployment

Secure collaboration with your external partners ensures they have correct access to internal resources, and for the expected duration. Learn about governance practices to reduce security risks, meet compliance goals, and ensure accurate access.

## Governance benefits

Governed collaboration improves clarity of ownership of access, reduces exposure of sensitive resources, and enables you to attest to access policy.

* Manage external organizations, and their users who access resources
* Ensure access is correct, reviewed, and time bound
* Empower business owners to manage collaboration with delegation 

## Collaboration methods

Traditionally, organizations use one of two methods to collaborate:

* Create locally managed credentials for external users, or
* Establish federations with partner identity providers (IdP)

Both methods have drawbacks. For more information, see the following table.

| Area of concern | Local credentials | Federation |
|----|---|---|
| Security | - Access continues after external user terminates<br> - UserType is Member by default, which grants too much default access | - No user-level visibility  <br> - Unknown partner security posture|
| Expense | - Password and multi-factor authentication (MFA) management<br> - Onboarding process<br> - Identity cleanup<br> - Overhead of running a separate directory | Small partners can't afford the infrastructure, lack expertise, and might use consumer email|
| Complexity | Partner users manage more credentials | Complexity grows with each new partner, and increased for partners|

Microsoft Entra B2B integrates with other tools in Microsoft Entra ID, and Microsoft 365 services. Microsoft Entra B2B simplifies collaboration, reduces expense, and increases security. 

<a name='azure-ad-b2b-benefits'></a>

## Microsoft Entra B2B benefits

- If the home identity is disabled or deleted, external users can't access resources
- User home IdP handles authentication and credential management
- Resource tenant controls guest-user access and authorization
- Collaborate with users who have an email address, but no infrastructure
- IT departments don't connect out-of-band to set up access or federation
- Guest user access is protected by the same security processes as internal users
- Clear end-user experience with no extra credentials required
- Users collaborate with partners without IT department involvement
- Guest default permissions in the Microsoft Entra directory aren't limited or highly restricted

## Next steps

* [Determine your security posture for external access](1-secure-access-posture.md)
* [Discover the current state of external collaboration in your organization](2-secure-access-current-state.md)
* [Create a security plan for external access](3-secure-access-plan.md)
* [Securing external access with groups](4-secure-access-groups.md)
* [Transition to governed collaboration with Microsoft Entra B2B collaboration](5-secure-access-b2b.md)
* [Manage external access with entitlement management](6-secure-access-entitlement-managment.md)
* [Secure access with Conditional Access policies](7-secure-access-conditional-access.md)
* [Control access with sensitivity labels](8-secure-access-sensitivity-labels.md)
* [Secure external access to Microsoft Teams, SharePoint, and OneDrive for Business](9-secure-access-teams-sharepoint.md)
* [Convert local guest accounts](10-secure-local-guest.md)
* [Onboard external users to Line-of-business applications](11-onboard-external-user.md)
