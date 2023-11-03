---
title: Least privileged roles by task
description: Least privileged roles to delegate for tasks in Microsoft Entra ID
services: active-directory
documentationcenter: ''
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: reference
ms.date: 01/05/2023
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
#Customer intent: As a Microsoft Entra administrator, I want to know which role has the least privilege for a given task to make my Microsoft Entra organization more secure.
---

# Least privileged roles by task in Microsoft Entra ID

In this article, you can find the information needed to restrict a user's administrator permissions by assigning least privileged roles in Microsoft Entra ID. You will find tasks organized by feature area and the least privileged role required to perform each task, along with additional non-Global Administrator roles that can perform the task.

You can further restrict permissions by assigning roles at smaller scopes or by creating your own custom roles. For more information, see [Assign Microsoft Entra roles at different scopes](assign-roles-different-scopes.md) or [Create and assign a custom role in Microsoft Entra ID](custom-create.md).

## Application proxy

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure application proxy app | [Application Administrator](permissions-reference.md#application-administrator) |  |
> | Configure connector group properties | [Application Administrator](permissions-reference.md#application-administrator) |  |
> | Create application registration when ability is disabled for all users | [Application Developer](permissions-reference.md#application-developer) | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](permissions-reference.md#application-administrator) |
> | Create connector group | [Application Administrator](permissions-reference.md#application-administrator) |  |
> | Delete connector group | [Application Administrator](permissions-reference.md#application-administrator) |  |
> | Disable application proxy | [Application Administrator](permissions-reference.md#application-administrator) |  |
> | Download connector service | [Application Administrator](permissions-reference.md#application-administrator) |  |
> | Read all configuration | [Application Administrator](permissions-reference.md#application-administrator) |  |

## External Identities/B2C

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Create Azure AD B2C directories | [All non-guest users](../fundamentals/users-default-permissions.md) |  |
> | Create B2C applications | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Create enterprise applications | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator) | [Application Administrator](permissions-reference.md#application-administrator) |
> | Create, read, update, and delete B2C policies | [B2C IEF Policy Administrator](permissions-reference.md#b2c-ief-policy-administrator) |  |
> | Create, read, update, and delete identity providers | [External Identity Provider Administrator](permissions-reference.md#external-identity-provider-administrator) |  |
> | Create, read, update, and delete password reset user flows | [External ID User Flow Administrator](permissions-reference.md#external-id-user-flow-administrator) |  |
> | Create, read, update, and delete profile editing user flows | [External ID User Flow Administrator](permissions-reference.md#external-id-user-flow-administrator) |  |
> | Create, read, update, and delete sign-in user flows | [External ID User Flow Administrator](permissions-reference.md#external-id-user-flow-administrator) |  |
> | Create, read, update, and delete sign-up user flow | [External ID User Flow Administrator](permissions-reference.md#external-id-user-flow-administrator) |  |
> | Create, read, update, and delete user attributes | [External ID User Flow Attribute Administrator](permissions-reference.md#external-id-user-flow-attribute-administrator) |  |
> | Create, read, update, and delete users | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Configure B2B external collaboration settings | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Read all configuration | [Global Reader](permissions-reference.md#global-reader) |  |
> | [Read B2C audit logs](/azure/active-directory-b2c/faq) | [Global Reader](permissions-reference.md#global-reader) |  |

> [!NOTE]
> Azure AD B2C Global Administrators do not have the same permissions as Microsoft Entra Global Administrators. If you have Azure AD B2C Global Administrator privileges, make sure that you are in an Azure AD B2C directory and not a Microsoft Entra directory.

## Company branding

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure company branding | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Read all configuration | [Directory Readers](permissions-reference.md#directory-readers) | [Default user role](../fundamentals/users-default-permissions.md) |

## Company properties

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure company properties | [Global Administrator](permissions-reference.md#global-administrator) |  |

## Connect

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Passthrough authentication | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Read all configuration | [Global Reader](permissions-reference.md#global-reader) | [Global Administrator](permissions-reference.md#global-administrator) |
> | Seamless single sign-on | [Global Administrator](permissions-reference.md#global-administrator) |  |

## Cloud Provisioning

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Passthrough authentication | [Hybrid Identity Administrator](permissions-reference.md#hybrid-identity-administrator) |  |
> | Read all configuration | [Global Reader](permissions-reference.md#global-reader) | [Hybrid Identity Administrator](permissions-reference.md#hybrid-identity-administrator) |
> | Seamless single sign-on | [Hybrid Identity Administrator](permissions-reference.md#hybrid-identity-administrator) |  |

## Connect Health

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | [Add or delete services](../hybrid/connect/how-to-connect-health-operations.md) | [Owner](/azure/role-based-access-control/built-in-roles#owner) |  |
> | Apply fixes to sync error | [Contributor](/azure/role-based-access-control/built-in-roles#contributor) | [Owner](/azure/role-based-access-control/built-in-roles#owner) |
> | Configure notifications | [Contributor](/azure/role-based-access-control/built-in-roles#contributor) | [Owner](/azure/role-based-access-control/built-in-roles#owner) |
> | [Configure settings](../hybrid/connect/how-to-connect-health-operations.md) | [Owner](/azure/role-based-access-control/built-in-roles#owner) |  |
> | Configure sync notifications | [Contributor](/azure/role-based-access-control/built-in-roles#contributor) | [Owner](/azure/role-based-access-control/built-in-roles#owner) |
> | Read ADFS security reports | [Security Reader](/azure/role-based-access-control/built-in-roles#security-reader) | [Contributor](/azure/role-based-access-control/built-in-roles#contributor)<br/>[Owner](/azure/role-based-access-control/built-in-roles#owner)
> | Read all configuration | [Reader](/azure/role-based-access-control/built-in-roles#reader) | [Contributor](/azure/role-based-access-control/built-in-roles#contributor)<br/>[Owner](/azure/role-based-access-control/built-in-roles#owner) |
> | Read sync errors | [Reader](/azure/role-based-access-control/built-in-roles#reader) | [Contributor](/azure/role-based-access-control/built-in-roles#contributor)<br/>[Owner](/azure/role-based-access-control/built-in-roles#owner) |
> | Read sync services | [Reader](/azure/role-based-access-control/built-in-roles#reader) | [Contributor](/azure/role-based-access-control/built-in-roles#contributor)<br/>[Owner](/azure/role-based-access-control/built-in-roles#owner) |
> | View metrics and alerts | [Reader](/azure/role-based-access-control/built-in-roles#reader) | [Contributor](/azure/role-based-access-control/built-in-roles#contributor)<br/>[Owner](/azure/role-based-access-control/built-in-roles#owner) |
> | View metrics and alerts | [Reader](/azure/role-based-access-control/built-in-roles#reader) | [Contributor](/azure/role-based-access-control/built-in-roles#contributor)<br/>[Owner](/azure/role-based-access-control/built-in-roles#owner) |
> | View sync service metrics and alerts | [Reader](/azure/role-based-access-control/built-in-roles#reader) | [Contributor](/azure/role-based-access-control/built-in-roles#contributor)<br/>[Owner](/azure/role-based-access-control/built-in-roles#owner) |

## Custom domain names

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Manage domains | [Domain Name Administrator](permissions-reference.md#domain-name-administrator) |  |
> | Read all configuration | [Directory Readers](permissions-reference.md#directory-readers) | [Default user role](../fundamentals/users-default-permissions.md) |

## Domain Services

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Create Microsoft Entra Domain Services instance | [Application Administrator](permissions-reference.md#application-administrator)<br>[Groups Administrator](permissions-reference.md#groups-administrator)<br> [Domain Services Contributor](/azure/role-based-access-control/built-in-roles#domain-services-contributor)|   |
> | Perform all Microsoft Entra Domain Services tasks | [AAD DC Administrators group](/entra/identity/domain-services/tutorial-create-management-vm#administrative-tasks-you-can-perform-on-a-managed-domain) |  |
> | Read all configuration | Reader on Azure subscription containing AD DS service |  |

## Devices

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Delete device | [Cloud Device Administrator](permissions-reference.md#cloud-device-administrator) | [Intune Administrator](permissions-reference.md#intune-administrator) |
> | Disable device | [Cloud Device Administrator](permissions-reference.md#cloud-device-administrator) | [Intune Administrator](permissions-reference.md#intune-administrator) |
> | Enable device | [Cloud Device Administrator](permissions-reference.md#cloud-device-administrator) | [Intune Administrator](permissions-reference.md#intune-administrator) |
> | Read basic configuration | [Default user role](../fundamentals/users-default-permissions.md) |  |
> | Read BitLocker keys | [Cloud Device Administrator](permissions-reference.md#cloud-device-administrator) | [Helpdesk Administrator](permissions-reference.md#helpdesk-administrator)<br/>[Intune Administrator](permissions-reference.md#intune-administrator)<br/>[Security Administrator](permissions-reference.md#security-administrator)<br/>[Security Reader](permissions-reference.md#security-reader) |

## Enterprise applications

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Consent to any delegated permissions | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator) | [Application Administrator](permissions-reference.md#application-administrator) |
> | Consent to application permissions not including Microsoft Graph | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator) | [Application Administrator](permissions-reference.md#application-administrator) |
> | Consent to application permissions to Microsoft Graph | [Privileged Role Administrator](permissions-reference.md#privileged-role-administrator) |  |
> | Consent to applications accessing own data | [Default user role](../fundamentals/users-default-permissions.md) |  |
> | Create enterprise application | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator) | [Application Administrator](permissions-reference.md#application-administrator) |
> | Manage Application Proxy | [Application Administrator](permissions-reference.md#application-administrator) |  |
> | Manage user settings | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Read access review of a group or of an app | [Security Reader](permissions-reference.md#security-reader) | [Security Administrator](permissions-reference.md#security-administrator)<br/>[User Administrator](permissions-reference.md#user-administrator) |
> | Read all configuration | [Default user role](../fundamentals/users-default-permissions.md) |  |
> | Update enterprise application assignments | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](permissions-reference.md#application-administrator)<br/>[User Administrator](permissions-reference.md#user-administrator) |
> | Update enterprise application owners | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](permissions-reference.md#application-administrator) |
> | Update enterprise application properties | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](permissions-reference.md#application-administrator) |
> | Update enterprise application provisioning | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](permissions-reference.md#application-administrator) |
> | Update enterprise application self-service | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](permissions-reference.md#application-administrator) |
> | Update single sign-on properties | [Enterprise application owner](../fundamentals/users-default-permissions.md#object-ownership) | [Cloud Application Administrator](permissions-reference.md#cloud-application-administrator)<br/>[Application Administrator](permissions-reference.md#application-administrator) |

## Entitlement management

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Add resources to a catalog | [Identity Governance Administrator](permissions-reference.md#identity-governance-administrator) | With entitlement management, you can delegate this task to the [catalog owner](../governance/entitlement-management-catalog-create.md#add-more-catalog-owners) |
> | Add SharePoint Online sites to catalog | [SharePoint Administrator](permissions-reference.md#sharepoint-administrator) |  |

## Groups

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Assign license | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Create group | [Groups Administrator](permissions-reference.md#groups-administrator) | [User Administrator](permissions-reference.md#user-administrator) |
> | Create, update, or delete access review of a group or of an app | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Manage group expiration | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Manage group settings | [Groups Administrator](permissions-reference.md#groups-administrator) | [User Administrator](permissions-reference.md#user-administrator) |
> | Read all configuration (except hidden membership) | [Directory Readers](permissions-reference.md#directory-readers) | [Default user role](../fundamentals/users-default-permissions.md) |
> | Read hidden membership | Group member | [Group owner](../fundamentals/users-default-permissions.md#object-ownership)<br/>[Password Administrator](permissions-reference.md#password-administrator)<br/>[Exchange Administrator](permissions-reference.md#exchange-administrator)<br/>[SharePoint Administrator](permissions-reference.md#sharepoint-administrator)<br/>[Teams Administrator](permissions-reference.md#teams-administrator)<br/>[User Administrator](permissions-reference.md#user-administrator) |
> | Read membership of groups with hidden membership | [Helpdesk Administrator](permissions-reference.md#helpdesk-administrator) | [User Administrator](permissions-reference.md#user-administrator)<br/>[Teams Administrator](permissions-reference.md#teams-administrator) |
> | Revoke license | [License Administrator](permissions-reference.md#license-administrator) | [User Administrator](permissions-reference.md#user-administrator) |
> | Update group membership | [Group owner](../fundamentals/users-default-permissions.md#object-ownership) | [User Administrator](permissions-reference.md#user-administrator) |
> | Update group owners | [Group owner](../fundamentals/users-default-permissions.md#object-ownership) | [User Administrator](permissions-reference.md#user-administrator) |
> | Update group properties | [Group owner](../fundamentals/users-default-permissions.md#object-ownership) | [User Administrator](permissions-reference.md#user-administrator) |
> | Delete group | [Groups Administrator](permissions-reference.md#groups-administrator) | [User Administrator](permissions-reference.md#user-administrator) |

## Identity Protection

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure alert notifications| [Security Administrator](permissions-reference.md#security-administrator) |  |
> | Configure and enable or disable MFA policy| [Security Administrator](permissions-reference.md#security-administrator) |  |
> | Configure and enable or disable sign-in risk policy| [Security Administrator](permissions-reference.md#security-administrator) |  |
> | Configure and enable or disable user risk policy | [Security Administrator](permissions-reference.md#security-administrator) |  |
> | Configure weekly digests | [Security Administrator](permissions-reference.md#security-administrator) |  |
> | Dismiss all risk detections | [Security Administrator](permissions-reference.md#security-administrator) |  |
> | Fix or dismiss vulnerability | [Security Administrator](permissions-reference.md#security-administrator) |  |
> | Read all configuration | [Security Reader](permissions-reference.md#security-reader) |  |
> | Read all risk detections | [Security Reader](permissions-reference.md#security-reader) |  |
> | Read vulnerabilities | [Security Reader](permissions-reference.md#security-reader) |  |

## Licenses

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Assign license | [License Administrator](permissions-reference.md#license-administrator) | [User Administrator](permissions-reference.md#user-administrator) |
> | Read all configuration | [Directory Readers](permissions-reference.md#directory-readers) | [Default user role](../fundamentals/users-default-permissions.md) |
> | Revoke license | [License Administrator](permissions-reference.md#license-administrator) | [User Administrator](permissions-reference.md#user-administrator) |
> | Try or buy subscription | [Billing Administrator](permissions-reference.md#billing-administrator) |  |

## Monitoring - Audit logs

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Read audit logs | [Reports Reader](permissions-reference.md#reports-reader) | [Security Reader](permissions-reference.md#security-reader)<br/>[Security Administrator](permissions-reference.md#security-administrator) |

## Monitoring - Sign-ins

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Read sign-in logs | [Reports Reader](permissions-reference.md#reports-reader) | [Security Reader](permissions-reference.md#security-reader)<br/>[Security Administrator](permissions-reference.md#security-administrator)<br/> [Global Reader](permissions-reference.md#global-reader) |

## Multi-factor authentication

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Delete all existing app passwords generated by the selected users | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | [Disable per-user MFA](../authentication/howto-mfa-userstates.md) | [Authentication Administrator](permissions-reference.md#authentication-administrator) | [Privileged Authentication Administrator](permissions-reference.md#privileged-authentication-administrator) |
> | [Enable per-user MFA](../authentication/howto-mfa-userstates.md) | [Authentication Administrator](permissions-reference.md#authentication-administrator)  | [Privileged Authentication Administrator](permissions-reference.md#privileged-authentication-administrator) | 
> | Manage MFA service settings | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |
> | Require selected users to provide contact methods again | [Authentication Administrator](permissions-reference.md#authentication-administrator) |  |
> | Restore multi-factor authentication on all remembered devices  | [Authentication Administrator](permissions-reference.md#authentication-administrator) |  |

## MFA Server

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Block/unblock users | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |
> | Configure account lockout | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |
> | Configure caching rules | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |
> | Configure fraud alert | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |
> | Configure notifications | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |
> | Configure one-time bypass | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |
> | Configure phone call settings | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |
> | Configure providers | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |
> | Configure server settings | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |
> | Read activity report | [Global Reader](permissions-reference.md#global-reader) |  |
> | Read all configuration | [Global Reader](permissions-reference.md#global-reader) |  |
> | Read server status | [Global Reader](permissions-reference.md#global-reader) |  |

## Organizational relationships

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Manage identity providers | [External Identity Provider Administrator](permissions-reference.md#external-identity-provider-administrator) |  |
> | Manage settings | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Manage privacy statement and contact | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Read all configuration | [Global Reader](permissions-reference.md#global-reader) |  |

## Password reset

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure authentication methods | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Configure customization | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Configure notification | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Configure on-premises integration | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Configure password reset properties | [User Administrator](permissions-reference.md#user-administrator) | [Global Administrator](permissions-reference.md#global-administrator) |
> | Configure registration | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Read all configuration | [Security Administrator](permissions-reference.md#security-administrator) | [User Administrator](permissions-reference.md#user-administrator) |

## Privileged identity management

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Assign users to roles | [Privileged Role Administrator](permissions-reference.md#privileged-role-administrator) |  |
> | Configure role settings | [Privileged Role Administrator](permissions-reference.md#privileged-role-administrator) |  |
> | View audit activity | [Security Reader](permissions-reference.md#security-reader) |  |
> | View role memberships | [Security Reader](permissions-reference.md#security-reader) |  |

## Roles and administrators

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Manage role assignments | [Privileged Role Administrator](permissions-reference.md#privileged-role-administrator) |  |
> | Read access review of a Microsoft Entra role  | [Security Reader](permissions-reference.md#security-reader) | [Security Administrator](permissions-reference.md#security-administrator)<br/>[Privileged Role Administrator](permissions-reference.md#privileged-role-administrator) |
> | Read all configuration | [Default user role](../fundamentals/users-default-permissions.md) |  |

## Security - Authentication methods

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure authentication methods | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Configure password protection | [Security Administrator](permissions-reference.md#security-administrator) |  |
> | Configure smart lockout | [Security Administrator](permissions-reference.md#security-administrator) |
> | Read all configuration | [Global Reader](permissions-reference.md#global-reader) |  |

## Security - Conditional Access

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure MFA trusted IP addresses | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) |  |
> | Create custom controls | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Create named locations | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Create policies | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Create terms of use | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Create VPN connectivity certificate | [Global Administrator](permissions-reference.md#global-administrator) | &nbsp; |
> | Delete classic policy | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Delete terms of use | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Delete VPN connectivity certificate | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Disable classic policy | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Manage custom controls | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Manage named locations | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Manage terms of use | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Read all configuration | [Security Reader](permissions-reference.md#security-reader) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Read named locations | [Security Reader](permissions-reference.md#security-reader) | [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator)<br/>[Security Administrator](permissions-reference.md#security-administrator) |

## Security - Identity security score

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles | 
> | ---- | --------------------- | ---------------- |
> | Read all configuration | [Security Reader](permissions-reference.md#security-reader) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Read security score | [Security Reader](permissions-reference.md#security-reader) | [Security Administrator](permissions-reference.md#security-administrator) |
> | Update event status | [Security Administrator](permissions-reference.md#security-administrator) |  |

## Security - Risky sign-ins

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Read all configuration | [Security Reader](permissions-reference.md#security-reader) |  |
> | Read risky sign-ins | [Security Reader](permissions-reference.md#security-reader) |  |

## Security - Users flagged for risk

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Dismiss all events | [Security Administrator](permissions-reference.md#security-administrator) |  |
> | Read all configuration | [Security Reader](permissions-reference.md#security-reader) |  |
> | Read users flagged for risk | [Security Reader](permissions-reference.md#security-reader) |  |

## Temporary Access Pass 

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Create, delete, or view a Temporary Access Pass for any user (except themselves) and can configure and manage authentication method policy | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Create, delete, or view a Temporary Access Pass for admins or members (except themselves) | [Privileged Authentication Administrator](permissions-reference.md#privileged-authentication-administrator) |  |
> | Create, delete, or view a Temporary Access Pass for members (except themselves) | [Authentication Administrator](permissions-reference.md#authentication-administrator) |  |
> | View a Temporary Access Pass details for a user (without reading the code itself) | [Global Reader](permissions-reference.md#global-reader) |  |
> | Configure or update the Temporary Access Pass authentication method policy | [Authentication Policy Administrator](permissions-reference.md#authentication-policy-administrator) |  |

## Tenant Creation

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Create Microsoft Entra ID or Azure AD B2C Tenant | [Tenant Creator](permissions-reference.md#tenant-creator) |  [Global Administrator](permissions-reference.md#global-administrator) |

## Users

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Add user to directory role | [Privileged Role Administrator](permissions-reference.md#privileged-role-administrator) |  |
> | Add user to group | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Assign license | [License Administrator](permissions-reference.md#license-administrator) | [User Administrator](permissions-reference.md#user-administrator) |
> | Create guest user | [Guest Inviter](permissions-reference.md#guest-inviter) | [User Administrator](permissions-reference.md#user-administrator) |
> | Reset guest user invite | [User Administrator](permissions-reference.md#user-administrator) | [Global Administrator](permissions-reference.md#global-administrator) |
> | Create user | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Delete users | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Invalidate refresh tokens of limited admins | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Invalidate refresh tokens of non-admins | [Helpdesk Administrator](permissions-reference.md#helpdesk-administrator) | [User Administrator](permissions-reference.md#user-administrator) |
> | Invalidate refresh tokens of privileged admins | [Privileged Authentication Administrator](permissions-reference.md#privileged-authentication-administrator) |  |
> | Read basic configuration | [Default user role](../fundamentals/users-default-permissions.md) |  |
> | Reset password for limited admins | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Reset password of non-admins | [Password Administrator](permissions-reference.md#password-administrator) | [User Administrator](permissions-reference.md#user-administrator) |
> | Reset password of privileged admins | [Privileged Authentication Administrator](permissions-reference.md#privileged-authentication-administrator) |  |
> | Revoke license | [License Administrator](permissions-reference.md#license-administrator) | [User Administrator](permissions-reference.md#user-administrator) |
> | Update all properties except User Principal Name | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Update User Principal Name for limited admins | [User Administrator](permissions-reference.md#user-administrator) |  |
> | Update User Principal Name property on privileged admins | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Update user settings | [Global Administrator](permissions-reference.md#global-administrator) |  |
> | Update Authentication methods | [Authentication Administrator](permissions-reference.md#authentication-administrator) | [Privileged Authentication Administrator](permissions-reference.md#privileged-authentication-administrator)<br/>[Global Administrator](permissions-reference.md#global-administrator) |

## Support

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Submit support ticket | [Service Support Administrator](permissions-reference.md#service-support-administrator) | [Application Administrator](permissions-reference.md#application-administrator)<br/>[Azure Information Protection Administrator](permissions-reference.md#azure-information-protection-administrator)<br/>[Billing Administrator](permissions-reference.md#billing-administrator)<br/>[Cloud Application Administrator](permissions-reference.md#cloud-application-administrator)<br/>[Compliance Administrator](permissions-reference.md#compliance-administrator)<br/>[Dynamics 365 Administrator](permissions-reference.md#dynamics-365-administrator)<br/>[Desktop Analytics Administrator](permissions-reference.md#desktop-analytics-administrator)<br/>[Exchange Administrator](permissions-reference.md#exchange-administrator)<br/>[Intune Administrator](permissions-reference.md#intune-administrator)<br/>[Password Administrator](permissions-reference.md#password-administrator)<br/>[Fabric Administrator](permissions-reference.md#fabric-administrator)<br/>[Privileged Authentication Administrator](permissions-reference.md#privileged-authentication-administrator)<br/>[SharePoint Administrator](permissions-reference.md#sharepoint-administrator)<br/>[Skype for Business Administrator](permissions-reference.md#skype-for-business-administrator)<br/>[Teams Administrator](permissions-reference.md#teams-administrator)<br/>[Teams Communications Administrator](permissions-reference.md#teams-communications-administrator)<br/>[User Administrator](permissions-reference.md#user-administrator) |

## Next steps

- [Assign Microsoft Entra roles to users](manage-roles-portal.md)
- [Assign Microsoft Entra roles at different scopes](assign-roles-different-scopes.md)
- [Create and assign a custom role in Microsoft Entra ID](custom-create.md)
- [Microsoft Entra built-in roles](permissions-reference.md)
