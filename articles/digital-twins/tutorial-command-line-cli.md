---
# Mandatory fields.
title: 'Tutorial: Create a graph in Azure Digital Twins (CLI)'
titleSuffix: Azure Digital Twins
description: Tutorial to build an Azure Digital Twins scenario using the Azure CLI
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/26/2021
ms.topic: tutorial
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Tutorial: Create an Azure Digital Twins graph using the Azure CLI

[!INCLUDE [digital-twins-tutorial-selector.md](../../includes/digital-twins-tutorial-selector.md)]

In this tutorial, you'll build a graph in Azure Digital Twins using models, twins, and relationships. The tool for this version of the tutorial is the [set of Azure Digital Twins commands for the **Azure CLI**](how-to-use-cli.md). 

You can use the CLI commands to perform essential Azure Digital Twins actions such as uploading models, creating and modifying twins, and creating relationships. You can also look at the [reference documentation for *az dt* command set](/cli/azure/ext/azure-iot/dt?preserve-view=true&view=azure-cli-latest) to see the full set of CLI commands.

In this tutorial, you will...
> [!div class="checklist"]
> * Model an environment
> * Create digital twins
> * Add relationships to form a graph
> * Query the graph to answer questions

## Prerequisites

To complete the steps in this tutorial, you'll need to first complete the following prerequisites.

### Download the sample models

