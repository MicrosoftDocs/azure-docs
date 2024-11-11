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

### Microsoft Entra client secret credential

Use [ClientSecretCredential](/java/api/com.azure.identity.clientsecretcredential) to authenticate an application with Microsoft Entra.

`ClientSecretCredential` is configured using [ClientSecretCredentialBuilder](/java/api/com.azure.identity.clientsecretcredentialbuilder).

```java
TokenCredential clientSecretCredential = new ClientSecretCredentialBuilder().tenantId(tenantId)
     .clientId(clientId)
     .clientSecret(clientSecret)
     .build();
```

### Microsoft Entra client certificate credential

You can use [ClientCertificateCredential](/java/api/com.azure.identity.clientcertificatecredential) to create a `TokenCredential` using a certificate.

The `TokenCredential` can then be passed to service constructors such as:

* [DeviceTwin](/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicetwin?#com-microsoft-azure-sdk-iot-service-devicetwin-devicetwin-devicetwin(java-lang-string-com-azure-core-credential-tokencredential))

For more information about Microsoft Entra app registration, see [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app).
