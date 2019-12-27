---
title: What is SMART on FHIR? 
description: Overview of the SMART on FHIR.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 12/23/2019
ms.author: cavoeg
---
# What is SMART® on FHIR®?
SMART® (Substitutable Medical Applications and Reusable Technology) on FHIR® is a set of open specifications to integrate partner applications with FHIR® Servers and other Health IT systems, such as Electronic Health Records and Health Information Exchanges. One of the main purposes of the specifications is to describe how an application should authenticate itself. By creating a SMART® on FHIR® application, you are able to ensure that your application can be accessed and leveraged by a plethora of different systems. 

# Authentication & Azure API for FHIR
Authentication for SMART® on FHIR® is based on OAuth2. However, SMART® on FHIR® uses parameter naming conventions that are not immediately compatible with Azure Active Directory (Azure AD). To assist with  lack of compatibility, the Azure API for FHIR® has a built-in Azure AD SMART® on FHIR® proxy that enables a subset of the SMART® on FHIR® launch sequences. 

# Next Steps
To learn more about SMART®, visit [SMART Health IT](https://smarthealthit.org/). Once you are ready to get started, check out the SMART® on FHIR Proxy® Tutorial.

>[!div class="nextstepaction"]
>[User SMART® on FHIR® Proxy](use-smart-on-fhir-proxy.md)