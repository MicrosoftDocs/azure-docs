---
# Mandatory fields.
title: 'Tutorial: Create a graph in Azure Digital Twins (client app)'
titleSuffix: Azure Digital Twins
description: Tutorial to build an Azure Digital Twins scenario using a sample command-line application
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 06/21/2022
ms.topic: tutorial
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Tutorial: Create an Azure Digital Twins graph using a sample client app

[!INCLUDE [digital-twins-tutorial-selector.md](../../includes/digital-twins-tutorial-selector.md)]

In this tutorial, you'll build a graph in Azure Digital Twins using models, twins, and relationships. The tool for this tutorial is the sample command-line client application for interacting with an Azure Digital Twins instance. The client app is similar to the one written in [Code a client app](tutorial-code.md).

You can use this sample to perform essential Azure Digital Twins actions such as uploading models, creating and modifying twins, and creating relationships. You can also look at the [code of the sample](https://github.com/Azure-Samples/digital-twins-samples/tree/main/) to learn about the Azure Digital Twins APIs, and practice implementing your own commands by modifying the sample project however you want.

In this tutorial, you will...
> [!div class="checklist"]
> * Model an environment
> * Create digital twins
> * Add relationships to form a graph
> * Query the graph to answer questions

[!INCLUDE [Azure Digital Twins tutorial: sample prerequisites](../../includes/digital-twins-tutorial-sample-prereqs.md)]

[!INCLUDE [Azure Digital Twins tutorial: configure the sample project](../../includes/digital-twins-tutorial-sample-configure.md)]

### Run the sample project

Now that the app and authentication are set up, open a local **console window** that you'll use to run the project. Navigate in the console to the *digital-twins-samples-main\AdtSampleApp\SampleClientApp* folder, and run the project with this dotnet command:

```cmd/sh
dotnet run
```

The project will start running, carry out authentication, and wait for a command. 

Here's a screenshot of what the project console looks like:

:::image type="content" source="media/tutorial-command-line/app/command-line-app.png" alt-text="Screenshot of the welcome message from the command-line app." lightbox="media/tutorial-command-line/app/command-line-app.png":::

> [!TIP]
> For a list of all the possible commands you can use with this project, enter `help` in the project console and press return.

Once you've confirmed the app is running successfully, you can stop running the project. You'll run it again later in the tutorial.

## Model a physical environment with DTDL

Now that the Azure Digital Twins instance and sample app are set up, you can begin building a graph of a scenario. 

The first step in creating an Azure Digital Twins solution is defining twin [models](concepts-models.md) for your environment. 

Models are similar to classes in object-oriented programming languages; they're user-defined templates that you can instantiate to create [digital twins](concepts-twins-graph.md). Models are written in a JSON-like language called *Digital Twins Definition Language (DTDL)*, and they define a type of twin in terms of its properties, telemetry, relationships, and components.

> [!NOTE]
> DTDL also allows for the definition of commands on digital twins. However, commands are not currently supported in the Azure Digital Twins service.

In the sample project folder that you downloaded earlier, navigate into the *digital-twins-samples-main\AdtSampleApp\SampleClientApp\Models* folder. This folder contains sample models.

Open *Room.json* for editing, and make the following changes to the code:

[!INCLUDE [digital-twins-tutorial-model-create.md](../../includes/digital-twins-tutorial-model-create.md)]

### Upload models to Azure Digital Twins

After designing models, you need to upload them to your Azure Digital Twins instance. Doing so configures your Azure Digital Twins service instance with your own custom domain vocabulary. Once you've uploaded the models, you can create twin instances that use them.

1. Return to your console window that's open to the *digital-twins-samples-main\AdtSampleApp\SampleClientApp* folder, and run the console app again with `dotnet run`.

1. In the project console window, run the following command to upload your updated Room model along with a Floor model that you'll also use in the next section to create different types of twins.

    ```cmd/sh
    CreateModels Room Floor
    ```
    
    The output should indicate the models were created successfully.

1. Verify the models were created by running the command `GetModels true`. This command will print the full information for all the models that have been uploaded to your Azure Digital Twins instance. Look for the edited Room model in the results:

    :::image type="content" source="media/tutorial-command-line/app/output-get-models.png" alt-text="Screenshot of the result from GetModels, showing the updated Room model." lightbox="media/tutorial-command-line/app/output-get-models.png":::

Keep the console app running for the next steps.

### Errors

The sample application also handles errors from the service. 

To test this, rerun the `CreateModels` command to try re-uploading the Room model that you've already uploaded:

```cmd/sh
CreateModels Room
```

As models cannot be overwritten, this command will now return a service error indicating that some of the model IDs you are trying to create already exist.
 
For the details on how to delete existing models, see [Manage DTDL models](how-to-manage-model.md).

## Create digital twins

Now that some models have been uploaded to your Azure Digital Twins instance, you can create [digital twins](concepts-twins-graph.md) based on the model definitions. Digital twins represent the entities within your business environment—things like sensors on a farm, rooms in a building, or lights in a car. 

To create a digital twin, you use the `CreateDigitalTwin` command. You must reference the model that the twin is based on, and can optionally define initial values for any properties in the model. You don't have to pass any relationship information at this stage.

1. Run this code in the running project console to create several twins, based on the Room model you updated earlier and another model, Floor. Recall that Room has three properties, so you can provide arguments with the initial values for these properties. (Initializing property values is optional in general, but they're needed for this tutorial.)

    ```cmd/sh
    CreateDigitalTwin dtmi:example:Room;2 room0 RoomName string Room0 Temperature double 70 HumidityLevel double 30
    CreateDigitalTwin dtmi:example:Room;2 room1 RoomName string Room1 Temperature double 80 HumidityLevel double 60
    CreateDigitalTwin dtmi:example:Floor;1 floor0
    CreateDigitalTwin dtmi:example:Floor;1 floor1
    ```

    The output from these commands should indicate the twins were created successfully. 
    
    :::image type="content" source="media/tutorial-command-line/app/output-create-digital-twin.png" alt-text="Screenshot showing an excerpt from the result of the CreateDigitalTwin commands, which includes floor0, floor1, room0, and room1." lightbox="media/tutorial-command-line/app/output-create-digital-twin.png":::

1. You can verify that the twins were created by running the `Query` command. This command queries your Azure Digital Twins instance for all the digital twins it contains. Look for the room0, room1, floor0, and floor1 twins in the results.

[!INCLUDE [digital-twins-query-latency-note.md](../../includes/digital-twins-query-latency-note.md)]

### Modify a digital twin

You can also modify the properties of a twin you've created. 

> [!NOTE]
> The underlying REST API uses [JSON Patch](http://jsonpatch.com/) format to define updates to a twin. The command-line app also uses this format, to give a truer experience with what the underlying APIs expect.

1. Run this command to change room0's RoomName from "Room0" to "PresidentialSuite":
    
    ```cmd/sh
    UpdateDigitalTwin room0 add /RoomName string PresidentialSuite
    ```
    
    The output should indicate the twin was updated successfully.

1. You can verify the update succeeded by running this command to see room0's information:

    ```cmd/sh
    GetDigitalTwin room0
    ```
    
    The output should reflect the updated name.


## Create a graph by adding relationships

Next, you can create some relationships between these twins, to connect them into a [twin graph](concepts-twins-graph.md). Twin graphs are used to represent an entire environment. 

The types of relationships that you can create from one twin to another are defined within the [models](#model-a-physical-environment-with-dtdl) that you uploaded earlier. The [model definition for Floor](https://github.com/azure-Samples/digital-twins-samples/blob/main/AdtSampleApp/SampleClientApp/Models/Floor.json) specifies that floors can have a type of relationship called `contains`, which makes it possible to create a `contains`-type relationship from each Floor twin to the corresponding room that it contains.

To add a relationship, use the `CreateRelationship` command. Specify the twin that the relationship is coming from, the type of relationship, and the twin that the relationship is connecting to. Lastly, give the relationship a unique ID.

1. Run the following commands to add a `contains` relationship from each of the Floor twins you created earlier to a corresponding Room twin. The relationships are named relationship0 and relationship1.

    ```cmd/sh
    CreateRelationship floor0 contains room0 relationship0
    CreateRelationship floor1 contains room1 relationship1
    ```

    >[!TIP]
    >The `contains` relationship in the [Floor model](https://github.com/azure-Samples/digital-twins-samples/blob/main/AdtSampleApp/SampleClientApp/Models/Floor.json) was also defined with two string properties, `ownershipUser` and `ownershipDepartment`, so you can also provide arguments with the initial values for these when you create the relationships.
    > Here's an alternate version of the command above to create relationship0 that also specifies initial values for these properties:
    > ```cmd/sh
    > CreateRelationship floor0 contains room0 relationship0 ownershipUser string MyUser ownershipDepartment string myDepartment
    > ``` 
    
    The output from these commands confirms that the relationships were created successfully:
    
    :::image type="content" source="media/tutorial-command-line/app/output-create-relationship.png" alt-text="Screenshot of an excerpt from the result of the CreateRelationship commands, which includes relationship0 and relationship1." lightbox="media/tutorial-command-line/app/output-create-relationship.png":::

1. You can verify the relationships with any of the following commands, which will print the relationships in your Azure Digital Twins instance.
    * To see all relationships coming off of each floor (viewing the relationships from one side):
        ```cmd/sh
        GetRelationships floor0
        GetRelationships floor1
        ```
    * To see all relationships arriving at each room (viewing the relationship from the "other" side):
        ```cmd/sh
        GetIncomingRelationships room0
        GetIncomingRelationships room1
        ```
    * To look for these relationships individually, by ID:
        ```cmd/sh
        GetRelationship floor0 relationship0
        GetRelationship floor1 relationship1
        ```

The twins and relationships you have set up in this tutorial form the following conceptual graph:

:::image type="content" source="media/tutorial-command-line/app/sample-graph.png" alt-text="A diagram showing a conceptual graph. floor0 is connected via relationship0 to room0, and floor1 is connected via relationship1 to room1." border="false" lightbox="media/tutorial-command-line/app/sample-graph.png":::

## Query the twin graph to answer environment questions

A main feature of Azure Digital Twins is the ability to [query](concepts-query-language.md) your twin graph easily and efficiently to answer questions about your environment. 

[!INCLUDE [digital-twins-query-latency-note.md](../../includes/digital-twins-query-latency-note.md)]

Run the following commands in the running project console to answer some questions about the sample environment.

1. What are all the entities from my environment represented in Azure Digital Twins? (query all)

    ```cmd/sh
    Query
    ```

    This command allows you to take stock of your environment at a glance, and make sure everything is represented as you want it to be within Azure Digital Twins. The result of this command is an output containing each digital twin with its details. Here's an excerpt:

    :::image type="content" source="media/tutorial-command-line/app/output-query-all.png" alt-text="Screenshot showing a partial result from the twin query, including room0 and floor1.":::

    >[!TIP]
    >In the sample project, the command `Query` without any additional arguments is the equivalent of `Query SELECT * FROM DIGITALTWINS`. To query all the twins in your instance using the [Query APIs](/rest/api/digital-twins/dataplane/query) or the [CLI commands](/cli/azure/dt), use the longer (complete) query.

1. What are all the rooms in my environment? (query by model)

    ```cmd/sh
    Query SELECT * FROM DIGITALTWINS T WHERE IS_OF_MODEL(T, 'dtmi:example:Room;2')
    ```

    You can restrict your query to twins of a certain type, to get more specific information about what's represented. The result of this shows room0 and room1, but doesn't show floor0 or floor1 (since they're floors, not rooms).
    
    :::image type="content" source="media/tutorial-command-line/app/output-query-model.png" alt-text="Screenshot of the result from the model query, showing only room0 and room1.":::

1. What are all the rooms on floor0? (query by relationship)

    ```cmd/sh
    Query SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0'
    ```

    You can query based on relationships in your graph, to get information about how twins are connected or to restrict your query to a certain area. Only room0 is on floor0, so it's the only room in the result.

    :::image type="content" source="media/tutorial-command-line/app/output-query-relationship.png" alt-text="Screenshot of the result from the relationship query, showing room0.":::

1. What are all the twins in my environment with a temperature above 75? (query by property)

    ```cmd/sh
    Query SELECT * FROM DigitalTwins T WHERE T.Temperature > 75
    ```

    You can query the graph based on properties to answer various questions, including finding outliers in your environment that might need attention. Other comparison operators (*<*,*>*, *=*, or *!=*) are also supported. room1 shows up in the results here, because it has a temperature of 80.

    :::image type="content" source="media/tutorial-command-line/app/output-query-property.png" alt-text="Screenshot of the result from the property query, showing only room1.":::

1. What are all the rooms on floor0 with a temperature above 75? (compound query)

    ```cmd/sh
    Query SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0' AND IS_OF_MODEL(room, 'dtmi:example:Room;2') AND room.Temperature > 75
    ```

    You can also combine the earlier queries like you would in SQL, using combination operators such as `AND`, `OR`, `NOT`. This query uses `AND` to make the previous query about twin temperatures more specific. The result now only includes rooms with temperatures above 75 that are on floor0—which in this case, is none of them. The result set is empty.

    :::image type="content" source="media/tutorial-command-line/app/output-query-compound.png" alt-text="Screenshot of the result from the compound query, showing no results." lightbox="media/tutorial-command-line/app/output-query-compound.png":::

Now that you've run several queries on the scenario you set up, the tutorial is complete. Stop running the project and close the console window.

## Clean up resources

After completing this tutorial, you can choose which resources you want to remove, depending on what you want to do next.

* If you plan to continue to the next tutorial, you can keep the resources you set up here to continue using this Azure Digital Twins instance and configured sample app for the next tutorial

* If you want to continue using the Azure Digital Twins instance, but clear out all of its models, twins, and relationships, you can use the sample app's `DeleteAllTwins` and `DeleteAllModels` commands to clear the twins and models in your instance, respectively.

[!INCLUDE [digital-twins-cleanup-basic.md](../../includes/digital-twins-cleanup-basic.md)]

You may also want to delete the downloaded project folder from your local machine.

## Next steps 

In this tutorial, you got started with Azure Digital Twins by building a graph in your instance using a sample client application. You created models, digital twins, and relationships to form a graph. You also ran some queries on the graph, to get an idea of what kinds of questions Azure Digital Twins can answer about an environment.

Continue to the next tutorial to combine Azure Digital Twins with other Azure services to complete a data-driven, end-to-end scenario:
> [!div class="nextstepaction"]
> [Connect an end-to-end solution](tutorial-end-to-end.md)