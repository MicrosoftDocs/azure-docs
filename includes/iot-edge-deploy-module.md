---
 title: include file
 description: include file
 services: iot-edge
 author: kgremban
 ms.service: iot-edge
 ms.topic: include
 ms.date: 06/22/2018
 ms.author: kgremban
 ms.custom: include file
---

One of the key capabilities of Azure IoT Edge is being able to deploy modules to your IoT Edge devices from the cloud. An IoT Edge module is an executable package implemented as a container. In this section, you deploy a module that generates telemetry for your simulated device. 

1. In the Azure portal, navigate to your IoT hub.
1. Go to **IoT Edge (preview)** and select your IoT Edge device.
1. Select **Set Modules**.

   >[!IMPORTANT]
   >**BUG BASH ONLY**
   >1. Select **Configure advanced Edge Runtime settings**
   >2. Update the edgeHub image: `•	mcr.microsoft.com/azureiotedge-hub:1.0`
   >3. Update the edgeAgent image: `mcr.microsoft.com/azureiotedge-agent:1.0`

1. In the **Deployment Modules** section of the page, click **Add** then select **IoT Edge Module**.
1. In the **Name** field, enter `tempSensor`. 
1. In the **Image URI** field, enter `mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0`. 
1. Leave the other settings unchanged, and select **Save**.

   ![Save IoT Edge module after entering name and image URI](./media/iot-edge-deploy-module/name-image.png)

1. Back in the **Add modules** step, select **Next**.
1. In the **Specify routes** step, you should have a default route that sends all messages from all modules to IoT Hub. If not, add the following code then select **Next**.

   ```json
   {
       "routes": {
           "route": "FROM /* INTO $upstream"
       }
   }
   ```

1. In the **Review template** step, select **Submit**.
1. Return to the device details page and select **Refresh**. You should see the new tempSensor module running along the IoT Edge runtime. 

   ![View tempSensor in list of deployed modules][1]

<!-- Images -->
[1]: ../articles/iot-edge/media/tutorial-simulate-device-windows/view-module.png