---
title: User profile attributes in Azure Active Directory B2C
description: Learn about the user resource type attributes that are supported by the Azure AD B2C directory user profile. Find out about built-in attributes, extensions, and how attributes map to Microsoft Graph.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 3/20/2020
ms.author: mimart
ms.subservice: B2C
---

# User profile attributes

Your Azure Active Directory (Azure AD) B2C directory user profile comes with a built-in set of attributes, such as given name, surname, city, postal code, and phone number. You can extend the user profile with your own application data without requiring an external data store. Most of the attributes that can be used with Azure AD B2C user profiles are also supported by Microsoft Graph. This article describes supported Azure AD B2C user profile attributes. It also notes those attributes that are not supported by Microsoft Graph, as well as Microsoft Graph attributes that should not be used with Azure AD B2C.

> [!IMPORTANT]
> You should not use built-in or extension attributes to store sensitive personal data, such as account credentials, government identification numbers, cardholder data, financial account data, healthcare information, or sensitive background information.

You can also integrate with external systems. For example, you can use Azure AD B2C for authentication, but delegate to an external customer relationship management (CRM) or customer loyalty database as the authoritative source of customer data. For more information, see the [remote profile](https://github.com/azure-ad-b2c/samples/tree/master/policies/remote-profile) solution.

The table below lists the [user resource type](https://docs.microsoft.com/graph/api/resources/user) attributes that are supported by the Azure AD B2C directory user profile. It gives the following information about each attribute:

- Attribute name used by Azure AD B2C (followed by the Microsoft Graph name in parentheses, if different)
- Attribute data type
- Attribute description
- If the attribute is available in the Azure portal
- If the attribute can be used in a user flow
- If the attribute can be used in a custom policy [Azure AD technical profile](active-directory-technical-profile.md) and in which section (&lt;InputClaims&gt;, &lt;OutputClaims&gt;, or &lt;PersistedClaims&gt;)

|Name     |Type     |Description|Azure portal|User flows|Custom policy|
|---------|---------|----------|------------|----------|-------------|
|accountEnabled  |Boolean|Whether the user account is enabled or disabled: **true** if the account is enabled, otherwise **false**.|Yes|No|Persisted, Output|
|ageGroup        |String|The user's age group. Possible values: null, Undefined, Minor, Adult, NotAdult.|Yes|No|Persisted, Output|
|alternativeSecurityId ([Identities](manage-user-accounts-graph-api.md#identities-property))|String|A single user identity from the external identity provider.|No|No|Input, Persisted, Output|
|alternativeSecurityIds ([Identities](manage-user-accounts-graph-api.md#identities-property))|alternative securityId collection|A collection of user identities from external identity providers.|No|No|Persisted, Output|
|city            |String|The city in which the user is located. Max length 128.|Yes|Yes|Persisted, Output|
|consentProvidedForMinor|String|Whether the consent has been provided for a minor. Allowed values: null, granted, denied, or notRequired.|Yes|No|Persisted, Output|
|country         |String|The country/region in which the user is located. Example: "US" or "UK". Max length 128.|Yes|Yes|Persisted, Output|
|createdDateTime|DateTime|The date the user object was created. Read only.|No|No|Persisted, Output|
|creationType    |String|If the user account was created as a local account for an Azure Active Directory B2C tenant, the value is LocalAccount or nameCoexistence. Read only.|No|No|Persisted, Output|
|dateOfBirth     |Date|Date of birth.|No|No|Persisted, Output|
|department      |String|The name for the department in which the user works. Max length 64.|Yes|No|Persisted, Output|
|displayName     |String|The display name for the user. Max length 256.|Yes|Yes|Persisted, Output|
|facsimileTelephoneNumber<sup>1</sup>|String|The telephone number of the user's business fax machine.|Yes|No|Persisted, Output|
|givenName       |String|The given name (first name) of the user. Max length 64.|Yes|Yes|Persisted, Output|
|jobTitle        |String|The user's job title. Max length 128.|Yes|Yes|Persisted, Output|
|immutableId     |String|An identifier which is typically used for users migrated from on-premises Active Directory.|No|No|Persisted, Output|
|legalAgeGroupClassification|String|Legal age group classification. Read-only and calculated based on ageGroup and consentProvidedForMinor properties. Allowed values: null, minorWithOutParentalConsent, minorWithParentalConsent, minorNoParentalConsentRequired, notAdult and adult.|Yes|No|Persisted, Output|
|legalCountry<sup>1</sup>  |String|Country/Region for legal purposes.|No|No|Persisted, Output|
|mail            |String|The SMTP address for the user, for example, "bob@contoso.com". Read-only.|No|No|Persisted, Output|
|mailNickName    |String|The mail alias for the user. Max length 64.|No|No|Persisted, Output|
|mobile (mobilePhone) |String|The primary cellular telephone number for the user. Max length 64.|Yes|No|Persisted, Output|
|netId           |String|Net ID.|No|No|Persisted, Output|
|objectId        |String|A globally unique identifier (GUID) that is the unique identifier for the user. Example: 12345678-9abc-def0-1234-56789abcde. Read only, Immutable.|Read only|Yes|Input, Persisted, Output|
|otherMails      |String collection|A list of additional email addresses for the user. Example: ["bob@contoso.com", "Robert@fabrikam.com"].|Yes (Alternate email)|No|Persisted, Output|
|password        |String|The password for the local account during user creation.|No|No|Persisted|
|passwordPolicies     |String|Policy of the password. It's a string consisting of different policy name separated by comma. i.e. "DisablePasswordExpiration, DisableStrongPassword".|No|No|Persisted, Output|
|physicalDeliveryOfficeName (officeLocation)|String|The office location in the user's place of business. Max length 128.|Yes|No|Persisted, Output|
|postalCode      |String|The postal code for the user's postal address. The postal code is specific to the user's country/region. In the United States of America, this attribute contains the ZIP code. Max length 40.|Yes|No|Persisted, Output|
|preferredLanguage    |String|The preferred language for the user. Should follow ISO 639-1 Code. Example: "en-US".|No|No|Persisted, Output|
|refreshTokensValidFromDateTime|DateTime|Any refresh tokens issued before this time are invalid, and applications will get an error when using an invalid refresh token to acquire a new access token. If this happens, the application will need to acquire a new refresh token by making a request to the authorize endpoint. Read-only.|No|No|Output|
|signInNames ([Identities](manage-user-accounts-graph-api.md#identities-property)) |String|The unique sign-in name of the local account user of any type in the directory. Use this to get a user with sign-in value without specifying the local account type.|No|No|Input|
|signInNames.userName ([Identities](manage-user-accounts-graph-api.md#identities-property)) |String|The unique username of the local account user in the directory. Use this to create or get a user with a specific sign-in username. Specifying this in PersistedClaims alone during Patch operation will remove other types of signInNames. If you would like to add a new type of signInNames, you also need to persist existing signInNames.|No|No|Input, Persisted, Output|
|signInNames.phoneNumber ([Identities](manage-user-accounts-graph-api.md#identities-property)) |String|The unique phone number of the local account user in the directory. Use this to create or get a user with a specific sign-in phone number. Specifying this in PersistedClaims alone during Patch operation will remove other types of signInNames. If you would like to add a new type of signInNames, you also need to persist existing signInNames.|No|No|Input, Persisted, Output|
|signInNames.emailAddress ([Identities](manage-user-accounts-graph-api.md#identities-property))|String|The unique email address of the local account user in the directory. Use this to create or get a user with a specific sign-in email address. Specifying this in PersistedClaims alone during Patch operation will remove other types of signInNames. If you would like to add a new type of signInNames, you also need to persist existing signInNames.|No|No|Input, Persisted, Output|
|state           |String|The state or province in the user's address. Max length 128.|Yes|Yes|Persisted, Output|
|streetAddress   |String|The street address of the user's place of business. Max length 1024.|Yes|Yes|Persisted, Output|
|strongAuthentication AlternativePhoneNumber<sup>1</sup>|String|The secondary telephone number of the user, used for multi-factor authentication.|Yes|No|Persisted, Output|
|strongAuthenticationEmailAddress<sup>1</sup>|String|The SMTP address for the user. Example: "bob@contoso.com" This attribute is used for sign-in with username policy, to store the user email address. The email address then used in a password reset flow.|Yes|No|Persisted, Output|
|strongAuthenticationPhoneNumber<sup>1</sup>|String|The primary telephone number of the user, used for multi-factor authentication.|Yes|No|Persisted, Output|
|surname         |String|The user's surname (family name or last name). Max length 64.|Yes|Yes|Persisted, Output|
|telephoneNumber (first entry of businessPhones)|String|The primary telephone number of the user's place of business.|Yes|No|Persisted, Output|
|userPrincipalName    |String|The user principal name (UPN) of the user. The UPN is an Internet-style login name for the user based on the Internet standard RFC 822. The domain must be present in the tenant's collection of verified domains. This property is required when an account is created. Immutable.|No|No|Input, Persisted, Output|
|usageLocation   |String|Required for users that will be assigned licenses due to legal requirement to check for availability of services in countries/regions. Not nullable. A two letter country/region code (ISO standard 3166). Examples: "US", "JP", and "GB".|Yes|No|Persisted, Output|
|userType        |String|A string value that can be used to classify user types in your directory. Value must be Member. Read-only.|Read only|No|Persisted, Output|
|userState (externalUserState)<sup>2</sup>|String|For Azure AD B2B account only, indicates whether the invitation is PendingAcceptance or Accepted.|No|No|Persisted, Output|
|userStateChangedOn (externalUserStateChangeDateTime)<sup>2</sup>|DateTime|Shows the timestamp for the latest change to the UserState property.|No|No|Persisted, Output|
|<sup>1 </sup>Not supported by Microsoft Graph<br><sup>2 </sup>Should not be used with Azure AD B2C||||||


## Extension attributes

You'll often need to create your own attributes, as in the following cases:

- A customer-facing application needs to persist for an attribute like **LoyaltyNumber**.
- An identity provider has a unique user identifier like **uniqueUserGUID** that must be saved.
- A custom user journey needs to persist for a state of a user, like **migrationStatus**.

Azure AD B2C extends the set of attributes stored on each user account. Extension attributes [extend the schema](https://docs.microsoft.com/graph/extensibility-overview#schema-extensions) of the user objects in the directory. The extension attributes can only be registered on an application object, even though they might contain data for a user. The extension attribute is attached to the application called b2c-extensions-app. Do not modify this application, as it's used by Azure AD B2C for storing user data. You can find this application under Azure Active Directory App registrations.

> [!NOTE]
> - Up to 100 extension attributes can be written to any user account.
> - If the b2c-extensions-app application is deleted, those extension attributes are removed from all users along with any data they contain.
> - If an extension attribute is deleted by the application, it's removed from all user accounts and the values are deleted.
> - The underlying name of the extension attribute is generated in the format "Extension_" + Application ID + "_" + Attribute name. For example, if you create an extension attribute LoyaltyNumber, and the b2c-extensions-app Application ID is 831374b3-bd50-41bf-aa54-263ec9e050fc, the underlying extension attribute name will be: extension_831374b3bd5041bfaa54263ec9e050fc_LoyaltyNumber. You use the underlying name when you run Graph API queries to create or update user accounts.

The following data types are supported when defining a property in a schema extension:

|Property type |Remarks  |
|--------------|---------|
|Boolean    | Possible values: **true** or **false**. |
|DateTime   | Must be specified in ISO 8601 format. Will be stored in UTC.   |
|Integer    | 32-bit value.               |
|String     | 256 characters maximum.     |

## Next steps
Learn more about extension attributes:
- [Schema extensions](https://docs.microsoft.com/graph/extensibility-overview#schema-extensions)
- [Define custom attributes with user flow](user-flow-custom-attributes.md)
- [Define custom attributes with custom policy](custom-policy-custom-attributes.md)
