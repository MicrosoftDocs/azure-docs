---
title: Delegate roles by admin task - Azure Active Directory | Microsoft Docs
description: Roles to delegate for identity tasks in Azure Active Directory
services: active-directory
documentationcenter: ''
author: rolyon
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: reference
ms.date: 11/05/2020
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
#Customer intent: As an Azure AD administrator, I want to know which role has the least privilege for a given task to make my Azure AD organization more secure.
---

# Administrator roles by admin task in Azure Active Directory

In this article, you can find the information needed to restrict a user's administrator permissions by assigning least privileged roles in Azure Active Directory (Azure AD). You will find administrator tasks organized by feature area and the least privileged role required to perform each task, along with additional non-Global Administrator roles that can perform the task.

## Application proxy

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure application proxy app | Application Administrator |  |
> | Configure connector group properties | Application Administrator |  |
> | Create application registration when ability is disabled for all users | Application Developer | Cloud Application Administrator<br/>Application Administrator |
> | Create connector group | Application Administrator |  |
> | Delete connector group | Application Administrator |  |
> | Disable application proxy | Application Administrator |  |
> | Download connector service | Application Administrator |  |
> | Read all configuration | Application Administrator |  |

## External Identities/B2C

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Create Azure AD B2C directories | All non-guest users ([see documentation](../fundamentals/users-default-permissions.md)) |  |
> | Create B2C applications | Global Administrator |  |
> | Create enterprise applications | Cloud Application Administrator | Application Administrator |
> | Create, read, update, and delete B2C policies | B2C IEF Policy Administrator |  |
> | Create, read, update, and delete identity providers | External Identity Provider Administrator |  |
> | Create, read, update, and delete password reset user flows | External ID User Flow Administrator |  |
> | Create, read, update, and delete profile editing user flows | External ID User Flow Administrator |  |
> | Create, read, update, and delete sign-in user flows | External ID User Flow Administrator |  |
> | Create, read, update, and delete sign-up user flow |External ID User Flow Administrator |  |
> | Create, read, update, and delete user attributes | External ID User Flow Attribute Administrator |  |
> | Create, read, update, and delete users | User Administrator |  |
> | Configure B2B external collaboration settings | Global Administrator |  |
> | Read all configuration | Global Reader |  |
> | Read B2C audit logs | Global Reader ([see documentation](../../active-directory-b2c/faq.yml)) |  |

> [!NOTE]
> Azure AD B2C Global Administrators do not have the same permissions as Azure AD Global Administrators. If you have Azure AD B2C Global Administrator privileges, make sure that you are in an Azure AD B2C directory and not an Azure AD directory.

## Company branding

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure company branding | Global Administrator |  |
> | Read all configuration | Directory readers | Default user role ([see documentation](../fundamentals/users-default-permissions.md)) |

## Company properties

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure company properties | Global Administrator |  |

## Connect

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Passthrough authentication | Global Administrator |  |
> | Read all configuration | Global Reader | Global Administrator |
> | Seamless single sign-on | Global Administrator |  |

## Cloud Provisioning

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Passthrough authentication | Hybrid Identity Administrator |  |
> | Read all configuration | Global Reader | Hybrid Identity Administrator |
> | Seamless single sign-on | Hybrid Identity Administrator |  |

## Connect Health

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Add or delete services | Owner ([see documentation](../hybrid/how-to-connect-health-operations.md)) |  |
> | Apply fixes to sync error | Contributor ([see documentation](../fundamentals/users-default-permissions.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)) | Owner |
> | Configure notifications | Contributor ([see documentation](../fundamentals/users-default-permissions.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)) | Owner |
> | Configure settings | Owner ([see documentation](../hybrid/how-to-connect-health-operations.md)) |  |
> | Configure sync notifications | Contributor ([see documentation](../fundamentals/users-default-permissions.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)) | Owner |
> | Read ADFS security reports | Security Reader | Contributor<br/>Owner
> | Read all configuration | Reader ([see documentation](../fundamentals/users-default-permissions.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)) | Contributor<br/>Owner |
> | Read sync errors | Reader ([see documentation](../fundamentals/users-default-permissions.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)) | Contributor<br/>Owner |
> | Read sync services | Reader ([see documentation](../fundamentals/users-default-permissions.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)) | Contributor<br/>Owner |
> | View metrics and alerts | Reader ([see documentation](../fundamentals/users-default-permissions.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)) | Contributor<br/>Owner |
> | View metrics and alerts | Reader ([see documentation](../fundamentals/users-default-permissions.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)) | Contributor<br/>Owner |
> | View sync service metrics and alerts | Reader ([see documentation](../fundamentals/users-default-permissions.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)) | Contributor<br/>Owner |

