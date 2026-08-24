---
title: Troubleshoot $convert-data in Azure Health Data Services
description: "Troubleshoot $convert-data errors and performance issues. Resolve conversion problems faster with step-by-step guidance."
services: healthcare-apis
author: EXPEkesheth
ms.service: azure-health-data-services
ms.topic: troubleshooting
ms.date: 06/25/2026
ms.author: kesheth
ai-uage: ai-assisted
---

# Troubleshoot $convert-data

Use this article to troubleshoot `$convert-data` performance problems, server errors, and date conversion behavior so you can resolve problems faster.

## Performance

Two main factors determine how long a `$convert-data` operation call can take:

* The size of the message.
* The complexity of the template. 

Any loops or iterations in the templates can affect performance. The `$convert-data` operation has a post processing step that runs after the template is applied. In particular, the deduping step can mask template problems that cause performance problems. Updating the template so it doesn't generate duplicates can greatly increase performance. For more information and details about the post processing step, see [Post processing](#post-processing).

## Post processing

The `$convert-data` operation applies post processing logic after the template is applied to the input. This post processing logic can result in the output looking different, or unexpected errors compared to running the default Liquid template directly. Post processing ensures the output is valid JSON and removes any duplicates based on the ID properties generated for resources in the template. To see the post processing logic in more detail, see the [FHIR-Converter GitHub repository](https://github.com/microsoft/FHIR-Converter/blob/main/src/Microsoft.Health.Fhir.Liquid.Converter/OutputProcessors/PostProcessor.cs).

## Message size

There's no hard limit on the size of the messages allowed for the `$convert-data` operation. However, for content with a request size greater than 10 MB, server errors `500` are possible. If you receive `500` server errors, ensure your requests are under 10 MB.

## Template size and complexity

If you receive `504 Gateway Timeout` errors, template processing time might be the cause. Updating templates to reduce loops and iterations can greatly increase performance. Consider retrying your request with a smaller or simpler template. 

## Why are my dates converted when transforming JSON data?
 
Dates you supply within JSON data might be returned in a different format than what you supplied. During deserialization of the JSON payload, strings that are identified as dates are converted into .NET DateTime objects. These objects then get converted back to strings before going through the Liquid template engine. This conversion can reformat the date value and represent it in the local timezone of the FHIR service.

You can disable the coercion of strings to .NET DateTime objects by using the boolean parameter `jsonDeserializationTreatDatesAsStrings`. When set to `true`, the supplied data is treated as a string and isn't modified before being supplied to the Liquid engine. 

## Default templates and customizations

You can find default template implementations for many common scenarios on the [FHIR-Converter GitHub repository](https://github.com/microsoft/FHIR-Converter/tree/main/data/Templates). Use the default templates as a guide and reference for customizing and creating your own templates. In addition to the default templates, the `$convert-data` operation supports several customer Liquid [filters and tags](https://github.com/microsoft/FHIR-Converter/blob/main/docs/Filters-and-Tags.md) that help simplify common scenarios. 

## Debug and test templates

In addition to testing templates on an instance of the service, you can use a [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter). Use the extension to modify templates and test them with sample data payloads. There are also several existing test scenarios in the [FHIR Converter GitHub repository](https://github.com/microsoft/FHIR-Converter/tree/main/src/Microsoft.Health.Fhir.Liquid.Converter.FunctionalTests) that you can use as a reference.
 
## Troubleshoot Azure Container Registry

When you use Azure Container Registry (ACR) for custom template storage, if you encounter a **Failed to get access token for Azure Container Registry** error when reading templates, check to make sure that the correct role assignments are configured for the managed identity. [Configure settings for $convert-data](convert-data-configuration.md)

## Next steps

[Overview of $convert-data](convert-data-overview.md)

[Configure settings for $convert-data by using the Azure portal](convert-data-configuration.md)

[$convert-data-faq](convert-data-faq.md).

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
