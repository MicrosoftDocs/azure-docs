---
title: Quickstart - Provision a simulated TPM device to Azure IoT Hub using C#
description: Quickstart - Create and provision a simulated TPM device using C# device SDK for Azure IoT Hub Device Provisioning Service (DPS). This quickstart uses individual enrollments.
author: wesmc7777
ms.author: wesmc
ms.date: 11/08/2018
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps 
ms.custom: mvc
---

# Quickstart: Create and provision a simulated TPM device using C# device SDK for IoT Hub Device Provisioning Service

[!INCLUDE [iot-dps-selector-quick-create-simulated-device-tpm](../../includes/iot-dps-selector-quick-create-simulated-device-tpm.md)]

These steps show you how to use the [Azure IoT Samples for C#](https://github.com/Azure-Samples/azure-iot-samples-csharp) to simulate a TPM device on a development machine running the Windows OS. The sample also connects the simulated device to an IoT Hub using the Device Provisioning Service. 

The sample code uses the Windows TPM simulator as the [Hardware Security Module (HSM)](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/) of the device. 

If you're unfamiliar with the process of autoprovisioning, review the [provisioning](about-iot-dps.md#provisioning-process) overview. Also make sure you've completed the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before continuing. 

The Azure IoT Device Provisioning Service supports two types of enrollments:

- [Enrollment groups](concepts-service.md#enrollment-group): Used to enroll multiple related devices.
- [Individual Enrollments](concepts-service.md#individual-enrollment): Used to enroll a single device.

This article will demonstrate individual enrollments.

[!INCLUDE [IoT Device Provisioning Service basic](../../includes/iot-dps-basic.md)]

<a id="setupdevbox"></a>
## Prepare the development environment 

1. Make sure you have the [.NET Core 2.1 SDK or later](https://dotnet.microsoft.com/download) installed on your machine. 

1. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes the **Git Bash**, the command-line app that you can use to interact with your local Git repository. 

1. Open a command prompt or Git Bash. Clone the Azure IoT Samples for C# GitHub repo:

    ```cmd
    git clone https://github.com/Azure-Samples/azure-iot-samples-csharp.git
    ```

## Provision the simulated device

1. Sign in to the Azure portal. Select the **All resources** button on the left-hand menu and open your Device Provisioning service. From the **Overview** blade, note the **_ID Scope_** value.

    ![Copy provisioning service Scope ID from the portal blade](./media/quick-create-simulated-device-tpm-csharp/copy-scope.png) 

1. In a command prompt, change directories to the project directory for the TPM device provisioning sample.

    ```cmd
    cd .\azure-iot-samples-csharp\provisioning\Samples\device\TpmSample
    ```

1. Type the following command to build and run the TPM device provisioning sample. Replace the `<IDScope>` value with the ID Scope for your provisioning service. 

    ```cmd
    dotnet run <IDScope>
    ```

    This command will launch the TPM chip simulator in a separate command prompt. On Windows, you may encounter a Windows Security Alert that asks whether you want to allow Simulator.exe to communicate on public networks. For the purposes of this sample, you may cancel the request.

1. The original command window displays the **_Endorsement key_**,  the **_Registration ID_**, and a suggested **_Device ID_** needed for device enrollment. Take note of these values. You will use these value to create an individual enrollment in your Device Provisioning Service instance. 
   > [!NOTE]
   > Do not confuse the window that contains command output with the window that contains output from the TPM simulator. You may have to select the original command window to bring it to the foreground.

    ![Command window output](./media/quick-create-simulated-device-tpm-csharp/output1.png) 

1. In the Azure portal, from the Device Provisioning Service menu, select **Manage enrollments**. Select the **Individual Enrollments** tab and select the **Add individual enrollment** button at the top. 

1. In the **Add Enrollment** panel, enter the following information:
   - Select **TPM** as the identity attestation *Mechanism*.
   - Enter the *Registration ID* and *Endorsement key* for your TPM device from the values you noted previously.
   - Select an IoT hub linked with your provisioning service.
   - Optionally, you may provide the following information:
       - Enter a unique *Device ID* (you can use the suggested one or provide your own). Make sure to avoid sensitive data while naming your device. If you choose not to provide one, the registration ID will be used to identify the device instead.
       - Update the **Initial device twin state** with the desired initial configuration for the device.
   - Once complete, press the **Save** button. 

     ![Enter device enrollment information in the portal blade](./media/quick-create-simulated-device-tpm-csharp/enterdevice-enrollment.png)  

   On successful enrollment, the *Registration ID* of your device will appear in the list under the *Individual Enrollments* tab. 

1. Press *Enter* in the command window (the one that displayed the **_Endorsement key_**, **_Registration ID_**, and suggested **_Device ID_**)  to enroll the simulated device. Notice the messages that simulate the device booting and connecting to the Device Provisioning Service to get your IoT hub information. 

1. Verify that the device has been provisioned. On successful provisioning of the simulated device to the IoT hub linked with your provisioning service, the device ID appears on the hub's **IoT devices** blade. 

    ![Device is registered with the IoT hub](./media/quick-create-simulated-device-tpm-csharp/hub_registration.png) 

    If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following steps to delete all resources created by this quickstart.

1. Close the device client sample output window on your machine.
1. Close the TPM simulator window on your machine.
1. From the left-hand menu in the Azure portal, select **All resources** and then select your Device Provisioning service. At the top of the **Overview** blade, press **Delete** at the top of the pane.  
1. From the left-hand menu in the Azure portal, select **All resources** and then select your IoT hub. At the top of the **Overview** blade, press **Delete** at the top of the pane.  

## Next steps

In this quickstart, you’ve created a TPM simulated device on your machine and provisioned it to your IoT hub using the IoT Hub Device Provisioning Service. To learn how to enroll your TPM device programmatically, continue to the quickstart for programmatic enrollment of a TPM device. 

> [!div class="nextstepaction"]
> [Azure quickstart - Enroll TPM device to Azure IoT Hub Device Provisioning Service](quick-enroll-device-tpm-csharp.md)
