---
title: Disable email verification during customer sign-up
titleSuffix: Azure AD B2C
description: Learn how to disable email verification during customer sign-up in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/11/2020
ms.author: mimart
ms.subservice: B2C
---

# Disable email verification during customer sign-up in Azure Active Directory B2C

[!INCLUDE [disable email verification intro](../../includes/active-directory-b2c-disable-email-verification.md)]

Follow these steps to disable email verification:

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Use the **Directory + subscription** filter in the top menu to select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select the user flow for which you want to disable email verification. For example, *B2C_1_signinsignup*.
1. Select **Page layouts**.
1. Select **Local account sign-up page**.
1. Under **User attributes**, select **Email Address**.
1. In the **REQUIRES VERIFICATION** drop-down, select **No**.
1. Select **Save**. Email verification is now disabled for this user flow.

## Next steps

- Learn how to [customize the user interface in Azure Active Directory B2C](customize-ui-overview.md)

