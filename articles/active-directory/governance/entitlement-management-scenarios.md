---
title: Common scenarios in entitlement management - Azure AD
description: Learn the high-level steps you should follow for common scenarios in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: msaburnley
manager: daveba
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 10/28/2019
ms.author: ajburnle
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want the high-level steps that I should follow so that I can quickly start using entitlement management.

---
# Common scenarios in Azure AD entitlement management

There are several ways that you can configure entitlement management for your organization. However, if you're just getting started, it's helpful to understand the common scenarios for administrators, catalog owners, access package managers, approvers, and requestors.

## Delegate

### Administrator: Delegate management of resources

1. [Watch video: Delegation from IT to department manager](https://www.microsoft.com/videoplayer/embed/RE3Lq00)
1. [Delegate users to catalog creator role](entitlement-management-delegate-catalog.md)

### Catalog creator: Delegate management of resources

- [Create a new catalog](entitlement-management-catalog-create.md#create-a-catalog)

### Catalog owner: Delegate management of resources

1. [Add co-owners to the catalog](entitlement-management-catalog-create.md#add-additional-catalog-owners)
1. [Add resources to the catalog](entitlement-management-catalog-create.md#add-resources-to-a-catalog)

### Catalog owner: Delegate management of access packages

1. [Watch video: Delegation from catalog owner to access package manager](https://www.microsoft.com/videoplayer/embed/RE3Lq08)
1. [Delegate users to access package manager role](entitlement-management-delegate-managers.md)

## Govern access for users in your organization

### Access package manager: Allow employees in your organization to request access to resources

1. [Create a new access package](entitlement-management-access-package-create.md#start-new-access-package)
1. [Add groups, Teams, applications, or SharePoint sites to access package](entitlement-management-access-package-create.md#resource-roles)
1. [Add a request policy to allow users in your directory to request access](entitlement-management-access-package-create.md#for-users-in-your-directory)
1. [Specify expiration settings](entitlement-management-access-package-create.md#lifecycle)

### Requestor: Request access to resources

1. [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal)
1. Find access package
1. [Request access](entitlement-management-request-access.md#request-an-access-package)

### Approver: Approve requests to resources

1. [Open request in My Access portal](entitlement-management-request-approve.md#open-request)
1. [Approve or deny access request](entitlement-management-request-approve.md#approve-or-deny-request)

### Requestor: View the resources you already have access to

1. [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal)
1. View active access packages

## Govern access for users outside your organization

### Administrator: Collaborate with an external partner organization

1. [Read how access works for external users](entitlement-management-external-users.md#how-access-works-for-external-users)
1. [Review settings for external users](entitlement-management-external-users.md#settings-for-external-users)
1. [Add a connection to the external organization](entitlement-management-organization.md)

### Access package manager: Collaborate with an external partner organization

1. [Create a new access package](entitlement-management-access-package-create.md#start-new-access-package)
1. [Add groups, Teams, applications, or SharePoint sites to access package](entitlement-management-access-package-resources.md#add-resource-roles)
1. [Add a request policy to allow users not in your directory to request access](entitlement-management-access-package-request-policy.md#for-users-not-in-your-directory)
1. [Specify expiration settings](entitlement-management-access-package-create.md#lifecycle)
1. [Copy the link to request the access package](entitlement-management-access-package-settings.md)
1. Send the link to your external partner contact partner to share with their users

### Requestor: Request access to resources as an external user

1. Find the access package link you received from your contact
1. [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal)
1. [Request access](entitlement-management-request-access.md#request-an-access-package)

### Approver: Approve requests to resources

1. [Open request in My Access portal](entitlement-management-request-approve.md#open-request)
1. [Approve or deny access request](entitlement-management-request-approve.md#approve-or-deny-request)

### Requestor: View the resources your already have access to

1. [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal)
1. View active access packages

## Day-to-day management

### Access package manager: Update the resources for a project

1. [Watch video: Day-to-day management: Things have changed](https://www.microsoft.com/videoplayer/embed/RE3LD4Z)
1. Open the access package
1. [Add or remove groups, Teams, applications, or SharePoint sites](entitlement-management-access-package-resources.md#add-resource-roles)

### Access package manager: Update the duration for a project

1. [Watch video: Day-to-day management: Things have changed](https://www.microsoft.com/videoplayer/embed/RE3LD4Z)
1. Open the access package
1. [Open the lifecycle settings](entitlement-management-access-package-lifecycle-policy.md#open-lifecycle-settings)
1. [Update the expiration settings](entitlement-management-access-package-lifecycle-policy.md#lifecycle)

### Access package manager: Update how access is approved for a project

1. [Watch video: Day-to-day management: Things have changed](https://www.microsoft.com/videoplayer/embed/RE3LD4Z)
1. [Open an existing policy of request and approval settings](entitlement-management-access-package-request-policy.md#open-an-existing-policy-of-request-and-approval-settings)
1. [Update the approval settings](entitlement-management-access-package-request-policy.md#approval)

### Access package manager: Update the people for a project

1. [Watch video: Day-to-day management: Things have changed](https://www.microsoft.com/videoplayer/embed/RE3LD4Z)
1. [Remove users that no longer need access](entitlement-management-access-package-assignments.md)
1. [Open an existing policy of request and approval settings](entitlement-management-access-package-request-policy.md#open-an-existing-policy-of-request-and-approval-settings)
1. [Add users that need access](entitlement-management-access-package-request-policy.md#for-users-in-your-directory)

### Access package manager: Directly assign specific users to an access package

1. [If users need different lifecycle settings, add a new policy to the access package](entitlement-management-access-package-request-policy.md#add-a-new-policy-of-request-and-approval-settings)
1. [Directly assign specific users to the access package](entitlement-management-access-package-assignments.md#directly-assign-a-user)

## Assignments and reports

### Administrator: View who has assignments to an access package

1. Open an access package
1. [View assignments](entitlement-management-access-package-assignments.md#view-who-has-an-assignment)
1. [Archive reports and logs](entitlement-management-logs-and-reporting.md)

### Administrator: View resources assigned to users

1. [View access packages for a user](entitlement-management-reports.md#view-access-packages-for-a-user)
1. [View resource assignments for a user](entitlement-management-reports.md#view-resource-assignments-for-a-user)

## Programmatic administration

You can also manage access packages, catalogs, policies, requests and assignments using Microsoft Graph.  A user in an appropriate role with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission can call the [entitlement management API](https://docs.microsoft.com/graph/api/resources/entitlementmanagement-root?view=graph-rest-beta).

## Next steps

- [Delegation and roles](entitlement-management-delegate.md)
- [Request process and email notifications](entitlement-management-process.md)
