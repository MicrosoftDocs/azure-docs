---
title: Set up device for the Azure IoT Hub Device Provisioning Service
description: Set up device to provision via the IoT Hub Device Provisioning Service during the device manufacturing process
services: iot-dps
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 03/28/2018
ms.topic: tutorial
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Set up a device to provision using the Azure IoT Hub Device Provisioning Service

In the previous tutorial, you learned how to set up the Azure IoT Hub Device Provisioning Service to automatically provision your devices to your IoT hub. This tutorial shows you how to set up your device during the manufacturing process, enabling it to be auto-provisioned with IoT Hub. Your device is provisioned based on its [Attestation mechanism](concepts-device.md#attestation-mechanism), upon first boot and connection to the provisioning service. This tutorial discusses the processes to:

> [!div class="checklist"]
> * Build platform-specific Device Provisioning Services Client SDK
> * Extract the security artifacts
> * Set up the Device Provisioning Service configuration on the device

## Prerequisites

Before proceeding, create your Device Provisioning Service instance and an IoT hub, using the instructions in the previous [1 - Set up cloud resources](./tutorial-set-up-cloud.md) tutorial.

This tutorial uses the [Azure IoT SDKs and libraries for C repository](https://github.com/Azure/azure-iot-sdk-c), which contains the Device Provisioning Service Client SDK for C. The SDK currently provides TPM and X.509 support for devices running on Windows or Ubuntu implementations. This tutorial is based on use of a Windows development client, which also assumes basic proficiency with Visual Studio 2017. 

If you're unfamiliar with the process of auto-provisioning, be sure to review [Auto-provisioning concepts](concepts-auto-provisioning.md) before continuing. 

## Build a platform-specific version of the SDK

The Device Provisioning Service Client SDK helps you implement your device registration software. But before you can use it, you need to build a version of the SDK specific to your development client platform and attestation mechanism. In this tutorial, you build an SDK that uses Visual Studio 2017 on a Windows development platform, for a supported type of attestation:

1. Install the required tools and clone the GitHub repository that contains the provisioning service Client SDK for C:

   a. Make sure you have either Visual Studio 2015 or [Visual Studio 2017](https://www.visualstudio.com/vs/) installed on your machine. You must have ['Desktop development with C++'](https://www.visualstudio.com/vs/support/selecting-workloads-visual-studio-2017/) workload enabled for your Visual Studio installation.

   b. Download and install the [CMake build system](https://cmake.org/download/). It is important that the Visual Studio with 'Desktop development with C++' workload is installed on your machine, **before** the CMake installation.

   c. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest `git` tools, including  **Git Bash**, a command-line Bash shell for interacting with your local Git repository. 

   d. Open Git Bash, and clone the "Azure IoT SDKs and libraries for C" repository. The clone command may take several minutes to complete, as it also downloads several dependant submodules:
    
   ```cmd/sh
   git clone https://github.com/Azure/azure-iot-sdk-c.git --recursive
   ```

   e. Create a new `cmake` subdirectory inside of the newly created repository subdirectory:

   ```cmd/sh
   mkdir azure-iot-sdk-c/cmake
   ``` 

2. From the Git Bash command prompt, change into the azure-iot-sdk-c repository's `cmake` subdirectory:

   ```cmd/sh
   cd azure-iot-sdk-c/cmake
   ```

3. Build the SDK for your development platform and one of the supported attestation mechanisms, using one of the following commands (also note the 2 trailing period characters). Upon completion, CMake builds out the `/cmake` subdirectory with content specific to your device:
    - For devices that use a physical TPM or X.509 certificate for attestation:
        ```cmd/sh
        cmake -Duse_prov_client:BOOL=ON ..
        ```

    - For devices that use the TPM simulator for attestation:
        ```cmd/sh
        cmake -Duse_prov_client:BOOL=ON -Duse_tpm_simulator:BOOL=ON ..
        ```

Now you're ready to use the SDK to build your device registration code. 

## Create the device registration software

The last step in the device manufacturing process is to write an application that uses the Device Provisioning Service client SDK to register the device with the service. 

This SDK provides the following APIs for your applications to use:

```C
// Creates a Provisioning Client for communications with the Device Provisioning Client Service
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

Remember to first initialize the `id_scope` constant and `hsm_type` variables as discussed in the [Simulate first boot sequence for the device section of this quick start](./quick-create-simulated-device.md#firstbootsequence). The Device Provisioning client registration API `Prov_Device_LL_Create` connects to the global Device Provisioning Service. The *ID Scope* is generated by the service and guarantees uniqueness. It is immutable and used to uniquely identify the registration IDs. The `iothub_uri` allows the IoT Hub client registration API `IoTHubClient_LL_CreateFromDeviceAuth` to connect with the right IoT hub. 

These APIs help your device connect and register with the Device Provisioning Service when it boots up. In return, your device receives the information required to establish a connection to your IoT Hub instance. The file [`provisioning_client/samples/prov_client_ll_sample/prov_client_ll_sample.c`](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning_client/samples/prov_dev_client_ll_sample/prov_dev_client_ll_sample.c) shows how to use these APIs. In general, you need to create the following framework for the client registration:

```C
static const char* global_uri = "global.azure-devices-provisioning.net";
static const char* id_scope = "[ID scope for your provisioning service]";
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
    SECURE_DEVICE_TYPE hsm_type;
    hsm_type = SECURE_DEVICE_TYPE_TPM;
    //hsm_type = SECURE_DEVICE_TYPE_X509;
    prov_dev_security_init(hsm_type); // initialize your HSM 

    prov_transport = Prov_Device_HTTP_Protocol;
    
    PROV_CLIENT_LL_HANDLE handle = Prov_Device_LL_Create(global_uri, id_scope, prov_transport); // Create your provisioning client

    if (Prov_Client_LL_Register_Device(handle, register_callback, &user_info, register_status, &user_info) == IOTHUB_DPS_OK) {
	    do {
   		// The register_callback is called when registration is complete or fails
    		Prov_Client_LL_DoWork(handle);
	    } while (user_info.reg_complete == 0);
    }
    Prov_Client_LL_Destroy(handle); // Clean up the Provisioning client
    ...
    iothub_client = IoTHubClient_LL_CreateFromDeviceAuth(user_info.iothub_uri, user_info.device_id, transport); // Create your IoT hub client and connect to your hub
    ...
}
```

You may refine your Device Provisioning Service client registration application using a simulated device at first, using a test service setup. Once your application is working in the test environment, you can build it for your specific device and copy the executable to your device image. 

> [!IMPORTANT]
> Do not start the device yet! You need to finish the process by enrolling the device with the Device Provisioning Service first, before starting the device. The Next steps section below will guide you to the next article.

## Clean up resources

At this point, you might have the Device Provisioning and IoT Hub services running in the portal. If you wish to abandon the device provisioning setup, and/or delay completion of this tutorial series, we recommend shutting them down to avoid incurring unnecessary costs.

1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. At the top of the **All resources** blade, click **Delete**.  
2. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  


## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Build platform-specific Device Provisioning Service Client SDK
> * Extract the security artifacts
> * Set up the Device Provisioning Service configuration on the device

Advance to the next tutorial to learn how to provision the device to your IoT hub by enrolling it to the Azure IoT Hub Device Provisioning Service for auto-provisioning.

> [!div class="nextstepaction"]
> [Provision the device to your IoT hub](tutorial-provision-device-to-hub.md)

