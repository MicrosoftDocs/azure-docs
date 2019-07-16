---
title: Azure AD PowerShell cmdlets for reporting | Microsoft Docs
description: Reference of the Azure AD PowerShell cmdlets for reporting.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: a1f93126-77d1-4345-ab7d-561066041161
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 07/12/2019
ms.author: markvi
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---
# Azure AD PowerShell cmdlets for reporting

With Azure Active Directory (Azure AD) reports, you can get the information you need to determine how your environment is doing. You can retrieve report data using the Azure AD PowerShell cmdlets for reporting.

This article gives you an overview of the cmdlet.




## Audit logs

[Audit logs](concept-audit-logs.md) provide traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.

You get access to the audit logs using the `Get-AzureADAuditDirectoryLogs cmdlet.


| Scenario                      | PowerShell command |
| :--                           | :--                |
| Application Display Name      | Get-AzureADAuditDirectoryLogs -Filter "initiatedBy/app/displayName eq 'Azure AD Cloud Sync'" |
| Category                      | Get-AzureADAuditDirectoryLogs -Filter "category eq 'Application Management'" |
| Activity Date Time            | Get-AzureADAuditDirectoryLogs -Filter "activityDateTime gt 2019-04-18" |
| All of the above              | Get-AzureADAuditDirectoryLogs -Filter "initiatedBy/app/displayName eq 'Azure AD Cloud Sync' and category eq 'Application Management' and activityDateTime gt 2019-04-18"|


The following image shows an example for this command. 

![The "Data Summary" button](./media/reference-powershell-reporting/get-azureadauditdirectorylogs.png)



## Sign-in logs

The [sign-ins](/concept-sign-ins.md) logs provide information about the usage of managed applications and user sign-in activities.

You get access to the sign-in logs using the `Get-AzureADAuditSignInLogs cmdlet.


| Scenario                      | PowerShell command |
| :--                           | :--                |
| User Display Name             | Get-AzureADAuditSignInLogs -Filter "userDisplayName eq 'Timothy Perkins'" |
| Create Date Time              | Get-AzureADAuditSignInLogs -Filter "createdDateTime gt 2019-04-18T17:30:00.0Z" (Everything since 5:30 pm on 4/18) |
| Status                        | Get-AzureADAuditSignInLogs -Filter "status/errorCode eq 50105" |
| Application Display Name      | Get-AzureADAuditSignInLogs -Filter "appDisplayName eq 'StoreFrontStudio [wsfed enabled]'" |
| All of the above              | Get-AzureADAuditSignInLogs -Filter "userDisplayName eq 'Timothy Perkins' and status/errorCode ne 0 and appDisplayName eq 'StoreFrontStudio [wsfed enabled]'" |


The following image shows an example for this command. 

![The "Data Summary" button](./media/reference-powershell-reporting/get-azureadauditsigninlogs.png)



## Next steps

- [Azure AD reports overview](overview-reports.md).
- [Audit logs report](concept-audit-logs.md). 
- [Programmatic access to Azure AD reports](concept-reporting-api.md)
