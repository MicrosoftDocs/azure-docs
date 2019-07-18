---
title: Migrate users with social identities in Azure Active Directory B2C | Microsoft Docs
description: Discuss core concepts on the migration of users with social identities into Azure AD B2C using Graph API.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/03/2018
ms.author: marsma
ms.subservice: B2C
---

# Azure Active Directory B2C: Migrate users with social identities
When you plan to migrate your identity provider to Azure AD B2C, you may also need to migrate users with social identities. This article explains how to migrate existing social identities accounts, such as: Facebook, LinkedIn, Microsoft, and Google accounts to Azure AD B2C. This article also applies to federated identities, however these migrations are less common.

## Prerequisites
This article is a continuation of the user migration article, and focuses on social identity migration. Before you start, read [user migration](active-directory-b2c-user-migration.md).

## Social identities migration introduction

* In Azure AD B2C, **local accounts** sign-in names (user name or email address) are stored in the `signInNames` collection in the user record. The `signInNames` contains one or more `signInName` records that specify the sign-in names for the user. Each sign-in name must be unique across the tenant.

* **Social accounts'** identities are stored in `userIdentities` collection. The entry specifies the `issuer` (identity provider name) such as facebook.com and the `issuerUserId`, which is a unique user identifier for the issuer. The `userIdentities` attribute contains one or more UserIdentity records that specify the social account type and the unique user identifier from the social identity provider.

* **Combine local account with social identity**. As mentioned, local account sign-in names, and social account identities are stored in different attributes. `signInNames` is used for local account, while `userIdentities` for social account. A single Azure AD B2C account, can be a local account only, social account only, or combine a local account with social identity in one user record. This behavior allows you to manage a single account, while a user can sign in with the local account credential(s) or with the social identities.

* `UserIdentity` Type - Contains information about the identity of a social account user in an Azure AD B2C tenant:
  * `issuer` The string representation of the identity provider that issued the user identifier, such as facebook.com.
  * `issuerUserId` The unique user identifier used by the social identity provider in base64 format.

    ```JSON
    "userIdentities": [{
          "issuer": "Facebook.com",
          "issuerUserId": "MTIzNDU2Nzg5MA=="
      }
    ]
    ```

* Depending on the identity provider, the **Social user ID** is a unique value for a given user per application or development account. Configure the Azure AD B2C policy with the same application ID that was previously assigned by the social provider. Or another application within the same development account.

## Use Graph API to migrate users
You create the Azure AD B2C user account via [Graph API](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-devquickstarts-graph-dotnet). 
To communicate with the Graph API, you first must have a service account with administrative privileges. In Azure AD, you register an application and authentication to Azure AD. The application credentials are Application ID and Application Secret. The application acts as itself, not as a user, to call the Graph API. Follow the instructions in step 1 in [User migration](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-user-migration) article.

## Required properties
The following list shows the properties that are required when you create a user.
* **accountEnabled** - true
* **displayName** - The name to display in the address book for the user.
* **passwordProfile** - The password profile for the user. 

> [!NOTE]
> For social account only (without local account credentials), you still must specify the password. Azure AD B2C ignores the password you specify for social accounts.

* **userPrincipalName** - The user principal name (someuser@contoso.com). The user principal name must contain one of the verified domains for the tenant. To specify the UPN, generate new GUID value, concatenate with `@` and your tenant name.
* **mailNickname** - The mail alias for the user. This value can be the same ID that you use for the userPrincipalName. 
* **signInNames** - One or more SignInName records that specify the sign-in names for the user. Each sign-in name must be unique across the company/tenant. For social account only, this property can be left empty.
* **userIdentities** - One or more UserIdentity records that specify the social account type and the unique user identifier from the social identity provider.
* [optional] **otherMails** - For social account only, the user's email addresses 

