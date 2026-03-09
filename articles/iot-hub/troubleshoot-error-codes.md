---
title: Troubleshoot Azure IoT Hub Error Codes
description: Understand specific error codes and how to fix errors reported by Azure IoT Hub
author: cwatson-cat
ms.service: azure-iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/06/2026
ms.author: cwatson
ms.custom: [mqtt, iot]
ai-usage: ai-assisted
---

# Troubleshoot Azure IoT Hub error codes

This article describes the causes and solutions for common error codes that you might encounter while using IoT Hub.

## 400xxx Bad request errors

You might see that your requests to IoT Hub fail with an error that begins with **400**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
| **400000 GenericBadRequest** | A generic bad request error. | Check the request format and parameters. |
| **400001 InvalidProtocolVersion** | The protocol version specified in the request isn't supported. | Update the request to use a supported protocol version. |
| **400002 DeviceInvalidResultCount** | The number of results returned by the device is invalid. | Ensure the device returns the correct number of results. |
| **400003 InvalidOperation** | The operation requested isn't valid. | Verify the operation is supported for the device. |
| **400004 ArgumentInvalid** | One or more arguments in the request are invalid. | Check the request arguments for correctness. |
| **400005 ArgumentNull** | One or more required arguments are null. | Ensure all required arguments are provided. |
| **400006 IotHubFormatError** | The format of the request isn't valid. | Check the request format for correctness. |
| **400007 DeviceStorageEntitySerializationError** | The device storage entity couldn't be serialized or deserialized. | Verify the serialization format and data. |
| **400008 BlobContainerValidationError** | The blob container specified isn't valid. | Check the blob container name and permissions. |
| **400009 ImportWarningExistsError** | There is an existing import warning. | Review the import warnings and address them. |
| **400010 InvalidSchemaVersion** | The schema version specified isn't valid. | Update the schema version to a supported version. |
| **400011 DeviceDefinedMultipleTimes** | The device is defined multiple times. | Ensure the device is only defined once. |
| **400012 DeserializationError** | There was an error deserializing the request. | Check the request format and data for correctness. |
| **400013 BulkRegistryOperationFailure** | The bulk registry operation failed. | Review the bulk operation details and retry. |
| **400014 DefaultStorageEndpointNotConfigured** | The default storage endpoint isn't configured. | Configure the default storage endpoint. |
| **400015 InvalidFileUploadCorrelationId** | The file upload correlation ID isn't valid. | Check the file upload correlation ID for correctness. |
| **400016 ExpiredFileUploadCorrelationId** | The file upload correlation ID has expired. | Obtain a new file upload correlation ID. |
| **400017 InvalidStorageEndpoint** | The storage endpoint specified isn't valid. | Check the storage endpoint for correctness. |
| **400018 InvalidMessagingEndpoint** | The messaging endpoint specified isn't valid. | Check the messaging endpoint for correctness. |
| **400019 InvalidFileUploadCompletionStatus** | The file upload completion status isn't valid. | Check the file upload completion status for correctness. |
| **400020 InvalidStorageEndpointOrBlob** | When attempting to create a blob during file upload, the blob storage responds with either `Forbidden`, `Unauthorized`, `NotFound` or `BadRequest`. | Check the blob storage permissions and existence. |
| **400021 RequestCanceled** | The request was canceled. | Retry the request. |
| **400022 InvalidStorageEndpointProperty** | The storage endpoint property specified isn't valid. | Check the storage endpoint properties for correctness. |
| **400023 EtagDoesNotMatch** | The ETag specified in the request doesn't match the current ETag of the resource. | Update the ETag in the request to match the current ETag. |
| **400024 RequestTimedOut** | The request timed out. | Retry the request. |
| **400025 UnsupportedOperationOnReplica** | The operation isn't supported on the specified replica. | Review the operation and replica details. |
| **400026 NullMessage** | The message is null. | Ensure the message is not null. |
| **400027 ConnectionForcefullyClosedOnNewConnection** | Your device disconnects and reports `Communication_Error` as the `ConnectionStatusChangeReason` using .NET SDK and MQTT transport type. Either your device-to-cloud twin operation (such as read or patch reported properties) or direct method invocation fails with the error code `400027`. This error occurs when another client creates a new connection to IoT Hub using the same identity, so IoT Hub closes the previous connection. IoT Hub doesn't allow more than one client to connect using the same identity. | Ensure that each client connects to IoT Hub using its own identity. |
| **400028 InvalidDeviceScope** | The device scope specified isn't valid. | Check the device scope for correctness. |
| **400029 ConnectionForcefullyClosedOnFaultInjection** | Existing connections will be closed with this error during service and platform upgrades. Retries are expected to succeed immediately. | Retry the operation |
| **400030 ConnectionRejectedOnFaultInjection** | New connections and immediate retry attempts will be rejected with this error during service and platform upgrades. | Retry the operation |
| **400031 InvalidEndpointAuthenticationType** | The endpoint authentication type specified isn't valid. | Check the endpoint authentication type for correctness. |
| **400032 ManagedIdentityNotEnabled** | The managed identity isn't enabled. | Enable the managed identity. |
| **400035 InvalidPolicyKey** | The policy key specified isn't valid. | Check the policy key for correctness. |
| **400036 BulkRegenerateDeviceKeyOperationFailure** | The bulk regenerate device key operation failed. | Review the operation details. |

