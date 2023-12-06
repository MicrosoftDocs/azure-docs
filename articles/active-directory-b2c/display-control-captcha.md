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

Use CAPTCHA display controls to generate a captcha code, then verify it by asking the user to enter what they see or hear. To display a CAPTCHA display control, you reference it from a [self-asserted technical profile](self-asserted-technical-profile.md), and you must set the technical profile's `setting.enableCaptchaChallenge` metadata to *true*.

> [!NOTE]
> This feature is in public preview  

## CAPTCHA display control process 

TODO

## CAPTCHA display control elements

This table summarizes the elements that a CAPTCHA display control contains: 

| Element | Required | Description |
| --------- | -------- | ----------- |
| UserInterfaceControlType | Yes | Value must be *CaptchaControl*.|
|  InputClaims  |    |    |
|  DisplayClaims  |    |    |
|  Actions      |    |    |
|  OutputClaim  |    |    |