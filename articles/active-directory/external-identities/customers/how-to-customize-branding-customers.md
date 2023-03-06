---
title: Customize the user experience for your customers
description: Learn how to customize the look and feel of your customers' sign-in experiences, including company branding and languages customizations.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 03/03/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to Learn about the options for customizing the look and feel of the customer experience.
---

# Customize the branding and end-user experience

After creating a new customer tenant, you can customize the end-user experience. Create a custom look and feel for users signing in to your web-based apps by configuring **Company branding** settings for your tenant. With these settings, you can add your own background images, colors, company logos, and text to customize the sign-in experiences across your apps.  


- **Company branding** – Customize the look and feel of your sign-in and sign-up experiences, including both the default experience and the experience for specific browser languages. You can also create user flows programmatically using the Company Branding Graph API.

## Prerequisites

- Review the file size requirements for each image you want to add. You may need to use a photo editor to create the right-sized images. The preferred image type for all images is PNG, but JPG is accepted.

## How to customize the default sign-in experience

The default sign-in experience is the global look and feel that applies across all sign-ins to your tenant. Before you customize any settings, the default Microsoft branding will appear in your sign-in pages. You can customize this default experience with a custom background image or color, favicon, layout, header, and footer. You can also upload a custom CSS. [CSS reference guide](#css-reference-guide)

1. Make sure you're using the directory that contains your customer tenant. Select the **Directories + subscriptions** icon in the portal toolbar.

1. On the **Portal settings | Directories + subscriptions** page, find your customer directory in the Directory name list, and then select **Switch**.

1. Go to Azure **Active Directory** > **Company branding**.

1. Under **Default sign-in experience**, select **Edit**.

   <!--[Screenshot](media/8-company-branding-default-edit-button.png) -->
   
### To customize the sign-in page background and layout

1. On the **Basics** tab, modify any of the background elements.

   - **Favicon** – The icon that displays in the web browser tab. If you upload an image, it replaces the default Microsoft favicon.

   - **Background image** – The large image that displays on the Azure AD sign-in page. If you upload an image, it scales and crop to fill the browser window.

   - **Page background color** – The color that replaces the background image whenever the image can’t be loaded, for example due to connection latency.

   <!--[Screenshot](media/9-company-branding-basics-tab.png) -->

1. Select **Next: Layout** if you would like to continue customizing or **Review + save** if you would like to save your changes.

1. On the Layout tab, select the placement of web page elements on the sign-in page.

   - **Template** – Choose whether the background displays full-screen or partial-screen.

   - **Header** – Show or hide the header.

   - **Footer** – Show or hide the footer.

   - **Custom CSS** – Upload your own CSS file to replace default Microsoft styling with your own styling for: color, font, text size, position of elements, and displays for different devices and screen sizes.  

   <!--[Screenshot](media/10-company-branding-layout-tab.png) -->

1. Select **Next: Header** if you would like to continue customizing or **Review + save** if you would like to save your changes.

### To customize the logo, privacy link, and terms of use

1. On the **Header** tab, select the logo to display in the header of the sign-in page.

   <!--[Screenshot](media/11-company-branding-header-tab.png)-->

1. Select **Next: Footer** if you would like to continue customizing or **Review + save** if you would like to save your changes. 

1. On the **Footer** tab, you can customize the URLs and link text for the privacy and terms of use hyperlinks that appear in the footer of the sign-in page.  

   - **Privacy & Cookies** – Select the checkbox next to Privacy & Cookies to display this hyperlink in the footer. The Microsoft default privacy link displays unless you enter your own hyperlink Display text and URL. 

   - **Terms of Use** – Select the checkbox next to Terms of Use to display this hyperlink in the footer. The Microsoft terms of use link  displays unless you enter your own hyperlink Display text and URL. 

   <!--[Screenshot](media/12-company-branding-footer-tab.png)-->

1. Select **Next: Sign-in form** if you would like to continue customizing or **Review + save** if you would like to save your changes.

### To customize the sign-in form

1. On the **Sign-in form** tab, configure elements of the sign-in form: 

   - **Banner logo** – Displays on the sign-in page and in the user’s access panel. 

   - **Square logo (light theme)** – Represents user accounts in your organization. 

   - **Square logo (dark theme)** – If the light theme square logo displays poorly on dark backgrounds, you can upload a logo to be used in its place when dark backgrounds are used (for example, Microsoft Azure AD Joined screens in the out-of-box experience). 

   <!--[Screenshot](media/13-company-branding-sign-in-form-tab-1.png)-->

1. Scroll to the lower half of the page and configure more elements of the sign-in form:

   - **Username hint text** – The hint text that displays in the username input field on the sign-in page (not recommended if guest users sign in to your app). 

   - **Sign-in page text** – Appears at the bottom of the sign-in page and in the Azure AD Join experience on Windows. Guidelines:

      - 1024 characters maximum
      - Don't include sensitive information
      - Use this syntax to format text:  
         - Hyperlink: `[text](link)`
         - Bold: `**text** or __text__`
         - Italics: `*text* or _text_`
         - Underline: `++text++`

### To customize self-service password reset

 1. Scroll to the **Self-service password reset** section to configure options for showing, hiding, or customizing the self-service password reset link on the sign-in page. 

      - **Show self-service password reset** – Select this checkbox to display the self-service password link. 
      - **Common URL** – Enter a password reset URL to use in place of the default Microsoft link. 
      - **Account collection display text** – Enter link text to display in place of the Microsoft default text “Can’t access your account” text. 
      - **Password collection display text** – Enter link text to display in place of the Microsoft default “Forgot password” text. 

   <!--[Screenshot](media/14-company-branding-sign-in-form-tab-2.png)-->

1. Select **Next: Review** and review all your modifications. Then select **Save** if you would like to save your changes or **Previous** if you would like to continue customizing.

## How to add a customized browser language

By adding a browser language and modifying some or all of the branding elements, you can create an experience that’s unique to users who sign in using that browser language. For any elements you don’t modify, your default elements will appear.

1. Sign in to the Azure portal using a Global administrator account for the directory.

1. Go to **Azure Active Directory** > **Company branding**.

1. Under **Default sign-in experience**, select **Add browser language**. 

   <!--[Screenshot](media/15-company-branding-add-browser-language-button.png)-->

1. On the **Basics** tab, under **Language specific UI Customization**, select the browser language you want to customize from the menu. Azure AD includes support for the following languages:

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

   The following screenshot shows how to select a language.

   <!--[Screenshot](media/16-company-branding-browser-language.png)-->

1. Customize the elements on the **Basics**, **Layout**, **Header**, **Footer**, and **Sign-in form** tabs. For detailed steps, refer to the section above. To customize the default sign-in experience.

1. When you’re finished, select the **Next: Review** tab and review all of your language customizations. Then select **Add** if you would like to save your changes or **Previous** if you would like to continue customizing.

## Right-to-left language support

In the area of right-to-left (RTL) language support, such as Arabic and Hebrew languages, they're read right-to-left, instead of left-to-right (LTR). Azure AD supports right-to-left functionality and features for languages that work in a right-to-left environment for entering, and displaying data. Right-to-left readers can interact in a natural reading manner. 

The following screenshot demonstrates a sign-in page in LTR and RTL orientations:

<!--[Screenshot of the Azure AD sign-in page in English, Arabic and Hebrew.](./media/company-branding-rtl-support.png)-->

## CSS reference guide

Branding and customizing the user interface that Azure AD displays to your users helps provide a seamless user experience in your application. Use the following CSS selectors to customize the look and feel of your sign-in and sign-up experiences and apply more styling:

### HTML selectors

- `body` -  Styles for the whole page
- **Styles for links**

  - `a, a:link` - Styles for links.
  - `a:hover` - Styles for links when the mouse is over the link.
  - `a:focus` - Styles for links when the link has focus.
  - `a:focus:hover` - Styles for links when the link has focus and the mouse is over the link.
  - `a:active` - Styles for links when the link is being clicked.

### Azure AD CSS selectors

- `.ext-background-image` -  Styles for the holder that contains the background image in the default lightbox template.

- **Styles for the header**

  - `.ext-header` -  Styles for the header at the top of the page.

  - `.ext-header-logo` -  Styles for the header logo at the top of the page.

<!--  ![](./media/css-reference/ext-header.png)-->

- **Styles for the full-screen background**

  - `.ext-middle` -   Styles for the container in the default lightbox template that aligns the sign-in box vertically to the middle and horizontally to the center.

- **Styles for the partial-screen background (AD-FS style)**

  - `.ext-vertical-split-main-section` - Styles for the container in the vertical split (ADFS) template that contains both a sign-in box and a background

  - `.ext-vertical-split-background-image-container` - Styles for the background in the vertical split (ADFS) template.

- `.ext-sign-in-box` -  Styles for the sign-in box container.

<!--  ![](./media/css-reference/ext-sign-in-box.png)-->

- `.ext-title` -  Styles for title text.

<!--  ![](./media/css-reference/ext-title.png)-->

- `.ext-subtitle` - Styles for subtitle text.

- **Styles for primary buttons**

  - `.ext-button.ext-primary` - Styles for primary buttons.

  - `.ext-button.ext-primary:hover` - Styles for primary buttons when the mouse is over the button.

  - `.ext-button.ext-primary:focus` - Styles for primary buttons when the button has focus.

  - `.ext-button.ext-primary:focus:hover` - Styles for primary buttons when the button has focus and the mouse is over the button.

  - `.ext-button.ext-primary:active` - Styles for primary buttons when the button is being clicked. 

  The following screenshot shows an example of a primary button.

<!--  ![](./media/css-reference/ext-button-ext-primary.png)-->

- **Styles for secondary buttons**

  - `.ext-button.ext-secondary` - Styles for secondary buttons.

  - `.ext-button.ext-secondary:hover` - Styles for secondary buttons when the mouse is over the button.

  - `.ext-button.ext-secondary:focus` Styles for secondary buttons when the button has focus.

  - `.ext-button.ext-secondary:focus:hover` - Styles for secondary buttons when the button has focus and the mouse is over the button.

  - `.ext-button.ext-secondary:active` - Styles for secondary buttons when the button is being clicked.

  The following screenshot an example of a secondary button.

<!--  ![](./media/css-reference/ext-secondary.png)-->

- `.ext-error` - Styles for error text. The following screenshot shows an invalid username error message.

<!--  ![](./media/css-reference/ext-error.png)-->

- **Styles for text boxes**

  - `.ext-input.ext-text-box` - Styles for text boxes.

  - `.ext-input.ext-text-box.ext-has-error` - Styles for text boxes when there's a validation error associated with the text box.

  - `.ext-input.ext-text-box:hover` - Styles for text boxes when the mouse is over the text box.

  - `.ext-input.ext-text-box:focus` - Styles for text boxes when the text box has focus.

  - `.ext-input.ext-text-box:focus:hover` - Styles for text boxes when the text box has focus and the mouse is over the text box.

  The following screenshot shows an example of a text box.

<!--  ![](./media/css-reference/ext-input-ext-text-box.png)-->
  
- `.ext-boilerplate-text` - Styles for the custom message text at the bottom of the sign-in box.

<!--  ![](./media/css-reference/ext-boilerplate-text.png)-->

- `.ext-promoted-fed-cred-box` - Styles for sign-in options text box.

<!--  ![](./media/css-reference/ext-promoted-fed-cred-box.png)-->

- **Footer**

  - `.ext-footer` - Styles for the footer at the bottom of the page.

  - `ext-footer-links` -  Styles for the links area in the footer at the bottom of the page.

  - `.ext-footer-item` - Styles for link items in the footer at the bottom of the page.

  - `.ext-debug-item` - Styles for the debug details ellipsis in the footer at the bottom of the page.

  The following screenshot shows the footer elements.

<!--  ![](./media/css-reference/ext-footer.png)-->

## Next steps

- [Add Google as an identity provider](how-to-google-federation-customers.md)