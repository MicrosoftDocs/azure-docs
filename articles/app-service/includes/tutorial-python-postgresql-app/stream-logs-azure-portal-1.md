---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/21/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

First, you need to enable streaming logs in Azure App Service. Navigate to page for the App Service instance in the Azure portal.

1. Select the **App Service logs** under the **Monitoring** heading in the menu on the left side of the page.

1. Change the **Application Logging** property from **Off** to **File System**.

1. Enter a retention period of 30 days for the logs.

1. Select **Save** to save your changes.
