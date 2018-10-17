---
title: Implement password hash synchronization with Azure AD Connect sync | Microsoft Docs
description: Provides information about how password hash synchronization works and how to set up.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''

ms.assetid: 05f16c3e-9d23-45dc-afca-3d0fa9dbf501
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/30/2018
ms.component: hybrid
ms.author: billmath

---
# Implement password hash synchronization with Azure AD Connect sync
This article provides information that you need to synchronize your user passwords from an on-premises Active Directory instance to a cloud-based Azure Active Directory (Azure AD) instance.

## What is password hash synchronization
The likelihood that you're blocked from getting your work done due to a forgotten password is related to the number of different passwords you need to remember. The more passwords you need to remember, the higher the probability to forget one. Questions and calls about password resets and other password-related issues demand the most help desk resources.

Password hash synchronization is a feature used to synchronize a hash of the hash of a users password from an on-premises Active Directory instance to a cloud-based Azure AD instance.
Use this feature to sign in to Azure AD services like Office 365, Microsoft Intune, CRM Online, and Azure Active Directory Domain Services (Azure AD DS). You sign in to the service by using the same password you use to sign in to your on-premises Active Directory instance.

![What is Azure AD Connect](./media/how-to-connect-password-hash-synchronization/arch1.png)

By reducing the number of passwords, your users need to maintain to just one. Password hash synchronization helps you to:

* Improve the productivity of your users.
* Reduce your helpdesk costs.  

Also, if you decide to use [Federation with Active Directory Federation Services (AD FS)](https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Configuring-AD-FS-for-user-sign-in-with-Azure-AD-Connect), you can optionally set up password hash synchronization as a backup in case your AD FS infrastructure fails.

Password hash synchronization is an extension to the directory synchronization feature implemented by Azure AD Connect sync. To use password hash synchronization in your environment, you need to:

* Install Azure AD Connect.  
* Configure directory synchronization between your on-premises Active Directory instance and your Azure Active Directory instance.
* Enable password hash synchronization.

For more details, see [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).

> [!NOTE]
> For more details about Azure Active Directory Domain Services configured for FIPS and password hash synchronization, see "Password hash synchronization and FIPS" later in this article.
>
>

## How password hash synchronization works
The Active Directory domain service stores passwords in the form of a hash value representation of the actual user password. A hash value is a result of a one-way mathematical function (the *hashing algorithm*). There is no method to revert the result of a one-way function to the plain text version of a password. You cannot use a password hash to sign in to your on-premises network.

To synchronize your password, Azure AD Connect sync extracts your password hash from the on-premises Active Directory instance. Extra security processing is applied to the password hash before it is synchronized to the Azure Active Directory authentication service. Passwords are synchronized on a per-user basis and in chronological order.

The actual data flow of the password hash synchronization process is similar to the synchronization of user data such as DisplayName or Email Addresses. However, passwords are synchronized more frequently than the standard directory synchronization window for other attributes. The password hash synchronization process runs every 2 minutes. You cannot modify the frequency of this process. When you synchronize a password, it overwrites the existing cloud password.

The first time you enable the password hash synchronization feature, it performs an initial synchronization of the passwords of all in-scope users. You cannot explicitly define a subset of user passwords that you want to synchronize.

When you change an on-premises password, the updated password is synchronized, most often in a matter of minutes.
The password hash synchronization feature automatically retries failed synchronization attempts. If an error occurs during an attempt to synchronize a password, an error is logged in your event viewer.

The synchronization of a password has no impact on the user  who is currently signed in.
Your current cloud service session is not immediately affected by a synchronized password change that occurs while you are signed in to a cloud service. However, when the cloud service requires you to authenticate again, you need to provide your new password.

A user must enter their corporate credentials a second time to authenticate to Azure AD, regardless of whether they're signed in to their corporate network. These pattern can be minimized, however, if the user selects the Keep me signed in (KMSI) check box at sign in. This selection sets a session cookie that bypasses authentication for 180 days. KMSI behavior can be enabled or disabled by the Azure AD administrator. In addition, you can reduce password prompts by turning on [Seamless SSO](how-to-connect-sso.md) which automatically signs users in when they are on their corporate devices connected to your corporate network.

