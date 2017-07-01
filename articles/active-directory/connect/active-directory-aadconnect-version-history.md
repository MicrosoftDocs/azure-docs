---
title: 'Azure AD Connect: Version release history | Microsoft Docs'
description: This article lists all releases of Azure AD Connect and Azure AD Sync
services: active-directory
documentationcenter: ''
author: billmath
manager: femila
editor: ''

ms.assetid: ef2797d7-d440-4a9a-a648-db32ad137494
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/08/2017
ms.author: billmath

---
# Azure AD Connect: Version release history
The Azure Active Directory (Azure AD) team regularly updates Azure AD Connect with new features and functionality. Not all additions are applicable to all audiences.

This article is designed to help you keep track of the versions that have been released, and to understand whether you need to update to the newest version or not.

This is a list of related topics:


Topic |  Details
--------- | --------- |
Steps to upgrade from Azure AD Connect | Different methods to [upgrade from a previous version to the latest](active-directory-aadconnect-upgrade-previous-version.md) Azure AD Connect release.
Required permissions | For permissions required to apply an update, see [accounts and permissions](./active-directory-aadconnect-accounts-permissions.md#upgrade).
Download| [Download Azure AD Connect](http://go.microsoft.com/fwlink/?LinkId=615771).

## 1.1.570.0
Status: Not yet released

>[!NOTE]
>This build is not available to customers through the Azure AD Connect Auto Upgrade feature.

### Azure AD Connect

#### Fixed issue
* Fixed an issue with the Initialize-ADSyncDomainJoinedComputerSync cmdlet that caused the verified domain configured on the existing service connection point object to be changed even if it is still a valid domain. This issue occurs when your Azure AD tenant has more than one verified domains that can be used for configuring the service connection point. For more information about service connection point object, refer to article [How to configure automatic registration of Windows domain-joined devices with Azure Active Directory](../active-directory-conditional-access-automatic-device-registration-setup.md).

#### New features and improvements
* Password writeback is now available for preview with Microsoft Azure Government cloud and Microsoft Cloud Germany. For more information about Azure AD Connect support for the different service instances, refer to article [Azure AD Connect: Special considerations for instances](active-directory-aadconnect-instances.md).

* The Initialize-ADSyncDomainJoinedComputerSync cmdlet now has a new optional parameter named AzureADDomain. This parameter lets you specify which verified domain to be used for configuring the service connection point. For more information about service connection point object, refer to article [How to configure automatic registration of Windows domain-joined devices with Azure Active Directory](../active-directory-conditional-access-automatic-device-registration-setup.md).


## 1.1.553.0
Status: June 2017

> [!IMPORTANT]
> There are schema and sync rule changes introduced in this build. Azure AD Connect Synchronization Service will trigger Full Import and Full Synchronization steps after upgrade. Details of the changes are described below. To temporarily defer Full Import and Full Synchronization steps after upgrade, refer to article [How to defer full synchronization after upgrade](active-directory-aadconnect-upgrade-previous-version.md#how-to-defer-full-synchronization-after-upgrade).
>
>

### Azure AD Connect Sync

#### Known issue
* There is an issue that affects customers who are using [OU-based filtering](active-directory-aadconnectsync-configure-filtering.md#organizational-unitbased-filtering) with Azure AD Connect sync. When you navigate to the [Domain and OU Filtering page](active-directory-aadconnect-get-started-custom.md#domain-and-ou-filtering) in the Azure AD Connect wizard, the following behavior is expected:
  * If OU-based filtering is enabled, the **Sync selected domains and OUs** option is selected.
  * Otherwise, the **Sync all domains and OUs** option is selected.

The issue that arises is that the **Sync all domains and OUs option** is always selected when you run the Wizard.  This occurs even if OU-based filtering was previously configured. Before saving any AAD Connect configuration changes, make sure the **Sync selected domains and OUs option is selected** and confirm that all OUs that need to synchronize are enabled again. Otherwise, OU-based filtering will be disabled.

#### Fixed issues

* Fixed an issue with Password writeback that allows an Azure AD Administrator to reset the password of an on-premises AD privileged user account. The issue occurs when Azure AD Connect is granted the Reset Password permission over the privileged account. The issue is addressed in this version of Azure AD Connect by not allowing an Azure AD Administrator to reset the password of an arbitrary on-premises AD privileged user account unless the administrator is the owner of that account. For more information, refer to [Security Advisory 4033453](https://technet.microsoft.com/library/security/4033453).

* Fixed an issue related to the [msDS-ConsistencyGuid as Source Anchor](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-design-concepts#using-msds-consistencyguid-as-sourceanchor) feature where Azure AD Connect does not writeback to on-premises AD msDS-ConsistencyGuid attribute. The issue occurs when there are multiple on-premises AD forests added to Azure AD Connect and the *User identities exist across multiple directories option* is selected. When such configuration is used, the resultant synchronization rules do not populate the sourceAnchorBinary attribute in the Metaverse. The sourceAnchorBinary attribute is used as the source attribute for msDS-ConsistencyGuid attribute. As a result, writeback to the ms-DSConsistencyGuid attribute does not occur. To fix the issue, following sync rules have been updated to ensure that the sourceAnchorBinary attribute in the Metaverse is always populated:
  * In from AD - InetOrgPerson AccountEnabled.xml
  * In from AD - InetOrgPerson Common.xml
  * In from AD - User AccountEnabled.xml
  * In from AD - User Common.xml
  * In from AD - User Join SOAInAAD.xml

* Previously, even if the [msDS-ConsistencyGuid as Source Anchor](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-design-concepts#using-msds-consistencyguid-as-sourceanchor) feature isn’t enabled, the “Out to AD – User ImmutableId” synchronization rule is still added to Azure AD Connect. The effect is benign and does not cause writeback of msDS-ConsistencyGuid attribute to occur. To avoid confusion, logic has been added to ensure that the sync rule is only added when the feature is enabled.

* Fixed an issue that caused password hash synchronization to fail with error event 611. This issue occurs after one or more domain controllers have been removed from on-premises AD. At the end of each password synchronization cycle, the synchronization cookie issued by on-premises AD contains Invocation IDs of the removed domain controllers with USN (Update Sequence Number) value of 0. The Password Synchronization Manager is unable to persist synchronization cookie containing USN value of 0 and fails with error event 611. During the next synchronization cycle, the Password Synchronization Manager reuses the last persisted synchronization cookie that does not contain USN value of 0. This causes the same password changes to be resynchronized. With this fix, the Password Synchronization Manager persists the synchronization cookie correctly.

* Previously, even if Automatic Upgrade has been disabled using the Set-ADSyncAutoUpgrade cmdlet, the Automatic Upgrade process continues to check for upgrade periodically, and relies on the downloaded installer to honor disablement. With this fix, the Automatic Upgrade process no longer checks for upgrade periodically. The fix is automatically applied when upgrade installer for this Azure AD Connect version is executed once.

#### New features and improvements

* Previously, the [msDS-ConsistencyGuid as Source Anchor](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-design-concepts#using-msds-consistencyguid-as-sourceanchor) feature was available to new deployments only. Now, it is available to existing deployments. More specifically:
  * To access the feature, start the Azure AD Connect wizard and choose the *Update Source Anchor* option.
  * This option is only visible to existing deployments that are using objectGuid as sourceAnchor attribute.
  * When configuring the option, the wizard validates the state of the msDS-ConsistencyGuid attribute in your on-premises Active Directory. If the attribute isn't configured on any user object in the directory, the wizard uses the msDS-ConsistencyGuid as the sourceAnchor attribute. If the attribute is configured on one or more user objects in the directory, the wizard concludes the attribute is being used by other applications and is not suitable as sourceAnchor attribute and does not permit the Source Anchor change to proceed. If you are certain that the attribute isn't used by existing applications, you need to contact Support for information on how to suppress the error.

* Specific to **userCertificate** attribute on Device objects, Azure AD Connect now looks for certificates values required for [Connecting domain-joined devices to Azure AD for Windows 10 experience](https://docs.microsoft.com/azure/active-directory/active-directory-azureadjoin-devices-group-policy) and filters out the rest before synchronizing to Azure AD. To enable this behavior, the out-of-box sync rule “Out to AAD - Device Join SOAInAD” has been updated.

* Azure AD Connect now supports writeback of Exchange Online **cloudPublicDelegates** attribute to on-premises AD **publicDelegates** attribute. This enables the scenario where an Exchange Online mailbox can be granted SendOnBehalfTo rights to users with on-premises Exchange mailbox. To support this feature, a new out-of-box sync rule “Out to AD – User Exchange Hybrid PublicDelegates writeback” has been added. This sync rule is only added to Azure AD Connect when Exchange Hybrid feature is enabled.

*	Azure AD Connect now supports synchronizing the **altRecipient** attribute from Azure AD. To support this change, following out-of-box sync rules have been updated to include the required attribute flow:
  * In from AD – User Exchange
  * Out to AAD – User ExchangeOnline
  
* The **cloudSOAExchMailbox** attribute in the Metaverse indicates whether a given user has Exchange Online mailbox or not. Its definition has been updated to include additional Exchange Online RecipientDisplayTypes as such Equipment and Conference Room mailboxes. To enable this change, the definition of the cloudSOAExchMailbox attribute, which is found under out-of-box sync rule “In from AAD – User Exchange Hybrid”, has been updated from:

```
CBool(IIF(IsNullOrEmpty([cloudMSExchRecipientDisplayType]),NULL,BitAnd([cloudMSExchRecipientDisplayType],&amp;HFF) = 0))
```

... to the following:

```
CBool(
  IIF(IsPresent([cloudMSExchRecipientDisplayType]),(
    IIF([cloudMSExchRecipientDisplayType]=0,True,(
      IIF([cloudMSExchRecipientDisplayType]=2,True,(
        IIF([cloudMSExchRecipientDisplayType]=7,True,(
          IIF([cloudMSExchRecipientDisplayType]=8,True,(
            IIF([cloudMSExchRecipientDisplayType]=10,True,(
              IIF([cloudMSExchRecipientDisplayType]=16,True,(
                IIF([cloudMSExchRecipientDisplayType]=17,True,(
                  IIF([cloudMSExchRecipientDisplayType]=18,True,(
                    IIF([cloudMSExchRecipientDisplayType]=1073741824,True,(
                       IF([cloudMSExchRecipientDisplayType]=1073741840,True,False)))))))))))))))))))),False))

```

* Added the following set of X509Certificate2-compatible functions for creating synchronization rule expressions to handle certificate values in the userCertificate attribute:

    ||||
    | --- | --- | --- |
    |CertSubject|CertIssuer|CertKeyAlgorithm|
    |CertSubjectNameDN|CertIssuerOid|CertNameInfo|
    |CertSubjectNameOid|CertIssuerDN|IsCert|
    |CertFriendlyName|CertThumbprint|CertExtensionOids|
    |CertFormat|CertNotAfter|CertPublicKeyOid|
    |CertSerialNumber|CertNotBefore|CertPublicKeyParametersOid|
    |CertVersion|CertSignatureAlgorithmOid|Select|
    |CertKeyAlgorithmParams|CertHashString|Where|
    |||With|

* Following schema changes have been introduced to allow customers to create custom synchronization rules to flow sAMAccountName, domainNetBios, and domainFQDN for Group objects, as well as distinguishedName for User objects:

  * Following attributes have been added to MV schema:
    * Group: AccountName
    * Group: domainNetBios
    * Group: domainFQDN
    * Person: distinguishedName

  * Following attributes have been added to Azure AD Connector schema:
    * Group: OnPremisesSamAccountName
    * Group: NetBiosName
    * Group: DnsDomainName
    * User: OnPremisesDistinguishedName

* The ADSyncDomainJoinedComputerSync cmdlet script now has a new optional parameter named AzureEnvironment. The parameter is used to specify which region the corresponding Azure Active Directory tenant is hosted in. Valid values include:
  * AzureCloud (default)
  * AzureChinaCloud
  * AzureGermanyCloud
  * USGovernment
 
* Updated Sync Rule Editor to use Join (instead of Provision) as the default value of link type during sync rule creation.

### AD FS management

#### Issues fixed

* Following URLs are new WS-Federation endpoints introduced by Azure AD to improve resiliency against authentication outage and will be added to on-premises AD FS replying party trust configuration:
  * https://ests.login.microsoftonline.com/login.srf
  * https://stamp2.login.microsoftonline.com/login.srf
  * https://ccs.login.microsoftonline.com/login.srf
  * https://ccs-sdf.login.microsoftonline.com/login.srf
  
* Fixed an issue that caused AD FS to generate incorrect claim value for IssuerID. The issue occurs if there are multiple verified domains in the Azure AD tenant and the domain suffix of the userPrincipalName attribute used to generate the IssuerID claim is at least 3-levels deep (for example, johndoe@us.contoso.com). The issue is resolved by updating the regex used by the claim rules.

#### New features and improvements
* Previously, the ADFS Certificate Management feature provided by Azure AD Connect can only be used with ADFS farms managed through Azure AD Connect. Now, you can use the feature with ADFS farms that are not managed using Azure AD Connect.

## 1.1.524.0
Released: May 2017

> [!IMPORTANT]
> There are schema and sync rule changes introduced in this build. Azure AD Connect Synchronization Service will trigger Full Import and Full Sync steps after upgrade. Details of the changes are described below.
>
>

**Fixed issues:**

Azure AD Connect sync

* Fixed an issue that causes Automatic Upgrade to occur on the Azure AD Connect server even if customer has disabled the feature using the Set-ADSyncAutoUpgrade cmdlet. With this fix, the Automatic Upgrade process on the server still checks for upgrade periodically, but the downloaded installer honors the Automatic Upgrade configuration.
* During DirSync in-place upgrade, Azure AD Connect creates an Azure AD service account to be used by the Azure AD connector for synchronizing with Azure AD. After the account is created, Azure AD Connect authenticates with Azure AD using the account. Sometimes, authentication fails because of transient issues, which in turn causes DirSync in-place upgrade to fail with error *“An error has occurred executing Configure AAD Sync task: AADSTS50034: To sign into this application, the account must be added to the xxx.onmicrosoft.com directory.”* To improve the resiliency of DirSync upgrade, Azure AD Connect now retries the authentication step.
* There was an issue with build 443 that causes DirSync in-place upgrade to succeed but run profiles required for directory synchronization are not created. Healing logic is included in this build of Azure AD Connect. When customer upgrades to this build, Azure AD Connect detects missing run profiles and creates them.
* Fixed an issue that causes Password Synchronization process to fail to start with Event ID 6900 and error *“An item with the same key has already been added”*. This issue occurs if you update OU filtering configuration to include AD configuration partition. To fix this issue, Password Synchronization process now synchronizes password changes from AD domain partitions only. Non-domain partitions such as configuration partition are skipped.
* During Express installation, Azure AD Connect creates an on-premises AD DS account to be used by the AD connector to communicate with on-premises AD. Previously, the account is created with the PASSWD_NOTREQD flag set on the user-Account-Control attribute and a random password is set on the account. Now, Azure AD Connect explicitly removes the PASSWD_NOTREQD flag after the password is set on the account.
* Fixed an issue that causes DirSync upgrade to fail with error *“a deadlock occurred in sql server which trying to acquire an application lock”* when the mailNickname attribute is found in the on-premises AD schema, but is not bounded to the AD User object class.
* Fixed an issue that causes Device writeback feature to automatically be disabled when an administrator is updating Azure AD Connect sync configuration using Azure AD Connect wizard. This is caused by the wizard performing pre-requisite check for the existing Device writeback configuration in on-premises AD and the check fails. The fix is to skip the check if Device writeback is already enabled previously.
* To configure OU filtering, you can either use the Azure AD Connect wizard or the Synchronization Service Manager. Previously, if you use the Azure AD Connect wizard to configure OU filtering, new OUs created afterwards are included for directory synchronization. If you do not want new OUs to be included, you must configure OU filtering using the Synchronization Service Manager. Now, you can achieve the same behavior using Azure AD Connect wizard.
* Fixed an issue that causes stored procedures required by Azure AD Connect to be created under the schema of the installing admin, instead of under the dbo schema.
* Fixed an issue that causes the TrackingId attribute returned by Azure AD to be omitted in the AAD Connect Server Event Logs. The issue occurs if Azure AD Connect receives a redirection message from Azure AD and Azure AD Connect is unable to connect to the endpoint provided. The TrackingId is used by Support Engineers to correlate with service side logs during troubleshooting.
* When Azure AD Connect receives LargeObject error from Azure AD, Azure AD Connect generates an event with EventID 6941 and message *“The provisioned object is too large. Trim the number of attribute values on this object.”* At the same time, Azure AD Connect also generates a misleading event with EventID 6900 and message *“Microsoft.Online.Coexistence.ProvisionRetryException: Unable to communicate with the Windows Azure Active Directory service.”* To minimize confusion, Azure AD Connect no longer generates the latter event when LargeObject error is received.
* Fixed an issue that causes the Synchronization Service Manager to become unresponsive when trying to update the configuration for Generic LDAP connector.

**New features/improvements:**

Azure AD Connect sync
* Sync Rule Changes – The following sync rule changes have been implemented:
  * Updated default sync rule set to not export attributes **userCertificate** and **userSMIMECertificate** if the attributes have more than 15 values.
  * AD attributes **employeeID** and **msExchBypassModerationLink** are now included in the default sync rule set.
  * AD attribute **photo** has been removed from default sync rule set.
  * Added **preferredDataLocation** to the Metaverse schema and AAD Connector schema. Customers who want to update either attributes in Azure AD can implement custom sync rules to do so. To find out more about the attribute, refer to article section [Azure AD Connect sync: How to make a change to the default configuration - Enable synchronization of PreferredDataLocation](active-directory-aadconnectsync-change-the-configuration.md#enable-synchronization-of-preferreddatalocation).
  * Added **userType** to the Metaverse schema and AAD Connector schema. Customers who want to update either attributes in Azure AD can implement custom sync rules to do so.

* Azure AD Connect now automatically enables the use of ConsistencyGuid attribute as the Source Anchor attribute for on-premises AD objects. Further, Azure AD Connect populates the ConsistencyGuid attribute with the objectGuid attribute value if it is empty. This feature is applicable to new deployment only. To find out more about this feature, refer to article section [Azure AD Connect: Design concepts - Using msDS-ConsistencyGuid as sourceAnchor](active-directory-aadconnect-design-concepts.md#using-msds-consistencyguid-as-sourceanchor).
* New troubleshooting cmdlet Invoke-ADSyncDiagnostics has been added to help diagnose Password Hash Synchronization related issues. For information about using the cmdlet, refer to article [Troubleshoot password synchronization with Azure AD Connect sync](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-troubleshoot-password-synchronization).
* Azure AD Connect now supports synchronizing Mail-Enabled Public Folder objects from on-premises AD to Azure AD. You can enable the feature using Azure AD Connect wizard under Optional Features. To find out more about this feature, refer to article [Office 365 Directory Based Edge Blocking support for on-premises Mail Enabled Public Folders](https://blogs.technet.microsoft.com/exchange/2017/05/19/office-365-directory-based-edge-blocking-support-for-on-premises-mail-enabled-public-folders).
* Azure AD Connect requires AD DS accounts to synchronize from on-premises AD. Previously, if you install Azure AD Connect using Express mode, you can provide the credential of an Enterprise Admin account. Azure AD Connect and leave it to Azure AD Connect to create the AD DS account required. However, for custom installation and adding forests to existing deployment, you must provide the AD DS account instead. Now, you also have the option to provide the credentials of an Enterprise Admin account during custom installation and let Azure AD Connect create the AD DS account required.
* Azure AD Connect now supports SQL AOA. You must enable SQL before installing Azure AD Connect. During installation, Azure AD Connect  detects whether the SQL instance provided is enabled for SQL AOA or not. If SQL AOA is enabled, Azure AD Connect further figures out if SQL AOA is configured to use synchronous replication or asynchronous replication. When setting up the Availability Group Listener, it is recommended that you set the RegisterAllProvidersIP property to 0. This is because Azure AD Connect currently uses SQL Native Client to connect to SQL and SQL Native Client does not support the use of MultiSubNetFailover property.
* If you are using LocalDB as the database for your Azure AD Connect server and has reached its 10-GB size limit, the Synchronization Service no longer starts. Previously, you need to perform ShrinkDatabase operation on the LocalDB to reclaim enough DB space for the Synchronization Service to start. After which, you can use the Synchronization Service Manager to delete run history to reclaim more DB space. Now, you can use Start-ADSyncPurgeRunHistory cmdlet to purge run history data from LocalDB to reclaim DB space. Further, this cmdlet supports an offline mode (by specifying the -offline parameter) which can be used when the Synchronization Service is not running. Note: The offline mode can only be used if the Synchronization Service is not running and the database used is LocalDB.
* To reduce the amount of storage space required, Azure AD Connect now compresses sync error details before storing them in LocalDB/SQL databases. When upgrading from an older version of Azure AD Connect to this version, Azure AD Connect performs a one-time compression on existing sync error details.
* Previously, after updating OU filtering configuration, you must manually run Full import to ensure existing objects are properly included/excluded from directory synchronization. Now, Azure AD Connect automatically triggers Full import during the next sync cycle. Further, Full import is only be applied to the AD connectors affected by the update. Note: this improvement is applicable to OU filtering updates made using the Azure AD Connect wizard only. It is not applicable to OU filtering update made using the Synchronization Service Manager.
* Previously, Group-based filtering supports Users, Groups, and Contact objects only. Now, Group-based filtering also supports Computer objects.
* Previously, you can delete Connector Space data without disabling Azure AD Connect sync scheduler. Now, the Synchronization Service Manager blocks the deletion of Connector Space data if it detects that the scheduler is enabled. Further, a warning is returned to inform customers about potential data loss if the Connector space data is deleted.
* Previously, you must disable PowerShell transcription for Azure AD Connect wizard to run correctly. This issue is partially resolved. You can enable PowerShell transcription if you are using Azure AD Connect wizard to manage sync configuration. You must disable PowerShell transcription if you are using Azure AD Connect wizard to manage ADFS configuration.



## 1.1.486.0
Released: April 2017

**Fixed issues:**
* Fixed the issue where Azure AD Connect will not install successfully on localized version of Windows Server.

## 1.1.484.0
Released: April 2017

**Known issues:**

* This version of Azure AD Connect will not install successfully if the following conditions are all true:
   1. You are performing either DirSync in-place upgrade or fresh installation of Azure AD Connect.
   2. You are using a localized version of Windows Server where the name of built-in Administrator group on the server isn't "Administrators".
   3. You are using the default SQL Server 2012 Express LocalDB installed with Azure AD Connect instead of providing your own full SQL.

**Fixed issues:**

Azure AD Connect sync
* Fixed an issue where the sync scheduler skips the entire sync step if one or more connectors are missing run profile for that sync step. For example, you manually added a connector using the Synchronization Service Manager without creating a Delta Import run profile for it. This fix ensures that the sync scheduler continues to run Delta Import for other connectors.
* Fixed an issue where the Synchronization Service immediately stops processing a run profile when it is encounters an issue with one of the run steps. This fix ensures that the Synchronization Service skips that run step and continues to process the rest. For example, you have a Delta Import run profile for your AD connector with multiple run steps (one for each on-premises AD domain). The Synchronization Service will run Delta Import with the other AD domains even if one of them has network connectivity issues.
* Fixed an issue that causes the Azure AD Connector update to be skipped during Automatic Upgrade.
* Fixed an issue that causes Azure AD Connect to incorrectly determine whether the server is a domain controller during setup, which in turn causes DirSync upgrade to fail.
* Fixed an issue that causes DirSync in-place upgrade to not create any run profile for the Azure AD Connector.
* Fixed an issue where the Synchronization Service Manager user interface becomes unresponsive when trying to configure Generic LDAP Connector.

AD FS management
* Fixed an issue where the Azure AD Connect wizard fails if the AD FS primary node has been moved to another server.

Desktop SSO
* Fixed an issue in the Azure AD Connect wizard where the Sign-In screen does not let you enable Desktop SSO feature if you chose Password Synchronization as your Sign-In option during new installation.

**New features/improvements:**

Azure AD Connect sync
* Azure AD Connect Sync now supports the use of Virtual Service Account, Managed Service Account and Group Managed Service Account as its service account. This applies to new installation of Azure AD Connect only. When installing Azure AD Connect:
    * By default, Azure AD Connect wizard will create a Virtual Service Account and uses it as its service account.
    * If you are installing on a domain controller, Azure AD Connect falls back to previous behavior where it will create a domain user account and uses it as its service account instead.
    * You can override the default behavior by providing one of the following:
      * A Group Managed Service Account
      * A Managed Service Account
      * A domain user account
      * A local user account
* Previously, if you upgrade to a new build of Azure AD Connect containing connectors update or sync rule changes, Azure AD Connect will trigger a full sync cycle. Now, Azure AD Connect selectively triggers Full Import step only for connectors with update, and Full Synchronization step only for connectors with sync rule changes.
* Previously, the Export Deletion Threshold only applies to exports which are triggered through the sync scheduler. Now, the feature is extended to include exports manually triggered by the customer using the Synchronization Service Manager.
* On your Azure AD tenant, there is a service configuration which indicates whether Password Synchronization feature is enabled for your tenant or not. Previously, it is easy for the service configuration to be incorrectly configured by Azure AD Connect when you have an active and a staging server. Now, Azure AD Connect will attempt to keep the service configuration consistent with your active Azure AD Connect server only.
* Azure AD Connect wizard now detects and returns a warning if on-premises AD does not have AD Recycle Bin enabled.
* Previously, Export to Azure AD times out and fails if the combined size of the objects in the batch exceeds certain threshold. Now, the Synchronization Service will reattempt to resend the objects in separate, smaller batches if the issue is encountered.
* The Synchronization Service Key Management application has been removed from Windows Start Menu. Management of encryption key will continue to be supported through command-line interface using miiskmu.exe. For information about managing encryption key, refer to article [Abandoning the Azure AD Connect Sync encryption key](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-change-serviceacct-pass#abandoning-the-azure-ad-connect-sync-encryption-key).
* Previously, if you change the Azure AD Connect sync service account password, the Synchronization Service will not be able start correctly until you have abandoned the encryption key and reinitialized the Azure AD Connect sync service account password. Now, this is no longer required.

Desktop SSO

* Azure AD Connect wizard no longer requires port 9090 to be opened on the network when configuring Pass-through Authentication and Desktop SSO. Only port 443 is required. 

## 1.1.443.0
Released: March 2017

**Fixed issues:**

Azure AD Connect sync
* Fixed an issue which causes Azure AD Connect wizard to fail if the display name of the Azure AD Connector does not contain the initial onmicrosoft.com domain assigned to the Azure AD tenant.
* Fixed an issue which causes Azure AD Connect wizard to fail while making connection to SQL database when the password of the Sync Service Account contains special characters such as apostrophe, colon and space.
* Fixed an issue which causes the error “The dimage has an anchor that is different than the image” to occur on an Azure AD Connect server in staging mode, after you have temporarily excluded an on-premises AD object from syncing and then included it again for syncing.
* Fixed an issue which causes the error “The object located by DN is a phantom” to occur on an Azure AD Connect server in staging mode, after you have temporarily excluded an on-premises AD object from syncing and then included it again for syncing.

AD FS management
* Fixed an issue where Azure AD Connect wizard does not update AD FS configuration and set the right claims on the relying party trust after Alternate Login ID is configured.
* Fixed an issue where Azure AD Connect wizard is unable to correctly handle AD FS servers whose service accounts are configured using userPrincipalName format instead of sAMAccountName format.

Pass-through Authentication
* Fixed an issue which causes Azure AD Connect wizard to fail if Pass Through Authentication is selected but registration of its connector fails.
* Fixed an issue which causes Azure AD Connect wizard to bypass validation checks on sign-in method selected when Desktop SSO feature is enabled.

Password Reset
* Fixed an issue which may cause the Azure AAD Connect server to not attempt to re-connect if the connection was killed by a firewall or proxy.

**New features/improvements:**

Azure AD Connect sync
* Get-ADSyncScheduler cmdlet now returns a new Boolean property named SyncCycleInProgress. If the returned value is true, it means that there is a scheduled synchronization cycle in progress.
* Destination folder for storing Azure AD Connect installation and setup logs has been moved from %localappdata%\AADConnect to %programdata%\AADConnect to improve accessibility to the log files.

AD FS management
* Added support for updating AD FS Farm SSL Certificate.
* Added support for managing AD FS 2016.
* You can now specify existing gMSA (Group Managed Service Account) during AD FS installation.
* You can now configure SHA-256 as the signature hash algorithm for Azure AD relying party trust.

Password Reset
* Introduced improvements to allow the product to function in environments with more stringent firewall rules.
* Improved connection reliability to Azure Service Bus.

## 1.1.380.0
Released: December 2016

**Fixed issue:**

* Fixed the issue where the issuerid claim rule for Active Directory Federation Services (AD FS) is missing in this build.

>[!NOTE]
>This build is not available to customers through the Azure AD Connect Auto Upgrade feature.

## 1.1.371.0
Released: December 2016

**Known issue:**

* The issuerid claim rule for AD FS is missing in this build. The issuerid claim rule is required if you are federating multiple domains with Azure Active Directory (Azure AD). If you are using Azure AD Connect to manage your on-premises AD FS deployment, upgrading to this build removes the existing issuerid claim rule from your AD FS configuration. You can work around the issue by adding the issuerid claim rule after the installation/upgrade. For details on adding the issuerid claim rule, refer to this article on [Multiple domain support for federating with Azure AD](active-directory-aadconnect-multiple-domains.md).

**Fixed issue:**

* If Port 9090 is not opened for the outbound connection, the Azure AD Connect installation or upgrade fails.

>[!NOTE]
>This build is not available to customers through the Azure AD Connect Auto Upgrade feature.

## 1.1.370.0
Released: December 2016

**Known issues:**

* The issuerid claim rule for AD FS is missing in this build. The issuerid claim rule is required if you are federating multiple domains with Azure AD. If you are using Azure AD Connect to manage your on-premises AD FS deployment, upgrading to this build removes the existing issuerid claim rule from your AD FS configuration. You can work around the issue by adding the issuerid claim rule after installation/upgrade. For details on adding issuerid claim rule, refer to this article on [Multiple domain support for federating with Azure AD](active-directory-aadconnect-multiple-domains.md).
* Port 9090 must be open outbound to complete installation.

**New features:**

* Pass-through Authentication (Preview).

>[!NOTE]
>This build is not available to customers through the Azure AD Connect Auto Upgrade feature.

## 1.1.343.0
Released: November 2016

**Known issue:**

* The issuerid claim rule for AD FS is missing in this build. The issuerid claim rule is required if you are federating multiple domains with Azure AD. If you are using Azure AD Connect to manage your on-premises AD FS deployment, upgrading to this build removes the existing issuerid claim rule from your AD FS configuration. You can work around the issue by adding the issuerid claim rule after installation/upgrade. For details on adding issuerid claim rule, refer to this article on [Multiple domain support for federating with Azure AD](active-directory-aadconnect-multiple-domains.md).

**Fixed issues:**

* Sometimes, installing Azure AD Connect fails because it is unable to create a local service account whose password meets the level of complexity specified by the organization's password policy.
* Fixed an issue where join rules are not reevaluated when an object in the connector space simultaneously becomes out-of-scope for one join rule and become in-scope for another. This can happen if you have two or more join rules whose join conditions are mutually exclusive.
* Fixed an issue where inbound synchronization rules (from Azure AD), which do not contain join rules, are not processed if they have lower precedence values than those containing join rules.

**Improvements:**

* Added support for installing Azure AD Connect on Windows Server 2016 Standard or higher.
* Added support for using SQL Server 2016 as the remote database for Azure AD Connect.

## 1.1.281.0
Released: August 2016

**Fixed issues:**

* Changes to sync interval do not take place until after the next sync cycle is complete.
* Azure AD Connect wizard does not accept an Azure AD account whose username starts with an underscore (\_).
* Azure AD Connect wizard fails to authenticate the Azure AD account if the account password contains too many special characters. Error message "Unable to validate credentials. An unexpected error has occurred." is returned.
* Uninstalling staging server disables password synchronization in Azure AD tenant and causes password synchronization to fail with active server.
* Password synchronization fails in uncommon cases when there is no password hash stored on the user.
* When Azure AD Connect server is enabled for staging mode, password writeback is not temporarily disabled.
* Azure AD Connect wizard does not show the actual password synchronization and password writeback configuration when server is in staging mode. It always shows them as disabled.
* Configuration changes to password synchronization and password writeback are not persisted by Azure AD Connect wizard when server is in staging mode.

**Improvements:**

* Updated the Start-ADSyncSyncCycle cmdlet to indicate whether it is able to successfully start a new sync cycle or not.
* Added the Stop-ADSyncSyncCycle cmdlet to terminate sync cycle and operation, which are currently in progress.
* Updated the Stop-ADSyncScheduler cmdlet to terminate sync cycle and operation, which are currently in progress.
* When configuring [Directory extensions](active-directory-aadconnectsync-feature-directory-extensions.md) in Azure AD Connect wizard, the Azure AD attribute of type "Teletex string" can now be selected.

## 1.1.189.0
Released: June 2016

**Fixed issues and improvements:**

* Azure AD Connect can now be installed on a FIPS-compliant server.
  * For password synchronization, see [Password sync and FIPS](active-directory-aadconnectsync-implement-password-synchronization.md#password-synchronization-and-fips).
* Fixed an issue where a NetBIOS name could not be resolved to the FQDN in the Active Directory Connector.

## 1.1.180.0
Released: May 2016

**New features:**

* Warns and helps you verify domains if you didn’t do it before running Azure AD Connect.
* Added support for [Microsoft Cloud Germany](active-directory-aadconnect-instances.md#microsoft-cloud-germany).
* Added support for the latest [Microsoft Azure Government cloud](active-directory-aadconnect-instances.md#microsoft-azure-government-cloud) infrastructure with new URL requirements.

**Fixed issues and improvements:**

* Added filtering to the Sync Rule Editor to make it easy to find sync rules.
* Improved performance when deleting a connector space.
* Fixed an issue when the same object was both deleted and added in the same run (called delete/add).
* A disabled sync rule no longer re-enables included objects and attributes on upgrade or directory schema refresh.

## 1.1.130.0
Released: April 2016

**New features:**

* Added support for multi-valued attributes to [Directory extensions](active-directory-aadconnectsync-feature-directory-extensions.md).
* Added support for more configuration variations for [automatic upgrade](active-directory-aadconnect-feature-automatic-upgrade.md) to be considered eligible for upgrade.
* Added some cmdlets for [custom scheduler](active-directory-aadconnectsync-feature-scheduler.md#custom-scheduler).

## 1.1.119.0
Released: March 2016

**Fixed issues:**

* Made sure Express installation cannot be used on Windows Server 2008 (pre-R2) because password sync is not supported on this operating system.
* Upgrade from DirSync with a custom filter configuration did not work as expected.
* When upgrading to a newer release and there are no changes to the configuration, a full import/synchronization should not be scheduled.

## 1.1.110.0
Released: February 2016

**Fixed issues:**

* Upgrade from earlier releases does not work if the installation is not in the default C:\Program Files folder.
* If you install and clear **Start the synchronization process** at the end of the installation wizard, running the installation wizard a second time will not enable the scheduler.
* The scheduler doesn't work as expected on servers where the US-en date/time format is not used. It will also block `Get-ADSyncScheduler` to return correct times.
* If you installed an earlier release of Azure AD Connect with AD FS as the sign-in option and upgrade, you cannot run the installation wizard again.

## 1.1.105.0
Released: February 2016

**New features:**

* [Automatic upgrade](active-directory-aadconnect-feature-automatic-upgrade.md) feature for Express settings customers.
* Support for the global admin by using Azure Multi-Factor Authentication and Privileged Identity Management in the installation wizard.
  * You need to allow your proxy to also allow traffic to https://secure.aadcdn.microsoftonline-p.com if you use Multi-Factor Authentication.
  * You need to add https://secure.aadcdn.microsoftonline-p.com to your trusted sites list for Multi-Factor Authentication to properly work.
* Allow changing the user's sign-in method after initial installation.
* Allow [Domain and OU filtering](active-directory-aadconnect-get-started-custom.md#domain-and-ou-filtering) in the installation wizard. This also allows connecting to forests where not all domains are available.
* [Scheduler](active-directory-aadconnectsync-feature-scheduler.md) is built in to the sync engine.

**Features promoted from preview to GA:**

* [Device writeback](active-directory-aadconnect-feature-device-writeback.md).
* [Directory extensions](active-directory-aadconnectsync-feature-directory-extensions.md).

**New preview features:**

* The new default sync cycle interval is 30 minutes. Used to be three hours for all earlier releases. Adds support to change the [scheduler](active-directory-aadconnectsync-feature-scheduler.md) behavior.

**Fixed issues:**

* The verify DNS domains page didn't always recognize the domains.
* Prompts for domain admin credentials when configuring AD FS.
* The on-premises AD accounts are not recognized by the installation wizard if located in a domain with a different DNS tree than the root domain.

## 1.0.9131.0
Released: December 2015

**Fixed issues:**

* Password sync might not work when you change passwords in Active Directory Domain Services (AD DS), but works when you do set a password.
* When you have a proxy server, authentication to Azure AD might fail during installation, or if an upgrade is canceled on the configuration page.
* Updating from a previous release of Azure AD Connect with a full SQL Server instance fails if you are not a SQL Server system administrator (SA).
* Updating from a previous release of Azure AD Connect with a remote SQL Server shows the “Unable to access the ADSync SQL database” error.

## 1.0.9125.0
Released: November 2015

**New features:**

* Can reconfigure AD FS to Azure AD trust.
* Can refresh the Active Directory schema and regenerate sync rules.
* Can disable a sync rule.
* Can define "AuthoritativeNull" as a new literal in a sync rule.

**New preview features:**

* [Azure AD Connect Health for sync](../connect-health/active-directory-aadconnect-health-sync.md).
* Support for [Azure AD Domain Services](../active-directory-passwords-update-your-own-password.md) password synchronization.

**New supported scenario:**

* Supports multiple on-premises Exchange organizations. For more information, see [Hybrid deployments with multiple Active Directory forests](https://technet.microsoft.com/library/jj873754.aspx).

**Fixed issues:**

* Password synchronization issues:
  * An object moved from out-of-scope to in-scope will not have its password synchronized. This includes both OU and attribute filtering.
  * Selecting a new OU to include in sync does not require a full password sync.
  * When a disabled user is enabled the password does not sync.
  * The password retry queue is infinite and the previous limit of 5,000 objects to be retired has been removed.
* Not able to connect to Active Directory with Windows Server 2016 forest-functional level.
* Not able to change the group that is used for group filtering after the initial installation.
* No longer creates a new user profile on the Azure AD Connect server for every user doing a password change with password writeback enabled.
* Not able to use Long Integer values in sync rules scopes.
* The check box "device writeback" remains disabled if there are unreachable domain controllers.

## 1.0.8667.0
Released: August 2015

**New features:**

* The Azure AD Connect installation wizard is now localized to all Windows Server languages.
* Added support for account unlock when using Azure AD password management.

**Fixed issues:**

* Azure AD Connect installation wizard crashes if another user continues installation rather than the person who first started the installation.
* If a previous uninstallation of Azure AD Connect fails to uninstall Azure AD Connect sync cleanly, it is not possible to reinstall.
* Cannot install Azure AD Connect using Express installation if the user is not in the root domain of the forest or if a non-English version of Active Directory is used.
* If the FQDN of the Active Directory user account cannot be resolved, a misleading error message “Failed to commit the schema” is shown.
* If the account used on the Active Directory Connector is changed outside the wizard, the wizard fails on subsequent runs.
* Azure AD Connect sometimes fails to install on a domain controller.
* Cannot enable and disable “Staging mode” if extension attributes have been added.
* Password writeback fails in some configurations because of a bad password on the Active Directory Connector.
* DirSync cannot be upgraded if a distinguished name (DN) is used in attribute filtering.
* Excessive CPU usage when using password reset.

**Removed preview features:**

* The preview feature [User writeback](active-directory-aadconnect-feature-preview.md#user-writeback) was temporarily removed based on feedback from our preview customers. It will be added again later after we have addressed the provided feedback.

## 1.0.8641.0
Released: June 2015

**Initial release of Azure AD Connect.**

Changed name from Azure AD Sync to Azure AD Connect.

**New features:**

* [Express settings](active-directory-aadconnect-get-started-express.md) installation
* Can [configure AD FS](active-directory-aadconnect-get-started-custom.md#configuring-federation-with-ad-fs)
* Can [upgrade from DirSync](active-directory-aadconnect-dirsync-upgrade-get-started.md)
* [Prevent accidental deletes](active-directory-aadconnectsync-feature-prevent-accidental-deletes.md)
* Introduced [staging mode](active-directory-aadconnectsync-operations.md#staging-mode)

**New preview features:**

* [User writeback](active-directory-aadconnect-feature-preview.md#user-writeback)
* [Group writeback](active-directory-aadconnect-feature-preview.md#group-writeback)
* [Device writeback](active-directory-aadconnect-feature-device-writeback.md)
* [Directory extensions](active-directory-aadconnect-feature-preview.md)

## 1.0.494.0501
Released: May 2015

**New Requirement:**

* Azure AD Sync now requires the .NET Framework version 4.5.1 to be installed.

**Fixed issues:**

* Password writeback from Azure AD is failing with an Azure Service Bus connectivity error.

## 1.0.491.0413
Released: April 2015

**Fixed issues and improvements:**

* The Active Directory Connector does not process deletes correctly if the recycle bin is enabled and there are multiple domains in the forest.
* The performance of import operations has been improved for the Azure Active Directory Connector.
* When a group has exceeded the membership limit (by default, the limit is set to 50,000 objects), the group was deleted in Azure Active Directory. With the new behavior, the group is not deleted, an error is thrown, and new membership changes are not exported.
* A new object cannot be provisioned if a staged delete with the same DN is already present in the connector space.
* Some objects are marked for synchronization during a delta sync even though there's no change staged on the object.
* Forcing a password sync also removes the preferred DC list.
* CSExportAnalyzer has problems with some objects states.

**New features:**

* A join can now connect to “ANY” object type in the MV.

## 1.0.485.0222
Released: February 2015

**Improvements:**

* Improved import performance.

**Fixed issues:**

* Password Sync honors the cloudFiltered attribute that is used by attribute filtering. Filtered objects are no longer in scope for password synchronization.
* In rare situations where the topology had many domain controllers, password sync doesn’t work.
* “Stopped-server” when importing from the Azure AD Connector after device management has been enabled in Azure AD/Intune.
* Joining Foreign Security Principals (FSPs) from multiple domains in same forest causes an ambiguous-join error.

## 1.0.475.1202
Released: December 2014

**New features:**

* Password synchronization with attribute-based filtering is now supported. For more information, see [Password synchronization with filtering](active-directory-aadconnectsync-configure-filtering.md).
* The msDS-ExternalDirectoryObjectID attribute is written back to Active Directory. This feature adds support for Office 365 applications. It uses OAuth2 to access Online and On-Premises mailboxes in a Hybrid Exchange Deployment.

**Fixed upgrade issues:**

* A newer version of the sign-in assistant is available on the server.
* A custom installation path was used to install Azure AD Sync.
* An invalid custom join criterion blocks the upgrade.

**Other fixes:**

* Fixed the templates for Office Pro Plus.
* Fixed installation issues caused by user names that start with a dash.
* Fixed losing the sourceAnchor setting when running the installation wizard a second time.
* Fixed ETW tracing for password synchronization.

## 1.0.470.1023
Released: October 2014

**New features:**

* Password synchronization from multiple on-premises Active Directory to Azure AD.
* Localized installation UI to all Windows Server languages.

**Upgrading from AADSync 1.0 GA**

If you already have Azure AD Sync installed, there is one additional step you have to take in case you have changed any of the out-of-box synchronization rules. After you have upgraded to the 1.0.470.1023 release, the synchronization rules you have modified are duplicated. For each modified sync rule, do the following:

1.  Locate the sync rule you have modified and take a note of the changes.
* Delete the sync rule.
* Locate the new sync rule that is created by Azure AD Sync and then reapply the changes.

**Permissions for the Active Directory account**

The Active Directory account must be granted additional permissions to be able to read the password hashes from Active Directory. The permissions to grant are named “Replicating Directory Changes” and “Replicating Directory Changes All.” Both permissions are required to be able to read the password hashes.

## 1.0.419.0911
Released: September 2014

**Initial release of Azure AD Sync.**

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
