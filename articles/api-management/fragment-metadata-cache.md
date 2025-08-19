---
title: Central metadata cache for policy fragments
titleSuffix: Azure API Management
description: Implementation guidance for shared metadata caching patterns across fragments.
services: api-management
author: nicolela

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 08/19/2025
ms.author: nicolela
---

# Central metadata cache for policy fragments

**Applies to:** All Azure API Management tiers

Advanced pipeline scenarios require consistent access to common metadata across multiple policy fragments. Rather than parsing metadata repeatedly in each fragment, use a parse-once, cache-everywhere approach that dramatically improves performance while ensuring data consistency.

Using a central metadata cache eliminates redundant parsing across fragments while providing consistent access to configuration data throughout the execution pipeline. The key performance benefit is that metadata is **parsed once** when the cache is empty, then **reused from the cache** for all subsequent requests until the cache expires.

## Recommended approach

To apply this approach, use a two-fragment architecture that separates raw metadata storage from parsing and caching.

### 1. Metadata fragment

The metadata fragment serves as the single source of truth for common configuration accessed by other fragments in the pipeline:

- **Centralized JSON storage**: Stores all configuration metadata as JSON that needs to be accessed by other fragments in the pipeline.
- **Version Control**: Includes cache settings with metadata versioning for cache invalidation and duration (TTL) management.

### 2. Cache fragment

The cache fragment provides parsing and caching:

- **Single Parse Operation**: Uses `JObject.Parse()` to parse the JSON metadata once at the start of each pipeline request if the cache is empty.
- **Cross-Request Caching**: Stores and retrieves parsed metadata sections as a `JObject` using APIM's built-in [cache-store-value](cache-store-value-policy.md)  and [cache-lookup-value](cache-lookup-value-policy.md) policies across multiple requests.
- **Cache-First Access**: Subsequent requests retrieve a parsed `JObject` directly from the cache, providing immediate access to all fragments without re-parsing.
- **Version-Based Invalidation**: Forces cache refresh when metadata version changes.

## Implementation details

To implement this pattern, inject both fragments into your Product or API policy definition at the beginning of the inbound phase:

1. **First**: Inject the metadata fragment (provides raw JSON metadata).
2. **Second**: Inject the cache fragment (parses and caches the `JObject` metadata).

### Metadata fragment example

The metadata fragment stores common JSON metadata that is used by other fragments in the pipeline:

```xml
<fragment fragment-id="Metadata-Source">
  <!-- Single source of truth for all shared metadata -->
  <set-variable name="metadata-config" value="@{return @"{
    'cache-settings': {
      'config-version': '1.0',
      'ttl-seconds': 3600,
      'feature-flags': {
        'enable-cross-request-cache': true,
        'cache-bypass-header': 'X-Config-Cache-Bypass'
      }
    },
    'logging': {
      'level': 'INFO',
      'enabled': true
    },
    'rate-limits': {
      'premium': { 'requests-per-minute': 1000, 'burst': 200 },
      'standard': { 'requests-per-minute': 100, 'burst': 50 },
      'basic': { 'requests-per-minute': 20, 'burst': 10 }
    }
  }";}" />
</fragment>
```

### Cache fragment example

The cache fragment parses the metadata fragment JSON once and provides access to the `JObject`:

