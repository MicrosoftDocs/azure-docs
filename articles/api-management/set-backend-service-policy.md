---
title: Azure API Management policy reference - set-backend-service | Microsoft Docs
description: Reference for the set-backend-service policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/02/2022
ms.author: danlep
---

# Set backend service
Use the `set-backend-service` policy to redirect an incoming request to a different backend than the one specified in the API settings for that operation. This policy changes the backend service base URL of the incoming request to the one specified in the policy.

> [!NOTE]
> Backend entities can be managed via [Azure portal](how-to-configure-service-fabric-backend.md), management [API](/rest/api/apimanagement), and [PowerShell](https://www.powershellgallery.com/packages?q=apimanagement). 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<set-backend-service base-url="base URL of the backend service"  backend-id="name of the backend entity specifying base URL of the backend service" sf-resolve-condition="condition" sf-service-instance-name="Service Fabric service name" sf-listener-name="Service Fabric listener name" />
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
|base-url|New backend service base URL. Policy expressions are allowed.|One of `base-url` or `backend-id` must be present.|N/A|
|backend-id|Identifier (name) of the backend to route primary or secondary replica of a partition. Policy expressions are allowed. |One of `base-url` or `backend-id` must be present.|N/A|
|sf-resolve-condition|Only applicable when the backend is a Service Fabric service. Condition identifying if the call to Service Fabric backend has to be repeated with new resolution. Policy expressions are allowed.|No|N/A|
|sf-service-instance-name|Only applicable when the backend is a Service Fabric service. Allows changing service instances at runtime. Policy expressions are allowed. |No|N/A|
|sf-partition-key|Only applicable when the backend is a Service Fabric service. Specifies the partition key of a Service Fabric service. Policy expressions are allowed. |No|N/A|
|sf-listener-name|Only applicable when the backend is a Service Fabric service and is specified using `backend-id`. Service Fabric Reliable Services allows you to create multiple listeners in a service. This attribute is used to select a specific listener when a backend Reliable Service has more than one listener. If this attribute isn't specified, API Management will attempt to use a listener without a name. A listener without a name is typical for Reliable Services that have only one listener. Policy expressions are allowed.|No|N/A|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, backend
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

Currently, if you define a base `set-backend-service` policy using the `backend-id` attribute and inherit the base policy using `<base />` within the scope, then it can only be overridden with a policy using the `backend-id` attribute, not the `base-url` attribute.

## Examples

### Route request based on value in query string

In this example the `set-backend-service` policy routes requests based on the version value passed in the query string to a different backend service than the one specified in the API.


```xml
<policies>
    <inbound>
        <choose>
            <when condition="@(context.Request.Url.Query.GetValueOrDefault("version") == "2013-05")">
                <set-backend-service base-url="http://contoso.com/api/8.2/" />
            </when>
            <when condition="@(context.Request.Url.Query.GetValueOrDefault("version") == "2014-03")">
                <set-backend-service base-url="http://contoso.com/api/9.1/" />
            </when>
        </choose>
        <base />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```

Initially the backend service base URL is derived from the API settings. So the request URL `https://contoso.azure-api.net/api/partners/15?version=2013-05&subscription-key=abcdef` becomes `http://contoso.com/api/10.4/partners/15?version=2013-05&subscription-key=abcdef` where `http://contoso.com/api/10.4/` is the backend service URL specified in the API settings.

When the [<choose\>](choose-policy.md) policy statement is applied the backend service base URL may change again either to `http://contoso.com/api/8.2` or `http://contoso.com/api/9.1`, depending on the value of the version request query parameter. For example, if the value is `"2013-15"` the final request URL becomes `http://contoso.com/api/8.2/partners/15?version=2013-05&subscription-key=abcdef`.

If further transformation of the request is desired, other [Transformation policies](api-management-transformation-policies.md) can be used. For example, to remove the version query parameter now that the request is being routed to a version specific backend, the [Set query string parameter](set-query-parameter-policy.md) policy can be used to remove the now redundant version attribute.

### Route requests to a service fabric backend

In this example the policy routes the request to a service fabric backend, using the userId query string as the partition key and using the primary replica of the partition.

```xml
<policies>
    <inbound>
        <set-backend-service backend-id="my-sf-service" sf-partition-key="@(context.Request.Url.Query.GetValueOrDefault("userId","")" sf-replica-type="primary" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```



## Related policies

* [API Management transformation policies](api-management-transformation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
