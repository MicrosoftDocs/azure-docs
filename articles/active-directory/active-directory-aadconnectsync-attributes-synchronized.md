<properties
	pageTitle="Azure AD Connect sync: Attributes synchronized to Azure Active Directory | Microsoft Azure"
	description="Lists the attributes that are synchronized to Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="andkjell"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/27/2016"
	ms.author="markvi;andkjell"/>


# Azure AD Connect sync: Attributes synchronized to Azure Active Directory

This topic lists the attributes that are synchronized by Azure AD Connect sync.  
The attributes are grouped by the related Azure AD app.

## Attributes to synchronize
A common question is *what is the list of minimum attributes to synchronize*. The default and recommended approach is to keep the default attributes so a full GAL (Global Address List) can be constructed in the cloud and to get all features in Office 365 workloads. In some cases there are some attributes which your organization do not want synchronized to the cloud since they contain sensitive or PII (Personally identifiable information) data, like in the example below.

![bad attributes](./media/active-directory-aadconnectsync-attributes-synchronized/badextensionattribute.png)

In this case, start with the list of attributes below and identify those which would contain sensitive or PII data and cannot be synchronized. Then deselect those during installation using [Azure AD app and attribute filtering](active-directory-aadconnect-get-started-custom.md#azure-ad-app-and-attribute-filtering).

>[AZURE.WARNING] When deselecting attributes, you should be cautious and only deselect those absolutely not possible to synchronize. Unselecting other attributes might have a negative impact on features.

## Office 365 ProPlus

| Attribute Name| User| Comment |
| --- | :-: | --- |
| accountEnabled| X| Defines if an account is enabled.|
| cn| X|  |
| displayName| X|  |
| objectSID| X| mechanical property. AD user identifier used to maintain sync between Azure AD and AD.|
| pwdLastSet| X| mechanical property. Used to know when to invalidate already issued tokens. Used by both password sync and federation.|
| sourceAnchor| X| mechanical property. Immutable identifier to maintain relationship between ADDS and Azure AD.|
| usageLocation| X| mechanical property. The user’s country. Used for license assignment.|
| userPrincipalName| X| UPN is the login ID for the user. Most often the same as [mail] value.|


## Exchange Online

| Attribute Name| User| Contact| Group| Comment |
| --- | :-: | :-: | :-: | --- |
| accountEnabled| X|  |  | Defines if an account is enabled.|
| assistant| X| X|  |  |
| authOrig| X| X| X|  |
| c| X| X|  |  |
| cn| X|  | X|  |
| co| X| X|  |  |
| company| X| X|  |  |
| countryCode| X| X|  |  |
| department| X| X|  |  |
| description| X| X| X|  |
| displayName| X| X| X|  |
| dLMemRejectPerms| X| X| X|  |
| dLMemSubmitPerms| X| X| X|  |
| extensionAttribute1| X| X| X|  |
| extensionAttribute10| X| X| X|  |
| extensionAttribute11| X| X| X|  |
| extensionAttribute12| X| X| X|  |
| extensionAttribute13| X| X| X|  |
| extensionAttribute14| X| X| X|  |
| extensionAttribute15| X| X| X|  |
| extensionAttribute2| X| X| X|  |
| extensionAttribute3| X| X| X|  |
| extensionAttribute4| X| X| X|  |
| extensionAttribute5| X| X| X|  |
| extensionAttribute6| X| X| X|  |
| extensionAttribute7| X| X| X|  |
| extensionAttribute8| X| X| X|  |
| extensionAttribute9| X| X| X|  |
| facsimiletelephonenumber| X| X|  |  |
| givenName| X| X|  |  |
| homePhone| X| X|  |  |
| info| X| X| X| This attribute is currently not consumed for groups.|
| Initials| X| X|  |  |
| l| X| X|  |  |
| legacyExchangeDN| X| X| X|  |
| mailNickname| X| X| X|  |
| mangedBy|  |  | X|  |
| manager| X| X|  |  |
| member|  |  | X|  |
| mobile| X| X|  |  |
| msDS-HABSeniorityIndex| X| X| X|  |
| msDS-PhoneticDisplayName| X| X| X|  |
| msExchArchiveGUID| X|  |  |  |
| msExchArchiveName| X|  |  |  |
| msExchAssistantName| X| X|  |  |
| msExchAuditAdmin| X|  |  |  |
| msExchAuditDelegate| X|  |  |  |
| msExchAuditDelegateAdmin| X|  |  |  |
| msExchAuditOwner| X|  |  |  |
| msExchBlockedSendersHash| X| X|  |  |
| msExchBypassAudit| X|  |  |  |
| msExchCoManagedByLink|  |  | X|  |
| msExchDelegateListLink| X|  |  |  |
| msExchELCExpirySuspensionEnd| X|  |  |  |
| msExchELCExpirySuspensionStart| X|  |  |  |
| msExchELCMailboxFlags| X|  |  |  |
| msExchEnableModeration| X|  | X|  |
| msExchExtensionCustomAttribute1| X| X| X| This attribute is currently not consumed by Exchange Online. |
| msExchExtensionCustomAttribute2| X| X| X| This attribute is currently not consumed by Exchange Online. |
| msExchExtensionCustomAttribute3| X| X| X| This attribute is currently not consumed by Exchange Online. |
| msExchExtensionCustomAttribute4| X| X| X| This attribute is currently not consumed by Exchange Online. |
| msExchExtensionCustomAttribute5| X| X| X| This attribute is currently not consumed by Exchange Online. |
| msExchHideFromAddressLists| X| X| X|  |
| msExchImmutableID| X|  |  |  |
| msExchLitigationHoldDate| X| X| X|  |
| msExchLitigationHoldOwner| X| X| X|  |
| msExchMailboxAuditEnable| X|  |  |  |
| msExchMailboxAuditLogAgeLimit| X|  |  |  |
| msExchMailboxGuid| X|  |  |  |
| msExchModeratedByLink| X| X| X|  |
| msExchModerationFlags| X| X| X|  |
| msExchRecipientDisplayType| X| X| X|  |
| msExchRecipientTypeDetails| X| X| X|  |
| msExchRemoteRecipientType| X|  |  |  |
| msExchRequireAuthToSendTo| X| X| X|  |
| msExchResourceCapacity| X|  |  |  |
| msExchResourceDisplay| X|  |  |  |
| msExchResourceMetaData| X|  |  |  |
| msExchResourceSearchProperties| X|  |  |  |
| msExchRetentionComment| X| X| X|  |
| msExchRetentionURL| X| X| X|  |
| msExchSafeRecipientsHash| X| X|  |  |
| msExchSafeSendersHash| X| X|  |  |
| msExchSenderHintTranslations| X| X| X|  |
| msExchTeamMailboxExpiration| X|  |  |  |
| msExchTeamMailboxOwners| X|  |  |  |
| msExchTeamMailboxSharePointUrl| X|  |  |  |
| msExchUserHoldPolicies| X|  |  |  |
| msOrg-IsOrganizational|  |  | X|  |
| objectSID| X|  | X| mechanical property. AD user identifier used to maintain sync between Azure AD and AD.|
| oOFReplyToOriginator|  |  | X|  |
| otherFacsimileTelephone| X| X|  |  |
| otherHomePhone| X| X|  |  |
| otherTelephone| X| X|  |  |
| pager| X| X|  |  |
| physicalDeliveryOfficeName| X| X|  |  |
| postalCode| X| X|  |  |
| proxyAddresses| X| X| X|  |
| publicDelegates| X| X| X|  |
| pwdLastSet| X|  |  | mechanical property. Used to know when to invalidate already issued tokens. Used by both password sync and federation.|
| reportToOriginator|  |  | X|  |
| reportToOwner|  |  | X|  |
| securityEnabled|  |  | X| Derived from groupType|
| sn| X| X|  |  |
| sourceAnchor| X| X| X| mechanical property. Immutable identifier to maintain relationship between ADDS and Azure AD.|
| st| X| X|  |  |
| streetAddress| X| X|  |  |
| targetAddress| X| X|  |  |
| telephoneAssistant| X| X|  |  |
| telephoneNumber| X| X|  |  |
| thumbnailphoto| X| X|  |  |
| title| X| X|  |  |
| unauthOrig| X| X| X|  |
| usageLocation| X|  |  | mechanical property. The user’s country. Used for license assignment.|
| userCertificate| X| X|  |  |
| userPrincipalName| X|  |  | UPN is the login ID for the user. Most often the same as [mail] value.|
| userSMIMECertificates| X| X|  |  |
| wWWHomePage| X| X|  |  |



## SharePoint Online

| Attribute Name| User| Contact| Group| Comment |
| --- | :-: | :-: | :-: | --- |
| accountEnabled| X|  |  | Defines if an account is enabled.|
| authOrig| X| X| X|  |
| c| X| X|  |  |
| cn| X|  | X|  |
| co| X| X|  |  |
| company| X| X|  |  |
| countryCode| X| X|  |  |
| department| X| X|  |  |
| description| X| X| X|  |
| displayName| X| X| X|  |
| dLMemRejectPerms| X| X| X|  |
| dLMemSubmitPerms| X| X| X|  |
| extensionAttribute1| X| X| X|  |
| extensionAttribute10| X| X| X|  |
| extensionAttribute11| X| X| X|  |
| extensionAttribute12| X| X| X|  |
| extensionAttribute13| X| X| X|  |
| extensionAttribute14| X| X| X|  |
| extensionAttribute15| X| X| X|  |
| extensionAttribute2| X| X| X|  |
| extensionAttribute3| X| X| X|  |
| extensionAttribute4| X| X| X|  |
| extensionAttribute5| X| X| X|  |
| extensionAttribute6| X| X| X|  |
| extensionAttribute7| X| X| X|  |
| extensionAttribute8| X| X| X|  |
| extensionAttribute9| X| X| X|  |
| facsimiletelephonenumber| X| X|  |  |
| givenName| X| X|  |  |
| hideDLMembership|  |  | X|  |
| homephone| X| X|  |  |
| info| X| X| X|  |
| initials| X| X|  |  |
| ipPhone| X| X|  |  |
| l| X| X|  |  |
| mail| X| X| X|  |
| mailnickname| X| X| X|  |
| managedBy|  |  | X|  |
| manager| X| X|  |  |
| member|  |  | X|  |
| middleName| X| X|  |  |
| mobile| X| X|  |  |
| msExchTeamMailboxExpiration| X|  |  |  |
| msExchTeamMailboxOwners| X|  |  |  |
| msExchTeamMailboxSharePointLinkedBy| X|  |  |  |
| msExchTeamMailboxSharePointUrl| X|  |  |  |
| objectSID| X|  | X| mechanical property. AD user identifier used to maintain sync between Azure AD and AD.|
| oOFReplyToOriginator|  |  | X|  |
| otherFacsimileTelephone| X| X|  |  |
| otherHomePhone| X| X|  |  |
| otherIpPhone| X| X|  |  |
| otherMobile| X| X|  |  |
| otherPager| X| X|  |  |
| otherTelephone| X| X|  |  |
| pager| X| X|  |  |
| physicalDeliveryOfficeName| X| X|  |  |
| postalCode| X| X|  |  |
| postOfficeBox| X| X|  |  |
| preferredLanguage| X|  |  |  |
| proxyAddresses| X| X| X|  |
| pwdLastSet| X|  |  | mechanical property. Used to know when to invalidate already issued tokens. Used by both password sync and federation.|
| reportToOriginator|  |  | X|  |
| reportToOwner|  |  | X|  |
| securityEnabled|  |  | X| Derived from groupType|
| sn| X| X|  |  |
| sourceAnchor| X| X| X| mechanical property. Immutable identifier to maintain relationship between ADDS and Azure AD.|
| st| X| X|  |  |
| streetAddress| X| X|  |  |
| targetAddress| X| X|  |  |
| telephoneAssistant| X| X|  |  |
| telephoneNumber| X| X|  |  |
| thumbnailphoto| X| X|  |  |
| title| X| X|  |  |
| unauthOrig| X| X| X|  |
| url| X| X|  |  |
| usageLocation| X|  |  | mechanical property. The user’s country. Used for license assignment.|
| userPrincipalName| X|  |  | UPN is the login ID for the user. Most often the same as [mail] value.|
| wWWHomePage| X| X|  |  |

## Lync Online

| Attribute Name| User| Contact| Group| Comment |
| --- | :-: | :-: | :-: | --- |
| accountEnabled| X|  |  | Defines if an account is enabled.|
| c| X| X|  |  |
| cn| X|  | X|  |
| co| X| X|  |  |
| company| X| X|  |  |
| department| X| X|  |  |
| description| X| X| X|  |
| displayName| X| X| X|  |
| facsimiletelephonenumber| X| X| X|  |
| givenName| X| X|  |  |
| homephone| X| X|  |  |
| ipPhone| X| X|  |  |
| l| X| X|  |  |
| mail| X| X| X|  |
| mailNickname| X| X| X|  |
| managedBy|  |  | X|  |
| manager| X| X|  |  |
| member|  |  | X|  |
| mobile| X| X|  |  |
| msExchHideFromAddressLists| X| X| X|  |
| msRTCSIP-ApplicationOptions| X|  |  |  |
| msRTCSIP-DeploymentLocator| X| X|  |  |
| msRTCSIP-Line| X| X|  |  |
| msRTCSIP-OptionFlags| X| X|  |  |
| msRTCSIP-OwnerUrn| X|  |  |  |
| msRTCSIP-PrimaryUserAddress| X| X|  |  |
| msRTCSIP-UserEnabled| X| X|  |  |
| objectSID| X|  | X| mechanical property. AD user identifier used to maintain sync between Azure AD and AD.|
| otherTelephone| X| X|  |  |
| physicalDeliveryOfficeName| X| X|  |  |
| postalCode| X| X|  |  |
| preferredLanguage| X|  |  |  |
| proxyAddresses| X| X| X|  |
| pwdLastSet| X|  |  | mechanical property. Used to know when to invalidate already issued tokens. Used by both password sync and federation.|
| securityEnabled|  |  | X| Derived from groupType|
| sn| X| X|  |  |
| sourceAnchor| X| X| X| mechanical property. Immutable identifier to maintain relationship between ADDS and Azure AD.|
| st| X| X|  |  |
| streetAddress| X| X|  |  |
| telephoneNumber| X| X|  |  |
| thumbnailphoto| X| X|  |  |
| title| X| X|  |  |
| usageLocation| X|  |  | mechanical property. The user’s country. Used for license assignment.|
| userPrincipalName| X|  |  | UPN is the login ID for the user. Most often the same as [mail] value.|
| wWWHomePage| X| X|  |  |


## Azure RMS

| Attribute Name| User| Contact| Group| Comment |
| --- | :-: | :-: | :-: | --- |
| accountEnabled| X|  |  | Defines if an account is enabled.|
| cn| X|  | X| Common name or alias. Most often the prefix of [mail] value.|
| displayName| X| X| X| A string that represents the name often shown as the friendly name (first name last name).|
| mail| X| X| X| full email address.|
| member|  |  | X|  |
| objectSID| X|  | X| mechanical property. AD user identifier used to maintain sync between Azure AD and AD.|
| proxyAddresses| X| X| X| mechanical property. Used by Azure AD. Contains all secondary email addresses for the user.|
| pwdLastSet| X|  |  | mechanical property. Used to know when to invalidate already issued tokens.|
| securityEnabled|  |  | X| Derived from groupType.|
| sourceAnchor| X| X| X| mechanical property. Immutable identifier to maintain relationship between ADDS and Azure AD.|
| usageLocation| X|  |  | mechanical property. The user’s country. Used for license assignment.|
| userPrincipalName| X|  |  | This UPN is the login ID for the user. Most often the same as [mail] value.|


## Intune

| Attribute Name| User| Contact| Group| Comment |
| --- | :-: | :-: | :-: | --- |
| accountEnabled| X|  |  | Defines if an account is enabled.|
| c| X| X|  |  |
| cn| X|  | X|  |
| description| X| X| X|  |
| displayName| X| X| X|  |
| mail| X| X| X|  |
| mailnickname| X| X| X|  |
| member|  |  | X|  |
| objectSID| X|  | X| mechanical property. AD user identifier used to maintain sync between Azure AD and AD.|
| proxyAddresses| X| X| X|  |
| pwdLastSet| X|  |  | mechanical property. Used to know when to invalidate already issued tokens. Used by both password sync and federation.|
| securityEnabled|  |  | X| Derived from groupType|
| sourceAnchor| X| X| X| mechanical property. Immutable identifier to maintain relationship between ADDS and Azure AD.|
| usageLocation| X|  |  | mechanical property. The user’s country. Used for license assignment.|
| userPrincipalName| X|  |  | UPN is the login ID for the user. Most often the same as [mail] value.|



## Dynamics CRM

| Attribute Name| User| Contact| Group| Comment |
| --- | :-: | :-: | :-: | --- |
| accountEnabled| X|  |  | Defines if an account is enabled.|
| c| X| X|  |  |
| cn| X|  | X|  |
| co| X| X|  |  |
| company| X| X|  |  |
| countryCode| X| X|  |  |
| description| X| X| X|  |
| displayName| X| X| X|  |
| facsimiletelephonenumber| X| X|  |  |
| givenName| X| X|  |  |
| l| X| X|  |  |
| managedBy|  |  | X|  |
| manager| X| X|  |  |
| member|  |  | X|  |
| mobile| X| X|  |  |
| objectSID| X|  | X| mechanical property. AD user identifier used to maintain sync between Azure AD and AD.|
| physicalDeliveryOfficeName| X| X|  |  |
| postalCode| X| X|  |  |
| preferredLanguage| X|  |  |  |
| pwdLastSet| X|  |  | mechanical property. Used to know when to invalidate already issued tokens. Used by both password sync and federation.|
| securityEnabled|  |  | X| Derived from groupType|
| sn| X| X|  |  |
| sourceAnchor| X| X| X| mechanical property. Immutable identifier to maintain relationship between ADDS and Azure AD.|
| st| X| X|  |  |
| streetAddress| X| X|  |  |
| telephoneNumber| X| X|  |  |
| title| X| X|  |  |
| usageLocation| X|  |  | mechanical property. The user’s country. Used for license assignment.|
| userPrincipalName| X|  |  | UPN is the login ID for the user. Most often the same as [mail] value.|

## 3rd party applications
This is a set of attributes used as the minimal attributes needed for a generic workload or application. It can be used for workload not listed above or for a non-Microsoft app. It is explicitly used for the following:

- Yammer (only User is actually consumed)
- [Hybrid Business-to-Business (B2B) cross-org collaboration scenarios offered by resources like SharePoint](http://go.microsoft.com/fwlink/?LinkId=747036)

This is a set of attributes which can be used if the Azure AD directory is not used to support Office 365, Dynamics, or Intune. It has a small set of core attributes.

| Attribute Name| User| Contact| Group| Comment |
| --- | :-: | :-: | :-: | --- |
| accountEnabled| X|  |  | Defines if an account is enabled.|
| cn| X|  | X|  |
| displayName| X| X| X|  |
| givenName| X| X|  |  |
| mail| X|  | X|  |
| managedBy|  |  | X|  |
| mailNickName| X| X| X|  |
| member|  |  | X|  |
| objectSID| X|  |  | mechanical property. AD user identifier used to maintain sync between Azure AD and AD.|
| proxyAddresses| X| X| X|  |
| pwdLastSet| X|  |  | mechanical property. Used to know when to invalidate already issued tokens. Used by both password sync and federation.|
| sn| X| X|  |  |
| sourceAnchor| X| X| X| mechanical property. Immutable identifier to maintain relationship between ADDS and Azure AD.|
| usageLocation| X|  |  | mechanical property. The user’s country. Used for license assignment.|
| userPrincipalName| X|  |  | UPN is the login ID for the user. Most often the same as [mail] value.|

## Windows 10
Windows 10 domain-joined computers(devices) will synchronize some attributes to Azure AD. For more information on the scenarios see [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md). These attributes will always synchronize and Windows 10 does not appear as an app you can unselect. A Windows 10 domain-joined computer is identified by having the attribute userCertificate populated.

| Attribute Name| Device| Comment |
| --- | :-: | --- |
| accountEnabled| X| |
| deviceTrustType| X| Hardcoded value for domain-joined computers. |
| displayName | X| |
| ms-DS-CreatorSID | X| Also called registeredOwnerReference.|
| objectGUID | X| Also called deviceID.|
| objectSID | X| Also called onPremisesSecurityIdentifier.|
| operatingSystem | X| Also called deviceOSType.|
| operatingSystemVersion | X| Also called deviceOSVersion.|
| userCertificate | X| |

These attributes for user is in addition to the other apps you have selected.  

| Attribute Name| User| Comment |
| --- | :-: | --- |
| domainFQDN| X| Also called dnsDomainName. E.g. contoso.com.|
| domainNetBios| X| Also called netBiosName. E.g. CONTOSO.|

## Exchange hybrid writeback
These attributes are written back from Azure AD to on-premises Active Directory when you select to enable Exchange hybrid. Depending on your Exchange version, fewer attributes might be synchronized.

| Attribute Name| User| Contact| Group| Comment |
| --- | :-: | :-: | :-: | --- |
| msDS-ExternalDirectoryObjectID| X|  |  | Derived from cloudAnchor in Azure AD. This is new in Exchange 2016.|
| msExchArchiveStatus| X|  |  | Online Archive: Enables customers to archive mail.|
| msExchBlockedSendersHash| X|  |  | Filtering: Writes back on-premises filtering and online safe and blocked sender data from clients.|
| msExchSafeRecipientsHash| X|  |  | Filtering: Writes back on-premises filtering and online safe and blocked sender data from clients.|
| msExchSafeSendersHash| X|  |  | Filtering: Writes back on-premises filtering and online safe and blocked sender data from clients.|
| msExchUCVoiceMailSettings| X|  |  | Enable Unified Messaging (UM) - Online voice mail: Used by Microsoft Lync Server integration to indicate to Lync Server on-premises that the user has voice mail in online services.|
| msExchUserHoldPolicies| X|  |  | Litigation Hold: Enables cloud services to determine which users are under Litigation Hold.|
| proxyAddresses| X| X| X| Only the x500 address from Exchange Online is inserted.|

## Device writeback
Device objects are created in Active Directory. These can be devices joined to Azure AD or domain-joined Windows 10 computers.

| Attribute Name| Device| Comment |
| --- | :-: | --- |
| altSecurityIdentities | X| |
| displayName | X| |
| dn | X| |
| msDS-CloudAnchor | X| |
| msDS-DeviceID | X| |
| msDS-DeviceObjectVersion | X| |
| msDS-DeviceOSType | X| |
| msDS-DeviceOSVersion | X| |
| msDS-DevicePhysicalIDs | X| |
| msDS-KeyCredentialLink | X| Only with Windows Server 2016 AD schema |
| msDS-IsCompliant | X| |
| msDS-IsEnabled | X| |
| msDS-IsManaged | X| |
| msDS-RegisteredOwner | X| |


## Notes
- When using an Alternate ID, the on-premises attribute userPrincipalName will be synchronized with the Azure AD attribute onPremisesUserPrincipalName. The Alternate ID attribute, e.g. mail, will be synchronized with the Azure AD attribute userPrincipalName.
- In the lists above, the object type **User** also applies to the object type **iNetOrgPerson**.

## Next steps
Learn more about the [Azure AD Connect sync](active-directory-aadconnectsync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
