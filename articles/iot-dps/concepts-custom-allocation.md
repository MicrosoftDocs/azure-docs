---
title: Using custom allocation policies with Azure IoT Hub Device Provisioning Service
description: Understand custom allocation policies with the Azure IoT Hub Device Provisioning Service (DPS)
author: kgremban
ms.author: kgremban
ms.date: 07/15/2022
ms.topic: conceptual
ms.service: iot-dps
services: iot-dps
ms.custom: devx-track-csharp, devx-track-azurecli
---

# Understand custom allocation policies with Azure IoT Hub Device Provisioning Service

Custom allocation policies give you more control over how devices are assigned to your IoT hubs. With custom allocation policies, you can define your own allocation policies when the built-in policies provided by the Device Provisioning Service (DPS) don't meet the requirements of your scenario.

For example, maybe you want to examine the certificate a device is using during provisioning and assign the device to an IoT hub based on a certificate property. Or, maybe you have information stored in a database for your devices and need to query the database to determine which IoT hub a device should be assigned to or how the device's initial twin should be set.

With custom allocation polices, you create an [Azure Function](../azure-functions/functions-overview.md) to assign devices to your IoT hubs. You register this function with one or more DPS enrollment entries, both enrollment groups and individual enrollments are supported. When a device registers with DPS through an enrollment that specifies a custom allocation policy, DPS calls your Azure Function code providing all relevant information about the device and the enrollment. Your function code is executed and returns the IoT hub information used to provisioning the device. This can include 

## Overview

The following list describes the basic steps with custom allocation polices:

1. Custom allocation developer deploys an Azure Function

## Custom allocation policy request

DPS sends a POST request to your Azure Function on the following endpoint: `https://{your-function-app-name}.azurewebsites.net/api/{your-http-trigger}`

The request body is an **AllocationRequest** object:

| Property name | Description |
|---------------|-------------|
| individualEnrollment | Contains properties associated with the individual enrollment that the allocation request originated from. |
| enrollmentGroup | Contains the properties associated with the enrollment group that the allocation request originated from. |
| deviceRuntimeContext | A context that contains properties associated with the device that is registering. |
| linkedHubs | An array that contains the hostnames of the IoT hubs that are linked to the enrollment entry that the allocation request originated from. The device may be assigned to any one of these IoT hubs. |

The **DeviceRuntimeContext** object has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| registrationId | string | the registration ID provided by the device at runtime. Always present. |
| currentIoTHubHostName | string | The hostname of the IoT hub the device was previously assigned to (if any). Not present if this is an initial assignment. |
| currentDeviceId | string | THe device ID from the device's previous assignment (if any). Not present if this is an initial assignment. |
| x509 | X509DeviceAttestation | For X.509 attestation, contains certificate details. |
| symmetricKey | SymmetricKeyAttestation | For symmetric key attestation, contains primary and secondary key details. |
| tpm | TpmAttestation | For TPM attestation, contains endorsement key and storage root key details. |
| payload | object | Contains properties specified by the device in the payload property during registration. |

The following JSON shows the **AllocationRequest** object sent by DPS for a device registering through a symmetric key based enrollment group.

```json
{
   "enrollmentGroup":{
      "enrollmentGroupId":"contoso-custom-allocated-devices",
      "attestation":{
         "type":"symmetricKey"
      },
      "capabilities":{
         "iotEdge":false
      },
      "etag":"\"13003fea-0000-0300-0000-62d1d5e50000\"",
      "provisioningStatus":"enabled",
      "reprovisionPolicy":{
         "updateHubAssignment":true,
         "migrateDeviceData":true
      },
      "createdDateTimeUtc":"2022-07-05T21:27:16.8123235Z",
      "lastUpdatedDateTimeUtc":"2022-07-15T21:02:29.5922255Z",
      "allocationPolicy":"custom",
      "iotHubs":[
         "custom-allocation-toasters-hub.azure-devices.net",
         "custom-allocation-heatpumps-hub.azure-devices.net"
      ],
      "customAllocationDefinition":{
         "webhookUrl":"https://custom-allocation-function-app-3.azurewebsites.net/api/HttpTrigger1?****",
         "apiVersion":"2021-10-01"
      }
   },
   "deviceRuntimeContext":{
      "registrationId":"breakroom499-contoso-tstrsd-007",
      "symmetricKey":{
         
      }
   },
   "linkedHubs":[
      "custom-allocation-toasters-hub.azure-devices.net",
      "custom-allocation-heatpumps-hub.azure-devices.net"
   ]
}
```

Because this is the initial registration for the device, the **deviceRuntimeContext** property contains only the registration ID and the authentication details for the device. The following JSON shows the **deviceRuntimeContext** for a subsequent call to register the same device. Notice that the current IoT Hub hostname and device ID are included in the request.

