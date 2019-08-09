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
ms.date: 06/26/2019
ms.author: apimpm
---

# API import restrictions and known issues

## About this list

When importing an API, you might come across some restrictions or identify issues that need to be rectified before you can successfully import. This article documents these, organized by the import format of the API.

## <a name="open-api"> </a>OpenAPI/Swagger

If you're receiving errors importing your OpenAPI document, make sure you've validated it beforehand. You can do that either using the designer in the Azure portal (Design - Front End - OpenAPI Specification Editor), or with a third-party tool such as <a href="https://editor.swagger.io">Swagger Editor</a>.

### <a name="open-api-general"> </a>General

-   Required parameters across both path and query must have unique names. (In OpenAPI a parameter name only needs to be unique within a location, for example path, query, header. However, in API Management we allow operations to be discriminated by both path and query parameters (which OpenAPI doesn't support). That's why we require parameter names to be unique within the entire URL template.)
-   **\$ref** pointers can't reference external files.
-   **x-ms-paths** and **x-servers** are the only supported extensions.
-   Custom extensions are ignored on import and aren't saved or preserved for export.
-   **Recursion** - API Management doesn't support definitions defined recursively (for example, schemas referring to themselves).
-   Source file URL (if available) is applied to relative server URLs.

### <a name="open-api-v2"> </a>OpenAPI version 2

-   Only JSON format is supported.

### <a name="open-api-v3"> </a>OpenAPI version 3

-   If many **servers** are specified, API Management will try to select the first HTTPs URL. If there aren't any HTTPs URLs - the first HTTP URL. If there aren't any HTTP URLs - the server URL will be empty.
-   **Examples** isn't supported, but **example** is.
-   **Multipart/form-data** isn't supported.

> [!IMPORTANT]
> See this [document](https://blogs.msdn.microsoft.com/apimanagement/2018/04/11/important-changes-to-openapi-import-and-export/) for important information and tips related to OpenAPI import.

## <a name="wsdl"> </a>WSDL

WSDL files are used to create SOAP pass-through and SOAP-to-REST APIs.

-   **SOAP bindings** -Only SOAP bindings of style ”document” and “literal” encoding are supported. There is no support for “rpc” style or SOAP-Encoding.
-   **WSDL:Import** - This attribute isn't supported. Customers should merge the imports into one document.
-   **Messages with multiple parts** - These types of messages aren't supported.
-   **WCF wsHttpBinding** - SOAP services created with Windows Communication Foundation should use basicHttpBinding - wsHttpBinding isn't supported.
-   **MTOM** - Services using MTOM <em>may</em> work. Official support isn't offered at this time.
-   **Recursion** - Types that are defined recursively (for example, refer to an array of themselves) are not supported by APIM.
-   **Multiple Namespaces** - Multiple namespaces can be used in a schema, but only the target namespace can be used to define message parts. Namespaces other than the target which are used to define other input or output elements are not preserved. Although such a WSDL document can be imported, on export all message parts will have the target namespace of the WSDL.
-   **Arrays** - SOAP-to-REST transformation supports only wrapped arrays shown in the example below:

```xml
    <complexType name="arrayTypeName">
        <sequence>
            <element name="arrayElementValue" type="arrayElementType" minOccurs="0" maxOccurs="unbounded"/>
        </sequence>
    </complexType>
    <complexType name="typeName">
        <sequence>
            <element name="element1" type="someTypeName" minOccurs="1" maxOccurs="1"/>
            <element name="element2" type="someOtherTypeName" minOccurs="0" maxOccurs="1" nillable="true"/>
            <element name="arrayElement" type="arrayTypeName" minOccurs="1" maxOccurs="1"/>
        </sequence>
    </complexType>
```

## <a name="wadl"> </a>WADL

Currently, there are no known WADL import issues.
