---
title: Page layout versions
titleSuffix: Azure AD B2C
description: Page layout version history for UI customization in custom policies.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 08/24/2020
ms.author: mimart
ms.subservice: B2C
---

# Page layout versions

Page layout packages are periodically updated to include fixes and improvements in their page elements. The following change log specifies the changes introduced in each version.

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

## Self-asserted page (selfasserted)

**2.1.0**

- Localization and accessibility fixes.

**2.0.0**

- Added support for [display controls](display-controls.md) in custom policies.

**1.2.0**

- The username/email and password fields now use the `form` HTML element to allow Edge and Internet Explorer (IE) to properly save this information.
- Added a configurable user input validation delay for improved user experience.
- Accessibility fixes
- You can now add the `data-preload="true"` attribute [in your HTML tags](custom-policy-ui-customization.md#guidelines-for-using-custom-page-content) to control the load order for CSS and JavaScript.
  - Load linked CSS files at the same time as your HTML template so it doesn't 'flicker' between loading the files.
  - Control the order in which your `script` tags are fetched and executed before the page load.
- Email field is now `type=email` and mobile keyboards will provide the correct suggestions
- Support for Chrome translate

**1.1.0**

- Removed cancel alert
- CSS class for error elements
- Show/hide error logic improved
- Default CSS removed

**1.0.0**

- Initial release

## Unified sign-in sign-up page with password reset link (unifiedssp)

**2.1.0**

- Added support for multiple sign-up links.
- Added support for user input validation according to the predicate rules defined in the policy.

**1.2.0**

- The username/email and password fields now use the `form` HTML element to allow Edge and Internet Explorer (IE) to properly save this information.
- Accessibility fixes
- You can now add the `data-preload="true"` attribute [in your HTML tags](custom-policy-ui-customization.md#guidelines-for-using-custom-page-content) to control the load order for CSS and JavaScript.
  - Load linked CSS files at the same time as your HTML template so it doesn't 'flicker' between loading the files.
  - Control the order in which your `script` tags are fetched and executed before the page load.
- Email field is now `type=email` and mobile keyboards will provide the correct suggestions
- Support for Chrome translate

**1.1.0**

- Added keep me signed in (KMSI) control

**1.0.0**

- Initial release

## MFA page (multifactor)

**1.2.1**

- Accessibility fixes on default templates

**1.2.0**

- Accessibility fixes
- You can now add the `data-preload="true"` attribute [in your HTML tags](custom-policy-ui-customization.md#guidelines-for-using-custom-page-content) to control the load order for CSS and JavaScript.
  - Load linked CSS files at the same time as your HTML template so it doesn't 'flicker' between loading the files.
  - Control the order in which your `script` tags are fetched and executed before the page load.
- Email field is now `type=email` and mobile keyboards will provide the correct suggestions
- Support for Chrome translate

**1.1.0**

- 'Confirm Code' button removed
- The input field for the code now only takes input up to six (6) characters
- The page will automatically attempt to verify the code entered when a 6-digit code is entered, without any button having to be clicked
- If the code is wrong, the input field is automatically cleared
- After three (3) attempts with an incorrect code, B2C sends an error back to the relying party
- Accessibility fixes
- Default CSS removed

**1.0.0**

- Initial release

## Exception Page (globalexception)

**1.2.0**

- Accessibility fixes
- You can now add the `data-preload="true"` attribute [in your HTML tags](custom-policy-ui-customization.md#guidelines-for-using-custom-page-content) to control the load order for CSS and JavaScript.
  - Load linked CSS files at the same time as your HTML template so it doesn't 'flicker' between loading the files.
  - Control the order in which your `script` tags are fetched and executed before the page load.
- Email field is now `type=email` and mobile keyboards will provide the correct suggestions
- Support for Chrome translate

**1.1.0**

- Accessibility fix
- Removed the default message when there is no contact from the policy
- Default CSS removed

**1.0.0**

- Initial release

## Other pages (ProviderSelection, ClaimsConsent, UnifiedSSD)

**1.2.0**

- Accessibility fixes
- You can now add the `data-preload="true"` attribute [in your HTML tags](custom-policy-ui-customization.md#guidelines-for-using-custom-page-content) to control the load order for CSS and JavaScript.
  - Load linked CSS files at the same time as your HTML template so it doesn't 'flicker' between loading the files.
  - Control the order in which your `script` tags are fetched and executed before the page load.
- Email field is now `type=email` and mobile keyboards will provide the correct suggestions
- Support for Chrome translate

**1.0.0**

- Initial release

## Next steps

For details on how to customize the user interface of your applications in custom policies, see [Customize the user interface of your application using a custom policy](custom-policy-ui-customization.md).
