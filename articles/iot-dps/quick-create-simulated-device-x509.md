---
title: Provision an X.509 simulated device to Azure IoT Hub | Microsoft Docs
description: Azure Quickstart - Create and provision an X.509 simulated device using Azure IoT Hub Device Provisioning Service
services: iot-dps 
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 11/08/2017
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Create and provision an X.509 simulated device using IoT Hub Device Provisioning Service (preview)
> [!div class="op_single_selector"]
> * [TPM](quick-create-simulated-device.md)
> * [X.509](quick-create-simulated-device-x509.md)

These steps show how to simulate an X.509 device on your development machine running Windows OS, and use a code sample to connect this simulated device with the Device Provisioning Service and your IoT hub. 

Make sure to complete the steps in the [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before you proceed.

<a id="setupdevbox"></a>
## Prepare the development environment 

1. Make sure you have either Visual Studio 2015 or [Visual Studio 2017](https://www.visualstudio.com/vs/) installed on your machine. You must have 'Desktop development with C++' workload enabled for your Visual Studio installation.

2. Download and install the [CMake build system](https://cmake.org/download/).

3. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes the **Git Bash**, the command-line app that you can use to interact with your local Git repository. 

4. Open a command prompt or Git Bash. Clone the GitHub repo for device simulation code sample:
    
    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-c.git --recursive
    ```

5. Create a folder in your local copy of this GitHub repo for CMake build process. 

    ```cmd/sh
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    ```

6. Run the following command to create the Visual Studio solution for the provisioning client.

    ```cmd/sh
    cmake -Duse_prov_client:BOOL=ON ..
    ```


## Create a device enrollment entry in the Device Provisioning Service

1. Open the solution generated in the *cmake* folder named `azure_iot_sdks.sln`, and build it in Visual Studio.

2. Right-click the **dice\_device\_enrollment** project under the **Provision\_Samples** folder, and select **Set as Startup Project**. Run the solution. In the output window, enter `i` for individual enrollment when prompted. The output window displays a locally generated X.509 certificate for your simulated device. Copy to clipboard the output starting from *-----BEGIN CERTIFICATE-----* and ending at *-----END PUBLIC KEY-----*, making sure to include both of these lines as well. 
 
3. Create a file named **_X509testcertificate.pem_** on your Windows machine, open it in an editor of your choice, and copy the clipboard contents to this file. Save the file. 

4. Log in to the Azure portal, click on the **All resources** button on the left-hand menu and open your Device Provisioning service.

4. On the Device Provisioning Service summary blade, select **Manage enrollments**. Select **Individual Enrollments** tab and click the **Add** button at the top. 

5. Under the **Add enrollment list entry**, enter the following information:
    - Select **X.509** as the identity attestation *Mechanism*.
    - Under the *Certificate .pem or .cer file*, select the certificate file **_X509testcertificate.pem_** created in the previous steps using the *File Explorer* widget.
    - Select an IoT hub linked with your provisioning service.
    - Enter a unique device ID. Make sure to avoid sensitive data while naming your device.
    - Optionally, update the **Initial device twin state** with the desired initial configuration for the device.
    - Once complete, click the **Save** button. 

    ![Enter X.509 device enrollment information in the portal blade](./media/quick-create-simulated-device-x509/enter-device-enrollment.png)  

   On successful enrollment, your X.509 device will appear as **riot-device-cert** under the *Registration ID* column in the *Individual Enrollments* tab. 

> [!NOTE]
> At present, you can only add one X.509 device for Individual Enrollment. Enrolling a second X.509 device will simply replace the enrollment for the existing X.509 device. 
> 


<a id="firstbootsequence"></a>
## Simulate first boot sequence for the device

1. In the Azure portal, select the **Overview** blade for your Device Provisioning service and note down the **_ID Scope_** value.

    ![Extract DPS endpoint information from the portal blade](./media/quick-create-simulated-device-x509/extract-dps-endpoints.png) 

2. In Visual Studio on your machine, navigate to the sample project named **prov\_dev\_client\_sample** under the **Provision\_Samples** folder, and open the file **prov\_dev\_client\_sample.c**.

3. Assign the _ID Scope_ value to the `scope_id` variable. 

    ```c
    static const char* scope_id = "[ID Scope]";
    ```

4. Right-click the **prov\_dev\_client\_sample** project and select **Set as Startup Project**. Run the sample. Notice the messages that simulate the device booting and connecting to the Device Provisioning Service to get your IoT hub information. Close the window at the end of the messages.

5. In the portal, navigate to the IoT hub linked to your provisioning service and open the **Device Explorer** blade. On successful provisioning of the simulated X.509 device to the hub, its device ID appears on the **Device Explorer** blade, with *STATUS* as **enabled**. Note that you might need to click the **Refresh** button at the top if you already opened the blade prior to running the sample device application. 

    ![Device is registered with the IoT hub](./media/quick-create-simulated-device/hub-registration.png) 

> [!NOTE]
> If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).
>


## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Close the device client sample output window on your machine.
1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. At the top of the **All resources** blade, click **Delete**.  
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  

## Next steps

In this Quickstart, you’ve created a simulated X.509 device on your Windows machine and provisioned it to your IoT hub using the Azure IoT Hub Device Provisioning Service. To learn about device provisioning in depth, continue to the tutorial for the Device Provisioning Service setup in the Azure portal. 

> [!div class="nextstepaction"]
> [Azure IoT Hub Device Provisioning Service tutorials](./tutorial-set-up-cloud.md)
