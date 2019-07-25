---
title: Custom administrator role permissions to delegate app registration management - Azure Active Directory | Microsoft Docs
description: Custom administrator role available permissions for delegating identity management. 
services: active-directory
author: curtand
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 07/22/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Application registration subtypes and permissions in Azure Active Directory

This article contains the currently available app registration permissions for custom role definitions in Azure Active Directory (Azure AD).

## Single-tenant v. multi-tenant permissions

Custom role permissions differ for single-tenant and multi-tenant applications. Single-tenant applications are available only to users in the Azure AD organization where the application is registered. Multi-tenant applications are available to all Azure AD organizations. Single-tenant applications are defined as having **Supported account types** set to "Accounts in this organizational directory only." In the Graph API, single-tenant applications have the signInAudience property set to "AzureADMyOrg."

## Application registration subtypes and permissions

See the [custom roles overview](roles-custom-overview.md) for an explanation of what the general terms subtype, permission, and property set mean. The following information is specific to application registrations.

### Subtypes

There is just one app registration subtype - applications.myOrganization. For example, microsoft.directory/applications.myOrganization/basic/update. This subtype is set on the **Authentication** page for a specific app registration, and corresponds to setting the signInAudience property to "AzureADMyOrg" using Graph API or PowerShell. The subtype restricts the permission to app registrations that are marked as accessible only by accounts in your organization (single-tenant applications).

You can use the restricted permission to grant read or manage permissions to internal applications only without granting read or manage permissions to applications accessible by accounts in other organizations.

There are applications.myOrganization versions of all read and update permissions as well as the delete permission. There is no applications.myOrganization version of create at this time. Standard permissions (for example, microsoft.directory/applications/basic/update) grant read or management permissions for all app registration types.

   ![Declare a single-tenant application or multi-tenant application](./media/roles-custom-available-permissions/supported-account-types.png)

Details for the following permissions are listed in [Available custom role permissions in Azure Active Directory](roles-custom-available-permissions.md).

### Create and delete

There are two permissions available for granting the ability to create app registrations:

- microsoft.directory/applications/createAsOwner
- microsoft.directory/applications/create

If both permissions are assigned, the create permission will take precedence. Though the createAsOwner permission does not automatically add the creator as the first owner, owners can be specified during the creation of the app registration when using Graph APIs or PowerShell cmdlets.

Create permissions grant access to the **New registration** command.

   ![These permissions grant access to the New Registration portal command](./media/roles-custom-available-permissions/grant-new-registration.png)

There are two permissions available for granting the ability to delete app registrations:

- microsoft.directory/applications/delete: Grants the ability to delete app registrations regardless of subtype.
- microsoft.directory/applications.myOrganization/delete: Grants the ability to delete only app registrations that are only accessible by accounts in your organization (myOrganization app registrations).

> [!NOTE]
> When assigning a role that contains create permissions, the role assignment must be made at the directory scope. A create permission assigned at a resource scope does not grant the ability to create app registrations.

### Read

All member users in the organization can read app registration information by default. However, guest users and applications (service principals) do not. If you plan to assign a role to a guest user or application, you must include the appropriate read permissions.

- microsoft.directory/applications/allProperties/read: Ability to read all properties of single-tenant and multi-tenant applications outside of sensitive properties like credentials.
- microsoft.directory/applications.myOrganization/allProperties/read: Grants the same permissions as microsoft.directory/applications/allProperties/read, but only for single-tenant applications.
- microsoft.directory/applications/standard/read: Grants access to all fields on the application registration branding page.
- microsoft.directory/applications.myOrganization/standard/read: Grants the same permissions as microsoft.directory/applications/standard/read, but only for single-tenant applications.
- microsoft.directory/applications/owners/read: Grants the ability to read owners property on single-tenant and multi-tenant applications. Grants access to all fields on the application registration owners page. Grants access to the following properties on the application entity:
  - AllowActAsForAllClients
  - AllowPassthroughUsers
  - AppAddress
  - AppBrandingElements
  - AppCategory
  - AppCreatedDateTime
  - AppData
  - AppId
  - AppInformationalUrl
  - ApplicationTag
  - AppLogoUrl
  - AppMetadata
  - AppOptions
  - BinaryExtensionAttribute
  - BooleanExtensionAttribute
  - CountriesBlockedForMinors
  - CreatedOnBehalfOf
  - DateTimeExtensionAttribute
  - DisplayName
  - ExtensionAttributeDefinition
  - IntegerExtensionAttribute
  - KnownClientApplications
  - LargeIntegerExtensionAttribute
  - LegalAgeGroupRule
  - LocalizedAppBrandingElements
  - MainLogo
  - MsaAppId
  - ResourceApplicationSet
  - ServiceDiscoveryEndpoint
  - StringExtensionAttribute
  - TrustedCertificateSubject
  - WebApi
  - WebApp
  - WwwHomepage