```xml
<fragment fragment-id="Metadata-Cache">
  <!-- Parse cache settings first on every request to get version -->
  <set-variable name="cache-settings-parsed" value="@{
    try {
      var configJson = context.Variables.GetValueOrDefault<string>("metadata-config", "{}");
      var config = JObject.Parse(configJson);
      return config["cache-settings"] ?? new JObject();
    } catch {
      return new JObject();
    }
  }" />
  
  <!-- Build cache key with version from cache settings -->
  <set-variable name="cache-key" value="@{
    var settings = context.Variables.GetValueOrDefault<JObject>("cache-settings-parsed");
    var version = settings?["config-version"]?.ToString() ?? "1.0";
    return "metadata-config-v" + version;
  }" />
  
  <!-- Check if metadata JObject is already cached -->
  <cache-lookup-value key="@(context.Variables.GetValueOrDefault<string>("cache-key"))" variable-name="cached-config" />
  
  <choose>
    <when condition="@(!context.Variables.ContainsKey("cached-config"))">
      <!-- Cache miss - parse metadata JSON once -->
      <set-variable name="config-parsed" value="@{
        try {
          var configJson = context.Variables.GetValueOrDefault<string>("metadata-config", "{}");
          return JObject.Parse(configJson);
        } catch {
          return new JObject();
        }
      }" />
      
      <!-- Extract commonly used sections for direct access -->
      <set-variable name="config-logging" value="@{
        var config = context.Variables.GetValueOrDefault<JObject>("config-parsed", new JObject());
        return config["logging"] ?? new JObject();
      }" />
      
      <set-variable name="config-rate-limits" value="@{
        var config = context.Variables.GetValueOrDefault<JObject>("config-parsed", new JObject());
        return config["rate-limits"] ?? new JObject();
      }" />
      
      <!-- Get duration from cache settings (parsed fresh each request) -->
      <set-variable name="cache-ttl" value="@{
        var settings = context.Variables.GetValueOrDefault<JObject>("cache-settings-parsed");
        return settings?["ttl-seconds"]?.Value<int>() ?? 3600;
      }" />
      
      <!-- Store parsed metadata JObject in cache -->
      <cache-store-value key="@(context.Variables.GetValueOrDefault<string>("cache-key"))" 
                         value="@(context.Variables.GetValueOrDefault<JObject>("config-parsed", new JObject()))" 
                         duration="@(context.Variables.GetValueOrDefault<int>("cache-ttl"))" />
      
      <!-- Track cache miss for debugging -->
      <set-variable name="config-cache-hit" value="false" />
    </when>
    <otherwise>
      <!-- Cache hit - use cached metadata JObject -->
      <set-variable name="config-parsed" value="@(context.Variables.GetValueOrDefault<JObject>("cached-config", new JObject()))" />
      
      <!-- Extract sections from cached metadata JObject -->
      <set-variable name="config-logging" value="@{
        var config = context.Variables.GetValueOrDefault<JObject>("config-parsed", new JObject());
        return config["logging"] ?? new JObject();
      }" />
      
      <set-variable name="config-rate-limits" value="@{
        var config = context.Variables.GetValueOrDefault<JObject>("config-parsed", new JObject());
        return config["rate-limits"] ?? new JObject();
      }" />
      
      <!-- Track cache hit for debugging -->
      <set-variable name="config-cache-hit" value="true" />
    </otherwise>
  </choose>
</fragment>
```

### Using metadata in other fragments

Other fragments can now access parsed metadata sections directly:

```xml
<fragment fragment-id="Request-Logging">
  <!-- Access logging metadata JObject without re-parsing -->
  <set-variable name="config-logging" value="@{
    return context.Variables.GetValueOrDefault<JObject>("config-logging", new JObject()); 
  }" />
</fragment>
```

### Cache settings and invalidation

Cache settings are stored in the metadata fragment as shown in the main example above. The cache fragment automatically uses these settings for both caching behavior and invalidation.  For example:

```xml
<!-- Example: Updated cache settings in the metadata fragment -->
'cache-settings': {
  'config-version': '1.0.1',     <!-- Change version to invalidate cache -->
  'ttl-seconds': 7200,           <!-- Increase TTL to 2 hours -->
  'feature-flags': {
    'enable-cross-request-cache': true,
    'cache-bypass-header': 'X-Config-Cache-Bypass'
  }
}
```

**How cache invalidation works:** The cache fragment constructs cache keys using the `config-version` value (e.g., `metadata-config-v1.0.1`). When you change the version to `1.0.2`, it creates a new cache key (`metadata-config-v1.0.2`). Since no cached data exists for the new key, the fragment triggers a cache miss and parses fresh metadata JSON.

