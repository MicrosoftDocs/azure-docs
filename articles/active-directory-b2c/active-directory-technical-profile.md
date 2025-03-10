---
title: Define a Microsoft Entra technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define a Microsoft Entra technical profile in a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: azure-active-directory

ms.topic: reference
ms.date: 01/11/2024
ms.author: kengaderdus
ms.reviewer: yoelhor
ms.subservice: b2c


#Customer intent: As a developer using Azure Active Directory B2C, I want to define a technical profile for Microsoft Entra user management, so that I can interact with a claims provider that supports the standardized protocol and perform operations like reading, writing, and deleting user accounts.

---

# Define a Microsoft Entra technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

<!-- docutune:ignored "AAD-" -->

Azure Active Directory B2C (Azure AD B2C) provides support for the Microsoft Entra user management. This article describes the specifics of a technical profile for interacting with a claims provider that supports this standardized protocol.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly `Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`.

Following [custom policy starter pack](tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack) Microsoft Entra technical profiles include the **AAD-Common** technical profile. The Microsoft Entra technical profiles don't specify the protocol because the protocol is configured in the **AAD-Common** technical profile:

- **AAD-UserReadUsingAlternativeSecurityId** and **AAD-UserReadUsingAlternativeSecurityId-NoError** - Look up a social account in the directory.
- **AAD-UserWriteUsingAlternativeSecurityId** - Create a new social account.
- **AAD-UserReadUsingEmailAddress** - Look up a local account in the directory.
- **AAD-UserWriteUsingLogonEmail** - Create a new local account.
- **AAD-UserWritePasswordUsingObjectId** - Update a password of a local account.
- **AAD-UserWriteProfileUsingObjectId** - Update a user profile of a local or social account.
- **AAD-UserReadUsingObjectId** - Read a user profile of a local or social account.
- **AAD-UserWritePhoneNumberUsingObjectId** - Write the MFA phone number of a local or social account

The following example shows the **AAD-Common** technical profile:

```xml
<TechnicalProfile Id="AAD-Common">
  <DisplayName>Azure Active Directory</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />

  <CryptographicKeys>
    <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer" />
  </CryptographicKeys>

  <!-- We need this here to suppress the SelfAsserted provider from invoking SSO on validation profiles. -->
  <IncludeInSso>false</IncludeInSso>
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
</TechnicalProfile>
```

## InputClaims

The InputClaims element contains a claim, which is used to look up an account in the directory, or create a new one. There must be exactly one InputClaim element in the input claims collection for all Microsoft Entra technical profiles. You may need to map the name of the claim defined in your policy to the name defined in Microsoft Entra ID.

To read, update, or delete an existing user account, the input claim is a key that uniquely identifies the account in Microsoft Entra directory. For example, **objectId**, **userPrincipalName**, **signInNames.emailAddress**, **signInNames.userName**, or **alternativeSecurityId**. 

To create a new user account, the input claim is a key that uniquely identifies a local or federated account. For example, local account: **signInNames.emailAddress**, or **signInNames.userName**. For a federated account: the **alternativeSecurityId**.

