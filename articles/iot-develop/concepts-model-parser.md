---
title: Understand the Azure Digital Twins model parser | Microsoft Docs
description: As a developer, learn how to use the DTDL parser to validate models.
author: rido-min
ms.author: rmpablos
ms.date: 04/25/2023
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-develop
services: iot-develop

---

# Understand the digital twins model parser

The Digital Twins Definition Language (DTDL) is described in the [DTDL Specification](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md). Users can use the _Digital Twins Model Parser_ NuGet package to validate and query a DTDL model. The DTDL model may be defined in multiple files.

## Install the DTDL model parser

The parser is available in NuGet.org with the ID: [DTDLParser](https://www.nuget.org/packages/DTDLParser). To install the parser, use any compatible NuGet package manager such as the one in Visual Studio or in the `dotnet` CLI.

```bash
dotnet add package DTDLParser
```

> [!NOTE]
> At the time of writing, the parser version is `1.0.52`.

## Use the parser to validate and inspect a model

The DTDLParser is a library that you can use to:

- Determine whether one or more models are valid according to the language v2 or v3 specifications.
- Identify specific modeling errors.
- Inspect model contents.

A model can be composed of one or more interfaces described in JSON files. You can use the parser to load all the files that define a model and then validate all the files as a whole, including any references between the files.

The [DTDLParser for .NET](https://github.com/digitaltwinconsortium/DTDLParser) repository includes the following samples that illustrate the use of the parser:

- [DTDLParserResolveSample](https://github.com/digitaltwinconsortium/DTDLParser/blob/main/samples/DTDLParserResolveSample) shows how to parse an interface with external references, resolve the dependencies using the `Azure.IoT.ModelsRepository` client.
- [DTDLParserJSInteropSample](https://github.com/digitaltwinconsortium/DTDLParser/blob/main/samples/DTDLParserJSInteropSample) shows how to use the DTDL Parser from JavaScript running in the browser, using .NET JSInterop.

The DTDLParser for .NET repository also includes a [collection of tutorials](https://github.com/digitaltwinconsortium/DTDLParser/blob/main/tutorials/README.md) that show you how to use the parser to validate and inspect models.

## Next steps

The model parser API reviewed in this article enables many scenarios to automate or validate tasks that depend on DTDL models. For example, you could dynamically build a UI from the information in the model.
