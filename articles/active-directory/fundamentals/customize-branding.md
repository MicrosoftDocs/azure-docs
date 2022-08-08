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

Create a consistent experience when users sign into your organization's web-based apps, such as Microsoft 365, which uses Azure Active Directory (Azure AD) as your identity provider. The sign-in process can include your company logo and color scheme, a streamlined sign-in option, and customized experiences based on browser language.

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

All of the available options appear in one list so you can review everything you've customized or left at the default setting.





## License requirements

Adding custom branding and configuring the 'keep me signed in' (KMSI) option requires one of the following licenses:

- Azure AD Premium 1
- Azure AD Premium 2
- Custom branding only: Office 365 (for Office apps)
- KMSI only: Basic
- KMSI only: Microsoft 365

For more information about licensing and editions, see [Sign up for Azure AD Premium](active-directory-get-started-premium.md).

Azure AD Premium editions are available for customers in China using the worldwide instance of Azure AD. Azure AD Premium editions aren't currently supported in the Azure service operated by 21Vianet in China. 

## Add custom branding

You can customize the sign-in pages that use Azure AD as the identity provider when users sign in to your organization's tenant-specific apps, such as `https://outlook.com/contoso.com`, or when passing a domain variable, such as `https://passwordreset.microsoftonline.com/?whr=contoso.com`.

Custom branding appears after users sign in. If users start the sign-in process at a site like www\.office.com they will not see the branding. After users sign in, the branding may take at least 15 minutes to appear.

**All branding elements are optional. Default settings will remain, if left unchanged.** For example, if you specify a banner logo but no background image, the sign-in page shows your logo with a default background image from the destination site such as Microsoft 365. Additionally, sign-in page branding doesn't carry over to personal Microsoft accounts. If your users or guests sign in using a personal Microsoft account, the sign-in page won't reflect the branding of your organization.

