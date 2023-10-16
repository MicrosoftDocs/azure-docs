---
title: Send Blob storage events to web endpoint - Bicep
description: Use Azure Event Grid and a Bicep file to create Blob storage account, subscribe to events, and send events to a Webhook.
ms.date: 07/13/2022
ms.topic: quickstart
ms.custom: devx-track-bicep
---

# Quickstart: Route Blob storage events to web endpoint by using Bicep

Azure Event Grid is an eventing service for the cloud. In this article, you use a Bicep file to create a Blob storage account, subscribe to events for that blob storage, and trigger an event to view the result. Typically, you send events to an endpoint that processes the event data and takes actions. However, to simplify this article, you send the events to a web app that collects and displays the messages.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Create a message endpoint

Before subscribing to the events for the Blob storage, let's create the endpoint for the event message. Typically, the endpoint takes actions based on the event data. To simplify this quickstart, you deploy a [pre-built web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

1. Select **Deploy to Azure** to deploy the solution to your subscription. In the Azure portal, provide values for the parameters.

    [Deploy to Azure](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json)
1. The deployment may take a few minutes to complete. After the deployment has succeeded, view your web app to make sure it's running. In a web browser, navigate to:
`https://<your-site-name>.azurewebsites.net`

1. You see the site but no events have been posted to it yet.

   ![Screenshot that shows how to view the new site.](./media/blob-event-quickstart-portal/view-site.png)

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventgrid/event-grid-subscription-and-storage).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.eventgrid/event-grid-subscription-and-storage/main.bicep":::

Two Azure resources are defined in the Bicep file:

* [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage account.
* [**Microsoft.EventGrid/systemTopics**](/azure/templates/microsoft.eventgrid/systemtopics): create a system topic with the specified name for the storage account.
* [**Microsoft.EventGrid/systemTopics/eventSubscriptions**](/azure/templates/microsoft.eventgrid/systemtopics/eventsubscriptions): create an Azure Event Grid subscription for the system topic.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters endpoint=<endpoint>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -endpoint "<endpoint>"
    ```

    ---

    > [!NOTE]
    > Replace **\<endpoint \>** with the URL of your web app and append `api/updates` to the URL.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

> [!NOTE]
> You can find more Azure Event Grid template samples [here](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Eventgrid&pageNumber=1&sort=Popular).

## Validate the deployment

View your web app again, and notice that a subscription validation event has been sent to it. Select the eye icon to expand the event data. Event Grid sends the validation event so the endpoint can verify that it wants to receive event data. The web app includes code to validate the subscription.

![Screenshot that shows how to view a subscription event.](./media/blob-event-quickstart-portal/view-subscription-event.png)

Now, let's trigger an event to see how Event Grid distributes the message to your endpoint.

You trigger an event for the Blob storage by uploading a file. The file doesn't need any specific content. The articles assumes you have a file named testfile.txt, but you can use any file.

When you upload the file to the Azure Blob storage, Event Grid sends a message to the endpoint you configured when subscribing. The message is in the JSON format and it contains an array with one or more events. In the following example, the JSON message contains an array with one event. View your web app and notice that a blob created event was received.

![Screenshot that shows how to view the results.](./media/blob-event-quickstart-portal/view-results.png)

## Clean up resources

When no longer needed, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group).

## Next steps

For more information about Azure Resource Manager templates and Bicep, see the following articles:

* [Azure Resource Manager documentation](../azure-resource-manager/index.yml)
* [Define resources in Azure Resource Manager templates](/azure/templates/)
* [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/)
* [Azure Event Grid templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Eventgrid).
