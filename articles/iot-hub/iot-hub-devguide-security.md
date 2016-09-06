<properties
 pageTitle="Developer guide - control access to IoT Hub | Microsoft Azure"
 description="Azure IoT Hub developer guide - how to control access to IoT Hub and manage security"
 services="iot-hub"
 documentationCenter=".net"
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016" 
 ms.author="dobett"/>

# Control access to IoT Hub

## Overview

This article describes the options for securing your IoT hub. IoT Hub uses *permissions* to grant access to each IoT hub's endpoints. Permissions limit the access to an IoT hub based on functionality.

### When to use

## Access control and permissions

You can grant permissions in the following ways:

* **Hub-level shared access policies**. Shared access policies can grant any combination of the permissions listed in the previous section. You can define policies in the [Azure portal][lnk-management-portal], or programmatically by using the [Azure IoT Hub Resource provider APIs][lnk-resource-provider-apis]. A newly created IoT hub has the following default policies:

    - **iothubowner**: Policy with all permissions.
    - **service**: Policy with ServiceConnect permission.
    - **device**: Policy with DeviceConnect permission.
    - **registryRead**: Policy with RegistryRead permission.
    - **registryReadWrite**: Policy with RegistryRead and RegistryWrite permissions.


* **Per-device security credentials**. Each IoT Hub contains a [device identity registry][lnk-identity-registry]. For each device in this registry, you can configure security credentials that grant **DeviceConnect** permissions scoped to the corresponding device endpoints.

For example, in a typical IoT solution:
- The device management component uses the *registryReadWrite* policy.
- The event processor component uses the *service* policy.
- The runtime device business logic component uses the *service* policy.
- Individual devices connect using credentials stored in the IoT hub's identity registry.

For guidance on IoT Hub security topics, see the security section in [Design your solution][lnk-guidance-security].

## Authentication

Azure IoT Hub grants access to endpoints by verifying a token against the shared access policies and device identity registry security credentials.

Security credentials, such as symmetric keys, are never sent over the wire.

> [AZURE.NOTE] The Azure IoT Hub resource provider is secured through your Azure subscription, as are all providers in the [Azure Resource Manager][lnk-azure-resource-manager].

For more information about how to construct and use security tokens, see [IoT Hub security tokens][lnk-sas-tokens].

### Protocol specifics

Each supported protocol, such as MQTT, AMQP, and HTTP, transports tokens in different ways.


HTTP implements authentication by including a valid token in the **Authorization** request header.


When using [AMQP][lnk-amqp], IoT Hub supports [SASL PLAIN][lnk-sasl-plain] and [AMQP Claims-Based-Security][lnk-cbs].

If you use AMQP claims-based-security, the standard specifies how to transmit these tokens.

For SASL PLAIN, the **username** can be:

* `{policyName}@sas.root.{iothubName}` if using hub-level tokens.
* `{deviceId}` if using device-scoped tokens.

In both cases, the password field contains the token, as described in the [IoT Hub security tokens][lnk-sas-tokens] article.

When using MQTT, the CONNECT packet has the deviceId as the ClientId, {iothubhostname}/{deviceId} in the Username field, and a SAS token in the Password field. {iothubhostname} should be the full CName of the IoT hub (for example, contoso.azure-devices.net).

#### Example

Username (DeviceId is case-sensitive):
`iothubname.azure-devices.net/DeviceId`

Password (Generate SAS with Device Explorer): `SharedAccessSignature sr=iothubname.azure-devices.net%2fdevices%2fDeviceId&sig=kPszxZZZZZZZZZZZZZZZZZAhLT%2bV7o%3d&se=1487709501`

> [AZURE.NOTE] The [Azure IoT Hub SDKs][lnk-sdks] automatically generate tokens when connecting to the service. In some cases, the SDKs do not support all the protocols or all the authentication methods.

### Special considerations for SASL PLAIN

