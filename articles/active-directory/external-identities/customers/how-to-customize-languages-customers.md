---
title: Add customized browser language to your CIAM app
description: Learn about how to add a customized browser language to your CIAM app.
services: active-directory
author: csmulligan
ms.author: cmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 03/06/2023
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about how to add customized browser languages to my CIAM app.
---
# Add customized browser language to your CIAM app

You can create a personalized sign-in experience for users who sign in using a specific browser language by customizing the branding elements. If you don't make any changes to the elements, the default elements will be displayed.

## Prerequisites

- Review the file size requirements for each image you want to add. You may need to use a photo editor to create the right-sized images. The preferred image type for all images is PNG, but JPG is accepted.

## Add browser language

1. Sign in to the Azure portal using a Global administrator account for the directory.

2. Go to **Azure Active Directory** > **Company branding**.

3. Under **Default sign-in experience**, select **Add browser language**. 

<!--   ![Screenshot](media/ciam-pp1/15-company-branding-add-browser-language-button.png)-->

4. On the **Basics** tab, under **Language specific UI Customization**, select the browser language you want to customize from the menu. Azure AD includes support for the following languages:

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
   
5. Customize the elements on the **Basics**, **Layout**, **Header**, **Footer**, and **Sign-in form** tabs. For detailed steps, refer to the section above. To customize the default sign-in experience.

6. When you’re finished, select the **Next: Review** tab and review all of your language customizations. Then select **Add** if you would like to save your changes or **Previous** if you would like to continue customizing.

## Right-to-left language support

For languages that are read right-to-left, such as Arabic and Hebrew, they are displayed in the opposite direction compared to languages that are read left-to-right. Azure AD supports right-to-left functionality and features for languages that work in a right-to-left environment for entering, and displaying data. Right-to-left readers can interact in a natural reading manner. 

## Next steps

- [Customize the branding and end-user experience](how-to-customize-branding-customers.md) 
