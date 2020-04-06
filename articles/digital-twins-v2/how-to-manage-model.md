---
# Mandatory fields.
title: Manage a twin type model
titleSuffix: Azure Digital Twins
description: See how to create, edit, and delete a model within Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Manage your Azure Digital Twins model set

Azure Digital Twins **DigitalTwinsModels APIs** are APIs used to manage the [models](concepts-models.md) that an Azure Digital Twins instance knows about. Management operations include upload, validation, and retrieval of models authored in [Digital Twins Definition language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL). 

[!INCLUDE [digital-twins-generate-sdk.md](../../includes/digital-twins-generate-sdk.md)]

## Create models

Consider an example in which a hospital wants to digitally represent their rooms. Each room contains a smart soap dispenser for monitoring hand-washing, and sensors to monitor traffic through the room.

The first step towards the solution is to create models to represent aspects of the hospital. 

Models for Azure Digital Twins are written in DTDL. A patient room in this scenario might be described like this:

```json
{
  "@id": "urn:contosocom:example:PatientRoom:1",
  "@type": "Interface",
  "@context": "http://azure.com/v3/contexts/Model.json",
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

This model defines a name and a unique ID for the patient room, and properties to represent visitor count and hand-wash status (these counters will be updated from motion sensors and smart soap dispensers, and will be used together to calculate a *handwash percentage* property). The model also defines a relationship *hasDevices*, which will be used to connect the Room twin to the actual devices.

Following this method, you can go on to define models for the hospital's wards, zones, or the hospital itself.

## Upload models

Once models are created, you can upload them to the Azure Digital Twins instance.

Here is a code sample showing how to do this:

```csharp
DigitalTwinsClient client = new DigitalTwinsClient("...");
// Read model file into string (not part of SDK)
StreamReader r = new StreamReader("MyModelFile.json"));
string dtdl = r.ReAzure Digital TwinsoEnd(); r.Close();
Task<Response> rUpload = client.UploadDTDLAsync(dtdl);
Clients can also upload multiple files in one single transaction:
DigitalTwinsClient client = new DigitalTwinsClient("connectionString");
var dtdlFiles = Directory.EnumerateFiles(sourceDirectory, "*.json");

List<string> dtdlStrings = new List<string>();
foreach (string fileName in dtdlFiles)
{
    // Read model file into string (not part of SDK)
    StreamReader r = new StreamReader("MyModelFile.json"));
    string dtdl = r.ReAzure Digital TwinsoEnd(); r.Close();
    dtdlStrings.Add(dtdl); 
}

Task<Response> rUpload client.UploadDTDLAsync(dtdlStrings.ToArray());
```

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

The DTDL upload API provides two overloads for loading DTDL. One overload lets you pass a single string containing DTDL models; the other lets you pass an array of DTDL models. Each string can either contain a single DTDL model, or multiple models as a JSON array:

```json
[
  {
    "@id": "urn:contosocom:example:Planet",
    "@type": "Interface",
    //...
  },
  {
    "@id": "urn:contosocom:example:Moon",
    "@type": "Interface",
    //...
  }
]
```
 
On upload, model files are validated.

## Retrieve models

You can list and retrieve models stored on your Azure Digital Twins instance. 

Here are your options for this:
* Retrieve all models
* Retrieve a single model
* Retrieve a single model with dependencies
* Retrieve metadata for models

Here are some example calls:

```csharp
DigitalTwinsClient client = new DigitalTwinsClient("...");

// Get just the names of available models
IAsyncEnumerable<Response<ModelData>> modelData = RetrieveAllModelsAsync(IncludeModels.None);

// Get the entire model schema
IAsyncEnumerable<Response<ModelData>> modelData = client.RetrieveAllModelsAsync(IncludeModels.All);

// Get a single model
Response<ModelData> oneModel = client.RetrieveModel(modelId, IncludeModels.All);

