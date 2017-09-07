---
title: Provision a simulated device to Azure IoT Hub | Microsoft Docs
description: Azure Quickstart - Create and provision a simulated device using Azure IoT Hub Device Provisioning Service
services: iot-dps 
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 09/05/2017
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Create and provision a simulated device using IoT Hub Device Provisioning Service (preview)

These steps show how to create a simulated device on your development machine running Windows OS, run the Windows TPM simulator as the [Hardware Security Module (HSM)](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/) of the device, and use the code sample to connect this simulated device with the Device Provisioning Service and your IoT hub. 

Make sure to complete the steps in the [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before you proceed.

<a id="setupdevbox"></a>
## Prepare the development environment 

1. Make sure you have either Visual Studio 2015 or [Visual Studio 2017](https://www.visualstudio.com/vs/) installed on your machine. 

2. Download and install the [CMake build system](https://cmake.org/download/).

3. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes the **Git Bash**, the command-line app that you can use to interact with your local Git repository. 

4. Open a command prompt or Git Bash. Clone the GitHub repo for device simulation code sample:
    
    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-device-auth.git --recursive
    ```

5. Create a folder in your local copy of this GitHub repo for CMake build process. 

    ```cmd/sh
    cd azure-iot-device-auth
    mkdir cmake
    cd cmake
    ```

6. The code sample uses a Windows TPM simulator. Run the following command to enable the SAS token authentication. It also generates a Visual Studio solution for the simulated device.

    ```cmd/sh
    cmake -Ddps_auth_type=tpm_simulator ..
    ```

7. In a separate command prompt, navigate to the GitHub root folder and run the [TPM](https://docs.microsoft.com/windows/device-security/tpm/trusted-platform-module-overview) simulator. It listens over a socket on ports 2321 and 2322. Do not close this command window; you will need to keep this simulator running until the end of this Quickstart guide. 

    ```cmd/sh
    .\azure-iot-device-auth\dps_client\deps\utpm\tools\tpm_simulator\Simulator.exe
    ```

## Create a device enrollment entry in the Device Provisioning Service

1. Open the solution generated in the *cmake* folder named `azure_iot_sdks.sln`, and build it in Visual Studio.

2. Right-click the **tpm_device_provision** project and select **Set as Startup Project**. Run the solution. The output window displays the **_Endorsement Key_** and the **_Registration ID_** needed for device enrollment. Note down these values. 

3. Log in to the Azure portal, click on the **All resources** button on the left-hand menu and open your Device Provisioning service.

4. On the Device Provisioning Service summary blade, select **Manage enrollments**. Select **Individual Enrollments** tab and click the **Add** button at the top. Select **TPM** as the identity attestation *Mechanism*, and enter the *Registration ID* and *Endorsement key* as required by the blade. Once complete, click the **Save** button. 

    ![Enter device enrollment information in the portal blade](./media/quick-create-simulated-device/enter-device-enrollment.png)  

   On successful enrollment, the *Registration ID* of your device will appear in the list under the *Individual Enrollments* tab. 

<a id="firstbootsequence"></a>
## Simulate first boot sequence for the device

1. In the Azure portal, select the **Overview** blade for your Device Provisioning service and note down the **_Global device endpoint_** and the **_ID Scope_** values.

    ![Extract DPS endpoint information from the portal blade](./media/quick-create-simulated-device/extract-dps-endpoints.png) 

2. In Visual Studio on your machine, select the sample project named **dps_client_sample** and open the file **dps_client_sample.c**.

3. Assign the _ID Scope_ value to the `dps_scope_id` variable. Notice that the `dps_uri` variable has the same value as the _Global device endpoint_. 

    ```c
    static const char* dps_uri = "global.azure-devices-provisioning.net";
    static const char* dps_scope_id = "[DPS Id Scope]";
    ```

4. Right-click the **dps_client_sample** project and select **Set as Startup Project**. Run the sample. Notice the messages that simulate the device booting and connecting to the Device Provisioning Service to get your IoT hub information. On successful provisioning of your simulated device to the IoT hub linked with your provisioning service, the device ID appears on the hub's **Device Explorer** blade. 

    ![Device is registered with the IoT hub](./media/quick-create-simulated-device/hub-registration.png) 


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
