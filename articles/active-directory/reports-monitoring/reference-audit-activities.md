---

title: Azure Active Directory (Azure AD) audit activity reference | Microsoft Docs
description: Get an overview of the audit activities that can be logged in your audit logs in Azure Active Directory (Azure AD).
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: a1f93126-77d1-4345-ab7d-561066041161
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 01/24/2019
ms.author: markvi
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---
# Azure AD audit activity reference

With Azure Active Directory (Azure AD) reports, you can get the information you need to determine how your environment is doing.

The reporting architecture in Azure AD consists of the following components:

- **Activity reports** 
    - [Sign-ins](concept-sign-ins.md) – Provides information about the usage of managed applications and user sign-in activities
    - [Audit logs](concept-audit-logs.md) - Provides traceability through logs for all changes done by various features within Azure AD. 
    
- **Security reports** 
    - [Risky sign-ins](concept-risky-sign-ins.md) - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account. 
    - [Users flagged for risk](concept-user-at-risk.md) - A risky user is an indicator for a user account that might have been compromised. 

This articles lists the audit activities that can be logged in your audit logs.

## Access reviews

|Audit Category|Activity|
|---|---|
|Access Reviews|Access review ended|
|Access Reviews|Add approver to request approval|
|Access Reviews|Add reviewer to access review|
|Access Reviews|Apply access review|
|Access Reviews|Create access review|
|Access Reviews|Create program|
|Access Reviews|Create request approval|
|Access Reviews|Delete access review|
|Access Reviews|Delete program|
|Access Reviews|Link program control|
|Access Reviews|Onboard to Azure AD Access Reviews|
|Access Reviews|Remove reviewer from access review|
|Access Reviews|Request Stop Review|
|Access Reviews|Request apply review result|
|Access Reviews|Review Rbac Role membership|
|Access Reviews|Review app assignment|
|Access Reviews|Review group membership|
|Access Reviews|Review request approval request|
|Access Reviews|Unlink program control|
|Access Reviews|Update Access Review|
|Access Reviews|Update Azure AD Access Reviews Onboarding status|
|Access Reviews|Update access review mail notification settings|
|Access Reviews|Update access review recurrence count setting|
|Access Reviews|Update access review recurrence duration in days setting|
|Access Reviews|Update access review recurrence end type setting|
|Access Reviews|Update access review recurrence type setting|
|Access Reviews|Update access review reminder settings|
|Access Reviews|Update program|
|Access Reviews|Update request approval|
|Access Reviews|User disabled|

## Account provisioning

|Audit Category|Activity|
|---|---|
|Application Management|Retrieve V2 application permissions grants|
|Application Management|Retrieve V2 application service principals in the current tenant|
|Application Management|Update V1 application|
|Application Management|Update V2 application|
|Application Management|Update V2 application permission grant|
|Application Management|Add OAuth2PermissionGrant|
|Application Management|Add app role assignment to service principal|

## Application proxy

|Audit Category|Activity|
|---|---|
|Application Management|Add application|
|Application Management|Add owner to application|
|Application Management|Add owner to service principal|
|Application Management|Add policy to service principal|
|Directory Management|Add service principal|
|Directory Management|Add service principal credentials|
|Directory Management|Consent to application|
|Directory Management|Delete application|
|Directory Management|Hard Delete application|
|Directory Management|Remove OAuth2PermissionGrant|
|Directory Management|Remove app role assignment from service principal|
|Directory Management|Remove owner from application|
|Resource|Remove owner from service principal|
|Resource|Remove policy from service principal|
|Resource|Remove service principal|


## Automated password rollover

|Audit Category|Activity|
|---|---|
|Application Management|Remove service principal credentials|


## B2C

