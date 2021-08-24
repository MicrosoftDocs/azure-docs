---
title: Delegation and roles in entitlement management - Azure AD
description: Learn how to delegate access governance from IT administrators to department managers and project managers so that they can manage access themselves.
services: active-directory
documentationCenter: ''
author: ajburnle
manager: daveba
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 7/6/2021
ms.author: ajburnle
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want to delegate access governance from IT administrators to department managers and project managers so that they can manage access themselves.

---

# Delegation and roles in Azure AD entitlement management

By default, Global administrators and Identity governance administrators can create and manage all aspects of Azure AD entitlement management. However, the users in these roles may not know all the situations where access packages are required. Typically it's users within the respective departments, teams, or projects who know who they're collaborating with, using what resources, and for how long. Instead of granting unrestricted permissions to non-administrators, you can grant users the least permissions they need to do their job and avoid creating conflicting or inappropriate access rights.

This video provides an overview of how to delegate access governance from IT administrator to users who aren't administrators.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE3Lq00]

## Delegate example

To understand how you might delegate access governance in entitlement management, it helps to consider an example. Suppose your organization has the following administrator and managers.

![Delegate from IT administrator to managers](./media/entitlement-management-delegate/delegate-admin-dept-managers.png)

As the IT administrator, Hana has contacts in each department-- Mamta in Marketing, Mark in Finance, and Joe in Legal who are responsible for their department's resources and business critical content.

With entitlement management, you can delegate access governance to these non-administrators because they're the ones who know which users need access, for how long, and to which resources. Delegating to non-administrators ensures the right people are managing access for their departments.

Here is one way that Hana could delegate access governance to the marketing, finance, and legal departments.

1. Hana creates a new Azure AD security group, and adds Mamta, Mark, and Joe as members of the group.

1. Hana adds that group to the catalog creators role.

    Mamta, Mark, and Joe can now create catalogs for their departments, add resources that their departments need, and do further delegation within the catalog. They can't see each other's catalogs.

1. Mamta creates a **Marketing** catalog, which is a container of resources.

1. Mamta adds the resources that her marketing department owns to this catalog.

1. Mamta can add other people from her department as catalog owners for this catalog, which helps share the catalog management responsibilities.

1. Mamta can further delegate the creation and management of access packages in the Marketing catalog to project managers in the Marketing department. She can do this by assigning them to the access package manager role. An access package manager can create and manage access packages. 

The following diagram shows catalogs with resources for the marketing, finance, and legal departments. Using these catalogs, project managers can create access packages for their teams or projects.

![Entitlement management delegate example](./media/entitlement-management-delegate/elm-delegate.png)

After delegation, the marketing department might have roles similar to the following table.

| User | Job role | Azure AD role | Entitlement management role |
| --- | --- | --- | --- |
| Hana | IT administrator | Global administrator or Identity Governance administrator  |  |
| Mamta | Marketing manager | User | Catalog creator and Catalog owner |
| Bob | Marketing lead | User | Catalog owner |
| Jessica | Marketing project manager | User | Access package manager |

## Entitlement management roles

Entitlement management has the following roles that are specific to entitlement management.

| Entitlement management role | Role definition ID | Description |
| --- | --- | -- |
| Catalog creator | `ba92d953-d8e0-4e39-a797-0cbedb0a89e8` | Create and manage catalogs. Typically an IT administrator who isn't a Global administrator, or a resource owner for a collection of resources. The person that creates a catalog automatically becomes the catalog's first catalog owner, and can add more catalog owners. A catalog creator can’t manage or see catalogs that they don’t own and can’t add resources they don’t own to a catalog. If the catalog creator needs to manage another catalog or add resources they don’t own, they can request to be a co-owner of that catalog or resource. |
| Catalog owner | `ae79f266-94d4-4dab-b730-feca7e132178` | Edit and manage existing catalogs. Typically an IT administrator or resource owners, or a user who the catalog owner has chosen. |
| Catalog reader | `44272f93-9762-48e8-af59-1b5351b1d6b3` | View existing access packages within a catalog. |
| Access package manager | `7f480852-ebdc-47d4-87de-0d8498384a83` | Edit and manage all existing access packages within a catalog. |
| Access package assignment manager | `e2182095-804a-4656-ae11-64734e9b7ae5` | Edit and manage all existing access packages' assignments. |

Also, the chosen approver and a requestor of an access package have rights, although they're not roles.

| Right | Description |
| --- | --- |
| Approver | Authorized by a policy to approve or deny requests to access packages, though they can't change the access package definitions. |
| Requestor | Authorized by a policy of an access package to request that access package. |

The following table lists the tasks that the entitlement management roles can do.

