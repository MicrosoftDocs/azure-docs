---
 title: include file
 description: include file
 services: iot-hub
 author: dominicbetts
 ms.service: iot-hub
 ms.topic: include
 ms.date: 05/17/2018
 ms.author: dobett
 ms.custom: include file
---

The first step is to use the Azure portal to create an IoT hub in your subscription. The IoT hub enables you to ingest high volumes of telemetry into the cloud from many devices. The hub then enables one or more back-end services running in the cloud to read and process that telemetry.

1. Sign in to the [Azure portal](http://portal.azure.com).

1. Select **Create a resource** > **Internet of Things** > **IoT Hub**.

    ![Select to install IoT Hub][1]

1. In the **IoT hub** pane, enter the following information for your IoT hub:

   * **Subscription**: Choose the subscription that you want to use to create this IoT hub.
   * **Resource group**: Create a resource group to contain the IoT hub or use an existing one. By putting all related resources in a group together, such as **TestResources**, you can manage them all together. For example, deleting the resource group deletes all resources contained in that group. For more information, see [Use resource groups to manage your Azure resources][lnk-resource-groups].
   * **Region**: Select the closest location to your devices.
   * **Name**: Create a unique name for your IoT hub. If the name you enter is available, a green check mark appears.

   [!INCLUDE [iot-hub-pii-note-naming-hub](iot-hub-pii-note-naming-hub.md)]

   ![IoT Hub basics window][2]

2. Select **Next: Size and scale** to continue creating your IoT hub. 

3. Choose your **Pricing and scale tier**. For this article, select the **F1 - Free** tier if it's still available on your subscription. For more information, see the [Pricing and scale tier][lnk-pricing].

   ![IoT Hub size and scale window][3]

4. Select **Review + create**.

1. Review your IoT hub information, then click **Create**. Your IoT hub might take a few minutes to create. You can monitor the progress in the **Notifications** pane.


<!-- Images -->
[1]: ./media/iot-hub-create-hub/create-iot-hub1.png
[2]: ./media/iot-hub-create-hub/create-iot-hub2.png
[3]: ./media/iot-hub-create-hub/create-iot-hub3.png
<!-- Links -->
[lnk-portal]: https://portal.azure.com/
[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub/
[lnk-resource-groups]: ../articles/azure-resource-manager/resource-group-portal.md