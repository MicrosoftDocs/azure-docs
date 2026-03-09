---
title: Configure error pages on App Service
description: Learn how to configure the custom error pages available on Azure App Service.
author: jefmarti
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 02/19/2026
ms.author: jefmarti
ms.service: azure-app-service
#customer intent: As a website owner and designer, I want to configure custom error pages for my App Service apps so that I can present customized error pages to my website users if they encounter errors.

---

# Configure error pages on App Service

Azure App Service lets you configure specific error pages to present to your web app users instead of the default error pages. This article explains how to configure these custom error pages for your web app.

The three types of error code pages available for customization in App Service are *403 Access restrictions*, *502 Gateway errors*, and *503 Service unavailable*. This article walks through adding a custom 403 error page to a web app hosted on App Service, and testing it by using an IP restriction.

## Prerequisites

- A web app hosted on an Azure App Service Premium SKU. You must have a Premium SKU to customize error pages.
- An HTML file smaller than 10 kb that presents a 403 error message such as **Forbidden**. Name the HTML file to match the error code, in this case *403.html*.

## Configure the custom error page

Upload your custom error page and apply it to your web app.

1. On the Azure portal page for your web app, select **Settings** > **Configuration (preview)** from the left navigation menu.
1. Select the **Error pages** tab on the **Configuration** page.
1. On the **Error pages** page, select the **Browse** button next to the error code you want to configure, in this case **403**.
1. Browse to your custom *403.html* error page and select **Open**. The file uploads, and the filename appears in the field next to the error code.
1. Select the checkbox next to **Apply to all requests**, and then select **Apply**.

>[!NOTE]
>If the configuration options are greyed out, you need to upgrade to at least a Premium SKU to use this feature.

>[!NOTE]
>If you're using the legacy, nonpreview **Configuration** > **Error codes** page, select **Edit** next to the error code you want to configure. On the **Add custom error page (.html)** pane, select the folder icon to browse to and select your custom *403.html* file. After the file loads, select **Upload**.

## Confirm the error page

Once you upload and apply the custom error page, you can trigger and view the page. For this example, trigger the 403 error by using an IP restriction. You can also trigger a 403 error page by stopping the site.

1. On the Azure portal page for your web app, select **Settings** > **Networking** from the left navigation menu.
1. Under **Inbound traffic configuration** on the **Networking** page, copy the IP address next to **IP Addresses** to use in a later step.
1. Next to **Public access restrictions**, select the link for **Enabled with no access restrictions**.
1. On the **Access Restrictions** page, under **Site access**, select **Enabled from select virtual networks and IP addresses**.
1. At the bottom of the page under **Site access and rules**, select **Add** to add an IP restriction.
1. On the **Add rule** pane, give the rule a **Name** like *Test403*, set **Action** to **Deny**, and set **Priority** to *300*.
1. Paste the IP address you copied from the main **Networking** page into the **IP Address Block** field, followed by */0*, for example *203.0.113.254/0*.
1. Select **Add rule**.
1. On the **Access Restrictions** page, select **Save**. If necessary, confirm the action and select **Continue**. This action disables all public access to the site.

Restart the site for the changes to take effect. Return to the **Overview** page for your site and select **Restart** from the top menu. When you select the URL to go to your site, you see your custom error page.

## FAQ

### Why doesn't my uploaded error page show when the error is triggered?

Make sure you select **Apply to all requests** when you configure the error page. By default, custom error pages are triggered only from front-end failures. Errors from the app level don't trigger or show the custom error page. Selecting **Apply to all requests** for the configured error code shows the error page for all requests that match the status code, regardless of where they failed. Selecting this option overrides any existing error pages configured for the app.

### Why is the error page feature grayed out?

You must use at least a Premium SKU to enable the error code feature.

### How can I use a custom error page across multiple apps?

You can host your custom HTML error page in an [Azure Storage account](/azure/storage/common/storage-account-overview), and add the page's storage URL in an `<iframe>` tag in the HTML file you upload to the app.

