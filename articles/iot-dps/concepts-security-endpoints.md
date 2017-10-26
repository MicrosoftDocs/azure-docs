---
title: Security endpoints in IoT Device Provisioning Service | Microsoft Docs
description: Concepts - how to control access to IoT Device Provisioning Service for back-end apps. Includes information about security tokens.
services: iot-dps
documentationcenter: .net
author: dsk-2015
manager: timlt
editor: ''

ms.service: iot-dps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/28/2017
ms.author: dkshir,rajeevmv

---
# Control access to Azure IoT Hub Device Provisioning Service

This article describes the options for securing your IoT device provisioning service. The provisioning service uses *permissions* to grant access to each endpoint. Permissions limit the access to a service instance based on functionality.

This article describes:

* The different permissions that you can grant to a back-end app to access your provisioning service.
* The authentication process and the tokens it uses to verify permissions.

### When to use

You must have appropriate permissions to access any of the provisioning service endpoints. For example, a back-end app must include a token containing security credentials along with every message it sends to the service.

## Access control and permissions

You can grant [permissions](#iot-dps-permissions) in the following ways:

* **Shared access authorization policies**. Shared access policies can grant any combination of [permissions](#iot-dps-permissions). You can define policies in the [Azure portal][lnk-management-portal], or programmatically by using the [Device Provisioning Service REST APIs][lnk-resource-provider-apis]. A newly created provisioning service has the following default policy:

  * **provisioningserviceowner**: Policy with all permissions.

> [!NOTE]
> See [permissions](#iot-dps-permissions) for detailed information.

## Authentication

Azure IoT Hub Device Provisioning Service grants access to endpoints by verifying a token against the shared access policies. Security credentials, such as symmetric keys, are never sent over the wire.

> [!NOTE]
> The Device Provisioning Service resource provider is secured through your Azure subscription, as are all providers in the [Azure Resource Manager][lnk-azure-resource-manager].

For more information about how to construct and use security tokens, see [IoT Hub security tokens][lnk-sas-tokens].

HTTP is the only supported protocol, and it implements authentication by including a valid token in the **Authorization** request header.

#### Example
`SharedAccessSignature sr=mydps.azure-devices-provisioning.net&sig=kPszxZZZZZZZZZZZZZZZZZAhLT%2bV7o%3d&se=1487709501&skn=provisioningserviceowner`

> [!NOTE]
> The [Azure IoT SDKs][lnk-sdks] automatically generate tokens when connecting to the service. In some cases, the Azure IoT SDKs do not support all the protocols or all the authentication methods.


## Security tokens
The Device Provisioning Service uses security tokens to authenticate services to avoid sending keys on the wire. Additionally, security tokens are limited in time validity and scope. [Azure IoT SDKs][lnk-sdks] automatically generate tokens without requiring any special configuration. Some scenarios do require you to generate and use security tokens directly. Such scenarios include the direct use of the HTTP surface.

### Security token structure

You use security tokens to grant time-bounded access for services to specific functionality in IoT Device Provisioning Service. To get authorization to connect to the provisioning service, services must send security tokens signed with either a shared access or symmetric key.

A token signed with a shared access key grants access to all the functionality associated with the shared access policy permissions. 

The security token has the following format:

`SharedAccessSignature sig={signature}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI}`

Here are the expected values:

| Value | Description |
| --- | --- |
| {signature} |An HMAC-SHA256 signature string of the form: `{URL-encoded-resourceURI} + "\n" + expiry`. **Important**: The key is decoded from base64 and used as key to perform the HMAC-SHA256 computation.|
| {expiry} |UTF8 strings for number of seconds since the epoch 00:00:00 UTC on 1 January 1970. |
| {URL-encoded-resourceURI} | Lower case URL-encoding of the lower case resource URI. URI prefix (by segment) of the endpoints that can be accessed with this token, starting with host name of the IoT Device Provisioning Service (no protocol). For example, `mydps.azure-devices-provisioning.net`. |
| {policyName} |The name of the shared access policy to which this token refers. |

**Note on prefix**: The URI prefix is computed by segment and not by character. For example `/a/b` is a prefix for `/a/b/c` but not for `/a/bc`.

The following Node.js snippet shows a function called **generateSasToken** that computes the token from the inputs `resourceUri, signingKey, policyName, expiresInMins`. The next sections detail how to initialize the different inputs for the different token use cases.

```nodejs
var generateSasToken = function(resourceUri, signingKey, policyName, expiresInMins) {
    resourceUri = encodeURIComponent(resourceUri);

    // Set expiration in seconds
    var expires = (Date.now() / 1000) + expiresInMins * 60;
    expires = Math.ceil(expires);
    var toSign = resourceUri + '\n' + expires;

    // Use crypto
    var hmac = crypto.createHmac('sha256', new Buffer(signingKey, 'base64'));
    hmac.update(toSign);
    var base64UriEncoded = encodeURIComponent(hmac.digest('base64'));

    // Construct authorization string
    var token = "SharedAccessSignature sr=" + resourceUri + "&sig="
    + base64UriEncoded + "&se=" + expires + "&skn="+ policyName;
    return token;
};
```

As a comparison, the equivalent Python code to generate a security token is:

```python
from base64 import b64encode, b64decode
from hashlib import sha256
from time import time
from urllib import quote_plus, urlencode
from hmac import HMAC

def generate_sas_token(uri, key, policy_name, expiry=3600):
    ttl = time() + expiry
    sign_key = "%s\n%d" % ((quote_plus(uri)), int(ttl))
    print sign_key
    signature = b64encode(HMAC(b64decode(key), sign_key, sha256).digest())

    rawtoken = {
        'sr' :  uri,
        'sig': signature,
        'se' : str(int(ttl)),
        'skn' : policy_name
    }

    return 'SharedAccessSignature ' + urlencode(rawtoken)
```

> [!NOTE]
> Since the time validity of the token is validated on IoT Device Provisioning Service machines, the drift on the clock of the machine that generates the token must be minimal.


### Use security tokens from service components

Service components can only generate security tokens using shared access policies granting the appropriate permissions as explained previously.

Here are the service functions exposed on the endpoints:

| Endpoint | Functionality |
| --- | --- |
| `{your-service}.azure-devices-provisioning.net/enrollments` |Provides device enrollment operations with the Device Provisioning Service. |
| `{your-service}.azure-devices-provisioning.net/enrollmentGroups` |Provides operations for managing device enrollment groups. |
| `{your-service}.azure-devices-provisioning.net/registrations/{id}` |Provides operations for retrieving and managing the status of device registrations. |

## <!-- TBD: [RV] I rewrote this example using a fictious policy named 'enrollmentread'.Such a policy is not created by default. The user needs to be given steps to create such a policy via portal -->
As an example, a service generated using a pre-created shared access policy called **enrollmentread** would create a token with the following parameters:

* resource URI: `{mydps}.azure-devices-provisioning.net`,
* signing key: one of the keys of the `enrollmentread` policy,
* policy name: `enrollmentread`,
* any expiration time.

```nodejs
var endpoint ="mydps.azure-devices-provisioning.net";
var policyName = 'enrollmentread'; 
var policyKey = '...';

var token = generateSasToken(endpoint, policyKey, policyName, 60);
```

The result, which would grant access to read all enrollment records, would be:

`SharedAccessSignature sr=mydps.azure-devices-provisioning.net&sig=JdyscqTpXdEJs49elIUCcohw2DlFDR3zfH5KqGJo4r4%3D&se=1456973447&skn=enrollmentread`

## Reference topics:

The following reference topics provide you with more information about controlling access to your IoT Device Provisioning Service.

## Device Provisioning Service permissions

The following table lists the permissions you can use to control access to your IoT Device Provisioning Service.

| Permission | Notes |
| --- | --- |
| **ServiceConfig** |Grants access to change the service configurations. <br/>This permission is used by back-end cloud services. |
| **EnrollmentRead** |Grants read access to the device enrollments and enrollment groups. <br/>This permission is used by back-end cloud services. |
| **EnrollmentWrite** |Grants write access to the device enrollments and enrollment groups. <br/>This permission is used by back-end cloud services. |
| **RegistrationStatusRead** |Grants read access to the device registration status. <br/>This permission is used by back-end cloud services. |
| **RegistrationStatusWrite**  |Grants delete access to the device registration status. <br/>This permission is used by back-end cloud services. |

## Additional reference material

For further details, please refer to the following topics in the IoT Hub developer guide:

* [IoT Hub endpoints][lnk-endpoints] describes the various endpoints that each IoT hub exposes for run-time and management operations.
* [Throttling and quotas][lnk-quotas] describes the quotas and throttling behaviors that apply to the IoT Hub service.
* [Azure IoT device and service SDKs][lnk-sdks] lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.
* [IoT Hub query language][lnk-query] describes the query language you can use to retrieve information from IoT Hub about your device twins and jobs.

<!-- links and images -->

[img-tokenservice]: ./media/iot-hub-devguide-security/tokenservice.png
[lnk-endpoints]: ../iot-hub/iot-hub-devguide-endpoints.md
[lnk-quotas]: ../iot-hub/iot-hub-devguide-quotas-throttling.md
[lnk-sdks]: ../iot-hub/iot-hub-devguide-sdks.md
[lnk-query]: ../iot-hub/iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: ../iot-hub/iot-hub-mqtt-support.md
[lnk-openssl]: https://www.openssl.org/
[lnk-selfsigned]: https://technet.microsoft.com/library/hh848633

[lnk-resource-provider-apis]: https://docs.microsoft.com/rest/api/iot-dps
[lnk-sas-tokens]: ../iot-hub/iot-hub-devguide-security.md#security-tokens
[lnk-amqp]: https://www.amqp.org/
[lnk-azure-resource-manager]: ../azure-resource-manager/resource-group-overview.md
[lnk-cbs]: https://www.oasis-open.org/committees/download.php/50506/amqp-cbs-v1%200-wd02%202013-08-12.doc
[lnk-event-hubs-publisher-policy]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-99ce67ab
[lnk-management-portal]: https://portal.azure.com
[lnk-sasl-plain]: http://tools.ietf.org/html/rfc4616
[lnk-identity-registry]: ../iot-hub/iot-hub-devguide-identity-registry.md
[lnk-dotnet-sas]: https://msdn.microsoft.com/library/microsoft.azure.devices.common.security.sharedaccesssignaturebuilder.aspx
[lnk-java-sas]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service.auth._iot_hub_service_sas_token
[lnk-tls-psk]: https://tools.ietf.org/html/rfc4279
[lnk-protocols]: ../iot-hub/iot-hub-protocol-gateway.md
[lnk-custom-auth]: ../iot-hub/iot-hub-devguide-security.md#custom-device-authentication
[lnk-x509]: ../iot-hub/iot-hub-devguide-security.md#supported-x509-certificates
[lnk-devguide-device-twins]: ../iot-hub/iot-hub-devguide-device-twins.md
[lnk-devguide-directmethods]: ../iot-hub/iot-hub-devguide-direct-methods.md
[lnk-devguide-jobs]: ../iot-hub/iot-hub-devguide-jobs.md
[lnk-service-sdk]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/service
[lnk-client-sdk]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/device
[lnk-device-explorer]: https://github.com/Azure/azure-iot-sdk-csharp/blob/master/tools/DeviceExplorer
[lnk-iothub-explorer]: https://github.com/azure/iothub-explorer

[lnk-getstarted-tutorial]: ../iot-hub/iot-hub-csharp-csharp-getstarted.md
[lnk-c2d-tutorial]: ../iot-hub/iot-hub-csharp-csharp-c2d.md
[lnk-d2c-tutorial]: ../iot-hub/iot-hub-csharp-csharp-process-d2c.md
