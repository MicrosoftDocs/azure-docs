<properties
	pageTitle="Add company branding to your sign-in and Access Panel pages"
	description="Learn how to add a company branding to the Azure sign-in page and the access panel page"
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="07/13/2016"
	ms.author="MarkVi"/>

# Add company branding to your sign-in and Access Panel pages


To avoid confusion, many companies want to apply a consistent look and feel across all the websites and services they manage. Azure Active Directory provides this capability by allowing you to customize the appearance of the following web pages with your company logo and custom color schemes:

- **Sign-in page** - This is the page that appears when you sign in to Office 365 or other web-based applications that are using Azure AD as your identity provider. You interact with this page either during a Home Realm Discovery or to enter your credentials. The Home Realm Discovery allows the system to redirect federated users to their on-premises STS (such as AD FS).

- **Access Panel page** - The Access Panel is a web-based portal that allows you to view and launch the cloud-based applications your Azure AD administrator has granted you access to. To access the Access Panel, use the following URL: [https://myapps.microsoft.com](https://myapps.microsoft.com).

This topic explains how you can customize the sign-in page and the access panel page.

> [AZURE.NOTE]
>
- Company branding is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).
- Azure Active Directory Premium and Basic editions are available for customers in China using the worldwide instance of Azure Active Directory. Azure Active Directory Premium and Basic editions are not currently supported in the Microsoft Azure service operated by 21Vianet in China. For more information, contact us at the [Azure Active Directory Forum](https://feedback.azure.com/forums/169401-azure-active-directory/).



## Customizing the sign-in page

Typically, if you need browser-based access to your cloud apps and services that your organization subscribes to, you use the sign-in page.

If you have applied changes to your sign-in page, it can take up to an hour for the changes to appear.

A branded sign-in page only appears when you visit a service with a tenant-specific URL such as https://outlook.com/**contoso**.com, or https://mail.**contoso**.com.

When you visit a service with non-tenant specific URLs (e.g.: https://mail.office365.com), a non-branded sign-in page appears. in this case, your branding appears once you have entered your user ID or you have selected a user tile.

> [AZURE.NOTE]
>
- Your domain name must appear as “Active” in the **Active Directory** > **Directory** > **Domains** section of the Azure classic portal where you have configured branding.
- Sign-in page branding doesn’t carry over to the consumer sign in page of Microsoft. If you sign in with a personal Microsoft account, you may see a branded list of user tiles rendered by Azure AD, but the branding of your organization does not apply to the Microsoft account sign-in page.


If you want to show your company brand, colors and other customizable elements on this page, see the following images to understand the difference between the two experiences.

The following screenshot shows and example for the Office 365 sign-in page on a desktop computer **before** a customization:

![Office 365 sign-in page before customization][1]

The following screenshot shows and example for the Office 365 sign-in page on a desktop computer **after** a customization:

![Office 365 sign-in page after customization][2]

The following screenshot shows an example of the Office 365 sign-in page on a mobile device **before** a customization:

![Office 365 sign-in page before customization][3]


The following screenshot shows an example of the Office 365 sign-in page on a mobile device **after** a customization:

![Office 365 sign-in page after customization][4]


When you resize a browser window, the large Illustration, like the one shown previously, is often cropped to accommodate different screen aspect ratios. With this in mind, you should try to keep the key visual elements in the illustration so that they always appear in the top-left corner (top-right for right-to-left languages). This is important because resizing typically occurs from the bottom-right corner going towards the top / left or from the bottom towards the top.

The following picture shows how the illustration is cropped when the browser is resized to the left:

![][6]

Here is how it appears after the browser is resized toward the top:

![][7]

## What elements on the page can I customize?

You can customize the following elements on the sign-in page:

![][5]

 Page element  | Location on the page
	------------- | -------------
Banner Logo | Shown at the top-right of the page. Replaces the logo the destination site you are signing in to displays (For example. Office 365 or Azure).
Large Illustration / Background Color | Shown at the left of the page. Replaces the image the destination site you are signing in to displays. The Background Color may be shown in place of the Large Illustration on low bandwidth connections, or on narrow screens.
Sign-in Page Text | Shown above the page footer when you need to convey helpful information before a sign-in with a work or school account. For example, you may want to include the phone number to your help desk, or a legal statement.

> [AZURE.NOTE]
All elements are optional. For example, if you specify a Banner Logo but no Large Illustration, the sign-in page shows your logo and the illustration for the destination site (that is, the Office 365 California highway image).

You can also localize all elements on this page. Once you’ve configured a “default” set of customization elements, you can configure more versions for different locales. You can also mix and match various elements. For example, you can:

- Create a “default” Large Illustration that works for all cultures, then create specific versions for English and French. When you set your browsers to one of these two languages, the specific image appears, while the default illustration appears for all other languages.

- Configure different logos for your organization (e.g. Japanese or Hebrew versions).



## Access panel page customization

The Access Panel page is essentially a portal page for quick access to the cloud apps you have been granted access to by your administrator. On this page, your apps appear as clickable application tiles.


The following screenshot shows an example of an access panel page after customization.

![][8]

## Configure your directory with company branding

You can configure one default set of customizable elements per directory in the Azure classic portal. After the defaults have been saved, an administrator can add localized versions of each element, for different languages / locales. All customizable elements are optional.

For example, if you configure a default Banner Logo but no Large Illustration, the sign-in page displays your logo in the upper-right corner. However the default illustration of the site is displayed.

Imagine the following configuration:

- A default Banner Logo and Sign-In Page Text in English
- A language-specific sign in Page Text for German

If your language preference is German, you get the default Banner Logo but the German text.

While you could technically configure a different set for each language supported by Azure AD, we recommend that you keep the number of variations low, for maintenance and performance reasons.

**To add company branding to your directory, perform the following steps:**

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) as an administrator of the directory you want to customize.
2. Select the directory you want to customize.
3. In the toolbar on the top, click **Configure**.
4. Click **Customize Branding**.
4. Modify the elements you want to customize. All fields are optional.
5. Click **Save**.

It can take up to an hour for new change you made to the sign-in page branding to appear.

**To add language-specific company branding, perform the following steps:**

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) as an administrator of the directory you want to customize.
2. Select the directory you want to customize.
3. In the toolbar on the top, click **Configure**.
4. Click **Customize Branding**.
2. Click **Add branding for a specific language**.
3. Select the language you want to customize the logo for, and then click **Next**.
3. Edit only the elements for which you want to configure language-specific overrides. All fields are optional. If a field is left blank, then the custom default value is displayed instead (or the Microsoft default if a custom default is not configured).
4. Click **Save**.

