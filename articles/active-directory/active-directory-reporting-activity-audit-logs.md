---

title: Audit activity reports in the Azure Active Directory portal | Microsoft Docs
description: Introduction to the audit activity reports in the Azure Active Directory portal
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: a1f93126-77d1-4345-ab7d-561066041161
ms.service: active-directory
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/31/2018
ms.author: markvi
ms.reviewer: dhanyahk

---
# Audit activity reports in the Azure Active Directory portal 

With reporting in Azure Active Directory (Azure AD), you can get the information you need to determine how your environment is doing.

The reporting architecture in Azure AD consists of the following components:

- **Activity** 
    - **Sign-in activities** – Information about the usage of managed applications and user sign-in activities
    - **Audit logs** - System activity information about users and group management, your managed applications and directory activities.
- **Security** 
    - **Risky sign-ins** - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account. For more details, see Risky sign-ins.
    - **Users flagged for risk** - A risky user is an indicator for a user account that might have been compromised. For more details, see Users flagged for risk.

This topic gives you an overview of the audit activities.
 
## Who can access the data?
* Users in the Security Admin or Security Reader role
* Global Admins
* Individual users (non-admins) can see their own activities


## Audit logs

The audit logs in Azure Active Directory provide records of system activities for compliance.  
Your first entry point to all auditing data is **Audit logs** in the **Activity** section of **Azure Active Directory**.

![Audit logs](./media/active-directory-reporting-activity-audit-logs/61.png "Audit logs")

An audit log has a default list view that shows:

- the date and time of the occurrence
- the initiator / actor (*who*) of an activity 
- the activity (*what*) 
- the target

![Audit logs](./media/active-directory-reporting-activity-audit-logs/18.png "Audit logs")

You can customize the list view by clicking **Columns** in the toolbar.

![Audit logs](./media/active-directory-reporting-activity-audit-logs/19.png "Audit logs")

This enables you to display additional fields or remove fields that are already displayed.

![Audit logs](./media/active-directory-reporting-activity-audit-logs/21.png "Audit logs")


By clicking an item in the list view, you get all available details about it.

![Audit logs](./media/active-directory-reporting-activity-audit-logs/22.png "Audit logs")


## Filtering audit logs

To narrow down the reported data to a level that works for you, you can filter the audit data using the following fields:

- Date range
- Initiated by (Actor)
- Category
- Activity resource type
- Activity

![Audit logs](./media/active-directory-reporting-activity-audit-logs/23.png "Audit logs")


The **date range** filter enables to you to define a timeframe for the returned data.  
Possible values are:

- 1 month
- 7 days
- 24 hours
- Custom

When you select a custom timeframe, you can configure a start time and an end time.

The **initiated by** filter enables you to define an actor's name or its universal principal name (UPN).

The **category** filter enables you to select one of the following filter:

- All
- Core category
- Core directory
- Self-service password management
- Self-service group management
- Account provisioning- Automated password rollover
- Invited users
- MIM service
- Identity Protection
- B2C

The **activity resource type** filter enables you to select one of the following filters:

- All 
- Group
- Directory
- User
- Application
- Policy
- Device
- Other

When you select **Group** as **activity resource type**, you get an additional filter category that enables you to also provide a **Source**:

- Azure AD
- O365


The **activity** filter is based on the category and Activity resource type selection you make. You can select a specific activity you want to see or choose all. 

You can get the list of all Audit Activities using the Graph API https://graph.windows.net/$tenantdomain/activities/auditActivityTypes?api-version=beta, where $tenantdomain = your domain name or refer to the article [audit report events](active-directory-reporting-audit-events.md).


## Audit logs shortcuts

In addition to **Azure Active Directory**, the Azure portal provides you with two additional entry points to audit data:

- Users and groups
- Enterprise applications

### Users and groups audit logs

With user and group-based audit reports, you can get answers to questions such as:

- What types of updates have been applied the users?

- How many users were changed?

- How many passwords were changed?

- What has an administrator done in a directory?

- What are the groups that have been added?

- Are there groups with membership changes?

- Have the owners of group been changed?

- What licenses have been assigned to a group or a user?

If you just want to review auditing data that is related to users and groups, you can find a filtered view under **Audit logs** in the **Activity** section of the **Users and Groups**. This entry point has **Users and groups** as preselected **Activity Resource Type**.

