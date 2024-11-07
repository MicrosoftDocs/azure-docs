---
title: How to connect a service to IoT Hub using Microsoft Entra (.NET)
titleSuffix: Azure IoT Hub
description: Learn how to connect a service to IoT Hub using Microsoft Entra and the Azure IoT Hub SDK for .NET.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.manager: lizross
ms.date: 11/06/2024
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

Use [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) to use Microsoft Entra to authenticate a connection to IoT Hub. `DefaultAzureCredential` supports different authentication mechanisms and determines the appropriate credential type based of the environment it is executing in. It attempts to use multiple credential types in an order until it finds a working credential. For more information on setting up Entra for IoT Hub, see [Control access to IoT Hub by using Microsoft Entra ID](/azure/iot-hub/authenticate-authorize-azure-ad).

To create required Entra app parameters to `DefaultAzureCredential`, create an Entra app registration that contains the Azure client secret, client ID, and tenant ID. For more information, see [](/entra/identity-platform/quickstart-register-app).

Entra apps require permissions depending on operations performed:

* Add [IoT Hub Twin Contributor](/azure/role-based-access-control/built-in-roles/internet-of-things#iot-hub-twin-contributor) to enable read and write access to all IoT Hub device and module twins.

In this example, the Entra app registration client secret, client ID, and tenant ID are added to environment variables. These environment variables are used by `DefaultAzureCredential` to authenticate the application.

```csharp
string clientSecretValue = "xxxxxxxxxxxxxxx";
string clientID = "xxxxxxxxxxxxxx";
string tenantID = "xxxxxxxxxxxxx";

Environment.SetEnvironmentVariable("AZURE_CLIENT_SECRET", clientSecretValue);
Environment.SetEnvironmentVariable("AZURE_CLIENT_ID", clientID);
Environment.SetEnvironmentVariable("AZURE_TENANT_ID", tenantID);

TokenCredential tokenCredential = new DefaultAzureCredential();
```

The resulting [TokenCredential](/dotnet/api/azure.core.tokencredential) can then be passed to an authentication method for any SDK client that accepts Microsft Entra/AAD credentials:

* [JobClient](/dotnet/api/microsoft.azure.devices.jobclient.create?#microsoft-azure-devices-jobclient-create(system-string-azure-core-tokencredential-microsoft-azure-devices-httptransportsettings))
* [RegistryManager](/dotnet/api/microsoft.azure.devices.registrymanager.create?#microsoft-azure-devices-registrymanager-create(system-string-azure-core-tokencredential-microsoft-azure-devices-httptransportsettings))
* [DigitalTwinClient](/dotnet/api/microsoft.azure.devices.digitaltwinclient)
* [ServiceClient]((/dotnet/api/microsoft.azure.devices.serviceclient.create?#microsoft-azure-devices-serviceclient-create(system-string-azure-core-tokencredential-microsoft-azure-devices-transporttype-microsoft-azure-devices-serviceclienttransportsettings-microsoft-azure-devices-serviceclientoptions)))

In this example, the `TokenCredential` is passed to `ServiceClient.Create` to create a [ServiceClient](/dotnet/api/microsoft.azure.devices.serviceclient) connection object.

```csharp
string hostname = "xxxxxxxxxx.azure-devices.net";
using var serviceClient = ServiceClient.Create(hostname, tokenCredential, TransportType.Amqp);
```

In this example, the `TokenCredential` is passed to `RegistryManager.Create` to create a [RegistryManager](/dotnet/api/microsoft.azure.devices.registrymanager) object.

```csharp
string hostname = "xxxxxxxxxx.azure-devices.net";
registryManager = RegistryManager.Create(hostname, tokenCredential);
```
