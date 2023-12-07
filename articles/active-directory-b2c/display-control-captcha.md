---
title: Verify CAPTCHA code using CAPTCHA display controls
titleSuffix: Azure AD B2C
description: Learn how to use Azure AD B2C display controls to verify CAPTCHA code in custom policies.

author: kengaderdus
manager: mwongerapk

ms.service: active-directory

ms.topic: reference
ms.date: 12/11/2023
ms.author: kengaderdus
ms.subservice: B2C
---

# Verify CAPTCHA code using CAPTCHA display controls

Use CAPTCHA display controls to generate a captcha code string, then verifies it by asking the user to enter what they see or hear. To display a CAPTCHA display control, you reference it from a [self-asserted technical profile](self-asserted-technical-profile.md), and you must set the self-asserted technical profile's `setting.enableCaptchaChallenge` metadata to *true*.

> [!NOTE]
> This feature is in public preview  

## CAPTCHA display control process 

TODO

## CAPTCHA display control elements

This table summarizes the elements that a CAPTCHA display control contains: 

| Element | Required | Description |
| --------- | -------- | ----------- |
| UserInterfaceControlType | Yes | Value must be *CaptchaControl*.|
|  InputClaims  |  Yes  |  One or more claims required as input to specify the captcha challenge type and to uniquely identify the challenge.  |
|  DisplayClaims  |  Yes  |  The claims to be shown to the user such as the captcha challenge code, or collected from the user, such as code input by the user  |
|    OutputClaim    |  No  | Any claim to be returned to the self-asserted page after the user completes captcha code verification process.   |
|  Actions  |  Yes  |  CAPTCHA display control contains two actions, *GetChallenge* and *VerifyChallenge*. <br> *GetChallenge* action generate, then displays the captcha challenge code on the interface. This action contains a validation technical profile, which is usually the GetChallenge[CAPTCHA technical profile](captcha-technical-profile.md), to generate and display the CAPTCHA challenge string. <br> *VerifyChallenge* action verifies the CAPTCHA challenge code that the user inputs. This action contains a validation technical profile, which is usually the VerifyChallenge [CAPTCHA technical profile](captcha-technical-profile.md), to validate the CAPTCHA code that the user inputs.  |