---
title: 'Microsoft Entra Connect: Accounts and permissions'
description: Learn about accounts that are used and created and the permissions that are required to install and use Microsoft Entra Connect.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.custom: has-azure-ad-ps-ref
ms.topic: reference
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra Connect: Accounts and permissions

Learn about accounts that are used and created and the permissions that are required to install and use Microsoft Entra Connect.

:::image type="content" source="media/reference-connect-accounts-permissions/account5.png" border="false" alt-text="Diagram that shows an overview of Microsoft Entra Connect required accounts.":::

<a name='accounts-used-for-azure-ad-connect'></a>

## Accounts used for Microsoft Entra Connect

Microsoft Entra Connect uses three accounts to *synchronize information* from on-premises Windows Server Active Directory (Windows Server AD) to Microsoft Entra ID:

- **AD DS Connector account**: Used to read and write information to Windows Server AD by using Active Directory Domain Services (AD DS).

- **ADSync service account**: Used to run the sync service and access the SQL Server database.

- **Microsoft Entra Connector account**: Used to write information to Microsoft Entra ID.

You also need the following accounts to *install* Microsoft Entra Connect:

- **Local Administrator account**: The administrator who is installing Microsoft Entra Connect and who has local Administrator permissions on the computer.

- **AD DS Enterprise Administrator account**: Optionally used to create the required AD DS Connector account.

