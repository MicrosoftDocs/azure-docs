---
title: What is Azure API for FHIR - Azure API for FHIR
description: This article describes Azure API for FHIR.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: overview
ms.date: 02/07/2019
ms.author: mihansen
---

# What is Azure API for FHIR?

## Open protocol for healthcare management and sharing

The Azure API for FHIR&reg; is a fully managed, standards-based, and compliant healthcare data platform. It enables organizations to bring their clinical health data into the cloud based on the interoperable data standard [FHIR&reg;](https://hl7.org/fhir). 

FHIR helps unlock the value of data and respond to changing business dynamics more easily. 

Organizations are able to bring together clinical data from multiple systems of records, normalize the data using common models and specifications, and use that data in AI workloads to derive insight and power new systems of engagement, including clinician and patient dashboards, diagnostic assistants, population health insights, and connected healthcare scenarios, such as Remote Patient Monitoring.  

The Azure API for FHIR is capable of powering Internet of Medical Things (IoMT) scenarios, population health research projects, AI-powered diagnostic solutions and much more.

The Azure API for FHIR® meets all regulatory compliance for healthcare data.

Security and privacy embedded into the service, which conforms to global health privacy and security standards. Customers own and control patient data, knowing how it is stored and accessed.

The services have been designed to handle live patient data (Protected Health Information, [PHI](https://www.hhs.gov/answers/hipaa/what-is-phi/index.html))

## FHIR API

FHIR is an evolving standard and users would want to explore the source code and contribute features. The Azure API for FHIR are available in two flavors:

* The Open Source Microsoft FHIR Server for Azure. The source code can be found at [https://github.com/Microsoft.com/fhir-server](https://github.com/Microsoft.com/fhir-server).
* The fully managed Platform as a Service (PaaS) Azure API for FHIR.

Use the OSS FHIR Server if you want to make changes to the code. The PaaS FHIR service is recommended for production use cases (using PHI).

## Get started

To start working with the FHIR Service, follow the 5-minute quickstarts:

* Deploy Open Source FHIR Server using [PowerShell](fhir-oss-powershell-quickstart.md)

## Next steps

After setting up the FHIR service, take important steps to configure and test the service:

* [Access FHIR Service using Postman](access-fhir-postman-tutorial.md)
