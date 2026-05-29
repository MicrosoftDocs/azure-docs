---
title: Variable Management for Policy Fragments
titleSuffix: Azure API Management
description: Comprehensive guidance on context variable handling, safe access patterns, and data sharing in Azure API Management policy fragments.
services: api-management
author: nicolela

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 02/10/2026
ms.author: nicolela 
---
 
# Variable management for policy fragments

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

[Context variables](api-management-policy-expressions.md#ContextVariables) enable data sharing between policy fragments for advanced pipeline scenarios. Proper variable management is critical for building reliable pipelines with optimal performance. Improper handling can lead to runtime errors, performance issues, and unpredictable behavior.

## Variable fundamentals

Context variables provide thread-safe data sharing between policy fragments and are created using the built-in [set-variable](set-variable-policy.md) policy. Each request maintains its own isolated variable context, ensuring that concurrent requests don't interfere with each other.

### Variable lifecycle management

- **Request scope**: Variables exist only during a single request and are automatically garbage collected when the request completes.

- **Phase persistence**: Variables set in the inbound phase remain available throughout backend, outbound, and error phase within the same request.  

- **Thread isolation**: Strict thread isolation ensures each request runs on its own thread with its own context object, preventing cross-request data interference.

- **Sequential updates**: Any fragment can modify existing variables, with subsequent fragments overwriting previous values. Sequential execution eliminates the need for locking mechanisms.

- **Storage threshold**: The platform optimizes context variable management for small collections, typically 50 variables per request or fewer.

### Set and retrieve variables in fragments

```xml
<!-- Example: Set a request-id context variable that is a required value for other fragments -->
<set-variable name="request-id" value="@{
    var requestId = context.Request.Headers.GetValueOrDefault("X-Request-ID", "");
    if (string.IsNullOrEmpty(requestId)) {
        return Guid.NewGuid().ToString();
    }
    return requestId;
}" />

<!-- Example: Retrieve the same request-id context variable safely in another fragment -->
<set-header name="X-Correlation-ID" value="@{
    return context.Variables.GetValueOrDefault<string>("request-id", "unknown");
}" />
```
## Best practices

### Use safe variable access

Always exercise caution with potential null values, use safe access with `GetValueOrDefault`, and provide meaningful default values for all variable access:

```xml
<!-- Safe access with default value -->
<set-variable name="log-level" value="@{
    return context.Variables.GetValueOrDefault<string>("config-log-level", "INFO");
}" />

<!-- Safe string interpolation using GetValueOrDefault -->
<set-variable name="cache-key" value="@{
    var userId = context.Variables.GetValueOrDefault<string>("auth-user-id", "anon");
    var resource = context.Variables.GetValueOrDefault<string>("request-resource", "default");
    
    return $"cache:{userId}:{resource}";
}" />
```

### Check variable existence

Ensure variables created by prerequisite fragments exist before accessing them. When dependencies are missing, choose from two strategies:

**Strategy 1:** Fail fast (critical dependencies)

Return an error response when critical dependencies are missing:

```xml
<choose>
    <when condition="@(!context.Variables.ContainsKey("user-id"))">
        <!-- Critical dependency missing - fail immediately -->
        <return-response>
            <set-status code="500" reason="Internal Server Error" />
            <set-body>{"error": "Required variable missing", "missing_dependency": "user-id"}</set-body>
        </return-response>
    </when>
    <otherwise>
        <!-- Safe to proceed - use the user-id variable -->
        <set-header name="X-User-ID" exists-action="override">
            <value>@(context.Variables.GetValueOrDefault<string>("user-id", ""))</value>
        </set-header>
    </otherwise>
</choose>
```

**Strategy 2:** Handle gracefully (optional dependencies)

Continue execution with appropriate fallback behavior when optional dependencies are missing:

```xml
<choose>
    <when condition="@(context.Variables.ContainsKey("user-id"))">
        <!-- Optional variable available - use it -->
        <set-header name="X-User-ID" exists-action="override">
            <value>@(context.Variables.GetValueOrDefault<string>("user-id", ""))</value>
        </set-header>
    </when>
    <otherwise>
        <!-- Fallback to default when variable unavailable -->
        <set-header name="X-User-ID" exists-action="override">
            <value>unknown</value>
        </set-header>
    </otherwise>
</choose>
```

### Minimize variable access

Reduce context variable lookups by consolidating multiple accesses into single expressions:

```xml
<!-- Good: Single consolidated access -->
<set-variable name="log-entry" value="@{
    var level = context.Variables.GetValueOrDefault<string>("log-level", "INFO");
    var requestId = context.Variables.GetValueOrDefault<string>("request-id", "unknown");
    return $"[{level}] Request {requestId} completed";
}" />

<!-- Avoid: Multiple separate accesses -->
<set-variable name="level-prefix" value="@("[" + context.Variables.GetValueOrDefault<string>("log-level", "INFO") + "]")" />
<set-variable name="request-suffix" value="@("Request " + context.Variables.GetValueOrDefault<string>("request-id", "unknown") + " completed")" />
<set-variable name="log-entry" value="@(context.Variables.GetValueOrDefault<string>("level-prefix", "") + " " + context.Variables.GetValueOrDefault<string>("request-suffix", ""))" />
```

### Maintain consistent types

Use explicit type handling for optimal performance and reliability. When working with [policy expressions](api-management-policy-expressions.md), specify the expected type with the `@()` operator:

```xml
<!-- Set as boolean, use as boolean -->
<set-variable name="should-log-debug" value="@(true)" />
<choose>
    <when condition="@(context.Variables.GetValueOrDefault<bool>("should-log-debug", false))">
        <!-- Include detailed debug information in logs -->
    </when>
</choose>
```

## Related content

- **[Architecture for building advanced execution pipelines with policy fragments](fragment-pipeline-architecture.md)** - Foundational patterns for designing modular, scalable policy fragment architectures with clear separation of concerns.
- **[Central metadata cache for policy fragments](fragment-metadata-cache.md)** - Implementation guidance for shared metadata caching patterns across fragments.
- **[Policy injection and coordination with fragments](fragment-policy-coordination.md)** - Fragment injection patterns and coordination between product and API policies.