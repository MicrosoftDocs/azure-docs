---
title: 'Getting Started: Azure AD Password management | Microsoft Docs'
description: Enable users to reset their own passwords, discover pre-requisites for password reset, and enable password writeback to manage on-premises passwords in Active Directory.
services: active-directory
keywords: Active directory password management, password management, reset Azure AD password
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
editor: curtand

ms.assetid: bde8799f-0b42-446a-ad95-7ebb374c3bec
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/08/2017
ms.author: joflore

---
# Getting started with Password Management
> [!IMPORTANT]
> **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md#reset-your-password).
>
>

Enabling your users to manage their own cloud Azure Active Directory or on-premises Active Directory passwords takes just a few simple steps. After ensuring that you've met a few simple prerequisites, you'll have password change and reset enabled for your entire organization before you know it. This article will walk you through the following concepts:

* [**Top tips from our customers to read before you begin**](#top-tips-from-our-customers-to-read-before-you-begin)
 * [**TOP TIP: DOCUMENTATION NAVIGATION** - Use our table of contents and your browser's find feature to find answers](#top-tip-documentation-navigation---use-our-table-of-contents-and-your-browsers-find-feature-to-find-answers)
 * [**Tip 1: LICENSING** - Make sure you understand the licensing requirements](#tip-1-licensing---make-sure-you-understand-the-licensing-requirements)
 * [**Tip 2: TESTING** - Test with an end user, not an administrator, and pilot with a small set of users](#tip-2-testing---test-with-an-end-user-not-an-administrator-and-pilot-with-a-small-set-of-users)
 * [**Tip 3: DEPLOYMENT** - Pre-populate data for your users so they don't have to register](#tip-3-deployment---pre-populate-data-for-your-users-so-they-dont-have-to-register)
 * [**Tip 4: DEPLOYMENT** - Use password reset to obviate the need to communicate temporary passwords](#tip-4-deployment---use-password-reset-to-obviate-the-need-to-communicate-temporary-passwords)
 * [**Tip 5: WRITEBACK** - Look at the application event log on your AAD Connect machine to troubleshoot password writeback](#tip-5-writeback---look-at-the-application-event-log-on-your-aad-connect-machine-to-troubleshoot-password-writeback)
 * [**Tip 6: WRITEBACK** - Ensure you enable the correct permissions, firewall rules, and connection settings for password writeback](#tip-6-writeback---ensure-you-enable-the-correct-permissions-firewall-rules-and-connection-settings-for-password-writeback)
 * [**Tip 7: REPORTING** - See who is registering or resetting passwords with the Azure AD SSPR Audit Logs](#tip-7-reporting---see-who-is-registering-or-resetting-passwords-with-the-azure-ad-sspr-audit-logs)
 * [**Tip 8: TROUBLESHOOT** - Read our troubleshooting guide and FAQ to solve many issues](#tip-8-troubleshoot---read-our-troubleshooting-guide-and-faq-to-solve-many-issues)
 * [**Tip 9: TROUBLESHOOT** - If you still need help, include enough information for us to assist you](#tip-9-troubleshoot---if-you-still-need-help-include-enough-information-for-us-to-assist-you)
* [**How to enable users to reset their Azure Active Directory passwords**](#enable-users-to-reset-their-azure-ad-passwords)
 * [Self-service password reset prerequisites](#prerequisites)
 * [Step 1: Configure password reset policy](#step-1-configure-password-reset-policy)
 * [Step 2: Add contact data for your test user](#step-2-add-contact-data-for-your-test-user)
 * [Step 3: Reset your password as a user](#step-3-reset-your-azure-ad-password-as-a-user)
* [**How to enable users to reset or change their on-premises Active Directory passwords**](#enable-users-to-reset-or-change-their-ad-passwords)
 * [Password Writeback prerequisites](#writeback-prerequisites)
 * [Step 1: Download the latest version of Azure AD Connect](#step-1-download-the-latest-version-of-azure-ad-connect)
 * [Step 2: Enable Password Writeback in Azure AD Connect through the UI or PowerShell and verify](#step-2-enable-password-writeback-in-azure-ad-connect)
 * [Step 3: Configure your firewall](#step-3-configure-your-firewall)
 * [Step 4: Set up the appropriate permissions](#step-4-set-up-the-appropriate-active-directory-permissions)
 * [Step 5: Reset your AD password as a user and verify](#step-5-reset-your-ad-password-as-a-user)

## Top tips from our customers to read before you begin
Below are some of the top tips we've seen useful for customers deploying password management in their organization.

* [**TOP TIP: DOCUMENTATION NAVIGATION** - Use our table of contents and your browser's find feature to find answers](#top-tip-documentation-navigation---use-our-table-of-contents-and-your-browsers-find-feature-to-find-answers)
* [**Tip 1: LICENSING** - Make sure you understand the licensing requirements](#tip-1-licensing---make-sure-you-understand-the-licensing-requirements)
* [**Tip 2: TESTING** - Test with an end user, not an administrator, and pilot with a small set of users](#tip-2-testing---test-with-an-end-user-not-an-administrator-and-pilot-with-a-small-set-of-users)
* [**Tip 3: DEPLOYMENT** - Pre-populate data for your users so they don't have to register](#tip-3-deployment---pre-populate-data-for-your-users-so-they-dont-have-to-register)
* [**Tip 4: DEPLOYMENT** - Use password reset to obviate the need to communicate temporary passwords](#tip-4-deployment---use-password-reset-to-obviate-the-need-to-communicate-temporary-passwords)
* [**Tip 5: WRITEBACK** - Look at the application event log on your AAD Connect machine to troubleshoot password writeback](#tip-5-writeback---look-at-the-application-event-log-on-your-aad-connect-machine-to-troubleshoot-password-writeback)
* [**Tip 6: WRITEBACK** - Ensure you enable the correct permissions, firewall rules, and connection settings for password writeback](#tip-6-writeback---ensure-you-enable-the-correct-permissions-firewall-rules-and-connection-settings-for-password-writeback)
* [**Tip 7: REPORTING** - See who is registering or resetting passwords with the Azure AD SSPR Audit Logs](#tip-7-reporting---see-who-is-registering-or-resetting-passwords-with-the-azure-ad-sspr-audit-logs)
* [**Tip 8: TROUBLESHOOT** - Read our troubleshooting guide and FAQ to solve many issues](#tip-8-troubleshoot---read-our-troubleshooting-guide-and-faq-to-solve-many-issues)
* [**Tip 9: TROUBLESHOOT** - If you still need help, include enough information for us to assist you](#tip-9-troubleshoot---if-you-still-need-help-include-enough-information-for-us-to-assist-you)

### TOP TIP: DOCUMENTATION NAVIGATION - Use our table of contents and your browser's find feature to find answers
If you are using any of our documentation, we have tried hard to provide quicklinks to all of the interesting places for administrators to learn from in our table of contents. 

Check out the table of contents below: 
* [Azure AD Password Reset: Documentation Table of Contents](https://docs.microsoft.com/azure/active-directory/active-directory-passwords)

### Tip 1: LICENSING - Make sure you understand the licensing requirements
In order for Azure AD Password Reset to function, you must have at least once license assigned in your organization. We do not enforce per-user licensing on the password reset experience itself, however, if you make use of the feature without having a license assigned to a user, you will be considered out of compliance with your Microsoft licensing agreement and will need to assign licenses to those users.

Here are some documents that can help you to understand which licenses are required for password reset.
* [General password reset licensing information](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-customize#what-customization-options-are-available)
* [Per-feature password reset licensing information](https://docs.microsoft.com/azure/active-directory/active-directory-passwords#pricing-and-availability)
* [Scenarios supported for password writeback](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-learn-more#scenarios-supported-for-password-writeback)

### Tip 2: TESTING - Test with an end user, not an administrator, and pilot with a small set of users
When you test with an administrator, we enforce the administrator password reset policy, which is defined below.  This means that you will NOT see the expected results of the policy you have configured for your end users.

The policies configured in the administrative UX ONLY apply to end-users, not, administrators. Microsoft enforces strong default password reset policies for your administrators - which may be different than the policies you set for your end-users - in order to ensure your organization stays secure.

#### Administrator password reset policy
* **Applies to** - any administrator role (Global Administrator, Helpdesk Administrator, Password Administrator, etc.)
* **One gate policy applies...**
 * ...for first 30 days after a trial is started created **OR**
 * ...when a vanity domain is not present **AND** Azure AD Connect is not syncing identities
 * **_Requires_**: any **one** of Authentication Email, Alternate Email, Authentication Phone, Mobile Phone, or Office Phone to have a value present
* **Two gate policy applies...** 
 * ...after the first 30 days of a trial has passed **OR**
 * ...when a vanity domain is present **OR** 
 * ... you have enabled Azure AD Connect to synchronize identities from your on-premises environment
 * _**Requires**_: any **two** of Authentication Email, Alternate Email, Authentication Phone, Mobile Phone, or Office Phone to have a value present

### Tip 3: DEPLOYMENT - Pre-populate data for your users so they don't have to register
Many folks don't realize that you do not have to have your users register for password reset in order use the feature.  By setting phone or email properties up for your users beforehand, you can immediately roll out password reset to your entire organization **without requiring your users to do anything!**

To learn how to do this using an API, PowerShell, or Azure AD Connect, take a read of the documentation below:
* [Deploying password reset without requiring users to register](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-learn-more#deploying-password-reset-without-requiring-end-user-registration)
* [What data is used by password reset](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-learn-more#what-data-is-used-by-password-reset)

### Tip 4: DEPLOYMENT - Use password reset to obviate the need to communicate temporary passwords
This is a tag-on to tip 3. Once you pre-configure your users for password reset, imagine a scenario where an employee joins your company for the first time. Instead of communicating the temporary password to him or her, you can now just have them navigate to the [Azure AD Password Reset Portal](https://passwordreset.microsoftonline.com) to reset their passwords.

If the user is using a [Windows 10 Azure AD Domain-joined device](https://docs.microsoft.com/azure/active-directory/active-directory-azureadjoin-devices-group-policy), they can even do this right from the Windows 10 Out of Box sign in screen, allowing them to get access to a brand-new PC without you needing to lift a finger :).

To learn how to do this using an API, PowerShell, or Azure AD Connect, take a read of the documentation below. Once you pre-populate this data, just send your users to reset their passwords, and they can get into their accounts right away:
* [Deploying password reset without requiring users to register](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-learn-more#deploying-password-reset-without-requiring-end-user-registration)
* [What data is used by password reset](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-learn-more#what-data-is-used-by-password-reset)

### Tip 5: WRITEBACK - Look at the application event log on your AAD Connect machine to troubleshoot password writeback
The Azure AD Connect Application Event log contains a rich set of logging information that describes much of what is occuring with the password writeback service, in real time. To get access to this log, follow the steps below:

1. Sign in to your **Azure AD Connect** machine
2. Open the **Windows Event Viewer** by pressing **Start** and typing in **"Event Viewer"**
3. Open the **Application** event log
4. Look for events from the following sources: **PasswordResetService** or **ADSync** to learn more about what issue may be occuring

For a full list of events that can appear in this log, as well as a bunch more troubleshooting guidance for password writeback, see:
* [Troubleshoot: password writeback](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-troubleshoot#troubleshoot-password-writeback)
* [Writeback event log error codes](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-troubleshoot#password-writeback-event-log-error-codes)
* [Troubleshoot: password writeback connectivity](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-troubleshoot#troubleshoot-password-writeback-connectivity)
* [Writeback deployment - Step 3: Configure your firewall](#step-3-configure-your-firewall)
* [Writeback deployment - Step 4: Set up the appropriate permissions](#step-4-set-up-the-appropriate-active-directory-permissions)

### Tip 6: WRITEBACK - Ensure you enable the correct permissions, firewall rules, and connection settings for password writeback
In order for writeback to work correctly, you must ensure:

1. The proper **Active Directory permissions** have been set for users using the password writeback feature such that they have rights to modify their own passwords and account unlock flags in AD
2. The proper **firewall ports** have been opened to allow the password writeback service to communicate securely with the outside world using an outbound connection
3. The proper **firewall exceptions** have been made for key password reset service URLs, such as Service Bus
4. Your **proxy and firewall are not killing idle outbound connections**, we recommend 10 minutes or longer

For a full list of troubleshooting guidance and specific guidelines for configuring permissions and firewall rules for password writeback, see:
* [Troubleshoot: password writeback](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-troubleshoot#troubleshoot-password-writeback)
* [Writeback event log error codes](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-troubleshoot#password-writeback-event-log-error-codes)
* [Troubleshoot: password writeback connectivity](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-troubleshoot#troubleshoot-password-writeback-connectivity)
* [Writeback deployment - Step 3: Configure your firewall](#step-3-configure-your-firewall)
* [Writeback deployment - Step 4: Set up the appropriate permissions](#step-4-set-up-the-appropriate-active-directory-permissions)

### Tip 7: REPORTING - See who is registering or resetting passwords with the Azure AD SSPR Audit Logs 
Once password reset is deployed and working, the next logical step is to see it working and analyze who still needs to register, the common issues your users face when resetting, and your return on investment for the feature.

Using the Azure AD Password Reset Audit Logs, you can do this and much more from the Azure Portal, from PowerBI, from the Azure AD Reporting Events API, or from PowerShell.  To learn more about how to use these reporting features, see:
* [Password management reports overview](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-get-insights#overview-of-password-management-reports)
* [How to view password management reports in the Azure portal](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-get-insights#how-to-view-password-management-reports)
* [Self-service Password Management activity types in the Azure Portal](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-get-insights#self-service-password-management-activity-types-in-the-new-azure-portal)
* [How to retrieve password management events from the Azure AD Reports and Events API](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-get-insights#how-to-retrieve-password-management-events-from-the-azure-ad-reports-and-events-api)
* [How to download password reset registration events quickly with PowerShell](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-get-insights#how-to-download-password-reset-registration-events-quickly-with-powershell)

### Tip 8: TROUBLESHOOT - Read our troubleshooting guide and FAQ to solve many issues
Did you know that password reset has a rich set of troubleshooting guidance and a FAQ? Chances are, if you have a question, you can find the answer to it in the links below.

In addition to this, you can also use the **"Support & Troubleshooting"** blade in the [Azure Portal](https://portal.azure.com) to get to a rich set of troubleshooting content, right from the password management administrative user experience found under **Azure Active Directory** -> **Users & Groups** -> **Password Reset** -> **Support & Troubleshooting** on the left hand navigation pane.

Links to password reset troubleshooting guidance and FAQ:
* [Troubleshoot Password Management](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-troubleshoot)
* [Password Management FAQ](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-faq)

### Tip 9: TROUBLESHOOT - If you still need help, include enough information for us to assist you
If you still need help troubleshooting, we are here for you. You can either open a support case, or get in touch with your account management team to reach out to us directly. We'd love to hear from you!

But, before you reach out, please **make sure you gather all of the information requested below** so that we can help you quickly!
* [Information to include when you need help](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-troubleshoot#information-to-include-when-you-need-help)

#### Ways to provide password reset feedback
* [Feature requests or troubleshooting - Post on the Azure AD MSDN forums](https://social.msdn.microsoft.com/Forums/azure/home?forum=WindowsAzureAD)
* [Feature requests or troubleshooting - Post on StackOverflow](http://stackoverflow.com/questions/tagged/azure-active-directory)
* [Feature requests or troubleshooting - Tweet @azuread!](https://twitter.com/azuread)
* [Feature requests only - Leave a note on UserVoice](https://feedback.azure.com/forums/169401-azure-active-directory)

## Enable users to reset their Azure AD passwords
This section walks you through enabling self-service password reset for your AAD cloud directory, registering users for self-service password reset, and then finally performing a test self-service password reset as a user.

* [Self-service password reset prerequisites](#prerequisites)
* [Step 1: Configure password reset policy](#step-1-configure-password-reset-policy)
* [Step 2: Add contact data for your test user](#step-2-add-contact-data-for-your-test-user)
* [Step 3: Reset your password as a user](#step-3-reset-your-azure-ad-password-as-a-user)

### Prerequisites
Before you can enable and use self-service password reset, you must complete the following prerequisites:

* Create an AAD tenant. For more information, see [Getting Started with Azure AD](https://azure.microsoft.com/trial/get-started-active-directory/)
* Obtain an Azure subscription. For more information, see [What is an Azure AD tenant?](active-directory-administer.md#what-is-an-azure-ad-tenant).
* Associate your AAD tenant with your Azure subscription. For more information, see [How Azure subscriptions are associated with Azure AD](https://msdn.microsoft.com/library/azure/dn629581.aspx).
* Upgrade to Azure AD Premium, Basic, or use an O365 paid license. For more information, see [Azure Active Directory Editions](https://azure.microsoft.com/pricing/details/active-directory/).

  > [!NOTE]
  > To enable self-service password reset for cloud users, you must upgrade to Azure AD Premium, Azure AD Basic, or a paid O365 license.  To enable-self-service password reset for your on-premises users, you must upgrade to Azure AD Premium. For more information, see [Azure Active Directory Editions](https://azure.microsoft.com/pricing/details/active-directory/). This information includes detailed instructions on how to sign up for Azure AD Premium or Basic, how to activate your license plan and activate your Azure AD access, and how to assign access to administrator and user accounts.
  >
  >
* Create at least one administrator account and one user account in your AAD directory.
* Assign an AAD Premium, Basic, or O365 paid license to the administrator and user account that you created.

### Step 1: Configure password reset policy
To configure user password reset policy, complete the following steps:

1. Open a browser of your choice and go to the [Azure classic portal](https://manage.windowsazure.com).
2. In the [Azure classic portal](https://manage.windowsazure.com), find the **Active Directory extension** on the navigation bar on the left hand side.

   ![Password Managment in Azure AD][001]
3. Under the **Directory** tab, click the directory in which you want to configure the user password reset policy, for example, Wingtip Toys.

    ![][002]
4. Click the **Configure** tab.

   ![][003]

5. Under the **Configure** tab, scroll down to the **user password reset policy** section.  This is where you configure every aspect of user password reset policy for a given directory. *If you do not see the Configure tab, make sure that you have signed up for Azure Active Directory Premium or Basic and __assigned a license__ to the administrator account that is configuring this feature.*  

   > [!NOTE]
   > **The policy you set only applies to end users in your organization, not administrators**. For security reasons, Microsoft controls the password reset policy for administrators. The current policy for administrators requires two challenges -  Mobile Phone and Email Address.

   ![][004]
6. To configure the user password reset policy, slide the **users enabled for password reset** toggle to the **yes** setting.  This reveals several more controls which enable you to configure how this feature works in your directory.  Feel free to customize password reset as you see fit.  If you’d like to learn more about what each of the password reset policy controls does, please see [Customize: Azure AD Password Management](active-directory-passwords-customize.md).

   ![][005]
7. After configuring user password reset policy as desired for your tenant, click the **Save** button at the bottom of the screen.

   > [!NOTE]
   > A two challenge user password reset policy is recommended so that  you can see how the functionality works in the most complex case.
   >
   >

   ![][006]

   > [!NOTE]
   > **The policy you set only applies to end users in your organization, not administrators**. For security reasons, Microsoft controls the password reset policy for administrators. The current policy for administrators requires two challenges -  Mobile Phone and Email Address.
   >
   >

### Step 2: Add contact data for your test user
You have several options on how to specify data for users in your organization to be used for password reset.

* Edit users in the [Azure classic portal](https://manage.windowsazure.com) or the [Office 365 Admin Portal](https://portal.microsoftonline.com)
* Use AAD Connect to synchronize user properties into Azure AD from an on-premises Active Directory domain
* Use Windows PowerShell to edit user properties
* Allow users to register their own data by guiding them to the registration portal at [http://aka.ms/ssprsetup](http://aka.ms/ssprsetup)
* Require users to register for password reset when they sign in to the Access Panel at [http://myapps.microsoft.com](http://myapps.microsoft.com) by setting the **Require users to register when signing in to the access panel** SSPR configuration option to **Yes**.

If you want to learn more about what data is used by password reset, as well as any formatting requirements for this data, please see [What data is used by password reset?](active-directory-passwords-learn-more.md#what-data-is-used-by-password-reset).

#### To add user contact data via the User Registration Portal
1. In order to use the password reset registration portal, you must provide the users in your organization with a link to this page ([http://aka.ms/ssprsetup](http://aka.ms/ssprsetup)) or turn on the option to require users to register automatically.  Once they click this link, they are asked to sign in with their organizational account.  After doing so, they see the following page:

   ![][007]
2. Here, users can provide and verify their mobile phone, alternate email address, or security questions.  This is what verifying a mobile phone looks like.

   ![][008]
3. After a user specifies this information, the page will update to indicate that the information is valid (it has been obfuscated below).  By clicking the **finish** or **cancel** buttons, the user will be brought to the Access Panel.

   ![][009]
4. Once a user verifies both of these pieces of information, his or her profile will be updated with the data he or she provided.  In this example, the **Office Phone** number has been specified manually, so the user can also use that as a contact method for resetting his or her password.

   ![][010]

### Step 3: Reset your Azure AD password as a user
Now that you’ve configured a user reset policy and specified contact details for your user, this user can perform a self-service password reset.

#### To perform a self-service password reset
1. If you go to a site like [**portal.microsoftonline.com**](http://portal.microsoftonline.com), you’ll see a login screen like the below.  Click the **Can’t access your account?** link to test the password reset UI.

   ![][011]
2. After clicking **Can’t access your account?**, you are brought to a new page which will ask for a **user ID** for which you wish to reset a password.  Enter your test **user ID** here, pass the captcha, and click **next**.

   ![][012]
3. Since the user has specified an **office phone**, **mobile phone**, and **alternate email** in this case, you see that he or she has been given all of those as options to pass the first challenge.

   ![][013]
4. In this case, choose to **call** the **office phone** first.  Note that when selecting a phone-based method, users will be asked to **verify their phone number** before they can reset their passwords.  This is to prevent malicious individuals from spamming phone numbers of users in your organization.

   ![][014]
5. Once the user confirms their phone number, clicking call will cause a spinner to appear and his or her phone to ring.  A message will play once he or she picks up your phone indicating that the **user should press “#”** to verify his or her account.  Pressing this key will automatically verify that the user possesses the first challenge and advance the UI to the second verification step.

   ![][015]
6. Once you’ve passed the first challenge, the UI is automatically updated to remove it from the list of choices the user has.  In this case, because you used your **Office Phone** first, only **Mobile Phone** and **Alternate Email** remain as valid options to use as the challenge for the second verification step.  Click on the **Email my alternate** email option.  After you have done that, pressing email will email the alternate email on file.

   ![][016]
7. Here is a sample of an email that users will see – notice the tenant branding:

   ![][017]
8. Once the email arrives, the page will update, and you’ll be able to enter the verification found in the email in the input box shown below.  After a proper code is entered, the next button lights up, and you are able to pass through the second verification step.

   ![][018]
9. Once you’ve met the requirements of the organizational policy, you are allowed to choose a new password.  The password is validated based it meets AAD “strong” password requirements (see [Password policy in Azure AD](https://msdn.microsoft.com/library/azure/jj943764.aspx)), and a strength validator appears to indicate to the user whether the password entered meets that policy.

   ![][019]
10. Once you provide matching passwords that meet the organizational policy, your password is reset and you can log in with your new password immediately.

    ![][020]

## Enable users to reset or change their AD Passwords
This section walks you through configuring password reset to write passwords back to an on-premises Active Directory.

* [Password Writeback prerequisites](#writeback-prerequisites)
* [Step 1: Download the latest version of Azure AD Connect](#step-1-download-the-latest-version-of-azure-ad-connect)
* [Step 2: Enable Password Writeback in Azure AD Connect through the UI or PowerShell and verify](#step-2-enable-password-writeback-in-azure-ad-connect)
* [Step 3: Configure your firewall](#step-3-configure-your-firewall)
* [Step 4: Set up the appropriate permissions](#step-4-set-up-the-appropriate-active-directory-permissions)
* [Step 5: Reset your AD password as a user and verify](#step-5-reset-your-ad-password-as-a-user)

### Writeback prerequisites
Before you can enable and use the Password Writeback, you must make sure you complete the following prerequisites:

* You have an Azure AD tenant with Azure AD Premium enabled.  For more information, see [Azure Active Directory Editions](active-directory-editions.md).
* You must connect Azure AD Connect to the Primary Domain Controller Emulator for password writeback to work.  If you need to, you can configure Azure AD Connect to use a Primary Domain Controller by right clicking on the **properties** of the Active Directory synchronization connector, then selecting **configure directory partitions**. From there, look for the **domain controller connection settings** section and check the box titled **only use preferred domain controllers**.  Note: if the preferred DC is not a PDC emulator, Azure AD Connect will still reach out to the PDC for password writeback.
* Password reset has been configured and enabled in your tenant.  For more information, see [Enable users to reset their Azure AD passwords](#enable-users-to-reset-their-azure-ad-passwords)
* You have at least one administrator account and one test user account with an Azure AD Premium license that you can use to test this feature.  For more information, see [Azure Active Directory Editions](active-directory-editions.md).

  > [!NOTE]
  > Make sure that the administrator account that you use to enable Password Writeback is a cloud administrator account (created in Azure AD), not a federated account (created in on-premises AD and synchronized into Azure AD).
  >
  >
* You have a single or multi-forest AD on-premises deployment running Windows Server 2008, Windows Server 2008 R2, Windows Server 2012, or Windows Server 2012 R2 with the latest service packs installed.

  > [!NOTE]
  > If you are running an older version of Windows Server 2008 or 2008 R2, you can still use this feature, but will need to [download and install KB 2386717](https://support.microsoft.com/kb/2386717) before being able to enforce your local AD password policy in the cloud.
  >
  >
* You have the Azure AD Connect tool installed and you have prepared your AD environment for synchronization to the cloud.  For more information, see [Use your on-premises identity infrastructure in the cloud](connect/active-directory-aadconnect.md).

  > [!NOTE]
  > Before you test password writeback, make sure that you first complete a full import and a full sync from both AD and Azure AD in Azure AD Connect.
  >
  >
* If you are using Azure AD Sync or Azure AD Connect  **TCP 443** outbound (and in some cases **TCP 9350-9354**) need to be open.  See [Step 3: Configure your firewall](#step-3-configure-your-firewall) for more information. Using DirSync for this scenario is no longer supported.  If you are still using DirSync, please upgrade to the latest version of Azure AD Connect before deploying password writeback.

  > [!NOTE]
  > We highly recommend anyone using the Azure AD Sync or DirSync tools upgrades to the latest version of Azure AD Connect to ensure the best possible experience and new features as they are released.
  >
  >

### Step 1: Download the latest version of Azure AD Connect
Password Writeback is available in releases of Azure AD Connect, or the Azure AD Sync tool with version number **1.0.0419.0911** or higher.  Password Writeback with automatic account unlock is available in releases of Azure AD Connect, or the Azure AD Sync tool with version number **1.0.0485.0222** or higher. If you are running an older version, please upgrade to at least this version before proceeding. [Click here to download the latest version of Azure AD Connect](connect/active-directory-aadconnect.md#install-azure-ad-connect).

#### To check the version of Azure AD Sync
1. Navigate to **%ProgramFiles%\Azure Active Directory Sync\**.
2. Find the **ConfigWizard.exe** executable.
3. Right-click the executable and select the **Properties** option from the context menu.
4. Click on the **Details** tab.
5. Find the **File version** field.

   ![][021]

If this version number is greater than or equal to **1.0.0419.0911**, or you are installing Azure AD Connect, you can skip to [Step 2: Enable Password Writeback in Azure AD Connect through the UI or PowerShell and verify](#step-2-enable-password-writeback-in-azure-ad-connect).

> [!NOTE]
> If this is your first time installing the Azure AD Connect tool, it is recommended that you follow a few best practices to prepare your environment for directory synchronization.  Before you install the Azure AD Connect tool, you must activate directory synchronization in either the [Office 365 Admin Portal](https://portal.microsoftonline.com) or the [Azure classic portal](https://manage.windowsazure.com).  For more information, see [Managing Azure AD Connect](active-directory-aadconnect-whats-next.md).
>
>

### Step 2: Enable password writeback in Azure AD Connect
Now that you have the Azure AD Connect tool downloaded, you are ready to enable Password Writeback.  You can do this in one of two ways.  You can either enable Password Writeback in the optional features screen of the Azure AD Connect setup wizard, or you can enable it via Windows PowerShell.

#### To enable Password Writeback in the configuration wizard
1. On your **Directory Sync computer**, open the **Azure AD Connect** configuration wizard.
2. Click through the steps until you reach the **optional features** configuration screen.
3. Check the **Password write-back** option.

   ![][022]
4. Complete the wizard, the final page will summarize the changes and will include the Password Writeback configuration change.

> [!NOTE]
> You can disable Password Writeback at any time by either re-running this wizard and deselecting the feature, or by setting the **Write Passwords Back to On-Premises Directory** setting to **No** in the **User Password Reset Policy** section of your directory’s **Configure** tab in the [Azure classic portal](https://manage.windowsazure.com).  For more information about customizing your password reset experience, check out [Customize: Azure AD Password Management](active-directory-passwords-customize.md).
>
>

#### To enable Password Writeback using Windows PowerShell
1. On your **Directory Sync computer**, open a new **elevated Windows PowerShell window**.
2. If the module is not already loaded, type in the `import-module ADSync` command to load the Azure AD Connect cmdlets into your current session.
3. Get the list of Azure AD Connectors in your system by running the `Get-ADSyncConnector` cmdlet and storing the results in `$aadConnectorName`, such as `$aadConnectorName = Get-ADSyncConnector|where-object {$_.name -like "*AAD"}`
4. To get the current status of writeback for the current connector by running the following cmdlet: `Get-ADSyncAADPasswordResetConfiguration –Connector $aadConnectorName.name`
5. Enable Password Writeback by running the cmdlet: `Set-ADSyncAADPasswordResetConfiguration –Connector $aadConnectorName.name –Enable $true`

> [!NOTE]
> If prompted for a credential, make sure that the administrator account that you specify for AzureADCredential is a **cloud administrator account (created in Azure AD)**, not a federated account (created in on-premises AD and synchronized into Azure AD.
>
> [!NOTE]
> You can disable Password Writeback through PowerShell by repeating the same instructions above but passing `$false` in step or by setting the **Write Passwords Back to On-Premises Directory** setting to **No** in the **User Password Reset Policy section** of your directory’s **Configure** tab in the [Azure classic portal](https://manage.windowsazure.com).
>
>

#### Verify that the configuration was successful
Once the configuration succeeds, you will see the message Password reset write-back is enabled in the Windows PowerShell window, or a success message in the configuration UI.

You can also verify the service was installed correctly by opening Event Viewer, navigating to the application event log, and looking for event **31005 - OnboardingEventSuccess** from the source **PasswordResetService**.

  ![][023]

### Step 3: Configure your firewall
After you have enabled Password Writeback, you need to make sure the machine running Azure AD Connect can reach Microsoft cloud services to receive password writeback requests. This step involves updating the connection rules in your network appliances (proxy servers, firewalls etc.) to allow outbound connections to certain [Microsoft-owned URLs and IP addresses](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2?ui=en-US&rs=en-US&ad=US) over specific network ports. These changes may vary based on the version of Azure AD Connect tool. For more context, you can read more about [how password writeback works](active-directory-passwords-learn-more.md#how-password-writeback-works) and [the password writeback security model](active-directory-passwords-learn-more.md#password-writeback-security-model).

#### Why do I need to do this?

In order for Password Writeback to function properly, the machine running Azure AD Connect needs to be able to talk to the Password Reset Service, as well as Azure Service Bus.

For Azure AD Connect tool **1.1.443.0** and above:

- The latest version of the Azure AD Connect tool will need **outbound HTTPS** access to:
    - *passwordreset.microsoftonline.com*
    - *servicebus.windows.net*

For Azure AD Connect tool versions **1.0.8667.0** to **1.1.380.0**:

- **Option 1:** Allow all outbound HTTPS connections over port 443 (using URL or IP Address).
	- When to use this:
		- Use this option if you want the most straightforward configuration that does not need to be updated as Azure Datacenter IP ranges change over time.
	- Steps required:
		- Allow all outbound HTTPS connections over port 443 using URL or IP address.
<br><br>
- **Option 2:** Allow outbound HTTPS connections to specific IP ranges and URLs
	- When to use this:
		- Use this option if you are in a restricted network environment, or do not otherwise feel comfortable with allowing outbound connections.
		- In this configuration, for password writeback to continue to work, you'll need to ensure your networking appliances stay updated weekly with the latest IPs from the Microsoft Azure Datacenter IP Ranges list. These IP ranges are available as an XML file which is updated every Wednesday (Pacific Time) and put into effect the following Monday (Pacific Time).
	- Steps required:
		- Allow all outbound HTTPS connections to *.servicebus.windows.net
		- Allow all outbound HTTPS connections to all IPs in the Microsoft Azure Datacenter IP Ranges list and keep this configuration updated weekly. The list is available for download [here](https://www.microsoft.com/download/details.aspx?id=41653).

> [!NOTE]
> If you have configured Password Writeback by following the instructions above and do not see any errors in the Azure AD Connect event log, but you're getting connectivity errors when testing, then it may be the case that a networking appliance in your environment is blocking HTTPS connections to IP addresses. For example, while a connection to *https://*.servicebus.windows.net* is allowed, a connection to a specific IP address within that range may be blocked. To resolve this, you'll need to either configure your networking environment to allow all outbound HTTPS connections over port 443 to any URL or IP address (Option 1 above), or work with your networking team to explicitly allow HTTPS connections to specific IP addresses (Option 2 above).

**For older versions:**

- Allow outbound TCP connections over port 443, 9350-9354 and port 5671
- Allow outbound connections to *https://ssprsbprodncu-sb.accesscontrol.windows.net/*

> [!NOTE]
> If you are on a version of Azure AD Connect prior to 1.0.8667.0, Microsoft highly recommends you upgrade to the [latest version of Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594), which includes a number of writeback networking enhancements to make configuration easier.

Once the network appliances have been configured, reboot the machine running Azure AD Connect tool.

#### Idle connections on Azure AD Connect (1.1.443.0 and up)
The Azure AD Connect tool will send periodic pings/keepalives to ServiceBus endpoints to ensure that the connections stay alive. Should the tool detect that too many connections are being killed, it will automatically increase the frequency of pings to the endpoint. The lowest 'ping intervals' will drop to is 1 ping every 60 seconds, however, **we strongly advise that proxies/firewalls allow idle connections to persist for at least 2-3 minutes.** \*For older versions, we suggest 4 minutes or more.

### Step 4: Set up the appropriate Active Directory permissions
For every forest that contains users whose passwords will be reset, if X is the account that was specified for that forest in the configuration wizard (during initial configuration), then X must be given the **Reset Password**, **Change Password**, **Write Permissions** on `lockoutTime`, and **Write Permissions** on `pwdLastSet`, extended rights on the either the root object of each domain in that forest OR on the user OU(s) you wish to be in scope for SSPR.  You can use the latter option if you would like to scope your reset permissions to only a specific set of user objects in case doing so against the root of the domain is not acceptable. The right should be marked as inherited by all user objects.  

If you are not sure what account the above refers to, open the Azure Active Directory Connect configuration UI and click on the **Review Your Solution** option.  The account you need to add permission to is underlined in red in the screenshot below.

**<font color="red">Make sure you set this permission for each domain in each forest in your system, otherwise password writeback will not work properly.</font>**

  ![][032]

  Setting these permissions will allow the MA service account for each forest to manage passwords on behalf of user accounts within that forest. If you neglect to assign these permissions, then, even though writeback will appear to be configured correctly, users will encounter errors when attempting to manage their on-premises passwords from the cloud. Here are the detailed steps on how you can do this using the **Active Directory Users and Computers** management snap-in:

> [!NOTE]
> It could take up to an hour for these permissions to replicate to all objects in your directory.
>
>

#### To set up the right permissions for writeback to occur
1. Open **Active Directory Users and Computers** with an account that has the appropriate domain administration permissions.
2. In the **View Menu** option, make sure **Advanced Features** is turned on.
3. In the left panel, right click the object that represents the root of the domain.
4. Click on the **Security** tab.
5. Then click **Advanced**.

   ![][024]
6. On the **Permissions** tab, click **Add**.

   ![][025]
7. Select the account you want to give permissions to (this is the same account that was specified while setting up sync for that forest).
8. In the drop down on the top, select **Descendent User objects**.
9. In the **Permission Entry** dialog box that shows up, check the box for **Reset Password**, **Change Password**, **Write Permissions** on `lockoutTime`, and **Write Permissions** on `pwdLastSet`.

   ![][026]
   ![][027]
   ![][028]
10. Then click **Apply/Ok** through all the open dialog boxes.

### Step 5: Reset your AD password as a user
Now that Password Writeback has been enabled, you can test that it works by resetting the password of a user whose account has been synchronized into your cloud tenant.

#### To verify Password Writeback is working properly
1. Navigate to [https://passwordreset.microsoftonline.com](https://passwordreset.microsoftonline.com) or go to any organizational ID login screen and click the **Can’t access your account?** link.

   ![][029]
2. You should now see a new page which asks for a user ID for which you want to reset a password. Enter your test user ID and proceed through the password reset flow.
3. After you reset your password, you will see a screen that looks similar to this. It means you have successfully reset your password in your on-premises and/or cloud directories.

   ![][030]
4. To verify the operation was successful or diagnose any errors, go to your **Directory Sync computer**, open **Event Viewer**, navigate to the **application event log**, and look for event **31002 - PasswordResetSuccess** from the source **PasswordResetService** for your test user.

   ![][031]



## Next steps
Below are links to all of the Azure AD Password Reset documentation pages:

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md#reset-your-password).
* [**How it works**](active-directory-passwords-how-it-works.md) - learn about the six different components of the service and what each does
* [**Customize**](active-directory-passwords-customize.md) - learn how to customize the look & feel and behavior of the service to your organization's needs
* [**Best practices**](active-directory-passwords-best-practices.md) - learn how to quickly deploy and effectively manage passwords in your organization
* [**Get insights**](active-directory-passwords-get-insights.md) - learn about our integrated reporting capabilities
* [**FAQ**](active-directory-passwords-faq.md) - get answers to frequently asked questions
* [**Troubleshooting**](active-directory-passwords-troubleshoot.md) - learn how to quickly troubleshoot problems with the service
* [**Learn more**](active-directory-passwords-learn-more.md) - go deep into the technical details of how the service works

[001]: ./media/active-directory-passwords-getting-started/001.jpg "Image_001.jpg"
[002]: ./media/active-directory-passwords-getting-started/002.jpg "Image_002.jpg"
[003]: ./media/active-directory-passwords-getting-started/003.jpg "Image_003.jpg"
[004]: ./media/active-directory-passwords-getting-started/004.jpg "Image_004.jpg"
[005]: ./media/active-directory-passwords-getting-started/005.jpg "Image_005.jpg"
[006]: ./media/active-directory-passwords-getting-started/006.jpg "Image_006.jpg"
[007]: ./media/active-directory-passwords-getting-started/007.jpg "Image_007.jpg"
[008]: ./media/active-directory-passwords-getting-started/008.jpg "Image_008.jpg"
[009]: ./media/active-directory-passwords-getting-started/009.jpg "Image_009.jpg"
[010]: ./media/active-directory-passwords-getting-started/010.jpg "Image_010.jpg"
[011]: ./media/active-directory-passwords-getting-started/011.jpg "Image_011.jpg"
[012]: ./media/active-directory-passwords-getting-started/012.jpg "Image_012.jpg"
[013]: ./media/active-directory-passwords-getting-started/013.jpg "Image_013.jpg"
[014]: ./media/active-directory-passwords-getting-started/014.jpg "Image_014.jpg"
[015]: ./media/active-directory-passwords-getting-started/015.jpg "Image_015.jpg"
[016]: ./media/active-directory-passwords-getting-started/016.jpg "Image_016.jpg"
[017]: ./media/active-directory-passwords-getting-started/017.jpg "Image_017.jpg"
[018]: ./media/active-directory-passwords-getting-started/018.jpg "Image_018.jpg"
[019]: ./media/active-directory-passwords-getting-started/019.jpg "Image_019.jpg"
[020]: ./media/active-directory-passwords-getting-started/020.jpg "Image_020.jpg"
[021]: ./media/active-directory-passwords-getting-started/021.jpg "Image_021.jpg"
[022]: ./media/active-directory-passwords-getting-started/022.jpg "Image_022.jpg"
[023]: ./media/active-directory-passwords-getting-started/023.jpg "Image_023.jpg"
[024]: ./media/active-directory-passwords-getting-started/024.jpg "Image_024.jpg"
[025]: ./media/active-directory-passwords-getting-started/025.jpg "Image_025.jpg"
[026]: ./media/active-directory-passwords-getting-started/026.jpg "Image_026.jpg"
[027]: ./media/active-directory-passwords-getting-started/027.jpg "Image_027.jpg"
[028]: ./media/active-directory-passwords-getting-started/028.jpg "Image_028.jpg"
[029]: ./media/active-directory-passwords-getting-started/029.jpg "Image_029.jpg"
[030]: ./media/active-directory-passwords-getting-started/030.jpg "Image_030.jpg"
[031]: ./media/active-directory-passwords-getting-started/031.jpg "Image_031.jpg"
[032]: ./media/active-directory-passwords-getting-started/032.jpg "Image_032.jpg"
