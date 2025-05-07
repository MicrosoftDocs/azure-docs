---
title: Configure error pages on App Service
description: Learn how to configure a custom error page on App Service
author: jefmarti
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 10/14/2024
ms.author: jefmarti
---

# Configure error pages on App Service (preview)

This article explains how to configure custom error pages on your web app. With App Service you can configure an error page for specific errors that will be presented to users instead of the default error page. 

### Prerequisite
In this tutorial, we're adding a custom 403 error page to our web app hosted on App Service and test it with an IP restriction. To do so, you need the following:
- a web app hosted on App Service w/ a Premium SKU
- an html file under 10 kb in size

## Upload an error page
For this example, we're uploading and testing a 403 error page to present to the user. Name your html file to match the error code (for example, `403.html`). Once you have your html file prepared, you can upload it to your web app. In the configuration blade, you should see an **Error pages (preview)** tab. Click on this tab to view the error page options. If the options are greyed out, you need to upgrade to at least a Premium SKU to use this feature.

Select the error code that you'd like to upload an error page for and click **Edit**. On the next screen, click the folder icon to select your html file. The file must be in html format and within the 10 kb size limit. Find your .html file and click on the **Upload** button at the bottom of the screen. Notice the Status in the table updates from Not Configured to Configured. Then click **Save** to complete the upload. 

## Confirm error page
Once the custom error page is uploaded and saved, we can trigger and view the page. In this example, we can trigger the 403 error by using an IP restriction.

To set an IP restriction, go to the **Networking** blade and click the **Enabled with access restrictions** link under **Inbound traffic configuration**.

Under the **Site access and rules** section, select the **+Add** button to create an IP restriction.

In the form that follows, you need to change the Action to **Deny** and fill out the **Priority** and **IP Address Block**. In this example, we use the **Inbound address** found on the Networking blade and we're setting it to /0 (for example, `12.123.12.123/0`). This disables all public access when visiting the site.

Once the Add rule form is filled out, select the **Add rule** button. Then click **Save**.

Once saved, you need to restart the site for the changes to take effect. Go to your overview page and select **browse**. You should now see your custom error page load.

## Error codes
App Service currently supports three types of error codes that are available to customize:

| Error code  | description |
| ------------- | ------------- |
| 403  | Access restrictions |
| 502  | Gateway errors  |
| 503  | Service unavailable  |

## FAQ
1. I've uploaded my error page, why doesn't it show when the error is triggered?

Currently, error pages are only triggered when the error is coming from the front end. Errors that get triggered at the app level should still be handled through the app. 

2. Why is the error page feature greyed out?

Error pages are currently a Premium feature. You need to use at least a Premium SKU to enable the feature. 