---
title: References for DICOM service - Azure Health Data Services
description: This reference provides related resources for the DICOM service.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 06/03/2022
ms.author: mmitrik
---

# DICOM service open-source projects

This article describes our open-source projects on GitHub that provide source code and instructions to connect DICOM service with other tools, services, and products. 

## DICOM service GitHub projects

### DICOM server

* [Medical imaging server for DICOM](https://github.com/microsoft/dicom-server): Open-source version of the Azure Health Data Services DICOM service managed service.

### DICOM cast

* [Integrate clinical and imaging data](https://github.com/microsoft/dicom-server/blob/main/docs/concepts/dicom-cast.md): DICOM cast allows synchronizing the data from the DICOM service to the FHIR service, which allows healthcare organization to integrate clinical and imaging data. DICOM cast expands the use cases for health data by supporting both a streamlined view of longitudinal patient data and the ability to effectively create cohorts for medical studies, analytics, and machine learning.

### DICOM data anonymization

* [Anonymize DICOM metadata](https://github.com/microsoft/Tools-for-Health-Data-Anonymization/blob/master/docs/DICOM-anonymization.md): A DICOM file not only contains a viewable image but also a header with a large variety of data elements. These meta-data elements include identifiable information about the patient, the study, and the institution. Sharing such sensitive data demands proper protection to ensure data safety and maintain patient privacy. DICOM Anonymization Tool helps anonymize metadata in DICOM files for this purpose.

### Access imaging study resources on Power BI, Power Apps, and Dynamics 365 Customer Insights

* [Connect to a FHIR service from Power Query Desktop](/power-query/connectors/fhir/fhir): After provisioning DICOM service, FHIR service and synchronizing imaging study for a given patient via DICOM cast, you can use the POWER Query connector for FHIR to import and shape data from the FHIR server including imaging study resource.

### Convert imaging study data to hierarchical parquet files

* [FHIR to Synapse Sync Agent](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/docs/Deployment.md): After you provision a DICOM service, FHIR service and synchronizing imaging study for a given patient via DICOM cast, you can use FHIR to Synapse Sync Agent to perform Analytics and Machine Learning on imaging study data by moving FHIR data to Azure Data Lake in near real time and making it available to a Synapse workspace.

## Next steps

For more information about using the DICOM service, see

>[!div class="nextstepaction"]
>[Deploy DICOM service to Azure](deploy-dicom-services-in-azure.md)

For more information about DICOM cast, see

>[!div class="nextstepaction"]
>[DICOM cast overview](dicom-cast-overview.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.