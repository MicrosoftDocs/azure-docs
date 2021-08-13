---
title:  Using DICOMweb - Standard APIs with Azure Healthcare APIs DICOM service 
description: This tutorial describes how to use DICOMweb Standard APIs with the DICOM service. 
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.date: 07/10/2021
ms.author: aersoy
---

# Using DICOMweb&trade;Standard APIs with DICOM Services

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This tutorial provides an overview of how to use the DICOMweb&trade; Standard APIs with the DICOM Services.

The DICOM service supports a subset of the DICOMweb&trade; Standard. This support includes:

* Store (STOW-RS)
* Retrieve (WADO-RS)
* Search (QIDO-RS)

Additionally, the following non-standard API(s) are supported:

* Delete
* Change Feed

To learn more about our support of the DICOM Web Standard APIs, see the [DICOM Conformance Statement](dicom-services-conformance-statement.md) reference document.

## Prerequisites

To use the DICOMweb&trade; Standard APIs, you must have an instance of the DICOM Services deployed. If you haven't already deployed an instance of the DICOM service, see [Deploy DICOM Service using the Azure portal](deploy-dicom-services-in-azure.md).

## Overview of various methods to use with DICOM service

Because the DICOM service is exposed as a REST API, you can access it using any modern development language. For language-agnostic information on working with the service, see [DICOM Conformance Statement](dicom-services-conformance-statement.md).

To see language-specific examples, refer to the examples below. If you open the Postman Collection, you can view examples in several languages including Go, Java, JavaScript, C#, PHP, C, NodeJS, Objective-C, OCaml, PowerShell, Python, Ruby, and Swift.

### C#

The C# examples use the library included in this repo to simplify access to the API. Refer to the [C# examples](dicomweb-standard-apis-c-sharp.md) to learn how to use C# with the DICOM service.

### cURL

cURL is a common command-line tool for calling web endpoints that is available for nearly any operating system. [Download cURL](https://curl.haxx.se/download.html) to get started. To use the examples, you'll need to replace the server name with your instance name, and then you must download the [sample DICOM files](https://github.com/microsoft/dicom-server/tree/main/docs/dcms) in this repo to a known location on your local file system. To learn how to use cURL with the DICOM service, see [cURL examples](dicomweb-standard-apis-curl.md).

### Postman

Postman is an excellent tool for designing, building, and testing REST APIs. [Download Postman](https://www.postman.com/downloads/) to get started. You can learn how to effectively use Postman at the [Postman learning site](https://learning.postman.com/).

One important caveat with Postman and the DICOMweb&trade; Standard is that Postman can only support uploading DICOM files using the single part payload defined in the DICOM standard. This reason is because Postman cannot support custom separators in a multipart/related POST request. For more information, see [Multipart POST not working for me # 576](https://github.com/postmanlabs/postman-app-support/issues/576). Thus, all examples in the Postman collection for uploading DICOM documents using a multipart request are prefixed with [will not work - see description]. The examples for uploading using a single part request are included in the collection and are prefixed with "Store-Single-Instance".

To use the Postman collection, you'll need to download the collection locally and import the collection through Postman. To access this collection, see [Postman Collection Examples](https://github.com/microsoft/dicom-server/blob/main/docs/resources/Conformance-as-Postman.postman_collection.json).

## Summary

This tutorial provided an overview of the APIs supported by the DICOM service. Get started using these APIs with the following tools:

- [Use DICOM Web Standard APIs with C#](dicomweb-standard-apis-c-sharp.md)
- [Use DICOM Web Standard APIs with cURL](dicomweb-standard-apis-curl.md)
- [Use DICOM Web Standard APIs with Postman Example Collection](https://github.com/microsoft/dicom-server/blob/main/docs/resources/Conformance-as-Postman.postman_collection.json)

### Next Steps

For more information about DICOM service, see

>[!div class="nextstepaction"]
>[Overview of the DICOM service](dicom-services-overview.md)
