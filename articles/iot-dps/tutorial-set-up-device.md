---
title: Set up device for the Azure IoT Hub Device Provisioning Service | Microsoft Docs
description: Set up device to provision via the IoT Hub Device Provisioning Service during the device manufacturing process
services: iot-dps
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 09/05/2017
ms.topic: tutorial
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Set up a device to provision using the Azure IoT Hub Device Provisioning Service

In the previous tutorial, you learned how to set up the Azure IoT Hub Device Provisioning Service to automatically provision your devices to your IoT hub. This tutorial provides guidance for setting up your device during the manufacturing process, so that you can configure the Device Provisioning Service for your device based on its [Hardware Security Module (HSM)](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security), and the device can connect to your Device Provisioning service when it boots for the first time. This tutorial discusses the processes to:

> [!div class="checklist"]
> * Select a Hardware Security Module
> * Build Device Provisioning Client SDK for the selected HSM
> * Extract the security artifacts
> * Set up the Device Provisioning Service configuration on the device

## Prerequisites

Before proceeding, create your Device Provisioning Service instance and an IoT hub using the instructions mentioned in the tutorial [Set up cloud for device provisioning](./tutorial-set-up-cloud.md).


## Select a Hardware Security Module

The [Device Provisioning Service client SDK](https://github.com/Azure/azure-iot-device-auth/tree/master/dps_client) provides support for two types of Hardware Security Modules (or HSMs): 

- [Trusted Platform Module (TPM)](https://en.wikipedia.org/wiki/Trusted_Platform_Module).
    - TPM is an established standard for most Windows-based device platforms, as well as a few Linux/Ubuntu based devices. As a device manufacturer, you may choose this HSM if you have either of these OSes running on your devices, and if you are looking for an established standard for HSMs. With TPM chips, you can only enroll each device individually to the Device Provisioning Service. For development purposes, you can use the TPM simulator on your Windows or Linux development machine.

- [X.509](https://cryptography.io/en/latest/x509/) based hardware security modules. 
    - X.509 based HSMs are relatively newer chips, with work currently progressing within Microsoft on RIoT or DICE chips which implement the X.509 certificates. With X.509 chips, you can do bulk enrollment in the portal. It also supports certain non-Windows OSes like embedOS. For development purpose, the Device Provisioning Service client SDK supports an X.509 device simulator. 

As a device manufacturer, you need to select hardware security modules/chips that are based on either one of the preceding types. Other types of HSMs are not currently supported in the Device Provisioning Service client SDK.   


## Build Device Provisioning Client SDK for the selected HSM

The Device Provisioning Service Client SDK helps implement the selected security mechanism in software. The following steps show how to use the SDK for the selected HSM chip:

1. If you followed the [Quickstart to create simulated device](./quick-create-simulated-device.md), you have the setup ready to build the SDK. If not, follow the first four steps from the section titled [Prepare the development environment](./quick-create-simulated-device.md#setupdevbox). These steps clone the GitHub repo for the Device Provisioning Service Client SDK as well as install the `cmake` build tool. 

1. Build the SDK for the type of HSM you have selected for your device, using either one of the following commands on the command prompt:
    - For TPM devices:
        ```cmd/sh
        cmake -Ddps_auth_type=tpm ..
        ```

    - For TPM simulator:
        ```cmd/sh
        cmake -Ddps_auth_type=tpm_simulator ..
        ```

    - For X.509 devices and simulator:
        ```cmd/sh
        cmake -Ddps_auth_type=x509 ..
        ```

1. The SDK provides default support for devices running Windows or Ubuntu implementations for TPM and X.509 HSMs. For these supported HSMs, proceed to the section titled [Extract the security artifacts](#extractsecurity) below. 
 
## Support custom TPM and X.509 devices

The Device Provisioning System Client SDK does not provide default support for any TPM and X.509 devices that do not run either Windows or Ubuntu. For such devices, you need to write the custom code for your particular HSM chip, as shown in the following steps:

### Develop your custom repository

1. Develop a GitHub repository to access your HSM. This project needs to produce a static library for the Device Provisioning SDK to consume.
1. Your library must implement the functions defined in the following header file:
    a. For custom TPM, implement functions defined in `\azure-iot-device-auth\dps_client\adapters\custom_hsm_tpm_impl.h`.
    b. For custom X.509, implement functions defined in `\azure-iot-device-auth\dps_client\adapters\custom_hsm_x509_impl.h`. 
1. Your HSM repository must also contain a `CMakeLists.txt` file at the root for the repository that should be built.

### Integrate with the Device Provisioning Service Client

Once your library successfully builds on its own, you can move to the IoThub C-SDK and pull in your repository:

1. Supply the custom HSM GitHub repository, the library path and its name in the following cmake command:
    ```cmd/sh
    cmake -Ddps_auth_type=<custom_hsm> -Ddps_hsm_custom_repo=<github_repo_name> -Ddps_hsm_custom_lib=<path_and_name_of library> <PATH_TO_AZURE_IOT_SDK>
    ```
   Replace the `<custom_hsm>` in this command with either `tpm` or `x509`. This command creates a marker for your custom HSM repository inside the `cmake` directory. Note that the custom HSM should still be based on either TPM or X.509 security mechanisms.

1. Open the SDK in visual studio and build it. 

    - The build process clones the custom repository and builds the library.
    - The SDK will attempt to link against the custom HSM defined in the cmake command.

1. Run the `\azure-iot-device-auth\dps_client\samples\dps_client_sample\dps_client_sample.c` sample to verify if your HSM is implemented correctly.

<a id="extractsecurity"></a>
## Extract the security artifacts

The next step is to extract the security artifacts for the HSM on your device.

1. For a TPM device, you will need to find out the **Endorsement Key** associated with it from the TPM chip manufacturer. You can derive a unique **Registration ID** for your TPM device by hashing the endorsement key. 
2. For an X.509 device, you will need to obtain the certificates issued to your device(s) - end-entity certificates for individual device enrollments, while root certificates for group enrollments of devices.

These security artifacts are required to enroll your devices to the Device Provisioning Service. The provisioning service then waits for any of these devices to boot and connect with it at any later point in time. See [How to manage device enrollments](how-to-manage-enrollments.md) for information on how to use these security artifacts to create enrollments. 

When your device boots for the first time, the client SDK interacts with your chip to extract the security artifacts from the device, and verifies registration with your Device Provisioning service. 


## Set up the Device Provisioning Service configuration on the device

The last step in the device manufacturing process is to write an application that uses the Device Provisioning Service client SDK to register the device with the service. This SDK provides the following APIs for your applications to use:

```C
typedef void(*DPS_REGISTER_DEVICE_CALLBACK)(DPS_RESULT register_result, const char* iothub_uri, const char* device_id, void* user_context); // Callback to notify user of device registration results.
DPS_CLIENT_LL_HANDLE DPS_Client_LL_Create (const char* dps_uri, const char* scope_id, DPS_TRANSPORT_PROVIDER_FUNCTION protocol, DPS_CLIENT_ON_ERROR_CALLBACK on_error_callback, void* user_ctx); // Creates the IOTHUB_DPS_LL_HANDLE to be used in subsequent calls.
void DPS_Client_LL_Destroy(DPS_CLIENT_LL_HANDLE handle); // Frees any resources created by the IoTHub Device Provisioning Service module.
DPS_RESULT DPS_LL_Register_Device(DPS_LL_HANDLE handle, DPS_REGISTER_DEVICE_CALLBACK register_callback, void* user_context, DPS_CLIENT_REGISTER_STATUS_CALLBACK status_cb, void* status_ctx); // Registers a device that has been previously registered with Device Provisioning Service
void DPS_Client_LL_DoWork(DPS_LL_HANDLE handle); // Processes the communications with the Device Provisioning Service and calls any user callbacks that are required.
```

Remember to initialize the variables `dps_uri` and `dps_scope_id` as mentioned in the [Simulate first boot sequence for the device section of this quick start](./quick-create-simulated-device.md#firstbootsequence), before using them. The Device Provisioning client registration API `DPS_Client_LL_Create` connects to the global Device Provisioning Service. The *ID Scope* is generated by the service and guarantees uniqueness. It is immutable and used to uniquely identify the registration IDs. The `iothub_uri` allows the IoT Hub client registration API `IoTHubClient_LL_CreateFromDeviceAuth` to connect with the right IoT hub. 


These APIs help your device to connect and register with the Device Provisioning Service when it boots up, get the information about your IoT hub and then connect to it. The file `dps_client/samples/dps_client_sample/dps_client_sample.c` shows how to use these APIs. In general, you need to create the following framework for the client registration:

```C
static const char* dps_uri = "global.azure-devices-provisioning.net";
static const char* dps_scope_id = "[ID scope for your provisioning service]";
...
static void register_callback(DPS_RESULT register_result, const char* iothub_uri, const char* device_id, void* context)
{
    USER_DEFINED_INFO* user_info = (USER_DEFINED_INFO *)user_context;
    ...
    user_info. reg_complete = 1;
}
static void registation_status(DPS_REGISTRATION_STATUS reg_status, void* user_context)
{
}
int main()
{
    ...    
    security_device_init(); // initialize your HSM 

    DPS_CLIENT_LL_HANDLE handle = DPS_Client_LL_Create(dps_uri, dps_scope_id, dps_transport, on_dps_error_callback, &user_info); // Create your DPS client

    if (DPS_Client_LL_Register_Device(handle, register_callback, &user_info, register_status, &user_info) == IOTHUB_DPS_OK) {
	    do {
   			// The dps_register_callback is called when registration is complete or fails
    		DPS_Client_LL_DoWork(handle);
	    } while (user_info.reg_complete == 0);
    }
    DPS_Client_LL_Destroy(handle); // Clean up the DPS client
    ...
    iothub_client = IoTHubClient_LL_CreateFromDeviceAuth(user_info.iothub_uri, user_info.device_id, transport); // Create your IoT hub client and connect to your hub
    ...
}
```

You may refine your Device Provisioning Service client registration application using a simulated device at first, using a test service setup. Once your application is working in the test environment, you can build it for your specific device and copy the executable to your device image. Do not start the device yet, you need to [enroll the device with the Device Provisioning Service](./tutorial-provision-device-to-hub.md#enrolldevice) before starting the device. See the next steps below to learn this process. 

## Clean up resources

At this point, you might have set up the Device Provisioning and IoT Hub services in the portal. If you wish to abandon the device provisioning setup, and/or delay using any of these services, we recommend shutting them down to avoid incurring unnecessary costs.

1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. At the top of the **All resources** blade, click **Delete**.  
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  


## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Select a Hardware Security Module
> * Build Device Provisioning Client SDK for the selected HSM
> * Extract the security artifacts
> * Set up the Device Provisioning Service configuration on the device

Advance to the next tutorial to learn how to provision the device to your IoT hub by enrolling it to the Azure IoT Hub Device Provisioning Service for auto-provisioning.

> [!div class="nextstepaction"]
> [Provision the device to your IoT hub](tutorial-provision-device-to-hub.md)

