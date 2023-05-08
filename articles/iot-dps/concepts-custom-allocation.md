---
title: Using custom allocation policies with Azure DPS
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Understand how custom allocation policies enable provisioning to multiple IoT hubs with the Azure IoT Hub Device Provisioning Service (DPS)
author: kgremban

ms.author: kgremban
ms.date: 09/09/2022
ms.topic: concept-article
ms.service: iot-dps
ms.custom: devx-track-csharp, devx-track-azurecli
---

# Understand custom allocation policies with Azure IoT Hub Device Provisioning Service

Custom allocation policies give you more control over how devices are assigned to your IoT hubs. By using custom allocation policies, you can define your own allocation policies when the built-in policies provided by the Device Provisioning Service (DPS) don't meet the requirements of your scenario.

For example, maybe you want to examine the certificate a device is using during provisioning and assign the device to an IoT hub based on a certificate property. Or, maybe you have information stored in a database for your devices and need to query the database to determine which IoT hub a device should be assigned to or how the device's initial twin should be set.

You implement a custom allocation policy in a webhook hosted in [Azure Functions](../azure-functions/functions-overview.md). You can then configure the webhook in one or more individual enrollments and enrollment groups. When a device registers through a configured enrollment entry, DPS calls the webhook which returns the IoT hub to register the device to and, optionally, the initial twin settings for the device and any information to be returned directly to the device.

## Overview

The following steps describe how custom allocation polices work:

1. A custom allocation developer develops a webhook that implements the intended allocation policy and deploys it as an HTTP Trigger function to Azure Functions. The webhook takes information about the DPS enrollment entry and the device and returns the IoT hub that the device should be registered to and, optionally, information about the device's initial state.

1. An IoT operator configures one or more individual enrollments and/or enrollment groups for custom allocation and provides calling details for the custom allocation webhook in Azure Functions.

1. When a device [registers](/rest/api/iot-dps/device/runtime-registration/register-device) through an enrollment entry configured for the custom allocation webhook, DPS sends a POST request to the webhook with the request body set to an **AllocationRequest** request object. The **AllocationRequest** object contains information about the device trying to provision and the individual enrollment or enrollment group it's provisioning through. The device information can include an optional custom payload sent from the device in its registration request. For more information, see [Custom allocation policy request](#custom-allocation-policy-request).

