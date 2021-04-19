---
title: Manage IoT Central from the Azure portal | Microsoft Docs
description: This article describes how to create and manage your IoT Central applications from the Azure portal.
services: iot-central
ms.service: iot-central
author: vishwam
ms.author: vishwams
ms.date: 04/17/2021
ms.topic: how-to
manager: philmea
---

# Manage IoT Central from the Azure portal

[!INCLUDE [iot-central-selector-manage](../../../includes/iot-central-selector-manage.md)]

You can use the [Azure portal](https://portal.azure.com) to create and manage IoT Central applications, similar to the functionality in IoT Central's [application manager](https://apps.azureiotcentral.com/myapps).

## Create IoT Central applications

[!INCLUDE [Warning About Access Required](../../../includes/iot-central-warning-contribitorrequireaccess.md)]

To create an application, navigate to the [Create IoT Central Application](https://ms.portal.azure.com/#create/Microsoft.IoTCentral) page in the Azure portal and fill in the form.

![Create IoT Central form](media/howto-manage-iot-central-from-portal/image6a.png)

* **Resource name** is a unique name you can choose for your IoT Central application in your Azure resource group.

* **Application URL** is the URL you can use to access your application.

* **Location** is the [geography](https://azure.microsoft.com/global-infrastructure/geographies/) where you'd like to create your application. Typically, you should choose the location that's physically closest to your devices to get optimal performance. Azure IoT Central is currently available in the following locations:
    * Asia Pacific
    * Australia
    * Europe
    * Japan
    * United Kingdom
    * United States

  Once you choose a location, you can't move your application to a different location later.

After filling out all fields, select **Create**. For more information, see the [Create an IoT Central application](quick-deploy-iot-central.md) quickstart.

## Manage existing IoT Central applications

If you already have an Azure IoT Central application, you can delete it, or move it to a different subscription or resource group in the Azure portal.

> [!NOTE]
> Applications created using the *free* plan do not require an Azure subscriptions, and therefore you won't find them listed in your Azure subscription on the Azure portal. You can only see and manage free apps from the IoT Central portal.

To get started, search for your application in the search bar at the top of the Azure portal. You can also view all your applications by searching for "IoT Central Applications" and selecting the service:

![Screenshot that shows the search results for "IoT Central Applications" with the first service selected.](media/howto-manage-iot-central-from-portal/search-iot-central.png)

Once you select an application in the search results, the Azure portal shows you its overview. You can navigate to the actual application by selecting the **IoT Central Application URL**:

![Screenshot that shows the "Overview" page with the "IoT Central Application URL" highlighted.](media/howto-manage-iot-central-from-portal/image3.png)

To move the application to a different resource group, select **change** beside the resource group. On the **Move resources** page, choose the resource group you'd like to move this application to:

![Screenshot that shows the "Overview" page with the "Resource group (change)" highlighted.](media/howto-manage-iot-central-from-portal/image4a.png)

To move the application to a different subscription, select  **change** beside the subscription. On the **Move resources** page, choose the subscription you'd like to move this application to:

![Management portal: resource management](media/howto-manage-iot-central-from-portal/image5a.png)

## Next steps

Now that you've learned how to manage Azure IoT Central applications from the Azure portal, here is the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)