---
title: Least privileged roles by task - Azure Active Directory | Microsoft Docs
description: Least privileged roles to delegate for tasks in Azure Active Directory
services: active-directory
documentationcenter: ''
author: rolyon
manager: karenhoran
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: reference
ms.date: 12/01/2021
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
#Customer intent: As an Azure AD administrator, I want to know which role has the least privilege for a given task to make my Azure AD organization more secure.
---

# Least privileged roles by task in Azure Active Directory

In this article, you can find the information needed to restrict a user's administrator permissions by assigning least privileged roles in Azure Active Directory (Azure AD). You will find tasks organized by feature area and the least privileged role required to perform each task, along with additional non-Global Administrator roles that can perform the task.

You can further restrict permissions by assigning roles at smaller scopes or by creating your own custom roles. For more information, see [Assign Azure AD roles at different scopes](assign-roles-different-scopes.md) or [Create and assign a custom role](custom-create.md).

## Application proxy

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure application proxy app | [Application Administrator](../roles/permissions-reference.md#application-administrator) |  |
> | Configure connector group properties | [Application Administrator](../roles/permissions-reference.md#application-administrator) |  |
> | Create application registration when ability is disabled for all users | [Application Developer](../roles/permissions-reference.md#application-developer) | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](../roles/permissions-reference.md#application-administrator) |
> | Create connector group | [Application Administrator](../roles/permissions-reference.md#application-administrator) |  |
> | Delete connector group | [Application Administrator](../roles/permissions-reference.md#application-administrator) |  |
> | Disable application proxy | [Application Administrator](../roles/permissions-reference.md#application-administrator) |  |
> | Download connector service | [Application Administrator](../roles/permissions-reference.md#application-administrator) |  |
> | Read all configuration | [Application Administrator](../roles/permissions-reference.md#application-administrator) |  |

## External Identities/B2C

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Create Azure AD B2C directories | [All non-guest users](../fundamentals/users-default-permissions.md) |  |
> | Create B2C applications | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Create enterprise applications | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator) | [Application Administrator](../roles/permissions-reference.md#application-administrator) |
> | Create, read, update, and delete B2C policies | [B2C IEF Policy Administrator](../roles/permissions-reference.md#b2c-ief-policy-administrator) |  |
> | Create, read, update, and delete identity providers | [External Identity Provider Administrator](../roles/permissions-reference.md#external-identity-provider-administrator) |  |
> | Create, read, update, and delete password reset user flows | [External ID User Flow Administrator](../roles/permissions-reference.md#external-id-user-flow-administrator) |  |
> | Create, read, update, and delete profile editing user flows | [External ID User Flow Administrator](../roles/permissions-reference.md#external-id-user-flow-administrator) |  |
> | Create, read, update, and delete sign-in user flows | [External ID User Flow Administrator](../roles/permissions-reference.md#external-id-user-flow-administrator) |  |
> | Create, read, update, and delete sign-up user flow | [External ID User Flow Administrator](../roles/permissions-reference.md#external-id-user-flow-administrator) |  |
> | Create, read, update, and delete user attributes | [External ID User Flow Attribute Administrator](../roles/permissions-reference.md#external-id-user-flow-attribute-administrator) |  |
> | Create, read, update, and delete users | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Configure B2B external collaboration settings | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Read all configuration | [Global Reader](../roles/permissions-reference.md#global-reader) |  |
> | [Read B2C audit logs](../../active-directory-b2c/faq.yml) | [Global Reader](../roles/permissions-reference.md#global-reader) |  |

> [!NOTE]
> Azure AD B2C Global Administrators do not have the same permissions as Azure AD Global Administrators. If you have Azure AD B2C Global Administrator privileges, make sure that you are in an Azure AD B2C directory and not an Azure AD directory.

## Company branding

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure company branding | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Read all configuration | [Directory Readers](../roles/permissions-reference.md#directory-readers) | [Default user role](../fundamentals/users-default-permissions.md) |

## Company properties

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure company properties | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |

## Connect

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Passthrough authentication | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Read all configuration | [Global Reader](../roles/permissions-reference.md#global-reader) | [Global Administrator](../roles/permissions-reference.md#global-administrator) |
> | Seamless single sign-on | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |

## Cloud Provisioning

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Passthrough authentication | [Hybrid Identity Administrator](../roles/permissions-reference.md#hybrid-identity-administrator) |  |
> | Read all configuration | [Global Reader](../roles/permissions-reference.md#global-reader) | [Hybrid Identity Administrator](../roles/permissions-reference.md#hybrid-identity-administrator) |
> | Seamless single sign-on | [Hybrid Identity Administrator](../roles/permissions-reference.md#hybrid-identity-administrator) |  |

## Connect Health

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | [Add or delete services](../hybrid/how-to-connect-health-operations.md) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |  |
> | Apply fixes to sync error | [Contributor](../../role-based-access-control/built-in-roles.md#contributor) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |
> | Configure notifications | [Contributor](../../role-based-access-control/built-in-roles.md#contributor) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |
> | [Configure settings](../hybrid/how-to-connect-health-operations.md) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |  |
> | Configure sync notifications | [Contributor](../../role-based-access-control/built-in-roles.md#contributor) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |
> | Read ADFS security reports | [Security Reader](../../role-based-access-control/built-in-roles.md#security-reader) | [Contributor](../../role-based-access-control/built-in-roles.md#contributor)<br/>[Owner](../../role-based-access-control/built-in-roles.md#owner)
> | Read all configuration | [Reader](../../role-based-access-control/built-in-roles.md#reader) | [Contributor](../../role-based-access-control/built-in-roles.md#contributor)<br/>[Owner](../../role-based-access-control/built-in-roles.md#owner) |
> | Read sync errors | [Reader](../../role-based-access-control/built-in-roles.md#reader) | [Contributor](../../role-based-access-control/built-in-roles.md#contributor)<br/>[Owner](../../role-based-access-control/built-in-roles.md#owner) |
> | Read sync services | [Reader](../../role-based-access-control/built-in-roles.md#reader) | [Contributor](../../role-based-access-control/built-in-roles.md#contributor)<br/>[Owner](../../role-based-access-control/built-in-roles.md#owner) |
> | View metrics and alerts | [Reader](../../role-based-access-control/built-in-roles.md#reader) | [Contributor](../../role-based-access-control/built-in-roles.md#contributor)<br/>[Owner](../../role-based-access-control/built-in-roles.md#owner) |
> | View metrics and alerts | [Reader](../../role-based-access-control/built-in-roles.md#reader) | [Contributor](../../role-based-access-control/built-in-roles.md#contributor)<br/>[Owner](../../role-based-access-control/built-in-roles.md#owner) |
> | View sync service metrics and alerts | [Reader](../../role-based-access-control/built-in-roles.md#reader) | [Contributor](../../role-based-access-control/built-in-roles.md#contributor)<br/>[Owner](../../role-based-access-control/built-in-roles.md#owner) |

## Custom domain names

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Manage domains | [Domain Name Administrator](../roles/permissions-reference.md#domain-name-administrator) |  |
> | Read all configuration | [Directory Readers](../roles/permissions-reference.md#directory-readers) | [Default user role](../fundamentals/users-default-permissions.md) |

## Domain Services

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Create Azure AD Domain Services instance | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Perform all Azure AD Domain Services tasks | [AAD DC Administrators group](../../active-directory-domain-services/tutorial-create-management-vm.md#administrative-tasks-you-can-perform-on-a-managed-domain) |  |
> | Read all configuration | Reader on Azure subscription containing AD DS service |  |

## Devices

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Disable device | [Cloud Device Administrator](../roles/permissions-reference.md#cloud-device-administrator) |  |
> | Enable device | [Cloud Device Administrator](../roles/permissions-reference.md#cloud-device-administrator) |  |
> | Read basic configuration | [Default user role](../fundamentals/users-default-permissions.md) |  |
> | Read BitLocker keys | [Security Reader](../roles/permissions-reference.md#security-reader) | [Password Administrator](../roles/permissions-reference.md#password-administrator)<br/>[Security Administrator](../roles/permissions-reference.md#security-administrator) |

## Enterprise applications

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Consent to any delegated permissions | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator) | [Application Administrator](../roles/permissions-reference.md#application-administrator) |
> | Consent to application permissions not including Microsoft Graph | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator) | [Application Administrator](../roles/permissions-reference.md#application-administrator) |
> | Consent to application permissions to Microsoft Graph | [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator) |  |
> | Consent to applications accessing own data | [Default user role](../fundamentals/users-default-permissions.md) |  |
> | Create enterprise application | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator) | [Application Administrator](../roles/permissions-reference.md#application-administrator) |
> | Manage Application Proxy | [Application Administrator](../roles/permissions-reference.md#application-administrator) |  |
> | Manage user settings | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Read access review of a group or of an app | [Security Reader](../roles/permissions-reference.md#security-reader) | [Security Administrator](../roles/permissions-reference.md#security-administrator)<br/>[User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Read all configuration | [Default user role](../fundamentals/users-default-permissions.md) |  |
> | Update enterprise application assignments | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](../roles/permissions-reference.md#application-administrator)<br/>[User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Update enterprise application owners | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](../roles/permissions-reference.md#application-administrator) |
> | Update enterprise application properties | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](../roles/permissions-reference.md#application-administrator) |
> | Update enterprise application provisioning | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](../roles/permissions-reference.md#application-administrator) |
> | Update enterprise application self-service | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](../roles/permissions-reference.md#application-administrator) |
> | Update single sign-on properties | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](../roles/permissions-reference.md#application-administrator) |

## Entitlement management

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Add resources to a catalog | [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator) | With entitlement management, you can delegate this task to the [catalog owner](../governance/entitlement-management-catalog-create.md#add-more-catalog-owners) |
> | Add SharePoint Online sites to catalog | [SharePoint Administrator](../roles/permissions-reference.md#sharepoint-administrator) |  |

## Groups

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Assign license | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Create group | [Groups Administrator](../roles/permissions-reference.md#groups-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Create, update, or delete access review of a group or of an app | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Manage group expiration | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Manage group settings | [Groups Administrator](../roles/permissions-reference.md#groups-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Read all configuration (except hidden membership) | [Directory Readers](../roles/permissions-reference.md#directory-readers) | [Default user role](../fundamentals/users-default-permissions.md) |
> | Read hidden membership | Group member | [Group owner](../fundamentals/users-default-permissions.md#object-ownership)<br/>[Password Administrator](../roles/permissions-reference.md#password-administrator)<br/>[Exchange Administrator](../roles/permissions-reference.md#exchange-administrator)<br/>[SharePoint Administrator](../roles/permissions-reference.md#sharepoint-administrator)<br/>[Teams Administrator](../roles/permissions-reference.md#teams-administrator)<br/>[User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Read membership of groups with hidden membership | [Helpdesk Administrator](../roles/permissions-reference.md#helpdesk-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator)<br/>[Teams Administrator](../roles/permissions-reference.md#teams-administrator) |
> | Revoke license | [License Administrator](../roles/permissions-reference.md#license-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Update group membership | [Group owner](../fundamentals/users-default-permissions.md#object-ownership) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Update group owners | [Group owner](../fundamentals/users-default-permissions.md#object-ownership) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Update group properties | [Group owner](../fundamentals/users-default-permissions.md#object-ownership) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Delete group | [Groups Administrator](../roles/permissions-reference.md#groups-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |

## Identity Protection

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure alert notifications| [Security Administrator](../roles/permissions-reference.md#security-administrator) |  |
> | Configure and enable or disable MFA policy| [Security Administrator](../roles/permissions-reference.md#security-administrator) |  |
> | Configure and enable or disable sign-in risk policy| [Security Administrator](../roles/permissions-reference.md#security-administrator) |  |
> | Configure and enable or disable user risk policy | [Security Administrator](../roles/permissions-reference.md#security-administrator) |  |
> | Configure weekly digests | [Security Administrator](../roles/permissions-reference.md#security-administrator) |  |
> | Dismiss all risk detections | [Security Administrator](../roles/permissions-reference.md#security-administrator) |  |
> | Fix or dismiss vulnerability | [Security Administrator](../roles/permissions-reference.md#security-administrator) |  |
> | Read all configuration | [Security Reader](../roles/permissions-reference.md#security-reader) |  |
> | Read all risk detections | [Security Reader](../roles/permissions-reference.md#security-reader) |  |
> | Read vulnerabilities | [Security Reader](../roles/permissions-reference.md#security-reader) |  |

## Licenses

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Assign license | [License Administrator](../roles/permissions-reference.md#license-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Read all configuration | [Directory Readers](../roles/permissions-reference.md#directory-readers) | [Default user role](../fundamentals/users-default-permissions.md) |
> | Revoke license | [License Administrator](../roles/permissions-reference.md#license-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Try or buy subscription | [Billing Administrator](../roles/permissions-reference.md#billing-administrator) |  |

## Monitoring - Audit logs

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Read audit logs | [Reports Reader](../roles/permissions-reference.md#reports-reader) | [Security Reader](../roles/permissions-reference.md#security-reader)<br/>[Security Administrator](../roles/permissions-reference.md#security-administrator) |

## Monitoring - Sign-ins

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Read sign-in logs | [Reports Reader](../roles/permissions-reference.md#reports-reader) | [Security Reader](../roles/permissions-reference.md#security-reader)<br/>[Security Administrator](../roles/permissions-reference.md#security-administrator)<br/> [Global Reader](../roles/permissions-reference.md#global-reader) |

## Multi-factor authentication

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Delete all existing app passwords generated by the selected users | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | [Disable per-user MFA](../authentication/howto-mfa-userstates.md) | [Authentication Administrator](../roles/permissions-reference.md#authentication-administrator) (via PowerShell) | [Privileged Authentication Administrator](../roles/permissions-reference.md#privileged-authentication-administrator) (via PowerShell) |
> | [Enable per-user MFA](../authentication/howto-mfa-userstates.md) | [Authentication Administrator](../roles/permissions-reference.md#authentication-administrator) (via PowerShell) | [Privileged Authentication Administrator](../roles/permissions-reference.md#privileged-authentication-administrator) (via PowerShell) | 
> | Manage MFA service settings | [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) |  |
> | Require selected users to provide contact methods again | [Authentication Administrator](../roles/permissions-reference.md#authentication-administrator) |  |
> | Restore multi-factor authentication on all remembered devices  | [Authentication Administrator](../roles/permissions-reference.md#authentication-administrator) |  |

## MFA Server

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Block/unblock users | [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) |  |
> | Configure account lockout | [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) |  |
> | Configure caching rules | [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) |  |
> | Configure fraud alert | [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) |  |
> | Configure notifications | [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) |  |
> | Configure one-time bypass | [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) |  |
> | Configure phone call settings | [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) |  |
> | Configure providers | [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) |  |
> | Configure server settings | [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) |  |
> | Read activity report | [Global Reader](../roles/permissions-reference.md#global-reader) |  |
> | Read all configuration | [Global Reader](../roles/permissions-reference.md#global-reader) |  |
> | Read server status | [Global Reader](../roles/permissions-reference.md#global-reader) |  |

## Organizational relationships

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Manage identity providers | [External Identity Provider Administrator](../roles/permissions-reference.md#external-identity-provider-administrator) |  |
> | Manage settings | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Manage terms of use | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Read all configuration | [Global Reader](../roles/permissions-reference.md#global-reader) |  |

## Password reset

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure authentication methods | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Configure customization | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Configure notification | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Configure on-premises integration | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Configure password reset properties | [User Administrator](../roles/permissions-reference.md#user-administrator) | [Global Administrator](../roles/permissions-reference.md#global-administrator) |
> | Configure registration | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Read all configuration | [Security Administrator](../roles/permissions-reference.md#security-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |

## Privileged identity management

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Assign users to roles | [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator) |  |
> | Configure role settings | [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator) |  |
> | View audit activity | [Security Reader](../roles/permissions-reference.md#security-reader) |  |
> | View role memberships | [Security Reader](../roles/permissions-reference.md#security-reader) |  |

## Roles and administrators

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Manage role assignments | [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator) |  |
> | Read access review of an Azure AD role  | [Security Reader](../roles/permissions-reference.md#security-reader) | [Security Administrator](../roles/permissions-reference.md#security-administrator)<br/>[Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator) |
> | Read all configuration | [Default user role](../fundamentals/users-default-permissions.md) |  |

## Security - Authentication methods

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure authentication methods | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Configure password protection | [Security Administrator](../roles/permissions-reference.md#security-administrator) |  |
> | Configure smart lockout | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Read all configuration | [Global Reader](../roles/permissions-reference.md#global-reader) |  |

## Security - Conditional Access

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure MFA trusted IP addresses | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) |  |
> | Create custom controls | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Create named locations | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Create policies | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Create terms of use | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Create VPN connectivity certificate | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Delete classic policy | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Delete terms of use | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Delete VPN connectivity certificate | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Disable classic policy | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Manage custom controls | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Manage named locations | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Manage terms of use | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Read all configuration | [Security Reader](../roles/permissions-reference.md#security-reader) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Read named locations | [Security Reader](../roles/permissions-reference.md#security-reader) | [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator)<br/>[Security Administrator](../roles/permissions-reference.md#security-administrator) |

## Security - Identity security score

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles | 
> | ---- | --------------------- | ---------------- |
> | Read all configuration | [Security Reader](../roles/permissions-reference.md#security-reader) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Read security score | [Security Reader](../roles/permissions-reference.md#security-reader) | [Security Administrator](../roles/permissions-reference.md#security-administrator) |
> | Update event status | [Security Administrator](../roles/permissions-reference.md#security-administrator) |  |

## Security - Risky sign-ins

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Read all configuration | [Security Reader](../roles/permissions-reference.md#security-reader) |  |
> | Read risky sign-ins | [Security Reader](../roles/permissions-reference.md#security-reader) |  |

## Security - Users flagged for risk

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Dismiss all events | [Security Administrator](../roles/permissions-reference.md#security-administrator) |  |
> | Read all configuration | [Security Reader](../roles/permissions-reference.md#security-reader) |  |
> | Read users flagged for risk | [Security Reader](../roles/permissions-reference.md#security-reader) |  |

## Users

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Add user to directory role | [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator) |  |
> | Add user to group | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Assign license | [License Administrator](../roles/permissions-reference.md#license-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Create guest user | [Guest Inviter](../roles/permissions-reference.md#guest-inviter) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Reset guest user invite | [User Administrator](../roles/permissions-reference.md#user-administrator) | [Global Administrator](../roles/permissions-reference.md#global-administrator) |
> | Create user | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Delete users | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Invalidate refresh tokens of limited admins | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Invalidate refresh tokens of non-admins | [Password Administrator](../roles/permissions-reference.md#password-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Invalidate refresh tokens of privileged admins | [Privileged Authentication Administrator](../roles/permissions-reference.md#privileged-authentication-administrator) |  |
> | Read basic configuration | [Default user role](../fundamentals/users-default-permissions.md) |  |
> | Reset password for limited admins | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Reset password of non-admins | [Password Administrator](../roles/permissions-reference.md#password-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Reset password of privileged admins | [Privileged Authentication Administrator](../roles/permissions-reference.md#privileged-authentication-administrator) |  |
> | Revoke license | [License Administrator](../roles/permissions-reference.md#license-administrator) | [User Administrator](../roles/permissions-reference.md#user-administrator) |
> | Update all properties except User Principal Name | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Update User Principal Name for limited admins | [User Administrator](../roles/permissions-reference.md#user-administrator) |  |
> | Update User Principal Name property on privileged admins | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Update user settings | [Global Administrator](../roles/permissions-reference.md#global-administrator) |  |
> | Update Authentication methods | [Authentication Administrator](../roles/permissions-reference.md#authentication-administrator) | [Privileged Authentication Administrator](../roles/permissions-reference.md#privileged-authentication-administrator)<br/>[Global Administrator](../roles/permissions-reference.md#global-administrator) |

## Support

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Submit support ticket | [Service Support Administrator](../roles/permissions-reference.md#service-support-administrator) | [Application Administrator](../roles/permissions-reference.md#application-administrator)<br/>[Azure Information Protection Administrator](../roles/permissions-reference.md#azure-information-protection-administrator)<br/>[Billing Administrator](../roles/permissions-reference.md#billing-administrator)<br/>[Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator)<br/>[Compliance Administrator](../roles/permissions-reference.md#compliance-administrator)<br/>[Dynamics 365 Administrator](../roles/permissions-reference.md#dynamics-365-administrator)<br/>[Desktop Analytics Administrator](../roles/permissions-reference.md#desktop-analytics-administrator)<br/>[Exchange Administrator](../roles/permissions-reference.md#exchange-administrator)<br/>[Intune Administrator](../roles/permissions-reference.md#intune-administrator)<br/>[Password Administrator](../roles/permissions-reference.md#password-administrator)<br/>[Power BI Administrator](../roles/permissions-reference.md#power-bi-administrator)<br/>[Privileged Authentication Administrator](../roles/permissions-reference.md#privileged-authentication-administrator)<br/>[SharePoint Administrator](../roles/permissions-reference.md#sharepoint-administrator)<br/>[Skype for Business Administrator](../roles/permissions-reference.md#skype-for-business-administrator)<br/>[Teams Administrator](../roles/permissions-reference.md#teams-administrator)<br/>[Teams Communications Administrator](../roles/permissions-reference.md#teams-communications-administrator)<br/>[User Administrator](../roles/permissions-reference.md#user-administrator) |

## Next steps

- [Assign Azure AD roles to users](manage-roles-portal.md)
- [Assign Azure AD roles at different scopes](assign-roles-different-scopes.md)
- [Create and assign a custom role in Azure Active Directory](custom-create.md)
- [Azure AD built-in roles](permissions-reference.md)
