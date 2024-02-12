---
title: Troubleshoot $convert-data - Azure Health Data Services
description: Learn how to troubleshoot $convert-data.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.topic: troubleshooting
ms.date: 08/28/2023
ms.author: jasteppe
---

# Troubleshoot $convert-data

In this article, learn how to troubleshoot `$convert-data`.

## Performance
Two main factors come into play that determine how long a `$convert-data` operation call can take:

* The size of the message.
* The complexity of the template. 

Any loops or iterations in the templates can have large impacts on performance. The `$convert-data` operation has a post processing step that is run after the template is applied.  In particular, the deduping step can mask template issues that cause performance problems. Updating the template so duplicates aren’t generated can greatly increase performance. For more information and details about the post processing step, see [Post processing](#post-processing).

## Post processing
The `$convert-data` operation applies post processing logic after the template is applied to the input. This post processing logic can result in the output looking different or unexpected errors compared to if you ran the default Liquid template directly. Post processing ensures the output is valid JSON and removes any duplicates based on the ID properties generated for resources in the template. To see the post processing logic in more detail, see the [FHIR-Converter GitHub repository](https://github.com/microsoft/FHIR-Converter/blob/main/src/Microsoft.Health.Fhir.Liquid.Converter/OutputProcessors/PostProcessor.cs).

## Message size
There currently isn’t a hard limit on the size of the messages allowed for the `$convert-data` operation, however, for content with a request size  greater than 10 MB, server 500 errors are possible. If you're receiving 500 server errors, ensure your requests are under 10 MB. 

## Default templates and customizations
Default template implementations for many common scenarios can be found on the [FHIR-Converter GitHub repository](https://github.com/microsoft/FHIR-Converter/tree/main/data/Templates). The default templates can be used as a guide and reference for customizing and creating your own templates. In addition to the default templates, the `$convert-data` operation supports several customer Liquid [filters and tags](https://github.com/microsoft/FHIR-Converter/blob/main/docs/Filters-and-Tags.md) that help simplify common scenarios. 

## Debugging and testing
In addition to testing templates on an instance of the service, a [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) is available. The extension can be used to modify templates and test them with sample data payloads.  There are also several existing test scenarios in the [FHIR Converter GitHub repository](https://github.com/microsoft/FHIR-Converter/tree/main/src/Microsoft.Health.Fhir.Liquid.Converter.FunctionalTests) that can be used as a reference.
 
## Next steps
In this article, you learned how to troubleshoot `$convert-data`.

For an overview of `$convert-data`, see 

> [!div class="nextstepaction"]  
> [Overview of $convert-data](overview-of-convert-data.md)

To learn how to configure settings for `$convert-data` using the Azure portal, see
 
> [!div class="nextstepaction"]
> [Configure settings for $convert-data using the Azure portal](configure-settings-convert-data.md)

To learn about the frequently asked questions (FAQs) for `$convert-data`, see
 
> [!div class="nextstepaction"]
> [Frequently asked questions about $convert-data](frequently-asked-questions-convert-data.md).
