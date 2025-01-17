---
title: How to connect a service to IoT Hub using Microsoft Entra (Java)
titleSuffix: Azure IoT Hub
description: Learn how to connect a service to IoT Hub using Microsoft Entra and the Azure IoT Hub SDK for Java.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: java
ms.topic: include
ms.manager: lizross
ms.date: 11/19/2024
---

A backend app that uses Microsoft Entra must successfully authenticate and obtain a security token credential before connecting to IoT Hub. This token is passed to a IoT Hub connection method. For general information about setting up and using Microsoft Entra for IoT Hub, see [Control access to IoT Hub by using Microsoft Entra ID](/azure/iot-hub/authenticate-authorize-azure-ad).

For an overview of Java SDK authentication, see [Azure authentication with Java and Azure Identity](/azure/developer/java/sdk/authentication/overview).

For simplicity, this section focuses on describing authentication using client secret.

##### Configure Microsoft Entra app

You must set up a Microsoft Entra app that is configured for your preferred authentication credential. The app contains parameters such as client secret that are used by the backend application to authenticate. The available app authentication configurations are:

* Client secret
* Certificate
* Federated identity credential

Microsoft Entra apps may require specific role permissions depending on operations being performed. For example, [IoT Hub Twin Contributor](/azure/role-based-access-control/built-in-roles/internet-of-things#iot-hub-twin-contributor) is required to enable read and write access to a IoT Hub device and module twins. For more information, see [Manage access to IoT Hub by using Azure RBAC role assignment](/azure/iot-hub/authenticate-authorize-azure-ad?#manage-access-to-iot-hub-by-using-azure-rbac-role-assignment).

For more information about setting up a Microsoft Entra app, see [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app).

##### Authenticate using DefaultAzureCredential

The easiest way to use Microsoft Entra to authenticate a backend application is to use [DefaultAzureCredential](/azure/developer/java/sdk/authentication/credential-chains#defaultazurecredential-overview), but it's recommended to use a different method in a production environment including a specific `TokenCredential` or pared-down `ChainedTokenCredential`.
For more information about the pros and cons of using `DefaultAzureCredential`, see
[Credential chains in the Azure Identity client library for Java](/azure/developer/java/sdk/authentication/credential-chains).

[DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) supports different authentication mechanisms and determines the appropriate credential type based on the environment it's executing in. It attempts to use multiple credential types in an order until it finds a working credential.

You can authenticate Microsoft Entra app credentials using [DefaultAzureCredentialBuilder](/java/api/com.azure.identity.defaultazurecredentialbuilder). Save connection parameters such as client secret tenantID, clientID, and client secret values as environmental variables. Once the `TokenCredential` is created, pass it to [ServiceClient](/java/api/com.azure.core.annotation.serviceclient) or other builder as the 'credential' parameter.

In this example, `DefaultAzureCredentialBuilder` attempts to authenticate a connection from the list described in [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential). The result of a successful Microsoft Entra authentication is a security token credential that is passed to a constructor such as [ServiceClient](/java/api/com.azure.core.annotation.serviceclient).

```java
TokenCredential defaultAzureCredential = new DefaultAzureCredentialBuilder().build();
```

##### Authenticate using ClientSecretCredentialBuilder

You can use [ClientSecretCredentialBuilder](/java/api/com.azure.identity.clientsecretcredentialbuilder) to create a credential using client secret information. If successful, this method returns a [TokenCredential](/java/api/com.azure.core.credential.tokencredential) that can be passed to [ServiceClient](/java/api/com.azure.core.annotation.serviceclient) or other builder as the 'credential' parameter.

In this example, Microsoft Entra app registration client secret, client ID, and tenant ID values have been added to environment variables. These environment variables are used by `ClientSecretCredentialBuilder` to build the credential.

```java
string clientSecretValue = System.getenv("AZURE_CLIENT_SECRET");
string clientID = System.getenv("AZURE_CLIENT_ID");
string tenantID = System.getenv("AZURE_TENANT_ID");

TokenCredential credential =
     new ClientSecretCredentialBuilder()
          .tenantId(tenantID)
          .clientId(clientID)
          .clientSecret(clientSecretValue)
          .build();
```

##### Other authentication classes

The Java SDK also includes these classes that authenticate a backend app with Microsoft Entra:

* [AuthorizationCodeCredential](/java/api/com.azure.identity.authorizationcodecredential)
* [AzureCliCredential](/java/api/com.azure.identity.azureclicredential)
* [AzureDeveloperCliCredential](/java/api/com.azure.identity.azuredeveloperclicredential)
* [AzurePipelinesCredential](/java/api/com.azure.identity.azurepipelinescredential)
* [ChainedTokenCredential](/java/api/com.azure.identity.chainedtokencredential)
* [ClientAssertionCredential](/java/api/com.azure.identity.clientassertioncredential)
* [ClientCertificateCredential](/java/api/com.azure.identity.clientcertificatecredential)
* [DeviceCodeCredential](/java/api/com.azure.identity.devicecodecredential)
* [EnvironmentCredential](/java/api/com.azure.identity.environmentcredential)
* [InteractiveBrowserCredential](/java/api/com.azure.identity.interactivebrowsercredential)
* [ManagedIdentityCredential](/java/api/com.azure.identity.managedidentitycredential)
* [OnBehalfOfCredential](/java/api/com.azure.identity.onbehalfofcredential)

##### Code samples

For working samples of Microsoft Entra service authentication, see [Role based authentication sample](https://github.com/Azure/azure-iot-service-sdk-java/tree/main/service/iot-service-samples/role-based-authorization-sample).
