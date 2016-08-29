<properties
 pageTitle="How to generate IoT Hub security tokens | Microsoft Azure"
 description="Description of the different types of security tokens (such as SAS and X.509) used by IoT Hub and how to generate them."
 services="iot-hub"
 documentationCenter=".net"
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="06/07/2016"
 ms.author="elioda"/>

# Use IoT Hub security tokens and X.509 certificates

IoT Hub uses security tokens to authenticate devices and services to avoid sending keys on the wire. Additionally, security tokens are limited in time validity and scope. [Azure IoT Hub SDKs][lnk-apis-sdks] automatically generate tokens without requiring any special configuration. Some scenarios, however, require the user to generate and use security tokens directly. These include the direct use of the AMQP, MQTT, or HTTP surfaces, or the implementation of the token service pattern, as explained in [IoT Hub guidance][lnk-guidance-security].

IoT Hub also allows devices to authenticate with IoT Hub using X.509 certificates. IoT Hub supports X.509 based authentication for devices over the AMQP, AMQP over WebSockets and HTTP protocols.

This article describes:

* The format of the security tokens and how to generate them.
* The main use cases for using security tokens to authenticate both devices and back-end services.
* Supported X.509 certificates for authentication of devices.
* Process of registering a X.509 client certificate tied to a specific device.
* Runtime flow between device and IoT Hub using an X.509 client certificate for authentication.


## Security token structure
You use security tokens to grant time-bounded access to devices and services to specific functionality in IoT Hub. To ensure that only authorized devices and services can connect, security tokens must be signed with either a shared access policy key or a symmetric key stored with a device identity in the identity registry.

A token signed with a shared access policy key grants access to all the functionality associated with the shared access policy permissions. Refer to the [security section of the IoT Hub developer guide][lnk-devguide-security]. On the other hand, a token signed with a device identity's symmetric key only grants the **DeviceConnect** permission for the associated device identity.

The security token has the following format:

    SharedAccessSignature sig={signature-string}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI}

These are the expected values:

| Value | Description |
| ----- | ----------- |
| {signature} | An HMAC-SHA256 signature string of the form: `{URL-encoded-resourceURI} + "\n" + expiry`. **Important**: The key is decoded from base64 and used as key to perform the HMAC-SHA256 computation. |
| {resourceURI} | URI prefix (by segment) of the endpoints that can be accessed with this token, starting with hostname of the IoT hub (no protocol). For example, `myHub.azure-devices.net/devices/device1` |
| {expiry} | UTF8 strings for number of seconds since the epoch 00:00:00 UTC on 1 January 1970. |
| {URL-encoded-resourceURI} | Lower case URL-encoding of the lower case resource URI |
| {policyName} | The name of the shared access policy to which this token refers. Absent in the case of tokens referring to device-registry credentials. |

**Note on prefix**: The URI prefix is computed by segment and not by character. For example `/a/b` is a prefix for `/a/b/c` but not for `/a/bc`.

This is a Node function that computes the token from the inputs `resourceUri, signingKey, policyName, expiresInMins`. The next sections will detail how to initialize the different inputs for the different token use cases.

    var crypto = require('crypto');

    var generateSasToken = function(resourceUri, signingKey, policyName, expiresInMins) {
        resourceUri = encodeURIComponent(resourceUri.toLowerCase()).toLowerCase();

        // Set expiration in seconds
        var expires = (Date.now() / 1000) + expiresInMins * 60;
        expires = Math.ceil(expires);
        var toSign = resourceUri + '\n' + expires;

        // using crypto
        var decodedPassword = new Buffer(signingKey, 'base64').toString('binary');
        const hmac = crypto.createHmac('sha256', decodedPassword);
        hmac.update(toSign);
        var base64signature = hmac.digest('base64');
        var base64UriEncoded = encodeURIComponent(base64signature);

        // construct autorization string
        var token = "SharedAccessSignature sr=" + resourceUri + "&sig="
        + base64UriEncoded + "&se=" + expires;
        if (policyName) token += "&skn="+policyName;
        // console.log("signature:" + token);
        return token;
    };
 
 For comparison purposes, the equivalent Python code is:
 
    from base64 import b64encode, b64decode
    from hashlib import sha256
    from hmac import HMAC
    from urllib import urlencode
    
    def generate_sas_token(uri, key, policy_name='device', expiry=3600):
        ttl = time() + expiry
        sign_key = "%s\n%d" % (uri, int(ttl))
        signature = b64encode(HMAC(b64decode(key), sign_key, sha256).digest())
     
        return 'SharedAccessSignature ' + urlencode({
            'sr' :  uri,
            'sig': signature,
            'se' : str(int(ttl)),
            'skn': policy_name
        })

