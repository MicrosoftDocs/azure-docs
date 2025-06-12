---
services: app-service
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 10/15/2018
ms.author: cephalin
ms.custom: "include file"
---

## Prepare your web app

If you want to create custom TLS/SSL bindings or to enable client certificates for your App Service app, your [App Service plan](https://azure.microsoft.com/pricing/details/app-service/) must be in the Basic, Standard, Premium, or Isolated tiers.

To make sure that your web app is in a supported pricing tier:

### Go to your web app

1. In the [Azure portal](https://portal.azure.com) search box, enter **App Services** and then select it in the search results.

1. On the **App Services** page, select your web app:

   :::image type="content" source="./media/app-service-ssl-prepare-app/select-app-service.png" alt-text="Screenshot of the App Services page in the Azure portal.":::

   You're now on your web app's management page.

### Check the pricing tier

1. In the left menu for your web app, under **Settings**, select **Scale up (App Service plan)**.

1. Make sure that your web app isn't in the F1 or D1 tier. These tiers don't support custom TLS/SSL.

1. If you need to scale up, follow the steps in the next section. Otherwise, close the **Scale up** pane, and skip the next section.

### Scale up your App Service plan

1. Select any non-free tier, such as **B1**, **B2**, **B3**, or any other tier in the **Production** category.

1. When you're done, choose **Select**.

   When the scale operation is complete, you'll see a message stating that the plan was updated.

    
