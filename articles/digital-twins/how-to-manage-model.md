---
# Mandatory fields.
title: Manage DTDL models
titleSuffix: Azure Digital Twins
description: Learn how to manage DTDL models within Azure Digital Twins, including how to create, edit, and delete them.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 06/29/2023
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Manage Azure Digital Twins models

This article describes how to manage the [models](concepts-models.md) in your Azure Digital Twins instance. Management operations include upload, validation, retrieval, and deletion of models. 

## Prerequisites

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

[!INCLUDE [digital-twins-developer-interfaces.md](../../includes/digital-twins-developer-interfaces.md)]

[!INCLUDE [visualizing with Azure Digital Twins explorer](../../includes/digital-twins-visualization.md)]

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/model-graph-panel.png" alt-text="Screenshot of Azure Digital Twins Explorer showing a sample model graph." lightbox="media/how-to-use-azure-digital-twins-explorer/model-graph-panel.png":::

## Create models

You can create your own models from scratch, or use existing ontologies that are available for your industry.

### Author models

Models for Azure Digital Twins are written in DTDL, and saved as JSON files. There's also a [DTDL extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-dtdl) available for [Visual Studio Code](https://code.visualstudio.com/), which provides syntax validation and other features to make it easier to write DTDL documents.

Consider an example in which a hospital wants to digitally represent their rooms. Each room contains a smart soap dispenser for monitoring hand-washing, and sensors to monitor traffic through the room.

The first step towards the solution is to create models to represent aspects of the hospital. A patient room in this scenario might be described like this:

:::code language="json" source="~/digital-twins-docs-samples/models/PatientRoom.json":::

> [!NOTE]
> This is a sample body for a JSON file in which a model is defined and saved, to be uploaded as part of a client project. The REST API call, on the other hand, takes an array of model definitions like the one above (which is mapped to a `IEnumerable<string>` in the .NET SDK). So to use this model in the REST API directly, surround it with brackets.

This model defines a name and a unique ID for the patient room, and properties to represent visitor count and hand-wash status. These counters will be updated from motion sensors and smart soap dispensers, and will be used together to calculate a `handwash percentage` property. The model also defines a relationship `hasDevices`, which will be used to connect any [digital twins](concepts-twins-graph.md) based on this Room model to the actual devices.

> [!NOTE]
> There are some DTDL features that Azure Digital Twins doesn't currently support, including the `writable` attribute on properties and relationships, and `minMultiplicity` and `maxMultiplicity` for relationships. For more information, see [Service-specific DTDL notes](concepts-models.md#service-specific-dtdl-notes).

Following this method, you can define models for the hospital's wards, zones, or the hospital itself. 

If your goal is to build a comprehensive model set that describes your industry domain, consider whether there's an existing industry ontology that you can use to make model authoring easier. The next section describes industry ontologies in more detail.

### Use existing industry-standard ontologies

An *ontology* is a set of models that comprehensively describe a given domain, like manufacturing, building structures, IoT systems, smart cities, energy grids, web content, and more.

If your solution is for a certain industry that uses any sort of modeling standard, consider starting with a pre-existing set of models designed for your industry instead of designing your models from scratch. Microsoft has partnered with domain experts to create DTDL model ontologies based on industry standards, to help minimize reinvention and encourage consistency and simplicity across industry solutions. You can read more about these ontologies, including how to use them and what ontologies are available now, in [What is an ontology?](concepts-ontologies.md).

### Validate syntax

[!INCLUDE [Azure Digital Twins: validate models info](../../includes/digital-twins-validate.md)]

## Upload models

Once models are created, you can upload them to the Azure Digital Twins instance.

When you're ready to upload a model, you can use the following code snippet for the [.NET SDK](/dotnet/api/overview/azure/digitaltwins.core-readme):

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/model_operations.cs" id="CreateModel":::

On upload, model files are validated by the service.

You'll usually need to upload more than one model to the service. There are several ways that you can upload many models at once in a single transaction. To help you pick a strategy, consider the size of your model set as you continue through the rest of this section. 

### Upload small model sets

For smaller model sets, you can upload multiple models at once using individual API calls. You can check the current limit for how many models can be uploaded in a single API call in the [Azure Digital Twins limits](reference-service-limits.md).

If you're using the SDK, you can upload multiple model files with the `CreateModels` method like this:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/model_operations.cs" id="CreateModels_multi":::

