---
title: Converter redirect statement
author: msjasteppe
ms.service: healthcare-apis
ms.topic: include
ms.date: 05/06/2024
ms.author: jasteppe
---

> [!NOTE]
> In May 2024 we released a stand-alone FHIR converter API decoupled from the FHIR service and packaged as a [container (Docker) image](https://mcr.microsoft.com/product/healthcareapis/fhir-converter/about) for **preview**. In addition to enabling you to convert data from the source of record to FHIR R4 bundles, the FHIR converter offers many net new capabilities, such as:
> - Bidirectional data conversion from source of record to FHIR R4 bundles and back. For example, the FHIR converter can convert data from FHIR R4 format back to HL7v2 format.
> - Improved experience for customization of default [Liquid](https://shopify.github.io/liquid/) templates. 
> - Samples that demonstrate how to create an ETL (extract, transform, load) pipeline with [Azure Data Factory (ADF)](../../data-factory/introduction.md).
> 
> To implement the FHIR converter container image, see the [FHIR converter GitHub project](https://github.com/microsoft/fhir-converter).