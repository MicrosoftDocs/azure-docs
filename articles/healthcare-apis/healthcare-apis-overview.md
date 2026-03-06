---
title: What is Azure Health Data Services?
description: This article is an overview of Azure Health Data Services. 
services: healthcare-apis
author: mmitrik
ms.service: azure-health-data-services
ms.topic: overview
ms.date: 02/23/2026
ms.author: mikaelw
---

# What is Azure Health Data Services?

Azure Health Data Services is a cloud-based solution that helps you collect, store, and analyze health data from different sources and formats. It supports various healthcare standards, such as FHIR&reg; and DICOM&reg;, and converts data from legacy or proprietary device formats to FHIR. 

Azure Health Data Services enables you to:

- Connect health data from different systems, devices, and types in one place.
- Discover new insights from health data using machine learning, analytics, and AI tools.
- Build on a trusted cloud that protects your health data and meets privacy and compliance requirements.

Designed to meet your current health data needs and built to adapt to future developments, Azure Health Data Services is a powerful and flexible solution that is always evolving. Microsoft engineers are continuously improving and updating the platform to support new and emerging health data standards so you don't have to worry about changing your data formats or systems in the future.

## Services in Azure Health Data Services

Azure Health Data Services offers a suite of services that include:

- **FHIR service**: A managed, FHIR-compliant server that enables rapid exchange and storage of health data using the Fast Healthcare Interoperability Resources (FHIR&reg;) standard. It provides an enterprise-grade API endpoint with high performance and low latency, secure management of Protected Health Information (PHI), SMART on FHIR support, and Microsoft Entra role-based access control (RBAC). For more information, see [What is the FHIR service?](fhir/overview.md)

- **DICOM service**: A cloud-based solution for storing, managing, and exchanging medical imaging data securely and efficiently with any DICOMweb&reg;-enabled systems or applications. It offers global availability, PHI compliance, scalability to petabytes of data, automatic data replication, and role-based access control (RBAC). For more information, see [What is the DICOM service?](dicom/overview.md)

- **De-identification service**: A service that enables healthcare organizations to de-identify clinical data so that the resulting data retains its clinical relevance and distribution while adhering to HIPAA requirements. It uses machine learning models to automatically tag, redact, or surrogate protected health information (PHI) entities from unstructured text such as clinical notes, transcripts, and clinical trial studies. For more information, see [What is the de-identification service?](deidentification/overview.md)

## Differences between Azure Health Data Services and Azure API for FHIR

Azure Health Data Services and Azure API for FHIR are two different offerings from Microsoft that enable healthcare organizations to manage and exchange health data in a secure, scalable way.

[!INCLUDE [retirement banner](includes/healthcare-apis-azure-api-fhir-retirement.md)]

- **Azure API for FHIR** is a single service that provides a managed platform for exchanging health data using the FHIR standard. **Azure Health Data Services** is a set of managed API services based on open standards and frameworks that enable workflows to improve healthcare and offer scalable and secure healthcare solutions.
- **Azure API for FHIR** only supports FHIR standard, which mainly covers structured data. **Azure Health Data Services** supports other healthcare industry data standards besides FHIR, such as DICOM, which allows it to work with different types of data, such as imaging and device data.
- **Azure API for FHIR** requires you to create a separate resource for each FHIR service instance, which limits the interoperability and integration of health data. **Azure Health Data Services** allows you to deploy a FHIR service and a DICOM service in the same workspace, which enables you to connect and analyze health data from different sources and formats.
- **Azure API for FHIR** doesn't have some platform features that are available in **Azure Health Data Services**, such as private link, customer managed keys, and logging. These features enhance the security and compliance of your health data.
 
In addition, Azure Health Data Services has a business model and infrastructure platform that accommodates the expansion and introduction of different and future healthcare data standards.


## Next steps

Proceed to the next article to learn about Azure Health Data workspaces.

> [!div class="nextstepaction"]
> [Workspace overview](workspace-overview.md)


[!INCLUDE [FHIR and DICOM trademark statements](./includes/healthcare-apis-fhir-dicom-trademark.md)]
