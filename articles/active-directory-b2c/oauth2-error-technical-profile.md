---
title: Define an OAuth2 custom error technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define an OAuth2 custom error technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 02/25/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Define an OAuth2 custom error technical profile in an Azure Active Directory B2C custom policy

This article describes how to handle an OAuth2 custom error with Azure Active Directory B2C (Azure AD B2C). Use this technical profile if something logic goes wrong within your policy. The technical profile returns error to your OAuth2 or OpenId Connect relying party application. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/technical-profiles/oauth2-error) of the OAuth2 custom error technical profile. 

To handle custom OAuth2 error message:

1. Define an OAuth2 error technical profile.
1. Set the error code, and error message claims.
1. From the user journey, call the OAuth2 error technical profile.

## OAuth2 error

The error is return with the following data:

- **error** - `access_denied`
- **error_description** -  The error message using the convention `AAD_Custom_<errorCode>: <errorMessage>`.
- **Correlation ID** - The Azure AD B2C correlation ID.
- **Timestamp** -  The timestamp of the error.

The following example demonstrates a custom error message return to the https://jwt.ms app:

```http
https://jwt.ms/#error=access_denied&error_description=AAD_Custom_1234%3a+My+custom+error+message%0d%0aCorrelation+ID%3a+233bf9bd-747a-4800-9062-6236f3f69a47%0d%0aTimestamp%3a+2021-03-25+14%3a01%3a23Z%0d%0a
```
  
## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `OAuth2`. Set the **OutputTokenFormat** element to `OAuth2Error`.

The following example shows a technical profile for `ReturnOAuth2Error`:

```xml
<!--
 <ClaimsProviders> -->
  <ClaimsProvider>
    <DisplayName>Token Issuer</DisplayName>
    <TechnicalProfiles>
      <TechnicalProfile Id="ReturnOAuth2Error">
        <DisplayName>Return OAuth2 error</DisplayName>
        <Protocol Name="OAuth2" />
        <OutputTokenFormat>OAuth2Error</OutputTokenFormat>
        <CryptographicKeys>
          <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer" />
        </CryptographicKeys>
        <InputClaims>
          <InputClaim ClaimTypeReferenceId="errorCode" />
          <InputClaim ClaimTypeReferenceId="errorMessage" />
        </InputClaims>
      </TechnicalProfile>
    </TechnicalProfiles>
  </ClaimsProvider>
<!--
</ClaimsProviders> -->
```

## Input claims

The **InputClaims** element contains a list of claims required to return OAuth2 error. 

| ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- |
| errorCode | Yes | The error code. | 
| errorMessage | Yes | The error message. |

## Cryptographic keys

The CryptographicKeys element contains the following key:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| issuer_secret | Yes  | An X509 certificate (RSA key set). Use the `B2C_1A_TokenSigningKeyContainer` key you configure in [Get started with custom policies](./tutorial-create-user-flows.md?pivots=b2c-custom-policy).|
|

## Invoke the technical profile

You can call the OAuth2 error technical profile from a [user journey](userjourneys.md), or [sub journey](subjourneys.md) (type of `transfer`). Set the [orchestration step](userjourneys.md#orchestrationsteps) type to `SendClaims` with a reference to your OAuth2 error technical profile.

If your user journey or sub journey already has another `SendClaims` orchestration step, set the `DefaultCpimIssuerTechnicalProfileReferenceId` attribute to the token issuer technical profile.

In the following example:

-  The user journey `SignUpOrSignIn-Custom` sets the `DefaultCpimIssuerTechnicalProfileReferenceId` to the token issuer technical profile `JwtIssuer`. 
- The eighth orchestration step checks whether the `errorCode` exists. If yes, call the `ReturnOAuth2Error` technical profile to return the error.
- If `errorCode` doesn't exist, the ninth orchestration step issues the token.

```xml
<UserJourney Id="SignUpOrSignIn-Custom" DefaultCpimIssuerTechnicalProfileReferenceId="JwtIssuer">
  <OrchestrationSteps>
    ...
    <OrchestrationStep Order="8" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="ReturnOAuth2Error">
      <Preconditions>
        <Precondition Type="ClaimsExist" ExecuteActionsIf="false">
          <Value>errorCode</Value>
          <Action>SkipThisOrchestrationStep</Action>
        </Precondition>
      </Preconditions>
    </OrchestrationStep>

    <OrchestrationStep Order="9" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />

  </OrchestrationSteps>
  <ClientDefinition ReferenceId="DefaultWeb" />
</UserJourney>
```

## Next steps

Learn about [UserJourneys](userjourneys.md)
