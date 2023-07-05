---
title: Restrictions and details of API formats support
titleSuffix: Azure API Management
description: Details of known issues and restrictions on OpenAPI, WSDL, and WADL formats support in Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 03/02/2022
ms.author: danlep
---

# API import restrictions and known issues

When importing an API, you might encounter some restrictions or need to identify and rectify issues before you can successfully import. In this article, you'll learn:

* API Management's behavior during OpenAPI import. 
* OpenAPI import limitations and how OpenAPI export works.
* Requirements and limitations for WSDL and WADL import.

## API Management during OpenAPI import

During OpenAPI import, API Management:

* Checks specifically for query string parameters marked as required.
* By default, converts the required query string parameters to required template parameters. 

If you prefer that required query parameters in the specification are translated to query parameters in API Management, disable the **Include query parameters in operation templates** setting when creating the API in the portal. You can also accomplish this by using the [APIs - Create or Update](/rest/api/apimanagement/current-ga/apis/create-or-update) REST API to set the API's `translateRequiredQueryParameters` property to `query`.


For GET, HEAD, and OPTIONS operations, API Management discards a request body parameter if defined in the OpenAPI specification. 

## <a name="open-api"> </a>OpenAPI/Swagger import limitations

If you receive errors while importing your OpenAPI document, make sure you've validated it beforehand by either:

* Using the designer in the Azure portal (Design > Front End > OpenAPI Specification Editor), or 
* With a third-party tool, such as <a href="https://editor.swagger.io">Swagger Editor</a>.

### <a name="open-api-general"> </a>General

#### URL template requirements

| Requirement | Description |
| ----------- | ----------- |
| **Unique names for required path and query parameters** | In OpenAPI: <ul><li>A parameter name only needs to be unique within a location, for example path, query, header.</li></ul>In API Management:<ul><li>We allow operations to be discriminated by both path and query parameters.</li><li>OpenAPI doesn't support this discrimination, so we require parameter names to be unique within the entire URL template.</li></ul>  |
| **Defined URL parameter** | Must be part of the URL template. |
| **Available source file URL** | Applied to relative server URLs. |
| **`\$ref` pointers** | Can't reference external files. |


#### OpenAPI specifications

**Supported versions**

API Management only supports:

* OpenAPI version 2.
* OpenAPI version 3.0.x (up to version 3.0.3).
* OpenAPI version 3.1 (import only)

**Size limitations**

| Size limit | Description |
| ---------- | ----------- |
| **Up to 4 MB** | When an OpenAPI specification is imported inline to API Management. |
| **Size limit doesn't apply** | When an OpenAPI document is provided via a URL to a location accessible from your API Management service. |

#### Supported extensions

The only supported extensions are:

