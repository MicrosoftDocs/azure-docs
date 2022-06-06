---
title: "Azure Healthcare APIs limits include file"
description: "Limits for Azure Healthcare APIs include file"
services: healthcare-apis
author: stevewohl
ms.service: healthcare-apis
ms.topic: "include"
ms.date: 03/15/2022
ms.author: v-stevewohl
ms.custom: "include file"
---

Health Data Services is a set of managed API services based on open standards and frameworks. Health Data Services enables workflows to improve healthcare and offers scalable and secure healthcare solutions. Health Data Services includes Fast Healthcare Interoperability Resources (FHIR) service, the Digital Imaging and Communications in Medicine (DICOM) service, and MedTech service.

FHIR service is an implementation of the FHIR specification within Health Data Services. It enables you to combine in a single workspace one or more FHIR service instances with optional DICOM and MedTech service instances. Azure API for FHIR is generally available as a stand-alone service offering.

FHIR service in Azure Health Data Services has a limit of 4 TB for structured storage.

| **Quota Name** | **Default Limit**| **Maximum Limit** | **Notes** |
|---|---|---|---|
|Workspace |10|[Contact support](https://azure.microsoft.com/support/options/) |Limit per subscription|
|FHIR |10|[Contact support](https://azure.microsoft.com/support/options/) |Limit per workspace|
|DICOM |10|[Contact support](https://azure.microsoft.com/support/options/) |Limit per workspace|
|MedTech |10|N/A |Limit per workspace, can't be increased|