### Update

- microsoft.directory/applications/allProperties/update
- microsoft.directory/applications.myOrganization/allProperties/update: Grants the same permissions as microsoft.directory/applications/allProperties/update, but only for single-tenant applications. 
- microsoft.directory/applications/audience/update: Grants access to all fields on the application registration authentication page. Grants access to the following properties on the application entity:
  - AvailableToOtherTenants
  - SignInAudience
- microsoft.directory/applications.myOrganization/audience/update: Grants the same permissions as microsoft.directory/applications/audience/update, but only for single-tenant applications.
- microsoft.directory/applications/authentication/update: Ability to update the reply URL, logout URL, implicit flow, and publisher domain properties on single-tenant and multi-tenant applications. Grants access to all fields on the application registration authentication page except supported account types. Grants access to the following properties on the application entity:
  - AcceptMappedClaims
  - AccessTokenAcceptedVersion
  - AddIns
  - GroupMembershipClaims
  - IsDeviceOnlyAuthSupported
  - OAuth2LegacyUrlPathMatching
  - OauthOidcResponsePolicyBitmap
  - OptionalClaims
  - OrgRestrictions
  - PublicClient
  - UseCustomTokenSigningKey
- microsoft.directory/applications.myOrganization/authentication/update: Grants the same permissions as microsoft.directory/applications/authentication/update, but only for single-tenant applications.
- microsoft.directory/applications/basic/update: Ability to update the name, logo, homepage URL, terms of service URL, and privacy statement URL properties on single-tenant and multi-tenant applications. Grants access to all fields on the application registration branding page. Grants access to the following properties on the application entity:
  - AllowActAsForAllClients
  - AllowPassthroughUsers
  - AppAddress
  - AppBrandingElements
  - AppCategory
  - AppData
  - AppId
  - AppInformationalUrl
  - ApplicationTag
  - AppLogoUrl
  - AppMetadata
  - AppOptions
  - BinaryExtensionAttribute
  - BooleanExtensionAttribute
  - CountriesBlockedForMinors
  - CreatedOnBehalfOf
  - DateTimeExtensionAttribute
  - DisplayName
  - ExtensionAttributeDefinition
  - IntegerExtensionAttribute
  - KnownClientApplications
  - LargeIntegerExtensionAttribute
  - LegalAgeGroupRule
  - LocalizedAppBrandingElements
  - MainLogo
  - MsaAppId
  - ResourceApplicationSet
  - ServiceDiscoveryEndpoint
  - StringExtensionAttribute
  - TrustedCertificateSubject
  - WebApi
  - WebApp
  - WwwHomepage
- microsoft.directory/applications.myOrganization/basic/update: Grants the same permissions as microsoft.directory/applications/basic/update, but only for single-tenant applications.
- microsoft.directory/applications/credentials/update: 
Ability to update the certificates and client secrets properties on single-tenant and multi-tenant applications. Grants access to all fields on the application registration certificates & secrets pageGrants access to the following properties on the application entity:
  - AsymmetricKey
  - EncryptedSecretKey
  - KeyDescription
  - SharedKeyReference
  - TokenEncryptionKeyId
- microsoft.directory/applications.myOrganization/credentials/update: Grants the same permissions as microsoft.directory/applications/credentials/update, but only for single-directory applications.
- microsoft.directory/applications/owners/update
Ability to update the owner property on single-tenant and multi-directory tenant. Grants access to all fields on the application registration owners page Grants access to the following properties on the application entity:
  - Owners
- microsoft.directory/applications.myOrganization/owners/update: Grants the same permissions as microsoft.directory/applications/owners/update, but only for single-tenant applications.
- microsoft.directory/applications/permissions/update: Ability to update the delegated permissions, application permissions, authorized client applications, required permissions, and grant consent properties on single-tenant and multi-tenant applications. Does not grant the ability to perform consent. Grants access to all fields on the application registration API permissions and Expose an API pages.Grants access to the following properties on the application entity:
  - AppIdentifierUri
  - Entitlement
  - PreAuthorizedApplications
  - RecordConsentConditions
  - RequiredResourceAccess
- microsoft.directory/applications.myOrganization/permissions/update: Grants the same permissions as microsoft.directory/applications/permissions/update, but only for single-tenant applications.

