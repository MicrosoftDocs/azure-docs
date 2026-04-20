---
title: Related GitHub Projects for Azure Health Data Services
description: Lists all Open Source (GitHub) repositories
services: healthcare-apis
author: evachen96
ms.service: azure-health-data-services
ms.topic: reference
ms.date: 02/25/2026
ms.author: evach
---

# GitHub projects

We have many open-source projects on GitHub that provide you with the source code and instructions to deploy services for various uses. You're always welcome to visit our GitHub repositories to learn and experiment with our features and products. 

## Azure Health Data Services samples

* This repo contains [samples for Azure Health Data Services](https://github.com/Azure-Samples/azure-health-data-services-samples), including Fast Healthcare Interoperability Resources (FHIR&#174;), DICOM, and data-related services.

## Azure Health Data Services Toolkit

* The [Azure Health Data Services Toolkit](https://github.com/microsoft/azure-health-data-services-toolkit) helps you extend the functionality of Azure Health Data Services by providing a consistent toolset to build custom operations to modify the core service behavior. 

## FHIR server

* [microsoft/fhir-server](https://github.com/microsoft/fhir-server/): open-source FHIR Server, which is the basis for FHIR service
* For information about the latest releases, see [Release notes](https://github.com/microsoft/fhir-server/releases)
* [microsoft/fhir-server-samples](https://github.com/microsoft/fhir-server-samples): a sample environment

## Data Conversion & Anonymization

### FHIR Converter

* [microsoft/FHIR-Converter](https://github.com/microsoft/FHIR-Converter): a data conversion project that uses CLI tool and $convert-data FHIR endpoint to translate healthcare legacy data formats into FHIR
* Integrated with the FHIR service and FHIR server for Azure in the form of $convert-data operation
* Ongoing improvements in OSS, and continual integration to the FHIR servers
 
### FHIR Converter - VS Code Extension

* [microsoft/vscode-azurehealthcareapis-tools](https://github.com/microsoft/vscode-azurehealthcareapis-tools): a VS Code extension that contains a collection of tools to work with FHIR Converter
* Released to Visual Studio Marketplace, you can install it here: [FHIR Converter VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter)
* Used for authoring Liquid conversion templates and managing templates on Azure Container Registry

### FHIR Tools for Anonymization

* [microsoft/Tools-for-Health-Data-Anonymization](https://github.com/microsoft/Tools-for-Health-Data-Anonymization): a data anonymization project that provides tools for de-identifying FHIR and DICOM data
* Integrated with the FHIR service and FHIR server for Azure in the form of `de-identified $export` operation
* For FHIR data, it can also be used with Azure Data Factory (ADF) pipeline by reading FHIR data from Azure blob storage and writing back the anonymized data

### HealthKit and FHIR Integration

* [microsoft/healthkit-on-fhir](https://github.com/microsoft/healthkit-on-fhir): a Swift library that automates the export of Apple HealthKit Data to a FHIR Server.

## DICOM service

The DICOM service provides an open-source [Medical Imaging Server](https://github.com/microsoft/dicom-server) for DICOM that is easily deployed on Azure. It allows standards-based communication with any DICOMweb™ enabled systems, and injects DICOM metadata into a FHIR server to create a holistic view of patient data. For more information, see [Manage medical imaging data with the DICOM service](./dicom/dicom-data-lake.md).

## Next steps

In this article, you learned about some of Azure Health Data Services open-source GitHub projects that provide source code and instructions to let you experiment and deploy services for various uses. For more information about Azure Health Data Services, see 


>[!div class="nextstepaction"]
>[Overview of Azure Health Data Services](healthcare-apis-overview.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.

