---
title: Understand Azure IoT Hub security | Microsoft Docs
description: Developer guide - how to control access to IoT Hub for device apps and back-end apps. Includes information about security tokens and support for X.509 certificates.
author: wesmc7777
manager: philmea
ms.author: wesmc
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/18/2018
---

# Control access to IoT Hub

This article describes the options for securing your IoT hub. IoT Hub uses *permissions* to grant access to each IoT hub endpoint. Permissions limit the access to an IoT hub based on functionality.

This article introduces:

* The different permissions that you can grant to a device or back-end app to access your IoT hub.
* The authentication process and the tokens it uses to verify permissions.
* How to scope credentials to limit access to specific resources.
* IoT Hub support for X.509 certificates.
* Custom device authentication mechanisms that use existing device identity registries or authentication schemes.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

You must have appropriate permissions to access any of the IoT Hub endpoints. For example, a device must include a token containing security credentials along with every message it sends to IoT Hub.

## Access control and permissions

You can grant [permissions](#iot-hub-permissions) in the following ways:

* **IoT hub-level shared access policies**. Shared access policies can grant any combination of [permissions](#iot-hub-permissions). You can define policies in the [Azure portal](https://portal.azure.com), programmatically by using the [IoT Hub Resource REST APIs](/rest/api/iothub/iothubresource), or using the [az iot hub policy](/cli/azure/iot/hub/policy?view=azure-cli-latest) CLI. A newly created IoT hub has the following default policies:
  
  | Shared Access Policy | Permissions |
  | -------------------- | ----------- |
  | iothubowner | All permission |
  | service | **ServiceConnect** permissions |
  | device | **DeviceConnect** permissions |
  | registryRead | **RegistryRead** permissions |
  | registryReadWrite | **RegistryRead** and **RegistryWrite** permissions |

* **Per-Device Security Credentials**. Each IoT Hub contains an [identity registry](iot-hub-devguide-identity-registry.md) For each device in this identity registry, you can configure security credentials that grant **DeviceConnect** permissions scoped to the corresponding device endpoints.

For example, in a typical IoT solution:

* The device management component uses the *registryReadWrite* policy.
* The event processor component uses the *service* policy.
* The run-time device business logic component uses the *service* policy.
* Individual devices connect using credentials stored in the IoT hub's identity registry.

> [!NOTE]
> See [permissions](#iot-hub-permissions) for detailed information.

## Authentication

Azure IoT Hub grants access to endpoints by verifying a token against the shared access policies and identity registry security credentials.

Security credentials, such as symmetric keys, are never sent over the wire.

> [!NOTE]
> The Azure IoT Hub resource provider is secured through your Azure subscription, as are all providers in the [Azure Resource Manager](../azure-resource-manager/management/overview.md).

For more information about how to construct and use security tokens, see [IoT Hub security tokens](iot-hub-devguide-security.md#security-tokens).

### Protocol specifics

Each supported protocol, such as MQTT, AMQP, and HTTPS, transports tokens in different ways.

When using MQTT, the CONNECT packet has the deviceId as the ClientId, `{iothubhostname}/{deviceId}` in the Username field, and a SAS token in the Password field. `{iothubhostname}` should be the full CName of the IoT hub (for example, contoso.azure-devices.net).

When using [AMQP](https://www.amqp.org/), IoT Hub supports [SASL PLAIN](https://tools.ietf.org/html/rfc4616) and [AMQP Claims-Based-Security](https://www.oasis-open.org/committees/download.php/50506/amqp-cbs-v1%200-wd02%202013-08-12.doc).

If you use AMQP claims-based-security, the standard specifies how to transmit these tokens.

For SASL PLAIN, the **username** can be:

* `{policyName}@sas.root.{iothubName}` if using IoT hub-level tokens.
* `{deviceId}@sas.{iothubname}` if using device-scoped tokens.

In both cases, the password field contains the token, as described in [IoT Hub security tokens](iot-hub-devguide-security.md#security-tokens).

HTTPS implements authentication by including a valid token in the **Authorization** request header.

#### Example

Username (DeviceId is case-sensitive):
`iothubname.azure-devices.net/DeviceId`

Password (You can generate a SAS token with the [device explorer](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/tools/DeviceExplorer) tool, the CLI extension command [az iot hub generate-sas-token](/cli/azure/ext/azure-cli-iot-ext/iot/hub?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-hub-generate-sas-token), or the [Azure IoT Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)):

`SharedAccessSignature sr=iothubname.azure-devices.net%2fdevices%2fDeviceId&sig=kPszxZZZZZZZZZZZZZZZZZAhLT%2bV7o%3d&se=1487709501`

> [!NOTE]
> The [Azure IoT SDKs](iot-hub-devguide-sdks.md) automatically generate tokens when connecting to the service. In some cases, the Azure IoT SDKs do not support all the protocols or all the authentication methods.

### Special considerations for SASL PLAIN

When using SASL PLAIN with AMQP, a client connecting to an IoT hub can use a single token for each TCP connection. When the token expires, the TCP connection disconnects from the service and triggers a reconnection. This behavior, while not problematic for a back-end app, is damaging for a device app for the following reasons:

* Gateways usually connect on behalf of many devices. When using SASL PLAIN, they have to create a distinct TCP connection for each device connecting to an IoT hub. This scenario considerably increases the consumption of power and networking resources, and increases the latency of each device connection.

* Resource-constrained devices are adversely affected by the increased use of resources to reconnect after each token expiration.

## Scope IoT hub-level credentials

You can scope IoT hub-level security policies by creating tokens with a restricted resource URI. For example, the endpoint to send device-to-cloud messages from a device is **/devices/{deviceId}/messages/events**. You can also use an IoT hub-level shared access policy with **DeviceConnect** permissions to sign a token whose resourceURI is **/devices/{deviceId}**. This approach creates a token that is only usable to send messages on behalf of device **deviceId**.

This mechanism is similar to the [Event Hubs publisher policy](https://code.msdn.microsoft.com/Service-Bus-Event-Hub-99ce67ab), and enables you to implement custom authentication methods.

## Security tokens

IoT Hub uses security tokens to authenticate devices and services to avoid sending keys on the wire. Additionally, security tokens are limited in time validity and scope. [Azure IoT SDKs](iot-hub-devguide-sdks.md) automatically generate tokens without requiring any special configuration. Some scenarios do require you to generate and use security tokens directly. Such scenarios include:

* The direct use of the MQTT, AMQP, or HTTPS surfaces.

* The implementation of the token service pattern, as explained in [Custom device authentication](iot-hub-devguide-security.md#custom-device-and-module-authentication).

IoT Hub also allows devices to authenticate with IoT Hub using [X.509 certificates](iot-hub-devguide-security.md#supported-x509-certificates).

### Security token structure

You use security tokens to grant time-bounded access to devices and services to specific functionality in IoT Hub. To get authorization to connect to IoT Hub, devices and services must send security tokens signed with either a shared access or symmetric key. These keys are stored with a device identity in the identity registry.

A token signed with a shared access key grants access to all the functionality associated with the shared access policy permissions. A token signed with a device identity's symmetric key only grants the **DeviceConnect** permission for the associated device identity.

The security token has the following format:

`SharedAccessSignature sig={signature-string}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI}`

Here are the expected values:

| Value | Description |
| --- | --- |
| {signature} |An HMAC-SHA256 signature string of the form: `{URL-encoded-resourceURI} + "\n" + expiry`. **Important**: The key is decoded from base64 and used as key to perform the HMAC-SHA256 computation. |
| {resourceURI} |URI prefix (by segment) of the endpoints that can be accessed with this token, starting with host name of the IoT hub (no protocol). For example, `myHub.azure-devices.net/devices/device1` |
| {expiry} |UTF8 strings for number of seconds since the epoch 00:00:00 UTC on 1 January 1970. |
| {URL-encoded-resourceURI} |Lower case URL-encoding of the lower case resource URI |
| {policyName} |The name of the shared access policy to which this token refers. Absent if the token refers to device-registry credentials. |

**Note on prefix**: The URI prefix is computed by segment and not by character. For example `/a/b` is a prefix for `/a/b/c` but not for `/a/bc`.

The following Node.js snippet shows a function called **generateSasToken** that computes the token from the inputs `resourceUri, signingKey, policyName, expiresInMins`. The next sections detail how to initialize the different inputs for the different token use cases.

```javascript
var generateSasToken = function(resourceUri, signingKey, policyName, expiresInMins) {
    resourceUri = encodeURIComponent(resourceUri);

    // Set expiration in seconds
    var expires = (Date.now() / 1000) + expiresInMins * 60;
    expires = Math.ceil(expires);
    var toSign = resourceUri + '\n' + expires;

    // Use crypto
    var hmac = crypto.createHmac('sha256', Buffer.from(signingKey, 'base64'));
    hmac.update(toSign);
    var base64UriEncoded = encodeURIComponent(hmac.digest('base64'));

    // Construct authorization string
    var token = "SharedAccessSignature sr=" + resourceUri + "&sig="
    + base64UriEncoded + "&se=" + expires;
    if (policyName) token += "&skn="+policyName;
    return token;
};
```

As a comparison, the equivalent Python code to generate a security token is:

```python
from base64 import b64encode, b64decode
from hashlib import sha256
from time import time
from urllib import parse
from hmac import HMAC

def generate_sas_token(uri, key, policy_name, expiry=3600):
    ttl = time() + expiry
    sign_key = "%s\n%d" % ((parse.quote_plus(uri)), int(ttl))
    print sign_key
    signature = b64encode(HMAC(b64decode(key), sign_key.encode('utf-8'), sha256).digest())

    rawtoken = {
        'sr' :  uri,
        'sig': signature,
        'se' : str(int(ttl))
    }

    if policy_name is not None:
        rawtoken['skn'] = policy_name

    return 'SharedAccessSignature ' + parse.urlencode(rawtoken)
```

The following are the installation instructions for the prerequisites.

[!INCLUDE [Iot-hub-include-python-installation-notes](../../includes/iot-hub-include-python-installation-notes.md)]


The functionality in C# to generate a security token is:

```csharp
using System;
using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;

public static string generateSasToken(string resourceUri, string key, string policyName, int expiryInSeconds = 3600)
{
    TimeSpan fromEpochStart = DateTime.UtcNow - new DateTime(1970, 1, 1);
    string expiry = Convert.ToString((int)fromEpochStart.TotalSeconds + expiryInSeconds);

    string stringToSign = WebUtility.UrlEncode(resourceUri) + "\n" + expiry;

    HMACSHA256 hmac = new HMACSHA256(Convert.FromBase64String(key));
    string signature = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(stringToSign)));

    string token = String.Format(CultureInfo.InvariantCulture, "SharedAccessSignature sr={0}&sig={1}&se={2}", WebUtility.UrlEncode(resourceUri), WebUtility.UrlEncode(signature), expiry);

    if (!String.IsNullOrEmpty(policyName))
    {
        token += "&skn=" + policyName;
    }

    return token;
}

```


> [!NOTE]
> Since the time validity of the token is validated on IoT Hub machines, the drift on the clock of the machine that generates the token must be minimal.

### Use SAS tokens in a device app

There are two ways to obtain **DeviceConnect** permissions with IoT Hub with security tokens: use a [symmetric device key from the identity registry](#use-a-symmetric-key-in-the-identity-registry), or use a [shared access key](#use-a-shared-access-policy).

Remember that all functionality accessible from devices is exposed by design on endpoints with prefix `/devices/{deviceId}`.

> [!IMPORTANT]
> The only way that IoT Hub authenticates a specific device is using the device identity symmetric key. In cases when a shared access policy is used to access device functionality, the solution must consider the component issuing the security token as a trusted subcomponent.

The device-facing endpoints are (irrespective of the protocol):

| Endpoint | Functionality |
| --- | --- |
| `{iot hub host name}/devices/{deviceId}/messages/events` |Send device-to-cloud messages. |
| `{iot hub host name}/devices/{deviceId}/messages/devicebound` |Receive cloud-to-device messages. |

### Use a symmetric key in the identity registry

When using a device identity's symmetric key to generate a token, the policyName (`skn`) element of the token is omitted.

For example, a token created to access all device functionality should have the following parameters:

* resource URI: `{IoT hub name}.azure-devices.net/devices/{device id}`,
* signing key: any symmetric key for the `{device id}` identity,
* no policy name,
* any expiration time.

An example using the preceding Node.js function would be:

```javascript
var endpoint ="myhub.azure-devices.net/devices/device1";
var deviceKey ="...";

var token = generateSasToken(endpoint, deviceKey, null, 60);
```

The result, which grants access to all functionality for device1, would be:

`SharedAccessSignature sr=myhub.azure-devices.net%2fdevices%2fdevice1&sig=13y8ejUk2z7PLmvtwR5RqlGBOVwiq7rQR3WZ5xZX3N4%3D&se=1456971697`

> [!NOTE]
> It's possible to generate a SAS token with the [device explorer](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/tools/DeviceExplorer) tool, the CLI extension command [az iot hub generate-sas-token](/cli/azure/ext/azure-cli-iot-ext/iot/hub?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-hub-generate-sas-token), or the [Azure IoT Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).

### Use a shared access policy

When you create a token from a shared access policy, set the `skn` field to the name of the policy. This policy must grant the **DeviceConnect** permission.

The two main scenarios for using shared access policies to access device functionality are:

* [cloud protocol gateways](iot-hub-devguide-endpoints.md),
* [token services](iot-hub-devguide-security.md#custom-device-and-module-authentication) used to implement custom authentication schemes.

Since the shared access policy can potentially grant access to connect as any device, it is important to use the correct resource URI when creating security tokens. This setting is especially important for token services, which have to scope the token to a specific device using the resource URI. This point is less relevant for protocol gateways as they are already mediating traffic for all devices.

As an example, a token service using the pre-created shared access policy called **device** would create a token with the following parameters:

* resource URI: `{IoT hub name}.azure-devices.net/devices/{device id}`,
* signing key: one of the keys of the `device` policy,
* policy name: `device`,
* any expiration time.

An example using the preceding Node.js function would be:

```javascript
var endpoint ="myhub.azure-devices.net/devices/device1";
var policyName = 'device';
var policyKey = '...';

var token = generateSasToken(endpoint, policyKey, policyName, 60);
```

The result, which grants access to all functionality for device1, would be:

`SharedAccessSignature sr=myhub.azure-devices.net%2fdevices%2fdevice1&sig=13y8ejUk2z7PLmvtwR5RqlGBOVwiq7rQR3WZ5xZX3N4%3D&se=1456971697&skn=device`

A protocol gateway could use the same token for all devices simply setting the resource URI to `myhub.azure-devices.net/devices`.

### Use security tokens from service components

Service components can only generate security tokens using shared access policies granting the appropriate permissions as explained previously.

Here are the service functions exposed on the endpoints:

| Endpoint | Functionality |
| --- | --- |
| `{iot hub host name}/devices` |Create, update, retrieve, and delete device identities. |
| `{iot hub host name}/messages/events` |Receive device-to-cloud messages. |
| `{iot hub host name}/servicebound/feedback` |Receive feedback for cloud-to-device messages. |
| `{iot hub host name}/devicebound` |Send cloud-to-device messages. |

As an example, a service generating using the pre-created shared access policy called **registryRead** would create a token with the following parameters:

* resource URI: `{IoT hub name}.azure-devices.net/devices`,
* signing key: one of the keys of the `registryRead` policy,
* policy name: `registryRead`,
* any expiration time.

```javascript
var endpoint ="myhub.azure-devices.net/devices";
var policyName = 'registryRead';
var policyKey = '...';

var token = generateSasToken(endpoint, policyKey, policyName, 60);
```

The result, which would grant access to read all device identities, would be:

`SharedAccessSignature sr=myhub.azure-devices.net%2fdevices&sig=JdyscqTpXdEJs49elIUCcohw2DlFDR3zfH5KqGJo4r4%3D&se=1456973447&skn=registryRead`

## Supported X.509 certificates

You can use any X.509 certificate to authenticate a device with IoT Hub by uploading either a certificate thumbprint or a certificate authority (CA) to Azure IoT Hub. Authentication using certificate thumbprints verifies that the presented thumbprint matches the configured thumbprint. Authentication using certificate authority validates the certificate chain. Either way, TLS handshake requires the device to have a valid certificate and private key. Refer to the TLS specification for details, for example: [RFC 5246 - The Transport Layer Security (TLS) Protocol Version 1.2](https://tools.ietf.org/html/rfc5246/).

Supported certificates include:

* **An existing X.509 certificate**. A device may already have an X.509 certificate associated with it. The device can use this certificate to authenticate with IoT Hub. Works with either thumbprint or CA authentication. 

* **CA-signed X.509 certificate**. To identify a device and authenticate it with IoT Hub, you can use an X.509 certificate generated and signed by a Certification Authority (CA). Works with either thumbprint or CA authentication.

* **A self-generated and self-signed X-509 certificate**. A device manufacturer or in-house deployer can generate these certificates and store the corresponding private key (and certificate) on the device. You can use tools such as [OpenSSL](https://www.openssl.org/) and [Windows SelfSignedCertificate](/powershell/module/pkiclient/new-selfsignedcertificate) utility for this purpose. Only works with thumbprint authentication. 

A device may either use an X.509 certificate or a security token for authentication, but not both.

For more information about authentication using certificate authority, see [Device Authentication using X.509 CA Certificates](iot-hub-x509ca-overview.md).

### Register an X.509 certificate for a device

The [Azure IoT Service SDK for C#](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/service) (version 1.0.8+) supports registering a device that uses an X.509 certificate for authentication. Other APIs such as import/export of devices also support X.509 certificates.

You can also use the CLI extension command [az iot hub device-identity](/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest) to configure X.509 certificates for devices.

### C\# Support

The **RegistryManager** class provides a programmatic way to register a device. In particular, the **AddDeviceAsync** and **UpdateDeviceAsync** methods enable you to register and update a device in the IoT Hub identity registry. These two methods take a **Device** instance as input. The **Device** class includes an **Authentication** property that allows you to specify primary and secondary X.509 certificate thumbprints. The thumbprint represents a SHA256 hash of the X.509 certificate (stored using binary DER encoding). You have the option of specifying a primary thumbprint or a secondary thumbprint or both. Primary and secondary thumbprints are supported to handle certificate rollover scenarios.

Here is a sample C\# code snippet to register a device using an X.509 certificate thumbprint:

```csharp
var device = new Device(deviceId)
{
  Authentication = new AuthenticationMechanism()
  {
    X509Thumbprint = new X509Thumbprint()
    {
      PrimaryThumbprint = "B4172AB44C28F3B9E117648C6F7294978A00CDCBA34A46A1B8588B3F7D82C4F1"
    }
  }
};
RegistryManager registryManager = RegistryManager.CreateFromConnectionString(deviceGatewayConnectionString);
await registryManager.AddDeviceAsync(device);
```

### Use an X.509 certificate during run-time operations

The [Azure IoT device SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/device) (version 1.0.11+) supports the use of X.509 certificates.

### C\# Support

The class **DeviceAuthenticationWithX509Certificate** supports the creation of 
 **DeviceClient** instances using an X.509 certificate. The X.509 certificate must be in the PFX (also called PKCS #12) format that includes the private key.

Here is a sample code snippet:

```csharp
var authMethod = new DeviceAuthenticationWithX509Certificate("<device id>", x509Certificate);

var deviceClient = DeviceClient.Create("<IotHub DNS HostName>", authMethod);
```

## Custom device and module authentication

You can use the IoT Hub [identity registry](iot-hub-devguide-identity-registry.md) to configure per-device/module security credentials and access control using [tokens](iot-hub-devguide-security.md#security-tokens). If an IoT solution already has a custom identity registry and/or authentication scheme, consider creating a *token service* to integrate this infrastructure with IoT Hub. In this way, you can use other IoT features in your solution.

A token service is a custom cloud service. It uses an IoT Hub *shared access policy* with **DeviceConnect** or **ModuleConnect** permissions to create *device-scoped* or *module-scoped* tokens. These tokens enable a device and module to connect to your IoT hub.

![Steps of the token service pattern](./media/iot-hub-devguide-security/tokenservice.png)

Here are the main steps of the token service pattern:

1. Create an IoT Hub shared access policy with **DeviceConnect** or **ModuleConnect** permissions for your IoT hub. You can create this policy in the [Azure portal](https://portal.azure.com) or programmatically. The token service uses this policy to sign the tokens it creates.

2. When a device/module needs to access your IoT hub, it requests a signed token from your token service. The device can authenticate with your custom identity registry/authentication scheme to determine the device/module identity that the token service uses to create the token.

3. The token service returns a token. The token is created by using `/devices/{deviceId}` or `/devices/{deviceId}/module/{moduleId}` as `resourceURI`, with `deviceId` as the device being authenticated or `moduleId` as the module being authenticated. The token service uses the shared access policy to construct the token.

4. The device/module uses the token directly with the IoT hub.

> [!NOTE]
> You can use the .NET class [SharedAccessSignatureBuilder](https://msdn.microsoft.com/library/microsoft.azure.devices.common.security.sharedaccesssignaturebuilder.aspx) or the Java class [IotHubServiceSasToken](/java/api/com.microsoft.azure.sdk.iot.service.auth.iothubservicesastoken) to create a token in your token service.

The token service can set the token expiration as desired. When the token expires, the IoT hub severs the device/module connection. Then, the device/module must request a new token from the token service. A short expiry time increases the load on both the device/module and the token service.

For a device/module to connect to your hub, you must still add it to the IoT Hub identity registry — even though it is using a token and not a key to connect. Therefore, you can continue to use per-device/per-module access control by enabling or disabling device/module identities in the [identity registry](iot-hub-devguide-identity-registry.md). This approach mitigates the risks of using tokens with long expiry times.

### Comparison with a custom gateway

The token service pattern is the recommended way to implement a custom identity registry/authentication scheme with IoT Hub. This pattern is recommended because IoT Hub continues to handle most of the solution traffic. However, if the custom authentication scheme is so intertwined with the protocol, you may require a *custom gateway* to process all the traffic. An example of such a scenario is using [Transport Layer Security (TLS) and pre-shared keys (PSKs)](https://tools.ietf.org/html/rfc4279). For more information, see the [protocol gateway](iot-hub-protocol-gateway.md) article.

## Reference topics:

The following reference topics provide you with more information about controlling access to your IoT hub.

## IoT Hub permissions

The following table lists the permissions you can use to control access to your IoT hub.

| Permission | Notes |
| --- | --- |
| **RegistryRead** |Grants read access to the identity registry. For more information, see [Identity registry](iot-hub-devguide-identity-registry.md). <br/>This permission is used by back-end cloud services. |
| **RegistryReadWrite** |Grants read and write access to the identity registry. For more information, see [Identity registry](iot-hub-devguide-identity-registry.md). <br/>This permission is used by back-end cloud services. |
| **ServiceConnect** |Grants access to cloud service-facing communication and monitoring endpoints. <br/>Grants permission to receive device-to-cloud messages, send cloud-to-device messages, and retrieve the corresponding delivery acknowledgments. <br/>Grants permission to retrieve delivery acknowledgments for file uploads. <br/>Grants permission to access twins to update tags and desired properties, retrieve reported properties, and run queries. <br/>This permission is used by back-end cloud services. |
| **DeviceConnect** |Grants access to device-facing endpoints. <br/>Grants permission to send device-to-cloud messages and receive cloud-to-device messages. <br/>Grants permission to perform file upload from a device. <br/>Grants permission to receive device twin desired property notifications and update device twin reported properties. <br/>Grants permission to perform file uploads. <br/>This permission is used by devices. |

## Additional reference material

Other reference topics in the IoT Hub developer guide include:

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md) describes the various endpoints that each IoT hub exposes for run-time and management operations.

* [Throttling and quotas](iot-hub-devguide-quotas-throttling.md) describes the quotas and throttling behaviors that apply to the IoT Hub service.

* [Azure IoT device and service SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.

* [IoT Hub query language](iot-hub-devguide-query-language.md) describes the query language you can use to retrieve information from IoT Hub about your device twins and jobs.

* [IoT Hub MQTT support](iot-hub-mqtt-support.md) provides more information about IoT Hub support for the MQTT protocol.

* [RFC 5246 - The Transport Layer Security (TLS) Protocol Version 1.2](https://tools.ietf.org/html/rfc5246/) provides more information about TLS authentication.

## Next steps

Now that you have learned how to control access IoT Hub, you may be interested in the following IoT Hub developer guide topics:

* [Use device twins to synchronize state and configurations](iot-hub-devguide-device-twins.md)
* [Invoke a direct method on a device](iot-hub-devguide-direct-methods.md)
* [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md)

If you would like to try out some of the concepts described in this article, see the following IoT Hub tutorials:

* [Get started with Azure IoT Hub](quickstart-send-telemetry-node.md)
* [How to send cloud-to-device messages with IoT Hub](iot-hub-csharp-csharp-c2d.md)
* [How to process IoT Hub device-to-cloud messages](tutorial-routing.md)
