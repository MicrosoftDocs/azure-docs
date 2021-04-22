---
# Mandatory fields.
title: Quickstart - Explore a sample scenario
titleSuffix: Azure Digital Twins
description: Quickstart - Use the Azure Digital Twins Explorer sample to visualize and explore a prebuilt scenario.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 9/24/2020
ms.topic: quickstart
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Quickstart - Explore a sample Azure Digital Twins scenario using Azure Digital Twins Explorer

With Azure Digital Twins, you can create and interact with live models of your real-world environments. First, you model individual elements as **digital twins**. Then you connect them into a knowledge **graph** that can respond to live events and be queried for information.

In this quickstart, you'll explore a prebuilt Azure Digital Twins graph, with the help of a sample application called [Azure Digital Twins Explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/). You use Azure Digital Twins Explorer to:

- Upload a digital representation of an environment.
- View visual images of the twins and graph that are created to represent the environment in Azure Digital Twins.
- Perform other management activities through a browser-based, visual experience.

The quickstart contains the following major steps:

1. Set up an Azure Digital Twins instance and Azure Digital Twins Explorer.
1. Upload prebuilt models and graph data to construct the sample scenario.
1. Explore the scenario graph that's created.
1. Make changes to the graph.

The sample graph you'll be working with represents a building with two floors and two rooms. The graph will look like this image:

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-view-full.png" alt-text="View of a graph made of four circular nodes connected by arrows. A circle labeled 'Floor1' is connected by an arrow labeled 'contains' to a circle labeled 'Room1'. A circle labeled 'Floor0' is connected by an arrow labeled 'contains' to a circle labeled 'Room0'. 'Floor1' and 'Floor0' aren't connected.":::

## Prerequisites

You'll need an Azure subscription to complete this quickstart. If you don't have one already, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

You'll also need **Node.js** on your machine. To get the latest version, see [Node.js](https://nodejs.org/).

Finally, you'll also need to download the sample to use during the quickstart. The sample application is **Azure Digital Twins Explorer**. This sample contains the app you use in the quickstart to load and explore an Azure Digital Twins scenario. It also contains the sample scenario files. To get the sample, go to [Azure Digital Twins Explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/). Select the **Browse code** button underneath the title, which will take you to the GitHub repo for the sample. Select the **Code** button and **Download ZIP** to download the sample as a *.ZIP* file. 

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/download-repo-zip.png" alt-text="Screenshot of the digital-twins-explorer repo on GitHub. The Code button is selected, producing a small dialog box where the Download ZIP button is highlighted." lightbox="media/quickstart-azure-digital-twins-explorer/download-repo-zip.png":::

Unzip the **digital-twins-explorer-main.zip** folder, and extract the files.

## Set up Azure Digital Twins and Azure Digital Twins Explorer

The first step in working with Azure Digital Twins is to set up an Azure Digital Twins instance. After you create an instance of the service and set up your credentials to authenticate with Azure Digital Twins Explorer, you can connect to the instance in Azure Digital Twins Explorer and populate it with the example data later in the quickstart.

The rest of this section walks you through these steps.

### Set up an Azure Digital Twins instance

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

### Set up local Azure credentials

The Azure Digital Twins Explorer application uses [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) (part of the `Azure.Identity` library) to authenticate users with the Azure Digital Twins instance when you run it on your local machine. For more information on different ways a client app can authenticate with Azure Digital Twins, see [Write app authentication code](how-to-authenticate-client.md).

With this type of authentication, Azure Digital Twins Explorer will search for credentials within your local environment, such as an Azure sign-in in a local [Azure CLI](/cli/azure/install-azure-cli) or in Visual Studio or Visual Studio Code. For this reason, you should **sign in to Azure locally** through one of these mechanisms to set up credentials for the Azure Digital Twins Explorer app.

If you're already signed in to Azure through one of these ways, you can skip to the [next section](#run-and-configure-azure-digital-twins-explorer).

Otherwise, you can install the local Azure CLI with these steps:

