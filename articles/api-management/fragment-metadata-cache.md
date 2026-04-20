---
title: Central Metadata Cache for Policy Fragments
titleSuffix: Azure API Management
description: Implementation guidance for shared metadata caching pattern across policy fragments in Azure API Management.
services: api-management
author: nicolela

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 02/10/2026
ms.author: nicolela
---

# Central metadata cache for policy fragments

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

When multiple policy fragments need access to shared metadata such as common configuration data, use a cross-request caching approach to optimize performance. Rather than parsing metadata repeatedly in each fragment, a parse-once, cache-everywhere approach dramatically improves performance while ensuring data consistency. With this approach, metadata is **parsed once** on the first request when the cache is empty, then **retrieved from the cache** for all subsequent requests until the cache expires or the cache version changes.

## Recommended approach

This approach requires two fragments: one for storing shared metadata and another for parsing and caching the metadata.

### 1. Metadata fragment

The metadata fragment serves as the single source of truth for shared metadata accessed by other fragments in the pipeline:
- **Centralized JSON storage**: Stores all metadata as JSON.
- **Cache settings**: Includes cache settings with versioning and duration (Time to Live, or TTL).

### 2. Parsing and caching fragment

The parsing and caching fragment implements the following behaviors:

- **Single parse operation**: Uses `JObject.Parse()` to parse the JSON stored in the metadata fragment once at the start of each pipeline request if the cache is empty.
- **Cross-request caching**: Stores and retrieves parsed metadata sections as a `JObject` using the built-in [cache-store-value](cache-store-value-policy.md) and [cache-lookup-value](cache-lookup-value-policy.md) policies across multiple requests.
- **Cache-first access**: Subsequent requests retrieve a parsed `JObject` directly from the cache, providing immediate access to all fragments without reparsing.
- **Cache invalidation**: Cache refreshes when the metadata version changes or the cache duration (TTL) expires.

## Implementation details

To implement this pattern, insert both fragments into a product or API policy definition at the beginning of the inbound phase. The metadata fragment must be inserted first, followed by the parsing and caching fragment. For example:

```xml
<policies>
    <inbound>
        <base />
        <include-fragment fragment-id="metadata-fragment" />
        <include-fragment fragment-id="parse-cache-fragment" />
    </inbound>
</policies>
```

### Metadata fragment example

