---
title: Policy Execution with Fragments
titleSuffix: Azure API Management
description: Fragment execution via product-scoped and API-scoped policies in Azure API Management.
services: api-management
author: nicolela

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 02/10/2026
ms.author: nicolela 
---

# Policy execution with fragments

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Advanced pipeline scenarios with custom behavior throughout the request and response lifecycle are built using policy fragments. Central policies at the product and API levels insert fragments using the [include-fragment](include-fragment-policy.md) policy. Fragments can be shared between [product and API policies](api-management-howto-policies.md#scopes) to avoid duplication while maintaining clear separation of responsibilities.

## Fragment insertion

### Use central policies to insert fragments

Product and API policy definitions serve as orchestrators that insert fragments in a specific order to create the complete request and response pipeline. The following example shows fragments inserted by a policy definition:

```xml
<policies>
  <inbound>
    <include-fragment fragment-id="security-context" />
    <include-fragment fragment-id="rate-limiting" />
    <include-fragment fragment-id="request-logging" />
    <base />
  </inbound>
  <backend>
    <include-fragment fragment-id="backend-selection" />
    <base />
  </backend>
  <outbound>
    <include-fragment fragment-id="circuit-breaker" />
    <base />
  </outbound>
  <on-error>
    <include-fragment fragment-id="error-response" />
  </on-error>
</policies>
```

**Key concepts**

- **Sequential order**: Fragments execute in the order they're included.
- **Phase placement**: Fragments are inserted into appropriate policy phases (inbound, backend, outbound, on-error) based on their functionality.
- **Dependency management**: Later fragments can rely on context variables set by earlier fragments in the sequence.

## Best practices

### Insert fragments based on scope

Ensure that product and API policies work together effectively by dividing fragment responsibilities according to [scope](api-management-howto-policies.md#scopes):

- **Product policy**: Inserts fragments that perform product-specific behavior that varies across products.
- **API policy**: Inserts fragments that apply across all products.

### Reuse fragments to avoid duplication

Eliminate duplication when the same logic is needed across product and API policies by reusing the same fragment. In this example, the `circuit-breaker` fragment is reused:

```xml
<!-- Product Policy -->
<policies>
  <inbound>
    <include-fragment fragment-id="security-context" />
    <include-fragment fragment-id="rate-limiting" />
    <base />
  </inbound>
  <backend>
    <include-fragment fragment-id="backend-selection" />
    <base />
  </backend>
  <outbound>
    <include-fragment fragment-id="circuit-breaker" />
    <base />
  </outbound>
</policies>
```

```xml
<!-- API Policy -->
<policies>
  <inbound>
    <include-fragment fragment-id="request-logging" />
    <base />
  </inbound>
  <outbound>
    <include-fragment fragment-id="circuit-breaker" />
    <base />
  </outbound>
</policies>
```

### Document fragment dependencies and data contracts

Document dependency relationships and data contracts in each fragment to clarify which fragments and variables are required. Use comments to specify:

- **Dependencies**: Other fragments that must execute before this fragment
- **Requires**: Context variables that must exist before this fragment executes
- **Produces**: Context variables that this fragment produces for downstream fragments

```xml
<fragment fragment-id="rate-limiting-fragment">
  <!-- Dependencies: security-context-fragment, config-cache-fragment -->
  <!-- Requires: subscription-key variables -->
  <!-- Produces: rate-limit-applied, rate-limit-remaining variables -->
  
  <!-- Verify dependencies before execution -->
  <choose>
    <when condition="@(!context.Variables.ContainsKey("subscription-key"))">
      <return-response>
        <set-status code="500" reason="Internal Server Error" />
        <set-body>Rate limiting requires security context</set-body>
      </return-response>
    </when>
  </choose>
  
  <!-- Rate limiting logic -->
  <set-variable name="rate-limit-applied" value="@(true)" />
  <set-variable name="rate-limit-remaining" value="@(95)" />
</fragment>
```

### Use conditional fragment inclusion

Implement conditional logic within central policies to dynamically include fragments based on request characteristics, configuration settings, or runtime context. This pattern enables flexible processing pipelines that adapt to different scenarios:

```xml
<!-- Product Policy -->
<policies>
  <inbound>
    <include-fragment fragment-id="config-cache" />
    <include-fragment fragment-id="request-analysis" />
    
    <!-- Conditional authentication with custom logic based on request type -->
    <choose>
      <when condition="@(context.Request.Headers.GetValueOrDefault("Authorization", "").StartsWith("Bearer"))">
        <include-fragment fragment-id="security-jwt" />
      </when>
      <otherwise>
        <include-fragment fragment-id="security-api-key" />
      </otherwise>
    </choose>
    
    <base />
  </inbound>
</policies>
```

### Preserve request body across fragments

When fragments need to read the request body for processing (such as extracting metadata or validation), always use `preserveContent: true` to ensure the request body remains available for downstream fragments and backend forwarding:

```xml
<set-variable name="request-metadata" value="@{
  try {
    // CRITICAL: preserveContent: true ensures body remains available for other fragments and backend
    var body = context.Request.Body.As<string>(preserveContent: true);
    var requestData = JObject.Parse(body);
    
    // Extract metadata without consuming the body
    return new JObject {
      ["user-id"] = requestData["user"]?.ToString() ?? "anonymous"
    };
  } catch {
    return new JObject();
  }
}" />
```

Without `preserveContent: true`, reading the request body consumes it, making it unavailable for subsequent fragments or backend services.

## Testing and debugging

Effective debugging of the fragment pipeline requires a systematic approach to understand execution flow and variable state. This section shows debugging approaches that minimize performance impact while maximizing visibility into request processing.

### Enable debug headers

Use debug headers to capture variable state at a specific point in the pipeline for troubleshooting issues. Debug headers appear in HTTP response headers and are visible to API clients. Instead of adding individual debug headers throughout fragments, create a dedicated header management fragment that consolidates all debug headers in one location. This centralized approach ensures consistency and improves maintainability.

```xml
<!-- Example: Dedicated header fragment -->
<fragment fragment-id="debug-headers">
  <!-- Debug headers for troubleshooting -->
  <set-header name="X-Debug-Request-Type" exists-action="override">
    <value>@(context.Variables.GetValueOrDefault<string>("request-type", "unknown"))</value>
  </set-header>
  <set-header name="X-Debug-Selected-Backend" exists-action="override">
    <value>@(context.Variables.GetValueOrDefault<string>("selected-backend", "unknown"))</value>
  </set-header>
  <set-header name="X-Debug-Request-ID" exists-action="override">
    <value>@(context.Variables.GetValueOrDefault<string>("request-id", "unknown"))</value>
  </set-header>
</fragment>
```

**Pipeline placement:**

Include the header management fragment in the **outbound** section of your product policy, after all other fragments are done executing:

```xml
<policies>
  <outbound>
    <include-fragment fragment-id="circuit-breaker" />
    <include-fragment fragment-id="resource-tracking" />
    <!-- Headers fragment - placed last to capture final state -->
    <include-fragment fragment-id="debug-headers" />
    <base />
  </outbound>
</policies>
```

**Alternative - inline debug headers:**

For simple scenarios or when testing individual fragments, you can add debug headers directly:

```xml
<set-header name="X-Debug-Variables" exists-action="override">
    <value>@{
        var debug = new JObject();
        debug["request-id"] = context.Variables.GetValueOrDefault<string>("request-id", "not-set");
        debug["request-type"] = context.Variables.GetValueOrDefault<string>("request-type", "not-set");
        debug["selected-backend"] = context.Variables.GetValueOrDefault<string>("selected-backend", "not-set");
        return debug.ToString(Formatting.None);
    }</value>
</set-header>
```

### Trace fragment execution

Build execution breadcrumb trails to verify fragment sequencing and identify which fragments execute across product and API policy boundaries. This technique is crucial for debugging conditional logic and understanding why certain fragments were skipped. Add this code to the beginning of each fragment, replacing "fragment-name" with the actual fragment name:

```xml
<set-variable name="execution-trace" value="@{
    var trace = context.Variables.GetValueOrDefault<string>("execution-trace", "");
    return trace + "→fragment-name";
}" />
```

To view the breadcrumb trail, use the built-in [trace](trace-policy.md) policy to log the execution flow:

```xml
<trace source="Fragment-Execution" severity="information">
    <message>@(context.Variables.GetValueOrDefault<string>("execution-trace", ""))</message>
</trace>
```

### Debug using request tracing

Enable request tracing to capture detailed execution traces through the policy pipeline for troubleshooting unexpected behavior. To enable request tracing, the client must:

1. Authenticate with the API Management management API to obtain an access token
2. Get debug credentials to obtain a debug tracing token
3. Send requests with tracing enabled using the debug token
4. Retrieve the complete trace output showing execution flow and policy details

The trace output includes detailed information about fragment execution order, variable state, and policy processing that can help identify issues in your pipeline. For more information, see [Enable tracing for an API](api-management-howto-api-inspector.md#enable-tracing-for-an-api).

To help troubleshoot pipeline issues, copy the complete trace output and provide it to GitHub Copilot for detailed analysis and recommendations on resolving problems.

## Related content

- **[Architecture for building advanced execution pipelines with policy fragments](fragment-pipeline-architecture.md)** - Foundational patterns for designing modular, scalable policy fragment architectures with clear separation of concerns.
- **[Variable management for policy fragments](fragment-variable-management.md)** - Comprehensive guidance on context variable handling, safe access patterns, and inter-fragment communication.
- **[Central metadata cache for policy fragments](fragment-metadata-cache.md)** - Implementation guidance for shared metadata caching patterns across fragments.
