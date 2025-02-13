---
title: Troubleshoot $convert-data for the FHIR service in Azure Health Data Services
description: Learn how to troubleshoot issues with the $convert-data operation.
services: healthcare-apis
author: EXPEkesheth
ms.service: azure-health-data-services
ms.topic: troubleshooting
ms.date: 02/12/2025
ms.author: kesheth
---

# Troubleshoot $convert-data

[!INCLUDE [Converter redirect statement](../includes/converter-redirect-statement.md)]

In this article, learn how to troubleshoot `$convert-data`.

## Performance
Two main factors come into play that determine how long a `$convert-data` operation call can take:

* The size of the message.
* The complexity of the template. 

Any loops or iterations in the templates can have large impacts on performance. The `$convert-data` operation has a post processing step that is run after the template is applied. In particular, the deduping step can mask template issues that cause performance problems. Updating the template so duplicates aren’t generated can greatly increase performance. For more information and details about the post processing step, see [Post processing](#post-processing).

## Post processing
The `$convert-data` operation applies post processing logic after the template is applied to the input. This post processing logic can result in the output looking different, or unexpected errors compared to running the default Liquid template directly. Post processing ensures the output is valid JSON and removes any duplicates based on the ID properties generated for resources in the template. To see the post processing logic in more detail, see the [FHIR-Converter GitHub repository](https://github.com/microsoft/FHIR-Converter/blob/main/src/Microsoft.Health.Fhir.Liquid.Converter/OutputProcessors/PostProcessor.cs).

## Message size
There isn’t a hard limit on the size of the messages allowed for the `$convert-data` operation. However, for content with a request size greater than 10 MB, server errors `500` are possible. If you're receiving `500` server errors, ensure your requests are under 10 MB.

## Template size and complexity

If you receive `504 Gateway Timeout` errors, it may be the result of template processing time. Updating templates to reduce loops and iterations can greatly increase performance. Consider retrying your request with a smaller or simpler template. 

## Why are my dates being converted when transforming JSON data?
 
It's possible for dates supplied within JSON data to be returned in a different format than what was supplied. During deserialization of the JSON payload, strings that are identified as dates get converted into .NET DateTime objects. These objects then get converted back to strings before going through the Liquid template engine. This conversion can cause the date value to be reformatted, and represented in the local timezone of the FHIR service.

The coercion of strings to .NET DateTime objects can be disabled using the boolean parameter `jsonDeserializationTreatDatesAsStrings`. When set to `true`, the supplied data is treated as a string and won't be modified before being supplied to the Liquid engine. 

## Default templates and customizations
Default template implementations for many common scenarios can be found on the [FHIR-Converter GitHub repository](https://github.com/microsoft/FHIR-Converter/tree/main/data/Templates). The default templates can be used as a guide and reference for customizing and creating your own templates. In addition to the default templates, the `$convert-data` operation supports several customer Liquid [filters and tags](https://github.com/microsoft/FHIR-Converter/blob/main/docs/Filters-and-Tags.md) that help simplify common scenarios. 

## Debugging and testing
In addition to testing templates on an instance of the service, a [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) is available. The extension can be used to modify templates and test them with sample data payloads. There are also several existing test scenarios in the [FHIR Converter GitHub repository](https://github.com/microsoft/FHIR-Converter/tree/main/src/Microsoft.Health.Fhir.Liquid.Converter.FunctionalTests) that can be used as a reference.
 
## Troubleshooting Azure Container Registry

When using Azure Container Registry (ACR) for custom template storage, if you encounter a "Failed to get access token for Azure Container Registry" error when reading templates, check to make sure that the correct role assignments are configured for the managed identity. [Configure settings for $convert-data](convert-data-configuration.md)

## Next steps
[Overview of $convert-data](convert-data-overview.md)

[Configure settings for $convert-data by using the Azure portal](convert-data-configuration.md)

[$convert-data-faq](convert-data-faq.md).

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
