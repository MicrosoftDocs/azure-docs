---
title: Quickstart – Update the JavaScript application on a Microsoft Azure Managed CCF resource
description: Learn to update the JavaScript application on a Microsoft Azure Managed CCF resource
author: msftsettiy
ms.author: settiy
ms.date: 09/10/2023
ms.service: confidential-ledger
ms.custom: devx-track-js
ms.topic: how-to
---

# Quickstart: Update the JavaScript application

With Azure Managed CCF (Managed CCF), it is simple and quick to update an application when new functionality is introduced or when bugs fixes are available. This tutorial builds on the Managed CCF resource created in the [Quickstart: Create an Azure Managed CCF resource using the Azure portal](quickstart-portal.md) tutorial.

## Prerequisites

[!INCLUDE [Prerequisites](./includes/proposal-prerequisites.md)]

## Download the service identity

[!INCLUDE [Download Service Identity](./includes/service-identity.md)]

## Update the application

[!INCLUDE [Mac instructions](./includes/macos-instructions.md)]

> [!NOTE]
> This tutorial assumes that the updated application bundle is created using the instructions available [here](https://microsoft.github.io/CCF/main/build_apps/js_app_bundle.html) and saved to set_js_app.json.
> 
> Updating an application does not reset the JavaScript runtime options.

[!INCLUDE [Deploy an application](./includes/deploy-update-application.md)]

When the command completes, the application will be updated and ready to accept user transactions.

## Next steps

- [Microsoft Azure Managed CCF overview](overview.md)
- [How to: View application logs in Azure Monitor](how-to-enable-azure-monitor.md)
- [Quickstart: Deploy an Azure Managed CCF application](quickstart-deploy-application.md)
