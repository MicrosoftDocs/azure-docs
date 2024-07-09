---
title: Create a durable function by using the Azure portal  
description: Learn how to use the Durable Functions feature of Azure Functions for app development in the Azure portal.
ms.topic: conceptual
ms.date: 04/10/2020
ms.reviewer: azfuncdf
ms.devlang: csharp
# ms.devlang: csharp, javascript
ms.custom: devx-track-js
---

# Create a durable function by using the Azure portal

The [Durable Functions](durable-functions-overview.md) feature of Azure Functions is provided in the NuGet package [Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask). This article describs how to install the Durable Functions extension so that you can develop durable functions in the Azure portal.

> [!NOTE]
>
> * If you develop a durable function by using C#, consider instead developing by using [Visual Studio 2019](durable-functions-create-first-csharp.md).
> * If you develop a durable function by using JavaScript, consider instead developing by using [Visual Studio Code](./quickstart-js-vscode.md).

## Create a function app

You must have a function app to host the execution of any function. You can use a function app to group your functions as a logical unit for easier management, deployment, scaling, and sharing resources. You can create a .NET or JavaScript function app.

[!INCLUDE [Create function app Azure portal](../../../includes/functions-create-function-app-portal.md)]

By default, the function app you create uses version 2.x of the Azure Functions runtime. In C#, the Durable Functions extension works both with version 1.x and with version 2.x of the Azure Functions runtime. In JavaScript, it works only with version 2.x of the Azure Functions runtime. However, *templates* are available only when you target version 2.x of the runtime, regardless of the language you choose to use.

## Install the Durable Functions npm package (JavaScript only)

If you create a durable function by using JavaScript, you must install the [Durable Functions npm package](https://www.npmjs.com/package/durable-functions):

1. On your function app pane, in the left menu under **Development Tools**, select **Advanced Tools**.

   :::image type="content" source="./media/durable-functions-create-portal/function-app-platform-features-choose-kudu.png" alt-text="Functions platform features choose Kudu":::

1. On the **Advanced Tools** pane, select **Go**.

1. Inside the Kudu console, select **Debug console**, and then select **CMD**.

   :::image type="content" source="./media/durable-functions-create-portal/kudu-choose-debug-console.png" alt-text="Kudu debug console":::

1. Your function app's file directory structure appears. Go to the *site/wwwroot* folder. From there, you can upload a *package.json* file by dragging and dropping it into the file directory window. Here's an example of a *package.json* file:

    ```json
    {
      "dependencies": {
        "durable-functions": "^1.3.1"
      }
    }
    ```

   :::image type="content" source="./media/durable-functions-create-portal/kudu-choose-debug-console.png" alt-text="Kudu upload the package.json file.":::

1. When your *package.json* is uploaded, in the Kudu Remote Execution Console, run the `npm install` command:

   ![Kudu run npm install](./media/durable-functions-create-portal/kudu-npm-install.png)

## Create an orchestrator function

1. On your function app pane, on the left menu, select **Functions**. Then select **Add** from the top menu.

1. In the search field of the **New Function** page, enter `durable`, and then choose the **Durable Functions HTTP starter** template.

   :::image type="content" source="./media/durable-functions-create-portal/durable-functions-http-starter-template.png" alt-text="Select Durable Functions HTTP starter":::

1. For the **New Function** name, enter `HttpStart`, and then select **Create Function**.

   The function created is used to start the orchestration.

1. Create another function in the function app, this time by using the **Durable Functions orchestrator** template. Name your new orchestration function `HelloSequence`.

1. Create a third function named `Hello` by using the **Durable Functions activity** template.

## Test the durable function orchestration

1. Go back to the `HttpStart` function, select **Get function Url**, and then select the **Copy to clipboard** icon to copy the URL. You use this URL to start the `HelloSequence` function.

1. In an HTTP tool like Postman or cURL, send a POST request to the URL that you copied. The following example is a cURL command that sends a POST request to the durable function:

    ```bash
    curl -X POST https://{your-function-app-name}.azurewebsites.net/api/orchestrators/{functionName} --header "Content-Length: 0"
    ```

    In this example, `{your-function-app-name}` is the domain that is the name of your function app, and `{functionName}` is the **HelloSequence** orchestrator function. The response message contains a set of URI endpoints that you can use to monitor and manage the execution, which looks like the following example:

    ```json
    {  
       "id":"10585834a930427195479de25e0b952d",
       "statusQueryGetUri":"https://...",
       "sendEventPostUri":"https://...",
       "terminatePostUri":"https://...",
       "rewindPostUri":"https://..."
    }
    ```

1. Call the `statusQueryGetUri` endpoint URI and you see the current status of the durable function, which might look like this example:

    ```json
        {
            "runtimeStatus": "Running",
            "input": null,
            "output": null,
            "createdTime": "2017-12-01T05:37:33Z",
            "lastUpdatedTime": "2017-12-01T05:37:36Z"
        }
    ```

1. Continue calling the `statusQueryGetUri` endpoint until the status changes to **Completed** and you see a response that looks like the following example:

    ```json
    {
            "runtimeStatus": "Completed",
            "input": null,
            "output": [
                "Hello Tokyo!",
                "Hello Seattle!",
                "Hello London!"
            ],
            "createdTime": "2017-12-01T05:38:22Z",
            "lastUpdatedTime": "2017-12-01T05:38:28Z"
        }
    ```

Your first durable function is now up and running in Azure.

## Next step

> [!div class="nextstepaction"]
> [Learn about common durable function patterns](durable-functions-overview.md#application-patterns)