### 4001xx Routing errors

You might see that your requests to IoT Hub fail with an error that begins with **4001**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**400100 InvalidRouteTestInput**| The route test input specified isn't valid. | Check the route test input for correctness. |
|**400101 InvalidSourceOnRoute**| The source specified on the route isn't valid. | Check the source on the route for correctness. |
|**400102 RoutingNotEnabled**| Routing isn't enabled. | Enable routing. |
|**400103 InvalidContentEncodingOrType**| The content encoding or type specified isn't valid. | Check the content encoding or type for correctness. |

### 4003xx Modules errors

You might see that your requests to IoT Hub fail with an error that begins with **4003**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**400301 CannotRegisterModuleToModule**| Module-to-module communication isn't supported. | Use device-to-cloud or cloud-to-device communication instead. |
|**400302 TenantHubRoutingNotEnabled**| Tenant hub routing isn't enabled. | Enable tenant hub routing. |

### 4004xx Configurations errors

You might see that your requests to IoT Hub fail with an error that begins with **4004**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**400401 InvalidConfigurationTargetCondition**| The target condition specified in the configuration isn't valid. | Check the target condition for correctness. |
|**400402 InvalidConfigurationContent**| The content specified in the configuration isn't valid. | Check the configuration content for correctness. |
|**400403 CannotModifyImmutableConfigurationContent**| The configuration content is immutable and cannot be modified. | Create a new configuration instead. |
|**400404 InvalidConfigurationCustomMetricsQuery**| The custom metrics query specified in the configuration isn't valid. | Check the custom metrics query for correctness. |

### 4005xx Digital twin interfaces errors

You might see that your requests to IoT Hub fail with an error that begins with **4005**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**400501 InvalidPnPInterfaceDefinition**| The interface definition specified isn't valid. | Check the interface definition for correctness. |
|**400502 InvalidPnPDesiredProperties**| The desired properties specified aren't valid. | Check the desired properties for correctness. |
|**400503 InvalidPnPReportedProperties**| The reported properties specified aren't valid. | Check the reported properties for correctness. |
|**400504 InvalidPnPWritableReportedProperties**| The writable reported properties specified aren't valid. | Check the writable reported properties for correctness. |
|**400505 InvalidDigitalTwinJsonPatch**| The JSON patch specified for the digital twin isn't valid. | Check the JSON patch for correctness. |
|**400506 InvalidDigitalTwinPayload**| The payload specified for the digital twin isn't valid. | Check the digital twin payload for correctness. |
|**400507 InvalidDigitalTwinPatch**| The patch specified for the digital twin isn't valid. | Check the digital twin patch for correctness. |
|**400508 InvalidDigitalTwinPatchPath**| The patch path specified for the digital twin isn't valid. | Check the digital twin patch path for correctness. |

## 401xxx Unauthorized errors

You might see that your requests to IoT Hub fail with an error that begins with **401**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**401000 GenericUnauthorized**| The request isn't authorized. | Check the authorization credentials. |
|**401001 IotHubNotFound**| The specified IoT Hub wasn't found. | Check the IoT Hub name and region. |
|**401002 IotHubUnauthorizedAccess**| The request isn't authorized to access the IoT Hub. | Check the IoT Hub's access policies and permissions. |
|**401003 IotHubUnauthorized**| The request isn't authorized to access the IoT Hub. | See [401003 IotHubUnauthorized error](#401003-iothubunauthorized-error) for more information. |
|**401004 ElasticPoolNotFound**| The specified elastic pool wasn't found. | Check the elastic pool name and region. |
|**401100 SystemModuleModifyUnauthorizedAccess**| The system module isn't authorized to modify the resource. | Check the system module's permissions. |

### 401003 IotHubUnauthorized error

In logs, you might see a pattern of devices disconnecting with `401003 IoTHubUnauthorized`, followed by `404104 DeviceConnectionClosedRemotely`, and then successfully connecting shortly after.

Or, requests to IoT Hub fail with one of the following error messages:

* Authorization header missing
* IotHub '\*' does not contain the specified device '\*'
* Authorization rule '\*' does not allow access for '\*'
* Authentication failed for this device, renew token or certificate and reconnect
* Thumbprint does not match configuration: Thumbprint: SHA1Hash=\*, SHA2Hash=\*; Configuration: PrimaryThumbprint=\*, SecondaryThumbprint=\*
* Principal user@example.com is not authorized for GET on /exampleOperation due to no assigned permissions

This error occurs because, for MQTT, some SDKs rely on IoT Hub to issue the disconnect when the SAS token expires to know when to refresh it. So:

1. The SAS token expires
1. IoT Hub notices the expiration, and disconnects the device with `401003 IoTHubUnauthorized`
1. The device completes the disconnection with `404104 DeviceConnectionClosedRemotely`
1. The IoT SDK generates a new SAS token
1. The device reconnects with IoT Hub successfully

