---
title: Azure MFA technical profiles in custom policies
titleSuffix: Azure AD B2C
description: Custom policy reference for Azure Multi-Factor Authentication (MFA) technical profiles in Azure AD B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/17/2019
ms.author: marsma
ms.subservice: B2C
---

# Define an Azure MFA technical profile in an Azure AD B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) provides support for verifying a phone number by using Azure Multi-Factor Authentication (MFA). Use this technical profile to generate and send a code to a phone number, and then verify the code.

The Azure MFA technical profile may also return an error message. You can design the integration with Azure MFA by using a **Validation technical profile**. A validation technical profile calls the Azure MFA service. The validation technical profile validates the user-provided data before the user journey continues. With the validation technical profile, an error message is display on a self-asserted page.

[!INCLUDE [b2c-public-preview-feature](../../includes/active-directory-b2c-public-preview.md)]

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C:

```
Web.TPEngine.Providers.AzureMfaProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
```

The following example shows an Azure MFA technical profile:

```XML
<TechnicalProfile Id="AzureMfa-SendSms">
    <DisplayName>Send Sms</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureMfaProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    ...
```

## Send SMS

The first mode of this technical profile is to generate a code and send it. The following options can be configured for this mode.

### Input claims

The **InputClaims** element contains a list of claims to send to Azure MFA. You can also map the name of your claim to the name defined in the MFA technical profile.

| ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- |
| userPrincipalName | Yes | The identifier for the user who owns the phone number. |
| phoneNumber | Yes | The phone number to send an SMS code to. |
| companyName | No |The company name in the SMS. If not provided, the name of your application is used. |
| locale | No | The locale of the SMS. If not provided, the browser locale of the user is used. |

The **InputClaimsTransformations** element may contain a collection of **InputClaimsTransformation** elements that are used to modify the input claims or generate new ones before sending to the Azure MFA service.

### Output claims

The Azure MFA protocol provider does not return any **OutputClaims**, thus there is no need to specify output claims. You can, however, include claims that aren't returned by the Azure MFA identity provider as long as you set the `DefaultValue` attribute.

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

### Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Operation | Yes | Must be **OneWaySMS**.  |
| UserMessageIfInvalidFormat | No | Custom error message if the phone number provided is not a valid phone number |
| UserMessageIfCouldntSendSms | No | Custom error message if the phone number provided does not accept SMS |
| UserMessageIfServerError | No | Custom error message if the server has encountered an internal error |

### Return an error message

As described in [Metadata](#metadata), you can customize the error message shown to the user for different error cases. You can further localize those messages by prefixing the locale. For example:

```XML
<Item Key="en.UserMessageIfInvalidFormat">Invalid phone number.</Item>
```

### Example: send an SMS

The following example shows an Azure MFA technical profile that is used to send a code via SMS.

```XML
<TechnicalProfile Id="AzureMfa-SendSms">
    <DisplayName>Send Sms</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureMfaProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    <Metadata>
        <Item Key="Operation">OneWaySMS</Item>
    </Metadata>
    <InputClaimsTransformations>
        <InputClaimsTransformation ReferenceId="CombinePhoneAndCountryCode" />
        <InputClaimsTransformation ReferenceId="ConvertStringToPhoneNumber" />
    </InputClaimsTransformations>
    <InputClaims>
        <InputClaim ClaimTypeReferenceId="userPrincipalName" />
        <InputClaim ClaimTypeReferenceId="fullPhoneNumber" PartnerClaimType="phoneNumber" />
    </InputClaims>
</TechnicalProfile>
```

## Verify code

The second mode of this technical profile is to verify a code. The following options can be configured for this mode.

### Input claims

The **InputClaims** element contains a list of claims to send to Azure MFA. You can also map the name of your claim to the name defined in the MFA technical profile.

| ClaimReferenceId | Required | Description |
| --------- | -------- | ----------- | ----------- |
| phoneNumber| Yes | Same phone number as previously used to send a code. It is also used to locate a phone verification session. |
| verificationCode  | Yes | The verification code provided by the user to be verified |

The **InputClaimsTransformations** element may contain a collection of **InputClaimsTransformation** elements that are used to modify the input claims or generate new ones before calling the Azure MFA service.

### Output claims

The Azure MFA protocol provider does not return any **OutputClaims**, thus there is no need to specify output claims. You can, however, include claims that aren't returned by the Azure MFA identity provider as long as you set the `DefaultValue` attribute.

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Operation | Yes | Must be **Verify** |
| UserMessageIfInvalidFormat | No | Custom error message if the phone number provided is not a valid phone number |
| UserMessageIfWrongCodeEntered | No | Custom error message if the code entered for verification is wrong |
| UserMessageIfMaxAllowedCodeRetryReached | No | Custom error message if the user has attempted a verification code too many times |
| UserMessageIfThrottled | No | Custom error message if the user is throttled |
| UserMessageIfServerError | No | Custom error message if the server has encountered an internal error |

### Return an error message

As described in [Metadata](#metadata), you can customize the error message shown to the user for different error cases. You can further localize those messages by prefixing the locale. For example:

```XML
<Item Key="en.UserMessageIfWrongCodeEntered">Wrong code has been entered.</Item>
```

### Example: verify a code

The following example shows an Azure MFA technical profile used to verify the code.

```XML
<TechnicalProfile Id="AzureMfa-VerifySms">
    <DisplayName>Verify Sms</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureMfaProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    <Metadata>
        <Item Key="Operation">Verify</Item>
    </Metadata>
    <InputClaims>
        <InputClaim ClaimTypeReferenceId="phoneNumber" PartnerClaimType="phoneNumber" />
        <InputClaim ClaimTypeReferenceId="verificationCode" />
    </InputClaims>
</TechnicalProfile>
```
