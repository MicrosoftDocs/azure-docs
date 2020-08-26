---
title: Troubleshoot self-service password reset - Azure Active Directory
description: Learn how to troubleshoot common problems and resolution steps for self-service password reset in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: troubleshooting
ms.date: 08/26/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: rhicock

ms.collection: M365-identity-device-management
---
# Troubleshoot self-service password reset in Azure Active Directory

Are you having a problem with Azure Active Directory (Azure AD) self-service password reset (SSPR)? The following information can help you to get things working again.

## Troubleshoot self-service password reset errors that a user might see

| Error | Details | Technical details |
| --- | --- | --- |
| TenantSSPRFlagDisabled = 9 | We’re sorry, you can't reset your password at this time because your administrator has disabled password reset for your organization. There is no further action you can take to resolve this situation. Please contact your admin and ask them to enable this feature. To learn more, see [Help, I forgot my Azure AD password](../user-help/active-directory-passwords-update-your-own-password.md#common-problems-and-their-solutions). | SSPR_0009: We've detected that password reset has not been enabled by your administrator. Please contact your admin and ask them to enable password reset for your organization. |
| WritebackNotEnabled = 10 |We’re sorry, you can't reset your password at this time because your administrator has not enabled a necessary service for your organization. There is no further action you can take to resolve this situation. Please contact your admin and ask them to check your organization’s configuration. To learn more about this necessary service, see [Configuring password writeback](./tutorial-enable-sspr-writeback.md). | SSPR_0010: We've detected that password writeback has not been enabled. Please contact your admin and ask them to enable password writeback. |
| SsprNotEnabledInUserPolicy = 11 | We’re sorry, you can't reset your password at this time because your administrator has not configured password reset for your organization. There is no further action you can take to resolve this situation. Contact your admin and ask them to configure password reset. To learn more about password reset configuration, see [Quickstart: Azure AD self-service password reset](./tutorial-enable-sspr.md). | SSPR_0011: Your organization has not defined a password reset policy. Please contact your admin and ask them to define a password reset policy. |
| UserNotLicensed = 12 | We’re sorry, you can't reset your password at this time because required licenses are missing from your organization. There is no further action you can take to resolve this situation. Please contact your admin and ask them to check your license assignment. To learn more about licensing, see [Licensing requirements for Azure AD self-service password reset](./concept-sspr-licensing.md). | SSPR_0012: Your organization does not have the required licenses necessary to perform password reset. Please contact your admin and ask them to review the license assignments. |
| UserNotMemberOfScopedAccessGroup = 13 | We’re sorry, you can't reset your password at this time because your administrator has not configured your account to use password reset. There is no further action you can take to resolve this situation. Please contact your admin and ask them to configure your account for password reset. To learn more about account configuration for password reset, see [Roll out password reset for users](./howto-sspr-deployment.md). | SSPR_0013: You are not a member of a group enabled for password reset. Contact your admin and request to be added to the group. |
| UserNotProperlyConfigured = 14 | We’re sorry, you can't reset your password at this time because necessary information is missing from your account. There is no further action you can take to resolve this situation. Please contact you admin and ask them to reset your password for you. After you have access to your account again, you need to register the necessary information. To register information, follow the steps in the [Register for self-service password reset](../user-help/active-directory-passwords-reset-register.md) article. | SSPR_0014: Additional security info is needed to reset your password. To proceed, contact your admin and ask them to reset your password. After you have access to your account, you can register additional security info at https://aka.ms/ssprsetup. Your admin can add additional security info to your account by following the steps in [Set and read authentication data for password reset](howto-sspr-authenticationdata.md). |
| OnPremisesAdminActionRequired = 29 | We’re sorry, we can't reset your password at this time because of a problem with your organization’s password reset configuration. There is no further action you can take to resolve this situation. Please contact your admin and ask them to investigate. To learn more about the potential problem, see [Troubleshoot password writeback](#troubleshoot-password-writeback). | SSPR_0029: We are unable to reset your password due to an error in your on-premises configuration. Please contact your admin and ask them to investigate. |
| OnPremisesConnectivityError = 30 | We’re sorry, we can't reset your password at this time because of connectivity issues to your organization. There is no action to take right now, but the problem might be resolved if you try again later. If the problem persists, please contact your admin and ask them to investigate. To learn more about connectivity issues, see [Troubleshoot password writeback connectivity](#troubleshoot-password-writeback-connectivity). | SSPR_0030: We can't reset your password due to a poor connection with your on-premises environment. Contact your admin and ask them to investigate.|

