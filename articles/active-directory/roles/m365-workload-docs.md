---
title: Admin role docs across Microsoft 365 services
description: Find content and API references for administrator roles for Microsoft 365 services in Microsoft Entra ID
services: active-directory
documentationcenter: ''
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: reference
ms.date: 11/05/2020
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
#Customer intent: As a Microsoft Entra administrator, to delegate permissions across Microsoft 365 services quickly and accurately I want to know where the content is for admin roles.
---

# Roles for Microsoft 365 services in Microsoft Entra ID

All products in Microsoft 365 can be managed with administrative roles in Microsoft Entra ID. Some products also provide additional roles that are specific to that product. For information on the roles supported by each product, see the table below. For guidelines about role security planning, see [Securing privileged access for hybrid and cloud deployments in Microsoft Entra ID](security-planning.md).

## Where to find content

> [!div class="mx-tableFixed"]
> | Microsoft 365 service | Role content | API content |
> | ---------------------- | ------------------ | ----------------- |
> | Admin roles in Office 365 and Microsoft 365 business plans | [Microsoft 365 admin roles](/office365/admin/add-users/about-admin-roles) | Not available |
> | Microsoft Entra ID and Microsoft Entra ID Protection| [Microsoft Entra built-in roles](permissions-reference.md) | [Graph API](/graph/api/overview)<br>[Fetch role assignments](/graph/api/directoryrole-list) |
> | Exchange Online| [Exchange role-based access control](/exchange/understanding-role-based-access-control-exchange-2013-help) |  [PowerShell for Exchange](/powershell/module/exchange/role-based-access-control/add-managementroleentry)<br>[Fetch role assignments](/powershell/module/exchange/role-based-access-control/get-rolegroup) |
> | SharePoint Online | [Microsoft Entra built-in roles](permissions-reference.md)<br>Also [About the SharePoint admin role in Microsoft 365](/sharepoint/sharepoint-admin-role) | [Graph API](/graph/api/overview)<br>[Fetch role assignments](/graph/api/directoryrole-list) |
> | Teams/Skype for Business | [Microsoft Entra built-in roles](permissions-reference.md) | [Graph API](/graph/api/overview)<br>[Fetch role assignments](/graph/api/directoryrole-list) |
> | Security & Compliance Center (Office 365 Advanced Threat Protection, Exchange Online Protection, Information Protection) | [Office 365 admin roles](/office365/SecurityCompliance/permissions-in-the-security-and-compliance-center) | [Exchange PowerShell](/powershell/module/exchange/role-based-access-control/add-managementroleentry)<br>[Fetch role assignments](/powershell/module/exchange/role-based-access-control/get-rolegroup) |
> | Secure Score | [Microsoft Entra built-in roles](permissions-reference.md) | [Graph API](/graph/api/overview)<br>[Fetch role assignments](/graph/api/directoryrole-list) |
> | Compliance Manager | [Compliance Manager roles](/office365/securitycompliance/meet-data-protection-and-regulatory-reqs-using-microsoft-cloud#permissions-and-role-based-access-control) | Not available |
> | Azure Information Protection | [Microsoft Entra built-in roles](permissions-reference.md) | [Graph API](/graph/api/overview)<br>[Fetch role assignments](/graph/api/directoryrole-list) |
> | Microsoft Defender for Cloud Apps | [Role-based access control](/cloud-app-security/manage-admins) | [API reference](/cloud-app-security/api-tokens)  |
> | Azure Advanced Threat Protection | [Azure ATP role groups](/azure-advanced-threat-protection/atp-role-groups) | Not available |
> | Windows Defender Advanced Threat Protection | [Windows Defender ATP role-based access control](/windows/security/threat-protection/windows-defender-atp/rbac-windows-defender-advanced-threat-protection) | Not available |
> | Privileged Identity Management | [Microsoft Entra built-in roles](permissions-reference.md) | [Graph API](/graph/api/overview)<br>[Fetch role assignments](/graph/api/directoryrole-list) |
> | Intune | [Intune role-based access control](/intune/role-based-access-control) | [Graph API](/graph/api/resources/intune-rbac-conceptual?view=graph-rest-beta&preserve-view=true)<br>[Fetch role assignments](/graph/api/intune-rbac-roledefinition-list?view=graph-rest-beta&preserve-view=true) |
> | Managed Desktop | [Microsoft Entra built-in roles](permissions-reference.md) | [Graph API](/graph/api/overview)<br>[Fetch role assignments](/graph/api/directoryrole-list) |

## Next steps

* [How to assign or remove Microsoft Entra administrator roles](manage-roles-portal.md)
* [Microsoft Entra built-in roles](permissions-reference.md)
