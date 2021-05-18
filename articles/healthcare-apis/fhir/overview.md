---
title: What is Azure API for FHIR? - Azure API for FHIR 
description: Azure API for FHIR enables rapid exchange of data through FHIR APIs. Ingest, manage, and persist Protected Health Information PHI with a managed cloud service.
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 11/13/2020
ms.author: matjazl
---

# What is Azure API for FHIR&reg;?

Azure API for FHIR enables rapid exchange of data through Fast Healthcare Interoperability Resources (FHIR®) APIs, backed by a managed Platform-as-a Service (PaaS) offering in the cloud. It makes it easier for anyone working with health data to ingest, manage, and persist Protected Health Information [PHI](https://www.hhs.gov/answers/hipaa/what-is-phi/index.html) in the cloud: 

- Managed FHIR service, provisioned in the cloud in minutes 
- Enterprise-grade, FHIR®-based endpoint in Azure for data access, and storage in FHIR® format
- High performance, low latency
- Secure management of Protected Health Information (PHI) in a compliant cloud environment
- SMART on FHIR for mobile and web implementations
- Control your own data at scale with role-based access control (RBAC)
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

You control your data. Role-based access control (RBAC) enables you to manage how your data is stored and accessed.  Providing increased security and reducing administrative workload, you determine who has access to the datasets you create, based on role definitions you create for your environment.  

### Audit logs and tracking 

Quickly track where your data is going with built-in audit logs. Track access, creation, modification, and reads within each data store.

### Secure your data

Protect your PHI with unparalleled security intelligence.  Your data is isolated to a unique database per API instance and protected with multi-region failover. The Azure API for FHIR implements a layered, in-depth defense and advanced threat protection for your data.  

## Applications for a FHIR Service

FHIR servers are key tools for interoperability of health data.  The Azure API for FHIR is designed as an API and service that you can create, deploy, and begin using quickly.  As the FHIR standard expands in healthcare, use cases will continue to grow, but some initial customer applications where Azure API for FHIR is useful are below: 

- **Startup/IoT and App Development:**  Customers developing a patient or provider centric app (mobile or web) can leverage Azure API for FHIR as a fully managed backend service. The Azure API for FHIR provides a valuable resource in that customers can managing data and exchanging data in a secure cloud environment designed for health data, leverage SMART on FHIR implementation guidelines, and enable their technology to be utilized by all provider systems (for example, most EHRs have enabled FHIR read APIs).   
- **Healthcare Ecosystems:**  While EHRs exist as the primary ‘source of truth’ in many clinical settings, it is not uncommon for providers to have multiple databases that aren’t connected to one another or store data in different formats.  Utilizing the Azure API for FHIR as a service that sits on top of those systems allows you to standardize data in the FHIR format.  This helps to enable data exchange across multiple systems with a consistent data format. 

- **Research:** Healthcare researchers will find the FHIR standard in general and the Azure API for FHIR useful as it normalizes data around a common FHIR data model and reduces the workload for machine learning and data sharing.
Exchange of data via the Azure API for FHIR provides audit logs and access controls that help control the flow of data and who has access to what data types. 

## FHIR from Microsoft

FHIR capabilities from Microsoft are available in two configurations:

* Azure API for FHIR – A PaaS offering in Azure, easily provisioned in the Azure portal and managed by Microsoft.
* FHIR Server for Azure – an open-source project that can be deployed into your Azure subscription, available on GitHub at https://github.com/Microsoft/fhir-server.

For use cases that requires extending or customizing the FHIR server or require access the underlying services—such as the database—without going through the FHIR APIs, developers should choose the open-source FHIR Server for Azure.   For implementation of a turn-key, production-ready FHIR API and backend service where persisted data should only be accessed through the FHIR API, developers should choose the Azure API for FHIR

## Azure IoT Connector for FHIR (preview)

Azure IoT Connector for Fast Healthcare Interoperability Resources (FHIR&#174;)* is an optional feature of Azure API for FHIR that provides the capability to ingest data from Internet of Medical Things (IoMT) devices. Internet of Medical Things is a category of IoT devices that capture and exchange health & wellness data with other healthcare IT systems over network. Some examples of IoMT devices include fitness and clinical wearables, monitoring sensors, activity trackers, point of care kiosks, or even a smart pill. The Azure IoT Connector for FHIR feature enables you to quickly set up a service to ingest IoMT data into Azure API for FHIR in a scalable, secure, and compliant manner.

Azure IoT Connector for FHIR can accept any JSON-based messages sent out by an IoMT device. This data is first transformed into appropriate FHIR-based [Observation](https://www.hl7.org/fhir/observation.html) resources and then persisted into Azure API for FHIR. The data transformation logic is defined through a pair of mapping templates that you configure based on your message schema and FHIR requirements. Device data can be pushed directly to Azure IoT Connector for FHIR or seamlessly used in concert with other Azure IoT solutions ([Azure IoT Hub](../../iot-hub/index.yml) and [Azure IoT Central](../../iot-central/index.yml)). Azure IoT Connector for FHIR provides a secure data pipeline while allowing the Azure IoT solutions manage provisioning and maintenance of the physical devices.

### Applications of Azure IoT Connector for FHIR (preview)

Use of IoMT devices is rapidly expanding in healthcare and Azure IoT Connector for FHIR is designed to bridge the gap of bringing multiple devices data with security and compliance into Azure API for FHIR. Bringing IoMT data into a FHIR server enables holistic data insights and innovative clinical workflows. Some common scenarios for Azure IoT Connector for FHIR are:
- **Remote Patient Monitoring/Telehealth:** Remote patient monitoring provides the ability to gather patient health data outside of traditional healthcare settings. Healthcare institutions can use Azure IoT Connector for FHIR to bring health data generated by remote devices into Azure API for FHIR. This data could be used to closely track patients health status, monitor patients adherence to the treatment plan and provide personalized care.
- **Research and Life Sciences:** Clinical trials are rapidly adopting IoMT devices like bio sensors, wearables, mobile apps to capture trial data. These trials can harness Azure IoT Connector for FHIR to transmit device data to Azure API for FHIR in a secure, efficient, and effective manner. Once in Azure API for FHIR, trial data could be used to run real-time analysis of trial data.
- **Advanced Analytics:** IoMT devices can provide large volume and variety of data at a high velocity, which makes them a great fit for serving training and testing data for your machine learning models. Azure IoT Connector for FHIR is inherently built to work with wide range of data frequency, flexible data schema, and cloud scaling with low latency. These attributes make Azure IoT Connector for FHIR an excellent choice for capturing device data for your advanced analytics needs.
- **Smart Hospitals/Clinics:** Today smart hospitals and clinics are setting up an infrastructure of interconnected digital assets. Azure IoT Connector for FHIR can be used to capture and integrate data from these connected components. Actionable insights from such data set enable better patient care and operational efficiency.

## Next Steps

To start working with the Azure API for FHIR, follow the 5-minute quickstart to deploy the Azure API for FHIR.

>[!div class="nextstepaction"]
>[Deploy Azure API for FHIR](fhir-paas-portal-quickstart.md)

To try out the Azure IoT Connector for FHIR feature, check out the quickstart to deploy Azure IoT Connector for FHIR using Azure portal.

>[!div class="nextstepaction"]
>[Deploy Azure IoT Connector for FHIR](iot-fhir-portal-quickstart.md)

*In the Azure portal, Azure IoT Connector for FHIR is referred to as IoT Connector (preview). FHIR is a registered trademark of HL7 and is used with the permission of HL7. 