1. Follow the process at [this installation link](/cli/azure/install-azure-cli) to complete the installation that matches your OS.
1. Open a console window on your machine.
1. Run `az login`, and follow the authentication prompts to sign in to your Azure account.
1. Possible last step: If you use multiple Azure subscriptions under this account, set the authentication context to the Azure subscription that contains your Azure Digital Twins instance by running `az account set --subscription "<your-subscription-name-or-ID>"` (either the name or ID value of the subscription will work).

After you sign in, Azure Digital Twins Explorer should pick up your Azure credentials automatically when you run it in the next section.

You can close the authentication console window if you want. Or, you can keep it open to use in the next step.

### Run and configure Azure Digital Twins Explorer

Next, run the Azure Digital Twins Explorer application and configure it for your Azure Digital Twins instance.

1. Go to the downloaded and unzipped **digital-twins-explorer-main** folder.
Open a console window to the folder location **digital-twins-explorer-main/client/src**.

1. Run `npm install` to download all the required dependencies.

1. Start the app by running `npm run start`.

   After a few seconds, a browser window opens and the app appears in the browser.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/explorer-blank.png" alt-text="Browser window showing an app running at localhost:3000. The app is called Azure Digital Twins Explorer and contains panels for Query Explorer, Model View, Graph View, and Property Explorer. There's no onscreen data yet." lightbox="media/quickstart-azure-digital-twins-explorer/explorer-blank.png":::

1. Select the **Sign In** button in the upper-right corner of the window, as shown in the following image, to configure Azure Digital Twins Explorer to work with the instance you've set up.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/sign-in.png" alt-text="Azure Digital Twins Explorer highlighting the Sign In icon near the top of the window. The icon shows a simple silhouette of a person overlaid with a silhouette of a key." lightbox="media/quickstart-azure-digital-twins-explorer/sign-in.png":::