For more information, see: [Graph API reference](/previous-versions/azure/ad/graph/api/users-operations#CreateLocalAccountUser)

## Migrate social account (only)
To create social account only, without local account credentials. Send HTTPS POST request to Graph API. The request body contains the properties of the social account user to create. At a minimum, you must specify the required properties. 


**POST**  https://graph.windows.net/tenant-name.onmicrosoft.com/users

Submit the following form-data: 

```JSON
{
	"objectId": null,
	"accountEnabled": true,
	"mailNickname": "c8c3d3b8-60cf-4c76-9aa7-eb3235b190c8",
	"signInNames": [],
	"creationType": null,
	"displayName": "Sara Bell",
	"givenName": "Sara",
	"surname": "Bell",
	"passwordProfile": {
		"password": "Test1234",
		"forceChangePasswordNextLogin": false
	},
	"passwordPolicies": null,
	"userIdentities": [{
			"issuer": "Facebook.com",
			"issuerUserId": "MTIzNDU2Nzg5MA=="
		}
	],
	"otherMails": ["sara@live.com"],
	"userPrincipalName": "c8c3d3b8-60cf-4c76-9aa7-eb3235b190c8@tenant-name.onmicrosoft.com"
}
```
## Migrate social account with local account
To create a combined local account with social identities. Send HTTPS POST request to Graph API. The request body contains the properties of the social account user to create. At a minimum, you must specify the required properties. 

**POST**  https://graph.windows.net/tenant-name.onmicrosoft.com/users

Submit following form-data: 

```JSON
{
	"objectId": null,
	"accountEnabled": true,
	"mailNickname": "5164db16-3eee-4629-bfda-dcc3326790e9",
	"signInNames": [{
			"type": "emailAddress",
			"value": "david@contoso.com"
		}
	],
	"creationType": "LocalAccount",
	"displayName": "David Hor",
	"givenName": "David",
	"surname": "Hor",
	"passwordProfile": {
		"password": "1234567",
		"forceChangePasswordNextLogin": false
	},
	"passwordPolicies": "DisablePasswordExpiration,DisableStrongPassword",
	"userIdentities": [{
			"issuer": "contoso.com",
			"issuerUserId": "ZGF2aWRAY29udG9zby5jb20="
		}
	],
	"otherMails": [],
	"userPrincipalName": "5164db16-3eee-4629-bfda-dcc3326790e9@tenant-name.onmicrosoft.com"
}
```

## Frequently asked questions
### How can I know the issuer name?
The issuer name, or the identity provider name, is configured in your policy. If you don't know the value to specify in `issuer`, follow this procedure:
1. Sign in with one of the social accounts
2. From the JWT token, copy the `sub` value. The `sub` usually contains the user's object ID in Azure AD B2C. Or from Azure portal, open the user's properties and copy the object ID.
3. Open [Azure AD Graph Explorer](https://graphexplorer.azurewebsites.net)
4. Sign in with your administrator.
5. Run following GET request. Replace the userObjectId with the user ID you copied. **GET** https://graph.windows.net/tenant-name.onmicrosoft.com/users/userObjectId
6. Locate the `userIdentities` element inside the JSON return from Azure AD B2C.
7. [Optional] You may also want to decode the `issuerUserId` value.

> [!NOTE]
> Use a B2C tenant administrator account that is local to the B2C tenant. The account name syntax is admin@tenant-name.onmicrosoft.com.

### Is it possible to add social identity to an existing local account?
Yes. You can add the social identity after the local account has been created. Run HTTPS PATCH request. Replace the userObjectId with the user ID you want to update. 

**PATCH** https://graph.windows.net/tenant-name.onmicrosoft.com/users/userObjectId

Submit following form-data: 

```JSON
{
    "userIdentities": [
        {
            "issuer": "Facebook.com",
            "issuerUserId": "MTIzNDU2Nzg5MA=="
        }
    ]
}
```

### Is it possible to add multiple social identities?
Yes. You can add multiple social identities for a single Azure AD B2C account. Run HTTPS PATCH request. Replace the userObjectId with the user ID. 

**PATCH** https://graph.windows.net/tenant-name.onmicrosoft.com/users/userObjectId

Submit following form-data: 

```JSON
{
    "userIdentities": [
        {
            "issuer": "google.com",
            "issuerUserId": "MjQzMjE2NTc4NTQ="
        },
        {
            "issuer": "facebook.com",
            "issuerUserId": "MTIzNDU2Nzg5MA=="
        }
    ]
}
```

## [Optional] User migration application sample
[Download and run the sample app V2](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/aadb2c-user-migration). The sample app V2 uses a JSON file that contains dummy user data, including: local account, social account, and local & social identities in single account.  To edit the JSON file, open the `AADB2C.UserMigration.sln` Visual Studio solution. In the `AADB2C.UserMigration` project, open the `UsersData.json` file. The file contains a list of user entities. Each user entity has the following properties:
* **signInName** - For local account, e-mail address to sign-in
* **displayName** - User's display name
* **firstName** - User's first name
* **lastName** - User's last name
* **password** For local account, user's password (can be empty)
* **issuer** - For social account, the identity provider name
* **issuerUserId** - For social account, the unique user identifier used by the social identity provider. The value should be in clear text. The sample app encodes this value to  base64.
* **email** For social account only (not combined), user's email address

```JSON
{
  "userType": "emailAddress",
  "Users": [
    {
      // Local account only
      "signInName": "James@contoso.com",
      "displayName": "James Martin",
      "firstName": "James",
      "lastName": "Martin",
      "password": "Pass!w0rd"
    },
    {
      // Social account only
      "issuer": "Facebook.com",
      "issuerUserId": "1234567890",
      "email": "sara@contoso.com",
      "displayName": "Sara Bell",
      "firstName": "Sara",
      "lastName": "Bell"
    },
    {
      // Combine local account with social identity
      "signInName": "david@contoso.com",
      "issuer": "Facebook.com",
      "issuerUserId": "0987654321",
      "displayName": "David Hor",
      "firstName": "David",
      "lastName": "Hor",
      "password": "Pass!w0rd"
    }
  ]
}
```

> [!NOTE]
> If you don't update the UsersData.json file in the sample with your data, you can sign-in with the sample local account credentials but not with the social account examples. To migrate your social accounts, provide real data.

For more information, how to use the sample app, see [Azure Active Directory B2C: User migration](active-directory-b2c-user-migration.md)
