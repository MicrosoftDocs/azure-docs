---
title: 'Azure AD Connect: Accounts and permissions | Microsoft Docs'
description: This topic describes the accounts used and created and permissions required.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''
ms.reviewer: cychua
ms.assetid: b93e595b-354a-479d-85ec-a95553dd9cc2
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/12/2018
ms.component: hybrid
ms.author: billmath

---
# Azure AD Connect: Accounts and permissions

## Accounts used for Azure AD Connect

![](media/reference-connect-accounts-permissions/account5.png)

Azure AD Connect uses 3 accounts in order to synchronize information from on-premises or Windows Server Active Directory to Azure Active Directory.  These accounts are:

- **AD DS Connector account**:     used to read/write information to Windows Server Active Directory

- **ADSync service account**:      used to run the synchronization service and access the SQL database

- **Azure AD Connector account**:     used to write information to Azure AD

In addition to these three accounts used to run Azure AD Connect, you will also need the following additional accounts to install Azure AD Connect.  These are:

- **AD DS Enterprise Administrator account**:      used to install Azure AD Connect
- **Azure AD Global Administrator account**:  used to create the Azure AD Connector account and configure Azure AD.

- **SQL SA account (optional)**:     used to create the ADSync database when using the full version of SQL Server.  This SQL Server may be local or remote to the Azure AD Connect installation.  This account may be the same account as the Enterprise Administrator.  Provisioning the database can now be performed out of band by the SQL administrator and then installed by the Azure AD Connect administrator with database owner rights.  For information on this see [Install Azure AD Connect using SQL delegated administrator permissions](how-to-connect-install-sql-delegation.md)

## Installing Azure AD Connect
The Azure AD Connect installation wizard offers two different paths:

* In Express Settings, the wizard requires more privileges.  This is so that it can set up your configuration easily, without requiring you to create users or configure permissions.
* In Custom Settings, the wizard offers you more choices and options. However, there are some situations in which you need to ensure you have the correct permissions yourself.



## Express settings installation
In Express settings, the installation wizard asks for the following:

  - AD DS Enterprise Administrator credentials
  - Azure AD Global Administrator credentials

### AD DS Enterprise Admin credentials
The AD DS Enterprise Admin account is used to configure your on-premises Active Directory. These credentials are only used during the installation and are not used after the installation has completed. The Enterprise Admin, not the Domain Admin should make sure the permissions in Active Directory can be set in all domains.

If you are upgrading from DirSync, the AD DS Enterprise Admins credentials are used to reset the password for the account used by DirSync. You also need Azure AD Global Administrator credentials.

