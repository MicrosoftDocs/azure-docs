---
title: Compare administrator role documentation for workloads in Microsoft 365 in Azure AD | Microsoft Docs
description: Find documentation and API references for administrator roles for Microsoft 365 workloads in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.component: users-groups-roles
ms.topic: article
ms.date: 01/17/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
#As an Azure AD administrator, to delegate permissions across Microsoft 365 workloads quickly and accurately I want to know where the documentation is for admin roles.

---

# Compare administrator roles for workloads in Microsoft 365

This document provides a list of Microsoft 365 (M365) workloads accompanied by links to role documentation and feature area API documentation. 

## Where to find documentation

Microsoft 365 workload | Role documentation | API documentation
---------------------- | ------------------ | -----------------
Azure AD | [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Privileged Identity Management | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Exchange | [Exchange role-based access control](https://docs.microsoft.com/en-us/exchange/understanding-role-based-access-control-exchange-2013-help) |  [PowerShell for Exchange](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/add-managementroleentry?view=exchange-ps)<br>[Fetch role assignments](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/get-rolegroup?view=exchange-ps)
SharePoint | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Teams/Skype for Business | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Intune | [Intune role-based access control](https://docs.microsoft.com/intune/role-based-access-control) | [Graph API](https://docs.microsoft.com/graph/api/resources/intune-rbac-conceptual?view=graph-rest-beta)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/intune-rbac-roledefinition-list?view=graph-rest-beta)
Managed Desktop | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Azure AD Identity Protection | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Windows Defender Advanced Threat Protection | [Defender role-based access control](https://docs.microsoft.com/windows/security/threat-protection/windows-defender-atp/rbac-windows-defender-advanced-threat-protection) | No public API now.
Office Security (Advanced Threat Protection, Exchange Online Protection) | [Security permissions](https://docs.microsoft.com/office365/SecurityCompliance/permissions-in-the-security-and-compliance-center) | 
[PowerShell for Office Security](https://docs.microsoft.com/powershell/exchange/office-365-scc/office-365-scc-powershell?view=exchange-ps)<br>
[Fetch role assignments](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/get-rolegroup?view=exchange-ps)
Azure Advanced Threat Protection | [Azure ATP role groups](https://docs.microsoft.com/azure-advanced-threat-protection/atp-role-groups) | No public API now.
Azure Information Protection | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)
Office Compliance (Information Protection) | [Security permissions](https://docs.microsoft.com/office365/SecurityCompliance/permissions-in-the-security-and-compliance-center) | [Exchange PowerShell](https://docs.microsoft.com/powershell/exchange/office-365-scc/office-365-scc-powershell?view=exchange-ps)<br>
[Fetch role assignments](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/get-rolegroup?view=exchange-ps)
Microsoft Cloud App Security | [Role-based access control](https://docs.microsoft.com/cloud-app-security/manage-admins) | [API reference](https://docs.microsoft.com/cloud-app-security/api-tokens) 
Security and Compliance Center | [Security permissions](https://docs.microsoft.com/office365/SecurityCompliance/permissions-in-the-security-and-compliance-center) | [Exchange PowerShell](https://docs.microsoft.com/powershell/exchange/office-365-scc/office-365-scc-powershell?view=exchange-ps)<br>
[Fetch role assignments](https://docs.microsoft.com/powershell/module/exchange/role-based-access-control/get-rolegroup?view=exchange-ps)
Compliance Manager | [Security permissions](https://docs.microsoft.com/office365/securitycompliance/meet-data-protection-and-regulatory-reqs-using-microsoft-cloud#permissions-and-role-based-access-control) | No public API now.
Secure Score | See [Azure AD admin roles](directory-assign-admin-roles.md) | [Graph API](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)<br>[Fetch role assignments](https://docs.microsoft.com/graph/api/directoryrole-list?view=graph-rest-1.0)

## Next steps

* [How to assign or remove azure AD administrator roles](directory-manage-roles-portal.md)
* [Azure AD administrator roles reference](directory-assign-admin-roles.md)
