---
title:  Overview of the DICOM service - Azure Health Data Services
description: In this article, you'll learn concepts of DICOM and the DICOM service.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 07/11/2022
ms.author: mmitrik
---

# Overview of the DICOM service

This article describes the concepts of DICOM and the DICOM service.

## DICOM

DICOM (Digital Imaging and Communications in Medicine) is the international standard to transmit, store, retrieve, print, process, and display medical imaging information, and is the primary medical imaging standard accepted across healthcare. 

## DICOM service

The DICOM service is a managed service within [Azure Health Data Services](../healthcare-apis-overview.md) that ingests and persists DICOM objects at multiple thousands of images per second. It facilitates communication and transmission of imaging data with any DICOMweb&trade; enabled systems or applications via DICOMweb Standard APIs like [Store (STOW-RS)](dicom-services-conformance-statement-v2.md#store-stow-rs), [Search (QIDO-RS)](dicom-services-conformance-statement-v2.md#search-qido-rs), [Retrieve (WADO-RS)](dicom-services-conformance-statement-v2.md#retrieve-wado-rs). It's backed by a managed Platform-as-a Service (PaaS) offering in the cloud with complete [PHI](https://www.hhs.gov/answers/hipaa/what-is-phi/index.html) compliance that you can upload PHI data to the DICOM service and exchange it through secure networks. 

- **PHI Compliant**: Protect your PHI with unparalleled security intelligence. Your data is isolated to a unique database per API instance and protected with multi-region failover. The DICOM service implements a layered, in-depth defense and advanced threat protection for your data.
- **Extended Query Tags**: Additionally index DICOM studies, series, and instances on both standard and private DICOM tags by expanding list of tags that are already specified within [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md).
- **Change Feed**: Access ordered, guaranteed, immutable, read-only logs of all the changes that occur in DICOM service. Client applications can read these logs at any time independently, in parallel and at their own pace.
- **DICOMcast**: Via DICOMcast, the DICOM service can inject DICOM metadata into a FHIR service, or FHIR server, as an imaging study resource allowing a single source of truth for both clinical data and imaging metadata. This feature is available as an open-source feature that can be self-hosted in Azure.  Learn more about [deploying DICOMcast](https://github.com/microsoft/dicom-server/blob/main/docs/quickstarts/deploy-dicom-cast.md).
- **Region availability**: DICOM service has wide-range of [availability across many regions](https://azure.microsoft.com/global-infrastructure/services/?products=azure-api-for-fhir&regions=all) with multi-region failover protection and continuously expanding.
- **Scalability**: DICOM service is designed out-of-the-box to support different workload levels at a hospital, country/region, and global scale without sacrificing any performance spec by using autoscaling features. 
- **Role-based access**: You control your data. Role-based access control (RBAC) enables you to manage how your data is stored and accessed. Providing increased security and reducing administrative workload, you determine who has access to the datasets you create, based on role definitions you create for your environment.

[Open-source DICOM-server project](https://github.com/microsoft/dicom-server) is also constantly monitored for feature parity with managed service so that developers can deploy open source version as a set of Docker containers to speed up development and test in their environments, and contribute to potential future managed service features.

## Applications for the DICOM service

In order to effectively treat patients, research new treatments, diagnose solutions, or provide an effective overview of the health history of a single patient, organizations must integrate data across several sources. One of the most pressing integrations is between clinical and imaging data. DICOM service enables imaging data to securely persist in the Microsoft cloud and allows it to reside with EHR and IoT data in the same Azure subscription.  

FHIR&trade; is becoming an important standard for clinical data and provides extensibility to support integration of other types of data directly, or through references. By using DICOM service, organizations can store references to imaging data in FHIR&trade; and enable queries that cross clinical and imaging datasets. This can enable many different scenarios, for example:

- **Image back-up**: Research institutions, clinics, imaging centers, veterinary clinics, pathology institutions, retailers, any team or organization can use the DICOM service to back up their images with unlimited storage and access. And there's no need to de-identify PHI data as our service is validated for PHI compliance.
- **Image exchange and collaboration**: Share an image, a sub set of images in your storage, or entire image library instantly with or without related EHR data.
- **Disaster recovery**: High availability is a resiliency characteristic of DICOM service. High availability is implemented in place (in the same region as your primary service) by designing it as a feature of the primary system.
- **Creating cohorts for research**: Often through queries for patients that match data in both clinical and imaging systems, such as this one (which triggered the effort to integrate FHIR&trade; and DICOM data): “Give me all the medications prescribed with all the CT scan documents and their associated radiology reports for any patient older than 45 that has had a diagnosis of osteosarcoma over the last two years.”
- **Finding outcomes for similar patients to understand options and plan treatments**: When presented with a patient diagnosis, a physician can identify patient outcomes and treatment plans for past patients with a similar diagnosis, even when these include imaging data.
- **Providing a longitudinal view of a patient during diagnosis**: Radiologists, especially teleradiologists, often don't have complete access to a patient’s medical history and related imaging studies. Through FHIR&trade; integration, this data can be easily provided, even to radiologists outside of the organization’s local network.
- **Closing the feedback loop with teleradiologists**: Ideally a radiologist has access to a hospital’s clinical data to close the feedback loop after making a recommendation. However for teleradiologists, this is often not the case. Instead, they're often unable to close the feedback loop after performing a diagnosis, since they don't have access to patient data after the initial read. With no (or limited) access to clinical results or outcomes, they can’t get the feedback necessary to improve their skills. As one teleradiologist put it: “Take parathyroid for example. We do more than any other clinic in the country/region, and yet I have to beg and plead for surgeons to tell me what they actually found. Out of the more than 500 studies I do each month, I get direct feedback on only three or four.”  Through integration with FHIR&trade;, an organization can easily create a tool that will provide direct feedback to teleradiologists, helping them to hone their skills and make better recommendations in the future.
- **Closing the feedback loop for AI/ML models**: Machine learning models do best when real-world feedback can be used to improve their models. However, third-party ML model providers rarely get the feedback they need to improve their models over time. For instance, one ISV put it this way: “We use a combination of machine models and human experts to recommend a treatment plan for heart surgery. However, we only rarely get feedback from physicians on how accurate our plan was. For instance, we often recommend a stent size. We’d love to get feedback on if our prediction was correct, but the only time we hear from customers is when there’s a major issue with our recommendations.” As with feedback for teleradiologists, integration with FHIR&trade; allows organizations to create a mechanism to provide feedback to the model retraining pipeline.

## Deploy DICOM service to Azure

DICOM service needs an Azure subscription to configure and run the required components. These components are, by default, created inside of an existing or new Azure Resource Group to simplify management. Additionally, an Azure Active Directory account is required. For each instance of DICOM service, we create a combination of isolated and multi-tenant resource.

## DICOM server

The Medical Imaging Server for DICOM (hereby known as DICOM server) is an open source DICOM server that is easily deployed on Azure. It allows standards-based communication with any DICOMweb™ enabled systems, and injects DICOM metadata into a FHIR server to create a holistic view of patient data. See [DICOM server](https://github.com/microsoft/dicom-server).

## Summary

This conceptual article provided you with an overview of DICOM and the DICOM service.
 
## Next steps

To get started using the DICOM service, see

>[!div class="nextstepaction"]
>[Deploy DICOM service to Azure](deploy-dicom-services-in-azure.md)

For more information about  how to use the DICOMweb&trade; Standard APIs with the DICOM service, see

>[!div class="nextstepaction"]
>[Using DICOMweb&trade;Standard APIs with DICOM service](dicomweb-standard-apis-with-dicom-services.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
