---
title: Define a CAPTCHA technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define a CAPTCHA technical profile custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: mwongerapk

ms.service: active-directory

ms.topic: reference
ms.date: 01/17/2024
ms.author: kengaderdus
ms.subservice: B2C

#Customer intent: As a developer integrating a customer-facing application with Azure AD B2C, I want to define a CAPTCHA technical profile, so that I can secure sign-up and sign-in flows from automated attacks.
---

# Define a CAPTCHA technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

A Completely Automated Public Turing Tests to Tell Computer and Human Apart (CAPTCHA) technical profiles enables Azure Active Directory B2C (Azure AD B2C) to prevent automated attacks. Azure AD B2C's CAPTCHA technical profile supports both audio and visual CAPTCHA challenges types.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C, for CAPTCHA:
`Web.TPEngine.Providers.CaptchaProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`

> [!NOTE]
> This feature is in public preview

The following example shows a self-asserted technical profile for email sign-up:

```xml
<TechnicalProfile Id="HIP-GetChallenge">
  <DisplayName>Email signup</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.CaptchaProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
``` 
## CAPTCHA technical profile operations

CAPTCHA technical profile operations have two operations:

- **Get challenge operation** generates the CAPTCHA code string, then displays it on the user interface by using a [CAPTCHA display control](display-control-captcha.md). The display includes an input textbox. This operation directs the user to input the characters they see or hear into the input textbox. The user can switch between visual and audio challenge types as needed.

- **Verify code operation** verifies the characters input by the user.

## Get challenge

The first operation generates the CAPTCHA code string, then displays it on the user interface.

### Input claims

The **InputClaims** element contains a list of claims to send to Azure AD B2C's CAPTCHA service.

 | ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- |
| challengeType | No | The CAPTCHA challenge type, Audio or Visual (default).|
| azureregion | Yes | The service region that serves the CAPTCHA challenge request. |

### Display claims

The **DisplayClaims** element contains a list of claims to be presented on the screen for the user to see. For example, the user is presented with the CAPTCHA challenge code to read. 

 | ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- |
| challengeString | Yes | The CAPTCHA challenge code.|


### Output claims

The **OutputClaims** element contains a list of claims returned by the CAPTCHA technical profile.

| ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- |
| challengeId | Yes | A unique identifier for CAPTCHA challenge code.|
| challengeString | Yes | The CAPTCHA challenge code.|
| azureregion | Yes | The service region that serves the CAPTCHA challenge request.|


### Metadata
 | Attribute | Required | Description |
| --------- | -------- | ----------- |
| Operation | Yes | Value must be *GetChallenge*.|
| Brand | Yes | Value must be *HIP*.|

### Example: Generate CAPTCHA code

The following example shows a CAPTCHA technical profile that you use to generate a code:

```xml
<TechnicalProfile Id="HIP-GetChallenge">
  <DisplayName>GetChallenge</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.CaptchaProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />

  <Metadata>
    <Item Key="Operation">GetChallenge</Item>
    <Item Key="Brand">HIP</Item>
  </Metadata>

  <InputClaims>
    <InputClaim ClaimTypeReferenceId="challengeType" />
  </InputClaims>

  <DisplayClaims>
    <DisplayClaim ClaimTypeReferenceId="challengeString" />
  </DisplayClaims>

  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="challengeId" />
    <OutputClaim ClaimTypeReferenceId="challengeString" PartnerClaimType="ChallengeString" />
    <OutputClaim ClaimTypeReferenceId="azureregion" />
  </OutputClaims>

</TechnicalProfile>
```


## Verify challenge

The second operation verifies the CAPTCHA challenge.

### Input claims

The **InputClaims** element contains a list of claims to send to Azure AD B2C's CAPTCHA service.

 | ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- |
| challengeType | No | The CAPTCHA challenge type, Audio or Visual (default).|
|challengeId| Yes | A unique identifier for CAPTCHA used for session verification. Populated from the *GetChallenge* call. |
|captchaEntered| Yes | The challenge code that the user inputs into the challenge textbox on the user interface. |
|azureregion| Yes | The service region that serves the CAPTCHA challenge request. Populated from the *GetChallenge* call.|


### Display claims

The **DisplayClaims** element contains a list of claims to be presented on the screen for collecting an input from the user.

 | ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- |
| captchaEntered | Yes | The CAPTCHA challenge code entered by the user.|

### Output claims 

The **OutputClaims** element contains a list of claims returned by the captcha technical profile.

| ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- |
| challengeId | Yes | A unique identifier for CAPTCHA used for session verification.|
| isCaptchaSolved | Yes | A flag indicating whether the CAPTCHA challenge is successfully solved.|
| reason | Yes | Used to communicate to the user whether the attempt to solve the challenge is successful or not. |

### Metadata
 | Attribute | Required | Description |
| --------- | -------- | ----------- |
| Operation | Yes | Value must be **VerifyChallenge**.|
| Brand | Yes | Value must be **HIP**.|

### Example: Verify CAPTCHA code

The following example shows a CAPTCHA technical profile that you use to verify a CAPTCHA code:

```xml
  <TechnicalProfile Id="HIP-VerifyChallenge">
    <DisplayName>Verify Code</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.CaptchaProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    <Metadata>
      <Item Key="Brand">HIP</Item>
      <Item Key="Operation">VerifyChallenge</Item>
    </Metadata>

    <InputClaims>
      <InputClaim ClaimTypeReferenceId="challengeType" DefaultValue="Visual" />
      <InputClaim ClaimTypeReferenceId="challengeId" />
      <InputClaim ClaimTypeReferenceId="captchaEntered" PartnerClaimType="inputSolution" Required="true" />
      <InputClaim ClaimTypeReferenceId="azureregion" />
    </InputClaims>

    <DisplayClaims>
      <DisplayClaim ClaimTypeReferenceId="captchaEntered" />
    </DisplayClaims>

    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="challengeId" />
      <OutputClaim ClaimTypeReferenceId="isCaptchaSolved" PartnerClaimType="solved" />
      <OutputClaim ClaimTypeReferenceId="reason" PartnerClaimType="reason" />
    </OutputClaims>

  </TechnicalProfile>
```

## Next steps

- [Enable CAPTCHA in Azure Active Directory B2C](add-captcha.md).