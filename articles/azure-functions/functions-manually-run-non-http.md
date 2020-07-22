---
title: Manually run a non HTTP-triggered Azure Functions
description: Use an HTTP request to run a non-HTTP triggered Azure Functions
author: craigshoemaker

ms.topic: article
ms.date: 04/23/2020
ms.author: cshoe
---

# Manually run a non HTTP-triggered function

This article demonstrates how to manually run a non HTTP-triggered function via specially formatted HTTP request.

In some contexts, you may need to run "on-demand" an Azure Function that is indirectly triggered.  Examples of indirect triggers include [functions on a schedule](./functions-create-scheduled-function.md) or functions that run as the result of [another resource's action](./functions-create-storage-blob-triggered-function.md). 

[Postman](https://www.getpostman.com/) is used in the following example, but you may use [cURL](https://curl.haxx.se/), [Fiddler](https://www.telerik.com/fiddler) or any other like tool to send HTTP requests.

## Define the request location

To run a non HTTP-triggered function, you need a way to send a request to Azure to run the function. The URL used to make this request takes a specific form.

![Define the request location: host name + folder path + function name](./media/functions-manually-run-non-http/azure-functions-admin-url-anatomy.png)

- **Host name:** The function app's public location that is made up from the function app's name plus *azurewebsites.net* or your custom domain.
- **Folder path:** To access non HTTP-triggered functions via an HTTP request, you have to send the request through the folders *admin/functions*.
- **Function name:** The name of the function you want to run.

You use this request location in Postman along with the function's master key in the request to Azure to run the function.

> [!NOTE]
> When running locally, the function's master key is not required. You can directly [call the function](#call-the-function) omitting the `x-functions-key` header.

## Get the function's master key

1. Navigate to your function in the Azure portal and select **Function Keys**. Then, select the function key you want to copy. 

    :::image type="content" source="./media/functions-manually-run-non-http/azure-portal-functions-master-key.png" alt-text="Locate the master key to copy." border="true":::

1. In the **Edit key** section, copy the key value to your clipboard, and then select **OK**.

    :::image type="content" source="./media/functions-manually-run-non-http/azure-portal-functions-master-key-copy.png" alt-text="Copy the master key to the clipboard." border="true":::

1. After copying the *_master* key, select **Code + Test**, and then select **Logs**. You'll see messages from the function logged here when you manually run the function from Postman.

    :::image type="content" source="./media/functions-manually-run-non-http/azure-portal-function-log.png" alt-text="View the logs to see the master key test results." border="true":::

> [!CAUTION]  
> Due to the elevated permissions in your function app granted by the master key, you should not share this key with third parties or distribute it in an application.

## Call the function

Open Postman and follow these steps:

1. Enter the **request location in the URL text box**.
1. Ensure the HTTP method is set to **POST**.
1. Select the **Headers** tab.
1. Type **x-functions-key** as the first key and paste the master key (from the clipboard) as the value.
1. Type **Content-Type** as the second key and type **application/json** as the value.

    :::image type="content" source="./media/functions-manually-run-non-http/functions-manually-run-non-http-headers.png" alt-text="Postman headers settings." border="true":::

1. Select the **Body** tab.
1. Type **{ "input": "test" }** as the body for the request.

    :::image type="content" source="./media/functions-manually-run-non-http/functions-manually-run-non-http-body.png" alt-text="Postman body settings." border="true":::

1. Select **Send**.
        
    :::image type="content" source="./media/functions-manually-run-non-http/functions-manually-run-non-http-send.png" alt-text="Send a request with Postman." border="true":::

    Postman then reports a status of **202 Accepted**.

1. Next, return to your function in the Azure portal. Review the logs and you'll see messages coming from the manual call to the function.

    :::image type="content" source="./media/functions-manually-run-non-http/azure-portal-functions-master-key-logs.png" alt-text="View the logs to see the master key test results." border="true":::

## Next steps

- [Strategies for testing your code in Azure Functions](./functions-test-a-function.md)
- [Azure Function Event Grid Trigger Local Debugging](./functions-debug-event-grid-trigger-local.md)
