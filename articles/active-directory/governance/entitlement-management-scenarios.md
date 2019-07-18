---
title: Common scenarios in Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn the high-level steps you should follow for common scenarios in Azure Active Directory entitlement management (Preview).
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
ms.date: 04/23/2019
ms.author: rolyon
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

## Administrators

### I'm new to entitlement management and I want help with getting started

> [!div class="mx-tableFixed"]
> | Steps | Example |
> | --- | --- |
> | [Follow tutorial to create your first access package](entitlement-management-access-package-first.md) | [![Azure portal icon](./media/entitlement-management-scenarios/azure-portal.png)](./media/entitlement-management-scenarios/azure-portal-expanded.png#lightbox) |

### I want to allow users in my directory to request access to groups, applications, or SharePoint sites

> [!div class="mx-tableFixed"]
> | Steps | Example |
> | --- | --- |
> | **1.** [Create a new access package in a catalog](entitlement-management-access-package-create.md#start-new-access-package) | ![Create an access package](./media/entitlement-management-scenarios/access-package.png) |
> | **2.** [Add resource roles to access package](entitlement-management-access-package-edit.md#add-resource-roles)<ul><li>Groups</li><li>Applications</li><li>SharePoint sites</li></ul> | ![Add resource roles](./media/entitlement-management-scenarios/resource-roles.png) |
> | **3.** [Add a policy](entitlement-management-access-package-edit.md#policy-for-users-in-your-directory)<ul><li>For users in your directory</li><li>Require approval</li><li>Expiration settings</li></ul> | ![Add policy](./media/entitlement-management-scenarios/policy.png) |

### I want to allow users from my business partners directory (including users not yet in my directory) to request access to groups, applications, or SharePoint sites

> [!div class="mx-tableFixed"]
> | Steps | Example |
> | --- | --- |
> | **1.** [Create a new access package in a catalog](entitlement-management-access-package-create.md#start-new-access-package) | ![Create an access package](./media/entitlement-management-scenarios/access-package.png) |
> | **2.** [Add resource roles to access package](entitlement-management-access-package-edit.md#add-resource-roles) | ![Add resource roles](./media/entitlement-management-scenarios/resource-roles.png) |
> | **3.** [Add a policy for external users](entitlement-management-access-package-edit.md#policy-for-users-not-in-your-directory)<ul><li>For users not in your directory</li><li>Require approval</li><li>Expiration settings</li></ul> | ![Add policy for external users](./media/entitlement-management-scenarios/policy-external.png) |
> | **4.** [Send the My Access portal link to request the access package to your business partner](entitlement-management-access-package-edit.md#copy-my-access-portal-link)<ul><li>Business partner can share link with their users</li></ul> |  |

### I want to change the groups, applications, or SharePoint sites in an access package

> [!div class="mx-tableFixed"]
> | Steps | Example |
> | --- | --- |
> | **1.** Open the access package | ![Add resource roles](./media/entitlement-management-scenarios/resource-roles.png) |
> | **2.** [Add or remove resource roles](entitlement-management-access-package-edit.md#add-resource-roles) | ![Add resource roles](./media/entitlement-management-scenarios/resource-roles-add.png) |

### I want to view who has an assignment to groups, applications, or SharePoint sites

> [!div class="mx-tableFixed"]
> | Steps | Example |
> | --- | --- |
> | **1.** Open an access package | ![Add resource roles](./media/entitlement-management-scenarios/resource-roles.png) |
> | **2.** [View Assignments](entitlement-management-access-package-edit.md#view-who-has-an-assignment)<ul><li>View which users have access to an access package</li><li>View which user's access has expired</li></ul> |  |

### I want to view groups, applications, or SharePoint sites a user has access to

> [!div class="mx-tableFixed"]
> | Steps | Example |
> | --- | --- |
> | [View User assignments report](entitlement-management-reports.md)<ul><li>View when they requested and who approved</li></ul> |  |

## Approvers

### I want to approve requests to access groups, applications, or SharePoint sites

> [!div class="mx-tableFixed"]
> | Steps | Example |
> | --- | --- |
> | **1.** [Open request in My Access portal](entitlement-management-request-approve.md#open-request) | [![My Access portal icon](./media/entitlement-management-scenarios/my-access-portal.png)](./media/entitlement-management-scenarios/my-access-portal-expanded.png#lightbox) |
> | **2.** [Approve access request](entitlement-management-request-approve.md#approve-or-deny-request) | ![Approve access](./media/entitlement-management-scenarios/approve-access.png) |

## Requestors

### I want to view the groups, applications, or SharePoint sites available to me and request access

> [!div class="mx-tableFixed"]
> | Steps | Example |
> | --- | --- |
> | **1.** [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal) | [![My Access portal icon](./media/entitlement-management-scenarios/my-access-portal.png)](./media/entitlement-management-scenarios/my-access-portal-expanded.png#lightbox) |
> | **2.** Find access package |  |
> | **3.** [Request access](entitlement-management-request-access.md#request-an-access-package) | ![Request access](./media/entitlement-management-scenarios/request-access.png) |

### I'm an external user and I want to request access to groups, applications, or SharePoint sites with a direct link

> [!div class="mx-tableFixed"]
> | Steps | Example |
> | --- | --- |
> | **1.** [Find the My Access portal link you received](entitlement-management-access-package-edit.md#copy-my-access-portal-link) |  |
> | **2.** [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal) | [![My Access portal icon](./media/entitlement-management-scenarios/my-access-portal.png)](./media/entitlement-management-scenarios/my-access-portal-expanded.png#lightbox) |
> | **3.** [Request access](entitlement-management-request-access.md#request-an-access-package) | ![Request access external user](./media/entitlement-management-scenarios/request-access-external.png) |

### I want to view the groups, applications, or SharePoint sites I already have access to

> [!div class="mx-tableFixed"]
> | Steps | Example |
> | --- | --- |
> | **1.** [Sign in to the My Access portal](entitlement-management-request-access.md#sign-in-to-the-my-access-portal) | [![My Access portal icon](./media/entitlement-management-scenarios/my-access-portal.png)](./media/entitlement-management-scenarios/my-access-portal-expanded.png#lightbox) |
> | **2.** View active access packages |  |

## Next steps

- [Tutorial: Create your first access package](entitlement-management-access-package-first.md)
- [Delegate tasks](entitlement-management-delegate.md)
