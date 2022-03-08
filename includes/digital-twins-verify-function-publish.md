---
author: baanders
description: include file describing how to verify an Azure function was published
ms.service: digital-twins
ms.topic: include
ms.date: 7/14/2021
ms.author: baanders
---

### Verify the publication of your function

Once the process of publishing the function completes, you can use these steps to verify that the publish was successful.
 
1. Navigate to the [Azure portal](https://portal.azure.com/) and sign in with your credentials.
2. In the search box at the top of the window, search for your function app name and then select it.

    :::image type="content" source="../articles/digital-twins/media/includes/azure-functions/search-function-app.png" alt-text="Screenshot showing the Azure portal. In the search field, enter the function app name." lightbox="../articles/digital-twins/media/includes/azure-functions/search-function-app.png":::

3. On the **Function app** page that opens, select **Functions** from the left menu. Look for the name of your function in the list to verify that it was published successfully.

    :::image type="content" source="../articles/digital-twins/media/includes/azure-functions/view-published-functions.png" alt-text="Screenshot showing published functions in the Azure portal." lightbox="../articles/digital-twins/media/includes/azure-functions/view-published-functions.png":::

    > [!Note] 
    > You might have to wait a few minutes or refresh the page before your function appears in the list of published functions.