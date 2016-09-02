<properties
   pageTitle="Azure Active Directory audit report events | Microsoft Azure"
   description="Audited events that are available for viewing and downloading from your Azure Active Directory"
   services="active-directory"
   documentationCenter=""
   authors="dhanyahk"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="07/25/2016"
   ms.author="dhanyahk"/>

# Azure Active Directory audit report events

*This documentation is part of the [Azure Active Directory Reporting Guide](active-directory-reporting-guide.md).*

The Azure Active Directory Audit Report helps customers identify privileged actions that occurred in their Azure Active Directory. Privileged actions include elevation changes (for example, role creation or password resets), changing policy configurations (for example password policies), or changes to directory configuration (for example, changes to domain federation settings). The reports provide the audit record for the event name, the actor who performed the action, the target resource affected by the change, and the date and time (in UTC). Customers are able to retrieve the list of audit events for their Azure Active Directory via the [Azure Management Portal](https://manage.windowsazure.com/), as described in [View your access and usage reports](active-directory-view-access-usage-reports.md).


## List of Audit Report Events
<!--- audit event descriptions should be in the past tense --->

Events                               | Event Description
------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**User events**                      |
Add User                             | Added a user to the directory.
Delete User                          | Deleted a user from the directory.
Set license properties               | Set the license properties for a user in the directory.
Reset user password                  | Reset the password for a user in the directory.
Change user password                 | Changed the password for a user in the directory.
Change user license                  | Changed the license assigned to a user in the directory. To see what licenses were updated, look at the "Update user" event immediately before or after this event.
Update user                          | Updated a user in the directory. [See below](#quotupdate-userquot-attributes) for attributes that can be updated.
Set force change user password       | Set the property that forces a user to change their password on login.
**Group events**                     |
Add group                            | Created a group in the directory.
Update group                         | Updated a group in the directory.
Delete group                         | Deleted a group from the directory.
Add member to group                  | Added a member to a group in the directory.
Remove member from group             | Removed a member from a group in the directory.
**Application events**               |
Add service principal                | Added a service principal to the directory.
Remove service principal             | Removed a service principal from the directory.
Add service principal credentials    | Added credentials to a service principal.
Remove service principal credentials | Removed credentials from a service principal.
Add delegation entry                 | Created an [OAuth2PermissionGrant](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permissiongrant-entity) in the directory.
Set delegation entry                 | Updated an [OAuth2PermissionGrant](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permissiongrant-entity) in the directory.
Remove delegation entry              | Deleted an [OAuth2PermissionGrant](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permissiongrant-entity) in the directory.
**Role events**                      |
Add role member to Role              | Added a user to a directory role.
Remove role member from Role         | Removed a user from a directory role.
Set Company contact information      | Set company-level contact preferences. This includes email addresses for marketing, as well as technical notifications about Microsoft Online Services.
**B2B events**                       |
Batch invites uploaded.              | An administrator has uploaded a file containing invitations to be sent to partner users.
Batch invites processed.             | A file containing invitations to partner users has been processed.
Invite external user.                | An external user has been invited to the directory.
Redeem external user invite.         | An external user has redeemed their invitation to the directory.
Add external user to group.          | An external user has been assigned membership to a group in the directory.
Assign external user to application. | An external user has been assigned direct access to an application.
Viral tenant creation.               | A new tenant has been created in Azure AD by the invitation redemption.
Viral user creation.                 | A user has been created in an existing tenant in Azure AD by the invitation redemption.
**Directory events**                 |
Add partner to company               | Added a partner to the directory.
Remove Partner from company          | Removed a partner from the directory.
Add domain to company                | Added a domain to the directory.
Remove domain from company           | Removed a domain from the directory.
Update domain                        | Updated a domain on the directory.
Set domain authentication            | Changed the default domain setting for the company.
Set federation settings on domain    | Updated the federation settings for a domain.
Verify domain                        | Verified a domain on the directory.
Verify email verified domain         | Verified a domain on the directory using email verification.
Set DirSyncEnabled flag on company   | Set the property that enables a directory for Azure AD Sync.
Set Password Policy                  | Set length and character constraints for user passwords.
Set Company Information              | Updated the company-level information. See the [Get-MsolCompanyInformation](https://msdn.microsoft.com/library/azure/dn194126.aspx) PowerShell cmdlet for more details.

<!---

List of events that still need descriptions:

Restore Application
Set String Auth Policy
Promote tenant to partner

--->

## Audit report retention
Events in the Azure AD Audit report are retained for 180 days. For more information about retention on reports, see [Azure Active Directory Report Retention Policies](active-directory-reporting-retention.md).

For customers interested in storing their audit events for longer retention periods, the Reporting API can be used to regularly pull audit events into a separate data store. See [Getting Started with the Reporting API](active-directory-reporting-api-getting-started.md) for details.

## Properties included with each audit event

Property      | Description
------------- | --------------------------------------------------------------
Date and Time | The date and time that the audit event occured
Actor         | The user or service principal that performed the action
Action        | The action that was performed
Target        | The user or service principal that the action was performed on


## "Update User" attributes
The "Update user" audit event includes additional information about what user attributes were updated. For each attribute, both the previous value and the new value is included.

Attribute                       | Description
------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------
AccountEnabled                  | The user is allowed to sign in.
AssignedLicense                 | All licenses that have been assigned to the user.
AssignedPlan                    | Service plans resulting from the licenses assigned to the user.
LicenseAssignmentDetail         | Details on licenses assigned to the user. For instance, if group-based licensing was involved, this would include the group that granted the license.
Mobile                          | The user's mobile phone.
OtherMail                       | The user's alternate email address.
OtherMobile                     | The user's alternate mobile phone.
StrongAuthenticationMethod      | A list of verification methods configured by the user for Multi-Factor Authentication, such as Voice Call, SMS, or Verification code from a mobile app.
StrongAuthenticationRequirement | If Multi-Factor Authentication is enforced, enabled, or disabled for this user.
StrongAuthenticationUserDetails | The user’s phone number, alternative phone number and email address used for Multi-Factor Authentication and password reset verification.
TelephoneNumber                 | The user's telephone number.

Audit records are a required control for many compliance regulations. For customers using the Azure Active Directory Audit Report to meet their compliance regulations, it is recommended that the customer submit a copy of this help topic with the copy of the customer's exported audit report to help explain the report details. If the auditor would like to understand the compliance regulations that Azure currently meets, direct the auditor to the [Compliance page](https://azure.microsoft.com/support/trust-center/compliance/) of the Microsoft Azure Trust Center.
