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

If you need to move your Azure Digital Twins instance from one region to another, the current process is to **recreate your resources in the new region**, and then (optionally) delete the original resources. At the end of this process, you will be working with a new Azure Digital Twins instance that is identical to the first, except for the updated location.

This article provides guidance on how to do a complete move, copying over everything you'll need to make the new instance match the original.

This process includes the following steps:
* Prepare: Download your original models, twins, and graph
* Move: Create a new Azure Digital Twins instance, in a new region
* Move: Repopulate the new Azure Digital Twins instance
    - Upload original models, twins, and graph
    - Recreate routes & endpoints
    - Re-link connected Azure services
* Clean up source resources (optional): Delete original instance

## Prerequisites

Before attempting to recreate your Azure Digital Twins instance, it's a good idea to go over the components of your original instance and get a clear idea of all the pieces that will need to be recreated.

Here are some questions you may want to consider:
* What are the **models** uploaded to my instance? How many are there?
* What are the **twins** in my instance? How many are there?
* What is the general shape of the **graph** in my instance? How many relationships are there?
* What **endpoints** do I have in my instance?
* What **routes** do I have in my instance?
* Where does my instance **connect to other Azure services**? Some common integration points include...
    - IoT Hub
    - Event Grid, Event Hub, or Service Bus
    - Azure functions
    - Logic Apps
    - Time Series Insights
    - Azure Maps
    - Device Provisioning Service (DPS)

You can gather this information using the [Azure portal](https://portal.azure.com), [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md), [Azure Digital Twins CLI commands](how-to-use-cli.md), or the [Azure Digital Twins (ADT) Explorer](https://docs.microsoft.com/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/) sample.

## Prepare

In this section, you will prepare to recreate your instance by **downloading your original models, twins, and graph** from your original instance. You will do this using the [Azure Digital Twins (ADT) Explorer](https://docs.microsoft.com/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/) sample.

>[!NOTE]
>You may already have files containing the models and/or the graph in your instance. If so, you do not need to download everything again—just the pieces you are missing or things that may have changed since you originally uploaded these files (such as twins that may have been updated with new data).

### Set up ADT Explorer application

First, download the sample application code and set it up to run on your machine. 

Navigate to the sample here: [Azure Digital Twins (ADT) explorer](https://docs.microsoft.com/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/). Hit the *Download ZIP* button to download a *.ZIP* file of this sample code to your machine as _**ADT_Explorer.zip**_. Unzip the file.

Next, set up permissions for ADT Explorer to run on your machine. To do this, follow the steps in the [*Set ADT Explorer permissions*](quickstart-adt-explorer.md#set-adt-explorer-permissions) section of the Azure Digital Twins quickstart.

Finally, run and configure ADT Explorer to connect to your original Azure Digital Twins instance. Follow the steps in the [*Run and configure ADT Explorer*](quickstart-adt-explorer.md#run-and-configure-adt-explorer) section of the quickstart.

Now you should have the ADT Explorer sample app running in a browser on your machine. The sample should be connected to your original Azure Digital Twins instance.

:::image type="content" source="media/quickstart-adt-explorer/explorer-blank.png" alt-text="Browser window showing an app running at localhost:3000. The app is called ADT Explorer and contains boxes for a Query Explorer, Model View, Graph View, and Property Explorer. There is no onscreen data yet." lightbox="media/quickstart-adt-explorer/explorer-blank.png":::

To verify the connection, you can hit the *Run query* button to run the default query that displays all twins and relationships in the graph in the *GRAPH EXPLORER* box.

:::image type="content" source="media/quickstart-adt-explorer/run-query.png" alt-text="A button reading 'Run Query' near the top of the window is highlighted" lightbox="media/quickstart-adt-explorer/run-query.png":::

### Download models, twins, and graph

Next, download the various components of your solution to your machine.

<!-- Model download possibly not necessary if included with graph download -->
To download your **models**, use the *Download models* icon in the *MODEL VIEW* box.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-move-regions/download-models.png" alt-text="In the Model View box, the first icon is highlighted. It shows an arrow pointing down out of a cloud." lightbox="media/how-to-move-regions/download-models.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

To download your **twins and graph**, make sure the full graph is showing in the *GRAPH VIEW* box (you can do this by rerunning the default query of `SELECT * FROM digitaltwins` in the *QUERY EXPLORER* box).
 
Then, hit the *Export graph* icon in the *GRAPH VIEW* box.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-move-regions/export-graph.png" alt-text="In the Graph View box, an icon is highlighted. It shows an arrow pointing down out of a cloud." lightbox="media/how-to-move-regions/export-graph.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

This will enable a *Download* link in the *GRAPH VIEW*. Select it to download a JSON-based representation of the query result, including your models, twins, and relationships.

<!-- Does it export models? Need to verify. -->

## Move

### Create a new instance

Can probably use the same name but needs to be in diff region (for ADT requirements) and diff resource group (for Azure requirements)
Follow the rest of our instructions to create a new instance

### Repopulate old instance

#### Upload original graph using ADT Explorer

#### Recreate routes & endpoints

#### Re-link connected Azure services

Change values in other services that link to it and reference its hostname.

<!-- Anything else changing, if the name can stay the same? -->

Commonly includes:
* Client app
* Azure function (new values & re-publish?)

## Verify

### Verify instance

Look for it in portal, look at region.

### Verify graph

Use ADT Explorer

### Verify endpoints and routes

Look under the instance in portal

### Verify other Azure services

Depends on the service, but try to run them.

## Clean up source resources

Use the portal or the CLI to delete the instance.