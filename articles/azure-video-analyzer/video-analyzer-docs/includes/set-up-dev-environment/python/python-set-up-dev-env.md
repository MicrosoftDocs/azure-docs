---
author: russell-cooks
ms.topic: include
ms.service: azure-video-analyzer
ms.date: 05/03/2021
ms.author: juliako
---

### Get the sample code

1. Clone the [AVA python samples repository](https://github.com/Azure-Samples/video-analyzer-iot-edge-python).
1. Start Visual Studio Code, and open the folder where the repo has been downloaded.
1. In Visual Studio Code, browse to the src/cloud-to-device-console-app folder and create a file named **appsettings.json**. This file contains the settings needed to run the program.
1. Browse to the file share in the storage account created in the setup step above, and locate the **appsettings.json** file under the "deployment-output" file share. Click on the file, and then hit the "Download" button. The contents should open in a new browser tab, which should look like:

   ```json
   {
     "IoThubConnectionString": "HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX",
     "deviceId": "avasample-iot-edge-device",
     "moduleId": "avaedge"
   }
   ```

   The IoT Hub connection string lets you use Visual Studio Code to send commands to the edge modules via Azure IoT Hub. Copy the above JSON into the **src/cloud-to-device-console-app/appsettings.json** file.
1. Next, browse to the src/edge folder and create a file named **.env**. This file contains properties that Visual Studio Code uses to deploy modules to an edge device.
1. Browse to the file share in the storage account created in the setup step above, and locate the **env.txt** file under the "deployment-output" file share. Click on the file, and then hit the "Download" button. The contents should open in a new browser tab, which should look like:

   ```
        SUBSCRIPTION_ID="<Subscription ID>"
        RESOURCE_GROUP="<Resource Group>"
        AVA_PROVISIONING_TOKEN="<Provisioning token>"
        VIDEO_INPUT_FOLDER_ON_DEVICE="/home/localedgeuser/samples/input"
        VIDEO_OUTPUT_FOLDER_ON_DEVICE="/var/media"
        APPDATA_FOLDER_ON_DEVICE="/var/lib/videoAnalyzer"
        CONTAINER_REGISTRY_USERNAME_myacr="<your container registry username>"
        CONTAINER_REGISTRY_PASSWORD_myacr="<your container registry password>"
   ```

   Copy the JSON from your **env.txt** into the **src/edge/.env** file.

### Connect to the IoT Hub

1.  In Visual Studio Code, set the IoT Hub connection string by selecting the **More actions** icon next to the **AZURE IOT HUB** pane in the lower-left corner. Copy the string from the src/cloud-to-device-console-app/appsettings.json file.

    <!-- commenting out the image for now ![Set IoT Hub connection string]()./media/quickstarts/set-iotconnection-string.png-->

    [!INCLUDE [provide-builtin-endpoint](../../common-includes/provide-builtin-endpoint.md)]
1. In about 30 seconds, refresh Azure IoT Hub in the lower-left section. You should see the edge device `avasample-iot-edge-device`, which should have the following modules deployed:
    - Edge Hub (module name **edgeHub**)
    - Edge Agent (module name **edgeAgent**)
    - Video Analyzer (module name **avaedge**)
    - RTSP simulator (module name **rtspsim**)

### Prepare to monitor the modules

When you use run this quickstart or tutorial, events will be sent to the IoT Hub. To see these events, follow these steps:

1. Open the Explorer pane in Visual Studio Code, and look for **Azure IoT Hub** in the lower-left corner.
1. Expand the **Devices** node.
1. Right-click on `avasample-iot-edge-device`, and select **Start Monitoring Built-in Event Endpoint**.

    [!INCLUDE [provide-builtin-endpoint](../../common-includes/provide-builtin-endpoint.md)]
