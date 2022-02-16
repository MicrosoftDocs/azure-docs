---
title: Exporting de-identified data for FHIR service
description: This article describes how to set up and use de-identified export
author: ranvijaykumar
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 02/15/2022
ms.author: ranku
---
# Exporting de-identified data

> [!Note] 
> Results when using the de-identified export will vary based on factors such as data inputted, and functions selected by the customer. Microsoft is unable to evaluate the de-identified export outputs or determine the acceptability for customer's use cases and compliance needs. The de-identified export is not guaranteed to meet any specific legal, regulatory, or compliance requirements.

The $export command can also be used to export de-identified data from the FHIR server. It uses the anonymization engine from [FHIR tools for anonymization](https://github.com/microsoft/FHIR-Tools-for-Anonymization), and takes anonymization config details in query parameters. You can create your own anonymization config file or use the [sample config file](https://github.com/microsoft/Tools-for-Health-Data-Anonymization/blob/master/docs/FHIR-anonymization.md#sample-configuration-file) for HIPAA Safe Harbor method as a starting point. 

## Configuration file

The anonymization engine comes with a sample configuration file to help meet the requirements of HIPAA Safe Harbor Method. The configuration file is a JSON file with four sections: `fhirVersion`, `processingErrors`, `fhirPathRules`, `parameters`. 
* `fhirVersion` specifies the FHIR version for the anonymization engine.
* `processingErrors` specifies what action to take for the processing errors that may arise during the anonymization. You can _raise_ or _keep_ the exceptions based on your needs.
* `fhirPathRules` specifies which anonymization method is to be used. The rules are executed in the order of appearance in the configuration file.
* `parameters` sets rules for the anonymization behaviors specified in _fhirPathRules_.

Here's a sample configuration file for R4:

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

For more detailed information on each of these four sections of the configuration file, select [here](https://github.com/microsoft/Tools-for-Health-Data-Anonymization/blob/master/docs/FHIR-anonymization.md#configuration-file-format).
## Using $export command for the de-identified data
 `https://<<FHIR service base URL>>/$export?_container=<<container_name>>&_anonymizationConfig=<<config file name>>&_anonymizationConfigEtag=<<ETag on storage>>`

> [!Note] 
> Right now the FHIR service only supports de-identified export at the system level ($export).

|Query parameter            | Example |Optionality| Description|
|---------------------------|---------|-----------|------------|
| _\_anonymizationConfig_   |DemoConfig.json|Required for de-identified export |Name of the configuration file. See the configuration file format [here](https://github.com/microsoft/FHIR-Tools-for-Anonymization#configuration-file-format). This file should be kept inside a container named **anonymization** within the same Azure storage account that is configured as the export location. |
| _\_anonymizationConfigEtag_|"0x8D8494A069489EC"|Optional for de-identified export|This is the Etag of the configuration file. You can get the Etag using Azure Storage Explorer from the blob property|

> [!IMPORTANT]
> Both raw export as well as de-identified export writes to the same Azure storage account specified as part of export configuration. It is recommended that you use different containers corresponding to different de-identified config and manage user access at the container level.

## Next steps

In this article, you've learned how to set up and use de-identified export. For more information about how to export FHIR data, see
 
>[!div class="nextstepaction"]
>[Export data](export-data.md)
