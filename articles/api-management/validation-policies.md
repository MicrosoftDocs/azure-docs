---
title: Azure API Management access validation policies | Microsoft Docs
description: Learn about policies you can use in Azure API Management to validate requests and responses.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 02/16/2021
ms.author: apimpm
---

# API Management validation policies

This topic provides a reference for the following API Management policies. For information on adding and configuring policies, see [Policies in API Management](./api-management-policies.md).

## Validation policies

- [Validate content](#validate-content) - ...
- [Validate parameters](#validate-parameters) - ...
- [Validate headers](#validate-headers) - ...
- [Validate status code](#validate-status-code) - ...
- 
## Validate content

### Policy statement

```xml
<validate-content unspecified-content-type-action=["ignore | prevent | detect"] max-size="size in bytes" size-exceeded-action=["ignore | prevent | detect"] errors-variable-name="name">
    <content type="[string, for example: application/json, application/hal+json" validate-as="json" action=["ignore | prevent | detect"] />
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
| errors-variable-name | Name of the variable in context.Variables to log validation errors to.  |   Yes    | N/A   |
| type | Content type to execute body validation for, checked against the Content-Type header. This value is case insensitive. |   Yes    |  N/A  |
| validate-as | Validation engine to use for validation of the body of a request or response with a matching content type. Currently, the only supported value is “json”.   |  Yes     |  N/A  |
| action | [Action](#actions) to perform for requests or responses whose body doesn't match the specified content type.  |  Yes      | N/A   |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound, outbound

-   **Policy scopes:** all scopes

## Validate parameters

### Policy statement

```xml
<validate-parameters specified-parameter-action"ignore | prevent | detect" unspecified-parameter-action="ignore | prevent | detect" errors-variable-name="name"> 
    <headers specified-parameter-action="ignore | prevent | detect" unspecified-parameter-action="ignore | prevent | detect">
        <parameter name="parameter name" action="ignore | prevent | detect" />
    </headers>
    <query specified-parameter-action="ignore | prevent | detect" unspecified-parameter-action="ignore | prevent | detect">
        <parameter name="parameter name" action="ignore | prevent | detect" />
    </query>
    <path specified-parameter-action="ignore | prevent | detect">
        <parameter name="parameter name" action="ignore | prevent | detect" />
    </path>
</validate-parameters>
```

### Example

In this example, all query and path parameters are validated in the prevention mode and headers in the detection mode. Validation is overriden for several headers:

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
| validate-parameters | Root element.                                                                                                                               | Yes      |
| headers | Add this element to validate header parameters in requests .  | No |
| query | Add this element to validate query parameters in requests.  | No |
| path | Add this element to validate path parameters in requests  | No |
| parameter | Add one or more of these elements to override the configuration of the higher level parameter type.| No |


## Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| specified-parameter-action | [Action](#actions) to perform for request parameters specified in the API schema. |  Yes     | N/A   |
| unspecified-parameter-action | [Action](#actions) to perform for request parameters that are not specified in the API schema.. |  Yes     | N/A   |
| errors-variable-name | Name of the variable in context.Variables to log validation errors to.  |   Yes    | N/A   |


### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound

-   **Policy scopes:** all scopes


## Validate header

### Policy statement

### Example

### Elements

### Attributes

### Usage

## Validate status code

### Policy statement

### Example

### Elements

### Attributes

### Usage


## Next steps

For more information working with policies, see:

-   [Policies in API Management](api-management-howto-policies.md)
-   [Transform APIs](transform-api.md)
-   [Policy Reference](./api-management-policies.md) for a full list of policy statements and their settings
-   [Policy samples](./policy-reference.md)
