---

title: Azure Active Directory (Azure AD) audit activity reference | Microsoft Docs
description: Get an overview of the audit activities that can be logged in your audit logs in Azure Active Directory (Azure AD).
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/29/2022
ms.author: sarahlipsey
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---
# Azure AD audit activity reference

Azure Active Directory (Azure AD) audit logs collect all traceable activities within your Azure AD tenant. Audit logs can be used to determine who made a change to service, user, group, or other item.

This article provides a comprehensive list of the audit categories and their related activities. Use the "In this article" section to jump to a specific audit category. 

Audit log activities and categories change periodically. The tables are updated regularly, but may not be in sync with what is available in Azure AD. Please provide us feedback if you think there is a missing audit category or activity.

## Access reviews

With [Azure AD Identity Governance access reviews](../governance/manage-user-access-with-access-reviews.md), you can ensure users have the appropriate access. Access review audit logs can tell you who initiated or ended an access review. These logs can also tell you if any access review settings were changed.

|Audit Category|Activity|
|---|---|
|DirectoryManagement|Create program|
|DirectoryManagement|Link program control|
|DirectoryManagement|Unlink program control|
|Policy|Access review ended|
|Policy|Apply decision|
|Policy|Approve decision|
|Policy|Bulk Approve decisions|
|Policy|Bulk Deny decisions|
|Policy|Bulk Reset decisions|
|Policy|Bulk mark decisions as don't know|
|Policy|Cancel request|
|Policy|Create access review|
|Policy|Create request|
|Policy|Delete access review|
|Policy|Delete approvals|
|Policy|Deny decision|
|Policy|Don't know decision|
|Policy|Request expired|
|Policy|Reset decision|
|Policy|Update access review|
|Policy|Update partner directory settings|
|Policy|Update request|
|UserManagement|Apply review|
|UserManagement|Approve all requests in business flow|
|UserManagement|Auto review|
|UserManagement|Auto apply review|
|UserManagement|Create business flow|
|UserManagement|Create governance policy template|
|UserManagement|Delete access review|
|UserManagement|Delete business flow|
|UserManagement|Delete governance policy template|
|UserManagement|Deny all decisions|
|UserManagement|Deny all requests in business flow|
|UserManagement|Request approved|
|UserManagement|Request denied|
|UserManagement|Update business flow|
|UserManagement|Update governance policy template|

## Account provisioning

Each time an account is provisioned in your Azure AD tenant, a log for that account is captured. Automated provisioning, such as with [Azure AD Connect cloud sync](../cloud-sync/what-is-cloud-sync.md), will be found in this log. The Account provisioning service only has one audit category.

|Audit Category|Activity|
|---|---|
|ProvisioningManagement|Add provisioning configuration|
|ProvisioningManagement|Delete provisioning configuration|
|ProvisioningManagement|Disable/pause provisioning configuration|
|ProvisioningManagement|Enable/restart provisioning configuration|
|ProvisioningManagement|Enable/start provisioning configuration|
|ProvisioningManagement|Export|
|ProvisioningManagement|Import|
|ProvisioningManagement|Other|
|ProvisioningManagement|Process escrow|
|ProvisioningManagement|Quarantine|
|ProvisioningManagement|Synchronization rule action|
|ProvisioningManagement|Update attribute mappings or scope|
|ProvisioningManagement|Update provisioning setting or credentials|
|ProvisioningManagement|User Provisioning|

## Application proxy

If you're utilizing [Application Proxy](../app-proxy/what-is-application-proxy.md) to provide your users with remote access to internal apps, the Application Proxy audit logs can help you keep track of changes to available applications or [Connector groups](../app-proxy/application-proxy-connector-groups.md).

|Audit Category|Activity|
|---|---|
|Application Management|Add application|
|Application Management|Delete application|
|Application Management|Update application|
|Authentication|Add a group to feature rollout|
|Authentication|Create rollout policy for feature|
|Authentication|Delete rollout policy of feature|
|Authentication|Remove a group from feature rollout|
|Authentication|Remove user from feature rollout|
|Authentication|Update rollout policy of feature|
|DirectoryManagement|Disable Desktop Sso|
|DirectoryManagement|Disable Desktop Sso for a specific domain|
|DirectoryManagement|Disable application proxy|
|DirectoryManagement|Disable passthrough authentication|
|DirectoryManagement|Enable Desktop Sso|
|DirectoryManagement|Enable Desktop Sso for a specific domain|
|DirectoryManagement|Enable application proxy|
|DirectoryManagement|Enable passthrough authentication
|ResourceManagement|Add connector Group|
|ResourceManagement|Add a Connector to Connector Group|
|ResourceManagement|Add application SSL certificate|
|ResourceManagement|Delete Connector Group|
|ResourceManagement|Delete SSL binding|
|ResourceManagement|Register connector|
|ResourceManagement|Update Connector Group|

## Authentication Methods

The Audit logs for Authentication Methods can be used to make sure that your users have registered their mobile device properly to enable multi-factor authentication (MFA).

