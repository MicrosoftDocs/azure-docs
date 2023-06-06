---
title: Frequently asked questions about convert-data - Azure Health Data Services
description: Learn about the convert-data frequently asked questions.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.topic: faq
ms.date: 06/06/2023
ms.author: jasteppe
---

# Frequently asked questions about convert-data

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

## Convert-data: The basics

### How do I debug an error that I am seeing in the convert service? 

### How do I ensure mapping parity across templates? 

### Does your service create/manage the entire ETL pipeline for me? 

You can use the $convert-data endpoint as a component within an ETL (extract, transform, load) pipeline for the conversion of health data formats into the FHIR format. However, the $convert-data operation is not an ETL pipeline in itself. For a complete workflow as you convert your data to FHIR, we recommend that you use an ETL engine that's based on Azure Logic Apps or Azure Data Factory. The workflow might include: data reading and ingestion, data validation, making $convert-data API calls, data pre/post-processing, data enrichment, data deduplication, and loading the data for persistence in the FHIR service.

### After I set up the service, what exactly do I have to take on in post processing? 

### Can I take converted FHIR messages and place them back to source of record? 

### What’s the migration path from R4 to R5? 

### I am not familiar with liquid templates. Where do I start?

Liquid is a template language/engine that allows us to display data in a template. It has constructs such as output, logic, loops and deals with variables. Liquid files are a mixture of HTML and Liquid code, and have the **.liquid** file extension. For more information, see [Liquid template language](https://shopify.github.io/liquid/).

The FHIR Converter comes with a few ready to use Liquid templates (and custom [filters](https://github.com/microsoft/FHIR-Converter/blob/main/docs/Filters-and-Tags.md)) for the supported conversion formats. To get started with the Liquid templates, see [FHIR-Converter templates](https://github.com/microsoft/FHIR-Converter/tree/main/data/Templates).
 

### How do I build a custom ACR template (note: we should include information on the actual command used to create the ACR container. It is not intuitive from reading the OSS docs so we should update the OSS docs as well) 

## Next steps

In this article, you've learned about the frequently asked questions about the `$convert-data` endpoint for converting health data to FHIR by using the FHIR service in Azure Health Data Services. 

For information about how to export FHIR data from the FHIR service, see:
 
>[!div class="nextstepaction"]
>[Export data](export-data.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
 