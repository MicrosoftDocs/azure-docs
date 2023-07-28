---
# Mandatory fields.
title: Manage the twin graph and relationships
titleSuffix: Azure Digital Twins
description: Learn how to manage a graph of digital twins by connecting them with relationships.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 05/15/2023
ms.topic: how-to
ms.service: digital-twins
ms.custom: engagement-fy23

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Manage a graph of digital twins using relationships

The heart of Azure Digital Twins is the [twin graph](concepts-twins-graph.md) representing your whole environment. The twin graph is made of individual digital twins connected via **relationships**. This article focuses on managing relationships and the graph as a whole; to work with individual digital twins, see [Manage digital twins](how-to-manage-twin.md).

Once you have a working [Azure Digital Twins instance](how-to-set-up-instance-portal.md) and have set up [authentication](how-to-authenticate-client.md) code in your client app, you can create, modify, and delete digital twins and their relationships in an Azure Digital Twins instance.

## Prerequisites

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

[!INCLUDE [digital-twins-developer-interfaces.md](../../includes/digital-twins-developer-interfaces.md)]

[!INCLUDE [visualizing with Azure Digital Twins explorer](../../includes/digital-twins-visualization.md)]

:::image type="content" source="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png" alt-text="Screenshot of Azure Digital Twins Explorer showing sample models and twins." lightbox="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png":::


## Create relationships

Relationships describe how different digital twins are connected to each other, which forms the basis of the twin graph.

The types of relationships that can be created from one (source) twin to another (target) twin are defined as part of the source twin's [DTDL model](concepts-models.md#relationships). You can create an instance of a relationship by using the `CreateOrReplaceRelationshipAsync()` SDK call with twins and relationship details that follow the DTDL definition. 

To create a relationship, you need to specify:
* The source twin ID (`srcId` in the code sample below): The ID of the twin where the relationship originates.
* The target twin ID (`targetId` in the code sample below): The ID of the twin where the relationship arrives.
* A relationship name (`relName` in the code sample below): The generic type of relationship, something like _contains_.
* A relationship ID (`relId` in the code sample below): The specific name for this relationship, something like _Relationship1_.

The relationship ID must be unique within the given source twin. It doesn't need to be globally unique.
For example, for the twin Foo, each specific relationship ID must be unique. However, another twin Bar can have an outgoing relationship that matches the same ID of a Foo relationship.

The following code sample illustrates how to create a relationship in your Azure Digital Twins instance. It uses the SDK call (highlighted) inside a custom method that might appear in the context of a larger program.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="CreateRelationshipMethod" highlight="13":::

This custom function can now be called to create a _contains_ relationship in the following way: 

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="UseCreateRelationship":::

If you wish to create multiple relationships, you can repeat calls to the same method, passing different relationship types into the argument. 

