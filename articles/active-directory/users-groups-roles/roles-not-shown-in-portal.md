---
title: Azure AD roles that aren't shown in the portal - Azure Active Directory | Microsoft Docs
description: Why some roles aren't visible in the Azure portal in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 01/23/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
#As an Azure AD administrator, I want to know how to organize my approach to delegating roles
ms.collection: M365-identity-device-management
---

# Azure AD roles that aren't shown in the Azure portal

Not every role in Azure AD is available in the Azure portal, for a number of reasons. Some roles are still works in progress. Some roles have changed their names in one place but not in another. Some roles can't (because of technical limitations) or shouldn't (because of possible ill effects) be used. The following table can help you sort it all out.

API name | Azure portal status | Documentation
-------- | ------------------- | -------------
Company Administrator | Global Administrator | [See table in Role Template Ids section](directory-assign-admin-roles.md#role-template-ids)
CRM Service Administrator | Dynamics 365 administrator | [See table in Role Template Ids section](directory-assign-admin-roles.md#role-template-ids)
Device Join | Not shown because it's deprecated | [Documentation of deprecated roles](directory-assign-admin-roles.md#deprecated-roles)
Device Managers | Not shown because it's deprecated | [Documentation of deprecated roles](directory-assign-admin-roles.md#deprecated-roles)
Device Users | Not shown because it's deprecated | [Documentation of deprecated roles](directory-assign-admin-roles.md#deprecated-roles)
Directory Synchronization Accounts | Not shown because it shouldn't be used | [Directory Synchronization Accounts](directory-assign-admin-roles.md#directory-synchronization-accounts)
Directory Writers | Not shown because it shouldn't be used | [Directory Writers](directory-assign-admin-roles.md#directory-writers)
Guest User | Not shown because it can't be used  | NA
Lync Service Administrator | Skype for Business administrator | [See table in Role Template Ids section](directory-assign-admin-roles.md#role-template-ids)
Partner Tier 1 Support | Not shown because it shouldn't be used | [Partner Tier1 Support](directory-assign-admin-roles.md#partner-tier1-support)
Partner Tier 2 Support | Not shown because it shouldn't be used | [Partner Tier2 Support](directory-assign-admin-roles.md#partner-tier2-support)
Printer Administrator | Work in progress | Work in progress
Printer Technician | Work in progress | Work in progress
Restricted Guest User | Not shown because it can't be used | NA
User | Not shown because it can't be used | NA
Workplace Device Join | Not shown because it's deprecated | [Documentation of deprecated roles](directory-assign-admin-roles.md#deprecated-roles)