| Extension | Description |
| ----------- | ----------- |
| **`x-ms-paths`** | <ul><li>Allows you to define paths that are differentiated by query parameters in the URL.</li><li>Covered in the [AutoRest docs](https://github.com/Azure/autorest/tree/main/docs/extensions#x-ms-paths).</li></ul> |
| **`x-servers`** | A backport of the [OpenAPI 3 `servers` object](https://swagger.io/docs/specification/api-host-and-base-path/) for OpenAPI 2. |

#### Unsupported extensions

| Extension | Description |
| ----------- | ----------- |
| **`Recursion`** | API Management doesn't support definitions defined recursively.<br />For example, schemas referring to themselves. |
| **`Server` object** | Not supported on the API operation level. |
| **`Produces` keyword** | Describes MIME types returned by an API. <br />Not supported. |

#### Custom extensions

* Are ignored on import.
* Aren't saved or preserved for export.

#### Unsupported definitions 

Inline schema definitions for API operations aren't supported. Schema definitions:

* Are defined in the API scope.
* Can be referenced in API operations request or response scopes.

#### Ignored definitions

Security definitions are ignored.

#### Definition restrictions

<!-- Ref: 1851786 Query parameter handling -->
When importing query parameters, only the default array serialization method (`style: form`, `explode: true`) is supported.  For more details on query parameters in OpenAPI specifications, refer to [the serialization specification](https://swagger.io/docs/specification/serialization/).

<!-- Ref: 1795433 Parameter limitations -->
Parameters [defined in cookies](https://swagger.io/docs/specification/describing-parameters/#cookie-parameters) aren't supported.  You can still use policy to decode and validate the contents of cookies.  

### <a name="open-api-v2"> </a>OpenAPI version 2

OpenAPI version 2 support is limited to JSON format only.

<!-- Ref: 1795433 Parameter limitations -->
["Form" type parameters](https://swagger.io/specification/v2/#parameter-object) aren't supported.  You can still use policy to decode and validate `application/x-www-form-urlencoded` and `application/form-data` payloads.

### <a name="open-api-v3"> </a>OpenAPI version 3.x

API Management supports the following specification versions:

* [OpenAPI 3.0.3](https://swagger.io/specification/)
* [OpenAPI 3.1.0](https://spec.openapis.org/oas/v3.1.0) (import only)

#### HTTPS URLs

* If multiple `servers` are specified, API Management will use the first HTTPS URL it finds. 
* If there aren't any HTTPS URLs, the server URL is empty.

#### Supported

- `example`

#### Unsupported

The following fields are included in either [OpenAPI version 3.0.x](https://swagger.io/specification/) or [OpenAPI version 3.1.x](https://spec.openapis.org/oas/v3.1.0), but aren't supported:

| Object | Field |
| ----------- | ----------- |
| **OpenAPI** | `externalDocs` |
| **Info** | `summary` |
| **Components** | <ul><li>`responses`</li><li>`parameters`</li><li>`examples`</li><li>`requestBodies`</li><li>`headers`</li><li>`securitySchemes`</li><li>`links`</li><li>`callbacks`</li></ul> |
| **PathItem** | <ul><li>`trace`</li><li>`servers`</li></ul> |
| **Operation** | <ul><li>`externalDocs`</li><li>`callbacks`</li><li>`security`</li><li>`servers`</li></ul> |
| **Parameter** | <ul><li>`allowEmptyValue`</li><li>`style`</li><li>`explode`</li><li>`allowReserved`</li></ul> |

## OpenAPI import, update, and export mechanisms

### <a name="open-import-export-general"> </a>General

API definitions exported from an API Management service are:

* Primarily intended for external applications that need to call the API hosted in API Management service. 
* Not intended to be imported into the same or different API Management service. 

For configuration management of API definitions across different services/environments, refer to documentation regarding using API Management service with Git. 

### Add new API via OpenAPI import

For each operation found in the OpenAPI document, a new operation is created with:
* Azure resource name set to `operationId`.
    * `operationId` value is normalized.
    *  If `operationId` isn't specified (not present, `null`, or empty), Azure resource name value is generated by combining HTTP method and path template.
        * For example, `get-foo`.

* Display name set to `summary`. 
    * `summary` value:
        * Imported as-is.
        * Length is limited to 300 characters.
    * If `summary` isn't specified (not present, `null`, or empty), display name value will set to `operationId`. 

**Normalization rules for `operationId`**
- Convert to lower case.
- Replace each sequence of non-alphanumeric characters with a single dash.
    - For example, `GET-/foo/{bar}?buzz={quix}` is transformed into `get-foo-bar-buzz-quix-`.
- Trim dashes on both sides.
    - For example, `get-foo-bar-buzz-quix-` becomes `get-foo-bar-buzz-quix`
- Truncate to fit 76 characters, four characters less than maximum limit for a resource name.
- Use remaining four characters for a de-duplication suffix, if necessary, in the form of `-1, -2, ..., -999`.

### Update an existing API via OpenAPI import

During import, the existing API operation:
* Changes to match the API described in the OpenAPI document. 
* Matches to an operation in the OpenAPI document by comparing its `operationId` value to the existing operation's Azure resource name. 
    * If a match is found, existing operation’s properties are updated "in-place".
    * If a match isn't found:
        * A new operation is created by combining HTTP method and path template, for example, `get-foo`. 
        * For each new operation, the import will attempt to copy policies from an existing operation with the same HTTP method and path template.

All existing unmatched operations are deleted.

To make import more predictable, follow these guidelines:

- Specify `operationId` property for every operation.
- Refrain from changing `operationId` after initial import.
- Never change `operationId` and HTTP method or path template at the same time.

**Normalization rules for `operationId`**
- Convert to lower case.
- Replace each sequence of non-alphanumeric characters with a single dash.
    - For example, `GET-/foo/{bar}?buzz={quix}` is transformed into `get-foo-bar-buzz-quix-`.
- Trim dashes on both sides.
    - For example, `get-foo-bar-buzz-quix-` becomes `get-foo-bar-buzz-quix`
- Truncate to fit 76 characters, four characters less than maximum limit for a resource name.
- Use remaining four characters for a de-duplication suffix, if necessary, in the form of `-1, -2, ..., -999`.

### Export API as OpenAPI

For each operation, it's:
* Azure resource name is exported as an `operationId`.
* Display name is exported as a `summary`.

Note that normalization of the `operationId` is done on import, not on export.

## <a name="wsdl"> </a>WSDL

You can create [SOAP pass-through](import-soap-api.md) and [SOAP-to-REST](restify-soap-api.md) APIs with WSDL files.

### SOAP bindings 
- Only SOAP bindings of "document" and “literal” encoding style are supported.
- No support for “rpc” style or SOAP-Encoding.

### Imports and includes
* The `wsdl:import`, `xsd:import`, and `xsd:include` directives aren't supported. Instead, merge the dependencies into one document. 

* For an open-source tool to resolve and merge `wsdl:import`, `xsd:import`, and `xsd:include` dependencies in a WSDL file, see this [GitHub repo](https://github.com/Azure-Samples/api-management-schema-import).

### WS-* specifications

WSDL files incorporating WS-* specifications aren't supported.

### Messages with multiple parts 
This message type is not supported.

### WCF wsHttpBinding 
- SOAP services created with Windows Communication Foundation should use `basicHttpBinding`.
- `wsHttpBinding` isn't supported.

### MTOM 
- Services using `MTOM` *may* work. 
- Official support isn't offered at this time.

### Recursion
- Types defined recursively aren't supported by API Management.
- For example, refer to an array of themselves.

### Multiple Namespaces
While multiple namespaces can be used in a schema, only the target namespace can be used to define message parts. These namespaces are used to define other input or output elements.

Namespaces other than the target aren't preserved on export. While you can import a WSDL document defining message parts with other namespaces, all message parts will have the WSDL target namespace on export.

### Arrays 
SOAP-to-REST transformation supports only wrapped arrays shown in the example below:

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
