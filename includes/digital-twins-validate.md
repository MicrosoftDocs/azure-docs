---
author: baanders
description: include file describing how to validate Azure Digital Twins models
ms.service: digital-twins
ms.topic: include
ms.date: 8/7/2020
ms.author: baanders
---

> [!TIP]
> After creating a model, it's recommended to validate your models offline before uploading them to your Azure Digital Twins instance.

There is a language-agnostic sample available for validating model documents to make sure the DTDL is correct. It is located here: [**DTDL Validator sample**](https://docs.microsoft.com/samples/azure-samples/dtdl-validator/dtdl-validator).

The DTDL validator sample is built on a .NET DTDL parser library, which is available on NuGet as a client-side library: [**Microsoft.Azure.DigitalTwins.Parser**](https://nuget.org/packages/Microsoft.Azure.DigitalTwins.Parser/). You can also use the library directly to design your own validation solution. When using the parser library, make sure to use a version that is compatible with the version that Azure Digital Twins is running. During preview, this is version *3.12.4*.

You can learn more about the validator sample and parser library, including usage examples, in [*How-to: Parse and validate models*](../articles/digital-twins/how-to-parse-models.md).