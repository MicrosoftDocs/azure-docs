<properties
	pageTitle="Azure AD Connect sync: Implement password synchronization | Microsoft Azure"
	description="Provides you with the information you need to understand how password synchronization works and how to enable it in your environment."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/16/2015"
	ms.author="markusvi;andkjell"/>


# Azure AD Connect sync: Implement password synchronization

With password synchronization, you enable your users to use the same password they are using to sign in to your on-premises Active Directory to sign in to Azure Active Directory.

The objective of this topic is to provide you with the information you need to understand how password synchronization works and how to enable it in your environment.

## What is password synchronization

Password synchronization is a feature of the Azure Active Directory Connect synchronization services (Azure AD Connect sync) that synchronizes user passwords from your on-premises Active Directory to Azure Active Directory (Azure AD). This feature enables your users to log into their Azure Active Directory services (such as Office 365, Microsoft Intune, and CRM Online) using the same password as they use to log into your on-premises network.

> [AZURE.NOTE] For more details about Active Directory Domain Services that are configured for FIPS and password synchronization, see [Password Sync and FIPS](#password-synchronization-and-fips).

### Availability of password synchronization

Any customer of Azure Active Directory is eligible to run password synchronization. See below for information on the compatibility of password synchronization and other features such as Federated Authentication.

### How password synchronization works

Password synchronization is an extension to the directory synchronization feature implemented by Azure AD Connect sync. As a consequence of this, this feature requires directory synchronization between your on-premise and your Azure Active Directory to be configured.

The Active Directory Domain Service stores passwords in form of a hash value representation of the actual user password. The password hash cannot be used to sign-in to your on-premises network. It is also designed so that it cannot be reversed in order to gain access to the user’s plain text password. To synchronize a password, Azure AD Connect sync extracts the user's password hash from the on-premises Active Directory. Additional security processing is applied to the password hash before it is synchronized to the Azure Active Directory Authentication service. The actual data flow of the password synchronization process is similar to the synchronization of user data such as DisplayName or Email Addresses.

Passwords are synchronized more frequently than the standard directory synchronization window for other attributes. Passwords are synchronized on a per-user basis and are generally synchronized in chronological order. When a user’s password is synchronized from the on-premises AD to the cloud, the existing cloud password will be overwritten.

When you first enable the password synchronization feature, it will perform an initial synchronization of the passwords of all in-scope users from your on-premises Active Directory to Azure Active Directory. You cannot explicitly define the set of users that will have their passwords synchronized to the cloud. Subsequently, when a password has been changed by an on-premises user, the password synchronization feature detects and synchronizes the changed password, most often in a matter of minutes. The password synchronization feature automatically retries failed user password syncs. If an error occurs during an attempt to synchronize a password the error is logged in your event viewer.

The synchronization of a password has no impact on currently logged on users. If a user that is logged into a cloud service also changes the on-premise password, the cloud service session will continue uninterrupted. However, as soon as the cloud service requires the user to re-authenticate, the new password needs to be provided. At this point, the user is required to provide the new password – the password that has been recently synchronized from the on-premise Active Directory to the cloud.

> [AZURE.NOTE] Password sync is only supported for the object type user in Active Directory. It is not supported for the iNetOrgPerson object type.

### How password synchronization works with Azure AD Domain Services

If you enable this service in Azure AD, the password sync option is required to get a single-sign on experience. With this service enabled, the behavior for password sync is changed and the password hashes will also be synchronized as-is from your on-premises Active Directory to Azure AD Domain Services. The functionality is similar to ADMT (Active Directory Migration Tool) and allows Azure AD Domain Services to be able to authenticate the user with all the methods available in the on-prem AD.

### Security considerations

When synchronizing passwords, the plain text version of a user’s password is neither exposed to the password synchronization feature nor to Azure AD or any of the associated services.

Additionally, there is no requirement on the on-premises Active Directory to store the password in a reversibly encrypted format. A digest of the Active Directory password hash is used for the transmission between the on-premises AD and Azure Active Directory. The digest of the password hash cannot be used to access resources in the customer's on-premises environment.

### Password policy considerations

There are two types of password policies that are affected by enabling password synchronization:

1. Password Complexity Policy
2. Password Expiration Policy

**Password complexity policy**

When you enable password synchronization, the password complexity policies configured in the on-premises Active Directory override any complexity policies that may be defined in the cloud for synchronized users. This means any password that is valid in the customer's on-premises Active Directory environment can be used for accessing Azure AD services.

> [AZURE.NOTE] Passwords for users that are created directly in the cloud are still subject to password policies as defined in the cloud.

**Password expiration policy**

If a user is in the scope of password synchronization, the cloud account password is set to "*Never Expire*". This means that it is possible for a user's password to expire in the on-premises environment, but they can continue to log into cloud services using this expired password.

The cloud password will be updated the next time the user changes the password in the on-premises environment.

### Overwriting synchronized passwords

An administrator can manually reset a user’s password using the Azure Active Directory PowerShell.

In this case, the new password will override the user’s synchronized password and all password policies defined in the cloud will apply to the new password.

If the user changes the on-premises password again, the new password will be synchronized to the cloud, and will override the manually updated password.

## Preparing for password synchronization


### Enabling password synchronization

If you use express settings when you install Azure AD Connect then password synchronization will be enabled by default.

If you use custom settings when you install Azure AD Connect they you enable password synchronization on the user sign-in page.
![usersignin](./media/active-directory-aadsync-implement-password-synchronization/usersignin.png)

If you select to use **Federation with AD FS** then you can optionally enable password sync as a backup in case your AD FS infrastructure fails. You can also enable it if you plan to use Azure AD Domain Services.

### Password synchronization and FIPS

If your server has been locked down according to FIPS (Federal Information Processing Standard) then MD5 has been disabled. To enable this for password synchronization, add the enforceFIPSPolicy key in miiserver.exe.config in C:\Program Files\Azure AD Sync\Bin.

```
<configuration>
    <runtime>
        <enforceFIPSPolicy enabled="false"/>
    </runtime>
</configuration>
```

The configuration/runtime node can be found at the end of the config file.

For information about security and FIPS see [AAD Password Sync, Encryption and FIPS compliance](http://blogs.technet.com/b/ad/archive/2014/06/28/aad-password-sync-encryption-and-and-fips-compliance.aspx)

## Managing password synchronization

### Troubleshoot password synchronization

Start **Synchronization Service Manager**, open **Connectors**, select the Active Directory Connector the user is located in, select **Search Connector Space**, and find the user you are looking for.

![csuser](./media/active-directory-aadsync-implement-password-synchronization/cspasswordsync.png)

On the user, select the **lineage** tab and make sure at least one Sync Rule shows **Password Sync** as **True**. With default configuration, this would be the Sync Rule named **In from AD - User AccountEnabled**.

To see the password sync details of the object, click on the button **Log...** at the bottom of this page. This will produce this page with a historic view of the user's password sync status for the past week.

![object log](./media/active-directory-aadsync-implement-password-synchronization/csobjectlog.png)

The status column can have the following values which also indicates the issue and why a password is not synchronized.

| Status | Description |
| ---- | ----- |
| Success | Password has been successfully synchronized. |
| FilteredByTarget | Password is set to **User must change password at next logon**. Password has not been synchronized. |
| NoTargetConnection | No object in the metaverse or in the Azure AD connector space. |
| SourceConnectorNotPresent | No object found in the on-premises Active Directory connector space. |
| TargetNotExportedToDirectory | The object in the Azure AD connector space has not yet been exported. |
| MigratedCheckDetailsForMoreInfo | Log entry was created before build 1.0.9125.0 and is shown in its legacy state. |


### Trigger a full sync of all passwords
Forcing a full sync of all passwords should not be required, but if for some reason you need to, here is the PowerShell for it.

    $adConnector = "<CASE SENSITIVE AD CONNECTOR NAME>"
    $aadConnector = "<CASE SENSITIVE AAD CONNECTOR NAME>"
    Import-Module adsync
    $c = Get-ADSyncConnector -Name $adConnector
    $p = New-Object Microsoft.IdentityManagement.PowerShell.ObjectModel.ConfigurationParameter “Microsoft.Synchronize.ForceFullPasswordSync”, String, ConnectorGlobal, $null, $null, $null
    $p.Value = 1
    $c.GlobalParameters.Remove($p.Name)
    $c.GlobalParameters.Add($p)
    $c = Add-ADSyncConnector -Connector $c
    Set-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector -TargetConnector $aadConnector -Enable $false
    Set-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector -TargetConnector $aadConnector -Enable $true




## Additional resources

* [Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