Or, IoT Hub couldn't authenticate the auth header, rule, or key. This result could be due to any of the reasons cited in the symptoms.

To resolve this error, no action is needed if using IoT SDK for connection using the device connection string. IoT SDK regenerates the new token to reconnect on SAS token expiration.

The default token lifespan is 60 minutes across SDKs; however, for some SDKs the token lifespan and the token renewal threshold is configurable. Additionally, the errors generated when a device disconnects and reconnects on token renewal differs for each SDK. To learn more, and for information about how to determine which SDK your device is using in logs, see the [MQTT device disconnect behavior with Azure IoT SDKs](iot-hub-troubleshoot-connectivity.md#mqtt-device-disconnect-behavior-with-azure-iot-sdks) section of [Monitor, diagnose, and troubleshoot Azure IoT Hub device connectivity](iot-hub-troubleshoot-connectivity.md).

For device developers, if the volume of errors is a concern, switch to the C SDK, which renews the SAS token before expiration. For AMQP, the SAS token can refresh without disconnection.

In general, the error message presented should explain how to fix the error. If for some reason you don't have access to the error message detail, make sure:

* The SAS or other security token you use isn't expired.
* For X.509 certificate authentication, the device certificate or the CA certificate associated with the device isn't expired. To learn how to register X.509 CA certificates with IoT Hub, see [Tutorial: Create and upload certificates for testing](tutorial-x509-test-certs.md).
* For X.509 certificate thumbprint authentication, the thumbprint of the device certificate is registered with IoT Hub.
* The authorization credential is well formed for the protocol that you use. To learn more, see [Control access to IoT Hub by using Microsoft Entra ID](authenticate-authorize-azure-ad.md).
* The authorization rule used has the permission for the operation requested.
* For the last error messages beginning with "principal...", this error can be resolved by assigning the correct level of Azure RBAC permission to the user. For example, an Owner on the IoT Hub can assign the "IoT Hub Data Owner" role, which gives all permissions. Try this role to resolve the lack of permission issue.

> [!NOTE]
> Some devices might experience a time drift issue when the device time has a difference from the server time that is greater than five minutes. This error can occur when a device has been connecting to an IoT hub without issues for weeks or even months but then starts to continually have its connection refused. The error can also be specific to a subset of devices connected to the IoT hub, since the time drift can happen at different rates depending upon when a device is first connected or turned on.
>
> Often, performing a time sync using NTP or rebooting the device (which can automatically perform a time sync during the boot sequence) fixes the issue and allows the device to connect again. To avoid this error, configure the device to perform a periodic time sync using NTP. You can schedule the sync for daily, weekly, or monthly depending on the amount of drift the device experiences. If you can't configure a periodic NTP sync on your device, then schedule a periodic reboot.

## 403xxx Forbidden errors

You might see that your requests to IoT Hub fail with an error that begins with **403**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**403000 GenericForbidden**| The request is forbidden. | Check the request permissions. |
|**403001 IotHubSuspended**| The IoT Hub is suspended. | Check the IoT Hub status. |
|**403002 IotHubQuotaExceeded**| The IoT Hub quota has been exceeded. | See [403002 IotHubQuotaExceeded error](#403002-iothubquotaexceeded-error) for more information. |
|**403003 JobQuotaExceeded**| The job quota has been exceeded. | Check the job quotas and limits. |
|**403004 DeviceMaximumQueueDepthExceeded**| The device maximum queue depth has been exceeded. | See [403004 DeviceMaximumQueueDepthExceeded error](#403004-devicemaximumqueuedepthexceeded-error) for more information. |
|**403005 IotHubMaxCbsTokenExceeded**| The IoT Hub maximum CBS token limit has been exceeded. | Check the IoT Hub CBS token limits. |
|**403006 DeviceMaximumActiveFileUploadLimitExceeded**| The device maximum active file upload limit has been exceeded. | See [403006 DeviceMaximumActiveFileUploadLimitExceeded error](#403006-devicemaximumactivefileuploadlimitexceeded-error) for more information. |
|**403007 DeviceMaximumQueueSizeExceeded**| The device maximum queue size has been exceeded. | Check the device queue size. |
|**403008 RoutingEndpointResponseForbidden**| The routing endpoint response is forbidden. | Check the routing endpoint permissions. |
|**403009 InvalidMessageExpiryTime**| The message expiry time is invalid. | Check the message expiry time settings. |
|**403010 OperationNotAvailableInCurrentTier**| The operation is not available in the current tier. | Check the IoT Hub tier and capabilities. |
|**403011 KeyEncryptionKeyRevoked**| The key encryption key has been revoked. | Check the key encryption key status. |
|**403012 DeviceDisabled**| The device has been disabled. | Check the device status. |
|**403800 DeviceMaximumInflightMethodExceeded**| The device maximum in-flight method limit has been exceeded. | Check the device in-flight method limits. |


### 403002 IotHubQuotaExceeded error

You might see requests to IoT Hub fail with the error `403002 IotHubQuotaExceeded`. And in Azure portal, the IoT hub device list doesn't load.

This error typically occurs when the daily message quota for the IoT hub is exceeded. To resolve this error:

* [Upgrade or increase the number of units on the IoT hub](iot-hub-upgrade.md) or wait for the next UTC day for the daily quota to refresh.
* To understand how operations are counted toward the quota, such as twin queries and direct methods, see the [Charges per operation](iot-hub-devguide-pricing.md#charges-per-operation) section of [Azure IoT Hub billing information](iot-hub-devguide-pricing.md).
* To set up monitoring for daily quota usage, set up an alert with the metric *Total number of messages used*. For step-by-step instructions, see the [Set up metrics](tutorial-use-metrics-and-diags.md#set-up-metrics) section of [Tutorial: Set up and use metrics and logs with an IoT hub](tutorial-use-metrics-and-diags.md).

A bulk import job might also return this error when the number of devices registered to your IoT hub approaches or exceeds the quota limit for an IoT hub. To learn more, see the [Troubleshoot import jobs](iot-hub-bulk-identity-mgmt.md#troubleshoot-import-jobs) section of [Import and export IoT Hub device identities in bulk](iot-hub-bulk-identity-mgmt.md).

### 403004 DeviceMaximumQueueDepthExceeded error

When trying to send a cloud-to-device message, you might see that the request fails with the error `403004` or `DeviceMaximumQueueDepthExceeded`.

The underlying cause of this error is that the number of messages enqueued for the device exceeds the [queue limit](iot-hub-devguide-quotas-throttling.md#other-limits).

The most likely reason that you're running into this limit is because you're using HTTPS to receive the message, which leads to continuous polling using `ReceiveAsync`, resulting in IoT Hub throttling the request.

The supported pattern for cloud-to-device messages with HTTPS is intermittently connected devices that check for messages infrequently (less than every 25 minutes). To reduce the likelihood of running into the queue limit, switch to AMQP or MQTT for cloud-to-device messages.

Alternatively, enhance device side logic to complete, reject, or abandon queued messages quickly, shorten the time to live, or consider sending fewer messages. For more information, see the [Message expiration (time to live)](./iot-hub-devguide-messages-c2d.md#message-expiration-time-to-live) section of [Understand cloud-to-device messaging from an IoT hub](./iot-hub-devguide-messages-c2d.md).

Lastly, consider using the [Purge Queue API](/rest/api/iothub/service/cloud-to-device-messages/purge-cloud-to-device-message-queue) to periodically clean up pending messages before the limit is reached.

### 403006 DeviceMaximumActiveFileUploadLimitExceeded error

You might see that your file upload request fails with the error code `403006` or `DeviceMaximumActiveFileUploadLimitExceeded` and a message "Number of active file upload requests cannot exceed 10".

This error occurs because each device client is limited for [concurrent file uploads](iot-hub-devguide-quotas-throttling.md#other-limits). You can easily exceed the limit if your device doesn't notify IoT Hub when file uploads are completed. An unreliable device side network commonly causes this problem.

To resolve this error, ensure that the device can promptly [notify IoT Hub file upload completion](iot-hub-devguide-file-upload.md#device-notify-iot-hub-of-a-completed-file-upload). Then, try [reducing the SAS token TTL for file upload configuration](iot-hub-configure-file-upload.md).

### 4031xx Device model forbidden errors

You might see that your requests to IoT Hub fail with an error that begins with **4031**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**403100 DeviceModelMaxPropertiesExceeded**| The device model maximum properties limit has been exceeded. | Check the device model properties. |
|**403101 DeviceModelMaxIndexablePropertiesExceeded**| The device model maximum indexable properties limit has been exceeded. | Check the device model indexable properties. |

## 404xxx NotFound errors

You might see that your requests to IoT Hub fail with an error that begins with **404**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**404000 GenericNotFound**| The requested resource isn't found. | Check the resource ID and try again. |
|**404001 DeviceNotFound**| The specified device isn't found. | See [404001 DeviceNotFound error](#404001-devicenotfound-error) for more information. |
|**404002 JobNotFound**| The specified job isn't found. | Check the job ID and try again. |
|**404004 QuotaMetricNotFound**| The specified quota metric isn't found. | Check the quota metric ID and try again. |
|**404005 SystemPropertyNotFound**| The specified system property isn't found. | Check the system property ID and try again. |
|**404006 AmqpAddressNotFound**| The specified AMQP address isn't found. | Check the AMQP address and try again. |
|**404007 RoutingEndpointResponseNotFound**| The specified routing endpoint response isn't found. | Check the routing endpoint and try again. |
|**404008 CertificateNotFound**| The specified certificate isn't found. | Check the certificate ID and try again. |
|**404009 ElasticPoolTenantHubNotFound**| The specified Elastic Pool Tenant Hub isn't found. | Check the Elastic Pool Tenant Hub ID and try again. |
|**404010 ModuleNotFound**| The specified module isn't found. | Check the module ID and try again. |
|**404011 AzureTableStoreNotFound**| The specified Azure Table Store isn't found. | Check the Azure Table Store ID and try again. |
|**404012 IotHubFailingOver**| The IoT Hub is failing over. | Check the IoT Hub status and try again. |
|**404013 FeatureNotSupported**| The requested feature isn't supported. | Check the feature documentation and try again. |
|**404014 DigitalTwinInterfaceNotFound**| The specified Digital Twin interface isn't found. | Check the Digital Twin interface ID and try again. |


### 404001 DeviceNotFound error

During a cloud-to-device (C2D) communication, such as C2D message, twin update, or direct method, you might see that the operation fails with error `404001 DeviceNotFound`.

The operation failed because IoT Hub can't find the device. The device either isn't registered or is disabled.

To resolve this error, register the device ID that you used, then try again.


### 4041xx Device model NotFound errors

You might see that your requests to IoT Hub fail with an error that begins with **4041**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**404101 QueryStoreClusterNotFound**| The specified query store cluster isn't found. | Check the query store cluster ID and try again. |
|**404102 DeviceNotOnline**| The specified device isn't online. | See [404103 DeviceNotOnline error](#404103-devicenotonline-error) for more information. |
|**404104 DeviceConnectionClosedRemotely**| The device connection was closed remotely. | See [404104 DeviceConnectionClosedRemotely error](#404104-deviceconnectionclosedremotely-error) for more information. |

### 404103 DeviceNotOnline error

You might see that a direct method to a device fails with the error `404103 DeviceNotOnline` even if the device is online.

If you know that the device is online and still get the error, then the error likely occurred because the direct method callback isn't registered on the device.

For more information about configuring your device properly for direct method callbacks, see the [Handle a direct method on a device](iot-hub-devguide-direct-methods.md#handle-a-direct-method-on-a-device) section of [Handle a direct method on a device](iot-hub-devguide-direct-methods.md).

### 404104 DeviceConnectionClosedRemotely error

You might see that devices disconnect at a regular interval (every 65 minutes, for example) and you see `404104 DeviceConnectionClosedRemotely` in IoT Hub resource logs. Sometimes, you also see `401003 IoTHubUnauthorized` and a successful device connection event less than a minute later.

Or, devices disconnect randomly, and you see `404104 DeviceConnectionClosedRemotely` in IoT Hub resource logs.

Or, many devices disconnect at once, you see a dip in the [Connected devices (connectedDeviceCount) metric](monitor-iot-hub-reference.md#metrics), and there are more `404104 DeviceConnectionClosedRemotely` and [500xxx Internal errors](#500xxx-internal-server-errors) in Azure Monitor Logs than usual.

This error can occur because the [SAS token used to connect to IoT Hub](iot-hub-dev-guide-sas.md#sas-tokens) expired, which causes IoT Hub to disconnect the device. The connection is re-established when the device refreshes the token. For example, [the SAS token expires every hour by default for C SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/connection_and_messaging_reliability.md#connection-authentication), which can lead to regular disconnects. To learn more, see [401003 IoTHubUnauthorized error](#401003-iothubunauthorized-error).

Some other possibilities include:

* The device lost underlying network connectivity longer than the [MQTT keep-alive](../iot/iot-mqtt-connect-to-iot-hub.md#default-keep-alive-time-out), resulting in a remote idle time-out. The MQTT keep-alive setting can be different per device.
* The device sent a TCP/IP-level reset but didn't send an application-level `MQTT DISCONNECT`. Basically, the device abruptly closed the underlying socket connection. Sometimes, bugs in older versions of the Azure IoT SDK might cause this issue.
* The device side application crashed.

Or, IoT Hub might be experiencing a transient issue. For more information, see [500xxx Internal errors](#500xxx-internal-server-errors).

To resolve this error:

* See the guidance for [401003 IoTHubUnauthorized error](#401003-iothubunauthorized-error).
* Make sure the device has good connectivity to IoT Hub by [testing the connection](tutorial-connectivity.md). If the network is unreliable or intermittent, we don't recommend increasing the keep-alive value because it could result in detection (via Azure Monitor alerts, for example) taking longer.
* Use the latest versions of the [Azure IoT Hub SDKs](iot-hub-devguide-sdks.md).
* See the guidance for [500xxx Internal errors](#500xxx-internal-server-errors).

> [!NOTE]
> We recommend using Azure IoT device SDKs to manage connections reliably. To learn more, see [Manage device reconnections to create resilient applications](../iot/concepts-manage-device-reconnections.md)

### 4043xx Configuration NotFound errors

You might see that your requests to IoT Hub fail with an error that begins with **4043**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**404301 ConfigurationNotFound**| The specified configuration isn't found. | Check the configuration ID and try again. |
|**404302 GroupNotFound**| The specified group isn't found. | Check the group ID and try again. |


### 4044xx PnP NotFound errors

You might see that your requests to IoT Hub fail with an error that begins with **4044**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**404401 DigitalTwinModelNotFound**| The specified digital twin model isn't found. | Check the digital twin model ID and try again. |
|**404402 InterfaceNameModelNotFound**| The specified interface name model isn't found. | Check the interface name model ID and try again. |

## 405xxx MethodNotAllowed errors

You might see that your requests to IoT Hub fail with an error that begins with **405**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**405000  GenericMethodNotAllowed**| The specified method isn't allowed. | Check the method and try again. |

### 4051xx Device model MethodNotAllowed errors

You might see that your requests to IoT Hub fail with an error that begins with **4051**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**405102  OperationNotAllowedInCurrentState**| The operation isn't allowed in the current state. | Check the device state and try again. |
|**405103  ImportDevicesNotSupported**| Importing devices isn't supported. | Check the import settings and try again. |
|**405104  BulkAddDevicesNotSupported**| Bulk adding devices isn't supported. | Check the bulk add settings and try again. |

## 409xxx Conflict errors

You might see that your requests to IoT Hub fail with an error that begins with **409**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**409000  GenericConflict**| A conflict occurred. | Check the request and try again. |
|**409001  DeviceAlreadyExists**| The specified device already exists. | See [409001 DeviceAlreadyExists error](#409001-devicealreadyexists-error) for more information.|
|**409002  LinkCreationConflict**| A conflict occurred while creating a link. | See [409002 LinkCreationConflict error](#409002-linkcreationconflict-error) for more information.|
|**409003  CallbackSubscriptionConflict**| A conflict occurred with the callback subscription. | Check the callback subscription settings and try again. |

### 409001 DeviceAlreadyExists error

When trying to register a device in IoT Hub, you might see that the request fails with the error `409001 DeviceAlreadyExists`.

This error occurs because there's already a device with the same device ID in the IoT hub.

To resolve this error, use a different device ID and try again.

### 409002 LinkCreationConflict error

You might see the error `409002 LinkCreationConflict` in logs along with device disconnection or cloud-to-device message failure.

<!-- When using AMQP? -->

Generally, this error happens when IoT Hub detects a client has more than one connection. In fact, when a new connection request arrives for a device with an existing connection, IoT Hub closes the existing connection with this error.

In the most common case, a separate issue (such as [404104 DeviceConnectionClosedRemotely error](#404104-deviceconnectionclosedremotely-error)) causes the device to disconnect. The device tries to reestablish the connection immediately, but IoT Hub still considers the device connected. IoT Hub closes the previous connection and logs this error.

Or, faulty device-side logic causes the device to establish the connection when one is already open.

To resolve this error, look for other errors in the logs that you can troubleshoot because this error usually appears as a side effect of a different, transient issue. Otherwise, make sure to issue a new connection request only if the connection drops.

### 4091xx Device model conflict errors

You might see that your requests to IoT Hub fail with an error that begins with **4091**. The following table lists the error codes, their descriptions, and possible solutions.


| Error Code | Description | Solution |
|------------|-------------|----------|
|**409101  ModelAlreadyExists**| The specified model already exists. | Check the model ID and try again. |
|**409102  DeviceLocked**| The specified device is locked. | Check the device status and try again. |
|**409103  DeviceJobAlreadyExists**| The specified device job already exists. | Check the device job ID and try again. |
|**409104  JobAlreadyExists**| The specified job already exists. | Check the job ID and try again. |

### 4093xx Modules conflict errors

You might see that your requests to IoT Hub fail with an error that begins with **4093**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**409301  ModuleAlreadyExistsOnDevice**| The specified module already exists on the device. | Check the module ID and try again. |

### 4094xx Configuration conflict errors

You might see that your requests to IoT Hub fail with an error that begins with **4094**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**409401  ConfigurationAlreadyExists**| The specified configuration already exists. | Check the configuration ID and try again. |
|**409402  ApplyConfigurationAlreadyInProgressOnDevice**| The specified configuration application is already in progress on the device. | Check the device status and try again. |

### 4095xx Digital twin conflict errors

You might see that your requests to IoT Hub fail with an error that begins with **4095**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**409501  DigitalTwinModelAlreadyExists**| The specified digital twin model already exists. | Check the digital twin model ID and try again. |
|**409502  DigitalTwinModelExistsWithOtherModelType**| The specified digital twin model exists with a different model type. | Check the digital twin model type and try again. |
|**409503  InterfaceNameModelAlreadyExists**| The specified interface name model already exists. | Check the interface name model ID and try again. |

## 412xxx PreconditionFailed errors

You might see that your requests to IoT Hub fail with an error that begins with **412**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**412000  GenericPreconditionFailed**| A generic precondition failed. | Check the request and try again. |
|**412001  PreconditionFailed**| The precondition failed. | Check the request and try again. |
|**412002  DeviceMessageLockLost**| The device message lock was lost. | See [412002 DeviceMessageLockLost error](#412002-devicemessagelocklost-error) for more information. |
|**412003  JobRunPreconditionFailed**| The job run precondition failed. | Check the job status and try again. |
|**412004  InflightMessagesInLink**| There are inflight messages in the link. | Check the link status and try again. |


### 412002 DeviceMessageLockLost error 

When trying to send a cloud-to-device message, you might see that the request fails with the error `412002 DeviceMessageLockLost`.

This error occurs because when a device receives a cloud-to-device message from the queue (for example, using [`ReceiveAsync()`](/dotnet/api/microsoft.azure.devices.client.deviceclient.receiveasync)), IoT Hub locks the message for a lock time-out duration of one minute. If the device tries to complete the message after the lock time-out expires, IoT Hub throws this exception.

If IoT Hub doesn't get the notification within the one-minute lock time-out duration, it sets the message back to *Enqueued* state. The device can attempt to receive the message again. To prevent the error from happening in the future, implement device side logic to complete the message within one minute of receiving the message. This one-minute time-out can't be changed.

## 413xxx Request entity too large errors

You might see that your requests to IoT Hub fail with an error that begins with **413**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**413000  GenericRequestEntityTooLarge**| The request entity is too large. | Reduce the size of the request entity and try again. |
|**413001  MessageTooLarge**| The message is too large. | Reduce the size of the message and try again. |
|**413002  TooManyDevices**| Too many devices are being registered. | Reduce the number of devices and try again. |
|**413003  TooManyModulesOnDevice**| Too many modules are being registered on the device. | Reduce the number of modules and try again. |
|**413101  ConfigurationCountLimitExceeded**| The configuration count limit has been exceeded. | Reduce the number of configurations and try again. |
|**413201  DigitalTwinModelCountLimitExceeded**| The digital twin model count limit has been exceeded. | Reduce the number of digital twin models and try again. |
|**413202  InterfaceNameCompressionModelCountLimitExceeded**| The interface name compression model count limit has been exceeded. | Reduce the number of interface name compression models and try again. |

## 415xxx Unsupported media type errors

You might see that your requests to IoT Hub fail with an error that begins with **415**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**415000  GenericUnsupportedMediaType**| The media type is not supported. | Check the media type and try again. |
|**415101  IncompatibleDataType**| The data type is incompatible. | Check the data type and try again. |

## 429xxx Throttling exception errors

You might see that your requests to IoT Hub fail with an error that begins with **429**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**429000  GenericTooManyRequests**| Too many requests were made. | Reduce the number of requests and try again. |
|**429001  ThrottlingException**| A throttling exception occurred. | Refer to the [Throttling limits](iot-hub-devguide-quotas-throttling.md) documentation for more information.|
|**429002  ThrottleBacklogLimitExceeded**| The number of requests that are in the backlog due to throttling has exceeded the backlog limit. | Reduce the number of requests and try again. Refer to [Traffic shaping](iot-hub-devguide-quotas-throttling.md#traffic-shaping) documentation for more info on how traffic shaping works before sending throttling response. |
|**429003  ThrottlingBacklogTimeout**| Requests that were backlogged due to throttling have timed out while waiting in the backlog queue. | Reduce the number of requests and try again. |
|**429004  ThrottlingMaxActiveJobCountExceeded**| The maximum active job count has been exceeded. | Reduce the number of active jobs and try again. |
|**429005  DeviceThrottlingLimitExceeded**| The device throttling limit has been exceeded. | Reduce the number of requests from the device and try again. |

These errors occur when you exceed the [throttling limits](iot-hub-devguide-quotas-throttling.md) for the requested operation.

You can only monitor `429001 ThrottlingException` error through Azure Monitor under the metric [Number of Throttling Errors](monitor-iot-hub-reference.md). Currently, the other throttling errors don't have an associated metric but are captured in the logs.

To resolve these errors, check if you're hitting the throttling limit by comparing your *Telemetry message send attempts* metric against the limits previously specified. You can also check the *Number of throttling errors* metric. For information about these metrics, see [Device telemetry metrics](monitor-iot-hub-reference.md#device-telemetry-metrics). For information about how use metrics to help you monitor your IoT hub, see [Monitor Azure IoT Hub](monitor-iot-hub.md).

IoT Hub returns `429001 ThrottlingException` only after the limit is violated for too long a period. This delay is done so that your messages aren't dropped if your IoT hub gets burst traffic. In the meantime, IoT Hub processes the messages at the operation throttle rate, which might be slow if there's too much traffic in the backlog. For more information, see the [Traffic shaping](iot-hub-devguide-quotas-throttling.md#traffic-shaping) section of [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).

Consider [scaling up your IoT hub](iot-hub-scaling.md) if you're running into quota or throttling limits.

## 499xxx Client closed request errors

You might see that your requests to IoT Hub fail with an error that begins with **499**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**499000  ClientClosedRequest**| The client closed the request. | Try again later. |

## 500xxx Internal server errors

You might see that your requests to IoT Hub fail with an error that begins with **500** or mentions a server error. Some possibilities are:

| Error Code | Description |
|------------|-------------|
|**500001  ServerError**| A server-side error occurred. |
|**500008  GenericTimeout**| IoT Hub couldn't complete the connection request before timing out. |
|**ServiceUnavailable (no error code)**| IoT Hub encountered an internal error. |
|**InternalServerError (no error code)**| IoT Hub encountered an internal error. |

There can be many causes for a `500xxx` error response. In all cases, the issue is most likely transient. While the IoT Hub team works hard to maintain [the SLA](https://azure.microsoft.com/support/legal/sla/iot-hub/), small subsets of IoT Hub nodes can occasionally experience transient faults. When your device tries to connect to a node that's having issues, you receive this error.

To mitigate `5000xx` errors, issue a retry from the device. To [automatically manage retries](../iot/concepts-manage-device-reconnections.md#connection-and-retry), make sure you use the latest version of the [Azure IoT Hub SDKs](iot-hub-devguide-sdks.md). For more information about best practices for transient fault handling and retries, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).

If the problem persists, check [Resource Health](iot-hub-azure-service-health-integration.md#check-iot-hub-health-with-azure-resource-health) and [Azure Status](https://azure.status.microsoft/) to see if IoT Hub has a known problem. You can also use the [manual failover feature](tutorial-manual-failover.md).

If there are no known problems and the issue continues, [contact support](https://azure.microsoft.com/support/options/) for further investigation.

### 5003xx Resolution related errors

You might see that your requests to IoT Hub fail with an error that begins with **5003**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**500301  ModelRepoEndpointError**| The model repository endpoint is invalid. | Check the model repository endpoint and try again. |
|**500302  ResolutionError**| A resolution error occurred. | Try again later. |

### 5004xx MSI related errors

You might see that your requests to IoT Hub fail with an error that begins with **5004**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**500401  UnableToFetchCredentials**| Unable to fetch credentials. | Check the credentials and try again. |
|**500402  UnableToFetchTenantInfo**| Unable to fetch tenant information. | Check the tenant information and try again. |
|**500403  UnableToShareIdentity**| Unable to share identity. | Check the identity sharing settings and try again. |


### 5005xx PnP related errors

You might see that your requests to IoT Hub fail with an error that begins with **5005**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**500501  UnableToExpandDiscoveryInfo**| Unable to expand discovery information. | Check the discovery information and try again. |
|**500502  UnableToExpandComponentInfo**| Unable to expand component information. | Check the component information and try again. |
|**500503  UnableToCompressComponentInfo**| Unable to compress component information. | Check the component information and try again. |
|**500504  UnableToCompressDiscoveryInfo**| Unable to compress discovery information. | Check the discovery information and try again. |
|**500505  OrphanDiscoveryDocument**| Orphan discovery document found. | Check the discovery document and try again. |


## 502xxx Gateway related errors

You might see that your requests to IoT Hub fail with an error that begins with **502**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**502000  GenericBadGateway**| A generic bad gateway error occurred. | Try again later. |

## 503xxx Service unavailable related errors

You might see that your requests to IoT Hub fail with an error that begins with **503**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**503000  GenericServiceUnavailable**| A generic service unavailable error occurred. | Try again later. |
|**503001  ServiceUnavailable**| The service is unavailable. | Try again later. |
|**503004  IotHubActivationFailed**| IoT Hub activation failed. | Check the IoT Hub status and try again. |
|**503005  ServerBusy**| The server is busy. | Try again later. |
|**503006  IotHubRestoring**| IoT Hub is restoring. | Try again later. |
|**503008  ReceiveLinkOpensThrottled**| Receive link opens are throttled. | Try again later. |

### 5031xx Device model unavailable errors

You might see that your requests to IoT Hub fail with an error that begins with **5031**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**503101  ConnectionUnavailable**| The connection is unavailable. | Check the connection and try again. |
|**503102  DeviceUnavailable**| The device is unavailable. | Check the device status and try again. |

### 5032xx Configuration unavailable errors

You might see that your requests to IoT Hub fail with an error that begins with **5032**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**503201  ConfigurationNotAvailable**| The configuration isn't available. | Check the configuration and try again. |
|**503202  GroupNotAvailable**| The group isn't available. | Check the group and try again. |


### 5033xx PnP unavailable related errors

You might see that your requests to IoT Hub fail with an error that begins with **5033**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**503301  HostingServiceNotAvailable**| The hosting service isn't available. | Try again later. |

## 504xxx Gateway timeout related errors

You might see that your requests to IoT Hub fail with an error that begins with **504**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**504000  GenericGatewayTimeout**| A generic gateway timeout error occurred. | Try again later. |
|**504101  GatewayTimeout**| The gateway timed out. | See [504101 GatewayTimeout error](#504101-gatewaytimeout-error) for more information.|

### 504101 GatewayTimeout error

When trying to invoke a direct method from IoT Hub to a device, you might see that the request fails with the error `504101 GatewayTimeout`.

This error occurs because IoT Hub encountered an error and couldn't confirm if the direct method completed before timing out. Or, when using an earlier version of the Azure IoT C# SDK (<1.19.0), the AMQP link between the device and IoT Hub can be dropped silently because of a bug.

To resolve this error, issue a retry or upgrade to the latest version of the Azure IOT C# SDK.

## Related content

- [Troubleshoot Azure IoT Hub Device Provisioning Service](/azure/iot-dps/how-to-troubleshoot-dps)
- [Monitor, diagnose, and troubleshoot device connectivity](iot-hub-troubleshoot-connectivity.md)
- [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md)
- [Monitor Azure IoT Hub](monitor-iot-hub.md)