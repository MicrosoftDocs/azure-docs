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

Azure Active Directory (Azure AD) audit logs collect all traceable activities within your Azure AD tenant. Audit logs can be used to determine who made a change to service, user, or group.

This article provides a comprehensive list of the audit categories and their related activities. Use the "In this article" section to jump to a specific audit category. 

Audit log activities and categories change periodically. The tables are updated regularly, but may not be in sync with what is available in Azure AD. Please provide us feedback if you think there is a missing audit category or activity.

## Access reviews

With [Azure AD Identity Governance access reviews](Manage user access with access reviews - Azure AD - Microsoft Entra | Microsoft Learn), you can ensure users have the appropriate access. Access review audit logs can tell you who initiated or ended an access review. These logs can also tell you if any access review settings were changed.


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

|Audit Category|Activity|
|---|---|
|DirectoryManagement|Dismiss recommendation|
|DirectoryManagement|Mark recommendation as complete|
|DirectoryManagement|Postpone recommendation|

## Azure MFA

|Audit Category|Activity|
|---|---|
|UserManagement|Fraud reported - no action taken|
|UserManagement|Fraud reported - user is blocked for MFA|
|UserManagement|Suspicious activity reported|
|UserManagement|User registered security info|

## B2C

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
|Authorization|Create or update loacalized resource|
|Authorization|Create policy key|
|Authorization|Create user attribute|
|Authorization|Create user flow|
|Authorization|Create v2 application|
|Authorization|Delete Api connector|
|Authorization|Delete B2C Tenant where the caller is an administrator|
|Authorization|B2C directory resource|
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
|Directory Management|update age gating configuration|
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
|PolicyManagement|Get the authenticationEventsPolicy
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

|Application Management|Batch invites processed|
|Application Management|Batch invites uploaded|
|Application Management|Add owner to policy|
|Application Management|Add policy|
|Application Management|Delete policy|
|Application Management|Remove policy credentials|
|Application Management|Update policy|
|Application Management|Set MFA registration policy|
|Application Management|Set sign-in risk policy|
|Application Management|Set user risk policy|
|Application Management|Accept Terms Of Use|
|Application Management|Create Terms Of Use|
|Application Management|Decline Terms Of Use|
|Application Management|Delete Terms Of Use|
|Application Management|Edit Terms Of Use|
|Application Management|Publish Terms Of Use|
|Application Management|Unpublish Terms Of Use|
|Application Management|Add application TLS/SSL certificate|
|Application Management|Delete TLS binding|
|Application Management|Register connector|
|Application Management|AdminPolicyDatas-RemoveResources|
|Application Management|AdminPolicyDatas-SetResources|
|Application Management|AdminUserJourneys-GetResources|

|Directory Management|AdminUserJourneys-RemoveResources|
|Directory Management|AdminUserJourneys-SetResources|
|Directory Management|Create company|
|Directory Management|Create IdentityProvider|
|Directory Management|Create a new AdminUserJourney|
|Directory Management|Create localized resource json|
|Directory Management|Create new Custom IDP|
|Directory Management|Create new IDP|
|Directory Management|Create or update a B2C directory resource|
|Directory Management|Create policy|
|Directory Management|Create trustFramework policy|
|Directory Management|Create trustFramework policy with configurable prefix|
|Directory Management|Create user attribute|
|Directory Management|CreateTrustFrameworkPolicy|
|Directory Management|Delete IDP|
|Directory Management|Delete IdentityProvider|
|Directory Management|Delete a B2C directory resource|
|Directory Management|Delete trustFramework policy|
|Directory Management|Delete user attribute|
|Directory Management|Get B2C directory resources in a resource group|
|Directory Management|Get B2C directory resources in a subscription|
|Directory Management|Get Custom IDP|
|Directory Management|Get IDP|
|Directory Management|Get a B2C directory resource|
|Directory Management|Get a user journey|
|Directory Management|Get allowed application claims for user journey|
|Directory Management|Get allowed self-asserted claims for user journey|
|Directory Management|Get allowed self-asserted claims of policy|
|Directory Management|Get available output claims list|
|Directory Management|Get content definitions for user journey|
|Directory Management|Get idps for a specific admin flow|
|Directory Management|Get list of all admin flows|
|Directory Management|Get list of tags for all admin flows for all users|
|Group Management|Bulk Download group members - started|
|Group Management|Bulk Download group members - finished|
|Group Management|Bulk import group members - started|
|Group Management|Bulk import group members - finished|
|Group Management|Bulk remove group members - started|
|Group Management|Bulk remove group members - finished|
|Group Management|Bulk download groups - started|
|Group Management|Bulk download groups - finished|
|Group Management|Get list of tenants for a user|
|Group Management|Get local accounts' self-asserted claims|
|Group Management|Get localized resource json|
|Group Management|Get operations of Microsoft.AzureActiveDirectory resource provider|
|Group Management|Get policies|
|Group Management|Get policy|
|Group Management|Get supported IDP list|
|Group Management|Get supported IDP list of the user journey|
|Group Management|Get tenant defined Custom IDP list|
|Group Management|Get tenant defined IDP list|
|Group Management|Get tenant defined local IDP list|
|Group Management|Get tenant details for a user for resource creation|
|Group Management|Get the default supported culture for CPIM|
|Group Management|Get the details of an admin flow|
|Group Management|Get the list of UserJourneys for this tenant|
|Group Management|Get the set of available supported cultures for CPIM|
|Group Management|Get trustFramework policy|
|Group Management|Get trustFramework policy as xml|
|Group Management|Get user attribute|
|Policy Management|Get user attributes|
|Policy Management|Get user journey list|
|Policy Management|GetIEFPolicies|
|Policy Management|GetIdentityProviders|
|Policy Management|GetTrustFrameworkPolicy|
|Resource|MigrateTenantMetadata|
|Resource|Move resources|
|Resource|Patch IdentityProvider|
|Resource|PutTrustFrameworkPolicy|
|Resource|PutTrustFrameworkpolicy|
|Resource|Remove a user journey|
|Resource|Update Custom IDP|
|Resource|Update IDP|
|Resource|Update Local IDP|
|Resource|Update a B2C directory resource|
|Resource|Update policy|
|Resource|Update subscription status|
|Role Management|Update user attribute|
|Role Management|Validate move resources|
|Role Management|Add device|
|Role Management|Add device configuration|
|Role Management|Add registered owner to device|
|Role Management|Add registered users to device|
|Role Management|Delete device|
|Role Management|Delete device configuration|
|Role Management|Device no longer compliant|
|Role Management|Device no longer managed|
|User Management|AccessReview_Review|
|User Management|AccessReview_Update|
|User Management|ActivationAborted|
|User Management|ActivationApproved|
|User Management|ActivationCanceled|
|User Management|ActivationRequested|
|User Management|Add eligible member to role|
|User Management|Add member to role|
|User Management|Add role assignment to role definition|
|User Management|Add role from template|
|User Management|Add scoped member to role|
|User Management|Added|
|User Management|Assign|
|User Management|Bulk create users - started|
|User Management|Bulk create users - finished|
|User Management|Bulk delete users - started|
|User Management|Bulk delete users - finished|
|User Management|Bulk download users - started|
|User Management|Bulk download users - finished|
|User Management|Bulk restore deleted users - started|
|User Management|Bulk restore deleted users - finished|
|User Management|Bulk invite users - started|
|User Management|Bulk invite users - finished|
|User Management|Remove registered owner from device|
|User Management|Remove registered users from device|
|User Management|Remove eligible member from role|
|User Management|Remove member from role|
|User Management|Remove role assignment from role definition|
|User Management|Remove scoped member from role|
|User Management|Update device|
|User Management|Update device configuration|
|User Management|Update role|

