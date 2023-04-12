---
title: Azure API Management policy reference - validate-content | Microsoft Docs
description: Reference for the validate-content policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/05/2022
ms.author: danlep
---

# Validate content
The `validate-content` policy validates the size or content of a request or response body against one or more [supported schemas](#schemas-for-content-validation).

The following table shows the schema formats and request or response content types that the policy supports. Content type values are case insensitive. 

| Format  | Content types | 
|---------|---------|
|JSON     |  Examples: `application/json`<br/>`application/hal+json` | 
|XML     |  Example: `application/xml`  | 
|SOAP     |  Allowed values: `application/soap+xml` for SOAP 1.2 APIs<br/>`text/xml` for SOAP 1.1 APIs|

[!INCLUDE [api-management-validation-policy-schema-size-note](../../includes/api-management-validation-policy-schema-size-note.md)]

## What content is validated

The policy validates the following content in the request or response against the schema:

* Presence of all required properties. 
* Presence or absence of additional properties, if the schema has the `additionalProperties` field set. May be overridden with the `allow-additional-properties` attribute.
* Types of all properties. For example, if a schema specifies a property as an integer, the request (or response) must include an integer and not another type, such as a string.
* The format of the properties, if specified in the schema - for example, regex (if the `pattern` keyword is specified), `minimum` for integers, and so on.

> [!TIP]
> For examples of regex pattern constraints that can be used in schemas, see [OWASP Validation Regex Repository](https://owasp.org/www-community/OWASP_Validation_Regex_Repository).

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<validate-content unspecified-content-type-action="ignore | prevent | detect" max-size="size in bytes" size-exceeded-action="ignore | prevent | detect" errors-variable-name="variable name">
    <content-type-map any-content-type-value="content type string" missing-content-type-value="content type string">
        <type from | when="content type string" to="content type string" />
    </content-type-map>
    <content type="content type string" validate-as="json | xml | soap" schema-id="schema id" schema-ref="#/local/reference/path" action="ignore | prevent | detect" allow-additional-properties="true | false" />
</validate-content>
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| unspecified-content-type-action | [Action](#actions) to perform for requests or responses with a content type that isn’t specified in the API schema. Policy expressions are allowed. |  Yes     | N/A   |
| max-size | Maximum length of the body of the request or response in bytes, checked against the `Content-Length` header. If the request body or response body is compressed, this value is the decompressed length. Maximum allowed value: 102,400 bytes (100 KB). (Contact [support](https://azure.microsoft.com/support/options/) if you need to increase this limit.) Policy expressions are allowed. | Yes       | N/A   |
| size-exceeded-action | [Action](#actions) to perform for requests or responses whose body exceeds the size specified in `max-size`. Policy expressions are allowed.|  Yes     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to. Policy expressions aren't allowed. |   No    | N/A   |

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| content-type-map |  Add this element to map the content type of the incoming request or response to another content type that is used to trigger validation. | No |
| content | Add one or more of these elements to validate the content type in the request or response, or the mapped content type, and perform the specified [action](#actions).  | No |

### content-type-map attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| any-content-type-value | Content type used for validation of the body of a request or response, regardless of the incoming content type. Policy expressions aren't allowed. |   No    | N/A   |
| missing-content-type-value | Content type used for validation of the body of a request or response, when the incoming content type is missing or empty. Policy expressions aren't allowed. |   No    | N/A   |

### content-type-map-elements

|Name|Description|Required|
|----------|-----------------|--------------|
| type | Add one or more of these elements to map an incoming content type to a content type used for validation of the body of a request or response. Use `from` to specify a known incoming content type, or use `when` with a policy expression to specify any incoming content type that matches a condition. Overrides the mapping in `any-content-type-value` and `missing-content-type-value`, if specified. | No |


### content attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| type | Content type to execute body validation for, checked against the content type header or the value mapped in `content-type-mapping`, if specified. If empty, it applies to every content type specified in the API schema.<br/><br/>To validate SOAP requests and responses (`validate-as` attribute set to "soap"), set `type` to `application/soap+xml` for SOAP 1.2 APIs or `text/xml` for SOAP 1.1 APIs. |   No    |  N/A  |
| validate-as | Validation engine to use for validation of the body of a request or response with a matching `type`. Supported values: "json", "xml", "soap".<br/><br/>When "soap" is specified, the XML from the request or response is extracted from the SOAP envelope and validated against an XML schema.  |  Yes     |  N/A  |
| schema-id | Name of an existing schema that was [added](#schemas-for-content-validation) to the API Management instance for content validation. If not specified, the default schema from the API definition is used. | No | N/A |
| schema-ref| For a JSON schema specified in `schema-id`, optional reference to a valid local reference path in the JSON document. Example: `#/components/schemas/address`. The attribute should return a JSON object that API Management handles as a valid JSON schema.<br/><br/> For an XML schema, `schema-ref` isn't supported, and any top-level schema element can be used as the root of the XML request or response payload. The validation checks that all elements starting from the XML request or response payload root adhere to the provided XML schema. | No | N/A |
| allow-additional-properties |  Boolean. For a JSON schema, specifies whether to implement a runtime override of the `additionalProperties` value configured in the schema: <br> - `true`: allow additional properties in the request or response body, even if the JSON schema's `additionalProperties` field is configured to not allow additional properties. <br> - `false`: do not allow additional properties in the request or response body, even if the JSON schema's `additionalProperties` field is configured to allow additional properties.<br/><br/>If the attribute isn't specified, the policy validates additional properties according to configuration of the `additionalProperties` field in the schema. | No |   N/A  |

[!INCLUDE [api-management-validation-policy-actions](../../includes/api-management-validation-policy-actions.md)]

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

[!INCLUDE [api-management-validation-policy-common](../../includes/api-management-validation-policy-common.md)]

## Schemas for content validation

By default, validation of request or response content uses JSON or XML schemas from the API definition. These schemas can be specified manually or generated automatically when importing an API from an OpenAPI or WSDL specification into API Management.

Using the `validate-content` policy, you may optionally validate against one or more JSON or XML schemas that you’ve added to your API Management instance and that aren't part of the API definition. A schema that you add to API Management can be reused across many APIs.

To add a schema to your API Management instance using the Azure portal:

1. In the [portal](https://portal.azure.com), navigate to your API Management instance.
1. In the **APIs** section of the left-hand menu, select **Schemas** > **+ Add**.
1. In the **Create schema** window, do the following:
    1. Enter a **Name** (ID) for the schema.
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

## Examples

### JSON schema validation

In the following example, API Management interprets requests with an empty content type header or requests with a content type header `application/hal+json` as requests with the content type `application/json`. Then, API Management performs the validation in the detection mode against a schema defined for the `application/json` content type in the API definition. Messages with payloads larger than 100 KB are blocked. Requests containing additional properties are blocked, even if the schema's `additionalProperties` field is configured to allow additional properties.

```xml
<validate-content unspecified-content-type-action="prevent" max-size="102400" size-exceeded-action="prevent" errors-variable-name="requestBodyValidation">
    <content-type-map missing-content-type-value="application/json">
        <type from="application/hal+json" to="application/json" />
    </content-type-map>
    <content type="application/json" validate-as="json" action="detect" allow-additional-properties="false" />
</validate-content>
```

### SOAP schema validation

In the following example, API Management interprets any request as a request with the content type `application/soap+xml` (the content type that's used by SOAP 1.2 APIs), regardless of the incoming content type. The request could arrive with an empty content type header, content type header of `text/xml` (used by SOAP 1.1 APIs), or another content type header. Then, API Management extracts the XML payload from the SOAP envelope and performs the validation in prevention mode against the schema named "myschema". Messages with payloads larger than 100 KB are blocked. 

```xml
<validate-content unspecified-content-type-action="prevent" max-size="102400" size-exceeded-action="prevent" errors-variable-name="requestBodyValidation">
    <content-type-map any-content-type-value="application/soap+xml" />
    <content type="application/soap+xml" validate-as="soap" schema-id="myschema" action="prevent" /> 
</validate-content>
```

[!INCLUDE [api-management-validation-policy-error-reference](../../includes/api-management-validation-policy-error-reference.md)]

## Related policies

* [API Management validation policies](validation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
