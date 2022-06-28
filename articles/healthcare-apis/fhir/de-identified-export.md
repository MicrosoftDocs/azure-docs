---
title: Exporting de-identified data for FHIR service
description: This article describes how to set up and use de-identified export
author: ranvijaykumar
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 06/06/2022
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

## Manage Configuration File in ACR
It's recommended that you host the export configuration files on Azure Container Registry(ACR). It takes the following steps similar as [hosting templates in ACR for $convert-data](https://docs.microsoft.com/en-us/azure/healthcare-apis/fhir/convert-data#host-and-use-templates).  
1. Push the configuration files to your Azure Container Registry.
2. Enable Managed Identity on your FHIR service instance.
3. Provide access of the ACR to the FHIR service Managed Identity.
4. Register the ACR servers in the FHIR service. You can use the portal to open "Artifacts" blade under "Transform and transfer data" section to add the ACR server.
5. Optionally configure ACR firewall for secure access.

## Using $export command for the de-identified data
 `https://<<FHIR service base URL>>/$export?_container=<<container_name>>&_anonymizationConfigCollectionReference=<<ACR image reference>>&_anonymizationConfig=<<config file name>>&_anonymizationConfigEtag=<<ETag on storage>>`
> [!Note] 
> Right now the FHIR service only supports de-identified export at the system level ($export).

|Query parameter            | Example |Optionality| Description|
|---------------------------|---------|-----------|------------|
| _\_container_|exportContainer|Required|Name of container within the configured storage account where the data will be exported. |
| _\_anonymizationConfigCollectionReference_|"myacr.azurecr.io/deidconfigs:default"|Optional|Reference to an OCI image on ACR containing de-id configuration files for de-id export (such as stu3-config.json, r4-config.json). The ACR server of the image should be registered within the FHIR service. (Format: `<RegistryServer>/<imageName>@<imageDigest>`, `<RegistryServer>/<imageName>:<imageTag>`) |
| _\_anonymizationConfig_   |DemoConfig.json|Required|Name of the configuration file. See the configuration file format [here](https://github.com/microsoft/FHIR-Tools-for-Anonymization#configuration-file-format). If _\_anonymizationConfigCollectionReference_ is provided, we will search and use this file from the specified image.  Otherwise, we will search and use this file inside a container named **anonymization** within the same Azure storage account that is configured as the export location.|
| _\_anonymizationConfigEtag_|"0x8D8494A069489EC"|Optional|Etag of the configuration file which can be obtained from the blob property in Azure Storage Explorer. Specify this parameter only if the configuration file is stored in Azure storage account. If you use ACR to host the configuration file, you should not include this parameter.|


> [!IMPORTANT]
> Both raw export as well as de-identified export writes to the same Azure storage account specified as part of export configuration. It is recommended that you use different containers corresponding to different de-identified config and manage user access at the container level.

## Next steps

In this article, you've learned how to set up and use de-identified export. For more information about how to export FHIR data, see
 
>[!div class="nextstepaction"]
>[Export data](export-data.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
