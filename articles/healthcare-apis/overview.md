---
title: What is Azure API for FHIR? - Azure API for FHIR 
description: Azure API for FHIR enables rapid exchange of data through FHIR APIs. Ingest, manage, and persist Protected Health Information PHI with a managed cloud service.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 02/07/2019
ms.author: mihansen
---

# What is Azure API for FHIR&reg;?

Azure API for FHIR enables rapid exchange of data through Fast Healthcare Interoperability Resources (FHIR®) APIs, backed by a managed Platform-as-a Service (PaaS) offering in the cloud. It makes it easier for anyone working with health data to ingest, manage, and persist Protected Health Information [PHI](https://www.hhs.gov/answers/hipaa/what-is-phi/index.html) in the cloud: 

- Managed FHIR service, provisioned in the cloud in minutes 
- Enterprise-grade, FHIR®-based endpoint in Azure for data access, and storage in FHIR® format
- High performance, low latency
- Secure management of Protected Health Data (PHI) in a compliant cloud environment
- SMART on FHIR for mobile and web implementations
- Control your own data at scale with Role-Based Access Control (RBAC)
- Audit log tracking for access, creation, modification, and reads within each data store

Azure API for FHIR allows you to create and deploy a FHIR service in just minutes to leverage the elastic scale of the cloud.  You pay only for the throughput and storage you need. The Azure services that power Azure API for FHIR are designed for rapid performance no matter what size datasets you’re managing.

The FHIR API and compliant data store enable you to securely connect and interact with any system that utilizes FHIR APIs.  Microsoft takes on the operations, maintenance, updates, and compliance requirements in the PaaS offering, so you can free up your own operational and development resources. 

The following video presents an overview of Azure API for FHIR:

>[!VIDEO https://www.youtube.com/embed/5vS7Iq9vpXE]

## Leveraging the power of your data with FHIR

The healthcare industry is rapidly transforming health data to the emerging standard of [FHIR&reg;](https://hl7.org/fhir) (Fast Healthcare Interoperability Resources). FHIR enables a robust, extensible data model with standardized semantics and data exchange that enables all systems using FHIR to work together.  Transforming your data to FHIR allows you to quickly connect existing data sources such as the electronic health record systems or research databases. FHIR also enables the rapid exchange of data in modern implementations of mobile and web development. Most importantly, FHIR can simplify data ingestion and accelerate development with analytics and machine learning tools.  

### Securely manage health data in the cloud

The Azure API for FHIR allows for the exchange of data via consistent, RESTful, FHIR APIs based on the HL7 FHIR specification. Backed by a managed PaaS offering in Azure, it also provides a scalable and secure environment for the management and storage of Protected Health Information (PHI) data in the native FHIR format.  

### Free up your resources to innovate

You could invest resources building and running your own FHIR service, but with the Azure API for FHIR, Microsoft takes on the workload of operations, maintenance, updates and compliance requirements, allowing you to free up your own operational and development resources.

### Enable interoperability with FHIR

Using the Azure API for FHIR enables to you connect with any system that leverages FHIR APIs for read, write, search, and other functions.  It can be used as a powerful tool to consolidate, normalize, and apply machine learning with clinical data from electronic health records, clinician and patient dashboards, remote monitoring programs, or with databases outside of your system that have FHIR APIs.

### Control Data Access at Scale

You control your data. Role-Based Access Control (RBAC) enables you to manage how your data is stored and accessed.  Providing increased security and reducing administrative workload, you determine who has access to the datasets you create, based on role definitions you create for your environment.  

### Audit logs and tracking 

Quickly track where your data is going with built-in audit logs. Track access, creation, modification, and reads within each data store.

### Secure your data

Protect your PHI with unparalleled security intelligence.  Your data is isolated to a unique database per API instance and protected with multi-region failover. The Azure API for FHIR implements a layered, in-depth defense and advanced threat protection for your data.  

## Applications for a FHIR Service

FHIR servers are key tools for interoperability of health data.  The Azure API for FHIR is designed as an API and service that you can create, deploy, and begin using quickly.  As the FHIR standard expands in healthcare, use cases will continue to grow, but some initial customer applications where Azure API for FHIR is useful are below: 

- **Startup/IOT and App Development:**  Customers developing a patient or provider centric app (mobile or web) can leverage Azure API for FHIR as a fully managed backend service. The Azure API for FHIR provides a valuable resource in that customers can managing data and exchanging data in a secure cloud environment designed for health data, leverage SMART on FHIR implementation guidelines, and enable their technology to be utilized by all provider systems (for example, most EHRs have enabled FHIR read APIs).   
- **Healthcare Ecosystems:**  While EHRs exist as the primary ‘source of truth’ in many clinical settings, it is not uncommon for providers to have multiple databases that aren’t connected to one another or store data in different formats.  Utilizing the Azure API for FHIR as a service that sits on top of those systems allows you to standardize data in the FHIR format.  This helps to enable data exchange across multiple systems with a consistent data format. 

- **Research:** Healthcare researchers will find the FHIR standard in general and the Azure API for FHIR useful as it normalizes data around a common FHIR data model and reduces the workload for machine learning and data sharing.
Exchange of data via the Azure API for FHIR provides audit logs and access controls that help control the flow of data and who has access to what data types. 

## FHIR from Microsoft

FHIR capabilities from Microsoft are available in two configurations:

* Azure API for FHIR – A PaaS offering in Azure, easily provisioned in the Azure portal and managed by Microsoft.
* FHIR Server for Azure – an open-source project that can be deployed into your Azure subscription, available on GitHub at https://github.com/Microsoft/fhir-server.

For use cases that requires extending or customizing the FHIR server or require access the underlying services—such as the database—without going through the FHIR APIs, developers should choose the open-source FHIR Server for Azure.   For implementation of a turn-key, production-ready FHIR API and backend service where persisted data should only be accessed through the FHIR API, developers should choose the Azure API for FHIR

## Next Steps

To start working with the Azure API for FHIR, follow the 5-minute quickstart to deploy the Azure API for FHIR.

>[!div class="nextstepaction"]
>[Deploy Azure API for FHIR](fhir-paas-portal-quickstart.md)

FHIR is the registered trademark of HL7 and is used with the permission of HL7.
