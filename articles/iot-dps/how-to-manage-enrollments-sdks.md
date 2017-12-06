---
title: How to manage device enrollments in the IoT Hub Device Provisioning Service with the Service SDKs | Microsoft Docs
description: How to manage device enrollments in the IoT Hub Device Provisioning Service with the Service SDKs
services: iot-dps
keywords: 
author: yzhong94
ms.author: yizhon
ms.date: 12/01/2017
ms.topic: article
ms.service: iot-dps

documentationcenter: ''
manager: arjmands
ms.devlang: na
ms.custom: mvc
---

# How to manage device enrollments in the IoT Hub Device Provisioning Service with the Service SDKs
A *device enrollment* creates a record of a single device or a group of devices that may at some point register with the Device Provisioning Service. The enrollment record contains the initial desired configuration for the device(s) as part of that enrollment, including the desired IoT hub. This article shows you how to manage device enrollments for your provisioning service programmatically using the Azure IoT Provisioning Service SDKs.  The SDKs are available on GitHub in the same repository as Azure IoT SDKs. 

This article reviews the high level concepts for managing device enrollments for your provisioning service programmatically using the Azure IoT Provisioning Service SDKs.  Exact API calls may be different due to language differences.  Please review the samples we provide on GitHub for details:
* [Java Provisioning Service Client samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/provisioning/provisioning-samples)
* [Node.js Provisioning Service Client samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/service/samples)

## Prerequisites
* Connection string from a Device Provisioning Service instance
* **TPM**:
    * Registration ID and TPM Endorsement Key from a physical device or from TPM Simulator
* **X.509**:
    * Individual enrollment: Client certificate from physical device or from DICE Emulator
    * Enrollment Group: Signing certificate, which can be the [root certificate](https://docs.microsoft.com/en-us/azure/iot-dps/concepts-security#root-certificate) or the [intermediate certificate](https://docs.microsoft.com/en-us/azure/iot-dps/concepts-security#intermediate-certificate), used to produce device certificate on physical device.  It can be generated from DICE Emulator.

## Create a device enrollment

There are two ways you can enroll your devices with the provisioning service:

1. An **Enrollment group** is an entry for a group of devices that share a common attestation mechanism of X.509 certificates, signed by the same signing certificate. We recommend using an enrollment group for a large number of devices which share a desired initial configuration, or for devices all going to the same tenant. Note that you can only enroll devices that use the X.509 attestation mechanism as *enrollment groups*. 

    You can create an enrollment group with the SDKs following this workflow:

    1. For enrollment group, the attestation mechanism uses X.509 root certificate.  Call ```X509Attestation.createFromRootCertificate``` with root certificate to create attestation for enrollment.  X.509 root certificate is provided in either a PEM file or as a string.
    1. Create a new ```EnrollmentGroup``` using the ```attestation``` created and an unique ```enrollmentGroupId```.  Optionally, you can set parameters like ```Device ID```, ```IoTHubHostName```, ```ProvisioningStatus```.
    2. Call ```createOrUpdateEnrollmentGroup``` in your backend application with ```EnrollmentGroup``` to create an enrollment group.

2. An **Individual enrollment** is an entry for a single device that may register. Individual enrollments may use either X.509 certificates or SAS tokens (in a real or virtual TPM) as attestation mechanisms. We recommend using individual enrollments for devices which require unique initial configurations, or for devices which can only use SAS tokens via TPM or virtual TPM as the attestation mechanism. Individual enrollments may have the desired IoT hub device ID specified.

    You can create an individual enrollment with the SDKs following this workflow:
    
    1. Choose your ```attestation``` mechanism, which can be TPM or X.509.
        1. **TPM**: Using the Endorsement Key from a physical device or from TPM Simulator as the input, you can call ```TpmAttestation``` to create attestation for enrollment. 
        2. **X.509**:  Using the client certificate as the input, you can call ```X509Attestation.createFromClientCertificate``` to create attestation for enrollment.
    2. Create a new ```IndividualEnrollment``` with using the ```attestation``` created and an unique ```registrationId``` as input, which can be located on your device or from the TPM simulator.  Optionally, you can set parameters like ```Device ID```, ```IoTHubHostName```, ```ProvisioningStatus```.
    3. Call ```createOrUpdateIndividualEnrollment``` in your backend application with ```IndividualEnrollment``` to create an individual enrollment.

After you have successfully created an enrollment, the Device Provisioning Service would return an enrollment result.

## Update an enrollment entry

1. **Individual enrollment**:
    1. Get the latest enrollment from the provisioning service first with ```getIndividualEnrollment```.
    2. Modify the latest enrollment as necessary.
    3. Using the latest enrollment, call ```createOrUpdateIndividualEnrollment``` to update your enrollment entry.
2. **Group enrollment**:
    1. Get the latest enrollment from the provisioning service first with ```getEnrollmentGroup```.
    2. Modify the latest enrollment as necessary.
    3. Using the latest enrollment, call ```createOrUpdateEnrollmentGroup``` to update your enrollment entry.

## Remove an enrollment entry

1. **Individual enrollment** can be deleted by calling ```deleteIndividualEnrollment``` using ```registrationId```.
2. **Group enrollment** can be deleted by calling ```deleteEnrollmentGroup``` using ```enrollmentGroupId```.