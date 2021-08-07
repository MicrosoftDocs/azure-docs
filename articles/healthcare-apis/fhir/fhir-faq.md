---
title: FAQs about FHIR services in Azure Healthcare APIs
description: Get answers to frequently asked questions about the FHIR service, such as the storage location of data behind FHIR APIs and version support.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/03/2021
ms.author: cavoeg
ms.custom: references_regions
---

# Frequently asked questions about the FHIR service

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This section covers some of the frequently asked questions about the Azure Healthcare APIs FHIR service (hear by called the FHIR service).

## FHIR service: The Basics

### What is FHIR?

The Fast Healthcare Interoperability Resources (FHIR - Pronounced "fire") is an interoperability standard intended to enable the exchange of healthcare data between different health systems. This standard was developed by the HL7 organization and is being adopted by healthcare organizations around the world. The most current version of FHIR available is R4 (Release 4). The FHIR service supports R4 and also supports the previous version STU3 (Standard for Trial Use 3). For more information on FHIR, visit [HL7.org](http://hl7.org/fhir/summary.html).

### Is the data behind the FHIR APIs stored in Azure?

Yes, the data is stored in managed databases in Azure. The FHIR service in the Azure Healthcare APIs does not provide direct access to the underlying data store.

### What identity provider do you support?

We currently support Microsoft Azure Active Directory as the identity provider.

### What FHIR version do you support?

We support versions 4.0.0 and 3.0.1.

For details, see [Supported features](fhir-features-supported.md). Read about what has changed between FHIR versions (i.e. STU3 to R4) in the [version history for HL7 FHIR](https://hl7.org/fhir/R4/history.html).

### What is the difference between the Azure API for FHIR and the FHIR service in the Healthcare APIs?

The FHIR service is our implementation of the FHIR specification that sits in the Azure Healthcare APIs, which allows you to have a FHIR service and a DICOM service within a single workspace. The Azure API for FHIR was our initial GA product and is still available as a stand-alone product. The main feature differences are:

* The FHIR service has a limit of 4TB and is in public preview while the Azure API for FHIR supports more than 4TB and is GA.
* The FHIR service support [transaction bundles](https://www.hl7.org/fhir/http.html#transaction).
* The Azure API for FHIR has more platform features (such as private link, customer managed keys, and logging) that are not yet available in the FHIR service in the Azure Healthcare APIs. More details will follow on these features by GA.

### What's the difference between 'FHIR service in the Azure Healthcare APIs' and the open-source 'FHIR server'?

The FHIR service in the Azure Healthcare APIs is a hosted and managed version of the open-source Microsoft FHIR Server for Azure. In the managed service, Microsoft provides all maintenance and updates.

When you run the FHIR Server for Azure, you have direct access to the underlying services, but are responsible for maintaining and updating the server and all required compliance work if you're storing PHI data.

### In which regions is the FHIR service available?

We are expanding the global footprints of the Healthcare APIs continually based on customer demands. The FHIR service is currently available in 25 regions including two U.S. government regions: Australia East, Brazil South*, Canada Central, Central India*, East Asia*, East US 2, East US, Germany North**, Germany West Central, Germany North**, Japan East, Japan West*, Korea Central*, North Central US, North Europe, South Africa North, South Central US, Southeast Asia, Switzerland North, UK South, UK West, West Central US, West Europe, West US 2, USGov Virginia, USGov Arizona.

*denotes private preview regions; ** denotes disaster recovery region only.

For more information, please see the [support for geo-regions](https://azure.microsoft.com/global-infrastructure/services/?products=azure-api-for-fhir&regions=all).

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

We allow you to load any valid FHIR JSON data into the server. If you want to store the structure definition that defines the extension, you could save this as a structure definition resource. To search on extensions, you'll need to [define your own search parameters](how-to-do-custom-search.md). 

### What is the limit on _count?

The current limit on _count is 1000. If you set _count to more than 1000, you'll receive a warning in the bundle that only 1000 records will be shown.

### Can I post a bundle to the FHIR service?

We currently support posting [batch bundles](https://www.hl7.org/fhir/valueset-bundle-type.html) and posting [transaction bundles](https://www.hl7.org/fhir/http.html#transaction) in the FHIR service.

### How can I get all resources for a single patient in the FHIR service?

We support the [$patient-everything operation](patient-everything.md) which will get you all data related to a single patient. 

## Using the FHIR service

### Where can I see some examples of using the FHIR service within a workflow?

We have a collection of reference architectures available on the [Health Architecture GitHub page](https://github.com/microsoft/health-architectures).

### Where can I see an example of connecting a web application to FHIR service?

We have a [Health Architecture GitHub page](https://aka.ms/health-architectures) that contains example applications and scenarios. It illustrates how to connect a web application to FHIR service.