// Get a single model with all referenced models, recursively
IAsyncEnumerable<Response<ModelData>> oneModelWithDependencies = client.RetrieveModelWithDependenciesAsync(modelId, IncludeModels.All);
```

The API calls to retrieve models all return `ModelData` objects. `ModelData` contains metadata about the model stored in the Azure Digital Twins instance, such as name, DTMI, and creation date of the model. The `ModelData` object also optionally includes the model itself. Depending on parameters, you can thus use the retrieve calls to either retrieve just metadata (which is useful in scenarios where you want to display a UI list of available tools, for example), or the entire model.

The `RetrieveModelWithDependencies` call returns not only the requested model, but also all models that the requested model depends on.

Models are not necessarily returned in exactly the document form they were uploaded in. Azure Digital Twins only guarantees that the return form will be semantically equivalent. 

## Parse models

As part of the Azure Digital Twins SDK, a DTDL parsing library is provided as a client-side library. This library provides model access to the DTDL definitions—effectively, the equivalent of C# reflection on DTDL. This library can be used independently of the Azure Digital Twins SDK; for example, for validation in a visual or text editor for DTDL. 

To use the parser library, you provide a set of DTDL documents to the library. Typically, you would retrieve these model documents from the service, but you might also have them available locally, if your client was responsible for uploading them to the service in the first place. 

The overall workflow is as follows.
1. You retrieve all (or, potentially, some) DTDL documents from the service.
2. You pass the returned in-memory DTDL documents to the parser.
3. The parser will validate the set of documents passed to it, and return detailed error information. This ability is useful in editor scenarios.
4. You can use the parser APIs to analyze the models included in the document set. 

The functionalities of the parser are:
* Get all implemented model interfaces (the contents of the interface's `extends` section).
* Get all properties, telemetry, commands, components, and relationships declared in the model. This command also gets all metadata included in these definitions and takes inheritance (`extends` sections) into account.
* Get all complex model definitions.
* Determine whether a model is assignable from another model.

> [!NOTE]
> [IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md) devices use a small syntax variant to describe their functionality. This syntax variant is a semantically compatible subset of the DTDL that is used in Azure Digital Twins. When using the parser library, you do not need to know which syntax variant was used to create the DTDL for your digital twin. The parser will always, by default, return the same model for both PnP and Azure Digital Twins syntax.

### Model parsing example

Here is an example defining several models in an Azure Digital Twins instance.

> [!TIP] 
> The `urn:contosocom:example:coffeeMaker` model is using the *capability model* syntax, which implies that it was installed in the service by connecting a PnP device exposing that model.

```json
{
  "@id": " urn:contosocom:example:coffeeMaker",
  "@type": "CapabilityModel",
  "implements": [
        { "name": "coffeeMaker", "schema": " urn:contosocom:example:coffeeMakerInterface" }
  ]    
}
{
  "@id": " urn:contosocom:example:coffeeMakerInterface",
  "@type": "Interface",
  "contents": [
      { "@type": "Property", "name": "waterTemp", "schema": "double" }  
  ]
}
{
  "@id": " urn:contosocom:example:coffeeBar",
  "@type": "Interface",
  "contents": [
        { "@type": "relationship", "contains": " urn:contosocom:example:coffeeMaker" },
        { "@type": "property", "name": "capacity", "schema": "integer" }
  ]    
}
```

The following code shows an example of how to use the parser library to reflect on these definitions in C#:

```csharp
public void LogModel(DTInterface model)
{
    Log.WriteLine("Interface: "+model.id);
    Log.WriteLine("**** Properties:");
    foreach (DTProperty p in model.Properties)
    {
        Log.WriteLine("  name: "+p.Name);
    }
    Log.WriteLine("**** Telemetry:");
    foreach (DTTelemetry t in model.Telemetries)
    {
        Log.WriteLine("  name: "+t.Name);
    }
    Log.WriteLine("**** Relationships:");
    foreach (DTRelationship r in model.Relationships)
    {
        Log.WriteLine("  name: "+r.Name);
    }
    foreach (DTComponent c in model.Components)
    {
        Log.WriteLine("  name: "+c.Id);
        Log.WriteLine(c.type); 
    }
}

public void ParseModels()
{
    DigitalTwinsClient client = new DigitalTwinsClient("..."); 
    // Get the entire model schema
    IEnumerable<Response<ModelData>> modelResp = client.RetrieveAllModels();
    IEnumerable<JsonDocument> models = Client.ExtractModels(modelResp);

    ModelParser parser = new ModelParser(); 
    IReadOnlyDictionary<Dtmi, DTEntityInfo> modelDict = Parse(models);

    DTInterface ires = modelDict[coffeeMakerDTMI] as DTInterface;
    if (ires!=null)
    {
        // Prints out coffeeMaker with the implements
        // section from the CM expressed as components 
        LogModel(ires); 
    }
    DTInterface ires = modelDict[coffeeBarDTMI] as DTInterface;
    if (ires!=null)
    {
        // Prints out CoffeeBar with property and relationship
        LogModel(ires); 
    }
}
```

## Delete models

Models can also be deleted from the service. 

Deletion is a multi-step process:
1. First, **decommission** the model. A decommissioned model is still valid for use by existing digital twins, including the ability to change properties and add or delete relationships. However, new digital twins of this model can't be created anymore.
2. After decommissioning a model, you will either delete existing digital twins of that model, or transition those digital twins to a different model.
3. Once there are no more digital twins of a given model, and the model is no longer referenced by any other model, you can **delete** it. 

Here is the  code to decommission a model:

```csharp
DigitalTwinsClient client = new DigitalTwinsClient("...");  
client.DecommissionModel(dtmiOfPlanetInterface);
// Write some code that deletes or transitions digital twins
...
```

`DecommissionModel()` can take one or more URNs, so developers can process one or multiple models in one statement. 

A model's decommissioning status is also included in the `ModelData` records returned by the model retrieval APIs.

## Next steps

Learn about managing the other key elements of an Azure Digital Twins solution:
* [Manage a twin graph](how-to-manage-graph.md)
* [Manage an individual digital twin](how-to-manage-twin.md)