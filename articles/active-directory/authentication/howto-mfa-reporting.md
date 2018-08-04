---
title: Access and usage reports for Azure MFA | Microsoft Docs
description: This describes how to use the Azure Multi-Factor Authentication feature - reports.

services: multi-factor-authentication
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: michmcla

---
# Reports in Azure Multi-Factor Authentication

Azure Multi-Factor Authentication provides several reports that can be used by you and your organization accessible through the Azure portal. The following table lists the available reports:

| Report | Location | Description |
|:--- |:--- |:--- |
| Blocked User History | Azure AD > MFA Server > Block/unblock users | Shows the history of requests to block or unblock users. |
| Usage and fraud alerts | Azure AD > Sign-ins | Provides information on overall usage, user summary, and user details; as well as a history of fraud alerts submitted during the date range specified. |
| Usage for on-premises components | Azure AD > MFA Server > Activity Report | Provides information on overall usage for MFA through the NPS extension, ADFS, and MFA server. |
| Bypassed User History | Azure AD > MFA Server > One-time bypass | Provides a history of requests to bypass Multi-Factor Authentication for a user. |
| Server status | Azure AD > MFA Server > Server status | Displays the status of Multi-Factor Authentication Servers associated with your account. |

## View reports 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left, select **Azure Active Directory** > **MFA Server**.
3. Select the report that you wish to view.

   <center>![Cloud](./media/howto-mfa-reporting/report.png)</center>

## PowerShell reporting

Identify users who have registered for MFA using the PowerShell that follows.

```Get-MsolUser -All | where {$_.StrongAuthenticationMethods -ne $null} | Select-Object -Property UserPrincipalName```

Identify users who have not registered for MFA using the PowerShell that follows.

```Get-MsolUser -All | where {$_.StrongAuthenticationMethods.Count -eq 0} | Select-Object -Property UserPrincipalName```

## Next steps

* [For Users](../user-help/multi-factor-authentication-end-user.md)
* [Where to deploy](concept-mfa-whichversion.md)
