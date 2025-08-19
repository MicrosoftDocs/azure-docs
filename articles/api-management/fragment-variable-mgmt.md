---
title: Variable management for policy fragments
titleSuffix: Azure API Management
description: Comprehensive guidance on context variable handling, safe access patterns, and inter-fragment communication.
services: api-management
author: nicolela

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 08/19/2025
ms.author: nicolela 
---

# Variable management for policy fragments

**Applies to:** All Azure API Management tiers

[Context variables](api-management-policy-expressions#ContextVariables) enable sequential communication between policy fragments when building advanced pipeline scenarios in Azure API Management (APIM). Proper variable management is critical for building reliable, performant pipelines. Improper handling can lead to runtime errors, performance issues, and unpredictable behavior. Following these best practices ensures your pipelines execute properly with optimal performance.

## Variable fundamentals

Context variables provide thread-safe communication between policy fragments and are created using the built-in [set-variable](set-variable-policy) policy. Each request maintains its own isolated variable context, ensuring that concurrent requests cannot interfere with each other.

### Variable lifecycle management

- **Request Scope**: Variables exist only for the duration of a single request and are automatically garbage collected when the request completes.

- **Phase Persistence**: Variables set in the inbound phase remain available throughout backend, outbound, and error phase within the same request.  

- **Thread Isolation**: APIM enforces strict thread isolation - each request runs on its own thread with its own context object, preventing cross-request data leakage.

- **Sequential Updates**: Any fragment can modify existing variables, with subsequent fragments overwriting previous values. Sequential execution eliminates the need for locking mechanisms.

- **Storage Threshold**: APIM stores context variables in a dictionary that is optimized for small collections, typically less than 50 variables per request.

### Set and retrieve variables in fragments

```xml
<!-- Setting a context variable that is a prerequisite value for other fragments -->
<set-variable name="request-id" value="@{
    var requestId = context.Request.Headers.GetValueOrDefault("X-Request-ID", "");
    if (string.IsNullOrEmpty(requestId)) {
        return Guid.NewGuid().ToString();
    }
    return requestId;
}" />

<!-- Retrieving the same context variable safely in another fragment -->
<set-header name="X-Correlation-ID" value="@{
    return context.Variables.GetValueOrDefault<string>("request-id", "unknown");
}" />
```
## Best practices

### Use safe variable access

Always exercise caution with potential null values, use safe access with `GetValueOrDefault`, and provide meaningful default values for all variable access:

```xml
<!-- Safe access with default -->
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

**Strategy 1:** Fail Fast (Critical Dependencies)

Return an error response when critical dependencies are missing:

```xml
<choose>
    <when condition="@(!context.Variables.ContainsKey("config-parsed"))">
        <!-- Critical dependency missing - fail immediately -->
        <return-response>
            <set-status code="500" reason="Internal Server Error" />
            <set-body>{"error": "Configuration required", "missing_dependency": "config-parsed"}</set-body>
        </return-response>
    </when>
    <otherwise>
        <!-- Safe to proceed with parsed configuration -->
        <set-variable name="config-logging" value="@{
            var config = context.Variables.GetValueOrDefault<JObject>("config-parsed", new JObject());
            return config["logging"] ?? new JObject();
        }" />
    </otherwise>
</choose>
```

**Strategy 2:** Handle Gracefully (Optional Dependencies)

Continue execution with appropriate fallback behavior when optional dependencies are missing:

```xml
<choose>
    <when condition="@(context.Variables.ContainsKey("config-parsed"))">
        <!-- Optional config available - use configured log level -->
        <set-variable name="config-logging" value="@{
            var config = context.Variables.GetValueOrDefault<JObject>("config-parsed", new JObject());
            return config["logging"] ?? new JObject();
        }" />
        
        <set-variable name="log-level" value="@{
            var loggingConfig = context.Variables.GetValueOrDefault<JObject>("config-logging", new JObject());
            return loggingConfig["level"]?.ToString() ?? "INFO";
        }" />
    </when>
    <otherwise>
        <!-- Fallback to default when config unavailable -->
        <set-variable name="log-level" value="INFO" />
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

Use explicit type handling for optimal performance and reliability. When using [policy expressions](api-management-policy-expressions) with the `@{}` operator, specify the expected type:

```xml
<!-- Set as boolean, use as boolean -->
<set-variable name="should-log-debug" value="@(true)" />
<choose>
    <when condition="@(context.Variables.GetValueOrDefault<bool>("should-log-debug", false))">
        <!-- Include detailed debug information in logs -->
    </when>
</choose>
```

## Next steps

- **[Architecture for building advanced execution pipelines with policy fragments](fragment-pipeline-architecture.md)** - Foundational patterns for designing modular, scalable policy fragment architectures with clear separation of concerns.
- **[Central metadata cache for policy fragments](fragment-metadata-cache.md)** - Implementation guidance for shared metadata caching patterns across fragments.
- **[Policy injection and coordination with fragments](fragment-policy-coordination.md)** - Fragment injection patterns and coordination between Product and API policies.