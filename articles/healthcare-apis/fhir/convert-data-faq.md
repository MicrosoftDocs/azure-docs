---
title: $convert-data FAQ for the FHIR service in Azure Health Data Services
description: Get answers to frequently asked questions about the $convert-data operation.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.topic: faq
ms.date: 05/13/2024
ms.author: jasteppe
---

# $convert-data FAQ

## What's the difference between $convert-data and the FHIR converter?

The [FHIR&reg; converter (preview)](https://mcr.microsoft.com/product/healthcareapis/fhir-converter/about) is a stand-alone API decoupled from the FHIR service and packaged as a container (Docker) image. In addition to enabling you to convert data from the source of record to FHIR R4 bundles, the FHIR converter offers many net new capabilities, such as:

- Bidirectional data conversion from source of record to FHIR R4 bundles and back. For example, the FHIR converter can convert data from FHIR R4 format back to HL7v2 format.
- Improved experience for customization of default [Liquid](https://shopify.github.io/liquid/) templates. 
- Samples that demonstrate how to create an ETL (extract, transform, load) pipeline with [Azure Data Factory (ADF)](../../data-factory/introduction.md).
 
To implement the FHIR converter container image, see the [FHIR converter GitHub project](https://github.com/microsoft/fhir-converter).

## Does your service create and manage the entire ETL pipeline for me?

You can use the `$convert-data` endpoint as a component within an ETL (extract, transform, and load) pipeline for the conversion of health data from various formats (for example: HL7v2, CCDA, JSON, and FHIR; STU3) into the [FHIR format](https://www.hl7.org/fhir/R4/). You can create an ETL pipeline for a complete workflow as you convert your health data. We recommend that you use an ETL engine based on [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) or [Azure Data Factory](../../data-factory/introduction.md). For example, a workflow might include: data ingestion, performing `$convert-data` operations, validation, data pre- and post- processing, data enrichment, data deduplication, and loading the data for persistence in the [FHIR service](overview.md). 

However, the `$convert-data` operation itself isn't an ETL pipeline.

## Where can I find an example of an ETL pipeline? 

There's an example published in the [Azure Data Factory template gallery](../../data-factory/solution-templates-introduction.md#template-gallery) named **Transform HL7v2 health data to FHIR R4 format and write to ADLS Gen2**. This template transforms HL7v2 messages read from an Azure Data Lake Storage (ADLS) Gen2 or an Azure Blob Storage account into the FHIR R4 format. It then persists the transformed FHIR bundle JSON file into an ADLS Gen2 or a Blob Storage account. When you’re in the Azure Data Factory template gallery, you can search for the template.

> [!IMPORTANT]
> The purpose of this template is to help you get started with an ETL pipeline. Any steps in this pipeline can be removed, added, edited, or customized to fit your needs.  
>
> In a scenario with batch processing of HL7v2 messages, this template doesn't take sequencing into account. Post processing is needed if sequencing is a requirement. 

## How can I persist the converted data into the FHIR service by using Postman?

You can use the FHIR service's APIs to persist the converted data into the FHIR service by using `POST {{fhirUrl}}/{{FHIR resource type}}` with the request body containing the FHIR resource to be persisted in JSON format. 

For more information, see [Access the FHIR service in Azure Health Data Services by using Postman](use-postman.md).

## What's the difference between the $convert-data endpoint in Azure API for FHIR versus the FHIR service in Azure Health Data Services?

The experience and core `$convert-data` operation functionality is similar for both Azure API for FHIR and the FHIR service in Azure Health Data Services(../../healthcare-apis/fhir/overview.md). The only difference exists in the setup for the Azure API for FHIR version of the `$convert-data` operation, which requires assigning permissions to the right resources. 

Learn more:

[Azure API for FHIR: Data conversion for Azure API for FHIR](../../healthcare-apis/azure-api-for-fhir/convert-data.md)

[FHIR service in Azure Health Data Services: Overview of $convert-data](convert-data-overview.md)

## I'm not familiar with Liquid templates. Where do I start?

[Liquid](https://shopify.github.io/liquid/) is a template language engine that allows displaying data in a template. Liquid has constructs such as output, logic, loops, and deals with variables. Liquid files are a mixture of HTML and Liquid code, and have the `.liquid` file extension. The open source FHIR Converter comes with a few ready-to-use [Liquid templates and custom filters](https://github.com/microsoft/FHIR-Converter/tree/main/data/Templates) for the supported conversion formats to help you get started.

## The conversion succeeded. Does this mean I have a valid FHIR bundle?

The outcome of FHIR conversion is a FHIR bundle as a batch. 
* The FHIR bundle should align with the expectations of the FHIR R4 specification - [Bundle - FHIR v4.0.1](http://hl7.org/fhir/R4/Bundle.html).
* If you're trying to validate against a specific profile, you need to do some post processing by utilizing the FHIR [`$validate`](validation-against-profiles.md) operation.

## Can I customize a default Liquid template? 

Yes. You can use the [FHIR Converter Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) to customize templates according to your specific requirements. The extension provides an interactive editing experience and makes it easy to download Microsoft-published templates and sample data. The FHIR Converter extension for Visual Studio Code is available for HL7v2, C-CDA, and JSON Liquid templates. FHIR STU3 to FHIR R4 Liquid templates are currently not supported. For more information, see [Configure settings for $convert-data using the Azure portal](convert-data-configuration.md).

## After I customize a template, can I reference and store various versions?

Yes. It’s possible to store and reference custom templates. For more information, see [Configure settings for $convert-data by using the Azure portal](convert-data-configuration.md).

## If I need support with troubleshooting, where can I go?

Depending on the version of `$convert-data` you’re using, you can:

* Use the [troubleshooting guide](convert-data-troubleshoot.md) for the FHIR service in Azure Health Data Services version of the `$convert-data` operation.

* Open a [support request](../../azure-portal/supportability/how-to-create-azure-support-request.md) for the FHIR service in Azure Health Data Service FHIR Services version of the `$convert-data` operation.

* Leave a comment on the [GitHub repository](https://github.com/microsoft/FHIR-Converter/issues) for the open source version of the FHIR converter.

## Next steps

[Overview of $convert-data](convert-data-overview.md)

[Configure settings for $convert-data using the Azure portal](convert-data-configuration.md)

[Troubleshoot $convert-data](convert-data-troubleshoot.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
