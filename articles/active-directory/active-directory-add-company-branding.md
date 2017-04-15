---
title: Add company branding to your sign-in and Access Panel pages in Azure Active Directory
description: Learn how to add a company branding to the Azure sign-in page and the access panel page
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: f74621b4-4ef0-4899-8c0e-0c20347a8c31
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/07/2017
ms.author: curtand

---
# Add company branding to sign-in and Access Panel pages
Many organizations want to apply a consistent look and feel across the websites and services they manage. Azure Active Directory provides this capability by allowing IT pros to customize the appearance of the following web pages with company logos and images:

* **Sign-in page** - This is the page that appears when your employees and business guests sign in to Office 365 or other applications that use Azure AD.
* **Access Panel page** -  - The Access Panel is a web-based portal that allows you to view and launch the cloud-based applications to which your Azure AD administrator granted you access. Access Panel can be found at: [https://myapps.microsoft.com](https://myapps.microsoft.com).

This topic explains how you can customize the sign-in page and the access panel page.

> [!NOTE]
> * Company branding is available only if you upgraded to the Premium or Basic edition of Azure Active Directory, or have an Office 365 license. For more information, see Azure Active Directory editions.
> 
> * Azure Active Directory Premium and Basic editions are available for customers in China using the worldwide instance of Azure Active Directory. Azure Active Directory Premium and Basic editions are not currently supported in the Microsoft Azure service operated by 21Vianet in China. For more information, contact us at the Azure Active Directory Forum.


## Customizing the sign-in page
Your users usually interact with the Azure AD sign-in page when trying to access cloud applications and services that your organization
subscribes to.

If you have applied branding changes to your sign-in page, it can take up to an hour for the changes to appear for end users.

Company branding elements will appear on the Azure AD sign-in page when users are accessing a tenant-specific URL such as
https://outlook.com/contoso.com.

When users visit a service at a generic URL such as www.office.com, the sign-in page doesn’t contain company branding information yet, because the system doesn’t know who the user is. However, company branding appears after users enter their user ID or select a user tile.

> [!NOTE]
> * Your domain name must appear as “Active” in the **Active Directory** > **Directory** > **Domains** section of the Azure classic portal where you have configured branding.
> * Sign-in page branding doesn’t carry over to the sign-in page for personal Microsoft accounts. If your employees or business guests sign in with a personal Microsoft account, their sign-in page will not reflect the branding of your organization.
>

The following screenshots explain how sign-in pages are customized.

### Scenario 1: Contoso employee goes to a generic app URL (for example, www.office.com)

In this example, a Contoso user signs in to a mobile application, or to a web application using a generic URL. The illustration on the left will always represent the app, and the interaction pane on the right will update to show Contoso brand elements when appropriate.

![Office 365 sign-in page before and after customization][1]

### Scenario 2: Contoso employee goes to Contoso app that’s restricted to internal users

In this example, a Contoso user is signing into an internal application using a company-specific URL. The illustration on the left represents the company brand (Contoso). The interaction pane on the right is locked to Contoso and helps employees through sign-in.

![restricted app sign-in page][2]

### Scenario 3: Contoso employee goes to a Contoso app that’s open to external users

In this example, users are signing into a LoB application from Contoso, but the user may or may not be a Contoso employee. The illustration on the left represent the resource owner (Contoso), just like case \#2 above. But this time, the interaction pane on the right is not locked to Contoso, to convey that external users are welcome to sign in.

![sign in to open access][3]

### Scenario 4: Fabrikam business guest goes to Contoso app that’s open to external users

In this example, a Contoso user is signing into an internal application using a company-specific URL. The illustration on the left represents the company brand (Contoso). The interaction pane on the right is locked to Contoso and helps employees through sign-in.

![sign in as an external user][4]


## What elements on the page can I customize?

You can customize the following elements on the sign-in page:

![][5]

| Page element | Location on the page |
|:--- | --- |
| Banner Logo | Shown at the top-right of the page. Replaces the app logo once the user’s organization is determined (usually, after the user name is entered). |
| Background illustration | Shown as a full-bleed image on the left side of the sign-in page. Replaces the app’s illustration, for tenanted sign-in scenarios (when users access an application published by their own organization or an organization in which they are a business guest).<br>On low-bandwidth connections, the background illustration is replaced with a background color. On narrow screens such as phones, the illustration is not shown.<br>The background illustration will be cropped when users resize their browser. When you design your illustration, please keep key visual elements in the top-left corner so they don’t get cropped. | 
| “Keep me signed-in” check box | Shown under the **Password** box. |
| Sign-in page text | Bboilerplate text to be shown above the page footer. It can be used to convey helpful information to your users, such as the phone number of your help desk, or a legal statement. |

> [!NOTE]
> All elements are optional. For example, if you specify a Banner Logo but no Background illustration, the sign-in page shows your logo and the illustration for the destination site (for example, the Office 365 California highway image).
>

On your sign-in page, the **Keep me signed in** check box allows a user to remain signed in when they close and re-open their browser and does not affect session lifetime.

Whether the check box is displayed depends on the setting of **Hide KMSI**.

![Hide KMSI setting][6]

To hide the check box, configure this setting to **Hidden**.

> [!NOTE]
> Some features of SharePoint Online and Office 2010 depend on users being able to select this check box. If you configure this setting to hidden, your users may see additional and unexpected sign-in prompts.
>
>

You can also localize all elements on this page. Once you’ve configured a “default” set of customization elements, you can configure more versions for different locales. You can also mix and match various elements. For example, you can:

* Create a “default” illustration that works for all cultures, then create specific versions for English and French. When you set your browsers to one of these two languages, the specific image appears, while the default illustration appears for all other languages.
* Configure different logos for your organization (for example, Japanese or Hebrew versions).

## Access panel page customization
The Access Panel page is essentially a portal page for quick access to the cloud apps you have been granted access to by your administrator. On this page, your apps appear as clickable application tiles.

The following screenshot shows an example of an access panel page after customization.

![][8]

## Configure your directory with company branding
You can configure one default set of customizable elements per directory in the Azure classic portal. After the defaults have been saved, an administrator can add localized versions of each element, for different languages / locales. All customizable elements are optional.

For example, if you configure a default Banner Logo but no Large Illustration, the sign-in page displays your logo in the upper-right corner. However the default illustration of the site is displayed.

Imagine the following configuration:

* A default Banner Logo and Sign-In Page Text in English
* A language-specific sign in Page Text for German

If your language preference is German, you get the default Banner Logo but the German text.

While you could technically configure a different set for each language supported by Azure AD, we recommend that you keep the number of variations low, for maintenance and performance reasons.
 
**To add company branding to your directory, perform the following steps:**

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) as an administrator of the directory you want to customize.
2. Select the directory you want to customize.
3. In the toolbar on the top, click **Configure**.
4. Click **Customize Branding**.
5. Modify the elements you want to customize. All fields are optional.
6. Click **Save**.

