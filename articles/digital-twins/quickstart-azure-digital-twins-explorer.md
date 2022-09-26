---
title: Quickstart - Get started with Azure Digital Twins Explorer
titleSuffix: Azure Digital Twins
description: Learn how to use Azure Digital Twins Explorer by following this demo, where you'll use models to instantiate twins and interact with the twin graph.
author: baanders
ms.author: baanders
ms.date: 07/21/2022
ms.topic: quickstart
ms.service: digital-twins
ms.custom: mode-other, event-tier1-build-2022
---

# Quickstart - Get started with a sample scenario in Azure Digital Twins Explorer

This quickstart is an introduction to Azure Digital Twins, showing how Azure Digital Twins represents data and demonstrating what it's like to interact with a digital twin graph of a physical building. You'll use the [Azure portal site](https://portal.azure.com) and the [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md), which is a tool for visualizing and interacting with Azure Digital Twins data in a web browser.

In this quickstart, you'll look at pre-built sample **models** that digitally define the concepts of a *Building*, a *Floor*, and a *Room*, and use these model definitions to create **digital twins** that represent specific floors and rooms from a physical building. These individual twins will be connected into a virtual **twin graph** that reflects their relationships to each other, forming a complete digital representation of the sample building. The graph you'll be working with represents a building that contains two floors, and each floor contains rooms. The graph will look like this image:

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-view-2.png" alt-text="Screenshot of a graph made of four circular nodes connected by arrows in Azure Digital Twins Explorer.":::

Here are the steps you'll use to explore the graph in this article:

1. Create an Azure Digital Twins instance, and open it in Azure Digital Twins Explorer.
1. Upload pre-built models and graph data to construct the sample scenario. Add one more twin manually.
1. Simulate changing IoT data, and query the graph to see results.
1. Review your learnings from the experience.

>[!NOTE]
>For simplicity, this quickstart does not cover setting up a live data flow from IoT devices inside the modeled environment, or from other data sources. To set up a simulated end-to-end data flow that drives your twin graph, move ahead to the tutorials: [Connect an end-to-end solution](tutorial-end-to-end.md). For more information on data flow between services and integrating Azure Digital Twins into a wider IoT solution, see [Data ingress and egress](concepts-data-ingress-egress.md).

## Prerequisites

You'll need an Azure subscription to complete this quickstart. If you don't have one already, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

You'll also need to download the materials for the sample graph used in the quickstart. Use the instructions below to download the required files. Later, you'll follow more instructions to upload them to Azure Digital Twins.
* Model files. Navigate to each link below, right-click anywhere on the screen, and select **Save as** in your browser's right-click menu. Use the Save As window to save the file somewhere on your machine.
    - [Building.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/client/examples/Building.json): This is a model file that digitally defines a building. It specifies that buildings can contain floors.
    - [Floor.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/client/examples/Floor.json): This is a model file that digitally defines a floor. It specifies that floors can contain rooms.
    - [Room.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/client/examples/Room.json): This is a model file that digitally defines a room. It has a temperature property.
* [buildingScenario.xlsx](https://github.com/Azure-Samples/digital-twins-explorer/raw/main/client/examples/buildingScenario.xlsx): This spreadsheet contains the data for a sample twin graph, including five digital twins representing a specific building with floors and rooms. The twins are based off the generic models, and connected with relationships indicating which elements contain each other. Depending on your browser settings, selecting this link may download the *buildingScenario.xlsx* file automatically to your default download location, or it may open the file in your browser with an option to download. Here is what that download option looks like in Microsoft Edge:

    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/download-building-scenario.png" alt-text="Screenshot of the buildingScenario.xlsx file viewed in a Microsoft Edge browser. A button saying Download is highlighted." lightbox="media/quickstart-azure-digital-twins-explorer/download-building-scenario.png":::

>[!TIP]
> These files are from the [Azure Digital Twins Explorer repository in GitHub](https://github.com/Azure-Samples/digital-twins-explorer). You can visit the repo for other sample files, explorer code, and more.

## Set up Azure Digital Twins

The first step in working with Azure Digital Twins is to create an Azure Digital Twins instance that will hold all your graph data. In this section, you'll create an instance of the service, and open it in Azure Digital Twins Explorer.

[!INCLUDE [digital-twins-quickstart-setup.md](../../includes/digital-twins-quickstart-setup.md)]

### Open instance in Azure Digital Twins Explorer

After deployment completes, use the **Go to resource** button to navigate to the instance's Overview page in the portal.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/deployment-complete.png" alt-text="Screenshot of the deployment page for Azure Digital Twins in the Azure portal. The page indicates that deployment is complete.":::

[!INCLUDE [digital-twins-access-explorer.md](../../includes/digital-twins-access-explorer.md)]

## Build out the sample scenario

Next, you'll use Azure Digital Twins Explorer to set up the sample models and twin graph. You'll start by importing the model files and the twin graph file that you downloaded to your machine in the [Prerequisites](#prerequisites) section. Then, you'll finish the scenario by creating one more twin manually.

### Models

The first step in creating an Azure Digital Twins graph is to define the vocabulary for your environment. *Models* are generic definitions for each type of entity that exists in your environment. This sample building scenario contains a building, floors, and rooms, so you'll need one model definition describing what a *Building* is, one model definition describing what a *Floor* is, and one model definition describing what a *Room* is. Later, you can create *digital twins* that are instances of these models, representing specific buildings, floors, and rooms. 

Models for Azure Digital Twins are written in *Digital Twin Definition Language (DTDL)*, a data object language similar to [JSON-LD](https://json-ld.org/). Each model describes a single type of entity in terms of its properties, telemetry, relationships, and components.
 
For this quickstart, the model files have already been written for you. You downloaded *Building.json*, *Floor.json*, and *Room.json* in the [Prerequisites](#prerequisites) section, and now you'll upload them to your Azure Digital Twins instance using Azure Digital Twins Explorer.

#### Upload the models (.json files)

In Azure Digital Twins Explorer, follow these steps to upload the *Building*, *Floor*, and *Room* models (the *.json* files you downloaded earlier).

1. In the **Models** panel, select the **Upload a Model** icon that shows an arrow pointing upwards.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/upload-model.png" alt-text="Screenshot of the Azure Digital Twins Explorer, highlighting the Models panel and the 'Upload a Model' icon in it." lightbox="media/quickstart-azure-digital-twins-explorer/upload-model.png":::
 
1. In the Open window that appears, navigate to the folder containing the downloaded *.json* files on your machine.
1. Select *Building.json*, *Floor.json*, and *Room.json*, and select **Open** to upload them all at once. 

Azure Digital Twins Explorer will upload these model files to your Azure Digital Twins instance. They should show up in the **Models** panel and display their friendly names and full model IDs. 

You can select **View Model** from any of the models' options to see the DTDL code that defines each model type.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/model-info.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the Models panel with three model definitions listed inside: Building, Floor, and Room." lightbox="media/quickstart-azure-digital-twins-explorer/model-info.png":::

### Twins and the twin graph

Now that some model definitions have been uploaded to your Azure Digital Twins instance, you can use these definitions to create *digital twins* for the elements in your environment.

Every digital twin in your solution represents an entity from the physical environment. You can create many twins based on the same model type, like multiple room twins that all use the *Room* model. In this quickstart, you'll need a digital twin for the building, and a digital twin for each floor and room in the building. The twins will be connected with relationships into a *twin graph* that represents the full building environment.

In this section, you'll upload a pre-created graph containing a building twin, two floor twins, and two room twins.

#### Import the graph (.xlsx file)

In Azure Digital Twins Explorer, follow these steps to import the sample graph (the *.xlsx* file you downloaded earlier).

1. In the **Twin Graph** panel, select the **Import Graph** icon that shows an arrow pointing into a cloud.

   :::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-import.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The Import Graph button is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-import.png":::

2. In the Open window, navigate to the *buildingScenario.xlsx* file you downloaded earlier. This file contains twin and relationship data for the sample graph. Select **Open**.

   After a few seconds, Azure Digital Twins Explorer opens an **Import** view that shows a preview of the graph to be loaded.

3. To finish importing the graph, select the **Save** icon in the upper-right corner of the graph preview panel.

    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-preview-save.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Save icon in the Graph Preview pane." lightbox="media/quickstart-azure-digital-twins-explorer/graph-preview-save.png":::

4. Azure Digital Twins Explorer will use the uploaded file to create the requested twins and relationships between them. Make sure you see the following dialog box indicating that the import was successful before moving on.

    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/import-success.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing a dialog box indicating graph import success." lightbox="media/quickstart-azure-digital-twins-explorer/import-success.png":::

    Select **Close**.

    The graph has now been uploaded to Azure Digital Twins Explorer, and the **Twin Graph** panel will reload. It will appear empty.
 
6. To see the graph, select the **Run Query** button in the **Query Explorer** panel, near the top of the Azure Digital Twins Explorer window.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/run-query.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the 'Run Query' button in the upper-right corner of the window." lightbox="media/quickstart-azure-digital-twins-explorer/run-query.png":::

This action runs the default query to select and display all digital twins. Azure Digital Twins Explorer retrieves all twins and relationships from the service. It draws the graph defined by them in the **Twin Graph** panel. Now you can see the uploaded graph of the sample scenario.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-view-1.png" alt-text="Screenshot of Azure Digital Twins Explorer showing the uploaded graph.'":::

The circles (graph "nodes") represent digital twins. The lines represent relationships. The BuildingA twin "contains" the Floor0 and Floor1 twins, the Floor0 twin "contains" Room0, and the Floor1 twin "contains" Room1. If you're using a mouse, you can click and drag in the graph to move around elements.

#### Add another twin

You can continue to edit the structure of a digital twin graph after it's been created. Imagine that another room has recently been constructed on Floor1 of this example building. In this section, you'll add a new twin to the graph, to represent the new room.

Start by selecting the model that defines the type of twin you want to create. In the **Models** panel on the left, open the options menu for the **Room** model. Select **Create a Twin** to create a new instance of this model type.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/create-twin.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the Models panel, and the option to Create a Twin from the Room model." lightbox="media/quickstart-azure-digital-twins-explorer/create-twin.png":::

Enter *Room2* for the **New Twin name** and select **Save**. This will create a new digital twin, which is not yet connected by relationships to the rest of the graph.

Next, you'll add a relationship to show that Floor1 contains Room2. Use the CTRL/CMD or SHIFT keys to simultaneously select Floor1 and Room2 in the graph. When both twins are selected, right-click Room2 and choose **Add relationships**.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/add-relationships.png" alt-text="Screenshot of the Azure Digital Twins Explorer, adding a relationship between Floor1 and Room2." lightbox="media/quickstart-azure-digital-twins-explorer/add-relationships.png":::

This will open a **Create Relationship** dialog that's pre-filled with the details of a "contains" relationship from Floor1 to Room2. Select **Save**.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/create-relationship-save.png" alt-text="Screenshot of the Create Relationship options." lightbox="media/quickstart-azure-digital-twins-explorer/create-relationship-save.png":::

Now Room2 is connected in the graph. If you're using a mouse, you can click and drag twins in the graph to arrange them into a configuration that you like.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-view-2.png" alt-text="Screenshot of Azure Digital Twins Explorer showing the graph, which now includes Room2.'":::

### View twin properties

You can select a twin to see a list of its properties and their values in the **Twin Properties** panel.

Here are the properties of Room0. Notice that Room0 has a temperature of 70.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/properties-room0.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Twin Properties panel, which shows $dtId, Temperature, and Humidity properties for Room0." lightbox="media/quickstart-azure-digital-twins-explorer/properties-room0.png":::

Here are the properties of Room1. Notice that Room1 has a temperature of 80.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/properties-room1.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Twin Properties panel, which shows $dtId, Temperature, and Humidity properties for Room1." lightbox="media/quickstart-azure-digital-twins-explorer/properties-room1.png":::

Room2 doesn't have values set for its properties yet, since this twin was created manually. To set its property values, edit the fields so that humidity is 50 and temperature is 72. Select the **Save** icon. 

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/properties-room2.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Twin Properties panel, where Temperature and Humidity are being set for Room2." lightbox="media/quickstart-azure-digital-twins-explorer/properties-room2.png":::

## Query changing IoT data

In Azure Digital Twins, you can query your twin graph to answer questions about your environment, using the SQL-style *Azure Digital Twins query language*. One way to query the twins in your graph is by their properties. Querying based on properties can help answer questions about—or identify outliers in—your environment. In a fully connected, data-driven scenario, the properties of your twins will change frequently in response to IoT data from the sensors in your environment, or other connected data sources. In this quickstart, you'll change the values manually to simulate a changing sensor reading.

Start by running a query to see how many twins in your environment have a temperature above 75. Run the following query in the **Query Explorer** panel.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="TemperatureQuery":::

Recall from viewing the twin properties earlier that Room0 has a temperature reading of 70, Room1 has a temperature reading of 80, and Room2 has a temperature reading of 72. The building and floor twins don't have a temperature property at all. For these reasons, only Room1 shows up in the results here.
    
:::image type="content" source="media/quickstart-azure-digital-twins-explorer/result-query-property-before.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the results of property query, which shows only Room1." lightbox="media/quickstart-azure-digital-twins-explorer/result-query-property-before.png":::

>[!TIP]
> Other comparison operators (<,>, =, or !=) are also supported in queries. You can try plugging these operators, different values, or different twin properties into the query to try out answering your own questions.

### Edit temperature data

In a fully connected Azure Digital Twins solution, the twins in your graph receive live updates from real IoT devices and other data sources, and update their properties automatically to stay synchronized with your real-world environment. For simplicity in this quickstart, you'll use Azure Digital Twins Explorer here to manually set the temperature reading of Room0 to 76.

First, rerun the following query to select all digital twins. This will display the full graph again in the **Twin Graph** panel.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="GetAllTwins":::

Select **Room0** to bring up its property list in the **Twin Properties** panel.

Change the temperature value from **70** to *76*, and select the **Save** icon to update the temperature.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/new-properties-room0.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting that the Twin Properties panel is showing properties that can be edited for Room0." lightbox="media/quickstart-azure-digital-twins-explorer/new-properties-room0.png":::

After a successful property update, you'll see a **Patch Information** box showing the patch code that was used behind the scenes with the [Azure Digital Twins APIs](concepts-apis-sdks.md) to make the update.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/patch-information.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing Patch Information for the temperature update." lightbox="media/quickstart-azure-digital-twins-explorer/patch-information.png":::

**Close** the patch information. 

### Query to see the new result

To see the new temperature for Room0 reflected in the graph, rerun the query from earlier to get all the twins in the environment with a temperature above 75.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="TemperatureQuery":::

Now that the temperature of Room0 has been changed from 70 to 76, both Room0 and Room1 should show up in the result.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/result-query-property-after.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the results of property query, which shows both Room0 and Room1." lightbox="media/quickstart-azure-digital-twins-explorer/result-query-property-after.png":::

## Review and contextualize learnings

In this quickstart, you created an Azure Digital Twins instance and used Azure Digital Twins Explorer to populate it with a sample scenario. You also added a digital twin manually.

Then, you explored the graph, including...

* Using a query to answer a question about the scenario.
* Editing a property on a digital twin.
* Running the query again to see how the answer changed as a result of your update.

The intent of this exercise is to demonstrate how you can use the Azure Digital Twins graph to answer questions about your environment, especially as IoT environments continue to change.

In this quickstart, you made the temperature update manually. It's common in Azure Digital Twins to connect digital twins to real IoT devices so that they receive updates automatically, based on telemetry data. You can also [connect other data sources](concepts-data-ingress-egress.md#data-ingress), integrating data from different systems and defining your own logic for how twins are updated. In this way, you can build a live graph that always reflects the real state of your environment. You can use queries to get information about what's happening in your environment in real time.

You can also export Azure Digital Twins data to historical tracking, data analytics, and AI services to enable greater insights and perform environment simulations. Integrating Azure Digital Twins into your IoT solutions can help you more effectively track the past, control the present, and predict the future.

## Clean up resources

To clean up after this quickstart, choose which Azure Digital Twins resources you want to remove, based on what you want to do next.

* If you plan to continue through the Azure Digital Twins quickstarts and tutorials, you can reuse the instance in this quickstart for those articles, and you don't need to remove it.

[!INCLUDE [digital-twins-cleanup-clear-instance.md](../../includes/digital-twins-cleanup-clear-instance.md)]
 
* If you don't need your Azure Digital Twins instance anymore, you can delete it using the [Azure portal](https://portal.azure.com).
    
    Navigate back to the instance's **Overview** page in the portal. (If you've already closed that tab, you can find the instance again by searching for its name in the Azure portal search bar and selecting it from the search results.)

    Select **Delete** to delete the instance, including all of its models and twins.

    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/delete-instance.png" alt-text="Screenshot of the Overview page for an Azure Digital Twins instance in the Azure portal. The Delete button is highlighted.":::

You may also want to delete the sample project files from your local machine.

## Next steps

Move on to the next quickstart to visualize an Azure Digital Twins scenario in a 3D environment.

> [!div class="nextstepaction"]
> [Get started with 3D Scenes Studio](quickstart-3d-scenes-studio.md)

Or, skip ahead to the tutorials to dive deeper into the SDKs, twin graph creation, and event flow setup.
* [Code a client app](tutorial-code.md)
* [Create a graph in Azure Digital Twins](tutorial-command-line-app.md)
* [Connect an end-to-end solution](tutorial-end-to-end.md)
