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

Custom allocation policies give you more control over how devices are assigned to your IoT hubs. By using custom allocation policies, you can define your own allocation policies when the built-in policies provided by the Device Provisioning Service (DPS) don't meet the requirements of your scenario.

For example, maybe you want to examine the certificate a device is using during provisioning and assign the device to an IoT hub based on a certificate property. Or, maybe you have information stored in a database for your devices and need to query the database to determine which IoT hub a device should be assigned to or how the device's initial twin should be set.

You implement a custom allocation policy in a webhook hosted in [Azure Functions](../azure-functions/functions-overview.md). You can then configure the webhook in one or more individual enrollments and enrollment groups. When a device registers through a configured enrollment entry, DPS calls the webhook which returns the IoT hub to register the device to and, optionally, the initial twin settings for the device and any information to be returned directly to the device.

## Overview

The following steps describe how custom allocation polices work:

1. A custom allocation developer deploys an Azure Function that implements the intended allocation policy. The policy is implemented as an HTTP Trigger function. It takes information about the DPS enrollment entry and the device and returns the IoT hub that the device should be registered to and, optionally, information about the device's initial state. For details, see the following steps.

1. An IoT operator configures one or more individual enrollments and/or enrollment groups for custom allocation and provides details for the custom allocation Azure Function.

1. When a device registers through an enrollment entry configured for the custom allocation function, DPS sends a POST request to the Azure Function with the request body set to an **AllocationRequest** request object. The **AllocationRequest** object contains information about the device trying to provision and the individual enrollment or enrollment group it's provisioning through. The device information can include an optional custom payload sent from the device in its registration request. For more information, see [Custom allocation policy request](#custom-allocation-policy-request).

1. The Azure Function executes and returns an **AllocationResponse** object on success. The **AllocationResponse** object that contains the IoT hub the device should be provisioned to, the initial twin state, and an optional custom payload to return to the device. For more information, see [Custom allocation policy response](#custom-allocation-policy-response).

1. DPS assigns the device to the IoT hub indicated in the response, and, if an initial twin is returned, sets the initial twin for the device accordingly. If a custom payload is returned by the Azure function, it's passed to the device along with the assigned IoT hub and authentication details in the registration response from DPS.

1. The device connects to the assigned IoT hub and downloads its initial twin state. If a custom payload is returned in the registration response, the device uses it according to its own logic.  

The following sections provide more detail about the custom allocation request and response, custom payloads, and policy implementation. For a complete end-to-end example of a custom allocation policy, see [How to use custom allocation policies](how-to-use-custom-allocation-policies.md).

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
| registrationId | string | The registration ID provided by the device at runtime. Always present. |
| currentIotHubHostName | string | The hostname of the IoT hub the device was previously assigned to (if any). Not present if this is an initial assignment. You can use this property to determine whether this is an initial assignment for the device or whether the device has been previously assigned. |
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
| initialTwin | Optional. An object that contains the desired properties and tags for the initial twin. If an initial twin is returned, it sets the initial twin for the device, regardless of any settings in the enrollment entry. If the initial twin is not returned, the device twin is set to the initial twin settings in the enrollment on initial assignment or according to the migration settings in the enrollment on reprovisioning. |
| iotHubHostName | Required. The hostname of the IoT hub to assign the device to. This must be one of the IoT hubs passed in the **linkedHubs** property in the request. |
| payload | Optional. An object that contains data to be passed back to the device in the Registration response. The exact data will depend on the implicit contract defined by the developer between the device and the custom allocation function. |

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

A device calls the [register](/rest/api/iot-dps/device/runtime-registration/register-device) API to register with DPS. The request can be enhanced with the optional **pqyload** property. This property can contain any valid JSON object. The exact contents will depend on the requirements of your solution.

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

If a device includes a payload its registration request, DPS passes the payload in the **AllocationRequest.deviceRuntimeContext.payload** property when it calls the custom allocation webhook.

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

If this isn't the initial registration for the device then the runtime context will also include the **currentIoTHubHostname** and the **currentDeviceId** properties.

### Custom allocation webhook returns data to DPS

The custom allocation policy webhook can return data intended for a device to DPS in a JSON object using the **AllocationResponse.payload** property in the webhook response.

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
   },
   "payload": { "property1": "value1" } 
}
```

### DPS sends data payload to device

If DPS receives a payload in the webhook response, it passes this data back to the device in the **RegistrationOperationStatus.registrationState.payload** property in the response on a successful registration. **registrationState** property is of type [DeviceRegistrationResult](/rest/api/iot-dps/device/runtime-registration/register-device#deviceregistrationresult).

The following JSON shows a successful registration response for a TPM device that includes the **payload** property:

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

## Initial device assignment with custom allocation

If the custom webhook is being called on the initial assignment for a device, the **AllocationRequest.deviceRuntimeContext** won't contain a **currentIotHubHostName** property. In this case, for a successful registration, the **AllocationResponse.iotHubHostName** property must be set to one of the IoT hub hostnames present in the **AllocationRequest.linkedHubs** property.

## Re-provisioning policies with custom allocation

If a device has previously been provisioned to an IoT hub, the **AllocationRequest.deviceRuntimeContext** will contain a **currentIotHubHostName** property, which will be set to the hostname of the IoT hub where the device is currently assigned.

DPS has the following built-in re-provisioning polices: *Re-provision and migrate data*, *Re-provision and reset to initial config*, and *Never re-provision*. You can determine which of these policies is currently set on the enrollment entry, by examining the **reprovisionPolicy** property of either the **AllocationRequest.individualEnrollment** or the **AllocationRequest.enrollmentGroup** property. the following JSON shows the settings for the *Re-provision and migrate data* policy:

```json
      "reprovisionPolicy":{
         "updateHubAssignment":true,
         "migrateDeviceData":true
      }
```

You can choose whether or not to adhere to the re-provisioning policy specified in the enrollment entry. You can set the **iotHubHostName** property in the response to either the **AllocationRequest.deviceRuntimeContext.currentIotHubHostname** to keep the device on the same IoT hub or one of the IoT Hub hostnames in the **AllocationRequest.linkedHubs** array to assign a new IoT hub.

The initial twin of the device will be set as follows:

* If you set the **initialTwin** property in the response, the initial device twin on the new IoT hub will be set to this value.

* If you don't set the **initialTwin** property and **reprovisioningPolicy.migrateDeviceData** is **true** in the request, the current device twin state will be migrated from the current IoT hub to the new IoT hub.

* If you don't set the **initialTwin** property and **reprovisioningPolicy.migrateDeviceData** is **true** in the request, the device twin state will be set to the initial twin value in the enrollment entry.

> [!NOTE]
> To manually migrate your device data, you can call the [Get Twin](/rest/api/iothub/service/devices/get-twin) REST API or SDK equivalent on the current IoT hub to read the device twin and set the **initialTwin** property in the response.
