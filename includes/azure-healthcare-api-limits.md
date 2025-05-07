---
title: "Azure Healthcare APIs limits include file"
description: "Limits for Azure Healthcare APIs include file"
services: healthcare-apis
author: stevewohl
ms.service: azure-health-data-services
ms.topic: "include"
ms.date: 03/15/2022
ms.author: v-stevewohl
ms.custom: "include file"
---

Health Data Services is a set of managed API services based on open standards and frameworks. Health Data Services enables workflows to improve healthcare and offers scalable and secure healthcare solutions. Health Data Services includes Fast Healthcare Interoperability Resources (FHIR) service, the Digital Imaging and Communications in Medicine (DICOM) service, and MedTech service.

FHIR service is an implementation of the FHIR specification within Health Data Services. It enables you to combine in a single workspace one or more FHIR service instances with optional DICOM and MedTech service instances. Azure API for FHIR is generally available as a stand-alone service offering.

Each FHIR service instance in Azure Health Data Services has a storage limit of 4 TB by default. If you have more data, you can ask Microsoft to increase storage up to 100 TB for your FHIR service. To request storage greater than 4 TB, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) on the Azure portal and use the issue type Service and Subscription limit (quotas).

| **Quota Name** | **Default Limit**| **Maximum Limit** | **Notes** |
|---|---|---|---|
|Workspace |10|[Contact support](https://azure.microsoft.com/support/options/) |Limit per subscription|
|FHIR |10|[Contact support](https://azure.microsoft.com/support/options/) |Limit per workspace|
|DICOM |10|[Contact support](https://azure.microsoft.com/support/options/) |Limit per workspace|
|MedTech |10|N/A |Limit per workspace, can't be increased|
