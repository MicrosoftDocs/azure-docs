---
title: How to use raw HTTPS with X.509 certificates with Azure IoT Hub Device Provisioning Service
description: This article shows how to use X.509 certificates over HTTPS in your Device Provisioning Service (DPS) instance
author: kgremban
ms.author: kgremban
ms.date: 10/27/2022
ms.topic: how-to
ms.service: iot-dps
services: iot-dps
manager: lizross
---

# How to use X.509 certificates over HTTPS without an SDK

In this how-to article, you'll provision a device using x.509 certificates over HTTPS without using an Azure IoT DPS device SDK. Most languages provide libraries to send HTTP requests, but, rather than focus on a specific language, in this article, you'll use the [cURL](https://en.wikipedia.org/wiki/CURL) command-line tool to send and receive over HTTPS.

You can follow the steps in this article on either a Linux or a Windows machine. If you're running on Windows Subsystem for Linux (WSL) or running on a Linux machine, you can enter all commands on your local system in a Bash prompt. If you're running on Windows, enter all commands on your local system in a GitBash prompt.

There are multiple paths through this article depending on the type of enrollment entry and X.509 certificate(s) you choose to use. After installing the prerequisites, be sure to read the [Overview](#overview) before proceeding.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

* Make sure you have [Python 3.7](https://www.python.org/downloads/) or later installed on your machine. You can check your version of Python by running `python --version` or `python3 --version`.

* If you're running in Windows, install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository. On Windows, you'll enter all commands on your local system in a GitBash prompt.

* Azure CLI. You have two options for running Azure CLI commands in this article:
    * Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, sign in to the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](../cloud-shell/quickstart.md) to **Start Cloud Shell** and **Select the Bash environment**.
    * Optionally, run Azure CLI on your local machine. If Azure CLI is already installed, run `az upgrade` to upgrade the CLI and extensions to the current version. To install Azure CLI, see [Install Azure CLI]( /cli/azure/install-azure-cli).

* If you're running in a Linux or a WSL environment, open a Bash prompt to run commands locally. If you're running in a Windows environment, open a GitBash prompt.

## Overview

There are three scenarios covered in this article and the initial steps you'll perform will be different for each. If you want to:

* Provision through an [individual enrollment](concepts-service.md#individual-enrollment) using a self-signed certificate, follow the steps in these sections:

    1. [Use a self-signed certificate](#use-a-self-signed-certificate) to create a self-signed certificate.
    1. [Use an individual enrollment](#use-an-individual-enrollment) to create an individual enrollment.

* Provision through an individual enrollment using a certificate chain, follow the steps in these sections:

    1. [Use a certificate chain](#use-a-certificate-chain) to create a certificate chain.
    1. [Use an individual enrollment](#use-an-individual-enrollment) to create an individual enrollment.
    1. [Upload and verify a signing certificate](#upload-and-verify-a-signing-certificate) to upload and verify your root CA certificate.

* Provision through an [enrollment group](concepts-service.md#enrollment-group), follow the steps in these sections:

    1. [Use a certificate chain](#use-a-certificate-chain) to create a certificate chain.
    1. [Use an enrollment group](#use-an-enrollment-group) to create an enrollment group.
    1. [Upload and verify a signing certificate](#upload-and-verify-a-signing-certificate) to upload and verify your root CA certificate.

Once you've completed the steps for your chosen scenario, you can continue on to [Register your device](#register-your-device) and [Send a telemetry message](#send-a-telemetry-message).

## Create a device certificate

For this article, you'll use an X.509 certificate to authenticate with DPS using either an individual enrollment or an enrollment group.

If you're using an individual enrollment, you can use a self-signed X.509 certificate or a [certificate chain](concepts-x509-attestation.md) composed of the device certificate plus one or more signing certificates. If you're using an enrollment group, you must use a certificate chain.  

> [!IMPORTANT]
>
> For X.509 enrollment authentication, the subject common name (CN) of the device certificate is used as the registration ID for the device. The registration ID is a case-insensitive string of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). DPS supports registration IDs up to 128 characters long; however, the subject common name of an X.509 certificate is limited to 64 characters. If you change the subject common name for your device certificate in the following steps, make sure it adheres to this format.

### Use a self-signed certificate

To create a self-signed certificate to use with an individual enrollment, navigate to a directory where you want to create your certificate and follow these steps:

1. Run the following command:

    # [Windows (GitBash)](#tab/windows)

    ```bash
    winpty openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout device-key.pem -out device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "//CN=my-x509-device"
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=my-x509-device`) is only required to escape the string with Git on Windows platforms.

    # [Linux/WSL](#tab/linux)

    ```bash
    openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout device-key.pem -out device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "/CN=my-x509-device"
    ```

    ---

3. When asked to **Enter PEM pass phrase:**, use the pass phrase `1234`.

4. When asked **Verifying - Enter PEM pass phrase:**, use the pass phrase `1234` again.

    A public key certificate file (*device-cert.pem*) and private key file (*device-key.pem*) should now be generated in the directory where you ran the `openssl` command.

    The certificate file has its subject common name (CN) set to `my-x509-device`.

    The private key file is protected by the pass phrase: `1234`.

5. The certificate file is Base64 encoded. To view the subject common name (CN) and other properties of the certificate file, enter the following command:

    # [Windows (GitBash)](#tab/windows)

    ```bash
    winpty openssl x509 -in device-cert.pem -text -noout
    ```

    # [Linux/WSL](#tab/linux)

    ```bash
    openssl x509 -in device-cert.pem -text -noout
    ```

    ---

    ```output
    Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            77:3e:1d:e4:7e:c8:40:14:08:c6:09:75:50:9c:1a:35:6e:19:52:e2
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = my-x509-device
        Validity
            Not Before: May  5 21:41:42 2022 GMT
            Not After : Jun  4 21:41:42 2022 GMT
        Subject: CN = my-x509-device
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (4096 bit)
                Modulus:
                    00:d2:94:37:d6:1b:f7:43:b4:21:c6:08:1a:d6:d7:
                    e6:40:44:4e:4d:24:41:6c:3e:8c:b2:2c:b0:23:29:
                    ...
                    23:6e:58:76:45:18:03:dc:2e:9d:3f:ac:a3:5c:1f:
                    9f:66:b0:05:d5:1c:fe:69:de:a9:09:13:28:c6:85:
                    0e:cd:53
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints:
                CA:FALSE
            Netscape Comment:
                OpenSSL Generated Certificate
            X509v3 Subject Key Identifier:
                63:C0:B5:93:BF:29:F8:57:F8:F9:26:44:70:6F:9B:A4:C7:E3:75:18
            X509v3 Authority Key Identifier:
                keyid:63:C0:B5:93:BF:29:F8:57:F8:F9:26:44:70:6F:9B:A4:C7:E3:75:18

            X509v3 Extended Key Usage:
                TLS Web Client Authentication
    Signature Algorithm: sha256WithRSAEncryption
         82:8a:98:f8:47:00:85:be:21:15:64:b9:22:b0:13:cc:9e:9a:
         ed:f5:93:b9:4b:57:0f:79:85:9d:89:47:69:95:65:5e:b3:b1:
         ...
         cc:b2:20:9a:b7:f2:5e:6b:81:a1:04:93:e9:2b:92:62:e0:1c:
         ac:d2:49:b9:36:d2:b0:21
    ```

### Use a certificate chain

If you're using an enrollment group, you must authenticate with a certificate chain. With an individual enrollment, you can use a certificate chain or a self-signed certificate.  

To create a certificate chain, follow the instructions in [Create an X.509 certificate chain](tutorial-custom-hsm-enrollment-group-x509.md?tabs=linux#create-an-x509-certificate-chain). You only need one device for this article, so you can stop after creating the private key and certificate chain for the first device.

When you're finished, you should have the following files:

|   Certificate                 |  File  | Description |
| ---------------------------- | --------- | ---------- |
| root CA certificate.              | *certs/azure-iot-test-only.root.ca.cert.pem* | Will be uploaded to DPS and verified. |
| intermediate CA certificate   | *certs/azure-iot-test-only.intermediate.cert.pem* | Will be used to create an enrollment group in DPS. |
| device-01 private key          | *private/device-01.key.pem* | Used by the device to verify ownership of the device certificate during authentication with DPS. |
| device-01 certificate  | *certs/device-01.cert.pem* | Used to create individual enrollment entry with DPS. |
| device-01 full chain certificate  | *certs/device-01-full-chain.cert.pem* | Presented by the device to authenticate and register with DPS. |

## Use an individual enrollment

To create an individual enrollment to use for this article, use the [az iot dps enrollment create](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-create) command.

The following command creates an individual enrollment entry with the default allocation policy for your DPS instance using the device certificate you specify.

```azurecli
az iot dps enrollment create -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --attestation-type x509 --certificate-path {path to your certificate}
```

* Substitute the name of your resource group and DPS instance.

* The enrollment ID is the registration ID for your device and, for X.509 enrollments, must match the subject common name (CN) of the device certificate.

  * If you followed the instructions in [Use a self-signed-certificate](#use-a-self-signed-certificate), the enrollment ID is my-x509-device.

  * If you followed the instructions in [Use a certificate chain](#use-a-certificate-chain), the enrollment ID is device-01.

* The certificate path is the path to your device certificate.

  * If you followed the instructions in [Use a self-signed-certificate](#use-a-self-signed-certificate), the filename is *device-cert.pem*.

  * If you followed the instructions in [Use a certificate chain](#use-a-certificate-chain), the filename is *certs/device-01.cert.pem*.

> [!NOTE]
> If you're using Cloud Shell to run Azure CLI commands, you can use the upload button to upload your certificate file to your cloud drive before you run the command.
>
> :::image type="content" source="media/iot-dps-https-x509-support/upload-to-cloud-shell.png" alt-text="Screenshot that shows the upload file button in Azure Cloud Shell.":::

## Use an enrollment group

To create an enrollment group to use for this article, use the [az iot dps enrollment-group create](/cli/azure/iot/dps/enrollment-group#az-iot-dps-enrollment-group-create) command.

The following command creates an enrollment group entry with the default allocation policy for your DPS instance using an intermediate CA certificate:

```azurecli
az iot dps enrollment-group create -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --certificate-path {path_to_your_certificate}
```

* Substitute the name of your resource group and DPS instance.

* The enrollment ID is a case-insensitive string of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). It can be any name you choose to use for the enrollment group.

* The certificate path is the path to your intermediate certificate. If you followed the instructions in [Use a certificate chain](#use-a-certificate-chain), the filename is *certs/azure-iot-test-only.intermediate.cert.pem*.

> [!NOTE]
>> If you're using Cloud Shell to run Azure CLI commands, you can use the upload button to upload your certificate file to your cloud drive before you run the command.
>
> :::image type="content" source="media/iot-dps-https-x509-support/upload-to-cloud-shell.png" alt-text="Screenshot that shows the upload file button in Azure Cloud Shell.":::

> [!NOTE]
>
> If you prefer, you can create an enrollment group based on a signing certificate that has been previously uploaded and verified with DPS (see next section). To do so, you specify the certificate name with the `--ca-name` and omit the `--certificate-path` parameter in the `az iot dps enrollment-group create` command.

## Upload and verify a signing certificate

If you're using a certificate chain for either an individual enrollment or an enrollment group, you must upload and verify at least one certificate in the device certificate's signing chain to DPS.

* For an individual enrollment, this can be any signing certificate in the device's certificate chain.

* For an enrollment group, this can be the certificate set on the enrollment group or any certificate in its signing chain up to and including the root CA certificate.

To upload and verify your certificate, use the [az iot dps certificate create](/cli/azure/iot/dps/certificate#az-iot-dps-certificate-create) command:

```azurecli
az iot dps certificate create -g {resource_group_name} --dps-name {dps_name} --certificate-name {friendly_name_for_your_certificate} --path {path_to_your_certificate} --verified true
```

* Substitute the name of your resource group and DPS instance.

* The certificate path is the path to your signing certificate. For this article, we recommend you upload the root CA certificate. If you followed the instructions in [Use a certificate chain](#use-a-certificate-chain), the filename is *certs/azure-iot-test-only.root.ca.cert.pem*.

* The certificate name can contain only alphanumeric characters or the following special characters: `-._`. No whitespace is permitted. For example, "azure-iot-test-only-root".

> [!NOTE]
> If you're using Cloud Shell to run Azure CLI commands, you can use the upload button to upload your certificate file to your cloud drive before you run the command.
>
> :::image type="content" source="media/iot-dps-https-x509-support/upload-to-cloud-shell.png" alt-text="Screenshot that shows the upload file button in Azure Cloud Shell.":::

> [!NOTE]
>
> The steps in this section automatically verified the certificate on upload. You can also do manual verification of the certificate. To learn more, see [Manual verification of intermediate or root CA](how-to-verify-certificates.md#manual-verification-of-intermediate-or-root-ca).

## Register your device

You call the [Register Device](/rest/api/iot-dps/device/runtime-registration/register-device) REST API to provision your device through DPS.

Use the following curl command:

```bash
curl -L -i -X PUT --cert [path_to_your_device_cert] --key [path_to_your_device_private_key] -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -d '{"registrationId": "[registration_id]"}' https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/register?api-version=2019-03-31
```

Where:

* `-L` tells curl to follow HTTP redirects.

* `–i` tells curl to include protocol headers in output.  These headers aren't strictly necessary, but they can be useful.

* `-X PUT` tells curl that this is an HTTP PUT command. Required for this API call.

* `--cert [path_to_your_device_cert]` tells curl where to find your device's X.509 certificate. If your device private key is protected by a pass phrase, you can add the pass phrase after the certificate path preceded by a colon, for example: `--cert my-device.pem:1234`.

  * If you're using a self-signed certificate, your device certificate file will only contain a single X.509 certificate. If you followed the instructions in [Use a self-signed-certificate](#use-a-self-signed-certificate), the filename is *device-cert.pem* and the private key pass phrase is `1234`, so use `--cert device-cert.pem:1234`.

  * If you're using a certificate chain, for example, when authenticating through an enrollment group, your device certificate file must contain a valid certificate chain. The certificate chain must include the device certificate and any signing certificates up to and including a verified certificate. If you followed the instructions in [Use a certificate chain](#use-a-certificate-chain) to create the certificate chain, the filepath is *certs/device-01-full-chain.cert.pem*, so use `--cert certs/device-01-full-chain.cert.pem`.

* `--key [path_to_your_device_private_key]` tells curl where to find your device's private key.

  * If you followed the instructions in [Use a self-signed-certificate](#use-a-self-signed-certificate), the filename is *device-key.pem*, so use `--key device-cert.pem:1234`.

  * If you followed the instructions in [Use a certificate chain](#use-a-certificate-chain), the key path is *certs/device-01-full-chain.cert.pem*, so use `--cert certs/device-01-full-chain.cert.pem`.

* `-H 'Content-Type: application/json'` tells DPS we're posting JSON content and must be 'application/json'

* `-H 'Content-Encoding:  utf-8'` tells DPS the encoding we're using for our message body. Set to the proper value for your OS/client; however, it's generally `utf-8`.  

* `-d '{"registrationId": "[registration_id]"}'`, the `–d` parameter is the 'data' or body of the message we're posting.  It must be JSON, in the form of '{"registrationId":"[registration_id"}'.  Note that for curl, it's wrapped in single quotes; otherwise, you need to escape the double quotes in the JSON. For X.509 enrollment, the registration ID is the subject common name (CN) of your device certificate.

* Finally, the last parameter is the URL to post to. For "regular" (i.e not on-premises) DPS, the global DPS endpoint, *global.azure-devices-provisioning.net* is used: `https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/register?api-version=2019-03-31`.  Note that you have to replace `[dps_scope_id]` and `[registration_id]` with the appropriate values.

For example:

* If you followed the instructions in [Use a self-signed certificate](#use-a-self-signed-certificate):

    ```bash
    curl -L -i -X PUT --cert device-cert.pem:1234 --key device-key.pem -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -d '{"registrationId": "my-x509-device"}' https://global.azure-devices-provisioning.net/0ne00111111/registrations/my-x509-device/register?api-version=2021-06-01
    ```

* If you followed the instructions in [Use a certificate chain](#use-a-certificate-chain):

    ```bash
    curl -L -i -X PUT --cert certs/device-01-full-chain.cert.pem --key private/device-01.key.pem -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -d '{"registrationId": "device-01"}' https://global.azure-devices-provisioning.net/0ne00111111/registrations/device-01/register?api-version=2021-06-01
    ```

A successful call will have a response similar to the following:

```output
HTTP/1.1 202 Accepted
Date: Sat, 27 Aug 2022 17:53:18 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Location: https://global.azure-devices-provisioning.net/0ne00111111/registrations/my-x509-device/register
Retry-After: 3
x-ms-request-id: 05cdec07-c0c7-48f3-b3cd-30cfe27cbe57
Strict-Transport-Security: max-age=31536000; includeSubDomains

{"operationId":"5.506603669bd3e2bf.b3602f8f-76fe-4341-9214-bb6cfb891b8a","status":"assigning"}
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
curl -L -i -X GET --cert [path_to_your_device_cert] --key [path_to_your_device_private_key] -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' https://global.azure-devices-provisioning.net/[dps_id_scope]/registrations/[registration_id]/operations/[operation_id]?api-version=2019-03-31
```

You'll use the same ID scope, registration ID, and certificate and key as you did in the **Register Device** request. Use the operation ID that was returned in the **Register Device** response.

For example, the following command is for the self-signed certificate created in [Use a self-signed certificate](#use-a-self-signed-certificate). (You need to modify the ID scope and operation ID.)

```bash
curl -L -i -X GET --cert ./device-certPUT --cert device-cert.pem:1234 --key device-key.pem -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' https://global.azure-devices-provisioning.net/0ne00111111/registrations/my-x509-device/operations/5.506603669bd3e2bf.b3602f8f-76fe-4341-9214-bb6cfb891b8a?api-version=2021-06-01
```

The following output shows the response for a device that has been successfully assigned. Notice that the `status` property is `assigned` and that the `registrationState.assignedHub` property is set to the IoT hub where the device was provisioned.

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

Note down the device ID and the assigned IoT hub. You'll use them to send a telemetry message in the next section.

## Send a telemetry message

You call the IoT Hub [Send Device Event](/rest/api/iothub/device/send-device-event) REST API to send telemetry to the device.

Use the following curl command:

```bash
curl -L -i -X POST --cert [path_to_your_device_cert] --key [path_to_your_device_private_key] -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -d '{"temperature": 30}' https://[assigned_iot_hub_name].azure-devices.net/devices/[device_id]/messages/events?api-version=2020-03-13
```

Where:

* `-X POST` tells curl that this is an HTTP POST command. Required for this API call.

* `--cert [path_to_your_device_cert]` tells curl where to find your device's X.509 certificate. If your device private key is protected by a pass phrase, you can add the pass phrase after the certificate path preceded by a colon, for example: `--cert my-device.pem:1234`.

  * If you're using a self-signed certificate, your device certificate file will only contain a single X.509 certificate. If you followed the instructions in [Use a self-signed-certificate](#use-a-self-signed-certificate), the filename is *device-cert.pem* and the private key pass phrase is `1234`, so use `--cert device-cert.pem:1234`.

  * If you're using a certificate chain, your device certificate file must contain a valid certificate chain. If you followed the instructions in [Use a certificate chain](#use-a-certificate-chain) to create the certificate chain, the filepath is *certs/device-01-full-chain.cert.pem*, so use `--cert certs/device-01-full-chain.cert.pem`.

* `--key [path_to_your_device_private_key]` tells curl where to find your device's private key.

  * If you followed the instructions in [Use a self-signed-certificate](#use-a-self-signed-certificate), the filename is *device-key.pem*, so use `--key device-cert.pem:1234`.

  * If you followed the instructions in [Use a certificate chain](#use-a-certificate-chain), the key path is *certs/device-01-full-chain.cert.pem*, so use `--cert certs/device-01-full-chain.cert.pem`.

* `-H 'Content-Type: application/json'` tells IoT Hub we're posting JSON content and must be 'application/json'.

* `-H 'Content-Encoding:  utf-8'` tells IoT Hub the encoding we're using for our message body. Set to the proper value for your OS/client; however, it's generally `utf-8`.  

* `-d '{"temperature": 30}'`, the `–d` parameter is the 'data' or body of the message we're posting. For this article, we're posting a single temperature data point. The content type was specified as application/json, so, for this request, the body is JSON. Note that for curl, it's wrapped in single quotes; otherwise, you need to escape the double quotes in the JSON.

* The last parameter is the URL to post to. For the Send Device Event API, the URL is: `https://[assigned_iot_hub_name].azure-devices.net/devices/[device_id]/messages/events?api-version=2020-03-13`.  

  * Replace `[assigned_iot_hub_name]` with the name of the IoT hub that your device was assigned to.

  * Replace `[device_id]` with the device ID that was assigned when you registered your device. For devices that provision through enrollment groups the device ID will be the registration ID. For individual enrollments, you can, optionally, specify a device ID that is different than the registration ID in the enrollment entry.

For example:

* If you followed the instructions in [Use a self-signed certificate](#use-a-self-signed-certificate):

    ```bash
    curl -L -i -X POST --cert device-cert.pem:1234 --key device-key.pem -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -d '{"temperature": 30}' https://MyExampleHub.azure-devices.net/devices/my-x509-device/messages/events?api-version=2020-03-13
    ```

* If you followed the instructions in [Use a certificate chain](#use-a-certificate-chain):

    ```bash
    curl -L -i -X POST --cert certs/device-01-full-chain.cert.pem --key private/device-01.key.pem -H 'Content-Type: application/json' -H 'Content-Encoding:  utf-8' -d '{"temperature": 30}' https://MyExampleHub.azure-devices.net/devices/my-x509-device/messages/events?api-version=2020-03-13
    ```

A successful call will have a response similar to the following:

```output
HTTP/1.1 204 No Content
Content-Length: 0
Vary: Origin
Server: Microsoft-HTTPAPI/2.0
x-ms-request-id: aa58c075-20d9-4565-8058-de6dc8524f14
Date: Wed, 31 Aug 2022 18:34:44 GMT
```

## Next Steps

* To learn more about attestation with X.509 certificates, see [X.509 certificate attestation](concepts-x509-attestation.md).

* To learn more about uploading and verifying X.509 certificates, see [Configure verified CA certificates](how-to-verify-certificates.md).
