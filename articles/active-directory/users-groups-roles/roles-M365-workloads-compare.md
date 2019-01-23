---
title: Compare administrator role content for workloads in Microsoft 365 in Azure AD | Microsoft Docs
description: Find content and API references for administrator roles for Microsoft 365 workloads in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.component: users-groups-roles
ms.topic: article
ms.date: 01/23/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
#As an Azure AD administrator, to delegate permissions across Microsoft 365 workloads quickly and accurately I want to know where the content is for admin roles.

---

# Compare administrator roles for workloads in Microsoft 365

This article provides a list of Microsoft 365 workloads accompanied by links to role content and feature area API content. General discussions of delegation issues can be found in [Is your security operations center running flat with limited role-based access control?](https://techcommunity.microsoft.com/t5/Announcements/Is-your-SOC-running-flat-with-limited-RBAC/m-p/320015#M49) and [Role delegation planning in Azure Active Directory](roles-concept-delegation.md).

## Where to find content

Microsoft 365 workload | Role content | API content
---------------------- | ------------------ | -----------------
Admin roles in Office 365 and Microsoft 365 Business plans | [Security permissions](https://docs.microsoft.com/office365/admin/add-users/about-admin-roles?view=o365-worldwide) | Not available
Azure AD | [Azure Active Directory (Azure AD) admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Azure Advanced Threat Protection | [Azure ATP role groups](https://docs.microsoft.com/azure-advanced-threat-protection/atp-role-groups) | Not available
Azure Information Protection | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Azure AD Identity Protection | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Compliance Manager | [Security permissions](https://docs.microsoft.com/office365/securitycompliance/meet-data-protection-and-regulatory-reqs-using-microsoft-cloud#permissions-and-role-based-access-control) | Not available
Exchange Online| [Exchange role-based access control](https://docs.microsoft.com/exchange/understanding-role-based-access-control-exchange-2013-help) |  [PowerShell for Exchange](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/add-managementroleentry?view=exchange-ps)<br>[Fetch role assignments](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/get-rolegroup?view=exchange-ps)
Intune | [Intune role-based access control](https://docs.microsoft.com/intune/role-based-access-control) | [Graph API](https://docs.microsoft.com/graph/api/resources/intune-rbac-conceptual?view=graph-rest-beta)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/intune-rbac-roledefinition-list?view=graph-rest-beta)
Managed Desktop | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Microsoft Cloud App Security | [Role-based access control](https://docs.microsoft.com/cloud-app-security/manage-admins) | [API reference](https://docs.microsoft.com/cloud-app-security/api-tokens) 
Office Compliance (Information Protection) | [Security permissions](https://docs.microsoft.com/office365/SecurityCompliance/permissions-in-the-security-and-compliance-center) | [Exchange PowerShell](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/add-managementroleentry?view=exchange-ps)<br>[Fetch role assignments](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/get-rolegroup?view=exchange-ps)
Office Security (Office 365 Advanced Threat Protection, Exchange Online Protection) | [Security permissions](https://docs.microsoft.com/office365/SecurityCompliance/permissions-in-the-security-and-compliance-center) | [Exchange PowerShell](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/add-managementroleentry?view=exchange-ps)<br>[Fetch role assignments](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/get-rolegroup?view=exchange-ps)
Privileged Identity Management | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Secure Score | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Security & Compliance Center | [Security permissions](https://docs.microsoft.com/office365/SecurityCompliance/permissions-in-the-security-and-compliance-center) | [Exchange PowerShell](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/add-managementroleentry?view=exchange-ps)<br>[Fetch role assignments](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/get-rolegroup?view=exchange-ps)
SharePoint Online | See [Azure AD admin roles](directory-assign-admin-roles.md)<br>Also [About the SharePoint admin role in Office 365](https://docs.microsoft.com/sharepoint/sharepoint-admin-role) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Teams/Skype for Business | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Windows Defender Advanced Threat Protection | [Windows Defender ATP role-based access control](https://docs.microsoft.com/windows/security/threat-protection/windows-defender-atp/rbac-windows-defender-advanced-threat-protection) | Not available

## Next steps

* [How to assign or remove Azure AD administrator roles](directory-manage-roles-portal.md)
* [Azure AD administrator roles reference](directory-assign-admin-roles.md)
