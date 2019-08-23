---
title: Define an Azure Active Directory technical profile in a custom policy in Azure Active Directory B2C | Microsoft Docs
description: Define an Azure Active Directory technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/10/2018
ms.author: marsma
ms.subservice: B2C
---

# Define an Azure Active Directory technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory (Azure AD) B2C provides support for the Azure Active Directory user management. This article describes the specifics of a technical profile for interacting with a claims provider that supports this standardized protocol.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly `Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`.

All Azure AD technical profiles include the **AAD-Common** technical profile. The following technical profiles don't specify the protocol because the protocol is configured in the **AAD-Common** technical profile:

- **AAD-UserReadUsingAlternativeSecurityId** and **AAD-UserReadUsingAlternativeSecurityId-NoError** - Look up a social account in the directory.
- **AAD-UserWriteUsingAlternativeSecurityId** - Create a new social account.
- **AAD-UserReadUsingEmailAddress** - Look up a local account in the directory. 
- **AAD-UserWriteUsingLogonEmail** - Create a new local account.
- **AAD-UserWritePasswordUsingObjectId** - Update a password of a local account.
- **AAD-UserWriteProfileUsingObjectId** - Update a user profile of a local or social account.
- **AAD-UserReadUsingObjectId** - Read a user profile of a local or social account.
- **AAD-UserWritePhoneNumberUsingObjectId** - Write the MFA phone number of a local or social account

The following example shows the **AAD-Common** technical profile:

```XML
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

## Input claims

The following technical profiles include **InputClaims** for social and local accounts:

- The social account technical profiles **AAD-UserReadUsingAlternativeSecurityId** and **AAD-UserWriteUsingAlternativeSecurityId** includes the **AlternativeSecurityId** claim. This claim contains the social account user identifier.
- The local account technical profiles **AAD-UserReadUsingEmailAddress** and **AAD-UserWriteUsingLogonEmail** includes the **email** claim. This claim contains the sign-in name of the local account.
- The unified (local and social) technical profiles **AAD-UserReadUsingObjectId**, **AAD-UserWritePasswordUsingObjectId**, **AAD-UserWriteProfileUsingObjectId**, and **AAD-UserWritePhoneNumberUsingObjectId** includes the **objectId** claim. The unique identifier of an account.

The **InputClaimsTransformations** element may contain a collection of **InputClaimsTransformation** elements that are used to modify the input claims or generate new ones.

## Output claims

The **OutputClaims** element contains a list of claims returned by the Azure AD technical profile. You may need to map the name of the claim defined in your policy to the name defined in Azure Active Directory. You can also include claims that aren't returned by the Azure Active Directory, as long as you set the `DefaultValue` attribute.

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

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

The **PersistedClaims** element contains all of the values that should be persisted by Azure AD with possible mapping information between a claim type already defined in the ClaimsSchema section in the policy and the Azure AD attribute name. 

The **AAD-UserWriteUsingLogonEmail** technical profile, which creates new local account, persists following claims:

```XML
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

The name of the claim is the name of the Azure AD attribute unless the **PartnerClaimType** attribute is specified, which contains the Azure AD attribute name.

## Requirements of an operation

- There must be exactly one **InputClaim** element in the claims bag for all Azure AD technical profiles. 
- If the operation is `Write` or `DeleteClaims`, then it must also appear in a **PersistedClaims** element.
- The value of the **userPrincipalName** claim must be in the format of `user@tenant.onmicrosoft.com`.
- The **displayName** claim is required and cannot be an empty string.

## Azure AD technical provider operations

### Read

The **Read** operation reads data about a single user account. To read user data, you need to provide a key as an input claim, such as **objectId**, **userPrincipalName**, **signInNames** (any type, user name and email-based account) or **alternativeSecurityId**.  

The following technical profile reads data about a user account using the user's objectId:

```XML
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

The **Write** operation creates or updates a single user account. To write a user account, you need to provide a key as an input claim, such as **objectId**, **userPrincipalName**, **signInNames.emailAddress**, or **alternativeSecurityId**.  

The following technical profile creates new social account:

```XML
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

The **DeleteClaims** operation clears the information from a provided list of claims. To delete information from claims, you need to provide a key as an input claim, such as **objectId**, **userPrincipalName**, **signInNames.emailAddress** or **alternativeSecurityId**.  

The following technical profile deletes claims:

```XML
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

The **DeleteClaimsPrincipal** operation deletes a single user account from the directory. To delete a user account, you need to provide a key as an input claim, such as **objectId**, **userPrincipalName**, **signInNames.emailAddress** or **alternativeSecurityId**.  

The following technical profile deletes a user account from the directory using the user principal name:

```XML
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

```XML
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
| UserMessageIfClaimsPrincipalDoesNotExist | No | If an error is to be raised (see the RaiseErrorIfClaimsPrincipalDoesNotExist attribute description), specify the message to show to the user if user object does not exist. The value can be [localized](localization.md).| 
| RaiseErrorIfClaimsPrincipalAlreadyExists | No | Raise an error if the user object already exists. Possible values: `true` or `false`.| 
| UserMessageIfClaimsPrincipalAlreadyExists | No | If an error is to be raised (see RaiseErrorIfClaimsPrincipalAlreadyExists attribute description), specify the message to show to the user if user object already exists. The value can be [localized](localization.md).| 
| ApplicationObjectId | No | The application object identifier for extension attributes. Value: ObjectId of an application. For more information, see [Use custom attributes in a custom profile edit policy](active-directory-b2c-create-custom-attributes-profile-edit-custom.md). | 
| ClientId | No | The client identifier for accessing the tenant as a third party. For more information, see [Use custom attributes in a custom profile edit policy](active-directory-b2c-create-custom-attributes-profile-edit-custom.md) | 