> [AZURE.NOTE] Since the time validity of the token is validated on IoT Hub machines, it is important that the drift on the clock of the machine that generates the token be minimal.

## Use SAS tokens as a device

There are two ways to obtain **DeviceConnect** permissions with IoT Hub with security tokens: using a device identity key, or a shared access policy key.

Moreover, it is important to note that all functionality accessible from devices is exposed by design on endpoints with prefix `/devices/{deviceId}`.

> [AZURE.IMPORTANT] The only way that IoT Hub authenticates a specific device is using the device identity symmetric key. In cases when a shared access policy is used to access device functionality, the solution must consider the component issuing the security token as a trusted subcomponent.

The device-facing endpoints are (irrespective of the protocol):

| Endpoint | Functionality |
| ----- | ----------- |
| `{iot hub host name}/devices/{deviceId}/messages/events` | Send device-to-cloud messages. |
| `{iot hub host name}/devices/{deviceId}/devicebound` | Receive cloud-to-device messages. |

### Use a symmetric key in the identity registry

When using a device identity's symmetric key to generate a token the policyName (`skn`) element of the token is omitted.

For example, a token created to access all device functionality should have the following parameters:

* resource URI: `{IoT hub name}.azure-devices.net/devices/{device id}`,
* signing key: any symmetric key for the `{device id}` identity,
* no policy name,
* any expiration time.

An example using the Node function above would be:

    var endpoint ="myhub.azure-devices.net/devices/device1";
    var deviceKey ="...";

    var token = generateSasToken(endpoint, deviceKey, null, 60);

The result, which grants access to all functionality for device1, would be:

    SharedAccessSignature sr=myhub.azure-devices.net%2fdevices%2fdevice1&sig=13y8ejUk2z7PLmvtwR5RqlGBOVwiq7rQR3WZ5xZX3N4%3D&se=1456971697

> [AZURE.NOTE] It is possible to generate a secure token using the .NET tool [Device Explorer][lnk-device-explorer].

### Use a shared access policy

When creating a token from a shared access policy, the policy name field `skn` must be set to the name of the policy used. It is also required that the policy grants the **DeviceConnect** permission.

The two main scenarios for using shared access policies to access device functionality are:

* [cloud protocol gateways][lnk-azure-protocol-gateway],
* [token services][lnk-devguide-security] used to implement custom authentication schemes.

Since the shared access policy can potentially grant access to connect as any device, it is important to use the correct resource URI when creating security tokens. This is especially important for token services, which have to scope the token to a specific device using the resource URI. This point is less relevant for protocol gateways as they are already mediating traffic for all devices.

As an example, a token service using the precreated shared access policy called **device** would create a token with the following parameters:

* resource URI: `{IoT hub name}.azure-devices.net/devices/{device id}`,
* signing key: one of the keys of the `device` policy,
* policy name: `device`,
* any expiration time.

An example using the Node function above would be:

    var endpoint ="myhub.azure-devices.net/devices/device1";
    var policyName = 'device';
    var policyKey = '...';

    var token = generateSasToken(endpoint, policyKey, policyName, 60);

The result, which grants access to all functionality for device1, would be:

    SharedAccessSignature sr=myhub.azure-devices.net%2fdevices%2fdevice1&sig=13y8ejUk2z7PLmvtwR5RqlGBOVwiq7rQR3WZ5xZX3N4%3D&se=1456971697&skn=device

A protocol gateway could use the same token for all devices simply setting the resource URI to `myhub.azure-devices.net/devices`.

## Use security tokens from service components

Service components can only generate security tokens using shared access policies granting the appropriate permissions as explained in the [security section of the IoT Hub developer guide][lnk-devguide-security].

These are the service functions exposed on the endpoints:

| Endpoint | Functionality |
| ----- | ----------- |
| `{iot hub host name}/devices` | Create, update, retrieve, and delete device identities. |
| `{iot hub host name}/messages/events` | Receive device-to-cloud messages. |
| `{iot hub host name}/servicebound/feedback` | Receive feedback for cloud-to-device messages. |
| `{iot hub host name}/devicebound` | Send cloud-to-device messages. |

