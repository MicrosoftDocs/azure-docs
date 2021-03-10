---
title: Create a security plan for external access to Azure Active Directory 
description: Plan the security for external access to your organization's resources..
services: active-directory
author: BarbaraSelden
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 12/18/2020
ms.author: baselden
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# 3. Create a security plan for external access 

Now that you have [determined your desired security posture security posture for external access](1-secure-access-posture.md) and [discovered your current collaboration state](2-secure-access-current-state.md), you can create an external user security and governance plan. 

This plan should document the following:

* The applications and other resources that should be grouped for access.

* The appropriate sign-in conditions for external users. These can include device state, sign-in location, client application requirements, and user risk.

* Business policies on when to review and remove access. 

* User populations to be grouped and treated similarly.

Once these areas are documented, you can use identity and access management policies from Microsoft or any other identity provider (IdP) to implement this plan.

## Document resources to be grouped for access

There are multiple ways to group resources for access. 

* Microsoft Teams groups files, conversation threads, and other resources in one place. You should formulate an external access strategy for Microsoft Teams. See [Secure access to Teams, OneDrive, and SharePoint](9-secure-access-teams-sharepoint.md).

* Entitlement Management Access Packages enable you to create a single package of applications and other resources to which you can grant access. 

* Conditional Access policies can be applied to up to 250 applications with the same access requirements.

However you will manage access, you must document which applications should be grouped together. Considerations should include:

* **Risk profile**. What is the risk to your business if a bad actor gained access to an application? Consider coding each application as high, medium, or low risk. Be cautious about grouping high-risk applications with low-risk ones. 

   * Document applications that should never be shared with external users as well.

* **Compliance Frameworks**. What if any compliance frameworks must an application meet? What are the access and review requirements?

* **Applications for specific job roles or departments**. Are there applications that should be grouped because all users in a specific job role or department will need access?

* **Collaboration-focused applications**. What collaboration-focused applications should external users be able to access? Microsoft Teams and SharePoint may need to be accessible. For productivity applications within Office 365, like Word and Excel, will external users bring their own licenses, or will you need to license them and provide access?

For each grouping of applications and resources that you want to make accessible to external users , document the following:

* A descriptive name for the group, for example *High_Risk_External_Access_Finance*. 

* Complete list of all applications and resources in the group.

* Application and resource owners and contact information.

* Whether the access is controlled by IT, or delegated to the business owner.

* Any prerequisites, for example completing a background check or a training, for access.

* Any compliance requirements for accessing the resources.

* Any additional challenges, for example requiring multi-factor-authentication for specific resources.

* How often access will be reviewed, by whom, and where it will be documented.

This type of governance plan can and should also be completed for internal access as well.

## Document sign-in conditions for external users.

As part of your plan you must determine the sign-in requirements for your external users as they access resources. Sign-in requirements are often based on the risk profile of the resources, and the risk assessment of the users’ sign-in.

Sign-in conditions are configured in [Azure AD Conditional Access](../conditional-access/overview.md) and are made up of a condition and an outcome. For example, when to require multi-factor authentication

**Resource risk-based sign-in conditions.**

| Application Risk Profile| Consider these policies for triggering multi-factor authentication |
| - |-|
| Low risk| Require MFA for specific application sets |
| Med risk| Require MFA when other risks present |
| High risk| Require MFA always for external users |


Today, you can [enforce multi-factor authentication for B2B users in your tenant](../external-identities/b2b-tutorial-require-mfa.md). 

**User- and device-based sign in conditions**.

| User or sign-in risk| Consider these policies |
| - | - |
| Device| Require compliant devices |
| Mobile apps| Require approved apps |
| Identity protection shows high risk| Require user to change password |
| Network location| Require sign in from a specific IP address range to highly confidential projects |

Today, to use device state as an input to a policy, the device must be registered or joined to your tenant. 

[Identity Protection risk-based policies](../conditional-access/howto-conditional-access-policy-risk.md) can be used. However, issues must be mitigated in the user’s home tenant.

For [network locations](../conditional-access/howto-conditional-access-policy-location.md), you can restrict access to any IP addresses range that you own. You might use this if you only want external partners accessing an application while they are on site at your organization.

[Learn more about conditional access policies](../conditional-access/overview.md).

## Document access review policies

Document your business policies for when you need to review access to resources, and when you need to remove account access for external users. Inputs to these decisions may include:

* Requirements detailed in any compliance frameworks.

* Internal business policies and processes

* User behavior

While your policies will be highly customized to your needs, consider the following:

* **Entitlement Management Access Reviews**. Use the functionality in Entitlement Management to

   * [Automatically expire access packages](../governance/entitlement-management-access-package-lifecycle-policy.md), and thus external user access to the included resources.

   * Set a [required review frequency](../governance/entitlement-management-access-reviews-create.md) for access reviews.

   * If you are using [connected organizations](../governance/entitlement-management-organization.md) to group all users from a single partner, schedule regular reviews with the business owner and the partner representative.

* **Microsoft 365 Groups**. Set a [group expiration policy](/microsoft-365/solutions/microsoft-365-groups-expiration-policy) for Microsoft 365 Groups to which external users are invited. 

