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

This article describes our open-source projects on GitHub that provide source code and instructions to connect DICOM&reg; service with other tools, services, and products. 

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

* [FHIR to Synapse Sync Agent](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/docs/Deploy-FhirToDatalake.md): After you provision a DICOM service, FHIR service and synchronizing imaging study for a given patient via DICOM cast, you can use FHIR to Synapse Sync Agent to perform Analytics and Machine Learning on imaging study data by moving FHIR data to Azure Data Lake in near real time and making it available to a Synapse workspace.

### Health Data Services workshop

* [Azure Health Data Services Workshop](https://github.com/microsoft/azure-health-data-services-workshop): This workshop presents a series of hands-on activities to help users gain new skills working with Azure Health Data Services capabilities.  The DICOM service challenge includes deployment of the service, exploration of the core API capabilities, a Postman collection to simplify exploration, and instructions for configuring a ZFP DICOM viewer.  

### Using the DICOM service with the OHIF viewer

* [Azure DICOM service with OHIF viewer](https://github.com/microsoft/dicom-ohif): The [OHIF viewer](https://ohif.org/) is an open-source, non-diagnostic DICOM viewer that uses DICOMweb APIs to find and render DICOM images.  This project provides the guidance and sample templates for deploying the OHIF viewer and configuring it to integrate with the DICOM service.  

### Medical imaging network demo environment
* [Medical Imaging Network Demo Environment](https://github.com/Azure-Samples/azure-health-data-services-samples/tree/main/samples/dicom-demo-env#readme): This hands-on lab / demo highlights how an organization with existing on-premises radiology infrastructure can take the first steps to intelligently moving their data to the cloud, without disruptions to the current workflow.


## Next steps

[Deploy DICOM service to Azure](deploy-dicom-services-in-azure.md)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]
