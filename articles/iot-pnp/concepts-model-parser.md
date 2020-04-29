---
title: Understand the Digital Twins Model parser | Microsoft Docs
description: As a developer learn how to use the DTDL parser to validate models
author: rido-min
ms.author: rmpablos
ms.date: 04/29/2020
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: peterpr
---

# Understand the Digital Twins Model parser

The Digital Twins Definition Language is described in the [DTDL Specification](https://aka.ms/DTDL). Users can use the Digital Twins Model Parser NuGet package to validate and query a model defined in multiple files.

## Install the DTDL Model Parser

The parser is available in NuGet.org with the ID: [Microsoft.Azure.DigitalTwins.Parser](https://www.nuget.org/packages/Microsoft.Azure.DigitalTwins.Parser), to install you can use any compatible NuGet Package Manager like the one available in Visual Studio or the `dotnet` CLI.

```bash
dotnet add package Microsoft.Azure.DigitalTwins.Parser
```

## Use the parser to validate a model

The model you want to validate might be composed by one or more interfaces described in JSON files. You can use the parser to load all the files available in a given folder to let the parser validate all the files as a whole, including the potential references between files.

1. Create a `IEnumerable<string>` with a list of all model contents

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

2. Instantiate the ModelParser and call ParseAsync

```csharp
using Microsoft.Azure.DigitalTwins.Parser;

ModelParser modelParser = new ModelParser();
IReadOnlyDictionary<Dtmi, DTEntityInfo> parseResult = await modelParser.ParseAsync(modelJson);
```

3. Check for validation errors

If the parser founds any error it will throw an `AggregateException` with a list of detailed error messages

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

4. Inspect the Model

If the validation succeed, you can inspect the model details by using the model parser API, the next code snippet shows how to iterate over all the models parsed in displays the existing properties.

```csharp
foreach (var m in parseResult)
{
    Console.WriteLine(m.Key);
    foreach (var item in m.Value.AsEnumerable<DTEntityInfo>())
    {
        var p = item as DTPropertyInfo;
        if (p!=null)
        {
            Console.WriteLine($"\t{p.Name}");
            Console.WriteLine($"\t {p.Schema.Id}");
        }
        Console.WriteLine("--------------");
    }
}

```

## Next steps

The model parser API reviewed in this article enable multiple scenarios to automate or validate tasks depending on DTDL models. As an example, think of a UI that can be dyanmically built from the information in the model.

