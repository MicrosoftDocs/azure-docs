---
title: Azure Active Directory audit report events | Microsoft Docs
description: Audited events that are available for viewing and downloading from your Azure Active Directory
services: active-directory
documentationcenter: ''
author: dhanyahk
manager: femila
editor: ''

ms.assetid: 307eedf7-05bc-448d-a84d-bead5a4c5770
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/16/2017
ms.author: dhanyahk;markvi

---
# Azure Active Directory audit report events
*This documentation is part of the [Azure Active Directory Reporting Guide](active-directory-reporting-guide.md).*

The Azure Active Directory Audit Report helps customers identify privileged actions that occurred in their Azure Active Directory. Privileged actions include elevation changes (for example, role creation or password resets), changing policy configurations (for example password policies), or changes to directory configuration (for example, changes to domain federation settings). The reports provide the audit record for the event name, the actor who performed the action, the target resource affected by the change, and the date and time (in UTC). Customers are able to retrieve the list of audit events for their Azure Active Directory via the [Azure Portal](https://portal.azure.com/), as described in [View your Audit Logs](active-directory-reporting-azure-portal.md).

## List of Audit Report Events
<!--- audit event descriptions should be in the past tense --->

| Events | Event Description |
| --- | --- |
| **User events** | |
| Add User |Added a user to the directory. |
| Delete User |Deleted a user from the directory. |
| Set license properties |Set the license properties for a user in the directory. |
| Reset user password |Reset the password for a user in the directory. |
| Change user password |Changed the password for a user in the directory. |
| Change user license |Changed the license assigned to a user in the directory. To see what licenses were updated, look at the [Update user](#update-user-attributes) properties below |
| Update user |Updated a user in the directory. [See below](#update-user-attributes) for attributes that can be updated. |
| Set force change user password |Set the property that forces a user to change their password on login. |
| Update user credentials |User changed the password |
| **Group events** | |
| Add group |Created a group in the directory. |
| Update group |Updated a group in the directory. To see what group properties were updated, refer to [Group Properties Audited](#update-group-attributes) in the section below |
| Delete group |Deleted a group from the directory. |
| CreateGroupSettings |Created group settings |
| UpdateGroupSettings |Updated group settings. To see what group settings were updated, refer to [Group Properties Audited](#update-group-attributes) in the section below |
| DeleteGroupSettings |Deleted group settings |
| SetGroupLicense |Set group license. |
| SetGroupManagedBy |Set group to be managed by user |
| AddGroupMember |Added member to group |
| RemoveGroupMember |Remove member from group |
| AddGroupOwner |Added owner to group |
| RemoveGroupOwner |Removed owner from group |
| **Application events** | |
| Add service principal |Added a service principal to the directory. |
| Remove service principal |Removed a service principal from the directory. |
| Add service principal credentials |Added credentials to a service principal. |
| Remove service principal credentials |Removed credentials from a service principal. |
| Add delegation entry |Created an [OAuth2PermissionGrant](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permissiongrant-entity) in the directory. |
| Set delegation entry |Updated an [OAuth2PermissionGrant](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permissiongrant-entity) in the directory. |
| Remove delegation entry |Deleted an [OAuth2PermissionGrant](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permissiongrant-entity) in the directory. |
| **Role events** | |
| Add role member to Role |Added a user to a directory role. |
| Remove role member from Role |Removed a user from a directory role. |
| AddRoleDefinition |Added role definition. |
| UpdateRoleDefinition |Updated role definition. To see what role settings were updated, refer to [Role  Definition Properties Audited](#update-role-definition-attributes) in the section below |
| DeleteRoleDefinition |Deleted role definition. |
| AddRoleAssignmentToRoleDefinition |Added role assignment to role definition. |
| RemoveRoleAssignmentFromRoleDefinition |Removed role assignment from role definition. |
| AddRoleFromTemplate |Added role from template. |
| UpdateRole |Updated role. |
| AddRoleScopeMemberToRole |Added scoped member to role. |
| RemoveRoleScopedMemberFromRole |Removed scoped member from role. |
| **Device Events (all new events)** | |
| AddDevice |Added device. |
| UpdateDevice |Updated device. To see what device properties were updated, refer to [Device properties Audited](#update-device-attributes) in the section below |
| DeleteDevice |Deleted device. |
| AddDeviceConfiguration |Added device configuration. |
| UpdateDeviceConfiguration |Updated device configuration. To see what device configuration properties were updated, refer to [Device configuration properties Audited](#update-device-configuration-attributes) in the section below |
| DeleteDeviceConfiguration |Deleted device configuration. |
| AddRegisteredOwner |Added registered owner to device. |
| AddRegisteredUsers |Added registered users to device. |
| RemoveRegisteredOwner |Remove registered owner from device. |
| RemoveRegisteredUsers |Remove registered users from device. |
| RemoveDeviceCredentials |Remove device credentials. |
| **B2B events** | |
| Batch invites uploaded. |An administrator has uploaded a file containing invitations to be sent to partner users. |
| Batch invites processed. |A file containing invitations to partner users has been processed. |
| Invite external user. |An external user has been invited to the directory. |
| Redeem external user invite. |An external user has redeemed their invitation to the directory. |
| Add external user to group. |An external user has been assigned membership to a group in the directory. |
| Assign external user to application. |An external user has been assigned direct access to an application. |
| Viral tenant creation. |A new tenant has been created in Azure AD by the invitation redemption. |
| Viral user creation. |A user has been created in an existing tenant in Azure AD by the invitation redemption. |
| **Administrative Units (all new events)** | |
| AddAdministrativeUnit |Add administrative unit. |
| UpdateAdministrativeUnit |Update administrative unit. To see what Administrative Unit properties were updated, refer to [Administrative Unit Properties audited](#update-administrative-unit-attributes) in the section below |
| DeleteAdministrativeUnit |Delete administrative unit. |
| AddMemberToAdministrativeUnit |Add member to administrative unit. |
| RemoveMemberFromAdministrativeUnit |Remove member from administrative unit. |
| **Directory events** | |
| Add partner to company |Added a partner to the directory. |
| Remove Partner from company |Removed a partner from the directory. |
| DemotePartner |Demote partner. |
| Add domain to company |Added a domain to the directory. |
| Remove domain from company |Removed a domain from the directory. |
| Update domain |Updated a domain on the directory. To see what Domain properties were updated, refer to [Domain Properties audited](#update-domain-attributes) in the section below |
| Set domain authentication |Changed the default domain setting for the company. |
| Set Company contact information |Set company-level contact preferences. This includes email addresses for marketing, as well as technical notifications about Microsoft Online Services. |
| Set federation settings on domain |Updated the federation settings for a domain. |
| Verify domain |Verified a domain on the directory. |
| Verify email verified domain |Verified a domain on the directory using email verification. |
| Set DirSyncEnabled flag on company |Set the property that enables a directory for Azure AD Sync. |
| Set Password Policy |Set length and character constraints for user passwords. |
| Set Company Information |Updated the company-level information. See the [Get-MsolCompanyInformation](https://msdn.microsoft.com/library/azure/dn194126.aspx) PowerShell cmdlet for more details. |
| SetCompanyAllowedDataLocation |Set company allowed data location. |
| SetCompanyDirSyncEnabled |Set DirSyncEnabled flag. |
| SetCompanyDirSyncFeature |Set DirSync feature. |
| SetCompanyInformation |Set Company Information. |
| SetCompanyMultiNationalEnabled |Set company multinational feature enabled. |
| SetDirectoryFeatureOnTenant |Set directory feature on tenant. |
| SetTenantLicenseProperties |Set tenant license properties. |
| CreateCompanySettings |Create company settings |
| UpdateCompanySettings |Update company settings. To see what Company properties were updated, refer to [Company Properties audited](#update-company-attributes) in the section below |
| DeleteCompanySettings |Delete company settings |
| SetAccidentalDeletionThreshold |Set accidental deletion threshold. |
| SetRightsManagementProperties |Set rights management properties. |
| PurgeRightsManagementProperties |Purge rights management properties. |
| UpdateExternalSecrets |Update external secrets |
| **Policy Events (all new events)** | |
| AddPolicy |Add policy. |
| UpdatePolicy |Update policy. |
| DeletePolicy |Delete policy. |
| AddDefaultPolicyApplication |Add policy to application. |
| AddDefaultPolicyServicePrincipal |Add policy to service principal. |
| RemoveDefaultPolicyApplication |Remove policy from application. |
| RemoveDefaultPolicyServicePrincipal |Remove policy from service principal. |
| RemovePolicyCredentials |Remove policy credentials. |

## Audit report retention

For the most recent information about retention, see [Azure Active Directory report retention policies](active-directory-reporting-retention.md).


For customers interested in storing their audit events for longer retention periods, the Reporting API can be used to regularly pull audit events into a separate data store. See [Getting Started with the Reporting API](active-directory-reporting-api-getting-started.md) for details.

## Properties included with each audit event
| Property | Description |
| --- | --- |
| Date and Time |The date and time that the audit event occurred |
| Actor |The user or service principal that performed the action |
| Action |The action that was performed |
| Target |The user or service principal that the action was performed on |

## "Update User" attributes
The "Update user" audit event includes additional information about what user attributes were updated. For each attribute, both the previous value and the new value is included.

| Attribute | Description |
| --- | --- |
| AccountEnabled |The user can sign in. |
| AssignedLicense |All licenses that have been assigned to the user. |
| AssignedPlan |Service plans resulting from the licenses assigned to the user. |
| LicenseAssignmentDetail |Details on licenses assigned to the user. For instance, if group-based licensing was involved, this would include the group that granted the license. |
| Mobile |The user's mobile phone. |
| OtherMail |The user's alternate email address. |
| OtherMobile |The user's alternate mobile phone. |
| StrongAuthenticationMethod |A list of verification methods configured by the user for Multi-Factor Authentication, such as Voice Call, SMS, or Verification code from a mobile app. |
| StrongAuthenticationRequirement |If Multi-Factor Authentication is enforced, enabled, or disabled for this user. |
| StrongAuthenticationUserDetails |The user’s phone number, alternative phone number and email address used for Multi-Factor Authentication and password reset verification. |
| StrongAuthenticationPhoneAppDetail |Detail forof phone apps registered to perform 2FA login |
| TelephoneNumber |The user's telephone number. |
| AlternativeSecurityId |An alternative security ID for the object. |
| CreationType |Creation method of the user (Either by invitation or viral). |
| InviteTicket |List of invitation tickets for the user. |
| InviteReplyUrl |List of urls to reply upon invitation acceptance. |
| InviteResources |List of resources to which the user has been invited. |
| LastDirSyncTime |Last time the object was updated because of synchronizing from the authoritative (customer, on-premise) directory. |
| MSExchRemoteRecipientType |Maps to MSO recipient types. Refer to [MSO recipient types] https://msdn.microsoft.com/library/microsoft.office.interop.outlook.recipient.type.aspx for recipient types |
| PreferredDataLocation |The preferred location for the user's, group's, contact's, public folder's, or device's data. |
| ProxyAddresses |The address by which an Exchange Server recipient object is recognized in a foreign mail system. |
| StsRefreshTokensValidFrom |Carries refresh token revocation information - any STS refresh tokens issued before this time are considered expired. |
| UserPrincipalName |The UPN that is an Internet-style logon name for a user. |
| UserState |Status of User PendingApproval/PendingAcceptance/Accepted/PendingVerification. |
| UserStateChangedOn |TimeStamp of last change to UserState. Used to trigger lifecycle workflows. |
| UserType |Type of user. Member (0), Guest (1), Viral(2). |

## "Update Group" attributes
| Attribute | Description |
| --- | --- |
| Classification |The classification for a Unified Group (HBI, MBI, etc). |
| Description |Human-readable descriptive phrases about the object. |
| DisplayName |The display name for an object |
| DirSyncEnabled |Indicates whether synchronization occurs from an authoritative (customer, on-premise) directory. |
| GroupLicenseAssignment |License assignment of a group |
| GroupType |Type of Group, Unified (0) |
| IsMembershipRuleLocked |Indicates that the MembershipRule property is set by the self-service group management service and cannot be changed by users. Applicable only to groups where GroupType includes GroupType.DynamicMembership |
| IsPublic |Flag to indicate if the group is public/private. |
| LastDirSyncTime |Last time the object was updated as a result of synchronizing from the authoritative (customer, on premise) directory. |
| Mail |Primary e-mail address |
| MailEnabled |Indicates whether this group has e-mail capability. |
| MailNickname |Moniker for an address book object, typically the portion of its email name preceding the "@" symbol. |
| MembershipRule |A string expressing the criteria used by the self-service group management service to determine which members should belong to this group. See also IsMembershipRuleLocked. Applicable only to groups where GroupType includes GroupType.DynamicMembership. |
| MembershipRuleProcessingState |An enum value defined by the self-service group management service defining the status of membership processing for this group. Applicable only to groups where GroupType includes GroupType.DynamicMembership. |
| ProxyAddresses |The address by which an Exchange Server recipient object is recognized in a foreign mail system. |
| RenewedDateTime |Timestamp record of when a group was most recently renewed. |
| SecurityEnabled |Indicates whether membership in the group may influence authorization decisions. |
| WellKnownObject |Labels a directory object, designating it as one of a pre-defined set. |

## "Update Device" attributes
| Attribute | Description |
| --- | --- |
| AccountEnabled |Indicates whether a security principal can authenticate. |
| CloudAccountEnabled |Indicates whether a security principal can authenticate. Written by InTune when the device is mastered on premise. |
| CloudDeviceOSType |Type of the device based on the OS e.g. Windows RT, iOS. When set by a cloud service (such as Intune), this attribute becomes authoritative in the directory for DeviceOSType. |
| CloudDeviceOSVersion |Version of the OS. When set by a cloud service (such as Intune), this attribute becomes authoritative in the directory for DeviceOSVersion. |
| CloudDisplayName |Value of the displayName LDAP attribute. When set by a cloud service (such as Intune), this attribute becomes authoritative in the directory for displayName. |
| CloudCreated |Indicates whether the object was created by cloud services. |
| CompliantUntil |Until what time device is deemed compliant. |
| DeviceMetadata |Custom metadata for the device |
| DeviceObjectVersion |This attribute is used to identify the schema version of the device. |
| DeviceOSType |Type of the device based on the OS e.g. Windows RT, iOS. Written by the Registration Service and intended to be updated by the MDM management service or STS light management service. |
| DeviceOSVersion |Version of the OS. Written by the Registration Service and intended to be updated by the MDM management service or STS light management service. |
| DevicePhysicalIds |Multivalued attribute intended to store identifiers of the physical device. This may include BIOS IDs, TPM thumbprints, hardware specific IDs, etc. |
| DirSyncEnabled |Indicates whether synchronization occurs from an authoritative (customer, on premise) directory. |
| DisplayName |The display name for an object |
| IsCompliant |This attribute is used to manage the mobile device management status of the device. |
| IsManaged |This attribute is used to indicate the device is managed by a cloud MDM. |
| LastDirSyncTime |Last time the object was updated because of synchronizing from the authoritative (customer, on premise) directory. |

## "Update Device Configuration" attributes
| Attribute | Description |
| --- | --- |
| MaximumRegistrationInactivityPeriod |The maximum number of days a device can be inactive before it is considered for removal. |
| RegistrationQuota |Policy used to limit the number of device registrations allowed for a single user. |

## "Update Service principal Configuration" attributes
| Attribute | Description |
| --- | --- |
| AccountEnabled |Indicates whether a security principal can authenticate. |
| AppPrincipalId |External, application-defined identity for a security principal. |
| DisplayName |The display name for an object |
| ServicePrincipalName |A service principal name, containing "name/authority" where name specifies an application class value and authority contains at least hostname[:port] or "name" that specifies an identifier for the service principal. |

## "Update App" attributes
| Attribute | Description |
| --- | --- |
| AppAddress |The set of addresses (redirect URLs) that are assigned to a service principal. |
| AppId |Application ID of the App |
| AppIdentifierUri |Application URI, which identifies the application.  It is usually the application access URL. |
| AppLogoUrl |The url for the application logo image stored in a CDN. |
| AvailableToOtherTenants |True the application is multi-tenant application (i.e. can be used by other tenants). |
| DisplayName |The display name for an Application Name |
| Entitlement |List of application entitlements. |
| ExternalUserAccountDelegationsAllowed |Flag indicating whether resource application is a trusted one and can create delegation entries for external user accounts. |
| GroupMembershipClaims |The group membership claims policy. |
| PublicClient |True if the client cannot keep secret (i.e. non-confidential client in OAuth2.0) |
| RecordConsentConditions |Types of consent conditions, as defined by the contract terms: None (0), SilentConsentForPartnerManagedApp(1). This value will be exposed in the Graph API schema and can only be set/changed by tenant admins. |
| RequiredResourceAccess |XML content of a Value of the RequiredResourceAccess property. |
| WebApp |If true, indicates that this application is a web app. |
| WwwHomepage |The primary Web page. |

## "Update Role" attributes
| Attribute | Description |
| --- | --- |
| AppAddress |The set of addresses (redirect URLs) that are assigned to a service principal. |
| BelongsToFirstLoginObjectSet |If true, indicates that this object belongs to the set of objects required to enable login of the first admin of a new tenant. |
| Builtin |Indicates whether the lifetime of an object is owned by the system. |
| Description |Human-readable descriptive phrases about the object. |
| DisplayName |The display name for an object |
| MailNickname |Moniker for an address book object, typically the portion of its email name preceding the "@" symbol. |
| RoleDisabled |Indicates whether the role should be ignored for purposes of access checks. |
| RoleTemplateId |Identity of the role template. |
| ServiceInfo |Service-specific provisioning information that may be consumed by MOAC and/or other service instances (of the same or different service types). |
| TaskSetScopeReference |Identifies a TaskSet and a set of Scopes associated with a Role or RoleTemplate. |
| ValidationError |Information published by a federated service describing a non-transient, service-specific error regarding the properties or link from an object administrator action to resolve. |
| WellKnownObject |Labels a directory object, designating it as one of a pre-defined set. |

## "Update Role definition" attributes
| Attribute | Description |
| --- | --- |
| AssignableScopes |Collection of authorization scopes that can be referenced when assigning this RoleDefinition to a security principal. |
| DisplayName |The display name for an object |
| GrantedPermissions |Permissions granted by this RoleDefinition. |

## "Update Administrative Unit" attributes
| Attribute | Description |
| --- | --- |
| Description |This property is updated when you change the description of an administrative unit. |
| DisplayName |This property is updated when you change the name of an administrative unit. |

## "Update Company" attributes
| Attribute | Description |
| --- | --- |
| AllowedDataLocation |A location in which the company's users are allowed to be provisioned. |
| AuthorizedServiceInstance |Names of service instances to which a plan may be deployed. |
| DirSyncEnabled |Indicates whether synchronization occurs from an authoritative (customer, on premise) directory. |
| DirSyncStatus |Indicates whether synchronization of address book objects in this tenant context occurs from an authoritative (customer, on premise) directory; an expansion of the DirSyncEnabled property on Company objects. |
| DirSyncFeatures |Bit flag to keep track of set of enabled and disabled dirsync features for the tenant. |
| DirectoryFeatures |Enabled/disabled directory features. |
| DirSyncConfiguration |Contains all DirSync configuration specific to the current tenant. |
| DisplayName |The display name for an object |
| IsMnc |A Boolean flag set to "true" iff the company is enabled for the multinational company feature. |
| ObjectSettings |A collection of settings applicable to the scope of the object. |
| PartnerCommerceUrl |URL to the Partner's commerce site. |
| PartnerHelpUrl |URL to the Partner's help site. |
| PartnerSupportEmail |URL to the Partner's support email. |
| PartnerSupportTelephone |URL to the Partner's support telephone. |
| PartnerSupportUrl |URL to the Partner's support site. |
| StrongAuthenticationDetails |Details related to StrongAuthentication. |
| StrongAuthenticationPolicy |Strong authentication policy for the company. |
| TechnicalNotificationMail |E-Mail address to notify technical issues pertaining to a company. |
| TelephoneNumber |Telephone numbers that comply with the ITU Recommendation E.123. |
| TenantType |The type of a tenant. If this value is not specified, the tenant is a Company. Otherwise, possible values are: MicrosoftSupport (0), SyndicatePartner (1), BreadthPartner (2) BreadthPartnerDelegatedAdmin (3) ResellerPartnerDelegatedAdmin (4) ValueAddedResellerPartnerDelegatedAdmin (5). |
| VerifiedDomain |A set of DNS domain names bound to a Company. |

## "Update Domain" attributes
| Attribute | Description |
| --- | --- |
| Capabilities |Bit flags describing the capabilities of the domain, if any. |
| Default |Indicates whether the domain is the default value; for example, the default UserPrincipalName suffix when an administrator creates a new user in MOAC. |
| Initial |Indicates whether the domain is the initial domain for the company, as allocated by OCP. The initial domain is a unique sub-domain of a Microsoft Online domain; e.g.contoso3.microsoftonline.com. |
| LiveType |Type of the corresponding Windows Live namespace, if any. |
| Name |Identifier for the endpoint. |
| PasswordNotificationWindowDays |The number of days before a password expires the user is notified. |
| PasswordValidityPeriodDays |The number of days a password is good for before it must be changed. |

Audit records are a required control for many compliance regulations. For customers using the Azure Active Directory Audit Report to meet their compliance regulations, it is recommended that the customer submit a copy of this help topic with the copy of the customer's exported audit report to help explain the report details. If the auditor would like to understand the compliance regulations that Azure currently meets, direct the auditor to the [Compliance page](https://azure.microsoft.com/support/trust-center/compliance/) of the Microsoft Azure Trust Center.

