---
# Mandatory fields.
title: Move instance to a different Azure region
titleSuffix: Azure Digital Twins
description: See how to move an Azure Digital Twins instance from one Azure region to another.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 08/26/2020
ms.topic: how-to
ms.custom: subject-moving-resources
ms.service: digital-twins
#Customer intent: As an Azure service administrator, I want to move my Azure Digital Twins instance to another region.

# Optional fields. Don't forget to remove # if you need a field.
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Move an Azure Digital Twins instance to a different Azure region

If you need to move your Azure Digital Twins instance from one region to another, the current process is to re-create your resources in the new region and then delete the original resources. At the end of this process, you'll be working with a new Azure Digital Twins instance that's identical to the first, except for the updated location.

This article provides guidance on how to do a complete move and copy over everything you'll need to make the new instance match the original.

This process includes the following steps:

* **Prepare:** Download your original models, twins, and graph.
* **Move:** Create a new Azure Digital Twins instance in a new region.
* **Move:** Repopulate the new Azure Digital Twins instance.
    - Upload the original models, twins, and graph.
    - Re-create endpoints and routes.
    - Relink connected resources.
* **Clean up source resources:** Delete the original instance.

## Prerequisites

Before you attempt to re-create your Azure Digital Twins instance, go over the components of your original instance to get a clear idea of all the pieces that will need to be re-created.

Here are some questions to consider:

* What are the *models* uploaded to my instance? How many are there?
* What are the *twins* in my instance? How many are there?
* What's the general shape of the *graph* in my instance? How many relationships are there?
* What *endpoints* do I have in my instance?
* What *routes* do I have in my instance? Do they have filters?
* Where does my instance *connect to other Azure services*? Some common integration points include:

    - Azure Event Grid, Azure Event Hubs, or Azure Service Bus
    - Azure Functions
    - Azure Logic Apps
    - Azure Time Series Insights
    - Azure Maps
    - Azure IoT Hub Device Provisioning Service
* What other *personal or company apps* do I have that connect to my instance?