The [InputClaimsTransformations](technicalprofiles.md#input-claims-transformations) element may contain a collection of input claims transformation elements that are used to modify the input claim or generate new one.

## OutputClaims

The **OutputClaims** element contains a list of claims returned by the Microsoft Entra technical profile. You may need to map the name of the claim defined in your policy to the name defined in Microsoft Entra ID. You can also include claims that aren't returned by the Microsoft Entra ID, as long as you set the `DefaultValue` attribute.

The [OutputClaimsTransformations](technicalprofiles.md#output-claims-transformations) element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

For example, the **AAD-UserWriteUsingLogonEmail** technical profile creates a local account and returns the following claims:

- **objectId**, which is identifier of the new account
- **newUser**, which indicates whether the user is new
- **authenticationSource**, which sets authentication to `localAccountAuthentication`
- **userPrincipalName**, which is the user principal name of the new account
- **signInNames.emailAddress**, which is the account sign-in name, similar to the **email** input claim

```xml
<OutputClaims>
  <OutputClaim ClaimTypeReferenceId="objectId" />
  <OutputClaim ClaimTypeReferenceId="newUser" PartnerClaimType="newClaimsPrincipalCreated" />
  <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="localAccountAuthentication" />
  <OutputClaim ClaimTypeReferenceId="userPrincipalName" />
  <OutputClaim ClaimTypeReferenceId="signInNames.emailAddress" />
</OutputClaims>
```

## PersistedClaims

The **PersistedClaims** element contains all of the values that should be persisted by Microsoft Entra ID with possible mapping information between a claim type already defined in the [ClaimsSchema](claimsschema.md) section in the policy and the Microsoft Entra attribute name.

The **AAD-UserWriteUsingLogonEmail** technical profile, which creates new local account, persists following claims:

```xml
  <PersistedClaims>
    <!-- Required claims -->
    <PersistedClaim ClaimTypeReferenceId="email" PartnerClaimType="signInNames.emailAddress" />
    <PersistedClaim ClaimTypeReferenceId="newPassword" PartnerClaimType="password"/>
    <PersistedClaim ClaimTypeReferenceId="displayName" DefaultValue="unknown" />
    <PersistedClaim ClaimTypeReferenceId="passwordPolicies" DefaultValue="DisablePasswordExpiration" />

    <!-- Optional claims. -->
    <PersistedClaim ClaimTypeReferenceId="givenName" />
    <PersistedClaim ClaimTypeReferenceId="surname" />
  </PersistedClaims>
```

The name of the claim is the name of the Microsoft Entra attribute unless the **PartnerClaimType** attribute is specified, which contains the Microsoft Entra attribute name.

## Requirements of an operation

- There must be exactly one **InputClaim** element in the claims bag for all Microsoft Entra technical profiles.
- The [user profile attributes article](user-profile-attributes.md) describes the supported Azure AD B2C user profile attributes you can use in the input claims, output claims, and persisted claims. 
- If the operation is `Write` or `DeleteClaims`, then it must also appear in a **PersistedClaims** element.
- The value of the **userPrincipalName** claim must be in the format of `user@tenant.onmicrosoft.com`.
- The **displayName** claim is required and cannot be an empty string.

<a name='azure-ad-technical-profile-operations'></a>

## Microsoft Entra technical profile operations

### Read

The **Read** operation reads data about a single user account. The following technical profile reads data about a user account using the user's objectId:

```xml
<TechnicalProfile Id="AAD-UserReadUsingObjectId">
  <Metadata>
    <Item Key="Operation">Read</Item>
    <Item Key="RaiseErrorIfClaimsPrincipalDoesNotExist">true</Item>
  </Metadata>
  <IncludeInSso>false</IncludeInSso>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="objectId" Required="true" />
  </InputClaims>
  <OutputClaims>

    <!-- Required claims -->
    <OutputClaim ClaimTypeReferenceId="strongAuthenticationPhoneNumber" />

    <!-- Optional claims -->
    <OutputClaim ClaimTypeReferenceId="signInNames.emailAddress" />
    <OutputClaim ClaimTypeReferenceId="displayName" />
    <OutputClaim ClaimTypeReferenceId="otherMails" />
    <OutputClaim ClaimTypeReferenceId="givenName" />
    <OutputClaim ClaimTypeReferenceId="surname" />
  </OutputClaims>
  <IncludeTechnicalProfile ReferenceId="AAD-Common" />
</TechnicalProfile>
```

### Write

The **Write** operation creates or updates a single user account. The following technical profile creates new social account:

```xml
<TechnicalProfile Id="AAD-UserWriteUsingAlternativeSecurityId">
  <Metadata>
    <Item Key="Operation">Write</Item>
    <Item Key="RaiseErrorIfClaimsPrincipalAlreadyExists">true</Item>
    <Item Key="UserMessageIfClaimsPrincipalAlreadyExists">You are already registered, please press the back button and sign in instead.</Item>
  </Metadata>
  <IncludeInSso>false</IncludeInSso>
  <InputClaimsTransformations>
    <InputClaimsTransformation ReferenceId="CreateOtherMailsFromEmail" />
  </InputClaimsTransformations>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="AlternativeSecurityId" PartnerClaimType="alternativeSecurityId" Required="true" />
  </InputClaims>
  <PersistedClaims>
    <!-- Required claims -->
    <PersistedClaim ClaimTypeReferenceId="alternativeSecurityId" />
    <PersistedClaim ClaimTypeReferenceId="userPrincipalName" />
    <PersistedClaim ClaimTypeReferenceId="mailNickName" DefaultValue="unknown" />
    <PersistedClaim ClaimTypeReferenceId="displayName" DefaultValue="unknown" />

    <!-- Optional claims -->
    <PersistedClaim ClaimTypeReferenceId="otherMails" />
    <PersistedClaim ClaimTypeReferenceId="givenName" />
    <PersistedClaim ClaimTypeReferenceId="surname" />
  </PersistedClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="objectId" />
    <OutputClaim ClaimTypeReferenceId="newUser" PartnerClaimType="newClaimsPrincipalCreated" />
    <OutputClaim ClaimTypeReferenceId="otherMails" />
  </OutputClaims>
  <IncludeTechnicalProfile ReferenceId="AAD-Common" />
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" />
</TechnicalProfile>
```

### DeleteClaims

The **DeleteClaims** operation clears the information from a provided list of claims. The following technical profile deletes claims:

```xml
<TechnicalProfile Id="AAD-DeleteClaimsUsingObjectId">
  <Metadata>
    <Item Key="Operation">DeleteClaims</Item>
  </Metadata>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="objectId" Required="true" />
  </InputClaims>
  <PersistedClaims>
    <PersistedClaim ClaimTypeReferenceId="objectId" />
    <PersistedClaim ClaimTypeReferenceId="Verified.strongAuthenticationPhoneNumber" PartnerClaimType="strongAuthenticationPhoneNumber" />
  </PersistedClaims>
  <OutputClaims />
  <IncludeTechnicalProfile ReferenceId="AAD-Common" />
</TechnicalProfile>
```

### DeleteClaimsPrincipal

The **DeleteClaimsPrincipal** operation deletes a single user account from the directory. The following technical profile deletes a user account from the directory using the user principal name:

```xml
<TechnicalProfile Id="AAD-DeleteUserUsingObjectId">
  <Metadata>
    <Item Key="Operation">DeleteClaimsPrincipal</Item>
  </Metadata>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="objectId" Required="true" />
  </InputClaims>
  <OutputClaims/>
  <IncludeTechnicalProfile ReferenceId="AAD-Common" />
</TechnicalProfile>
```

The following technical profile deletes a social user account using **alternativeSecurityId**:

```xml
<TechnicalProfile Id="AAD-DeleteUserUsingAlternativeSecurityId">
  <Metadata>
    <Item Key="Operation">DeleteClaimsPrincipal</Item>
  </Metadata>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="alternativeSecurityId" Required="true" />
  </InputClaims>
  <OutputClaims/>
  <IncludeTechnicalProfile ReferenceId="AAD-Common" />
</TechnicalProfile>
```
## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Operation | Yes | The operation to be performed. Possible values: `Read`, `Write`, `DeleteClaims`, or `DeleteClaimsPrincipal`. |
| RaiseErrorIfClaimsPrincipalDoesNotExist | No | Raise an error if the user object does not exist in the directory. Possible values: `true` or `false`. |
| RaiseErrorIfClaimsPrincipalAlreadyExists | No | Raise an error if the user object already exists. Possible values: `true` or `false`. This metadata is applicable only for the Write operation.|
| ApplicationObjectId | No | The application object identifier for extension attributes. Value: ObjectId of an application. For more information, see [Use custom attributes](user-flow-custom-attributes.md?pivots=b2c-custom-policy). |
| ClientId | No | The client identifier for accessing the tenant as a third party. For more information, see [Use custom attributes in a custom profile edit policy](user-flow-custom-attributes.md?pivots=b2c-custom-policy) |
| IncludeClaimResolvingInClaimsHandling  | No | For input and output claims, specifies whether [claims resolution](claim-resolver-overview.md) is included in the technical profile. Possible values: `true`, or `false` (default). If you want to use a claims resolver in the technical profile, set this to `true`. |

### UI elements
 
The following settings can be used to configure the error message displayed upon failure. The metadata should be configured in the [self-asserted](self-asserted-technical-profile.md) technical profile. The error messages can be [localized](localization.md).

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| UserMessageIfClaimsPrincipalAlreadyExists | No | If an error is to be raised (see RaiseErrorIfClaimsPrincipalAlreadyExists attribute description), specify the message to show to the user if user object already exists. |
| UserMessageIfClaimsPrincipalDoesNotExist | No | If an error is to be raised (see the RaiseErrorIfClaimsPrincipalDoesNotExist attribute description), specify the message to show to the user if user object does not exist. |


## Next steps

See the following article, for example of using Microsoft Entra technical profile:

- [Add claims and customize user input using custom policies in Azure Active Directory B2C](configure-user-input.md)
