---
title: How to use raw HTTPS in Azure IoT Hub Device Provisioning Service
description: This article shows how to use symmetric keys over HTTPS in your Device Provisioning Service (DPS) instance
author: kgremban
ms.author: kgremban
ms.date: 08/19/2022
ms.topic: how-to
ms.service: iot-dps
services: iot-dps
manager: lizross
---

# How to use symmetric keys over HTTPS without an SDK

In this how-to article, you'll provision a device using symmetric keys over HTTPS without using a an Azure IoT DPS device SDK. Most languages provide libraries to send HTTP requests, but, rather than focus on a specific language, in this article, you'll use the [cURL](https://en.wikipedia.org/wiki/CURL) command-line tool to send and receive over HTTPS.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

* Install [Python 3.7](https://www.python.org/downloads/) or later installed on your machine. You can check your version of Python by running `python --version`.

* Install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository.

## Overview

This article shows how to provision a device that uses symmetric key attestation using HTTPS requests via the cURL command-line tool.

## Use an individual enrollment

If you want to create a new individual enrollment to use for this article, you can use the [az iot dps enrollment create](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-create) command to create an individual enrollment for symmetric key attestation.

The following command creates an enrollment entry with the default allocation policy for your DPS instance and lets DPS assign the primary and secondary keys for your device. Substitute the name of your resource group and DPS instance. The enrollment ID is the registration ID for your device. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). Make sure the enrollment ID you use in the command adheres to this format.

```azurecli
az iot dps enrollment create -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --attestation-type symmetrickey
```

The assigned symmetric keys are returned in the **attestation** property in the response:

```json

{
  "allocationPolicy": null,
  "attestation": {
    "symmetricKey": {
      "primaryKey": "G3vn0IZH9oK3d4wsxFpWBtd2KUrtjI+39dZVRf26To8w9OX0LaFV9yZ93ELXY7voqHEUsNhnb9bt717UP87KxA==",
      "secondaryKey": "4lNxgD3lUAOEOied5/xOocyiUSCAgS+4b9OvXLDi8ug46/CJzIn/3rN6Ys6gW8SMDDxMQDaMRnIoSd1HJ5qn/g=="
    },
    "tpm": null,
    "type": "symmetricKey",
    "x509": null
  },

  ...

}
```

If you want to use an existing individual enrollment for this article, you can get the primary key with the [az iot dps enrollment show](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-show) command:

```azurecli
az iot dps enrollment show -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --show-keys true
```

Note down the primary key and the registration ID (enrollment ID) for your individual enrollment entry, you'll use them later in this article.

## Use an enrollment group

If you want to to create a new enrollment group to use for this article, you can use the [az iot dps enrollment-group create](/cli/azure/iot/dps/enrollment-group#az-iot-dps-enrollment-group-create) command to create an enrollment group for symmetric key attestation.

The following command creates an enrollment group entry with the default allocation policy for your DPS instance and lets DPS assign the primary and secondary keys for the enrollment group. Substitute the name of your resource group and DPS instance.  

```azurecli
az iot dps enrollment create -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id}
```

The assigned symmetric keys are returned in the **attestation** property in the response:

```json

{
  "allocationPolicy": null,
  "attestation": {
    "symmetricKey": {
      "primaryKey": "G3vn0IZH9oK3d4wsxFpWBtd2KUrtjI+39dZVRf26To8w9OX0LaFV9yZ93ELXY7voqHEUsNhnb9bt717UP87KxA==",
      "secondaryKey": "4lNxgD3lUAOEOied5/xOocyiUSCAgS+4b9OvXLDi8ug46/CJzIn/3rN6Ys6gW8SMDDxMQDaMRnIoSd1HJ5qn/g=="
    },
    "tpm": null,
    "type": "symmetricKey",
    "x509": null
  },

  ...

}
```

If you want to use an existing individual enrollment for this article, you can get the primary key with the [az iot dps enrollment-group show](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-show) command:

```azurecli
az iot dps enrollment-group show -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --show-keys true
```

Note down the primary key.

### Derive a device key

When using symmetric key attestation with group enrollments, you don't use the enrollment group keys directly. Instead, you derive a unique key for each device from the enrollment group key. For more information, see [Group Enrollments with symmetric keys](concepts-symmetric-key-attestation.md#group-enrollments).

In this section, you'll generate a device key from the enrollment group primary key to compute an [HMAC-SHA256](https://wikipedia.org/wiki/HMAC) of the unique registration ID for the device. The result will then be converted into Base64 format.

1. Generate your unique key using **openssl**. You'll use the following Bash shell script. Replace `{primary-key}` with the enrollment group's **Primary Key** that you copied earlier and replace `{contoso-simdevice}`with the registration ID you want to use for the device. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`).

    ```bash
    KEY={primary-key}
    REG_ID={contoso-simdevice}
    
    keybytes=$(echo $KEY | base64 --decode | xxd -p -u -c 1000)
    echo -n $REG_ID | openssl sha256 -mac HMAC -macopt hexkey:$keybytes -binary | base64
    ```

2. The script will output something like the following key:

    ```bash
    p3w2DQr9WqEGBLUSlFi1jPQ7UWQL4siAGy75HFTFbf8=
    ```

Note down the derived device key and the registration ID you used to generate it, you'll use them in the next section.

You can also use the Azure CLI or PowerShell to derive a device key. To learn more, see [Derive a device key](how-to-legacy-device-symm-key.md#derive-a-device-key).

## Create a SAS token

To You use security tokens to grant time-bounded access for services to specific functionality in IoT Device Provisioning Service. To get authorization to connect to the provisioning service, services must send security tokens signed with either a shared access or symmetric key.

A token signed with a shared access key grants access to all the functionality associated with the shared access policy permissions.

```python
from base64 import b64encode, b64decode
from hashlib import sha256
from time import time
from urllib.parse import quote_plus, urlencode
from hmac import HMAC

def generate_sas_token(uri, key, policy_name, expiry=3600):
     ttl = time() + expiry
     sign_key = "%s\n%d" % ((quote_plus(uri)), int(ttl))
     print(sign_key)
     signature = b64encode(HMAC(b64decode(key), sign_key.encode('utf-8'), sha256).digest())

     rawtoken = {
         'sr' :  uri,
         'sig': signature,
         'se' : str(int(ttl))
     }

     if policy_name is not None:
         rawtoken['skn'] = policy_name

     return 'SharedAccessSignature ' + urlencode(rawtoken)

uri = '0ne003D3F98/registrations/my-symkey-device'
key = '18RQk/hOPJR9EbsJlk2j8WA6vWaj/yi+oaYg7zmxfQNdOyMSu+SJ8O7TSlZhDJCYmn4rzEiVKIzNiVAWjLxrGA=='
expiry = 2592000
policy='registration'

print(generate_sas_token(uri, key, policy, expiry))
```

Where:

* [resource_uri] is the URI of the resource you're trying to access with this token.  For DPS, it's of the form `[dps_id_scope]/registrations/[dps_registration_id]`, where `[dps_id_scope]` is the ID scope of your DPS instance, and `[dps_registration_id]` is the registration ID you used for your device.

  You can get the ID scope for your DPS instance from the **Overview** pane of your instance in Azure portal, or you can use the [az iot dps show](/cli/azure/iot/dps#az-iot-dps-show) Azure CLI command (replace the placholders with the name of your resource group and DPS instance):
  
  ```azurecli
  az iot dps show -g {resource_group_name} --name {dps_name}
  ```

* [device_key] is the device key associated with your device. This is either the one specified or auto-generated for you in an individual enrollment, or a derived key for a group enrollment.

  * If you're using an individual enrollment, use the primary key you saved in [Use an individual enrollment](#use-an-individual-enrollment).

  * If you're using an enrollment group, use the derived device key you generated in [Use an enrollment group](#use-an-enrollment-group).

* [expiry_in_seconds] the validity period of this SAS token in seconds.

* [policy] the policy with which the key above is associated.  For DPS device registration, this is hard coded to 'registration'.

An example set of inputs for a device called `my-symkey-device` with a validity period of 30 days might look like this (the ID scope has been modified).

```python
uri = '0ne00111111/registrations/my-symkey-device'
key = '18RQk/hOPJR9EbsJlk2j8WA6vWaj/yi+oaYg7zmxfQNdOyMSu+SJ8O7TSlZhDJCYmn4rzEiVKIzNiVAWjLxrGA=='
expiry = 2592000
policy='registration'
```

Modify the script for your device and DPS instance and save it as a Python file; for example, *generate_token.ps*. Run the script, for example, `python generate_token.ps`. It should output a SAS token similar to the following:

```output
0ne003D3F98%2Fregistrations%2Fmy-symkey-device
1663952627
SharedAccessSignature sr=0ne00111111%2Fregistrations%2Fmy-symkey-device&sig=eNwg52xQdFTNf7bgPAlAJBCIcONivq%2Fck1lf3wtxI4A%3D&se=1663952627&skn=registration
```

Copy and save the entire line that begins with `SharedAccessSignature`. This is the SAS token. You'll need it in the following sections.

To learn more about using SAS tokens with DPS and their structure, see [Control Access to DPS with SAS](how-to-control-access.md).
  
## Register your device

You call the [Register Device](/rest/api/iot-dps/device/runtime-registration/register-device) REST API to provision your device through DPS.

Use the following curl command:

```bash
curl -L -i -X PUT -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: [sas_token]' -d '{"registrationId": "[registration_id]"}' https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/register?api-version=2019-03-31
```

Where:

* `-L` tells curl to follow HTTP redirects.

* `– i` tells curl to include protocol headers in output.  This is not strictly necessary, but it can be useful.

* `X PUT ` tells curl that this is an HTTP PUT command. Required for this API call since we are sending a message in the body.

* `-H 'Content-Type: application/json'` tells DPS we are posting JSON content and must be 'application/json'

* `-H 'Content-Encoding:  utf-8'` tells DPS the encoding we are using for our message body. Set to the proper value for your OS/client; however, this is generally `utf-8`.  

* `-H 'Authorization: [sas_token]'` tells DPS to authenticate using your SAS token. Replace [sas_token] with the token you generated in [Create a SAS token](#create-a-sas-token).

* `-d '{"registrationId": "[registration_id]"}'`, the `–d` parameter is the 'data' or body of the message we are posting.  It must be JSON, in the form of '{"registrationId":"[registration_id"}'.  Note that for CURL, it's wrapped in single quotes; otherwise, you need to escape the double quotes in the JSON.

* Finally, the last parameter is the URL to post to. For "regular" (i.e not on-premises) DPS, the global DPS endpoint is global.azure-devices-provisioning.net.  `https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/register?api-version=2019-03-31`.  Note that you have to replace the [dps_scope_id] and [registration_id] with the appropriate values.

For example:

```bash
curl -L -i -X PUT -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: SharedAccessSignature sr=0ne00111111%2Fregistrations%2Fmy-symkey-device&sig=eNwg52xQdFTNf7bgPAlAJBCIcONivq%2Fck1lf3wtxI4A%3D&se=1663952627&skn=registration' -d '{"registrationId": "my-symkey-device"}' https://global.azure-devices-provisioning.net/0ne00111111/registrations/my-symkey-device/register?api-version=2021-06-01
```

A successful call will have a response similar to the following:

```output
Retry-After: 3
x-ms-request-id: 46142c07-d215-408c-8b5a-7c32d988f2b0
Strict-Transport-Security: max-age=31536000; includeSubDomains

{"operationId":"5.316aac5bdc130deb.f4f1828c-4dab-4ca9-98b2-dfc63b5835d6","status":"assigning"}
```

The response contains an operation ID and a status. In this case, the status is set to assigning. DPS enrollment is, potentially, a long-running operation, so it's done asynchronously. Typically, you'll poll for status using the [Operation Status Lookup](/rest/api/iot-dps/device/runtime-registration/operation-status-lookup) REST API to determine when your device has been assigned or whether a failure has occurred.

The valid status values for DPS are:

* assigned: the return value from the status call will indicate what IoT Hub the device was assigned to.

* assigning: the operation is still running.

* disabled: the enrollment record is disabled in DPS, so the device  can't be assigned.

* failed: the assignment failed. There will be an errorCode and errorMessage returned in an registrationState record in the returned JSON to indicate what failed.

* unassigned

To get the status of the operation, use the following curl command:

```bash
curl -L -i -X GET -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: [sas_token]' https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/operations/[operation_id]?api-version=2019-03-31
```

You'll use the same ID scope, registration ID, and SAS token as you did in the Register Device command. Use the Operation ID that was returned in the Register Device response.

For example:

```bash
curl -L -i -X GET -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: SharedAccessSignature sr=0ne003D3F98%2Fregistrations%2Fmy-symkey-device&sig=eNwg52xQdFTNf7bgPAlAJBCIcONivq%2Fck1lf3wtxI4A%3D&se=1663952627&skn=registration' https://global.azure-devices-provisioning.net/0ne003D3F98/registrations/my-symkey-device/operations/5.316aac5bdc130deb.f4f1828c-4dab-4ca9-98b2-dfc63b5835d6?api-version=2021-06-01
```

The following output shows the response for a device that has been successfully assigned. Notice that the `status` is "assigned" and that the `registrationState.assignedHub` property is set to the IoT hub where the device was provisioned.

```output
x-ms-request-id: eb06d86e-f3ce-47ba-85bf-69f4fbfa3db7
Strict-Transport-Security: max-age=31536000; includeSubDomains

{
   "operationId":"5.316aac5bdc130deb.f4f1828c-4dab-4ca9-98b2-dfc63b5835d6",
   "status":"assigned",
   "registrationState":{
      "registrationId":"my-symkey-device",
      "createdDateTimeUtc":"2022-08-24T18:05:58.6300974Z",
      "assignedHub":"MyExampleHub.azure-devices.net",
      "deviceId":"my-symkey-device",
      "status":"assigned",
      "substatus":"initialAssignment",
      "lastUpdatedDateTimeUtc":"2022-08-24T18:05:58.8110029Z",
      "etag":"IjA1MDA5MTVjLTAwMDAtMDMwMC0wMDAwLTYzMDY2ODg2MDAwMCI="
   }
}
```
