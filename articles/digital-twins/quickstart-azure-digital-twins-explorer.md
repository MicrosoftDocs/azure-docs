---
title: Quickstart - Get started with Azure Digital Twins Explorer
titleSuffix: Azure Digital Twins
description: Learn how to use Azure Digital Twins Explorer by following this demo, where you'll use models to instantiate twins and interact with the twin graph.
author: baanders
ms.author: baanders
ms.date: 02/25/2022
ms.topic: quickstart
ms.service: digital-twins
ms.custom: mode-other
---

# Quickstart - Get started with a sample scenario in Azure Digital Twins Explorer

In this quickstart, you'll explore a prebuilt Azure Digital Twins graph using the [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md). This tool allows you to visualize and interact with your Azure Digital Twins data within the Azure portal.

With Azure Digital Twins, you can create and interact with live models of your real-world environments, which can be part of wider IoT solutions. First, you model individual elements as digital twins. Then you connect them into a knowledge graph that can respond to live events and be queried for information.

You'll complete the following steps:

1. Create an Azure Digital Twins instance, and connect to it in Azure Digital Twins Explorer.
1. Upload prebuilt models and graph data to construct the sample scenario.
1. Explore the scenario graph that's created.
1. Make changes to the graph.
1. Review your learnings from the experience.

The Azure Digital Twins example graph you'll be working with represents a building with two floors and two rooms. Floor0 contains Room0, and Floor1 contains Room1. The graph will look like this image:

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-view-full.png" alt-text="Screenshot of a graph made of four circular nodes connected by arrows in Azure Digital Twins Explorer.":::

>[!NOTE]
>This quickstart is for exploring a prebuilt graph to understand how Azure Digital Twins represents data. For simplicity, the quickstart does not cover setting up connections between IoT Hub devices and their graph representations. To set up a connected end-to-end flow for your graph, move ahead to the tutorials: [Connect an end-to-end solution](tutorial-end-to-end.md).

## Prerequisites

You'll need an Azure subscription to complete this quickstart. If you don't have one already, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

