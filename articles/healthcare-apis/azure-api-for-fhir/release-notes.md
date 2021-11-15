---
title: Azure API for FHIR monthly releases
description: This article provides details about the Azure API for FHIR monthly features and enhancements.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 11/15/2021
ms.author: cavoeg
---

# Release notes: Azure API for FHIR

Azure API for FHIR provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document provides details about the features and enhancements made to Azure API for FHIR.


## October 2021

### **Bug fixes**

| Infinite loop bug | Related information          |
| ----------------- | ---------------------------- |
|Fixed issue where [Conditional Delete](./././../azure-api-for-fhir/fhir-rest-api-capabilities.md#conditional-delete) could result in an infinite loop. | [#2269](https://github.com/microsoft/fhir-server/pull/2269) |

## September 2021 

### **Features and enhancements**

|Enhancements |Related information |
|------------------- | ---------------|

|Added support for conditional patch | [Conditional patch](././../azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch)|
| :----------------------------------- | ------ |
|Conditional patch |[#2163](https://github.com/microsoft/fhir-server/pull/2163) |
|Added conditional patch audit event. |[#2213](https://github.com/microsoft/fhir-server/pull/2213) |

|Allow JSON patch in bundles | [JSON patch in bundles](././../azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-in-bundles)|
| ----------------------------------- | ------ |
|Allows for search history bundles with Patch requests. |[#2156](https://github.com/microsoft/fhir-server/pull/2156) | 
|Enabled JSON patch in bundles using Binary resources. |[#2143](https://github.com/microsoft/fhir-server/pull/2143) |

|New audit event sub-types |Related information |
| ----------------------------------- | --------------- |
|Added new audit [OperationName subtypes](././../azure-api-for-fhir/enable-diagnostic-logging.md#audit-log-details).| [#2170](https://github.com/microsoft/fhir-server/pull/2170) |

|[Reindex improvements](how-to-run-a-reindex.md) |Related information |
| ----------------------------------- | --------------- |
|Added [boundaries for reindex](how-to-run-a-reindex.md) parameters. |[#2103](https://github.com/microsoft/fhir-server/pull/2103)|
|Update error message for reindex parameter boundaries. |[#2109](https://github.com/microsoft/fhir-server/pull/2109)|
|Added final reindex count check. |[#2099](https://github.com/microsoft/fhir-server/pull/2099)|


### **Bug fixes**

|Resolved patch bugs |Related information |
| :----------------------------------- | --------------- |
|Wider catch for exceptions when applying patch. |[#2192](https://github.com/microsoft/fhir-server/pull/2192)|
|Fixes history with PATCH in STU3.| [#2177](https://github.com/microsoft/fhir-server/pull/2177)|

|Custom search bugs |Related information |
| ----------------------------------- | ---------------: |
|Addresses the delete failure with Custom Search parameters. | [#2133](https://github.com/microsoft/fhir-server/pull/2133)|
|Added retry logic while Deleting Search parameter. | [#2121](https://github.com/microsoft/fhir-server/pull/2121)|
|Set max item count in search options in SearchParameterDefinitionManager. | [#2141](https://github.com/microsoft/fhir-server/pull/2141)|
|Provides better exception if there's a bad expression in search parameter. |[#2157](https://github.com/microsoft/fhir-server/pull/2157)|

|Resolved retry 503 error |Related information |
| ----------------------------------- | --------------- |
|Retry 503 error from Cosmos DB. |[#2106](https://github.com/microsoft/fhir-server/pull/2106)|
|Fixes processing 429s from StoreProcedures. |[#2165](https://github.com/microsoft/fhir-server/pull/2165)|

|GitHub issues closed |Related information |
| ----------------------------------- | --------------- |
|Unable to create custom search parameter for the CarePlan medical device. |[#2146](https://github.com/microsoft/fhir-server/issues/2146) |
|Unclear error message for conditional create with no ID. | [#2168](https://github.com/microsoft/fhir-server/issues/2168)|

### IoT connector for FHIR (preview)

|Bug fixes |Related information |
| ----------------------------------- | --------------- |
|Fixed broken link.| Updated link to the IoT connector Azure documentation in the Azure API for FHIR portal. |

## Next steps

For information about the features and bug fixes in Azure Healthcare APIs (FHIR service, DICOM service, and IoT connector), see

>[!div class="nextstepaction"]
>[Release notes: Azure Healthcare APIs](../release-notes.md)