If you're using the [REST APIs](/rest/api/azure-digitaltwins/) or [Azure CLI](/cli/azure/dt), you can upload multiple models by placing multiple model definitions in a single JSON file to be uploaded together. In this case, the models should be placed in a JSON array within the file, like in the following example:

:::code language="json" source="~/digital-twins-docs-samples/models/Planet-Moon.json":::

### Upload large model sets with the Jobs API

For large model sets, you can use the [Jobs API](concepts-apis-sdks.md#bulk-import-with-the-jobs-api) to upload many models at once in a single API call. The API can simultaneously accept up to the [Azure Digital Twins limit for number of models in an instance](reference-service-limits.md), and it automatically reorders models if needed to resolve dependencies between them. This method requires the use of [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md), as well as [write permissions](concepts-apis-sdks.md#check-permissions) in your Azure Digital Twins instance for models and bulk jobs.

>[!TIP]
>The Jobs API also allows twins and relationships to be imported in the same call, to create all parts of a graph at once. For more about this process, see [Upload models, twins, and relationships in bulk with the Jobs API](how-to-manage-graph.md#upload-models-twins-and-relationships-in-bulk-with-the-jobs-api).

To import models in bulk, you'll need to structure your models (and any other resources included in the bulk import job) as an *NDJSON* file. The `Models` section comes immediately after `Header` section, making it the first graph data section in the file. You can view an example import file and a sample project for creating these files in the [Jobs API introduction](concepts-apis-sdks.md#bulk-import-with-the-jobs-api).

[!INCLUDE [digital-twins-bulk-blob.md](../../includes/digital-twins-bulk-blob.md)]

Then, the file can be used in an [Jobs API](/rest/api/digital-twins/dataplane/jobs) call. You'll provide the blob storage URL of the input file, as well as a new blob storage URL to indicate where you'd like the output log to be stored when it's created by the service.

## Retrieve models

You can list and retrieve models stored on your Azure Digital Twins instance. 

Your options include:
* Retrieve a single model
* Retrieve all models
* Retrieve metadata and dependencies for models

Here are some example calls:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/model_operations.cs" id="GetModels":::

The SDK calls to retrieve models all return `DigitalTwinsModelData` objects. `DigitalTwinsModelData` contains metadata about the model stored in the Azure Digital Twins instance, such as name, DTMI, and creation date of the model. The `DigitalTwinsModelData` object also optionally includes the model itself. Meaning that, depending on parameters, you can use the retrieve calls to either retrieve just metadata (which is useful in scenarios where you want to display a UI list of available tools, for example), or the entire model.

The `RetrieveModelWithDependencies` call returns not only the requested model, but also all models that the requested model depends on.

Models aren't necessarily returned in exactly the document form they were uploaded in. Azure Digital Twins only guarantees that the return form will be semantically equivalent. 

## Update models

This section describes considerations and strategies for updating your models.

### Before updating: Think in the context of your entire solution

Before making updates to your models, it's recommended to think holistically about your entire solution and the impact of the model changes you're about to make. Models in an Azure Digital Twins solution are often interconnected, so it's important to be aware of cascading changes where updating one model requires updating several others. Updating models will impact the twins that use the models, and can also affect ingress and processing code, client applications, and automated reports.

Here are some recommendations to help you manage your model transitions smoothly:
* Instead of thinking of models as separate entities, consider evolving your entire model set when appropriate to keep models and their relationships up-to-date together.
* Treat models like source code and manage them in source control. Apply the same rigor and attention to models and model changes that you apply to other code in your solution.

When you're ready to continue with the process of updating your models, the rest of this section describes the strategies you can use to implement the updates.

### Strategies for updating models

Once a model is uploaded to your Azure Digital Twins instance, the model interface is immutable, which means there's no traditional "editing" of models. Azure Digital Twins also doesn't allow reupload of the same exact model while a matching model is already present in the instance.

Instead, if you want to make changes to a model—such as updating `displayName` or `description`, or adding and removing properties—you'll need to replace the original model.

There are two strategies to choose from when replacing a model:
* [Strategy 1: Upload new model version](#strategy-1-upload-new-model-version): Upload the model, with a new version number, and update your twins to use that new model. Both the new and old versions of the model will exist in your instance until you delete one.
    - Use this strategy when you want to update only some of your twins that use the model, or when you want to make sure twins stay conformant with their models and writable through the model transition.
* [Strategy 2: Delete old model and reupload](#strategy-2-delete-old-model-and-reupload): Delete the original model and upload the new model with the same name and ID (DTMI value) in its place. Completely replaces the old model with the new one. 
    - Use this strategy when you want to update all twins that use this model at once, in addition to all code reacting to the models. If your model update contains a breaking change with the model update, twins will be nonconformant with their models for a short time while you're transitioning them from the old model to the new one, meaning that they won't be able to take any updates until the new model is uploaded and the twins conform to it.

>[!NOTE]
> Making breaking changes to your models is discouraged outside of development.

Continue to the next sections to read more about each strategy option in detail.

### Strategy 1: Upload new model version

This option involves creating a new version of the model and uploading it to your instance.

This operation doesn't overwrite earlier versions of the model, so multiple versions of the model will coexist in your instance until you [remove them](#remove-models). Since the new model version and the old model version coexist, twins can use either the new version of the model or the older version, meaning that uploading a new version of a model doesn't automatically affect existing twins. The existing twins will remain as instances of the old model version, and you can update these twins to the new model version by patching them.

To use this strategy, follow the steps below.

#### 1. Create and upload new model version 

To create a new version of an existing model, start with the DTDL of the original model. Update, add, or remove the fields you want to change.

Next, mark this model as a newer version of the model by updating the `id` field of the model. The last section of the model ID, after the `;`, represents the model number. To indicate that this model is now a more-updated version, increment the number at the end of the `id` value to any number greater than the current version number.

For example, if your previous model ID looked like this:

```json
"@id": "dtmi:com:contoso:PatientRoom;1",
```

Version 2 of this model might look like this:

```json
"@id": "dtmi:com:contoso:PatientRoom;2",
```

Then, [upload](#upload-models) the new version of the model to your instance. 

This version of the model will then be available in your instance to use for digital twins. It doesn't overwrite earlier versions of the model, so multiple versions of the model now coexist in your instance.

#### 2. Update graph elements as needed

Next, update the twins and relationships in your instance to use the new model version instead of the old.

You can use the following instructions to [update twins](how-to-manage-twin.md#update-a-digital-twins-model) and [update relationships](how-to-manage-graph.md#update-relationships). The patch operation to update a twin's model will look something like this:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-model-1.json":::

>[!IMPORTANT]
>When updating twins, use the same patch to update both the model ID (to the new model version) and any fields that must be altered on the twin to make it conform to the new model.

You may also need to update relationships and other models in your instance that reference this model, to make them refer to the new model version. You'll need to do another model update operation to achieve this purpose, so return to the beginning of this section and repeat the process for any more models that need updating.

#### 3. (Optional) Decommission or delete old model version

If you won't be using the old model version anymore, you can [decommission](#decommissioning) the older model. This action allows the model to keep existing in the instance, but it can't be used to create new digital twins.

You can also [delete](#deletion) the old model completely if you don't want it in the instance anymore at all.

The sections linked above contain example code and considerations for decommissioning and deleting models.

### Strategy 2: Delete old model and reupload

Instead of incrementing the version of a model, you can delete a model completely and reupload an edited model to the instance.

Azure Digital Twins doesn't remember the old model was ever uploaded, so this action will be like uploading an entirely new model. Twins that use the model will automatically switch over to the new definition once it's available. Depending on how the new definition differs from the old one, these twins may have properties and relationships that match the deleted definition and aren't valid with the new one, so you may need to patch them to make sure they remain valid.

To use this strategy, follow the steps below.

### 1. Delete old model

Since Azure Digital Twins doesn't allow two models with the same ID, start by deleting the original model from your instance. 

>[!NOTE]
> If you have other models that depend on this model (through inheritance or components), you'll need to remove those references before you can delete the model. You can update those dependent models first to temporarily remove the references, or delete the dependent models and reupload them in a later step.

Use the following instructions to [delete your original model](#deletion). This action will leave your twins that were using that model temporarily "orphaned," as they're now using a model that no longer exists. This state will be repaired in the next step when you reupload the updated model.

### 2. Create and upload new model

Start with the DTDL of the original model. Update, add, or remove the fields you want to change.

Then, [upload the model](#upload-models) to the instance, as though it were a new model being uploaded for the first time.

### 3. Update graph elements as needed

Now that your new model has been uploaded in place of the old one, the twins in your graph will automatically begin to use the new model definition once the caching in your instance expires and resets. This process may take 10-15 minutes or longer, depending on the size of your graph. After that, new and changed properties on your model should be accessible, and removed properties won't be accessible anymore.

>[!NOTE]
> If you removed other dependent models earlier in order to delete the original model, reupload them now after the cache has reset. If you updated the dependent models to temporarily remove references to the original model, you can update them again to put the reference back.

Next, update the twins and relationships in your instance so their properties match the properties defined by the new model. Before this step is completed, the twins that don't match their model can still be read, but cannot be written to. For more information on the state of twins without a valid model, see [Twins without models](#after-deletion-twins-without-models).

There are two ways to update twins and relationships for the new model so that they're writable again:
* Patch the twins and relationships as needed so they fit the new model. You can use the following instructions to [update twins](how-to-manage-twin.md#update-a-digital-twin) and [update relationships](how-to-manage-graph.md#update-relationships).
    - If you've added properties: Updating twins and relationships to have the new values isn't required, since twins missing the new values will still be valid twins. You can patch them however you want to add values for the new properties.
    - If you've removed properties: It's required to patch twins to remove the properties that are now invalid with the new model.
    - If you've updated properties: It's required to patch twins to update the values of changed properties to be valid with the new model.
* Delete twins and relationships that use the model, and recreate them. You can use the following instructions to [delete twins](how-to-manage-twin.md#delete-a-digital-twin) and [recreate twins](how-to-manage-twin.md#create-a-digital-twin), and [delete relationships](how-to-manage-graph.md#delete-relationships) and [recreate relationships](how-to-manage-graph.md#create-relationships).
    - You might want to do this operation if you're making many changes to the model, and it will be difficult to update the existing twins to match it. However, recreation can be complicated if you have many twins that are interconnected by many relationships.

## Remove models

Models can be removed from the service in one of two ways:
* Decommissioning: Once a model is decommissioned, you can no longer use it to create new digital twins. Existing digital twins that already use this model aren't affected, so you can still update them with things like property changes and adding or deleting relationships.
* Deletion: This operation will completely remove the model from the solution. Any twins that were using this model are no longer associated with any valid model, so they're treated as though they don't have a model at all. You can still read these twins, but you can't make any updates on them until they're reassigned to a different model.

These operations are separate features and they don't impact each other, although they may be used together to remove a model gradually. 

### Decommissioning

To decommission a model, you can use the [DecommissionModel](/dotnet/api/azure.digitaltwins.core.digitaltwinsclient.decommissionmodel?view=azure-dotnet&preserve-view=true) method from the SDK:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/model_operations.cs" id="DecommissionModel":::

You can also decommission a model using the REST API call [DigitalTwinModels Update](/rest/api/digital-twins/dataplane/models/digitaltwinmodels_update). The `decommissioned` property is the only property that can be replaced with this API call. The JSON Patch document will look something like this:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-decommission-model.json":::

A model's decommissioning status is included in the `ModelData` records returned by the model retrieval APIs.

### Deletion

You can delete all models in your instance at once, or you can do it on an individual basis.

For an example of how to delete all models at the same time, see the [End-to-end samples for Azure Digital Twins](https://github.com/Azure-Samples/digital-twins-samples/blob/main/AdtSampleApp/SampleClientApp/CommandLoop.cs) repository in GitHub. The *CommandLoop.cs* file contains a `CommandDeleteAllModels` function with code to delete all of the models in the instance.

To delete an individual model, follow the instructions and considerations from the rest of this section.

#### Before deletion: Deletion requirements

Generally, models can be deleted at any time.

The exception is models that other models depend on, either with an `extends` relationship or as a component. For example, if a ConferenceRoom model extends a Room model, and has a ACUnit model as a component, you can't delete Room or ACUnit until ConferenceRoom removes those respective references. 

You can do so by updating the dependent model to remove the dependencies, or deleting the dependent model completely.

#### During deletion: Deletion process

Even if a model meets the requirements to delete it immediately, you may want to go through a few steps first to avoid unintended consequences for the twins left behind. Here are some steps that can help you manage the process:
1. First, decommission the model
2. Wait a few minutes, to make sure the service has processed any last-minute twin creation requests sent before the decommission
3. Query twins by model to see all twins that are using the now-decommissioned model
4. Delete the twins if you no longer need them, or patch them to a new model if needed. You can also choose to leave them alone, in which case they'll become twins without models once the model is deleted. See the next section for the implications of this state.
5. Wait for another few minutes to make sure the changes have percolated through
6. Delete the model 

To delete a model, you can use the [DeleteModel](/dotnet/api/azure.digitaltwins.core.digitaltwinsclient.deletemodel?view=azure-dotnet&preserve-view=true) SDK call:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/model_operations.cs" id="DeleteModel":::

You can also delete a model with the [DigitalTwinModels Delete](/rest/api/digital-twins/dataplane/models/digitaltwinmodels_delete) REST API call.

#### After deletion: Twins without models

Once a model is deleted, any digital twins that were using the model are now considered to be without a model. There's no query that can give you a list of all the twins in this state—although you can still query the twins by the deleted model to know what twins are affected.

Here's an overview of what you can and can't do with twins that don't have a model.

Things you can do:
* Query the twin
* Read properties
* Read outgoing relationships
* Add and delete incoming relationships (as in, other twins can still form relationships to this twin)
  - The `target` in the relationship definition can still reflect the DTMI of the deleted model. A relationship with no defined target can also work here.      
* Delete relationships
* Delete the twin

Things you can't do:
* Edit outgoing relationships (as in, relationships from this twin to other twins)
* Edit properties

#### After deletion: Reuploading a model

After a model has been deleted, you may decide later to upload a new model with the same ID as the one you deleted. Here's what happens in that case.
* From the solution store's perspective, this operation is the same as uploading an entirely new model. The service doesn't remember the old one was ever uploaded.   
* If there are any remaining twins in the graph referencing the deleted model, they're no longer orphaned; this model ID is valid again with the new definition. However, if the new definition for the model is different than the model definition that was deleted, these twins may have properties and relationships that match the deleted definition and aren't valid with the new one.

Azure Digital Twins doesn't prevent this state, so be careful to patch twins appropriately to make sure they remain valid through the model definition switch.

## Convert v2 models to v3

Azure Digital Twins supports [DTDL versions 2 and 3](concepts-models.md#supported-dtdl-versions) (shortened in the documentation to v2 and v3, respectively).  V3 is the recommended choice based on its expanded capabilities. This section explains how to update an existing DTDL v2 model to DTDL v3.

1. **Update the context.** The main feature that identifies a model as v2 or v3 is the `@context` field on the interface. To convert a model from v2 to v3, change the `dtmi:dtdl:context;2` context value to `dtmi:dtdl:context;3`. For many models, this will be the only required change.
    1. Value in v2: `"@context": "dtmi:dtdl:context;2"`
    1. Value in v3: `"@context": "dtmi:dtdl:context;3"`.
1. **If needed, update semantic types.** In DTDL v2, [semantic types](concepts-models.md#dtdl-v2-semantic-type-example) are natively supported. In DTDL v3, they are included with the [QuantitativeTypes feature extension](concepts-models.md#quantitativetypes-extension). So, if your v2 model used semantic types, you'll need to add the feature extension when converting the model to v3. To do this, first change the `@context` field on the interface from a single value to an array of values, then add the value `dtmi:dtdl:extension:quantitativeTypes;1`.
    1. Value in v2: `"@context": "dtmi:dtdl:context;2"` 
    1. Value in v3: `"@context": ["dtmi:dtdl:context;3", "dtmi:dtdl:extension:quantitativeTypes;1"]`
1. **If needed, consider size limits**. V2 and v3 have different size limits, so if your interface is very large, you may want to review the limits in the [differences between DTDL v2 and v3](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#changes-from-version-2). 

After these changes, a former DTDL v2 model has been converted to a DTDL v3 model.

You might also want to consider [new capabilities of DTDL v3](concepts-models.md#supported-dtdl-versions), such as array-type properties, version relaxation, and additional feature extensions, to see if any of them would be beneficial additions. For a complete list of differences between DTDL v2 and v3, see [Changes from Version 2 in the DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#changes-from-version-2).

## Next steps

See how to create and manage digital twins based on your models:
* [Manage digital twins](how-to-manage-twin.md)
