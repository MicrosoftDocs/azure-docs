---
title: Troubleshoot convert-data - Azure Health Data Services
description: Learn how to troubleshoot and fix convert-data.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 05/30/2023
ms.author: jasteppe
---

# Troubleshoot convert-data

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

## Troubleshooting steps

## Performance 

Two main factors come into play that determine how long a convert operation call can take.  The size of the message and the complexity of the template.  Any loops or iterations in the templates can have large impacts on performance.  It is also important to call out the converter has a post processing step that is run after the template is applied.  In particular, the de-duping step can mask template issues that cause performance problems.  Updating the template so duplicates aren’t generated can greatly increase performance.  See the post processing step for more details. 

## Post Processing 

The converter applies post processing logic after the template is applied to the input.  This can result in the output looking different or unexpected errors compared to if you ran the Liquid template directly.  Post processing ensures the output is valid JSON and removes any duplicates based on the id properties generated for resources in the template.  To see the post processing logic in more detail please reference here. 

## Clear guidelines on performance thresholds   

OOM - message sizes  

Payload sizes 

Post processing time 

Customizations on templates  

Best practices: converter performance 

## Custom templates  

Need to set up expectations around custom templates  

How can customers include custom fields in their templates? 

Custom templates need to be linked to ACR  

Custom ACR - why you need to do that?  

OSS code- use this as a "base template" and then post process this way 

Structure of template: snippet of template  

Adding custom fields at the beginning of template (Pallavi IcM example) 

End output should be valid FHIR bundle 

## Custom Filters 

See https://github.com/microsoft/FHIR-Converter/blob/main/docs/Filters-and-Tags.md 

## Next steps

In this article, you've learned about the `$convert-data` endpoint for converting health data to FHIR by using the FHIR service in Azure Health Data Services. For information about how to export FHIR data from the FHIR service, see:
 
To learn how to configure your environment to use convert-data, see:
 
>[!div class="nextstepaction"]
>[Configure convert-data](configure-convert-data.md)

To learn how to troubleshoot convert-data, see:
 
>[!div class="nextstepaction"]
>[Troubleshoot convert-data](troubleshoot-convert-data.md)

To learn about the frequently asked questions (FAQs) for convert-data, see

To learn how to troubleshoot convert-data, see:
 
>[!div class="nextstepaction"]
>[Frequently asked questions about convert-data](frequently-asked-questions-convert-data.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
 