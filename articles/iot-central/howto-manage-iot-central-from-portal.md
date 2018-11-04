---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Manage IoT Central from the Azure portal | Microsoft Docs
description: Manage IoT Central from the Azure portal.
services: iot-central
ms.service: iot-central
author: tbhagwat3
ms.author: tanmayb
ms.date: 08/30/2018
ms.topic: conceptual
manager: peterpr
---

# Manage IoT Central from the Azure portal 
In addition to creating and managing IoT Central applications from the IoT Central website, you can also manage IoT Central from the Azure portal. This article will walk through what is possible and how to do it.

## Create IoT Central applications
To create a new application, navigate to the [Azure portal](https://ms.portal.azure.com) and click "Create a resource" in the main navigation menu on the left. 

![Management portal: nav menu](media\howto-manage-iot-central-from-portal\image0.png)

In search bar type in the term "IoT Central".

![Management portal: search](media\howto-manage-iot-central-from-portal\image0a.png)

Click the IoT Central Application line-item in the search results.

![Management Portal: search results](media\howto-manage-iot-central-from-portal\image0b.png)

Now, click the "Create" button to see the form that you'll need to fill out.

![Management portal: IoT Central resource](media\howto-manage-iot-central-from-portal\image0c.png)

Fill in all the fields in the form. This form is similar to the form you need to fill out to create applications from the IoT Central website. To learn more about how to fill out each field, you can refer to the [Create an IoT Central application](https://docs.microsoft.com/ azure/iot-central/howto-create-application) document. 

![Management portal: create IoT Central resource](media\howto-manage-iot-central-from-portal\image1.png)  

After filling out all fields, click the "Create" button.

## Manage existing IoT Central applications
If you already have an Azure IoT Central application you can delete it, move it to a different subscription or resource group in the Azure portal. You can't see 7-day trial applications in the Azure portal since no subscription backs those trials.

To get started, click "All resources" in the main navigation menu on the left. Use the search box to type in the name of your application and find it in your list of resources. Then click on the IoT Central application you'd like to manage.

![Management portal: resource management](media\howto-manage-iot-central-from-portal\image2.png)

To navigate to the application, click the IoT Central Application URL.

![Management portal: resource management](media\howto-manage-iot-central-from-portal\image3.png)

To move the application to a different Resource group, click the **change** link beside the Resource group. Pick the Resource group to which you'd like to migrate this application in the dialog that appears.

![Management portal: resource management](media\howto-manage-iot-central-from-portal\image4.png)

To move the application to a different Subscription, click the **change** link beside the Subscription. Pick the Subscription to which you'd like to migrate this application in the dialog that appears.

![Management portal: resource management](media\howto-manage-iot-central-from-portal\image5.png)

## Next steps

Now that you have learned how to manage Azure IoT Central applications from the Azure portal, here is the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)