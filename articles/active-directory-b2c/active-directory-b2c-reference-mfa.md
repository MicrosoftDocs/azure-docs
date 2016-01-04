<properties
	pageTitle="Azure Active Directory B2C preview: Multi-Factor Authentication | Microsoft Azure"
	description="How to enable Multi-Factor Authentication in consumer-facing applications secured by Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/22/2015"
	ms.author="swkrish"/>

# Azure Active Directory B2C preview: enable Multi-Factor Authentication in your Consumer-facing Applications

Azure Active Directory (AD) B2C integrates directly with [Azure Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication.md) to make it easy for you to add a second layer of security to sign-up and sign-in experiences in your consumer-facing applications. And you can do this without writing a single line of code. Currently we support phone call and text message as verification options. If you already created sign-up and sign-in policies (as described in [this article]()), you can turn on multi-factor authentication as shown in subsequent sections.

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

> [AZURE.NOTE]
Multi-Factor Authentication can also be turned on when creating sign-up and sign-in policies, not just by editing existing policies.

By utilizing this feature, applications can handle scenarios such as the following, where you:

- Don't require multi-factor authentication to access one application, but require it to access another one. For example, the consumer can sign into an auto insurance application with a social or local account, but need to verify phone number before accessing the home insurance application registered in the same directory.
- Don't require multi-factor authentication to access an application in general, but require it to access the sensitive portions within it. For example, the consumer can sign into a banking application with a social or local account and check account balance, but need to verify phone number before attempting a wire-transfer.

## Modify your Sign-up Policy to enable Multi-Factor Authentication

1. [Navigate to the B2C features blade on the Azure preview portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade)..
2. Click **Sign-up policies**.
3. Open your sign-up policy (for example, "B2C_1_SiUp") by clicking on it.
4. Click **Multi-factor authentication** and turn the **State** to **ON**. Click **OK**.
5. Click **Save** at the top of the blade. You're done!

You can use the "Run now" feature on the policy to verify the consumer experience. This is what you should expect to see:

A consumer account gets created in your directory before the multi-factor authentication step occurs. During the step, the consumer is asked to provide his or her phone number and verify it. If verification is successful, the phone number is attached to the consumer account for later use. Even if the consumer cancels or drops out, he or she can be asked to verify a phone number again during next sign-in (with multi-factor authentication enabled; see next section).

## Modify your Sign-in Policy to enable Multi-Factor Authentication

1. Navigate to the B2C features blade on the [Azure preview portal](htts://portal.azure.com/). Read [here](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade) on how to do this.
2. Click **Sign-in policies**.
3. Open your sign-in policy (for example, "B2C_1_SiIn") by clicking on it. Click **Edit** at the top of the blade.
4. Click **Multi-factor authentication** and turn the **State** to **ON**. Click **OK**.
5. Click **Save** at the top of the blade. You're done!

You can use the "Run now" feature on the policy to verify the consumer experience. This is what you should expect to see:

When the consumer signs in (using a social or local account), if a verified phone number is attached to the consumer account, he or she is asked to verify it. If no phone number is attached, the consumer is asked to provide one and verify it; on successful verification, the phone number is attached to the consumer account for later use.
