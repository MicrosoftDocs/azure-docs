---
author: fvneerden
ms.service: azure-video-analyzer
ms.topic: include
ms.date: 03/18/2021
ms.author: faneerde
---

1. Clone the [AVA Python samples repository](https://github.com/Azure-Samples/live-video-analytics-iot-edge-python).
1. In Visual Studio Code, open the folder where the repo has been downloaded.
1. In Visual Studio Code, go to the *src/cloud-to-device-console-app* folder. There, create a file and name it *appsettings.json*. This file will contain the settings needed to run the program.
1. Copy the contents below into that *appsettings.json* file.

    ```json
    {  
        "IoThubConnectionString" : "HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX",  
        "deviceId" : "avasample-iot-edge-device",  
        "moduleId" : "avaedge"  
    }
    ```

1. Next, go to the *src/edge* folder and create a file named *.env*.
1. Copy the contents below into that *.env* file.

    ```
    SUBSCRIPTION_ID="<Subscription ID>"  
    RESOURCE_GROUP="<Resource Group>"   
    VIDEO_INPUT_FOLDER_ON_DEVICE="<VIDEO_INPUT_FOLDER_ON_DEVICE>"  
    VIDEO_OUTPUT_FOLDER_ON_DEVICE="<VIDEO_OUTPUT_FOLDER_ON_DEVICE>"  
    APPDATA_FOLDER_ON_DEVICE="<APPDATA_FOLDER_ON_DEVICE>"     
    ```
    > [!NOTE]
    > You can get the **folder names** from the **Content and inputs** tab in the left navigation pane of ***deploy-and-configure-modules*** file found in your resource group.   