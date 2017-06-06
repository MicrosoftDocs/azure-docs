---
title: 'Learn more: Azure Active Directory password management | Microsoft Docs'
description: Advanced topics on Azure AD password management, including how password writeback works, password writeback security, how the password reset portal works, and what data is used by password reset.
services: active-directory
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
editor: curtand

ms.assetid: d3be2912-76c8-40a0-9507-b7b1a7ce2f8f
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/28/2017
ms.author: joflore

---
# Learn more about password management
> [!IMPORTANT]
> **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md#reset-your-password).
>
>

If you have already deployed password management, or are just looking to learn more about the technical nitty gritty of how it works before deploying, this section will give you a good overview of the technical concepts behind the service. We'll cover the following:

* [**How does the password reset portal work?**](#how-does-the-password-reset-portal-work)
* [**Password writeback overview**](#password-writeback-overview)
 * [How pasword writeback works](#how-password-writeback-works)
* [**Scenarios supported for password writeback**](#scenarios-supported-for-password-writeback)
 * [Supported Azure AD Connect, Azure AD Sync, and DirSync client](#supported-clients)
 * [Licenses required for password writeback](#licenses-required-for-password-writeback)
 * [On-premises authentication modes supported for password writeback](#on-premises-authentication-modes-supported-for-password-writeback)
 * [User and Admin operations supported for password writeback](#user-and-admin-operations-supported-for-password-writeback)
 * [User and Admin operations not supported for password writeback](#user-and-admin-operations-not-supported-for-password-writeback)
* [**Password writeback security model**](#password-writeback-security-model)
 * [Password writeback encryption details](#password-writeback-encryption-details)
 * [Password writeback bandwidth usage](#password-writeback-bandwidth-usage)
* [**Deploying, managing, and accessing password reset data for your users**](#deploying-managing-and-accessing-password-reset-data-for-your-users)
 * [What data is used by password reset?](#what-data-is-used-by-password-reset)
 * [Deploying password reset without requiring end user registration](#deploying-password-reset-without-requiring-end-user-registration)
 * [What happens when a user registers for password reset?](#what-happens-when-a-user-registers)
 * [How to access password reset data for your users](#how-to-access-password-reset-data-for-your-users)
 * [Setting password reset data with PowerShell](#setting-password-reset-data-with-powershell)
 * [Reading password reset data with PowerShell](#reading-password-reset-data-with-powershell)
* [**How does Password Reset work for B2B users?**](#how-does-password-reset-work-for-b2b-users)

## How does the password reset portal work?
When a user navigates to the password reset portal, a workflow is kicked off to determine if that user account is valid, what organization that users belongs to, where that user’s password is managed, and whether or not the user is licensed to use the feature.  Read through the steps below to learn about the logic behind the password reset page.

1. User clicks on the Can’t access your account link or goes directly to [https://passwordreset.microsoftonline.com](https://passwordreset.microsoftonline.com).
2. User enters a user id and passes a captcha.
3. Azure AD verifies if the user is able to use this feature by doing the following:
   * Checks that the user has this feature enabled and an Azure AD license assigned.
     * If the user does not have this feature enabled or a license assigned, the user is asked to contact his or her administrator to reset his or her password.
   * Checks that the user has the right challenge data defined on his or her account in accordance with administrator policy.
     * If policy requires only one challenge, then it is ensured that the user has the appropriate data defined for at least one of the challenges enabled by the administrator policy.
       * If the user is not configured, then the user is advised to contact his or her administrator to reset his or her password.
     * If the policy requires two challenges, then it is ensured that the user has the appropriate data defined for at least two of the challenges enabled by the administrator policy.
       * If the user is not configured, then we the user is advised to contact his or her administrator to reset his or her password.
   * Checks whether or not the user’s password is managed on premises (federated or password hash sync’d).
     * If writeback is deployed and the user’s password is managed on premises, then the user is allowed to proceed to authenticate and reset his or her password.
     * If writeback is not deployed and the user’s password is managed on premises, then the user is asked to contact his or her administrator to reset his or her password.
4. If it is determined that the user is able to successfully reset his or her password, then the user is guided through the reset process.

Learn more about how to deploy password writeback at [Getting Started: Azure AD password management](active-directory-passwords-getting-started.md).

## Password writeback overview
Password writeback is an [Azure Active Directory Connect](connect/active-directory-aadconnect.md) component that can be enabled and used by the current subscribers of Azure Active Directory Premium. For more information, see [Azure Active Directory Editions](active-directory-editions.md).

Password writeback allows you to configure your cloud tenant to write passwords back to you on-premises Active Directory.  It obviates you from having to set up and manage a complicated on-premises self-service password reset solution, and it provides a convenient cloud-based way for your users to reset their on-premises passwords wherever they are.  Read on for some of the key features of password writeback:

* **Zero delay feedback.**  Password writeback is a synchronous operation.  Your users will be notified immediately if their password did not meet policy or was not able to be reset or changed for any reason.
* **Supports resetting passwords for users using AD FS or other federation technologies.**  With password writeback, as long as the federated user accounts are synchronized into your Azure AD tenant, they will be able to manage their on-premises AD passwords from the cloud.
* **Supports resetting passwords for users using password hash sync.** When the password reset service detects that a synchronized user account is enabled for password hash sync, we reset both this account’s on-premises and cloud password simultaneously.
* **Supports changing passwords from the access panel and Office 365.**  When federated or password sync’d users come to change their expired or non-expired passwords, we’ll write those passwords back to your local AD environment.
* **Supports writing back passwords when an admin reset them from the** [**Azure Management Portal**](https://manage.windowsazure.com).  Whenever an admin resets a user’s password in the [Azure Management Portal](https://manage.windowsazure.com), if that user is federated or password sync’d, we’ll set the password the admin selects on your local AD, as well.  This is currently not supported in the Office Admin Portal.
* **Enforces your on-premises AD password policies.**  When a user resets his/her password, we make sure that it meets your on-premises AD policy before committing it to that directory.  This includes history, complexity, age, password filters, and any other password restrictions you have defined in your local AD.
* **Doesn’t require any inbound firewall rules.**  Password writeback uses an Azure Service Bus relay as an underlying communication channel, meaning that you do not have to open any inbound ports on your firewall for this feature to work.
* **Is not supported for user accounts that exist within protected groups in your on-premises Active Directory.** For more information about protected groups, see [Protected Accounts and Groups in Active Directory](https://technet.microsoft.com/library/dn535499.aspx).

### How password writeback works
Password writeback has three main components:

* Password Reset cloud service (this is also integrated into Azure AD’s password change pages)
* Tenant-specific Azure Service Bus relay
* On-prem password reset endpoint

They fit together as described in the below diagram:

  ![][001]

When a federated or password hash sync’d user comes to reset or change his or her password in the cloud, the following occurs:

1. We check to see what type of password the user has.  If we see the password is managed on premises, then we ensure the writeback service is up and running.  If it is, we let the user proceed, if it is not, we tell the user that their password cannot be reset here.
2. Next, the user passes the appropriate authentication gates and reaches the reset password screen.
3. The user selects a new password and confirms it.
4. Upon clicking submit, we encrypt the plaintext password with a symmetric key that was created during the writeback setup process.
5. After encrypting the password, we include it in a payload that gets sent over an HTTPS channel to your tenant specific service bus relay (that we also set up for you during the writeback setup process).  This relay is protected by a randomly generated password that only your on-premises installation knows.
6. Once the message reaches service bus, the password reset endpoint automatically wakes up and sees that it has a reset request pending.
7. The service then looks for the user in question by using the cloud anchor attribute.  For this lookup to succeed, the user object must exist in the AD connector space, it must be linked to the corresponding MV object, and it must be linked to the corresponding AAD connector object. Finally, in order for sync to find this user account, the link from AD connector object to MV must have the sync rule `Microsoft.InfromADUserAccountEnabled.xxx` on the link.  This is needed because when the call comes in from the cloud, the sync engine uses the cloudAnchor attribute to look up the AAD connector space object, then follows the link back to the MV object, and then follows the link back to the AD object. Because there could be multiple AD objects (multi-forest) for the same user, the sync engine relies on the `Microsoft.InfromADUserAccountEnabled.xxx` link to pick the correct one. Note that as a result of this logic, you must connect Azure AD Connect to the Primary Domain Controller for password writeback to work.  If you need to do this, you can configure Azure AD Connect to use a Primary Domain Controller Emulator by right clicking on the **properties** of the Active Directory synchronization connector, then selecting **configure directory partitions**. From there, look for the **domain controller connection settings** section and check the box titled **only use preferred domain controllers**. Note: if the preferred DC is not a PDC emulator, Azure AD Connect will still reach out to the PDC for password writeback.
8. Once the user account is found, we attempt to reset the password directly in the appropriate AD forest.
9. If the password set operation is successful, we tell the user their password has been modified and that they can go on their merry way. In the case when the user's password is synchronized to Azure AD using Password Sync, there is a chance that the on-premises password policy is weaker than the cloud password policy. In this case, we still enforce whatever the on-premises policy is, and instead allow password hash sync to synchronize the hash of that password. This ensures that your on-premises policy is enforced in the cloud, no matter if you use password sync or federation to provide single sign-on.
10. If the password set operation fails, we return the error to the user and let them try again.  The operation might fail because the service was down, because the password they selected did not meet organization policies, because we could not find the user in the local AD, or any number of reasons.  We have a specific message for many of these cases and tell the user what they can do to resolve the issue.

## Scenarios supported for password writeback
The section below describes which scenarios are supported for which versions of our sync capabilities.  In general, We always recommend that you use the auto-update feature of Azure AD Connect, or install the latest version of [Azure AD Connect](connect/active-directory-aadconnect.md#install-azure-ad-connect) if you want to use password writeback.

* [**Supported Azure AD Connect, Azure AD Sync, and DirSync clients**](#supported-clients)
* [**Licenses required for password writeback**](#licenses-required-for-password-writeback)
* [**On-premises authentication modes supported for password writeback**](#on-premises-authentication-modes-supported-for-password-writeback)
* [**User and Admin operations supported for password writeback**](#user-and-admin-operations-supported-for-password-writeback)
* [**User and Admin operations not supported for password writeback**](#user-and-admin-operations-not-supported-for-password-writeback)

### Supported clients
We always recommend that you use the auto-update feature of Azure AD Connect, or install the latest version of [Azure AD Connect](connect/active-directory-aadconnect.md#install-azure-ad-connect) if you want to use password writeback.

* **DirSync (any version > 1.0.6862)** - _NOT SUPPORTED_ - supports only basic writeback capabilities, and is no longer supported by the product group
* **Azure AD Sync** - _DEPRECATED_ - supports only basic writeback capabilities, and is missing account unlock capabilities, rich logging, and relability improvements made in Azure AD Connect. As such, we **highly** highly recommend upgrading.
* **Azure AD Connect** - _FULLY SUPPORTED_ - supports all writeback capabiltiies - please upgrade to the latest version to get the best new features and most stability / reliability possible

### Licenses required for password writeback
In order to use password writeback, you must have one of the following licenses assigned in your tenant.

* **Azure AD Premium P1** - no limitations on password writeback usage
* **Azure AD Premium P2** - no limitations on password writeback usage
* **Enterprise Moblity Suite** - no limitations on password writeback usage
* **Enterprise Cloud Suite** - no limitations on password writeback usage

You may not use password writeback with any Office 365 licensing plan, whether trial or paid. You must upgrade to one of the above plans in order to use this feature.

We have no plans to enable password writeback for any Office 365 SKUs.

### On-premises authentication modes supported for password writeback
Password writeback works for the following user password types:

* **Cloud-only users**: Password writeback does not apply in this situation, because there is no on-premises password
* **Password-sync'd users**: Password writeback supported
* **Federated users**: Password writeback supported
* **Pass-through authentication users**: Password writeback supported

### User and Admin operations supported for password writeback
Passwords are written back in all of the following situations:

* **Supported End-user operations**
 * Any end-user self-service voluntary change password operation
 * Any end-user self-service force change password operation (e.g. password expiry)
 * Any end-user self-service password reset originating from the [Password Reset Portal](https://passwordreset.microsoftonline.com)
* **Supported Administrator operations**
 * Any administrator self-service voluntary change password operation
 * Any administrator self-service force change password operation (e.g. password expiry)
 * Any administrator self-service password reset originating from the [Password Reset Portal](https://passwordreset.microsoftonline.com)
 * Any administrator-initiated end-user password reset from the [Classic Azure Management Portal](https://manage.windowsazure.com)
 * Any administrator-initiated end-user password reset from the [Azure Portal](https://portal.azure.com)

### User and Admin operations not supported for password writeback
Passwords are not written back in any of the following situations:

* **Unsupported End-user operations**
 * Any end-user resetting his or her own password using PowerShell v1, v2, or the Azure AD Graph API
* **Unsupported Administrator operations**
 * Any administrator-initiated end-user password reset from the [Office Management Portal](https://portal.office.com)
 * Any administrator-initiated end-user password reset from PowerShell v1, v2, or the Azure AD Graph API

While we are working to remove these limitations, we do not have a specific timeline we can share yet.

## Password writeback security model
Password writeback is a highly secure and robust service.  In order to ensure your information is protected, we enable a 4-tiered security model that is described below.

* **Tenant specific service-bus relay** – When you set up the service, we set up a tenant-specific service bus relay that is protected by a randomly generated strong password that Microsoft never has access to.
* **Locked down, cryptographically strong, password encryption key** – After the service bus relay is created, we create a strong symmetric key which we use to encrypt the password as it comes over the wire.  This key lives only in your company's secret store in the cloud, which is heavily locked down and audited, just like any password in the directory.
* **Industry standard TLS** – When a password reset or change operation occurs in the cloud, we take the plaintext password and encrypt it with your public key.  We then plop that into an HTTPS message which is sent over an encrypted channel using Microsoft’s SSL certs to your service bus relay.  After that message arrives into Service Bus, your on-prem agent wakes up, authenticates to Service Bus using the strong password that had been previously generated, picks up the encrypted message, decrypts it using the private key we generated, and then attempts to set the password through the AD DS SetPassword API.  This step is what allows us to enforce your AD on-prem password policy (complexity, age, history, filters, etc) in the cloud.
* **Message expiration policies** – Finally, if for some reason the message sits in Service Bus because your on-prem service is down, it will be timed out and removed after several minutes in order to increase security even further.

### Password writeback encryption details
Below describes the encryption steps a password reset reqeust goes through after a user submits it, but before it arrives in your on-premises environment, to ensure maximum service reliability and security.

* **Step 1 - Password encryption with 2048-bit RSA Key** - Once a user submits a password to be written back to on-premises, first, the submitted password itself is encrypted with a 2048-bit RSA key.

* **Step 2 - Package-level encryption with AES-GCM** - Then the entire package (password + required metadata) is encrypted using AES-GCM. This prevents anyone with direct access to the underlying ServiceBus channel from viewing/tampering with the contents.

* **Step 3 - All communication occurs over TLS / SSL** - Additionally, all the communication with ServiceBus happens in a SSL/TLS channel. This secures the contents from unauthorized 3rd parties.

* **Step 4 - Automatic Key Rollover every 6 months** - Finally, automatically every 6 months, or every time password writeback is disabled / re-enabled on Azure AD Connect, we roll over all of these keys to ensure maximum service security and safety.

### Password writeback bandwidth usage

Password writeback is an extremely low bandwidth service that sends requests back to the on-premises agent only under the following circumstances:

1. Two messages sent when enabling or disabling the feature through Azure AD Connect.
2. One message is sent once every 5 minutes as a service heartbeat for as long as the service is running.
3. Two messages are sent each time a new password is submitted, one message as a request to perform the operation, and a subsequent message which contains the result of the operation. These messages are sent in the following cirumstances.
4. Each time a new password is submitted during a user self-service password reset.
5. Each time a new password is submitted during a user password change operation.
6. Each time a new password is submitted during an admin-initiated user password reset (from the Azure admin portals only)

#### Message size and bandwidth considerations

The size of each of the message described above is typically under 1kb, which means, even under extreme loads, the password writeback service itself will be consuming at most a few kilobits per second of bandwidth. Since each message is sent in real time, only when required by a password update operation, and since the message size is so small, the bandwidth usage of the writeback capability is effectively too small to have any real measurable impact.

## Deploying, managing, and accessing password reset data for your users
You can manage and access password reset data for your users through Azure AD Connect, PowerShell, the Graph, or our registration experiences.  You can even deploy password reset to your whole organization without requiring users to register for it by leveraging the options described below.

  * [What data is used by password reset?](#what-data-is-used-by-password-reset)
  * [Deploying password reset without requiring end user registration](#deploying-password-reset-without-requiring-end-user-registration)
  * [What happens when a user registers for password reset?](#what-happens-when-a-user-registers)
  * [How to access password reset data for your users](#how-to-access-password-reset-data-for-your-users)
  * [Setting password reset data with PowerShell](#setting-password-reset-data-with-powershell)
  * [Reading password reset data with PowerShell](#reading-password-reset-data-with-powershell)

### What data is used by password reset?
The following table outlines where and how this data is used during password reset and is designed to help you decide which authentication options are appropriate for your organization. This table also shows any formatting requirements for cases where you are providing data on behalf of users from input paths that do not validate this data.

> [!NOTE]
> Office Phone does not appear in the registration portal because users are currently not able to edit this property in the directory. Only administrators may set this value.
>
>

<table>
          <tbody><tr>
            <td>
              <p>
                <strong>Contact Method Name</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Active Directory Data Element</strong>
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
              <p>telephoneNumber</p>
              <p>This property can be synchronized to the PhoneNumber attribute in Azure Active Directory and immediately used for password reset WITHOUT requiring a user to register, first.</p>
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
              <p>Mobile</p>
              <p>This property can be synchronized to the MobilePhone attribute in Azure Active Directory and immediately used for password reset WITHOUT requiring a user to register, first.</p>
              <p>It is not possible to synchronize this property to AuthenticationPhone at this time.</p>
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
              <p>MobilePhone is settable from PowerShell, Azure AD Connect, Azure Management Portal, and the Office Admin Portal</p>
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
              <p>Not available</p>
              <p>It is not possible to synchronize values from Active Directory to either the AuthenticationEmail or AlternateEmailAddresses[0] property at this time. </p>
              <p>You may use PowerShell to set AlternateEmailAddresses[0]. Instructions for this are in the section just below this table.</p>
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
              <p>Not available</p>
              <p>It is not possible to synchronize Security Questions or Answers from Active Directory at this time.</p>
            </td>
            <td>
              <p>Not available to modify directly in the directory.</p>
              <p>May only be set during the password reset end user registration process.</p>
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


### Deploying password reset without requiring end user registration
If you want to deploy password reset without requiring your users to register for it, you can do so easily by following one of the two below options. This can be a useful way to unblock large numbers of users to use SSPR while still allowing users to validate this information through the registration process.

Many of our largest customers use this today to get started with password reset extremely quickly.

#### Synchronize phone numbers with Azure AD Connect
If you synchronize data to one or both of the below fields, it can immediately be used for password reset, without requiring users to register first:

* Mobile Phone
* Office Phone

To learn about which properties need to be updated on premises, go to the [What data is used by password reset?](#what-data-is-used-by-password-reset) section and look up the fields mentioned above.  

Make sure any phone numbers are in the format "+1 1234567890" so they work properly with our system.

#### Set phone numbers or emails with PowerShell
If you set one or more of these fields, it can immediately be used for password reset, without requiring users to register first:

* Mobile Phone
* Office Phone
* Alternate Email

To learn how to set these properties using PowerShell, go to the [Setting password reset data with PowerShell](#setting-password-reset-data-with-powershell) section.

Make sure any phone numbers are in the format "+1 1234567890" so they work properly with our system.

### What happens when a user registers?
When a user registers, the registration page will **always** set the following fields:

* Authentication Phone
* Authentication Email
* Security Questions and Answers

If you have provided a value for **Mobile Phone** or **Alternate Email**, users can immediately use those to reset their passwords, even if they haven't registered for the service.  In addition, users will see those values when registering for the first time, and modify them if they wish.  However, after they successfully register, these values will be persisted in the **Authentication Phone** and **Authentication Email** fields, respectively.

### How to access password reset data for your users
#### Data settable via synchronization
The following fields can be synchronized from on-premises:

* Mobile Phone
* Office Phone

#### Data settable with Azure AD PowerShell & Azure AD Graph
The following fields can be set using Azure AD PowerShell & the Azure AD Graph API:

* Alternate Email
* Mobile Phone
* Office Phone

#### Data settable with registration UI only
The following fields are only accessible via the SSPR registration UI (https://aka.ms/ssprsetup):

* Security Questions and Answers

#### Data readable with Azure AD PowerShell & Azure AD Graph
The following fields are accessible with Azure AD PowerShell & the Azure AD Graph API:

* Alternate Email
* Mobile Phone
* Office Phone
* Authentication Phone
* Authentication Email

### Setting password reset data with PowerShell
You can set values for the following fields with Azure AD PowerShell.

* Alternate Email
* Mobile Phone
* Office Phone

**_PowerShell V1_**

To get started, you'll first need to [download and install the Azure AD PowerShell module](https://msdn.microsoft.com/library/azure/jj151815.aspx#bkmk_installmodule).  Once you have it installed, you can follow the steps below to configure each field.

**_PowerShell V2_**

To get started, you'll first need to [download and install the Azure AD V2 PowerShell module](https://github.com/Azure/azure-docs-powershell-azuread/blob/master/Azure%20AD%20Cmdlets/AzureAD/index.md). Once you have it installed, you can follow the steps below to configure each field.

To install quickly from recent versions of PowerShell which support Install-Module, run these commands (the first line simply checks to see if it's installed already):

```
Get-Module AzureADPreview
Install-Module AzureADPreview
Connect-AzureAD
```

#### Alternate Email - How to Set Alternate Email with PowerShell
**_PowerShell V1_**

```
Connect-MsolService
Set-MsolUser -UserPrincipalName user@domain.com -AlternateEmailAddresses @("email@domain.com")
```

**_PowerShell V2_**

```
Connect-AzureAD
Set-AzureADUser -ObjectId user@domain.com -OtherMails @("email@domain.com")
```

#### Mobile Phone - How to Set Mobile Phone with PowerShell
**_PowerShell V1_**

```
Connect-MsolService
Set-MsolUser -UserPrincipalName user@domain.com -MobilePhone "+1 1234567890"
```

**_PowerShell V2_**

```
Connect-AzureAD
Set-AzureADUser -ObjectId user@domain.com -Mobile "+1 1234567890"
```

#### Office Phone - How to Set Office Phone with PowerShell
**_PowerShell V1_**

```
Connect-MsolService
Set-MsolUser -UserPrincipalName user@domain.com -PhoneNumber "+1 1234567890"
```

**_PowerShell V2_**

```
Connect-AzureAD
Set-AzureADUser -ObjectId user@domain.com -TelephoneNumber "+1 1234567890"
```

### Reading password reset data with PowerShell
You can read values for the following fields with Azure AD PowerShell.

* Alternate Email
* Mobile Phone
* Office Phone
* Authentication Phone
* Authentication Email

#### Alternate Email - How to Read Alternate Email with PowerShell
**_PowerShell V1_**

```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select AlternateEmailAddresses
```

**_PowerShell V2_**

```
Connect-AzureAD
Get-AzureADUser -ObjectID user@domain.com | select otherMails
```

#### Mobile Phone - How to Read Mobile Phone with PowerShell
**_PowerShell V1_**

```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select MobilePhone
```

**_PowerShell v2_**

```
Connect-AzureAD
Get-AzureADUser -ObjectID user@domain.com | select Mobile
```

#### Office Phone - How to Read Office Phone with PowerShell
**_PowerShell V1_**

```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select PhoneNumber
```

**_PowerShell V2_**

```
Connect-AzureAD
Get-AzureADUser -ObjectID user@domain.com | select TelephoneNumber
```

#### Authentication Phone - How to Read Authentication Phone with PowerShell
**_PowerShell V1_**

```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select -Expand StrongAuthenticationUserDetails | select PhoneNumber
```

**_PowerShell V2_**

```
Not possible in PowerShell V2
```

#### Authentication Email - How to Read Authentication Email with PowerShell
**_PowerShell V1_**

```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select -Expand StrongAuthenticationUserDetails | select Email
```

**_PowerShell V2_**

```
Not possible in PowerShell V2
```
## How does password reset work for B2B users?
Password reset and change is fully supported with all B2B configurations.  Read below for the 3 explicit B2B cases supported by password reset.

1. **Users from a partner org with an existing Azure AD tenant** - If the organization you are partnering with has an existing Azure AD tenant, we will **respect whatever password reset policies are enabled in that tenant**. For password reset to work, the partner organization just needs to make sure Azure AD SSPR is enabled, which is no additional charge for O365 customers, and can be enabled by following the steps in our [Getting Started with Password Management](https://azure.microsoft.com/documentation/articles/active-directory-passwords-getting-started/#enable-users-to-reset-or-change-their-aad-passwords) guide.
2. **Users who signed up using [self-service sign up](https://docs.microsoft.com/azure/active-directory/active-directory-self-service-signup)** - If the organization you are partnering with used the [self-service sign up](https://docs.microsoft.com/azure/active-directory/active-directory-self-service-signup) feature to get into a tenant, we will let them reset out of the box with the email they registered.
3. **B2B users** - Any new B2B users created using the new [Azure AD B2B capabilities](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b) will also be able to reset their passwords out of the box with the email they registered during the invite process.

To test any of this, just go to http://passwordreset.microsoftonline.com with one of these partner users.  As long as they have an alternate email or authentication email defined, password reset will work as expected.  More info on data used by sspr here can be found in our [What data is used by Password Reset](https://azure.microsoft.com/en-us/documentation/articles/active-directory-passwords-learn-more/#what-data-is-used-by-password-reset) overview.

## Next steps
Below are links to all of the Azure AD Password Reset documentation pages:

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md#reset-your-password).
* [**How it works**](active-directory-passwords-how-it-works.md) - learn about the six different components of the service and what each does
* [**Getting started**](active-directory-passwords-getting-started.md) - learn how to allow you users to reset and change their cloud or on-premises passwords
* [**Customize**](active-directory-passwords-customize.md) - learn how to customize the look & feel and behavior of the service to your organization's needs
* [**Best practices**](active-directory-passwords-best-practices.md) - learn how to quickly deploy and effectively manage passwords in your organization
* [**Get insights**](active-directory-passwords-get-insights.md) - learn about our integrated reporting capabilities
* [**FAQ**](active-directory-passwords-faq.md) - get answers to frequently asked questions
* [**Troubleshooting**](active-directory-passwords-troubleshoot.md) - learn how to quickly troubleshoot problems with the service

[001]: ./media/active-directory-passwords-learn-more/001.jpg "Image_001.jpg"
[002]: ./media/active-directory-passwords-learn-more/002.jpg "Image_002.jpg"