## Entitlement Management

|Audit Category|Activity|
|---|---|
|Entitlement Management|Add Entitlement Management role assignment|
|Entitlement Management|Administrator directly assigns user to access package|		 
|Entitlement Management|Administrator directly removes user access package assignment|
|Entitlement Management|Approve access package assignment request|
|Entitlement Management|Assign user as external sponsor|
|Entitlement Management|Assign user as internal sponsor|
|Entitlement Management|Auto approve access package assignment request|
|Entitlement Management|Cancel access package assignment request|
|Entitlement Management|Create access package|
|Entitlement Management|Create access package assignment policy|
|Entitlement Management|Create access package assignment user update request|	
|Entitlement Management|Create access package catalog|
|Entitlement Management|Create connected organization|	
|Entitlement Management|Create custom action|
|Entitlement Management|Create resource remove request|
|Entitlement Management|Create resource request|
|Entitlement Management|Delete access package|
|Entitlement Management|Delete access package assignment policy|
|Entitlement Management|Delete access package catalog|
|Entitlement Management|Delete connected organization|
|Entitlement Management|Deny access package assignment request|
|Entitlement Management|Entitlement Management removes access package assignment request for user|
|Entitlement Management|Execute custom action|
|Entitlement Management|Extend access package assignment|
|Entitlement Management|Failed access package assignment request|
|Entitlement Management|Fulfill access package assignment request|
|Entitlement Management|Fulfill access package resource assignment|	
|Entitlement Management|Partially fulfill access package assignment request|
|Entitlement Management|Ready to fulfill access package assignment request|
|Entitlement Management|Remove Entitlement Management role assignment|
|Entitlement Management|Remove access package resource assignment|
|Entitlement Management|Remove user as external sponsor|
|Entitlement Management|Remove user as internal sponsor|
|Entitlement Management|Schedule a future access package assignment|
|Entitlement Management|Update access package|
|Entitlement Management|Update access package assignment policy|
|Entitlement Management|Update access package catalog|
|Entitlement Management|Update access package catalog resource|
|Entitlement Management|Update connected organization|
|Entitlement Management|Update custom action|
|Entitlement Management|User requests access package assignment|
|Entitlement Management|User requests an access package assignment on behalf of service principal|
|Entitlement Management|User requests to extend access package assignment|
|Entitlement Management|User requests to remove access package assignment|




## Identity protection

|Audit Category|Activity|
|---|---|
|Directory Management|Elevate|
|Directory Management|Removed|
|Directory Management|Role Setting changes|
|Other|ScanAlertsNow|
|Other|Signup|
|Other|Unelevate|
|Other|UpdateAlertSettings|
|Other|UpdateCurrentState|
|Policy Management|Access review ended|
|Policy Management|Add approver to request approval|
|Policy Management|Add reviewer to access review|
|User Management|Apply access review|
|User Management|Create access review|


## Invited users

|Audit Category|Activity|
|---|---|
|Invited users|Delete external user|
|Invited users|Email not sent, user unsubscribed|
|Invited users|Email subscribed|
|Invited users|Email unsubscribed|
|Invited users|Invitation Email|
|Invited users|Invite external user|
|Invited users|Invite external user with reset invitation status|
|Invited users|Invite internal user to B2B collaboration|
|Invited users|Redeem external user invite|
|Invited users|Viral tenant creation|
|Invited users|Viral user creation|


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
