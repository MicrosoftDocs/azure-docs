---
title: Understand the Digital Twins model parser | Microsoft Docs
description: As a developer, learn how to use the DTDL parser to validate models
author: rido-min
ms.author: rmpablos
ms.date: 04/29/2020
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: peterpr
---

# Understand the digital twins model parser

The Digital Twins Definition Language (DTDL) is described in the [DTDL Specification](https://github.com/Azure/opendigitaltwins-dtdl). Users can use the _Digital Twins Model Parser_ NuGet package to validate and query a model defined in multiple files.

## Install the DTDL model parser

The parser is available in NuGet.org with the ID: [Microsoft.Azure.DigitalTwins.Parser](https://www.nuget.org/packages/Microsoft.Azure.DigitalTwins.Parser). To install the parser, use any compatible NuGet package manager such as the one in Visual Studio or in the `dotnet` CLI.

```bash
dotnet add package Microsoft.Azure.DigitalTwins.Parser
```

## Use the parser to validate a model

The model you want to validate might be composed of one or more interfaces described in JSON files. You can use the parser to load all the files in a given folder and use the parser to validate all the files as a whole, including any references between the files:

1. Create an `IEnumerable<string>` with a list of all model contents:

    ```csharp
    using System.IO;

    string folder = @"c:\myModels\";
    string filespec = "*.json";

    List<string> modelJson = new List<string>();
    foreach (string filename in Directory.GetFiles(folder, filespec))
    {
        using StreamReader modelReader = new StreamReader(filename);
        modelJson.Add(modelReader.ReadToEnd());
    }
    ```

1. Instantiate the `ModelParser` and call `ParseAsync`:

    ```csharp
    using Microsoft.Azure.DigitalTwins.Parser;

    ModelParser modelParser = new ModelParser();
    IReadOnlyDictionary<Dtmi, DTEntityInfo> parseResult = await modelParser.ParseAsync(modelJson);
    ```

1. Check for validation errors. If the parser finds any errors, it throws an `AggregateException` with a list of detailed error messages:

    ```csharp
    try
    {
        IReadOnlyDictionary<Dtmi, DTEntityInfo> parseResult = await modelParser.ParseAsync(modelJson);
    }
    catch (AggregateException ae)
    {
        foreach (var e in ae.InnerExceptions)
        {
            Console.WriteLine(e.Message);
        }
    }
    ```

1. Inspect the `Model`. If the validation succeeds, you can use the model parser API to inspect the model. The following code snippet shows how to iterate over all the models parsed and displays the existing properties:

    ```csharp
    foreach (var m in parseResult)
    {
        Console.WriteLine(m.Key);
        foreach (var item in m.Value.AsEnumerable<DTEntityInfo>())
        {
            var p = item as DTInterfaceInfo;
            if (p!=null)
            {
                Console.WriteLine($"\t{p.Id}");
                Console.WriteLine($"\t{p.Description.FirstOrDefault()}");
            }
            Console.WriteLine("--------------");
        }
    }
    ```

## Next steps

The model parser API reviewed in this article enables many scenarios to automate or validate tasks that depend on DTDL models. For example, you could dynamically build a UI from the information in the model.
