<properties 
   pageTitle="Azure Active Directory Audit Report Events" 
   description="Audited events that are available for viewing and downloading from your Azure Active Directory" 
   services="active-directory" 
   documentationCenter="" 
   authors="kenhoff" 
   manager="mbaldwin" 
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity" 
   ms.date="04/13/2015"
   ms.author="kenhoff"/>

# Azure Active Directory Audit Report Events

The Azure Active Directory Audit Report helps customers identify privileged actions that occurred in their Azure Active Directory. Privileged actions include elevation changes (for example, role creation or password resets), changing policy configurations (for example password policies), or changes to directory configuration (for example, changes to domain federation settings). The reports provide the audit record for the event name, the actor who performed the action, the target resource affected by the change, and the date and time (in UTC). Customers are able to retrieve the list of audit events for their Azure Active Directory via the [Azure Management Portal](https://manage.windowsazure.com/).  

## Properties included with each audit event

| Property	| Description								|
| ------	| ------								|		
| Date and Time	| The date and time that the audit event occured			|
| Actor		| The user or service principal that performed the action		|
| Action	| The action that was performed						|
| Target	| The user or service principal that the action was performed on	|

## List of Audit Report Events

<!--- audit event descriptions should be in the past tense --->

| Events 				| Event Description																				|
| ------------------------------	| -------																					|
| Add User				| Added a user to the directory.																		|
| Delete User				| Deleted a user from the directory.																		|
| Set license properties		| Set the license properties for a user in the directory.															|
| Reset user password			| Reset the password for a user in the directory.																|
| Change user password			| Changed the password for a user in the directory.																|
| Change user license			| Changed the license assigned to a user in the directory.															|
| Update user				| Updated a user in the directory.																		|
| Add role member to Role		| Added a user to a directory role.																		|
| Remove role member from Role		| Removed a user from a directory role.																	|
| Set Company contact information	| Set company-level contact preferences. This includes email addresses for marketing, as well as technical notifications about Microsoft Online Services.			|
| Add partner to company		| Added a partner to the directory.																		|
| Remove Partner from company		| Removed a partner from the directory.																		|
| Add service principal			| Added a service principal to the directory.																	|
| Remove service principal		| Removed a service principal from the directory.																|
| Add service principal credentials	| Added credentials to a service principal.																	|
| Remove service principal credentials	| Removed credentials from a service principal.																	|
| Add domain to company			| Added a domain to the directory.																		|
| Remove domain from company		| Removed a domain from the directory.																		|
| Update domain				| Updated a domain on the directory.																		|
| Set domain authentication		| Changed the default domain setting for the company																|
| Set federation settings on domain	| Updated the federation settings for a domain.																	|
| Verify domain				| Verified a domain on the directory.																		|
| Verify email verified domain		| Verified a domain on the directory using email verification.															|
| Add delegation entry			| Added a delegation entry to the directory.																	|
| Set delegation entry			| Update a delegation entry in the directory.																	|
| Remove delegation entry		| Removed a delegation entry from the directory.																|
| Set DirSyncEnabled flag on company	| Set the property that enables a directory for Azure AD Sync.															|
| Set Password Policy			| Set length and character constraints for user passwords.															|
| Set Company Information		| Updated the company-level information. See the [Get-MsolCompanyInformation](https://msdn.microsoft.com/library/azure/dn194126.aspx) PowerShell cmdlet for more details.	|
| Set force change user password	| Set the property that forces a user to change their password on login.													|

<!--- 

List of events that still need descriptions:

Restore Application
Set String Auth Policy
Promote tenant to partner

--->

### User attributes included in the Update User audit event

The "Update user" audit event includes additional information about what user attributes were updated. For each attribute, both the previous value and the new value is included.

| Attribute 				| Description																			|
| ---------------------------------	| ---------																			|
| AccountEnabled			| The user is allowed to sign in.																|
| AssignedLicense			| All licenses that have been assigned to the user.														|
| AssignedPlan				| Service plans resulting from the licenses assigned to the user.												|
| LicenseAssignmentDetail		| Details on licenses assigned to the user. For instance, if group-based licensing was involved, this would include the group that granted the license.		|
| Mobile				| The user's mobile phone.																	|
| OtherMail				| The user's alternate email address.																|
| OtherMobile				| The user's alternate mobile phone.																|
| StrongAuthenticationMethod		| A list of verification methods configured by the user for Multi-Factor Authentication, such as Voice Call, SMS, or Verification code from a mobile app.	|
| StrongAuthenticationRequirement	| If Multi-Factor Authentication is enforced, enabled, or disabled for this user.										|
| StrongAuthenticationUserDetails	| The user’s phone number, alternative phone number and email address used for Multi-Factor Authentication and password reset verification.			|
| TelephoneNumber			| The user's telephone number.																	|

Audit records are a required control for many compliance regulations. For customers using the Azure Active Directory Audit Report to meet their compliance regulations, it is recommended that the customer submit a copy of this help topic with the copy of the customer’s exported audit report to help explain the report details. If the auditor would like to understand the compliance regulations that Azure currently meets, direct the auditor to the [Compliance page](http://azure.microsoft.com/support/trust-center/compliance/) of the Microsoft Azure Trust Center.
