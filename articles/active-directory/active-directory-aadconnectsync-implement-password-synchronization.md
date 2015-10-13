<properties
	pageTitle="Azure AD Connect sync - Implement password synchronization | Microsoft Azure"
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
	ms.date="10/13/2015"
	ms.author="markusvi;andkjell"/>


# Azure AD Connect sync: Implement password synchronization

With password synchronization, you enable your users to use the same password they are using to sign in to your on-premises Active Directory to sign in to Azure Active Directory.

The objective of this topic is to provide you with the information you need to understand how password synchronization works and how to enable it in your environment.

## What is Password Synchronization

Password synchronization is a feature of the Azure Active Directory Connect synchronization services (Azure AD Connect sync) that synchronizes user passwords from your on-premises Active Directory to Azure Active Directory (Azure AD). This feature enables your users to log into their Azure Active Directory services (such as Office 365, Microsoft Intune, and CRM Online) using the same password as they use to log into your on-premises network.

> [AZURE.NOTE] For more details about Active Directory Domain Services that are configured for FIPS and password synchronization, see Password Sync failing in FIPS-compliant systems.

## Availability of Password Synchronization

Any customer of Azure Active Directory is eligible to run password synchronization. See below for information on the compatibility of password synchronization and other features such as Federated Authentication.

## How Password Synchronization Works

Password synchronization is an extension to the directory synchronization feature implemented by Azure AD Connect sync. As a consequence of this, this feature requires directory synchronization between your on-premise and your Azure Active Directory to be configured.

The Active Directory Domain Service stores passwords in form of a hash value representation of the actual user password. The password hash cannot be used to sign-in to your on-premises network. It is also designed so that it cannot be reversed in order to gain access to the user’s plain text password. To synchronize a password, Azure AD Connect sync extracts the user's password hash from the on-premises Active Directory. Additional security processing is applied to the password hash before it is synchronized to the Azure Active Directory Authentication service. The actual data flow of the password synchronization process is similar to the synchronization of user data such as DisplayName or Email Addresses.

Passwords are synchronized more frequently than the standard directory synchronization window for other attributes. Passwords are synchronized on a per-user basis and are generally synchronized in chronological order. When a user’s password is synchronized from the on-premises AD to the cloud, the existing cloud password will be overwritten.

When you first enable the password synchronization feature, it will perform an initial synchronization of the passwords of all in-scope users from your on-premises Active Directory to Azure Active Directory. You cannot explicitly define the set of users that will have their passwords synchronized to the cloud. Subsequently, when a password has been changed by an on-premises user, the password synchronization feature detects and synchronizes the changed password, most often in a matter of minutes. The password synchronization feature automatically retries failed user password syncs. If an error occurs during an attempt to synchronize a password the error is logged in your event viewer.

The synchronization of a password has no impact on currently logged on users. If a user that is logged into a cloud service also changes the on-premise password, the cloud service session will continue uninterrupted. However, as soon as the cloud service requires the user to re-authenticate, the new password needs to be provided. At this point, the user is required to provide the new password – the password that has been recently synchronized from the on-premise Active Directory to the cloud.

## Security Considerations

When synchronizing passwords, the plain text version of a user’s password is neither exposed to the password synchronization feature nor to Azure AD or any of the associated services.

Additionally, there is no requirement on the on-premises Active Directory to store the password in a reversibly encrypted format. A digest of the Active Directory password hash is used for the transmission between the on-premises AD and Azure Active Directory. The digest of the password hash cannot be used to access resources in the customer's on-premises environment.

## Password Policy Considerations

There are two types of password policies that are affected by enabling password synchronization:

1. Password Complexity Policy
2. Password Expiration Policy

### Password Complexity Policy

When you enable password synchronization, the password complexity policies configured in the on-premises Active Directory override any complexity policies that may be defined in the cloud for synchronized users. This means any password that is valid in the customer's on-premises Active Directory environment can be used for accessing Azure AD services.


> [AZURE.NOTE] Passwords for users that are created directly in the cloud are still subject to password policies as defined in the cloud.

### Password Expiration Policy

If a user is in the scope of password synchronization, the cloud account password is set to "*Never Expire*". This means that it is possible for a user's password to expire in the on-premises environment, but they can continue to log into cloud services using this expired password.

The cloud password will be updated the next time the user changes the password in the on-premises environment.


## Overwriting Synchronized Passwords

An administrator can manually reset a user’s password using the Azure Active Directory PowerShell.

In this case, the new password will override the user’s synchronized password and all password policies defined in the cloud will apply to the new password.

If the user changes the on-premises password again, the new password will be synchronized to the cloud, and will override the manually updated password.


## Preparing for Password Synchronization

Your Azure Active Directory tenant must be enabled for directory synchronization before the tenant can be enabled for password synchronization.


## Enabling Password Synchronization

You enable password synchronization when running the Azure AD Connect Configuration Wizard.

On the **Optional features** dialog page, select “**Password synchronization**”.

![Optional features][1]


> [AZURE.NOTE] This process triggers a full synchronization. Full synchronization cycles generally take longer than other sync cycles to complete.


## Managing password synchronization

You can monitor the progress of password synchronization through the event log of the machine that is running Azure AD Connect.


### Determining the password synchronization status

You can determine which users have successfully had their passwords synchronized by reviewing the events that match the following criteria:

| Source| Event ID |
| --- | --- |
| Directory Synchronization| 656|
| Directory Synchronization| 657|

The events with the Event ID 656 provide a report of processed password change requests:

![Event ID 656][2]

The corresponding events with the ID 657 provide the result for these requests:

![Event ID 657][3]

In the events, the affected objects are identified by their anchor and the DN value. The anchor value corresponds to the **ImmutableId** value that is returned for a user by the Get-MsoUser cmdlet.

In addition to the object identifiers, **Event ID 656** provides the date the user’s password was changed in the on-premises Active Directory:

![Password Change Request][4]

Event ID 657 has a Result field in addition to the source object identifiers to indicate the status of synchronization for that user object.

A successfully synchronized password is in an event with the Event ID 657 indicated by a value of Success for the Result attribute. When a password synchronization attempt failed, the value of the Result attribute is Failure:

![Password Change Result][5]

### Trigger a full sync of all passwords
If you have changed the filter configuration then you need to trigger a full sync of all passwords so the users now in scope will have their passwords synchronized.

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


## Disabling Password Synchronization

You disable password synchronization by re-running the Azure AD Connect configuration wizard.
When prompted by the Wizard, de-select the “Password synchronization” checkbox.


> [AZURE.NOTE] This process triggers a full synchronization. Full synchronization cycles generally take longer than other sync cycles to complete.

After running the Configuration Wizard, your tenant will no longer be synchronizing passwords. New password changes will not synchronize to the cloud. Users that previously had their passwords synchronized will be able to continue logging in with those passwords until they manually change their passwords in the cloud.



## Additional Resources

* [Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

<!--Image references-->
[1]: ./media/active-directory-aadsync-implement-password-synchronization/IC759788.png
[2]: ./media/active-directory-aadsync-implement-password-synchronization/IC662504.png
[3]: ./media/active-directory-aadsync-implement-password-synchronization/IC662505.png
[4]: ./media/active-directory-aadsync-implement-password-synchronization/IC662506.png
[5]: ./media/active-directory-aadsync-implement-password-synchronization/IC662507.png
