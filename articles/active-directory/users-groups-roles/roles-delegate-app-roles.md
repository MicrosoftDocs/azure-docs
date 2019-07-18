---
title: Delegate application administrator creation and management permissions - Azure Active Directory | Microsoft Docs
description: Application access management delegating roles to grant permissions rights in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 07/18/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
#As an Azure AD administrator, I want to reduce overusing the Global Administrator role by delegating app access management to lower-privilege roles.

ms.collection: M365-identity-device-management
---

# Delegate app registration permissions in Azure Active Directory

Azure Active Directory (Azure AD) allows you to delegate Application creation and management permissions in the following ways:

- [Restricting who can create applications](#restrict-who-can-create-applications) and manage the applications they create. By default in Azure AD, all users can register application registrations and manage all aspects of applications they create. This can be restricted to only allow selected people that permission.
- [Assigning one or more owners to an application](#assign-application-owners). This is a simple way to grant someone the ability to manage all aspects of Azure AD configuration for a specific application.
- [Assigning a built-in administrative role](#assign-built-in-application-admin-roles) that grants access to manage configuration in Azure AD for all applications. This is the recommended way to grant IT experts access to manage broad application configuration permissions without granting access to manage other parts of Azure AD not related to application configuration.
- [Creating a custom role](#create-and-assign-a-custom-role) defining very specific permissions and assigning it to someone either to the scope of a single application as a limited owner, or at the directory scope (all applications) as a limited administrator.

It's important to consider granting access using one of the above methods for two reasons. First, delegating the ability to perform administrative tasks reduces global administrator overhead. Second, using limited permissions improves your security posture and reduce the potential for unauthorized access. Delegation issues and general guidelines are discussed in [Delegate administration in Azure Active Directory](roles-concept-delegation.md).

## Restrict who can create applications

By default in Azure AD, all users can register application registrations and manage all aspects of applications they create. Everyone also has the ability to consent to apps accessing company data on their behalf. You can choose to selectively grant those permissions by setting the global switches to 'No' and adding the selected users to the Application Developer role.

### To disable the default ability to create application registrations or consent to applications

1. Sign in to your Azure AD organization with an account that eligible for the Global administrator role in your Azure AD organization.
1. When you have obtained sufficient permissions, set one or both of the following:
  - On the [User settings page for your organization](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/UserSettings), set the **Users can register applications** setting to No. This will disable the default ability for users to create application registrations.
  - On the [user settings for enterprise applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/UserSettings/menuId/), set the **Users can consent to applications accessing company data on their behalf** setting to No. This will disable the default ability for users to consent to applications accessing company data on their behalf.

### To allow select people to create and consent to applications when the default ability is disabled

Assign the Application developer role. The Application developer role grants the ability to create application registrations when the **Users can register applications** setting is set to No. This role also grants permission to consent on one's own behalf when the **Users can consent to apps accessing company data on their behalf** setting is set to No. As a system behavior, when a user creates a new application registration, they are automatically added as the first owner. Ownership permissions give the user the ability to manage all aspects of an application registration or enterprise application that they own.

## Assign application owners

Assigning owners is a simple way to grant the ability to manage all aspects of Azure AD configuration for a specific application registration or enterprise application. As a system behavior, when a user creates a new application registration they are automatically added as the first owner. Ownership permissions give the user the ability to manage all aspects of an application registration or enterprise application that they own. The original owner can be removed and additional owners can be added.

### Enterprise application owners

As an owner, a user can manage the organization-specific configuration of the enterprise application, such as the SSO configuration, provisioning, and user assignments. An owner can also add or remove other owners. Unlike Global Administrators, owners can manage only the enterprise applications they own.

In some cases, enterprise applications created from the application gallery include both an enterprise application and an application registration. When this is true, adding an owner to the enterprise application automatically adds the owner to the corresponding application registration as an owner.

### To assign an owner to an enterprise application

1. Sign in to [your Azure AD organization](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that eligible for the Application administrator or Cloud application administrator for the organization.
1. On the [App registrations page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/) for the organization, select an app to open the Overview page for the app.
1. Select **Owners** to see the list of the owners for the app.
1. Select **Add** to select one or more owners to add to the app.

> [!IMPORTANT]
> Users and service principals can be owners of application registrations. Only users can be owners of enterprise applications. Groups cannot be assigned as owners of either.
>
> Owners can add credentials to an application and use those credentials to impersonate the application’s identity. The application may have more permissions than the owner, and thus would be an elevation of privilege over what the owner has access to as a user or service principal. An application owner could potentially create or update users or other objects while impersonating the application, depending on the application's permissions.

## Assign built-in application admin roles

Azure AD has a set of built-in admin roles for granting access to manage configuration in Azure AD for all applications. These roles are the recommended way to grant IT experts access to manage broad application configuration permissions without granting access to manage other parts of Azure AD not related to application configuration.

- Application Administrator: Users in this role can create and manage all aspects of enterprise applications, application registrations, and application proxy settings. This role also grants the ability to consent to delegated permissions, and application permissions excluding Microsoft Graph and Azure AD Graph. Users assigned to this role are not added as owners when creating new application registrations or enterprise applications.
- Cloud Application Administrator: Users in this role have the same permissions as the Application Administrator role, excluding the ability to manage application proxy. Users assigned to this role are not added as owners when creating new application registrations or enterprise applications.

You can view the description for these roles in [Available roles](directory-assign-admin-roles.md#available-roles).

Follow the instructions in the [Assign roles to users with Azure Active Directory](../fundamentals/active-directory-users-assign-role-azure-portal.md) how-to guide to assign the Application Administrator or Cloud Application Administrator roles.

> [!IMPORTANT]
> Application Administrators and Cloud Application Administrators can add credentials to an application and use those credentials to impersonate the application’s identity. The application may have more permissions than the role member, thus an elevation of privilege over what the role member has access to do. a role member could potentially create or update users or other objects while impersonating the application, depending on the application's permissions.
> Neither role grants the ability to manage Conditional Access settings.

## Create and assign a custom role

Creating and assigning custom roles is a two-step process. First, you create a custom *role definition* and add permissions to it from a preset list. These are the same permissions used in the built-in roles. Once you’ve created your role definition, you assign it to someone by creating a *role assignment*. This two-step process allows you to create one role definition and assign it many times at different *scopes*. A custom role can be assigned at directory-wide scope, or it can be assigned at the scope if a single Azure AD object. An example of an object scope is a single app registration. This way the same role definition can be assigned to Sally over all app registrations in the directory and then Naveen over just the Contoso Expense Reports app registration.

See the custom roles overview for more information on the basics of custom roles, as well as how to create a custom role and how to assign a role.

### Application registration subtypes and permissions

See the custom roles overview for an explanation of what the terms subtype, permission, and property set mean. The below information is specific to application registrations.

#### Subtypes

There is one app registration subtype - applications.myOrganization. For example, microsoft.directory/applications.myOrganization/basic/update. This subtype restricts the permission to app registrations that are marked as only accessible by accounts in your organization. This is Set on the **Authentication** page for a specific app registration, and corresponds to setting the signInAudience property to "AzureADMyOrg" using Graph API or PowerShell.

This subtype allows you to grant permissions to read or manage internal application without granting the ability to read or manage applications accessible by accounts in other organizations.  There are applications.myOrganization versions of all read and update permissions as well as the delete permission. There is no  applications.myOrganization version of create at this time. Standard permissions (for example, microsoft.directory/applications/basic/update) grant read or management of all app registration types.

Details for the following permissions are listed in [Available custom role permissions in Azure Active Directory](roles-custom-available-permissions.md).

#### Create and delete

There are two permissions available for granting the ability to create app registrations:

- microsoft.directory/applications/createAsOwner
- microsoft.directory/applications/create

If both permissions are assigned, the create permission will take precedence. Though the createAsOwner permission does not automatically add the creator as the first owner, owners can be specified during the creation of the app registration when using Graph APIs or PowerShell cmdlets.

Create permissions grant access to the **New registration** command.

There are two permissions available for granting the ability to delete app registrations:

- microsoft.directory/applications/delete: Grants the ability to delete app registrations regardless of subtype.
- microsoft.directory/applications.myOrganization/delete: Grants the ability to delete only app registrations that are only accessible by accounts in your organization (myOrganization app registrations).

> [!NOTE]
> When assigning a role that contains create permissions, the role assignment must be made at the directory scope. A create permission assigned at a resource scope does not grant the ability to create app registrations.

#### Read

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

#### Update

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

## Next steps

- [Azure AD administrator role reference](directory-assign-admin-roles.md)
