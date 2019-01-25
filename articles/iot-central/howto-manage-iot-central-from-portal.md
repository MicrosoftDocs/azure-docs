---
title: Manage IoT Central from the Azure portal | Microsoft Docs
description: Manage IoT Central from the Azure portal.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 01/14/2019
ms.topic: conceptual
manager: philmea
---

# Manage IoT Central from the Azure portal

Instead of creating and managing IoT Central applications from the IoT Central [Application Manager](https://aka.ms/iotcentral) page, you can use the [Azure portal](https://portal.azure.com) to manage your applications.

## Create IoT Central applications

To create an application, navigate to the [Azure portal](https://ms.portal.azure.com) and click **Create a resource** in the main navigation menu on the left.

![Management portal: nav menu](media/howto-manage-iot-central-from-portal/image0.png)

In search bar, type **IoT Central**.

![Management portal: search](media/howto-manage-iot-central-from-portal/image0a.png)

Click the **IoT Central Application** line-item in the search results.

![Management Portal: search results](media/howto-manage-iot-central-from-portal/image0b.png)

Now, click the **Create** button.

![Management portal: IoT Central resource](media/howto-manage-iot-central-from-portal/image0c.png)

Fill in all the fields in the form. This form is similar to the form you fill out to create applications on the IoT Central [Application Manager](https://aka.ms/iotcentral) page. For more information, see the [Create an IoT Central application](quick-deploy-iot-central.md) quickstart.

![Management portal: create IoT Central resource](media/howto-manage-iot-central-from-portal/image1.png)  

After filling out all fields, click the **Create** button.

## Manage existing IoT Central applications

If you already have an Azure IoT Central application you can delete it, or move it to a different subscription or resource group in the Azure portal.

> [!NOTE]
> You can't see Trial applications in the Azure portal because they are not associated with your subscription.

To get started, click **All resources** in the main navigation menu on the left. Use the search box to type in the name of your application to find it in your list of resources. Then click the IoT Central application you'd like to manage.

![Management portal: resource management](media/howto-manage-iot-central-from-portal/image2.png)

To navigate to the application, click the IoT Central Application URL.

![Management portal: resource management](media/howto-manage-iot-central-from-portal/image3.png)

To move the application to a different resource group, click **change** beside the resource group. On the **Move resources** page, pick the resource group you'd like to migrate this application to.

![Management portal: resource management](media/howto-manage-iot-central-from-portal/image4.png)

To move the application to a different subscription, click the **change** link beside the subscription. Pick the subscription to which you'd like to migrate this application in the dialog that appears.

![Management portal: resource management](media/howto-manage-iot-central-from-portal/image5.png)

## Next steps

Now that you've learned how to manage Azure IoT Central applications from the Azure portal, here is the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)