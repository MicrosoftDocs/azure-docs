---
title: Add branding to your organization's sign-in page - Azure AD
description: Instructions about how to add your organization's branding to the Azure Active Directory sign-in page.
services: active-directory
author: barclayn
manager: rkarlin

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: how-to
ms.date: 07/03/2021
ms.author: barclayn
ms.reviewer: kexia
ms.custom: "it-pro, seodec18, fasttrack-edit"
ms.collection: M365-identity-device-management
---

# Configure your company branding

Create a consistent experience when users sign into your organization's web-based apps that use Azure Active Directory (Azure AD) as your identity provider, such as Microsoft 365. The sign-in process can include your company logo and color scheme, a streamlined sign-in option, and customized experiences based on browser language.

## Customize the default sign-in experience

You can customize the sign-in pages that use Azure AD as the identity provider when users sign in to your organization's tenant-specific apps, such as `https://outlook.com/woodgrove.com`, or when passing a domain variable, such as `https://passwordreset.microsoftonline.com/?whr=woodgrove.com`.

Custom branding appears after users sign in. If users start the sign-in process at a site like www\.office.com they will not see the branding. After users sign in, the branding may take at least 15 minutes to appear.

### Before you begin

**All branding elements are optional. Default settings will remain, if left unchanged.** For example, if you specify a banner logo but no background image, the sign-in page shows your logo with a default background image from the destination site such as Microsoft 365. Additionally, sign-in page branding doesn't carry over to personal Microsoft accounts. If your users or guests sign in using a personal Microsoft account, the sign-in page won't reflect the branding of your organization.

**Images have different image and file size requirements.** Take note of the requirements for each option. You may need to use a photo editor to create the right-sized images. The preferred image type for all images is PNG. 

1. Sign in to the [Azure portal](https://portal.azure.com/) using a Global administrator account for the directory.

2. Select **Azure Active Directory** > **Company branding** > **Customize**.

The sign-in experience process is grouped into six sections. At the end of each section, click **Review + create** to review what you have selected and submit your changes or **Next** to move to the next section.

### Basics

- **Favicon**: Select a PNG or JPG that appears in the web browser tab.

- **Background image**: Select a PNG or JPG to display as the main image on your sign-in page. This image will scale and crop according to the window size.

- **Page background color**: If the background image isn't able to load because of a slower connection, this background color appears instead.

### Layout

- **Visual Templates**: Customize the layout of your sign-in page using templates or custom CSS. The details of the **Header** and **Footer** options are set on the next two sections of the process. CSS files can be uploaded to further customize the sign-in experience.

### Header

If you haven't enabled the header, go back to the previous section and select **Show header**. You won't be able to add a header logo if you haven't enabled it. Select a PNG or JPG to display in the header of the sign-in page.

### Footer

If you haven't enabled the footer, go back to the previous section and select **Show footer**. You won't be able to customize the footer until it's enabled.

- **Show 'Privacy & Cookies'**: This option is selected by default and displays the Microsoft 'Privacy & Cookies' link. If you uncheck this option you can provide your own **Display text** and **URL**.

- **Terms of Use**: This option is also elected by default and displays the Microsoft 'Terms of Use' link. If you uncheck this option you can provide your own **Display text** and **URL**.

### Sign-in form

- **Banner logo**: Select a PNG or JPG image file of a banner-sized logo (short and wide) to appear on the Azure AD sign-in page and the Access Panel service.

- **Square logo (light theme)**: Select a square PNG or JPG image file of your logo to be used in browsers that are using a light color theme. This logo is used to represent your organization on the Azure AD web interface and in Windows.

- **Square logo (dark theme)** Select a square PNG or JPG image file of your logo to be used in browsers that are using a dark color theme. This logo is used to represent your organization on the Azure AD web interface and in Windows.

- **Username hint text**: Enter hint text for the username input field on the sign-in page. If guests uses the same sign-in page, we don't recommend using hint text here.

- **Sign-in page text**: Enter text that appears on the bottom of the sign-in page. You can use this text to communicate additional information, such as the phone number to your help desk or a legal statement. This page is public, so don't provide sensitive information here. This text must be Unicode and can't exceed 1024 characters.

To begin a new paragraph, use the enter key twice. You can also change text formatting to include bold, italics, an underline or clickable link. Use the following syntax to add formatting to text: 

       > Hyperlink: `[text](link)` 
        
       > Bold: `**text**` or `__text__` 
          
       > Italics: `*text*` or `_text_` 
          
       > Underline: `++text++` 
         
> [!IMPORTANT]
> Hyperlinks that are added to the sign-in page text render as text in native environments, such as desktop and mobile applications.

- **Self-service password reset**:
    - Show self-service password reset: 
    - Commong URL: 
    - Account collection display text:
    - Password collection display text:

### Errors and prompts

Custom names and descriptions can be added to errors that users may receive. Using familiar language and linking to your support teams could help your users get resolution to errors quickly.

1. Select **+ Add Custom Error**.
2. Select an error from the dropdown list.
3. Enter a custom name, header, and body for the error.
4. Select the **Add** button to save the custom error.

### Review

All of the available options appear in one list so you can review everything you've customized or left at the default setting. When you're done, click the **Create** button. 

What happens when you click Create. Item lives under Default sign-in tab.



## Customize the sign-in experience by browser language

To create an inclusive experience for all of your users, you can customize the sign-in experience based on browser language.

1. Sign in to the [Azure portal](https://portal.azure.com/) using a Global administrator account for the directory.

2. Select **Azure Active Directory** > **Company branding** > **Add browser language**.

The process for customizing the experience is the same as the [Default sign-in experience](#customize-the-default-sign-in-experience), except for a few key steps.

- **Basics** > **Language specific UI Customization**: Select a language from the dropdown list.
- **Errors and prompts** > **Add Custom Error**: If you added custom errors for your default sign-in experience, we recommend adding custom errors in any other languages you've added. 






## License requirements

Adding custom branding and configuring the 'keep me signed in' (KMSI) option requires one of the following licenses:

- Azure AD Premium 1
- Azure AD Premium 2
- Custom branding only: Office 365 (for Office apps)
- KMSI only: Basic
- KMSI only: Microsoft 365

For more information about licensing and editions, see [Sign up for Azure AD Premium](active-directory-get-started-premium.md).

Azure AD Premium editions are available for customers in China using the worldwide instance of Azure AD. Azure AD Premium editions aren't currently supported in the Azure service operated by 21Vianet in China. 

