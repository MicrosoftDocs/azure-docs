---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/12/2020
ms.author: glenga
---

## Run the function locally

Visual Studio Code integrates with [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md) to let you run this project on your local development computer before you publish to Azure.

1. To call your function, press F5 to start the function app project. Output from Core Tools is displayed in the **Terminal** panel.

1. If you haven't already installed Azure Functions Core Tools, select **Install** at the prompt. When the Core Tools are installed, your app starts in the **Terminal** panel.

1. In the **Terminal** panel, copy the URL endpoint of your HTTP-triggered function. 

    ![Azure local output](./media/functions-run-function-test-local-vs-code/functions-vscode-f5.png)

1. Paste the URL for the HTTP request into your browser's address bar. Append the query string `?name=<yourname>` to this URL and execute the GET request. 

1. A response is returned, which looks like the following in a browser:

    ![Function localhost response in the browser](./media/functions-run-function-test-local-vs-code/functions-test-local-browser.png)

1. Press Shift + F5 to stop Core Tools and disconnect the debugger.
