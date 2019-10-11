---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/25/2019
ms.author: glenga
---
To turn on the streaming logs for your function app in Azure:

1. Select F1 to open the command palette, and then search for and run the command **Azure Functions: Start Streaming Logs**.

1. Select your function app in Azure, and then select **Yes** to enable application logging for the function app.

1. Trigger your functions in Azure. Notice that log data is displayed in the Output window in Visual Studio Code.

1. When you're done, remember to run the command **Azure Functions: Stop Streaming Logs** to disable logging for the function app.