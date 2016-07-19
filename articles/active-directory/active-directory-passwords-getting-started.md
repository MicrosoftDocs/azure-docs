<properties
	pageTitle="Getting Started: Azure AD Password Management | Microsoft Azure"
	description="Enable users to reset their own passwords, discover pre-requisites for password reset, and enable Password Writeback to manage on-premises passwords in Active Directory."
	services="active-directory"
	keywords="Active directory password management, password management, reset Azure AD password"
	documentationCenter=""
	authors="asteen"
	manager="femila"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="07/12/2016"
	ms.author="asteen"/>

# Getting started with Password Management

> [AZURE.IMPORTANT] **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).

Enabling your users to manage their own cloud Azure Active Directory or on-premises Active Directory passwords takes just a few simple steps. After ensuring that you've met a few simple prerequisites, you'll have password change and reset enabled for your entire organization before you know it. This article will walk you through the following concepts:

* [**How to enable users to reset their cloud Azure Active Directory passwords**](#enable-users-to-reset-their-azure-ad-passwords)
 - [Self-service password reset prerequisites](#prerequisites)
 - [Step 1: Configure password reset policy](#step-1-configure-password-reset-policy)
 - [Step 2: Add contact data for your test user](#step-2-add-contact-data-for-your-test-user)
 - [Step 3: Reset your password as a user](#step-3-reset-your-azure-ad-password-as-a-user)
* [**How to enable users to reset or change their on-premises Active Directory passwords**](#enable-users-to-reset-or-change-their-ad-passwords)
 - [Password Writeback prerequisites](#writeback-prerequisites)
 - [Step 1: Download the latest version of Azure AD Connect](#step-1-download-the-latest-version-of-azure-ad-connect)
 - [Step 2: Enable Password Writeback in Azure AD Connect through the UI or powershell and verify](#step-2-enable-password-writeback-in-azure-ad-connect)
 - [Step 3: Configure your firewall](#step-3-configure-your-firewall)
 - [Step 4: Set up the appropriate permissions](#step-4-set-up-the-appropriate-active-directory-permissions)
 - [Step 5: Reset your AD password as a user and verify](#step-5-reset-your-ad-password-as-a-user)

## Enable users to reset their Azure AD passwords
This section walks you through enabling self-service password reset for your AAD cloud directory, registering users for self-service password reset, and then finally performing a test self-service password reset as a user.

- [Self-service password reset prerequisites](#prerequisites)
- [Step 1: Configure password reset policy](#step-1-configure-password-reset-policy)
- [Step 2: Add contact data for your test user](#step-2-add-contact-data-for-your-test-user)
- [Step 3: Reset your password as a user](#step-3-reset-your-azure-ad-password-as-a-user)


###  Prerequisites
Before you can enable and use self-service password reset, you must complete the following prerequisites:

- Create an AAD tenant. For more information, see [Getting Started with Azure AD](https://azure.microsoft.com/trial/get-started-active-directory/)
- Obtain an Azure subscription. For more information, see [What is an Azure AD tenant?](active-directory-administer.md#what-is-an-azure-ad-tenant).
- Associate your AAD tenant with your Azure subscription. For more information, see [How Azure subscriptions are associated with Azure AD](https://msdn.microsoft.com/library/azure/dn629581.aspx).
- Upgrade to Azure AD Premium, Basic, or use an O365 paid license. For more information, see [Azure Active Directory Editions](https://azure.microsoft.com/pricing/details/active-directory/).

  >[AZURE.NOTE] To enable self-service password reset for cloud users, you must upgrade to Azure AD Premium, Azure AD Basic, or a paid O365 license.  To enable-self-service password reset for your on-premises users, you must upgrade to Azure AD Premium. For more information, see [Azure Active Directory Editions](https://azure.microsoft.com/pricing/details/active-directory/). This information includes detailed instructions on how to sign up for Azure AD Premium or Basic, how to activate your license plan and activate your Azure AD access, and how to assign access to administrator and user accounts.

- Create at least one administrator account and one user account in your AAD directory.
- Assign an AAD Premium, Basic, or O365 paid license to the administrator and user account that you created.

### Step 1: Configure password reset policy
To configure user password reset policy, complete the following steps:

1.	Open a browser of your choice and go to the [Azure Management Portal](https://manage.windowsazure.com).
2.	In the [Azure Management Portal](https://manage.windowsazure.com), find the **Active Directory extension** on the navigation bar on the left hand side.

    ![Password Managment in Azure AD][001]

3. Under the **Directory** tab, click the directory in which you want to configure the user password reset policy, for example, Wingtip Toys.

    ![][002]

4.	Click the **Configure** tab.

    ![][003]

5.	Under the **Configure** tab, scroll down to the **user password reset policy** section.  This is where you configure every aspect of user password reset policy for a given directory.  

    >[AZURE.NOTE] This **policy applies only to end users in your organization, not administrators**. For security reasons, Microsoft controls the password reset policy for administrators. If you do not see this section, make sure that you have signed up for the Azure Active Directory Premium or Basic and **assigned a license** to the administrator account that is configuring this feature.

    ![][004]

6.	To configure the user password reset policy, slide the **users enabled for password reset** toggle to the **yes** setting.  This reveals several more controls which enable you to configure how this feature works in your directory.  Feel free to customize password reset as you see fit.  If you’d like to learn more about what each of the password reset policy controls does, please see [Customize: Azure AD Password Management](active-directory-passwords-customize.md).

    ![][005]

7.	After configuring user password reset policy as desired for your tenant, click the **Save** button at the bottom of the screen.

  >[AZURE.NOTE] A two challenge user password reset policy is recommended so that  you can see how the functionality works in the most complex case.

  ![][006]

### Step 2: Add contact data for your test user
You have several options on how to specify data for users in your organization to be used for password reset.

-	Edit users in the [Azure Management Portal](https://manage.windowsazure.com) or the [Office 365 Admin Portal](https://portal.microsoftonline.com)
-	Use AAD Connect to synchronize user properties into Azure AD from an on-premises Active Directory domain
-	Use Windows PowerShell to edit user properties
-	Allow users to register their own data by guiding them to the registration portal at [http://aka.ms/ssprsetup](http://aka.ms/ssprsetup)
-	Require users to register for password reset when they sign in to the Access Panel at [http://myapps.microsoft.com](http://myapps.microsoft.com) by setting the **Require users to register when signing in to the access panel** SSPR configuration option to **Yes**.

If you want to learn more about what data is used by password reset, as well as any formatting requirements for this data, please see [What data is used by password reset?](active-directory-passwords-learn-more.md#what-data-is-used-by-password-reset).

#### To add user contact data via the User Registration Portal
1.	In order to use the password reset registration portal, you must provide the users in your organization with a link to this page ([http://aka.ms/ssprsetup](http://aka.ms/ssprsetup)) or turn on the option to require users to register automatically.  Once they click this link, they are asked to sign in with their organizational account.  After doing so, they see the following page:

    ![][007]

2.	Here, users can provide and verify their mobile phone, alternate email address, or security questions.  This is what verifying a mobile phone looks like.

    ![][008]

3.	After a user specifies this information, the page will update to indicate that the information is valid (it has been obfuscated below).  By clicking the **finish** or **cancel** buttons, the user will be brought to the Access Panel.

    ![][009]

4.	Once a user verifies both of these pieces of information, his or her profile will be updated with the data he or she provided.  In this example, the **Office Phone** number has been specified manually, so the user can also use that as a contact method for resetting his or her password.

    ![][010]

### Step 3: Reset your Azure AD password as a user
Now that you’ve configured a user reset policy and specified contact details for your user, this user can perform a self-service password reset.

#### To perform a self-service password reset
1.	If you go to a site like [**portal.microsoftonline.com**](http://portal.microsoftonline.com), you’ll see a login screen like the below.  Click the **Can’t access your account?** link to test the password reset UI.

    ![][011]

2.	After clicking **Can’t access your account?**, you are brought to a new page which will ask for a **user ID** for which you wish to reset a password.  Enter your test **user ID** here, pass the captcha, and click **next**.

    ![][012]

3.	Since the user has specified an **office phone**, **mobile phone**, and **alternate email** in this case, you see that he or she has been given all of those as options to pass the first challenge.

    ![][013]

4.	In this case, choose to **call** the **office phone** first.  Note that when selecting a phone-based method, users will be asked to **verify their phone number** before they can reset their passwords.  This is to prevent malicious individuals from spamming phone numbers of users in your organization.

    ![][014]

5.	Once the user confirms their phone number, clicking call wall cause a spinner to appear and his or her phone to ring.  A message will play once he or she picks up your phone indicating that the **user should press “#”** to verify his or her account.  Pressing this key will automatically verify that the user possesses the first challenge and advance the UI to the second verification step.

    ![][015]

6.	Once you’ve passed the first challenge, the UI is automatically updated to remove it from the list of choices the user has.  In this case, because you used your **Office Phone**first, only **Mobile Phone** and **Alternate Email** remain as valid options to use as the challenge for the second verification step.  Click on the **Email my alternate** email option.  After you have done that, pressing email will email the alternate email on file.

    ![][016]

7.	Here is a sample of an email that users will see – notice the tenant branding:

    ![][017]

8.	Once the email arrives, the page will update, and you’ll be able to enter the verification found in the email in the input box shown below.  After a proper code is entered, the next button lights up, and you are able to pass through the second verification step.

    ![][018]

9.	Once you’ve met the requirements of the organizational policy, you are allowed to choose a new password.  The password is validated based it meets AAD “strong” password requirements (see [Password policy in Azure AD](https://msdn.microsoft.com/library/azure/jj943764.aspx)), and a strength validator appears to indicate to the user whether the password entered meets that policy.

    ![][019]

10.	Once you provide matching passwords that meet the organizational policy, your password is reset and you can log in with your new password immediately.

    ![][020]


## Enable users to reset or change their AD Passwords

This section walks you through configuring password reset to write passwords back to an on-premises Active Directory.

- [Password Writeback prerequisites](#writeback-prerequisites)
- [Step 1: Download the latest version of Azure AD Connect](#step-1-download-the-latest-version-of-azure-ad-connect)
- [Step 2: Enable Password Writeback in Azure AD Connect through the UI or powershell and verify](#step-2-enable-password-writeback-in-azure-ad-connect)
- [Step 3: Configure your firewall](#step-3-configure-your-firewall)
- [Step 4: Set up the appropriate permissions](#step-4-set-up-the-appropriate-active-directory-permissions)
- [Step 5: Reset your AD password as a user and verify](#step-5-reset-your-ad-password-as-a-user)


### Writeback prerequisites
Before you can enable and use the Password Writeback, you must make sure you complete the following prerequisites:

- You have an Azure AD tenant with Azure AD Premium enabled.  For more information, see [Azure Active Directory Editions](active-directory-editions.md).
- Password reset has been configured and enabled in your tenant.  For more information, see [Enable users to reset their Azure AD passwords](#enable-users-to-reset-their-azure-ad-passwords)
- You have at least one administrator account and one test user account with an Azure AD Premium license that you can use to test this feature.  For more information, see [Azure Active Directory Editions](active-directory-editions.md).

  > [AZURE.NOTE] Make sure that the administrator account that you use to enable Password Writeback is a cloud administrator account (created in Azure AD), not a federated account (created in on-premises AD and synchronized into Azure AD).

- You have a single or multi-forest AD on-premises deployment running Windows Server 2008, Windows Server 2008 R2, Windows Server 2012, or Windows Server 2012 R2 with the latest service packs installed.

  > [AZURE.NOTE] If you are running an older version of Windows Server 2008 or 2008 R2, you can still use this feature, but will need to [download and install KB 2386717](https://support.microsoft.com/kb/2386717) before being able to enforce your local AD password policy in the cloud.

- You have the Azure AD Connect tool installed and you have prepared your AD environment for synchronization to the cloud.  For more information, see [Use your on-premises identity infrastructure in the cloud](active-directory-aadconnect.md).

  > [AZURE.NOTE] Before you test password writeback, make sure that you first complete a full import and a full sync from both AD and Azure AD in Azure AD Connect.

- If you are using Azure AD Sync or Azure AD Connect  **TCP 443** outbound (and in some cases **TCP 9350-9354**) need to be open.  See [Step 3: Configure your firewall](#step-3-configure-your-firewall) for more information. Using DirSync for this scenario is no longer supported.  If you are still using DirSync, please upgrade to the latest version of Azure AD Connect before deploying password writeback.

  > [AZURE.NOTE] We highly recommend anyone using the Azure AD Sync or DirSync tools upgrades to the latest version of Azure AD Connect to ensure the best possible experience and new features as they are released.


### Step 1: Download the latest version of Azure AD Connect
Password Writeback is available in releases of Azure AD Connect, or the Azure AD Sync tool with version number **1.0.0419.0911** or higher.  Password Writeback with automatic account unlock is available in releases of Azure AD Connect, or the Azure AD Sync tool with version number **1.0.0485.0222** or higher. If you are running an older version, please upgrade to at least this version before proceeding. [Click here to download the latest version of Azure AD Connect](active-directory-aadconnect.md#install-azure-ad-connect).

#### To check the version of Azure AD Sync
1.	Navigate to **%ProgramFiles%\Azure Active Directory Sync\**.
2.	Find the **ConfigWizard.exe** executable.
3.	Right-click the executable and select the **Properties** option from the context menu.
4.	Click on the **Details** tab.
5.	Find the **File version** field.

    ![][021]

If this version number is greater than or equal to **1.0.0419.0911**, or you are installing Azure AD Connect, you can skip to [Step 2: Enable Password Writeback in Azure AD Connect through the UI or powershell and verify](#step-2-enable-password-writeback-in-azure-ad-connect).

 > [AZURE.NOTE] If this is your first time installing the Azure AD Connect tool, it is recommended that you follow a few best practices to prepare your environment for directory synchronization.  Before you install the Azure AD Connect tool, you must activate directory synchronization in either the [Office 365 Admin Portal](https://portal.microsoftonline.com) or the [Azure Management Portal](https://manage.windowsazure.com).  For more information, see [Managing Azure AD Connect](active-directory-aadconnect-whats-next.md).


### Step 2: Enable Password Writeback in Azure AD Connect
Now that you have the Azure AD Connect tool downloaded, you are ready to enable Password Writeback.  You can do this in one of two ways.  You can either enable Password Writeback in the optional features screen of the Azure AD Connect setup wizard, or you can enable it via Windows PowerShell.

#### To enable Password Writeback in the configuration wizard
1.	On your **Directory Sync computer**, open the **Azure AD Connect** configuration wizard.
2.	Click through the steps until you reach the **optional features** configuration screen.
3.	Check the **Password write-back** option.

    ![][022]

4.	Complete the wizard, the final page will summarize the changes and will include the Password Writeback configuration change.

> [AZURE.NOTE] You can disable Password Writeback at any time by either re-running this wizard and deselecting the feature, or by setting the **Write Passwords Back to On-Premises Directory** setting to **No** in the **User Password Reset Policy** section of your directory’s **Configure** tab in the [Azure Management Portal](https://manage.windowsazure.com).  For more information about customizing your password reset experience, check out [Customize: Azure AD Password Management](active-directory-passwords-customize.md).

#### To enable Password Writeback using Windows PowerShell
1.	On your **Directory Sync computer**, open a new **elevated Windows PowerShell window**.
2.	If the module is not already loaded, type in the `Import-Module ADSync` command to load the Azure AD Connect cmdlets into your current session.
3.	Get the list of AAD Connectors in your system by running the `Get-ADSyncConnector` cmdlet and storing the results in `$aadConnectorName`
4.	To get the current status of writeback for the current connector by running the following cmdlet: `Get-ADSyncAADPasswordResetConfiguration –Connector $aadConnectorName`
5.	Enable Password Writeback by running the cmdlet: `Set-ADSyncAADPasswordResetConfiguration –Connector $aadConnectorName –Enable $true`

> [AZURE.NOTE] If prompted for a credential, make sure that the administrator account that you specify for AzureADCredential is a **cloud administrator account (created in Azure AD)**, not a federated account (created in on-premises AD and synchronized into Azure AD.
> [AZURE.NOTE] You can disable Password Writeback through PowerShell by repeating the same instructions above but passing `$false` in step or by setting the **Write Passwords Back to On-Premises Directory** setting to **No** in the **User Password Reset Policy section** of your directory’s **Configure** tab in the [Azure Management Portal](https://manage.windowsazure.com).

#### Verify that the configuration was successful
Once the configuration succeeds, you will see the message Password reset write-back is enabled in the Windows PowerShell window, or a success message in the configuration UI.

You can also verify the service was installed correctly by opening Event Viewer, navigating to the application event log, and looking for event **31005 - OnboardingEventSuccess** from the source **PasswordResetService**.

  ![][023]

### Step 3: Configure your firewall
After you have enabled Password Writeback in the Azure AD Connect tool, you will need to make sure the service can connect to the cloud.

1.	Once installation is complete, if you are blocking unknown outbound connections in your environment, you will also need to add the following rules to your firewall. Make sure you reboot your AAD Connect machine after making these changes:
   - Allow outbound connections over port 443 TCP
   - Allow outbound connections to https://ssprsbprodncu-sb.accesscontrol.windows.net/
   - When using a proxy or having general connectivity issues, allow outbound connections over port 9350-9354 and port 5671 TCP

### Step 4: Set up the appropriate Active Directory permissions
For every forest that contains users whose passwords will be reset, if X is the account that was specified for that forest in the configuration wizard (during initial configuration), then X must be given the **Reset Password**, **Change Password**, **Write Permissions** on `lockoutTime`, and **Write Permissions** on `pwdLastSet`, extended rights on the root object of each domain in that forest. The right should be marked as inherited by all user objects.  

If you are not sure what account the above refers to, open the Azure Active Directory Connect configuration UI and click on the **Review Your Solution** option.  The account you need to add permission to is underlined in red in the screenshot below.

**<font color="red">Make sure you set this permission for each domain in each forest in your system, otherwise password writeback will not work properly.</font>**

  ![][032]

  Setting these permissions will allow the MA service account for each forest to manage passwords on behalf of user accounts within that forest. If you neglect to assign these permissions, then, even though writeback will appear to be configured correctly, users will encounter errors when attempting to manage their on-premises passwords from the cloud. Here are the detailed steps on how you can do this using the **Active Directory Users and Computers** management snap-in:

>[AZURE.NOTE] It could take up to an hour for these permissions to replicate to all objects in your directory.

#### To set up the right permissions for writeback to occur

1.	Open **Active Directory Users and Computers** with an account that has the appropriate domain administration permissions.
2.	In the **View Menu** option, make sure **Advanced Features** is turned on.
3.	In the left panel, right click the object that represents the root of the domain.
4.	Click on the **Security** tab.
5.	Then click **Advanced**.

    ![][024]

6.	On the **Permissions** tab, click **Add**.

    ![][025]

7.	Select the account you want to give permissions to (this is the same account that was specified while setting up sync for that forest).
8.	In the drop down on the top, select **Descendent User objects**.
9.	In the **Permission Entry** dialog box that shows up, check the box for **Reset Password**, **Change Password**, **Write Permissions** on `lockoutTime`, and **Write Permissions** on `pwdLastSet`.

    ![][026]
    ![][027]
    ![][028]

10.	Then click **Apply/Ok** through all the open dialog boxes.

### Step 5: Reset your AD password as a user
Now that Password Writeback has been enabled, you can test that it works by resetting the password of a user whose account has been synchronized into your cloud tenant.

#### To verify Password Writeback is working properly
1.	Navigate to [https://passwordreset.microsoftonline.com](https://passwordreset.microsoftonline.com) or go to any organizational ID login screen and click the **Can’t access your account?** link.

    ![][029]

2.	You should now see a new page which asks for a user ID for which you want to reset a password. Enter your test user ID and proceed through the password reset flow.
3.	After you reset your password, you will see a screen that looks similar to this. It means you have successfully reset your password in your on-premises and/or cloud directories.

    ![][030]

4.	To verify the operation was successful or diagnose any errors, go to your **Directory Sync computer**, open **Event Viewer**, navigate to the **application event log**, and look for event **31002 - PasswordResetSuccess** from the source **PasswordResetService** for your test user.

    ![][031]


<br/>
<br/>
<br/>

## Links to password reset documentation
Below are links to all of the Azure AD Password Reset documentation pages:

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).
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
