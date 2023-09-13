---
title: Parse and validate models
titleSuffix: Azure Digital Twins
description: Learn how to use the parser library to parse DTDL models.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 06/29/2023
ms.topic: how-to
ms.service: digital-twins
ms.custom: contperf-fy21q3, devx-track-dotnet

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Parse and validate models with the DTDL parser library

This article describes how to parse and validate Azure Digital Twins models using the .NET parser library.

[Models](concepts-models.md) in Azure Digital Twins are defined using the JSON-LD-based Digital Twins Definition language (DTDL).

[!INCLUDE [Azure Digital Twins: validate models info](../../includes/digital-twins-validate.md)]

## About the .NET parser library 

The [DTDLParser](https://www.nuget.org/packages/DTDLParser) library provides model access to the DTDL definitions, essentially acting as the equivalent of C# reflection for DTDL. This library can be used independently of any [Azure Digital Twins SDK](concepts-apis-sdks.md), especially for DTDL validation in a visual or text editor. It's useful for making sure your model definition files are valid before you try to upload them to the service.

To use the parser library, you provide it with a set of DTDL documents. Typically, you would retrieve these model documents from the service, but you might also have them available locally, if your client was responsible for uploading them to the service in the first place. 

Here's the general workflow for using the parser:
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
> [IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md) devices use a small syntax variant to describe their functionality. This syntax variant is a semantically compatible subset of the DTDL that is used in Azure Digital Twins. When using the parser library, you do not need to know which syntax variant was used to create the DTDL for your digital twin. The parser will always, by default, return the same model for both IoT Plug and Play and Azure Digital Twins syntax.

## Code with the parser library

You can use the parser library directly, for things like validating models in your own application or for generating dynamic, model-driven UI, dashboards, and reports.

To support the parser code example below, consider several models defined in an Azure Digital Twins instance:

:::code language="json" source="~/digital-twins-docs-samples/models/coffeeMaker-coffeeMakerInterface-coffeeBar.json":::

The following code shows an example of how to use the parser library to reflect on these definitions in C#:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/parseModels.cs":::

## Next steps

Once you're done writing your models, see how to upload them (and do other management operations) with the Azure Digital Twins Models APIs:
* [Manage DTDL models](how-to-manage-model.md)
