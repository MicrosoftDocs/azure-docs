---
title: Provision a simulated device to Azure IoT Hub (TPM/.NET) | Microsoft Docs
description: Azure Quickstart - Create and provision a simulated device using Azure IoT Hub Device Provisioning Service
services: iot-dps 
keywords: 
author: JimacoMS2
ms.author: v-jamebr
ms.date: 12/06/2017
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Create and provision a simulated device using IoT Hub Device Provisioning Services (TPM/.NET)
> [!div class="op_single_selector"]
> * [TPM](quick-create-simulated-device.md)
> * [X.509](quick-create-simulated-device-x509.md)

These steps show you how to build the simulated TPM device sample available with the Azure IoT Hub C# SDK on a development machine running Windows OS, and connect the simulated device with the Device Provisioning Service and your IoT hub. The sample code uses the Windows TPM simulator as the [Hardware Security Module (HSM)](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/) of the device. 

Make sure to complete the steps in the [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before you proceed.

<a id="setupdevbox"></a>
## Prepare the development environment 

1. Make sure you have either Visual Studio 2015 or [Visual Studio 2017](https://www.visualstudio.com/vs/) installed on your machine. 

1. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes the **Git Bash**, the command-line app that you can use to interact with your local Git repository. 

4. Open a command prompt or Git Bash. Clone the Azure IoT SDK for C# GitHub repo:
    
    ```cmd/sh
    git clone --recursive https://github.com/Azure/azure-iot-sdk-csharp.git
    ```

6. Open a developer command prompt. To build the SDK, type the following command in the SDK root directory (azure-iot-sdk-csharp): 

   > [!NOTE]
   > This step is temporary and will be removed at a future date.

    ```cmd/sh
    build -clean -nolegacy
    ```

## Provision the simulated device


1. Log in to the Azure portal. Click the **All resources** button on the left-hand menu and open your Device Provisioning service. From the **Overview** blade. note down the **_ID Scope_** value.

    ![Extract DPS endpoint information from the portal blade](./media/quick-create-simulated-device/extract-dps-endpoints.png) 


2. In the developer command prompt, change directories from the SDK root directory to the project directory for the TPM device provisioning sample.

    ```cmd/sh
    cd .\provisioning\device\samples\ProvisioningDeviceClientTpm
    ```

2. Type the following command to build and run the TPM device provisioning sample. Replace the `<IDScope>` value with the ID Scope for your provisioning service. 

    ```cmd/sh
    dotnet run <IDScope>
    ```

1. The developer command prompt window displays the **_Endorsement Key_**,  the **_Registration ID_**, and a suggested **_Device ID_** needed for device enrollment. Note down these values. 
   > [!NOTE]
   > Do not confuse developer command prompt window with the window that contains output from the TPM simulator. You may have to click the developer command prompt window to bring it to the foreground.

4. In the Azure portal, on the Device Provisioning Service summary blade, select **Manage enrollments**. Select the **Individual Enrollments** tab and click the **Add** button at the top. 

5. Under **Add enrollment list entry**, enter the following information:
    - Select **TPM** as the identity attestation *Mechanism*.
    - Enter the *Registration ID* and *Endorsement key* for your TPM device. 
    - Optionally select an IoT hub linked with your provisioning service.
    - Enter a unique device ID. You can enter the device ID suggested in the sample output or enter your own. If you use your own, make sure to avoid sensitive data when naming your device. 
    - Update the **Initial device twin state** with the desired initial configuration for the device.
    - Once complete, click the **Save** button. 

    ![Enter device enrollment information in the portal blade](./media/quick-create-simulated-device/enter-device-enrollment.png)  

   On successful enrollment, the *Registration ID* of your device will appear in the list under the *Individual Enrollments* tab. 

6. Click Enter to enroll the simulated device. Notice the messages that simulate the device booting and connecting to the Device Provisioning Service to get your IoT hub information. 

1. Verify that the device has been provisioned. On successful provisioning of the simulated device to the IoT hub linked with your provisioning service, the device ID appears on the hub's **Device Explorer** blade. 

    ![Device is registered with the IoT hub](./media/quick-create-simulated-device/hub-registration.png) 

    If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md)


## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Close the device client sample output window on your machine.
1. Close the TPM simulator window on your machine.
1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. At the top of the **All resources** blade, click **Delete**.  
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  

## Next steps

In this Quickstart, you’ve created a TPM simulated device on your machine and provisioned it to your IoT hub using the Azure IoT Hub Device Provisioning Service. To learn about device provisioning in depth, continue to the tutorial for the Device Provisioning Service setup in the Azure portal. 

> [!div class="nextstepaction"]
> [Azure IoT Hub Device Provisioning Service tutorials](./tutorial-set-up-cloud.md)
