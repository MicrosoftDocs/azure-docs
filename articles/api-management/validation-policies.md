---
title: Azure API Management validation policies | Microsoft Docs
description: Learn about policies you can use in Azure API Management to validate requests and responses.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 02/16/2021
ms.author: apimpm
---

# API Management policies to validate requests and responses

This topic provides a reference for the following API Management policies. For information on adding and configuring policies, see [Policies in API Management](./api-management-policies.md).

## Validation policies

- [Validate content](#validate-content) - Validates the size or content type of a request or response body against the API schema. 
- [Validate parameters](#validate-parameters) - Validates the request header, query, or path parameters against the API schema.
- [Validate headers](#validate-headers) - Validates the response header against the API schema.
- [Validate status code](#validate-status-code) - Validates the HTTP status codes in responses against the API schema.
- 
## Validate content

The `validate-content` policy validates the size or content type of a request or response body against the API schema. Currently the policy validates content in JSON format specified in the schema.

### Policy statement

```xml
<validate-content unspecified-content-type-action="ignore|prevent|detect" max-size="size in bytes" size-exceeded-action="ignore|prevent|detect" errors-variable-name="variable name">
    <content type="[string, for example: application/json, application/hal+json" validate-as="json" action="ignore|prevent|detect" />
</validate-content>
```

### Example

In the following example, the JSON payload in requests and responses is validated in detection mode. Requests with payloads larger than 10 MB are blocked. 

```xml
<validate-content unspecified-content-type-action="prevent" max-size="10000000" size-exceeded-action="prevent" errors-variable-name="requestBodyValidation">
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
| max-size | Maximum length of the body of the request or response, checked against the Content-Length header.  | No       | N/A   |
| size-exceeded-action | [Action](#actions) to perform for requests or responses whose body exceeds the specified maximum size. |  No     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to.  |   Yes    | N/A   |
| type | Content type to execute body validation for, checked against the `Content-Type` header. This value is case insensitive. |   Yes    |  N/A  |
| validate-as | Validation engine to use for validation of the body of a request or response with a matching content type. Currently, the only supported value is “json”.   |  Yes     |  N/A  |
| action | [Action](#actions) to perform for requests or responses whose body doesn't match the specified content type.  |  Yes      | N/A   |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound, outbound

-   **Policy scopes:** all scopes

## Validate parameters

The `validate-parameters` policy validates the header, query, or path parameters in requests against the API schema.

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
```

### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| validate-parameters | Root element. Specifies default validation actions for all parameters in requests.                                                                                                                              | Yes      |
| headers | Add one or more of these elements to override default validation actions for header parameters in requests.   | No |
| query | Add this element to override default validation actions for query parameters in requests.  | No |
| path | Add this element to override default validation actions for URL path parameters in requests.  | No |
| parameter | Add one or more elements for named parameters to override higher-level configuration of the validation actions. | No |


### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| specified-parameter-action | [Action](#actions) to perform for request parameters specified in the API schema. <br/><br/> When provided in a `headers`, `query`, or `path` element, the value overrides the value of `specified-parameter-action` in the `validate-parameters` element.  |  Yes     | N/A   |
| unspecified-parameter-action | [Action](#actions) to perform for request parameters that are not specified in the API schema. <br/><br/>When provided in a `headers`, `query`, or `path` element, the value overrides the value of `unspecified-parameter-action` in the `validate-parameters` element. |  Yes     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to.  |   Yes    | N/A   |
| name | Name of the parameter to override validation action for. This value is case insensitive.  | Yes | N/A |
| action | [Action](#actions) to perform for the parameter with the matching name. Overrides higher-level configuration.| Yes | N/A | 

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound

-   **Policy scopes:** all scopes


## Validate headers

The `validate-headers` policy validates the response header against the API schema.

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
| action | [Action](#actions) to perform for header with the matching name. Overrides value of `specified-header-action` in `validate-headers` element. | Yes | N/A | 

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** outbound

-   **Policy scopes:** all scopes

## Validate status code

The `validate-status-code` policy validates the HTTP status codes in responses against the API schema.

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
| action | [Action](#actions) to perform for the matching status code with the matching number.| Yes | N/A | 

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** outbound

-   **Policy scopes:** all scopes

## Actions

Each validation policy includes one or more *actions* that API Management takes when validating an entity in an API request or response against the API schema. Depending on the policy, an action may be specified for elements that don't comply with the API schema, for elements that do comply with the API schema, or for both. An action specified in a policy's child element overrides an action specified for its parent.

Available actions:

| Action         | Description          |                                                                                                                         
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| ignore | Skip validation. |
| prevent | Block the request or response processing and log the validation error. Processing is interrupted when the first set of errors is detected. |
| detect | Log validation errors, without interrupting request or response processing. |

## Logs

Details about the validation errors during policy execution are logged to the property specified in the `errors-variable-name` attribute in the root element of the policy. When configured in a `prevent` action, a validation error blocks further request or response processing and is also propagated to the `context.LastError` property.



Customers may configure logging to [Application Insights](api-management-howto-app-insights.md) or [Event Hub](api-management-howto-log-event-hubs.md). 

## Next steps

For more information working with policies, see:

-   [Policies in API Management](api-management-howto-policies.md)
-   [Transform APIs](transform-api.md)
-   [Policy reference](./api-management-policies.md) for a full list of policy statements and their settings
-   [Policy samples](./policy-reference.md)
-   [Error handling](./api-management-error-handling-policies.md)