|Audit Category|Activity|
|---|---|
|ApplicationManagement|Assign Hardware Oath Token|
|ApplicationManagement|Authentication Methods Policy Reset|
|ApplicationManagement|Authentication Methods Policy Update|
|ApplicationManagement|Authentication Strength Combination Configuration Create |
|ApplicationManagement|Authentication Strength Combination Configuration Delete|
|ApplicationManagement|Authentication Strength Combination Configuration Update|
|ApplicationManagement|Authentication Strength Policy Create|
|ApplicationManagement|Authentication Strength Policy Delete|
|ApplicationManagement|Authentication Strength Policy Update|
|ApplicationManagement|Bulk upload Hardware Oath Token|
|ApplicationManagement|Create Hardware Oath Token|
|ApplicationManagement|DELETE Subscription.DeleteProviders|
|ApplicationManagement|DELETE Tenant.DeleteAgentStatuses|
|ApplicationManagement|DELETE Tenant.DeleteCaches|
|ApplicationManagement|DELETE Tenant.DeleteGreetings|
|ApplicationManagement|Delete Hardware Oath Token|
|ApplicationManagement|PATCH Tenant.Patch|
|ApplicationManagement|PATCH Tenant.PatchCaches|
|ApplicationManagement|PATCH UserAuthMethod.PatchSignInPreferencesAsync|
|ApplicationManagement|POST SoundFile.Post|
|ApplicationManagement|Subscription.CreateProvider|
|ApplicationManagement|Subscription.CreateSubscription|
|ApplicationManagement|POST Tenant.CreateBlockedUser|
|ApplicationManagement|POST Tenant.CreateBypassedUser|
|ApplicationManagement|POST Tenant.CreateCacheConfig|
|ApplicationManagement|POST Tenant.CreateGreeting|
|ApplicationManagement|POST Tenant.CreateOemTenant|
|ApplicationManagement|POST Tenant.CreateTenant|
|ApplicationManagement|POST Tenant.GenerateNewActivationCredentials|
|ApplicationManagement|POST Tenant.RemoveBlockedUser|
|ApplicationManagement|POST Tenant.RemoveBypassedUser|
|ApplicationManagement|Update Hardware Oath Token|
|UserManagement|User deleted security info|
|UserManagement|User registered security info|
|UserManagement|User updated security info|
|UserManagement|Admin deleted security info|
|UserManagement|Admin registered security info|
|UserManagement|Admin started password reset|
|UserManagement|Admin updated security info|
|UserManagement|User cancelled security info registration|
|UserManagement|User changed default security info|
|UserManagement|User deleted security info|
|UserManagement|User registered all required security info|
|UserManagement|User registered security info|
|UserManagement|User reviewed security info|
|UserManagement|User started password change|
|UserManagement|user started password reset|
|UserManagement|User started security info registration|

## Azure AD Recommendations

[Azure AD Recommendations](overview-recommendations.md) monitors your Azure AD tenant and provides personalized insights and actionable guidance to implement best practices for Azure AD features and optimize your tenant configurations. These logs provide a history of the changes made to the status of a recommendation.

|Audit Category|Activity|
|---|---|
|DirectoryManagement|Dismiss recommendation|
|DirectoryManagement|Mark recommendation as complete|
|DirectoryManagement|Postpone recommendation|

## Azure MFA

The Azure MFA audit logs can help you track trends in suspicious activity or when fraud was reported. Use the [Azure AD sign-in logs](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/SignIns) to see each time a user signs in when MFA is required.

|Audit Category|Activity|
|---|---|
|UserManagement|Fraud reported - no action taken|
|UserManagement|Fraud reported - user is blocked for MFA|
|UserManagement|Suspicious activity reported|
|UserManagement|User registered security info|

## B2C

The largest set of audit logs are related to [B2C](../../active-directory-b2c/overview.md), due to the number of connected resources and potential external accounts. Audit categories include ApplicationManagement, Authentication, Authorization, DirectoryManagement, IdentityProtection, KeyManagement, PolicyManagement, and ResourceManagement. Logs related to one-time passwords are found in the Other category.

