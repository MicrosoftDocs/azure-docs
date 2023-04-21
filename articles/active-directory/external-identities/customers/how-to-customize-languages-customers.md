---
title: Customize the browser language for authentication
description: Learn about how to customize the browser language of your app's authentication experience.
services: active-directory
author: csmulligan
ms.author: cmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/21/2023
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about how to add customized browser languages to my app's authentication experience.
---
# Customize the language of the authentication experience

You can create a personalized sign-in experience for users who sign in using a specific browser language by customizing the branding elements. If you don't make any changes to the elements, the default elements will be displayed.

## Prerequisites

- If you haven't already created your own Azure AD customer tenant, create one now.
- [Register an application](how-to-register-ciam-app.md).  
- [Create a user flow](concept-user-flows-customers.md)
- Review the file size requirements for each image you want to add. You may need to use a photo editor to create the right-sized images. The preferred image type for all images is PNG, but JPG is accepted.

## Add browser language

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter in the top menu to switch to the customer tenant you created earlier.
1. In the search bar, type and select **Company branding**.
1. Under **Browser language customizations**, select **Add browser language**. 

   :::image type="content" source="media/how-to-customize-languages-customers/company-branding-add-browser-language.png" alt-text="Screenshot of the browser language customizations tab.":::

4. On the **Basics** tab, under **Language specific UI Customization**, select the browser language you want to customize from the menu. 

   :::image type="content" source="media/how-to-customize-languages-customers/language-selection.png" alt-text="Screenshot of selecting a language.":::

The following languages are supported in the customer tenant: 

   - Arabic (Saudi Arabia)
   - Basque (Basque)
   - Bulgarian (Bulgaria)
   - Catalan (Catalan)
   - Chinese (China)
   - Chinese (Hong Kong SAR)
   - Croatian (Croatia)
   - Czech (Czechia)
   - Danish (Denmark)
   - Dutch (Netherlands)
   - English (United States)
   - Estonian (Estonia)
   - Finnish (Finland)
   - French (France)
   - Galician (Galician)
   - German (Germany)
   - Greek (Greece)
   - Hebrew (Israel)
   - Hungarian (Hungary)
   - Italian (Italy)
   - Japanese (Japan)
   - Kazakh (Kazakhstan)
   - Korean (Korea)
   - Latvian (Latvia)
   - Lithuanian (Lithuania)
   - Norwegian Bokmål (Norway)
   - Polish (Poland)
   - Portuguese (Brazil)
   - Portuguese (Portugal)
   - Romanian (Romania)
   - Russian (Russia)
   - Serbian (Latin, Serbia)
   - Slovak (Slovakia)
   - Slovenian (Sierra Leone)
   - Spanish (Spain)
   - Swedish (Sweden)
   - Thai (Thailand)
   - Turkish (Turkey)
   - Ukrainian (Ukraine)
   
5. Customize the elements on the **Basics**, **Layout**, **Header**, **Footer**, **Sign-in form**, and **Text** tabs. For detailed instructions, see [Customize the branding and end-user experience](how-to-customize-branding-customers.md).
6. When you’re finished, select the **Review** tab and go over all of your language customizations. Then select **Add** if you would like to save your changes or **Previous** if you would like to continue editing.

## Right-to-left language support

Languages that are read right-to-left, such as Arabic and Hebrew, are displayed in the opposite direction compared to languages that are read left-to-right. The customer tenant supports right-to-left functionality and features for languages that work in a right-to-left environment for entering, and displaying data. Right-to-left readers can interact in a natural reading manner. 

:::image type="content" source="media/how-to-customize-languages-customers/right-to-left-language-support.png" alt-text="Screenshot showing the right-to-left language support.":::

## Next steps

- [Customize the branding and end-user experience](how-to-customize-branding-customers.md) 