* **Other options**. If external users have access outside of Entitlement Management access packages or Microsoft 365 groups, set up business process to review when accounts should be made inactive or deleted. For example:

   * Remove sign-in ability for any account not signed in to for 90 days.

   * Assess access needs and take action at the end of every project with external users.

 

## Determine your access control methods

Now that you know what you want to control access to, how those assets should be grouped for common access, and required sign-in and access review policies, you can decide on how to accomplish your plan. 

Some functionality, for example [Entitlement Management](../governance/entitlement-management-overview.md), is only available with an Azure AD Premium 2 (P2) licenses. Microsoft 365 E5 and Office 365 E5 licenses include Azure AD P2 licenses. 

Other combinations of Microsoft 365, Office 365 and Azure AD also enable some functionality for managing external users. See [Information Protection](/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance) for more information​.

> [!NOTE]
> Licenses are per user. Therefore, you can have specific users, including administrators and business owners delegated access control, at the Azure AD P2 or Microsoft 365 E5 level without enabling those licenses for all users. Your first 50,000 external users are free. If you do not enable P2 licenses for your other internal users, they will not be able to use entitlement management functionality like Access packages. 


## Govern access with Azure AD P2 and Microsoft / Office 365 E5
Azure AD P2 and Microsoft 365 E5 have the full suite of security and governance tools.

### Provisioning, signing in, reviewing access, and deprovisioning. Bolded entries are preferred methods

| Feature| Provision external users| Enforce sign-in reqs.| Review access| Deprovision access |
| - | - | - | - | - |
| Azure AD B2B Collaboration| Invite via email, OTP, self-service| | **Periodic review per partner**| Remove account<br>Restrict sign in |
| Entitlement Management| **Add user via assignment or self-service access**​| | Access reviews|**Expiration of, or removal from, access package**|
| Office 365 Groups| | | Review group memberships| Expiration or deletion of group<br> Removal form group |
| Azure AD security groups| | **Conditional access policies** (Add external users to security groups as necessary)| |  |



 ### Access to resources. Bolded entries are preferred methods

|Feature | APP & resource access| SharePoint & OneDrive access| Teams access| Email & document security |
| - |-|-|-|-|
| Entitlement Management| **Add user via assignment or self-service access​**| **Access packages**| **Access packages**|  |
| Office 365 Group| | Access to site(s) (and associated content) ​included with group| Access to teams (and associated content)​included with group|  |
| Sensitivity labels| | **Manually and automatically classify and restrict access**| **Manually and automatically classify and restrict access**| **Manually and automatically classify and restrict access** |
| Azure AD security groups| **Conditional Access policies for access not included in access packages**| | |  |


### Entitlement Management 

[Entitlement management access packages](../governance/entitlement-management-access-package-create.md) enable provisioning and deprovisioning access to Groups and Teams, Applications, and SharePoint sites. You can define which connected organizations are allowed access, whether self-service requests are allowed, and what approval workflows are required (if any) to grant access. To ensure that access doesn’t stay around longer than necessary, you can define expiration policies and access reviews for each access package. 

 

## Govern access with Azure AD P1 and Microsoft / Office 365 E3
You can achieve robust governance with Azure AD P1 and Microsoft 365 E3

### Provisioning, signing in, reviewing access, and deprovisioning


|Feature | Provision external users| Enforce sign-in requirements| Review access| Deprovision access |
| - |-|-|-|-|
| Azure AD B2B Collaboration| **Invite via email, OTP, self-service**| Direct B2B federation| **Periodic review per partner**| Remove account<br>Restrict sign in |
| Microsoft or Office 365 Groups| | | | Expiration of or deletion of group.<br>Removal from group. |
| Security groups| | **Add external users to security groups (org, team, project, etc.)**| |  |
| Conditional Access policies| | **Sign-in Conditional Access policies for external users**| |  |


 ### Access to resources.

|Feature | APP & resource access| SharePoint & OneDrive access| Teams access| Email & document security |
| - |-|-|-|-|
| Microsoft or Office 365 Groups| | **Access to site(s) included with group (and associated content)**|**Access to teams included with Microsoft 365 group (and associated content)**|  |
| Sensitivity labels| | Manually classify and restrict access| Manually classify and restrict access.| Manually classify to restrict and encrypt |
| Conditional Access Policies| Conditional Access policies for access control| | |  |
| Additional methods| | Restrict SharePoint site access granularly with security groups.<br>Disallow direct sharing.| **Restrict external invitations from within teams**|  |


### Next steps

See the following articles on securing external access to resources. We recommend you take the actions in the listed order.

1. [Determine your security posture for external access](1-secure-access-posture.md)

2. [Discover your current state](2-secure-access-current-state.md)

3. [Create a governance plan](3-secure-access-plan.md) (You are here.)

4. [Use groups for security](4-secure-access-groups.md)

5. [Transition to Azure AD B2B](5-secure-access-b2b.md)

6. [Secure access with Entitlement Management](6-secure-access-entitlement-managment.md)

7. [Secure access with Conditional Access policies](7-secure-access-conditional-access.md)

8. [Secure access with Sensitivity labels](8-secure-access-sensitivity-labels.md)

9. [Secure access to Microsoft Teams, OneDrive, and SharePoint](9-secure-access-teams-sharepoint.md)