|Audit Category|Activity|
|---|---|
|ApplicationManagement|Add V2 application permissions|
|ApplicationManagement|Create V2 application|
|ApplicationManagement|Delete V2 application|
|ApplicationManagement|Delete V2 application permission grant|
|ApplicationManagement|Get V1 and V2 applications|
|ApplicationManagement|Get V1 application|
|ApplicationManagement|Get V1 applications|
|ApplicationManagement|Get V2 application|
|ApplicationManagement|Get V2 applications|
|ApplicationManagement|Retrieve V2 application permissions grants|
|ApplicationManagement|Retrieve V2 application service principals|
|ApplicationManagement|Update V2 application|
|ApplicationManagement|Update V2 application permission grant|
|Authentication|A self-service sign up request was completed|
|Authentication|An API was called as part of a user flow|
|Authentication|Delete all available strong authentication devices|
|Authentication|Evaluate conditional access policies|
|Authentication|Exchange token|
|Authentication|Federate with an identity provider|
|Authentication|Get available strong authentication devices|
|Authentication|Issue a SAML assertion to the application|
|Authentication|Issue an access token to the application|
|Authentication|Issue an authorization code to the application|
|Authentication|Issue an id_token to the application|
|Authentication|Make phone call to verify phone number|
|Authentication|Register TOTP secret|
|Authentication|Remediate user|
|Authentication|Send SMS to verify phone number|
|Authentication|Send verification email|
|Authentication|Validate Client Credentials|
|Authentication|Validate local account credentials|
|Authentication|Validate user authentication|
|Authentication|Verify email address|
|Authentication|verify one time password|
|Authentication|Verify phone number|
|Authorization|Add v2 application permissions|
|Authorization|Check whether the resource name is available|
|Authorization|Create Api connector|
|Authorization|Create Identity Provider|
|Authorization|Create authenticationEventListener|
|Authorization|Create authenticationEventsFlow|
|Authorization|Create custom identity provider|
|Authorization|Create custom policy|
|Authorization|Create customAuthenticationExtension|
|Authorization|Create identity provider|
|Authorization|Create or update a B2C directory resource|
|Authorization|Create or update a B2C directory tenant and resource|
|Authorization|Create or update a CIAM directory tenant and resource|
|Authorization|Create or update a Guest Usages resource|
|Authorization|Create or update localized resource|
|Authorization|Create policy key|
|Authorization|Create starter pack|
|Authorization|Create user attribute|
|Authorization|Create user flow|
|Authorization|Create v2 application|
|Authorization|Delete Api connector|
|Authorization|Delete B2C Tenant where the caller is an administrator|
|Authorization|Delete B2C directory resource|
|Authorization|Delete CIAM directory resource|
|Authorization|Delete Guest Usages resource|
|Authorization|Delete Identity Provider|
|Authorization|Delete authenticationEventlistener|
|Authorization|Delete authenticationEventsFlow|
|Authorization|Delete custom policy|
|Authorization|Delete customAuthenticationExtension|
|Authorization|Delete identity provider|
|Authorization|Delete localized resource|
|Authorization|Delete policy key|
|Authorization|Delete user attribute|
|Authorization|Delete user flow|
|Authorization|Delete v2 application|
|Authorization|Delete v2 application permission grant|
|Authorization|Generate key|
|Authorization|Get Api connector|
|Authorization|Get Api connectors|
|Authorization|Get B2C Tenants where the caller is an administrator|
|Authorization|Get B2C directory resource|
|Authorization|Get B2C directory resources in a resource group|
|Authorization|Get B2C directory resources in a subscription|
|Authorization|Get CIAM directory resource|
|Authorization|Get CIAM directory resources in a resource group|
|Authorization|Get CIAM directory resources in a subscription|
|Authorization|Get Guest Usages resources|
|Authorization|Get Guest Usages resources in a subscription|
|Authorization|Get Identity Provider|
|Authorization|Get Identity Providers|
|Authorization|Get OnAttributeCollectionStartCustomExtension|
|Authorization|Get OnAttributeCollectionSubmitCustomExtension|
|Authorization|Get OnPageRenderStartCustomExtension|
|Authorization|Get active key metadata from policy key|
|Authorization|Get age gating configuration|
|Authorization|Get authentication flows policy|
|Authorization|Get authenticationEventListener|
|Authorization|Get authenticationEventsFlow|
|Authorization|Get authenticationEventsFlows|
|Authorization|Get available output claims|
|Authorization|Get configured custom identity providers|
|Authorization|Get configured identity providers|
|Authorization|Get configured local identity providers|
|Authorization|Get custom domains|
|Authorization|Get custom identity provider|
|Authorization|Get custom policies|
|Authorization|Get custom policy|
|Authorization|Get custom policy metadata|
|Authorization|Get customAuthenticationExtension|
|Authorization|Get customAuthenticationExtensions
|Authorization|Get identity provider|
|Authorization|Get identity provider types|
|Authorization|Get identity providers|
|Authorization|Get list of tenants|
|Authorization|Get localized resource|
|Authorization|Get operation status for an async operation|
|Authorization|Get operations of Microsoft.AzureActiveDirectory resource provider|
|Authorization|Get policy key|
|Authorization|Get policy keys|
|Authorization|Get resource properties of a tenant|
|Authorization|Get supported cultures|
|Authorization|Get supported identity providers|
|Authorization|Get supported page contracts|
|Authorization|Get tenant details|
|Authorization|Get tenant domains|
|Authorization|Get the authenticationEventsPolicy|
|Authorization|Get user attribute|
|Authorization|Get user attributes|
|Authorization|Get user flow|
|Authorization|Get user flows|
|Authorization|Get v1 and v2 applications|
|Authorization|Get v1 application|
|Authorization|Get v1 applications|
|Authorization|Get v2 application|
|Authorization|Get v2 applications|
|Authorization|Initialize tenant|
|Authorization|Move resources|
|Authorization|Restore policy key|
|Authorization|Retrieve v2 application permissions grants|
|Authorization|Retrieve v2 application service principals|
|Authorization|Update Api connector|
|Authorization|Update Identity Provider|
|Authorization|Update OnAttributeCollectionStartCustomExtension|
|Authorization|Update OnAttributeCollectionSubmitCustomExtension|
|Authorization|Update OnPageRenderStartCustomExtension|
|Authorization|Update a B2C directory resource|
|Authorization|Update a CIAM directory resource|
|Authorization|Update a Guest Usages resource|
|Authorization|Update age gating configuration|
|Authorization|Update authentication flows policy
|Authorization|Update authenticationEventListener|
|Authorization|Update authenticationEventsFlow|
|Authorization|Update authenticationEventsPolicy|
|Authorization|Update custom identity provider|
|Authorization|Update custom policy|
|Authorization|Update customAuthenticationExtension|
|Authorization|Update identity provider|
|Authorization|Update local identity provider|
|Authorization|Update policy key|
|Authorization|Update subscription status|
|Authorization|Update user attribute|
|Authorization|Update user flow|
|Authorization|Update v2 application|
|Authorization|Update v2 application permission grant|
|Authorization|Upload certificate to policy key|
|Authorization|Upload key to policy key|
|Authorization|Upload secret into policy key|
|Authorization|Validate customExtension authenticationConfiguration|
|Authorization|Validate move resources|
|Directory Management|Get age gating configuration|
|Directory Management|Get custom domains|
|Directory Management|Get list of tenants|
|Directory Management|Get resources properties of a tenant|
|Directory Management|Get tenant details|
|Directory Management|Get tenant domains|
|Directory Management|Initialize tenant|
|Directory Management|Update age gating configuration|
|IdentityProtection|Evaluate conditional access policies|
|IdentityProtection|Remediate user|
|KeyManagement|Create policy key|
|KeyManagement|Delete policy key|
|KeyManagement|Get active key metadata from policy key|
|KeyManagement|Get policy key|
|KeyManagement|Get policy keys|
|KeyManagement|Restore policy key|
|KeyManagement|Upload key to policy key|
|KeyManagement|Upload secret into policy key|
|Other|Generate one time password|
|Other|Verify one time password|
|PolicyManagement|Create authenticationEventListener|
|PolicyManagement|Create authenticationEventsFlow|
|PolicyManagement|Create customAuthenticationExtension|
|PolicyManagement|Delete authenticationEventListener|
|PolicyManagement|Delete authenticationEventsFlow|
|PolicyManagement|Delete customAuthenticationExtension|
|PolicyManagement|Get OnAttributeCollectionStartCustomExtension|
|PolicyManagement|Get OnAttributeCollectionSubmitCustomExtension|
|PolicyManagement|Get OnPageRenderStartCustomExtension|
|PolicyManagement|Get authenticationEventListener|
|PolicyManagement|Get authenticationEventListeners|
|PolicyManagement|Get authenticationEventsFlow|
|PolicyManagement|Get authenticationEventsFlows|
|PolicyManagement|Get customAuthenticationExtension|
|PolicyManagement|Get customAuthenticationExtensions|
|PolicyManagement|Get the authenticationEventsPolicy|
|PolicyManagement|Update OnAttributeCollectionStartCustomExtension|
|PolicyManagement|Update OnAttributeCollectionSubmitCustomExtension|
|PolicyManagement|Update OnPageRenderStartCustomExtension|
|PolicyManagement|Update authenticationEventListener|
|PolicyManagement|Update authenticationEventsFlow|
|PolicyManagement|Update authenticationEventsPolicy|
|PolicyManagement|Update customAuthenticationExtension|
|PolicyManagement|Validate customExtension authenticationConfiguration|
|ResourceManagement|Check whether the resource name is available|
|ResourceManagement|Create Api connector|
|ResourceManagement|Create Identity Provider|
|ResourceManagement|Create custom identity provider|
|ResourceManagement|Create custom policy|
|ResourceManagement|Create identity provider|
|ResourceManagement|Create or update a B2C directory resource|
|ResourceManagement|Create or update a B2C directory tenant and resource|
|ResourceManagement|Create or update a CIAM directory tenant and resource|
|ResourceManagement|Create or update a Guest Usages resources|
|ResourceManagement|Create or update a localized resource|
|ResourceManagement|Create policy key|
|ResourceManagement|Create user attribute|
|ResourceManagement|Create user flow|
|ResourceManagement|Delete Api connector|
|ResourceManagement|Delete B2C Tenant where the caller is an administrator|
|ResourceManagement|Delete B2C directory resource|
|ResourceManagement|Delete CIAM directory resource|
|ResourceManagement|Delete Guest Usages resource|
|ResourceManagement|Delete Identity Provider|
|ResourceManagement|Delete custom policy|
|ResourceManagement|Delete identity provider|
|ResourceManagement|Delete localized resource|
|ResourceManagement|Delete policy key|
|ResourceManagement|Delete user attribute|
|ResourceManagement|Delete user flow|
|ResourceManagement|Generate key|
|ResourceManagement|Get Api connector|
|ResourceManagement|Get Api connectors|
|ResourceManagement|Get B2C Tenant where the caller is an administrator|
|ResourceManagement|Get B2C directory resource|
|ResourceManagement|Get B2C directory resources in a resource group|
|ResourceManagement|Get B2C directory resources in a subscription|
|ResourceManagement|Get CIAM directory resource|
|ResourceManagement|Get CIAM directory resources in a resource group|
|ResourceManagement|Get CIAM directory resources in a subscription|
|ResourceManagement|Get Guest Usages resource|
|ResourceManagement|Get Guest Usages directory resources in a resource group|
|ResourceManagement|Get Guest Usages directory resources in a subscription|
|ResourceManagement|Get Identity Provider|
|ResourceManagement|Get Identity Providers|
|ResourceManagement|Get active key metadata from policy key|
|ResourceManagement|Get authentication flows policy|
|ResourceManagement|Get available output claims|
|ResourceManagement|Get configured custom identity providers|
|ResourceManagement|Get configured identity providers|
|ResourceManagement|Get configured local identity providers|
|ResourceManagement|Get custom identity provider|
|ResourceManagement|Get custom policies|
|ResourceManagement|Get custom policy|
|ResourceManagement|Get custom policy metadata|
|ResourceManagement|Get identity provider|
|ResourceManagement|Get identity provider types|
|ResourceManagement|Get identity providers|
|ResourceManagement|Get localized resource|
|ResourceManagement|Get operation status of an async operation|
|ResourceManagement|Get operations of Microsoft.AzureActiveDirectory resource provider|
|ResourceManagement|Get policy key|
|ResourceManagement|Get policy keys|
|ResourceManagement|Get supported cultures|
|ResourceManagement|Get supported identity providers|
|ResourceManagement|Get supported page contracts|
|ResourceManagement|Get user attribute|
|ResourceManagement|Get user attributes|
|ResourceManagement|Get user flow|
|ResourceManagement|Get user flows|
|ResourceManagement|Move resources|
|ResourceManagement|Update Api connector|
|ResourceManagement|Identity Provider|
|ResourceManagement|Update B2C directory resource|
|ResourceManagement|Update CIAM directory resource|
|ResourceManagement|Update Guest Usages resource|
|ResourceManagement|Update authentication flows policy|
|ResourceManagement|Update custom identity provider|
|ResourceManagement|Update custom policy|
|ResourceManagement|Update identity provider|
|ResourceManagement|Update local identity provider|
|ResourceManagement|Update policy key|
|ResourceManagement|Update subscription status|
|ResourceManagement|Update user attribute|
|ResourceManagement|Update user flow|
|ResourceManagement|Update certificate to policy key|
|ResourceManagement|Update secret into policy key|
|ResourceManagement|Validate move resources|