### Azure AD Global Admin credentials
These credentials are only used during the installation and are not used after the installation has completed. It is used to create the [Azure AD Connector account](#azure-ad-service-account) used for synchronizing changes to Azure AD. The account also enables sync as a feature in Azure AD.

### AD DS Connector account required permissions for express settings
The [AD DS Connector account](#active-directory-account) is created for reading and writing to Windows Server AD and has the following permissions when created by express settings:

| Permission | Used for |
| --- | --- |
| <li>Replicate Directory Changes</li><li>Replicate Directory Changes All |Password hash sync |
| Read/Write all properties User |Import and Exchange hybrid |
| Read/Write all properties iNetOrgPerson |Import and Exchange hybrid |
| Read/Write all properties Group |Import and Exchange hybrid |
| Read/Write all properties Contact |Import and Exchange hybrid |
| Reset password |Preparation for enabling password writeback |

### Express installation wizard summary

![Express installation](./media/reference-connect-accounts-permissions/express.png)

The following is a summary of the express installlation wizard pages, the credentials collected, and what they are used for.

| Wizard Page | Credentials Collected | Permissions Required | Used For |
| --- | --- | --- | --- |
| N/A |User running the installation wizard |Administrator of the local server |<li>Creates the [ADSync servcie account](#azure-ad-connect-sync-service-account) account that is used as to run the synchronization service. |
| Connect to Azure AD |Azure AD directory credentials |Global administrator role in Azure AD |<li>Enabling sync in the Azure AD directory.</li>  <li>Creation of the [Azure AD Connector account](#azure-ad-service-account) that is used for on-going sync operations in Azure AD.</li> |
| Connect to AD DS |On-premises Active Directory credentials |Member of the Enterprise Admins (EA) group in Active Directory |<li>Creates the [AD DS Connector account](#active-directory-account) in Active Directory and grants permissions to it. This created account is used to read and write directory information during synchronization.</li> |


## Custom installation settings

With the custom settings installation, the wizard offers you more choices and options. 

### Custom installation wizard summary

The following is a summary of the custom installlation wizard pages, the credentials collected, and what they are used for.

![Express installation](./media/reference-connect-accounts-permissions/customize.png)

| Wizard Page | Credentials Collected | Permissions Required | Used For |
| --- | --- | --- | --- |
| N/A |User running the installation wizard |<li>Administrator of the local server</li><li>If using a full SQL Server, the user must be System Administrator (SA) in SQL</li> |By default, creates the local account that is used as the [sync engine service account](#azure-ad-connect-sync-service-account). The account is only created when the admin does not specify a particular account. |
| Install synchronization services, Service account option |AD or local user account credentials |User, permissions are granted by the installation wizard |If the admin specifies an account, this account is used as the service account for the sync service. |
| Connect to Azure AD |Azure AD directory credentials |Global administrator role in Azure AD |<li>Enabling sync in the Azure AD directory.</li>  <li>Creation of the [Azure AD Connector account](#azure-ad-service-account) that is used for on-going sync operations in Azure AD.</li> |
| Connect your directories |On-premises Active Directory credentials for each forest that is connected to Azure AD |The permissions depend on which features you enable and can be found in [Create the AD DS Connector account](#create-the-ad-dso-connector-account) |This account is used to read and write directory information during synchronization. |
| AD FS Servers |For each server in the list, the wizard collects credentials when the logon credentials of the user running the wizard are insufficient to connect |Domain Administrator |Installation and configuration of the AD FS server role. |
| Web application proxy servers |For each server in the list, the wizard collects credentials when the logon credentials of the user running the wizard are insufficient to connect |Local admin on the target machine |Installation and configuration of WAP server role. |
| Proxy trust credentials |Federation service trust credentials (the credentials the proxy uses to enroll for a trust certificate from the FS |Domain account that is a local administrator of the AD FS server |Initial enrollment of FS-WAP trust certificate. |
| AD FS Service Account page, "Use a domain user account option" |AD user account credentials |Domain user |The AD user account whose credentials are provided is used as the logon account of the AD FS service. |

### Create the AD DS Connector account

>[!IMPORTANT]
>A new PowerShell Module named ADSyncConfig.psm1 was introduced with build **1.1.880.0** (released in August 2018) that includes a collection of cmdlets to help you configure the correct Active Directory permissions for the Azure AD DS Connector account.
>
>For more information see [Azure AD Connect: Configure AD DS Connector Account Permission](how-to-connect-configure-ad-ds-connector-account.md)

The account you specify on the **Connect your directories** page must be present in Active Directory prior to installation.  Azure AD Connect version 1.1.524.0 and later has the option to let the Azure AD Connect wizard create the **AD DS Connector account** used to connect to Active Directory.  

It must also have the required permissions granted. The installation wizard does not verify the permissions and any issues are only found during synchronization.

Which permissions you require depends on the optional features you enable. If you have multiple domains, the permissions must be granted for all domains in the forest. If you do not enable any of these features, the default **Domain User** permissions are sufficient.

| Feature | Permissions |
| --- | --- |
| ms-DS-ConsistencyGuid feature |Write permissions to the ms-DS-ConsistencyGuid attribute documented in [Design Concepts - Using ms-DS-ConsistencyGuid as sourceAnchor](plan-connect-design-concepts.md#using-ms-ds-consistencyguid-as-sourceanchor). | 
| Password hash sync |<li>Replicate Directory Changes</li>  <li>Replicate Directory Changes All |
| Exchange hybrid deployment |Write permissions to the attributes documented in [Exchange hybrid writeback](reference-connect-sync-attributes-synchronized.md#exchange-hybrid-writeback) for users, groups, and contacts. |
| Exchange Mail Public Folder |Read permissions to the attributes documented in [Exchange Mail Public Folder](reference-connect-sync-attributes-synchronized.md#exchange-mail-public-folder) for public folders. | 
| Password writeback |Write permissions to the attributes documented in [Getting started with password management](../authentication/howto-sspr-writeback.md) for users. |
| Device writeback |Permissions granted with a PowerShell script as described in [device writeback](how-to-connect-device-writeback.md). |
| Group writeback |Read, Create, Update, and Delete group objects for synchronized **Office 365 groups**.  For more information see [Group Writeback](how-to-connect-preview.md#group-writeback).|

## Upgrade
When you upgrade from one version of Azure AD Connect to a new release, you need the following permissions:

>[!IMPORTANT]
>Starting with build 1.1.484, Azure AD Connect introduced a regression bug which requires sysadmin permissions to upgrade the SQL database.  This bug is corrected in build 1.1.647.  If you are upgrading to this build, you will need sysadmin permissions.  Dbo permissions are not sufficient.  If you attempt to upgrade Azure AD Connect without having sysadmin permissions, the upgrade will fail and Azure AD Connect will no longer function correctly afterwards.  Microsoft is aware of this and is working to correct this.


| Principal | Permissions required | Used for |
| --- | --- | --- |
| User running the installation wizard |Administrator of the local server |Update binaries. |
| User running the installation wizard |Member of ADSyncAdmins |Make changes to Sync Rules and other configuration. |
| User running the installation wizard |If you use a full SQL server: DBO (or similar) of the sync engine database |Make database level changes, such as updating tables with new columns. |

## More about the created accounts
### AD DS Connector account
If you use express settings, then an account is created in Active Directory that is used for synchronization. The created account is located in the forest root domain in the Users container and has its name prefixed with **MSOL_**. The account is created with a long complex password that does not expire. If you have a password policy in your domain, make sure long and complex passwords would be allowed for this account.

![AD account](./media/reference-connect-accounts-permissions/adsyncserviceaccount.png)

If you use custom settings, then you are responsible for creating the account before you start the installation.  See [Create the AD DS Connector account](#create-the-ad-dso-connector-account).

### ADSync service account
The sync service can run under different accounts. It can run under a **Virtual Service Account** (VSA), a **Group Managed Service Account** (gMSA/sMSA), or a regular user account. The supported options were changed with the 2017 April release of Connect when you do a fresh installation. If you upgrade from an earlier release of Azure AD Connect, these additional options are not available.

| Type of account | Installation option | Description |
| --- | --- | --- |
| [Virtual Service Account](#virtual-service-account) | Express and custom, 2017 April and later | This is the option used for all express installations, except for installations on a Domain Controller. For custom, it is the default option unless another option is used. |
| [Group Managed Service Account](#group-managed-service-account) | Custom, 2017 April and later | If you use a remote SQL server, then we recommend to use a group managed service account. |
| [User account](#user-account) | Express and custom, 2017 April and later | A user account prefixed with AAD_ is only created during installation when installed on Windows Server 2008 and when installed on a Domain Controller. |
| [User account](#user-account) | Express and custom, 2017 March and earlier | A local account prefixed with AAD_ is created during installation. When using custom installation, another account can be specified. |

If you use Connect with a build from 2017 March or earlier, then you should not reset the password on the service account since Windows destroys the encryption keys for security reasons. You cannot change the account to any other account without reinstalling Azure AD Connect. If you upgrade to a build from 2017 April or later, then it is supported to change the password on the service account but you cannot change the account used.

> [!Important]
> You can only set the service account on first installation. It is not supported to change the service account after the installation has completed.

This is a table of the default, recommended, and supported options for the sync service account.

Legend:

- **Bold** indicates the default option and in most cases the recommended option.
- *Italic* indicates the recommended option when it is not the default option.
- 2008 - Default option when installed on Windows Server 2008
- Non-bold - Supported option
- Local account - Local user account on the server
- Domain account - Domain user account
- sMSA - [standalone Managed Service account](https://technet.microsoft.com/library/dd548356.aspx)
- gMSA - [group Managed Service account](https://technet.microsoft.com/library/hh831782.aspx)

| | LocalDB</br>Express | LocalDB/LocalSQL</br>Custom | Remote SQL</br>Custom |
| --- | --- | --- | --- |
| **standalone/workgroup machine** | Not supported | **VSA**</br>Local account (2008)</br>Local account |  Not supported |
| **domain-joined machine** | **VSA**</br>Local account (2008) | **VSA**</br>Local account (2008)</br>Local account</br>Domain account</br>sMSA,gMSA | **gMSA**</br>Domain account |
| **Domain Controller** | **Domain account** | *gMSA*</br>**Domain account**</br>sMSA| *gMSA*</br>**Domain account**|

#### Virtual service account
A virtual service account is a special type of account that does not have a password and is managed by Windows.

![VSA](./media/reference-connect-accounts-permissions/aadsyncvsa.png)

The VSA is intended to be used with scenarios where the sync engine and SQL are on the same server. If you use remote SQL, then we recommend to use a [Group Managed Service Account](#managed-service-account) instead.

This feature requires Windows Server 2008 R2 or later. If you install Azure AD Connect on Windows Server 2008, then the installation falls back to using a [user account](#user-account) instead.

#### Group managed service account
If you use a remote SQL server, then we recommend to using a **group managed service account**. For more information on how to prepare your Active Directory for Group Managed Service account, see [Group Managed Service Accounts Overview](https://technet.microsoft.com/library/hh831782.aspx).

To use this option, on the [Install required components](how-to-connect-install-custom.md#install-required-components) page, select **Use an existing service account**, and select **Managed Service Account**.  
![VSA](./media/reference-connect-accounts-permissions/serviceaccount.png)  
It is also supported to use a [standalone managed service account](https://technet.microsoft.com/library/dd548356.aspx). However, these can only be used on the local machine and there is no benefit to use them over the default virtual service account.

This feature requires Windows Server 2012 or later. If you need to use an older operating system and use remote SQL, then you must use a [user account](#user-account).

#### User account
A local service account is created by the installation wizard (unless you specify the account to use in custom settings). The account is prefixed **AAD_** and used for the actual sync service to run as. If you install Azure AD Connect on a Domain Controller, the account is created in the domain. The **AAD_** service account must be located in the domain if:
   - you use a remote server running SQL server
   - you use a proxy that requires authentication

![Sync Service Account](./media/reference-connect-accounts-permissions/syncserviceaccount.png)

The account is created with a long complex password that does not expire.

This account is used to store the passwords for the other accounts in a secure way. These other accounts passwords are stored encrypted in the database. The private keys for the encryption keys are protected with the cryptographic services secret-key encryption using Windows Data Protection API (DPAPI).

If you use a full SQL Server, then the service account is the DBO of the created database for the sync engine. The service will not function as intended with any other permissions. A SQL login is also created.

The account is also granted permissions to files, registry keys, and other objects related to the Sync Engine.

### Azure AD Connector account
An account in Azure AD is created for the sync service's use. This account can be identified by its display name.

![AD account](./media/reference-connect-accounts-permissions/aadsyncserviceaccount2.png)

The name of the server the account is used on can be identified in the second part of the user name. In the picture, the server name is DC1. If you have staging servers, each server has its own account.

The account is created with a long complex password that does not expire. It is granted a special role **Directory Synchronization Accounts** that has only permissions to perform directory synchronization tasks. This special built-in role cannot be granted outside of the Azure AD Connect wizard. The Azure portal shows this account with the role **User**.

There is a limit of 20 sync service accounts in Azure AD. To get the list of existing Azure AD service accounts in your Azure AD, run the following Azure AD PowerShell cmdlet: `Get-AzureADDirectoryRole | where {$_.DisplayName -eq "Directory Synchronization Accounts"} | Get-AzureADDirectoryRoleMember`

To remove unused Azure AD service accounts, run the following Azure AD PowerShell cmdlet: `Remove-AzureADUser -ObjectId <ObjectId-of-the-account-you-wish-to-remove>`

## Related documentation
If you did not read the documentation on [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md), the following table provides links to related topics.

|Topic |Link|  
| --- | --- |
|Download Azure AD Connect | [Download Azure AD Connect](http://go.microsoft.com/fwlink/?LinkId=615771)|
|Install using Express settings | [Express installation of Azure AD Connect](how-to-connect-install-express.md)|
|Install using Customized settings | [Custom installation of Azure AD Connect](./how-to-connect-install-custom.md)|
|Upgrade from DirSync | [Upgrade from Azure AD sync tool (DirSync)](how-to-dirsync-upgrade-get-started.md)|
|After installation | [Verify the installation and assign licenses ](how-to-connect-post-installation.md)|

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
