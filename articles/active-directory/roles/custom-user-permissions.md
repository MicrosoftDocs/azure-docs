---
title: User management permissions for Azure AD custom roles - Azure Active Directory
description: User management permissions for Azure AD custom roles in the Azure portal, PowerShell, or Microsoft Graph API.
services: active-directory
author: rolyon
manager: karenhoran
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: reference
ms.date: 07/07/2022
ms.author: rolyon
ms.reviewer: 
ms.custom: it-pro
---

# User management permissions for Azure AD custom roles

User management permissions can be used in custom role definitions in Azure Active Directory (Azure AD) to grant fine-grained access such as the following:

- Enable or disable users
- Create or delete users
- Read or update manager of users
- Update basic properties of users
- Update contact info of users

This article lists the permissions you can use in your custom roles for different user management scenarios. For information about how to create custom roles, see [Create and assign a custom role](custom-create.md).

## License requirements

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## Enable or disable users

The following permissions are available to enable or disable users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/enable | Enable users |
> | microsoft.directory/users/disable | Disable users |

## Create or delete users

The following permissions are available to create or delete users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/create | Add users |
> | microsoft.directory/users/delete | Delete users |

## Read or update manager of users

The following permissions are available to read or update manager of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/manager/read | Read manager of users |
> | microsoft.directory/users/manager/update | Update manager for users |

## Update basic properties of users

The following permissions are available to update basic properties of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/standard/read | Read basic properties on users |
> | microsoft.directory/users/basic/update | Update basic properties on users |

## Update contact info of users

The following permissions are available to update contact info of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/contactInfo/update |  |

## Full list of permissions

### Manage user state

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/create | Add users |
> | microsoft.directory/users/delete | Delete users |
> | microsoft.directory/users/enable | Enable users |
> | microsoft.directory/users/disable | Disable users |

### Basic profile management

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/appRoleAssignments/read | Read application role assignments for users |
> | microsoft.directory/users/directReports/read | Read the direct reports for users |
> | microsoft.directory/users/manager/read | Read manager of users |
> | microsoft.directory/users/memberOf/read | Read the group memberships of users |
> | microsoft.directory/users/ownedDevices/read | Read owned devices of users |
> | microsoft.directory/users/registeredDevices/read | Read registered devices of users |
> | microsoft.directory/users/scopedRoleMemberOf/read | Read user's membership of an Azure AD role, that is scoped to an administrative unit |
> | microsoft.directory/users/standard/read | Read basic properties on users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/contactInfo/update |  |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/userPrincipalName/update |  |

## Next steps

- [Create and assign a custom role in Azure Active Directory](custom-create.md)
- [List Azure AD role assignments](view-assignments.md)