|Audit Category|Activity|
|---|---|
|Application Management|Restore application|
|Application Management|Revoke consent|
|Application Management|Update application|
|Application Management|Update external secrets|
|Application Management|Update service principal|
|Application Management|Issue an access token to the application|
|Application Management|Issue an authorization code to the application|
|Application Management|Issue an id_token to the application|
|Application Management|Validate local account credentials|
|Application Management|Validate user authentication|
|Application Management|Add V2 application permissions|
|Application Management|Add a key based on ASCII secret to a CPIM key container|
|Application Management|Add a key to a CPIM key container|
|Application Management|AdminPolicyDatas-SetResources|
|Application Management|AdminUserJourneys-GetResources|
|Application Management|AdminUserJourneys-RemoveResources|
|Authentication|AdminUserJourneys-SetResources|
|Authentication|Create IdentityProvider|
|Authentication|Create V1 application|
|Authentication|Create V2 application|
|Authentication|Create a custom domains in the tenant|
|Authorization|Create a new AdminUserJourney|
|Authorization|Create localized resource json|
|Authorization|Create new Custom IDP|
|Authorization|Create new IDP|
|Authorization|Create or update a B2C directory resource|
|Authorization|Create policy|
|Authorization|Create trustFramework policy|
|Authorization|Create trustFramework policy with configurable prefix|
|Authorization|Create user attribute|
|Authorization|CreateTrustFrameworkPolicy|
|Authorization|Creates or Update an new AdminUserJourney|
|Authorization|Delete IDP|
|Authorization|Delete IdentityProvider|
|Authorization|Delete V1 application|
|Authorization|Delete V2 application|
|Authorization|Delete V2 application permission grant|
|Authorization|Delete a B2C directory resource|
|Authorization|Delete a CPIM key container|
|Authorization|Delete trustFramework policy|
|Authorization|Delete user attribute|
|Authorization|Enable B2C feature|
|Authorization|Get B2C directory resources in a subscription|
|Authorization|Get Custom IDP|
|Authorization|Get IDP|
|Authorization|Get V1 and V2 applications|
|Authorization|Get V1 application|
|Authorization|Get V1 applications|
|Authorization|Get V2 application|
|Authorization|Get V2 applications|
|Authorization|Get a B2C directory resource|
|Authorization|Get a list of custom domains in the tenant|
|Authorization|Get a user journey|
|Authorization|Get allowed application claims for user journey|
|Authorization|Get allowed self-asserted claims for user journey|
|Authorization|Get allowed self-asserted claims of policy|
|Authorization|Get available output claims list|
|Authorization|Get content definitions for user journey|
|Authorization|Get idps for a specific admin flow|
|Authorization|Get key container active key metadata in JWK|
|Authorization|Get list of all admin flows|
|Authorization|Get list of tags for all admin flows for all users|
|Authorization|Get list of tenants for a user|
|Authorization|Get local accounts' self-asserted claims|
|Authorization|Get localized resource json|
|Authorization|Get operations of Microsoft.AzureActiveDirectory resource provider|
|Authorization|Get policies|
|Authorization|Get policy|
|Authorization|Get resource properties of a tenant|
|Authorization|Get supported IDP list|
|Authorization|Get supported IDP list of the user journey|
|Authorization|Get tenant Info|
|Authorization|Get tenant allowed features|
|Authorization|Get tenant defined Custom IDP list|
|Authorization|Get tenant defined IDP list|
|Authorization|Get tenant defined local IDP list|
|Authorization|Get tenant details for a user for resource creation|
|Authorization|Get tenant list|
|Authorization|Get tenantDomains|
|Authorization|Get the default supported culture for CPIM|
|Authorization|Get the details of an admin flow|
|Authorization|Get the list of UserJourneys for this tenant|
|Authorization|Get the set of available supported cultures for CPIM|
|Authorization|Get trustFramework policy|
|Authorization|Get trustFramework policy as xml|
|Authorization|Get user attribute|
|Authorization|Get user attributes|
|Authorization|Get user journey list|
|Authorization|GetIEFPolicies|
|Authorization|GetIdentityProviders|
|Authorization|GetTrustFrameworkPolicy|
|Authorization|Gets a CPIM key container in jwk format|
|Authorization|Gets list of key containers in the tenant|
|Authorization|Gets the type of tenant|
|Authorization|MigrateTenantMetadata|
|Authorization|Patch IdentityProvider|
|Authorization|PutTrustFrameworkPolicy|
|Authorization|PutTrustFrameworkpolicy|
|Authorization|Remove a user journey|
|Authorization|Restore a CPIM key container backup|
|Authorization|Retrieve V2 application permissions grants|
|Authorization|Retrieve V2 application service principals in the current tenant|
|Authorization|Update Custom IDP|
|Authorization|Update IDP|
|Authorization|Update Local IDP|
|Authorization|Update V1 application|
|Authorization|Update V2 application|
|Authorization|Update V2 application permission grant|
|Authorization|Update policy|
|Authorization|Update user attribute|
|Authorization|Upload a CPIM encrypted key|
|Authorization|User Authorization: API is disabled for tenant featureset|
|Authorization|User Authorization: User granted access as 'Tenant Admin'|
|Authorization|User Authorization: User was granted 'Authenticated Users' access rights|
|Authorization|Verify if B2C feature is enabled|
|Authorization|Verify if feature is enabled|
|Authorization|Create program|
|Authorization|Delete program|
|Authorization|Link program control|
|Authorization|Onboard to Azure AD Access Reviews|
|Authorization|Unlink program control|
|Authorization|Update program|
|Authorization|Disable Desktop Sso|
|Authorization|Disable Desktop Sso for a specific domain|
|Authorization|Disable application proxy|
|Authorization|Disable passthrough authentication|
|Authorization|Enable Desktop Sso|
|Directory Management|Enable Desktop Sso for a specific domain|
|Directory Management|Enable application proxy|
|Directory Management|Enable passthrough authentication|
|Directory Management|Create a custom domains in the tenant|
|Directory Management|Enable B2C feature|
|Directory Management|Get a list of custom domains in the tenant|
|Directory Management|Get resource properties of a tenant|
|Directory Management|Get tenant Info|
|Directory Management|Get tenant allowed features|
|Directory Management|Get tenantDomains|
|Key|Gets the type of tenant|
|Key|Verify if B2C feature is enabled|
|Key|Verify if feature is enabled|
|Key|Add partner to company|
|Key|Add unverified domain|
|Key|Add verified domain|
|Key|Create company|
|Key|Create company settings|
|Key|Delete company settings|
|Key|Demote partner|
|Key|Directory deleted|
|Other|Directory deleted permanently|
|Other|Directory scheduled for deletion|
|Resource|Promote company to partner|
|Resource|Purge rights management properties|
|Resource|Remove partner from company|
|Resource|Remove unverified domain|
|Resource|Remove verified domain|
|Resource|Set Company Information|
|Resource|Set DirSync feature|
|Resource|Set DirSyncEnabled flag|
|Resource|Set Partnership|
|Resource|Set accidental deletion threshold|
|Resource|Set company allowed data location|
|Resource|Set company multinational feature enabled|
|Resource|Set directory feature on tenant|
|Resource|Set domain authentication|
|Resource|Set federation settings on domain|
|Resource|Set password policy|
|Resource|Set rights management properties|
|Resource|Update company|
|Resource|Update company settings|
|Resource|Update domain|
|Resource|Verify domain|
|Resource|Verify email verified domain|
|Resource|Onboarding|
|Resource|Update alert settings|
|Resource|Update weekly digest settings|
|Resource|Disable password writeback for directory|
|Resource|Enable password writeback for directory|
|Resource|Add app role assignment to group|
|Resource|Add group|
|Resource|Add member to group|
|Resource|Add owner to group|
|Resource|Create group settings|
|Resource|Delete group|
|Resource|Delete group settings|
|Resource|Finish applying group based license to users|
|Resource|Hard Delete group|
|Resource|Remove app role assignment from group|
|Resource|Remove member from group|
|Resource|Remove owner from group|
|Resource|Restore Group|
|Resource|Set group license|
|Resource|Set group to be managed by user|
|Resource|Start applying group based license to users|
|Resource|Trigger group license recalculation|
|Resource|Update group|
|Resource|Update group settings|
|Resource|Add Member|
|Resource|Create Group|
|Resource|Delete Group|
|Resource|Remove Member|
|Resource|Update Group|
|Resource|Approve a pending request to join a group|
|Resource|Cancel a pending request to join a group|
|Resource|Create lifecycle management policy|
|Resource|Delete a pending request to join a group|
|Resource|Reject a pending request to join a group|
|Resource|Renew group|
|Resource|Request to join a group|
|Resource|Set dynamic group properties|
|Resource|Update lifecycle management policy|
|Resource|Add a key based on ASCII secret to a CPIM key container|
|Resource|Add a key to a CPIM key container|
|Resource|Delete a CPIM key container|
|Resource|Delete key container|
|Resource|Get key container active key metadata in JWK|
|Resource|Get key container metadata|
|Resource|Gets a CPIM key container in jwk format|
|Resource|Gets list of key containers in the tenant|
|Resource|Restore a CPIM key container backup|
|Resource|Save key container|
|Resource|Upload a CPIM encrypted key|
|Resource|Issue an authorization code to the application|
|Resource|Issue an id_token to the application|


