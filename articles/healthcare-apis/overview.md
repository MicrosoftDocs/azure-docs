---
title: What is Microsoft Healthcare APIs | Microsoft Docs 
description: Learn how to power interoperable healthcare applications with Microsoft Healthcare APIs.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: overview 
ms.date: 02/11/2019
ms.author: mihansen
---

# What is Microsoft Healthcare APIs?

Microsoft Healthcare APIs are focused on integrating healthcare data in Azure. The available services and tools are designed around the emerging [HL7 FHIR Specification](https://hl7.org/fhir).

The use cases for Microsoft Healthcare APIs are applications that collect and serve healthcare data. For example, patient or provider-centric applications.

The services have been designed to handle live patient data (Protected Health Information, [PHI](https://www.hhs.gov/answers/hipaa/what-is-phi/index.html))

## FHIR Service

FHIR is an evolving standard and users would want to explore the source code and contribute features. The Microsoft Healthcare APIs for Azure are available in two flavors:

* The Open Source Microsoft FHIR Server for Azure. The source code can be found at [https://github.com/Microsoft.com/fhir-server](https://github.com/Microsoft.com/fhir-server).
* The fully managed Platform as a Service (PaaS) Microsoft Healthcare APIs for FHIR.

Use the OSS FHIR Server if you want to make changes to the code. The PaaS FHIR service is recommended for production use cases (using PHI).

## Get Started

To start working with the FHIR Service, follow the 5-minute quickstarts:

* Deploy Open Source FHIR Server using [PowerShell](fhir-oss-powershell-quickstart.md)

## Next steps

After setting up the FHIR service, take important steps to configure and test the service:

* Configure FHIR Service Identity Source
* Configure Role Based Access Control
* Access FHIR Service using Postman