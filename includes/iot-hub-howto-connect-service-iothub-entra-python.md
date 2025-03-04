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
ms.date: 11/19/2024
---

A backend app that uses Microsoft Entra must successfully authenticate and obtain a security token credential before connecting to IoT Hub. This token is passed to a IoT Hub connection method. For general information about setting up and using Microsoft Entra for IoT Hub, see [Control access to IoT Hub by using Microsoft Entra ID](/azure/iot-hub/authenticate-authorize-azure-ad).

For an overview of Python SDK authentication, see [Authenticate Python apps to Azure services by using the Azure SDK for Python](/azure/developer/python/sdk/authentication/overview)

##### Configure Microsoft Entra app

You must set up a Microsoft Entra app that is configured for your preferred authentication credential. The app contains parameters such as client secret that are used by the backend application to authenticate. The available app authentication configurations are:

* Client secret
* Certificate
* Federated identity credential

Microsoft Entra apps may require specific role permissions depending on operations being performed. For example, [IoT Hub Twin Contributor](/azure/role-based-access-control/built-in-roles/internet-of-things#iot-hub-twin-contributor) is required to enable read and write access to a IoT Hub device and module twins. For more information, see [Manage access to IoT Hub by using Azure RBAC role assignment](/azure/iot-hub/authenticate-authorize-azure-ad?#manage-access-to-iot-hub-by-using-azure-rbac-role-assignment).

For more information about setting up a Microsoft Entra app, see [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app).

##### Authenticate using DefaultAzureCredential

The easiest way to use Microsoft Entra to authenticate a backend application is to use [DefaultAzureCredential](/azure/developer/python/sdk/authentication/overview#use-defaultazurecredential-in-an-application), but it's recommended to use a different method in a production environment including a specific `TokenCredential` or pared-down `ChainedTokenCredential`. For simplicity, this section describes authentication using `DefaultAzureCredential` and Client secret. For more information about the pros and cons of using `DefaultAzureCredential`, see [Credential chains in the Azure Identity client library for Python](/azure/developer/python/sdk/authentication/credential-chains).

[DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) supports different authentication mechanisms and determines the appropriate credential type based on the environment it's executing in. It attempts to use multiple credential types in an order until it finds a working credential.

Microsoft Entra requires this import package and corresponding `import` statement:

```shell
pip install azure-identity
```

```python
from azure.identity import DefaultAzureCredential
```

In this example, Microsoft Entra app registration client secret, client ID, and tenant ID have been added to environment variables. These environment variables are used by `DefaultAzureCredential` to authenticate the application. The result of a successful Microsoft Entra authentication is a security token credential that is passed to an IoT Hub connection method.

```python
from azure.identity import DefaultAzureCredential
credential = DefaultAzureCredential()
```

The resulting [AccessToken](/python/api/azure-core/azure.core.credentials.accesstoken) can then be passed to `from_token_credential` to connect to IoT Hub for any SDK client that accepts Microsoft Entra credentials:

* [IoTHubRegistryManager](/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?#azure-iot-hub-iothubregistrymanager-from-token-credential) to create a service connection to IoT Hub using an Entra token credential.
* [IoTHubJobManager](/python/api/azure-iot-hub/azure.iot.hub.iothubjobmanager?#azure-iot-hub-iothubjobmanager-from-token-credential)
* [DigitalTwinClient](/python/api/azure-iot-hub/azure.iot.hub.digitaltwinclient?#azure-iot-hub-digitaltwinclient-from-token-credential)
* [IoTHubHttpRuntimeManager](/python/api/azure-iot-hub/azure.iot.hub.iothubhttpruntimemanager?#azure-iot-hub-iothubhttpruntimemanager-from-token-credential)
* [IoTHubConfigurationManager](/python/api/azure-iot-hub/azure.iot.hub.iothubconfigurationmanager?#azure-iot-hub-iothubconfigurationmanager-from-token-credential)

`from_token_credential` requires two parameters:

* The Azure service URL - The Azure service URL should be in the format `{Your Entra domain URL}.azure-devices.net` without a `https://` prefix. For example, `MyAzureDomain.azure-devices.net`.
* The Azure credential token

In this example, the Azure credential is obtained using `DefaultAzureCredential`. The Azure service URL and credential are then supplied to `IoTHubRegistryManager.from_token_credential` to create the connection to IoT Hub.

```python
import sys
import os

from azure.identity import DefaultAzureCredential
from azure.iot.hub import IoTHubRegistryManager

# Define the client secret values
clientSecretValue = 'xxxxxxxxxxxxxxx'
clientID = 'xxxxxxxxxxxxxx'
tenantID = 'xxxxxxxxxxxxx'

# Set environment variables
os.environ['AZURE_CLIENT_SECRET'] = clientSecretValue
os.environ['AZURE_CLIENT_ID'] = clientID
os.environ['AZURE_TENANT_ID'] = tenantID

# Acquire a credential object
credential = DefaultAzureCredential()

# Use Entra to authorize IoT Hub service
print("Connecting to IoTHubRegistryManager...")
iothub_registry_manager = IoTHubRegistryManager.from_token_credential(
url="MyAzureDomain.azure-devices.net",
token_credential=credential)
```

##### Code samples

For working samples of Microsoft Entra service authentication, see [Microsoft Authentication Library (MSAL) for Python](https://github.com/AzureAD/microsoft-authentication-library-for-python/blob/1.22.0/README.md).