## Custom domain names

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Manage domains | Domain Name Administrator |  |
> | Read all configuration | Directory readers | Default user role ([see documentation](../fundamentals/users-default-permissions.md)) |

## Domain Services

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Create Azure AD Domain Services instance | Global Administrator |  |
> | Perform all Azure AD Domain Services tasks | Azure AD DC Administrators group ([see documentation](../../active-directory-domain-services/tutorial-create-management-vm.md#administrative-tasks-you-can-perform-on-a-managed-domain)) |  |
> | Read all configuration | Reader on Azure subscription containing AD DS service |  |

## Devices

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Disable device | Cloud Device Administrator |  |
> | Enable device | Cloud Device Administrator |  |
> | Read basic configuration | Default user role ([see documentation](../fundamentals/users-default-permissions.md)) |  |
> | Read BitLocker keys | Security Reader | Password Administrator<br/>Security Administrator |

## Enterprise applications

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Consent to any delegated permissions | Cloud Application Administrator | Application Administrator |
> | Consent to application permissions not including Microsoft Graph | Cloud Application Administrator | Application Administrator |
> | Consent to application permissions to Microsoft Graph | Privileged Role Administrator |  |
> | Consent to applications accessing own data | Default user role ([see documentation](../fundamentals/users-default-permissions.md)) |  |
> | Create enterprise application | Cloud Application Administrator | Application Administrator |
> | Manage Application Proxy | Application Administrator |  |
> | Manage user settings | Global Administrator |  |
> | Read access review of a group or of an app | Security Reader | Security Administrator<br/>User Administrator |
> | Read all configuration | Default user role ([see documentation](../fundamentals/users-default-permissions.md)) |  |
> | Update enterprise application assignments | Enterprise application owner ([see documentation](../fundamentals/users-default-permissions.md)) | Cloud Application Administrator<br/>Application Administrator |
> | Update enterprise application owners | Enterprise application owner ([see documentation](../fundamentals/users-default-permissions.md)) | Cloud Application Administrator<br/>Application Administrator |
> | Update enterprise application properties | Enterprise application owner ([see documentation](../fundamentals/users-default-permissions.md)) | Cloud Application Administrator<br/>Application Administrator |
> | Update enterprise application provisioning | Enterprise application owner ([see documentation](../fundamentals/users-default-permissions.md)) | Cloud Application Administrator<br/>Application Administrator |
> | Update enterprise application self-service | Enterprise application owner ([see documentation](../fundamentals/users-default-permissions.md)) | Cloud Application Administrator<br/>Application Administrator |
> | Update single sign-on properties | Enterprise application owner ([see documentation](../fundamentals/users-default-permissions.md)) | Cloud Application Administrator<br/>Application Administrator |

## Entitlement management

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Add resources to a catalog | Identity Governance Administrator | With entitlement management, you can delegate this task to the catalog owner ([see documentation](../governance/entitlement-management-catalog-create.md#add-additional-catalog-owners)) |
> | Add SharePoint Online sites to catalog | SharePoint Administrator |  |

## Groups

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Assign license | User Administrator |  |
> | Create group | Groups Administrator | User Administrator |
> | Create, update, or delete access review of a group or of an app | User Administrator |  |
> | Manage group expiration | User Administrator |  |
> | Manage group settings | Groups Administrator | User Administrator |
> | Read all configuration (except hidden membership) | Directory readers | Default user role ([see documentation](../fundamentals/users-default-permissions.md)) |
> | Read hidden membership | Group member | Group owner<br/>Password Administrator<br/>Exchange Administrator<br/>SharePoint Administrator<br/>Teams Administrator<br/>User Administrator |
> | Read membership of groups with hidden membership | Helpdesk Administrator | User Administrator<br/>Teams Administrator |
> | Revoke license | License Administrator | User Administrator |
> | Update group membership | Group owner ([see documentation](../fundamentals/users-default-permissions.md)) | User Administrator |
> | Update group owners | Group owner ([see documentation](../fundamentals/users-default-permissions.md)) | User Administrator |
> | Update group properties | Group owner ([see documentation](../fundamentals/users-default-permissions.md)) | User Administrator |
> | Delete group | Groups Administrator | User Administrator |

## Identity Protection

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure alert notifications| Security Administrator |  |
> | Configure and enable or disable MFA policy| Security Administrator |  |
> | Configure and enable or disable sign-in risk policy| Security Administrator |  |
> | Configure and enable or disable user risk policy | Security Administrator |  |
> | Configure weekly digests | Security Administrator |  |
> | Dismiss all risk detections | Security Administrator |  |
> | Fix or dismiss vulnerability | Security Administrator |  |
> | Read all configuration | Security Reader |  |
> | Read all risk detections | Security Reader |  |
> | Read vulnerabilities | Security Reader |  |

## Licenses

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Assign license | License Administrator | User Administrator |
> | Read all configuration | Directory readers | Default user role ([see documentation](../fundamentals/users-default-permissions.md)) |
> | Revoke license | License Administrator | User Administrator |
> | Try or buy subscription | Billing Administrator |  |

## Monitoring - Audit logs

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Read audit logs | Reports Reader | Security Reader<br/>Security Administrator |

## Monitoring - Sign-ins

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Read sign-in logs | Reports Reader | Security Reader<br/>Security Administrator<br/> Global Reader |

## Multi-factor authentication

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Delete all existing app passwords generated by the selected users | Global Administrator |  |
> | Disable MFA | Authentication Administrator (via PowerShell) | Privileged Authentication Administrator (via PowerShell) |
> | Enable MFA | Authentication Administrator (via PowerShell) | Privileged Authentication Administrator (via PowerShell) | 
> | Manage MFA service settings | Authentication Policy Administrator |  |
> | Require selected users to provide contact methods again | Authentication Administrator |  |
> | Restore multi-factor authentication on all remembered devices  | Authentication Administrator |  |

## MFA Server

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Block/unblock users | Authentication Policy Administrator |  |
> | Configure account lockout | Authentication Policy Administrator |  |
> | Configure caching rules | Authentication Policy Administrator |  |
> | Configure fraud alert | Authentication Policy Administrator |  |
> | Configure notifications | Authentication Policy Administrator |  |
> | Configure one-time bypass | Authentication Policy Administrator |  |
> | Configure phone call settings | Authentication Policy Administrator |  |
> | Configure providers | Authentication Policy Administrator |  |
> | Configure server settings | Authentication Policy Administrator |  |
> | Read activity report | Global Reader |  |
> | Read all configuration | Global Reader |  |
> | Read server status | Global Reader |  |

## Organizational relationships

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Manage identity providers | External Identity Provider Administrator |  |
> | Manage settings | Global Administrator |  |
> | Manage terms of use | Global Administrator |  |
> | Read all configuration | Global Reader |  |

## Password reset

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure authentication methods | Global Administrator |  |
> | Configure customization | Global Administrator |  |
> | Configure notification | Global Administrator |  |
> | Configure on-premises integration | Global Administrator |  |
> | Configure password reset properties | User Administrator | Global Administrator |
> | Configure registration | Global Administrator |  |
> | Read all configuration | Security Administrator | User Administrator |

## Privileged identity management

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Assign users to roles | Privileged Role Administrator |  |
> | Configure role settings | Privileged Role Administrator |  |
> | View audit activity | Security Reader |  |
> | View role memberships | Security Reader |  |

## Roles and administrators

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Manage role assignments | Privileged Role Administrator |  |
> | Read access review of an Azure AD role  | Security Reader | Security Administrator<br/>Privileged Role Administrator |
> | Read all configuration | Default user role ([see documentation](../fundamentals/users-default-permissions.md)) |  |

## Security - Authentication methods

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure authentication methods | Global Administrator |  |
> | Configure password protection | Security Administrator |  |
> | Configure smart lockout | Security Administrator |
> | Read all configuration | Global Reader |  |

## Security - Conditional Access

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Configure MFA trusted IP addresses | Conditional Access Administrator |  |
> | Create custom controls | Conditional Access Administrator | Security Administrator |
> | Create named locations | Conditional Access Administrator | Security Administrator |
> | Create policies | Conditional Access Administrator | Security Administrator |
> | Create terms of use | Conditional Access Administrator | Security Administrator |
> | Create VPN connectivity certificate | Conditional Access Administrator | Security Administrator |
> | Delete classic policy | Conditional Access Administrator | Security Administrator |
> | Delete terms of use | Conditional Access Administrator | Security Administrator |
> | Delete VPN connectivity certificate | Conditional Access Administrator | Security Administrator |
> | Disable classic policy | Conditional Access Administrator | Security Administrator |
> | Manage custom controls | Conditional Access Administrator | Security Administrator |
> | Manage named locations | Conditional Access Administrator | Security Administrator |
> | Manage terms of use | Conditional Access Administrator | Security Administrator |
> | Read all configuration | Security Reader | Security Administrator |
> | Read named locations | Security Reader | Conditional Access Administrator<br/>Security Administrator |

## Security - Identity security score

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles | 
> | ---- | --------------------- | ---------------- |
> | Read all configuration | Security Reader | Security Administrator |
> | Read security score | Security Reader | Security Administrator |
> | Update event status | Security Administrator |  |

## Security - Risky sign-ins

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Read all configuration | Security Reader |  |
> | Read risky sign-ins | Security Reader |  |

## Security - Users flagged for risk

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Dismiss all events | Security Administrator |  |
> | Read all configuration | Security Reader |  |
> | Read users flagged for risk | Security Reader |  |

## Users

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Add user to directory role | Privileged Role Administrator |  |
> | Add user to group | User Administrator |  |
> | Assign license | License Administrator | User Administrator |
> | Create guest user | Guest inviter | User Administrator |
> | Create user | User Administrator |  |
> | Delete users | User Administrator |  |
> | Invalidate refresh tokens of limited admins (see documentation) | User Administrator |  |
> | Invalidate refresh tokens of non-admins (see documentation) | Password Administrator | User Administrator |
> | Invalidate refresh tokens of privileged admins (see documentation) | Privileged Authentication Administrator |  |
> | Read basic configuration | Default User role ([see documentation](../fundamentals/users-default-permissions.md) |  |
> | Reset password for limited admins (see documentation) | User Administrator |  |
> | Reset password of non-admins (see documentation) | Password Administrator | User Administrator |
> | Reset password of privileged admins | Privileged Authentication Administrator |  |
> | Revoke license | License Administrator | User Administrator |
> | Update all properties except User Principal Name | User Administrator |  |
> | Update User Principal Name for limited admins (see documentation) | User Administrator |  |
> | Update User Principal Name property on privileged admins (see documentation) | Global Administrator |  |
> | Update user settings | Global Administrator |  |
> | Update Authentication methods | Authentication Administrator | Privileged Authentication Administrator<br/>Global Administrator |

## Support

> [!div class="mx-tableFixed"]
> | Task | Least privileged role | Additional roles |
> | ---- | --------------------- | ---------------- |
> | Submit support ticket | Service Support Administrator | Application Administrator<br/>Azure Information Protection Administrator<br/>Billing Administrator<br/>Cloud Application Administrator<br/>Compliance Administrator<br/>Dynamics 365 Administrator<br/>Desktop Analytics Administrator<br/>Exchange Administrator<br/>Intune Administrator<br/>Password Administrator<br/>Power BI Administrator<br/>Privileged Authentication Administrator<br/>SharePoint Administrator<br/>Skype for Business Administrator<br/>Teams Administrator<br/>Teams Communications Administrator<br/>User Administrator<br/>Workplace Analytics Administrator |

## Next steps

* [How to assign or remove azure AD administrator roles](manage-roles-portal.md)
* [Azure AD built-in roles](permissions-reference.md)