1. Enter the Azure Digital Twins instance URL that you gathered earlier in the [Set up an Azure Digital Twins instance](#set-up-an-azure-digital-twins-instance) section, in the format *https://<instance-host-name>*.

> [!TIP]
> If a `SignalRService.subscribe` error message appears when you connect, make sure that your Azure Digital Twins URL begins with *https://*.
>
> If an authentication error appears, you may want to check your **environment variables** to make sure any credentials included there are valid for Azure Digital Twins. The `DefaultAzureCredential` attempts to authenticate against credential types in a [specific order](/dotnet/api/overview/azure/identity-readme#defaultazurecredential), and environment variables are evaluated first.

If you see a **Permissions requested** pop-up window from Microsoft, grant consent for this application and accept to continue.

>[!NOTE]
> You can revisit or edit this information at any time by selecting the same icon to open the **Sign In** box again. It will keep the values that you passed in.

## Add the sample data

Next, you'll import the sample scenario and graph into Azure Digital Twins Explorer. The sample scenario is also located in the **digital-twins-explorer-main** folder you downloaded earlier.

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

1. In the **MODEL VIEW** panel, select the **Upload a Model** icon.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/upload-model.png" alt-text="In the Model View panel, the middle icon is highlighted. It shows an arrow pointing into a cloud." lightbox="media/quickstart-azure-digital-twins-explorer/upload-model.png":::
 
1. In the file selector window that appears, go to the **digital-twins-explorer-main/client/examples** folder in the downloaded repository.
1. Select **Room.json** and **Floor.json**, and select **OK**. You can upload additional models if you want, but they won't be used in this quickstart.
1. Follow the pop-up dialog box that asks you to sign in to your Azure account.

>[!NOTE]
>If you see the following error message:
> :::image type="content" source="media/quickstart-azure-digital-twins-explorer/error-models-popup.png" alt-text="A pop-up box reading 'Error: Error fetching models: ClientAuthError: Error opening popup window. This can happen if you are using IE or if popups are blocked in the browser.' with a Close button at the bottom." border="false"::: 
> Try disabling your pop-up blocker or using a different browser.

Azure Digital Twins Explorer now uploads these model files to your Azure Digital Twins instance. They should show up in the **MODEL VIEW** panel and display their friendly names and full model IDs. You can select the **View Model** information icons to see the DTDL code behind them.

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/model-info.png" alt-text="A view of the Model View panel with two model definitions listed inside, Floor (dtmi:example:Floor;1) and Room (dtmi:example:Room;1). The View Model information icon showing a letter 'i' in a circle is highlighted for each model." lightbox="media/quickstart-azure-digital-twins-explorer/model-info.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

### Twins and the twin graph

Now that some models have been uploaded to your Azure Digital Twins instance, you can add [digital twins](concepts-twins-graph.md) that follow the model definitions.

Digital twins represent the actual entities within your business environment. They can be things like sensors on a farm, lights in a car, or—in this quickstart—rooms on a building floor. You can create many twins of any given model type, such as multiple rooms that all use the *Room* model. You connect them with relationships into a **twin graph** that represents the full environment.

In this section, you'll upload precreated twins that are connected into a precreated graph. The graph contains two floors and two rooms, connected in the following layout:

* Floor0
    - Contains Room0
* Floor1
    - Contains Room1

#### Import the graph

Follow these steps to import the graph.

1. In the **GRAPH VIEW** panel, select the **Import Graph** icon.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/import-graph.png" alt-text="In the Graph View panel, an icon is highlighted. It shows an arrow pointing into a cloud." lightbox="media/quickstart-azure-digital-twins-explorer/import-graph.png":::

2. In the file selector window, go to the **digital-twins-explorer-main/client/examples** folder, and select the **buildingScenario.xlsx** spreadsheet file. This file contains a description of the sample graph. Select **OK**.

   After a few seconds, Azure Digital Twins Explorer opens an **Import** view that shows a preview of the graph to be loaded.

3. To confirm the graph upload, select the **Save** icon in the upper-right corner of the **GRAPH VIEW** panel.

   :::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-preview-save.png" alt-text="Highlighting the Save icon in the Graph Preview pane." lightbox="media/quickstart-azure-digital-twins-explorer/graph-preview-save.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
   :::row-end:::

4. Azure Digital Twins Explorer now uses the uploaded file to create the requested twins and relationships between them. A dialog box appears when it's finished. Select **Close**.

   :::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/import-success.png" alt-text="A dialog box indicating graph import success. It reads 'Import successful. 4 twins imported. 2 relationships imported.'" lightbox="media/quickstart-azure-digital-twins-explorer/import-success.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
    :::column:::
    :::column-end:::
   :::row-end:::

5. The graph has now been uploaded to Azure Digital Twins Explorer. To see the graph, select the **Run Query** button in the **GRAPH EXPLORER** panel, near the top of the Azure Digital Twins Explorer window.

   :::image type="content" source="media/quickstart-azure-digital-twins-explorer/run-query.png" alt-text="The Run Query button in the upper-right corner of the window is highlighted." lightbox="media/quickstart-azure-digital-twins-explorer/run-query.png":::

This action runs the default query to select and display all digital twins. Azure Digital Twins Explorer retrieves all twins and relationships from the service. It draws the graph defined by them in the **GRAPH VIEW** panel.

## Explore the graph

Now you can see the uploaded graph of the sample scenario.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/graph-view-full.png" alt-text="View of the Graph View panel with a twin graph inside. A circle labeled 'floor1' is connected by an arrow labeled 'contains' to a circle labeled 'room1.' A circle labeled 'floor0' is connected by an arrow labeled 'contains' to a circle labeled 'room0.'":::

The circles (graph "nodes") represent digital twins. The lines represent relationships. The **Floor0** twin contains **Room0**, and the **Floor1** twin contains **Room1**.

If you're using a mouse, you can drag pieces of the graph to move them around.

### View twin properties

You can select a twin to see a list of its properties and their values in the **PROPERTY EXPLORER** panel.

Here are the properties of Room0:

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/properties-room0.png" alt-text="Highlight around the Property Explorer panel showing properties for Room0, which include (among others) a $dtId field of Room0, a Temperature field of 70, and a Humidity field of 30." lightbox="media/quickstart-azure-digital-twins-explorer/properties-room0.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Room0 has a temperature of 70.

Here are the properties of Room1:

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/properties-room1.png" alt-text="Highlight around the Property Explorer panel showing properties for Room1, which include (among others) a $dtId field of Room1, a Temperature field of 80, and a Humidity field of 60." lightbox="media/quickstart-azure-digital-twins-explorer/properties-room1.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Room1 has a temperature of 80.

### Query the graph

A main feature of Azure Digital Twins is the ability to [query](concepts-query-language.md) your twin graph easily and efficiently to answer questions about your environment.

One way to query the twins in your graph is by their **properties**. Querying based on properties can help answer a variety of questions. For example, you can find outliers in your environment that might need attention.

In this section, you'll run a query to answer the question of how many twins in your environment have a temperature above 75.

To see the answer, run the following query in the **QUERY EXPLORER** panel.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="TemperatureQuery":::

Recall from viewing the twin properties earlier that Room0 has a temperature of 70, and Room1 has a temperature of 80. For this reason, only Room1 shows up in the results here.
    
:::image type="content" source="media/quickstart-azure-digital-twins-explorer/result-query-property-before.png" alt-text="Results of property query showing only Room1." lightbox="media/quickstart-azure-digital-twins-explorer/result-query-property-before.png":::

>[!TIP]
> Other comparison operators (<,>, =, or !=) are also supported within the preceding query. You can try plugging these operators, different values, or different twin properties into the query to try out answering your own questions.

## Edit data in the graph

You can use Azure Digital Twins Explorer to edit the properties of the twins represented in your graph. In this section, we'll raise the temperature of Room0 to 76.

To start, rerun the following query to select all digital twins. This will display the full graph once more in the **GRAPH VIEW** panel.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="GetAllTwins":::

Select **Room0** to bring up its property list in the **PROPERTY EXPLORER** panel.

The properties in this list are editable. Select the temperature value of **70** to enable entering a new value. Enter **76**, and select the **Save** icon to update the temperature to **76**.

:::row:::
    :::column:::
        :::image type="content" source="media/quickstart-azure-digital-twins-explorer/new-properties-room0.png" alt-text="The Property Explorer panel showing properties for Room0. The temperature value is an editable box showing 76, and there's a highlight around the Save icon." lightbox="media/quickstart-azure-digital-twins-explorer/new-properties-room0.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Now, you'll see a **Patch Information** window where the patch code appears that was used behind the scenes with the Azure Digital Twins [APIs](how-to-use-apis-sdks.md) to make the update. Select **Close**.

### Query to see the result

To verify that the graph successfully registered your update to the temperature for Room0, rerun the query from earlier to get all the twins in the environment with a temperature above 75.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="TemperatureQuery":::

Now that the temperature of Room0 has been changed from 70 to 76, both twins should show up in the result.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/result-query-property-after.png" alt-text="Results of property query showing both Room0 and Room1." lightbox="media/quickstart-azure-digital-twins-explorer/result-query-property-after.png":::

## Review and contextualize learnings

In this quickstart, you created an Azure Digital Twins instance, connected it to Azure Digital Twins Explorer, and populated it with a sample scenario.

You then explored the graph, by:

* Using a query to answer a question about the scenario.
* Editing a property on a digital twin.
* Running the query again to see how the answer changed as a result of your update.

The intent of this exercise is to demonstrate how you can use the Azure Digital Twins graph to answer questions about your environment, even as the environment continues to change.

In this quickstart, you made the temperature update manually. It's common in Azure Digital Twins to connect digital twins to real IoT devices so that they receive updates automatically, based on telemetry data. In this way, you can build a live graph that always reflects the real state of your environment. You can use queries to get information about what's happening in your environment in real time.

## Clean up resources

To wrap up the work for this quickstart, first end the running console app. This action shuts off the connection to the Azure Digital Twins Explorer app in the browser. You'll no longer be able to view live data in the browser. You can close the browser tab.

Then, you can choose which resources you'd like to remove, depending on what you'd like to do next.

* **If you plan to continue to the Azure Digital Twins tutorials**, you can reuse the instance in this quickstart for those articles, and you don't need to remove it.

[!INCLUDE [digital-twins-cleanup-clear-instance.md](../../includes/digital-twins-cleanup-clear-instance.md)]
 
[!INCLUDE [digital-twins-cleanup-basic.md](../../includes/digital-twins-cleanup-basic.md)]

You may also want to delete the project folder from your local machine.

## Next steps

Next, continue on to the Azure Digital Twins tutorials to build out your own Azure Digital Twins scenario and interaction tools.

> [!div class="nextstepaction"]
> [Tutorial: Code a client app](tutorial-code.md)
