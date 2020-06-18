---
# Mandatory fields.
title: Explore the basics with a sample client app
titleSuffix: Azure Digital Twins
description: Tutorial to explore the Azure Digital Twins SDKs using a sample command-line application
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 5/8/2020
ms.topic: tutorial
ms.service: digital-twins
ROBOTS: NOINDEX, NOFOLLOW

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Explore Azure Digital Twins with a sample client app

[!INCLUDE [Azure Digital Twins current preview status](../../includes/digital-twins-preview-status.md)]

This tutorial introduces a sample application that implements a command-line client application, for interacting with an Azure Digital Twins instance. The client app is similar to the one written in [Tutorial: Code a client app](tutorial-code.md).

You can use this sample to perform essential Azure Digital Twins actions such as uploading models, creating and modifying twins, and creating relationships. You can also look at the code of the sample to learn about the Azure Digital Twins APIs, and practice implementing your own commands by modifying the sample project however you would like.

In this tutorial, you will...
1. Set up an Azure Digital Twins instance
2. Configure the sample command-line app to interact with the instance
3. Use the command-line app to explore Azure Digital Twins, including **models**, **digital twins**, **relationships**, and **queries**

[!INCLUDE [Azure Digital Twins tutorial: sample prerequisites](../../includes/digital-twins-tutorial-sample-prereqs.md)]

[!INCLUDE [Azure Digital Twins tutorial: configure the sample project](../../includes/digital-twins-tutorial-sample-configure.md)]

## Explore with the sample solution

Now that the instance and sample app are configured, you will use the sample project and some pre-written example code to build out and explore a basic Azure Digital Twins solution. The major solution components are **models**, **digital twins**, and **relationships**, resulting in a queryable **twin graph** of an environment.

### Model a physical environment with DTDL

The first step in creating an Azure Digital Twins solution is defining twin [**models**](concepts-models.md) for your environment. 

Models are similar to classes in object-oriented programming languages; they provide user-defined templates for [digital twins](concepts-twins-graph.md) to follow and instantiate later. They are written in a JSON-like language called **Digital Twins Definition Language (DTDL)**, and can define a twin's *properties*, *telemetry*, *relationships*, and *components*.

> [!NOTE]
> DTDL also allows allows for the definition of *commands* on digital twins. However, commands are not currently supported in the Azure Digital Twins service.

In your Visual Studio window where the _**AdtE2ESample**_ project is open, use the *Solution Explorer* pane to navigate to the *AdtSampleApp\SampleClientApp\Models* folder. This folder contains sample models.

Select *Room.json* to open it in the editing window, and change it in the following ways:

