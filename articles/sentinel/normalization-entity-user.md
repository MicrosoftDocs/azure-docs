---
title: The Advanced Security Information Model (ASIM) User Entity reference | Microsoft Docs
description: This article displays the Microsoft Sentinel User Entity schema.
author: oshezaf
ms.topic: reference
ms.date: 07/18/2025
ms.author: ofshezaf



#Customer intent: As a security analyst, I want to understand the ASIM User Entity so that I can accurately understand user information captured in normalized events, enabling consistent and comprehensive monitoring across security platforms and improving threat detection and response efforts.

---

# The Advanced Security Information Model (ASIM) User Entity

Users are central to activities reported by events. The user entity fields listed in this section are used to describe the users involved in the action. When used in an event, prefixes are used to designate the role of a user entity in the activity. The prefixes `Src` and `Dst` are used to designate the user role in network related events, in which a source system and a destination system communicate. The prefixes 'Actor' and 'Target' are used for system oriented events such as process events.

## The user ID and scope

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="userid"></a>**UserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the  user.  |
| <a name="userscope"></a>**UserScope** | Optional | string | The scope in which [UserId](#userid) and [Username](#username) are defined. For example, a Microsoft Entra tenant domain name. The [UserIdType](#useridtype) field represents also the type of the associated with this field. |
| <a name="userscopeid"></a>**UserScopeId** | Optional | string | The ID of the scope in which [UserId](#userid) and [Username](#username) are defined. For example, a Microsoft Entra tenant directory ID. The [UserIdType](#useridtype) field represents also the type of the associated with this field. |
| <a name="useridtype"></a>**UserIdType** | Optional | UserIdType | The type of the ID stored in the [UserId](#userid) field. |
| **UserSid**, **UserUid**, **UserAadId**, **UserOktaId**, **UserAWSId**, **UserPuid** | Optional | String | Fields used to store specific user IDs. Select the ID most associated with the event as the primary ID stored in [UserId](#userid). Populate the relevant specific ID field, in addition to [UserId](#userid), even if the event has only one ID. |
| **UserAADTenant**, **UserAWSAccount** | Optional | String | Fields used to store specific scopes. Use the [UserScope](#userscope) field for the scope associated with the ID stored in the [UserId](#userid) field.  Populate the relevant specific scope field, in addition to [UserScope](#userscope), even if the event has only one ID. | 

The allowed values for a user ID type are:

| Type | Description | Example |
| ---- | ------- | ------------- |
| **SID** | A Windows user ID. | `S-1-5-21-1377283216-344919071-3415362939-500` |
| **UID** | A Linux user ID. | `4578` |
| **AADID**| A Microsoft Entra user ID.| `00aa00aa-bb11-cc22-dd33-44ee44ee44ee` |
| **OktaId** | An Okta user ID. |  `00urjk4znu3BcncfY0h7` |
| **AWSId** | An AWS user ID. | `72643944673` |
| **PUID** | A Microsoft 365 user ID. | `10032001582F435C` |
| **SalesforceId** | A Salesforce user ID. | `00530000009M943` |

## The user name

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="username"></a>**Username** | Optional | String | The source username, including domain information when available. Use the simple form only if domain information isn't available. Store the Username type in the [UsernameType](#usernametype) field. |
| <a name="usernametype"></a>**UsernameType** | Optional | UsernameType | Specifies the type of the username stored in the [Username](#username) field.  |
| **UserUPN**, **WindowsUsername**, **DNUsername**, **SimpleUsername** |  Optional | String | Fields used to store additional usernames, if the original event includes multiple usernames. Select the username most associated with the event as the primary username stored in [Username](#username). |

The allowed values for a username type are:

| Type | Description | Example |
| ---- | ------- | ------------- |
| **UPN** | A UPN or Email address username designator. | `johndow@contoso.com`  |
| **Windows** | A Windows username including a domain. | `Contoso\johndow` |
| **DN**| An LDAP distinguished name designator.| `CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM` |
| **Simple** | A simple user name without a domain designator. |  `johndow` |
| **AWSId** | An AWS user ID. | `72643944673` |


## Additional user fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="usertype"></a>**UserType** | Optional | UserType | The type of source user. Supported values include:<br> - `Regular`<br> - `Machine`<br> - `Admin`<br> - `System`<br> - `Application`<br> - `Service Principal`<br> - `Service`<br> - `Anonymous`<br> - `Other`.<br><br> The value might be provided in the source record by using different terms, which should be normalized to these values. Store the original value in the [OriginalUserType](#originalusertype) field. |
| <a name="originalusertype"></a>**OriginalUserType** | Optional | String | The original destination user type, if provided by the reporting device. |