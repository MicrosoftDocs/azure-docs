---
# Mandatory fields.
title: Get started with Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Set up and explore a starter Azure Digital Twins project.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/15/2020
ms.topic: quickstart
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Get started with Azure Digital Twins

In this quickstart, you'll set up an Azure Digital Twins instance and use a pre-written sample solution to explore the fundamental components of an Azure Digital Twins solution. 

Here are the steps included:
1. Set up an Azure Digital Twins instance
2. Configure a sample client application to interact with the instance
3. Build out a sample solution, including models, digital twins, and relationships
4. Query the sample solution to see how Azure Digital Twins can help you answer questions about your environment

The quickstart is driven by a sample project written in C#. Get the sample project on your machine by [downloading the Azure Digital Twins samples repository as a ZIP file](https://github.com/Azure-Samples/digital-twins-samples/archive/master.zip).

[!INCLUDE [instructions on using the Azure Cloud Shell](../../includes/cloud-shell-try-it.md)]

> [!NOTE]
> The PowerShell version of Azure Cloud Shell is recommended for its parsing of quotations. The other bash version will work for most commands, but may fail on commands with *single-quote* and/or *double-quote* characters.

[!INCLUDE [Azure Digital Twins setup steps: instance creation and authentication](../../includes/digital-twins-setup-1.md)]

#### Register your application

[!INCLUDE [Azure Digital Twins setup steps: client app registration](../../includes/digital-twins-setup-2.md)]

[!INCLUDE [Azure Digital Twins setup steps: client app configuration](../../includes/digital-twins-setup-3.md)]

## Build out a sample solution

In the remainder of this quickstart, you will use the sample project and some pre-written example code to build out a basic Azure Digital Twins solution. The major solution components are models, digital twins, and relationships, resulting in a queryable twin graph of an environment.

### Model a physical environment with DTDL

The first step in building out an Azure Digital Twins solution is concepting and defining twin [**models**](concepts-models.md) for your environment. 

Models are similar to classes in object-oriented programming languages; they provide user-defined templates for digital twins to follow and instantiate later. They are written in a JSON-like language called **Digital Twins Definition Language (DTDL)**, and can define a twin's *properties*, *telemetry*, *commands*, *relationships*, and *components*.

In the sample project folder, navigate to the *DigitalTwinsMetadata/DigitalTwinsSample/Models* folder. This folder contains sample models.

Open *Room.json*, and change it in the following ways:

