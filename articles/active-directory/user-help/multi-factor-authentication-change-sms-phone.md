---
title: Change the mobile device for text message two-step verification - Azure Active Directory | Microsoft Docs
description: Learn how to set up a different mobile device as your two-factor verification method.
services: active-directory
author: curtand
manager: daveba

ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.topic: end-user-help
ms.date: 06/21/2021
ms.author: curtand
---


# Change the mobile device for text message two-step verification

When performing two-step verification using a mobile phone, you can choose to receive a numeric code via text message as one verification factor. If you received this code on the wrong phone or you didn’t expect to receive this code, please use the following steps to fix this problem.  

> [!Note]
> If your organization doesn't allow you to receive a text message for verification, you'll need to select another method or contact your administrator for more help.

## Change the phone number that you use for verification

1. Sign in to **My Security Info** to manage your security info.

1. On the **Security info** page, select the phone number that you want to change in your list of registered authentication methods, and then select **Change**.

1. Select your country or region for your new number, and then enter your mobile device phone number.

1. Select **Text me a code to receive text messages for verification**, then select **Next**.

1. Type the verification code from the text message sent from Microsoft when prompted, and then select **Next**.

1. When notified that your phone was registered successfully, select **Done**.

## If you receive a text message unexpectedly

### If you already registered your phone number for two-step verification

This could mean that someone knows your password and is attempting to take over your account. You should change your password immediately and notify your organization's administrator that this has happened.

### If you never registered your phone number for two-step verification

You can reply to the text message with `STOP` in the body of the text message. This message prevents the provider from sending messages to your phone number in the future. You might need to reply to similar messages with different codes.  

However, if you are an current user of two-step verification with Azure Active Directory, this message prevents you from using this phone number to sign in. If you want to begin receiving text messages again, reply to the initial text message with `START` in the body.
