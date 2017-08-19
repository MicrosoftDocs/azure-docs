---
title: Azure Quick Start - Create simulated device | Microsoft Docs
description: Azure Quick Start - Provision and create a simulated device using Azure IoT Hub Device Provisioning Service
services: iot-dps 
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 08/18/2017
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Create and provision a simulated device

These steps show how to create a simulated device on your development machine, run the [Hardware Security Module (HSM)](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/) simulator, and use the code sample to connect this device with the IoT DPS and your IoT hub. 

Make sure to complete the steps in the [Azure Quick Start - Set up DPS in Portal](./quick-setup-auto-provision.md) before you proceed.


## Prepare the development environment 

1. Make sure you have either Visual Studio 2015 or [Visual Studio 2017](https://www.visualstudio.com/vs/) installed on your machine. 

2. Download and install the [CMake build system](https://cmake.org/download/).

3. Open a command prompt and clone the github repo for device simulation code sample:
    
    ```
    git clone https://github.com/Azure/azure-iot-device-auth.git --recursive
    ```

4. Create a folder in your local copy of this github repo for CMake build process. 

    ```
    cd azure-iot-device-auth
    mkdir cmake
    cd cmake
    ```

5. The code sample uses a Windows TPM simulator. Run the following command to enable the SAS token authentication. It also generates a Visual Studio solution for the simulated device.

    ```
    cmake -Ddps_auth_type=tpm_simulator ..
    ```

6. In the command prompt, navigate to the github root folder and run the [TPM](https://docs.microsoft.com/windows/device-security/tpm/trusted-platform-module-overview) simulator. It listens over a socket on ports 2321 and 2322.

    ```
    .\azure-iot-device-auth\dps_client\deps\utpm\tools\tpm_simulator\Simulator.exe
    ```

## Create a device enrollment entry in DPS

1. Open the solution generated in the *cmake* folder named `azure_iot_sdks.sln`, and build it in Visual Studio.

2. Right click the **tpm_device_provision** project and select **Set as Startup Project**. Run the solution. This will display the **_Endorsement Key_** and the **_Registration Id_** needed for device enrollment. Note down these values. 

3. Login to the Azure Portal, click on the **All resources** button on the left-hand menu and open your DPS service.

4. On the DPS summary blade, select **Manage enrollments**. Select **Invidual Enrollments** tab and click the **Add** button at the top. Select **TPM** as the identity attestation *Mechanism*, and enter the *Registration Id* and *Endorsement key* as required by the blade. Once complete, click the **Save** button. 

    ![Enter device enrollment information in the portal blade](./media/quick-create-simulated-device/enter-device-enrollment.png)  


## Simulate first boot sequence for the device

1. In Azure Portal, select the **Overview** blade for your DPS service and note down the **_Service endpoint_** and the **_Origin namespace_** values.

    ![Extract DPS endpoint information from the portal blade](./media/quick-create-simulated-device/extract-dps-endpoints.png) 

2. In Visual Studio on your machine, select the sample project named **dps_client_sample** and open the file **dps_client_sample.c**.

3. Assign the _Service endpoint_ value to the `dps_uri` variable. Assign the _Origin namespace_ value to the `dps_scope_id` variable. 

    ```
    static const char* dps_uri = "[device provisioning uri]";
    static const char* dps_scope_id = "[dps scope id]";
    ```

4. Right click the **dps_client_sample** project and select **Set as Startup Project**. Run the sample. Notice the messages that simulate the device booting and connecting to the DPS to get your IoT hub information.


## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this quick start. If you do not plan to continue, use the following steps to delete all resources created by this quick start.

1. Close the device client sample output window on your machine.
2. Close the TPM simulator window on your machine.
3. In the Azure portal left-hand menu, click **Resource groups** and then click **myResourceGroup**. 
4. On your resource group page, click **Delete**, type **myResourceGroup** in the text box, and then click **Delete**.

## Next steps

In this quick start, you’ve created a TPM simulated device on your machine and provisioned it to your IoT hub using Azure IoT Hub Device Provisioning Service. To learn about device provisioning in depth, continue to the tutorial for DPS setup in the Azure Portal. 

> [!div class="nextstepaction"]
> [Azure IoT Hub DPS tutorials](./tutorial-set-up-cloud.md)