1. The Azure Function executes and returns an **AllocationResponse** object on success. The **AllocationResponse** object contains the IoT hub the device should be provisioned to, the initial twin state, and an optional custom payload to return to the device. For more information, see [Custom allocation policy response](#custom-allocation-policy-response).

1. DPS assigns the device to the IoT hub indicated in the response, and, if an initial twin is returned, sets the initial twin for the device accordingly. If a custom payload is returned by the webhook, it's passed to the device along with the assigned IoT hub and authentication details in the [registration response](/rest/api/iot-dps/device/runtime-registration/register-device#deviceregistrationresult) from DPS.

1. The device connects to the assigned IoT hub and downloads its initial twin state. If a custom payload is returned in the registration response, the device uses it according to its own client-side logic.  

The following sections provide more detail about the custom allocation request and response, custom payloads, and policy implementation. For a complete end-to-end example of a custom allocation policy, see [Use custom allocation policies](tutorial-custom-allocation-policies.md).

## Custom allocation policy request

DPS sends a POST request to your webhook on the following endpoint: `https://{your-function-app-name}.azurewebsites.net/api/{your-http-trigger}`

The request body is an **AllocationRequest** object:

| Property name | Description |
|---------------|-------------|
| individualEnrollment | An [individual enrollment record](/rest/api/iot-dps/service/individual-enrollment/get#individualenrollment) that contains properties associated with the individual enrollment that the allocation request originated from. Present if the device is registering through an individual enrollment. |
| enrollmentGroup | An [enrollment group record](/rest/api/iot-dps/service/enrollment-group/get#enrollmentgroup) that contains the properties associated with the enrollment group that the allocation request originated from. Present if the device is registering through an enrollment group. |
| deviceRuntimeContext | An object that contains properties associated with the device that is registering. Always present. |
| linkedHubs | An array that contains the hostnames of the IoT hubs that are linked to the enrollment entry that the allocation request originated from. The device may be assigned to any one of these IoT hubs. Always present. |

The **DeviceRuntimeContext** object has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| registrationId | string | The registration ID provided by the device at runtime. Always present. |
| currentIotHubHostName | string | The hostname of the IoT hub the device was previously assigned to (if any). Not present if this is an initial assignment. You can use this property to determine whether this is an initial assignment for the device or whether the device has been previously assigned. |
| currentDeviceId | string | The device ID from the device's previous assignment (if any). Not present if this is an initial assignment. |
| x509 | X509DeviceAttestation | For X.509 attestation, contains certificate details. |
| symmetricKey | SymmetricKeyAttestation | For symmetric key attestation, contains primary and secondary key details. |
| tpm | TpmAttestation | For TPM attestation, contains endorsement key and storage root key details. |
| payload | object | Contains properties specified by the device in the payload property during registration. Present if the device sends a custom payload in the DPS registration request. |

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
| initialTwin | Optional. An object that contains the desired properties and tags to set in the initial twin on the assigned IoT hub. DPS uses the initialTwin property to set the initial twin on the assigned IoT hub on initial assignment or when reprovisioning if the enrollment entry's migration policy is set to *Reprovision and reset to initial config*. In both of these cases, if the initialTwin is not returned or is set to null, DPS sets the twin on the assigned IoT hub to the initial twin settings in the enrollment entry. DPS ignores the initialTwin for all other reprovisioning settings in the enrollment entry. To learn more, see [Implementation details](#implementation-details). |
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

A device calls the [register](/rest/api/iot-dps/device/runtime-registration/register-device) API to register with DPS. The request can be enhanced with the optional **payload** property. This property can contain any valid JSON object. The exact contents will depend on the requirements of your solution.

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

If this isn't the initial registration for the device, then the runtime context will also include the **currentIoTHubHostname** and the **currentDeviceId** properties.

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

If DPS receives a payload in the webhook response, it passes this data back to the device in the **RegistrationOperationStatus.registrationState.payload** property in the response on a successful registration. The **registrationState** property is of type [DeviceRegistrationResult](/rest/api/iot-dps/device/runtime-registration/register-device#deviceregistrationresult).

The following JSON shows a successful registration response for a TPM device that includes the **payload** property:

```json
{
   "operationId":"5.316aac5bdc130deb.b1e02da8-xxxx-xxxx-xxxx-7ea7a6b7f550",
   "status":"assigned",
   "registrationState":{
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
}
```

## Implementation details

The custom allocation webhook can be called for a device that has not been previously registered through DPS (initial assignment) or for a device that has been previously registered through DPS (reprovisioning). DPS supports the following reprovisioning policies: *Reprovision and migrate data*, *Reprovision and reset to initial config*, and *Never reprovision*. These policies are applied whenever a previously provisioned device is assigned to a new IoT hub. For more details, see [Reprovisioning](concepts-device-reprovision.md).

The following points describe the requirements that your custom allocation webhook must observe and behavior that you should be aware of when designing your webhook:

* The device should be assigned to one of the IoT hubs in the **AllocationRequest.linkedHubs** property. This property contains the list of IoT hubs by hostname that the device can be assigned to. This is typically composed of the IoT hubs selected for the enrollment entry. If no IoT hubs are selected in the enrollment entry, it will contain all the IoT hubs linked to the DPS instance. Finally, if the device is reprovisioning and the *Never reprovision* policy is set on the enrollment entry, it will contain only the IoT hub that the device is currently assigned to.

* On initial assignment, if the **initialTwin** property is returned by the webhook, DPS will set the initial twin for the device on the assigned IoT hub accordingly. If the **initialTwin** property is omitted or is **null**, DPS sets the initial twin for the device to the initial twin setting specified in the enrollment entry.

* On reprovisioning, DPS follows the reprovisioning policy set in the enrollment entry. DPS only uses **initialTwin** property in the response if the current IoT hub is changed and the reprovisioning policy set on the enrollment entry is *Reprovision and reset to initial config*. In this case, DPS sets the initial twin for the device on the new IoT hub exactly as it would during initial assignment in the previous bullet. In all other cases, DPS ignores the **initialTwin** property.

* If the **payload** property is set in the response, DPS will always return it to the device regardless of whether the request is for initial assignment or reprovisioning.

* If a device has previously been provisioned to an IoT hub, the **AllocationRequest.deviceRuntimeContext** will contain a **currentIotHubHostName** property, which will be set to the hostname of the IoT hub where the device is currently assigned.

* You can determine which of the reprovisioning policies is currently set on the enrollment entry, by examining the **reprovisionPolicy** property of either the **AllocationRequest.individualEnrollment** or the **AllocationRequest.enrollmentGroup** property in the request. the following JSON shows the settings for the *Reprovision and migrate data* policy:

   ```json
         "reprovisionPolicy":{
            "updateHubAssignment":true,
            "migrateDeviceData":true
         }
   ```

## SDK support

The DPS device SDKs provide APIs in C, C#, Java, and Node.js to help you register devices with DPS. Both the IoT Hub SDKs and the DPS SDKs provide classes that represent device and service artifacts like device twins and enrollment entries that might be helpful when developing custom allocation webhooks. To learn more about the Azure IoT SDKs available for IoT Hub and IoT Hub Device Provisioning service, see [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md) and [Azure DPS SDKs](./libraries-sdks.md).

## Next steps

* For an end-to-end example using a custom allocation policy, see [Use custom allocation policies](tutorial-custom-allocation-policies.md)

* To learn more about Azure Functions, see the [Azure Functions documentation](../azure-functions/index.yml)
