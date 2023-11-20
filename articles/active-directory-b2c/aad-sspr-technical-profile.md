---
title: Microsoft Entra ID SSPR technical profiles in custom policies
titleSuffix: Azure AD B2C
description: Custom policy reference for Microsoft Entra ID SSPR technical profiles in Azure AD B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.custom: build-2023
ms.topic: reference
ms.date: 11/08/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Define a Microsoft Entra ID SSPR technical profile in an Azure AD B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) provides support for verifying an email address for self-service password reset (SSPR). Use the Microsoft Entra ID SSPR technical profile to generate and send a code to an email address, and then verify the code. The Microsoft Entra ID SSPR technical profile may also return an error message. The validation technical profile validates the user-provided data before the user journey continues. With the validation technical profile, an error message displays on a self-asserted page.

This technical profile:

- Doesn't provide an interface to interact with the user. Instead, the user interface is called from a [self-asserted](self-asserted-technical-profile.md) technical profile, or a [display control](display-controls.md) as a [validation technical profile](validation-technical-profile.md).
- Uses the Microsoft Entra SSPR service to generate and send a code to an email address, and then verifies the code.
- Validates an email address via a verification code.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C:

```
Web.TPEngine.Providers.AadSsprProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
```

The following example shows a Microsoft Entra ID SSPR technical profile:

```xml
<TechnicalProfile Id="AadSspr-SendCode">
  <DisplayName>Send Code</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AadSsprProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    ...
```

## Send email

The first mode of this technical profile is to generate a code and send it. The following options can be configured for this mode.

### Input claims

The **InputClaims** element contains a list of claims to send to Microsoft Entra SSPR. You can also map the name of your claim to the name defined in the SSPR technical profile.

| ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- |
| emailAddress | Yes | The identifier for the user who owns the email address. The `PartnerClaimType` property of the input claim must be set to `emailAddress`. |

The **InputClaimsTransformations** element may contain a collection of **InputClaimsTransformation** elements that are used to modify the input claims or generate new ones before sending to the Microsoft Entra SSPR service.

### Output claims

The Microsoft Entra SSPR protocol provider does not return any **OutputClaims**, thus there is no need to specify output claims. You can, however, include claims that aren't returned by the Microsoft Entra SSPR protocol provider as long as you set the `DefaultValue` attribute.

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

### Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Operation | Yes | Must be **SendCode**.  |

#### UI elements

The following metadata can be used to configure the error messages displayed upon sending SMS failure. The metadata should be configured in the [self-asserted](self-asserted-technical-profile.md) technical profile. The error messages can be [localized](localization-string-ids.md#azure-ad-sspr).

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| UserMessageIfInternalError | No | User error message if the server has encountered an internal error. |
| UserMessageIfThrottled| No | User error message if a request has been throttled.|

### Example: send an email

The following example shows a Microsoft Entra ID SSPR technical profile that is used to send a code via email.

```xml
<TechnicalProfile Id="AadSspr-SendCode">
  <DisplayName>Send Code</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AadSsprProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="Operation">SendCode</Item>
  </Metadata>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" PartnerClaimType="emailAddress"/>
  </InputClaims>
</TechnicalProfile>
```

## Verify code

The second mode of this technical profile is to verify a code. The following options can be configured for this mode.

### Input claims

The **InputClaims** element contains a list of claims to send to Microsoft Entra SSPR. You can also map the name of your claim to the name defined in the SSPR technical profile.

| ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- | ----------- |
| emailAddress| Yes | Same email address as previously used to send a code. It is also used to locate an email verification session. The `PartnerClaimType` property of the input claim must be set to `emailAddress`.|
| verificationCode  | Yes | The verification code provided by the user to be verified. The `PartnerClaimType` property of the input claim must be set to `verificationCode`. |

The **InputClaimsTransformations** element may contain a collection of **InputClaimsTransformation** elements that are used to modify the input claims or generate new ones before calling the Microsoft Entra SSPR service.

### Output claims

The Microsoft Entra SSPR protocol provider does not return any **OutputClaims**, thus there is no need to specify output claims. You can, however, include claims that aren't returned by the Microsoft Entra SSPR protocol provider as long as you set the `DefaultValue` attribute.

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

### Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Operation | Yes | Must be **VerifyCode** |

#### UI elements

The following metadata can be used to configure the error messages displayed upon code verification failure. The metadata should be configured in the [self-asserted](self-asserted-technical-profile.md) technical profile. The error messages can be [localized](localization-string-ids.md#azure-ad-sspr).

| Attribute | Required | Description |
| --------- | -------- | ----------- |
|UserMessageIfChallengeExpired | The message to display to the user if the code verification session has expired. Either the code has expired or the code has never been generated for a given identifier.|
|UserMessageIfInternalError | User error message if the server has encountered an internal error.|
|UserMessageIfThrottled | User error message if a request has been throttled.|
|UserMessageIfVerificationFailedNoRetry | The message to display to the user if they've provided an invalid code, and the user is not allowed to provide the correct code.|
|UserMessageIfVerificationFailedRetryAllowed | The message to display to the user if they've provided an invalid code, and the user is allowed to provide the correct code.|

### Example: verify a code

The following example shows a Microsoft Entra ID SSPR technical profile used to verify the code.

```xml
<TechnicalProfile Id="AadSspr-VerifyCode">
  <DisplayName>Verify Code</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AadSsprProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="Operation">VerifyCode</Item>
  </Metadata>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="verificationCode" PartnerClaimType="verificationCode" />
    <InputClaim ClaimTypeReferenceId="email" PartnerClaimType="emailAddress"/>
  </InputClaims>
</TechnicalProfile>
```