**To refresh cache:** Simply update the `config-version` in your metadata fragment. Changes to cache configuration take effect immediately since cache settings parsing happens before cache lookup.

## Testing and debugging

### Cache hit/miss tracking

The cache fragment sets a `config-cache-hit` variable to track cache performance. You can use this variable in logging or response headers for debugging:

```xml
<!-- Add cache status to response headers for debugging -->
<set-header name="X-Config-Cache-Hit" exists-action="override">
  <value>@(context.Variables.GetValueOrDefault<bool>("config-cache-hit", false).ToString())</value>
</set-header>
```

### Cache bypass for testing

To disable caching during development and testing, use the cache bypass header:

```bash
curl -H "X-Config-Cache-Bypass: true" https://your-gateway.com/api
```

The cache fragment should check for the bypass header after parsing cache settings:

```xml
<!-- Check if cache bypass is requested -->
<set-variable name="cache-bypass-requested" value="@{
  var settings = context.Variables.GetValueOrDefault<JObject>("cache-settings-parsed");
  var bypassHeader = settings?["bypass-header"]?.ToString() ?? "X-Config-Cache-Bypass";
  return context.Request.Headers.GetValueOrDefault(bypassHeader, "").ToLower() == "true";
}" />
```

The bypass check is then used in the caching decision logic:

```xml
<when condition="@{
  var settings = context.Variables.GetValueOrDefault<JObject>("cache-settings-parsed");
  var enabled = settings?["enabled"]?.Value<bool>() ?? false;
  var bypass = context.Variables.GetValueOrDefault<bool>("cache-bypass-requested", false);
  return enabled && !bypass;
}">
  <!-- Cross-request caching is enabled and not bypassed -->
</when>
```

## Best practices

### Handle JSON parsing failures with error logging and defaults

Implement robust error handling for JSON parsing operations to prevent fragment failures and provide fallback behavior. Always wrap `JObject.Parse()` operations in try-catch blocks with trace logging and meaningful default values:

```xml
<set-variable name="config-parsed" value="@{
  try {
    var configJson = context.Variables.GetValueOrDefault<string>("metadata-config", "{}");
    return JObject.Parse(configJson);
  } catch (Exception ex) {
    // Log parse error for debugging
    context.Trace.TraceError("JSON parse failed: " + ex.Message);
    // Return default configuration on parse failure
    return JObject.Parse(@"{
      'logging': { 'level': 'ERROR', 'enabled': false },
      'rate-limits': { 'default': { 'requests-per-minute': 10 } }
    }");
  }
}" />

<!-- Log parse error using trace policy -->
<choose>
  <when condition="@(context.Variables.ContainsKey("parse-error"))">
    <trace source="config-parse" severity="error">
      <message>@("JSON parse failed: " + context.Variables.GetValueOrDefault<string>("parse-error"))</message>
    </trace>
  </when>
</choose>
```

### Preserve request body for metadata extraction

When extracting metadata from request bodies for caching, always use `preserveContent: true` to keep the original request body intact for backend forwarding:

```xml
<set-variable name="request-metadata" value="@{
  try {
    // CRITICAL: preserveContent: true ensures backend receives original body
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

This ensures the original request body remains available for forwarding to backend services while allowing you to parse and analyze the content.

## Next steps

- **[Architecture for building advanced execution pipelines with policy fragments](fragment-pipeline-architecture.md)** - Foundational patterns for designing modular, scalable policy fragment architectures with clear separation of concerns.
- **[Variable management for policy fragments](fragment-variable-mgmt.md)** - Comprehensive guidance on context variable handling, safe access patterns, and inter-fragment communication.
- **[Policy injection and coordination with fragments](fragment-policy-coordination.md)** - Fragment injection patterns and coordination between Product and API policies.