You'll also need to download the materials for the sample graph used in the quickstart. Use the instructions below to download the three required files. Later, you'll follow more instructions to upload them to Azure Digital Twins.
* [Room.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/client/examples/Room.json): This is a model file representing a room in a building. Navigate to the link, right-click anywhere on the screen, and select **Save as** in your browser's right-click menu. Use the following Save As window to save the file somewhere on your machine with the name *Room.json*.
* [Floor.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/client/examples/Floor.json): This is a model file representing a floor in a building. Navigate to the link, right-click anywhere on the screen, and select **Save as** in your browser's right-click menu. Use the following Save As window to save the file to the same location as *Room.json*, under the name *Floor.json*.
* [buildingScenario.xlsx](https://github.com/Azure-Samples/digital-twins-explorer/raw/main/client/examples/buildingScenario.xlsx): This file contains a graph of room and floor twins, and relationships between them. Depending on your browser settings, selecting this link may download the *buildingScenario.xlsx* file automatically to your default download location, or it may open the file in your browser with an option to download. Here is what that download option looks like in Microsoft Edge:

    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/download-building-scenario.png" alt-text="Screenshot of the buildingScenario.xlsx file viewed in a Microsoft Edge browser. A button saying Download is highlighted." lightbox="media/quickstart-azure-digital-twins-explorer/download-building-scenario.png":::

>[!TIP]
> These files are from the [Azure Digital Twins Explorer repository in GitHub](https://github.com/Azure-Samples/digital-twins-explorer). You can visit the repo for other sample files, explorer code, and more.

## Set up Azure Digital Twins

The first step in working with Azure Digital Twins is to create an Azure Digital Twins instance. After you create an instance of the service, you can connect to the instance in Azure Digital Twins Explorer, which you'll use to work with the instance throughout the quickstart.

The rest of this section walks you through the instance creation.

[!INCLUDE [digital-twins-quickstart-setup.md](../../includes/digital-twins-quickstart-setup.md)]

### Open instance in Azure Digital Twins Explorer

After deployment completes, use the **Go to resource** button to navigate to the instance's Overview page in the portal.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/deployment-complete.png" alt-text="Screenshot of the deployment page for Azure Digital Twins in the Azure portal. The page indicates that deployment is complete.":::

[!INCLUDE [digital-twins-access-explorer.md](../../includes/digital-twins-access-explorer.md)]

## Upload the sample materials

Next, you'll import the sample models and graph into Azure Digital Twins Explorer. You'll use the model files and the graph file that you downloaded to your machine in the [Prerequisites](#prerequisites) section.

### Models

The first step in an Azure Digital Twins solution is to define the vocabulary for your environment. You'll create custom *models* that describe the types of entity that exist in your environment.

Each model is written in a language like [JSON-LD](https://json-ld.org/) called *Digital Twin Definition Language (DTDL)*. Each model describes a single type of entity in terms of its properties, telemetry, relationships, and components. Later, you'll use these models as the basis for digital twins that represent specific instances of these types.

Typically, when you create a model, you'll complete three steps:

1. Write the model definition. In the quickstart, this step is already done as part of the sample solution.
1. Validate it to make sure the syntax is accurate. In the quickstart, this step is already done as part of the sample solution.
1. Upload it to your Azure Digital Twins instance.
 
For this quickstart, the model files are already written and validated for you. They're included with the solution you downloaded. In this section, you'll upload two prewritten models to your instance to define these components of a building environment:

* Floor
* Room

#### Upload the models (.json files)

Follow these steps to upload models (the *.json* files you downloaded earlier).

1. In the **Models** panel, select the **Upload a Model** icon that shows an arrow pointing upwards.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/upload-model.png" alt-text="Screenshot of the Azure Digital Twins Explorer, highlighting the Models panel and the 'Upload a Model' icon in it." lightbox="media/quickstart-azure-digital-twins-explorer/upload-model.png":::
 
1. In the Open window that appears, navigate to the folder containing the *Room.json* and *Floor.json* files that you downloaded earlier.
1. Select *Room.json* and *Floor.json*, and select **Open** to upload them both. 

Azure Digital Twins Explorer will upload these model files to your Azure Digital Twins instance. They should show up in the **Models** panel and display their friendly names and full model IDs. 

You can select **View Model** for either model to see the DTDL code behind it.

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/model-info.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the Models panel with two model definitions listed inside, Floor and Room." lightbox="media/quickstart-azure-digital-twins-explorer/model-info.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

### Twins and the twin graph

Now that some models have been uploaded to your Azure Digital Twins instance, you can add *digital twins* based on the model definitions.

*Digital twins* represent the actual entities within your business environment. They can be things like sensors on a farm, lights in a car, or—in this quickstart—rooms on a building floor. You can create many twins of any given model type, such as multiple rooms that all use the Room model. You connect them with relationships into a *twin graph* that represents the full environment.

In this section, you'll upload pre-created twins that are connected into a pre-created graph. The graph contains two floors and two rooms, connected in the following layout:

* Floor0
    - Contains Room0
* Floor1
    - Contains Room1

#### Import the graph (.xlsx file)

Follow these steps to import the graph (the *.xlsx* file you downloaded earlier).

1. In the **Twin Graph** panel, select the **Import Graph** icon that shows an arrow pointing into a cloud.

   :::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-import.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The Import Graph button is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-import.png":::

2. In the Open window, navigate to the *buildingScenario.xlsx* file you downloaded earlier. This file contains a description of the sample graph. Select **Open**.

   After a few seconds, Azure Digital Twins Explorer opens an **Import** view that shows a preview of the graph to be loaded.

3. To finish importing the graph, select the **Save** icon in the upper-right corner of the graph preview panel.

    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-preview-save.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Save icon in the Graph Preview pane." lightbox="media/quickstart-azure-digital-twins-explorer/graph-preview-save.png":::

4. Azure Digital Twins Explorer will use the uploaded file to create the requested twins and relationships between them. Make sure you see the following dialog box indicating that the import was successful before moving on.

   :::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/import-success.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing a dialog box indicating graph import success." lightbox="media/quickstart-azure-digital-twins-explorer/import-success.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
   :::row-end:::

    Select **Close**.

    The graph has now been uploaded to Azure Digital Twins Explorer, and the **Twin Graph** panel will reload. It will appear empty.
 
6. To see the graph, select the **Run Query** button in the **Query Explorer** panel, near the top of the Azure Digital Twins Explorer window.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/run-query.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the 'Run Query' button in the upper-right corner of the window." lightbox="media/quickstart-azure-digital-twins-explorer/run-query.png":::

This action runs the default query to select and display all digital twins. Azure Digital Twins Explorer retrieves all twins and relationships from the service. It draws the graph defined by them in the **Twin Graph** panel.

## Explore the graph

Now you can see the uploaded graph of the sample scenario.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-view-full.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the Graph View panel with a twin graph inside.'":::

The circles (graph "nodes") represent digital twins. The lines represent relationships. The Floor0 twin contains Room0, and the Floor1 twin contains Room1.

If you're using a mouse, you can click and drag in the graph to move elements around.

### View twin properties

You can select a twin to see a list of its properties and their values in the **Twin Properties** panel.

Here are the properties of Room0:

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/properties-room0.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Twin Properties panel, which shows $dtId, Temperature, and Humidity properties for Room0." lightbox="media/quickstart-azure-digital-twins-explorer/properties-room0.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Room0 has a temperature of 70.

Here are the properties of Room1:

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/properties-room1.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Twin Properties panel, which shows $dtId, Temperature, and Humidity properties for Room1." lightbox="media/quickstart-azure-digital-twins-explorer/properties-room1.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Room1 has a temperature of 80.

### Query the graph

In Azure Digital Twins, you can query your twin graph to answer questions about your environment, using the SQL-style *Azure Digital Twins query language*.

One way to query the twins in your graph is by their properties. Querying based on properties can help answer questions about your environment. For example, you can find outliers in your environment that might need attention.

In this section, you'll run a query to answer the question of how many twins in your environment have a temperature above 75.

To see the answer, run the following query in the **Query Explorer** panel.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="TemperatureQuery":::

Recall from viewing the twin properties earlier that Room0 has a temperature of 70, and Room1 has a temperature of 80. The Floor twins don't have a Temperature property at all. For these reasons, only Room1 shows up in the results here.
    
:::image type="content" source="media/quickstart-azure-digital-twins-explorer/result-query-property-before.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the results of property query, which shows only Room1." lightbox="media/quickstart-azure-digital-twins-explorer/result-query-property-before.png":::

>[!TIP]
> Other comparison operators (<,>, =, or !=) are also supported within the preceding query. You can try plugging these operators, different values, or different twin properties into the query to try out answering your own questions.

## Edit data in the graph

In a fully connected Azure Digital Twins solution, the twins in your graph can receive live updates from real IoT devices and update their properties to stay synchronized with your real-world environment. You can also manually set the properties of the twins in your graph, using Azure Digital Twins Explorer or another development interface (like the APIs or Azure CLI).

For simplicity, you'll use Azure Digital Twins Explorer here to manually set the temperature of Room0 to 76.

First, rerun the following query to select all digital twins. This will display the full graph once more in the **Twin Graph** panel.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="GetAllTwins":::

Select **Room0** to bring up its property list in the **Twin Properties** panel.

The properties in this list are editable. Select the temperature value of **70** to enable entering a new value. Enter *76* and select the **Save** icon to update the temperature.

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/new-properties-room0.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting that the Twin Properties panel is showing properties that can be edited for Room0." lightbox="media/quickstart-azure-digital-twins-explorer/new-properties-room0.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

After a successful property update, you'll see a **Patch Information** box showing the patch code that was used behind the scenes with the [Azure Digital Twins APIs](concepts-apis-sdks.md) to make the update.

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/patch-information.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing Patch Information for the temperature update." lightbox="media/quickstart-azure-digital-twins-explorer/patch-information.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

**Close** the patch information. 

### Query to see the result

To verify that the graph successfully registered your update to the temperature for Room0, rerun the query from earlier to get all the twins in the environment with a temperature above 75.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="TemperatureQuery":::

Now that the temperature of Room0 has been changed from 70 to 76, both twins should show up in the result.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/result-query-property-after.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the results of property query, which shows both Room0 and Room1." lightbox="media/quickstart-azure-digital-twins-explorer/result-query-property-after.png":::

## Review and contextualize learnings

In this quickstart, you created an Azure Digital Twins instance and used Azure Digital Twins Explorer to populate it with a sample scenario.

You then explored the graph, by:

* Using a query to answer a question about the scenario.
* Editing a property on a digital twin.
* Running the query again to see how the answer changed as a result of your update.

The intent of this exercise is to demonstrate how you can use the Azure Digital Twins graph to answer questions about your environment, even as the environment continues to change.

In this quickstart, you made the temperature update manually. It's common in Azure Digital Twins to connect digital twins to real IoT devices so that they receive updates automatically, based on telemetry data. In this way, you can build a live graph that always reflects the real state of your environment. You can use queries to get information about what's happening in your environment in real time.

## Clean up resources

To clean up after this quickstart, choose which Azure Digital Twins resources you want to remove, based on what you want to do next.

* If you plan to continue through the Azure Digital Twins quickstarts and tutorials, you can reuse the instance in this quickstart for those articles, and you don't need to remove it.

[!INCLUDE [digital-twins-cleanup-clear-instance.md](../../includes/digital-twins-cleanup-clear-instance.md)]
 
* If you don't need your Azure Digital Twins instance anymore, you can delete it using the [Azure portal](https://portal.azure.com).
    
    Navigate back to the instance's **Overview** page in the portal. (If you've already closed that tab, you can find the instance again by searching for its name in the Azure portal search bar and selecting it from the search results.)

    Select **Delete** to delete the instance, including all of its models and twins.

    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/delete-instance.png" alt-text="Screenshot of the Overview page for an Azure Digital Twins instance in the Azure portal. The Delete button is highlighted.":::

You may also want to delete the sample project folder from your local machine.

## Next steps

Move on to the next quickstart to visualize an Azure Digital Twins scenario in a 3D environment.

> [!div class="nextstepaction"]
> [Get started with 3D Scenes Studio](quickstart-3d-scenes-studio.md)