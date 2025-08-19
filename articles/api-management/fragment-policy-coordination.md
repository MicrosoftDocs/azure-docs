---
title: Policy injection and coordination with fragments
titleSuffix: Azure API Management
description: Fragment injection patterns and coordination between Product and API policies.
services: api-management
author: nicolela

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 08/19/2025
ms.author: nicolela 
---

# Policy injection and coordination with fragments

**Applies to:** All Azure API Management tiers

Policy injection and coordination enable sophisticated pipelines through strategic placement of policy fragments at different scopes. Policy injection is the mechanism by which central policies at Product and API levels include policy fragments using the [include-fragment](include-fragment-policy.md) policy.

This injection mechanism allows fragments to be shared between [Product and API policies](api-management-howto-policies#scopes). Effective coordination ensures that Product and API policies work together seamlessly, with each handling appropriate responsibilities without duplication.

## Policy injection

### Central policies inject policy fragments

Product and API policy definitions serve as orchestrators that inject fragments in a specific order to create the complete processing pipeline. The following example shows fragments injected by a policy definition:

```xml
<policies>
  <inbound>
    <include-fragment fragment-id="Security-Context" />
    <include-fragment fragment-id="Rate-Limiting" />
    <include-fragment fragment-id="Request-Logging" />
    <base />
  </inbound>
  <backend>
    <include-fragment fragment-id="Backend-Selection" />
    <base />
  </backend>
  <outbound>
    <include-fragment fragment-id="Circuit-Breaker" />
    <base />
  </outbound>
  <on-error>
    <include-fragment fragment-id="Error-Response" />
  </on-error>
</policies>
```

**Injection concepts:**

- **Sequential Order**: Fragments execute in the order they are included, with data dependencies between fragments defined by context variables.
- **Phase Placement**: Fragments are injected into appropriate policy phases (inbound, backend, outbound, on-error) based on their functionality.
- **Dependency Management**: Later fragments can rely on context variables set by earlier fragments in the sequence.

### Fragment sharing between product and API policies

When the same logic needs to be applied across Product and API policy scopes, policy fragments eliminate duplication through sharing.

In this example, the `Circuit-Breaker` fragment is shared between both policies, eliminating duplication of custom timeout handling and error conversion logic:

```xml
<!-- Product Policy -->
<policies>
  <inbound>
    <include-fragment fragment-id="Security-Context" />
    <include-fragment fragment-id="Rate-Limiting" />
    <base />
  </inbound>
  <backend>
    <include-fragment fragment-id="Backend-Selection" />
    <base />
  </backend>
  <outbound>
    <include-fragment fragment-id="Circuit-Breaker" />
    <base />
  </outbound>
</policies>
```

```xml
<!-- API Policy -->
<policies>
  <inbound>
    <include-fragment fragment-id="Request-Logging" />
    <base />
  </inbound>
  <outbound>
    <include-fragment fragment-id="Circuit-Breaker" />
    <base />
  </outbound>
</policies>
```

**Policy coordination concepts:**

Policy coordination ensures that Product and API policies work together effectively by dividing responsibilities appropriately:

- **Product Policy**: Injects fragments that perform product-specific behavior that varies across products.
- **API Policy**: Contains fragments that remain consistent across all products.

This division maintains clear boundaries while maximizing the benefits of fragment sharing.

## Best practices

### Document fragment dependencies

Establish clear dependency relationships by documenting them explicitly in each fragment, with intuitive variable names:

```xml
<fragment fragment-id="Rate-Limiting">
  <!-- Dependencies: Security-Context, Config-Cache -->
  <!-- Requires: subscription-key, target-service, api-type variables -->
  
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
</fragment>
```

### Use conditional fragment inclusion

Implement conditional logic within main policies to dynamically include fragments based on request characteristics, configuration settings, or runtime context. This pattern enables flexible processing pipelines that adapt to different scenarios:

```xml
<!-- Product Policy -->
<policies>
  <inbound>
    <include-fragment fragment-id="Config-Cache" />
    <include-fragment fragment-id="Request-Analysis" />
    
    <!-- Conditional authentication with custom logic based on request type -->
    <choose>
      <when condition="@(context.Request.Headers.GetValueOrDefault("Authorization", "").StartsWith("Bearer"))">
        <include-fragment fragment-id="Security-JWT" />
      </when>
      <otherwise>
        <include-fragment fragment-id="Security-API-Key" />
      </otherwise>
    </choose>
    
    <base />
  </inbound>
</policies>
```

## Testing and debugging

Effective debugging of the fragment pipeline requires a systematic approach to understand execution flow and variable state. APIM provides several debugging mechanisms designed to minimize performance impact while maximizing visibility into request processing.

### Enable debug headers

Use debug headers to capture variable state at a specific point in the pipeline for troubleshooting fragment coordination issues. Debug headers appear in HTTP response headers and are visible to API clients. Instead of adding individual debug headers throughout fragments, create a dedicated header management fragment that consolidates all debug headers in one location. This centralized approach ensures consistency and improves maintainability.

```xml
<!-- Example: Dedicated header fragment -->
<fragment fragment-id="Debug-Headers">
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

**Pipeline Placement:**

Include the header management fragment in the **outbound** section of your product policy, after all processing fragments have completed:

```xml
<policies>
  <outbound>
    <include-fragment fragment-id="Circuit-Breaker" />
    <include-fragment fragment-id="Resource-Tracking" />
    <!-- Headers fragment - placed last to capture final state -->
    <include-fragment fragment-id="Debug-Headers" />
    <base />
  </outbound>
</policies>
```

**Alternative - Inline Debug Headers:**

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

### Track fragment execution

Build execution breadcrumb trails to verify fragment sequencing and identify which fragments execute across Product and API policy boundaries. This technique is crucial for debugging conditional logic and understanding why certain fragments were skipped. Add this code to the beginning of each fragment, replacing "Fragment-Name" with the actual fragment name:

```xml
<set-variable name="execution-trace" value="@{
    var trace = context.Variables.GetValueOrDefault<string>("execution-trace", "");
    return trace + "→Fragment-Name";
}" />
```

To view the breadcrumb trail, use APIM's built-in [trace](https://learn.microsoft.com/en-us/azure/api-management/trace-policy) policy to log the execution flow (see the documentation for information on where to access and view trace output):

```xml
<trace source="Fragment-Execution" severity="information">
    <message>@(context.Variables.GetValueOrDefault<string>("execution-trace", ""))</message>
</trace>
```

## Next steps

- **[Architecture for building advanced execution pipelines with policy fragments](fragment-pipeline-architecture.md)** - Foundational patterns for designing modular, scalable policy fragment architectures with clear separation of concerns.
- **[Variable management for policy fragments](fragment-variable-mgmt.md)** - Comprehensive guidance on context variable handling, safe access patterns, and inter-fragment communication.
- **[Central metadata cache for policy fragments](fragment-metadata-cache.md)** - Implementation guidance for shared metadata caching patterns across fragments.
