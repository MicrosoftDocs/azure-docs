---
title: Executing the export by invoking $export command on Azure API for FHIR
description: This article describes how to set up and use de-identified export
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 8/26/2020
ms.author: matjazl
---
# How to export FHIR data

For configuring export settings and creating Azure storage account, please refer to [here](configure-export-data.md).

## Exporting FHIR resources using $export command

After we have configured Azure API for FHIR for export, we can now go and use the $export command to export the data out of the service into the storage account we specified while configuring export. To learn how to invoke $export command in FHIR server, please read documentation on $export specification at [https://hl7.org/Fhir/uv/bulkdata/export/index.html](https://hl7.org/Fhir/uv/bulkdata/export/index.html). 

The $export command in Azure API for FHIR takes an optional _\_conatiner_ parameter that can be used to specify the container within the configured storage account to which the data should be exported.

`https://<<FHIR service base URL>>/$export?_container=<<container_name>>`

> [!IMPORTANT]
> Note that currently Azure API for FHIR only supports system level export as defined in $export specification at [https://hl7.org/Fhir/uv/bulkdata/export/index.html](https://hl7.org/Fhir/uv/bulkdata/export/index.html). Also, only _\_since_ query parameter is currently supported.

## Exporting de-identified data (preview)

The $export command can also be used to export de-identified data from the FHIR server. It uses the anonymization engine from [FHIR tools for anonymization](https://github.com/microsoft/FHIR-Tools-for-Anonymization), and takes anonymization config details in query parameters. You can create your own anonymization config file or use the [sample config file](https://github.com/microsoft/FHIR-Tools-for-Anonymization#sample-configuration-file-for-hipaa-safe-harbor-method) for HIPAA Safe Harbor method as a starting point. 

 `https://<<FHIR service base URL>>/$export?_container=<<container_name>>&_anonymizationConfig=<<config file name>>&_anonymizationConfigEtag=<<ETag on storage>>`

|Query parameter            | Example |Optionality| Description|
|---------------------------|---------|-----------|------------|
| _\_anonymizationConfig_   |DemoConfig.json|Required for de-identified export |Name of the configuration file. See the configuration file format [here](https://github.com/microsoft/FHIR-Tools-for-Anonymization#configuration-file-format). This file should be kept inside a container named **anonymization** within the same Azure storage account that is configured as the export location. |
| _\_anonymizationConfigEtag_|"0x8D8494A069489EC"|Optional for de-identified export|This is the Etag of the configuration file. You can get the Etag using Azure Storage Explorer from the blob property|

> [!IMPORTANT]
> Note that both raw export as well as de-identified export writes to the same Azure storage account specified as part of export configuration. It is recommended that you use different containers corresponding to different de-identified config and manage user access at the container level.

## Next steps

In this article, you learned how to exporting FHIR resources using $export command, including de-identified data. Next, you can configure your export data:
 
>[!div class="nextstepaction"]
>[configure export data](configure-export-data.md)
