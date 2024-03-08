---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/28/2023
ms.author: glenga
---

1. In the [Azure portal](https://portal.azure.com), locate your function app and select **Configuration** on the left-hand side.

1. Select the **Function runtime settings** tab and verify that your function app is running on the latest version of the Functions runtime. 

1. Select the **General settings** tab and update the **Node.js Version** to the latest version. Ideally, you have already locally verified that your functions run on the version you select. 

    :::image type="content" source="media/functions-set-nodejs-version-portal/set-nodejs-version-portal.png" alt-text="Screenshot of setting Node.js for the function app to the latest LTS version in the Azure portal. ":::

1. When notified about a restart, select **Continue**, and then select **Save**. 