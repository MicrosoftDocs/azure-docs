---
title: Manually run a non HTTP-triggered Azure Functions
description: Use an HTTP request to run a non-HTTP triggered Azure Functions
ms.topic: article
ms.date: 01/15/2024
---

# Manually run a non HTTP-triggered function

This article demonstrates how to manually run a non HTTP-triggered function via specially formatted HTTP request.

In some contexts, such as during development and troubleshooting, you might need to run "on-demand" an Azure Function that is indirectly triggered.  Examples of indirect triggers include [functions on a schedule](./functions-create-scheduled-function.md) or functions that run as the [result of events](./functions-create-storage-blob-triggered-function.md). 

[Postman](https://www.getpostman.com/) is used in the following example, but you can use [cURL](https://curl.haxx.se/), [Fiddler](https://www.telerik.com/fiddler) or any other like tool to send HTTP requests.

The procedure described in this article is equivalent to using the **Test/Run** functionality of a function's **Code + Test** tab in the Azure portal. You can also use Visual Studio Code to [manually run functions](functions-develop-vs-code.md#run-functions). 

## Define the request location

To run a non HTTP-triggered function, you need a way to send a request to Azure to run the function. The URL used to make this request takes a specific form.

![Define the request location: host name + folder path + function name](./media/functions-manually-run-non-http/azure-functions-admin-url-anatomy.png)

- **Host name:** The function app's public location that is made up from the function app's name plus *azurewebsites.net* or your custom domain. When you work with [deployment slots](./functions-deployment-slots.md) used for staging, the host name portion is the production host name with `-<slotname>` appended to it. In the previous example, the URL would be `myfunctiondemos-staging.azurewebsites.net` for a slot named `staging`. 
- **Folder path:** To access non HTTP-triggered functions via an HTTP request, you have to send the request through the path `admin/functions`. APIs under the `/admin/` path are only accessible with authorization.
- **Function name:** The name of the function you want to run.

The following considerations apply when making requests to administrator endpoints in your function app:

+ When making requests to any endpoint under the `/admin/` path, you must supply your app's master key in the `x-functions-key` header of the request. 
+ When you run locally, authorization isn't enforced and the function's master key isn't required. You can directly [call the function](#call-the-function) omitting the `x-functions-key` header. 
+ When accessing function app endpoints in a [deployment slot](./functions-deployment-slots.md), make sure you use the slot-specific host name in the request URL, along with the slot-specific master key.

## Get the master key

You can get the master key from either the Azure portal or by using the Azure CLI. 

> [!CAUTION]  
> Due to the elevated permissions in your function app granted by the master key, you should not share this key with third parties or distribute it in an application. The key should only be sent to an HTTPS endpoint.

### [Azure portal](#tab/azure-portal)

1. Navigate to your function app in the [Azure portal](https://portal.azure.com), select **App Keys**, and then the `_master` key. 

    :::image type="content" source="./media/functions-manually-run-non-http/azure-portal-functions-master-key.png" alt-text="Locate the master key to copy." border="true":::

1. In the **Edit key** section, copy the key value to your clipboard, and then select **OK**.

    :::image type="content" source="./media/functions-manually-run-non-http/azure-portal-functions-master-key-copy.png" alt-text="Copy the master key to the clipboard." border="true":::

### [Azure CLI](#tab/azure-cli)

Use the [`az functionapp keys list`](/cli/azure/functionapp/keys#az-functionapp-keys-list) command to view the keys, including the master key:  

```azurecli
az functionapp keys list --name "<APP_NAME>" --resource-group  "<RESOURCE_GROUP>" --slot "<STAGING_SLOT>"
```

In this example, replace `<APP_NAME>` and `<RESOURCE_GROUP>` with the name of your function app and resource group, respectively. If you aren't using a staging slot, remove the `--slot` parameter. Copy the master key value to your clipboard. 

---

## Call the function

1. In the Azure portal, navigate top your function app and choose your function. 

1. Select **Code + Test**, and then select **Logs**. You see messages from the function logged here when you manually run the function from Postman.

    :::image type="content" source="./media/functions-manually-run-non-http/azure-portal-function-log.png" alt-text="Screenshot that shows the 'Code + Test' page with a message from the logs displayed." border="true":::

1. Open Postman (or an equivalent HTTP composing tool) and enter the **request location in the URL text box**.

1. Make sure that the HTTP method is set to **POST**, select the **Headers** tab, and add these two header key-value pairs:

    | Key | Value |
    | --- | --- |
    | **`x-functions-key`** | The master key value pasted from the clipboard. |
    |  **`Content-Type`** | `application/json` |

    :::image type="content" source="./media/functions-manually-run-non-http/functions-manually-run-non-http-headers.png" alt-text="Postman headers settings." border="true":::

1. Select the **Body** tab and type `{ "input": "<TRIGGER_INPUT>" }` as the body for the request.  

    :::image type="content" source="./media/functions-manually-run-non-http/functions-manually-run-non-http-body.png" alt-text="Postman body settings." border="true":::

   The specific `<TRIGGER_INPUT>` you supply depends on the type of trigger, but it can only be a string, numeric, or boolean value. For services that use JSON payloads, such as Azure Service Bus, the test JSON payload should be escaped and serialized as a string. 

    If you don't want to pass input data to the function, you must still supply an empty dictionary `{}` as the body of the POST request. For more information, see the reference article for the specific non-HTTP trigger. 

1. Select **Send**.
        
    :::image type="content" source="./media/functions-manually-run-non-http/functions-manually-run-non-http-send.png" alt-text="Send a request with Postman." border="true":::

    Postman then reports a status of **202 Accepted**.

1. Next, return to your function in the Azure portal. Review the logs and you see messages coming from the manual call to the function.

    :::image type="content" source="./media/functions-manually-run-non-http/azure-portal-functions-master-key-logs.png" alt-text="View the logs to see the master key test results." border="true":::

The way that you access data sent to the trigger depends on the type of trigger and your function language. For more information, see the reference examples for your [specific trigger](functions-triggers-bindings.md).    

## Next steps

> [!div class="nextstepaction"]
> [Event Grid local testing with viewer web app](./event-grid-how-tos.md#local-testing-with-viewer-web-app)