```json
{
   "deviceRuntimeContext":{
      "registrationId":"breakroom499-contoso-tstrsd-007",
      "currentIotHubHostName":"custom-allocation-toasters-hub.azure-devices.net",
      "currentDeviceId":"breakroom499-contoso-tstrsd-007",
      "symmetricKey":{
         
      }
   },
}
```

## Custom allocation policy response

A successful request returns an **AllocationResponse** object.

| Property | Description |
|----------|-------------|
| initialTwin | An object that contains the desired properties and tags for the initial twin. If an initial twin is returned, it will override any twin migration settings in the enrollment. |
| iotHubHostname | The hostname of the IoT hub to assign the device to. This must be one of the IoT hubs passed in the **linkedHubs** property in the request. |
| payload | An object that contains data to be passed back to the device in the Registration response. The exact data will depend on the implicit contract defined by the developer between the device and the custom allocation function. | 

The following JSON shows the **AllocationResponse** object returned by a custom allocation function to DPS for the example registration above.

```json
{
   "iotHubHostName":"custom-allocation-toasters-hub.azure-devices.net",
   "initialTwin":{
      "properties":{
         "desired":{
            "state":"ready",
            "darknessSetting":"medium"
         }
      },
      "tags":{
         "deviceType":"toaster"
      }
   }
}
```

## Use device payloads in custom allocation

Devices can send a custom payload that is passed by DPS to your custom allocation webhook, which can then use that data in its logic. The webhook may use this data in a number of ways, perhaps to determine which IoT hub to assign the device to, or to look up information in an external database that might be used to set properties on the initial twin. Conversely, your webhook can return data back to the device through DPS, which may be used in the device's client-side logic.

For example, you may want to allocate devices based on the device model. In this case, you can configure the device to report its model information in the request payload when it registers with DPS. DPS will pass this payload to the custom allocation webhook, which will determine which IoT hub the device will be provisioned to based on the device model information. If needed, the webhook can return data back to the DPS as a JSON object in the webhook response, and DPS will return this data to your device in the registration response.

### Device sends data payload to DPS

A device calls the [register](/rest/api/iot-dps/device/runtime-registration/register-device) API to register with DPS. The request can be enhanced with the optional `pqyload` property. This property can contain any valid JSON object. The exact contents will depend on the requirements of your solution.

For attestation with TPM, the request body looks like the following:

```json
{ 
    "registrationId": "mydevice", 
    "tpm": { 
        "endorsementKey": "xxxx-device-endorsement-key-xxxxx", 
        "storageRootKey": "xxxx-device-storage-root-key-xxxxx" 
    }, 
    "payload": { "property1": "value1", "property2": {"propertyA":"valueA", "property2-2":1234}, .. } 
} 
```

### DPS sends data payload to custom allocation webhook

If a device includes a payload its registration request, DPS passes the payload in the `AllocationRequest.deviceRuntimeContext.payload` property when it calls the custom allocation webhook.

For the TPM registration request in the previous section, the device runtime context will look like the following:

```json
{ 
    "registrationId": "mydevice", 
    "tpm": { 
        "endorsementKey": "xxxx-device-endorsement-key-xxxxx", 
        "storageRootKey": "xxxx-device-storage-root-key-xxxxx" 
    }, 
    "payload": { "property1": "value1", "property2": {"propertyA":"valueA", "property2-2":1234}, .. } 
} 
```

If this isn't the initial registration for the device then the runtime context will also include the `currentIoTHubHostname` and the `currentDeviceId` properties.

### Custom allocation webhook returns data to the DPS

The custom allocation policy webhook can return data intended for a device to DPS in a JSON object using the `AllocationResponse.payload` property in the webhook response.

The following JSON shows a webhook response that includes a payload:

```json
{
   "iotHubHostName":"custom-allocation-toasters-hub.azure-devices.net",
   "initialTwin":{
      "properties":{
         "desired":{
            "state":"ready",
            "darknessSetting":"medium"
         }
      },
      "tags":{
         "deviceType":"toaster"
      }
   }
      "payload": { "property1": "value1" } 
}
```

### DPS sends data payload to device

If DPS receives a payload in the webhook response, it passes this data back to the device in the `RegistrationOperationStatus.registrationState.payload` property in the response on a successful registration. `registrationState` property is of type [DeviceRegistrationResult](/rest/api/iot-dps/device/runtime-registration/register-device#deviceregistrationresult).

The following JSON shows a successful registration response for a TPM device that includes the payload property:

```json
{
    "assignedHub":"myIotHub",
    "createdDateTimeUtc" : "2022-08-01T22:57:47Z",	
    "deviceId" : "myDeviceId",
    "etag" : "xxxx-etag-value-xxxxx",
    "lastUpdatedDateTimeUtc" : "2022-08-01T22:57:47Z",
    "payload": { "property1": "value1" },
    "registrationId": "mydevice", 
    "status": assigned,
    "substatus": initialAssignment,
    "tpm": {"authenticationKey": "xxxx-encrypted-authentication-key-xxxxx"}
}
```
