---
title: Related GitHub Projects for Azure Health Data Services
description: Lists all Open Source (GitHub) repositories
services: healthcare-apis
author: evachen96
ms.service: healthcare-apis
ms.topic: reference
ms.date: 10/18/2023
ms.author: evach
---

# GitHub projects

We have many open-source projects on GitHub that provide you the source code and instructions to deploy services for various uses. You're always welcome to visit our GitHub repositories to learn and experiment with our features and products. 

## Azure Health Data Services samples

* This repo contains [samples for Azure Health Data Services](https://github.com/Azure-Samples/azure-health-data-services-samples), including Fast Healthcare Interoperability Resources (FHIR&#174;), DICOM, MedTech service, and data-related services.

## Azure Health Data Services Toolkit

* The [Azure Health Data Services Toolkit](https://github.com/microsoft/azure-health-data-services-toolkit) helps you extend the functionality of Azure Health Data Services by providing a consistent toolset to build custom operations to modify the core service behavior. 

## FHIR server

* [microsoft/fhir-server](https://github.com/microsoft/fhir-server/): open-source FHIR Server, which is the basis for FHIR service
* For information about the latest releases, see [Release notes](https://github.com/microsoft/fhir-server/releases)
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

* [microsoft/Tools-for-Health-Data-Anonymization](https://github.com/microsoft/Tools-for-Health-Data-Anonymization): a data anonymization project that provides tools for de-identifying FHIR data as well as DICOM data
* Integrated with the FHIR service and FHIR server for Azure in the form of `de-identified $export` operation
* For FHIR data, it can also be used with Azure Data Factory (ADF) pipeline by reading FHIR data from Azure blob storage and writing back the anonymized data

## Analytics Pipelines

FHIR Analytics Pipelines help you build components and pipelines for rectangularizing and moving FHIR data from Azure FHIR servers namely [Azure Health Data Services FHIR Server](./../healthcare-apis/index.yml), [Azure API for FHIR](./../healthcare-apis/azure-api-for-fhir/index.yml), and [FHIR Server for Azure](https://github.com/microsoft/fhir-server) to [Azure Data Lake](https://azure.microsoft.com/solutions/data-lake/) and thereby make it available for analytics with [Azure Synapse Analytics](https://azure.microsoft.com/services/synapse-analytics/), [Power BI](https://powerbi.microsoft.com/), and [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/).

The descriptions and capabilities of these two solutions are summarized below:

### FHIR to Synapse Sync Agent

The FHIR to Synapse Sync Agent is an Azure function that extracts data from a FHIR Server using FHIR Resource APIs, and converts it to hierarchical Parquet files, and writes it to Azure Data Lake in near real time. This agent also contains a [script](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/scripts/Set-SynapseEnvironment.ps1) to create external tables and views in Synapse Serverless SQL pool pointing to the Parquet files.

This solution enables you to query against the entire FHIR data with tools such as Synapse Studio, SSMS, and Power BI. You can also access the Parquet files directly from a Synapse Spark pool. You should consider using this solution if you want to access all your FHIR data in near real time and want to defer custom transformation to downstream systems.

### FHIR to CDM Pipeline Generator

The FHIR to CDM Pipeline Generator is a tool to generate an ADF pipeline for moving a snapshot of data from a FHIR server using $export API to a [CDM folder](/common-data-model/data-lake) in Azure Data Lake Storage Gen 2 in `.csv` format. The tool requires a user-created configuration file containing instructions to project and flatten FHIR Resources and fields into tables. You can also follow the [instructions](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToCdm/docs/cdm-to-synapse.md) for creating a downstream pipeline in Synapse workspace to move data from CDM folder to Synapse dedicated SQL pool.

This solution enables you to transform the data into tabular format as it gets written to CDM folder. You should consider this solution if you want to transform FHIR data into a custom schema as it is extracted from the FHIR server.

## MedTech service

#### Integration with IoT Hub and IoT Central

* [microsoft/iomt-fhir](https://github.com/microsoft/iomt-fhir): integration with IoT Hub or IoT Central to FHIR with data normalization and FHIR conversion of the normalized data
* Normalization: device data information is extracted into a common format for further processing
* FHIR Conversion: normalized and grouped data is mapped to FHIR. Observations are created or updated according to configured templates and linked to the device and patient.
* [Tools to help build the conversation map](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper): visualize the mapping configuration for normalizing the device input data and transform it to the FHIR resources. Developers can use this tool to edit and test the Device and FHIR destination mappings and export them for uploading to the MedTech service in the Azure portal.

#### HealthKit and FHIR Integration

* [microsoft/healthkit-on-fhir](https://github.com/microsoft/healthkit-on-fhir): a Swift library that automates the export of Apple HealthKit Data to a FHIR Server.

## DICOM service

The DICOM service provides an open-source [Medical Imaging Server](https://github.com/microsoft/dicom-server) for DICOM that is easily deployed on Azure. It allows standards-based communication with any DICOMweb™ enabled systems, and injects DICOM metadata into a FHIR server to create a holistic view of patient data. See [DICOM service](./dicom/get-started-with-dicom.md) for more information.

## Next steps

In this article, you learned about some of Azure Health Data Services open-source GitHub projects that provide source code and instructions to let you experiment and deploy services for various uses. For more information about Azure Health Data Services, see 


>[!div class="nextstepaction"]
>[Overview of Azure Health Data Services](healthcare-apis-overview.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.