It can take up to an hour for new change you made to the sign-in page branding to appear.

**To add language-specific company branding, perform the following steps:**

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) as an administrator of the directory you want to customize.
2. Select the directory you want to customize.
fs3. In the toolbar on the top, click **Configure**.
4. Click **Customize Branding**.
5. Click **Add branding for a specific language**.
6. Select the language you want to customize the logo for, and then click **Next**.
7. Edit only the elements for which you want to configure language-specific overrides. All fields are optional. If a field is left blank, then the custom default value is displayed instead (or the Microsoft default if a custom default is not configured).
8. Click **Save**.

**To remove company branding from your directory, perform the following steps:**

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) as an administrator of the directory you want to customize.
2. Select the directory you want to customize.
3. In the toolbar on the top, click **Configure**.
4. Click **Customize Branding**.
5. On the Customize Branding page, select **Edit Existing Branding Settings** and then go to the next page.
6. Depending on which elements you want to remove, do one or more of the following:

    a. Under **Banner Logo**, select **Remove uploaded logo**.

    b. Under **Tile Logo**, select **Remove uploaded logo**.

    c. Remove the text from all textboxes.

    d. Click **Next**.

    e. Remove the text from all textboxes.
7. Click **Save** to remove the elements.
8. If necessary, click **Customize Branding** again and repeat these steps for all language-specific branding that needs to be removed.
    All branding settings have been removed when you click **Customize Branding** and see the **Customize Default Branding** form with no existing settings configured.


## Customizable elements
Company logos are used for the sign-in and Access Panel pages, while
other elements are only used on the sign-in page. The following table
provides details for the different customizable elements.

| Name | Description | Constraints | Recommendations |
| --- | --- | --- | --- |
| Banner logo |The banner logo is displayed on the sign-in page and the Access panel. |<p>JPG or PNG</p><p>60x280 pixels</p><p>10 KB</p> |<p>Use your organization’s full logo (including pictogram and logotype)</p><p>Keep it under 30 pixels high to avoid introducing scrollbars on mobile devices</p><p>Keep it under 4 KB</p><p>Use a transparent PNG (don’t assume that the sign-in page always has a white background)</p> |
| Tile logo | Not currently used |<p>JPG or PNG</p><p>120x120 pixels</p><p>10 KB</p> |<p>Keep it simple (no small text), as this image may be resized to 50% |
| </p> | | | |
| Sign-in username label | Not currently used |<p>Unicode text, up to 50 characters</p><p>Plain text only (no links or HTML tags)</p> |<p>Keep it short and simple</p><p>Ask your users how they usually refer to the work or school account you provide them with.</p> |
| Sign-in page boilerplate text |This boilerplate text appears below the sign-in page form and can be used to communicate additional instructions, or where to get help and support. |<p>Unicode text, up to 256 characters</p><p>Plain text only (no links or HTML tags)</p> |Keep it under 250 characters (approximately 3 lines of text) |
| Sign-in page background illustration | Large image that is displayed on the left of the sign-in page (on the right for RtL languages) when users access tenant-specific URLs. |<p>JPG or PNG</p><p>1420x1200</p><p>500 KB</p> |<p>1420x1200 pixels</p><p>Important: Keep it as small as possible, ideally under 200 KB. If this image is too large, the performance of the Sign-in page is impacted when the image isn’t cached</p><p>This image will almost always be cropped to accommodate different screen aspect ratios. Keep the primary visual elements in the top left corner.</p> |
| Sign-in page background color | On low bandwidth connection, this solid color is used in place of the background illustration. | Must be an RGB color in hexadecimal form (example: \#FFFFFF) | We suggest picking the primary color of the banner logo. |

## Next steps
* [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md)
* [View your access and usage reports](active-directory-view-access-usage-reports.md)

<!--Image references-->
[1]: ./media/active-directory-add-company-branding/signin-page_before-customization.png
[2]: ./media/active-directory-add-company-branding/signin-page-restricted-app.png
[3]: ./media/active-directory-add-company-branding/signin-page-open-access.png
[4]: ./media/active-directory-add-company-branding/signin-page-external-guest.png
[5]: ./media/active-directory-add-company-branding/which-elements-can-i-customize.png
[6]: ./media/active-directory-add-company-branding/hide-kmsi.png
[8]: ./media/active-directory-add-company-branding/APBranding.png
[9]: ./media/active-directory-add-company-branding/hidekmsi.png
