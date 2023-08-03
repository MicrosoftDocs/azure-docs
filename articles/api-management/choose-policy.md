---
title: Azure API Management policy reference - choose | Microsoft Docs
description: Reference for the choose policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Control flow

Use the `choose` policy to conditionally apply policy statements based on the results of the evaluation of Boolean [expressions](api-management-policy-expressions.md). Use the policy for control flow similar to an if-then-else or a switch construct in a programming language.


[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<choose>
    <when condition="Boolean expression | Boolean constant">
        <!— one or more policy statements to be applied if the above condition is true  -->
    </when>
    <when condition="Boolean expression | Boolean constant">
        <!— one or more policy statements to be applied if the above condition is true  -->
    </when>
    <otherwise>
        <!— one or more policy statements to be applied if none of the above conditions are true  -->
    </otherwise>
</choose>
```

The `choose` policy must contain at least one `<when/>` element. The `<otherwise/>` element is optional. Conditions in `<when/>` elements are evaluated in order of their appearance within the policy. Policy statement(s) enclosed within the first `<when/>` element with condition attribute equals `true` will be applied. Policies enclosed within the `<otherwise/>` element, if present, will be applied if all of the `<when/>` element condition attributes are `false`.

## Elements

| Element   | Description                                                                                                                                                                                                                                                               | Required |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| when      | One or more elements specifying the `if` or `ifelse` parts of the `choose` policy. If multiple `when` elements are specified, they are evaluated sequentially. Once the `condition` of a when element evaluates to `true`, no further `when` conditions are evaluated. | Yes      |
| otherwise | The policy snippet to be evaluated if none of the `when` conditions evaluate to `true`. | No |

### when attributes

| Attribute                                              | Description                                                                                               | Required |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | -------- |
| condition | The Boolean expression or Boolean constant to be evaluated when the containing `when` policy statement is evaluated. | Yes      |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Examples

### Modify request and response based on user agent

The following example demonstrates a [set-variable](set-variable-policy.md) policy and two control flow policies.

The set variable policy is in the inbound section and creates an `isMobile` Boolean [context](api-management-policy-expressions.md#ContextVariables) variable that is set to true if the `User-Agent` request header contains the text `iPad` or `iPhone`.

The first control flow policy is also in the inbound section, and conditionally applies one of two [Set query string parameter](set-query-parameter-policy.md) policies depending on the value of the `isMobile` context variable.

The second control flow policy is in the outbound section and conditionally applies the [Convert XML to JSON](xml-to-json-policy.md) policy when `isMobile` is set to `true`.

```xml
<policies>
    <inbound>
        <set-variable name="isMobile" value="@(context.Request.Headers.GetValueOrDefault("User-Agent","").Contains("iPad") || context.Request.Headers.GetValueOrDefault("User-Agent","").Contains("iPhone"))" />
        <base />
        <choose>
            <when condition="@(context.Variables.GetValueOrDefault<bool>("isMobile"))">
                <set-query-parameter name="mobile" exists-action="override">
                    <value>true</value>
                </set-query-parameter>
            </when>
            <otherwise>
                <set-query-parameter name="mobile" exists-action="override">
                    <value>false</value>
                </set-query-parameter>
            </otherwise>
        </choose>
    </inbound>
    <outbound>
        <base />
        <choose>
            <when condition="@(context.Variables.GetValueOrDefault<bool>("isMobile"))">
                <xml-to-json kind="direct" apply="always" consider-accept-header="false"/>
            </when>
        </choose>
    </outbound>
</policies>
```

### Modify response based on product name

This example shows how to perform content filtering by removing data elements from the response received from the backend service when using the `Starter` product. The example backend response includes root-level properties similar to the [OpenWeather One Call API](https://openweathermap.org/api/one-call-api).

```xml
<!-- Copy this snippet into the outbound section to remove a number of data elements from the response received from the backend service based on the name of the product -->
<choose>
  <when condition="@(context.Response.StatusCode == 200 && context.Product.Name.Equals("Starter"))">
    <set-body>@{
        var response = context.Response.Body.As<JObject>();
        foreach (var key in new [] {"current", "minutely", "hourly", "daily", "alerts"}) {
          response.Property (key).Remove ();
        }
        return response.ToString();
      }
    </set-body>
  </when>
</choose>
```

## Related policies

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]