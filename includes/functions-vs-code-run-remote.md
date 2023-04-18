---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/15/2022
ms.custom: devdivchpfy22	
ms.author: glenga
---
## Run the function in Azure

1. Back in the **Resources** area in the side bar, expand your subscription, your new function app, and **Functions**. Right-click (Windows) or <kbd>Ctrl -</kbd> click (macOS) the `HttpExample` function and choose **Execute Function Now...**.

    :::image type="content" source="media/functions-vs-code-run-remote/execute-function-now.png" alt-text="Screenshot of executing function in Azure from Visual Studio Code.":::

2. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`. Press Enter to send this request message to your function.

3. When the function executes in Azure and returns a response, a notification is raised in Visual Studio Code.
