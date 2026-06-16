---
title: Related GitHub Projects for Azure Health Data Services
description: Browse Azure Health Data Services open-source projects on GitHub. Access samples, toolkits, and FHIR conversion tools to experiment and deploy services with ease.
services: healthcare-apis
author: evachen96
ms.service: azure-health-data-services
ms.topic: reference
ms.date: 06/11/2026
ms.author: evach
ms.reviewer: v-catheribun
---

# Azure Health Data Services GitHub projects

Many open-source projects on GitHub provide source code and instructions for Azure Health Data Services deployments. Visit the GitHub repositories to learn, experiment, and extend FHIR, DICOM, and data services. 

## Azure Health Data Services samples

* This repo contains [samples for Azure Health Data Services](https://github.com/Azure-Samples/azure-health-data-services-samples), including Fast Healthcare Interoperability Resources (FHIR&#174;), DICOM, and data-related services.

## Azure Health Data Services Toolkit

* The [Azure Health Data Services Toolkit](https://github.com/microsoft/azure-health-data-services-toolkit) helps you extend the functionality of Azure Health Data Services by providing a consistent toolset to build custom operations to modify the core service behavior. 

## FHIR server

* [microsoft/fhir-server](https://github.com/microsoft/fhir-server/): open-source FHIR Server, which is the basis for FHIR service
* [microsoft/fhir-server-samples](https://github.com/microsoft/fhir-server-samples): a sample environment

For information about the latest releases, see [Release notes](https://github.com/microsoft/fhir-server/releases).

## Data conversion and anonymization

### FHIR Converter

* [microsoft/FHIR-Converter](https://github.com/microsoft/FHIR-Converter): a data conversion project that uses CLI tool and $convert-data FHIR endpoint to translate healthcare legacy data formats into FHIR
* Integrated with the FHIR service and FHIR server for Azure in the form of $convert-data operation
* Ongoing improvements in OSS, and continual integration to the FHIR servers
 

### FHIR tools for anonymization

* [microsoft/Tools-for-Health-Data-Anonymization](https://github.com/microsoft/Tools-for-Health-Data-Anonymization): a data anonymization project that provides tools for de-identifying FHIR and DICOM data.
* Integrated with the FHIR service and FHIR server for Azure in the form of `de-identified $export` operation.
* For FHIR data, you can also use it with Azure Data Factory (ADF) pipeline by reading FHIR data from Azure blob storage and writing back the anonymized data.


## DICOM service

The DICOM service provides an open-source [Medical Imaging Server](https://github.com/microsoft/dicom-server) for DICOM that you can easily deploy on Azure. It allows standards-based communication with any DICOMweb™ enabled systems, and injects DICOM metadata into a FHIR server to create a holistic view of patient data. For more information, see [Manage medical imaging data with the DICOM service](./dicom/dicom-data-lake.md).

## Next steps

In this article, you learned about some of Azure Health Data Services open-source GitHub projects that provide source code and instructions to help you experiment and deploy services for various uses. 


>[!div class="nextstepaction"]
>[Overview of Azure Health Data Services](healthcare-apis-overview.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.

