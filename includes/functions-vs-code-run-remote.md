---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/01/2020	
ms.author: glenga
---
## Run the function in Azure

1. Back in the **Azure: Functions** area in the side bar, expand the new function app under your subscription. Expand **Functions**, right-click (Windows) or <kbd>Ctrl -</kbd> click (macOS) on **HttpExample**, and then choose **Copy function URL**.

    ![Copy the function URL for the new HTTP trigger](./media/functions-vs-code-run-remote/function-copy-endpoint-url.png)

1. Paste this URL for the HTTP request into your browser's address bar, add the `name` query string as `?name=Functions` to the end of this URL, and then execute the request. The URL that calls your HTTP-triggered function should be in the following format:

    ```http
    http://<FUNCTION_APP_NAME>.azurewebsites.net/api/httpexample?name=Functions
    ```

    The following example shows the response in the browser to the remote GET request returned by the function:

    ![Function response in the browser](./media/functions-vs-code-run-remote/functions-test-remote-browser.png)
