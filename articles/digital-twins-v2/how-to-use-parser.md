---
# Mandatory fields.
title: Use the client-side parser library
titleSuffix: Azure Digital Twins
description: Learn how to use the parser library to parse DTDL models.
author: cschorm
ms.author: cschorm # Microsoft employees only
ms.date: 4/10/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

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

### Use the validator sample

There is sample code for a tool available that can validate model documents to make sure the DTDL is valid. It is built on the DTDL parser library and is language-agnostic. Find it here: [DTDL Validator tool sample](https://github.com/Azure/azure-digital-twins/tree/private-preview/DTDL/DTDLValidator-Sample).

See the readme.md file for the validator sample for instructions on how to package the tools into a self-contained executable.

### Use the parser library in code

You can also use the parser library directly to validate models yourself.

To support the parser code example below, consider several models defined in an Azure Digital Twins instance:

> [!TIP] 
> The `dtmi:com:contoso:coffeeMaker` model is using the *capability model* syntax, which implies that it was installed in the service by connecting a PnP device exposing that model.

```json
{
  "@id": " dtmi:com:contoso:coffeeMaker",
  "@type": "CapabilityModel",
  "implements": [
        { "name": "coffeeMaker", "schema": " dtmi:com:contoso:coffeeMakerInterface" }
  ]    
}
{
  "@id": " dtmi:com:contoso:coffeeMakerInterface",
  "@type": "Interface",
  "contents": [
      { "@type": "Property", "name": "waterTemp", "schema": "double" }  
  ]
}
{
  "@id": " dtmi:com:contoso:coffeeBar",
  "@type": "Interface",
  "contents": [
        { "@type": "relationship", "contains": " dtmi:com:contoso:coffeeMaker" },
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