## Conditional Access

|Audit Category|Activity|
|---|---|
|Policy|Add AuthenticationContextClassReference|
|Policy|Add conditional access policy|
|Policy|Add named location|
|Policy|Delete AuthenticationContextClassReference|
|Policy|Delete conditional access policy|
|Policy|Delete named location|
|Policy|Update AuthenticationContextClassReference|
|Policy|Update conditional access policy|
|Policy|Update continuous access evaluation|
|Policy|Update named location|
|Policy|Update security defaults|

## Core directory

|Audit Category|Activity|
|---|---|
|AdministrativeUnit|Add administrative unit|
|AdministrativeUnit|Add member to administrative unit|
|AdministrativeUnit|Add member to restricted management administrative unit|
|AdministrativeUnit|Delete administrative unit|
|AdministrativeUnit|Hard Delete administrative unit|
|AdministrativeUnit|Remove member from administrative unit|
|AdministrativeUnit|Remove member from restricted management administrative unit|
|AdministrativeUnit|Restore administrative unit|
|AdministrativeUnit|Update administrative unit|
|Agreement|Add agreement|
|Agreement|Delete agreement|
|Agreement|Hard delete agreement|
|Agreement|Update agreement|
|ApplicationManagement|Add a deletion-marked app role assignment grant to service principal as part of link removal|
|ApplicationManagement|Add app role assignment to service principal|
|ApplicationManagement|Add application|
|ApplicationManagement|Add delegated permission grant|
|ApplicationManagement|Add owner to application|
|ApplicationManagement|Add owner to service principal|
|ApplicationManagement|Add policy to application|
|ApplicationManagement|Add policy to service principal|
|ApplicationManagement|Add service principal|
|ApplicationManagement|Add service principal credentials|
|ApplicationManagement|Cancel application update with safe rollout|
|ApplicationManagement|Complete application update after safe rollout|
|ApplicationManagement|Consent to application|
|ApplicationManagement|Delete application|
|ApplicationManagement|Hard Delete application|
|ApplicationManagement|Hard delete service principal|
|ApplicationManagement|Remove app role assignment from service principal|
|ApplicationManagement|Remove delegated permission grant|
|ApplicationManagement|Remove owner from application|
|ApplicationManagement|Remove owner from service principal|
|ApplicationManagement|Remove policy from application|
|ApplicationManagement|Remove policy from service principal|
|ApplicationManagement|Remove service principal|
|ApplicationManagement|Remove service principal credentials|
|ApplicationManagement|Restore application|
|ApplicationManagement|Restore service principal|
|ApplicationManagement|Restore consent|
|ApplicationManagement|Set verified publisher|
|ApplicationManagement|Unset verified publisher|
|ApplicationManagement|Update application|
|ApplicationManagement|Update application with safe rollout|
|ApplicationManagement|Update application - Certificates and secrets management|
|ApplicationManagement|Update external secrets|
|ApplicationManagement|Update service principal|
|AttributeManagement|Add an attribute set|
|AttributeManagement|Add custom security attribute definition in an attribute set|
|AttributeManagement|Update an attribute set|
|AttributeManagement|Update attribute values assigned to a servicePrincipal|
|AttributeManagement|Update attribute values assigned to a user|
|AttributeManagement|Update custom security attribute definition in an attribute set|
|AuthorizationPolicy|Update authorization policy|
|CertificateBasedAuthConfiguration|Add CertificationBasedAuthConfiguration|
|CertificateBasedAuthConfiguration|Delete CertificationBasedAuthConfiguration|
|Contact|Add contact|
|Contact|Delete contact|
|Contact|Update contact|
|CrossTenantAccessSettings|Add a partner to cross-tenant access setting|
|CrossTenantAccessSettings|Delete partner specific cross-tenant access setting|
|CrossTenantAccessSettings|Migrated partner cross-tenant access settings to the scalable model|
|CrossTenantAccessSettings|Reset the cross-tenant access default setting|
|CrossTenantAccessSettings|Update a partner cross-tenant access setting|
|CrossTenantIdentitySyncSettings|Update the company default cross-tenant access setting|
|CrossTenantIdentitySyncSettings|Create a partner cross-tenant identity sync setting|
|CrossTenantIdentitySyncSettings|Delete a partner cross-tenant identity sync setting|
|CrossTenantIdentitySyncSettings|Update a partner cross-tenant identity sync setting|
|Device|Add device|
|Device|Add registered owner to device|
|Device|Add registered users to device|
|Device|Delete device|
|Device|Device no longer compliant|
|Device|Device no longer managed|
|Device|Remove registered owner from device|
|Device|Remove registered users from device|
|Device|Update device|
|DeviceConfiguration|Add device configuration|
|DeviceConfiguration|Delete device configuration|
|DeviceConfiguration|Update device configuration|
|DeviceTemplate|Add device from DeviceTemplate|
|DeviceTemplate|Delete DeviceTemplate|
|DeviceTemplate|Update DeviceTemplate|
|DirectoryManagement|Add partner to company|
|DirectoryManagement|Add sharedEmailDomainInvitation|
|DirectoryManagement|Add unverified domain|
|DirectoryManagement|Add verified domain|
|DirectoryManagement|Create Company|
|DirectoryManagement|Create company|
|DirectoryManagement|Create company settings|
|DirectoryManagement|Delete company allowed data location|
|DirectoryManagement|Delete company settings|
|DirectoryManagement|Delete subscription|
|DirectoryManagement|Demote partner|
|DirectoryManagement|Directory deleted|
|DirectoryManagement|Directory deleted permanently|
|DirectoryManagement|Directory scheduled for deletion (Lifecycle)|
|DirectoryManagement|Directory scheduled for deletion (UserRequest)|
|DirectoryManagement|Get cross-cloud verification code for domain|
|DirectoryManagement|Promote company to partner|
|DirectoryManagement|Promote sub domain to root domain|
|DirectoryManagement|Remove partner from company|
|DirectoryManagement|Remove unverified domain|
|DirectoryManagement|Remove verified domain|
|DirectoryManagement|Schedule Add sharedEmailDomain|
|DirectoryManagement|Schedule Remove sharedEmailDomain|
|DirectoryManagement|Set Company Information|
|DirectoryManagement|Set DirSync feature|
|DirectoryManagement|Set DirSyncEnabled flag|
|DirectoryManagement|Set Partnership|
|DirectoryManagement|Set accidental deletion threshold|
|DirectoryManagement|Set company allowed data location|
|DirectoryManagement|Set company multinational feature enabled|
|DirectoryManagement|Set directory feature on tenant|
|DirectoryManagement|Set domain authentication|
|DirectoryManagement|Set federation settings on domain|
|DirectoryManagement|Set password policy|
|DirectoryManagement|Update company|
|DirectoryManagement|Update company settings|
|DirectoryManagement|Update domain|
|DirectoryManagement|Update sharedEmailDomain|
|DirectoryManagement|Update sharedEmailDomainInvitation|
|DirectoryManagement|Verify domain|
|DirectoryManagement|Verify email verified domain|
|ExternalUserProfile|Create ExternalUserProfile|
|ExternalUserProfile|Delete ExternalUserProfile|
|ExternalUserProfile|Hard Delete ExternalUserProfile|
|ExternalUserProfile|Restore ExternalUserProfile|
|ExternalUserProfile|Update ExternalUserProfile|
|GroupManagement|Add a deletion-marked app role assignment grant to group as part of link removal|
|GroupManagement|Add app role assignment to group|
|GroupManagement|Add group|
|GroupManagement|Add member to group|
|GroupManagement|Add owner to group|
|GroupManagement|Assign label to group|
|GroupManagement|Create group settings|
|GroupManagement|Delete group|
|GroupManagement|Delete group settings|
|GroupManagement|Finish applying group based license to user|
|GroupManagement|Grant contextual consent to application|
|GroupManagement|Hard Delete group|
|GroupManagement|Remove app role assignment from group|
|GroupManagement|Remove label from group|
|GroupManagement|Remove member from group|
|GroupManagement|Remove owner from group|
|GroupManagement|Restore group|
|GroupManagement|Set group license|
|GroupManagement|Set group to be managed by user|
|GroupManagement|Start applying group based license to users|
|GroupManagement|Trigger group license recalculation|
|GroupManagement|Update group|
|GroupManagement|Update group settings|
|KerberosDomain|Add kerberos domain|
|KerberosDomain|Delete kerberos domain|
|KerberosDomain|Restore kerberos domain|
|KerberosDomain|Update kerberos domain|
|Label|Add label|
|Label|Delete label|
|Label|Update label|
|PendingExternalUserProfile|Create PendingExternalUserProfile|
|PendingExternalUserProfile|Delete PendingExternalUserProfile|
|PendingExternalUserProfile|Hard Delete PendingExternalUserProfile|
|PendingExternalUserProfile|Update PendingExternalUserProfile|
|PermissionGrantPolicy|Add permission grant policy|
|PermissionGrantPolicy|Delete permission grant policy|
|PermissionGrantPolicy|Update permission grant policy|
|Policy|Add owner to policy|
|Policy|Add policy|
|Policy|Delete policy|
|Policy|Remove owner from policy|
|Policy|Remove policy credentials|
|Policy|Update policy|
|PrivateEndpoint|Add PrivateEndpoint|
|PrivateEndpoint|Delete PrivateEndpoint|
|PrivateLinkResource|Add PrivateLinkResource|
|PrivateLinkResource|Delete PrivateLinkResource|
|PrivateLinkResource|Update PrivateLinkResource|
|RoleManagement|Add EligibleRoleAssignment to RoleDefinition|
|RoleManagement|Add eligible member to role|
|RoleManagement|Add member to role|
|RoleManagement|Add member to role scoped over Restricted Management Administrative Unit|
|RoleManagement|Add role assignment to role definition|
|RoleManagement|Add role definition|
|RoleManagement|Add role from template|
|RoleManagement|Add scoped member to role|
|RoleManagement|Delete role definition|
|RoleManagement|Remove EligibleRoleAssignment from RoleDefinition|
|RoleManagement|Remove eligible member from role|
|RoleManagement|Remove member from role|
|RoleManagement|Remove member from role scoped over Restricted Management Administrative Unit|
|RoleManagement|Remove role assignment from role definition|
|RoleManagement|Remove scoped member from role|
|RoleManagement||Update role|
|RoleManagement||Update role definition|


