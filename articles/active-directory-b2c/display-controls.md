---
title: Display control reference
titleSuffix: Azure AD B2C
description: Reference for Azure AD B2C display controls. Use display controls for customizing user journeys defined in your custom policies.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 12/9/2021
ms.author: kengaderdus
ms.subservice: B2C
---

# Display controls

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

A **display control** is a user interface element that has special functionality and interacts with the Azure Active Directory B2C (Azure AD B2C) back-end service. It allows the user to perform actions on the page that invoke a [validation technical profile](validation-technical-profile.md) at the back end. Display controls are displayed on the page and are referenced by a [self-asserted technical profile](self-asserted-technical-profile.md).

## Prerequisites

 In the [Metadata](self-asserted-technical-profile.md#metadata) section of a [self-asserted technical profile](self-asserted-technical-profile.md), the referenced [ContentDefinition](contentdefinitions.md) needs to have `DataUri` set to page contract version 2.1.9 or higher. For example:

```xml
<ContentDefinition Id="api.selfasserted">
  <LoadUri>~/tenant/default/selfAsserted.cshtml</LoadUri>
  <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
  <DataUri>urn:com:microsoft:aad:b2c:elements:selfasserted:2.1.9</DataUri>
  ...
```

## Defining display controls

The **DisplayControl** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `Id` | Yes | An identifier that's used for the display control. It can be [referenced](#referencing-display-controls). |
| `UserInterfaceControlType` | Yes | The type of the display control. Currently supported is [VerificationControl](display-control-verification.md), and [TOTP controls](display-control-time-based-one-time-password.md). |

### Verification control

The [verification display control](display-control-verification.md) verifies claims, for example an email address or phone number, with a verification code sent to the user. The following image illustrates a self-asserted sign-up page with two display controls that validate a primary and secondary email address.

![Screenshot showing email verification display control](media/display-controls/display-control-email.png)

### TOTP controls

The [TOTP display controls](display-control-time-based-one-time-password.md) are a set of display controls that provide TOTP multifactor authentication with the Microsoft Authenticator app. The following image illustrates a TOTP enrollment page with the three display controls.

![Screenshot showing TOTP display controls](media/display-controls/display-control-totp.png)

QrCodeControl

The **DisplayControl** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| `InputClaims` | 0:1 | **InputClaims** are used to prepopulate the value of the claims to be collected from the user. For more information, see [InputClaims](technicalprofiles.md#input-claims) element. |
| `DisplayClaims` | 0:1 | **DisplayClaims** are used to represent claims to be collected from the user. For more information, see [DisplayClaim](technicalprofiles.md#displayclaim) element.|
| `OutputClaims` | 0:1 | **OutputClaims** are used to represent claims to be saved temporarily for this **DisplayControl**. For more information, see [OutputClaims](technicalprofiles.md#output-claims) element.|
| `Actions` | 0:1 | **Actions** are used to list the validation technical profiles to invoke for user actions happening at the front end. |

### Input claims

In a display control, you can use **InputClaims** elements to prepopulate the value of claims to collect from the user on the page. Any **InputClaimsTransformations** can be defined in the self-asserted technical profile, which references this display control.

The following example prepopulates the email address to be verified with the address already present.

```xml
<DisplayControl Id="emailControl" UserInterfaceControlType="VerificationControl">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="emailAddress" />
  </InputClaims>
  ...
```

### Display claims

Each type of display control requires a different set of display claims, [output claims](#output-claims), and [actions](#display-control-actions) to be performed.

Similar to the **display claims** defined in a [self-asserted technical profile](self-asserted-technical-profile.md#display-claims), the display claims represent the claims to be collected from the user within the display control. The **ClaimType** element referenced needs to specify the **UserInputType** element for a user input type supported by Azure AD B2C, such as `TextBox` or `DropdownSingleSelect`. If a display claim value is required by an **Action**, set the **Required** attribute to `true` to force the user to provide a value for that specific display claim.

Certain display claims are required for certain types of display control. For example, **VerificationCode** is required for the display control of type **VerificationControl**. Use the attribute **ControlClaimType** to specify which DisplayClaim is designated for that required claim. For example:

```xml
<DisplayClaim ClaimTypeReferenceId="otpCode" ControlClaimType="VerificationCode" Required="true" />
```

### Output claims

The **output claims** of a display control are not sent to the next orchestration step. They are saved temporarily only for the current display control session. These temporary claims can be shared between the different actions of the same display control.

To bubble up the output claims to the next orchestration step, use the **OutputClaims** of the actual self-asserted technical profile, which references this display control.

### Display control Actions

The **Actions** of a display control are procedures that occur in the Azure AD B2C back end when a user performs a certain action on the client side (the browser). For example, the validations to perform when the user selects a button on the page.

An action defines a list of **validation technical profiles**. They are used for validating some or all of the display claims of the display control. The validation technical profile validates the user input and may return an error to the user. You can use **ContinueOnError**, **ContinueOnSuccess**, and **Preconditions** in the display control Action similar to the way they're used in [validation technical profiles](validation-technical-profile.md) in a self-asserted technical profile.

#### Actions

The **Actions** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| `Action` | 1:n | List of actions to be executed. |

#### Action

The **Action** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `Id` | Yes | The type of operation. Possible values: `SendCode` or `VerifyCode`. The `SendCode` value sends a code to the user. This action may contain two validation technical profiles: one to generate a code and one to send it. The `VerifyCode` value verifies the code the user typed in the input textbox. |

The **Action** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| `ValidationClaimsExchange` | 1:1 | The identifiers of technical profiles that are used to validate some or all of the display claims of the referencing technical profile. All input claims of the referenced technical profile must appear in the display claims of the referencing technical profile. |

#### ValidationClaimsExchange

The **ValidationClaimsExchange** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| `ValidationClaimsExchangeTechnicalProfile` | 1:n | A technical profile to be used for validating some or all of the display claims of the referencing technical profile. |

The **ValidationClaimsExchangeTechnicalProfile** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `TechnicalProfileReferenceId` | Yes | An identifier of a technical profile already defined in the policy or parent policy. |

The **ValidationClaimsExchangeTechnicalProfile** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| `Preconditions` | 0:1 | A list of preconditions that must be satisfied for the validation technical profile to execute. |

The **Precondition** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `Type` | Yes | The type of check or query to perform for the precondition. Possible values: `ClaimsExist` or `ClaimEquals`. `ClaimsExist` specifies that the actions should be performed if the specified claims exist in the user's current claim set. `ClaimEquals` specifies that the actions should be performed if the specified claim exists and its value is equal to the specified value. |
| `ExecuteActionsIf` | Yes | Indicates whether the actions in the precondition should be performed if the test is true or false. |

The **Precondition** element contains following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| `Value` | 1:n | The data that is used by the check. If the type of this check is `ClaimsExist`, this field specifies a ClaimTypeReferenceId to query for. If the type of check is `ClaimEquals`, this field specifies a ClaimTypeReferenceId to query for. Specify the value to be checked in another value element.|
| `Action` | 1:1 | The action that should be taken if the precondition check within an orchestration step is true. The value of the **Action** is set to `SkipThisValidationTechnicalProfile`, which specifies that the associated validation technical profile should not be executed. |

The following example sends and verifies the email address using [Microsoft Entra ID SSPR technical profile](aad-sspr-technical-profile.md).

```xml
<DisplayControl Id="emailVerificationControl" UserInterfaceControlType="VerificationControl">
  <InputClaims></InputClaims>
  <DisplayClaims>
    <DisplayClaim ClaimTypeReferenceId="email" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="verificationCode" ControlClaimType="VerificationCode" Required="true" />
  </DisplayClaims>
  <OutputClaims></OutputClaims>
  <Actions>
    <Action Id="SendCode">
      <ValidationClaimsExchange>
        <ValidationClaimsExchangeTechnicalProfile TechnicalProfileReferenceId="AadSspr-SendCode" />
      </ValidationClaimsExchange>
    </Action>
    <Action Id="VerifyCode">
      <ValidationClaimsExchange>
        <ValidationClaimsExchangeTechnicalProfile TechnicalProfileReferenceId="AadSspr-VerifyCode" />
      </ValidationClaimsExchange>
    </Action>
  </Actions>
</DisplayControl>
```

The following example sends a code either in email or SMS based on the user's selection of the **mfaType** claim with preconditions.

```xml
<Action Id="SendCode">
  <ValidationClaimsExchange>
    <ValidationClaimsExchangeTechnicalProfile TechnicalProfileReferenceId="AzureMfa-SendSms">
      <Preconditions>
        <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
          <Value>mfaType</Value>
          <Value>email</Value>
          <Action>SkipThisValidationTechnicalProfile</Action>
        </Precondition>
      </Preconditions>
    </ValidationClaimsExchangeTechnicalProfile>
    <ValidationClaimsExchangeTechnicalProfile TechnicalProfileReferenceId="AadSspr-SendEmail">
      <Preconditions>
        <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
          <Value>mfaType</Value>
          <Value>phone</Value>
          <Action>SkipThisValidationTechnicalProfile</Action>
        </Precondition>
      </Preconditions>
    </ValidationClaimsExchangeTechnicalProfile>
  </ValidationClaimsExchange>
</Action>
```

## Referencing display controls

Display controls are referenced in the [display claims](self-asserted-technical-profile.md#display-claims) of the [self-asserted technical profile](self-asserted-technical-profile.md).

For example:

```xml
<TechnicalProfile Id="SelfAsserted-ProfileUpdate">
  ...
  <DisplayClaims>
    <DisplayClaim DisplayControlReferenceId="emailVerificationControl" />
    <DisplayClaim DisplayControlReferenceId="PhoneVerificationControl" />
    <DisplayClaim ClaimTypeReferenceId="displayName" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="givenName" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="surName" Required="true" />
```

## Next steps

For samples of using display control, see: 

- [Custom email verification with Mailjet](custom-email-mailjet.md)
- [Custom email verification with SendGrid](custom-email-sendgrid.md)