- **Microsoft Entra Global Administrator account**:  Used to create the Microsoft Entra Connector account and to configure Microsoft Entra ID. You can view Global Administrator and Hybrid Identity Administrator accounts in the [Microsoft Entra admin center](https://entra.microsoft.com). See [List Microsoft Entra role assignments](../../roles/view-assignments.md).

- **SQL SA account (optional)**: Used to create the ADSync database when you use the full version of SQL Server. The instance of SQL Server can be local or remote to the Microsoft Entra Connect installation. This account can be the same account as the Enterprise Administrator account.

   Provisioning the database can now be performed out-of-band by the SQL Server administrator and then installed by the Microsoft Entra Connect administrator if the account has database owner (DBO) permissions. For more information, see [Install Microsoft Entra Connect by using SQL delegated administrator permissions](how-to-connect-install-sql-delegation.md).

> [!IMPORTANT]
> Beginning in build 1.4.###.#, you no longer can use an Enterprise Administrator account or a Domain Administrator account as the AD DS Connector account. If you attempt to enter an account that is an Enterprise Administrator or Domain Administrator for **Use existing account**, the wizard displays an error message and you can't proceed.

> [!NOTE]
> You can manage the administrative accounts that are used in Microsoft Entra Connect by using an *enterprise access model*. An organization can use an enterprise access model to host administrative accounts, workstations, and groups in an environment that has stronger security controls than a production environment. For more information, see [Enterprise access model](/windows-server/identity/securing-privileged-access/securing-privileged-access-reference-material#esae-administrative-forest-design-approach).
>
> The Global Administrator role isn't required after initial setup. After setup, the only required account is the Directory Synchronization Accounts role account. Instead of removing the account that has the Global Administrator role, we recommend that you change the role to a role that has a lower level of permissions. Completely removing the account might introduce issues if you ever need to run the wizard again. You can add permissions if you need to use the Microsoft Entra Connect wizard again.

<a name='azure-ad-connect-installation'></a>

## Microsoft Entra Connect installation

The Microsoft Entra Connect installation wizard offers two paths:

- **Express settings**: In Microsoft Entra Connect express settings, the wizard requires more permissions so that it can easily configure your installation. The wizard creates users and sets up permissions so that you don't have to.
- **Custom settings**: In Microsoft Entra Connect custom settings, you have more choices and options in the wizard. However, for some scenarios, it's important to ensure that you have the correct permissions yourself.

<a name="express-settings-installation"></a>

## Express settings

In express settings, you enter this information in the installation wizard:

- AD DS Enterprise Administrator credentials
- Microsoft Entra Global Administrator credentials

### AD DS Enterprise Administrator credentials

The AD DS Enterprise Administrator account is used to configure Windows Server AD. These credentials are used only during installation. The Enterprise Administrator, not the Domain Administrator, should make sure that the permissions in Windows Server AD can be set in all domains.

If you're upgrading from DirSync, the AD DS Enterprise Administrator credentials are used to reset the password for the account that DirSync used. Microsoft Entra Global Administrator credentials also are required.

<a name='azure-ad-global-administrator-credentials'></a>

### Microsoft Entra Global Administrator credentials

Credentials for the Microsoft Entra Global Administrator account are used only during installation. The account is used to create the Microsoft Entra Connector account that syncs changes to Microsoft Entra ID. The account also enables sync as a feature in Microsoft Entra ID.

For more information, see [Global Administrator](../../roles/permissions-reference.md#global-administrator).

### AD DS Connector account required permissions for express settings

The AD DS Connector account is created to read and write to Windows Server AD. The account has the following permissions when it's created during express settings installation:

| Permission | Used for |
| --- | --- |
| - Replicate Directory Changes<br />- Replicate Directory Changes All |Password hash sync |
| Read/Write all properties User |Import and Exchange hybrid |
| Read/Write all properties iNetOrgPerson |Import and Exchange hybrid |
| Read/Write all properties Group |Import and Exchange hybrid |
| Read/Write all properties Contact |Import and Exchange hybrid |
| Reset password |Preparation for enabling password writeback |

### Express settings wizard

In an express settings installation, the wizard creates some accounts and settings for you.

:::image type="content" source="media/how-to-connect-install-express/express.png" alt-text="Screenshot that shows the Express Settings page in Microsoft Entra Connect.":::

The following table is a summary of the express settings wizard pages, the credentials that are collected, and what they're used for:

| Wizard page | Credentials collected | Permissions required | Purpose |
| --- | --- | --- | --- |
| N/A |The user that's running the installation wizard. |Administrator of the local server. |Used to create the ADSync service account that's used to run the sync service. |
| Connect to Microsoft Entra ID |Microsoft Entra directory credentials. |Global Administrator role in Microsoft Entra ID. |- Used to enable sync in the Microsoft Entra directory.<br /> - Used to create the Microsoft Entra Connector account that's used for ongoing sync operations in Microsoft Entra ID. |
| Connect to AD DS |Windows Server AD credentials. |Member of the Enterprise Admins group in Windows Server AD. |Used to create the AD DS Connector account in Windows Server AD and grant permissions to it. This created account is used to read and write directory information during sync. |

<a name="custom-installation-settings"></a>

## Custom settings

In a custom settings installation, you have more choices and options in the wizard.

:::image type="content" source="media/reference-connect-accounts-permissions/customize.png" alt-text="Screenshot that shows the Express Settings page in Microsoft Entra Connect, with the Customize button highlighted.":::

### Custom settings wizard

The following table is a summary of the custom settings wizard pages, the credentials collected, and what they're used for:

| Wizard page | Credentials collected | Permissions required | Purpose |
| --- | --- | --- | --- |
| N/A |The user that's running the installation wizard. |- Administrator of the local server.<br />- If using an instance of full SQL Server, the user must be System Administrator (sysadmin) in SQL Server.</li> |By default, used to create the local account that's used as the sync engine service account. The account is created only when the admin doesn't specify an account. |
| Install synchronization services, service account option |The Windows Server AD or local user account credentials. |User and permissions are granted by the installation wizard. |If the admin specifies an account, this account is used as the service account for the sync service. |
| Connect to Microsoft Entra ID |Microsoft Entra directory credentials. |Global Administrator role in Microsoft Entra ID. |- Used to enable sync in the Microsoft Entra directory.<br />- Used to create the Microsoft Entra Connector account that's used for ongoing sync operations in Microsoft Entra ID. |
| Connect your directories |Windows Server AD credentials for each forest that is connected to Microsoft Entra ID. |The permissions depend on which features you enable and can be found in [Create the AD DS Connector account](#create-the-ad-ds-connector-account). |This account is used to read and write directory information during sync. |
| AD FS Servers |For each server in the list, the wizard collects credentials when the sign-in credentials of the user running the wizard are insufficient to connect. |The Domain Administrator account. |Used during installation and configuration of the Active Directory Federation Services (AD FS) server role. |
| Web application proxy servers |For each server in the list, the wizard collects credentials when the sign-in credentials of the user running the wizard are insufficient to connect. |Local admin on the target machine. |Used during installation and configuration of the web application proxy (WAP) server role. |
| Proxy trust credentials |Federation service trust credentials (the credentials the proxy uses to enroll for a trust certificate from the federation services (FS)). |The domain account that's a Local Administrator of the AD FS server. |Initial enrollment of the FS-WAP trust certificate. |
| AD FS Service Account page **Use a domain user account option** |The Windows Server AD user account credentials. |A domain user. |The Microsoft Entra user account whose credentials are provided is used as the sign-in account of the AD FS service. |

### Create the AD DS Connector account

> [!IMPORTANT]
> A new PowerShell module named *ADSyncConfig.psm1* was introduced with build 1.1.880.0 (released in August 2018). The module includes a collection of cmdlets that help you configure the correct Windows Server AD permissions for the Microsoft Entra Domain Services Connector account.
>
> For more information, see [Microsoft Entra Connect: Configure AD DS Connector account permission](how-to-connect-configure-ad-ds-connector-account.md).

The account you specify on the **Connect your directories** page must be created in Windows Server AD as a normal user object (VSA, MSA, or gMSA aren't supported) before installation. Microsoft Entra Connect version 1.1.524.0 and later has the option to let the Microsoft Entra Connect wizard create the AD DS Connector account that's used to connect to Windows Server AD.

The account you specify also must have the required permissions. The installation wizard doesn't verify the permissions, and any issues are found only during the sync process.

Which permissions you require depends on the optional features you enable. If you have multiple domains, the permissions must be granted for all domains in the forest. If you don't enable any of these features, the default Domain User permissions are sufficient.

| Feature | Permissions |
| --- | --- |
| ms-DS-ConsistencyGuid feature |Write permissions to the `ms-DS-ConsistencyGuid` attribute documented in [Design Concepts - Using ms-DS-ConsistencyGuid as sourceAnchor](plan-connect-design-concepts.md#using-ms-ds-consistencyguid-as-sourceanchor). |
| Password hash sync |- Replicate Directory Changes<br />- Replicate Directory Changes All |
| Exchange hybrid deployment |Write permissions to the attributes documented in [Exchange hybrid writeback](reference-connect-sync-attributes-synchronized.md#exchange-hybrid-writeback) for users, groups, and contacts. |
| Exchange Mail Public Folder |Read permissions to the attributes documented in [Exchange Mail Public Folder](reference-connect-sync-attributes-synchronized.md#exchange-mail-public-folder) for public folders. |
| Password writeback |Write permissions to the attributes documented in [Getting started with password management](../../authentication/tutorial-enable-sspr-writeback.md) for users. |
| Device writeback |Permissions granted with a PowerShell script as described in [Device writeback](how-to-connect-device-writeback.md). |
| Group writeback |Allows you to writeback *Microsoft 365 Groups* to a forest that has Exchange installed.|

<a name="upgrade"></a>

## Permissions required to upgrade

When you upgrade from one version of Microsoft Entra Connect to a new release, you need the following permissions:

| Principal | Permissions required | Purpose |
| --- | --- | --- |
| The user that's running the installation wizard |Administrator of the local server |Used to update binaries. |
| The user that's running the installation wizard |Member of ADSyncAdmins |Used to make changes to sync rules and other configurations. |
| The user that's running the installation wizard |If you use a full instance of SQL Server: DBO (or similar) of the sync engine database |Used to make database-level changes, such as updating tables with new columns. |

> [!IMPORTANT]
> In build 1.1.484, a regression bug was introduced in Microsoft Entra Connect. The bug requires sysadmin permissions to upgrade the SQL Server database. The bug is corrected in build 1.1.647. To upgrade to this build, you must have sysadmin permissions. In this scenario, DBO permissions aren't sufficient. If you attempt to upgrade Microsoft Entra Connect without sysadmin permissions, the upgrade fails and Microsoft Entra Connect no longer functions correctly.

## Created accounts details

The following sections give you more information about created accounts in Microsoft Entra Connect.

### AD DS Connector account

If you use express settings, an account that's used for syncing is created in Windows Server AD. The created account is located in the forest root domain in the Users container. The account name is prefixed with *MSOL_*. The account is created with a long, complex password that doesn't expire. If you have a password policy in your domain, make sure that long and complex passwords are allowed for this account.

:::image type="content" source="media/reference-connect-accounts-permissions/adsyncserviceaccount.png" alt-text="Screenshot that shows an AD DS Connector account with the MSOL prefix in Microsoft Entra Connect.":::

If you use custom settings, you're responsible for creating the account before you start the installation. See [Create the AD DS Connector account](#create-the-ad-ds-connector-account).

### ADSync service account

The sync service can run under different accounts. It can run under a *virtual service account* (VSA), a *group managed service account* (gMSA), a *standalone managed service* (sMSA), or a regular user account. The supported options were changed with the 2017 April release of Microsoft Entra Connect when you do a fresh installation. If you upgrade from an earlier release of Microsoft Entra Connect, these other options aren't available.

| Type of account | Installation option | Description |
| --- | --- | --- |
| [VSA](#vsa) | Express and custom, 2017 April and later | This option is used for all express settings installations, except for installations on a domain controller. For custom settings, it's the default option. |
| [gMSA](#gmsa) | Custom, 2017 April and later | If you use a remote instance of SQL Server, we recommend that you use a gMSA. |
| [User account](#user-account) | Express and custom, 2017 April and later | A user account prefixed with *AAD_* is created during installation only when Microsoft Entra Connect is installed on Windows Server 2008 and when it's installed on a domain controller. |
| [User account](#user-account) | Express and custom, 2017 March and earlier | A local account prefixed with *AAD_* is created during installation. In a custom installation, you can specify a different account. |

If you use Microsoft Entra Connect with a build from 2017 March or earlier, don't reset the password on the service account. Windows destroys the encryption keys for security reasons. You can't change the account to any other account without reinstalling Microsoft Entra Connect. If you upgrade to a build from 2017 April or later, you can change the password on the service account, but you can't change the account that's used.

> [!IMPORTANT]
> You can set the service account only on first installation. You can't change the service account after installation is finished.

The following table describes default, recommended, and supported options for the sync service account.

Legend:

- **Bold**= The default option and, in most cases, the recommended option.
- *Italic* = The recommended option when it isn't the default option.
- 2008 = The default option when installed on Windows Server 2008
- Non-bold = A supported option
- Local account = Local user account on the server
- Domain account = Domain user account
- sMSA = [standalone managed service account](../../architecture/service-accounts-on-premises.md)
- gMSA = [group managed service account](/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview)

| | Local database<br />Express | Local database/Local SQL Server<br />Custom | Remote SQL Server<br />Custom |
| --- | --- | --- | --- |
| **domain-joined machine** | **VSA**<br />Local account (2008) | **VSA**<br />Local account (2008)<br />Local account<br />Domain account<br />sMSA, gMSA | **gMSA**<br />Domain account |
| **Domain controller** | **Domain account** | *gMSA*<br />**Domain account**<br />sMSA| *gMSA*<br />**Domain account**|

#### VSA

A VSA is a special type of account that doesn't have a password and is managed by Windows.

:::image type="content" source="media/reference-connect-accounts-permissions/aadsyncvsa.png" alt-text="Screenshot that shows the virtual service account.":::

The VSA is intended to be used with scenarios in which the sync engine and SQL Server are on the same server. If you use remote SQL Server, we recommend that you use a gMSA instead of a VSA.

The VSA feature requires Windows Server 2008 R2 or later. If you install Microsoft Entra Connect on Windows Server 2008, the installation falls back to using a [user account](#user-account) instead of a VSA.

#### gMSA

If you use a remote instance of SQL Server, we recommend that you use a gMSA. For more information about how to prepare Windows Server AD for gMSA, see [Group managed service accounts overview](/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview).

To use this option, on the [Install required components](how-to-connect-install-custom.md#install-required-components) page, select **Use an existing service account**, and then select **Managed Service Account**.

:::image type="content" source="media/reference-connect-accounts-permissions/serviceaccount.png" alt-text="Screenshot that shows selecting Managed Service Account in Windows Server.":::

You also can use an [sMSA](../../architecture/service-accounts-on-premises.md) in this scenario. However, you can use an sMSA only on the local computer, and there's no benefit to using an sMSA instead of the default VSA.

The sMSA feature requires Windows Server 2012 or later. If you need to use an earlier version of an operating system and you use remote SQL Server, you must use a [user account](#user-account).

#### User account

A local service account is created by the installation wizard (unless you specify in custom settings the account to use). The account is prefixed with *AAD_* and is used for the actual sync service to run as. If you install Microsoft Entra Connect on a domain controller, the account is created in the domain. The *AAD_* service account must be located in the domain if:

- You use a remote server running SQL Server.
- You use a proxy that requires authentication.

:::image type="content" source="media/reference-connect-accounts-permissions/syncserviceaccount.png" alt-text="Screenshot that shows the sync service user account in Windows Server.":::

The *AAD_* service account is created with a long, complex password that doesn't expire.

This account is used to securely store the passwords for the other accounts. The passwords are stored encrypted in the database. The private keys for the encryption keys are protected with the cryptographic services secret key encryption by using Windows Data Protection API (DPAPI).

If you use a full instance of SQL Server, the service account is the DBO of the created database for the sync engine. The service won't function as intended with any other permissions. A SQL Server login also is created.

The account is also granted permissions to files, registry keys, and other objects related to the sync engine.

<a name='azure-ad-connector-account'></a>

### Microsoft Entra Connector account

An account in Microsoft Entra ID is created for the sync service to use. You can identify this account by its display name.

:::image type="content" source="media/reference-connect-accounts-permissions/aadsyncserviceaccount2.png" alt-text="Screenshot that shows the Microsoft Entra account with the DC1 prefix.":::

The name of the server the account is used on can be identified in the second part of the username. In the preceding figure, the server name is DC1. If you have staging servers, each server has its own account.

A server account is created with a long, complex password that doesn't expire. The account is granted a special Directory Synchronization Accounts role that has permissions to perform only directory synchronization tasks. This special built-in role can't be granted outside of the Microsoft Entra Connect wizard. The [Microsoft Entra admin center](https://entra.microsoft.com) shows this account with the User role.

Microsoft Entra ID has a limit of 20 sync service accounts. To get the list of existing Microsoft Entra service accounts in your Microsoft Entra instance, run the following Azure AD PowerShell cmdlet: `Get-AzureADDirectoryRole | where {$_.DisplayName -eq "Directory Synchronization Accounts"} | Get-AzureADDirectoryRoleMember`

To remove unused Microsoft Entra service accounts, run the following Azure AD PowerShell cmdlet: `Remove-AzureADUser -ObjectId <ObjectId-of-the-account-you-wish-to-remove>`

> [!NOTE]
> Before you can use these PowerShell commands, you must install the [Azure Active Directory PowerShell for Graph module](/powershell/azure/active-directory/install-adv2#installing-the-azure-ad-module) and connect to your instance of Microsoft Entra ID by using [Connect-AzureAD](/powershell/module/azuread/connect-azuread).

For more information about how to manage or reset the password for the Microsoft Entra Connect account, see [Manage the Microsoft Entra Connect account](how-to-connect-azureadaccount.md).

## Related articles

For more information about Microsoft Entra Connect, see these articles:

|Topic |Link|  
| --- | --- |
|Download Microsoft Entra Connect | [Download Microsoft Entra Connect](https://go.microsoft.com/fwlink/?LinkId=615771)|
|Install by using express settings | [Express installation of Microsoft Entra Connect](how-to-connect-install-express.md)|
|Install by using customized settings | [Custom installation of Microsoft Entra Connect](./how-to-connect-install-custom.md)|
|Upgrade from DirSync | [Upgrade from Azure AD Sync tool (DirSync)](how-to-dirsync-upgrade-get-started.md)|
|After installation | [Verify the installation and assign licenses](how-to-connect-post-installation.md)|

## Next steps

Learn more about [integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).
