---
# Mandatory fields.
title: Manage a twin type model
titleSuffix: Azure Digital Twins
description: See how to create, edit, and delete a twin type model within Azure Digital Twins.
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

# Manage your Azure Digital Twins twin type model set

Azure Digital Twins **Model Management APIs** are APIs used to manage the twin type models that a given Azure Digital Twins instance knows about. Management operations include upload, validation, and retrieval of twin type models authored in [Digital Twins Definition language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL). 

## Twin type modeling

Consider an example in which a hospital wants to digitally represent their rooms, complete with sensors to monitor traffic into/out of the rooms and handwashing stations in each room.
The first step towards the solution is to create twin type models to represent aspects of the hospital. Twin type models for Azure Digital Twins are written in DTDL. A patient room might be described as:

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

This description defines a name and a unique ID for the patient room, a few properties to represent handwash status (counters that will be updated from motion sensors and soap dispensers, as well as a computed *handwash percentage* property). The twin type model also defines a relationship *hasDevices* that will be used to connect to the actual devices.
In a similar manner, twin type models for the hospital itself, as well as hospital wards or zones, can be defined.

## Upload twin type models

Once twin type models are created, you can upload them to the service instance. 
An example:

```csharp
DigitalTwinsClient client = new DigitalTwinsClient("...");
// Read twin type model file into string (not part of SDK)
StreamReader r = new StreamReader("MyModelFile.json"));
string dtdl = r.ReAzure Digital TwinsoEnd(); r.Close();
Task<Response> rUpload = client.UploadDTDLAsync(dtdl);
Clients can also upload multiple files in one single transaction:
DigitalTwinsClient client = new DigitalTwinsClient("connectionString");
var dtdlFiles = Directory.EnumerateFiles(sourceDirectory, "*.json");

List<string> dtdlStrings = new List<string>();
foreach (string fileName in dtdlFiles)
{
    // Read twin type model file into string (not part of SDK)
    StreamReader r = new StreamReader("MyModelFile.json"));
    string dtdl = r.ReAzure Digital TwinsoEnd(); r.Close();
    dtdlStrings.Add(dtdl); 
}

Task<Response> rUpload client.UploadDTDLAsync(dtdlStrings.ToArray());
```

The DTDL upload API provides two overloads for loading DTDL. One overload lets you pass a single string containing DTDL twin type models, the other lets you pass an array of DTDL twin type models. Each string can either contain a single DTDL twin type model, or multiple twin type models as a JSON array:

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
 
On upload, twin type model files are validated. 

## Retrieve twin type models

You can list and retrieve twin type models stored on your Azure Digital Twins service instance. Your options are:
* Retrieve all twin type models
* Retrieve a single twin type model
* Retrieve a single twin type model with dependencies
* Retrieve metadata for twin type models

An example:

```csharp
DigitalTwinsClient client = new DigitalTwinsClient("...");

// Get just the names of available twin type models
IAsyncEnumerable<Response<ModelData>> modelData = RetrieveAllModelsAsync(IncludeModels.None);

// Get the entire twin type model schema
IAsyncEnumerable<Response<ModelData>> modelData = client.RetrieveAllModelsAsync(IncludeModels.All);

// Get a single twin type model
Response<ModelData> oneModel = client.RetrieveModel(modelId, IncludeModels.All);

// Get a single twin type model with all referenced twin type models, recursively
IAsyncEnumerable<Response<ModelData>> oneModelWithDependencies = client.RetrieveModelWithDependenciesAsync(modelId, IncludeModels.All);
```

The API calls to retrieve twin type models return `ModelData` objects. `ModelData` contains metadata about the twin type model stored in the Azure Digital Twins service instance, such as name, DTMI, and creation date of the twin type model. The `ModelData` object also optionally includes the twin type model itself. Depending on parameters, you can thus use the retrieve calls to either retrieve just metadata (which is useful in scenarios where you want to display a UI list of available tools, for example), or the entire twin type model.

The `RetrieveModelWithDependencies` call returns not only the requested twin type model, but also all twin type models that the requested twin type model depends on.
Twin type models are not necessarily returned in exactly the document form they were uploaded in. Azure Digital Twins makes no guarantees about the form a document is returned in, beyond that the document will be returned in semantically equivalent form. 

## Parse twin type models

As part of the Azure Digital Twins SDK, a DTDL parsing library is provided as a client-side library. This library provides twin type model access to the DTDL definitions – effectively, the equivalent of C# reflection on DTDL. This library can be used independently of the Azure Digital Twins SDK; for example, for validation in a visual or text editor for DTDL. 

To use the parser library, you provide a set of DTDL documents to the library. Typically, you would retrieve these twin type model documents from the service, but you might also have them available locally, if your client was responsible for uploading them to the service in the first place. The overall workflow is as follows.
* You retrieve all (or, potentially, some) DTDL documents from the service.
* You pass the returned in-memory DTDL documents to the parser.
* The parser will validate the set of documents passed to it and return detailed error information. This ability is useful in editor scenarios.
* You can use the parser APIs to analyze the twin type models included in the document set. 

The functionalities of the parser are:
    - Get all interfaces implemented (the content of the extends section)
    - Get all properties, telemetry, commands, components, and relationships declared in the twin type model. This command also gets all metadata included in these definitions and takes inheritance (`extends` sections) into account
    - Get all complex twin type model definitions
    - Ascertain if a twin type model is assignable from another twin type model 

> [!NOTE]
> IoT Plug and Play (PnP) devices use a small syntax variant to describe their functionality. This syntax variant is a semantically compatible subset of DTDL as used in Azure Digital Twins. When using the parser library, you do not need to know which syntax variant was used to create the DTDL for your digital twin. The parser will always, by default, return the same twin type model for both PnP and Azure Digital Twins syntax.

### An example

The following twin type models are defined in the service (the `urn:contosocom:example:coffeeMaker` twin type model is using the capability model syntax, which implies that it was installed in the service by connecting an [IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md) device exposing that twin type model):

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

The following code shows an example on how to use the parser library to reflect on these definitions in C#:
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
    // Get the entire twin type model schema
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

## Delete twin type models

Twin type models can also be deleted from the service. Deletion is a multi-step process:
* First, **decommission** the twin type model. A decommissioned twin type model is still valid for use by existing Azure digital twins, including the ability to change properties or add and delete relationships. However, new instances of this twin type model can't be created anymore.
* After decommissioning a twin type model, you will typically either delete existing instances of that twin type model, or transition the Azure digital twin to a different twin type model.
* Once there are no more instances of a given twin type model, and the twin type model is not referenced by any other twin type model any longer, you can **delete** it. 

```csharp
DigitalTwinsClient client = new DigitalTwinsClient("...");  
client.DecommisionModel(dtmiOfPlanetInterface);
// Write some code that deletes or transitions digital twins
...
```

`DecommissionModel()` can take one or more than one URN(s), so developers can process one or multiple ones in one statement. The decommissioning status is also included in the `ModelData` records returned by the twin type model retrieval APIs.

## Next steps

Learn about managing the other key components of an Azure Digital Twins solution:
* [Manage a twin graph](how-to-manage-graph.md)
* [Manage an individual digital twin](how-to-manage-twin.md)