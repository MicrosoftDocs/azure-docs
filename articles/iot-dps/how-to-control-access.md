---
title: Access control and security for DPS with security tokens
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Control access to Azure IoT Hub Device Provisioning Service (DPS) for backend apps by using shared access signatures and security tokens.
author: kgremban

ms.service: iot-dps
ms.topic: concept-article
ms.date: 09/22/2021
ms.author: kgremban
ms.custom: devx-track-csharp
---

# Control access to Azure IoT Hub Device Provisioning Service (DPS) with shared access signatures and security tokens

This article describes the available options for securing your Azure IoT Hub Device Provisioning Service (DPS). The provisioning service uses *authentication* and *permissions* to grant access to each endpoint. Permissions allow the authentication process to limit access to a service instance based on functionality.

This article discusses:

* The authentication process and the tokens the provisioning service uses to verify permissions against both the [Service and Device REST APIs](/rest/api/iot-dps/).

* The different permissions that you can grant to a backend app to access the Service API.

## Authentication

The Device API supports key-based and X.509 certificated-based device authentication.  

The Service API supports key-based authentication for backend apps.  

When using key-based authentication, the Device Provisioning Service uses security tokens to authenticate services to avoid sending keys on the wire. Additionally, security tokens are limited in time validity and scope. Azure IoT Device Provisioning SDKs automatically generate tokens without requiring any special configuration.  

In some cases you may need to use the HTTP Device Provisioning Service REST APIs directly, without using the SDKs. The following sections describe how to authenticate directly against the REST APIs.

## Device API authentication

The [Device API](/rest/api/iot-dps/device/runtime-registration) is used by devices to attest to the Device Provisioning Service and receive an IoT Hub connection.

>[!NOTE]
>In order to receive an authenticated connection, devices must first be registered in the Device Provisioning Service through an enrollment. Use the Service API to programmatically register a device through an enrollment.

A device must authenticate to the Device API as part of the provisioning process. The method a device uses to authenticate is defined when you set up an enrollment group or individual enrollment. Whatever the authentication method, the device must issue an HTTPS PUT to the following URL to provision itself.

```http
    https://global.azure-devices-provisioning.net/[ID_Scope]/registrations/[registration_id]/register?api-version=2021-06-01
```
If using key-based authentication, a security token is passed in the HTTP **Authorization** request header in the following format:

```bash
    SharedAccessSignature sig={signature}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI} 
```

### Security token structure for key-based authentication

The security token is passed in the HTTP **Authorization** request header in the following format:

```bash
    SharedAccessSignature sig={signature}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI} 
```

The expected values are:

| Value  | Description |
|:-------|:------------|
| `{signature}`  | An HMAC-SHA256 signature string of the form: `{URL-encoded-resourceURI} + "\n" + expiry`. **Important**: The key is decoded from base64 and used as key to do the HMAC-SHA256 computation. |
| `{expiry}`  | UTF8 strings for number of seconds since the epoch 00:00:00 UTC on 1 January 1970.  |
| `{URL-encoded-resourceURI}`   |Lower case URL-encoding of `{ID_Scope}/registrations/{registration_id}` |
| `{policyName}`  | For the Device API, this policy is always “registration”. |

The following Python snippet shows a function called `generate_sas_token` that computes the token from the inputs `uri`, `key`, `policy_name`, `expiry` for an individual enrollment using a symmetric key authentication type.

```python

from base64 import b64encode, b64decode, encode 
from hashlib import sha256 
from time import time 
from urllib.parse import quote_plus, urlencode 
from hmac import HMAC 

 def generate_sas_token(uri, key, policy_name, expiry=3600): 
    ttl = time() + expiry 
    sign_key = "%s\n%d" % ((quote_plus(uri)), int(ttl)) 
    signature = b64encode(HMAC(b64decode(key), sign_key.encode('utf-8'), sha256).digest()) 

    rawtoken = { 
        'sr' :  uri, 
        'sig': signature, 
        'se' : str(int(ttl)), 
        'skn' : policy_name 
    } 

    return 'SharedAccessSignature ' + urlencode(rawtoken) 

print(generate_sas_token("myIdScope/registrations/mydeviceregistrationid", "00mysymmetrickey", "registration"))

```

The result should resemble the following output:

```bash

SharedAccessSignature sr=myIdScope%2Fregistrations%2Fmydeviceregistrationid&sig=SDpdbUNk%2F1DSjEpeb29BLVe6gRDZI7T41Y4BPsHHoUg%3D&se=1630175722&skn=registration 
```

The following example shows how the shared access signature is then used to authenticate with the Device API.  

```python

curl -L -i -X PUT -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: [token]' -d '{"registrationId": "[registration_id]"}' https://global.azure-devices-provisioning.net/[ID_Scope]/registrations/[registration_id]/register?api-version=2021-06-01 

```

If using a symmetric key-based enrollment group, you'll need to first generate a `device symmetric` key using the enrollment group key. Use the enrollment group primary or secondary key to compute an HMAC-SHA256 of the registration ID for the device. The result is then converted into Base64 format to obtain the derived device key. To view code examples, see [How to provision devices using symmetric key enrollment groups](how-to-legacy-device-symm-key.md?tabs=linux%22%20%5Cl%20%22derive-a-device-key). Once the device symmetric key has been derived, you can register the device using the previous examples.

>[!WARNING]
>To avoid including the group master key in your device code, the process of deriving device key should be done off the device.

### Certificate-based authentication 

If you've set up an individual enrollment or enrollment group for X.509 certificated-based authentication, the device will need to use its issued X.509 certificate to attest to Device API. Refer to the following articles on how to set up the enrollment and generate the device certificate.

* Quickstart - [Provision simulated X.509 device to Azure IoT Hub](quick-create-simulated-device-x509.md)

* Quickstart -  [Enroll X.509 devices to Azure Device Provisioning Service](quick-enroll-device-x509.md)

Once the enrollment has been set up and the device certificate issued, the following example demonstrates how to authenticate to Device API with the device’s X.509 certificate.

```bash

curl -L -i -X PUT –cert ./[device_cert].pem –key ./[device_cert_private_key].pem -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -d '{"registrationId": "[registration_id]"}' https://global.azure-devices-provisioning.net/[ID_Scope]/registrations/[registration_id]/register?api-version=2021-06-01 

```

## Service API authentication

The [Service API](/rest/api/iot-dps/service/device-registration-state) is used to retrieve registration state and remove device registrations. The service is also used by backend apps to programmatically manage both [individual groups](/rest/api/iot-dps/service/individual-enrollment) and [enrollment groups](/rest/api/iot-dps/service/enrollment-group). The Service API supports key-based authentication for backend apps.  

You must have appropriate permissions to access any of the Service API endpoints. For example, a backend app must include a token containing security credentials along with every message it sends to the service.

Azure IoT Hub Device Provisioning Service grants access to endpoints by verifying the token against the shared access policies. Security credentials, such as symmetric keys, are never sent over the wire.

### Access control and permissions