The tutorial uses two pre-written models that are included with the C# sample project for Azure Digital Twins. The model files are located here: 
* [*Room.json*](https://github.com/Azure-Samples/digital-twins-samples/blob/master/AdtSampleApp/SampleClientApp/Models/Room.json)
* [*Floor.json*](https://github.com/azure-Samples/digital-twins-samples/blob/master/AdtSampleApp/SampleClientApp/Models/Floor.json)

To get the files on your machine, use the navigation links above and copy the file bodies into local files on your machine with the same names (*Room.json* and *Floor.json*).

### Prepare an Azure Digital Twins instance

[!INCLUDE [Azure Digital Twins: instance prereq](digital-twins-prereq-instance.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment-h3.md)]

### Set up Cloud Shell session
[!INCLUDE [Cloud Shell for Azure Digital Twins](../../includes/digital-twins-cloud-shell.md)]

## Model a physical environment with DTDL

Now that the CLI is set up for working with your Azure Digital Twins instance, you can begin setting up the graph scenario. 

The first step in creating an Azure Digital Twins solution is defining twin [**models**](concepts-models.md) for your environment. 

Models are similar to classes in object-oriented programming languages; they provide user-defined templates for [digital twins](concepts-twins-graph.md) to follow and instantiate later. They are written in a JSON-like language called **Digital Twins Definition Language (DTDL)**, and can define a twin's *properties*, *telemetry*, *relationships*, and *components*.

> [!NOTE]
> DTDL also allows for the definition of *commands* on digital twins. However, commands are not currently supported in the Azure Digital Twins service.

Navigate on your machine to the *Room.json* file that you created in the [Prerequisites](#prerequisites) section. Open it in a code editor, and change it in the following ways:

1. **Update the version number**, to indicate that you are providing a more-updated version of this model. Do this by changing the *1* at the end of the `@id` value to a *2*. Any number greater than the current version number will also work.
1. **Edit a property**. Change the name of the `Humidity` property to *HumidityLevel* (or something different if you'd like. If you use something different than *HumidityLevel*, remember what you used and continue using that instead of *HumidityLevel* throughout the tutorial).
1. **Add a property**. Underneath the `HumidityLevel` property that ends on line 15, paste the following code to add a `RoomName` property to the room:

    :::code language="json" source="~/digital-twins-docs-samples/models/Room.json" range="16-20":::

1. **Add a relationship**. Underneath the `RoomName` property that you just added, paste the following code to add the ability for this type of twin to form *contains* relationships with other twins:

    :::code language="json" source="~/digital-twins-docs-samples/models/Room.json" range="21-24":::

When you are finished, the updated model should match this:

:::code language="json" source="~/digital-twins-docs-samples/models/Room.json":::

Make sure to save the file before moving on.

> [!TIP]
> If you want to try creating your own model, you can paste the *Room* model code into a new file that you save with a *.json* extension. Then, play around with adding properties and relationships to represent whatever you'd like. You can also look at more sample models in the [Azure Digital Twins end-to-end samples](https://github.com/Azure-Samples/digital-twins-samples/tree/master/AdtSampleApp/SampleClientApp/Models) repository for ideas.

> [!TIP] 
> There is a language-agnostic [DTDL Validator sample](/samples/azure-samples/dtdl-validator/dtdl-validator) that you can use to check model documents to make sure the DTDL is valid. It is built on the DTDL parser library, which you can read more about in [*How-to: Parse and validate models*](how-to-parse-models.md).

### Upload models to Azure Digital Twins

After designing models, you need to upload them to your Azure Digital Twins instance. This configures your Azure Digital Twins service instance with your own custom domain vocabulary. Once you have uploaded the models, you can create twin instances that use them.

1. To add models using Cloud Shell, you'll need to upload your model files to Cloud Shell's storage so the files will be available when you run the Cloud Shell command that uses them. To do this, select the "Upload/Download files" icon and choose "Upload".

    :::image type="content" source="media/how-to-set-up-instance/cloud-shell/cloud-shell-upload.png" alt-text="Cloud Shell window showing selection of the Upload icon":::
    
    Navigate to the *Room.json* file on your machine and select "Open." Then, repeat this step for *Floor.json*.

1. Next, use the [**az dt model create**](/cli/azure/ext/azure-iot/dt/model?view=azure-cli-latest#ext_azure_iot_az_dt_model_create) command as shown below to upload your updated *Room* model to your Azure Digital Twins instance. There is also a command to upload a *Floor* model that you'll also use in the next section to create different types of twins.

    ```azurecli-interactive
    az dt model create -n <ADT_instance_name> --models Room.json
    az dt model create -n <ADT_instance_name> --models Floor.json
    ```
    
    The output from each command will show information about the successfully created model.
    
    > [!TIP]
    > If you designed your own model earlier, you can also upload it here, by adding its file path to the `models` list in the command above.

1. Verify the models were created with the [**az dt model list**](https://docs.microsoft.com/en-us/cli/azure/ext/azure-iot/dt/model?view=azure-cli-latest#ext_azure_iot_az_dt_model_list) command as shown below. This will print a list of all models that have been uploaded to the Azure Digital Twins instance, and print out their full information. 

    ```azurecli-interactive
    az dt model list -n <ADT_instance_name> --definition
    ```
    
    Look for the edited *Room* model in the results:
    
    :::image type="content" source="media/tutorial-command-line/cli/output-get-models.png" alt-text="Results of the model list command, showing the updated Room model":::

### Errors

The CLI also handles errors from the service. 

Re-run the `az dt model create` command to try re-uploading one of the same models you just uploaded, for a second time:

```azurecli-interactive
az dt model create -n <ADT_instance_name> --models Room.json
```

As models cannot be overwritten, this will now return an error code of `ModelIdAlreadyExists`.

## Create digital twins

Now that some models have been uploaded to your Azure Digital Twins instance, you can create [**digital twins**](concepts-twins-graph.md) based on the model definitions. Digital twins represent the entities within your business environment—things like sensors on a farm, rooms in a building, or lights in a car. 

To create a digital twin, you use the [**az dt twin create**](/cli/azure/ext/azure-iot/dt/twin?view=azure-cli-latest#ext_azure_iot_az_dt_twin_create) command. You must reference the model that the twin is based on, and can optionally define initial values for any properties in the model. You do not have to pass any relationship information at this stage.

1. Run this code in the Cloud Shell to create several twins, based on the *Room* model you updated earlier and another model, *Floor*. Recall that *Room* has three properties, so you can provide arguments with the initial values for these.

    ```azurecli-interactive
    az dt twin create -n <ADT_instance_name> --dtmi "dtmi:example:Room;2" --twin-id room0 --properties '{"RoomName":"Room0", "Temperature":70, "HumidityLevel":30}'
    az dt twin create -n <ADT_instance_name> --dtmi "dtmi:example:Room;2" --twin-id room1 --properties '{"RoomName":"Room1", "Temperature":"80", "HumidityLevel":"60"}'
    az dt twin create -n <ADT_instance_name> --dtmi "dtmi:example:Floor;1" --twin-id floor0
    az dt twin create -n <ADT_instance_name> --dtmi "dtmi:example:Floor;1" --twin-id floor1
    ```

    >[!NOTE]
    > If you are using Cloud Shell in the PowerShell environment, you may need to escape the quotation mark characters in order for the `--properties` JSON to be parsed correctly. With this edit, the commands to create the room twins look like this:
    >
    > ```azurecli-interactive
    > az dt twin create -n <ADT_instance_name> --dtmi "dtmi:example:Room;2" --twin-id room0 --properties '{\"RoomName\":\"Room0\", \"Temperature\":70, \"HumidityLevel\":30}'
    > az dt twin create -n <ADT_instance_name> --dtmi "dtmi:example:Room;2" --twin-id room1 --properties '{\"RoomName\":\"Room1\", \"Temperature\":80, \"HumidityLevel\":60}'
    > ```
    
    The output from each command will show information about the successfully created twin (including properties for the room twins that were initialized with them).

1. You can verify that the twins were created with the [**az dt twin query**](/cli/azure/ext/azure-iot/dt/twin?view=azure-cli-latest#ext_azure_iot_az_dt_twin_query) command as shown below. The query used below finds all the digital twins contained in your Azure Digital Twins instance.
    
    ```azurecli-interactive
    az dt twin query -n <ADT_instance_name> -q "SELECT * FROM DIGITALTWINS"
    ```
    
    Look for the *room0*, *room1*, *floor0*, and *floor1* twins in the results. Here is an excerpt showing part of the result of this query.
    
    :::image type="content" source="media/tutorial-command-line/cli/output-query-all.png" alt-text="Partial results of twin query, showing room0 and room1":::

> [!TIP]
> If you uploaded your own model earlier, try making your own `az dt twin create` command based on the commands above to add a twin of your own model type.

### Modify a digital twin

You can also modify the properties of a twin you've created. 

1. Run this [**az dt twin update**](/cli/azure/ext/azure-iot/dt/twin?view=azure-cli-latest#ext_azure_iot_az_dt_twin_update) command to change *room0*'s RoomName from *Room0* to *PresidentialSuite*:

    ```azurecli-interactive
    az dt twin update -n <ADT_instance_name> --twin-id room0 --json-patch '{"op":"add", "path":"/RoomName", "value": "PresidentialSuite"}'
    ```
    
    >[!NOTE]
    > If you are using Cloud Shell in the PowerShell environment, you may need to escape the quotation mark characters in order for the `--properties` JSON to be parsed correctly. With this edit, the command to update twin looks like this:
    >
    > ```azurecli-interactive
    > az dt twin update -n <ADT_instance_name> --twin-id room0 --json-patch '{\"op\":\"add\", \"path\":\"/RoomName\", \"value\": \"PresidentialSuite\"}'
    > ```
    
    The output from this command will show the twin's current information, and you should see the new value for the `RoomName` in the result.

    :::image type="content" source="media/tutorial-command-line/cli/output-update-twin.png" alt-text="Results of the update command, showing a RoomName of PresidentialSuite":::

1. You can verify by running the [**az dt twin show**](/cli/azure/ext/azure-iot/dt/twin?view=azure-cli-latest#ext_azure_iot_az_dt_twin_show) command to see *room0*'s information:

    ```azurecli-interactive
    az dt twin show -n <ADT_instance_name> --twin-id room0
    ```
    
    The output should reflect the updated name.

## Create a graph by adding relationships

Next, you can create some **relationships** between these twins, to connect them into a [**twin graph**](concepts-twins-graph.md). Twin graphs are used to represent an entire environment. 

To add a relationship, use the [**az dt twin relationship create**](/cli/azure/ext/azure-iot/dt/twin/relationship?view=azure-cli-latest#ext_azure_iot_az_dt_twin_relationship_create) command. Specify the twin that the relationship is coming from, the type of relationship to add, and the twin that the relationship is connecting to. Lastly, provide a name (ID) for the relationship.

1. Run the following code to add a "contains" relationship from each of the *Floor* twins you created earlier to a corresponding *Room* twin. Note that there must be a *contains* relationship defined on the *Floor* model for this to be possible.

    ```azurecli-interactive
    az dt twin relationship create -n <ADT_instance_name> --relationship-id relationship0 --relationship contains --twin-id floor0 --target room0
    az dt twin relationship create -n <ADT_instance_name> --relationship-id relationship1 --relationship contains --twin-id floor1 --target room1
    ```
    
    The output from each command will show information about the successfully created relationship.

1. You can verify the relationships with any of the following commands, which query the relationships in your Azure Digital Twins instance.
    * To see all relationships coming off of each floor (viewing the relationships from one side):
        ```azurecli-interactive
        az dt twin relationship list -n <ADT_instance_name> --twin-id floor0
        az dt twin relationship list -n <ADT_instance_name> --twin-id floor1
        ```
    * To see all relationships arriving at each room (viewing the relationship from the "other" side):
        ```azurecli-interactive
        az dt twin relationship list -n <ADT_instance_name> --twin-id room0 --incoming
        az dt twin relationship list -n <ADT_instance_name> --twin-id room1 --incoming
        ```
    * To look for these relationships individually, by name:
        ```azurecli-interactive
        az dt twin relationship show -n <ADT_instance_name> --twin-id floor0 --relationship-id relationship0
        az dt twin relationship show -n <ADT_instance_name> --twin-id floor1 --relationship-id relationship1
        ```

The twins and relationships you have set up in this tutorial form the following conceptual graph:

:::image type="content" source="media/tutorial-command-line/app/sample-graph.png" alt-text="A graph showing floor0 connected via relationship0 to room0, and floor1 connected via relationship1 to room1" border="false":::

## Query the twin graph to answer environment questions

A main feature of Azure Digital Twins is the ability to [query](concepts-query-language.md) your twin graph easily and efficiently to answer questions about your environment. In the Azure CLI, this is done with the [**az dt twin query**](/cli/azure/ext/azure-iot/dt/twin?view=azure-cli-latest#ext_azure_iot_az_dt_twin_query) command.

Run the following queries in the Cloud Shell to get an idea of what this is like.

1. **What are all the entities in my environment represented in Azure Digital Twins?** (query all)

    ```azurecli-interactive
    az dt twin query -n <ADT_instance_name> -q "SELECT * FROM DIGITALTWINS"
    ```

    This allows you to take stock of your environment at a glance, and make sure everything is represented as you'd like it to be within Azure Digital Twins. The result of this is an output containing each digital twin with its details. Here is an excerpt:

    :::image type="content" source="media/tutorial-command-line/cli/output-query-all.png" alt-text="Partial results of twin query, showing room0 and room1":::

    >[!NOTE]
    >You may recognize that this is the same command you used in the [*Create digital twins*](#create-digital-twins) section earlier to find all the Azure Digital Twins in the instance.

1. **What are all the rooms in my environment?** (query by model)

    ```azurecli-interactive
    az dt twin query -n <ADT_instance_name> -q "SELECT * FROM DIGITALTWINS T WHERE IS_OF_MODEL(T, 'dtmi:example:Room;2')"
    ```

    You can restrict your query to twins of a certain type, to get more specific information about what's represented. The result of this shows *room0* and *room1*, but does **not** show *floor0* or *floor1* (since they are floors, not rooms).
    
    :::image type="content" source="media/tutorial-command-line/cli/output-query-model.png" alt-text="Results of model query, showing only room0 and room1":::

1. **What are all the rooms on *floor0*?** (query by relationship)

    ```azurecli-interactive
    az dt twin query -n <ADT_instance_name> -q "SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0'"
    ```

    You can query based on relationships in your graph, to get information about how twins are connected or to restrict your query to a certain area. Only *room0* is on *floor0*, so it's the only room in the result.

    :::image type="content" source="media/tutorial-command-line/cli/output-query-relationship.png" alt-text="Results of relationship query, showing room0":::

1. **What are all the twins in my environment with a temperature above 75?** (query by property)

    ```azurecli-interactive
    az dt twin query -n <ADT_instance_name> -q "SELECT * FROM DigitalTwins T WHERE T.Temperature > 75"
    ```

    You can query the graph based on properties to answer a variety of questions, including finding outliers in your environment that might need attention. Other comparison operators (*<*,*>*, *=*, or *!=*) are also supported. *room1* shows up in the results here, because it has a temperature of 80.

    :::image type="content" source="media/tutorial-command-line/cli/output-query-property.png" alt-text="Results of property query, showing only room1":::

1. **What are all the rooms on *floor0* with a temperature above 75?** (compound query)

    ```azurecli-interactive
    az dt twin query -n <ADT_instance_name> -q "SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor0' AND IS_OF_MODEL(room, 'dtmi:example:Room;2') AND room.Temperature > 75"
    ```

    You can also combine the earlier queries like you would in SQL, using combination operators such as `AND`, `OR`, `NOT`. This query uses `AND` to make the previous query about twin temperatures more specific. The result now only includes rooms with temperatures above 75 that are on *floor0*—which in this case, is none of them. The result set is empty.

    :::image type="content" source="media/tutorial-command-line/cli/output-query-compound.png" alt-text="Results of compound query, showing no results":::

## Clean up resources

After completing this tutorial, you can choose which resources you'd like to remove, depending on what you'd like to do next.

* **If you plan to continue to the next tutorial**, you can keep the resources you set up here and reuse the Azure Digital Twins instance without clearing anything in between.

* **If you'd like to continue using the Azure Digital Twins instance, but clear out all of its models, twins, and relationships**, you can use the [**az dt twin relationship delete**](/cli/azure/ext/azure-iot/dt/twin/relationship?view=azure-cli-latest#ext_azure_iot_az_dt_twin_relationship_delete), [**az dt twin delete**](/cli/azure/ext/azure-iot/dt/twin?view=azure-cli-latest#ext_azure_iot_az_dt_twin_delete), and [**az dt model delete**](/cli/azure/ext/azure-iot/dt/model?view=azure-cli-latest#ext_azure_iot_az_dt_model_delete) commands to clear the relationships, twins, and models in your instance, respectively. This will give you a clean slate for the next tutorial.

[!INCLUDE [digital-twins-cleanup-basic.md](../../includes/digital-twins-cleanup-basic.md)]

You may also want to delete the model files you created on your local machine.

## Next steps 

In this tutorial, you got started with Azure Digital Twins by building a graph in your instance using the Azure CLI. You created models, digital twins, and relationships to form a graph. You also ran some queries on the graph, to get an idea of what kinds of questions Azure Digital Twins can answer about an environment.

Continue to the next tutorial to combine Azure Digital Twins with other Azure services to complete a data-driven, end-to-end scenario:
> [!div class="nextstepaction"]
> [*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md)