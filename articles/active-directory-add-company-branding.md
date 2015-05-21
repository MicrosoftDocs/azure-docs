<properties 
	pageTitle="Add company branding to your Sign In and Access Panel pages" 
	description="A topic that explains how an organization can apply a consistent look and feel across all the websites and services they manage so that their end users won’t be confused whenever they need to use those sites." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"/>

<tags 
	ms.service="active-directory" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/05/2015" 
	ms.author="Justinha"/>

# Add company branding to your Sign In and Access Panel pages

> [AZURE.NOTE]
> 
- Company branding is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).
- Azure Active Directory Premium and Basic editions are available for customers in China using the worldwide instance of Azure Active Directory. Azure Active Directory Premium and Basic editions are not currently supported in the Microsoft Azure service operated by 21Vianet in China. For more information, contact us at the [Azure Active Directory Forum](http://feedback.azure.com/forums/169401-azure-active-directory).

Many companies want to apply a consistent look and feel across all the websites and services they manage so that their end users won’t be confused whenever they need to use those sites. Azure Active Directory provides this capability by allowing you to customize the appearance of the following end user-facing web pages so that they include your company logo and color schemes:

- **Sign In page** - This page is where users are redirected when they are signing in to Office 365 or other web-based and modern applications that use Azure AD as your identity provider. Most users will interact with this page whether it’s to go through Home Realm Discovery, which allows the system to redirect federated users to their on-premises STS (such as AD FS), or to enter their credentials.

- **Access Panel page** - The Access Panel is a web-based portal that allows an end user with a work or school account in an Azure AD directory to view and launch cloud-based applications to which they have been granted access by the Azure AD administrator. The Access Panel is accessible to all users in your organization at myapps.microsoft.com.

## Sign in page customization

The Sign In page is typically the most frequently used web page by end users that need browser-based access to the cloud apps and services that your organization subscribes to, so making sure it looks right is paramount. If you want to use the default non-branded Sign In page experience, you need do nothing.

### How long does it take to see branding changes on the sign in pages?

It can take up to an hour for users to see any new change you made to the sign in page branding.

### When will users see a branded sign in page?

User will see a branded sign in page when they visit a service with a tenant-specific URL such as https://outlook.com/**contoso**.com, or https://mail.**contoso**.com (if you’ve created a CNAME).

If they visit a service with non-tenant specific URLs (such as https://mail.office365.com) they will see a non-branded sign in page. The sign in page will refresh to show your branding once users have entered their user ID or selected a user tile.

> [AZURE.NOTE]
> 
- Your domain name must appear as “Active” in the **Active Directory** > **Directory** > **Domains** section of the Azure Management Portal where you have configured branding.
- Sign in page branding doesn’t carry over to Microsoft’s consumer sign in page. This means that users who sign in with a personal Microsoft account (formerly Windows Live ID) may see a branded list of user tiles rendered by Azure AD, but your organization’s branding will not apply to the Microsoft account sign-in page.

### What will my end users see after I customize the Sign In page?

If you want to show your company brand, colors and other customizable elements on this page, see the following images to understand the difference between the two experiences.

When a user attempts to sign in from a desktop computer, here is an example of what the user would see on the Office 365 Sign In page *before* customization:

![][1]

And here is what the same user would see *after* customization:

![][2]

When a user attempts to sign in from a mobile device, here is an example of what the user would see on the Office 365 Sign In page *before* customization:

![][3]

And here is what the same user would see *after* customization:

![][4]

### What elements on the page can I customize?

You can customize the following elements on the Sign In page:

![][5]

 Page element  | Location on the page
	------------- | -------------
Banner Logo | Shown at the top-right of the page. Replaces the logo that would normally be displayed by the destination site that your users are signing in to (For example. Office 365 or Azure).
Large Illustration / Background Color | Shown at the left of the page. Replaces the image that would normally be displayed by the destination site that your users are signing in to. The Background Color may be shown in place of the Large Illustration on low bandwidth connections, or on very narrow screens.
Sign In Page Text | Shown above the page footer when you need to convey helpful information to your users before they sign in with their work or school account. For example, you may want to include the phone number to your help desk, or a legal statement.

> [AZURE.NOTE]
All elements are optional. For example, if you specify a Banner Logo but no Large Illustration, the Sign In page will show your logo and the illustration for the destination site (that is, the Office 365 California highway image).

You can also localize all elements on this page. Once you’ve configured a “default” set of customization elements, you can configure additional versions for different locales. You can also mix and match various elements. For example, you can:

- Create a “default” Large Illustration that works for all cultures, then create specific versions for English and French. Users with browsers set to one of these two languages will see the specific image, while everyone else will see the default one.
- Configure different logos for your organization (e.g. Japanese or Hebrew versions).

### How will the illustration appear after the browser has been resized?

During a browser window resizing, the large Illustration, like the one shown previously, will almost always be cropped to accommodate different screen aspect ratios. With this in mind, you should try to keep the key visual elements in the illustration so that they will always show in the top-left corner (top-right for right-to-left languages). This is important because resizing typically occurs from the bottom-right corner going towards the top/left or from the bottom towards the top. 

The following picture shows how the illustration will be cropped when the browser is resized to the left:

![][6]

And here is how it will appear after the browser is resized toward the top:

![][7]

## Access panel page customization

The Access Panel page is essentially a portal page for all end users that need quick access, via clickable application tiles, to the various cloud apps that you’ve granted them access to. If you want to use the default non-branded Access Panel page experience, you need do nothing.

### What will my end users see after I have customized the Access Panel page?

![][8]

## Configure your directory with company branding

One default set of customizable elements can be configured per directory in the Management Portal. After defaults have been saved, an administrator also has the option to add localized versions of each element, for different languages/locales. All customizable elements are optional.

For example, if you configure a default Banner Logo but no Large Illustration, the Sign In page will display your logo in the upper-right corner, however the site’s default illustration will be displayed. If you configure a default Banner Logo and Sign In Page Text in English, and configure language-specific Sign In Page Text for German, then users with a German language preference will see your default Banner Logo but the German text. While you could technically configure a different set for each language supported by Azure AD, we recommend that you keep the number of variations low, for maintenance and performance reasons.

To add company branding to your directory:

1. Sign into the [Azure Management Portal](https://manage.windowsazure.com) as the administrator of the directory you wish to customize.
2. Select the directory you wish to customize.
3. Select the **Configure** tab, and then select **Customize Branding**.
4. Modify the elements you wish to customize. Note that all fields are optional.
5. Click **Save**.

It can take up to an hour for users to see any new change you made to the sign in page branding.

To add language-specific company branding:

1. In the [Azure Management Portal](https://manage.windowsazure.com), under the **Configure** tab, select **Customize Branding**.
2. Select **Add branding for a specific language**, select the language you want to customize the logo for, and then click **Next**.
3. Edit only the elements for which you wish to configure language-specific overrides. Note that all fields are optional. If a field is left blank, then the custom default value will be displayed instead (or the Microsoft default if a custom default is not configured).
4. Click **Save**.

To remove company branding from your directory

1. In the [Azure Management Portal](https://manage.windowsazure.com), under the **Configure** tab, select **Customize Branding**.
2. On the Customize Branding page, select **Edit Existing Branding Settings** and then go to the next page.
3. Depending on which elements you want to remove, do one or more of the following:
	1. For Banner Logo, click on the check box to **Remove uploaded logo**.
    2. For Tile Logo, click on the check box to **Remove uploaded logo**.
    3. For Sign In Page User Name Label, clear all text.
    4. For Sign In Page Text, clear all text.
    5. For Sign In Page Illustration, click on the check box to **Remove illustration**.
    6. For Sign In Page Background Color, clear all text.
4. Click **Save** to remove the elements.
5. If necessary, click **Customize Branding** again and repeat these steps for all language-specific branding that needs to be removed. 
    All branding settings have been removed when you click **Customize Branding** and see the **Customize Default Branding** form with no existing settings configured.

## Testing and examples

We recommend that you experiment with a test tenant before making changes in your production environment. The simplest way to verify if your branding has been applied is to open an InPrivate or Incognito browser session and then visit https://outlook.com/contoso.com, replacing contoso.com with the domain you’ve customized. Note that this also works with domains that look like contoso.onmicrosoft.com.

To help you create effective customization sets, we have customized the following two fictitious sign in pages:

- [http://aka.ms/aaddemo001](http://aka.ms/aaddemo001)
- [http://aka.ms/aaddemo002](http://aka.ms/aaddemo002)

To test the language-specific settings, you will need to modify the default language preferences in your web browser to a language you have set in your customization. In Internet Explorer, this is configured in the **Internet Options** menu.

## Customizable elements

Some customizable elements in Azure AD have multiple use cases. Company logos can be configured once per directory and is used on both the Sign In and Access Panel pages, where as some customizable elements are specific only to the Sign In page. The following table provides details for the different customizable elements.

Name | Description | Constraints | Recommendations
	------------- | ------------- | ------------- | -------------
Banner Logo | The Banner Logo is displayed on the Sign In page and the Access panel. | <p>JPG or PNG</p><p>60x280 pixels</p><p>10 KB</p> | <p>Use your organization’s full logo (including pictogram and logotype)</p><p>Keep it under 30 pixels high to avoid introducing scrollbars on mobile devices</p><p>Keep it under 4 KB</p><p>Use a transparent PNG (don’t assume that the Sign In page will always have a white background)</p>
Tile Logo | (currently not used in the Sign In page) In the future, this text may be used to replace the generic “work or school account” pictogram in different places of the experience. | <p>JPG or PNG</p><p>120x120 pixels</p><p>10 KB</p> | <p>Keep it simple (no small text), as this image may be resized to 50%
</p> |
Sign In Page User Name Label | (currently not used in the Sign In page) In the future, this text may be used to replace the generic “work or school account” string in different places of the experience. You can set it to something like “Contoso account” or “Contoso ID”. | <p>Unicode text, up to 50 characters</p><p>Plain text only (no links or HTML tags)</p> | <p>Keep it short and simple</p><p>Ask your users how they usually refer to the work or school account you provide them with.</p>
Sign In Page Text | This “boilerplate” text appears below the Sign In page form and can be used to communicate additional instructions, or where to get help and support. | <p>Unicode text, up to 256 characters</p><p>Plain text only (no links or HTML tags)</p> | Keep it under 250 characters (approximately 3 lines of text)
Sign In Page Illustration | The illustration is a large image that is displayed on the Sign In page to the left of the Sign In page form. | <p>JPG or PNG</p><p>1420x1200</p><p>500 KB</p> | <p>1420x1200 pixels</p><p>Important: Keep it as small as possible, ideally under 200 KB. If this image is too large, it will impact the performance of the Sign In page when the image isn’t cached</p><p>This image WILL almost always be cropped, to accommodate different screen ratios. Keep the primary visual elements in the top left corner (top right for RTL languages), because resizing will occur from the bottom/right corner, going towards the top/left, as the browser window shrinks.</p>
Sign In Page Background Color | The Sign In page background color is used in the area to the left of the Sign In page form. This is visible either when there is no Sign In page illustration present. | Must be a RGB color in hexadecimal form (example: #FFFFFF) | <p>The background color may be shown in place of the Large Illustration on low bandwidth connections</p><p>We suggest to pick the primary color of the Banner Logo</p>


## What's next

- [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md)
- [View your access and usage reports](active-directory-view-access-usage-reports.md)

<!--Image references-->
[1]: ./media/active-directory-add-company-branding/SignInPage_beforecustomization.png
[2]: ./media/active-directory-add-company-branding/SignInPage_aftercustomization.png
[3]: ./media/active-directory-add-company-branding/SignInPage_mobile_beforecustomization.png
[4]: ./media/active-directory-add-company-branding/SignInPage_mobile_aftercustomization.png
[5]: ./media/active-directory-add-company-branding/SignInPage_aftercustomization_elements.png
[6]: ./media/active-directory-add-company-branding/SignInPage_aftercustomization_croppedleft.png
[7]: ./media/active-directory-add-company-branding/SignInPage_aftercustomization_croppedtop.png
[8]: ./media/active-directory-add-company-branding/APBranding.png

