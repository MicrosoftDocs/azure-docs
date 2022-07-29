---
title: What is FHIR service?
description: The FHIR service enables rapid exchange of data through FHIR APIs. Ingest, manage, and persist Protected Health Information PHI with a managed cloud service.
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 06/06/2022
ms.author: chrupa
---

# What is the FHIR service in Azure Health Data Services?

The FHIR service in Azure Health Data Services enables rapid exchange of health data using the Fast Healthcare Interoperability Resources (FHIR®) data standard. Offered as a managed Platform-as-a-Service (PaaS) for the storage and exchange of FHIR data, the FHIR service makes it easy for anyone working with health data to securely manage Protected Health Information [PHI](https://www.hhs.gov/answers/hipaa/what-is-phi/index.html) in the cloud. 

The FHIR service offers the following:

- Managed FHIR-compliant server, provisioned in the cloud in minutes 
- Enterprise-grade FHIR API endpoint in Azure for FHIR data access and storage
- High performance, low latency
- Secure management of Protected Health Information (PHI) in a compliant cloud environment
- SMART on FHIR for mobile and web implementations
- Controlled client access to FHIR data at scale with AAD-backed Role-Based Access Control (RBAC)
- Audit log tracking for access, creation, modification, and reads within the FHIR service data store

FHIR service allows you to create and deploy a FHIR server in just minutes to leverage the elastic scale of the cloud for ingesting, persisting, and querying FHIR data. The Azure services that power the FHIR service are designed for high performance no matter what size of dataset you're working with.

The FHIR API and data store that are provisioned in the FHIR service enable any FHIR-compliant system to securely connect and interact with FHIR data. Microsoft takes on the operations, maintenance, updates, and compliance requirements in the PaaS offering so you can free up your own operational and development resources. 

## Leveraging the power of your data with FHIR

The healthcare industry is rapidly adopting [FHIR®](https://hl7.org/fhir) as the standard for health data storage, querying, and exchange. FHIR enables a robust, extensible data model with standardized semantics that all FHIR-compliant systems can use to connect with each other. With FHIR, organizations can unify disparate electronic health record systems (EHRs) and other health data repositories – allowing all data to be stored in a single, universal format. With the addition of SMART on FHIR, user-facing mobile and web-based applications can securely interact with FHIR data – opening a new range of possibilities for health data interoperability. Most importantly, FHIR simplifies the process of assembling large health datasets for research – providing a path for researchers and clinicians to unlock health insights through machine learning and analytics.  

### Securely manage health data in the cloud

The FHIR service in Azure Health Data Services makes FHIR data available to clients through a FHIR RESTful API – an implementation of the HL7 FHIR API specification. Provisioned as a managed PaaS offering in Azure, the FHIR service gives organizations a scalable and secure environment for the storage and exchange of Protected Health Information (PHI) in the native FHIR format.  

### Free up your resources to innovate

You could invest resources building and running your own FHIR server, but with the FHIR service in Azure Health Data Services, Microsoft takes on the task of setting up the server's components and making sure all compliance requirements are met so that you can focus on building innovative solutions. 

### Enable interoperability with FHIR

The FHIR service enables connection with any health data system or application capable of sending FHIR API requests. Coupled with other parts of the Azure ecosystem, the FHIR service forms a crucial link in connecting electronic health records systems (EHRs) to Azure's powerful suite of data analytics and machine learning tools – enabling organizations to build patient and provider-facing applications that harness the full power of the Microsoft cloud.

### Control Data Access at Scale

With FHIR service, you control your data – at scale. Role-Based Access Control (RBAC) rooted in AAD identities management enables granting or denying access to health data based on the roles given to individuals in your organization. These RBAC security measures for FHIR service are configurable in Azure Health Data Services at the workspace level, simplifying system management and guaranteeing your organization's PHI is safe within a HIPAA and HITRUST-compliant environment.

### Secure your data

Protect your PHI with unparalleled security intelligence. Your data is isolated to a unique database per API instance and protected with multi-region failover. FHIR service implements a layered, in-depth defense and advanced threat protection for your data.  

## Applications for the FHIR service

FHIR servers are key tools for interoperability of health data. The FHIR service is designed as an API and service that you can create, deploy, and begin using quickly. As the FHIR standard expands in healthcare, use cases will continue to grow, but some initial customer applications where FHIR service is useful are below: 

- **Startup/IoT and App Development:** Customers developing a patient or provider centric app (mobile or web) can leverage FHIR service as a fully managed backend service. The FHIR service provides a valuable resource in that customers can manage and exchange data in a secure cloud environment designed for health data, leverage SMART on FHIR implementation guidelines, and enable their technology to be utilized by all provider systems (for example, most EHRs have enabled FHIR read APIs).   

- **Healthcare Ecosystems:** While EHRs exist as the primary ‘source of truth’ in many clinical settings, it isn't uncommon for providers to have multiple databases that aren’t connected to one another or store data in different formats.  Utilizing the FHIR service as a service that sits on top of those systems allows you to standardize data in the FHIR format.  This helps to enable data exchange across multiple systems with a consistent data format. 

- **Research:** Healthcare researchers will find the FHIR standard in general and the FHIR service useful as it normalizes data around a common FHIR data model and reduces the workload for machine learning and data sharing.
Exchange of data via the FHIR service provides audit logs and access controls that help control the flow of data and who has access to what data types. 

## FHIR from Microsoft

FHIR capabilities from Microsoft are available in three configurations:

* The FHIR service in Azure Health Data Services is a platform as a service (PaaS) offering in Azure that's easily provisioned in the Azure portal and managed by Microsoft. Includes the ability to provision other datasets, such as DICOM in the same workspace. 
* Azure API for FHIR - A PaaS offering in Azure, easily provisioned in the Azure portal and managed by Microsoft. This implementation only includes FHIR data and is a GA product. 
* FHIR Server for Azure – an open-source project that can be deployed into your Azure subscription, available on GitHub at https://github.com/Microsoft/fhir-server.

For use cases that requires extending or customizing FHIR server or require access the underlying services—such as the database—without going through the FHIR APIs, developers should choose the open-source FHIR Server for Azure.  For implementation of a turn-key, production-ready FHIR API and backend service where persisted data should only be accessed through the FHIR API, developers should choose FHIR service.

## Next Steps

To start working with the FHIR service, follow the 5-minute quickstart to deploy FHIR service.

>[!div class="nextstepaction"]
>[Deploy FHIR service](fhir-portal-quickstart.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
