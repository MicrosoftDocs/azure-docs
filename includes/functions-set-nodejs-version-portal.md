---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/09/2026
ms.author: glenga
---

1. In the [Azure portal](https://portal.azure.com), locate your function app and select **Settings** > **Configuration** on the left-hand side.

1. Select the **Function runtime settings** tab and verify that your function app is running on the latest version of the Functions runtime. 

1. Select the **General settings** tab. For production apps, set **Node.js Version** to Node.js 24. For Linux apps only, select Node.js 26 to test the preview version. Node.js 26 isn't supported on Windows. Before you change the version, verify locally that your functions run on that version.

1. When notified about a restart, select **Continue**, and then select **Save**. 
