---
title: FAQs about FHIR services in Azure Healthcare APIs
description: Get answers to frequently asked questions about the FHIR service, such as the storage location of data behind FHIR APIs and version support.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 04/30/2021
ms.author: cavoeg
---

# Frequently asked questions about the FHIR service

## FHIR service: The Basics

### What is FHIR?
The Fast Healthcare Interoperability Resources (FHIR - Pronounced "fire") is an interoperability standard intended to enable the exchange of healthcare data between different health systems. This standard was developed by the HL7 organization and is being adopted by healthcare organizations around the world. The most current version of FHIR available is R4 (Release 4). The FHIR service supports R4 and also supports the previous version STU3 (Standard for Trial Use 3). For more information on FHIR, visit [HL7.org](http://hl7.org/fhir/summary.html).

### Is the data behind the FHIR APIs stored in Azure?

Yes, the data is stored in managed databases in Azure. The FHIR service in the Azure Healthcare APIs does not provide direct access to the underlying data store.

### What identity provider do you support?

We currently support Microsoft Azure Active Directory as the identity provider.

### What is the Recovery Point Objective (RPO) for the FHIR Service for the Azure Healthcare APIs?
**Need input from Chad & Benjamin**

### What FHIR version do you support?

We support versions 4.0.0 and 3.0.1.

For details, see [Supported features](fhir-features-supported.md). Read about what has changed between FHIR versions (i.e. STU3 to R4) in the [version history for HL7 FHIR](https://hl7.org/fhir/R4/history.html).

Azure IoT Connector for FHIR (preview) currently supports only FHIR version R4, and is visible only on R4 instances of the FHIR service.

### What is the difference between the Azure API for FHIR and the FHIR service in the Healthcare APIs?
The FHIR service is our implementation of the FHIR specification that sits in the Azure Healthcare APIs, which allows you to have a FHIR service and a DICOM service within a single workspace. The Azure API for FHIR was our initial GA product and is still available as a stand-alone product. The main feature differences are:
* The FHIR service has a limit of 4TB and is in public preview while the Azure API for FHIR supports more than 4TB and is GA.
* The FHIR service support [transaction bundles](https://www.hl7.org/fhir/http.html#transaction).
* Chained searching and reverse chained searching does not have a limit on number of resources returned
* The Azure API for FHIR has more platform features (such as Private Link, CMK) that are not yet available in the FHIR service in the Azure Healthcare APIs. **NEED REVIEW FROM BENJAMIN/CHAD/CHAMI**

### What's the difference between 'FHIR service in the Azure Healthcare APIs' and the 'FHIR server'?

The FHIR service is a hosted and managed version of the open-source Microsoft FHIR Server for Azure. In the managed service, Microsoft provides all maintenance and updates. 

When you run the FHIR Server for Azure, you have direct access to the underlying services, but are responsible for maintaining and updating the server and all required compliance work if you're storing PHI data.

For a development standpoint, every feature that doesn't apply only to the managed service is first deployed to the open-source Microsoft FHIR Server for Azure. Once it has been validated in open-source, it will be released to the PaaS FHIR service. The time between the release in open-source and PaaS depends on the complexity of the feature and other roadmap priorities.

### In which regions is the FHIR service available?

Currently, we have general availability for both public and government in [multiple geo-regions](https://azure.microsoft.com/global-infrastructure/services/?products=azure-api-for-fhir&regions=non-regional,us-east,us-east-2,us-central,us-north-central,us-south-central,us-west-central,us-west,us-west-2,canada-east,canada-central,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia). For information about government cloud services at Microsoft, check out [Azure services by FedRAMP](../../azure-government/compliance/azure-services-in-fedramp-auditscope.md).

**NEED CONFIRMATION THAT THIS IS STILL ACCURATE FOR FHIR Service**

### Where can I see what is releasing into the FHIR service?

To see some of what is releasing into the FHIR service, please refer to the [release](https://github.com/microsoft/fhir-server/releases) of the open-source FHIR Server. We have worked to tag items with FHIR-Service if they will release to the managed service and are usually available two weeks after they are on the release page in open-source. We have also included instructions on how to test the build [here](https://github.com/microsoft/fhir-server/blob/master/docs/Testing-Releases.md) if you would like to test in your own environment. We are evaluating how to best share additional managed service updates.

### What is SMART on FHIR?

SMART (Substitutable Medical Applications and Reusable Technology) on FHIR is a set of open specifications to integrate partner applications with FHIR Servers and other Health IT systems, such as Electronic Health Records and Health Information Exchanges. By creating a SMART on FHIR application, you can ensure that your application can be accessed and leveraged by a plethora of different systems.
To learn more about SMART, visit [SMART Health IT](https://smarthealthit.org/).

### Where can I find what version of FHIR is running on my database. 

You can find the exact FHIR version exposed in the capability statement under the "fhirVersion" property (FHIR URL/metadata)

## FHIR Implementations and Specifications

### Can I create a custom FHIR resource?

We do not allow custom FHIR resources. If you need a custom FHIR resource, you can build a custom resource on top of the [Basic resource](http://www.hl7.org/fhir/basic.html) with extensions. 

### Are [extensions](https://www.hl7.org/fhir/extensibility.html) supported on the FHIR service?

We allow you to load any valid FHIR JSON data into the server. If you want to store the structure definition that defines the extension, you could save this as a structure definition resource. To search on extensions, you'll need to [define your own search parameters](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fazure%2Fhealthcare-apis%2Ffhir%2Fhow-to-do-custom-search&data=04%7C01%7Cv-stevewohl%40microsoft.com%7Cc6a08c7f0c86433f248c08d925377d85%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637581742517376233%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&sdata=Ws%2FVQ2N33sMagzs393hmR67M9dNaL6WCLXyxXtor6PM%3D&reserved=0). 

### What is the limit on _count?

The current limit on _count is 1000. If you set _count to more than 1000, you'll receive a warning in the bundle that only 1000 records will be shown.

### Are there any limitations on the Group Export functionality?

For Group Export we only export the included references from the group, not all the characteristics of the [group resource](https://www.hl7.org/fhir/group.html).

### Can I post a bundle to the FHIR service?

We currently support posting [batch bundles](https://www.hl7.org/fhir/valueset-bundle-type.html) and posting [transaction bundles](https://www.hl7.org/fhir/http.html#transaction) in the FHIR service.

### How can I get all resources for a single patient in the FHIR service?

We support the $patient-everything operation which will get you all data related to a single patient. 

### What is the default sort when searching for resources in the FHIR service?

We support sorting by strings and dates for single fields at a time. For more information about other supported search parameters, see [Overview of FHIR Search](overview-of-search.md).

### How does $export work?

$export is part of the [FHIR specification](https://hl7.org/fhir/uv/bulkdata/export/index.html). If the FHIR service is configured with a managed identity and a storage account, and if the managed identity has access to that storage account - you can simply call $export on the FHIR API and all the FHIR resources will be exported to the storage account. For more information, check out our [article on $export](../data-transformation/export-data.md).

### Is de-identified export available at Patient and Group level as well?
Anonymized export is currently supported only on a full system export (/$export), and not for Patient export (/Patient/$export). We are working on making it available at the Patient level as well.

## Using the FHIR service

### How do I enable log analytics for Azure Healthcare APIs?

**NEED INPUT FROM CHAMI/BENJAMIN/CHAD - I think this should be moved to a more generic FAQ section for all of Healthcare APIs**

We enable diagnostic logging and allow reviewing sample queries for these logs. For details on enabling audit logs and sample queries, check out [this section](enable-diagnostic-logging.md). If you want to include additional information in the logs, check out [using custom HTTP headers](use-custom-headers.md).

### Where can I see some examples of using the FHIR service within a workflow?

We have a collection of reference architectures available on the [Health Architecture GitHub page](https://github.com/microsoft/health-architectures).

### Where can I see an example of connecting a web application to Azure API for FHIR?

We have a [Health Architecture GitHub page](https://aka.ms/health-architectures) that contains example applications and scenarios. It illustrates how to connect a web application to Azure API for FHIR.  

## Azure API for FHIR Features and Services 
**THIS NEEDS TO BE UPDATED BY BENJAMIN/CHAD**

### Is there a way to encrypt my data using my personal key not a default key?

Yes, Azure API for FHIR allows configuring customer-managed keys, leveraging support from Cosmos DB. For more information about encrypting your data with a personal key, check out [this section](../azure-api-for-fhir/customer-managed-key.md).

## Azure API for FHIR: Preview Features
**THIS NEEDS TO BE UPDATED BY THE IOT TEAM**

### Can I configure scaling capacity for Azure IoT Connector for FHIR (preview)?

Since Azure IoT Connector for FHIR is free of charge during public preview, its scaling capacity is fixed and limited. Azure IoT Connector for FHIR configuration available in public preview is expected to provide a throughput of about 200 messages per second. Some form of resource capacity configuration will be made available in General Availability (GA).

### Why can't I install Azure IoT Connector for FHIR (preview) when Private Link is enabled on Azure API for FHIR?

Azure IoT Connector for FHIR doesn't support Private Link capability at this time. Hence, if you have Private Link enabled on Azure API for FHIR, you can't install Azure IoT Connector for FHIR and vice-versa. This limitation is expected to go away when Azure IoT Connector for FHIR is available for General Availability (GA).
