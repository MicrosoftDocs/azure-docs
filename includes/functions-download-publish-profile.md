---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/11/2023
ms.author: glenga
---

To download the publishing profile of your function app:

1. In the [Azure portal](https://portal.azure.com), locate the page for your function app, expand **Settings** > **Configuration** in the left column.

1. In the **Configuration** page, select the **General settings** tab and make sure that **SCM Basic Auth Publishing Credentials** is turned **On**. When this setting is **Off**, you can't use publish profiles, so select **On** and then **Save**. 

1. Go back to the function app's **Overview** page, and then select **Get publish profile**.

   :::image type="content" source="../articles/azure-functions/media/functions-how-to-github-actions/get-publish-profile.png" alt-text="Download publish profile":::

1. Save and copy the contents of the file.