|UserManagement|Add a deletion-marked app role assignment grant to group as part of link removal|
|UserManagement|Add app role assignment to group|
|UserManagement|Add user|
|UserManagement|Add users strong authentication phone app detail|
|UserManagement|Change user license|
|UserManagement|Change user password|
|UserManagement|Convert federated user to managed|
|UserManagement|Create application password for user|
|UserManagement|Delete application password for user|
|UserManagement|Delete user|
|UserManagement|Disable Strong Authentication|
|UserManagement|Disable account|
|UserManagement|Enable Strong Authentication|
|UserManagement|Enable account|
|UserManagement|Hard Delete user|
|UserManagement|Remove app role assignment from user|
|UserManagement|Remove users strong authentication phone app detail|
|UserManagement|Reset password|
|UserManagement|Restore user|
|UserManagement|Set force change user password|
|UserManagement|Set user manager|
|UserManagement|Set user oath token metadata enabled|
|UserManagement|Update StsRefreshTokenValidFrom Timestamp|
|UserManagement|Update external secrets|
|UserManagement|Update user|

## Device Registration Service

|Audit Category|Activity|
|---|---|
|Device|Delete pre-created device|
|Device|pre-create device|
|Device|Register device|
|Device|Reveal local administrator password|
|Device|Unregister device|
|Device|Update local administrator password|
|KeyManagement|Add BitLocker key|
|KeyManagement|Delete BitLocker key|
|KeyManagement|Read BitLocker key|
|Policy|Set device registration policies|
|UserManagement|Add FIDO2 security key|
|UserManagement|Add Windows Hello for Business credential|
|UserManagement|Add passwordless phone sign-in credential|
|UserManagement|Delete FIDO2 security key|
|UserManagement|Delete Windows Hello for Business credential|
|UserManagement|Delete passwordless phone sign-in credential|

