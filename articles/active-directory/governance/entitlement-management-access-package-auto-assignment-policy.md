---
title: Configure an automatic assignment policy for an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to configure automatic assignments based on rules for an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: markwahl-msft
manager: karenhoran
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 07/25/2022
ms.author: owinfrey
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about how I can edit an access package to include a policy for users to get and lose access package assignments automatically, without them needing to request access.

---
# Configure an automatic assignment policy for an access package in Azure AD entitlement management

You can use rules to determine access package assignment based on user properties In Azure Active Directory (Azure AD), part of Microsoft Entra. As an administrator, you can establish a policy for assignments in an access package, that creates and removes assignments automatically.   When an automatic assignment policy is created, user attributes are evaluated for matches with the membership rule. When an attribute changes for a user, these automatic assignment policy rules in the access packages are processed for membership changes. Assignments to users added or removed if they meet the conditions for a group.

This article describes how to create an access package automatic assignment policy for an existing access package.

## Create an automatic assignment policy (Preview)

To create a policy for an access package, you need to start from the access package's policy tab. Follow these steps to create a new policy for an access package.

**Prerequisite role:** Global administrator, Identity Governance administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Policies** and then **Add policy** to create a new policy.

1. Provide a dynamic membership rule, using the [membership rule builder](../enterprise-users/groups-dynamic-membership.md) or the rule syntax text box.

   > [!NOTE]
   > The rule builder might not be able to display some rules constructed in the text box. For more information, see [rule builder in the Azure portal](/enterprise-users/groups-create-rule.md#rule-builder-in-the-azure-portal).

1. Click **Next** to open the **Review** tab.

1. Type a name and a description for the policy.

1. Save the policy.

> [!NOTE]
> In this preview, Entitlement management will automatically create a dynamic security group corresponding to each policy, in order to evaluate the users in scope. This group should not be modified except by Entitlement Management itself.  This group may also be modified or deleted automatically by Entitlement Management, so don't use this group for other applications or scenarios.

1. Azure AD will evaluate the users in the organization which are in scope of this rule, and create assignments for those users who don't already have assignments to the access package.

## Creating an automatic assignment policy programmatically (Preview)

You can also create a policy using Microsoft Graph. A user in an appropriate role with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission, or an application in a catalog role or with the `EntitlementManagement.ReadWrite.All` permission, can call the [create an accessPackageAssignmentPolicy](/graph/api/entitlementmanagement-post-assignmentpolicies?tabs=http&view=graph-rest-1.0&preserve-view=true) API.  In your [request payload](/graph/api/resources/accesspackageassignmentpolicy?view=graph-rest-1.0), include the `displayName`, `description`, `specificAllowedTargets`, `automaticRequestSettings` and `accessPackage` properties.

## Next steps

- [View assignments for an access package](entitlement-management-access-package-assignments.md)