## Troubleshoot the password reset configuration in the Azure portal

| Error | Solution |
| --- | --- |
| I don't see the **Password reset** section under Azure AD in the Azure portal. | This can happen if you don't have an Azure AD license assigned to the administrator performing the operation. <br> <br> Assign a license to the administrator account in question. You can follow the steps in the [Assign, verify, and resolve problems with licenses](../users-groups-roles/licensing-groups-assign.md#step-1-assign-the-required-licenses) article.|
| I don't see a particular configuration option. | Many elements of the UI are hidden until they are needed. Try enabling all the options you want to see. |
| I don't see the **On-premises integration** tab. | This option only becomes visible if you have downloaded Azure AD Connect and have configured password writeback. For more information, see [Getting started with Azure AD Connect by using the express settings](../hybrid/how-to-connect-install-express.md). |

## Troubleshoot password reset reporting

| Error | Solution |
| --- | --- |
| I don’t see any password management activity types in the **Self-Service Password Management** audit event category. | This can happen if you don't have an Azure AD license assigned to the administrator performing the operation. <br> <br> You can resolve this problem by assigning a license to the administrator account in question. Follow the steps in the [Assign, verify, and resolve problems with licenses](../users-groups-roles/licensing-groups-assign.md#step-1-assign-the-required-licenses) article. |
| User registrations show multiple times. | Currently, when a user registers, we log each individual piece of data that's registered as a separate event. <br> <br> If you want to aggregate this data and have greater flexibility in how you can view it, you can download the report and open the data as a pivot table in Excel.

## Troubleshoot the password reset registration portal

| Error | Solution |
| --- | --- |
| The directory is not enabled for password reset. **Your administrator has not enabled you to use this feature.** | Switch the **Self-service password reset enabled** flag to **Selected** or **All** and then select **Save**. |
| The user does not have an Azure AD license assigned. **Your administrator has not enabled you to use this feature.** | This can happen if you don't have an Azure AD license assigned to the administrator performing the operation. <br> <br> You can resolve this problem by assigning a license to the administrator account in question. Follow the steps in the [Assign, verify, and resolve problems with licenses](../users-groups-roles/licensing-groups-assign.md#step-1-assign-the-required-licenses) article.|
| There is an error processing the request. | This can be caused by many issues, but generally this error is caused by either a service outage or a configuration issue. If you see this error and it affects your business, contact Microsoft support for additional assistance. |

## Troubleshoot the password reset portal

| Error | Solution |
| --- | --- |
| The directory is not enabled for password reset. | Switch the **Self-service password reset enabled** flag to **Selected** or **All** and then select **Save**. |
| The user does not have an Azure AD license assigned. | This can happen if you don't have an Azure AD license assigned to the administrator performing the operation. <br> <br> You can resolve this problem if you assign a license to the administrator account in question. Follow the steps in the [Assign, verify, and resolve problems with licenses](../users-groups-roles/licensing-groups-assign.md#step-1-assign-the-required-licenses) article. |
| The directory is enabled for password reset, but the user has missing or malformed authentication information. | Before proceeding, ensure that user has properly formed contact data on file in the directory. For more information, see [Data used by Azure AD self-service password reset](howto-sspr-authenticationdata.md). |
| The directory is enabled for password reset, but the user has only one piece of contact data on file when the policy is set to require two verification methods. | Before proceeding, ensure that the user has at least two properly configured contact methods. An example is having both a mobile phone number *and* an office phone number. |
| The directory is enabled for password reset and the user is properly configured, but the user is unable to be contacted. | This can be the result of a temporary service error or if there is incorrect contact data that we can't properly detect. <br> <br> If the user waits 10 seconds, "try again" and "contact your administrator” links appear. If the user selects "try again," it retries the call. If the user selects “contact your administrator,” it sends a form email to their administrators requesting a password reset to be performed for that user account. |
| The user never receives the password reset SMS or phone call. | This can be the result of a malformed phone number in the directory. Make sure the phone number is in the format “+ccc xxxyyyzzzzXeeee”. <br> <br> Password reset does not support extensions, even if you specify one in the directory. The extensions are stripped before the call is dispatched. Use a number without an extension or integrate the extension into the phone number in your private branch exchange (PBX). |
| The user never receives the password reset email. | The most common cause for this problem is that the message is rejected by a spam filter. Check your spam, junk, or deleted items folder for the email. <br> <br> Also ensure that you're checking the correct email account for the message. |
| I have set a password reset policy, but when an admin account uses password reset, that policy isn't applied. | Microsoft manages and controls the administrator password reset policy to ensure the highest level of security. |
| The user is prevented from attempting a password reset too many times in a day. | We implement an automatic throttling mechanism to block users from attempting to reset their passwords too many times in a short period of time. Throttling occurs when: <br><ul><li>The user attempts to validate a phone number five times in one hour.</li><li>The user attempts to use the security questions gate five times in one hour.</li><li>The user attempts to reset a password for the same user account five times in one hour.</li></ul>To fix this problem, instruct the user to wait 24 hours after the last attempt. The user can then reset their password. |
| The user sees an error when validating their phone number. | This error occurs when the phone number entered does not match the phone number on file. Make sure the user is entering the complete phone number, including the area and country code, when they attempt to use a phone-based method for password reset. |
| There is an error processing the request. | This can be caused by many issues, but generally this error is caused by either a service outage or a configuration issue. If you see this error and it affects your business, contact Microsoft support for additional assistance. |
| On-premises policy violation | The password does not meet the on-premises Active Directory password policy. |
| Password does not comply fuzzy policy | The password that was used appears in the [banned password list](./concept-password-ban-bad.md#how-are-passwords-evaluated) and may not be used. |

## Azure AD forums

If you have a general question about Azure AD and self-service password reset, you can ask the community for assistance on the [Microsoft Q&A question page for Azure Active Directory](/answers/topics/azure-active-directory.html). Members of the community include engineers, product managers, MVPs, and fellow IT professionals.

## Contact Microsoft support

If you can't find the answer to a problem, our support teams are always available to assist you further.

To properly assist you, we ask that you provide as much detail as possible when opening a case. These details include:

* **General description of the error**: What is the error? What was the behavior that was noticed? How can we reproduce the error? Provide as much detail as possible.
* **Page**: What page were you on when you noticed the error? Include the URL if you're able to and a screenshot of the page.
* **Support code**: What was the support code that was generated when the user saw the error?
   * To find this code, reproduce the error, then select the **Support code** link at the bottom of the screen and send the support engineer the GUID that results.

   ![Find the support code at the bottom of the screen][Support code]

  * If you're on a page without a support code at the bottom, select F12 and search for the SID and CID and send those two results to the support engineer.
* **Date, time, and time zone**: Include the precise date and time *with the time zone* that the error occurred.
* **User ID**: Who was the user who saw the error? An example is *user\@contoso.com*.
   * Is this a federated user?
   * Is this a pass-through authentication user?
   * Is this a password-hash-synchronized user?
   * Is this a cloud-only user?
* **Licensing**: Does the user have an Azure AD license assigned?
* **Application event log**: If you're using password writeback and the error is in your on-premises infrastructure, include a zipped copy of your application event log from the Azure AD Connect server.

[Service restart]: ./media/active-directory-passwords-troubleshoot/servicerestart.png "Restart the Azure AD Sync service"
[Support code]: ./media/active-directory-passwords-troubleshoot/supportcode.png "The support code is located at the bottom right of the window"

## Next steps

The following articles provide additional information about password reset through Azure AD:

* [How do I complete a successful rollout of SSPR?](howto-sspr-deployment.md)
* [Reset or change your password](../user-help/active-directory-passwords-update-your-own-password.md)
* [Register for self-service password reset](../user-help/active-directory-passwords-reset-register.md)
* [Do you have a licensing question?](concept-sspr-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](howto-sspr-authenticationdata.md)
* [What authentication methods are available to users?](concept-sspr-howitworks.md#authentication-methods)
* [What are the policy options with SSPR?](concept-sspr-policy.md)
* [What is password writeback and why do I care about it?](./tutorial-enable-sspr-writeback.md)
* [How do I report on activity in SSPR?](howto-sspr-reporting.md)
* [What are all of the options in SSPR and what do they mean?](concept-sspr-howitworks.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)