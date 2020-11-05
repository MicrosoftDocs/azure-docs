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

If you need to move your Azure Digital Twins instance from one region to another, the current process is to **recreate your resources in the new region**, and then delete the original resources. At the end of this process, you will be working with a new Azure Digital Twins instance that is identical to the first, except for the updated location.

This article provides guidance on how to do a complete move, copying over everything you'll need to make the new instance match the original.

This process includes the following steps:
1. Prepare: Download your original models, twins, and graph.
2. Move: Create a new Azure Digital Twins instance, in a new region.
3. Move: Repopulate the new Azure Digital Twins instance.
    - Upload original models, twins, and graph.
    - Recreate endpoints and routes.
    - Re-link connected resources.
4. Clean up source resources: Delete original instance.

## Prerequisites

Before attempting to recreate your Azure Digital Twins instance, it's a good idea to go over the components of your original instance and get a clear idea of all the pieces that will need to be recreated.

Here are some questions you may want to consider:
* What are the **models** uploaded to my instance? How many are there?
* What are the **twins** in my instance? How many are there?
* What is the general shape of the **graph** in my instance? How many relationships are there?
* What **endpoints** do I have in my instance?
* What **routes** do I have in my instance? Do they have filters?
* Where does my instance **connect to other Azure services**? Some common integration points include...
    - Event Grid, Event Hub, or Service Bus
    - Azure Functions
    - Logic Apps
    - Time Series Insights
    - Azure Maps
    - Device Provisioning Service (DPS)
* What other **personal or company apps** do I have that connect to my instance?

