---
title:  Using DICOMweb - Standard APIs with Azure Health Data Services DICOM service 
description: This tutorial describes how to use DICOMweb Standard APIs with the DICOM service. 
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.date: 10/13/2022
ms.author: mmitrik
---

# Using DICOMweb&trade;Standard APIs with DICOM services

This tutorial provides an overview of how to use DICOMweb&trade; Standard APIs with the DICOM service.

The DICOM service supports a subset of DICOMweb&trade; Standard that includes:

* [Store (STOW-RS)](dicom-services-conformance-statement-v2.md#store-stow-rs)
* [Retrieve (WADO-RS)](dicom-services-conformance-statement-v2.md#retrieve-wado-rs)
* [Search (QIDO-RS)](dicom-services-conformance-statement-v2.md#search-qido-rs)
* [Delete](dicom-services-conformance-statement-v2.md#delete)

Additionally, the following non-standard API(s) are supported:

* [Change Feed](dicom-change-feed-overview.md)
* [Extended Query Tags](dicom-extended-query-tags-overview.md)

To learn more about our support of DICOM Web Standard APIs, see the [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md) reference document.

## Prerequisites

To use DICOMweb&trade; Standard APIs, you must have an instance of DICOM service deployed. If you haven't already deployed an instance of DICOM service, see [Deploy DICOM service using the Azure portal](deploy-dicom-services-in-azure.md).

Once deployment is complete, you can use the Azure portal to navigate to the newly created DICOM service to see the details including your Service URL. The Service URL to access your DICOM service  will be: ```https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com```. Make sure to specify the version as part of the url when making requests. More information can be found in the [API Versioning for DICOM service Documentation](api-versioning-dicom-service.md).

## Overview of various methods to use with DICOM service

Because DICOM service is exposed as a REST API, you can access it using any modern development language. For language-agnostic information on working with the service, see [DICOM Services Conformance Statement](dicom-services-conformance-statement-v2.md).

To see language-specific examples, refer to the examples below. You can view Postman collection examples in several languages including:

* Go 
* Java 
* JavaScript 
* C# 
* PHP 
* C 
* NodeJS
* Objective-C
* OCaml
* PowerShell
* Python
* Ruby 
* Swift

### C#

Refer to the [Using DICOMweb™ Standard APIs with C#](dicomweb-standard-apis-c-sharp.md) tutorial to learn how to use C# with DICOM service.

### cURL

cURL is a common command-line tool for calling web endpoints that is available for nearly any operating system. [Download cURL](https://curl.haxx.se/download.html) to get started.

To learn how to use cURL with DICOM service, see [Using DICOMWeb™ Standard APIs with cURL](dicomweb-standard-apis-curl.md) tutorial.

### Python

Refer to the [Using DICOMWeb™ Standard APIs with Python](dicomweb-standard-apis-python.md) tutorial to learn how to use Python with the DICOM service.

### Postman

Postman is an excellent tool for designing, building, and testing REST APIs. [Download Postman](https://www.postman.com/downloads/) to get started. You can learn how to effectively use Postman at the [Postman learning site](https://learning.postman.com/).

One important caveat with Postman and DICOMweb&trade; Standard is that Postman can only support uploading DICOM files using the single part payload defined in the DICOM standard. This reason is because Postman can't support custom separators in a multipart/related POST request. For more information, see [Multipart POST not working for me # 576](https://github.com/postmanlabs/postman-app-support/issues/576). Thus, all examples in the Postman collection for uploading DICOM documents using a multipart request are prefixed with [won't work - see description]. The examples for uploading using a single part request are included in the collection and are prefixed with "Store-Single-Instance".

To use the Postman collection, you'll need to download the collection locally and import the collection through Postman. To access this collection, see [Postman Collection Examples](https://github.com/microsoft/dicom-server/blob/main/docs/resources/Conformance-as-Postman.postman_collection.json).

## Summary

This tutorial provided an overview of the APIs supported by DICOM service. Get started using these APIs with the following tools:

- [Using DICOMweb™ Standard APIs with C#](dicomweb-standard-apis-c-sharp.md)
- [Using DICOMWeb™ Standard APIs with cURL](dicomweb-standard-apis-curl.md)
- [Using DICOMWeb™ Standard APIs with Python](dicomweb-standard-apis-python.md)
- [Use DICOMWeb™ Standard APIs with Postman Example Collection](https://github.com/microsoft/dicom-server/blob/main/docs/resources/Conformance-as-Postman.postman_collection.json)

### Next Steps

For more information, see

>[!div class="nextstepaction"]
>[Overview of the DICOM service](dicom-services-overview.md)
