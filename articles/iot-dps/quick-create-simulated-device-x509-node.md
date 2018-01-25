---
title: Provision a simulated X.509 device to Azure IoT Hub using Node.js | Microsoft Docs
description: Azure Quickstart - Create and provision a simulated X.509 device using Node.js device SDK for Azure IoT Hub Device Provisioning Service
services: iot-dps 
keywords: 
author: msebolt
ms.author: v-masebo
ms.date: 01/24/2018
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Create and provision an X.509 simulated device using Node.js device SDK for IoT Hub Device Provisioning Service
[!INCLUDE [iot-dps-selector-quick-create-simulated-device-x509](../../includes/iot-dps-selector-quick-create-simulated-device-x509.md)]

These steps show how to simulate an X.509 device on your development machine running Windows OS, and use a code sample to connect this simulated device with the Device Provisioning Service and your IoT hub. 


## Prepare the development environment 

- Make sure to complete the steps in the [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before you proceed.

- Make sure you have [Node.js v4.0 or above](https://nodejs.org) installed on your machine.


## Create a device enrollment entry in the Device Provisioning Service

1. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes the **Git Bash**, the command-line app that you can use to interact with your local Git repository. 

1. Open a command prompt. Clone the GitHub repo for the code samples:
    
    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-node.git --recursive
    ```

1. Make sure `OpenSSL` is installed on yur machine and is added to the environment variables accessible to the command window. This step requires [OpenSSL](https://www.openssl.org/), which can either be built and installed from source or downloaded and installed from a [3rd party](https://wiki.openssl.org/index.php/Binaries) such as [this](https://sourceforge.net/projects/openssl/). If you have already created your _root_, _intermediate_ and _device_ certificates you may skip this step.

1. Navigate to the certificate generator script and build the project. 

    ```cmd/sh
    cd azure-iot-sdk-node/provisioning/tools
    npm install
    ```

1. Execute the script using your own _certficiate-name_. Be sure to only use lower-case alphanumerics and hypens.

    ```cmd/sh
    node create_test_cert.js device {certificate-name}
    ```

1. Log in to the Azure portal, click on the **All resources** button on the left-hand menu and open your provisioning service.

1. Open **Manage enrollments** blade for your service. Select **Individual Enrollments** tab, and click the **Add** button at the top. 

1. Under the **Add enrollment list entry**, enter the following information:
    - Select **X.509** as the identity attestation *Mechanism*.
    - Under the *Certificate .pem or .cer file*, select the certificate file **_{{certificate-name}\_cert.pem_** created in the previous steps using the *File Explorer* widget.
    - Optionally, you may provide the following information:
        - Select an IoT hub linked with your provisioning service.
        - Enter a unique device ID. Make sure to avoid sensitive data while naming your device. 
        - Update the **Initial device twin state** with the desired initial configuration for the device.
    - Once complete, click the **Save** button. 

    ![Enter X.509 device enrollment information in the portal blade](./media/quick-create-simulated-device-x509-node/enter-device-enrollment.png)  

    On successful enrollment, your X.509 device appears as **{certificatename}** under the *Registration ID* column in the *Individual Enrollments* tab. Note this value for later. 


## Simulate first boot sequence for the device

1. In the Azure portal, select the **Overview** blade for your Device Provisioning service and note down the **_GLobal Device Endpoint_** and **_ID Scope_** values.

    ![Extract DPS endpoint information from the portal blade](./media/quick-create-simulated-device-x509-node/extract-dps-endpoints.png) 

1. Copy your _certificate_ and _key_ to the sample folder.

    ```cmd/sh
    copy .\{certificate-name}_cert.pem ..\device\samples\{certificate-name}_cert.pem
    copy .\{certificate-name}_key.pem ..\device\samples\{certificate-name}_key.pem
    ```

1. Navigate to the device test script and build the project. 

    ```cmd/sh
    cd ..\device\samples
    npm install
    ```

1. Edit the **register\_x509.js** file. Replace _provisioning host_ with the **_Global Device Endpoint_** noted earlier and _id scope_ as well. Enter **_{certificatename}_** (without hypens) as your _registration id_ you noted earlier and replace _cert filename_ and _key filename_ with the files you copied in **Step 2**. Save **register\_x509.js**. 

1. Execute the script and verify the device was provisioned successfully.

    ```cmd/sh
    node register_x509.js
    ```   

1. In the portal, navigate to the IoT hub linked to your provisioning service and open the **IoT Devices** blade. On successful provisioning of the simulated X.509 device to the hub, its device ID appears on the **IoT Devices** blade, with *STATUS* as **enabled**. Note that you might need to click the **Refresh** button at the top if you already opened the blade prior to running the sample device application. 

    ![Device is registered with the IoT hub](./media/quick-create-simulated-device-x509-node/hub-registration.png) 

    If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).


## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Close the device client sample output window on your machine.
1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. Open the **Manage Enrollments** blade for your service, and then click the **Individual Enrollments** tab. Select the *REGISTRATION ID* of the device you enrolled in this Quickstart, and click the **Delete** button at the top. 
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. Open the **IoT Devices** blade for your hub, select the *DEVICE ID* of the device you registered in this Quickstart, and then click **Delete** button at the top.

## Next steps

In this Quickstart, you’ve created a simulated X.509 device on your Windows machine and provisioned it to your IoT hub using the Azure IoT Hub Device Provisioning Service on the portal. To learn how to enroll your X.509 device programmatically, continue to the Quickstart for programmatic enrollment of X.509 devices. 

> [!div class="nextstepaction"]
> [Azure Quickstart - Enroll X.509 devices to Azure IoT Hub Device Provisioning Service](quick-enroll-device-x509-node.md)