## Entitlement Management

|Audit Category|Activity|
|---|---|
|EntitlementManagement|Add Entitlement Management role assignment|
|EntitlementManagement|Administrator directly assigns user to access package|		 
|EntitlementManagement|Administrator directly removes user access package assignment|
|EntitlementManagement|Approval stage completed for access package assignment request|
|EntitlementManagement|Approve access package assignment request|
|EntitlementManagement|Assign user as external sponsor|
|EntitlementManagement|Assign user as internal sponsor|
|EntitlementManagement|Auto approve access package assignment request|
|EntitlementManagement|Cancel access package assignment request|
|EntitlementManagement|Create access package|
|EntitlementManagement|Create access package assignment policy|
|EntitlementManagement|Create access package assignment user update request|	
|EntitlementManagement|Create access package catalog|
|EntitlementManagement|Create connected organization|	
|EntitlementManagement|Create custom extension|
|EntitlementManagement|Create incompatible access package|
|EntitlementManagement|Create incompatible group|
|EntitlementManagement|Create resource environment|
|EntitlementManagement|Create resource remove request|
|EntitlementManagement|Create resource request|
|EntitlementManagement|Delete access package|
|EntitlementManagement|Delete access package assignment policy|
|EntitlementManagement|Delete access package assignment request|
|EntitlementManagement|Delete access package assignment policy for a deleted user|
|EntitlementManagement|Delete access package catalog|
|EntitlementManagement|Delete connected organization|
|EntitlementManagement|Delete custom extension|
|EntitlementManagement|Delete incompatible access package|
|EntitlementManagement|Delete incompatible group|
|EntitlementManagement|Deny access package assignment request|
|EntitlementManagement|Entitlement Management creates access package assignment request for user|
|EntitlementManagement|Entitlement Management removes access package assignment request for user|
|EntitlementManagement|Execute custom extension|
|EntitlementManagement|Extend access package assignment|
|EntitlementManagement|Failed access package assignment request|
|EntitlementManagement|Fulfill access package assignment request|
|EntitlementManagement|Fulfill access package resource assignment|	
|EntitlementManagement|Partially fulfill access package assignment request|
|EntitlementManagement|Ready to fulfill access package assignment request|
|EntitlementManagement|Remove Entitlement Management role assignment|
|EntitlementManagement|Remove access package resource assignment|
|EntitlementManagement|Remove user as external sponsor|
|EntitlementManagement|Remove user as internal sponsor|
|EntitlementManagement|Schedule a future access package assignment|
|EntitlementManagement|Update access package|
|EntitlementManagement|Update access package assignment policy|
|EntitlementManagement|Update access package assignment request|
|EntitlementManagement|Update access package catalog|
|EntitlementManagement|Update access package catalog resource|
|EntitlementManagement|Update connected organization|
|EntitlementManagement|Update custom extension|
|EntitlementManagement|Update request answers by approver|
|EntitlementManagement|Update tenant setting|
|EntitlementManagement|User requests access package assignment|
|EntitlementManagement|User requests an access package assignment on behalf of service principal|
|EntitlementManagement|User requests to extend access package assignment|
|EntitlementManagement|User requests to remove access package assignment|

