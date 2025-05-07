---
title: Overview of $convert-data for the FHIR service in Azure Health Data Services
description: Learn about the $convert-data operation in the FHIR service, a tool for transforming healthcare data across various formats into standardized FHIR R4 data. 
services: healthcare-apis
author: EXPEkesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: overview
ms.date: 05/13/2024
ms.author: kesheth
---

# $convert-data in the FHIR service

[!INCLUDE [Converter redirect statement](../includes/converter-redirect-statement.md)]

The `$convert-data` operation in the FHIR&reg; service enables you to convert health data from various formats into [FHIR R4](https://www.hl7.org/fhir/R4/index.html) data. The `$convert-data` operation uses [Liquid](https://shopify.github.io/liquid/) templates from the [FHIR Converter](https://github.com/microsoft/FHIR-Converter) project for FHIR data conversion. You can customize these conversion templates as needed. 

The `$convert-data` operation supports four types of data conversion: 

- HL7v2 to FHIR R4
- C-CDA to FHIR R4
- JSON to FHIR R4 (intended for custom conversion mappings)
- FHIR STU3 to FHIR R4

## Use the $convert-data endpoint

 Use the `$convert-data` endpoint as a component within an ETL (extract, transform, and load) pipeline for the conversion of health data from various formats (for example: HL7v2, CCDA, JSON, and FHIR STU3) into the [FHIR format](https://www.hl7.org/fhir/R4/). Create an ETL pipeline for a complete workflow as you convert your health data. We recommend that you use an ETL engine based on [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) or [Azure Data Factory](../../data-factory/introduction.md). For example, a workflow might include data ingestion, performing `$convert-data` operations, validation, data pre- and post-processing, data enrichment, data deduplication, and loading data for persistence in the [FHIR service](overview.md). 

The `$convert-data` operation is integrated into the FHIR service as a REST API action. You can call the `$convert-data` endpoint as follows:

`POST {{fhirurl}}/$convert-data`

The health data for conversion is delivered to the FHIR service in the body of the `$convert-data` request. If the request is successful, the FHIR service returns a [FHIR bundle](https://www.hl7.org/fhir/R4/bundle.html) response with the data converted to FHIR R4.

##  Parameters

A `$convert-data` operation call packages the health data for conversion inside JSON-formatted [parameters](http://hl7.org/fhir/parameters.html) in the body of the request. The parameters are described in the following table.

| Parameter name | Description&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Accepted values |
| -------------- | ----------------------------------------------------------------------- | --------------- |
| inputData      | Data payload to be converted to FHIR. | For `Hl7v2`: string <br> For `Ccda`: XML <br> For `Json`: JSON <br> For `FHIR STU3`: JSON|
| inputDataType   | Type of data input. | `Hl7v2`, `Ccda`, `Json`, `Fhir` |
| templateCollectionReference | Reference to an [OCI image](https://github.com/opencontainers/image-spec) template collection in [Azure Container Registry](https://azure.microsoft.com/services/container-registry/). The reference is to an image that contains Liquid templates to use for conversion. It can refer either to default templates or to a custom template image registered within the FHIR service. The following sections cover customizing the templates, hosting them on Azure Container Registry, and registering to the FHIR service. | For **default/sample** templates: <br> **HL7v2** templates: <br>`microsofthealth/fhirconverter:default` <br>``microsofthealth/hl7v2templates:default``<br> **C-CDA** templates: <br> ``microsofthealth/ccdatemplates:default`` <br> **JSON** templates: <br> ``microsofthealth/jsontemplates:default`` <br> **FHIR STU3** templates: <br> ``microsofthealth/stu3tor4templates:default`` <br><br> For **custom** templates: <br> `<RegistryServer>/<imageName>@<imageDigest>`, `<RegistryServer>/<imageName>:<imageTag>` |
| rootTemplate | The root template to use while transforming the data. | For **HL7v2**:<br> ADT_A01, ADT_A02, ADT_A03, ADT_A04, ADT_A05, ADT_A08, ADT_A11,  ADT_A13, ADT_A14, ADT_A15, ADT_A16, ADT_A25, ADT_A26, ADT_A27, ADT_A28, ADT_A29, ADT_A31, ADT_A47, ADT_A60, OML_O21, ORU_R01, ORM_O01, VXU_V04, SIU_S12, SIU_S13, SIU_S14, SIU_S15, SIU_S16, SIU_S17, SIU_S26, MDM_T01, MDM_T02 <br><br> For **C-CDA**:<br> CCD, ConsultationNote, DischargeSummary, HistoryandPhysical, OperativeNote, ProcedureNote, ProgressNote, ReferralNote, TransferSummary <br><br> For **JSON**: <br> ExamplePatient, Stu3ChargeItem <br><br> For **FHIR STU3**: <br> FHIR STU3 resource name (for example: Patient, Observation, Organization) <br> |

## Considerations

- **FHIR STU3 to FHIR R4 templates are Liquid templates** that provide mappings of field differences only between a FHIR STU3 resource and its equivalent resource in the FHIR R4 specification. Some of the FHIR STU3 resources are renamed or removed from FHIR R4. For more information about the resource differences and constraints for FHIR STU3 to FHIR R4 conversion, see [Resource differences and constraints for FHIR STU3 to FHIR R4 conversion](https://github.com/microsoft/FHIR-Converter/blob/main/docs/Stu3R4-resources-differences.md).

- **JSON templates are sample templates for use in building your own conversion mappings.** They aren't default templates that adhere to any predefined health data message types. JSON itself isn't specified as a health data format, unlike HL7v2 or C-CDA. As a result, instead of providing default JSON templates, we provide some sample JSON templates as a starting point for your own customized mappings.

> [!WARNING]
> Default templates are released under the MIT License and aren't supported by Microsoft.
>
> The default templates are provided only to help you get started with your data conversion workflow. These default templates are not intended for production and might change when Microsoft releases updates for the FHIR service. To have consistent data conversion behavior across different versions of the FHIR service, you must do the following:
>
> 1. Host your own copy of the templates in an Azure Container Registry instance.
> 2. Register the templates to the FHIR service. 
> 3. Use your registered templates in your API calls.
> 4. Verify that the conversion behavior meets your requirements.
>
> For more information on hosting your own templates, see [Host your own templates](convert-data-configuration.md#host-your-own-templates) 

#### Sample request

```json
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "inputData",
            "valueString": "MSH|^~\\&|SIMHOSP|SFAC|RAPP|RFAC|20200508131015||ADT^A01|517|T|2.3|||AL||44|ASCII\nEVN|A01|20200508131015|||C005^Whittingham^Sylvia^^^Dr^^^DRNBR^D^^^ORGDR|\nPID|1|3735064194^^^SIMULATOR MRN^MRN|3735064194^^^SIMULATOR MRN^MRN~2021051528^^^NHSNBR^NHSNMBR||Kinmonth^Joanna^Chelsea^^Ms^^D||19870624000000|F|||89 Transaction House^Handmaiden Street^Wembley^^FV75 4GJ^GBR^HOME||020 3614 5541^PRN|||||||||C^White - Other^^^||||||||\nPD1|||FAMILY PRACTICE^^12345|\nPV1|1|I|OtherWard^MainRoom^Bed 183^Simulated Hospital^^BED^Main Building^4|28b|||C005^Whittingham^Sylvia^^^Dr^^^DRNBR^D^^^ORGDR|||CAR|||||||||16094728916771313876^^^^visitid||||||||||||||||||||||ARRIVED|||20200508131015||"
        },
        {
            "name": "inputDataType",
            "valueString": "Hl7v2"
        },
        {
            "name": "templateCollectionReference",
            "valueString": "microsofthealth/fhirconverter:default"
        },
        {
            "name": "rootTemplate",
            "valueString": "ADT_A01"
        }
    ]
}
```

#### Sample response

```json
{
    "resourceType": "Bundle",
    "type": "batch",
    "entry": [
        {
            "fullUrl": "urn:uuid:9d697ec3-48c3-3e17-db6a-29a1765e22c6",
            "resource": {
                "resourceType": "Patient",
                "id": "9d697ec3-48c3-3e17-db6a-29a1765e22c6",
          ...
          ...
            },
            "request": {
                "method": "PUT",
                "url": "Location/50becdb5-ff56-56c6-40a1-6d554dca80f0"
            }
        }
    ]
}
```

The outcome of FHIR conversion is a FHIR bundle as a batch. 
* The FHIR bundle should align with the expectations of the FHIR R4 specification - [Bundle - FHIR v4.0.1](http://hl7.org/fhir/R4/Bundle.html).
* If you're trying to validate against a specific profile, you need to do some post processing by utilizing the FHIR [$validate](validation-against-profiles.md) operation.

## Next steps

[Configure settings for $convert-data using the Azure portal](convert-data-configuration.md)

[Troubleshoot $convert-data](convert-data-troubleshoot.md)

[$convert-data FAQ](convert-data-faq.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
 
