---
title: User profile attributes in Azure Active Directory B2C
description: Learn about the user resource type attributes that are supported by the Azure AD B2C directory user profile. Find out about built-in attributes, extensions, and how attributes map to Microsoft Graph.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 01/10/2023
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: b2c-support
---

# User profile attributes

Your Azure Active Directory B2C (Azure AD B2C) directory user profile comes with a set of built-in attributes, such as given name, surname, city, postal code, and phone number. You can extend the user profile with your own application data without requiring an external data store.

Most of the attributes that can be used with Azure AD B2C user profiles are also supported by Microsoft Graph. This article describes supported Azure AD B2C user profile attributes. It also notes those attributes that are not supported by Microsoft Graph, as well as Microsoft Graph attributes that should not be used with Azure AD B2C.

> [!IMPORTANT]
> You shouldn't use built-in or extension attributes to store sensitive personal data, such as account credentials, government identification numbers, cardholder data, financial account data, healthcare information, or sensitive background information.

You can also integrate with external systems. For example, you can use Azure AD B2C for authentication, but delegate to an external customer relationship management (CRM) or customer loyalty database as the authoritative source of customer data. For more information, see the [remote profile](https://github.com/azure-ad-b2c/samples/tree/master/policies/remote-profile) solution.

## Azure AD user resource type

The table below lists the [user resource type](/graph/api/resources/user) attributes that are supported by the Azure AD B2C directory user profile. It gives the following information about each attribute:

- Attribute name used by Azure AD B2C (followed by the Microsoft Graph name in parentheses, if different)
- Attribute data type
- Attribute description
- Whether the attribute is available in the Azure portal
- Whether the attribute can be used in a user flow
- Whether the attribute can be used in a custom policy [Azure AD technical profile](active-directory-technical-profile.md) and in which section (&lt;InputClaims&gt;, &lt;OutputClaims&gt;, or &lt;PersistedClaims&gt;)

|Name     |Type     |Description|Azure portal|User flows|Custom policy|
|---------|---------|----------|------------|----------|-------------|
|accountEnabled  |Boolean|Whether the user account is enabled or disabled: **true** if the account is enabled, otherwise **false**.|Yes|No|Persisted, Output|
|ageGroup        |String|The user's age group. Possible values: null, Undefined, Minor, Adult, NotAdult.|Yes|No|Persisted, Output|
|alternativeSecurityId ([Identities](#identities-attribute))|String|A single user identity from the external identity provider.|No|No|Input, Persisted, Output|
|alternativeSecurityIds ([Identities](#identities-attribute))|alternative securityId collection|A collection of user identities from external identity providers.|No|No|Persisted, Output|
|city            |String|The city in which the user is located. Max length 128.|Yes|Yes|Persisted, Output|
|consentProvidedForMinor|String|Whether the consent has been provided for a minor. Allowed values: null, granted, denied, or notRequired.|Yes|No|Persisted, Output|
|country         |String|The country/region in which the user is located. Example: "US" or "UK". Max length 128.|Yes|Yes|Persisted, Output|
|createdDateTime|DateTime|The date the user object was created. Read only.|No|No|Persisted, Output|
|creationType    |String|If the user account was created as a local account for an Azure Active Directory B2C tenant, the value is LocalAccount or nameCoexistence. Read only.|No|No|Persisted, Output|
|dateOfBirth     |Date|Date of birth.|No|No|Persisted, Output|
|department      |String|The name for the department in which the user works. Max length 64.|Yes|No|Persisted, Output|
|displayName     |String|The display name for the user. Max length 256. \< \> characters aren't allowed. | Yes|Yes|Persisted, Output|
|facsimileTelephoneNumber<sup>1</sup>|String|The telephone number of the user's business fax machine.|Yes|No|Persisted, Output|
|givenName       |String|The given name (first name) of the user. Max length 64.|Yes|Yes|Persisted, Output|
|jobTitle        |String|The user's job title. Max length 128.|Yes|Yes|Persisted, Output|
|immutableId     |String|An identifier that is typically used for users migrated from on-premises Active Directory.|No|No|Persisted, Output|
|legalAgeGroupClassification|String|Legal age group classification. Read-only and calculated based on ageGroup and consentProvidedForMinor properties. Allowed values: null, minorWithOutParentalConsent, minorWithParentalConsent, minorNoParentalConsentRequired, notAdult, and adult.|Yes|No|Persisted, Output|
|legalCountry<sup>1</sup>  |String|Country/Region for legal purposes.|No|No|Persisted, Output|
|mailNickName    |String|The mail alias for the user. Max length 64.|No|No|Persisted, Output|
|mobile (mobilePhone) |String|The primary cellular telephone number for the user. Max length 64.|Yes|No|Persisted, Output|
|netId           |String|Net ID.|No|No|Persisted, Output|
|objectId        |String|A globally unique identifier (GUID) that is the unique identifier for the user. Example: 12345678-9abc-def0-1234-56789abcde. Read only, Immutable.|Read only|Yes|Input, Persisted, Output|
|otherMails      |String collection|A list of other email addresses for the user. Example: ["bob@contoso.com", "Robert@fabrikam.com"]. NOTE: Accent characters are not allowed.|Yes (Alternate email)|No|Persisted, Output|
|password        |String|The password for the local account during user creation.|No|No|Persisted|
|passwordPolicies     |String|Policy of the password. It's a string consisting of different policy name separated by comma. For example, "DisablePasswordExpiration, DisableStrongPassword".|No|No|Persisted, Output|
|physicalDeliveryOfficeName (officeLocation)|String|The office location in the user's place of business. Max length 128.|Yes|No|Persisted, Output|
|postalCode      |String|The postal code for the user's postal address. The postal code is specific to the user's country/region. In the United States of America, this attribute contains the ZIP code. Max length 40.|Yes|No|Persisted, Output|
|preferredLanguage    |String|The preferred language for the user. The preferred language format is based on RFC 4646. The name is a combination of an ISO 639 two-letter lowercase culture code associated with the language, and an ISO 3166 two-letter uppercase subculture code associated with the country or region. Example: "en-US", or "es-ES".|No|No|Persisted, Output|
|refreshTokensValidFromDateTime (signInSessionsValidFromDateTime)|DateTime|Any refresh tokens issued before this time are invalid, and applications will get an error when using an invalid refresh token to acquire a new access token. If this happens, the application will need to acquire a new refresh token by making a request to the authorize endpoint. Read-only.|No|No|Output|
|signInNames ([Identities](#identities-attribute)) |String|The unique sign-in name of the local account user of any type in the directory. Use this attribute to get a user with sign-in value without specifying the local account type.|No|No|Input|
|signInNames.userName ([Identities](#identities-attribute)) |String|The unique username of the local account user in the directory. Use this attribute to create or get a user with a specific sign-in username. Specifying this in PersistedClaims alone during Patch operation will remove other types of signInNames. If you would like to add a new type of signInNames, you also need to persist existing signInNames. NOTE: Accent characters are not allowed in the username.|No|No|Input, Persisted, Output|
|signInNames.phoneNumber ([Identities](#identities-attribute)) |String|The unique phone number of the local account user in the directory. Use this attribute to create or get a user with a specific sign-in phone number. Specifying this attribute in PersistedClaims alone during Patch operation will remove other types of signInNames. If you would like to add a new type of signInNames, you also need to persist existing signInNames.|No|No|Input, Persisted, Output|
|signInNames.emailAddress ([Identities](#identities-attribute))|String|The unique email address of the local account user in the directory. Use this to create or get a user with a specific sign-in email address. Specifying this attribute in PersistedClaims alone during Patch operation will remove other types of signInNames. If you would like to add a new type of signInNames, you also need to persist existing signInNames.|No|No|Input, Persisted, Output|
|state           |String|The state or province in the user's address. Max length 128.|Yes|Yes|Persisted, Output|
|streetAddress   |String|The street address of the user's place of business. Max length 1024.|Yes|Yes|Persisted, Output|
|strongAuthentication AlternativePhoneNumber<sup>1</sup>|String|The secondary telephone number of the user, used for multi-factor authentication.|Yes|No|Persisted, Output|
|strongAuthenticationEmailAddress<sup>1</sup>|String|The SMTP address for the user. Example: "bob@contoso.com" This attribute is used for sign-in with username policy, to store the user email address. The email address then used in a password reset flow. Accent characters are not allowed in this attribute.|Yes|No|Persisted, Output|
|strongAuthenticationPhoneNumber<sup>2</sup>|String|The primary telephone number of the user, used for multi-factor authentication.|Yes|No|Persisted, Output|
|surname         |String|The user's surname (family name or last name). Max length 64.|Yes|Yes|Persisted, Output|
|telephoneNumber (first entry of businessPhones)|String|The primary telephone number of the user's place of business.|Yes|No|Persisted, Output|
|userPrincipalName    |String|The user principal name (UPN) of the user. The UPN is an Internet-style login name for the user based on the Internet standard RFC 822. The domain must be present in the tenant's collection of verified domains. This property is required when an account is created. Immutable.|No|No|Input, Persisted, Output|
|usageLocation   |String|Required for users that will be assigned licenses due to legal requirement to check for availability of services in countries/regions. Not nullable. A two letter country/region code (ISO standard 3166). Examples: "US", "JP", and "GB".|Yes|No|Persisted, Output|
|userType        |String|A string value that can be used to classify user types in your directory. Value must be Member. Read-only.|Read only|No|Persisted, Output|
|userState (externalUserState)<sup>3</sup>|String|For Azure AD B2B account only, and it indicates whether the invitation is PendingAcceptance or Accepted.|No|No|Persisted, Output|
|userStateChangedOn (externalUserStateChangeDateTime)<sup>2</sup>|DateTime|Shows the timestamp for the latest change to the UserState property.|No|No|Persisted, Output|

<sup>1 </sup>Not supported by Microsoft Graph<br><sup>2 </sup>For more information, see [MFA phone number attribute](#mfa-phone-number-attribute)<br><sup>3 </sup>Shouldn't be used with Azure AD B2C

## Required attributes

To create a user account in the Azure AD B2C directory, provide the following required attributes: 

- [Display name](#display-name-attribute)

- [Identities](#display-name-attribute) - With at least one entity (a local or a federated account).

- [Password profile](#password-policy-attribute)- If you create a local account, provide the password profile.

## Display name attribute

The `displayName` is the name to display in Azure portal user management for the user, and in the access token that Azure AD B2C returns to the application. This property is required.

## Identities attribute

A customer account, which could be a consumer, partner, or citizen, can be associated with these identity types:

- **Local** identity - The username and password are stored locally in the Azure AD B2C directory. We often refer to these identities as "local accounts."
- **Federated** identity - Also known as a *social* or *enterprise* accounts, the identity of the user is managed by a federated identity provider like Facebook, Microsoft, ADFS, or Salesforce.

A user with a customer account can sign in with multiple identities. For example, username, email, employee ID, government ID, and others. A single account can have multiple identities, both local and social, with the same password.

In the Microsoft Graph API, both local and federated identities are stored in the user `identities` attribute, which is of type [objectIdentity](/graph/api/resources/objectidentity). The `identities` collection represents a set of identities used to sign in to a user account. This collection enables the user to sign in to the user account with any of its associated identities. The identities attribute can contain up to ten [objectIdentity](/graph/api/resources/objectidentity) objects. Each object contains the following properties:

| Name   | Type |Description|
|:---------------|:--------|:----------|
|signInType|string| Specifies the user sign-in types in your directory. For local account:  `emailAddress`, `emailAddress1`, `emailAddress2`, `emailAddress3`,  `userName`, or any other type you like. Social account must be set to  `federated`.|
|issuer|string|Specifies the issuer of the identity. For local accounts (where **signInType** is not `federated`), this property is the local B2C tenant default domain name, for example `contoso.onmicrosoft.com`. For social identity (where **signInType** is  `federated`) the value is the name of the issuer, for example `facebook.com`|
|issuerAssignedId|string|Specifies the unique identifier assigned to the user by the issuer. The combination of **issuer** and **issuerAssignedId** must be unique within your tenant. For local account, when **signInType** is set to `emailAddress` or `userName`, it represents the sign-in name for the user.<br>When **signInType** is set to: <ul><li>`emailAddress` (or starts with `emailAddress` like `emailAddress1`) **issuerAssignedId** must be a valid email address</li><li>`userName` (or any other value), **issuerAssignedId** must be a valid [local part of an email address](https://tools.ietf.org/html/rfc3696#section-3)</li><li>`federated`, **issuerAssignedId** represents the federated account unique identifier</li></ul>|

The following JSON snippet shows **Identities** attribute, with a local account identity with a sign-in name, an email address as sign-in, and with a social identity.

```json
"identities": [
  {
    "signInType": "userName",
    "issuer": "contoso.onmicrosoft.com",
    "issuerAssignedId": "johnsmith"
  },
  {
    "signInType": "emailAddress",
    "issuer": "contoso.onmicrosoft.com",
    "issuerAssignedId": "jsmith@yahoo.com"
  },
  {
    "signInType": "federated",
    "issuer": "facebook.com",
    "issuerAssignedId": "5eecb0cd"
  }
]
```

For federated identities, depending on the identity provider, the **issuerAssignedId** is a unique value for a given user per application or development account. Configure the Azure AD B2C policy with the same application ID that was previously assigned by the social provider or another application within the same development account.

## Password profile property

For a local identity, the **passwordProfile** attribute is required, and contains the user's password. The `forceChangePasswordNextSignIn` attribute indicates whether a user must reset the password at the next sign-in. To handle a forced password reset, us the the instructions in [set up forced password reset flow](force-password-reset.md).

For a federated (social) identity, the **passwordProfile** attribute is not required.

```json
"passwordProfile" : {
    "password": "password-value",
    "forceChangePasswordNextSignIn": false
  }
```

## Password policy attribute

The Azure AD B2C password policy (for local accounts) is based on the Azure Active Directory [strong password strength](../active-directory/authentication/concept-sspr-policy.md) policy. The Azure AD B2C sign-up or sign-in and password reset policies require this strong password strength, and don't expire passwords.

In user migration scenarios, if the accounts you want to migrate have weaker password strength than the [strong password strength](../active-directory/authentication/concept-sspr-policy.md) enforced by Azure AD B2C, you can disable the strong password requirement. To change the default password policy, set the `passwordPolicies` attribute to `DisableStrongPassword`. For example, you can modify the create user request as follows:

```json
"passwordPolicies": "DisablePasswordExpiration, DisableStrongPassword"
```

## MFA phone number attribute

When using a phone for multi-factor authentication (MFA), the mobile phone is used to verify the user identity. To [add](/graph/api/authentication-post-phonemethods) a new phone number programmatically, [update](/graph/api/phoneauthenticationmethod-update), [get](/graph/api/phoneauthenticationmethod-get), or [delete](/graph/api/phoneauthenticationmethod-delete) the phone number, use MS Graph API [phone authentication method](/graph/api/resources/phoneauthenticationmethod).

In Azure AD B2C [custom policies](custom-policy-overview.md), the phone number is available through `strongAuthenticationPhoneNumber` claim type.

## Extension attributes

Every customer-facing application has unique requirements for the information to be collected. Your Azure AD B2C tenant comes with a built-in set of information stored in properties, such as Given Name, Surname, and Postal Code. With Azure AD B2C, you can extend the set of properties stored in each customer account. For more information, see [Add user attributes and customize user input in Azure Active Directory B2C](configure-user-input.md)

Extension attributes [extend the schema](/graph/extensibility-overview#schema-extensions) of the user objects in the directory. The extension attributes can only be registered on an application object, even though they might contain data for a user. The extension attribute is attached to the application called `b2c-extensions-app`. Do not modify this application, as it's used by Azure AD B2C for storing user data. You can find this application under Azure Active Directory App registrations. [Learn more about Azure AD B2C](extensions-app.md) `b2c-extensions-app`.

> [!NOTE]
> - You can write up to 100 extension attributes to any user account.
> - If the b2c-extensions-app application is deleted, those extension attributes are removed from all users along with any data they contain.
> - If an extension attribute is deleted by the application, it's removed from all user accounts and the values are deleted.

Extension attributes in the Graph API are named by using the convention `extension_ApplicationClientID_AttributeName`, where:

- The `ApplicationClientID` is the **Application (client) ID** of the `b2c-extensions-app` application. [Learn how to find the extensions app](extensions-app.md#verifying-that-the-extensions-app-is-present). 
- The `AttributeName` is the name of the extension attribute.  

Note that the **Application (client) ID** as it's represented in the extension attribute name includes no hyphens. For example:

```json
    "extension_831374b3bd5041bfaa54263ec9e050fc_loyaltyNumber": "212342"
```

The following data types are supported when defining an attribute in a schema extension:

|Type |Remarks  |
|--------------|---------|
|Boolean    | Possible values: **true** or **false**. |
|DateTime   | Must be specified in ISO 8601 format. Will be stored in UTC.   |
|Integer    | 32-bit value.               |
|String     | 256 characters maximum.     |

## Next steps

Learn more about extension attributes:

- [Schema extensions](/graph/extensibility-overview#schema-extensions)
- [Define custom attributes](user-flow-custom-attributes.md)
