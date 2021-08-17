---
title: Common problems using text message two-step verification - Azure Active Directory | Microsoft Docs
description: Learn how to set up a different mobile device as your two-factor verification method.
services: active-directory
author: curtand
manager: daveba

ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.topic: end-user-help
ms.date: 07/28/2021
ms.author: curtand
---


# Common problems with text message two-step verification

Receiving a verification code in a text message is a common verification method for two-step verification. If you didn’t expect to receive a code, or if you received a code on the wrong phone, use the following steps to fix this problem.  

> [!Note]
> If your organization doesn't allow you to receive a text message for verification, you'll need to select another method or contact your administrator for more help.

## If you received the code on the wrong phone

1. Sign in to **My Security Info** to manage your security info.

1. On the **Security info** page, select the phone number that you want to change in your list of registered authentication methods, and then select **Change**.

1. Select your country or region for your new number, and then enter your mobile device phone number.

1. Select **Text me a code to receive text messages for verification**, then select **Next**.

1. Type the verification code from the text message sent from Microsoft when prompted, and then select **Next**.

1. When notified that your phone was registered successfully, select **Done**.

## If you receive a code unexpectedly

### If you already registered your phone number for two-step verification

Receiving an unexpected text message could mean that someone knows your password and is attempting to take over your account. Change your password immediately and notify your organization's administrator about what happened.

### If you never registered your phone number for two-step verification

You can reply to the text message with `STOP` in the body of the text message. This message prevents the provider from sending messages to your phone number in the future. You might need to reply to similar messages with different codes.  

However, if you're already using two-step verification, sending this message prevents you from using this phone number to sign in. If you want to begin receiving text messages again, reply to the initial text message with `START` in the body.

## Next steps

- [Get help with two-step verification](multi-factor-authentication-end-user-troubleshoot.md)
- [Set up a mobile phone as your two-step verification method](multi-factor-authentication-setup-phone-number.md)