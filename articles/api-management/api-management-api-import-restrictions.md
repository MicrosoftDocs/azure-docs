---
title: Restrictions and known issues in Azure API Management API import | Microsoft Docs
description: Details of known issues and restrictions on import into Azure API Management using the Open API, WSDL or WADL formats.
services: api-management
documentationcenter: ''
author: vladvino
manager: vlvinogr
editor: ''

ms.assetid: 7a5a63f0-3e72-49d3-a28c-1bb23ab495e2
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/29/2017
ms.author: apipm

---
# API import restrictions and known issues
## About this list
When importing an API, you might come across some restrictions or identify issues that need to be rectified before you can successfully import. This article documents these, organized by the import format of the API.

## <a name="open-api"> </a>OpenAPI/Swagger
If you are receiving errors importing your OpenAPI document, ensure you have validated it - either using the designer in the Azure portal (Design - Front End - OpenAPI Specification Editor), or with a third-party tool such as <a href="http://editor.swagger.io">Swagger Editor</a>.

* Only JSON format for OpenAPI is supported.
* Required parameters across both path and query must have unique names. (In OpenAPI a parameter name only needs to be unique within a location, e.g. path, query, header.  However, in API Management we allow operations to be discriminated by both path and query parameters (which OpenAPI does not support). Therefore we require parameter names to be unique within the entire URL template.)
* Schemas referenced using **$ref** properties can't contain other **$ref** properties.
* **$ref** pointers can't reference external files.
* **x-ms-paths** and **x-servers** are the only supported extensions.
* Custom extensions are ignored on import and are not saved or preserved for export.

> [!IMPORTANT]
> See this [document](https://blogs.msdn.microsoft.com/apimanagement/2018/04/11/important-changes-to-openapi-import-and-export/) for important information and tips related to OpenAPI import.

## <a name="wsdl"> </a>WSDL
WSDL files are used to generate SOAP Pass-through APIs or serve as the backend of a SOAP-to-REST API.
* **SOAP bindings** -Only SOAP bindings of style ”document” and “literal” encoding are supported. There is no support for “rpc” style or SOAP-Encoding.
* **WSDL:Import** - This attribute is not supported. Customers should merge the imports into one document.
* **Messages with multiple parts** - These types of messages are not supported.
* **WCF wsHttpBinding** - SOAP services created with Windows Communication Foundation should use basicHttpBinding - wsHttpBinding is not supported.
* **MTOM** - Services using MTOM <em>may</em> work. Official support is not offered at this time.
* **Recursion** - Types that are defined recursively (for example, refer to an array of themselves) are not supported by APIM.

## <a name="wadl"> </a>WADL
Currently, there are no known WADL import issues.
