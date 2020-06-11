---
# Mandatory fields.
title: Manage a twin model
titleSuffix: Azure Digital Twins
description: See how to create, edit, and delete a model within Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: how-to
ms.service: digital-twins
ROBOTS: NOINDEX, NOFOLLOW

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Manage Azure Digital Twins models

[!INCLUDE [Azure Digital Twins current preview status](../../includes/digital-twins-preview-status.md)]

You can manage the [models](concepts-models.md) that your Azure Digital Twins instance knows about using the [**DigitalTwinsModels APIs**](how-to-use-apis-sdks.md), the [.NET (C#) SDK](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core), or the [Azure Digital Twins CLI](how-to-use-cli.md). 

Management operations include upload, validation, retrieval, and deletion of models. 

## Create models

Models for Azure Digital Twins are written in DTDL, and saved as *.json* files. There is also a [DTDL extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-dtdl) available for [Visual Studio Code](https://code.visualstudio.com/), which provides syntax validation and other features to facilitate writing DTDL documents.

Consider an example in which a hospital wants to digitally represent their rooms. Each room contains a smart soap dispenser for monitoring hand-washing, and sensors to monitor traffic through the room.

The first step towards the solution is to create models to represent aspects of the hospital. A patient room in this scenario might be described like this:

```json
{
  "@id": "dtmi:com:contoso:PatientRoom;1",
  "@type": "Interface",
  "@context": "dtmi:dtdl:context;2",
  "displayName": "Patient Room",
  "contents": [
    {
      "@type": "Property",
      "name": "visitorCount",
      "schema": "double"
    },
    {
      "@type": "Property",
      "name": "handWashCount",
      "schema": "double"
    },
    {
      "@type": "Property",
      "name": "handWashPercentage",
      "schema": "double"
    },
    {
      "@type": "Relationship",
      "name": "hasDevices"
    }
  ]
}
```

> [!NOTE]
> This is a sample body for a .json file in which a model is defined and saved, to be uploaded as part of a client project. The REST API call, on the other hand, takes an array of model definitions like the one above (which is mapped to a `IEnumerable<string>` in the .NET SDK). So to use this model in the REST API directly, surround it with brackets.

This model defines a name and a unique ID for the patient room, and properties to represent visitor count and hand-wash status (these counters will be updated from motion sensors and smart soap dispensers, and will be used together to calculate a *handwash percentage* property). The model also defines a relationship *hasDevices*, which will be used to connect any [digital twins](concepts-twins-graph.md) based on this *Room* model to the actual devices.

Following this method, you can go on to define models for the hospital's wards, zones, or the hospital itself.

> [!TIP]
> There is a client-side library available for parsing and validating DTDL. It generates a C# object model of the DTDL content, which can be used in model-driven development scenarios, like generating UI elements. You can also use this library to make sure your models have no syntax errors before you upload them. For more information about this library and access to a sample built on it for a DTDL Validator, see [How-to: Parse and validate models](how-to-use-parser.md).

## Manage models with APIs.

The following sections show how to complete different model management operations using the [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md).

> [!NOTE]
> The examples below do not include error handling for brevity. However, it's strongly recommended within your projects to wrap service calls in try/catch blocks.

> [!TIP] 
> Remember that all SDK methods come in synchronous and asynchronous versions. For paging calls, the async methods return `AsyncPageable<T>` while the synchronous versions return `Pageable<T>`.

### Upload models

Once models are created, you can upload them to the Azure Digital Twins instance.

Here is a code snippet showing how to do this:

```csharp
// 'client' is an instance of DigitalTwinsClient
// Read model file into string (not part of SDK)
StreamReader r = new StreamReader("MyModelFile.json");
string dtdl = r.ReadToEnd(); r.Close();
string[] dtdls = new string[] { dtdl };
client.CreateModels(dtdls);
```

Observe that the `CreateModels` method accepts multiple files in one single transaction. Here's a sample to illustrate:

```csharp
var dtdlFiles = Directory.EnumerateFiles(sourceDirectory, "*.json");

List<string> dtdlStrings = new List<string>();
foreach (string fileName in dtdlFiles)
{
    // Read model file into string (not part of SDK)
    StreamReader r = new StreamReader(fileName);
    string dtdl = r.ReadToEnd(); r.Close();
    dtdlStrings.Add(dtdl);
}
client.CreateModels(dtdlStrings);
```

Model files can contain more than a single model. In this case, the models need to be placed in a JSON array. For example:

```json
[
  {
    "@id": "dtmi:com:contoso:Planet",
    "@type": "Interface",
    //...
  },
  {
    "@id": "dtmi:com:contoso:Moon",
    "@type": "Interface",
    //...
  }
]
```
 
On upload, model files are validated.

> [!TIP] 
> Note that you can also use the [DTDL client-side parser library](how-to-use-parser.md) to validate models on the client side.

### Retrieve models

You can list and retrieve models stored on your Azure Digital Twins instance. 

Here are your options for this:
* Retrieve all models
* Retrieve a single model
* Retrieve a single model with dependencies
* Retrieve metadata for models

Here are some example calls:

```csharp
// 'client' is a valid DigitalTwinsClient object

// Get a single model, metadata and data
ModelData md1 = client.GetModel(id);

// Get a list of the metadata of all available models
Pageable<ModelData> pmd2 = client.GetModels();

// Get a list of metadata and full model definitions
Pageable<ModelData> pmd3 = client.GetModels(null, true);

// Get models and metadata for a model ID, including all dependencies (models that it inherits from, components it references)
Pageable<ModelData> pmd4 = client.GetModels(new string[] { modelId }, true);
```

The API calls to retrieve models all return `ModelData` objects. `ModelData` contains metadata about the model stored in the Azure Digital Twins instance, such as name, DTMI, and creation date of the model. The `ModelData` object also optionally includes the model itself. Depending on parameters, you can thus use the retrieve calls to either retrieve just metadata (which is useful in scenarios where you want to display a UI list of available tools, for example), or the entire model.

The `RetrieveModelWithDependencies` call returns not only the requested model, but also all models that the requested model depends on.

Models are not necessarily returned in exactly the document form they were uploaded in. Azure Digital Twins only guarantees that the return form will be semantically equivalent. 

### Remove models

Models can also be removed from the service, in one of two ways:
* **Decommissioning** : Once a model is decommissioned, you can no longer use it to create new digital twins. Existing digital twins that already use this model aren't affected, so you can still update them with things like property changes and adding or deleting relationships.
* **Deletion** : This will completely remove the model from the solution. Any twins that were using this model are no longer associated with any valid model, so they're treated as though they don't have a model at all. You can still read these twins, but won't be able to make any updates on them until they're reassigned to a different model.

These are separate features and they do not impact each other, although they may be used together to remove a model gradually. 

### Decommissioning

Here is the code to decommission a model:

```csharp
// 'client' is a valid DigitalTwinsClient  
client.DecommissionModel(dtmiOfPlanetInterface);
// Write some code that deletes or transitions digital twins
//...
```

A model's decommissioning status is included in the `ModelData` records returned by the model retrieval APIs.

#### Deletion

You can delete all models in your instance at once, or you can do it on an individual basis.

For an example of how to delete all models, download the sample app used in the [Tutorial: Explore the basics with a sample client app](tutorial-command-line-app.md). The *CommandLoop.cs* file does this in a `CommandDeleteAllModels` function.

The rest of this section breaks down model deletion into closer detail, and shows how to do it for an individual model.

##### Before deletion: Deletion requirements

Generally, models can be deleted at any time.

The exception is models that other models depend on, either with an `extends` relationship or as a component. For example, if a *ConferenceRoom* model extends a *Room* model, and has a *ACUnit* model as a component, you cannot delete *Room* or *ACUnit* until *ConferenceRoom* removes those respective references. 

You can do this by updating the dependent model to remove the dependencies, or deleting the dependent model completely.

##### During deletion: Deletion process

Even if a model meets the requirements to delete it immediately, you may want to go through a few steps first to avoid unintended consequences for the twins left behind. Here are some steps that can help you manage the process:
1. First, decommission the model
2. Wait a few minutes, to make sure the service has processed any last-minute twin creation requests sent before the decommission
3. Query twins by model to see all twins that are using the now-decommissioned model
4. Delete the twins if you no longer need them, or patch them to a new model if needed. You can also choose to leave them alone, in which case they will become twins without models once the model is deleted. See the next section for the implications of this state.
5. Wait for another few minutes to make sure the changes have percolated through
6. Delete the model 

To delete a model, use this call:
```csharp
// 'client' is a valid DigitalTwinsClient
await client.DeleteModelAsync(IDToDelete);
```

##### After deletion: Twins without models

Once a model is deleted, any digital twins that were using the model are now considered to be without a model. Note that there is no query that can give you a list of all the twins in this state—although you *can* still query the twins by the deleted model to know what twins are affected.

Here is an overview of what you can and cannot do with twins that don't have a model.

Things you **can** do:
* Query the twin
* Read properties
* Read outgoing relationships
* Add and delete incoming relationships (as in, other twins can still form relationships *to* this twin)
  - The `target` in the relationship definition can still reflect the DTMI of the deleted model. A relationship with no defined target can also work here.
* Delete relationships
* Delete the twin

Things you **can't** do:
* Edit outgoing relationships (as in, relationships *from* this twin to other twins)
* Edit properties

##### After deletion: Re-uploading a model

After a model has been deleted, you may decide later to upload a new model with the same ID as the one you deleted. Here's what happens in that case.
* From the solution store's perspective, this is the same as uploading a completely new model. The service doesn't remember the old one was ever uploaded.   
* If there are any remaining twins in the graph referencing the deleted model, they are no longer orphaned; this model ID is valid again with the new definition. However, if the new definition for the model is different than the model definition that was deleted, these twins may have properties and relationships that match the deleted definition and are not valid with the new one.

Azure Digital Twins does not prevent this state, so be careful to patch twins appropriately in order to make sure they remain valid through the model definition switch.

## Manage models with CLI

Models can also be managed using the Azure Digital Twins CLI. The commands can be found in [How-to: Use the Azure Digital Twins CLI](how-to-use-cli.md).

## Next steps

See how to create and manage digital twins based on your models:
* [How-to: Manage a digital twin](how-to-manage-twin.md)