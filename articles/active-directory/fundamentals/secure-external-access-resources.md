---
title: Plan an Azure Active Directory B2B collaboration deployment
description: A guide for architects and IT administrators on securing and governing external access to internal resources 
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 11/03/2022
ms.author: gasinh
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Plan an Azure Active Directory B2B collaboration deployment

Secure collaboration with external partners ensures that the right external partners have appropriate access to internal resources for the right length of time. Through a holistic security and governance approach, you can reduce security risks, meet compliance goals, and ensure that you know who has access.

Ungoverned collaboration leads to a lack of clarity on ownership of access, and the possibility of sensitive resources being exposed. Moving to secure and governed collaboration can ensure that there are clear lines of ownership and accountability for external users’ access. This includes:

* Managing the external organizations, and users within them, that have access to resources.

* Ensuring that access is appropriate, reviewed, and time bound where appropriate.

* Empowering business owners to manage collaboration within IT-created guard rails via delegation.

Where you have a compliance requirement, governed collaboration enables you to attest to the appropriateness of access. 

Traditionally, organizations have used one of the two methods to collaborate:

1. Creating locally managed credentials for external users, or
2. Establishing federations with partner Identity Providers. 
 
Both methods have significant drawbacks in themselves.  

| Area of concern | Local credentials | Federation |
|:--------------|:-------------------|:----------------------|
| Security | - Access continues after external user terminated<br> - Usertype is “member” by default which grants too much default access | - No user level visibility  <br> - Unknown partner security posture|
| Expense | - Password + Multi-Factor Authentication management<br> - Onboarding process<br> - Identity cleanup<br> - Overhead of running a separate directory | - Small partners cannot afford the infrastructure<br> - Small partners do not have the expertise<br> - Small Partners might only have consumer emails (no IT) |
| Complexity | - Partner users need to manage an additional set of credentials | - Complexity grows with each new partner<br> - Complexity grows on partners’ side as well |


Microsoft offers comprehensive suites of tools for secure external access.  Azure Active Directory (Azure AD) B2B Collaboration is at the center of any external collaboration plan. Azure AD B2B can integrate with other tools in Azure AD, and tools in Microsoft 365 services, to help secure and manage your external access.

Azure AD B2B simplifies collaboration, reduces expense, and increases security compared to traditional collaboration methods. Benefits of Azure AD B2B include: 

- External users cannot access resources if the home identity is disabled or deleted. 

- Authentication and credential management are handled by the user’s home identity provider. 

- Resource tenant controls all access and authorization of guest users. 

- Can collaborate with any user who has an email address without need for partner infrastructure. 

- No need for IT departments to connect out-of-band to set up access/federation. 

- Guest user access is protected by the same enterprise-grade security as internal users. 

- Easy end user experience with no additional credentials needed. 

- Users can collaborate easily with partners without needing their IT departments involvement. 

- No need for Guest default permissions in the Azure AD directory can be limited or highly restricted. 

This document set is designed to enable you to move from ad hoc or loosely governed external collaboration to a more secure state. 

## Next steps

See the following articles on securing external access to resources. We recommend you take the actions in the listed order.


1. [Determine your security posture for external access](1-secure-access-posture.md)

2. [Discover your current state](2-secure-access-current-state.md)

3. [Create a governance plan](3-secure-access-plan.md)

4. [Use groups for security](4-secure-access-groups.md)

5. [Transition to Azure AD B2B](5-secure-access-b2b.md)

6. [Secure access with Entitlement Management](6-secure-access-entitlement-managment.md)

7. [Secure access with Conditional Access policies](7-secure-access-conditional-access.md)

8. [Secure access with Sensitivity labels](8-secure-access-sensitivity-labels.md)

9. [Secure access to Microsoft Teams, OneDrive, and SharePoint](9-secure-access-teams-sharepoint.md)

10. [Secure local guest accounts](10-local-guest-to-b2b.md)
