---
title: FAQ about FHIR service in Azure Health Data Services
description: Get answers to frequently asked questions about FHIR service, such as the storage location of data behind FHIR APIs and version support.
services: healthcare-apis
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: faq
ms.date: 02/23/2026
ms.author: kesheth
ms.custom: references_regions
---

# Frequently asked questions about FHIR service

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

This section covers some of the frequently asked questions about the Azure Health Data Services FHIR&reg; service.

## FHIR service: The basics

### What is FHIR?

The Fast Healthcare Interoperability Resources (FHIR) is an interoperability standard intended to enable the exchange of healthcare data between different health systems. This standard was developed by the HL7 organization and is being adopted by healthcare organizations around the world. The most current version of FHIR available is R4 (Release 4). The FHIR service supports R4 and the previous version STU3 (Standard for Trial Use 3). For more information on FHIR, visit [HL7.org](http://hl7.org/fhir/summary.html).

### Is the data behind the FHIR APIs stored in Azure?

Yes, the data is stored in managed databases in Azure. The FHIR service in Azure Health Data Services doesn't provide direct access to the underlying data store.

### How can I get access to the underlying data?

In the managed service, you can't access the underlying data. This policy is to ensure that the FHIR service offers the privacy and compliance certifications needed for healthcare data. If you need access to the underlying data, you can use the [open-source FHIR server](https://github.com/microsoft/fhir-server).  

### What identity provider do you support?

We support Microsoft Entra ID and non-Microsoft identity providers that support OpenID connect.

### Can I use Azure AD B2C with the FHIR service?

Yes. You can use [Azure Active Directory B2C](../../active-directory-b2c/overview.md) (Azure AD B2C) with the FHIR service to grant access to your applications and users. For more information, see [Use Azure Active Directory B2C to grant access to the FHIR service](../fhir/azure-ad-b2c-setup.md). However, effective **May 1, 2025**, Azure AD B2C will no longer be available to purchase for new customers. New customers need to use [Microsoft Entra External ID](/entra/external-id/customers/overview-customers-ciam).

### What FHIR version do you support?

We support versions 4.0.0 and 3.0.1.

For more information, see [Supported FHIR features](fhir-features-supported.md). You can also read about what changed between FHIR versions (STU3 to R4) in the [version history for HL7 FHIR](https://hl7.org/fhir/R4/history.html).

### What is the difference between Azure API for FHIR and the FHIR service in the Azure Health Data Services?

Azure API for FHIR was our initial generally available product and is being retired as of September 30, 2026. The following table describes differences between Azure API for FHIR and Azure Health Data Services, FHIR service.

|Capabilities|Azure API for FHIR|Azure Health Data Services|
|------------|------------------|--------------------------|
|**Data ingress**|Tools available in OSS|$import operation. For information, visit [Import operation](configure-import-data.md)|
|**Autoscaling**|Supported on request and incurs charge|[Autoscaling](fhir-service-autoscale.md) enabled by default at no extra charge|
|**Search parameters**|Bundle type supported: Batch <br> • Include and revinclude, iterate modifier not supported  <br> • Sorting supported by first name, last name, birthdate and clinical date|Bundle type supported: Batch and transaction  <br> • [Selectable search parameters](selectable-search-parameters.md)  <br> • Include, revinclude, and iterate modifier is supported <br>• Sorting supported by string and dateTime fields|
|**Events**|Not Supported|Supported|
|**Convert-data**|Supports enabling "Allow trusted services" in Account container registry| There's a known issue: Enabling private link with Azure Container Registry can result in access issues when attempting to use the container registry from the FHIR service.|
|**Business continuity**|Supported:<br> • Cross region DR (disaster recovery)  <br>|Supported: <br> • PITR (point in time recovery) <br> • Availability zone support|

By default each Azure Health Data Services, FHIR instance is limited to storage capacity of 4 TB.
To provision a FHIR instance with storage capacity beyond 4 TB, create a support request with Issue type 'Service and Subscription limit (quotas)'.

### What's the difference between the FHIR service in Azure Health Data Services and the open-source FHIR server?

FHIR service in Azure Health Data Services is a hosted and managed version of the open-source [Microsoft FHIR Server for Azure](https://github.com/microsoft/fhir-server). In the managed service, Microsoft provides all maintenance and updates.

When you run the FHIR Server for Azure, you have direct access to the underlying services, but we're responsible for maintaining and updating the server and all required compliance work if you're storing PHI data.

### In which regions is the FHIR service available?

FHIR service is available in all regions that Azure Health Data Services is available. You can see supported regions on the [Products by Region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-api-for-fhir) page.

### Where can I see what is releasing into the FHIR service?

The [release notes](../release-notes.md) page provides an overview of everything that shipped to the managed service in the previous month. 

To see what is releasing to the managed service, you can review the [releases page](https://github.com/microsoft/fhir-server/releases) of the open-source FHIR Server. Items are tagged with Azure Health Data Services if they'll release to the managed service and are available two weeks after they are on the open-source release page in. There are instructions on how to [test the build](https://github.com/microsoft/fhir-server/blob/master/docs/Testing-Releases.md), if you'd like to test in your own environment. We're evaluating how to best share more managed service updates.

To see what release package is currently in the managed service, you can view the capability statement for the FHIR service and under the `software.version` property. 

### Where can I find what version of FHIR (R4/STU3) is running on my database?

You can find the exact FHIR version exposed in the capability statement under the `fhirVersion` property (FHIR URL/metadata).

### Can I switch my FHIR service from STU3 to R4?

No. We don't have a way to change the version of an existing database. You need to create a new FHIR service and reload the data. You can use the JSON to FHIR converter as a place to start with converting STU3 data into R4.

### Can I customize the URL for my FHIR service?

No. You can't change the URL for the FHIR service. 

### What are the limits associated with the FHIR service in Azure Health Data Services?

Refer to the "Service limits" section in 
[Azure FHIR service limits](fhir-features-supported.md#service-limits)

**What should I do if I accidentally deployed the Azure API for FHIR into the wrong subscription, deleted it, and am now facing a deployment failure in the correct subscription with a message stating that the resource name is not available?**

Once a service name is used, it can't be reused in a different subscription, even after deletion. This restriction is in place to prevent impersonation and primarily impacts Azure API for FHIR.

If deployed to the wrong subscription, you can move the resource to the desired subscription instead of deleting and recreating it. [Move Azure Resources](../../azure-resource-manager/management/move-resource-group-and-subscription.md)

**How can I delete a service and then re-add it with the same settings?**

To replicate settings between FHIR instance, you can follow below steps 

*	Create standard ARM templates with the configurations.

*	Create a service and add configuration as per requirement.


## FHIR Implementations and Specifications

### What is SMART on FHIR?

SMART (Substitutable Medical Applications and Reusable Technology) on FHIR is a set of open specifications to integrate partner applications with FHIR Servers and other Health IT systems, such as Electronic Health Records and Health Information Exchanges. By creating a SMART on FHIR application, you can ensure that your application can be accessed and used by many different systems. For more information about SMART, see [SMART Health IT](https://smarthealthit.org/).

### Does the FHIR service support SMART on FHIR?

Yes, SMART on FHIR capability is supported using [AHDS samples](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/blob/main/samples/patientandpopulationservices-smartonfhir-oncg10-smart-v1/docs/deployment.md). This capability is referred to as SMART on FHIR(Enhanced). SMART on FHIR(Enhanced) can be considered to meet requirements with [SMART on FHIR Implementation Guide (v 1.0.0)](https://hl7.org/fhir/smart-app-launch/1.0.0/) and [§170.315(g)(10) Standardized API for patient and population services criterion](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services#ccg). For more information, visit [SMART on FHIR(Enhanced) Documentation](smart-on-fhir.md).


### Can I create a custom FHIR resource?

Custom FHIR resources are not supported. If you need a custom FHIR resource, you can build a custom resource on top of the [Basic resource](https://www.hl7.org/fhir/basic.html) with extensions. 

### Are extensions supported on the FHIR service?

Yes. You can load any valid FHIR JSON data into the server. If you want to store the structure definition that defines [extensions](https://www.hl7.org/fhir/extensibility.html), you can save it as a structure definition resource. To search on extensions, you need to [define your own search parameters](how-to-do-custom-search.md).

### How do I see the FHIR service in XML?

In the managed service, we only support JSON. The open-source FHIR server supports JSON and XML. To view the XML version in open-source, use `_format= application/fhir+xml`. 

### What is the limit on _count?

The current limit on _count is 1000. If you set _count to more than 1000, you receive a warning in the bundle that only 1000 records will be shown.

### Can I post a bundle to the FHIR service?

Posting [batch bundles](https://www.hl7.org/fhir/valueset-bundle-type.html) and posting [transaction bundles](https://www.hl7.org/fhir/http.html#transaction) in the FHIR service is supported.

### How can I get all resources for a single patient in the FHIR service?

Use the [$patient-everything operation](patient-everything.md) that gets you all data related to a single patient. 

### Does the FHIR service support any terminology operations?

No, the FHIR service doesn't currently support terminology operations.

## Using the FHIR service

### Can I perform health checks on FHIR service?

To perform a health check on a FHIR service, enter `{{fhirurl}}/health/check` in the GET request. You should be able to see status of FHIR service. An HTTP Status code response with 200 and OverallStatus as **Healthy** means your health check is successful.

If there are errors, you could receive an error response with HTTP status code 404 (Not Found) or status code 500 (Internal Server Error), and detailed information in the response body.

**What are the recommended methods for syncing data between the FHIR service and Dataverse?**

Refer to documentation for
[Dataverse healthcare APIs](/dynamics365/industry/healthcare/dataverse-healthcare-apis-overview)


## Next steps

In this article, you learned the answers to frequently asked questions about FHIR service. To see the frequently asked questions about FHIR service in Azure API for FHIR, see
 
>[!div class="nextstepaction"]
>[FAQs about Azure API for FHIR](../azure-api-for-fhir/fhir-faq.yml)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]

