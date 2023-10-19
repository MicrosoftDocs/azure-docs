---
title: Azure AD PowerShell cmdlets for reporting
description: Reference of the Azure AD PowerShell cmdlets for reporting.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 10/31/2022
ms.author: sarahlipsey
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management 
ms.custom: has-azure-ad-ps-ref
---
# Azure AD PowerShell cmdlets for reporting

> [!NOTE] 
> These PowerShell cmdlets currently only work with the [Azure Active Directory PowerShell for Graph Preview](/powershell/module/azuread/?view=azureadps-2.0-preview&preserve-view=true#directory_auditing) module. Please note that the preview module is not suggested for production use. 

To install the public preview release, use the following: 

```powershell
Install-module AzureADPreview
```

For more information on how to connect to Microsoft Entra ID using PowerShell, see the article [Azure AD PowerShell for Graph](/powershell/azure/active-directory/install-adv2).  

With Microsoft Entra reports, you can get details on activities around all the write operations in your direction (audit logs) and authentication data (sign-in logs). Although the information is available by using the MS Graph API, now you can retrieve the same data by using the Azure AD PowerShell cmdlets for reporting.

This article gives you an overview of the PowerShell cmdlets to use for audit logs and sign-in logs.

## Audit logs

[Audit logs](concept-audit-logs.md) provide traceability through logs for all changes done by various features within Microsoft Entra ID. Examples of audit logs include changes made to any resources within Microsoft Entra ID like adding or removing users, apps, groups, roles, and policies.

You get access to the audit logs using the `Get-AzureADAuditDirectoryLogs` cmdlet.


| Scenario                      | PowerShell command |
| :--                           | :--                |
| Application Display Name      | `Get-AzureADAuditDirectoryLogs -Filter "initiatedBy/app/displayName eq 'Azure AD Cloud Sync'"` |
| Category                      | `Get-AzureADAuditDirectoryLogs -Filter "category eq 'ApplicationManagement'"` |
| Activity Date Time            | `Get-AzureADAuditDirectoryLogs -Filter "activityDateTime gt 2019-04-18"` |
| All of the above              | `Get-AzureADAuditDirectoryLogs -Filter "initiatedBy/app/displayName eq 'Azure AD Cloud Sync' and category eq 'ApplicationManagement' and activityDateTime gt 2019-04-18"` |


The following image shows an example for this command. 

![Screenshot shows the result of the `Get Azure AD Audit Directory Logs` command.](./media/reference-powershell-reporting/get-azureadauditdirectorylogs.png)



## Sign-in logs

The [sign-ins](concept-sign-ins.md) logs provide information about the usage of managed applications and user sign-in activities.

You get access to the sign-in logs using the `Get-AzureADAuditSignInLogs` cmdlet.


| Scenario                      | PowerShell command |
| :--                           | :--                |
| User Display Name             | `Get-AzureADAuditSignInLogs -Filter "userDisplayName eq 'Timothy Perkins'"` |
| Create Date Time              | `Get-AzureADAuditSignInLogs -Filter "createdDateTime gt 2019-04-18T17:30:00.0Z"` (Everything since 5:30 pm on 4/18) |
| Status                        | `Get-AzureADAuditSignInLogs -Filter "status/errorCode eq 50105"` |
| Application Display Name      | `Get-AzureADAuditSignInLogs -Filter "appDisplayName eq 'StoreFrontStudio [wsfed enabled]'"` |
| All of the above              | `Get-AzureADAuditSignInLogs -Filter "userDisplayName eq 'Timothy Perkins' and status/errorCode ne 0 and appDisplayName eq 'StoreFrontStudio [wsfed enabled]'"` |


The following image shows an example for this command. 

![Screenshot shows the result of the `Get Azure A D Audit Sign In Logs` command.](./media/reference-powershell-reporting/get-azureadauditsigninlogs.png)



## Next steps

- [Microsoft Entra reports overview](./overview-monitoring-health.md).
- [Audit logs report](concept-audit-logs.md). 
- [Programmatic access to Microsoft Entra reports](./howto-configure-prerequisites-for-reporting-api.md)
