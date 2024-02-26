---
title: Send Auth0 events to Blob Storage via Azure Event Grid
description: This article shows how to send Auth0 events received by Azure Event Grid to Azure Blob Storage by using Azure Functions.
ms.topic: how-to
ms.date: 10/12/2022
---

# Send Auth0 events to Azure Blob Storage
This article shows you how to send Auth0 events to Azure Blob Storage via Azure Event Grid by using Azure Functions.

## Prerequisites
- [Create an Azure Event Grid stream on Auth0](https://marketplace.auth0.com/integrations/azure-log-streaming).
- [Create a Azure Blob Storage resource](../storage/common/storage-account-create.md?tabs=azure-portal)
- [Get connection string to Azure Storage account](../storage/common/storage-account-keys-manage.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=azure-portal#view-account-access-keys). Make sure you select the **Copy** button to copy connection string to the clipboard.

## Create an Azure function
1. Create an Azure function by following instructions from the **Create a local project** section of [Quickstart: Create a JavaScript function in Azure using Visual Studio Code](../azure-functions/create-first-function-vs-code-node.md?pivots=nodejs-model-v3).
   1. Select **Azure Event Grid trigger** for the function template instead of **HTTP trigger** as mentioned in the quickstart.
   1. Continue to follow the steps, but use the following **index.js** and **function.json** files.

      > [!IMPORTANT]
      > Update the **package.json** to include `@azure/storage-blob` as a dependency.

      **function.json**

      ```json
      {
        "bindings": [
          {
            "type": "eventGridTrigger",
            "name": "eventGridEvent",
            "direction": "in"
          },
          {
            "type": "blob",
            "name": "outputBlob",
            "path": "events/{rand-guid}.json",
            "connection": "OUTPUT_STORAGE_ACCOUNT",
            "direction": "out"
          }
        ]
      }
      ```

      **index.js**

      ```javascript
      // Event Grid always sends an array of data and may send more
      // than one event in the array. The runtime invokes this function
      // once for each array element, so we are always dealing with one.
      // See: https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-grid-trigger?tabs=
      module.exports = async function (context, eventGridEvent) {
          context.log(JSON.stringify(context.bindings));
          context.log(JSON.stringify(context.bindingData));

          context.bindings.outputBlob = JSON.stringify(eventGridEvent);
      };
      ```

1. Create an Azure function app using instructions from [Quick function app create](../azure-functions/functions-develop-vs-code.md?tabs=csharp#quick-function-app-create).
1. Deploy your function to the function app on Azure using instructions from [Deploy project files](../azure-functions/functions-develop-vs-code.md?tabs=csharp#republish-project-files).

## Configure Azure function to use your blob storage
1. Configure your Azure function to use your storage account.
    1. Select **Configuration** under **Settings** on the left menu.
    1. On the **Application settings** page, select **+ New connection string** on the command bar.
    1. Set **Name** to **AzureWebJobsOUTPUT_STORAGE_ACCOUNT**.
    1. Set **Value** to the connection string to the storage account that you copied to the clipboard in the previous step.
    1. Select **OK**.

## Create event subscription for partner topic using function

1. In the Azure portal, navigate to the Event Grid **partner topic** created by your **Auth0 log stream**.

    :::image type="content" source="./media/auth0-log-stream-blob-storage/add-event-subscription-menu.png" alt-text="Screenshot showing the Event Grid Partner Topics page with Add Event Subscription button selected.":::
1. On the **Create Event Subscription** page, follow these steps:
    1. Enter a **name** for the event subscription.
    1. For **Endpoint type**, select **Azure Function**.

        :::image type="content" source="./media/auth0-log-stream-blob-storage/select-endpoint-type.png" alt-text="Screenshot showing the Create Event Subscription page with Azure Functions selected as the endpoint type.":::
    1. Click **Select an endpoint** to specify details about the function.
1. On the **Select Azure Function** page, follow these steps.
    1. Select the **Azure subscription** that contains the function.
    1. Select the **resource group** that contains the function.
    1. Select your **function app**.
    1. Select your **Azure function**.
    1. Then, select **Confirm Selection**.
1. Now, back on the **Create Event Subscription** page, select **Create** to create the event subscription.
1. After the event subscription is created successfully, you see the event subscription in the bottom pane of the **Event Grid Partner Topic - Overview** page.
1. Select the link to your Azure function at the bottom of the page.
1. On the **Azure Function** page, select **Monitor** and confirm data is successfully being sent. You may need to trigger logs from Auth0.

## Verify that logs are stored in the storage account

1. Locate your storage account in the Azure portal.
1. Select **Containers** under **Data Storage** on the left menu.
1. Confirm that you see a container named **events**.
1. Select the container and verify that your Auth0 logs are being stored.

    > [!NOTE]
    > You can use steps in the article to handle events from other event sources too. For a generic example of sending Event Grid events to Azure Blob Storage or Azure Monitor Application Insights, see [this example on GitHub](https://github.com/awkwardindustries/azure-monitor-handler).

## Next steps

- [Auth0 Partner Topic](auth0-overview.md)
- [Subscribe to Auth0 events](auth0-how-to.md)
- [Send Auth0 events to Azure Blob Storage](auth0-log-stream-blob-storage.md)
