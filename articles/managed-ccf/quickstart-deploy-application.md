---
title: Quickstart – Deploy a JavaScript application to an Azure Managed CCF resource
description: Learn to deploy a JavaScript application to an Azure Managed CCF resource
author: msftsettiy
ms.author: settiy
ms.date: 09/08/2023
ms.service: confidential-ledger
ms.topic: quickstart
ms.custom: devx-track-js
---

# Quickstart: Deploy a JavaScript application to an Azure Managed CCF resource

In this quickstart tutorial, you will learn how to deploy an application to an Azure Managed CCF (Managed CCF) resource. This tutorial builds on the Managed CCF resource created in the [Quickstart: Create an Azure Managed CCF resource using the Azure portal](quickstart-portal.md) tutorial.

## Prerequisites

[!INCLUDE [Prerequisites](./includes/proposal-prerequisites.md)]
- [OpenSSL](https://www.openssl.org/) on a computer running Windows or Linux.

## Download the service identity

[!INCLUDE [Download Service Identity](./includes/service-identity.md)]

## Deploy the application

[!INCLUDE [Mac instructions](./includes/macos-instructions.md)]

> [!NOTE]
> This tutorial assumes that the JavaScript application bundle is created using the instructions available [here](https://microsoft.github.io/CCF/main/build_apps/js_app_bundle.html).

[!INCLUDE [Deploy an application](./includes/deploy-update-application.md)]

When the command completes, the application is deployed to the Managed CCF resource and is ready to accept transactions.

## Next steps

- [Azure Managed CCF overview](overview.md)
- [Quickstart: Update the JavaScript runtime options](how-to-update-javascript-runtime-options.md)
- [Quickstart: Deploy an Azure Managed CCF application](quickstart-deploy-application.md)
