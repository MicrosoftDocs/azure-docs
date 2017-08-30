---
title: Set up device for IoT DPS | Microsoft Docs
description: Set up device to provision via IoT DPS during manufacturing process
services: iot-dps
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 08/23/2017
ms.topic: tutorial
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Set up a device to provision using Azure IoT DPS

In the previous tutorial, you learned how to set up the Azure IoT DPS to automatically provision your devices to your IoT hub. This tutorial provides guidance for setting up your device during the manufacturing process, so that you can configure the IoT DPS for your device based on its [Hardware Security Module (HSM)]https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/), and the device can connect to the IoT DPS when it boots for the first time. This tutorial discusses the processes to:

> [!div class="checklist"]
> * Select a Hardware Security Module
> * Implement security mechanism
> * Extract the security artifacts
> * Set up DPS configuration on the device

## Prerequisites

Before proceding, create your DPS and hub setup using the instructions mentioned in the tutorial [Set up cloud for DPS in portal](./tutorial-set-up-cloud.md).


## Select a Hardware Security Module

[Azure IoT DPS client SDK](https://github.com/Azure/azure-iot-device-auth/tree/master/dps_client) provides support for two types of Hardware Security Modules: 

- [Trusted Platform Module (TPM)](https://en.wikipedia.org/wiki/Trusted_Platform_Module).
    - TPM is an established standard for most Windows-based device platforms, as well as a few Linux/Ubuntu based devices. As a device manufacturer, you may choose this HSM if you have either of these OSes running on your devices, and if you are looking for an established standard for HSMs. With TPM chips, you can only enroll each device individually in DPS via the portal. For development purposes, you can use the TPM simulator on your Windows or Linux development machine.

- X.509 based hardware security modules. 
    - X.509 based HSMs are relatively newer chips, with work currently progressing within Microsoft on RIoT or DICE chips, which implement the X.509 certificates. With X.509 chips, you can do bulk enrollment in the portal. It also supports certain non-Windows OSes like embedOS. For development purpose, the DPS client SDK supports an X.509 device simulator. 

As a device manufacturer, you need to select hardware security modules/chips that are based on either one of the preceding types. Other types of HSMs are not currently supported in the DPS client SDK.   


## Implement security mechanism

The Azure DPS Client SDK helps implement the selected security mechanism in software. The following steps show how to use the SDK for the selected HSM chip:

1. If you followed the [Quick start to create simulated device](./quick-create-simulated-device.md), you have the setup ready to build the SDK. If not, follow the first four steps from the section titled [Prepare the development environment](./quick-create-simulated-device.md#setupdevbox). These steps clone the github repo for the DPS Client SDK as well as install the `cmake` build tool. 

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


<a id="extractsecurity"></a>
## Extract the security artifacts

Once you build the SDK for your selected HSM, make sure the following functions are implemented for your HSM chip. The interface for these APIs is found in the github repo folder `dps_client\adapters`.

- For TPM-based chips: 
   
    ```c
    SEC_DEVICE_HANDLE secure_dev_tpm_create();
    void secure_dev_tpm_destroy(SEC_DEVICE_HANDLE handle);
    char* secure_dev_tpm_get_endorsement_key(SEC_DEVICE_HANDLE handle); // Returns the endorsement key from the TPM.
    char* secure_dev_tpm_get_storage_key(SEC_DEVICE_HANDLE handle); // Returns the storage root key from the TPM.
    int secure_dev_tpm_import_key(SEC_DEVICE_HANDLE handle, const unsigned char* key, size_t key_len); // Import the device key into the device TPM.
    BUFFER_HANDLE secure_dev_tpm_sign_data(SEC_DEVICE_HANDLE handle, const unsigned char* data, size data_len); // Hash the supplied data using the imported device key to be used in the SAS Token.
    Const SEC_TPM_INTERFACE* secure_dev_tpm_interface();
    ```
  The SDK built for TPM simulator has default implementations for the same.

- For X.509-based chips: 

    ```c
    SEC_DEVICE_HANDLE secure_dev_riot_create();
    void secure_dev_riot_destroy(SEC_DEVICE_HANDLE handle);
    char* secure_dev_riot_get_certificate(SEC_DEVICE_HANDLE handle); // Returns the certificate produced by the X.509 system.
    char* secure_dev_riot_get_alias_key(SEC_DEVICE_HANDLE handle);// Returns the certificate public key
    char* secure_dev_riot_get_signer_cert(SEC_DEVICE_HANDLE, handle);// Returns the device signer certificate
    char* secure_dev_riot_get_common_name(SEC_DEVICE_HANDLE handle);// Returns the common name of the certificate
    const SEC_RIOT_INTERFACE* secure_device_riot_interface();
    ```
  The SDK built for X.509 flow has default implementations for the X.509 simulator.

These APIs interact with your chip to extract the security artifacts from the device after it boots. The DPS Client SDK uses these security artifacts for verifying registration with the DPS service.


## Set up DPS configuration on the device

The last step in the device manufacturing process is to write an application that will use the DPS client SDK to register the device with the DPS service. The DPS client incorporates the following APIs for your applications to use:

    ```c
    typedef void(*DPS_REGISTER_DEVICE_CALLBACK)(DPS_RESULT register_result, const char* iothub_uri, const char* device_id, void* user_context); // Callback to notify user of device registration results.
    DPS_CLIENT_LL_HANDLE DPS_Client_LL_Create (const char* dps_uri, const char* scope_id, DPS_TRANSPORT_PROVIDER_FUNCTION protocol, DPS_CLIENT_ON_ERROR_CALLBACK on_error_callback, void* user_ctx); // Creates the IOTHUB_DPS_LL_HANDLE to be used in subsequent calls.
    void DPS_Client_LL_Destroy(DPS_CLIENT_LL_HANDLE handle); // Frees any resources created by the IoTHub DPS module.
    DPS_RESULT DPS_LL_Register_Device(DPS_LL_HANDLE handle, DPS_REGISTER_DEVICE_CALLBACK register_callback, void* user_context, DPS_CLIENT_REGISTER_STATUS_CALLBACK status_cb, void* status_ctx); // Registers a device that has been previously registered with DPS
    void DPS_Client_LL_DoWork(DPS_LL_HANDLE handle); // Processes the communications with the DPS service and calls any user callbacks that are required.
    ```

Remember to initialize the variables `dps_uri` and `dps_scope_id` as mentioned in the [Simulate first boot sequence for the device section of this quick start](./quick-create-simulated-device.md#firstbootsequence) before using them. These *DPS URI* allows the DPS client registration API `DPS_Client_LL_Create` connect to the right DPS service. The *Scope ID* is generated by the DPS service and provides uniqueness guarantee. It is immutable and used to uniquely identify the registration IDs. Similarly, the `iothub_uri` allows the IoT Hub client registration API `IoTHubClient_LL_CreateFromDeviceAuth` to connect with the right IoT hub. 


These APIs help your device to connect and register with the DPS service when it boots up, get the information about your IoT hub and then connect to your IoT hub. The file `dps_client/samples/dps_client_sample/dps_client_sample.c` shows how to use these APIs. In general, you will need to create the following framework for the client registration:

    ```c
    static const char* dps_uri = "[device provisioning uri]";
    static const char* dps_scope_id = "[dps scope id]";
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
	    security_device_init(); // initialize your HSM here

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

You may choose to polish your DPS registration application using a simulated device at first, using a test DPS setup. Once your application is working in the test environment, you can build it for your specific device and copy the executable to your device image. Do not start the device yet, you will need to [enroll the device with the DPS service](./tutorial-provision-device-to-hub.md#enrolldevice) before starting the device. See the next steps below to learn this process. 

## Clean up resources

At this point, you might have set up the DPS and IoT Hub services in the portal. If you wish to abandon the DPS device provisioning setup, and/or delay using any of these services, we recommend shutting them down to avoid incurring unnecessary costs.

1. From the left-hand menu in the Azure portal, click **All resources** and then select your DPS service. At the top of the **All resources** blade, click **Delete**.  
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  


## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Select a Hardware Security Module
> * Implement security mechanism
> * Extract the security artifacts
> * Set up DPS configuration on the device

Advance to the next tutorial to learn how to provision the device to your IoT hub by enrolling it to IoT DPS for auto-provisioning.

> [!div class="nextstepaction"]
> [Provision the device to your IoT hub](tutorial-provision-device-to-hub.md)

