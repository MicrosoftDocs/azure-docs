---
title: Select a page layout - Azure Active Directory B2C
description: Learn about how to select a page layout in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 02/10/2020
ms.author: marsma
ms.subservice: B2C
---

# Page layout version in Azure Active Directory B2C 
Page layout packages are periodically updated to include fixes and improvements in their page elements. The following change log specifies the changes introduced in each version.

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

### 2.0.0

- Self-asserted page (`selfasserted`)
  - Added support for [display controls](display-controls.md) in custom policies.

### 1.2.0

- All pages
  - Accessibility fixes
  - You can now add the `data-preload="true"` attribute in your HTML tags to control the load order for CSS and JavaScript. Scenarios include:
    - Load linked CSS files at the same time as your HTML template, so that it doesn't 'flicker' between loading the files.
    - Control the order in which your Script tags are fetched and executed before the page load.
  - Email field is now `type=email` and mobile keyboards will provide the correct suggestions
  - Support for Chrome translate
- Unified and self-asserted pages
  - The username/email and password fields now use the form HTML element, which allows Edge and IE to properly save this information.

### 1.1.0

- Exception page (globalexception)
  - Accessibility fix
  - Removed the default message when there is no contact from the policy
  - Default CSS removed
- MFA page (multifactor)
  - 'Confirm Code' button removed
  - The input field for the code now only takes input up to six (6) characters
  - The page will automatically attempt to verify the code entered when a 6-digit code is entered, without any button having to be clicked
  - If the code is wrong, then the input field is automatically cleared
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