| Task | Admin | Catalog creator | Catalog owner | Access package manager | Access package assignment manager |
| --- | :---: | :---: | :---: | :---: | :---: |
| [Delegate to a catalog creator](entitlement-management-delegate-catalog.md) | :heavy_check_mark: |  |  |  |  |
| [Add a connected organization](entitlement-management-organization.md) | :heavy_check_mark: |  |  |  |  |
| [Create a new catalog](entitlement-management-catalog-create.md) | :heavy_check_mark: | :heavy_check_mark: |  |  |  |
| [Add a resource to a catalog](entitlement-management-catalog-create.md#add-resources-to-a-catalog) | :heavy_check_mark: |  | :heavy_check_mark: |  |  |
| [Add a catalog owner](entitlement-management-catalog-create.md#add-additional-catalog-owners) | :heavy_check_mark: |  | :heavy_check_mark: |  |  |
| [Edit a catalog](entitlement-management-catalog-create.md#edit-a-catalog) | :heavy_check_mark: |  | :heavy_check_mark: |  |  |
| [Delete a catalog](entitlement-management-catalog-create.md#delete-a-catalog) | :heavy_check_mark: |  | :heavy_check_mark: |  |  |
| [Delegate to an access package manager](entitlement-management-delegate-managers.md) | :heavy_check_mark: |  | :heavy_check_mark: |  |  |
| [Remove an access package manager](entitlement-management-delegate-managers.md#remove-an-access-package-manager) | :heavy_check_mark: |  | :heavy_check_mark: |  |  |
| [Create a new access package in a catalog](entitlement-management-access-package-create.md) | :heavy_check_mark: |  | :heavy_check_mark:  | :heavy_check_mark:  |  |
| [Change resource roles in an access package](entitlement-management-access-package-resources.md) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Create and edit policies](entitlement-management-access-package-request-policy.md) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Directly assign a user to an access package](entitlement-management-access-package-assignments.md#directly-assign-a-user) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: |  :heavy_check_mark: |
| [Directly remove a user from an access package](entitlement-management-access-package-assignments.md#remove-an-assignment) | :heavy_check_mark:  |  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [View who has an assignment to an access package](entitlement-management-access-package-assignments.md#view-who-has-an-assignment) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: |  :heavy_check_mark: |
| [View an access package's requests](entitlement-management-access-package-requests.md#view-requests) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  |
| [View a request's delivery errors](entitlement-management-troubleshoot.md#view-a-requests-delivery-errors) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: |  :heavy_check_mark: |
| [Reprocess a request](entitlement-management-troubleshoot.md#reprocess-a-request) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  |
| [Cancel a pending request](entitlement-management-troubleshoot.md#cancel-a-pending-request) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [Hide an access package](entitlement-management-access-package-edit.md#change-the-hidden-setting) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Delete an access package](entitlement-management-access-package-edit.md#delete-an-access-package) | :heavy_check_mark: |  | :heavy_check_mark: | :heavy_check_mark: |  |

## Required roles to add resources to a catalog

A Global administrator can add or remove any group (cloud-created security groups or cloud-created Microsoft 365 Groups), application, or SharePoint Online site in a catalog. A User administrator can add or remove any group or application in a catalog, except for a group configured as assignable to a directory role.  For more information on role-assignable groups, reference [Create a role-assignable group in Azure Active Directory](../roles/groups-create-eligible.md).

> [!NOTE]
> Users that have been assigned the User administrator role will no longer be able to create catalogs or manage access packages in a catalog they do not own. If users in your organization have been assigned the User administrator role to configure catalogs, access packages, or policies in entitlement management, you should instead assign these users the **Identity Governance administrator** role.

For a user who isn't a global administrator, to add groups, applications, or SharePoint Online sites to a catalog, that user must have *both* an Azure AD directory role or ownership of the resource, and a and catalog owner entitlement management role for the catalog. The following table lists the role combinations that are required to add resources to a catalog. To remove resources from a catalog, you must have the same roles.

| Azure AD directory role | Entitlement management role | Can add security group | Can add Microsoft 365 Group | Can add app | Can add SharePoint Online site |
| --- | :---: | :---: | :---: | :---: | :---: |
| [Global administrator](../roles/permissions-reference.md) | n/a |  :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [User administrator](../roles/permissions-reference.md) | n/a |  :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Intune administrator](../roles/permissions-reference.md) | Catalog owner | :heavy_check_mark: | :heavy_check_mark: |  |  |
| [Exchange administrator](../roles/permissions-reference.md) | Catalog owner |  | :heavy_check_mark: |  |  |
| [Teams service administrator](../roles/permissions-reference.md) | Catalog owner |  | :heavy_check_mark: |  |  |
| [SharePoint administrator](../roles/permissions-reference.md) | Catalog owner |  | :heavy_check_mark: |  | :heavy_check_mark: |
| [Application administrator](../roles/permissions-reference.md) | Catalog owner |  |  | :heavy_check_mark: |  |
| [Cloud application administrator](../roles/permissions-reference.md) | Catalog owner |  |  | :heavy_check_mark: |  |
| User | Catalog owner | Only if group owner | Only if group owner | Only if app owner |  |

To determine the least privileged role for a task, you can also reference [Administrator roles by admin task in Azure Active Directory](../roles/delegate-by-task.md#entitlement-management).

## Manage role assignments programmatically (preview)

You can also view and update catalog creators and entitlement management catalog-specific role assignments using Microsoft Graph.  A user in an appropriate role with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission can call the Graph API to [list the role definitions](/graph/api/rbacapplication-list-roledefinitions?view=graph-rest-beta&preserve-view=true) of entitlement management, and [list role assignments](/graph/api/rbacapplication-list-roleassignments?view=graph-rest-beta&preserve-view=true) to those role definitions.

For example, to view the entitlement management-specific roles which a particular user or group has been assigned, use the Graph query to list role assignments, and provide the user or group's ID as the value of the `principalId` query filter, as in

```http
GET https://graph.microsoft.com/beta/roleManagement/entitlementManagement/roleAssignments?$filter=principalId eq '10850a21-5283-41a6-9df3-3d90051dd111'&$expand=roleDefinition&$select=id,appScopeId,roleDefinition
```

For a role that is specific to a catalog, the `appScopeId` in the response indicates the catalog in which the user is assigned a role.  Note that this response only retrieves explicit assignments of that principal to role in entitlement management, it does not return results for a user who has access rights via a directory role, or through membership in a group assigned to a role.


## Next steps

- [Delegate access governance to catalog creators](entitlement-management-delegate-catalog.md)
- [Delegate access governance to access package managers](entitlement-management-delegate-managers.md)
- [Create and manage a catalog of resources](entitlement-management-catalog-create.md)
