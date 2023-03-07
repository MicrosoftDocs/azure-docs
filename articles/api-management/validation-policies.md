---
title: Azure API Management validation policies | Microsoft Docs
description: Reference for Azure API Management policies to validate API requests and responses. Provides policy usage, settings, and examples.
services: api-management
documentationcenter: ''
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 09/09/2022
ms.author: danlep
---

# API Management policies to validate requests and responses

This article provides a reference for API Management policies to validate REST or SOAP API requests and responses against schemas defined in the API definition or supplementary JSON or XML schemas. Validation policies protect from vulnerabilities such as injection of headers or payload or leaking sensitive data. Learn more about common [API vulnerabilites](mitigate-owasp-api-threats.md).

While not a replacement for a Web Application Firewall, validation policies provide flexibility to respond to an additional class of threats that aren’t covered by security products that rely on static, predefined rules. 

[!INCLUDE [api-management-policy-intro-links](../../includes/api-management-policy-intro-links.md)]

## Validation policies

- [Validate content](#validate-content) - Validates the size or content of a request or response body against one or more API schemas. The supported schema formats are JSON and XML.
- [Validate parameters](#validate-parameters) - Validates the request header, query, or path parameters against the API schema.
- [Validate headers](#validate-headers) - Validates the response headers against the API schema.
- [Validate status code](#validate-status-code) - Validates the HTTP status codes in responses against the API schema.

> [!NOTE]
> The maximum size of the API schema that can be used by a validation policy is 4 MB. If the schema exceeds this limit, validation policies will return errors on runtime. To increase it, please contact [support](https://azure.microsoft.com/support/options/). 

## Actions

Each validation policy includes an attribute that specifies an action, which API Management takes when validating an entity in an API request or response against the API schema. 

* An action may be specified for elements that are represented in the API schema and, depending on the policy, for elements that aren't represented in the API schema. 

* An action specified in a policy's child element overrides an action specified for its parent.

Available actions:

| Action         | Description          |                                                                                                                         
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `ignore` | Skip validation. |
| `prevent` | Block the request or response processing, log the verbose [validation error](#validation-errors), and return an error. Processing is interrupted when the first set of errors is detected. 
| `detect` | Log [validation errors](#validation-errors), without interrupting request or response processing. |

## Logs

Details about the validation errors during policy execution are logged to the variable in `context.Variables` specified in the `errors-variable-name` attribute in the policy's root element. When configured in a `prevent` action, a validation error blocks further request or response processing and is also propagated to the `context.LastError` property. 

To investigate errors, use a [trace](api-management-advanced-policies.md#Trace) policy to log the errors from context variables to [Application Insights](api-management-howto-app-insights.md).

## Performance implications

Adding validation policies may affect API throughput. The following general principles apply:
* The larger the API schema size, the lower the throughput will be. 
* The larger the payload in a request or response, the lower the throughput will be. 
* The size of the API schema has a larger impact on performance than the size of the payload. 
* Validation against an API schema that is several megabytes in size may cause request or response timeouts under some conditions. The effect is more pronounced in the  **Consumption** and **Developer** tiers of the service. 

We recommend performing load tests with your expected production workloads to assess the impact of validation policies on API throughput.

## Validate content

The `validate-content` policy validates the size or content of a request or response body against one or more [supported schemas](#schemas-for-content-validation).

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

The following table shows the schema formats and request or response content types that the policy supports. Content type values are case insensitive. 

| Format  | Content types | 
|---------|---------|
|JSON     |  Examples: `application/json`<br/>`application/hal+json` | 
|XML     |  Example: `application/xml`  | 
|SOAP     |  Allowed values: `application/soap+xml` for SOAP 1.2 APIs<br/>`text/xml` for SOAP 1.1 APIs|

### What content is validated

The policy validates the following content in the request or response against the schema:

* Presence of all required properties. 
* Presence or absence of additional properties, if the schema has the `additionalProperties` field set. May be overriden with the `allow-additional-properties` attribute.
* Types of all properties. For example, if a schema specifies a property as an integer, the request (or response) must include an integer and not another type, such as a string.
* The format of the properties, if specified in the schema - for example, regex (if the `pattern` keyword is specified), `minimum` for integers, and so on.

> [!TIP]
> For examples of regex pattern constraints that can be used in schemas, see [OWASP Validation Regex Repository](https://owasp.org/www-community/OWASP_Validation_Regex_Repository).

### Policy statement

```xml
<validate-content unspecified-content-type-action="ignore|prevent|detect" max-size="size in bytes" size-exceeded-action="ignore|prevent|detect" errors-variable-name="variable name">
    <content-type-map any-content-type-value="content type string" missing-content-type-value="content type string">
        <type from|when="content type string" to="content type string" />
    </content-type-map>
    <content type="content type string" validate-as="json|xml|soap" schema-id="schema id" schema-ref="#/local/reference/path" action="ignore|prevent|detect" allow-additional-properties="true|false" />
</validate-content>
```

### Examples

#### JSON schema validation

In the following example, API Management interprets requests with an empty content type header or requests with a content type header `application/hal+json` as requests with the content type `application/json`. Then, API Management performs the validation in the detection mode against a schema defined for the `application/json` content type in the API definition. Messages with payloads larger than 100 KB are blocked. Requests containing additional properties are blocked, even if the schema's `additionalProperties` field is configured to allow additional properties.

```xml
<validate-content unspecified-content-type-action="prevent" max-size="102400" size-exceeded-action="prevent" errors-variable-name="requestBodyValidation">
    <content-type-map missing-content-type-value="application/json">
        <type from="application/hal+json" to="application/json" />
    </content-type-map>
    <content type="application/json" validate-as="json" action="detect" allow-additional-properties="false" />
</validate-content>
```

#### SOAP schema validation

In the following example, API Management interprets any request as a request with the content type `application/soap+xml` (the content type that's used by SOAP 1.2 APIs), regardless of the incoming content type. The request could arrive with an empty content type header, content type header of `text/xml` (used by SOAP 1.1 APIs), or another content type header. Then, API Management extracts the XML payload from the SOAP envelope and performs the validation in prevention mode against the schema named "myschema". Messages with payloads larger than 100 KB are blocked. 

```xml
<validate-content unspecified-content-type-action="prevent" max-size="102400" size-exceeded-action="prevent" errors-variable-name="requestBodyValidation">
    <content-type-map any-content-type-value="application/soap+xml" />
    <content type="application/soap+xml" validate-as="soap" schema-id="myschema" action="prevent" /> 
</validate-content>
```

### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `validate-content` | Root element.                                                                                                                               | Yes      |
| `content-type-map` |  Add this element to map the content type of the incoming request or response to another content type that is used to trigger validation. | No |
| `content` | Add one or more of these elements to validate the content type in the request or response, or the mapped content type, and perform the specified action.  | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| unspecified-content-type-action | [Action](#actions) to perform for requests or responses with a content type that isn’t specified in the API schema. |  Yes     | N/A   |
| max-size | Maximum length of the body of the request or response in bytes, checked against the `Content-Length` header. If the request body or response body is compressed, this value is the decompressed length. Maximum allowed value: 102,400 bytes (100 KB). (Contact [support](https://azure.microsoft.com/support/options/) if you need to increase this limit.) | Yes       | N/A   |
| size-exceeded-action | [Action](#actions) to perform for requests or responses whose body exceeds the size specified in `max-size`. |  Yes     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to.  |   No    | N/A   |
| any-content-type-value | Content type used for validation of the body of a request or response, regardless of the incoming content type.  |   No    | N/A   |
| missing-content-type-value | Content type used for validation of the body of a request or response, when the incoming content type is missing or empty.  |   No    | N/A   |
| content-type-map \ type | Add one or more of these elements to map an incoming content type to a content type used for validation of the body of a request or response. Use `from` to specify a known incoming content type, or use `when` with a policy expression to specify any incoming content type that matches a condition. Overrides the mapping in `any-content-type-value` and `missing-content-type-value`, if specified. | No | N/A |   
| content \ type | Content type to execute body validation for, checked against the content type header or the value mapped in `content-type-mapping`, if specified. If empty, it applies to every content type specified in the API schema.<br/><br/>To validate SOAP requests and responses (`validate-as` attribute set to "soap"), set `type` to `application/soap+xml` for SOAP 1.2 APIs or `text/xml` for SOAP 1.1 APIs. |   No    |  N/A  |
| validate-as | Validation engine to use for validation of the body of a request or response with a matching `type`. Supported values: "json", "xml", "soap".<br/><br/>When "soap" is specified, the XML from the request or response is extracted from the SOAP envelope and validated against an XML schema.  |  Yes     |  N/A  |
| schema-id | Name of an existing schema that was [added](#schemas-for-content-validation) to the API Management instance for content validation. If not specified, the default schema from the API definition is used. | No | N/A |
| schema-ref| For a JSON schema specified in `schema-id`, optional reference to a valid local reference path in the JSON document. Example: `#/components/schemas/address`. The attribute should return a JSON object that API Management handles as a valid JSON schema.<br/><br/> For an XML schema, `schema-ref` isn't supported, and any top-level schema element can be used as the root of the XML request or response payload. The validation checks that all elements starting from the XML request or response payload root adhere to the provided XML schema. | No | N/A |
| action | [Action](#actions) to perform for requests or responses whose body doesn't match the specified content type.  |  Yes      | N/A   |
| allow-additional-properties |  Boolean. For a JSON schema, specifies whether to implement a runtime override of the `additionalProperties` value configured in the schema: <br> - `true`: allow additional properties in the request or response body, even if the JSON schema's `additionalProperties` field is configured to not allow additional properties. <br> - `false`: do not allow additional properties in the request or response body, even if the JSON schema's `additionalProperties` field is configured to allow additional properties.<br/><br/>If the attribute isn't specified, the policy validates additional properties according to configuration of the `additionalProperties` field in the schema. | No |   N/A  |

### Schemas for content validation

By default, validation of request or response content uses JSON or XML schemas from the API definition. These schemas can be specified manually or generated automatically when importing an API from an OpenAPI or WSDL specification into API Management.

Using the `validate-content` policy, you may optionally validate against one or more JSON or XML schemas that you’ve added to your API Management instance and that aren't part of the API definition. A schema that you add to API Management can be reused across many APIs.

To add a schema to your API Management instance using the Azure portal:

1. In the [portal](https://portal.azure.com), navigate to your API Management instance.
1. In the **APIs** section of the left-hand menu, select **Schemas** > **+ Add**.
1. In the **Create schema** window, do the following:
    1. Enter a **Name** (Id) for the schema.
    1. In **Schema type**, select **JSON** or **XML**.
    1. Enter a **Description**.
    1. In **Create method**, do one of the following:
        * Select **Create new** and enter or paste the schema. 
        * Select **Import from file** or **Import from URL** and enter a schema location.
            > [!NOTE]
            > To import a schema from URL, the schema needs to be accessible over the internet from the browser.
    1. Select **Save**.


    :::image type="content" source="media/validation-policies/add-schema.png" alt-text="Create schema":::

API Management adds the schema resource at the relative URI `/schemas/<schemaId>`, and the schema appears in the list on the **Schemas** page. Select a schema to view its properties or to edit in a schema editor. 

> [!NOTE]
> A schema may cross-reference another schema that is added to the API Management instance. For example, include an XML schema added to API Management by using an element similar to:<br/><br/>`<xs:include schemaLocation="/schemas/myschema" />`


> [!TIP]
> Open-source tools to resolve WSDL and XSD schema references and to batch-import generated schemas to API Management are available on [GitHub](https://github.com/Azure-Samples/api-management-schema-import).

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound, outbound, on-error

-   **Policy scopes:** all scopes

## Validate parameters

The `validate-parameters` policy validates the header, query, or path parameters in requests against the API schema.

> [!IMPORTANT]
> If you imported an API using a management API version prior to `2021-01-01-preview`, the `validate-parameters` policy might not work. You may need to [reimport your API](/rest/api/apimanagement/current-ga/apis/create-or-update) using management API version `2021-01-01-preview` or later.

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]


### Policy statement

```xml
<validate-parameters specified-parameter-action="ignore|prevent|detect" unspecified-parameter-action="ignore|prevent|detect" errors-variable-name="variable name"> 
    <headers specified-parameter-action="ignore|prevent|detect" unspecified-parameter-action="ignore|prevent|detect">
        <parameter name="parameter name" action="ignore|prevent|detect" />
    </headers>
    <query specified-parameter-action="ignore|prevent|detect" unspecified-parameter-action="ignore|prevent|detect">
        <parameter name="parameter name" action="ignore|prevent|detect" />
    </query>
    <path specified-parameter-action="ignore|prevent|detect">
        <parameter name="parameter name" action="ignore|prevent|detect" />
    </path>
</validate-parameters>
```

### Example

In this example, all query and path parameters are validated in the prevention mode and headers in the detection mode. Validation is overridden for several header parameters:

```xml
<validate-parameters specified-parameter-action="prevent" unspecified-parameter-action="prevent" errors-variable-name="requestParametersValidation"> 
    <headers specified-parameter-action="detect" unspecified-parameter-action="detect">
        <parameter name="Authorization" action="prevent" />
        <parameter name="User-Agent" action="ignore" />
        <parameter name="Host" action="ignore" />
        <parameter name="Referrer" action="ignore" />
    </headers>   
</validate-parameters>
```

### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `validate-parameters` | Root element. Specifies default validation actions for all parameters in requests.                                                                                                                              | Yes      |
| `headers` | Add this element to override default validation actions for header parameters in requests.   | No |
| `query` | Add this element to override default validation actions for query parameters in requests.  | No |
| `path` | Add this element to override default validation actions for URL path parameters in requests.  | No |
| `parameter` | Add one or more elements for named parameters to override higher-level configuration of the validation actions. | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `specified-parameter-action` | [Action](#actions) to perform for request parameters specified in the API schema. <br/><br/> When provided in a `headers`, `query`, or `path` element, the value overrides the value of `specified-parameter-action` in the `validate-parameters` element.  |  Yes     | N/A   |
| `unspecified-parameter-action` | [Action](#actions) to perform for request parameters that aren’t specified in the API schema. <br/><br/>When provided in a `headers`or `query` element, the value overrides the value of `unspecified-parameter-action` in the `validate-parameters` element. |  Yes     | N/A   |
| `errors-variable-name` | Name of the variable in `context.Variables` to log validation errors to.  |   No    | N/A   |
| `name` | Name of the parameter to override validation action for. This value is case insensitive.  | Yes | N/A |
| `action` | [Action](#actions) to perform for the parameter with the matching name. If the parameter is specified in the API schema, this value overrides the higher-level `specified-parameter-action` configuration. If the parameter isn’t specified in the API schema, this value overrides the higher-level `unspecified-parameter-action` configuration.| Yes | N/A | 

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound

-   **Policy scopes:** all scopes

## Validate headers

The `validate-headers` policy validates the response headers against the API schema.

> [!IMPORTANT]
> If you imported an API using a management API version prior to `2021-01-01-preview`, the `validate-headers` policy might not work. You may need to reimport your API using management API version `2021-01-01-preview` or later.

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]


### Policy statement

```xml
<validate-headers specified-header-action="ignore|prevent|detect" unspecified-header-action="ignore|prevent|detect" errors-variable-name="variable name">
    <header name="header name" action="ignore|prevent|detect" />
</validate-headers>
```

### Example

```xml
<validate-headers specified-header-action="ignore" unspecified-header-action="prevent" errors-variable-name="responseHeadersValidation" />
```
### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `validate-headers` | Root element. Specifies default validation actions for all headers in responses.                                                                                                                              | Yes      |
| `header` | Add one or more elements for named headers to override the default validation actions for headers in responses. | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `specified-header-action` | [Action](#actions) to perform for response headers specified in the API schema.  |  Yes     | N/A   |
| `unspecified-header-action` | [Action](#actions) to perform for response headers that aren’t specified in the API schema.  |  Yes     | N/A   |
| `errors-variable-name` | Name of the variable in `context.Variables` to log validation errors to.  |   No    | N/A   |
| `name` | Name of the header to override validation action for. This value is case insensitive. | Yes | N/A |
| `action` | [Action](#actions) to perform for header with the matching name. If the header is specified in the API schema, this value overrides value of `specified-header-action` in the `validate-headers` element. Otherwise, it overrides value of `unspecified-header-action` in the validate-headers element. | Yes | N/A | 

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** outbound, on-error

-   **Policy scopes:** all scopes

## Validate status code

The `validate-status-code` policy validates the HTTP status codes in responses against the API schema. This policy may be used to prevent leakage of backend errors, which can contain stack traces.

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)] 

### Policy statement

```xml
<validate-status-code unspecified-status-code-action="ignore|prevent|detect" errors-variable-name="variable name">
    <status-code code="HTTP status code number" action="ignore|prevent|detect" />
</validate-status-code>
```

### Example

```xml
<validate-status-code unspecified-status-code-action="prevent" errors-variable-name="responseStatusCodeValidation" />
```

### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `validate-status-code` | Root element.                                                                                                | Yes      |
| `status-code` | Add one or more elements for HTTP status codes to override the default validation action for status codes in responses. | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `unspecified-status-code-action` | [Action](#actions) to perform for HTTP status codes in responses that aren’t specified in the API schema.  |  Yes     | N/A   |
| `errors-variable-name` | Name of the variable in `context.Variables` to log validation errors to.  |   No    | N/A   |
| `code` | HTTP status code to override validation action for. | Yes | N/A |
| `action` | [Action](#actions) to perform for the matching status code, which isn’t specified in the API schema. If the status code is specified in the API schema, this override doesn’t take effect. | Yes | N/A | 

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** outbound, on-error

-   **Policy scopes:** all scopes


## Validation errors

API Management generates validation errors in the following format:

```
{
 "Name": string,
 "Type": string,
 "ValidationRule": string,
 "Details": string,
 "Action": string
}

```

The following table lists all possible errors of the validation policies. 

* **Details**: Can be used to investigate errors. Not meant to be shared publicly.
* **Public response**: Error returned to the client. Does not leak implementation details.

When a validation policy specifies the `prevent` action and produces an error, the response from API management includes an HTTP status code: 400 when the policy is applied in the inbound section, and 502 when the policy is applied in the outbound section.


| **Name**   | **Type**                                                        | **Validation rule** | **Details**                                                                                                                                       | **Public response**                                                                                                                       | **Action**           |
|----|----|---|---|---|----|
| **validate-content** |                                                                 |                     |                                                                                                                                                   |                                                                                                                                           |                      |
| |RequestBody                                                     | SizeLimit           | Request's body is {size} bytes long and it exceeds the configured limit of {maxSize} bytes.                                                       | Request's body is {size} bytes long and it exceeds the limit of {maxSize} bytes.                                                          | detect / prevent |
||ResponseBody                                                    | SizeLimit           | Response's body is {size} bytes long and it exceeds the configured limit of {maxSize} bytes.                                                      | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| {messageContentType}                 | RequestBody                                                     | Unspecified         | Unspecified content type {messageContentType} is not allowed.                                                                                     | Unspecified content type {messageContentType} is not allowed.                                                                             | detect / prevent |
| {messageContentType}                 | ResponseBody                                                    | Unspecified         | Unspecified content type {messageContentType} is not allowed.                                                                                     | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| | ApiSchema                                                       |                     | API's schema does not exist or it could not be resolved.                                                                                          | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
|                                      | ApiSchema                                                       |                     | API's schema does not specify definitions.                                                                                                        | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| {messageContentType}                 | RequestBody / ResponseBody                                      | MissingDefinition   | API's schema does not contain definition {definitionName}, which is associated with the content type {messageContentType}.                        | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| {messageContentType}                 | RequestBody                                                     | IncorrectMessage    | Body of the request does not conform to the definition {definitionName}, which is associated with the content type {messageContentType}.<br/><br/>{valError.Message} Line: {valError.LineNumber}, Position: {valError.LinePosition}                  | Body of the request does not conform to the definition {definitionName}, which is associated with the content type {messageContentType}.<br/><br/>{valError.Message} Line: {valError.LineNumber}, Position: {valError.LinePosition}            | detect / prevent |
| {messageContentType}                 | ResponseBody                                                    | IncorrectMessage    | Body of the response does not conform to the definition {definitionName}, which is associated with the content type {messageContentType}.<br/><br/>{valError.Message} Line: {valError.LineNumber}, Position: {valError.LinePosition}                                       | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
|                                      | RequestBody                                                     | ValidationException | Body of the request cannot be validated for the content type {messageContentType}.<br/><br/>{exception details}                                                                | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
|                                      | ResponseBody                                                    | ValidationException | Body of the response cannot be validated for the content type {messageContentType}.<br/><br/>{exception details}                                                                | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| **validate-parameters / validate-headers** |                                                                 |                     |                                                                                                                                                   |                                                                                                                                           |                      |
| {paramName} / {headerName}           | QueryParameter / PathParameter / RequestHeader                  | Unspecified         | Unspecified {path parameter / query parameter / header} {paramName} is not allowed.                                                               | Unspecified {path parameter / query parameter / header} {paramName} is not allowed.                                                       | detect / prevent |
| {headerName}                         | ResponseHeader                                                  | Unspecified         | Unspecified header {headerName} is not allowed.                                                                                                   | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
|                                      |ApiSchema                                                       |                     | API's schema doesn't exist or it couldn't be resolved.                                                                                            | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
|                                       | ApiSchema                                                       |                     | API schema does not specify definitions.                                                                                                          | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| {paramName}                          | QueryParameter / PathParameter / RequestHeader / ResponseHeader | MissingDefinition   | API's schema does not contain definition {definitionName}, which is associated with the {query parameter / path parameter / header} {paramName}.  | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| {paramName}                          | QueryParameter / PathParameter / RequestHeader                  | IncorrectMessage    | Request cannot contain multiple values for the {query parameter / path parameter / header} {paramName}.                                           | Request cannot contain multiple values for the {query parameter / path parameter / header} {paramName}.                                   | detect / prevent |
| {headerName}                         | ResponseHeader                                                  | IncorrectMessage    | Response cannot contain multiple values for the header {headerName}.                                                                              | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| {paramName}                          | QueryParameter / PathParameter / RequestHeader                  | IncorrectMessage    | Value of the {query parameter / path parameter / header} {paramName} does not conform to the definition.<br/><br/>{valError.Message} Line: {valError.LineNumber}, Position: {valError.LinePosition}                                          | The value of the {query parameter / path parameter / header} {paramName} does not conform to the definition.<br/><br/>{valError.Message} Line: {valError.LineNumber}, Position: {valError.LinePosition}                              | detect / prevent |
| {headerName}                         | ResponseHeader                                                  | IncorrectMessage    | Value of the header {headerName} does not conform to the definition.<br/><br/>{valError.Message} Line: {valError.LineNumber}, Position: {valError.LinePosition}                                                                              | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| {paramName}                          | QueryParameter / PathParameter / RequestHeader                  | IncorrectMessage    | Value of the {query parameter / path parameter / header} {paramName} cannot be parsed according to the definition. <br/><br/>{ex.Message}                                | Value of the {query parameter / path parameter / header} {paramName} couldn't be parsed according to the definition. <br/><br/>{ex.Message}                      | detect / prevent |
| {headerName}                         | ResponseHeader                                                  | IncorrectMessage    | Value of the header {headerName} couldn't be parsed according to the definition.                                                                  | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| {paramName}                          | QueryParameter / PathParameter / RequestHeader                  | ValidationError     | {Query parameter / Path parameter / Header} {paramName} cannot be validated.<br/><br/>{exception details}                                                                      | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| {headerName}                         | ResponseHeader                                                  | ValidationError     | Header {headerName} cannot be validated.<br/><br/>{exception details}                                                                                                          | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |
| **validate-status-code**             |                                                                 |                     |                                                                                                                                                   |                                                                                                                                           |                      |
| {status-code}                        | StatusCode                                                      | Unspecified         | Response status code {status-code} is not allowed.                                                                                                | The request could not be processed due to an internal error. Contact the API owner.                                                       | detect / prevent |


The following table lists all the possible Reason values of a validation error along with possible Message values:

|  **Reason**         |    **Message** |
|---|---|  
| Bad request       |     {Details} for context variable, {Public response} for client|
| Response not allowed  | {Details} for context variable, {Public response} for client |






[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
