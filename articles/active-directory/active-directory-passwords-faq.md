---
title: 'FAQ: Azure AD SSPR | Microsoft Docs'
description: Frequently asked questions about Azure AD self-service password reset
services: active-directory
keywords: Active directory password management, password management, Azure AD self service password reset
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: joflore

---
# Password management frequently asked questions

The following are some frequently asked questions for all things related to password reset.

If you have a general question about Azure AD and self-service password reset, that is not answered here, you can ask the community for assistance on the [Azure Ad forums](https://social.msdn.microsoft.com/Forums/en-US/home?forum=WindowsAzureAD). Members of the community include Engineers, Product Managers, MVPs, and fellow IT Professionals.

This FAQ is split into the following sections:

* [**Questions about Password Reset Registration**](#password-reset-registration)
* [**Questions about Password Reset**](#password-reset)
* [**Questions about Password Change**](#password-change)
* [**Questions about password management Reports**](#password-management-reports)
* [**Questions about password writeback**](#password-writeback)

## Password reset registration
* **Q:  Can my users register their own password reset data?**

  > **A:** Yes, as long as password reset is enabled and they are licensed, they can go to the Password Reset Registration portal at http://aka.ms/ssprsetup to register their authentication information. Users can also register by going to the access panel at http://myapps.microsoft.com, clicking the profile tab, and clicking the Register for Password Reset option.
  >
  >
* **Q:  Can I define password reset data on behalf of my users?**

  > **A:** Yes, you can do so with Azure AD Connect, PowerShell, the [Azure portal](https://portal.azure.com), or the Office Admin portal. For more information, see the article [Data used by Azure AD Self-Service Password Reset](active-directory-passwords-data.md).
  >
  >
* **Q:  Can I synchronize data for security questions from on premises?**

  > **A:** This is not possible today.
  >
  >
* **Q:  Can my users register data in such a way that other users cannot see this data?**

  > **A:** Yes, when users register data using the Password Reset Registration Portal it is saved into private authentication fields that are only visible by Global Administrators and the user.
    >
    > [!NOTE]
    > If an **Azure Administrator account** registers their authentication phone number it is also populated into the mobile phone field and is visible.
    >
  >
  >
* **Q:  Do my users have to be registered before they can use password reset?**

  > **A:** No, if you define enough authentication information on their behalf, users do not have to register. Password reset works as long as you have properly formatted data stored in the appropriate fields in the directory.
  >
  >
* **Q:  Can I synchronize or set the Authentication Phone, Authentication Email or Alternate Authentication Phone fields on behalf of my users?**

  > **A:** This is not possible today.
  >
  >
* **Q:  How does the registration portal know which options to show my users?**

  > **A:** The password reset registration portal only shows the options that you have enabled for your users. These options are found under the User Password Reset Policy section of your directory’s Configure tab. For example, this means that if you do not enable security questions, then users are not able to register for that option.
  >
  >
* **Q:  When is a user considered registered?**

  > **A:** A user is considered registered for SSPR when they have registered at least the **Number of methods required to reset** that you have set in the [Azure portal](https://portal.azure.com).
  >
  >
## Password reset
* **Q:  How long should I wait to receive an email, SMS, or phone call from password reset?**

  > **A:** Email, SMS messages, and phone calls should arrive in under one minute, with the normal case being 5-20 seconds.
    >If you do not receive the notification in this time frame:
        > * Check your junk folder.
        > * Check the number or email being contacted is the one you expect.
        > * Check the authentication data in the directory is correctly formatted.
                >     * Example: "+1 4255551234" or "user@contoso.com"
  >
  >
* **Q:  What languages are supported by password reset?**

  > **A:** The password reset UI, SMS messages, and voice calls are localized in the same languages that are supported in Office 365.
  >
  >
* **Q:  What parts of the password reset experience get branded when I set organizational branding in my directory’s configure tab?**

  > **A:** The password reset portal shows your organizational logo and allows you to configure the Contact your administrator link to point to a custom email or URL. Any email that gets sent by password reset includes your organization’s logo, colors, name in the body of the email, and customized from name.
  >
  >
* **Q:  How can I educate my users about where to go to reset their passwords?**

  > **A:** You can send your users to https://passwordreset.microsoftonline.com directly, or you can instruct them to click the **Can’t access your account link** found on any Work or School sign-in page. You can also publish these links in a place easily accessible to your users.
  >
  >
* **Q:  Can I use this page from a mobile device?**

  > **A:** Yes, this page works on mobile devices.
  >
  >
* **Q:  Do you support unlocking local active directory accounts when users reset their passwords?**

  > **A:** Yes, when a user resets their password and password writeback has been deployed using Azure AD Connect, that user’s account is automatically unlocked when they reset their password.
  >
  >
* **Q:  How can I integrate password reset directly into my user’s desktop sign-in experience?**

  > **A:** If you are an Azure AD Premium customer, you can install Microsoft Identity Manager at no additional cost and deploy the on-premises password reset solution to meet this requirement.
  >
  >
* **Q:  Can I set different security questions for different locales?**

  > **A:** This is not possible today.
  >
  >
* **Q:  How many questions can we configure for the Security Questions authentication option?**

  > **A:** You can configure up to 20 custom security questions in the [Azure portal](https://portal.azure.com).
  >
  >
* **Q:  How long may security questions be?**

  > **A:** Security questions may be between 3 and 200 characters long.
  >
  >
* **Q:  How long may answers to security questions be?**

  > **A:** Answers may be 3 to 40 characters long.
  >
  >
* **Q:  Are duplicate answers to security questions rejected?**

  > **A:** Yes, we reject duplicate answers to security questions.
  >
  >
* **Q:  May a user register the same security question more than once?**

  > **A:** No, once a user registers a particular question, they may not register for that question a second time.
  >
  >
* **Q:  Is it possible to set a minimum limit of security questions for registration and reset?**

  > **A:** Yes, one limit can be set for registration and another for reset. 3-5 security questions may be required for registration and 3-5 may be required for reset.
  >
  >
* **Q:  If a user has registered more than the maximum number of questions required to reset, how are security questions selected during reset?**

  > **A:** N security questions are selected at random out of the total number of questions a user has registered for, where N is the **Number of questions required to reset**. For example, if a user has 5 security questions registered, but only 3 are required to reset, 3 of the 5 are selected randomly and presented at reset. If the user gets the answers to the questions wrong, the selection process reoccurs to prevent question hammering.
  >
  >
* **Q:  Do you prevent users from attempting password reset many times in a short time period?**

  > **A:** Yes, there are security features built into password reset to protect from misuse. Users may only try 5 password reset attempts within an hour before being locked out for 24 hours. Users may only try to validate a phone number 5 times within an hour before being locked out for 24 hours. Users may only try a single authentication method 5 times within an hour before being locked out for 24 hours.
  >
  >
* **Q:  For how long are the email and SMS one-time passcode valid?**

  > **A:** The session lifetime for password reset is 105 minutes. From the beginning of the password reset operation, the user has 105 minutes to reset their password. The email and SMS one-time passcode are invalid after this time period expires.
  >
  >

## Password change
* **Q:  Where should my users go to change their passwords?**

  > **A:** Users may change their passwords anywhere they see their profile picture or icon (like in the upper right corner of their [Office 365](https://portal.office.com) or [Access Panel](https://myapps.microsoft.com) experiences. Users may change their passwords from the [Access Panel profile page](https://account.activedirectory.windowsazure.com/r#/profile). Users may also be asked to change their passwords automatically at the Azure AD sign-in screen if their passwords have expired. Finally, users may navigate to the [Azure AD Password Change Portal](https://account.activedirectory.windowsazure.com/ChangePassword.aspx) directly if they wish to change their passwords.
  >
  >
* **Q:  Can my users be notified in the Office Portal when their on-premises password expires?**

  > **A:** This is possible today if you are using ADFS by following the instructions here: [Sending Password Policy Claims with ADFS](https://technet.microsoft.com/windows-server-docs/identity/ad-fs/operations/configure-ad-fs-to-send-password-expiry-claims?f=255&MSPPError=-2147217396). If you are using password hash synchronization, this is not possible today. This is because we do not sync password policies from on-premises, so it is not possible for us to post expiry notifications to cloud experiences. In either case, it is also possible to [notify users whose passwords are about to expire by using PowerShell](https://social.technet.microsoft.com/wiki/contents/articles/23313.notify-active-directory-users-about-password-expiry-using-powershell.aspx).
  >
  >

## Password management reports
* **Q:  How long does it take for data to show up on the password management reports?**

  > **A:** Data should appear on the password management reports within 5-10 minutes. It some instances it may take up to an hour to appear.
  >
  >
* **Q:  How can I filter the password management reports?**

  > **A:** You can filter the password management reports by clicking the small magnifying glass to the extreme right of the column labels, near the top of the report. If you want to do richer filtering, you can download the report to excel and create a pivot table.
  >
  >
* **Q: What is the maximum number of events are stored in the password management reports?**

  > **A:** Up to 75,000 password reset or password reset registration events are stored in the password management reports, spanning back up to 30 days.  We are working to expand this number to include more events.
  >
  >
* **Q:  How far back do the password management reports go?**

  > **A:** The password management reports show operations occurring within the last 30 days. For now, if you need to archive this data, you can download the reports periodically and save them in a separate location.
  >
  >
* **Q:  Is there a maximum number of rows that can appear on the password management reports?**

  > **A:** Yes, a maximum of 75,000 rows may appear on either of the password management reports, whether they are being shown in the UI or being downloaded.
  >
  >
* **Q:  Is there an API to access the password reset or registration reporting data?**

  > **A:** Yes, see the following documentation to learn how you can access the password reset reporting data stream.  [Learn how to access password reset reporting events programmatically](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprActivityEvent).
  >
  >

## Password writeback
* **Q:  How does password writeback work behind the scenes?**

  > **A:** See [How password writeback works](active-directory-passwords-writeback.md) for an explanation of what happens when you enable password writeback, and how data flows through the system back into your on-premises environment.
  >
  >
* **Q:  How long does password writeback take to work?  Is there a synchronization delay like with password hash sync?**

  > **A:** Password writeback is instant. It is a synchronous pipeline that works fundamentally differently than password hash synchronization. Password writeback allows users to get real-time feedback about the success of their password reset or change operation. The average time for a successful writeback of a password is under 500 ms.
  >
  >
* **Q:  If my on-premises account is disabled, how is my cloud account/access affected?**

  > **A:** If your on-premises ID is disabled, your cloud ID/access will also be disabled at the next sync interval via AAD Connect byt default this is every 30 minutes.
  >
  >
* **Q:  If my on-premises account is constrained by an on-premises Active Directory password policy, does SSPR obey this policy when I change the password?**

  > **A:** Yes, SSPR relies on and abides by the on-premises AD password policy, including typical AD domain password policy, as well as any defined fine grained password policies targeted to a given user.
  >
  >
* **Q:  What types of accounts does password writeback work for?**

  > **A:** Password writeback works for Federated and Password Hash Synchronized users.
  >
  >
* **Q:  Does password writeback enforce my domain’s password policies?**

  > **A:** Yes, password writeback enforces password age, history, complexity, filters, and any other restriction you may put in place on passwords in your local domain.
  >
  >
* **Q:  Is password writeback secure?  How can I be sure I won’t get hacked?**

  > **A:** Yes, password writeback is secure. To read more about the four layers of security implemented by the password writeback service, check out the [Password writeback security model](active-directory-passwords-writeback.md#password-writeback-security-model) section in How password writeback works.
  >
  >

## Next steps

The following links provide additional information regarding password reset using Azure AD

* [**Quick Start**](active-directory-passwords-getting-started.md) - Get up and running with Azure AD self service password management 
* [**Licensing**](active-directory-passwords-licensing.md) - Configure your Azure AD Licensing
* [**Data**](active-directory-passwords-data.md) - Understand the data that is required and how it is used for password management
* [**Rollout**](active-directory-passwords-best-practices.md) - Plan and deploy SSPR to your users using the guidance found here
* [**Customize**](active-directory-passwords-customize.md) - Customize the look and feel of the SSPR experience for your company.
* [**Reporting**](active-directory-passwords-reporting.md) - Discover if, when, and where your users are accessing SSPR functionality
* [**Policy**](active-directory-passwords-policy.md) - Understand and set Azure AD password policies
* [**Password Writeback**](active-directory-passwords-writeback.md) - How does password writeback work with your on-premises directory
* [**Technical Deep Dive**](active-directory-passwords-how-it-works.md) - Go behind the curtain to understand how it works
* [**Troubleshoot**](active-directory-passwords-troubleshoot.md) - Learn how to resolve common issues that we see with SSPR
