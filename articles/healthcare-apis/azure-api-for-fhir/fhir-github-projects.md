---
title: Related GitHub Projects for Azure API for FHIR
description: List all Open Source (GitHub) repositories for Azure API for FHIR.
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 09/27/2023
ms.author: kesheth
---

# Related GitHub Projects

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

We have many open-source projects on GitHub that provide you the source code and instructions to deploy services for various uses. You're always welcome to visit our GitHub repositories to learn and experiment with our features and products. 

## FHIR Server

* [microsoft/fhir-server](https://github.com/microsoft/fhir-server/): open-source FHIR Server,  which is the basis for Azure API for FHIR
* To see the latest releases, refer to the [Release Notes](https://github.com/microsoft/fhir-server/releases)
* [microsoft/fhir-server-samples](https://github.com/microsoft/fhir-server-samples): a sample environment

## Data Conversion & Anonymization

#### FHIR Converter

* [microsoft/FHIR-Converter](https://github.com/microsoft/FHIR-Converter): a data conversion project that uses CLI tool and $convert-data FHIR endpoint to translate healthcare legacy data formats into FHIR
* Integrated with the FHIR service and FHIR server for Azure in the form of $convert-data operation
* Ongoing improvements in OSS, and continual integration to the FHIR servers
 
#### FHIR Converter - VS Code Extension

* [microsoft/vscode-azurehealthcareapis-tools](https://github.com/microsoft/vscode-azurehealthcareapis-tools): a VS Code extension that contains a collection of tools to work with FHIR Converter
* Released to Visual Studio Marketplace, you can install it here: [FHIR Converter VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter)
* Used for authoring Liquid conversion templates and managing templates on Azure Container Registry

#### FHIR Tools for Anonymization

* [microsoft/Tools-for-Health-Data-Anonymization](https://github.com/microsoft/Tools-for-Health-Data-Anonymization): a data anonymization project that provides tools for de-identifying FHIR data and DICOM data
* Integrated with the FHIR service and FHIR server for Azure in the form of `de-identified $export` operation
* For FHIR data, it can also be used with Azure Data Factory (ADF) pipeline by reading FHIR data from Azure blob storage and writing back the anonymized data

## MedTech service

#### Integration with IoT Hub and IoT Central

* [microsoft/iomt-fhir](https://github.com/microsoft/iomt-fhir): integration with IoT Hub or IoT Central to FHIR with data normalization and FHIR conversion of the normalized data
* Normalization: device data information is extracted into a common format for further processing
* FHIR Conversion: normalized and grouped data is mapped to FHIR. Observations are created or updated according to configured templates and linked to the device and patient.
* [Tools to help build the conversation map](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper): visualize the mapping configuration for normalizing the device input data and transform it to the FHIR resources. Developers can use this tool to edit and test the mappings, device mapping and FHIR mapping, and export them for uploading to the MedTech service in the Azure portal.

#### HealthKit and FHIR Integration

* [microsoft/healthkit-on-fhir](https://github.com/microsoft/healthkit-on-fhir): a Swift library that automates the export of Apple HealthKit Data to a FHIR Server

 ## Next steps

In this article, you've learned about the related GitHub Projects for Azure API for FHIR that provide source code and instructions to let you experiment and deploy services for various uses. For more information about Azure API for FHIR, see
 
>[!div class="nextstepaction"]
>[What is Azure API for FHIR?](overview.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.