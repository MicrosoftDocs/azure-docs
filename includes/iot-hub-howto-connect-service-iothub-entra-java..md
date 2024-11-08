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
ms.date: 11/06/2024
---

### Entra client secret credential

Use [ClientSecretCredential](https://learn.microsoft.com/en-us/java/api/com.azure.identity.clientsecretcredential) to authenticate an application with Microsoft Entra.

`ClientSecretCredential` is configured using [ClientSecretCredentialBuilder](/java/api/com.azure.identity.clientsecretcredentialbuilder).

```java
TokenCredential clientSecretCredential = new ClientSecretCredentialBuilder().tenantId(tenantId)
     .clientId(clientId)
     .clientSecret(clientSecret)
     .build();
```

### Entra client certificate credential

You can use [ClientCertificateCredential](/java/api/com.azure.identity.clientcertificatecredential) to create a `TokenCredential` using a certicate.

The `TokenCredential` can then be passed to service constructors such as:

* [DeviceTwin](https://learn.microsoft.com/en-us/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicetwin?view=azure-java-stable#com-microsoft-azure-sdk-iot-service-devicetwin-devicetwin-devicetwin(java-lang-string-com-azure-core-credential-tokencredential))

For more information about Entra app registration, see [Quickstart: Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app).

