---
title: How to use raw HTTPS with X.509 certificates with Azure IoT Hub Device Provisioning Service
description: This article shows how to use X.509 certificates over HTTPS in your Device Provisioning Service (DPS) instance
author: kgremban
ms.author: kgremban
ms.date: 08/19/2022
ms.topic: how-to
ms.service: iot-dps
services: iot-dps
manager: lizross
---

# How to use X.509 certificates over HTTPS without an SDK

In this how-to article, you'll provision a device using x-509 certificates over HTTPS without using a an Azure IoT DPS device SDK. Most languages provide libraries to send HTTP requests, but, rather than focus on a specific language, in this article, you'll use the [cURL](https://en.wikipedia.org/wiki/CURL) command-line tool to send and receive over HTTPS.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

* Install [Python 3.7](https://www.python.org/downloads/) or later installed on your machine. You can check your version of Python by running `python --version`.

* Install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository.

## Overview

This article shows how to provision a device that uses x.509 certificate attestation using HTTPS requests via the cURL command-line tool.

## Create a certificate chain

For this article you'll use an X.509 certificate chain to authenticate with either an individual enrollment or an enrollment group. Alternatively, for an individual enrollment, you can 

The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). Make sure the enrollment ID you use in the command adheres to this format.

## Use an individual enrollment

If you want to create a new individual enrollment to use for this article, you can use the [az iot dps enrollment create](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-create) command.

The following command creates an individual enrollment entry with the default allocation policy for your DPS instance using the device certificate you specify. If the device certificate is self-signed, this will be a single certificate. If the device certificate is signed by another certificate, this will be the entire certificate chain up to and including at least one signing certificate that has been verified with DPS.

Substitute the name of your resource group and DPS instance. The enrollment ID is the registration ID for your device and, for X.509 enrollments, must match the subject common name (CN) of the device certificate.

```azurecli
az iot dps enrollment create -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --attestation-type x509 --certificate-path {path to your certificate}
```

> [!NOTE]
> If you're using Cloud Shell to run Azure CLI commands, you can use the upload button to upload your certificate file to your cloud drive before you run the command.
>
> :::image type="content" source="media/iot-dps-https-x509-support/upload-to-cloud-shell.png" alt-text="Screenshot that shows the upload file button in Azure Cloud Shell.":::

## Use an enrollment group

If you want to to create a new enrollment group to use for this article, you can use the [az iot dps enrollment-group create](/cli/azure/iot/dps/enrollment-group#az-iot-dps-enrollment-group-create) command.

The following command creates an enrollment group entry with the default allocation policy for your DPS instance using the signing certificate that you specify. This will be either a root CA or intermediate CA certificate. The more typical case is to use an intermediate CA certificate.

Substitute the name of your resource group and DPS instance.  

```azurecli
az iot dps enrollment-group create -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --attestation-type x509 --certificate-path {path to your certificate}
```

> [!NOTE]
>> If you're using Cloud Shell to run Azure CLI commands, you can use the upload button to upload your certificate file to your cloud drive before you run the command.
>
> :::image type="content" source="media/iot-dps-https-x509-support/upload-to-cloud-shell.png" alt-text="Screenshot that shows the upload file button in Azure Cloud Shell.":::

## Register your device

You call the [Register Device](/rest/api/iot-dps/device/runtime-registration/register-device) REST API to provision your device through DPS.

Use the following curl command:

```bash
curl -L -i -X PUT --cert [path_to_your_device_cert] --key [path_to_your_device_private_key] -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -d '{"registrationId": "[registration_id]"}' https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/register?api-version=2019-03-31
```

Where:

* `-L` tells curl to follow HTTP redirects.

* `– i` tells curl to include protocol headers in output.  This is not strictly necessary, but it can be useful.

* `X PUT ` tells curl that this is an HTTP PUT command. Required for this API call since we are sending a message in the body.

* `--cert [path_to_your_device_cert]` tells curl where to find your device's X.509 certificate.

  * If you're using a self-signed certificate, your device certificate file will only contain a single X.509 certificate.

  * If you're using a certificate signed by another certificate, for example, when authenticating through an enrollment group, your device certificate file must contain a valid certificate chain. The certificate chain must include the device certificate and any signing certificates up to and including a verified certificate.

  * If your device private key is protected by a pass phrase, you can add it after the certificate path preceded by a colon, for example: `--cert my-device.pem:1234`.

* `--key [path_to_your_device_private_key]` tells curl where to find your device's private key.

* `-H 'Content-Type: application/json'` tells DPS we are posting JSON content and must be 'application/json'

* `-H 'Content-Encoding:  utf-8'` tells DPS the encoding we are using for our message body. Set to the proper value for your OS/client; however, this is generally `utf-8`.  

* `-d '{"registrationId": "[registration_id]"}'`, the `–d` parameter is the 'data' or body of the message we are posting.  It must be JSON, in the form of '{"registrationId":"[registration_id"}'.  Note that for CURL, it's wrapped in single quotes; otherwise, you need to escape the double quotes in the JSON. For X.509 enrollment, the registration ID is the subject common name (CN) of your device certificate.

* Finally, the last parameter is the URL to post to. For "regular" (i.e not on-premises) DPS, the global DPS endpoint is global.azure-devices-provisioning.net.  `https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/register?api-version=2019-03-31`.  Note that you have to replace the [dps_scope_id] and [registration_id] with the appropriate values.

For example:

```bash
curl -L -i -X PUT --cert device-cert.pem --key unencrypted-device-key.pem -H 'Content-Type:
application/json' -H 'Content-Encoding:  utf-8' -d '{"registrationId": "my-x509-device"}' https://global.azure-devices-p
rovisioning.net/0ne003D3F98/registrations/my-x509-device/register?api-version=2021-06-01
```

A successful call will have a response similar to the following:

```output
HTTP/1.1 202 Accepted
Date: Sat, 27 Aug 2022 17:53:18 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Location: https://global.azure-devices-provisioning.net/0ne003D3F98/registrations/my-x509-device/register
Retry-After: 3
x-ms-request-id: 05cdec07-c0c7-48f3-b3cd-30cfe27cbe57
Strict-Transport-Security: max-age=31536000; includeSubDomains

{"operationId":"5.506603669bd3e2bf.b3602f8f-76fe-4341-9214-bb6cfb891b8a","status":"assigning"}jimaco@5CG924C9J7:~/certs3$
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
curl -L -i -X GET --cert [path_to_your_device_cert] --key [path_to_your_device_private_key] -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/operations/[operation_id]?api-version=2019-03-31
```

You'll use the same ID scope, registration ID, and certificate as you did in the Register Device command. Use the operation ID that was returned in the Register Device response.

For example:

```bash
curl -L -i -X GET --cert ./device-certPUT --cert device-cert.pem:1234 --key device-key.pem -H 'Content-Type: applica
tion/json' -H 'Content-Encoding:  utf-8' -d '{"registrationId": "my-x509-device"}' https://global.azure-devices-provisio
ning.net/0ne003D3F98/registrations/my-x509-device/register?api-version=2021-06-01
```

The following output shows the response for a device that has been successfully assigned. Notice that the `status` is "assigned" and that the `registrationState.assignedHub` property is set to the IoT hub where the device was provisioned.

```output
HTTP/1.1 200 OK
Date: Sat, 27 Aug 2022 18:10:49 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
x-ms-request-id: 8f211bc5-3ed8-4c8b-9a79-e003e756e9e4
Strict-Transport-Security: max-age=31536000; includeSubDomains

{
   "operationId":"5.506603669bd3e2bf.b3602f8f-76fe-4341-9214-bb6cfb891b8a",
   "status":"assigned",
   "registrationState":{
      "x509":{
         
      },
      "registrationId":"my-x509-device",
      "createdDateTimeUtc":"2022-08-27T17:53:19.5143497Z",
      "assignedHub":"MyExampleHub.azure-devices.net",
      "deviceId":"my-x509-device",
      "status":"assigned",
      "substatus":"initialAssignment",
      "lastUpdatedDateTimeUtc":"2022-08-27T17:53:19.7519141Z",
      "etag":"IjEyMDA4NmYyLTAwMDAtMDMwMC0wMDAwLTYzMGE1YTBmMDAwMCI="
   }
}
```
