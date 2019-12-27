---
title: What is FHIR? 
description: Overview of the Fast Healthcare Interoperability Resources standard.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 12/23/2019
ms.author: cavoeg
---

# What is FHIR®?
The Fast Healthcare Interoperability Resources (FHIR®- Pronounced Fire) is an interoperability standard intended to facilitate the exchange of healthcare data between different health systems. This standard was developed by the HL7 organization and is being adopted by healthcare organizations around the world. The most current version of FHIR® available is R4 (Release 4). The Azure API for FHIR® supports R4 and also supports the previous version STU3 (Standard for Trial Use 3). 

## Resources
FHIR® defines a set of standard [**resources**](http://build.fhir.org/resource.html), which are basically building blocks to describe the current state of the data. Examples of resources include patient, location, and encounter. Examples of things that are not resources include things like birthdate (which is too small) and pregnancy (which is too broad.) When communicating, there will be FHIR® bundles, which group together related resources.

## RESTful API 
FHIR® has a strong foundation in web standards and has support for [RESTful](http://build.fhir.org/http.html) architectures. [Operations](http://www.hl7.org/implement/standards/fhir/operations.html) are also available to extend the RESTful API. Examples of operations are $validate, which validates that the FHIR® resource or bundle is valid, and $meta, which allows you to view the metadata for a resource. 

## Capability Statement
In a FHIR® Server, the [capability statement](https://www.hl7.org/fhir/capabilitystatement.html) will list the supported resource types, formats, integrations, and search parameters. In the Azure API for FHIR®, you can access the capability statement by going to https://EXAMPLE-ACCOUNT-NAME.azurehealthcareapis.com/metadata.

## Next Steps
In this document, you learned more about the FHIR® standard. To learn a lot more about FHIR® visit [HL7.org](http://build.fhir.org/index.html). Once you are ready to get started with FHIR®, you can deploy the Azure API for FHIR®.

>[!div class="nextstepaction"]
>[Deploy Azure API for FHIR®](fhir-paas-portal-quickstart.md)