You can gather this information by using the [Azure portal](https://portal.azure.com), [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md), [Azure Digital Twins CLI commands](how-to-use-cli.md), or the [Azure Digital Twins (ADT) Explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/) sample.

## Prepare

In this section, you'll prepare to re-create your instance by downloading your original models, twins, and graph from your original instance. This article uses the [ADT Explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/) sample for this task.

>[!NOTE]
>You might already have files that contain the models or the graph in your instance. If so, you don't need to download everything again—just the pieces you're missing or things that might have changed since you originally uploaded these files. For example, you might have twins that were updated with new data.

### Limitations of ADT Explorer

The [ADT Explorer sample](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/) is a client app sample that supports a visual representation of your graph and provides visual interaction with your instance. This article shows how to use it to download, and later reupload, your models, twins, and graphs.

This sample isn't a complete tool. It hasn't been stress tested and wasn't built to handle graphs of a large size. Consequently, keep in mind the following out-of-the-box sample limitations:

* The sample has currently only been tested on graph sizes up to 1,000 nodes and 2,000 relationships.
* The sample doesn't support retrying in the case of any intermittent failures.
* The sample won't necessarily notify the user if data uploaded is incomplete.
* The sample doesn't handle errors resulting from very large graphs that exceed available resources like memory.

If the sample isn't able to handle the size of your graph, you can export and import the graph by using other Azure Digital Twins developer tools:

* [Azure Digital Twins CLI commands](how-to-use-cli.md)
* [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md)

### Set up the ADT Explorer application

To proceed with ADT Explorer, first download the sample application code and set it up to run on your machine.

To get the sample, see [ADT Explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/). Select the **Download ZIP** button to download a .zip file of this sample code to your machine as **Azure_Digital_Twins__ADT__explorer.zip**. Unzip the file.

Next, set up and configure permissions for ADT Explorer. Follow the instructions in the [Set up Azure Digital Twins and ADT Explorer](quickstart-adt-explorer.md#set-up-azure-digital-twins-and-adt-explorer) section of the Azure Digital Twins quickstart. This section walks you through the following steps:

1. Set up an Azure Digital Twins instance. You can skip this part because you already have an instance.
1. Set up local Azure credentials to provide access to your instance.
1. Run ADT Explorer and configure it to connect to your instance. You'll use the *host name* of your original Azure Digital Twins instance that you're moving.

Now you should have the ADT Explorer sample app running in a browser on your machine. The sample should be connected to your original Azure Digital Twins instance.

:::image type="content" source="media/how-to-move-regions/explorer-blank.png" alt-text="Browser window showing an app running at localhost:3000. The app is called ADT Explorer and contains boxes for Query Explorer, Model View, Graph View, and Property Explorer. There's no onscreen data yet." lightbox="media/how-to-move-regions/explorer-blank.png":::

To verify the connection, select the **Run Query** button to run the default query that displays all twins and relationships in the graph in the **GRAPH EXPLORER** box.

:::image type="content" source="media/how-to-move-regions/run-query.png" alt-text="A button reading Run Query in the upper-right corner of the window is highlighted." lightbox="media/how-to-move-regions/run-query.png":::

You can leave ADT Explorer running because you'll use it again later in this article to reupload these items to your new instance in the target region.

### Download models, twins, and graph

Next, download the models, twins, and graph in your solution to your machine.

To download all of these items at once, first make sure the full graph is showing in the **GRAPH VIEW** box. To check, rerun the default query of `SELECT * FROM digitaltwins` in the **QUERY EXPLORER** box.
 
Then, select the **Export Graph** icon in the **GRAPH VIEW** box.

:::image type="content" source="media/how-to-move-regions/export-graph.png" alt-text="In the Graph View box, an icon is highlighted. It shows an arrow pointing down out of a cloud." lightbox="media/how-to-move-regions/export-graph.png":::

This action enables a **Download** link in the **GRAPH VIEW** box. Select it to download a JSON-based representation of the query result, which includes your models, twins, and relationships. This action should download a .json file to your machine.

>[!NOTE]
>If the downloaded file appears to have a different file extension, try editing the extension directly and changing it to .json.

## Move

Next, you'll complete the "move" of your instance by creating a new instance in the target region. Then you'll populate it with the data and components from your original instance.

### Create a new instance

First, create a new instance of Azure Digital Twins in your target region. Follow the steps in [Set up an instance and authentication](how-to-set-up-instance-portal.md). Keep these pointers in mind:

* You can keep the same name for the new instance *if* it's in a different resource group. If you need to use the same resource group that contains your original instance, your new instance will need its own distinct name.
* Enter the new target region when prompted for a location.

After this step is complete, you'll need the host name of your new instance to continue setting it up with your data. If you didn't make a note of the host name during setup, follow [these instructions](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values) to get it now from the Azure portal.

### Repopulate the old instance

Next, you'll set up the new instance so that it's a copy of the original.

#### Upload the original models, twins, and graph by using ADT Explorer

In this section, you can reupload your models, twins, and graph to the new instance. If you don't have any models, twins, or graph in your original instance or you don't want to move them to the new instance, you can skip to the [next section](#re-create-endpoints-and-routes).

Otherwise, return to the browser window running ADT Explorer and follow these steps.

##### Connect to the new instance

Currently, ADT Explorer is connected to your original Azure Digital Twins instance. Switch the connection to point to your new instance by selecting the **Sign In** button in the upper-right corner of the window.

:::image type="content" source="media/how-to-move-regions/sign-in.png" alt-text="ADT Explorer highlighting the Sign In icon in the upper-right corner of the window. The icon shows a simple silhouette of a person overlaid with a silhouette of a key." lightbox="media/how-to-move-regions/sign-in.png":::

Replace the **ADT URL** to reflect your new instance. Change this value so that it reads *https://{new instance host name}*.

Select **Connect**. You might be asked to sign in again with your Azure credentials or grant this application consent for your instance.

##### Upload models, twins, and graph

Next, upload the solution components that you downloaded earlier to your new instance.

To upload your models, twins, and graph, select the **Import Graph** icon in the **GRAPH VIEW** box. This option uploads all three of these components at once. It even uploads models that aren't currently being used in the graph.

:::image type="content" source="media/how-to-move-regions/import-graph.png" alt-text="In the Graph View box, an icon is highlighted. It shows an arrow pointing into a cloud." lightbox="media/how-to-move-regions/import-graph.png":::

In the file selector box, go to your downloaded graph. Select the graph **.json** file, and select **Open**.

After a few seconds, ADT Explorer opens an **Import** view that shows a preview of the graph to be loaded.

To confirm the graph upload, select the **Save** icon in the upper-right corner of the **GRAPH VIEW** box.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-move-regions/graph-preview-save.png" alt-text="Highlighting the Save icon in the Graph Preview pane." lightbox="media/how-to-move-regions/graph-preview-save.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

ADT Explorer now uploads your models and graph (including the twins and relationships) to your new Azure Digital Twins instance. You should see a success message noting how many models, twins, and relationships were uploaded.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-move-regions/import-success.png" alt-text="Dialog box indicating graph import success. It reads 'Import successful. 2 models imported. 4 twins imported. 2 relationships imported.'" lightbox="media/how-to-move-regions/import-success.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

To verify everything was uploaded successfully, select the **Run Query** button in the **GRAPH EXPLORER** box to run the default query that displays all twins and relationships in the graph. This action also refreshes the list of models in the **MODEL VIEW** box.

:::image type="content" source="media/how-to-move-regions/run-query.png" alt-text="Highlight around the Run Query button in the upper-right corner of the window." lightbox="media/how-to-move-regions/run-query.png":::

You should see your graph with all its twins and relationships displayed in the **GRAPH EXPLORER** box. You should also see your models listed in the **MODEL VIEW** box.

:::image type="content" source="media/how-to-move-regions/post-upload.png" alt-text="A view of ADT Explorer showing two models highlighted in the Model View box and a graph highlighted in the Graph Explorer box." lightbox="media/how-to-move-regions/post-upload.png":::

These views confirm that your models, twins, and graph were re-uploaded to the new instance in the target region.

#### Re-create endpoints and routes

If you have endpoints or routes in your original instance, you'll need to re-create them in your new instance. If you don't have any endpoints or routes in your original instance or you don't want to move them to the new instance, you can skip to the [next section](#relink-connected-resources).

Otherwise, follow the steps in [Manage endpoints and routes](how-to-manage-routes-portal.md) using the new instance. Keep these pointers in mind:

* You do *not* need to re-create the Event Grid, Event Hubs, or Service Bus resource that you're using for the endpoint. For more information, see the "Prerequisites" section in the endpoint instructions. You just need to re-create the endpoint on the Azure Digital Twins instance.
* You can reuse endpoint and route names because they're scoped to a different instance.
* Remember to add any required filters to the routes you create.

#### Relink connected resources

If you have other apps or Azure resources that are connected to your original Azure Digital Twins instance, you'll need to edit the connection so that they reach your new instance instead. These resources might include other Azure services or personal or company apps that you've set up to work with Azure Digital Twins.

If you don't have any other resources connected to your original instance or you don't want to move them to the new instance, you can skip to the [next section](#verify).

Otherwise, consider the connected resources in your scenario. You don't need to delete and re-create any connected resources. Instead, you just need to edit the points where they connect to an Azure Digital Twins instance through its host name. Then you update these points to use the host name of the new instance instead of the original.

The exact resources you need to edit depends on your scenario, but here are some common integration points:

* Azure Functions. If you have an Azure function whose code includes the host name of the original instance, you should update this value to the new instance's host name and republish the function.
* Event Grid, Event Hubs, or Service Bus.
* Logic Apps.
* Time Series Insights.
* Azure Maps.
* IoT Hub Device Provisioning Service.
* Personal or company apps outside of Azure, such as the client app created in [Tutorial: Code a client app](tutorial-code.md), that connect to the instance and call Azure Digital Twins APIs.
* Azure AD app registrations do *not* need to be re-created. If you're using an [app registration](how-to-create-app-registration.md) to connect to the Azure Digital Twins APIs, you can reuse the same app registration with your new instance.

After you finish this step, your new instance in the target region should be a copy of the original instance.

## Verify

To verify that your new instance was set up correctly, use the following tools:

* [Azure portal](https://portal.azure.com). The portal is good for verifying that your new instance exists and is in the correct target region. It's also good for verifying endpoints and routes and connections to other Azure services.
* [Azure Digital Twins CLI commands](how-to-use-cli.md). These commands are good for verifying that your new instance exists and is in the correct target region. They also can be used to verify instance data.
* [ADT Explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/). ADT Explorer is good for verifying instance data like models, twins, and graphs.
* [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md). These resources are good for verifying instance data like models, twins, and graphs. They're also good for verifying endpoints and routes.

You can also try running any custom apps or end-to-end flows that you had running with your original instance to help you verify that they're working correctly with the new instance.

## Clean up source resources

Now that your new instance is set up in the target region with a copy of the original instance's data and connections, you can delete the original instance.

You can use the [Azure portal](https://portal.azure.com), the [Azure CLI](how-to-use-cli.md), or the [control plane APIs](how-to-use-apis-sdks.md#overview-control-plane-apis).

To delete the instance by using the Azure portal, [open the portal](https://portal.azure.com) in a browser window and go to your original Azure Digital Twins instance by searching for the name in the portal search bar.

Select the **Delete** button, and follow the prompts to finish the deletion.

:::image type="content" source="media/how-to-move-regions/delete-instance.png" alt-text="View of the Azure Digital Twins instance details in the Azure portal, on the Overview tab. The Delete button is highlighted.":::