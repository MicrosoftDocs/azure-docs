---
 title: include file
 description: include file
 services: iot-edge
 author: kgremban
 ms.service: iot-edge
 ms.topic: include
 ms.date: 06/30/2020
 ms.author: kgremban
 ms.custom: include file
---

One of the key capabilities of Azure IoT Edge is deploying code to your IoT Edge devices from the cloud. *IoT Edge modules* are executable packages implemented as containers. In this section, you'll deploy a pre-built module from the [IoT Edge Modules section of Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1&subcategories=iot-edge-modules) directly from Azure IoT Hub.

The module that you deploy in this section simulates a sensor and sends generated data. This module is a useful piece of code when you're getting started with IoT Edge because you can use the simulated data for development and testing. If you want to see exactly what this module does, you can view the [simulated temperature sensor source code](https://github.com/Azure/iotedge/blob/027a509549a248647ed41ca7fe1dc508771c8123/edge-modules/SimulatedTemperatureSensor/src/Program.cs).

Follow these steps to deploy your first module from Azure Marketplace.

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your IoT hub.

1. From the menu on the left, under **Automatic Device Management**, select **IoT Edge**.

1. Select the device ID of the target device from the list of devices.

1. On the upper bar, select **Set Modules**.

   ![Screenshot that shows selecting Set Modules.](./media/iot-edge-deploy-module/select-set-modules.png)

1. Under **IoT Edge Modules**, open the **Add** drop-down menu, and then select **Marketplace Module**.

   ![Screenshot that shows the Add drop-down menu.](./media/iot-edge-deploy-module/add-marketplace-module.png)

1. In **IoT Edge Module Marketplace**, search for and select the `Simulated Temperature Sensor` module.

   The module is added to the IoT Edge Modules section with the desired **running** status.

1. Select **Next: Routes** to continue to the next step of the wizard.

   ![Screenshot that shows continuing to the next step after the module is added.](./media/iot-edge-deploy-module/view-temperature-sensor-next-routes.png)

1. On the **Routes** tab, remove the default route, **route**, and then select **Next: Review + create** to continue to the next step of the wizard.

   >[!Note]
   >Routes are constructed by using name and value pairs. You should see two routes on this page. The default route, **route**, sends all messages to IoT Hub (which is called `$upstream`). A second route, **SimulatedTemperatureSensorToIoTHub**, was created automatically when you added the module from Azure Marketplace. This route sends all messages from the simulated temperature module to IoT Hub. You can delete the default route because it's redundant in this case.

   ![Screenshot that shows removing the default route then moving to the next step.](./media/iot-edge-deploy-module/delete-route-next-review-create.png)

1. Review the JSON file, and then select **Create**. The JSON file defines all of the modules that you deploy to your IoT Edge device. You'll see the **SimulatedTemperatureSensor** module and the two runtime modules, **edgeAgent** and **edgeHub**.

   >[!Note]
   >When you submit a new deployment to an IoT Edge device, nothing is pushed to your device. Instead, the device queries IoT Hub regularly for any new instructions. If the device finds an updated deployment manifest, it uses the information about the new deployment to pull the module images from the cloud then starts running the modules locally. This process can take a few minutes.

1. After you create the module deployment details, the wizard returns you to the device details page. View the deployment status on the **Modules** tab.

   You should see three modules: **$edgeAgent**, **$edgeHub**, and **SimulatedTemperatureSensor**. If one or more of the modules has **YES** under **SPECIFIED IN DEPLOYMENT** but not under **REPORTED BY DEVICE**, your IoT Edge device is still starting them. Wait a few minutes, and then refresh the page.

   ![Screenshot that shows Simulated Temperature Sensor in the list of deployed modules.](./media/iot-edge-deploy-module/view-deployed-modules.png)
