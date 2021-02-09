---
title: include file
description: include file
services: functions
author: stefanushinardi
ms.service: azure-functions
ms.topic: include
ms.date: 11/26/2018
ms.author: shinardi
ms.custom: include file
---

Use the following procedure to view and update the language version currently used by a function app.

1. In the [Azure portal](https://portal.azure.com), browse to your function app.

1. Under **Settings**, choose **Configuration**. In the **General settings** tab, locate the **Stack settings**. Note the specific language version drop down. In the example below, the version is set to `Node 14 LTS`.

    :::image type="content" source="./media/functions-view-update-language-version-portal/functions-change-node-version.png" alt-text="View the runtime version." border="true":::

1. To pin your function app to the a specific language runtime version, choose  under **\<LANGUAGE> version**. 
1. When you change the language version, go back to the **Overview** tab and choose **Restart** to restart the app.  The function app restarts running on the version 1.x runtime, and the version 1.x templates are used when you create functions.

    :::image type="content" source="./media/functions-view-update-version-portal/functions-restart-function-app.png" alt-text="Restart your function app." border="true":::
