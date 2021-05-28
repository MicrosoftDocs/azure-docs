---
services: functions
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/28/2021
ms.author: glenga
---

## Verify your function in Azure

1. In Cloud Explorer, your new function app should be selected. If not, expand your subscription > **App Services**, and select your new function app.

1. Right-click the function app and choose **Open in Browser**. This opens the root of your function app in your default web browser and displays the page that indicates your function app is running. 

    :::image type="content" source="media/functions-vstools-run-remote/function-app-running-azure.png" alt-text="Function app running":::

1. In the address bar in the browser, append the string `/api/HttpExample?name=Functions` to the base URL and run the request.

    The URL that calls your HTTP trigger function is in the following format:

    `http://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`

2. Go to this URL and you see a response in the browser to the remote GET request returned by the function, which looks like the following example:

    :::image type="content" source="media/functions-vstools-run-remote/functions-create-your-first-function-visual-studio-browser-azure.png" alt-text="Function response in the browser":::