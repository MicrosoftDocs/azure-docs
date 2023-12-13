---
title:  Use DICOMweb Standard APIs with the DICOM servixw in Azure Health Data Services
description: This tutorial describes how to use DICOMweb Standard APIs with the DICOM service. 
author: mmitrik
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: tutorial
ms.date: 10/13/2022
ms.author: mmitrik
---

# Access DICOMweb APIs with the DICOM service

The DICOM&reg; service allows you to store, review, search, and delete DICOM objects using a subset of DICOMweb APIs, which are web-based services that follow the DICOM standard. By using these APIs, you can access and manage your organization's DICOM data in the cloud without requiring complex protocols or formats.

The supported services are:

* [Store (STOW-RS)](dicom-services-conformance-statement-v2.md#store-stow-rs): Upload DICOM objects to the server.
* [Retrieve (WADO-RS)](dicom-services-conformance-statement-v2.md#retrieve-wado-rs): Download DICOM objects from the server.
* [Search (QIDO-RS)](dicom-services-conformance-statement-v2.md#search-qido-rs): Find DICOM objects on the server based on criteria.
* [Delete](dicom-services-conformance-statement-v2.md#delete): Remove DICOM objects from the server.

In addition to the subset of DICOMweb APIs, the DICOM service supports two custom APIs that are unique to Microsoft:

* [Change feed](dicom-change-feed-overview.md): Track changes to DICOM data over time.
* [Extended query tags](dicom-extended-query-tags-overview.md): Define custom tags for querying DICOM data.

## Prerequisites

- **Deploy an instance of the DICOM service**. For more information, see [Deploy the DICOM service using Azure portal](deploy-dicom-services-in-azure.md).

- **Find your Service URL**. Use Azure portal to navigate to the instance of the DICOM service to find the Service URL. The Service URL to access your DICOM service uses this format: ```https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com```. Make sure to specify the version as part of the URL when making requests. For more information, see [API versioning for the DICOM service](api-versioning-dicom-service.md).

## Use REST API methods to interact with the DICOM service

The DICOM service provides a web-based interface that follows REST (representational state transfer) principles. The REST API allows different applications or systems to communicate with each other using standard methods like GET, POST, PUT, and DELETE. Use any programming language that supports HTTP requests and responses to interact with the DICOM service.

For language-specific examples, refer to the examples. You can view Postman collection examples in several languages including:

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

Refer to [Use DICOMweb Standard APIs with C#](dicomweb-standard-apis-c-sharp.md) to learn how to use C# with DICOM service.

### cURL

cURL is a common command-line tool for calling web endpoints and is available for most operating systems. To get started, [download cURL](https://curl.haxx.se/download.html).

To learn how to use cURL with DICOM service, see [Using DICOMWeb™ Standard APIs with cURL](dicomweb-standard-apis-curl.md) tutorial.

### Python

Refer to the [Using DICOMWeb™ Standard APIs with Python](dicomweb-standard-apis-python.md) tutorial to learn how to use Python with the DICOM service.

### Postman

Postman is an excellent tool for designing, building, and testing REST APIs. [Download Postman](https://www.postman.com/downloads/) to get started. Learn how to use Postman at the [Postman learning site](https://learning.postman.com/).

One important caveat with Postman and the DICOMweb Standard is that Postman only supports uploading DICOM files using the single part payload defined in the DICOM standard. This reason is because Postman can't support custom separators in a multipart/related POST request. For more information, see [Multipart POST not working for me # 576](https://github.com/postmanlabs/postman-app-support/issues/576). All examples in the Postman collection for uploading DICOM documents using a multipart request are prefixed with **[won't work - see description]**. The examples for uploading using a single-part request are included in the collection and are prefixed with **Store-Single-Instance**.

To use the Postman collection, you need to download the collection locally and import the collection through Postman. To access this collection, see [Postman Collection Examples](https://github.com/microsoft/dicom-server/blob/main/docs/resources/Conformance-as-Postman.postman_collection.json).

### Next steps
Check out these examples of how to use the APIs:

- [Using DICOMweb™ Standard APIs with C#](dicomweb-standard-apis-c-sharp.md)
- [Using DICOMWeb™ Standard APIs with cURL](dicomweb-standard-apis-curl.md)
- [Using DICOMWeb™ Standard APIs with Python](dicomweb-standard-apis-python.md)
- [Use DICOMWeb™ Standard APIs with the Postman Example Collection](https://github.com/microsoft/dicom-server/blob/main/docs/resources/Conformance-as-Postman.postman_collection.json)

Learn more about Microsoft support for DICOM Web Standard APIs in the [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md).

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]