## Hybrid Authentication

|Audit Category|Activity|
|---|---|
|Authentication|Add user to feature rollout|
|Authentication|Remove user from feature rollout|

## Identity protection

|Audit Category|Activity|
|---|---|
|IdentityProtection|Update NotificationSettings|
|Other|ConfirmAccountCompromised|
|Other|ConfirmCompromised|
|Other|ConfirmSafe|
|Other|ConfirmServicePrincipalCompromised|
|Other|DismissServicePrincipal|
|Other|DismissUser|
|Other|confirmServicePrincipalCompromised|
|Other|dismissServicePrincipal|

## Invited users

|Audit Category|Activity|
|---|---|
|UserManagement|Delete external user|
|UserManagement|Email not sent, user unsubscribed|
|UserManagement|Email subscribed|
|UserManagement|Email unsubscribed|
|UserManagement|Invite external user|
|UserManagement|Invite external user with reset invitation status|
|UserManagement|Invite internal user to B2B collaboration|
|UserManagement|Redeem external user invite|
|UserManagement|Viral user creation|

## Lifecycle Workflows

|Audit Category|Activity|
|---|---|
|Other|Create custom task extension|
|Other|Delete custom task extension|
|Other|Update custom task extension|
|TaskManagement|Add task to workflow|
|TaskManagement|Disable task|
|TaskManagement|Enable task|
|TaskManagement|Remove task from workflow|
|TaskManagement|Update task|
|WorkflowManagement|Add execution conditions|
|WorkflowManagement|Add workflow version|
|WorkflowManagement|Create workflow|
|WorkflowManagement|Delete workflow|
|WorkflowManagement|Disable workflow|
|WorkflowManagement|Disable workflow schedule|
|WorkflowManagement|Enable workflow|
|WorkflowManagement|Enable workflow schedule|
|WorkflowManagement|Hard delete workflow|
|WorkflowManagement|On-demand workflow execution completed|
|WorkflowManagement|Restore workflow|
|WorkflowManagement|Schedule workflow execution completed|
|WorkflowManagement|Schedule workflow execution started|
|WorkflowManagement|Set workflow for on-demand execution|
|WorkflowManagement|Update execution conditions|
|WorkflowManagement|Update tenant settings|
|WorkflowManagement|Update workflow|

