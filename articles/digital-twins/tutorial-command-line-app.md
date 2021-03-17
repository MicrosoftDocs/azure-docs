---
# Mandatory fields.
title: 'Tutorial: Create a graph in Azure Digital Twins (client app)'
titleSuffix: Azure Digital Twins
description: Tutorial to build an Azure Digital Twins scenario using a sample command-line application
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 5/8/2020
ms.topic: tutorial
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Tutorial: Create an Azure Digital Twins graph using a sample client app

[!INCLUDE [digital-twins-tutorial-selector.md](../../includes/digital-twins-tutorial-selector.md)]

In this tutorial, you'll build a graph in Azure Digital Twins using models, twins, and relationships. The tool for this tutorial is the a **sample command-line client application** for interacting with an Azure Digital Twins instance. The client app is similar to the one written in [*Tutorial: Code a client app*](tutorial-code.md).

You can use this sample to perform essential Azure Digital Twins actions such as uploading models, creating and modifying twins, and creating relationships. You can also look at the [code of the sample](https://github.com/Azure-Samples/digital-twins-samples/tree/master/) to learn about the Azure Digital Twins APIs, and practice implementing your own commands by modifying the sample project however you would like.

In this tutorial, you will...
> [!div class="checklist"]
> * Model an environment
> * Create digital twins
> * Add relationships to form a graph
> * Query the graph to answer questions

[!INCLUDE [Azure Digital Twins tutorial: sample prerequisites](../../includes/digital-twins-tutorial-sample-prereqs.md)]

[!INCLUDE [Azure Digital Twins tutorial: configure the sample project](../../includes/digital-twins-tutorial-sample-configure.md)]

### Run the sample project

Now that the app and authentication are set up, run the project with this button in the toolbar:

:::image type="content" source="media/tutorial-command-line/app/start-button-sample.png" alt-text="Screenshot of the Visual Studio start button (SampleClientApp project)." lightbox="media/tutorial-command-line/app/start-button-sample.png":::

A console window will open, carry out authentication, and wait for a command. 
* Authentication is handled through the browser: your default web browser will open with an authentication prompt. Use this prompt to sign in with your Azure credentials. You can then close the browser tab or window.

Here is a screenshot of what the project console looks like:

:::image type="content" source="media/tutorial-command-line/app/command-line-app.png" alt-text="Screenshot of the welcome message from the command-line app." lightbox="media/tutorial-command-line/app/command-line-app.png":::

> [!TIP]
> For a list of all the possible commands you can use with this project, enter `help` in the project console and press return.

Keep the project console running for the rest of the steps in this tutorial.

## Model a physical environment with DTDL

Now that the Azure Digital Twins instance and sample app are set up, you can begin building a graph of a scenario. 

The first step in creating an Azure Digital Twins solution is defining twin [**models**](concepts-models.md) for your environment. 

Models are similar to classes in object-oriented programming languages; they provide user-defined templates for [digital twins](concepts-twins-graph.md) to follow and instantiate later. They are written in a JSON-like language called **Digital Twins Definition Language (DTDL)**, and can define a twin's *properties*, *telemetry*, *relationships*, and *components*.

> [!NOTE]
> DTDL also allows for the definition of *commands* on digital twins. However, commands are not currently supported in the Azure Digital Twins service.

In your Visual Studio window where the _**AdtE2ESample**_ project is open, use the *Solution Explorer* pane to navigate to the *AdtSampleApp\SampleClientApp\Models folder*. This folder contains sample models.

Select *Room.json* to open it in the editing window, and change it in the following ways:

[!INCLUDE [digital-twins-tutorial-model-create.md](../../includes/digital-twins-tutorial-model-create.md)]

### Upload models to Azure Digital Twins

After designing models, you need to upload them to your Azure Digital Twins instance. This configures your Azure Digital Twins service instance with your own custom domain vocabulary. Once you have uploaded the models, you can create twin instances that use them.

1. In the project console window, run the following command to upload your updated *Room* model, as well as a *Floor* model that you'll also use in the next section to create different types of twins.

    ```cmd/sh
    CreateModels Room Floor
    ```
    
    The output should indicate the models were created successfully.

1. Verify the models were created by running the command `GetModels true`. This will query the Azure Digital Twins instance for all models that have been uploaded, and print out their full information. Look for the edited *Room* model in the results:

    :::image type="content" source="media/tutorial-command-line/app/output-get-models.png" alt-text="Screenshot of the result from GetModels, showing the updated Room model." lightbox="media/tutorial-command-line/app/output-get-models.png":::

### Errors

The sample application also handles errors from the service. 

Re-run the `CreateModels` command to try re-uploading one of the same models you just uploaded, for a second time:

```cmd/sh
CreateModels Room
```

As models cannot be overwritten, this will now return a service error.
For the details on how to delete existing models, see [*How-to: Manage DTDL models*](how-to-manage-model.md).
```cmd/sh
Response 409: Service request failed.
Status: 409 (Conflict)

Content:
{"error":{"code":"ModelAlreadyExists","message":"Could not add model dtmi:example:Room;2 as it already exists. Use Model_List API to view models that already exist. See the Swagger example.(http://aka.ms/ModelListSwSmpl)"}}

Headers:
Strict-Transport-Security: REDACTED
Date: Wed, 20 May 2020 00:53:49 GMT
Content-Length: 223
Content-Type: application/json; charset=utf-8
```

## Create digital twins

Now that some models have been uploaded to your Azure Digital Twins instance, you can create [**digital twins**](concepts-twins-graph.md) based on the model definitions. Digital twins represent the entities within your business environment—things like sensors on a farm, rooms in a building, or lights in a car. 

To create a digital twin, you use the `CreateDigitalTwin` command. You must reference the model that the twin is based on, and can optionally define initial values for any properties in the model. You do not have to pass any relationship information at this stage.

1. Run this code in the running project console to create several twins, based on the *Room* model you updated earlier and another model, *Floor*. Recall that *Room* has three properties, so you can provide arguments with the initial values for these. (Initializing property values is optional in general, but they're needed for this tutorial.)

    ```cmd/sh
    CreateDigitalTwin dtmi:example:Room;2 room0 RoomName string Room0 Temperature double 70 HumidityLevel double 30
    CreateDigitalTwin dtmi:example:Room;2 room1 RoomName string Room1 Temperature double 80 HumidityLevel double 60
    CreateDigitalTwin dtmi:example:Floor;1 floor0
    CreateDigitalTwin dtmi:example:Floor;1 floor1
    ```

    The output from these commands should indicate the twins were created successfully. 
    
    :::image type="content" source="media/tutorial-command-line/app/output-create-digital-twin.png" alt-text="Screenshot showing an excerpt from the result of the CreateDigitalTwin commands, which includes floor0, floor1, room0, and room1." lightbox="media/tutorial-command-line/app/output-create-digital-twin.png":::

1. You can verify that the twins were created by running the `Query` command. This command queries your Azure Digital Twins instance for all the digital twins it contains. Look for the *room0*, *room1*, *floor0*, and *floor1* twins in the results.

### Modify a digital twin

You can also modify the properties of a twin you've created. 

> [!NOTE]
> The underlying REST API uses [JSON Patch](http://jsonpatch.com/) format to define updates to a twin. The command-line app also uses this format, to give a truer experience with what the underlying APIs expect.

1. Run this command to change *room0*'s RoomName from *Room0* to *PresidentialSuite*:
    
    ```cmd/sh
    UpdateDigitalTwin room0 add /RoomName string PresidentialSuite
    ```
    
    The output should indicate the twin was updated successfully.

1. You can verify the update succeeded by running this command to see *room0*'s information:

    ```cmd/sh
    GetDigitalTwin room0
    ```
    
    The output should reflect the updated name.


## Create a graph by adding relationships

Next, you can create some **relationships** between these twins, to connect them into a [**twin graph**](concepts-twins-graph.md). Twin graphs are used to represent an entire environment. 

The types of relationships that you can create from one twin to another are defined within the [models](#model-a-physical-environment-with-dtdl) that you uploaded earlier. The [model definition for *Floor*](https://github.com/azure-Samples/digital-twins-samples/blob/master/AdtSampleApp/SampleClientApp/Models/Floor.json) specifies that floors can have a type of relationship called *contains*. This makes it possible to create a *contains*-type relationship from each *Floor* twin to the corresponding room that it contains.

To add a relationship, use the `CreateRelationship` command. Specify the twin that the relationship is coming from, the type of relationship, and the twin that the relationship is connecting to. Lastly, give the relationship a unique ID.

1. Run the following code to add a "contains" relationship from each of the *Floor* twins you created earlier to a corresponding *Room* twin. The relationships are named *relationship0* and *relationship1*.

    ```cmd/sh
    CreateRelationship floor0 contains room0 relationship0
    CreateRelationship floor1 contains room1 relationship1
    ```

    >[!TIP]
    >The *contains* relationship in the [*Floor* model](https://github.com/azure-Samples/digital-twins-samples/blob/master/AdtSampleApp/SampleClientApp/Models/Floor.json) was also defined with two string properties, `ownershipUser` and `ownershipDepartment`, so you can also provide arguments with the initial values for these when you create the relationships.
    > Here's an alternate version of the command above to create *relationship0* that also specifies initial values for these properties:
    > ```cmd/sh
    > CreateRelationship floor0 contains room0 relationship0 ownershipUser string MyUser ownershipDepartment string myDepartment
    > ``` 
    
    The output from these commands confirms that the relationships were created successfully:
    
    :::image type="content" source="media/tutorial-command-line/app/output-create-relationship.png" alt-text="Screenshot of an excerpt from the result of the CreateRelationship commands, which includes relationship0 and relationship1." lightbox="media/tutorial-command-line/app/output-create-relationship.png":::

1. You can verify the relationships with any of the following commands, which query the relationships in your Azure Digital Twins instance.
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

Run the following commands in the running project console to answer some questions about the sample environment.

1. **What are all the entities from my environment represented in Azure Digital Twins?** (query all)

    ```cmd/sh
    Query
    ```

    This allows you to take stock of your environment at a glance, and make sure everything is represented as you'd like it to be within Azure Digital Twins. The result of this is an output containing each digital twin with its details. Here is an excerpt:

    :::image type="content" source="media/tutorial-command-line/app/output-query-all.png" alt-text="Screenshot showing a partial result from the twin query, including room0 and floor1.":::

    >[!NOTE]
    >In the sample project, the command `Query` without any additional arguments is the equivalent of `Query SELECT * FROM DIGITALTWINS`. To query all the twins in your instance using the [Query APIs](/rest/api/digital-twins/dataplane/query) or the [CLI commands](how-to-use-cli.md), use the longer (complete) query.

1. **What are all the rooms in my environment?** (query by model)

    ```cmd/sh
    Query SELECT * FROM DIGITALTWINS T WHERE IS_OF_MODEL(T, 'dtmi:example:Room;2')
    ```

    You can restrict your query to twins of a certain type, to get more specific information about what's represented. The result of this shows *room0* and *room1*, but does **not** show *floor0* or *floor1* (since they are floors, not rooms).
    
    :::image type="content" source="media/tutorial-command-line/app/output-query-model.png" alt-text="Screenshot of the result from the model query, showing only room0 and room1.":::

1. **What are all the rooms on *floor0*?** (query by relationship)

    ```cmd/sh
    Query SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0'
    ```

    You can query based on relationships in your graph, to get information about how twins are connected or to restrict your query to a certain area. Only *room0* is on *floor0*, so it's the only room in the result.

    :::image type="content" source="media/tutorial-command-line/app/output-query-relationship.png" alt-text="Screenshot of the result from the relationship query, showing room0.":::

1. **What are all the twins in my environment with a temperature above 75?** (query by property)

    ```cmd/sh
    Query SELECT * FROM DigitalTwins T WHERE T.Temperature > 75
    ```

    You can query the graph based on properties to answer a variety of questions, including finding outliers in your environment that might need attention. Other comparison operators (*<*,*>*, *=*, or *!=*) are also supported. *room1* shows up in the results here, because it has a temperature of 80.

    :::image type="content" source="media/tutorial-command-line/app/output-query-property.png" alt-text="Screenshot of the result from the property query, showing only room1.":::

1. **What are all the rooms on *floor0* with a temperature above 75?** (compound query)

    ```cmd/sh
    Query SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0' AND IS_OF_MODEL(room, 'dtmi:example:Room;2') AND room.Temperature > 75
    ```

    You can also combine the earlier queries like you would in SQL, using combination operators such as `AND`, `OR`, `NOT`. This query uses `AND` to make the previous query about twin temperatures more specific. The result now only includes rooms with temperatures above 75 that are on *floor0*—which in this case, is none of them. The result set is empty.

    :::image type="content" source="media/tutorial-command-line/app/output-query-compound.png" alt-text="Screenshot of the result from the compound query, showing no results." lightbox="media/tutorial-command-line/app/output-query-compound.png":::

## Clean up resources

After completing this tutorial, you can choose which resources you'd like to remove, depending on what you'd like to do next.

* **If you plan to continue to the next tutorial**, you can keep the resources you set up here to continue using this Azure Digital Twins instance and configured sample app for the next tutorial

* **If you'd like to continue using the Azure Digital Twins instance, but clear out all of its models, twins, and relationships**, you can use the sample app's `DeleteAllTwins` and `DeleteAllModels` commands to clear the twins and models in your instance, respectively.

[!INCLUDE [digital-twins-cleanup-basic.md](../../includes/digital-twins-cleanup-basic.md)]

You may also want to delete the project folder from your local machine.

## Next steps 

In this tutorial, you got started with Azure Digital Twins by building a graph in your instance using a sample client application. You created models, digital twins, and relationships to form a graph. You also ran some queries on the graph, to get an idea of what kinds of questions Azure Digital Twins can answer about an environment.

Continue to the next tutorial to combine Azure Digital Twins with other Azure services to complete a data-driven, end-to-end scenario:
> [!div class="nextstepaction"]
> [*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md)