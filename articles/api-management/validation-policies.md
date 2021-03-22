---
title: Azure API Management validation policies | Microsoft Docs
description: Learn about policies you can use in Azure API Management to validate requests and responses.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/12/2021
ms.author: apimpm
---

# API Management policies to validate requests and responses

This article provides a reference for the following API Management policies. For information on adding and configuring policies, see [Policies in API Management](./api-management-policies.md).

Use validation policies to validate API requests and responses against an OpenAPI schema and protect from vulnerabilities such as injection of headers or payload. While not a replacement for a Web Application Firewall, validation policies provide flexibility to respond to an additional class of threats that are not covered by security products that rely on static, predefined rules.

## Validation policies

- [Validate content](#validate-content) - Validates the size or JSON schema of a request or response body against the API schema. 
- [Validate parameters](#validate-parameters) - Validates the request header, query, or path parameters against the API schema.
- [Validate headers](#validate-headers) - Validates the response headers against the API schema.
- [Validate status code](#validate-status-code) - Validates the HTTP status codes in responses against the API schema.

> [!NOTE]
> The maximum size of the API schema that can be used by a validation policy is 4 MB. If the schema exceeds this limit, validation policies will return errors on runtime. To increase it, please contact [support](https://azure.microsoft.com/support/options/). 

## Actions

Each validation policy includes an attribute that specifies an action, which API Management takes when validating an entity in an API request or response against the API schema. An action may be specified for elements that are represented in the API schema and, depending on the policy, for elements that aren't represented in the API schema. An action specified in a policy's child element overrides an action specified for its parent.

Available actions:

| Action         | Description          |                                                                                                                         
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| ignore | Skip validation. |
| prevent | Block the request or response processing, log the verbose validation error, and return an error. Processing is interrupted when the first set of errors is detected. |
| detect | Log validation errors, without interrupting request or response processing. |

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

The `validate-content` policy validates the size or JSON schema of a request or response body against the API schema. Formats other than JSON aren't supported.

### Policy statement

```xml
<validate-content unspecified-content-type-action="ignore|prevent|detect" max-size="size in bytes" size-exceeded-action="ignore|prevent|detect" errors-variable-name="variable name">
    <content type="content type string, for example: application/json, application/hal+json" validate-as="json" action="ignore|prevent|detect" />
</validate-content>
```

### Example

In the following example, the JSON payload in requests and responses is validated in detection mode. Messages with payloads larger than 100 KB are blocked. 

```xml
<validate-content unspecified-content-type-action="prevent" max-size="102400" size-exceeded-action="prevent" errors-variable-name="requestBodyValidation">
    <content type="application/json" validate-as="json" action="detect" />
    <content type="application/hal+json" validate-as="json" action="detect" />
</validate-content>

```

### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| validate-content | Root element.                                                                                                                               | Yes      |
| content | Add one or more of these elements to validate the content type in the request or response, and perform the specified action.  | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| unspecified-content-type-action | [Action](#actions) to perform for requests or responses with a content type that isn’t specified in the API schema. |  Yes     | N/A   |
| max-size | Maximum length of the body of the request or response in bytes, checked against the `Content-Length` header. If the request body or response body is compressed, this value is the decompressed length. Maximum allowed value: 102,400 bytes (100 KB).  | Yes       | N/A   |
| size-exceeded-action | [Action](#actions) to perform for requests or responses whose body exceeds the size specified in `max-size`. |  Yes     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to.  |   Yes    | N/A   |
| type | Content type to execute body validation for, checked against the `Content-Type` header. This value is case insensitive. If empty, it applies to every content type specified in the API schema. |   No    |  N/A  |
| validate-as | Validation engine to use for validation of the body of a request or response with a matching content type. Currently, the only supported value is "json".   |  Yes     |  N/A  |
| action | [Action](#actions) to perform for requests or responses whose body doesn't match the specified content type.  |  Yes      | N/A   |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound, outbound, on-error

-   **Policy scopes:** all scopes

## Validate parameters

The `validate-parameters` policy validates the header, query, or path parameters in requests against the API schema.

> [!IMPORTANT]
> If you imported an API using a management API version prior to `2021-01-01-preview`, the `validate-parameters` policy might not work. You may need to reimport your API using management API version `2021-01-01-preview` or later.


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
</validate-parameters>
```

### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| validate-parameters | Root element. Specifies default validation actions for all parameters in requests.                                                                                                                              | Yes      |
| headers | Add this element to override default validation actions for header parameters in requests.   | No |
| query | Add this element to override default validation actions for query parameters in requests.  | No |
| path | Add this element to override default validation actions for URL path parameters in requests.  | No |
| parameter | Add one or more elements for named parameters to override higher-level configuration of the validation actions. | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| specified-parameter-action | [Action](#actions) to perform for request parameters specified in the API schema. <br/><br/> When provided in a `headers`, `query`, or `path` element, the value overrides the value of `specified-parameter-action` in the `validate-parameters` element.  |  Yes     | N/A   |
| unspecified-parameter-action | [Action](#actions) to perform for request parameters that are not specified in the API schema. <br/><br/>When provided in a `headers`or `query` element, the value overrides the value of `unspecified-parameter-action` in the `validate-parameters` element. |  Yes     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to.  |   Yes    | N/A   |
| name | Name of the parameter to override validation action for. This value is case insensitive.  | Yes | N/A |
| action | [Action](#actions) to perform for the parameter with the matching name. If the parameter is specified in the API schema, this value overrides the higher-level `specified-parameter-action` configuration. If the parameter isn’t specified in the API schema, this value overrides the higher-level `unspecified-parameter-action` configuration.| Yes | N/A | 

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound

-   **Policy scopes:** all scopes

## Validate headers

The `validate-headers` policy validates the response headers against the API schema.

> [!IMPORTANT]
> If you imported an API using a management API version prior to `2021-01-01-preview`, the `validate-headers` policy might not work. You may need to reimport your API using management API version `2021-01-01-preview` or later.

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
| validate-headers | Root element. Specifies default validation actions for all headers in responses.                                                                                                                              | Yes      |
| header | Add one or more elements for named headers to override the default validation actions for headers in responses. | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| specified-header-action | [Action](#actions) to perform for response headers specified in the API schema.  |  Yes     | N/A   |
| unspecified-header-action | [Action](#actions) to perform for response headers that are not specified in the API schema.  |  Yes     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to.  |   Yes    | N/A   |
| name | Name of the header to override validation action for. This value is case insensitive. | Yes | N/A |
| action | [Action](#actions) to perform for header with the matching name. If the header is specified in the API schema, this value overrides value of `specified-header-action` in the `validate-headers` element. Otherwise, it overrides value of `unspecified-header-action` in the validate-headers element. | Yes | N/A | 

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** outbound, on-error

-   **Policy scopes:** all scopes

## Validate status code

The `validate-status-code` policy validates the HTTP status codes in responses against the API schema. This policy may be used to prevent leakage of backend errors, which can contain stack traces. 

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
| validate-status-code | Root element.                                                                                                | Yes      |
| status-code | Add one or more elements for HTTP status codes to override the default validation action for status codes in responses. | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| unspecified-status-code-action | [Action](#actions) to perform for HTTP status codes in responses that are not specified in the API schema.  |  Yes     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to.  |   Yes    | N/A   |
| code | HTTP status code to override validation action for. | Yes | N/A |
| action | [Action](#actions) to perform for the matching status code, which is not specified in the API schema. If the status code is specified in the API schema, this override does not take effect. | Yes | N/A | 

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** outbound, on-error

-   **Policy scopes:** all scopes


## Validation errors
The following table lists all possible errors of the validation policies. 

* **Details** - Can be used to investigate errors. Not meant to be shared publicly.
* **Public response** - Error returned to the client. Does not leak implementation details.

| **Name**                             | **Type**                                                        | **Validation rule** | **Details**                                                                                                                                       | **Public response**                                                                                                                       | **Action**           |
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
| **validate-parameter / validate-headers** |                                                                 |                     |                                                                                                                                                   |                                                                                                                                           |                      |
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






## Next steps

For more information about working with policies, see:

-   [Policies in API Management](api-management-howto-policies.md)
-   [Transform APIs](transform-api.md)
-   [Policy reference](./api-management-policies.md) for a full list of policy statements and their settings
-   [Policy samples](./policy-reference.md)
-   [Error handling](./api-management-error-handling-policies.md)
