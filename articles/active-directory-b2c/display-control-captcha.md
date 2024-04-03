---
title: Verify CAPTCHA code using CAPTCHA display controls
titleSuffix: Azure AD B2C
description: Learn how to define a CAPTCHA display controls custom policy in Azure AD B2C.

author: kengaderdus
manager: mwongerapk

ms.service: active-directory

ms.topic: reference
ms.date: 01/17/2024
ms.author: kengaderdus
ms.subservice: B2C

#Customer intent: As a developer integrating customer-facing apps with Azure AD B2C, I want to learn how to define a CAPTCHA display control for Azure AD B2C's custom policies so that I can protect my authentication flows from automated attacks. 
---

# Verify CAPTCHA challenge string using CAPTCHA display control

Use CAPTCHA display controls to generate a CAPTCHA challenge string, then verify it by asking the user to enter what they see or hear. To display a CAPTCHA display control, you reference it from a [self-asserted technical profile](self-asserted-technical-profile.md), and you must set the self-asserted technical profile's `setting.enableCaptchaChallenge` metadata value to *true*.

The screenshot shows the CAPTCHA display control shown on a sign-up page:

:::image type="content" source="media/display-control-captcha/add-captcha.png" alt-text="Screenshot of CAPTCHA as it appears in the sign-up page."::: 

The sign-up page loads with the CAPTCHA display control. The user then inputs the characters they see or hear. The **Send verification code** button sends a verification code to the user's email, and isn't CAPTCHA display control element, but it causes the CAPTCHA challenge string to be verified.

## CAPTCHA display control elements

This table summarizes the elements that a CAPTCHA display control contains. 

| Element | Required | Description |
| --------- | -------- | ----------- |
| UserInterfaceControlType | Yes | Value must be *CaptchaControl*.|
|  InputClaims  |  Yes  |  One or more claims required as input to specify the CAPTCHA challenge type and to uniquely identify the challenge.  |
|  DisplayClaims  |  Yes  |  The claims to be shown to the user such as the CAPTCHA challenge code, or collected from the user, such as code input by the user  |
|    OutputClaim    |  No  | Any claim to be returned to the self-asserted page after the user completes CAPTCHA code verification process.   |
|  Actions  |  Yes  |  CAPTCHA display control contains two actions, *GetChallenge* and *VerifyChallenge*. <br> *GetChallenge* action generates, then displays a CAPTCHA challenge code on the user interface. <br> *VerifyChallenge* action verifies the CAPTCHA challenge code that the user inputs. |

The following XML snippet code shows an example of CaptchaProvider display control:

```xml
<DisplayControls>
    ...
    <DisplayControl Id="captchaControlChallengeCode" UserInterfaceControlType="CaptchaControl" DisplayName="Help us beat the bots">
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="challengeType" />
        <InputClaim ClaimTypeReferenceId="challengeId" />
      </InputClaims>
    
      <DisplayClaims>
        <DisplayClaim ClaimTypeReferenceId="challengeType" ControlClaimType="ChallengeType" />
        <DisplayClaim ClaimTypeReferenceId="challengeId" ControlClaimType="ChallengeId" />
        <DisplayClaim ClaimTypeReferenceId="challengeString" ControlClaimType="ChallengeString" />
        <DisplayClaim ClaimTypeReferenceId="captchaEntered" ControlClaimType="CaptchaEntered" />
      </DisplayClaims>
    
      <Actions>
        <Action Id="GetChallenge">
          <ValidationClaimsExchange>
            <ValidationClaimsExchangeTechnicalProfile
              TechnicalProfileReferenceId="HIP-GetChallenge" />
          </ValidationClaimsExchange>
        </Action>
    
        <Action Id="VerifyChallenge">
          <ValidationClaimsExchange>
            <ValidationClaimsExchangeTechnicalProfile
              TechnicalProfileReferenceId="HIP-VerifyChallenge" />
          </ValidationClaimsExchange>
        </Action>
      </Actions>
    </DisplayControl>
    ...
</DisplayControls>
```

## Next steps

- [Enable CAPTCHA in Azure Active Directory B2C](add-captcha.md).