The `metadata-fragment.xml` fragment stores shared JSON metadata in a [context variables](api-management-policy-expressions.md#ContextVariables) named `metadata-config`:

```xml
<!-- Single source of truth for all shared metadata -->
<fragment fragment-id="metadata-fragment">
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
      'premium': { 'requests-per-minute': 1000 },
      'standard': { 'requests-per-minute': 100 },
      'basic': { 'requests-per-minute': 20 }
    }
  }";}" />
</fragment>
```

### Parsing and caching fragment example

The `parse-cache-fragment.xml` fragment parses the JSON stored in the `metadata-config` context variable once and provides access to the resulting `JObject`. The `metadata-config` variable must already be set by `metadata-fragment.xml`:

```xml
<fragment fragment-id="parse-cache-fragment">
  <!-- Extract cache settings from metadata-config to determine cache version and TTL -->
  <set-variable name="cache-config-temp" value="@{
    try {
      var configStr = context.Variables.GetValueOrDefault<string>("metadata-config", "{}");
      if (string.IsNullOrEmpty(configStr) || configStr == "{}") {
        return "{\"version\":\"1.0\",\"enabled\":true,\"ttl\":3600}";
      }
      
      var tempConfig = JObject.Parse(configStr);
      var cacheSettings = tempConfig["cache-settings"] as JObject;
      
      var result = new JObject();
      result["version"] = cacheSettings?["config-version"]?.ToString() ?? "1.0";
      result["enabled"] = cacheSettings?["feature-flags"]?["enable-cross-request-cache"]?.Value<bool>() ?? true;
      result["ttl"] = cacheSettings?["ttl-seconds"]?.Value<int>() ?? 3600;
      
      return result.ToString(Newtonsoft.Json.Formatting.None);
    } catch {
      return "{\"version\":\"1.0\",\"enabled\":true,\"ttl\":3600}";
    }
  }" />
  
  <!-- Parse cache configuration -->
  <set-variable name="cache-settings-parsed" value="@{
    return JObject.Parse(context.Variables.GetValueOrDefault<string>("cache-config-temp", "{}"));
  }" />
  
  <!-- Build cache key with version from cache settings -->
  <set-variable name="cache-key" value="@{
    var settings = context.Variables.GetValueOrDefault<JObject>("cache-settings-parsed");
    var version = settings?["version"]?.ToString() ?? "1.0";
    return "metadata-config-parsed-v" + version;
  }" />
  
  <!-- Try to get from APIM cache -->
  <cache-lookup-value key="@(context.Variables.GetValueOrDefault<string>("cache-key"))" variable-name="cached-config" />
  
  <choose>
    <when condition="@(context.Variables.ContainsKey("cached-config"))">
      <!-- Cache found - Use cached configuration -->
      <set-variable name="config-cache-result" value="@(true)" />
      
      <!-- Restore cached config-parsed -->
      <set-variable name="config-parsed" value="@(context.Variables.GetValueOrDefault<JObject>("cached-config"))" />
      
      <!-- Extract sections from cached metadata JObject -->
      <set-variable name="config-logging" value="@{
        var config = context.Variables.GetValueOrDefault<JObject>("config-parsed");
        return config["logging"] as JObject ?? new JObject();
      }" />
      
      <set-variable name="config-rate-limits" value="@{
        var config = context.Variables.GetValueOrDefault<JObject>("config-parsed");
        return config["rate-limits"] as JObject ?? new JObject();
      }" />
    </when>
    <otherwise>
      <!-- Cache miss - Parse and store in cache -->
      <set-variable name="config-cache-result" value="@(false)" />
      
      <!-- Parse metadata-config JSON -->
      <set-variable name="config-parsed" value="@{
        var configStr = context.Variables.GetValueOrDefault<string>("metadata-config", "{}");
        return JObject.Parse(configStr);
      }" />
      
      <!-- Extract commonly used sections for direct access -->
      <set-variable name="config-logging" value="@{
        var config = context.Variables.GetValueOrDefault<JObject>("config-parsed");
        return config["logging"] as JObject ?? new JObject();
      }" />
      
      <set-variable name="config-rate-limits" value="@{
        var config = context.Variables.GetValueOrDefault<JObject>("config-parsed");
        return config["rate-limits"] as JObject ?? new JObject();
      }" />
      
      <!-- Store parsed metadata JObject in cache -->
      <cache-store-value key="@(context.Variables.GetValueOrDefault<string>("cache-key"))" 
                         value="@(context.Variables.GetValueOrDefault<JObject>("config-parsed"))" 
                         duration="@(context.Variables.GetValueOrDefault<JObject>("cache-settings-parsed")?["ttl"]?.Value<int>() ?? 3600)" />
    </otherwise>
  </choose>
</fragment>
```

### Using metadata in other fragments

Other fragments can now access parsed metadata sections directly. For example:

```xml
<fragment fragment-id="request-logging-fragment">
  <!-- Access logging metadata JObject without reparsing -->
  <set-variable name="config-logging" value="@{
    return context.Variables.GetValueOrDefault<JObject>("config-logging", new JObject()); 
  }" />
</fragment>
```

### Cache settings and invalidation

The `parse-cache-fragment.xml` fragment uses the cache settings stored in the `metadata-fragment.xml` fragment to determine caching behavior and invalidation. For example, the settings can be changed as follows:

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

**How cache invalidation works:** The `parse-cache-fragment.xml` fragment constructs cache keys using the `config-version` value (for example, `metadata-config-v1.0.1`). When the version is changed to `1.0.2`, a new cache key is created (`metadata-config-v1.0.2`). Since no cached data exists for the new key, the fragment parses fresh metadata JSON.

**To force cache refresh:** Update the `config-version` in the `metadata-fragment.xml` fragment. Because the cache settings are parsed on every request before the cache lookup occurs, changes to the cache configuration take effect immediately.

## Testing and debugging

### Cache result tracking

The `parse-cache-fragment.xml` fragment sets a `config-cache-result` variable. This variable is useful for logging and in response headers for debugging:

```xml
<!-- Add cache status to response headers for debugging -->
<set-header name="X-Config-Cache-Result" exists-action="override">
  <value>@(context.Variables.GetValueOrDefault<bool>("config-cache-result", false).ToString())</value>
</set-header>
```

### Cache bypass

To disable caching, use the cache bypass header:

```bash
curl -H "X-Config-Cache-Bypass: true" https://your-gateway.com/api
```

The `parse-cache-fragment.xml` fragment checks for the bypass header after parsing cache settings:

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

Implement error handling for JSON parsing operations to prevent fragment failures and provide fallback behavior. Wrap `JObject.Parse()` operations in try-catch blocks with meaningful default values:

```xml
<set-variable name="config-parsed" value="@{
  try {
    var configJson = context.Variables.GetValueOrDefault<string>("metadata-config", "{}");
    return JObject.Parse(configJson);
  } catch (Exception ex) {
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

## Related content

- **[Architecture for building advanced execution pipelines with policy fragments](fragment-pipeline-architecture.md)** - Foundational patterns for designing modular, scalable policy fragment architectures with clear separation of concerns.
- **[Variable management for policy fragments](fragment-variable-management.md)** - Comprehensive guidance on context variable handling, safe access patterns, and inter-fragment communication.
- **[Policy injection and coordination with fragments](fragment-policy-coordination.md)** - Fragment injection patterns and coordination between product and API policies.
- **[Custom caching in Azure API Management](api-management-sample-cache-by-key.md)** - Learn how to cache items by key and modify the key using request headers.