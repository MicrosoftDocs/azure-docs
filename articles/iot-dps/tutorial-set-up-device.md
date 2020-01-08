---
title: 'Tutorial - Set up device for the Azure IoT Hub Device Provisioning Service'
description: 'This tutorial shows how you can set up device to provision via the IoT Hub Device Provisioning Service (DPS) during the device manufacturing process'
author: wesmc7777
ms.author: wesmc
ms.date: 11/12/2019
ms.topic: tutorial
ms.service: iot-dps
services: iot-dps
manager: philmea
ms.custom: mvc
---

# Tutorial: Set up a device to provision using the Azure IoT Hub Device Provisioning Service

In the previous tutorial, you learned how to set up the Azure IoT Hub Device Provisioning Service to automatically provision your devices to your IoT hub. This tutorial shows you how to set up your device during the manufacturing process, enabling it to be auto-provisioned with IoT Hub. Your device is provisioned based on its [Attestation mechanism](concepts-device.md#attestation-mechanism), upon first boot and connection to the provisioning service. This tutorial covers the following tasks:

> [!div class="checklist"]
> * Build platform-specific Device Provisioning Services Client SDK
> * Extract the security artifacts
> * Create the device registration software

This tutorial expects that you have already created your Device Provisioning Service instance and an IoT hub, using the instructions in the previous [Set up cloud resources](tutorial-set-up-cloud.md) tutorial.

This tutorial uses the [Azure IoT SDKs and libraries for C repository](https://github.com/Azure/azure-iot-sdk-c), which contains the Device Provisioning Service Client SDK for C. The SDK currently provides TPM and X.509 support for devices running on Windows or Ubuntu implementations. This tutorial is based on use of a Windows development client, which also assumes basic proficiency with Visual Studio. 

If you're unfamiliar with the process of auto-provisioning, be sure to review [Auto-provisioning concepts](concepts-auto-provisioning.md) before continuing. 


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

The following prerequisites are for a Windows development environment. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

* [Visual Studio](https://visualstudio.microsoft.com/vs/) 2019 with the ['Desktop development with C++'](https://docs.microsoft.com/cpp/?view=vs-2019#pivot=workloads) workload enabled. Visual Studio 2015 and Visual Studio 2017 are also supported.

* Latest version of [Git](https://git-scm.com/download/) installed.

## Build a platform-specific version of the SDK

The Device Provisioning Service Client SDK helps you implement your device registration software. But before you can use it, you need to build a version of the SDK specific to your development client platform and attestation mechanism. In this tutorial, you build an SDK that uses Visual Studio on a Windows development platform, for a supported type of attestation:

1. Download the [CMake build system](https://cmake.org/download/).

    It is important that the Visual Studio prerequisites (Visual Studio and the 'Desktop development with C++' workload) are installed on your machine, **before** starting the `CMake` installation. Once the prerequisites are in place, and the download is verified, install the CMake build system.

2. Find the tag name for the [latest release](https://github.com/Azure/azure-iot-sdk-c/releases/latest) of the SDK.

3. Open a command prompt or Git Bash shell. Run the following commands to clone the latest release of the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository. Use the tag you found in the previous step as the value for the `-b` parameter:

    ```cmd/sh
    git clone -b <release-tag> https://github.com/Azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    git submodule update --init
    ```

    You should expect this operation to take several minutes to complete.

4. Create a `cmake` subdirectory in the root directory of the git repository, and navigate to that folder. Run the following commands from the `azure-iot-sdk-c` directory:

    ```cmd/sh
    mkdir cmake
    cd cmake
    ```

5. Build the SDK for your development platform based on the attestation mechanisms you will be using. Use one of the following commands (also note the two trailing period characters for each command). Upon completion, CMake builds out the `/cmake` subdirectory with content specific to your device:
 
    - For devices that use the TPM simulator for attestation:

        ```cmd/sh
        cmake -Duse_prov_client:BOOL=ON -Duse_tpm_simulator:BOOL=ON ..
        ```

    - For any other device (physical TPM/HSM/X.509, or a simulated X.509 certificate):

        ```cmd/sh
        cmake -Duse_prov_client:BOOL=ON ..
        ```


Now you're ready to use the SDK to build your device registration code. 
 
<a id="extractsecurity"></a> 

## Extract the security artifacts 

The next step is to extract the security artifacts for the attestation mechanism used by your device. 

### Physical devices 

Depending on whether you built the SDK to use attestation for a physical TPM/HSM or using X.509 certificates, gathering the security artifacts is as follows:

- For a TPM device, you need to determine the **Endorsement Key** associated with it from the TPM chip manufacturer. You can derive a unique **Registration ID** for your TPM device by hashing the endorsement key.  

- For an X.509 device, you need to obtain the certificates issued to your device(s). The provisioning service exposes two types of enrollment entries that control access for devices using the X.509 attestation mechanism. The certificates needed depend on the enrollment types you will be using.

    - Individual enrollments: Enrollment for a specific single device. This type of enrollment entry requires [end-entity, "leaf", certificates](concepts-security.md#end-entity-leaf-certificate).
    
    - Enrollment groups: This type of enrollment entry requires intermediate or root certificates. For more information, see [Controlling device access to the provisioning service with X.509 certificates](concepts-security.md#controlling-device-access-to-the-provisioning-service-with-x509-certificates).

### Simulated devices

Depending on whether you built the SDK to use attestation for a simulated device using TPM or X.509 certificates, gathering the security artifacts is as follows:

- For a simulated TPM device:

   1. Open a Windows Command Prompt, navigate to the `azure-iot-sdk-c` subdirectory, and run the TPM simulator. It listens over a socket on ports 2321 and 2322. Do not close this command window; you will need to keep this simulator running until the end of the following Quickstart. 

      From the `azure-iot-sdk-c` subdirectory, run the following command to start the simulator:

      ```cmd/sh
      .\provisioning_client\deps\utpm\tools\tpm_simulator\Simulator.exe
      ```

      > [!NOTE]
      > If you use the Git Bash command prompt for this step, you'll need to change the backslashes to forward slashes, for example: `./provisioning_client/deps/utpm/tools/tpm_simulator/Simulator.exe`.

   1. Using Visual Studio, open the solution generated in the *cmake* folder named `azure_iot_sdks.sln`, and build it using the "Build solution" command on the "Build" menu.

   1. In the *Solution Explorer* pane in Visual Studio, navigate to the folder **Provision\_Tools**. Right-click the **tpm_device_provision** project and select **Set as Startup Project**. 

   1. Run the solution using either of the "Start" commands on the "Debug" menu. The output window displays the TPM simulator's **_Registration ID_** and the **_Endorsement Key_**, needed for device enrollment and registration. Copy these values for use later. You can close this window (with Registration ID and Endorsement Key), but leave the TPM simulator window running that you started in step #1.

- For a simulated X.509 device:

  1. Using Visual Studio, open the solution generated in the *cmake* folder named `azure_iot_sdks.sln`, and build it using the "Build solution" command on the "Build" menu.

  1. In the *Solution Explorer* pane in Visual Studio, navigate to the folder **Provision\_Tools**. Right-click the **dice\_device\_enrollment** project and select **Set as Startup Project**. 
  
  1. Run the solution using either of the "Start" commands on the "Debug" menu. In the output window, enter **i** for individual enrollment when prompted. The output window displays a locally generated X.509 certificate for your simulated device. Copy to clipboard the output starting from *-----BEGIN CERTIFICATE-----* and ending at the first *-----END CERTIFICATE-----*, making sure to include both of these lines as well. You only need the first certificate from the output window.
 
  1. Create a file named **_X509testcert.pem_**, open it in a text editor of your choice, and copy the clipboard contents to this file. Save the file as you will use it later for device enrollment. When your registration software runs, it uses the same certificate during auto-provisioning.    

These security artifacts are required during enrollment your device to the Device Provisioning Service. The provisioning service waits for the device to boot and connect with it at any later point in time. When your device boots for the first time, the client SDK logic interacts with your chip (or simulator) to extract the security artifacts from the device, and verifies registration with your Device Provisioning service. 

## Create the device registration software

The last step is to write a registration application that uses the Device Provisioning Service client SDK to register the device with the IoT Hub service. 

> [!NOTE]
> For this step we will assume the use of a simulated device, accomplished by running an SDK sample registration application from your workstation. However, the same concepts apply if you are building a registration application for deployment to a physical device. 

1. In the Azure portal, select the **Overview** blade for your Device Provisioning service and copy the **_ID Scope_** value. The *ID Scope* is generated by the service and guarantees uniqueness. It is immutable and used to uniquely identify the registration IDs.

    ![Extract Device Provisioning Service endpoint information from the portal blade](./media/tutorial-set-up-device/extract-dps-endpoints.png) 

1. In the Visual Studio *Solution Explorer* on your machine, navigate to the folder **Provision\_Samples**. Select the sample project named **prov\_dev\_client\_sample** and open the source file **prov\_dev\_client\_sample.c**.

1. Assign the _ID Scope_ value obtained in step #1, to the `id_scope` variable (removing the left/`[` and right/`]` brackets): 

    ```c
    static const char* global_prov_uri = "global.azure-devices-provisioning.net";
    static const char* id_scope = "[ID Scope]";
    ```

    For reference, the `global_prov_uri` variable, which allows the IoT Hub client registration API `IoTHubClient_LL_CreateFromDeviceAuth` to connect with the designated Device Provisioning Service instance.

1. In the **main()** function in the same file, comment/uncomment the `hsm_type` variable that matches the attestation mechanism being used by your device's registration software (TPM or X.509): 

    ```c
    hsm_type = SECURE_DEVICE_TYPE_TPM;
    //hsm_type = SECURE_DEVICE_TYPE_X509;
    ```

1. Save your changes and rebuild the **prov\_dev\_client\_sample** sample by selecting "Build solution" from the "Build" menu. 

1. Right-click the **prov\_dev\_client\_sample** project under the **Provision\_Samples** folder, and select **Set as Startup Project**. DO NOT run the sample application yet.

> [!IMPORTANT]
> Do not run/start the device yet! You need to finish the process by enrolling the device with the Device Provisioning Service first, before starting the device. The Next steps section below will guide you to the next article.

### SDK APIs used during registration (for reference only)

For reference, the SDK provides the following APIs for your application to use during registration. These APIs help your device connect and register with the Device Provisioning Service when it boots up. In return, your device receives the information required to establish a connection to your IoT Hub instance:

```C
// Creates a Provisioning Client for communications with the Device Provisioning Client Service.  
PROV_DEVICE_LL_HANDLE Prov_Device_LL_Create(const char* uri, const char* scope_id, PROV_DEVICE_TRANSPORT_PROVIDER_FUNCTION protocol)

// Disposes of resources allocated by the provisioning Client.
void Prov_Device_LL_Destroy(PROV_DEVICE_LL_HANDLE handle)

// Asynchronous call initiates the registration of a device.
PROV_DEVICE_RESULT Prov_Device_LL_Register_Device(PROV_DEVICE_LL_HANDLE handle, PROV_DEVICE_CLIENT_REGISTER_DEVICE_CALLBACK register_callback, void* user_context, PROV_DEVICE_CLIENT_REGISTER_STATUS_CALLBACK reg_status_cb, void* status_user_ctext)

// Api to be called by user when work (registering device) can be done
void Prov_Device_LL_DoWork(PROV_DEVICE_LL_HANDLE handle)

// API sets a runtime option identified by parameter optionName to a value pointed to by value
PROV_DEVICE_RESULT Prov_Device_LL_SetOption(PROV_DEVICE_LL_HANDLE handle, const char* optionName, const void* value)
```

You may also find that you need to refine your Device Provisioning Service client registration application, using a simulated device at first, and a test service setup. Once your application is working in the test environment, you can build it for your specific device and copy the executable to your device image. 

## Clean up resources

At this point, you might have the Device Provisioning and IoT Hub services running in the portal. If you wish to abandon the device provisioning setup, and/or delay completion of this tutorial series, we recommend shutting them down to avoid incurring unnecessary costs.

1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. At the top of the **All resources** blade, click **Delete**.  
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Build platform-specific Device Provisioning Service Client SDK
> * Extract the security artifacts
> * Create the device registration software

Advance to the next tutorial to learn how to provision the device to your IoT hub by enrolling it to the Azure IoT Hub Device Provisioning Service for auto-provisioning.

> [!div class="nextstepaction"]
> [Provision the device to your IoT hub](tutorial-provision-device-to-hub.md)
