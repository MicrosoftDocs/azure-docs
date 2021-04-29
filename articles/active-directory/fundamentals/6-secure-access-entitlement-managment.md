---
title: Manage external access with Azure Active Directory Entitlement Management 
description: How to use Azure Active Directory Entitlement Management as a part of your overall external access security plan.
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

# Manage external access with Entitlement Management 


[Entitlement management](../governance/entitlement-management-overview.md) is an identity governance capability that enables organizations to manage identity and access lifecycle at scale by automating access request workflows, access assignments, reviews, and expiration. Entitlement management allows delegated non-admins to create [access packages](../governance/entitlement-management-overview.md) that external users from other organizations can request access to. One and multi-stage approval workflows can be configured to evaluate requests, and [provision](../governance/what-is-provisioning.md) users for time-limited access with recurring reviews. Entitlement management enables policy-based provisioning and deprovisioning of external accounts.

## Key concepts for enabling Entitlement Management

The following key concepts are important to understand for entitlement management.

### Access Packages

An [access package](../governance/entitlement-management-overview.md) is the foundation of entitlement management. Access packages are groupings of policy-governed resources a user needs to collaborate on a project or do other tasks. For example, an access package might include:

* access to specific SharePoint sites.

* enterprise applications including your custom in-house and SaaS apps like Salesforce.

* Microsoft Teams channels.

* Microsoft 365 Groups. 

### Catalogs

Access packages reside in [catalogs](../governance/entitlement-management-catalog-create.md). You create a catalog when you want to group related resources and access packages and delegate the ability to manage them. First you add resources to a catalog, and then you can add those resources to access packages. For example, you might want to create a “Finance” catalog, and [delegate its management](../governance/entitlement-management-delegate.md) to a member of the finance team. That person can then [add resources](../governance/entitlement-management-catalog-create.md), create access packages, and manage access approval to those packages.

The following diagram shows a typical governance lifecycle for an external user gaining access to an access package that has an expiration.

![A diagram of the external user governance cycle.](media/secure-external-access/6-governance-lifecycle.png)

### Self-service external access

You can surface access packages through the [Azure AD My Access Portal](../governance/entitlement-management-request-access.md) to enable external users to request access. Policies determine who can request an access package. You specify who is allowed to request the access package:

* Specific [connected organizations](../governance/entitlement-management-organization.md)

* All configured connected organizations

* All users from any organization

* Member or guest users already in your tenant

### Approvals   
‎Access packages can include mandatory approval for access. **Always implement approval processes for external users**. Approvals can be a single or multi-stage approval. Approvals are determined by policies. If both internal and external users need to access the same package, you'll likely set up different access policies for different categories of connected organizations, and for internal users.

### Expiration  
‎Access packages can include an expiration date. Expiration can be set to a specific day or give the user a specific number of days for access. When the access package expires, and the user has no other access, the B2B guest user object representing the user can be deleted or blocked from signing in. We recommend that you enforce expiration on access packages for external users. Not all access packages have expirations. For those that don't, ensure that you perform access reviews.

### Access reviews

Access packages can require periodic [access reviews](../governance/manage-guest-access-with-access-reviews.md), which require the package owner or a designee to attest to the continued need for users’ access. 

Before you set up your review, determine the following.

* Who

   * What are the criteria for continued access?

   * Who are the specified reviewers?

* How often should scheduled reviews occur?

   * Built in options include monthly, quarterly, bi-annually or annually. 

   * We recommend quarterly or more frequently for packages that support external access. 

 

> [!IMPORTANT]
> Access reviews of access packages only review access granted through Entitlement Management. You must therefore set up other processes to review any access provided to external users outside of Entitlement Management.

For more information about access reviews, see [Planning an Azure AD Access Reviews deployment](../governance/deploy-access-reviews.md).

## Using automation in Entitlement Management

You can perform [Entitlement Management functions by using Microsoft Graph](/graph/tutorial-access-package-api), including

* [Manage access packages](/graph/api/resources/accesspackage?view=graph-rest-beta&preserve-view=true)

* [Manage access reviews](/graph/api/resources/accessreviewsv2-root?view=graph-rest-beta&preserve-view=true)

* [Manage connected organizations](/graph/api/resources/connectedorganization?view=graph-rest-beta&preserve-view=true)

* [Manage Entitlement Management settings](/graph/api/resources/entitlementmanagementsettings?view=graph-rest-beta&preserve-view=true)

## Recommendations 

We recommend the practices to govern external access with Entitlement Management.

**For projects with one or more business partners, [Create and use access packages](../governance/entitlement-management-access-package-create.md) to onboard and provision those partner’s users access to resources**. 

* If you already have B2B users in your directory, you can also directly assign them to the appropriate access packages.

* You can assign access in the [Azure portal](../governance/entitlement-management-access-package-assignments.md), or via [Microsoft Graph](/graph/api/resources/accesspackageassignmentrequest?view=graph-rest-beta&preserve-view=true).

**Use your Identity Governance settings to remove users from your directory when their access packages expire**.

![Screenshot of configuring manage the lifecycle of external users.](media/secure-external-access/6-manage-external-lifecycle.png)

These settings only apply to users who were onboarded through Entitlement Management.

**[Delegate management of catalogs and access packages](../governance/entitlement-management-delegate.md) to business owners, who have more information on who should access**.

![Screenshot of configuring a catalog.](media/secure-external-access/6-catalog-management.png)

**‎[Enforce expiration of access packages](../governance/entitlement-management-access-package-lifecycle-policy.md) to which external users have access.**


![Screenshot of configuring access package expiration.](media/secure-external-access/6-access-package-expiration.png)

* If you know the end date of a project-based access package, use the On Date to set the specific date. 

* Otherwise we recommend the expiration be no longer 365 days, unless it is known to be a multi-year engagement.

* Allow users to extend access.

* Require approval to grant the extension.

**[Enforce access reviews of packages](../governance/manage-guest-access-with-access-reviews.md) to avoid inappropriate access for guests.**

![Screenshot of creating a new access package.](media/secure-external-access/6-new-access-package.png)

* Enforce reviews quarterly.

* For compliance-sensitive projects, set the reviewers to be specific reviewers, rather than self-review for external users. The users who are access package managers are a good place to start for reviewers. 

* For less sensitive projects, having the users self-review will reduce the burden on the organization to remove access from users who are no longer with their home organization.

For more information, see [Govern access for external users in Azure AD Entitlement Management](../governance/entitlement-management-external-users.md) 

### Next steps

See the following articles on securing external access to resources. We recommend you take the actions in the listed order.

1. [Determine your security posture for external access](1-secure-access-posture.md)

2. [Discover your current state](2-secure-access-current-state.md)

3. [Create a governance plan](3-secure-access-plan.md)

4. [Use groups for security](4-secure-access-groups.md)

5. [Transition to Azure AD B2B](5-secure-access-b2b.md)

6. [Secure access with Entitlement Management](6-secure-access-entitlement-managment.md) (You are here.)

7. [Secure access with Conditional Access policies](7-secure-access-conditional-access.md)

8. [Secure access with Sensitivity labels](8-secure-access-sensitivity-labels.md)

9. [Secure access to Microsoft Teams, OneDrive, and SharePoint](9-secure-access-teams-sharepoint.md)

 

