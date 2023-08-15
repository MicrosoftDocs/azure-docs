---
title: Using the FHIR service to export de-identified data
description: This article describes how to set up and use de-identified export
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/30/2022
ms.author: kesheth
---
# Exporting de-identified data

> [!NOTE] 
> Results when using the FHIR service's de-identified export will vary based on the nature of the data being exported and what de-id functions are in use. Microsoft is unable to evaluate de-identified export outputs or determine the acceptability for customers' use cases and compliance needs. The FHIR service's de-identified export is not guaranteed to meet any specific legal, regulatory, or compliance requirements.

 The FHIR service is able to de-identify data on export when running an `$export` operation. For de-identified export, the FHIR service uses the anonymization engine from the [FHIR tools for anonymization](https://github.com/microsoft/FHIR-Tools-for-Anonymization) (OSS) project on GitHub. There's a [sample config file](https://github.com/microsoft/Tools-for-Health-Data-Anonymization/blob/master/docs/FHIR-anonymization.md#sample-configuration-file) to help you get started redacting/transforming FHIR data fields that contain personally identifying information. 

## Configuration file

The anonymization engine comes with a sample configuration file to help you get started with [HIPAA Safe Harbor Method](https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html#safeharborguidance) de-id requirements. The configuration file is a JSON file with four properties: `fhirVersion`, `processingErrors`, `fhirPathRules`, `parameters`. 
* `fhirVersion` specifies the FHIR version for the anonymization engine.
* `processingErrors` specifies what action to take for any processing errors that may arise during the anonymization. You can _raise_ or _keep_ the exceptions based on your needs.
* `fhirPathRules` specifies which anonymization method to use. The rules are executed in the order they appear in the configuration file.
* `parameters` sets more controls for the anonymization behavior specified in _fhirPathRules_.

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

## Manage Configuration File in storage account
You need to create a container for the de-identified export in your ADLS Gen2 account and specify the `<<container_name>>` in the API request as shown. Additionally, you need to place the JSON config file with the anonymization rules inside the container and specify the `<<config file name>>` in the API request. 

> [!NOTE] 
> It is common practice to name the container `anonymization`. The JSON file within the container is often named `anonymizationConfig.json`.

## Manage Configuration File in ACR

It's recommended that you host the export configuration files on Azure Container Registry(ACR). It takes the following steps similar as [hosting templates in ACR for $convert-data](configure-settings-convert-data.md#host-your-own-templates).  
1. Push the configuration files to your Azure Container Registry.
2. Enable Managed Identity on your FHIR service instance.
3. Provide access of the ACR to the FHIR service Managed Identity.
4. Register the ACR servers in the FHIR service. You can use the portal to open "Artifacts" under "Transform and transfer data" section to add the ACR server.
5. Configure ACR firewall for secure access.

## Using the `$export` endpoint for de-identifying data
 `https://<<FHIR service base URL>>/$export?_container=<<container_name>>&_anonymizationConfigCollectionReference=<<ACR image reference>>&_anonymizationConfig=<<config file name>>&_anonymizationConfigEtag=<<ETag on storage>>`

> [!NOTE] 
> Right now the FHIR service only supports de-identified export at the system level (`$export`).

|Query parameter            | Example |Optionality| Description|
|---------------------------|---------|-----------|------------|
| _\_container_|exportContainer|Required|Name of container within the configured storage account where the data is exported. |
| _\_anonymizationConfigCollectionReference_|"myacr.azurecr.io/deidconfigs:default"|Optional|Reference to an OCI image on ACR containing de-id configuration files for de-id export (such as stu3-config.json, r4-config.json). The ACR server of the image should be registered within the FHIR service. (Format: `<RegistryServer>/<imageName>@<imageDigest>`, `<RegistryServer>/<imageName>:<imageTag>`) |
| _\_anonymizationConfig_   |`anonymizationConfig.json`|Required|Name of the configuration file. See the configuration file format [here](https://github.com/microsoft/FHIR-Tools-for-Anonymization#configuration-file-format). If _\_anonymizationConfigCollectionReference_ is provided, we'll search and use this file from the specified image.  Otherwise, we'll search and use this file inside a container named **anonymization** within the configured ADLS Gen2 account.|
| _\_anonymizationConfigEtag_|"0x8D8494A069489EC"|Optional|Etag of the configuration file, which can be obtained from the blob property in Azure Storage Explorer. Specify this parameter only if the configuration file is stored in Azure storage account. If you use ACR to host the configuration file, you shouldn't include this parameter.|

> [!IMPORTANT]
> Both the raw export and de-identified export operations write to the same Azure storage account specified in the export configuration for the FHIR service. If you have need for multiple de-identification configurations, it is recommended that you create a different container for each configuration and manage user access at the container level.

## Next steps

In this article, you've learned how to set up and use the de-identified export feature in the FHIR service. For more information about how to export FHIR data, see
 
>[!div class="nextstepaction"]
>[Export data](export-data.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
