---
# Mandatory fields.
title: Explore Azure Digital Twins with a command line interface
titleSuffix: Azure Digital Twins
description: Tutorial that shows a command line application to explore AZure Digital Twins SDKs in depth
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/15/2020
ms.topic: tutorial
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Explore ADT with a command line tool

In this tutorial, you will use a command line tool, supplied in source code, to explore an Azure Digital Twins instance. You will also explore the basic coding patterns used in the tool.

In this tutorial, you will...
* Set up an Azure Digital Twins instance
* Explore Azure Digital Twins using a command line tool
* Explore the code behind the command line tool and extend it

The tutorial is driven by a sample project written in C#. Get the sample project on your machine by [downloading the Azure Digital Twins samples repository as a ZIP file](https://github.com/Azure-Samples/digital-twins-samples/archive/master.zip).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Azure Digital Twins setup steps: instance creation and authentication](../../includes/digital-twins-setup-1.md)]

#### Register your application

[!INCLUDE [Azure Digital Twins setup steps: client app registration](../../includes/digital-twins-setup-2.md)]

[!INCLUDE [Azure Digital Twins setup steps: client app configuration](../../includes/digital-twins-setup-3.md)]

## Prerequisites
* Visual Studio 2019

### Model a physical environment with DTDL

The first step in creating an Azure Digital Twins solution is defining twin [**models**](concepts-models.md) for your environment. 

Models are similar to classes in object-oriented programming languages; they provide user-defined templates for [digital twins](concepts-twins-graph.md) to follow and instantiate later. They are written in a JSON-like language called **Digital Twins Definition Language (DTDL)**, and can define a twin's *properties*, *telemetry*, *relationships*, and *components*.

DTDL also allows allows for the definition of *commands* on DIgital twins. However, commands are not currently supported in the Azure Digital Twins service. They are supported, however, IoT Plug  and Play for devices.

In the sample project folder, navigate to the *DigitalTwinsMetadata/DigitalTwinsSample/Models* folder. This folder contains sample models.

Open *Room.json*, and change it in the following ways:

