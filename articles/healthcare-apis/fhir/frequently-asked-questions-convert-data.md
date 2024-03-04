---
title: Frequently asked questions about $convert-data - Azure Health Data Services
description: Learn about the $convert-data frequently asked questions (FAQs).
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.topic: faq
ms.date: 08/03/2023
ms.author: jasteppe
---

# Frequently asked questions about $convert-data

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

## $convert-data: The basics

## Does your service create/manage the entire ETL pipeline for me?

You can use the `$convert-data` endpoint as a component within an ETL (extract, transform, and load) pipeline for the conversion of health data from various formats (for example: HL7v2, CCDA, JSON, and FHIR STU3) into the [FHIR format](https://www.hl7.org/fhir/R4/). You can create an ETL pipeline for a complete workflow as you convert your health data. We recommend that you use an ETL engine that's based on [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) or [Azure Data Factory](../../data-factory/introduction.md). As an example, a workflow might include: data ingestion, performing `$convert-data` operations, validation, data pre/post processing, data enrichment, data deduplication, and loading the data for persistence in the [FHIR service](overview.md). 

However, the `$convert-data` operation itself isn't an ETL pipeline.

## How can I persist the data into the FHIR service?

You can use the FHIR service's APIs to persist the converted data into the FHIR service by using `POST {{fhirUrl}}/{{FHIR resource type}}` with the request body containing the FHIR resource to be persisted in JSON format. 

* For more information about using Postman with the FHIR service, see [Access the Azure Health Data Services FHIR service using Postman](use-postman.md).

## Is there a difference in the experience of the $convert-data endpoint in Azure API for FHIR versus in the Azure Health Data Services?

The experience and core `$convert-data` operation functionality is similar for both [Azure API for FHIR](../../healthcare-apis/azure-api-for-fhir/overview.md) and the [Azure Health Data Services FHIR service](../../healthcare-apis/fhir/overview.md). The only difference exists in the setup for the Azure API for FHIR version of the `$convert-data` operation, which requires assigning permissions to the right resources. For more information about `$convert-data` operation versions, see:

* [Azure API for FHIR: Data conversion for Azure API for FHIR](../../healthcare-apis/azure-api-for-fhir/convert-data.md)

* [Azure Health Data Services: Overview of $convert-data](overview-of-convert-data.md)

## I'm not familiar with Liquid templates. Where do I start?

[Liquid](https://shopify.github.io/liquid/) is a template language/engine that allows displaying data in a template. Liquid has constructs such as output, logic, loops and deals with variables. Liquid files are a mixture of HTML and Liquid code, and have the `.liquid` file extension. The open source FHIR Converter comes with a few ready to use [Liquid templates and custom filters](https://github.com/microsoft/FHIR-Converter/tree/main/data/Templates) for the supported conversion formats to help you get started.

## The conversion succeeded, does this mean I have a valid FHIR bundle?

The outcome of FHIR conversion is a FHIR Bundle as a batch. 
* The FHIR Bundle should align with the expectations of the FHIR R4 specification - [Bundle - FHIR v4.0.1](http://hl7.org/fhir/R4/Bundle.html).
* If you're trying to validate against a specific profile, you need to do some post processing by utilizing the FHIR [`$validate`](validation-against-profiles.md) operation.

## Can I customize a default Liquid template? 

Yes. You can use the [FHIR Converter Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) to customize templates according to your specific requirements. The extension provides an interactive editing experience and makes it easy to download Microsoft-published templates and sample data. The FHIR Converter extension for Visual Studio Code is available for HL7v2, C-CDA, and JSON Liquid templates. FHIR STU3 to FHIR R4 Liquid templates are currently not supported. For more information about setting up custom templates, see [Configure settings for $convert-data using the Azure portal](configure-settings-convert-data.md).

## Once I customize a template, is it possible to reference and store various versions of the template?

Yes. It’s possible to store and reference custom templates. See [Configure settings for $convert-data using the Azure portal](configure-settings-convert-data.md) for instructions to reference and store various versions of custom templates.

## If I need support troubleshooting issues, where can I go?

Depending on the version of `$convert-data` you’re using, you can:

* Use the [troubleshooting guide](troubleshoot-convert-data.md) for the Azure Health Data Service FHIR service version of the `$convert-data` operation.

* Open a [support request](../../azure-portal/supportability/how-to-create-azure-support-request.md) for the Azure Health Data Service FHIR service version of the `$convert-data` operation.

* Leave a comment on the [GitHub repository](https://github.com/microsoft/FHIR-Converter/issues) for the open source version of the FHIR Converter.

## Next steps

In this article, you learned about the frequently asked questions (FAQs) about the `$convert-data` operation and endpoint for converting health data into FHIR by using the FHIR service in Azure Health Data Services. 

For an overview of `$convert-data`, see
 
> [!div class="nextstepaction"]
> [Overview of $convert-data](overview-of-convert-data.md)

To learn how to configure settings for `$convert-data` using the Azure portal, see
 
> [!div class="nextstepaction"]
> [Configure settings for $convert-data using the Azure portal](configure-settings-convert-data.md)

To learn how to troubleshoot `$convert-data`, see
 
> [!div class="nextstepaction"]
> [Troubleshoot $convert-data](troubleshoot-convert-data.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
 