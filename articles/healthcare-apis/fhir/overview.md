---
title: What is the FHIR service in Azure Health Data Services?
description: The FHIR service enables rapid exchange of health data through FHIR APIs. Ingest, manage, and persist Protected Health Information (PHI) with a managed cloud service.
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 09/01/2023
ms.author: kesheth
---

# What is the FHIR service?

The FHIR service in Azure Health Data Services enables rapid exchange of health data using the Fast Healthcare Interoperability Resources (FHIR®) data standard. As part of a managed Platform-as-a-Service (PaaS), the FHIR service makes it easy for anyone working with health data to securely store and exchange Protected Health Information ([PHI](https://www.hhs.gov/answers/hipaa/what-is-phi/index.html)) in the cloud. 

The FHIR service offers the following:

- Managed FHIR-compliant server, provisioned in the cloud in minutes 
- Enterprise-grade FHIR API endpoint for FHIR data access and storage
- High performance, low latency
- Secure management of Protected Health Information (PHI) in a compliant cloud environment
- SMART on FHIR for mobile and web clients
- Controlled access to FHIR data at scale with Azure Active Directory Role-Based Access Control (RBAC)
- Audit log tracking for access, creation, and modification events within the FHIR service data store

The FHIR service allows you to quickly create and deploy a FHIR server to leverage the elastic scale of the cloud for ingesting, persisting, and querying FHIR data. The Azure services that power the FHIR service are designed for high performance no matter how much data you're working with.

The FHIR API provisioned in the FHIR service enables any FHIR-compliant system to securely connect and interact with FHIR data. As a PaaS offering, Microsoft takes on the operations, maintenance, update, and compliance requirements for the FHIR service so you can free up your own operational and development resources. 

## Leveraging the power of your data with FHIR

The healthcare industry is rapidly adopting [FHIR®](https://hl7.org/fhir) as the industry-wide standard for health data storage, querying, and exchange. FHIR provides a robust, extensible data model with standardized semantics that all FHIR-compliant systems can use interchangeably. With FHIR, organizations can unify disparate electronic health record systems (EHRs) and other health data repositories – allowing all data to be persisted and exchanged in a single, universal format. With the addition of SMART on FHIR, user-facing mobile and web-based applications can securely interact with FHIR data – opening a new range of possibilities for patient and provider access to PHI. Most of all, FHIR simplifies the process of assembling large health datasets for research – enabling researchers and clinicians to apply machine learning and analytics at scale for gaining new health insights. 

### Securely manage health data in the cloud

The FHIR service in Azure Health Data Services makes FHIR data available to clients through a RESTful API. This API is an implementation of the HL7 FHIR API specification. As a managed PaaS offering in Azure, the FHIR service gives organizations a scalable and secure environment for the storage and exchange of Protected Health Information (PHI) in the native FHIR format.  

### Free up your resources to innovate

You could invest resources building and maintaining your own FHIR server, but with the FHIR service in Azure Health Data Services, Microsoft handles setting up the server's components, ensuring all compliance requirements are met so you can focus on building innovative solutions. 

### Enable interoperability with FHIR

The FHIR service enables connection with any health data system or application capable of sending FHIR API requests. Coupled with other parts of the Azure ecosystem, the FHIR service forms a link between electronic health records systems (EHRs) and Azure's powerful suite of data analytics and machine learning tools – enabling organizations to build patient and provider-facing applications that harness the full power of the Microsoft cloud.

### Control Data Access at Scale

With the FHIR service, you control your data – at scale. The FHIR service's Role-Based Access Control (RBAC) is rooted in Azure AD identities management, which means you can grant or deny access to health data based on the roles given to individuals in your organization. These RBAC settings for the FHIR service are configurable in Azure Health Data Services at the workspace level. This simplifies system management and guarantees your organization's PHI is safe within a HIPAA and HITRUST-compliant environment.

### Secure your data

As part of the Azure family of services, the FHIR service protects your organization's PHI with an unparalleled level of security. In Azure Health Data Services, your FHIR data is isolated to a unique database per FHIR service instance and protected with multi-region failover. On top of this, FHIR service implements a layered, in-depth defense and advanced threat detection for your data – giving you peace of mind that your organization's PHI is guarded by Azure's industry-leading security. 

## Applications for the FHIR service

FHIR servers are essential for interoperability of health data. The FHIR service is designed as a managed FHIR server with a RESTful API for connecting to a broad range of client systems and applications. Some of the key use cases for the FHIR service are listed below: 

- **Startup App Development:** Customers developing a patient- or provider-centric app (mobile or web) can leverage FHIR service as a fully managed backend for health data transactions. The FHIR service enables secure transfer of PHI, and with SMART on FHIR, app developers can take advantage of the robust identities management in Azure AD for authorization of FHIR RESTful API actions. 

- **Healthcare Ecosystems:** While EHRs exist as the primary ‘source of truth’ in many clinical settings, it isn't uncommon for providers to have multiple databases that aren’t connected to one another (often because the data is stored in different formats). Utilizing the FHIR service as a conversion layer between these systems allows organizations to standardize data in the FHIR format. Ingesting and persisting in FHIR enables health data querying and exchange across multiple disparate systems. 

- **Research:** Health researchers have embraced the FHIR standard as it gives the community a shared data model and removes barriers to assembling large datasets for machine learning and analytics. With the FHIR service's data conversion and PHI de-identification capabilities, researchers can prepare HIPAA-compliant data for secondary use before sending the data to Azure Machine Learning and analytics pipelines. The FHIR service's audit logging and alert mechanisms also play an important role in research workflows.

## FHIR platforms from Microsoft

FHIR capabilities from Microsoft are available in three configurations:

* The **FHIR service** is a managed platform as a service (PaaS) that operates as part of Azure Health Data Services. In addition to the FHIR service, Azure Health Data Services includes managed services for other types of health data such as the DICOM service for medical imaging data and the MedTech service for medical IoT data. All services (FHIR service, DICOM service, and MedTech service) can be connected and administered within an Azure Health Data Services workspace. 
* **Azure API for FHIR** is a managed FHIR server offered as a PaaS in Azure – easily provisioned in the Azure portal. Azure API for FHIR is not part of Azure Health Data Services and lacks some of the features of the FHIR service.
* **FHIR Server for Azure**, an open-source FHIR server that can be deployed into your Azure subscription, is available on GitHub at https://github.com/Microsoft/fhir-server.

For use cases that require customizing a FHIR server with admin access to the underlying services (e.g., access to the database without going through the FHIR API), developers should choose the open-source FHIR Server for Azure. For implementation of a turnkey, production-ready FHIR API with a provisioned database backend (i.e., data can only be accessed through the FHIR API - not the database directly), developers should choose the FHIR service.

## Next Steps

To start working with the FHIR service, follow the 5-minute quickstart instructions for FHIR service deployment.

>[!div class="nextstepaction"]
>[Deploy FHIR service](fhir-portal-quickstart.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
