---
title: "Azure Healthcare APIs limits include file"
description: "Limits for Azure Healthcare APIs include file"
services: healthcare-apis
author: stevewohl
ms.service: healthcare-apis
ms.topic: "include"
ms.date: 11/30/2021
ms.author: v-stevewohl
ms.custom: "include file"
---

Azure Healthcare APIs is a set of managed API services based on open standards and frameworks. The service enables workflows to improve healthcare, and offers scalable and secure healthcare solutions. It's currently in public preview. Azure Healthcare APIs includes the Fast Healthcare Interoperability Resources (FHIR) service, the Digital Imaging and Communications in Medicine (DICOM) service, and the IoT connector.

The FHIR service is an implementation of the FHIR specification within the Azure Healthcare APIs. It enables you to combine in a single workspace one or more FHIR service instances with optional DICOM service instances and IoT connectors. The Azure API for FHIR is General Availability (GA), and available as a stand-alone service offering.

| **Quota Name** | **Default Limit**| **Maximum Limit** | **Notes** |
|---|---|---|---|
|Workspace |10|[Contact support](https://azure.microsoft.com/support/options/) |Limit per subscription|
|FHIR |10|[Contact support](https://azure.microsoft.com/support/options/) |Limit per workspace|
|DICOM |10|[Contact support](https://azure.microsoft.com/support/options/) |Limit per workspace|
|IoT connector |10|N/A |Limit per workspace, can't be increased|