* **Update the version number**, to indicate that you are providing a more-updated version of this model. Do this by changing the *1* at the end of the `@id` value to a *2*. Any number greater than the current version number will also work.
* **Edit a property**. Change the name of the `Humidity` property to *HumidityLevel* (or something different if you'd like. If you use something different than *HumidityLevel*, remember what you used and continue using that instead of *HumidityLevel* throughout the tutorial).
* **Add a property**. Underneath the `HumidityLevel` property that ends on line 15, paste the following code to add a `RoomName` property to the room:

    ```json
    ,
    {
      "@type": "Property",
      "name": "RoomName",
      "schema": "string"
    }
    ```
* **Add a relationship**. Underneath the `RoomName` property that you just added, paste the following code to add the ability for this type of twin to form *contains* relationships with other twins:

    ```json
    ,
    {
      "@type": "Relationship",
      "name": "contains",
    }
    ```

When you are finished, the updated model should look like this:

:::image type="content" source="media/tutorial-command-line-app/room-model.png" alt-text="Edited Room.json with updated version number, HumidityLevel and RoomName properties, and contains relationship" border="false":::

Make sure to save the file before moving on.

> [!TIP]
> If you want to try creating your own model, you can paste the *Room* model code into a new file that you save with a *.json* extension in the *AdtSampleApp\SampleClientApp\Models* folder. Then, play around with adding properties and relationships to represent whatever you'd like. You can also look at the other sample models in this folder for ideas.

> [!TIP] 
> There is a language-agnostic [DTDL Validator sample](https://github.com/Azure-Samples/DTDL-Validator) that you can use to check model documents to make sure the DTDL is valid. It is built on the DTDL parser library, which you can read more about in [How-to: Parse and validate models](how-to-use-parser.md).

### Get started with the command-line app

Now that you've defined a model, the remaining steps involve using the sample app to interact with your Azure Digital Twins instance. Run the project with this button in the toolbar:

:::image type="content" source="media/tutorial-command-line-app/start-button-sample.png" alt-text="The Visual Studio start button (SampleClientApp project)":::

A console window will open, carry out authentication, and wait for a command. 
* Authentication is handled through the browser: your default web browser will open with an authentication prompt. Use this prompt to sign in with your Azure credentials. You can then close the browser tab or window.

Here is a screenshot of what the project console looks like:

:::image type="content" source="media/tutorial-command-line-app/command-line-app.png" alt-text="Welcome message from the command-line app":::

> [!TIP]
> For a list of all the possible commands you can use with this project, enter `help` in the project console and press return.
> :::image type="content" source="media/tutorial-command-line-app/command-line-app-help.png" alt-text="Output of the help command":::

Keep the project console running for the rest of the steps in this tutorial.

#### Upload models to Azure Digital Twins

After designing models, you need to upload them to your Azure Digital Twins instance. This configures your Azure Digital Twins service instance with your own custom domain vocabulary. Once you have uploaded the models, you can create twin instances that use them.

In the project console window, run the following command to upload your updated *Room* model, as well as a *Floor* model that you'll also use in the next section to create different types of twins.

```cmd/sh
CreateModels Room Floor
```

The output should indicate the models were created successfully.

> [!TIP]
> If you designed your own model earlier, you can also upload it here, by adding its file name (you can leave out the extension) to the `Room Floor` list in the command above.

Verify the models were created by running the command `GetModels true`. This will query the Azure Digital Twins instance for all models that have been uploaded, and print out their full information. Look for the edited *Room* model in the results:

:::image type="content" source="media/tutorial-command-line-app/output-get-models.png" alt-text="Results of GetModels, showing the updated Room model":::

#### Errors

The sample application also handles errors from the service. 

Re-run the `CreateModels` command to try re-uploading one of the same models you just uploaded, for a second time:

```cmd/sh
CreateModels Room
```

As models cannot be overwritten, this will now return a service error:
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

### Create digital twins

Now that some models have been uploaded to your Azure Digital Twins instance, you can create [**digital twins**](concepts-twins-graph.md) based on the model definitions. Digital twins represent the entities within your business environment—things like sensors on a farm, rooms in a building, or lights in a car. 

To create a digital twin, you use the `CreateDigitalTwin` command. You must reference the model that the twin is based on, and can optionally define initial values for any properties in the model. You do not have to pass any relationship information at this stage.

Run this code in the running project console to create several twins, based on the *Room* model you updated earlier and another model, *Floor*. Recall that *Room* has three properties, so you can provide arguments with the initial values for these.

```cmd/sh
CreateDigitalTwin dtmi:example:Room;2 room0 RoomName string Room0 Temperature double 70 HumidityLevel double 30
CreateDigitalTwin dtmi:example:Room;2 room1 RoomName string Room1 Temperature double 80 HumidityLevel double 60
CreateDigitalTwin dtmi:example:Floor;1 floor0
CreateDigitalTwin dtmi:example:Floor;1 floor1
```

> [!TIP]
> If you uploaded your own model earlier, try making your own `CreateDigitalTwin` command based on the commands above to add a twin of your own model type.

The output from these commands should indicate the twins were created successfully. 

:::image type="content" source="media/tutorial-command-line-app/output-create-digital-twin.png" alt-text="Excerpt from the results of CreateDigitalTwin commands, showing floor0, floor1, room0, and room1":::

You can also verify that the twins were created by running the `Query` command. This command queries your Azure Digital Twins instance for all the digital twins it contains. Look for the *floor0*, *floor1*, *room0*, and *room1* twins in the results.

#### Modify a digital twin

You can can also modify the properties of a twin you've created. Try running this command to change *room0*'s RoomName from *Room0* to *PresidentialSuite*:

```cmd/sh
UpdateDigitalTwin room0 add /RoomName string PresidentialSuite
```

The output should indicate the twin was updated successfully.

You can also verify by running this command to see *room0*'s information:

```cmd/sh
GetDigitalTwin room0
```

The output should reflect the updated name.

> [!NOTE]
> The underlying REST API uses JSON Patch to define updates to a twin. The command-line app reflects this format, so that you can experiment with what the underlying APIs actually expect.

### Create a graph by adding relationships

Next, you can create some **relationships** between these twins, to connect them into a [**twin graph**](concepts-twins-graph.md). Twin graphs are used to represent an entire environment. 

To add a relationship, use the `CreateRelationship` command. Specify the twin that the relationship is coming from, the type of relationship to add, and the twin that the relationship is connecting to. Lastly, provide a name (ID) for the relationship.

Run the following code to add a "contains" relationship from each of the *Floor* twins you created earlier to a corresponding *Room* twin. Note that there must be a *contains* relationship defined on the *Floor* model for this to be possible.

```cmd/sh
CreateRelationship floor0 contains room0 relationship0
CreateRelationship floor1 contains room1 relationship1
```

The output from these commands confirms that the relationships were created successfully:

:::image type="content" source="media/tutorial-command-line-app/output-create-relationship.png" alt-text="Excerpt from the results of CreateRelationship commands, showing relationship0 and relationship1":::

You can also verify the relationships with any of the following commands, which query the relationships in your Azure Digital Twins instance.
* To see all relationships coming off of each floor (viewing the relationships from one side),
    ```cmd/sh
    GetRelationships floor0
    GetRelationships floor1
    ```
* To see all relationships arriving at each room (viewing the relationship from the "other" side),
    ```cmd/sh
    GetIncomingRelationships room0
    ```
* To query for these relationships individually, 
    ```cmd/sh
    GetRelationship floor0 contains relationship0
    GetRelationship floor1 contains relationship1
    ```

The twins and relationships you have set up in this tutorial form the following conceptual graph:

:::image type="content" source="media/tutorial-command-line-app/sample-graph.png" alt-text="A graph showing floor0 connected via relationship0 to room0, and floor1 connected via relationship1 to room1" border="false":::

### Query the twin graph to answer environment questions

A main feature of Azure Digital Twins is the ability to [query](concepts-query-language.md) your twin graph easily and efficiently to answer questions about your environment. Run the following commands in the running project console to get an idea of what this is like.

* **What are all the entities in my environment represented in Azure Digital Twins?** (query all)

    ```cmd/sh
    Query
    ```

    This allows you to take stock of your environment at a glance, and make sure everything is represented as you'd like it to be within Azure Digital Twins. The result of this is an output containing each digital twin with its details. Here is an excerpt:

    :::image type="content" source="media/tutorial-command-line-app/output-query-all.png" alt-text="Partial results of twin query, showing room0 and floor1":::

    >[!NOTE]
    >The command `Query` without any additional arguments is the equivalent of `Query SELECT * FROM DIGITALTWINS`.

* **What are all the rooms in my environment?** (query by model)

    ```cmd/sh
    Query SELECT * FROM DIGITALTWINS T WHERE IS_OF_MODEL(T, 'dtmi:example:Room;2')
    ```

    You can restrict your query to twins of a certain type, to get more specific information about what's represented. The result of this shows *room0* and *room1*, but does **not** show *floor0* or *floor1* (since they are floors, not rooms).
    
    :::image type="content" source="media/tutorial-command-line-app/output-query-model.png" alt-text="Results of model query, showing only room0 and room1":::

* **What are all the rooms on *floor0*?** (query by relationship)

    ```cmd/sh
    Query SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0'
    ```

    You can query based on relationships in your graph, to get information about how twins are connected or to restrict your query to a certain area. Only *room0* is on *floor0*, so it's the only room in the result.

    :::image type="content" source="media/tutorial-command-line-app/output-query-relationship.png" alt-text="Results of relationship query, showing room0":::

* **What are all the twins in my environment with a temperature above 75?** (query by property)

    ```cmd/sh
    Query SELECT * FROM DigitalTwins T WHERE T.Temperature > 75
    ```

    You can query the graph based on properties to answer a variety of questions, including finding outliers in your environment that might need attention. Other comparison operators (*<*,*>*, *=*, or *!=*) are also supported. *room1* shows up in the results here, because it has a temperature of 80.

    :::image type="content" source="media/tutorial-command-line-app/output-query-property.png" alt-text="Results of property query, showing only room1":::

* **What are all the rooms on *floor0* with a temperature above 75?** (compound query)

    ```cmd/sh
    Query SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0' AND IS_OF_MODEL(room, 'dtmi:example:Room;2') AND room.Temperature > 75
    ```

    You can also combine the earlier queries like you would in SQL, using combination operators such as `AND`, `OR`, `NOT`. This query uses `AND` to make the previous query about twin temperatures more specific. The result now only includes rooms with temperatures above 75 that are on *floor0*—which in this case, is none of them. The result set is empty.

    :::image type="content" source="media/tutorial-command-line-app/output-query-compound.png" alt-text="Results of compound query, showing no results":::

## Clean up resources

The project in this tutorial forms the basis for the next tutorial, [Tutorial: Connect an end-to-end solution](tutorial-end-to-end.md). If you plan to continue to the next tutorial, you can keep the resources you set up here to continue using this Azure Digital Twins instance and configured sample app.
* In this case, you can use the sample app's `DeleteAllTwins` and `DeleteAllModels` commands to clear the twins and models in your instance, respectively. This will give you a clean slate for the next tutorial.

If you no longer need the resources created in this tutorial, follow these steps to delete them.

Using the [Azure Cloud Shell](https://shell.azure.com), you can delete all Azure resources in a resource group with the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete) command. This removes the resource group and the Azure Digital Twins instance.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

Open an Azure Cloud Shell and run the following command to delete the resource group and everything it contains.

```azurecli-interactive
az group delete --name <your-resource-group>
```

Next, delete the Azure Active Directory app registration you created for your client app with this command:

```azurecli
az ad app delete --id <your-application-ID>
```

Finally, delete the project sample folder you downloaded to your local machine.

## Next steps 

In this tutorial, you got started with Azure Digital Twins by setting up an instance and a client application to interact with the instance. You used the client app to explore Azure Digital Twins, creating models, digital twins, and relationships. You also ran some queries on the solution, to get an idea of what kinds of questions Azure Digital Twins can answer about an environment.

Continue to the next tutorial to use the sample command-line app in combination with other Azure services to complete a data-driven, end-to-end scenario:

> [!div class="nextstepaction"]
> [Tutorial: Connect an end-to-end solution](tutorial-end-to-end.md)

Or, start looking at the concept documentation to learn more about elements you worked with in the tutorial:
* [Concepts: Custom models](concepts-models.md)

You can also go more in-depth on the processes in this tutorial by starting the how-to articles:
* [How-to: Use the Azure Digital Twins CLI](how-to-use-cli.md)
