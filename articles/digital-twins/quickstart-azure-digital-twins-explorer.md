---
# Mandatory fields.
title: Quickstart - Get started with Azure Digital Twins Explorer
titleSuffix: Azure Digital Twins
description: Quickstart - Use the Azure Digital Twins Explorer sample to visualize and explore a prebuilt scenario.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/27/2021
ms.topic: quickstart
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Quickstart - Get started with a sample scenario in Azure Digital Twins Explorer

With Azure Digital Twins, you can create and interact with live models of your real-world environments. First, you model individual elements as **digital twins**. Then you connect them into a knowledge **graph** that can respond to live events and be queried for information.

In this quickstart, you'll explore a prebuilt Azure Digital Twins graph using the [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md). This is a tool that allows you to visualize and interact with your Azure Digital Twins data within the Azure portal.

You'll complete the following steps:

1. Create an Azure Digital Twins instance, and connect to it in Azure Digital Twins Explorer.
1. Upload prebuilt models and graph data to construct the sample scenario.
1. Explore the scenario graph that's created.
1. Make changes to the graph.
1. Review your learnings from the experience.

The sample graph you'll be working with represents a building with two floors and two rooms. Floor0 contains Room0, and Floor1 contains Room1. The graph will look like this image:

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-view-full.png" alt-text="Screenshot of a graph made of four circular nodes connected by arrows in Azure Digital Twins Explorer.":::

## Prerequisites

You'll need an Azure subscription to complete this quickstart. If you don't have one already, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

