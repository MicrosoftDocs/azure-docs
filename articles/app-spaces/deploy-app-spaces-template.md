---
title: Use a template with Azure App Spaces
description: Learn how to use a template to create a web application with Azure App Spaces.
ms.service: app-spaces
ms.topic: how-to
ms.author: msangapu
author: msangapu-msft
ms.date: 05/22/2023
---

# Use a sample app with Azure App Spaces

This article describes how to deploy a sample app to [Azure App Spaces](overview.md). If you don't have your own repository, you can select one of the templates provided to provision new resources on Azure. For more information, see [About Azure App Spaces](overview.md). 

## Prerequisites

To use a sample app for Azure App Spaces, you must have the following items:

- [Azure account and subscription](https://signup.azure.com/). You can only deploy with a subscription that you own.
- [GitHub account](https://github.com/)

## Use a sample app

Do the following steps to deploy a sample app to App Spaces.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Enter `App Spaces` in the search box, and then select **App Spaces**.
3. Select a sample app. For this example, we selected the **Static Web App with Node.js API - Mongo DB** template.

   :::image type="content" source="media/use-sample-static-web-app.png" alt-text="Screenshot showing Static Web App option surrounded by red box.":::

4. Select your organization and enter names for your new repository and App Space.
5. Select your subscription, choose the region closest to your users for optimal performance, and then select **Deploy App Space**.
   
   :::image type="content" source="media/deploy-sample-app.png" alt-text="Screenshot showing App Space details selections and Deploy App Space button highlighted with red box.":::

The sample web application code deploys to App Spaces.

For more information about managing App Spaces, see [Manage components](quickstart-deploy-web-app.md#manage-components).

## Related articles

- [App Spaces overview](overview.md)
- [Deploy a web app with App Spaces](quickstart-deploy-web-app.md)
