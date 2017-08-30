---
title: Provision device to an IoT hub using IoT DPS | Microsoft Docs
description: Provision your device to a single IoT hub using IoT Hub Device Provisioning Service
services: iot-dps
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 08/29/2017
ms.topic: tutorial
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Provision the device to an IoT hub using the Azure IoT Hub Device Provisioning Service

In the previous tutorial, you learnt how to set up a device to connect to your DPS service. In this tutorial, you will learn how to provision this device to a single IoT hub using the DPS service. The DPS service allows you provision devices to your hub using **_enrollment lists_**. This tutorial shows you how to:

> [!div class="checklist"]
> * Enroll the device
> * Start the device
> * Verify the device is registered

## Prerequisites

Before you proceed, make sure to configure your device and its *Hardware Security Module* as discussed in the tutorial [Set up device for IoT DPS](./tutorial-set-up-device.md).


<a id="enrolldevice"></a>
## Enroll the device

<!-- Copied from the device quick start for now. Elaborate and add more screenshots when the dogfood portal is up.
-->
1. Open the solution generated in the *cmake* folder named `azure_iot_sdks.sln`, and build it in Visual Studio.

2. Right click the **tpm_device_provision** project and select **Set as Startup Project**. Run the solution. The output window displays the **_Endorsement Key_** and the **_Registration Id_** needed for device enrollment. Note down these values. 

3. Log in to the Azure portal, click on the **All resources** button on the left-hand menu and open your DPS service.

4. On the DPS summary blade, select **Manage enrollments**. Select **Invidual Enrollments** tab and click the **Add** button at the top. Select **TPM** as the identity attestation *Mechanism*, and enter the *Registration Id* and *Endorsement key* as required by the blade. Once complete, click the **Save** button. 

<!--
    ![Enter device enrollment information in the portal blade](./media/quick-create-simulated-device/enter-device-enrollment.png)  
-->


## Start the device




## Verify the device is registered



## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Enroll the device
> * Start the device
> * Verify the device is registered

Advance to the next tutorial to learn how to provision multiple devices across load-balanced hubs. 

> [!div class="nextstepaction"]
> [Use DPS to provision devices across load balanced IoT hubs](./tutorial-provision-multiple-hubs.md)

<!--- 
Rules for screenshots:
- Use default Public Portal colors
- Browser included in the first shot (especially) but all shots if possible
- Resize the browser to minimize white space
- Include complete blades in the screenshots
- Linux: Safari – consider context in images
Guidelines for outlining areas within screenshots:
	- Red outline #ef4836
	- 3px thick outline
	- Text should be vertically centered within the outline.
	- Length of outline should be dependent on where it sits within the screenshot. Make the shape fit the layout of the screenshot.
-->