## Core directory

|Audit Category|Activity|
|---|---|
|Administrative Unit Management|Download a single risk event type|
|Administrative Unit Management|Download admins and status of weekly digest opt-in|
|Administrative Unit Management|Download all risk event types|
|Administrative Unit Management|Download free user risk events|
|Administrative Unit Management|Download users flagged for risk|
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
|Application Management|Add application SSL certificate|
|Application Management|Delete SSL binding|
|Application Management|Register connector|
|Application Management|AdminPolicyDatas-RemoveResources|
|Application Management|AdminPolicyDatas-SetResources|
|Application Management|AdminUserJourneys-GetResources|
|Directory Management|AdminUserJourneys-RemoveResources|
|Directory Management|AdminUserJourneys-SetResources|
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
|User Management|Remove registered owner from device|
|User Management|Remove registered users from device|
|User Management|Update device|
|User Management|Update device configuration|
|User Management|Add eligible member to role|
|User Management|Add member to role|
|User Management|Add role assignment to role definition|
|User Management|Add role from template|
|User Management|Add scoped member to role|
|User Management|Remove eligible member from role|
|User Management|Remove member from role|
|User Management|Remove role assignment from role definition|
|User Management|Remove scoped member from role|
|User Management|Update role|
|User Management|AccessReview_Review|
|User Management|AccessReview_Update|
|User Management|ActivationAborted|
|User Management|ActivationApproved|
|User Management|ActivationCanceled|
|User Management|ActivationRequested|
|User Management|Added|
|User Management|Assign|


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
|Other|Create request approval|
|Other|Delete access review|
|User Management|Remove reviewer from access review|
|User Management|Request apply review result|
|User Management|Request Stop Review|
|User Management|Review app assignment|
|User Management|Review group membership|
|User Management|Review Rbac Role membership|


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
