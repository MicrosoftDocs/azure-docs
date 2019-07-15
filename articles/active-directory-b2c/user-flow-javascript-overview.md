---
title: JavaScript and page contract versions - Azure Active Directory B2C | Microsoft Docs
description: Learn how to enable JavaScript and use page contract versions in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/25/2019
ms.author: marsma
ms.subservice: B2C
---

# JavaScript and page contract versions in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

Azure AD B2C provides a set of packaged content containing HTML, CSS, and JavaScript for the user interface elements in your user flows and custom policies. To enable JavaScript for your applications, you must add an element to your [custom policy](active-directory-b2c-overview-custom.md) or enable it in the portal for user flows, select a page contract, and use [b2clogin.com](b2clogin.md) in your requests.

If you intend to enable [JavaScript](javascript-samples.md) client-side code, you’ll want to be sure the elements you’re basing your JavaScript on are immutable. Otherwise, any changes could cause unexpected behavior on your user pages. To prevent these issues, you can enforce the use of a page contract and specify a page contract version. Doing this ensures that all the content definitions that you’ve based your JavaScript on are immutable. Even if you don’t intend to enable JavaScript, you can specify a page contract version for your pages.

## User flows

In the user flow properties, you can enable JavaScript, which also enforces the use of a page contract. Then you can set the page contract version as described in the next section.

![User flow properties page with Enable JavaScript setting highlighted](media/user-flow-javascript-overview/javascript-settings.png)

Whether or not you enable JavaScript in your user flow's properties, you can specify a page contract version for your user flow pages. Open the user flow and select **Page Layouts**. Under **Layout Name**, select a user flow page and choose the **Page Contract Version**.

![Page layout settings in portal showing page contract version dropdown](media/user-flow-javascript-overview/page-contract-version.png)

## Custom policies

To enable JavaScript in custom policies, you add the **ScriptExecution** element to the **RelyingParty** element in your custom policy file. For more information, see [JavaScript samples for use in Azure Active Directory B2C](javascript-samples.md).

Whether or not you enable JavaScript in your custom policies, you can specify a page contract version for your pages. For more information about specifying a page contract, see [Select a page contract in Azure Active Directory B2C using custom policies](page-contract.md).

## Next steps

See the [JavaScript samples for use in Azure Active Directory B2C](javascript-samples.md).
