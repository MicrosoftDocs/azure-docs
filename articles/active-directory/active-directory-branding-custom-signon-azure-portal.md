<properties
pageTitle="Customize your sign-in page in the Azure Active Directory preview | Microsoft Azure"
description="Learn how to add a company branding to the Azure sign-in page"
services="active-directory"
documentationCenter=""
authors="curtand"
manager="femila"
editor=""/>

<tags
ms.service="active-directory"
ms.workload="identity"
ms.tgt_pltfrm="na"
ms.devlang="na"
ms.topic="article"
ms.date="09/12/2016"
ms.author="curtand"/>

# Add company branding to your sign-in page in the Azure Active Directory preview

To avoid confusion, many companies want to apply a consistent look and feel across all the websites and services they manage. Azure Active Directory preview provides this capability by allowing you to customize the appearance of the sign-in page with your company logo and custom color schemes. [What's in the preview?](active-directory-preview-explainer.md) The sign-in page is the page that appears when you sign in to Office 365 or other web-based applications that are using Azure AD as your identity provider. You interact with this page to enter your credentials.

If you want to show your company brand, colors and other customizable elements on this page, see the following images to understand the difference between the two experiences.

The following screenshot shows and example for the Office 365 sign-in page on a desktop computer **before** a customization:

![Office 365 sign-in page before customization](./media/active-directory-branding-custom-signon-azure-portal/sign-in-page-before-customization.png)

The following screenshot shows and example for the Office 365 sign-in page on a desktop computer **after** a customization:

![Office 365 sign-in page after customization](./media/active-directory-branding-custom-signon-azure-portal/sign-in-page-after-customization.png)


## Customizing the sign-in page

Typically, if you need browser-based access to your cloud apps and services that your organization subscribes to, you use the sign-in page.

If you have applied changes to your sign-in page, it can take up to an hour for the changes to appear.

A branded sign-in page only appears when you visit a service with a tenant-specific URL such as https://outlook.com/**contoso**.com, or https://mail.**contoso**.com.

When you visit a service with non-tenant specific URLs (e.g.: https://mail.office365.com), a non-branded sign-in page appears. in this case, your branding appears once you have entered your user ID or you have selected a user tile.

> [AZURE.NOTE]
>
- Your domain name must appear as “Active" in the **Domains** portion of the Azure portal in which you have configured branding. For more information, see [Add custom domain names](active-directory-domains-add-azure-portal.md).
- Sign-in page branding doesn’t carry over to the consumer sign in page of Microsoft. If you sign in with a Microsoft account, you may see a branded list of user tiles rendered by Azure AD, but the branding of your organization does not apply to the Microsoft account sign-in page.

**To add company branding to your directory:**

1.  Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.

2.  Select **More services**, enter **Users and groups** in the text box, and then select **Enter**.

    ![Opening user management](./media/active-directory-branding-custom-signon-azure-portal/user-management.png)

3. On the **Users and groups** blade, select **Company branding**.

4. On the **Users and groups - Company branding** blade, select the **Edit** command.

    ![Edit custom branding](./media/active-directory-branding-custom-signon-azure-portal/edit-branding.png)

5. Modify the elements you want to customize. All elements are optional.

6. Click **Save**.

It can take up to an hour for any changes you made to the sign-in page branding to appear.

## Next steps

[Add language-specific company branding](active-directory-branding-localize-azure-portal.md)