> [!NOTE]
> Password sync is only supported for the object type user in Active Directory. It is not supported for the iNetOrgPerson object type.

### Detailed description of how password hash synchronization works
The following describes in-depth how password hash synchronization works between Active Directory and Azure AD.

![Detailed password flow](./media/how-to-connect-password-hash-synchronization/arch3.png)


1. Every two minutes, the password hash synchronization agent on the AD Connect server requests stored password hashes (the unicodePwd attribute) from a DC via the standard [MS-DRSR](https://msdn.microsoft.com/library/cc228086.aspx) replication protocol used to synchronize data between DCs. The service account must have Replicate Directory Changes and Replicate Directory Changes All AD permissions (granted by default on installation) to obtain the password hashes.
2. Before sending, the DC encrypts the MD4 password hash by using a key that is a [MD5](http://www.rfc-editor.org/rfc/rfc1321.txt) hash of the RPC session key and a salt. It then sends the result to the password hash synchronization agent over RPC. The DC also passes the salt to the synchronization agent by using the DC replication protocol, so the agent will be able to decrypt the envelope.
3.	After the password hash synchronization agent has the encrypted envelope, it uses [MD5CryptoServiceProvider](https://msdn.microsoft.com/library/System.Security.Cryptography.MD5CryptoServiceProvider.aspx) and the salt to generate a key to decrypt the received data back to its original MD4 format. At no point does the password hash synchronization agent have access to the clear text password. The password hash synchronization agent’s use of MD5 is strictly for replication protocol compatibility with the DC, and it is only used on premises between the DC and the password hash synchronization agent.
4.	The password hash synchronization agent expands the 16-byte binary password hash to 64 bytes by first converting the hash to a 32-byte hexadecimal string, then converting this string back into binary with UTF-16 encoding.
5.	The password hash synchronization agent adds a per user salt, consisting of a 10-byte length salt, to the 64-byte binary to further protect the original hash.
6.	The password hash synchronization agent then combines the MD4 hash plus the per user salt, and inputs it into the [PBKDF2](https://www.ietf.org/rfc/rfc2898.txt) function. 1000 iterations of the [HMAC-SHA256](https://msdn.microsoft.com/library/system.security.cryptography.hmacsha256.aspx) keyed hashing algorithm is used. 
7.	The password hash synchronization agent takes the resulting 32-byte hash, concatenates both the per user salt and the number of SHA256 iterations to it (for use by Azure AD), then transmits the string from Azure AD Connect to Azure AD over SSL.</br> 
8.	When a user attempts to sign in to Azure AD and enters their password, the password is run through the same MD4+salt+PBKDF2+HMAC-SHA256 process. If the resulting hash matches the hash stored in Azure AD, the user has entered the correct password and is authenticated. 

>[!Note] 
>The original MD4 hash is not transmitted to Azure AD. Instead, the SHA256 hash of the original MD4 hash is transmitted. As a result, if the hash stored in Azure AD is obtained, it cannot be used in an on-premises pass-the-hash attack.

### How password hash synchronization works with Azure Active Directory Domain Services
You can also use the password hash synchronization feature to synchronize your on-premises passwords to [Azure Active Directory Domain Services](../../active-directory-domain-services/active-directory-ds-overview.md). In this scenario, the Azure Active Directory Domain Services instance authenticates your users in the cloud with all the methods available in your on-premises Active Directory instance. The experience of this scenario is similar to using the Active Directory Migration Tool (ADMT) in an on-premises environment.

### Security considerations
When synchronizing passwords, the plain-text version of your password is not exposed to the password hash synchronization feature, to Azure AD, or any of the associated services.

User authentication takes place against Azure AD rather than against the organization's own Active Directory instance. If your organization has concerns about password data in any form leaving the premises, consider the fact that the SHA256 password data stored in Azure AD--a hash of the original MD4 hash--is significantly more secure than what is stored in Active Directory. Further, because this SHA256 hash cannot be decrypted, it cannot be brought back to the organization's Active Directory environment and presented as a valid user password in a pass-the-hash attack.

### Password policy considerations
There are two types of password policies that are affected by enabling password hash synchronization:

* Password complexity policy
* Password expiration policy

#### Password complexity policy  
When password hash synchronization is enabled, the password complexity policies in your on-premises Active Directory instance override complexity policies in the cloud for synchronized users. You can use all of the valid passwords from your on-premises Active Directory instance to access Azure AD services.

> [!NOTE]
> Passwords for users that are created directly in the cloud are still subject to password policies as defined in the cloud.

#### Password expiration policy  
If a user is in the scope of password hash synchronization, the cloud account password is set to *Never Expire*.

You can continue to sign in to your cloud services by using a synchronized password that is expired in your on-premises environment. Your cloud password is updated the next time you change the password in the on-premises environment.

#### Account expiration
If your organization uses the accountExpires attribute as part of user account management, be aware that this attribute is not synchronized to Azure AD. As a result, an expired Active Directory account in an environment configured for password hash synchronization will still be active in Azure AD. We recommend that if the account is expired, a workflow action should trigger a PowerShell script that disables the user's Azure AD account (use the [Set-AzureADUser](https://docs.microsoft.com/powershell/module/azuread/set-azureaduser?view=azureadps-2.0) cmdlet). Conversely, when the account is turned on, the Azure AD instance should be turned on.

### Overwrite synchronized passwords
An administrator can manually reset your password by using Windows PowerShell.

In this case, the new password overrides your synchronized password, and all password policies defined in the cloud are applied to the new password.

If you change your on-premises password again, the new password is synchronized to the cloud, and it overrides the manually updated password.

The synchronization of a password has no impact on the Azure user who is signed in. Your current cloud service session is not immediately affected by a synchronized password change that occurs while you're signed in to a cloud service. KMSI extends the duration of this difference. When the cloud service requires you to authenticate again, you need to provide your new password.

### Additional advantages

- Generally, password hash synchronization is simpler to implement than a federation service. It doesn't require any additional servers, and eliminates dependence on a highly available federation service to authenticate users.
- Password hash synchronization can also be enabled in addition to federation. It may be used as a fallback if your federation service experiences an outage.

## Enable password hash synchronization

>[!IMPORTANT]
>If you are migrating from AD FS (or other federation technologies) to Password Hash Synchronization, we highly recommend that you follow our detailed deployment guide published [here](https://github.com/Identity-Deployment-Guides/Identity-Deployment-Guides/blob/master/Authentication/Migrating%20from%20Federated%20Authentication%20to%20Password%20Hash%20Synchronization.docx).

When you install Azure AD Connect by using the **Express Settings** option, password hash synchronization is automatically enabled. For more details, see [Getting started with Azure AD Connect using express settings](how-to-connect-install-express.md).

If you use custom settings when you install Azure AD Connect, password hash synchronization is available on the user sign-in page. For more details, see [Custom installation of Azure AD Connect](how-to-connect-install-custom.md).

![Enabling password hash synchronization](./media/how-to-connect-password-hash-synchronization/usersignin2.png)

### Password hash synchronization and FIPS
If your server has been locked down according to Federal Information Processing Standard (FIPS), then MD5 is disabled.

**To enable MD5 for password hash synchronization, perform the following steps:**

1. Go to %programfiles%\Azure AD Sync\Bin.
2. Open miiserver.exe.config.
3. Go to the configuration/runtime node at the end of the file.
4. Add the following node: `<enforceFIPSPolicy enabled="false"/>`
5. Save your changes.

For reference, this snippet is what it should look like:

```
    <configuration>
        <runtime>
            <enforceFIPSPolicy enabled="false"/>
        </runtime>
    </configuration>
```

For information about security and FIPS, see [AAD Password Sync, encryption and FIPS compliance](https://blogs.technet.microsoft.com/enterprisemobility/2014/06/28/aad-password-sync-encryption-and-fips-compliance/).

## Troubleshoot password hash synchronization
If you have problems with password hash synchronization, see [Troubleshoot password hash synchronization](tshoot-connect-password-hash-synchronization.md).

## Next steps
* [Azure AD Connect sync: Customizing synchronization options](how-to-connect-sync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md)
* [Get a step-by-step deployment plan for migrating from ADFS to Password Hash Synchronization](https://aka.ms/authenticationDeploymentPlan)