![Audit logs](./media/active-directory-reporting-activity-audit-logs/93.png "Audit logs")

### Enterprise applications audit logs

With application-based audit reports, you can get answers to questions such as:

* What are the applications that have been added or updated?
* What are the applications that have been removed?
* Has a service principle for an application changed?
* Have the names of applications been changed?
* Who gave consent to an application?

If you just want to review auditing data that is related to your applications, you can find a filtered view under **Audit logs** in the **Activity** section of the **Enterprise applications** blade. This entry point has **Enterprise applications** as preselected **Activity Resource Type**.

![Audit logs](./media/active-directory-reporting-activity-audit-logs/134.png "Audit logs")

You can filter this view further down to just **groups** or just **users**.

![Audit logs](./media/active-directory-reporting-activity-audit-logs/25.png "Audit logs")



## Azure AD audit activity list

This section provides you with a list of all the activities that can be logged. 


|Service Name|Audit Category|Activity Resource Type|Activty|
|---|---|---|---|
|Account Provisioning|Application Management|Application|Administration|
|Account Provisioning|Application Management|Application|Directory operation|
|Account Provisioning|Application Management|Application|Export|
|Account Provisioning|Application Management|Application|Import|
|Account Provisioning|Application Management|Application|Other|
|Account Provisioning|Application Management|Application|Process escrow|
|Account Provisioning|Application Management|Application|Synchronization rule action|
|Application Proxy|Application Management|Application|Add application|
|Application Proxy|Resource|Resource|Add application SSL certificate|
|Application Proxy|Resource|Resource|Delete SSL binding|
|Application Proxy|Application Management|Application|Delete application|
|Application Proxy|Directory Management|Directory|Disable Desktop Sso|
|Application Proxy|Directory Management|Directory|Disable Desktop Sso for a specific domain|
|Application Proxy|Directory Management|Directory|Disable application proxy|
|Application Proxy|Directory Management|Directory|Disable passthrough authentication|
|Application Proxy|Directory Management|Directory|Enable Desktop Sso|
|Application Proxy|Directory Management|Directory|Enable Desktop Sso for a specific domain|
|Application Proxy|Directory Management|Directory|Enable application proxy|
|Application Proxy|Directory Management|Directory|Enable passthrough authentication|
|Application Proxy|Resource|Resource|Register connector|
|Application Proxy|Application Management|Application|Update application|
|Application Proxy|Application Management|Application|Update application Single Sign-On Mode|
|Automated Password Rollover|Application Management|Application|Automated Password Rollover|
|B2C|Application Management|Application|Add V2 application permissions|
|B2C|Authorization|Authorization|Add V2 application permissions|
|B2C|Key|Key|Add a key based on ASCII secret to a CPIM key container|
|B2C|Authorization|Authorization|Add a key based on ASCII secret to a CPIM key container|
|B2C|Key|Key|Add a key to a CPIM key container|
|B2C|Authorization|Authorization|Add a key to a CPIM key container|
|B2C|Resource|Resource|AdminPolicyDatas-RemoveResources|
|B2C|Authorization|Authorization|AdminPolicyDatas-SetResources|
|B2C|Resource|Resource|AdminPolicyDatas-SetResources|
|B2C|Resource|Resource|AdminUserJourneys-GetResources|
|B2C|Authorization|Authorization|AdminUserJourneys-GetResources|
|B2C|Authorization|Authorization|AdminUserJourneys-RemoveResources|
|B2C|Resource|Resource|AdminUserJourneys-RemoveResources|
|B2C|Resource|Resource|AdminUserJourneys-SetResources|
|B2C|Authorization|Authorization|AdminUserJourneys-SetResources|
|B2C|Authorization|Authorization|Create IdentityProvider|
|B2C|Resource|Resource|Create IdentityProvider|
|B2C|Authorization|Authorization|Create V1 application|
|B2C|Application Management|Application|Create V1 application|
|B2C|Application Management|Application|Create V2 application|
|B2C|Authorization|Authorization|Create V2 application|
|B2C|Directory Management|Directory|Create a custom domains in the tenant|
|B2C|Authorization|Authorization|Create a custom domains in the tenant|
|B2C|Authorization|Authorization|Create a new AdminUserJourney|
|B2C|Resource|Resource|Create a new AdminUserJourney|
|B2C|Resource|Resource|Create localized resource json|
|B2C|Authorization|Authorization|Create localized resource json|
|B2C|Authorization|Authorization|Create new Custom IDP|
|B2C|Resource|Resource|Create new Custom IDP|
|B2C|Resource|Resource|Create new IDP|
|B2C|Authorization|Authorization|Create new IDP|
|B2C|Authorization|Authorization|Create or update a B2C directory resource|
|B2C|Resource|Resource|Create or update a B2C directory resource|
|B2C|Resource|Resource|Create policy|
|B2C|Authorization|Authorization|Create policy|
|B2C|Authorization|Authorization|Create trustFramework policy|
|B2C|Resource|Resource|Create trustFramework policy|
|B2C|Authorization|Authorization|Create trustFramework policy with configurable prefix|
|B2C|Resource|Resource|Create trustFramework policy with configurable prefix|
|B2C|Resource|Resource|Create user attribute|
|B2C|Authorization|Authorization|Create user attribute|
|B2C|Authorization|Authorization|CreateTrustFrameworkPolicy|
|B2C|Resource|Resource|CreateTrustFrameworkPolicy|
|B2C|Authorization|Authorization|Creates or Update an new AdminUserJourney|
|B2C|Resource|Resource|Delete IDP|
|B2C|Authorization|Authorization|Delete IDP|
|B2C|Resource|Resource|Delete IdentityProvider|
|B2C|Authorization|Authorization|Delete IdentityProvider|
|B2C|Application Management|Application|Delete V1 application|
|B2C|Authorization|Authorization|Delete V1 application|
|B2C|Application Management|Application|Delete V2 application|
|B2C|Authorization|Authorization|Delete V2 application|
|B2C|Authorization|Authorization|Delete V2 application permission grant|
|B2C|Application Management|Application|Delete V2 application permission grant|
|B2C|Resource|Resource|Delete a B2C directory resource|
|B2C|Authorization|Authorization|Delete a B2C directory resource|
|B2C|Key|Key|Delete a CPIM key container|
|B2C|Authorization|Authorization|Delete a CPIM key container|
|B2C|Key|Key|Delete key container|
|B2C|Resource|Resource|Delete trustFramework policy|
|B2C|Authorization|Authorization|Delete trustFramework policy|
|B2C|Resource|Resource|Delete user attribute|
|B2C|Authorization|Authorization|Delete user attribute|
|B2C|Authorization|Authorization|Enable B2C feature|
|B2C|Directory Management|Directory|Enable B2C feature|
|B2C|Resource|Resource|Get B2C directory resources in a resource group|
|B2C|Resource|Resource|Get B2C directory resources in a subscription|
|B2C|Authorization|Authorization|Get B2C directory resources in a subscription|
|B2C|Authorization|Authorization|Get Custom IDP|
|B2C|Resource|Resource|Get Custom IDP|
|B2C|Resource|Resource|Get IDP|
|B2C|Authorization|Authorization|Get IDP|
|B2C|Authorization|Authorization|Get V1 and V2 applications|
|B2C|Application Management|Application|Get V1 and V2 applications|
|B2C|Authorization|Authorization|Get V1 application|
|B2C|Application Management|Application|Get V1 application|
|B2C|Authorization|Authorization|Get V1 applications|
|B2C|Application Management|Application|Get V1 applications|
|B2C|Application Management|Application|Get V2 application|
|B2C|Authorization|Authorization|Get V2 application|
|B2C|Application Management|Application|Get V2 applications|
|B2C|Authorization|Authorization|Get V2 applications|
|B2C|Resource|Resource|Get a B2C drectory resource|
|B2C|Authorization|Authorization|Get a B2C drectory resource|
|B2C|Authorization|Authorization|Get a list of custom domains in the tenant|
|B2C|Directory Management|Directory|Get a list of custom domains in the tenant|
|B2C|Authorization|Authorization|Get a user journey|
|B2C|Resource|Resource|Get a user journey|
|B2C|Resource|Resource|Get allowed application claims for user journey|
|B2C|Authorization|Authorization|Get allowed application claims for user journey|
|B2C|Resource|Resource|Get allowed self-asserted claims for user journey|
|B2C|Authorization|Authorization|Get allowed self-asserted claims for user journey|
|B2C|Resource|Resource|Get allowed self-asserted claims of policy|
|B2C|Authorization|Authorization|Get allowed self-asserted claims of policy|
|B2C|Resource|Resource|Get available output claims list|
|B2C|Authorization|Authorization|Get available output claims list|
|B2C|Resource|Resource|Get content definitions for user journey|
|B2C|Authorization|Authorization|Get content definitions for user journey|
|B2C|Authorization|Authorization|Get idps for a specific admin flow|
|B2C|Resource|Resource|Get idps for a specific admin flow|
|B2C|Key|Key|Get key container active key metadata in JWK|
|B2C|Authorization|Authorization|Get key container active key metadata in JWK|
|B2C|Key|Key|Get key container metadata|
|B2C|Resource|Resource|Get list of all admin flows|
|B2C|Authorization|Authorization|Get list of all admin flows|
|B2C|Authorization|Authorization|Get list of tags for all admin flows for all users|
|B2C|Resource|Resource|Get list of tags for all admin flows for all users|
|B2C|Resource|Resource|Get list of tenants for a user|
|B2C|Authorization|Authorization|Get list of tenants for a user|
|B2C|Resource|Resource|Get local accounts' self-asserted claims|
|B2C|Authorization|Authorization|Get local accounts' self-asserted claims|
|B2C|Resource|Resource|Get localized resource json|
|B2C|Authorization|Authorization|Get localized resource json|
|B2C|Authorization|Authorization|Get operations of Microsoft.AzureActiveDirectory resource provider|
|B2C|Resource|Resource|Get operations of Microsoft.AzureActiveDirectory resource provider|
|B2C|Resource|Resource|Get policies|
|B2C|Authorization|Authorization|Get policies|
|B2C|Resource|Resource|Get policy|
|B2C|Authorization|Authorization|Get policy|
|B2C|Directory Management|Directory|Get resource properties of a tenant|
|B2C|Authorization|Authorization|Get resource properties of a tenant|
|B2C|Resource|Resource|Get supported IDP list|
|B2C|Authorization|Authorization|Get supported IDP list|
|B2C|Resource|Resource|Get supported IDP list of the user journey|
|B2C|Authorization|Authorization|Get supported IDP list of the user journey|
|B2C|Directory Management|Directory|Get tenant Info|
|B2C|Authorization|Authorization|Get tenant Info|
|B2C|Directory Management|Directory|Get tenant allowed features|
|B2C|Authorization|Authorization|Get tenant allowed features|
|B2C|Authorization|Authorization|Get tenant defined Custom IDP list|
|B2C|Resource|Resource|Get tenant defined Custom IDP list|
|B2C|Resource|Resource|Get tenant defined IDP list|
|B2C|Authorization|Authorization|Get tenant defined IDP list|
|B2C|Resource|Resource|Get tenant defined local IDP list|
|B2C|Authorization|Authorization|Get tenant defined local IDP list|
|B2C|Resource|Resource|Get tenant details for a user for resource creation|
|B2C|Authorization|Authorization|Get tenant details for a user for resource creation|
|B2C|Authorization|Authorization|Get tenant list|
|B2C|Authorization|Authorization|Get tenantDomains|
|B2C|Directory Management|Directory|Get tenantDomains|
|B2C|Resource|Resource|Get the default supported culture for CPIM|
|B2C|Authorization|Authorization|Get the default supported culture for CPIM|
|B2C|Resource|Resource|Get the details of an admin flow|
|B2C|Authorization|Authorization|Get the details of an admin flow|
|B2C|Authorization|Authorization|Get the list of UserJourneys for this tenant|
|B2C|Resource|Resource|Get the list of UserJourneys for this tenant|
|B2C|Authorization|Authorization|Get the set of available supported cultures for CPIM|
|B2C|Resource|Resource|Get the set of available supported cultures for CPIM|
|B2C|Authorization|Authorization|Get trustFramework policy|
|B2C|Resource|Resource|Get trustFramework policy|
|B2C|Authorization|Authorization|Get trustFramework policy as xml|
|B2C|Resource|Resource|Get trustFramework policy as xml|
|B2C|Resource|Resource|Get user attribute|
|B2C|Authorization|Authorization|Get user attribute|
|B2C|Authorization|Authorization|Get user attributes|
|B2C|Resource|Resource|Get user attributes|
|B2C|Authorization|Authorization|Get user journey list|
|B2C|Resource|Resource|Get user journey list|
|B2C|Authorization|Authorization|GetIEFPolicies|
|B2C|Resource|Resource|GetIEFPolicies|
|B2C|Authorization|Authorization|GetIdentityProviders|
|B2C|Resource|Resource|GetIdentityProviders|
|B2C|Resource|Resource|GetTrustFrameworkPolicy|
|B2C|Authorization|Authorization|GetTrustFrameworkPolicy|
|B2C|Key|Key|Gets a CPIM key container in jwk format|
|B2C|Authorization|Authorization|Gets a CPIM key container in jwk format|
|B2C|Key|Key|Gets list of key containers in the tenant|
|B2C|Authorization|Authorization|Gets list of key containers in the tenant|
|B2C|Authorization|Authorization|Gets the type of tenant|
|B2C|Directory Management|Directory|Gets the type of tenant|
|B2C|Authentication|Authentication|Issue an access token to the application|
|B2C|Authentication|Authentication|Issue an authorization code to the application|
|B2C|Other|Other|Issue an authorization code to the application|
|B2C|Authentication|Authentication|Issue an id_token to the application|
|B2C|Other|Other|Issue an id_token to the application|
|B2C|Authorization|Authorization|MigrateTenantMetadata|
|B2C|Resource|Resource|MigrateTenantMetadata|
|B2C|Resource|Resource|Move resources|
|B2C|Authorization|Authorization|Patch IdentityProvider|
|B2C|Resource|Resource|Patch IdentityProvider|
|B2C|Resource|Resource|PutTrustFrameworkPolicy|
|B2C|Authorization|Authorization|PutTrustFrameworkPolicy|
|B2C|Authorization|Authorization|PutTrustFrameworkpolicy|
|B2C|Resource|Resource|PutTrustFrameworkpolicy|
|B2C|Resource|Resource|Remove a user journey|
|B2C|Authorization|Authorization|Remove a user journey|
|B2C|Authorization|Authorization|Restore a CPIM key container backup|
|B2C|Key|Key|Restore a CPIM key container backup|
|B2C|Application Management|Application|Retrieve V2 application permissions grants|
|B2C|Authorization|Authorization|Retrieve V2 application permissions grants|
|B2C|Application Management|Application|Retrieve V2 application service principals in the current tenant|
|B2C|Authorization|Authorization|Retrieve V2 application service principals in the current tenant|
|B2C|Key|Key|Save key container|
|B2C|Authorization|Authorization|Update Custom IDP|
|B2C|Resource|Resource|Update Custom IDP|
|B2C|Resource|Resource|Update IDP|
|B2C|Authorization|Authorization|Update IDP|
|B2C|Resource|Resource|Update Local IDP|
|B2C|Authorization|Authorization|Update Local IDP|
|B2C|Application Management|Application|Update V1 application|
|B2C|Authorization|Authorization|Update V1 application|
|B2C|Application Management|Application|Update V2 application|
|B2C|Authorization|Authorization|Update V2 application|
|B2C|Application Management|Application|Update V2 application permission grant|
|B2C|Authorization|Authorization|Update V2 application permission grant|
|B2C|Resource|Resource|Update a B2C directory resource|
|B2C|Resource|Resource|Update policy|
|B2C|Authorization|Authorization|Update policy|
|B2C|Resource|Resource|Update subscription status|
|B2C|Resource|Resource|Update user attribute|
|B2C|Authorization|Authorization|Update user attribute|
|B2C|Key|Key|Upload a CPIM encrypted key|
|B2C|Authorization|Authorization|Upload a CPIM encrypted key|
|B2C|Authorization|Authorization|User Authorization: API is disabled for tenant featureset|
|B2C|Authorization|Authorization|User Authorization: User granted access as 'Tenant Admin'|
|B2C|Authorization|Authorization|User Authorization: User was granted 'Authenticated Users' access rights|
|B2C|Authentication|Authentication|Validate local account credentials|
|B2C|Resource|Resource|Validate move resources|
|B2C|Authentication|Authentication|Validate user authentication|
|B2C|Directory Management|Directory|Verify if B2C feature is enabled|
|B2C|Authorization|Authorization|Verify if B2C feature is enabled|
|B2C|Authorization|Authorization|Verify if feature is enalbed|
|B2C|Directory Management|Directory|Verify if feature is enalbed|
|Core Directory|Application Management|Application|Add OAuth2PermissionGrant|
|Core Directory|Administrative Unit Management|AdministrativeUnit|Add administrative unit|
|Core Directory|User Management|User|Add app role assignment grant to user|
|Core Directory|Group Management|Group|Add app role assignment to group|
|Core Directory|Application Management|Application|Add app role assignment to service principal|
|Core Directory|Application Management|Application|Add application|
|Core Directory|Resource|Resource|Add device|
|Core Directory|Resource|Resource|Add device configuration|
|Core Directory|Role Management|Role|Add eligible member to role|
|Core Directory|Group Management|Group|Add group|
|Core Directory|Administrative Unit Management|AdministrativeUnit|Add member to administrative unit|
|Core Directory|Group Management|Group|Add member to group|
|Core Directory|Role Management|Role|Add member to role|
|Core Directory|Application Management|Application|Add owner to application|
|Core Directory|Group Management|Group|Add owner to group|
|Core Directory|Policy Management|Policy|Add owner to policy|
|Core Directory|Application Management|Application|Add owner to service principal|
|Core Directory|Directory Management|Directory|Add partner to company|
|Core Directory|Policy Management|Policy|Add policy|
|Core Directory|Application Management|Application|Add policy to service principal|
|Core Directory|Resource|Resource|Add registered owner to device|
|Core Directory|Resource|Resource|Add registered users to device|
|Core Directory|Role Management|Role|Add role assignment to role definition|
|Core Directory|Role Management|Role|Add role from template|
|Core Directory|Role Management|Role|Add scoped member to role|
|Core Directory|Application Management|Application|Add service principal|
|Core Directory|Application Management|Application|Add service principal credentials|
|Core Directory|Directory Management|Directory|Add unverified domain|
|Core Directory|User Management|User|Add user|
|Core Directory|User Management|User|Add users strong authentication phone app detail|
|Core Directory|Directory Management|Directory|Add verified domain|
|Core Directory|User Management|User|Change user license|
|Core Directory|User Management|User|Change user password|
|Core Directory|Application Management|Application|Consent to application|
|Core Directory|User Management|User|Convert federated user to managed|
|Core Directory|User Management|User|Create application password for user|
|Core Directory|Directory Management|Directory|Create company|
|Core Directory|Directory Management|Directory|Create company settings|
|Core Directory|Group Management|Group|Create group settings|
|Core Directory|Administrative Unit Management|AdministrativeUnit|Delete administrative unit|
|Core Directory|Application Management|Application|Delete application|
|Core Directory|User Management|User|Delete application password for user|
|Core Directory|Directory Management|Directory|Delete company settings|
|Core Directory|Resource|Resource|Delete device|
|Core Directory|Resource|Resource|Delete device configuration|
|Core Directory|Group Management|Group|Delete group|
|Core Directory|Group Management|Group|Delete group settings|
|Core Directory|Policy Management|Policy|Delete policy|
|Core Directory|User Management|User|Delete user|
|Core Directory|Directory Management|Directory|Demote partner|
|Core Directory|Resource|Resource|Device no longer compliant|
|Core Directory|Resource|Resource|Device no longer managed|
|Core Directory|Directory Management|Directory|Directory deleted|
|Core Directory|Directory Management|Directory|Directory deleted permanently|
|Core Directory|Directory Management|Directory|Directory scheduled for deletion|
|Core Directory|User Management|User|Disable account|
|Core Directory|User Management|User|Enable Strong Authentication|
|Core Directory|Group Management|Group|Finish applying group based license to users|
|Core Directory|Application Management|Application|Hard Delete application|
|Core Directory|Group Management|Group|Hard Delete group|
|Core Directory|User Management|User|Hard Delete user|
|Core Directory|Directory Management|Directory|Promote company to partner|
|Core Directory|Directory Management|Directory|Purge rights management properties|
|Core Directory|Application Management|Application|Remove OAuth2PermissionGrant|
|Core Directory|Group Management|Group|Remove app role assignment from group|
|Core Directory|Application Management|Application|Remove app role assignment from service principal|
|Core Directory|User Management|User|Remove app role assignment from user|
|Core Directory|Role Management|Role|Remove eligible member from role|
|Core Directory|Administrative Unit Management|AdministrativeUnit|Remove member from administrative unit|
|Core Directory|Group Management|Group|Remove member from group|
|Core Directory|Role Management|Role|Remove member from role|
|Core Directory|Application Management|Application|Remove owner from application|
|Core Directory|Group Management|Group|Remove owner from group|
|Core Directory|Application Management|Application|Remove owner from service principal|
|Core Directory|Directory Management|Directory|Remove partner from company|
|Core Directory|Policy Management|Policy|Remove policy credentials|
|Core Directory|Application Management|Application|Remove policy from service principal|
|Core Directory|Resource|Resource|Remove registered owner from device|
|Core Directory|Resource|Resource|Remove registered users from device|
|Core Directory|Role Management|Role|Remove role assignment from role definition|
|Core Directory|Role Management|Role|Remove scoped member from role|
|Core Directory|Application Management|Application|Remove service principal|
|Core Directory|Application Management|Application|Remove service principal credentials|
|Core Directory|Directory Management|Directory|Remove unverified domain|
|Core Directory|User Management|User|Remove users strong authentication phone app detail|
|Core Directory|Directory Management|Directory|Remove verified domain|
|Core Directory|User Management|User|Reset user password|
|Core Directory|Group Management|Group|Restore Group|
|Core Directory|Application Management|Application|Restore application|
|Core Directory|User Management|User|Restore user|
|Core Directory|Application Management|Application|Revoke consent|
|Core Directory|Directory Management|Directory|Set Company Information|
|Core Directory|Directory Management|Directory|Set DirSync feature|
|Core Directory|Directory Management|Directory|Set DirSyncEnabled flag|
|Core Directory|Directory Management|Directory|Set Partnership|
|Core Directory|Directory Management|Directory|Set accidental deletion threshold|
|Core Directory|Directory Management|Directory|Set company allowed data location|
|Core Directory|Directory Management|Directory|Set company multinational feature enabled|
|Core Directory|Directory Management|Directory|Set directory feature on tenant|
|Core Directory|Directory Management|Directory|Set domain authentication|
|Core Directory|Directory Management|Directory|Set federation settings on domain|
|Core Directory|User Management|User|Set force change user password|
|Core Directory|Group Management|Group|Set group license|
|Core Directory|Group Management|Group|Set group to be managed by user|
|Core Directory|Directory Management|Directory|Set password policy|
|Core Directory|Directory Management|Directory|Set rights management properties|
|Core Directory|User Management|User|Set user manager|
|Core Directory|User Management|User|Set users oath token metadata enabled|
|Core Directory|Group Management|Group|Start applying group based license to users|
|Core Directory|Group Management|Group|Trigger group license recalculation|
|Core Directory|User Management|User|Update StsRefreshTokenValidFrom Timestamp|
|Core Directory|Administrative Unit Management|AdministrativeUnit|Update administrative unit|
|Core Directory|Application Management|Application|Update application|
|Core Directory|Directory Management|Directory|Update company|
|Core Directory|Directory Management|Directory|Update company settings|
|Core Directory|Resource|Resource|Update device|
|Core Directory|Resource|Resource|Update device configuration|
|Core Directory|Directory Management|Directory|Update domain|
|Core Directory|User Management|User|Update external secrets|
|Core Directory|Application Management|Application|Update external secrets|
|Core Directory|Group Management|Group|Update group|
|Core Directory|Group Management|Group|Update group settings|
|Core Directory|Policy Management|Policy|Update policy|
|Core Directory|Role Management|Role|Update role|
|Core Directory|Application Management|Application|Update service principal|
|Core Directory|User Management|User|Update user|
|Core Directory|Directory Management|Directory|Verify domain|
|Core Directory|Directory Management|Directory|Verify email verified domain|
|Identity Protection|User Management|User|Admin generates a temporary password|
|Identity Protection|User Management|User|Admins requires the user to reset their password|
|Identity Protection|Other|Other|Download a single risk event type|
|Identity Protection|Other|Other|Download admins and status of weekly digest opt-in|
|Identity Protection|Other|Other|Download all risk event types|
|Identity Protection|Other|Other|Download free user risk events|
|Identity Protection|Other|Other|Download users flagged for risk|
|Identity Protection|Directory Management|Directory|Onboarding|
|Identity Protection|Policy Management|Policy|Set MFA registration policy|
|Identity Protection|Policy Management|Policy|Set sign-in risk policy|
|Identity Protection|Policy Management|Policy|Set user risk policy|
|Identity Protection|Directory Management|Directory|Update alert settings|
|Identity Protection|Directory Management|Directory|Update weekly digest settings|
|Invited Users|User Management|User|Assign external user to application|
|Invited Users|Other|Other|Batch invites processed|
|Invited Users|Other|Other|Batch invites uploaded|
|Invited Users|User Management|User|Email not sent, user unsubscribed|
|Invited Users|User Management|User|Invite external user|
|Invited Users|User Management|User|Redeem external user invite|
|Invited Users|User Management|User|Viral tenant creation|
|Invited Users|User Management|User|Viral user creation|
|Microsoft Identity Manager (MIM)|Group Management|Group|Add Member|
|Microsoft Identity Manager (MIM)|Group Management|Group|Create Group|
|Microsoft Identity Manager (MIM)|Group Management|Group|Delete Group|
|Microsoft Identity Manager (MIM)|Group Management|Group|Remove Member|
|Microsoft Identity Manager (MIM)|Group Management|Group|Update Group|
|Microsoft Identity Manager (MIM)|User Management|User|User Password Registration|
|Microsoft Identity Manager (MIM)|User Management|User|User Password Reset|
|Privileged Identity Management|Role Management|Role|AccessReview_Review|
|Privileged Identity Management|Role Management|Role|AccessReview_Update|
|Privileged Identity Management|Role Management|Role|ActivationAborted|
|Privileged Identity Management|Role Management|Role|ActivationApproved|
|Privileged Identity Management|Role Management|Role|ActivationCanceled|
|Privileged Identity Management|Role Management|Role|ActivationRequested|
|Privileged Identity Management|Role Management|Role|Added|
|Privileged Identity Management|Role Management|Role|Assign|
|Privileged Identity Management|Role Management|Role|Elevate|
|Privileged Identity Management|Role Management|Role|Removed|
|Privileged Identity Management|Role Management|Role|Role Setting changes|
|Privileged Identity Management|Role Management|Role|ScanAlertsNow|
|Privileged Identity Management|Role Management|Role|Signup|
|Privileged Identity Management|Role Management|Role|Unelevate|
|Privileged Identity Management|Role Management|Role|UpdateAlertSettings|
|Privileged Identity Management|Role Management|Role|UpdateCurrentState|
|Self-service Group Management|Group Management|Group|Approve a pending request to join a group|
|Self-service Group Management|Group Management|Group|Cancel a pending request to join a group|
|Self-service Group Management|Group Management|Group|Create lifecycle management policy|
|Self-service Group Management|Group Management|Group|Delete a pending request to join a group|
|Self-service Group Management|Group Management|Group|Reject a pending request to join a group|
|Self-service Group Management|Group Management|Group|Renew group|
|Self-service Group Management|Group Management|Group|Request to join a group|
|Self-service Group Management|Group Management|Group|Set dynamic group properties|
|Self-service Group Management|Group Management|Group|Update lifecycle management policy|
|Self-service Password Management|User Management|User|Blocked from self-service password reset|
|Self-service Password Management|User Management|User|Change password (self-service)|
|Self-service Password Management|Directory Management|Directory|Disable password writeback for directory|
|Self-service Password Management|Directory Management|Directory|Enable password writeback for directory|
|Self-service Password Management|User Management|User|Reset password (by admin)|
|Self-service Password Management|User Management|User|Reset password (self-service)|
|Self-service Password Management|User Management|User|Self-serve password reset flow activity progress|
|Self-service Password Management|User Management|User|Self-service password reset flow activity progress|
|Self-service Password Management|User Management|User|Unlock user account (self-service)|
|Self-service Password Management|User Management|User|User registered for self-service password reset|
|Terms Of Use|Policy Management|Policy|Accept Terms Of Use|
|Terms Of Use|Policy Management|Policy|Create Terms Of Use|
|Terms Of Use|Policy Management|Policy|Decline Terms Of Use|
|Terms Of Use|Policy Management|Policy|Delete Terms Of Use|
|Terms Of Use|Policy Management|Policy|Edit Terms Of Use|
|Terms Of Use|Policy Management|Policy|Publish Terms Of Use|
|Terms Of Use|Policy Management|Policy|Unpublish Terms Of Use|




## Next steps

For an overview of reporting, see the [Azure Active Directory reporting](active-directory-reporting-azure-portal.md).