## Required license plan

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## Next steps

- Create custom roles using [the Azure portal, Azure AD PowerShell, and Graph API](roles-create-custom.md)
- [View the assignments for a custom role](roles-view-assignments.md)
- [Assign Azure AD custom roles in PowerShell](roles-assign-powershell.md)


























































## Single-tenant application permissions

Action | Permission | Documentation description
------ | ---------- | -------------------------
Delete | microsoft.directory/applications.myOrganization/delete | Ability to delete single-tenant applications.
Read | microsoft.directory/applications.myOrganization/allProperties/read | Ability to read all properties of single-tenant applications.
Read | microsoft.directory/applications.myOrganization/basic/read | Ability to read the name, application ID, logo, homepage URL, terms of service URL, privacy statement URL, and publisher domain properties of single-tenant applications.
Read | microsoft.directory/applications.myOrganization/owners/read | Ability to read owners property on single-tenant applications.
Update | microsoft.directory/applications.myOrganization/allProperties/update | Ability to update all properties. Update | microsoft.directory/applications.myOrganization/audience/update | Ability to update the supported account type property on single-tenant applications.
Update | microsoft.directory/applications.myOrganization/authentication/update | Ability to update the reply URL, logout URL, implicit flow, and publisher domain properties on single-tenant applications.
Update | microsoft.directory/applications.myOrganization/basic/update | Ability to update the name, logo, homepage URL, terms of service URL, and privacy statement URL properties on single-tenant applications.
Update | microsoft.directory/applications.myOrganization/credentials/update | Ability to update the certificates and client secrets properties on single-tenant applications. 
Update | microsoft.directory/applications.myOrganization/owners/update | Ability to update the owner property on single-tenant applications. Be aware this permission allows adding owners, and owners can promote single-tenant applications to multi-tenant applications.
Update | microsoft.directory/applications.myOrganization/permissions/update | Ability to update the delegated permissions, application permissions, authorized client applications, required permissions, and grant consent properties on single-tenant applications.

## Single- and multi-tenant application permissions

Action | Permission | Documentation description
------ | ----------- | -------------------------
Create |  microsoft.directory/applications/create |  Ability to create a new single-tenant or multi-tenant application. Creator is not added as the first owner, but creator can add owners during creation (API/CLI only). Be aware that an application creator is not restricted to 250 created objects, and could accidentally or maliciously consume organization-wide object quota.
Create |  microsoft.directory/applications/createAsOwner |  Ability to create a new single-tenant or multi-tenant application. The application creator is added as the first owner, and the created object counts against the creator's default user limit of 250 created objects.
Delete |  microsoft.directory/applications/delete |  Ability to delete single-tenant and multi-tenant applications
Read |  microsoft.directory/applications/allProperties/read |  Ability to read all properties of single-tenant and multi-tenant applications outside of sensitive properties like credentials.
Read |  microsoft.directory/applications/basic/read |  Ability to read the name, application ID, logo, homepage URL, terms of service URL, privacy statement URL, and publisher domain properties on single-tenant and multi-tenant applications.
Read |  microsoft.directory/applications/owners/read |  Ability to read owners property on single-tenant and multi-tenant applications.
Update |  microsoft.directory/applications/allProperties/update |  Ability to update all properties on single-tenant and multi-tenant applications.
Update |  microsoft.directory/applications/audience/update |  Ability to update the supported account type (signInAudience) property on single-tenant and multi-tenant applications.
Update |  microsoft.directory/applications/authentication/update |  Ability to update the reply URL, logout URL, implicit flow, and publisher domain properties on single-tenant and multi-tenant applications.
Update |  microsoft.directory/applications/basic/update |  Ability to update the name, logo, homepage URL, terms of service URL, and privacy statement URL properties on single-tenant and multi-tenant applications.
Update |  microsoft.directory/applications/credentials/update |  Ability to update the certificates and client secrets properties on single-tenant and multi-tenant applications.
Update |  microsoft.directory/applications/owners/update |  Ability to update the owner property on single-tenant and multi-tenant applications.
Update |  microsoft.directory/applications/permissions/update |  Ability to update the delegated permissions, application permissions, authorized client applications, required permissions, and grant consent properties on single-tenant and multi-tenant applications.

## Required license plan

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## Next steps

- Create custom roles using [the Azure portal, Azure AD PowerShell, and Graph API](roles-create-custom.md)
- [View the assignments for a custom role](roles-view-assignments.md)
- [Assign Azure AD custom roles in PowerShell](roles-assign-powershell.md)