**To remove company branding from your directory, perform the following steps:**

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) as an administrator of the directory you want to customize.
2. Select the directory you want to customize.
3. In the toolbar on the top, click **Configure**.
4. Click **Customize Branding**.
5. On the Customize Branding page, select **Edit Existing Branding Settings** and then go to the next page.
3. Depending on which elements you want to remove, do one or more of the following:

	a. Under **Banner Logo**, select **Remove uploaded logo**.

    b. Under **Tile Logo**, select **Remove uploaded logo**.

    c. Remove the text from all textboxes.

    d. Click **Next**.

    e. Remove the text from all textboxes.

4. Click **Save** to remove the elements.
5. If necessary, click **Customize Branding** again and repeat these steps for all language-specific branding that needs to be removed.
    All branding settings have been removed when you click **Customize Branding** and see the **Customize Default Branding** form with no existing settings configured.

## Testing and examples

We recommend that you experiment with a test tenant before making changes in your production environment.

**To verify whether your branding has been applied:**

1. Open an InPrivate or Incognito browser session.
2. Visit https://outlook.com/contoso.com, replacing contoso.com with the domain you’ve customized.

This also works with domains that look like contoso.onmicrosoft.com.

To help you create effective customization sets, we have customized the following two fictitious sign-in pages:

- [http://aka.ms/aaddemo001](http://aka.ms/aaddemo001)
- [http://aka.ms/aaddemo002](http://aka.ms/aaddemo002)

To test the language-specific settings, you need to modify the default language preferences in your web browser to a language you have set in your customization. In Internet Explorer, you configure this in the **Internet Options** menu.

## Customizable elements

Some customizable elements in Azure AD have multiple use cases. You can configure company logos once per directory and is used on both, the sign-in and Access Panel pages. Some customizable elements are specific only to the sign-in page. The following table provides details for the different customizable elements.

Name | Description | Constraints | Recommendations
	------------- | ------------- | ------------- | -------------
Banner Logo | The Banner Logo is displayed on the sign-in page and the Access panel. | <p>JPG or PNG</p><p>60x280 pixels</p><p>10 KB</p> | <p>Use your organization’s full logo (including pictogram and logotype)</p><p>Keep it under 30 pixels high to avoid introducing scrollbars on mobile devices</p><p>Keep it under 4 KB</p><p>Use a transparent PNG (don’t assume that the sign-in page always has a white background)</p>
Tile Logo | (currently not used in the sign-in page) In the future, this text may be used to replace the generic “work or school account” pictogram in different places of the experience. | <p>JPG or PNG</p><p>120x120 pixels</p><p>10 KB</p> | <p>Keep it simple (no small text), as this image may be resized to 50%
</p> |
Sign-in Page User Name Label | (currently not used in the sign-in page) In the future, this text may be used to replace the generic “work or school account” string in different places of the experience. You can set it to something like “Contoso account” or “Contoso ID.” | <p>Unicode text, up to 50 characters</p><p>Plain text only (no links or HTML tags)</p> | <p>Keep it short and simple</p><p>Ask your users how they usually refer to the work or school account you provide them with.</p>
Sign-in Page Text | This “boilerplate” text appears below the sign-in page form and can be used to communicate additional instructions, or where to get help and support. | <p>Unicode text, up to 256 characters</p><p>Plain text only (no links or HTML tags)</p> | Keep it under 250 characters (approximately 3 lines of text)
Sign-in Page Illustration | The illustration is a large image that is displayed on the sign-in page to the left of the sign-in page form. | <p>JPG or PNG</p><p>1420x1200</p><p>500 KB</p> | <p>1420x1200 pixels</p><p>Important: Keep it as small as possible, ideally under 200 KB. If this image is too large, the performance of the Sign-in page is impacted when the image isn’t cached</p><p>This image is often cropped, to accommodate different screen ratios. Keep the primary visual elements in the top left corner (top right for RTL languages), because resizing occurs from the bottom/right corner, going towards the top / left, as the browser window shrinks.</p>
Sign-in Page Background Color | The sign-in page background color is used in the area to the left of the sign-in page form. | Must be an RGB color in hexadecimal form (example: #FFFFFF) | <p>The background color may be shown in place of the large Illustration on low-bandwidth connections</p><p>We suggest picking the primary color of the Banner Logo</p>


## Next Steps

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
