---
title: Using the FHIR service to export de-identified data
description: This article describes how to set up and use de-identified export
author: ranvijaykumar
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/15/2022
ms.author: ranku
---
# Exporting de-identified data

> [!Note] 
> Results when using the FHIR service's de-identified export will vary based on the nature of the data being exported and what de-id functions are in use. Microsoft is unable to evaluate de-identified export outputs or determine the acceptability for customers' use cases and compliance needs. The FHIR service's de-identified export is not guaranteed to meet any specific legal, regulatory, or compliance requirements.

 The FHIR service is able to de-identify data on export when running an `$export` operation. For de-identified export, the FHIR service uses the anonymization engine from the [FHIR tools for anonymization](https://github.com/microsoft/FHIR-Tools-for-Anonymization) (OSS) project on GitHub. There is a [sample config file](https://github.com/microsoft/Tools-for-Health-Data-Anonymization/blob/master/docs/FHIR-anonymization.md#sample-configuration-file) to help you get started redacting/transforming FHIR data fields that contain personally identifying information. 

## Configuration file

The anonymization engine comes with a sample configuration file to help you get started with [HIPAA Safe Harbor Method](https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html#safeharborguidance) de-id requirements. The configuration file is a JSON file with four properties: `fhirVersion`, `processingErrors`, `fhirPathRules`, `parameters`. 
* `fhirVersion` specifies the FHIR version for the anonymization engine.
* `processingErrors` specifies what action to take for any processing errors that may arise during the anonymization. You can _raise_ or _keep_ the exceptions based on your needs.
* `fhirPathRules` specifies which anonymization method to use. The rules are executed in the order they appear in the configuration file.
* `parameters` sets additional controls for the anonymization behavior specified in _fhirPathRules_.

Here's a sample configuration file for FHIR R4:

```json
{
  "fhirVersion": "R4",
  "processingError":"raise",
  "fhirPathRules": [
    {"path": "nodesByType('Extension')", "method": "redact"},
    {"path": "Organization.identifier", "method": "keep"},
    {"path": "nodesByType('Address').country", "method": "keep"},
    {"path": "Resource.id", "method": "cryptoHash"},
    {"path": "nodesByType('Reference').reference", "method": "cryptoHash"},
    {"path": "Group.name", "method": "redact"}
  ],
  "parameters": {
    "dateShiftKey": "",
    "cryptoHashKey": "",
    "encryptKey": "",
    "enablePartialAgesForRedact": true
  }
}
```

For detailed information on the settings within the configuration file, visit [here](https://github.com/microsoft/Tools-for-Health-Data-Anonymization/blob/master/docs/FHIR-anonymization.md#configuration-file-format). 

## Using the `$export` endpoint for de-identifying data 

The API call below demonstrates how to form a request for de-id on export from the FHIR service.

```
GET https://<<FHIR service base URL>>/$export?_container=<<container_name>>&_anonymizationConfig=<<config file name>>&_anonymizationConfigEtag=<<ETag on storage>>
```

You will need to create a container for the de-identified export in your ADLS Gen2 account and specify the `<<container_name>>` in the API request as shown above. Additionally, you will need to place the JSON config file with the anonymization rules inside the container and specify the `<<config file name>>` in the API request (see above). 

> [!Note] 
> It is common practice to name the container `anonymization`. The JSON file within the container is often named `anonymizationConfig.json`.

> [!Note] 
> Right now the FHIR service only supports de-identified export at the system level (`$export`).

|Query parameter            | Example |Optionality| Description|
|---------------------------|---------|-----------|------------|
| `anonymizationConfig`   |`anonymizationConfig.json`|Required for de-identified export |Name of the configuration file. See the configuration file format [here](https://github.com/microsoft/FHIR-Tools-for-Anonymization#configuration-file-format). This file should be kept inside a container named `anonymization` within the configured ADLS Gen2 account. |
| `anonymizationConfigEtag`|"0x8D8494A069489EC"|Optional for de-identified export|This is the Etag of the configuration file. You can get the Etag from the blob property using Azure Storage Explorer.|

> [!IMPORTANT]
> Both the raw export and de-identified export operations write to the same Azure storage account specified in the export configuration for the FHIR service. If you have need for multiple de-identification configurations, it is recommended that you create a different container for each configuration and manage user access at the container level.

## Next steps

In this article, you've learned how to set up and use the de-identified export feature in the FHIR service. For more information about how to export FHIR data, see
 
>[!div class="nextstepaction"]
>[Export data](export-data.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.