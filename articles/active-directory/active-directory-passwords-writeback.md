---
title: 'Azure AD SSPR with password writeback | Microsoft Docs'
description: Use Azure AD and Azure AD Connect to writeback passwords to an on-premises directory
services: active-directory
keywords: Active directory password management, password management, Azure AD self service password reset
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: gahug

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/28/2017
ms.author: joflore
ms.custom: it-pro

---
# Password writeback overview

With password writeback, you can configure Azure Active Directory (Azure AD) to write passwords back to your on-premises Active Directory. Password writeback removes the need to set up and manage a complicated on-premises self-service password reset (SSPR) solution, and it provides a convenient cloud-based way for your users to reset their on-premises passwords wherever they are. Password writeback is a component of [Azure Active Directory Connect](./connect/active-directory-aadconnect.md) that can be enabled and used by current subscribers of Premium [Azure Active Directory editions](active-directory-whatis.md).

Password writeback provides the following features:

* **Proves zero-delay feedback**: Password writeback is a synchronous operation. Your users are notified immediately if their password did not meet the policy or could not be reset or changed for any reason.
* **Supports password resets for users that use Active Directory Federation Services (AD FS) or other federation technologies**: With password writeback, as long as the federated user accounts are synchronized into your Azure AD tenant, they are able to manage their on-premises Active Directory passwords from the cloud.
* **Supports password resets for users that use** [password hash sync](./connect/active-directory-aadconnectsync-implement-password-synchronization.md): When the password reset service detects that a synchronized user account is enabled for password hash sync, we reset both this account’s on-premises and cloud password simultaneously.
* **Supports password changes from the access panel and Office 365**: When federated or password synchronized users come to change their expired or non-expired passwords, we write those passwords back to your local Active Directory environment.
* **Supports passwords writeback when an admin resets them from the Azure portal**: Whenever an admin resets a user’s password in the [Azure portal](https://portal.azure.com), if that user is federated or password synchronized, we’ll set the password the admin selects in local Active Directory as well. This functionality is currently not supported in the Office admin portal.
* **Enforces your on-premises Active Directory password policies**: When a user resets their password, we make sure that it meets your on-premises Active Directory policy before we commit it to that directory. This review includes checking the history, complexity, age, password filters, and any other password restrictions that you have defined in local Active Directory.
* **Doesn’t require any inbound firewall rules**: Password writeback uses an Azure Service Bus relay as an underlying communication channel. You don't have to open any inbound ports on your firewall for this feature to work.
* **Is not supported for user accounts that exist within protected groups in on-premises Active Directory**: For more information about protected groups, see [Protected accounts and groups in Active Directory](https://technet.microsoft.com/library/dn535499.aspx).

## How password writeback works

When a federated or password hash synchronized user comes to reset or change their password in the cloud, the following occurs:

1. We check to see what type of password the user has. If we see that the password is managed on-premises:
   * We check if the writeback service is up and running. If it's up and running, we let the user proceed.
   * If the writeback service is not up, we tell the user that their password can't be reset right now.
2. Next, the user passes the appropriate authentication gates and reaches the **Reset password** page.
3. The user selects a new password and confirms it.
4. When the user selects **Submit**, we encrypt the plaintext password with a symmetric key that was created during the writeback setup process.
5. After encrypting the password, we include it in a payload that gets sent over an HTTPS channel to your tenant-specific service bus relay (that we also set up for you during the writeback setup process). This relay is protected by a randomly generated password that only your on-premises installation knows.
6. After the message reaches the service bus, the password-reset endpoint automatically wakes up and sees that it has a reset request pending.
7. The service then looks for the user by using the cloud anchor attribute. For this lookup to succeed:

    * The user object must exist in the Active Directory connector space.
    * The user object must be linked to the corresponding metaverse (MV) object.
    * The user object must be linked to the corresponding Azure Active Directory connector object.
    * The link from the Active Directory connector object to the MV must have the synchronization rule `Microsoft.InfromADUserAccountEnabled.xxx` on the link. <br> <br>
    When the call comes in from the cloud, the synchronization engine uses the **cloudAnchor** attribute to look up the Azure Active Directory connector space object. It then follows the link back to the MV object, and then follows the link back to the Active Directory object. Because there can be multiple Active Directory objects (multi-forest) for the same user, the sync engine relies on the `Microsoft.InfromADUserAccountEnabled.xxx` link to pick the correct one.

    > [!Note]
    > As a result of this logic, for password writeback to work Azure AD Connect must be able to communicate with the primary domain controller (PDC) emulator. If you need to enable this manually, you can connect Azure AD Connect to the PDC emulator. Right-click the **properties** of the Active Directory synchronization connector, then select **configure directory partitions**. From there, look for the **domain controller connection settings** section and select the box titled **only use preferred domain controllers**. Even if the preferred domain controller is not a PDC emulator, Azure AD Connect attempts to connect to the PDC for password writeback.

8. After the user account is found, we attempt to reset the password directly in the appropriate Active Directory forest.
9. If the password set operation is successful, we tell the user their password has been changed.
    > [!NOTE]
    > If the user's password is synchronized to Azure AD by using password synchronization, there is a chance that the on-premises password policy is weaker than the cloud password policy. In this case, we still enforce whatever the on-premises policy is, and instead use password hash synchronization to synchronize the hash of that password. This policy ensures that your on-premises policy is enforced in the cloud, no matter if you use password synchronization or federation to provide single sign-on.

10. If the password set operation fails, we return an error to the user and let them try again. The operation might fail because:
    * The service was down.
    * The password they selected did not meet the organization's policies.
    * We might not find the user in local Active Directory.

    We have a specific message for many of these cases and tell the user what they can do to resolve the problem.

## Configure password writeback

We recommend that you use the auto-update feature of [Azure AD Connect](./connect/active-directory-aadconnect-get-started-express.md) if you want to use password writeback.

DirSync and Azure AD Sync are no longer supported as a way to enable password writeback. For more information to help with your transition, see [Upgrade from DirSync and Azure AD Sync](connect/active-directory-aadconnect-dirsync-deprecated.md).

The following steps assume you have already configured Azure AD Connect in your environment by using the [Express](./connect/active-directory-aadconnect-get-started-express.md) or [Custom](./connect/active-directory-aadconnect-get-started-custom.md) settings.

1. To configure and enable password writeback, sign in to your Azure AD Connect server and start the **Azure AD Connect** configuration wizard.
2. On the **Welcome** page, select **Configure**.
3. On the **Additional tasks** page, select **Customize synchronization options**, and then select **Next**.
4. On the **Connect to Azure AD** page, enter a global administrator credential, and then select **Next**.
5. On the **Connect directories** and **Domain/OU** filtering pages, select **Next**.
6. On the **Optional features** page, select the box next to **Password writeback** and select **Next**.
   ![Enable password writeback in Azure AD Connect][Writeback]
7. On the **Ready to configure** page, select **Configure** and wait for the process to finish.
8. When you see the configuration finish, select **Exit**.

For common troubleshooting tasks related to password writeback, see the section [Troubleshoot password writeback](active-directory-passwords-troubleshoot.md#troubleshoot-password-writeback) in our troubleshooting article.

## Active Directory permissions

The account specified in the Azure AD Connect utility must have the following items set if you want to be in scope for SSPR:

* **Reset password** 
* **Change password** 
* **Write permissions** on `lockoutTime`  
* **Write permissions** on `pwdLastSet`
* **Extended rights** on either:
   * The root object of *each domain* in that forest
   * The user organizational units (OUs) you want to be in scope for SSPR

If you're not sure what account the described account refers to, open the Azure Active Directory Connect configuration UI and select the **View current configuration** option. The account that you need to add permission to is listed under **Synchronized Directories**.

If you set these permissions, the MA service account for each forest can manage passwords on behalf of the user accounts within that forest. 

>[!IMPORTANT]
>If you neglect to assign these permissions, then, even though writeback appears to be configured correctly, users will encounter errors when they attempt to manage their on-premises passwords from the cloud.
>

> [!NOTE]
> It might take up to an hour or more for these permissions to replicate to all the objects in your directory.
>

To set up the appropriate permissions for password writeback to occur, complete the following steps:

1. Open Active Directory Users and Computers with an account that has the appropriate domain administration permissions.
2. From the **View** menu, make sure **Advanced features** is turned on.
3. In the left panel, right-click the object that represents the root of the domain and select **Properties** > **Security** > **Advanced**.
4. From the **Permissions** tab, select **Add**.
5. Pick the account that permissions are being applied to (from the Azure AD Connect setup).
6. In the **Applies to** drop-down list, select **Descendent user** objects.
7. Under **Permissions**, select the boxes for the following:
    * **Unexpire-password**
    * **Reset password**
    * **Change password**
    * **Write lockoutTime**
    * **Write pwdLastSet**
8. Select **Apply/OK** to apply the changes and exit any open dialog boxes.

## Licensing requirements for password writeback

For information about licensing, see [Licenses required for password writeback](active-directory-passwords-licensing.md#licenses-required-for-password-writeback) or the following sites:

* [Azure Active Directory pricing site](https://azure.microsoft.com/pricing/details/active-directory/)
* [Enterprise Mobility + Security](https://www.microsoft.com/cloud-platform/enterprise-mobility-security)
* [Microsoft 365 Enterprise](https://www.microsoft.com/secure-productive-enterprise/default.aspx)

### On-premises authentication modes that are supported for password writeback

Password writeback support for the following user password types:

* **Cloud-only users**: Password writeback does not apply in this situation, because there is no on-premises password.
* **Password-synchronized users**: Password writeback is supported.
* **Federated users**: Password writeback is supported.
* **Pass-through Authentication users**: Password writeback is supported.

### User and admin operations that are supported for password writeback

Passwords are written back in all the following situations:

* **Supported end-user operations**
  * Any end-user self-service voluntary change password operation
  * Any end-user self-service force change password operation, for example, password expiration
  * Any end-user self-service password reset that originates from the [password reset portal](https://passwordreset.microsoftonline.com)
* **Supported administrator operations**
  * Any administrator self-service voluntary change password operation
  * Any administrator self-service force change password operation, for example, password expiration
  * Any administrator self-service password reset that originates from the [password reset portal](https://passwordreset.microsoftonline.com)
  * Any administrator-initiated end-user password reset from the [Azure classic portal](https://manage.windowsazure.com)
  * Any administrator-initiated end-user password reset from the [Azure portal](https://portal.azure.com)

### User and admin operations that are not supported for password writeback

Passwords are *not* written back in any of the following situations:

* **Unsupported end-user operations**
  * Any end user resetting their own password by using PowerShell version 1, version 2, or the Azure AD Graph API
* **Unsupported administrator operations**
  * Any administrator-initiated end-user password reset from the [Office management portal](https://portal.office.com)
  * Any administrator-initiated end-user password reset from PowerShell version 1, version 2, or the Azure AD Graph API

We are working to remove these limitations, but we don't have a specific timeline we can share yet.

## Password writeback security model

Password writeback is a highly secure service. To ensure your information is protected, we enable a four-tiered security model that's described as follows:

* **Tenant-specific service-bus relay**
  * When you set up the service, we set up a tenant-specific service bus relay that's protected by a randomly generated strong password that Microsoft never has access to.
* **Locked down, cryptographically strong, password encryption key**
  * After the service bus relay is created, we create a strong symmetric key that we use to encrypt the password as it comes over the wire. This key only lives in your company's secret store in the cloud, which is heavily locked down and audited, just like any other password in the directory.
* **Industry standard Transport Layer Security (TLS)**
  1. When a password reset or change operation occurs in the cloud, we take the plaintext password and encrypt it with your public key.
  2. We place that into an HTTPS message that is sent over an encrypted channel by using Microsoft SSL certs to your service bus relay.
  3. After the message arrives in the service bus, your on-premises agent wakes up and authenticates to the service bus by using the strong password that was previously generated.
  4. The on-premises agent picks up the encrypted message and decrypts it by using the private key we generated.
  5. The on-premises agent attempts to set the password through the AD DS SetPassword API. This step is what allows us to enforce your Active Directory on-premises password policy (such as the complexity, age, history, and filters) in the cloud.
* **Message expiration policies** 
  * If the message sits in service bus because your on-premises service is down, it times out and is removed after several minutes. The time-out and removal of the message increases security even further.

### Password writeback encryption details

After a user submits a password reset, the reset request goes through several encryption steps before it arrives in your on-premises environment. These encryption steps ensure maximum service reliability and security. They are described as follows:

* **Step 1: Password encryption with 2048-bit RSA Key**: After a user submits a password to be written back to on-premises, the submitted password itself is encrypted with a 2048-bit RSA key.
* **Step 2: Package-level encryption with AES-GCM**: The entire package, the password plus the required metadata, is encrypted by using AES-GCM. This encryption prevents anyone with direct access to the underlying ServiceBus channel from viewing or tampering with the contents.
* **Step 3: All communication occurs over TLS/SSL**: All the communication with ServiceBus happens in an SSL/TLS channel. This encryption secures the contents from unauthorized third parties.
* **Automatic key rollover every six months**: Every six months, or every time password writeback is disabled and then re-enabled on Azure AD Connect. We automatically roll over all keys to ensure maximum service security and safety.

### Password writeback bandwidth usage

Password writeback is a low-bandwidth service that only sends requests back to the on-premises agent under the following circumstances:

* Two messages are sent when the feature is enabled or disabled through Azure AD Connect.
* One message is sent once every five minutes as a service heartbeat for as long as the service is running.
* Two messages are sent each time a new password is submitted:
    * The first message is a request to perform the operation.
    * The second message contains the result of the operation, and is sent in the following circumstances:
        * Each time a new password is submitted during a user self-service password reset.
        * Each time a new password is submitted during a user password change operation.
        * Each time a new password is submitted during an admin-initiated user password reset (only from the Azure admin portals).

#### Message size and bandwidth considerations

The size of each of the message described previously is typically under 1 KB. Even under extreme loads, the password writeback service itself is consuming a few kilobits per second of bandwidth. Because each message is sent in real time, only when required by a password update operation, and because the message size is so small, the bandwidth usage of the writeback capability is too small to have a measurable impact.

## Next steps

* [How do I complete a successful rollout of SSPR?](active-directory-passwords-best-practices.md)
* [Reset or change your password](active-directory-passwords-update-your-own-password.md).
* [Register for self-service password reset](active-directory-passwords-reset-register.md).
* [Do you have a licensing question?](active-directory-passwords-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](active-directory-passwords-data.md)
* [What authentication methods are available to users?](active-directory-passwords-how-it-works.md#authentication-methods)
* [What are the policy options with SSPR?](active-directory-passwords-policy.md)
* [How do I report on activity in SSPR?](active-directory-passwords-reporting.md)
* [What are all of the options in SSPR and what do they mean?](active-directory-passwords-how-it-works.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

[Writeback]: ./media/active-directory-passwords-writeback/enablepasswordwriteback.png "Enable password writeback in Azure AD Connect"
