---
title: How to use raw HTTPS in Azure IoT Hub Device Provisioning Service
description: This article shows how to use symmetric keys over HTTPS in your Device Provisioning Service (DPS) instance
author: kgremban
ms.author: kgremban
ms.date: 10/27/2022
ms.topic: how-to
ms.service: iot-dps
ms.custom: devx-track-azurecli
services: iot-dps
manager: lizross
---

# How to use symmetric keys over HTTPS without an SDK

In this how-to article, you'll provision a device using symmetric keys over HTTPS without using an Azure IoT DPS device SDK. Most languages provide libraries to send HTTP requests, but, rather than focus on a specific language, in this article, you'll use the [cURL](https://en.wikipedia.org/wiki/CURL) command-line tool to send and receive over HTTPS.

You can follow the steps in this article on either a Linux or a Windows machine. If you're running on Windows Subsystem for Linux (WSL) or running on a Linux machine, you can enter all commands on your local system in a Bash prompt. If you're running on Windows, enter all commands on your local system in a GitBash prompt.

There are different paths through this article depending on the type of enrollment entry you choose to use. After installing the prerequisites, be sure to read the [Overview](#overview) before proceeding.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

* Make sure [Python 3.7](https://www.python.org/downloads/) or later is installed on your machine. You can check your version of Python by running `python --version`.

* If you're running in Windows, install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository. On Windows, you'll enter all commands on your local system in a GitBash prompt.

* Azure CLI. You have two options for running Azure CLI commands in this article:
    * Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, sign in to the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](../cloud-shell/quickstart.md) to **Start Cloud Shell** and **Select the Bash environment**.
    * Optionally, run Azure CLI on your local machine. If Azure CLI is already installed, run `az upgrade` to upgrade the CLI and extensions to the current version. To install Azure CLI, see [Install Azure CLI]( /cli/azure/install-azure-cli).

* If you're running in a Linux or a WSL environment, open a Bash prompt to run commands locally. If you're running in a Windows environment, open a GitBash prompt.

## Overview

For this article, you can use either an [individual enrollment](concepts-service.md#individual-enrollment) or an [enrollment group](concepts-service.md#enrollment-group) to provision through DPS.

* For an individual enrollment, complete [Use individual enrollment](#use-an-individual-enrollment).

* For an enrollment group, complete [Use an enrollment group](#use-an-enrollment-group).

After you've created the individual enrollment or enrollment group entry, continue on to [create a SAS token](#create-a-sas-token) and [register your device](#register-your-device) with DPS.

## Use an individual enrollment

If you want to create a new individual enrollment to use for this article, you can use the [az iot dps enrollment create](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-create) command to create an individual enrollment for symmetric key attestation.

The following command creates an enrollment entry with the default allocation policy for your DPS instance and lets DPS assign the primary and secondary keys for your device:

```azurecli
az iot dps enrollment create -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --attestation-type symmetrickey
```

* Substitute the name of your resource group and DPS instance.

* The enrollment ID is the registration ID for your device. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). Make sure the enrollment ID you use in the command adheres to this format.

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

Note down the primary key and the registration ID (enrollment ID) for your individual enrollment entry, you'll use them later in this article.

If you want to use an existing individual enrollment for this article, you can get the primary key with the [az iot dps enrollment show](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-show) command:

```azurecli
az iot dps enrollment show -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --show-keys true
```

## Use an enrollment group

If you want to create a new enrollment group to use for this article, you can use the [az iot dps enrollment-group create](/cli/azure/iot/dps/enrollment-group#az-iot-dps-enrollment-group-create) command to create an enrollment group for symmetric key attestation.

The following command creates an enrollment group entry with the default allocation policy for your DPS instance and lets DPS assign the primary and secondary keys for the enrollment group:  

```azurecli
az iot dps enrollment-group create -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id}
```

* Substitute the name of your resource group and DPS instance.

* The enrollment ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). It can be any name you choose to use for the enrollment group.

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

Note down the primary key.

If you want to use an existing individual enrollment for this article, you can get the primary key with the [az iot dps enrollment-group show](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-show) command:

```azurecli
az iot dps enrollment-group show -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --show-keys true
```

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

When using symmetric key attestation, devices authenticate with DPS using a Shared Access Signature (SAS) token. For devices provisioning through an individual enrollment, the token is signed using either the primary or secondary key set in the enrollment entry. For a device provisioning through an enrollment group, the token is signed using a derived device key, which, in turn, has been generated using either the primary or secondary key set in the enrollment group entry. The token specifies an expiry time and a target resource URI.

The following Python script can be used to generate a SAS token:

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

uri = '[resource_uri]'
key = '[device_key]'
expiry = [expiry_in_seconds]
policy= '[policy]'

print(generate_sas_token(uri, key, policy, expiry))
```

Where:

* `[resource_uri]` is the URI of the resource you're trying to access with this token.  For DPS, it's of the form `[dps_id_scope]/registrations/[dps_registration_id]`, where `[dps_id_scope]` is the ID scope of your DPS instance, and `[dps_registration_id]` is the registration ID you used for your device.

  You can get the ID scope for your DPS instance from the **Overview** pane of your instance in Azure portal, or you can use the [az iot dps show](/cli/azure/iot/dps#az-iot-dps-show) Azure CLI command (replace the placeholders with the name of your resource group and DPS instance):
  
  ```azurecli
  az iot dps show -g {resource_group_name} --name {dps_name}
  ```

* `[device_key]` is the device key associated with your device. This key is either the one specified or auto-generated for you in an individual enrollment, or a derived key for a group enrollment.

  * If you're using an individual enrollment, use the primary key you saved in [Use an individual enrollment](#use-an-individual-enrollment).

  * If you're using an enrollment group, use the derived device key you generated in [Use an enrollment group](#use-an-enrollment-group).

* `[expiry_in_seconds]` is the validity period of this SAS token in seconds.

* `[policy]` is the policy with which the device key is associated.  For DPS device registration, the policy is hard coded to 'registration'.

An example set of inputs for a device called `my-symkey-device` with a validity period of 30 days might look like this.

```python
uri = '0ne00111111/registrations/my-symkey-device'
key = '18RQk/hOPJR9EbsJlk2j8WA6vWaj/yi+oaYg7zmxfQNdOyMSu+SJ8O7TSlZhDJCYmn4rzEiVKIzNiVAWjLxrGA=='
expiry = 2592000
policy='registration'
```

Modify the script for your device and DPS instance and save it as a Python file; for example, *generate_token.py*. Run the script, for example, `python generate_token.py`. It should output a SAS token similar to the following:

```output
0ne00111111%2Fregistrations%2Fmy-symkey-device
1663952627
SharedAccessSignature sr=0ne00111111%2Fregistrations%2Fmy-symkey-device&sig=eNwg52xQdFTNf7bgPAlAJBCIcONivq%2Fck1lf3wtxI4A%3D&se=1663952627&skn=registration
```

Copy and save the entire line that begins with `SharedAccessSignature`. This line is the SAS token. You'll need it in the following sections.

To learn more about using SAS tokens with DPS and their structure, see [Control Access to DPS with SAS](how-to-control-access.md).
  
## Register your device

You call the [Register Device](/rest/api/iot-dps/device/runtime-registration/register-device) REST API to provision your device through DPS.

Use the following curl command:

```bash
curl -L -i -X PUT -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: [sas_token]' -d '{"registrationId": "[registration_id]"}' https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/register?api-version=2019-03-31
```

Where:

* `-L` tells curl to follow HTTP redirects.

* `–i` tells curl to include protocol headers in output.  These headers aren't strictly necessary, but they can be useful.

* `-X PUT` tells curl that this is an HTTP PUT command. Required for this API call.

* `-H 'Content-Type: application/json'` tells DPS we're posting JSON content and must be 'application/json'.

* `-H 'Content-Encoding:  utf-8'` tells DPS the encoding we're using for our message body. Set to the proper value for your OS/client; however, it's generally `utf-8`.  

* `-H 'Authorization: [sas_token]'` tells DPS to authenticate using your SAS token. Replace [sas_token] with the token you generated in [Create a SAS token](#create-a-sas-token).

* `-d '{"registrationId": "[registration_id]"}'`, the `–d` parameter is the 'data' or body of the message we're posting.  It must be JSON, in the form of '{"registrationId":"[registration_id"}'.  Note that for curl, it's wrapped in single quotes; otherwise, you need to escape the double quotes in the JSON.

* Finally, the last parameter is the URL to post to. For "regular" (i.e not on-premises) DPS, the global DPS endpoint, *global.azure-devices-provisioning.net*, is used: `https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/register?api-version=2019-03-31`.  Note that you have to replace `[dps_scope_id]` and `[registration_id]` with the appropriate values.

For example:

```bash
curl -L -i -X PUT -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: SharedAccessSignature sr=0ne00111111%2Fregistrations%2Fmy-symkey-device&sig=eNwg52xQdFTNf7bgPAlAJBCIcONivq%2Fck1lf3wtxI4A%3D&se=1663952627&skn=registration' -d '{"registrationId": "my-symkey-device"}' https://global.azure-devices-provisioning.net/0ne00111111/registrations/my-symkey-device/register?api-version=2021-06-01
```

A successful call will have a response similar to the following:

```output
HTTP/1.1 202 Accepted
Date: Wed, 31 Aug 2022 22:02:49 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Location: https://global.azure-devices-provisioning.net/0ne00111111/registrations/my-symkey-device/register
Retry-After: 3
x-ms-request-id: a021814f-0cf6-4ce9-a1e9-ead7eb5118d9
Strict-Transport-Security: max-age=31536000; includeSubDomains

{"operationId":"5.316aac5bdc130deb.b1e02da8-c3a0-4ff2-a121-7ea7a6b7f550","status":"assigning"}
```

The response contains an operation ID and a status. In this case, the status is set to `assigning`. DPS enrollment is, potentially, a long-running operation, so it's done asynchronously. Typically, you'll poll for status using the [Operation Status Lookup](/rest/api/iot-dps/device/runtime-registration/operation-status-lookup) REST API to determine when your device has been assigned or whether a failure has occurred.

The valid status values for DPS are:

* `assigned`: the return value from the status call will indicate what IoT Hub the device was assigned to.

* `assigning`: the operation is still running.

* `disabled`: the enrollment record is disabled in DPS, so the device  can't be assigned.

* `failed`: the assignment failed. There will be an `errorCode` and `errorMessage` returned in an `registrationState` record in the response to indicate what failed.

* `unassigned`

To call the **Operation Status Lookup** API, use the following curl command:

```bash
curl -L -i -X GET -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: [sas_token]' https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/operations/[operation_id]?api-version=2019-03-31
```

You'll use the same ID scope, registration ID, and SAS token as you did in the **Register Device** request. Use the operation ID that was returned in the **Register Device** response.

For example:

```bash
curl -L -i -X GET -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: SharedAccessSignature sr=0ne00111111%2Fregistrations%2Fmy-symkey-device&sig=eNwg52xQdFTNf7bgPAlAJBCIcONivq%2Fck1lf3wtxI4A%3D&se=1663952627&skn=registration' https://global.azure-devices-provisioning.net/0ne00111111/registrations/my-symkey-device/operations/5.316aac5bdc130deb.f4f1828c-4dab-4ca9-98b2-dfc63b5835d6?api-version=2021-06-01
```

The following output shows the response for a device that has been successfully assigned. Notice that the `status` property is `assigned` and that the `registrationState.assignedHub` property is set to the IoT hub where the device was provisioned.

```output
HTTP/1.1 200 OK
Date: Wed, 31 Aug 2022 22:05:23 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
x-ms-request-id: ffb98d42-023e-4e75-afb0-1807ff091cbb
Strict-Transport-Security: max-age=31536000; includeSubDomains

{
   "operationId":"5.316aac5bdc130deb.b1e02da8-c3a0-4ff2-a121-7ea7a6b7f550",
   "status":"assigned",
   "registrationState":{
      "registrationId":"my-symkey-device",
      "createdDateTimeUtc":"2022-08-31T22:02:50.5163352Z",
      "assignedHub":"MyExampleHub.azure-devices.net",
      "deviceId":"my-symkey-device",
      "status":"assigned",
      "substatus":"initialAssignment",
      "lastUpdatedDateTimeUtc":"2022-08-31T22:02:50.7370676Z",
      "etag":"IjY5MDAzNTUyLTAwMDAtMDMwMC0wMDAwLTYzMGZkYThhMDAwMCI="
   }
}
```

## Send a telemetry message

Before you can send a telemetry message, you need to create a SAS token for the IoT hub that the device was assigned to. You sign this token using the same primary key or derived device key that you used to sign the SAS token for your DPS instance.

### Create a SAS token for your IoT hub

To create the SAS token, you can run the same code you did to create the token for your DPS instance with the following changes:

```python
uri = '[resource_uri]'
key = '[device_key]'
expiry = [expiry_in_seconds]
policy= None
```

Where:

* `[resource_uri]` is the URI of the resource you're trying to access with this token. For a device sending messages to an IoT hub, it's of the form `[iot-hub-host-name]/devices/[device-id]`.

  * For `[iot-hub-host-name]`, use the IoT Hub hostname returned in the `assignedHub` property in the previous section.

  * For `[device-id]`, use the device ID returned in the `deviceId` property in the previous section.

* `[device_key]` is the device key associated with your device. This key is either the one specified or auto-generated for you in an individual enrollment, or a derived key for a group enrollment. (It's the same key you used previously to create a token for DPS.)

  * If you're using an individual enrollment, use the primary key you saved in [Use an individual enrollment](#use-an-individual-enrollment).

  * If you're using an enrollment group, use the derived device key you generated in [Use an enrollment group](#use-an-enrollment-group).

* `[expiry_in_seconds]` is the validity period of this SAS token in seconds.

* `policy=None` No policy is required for a device sending telemetry to an IoT hub, so this parameter is set to `None`.

An example set of inputs for a device called `my-symkey-device` sending to an IoT Hub named `MyExampleHub` with a token validity period of one hour might look like this:

```python
uri = 'MyExampleHub.azure-devices.net/devices/my-symkey-device'
key = '18RQk/hOPJR9EbsJlk2j8WA6vWaj/yi+oaYg7zmxfQNdOyMSu+SJ8O7TSlZhDJCYmn4rzEiVKIzNiVAWjLxrGA=='
expiry = 3600
policy= None
```

The following output shows a sample SAS token for these inputs:

```output
SharedAccessSignature sr=MyExampleHub.azure-devices.net%2Fdevices%2Fmy-symkey-device&sig=f%2BwW8XOKeJOtiPc9Iwjc4OpExvPM7NlhM9qxN2a1aAM%3D&se=1663119026
```

To learn more about creating SAS tokens for IoT Hub, including example code in other programming languages, see [Control access to IoT Hub using Shared Access Signatures](../iot-hub/iot-hub-dev-guide-sas.md?tabs=python).

> [!NOTE]
>
> As a convenience, you can use the Azure CLI [az iot hub generate-sas-token](/cli/azure/iot/hub#az-iot-hub-generate-sas-token) command to get a SAS token for a device registered with an IoT hub. For example, the following command generates a SAS token with a duration of one hour. For the `{iothub_name}`, you only need the first part of the host hame, for example, `MyExampleHub`.
>
> ```azurecli
> az iot hub generate-sas-token -d {device_id} -n {iothub_name}
> ```

### Send data to your IoT hub

You call the IoT Hub [Send Device Event](/rest/api/iothub/device/send-device-event) REST API to send telemetry to the device.

Use the following curl command:

```bash
curl -L -i -X POST -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: [sas_token]' -d '{"temperature": 30}' https://[assigned_iot_hub_name].azure-devices.net/devices/[device_id]/messages/events?api-version=2020-03-13
```

Where:

* `-X POST` tells curl that this is an HTTP POST command. Required for this API call.

* `-H 'Content-Type: application/json'` tells IoT Hub we're posting JSON content and must be 'application/json'.

* `-H 'Content-Encoding:  utf-8'` tells IoT Hub the encoding we're using for our message body. Set to the proper value for your OS/client; however, it's generally `utf-8`.  

* `-H 'Authorization: [sas_token]'` tells IoT Hub to authenticate using your SAS token. Replace `[sas_token]` with the token you generated for the assigned IoT hub.

* `-d '{"temperature": 30}'`, the `–d` parameter is the 'data' or body of the message we're posting. For this article, we're posting a single temperature data point. The content type was specified as application/json, so, for this request, the body is JSON. Note that for curl, it's wrapped in single quotes; otherwise, you need to escape the double quotes in the JSON.

* The last parameter is the URL to post to. For the Send Device Event API, the URL is: `https://[assigned_iot_hub_name].azure-devices.net/devices/[device_id]/messages/events?api-version=2020-03-13`.  

  * Replace `[assigned_iot_hub_name]` with the name of the IoT hub that your device was assigned to.

  * Replace `[device_id]` with the device ID that was assigned when you registered your device. For devices that provision through enrollment groups the device ID will be the registration ID. For individual enrollments, you can, optionally, specify a device ID that is different than the registration ID in the enrollment entry.

For example, for a device with a device ID of `my-symkey-device` sending a telemetry data point to an IoT hub named `MyExampleHub`:

```bash
curl -L -i -X POST -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -H 'Authorization: SharedAccessSignature sr=MyExampleHub.azure-devices.net%2Fdevices%2Fmy-symkey-device&sig=f%2BwW8XOKeJOtiPc9Iwjc4OpExvPM7NlhM9qxN2a1aAM%3D&se=1663119026' -d '{"temperature": 30}' https://MyExampleHub.azure-devices.net/devices/my-symkey-device/messages/events?api-version=2020-03-13
```

A successful call will have a response similar to the following:

```output
HTTP/1.1 204 No Content
Content-Length: 0
Vary: Origin
Server: Microsoft-HTTPAPI/2.0
x-ms-request-id: 9e278582-3561-417b-b807-76426195920f
Date: Wed, 14 Sep 2022 00:32:53 GMT
```

## Next Steps

* To learn more about symmetric key attestation, see [Symmetric key attestation](concepts-symmetric-key-attestation.md).

* To learn more about SAS tokens and their structure, see [Control access to DPS with SAS](how-to-control-access.md).
