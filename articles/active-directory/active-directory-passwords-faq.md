<properties
	pageTitle="FAQ: Azure AD Password Management | Microsoft Azure"
	description="Frequently asked questions (FAQ) about password management in Azure AD, including password reset, registration, reports, and writeback to on-premises Active Directory ."
	services="active-directory"
	documentationCenter=""
	authors="asteen"
	manager="femila"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="asteen"/>

# Password Management Frequently Asked Questions

> [AZURE.IMPORTANT] **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).

The following are some frequently asked questions for all things related to password management.

If you find yourself with a question that you don't know the answer to, or are looking for help with a particular problem you are facing, you can read on below to see if we've covered it already.  If we haven't already, don't worry! Feel free to ask any question you have that's not covered here on the [Azure AD Forums](https://social.msdn.microsoft.com/Forums/home?forum=WindowsAzureAD) and we'll get back to you as soon as we can.

This FAQ is split into the following sections:

- [**Questions about Password Reset Registration**](#password-reset-registration)
- [**Questions about Password Reset**](#password-reset)
- [**Questions about Password Management Reports**](#password-management-reports)
- [**Questions about Password Writeback**](#password-writeback)

## Password reset registration
 - **Q:  Can my users register their own password reset data?**

 > **A:** Yes, as long as password reset is enabled and they are licensed, they can go to the Password Reset Registration portal at http://aka.ms/ssprsetup to register their authentication information to be used with password reset. Users can also register by going to the access panel at http://myapps.microsoft.com, clicking the profile tab, and clicking the Register for Password Reset option. Learn more about how to get your users configured for password reset by reading How to get users configured for password reset.

 - **Q:  Can I define password reset data on behalf of my users?**

 > **A:** Yes, you can do so with DirSync or PowerShell, or through the [Azure Management Portal](https://manage.windowsazure.com) or Office Admin portal. Learn more about this feature on the blog post Improved Privacy for Azure AD MFA and Password Reset Phone Numbers and by reading Learn how data is used by password reset.

 - **Q:  Can I synchronize data for security questions from on premises?**

 > **A:** No, this is not possible today, but we are considering it.

 - **Q:  Can my users register data in such a way that other users cannot see this data?**

 > **A:** Yes, when users register data using the Password Reset Registration Portal it gets saved into private authentication fields that are only visible by Global Administrators and the user himself. Learn more about this feature on the blog post Improved Privacy for Azure AD MFA and Password Reset Phone Numbers and by reading Learn how data is used by password reset.

 - **Q:  Do my users have to be registered before they can use password reset?**

 > **A:** No, if you define enough authentication information on their behalf, users will not have to register. Password reset will work just fine as long as you have properly formatted data stored in the appropriate fields in the directory. Learn more about by reading Learn how data is used by password reset.

 - **Q:  Can I synchronize or set the Authentication Phone, Authentication Email or Alternate Authentication Phone fields on behalf of my users?**

 > **A:** Not currently, but we are considering enabling this capability.

 - **Q:  How does the registration portal know which options to show my users?**

 > **A:** The password reset registration portal only shows the options that you have enabled for your users under the User Password Reset Policy section of your directory’s Configure tab. This means that if you do not enable, say, security questions, then users will not be able to register for that option.

 - **Q:  When is a user considered registered?**

 > **A:** A user is considered registered when he or she has at least N pieces of authentication info defined, where N is the Number of Authentication Methods Required that you have set in the [Azure Management Portal](https://manage.windowsazure.com). To learn more, see Customizing User Password Reset Policy.


## Password reset

 - **Q:  How long should I wait to receive an email, SMS, or phone call from password reset?**

 > **A:** Email, SMS messages, and phone calls should arrive in under 1 minute, with the normal case being 5-20 seconds. If you do not receive the notification in this timeframe, check your junk folder, that the number / email being contacted is the one you expect, and that the authentication data in the directory is correctly formatted. To learn more about formatting phone numbers and email addresses for use with password reset see Learn how data is used by password reset.

 - **Q:  What languages are supported by password reset?**

 > **A:** The password reset UI, SMS messages, and voice calls are localized in the same 40 languages that are supported in Office 365. Those are: Arabic, Bulgarian, Chinese Simplified, Chinese Traditional, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, German, Greek, Hebrew, Hindi, Hungarian, Indonesian, Italian, Japanese, Kazakh, Korean, Latvian, Lithuanian, Malay (Malaysia), Norwegian (Bokmål), Polish, Portuguese (Brazil), Portuguese (Portugal), Romanian, Russian, Serbian (Latin), Slovak, Slovenian, Spanish, Swedish, Thai, Turkish, Ukrainian, and Vietnamese.

 - **Q:  What parts of the password reset experience get branded when I set organizational branding in my directory’s configure tab?**

 > **A:** The password reset portal will show your organizational logo and will also allow you to configure the Contact your administrator link to point to a custom email or URL. Any email that gets sent by password reset will include your organization’s logo, colors (in this case red), name in the body of the email, and customized from name. See an example with all the branded elements below. To learn more, read Customizing Password Reset Look and Feel.

  ![][001]

 - **Q:  How can I educate my users about where to go to reset their passwords?**

 > **A:** You can send your users to https://passwordreset.microsoftonline.com directly, or you can instruct them to click on the Can’t access your account link found on any School or Work ID sign in screen. You can feel free to publish these links (or create URL redirects to them) in any place that is easily accessible to your users.

 - **Q:  Can I use this page from a mobile device?**

 > **A:** Yes, this page works on mobile devices.

 - **Q:  Do you support unlocking local active directory accounts when users reset their passwords?**

 > **A:** Yes, when a user resets his or her password and Password Writeback has been deployed with all versions of Azure AD Connect, or versions of Azure AD Sync 1.0.0485.0222 or later, then that user’s account will be automatically unlocked when that user resets his or her password.

 - **Q:  How can I integrate password reset directly into my user’s desktop sign-in experience?**

 > **A:** This is not possible today. However, if you absolutely need this capability and are an Azure AD Premium customer, you can install Microsoft Identity Manager at no additional cost and deploy the on-premises password reset solution found therein to solve this requirement.

 - **Q:  Can I set different security questions for different locales?**

 > **A:** No, this is not possible today, but we are considering it.

 - **Q:  How many questions can we configure for the Security Questions authentication option?**

 > **A:** You can configure up to 20 custom security questions in the [Azure Management Portal](https://manage.windowsazure.com).

 - **Q:  How long may security questions be?**

 > **A:** Security questions may be between 3 and 200 characters long.

 - **Q:  How long may answers to security questions be?**

 > **A:** Answers may be 3 to 40 characters long.

 - **Q:  Are duplicate answers to security questions rejected?**

 > **A:** Yes, we reject duplicate answers to security questions.

 - **Q:  May a user register more than one of the same security question?**

 > **A:** No, once a user registers a particular question, he or she may not register for that question a second time.

 - **Q:  Is it possible to set a minimum limit of security questions for registration and reset?**

 > **A:** Yes, one limit can be set for registration and another for reset. 3-5 security questions may be required for registration and 3-5 may be required for reset.

 - **Q:  If a user has registered more than the maximum number of questions required to reset, how are security questions selected during reset?**

 > **A:** N security questions are selected at random out of the total number of questions a user has registered for, where N is the minimum number of questions required for password reset. For example, if a user has 5 security questions registered, but only 3 are required to reset, 3 of those 5 will be selected randomly and presented to the user at the time of reset. If the user gets the answers to the questions wrong, the selection process re-occurs to prevent question hammering.

 - **Q:  Do you prevent users from attempting password reset many times in a short time period?**

 > **A:** Yes, there are several security features built into password reset. Users may only try 5 password reset attempts within an hour before being locked out for 24 hours. Users may only try to validate a phone number 5 times within an hour before being locked out for 24 hours. Users may only try a single authentication method 5 times within an hour before being locked out for 24 hours.

 - **Q:  For how long are the email and SMS one-time passcode valid?**

 > **A:** The session lifetime for password reset is 105 minutes. This means that from the beginning of the password reset operation, the user has 105 minutes to reset his or her password. The email and SMS one-time passcode are invalid after this time period expires.


## Password Management reports

 - **Q:  How long does it take for data to show up on the password management reports?**

 > **A:** Data should appear on the password management reports within 5-10 minutes. It some instances it may take up to an hour to appear.

 - **Q:  How can I filter the password management reports?**

 > **A:** You can filter the password management reports by clicking the small magnifying glass to the extreme right of the column labels, towards the top of the report (see screenshot). If you want to do richer filtering, you can download the report to excel and create a pivot table.

  ![][002]

 - **Q: What is the maximum number of events are stored in the password management reports?**

 > **A:** Up to 1,000 password reset or password reset registration events are stored in the password management reports.  We are working to expand this number to include more events.

 - **Q:  How far back do the password management reports go?**

 > **A:** The password management reports show operations occurring within the last 30 days. We are currently investigating how to make this a longer time period. For now, if you need to archive this data, you can download the reports periodically and save them in a separate location.

 - **Q:  Is there a maximum number of rows that can appear on the password management reports?**

 > **A:** Yes, a maximum of 1,000 rows may appear on either of the Password Management reports, whether they are being shown in the UI or being downloaded. We are currently investigating how to increase this limit.

 - **Q:  Is there an API to access the password reset or registration reporting data?**

 > **A:** Yes, please see the following documentation to learn how you can access the password reset reporting data stream.  [Learn how to access password reset reporting events programmatically](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprActivityEvent).

## Password Writeback
 - **Q:  How does Password Writeback work behind the scenes?**

 > **A:** See [How Password Writeback works](active-directory-passwords-learn-more.md#how-password-writeback-works) for a detailed explanation of what happens when you enable Password Writeback, as well as how data flows through the system back into your on-premises environment. See [Password Writeback security model](active-directory-passwords-learn-more.md#password-writeback-security-model) in How Password Writeback works to learn how we ensure Password Writeback is a highly secure service.

 - **Q:  How long does Password Writeback take to work?  Is there a synchronization delay like with password hash sync?**

 > **A:** Password Writeback is instant. It is a synchronous pipeline that works fundamentally differently than password hash synchronization. Password Writeback allows users to get realtime feedback about the success of their password reset or change operation. The average time for a successful writeback of a password is under 500 ms.

 - **Q:  What types of accounts does Password Writeback work for?**

 > **A:** Password Writeback works for Federated and Password Hash Sync’d users.

 - **Q:  Does Password Writeback enforce my domain’s password policies?**

 > **A:** Yes, Password Writeback enforces password age, history, complexity, filters and any other restriction you may put in place on passwords in your local domain.

 - **Q:  Is Password Writeback secure?  How can I be sure I won’t get hacked?**

 > **A:** Yes, Password Writeback is extremely secure. To read more about the 4 layers of security implemented by the Password Writeback service, check out the [Password Writeback security model](active-directory-passwords-learn-more.md#password-writeback-security-model) in How Password Writeback works.




## Links to password reset documentation
Below are links to all of the Azure AD Password Reset documentation pages:

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).
* [**How it works**](active-directory-passwords-how-it-works.md) - learn about the six different components of the service and what each does
* [**Getting started**](active-directory-passwords-getting-started.md) - learn how to allow you users to reset and change their cloud or on-premises passwords
* [**Customize**](active-directory-passwords-customize.md) - learn how to customize the look & feel and behavior of the service to your organization's needs
* [**Best practices**](active-directory-passwords-best-practices.md) - learn how to quickly deploy and effectively manage passwords in your organization
* [**Get insights**](active-directory-passwords-get-insights.md) - learn about our integrated reporting capabilities
* [**Troubleshooting**](active-directory-passwords-troubleshoot.md) - learn how to quickly troubleshoot problems with the service
* [**Learn more**](active-directory-passwords-learn-more.md) - go deep into the technical details of how the service works


[001]: ./media/active-directory-passwords-faq/001.jpg "Image_001.jpg"
[002]: ./media/active-directory-passwords-faq/002.jpg "Image_002.jpg"
