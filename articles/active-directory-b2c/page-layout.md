---
title: Select a page layout - Azure Active Directory B2C
description: Learn about how to select a page layout in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/18/2019
ms.author: marsma
ms.subservice: B2C
---

# Select a page layout in Azure Active Directory B2C using custom policies

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

You can enable JavaScript client-side code in your Azure Active Directory B2C (Azure AD B2C) policies whether you’re using user flows or custom policies. To enable JavaScript for your applications, you must add an element to your [custom policy](custom-policy-overview.md), select a page layout, and use [b2clogin.com](b2clogin.md) in your requests.

A page layout is an association of elements that Azure AD B2C provides and the content that you provide.

This article discusses how to select a page layout in Azure AD B2C by configuring it in a custom policy.

> [!NOTE]
> If you want to enable JavaScript for user flows, see [JavaScript and page layout versions in Azure Active Directory B2C](user-flow-javascript-overview.md).

## Replace DataUri values

In your custom policies, you may have [ContentDefinitions](contentdefinitions.md) that define the HTML templates used in the user journey. The **ContentDefinition** contains a **DataUri** that refers to the page elements provided by Azure AD B2C. The **LoadUri** is the relative path to the HTML and CSS content that you provide.

```XML
<ContentDefinition Id="api.idpselections">
  <LoadUri>~/tenant/default/idpSelector.cshtml</LoadUri>
  <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
  <DataUri>urn:com:microsoft:aad:b2c:elements:contract:providerselection:1.0.0</DataUri>
  <Metadata>
    <Item Key="DisplayName">Idp selection page</Item>
    <Item Key="language.intro">Sign in</Item>
  </Metadata>
</ContentDefinition>
```

To select a page layout, you change the **DataUri** values in your [ContentDefinitions](contentdefinitions.md) in your policies. By switching from the old **DataUri** values to the new values, you're selecting an immutable package. The benefit of using this package is that you know it won't change and cause unexpected behavior on your page.

To specify a page layout in your custom policies that use an old **DataUri** value, insert `contract` between `elements` and the page type (for example, `selfasserted`), and specify the version number. For example:

| Old DataUri value | New DataUri value |
| ----------------- | ----------------- |
| `urn:com:microsoft:aad:b2c:elements:claimsconsent:1.0.0` | `urn:com:microsoft:aad:b2c:elements:contract:claimsconsent:1.0.0` |
| `urn:com:microsoft:aad:b2c:elements:globalexception:1.0.0` | `urn:com:microsoft:aad:b2c:elements:contract:globalexception:1.0.0` |
| `urn:com:microsoft:aad:b2c:elements:globalexception:1.1.0` | `urn:com:microsoft:aad:b2c:elements:contract:globalexception:1.1.0` |
| `urn:com:microsoft:aad:b2c:elements:idpselection:1.0.0` | `urn:com:microsoft:aad:b2c:elements:contract:providerselection:1.0.0` |
| `urn:com:microsoft:aad:b2c:elements:multifactor:1.0.0` | `urn:com:microsoft:aad:b2c:elements:contract:multifactor:1.0.0` |
| `urn:com:microsoft:aad:b2c:elements:multifactor:1.1.0` | `urn:com:microsoft:aad:b2c:elements:contract:multifactor:1.1.0` |
| `urn:com:microsoft:aad:b2c:elements:selfasserted:1.0.0` | `urn:com:microsoft:aad:b2c:elements:contract:selfasserted:1.0.0` |
| `urn:com:microsoft:aad:b2c:elements:selfasserted:1.1.0` | `urn:com:microsoft:aad:b2c:elements:contract:selfasserted:1.1.0` |
| `urn:com:microsoft:aad:b2c:elements:unifiedssd:1.0.0` | `urn:com:microsoft:aad:b2c:elements:contract:unifiedssd:1.0.0` |
| `urn:com:microsoft:aad:b2c:elements:unifiedssp:1.0.0` | `urn:com:microsoft:aad:b2c:elements:contract:unifiedssp:1.0.0` |
| `urn:com:microsoft:aad:b2c:elements:unifiedssp:1.1.0` | `urn:com:microsoft:aad:b2c:elements:contract:unifiedssp:1.1.0` |

## Version change log

Page layout packages are periodically updated to include fixes and improvements in their page elements. The following change log specifies the changes introduced in each version.

### 2.0.0

- Self-asserted page (`selfasserted`)
  - Added support for [display controls](display-controls.md) in custom policies.

### 1.2.0

- All pages
  - Accessibility fixes
  - You can now add the `data-preload="true"` attribute in your HTML tags to control the load order for CSS and JavaScript. Scenarios include:
    - Use this on your CSS link to load the CSS at the same time as your HTML so that it doesn't 'flicker' between loading the files
    - This attribute allows you to control the order in which your Script tags are fetched and executed before the page load
  - Email field is now `type=email` and mobile keyboards will provide the correct suggestions
  - Support for Chrome translate
- Unified and self-asserted page
  - The username/email and password fields now use the form HTML element.  This will now allow Edge and IE to properly save this information

### 1.1.0

- Exception page (globalexception)
  - Accessibility fix
  - Removed the default message when there is no contact from the policy
  - Default CSS removed
- MFA page (multifactor)
  - 'Confirm Code' button removed
  - The input field for the code now only takes input up to six (6) characters
  - The page will automatically attempt to verify the code entered when a 6-digit code is entered, without any button having to be clicked
  - If the code is wrong then the input field is automatically cleared
  - After three (3) attempts with an incorrect code, B2C sends an error back to the relying party
  - Accessibility fixes
  - Default CSS removed
- Self-asserted page (selfasserted)
  - Removed cancel alert
  - CSS class for error elements
  - Show/hide error logic improved
  - Default CSS removed
- Unified SSP (unifiedssp)
  - Added keep me signed in (KMSI) control

### 1.0.0

- Initial release

## Next steps

Find more information about how you can customize the user interface of your applications in [Customize the user interface of your application using a custom policy in Azure Active Directory B2C](custom-policy-ui-customization.md).