You'll also need to download the materials for the sample graph used in the quickstart. Use the links and instructions below to download the three required files from the [digital-twins-explorer GitHub repository](https://github.com/Azure-Samples/digital-twins-explorer).
* [Room.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/client/examples/Room.json): Navigate to the link, right-click anywhere on the screen, and select **Save as** in your browser's right-click menu. Use the following Save As window to save the file somewhere on your machine with the name **Room.json**.
* [Floor.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/client/examples/Floor.json): Navigate to the link, right-click anywhere on the screen, and select **Save as** in your browser's right-click menu. Use the following Save As window to save the file to the same location as **Room.json**, under the name **Floor.json**.
* [buildingScenario.xlsx](https://github.com/Azure-Samples/digital-twins-explorer/blob/main/client/examples/buildingScenario.xlsx): Navigate to the link and select the **Download** button. This will download the file to your default download location.

    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/download-building-scenario.png" alt-text="Screenshot of the digital-twins-explorer/client/examples/buildingScenario.xlsx file in GitHub. The Download button is highlighted." lightbox="media/quickstart-azure-digital-twins-explorer/download-building-scenario.png":::

## Set up Azure Digital Twins

The first step in working with Azure Digital Twins is to create an Azure Digital Twins instance. After you create an instance of the service, you can connect to the instance in Azure Digital Twins Explorer, which you'll use to work with the instance throughout the quickstart.

The rest of this section walks you through these steps.

### Create an Azure Digital Twins instance

[!INCLUDE [digital-twins-setup-portal.md](../../includes/digital-twins-setup-portal.md)]

3. Fill in the fields on the **Basics** tab of setup, including your Subscription, Resource group, Location, and a Resource name for your new instance. Check the **Assign Azure Digital Twins Data Owner Role** box to give yourself permissions to manage data in the instance.

    >[!NOTE]
    > If the Assign Azure Digital Twins Data Owner Role box is greyed out, it means you don't have permissions in your Azure subscription to manage user access to resources. You can continue creating the instance in this section, and then should have someone with the necessary permissions [assign you this role on the instance](how-to-set-up-instance-portal.md#assign-the-role-using-azure-identity-management-iam) before completing the rest of this quickstart.
    >
    > Common roles that meet this requirement are **Owner**, **Account admin**, or the combination of **User Access Administrator** and **Contributor**.  

4. Select **Review + Create** to finish creating your instance.

    :::image type="content" source= "media/quickstart-azure-digital-twins-explorer/create-azure-digital-twins-basics.png" alt-text="Screenshot of the Create Resource process for Azure Digital Twins in the Azure portal. The described values are filled in.":::
    
5. You will see a summary page showing the details you've entered. Confirm and create the instance by selecting **Create**.

This will take you to an Overview page tracking deployment status of the instance.

### Open instance in Azure Digital Twins Explorer

When the instance is finished deploying, use the **Go to resource** button to navigate to the instance's Overview page in the portal.

:::image type="content" source= "media/quickstart-azure-digital-twins-explorer/deployment-complete.png" alt-text="Screenshot of the deployment page for Azure Digital Twins in the Azure portal. The page indicates that deployment is complete.":::

Next, select the **Open Azure Digital Twins Explorer (preview)** button.

:::image type="content" source="media/includes/azure-digital-twins-explorer-portal-access.png" alt-text="Screenshot of the Azure portal showing the Overview page for an Azure Digital Twins instance. There's a highlight around the Open Azure Digital Twins Explorer (preview) button." lightbox="media/includes/azure-digital-twins-explorer-portal-access.png":::

This will open an Azure Digital Twins Explorer window connected to your instance.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/explorer-blank.png" alt-text="Screenshot of Azure Digital Twins Explorer in an internet browser." lightbox="media/quickstart-azure-digital-twins-explorer/explorer-blank.png":::

## Add the sample data

Next, you'll import the sample scenario and graph into Azure Digital Twins Explorer. The sample scenario is located in the **digital-twins-explorer-main** folder you downloaded in the [Prerequisites](#prerequisites) section.

### Models

The first step in an Azure Digital Twins solution is to define the vocabulary for your environment. You'll create custom [models](concepts-models.md) that describe the types of entity that exist in your environment.

Each model is written in a language like JSON-LD called Digital Twin Definition Language (DTDL). Each model describes a single type of entity in terms of its **properties**, **telemetry**, **relationships**, and **components**. Later, you'll use these models as the basis for digital twins that represent specific instances of these types.

Typically, when you create a model, you'll complete three steps:

1. Write the model definition. In the quickstart, this step is already done as part of the sample solution.
1. Validate it to make sure the syntax is accurate. In the quickstart, this step is already done as part of the sample solution.
1. Upload it to your Azure Digital Twins instance.
 
For this quickstart, the model files are already written and validated for you. They're included with the solution you downloaded. In this section, you'll upload two prewritten models to your instance to define these components of a building environment:

* Floor
* Room

#### Upload models

Follow these steps to upload models.

1. In the **Models** panel, select the **Upload a Model** icon that shows an arrow pointing into a cloud.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/upload-model.png" alt-text="Screenshot of the Azure Digital Twins Explorer, highlighting the Models panel and the 'Upload a Model' icon in it." lightbox="media/quickstart-azure-digital-twins-explorer/upload-model.png":::
 
1. In the Open window that appears, navigate to the folder containing the **Room.json** and **Floor.json** files that you downloaded earlier.
1. Select **Room.json** and **Floor.json**, and select **Open** to upload them both. 

Azure Digital Twins Explorer will upload these model files to your Azure Digital Twins instance. They should show up in the **Models** panel and display their friendly names and full model IDs. You can select the **View Model** information icons to see the DTDL code behind them.

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

Now that some models have been uploaded to your Azure Digital Twins instance, you can add [digital twins](concepts-twins-graph.md) that follow the model definitions.

Digital twins represent the actual entities within your business environment. They can be things like sensors on a farm, lights in a car, or—in this quickstart—rooms on a building floor. You can create many twins of any given model type, such as multiple rooms that all use the Room model. You connect them with relationships into a **twin graph** that represents the full environment.

In this section, you'll upload pre-created twins that are connected into a pre-created graph. The graph contains two floors and two rooms, connected in the following layout:

* Floor0
    - Contains Room0
* Floor1
    - Contains Room1

#### Import the graph

Follow these steps to import the graph.

1. In the **Twin Graph** panel, select the **Import Graph** icon that shows an arrow pointing into a cloud.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/import-graph.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the Graph View panel, with the 'Import Graph' icon highlighted." lightbox="media/quickstart-azure-digital-twins-explorer/import-graph.png":::

2. In the Open window, navigate to the **buildingScenario.xlsx** file you downloaded earlier. This file contains a description of the sample graph. Select **Open**.

   After a few seconds, Azure Digital Twins Explorer opens an **Import** view that shows a preview of the graph to be loaded.

3. To confirm the graph upload, select the **Save** icon in the upper-right corner of the graph preview panel.

   :::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-preview-save.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Save icon in the Graph Preview pane." lightbox="media/quickstart-azure-digital-twins-explorer/graph-preview-save.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
   :::row-end:::

4. Azure Digital Twins Explorer will use the uploaded file to create the requested twins and relationships between them. A dialog box appears when it's finished. Select **Close**.

   :::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/import-success.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing a dialog box indicating graph import success." lightbox="media/quickstart-azure-digital-twins-explorer/import-success.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
   :::row-end:::

5. The graph has now been uploaded to Azure Digital Twins Explorer. Switch back to the **Twin Graph** panel.
 
   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/twin-graph-tab.png" alt-text="Screenshot of the Azure Digital Twins Explorer with the Twin Graph tab highlighted." lightbox="media/quickstart-azure-digital-twins-explorer/twin-graph-tab.png"::: 
 
6. To see the graph, select the **Run Query** button in the **Query Explorer** panel, near the top of the Azure Digital Twins Explorer window.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/run-query.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the 'Run Query' button in the upper-right corner of the window." lightbox="media/quickstart-azure-digital-twins-explorer/run-query.png":::

This action runs the default query to select and display all digital twins. Azure Digital Twins Explorer retrieves all twins and relationships from the service. It draws the graph defined by them in the **Twin Graph** panel.

## Explore the graph

Now you can see the uploaded graph of the sample scenario.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-view-full.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the Graph View panel with a twin graph inside.'":::

The circles (graph "nodes") represent digital twins. The lines represent relationships. The Floor0 twin contains Room0, and the Floor1 twin contains Room1.

If you're using a mouse, you can drag pieces of the graph to move them around.

### View twin properties

You can select a twin to see a list of its properties and their values in the **Properties** panel.

Here are the properties of Room0:

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/properties-room0.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Properties panel, which shows $dtId, Temperature, and Humidity properties for Room0." lightbox="media/quickstart-azure-digital-twins-explorer/properties-room0.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Room0 has a temperature of 70.

Here are the properties of Room1:

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/properties-room1.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Properties panel, which shows $dtId, Temperature, and Humidity properties for Room1." lightbox="media/quickstart-azure-digital-twins-explorer/properties-room1.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Room1 has a temperature of 80.

### Query the graph

A main feature of Azure Digital Twins is the ability to [query](concepts-query-language.md) your twin graph easily and efficiently to answer questions about your environment.

One way to query the twins in your graph is by their **properties**. Querying based on properties can help answer a variety of questions. For example, you can find outliers in your environment that might need attention.

In this section, you'll run a query to answer the question of how many twins in your environment have a temperature above 75.

To see the answer, run the following query in the **Query Explorer** panel.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="TemperatureQuery":::

Recall from viewing the twin properties earlier that Room0 has a temperature of 70, and Room1 has a temperature of 80. For this reason, only Room1 shows up in the results here.
    
:::image type="content" source="media/quickstart-azure-digital-twins-explorer/result-query-property-before.png" alt-text="Screenshot of the Azure Digital Twins Explorer showing the results of property query, which shows only Room1." lightbox="media/quickstart-azure-digital-twins-explorer/result-query-property-before.png":::

>[!TIP]
> Other comparison operators (<,>, =, or !=) are also supported within the preceding query. You can try plugging these operators, different values, or different twin properties into the query to try out answering your own questions.

## Edit data in the graph

You can use Azure Digital Twins Explorer to edit the properties of the twins represented in your graph. In this section, we'll raise the temperature of Room0 to 76.

To start, rerun the following query to select all digital twins. This will display the full graph once more in the **Twin Graph** panel.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="GetAllTwins":::

Select **Room0** to bring up its property list in the **Properties** panel.

The properties in this list are editable. Select the temperature value of **70** to enable entering a new value. Enter **76**, and select the **Save** icon to update the temperature to **76**.

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/new-properties-room0.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting that the Properties panel is showing properties that can be edited for Room0." lightbox="media/quickstart-azure-digital-twins-explorer/new-properties-room0.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Now, you'll see a **Patch Information** window where the patch code appears that was used behind the scenes with the Azure Digital Twins [APIs](concepts-apis-sdks.md) to make the update. Select **Close**.

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

To clean up after this quickstart, choose which resources you want to remove based on what you want to do next.

* **If you plan to continue to the Azure Digital Twins tutorials**, you can reuse the instance in this quickstart for those articles, and you don't need to remove it.

[!INCLUDE [digital-twins-cleanup-clear-instance.md](../../includes/digital-twins-cleanup-clear-instance.md)]
 
[!INCLUDE [digital-twins-cleanup-basic.md](../../includes/digital-twins-cleanup-basic.md)]

You may also want to delete the sample project folder from your local machine.

## Next steps

Next, continue on to the Azure Digital Twins tutorials to build out your own Azure Digital Twins scenario and interaction tools.

> [!div class="nextstepaction"]
> [Code a client app](tutorial-code.md)
