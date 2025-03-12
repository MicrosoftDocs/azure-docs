---
title: Use MQTT to communicate with Azure IoT DPS
titleSuffix: Azure IoT Device Provisioning Service
description: Guidance on using the MQTT protocol to connect a device to the Azure IoT Device Provisioning Service device-facing endpoint.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: conceptual
ms.date: 03/12/2025
ms.custom:  [amqp, mqtt]
---

# Communicate with DPS using the MQTT protocol

This article describes how devices can use the MQTT protocol to communicate with the Azure IoT Device Provisioning Service (DPS) device endpoint. The DPS device endpoint supports device connectivity using:

* [MQTT v3.1.1](https://mqtt.org/) on port 8883
* [MQTT v3.1.1 over WebSocket](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718127) on port 443

DPS isn't a full-featured MQTT broker and doesn't support all the behaviors specified in the MQTT v3.1.1 standard.

All device communication with DPS must be secured using TLS. Therefore, DPS doesn't support insecure MQTT connections over port 1883.

 > [!NOTE]
 > DPS currently doesn't support devices using the TPM [attestation mechanism](../iot-dps/concepts-service.md#attestation-mechanism) over the MQTT protocol.

## Connect to DPS

A device can use the MQTT protocol to connect to a DPS instance using any of the following options:

* The [Azure IoT device provisioning SDKs](iot-sdks.md#dps-device-sdks).
* The MQTT protocol directly.

## Use the MQTT protocol directly from a device

If a device can't use the device SDKs, it can still connect to the public device endpoints using the MQTT protocol on port 8883.

[!INCLUDE [iot-authentication-device-connection-string](../../includes/iot-authentication-device-connection-string.md)]

In the **CONNECT** packet, the device should use the following values:

* For the **ClientId** field, use **registrationId**.

* For the **Username** field, use `{idScope}/registrations/{registration_id}/api-version=2019-03-31`, where `{idScope}` is the [ID scope](../iot-dps/concepts-service.md#id-scope) of the DPS and `{registration_id}` is the [Registration ID](../iot-dps/concepts-service.md#registration-id) for your device.

    > [!NOTE]
    > If you use X.509 certificate authentication, the registration ID is provided by the subject common name (CN) of your device leaf (end-entity) certificate. `{registration_id}` in the **Username** field must match the common name.

* For the **Password** field, use a SAS token. The following snippet shows the format of the SAS token:

  `SharedAccessSignature sr={URL-encoded-resourceURI}&sig={signature-string}&se={expiry}&skn=registration`
  The `resourceURI` should be in the format `{idScope}/registrations/{registration_id}`. The policy name (`skn`) must be set to `registration`.

  > [!NOTE]
  > If you use X.509 certificate authentication, SAS token passwords aren't required.

  For more information about how to generate SAS tokens, see the security tokens section of [Control access to DPS](../iot-dps/how-to-control-access.md#security-tokens).

The following list contains DPS implementation-specific behaviors:

* DPS doesn't support persistent sessions. It treats every session as non-persistent, regardless of the value of the **CleanSession** flag. You should set **CleanSession** to true.

* When a device application subscribes to a topic with **QoS 2**, DPS grants maximum **QoS 1** in the **SUBACK** packet. After that, DPS delivers messages to the device using **QoS 1**.

## TLS configuration

To use the MQTT protocol directly, your client must connect over TLS 1.2. Any attempts to skip this step will fail with connection errors.

## Register a device

To register a device through DPS, a device should subscribe using `$dps/registrations/res/#` as a **Topic Filter**. The multi-level wildcard `#` in the topic filter enables the device to receive more properties in the topic name. DPS doesn't allow the usage of the `#` or `?` wildcards for filtering of subtopics. DPS isn't a general-purpose publish-subscribe messaging broker, it only supports the documented topic names and topic filters.

The device should publish a register message to DPS using `$dps/registrations/PUT/iotdps-register/?$rid={request_id}` as a **Topic Name**. The payload should contain the [Device Registration](/azure/notification-hubs/notification-hubs-push-notification-registration-management) object in JSON format.

If the request is successful, the device receives a response on the `$dps/registrations/res/202/?$rid={request_id}&retry-after=x` topic name where `x` is the `retry-after` value in seconds.

## Poll for registration operation status

The device must poll the service periodically to receive the result of the device registration operation. Assuming that the device is subscribed to the `$dps/registrations/res/#` topic, it can publish a get operation status message to the `$dps/registrations/GET/iotdps-get-operationstatus/?$rid={request_id}&operationId={operationId}` topic name. The operation ID in this message should be the value received in the `RegistrationOperationStatus` response message in the previous step. If the request is successful, the service responds on the `$dps/registrations/res/200/?$rid={request_id}` topic. The payload of the response contains a `RegistrationOperationStatus` object. The device should keep polling the service if the response code is 202 after a delay equal to the `retry-after` period. The device registration operation is successful when the service returns a 200 status code.

## Connect over WebSocket

When connecting over WebSocket, specify the subprotocol as `mqtt`. For more information, see [RFC 6455](https://tools.ietf.org/html/rfc6455).

## Next steps

To learn more about the MQTT protocol, see the [MQTT documentation](https://mqtt.org/).

To browse sample MQTT code, see [MQTT application samples](https://github.com/Azure-Samples/MqttApplicationSamples).
