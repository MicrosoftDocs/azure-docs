---
title:  Overview of the DICOM service in Azure Health Data Services
description: The DICOM service is a cloud-based solution for storing, managing, and exchanging medical imaging data securely and efficiently with any DICOMweb™-enabled systems or applications. Learn more about its benefits and use cases.
author: mmitrik
ms.service: healthcare-apis
ms.topic: overview
ms.date: 10/13/2023
ms.author: mmitrik
---

# What is the DICOM service?

The DICOM &reg;service is a cloud-based solution that enables healthcare organizations to store, manage, and exchange medical imaging data securely and efficiently with any DICOMweb-enabled systems or applications. The DICOM service is part of [Azure Health Data Services](../healthcare-apis-overview.md).

The DICOM service offers many benefits, including:

- **Global availability**. The DICOM service is available in any of the regions where Azure Health Data Services is available. Microsoft is continuously expanding availability of the DICOM service, so check [regional availability](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=health-data-services&regions=all) for updates.

- **PHI compliance**. The DICOM service is designed for protected health information (PHI), meeting all regional compliance requirements including HIPAA, GDPR, and CCPA.

- **Scalability**. The DICOM service scales to support everything from small imaging archives in a clinic to large imaging archives with petabytes of data and thousands of new studies added daily.

- **Automatic data replication**. The DICOM service uses Azure Locally Redundant Storage (LRS) within a region. If one copy of the data fails or becomes unavailable, your data can be accessed without interruption.

- **Role-based access control (RBAC)**. RBAC enables you to manage how your organization's data is stored and accessed. You determine who has access to datasets based on roles you define for your environment.

## Use imaging data to enable healthcare scenarios

To effectively treat patients, research treatments, diagnose illnesses, or get an overview of a patient's health history, organizations need to integrate data across several sources. The DICOM service enables imaging data to persist securely in the Microsoft cloud and allows it to reside with electronic health records (EHR) and healthcare device (IoT) data in the same Azure subscription.  

FHIR&reg; supports integration of other types of data directly, or through references. With the DICOM service, organizations are able to store references to imaging data in FHIR and enable queries that cross clinical and imaging datasets. This capability enables organizations to deliver better healthcare. For example:

- **Image back-up**. Research institutions, clinics, imaging centers, veterinary clinics, pathology institutions, retailers, or organizations can use the DICOM service to back up their images with unlimited storage and access. There's no need to deidentify PHI data because the service is validated for PHI compliance.

- **Image exchange and collaboration**. Share an image, a subset of images, or an entire image library instantly with or without related EHR data.

- **Create cohorts for research**. To find the right patients for clinical trials, researchers need to query for patients that match data in both clinical and imaging systems. The service allows researchers to use natural language to query across systems. For example, “Give me all the medications prescribed with all the CT scan documents and their associated radiology reports for any patient older than 45 that has had a diagnosis of osteosarcoma over the last two years.”

- **Plan treatment based on similar patients**. When presented with a patient diagnosis, a physician can identify patient outcomes and treatment plans for past patients with a similar diagnosis even when these include imaging data.

- **Get a longitudinal view of a patient during diagnosis**. Radiologists, especially teleradiologists, often don't have complete access to a patient’s medical history and related imaging studies. Through FHIR integration, this data can be provided even to radiologists outside of the organization’s local network.

- **Close the feedback loop with teleradiologists**. Teleradiologists are often unable to find out about the accuracy and quality of their diagnoses because they don't have access to patient data after the initial read. With limited or no access to clinical results or outcomes, they miss opportunities to improve their skills. Through integration with FHIR, an organization can create a tool that provides direct feedback to teleradiologists, helping them make better recommendations in the future.

## Manage medical imaging data securely and efficiently

The DICOM service enables organizations to manage medical imaging data with several key capabilities:

- **Data isolation**. The DICOM service assigns a unique database to each API instance, which means your organization's data isn't mixed with other organizations' data.

- **Studies Service support**. The [Studies Service](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#chapter_10) allows users to store, retrieve, and search for DICOM studies, series, and instances. Microsoft includes the nonstandard delete transaction to enable a full resource lifecycle.

- **Worklist Service support**. The DICOM service supports the Push and Pull SOPs of the [Worklist Service (UPS-RS)](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#chapter_11). This service provides access to one Worklist containing Workitems, each of which represents a Unified Procedure Step (UPS).Studies Service

- **Extended query tags**. The DICOM service allows you to expand the list of tags specified in the [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md) so you can index DICOM studies, series, and instances on standard or private DICOM tags.

- **Change feed**. The DICOM service enables you to access ordered, guaranteed, immutable, read-only logs of all changes that occur in the DICOM service. Client applications can read these logs at any time independently, in parallel and at their own pace.

- **DICOMcast**. DICOMcast is an [open-source capability](https://github.com/microsoft/dicom-server/blob/main/docs/quickstarts/deploy-dicom-cast.md) that can be self-hosted in Azure. DICOMcast enables a single source of truth for clinical data and imaging metadata. With DICOMcast, the DICOM service can inject DICOM metadata into a FHIR service or FHIR server as an imaging study resource.

- **Export files**. The DICOM service allows you to [export DICOM data](export-dicom-files.md) in a file format, simplifying the process of using medical imaging in external workflows such as AI and machine learning. 

## Prerequisites to deploy the DICOM service

Your organization needs an Azure subscription to configure and run the components required for the DICOM service. By default, the components are created inside of an Azure resource group to simplify management. Additionally, a Microsoft Entra account is required. For each instance of the DICOM service, Microsoft creates a combination of isolated and multitenant resources.
 
## Next steps

[Deploy DICOM service to Azure](deploy-dicom-services-in-azure.md)

[Use DICOMweb standard APIs](dicomweb-standard-apis-with-dicom-services.md)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]
