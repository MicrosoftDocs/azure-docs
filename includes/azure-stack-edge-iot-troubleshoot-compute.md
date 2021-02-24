---
author: v-dalc
ms.service: databox
ms.author: alkohli
ms.topic: include
ms.date: 02/05/2021
---

Use the IoT Edge agent runtime responses to troubleshoot compute-related errors. Here is a list of possible responses:

* 200 - OK
* 400 - The deployment configuration is malformed or invalid.
* 417 - The device doesn't have a deployment configuration set.
* 412 - The schema version in the deployment configuration is invalid.
* 406 - The IoT Edge device is offline or not sending status reports.
* 500 - An error occurred in the IoT Edge runtime.

For more information, see [IoT Edge Agent](../articles/iot-edge/iot-edge-runtime.md?preserve-view=true&view=iotedge-2018-06#iot-edge-agent).

The following error is related to the IoT Edge service on your Azure Stack Edge Pro<!--/ Data Box Gateway--> device.

### Compute modules have Unknown status and can't be used

#### Error description

All modules on the device show Unknown status and can't be used. The Unknown status persists through a reboot.<!--Original Support ticket relates to trying to deploy a container app on a Hub. Based on the work item, I assume the error description should not be that specific, and that the error applies to Azure Stack Edge Devices, which is the focus of this troubleshooting.-->

#### Suggested solution

Delete the IoT Edge service, and then redeploy the module(s). For more information, see [Remove IoT Edge service](../articles/databox-online/azure-stack-edge-j-series-manage-compute.md#remove-iot-edge-service).