---
title: How to connect a service to IoT Hub using Microsoft Entra (Python)
titleSuffix: Azure IoT Hub
description: Learn how to connect a service to IoT Hub using Microsoft Entra and the Azure IoT Hub SDK for Python.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: python
ms.topic: include
ms.manager: lizross
ms.date: 11/06/2024
---

For an overview of Python SDK authentication, see [Authenticate Python apps to Azure services by using the Azure SDK for Python](/azure/developer/python/sdk/authentication/overview)

### Entra token credential

You must generate and supply a token credential to `from_token_credential`.

[DefaultAzureCredential](/azure/developer/python/sdk/authentication/overview#use-defaultazurecredential-in-an-application) is the easiest way to generate a token. You can also use credential chains to generate a token. For more information, see [Credential chains in the Azure Identity client library for Python](/azure/developer/python/sdk/authentication/credential-chains).

To create required Microsoft Entra app parameters for `DefaultAzureCredential`, create a Microsoft Entra app registration that contains your selected authentication mechanism:

* Client secret
* Certificate
* Federated identity credential

For more information, see [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app).

Microsoft Entra apps may require permissions depending on operations performed. For example, [IoT Hub Twin Contributor](/azure/role-based-access-control/built-in-roles/internet-of-things#iot-hub-twin-contributor) is required to enable read and write access to a IoT Hub device and module twins. For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles#internet-of-things).

#### Connect to IoT Hub

Use [from_token_credential](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-from-token-credential) to create a service connection to IoT Hub using an Entra token credential.

`from_token_credential` requires two parameters:

* The Azure service URL
* The Azure credential token

In this example, the Azure credential is obtained using `DefaultAzureCredential`. The Azure domain URL and credential are then supplied to `BlobServiceClient`.

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

# Acquire a credential object
credential = DefaultAzureCredential()

blob_service_client = BlobServiceClient(
        account_url="https://<my_account_name>.blob.core.windows.net",
        credential=credential)
```
