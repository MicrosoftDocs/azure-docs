---
author: v-dalc
ms.service: databox
ms.author: alkohli
ms.topic: include
ms.date: 02/04/2021
---

Use the IoT Edge agent runtime responses to troubleshoot compute-related errors. Here is a list of possible responses:

* 200 - OK
* 400 - The deployment configuration is malformed or invalid.
* 417 - The device doesn't have a deployment configuration set.
* 412 - The schema version in the deployment configuration is invalid.
* 406 - The IoT Edge device is offline or not sending status reports.
* 500 - An error occurred in the IoT Edge runtime.

> [!TIP]
> If any of your compute modules has Unknown status and can't be used, try deleting the IoT role, and then redeploy the module.

For more information, see [IoT Edge Agent](/azure/iot-edge/iot-edge-runtime?view=iotedge-2018-06&preserve-view=true#iot-edge-agent).