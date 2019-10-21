---
title: Common scenarios in Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn the high-level steps you should follow for common scenarios in Azure Active Directory entitlement management (Preview).
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
ms.date: 10/21/2019
ms.author: ajburnle
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want the high-level steps that I should follow so that I can quickly start using entitlement management.

---
# Common scenarios in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

There are several ways that you can configure entitlement management for your organization. However, if you're just getting started, it's helpful to understand the common scenarios for administrators, approvers, and requestors.

## Overview

### New to entitlement management
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Watch video: What is Azure AD entitlement management](https://www.youtube.com/embed/_Lss6bFrnQ8) | Any role |
> | **2.** [Watch video: How to deploy Azure AD entitlement management](https://www.youtube.com/embed/zaaKvaaYwI4) | Any role |
> | **3.** [Follow tutorial to create your first access package](entitlement-management-access-package-first.md) | Administrator |

## Delegate

### Delegate management of resources

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Watch video: Delegation from IT to department manager](https://www.microsoft.com/videoplayer/embed/RE3Lq00) | Administrator |
> | **2.** [Delegate users to catalog creator role](entitlement-management-delegate-catalog.md) | Administrator |
> | **3.** [Create a new catalog](entitlement-management-catalog-create.md#create-a-catalog) | Catalog creator |
> | **4.** [Add co-owners to the catalog](entitlement-management-catalog-create.md#add-additional-catalog-owners) | Catalog owner |
> | **5.** [Add resources to the catalog](entitlement-management-catalog-create.md#add-resources-to-a-catalog) | Catalog owner |

### Delegate management of access packages

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Watch video: Delegation from catalog owner to access package manager](https://www.microsoft.com/videoplayer/embed/RE3Lq08) | Catalog owner |
> | **2.** [Delegate users to access package manager role](entitlement-management-delegate-managers.md) | Catalog owner |
> | **3.** [Create and manage access packages](entitlement-management-access-package-create.md) | Access package manager |

## Govern access for users in your organization

### Allow employees in your organization to request access to resources

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Create a new access package](entitlement-management-access-package-create.md#start-new-access-package) | Access package manager |
> | **2.** [Add group and Teams, application, and SharePoint site roles to access package](entitlement-management-access-package-create.md#resource-roles) | Access package manager |
> | **3.** [Add a request policy to allow users in your directory to request access](entitlement-management-access-package-create.md#for-users-in-your-directory) | Access package manager |
> | **4.** [Specify expiration settings](entitlement-management-access-package-create.md#lifecycle) | Access package manager |

### Request access to resources
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal) | Requestor |
> | **2.** Find access package | Requestor |
> | **3.** [Request access](entitlement-management-request-access.md#request-an-access-package) | Requestor |

### Approve requests to resources
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Open request in My Access portal](entitlement-management-request-approve.md#open-request) | Approver |
> | **2.** [Approve or deny access request](entitlement-management-request-approve.md#approve-or-deny-request) | Approver |

### View the resources you already have access to
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal) | Requestor |
> | **2.** View active access packages | Requestor |

### Extend your existing access
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal) | Requestor |
> | **2.** Request an extension of your access to an access package | Requestor |

## Govern access for users outside your organization

### Collaborate with an external partner organization

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Read how access works for external users](entitlement-management-external-users.md#how-access-works-for-external-users) | Administrator |
> | **2.** [Review lifecycle settings for external users](entitlement-management-external-users.md#manage-the-lifecycle-of-external-users) | Administrator |
> | **3.** Add a connection to the external organization | Administrator |
> | **4.** [Create a new access package](entitlement-management-access-package-create.md#start-new-access-package) | Access package manager |
> | **5.** [Add group and Teams, application, and SharePoint site roles to access package](entitlement-management-access-package-resources.md#add-resource-roles) | Access package manager |
> | **6.** [Add a request policy to allow users not in your directory to request access](entitlement-management-access-package-request-policy.md#for-users-not-in-your-directory) | Access package manager |
> | **7.** [Specify expiration settings](entitlement-management-access-package-create.md#lifecycle) | Access package manager |
> | **8.** [Copy the link to request the access package](entitlement-management-access-package-settings.md) | Access package manager |
> | **9.** Send the link to your external partner contact partner to share with their users | Access package manager |

### Request access to resources as an external user
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** Find the access package link you received from your contact | Requestor |
> | **2.** [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal) | Requestor |
> | **3.** [Request access](entitlement-management-request-access.md#request-an-access-package) | Requestor |

### Approve requests to resources
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Open request in My Access portal](entitlement-management-request-approve.md#open-request) | Approver |
> | **2.** [Approve or deny access request](entitlement-management-request-approve.md#approve-or-deny-request) | Approver |

### View the resources your already have access to
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal) | Requestor |
> | **2.** View active access packages | Requestor |

### Extend your existing access

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal) | Requestor |
> | **2.** Request an extension of your access to an access package | Requestor |

## Day-to-day management

### Update the resources for a project

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Watch video: Day-to-day management: Things have changed](https://www.microsoft.com/videoplayer/embed/RE3LD4Z) | Access package manager |
> | **2.** Open the access package | Access package manager |
> | **3.** [Add or remove group and Teams, application, and SharePoint site roles](entitlement-management-access-package-resources.md#add-resource-roles) | Access package manager |

### Update the duration for a project
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Watch video: Day-to-day management: Things have changed](https://www.microsoft.com/videoplayer/embed/RE3LD4Z) | Access package manager |
> | **2.** Open the access package | Access package manager |
> | **3.** [Open the lifecycle settings](entitlement-management-access-package-lifecycle-policy.md#open-lifecycle-settings) | Access package manager |
> | **4.** [Update the expiration settings](entitlement-management-access-package-lifecycle-policy.md#lifecycle) | Access package manager |

### Update how access is approved for a project

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Watch video: Day-to-day management: Things have changed](https://www.microsoft.com/videoplayer/embed/RE3LD4Z) | Access package manager |
> | **2.** [Open an existing policy of request and approval settings](entitlement-management-access-package-request-policy.md#open-an-existing-policy-of-request-and-approval-settings) | Access package manager |
> | **3.** [Update the approval settings](entitlement-management-access-package-request-policy.md#approval) | Access package manager |

### Update the people for a project
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Watch video: Day-to-day management: Things have changed](https://www.microsoft.com/videoplayer/embed/RE3LD4Z) | Access package manager |
> | **2.** [Remove users that no longer need access](entitlement-management-access-package-assignments.md) | Access package manager |
> | **3.** [Open an existing policy of request and approval settings](entitlement-management-access-package-request-policy.md#open-an-existing-policy-of-request-and-approval-settings) | Access package manager |
> | **4.** [Add users that need access](entitlement-management-access-package-request-policy.md#for-users-in-your-directory) | Access package manager |
> | **5.** [Added users can request access in the My Access portal](entitlement-management-request-access.md) | Requestor |

### Directly assign specific users to an access package
> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** [Add a new policy to the access package](entitlement-management-access-package-request-policy.md#add-a-new-policy-of-request-and-approval-settings) | Access package manager |
> | **2.** [For Users who can request access, select None (administrator direct assignments only)](entitlement-management-access-package-request-policy.md#none-administrator-direct-assignments-only) | Access package manager |
> | **3.** [Directly assign specific users to the access package](entitlement-management-access-package-assignments.md#directly-assign-a-user) | Access package manager |

## Assignments and reports

### View access packages assigned to users

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** Open an access package | Administrator |
> | **2.** [View assignments](entitlement-management-access-package-assignments.md#view-who-has-an-assignment) | Administrator |

### View resources assigned to users

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | [View User assignments report](entitlement-management-reports.md) | Administrator |

### View a list of access packages a user can request

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | View report | Administrator |

## Access reviews

### Recertify access to resources

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **1.** Create an access review for the access package | Administrator |
> | **2.** Review access to the access package | Requestor |
> | **3.** Complete the access review | Administrator |

## Next steps

- [Tutorial: Create your first access package](entitlement-management-access-package-first.md)
- [Delegation and roles](entitlement-management-delegate.md)
