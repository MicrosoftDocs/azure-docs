---
title: What is Azure Health Data Services?
description: This article is an overview of Azure Health Data Services. 
services: healthcare-apis
author: shellyhaverkamp
ms.service: healthcare-apis
ms.topic: overview
ms.date: 06/03/2022
ms.author: mikaelw
---

# What is Azure Health Data Services?

Azure Health Data Services is a cloud-based solution that helps you collect, store, and analyze health data from different sources and formats. It supports various healthcare standards, such as FHIR and DICOM, and converts data from legacy or proprietary device formats to FHIR. 

Azure Health Data Services enables you to:

- Connect health data from different systems, devices, and types in one place.
- Discover new insights from health data using machine learning, analytics, and AI tools.
- Build on a trusted cloud that protects your health data and meets privacy and compliance requirements.

Azure Health Data Services isn't only a powerful and flexible solution for your current health data needs, the platform is ready for the future. Microsoft engineers are continuously improving and updating the platform to support new and emerging health data standards, which means that you don't have to worry about changing your data formats or systems in the future.

Microsoft has also made the platform scalable and flexible to adapt to your needs. You only pay for the amount of data you store and process, not for the number of API calls you make. Microsoft has improved the performance and reliability of Azure Health Data Services by using Kubernetes, a system for managing containerized applications across multiple servers, to make the platform more scalable and resilient. Microsoft has also used Azure Cosmos DB, a database service that can handle large amounts of data across different regions, to make the platform faster and more consistent.

## Examples of workloads enabled by Azure Health Data Services

Here are some examples of new workloads that using consistent, standardized data stored in one place enables: 
- Develop a machine learning model to predict the risk of hospital readmission for patients with chronic conditions.
- Create a dashboard to monitor the quality of care indicators for a healthcare unit. 
- Build a chatbot that can answer health-related questions and provide personalized recommendations based on health data.
- Generate a report that compares the performance and outcomes of different healthcare providers or facilities based on health data.

These examples are just some of the ways that Azure Health Data Services can help you create new solutions and applications that can improve health care delivery and outcomes.

## Differences between Azure Health Data Services and Azure API for FHIR

Azure Health Data Services and Azure API for FHIR are two different offerings from Microsoft that enable healthcare organizations to manage and exchange health data in a secure, scalable way.

- **Azure API for FHIR** is a single service that provides a managed platform for exchanging health data using the FHIR standard. **Azure Health Data Services** is a set of managed API services based on open standards and frameworks that enable workflows to improve healthcare and offer scalable and secure healthcare solutions.
- **Azure API for FHIR** only supports FHIR standard, which mainly covers structured data. **Azure Health Data Services** supports other healthcare industry data standards besides FHIR, such as DICOM, which allows it to work with different types of data, such as imaging and device data.
- **Azure API for FHIR** has a fixed pricing model based on the number of API calls and a limited storage capacity of 4 TB. **Azure Health Data Services** has a redesigned business model and infrastructure platform that can accommodate the expansion and introduction of different and future healthcare data standards.
- **Azure API for FHIR** requires you to create a separate resource for each FHIR service instance, which limits the interoperability and integration of health data. **Azure Health Data Services** allows you to deploy a FHIR service and a DICOM service in the same workspace, which enables you to connect and analyze health data from different sources and formats.
- **Azure API for FHIR** doesn't have some platform features that are available in **Azure Health Data Services**, such as private link, customer managed keys, and logging. These features enhance the security and compliance of your health data.

## Next steps

To work with Azure Health Data Services, first you need to create an [Azure workspace](workspace-overview.md). 

Follow the steps in this quickstart guide:

> [!div class="nextstepaction"]
> [Create a workspace](healthcare-apis-quickstart.md)



FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