1. Sign in to the [Azure portal](https://portal.azure.com/) using a Global administrator account for the directory.

2. Select **Azure Active Directory** > **Company branding** > **Configure**.

    ![Contoso - Company branding page, Configure option highlighted](media/customize-branding/company-branding-configure-buttonPNG)

3. On the **Configure company branding** page, provide any or all of the following information.

    >[!IMPORTANT]
    >All the custom images you add on this page have image size (pixels), and potentially file size (KB), restrictions. Because of these restrictions, you'll most-likely need to use a photo editor to create the right-sized images.

          ![Configure company branding page, with general settings completed](media/customize-branding/configure-company-branding-general-settingsPNG)

    - **Language** The language is automatically set as your default and can't be changed.
        
    - **Sign-in page background image** Select a PNG or JPG image file to appear as the background for your sign-in pages. The image will be anchored to the center of the browser, and will scale to the size of the viewable space. You can't select an image larger than 1920x1080 pixels in size or that has a file size more than 300,000 bytes.
        
        We recommended using images without a strong subject focus because an opaque white box appears in the center of the screen, and could cover any part of the image depending on the dimensions of the viewable space.

    - **Banner logo** Select a PNG or JPG version of your logo to appear on the sign-in page after the user enters a username and on the **My Apps** portal page.
            
        The image can't be taller than 60 pixels or wider than 280 pixels, and the file shouldn’t be larger than 10 KB. We recommend using a transparent image since the background might not match your logo background. We also recommend not adding padding around the image or it might make your logo look small. 

    - **Username hint** Type the hint text that appears to users if they forget their username. This text must be Unicode, without links or code, and can't exceed 64 characters. If guests sign in to your app, we suggest not adding this hint.

    - **Sign-in page text** Type the text that appears on the bottom of the sign-in page. You can use this text to communicate additional information, such as the phone number to your help desk or a legal statement. This text must be Unicode and can't exceed 1024 characters.

       To begin a new paragraph, use the enter key twice. You can also change text formatting to include bold, italics, an underline or clickable link. Use the following syntax to add formatting to text: 

       > Hyperlink: `[text](link)` 
        
       > Bold: `**text**` or `__text__` 
          
       > Italics: `*text*` or `_text_` 
          
       > Underline: `++text++` 
         
       > [!IMPORTANT]
       > Hyperlinks that are added to the sign-in page text render as text in native environments, such as desktop and mobile applications.

    - **Advanced settings**
            
        ![Configure company branding page, with advanced settings completed](media/customize-branding/configure-company-branding-advanced-settingsPNG)   

        - **Sign-in page background color** Specify the hexadecimal color (#FFFFFF) that will appear in place of your background image in low-bandwidth connection situations. We recommend using the primary color of your banner logo or your organization color.

        - **Square logo image** Select a PNG (preferred) or JPG image of your organization's logo to appear during the setup process for new Windows 10 Enterprise devices. This image is only used for Windows authentication and appears only on tenants that are using [Windows Autopilot](/windows/deployment/windows-autopilot/windows-10-autopilot) for deployment or for password entry pages in other Windows 10 experiences. In some cases it may also appear in the consent dialog.
        
            The image can't be larger than 240x240 pixels and must have a file size of less than 10 KB. We recommend using a transparent image since the background might not match your logo background. We also recommend not adding padding around the image or it might make your logo look small.
    
        - **Square logo image, dark theme** Same as the square logo image above. This logo image takes the place of the square logo image when used with a dark background, such as with Windows 10 Azure AD joined screens during the out-of-box experience (OOBE). If your logo looks good on white, dark blue, and black backgrounds, you don't need to add this image. 
        
            >[!IMPORTANT]
            > Transparent logos are supported with the square logo image. The color palette used in the transparent logo could conflict with backgrounds (such as, white, light grey, dark grey, and black backgrounds) used within Microsoft 365 apps and services that consume the square logo image. Solid color backgrounds may need to be used to ensure the square image logo is rendered correctly in all situations.
        
        - **Show option to remain signed in** You can choose to let your users remain signed in to Azure AD until explicitly signing out. If you uncheck this option, users must sign in each time the browser is closed and reopened. This feature is covered in detail in the [Configure Stay signed in?' prompt](#configure-the-stay-signed-in-prompt) section of this article.

3. After you've finished adding your branding, select **Save** in the upper-left corner of the configuration panel.

    This process creates your first custom branding configuration, and it becomes the default for your tenant. The default custom branding configuration serves as a fallback option for all language-specific branding configurations. The configuration can't be removed after you create it.
    
    >[!IMPORTANT]
    >To add more corporate branding configurations to your tenant, you must choose **New language** on the **Contoso - Company branding** page. This opens the **Configure company branding** page, where you can follow the same steps as above.

### Add language-specific company branding
You can't change your original configuration's language from your default language. However, if you need a configuration in a different language, you can create a new configuration.

1. Sign in to the [Azure portal](https://portal.azure.com/) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, and then select **Company branding**, and then select **New language**.

    ![Contoso - Company branding page, with New language option highlighted](media/customize-branding/company-branding-new-languagePNG)

3. On the **Configure company branding** page, select your language (for example, French) and then add your translated information, based on the descriptions in the [Customize your Azure AD sign-in page](#customize-your-azure-ad-sign-in-page) section of this article.

4. Select **Save**.

    The **Contoso – Company branding** page updates to show your new French configuration.

    ![Contoso - Company branding page, with the new language configuration shown](media/customize-branding/company-branding-french-configPNG)

### Configure the 'Stay signed in?' prompt

You can customize the **Stay signed in?** prompt after a user successfully signs in without adding any other custom branding. This process is known as **Keep me signed in** (KMSI). If a user answers **Yes** to this prompt, the KMSI service gives them a persistent [refresh token](../develop/developer-glossary.md#refresh-token). For federated tenants, the prompt will show after the user successfully authenticates with the federated identity service.

The following diagram shows the user sign-in flow for a managed tenant and federated tenant using the KMSI in prompt. This flow contains smart logic so that the **Stay signed in?** option won't be displayed if the machine learning system detects a high-risk sign-in or a sign-in from a shared device.

KMSI is only available on the default custom branding. It cannot be added to language-specific branding. Some features of SharePoint Online and Office 2010 depend on users being able to choose to remain signed in. If you uncheck the **Show option to remain signed in** option, your users may see additional and unexpected prompts to sign in.

![Diagram showing the user sign-in flow for a managed vs. federated tenant](media/keep-me-signed-in/kmsi-workflowPNG)

See the [License requirements](#license-requirements) section for using the KMSI service.

### Add custom branding to pages
Add your custom branding to other pages that use Azure AD as the identity provider by modifying the end of the URL with the text with `?whr=yourdomainname`. This specific modification works on different types of pages, including the Multi-Factor Authentication (MFA) setup page, the Self-service Password Reset (SSPR) setup page, and the sign-in page.

Whether an application supports customized URLs for branding or not depends on the specific application, and should be checked before attempting to add a custom branding to a page.

**Examples:**

**Original URL:** https://aka.ms/MFASetup<br>
**Custom URL:** `https://account.activedirectory.windowsazure.com/proofup.aspx?whr=contoso.com`

**Original URL:** https://aka.ms/SSPR<br>
**Custom URL:** `https://passwordreset.microsoftonline.com/?whr=contoso.com`

## Edit custom branding

If custom branding has been added to your tenant, you can edit the details already provided. Refer to the details and descriptions of each setting in the [Add custom branding](#add-custom-branding) section of this article.

1. Sign in to the [Azure portal](https://portal.azure.com/) using a Global administrator account for the directory.

2. Select **Azure Active Directory** > **Company branding** > **Configure**.

    ![Contoso - Company branding page, with default configuration shown](media/customize-branding/company-branding-default-configPNG)

3. On the **Configure company branding** page edit any necessary details.

4. Select **Save**.

   It can take up to an hour for any changes you made to the sign-in page branding to appear.

## Next steps

- Provide feedback on the [Azure Active Directory Forum](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789).
