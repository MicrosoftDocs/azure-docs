---
title: 'Azure Active Directory B2C: Self-service password reset | Microsoft Docs'
description: A topic demonstrating how to set up self-service password reset for your consumers in Azure Active Directory B2C
services: active-directory-b2c
documentationcenter: ''
author: davidmu1
manager: mtillman
editor: ''

ms.service: active-directory-b2c
ms.workload: identity
ms.topic: article
ms.date: 12/06/2016
ms.author: davidmu

---
# Azure Active Directory B2C: Set up self-service password reset for your consumers
With the self-service password reset feature, your consumers (who have signed up for local accounts) can reset their passwords on their own. This significantly reduces the burden on your support staff, especially if your application has millions of consumers using it on a regular basis. Currently, we only support using a verified email address as a recovery method. We will add additional recovery methods (verified phone number, security questions, etc.) in the future.

> [!NOTE]
> This article applies to self-service password reset used in the context of a sign-in policy. If you need fully customizable password reset policies invoked from your app, see [this article](active-directory-b2c-reference-policies.md#create-a-password-reset-policy).
> 
> 

By default, your directory will not have self-service password reset turned on. Use the following steps to turn it on:

1. Sign in to the [Azure portal](https://portal.azure.com/) as the Subscription Administrator. This is the same work or school account or the same Microsoft account that you used to create your directory.
2. Open Active Directory (in the navigation bar on the left side).
3. Select **Properties**.
4. Scroll down to the **Self-service password reset enabled** section and toggle it to **All**. 
5. Click **Save** at the top of the page. You're done!

To test, use the "Run now" feature on any sign-in policy that has local accounts as an identity provider. On the local account sign-in page (where you enter an email address and password, or a username and password), click **Can't access your account?** to verify the consumer experience.

> [!NOTE]
> The self-service password reset pages can be customized by using the [company branding feature](../active-directory/customize-branding.md).
> 
> 

