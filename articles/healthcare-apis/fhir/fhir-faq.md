---
title: FAQ about FHIR service in Azure Health Data Services
description: Get answers to frequently asked questions about FHIR service, such as the storage location of data behind FHIR APIs and version support.
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 09/27/2023
ms.author: kesheth
ms.custom: references_regions
---

# Frequently asked questions about FHIR service

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

This section covers some of the frequently asked questions about the Azure Health Data Services FHIR service (hereby called FHIR service).

## FHIR service: The basics

### What is FHIR?

The Fast Healthcare Interoperability Resources (FHIR - Pronounced "fire") is an interoperability standard intended to enable the exchange of healthcare data between different health systems. This standard was developed by the HL7 organization and is being adopted by healthcare organizations around the world. The most current version of FHIR available is R4 (Release 4). The FHIR service supports R4 and the previous version STU3 (Standard for Trial Use 3). For more information on FHIR, visit [HL7.org](http://hl7.org/fhir/summary.html).

### Is the data behind the FHIR APIs stored in Azure?

Yes, the data is stored in managed databases in Azure. The FHIR service in Azure Health Data Services doesn't provide direct access to the underlying data store.

### How can I get access to the underlying data?

In the managed service, you can't access the underlying data. This is to ensure that the FHIR service offers the privacy and compliance certifications needed for healthcare data. If you need access to the underlying data, you can use the [open-source FHIR server](https://github.com/microsoft/fhir-server).  

### What identity provider do you support?

We support Microsoft Azure Active Directory as the identity provider.

### Can I use Azure AD B2C with the FHIR service?

No, we don't support B2C in the FHIR service. If you need more granular access controls, we recommend looking at the [open-source FHIR proxy](https://github.com/microsoft/fhir-proxy). 

### What FHIR version do you support?

We support versions 4.0.0 and 3.0.1.

For more information, see [Supported FHIR features](fhir-features-supported.md). You can also read about what has changed between FHIR versions (STU3 to R4) in the [version history for HL7 FHIR](https://hl7.org/fhir/R4/history.html).

### What is the difference between Azure API for FHIR and the FHIR service in the Azure Health Data Services?

Azure API for FHIR was our initial generally available product and is being retired as of September 30, 2026. The Azure Health Data Services FHIR service supports additional capabilities such as: 

- [Transaction bundles](https://www.hl7.org/fhir/http.html#transaction).
- [Incremental Import](configure-import-data.md)
- [Autoscaling](fhir-service-autoscale.md) enabled by default


### What's the difference between the FHIR service in Azure Health Data Services and the open-source FHIR server?

FHIR service in Azure Health Data Services is a hosted and managed version of the open-source [Microsoft FHIR Server for Azure](https://github.com/microsoft/fhir-server). In the managed service, Microsoft provides all maintenance and updates.

When you run the FHIR Server for Azure, you have direct access to the underlying services, but we're responsible for maintaining and updating the server and all required compliance work if you're storing PHI data.

### In which regions is the FHIR service available?

FHIR service is available in all regions that Azure Health Data Services is available. You can see that on the [Products by Region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-api-for-fhir) page.

### Where can I see what is releasing into the FHIR service?

The [release notes](../release-notes.md) page provides an overview of everything that has shipped to the managed service in the previous month. 

To see what will be releasing to the managed service, you can review the [releases page](https://github.com/microsoft/fhir-server/releases) of the open-source FHIR Server. We've worked to tag items with Azure Health Data Services if they'll release to the managed service and are available two weeks after they are on the release page in open-source. We have also included instructions on how to [test the build](https://github.com/microsoft/fhir-server/blob/master/docs/Testing-Releases.md) if you'd like to test in your own environment. We're evaluating how to best share additional managed service updates.

To see what release package is currently in the managed service, you can view the capability statement for the FHIR service and under the `software.version` property. You'll see which package is deployed. 

### Where can I find what version of FHIR (R4/STU3) is running on my database?

You can find the exact FHIR version exposed in the capability statement under the `fhirVersion` property (FHIR URL/metadata).

### Can I switch my FHIR service from STU3 to R4?

No. We don't have a way to change the version of an existing database. You'll need to create a new FHIR service and reload the data. You can leverage the JSON to FHIR converter as a place to start with converting STU3 data into R4.

### Can I customize the URL for my FHIR service?

No. You can't change the URL for the FHIR service. 

## FHIR Implementations and Specifications

### What is SMART on FHIR?

SMART (Substitutable Medical Applications and Reusable Technology) on FHIR is a set of open specifications to integrate partner applications with FHIR Servers and other Health IT systems, such as Electronic Health Records and Health Information Exchanges. By creating a SMART on FHIR application, you can ensure that your application can be accessed and leveraged by a plethora of different systems. For more information about SMART, see [SMART Health IT](https://smarthealthit.org/).

### Does the FHIR service support SMART on FHIR?

Yes, SMART on FHIR capability is supported using [AHDS samples](https://aka.ms/azure-health-data-services-smart-on-fhir-sample). This is referred to as SMART on FHIR(Enhanced). SMART on FHIR(Enhanced) can be considered to meet requirements with [SMART on FHIR Implementation Guide (v 1.0.0)](https://hl7.org/fhir/smart-app-launch/1.0.0/) and [§170.315(g)(10) Standardized API for patient and population services criterion](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services#ccg). For more information, visit [SMART on FHIR(Enhanced) Documentation](smart-on-fhir.md).


### Can I create a custom FHIR resource?

We don't allow custom FHIR resources. If you need a custom FHIR resource, you can build a custom resource on top of the [Basic resource](https://www.hl7.org/fhir/basic.html) with extensions. 

### Are [extensions](https://www.hl7.org/fhir/extensibility.html) supported on the FHIR service?

We allow you to load any valid FHIR JSON data into the server. If you want to store the structure definition that defines the extension, you can save this as a structure definition resource. To search on extensions, you'll need to [define your own search parameters](how-to-do-custom-search.md).

### How do I see the FHIR service in XML?

In the managed service, we only support JSON. The open-source FHIR server supports JSON and XML. To view the XML version in open-source, use `_format= application/fhir+xml`. 

### What is the limit on _count?

The current limit on _count is 1000. If you set _count to more than 1000, you'll receive a warning in the bundle that only 1000 records will be shown.

### Can I post a bundle to the FHIR service?

We currently support posting [batch bundles](https://www.hl7.org/fhir/valueset-bundle-type.html) and posting [transaction bundles](https://www.hl7.org/fhir/http.html#transaction) in the FHIR service.

### How can I get all resources for a single patient in the FHIR service?

We support the [$patient-everything operation](patient-everything.md) which will get you all data related to a single patient. 

### What is the default sort when searching for resources in the FHIR service?

We support sorting by string and dateTime fields in the FHIR service. For more information about other supported search parameters, see [Overview of FHIR search](overview-of-search.md).

### Does the FHIR service support any terminology operations?

No, the FHIR service doesn't support terminology operations today.

### What are the differences between delete types in the FHIR service? 

There are two basic Delete types supported within the FHIR service. These are [Delete and Conditional Delete](././../fhir/fhir-rest-api-capabilities.md#delete-and-conditional-delete).


* With Delete, you can choose to do a soft delete (most common type) and still be able to recover historic versions of your record.
* With Conditional Delete, you can pass search criteria to delete a resource one item at a time or several at a time.
* If you passed the `hardDelete` parameter with either Delete or Conditional Delete, all the records and history are deleted and unrecoverable.

## Using the FHIR service

### Can I perform health checks on FHIR service?

To perform a health check on a FHIR service, enter `{{fhirurl}}/health/check` in the GET request. You should be able to see status of FHIR service. HTTP Status code response with 200 and OverallStatus as **Healthy** in response means your health check is successful.

In case of errors, you may receive an error response with HTTP status code 404 (Not Found) or status code 500 (Internal Server Error), and detailed information in the response body.

## Next steps

In this article, you've learned the answers to frequently asked questions about FHIR service. To see the frequently asked questions about FHIR service in Azure API for FHIR, see
 
>[!div class="nextstepaction"]
>[FAQs about Azure API for FHIR](../azure-api-for-fhir/fhir-faq.yml)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
