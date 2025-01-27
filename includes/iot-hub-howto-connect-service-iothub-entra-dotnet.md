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
ms.date: 11/19/2024
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

A backend app that uses Microsoft Entra must successfully authenticate and obtain a security token credential before connecting to IoT Hub. This token is passed to a IoT Hub connection method. For general information about setting up and using Microsoft Entra for IoT Hub, see [Control access to IoT Hub by using Microsoft Entra ID](/azure/iot-hub/authenticate-authorize-azure-ad).

##### Configure Microsoft Entra app

You must set up a Microsoft Entra app that is configured for your preferred authentication credential. The app contains parameters such as client secret that are used by the backend application to authenticate. The available app authentication configurations are:

* Client secret
* Certificate
* Federated identity credential

Microsoft Entra apps may require specific role permissions depending on operations being performed. For example, [IoT Hub Twin Contributor](/azure/role-based-access-control/built-in-roles/internet-of-things#iot-hub-twin-contributor) is required to enable read and write access to a IoT Hub device and module twins. For more information, see [Manage access to IoT Hub by using Azure RBAC role assignment](/azure/iot-hub/authenticate-authorize-azure-ad?branch=main#manage-access-to-iot-hub-by-using-azure-rbac-role-assignment).

For more information about setting up a Microsoft Entra app, see [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app).

##### Authenticate using DefaultAzureCredential

The easiest way to use Microsoft Entra to authenticate a backend application is to use [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), but it's recommended to use a different method in a production environment including a specific `TokenCredential` or pared-down `ChainedTokenCredential`. For simplicity, this section describes authentication using `DefaultAzureCredential` and Client secret. For more information about the pros and cons of using `DefaultAzureCredential`, see [Usage guidance for DefaultAzureCredential](/dotnet/azure/sdk/authentication/credential-chains?tabs=dac#usage-guidance-for-defaultazurecredential).

`DefaultAzureCredential` supports different authentication mechanisms and determines the appropriate credential type based on the environment it's executing in. It attempts to use multiple credential types in an order until it finds a working credential.

Microsoft Entra requires these NuGet packages and corresponding `using` statements:

* Azure.Core
* Azure.Identity

```csharp
using Azure.Core;
using Azure.Identity;
```

In this example, Microsoft Entra app registration client secret, client ID, and tenant ID are added to environment variables. These environment variables are used by `DefaultAzureCredential` to authenticate the application. The result of a successful Microsoft Entra authentication is a security token credential that is passed to an IoT Hub connection method.

```csharp
string clientSecretValue = "xxxxxxxxxxxxxxx";
string clientID = "xxxxxxxxxxxxxx";
string tenantID = "xxxxxxxxxxxxx";

Environment.SetEnvironmentVariable("AZURE_CLIENT_SECRET", clientSecretValue);
Environment.SetEnvironmentVariable("AZURE_CLIENT_ID", clientID);
Environment.SetEnvironmentVariable("AZURE_TENANT_ID", tenantID);

TokenCredential tokenCredential = new DefaultAzureCredential();
```

The resulting [TokenCredential](/dotnet/api/azure.core.tokencredential) can then be passed to a connect to IoT Hub method for any SDK client that accepts Microsoft Entra credentials:

* [JobClient](/dotnet/api/microsoft.azure.devices.jobclient.create?#microsoft-azure-devices-jobclient-create(system-string-azure-core-tokencredential-microsoft-azure-devices-httptransportsettings))
* [RegistryManager](/dotnet/api/microsoft.azure.devices.registrymanager.create?#microsoft-azure-devices-registrymanager-create(system-string-azure-core-tokencredential-microsoft-azure-devices-httptransportsettings))
* [DigitalTwinClient](/dotnet/api/microsoft.azure.devices.digitaltwinclient)
* [ServiceClient](/dotnet/api/microsoft.azure.devices.serviceclient.create?#microsoft-azure-devices-serviceclient-create(system-string-azure-core-tokencredential-microsoft-azure-devices-transporttype-microsoft-azure-devices-serviceclienttransportsettings-microsoft-azure-devices-serviceclientoptions))

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

##### Code sample

For a working sample of Microsoft Entra service authentication, see [Role based authentication sample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/service/samples/how%20to%20guides/RoleBasedAuthenticationSample).
