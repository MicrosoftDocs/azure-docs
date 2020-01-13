---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/12/2020
ms.author: glenga
---

## Run the function locally

Azure Functions Core Tools lets you run an Azure Functions project on your local development computer.

1. To test your function, press F5 to start the function app project. Output from Core Tools is displayed in the **Terminal** panel.

1. In the **Terminal** panel, copy the URL endpoint of your HTTP-triggered function. 

    ![Azure local output](./media/functions-run-function-test-local-vs-code/functions-vscode-f5.png)

1. Paste the URL for the HTTP request into your browser's address bar. Append the query string `?name=<yourname>` to this URL and execute the request. Execution is paused when the breakpoint is hit.

1. When you continue the execution, the following shows the response in the browser to the GET request:

    ![Function localhost response in the browser](./media/functions-run-function-test-local-vs-code/functions-test-local-browser.png)

1. To stop debugging, press Shift + F5.