You can grant [permissions](#device-provisioning-service-permissions) in the following ways:

* **Shared access authorization policies**. Shared access policies can grant any combination of [permissions](#device-provisioning-service-permissions). You can define policies in the [Azure portal](https://portal.azure.com), or programmatically by using the [Device Provisioning Service REST APIs][lnk-resource-provider-apis]. A newly created provisioning service has the following default policy:

* **provisioningserviceowner**: Policy with all permissions. See [permissions](#device-provisioning-service-permissions) for detailed information.

> [!NOTE]
> The Device Provisioning Service resource provider is secured through your Azure subscription, as are all providers in the [Azure Resource Manager][lnk-azure-resource-manager].

For more information about how to construct and use security tokens, see the next section.

HTTP is the only supported protocol, and it implements authentication by including a valid token in the **Authorization** request header.

#### Example

```bash
SharedAccessSignature sr = 
   mydps.azure-devices-provisioning.net&sig=kPszxZZZZZZZZZZZZZZZZZAhLT%2bV7o%3d&se=1487709501&skn=provisioningserviceowner`\
```

> [!NOTE]
> The [Azure IoT Device Provisioning Service SDKs][lnk-sdks] automatically generate tokens when connecting to the service.

### Security tokens

The Device Provisioning Service uses security tokens to authenticate services to avoid sending keys on the wire. Additionally, security tokens are limited in time validity and scope. [Azure IoT Device Provisioning Service SDKs][lnk-sdks] automatically generate tokens without requiring any special configuration. Some scenarios do require you to generate and use security tokens directly. Such scenarios include the direct use of the HTTP surface.

### Security token structure

You use security tokens to grant time-bounded access for services to specific functionality in IoT Device Provisioning Service. To get authorization to connect to the provisioning service, services must send security tokens signed with either a shared access or symmetric key.

A token signed with a shared access key grants access to all the functionality associated with the shared access policy permissions. 

The security token has the following format:

`SharedAccessSignature sig={signature}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI}`

Here are the expected values

| Value | Description |
| --- | --- |
| {signature} |An HMAC-SHA256 signature string of the form: `{URL-encoded-resourceURI} + "\n" + expiry`. **Important**: The key is decoded from base64 and used as key to do the HMAC-SHA256 computation.|
| {expiry} |UTF8 strings for number of seconds since the epoch 00:00:00 UTC on 1 January 1970. |
| {URL-encoded-resourceURI} | Lower case URL-encoding of the lower case resource URI. URI prefix (by segment) of the endpoints that can be accessed with this token, starting with host name of the IoT Device Provisioning Service (no protocol). For example, `mydps.azure-devices-provisioning.net`. |
| {policyName} |The name of the shared access policy to which this token refers. |

>[!NOTE]
>The URI prefix is computed by segment and not by character. For example `/a/b` is a prefix for `/a/b/c` but not for `/a/bc`.

The following Node.js snippet shows a function called **generateSasToken** that computes the token from the inputs `resourceUri, signingKey, policyName, expiresInMins`. The next sections detail how to initialize the different inputs for the different token use cases.

```javascript
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
from urllib.parse import quote_plus, urlencode
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


As an example, a service generated using a pre-created shared access policy called `enrollmentread` would create a token with the following parameters:

* resource URI: `{mydps}.azure-devices-provisioning.net`,
* signing key: one of the keys of the `enrollmentread` policy,
* policy name: `enrollmentread`,
* any expiration time.backn

![Create a shared access policy for your Device Provisioning Service instance in the portal][img-add-shared-access-policy]

```javascript
var endpoint ="mydps.azure-devices-provisioning.net";
var policyName = 'enrollmentread'; 
var policyKey = '...';

var token = generateSasToken(endpoint, policyKey, policyName, 60);
```

The result, which would grant access to read all enrollment records, would be:

`SharedAccessSignature sr=mydps.azure-devices-provisioning.net&sig=JdyscqTpXdEJs49elIUCcohw2DlFDR3zfH5KqGJo4r4%3D&se=1456973447&skn=enrollmentread`

## SDKs and samples

- [Azure IoT SDK for Java Preview Release ](https://aka.ms/IoTDPSJavaSDKRBAC)
    - [Sample](https://aka.ms/IoTDPSJavaSDKSASSample])
- [Microsoft Azure IoT SDKs for .NET Preview Release](https://aka.ms/IoTDPScsharpSDKRBAC)
    - [Sample](https://aka.ms/IoTDPSscharpSDKSASSample)

## Reference topics:

The following reference topics provide you with more information about controlling access to your IoT Device Provisioning Service.

### Device Provisioning Service permissions

The following table lists the permissions you can use to control access to your IoT Device Provisioning Service.

| Permission | Notes |
| --- | --- |
| **ServiceConfig** |Grants access to change the service configurations. <br/>This permission is used by backend cloud services. |
| **EnrollmentRead** |Grants read access to the device enrollments and enrollment groups. <br/>This permission is used by backend cloud services. |
| **EnrollmentWrite** |Grants write access to the device enrollments and enrollment groups. <br/>This permission is used by backend cloud services. |
| **RegistrationStatusRead** |Grants read access to the device registration status. <br/>This permission is used by backend cloud services. |
| **RegistrationStatusWrite**  |Grants delete access to the device registration status. <br/>This permission is used by backend cloud services. |

<!-- links and images -->

[img-add-shared-access-policy]: ./media/how-to-control-access/how-to-add-shared-access-policy.PNG
[lnk-sdks]: ../iot-hub/iot-hub-devguide-sdks.md
[lnk-azure-resource-manager]: ../azure-resource-manager/management/overview.md
[lnk-resource-provider-apis]: /rest/api/iot-dps/
