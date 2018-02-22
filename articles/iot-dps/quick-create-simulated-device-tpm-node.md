---
title: Provision a simulated TPM device to Azure IoT Hub using Node.js | Microsoft Docs
description: Azure Quickstart - Create and provision a simulated TPM device using Node.js device SDK for Azure IoT Hub Device Provisioning Service
services: iot-dps 
keywords: 
author: msebolt
ms.author: v-masebo
ms.date: 02/21/2018
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Create and provision a simulated TPM device using Node.js device SDK for IoT Hub Device Provisioning Service

[!INCLUDE [iot-dps-selector-quick-create-simulated-device-tpm](../../includes/iot-dps-selector-quick-create-simulated-device-tpm.md)]

These steps show how to create a simulated device on your development machine running Windows OS, run the Windows TPM simulator as the [Hardware Security Module (HSM)](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/) of the device, and use the code sample to connect this simulated device with the Device Provisioning Service and your IoT hub. 

Make sure to complete the steps in the [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before you proceed.


## Prepare the environment 

1. Make sure you have [Node.js v4.0 or above](https://nodejs.org) installed on your machine.

    > [!NOTE]
    > The steps below use **Azure IoT SDK for C** to simulate the TPM device. If your device is already set up, you may skip ahead to **Register the device**.
    >

1. Make sure you have either Visual Studio 2015 or [Visual Studio 2017](https://www.visualstudio.com/vs/) installed on your machine. You must have ['Desktop development with C++'](https://www.visualstudio.com/vs/support/selecting-workloads-visual-studio-2017/) workload enabled for your Visual Studio installation.

1. Download and install the [CMake build system](https://cmake.org/download/). It is important that the Visual Studio with 'Desktop development with C++' workload is installed on your machine, **before** the `cmake` installation.

1. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes the **Git Bash**, the command-line app that you can use to interact with your local Git repository. 


## Simulate the TPM device

1. Open a command prompt or Git Bash. Clone the GitHub repo for device simulation code sample:
    
    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-c.git --recursive
    ```

1. Create a folder in your local copy of this GitHub repo for CMake build process. 

    ```cmd/sh
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    ```

1. The code sample uses a Windows TPM simulator. Run the following command to enable the SAS token authentication. It also generates a Visual Studio solution for the simulated device.

    ```cmd/sh
    cmake -Duse_prov_client:BOOL=ON -Duse_tpm_simulator:BOOL=ON ..
    ```

    If `cmake` does not find your C++ compiler, you might get build errors while running the above command. If that happens, try running this command in the [Visual Studio command prompt](https://docs.microsoft.com/dotnet/framework/tools/developer-command-prompt-for-vs). 

1. In a separate command prompt, navigate to the GitHub root folder and run the [TPM](https://docs.microsoft.com/windows/device-security/tpm/trusted-platform-module-overview) simulator. It listens over a socket on ports 2321 and 2322. Do not close this command window; you need to keep this simulator running until the end of this Quickstart guide. 

   If you are in the *cmake* folder, then run the following commands:

    ```cmd/sh
    cd..
    .\provisioning_client\deps\utpm\tools\tpm_simulator\Simulator.exe
    ```

1. Open the solution generated in the *cmake* folder named `azure_iot_sdks.sln`, and build it in Visual Studio.

1. In the *Solution Explorer* pane in Visual Studio, navigate to the folder **Provision\_Tools**. Right-click the **tpm_device_provision** project and select **Set as Startup Project**. 

1. Run the solution. The output window displays the **_Registration ID_** and the **_Endorsement Key_** needed for device enrollment. Note down these values. 


## Create a device entry

1. Log in to the Azure portal, click on the **All resources** button on the left-hand menu and open your Device Provisioning service.

1. On the Device Provisioning Service summary blade, select **Manage enrollments**. Select **Individual Enrollments** tab and click the **Add** button at the top. 

1. Under the **Add enrollment list entry**, enter the following information:
    - Select **TPM** as the identity attestation *Mechanism*.
    - Enter the *Registration ID* and *Endorsement key* for your TPM device.
    - Optionally, you may provide the following information:
        - Select an IoT hub linked with your provisioning service.
        - Enter a unique device ID. Make sure to avoid sensitive data while naming your device.
        - Update the **Initial device twin state** with the desired initial configuration for the device.
    - Once complete, click the **Save** button. 

    ![Enter device enrollment information in the portal blade](./media/quick-create-simulated-device/enter-device-enrollment.png)  

   On successful enrollment, the *Registration ID* of your device appears in the list under the *Individual Enrollments* tab. 


## Register the device

1. In the Azure portal, select the **Overview** blade for your Device Provisioning service and note down the **_ID Scope_** value.

    ![Extract DPS endpoint information from the portal blade](./media/quick-create-simulated-device/extract-dps-endpoints.png) 

1. Create a new empty folder called **registerdevice**. In the **registerdevice** folder, create a package.json file using the following command at your command prompt. Accept all the defaults:
   
    ```cmd/sh
    npm init
    ```

1. At your command prompt in the **registerdevice** folder, run the following command to install the **azure-iot-device-mqtt**, **azure-iot-security-tpm**, and **azure-iot-provisioning-device-http** packages:
   
    ```cmd/sh
    npm install azure-iot-device-mqtt azure-iot-security-tpm azure-iot-provisioning-device-http --save
    ```

1. Using a text editor, create a new **RegisterDevice.js** file in the **registerdevice** folder.

1. Add the following `require` statements at the start of the **RegisterDevice.js** file:
   
    ```
    'use strict';

    var ProvisioningTransport = require('azure-iot-provisioning-device-http').Http;
    var iotHubTransport = require('azure-iot-device-mqtt').Mqtt;
    var Client = require('azure-iot-device').Client;
    var Message = require('azure-iot-device').Message;
    var tpmSecurity = require('azure-iot-security-tpm');
    var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;
    var provisioningHost = 'global.azure-devices-provisioning.net';
    ```

    > [!NOTE]
    > The **Azure IoT SDK for Node.js** supports additional protocols like _AMQP_, _AMQP WS_, and _MQTT WS_.  For more examples, see [Device Provisioning Service SDK for Node.js samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/device/samples).
    > 

1. Add an **idScope** variable and use it to create a **ProvisioningDeviceClient** instance. Replace **{idScope}** with the **_ID Scope_** value from **Step 1**:
   
    ```
    var idScope = '{idScope}';

    var tss_js_1 = require("tss.js");
    var securityClient = new tpmSecurity.TpmSecurityClient('', new tss_js_1.Tpm(true));
    // if using non-simulated device, replace the above line with following:
    //var securityClient = new tpmSecurity.TpmSecurityClient();

    var provisioningClient = ProvisioningDeviceClient.create(provisioningHost, idScope, new ProvisioningTransport(), securityClient);
    ```

1. Add the following function to implement the method on the device:
   
    ```
    provisioningClient.register(function(err, result) {
      if (err) {
        console.log("error registering device: " + err);
      } else {
        console.log('registration succeeded');
        console.log('assigned hub=' + result.registrationState.assignedHub);
        console.log('deviceId=' + result.registrationState.deviceId);
        var tpmAuthenticationProvider = tpmSecurity.TpmAuthenticationProvider.fromTpmSecurityClient(result.registrationState.deviceId, result.registrationState.assignedHub, securityClient);
        var hubClient = Client.fromAuthenticationProvider(tpmAuthenticationProvider, iotHubTransport);

        var connectCallback = function (err) {
          if (err) {
            console.error('Could not connect: ' + err.message);
          } else {
            console.log('Client connected');
            var message = new Message('Hello world');
            hubClient.sendEvent(message, printResultFor('send'));
          }
        };

        hubClient.open(connectCallback);

        function printResultFor(op) {
          return function printResult(err, res) {
            if (err) console.log(op + ' error: ' + err.toString());
            if (res) console.log(op + ' status: ' + res.constructor.name);
            process.exit(1);
          };
        }
      }
    });
    ```

1. Save and close the **RegisterDevice.js** file. Run the sample.

    ```cmd/sh
    node RegisterDevice.js
    ```

1. Notice the messages that simulate the device booting and connecting to the Device Provisioning Service to get your IoT hub information. On successful provisioning of your simulated device to the IoT hub linked with your provisioning service, the device ID appears on the hub's **IoT Devices** blade. 

    ![Device is registered with the IoT hub](./media/quick-create-simulated-device/hub-registration.png) 

    If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md)


## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Close the device client sample output window on your machine.
1. Close the TPM simulator window on your machine.
1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. Open the **Manage Enrollments** blade for your service, and then click the **Individual Enrollments** tab. Select the *REGISTRATION ID* of the device you enrolled in this Quickstart, and click the **Delete** button at the top. 
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. Open the **IoT Devices** blade for your hub, select the *DEVICE ID* of the device you registered in this Quickstart, and then click **Delete** button at the top.


## Next steps

In this Quickstart, you’ve created a TPM simulated device on your machine and provisioned it to your IoT hub using the IoT Hub Device Provisioning Service. To learn how to enroll your TPM device programmatically, continue to the Quickstart for programmatic enrollment of a TPM device. 

> [!div class="nextstepaction"]
> [Azure Quickstart - Enroll TPM device to Azure IoT Hub Device Provisioning Service](quick-enroll-device-tpm-node.md)
