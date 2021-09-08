---
title:  Overview of the DICOM service - Azure Healthcare APIs
description: In this article, you'll learn concepts of DICOM, Medical Imaging, and DICOM service.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 07/10/2021
ms.author: aersoy
---

# Overview of the DICOM service

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article describes the concepts of DICOM, Medical Imaging, and the DICOM service.

## Medical imaging

Medical imaging is the technique and process of creating visual representations of the interior of a body for clinical analysis and medical intervention, as well as visual representation of the function of some organs or tissues (physiology). Medical imaging seeks to reveal internal structures hidden by the skin and bones, as well as to diagnose and treat disease. Medical imaging also establishes a database of normal anatomy and physiology to make it possible to identify abnormalities. Although imaging of removed organs and tissues can be performed for medical reasons, such procedures are usually part of pathology instead of medical imaging. [Wikipedia, Medical imaging](https://en.wikipedia.org/wiki/Medical_imaging)

## DICOM

DICOM (Digital Imaging and Communications in Medicine) is the international standard to transmit, store, retrieve, print, process, and display medical imaging information, and is the primary medical imaging standard accepted across healthcare. Although some exceptions exist (dentistry, veterinary), nearly all medical specialties, equipment manufacturers, software vendors, and individual practitioners rely on DICOM at some stage of any medical workflow involving imaging. DICOM ensures that medical images meet quality standards, so that the accuracy of diagnosis can be preserved. Most imaging modalities, including computed tomography (CT), magnetic resonance imaging (MRI), and ultrasound must conform to the DICOM standards. Images that are in the DICOM format need to be accessed and used through specialized DICOM applications.

## DICOM service

A DICOM service is a managed service that needs an Azure subscription and an Azure Active Directory account to be deployed on Azure Healthcare APIs workspace. It allows standards-based communication with any DICOMweb&trade; enabled systems. DICOM service injects DICOM metadata into a FHIR service, or FHIR server, allowing a single source of truth for both clinical data and imaging metadata. 

The need to effectively integrate non-clinical data has become acute. In order to effectively treat patients, research new treatments, diagnose solutions, or provide an effective overview of the health history of a single patient, organizations must integrate data across several sources. One of the most pressing integrations is between clinical and imaging data.

FHIR&trade; is becoming an important standard for clinical data and provides extensibility to support integration of other types of data directly, or through references. By using the DICOM service, organizations can store references to imaging data in FHIR&trade; and enable queries that cross clinical and imaging datasets. This can enable many different scenarios, for example:

- **Creating cohorts for research.** Often through queries for patients that match data in both clinical and imaging systems, such as this one (which triggered the effort to integrate FHIR&trade; and DICOM data): “Give me all the medications prescribed with all the CT scan documents and their associated radiology reports for any patient older than 45 that has had a diagnosis of osteosarcoma over the last two years.”
- **Finding outcomes for similar patients to understand options and plan treatments.** When presented with a patient diagnosis, a physician can identify patient outcomes and treatment plans for past patients with a similar diagnosis, even when these include imaging data.
- **Providing a longitudinal view of a patient during diagnosis.** Radiologists, especially teleradiologists, often do not have complete access to a patient’s medical history and related imaging studies. Through FHIR&trade; integration, this data can be easily provided, even to radiologists outside of the organization’s local network.
- **Closing the feedback loop with teleradiologists.** Ideally a radiologist has access to a hospital’s clinical data to close the feedback loop after making a recommendation. However for teleradiologists, this is often not the case. Instead, they are often unable to close the feedback loop after performing a diagnosis, since they do not have access to patient data after the initial read. With no (or limited) access to clinical results or outcomes, they cannot get the feedback necessary to improve their skills. As on teleradiologist put it: “Take parathyroid for example. We do more than any other clinic in the country, and yet I have to beg and plead for surgeons to tell me what they actually found. Out of the more than 500 studies I do each month, I get direct feedback on only three or four.”  Through integration with FHIR&trade;, an organization can easily create a tool that will provide direct feedback to teleradiologists, helping them to hone their skills and make better recommendations in the future.
- **Closing the feedback loop for AI/ML models.** Machine learning models do best when real-world feedback can be used to improve their models. However, third-party ML model providers rarely get the feedback they need to improve their models over time. For instance, one ISV put it this way: “We use a combination of machine models and human experts to recommend a treatment plan for heart surgery. However, we only rarely get feedback from physicians on how accurate our plan was. For instance, we often recommend a stent size. We’d love to get feedback on if our prediction was correct, but the only time we hear from customers is when there’s a major issue with our recommendations.” As with feedback for teleradiologists, integration with FHIR&trade; allows organizations to create a mechanism to provide feedback to the model retraining pipeline.

## Deploy DICOM service to Azure

DICOM service needs an Azure subscription to configure and run the required components. These components are, by default, created inside of an existing or new Azure Resource Group to simplify management. Additionally, an Azure Active Directory account is required. For each instance of DICOM service, we create a combination of isolated and multi-tenant resource.

## Summary

This conceptual article provided you with an overview of DICOM, Medical Imaging, and the DICOM service.
 
## Next steps

To get started using the DICOM service, see:

>[!div class="nextstepaction"]
>[Deploy DICOM service to Azure](deploy-dicom-services-in-azure.md)

>[!div class="nextstepaction"]
>[Using DICOMweb&trade;Standard APIs with DICOM service](dicomweb-standard-apis-with-dicom-services.md)
