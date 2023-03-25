---
title: Sign-in logs in Azure Active Directory
description: Conceptual information about Azure AD sign-in logs.  
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: report-monitor
ms.date: 03/24/2023
ms.author: sarahlipsey
ms.reviewer: besiler
ms.collection: M365-identity-device-management
---
# Sign-in logs in Azure Active Directory

Reviewing sign-in errors and patterns provides valuable insight into how your users access applications and services. The sign-in logs provided by Azure Active Directory (Azure AD) are a powerful type of [activity log](overview-reports.md) that IT administrators can analyze. This article explains how to access and utilize the sign-in logs.

Two other activity logs are also available to help monitor the health of your tenant:
- **[Audit](concept-audit-logs.md)** – Information about changes applied to your tenant, such as users and group management or updates applied to your tenant’s resources.
- **[Provisioning](concept-provisioning-logs.md)** – Activities performed by a provisioning service, such as the creation of a group in ServiceNow or a user imported from Workday.

## What can you do with sign-in logs?

You can use the sign-ins log to find answers to questions like:

- What is the sign-in pattern of a user?

- How many users have signed in over a week?

- What’s the status of these sign-ins?

## How do you access the sign-in logs?

You can always access your own sign-ins history at [https://mysignins.microsoft.com](https://mysignins.microsoft.com).

To access the sign-ins log for a tenant, you must have one of the following roles:

- Global Administrator
- Security Administrator
- Security Reader
- Global Reader
- Reports Reader

The sign-in activity report is available in [all editions of Azure AD](reference-reports-data-retention.md#how-long-does-azure-ad-store-the-data). If you have an Azure Active Directory P1 or P2 license, you can access the sign-in activity report through the Microsoft Graph API. See [Getting started with Azure Active Directory Premium](../fundamentals/active-directory-get-started-premium.md) to upgrade your Azure Active Directory edition. It will take a couple of days for the data to show up in Graph after you upgrade to a premium license with no data activities before the upgrade.

**To access the Azure AD sign-ins log:**

1. Sign in to the [Azure portal](https://portal.azure.com) using the appropriate least privileged role.
1. Go to **Azure Active Directory** > **Sign-ins log**.

    ![Screenshot of the Monitoring side menu with sign-in logs highlighted.](./media/concept-sign-ins/side-menu-sign-in-logs.png)

You can also access the sign-in logs from the following areas of Azure AD:

- Users
- Groups
- Enterprise applications

## View the sign-ins log

To more effectively view the sign-ins log, spend a few moments customizing the view for your needs. You can specify what columns to include and filter the data to narrow things down.

### Customize the layout

The sign-ins log has a default view, but you can customize the view using over 30 column options.

1. Select **Columns** from the menu at the top of the log.
1. Select the columns you want to view and select the **Save** button at the bottom of the window.

![Screenshot of the sign-in logs page with the Columns option highlighted.](./media/concept-sign-ins/sign-in-logs-columns.png)

### Filter the results <h3 id="filter-sign-in-activities"></h3>

Filtering the sign-ins log is a helpful way to quickly find logs that match a specific scenario. For example, you could filter the list to only view sign-ins that occurred in a specific geographic location, from a specific operating system, or from a specific type of credential.

Some filter options prompt you to select more options. Follow the prompts to make the selection you need for the filter. You can add multiple filters. 

Select the **Add filters** option from the top of the table to get started.

![Screenshot of the sign-in logs page with the Add filters option highlighted.](./media/concept-sign-ins/sign-in-logs-filter.png)

There are several filter options to choose from:

- **User:** The *user principal name* (UPN) of the user in question.
- **Status:** Options are *Success*, *Failure*, and *Interrupted*.
- **Resource:** The name of the service used for the sign-in.
- **Conditional access:** The status of the Conditional Access (CA) policy. Options are: 
    - *Not applied:* No policy applied to the user and application during sign-in.
    - *Success:* One or more CA policies applied to the user and application (but not necessarily the other conditions) during sign-in.
    - *Failure:* The sign-in satisfied the user and application condition of at least one CA policy and grant controls are either not satisfied or set to block access.
- **IP addresses:** There's no definitive connection between an IP address and where the computer with that address is physically located. Mobile providers and VPNs issue IP addresses from central pools that are often far from where the client device is actually used. Currently, converting IP address to a physical location is a best effort based on traces, registry data, reverse lookups and other information.

The following table provides the options and descriptions for the **Client app** filter option.

> [!NOTE]
> Due to privacy commitments, Azure AD does not populate this field to the home tenant in the case of a cross-tenant scenario.

|Name|Modern authentication|Description|
|---|:-:|---|
|Authenticated SMTP| |Used by POP and IMAP client's to send email messages.|
|Autodiscover| |Used by Outlook and EAS clients to find and connect to mailboxes in Exchange Online.|
|Exchange ActiveSync| |This filter shows all sign-in attempts where the EAS protocol has been attempted.|
|Browser|![Blue checkmark.](./media/concept-sign-ins/check.png)|Shows all sign-in attempts from users using web browsers|
|Exchange ActiveSync| | Shows all sign-in attempts from users with client apps using Exchange ActiveSync to connect to Exchange Online|
|Exchange Online PowerShell| |Used to connect to Exchange Online with remote PowerShell. If you block basic authentication for Exchange Online PowerShell, you need to use the Exchange Online PowerShell module to connect. For instructions, see [Connect to Exchange Online PowerShell using multi-factor authentication](/powershell/exchange/exchange-online/connect-to-exchange-online-powershell/mfa-connect-to-exchange-online-powershell).|
|Exchange Web Services| |A programming interface that's used by Outlook, Outlook for Mac, and third-party apps.|
|IMAP4| |A legacy mail client using IMAP to retrieve email.|
|MAPI over HTTP| |Used by Outlook 2010 and later.|
|Mobile apps and desktop clients|![Blue checkmark.](./media/concept-sign-ins/check.png)|Shows all sign-in attempts from users using mobile apps and desktop clients.|
|Offline Address Book| |A copy of address list collections that are downloaded and used by Outlook.|
|Outlook Anywhere (RPC over HTTP)| |Used by Outlook 2016 and earlier.|
|Outlook Service| |Used by the Mail and Calendar app for Windows 10.|
|POP3| |A legacy mail client using POP3 to retrieve email.|
|Reporting Web Services| |Used to retrieve report data in Exchange Online.|
|Other clients| |Shows all sign-in attempts from users where the client app isn't included or unknown.|

## Analyze the sign-in logs

Now that your sign-in logs table is formatted appropriately, you can more effectively analyze the data. Some common scenarios are described here, but they aren't the only ways to analyze sign-in data. Further analysis and retention of sign-in data can be accomplished by exporting the logs to other tools. 

### Sign-in error codes

If a sign-in failed, you can get more information about the reason in the **Basic info** section of the related log item. The error code and associated failure reason appear in the details. Because of the complexity of some Azure AD environments, we can't document every possible error code and resolution. Some errors may require [submitting a support request](../fundamentals/how-to-get-support.md) to resolve the issue.

![Screenshot of a sign-in error code.](./media/concept-sign-ins/error-code.png)

For a list of error codes related to Azure AD authentication and authorization, see the [Azure AD authentication and authorization error codes](../develop/reference-aadsts-error-codes.md) article. In some cases, the [sign-in error lookup tool](https://login.microsoftonline.com/error) may provide remediation steps. Enter the **Error code** provided in the sign-in log details into the tool and select the **Submit** button. 

![Screenshot of the error code lookup tool.](./media/concept-sign-ins/error-code-lookup-tool.png)

### Authentication details

The **Authentication Details** tab in the details of a sign-in log provides the following information for each authentication attempt:

- A list of authentication policies applied, such as Conditional Access or Security Defaults.
- A list of session lifetime policies applied, such as Sign-in frequency or Remember MFA.
- The sequence of authentication methods used to sign-in.
- If the authentication attempt was successful and the reason why.

This information allows you to troubleshoot each step in a user’s sign-in. Use these details to track:

- The volume of sign-ins protected by MFA. 
- The reason for the authentication prompt, based on the session lifetime policies.
- Usage and success rates for each authentication method.
- Usage of passwordless authentication methods, such as Passwordless Phone Sign-in, FIDO2, and Windows Hello for Business.
- How frequently authentication requirements are satisfied by token claims, such as when users aren't interactively prompted to enter a password or enter an SMS OTP.

While viewing the sign-ins log, select a sign-in event, and then select the **Authentication Details** tab.

![Screenshot of the Authentication Details tab](media/concept-sign-ins/authentication-details-tab.png)

When analyzing authentication details, take note of the following details:

- **OATH verification code** is logged as the authentication method for both OATH hardware and software tokens (such as the Microsoft Authenticator app).
- The **Authentication details** tab can initially show incomplete or inaccurate data until log information is fully aggregated. Known examples include: 
    - A **satisfied by claim in the token** message is incorrectly displayed when sign-in events are initially logged. 
    - The **Primary authentication** row isn't initially logged.
- If you're unsure of a detail in the logs, gather the **Request ID** and **Correlation ID** to use for further analyzing or troubleshooting.

#### Considerations for MFA sign-ins

When a user signs in with MFA, several separate MFA events are actually taking place. For example, if a user enters the wrong validation code or doesn't respond in time, additional MFA events are sent to reflect the latest status of the sign-in attempt. These sign-in events appear as one line item in the Azure AD sign-in logs. That same sign-in event in Azure Monitor, however, appears as multiple line items. These events all have the same `correlationId`.

## Sign-in data used by other services

Sign-in data is used by several services in Azure to monitor risky sign-ins and provide insight into application usage. 

### Risky sign-in data in Azure AD Identity Protection

Sign-in log data visualization that relates to risky sign-ins is available in the **Azure AD Identity Protection** overview, which uses the following data:

- Risky users
- Risky user sign-ins 
- Risky service principals
- Risky service principal sign-ins

 For more information about the Azure AD Identity Protection tools, see the [Azure AD Identity Protection overview](../identity-protection/overview-identity-protection.md).

![Screenshot of risky users in Identity Protection.](media/concept-sign-ins/id-protection-overview.png)

### Azure AD application and authentication sign-in activity

To view application-specific sign-in data, go to **Azure AD** and select **Usage & insights** from the Monitoring section. These reports provide a closer look at sign-ins for Azure AD application activity and AD FS application activity. For more information, see [Azure AD Usage & insights](concept-usage-insights-report.md).

![Screenshot of the Azure AD application activity report.](media/concept-sign-ins/azure-ad-app-activity.png)

Azure AD Usage & insights also provides the **Authentication methods activity** report, which breaks down authentication by the method used. Use this report to see how many of your users are set up with MFA or passwordless authentication.

![Screenshot of the Authentication methods report.](media/concept-sign-ins/azure-ad-authentication-methods.png)

### Microsoft 365 activity logs

You can view Microsoft 365 activity logs from the [Microsoft 365 admin center](/office365/admin/admin-overview/about-the-admin-center). Microsoft 365 activity and Azure AD activity logs share a significant number of directory resources. Only the Microsoft 365 admin center provides a full view of the Microsoft 365 activity logs. 

You can access the Microsoft 365 activity logs programmatically by using the [Office 365 Management APIs](/office/office-365-management-api/office-365-management-apis-overview).

## Next steps

- [Basic info in the Azure AD sign-in logs](reference-basic-info-sign-in-logs.md)

- [How to download logs in Azure Active Directory](howto-download-logs.md)

- [How to access activity logs in Azure AD](howto-access-activity-logs.md)