---
title: include file
description: include file for confidential client scenario landing pages (daemon, web app, web API)
services: active-directory
documentationcenter: dev-center-name
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/14/2020
ms.author: owenrichards
ms.reviewer: jmprieur
---

## Add a client secret or certificate

As with any confidential client application, you need to add a secret or certificate to act as that application's *credentials* so it can authenticate as itself, without user interaction.

You can add credentials to your client app's registration by using the [Azure portal](#add-client-credentials-by-using-the-azure-portal) or by using a command-line tool like [PowerShell](#add-client-credentials-by-using-powershell).

### Add client credentials by using the Azure portal

To add credentials to your confidential client application's app registration, follow the steps in [Quickstart: Register an application with the Microsoft identity platform](../../quickstart-register-app.md) for the type of credential you want to add:

* [Add a client secret](../../quickstart-register-app.md#add-a-client-secret)
* [Add a certificate](../../quickstart-register-app.md#add-a-certificate)

### Add client credentials by using PowerShell

Alternatively, you can add credentials when you register your application with the Microsoft identity platform by using PowerShell.

The [active-directory-dotnetcore-daemon-v2](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2) code sample on GitHub shows how to add an application secret or certificate when registering an application:

- For details on how to add a **client secret** with PowerShell, see [AppCreationScripts/Configure.ps1](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/blob/5199032b352a912e7cc0fce143f81664ba1a8c26/AppCreationScripts/Configure.ps1#L190).
- For details on how to add a **certificate** with PowerShell, see [AppCreationScripts-withCert/Configure.ps1](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/blob/5199032b352a912e7cc0fce143f81664ba1a8c26/AppCreationScripts-withCert/Configure.ps1#L162-L178).
