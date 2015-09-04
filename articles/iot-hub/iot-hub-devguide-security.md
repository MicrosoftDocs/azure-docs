<properties
 pageTitle="Azure IoT Hub Developer guide security | Microsoft Azure"
 description="Describes the options for securing IoT Hub"
 services="azure-iot"
 documentationCenter=".net"
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="azure-iot"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/04/2015"
 ms.author="dobett"/>

# Security

This article describes the options for securing Azure IoT Hub.

## Access control <a id="accesscontrol"></a>
Azure IoT Hub grants access to each hub's endpoint with the following set of *permissions*. Permissions limit the access to an IoT hub based on functionality.

* **RegistryRead**. This permission grants read access to the device identity registry. Refer to [Device identity registry][lnk-device-identity-registry] for more information.
* **RegistryWrite**. This permissions grants write access to the device identity registry. Refer to [Device identity registry][lnk-device-identity-registry] for more information.
* **ServiceConnect**. This permission grants access to service-facing communication and monitoring endpoints. For example, it grants permission to receive device-to-cloud messages, send cloud-to-device messages and retrieve the corresponding delivery acknowledgments.
* **DeviceConnect**. This permission grants access to device-facing communication endpoints. For example, it grants permission to send device-to-cloud messages and receive cloud-to-device messages.

Permissions are granted in the following ways:

* **Hub-level shared access policies**. *Shared access policies* can grant any combination of the permissions listed above. You can define policies in the [Azure Management Portal][lnk-management-portal] or programmatically using the [Azure IoT Hub Resource provider APIs][lnk-resource-provider-apis]. A newly created IoT Hub has the following default policies:
    - *iothubowner*: Policy with all permissions,
    - *service*: Policy with **ServiceConnect** permission,
    - *device*: Policy with **DeviceConnect** permission,
    - *registryRead*: Policy with **RegistryRead** permission,
    - *registryReadWrite*: Policy with **RegistryRead** and **RegistryWrite** permissions.
* **Per-device security credentials**. Each IoT Hub contains a [device identity registry][lnk-device-identity-registry]. For each device in this registry, you can configure security credentials that grant **DeviceConnect** permissions scoped to the corresponding device endpoints.

**Example**. In an IoT solution, there is usually a device management component that uses the *registryReadWrite* policy, and an event processor component and a runtime device business logic component that use the *service* policy. Individual devices connect using credentials stored in the hub identity registry.
When an IoT solution uses cloud gateways (refer to the gateway section of [Azure IoT Hub Guidance][lnk-guidance-gateways]), it is possible that the gateway could be considered a trusted component and use a policy with **DeviceConnect** permission.

For guidance on IoT Hub security topics, refer to the security section of [Azure IoT Hub Guidance][lnk-guidance-security].

## Authentication
Azure IoT Hub grants access to endpoints by verifying a token against the shared access policies and device identity registry security credentials.
Security credentials, such as symmetric keys, are never sent on the wire.

**Note**: The Azure IoT Hub resource provider is secured through your Azure subscription, as all providers in the [Azure Resource Manager][lnk-azure-resource-manager].

### Security token format <a id="tokenformat"></a>
The security token has the following format:

        SharedAccessSignature sig={signature-string}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI}

These are the expected values:

| Value | Description |
| ----- | ----------- |
| {signature} | An HMAC-SHA256 signature of the string: `{URL-encoded-resourceURI} + "\n" + expiry` |
| {resourceURI} | URI prefix (by segment) of the endpoints that can be accessed with this token. For example, `/events` |
| {expiry} | UTF8 strings for number of seconds since the epoch 00:00:00 UTC on 1 January 1970. |
| {URL-encoded-resourceURI} | URL-encoded resource URI (lower-case) |
| {policyName} | The name of the shared access policy to which this token refers. Absent in the case of tokens referring to device-registry credentials. |

**Note on prefix**: The URI prefix is computed by segment and not by character. For example `/a/b` is a prefix for `/a/b/c` but *not* for `/a/bc`.

### Protocol specifics
Each supported protocol (such as AMQP and HTTP) transports tokens in different ways.

HTTP authentication is implemented by including a valid token in the **Authorization** request header. A query parameter called **Authorization** can also transport the token.

When using [AMQP][lnk-amqp-protocol], Azure IoT Hub supports [SASL PLAIN][lnk-sasl-plain] and [AMQP Claims-Based-Security][lnk-cbs].

In case of AMQP claims-based-security, the standard specifies how to transmit the tokens listed above.

For SASL Plain, the username can be:
* `{policyName}@sas.root.{iothubName}` in the case of hub-level tokens.
* `{deviceId}` in the case of device-scoped tokens.

In both cases the password field contains the token as described in the [Token format](#tokenformat) section.

**Note**: The [Azure IoT Hub SDKs][lnk-azure-hub-sdks] automatically generate tokens when connecting to the service. In some cases, some SDKs are limited in the protocol they support or the authentication method available. Please refer to the [Azure IoT Hub SDKs][lnk-azure-hub-sdks] documentation for more information.

#### SASL PLAIN compared to CBS
When using SASL PLAIN, a client connecting to an IoT hub can use a single token for each TCP connection. Also, when the token expires the TCP connection is disconnected from the service, triggering a reconnect. This behavior, while not problematic for an application back-end component, is very damaging for a device-side application for the following reasons:

*  Gateways usually connect on behalf of many devices. When using SASL PLAIN, they have to create a distinct TCP connection for each device connecting to an IoT hub. This considerably increases the consumptions of power and networking resources, and increases the latency of each device connection.
* Resource-constrained devices will use more resources to reconnect after each token expiration.

## Scoping hub-level credentials
It is possible to scope hub-level security policies by creating tokens with a restricted resource URI. For instance, the endpoint to send device-to-cloud messages from a device is `/devices/{deviceId}/events`. It is possible to use a hub-level shared access policy with **DeviceConnect** permissions to sign a token whose resourceURI is `/devices/{deviceId}`, creating a token that is only usable to send devices on behalf of device `deviceId`.

This is a mechanism that is similar, to [Event Hubs publisher policy][lnk-event-hubs-publisher-policy], and enables the implementation of custom authentication methods, as explained in the security section of the [Azure IoT Hub Guidance][lnk-guidance-security].

[lnk-device-identity-registry]: iot-hub-devguide-registry.md
[lnk-resource-provider-apis]: TBD
[lnk-management-portal]: https://portal.azure.com
[lnk-guidance-gateways]: TBD
[lnk-guidance-security]: TBD
[lnk-azure-resource-manager]: https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/
[lnk-amqp-protocol]: https://www.amqp.org/
[lnk-cbs]: https://www.oasis-open.org/committees/download.php/50506/amqp-cbs-v1%200-wd02%202013-08-12.doc
[lnk-sasl-plain]: http://tools.ietf.org/html/rfc4616
[lnk-azure-hub-sdks]: TBD
[lnk-event-hubs-publisher-policy]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-99ce67ab
