---
 title: include file
 description: include file
 services: iot-hub
 author: dominicbetts
 ms.service: iot-hub
 ms.topic: include
 ms.date: 04/19/2018
 ms.author: dobett
 ms.custom: include file
---

To create an IoT Hub using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a resource** > **Internet of Things** > **IoT Hub**.

    ![Select to install IoT Hub](media/iot-hub-tutorials-create-free-hub/selectiothub.png)

1. To create your free-tier IoT hub, use the values in the following tables:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your Azure subscription in the drop-down. |
    | Resource group | Create new. This tutorial uses the name **tutorials-iot-hub-rg**. |
    | Region | This tutorial uses **West US**. You can choose the region closest to you. |
    | Name | The following screenshot uses the name **tutorials-iot-hub**. You must choose your own unique name when you create your hub. |

    ![Hub settings 1](media/iot-hub-tutorials-create-free-hub/hubdefinition-1.png)

    | Setting | Value |
    | ------- | ----- |
    | Pricing and scale tier | F1 Free. You can only have one free tier hub in a subscription. |
    | IoT Hub units | 1 |

    ![Hub settings 2](media/iot-hub-tutorials-create-free-hub/hubdefinition-2.png)

1. Click **Create**. It can take several minutes for the hub to be created.

    ![Hub settings 3](media/iot-hub-tutorials-create-free-hub/hubdefinition-3.png)

1. Make a note of the IoT hub name you chose. You use this value later in the tutorial.
