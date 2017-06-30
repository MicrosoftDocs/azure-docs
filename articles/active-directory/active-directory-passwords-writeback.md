---
title: 'Azure AD SSPR with password writeback | Microsoft Docs'
description: Using Azure AD and Azure AD Connect to writeback passwords to on-premises directory
services: active-directory
keywords: Active directory password management, password management, Azure AD self service password reset
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
editor: gahug

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/12/2017
ms.author: joflore
ms.custom: it-pro

---
# Password writeback overview

Password writeback allows you to configure Azure AD to write passwords back to you on-premises Active Directory. It removes the need to set up and manage a complicated on-premises self-service password reset solution, and it provides a convenient cloud-based way for your users to reset their on-premises passwords wherever they are. Password writeback is a component of [Azure Active Directory Connect](./connect/active-directory-aadconnect.md) that can be enabled and used by current subscribers of Premium [Azure Active Directory Editions](active-directory-editions.md).

Password writeback provides the following features

* **Zero delay feedback** - Password writeback is a synchronous operation. Your users are notified immediately if their password did not meet policy or was not able to be reset or changed for any reason.
* **Supports resetting passwords for users using AD FS or other federation technologies** - With password writeback, as long as the federated user accounts are synchronized into your Azure AD tenant, they are able to manage their on-premises AD passwords from the cloud.
* **Supports resetting passwords for users using [password hash sync](./connect/active-directory-aadconnectsync-implement-password-synchronization.md)** - When the password reset service detects that a synchronized user account is enabled for password hash sync, we reset both this account’s on-premises and cloud password simultaneously.
* **Supports changing passwords from the access panel and Office 365** - When federated or password synchronized users come to change their expired or non-expired passwords, we write those passwords back to your local AD environment.
* **Supports writing back passwords when an admin reset them from the Azure portal** - Whenever an admin resets a user’s password in the [Azure portal](https://portal.azure.com), if that user is federated or password synchronized, we’ll set the password the admin selects on your local AD, as well. This is currently not supported in the Office Admin Portal.
* **Enforces your on-premises AD password policies** - When a user resets their password, we make sure that it meets your on-premises AD policy before committing it to that directory. This includes history, complexity, age, password filters, and any other password restrictions you have defined in your local AD.
* **Doesn’t require any inbound firewall rules** - Password writeback uses an Azure Service Bus relay as an underlying communication channel, meaning that you do not have to open any inbound ports on your firewall for this feature to work.
* **Is not supported for user accounts that exist within protected groups in your on-premises Active Directory** - For more information about protected groups, see [Protected Accounts and Groups in Active Directory](https://technet.microsoft.com/library/dn535499.aspx).

## How password writeback works

When a federated or password hash synchronized user comes to reset or change their password in the cloud, the following occurs:

1. We check to see what type of password the user has.
    * If we see the password is managed on premises
        * We check if the writeback service is up and running, if it is, we let the user proceed
        * If the writeback service is not up, we tell the user that their password cannot be reset now
2. Next, the user passes the appropriate authentication gates and reaches the reset password screen.
3. The user selects a new password and confirms it.
4. Upon clicking submit, we encrypt the plaintext password with a symmetric key that was created during the writeback setup process.
5. After encrypting the password, we include it in a payload that gets sent over an HTTPS channel to your tenant-specific service bus relay (that we also set up for you during the writeback setup process). This relay is protected by a randomly generated password that only your on-premises installation knows.
6. Once the message reaches service bus, the password reset endpoint automatically wakes up and sees that it has a reset request pending.
7. The service then looks for the user in question by using the cloud anchor attribute. For this lookup to succeed:

    * The user object must exist in the AD connector space
    * The user object must be linked to the corresponding MV object
    * The user object must be linked to the corresponding AAD connector object.
    * The link from AD connector object to MV must have the synchronization rule `Microsoft.InfromADUserAccountEnabled.xxx` on the link. <br> <br>
    When the call comes in from the cloud, the synchronization engine uses the cloudAnchor attribute to look up the AAD connector space object, follows the link back to the MV object, and then follows the link back to the AD object. Because there could be multiple AD objects (multi-forest) for the same user, the sync engine relies on the `Microsoft.InfromADUserAccountEnabled.xxx` link to pick the correct one.

    > [!Note]
    > As a result of this logic, Azure AD Connect must be able to communicate with the PDC Emulator for password writeback to work. If you need to enable this manually, you can connect Azure AD Connect to the PDC Emulator by right-clicking on the **properties** of the Active Directory synchronization connector, then selecting **configure directory partitions**. From there, look for the **domain controller connection settings** section and check the box titled **only use preferred domain controllers**. Even if the preferred DC is not a PDC emulator, Azure AD Connect will attempt to connect to the PDC for password writeback.

8. Once the user account is found, we attempt to reset the password directly in the appropriate AD forest.
9. If the password set operation is successful, we tell the user their password has been changed.
    > [!NOTE]
    > In the case when the user's password is synchronized to Azure AD using password synchronization, there is a chance that the on-premises password policy is weaker than the cloud password policy. In this case, we still enforce whatever the on-premises policy is, and instead allow password hash synchronization to synchronize the hash of that password. This ensures that your on-premises policy is enforced in the cloud, no matter if you use password synchronization or federation to provide single sign-on.

10. If the password set operation fails, we return the error to the user and let them try again.
    * The operation might fail because of the following
        * The service was down
        * The password they selected did not meet organization policies
        * We could not find the user in the local AD

    We have a specific message for many of these cases and tell the user what they can do to resolve the issue.

## Configuring password writeback

We recommend that you use the auto-update feature of [Azure AD Connect](./connect/active-directory-aadconnect-get-started-express.md) if you want to use password writeback.

DirSync and Azure AD Sync are no longer supported means of enabling password writeback the article [Upgrade from DirSync and Azure AD Sync](connect/active-directory-aadconnect-dirsync-deprecated.md) has more information to help with your transition.

The steps below assume you have already configured Azure AD Connect in your environment using the [Express](./connect/active-directory-aadconnect-get-started-express.md) or [Custom](./connect/active-directory-aadconnect-get-started-custom.md) settings.

1. To configure and enable password writeback log in to your Azure AD Connect server and start the **Azure AD Connect** configuration wizard.
2. On the Welcome screen click **Configure**.
3. On the Additional tasks screen click **Customize synchronization options** and then choose **Next**.
4. On the Connect to Azure AD screen enter a Global Administrator credential and choose **Next**.
5. On the Connect your directories and Domain and OU filtering screens you can choose **Next**.
6. On the Optional features screen check the box next to **Password writeback** and click **Next**.
   ![Enable password writeback in Azure AD Connect][Writeback]
7. On the Ready to configure screen click **Configure** and wait for the process to complete.
8. When you see Configuration complete you can click **Exit**

## Licensing requirements for password writeback

For information regarding licensing, see the topic [Licenses required for password writeback](active-directory-passwords-licensing.md#licenses-required-for-password-writeback) or the following sites

* [Azure Active Directory Pricing site](https://azure.microsoft.com/pricing/details/active-directory/)
* [Enterprise Mobility + Security](https://www.microsoft.com/cloud-platform/enterprise-mobility-security)
* [Secure Productive Enterprise](https://www.microsoft.com/secure-productive-enterprise/default.aspx)

### On-premises authentication modes supported for password writeback

Password writeback works for the following user password types:

* **Cloud-only users**: Password writeback does not apply in this situation, because there is no on-premises password
* **Password-synchronized users**: Password writeback supported
* **Federated users**: Password writeback supported
* **Pass-through authentication users**: Password writeback supported

### User and Admin operations supported for password writeback

Passwords are written back in all the following situations:

* **Supported End-user operations**
  * Any end-user self-service voluntary change password operation
  * Any end-user self-service force change password operation (for example, password expiration)
  * Any end-user self-service password reset originating from the [Password Reset Portal](https://passwordreset.microsoftonline.com)
* **Supported Administrator operations**
  * Any administrator self-service voluntary change password operation
  * Any administrator self-service force change password operation (for example, password expiration)
  * Any administrator self-service password reset originating from the [Password Reset Portal](https://passwordreset.microsoftonline.com)
  * Any administrator-initiated end-user password reset from the [Azure classic portal](https://manage.windowsazure.com)
  * Any administrator-initiated end-user password reset from the [Azure portal](https://portal.azure.com)

### User and Admin operations not supported for password writeback

Passwords are **not** written back in any of the following situations:

* **Unsupported End-user operations**
  * Any end user resetting their own password using PowerShell v1, v2, or the Azure AD Graph API
* **Unsupported Administrator operations**
  * Any administrator-initiated end-user password reset from the [Office management portal](https://portal.office.com)
  * Any administrator-initiated end-user password reset from PowerShell v1, v2, or the Azure AD Graph API

While we are working to remove these limitations, we do not have a specific timeline we can share yet.

## Password writeback security model

Password writeback is a highly secure service.  To ensure your information is protected, we enable a 4-tiered security model that is described below.

* **Tenant-specific service-bus relay**
  * When you set up the service, we set up a tenant-specific service bus relay that is protected by a randomly generated strong password that Microsoft never has access to.
* **Locked down, cryptographically strong, password encryption key**
  * After the service bus relay is created, we create a strong symmetric key we use to encrypt the password as it comes over the wire. This key lives only in your company's secret store in the cloud, which is heavily locked down and audited, just like any password in the directory.
* **Industry standard TLS**
  1. When a password reset or change operation occurs in the cloud, we take the plaintext password and encrypt it with your public key.
  2. We then place that into an HTTPS message, which is sent over an encrypted channel using Microsoft’s SSL certs to your service bus relay.
  3. After the message arrives into Service Bus, your on-premises agent wakes up and authenticates to Service Bus using the strong password that was previously generated.
  4. On-premises agent picks up the encrypted message, decrypts it using the private key we generated.
  5. On-premises agent then attempts to set the password through the AD DS SetPassword API.
     * This step is what allows us to enforce your AD on-premises password policy (complexity, age, history, filters, etc.) in the cloud.
* **Message expiration policies** 
  * If the message sits in Service Bus because your on-premises service is down, it will time out and be removed after several minutes to increase security even further.

### Password writeback encryption details

The encryption steps a password reset request goes through after a user submits it, before it arrives in your on-premises environment, to ensure maximum service reliability and security are described below.

* **Step 1 - Password encryption with 2048-bit RSA Key** - Once a user submits a password to be written back to on-premises, first, the submitted password itself is encrypted with a 2048-bit RSA key.
* **Step 2 - Package-level encryption with AES-GCM** - Then the entire package (password + required metadata) is encrypted using AES-GCM. This prevents anyone with direct access to the underlying ServiceBus channel from viewing/tampering with the contents.
* **Step 3 - All communication occurs over TLS / SSL** - All the communication with ServiceBus happens in a SSL/TLS channel. This secures the contents from unauthorized 3rd parties.
* **Automatic key rollover every six months** - Automatically every 6 months, or every time password writeback is disabled / re-enabled on Azure AD Connect, we rollover all these keys to ensure maximum service security and safety.

### Password writeback bandwidth usage

Password writeback is a low-bandwidth service that sends requests back to the on-premises agent only under the following circumstances:

1. Two messages sent when enabling or disabling the feature through Azure AD Connect.
2. One message is sent once every five minutes as a service heartbeat for as long as the service is running.
3. Two messages are sent each time a new password is submitted
    * First message, as a request to perform the operation
    * Second message, which contains the result of the operation and are sent in the following circumstances:
        * Each time a new password is submitted during a user self-service password reset.
        * Each time a new password is submitted during a user password change operation.
        * Each time a new password is submitted during an admin-initiated user password reset (from the Azure admin portals only).

#### Message size and bandwidth considerations

The size of each of the message described above is typically under 1 kb, even under extreme loads, the password writeback service itself is consuming a few kilobits per second of bandwidth. Since each message is sent in real time, only when required by a password update operation, and since the message size is so small, the bandwidth usage of the writeback capability is effectively too small to have any real measurable impact.

## Next steps

The following links provide additional information regarding password reset using Azure AD

* [**Quick Start**](active-directory-passwords-getting-started.md) - Get up and running with Azure AD self service password management 
* [**Licensing**](active-directory-passwords-licensing.md) - Configure your Azure AD Licensing
* [**Data**](active-directory-passwords-data.md) - Understand the data that is required and how it is used for password management
* [**Rollout**](active-directory-passwords-best-practices.md) - Plan and deploy SSPR to your users using the guidance found here
* [**Customize**](active-directory-passwords-customize.md) - Customize the look and feel of the SSPR experience for your company.
* [**Policy**](active-directory-passwords-policy.md) - Understand and set Azure AD password policies
* [**Reporting**](active-directory-passwords-reporting.md) - Discover if, when, and where your users are accessing SSPR functionality
* [**Technical Deep Dive**](active-directory-passwords-how-it-works.md) - Go behind the curtain to understand how it works
* [**Frequently Asked Questions**](active-directory-passwords-faq.md) - How? Why? What? Where? Who? When? - Answers to questions you always wanted to ask
* [**Troubleshoot**](active-directory-passwords-troubleshoot.md) - Learn how to resolve common issues that we see with SSPR

[Writeback]: ./media/active-directory-passwords-writeback/enablepasswordwriteback.png "Enable password writeback in Azure AD Connect"
