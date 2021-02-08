---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/28/2021	
ms.author: glenga
---
## Run the function in Azure

1. Back in the **Azure: Functions** area in the side bar, expand your subscription, your new function app, and **Functions**. Right-click (Windows) or <kbd>Ctrl -</kbd> click (macOS) the `HttpExample` function and choose **Execute Function Now...**.

    :::image type="content" source="media/functions-vs-code-run-remote/execute-function-now.png" alt-text="Execute function now in Azure from Visual Studio Code":::

1. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`. Press Enter to send this request message to your function.  

1. When the function executes in Azure and returns a response, a notification is raised in Visual Studio Code.