* **Update the version number**, to indicate that you are providing a more-updated version of this model. Do this by changing the *1* at the end of the `@id` value to a *2*. Any number greater than the current version number will also work.
* **Edit a property**. Change the name of the `Humidity` property to *HumidityLevel* (or something different if you'd like. If you use something different than *HumidityLevel*, remember what you used and continue using that instead of *HumidityLevel* throughout this quickstart).
* **Add a property**. After the `HumidityLevel` property that ends on line 15, paste the following code to add a `RoomName` property to the room:

    ```json
    ,
    {
      "@type": "Property",
      "name": "RoomName",
      "schema": "string"
    }
    ```
* **Add a relationship**. After the `RoomName` property that ends on line 20, paste the following code to add the ability for this type of twin to form *contains* relationships with other twins:

    ```json
    ,
    {
      "@type": "Relationship",
      "name": "contains",
    }
    ```

When you are finished, the updated model should look like this:

:::image type="content" source="media/quickstart/room-model.png" alt-text="Edited Room.json with updated version number, HumidityLevel and RoomName properties, and contains relationship" border="false":::

Make sure to save the file before moving on.

> [!TIP]
> If you want to try creating your own model, you can paste the Room model into a new file that you save with a *.json* extension in the *DigitalTwinsMetadata/DigitalTwinsSample/Models* folder. Then play around with adding properties and relationships to represent whatever you would like. You can also look at the other sample models in this folder for ideas.

## Get started with the command line tool

In your cloned sample repo, navigate to the folder digital-twins-samples/buildingScenario/AdtSampleApp.

Open the solution file **AdtE2ESample.sln** with Visual Studio 2019

Configure the sample application to work with the instance of Azure DIgital Twins that you have previously set up. To do so:

* Copy the file serviceConfig.json.TEMPLATE to a new file called serviceConfig.json.
* Edit the newly created file. It contains a preset JSON file with 3 configuration variables:

```json
{
  "tenantId": "<your tenant id here>",
  "clientId": "<your client id here>",
  "instanceUrl": "<your instance URL here>"
}
```

Replace all three values with the values for your subscription, app registration and Azure DIgital Twins service instance.

Run the console application by pressing **F5** in Visual Studio.

When the application starts up, your default web browser will open and bring up a login prompt. Use this prompt to login to Azure.
You can then close the browser tab or window.

The command line sample tool will show up as follows:

:::image type="content" source="media/tutorial-explore-adt-with-a-command-line-tool/CLITool-01.png" alt-text="Welcome message from the command line tool":::

Type help in the command line and press return. You will see a list of all supported commands:

:::image type="content" source="media/tutorial-explore-adt-with-a-command-line-tool/CLITool-02.png" alt-text="Help message from the command line tool":::


#### Upload models to Azure Digital Twins

Once you have designed your model(s), you need to upload them to your Azure Digital Twins instance. THis configures your Azure Digital Twins service instance with your own custom domain vocabulary. Once you have uploaded the models, you can create twin instances that use them.


```cmd
CreateModels Room Floor
```

> [!TIP]
> If you designed your own model earlier, you can also upload it here, by adding its file name (you can leave out the extensionn) to the `Room Floor` list in the command above.

Verify the models were created by running the `GetModels` command. This will query the Azure Digital Twins instance for all models that have been uploaded. Look for the edited *Room* model in the results:

:::image type="content" source="media/quickstart/output-list-models.png" alt-text="Results of listModels, showing the updated Room model":::

Keep the project console window running for the following steps.

### Create digital twins

Now that some models have been uploaded to your Azure Digital Twins instance, you can create [**digital twins**](concepts-twins-graph.md) based on the model definitions. Digital twins represent the entities within your business environment—things like sensors on a farm, rooms in a building, or lights in a car. 

To create a digital twin, you use the `CreateDigitalTwin` command. You must reference the model that the twin is based on, and can optionally define initial values for any properties in the model. You do not have to pass any relationship information at this stage.

Run this code in the running project console to create several twins based on the *Floor* and *Room* models. Recall that *Room* has three properties, so you can provide arguments with the initial values for these.

```cmd
CreateDigitalTwin dtmi:example:Floor;1 floor0
CreateDigitalTwin dtmi:example:Floor;1 floor1
CreateDigitalTwin dtmi:example:Room;2 room0 RoomName string Room0 CreateDigitalTwin double 70 HumidityLevel double 30
CreateDigitalTwin dtmi:example:Room;2 room1 RoomName string Room1 Temperature double 80 HumidityLevel double 60
```

> [!TIP]
> If you uploaded your own model earlier, try making your own `CreateDigitalTwin` command based on the commands above to add a twin of your own model type.

The output from these commands should indicate the twins were created successfully. 

:::image type="content" source="media/quickstart/output-add-twin.png" alt-text="Excerpt from the results of addTwin commands, showing floor0, floor1, room0, and room1":::

You can also verify that the twins were created by running the `Query` command. This command queries your Azure Digital Twins instance for all the digital twins it contains. Look for the *floor0*, *floor1*, *room0*, and *room1* twins in the results.

### Create a graph by adding relationships

Next, you can create some **relationships** between these twins, to connect them into a [**twin graph**](concepts-twins-graph.md). Twin graphs are used to represent an entire environment. 

To add a relationship, you use the `CreateEdge` command. Specify the twin that the relationship is coming from, the type of relationship to add, and the twin that the relationship is connecting to. Lastly, provide a name (ID) for the relationship.

Run the following code to add a "contains" relationship from *floor2* to each of the *Room* twins you created earlier. Note that there must be a *contains* relationship defined on the *Floor* model for this to be possible.

```cmd
CreateEdge floor0 contains room0 relationship0
CreateEdge floor1 contains room1 relationship1
```

The output from these commands shows information about the relationships being created:

:::image type="content" source="media/quickstart/output-add-edge.png" alt-text="Excerpt from the results of addEdge commands, showing relationship0 and relationship1":::

To verify the relationships were created successfully, use either of the following commands to query the relationships in your Azure Digital Twins instance.
* To see all relationships coming off of each floor,
    ```cmd
    GetEdges floor0
    GetEdges floor1
    ```
* To retrieve these relationships by ID, 
    ```csharp
    GetEdge floor0 contains relationship0
    GetEdge floor1 contains relationship1
    ```
* We can also find the incoming edges for twins. Try:

    ```bash
    GetIncomingEdges room0
    ```

    That returns the perspective from "the other side".

The twins and relationships you have set up in this quickstart form the following conceptual graph:

:::image type="content" source="media/quickstart/sample-graph.png" alt-text="A graph showing floor0 connected via relationship0 to room0, and floor1 connected via relationship1 to room1" border="false":::

## Query the twin graph to answer environment questions

A main feature of Azure Digital Twins is the ability to [query](concepts-query-language.md) your twin graph easily and efficiently to answer questions about your environment. Run the following commands in the running project console to get an idea of what this is like.

* **What are all the entities in my environment represented in Azure Digital Twins?** (query all)

    ```cmd
    Query
    ```

    This allows you to take stock of your environment at a glance, and make sure everything is represented as you'd like it to be within Azure Digital Twins. The result of this is an output containing each digital twin with its details.

    :::image type="content" source="media/quickstart/output-query-all.png" alt-text="Results of twin query, showing floor0, floor1, room0, and room1":::

    >[!NOTE]
    >Observe how `Query` without any additional arguments is the equivalent of `Query SELECT * FROM DIGITALTWINS`.

* **What are all the rooms in my environment?** (query by model)

    ```cmd
    Query SELECT * FROM DIGITALTWINS T WHERE IS_OF_MODEL(T, 'dtmi:example:Room;2')
    ```

    You can restrict your query to twins of a certain type, to get more specific information about what's represented. The result of this shows *room0* and *room1*, but does **not** show *floor0* or *floor1* (since they are floors, not rooms).
    
    :::image type="content" source="media/quickstart/output-query-model.png" alt-text="Results of model query, showing only room0 and room1":::

* **What are all the rooms on *floor0*?** (query by relationship)

    ```cmd
    Query SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0'
    ```

    You can query based on relationships in your graph, to get information about how twins are connected or to restrict your query to a certain area. Only *room0* is on *floor0*, so it's the only room in the result.

    :::image type="content" source="media/quickstart/output-query-relationship.png" alt-text="Results of relationship query, showing room0":::

* **What are all the twins in my environment with a temperature above 75?** (query by property)

    ```cmd
    Query SELECT * FROM DigitalTwins T WHERE T.Temperature > 75
    ```

    You can query the graph based on properties to answer a variety of questions, including finding outliers in your environment that might need attention. Other comparison operators (*<*,*>*, *=*, or *!=*) are also supported.

    :::image type="content" source="media/quickstart/output-query-property.png" alt-text="Results of property query, showing only room1":::

* **What are all the rooms on *floor0* with a temperature above 75?** (compound query)

    ```cmd
    Query SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0' AND IS_OF_MODEL(room, 'dtmi:example:Room;2') AND room.Temperature > 75
    ```

    You can also combine the earlier queries like you would in SQL, using combination operators such as `AND`, `OR`, `NOT`. This query uses `AND` to make the previous query about twin temperatures more specific. The result now only includes rooms with temperatures above 75 that are on *floor0*—which in this case, is none of them.

    :::image type="content" source="media/quickstart/output-query-compound.png" alt-text="Results of compound query, showing no results":::

### Modify a twin
Of course, we can also modify twin properties. Type this:

```bash
UpdateDigitalTwin room0 add /RoomName string PresidentialSuite
```

And to verify:
```bash
GetDigitalTwin room0
```

As you will see, the twin property data has been updated.

Note that the underlying REST API uses JSON patch to define updates to a twin. The command line tool reflects this format so that you can experiment with what the underlying APIs actually expect.

### Errors

The sample application also handles errors from the service. Try to upload the same model you uploaded in the beginning again:

```bash
CreateModels Room
```

As models cannot be overwritten, this will now return a service error:
```bash
Response 409: Service request failed.
Status: 409 (Conflict)

Content:
{"error":{"code":"DocumentAlreadyExists","message":"A document with same identifier already exists.","details":[]}}

Headers:
api-supported-versions: REDACTED
Date: Fri, 08 May 2020 01:53:52 GMT
Content-Length: 115
Content-Type: application/json; charset=utf-8
```

## Explore the commands - and explore the code

Please experiment with the commands and explore. Most importantly, look at the implementations of the commands and start tweaking and adding.

* The file Program.cs contains the authentication logic
* The file CommandLoop.cs contains all the interesting commands

Here is an example - creating a twin:
```csharp
Dictionary<string, object> meta = new Dictionary<string, object>()
{
    { "$model", model_id},
    { "$kind", "DigitalTwin" }
};
Dictionary<string, object> twinData = new Dictionary<string, object>()
{
    { "$metadata", meta },
};
try
{
    await client.CreateDigitalTwinAsync(twin_id, 
                    JsonConvert.SerializeObject(twinData));
    Log.Ok($"Twin '{twin_id}' created successfully!");
}
catch (RequestFailedException e)
{
    Log.Error($"Error {e.Status}: {e.Message}");
}
catch (Exception ex)
{
    Log.Error($"Error: {ex}");
}
```

In the next tutorial, we will use the sample command line tool as the centerpiece of an end to end application of Azure Digital Twins. 

## Clean up resources

The project in this tutorial forms the basis for the [Tutorial: Build an end-to-end solution](tutorial-end-to-end.md). Please keep the resources around if you plan to move on to that tutorial. 

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

> [!div class="nextstepaction"]
> [Tutorial: Build an end-to-end solution](tutorial-end-to-end.md)

Next, start looking at the concept documentation to learn more about elements you worked with in the tutorial:
* [Concepts: Twin models](concepts-models.md)

Or, go more in-depth on the processes in this tutorial by starting the how-to articles:
* [How-to: Use the Azure Digital Twins CLI](how-to-use-cli.md)