As an example, a service generating using the precreated shared access policy called **registryRead** would create a token with the following parameters:

* resource URI: `{IoT hub name}.azure-devices.net/devices`,
* signing key: one of the keys of the `registryRead` plocy,
* policy name: `registryRead`,
* any expiration time.

    var endpoint ="myhub.azure-devices.net/devices";
    var policyName = 'device';
    var policyKey = '...';

    var token = generateSasToken(endpoint, policyKey, policyName, 60);

The result, which would grant access to read all device identities, would be:

    SharedAccessSignature sr=myhub.azure-devices.net%2fdevices&sig=JdyscqTpXdEJs49elIUCcohw2DlFDR3zfH5KqGJo4r4%3D&se=1456973447&skn=registryRead

## Supported X.509 certificates

You can use any X.509 certificate to authenticate a device with IoT Hub. This includes:

-   **An existing X.509 certificate**. A device may already have an X.509 certificate associated with it. The device can use this certificate to authenticate with IoT Hub.

-   **A self-generated and self-signed X-509 certificate**. A device manufacturer or in-house deployer can generate these certificates and store the corresponding private key (and certificate) on the device. You can use tools such as [OpenSSL] and [Windows SelfSignedCertificate] utility for this purpose.

-   **CA-signed X.509 certificate**. You can also use an X.509 certificate generated and signed by a Certification Authority (CA) to identify a device and authenticate a device with IoT Hub.

A device may either use a X.509 certificate or a security token for authentication, but not both.

## Register an X.509 client certificate for a device

The [Azure IoT Service SDK for C#][lnk-service-sdk] (version 1.0.8+) supports registering a device which uses an X.509 client certificate for authentication. Other APIs such as import/export of devices also support X.509 client certificates.

### C\# Support

The **RegistryManager** class provides a programmatic way to register a device. In particular, the **AddDeviceAsync** and **UpdateDeviceAsync** methods enable a user to register and update a device in the Iot Hub device identity registry. These two methods take a **Device** instance as input. The **Device** class includes an **Authentication** property which allows the user to specify primary and secondary X.509 certificate thumbprints. The thumbprint represents a SHA-1 hash of the X.509 certificate (stored using binary DER encoding). Users have the option of specifying a primary thumbprint or a secondary thumbprint or both. Primary and secondary thumbprints are supported in order to handle certificate rollover scenarios.

> [AZURE.NOTE] IoT Hub does not require or store the entire X.509 client certificate, only the thumbprint.

Here is a sample C\# code snippet to register a device using a X.509 client certificate:

```
var device = new Device(deviceId)
{
  Authentication = new AuthenticationMechanism()
  {
    X509Thumbprint = new X509Thumbprint()
    {
      PrimaryThumbprint = "921BC9694ADEB8929D4F7FE4B9A3A6DE58B0790B"
    }
  }
};
RegistryManager registryManager = RegistryManager.CreateFromConnectionString(deviceGatewayConnectionString);
await registryManager.AddDeviceAsync(device);
```

## Use an X.509 client certificate during runtime operations

The [Azure IoT device SDK for .NET][lnk-client-sdk] (version 1.0.11+) supports the use of X.509 client certificates.

### C\# Support

The class **DeviceAuthenticationWithX509Certificate** supports the creation of 
 **DeviceClient** instances using an X.509 client certificate.

Here is a sample code snippet:

```
var authMethod = new DeviceAuthenticationWithX509Certificate("<device id>", x509Certificate);

var deviceClient = DeviceClient.Create("<IotHub DNS HostName>", authMethod);
```

[lnk-apis-sdks]: https://github.com/Azure/azure-iot-sdks/blob/master/readme.md
[lnk-guidance-security]: iot-hub-guidance.md#customauth
[lnk-devguide-security]: iot-hub-devguide.md#security
[lnk-azure-protocol-gateway]: iot-hub-protocol-gateway.md
[lnk-device-explorer]: https://github.com/Azure/azure-iot-sdks/blob/master/tools/DeviceExplorer/doc/how_to_use_device_explorer.md

[OpenSSL]: https://www.openssl.org/
[Windows SelfSignedCertificate]: https://technet.microsoft.com/library/hh848633
[lnk-service-sdk]: https://github.com/Azure/azure-iot-sdks/tree/master/csharp/service
[lnk-client-sdk]: https://github.com/Azure/azure-iot-sdks/tree/master/csharp/device
