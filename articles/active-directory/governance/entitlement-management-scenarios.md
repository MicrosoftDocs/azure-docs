---
title: Common scenarios in Azure AD entitlement management (Preview)
description: #Required; article description that is displayed in search results.
services: active-directory
documentationCenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 04/11/2019
ms.author: rolyon
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---
# Common scenarios in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

There are several ways that you can configure entitlement management for your organization. However, if you're just getting started, it's helpful to understand the common scenarios for administrators, approvers, and requestors.

## Administrator setup

### You want to allow users in your directory to request access to groups, applications, or SharePoint sites

- Users in your directory in specific groups can request access
- Time-limited access
- Approval process

> [!div class="mx-tableFixed"]
> | Step | Example | Who can perform |
> | --- | --- | --- |
> | **1.** Open entitlement management | ![Azure portal icon](./media/entitlement-management-scenarios/icon-azure-portal.png) | User admin<br/>Catalog owner |
> | **2.** [Create an access package in a catalog](entitlement-management-access-package-create.md#start-new-access-package) | ![Create an access package](./media/entitlement-management-scenarios/icon-access-package.png) | User admin<br/>Catalog owner |
> | **3.** [Add resource roles to access package](entitlement-management-access-package-create.md#resource-roles)<ul><li>Groups</li><li>Applications</li><li>SharePoint sites</li></ul> | ![Add resource roles](./media/entitlement-management-scenarios/icon-resource-roles.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **4.** [Create a policy](entitlement-management-access-package-create.md#policy)<ul><li>For users in your directory</li><li>Require approval</li><li>Expiration settings</li></ul> | ![Add policy](./media/entitlement-management-scenarios/icon-policy.png) | User admin<br/>Catalog owner<br/>Access package manager |

### You want to allow users in your directory to request access to groups, applications, or SharePoint sites managed by another department

- Users in your directory in specific groups can request access
- Another department will manage the resources that can be requested
- Time-limited access
- Approval process

> [!div class="mx-tableFixed"]
> | Step | Example | Who can perform |
> | --- | --- | --- |
> | **1.** Open entitlement management | ![Azure portal icon](./media/entitlement-management-scenarios/icon-azure-portal.png) | User admin<br/>Catalog creator |
> | **2.** If necessary, create a new catalog for the department |![Create catalog](./media/entitlement-management-scenarios/icon-catalog.png) | User admin<br/>Catalog creator |
> | **3.** Add catalog owners |  | User admin<br/>Catalog owner |
> | **4.** Add resources to catalog<ul><li>Groups</li><li>Applications</li><li>SharePoint sites</li></ul> | ![Add resources to catalog](./media/entitlement-management-scenarios/icon-resources.png) | User admin<br/>Catalog owner |
> | **5.** Create an access package in catalog | ![Create an access package](./media/entitlement-management-scenarios/icon-access-package.png) | User admin<br/>Catalog owner |
> | **6.** Add resource roles to access package | ![Add resource roles](./media/entitlement-management-scenarios/icon-resource-roles.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **7.** Create a policy<ul><li>For users in your directory</li><li>Require approval</li><li>Expiration settings</li></ul> | ![Add policy](./media/entitlement-management-scenarios/icon-policy.png) | User admin<br/>Catalog owner<br/>Access package manager |

### You want to directly assign users in your directory to access to groups, applications, or SharePoint sites

- No users in your directory can request access
- Time-limited access
- No approval process

> [!div class="mx-tableFixed"]
> | Step | Example | Who can perform |
> | --- | --- | --- |
> | **1.** Open entitlement management | ![Azure portal icon](./media/entitlement-management-scenarios/icon-azure-portal.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **2.** Open the access package | ![Add resource roles](./media/entitlement-management-scenarios/icon-resource-roles.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **3.** Create a policy<ul><li>None (admin direct assignments only)</li><li>Expiration settings</li></ul> | ![Add policy](./media/entitlement-management-scenarios/icon-policy.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **4.** Create an assignment to add the users to the access package<ul><li>Start and end dates</li></ul> | ![Add policy](./media/entitlement-management-scenarios/icon-policy.png) | User admin<br/>Catalog owner<br/>Access package manager |

### You want to allow specific users from your business partners to request access to groups, applications, or SharePoint sites

- Specific users from your business partners (including users not yet in your directory) can request access
- Self-service request
- Approval process

### You want to allow users from your business partners to request access to groups, applications, or SharePoint sites

- Any users from your business partners (including users not yet in your directory) can request access
- Self-service request
- Colleagues can share request link with peers
- Approval process

> [!div class="mx-tableFixed"]
> | Step | Example | Who can perform |
> | --- | --- | --- |
> | **1.** Open entitlement management | ![Azure portal icon](./media/entitlement-management-scenarios/icon-azure-portal.png) | User admin<br/>Catalog owner |
> | **2.** Add resources to a catalog<ul><li>Groups</li><li>Applications</li><li>SharePoint sites</li></ul> | ![Add resources to catalog](./media/entitlement-management-scenarios/icon-resources.png) | User admin<br/>Catalog owner |
> | **3.** Create an access package in catalog | ![Create an access package](./media/entitlement-management-scenarios/icon-access-package.png) | User admin<br/>Catalog owner |
> | **4.** Add resource roles to access package | ![Add resource roles](./media/entitlement-management-scenarios/icon-resource-roles.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **5.** Create a policy<ul><li>For users not in your directory</li><li>Require approval</li><li>Expiration settings</li></ul> | ![Add policy](./media/entitlement-management-scenarios/icon-policy.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **6.** Send **My Access portal link** to request access package to your business partner<ul><li>Business partner can share link with their users</li></ul> |  | User admin<br/>Catalog owner<br/>Access package manager |

### You want to allow anyone to request access to groups, applications, or SharePoint sites

- Anyone (including social) can request access, for example to submit a contract bid
- Self-service request
- Colleagues can share request link with peers
- Approval process

### You want to allow users from your business partners to sign up for an Azure AD account

- Any users from your business partners not yet in your directory to sign up for an Azure AD account in your directory
- Self-service sign up
- Automatically removed after a predetermined time

## Administrator updates

### You want to change the available groups, applications, or SharePoint sites

> [!div class="mx-tableFixed"]
> | Step | Example | Who can perform |
> | --- | --- | --- |
> | **1.** Open entitlement management | ![Azure portal icon](./media/entitlement-management-scenarios/icon-azure-portal.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **2.** Open the access package | ![Add resource roles](./media/entitlement-management-scenarios/icon-resource-roles.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **3.** Add or remove resource roles | ![Add resource roles](./media/entitlement-management-scenarios/icon-resource-roles.png) | User admin<br/>Catalog owner<br/>Access package manager |

## Administrator audit

### You want to view who has an assignment to groups, applications, or SharePoint sites

- View which users have access to an access package
- View which users access has expired

> [!div class="mx-tableFixed"]
> | Step | Example | Who can perform |
> | --- | --- | --- |
> | **1.** Open entitlement management | ![Azure portal icon](./media/entitlement-management-scenarios/icon-azure-portal.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **2.** Open an access package | ![Add resource roles](./media/entitlement-management-scenarios/icon-resource-roles.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **2.** View **Assignments** |  | User admin<br/>Catalog owner<br/>Access package manager |

### You want to view groups, applications, or SharePoint sites a user has access to

- Understand how a user got access to a resource
- When they request and who approved

> [!div class="mx-tableFixed"]
> | Step | Example | Who can perform |
> | --- | --- | --- |
> | **1.** Open entitlement management | ![Azure portal icon](./media/entitlement-management-scenarios/icon-azure-portal.png) | User admin<br/>Catalog owner<br/>Access package manager |
> | **2.** View **User assignments report** |  | User admin<br/>Catalog owner<br/>Access package manager |


## Approvers

### You want to approve requests to access groups, applications, or SharePoint sites

- View requests pending approval
- Approve or deny requests to access packages

> [!div class="mx-tableFixed"]
> | Step | Example | Who can perform |
> | --- | --- | --- |
> | **1.** Sign in to the My Access portal | ![My Access portal icon](./media/entitlement-management-scenarios/icon-myaccess-portal.png) | Approver |
> | **2.** Find access package in pending approvals |  | Approver |
> | **3.** Approve access request | ![Approve access](./media/entitlement-management-scenarios/icon-approve-access.png) | Approver |


## Requestors

### You want to request access to groups, applications, or SharePoint sites

- View available access packages and make requests

> [!div class="mx-tableFixed"]
> | Step | Example | Who can perform |
> | --- | --- | --- |
> | **1.** Sign in to the My Access portal | ![My Access portal icon](./media/entitlement-management-scenarios/icon-myaccess-portal.png) | Requestor |
> | **2.** Find access package |  | Requestor |
> | **3.** Request access | ![Request access](./media/entitlement-management-scenarios/icon-request-access.png) | Requestor |

### You want to request access to groups, applications, or SharePoint sites with a direct link

> [!div class="mx-tableFixed"]
> | Step | Example | Who can perform |
> | --- | --- | --- |
> | **1.** Open the access package link you received |  | Requestor |
> | **2.** Sign in to the My Access portal | ![My Access portal icon](./media/entitlement-management-scenarios/icon-myaccess-portal.png) | Requestor |
> | **3.** Request access | ![Request access](./media/entitlement-management-scenarios/icon-request-access.png) | Requestor |

### You want to view the groups, applications, or SharePoint sites you already have access to

### You want to view history of your requests

### You want to share a resource request link with a colleague


## Next steps

- [Tutorial: Create your first access package](entitlement-management-access-package-first.md)
