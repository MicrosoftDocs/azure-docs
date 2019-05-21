---
title: JavaScript and page contract versions for user flows in Azure Active Directory B2C | Microsoft Docs
description: Learn how to enable JavaScript and use page contract versions to customize a user flow in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 02/07/2019
ms.author: davidmu
ms.subservice: B2C
---

# About using JavaScript and page contract versions in a user flow

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

Azure AD B2C provides a set of packaged content containing HTML, CSS, and JavaScript for the user interface elements in your user flows. If you intend to enable [JavaScript](javascript-samples.md) client-side code in your user flows, you’ll want to be sure the elements you’re basing your JavaScript on are immutable. Otherwise, any changes could cause unexpected behavior on your user flow pages. To prevent these issues, you can enforce the use of a page contract for a user flow and specify a page contract version. Doing this will ensure that all the content definitions that you’ve based your JavaScript on are immutable. Even if you don’t intend to enable JavaScript for a user flow, you can specify a page contract version for your user flow pages.

> [!NOTE]
> This article discusses JavaScript for user flows, but you can also use JavaScript and select page contract versions when you’re using [custom policies](page-contract.md).

## Enable JavaScript

In the user flow properties, you can enable JavaScript, which also enforces the use of a page contract. Then you can set the page contract version as described in the next section.

![Enable JavaScript setting](media/user-flow-javascript-overview/javascript-settings.PNG)

## Specify a page contract version

Whether or not you enable JavaScript in your user flow's properties, you can specify a page contract version for your user flow pages. Open the user flow and select **Page Layouts**. Under **Layout Name**, select a user flow page and choose the **Page Contract Version**.

![Enable JavaScript setting](media/user-flow-javascript-overview/page-contract-version.PNG)

## Next steps
See the [JavaScript samples for use in Azure Active Directory B2C](javascript-samples.md).
