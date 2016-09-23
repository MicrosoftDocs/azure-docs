<properties
	pageTitle="Learn More: Azure AD Password Management | Microsoft Azure"
	description="Advanced topics on Azure AD Password Management, including how password writeback works, password writeback security, how the password reset portal works, and what data is used by password reset."
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

# Learn more about Password Management

> [AZURE.IMPORTANT] **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).

If you have already deployed Password Management, or are just looking to learn more about the technical nitty gritty of how it works before deploying, this section will give you a good overview of the technical concepts behind the service. We'll cover the following:

* [**Password writeback overview**](#password-writeback-overview)
  - [How pasword writeback works](#how-password-writeback-works)
  - [Scenarios supported for password writeback](#scenarios-supported-for-password-writeback)
  - [Password writeback security model](#password-writeback-security-model)
* [**How does the password reset portal work?**](#how-does-the-password-reset-portal-work)
  - [What data is used by password reset?](#what-data-is-used-by-password-reset)
  - [How to access password reset data for your users](#how-to-access-password-reset-data-for-your-users)

## Password writeback overview
Password writeback is an [Azure Active Directory Connect](active-directory-aadconnect.md) component that can be enabled and used by the current subscribers of Azure Active Directory Premium. For more information, see [Azure Active Directory Editions](active-directory-editions.md).

Password writeback allows you to configure your cloud tenant to write passwords back to you on-premises Active Directory.  It obviates you from having to set up and manage a complicated on-premises self-service password reset solution, and it provides a convenient cloud-based way for your users to reset their on-premises passwords wherever they are.  Read on for some of the key features of password writeback:

- **Zero delay feedback.**  Password writeback is a synchronous operation.  Your users will be notified immediately if their password did not meet policy or was not able to be reset or changed for any reason.
- **Supports resetting passwords for users using AD FS or other federation technologies.**  With password writeback, as long as the federated user accounts are synchronized into your Azure AD tenant, they will be able to manage their on-premises AD passwords from the cloud.
- **Supports resetting passwords for users using password hash sync.** When the password reset service detects that a synchronized user account is enabled for password hash sync, we reset both this account’s on-premises and cloud password simultaneously.
- **Supports changing passwords from the access panel and Office 365.**  When federated or password sync’d users come to change their expired or non-expired passwords, we’ll write those passwords back to your local AD environment.
- **Supports writing back passwords when an admin reset them from the** [**Azure Management Portal**](https://manage.windowsazure.com).  Whenever an admin resets a user’s password in the [Azure Management Portal](https://manage.windowsazure.com), if that user is federated or password sync’d, we’ll set the password the admin selects on your local AD, as well.  This is currently not supported in the Office Admin Portal.
- **Enforces your on-premises AD password policies.**  When a user resets his/her password, we make sure that it meets your on-premises AD policy before committing it to that directory.  This includes history, complexity, age, password filters, and any other password restrictions you have defined in your local AD.
- **Doesn’t require any inbound firewall rules.**  Password writeback uses an Azure Service Bus relay as an underlying communication channel, meaning that you do not have to open any inbound ports on your firewall for this feature to work.
- **Is not supported for user accounts that exist within protected groups in your on-premises Active Directory.** For more information about protected groups, see [Protected Accounts and Groups in Active Directory](https://technet.microsoft.com/library/dn535499.aspx).

### How password writeback works
Password writeback has three main components:

- Password Reset cloud service (this is also integrated into Azure AD’s password change pages)
- Tenant-specific Azure Service Bus relay
- On-prem password reset endpoint

They fit together as described in the below diagram:

  ![][001]

When a federated or password hash sync’d user comes to reset or change his or her password in the cloud, the following occurs:

1.	We check to see what type of password the user has.  If we see the password is managed on premises, then we ensure the writeback service is up and running.  If it is, we let the user proceed, if it is not, we tell the user that their password cannot be reset here.
2.	Next, the user passes the appropriate authentication gates and reaches the reset password screen.
3.	The user selects a new password and confirms it.
4.	Upon clicking submit, we encrypt the plaintext password with a symmetric key that was created during the writeback setup process.
5.	After encrypting the password, we include it in a payload that gets sent over an HTTPS channel to your tenant specific service bus relay (that we also set up for you during the writeback setup process).  This relay is protected by a randomly generated password that only your on-premises installation knows.
6.	Once the message reaches service bus, the password reset endpoint automatically wakes up and sees that it has a reset request pending.
7.	The service then looks for the user in question by using the cloud anchor attribute.  For this lookup to succeed, the user object must exist in the AD connector space, it must be linked to the corresponding MV object, and it must be linked to the corresponding AAD connector object. Finally, in order for sync to find this user account, the link from AD connector object to MV must have the sync rule `Microsoft.InfromADUserAccountEnabled.xxx` on the link.  This is needed because when the call comes in from the cloud, the sync engine uses the cloudAnchor attribute to look up the AAD connector space object, then follows the link back to the MV object, and then follows the link back to the AD object. Because there could be multiple AD objects (multi-forest) for the same user, the sync engine relies on the `Microsoft.InfromADUserAccountEnabled.xxx` link to pick the correct one.
8.	Once the user account is found, we attempt to reset the password directly in the appropriate AD forest.
9.	If the password set operation is successful, we tell the user their password has been modified and that they can go on their merry way.
10.	If the password set operation fails, we return the error to the user and let them try again.  The operation might fail because the service was down, because the password they selected did not meet organization policies, because we could not find the user in the local AD, or any number of reasons.  We have a specific message for many of these cases and tell the user what they can do to resolve the issue.

### Scenarios supported for password writeback
The table below describes which scenarios are supported for which versions of our sync capabilities.  In general, it is highly recommended that you install the latest version of [Azure AD Connect](active-directory-aadconnect.md#install-azure-ad-connect) if you want to use password writeback.

  ![][002]

### Password writeback security model
Password writeback is a highly secure and robust service.  In order to ensure your information is protected, we enable a 4-tiered security model that is described below.

- **Tenant specific service-bus relay** – When you set up the service, we set up a tenant-specific service bus relay that is protected by a randomly generated strong password that Microsoft never has access to.
- **Locked down, cryptographically strong, password encryption key** – After the service bus relay is created, we create a strong symmetric key which we use to encrypt the password as it comes over the wire.  This key lives only in your company's secret store in the cloud, which is heavily locked down and audited, just like any password in the directory.
- **Industry standard TLS** – When a password reset or change operation occurs in the cloud, we take the plaintext password and encrypt it with your public key.  We then plop that into an HTTPS message which is sent over an encrypted channel using Microsoft’s SSL certs to your service bus relay.  After that message arrives into Service Bus, your on-prem agent wakes up, authenticates to Service Bus using the strong password that had been previously generated, picks up the encrypted message, decrypts it using the private key we generated, and then attempts to set the password through the AD DS SetPassword API.  This step is what allows us to enforce your AD on-prem password policy (complexity, age, history, filters, etc) in the cloud.
- **Message expiration policies** – Finally, if for some reason the message sits in Service Bus because your on-prem service is down, it will be timed out and removed after several minutes in order to increase security even further.

## How does the password reset portal work?
When a user navigates to the password reset portal, a workflow is kicked off to determine if that user account is valid, what organization that users belongs to, where that user’s password is managed, and whether or not the user is licensed to use the feature.  Read through the steps below to learn about the logic behind the password reset page.

1.	User clicks on the Can’t access your account link or goes directly to [https://passwordreset.microsoftonline.com](https://passwordreset.microsoftonline.com).
2.	User enters a user id and passes a captcha.
3.	Azure AD verifies if the user is able to use this feature by doing the following:
    - Checks that the user has this feature enabled and an Azure AD license assigned.
        - If the user does not have this feature enabled or a license assigned, the user is asked to contact his or her administrator to reset his or her password.
    - Checks that the user has the right challenge data defined on his or her account in accordance with administrator policy.
        - If policy requires only one challenge, then it is ensured that the user has the appropriate data defined for at least one of the challenges enabled by the administrator policy.
          - If the user is not configured, then the user is advised to contact his or her administrator to reset his or her password.
        - If the policy requires two challenges, then it is ensured that the user has the appropriate data defined for at least two of the challenges enabled by the administrator policy.
          - If the user is not configured, then we the user is advised to contact his or her administrator to reset his or her password.
    - Checks whether or not the user’s password is managed on premises (federated or password hash sync’d).
       - If writeback is deployed and the user’s password is managed on premises, then the user is allowed to proceed to authenticate and reset his or her password.
       - If writeback is not deployed and the user’s password is managed on premises, then the user is asked to contact his or her administrator to reset his or her password.
4.	If it is determined that the user is able to successfully reset his or her password, then the user is guided through the reset process.

Learn more about how to deploy password writeback at [Getting Started: Azure AD Password Management](active-directory-passwords-getting-started.md).

### What data is used by password reset?
The following table outlines where and how this data is used during password reset and is designed to help you decide which authentication options are appropriate for your organization. This table also shows any formatting requirements for cases where you are providing data on behalf of users from input paths that do not validate this data.

> [AZURE.NOTE] Office Phone does not appear in the registration portal because users are currently not able to edit this property in the directory.

<table>
          <tbody><tr>
            <td>
              <p>
                <strong>Contact Method Name</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Azure Active Directory Data Element</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Used / Settable Where?</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Format requirements</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Office Phone</p>
            </td>
            <td>
              <p>PhoneNumber</p>
              <p>e.g. Set-MsolUser -UserPrincipalName JWarner@contoso.com -PhoneNumber "+1 1234567890x1234"</p>
            </td>
            <td>
              <p>Used in:</p>
              <p>Password Reset Portal</p>
              <p>Settable from:</p>
              <p>PhoneNumber is settable from PowerShell, DirSync, Azure Management Portal, and the Office Admin Portal</p>
            </td>
            <td>
              <p>+ccc xxxyyyzzzz (e.g. +1 1234567890)</p>
              <ul>
                <li class="unordered">
										Must provide a country code<br><br></li>
              </ul>
              <ul>
                <li class="unordered">
										Must provide an area code (where applicable)<br><br></li>
              </ul>
              <ul>
                <li class="unordered">
										Must have provide a + in front of the country code<br><br></li>
              </ul>
              <ul>
                <li class="unordered">
										Must have a space between country code and the rest of the number<br><br></li>
              </ul>
              <ul>
                <li class="unordered">
										Extensions are not supported, if you have any extensions specified, we will strip it from the number before dispatching the phone call.<br><br></li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <p>Mobile Phone</p>
            </td>
            <td>
              <p>AuthenticationPhone</p>
              <p>OR</p>
              <p>MobilePhone</p>
              <p>(Authentication Phone is used if there is data present, otherwise this falls back to the mobile phone field).</p>
              <p>e.g. Set-MsolUser -UserPrincipalName JWarner@contoso.com -MobilePhone "+1 1234567890x1234"</p>
            </td>
            <td>
              <p>Used in:</p>
              <p>Password Reset Portal</p>
              <p>Registration Portal</p>
              <p>Settable from: </p>
              <p>AuthenticationPhone is settable from the password reset registration portal or MFA registration portal.</p>
              <p>MobilePhone is settable from PowerShell, DirSync, Azure Management Portal, and the Office Admin Portal</p>
            </td>
            <td>
              <p>+ccc xxxyyyzzzz (e.g. +1 1234567890)</p>
              <ul>
                <li class="unordered">
										Must provide a country code.<br><br></li>
              </ul>
              <ul>
                <li class="unordered">
										Must provide an area code (where applicable).<br><br></li>
              </ul>
              <ul>
                <li class="unordered">
										Must have provide a + in front of the country code.<br><br></li>
              </ul>
              <ul>
                <li class="unordered">
										Must have a space between country code and the rest of the number.<br><br></li>
              </ul>
              <ul>
                <li class="unordered">
										Extensions are not supported, if you have any extensions specified, we ignore it when dispatching the phone call.<br><br></li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <p>Alternate Email</p>
            </td>
            <td>
              <p>AuthenticationEmail</p>
              <p>OR</p>
              <p>AlternateEmailAddresses[0] </p>
              <p>(Authentication Email is used if there is data present, otherwise this falls back to the Alternate Email field).</p>
              <p>Note: the alternate email field is specified as an array of strings in the directory.  We use the first entry in this array.</p>
              <p>e.g. Set-MsolUser -UserPrincipalName JWarner@contoso.com -AlternateEmailAddresses "email@live.com"</p>
            </td>
            <td>
              <p>Used in:</p>
              <p>Password Reset Portal</p>
              <p>Registration Portal</p>
              <p>Settable from: </p>
              <p>AuthenticationEmail is settable from the password reset registration portal or MFA registration portal.</p>
              <p>AlternateEmail is settable from PowerShell, the Azure Management Portal, and the Office Admin Portal</p>
            </td>
            <td>
              <p>
                <a href="mailto:user@domain.com">user@domain.com</a> or 甲斐@黒川.日本</p>
              <ul>
                <li class="unordered">
										Emails should follow standard formatting as per .<br><br></li>
              </ul>
              <ul>
                <li class="unordered">
										Unicode emails are supported.<br><br></li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <p>Security Questions and Answers</p>
            </td>
            <td>
              <p>Not available to modify directly in the directory.</p>
            </td>
            <td>
              <p>Used in:</p>
              <p>Password Reset Portal</p>
              <p>Registration Portal </p>
              <p>Settable from: </p>
              <p>The only way to set security questions is through the Azure Management Portal.</p>
              <p>The only way to set answers to security questions for a given user is through the Registration Portal.</p>
            </td>
            <td>
              <p>Security questions have a max of 200 characters and a min of 3 characters</p>
              <p>Answers have a max of 40 characters and a min of 3 characters</p>
            </td>
          </tr>
        </tbody></table>

###How to access password reset data for your users
####Data settable via synchronization
The following fields can be synchronized from on-premises:

* Mobile Phone
* Office Phone

####Data settable with Azure AD PowerShell
The following fields are accessible with Azure AD PowerShell & the Graph API:

* Alternate Email
* Mobile Phone
* Office Phone
* Authentication Phone
* Authentication Email

####Data settable with registration UI only
The following fields are only accessible via the SSPR registration UI (https://aka.ms/ssprsetup):

* Security Questions and Answers

####What happens when a user registers?
When a user registers, the registration page will **always** set the following fields:

* Authentication Phone
* Authentication Email
* Security Questions and Answers

If you have provided a value for **Mobile Phone** or **Alternate Email**, users can immediately use those to reset their passwords, even if they haven't registered for the service.  In addition, users will see those values when registering for the first time, and modify them if they wish.  However, after they successfully register, these values will be persisted in the **Authentication Phone** and **Authentication Email** fields, respectively.

This can be a useful way to unblock large numbers of users to use SSPR while still allowing users to validate this information through the registration process.

####Setting password reset data with PowerShell
You can set values for the following fields with Azure AD PowerShell.

* Alternate Email
* Mobile Phone
* Office Phone

To get started, you'll first need to [download and install the Azure AD PowerShell module](https://msdn.microsoft.com/library/azure/jj151815.aspx#bkmk_installmodule).  Once you have it installed, you can follow the steps below to configure each field.

#####Alternate Email
```
Connect-MsolService
Set-MsolUser -UserPrincipalName user@domain.com -AlternateEmailAddresses @("email@domain.com")
```

#####Mobile Phone
```
Connect-MsolService
Set-MsolUser -UserPrincipalName user@domain.com -MobilePhone "+1 1234567890"
```

#####Office Phone
```
Connect-MsolService
Set-MsolUser -UserPrincipalName user@domain.com -PhoneNumber "+1 1234567890"
```

####Reading password reset data with PowerShell
You can read values for the following fields with Azure AD PowerShell.

* Alternate Email
* Mobile Phone
* Office Phone
* Authentication Phone
* Authentication Email

To get started, you'll first need to [download and install the Azure AD PowerShell module](https://msdn.microsoft.com/library/azure/jj151815.aspx#bkmk_installmodule).  Once you have it installed, you can follow the steps below to configure each field.

#####Alternate Email
```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select AlternateEmailAddresses
```

#####Mobile Phone
```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select MobilePhone
```

#####Office Phone
```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select PhoneNumber
```

#####Authentication Phone
```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select -Expand StrongAuthenticationUserDetails | select PhoneNumber
```

#####Authentication Email
```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select -Expand StrongAuthenticationUserDetails | select Email
```

## Links to password reset documentation
Below are links to all of the Azure AD Password Reset documentation pages:

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).
* [**How it works**](active-directory-passwords-how-it-works.md) - learn about the six different components of the service and what each does
* [**Getting started**](active-directory-passwords-getting-started.md) - learn how to allow you users to reset and change their cloud or on-premises passwords
* [**Customize**](active-directory-passwords-customize.md) - learn how to customize the look & feel and behavior of the service to your organization's needs
* [**Best practices**](active-directory-passwords-best-practices.md) - learn how to quickly deploy and effectively manage passwords in your organization
* [**Get insights**](active-directory-passwords-get-insights.md) - learn about our integrated reporting capabilities
* [**FAQ**](active-directory-passwords-faq.md) - get answers to frequently asked questions
* [**Troubleshooting**](active-directory-passwords-troubleshoot.md) - learn how to quickly troubleshoot problems with the service



[001]: ./media/active-directory-passwords-learn-more/001.jpg "Image_001.jpg"
[002]: ./media/active-directory-passwords-learn-more/002.jpg "Image_002.jpg"
