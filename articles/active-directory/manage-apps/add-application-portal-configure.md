---
title: 'Quickstart: Configure enterprise application properties'
titleSuffix: Azure AD
description: Configure the properties of an enterprise application in Azure Active Directory.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 09/22/2021
ms.author: davidmu
ms.reviewer: ergreenl
ms.custom: mode-other
#Customer intent: As an administrator of an Azure AD tenant, I want to configure the properties of an enterprise application.
---

# Quickstart: Configure enterprise application properties

In this quickstart, you use the Azure Active Directory Admin Center to configure the properties of an enterprise application that you previously added to your Azure Active Directory (Azure AD) tenant.

You can configure the following common attributes of an enterprise application:

- **Enabled for users to sign in?** - Determines whether users assigned to the application can sign in.
- **User assignment required?** - Determines whether users who aren't assigned to the application can sign in.
- **Visible to users?** - Determines whether users assigned to an application can see it in My Apps and Microsoft 365 app launcher. (See the waffle menu in the upper-left corner of a Microsoft 365 website.)
- **Logo** - Determines the logo that represents the application.
- **Notes** - Provides a place to add notes that apply to the application.

It is recommended that you use a non-production environment to test the steps in this quickstart.

## Prerequisites

To configure the properties of an enterprise application, you need:

- An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- Completion of the steps in [Quickstart: Add an enterprise application](add-application-portal.md).

## Configure application properties

Application properties control how the application is represented and how the application is accessed.

To edit the application properties:

1. Go to the [Azure Active Directory Admin Center](https://aad.portal.azure.com) and sign in using one of the roles listed in the prerequisites.
1. In the left menu, select **Enterprise applications**. The **All applications** pane opens and displays a list of the applications in your Azure AD tenant. Search for and select the application that you want to use. For example, **Azure AD SAML Toolkit 1**.
1. In the **Manage** section, select **Properties** to open the **Properties** pane for editing.
1. Select **Yes** or **No** to decide whether the application is enabled for users to sign in.
1. Select **Yes** or **No** to decide whether only user accounts that have been assigned to the application can sign in.
1. Select **Yes** or **No** to decide whether users assigned to an application can see it in My Apps and Microsoft 365 portals. 

    :::image type="content" source="media/add-application-portal-configure/configure-properties.png" alt-text="Configure the properties of an enterprise application.":::

## Use a custom logo

The application logo is seen on the My Apps and Microsoft 365 portals, and when administrators view this application in the enterprise application gallery. Custom logos must be exactly 215x215 pixels in size and be in the PNG format. It is recommended that you use a solid color background with no transparency in your application logo so that it appears best to users.

To use a custom logo:

1. Create a logo that's 215 by 215 pixels, and save it in .png format.
1. Select the icon in **Select a file** to upload the logo.
1. When you're finished, select **Save**.

The thumbnail for the logo doesn't update right away. You can close and reopen the **Properties** pane to see the updated thumbnail.

## Add notes

You can use the **Notes** property to add any information that is relevant for the management of the application in Azure AD. The **Notes** property is a free text field with a maximum size of 1024 characters.

To enter notes for the application:

1. Enter the notes that you want to keep with the application.
1. Select **Save**.

## Clean up resources

If you are planning to complete the next quickstart, keep the enterprise application that you created. Otherwise, you can consider deleting it to clean up your tenant. For more information, see [Delete an application](delete-application-portal.md).

## Next steps

Learn how to search for and view the applications in your Azure AD tenant.
> [!div class="nextstepaction"]
> [View applications](view-applications-portal.md)
