---
title:  Using DICOMweb - Standard APIs with Azure Healthcare APIs DICOM service 
description: This tutorial describes how to use DICOMweb Standard APIs with the DICOM service. 
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.date: 08/04/2021
ms.author: aersoy
---

# Using DICOMweb&trade;Standard APIs with DICOM services

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This tutorial provides an overview of how to use the DICOMweb&trade; Standard APIs with the DICOM Services.

The DICOM service supports a subset of the DICOMweb&trade; Standard. This support includes the following:

* Store (STOW-RS)
* Retrieve (WADO-RS)
* Search (QIDO-RS)

Additionally, the following non-standard API(s) are supported:

* Delete
* Change Feed

To learn more about our support of the DICOM Web Standard APIs, see the [DICOM Conformance Statement](dicom-services-conformance-statement.md) reference document.

## Prerequisites

To use the DICOMweb&trade; Standard APIs, you must have an instance of the DICOM Services deployed. If you haven't already deployed an instance of the DICOM service, see [Deploy DICOM service using the Azure portal](deploy-dicom-services-in-azure.md).

Once deployment is complete, you can use the Azure portal to navigate to the newly created DICOM service to see the details including your Service URL. The Service URL to access your DICOM service  will be: ```https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com```. Make sure to specify the version as part of the url when making requests. More information can be found in the [API Versioning for DICOM service Documentation](api-versioning-dicom-service.md).

## Overview of various methods to use with DICOM service

Because the DICOM service is exposed as a REST API, you can access it using any modern development language. For language-agnostic information on working with the service, see [DICOM Conformance Statement](dicom-services-conformance-statement.md).

To see language-specific examples, refer to the examples below. If you open the Postman Collection, you can view examples in several languages including Go, Java, JavaScript, C#, PHP, C, NodeJS, Objective-C, OCaml, PowerShell, Python, Ruby, and Swift.

### C#

Refer to the [Using DICOMweb™ Standard APIs with C#](dicomweb-standard-apis-c-sharp.md) tutorial to learn how to use C# with the DICOM service.

### cURL

cURL is a common command-line tool for calling web endpoints that is available for nearly any operating system. [Download cURL](https://curl.haxx.se/download.html) to get started.

To learn how to use cURL with the DICOM service, see [Using DICOMWeb™ Standard APIs with cURL](dicomweb-standard-apis-curl.md) tutorial.

### Phyton

Refer to the [Using DICOMWeb™ Standard APIs with Python](dicomweb-standard-apis-python.md) tutorial to learn how to use Python with the DICOM service.

### Postman

Postman is an excellent tool for designing, building, and testing REST APIs. [Download Postman](https://www.postman.com/downloads/) to get started. You can learn how to effectively use Postman at the [Postman learning site](https://learning.postman.com/).

One important caveat with Postman and the DICOMweb&trade; Standard is that Postman can only support uploading DICOM files using the single part payload defined in the DICOM standard. This reason is because Postman cannot support custom separators in a multipart/related POST request. For more information, see [Multipart POST not working for me # 576](https://github.com/postmanlabs/postman-app-support/issues/576). Thus, all examples in the Postman collection for uploading DICOM documents using a multipart request are prefixed with [will not work - see description]. The examples for uploading using a single part request are included in the collection and are prefixed with "Store-Single-Instance".

To use the Postman collection, you'll need to download the collection locally and import the collection through Postman. To access this collection, see [Postman Collection Examples](https://github.com/microsoft/dicom-server/blob/main/docs/resources/Conformance-as-Postman.postman_collection.json).

## Summary

This tutorial provided an overview of the APIs supported by the DICOM service. Get started using these APIs with the following tools:

- [Using DICOMweb™ Standard APIs with C#](dicomweb-standard-apis-c-sharp.md)
- [Using DICOMWeb™ Standard APIs with cURL](dicomweb-standard-apis-curl.md)
- [Using DICOMWeb™ Standard APIs with Python](dicomweb-standard-apis-python.md)
- [Use DICOM Web Standard APIs with Postman Example Collection](https://github.com/microsoft/dicom-server/blob/main/docs/resources/Conformance-as-Postman.postman_collection.json)

### Next Steps

For more information about DICOM service, see

>[!div class="nextstepaction"]
>[Overview of the DICOM service](dicom-services-overview.md)