## Microsoft Identity Manager (MIM)

|Audit Category|Activity|
|---|---|
|Group Management|Review request approval request|
|Group Management|Update Access Review|
|Group Management|Update access review mail notification settings|
|Group Management|Update access review recurrence count setting|
|Group Management|Update access review recurrence duration in days setting|
|User Management|Update access review recurrence end type setting|
|User Management|Update access review recurrence type setting|



## Privileged Identity Management

|Audit Category|Activity|
|---|---|
|PIM|ActivationAborted|
|PIM|ActivationApproved|
|PIM|ActivationCanceled|
|PIM|ActivationDenied|
|PIM|ActivationRequested|
|PIM|Added|
|PIM|AddedOutsidePIM|
|PIM|Assign|
|PIM|DismissAlert|
|PIM|Elevate|
|PIM|ReactivateAlert|
|PIM|Removed|
|PIM|RemovedOutsidePIM|
|PIM|Request Stop Review|
|PIM|Role Setting changes|
|PIM|ScanAlertsNow|
|PIM|Signup|
|PIM|Unassign|
|PIM|Unelevate|
|PIM|UpdateAlertSettings|
|PIM|UpdateCurrentState|


## Self-service group management

|Audit Category|Activity|
|---|---|
|Group Management|Reset user password|
|Group Management|Restore user|
|Group Management|Set force change user password|
|Group Management|Set user manager|
|Group Management|Set users oath token metadata enabled|
|Group Management|Update StsRefreshTokenValidFrom Timestamp|
|Group Management|Update external secrets|
|Group Management|Update user|
|Group Management|Admin generates a temporary password|


## Self-service password management

|Audit Category|Activity|
|---|---|
|Directory Management|Admins requires the user to reset their password|
|Directory Management|Assign external user to application|
|User Management|Email not sent, user unsubscribed|
|User Management|Invite external user|
|User Management|Redeem external user invite|
|User Management|Viral tenant creation|
|User Management|Viral user creation|
|User Management|User Password Registration|
|User Management|User Password Reset|
|User Management|Blocked from self-service password reset|


## Terms of use

|Audit Category|Activity|
|---|---|
|Terms Of Use|Accept Terms Of Use|
|Terms Of Use|Create Terms Of Use|
|Terms Of Use|Decline Terms Of Use|
|Terms Of Use|Delete Consent|
|Terms Of Use|Delete Terms Of Use|
|Terms Of Use|Edit Terms Of Use|
|Terms Of Use|Expire Terms Of Use|
|Terms Of Use|Hard Delete Terms Of Use|
|Terms Of Use|Publish Terms Of Use|
|Terms Of Use|Unpublish Terms Of Use|


## Next steps

- [Azure AD reports overview](overview-reports.md).
- [Audit logs report](concept-audit-logs.md). 
- [Programmatic access to Azure AD reports](concept-reporting-api.md)
