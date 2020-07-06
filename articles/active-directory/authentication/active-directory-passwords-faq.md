---
title: Self-service password reset FAQ - Azure Active Directory
description: Frequently asked questions about Azure AD self-service password reset

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 04/15/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: sahenry

ms.collection: M365-identity-device-management
---
# Password management frequently asked questions

The following are some frequently asked questions (FAQ) for all things related to password reset.

If you have a general question about Azure Active Directory (Azure AD) and self-service password reset (SSPR) that's not answered here, you can ask the community for assistance on the [Microsoft Q&A question page for Azure Active Directory](https://docs.microsoft.com/answers/topics/azure-active-directory.html). Members of the community include engineers, product managers, MVPs, and fellow IT professionals.

This FAQ is split into the following sections:

* [Questions about password reset registration](#password-reset-registration)
* [Questions about password reset](#password-reset)
* [Questions about password change](#password-change)
* [Questions about password management reports](#password-management-reports)
* [Questions about password writeback](#password-writeback)

## Password reset registration

* **Q:  Can my users register their own password reset data?**

  > **A:** Yes. As long as password reset is enabled and they are licensed, users can go to the password reset registration portal (https://aka.ms/ssprsetup) to register their authentication information. Users can also register through the Access Panel (https://myapps.microsoft.com). To register through the Access Panel, they need to select their profile picture, select **Profile**, and then select the **Register for password reset** option.
  >
  >
* **Q:  If I enable password reset for a group and then decide to enable it for everyone are my users required re-register?**

  > **A:** No. Users who have populated authentication data are not required to re-register.
  >
  >
* **Q:  Can I define password reset data on behalf of my users?**

  > **A:** Yes, you can do so with Azure AD Connect, PowerShell, the [Azure portal](https://portal.azure.com), or the [Microsoft 365 admin center](https://admin.microsoft.com). For more information, see [Data used by Azure AD self-service password reset](howto-sspr-authenticationdata.md).
  >
  >
* **Q:  Can I synchronize data for security questions from on-premises?**

  > **A:** No, this is not possible today.
  >
  >
* **Q:  Can my users register data in such a way that other users can't see this data?**

  > **A:** Yes. When users register data by using the password reset registration portal, the data is saved into private authentication fields that are visible only to global administrators and the user.
  >
  >
* **Q:  Do my users have to be registered before they can use password reset?**

  > **A:** No. If you define enough authentication information on their behalf, users don't have to register. Password reset works as long as you have properly formatted the data stored in the appropriate fields in the directory.
  >
  >
* **Q:  Can I synchronize or set the authentication phone, authentication email, or alternate authentication phone fields on behalf of my users?**

  > **A:** The fields that are able to be set by a Global Administrator are defined in the article [SSPR Data requirements](howto-sspr-authenticationdata.md).
  >
  >
* **Q:  How does the registration portal determine which options to show my users?**

  > **A:** The password reset registration portal shows only the options that you have enabled for your users. These options are found under the **User Password Reset Policy** section of your directory's **Configure** tab. For example, if you don't enable security questions, then users are not able to register for that option.
  >
  >
* **Q:  When is a user considered registered?**

  > **A:** A user is considered registered for SSPR when they have registered at least the **Number of methods required to reset** a password that you have set in the [Azure portal](https://portal.azure.com).
  >
  >

## Password reset

* **Q:  Do you prevent users from multiple attempts to reset a password in a short period of time?**

  > **A:** Yes, there are security features built into password reset to protect it from misuse. 
  >
  > Users can try only five password reset attempts within a 24 hour period before they're locked out for 24 hours. 
  >
  > Users can try to validate a phone number, send a SMS, or validate security questions and answers only five times within an hour before they're locked out for 24 hours. 
  >
  > Users can send an email a maximum of 10 times within a 10 minute period before they're locked out for 24 hours.
  >
  > The counters are reset once a user resets their password.
  >
  >
* **Q:  How long should I wait to receive an email, SMS, or phone call from password reset?**

  > **A:** Emails, SMS messages, and phone calls should arrive in under a minute. The normal case is 5 to 20 seconds.
  > If you don't receive the notification in this time frame:
  > * Check your junk folder.
  > * Check that the number or email being contacted is the one you expect.
  > * Check that the authentication data in the directory is correctly formatted, for example, +1 4255551234 or *user\@contoso.com*. 
* **Q:  What languages are supported by password reset?**

  > **A:** The password reset UI, SMS messages, and voice calls are localized in the same languages that are supported in Office 365.
  >
  >
* **Q:  What parts of the password reset experience get branded when I set the organizational branding items in my directory's configure tab?**

  > **A:** The password reset portal shows your organization's logo and allows you to configure the "Contact your administrator" link to point to a custom email or URL. Any email that's sent by password reset includes your organization's logo, colors, and name in the body of the email, and is customized from the settings for that particular name.
  >
  >
* **Q:  How can I educate my users about where to go to reset their passwords?**

  > **A:** Try some of the suggestions in our [SSPR deployment](howto-sspr-deployment.md#plan-communications) article.
  >
  >
* **Q:  Can I use this page from a mobile device?**

  > **A:** Yes, this page works on mobile devices.
  >
  >
* **Q:  Do you support unlocking local Active Directory accounts when users reset their passwords?**

  > **A:** Yes. When a user resets their password, if password writeback has been deployed through Azure AD Connect, that user's account is automatically unlocked when they reset their password.
  >
  >
* **Q:  How can I integrate password reset directly into my user's desktop sign-in experience?**

  > **A:** If you're an Azure AD Premium customer, you can install Microsoft Identity Manager at no additional cost and deploy the on-premises password reset solution.
  >
  >
* **Q:  Can I set different security questions for different locales?**

  > **A:** No, this is not possible today.
  >
  >
* **Q:  How many questions can I configure for the security questions authentication option?**

  > **A:** You can configure up to 20 custom security questions in the [Azure portal](https://portal.azure.com).
  >
  >
* **Q:  How long can security questions be?**

  > **A:** Security questions can be 3 to 200 characters long.
  >
  >
* **Q:  How long can the answers to security questions be?**

  > **A:** Answers can be 3 to 40 characters long.
  >
  >
* **Q:  Are duplicate answers to security questions rejected?**

  > **A:** Yes, we reject duplicate answers to security questions.
  >
  >
* **Q:  Can a user register the same security question more than once?**

  > **A:** No. After a user registers a particular question, they can't register for that question a second time.
  >
  >
* **Q:  Is it possible to set a minimum limit of security questions for registration and reset?**

  > **A:** Yes, one limit can be set for registration and another for reset. Three to five security questions can be required for registration, and three to five questions can be required for reset.
  >
  >
* **Q:  I configured my policy to require users to use security questions for reset, but the Azure administrators seem to be configured differently.**

  > **A:** This is the expected behavior. Microsoft enforces a strong default two-gate password reset policy for any Azure administrator role. This prevents administrators from using security questions. You can find more information about this policy in the [Password policies and restrictions in Azure Active Directory](concept-sspr-policy.md) article.
  >
  >
* **Q:  If a user has registered more than the maximum number of questions required to reset, how are the security questions selected during reset?**

  > **A:** *N* number of security questions are selected at random out of the total number of questions a user has registered for, where *N* is the amount that is set for the **Number of questions required to reset** option. For example, if a user has registered five security questions, but only three are required to reset a password, three of the five questions are randomly selected and are presented at reset. To prevent question hammering, if the user gets the answers to the questions wrong the selection process starts over.
  >
  >
* **Q:  How long are the email and SMS one-time passcodes valid?**

  > **A:** The session lifetime for password reset is 15 minutes. From the start of the password reset operation, the user has 15 minutes to reset their password. The email and SMS one-time passcode are valid for 5 minutes during the password reset session.
  >
  >
* **Q:  Can I block users from resetting their password?**

  > **A:** Yes, if you use a group to enable SSPR, you can remove an individual user from the group that allows users to reset their password. If the user is a Global Administrator they will retain the ability to reset their password and this cannot be disabled.
  >
  >

## Password change

* **Q:  Where should my users go to change their passwords?**

  > **A:** Users can change their passwords anywhere they see their profile picture or icon, like in the upper-right corner of their [Office 365](https://portal.office.com) portal or [Access Panel](https://myapps.microsoft.com) experiences. Users can change their passwords from the [Access Panel Profile page](https://account.activedirectory.windowsazure.com/r#/profile). Users can also be asked to change their passwords automatically at the Azure AD sign-in page if their passwords have expired. Finally, users can browse to the [Azure AD password change portal](https://account.activedirectory.windowsazure.com/ChangePassword.aspx) directly if they want to change their passwords.
  >
  >
* **Q:  Can my users be notified in the Office portal when their on-premises password expires?**

  > **A:** Yes, this is possible today if you use Active Directory Federation Services (AD FS). If you use AD FS, follow the instructions in the [Sending password policy claims with AD FS](https://technet.microsoft.com/windows-server-docs/identity/ad-fs/operations/configure-ad-fs-to-send-password-expiry-claims?f=255&MSPPError=-2147217396) article. If you use password hash synchronization, this is not possible today. We don't sync password policies from on-premises directories, so it's not possible for us to post expiration notifications to cloud experiences. In either case, it's also possible to [notify users whose passwords are about to expire through PowerShell](https://social.technet.microsoft.com/wiki/contents/articles/23313.notify-active-directory-users-about-password-expiry-using-powershell.aspx).
  >
  >
* **Q:  Can I block users from changing their password?**

  > **A:** For cloud-only users, password changes can't be blocked. For on-premises users, you can set the **User cannot change password** option to selected. The selected users can't change their password.
  >
  >

## Password management reports

* **Q:  How long does it take for data to show up on the password management reports?**

  > **A:** Data should appear on the password management reports in 5 to 10 minutes. In some instances, it might take up to an hour to appear.
  >
  >
* **Q:  How can I filter the password management reports?**

  > **A:** To filter the password management reports, select the small magnifying glass to the extreme right of the column labels, near the top of the report. If you want to do richer filtering, you can download the report to Excel and create a pivot table.
  >
  >
* **Q: What is the maximum number of events that are stored in the password management reports?**

  > **A:** Up to 75,000 password reset or password reset registration events are stored in the password management reports, spanning back as far as 30 days. We are working to expand this number to include more events.
  >
  >
* **Q:  How far back do the password management reports go?**

  > **A:** The password management reports show operations that occurred within the last 30 days. For now, if you need to archive this data, you can download the reports periodically and save them in a separate location.
  >
  >
* **Q:  Is there a maximum number of rows that can appear on the password management reports?**

  > **A:** Yes. A maximum of 75,000 rows can appear on either of the password management reports, whether they are shown in the UI or are downloaded.
  >
  >
* **Q:  Is there an API to access the password reset or registration reporting data?**

  > **A:** Yes. To learn how you can access the password reset reporting data, see the [Azure Log Analytics REST API Reference](/rest/api/loganalytics/).
  >
  >

## Password writeback

* **Q:  How does password writeback work behind the scenes?**

  > **A:** See the article [How password writeback works](howto-sspr-writeback.md) for an explanation of what happens when you enable password writeback and how data flows through the system back into your on-premises environment.
  >
  >
* **Q:  How long does password writeback take to work? Is there a synchronization delay like there is with password hash sync?**

  > **A:** Password writeback is instant. It is a synchronous pipeline that works fundamentally differently than password hash synchronization. Password writeback allows users to get real-time feedback about the success of their password reset or change operation. The average time for a successful writeback of a password is under 500 ms.
  >
  >
* **Q:  If my on-premises account is disabled, how is my cloud account and access affected?**

  > **A:** If your on-premises ID is disabled, your cloud ID and access will also be disabled at the next sync interval through Azure AD Connect. By default, this sync is every 30 minutes.
  >
  >
* **Q:  If my on-premises account is constrained by an on-premises Active Directory password policy, does SSPR obey this policy when I change my password?**

  > **A:** Yes, SSPR relies on and abides by the on-premises Active Directory password policy. This policy includes the typical Active Directory domain password policy, as well as any defined, fine-grained password policies that are targeted to a user.
  >
  >
* **Q:  What types of accounts does password writeback work for?**

  > **A:** Password writeback works for user accounts that are synchronized from on-premises Active Directory to Azure AD, including federated, password hash synchronized, and Pass-Through Autentication Users.
  >
  >
* **Q:  Does password writeback enforce my domain's password policies?**

  > **A:** Yes. Password writeback enforces password age, history, complexity, filters, and any other restriction you might put in place on passwords in your local domain.
  >
  >
* **Q:  Is password writeback secure?  How can I be sure I won't get hacked?**

  > **A:** Yes, password writeback is secure. To read more about the multiple layers of security implemented by the password writeback service, check out the [Password writeback security](concept-sspr-writeback.md#password-writeback-security) section in the [Password writeback overview](howto-sspr-writeback.md) article.
  >
  >

## Next steps

* [How do I complete a successful rollout of SSPR?](howto-sspr-deployment.md)
* [Reset or change your password](../user-help/active-directory-passwords-update-your-own-password.md)
* [Register for self-service password reset](../user-help/active-directory-passwords-reset-register.md)
* [Do you have a licensing question?](concept-sspr-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](howto-sspr-authenticationdata.md)
* [What authentication methods are available to users?](concept-sspr-howitworks.md#authentication-methods)
* [What are the policy options with SSPR?](concept-sspr-policy.md)
* [What is password writeback and why do I care about it?](howto-sspr-writeback.md)
* [How do I report on activity in SSPR?](howto-sspr-reporting.md)
* [What are all of the options in SSPR and what do they mean?](concept-sspr-howitworks.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
