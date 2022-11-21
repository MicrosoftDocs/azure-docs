---
title: Azure API Management advanced policies | Microsoft Docs
description: Reference for the advanced policies available for use in Azure API Management. Provides policy usage, settings and examples.
author: dlepow
ms.topic: article
ms.date: 04/28/2022
ms.service: api-management
ms.author: danlep
---

# API Management advanced policies

This article provides a reference for advanced API Management policies, such as those that are based on policy expressions. 

[!INCLUDE [api-management-policy-intro-links](../../includes/api-management-policy-intro-links.md)]

## <a name="AdvancedPolicies"></a> Advanced policies

-   [Control flow](choose-policy.md) - Conditionally applies policy statements based on the results of the evaluation of Boolean [expressions](api-management-policy-expressions.md).
-   [Forward request](forward-request-policy.md) - Forwards the request to the backend service.
-   [Include fragment](include-fragment-policy.md) - Inserts a policy fragment in the policy definition.
-   [Limit concurrency](limit-concurrency-policy.md) - Prevents enclosed policies from executing by more than the specified number of requests at a time.
-   [Log to event hub](log-to-event-hub-policy.md) - Sends messages in the specified format to an event hub defined by a Logger entity.
-   [Emit metrics](emit-metrics-policy.md) - Sends custom metrics to Application Insights at execution.
-   [Mock response](mock-response-policy.md) - Aborts pipeline execution and returns a mocked response directly to the caller.
-   [Retry](retry-policy.md) - Retries execution of the enclosed policy statements, if and until the condition is met. Execution will repeat at the specified time intervals and up to the specified retry count.
-   [Return response](return-response-policy.md) - Aborts pipeline execution and returns the specified response directly to the caller.
-   [Send one way request](send-one-way-request-policy.md) - Sends a request to the specified URL without waiting for a response.
-   [Send request](send-request-policy.md) - Sends a request to the specified URL.
-   [Set HTTP proxy](proxy-policy.md) - Allows you to route forwarded requests via an HTTP proxy.
-   [Set request method](set-method-policy.md) - Allows you to change the HTTP method for a request.
-   [Set status code](set-status-policy.md) - Changes the HTTP status code to the specified value.
-   [set-variable-policy.md](api-management-advanced-policies.md#set-variable) - Persists a value in a named [context](api-management-policy-expressions.md#ContextVariables) variable for later access.
-   [Trace](trace-policy.md) - Adds custom traces into the [request tracing](./api-management-howto-api-inspector.md) output in the test console, Application Insights telemetries, and resource logs.
-   [Wait](wait-policy.md) - Waits for enclosed [Send request](api-management-advanced-policies.md#SendRequest), [Get value from cache](api-management-caching-policies.md#GetFromCacheByKey), or [Control flow](api-management-advanced-policies.md#choose) policies to complete before proceeding.


[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
