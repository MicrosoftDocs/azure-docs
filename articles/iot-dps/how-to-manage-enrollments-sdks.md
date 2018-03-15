---
title: Manage device enrollments with Azure Device Provisioning Service SDKs | Microsoft Docs
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

# How to manage device enrollments with Azure Device Provisioning Service SDKs
A *device enrollment* creates a record of a single device or a group of devices that may at some point register with the Device Provisioning Service. The enrollment record contains the initial desired configuration for the device(s) as part of that enrollment, including the desired IoT hub. This article shows you how to manage device enrollments for your provisioning service programmatically using the Azure IoT Provisioning Service SDKs.  The SDKs are available on GitHub in the same repository as Azure IoT SDKs.

## Samples
This article reviews the high level concepts for managing device enrollments for your provisioning service programmatically using the Azure IoT Provisioning Service SDKs.  Exact API calls may be different due to language differences.  Please review the samples we provide on GitHub for details:
* [Java Provisioning Service Client samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/provisioning/provisioning-samples)
* [Node.js Provisioning Service Client samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/service/samples)
* [.NET Provisioning Service Client samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/provisioning/service/samples)

## Prerequisites
* Connection string from a Device Provisioning Service instance
* Device security artifacts:
    * [**TPM**](https://docs.microsoft.com/azure/iot-dps/concepts-security):
        * Individual enrollment: Registration ID and TPM Endorsement Key from a physical device or from TPM Simulator.
        * Enrollment group does not apply to TPM attestation.
    * [**X.509**](https://docs.microsoft.com/azure/iot-dps/concepts-security):
        * Individual enrollment: The [Leaf certificate](https://docs.microsoft.com/azure/iot-dps/concepts-security#leaf-certificate) from physical device or from DICE Emulator.
        * Enrollment group: The [root certificate](https://docs.microsoft.com/azure/iot-dps/concepts-security#root-certificate) or the [intermediate certificate](https://docs.microsoft.com/azure/iot-dps/concepts-security#intermediate-certificate), used to produce device certificate on a physical device.  It can also be generated from DICE Emulator.

## Create a device enrollment

There are two ways you can enroll your devices with the provisioning service:

* An **Enrollment group** is an entry for a group of devices that share a common attestation mechanism of X.509 certificates, signed by the [root certificate](https://docs.microsoft.com/azure/iot-dps/concepts-security#root-certificate) or the [intermediate certificate](https://docs.microsoft.com/azure/iot-dps/concepts-security#intermediate-certificate). We recommend using an enrollment group for a large number of devices which share a desired initial configuration, or for devices all going to the same tenant. Note that you can only enroll devices that use the X.509 attestation mechanism as *enrollment groups*. 

    You can create an enrollment group with the SDKs following this workflow:

    1. For enrollment group, the attestation mechanism uses X.509 root certificate.  Call Service SDK API ```X509Attestation.createFromRootCertificate``` with root certificate to create attestation for enrollment.  X.509 root certificate is provided in either a PEM file or as a string.
    1. Create a new ```EnrollmentGroup``` variable using the ```attestation``` created and a unique ```enrollmentGroupId```.  Optionally, you can set parameters like ```Device ID```, ```IoTHubHostName```, ```ProvisioningStatus```.
    2. Call Service SDK API ```createOrUpdateEnrollmentGroup``` in your backend application with ```EnrollmentGroup``` to create an enrollment group.

* An **Individual enrollment** is an entry for a single device that may register. Individual enrollments may use either X.509 certificates or SAS tokens (in a real or virtual TPM) as attestation mechanisms. We recommend using individual enrollments for devices which require unique initial configurations, or for devices which can only use SAS tokens via TPM or virtual TPM as the attestation mechanism. Individual enrollments may have the desired IoT hub device ID specified.

    You can create an individual enrollment with the SDKs following this workflow:
    
    1. Choose your ```attestation``` mechanism, which can be TPM or X.509.
        1. **TPM**: Using the Endorsement Key from a physical device or from TPM Simulator as the input, you can call Service SDK API ```TpmAttestation``` to create attestation for enrollment. 
        2. **X.509**:  Using the client certificate as the input, you can call Service SDK API ```X509Attestation.createFromClientCertificate``` to create attestation for enrollment.
    2. Create a new ```IndividualEnrollment``` variable with using the ```attestation``` created and a unique ```registrationId``` as input, which is on your device or generated from the TPM Simulator.  Optionally, you can set parameters like ```Device ID```, ```IoTHubHostName```, ```ProvisioningStatus```.
    3. Call Service SDK API ```createOrUpdateIndividualEnrollment``` in your backend application with ```IndividualEnrollment``` to create an individual enrollment.

After you have successfully created an enrollment, the Device Provisioning Service would return an enrollment result.

This workflow is demonstrated in the [samples](#samples).

## Update an enrollment entry

After you have created an enrollment entry, you may want to update the enrollment.  Potential scenarios include updating the desired property, updating the attestation method, or revoking device access.  There are different APIs for individual enrollment and group enrollment, but no distinction for attestation mechanism.

You can update an enrollment entry following this workflow:
* **Individual enrollment**:
    1. Get the latest enrollment from the provisioning service first with Service SDK API ```getIndividualEnrollment```.
    2. Modify the parameter of the latest enrollment as necessary. 
    3. Using the latest enrollment, call Service SDK API ```createOrUpdateIndividualEnrollment``` to update your enrollment entry.
* **Group enrollment**:
    1. Get the latest enrollment from the provisioning service first with Service SDK API ```getEnrollmentGroup```.
    2. Modify the parameter of the latest enrollment as necessary.
    3. Using the latest enrollment, call Service SDK API ```createOrUpdateEnrollmentGroup``` to update your enrollment entry.

This workflow is demonstrated in the [samples](#samples).

## Remove an enrollment entry

* **Individual enrollment** can be deleted by calling Service SDK API ```deleteIndividualEnrollment``` using ```registrationId```.
* **Group enrollment** can be deleted by calling Service SDK API ```deleteEnrollmentGroup``` using ```enrollmentGroupId```.

This workflow is demonstrated in the [samples](#samples).

## Bulk operation on individual enrollments

You can perform bulk operation to create, update, or remove multiple individual enrollments following this workflow:

1. Create a variable that contains multiple ```IndividualEnrollment```.  Implementation of this variable is different for every language.  Review the bulk operation sample on GitHub for details.
2. Call Service SDK API ```runBulkOperation``` with a ```BulkOperationMode``` for desired operation and your variable for individual enrollments. Four modes are supported: create, update, updateIfMatchEtag, and delete.

After you have successfully performed an operation, the Device Provisioning Service would return a bulk operation result.

This workflow is demonstrated in the [samples](#samples).