For more information on the helper class `BasicRelationship`, see [Azure Digital Twins APIs and SDKs](concepts-apis-sdks.md#serialization-helpers-in-the-net-c-sdk).

### Create multiple relationships between twins

Relationships can be classified as either: 

* Outgoing relationships: Relationships belonging to this twin that point outward to connect it to other twins. The `GetRelationshipsAsync()` method is used to get outgoing relationships of a twin.
* Incoming relationships: Relationships belonging to other twins that point towards this twin to create an "incoming" link. The `GetIncomingRelationshipsAsync()` method is used to get incoming relationships of a twin.

There's no restriction on the number of relationships that you can have between two twins—you can have as many relationships between twins as you like. 

This fact means that you can express several different types of relationships between two twins at once. For example, Twin A can have both a *stored* relationship and *manufactured* relationship with Twin B.

You can even create multiple instances of the same type of relationship between the same two twins, if you want. In this example, Twin A could have two different *stored* relationships with Twin B, as long as the relationships have different relationship IDs.

> [!NOTE]
> The DTDL attributes of `minMultiplicity` and `maxMultiplicity` for relationships aren't currently supported in Azure Digital Twins—even if they're defined as part of a model, they won't be enforced by the service. For more information, see [Service-specific DTDL notes](concepts-models.md#service-specific-dtdl-notes).

### Create relationships in bulk with the Jobs API

You can use the [Jobs API](concepts-apis-sdks.md#bulk-import-with-the-jobs-api) to create many relationships at once in a single API call. This method requires the use of [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md), as well as [write permissions](concepts-apis-sdks.md#check-permissions) in your Azure Digital Twins instance for relationships and bulk jobs.

>[!TIP]
>The Jobs API also allows models and twins to be imported in the same call, to create all parts of a graph at once. For more about this process, see [Upload models, twins, and relationships in bulk with the Jobs API](#upload-models-twins-and-relationships-in-bulk-with-the-jobs-api).

To import relationships in bulk, you'll need to structure your relationships (and any other resources included in the bulk import job) as an *NDJSON* file. The `Relationships` section comes after the `Twins` section, making it the last graph data section in the file. Relationships defined in the file can reference twins that are either defined in this file or already present in the instance, and they can optionally include initialization of any properties that the relationships have.

You can view an example import file and a sample project for creating these files in the [Jobs API introduction](concepts-apis-sdks.md#bulk-import-with-the-jobs-api).

[!INCLUDE [digital-twins-bulk-blob.md](../../includes/digital-twins-bulk-blob.md)]

Then, the file can be used in an [Jobs API](/rest/api/digital-twins/dataplane/jobs) call. You'll provide the blob storage URL of the input file, as well as a new blob storage URL to indicate where you'd like the output log to be stored when it's created by the service.

## List relationships

### List properties of a single relationship

You can always deserialize relationship data to a type of your choice. For basic access to a relationship, use the type `BasicRelationship`. The `BasicRelationship` helper class also gives you access to properties defined on the relationship, through an `IDictionary<string, object>`. To list properties, you can use:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_other.cs" id="ListRelationshipProperties":::

### List outgoing relationships from a digital twin

To access the list of **outgoing** relationships for a given twin in the graph, you can use the `GetRelationships()` method like this: 

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="GetRelationshipsCall":::

This method returns an `Azure.Pageable<T>` or `Azure.AsyncPageable<T>`, depending on whether you use the synchronous or asynchronous version of the call.

Here's an example that retrieves a list of relationships. It uses the SDK call (highlighted) inside a custom method that might appear in the context of a larger program.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="FindOutgoingRelationshipsMethod" highlight="8":::

You can now call this custom method to see the outgoing relationships of the twins like this:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="UseFindOutgoingRelationships":::

You can use the retrieved relationships to navigate to other twins in your graph by reading the `target` field from the relationship that is returned, and using it as the ID for your next call to `GetDigitalTwin()`.

### List incoming relationships to a digital twin

Azure Digital Twins also has an SDK call to find all **incoming** relationships to a given twin. This SDK is often useful for reverse navigation, or when deleting a twin.

>[!NOTE]
> `IncomingRelationship` calls don't return the full body of the relationship. For more information on the `IncomingRelationship` class, see its [reference documentation](/dotnet/api/azure.digitaltwins.core.incomingrelationship?view=azure-dotnet&preserve-view=true).

The code sample in the previous section focused on finding outgoing relationships from a twin. The following example is structured similarly, but finds *incoming* relationships to the twin instead. This example also uses the SDK call (highlighted) inside a custom method that might appear in the context of a larger program.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="FindIncomingRelationshipsMethod" highlight="8":::

You can now call this custom method to see the incoming relationships of the twins like this:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="UseFindIncomingRelationships":::

### List all twin properties and relationships

Using the above methods for listing outgoing and incoming relationships to a twin, you can create a method that prints full twin information, including the twin's properties and both types of its relationships. Here's an example custom method showing how to combine the above custom methods for this purpose.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="FetchAndPrintMethod":::

You can now call this custom function like this: 

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="UseFetchAndPrint":::

## Update relationships

Relationships are updated using the `UpdateRelationship` method. 

>[!NOTE]
>This method is for updating the **properties** of a relationship. If you need to change the source twin or target twin of the relationship, you'll need to [delete the relationship](#delete-relationships) and [re-create one](#create-relationships) using the new twins.

The required parameters for the client call are:
- The ID of the source twin (the twin where the relationship originates).
- The ID of the relationship to update.
- A [JSON Patch](http://jsonpatch.com/) document containing the properties and new values you want to update.

Here's a sample code snippet showing how to use this method. This example uses the SDK call (highlighted) inside a custom method that might appear in the context of a larger program.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="UpdateRelationshipMethod" highlight="6":::

Here's an example of a call to this custom method, passing in a JSON Patch document with the information to update a property.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="UseUpdateRelationship":::

## Delete relationships

The first parameter specifies the source twin (the twin where the relationship originates). The other parameter is the relationship ID. You need both the twin ID and the relationship ID, because relationship IDs are only unique within the scope of a twin.

Here's sample code showing how to use this method. This example uses the SDK call (highlighted) inside a custom method that might appear in the context of a larger program.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="DeleteRelationshipMethod" highlight="5":::

You can now call this custom method to delete a relationship like this:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs" id="UseDeleteRelationship":::

## Create multiple graph elements at once

This section describes strategies for creating a graph with multiple elements at the same time, rather than using individual API calls to upload models, twins, and relationships to upload them one by one.

### Upload models, twins, and relationships in bulk with the Jobs API

You can use the [Jobs API](concepts-apis-sdks.md#bulk-import-with-the-jobs-api) to upload multiple models, twins, and relationships to your instance in a single API call, effectively creating the graph all at once. This method requires the use of [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md), as well as [write permissions](concepts-apis-sdks.md#check-permissions) in your Azure Digital Twins instance for graph elements (models, twins, and relationships) and bulk jobs.

To import resources in bulk, start by creating an *NDJSON* file containing the details of your resources. The file starts with a `Header` section, followed by the optional sections `Models`, `Twins`, and `Relationships`. You don't have to include all three types of graph data in the file, but any sections that are present must follow that order. Twins defined in the file can reference models that are either defined in this file or already present in the instance, and they can optionally include initialization of the twin's properties. Relationships defined in the file can reference twins that are either defined in this file or already present in the instance, and they can optionally include initialization of relationship properties.

You can view an example import file and a sample project for creating these files in the [Jobs API introduction](concepts-apis-sdks.md#bulk-import-with-the-jobs-api).

[!INCLUDE [digital-twins-bulk-blob.md](../../includes/digital-twins-bulk-blob.md)]

Then, the file can be used in an [Jobs API](/rest/api/digital-twins/dataplane/jobs) call. You'll provide the blob storage URL of the input file, as well as a new blob storage URL to indicate where you'd like the output log to be stored when it's created by the service.

### Import graph with Azure Digital Twins Explorer

[Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md) is a visual tool for viewing and interacting with your twin graph. It contains a feature for importing a graph file in either JSON or Excel format that can contain multiple models, twins, and relationships.

For detailed information about using this feature, see [Import graph](how-to-use-azure-digital-twins-explorer.md#import-graph) in the Azure Digital Twins Explorer documentation.

### Create twins and relationships from a CSV file

Sometimes, you might need to create twin hierarchies out of data stored in a different database, or in a spreadsheet or a CSV file. This section illustrates how to read data from a CSV file and create a twin graph out of it.

Consider the following data table, describing a set of digital twins and relationships. The models referenced in this file must already exist in the Azure Digital Twins instance.

|  Model ID    | Twin ID (must be unique) | Relationship name  | Target twin ID  | Twin init data |
| --- | --- | --- | --- | --- |
| dtmi:example:Floor;1    | Floor1 | contains | Room1 | |
| dtmi:example:Floor;1    | Floor0 | contains | Room0 | |
| dtmi:example:Room;1    | Room1 | | | {"Temperature": 80} |
| dtmi:example:Room;1    | Room0 | | | {"Temperature": 70} |

One way to get this data into Azure Digital Twins is to convert the table to a CSV file. Once the table is converted, code can be written to interpret the file into commands to create twins and relationships. The following code sample illustrates reading the data from the CSV file and creating a twin graph in Azure Digital Twins.

In the code below, the CSV file is called *data.csv*, and there's a placeholder representing the **host name** of your Azure Digital Twins instance. The sample also makes use of several packages that you can add to your project to help with this process.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graphFromCSV.cs":::

## Runnable twin graph sample

The following runnable code snippet uses the relationship operations from this article to create a twin graph out of digital twins and relationships.

### Set up sample project files

The snippet uses two sample model definitions, [Room.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-samples/main/AdtSampleApp/SampleClientApp/Models/Room.json) and [Floor.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-samples/main/AdtSampleApp/SampleClientApp/Models/Floor.json). To **download the model files** so you can use them in your code, use these links to go directly to the files in GitHub. Then, right-click anywhere on the screen, select **Save as** in your browser's right-click menu, and use the Save As window to save the files as **Room.json** and **Floor.json**.

Next, create a **new console app project** in Visual Studio or your editor of choice.

Then, **copy the following code** of the runnable sample into your project:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_sample.cs":::

[!INCLUDE [Azure Digital Twins: DefaultAzureCredential known issue note](../../includes/digital-twins-defaultazurecredential-note.md)]

### Configure project

Next, complete the following steps to configure your project code:
1. Add the **Room.json** and **Floor.json** files you downloaded earlier to your project, and replace the `<path-to>` placeholders in the code to tell your program where to find them.
1. Replace the placeholder `<your-instance-hostname>` with your Azure Digital Twins instance's host name.
1. Add two dependencies to your project that will be needed to work with Azure Digital Twins. The first is the package for the [Azure Digital Twins SDK for .NET](/dotnet/api/overview/azure/digitaltwins.core-readme), and the second provides tools to help with authentication against Azure.

      ```cmd/sh
      dotnet add package Azure.DigitalTwins.Core
      dotnet add package Azure.Identity
      ```

You'll also need to set up local credentials if you want to run the sample directly. The next section walks through this process.
[!INCLUDE [Azure Digital Twins: local credentials prereq (outer)](../../includes/digital-twins-local-credentials-outer.md)]

### Run the sample

Now that you've completed setup, you can run the sample code project.

Here's the console output of the program: 

:::image type="content" source="./media/how-to-manage-graph/console-output-twin-graph.png" alt-text="Screenshot of the console output showing the twin details with incoming and outgoing relationships of the twins." lightbox="./media/how-to-manage-graph/console-output-twin-graph.png":::

> [!TIP]
> The twin graph is a concept of creating relationships between twins. If you want to view the visual representation of the twin graph, see the [Visualization](how-to-manage-graph.md#visualization) section of this article. 

## Next steps

Learn about querying an Azure Digital Twins twin graph:
* [Query language](concepts-query-language.md)
* [Query the twin graph](how-to-query-graph.md)