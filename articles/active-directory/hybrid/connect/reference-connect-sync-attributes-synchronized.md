---
title: 'Attributes synchronized by Microsoft Entra Connect'
description: Lists the attributes that are synchronized to Microsoft Entra ID.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.assetid: c2bb36e0-5205-454c-b9b6-f4990bcedf51
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: reference
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra Connect Sync: Attributes synchronized to Microsoft Entra ID
This topic lists the attributes that are synchronized by Microsoft Entra Connect Sync.  
The attributes are grouped by the related Microsoft Entra app.

## Attributes to synchronize
A common question is *what is the list of minimum attributes to synchronize*. The default and recommended approach is to keep the default attributes so a full GAL (Global Address List) can be constructed in the cloud and to get all features in Microsoft 365 workloads. In some cases, there are some attributes that your organization does not want synchronized to the cloud since these attributes contain sensitive personal data, like in this example:  
![bad attributes](./media/reference-connect-sync-attributes-synchronized/badextensionattribute.png)

In this case, start with the list of attributes in this topic and identify those attributes that would contain personal data and cannot be synchronized. Then deselect those attributes during installation using [Microsoft Entra app and attribute filtering](how-to-connect-install-custom.md#azure-ad-app-and-attribute-filtering).

> [!WARNING]
> When deselecting attributes, you should be cautious and only deselect those attributes absolutely not possible to synchronize. Unselecting other attributes might have a negative impact on features.
>
>

## Microsoft 365 Apps for enterprise
| Attribute Name | User | Comment |
| --- |:---:| --- |
| accountEnabled |X |Defines if an account is enabled. |
| cn |X | |
| displayName |X | |
| objectSID |X |mechanical property. AD user identifier used to maintain sync between Microsoft Entra ID and AD. |
| pwdLastSet |X |mechanical property. Used to know when to invalidate already issued tokens. Used by both password hash sync, pass-through authentication and federation. |
|samAccountName|X| |
| sourceAnchor |X |mechanical property. Immutable identifier to maintain relationship between ADDS and Microsoft Entra ID. |
| usageLocation |X |mechanical property. The user’s country/region. Used for license assignment. |
| userPrincipalName |X |UPN is the login ID for the user. Most often the same as [mail] value. |

## Exchange Online
| Attribute Name | User | Contact | Group | Comment |
| --- |:---:|:---:|:---:| --- |
| accountEnabled |X | | |Defines if an account is enabled. |
| altRecipient |X | | |Requires Microsoft Entra Connect build 1.1.552.0 or after. |
| authOrig |X |X |X | |
| c |X |X | | |
| cn |X | |X | |
| co |X |X | | |
| company |X |X | | |
| countryCode |X |X | | |
| department |X |X | | |
| description | | |X | |
| displayName |X |X |X | |
| dLMemRejectPerms |X |X |X | |
| dLMemSubmitPerms |X |X |X | |
| extensionAttribute1 |X |X |X | |
| extensionAttribute10 |X |X |X | |
| extensionAttribute11 |X |X |X | |
| extensionAttribute12 |X |X |X | |
| extensionAttribute13 |X |X |X | |
| extensionAttribute14 |X |X |X | |
| extensionAttribute15 |X |X |X | |
| extensionAttribute2 |X |X |X | |
| extensionAttribute3 |X |X |X | |
| extensionAttribute4 |X |X |X | |
| extensionAttribute5 |X |X |X | |
| extensionAttribute6 |X |X |X | |
| extensionAttribute7 |X |X |X | |
| extensionAttribute8 |X |X |X | |
| extensionAttribute9 |X |X |X | |
| facsimiletelephonenumber |X |X | | |
| givenName |X |X | | |
| homePhone |X |X | | |
| info |X |X |X |This attribute is currently not consumed for groups. |
| Initials |X |X | | |
| l |X |X | | |
| legacyExchangeDN |X |X |X | |
| mailNickname |X |X |X | |
| managedBy | | |X | |
| manager |X |X | | |
| member | | |X | |
| mobile |X |X | | |
| msDS-HABSeniorityIndex |X |X |X | |
| msDS-PhoneticDisplayName |X |X |X | |
| msExchArchiveGUID |X | | | |
| msExchArchiveName |X | | | |
| msExchAssistantName |X |X | | |
| msExchAuditAdmin |X | | | |
| msExchAuditDelegate |X | | | |
| msExchAuditDelegateAdmin |X | | | |
| msExchAuditOwner |X | | | |
| msExchBlockedSendersHash |X |X | | |
| msExchBypassAudit |X | | | |
| msExchBypassModerationLink | | |X |Available in Microsoft Entra Connect version 1.1.524.0 |
| msExchCoManagedByLink | | |X | |
| msExchDelegateListLink |X | | | |
| msExchELCExpirySuspensionEnd |X | | | |
| msExchELCExpirySuspensionStart |X | | | |
| msExchELCMailboxFlags |X | | | |
| msExchEnableModeration |X | |X | |
| msExchExtensionCustomAttribute1 |X |X |X |This attribute is currently not consumed by Exchange Online. |
| msExchExtensionCustomAttribute2 |X |X |X |This attribute is currently not consumed by Exchange Online. |
| msExchExtensionCustomAttribute3 |X |X |X |This attribute is currently not consumed by Exchange Online. |
| msExchExtensionCustomAttribute4 |X |X |X |This attribute is currently not consumed by Exchange Online. |
| msExchExtensionCustomAttribute5 |X |X |X |This attribute is currently not consumed by Exchange Online. |
| msExchHideFromAddressLists |X |X |X | |
| msExchImmutableID |X | | | |
| msExchLitigationHoldDate |X |X |X | |
| msExchLitigationHoldOwner |X |X |X | |
| msExchMailboxAuditEnable |X | | | |
| msExchMailboxAuditLogAgeLimit |X | | | |
| msExchMailboxGuid |X | | | |
| msExchModeratedByLink |X |X |X | |
| msExchModerationFlags |X |X |X | |
| msExchRecipientDisplayType |X |X |X | |
| msExchRecipientTypeDetails |X |X |X | |
| msExchRemoteRecipientType |X | | | |
| msExchRequireAuthToSendTo |X |X |X | |
| msExchResourceCapacity |X| | |This attribute is currently not consumed by Exchange Online. |
| msExchResourceDisplay |X | | | |
| msExchResourceMetaData |X | | | |
| msExchResourceSearchProperties |X | | | |
| msExchRetentionComment |X |X |X | |
| msExchRetentionURL |X |X |X | |
| msExchSafeRecipientsHash |X |X | | |
| msExchSafeSendersHash |X |X | | |
| msExchSenderHintTranslations |X |X |X | |
| msExchTeamMailboxExpiration |X | | | |
| msExchTeamMailboxOwners |X | | | |
| msExchTeamMailboxSharePointUrl |X | | | |
| msExchUserHoldPolicies |X | | | |
| msOrg-IsOrganizational | | |X | |
| objectSID |X | |X |mechanical property. AD user identifier used to maintain sync between Microsoft Entra ID and AD. |
| oOFReplyToOriginator | | |X | |
| otherFacsimileTelephone |X |X | | |
| otherHomePhone |X |X | | |
| otherTelephone |X |X | | |
| pager |X |X | | |
| physicalDeliveryOfficeName |X |X | | |
| postalCode |X |X | | |
| proxyAddresses |X |X |X | |
| publicDelegates |X |X |X | |
| pwdLastSet |X | | |mechanical property. Used to know when to invalidate already issued tokens. Used by both password sync and federation. |
| reportToOriginator | | |X | |
| reportToOwner | | |X | |
| securityEnabled | | |X | |
| sn |X |X | | |
| sourceAnchor |X |X |X |mechanical property. Immutable identifier to maintain relationship between ADDS and Microsoft Entra ID. |
| st |X |X | | |
| streetAddress |X |X | | |
| targetAddress |X |X | | |
| telephoneAssistant |X |X | | |
| telephoneNumber |X |X | | |
| thumbnailphoto |X |X | |Synced to M365 profile photo periodically. Admins can set the frequency of the sync by changing the Microsoft Entra Connect value. Please note that if users change their photo both on-premises and in cloud in a time span that is less than the Microsoft Entra Connect value, we do not guarantee that the latest photo will be served.|
| title |X |X | | |
| unauthOrig |X |X |X | |
| usageLocation |X | | |mechanical property. The user’s country/region. Used for license assignment. |
| userCertificate |X |X | | |
| userPrincipalName |X | | |UPN is the login ID for the user. Most often the same as [mail] value. |
| userSMIMECertificates |X |X | | |
| wWWHomePage |X |X | | |

## SharePoint Online
| Attribute Name | User | Contact | Group | Comment |
| --- |:---:|:---:|:---:| --- |
| accountEnabled |X | | |Defines if an account is enabled. |
| authOrig |X |X |X | |
| c |X |X | | |
| cn |X | |X | |
| co |X |X | | |
| company |X |X | | |
| countryCode |X |X | | |
| department |X |X | | |
| description |X |X |X | |
| displayName |X |X |X | |
| dLMemRejectPerms |X |X |X | |
| dLMemSubmitPerms |X |X |X | |
| extensionAttribute1 |X |X |X | |
| extensionAttribute10 |X |X |X | |
| extensionAttribute11 |X |X |X | |
| extensionAttribute12 |X |X |X | |
| extensionAttribute13 |X |X |X | |
| extensionAttribute14 |X |X |X | |
| extensionAttribute15 |X |X |X | |
| extensionAttribute2 |X |X |X | |
| extensionAttribute3 |X |X |X | |
| extensionAttribute4 |X |X |X | |
| extensionAttribute5 |X |X |X | |
| extensionAttribute6 |X |X |X | |
| extensionAttribute7 |X |X |X | |
| extensionAttribute8 |X |X |X | |
| extensionAttribute9 |X |X |X | |
| facsimiletelephonenumber |X |X | | |
| givenName |X |X | | |
| hideDLMembership | | |X | |
| homephone |X |X | | |
| info |X |X |X | |
| initials |X |X | | |
| ipPhone |X |X | | |
| l |X |X | | |
| mail |X |X |X | |
| mailnickname |X |X |X | |
| managedBy | | |X | |
| manager |X |X | | |
| member | | |X | |
| middleName |X |X | | |
| mobile |X |X | | |
| msExchTeamMailboxExpiration |X | | | |
| msExchTeamMailboxOwners |X | | | |
| msExchTeamMailboxSharePointLinkedBy |X | | | |
| msExchTeamMailboxSharePointUrl |X | | | |
| objectSID |X | |X |mechanical property. AD user identifier used to maintain sync between Microsoft Entra ID and AD. |
| oOFReplyToOriginator | | |X | |
| otherFacsimileTelephone |X |X | | |
| otherHomePhone |X |X | | |
| otherIpPhone |X |X | | |
| otherMobile |X |X | | |
| otherPager |X |X | | |
| otherTelephone |X |X | | |
| pager |X |X | | |
| physicalDeliveryOfficeName |X |X | | |
| postalCode |X |X | | |
| postOfficeBox |X |X | |This attribute is currently not consumed by SharePoint Online. |
| preferredLanguage |X | | | |
| proxyAddresses |X |X |X | |
| pwdLastSet |X | | |mechanical property. Used to know when to invalidate already issued tokens. Used by both password hash sync, pass-through authentication and federation. |
| reportToOriginator | | |X | |
| reportToOwner | | |X | |
| securityEnabled | | |X | |
| sn |X |X | | |
| sourceAnchor |X |X |X |mechanical property. Immutable identifier to maintain relationship between ADDS and Microsoft Entra ID. |
| st |X |X | | |
| streetAddress |X |X | | |
| targetAddress |X |X | | |
| telephoneAssistant |X |X | | |
| telephoneNumber |X |X | | |
| thumbnailphoto |X |X | |Synced to M365 profile photo periodically. Admins can set the frequency of the sync by changing the Microsoft Entra Connect value. Please note that if users change their photo both on-premises and in cloud in a time span that is less than the Microsoft Entra Connect value, we do not guarantee that the latest photo will be served.|
| title |X |X | | |
| unauthOrig |X |X |X | |
| url |X |X | | |
| usageLocation |X | | |mechanical property. The user’s country/region
. Used for license assignment. |
| userPrincipalName |X | | |UPN is the login ID for the user. Most often the same as [mail] value. |
| wWWHomePage |X |X | | |

## Teams and Skype for Business Online
| Attribute Name | User | Contact | Group | Comment |
| --- |:---:|:---:|:---:| --- |
| accountEnabled |X | | |Defines if an account is enabled. |
| c |X |X | | |
| cn |X | |X | |
| co |X |X | | |
| company |X |X | | |
| department |X |X | | |
| description |X |X |X | |
| displayName |X |X |X | |
| facsimiletelephonenumber |X |X |X | |
| givenName |X |X | | |
| homephone |X |X | | |
| ipPhone |X |X | | |
| l |X |X | | |
| mail |X |X |X | |
| mailNickname |X |X |X | |
| managedBy | | |X | |
| manager |X |X | | |
| member | | |X | |
| mobile |X |X | | |
| msExchHideFromAddressLists |X |X |X | |
| msRTCSIP-ApplicationOptions |X | | | |
| msRTCSIP-DeploymentLocator |X |X | | |
| msRTCSIP-Line |X |X | | |
| msRTCSIP-OptionFlags |X |X | | |
| msRTCSIP-OwnerUrn |X | | | |
| msRTCSIP-PrimaryUserAddress |X |X | | |
| msRTCSIP-UserEnabled |X |X | | |
| objectSID |X | |X |mechanical property. AD user identifier used to maintain sync between Microsoft Entra ID and AD. |
| otherTelephone |X |X | | |
| physicalDeliveryOfficeName |X |X | | |
| postalCode |X |X | | |
| preferredLanguage |X | | | |
| proxyAddresses |X |X |X | |
| pwdLastSet |X | | |mechanical property. Used to know when to invalidate already issued tokens. Used by both password hash sync, pass-through authentication and federation. |
| securityEnabled | | |X | |
| sn |X |X | | |
| sourceAnchor |X |X |X |mechanical property. Immutable identifier to maintain relationship between ADDS and Microsoft Entra ID. |
| st |X |X | | |
| streetAddress |X |X | | |
| telephoneNumber |X |X | | |
| thumbnailphoto |X |X | |Synced to M365 profile photo periodically. Admins can set the frequency of the sync by changing the Microsoft Entra Connect value. Please note that if users change their photo both on-premises and in cloud in a time span that is less than the Microsoft Entra Connect value, we do not guarantee that the latest photo will be served.|
| title |X |X | | |
| usageLocation |X | | |mechanical property. The user’s country/region. Used for license assignment. |
| userPrincipalName |X | | |UPN is the login ID for the user. Most often the same as [mail] value. |
| wWWHomePage |X |X | | |

## Azure RMS
| Attribute Name | User | Contact | Group | Comment |
| --- |:---:|:---:|:---:| --- |
| accountEnabled |X | | |Defines if an account is enabled. |
| cn |X | |X |Common name or alias. Most often the prefix of [mail] value. |
| displayName |X |X |X |A string that represents the name often shown as the friendly name (first name last name). |
| mail |X |X |X |full email address. |
| member | | |X | |
| objectSID |X | |X |mechanical property. AD user identifier used to maintain sync between Microsoft Entra ID and AD. |
| proxyAddresses |X |X |X |mechanical property. Used by Microsoft Entra ID. Contains all secondary email addresses for the user. |
| pwdLastSet |X | | |mechanical property. Used to know when to invalidate already issued tokens. |
| securityEnabled | | |X | |
| sourceAnchor |X |X |X |mechanical property. Immutable identifier to maintain relationship between ADDS and Microsoft Entra ID. |
| usageLocation |X | | |mechanical property. The user’s country/region. Used for license assignment. |
| userPrincipalName |X | | |This UPN is the login ID for the user. Most often the same as [mail] value. |

## Intune
| Attribute Name | User | Contact | Group | Comment |
| --- |:---:|:---:|:---:| --- |
| accountEnabled |X | | |Defines if an account is enabled. |
| c |X |X | | |
| cn |X | |X | |
| description |X |X |X | |
| displayName |X |X |X | |
| mail |X |X |X | |
| mailnickname |X |X |X | |
| member | | |X | |
| objectSID |X | |X |mechanical property. AD user identifier used to maintain sync between Microsoft Entra ID and AD. |
| proxyAddresses |X |X |X | |
| pwdLastSet |X | | |mechanical property. Used to know when to invalidate already issued tokens. Used by both password hash sync, pass-through authentication and federation. |
| securityEnabled | | |X | |
| sourceAnchor |X |X |X |mechanical property. Immutable identifier to maintain relationship between ADDS and Microsoft Entra ID. |
| usageLocation |X | | |mechanical property. The user’s country/region. Used for license assignment. |
| userPrincipalName |X | | |UPN is the login ID for the user. Most often the same as [mail] value. |

## Dynamics CRM
| Attribute Name | User | Contact | Group | Comment |
| --- |:---:|:---:|:---:| --- |
| accountEnabled |X | | |Defines if an account is enabled. |
| c |X |X | | |
| cn |X | |X | |
| co |X |X | | |
| company |X |X | | |
| countryCode |X |X | | |
| description |X |X |X | |
| displayName |X |X |X | |
| facsimiletelephonenumber |X |X | | |
| givenName |X |X | | |
| l |X |X | | |
| managedBy | | |X | |
| manager |X |X | | |
| member | | |X | |
| mobile |X |X | | |
| objectSID |X | |X |mechanical property. AD user identifier used to maintain sync between Microsoft Entra ID and AD. |
| physicalDeliveryOfficeName |X |X | | |
| postalCode |X |X | | |
| preferredLanguage |X | | | |
| pwdLastSet |X | | |mechanical property. Used to know when to invalidate already issued tokens. Used by both password hash sync, pass-through authentication and federation. |
| securityEnabled | | |X | |
| sn |X |X | | |
| sourceAnchor |X |X |X |mechanical property. Immutable identifier to maintain relationship between ADDS and Microsoft Entra ID. |
| st |X |X | | |
| streetAddress |X |X | | |
| telephoneNumber |X |X | | |
| title |X |X | | |
| usageLocation |X | | |mechanical property. The user’s country/region. Used for license assignment. |
| userPrincipalName |X | | |UPN is the login ID for the user. Most often the same as [mail] value. |

## 3rd party applications
This group is a set of attributes used as the minimal attributes needed for a generic workload or application. It can be used for a workload not listed in another section or for a non-Microsoft app. It is explicitly used for the following:

* Yammer (only User is consumed)
* [Hybrid Business-to-Business (B2B) cross-org collaboration scenarios offered by resources like SharePoint](/sharepoint/create-b2b-extranet)

This group is a set of attributes that can be used if the Microsoft Entra directory is not used to support Microsoft 365, Dynamics, or Intune. It has a small set of core attributes. Note that single sign-on or provisioning to some third-party applications requires configuring synchronization of attributes in addition to the attributes described here. Application requirements are described in the [SaaS app tutorial](../../saas-apps/tutorial-list.md) for each application.

| Attribute Name | User | Contact | Group | Comment |
| --- |:---:|:---:|:---:| --- |
| accountEnabled |X | | |Defines if an account is enabled. |
| cn |X | |X | |
| displayName |X |X |X | |
| employeeID |X |  |  | |
| givenName |X |X | | |
| mail |X | |X | |
| managedBy | | |X | |
| mailNickName |X |X |X | |
| member | | |X | |
| objectSID |X | | |mechanical property. AD user identifier used to maintain sync between Microsoft Entra ID and AD. |
| proxyAddresses |X |X |X | |
| pwdLastSet |X | | |mechanical property. Used to know when to invalidate already issued tokens. Used by both password hash sync, pass-through authentication and federation. |
| securityEnabled | | |X | |
| sn |X |X | | |
| sourceAnchor |X |X |X |mechanical property. Immutable identifier to maintain relationship between ADDS and Microsoft Entra ID. |
| usageLocation |X | | |mechanical property. The user’s country/region. Used for license assignment. |
| userPrincipalName |X | | |UPN is the login ID for the user. Most often the same as [mail] value. |

## Windows 10
A Windows 10 domain-joined computer(device) synchronizes some attributes to Microsoft Entra ID. For more information on the scenarios, see [Connect domain-joined devices to Microsoft Entra ID for Windows 10 experiences](../../devices/hybrid-join-plan.md). These attributes always synchronize and Windows 10 does not appear as an app you can unselect. A Windows 10 domain-joined computer is identified by having the attribute userCertificate populated.

| Attribute Name | Device | Comment |
| --- |:---:| --- |
| accountEnabled |X | |
| deviceTrustType |X |Hardcoded value for domain-joined computers. |
| displayName |X | |
| ms-DS-CreatorSID |X |Also called registeredOwnerReference. |
| objectGUID |X |Also called deviceID. |
| objectSID |X |Also called onPremisesSecurityIdentifier. |
| operatingSystem |X |Also called deviceOSType. |
| operatingSystemVersion |X |Also called deviceOSVersion. |
| userCertificate |X | |

These attributes for **user** are in addition to the other apps you have selected.  

| Attribute Name | User | Comment |
| --- |:---:| --- |
| domainFQDN |X |Also called dnsDomainName. For example, contoso.com. |
| domainNetBios |X |Also called netBiosName. For example, CONTOSO. |
| msDS-KeyCredentialLink |X |Once the user is enrolled in Windows Hello for Business. | 

## Exchange hybrid writeback
These attributes are written back from Microsoft Entra ID to on-premises Active Directory when you select to enable **Exchange hybrid**. Depending on your Exchange version, fewer attributes might be synchronized.

| Attribute Name (On-premises AD) | Attribute Name (Connect UI) | User | Contact | Group | Comment |
| --- |:---:|:---:|:---:| --- |---|
| msDS-ExternalDirectoryObjectID| ms-DS-External-Directory-Object-Id |X | | |Derived from cloudAnchor in Microsoft Entra ID. This attribute is new in Exchange 2016 and Windows Server 2016 AD. |
| msExchArchiveStatus| ms-Exch-ArchiveStatus |X | | |Online Archive: Enables customers to archive mail. |
| msExchBlockedSendersHash| ms-Exch-BlockedSendersHash |X | | |Filtering: Writes back on-premises filtering and online safe and blocked sender data from clients. |
| msExchSafeRecipientsHash| ms-Exch-SafeRecipientsHash  |X | | |Filtering: Writes back on-premises filtering and online safe and blocked sender data from clients. |
| msExchSafeSendersHash| ms-Exch-SafeSendersHash  |X | | |Filtering: Writes back on-premises filtering and online safe and blocked sender data from clients. |
| msExchUCVoiceMailSettings| ms-Exch-UCVoiceMailSettings |X | | |Enable Unified Messaging (UM) - Online voice mail: Used by Microsoft Lync Server integration to indicate to Lync Server on-premises that the user has voice mail in online services. |
| msExchUserHoldPolicies| ms-Exch-UserHoldPolicies |X | | |Litigation Hold: Enables cloud services to determine which users are under Litigation Hold. |
| proxyAddresses| proxyAddresses |X |X |X |Only the x500 address from Exchange Online is inserted. |
| publicDelegates| ms-Exch-Public-Delegates  |X | | |Allows an Exchange Online mailbox to be granted SendOnBehalfTo rights to users with on-premises Exchange mailbox. Requires Microsoft Entra Connect build 1.1.552.0 or after. |

## Exchange Mail Public Folder
These attributes are synchronized from on-premises Active Directory to Microsoft Entra ID when you select to enable **Exchange Mail Public Folder**.

| Attribute Name | PublicFolder | Comment |
| --- | :---:| --- |
| displayName | X |  |
| mail | X |  |
| msExchRecipientTypeDetails | X |  |
| objectGUID | X |  |
| proxyAddresses | X |  |
| targetAddress | X |  |

## Device writeback
Device objects are created in Active Directory. These objects can be devices joined to Microsoft Entra ID or domain-joined Windows 10 computers.

| Attribute Name | Device | Comment |
| --- |:---:| --- |
| altSecurityIdentities |X | |
| displayName |X | |
| dn |X | |
| msDS-CloudAnchor |X | |
| msDS-DeviceID |X | |
| msDS-DeviceObjectVersion |X | |
| msDS-DeviceOSType |X | |
| msDS-DeviceOSVersion |X | |
| msDS-DevicePhysicalIDs |X | |
| msDS-KeyCredentialLink |X |Only with Windows Server 2016 AD schema |
| msDS-IsCompliant |X | |
| msDS-IsEnabled |X | |
| msDS-IsManaged |X | |
| msDS-RegisteredOwner |X | |

## Notes
* When using an Alternate ID, the on-premises attribute userPrincipalName is synchronized with the Microsoft Entra attribute onPremisesUserPrincipalName. The Alternate ID attribute, for example mail, is synchronized with the Microsoft Entra attribute userPrincipalName.
* Although there is no enforcement of uniqueness on the Microsoft Entra onPremisesUserPrincipalName attribute, it is not supported to sync the same UserPrincipalName value to the Microsoft Entra onPremisesUserPrincipalName attribute for multiple different Microsoft Entra users.
* In the lists above, the object type **User** also applies to the object type **iNetOrgPerson**.

## Next steps
Learn more about the [Microsoft Entra Connect Sync](how-to-connect-sync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).
