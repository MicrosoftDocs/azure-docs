<properties
	pageTitle="Azure Active Directory B2C: Multi-Factor Authentication | Microsoft Azure"
	description="How to enable Multi-Factor Authentication in consumer-facing applications secured by Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="bryanla"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/22/2016"
	ms.author="swkrish"/>

# Azure Active Directory B2C: Enable Multi-Factor Authentication in your consumer-facing applications

Azure Active Directory (Azure AD) B2C integrates directly with [Azure Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication.md) so that you can add a second layer of security to sign-up and sign-in experiences in your consumer-facing applications. And you can do this without writing a single line of code. Currently we support phone call and text message verification. If you already created sign-up and sign-in policies, you can still enable Multi-Factor Authentication.

> [AZURE.NOTE]
Multi-Factor Authentication can also be enabled when you create sign-up and sign-in policies, not just by editing existing policies.

This feature helps applications handle scenarios such as the following:

- You don't require Multi-Factor Authentication to access one application, but you do require it to access another one. For example, the consumer can sign into an auto insurance application with a social or local account, but must verify the phone number before accessing the home insurance application registered in the same directory.
- You don't require Multi-Factor Authentication to access an application in general, but you do require it to access the sensitive portions within it. For example, the consumer can sign in to a banking application with a social or local account and check account balance, but must verify the phone number before attempting a wire transfer.

## Modify your sign-up policy to enable Multi-Factor Authentication

1. [Follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. Click **Sign-up policies**.
3. Click your sign-up policy (for example, "B2C_1_SiUp") to open it.
4. Click **Multi-factor authentication** and turn the **State** to **ON**. Click **OK**.
5. Click **Save** at the top of the blade.

You can use the "Run now" feature on the policy to verify the consumer experience. Confirm the following:

A consumer account gets created in your directory before the Multi-Factor Authentication step occurs. During the step, the consumer is asked to provide his or her phone number and verify it. If verification is successful, the phone number is attached to the consumer account for later use. Even if the consumer cancels or drops out, he or she can be asked to verify a phone number again during the next sign-in (with Multi-Factor Authentication enabled).

## Modify your sign-in policy to enable Multi-Factor Authentication

1. [Follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. Click **Sign-in policies**.
3. Click your sign-in policy (for example, "B2C_1_SiIn") to open it. Click **Edit** at the top of the blade.
4. Click **Multi-factor authentication** and turn the **State** to **ON**. Click **OK**.
5. Click **Save** at the top of the blade.

You can use the "Run now" feature on the policy to verify the consumer experience. Confirm the following:

When the consumer signs in (using a social or local account), if a verified phone number is attached to the consumer account, he or she is asked to verify it. If no phone number is attached, the consumer is asked to provide one and verify it. On successful verification, the phone number is attached to the consumer account for later use.

## Multi-Factor Authentication on other policies

As described for sign-up & sign-in policies above, it is also possible to enable multi-factor authentication on sign-up or sign-in policies and password reset policies. It will be available soon on profile editing policies.