When using SASL PLAIN, a client connecting to an IoT hub can use a single token for each TCP connection. When the token expires, the TCP connection disconnects from the service and triggers a reconnect. This behavior, while not problematic for an application back-end component, is very damaging for a device-side application for the following reasons:

*  Gateways usually connect on behalf of many devices. When using SASL PLAIN, they have to create a distinct TCP connection for each device connecting to an IoT hub. This scenario considerably increases the consumption of power and networking resources, and increases the latency of each device connection.
* Resource-constrained devices are adversely affected by the increased use of resources to reconnect after each token expiration.

## Scope hub-level credentials

You can scope hub-level security policies by creating tokens with a restricted resource URI. For example, the endpoint to send device-to-cloud messages from a device is **/devices/{deviceId}/messages/events**. You can also use a hub-level shared access policy with **DeviceConnect** permissions to sign a token whose resourceURI is **/devices/{deviceId}**. This approach creates a token that is only usable to send devices on behalf of device **deviceId**.

This mechanism is similar to the [Event Hubs publisher policy][lnk-event-hubs-publisher-policy], and enables you to implement custom authentication methods. For more information, see the security section of [Design your solution][lnk-guidance-security].

## Reference

### IoT Hub permissions

The following table lists the permissions you can use to control access to your IoT hub.

| Permission            | Notes |
| --------------------- | ----- |
| **RegistryRead**      | Grants read access to the device identity registry. For more information, see [Device identity registry][lnk-identity-registry]. |
| **RegistryReadWrite** | Grants read and write access to the device identity registry. For more information, see [Device identity registry][lnk-identity-registry]. |
| **ServiceConnect**    | Grants access to cloud service-facing communication and monitoring endpoints. For example, it grants permission to back-end cloud services to receive device-to-cloud messages, send cloud-to-device messages, and retrieve the corresponding delivery acknowledgments. |
| **DeviceConnect**     | Grants access to device-facing communication endpoints. For example, it grants permission to send device-to-cloud messages and receive cloud-to-device messages. This permission is used by devices. |

### Additional reference material

Other reference topics in the Developer Guide include:

- [IoT Hub endpoints][lnk-endpoints] describes the various endpoints that each IoT hub exposes for runtime and management operations.
- [Throttling and quotas][lnk-quotas] describes the quotas that apply to the IoT Hub service and the throttling behavior to expect when you use the service.
- [IoT Hub device and service SDKs][lnk-sdks] lists the various language SDKs you an use when you develop both device and service applications that interact with IoT Hub.
- [Query language for twins, methods, and jobs][lnk-query] describes the query language you can use to retrieve information from IoT Hub about your device twins, methods and jobs.

## Next steps

Now you have learned about sending and receiving messages with IoT Hub, you may be interested in the following Developer Guide topics:

- [Related topic 1][lnk-topic1]
- [Related topic 2][lnk-topic2]

If you would like to try out some of the concepts described in this article, you may be interested in the following IoT Hub tutorials:

- [Related tutorial 1][lnk-tutorial1]
- [Related tutorial 2][lnk-tutorial2]

<!-- links and images -->

[lnk-endpoints]: iot-hub-devguide-endpoints.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-query]: iot-hub-devguide-query-language.md

[lnk-resource-provider-apis]: https://msdn.microsoft.com/library/mt548492.aspx
[lnk-sas-tokens]: iot-hub-sas-tokens.md
[lnk-guidance-security]: iot-hub-guidance.md#customauth
[lnk-amqp]: https://www.amqp.org/
[lnk-azure-resource-manager]: https://azure.microsoft.com/documentation/articles/resource-group-overview/
[lnk-cbs]: https://www.oasis-open.org/committees/download.php/50506/amqp-cbs-v1%200-wd02%202013-08-12.doc
[lnk-event-hubs-publisher-policy]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-99ce67ab
[lnk-management-portal]: https://portal.azure.com
[lnk-sasl-plain]: http://tools.ietf.org/html/rfc4616
[lnk-identity-registry]: iot-hub-devguide-identity-registry.md