---
# Mandatory fields.
title: Parse and validate models
titleSuffix: Azure Digital Twins
description: Learn how to use the parser library to parse DTDL models.
author: cschormann
ms.author: cschorm # Microsoft employees only
ms.date: 4/10/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# DTDL client-side parser library

[Models](concepts-models.md) in Azure Digital Twins are defined using the JSON-LD-based Digital Twins Definition language (DTDL). For cases where it is useful to parse your models, a DTDL parsing library is provided on NuGet.org as a client-side library: [Microsoft.Azure.DigitalTwins.Parser](https://nuget.org/packages/Microsoft.Azure.DigitalTwins.Parser/).

This library provides model access to the DTDL definitions, essentially acting as the equivalent of C# reflection for DTDL. This library can be used independently of any [Azure Digital Twins SDK](how-to-use-apis-sdks.md), especially for DTDL validation in a visual or text editor. It is useful for making sure your model definition files are valid before you try to upload them to the service.

To use the parser library, you provide it with a set of DTDL documents. Typically, you would retrieve these model documents from the service, but you might also have them available locally, if your client was responsible for uploading them to the service in the first place. 

Here is the general workflow for using the parser:
1. Retrieve some or all DTDL documents from the service.
2. Pass the returned, in-memory DTDL documents to the parser.
3. The parser will validate the set of documents passed to it, and return detailed error information. This ability is useful in editor scenarios.
4. Use the parser APIs to continue analyzing the models included in the document set. 

The capabilities of the parser include:
* Get all implemented model interfaces (the contents of the interface's `extends` section).
* Get all properties, telemetry, commands, components, and relationships declared in the model. This command also gets all metadata included in these definitions, and takes inheritance (`extends` sections) into account.
* Get all complex model definitions.
* Determine whether a model is assignable from another model.

> [!NOTE]
> [IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md) devices use a small syntax variant to describe their functionality. This syntax variant is a semantically compatible subset of the DTDL that is used in Azure Digital Twins. When using the parser library, you do not need to know which syntax variant was used to create the DTDL for your digital twin. The parser will always, by default, return the same model for both PnP and Azure Digital Twins syntax.

## Use the DTDL validator sample

There is sample code available that can validate model documents to make sure the DTDL is valid. It is built on the DTDL parser library and is language-agnostic. Find it here: [DTDL Validator sample](https://docs.microsoft.com/samples/azure-samples/dtdl-validator/dtdl-validator).

The validator sample can be used as a command line utility to validate a directory tree of DTDL files. It also provides an interactive mode. The source code shows examples for how to use the parser library.

In the folder for the DTDL Validator sample, see the *readme.md* file for instructions on how to package the sample into a self-contained executable.

After you have built a self-contained package and added the executable to your path, you can run the validator with this command in a console on your machine:

```cmd/sh
DTDLValidator
```

With the default options, the sample will search for `*.json` files in the current directory and all subdirectories. You can also add the following option to have the sample search in the indicated directory and all subdirectories for files with the extension *.dtdl*:

```cmd/sh
DTDLValidator -d C:\Work\DTDL -e dtdl 
```

You can add the `-i` option for the sample to enter interactive mode:

```cmd/sh
DTDLValidator -i
```

For more information about this sample, see the source code or run `DTDLValidator --help`.

## Use the parser library in code

You can also use the parser library directly, for things like validating models in your own application or for generating dynamic, model-driven UI, dashboards, and reports.

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
async void ParseDemo(DigitalTwinsClient client)
{
    try
    {
        AsyncPageable<ModelData> mdata = client.GetModelsAsync(null, true);
        List<string> models = new List<string>();
        await foreach (ModelData md in mdata)
            models.Add(md.Model);
        ModelParser parser = new ModelParser();
        IReadOnlyDictionary<Dtmi, DTEntityInfo> dtdlOM = await parser.ParseAsync(models);

        List<DTInterfaceInfo> interfaces = new List<DTInterfaceInfo>();
        IEnumerable<DTInterfaceInfo> ifenum = 
            from entity in dtdlOM.Values
            where entity.EntityKind == DTEntityKind.Interface
            select entity as DTInterfaceInfo;
        interfaces.AddRange(ifenum);
        foreach (DTInterfaceInfo dtif in interfaces)
        {
            PrintInterfaceContent(dtif, dtdlOM);
        }

    } catch (RequestFailedException rex)
    {

    }
}

void PrintInterfaceContent(DTInterfaceInfo dtif, IReadOnlyDictionary<Dtmi, DTEntityInfo> dtdlOM, int indent=0)
{
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < indent; i++) sb.Append("  ");
    Console.WriteLine($"{sb}Interface: {dtif.Id} | {dtif.DisplayName}");
    SortedDictionary<string, DTContentInfo> contents = dtif.Contents;
    foreach (DTContentInfo item in contents.Values)
    {
        switch (item.EntityKind)
        {
            case DTEntityKind.Property:
                DTPropertyInfo pi = item as DTPropertyInfo;
                Console.WriteLine($"{sb}--Property: {pi.Name} with schema {pi.Schema}");
                break;
            case DTEntityKind.Relationship:
                DTRelationshipInfo ri = item as DTRelationshipInfo;
                Console.WriteLine($"{sb}--Relationship: {ri.Name} with target {ri.Target}");
                break;
            case DTEntityKind.Telemetry:
                DTTelemetryInfo ti = item as DTTelemetryInfo;
                Console.WriteLine($"{sb}--Telemetry: {ti.Name} with schema {ti.Schema}");
                break;
            case DTEntityKind.Component:
                DTComponentInfo ci = item as DTComponentInfo;
                Console.WriteLine($"{sb}--Component: {ci.Id} | {ci.Name}");
                dtdlOM.TryGetValue(ci.Id, out DTEntityInfo value);
                DTInterfaceInfo component = value as DTInterfaceInfo;
                PrintInterfaceContent(component, dtdlOM, indent + 1);
                break;
            default:
                break;
        }
    }
}
```

## Next steps

Once you are done writing your models, see how to upload them (and do other management operations) with the DigitalTwinsModels APIs:
* [How-to: Manage custom models](how-to-manage-model.md)