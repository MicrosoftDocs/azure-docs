---
title: What are Microsoft Healthcare APIs in Azure - Microsoft Healthcare APIs
description: This article describes Microsoft Healthcare APIs.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: overview
ms.date: 02/11/2019
ms.author: mihansen
---

# What are Microsoft Healthcare APIs?

Microsoft Healthcare APIs are a set of services in Azure that provide interfaces for integrating healthcare data. The available services and tools are designed around the emerging [HL7 FHIR Specification](https://hl7.org/fhir). The services are being developed as open-source projects that you can deploy yourself in Azure or you can deploy a managed version of the service in Azure that Microsoft will maintain for you.

The use cases for Microsoft Healthcare APIs are applications that collect and serve healthcare data. Data can be collected from multiple *systems of record* such as electronic medical records, wearable devices, or research applications. The APIs can be used to drive several *systems of engagement*, for example, patient or provider-centric applications, dashboards.

The services have been designed to handle live patient data (Protected Health Information, [PHI](https://www.hhs.gov/answers/hipaa/what-is-phi/index.html))

## FHIR API

FHIR is an evolving standard and users would want to explore the source code and contribute features. The Microsoft Healthcare APIs for Azure are available in two flavors:

* The Open Source Microsoft FHIR Server for Azure. The source code can be found at [https://github.com/Microsoft.com/fhir-server](https://github.com/Microsoft.com/fhir-server).
* The fully managed Platform as a Service (PaaS) Microsoft Healthcare APIs for FHIR.

Use the OSS FHIR Server if you want to make changes to the code. The PaaS FHIR service is recommended for production use cases (using PHI).

## Get started

To start working with the FHIR Service, follow the 5-minute quickstarts:

* Deploy Open Source FHIR Server using [PowerShell](fhir-oss-powershell-quickstart.md)

## Next steps

After setting up the FHIR service, take important steps to configure and test the service:

* [Access FHIR Service using Postman](access-fhir-postman-tutorial.md)
