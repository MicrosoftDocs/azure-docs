---
title: User management permissions for Azure AD custom roles (preview)
description: User management permissions for Azure AD custom roles in the Azure portal, PowerShell, or Microsoft Graph API.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: reference
ms.date: 10/26/2022
ms.author: rolyon
ms.reviewer: 
ms.custom: it-pro
---

# User management permissions for Azure AD custom roles (preview)

> [!IMPORTANT]
> User management permissions for Azure AD custom roles is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

User management permissions can be used in custom role definitions in Azure Active Directory (Azure AD) to grant fine-grained access such as the following:

- Read or update basic properties of users
- Read or update identity of users
- Read or update job information of users
- Update contact information of users
- Update parental controls of users
- Update settings of users
- Read direct reports of users
- Update extension properties of users
- Read device information of users
- Read or manage licenses of users
- Update password policies of users
- Read assignments and memberships of users

This article lists the permissions you can use in your custom roles for different user management scenarios. For information about how to create custom roles, see [Create and assign a custom role](custom-create.md).

## License requirements

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## Read or update basic properties of users

The following permissions are available to read or update basic properties of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/standard/read | Read basic properties on users. |
> | microsoft.directory/users/basic/update | Update basic properties on users. |

## Read or update identity of users

The following permissions are available to read or update identity of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/identities/read | Read identities of users. |
> | microsoft.directory/users/identities/update | Update the identity properties of users, such as name and user principal name. |

## Read or update job information of users

The following permissions are available to read or update job information of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/manager/read | Read manager of users. |
> | microsoft.directory/users/manager/update | Update manager for users. |
> | microsoft.directory/users/jobInfo/update | Update the job info properties of users, such as job title, department, and company name. |

## Update contact information of users

The following permissions are available to update contact information of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/contactInfo/update | Update the contact info properties of users, such as address, phone, and email. |

## Update parental controls of users

The following permissions are available to update parental controls of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/parentalControls/update | Update parental controls of users. |

## Update settings of users

The following permissions are available to update settings of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/usageLocation/update | Update usage location of users. |

## Read direct reports of users

The following permissions are available to read direct reports of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/directReports/read | Read the direct reports for users. |

## Update extension properties of users

The following permissions are available to update extension properties of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/extensionProperties/update | Update extension properties of users. |

## Read device information of users

The following permissions are available to read device information of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/ownedDevices/read | Read owned devices of users |
> | microsoft.directory/users/registeredDevices/read | Read registered devices of users |
> | microsoft.directory/users/deviceForResourceAccount/read | Read deviceForResourceAccount of users. |

## Read or manage licenses of users

The following permissions are available to read or manage licenses of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/licenseDetails/read | Read license details of users. |
> | microsoft.directory/users/assignLicense | Manage user licenses. |
> | microsoft.directory/users/reprocessLicenseAssignment | Reprocess license assignments for users. |

## Update password policies of users

The following permissions are available to update password policies of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/passwordPolicies/update | Update password policies properties of users. |

## Read assignments and memberships of users

The following permissions are available to read assignments and memberships of users.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/appRoleAssignments/read | Read application role assignments for users |
> | microsoft.directory/users/scopedRoleMemberOf/read | Read user's membership of an Azure AD role, that is scoped to an administrative unit |
> | microsoft.directory/users/memberOf/read | Read the group memberships of users |

## Full list of permissions

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/users/appRoleAssignments/read | Read application role assignments for users. |
> | microsoft.directory/users/assignLicense | Manage user licenses. |
> | microsoft.directory/users/basic/update | Update basic properties on users. |
> | microsoft.directory/users/contactInfo/update | Update the contact info properties of users, such as address, phone, and email. |
> | microsoft.directory/users/deviceForResourceAccount/read | Read deviceForResourceAccount of users. |
> | microsoft.directory/users/directReports/read | Read the direct reports for users. |
> | microsoft.directory/users/extensionProperties/update | Update extension properties of users. |
> | microsoft.directory/users/identities/read | Read identities of users. |
> | microsoft.directory/users/identities/update | Update the identity properties of users, such as name and user principal name. |
> | microsoft.directory/users/jobInfo/update | Update the job info properties of users, such as job title, department, and company name. |
> | microsoft.directory/users/licenseDetails/read | Read license details of users. |
> | microsoft.directory/users/manager/read | Read manager of users. |
> | microsoft.directory/users/manager/update | Update manager for users. |
> | microsoft.directory/users/memberOf/read | Read the group memberships of users. |
> | microsoft.directory/users/ownedDevices/read | Read owned devices of users. |
> | microsoft.directory/users/parentalControls/update | Update parental controls of users. |
> | microsoft.directory/users/passwordPolicies/update | Update password policies properties of users. |
> | microsoft.directory/users/registeredDevices/read | Read registered devices of users. |
> | microsoft.directory/users/reprocessLicenseAssignment | Reprocess license assignments for users. |
> | microsoft.directory/users/scopedRoleMemberOf/read | Read user's membership of an Azure AD role, that is scoped to an administrative unit. |
> | microsoft.directory/users/standard/read | Read basic properties on users. |
> | microsoft.directory/users/usageLocation/update | Update usage location of users. |

## Next steps

- [Create and assign a custom role in Azure Active Directory](custom-create.md)
- [List Azure AD role assignments](view-assignments.md)
