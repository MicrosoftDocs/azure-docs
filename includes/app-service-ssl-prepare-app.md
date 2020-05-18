---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 10/15/2018
ms.author: cephalin
ms.custom: "include file"
---

## Prepare your web app

To create custom security bindings or enable client certificates for your App Service app, your [App Service plan](https://azure.microsoft.com/pricing/details/app-service/) must be in the **Basic**, **Standard**, **Premium**, or **Isolated** tier. In this step, you make sure that your web app is in the supported pricing tier.

### Sign in to Azure

Open the [Azure portal](https://portal.azure.com).

### Navigate to your web app

Search for and select **App Services**.

![Select App Services](./media/app-service-ssl-prepare-app/app-services.png)

On the **App Services** page, select the name of your web app.

![Portal navigation to Azure app](./media/app-service-ssl-prepare-app/select-app.png)

You have landed on the management page of your web app.  

### Check the pricing tier

In the left-hand navigation of your web app page, scroll to the **Settings** section and select **Scale up (App Service plan)**.

![Scale-up menu](./media/app-service-ssl-prepare-app/scale-up-menu.png)

Check to make sure that your web app is not in the **F1** or **D1** tier. Your web app's current tier is highlighted by a dark blue box.

![Check pricing tier](./media/app-service-ssl-prepare-app/check-pricing-tier.png)

Custom SSL is not supported in the **F1** or **D1** tier. If you need to scale up, follow the steps in the next section. Otherwise, close the **Scale up** page and skip the [Scale up your App Service plan](#scale-up-your-app-service-plan) section.

### Scale up your App Service plan

Select any of the non-free tiers (**B1**, **B2**, **B3**, or any tier in the **Production** category). For additional options, click **See additional options**.

Click **Apply**.

![Choose pricing tier](./media/app-service-ssl-prepare-app/choose-pricing-tier.png)

When you see the following notification, the scale operation is complete.

![Scale up notification](./media/app-service-ssl-prepare-app/scale-notification.png)