You can gather this information using the [Azure portal](https://portal.azure.com), [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md), [Azure Digital Twins CLI commands](how-to-use-cli.md), or the [Azure Digital Twins (ADT) Explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/) sample.

## Prepare

In this section, you will prepare to recreate your instance by **downloading your original models, twins, and graph** from your original instance. This article does this using the [Azure Digital Twins (ADT) Explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/) sample.

>[!NOTE]
>You may already have files containing the models and/or the graph in your instance. If so, you do not need to download everything again—just the pieces you are missing or things that may have changed since you originally uploaded these files (such as twins that may have been updated with new data).

### Limitations of ADT Explorer

The [Azure Digital Twins (ADT) Explorer sample](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/) is a client app sample that supports a visual representation of your graph, and provides visual interaction with your instance. This article shows how to use it to download, and later re-upload, your models, twins, and graphs.

Please note, however, that this is a **sample** and not a complete tool. It has not been stress tested, and was not built to handle graphs of a large size. Consequently, please keep in mind the following out-of-the-box sample limitations:
* The sample has currently only been tested on graph sizes up to 1000 nodes and 2000 relationships
* The sample does not support retrying in the case of any intermittent failures
* The sample will not necessarily notify the user if data uploaded is incomplete
* The sample doesn't handle errors resulting from very large graphs exceeding available resources like memory

If the sample is not able to handle the size of your graph, you can export and import the graph using other Azure Digital Twins developer tools:
* [Azure Digital Twins CLI commands](how-to-use-cli.md)
* [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md)

### Set up ADT Explorer application

To proceed with ADT Explorer, first download the sample application code and set it up to run on your machine. 

Navigate to the sample here: [Azure Digital Twins (ADT) explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/). Hit the *Download ZIP* button to download a *.ZIP* file of this sample code to your machine as _**Azure_Digital_Twins__ADT__explorer.zip**_. Unzip the file.

Next, set up and configure permissions for ADT Explorer. To do this, follow the instructions in the [*Set up Azure Digital Twins and ADT Explorer*](quickstart-adt-explorer.md#set-up-azure-digital-twins-and-adt-explorer) section of the Azure Digital Twins quickstart. This section walks you through the following steps:
1. Set up an Azure Digital Twins instance (you can skip this part since you have an instance already)
2. Set up local Azure credentials to provide access to your instance
3. Run ADT Explorer and configure it to connect to your instance. You will use the **hostname** of your original Azure Digital Twins instance that you are moving.

Now you should have the ADT Explorer sample app running in a browser on your machine. The sample should be connected to your original Azure Digital Twins instance.

:::image type="content" source="media/how-to-move-regions/explorer-blank.png" alt-text="Browser window showing an app running at localhost:3000. The app is called ADT Explorer and contains boxes for a Query Explorer, Model View, Graph View, and Property Explorer. There is no onscreen data yet." lightbox="media/how-to-move-regions/explorer-blank.png":::

To verify the connection, you can hit the *Run query* button to run the default query that displays all twins and relationships in the graph in the *GRAPH EXPLORER* box.

:::image type="content" source="media/how-to-move-regions/run-query.png" alt-text="A button reading 'Run Query' near the top of the window is highlighted" lightbox="media/how-to-move-regions/run-query.png":::

You can leave ADT Explorer running, as you will use it again later in this article to re-upload these items to your new instance in the target region.

### Download models, twins, and graph

Next, download the models, twins, and graph in your solution to your machine.

To download all of these at once, first make sure the full graph is showing in the *GRAPH VIEW* box (you can do this by rerunning the default query of `SELECT * FROM digitaltwins` in the *QUERY EXPLORER* box).
 
Then, hit the *Export graph* icon in the *GRAPH VIEW* box.

:::image type="content" source="media/how-to-move-regions/export-graph.png" alt-text="In the Graph View box, an icon is highlighted. It shows an arrow pointing down out of a cloud." lightbox="media/how-to-move-regions/export-graph.png":::

This will enable a *Download* link in the *GRAPH VIEW*. Select it to download a JSON-based representation of the query result, including your models, twins, and relationships. This should download a *.json* file to your machine.

>[!NOTE]
>If the downloaded file appears to have a different file extension, try editing the extension directly and changing it to *.json*.

## Move

Next, you will complete the "move" of your instance by creating a new instance in the target region, and populating it with the data and components from your original instance.

### Create a new instance

First, **create a new instance of Azure Digital Twins in your target region**. To do this, follow the steps in [*How-to: Set up an instance and authentication*](how-to-set-up-instance-portal.md), keeping these pointers in mind:
* You can keep the same name for the new instance **if** it is in a different resource group. If you need to use the same resource group that contains your original instance, then your new instance will need its own distinct name.
* Enter the target new region when prompted for a location.

Once this is complete, you will need the **hostname** of your new instance to continue setting it up with your data. If you didn't make a note of this during setup, you can follow [these instructions](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values) to get it now from the Azure portal.

### Repopulate old instance

Next, you will set up the new instance so that it is a copy of the original.

#### Upload original models, twins, and graph using ADT Explorer

In this section, you can re-upload your models, twins, and graph to the new instance. If you don't have any models, twins, or graphs in your original instance or you don't want to move them to the new instance, you can skip to the [next section](#recreate-endpoints-and-routes).

Otherwise, to proceed, return to the browser window running **ADT Explorer** and follow the steps below.

##### Connect to the new instance

Currently, ADT Explorer is connected to your original Azure Digital Twins instance. Switch the connection to point to your new instance by hitting the *Sign in* button at the top of the window. 

:::image type="content" source="media/how-to-move-regions/sign-in.png" alt-text="ADT Explorer highlighting the Sign In icon near the top of the window. The icon shows a simple silhouette of a person overlaid with a silhouette of a key." lightbox="media/how-to-move-regions/sign-in.png":::

Replace the *ADT URL* to reflect your new instance. Change this value to that it reads *https://{new instance hostname}*.

Hit *Connect*. You may be asked to log in again with your Azure credentials, and/or grant this application consent for your instance.

##### Upload models, twins, and graph

Next, upload the solution components that you downloaded earlier to your new instance.

To upload your **models, twins, and graph**, hit the *Import Graph* icon in the *GRAPH VIEW* box. This option will upload all three of these components at once (even models that are not currently being used in the graph).

:::image type="content" source="media/how-to-move-regions/import-graph.png" alt-text="In the Graph View box, an icon is highlighted. It shows an arrow pointing into a cloud." lightbox="media/how-to-move-regions/import-graph.png":::

In the file selector box, navigate to your downloaded graph. Select the graph *.json* file and hit *Open*.

After a few seconds, ADT Explorer will open an *Import* view displaying a preview of the graph that is going to be loaded.

To confirm the graph upload, hit the *Save* icon in the upper right corner of the *GRAPH VIEW*:

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-move-regions/graph-preview-save.png" alt-text="Highlighting the Save icon in the Graph Preview pane" lightbox="media/how-to-move-regions/graph-preview-save.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

ADT Explorer will now upload your models and graph (including the twins and relationships) to your new Azure Digital Twins instance. You should see a success message noting how many models, twins, and relationships were uploaded:

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-move-regions/import-success.png" alt-text="Dialog box indicating graph import success. It reads 'Import successful. 2 models imported. 4 twins imported. 2 relationships imported.'" lightbox="media/how-to-move-regions/import-success.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

To verify everything was uploaded successfully, hit the *Run Query* button in the *GRAPH EXPLORER* box to run the default query that displays all twins and relationships in the graph. This will also refresh the list of models in the *MODEL VIEW*.

:::image type="content" source="media/how-to-move-regions/run-query.png" alt-text="Highlight around the same 'Run Query' button from earlier, near the top of the window" lightbox="media/how-to-move-regions/run-query.png":::

You should see your graph with all its twins and relationships displayed in the *GRAPH EXPLORER* box. You should also see your models listed in the *MODEL VIEW* box.

:::image type="content" source="media/how-to-move-regions/post-upload.png" alt-text="A view of ADT Explorer showing 2 models highlighted in the 'Model View' box, and a graph highlighted in the 'Graph Explorer' box" lightbox="media/how-to-move-regions/post-upload.png":::

This confirms that your models, twins, and graph have been re-uploaded to the new instance in the target region.

#### Recreate endpoints and routes

If you have **endpoints and/or routes** in your original instance, you'll need to recreate them in your new instance. If you don't have any endpoints or routes in your original instance or you don't want to move them to the new instance, you can skip to the [next section](#re-link-connected-resources).

Otherwise, proceed, follow the steps in [*How-to: Manage endpoints and routes*](how-to-manage-routes-portal.md) using the new instance, keeping these pointers in mind: 
* You do **not need** to recreate the Event Grid, Event Hub, or Service Bus resource that you're using for the endpoint (*Prerequisite* sections in the endpoint instructions). You just need to re-create the endpoint on the Azure Digital Twins instance.
* You can reuse endpoint and route **names**, since they are scoped to a different instance.
* Remember to add any required **filters** to the routes you create.

#### Re-link connected resources

If you have other apps or Azure resources that are connected to your original Azure Digital Twins instance, you'll need to edit the connection so that they reach your new instance instead. This may include other Azure services, or personal or company apps that you've set up to work with Azure Digital Twins.

If you don't have any other resources connected to your original instance or you don't want to move them to the new instance, you can skip to the [next section](#verify).

Otherwise, to proceed, consider the connected resources in your scenario. You do not need to delete and re-create any connected resources; instead, you just need to edit the points where they connect to an Azure Digital Twins instance through its **hostname**, and update this to use the hostname of the new instance instead of the original.

The exact resources you need to edit depends on your scenario, but here are some common integration points:
* Azure Functions. If you have an Azure function whose code includes the hostname of the original instance, you should update this value to the new instance's hostname and re-publish the function.
* Event Grid, Event Hubs, or Service Bus
* Logic Apps
* Time Series Insights
* Azure Maps
* Device Provisioning Service (DPS)
* Personal or company apps outside of Azure, such as the **client app** created in [*Tutorial: Code a client app*](tutorial-code.md), that connect to the instance and call Azure Digital Twins APIs
* Azure AD app registrations do **not need** to be recreated. If you are using an [app registration](how-to-create-app-registration.md) to connect to the Azure Digital Twins APIs, you can reuse the same app registration with your new instance.

After completing this step, your new instance in the target region should be a copy of the original instance.

## Verify

To verify that your new instance was set up correctly, you can use the following tools:
* The [**Azure portal**](https://portal.azure.com) (good for verifying that your new instance exists and is in the correct target region; also good for verifying endpoints and routes, and connections to other Azure services)
* The [Azure Digital Twins **CLI commands**](how-to-use-cli.md) (good for verifying that your new instance exists and is in the correct target region; also can be used to verify instance data)
* [**ADT Explorer**](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/) (good for verifying instance data like models, twins, and graph)
* The [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md) (good for verifying instance data like models, twins, and graph; also good for verifying endpoints and routes)

You can also try running any custom apps or end-to-end flows that you had running with your original instance, to help you verify that they're working with the new instance correctly.

## Clean up source resources

Now that your new instance is set up in the target region with a copy of the original instance's data and connections, you can **delete the original instance**.

You can do this in the [Azure portal](https://portal.azure.com), with the [CLI](how-to-use-cli.md), or with the [control plane APIs](how-to-use-apis-sdks.md#overview-control-plane-apis).

To delete the instance using the Azure portal, [open the portal](https://portal.azure.com) in a browser window and navigate to your original Azure Digital Twins instance by searching for its name in the portal search bar.

Hit the *Delete* button, and follow the prompts to finish the deletion.

:::image type="content" source="media/how-to-move-regions/delete-instance.png" alt-text="View of the Azure Digital Twins instance details in the Azure portal, on the Overview tab. The Delete button is highlighted":::