---
title: What is FHIR Server for Azure? - FHIR Server for Azure
description: Learn about FHIR Server for Azure, an open-source implementation of the HL7 Fast Healthcare Interoperability Resources (FHIR) specification for the cloud. 
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 02/07/2019
ms.author: matjazl
---

# What is FHIR Server for Azure?

FHIR&reg; Server for Azure is an open-source implementation of the emerging [HL7 Fast Healthcare Interoperability Resources (FHIR) specification](https://www.hl7.org/fhir/) designed for the Microsoft cloud. The FHIR specification defines how clinical health data can be made interoperable across systems. FHIR Server for Azure helps facilitate that interoperability in the cloud. The goal of this Microsoft Healthcare project is to enable developers to rapidly deploy FHIR service.
 
With data in the FHIR format, the FHIR Server for Azure enables developers to quickly ingest and manage FHIR datasets in the cloud, track, and manage data access and normalize data for machine learning workloads. FHIR Server for Azure is optimized for the Azure ecosystem: 
* Scripts and ARM templates are available for immediate provisioning in the Microsoft Cloud 
* Scripts are available to map to Azure AAD and enable role-based access control (RBAC) 

FHIR Server for Azure is built with logical separation, enabling developers with flexibility to modify how it is implemented, and extend its capabilities as needed. The logic layers of the FHIR Server are: 

* Hosting Layer – Supports hosting in different environments, with custom configuration of Inversion of Control (IoC) containers. 
* RESTful API Layer – The implementation of the APIs defined by the HL7 FHIR specification. 
* Core Logic Layer – The implementation of the core FHIR logic. 
* Persistence Layer – A pluggable persistence provider enabling the FHIR Server to connect to virtually any data persistence utility. FHIR Server for Azure includes a ready-to-use data persistence provider for Azure Cosmos DB (a globally replicated database service that offers rich querying over data). 

FHIR Server for Azure empowers developers – saving time when they need to quickly integrate FHIR Server into their own applications or providing them with a foundation on which they can customize their own FHIR service. As an open source project, contributions and feedback from the FHIR developer community will continue to improve this project. 

Privacy and security are top priorities and the FHIR Server for Azure has been developed in support of requirements for Protected Health Information (PHI). All the Azure services used in FHIR Server for Azure [meet the compliance requirements for Protected Health Information](https://www.microsoft.com/en-us/trustcenter/compliance/complianceofferings).

This open source project is fully backed by the Microsoft Healthcare team, but we know that this project will only get better with your feedback and contributions. We are leading the development of this code base, and test builds and deployments daily. 

## Get started
To start working with the open source implementation of the FHIR server, follow the 5-minute quickstart:
* Deploy open source FHIR server using [Powershell](fhir-oss-powershell-quickstart.md)

## Next steps
Learn more about our Platform-as-a-Service offering of the FHIR server, Azure API for FHIR

>[!div class="nextstepaction"]
>[Overview of Azure API for FHIR](overview.md)