* **Update the version number**, to indicate that you are providing a more-updated version of this model. Do this by changing the *1* at the end of the `@id` value to a *2*. Any number greater than the current version number will also work.
* **Edit a property**. Change the name of the `Humidity` property to *HumidityLevel* (or something different if you'd like. If you use something different than *HumidityLevel*, remember what you used and continue using that instead of *HumidityLevel* throughout this quickstart).
* **Add a property**. After the `HumidityLevel` property that ends on line 15, paste the following code to add a `DisplayName` property to the room:

    ```json
    ,
    {
      "@type": "Property",
      "name": "DisplayName",
      "schema": "string"
    }
    ```
* **Add a relationship**. After the `DisplayName` property that ends on line 20, paste the following code to add the ability for this type of twin to form *contains* relationships with other twins:

    ```json
    ,
    {
      "@type": "Relationship",
      "@id": "urn:contosocom:DigitalTwins:contains:1",
      "name": "contains",
      "target": "*"
    }
    ```

When you are finished, the updated model should look like this:

:::image type="content" source="media/quickstart/room-model.png" alt-text="Edited Room.json with updated version number, HumidityLevel and DisplayName properties, and contains relationship" border="false":::

Make sure to save the file before moving on.

> [!TIP]
> If you want to try creating your own model, you can paste the Room model into a new file that you save with a *.json* extension in the *DigitalTwinsMetadata/DigitalTwinsSample/Models* folder. Then play around with adding properties and relationships to represent whatever you would like. You can also look at the other sample models in this folder for ideas.

#### Upload models to Azure Digital Twins

Once you have designed your model(s), you need to upload them to your Azure Digital Twins instance before you can create twins that use them.

Open _DigitalTwinsMetadata/**DigitalTwinsSample.sln**_ in Visual Studio. Run the project with this button in the toolbar:

:::image type="content" source="media/quickstart/start-button-sample.png" alt-text="The Visual Studio start button (DigitalTwinsSample project":::
 
A console window will open, carry out authentication, and wait for a command. In this console, run the following command to upload both your edited model for *Room* and another model, *Floor*.

```cmd
addModels Room Floor
```

> [!TIP]
> If you designed your own model earlier, you can also upload it here, by adding the part of its file name before the *.json* extension to the `Room Floor` list in the command above.

Verify the models were created by running the `listModels` command. This will query the Azure Digital Twins instance for all models that have been uploaded. Look for the edited *Room* model in the results:

:::image type="content" source="media/quickstart/output-list-models.png" alt-text="Results of listModels, showing the updated Room model":::

Keep the project console window running for the following steps.

### Create digital twins

Now that some models have been uploaded to your Azure Digital Twins instance, you can create [**digital twins**](concepts-twins-graph.md) based on the model definitions. Digital twins represent the entities within your business environment—things like sensors on a farm, rooms in a building, or lights in a car. 

To create a digital twin, you use the `addTwin` command. You must reference the model that the twin is based on, and can optionally define initial values for any properties in the model. You do not have to pass any relationship information at this stage.

Run this code in the running project console to create several twins based on the *Floor* and *Room* models. Recall that *Room* has three properties, so you can provide arguments with the initial values for these.

```cmd
addTwin urn:example:Floor:1 floor0
addTwin urn:example:Floor:1 floor1
addTwin urn:example:Room:2 room0 DisplayName string Room0 Temperature double 70 HumidityLevel double 30
addTwin urn:example:Room:2 room1 DisplayName string Room1 Temperature double 80 HumidityLevel double 60
```

> [!TIP]
> If you uploaded your own model earlier, try making your own `addTwin` command based on the commands above to add a twin of your own model type.

The output from these commands should indicate the twins were created successfully. 

:::image type="content" source="media/quickstart/output-add-twin.png" alt-text="Excerpt from the results of addTwin commands, showing floor0, floor1, room0, and room1":::

You can also verify that the twins were created by running the `queryTwins` command. This command queries your Azure Digital Twins instance for all the digital twins it contains. Look for the *floor0*, *floor1*, *room0*, and *room1* twins in the results.

### Create a graph by adding relationships

Next, you can create some **relationships** between these twins, to connect them into a **twin graph**. Twin graphs are used to represent an entire environment. 

To add a relationship, you use the `addEdge` command. Specify the twin that the relationship is coming from, the type of relationship to add, and the twin that the relationship is connecting to. Lastly, provide a name (ID) for the relationship.

Run the following code to add a "contains" relationship from *floor2* to each of the *Room* twins you created earlier. Note that there must be a *contains* relationship defined on the *Floor* model for this to be possible.

```cmd
addEdge floor0 contains room0 relationship0
addEdge floor1 contains room1 relationship1
```

The output from these commands shows information about the relationships being created:

:::image type="content" source="media/quickstart/output-add-edge.png" alt-text="Excerpt from the results of addEdge commands, showing relationship0 and relationship1":::

To verify the relationships were created successfully, use either of the following commands to query the relationships in your Azure Digital Twins instance.
* To see all relationships coming off of each floor,
    ```cmd
    listEdges floor0
    listEdges floor1
    ```
* To query for these relationships by ID, 
    ```csharp
    getEdgeById floor0 contains relationship0
    getEdgeById floor1 contains relationship1
    ```

The twins and relationships you have set up in this quickstart form the following conceptual graph:

:::image type="content" source="media/quickstart/sample-graph.png" alt-text="A graph showing floor0 connected via relationship0 to room0, and floor1 connected via relationship1 to room1" border="false":::

## Query the twin graph to answer environment questions

A main feature of Azure Digital Twins is the ability to [query](concepts-query-language.md) your twin graph easily and efficiently to answer questions about your environment. Run the following commands in the running project console to get an idea of what this is like.

* **What are all the entities in my environment represented in Azure Digital Twins?** (query all)

    ```cmd
    queryTwins
    ```

    This allows you to take stock of your environment at a glance, and make sure everything is represented as you'd like it to be within Azure Digital Twins. The result of this is an output containing each digital twin with its details.

    :::image type="content" source="media/quickstart/output-query-all.png" alt-text="Results of twin query, showing floor0, floor1, room0, and room1":::

    >[!NOTE]
    >Observe how `queryTwins` without any additional arguments is the equivalent of `queryTwins SELECT * FROM DIGITALTWINS`.

* **What are all the rooms in my environment?** (query by model)

    ```cmd
    queryTwins SELECT * FROM DIGITALTWINS T WHERE IS_OF_MODEL(T, 'urn:example:Room:2')
    ```

    You can restrict your query to twins of a certain type, to get more specific information about what's represented. The result of this shows *room0* and *room1*, but does **not** show *floor0* or *floor1* (since they are floors, not rooms).
    
    :::image type="content" source="media/quickstart/output-query-model.png" alt-text="Results of model query, showing only room0 and room1":::

* **What are all the rooms on *floor0*?** (query by relationship)

    ```cmd
    queryTwins SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0'
    ```

    You can query based on relationships in your graph, to get information about how twins are connected or to restrict your query to a certain area. Only *room0* is on *floor0*, so it's the only room in the result.

    :::image type="content" source="media/quickstart/output-query-relationship.png" alt-text="Results of relationship query, showing room0":::

* **What are all the twins in my environment with a temperature above 75?** (query by property)

    ```cmd
    queryTwins SELECT * FROM DigitalTwins T WHERE T.Temperature > 75
    ```

    You can query the graph based on properties to answer a variety of questions, including finding outliers in your environment that might need attention. Other comparison operators (*<*,*>*, *=*, or *!=*) are also supported.

    :::image type="content" source="media/quickstart/output-query-property.png" alt-text="Results of property query, showing only room1":::

* **What are all the rooms on *floor0* with a temperature above 75?** (compound query)

    ```cmd
    queryTwins SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0' AND IS_OF_MODEL(room, 'urn:example:Room:2') AND room.Temperature > 75
    ```

    You can also combine the earlier queries like you would in SQL, using combination operators such as `AND`, `OR`, `NOT`. This query uses `AND` to make the previous query about twin temperatures more specific. The result now only includes rooms with temperatures above 75 that are on *floor0*—which in this case, is none of them.

    :::image type="content" source="media/quickstart/output-query-compound.png" alt-text="Results of compound query, showing no results":::

## Clean up resources

If you no longer need the resources created in this quickstart, follow these steps to delete them. If you plan to continue to the Azure Digital Twins tutorial, you can keep the resources you set up here to continue using this instance and client app configuration. 

Using the Azure Cloud Shell, you can delete all Azure resources in a resource group with the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete) command. This removes the resource group and the Azure Digital Twins instance.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

```azurecli-interactive
az group delete --name <your-resource-group>
```

Next, delete the AAD app registration you created for your client app with this command:

```azurecli
az ad app delete --id <your-application-ID>
```

Finally, delete the project sample folder you downloaded from your local machine.

## Next steps

In this quickstart, you got started with Azure Digital Twins by setting up an instance and a client application to interact with the instance. You built a basic Azure Digital Twins solution using models, digital twins, and relationships, and ran some queries on the solution to get an idea of what kinds of questions Azure Digital Twins can answer about an environment.

Continue on to the tutorial to see how to connect a sample solution to other Azure services to complete a data-driven, end-to-end scenario: 

> [!div class="nextstepaction"]
> [Tutorial: Build an end-to-end solution](tutorial.md)