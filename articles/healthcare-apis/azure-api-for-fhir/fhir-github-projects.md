---
title: Related GitHub Projects for Azure API for FHIR
description: Explore open-source GitHub repositories for Azure API for FHIR, including FHIR server, data conversion, and anonymization tools. Find resources to deploy and experiment.
services: healthcare-apis
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 06/11/2026
ms.author: kesheth
---

# Related GitHub projects for Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

Many open-source projects on GitHub provide source code and instructions to deploy Azure API for FHIR services for various uses. Visit the GitHub repositories to learn about and experiment with FHIR features and tools such as data conversion and anonymization.

## FHIR server GitHub projects for Azure API for FHIR

* [microsoft/fhir-server](https://github.com/microsoft/fhir-server/): an open-source FHIR server, which is the basis for Azure API for FHIR
* To see the latest releases, refer to the [Release Notes](https://github.com/microsoft/fhir-server/releases).

## Data conversion and anonymization tools for FHIR

#### FHIR Converter

* [microsoft/FHIR-Converter](https://github.com/microsoft/FHIR-Converter) is a data conversion project that uses the CLI tool and the `$convert-data` FHIR endpoint to translate healthcare legacy data formats into FHIR.
* Integrated with the FHIR service and FHIR server for Azure in the form of `$convert-data` operation.
* Ongoing improvements in OSS, and continual integration to the FHIR servers
 

#### FHIR Tools for Anonymization

* [microsoft/Tools-for-Health-Data-Anonymization](https://github.com/microsoft/Tools-for-Health-Data-Anonymization) is a data anonymization project that provides tools for de-identifying FHIR data and DICOM data.
* Integrated with the FHIR service and FHIR server for Azure in the form of `de-identified $export` operation.
* For FHIR data, you can also use it with Azure Data Factory (ADF) pipeline by reading FHIR data from Azure blob storage and writing back the anonymized data.


 ## Next steps

In this article, you learned about the related GitHub Projects for Azure API for FHIR that provide source code and instructions to help you experiment and deploy services for various uses. For more information about Azure API for FHIR, see
 
>[!div class="nextstepaction"]
>[What is Azure API for FHIR?](overview.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
