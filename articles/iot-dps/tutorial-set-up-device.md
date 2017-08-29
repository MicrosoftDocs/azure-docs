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

In the previous tutorial, you learned how to set up the Azure IoT DPS to automatically provision your devices to your IoT hub. This tutorial provides guidance for setting up your device during the manufacturing process, so that you can configure the IoT DPS for your device based on its [Hardware Security Module (HSM)]https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/), and the device can connect to the IoT DPS when it boots for the first time. Using a device simulator, this tutorial shows you how to:

> [!div class="checklist"]
> * Select a Hardware Security Module
> * Implement security mechanism
> * Extract the security artefacts
> * Set up DPS configuration on the device


## Select a Hardware Security Module

[Azure IoT DPS client SDK](https://github.com/Azure/azure-iot-device-auth/tree/master/dps_client) provides support for 2 types of Hardware Security Modules: 

- [Trusted Platform Module (TPM)](https://en.wikipedia.org/wiki/Trusted_Platform_Module) - This is an established standard for most Windows based device platforms, as well as a few Linux/Ubuntu based devices. As a device manufacturer, you may choose this if you have either of these OSes running on your devices, and if you are looking for an established standard for HSMs. Be aware that with TPM chips in your devices, you can only enroll each device individually in DPS via the portal. For development purposes, you can use the TPM simulator on your Windows or Linux development machine.

- X.509 based hardware security modules - This is a relatively newer form of hardware security modules, with work currently progressing within Microsoft on RIoT or DICE chips. With X.509 chips, you can do bulk enrollment in the portal. It also supports certain non-Windows OSes like embedOS. For development purpose, the DPS client SDK supports an X.509 device simulator.  

As a device manufacturer, you need to select hardware security modules/chips that are based on either one of the above types. Other types of HSMs are not currently supported in the DPS client SDK.   


## Implement security mechanism

The Azure DPS Client SDK helps implement the selected security mechanism in software by 

## Extract the security artefacts

Once you implement the security mechanism, you need to make sure the following functions are implemented for your HSM chip:

- For TPM based chips:
   
    ```code
    SEC_DEVICE_HANDLE secure_dev_tpm_create();
    void secure_dev_tpm_destroy(SEC_DEVICE_HANDLE handle);
    char* secure_dev_tpm_get_endorsement_key(SEC_DEVICE_HANDLE handle); // Returns the endorsement key from the TPM.
    char* secure_dev_tpm_get_storage_key(SEC_DEVICE_HANDLE handle); // Returns the storage root key from the TPM.
    int secure_dev_tpm_import_key(SEC_DEVICE_HANDLE handle, const unsigned char* key, size_t key_len); // Import the device key into the device TPM.
    BUFFER_HANDLE secure_dev_tpm_sign_data(SEC_DEVICE_HANDLE handle, const unsigned char* data, size data_len); // Hash the supplied data using the imported device key to be used in the SAS Token.
    Const SEC_TPM_INTERFACE* secure_dev_tpm_interface();
    ```

- For X.509 based chips:
    ```code
    SEC_DEVICE_HANDLE secure_dev_riot_create();
    void secure_dev_riot_destroy(SEC_DEVICE_HANDLE handle);
    char* secure_dev_riot_get_certificate(SEC_DEVICE_HANDLE handle); // Returns the certificate produced by the RIoT system.
    char* secure_dev_riot_get_alias_key(SEC_DEVICE_HANDLE handle);// Returns the certificate public key
    char* secure_dev_riot_get_signer_cert(SEC_DEVICE_HANDLE, handle);// Returns the device signer certificate
    char* secure_dev_riot_get_common_name(SEC_DEVICE_HANDLE handle);// Returns the common name of the certificate
    const SEC_RIOT_INTERFACE* secure_device_riot_interface();
    ```

These APIs interact with your chip to extract the security artefacts from the device after it boots, which will be then used for registration with DPS service.



## Set up DPS configuration on the device


## Clean up resources
<----! ToDo: Clean up or delete any Azure work that may incur costs --->

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Select a Hardware Security Module
> * Implement security mechanism
> * Extract the security artefacts
> * Set up DPS configuration on the device

Advance to the next tutorial to learn how to provision the device to your IoT hub by enrolling it to IoT DPS for auto-provisioning.

> [!div class="nextstepaction"]
> [Provision the device to your IoT hub](tutorial-provision-device-to-hub.md)


<---! ToDo: 
Rules for screenshots:
- Use default Public Portal colors
- Browser included in the first shot (especially) but all shots if possible
- Resize the browser to minimize white space
- Include complete blades in the screenshots
- Linux: Safari – consider context in images
Guidelines for outlining areas within screenshots:
	- Red outline #ef4836
	- 3px thick outline
	- Text should be vertically centered within the outline.
	- Length of outline should be dependent on where it sits within the screenshot. Make the shape fit the layout of the screenshot.
-->