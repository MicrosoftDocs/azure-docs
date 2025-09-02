---
title: Sustainability Features in Azure API Management (Preview)
description: Learn about environmental sustainability features in Azure API Management that help reduce carbon emissions and build more environmentally conscious APIs.
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 09/02/2025
ms.author: danlep
ms.custom: 
  - ai-gen
---

# Environmentally sustainable APIs in Azure API Management (preview)

This article introduces environmental sustainability features in Azure API Management that help you monitor and reduce the carbon footprint of your APIs. These limited preview features allow you to optimize API traffic based on carbon emissions in different Azure regions.

[!INCLUDE [preview-notice](../../includes/api-management-preview-statement.md)]

> [!IMPORTANT]
> These features are currently in limited preview. To gain access, please fill the sign-up form.
> Environmentalstainability features are available only in Azure API Management classic tiers (Developer, Basic, Standard, Premium).

## Why use sustainability features

Organizations are increasingly focused on reducing their environmental impact through their digital infrastructure. By optimizing how your APIs handle traffic based on environmental factors, you can:

* Reduce carbon emissions by routing traffic to regions with lower carbon intensity
* Support corporate sustainability initiatives and environmental commitments
* Make informed decisions about when and where to scale infrastructure
* Demonstrate environmental responsibility to stakeholders


## Traffic shaping

Traffic shaping lets you adjust API behavior based on carbon emission levels in your API Management service's region. Using a context variable that indicates the current carbon emission category, you can dynamically modify policies to reduce resource usage during high-emission periods. For example, use this information to:

* Extend cache durations
* Implement stricter rate limiting
* Reduce logging detail
* Minimize retry attempts
* Defer non-critical processing

### Carbon emission categories

[Placeholder for carbon emission categories]

### Using the context variable

API Management exposes a `context.Sustainability.CurrentCarbonCategory` context variable that indicates the current carbon emission category for the region where your API Management instance is running. You can use this variable in your policies to implement different behaviors based on the carbon intensity.

Here's an example of how to use the context variable in a policy:

```xml
<choose>
  <when condition="@(context.Sustainability.CurrentCarbonCategory == 'High')">
    <!-- Policies for high carbon emission periods -->
    <cache-store duration="3600" />
    <rate-limit-by-key calls="100" renewal-period="60" counter-key="@(context.Request.IpAddress)" />
    <set-variable name="enableDetailedLogging" value="false" />
  </when>
  <when condition="@(context.Sustainability.CurrentCarbonCategory == 'Medium')">
    <!-- Policies for medium carbon emission periods -->
    <cache-store duration="1800" />
    <rate-limit-by-key calls="200" renewal-period="60" counter-key="@(context.Request.IpAddress)" />
    <set-variable name="enableDetailedLogging" value="true" />
  </when>
  <otherwise>
    <!-- Policies for low carbon emission periods -->
    <cache-store duration="900" />
    <rate-limit-by-key calls="300" renewal-period="60" counter-key="@(context.Request.IpAddress)" />
    <set-variable name="enableDetailedLogging" value="true" />
  </otherwise>
</choose>

<!-- Use the logging variable elsewhere -->
<choose>
  <when condition="@(context.Variables.GetValueOrDefault<bool>("enableDetailedLogging"))">
    <log-to-eventhub logger-id="detailed-logger">
      @{
          return JObject.FromObject(context).ToString();
      }
    </log-to-eventhub>
  </when>
  <otherwise>
    <log-to-eventhub logger-id="basic-logger">
      @{
          var log = new JObject();
          log["requestId"] = context.RequestId;
          log["method"] = context.Request.Method;
          log["url"] = context.Request.Url.ToString();
          log["statusCode"] = context.Response.StatusCode;
          return log.ToString();
      }
    </log-to-eventhub>
  </otherwise>
</choose>

```

This example demonstrates how you can:

Apply longer cache durations during high carbon emission periods
Implement stricter rate limiting when carbon emissions are higher
Reduce logging detail during high carbon emission periods
Traffic shifting

## Traffic shifting
The
 traffic shifting feature allows you to route API traffic to backend services based on the carbon emission levels in the regions where those backends are hosted. This capability helps you prioritize backends in regions with lower carbon emissions.

To use traffic shifting, you:

* Specify the Azure region for each backend in your API Management configuration
* Set carbon emission thresholds for backends in a load balancer configuration
* API Management automatically routes traffic to backends with emissions below your specified threshold
* When all backends exceed the specified threshold, API Management routes traffic to all backends to ensure service availability.

### How traffic shifting works

Traffic shifting requires configuring your backend services with their corresponding Azure regions. When using a load balancer backend, you can specify the maximum acceptable carbon emission level for each backend.

API Management then uses this information to direct traffic away from "dirty" regions (those with higher carbon emissions) to "greener" regions (those with lower carbon emissions). This shifting helps reduce the overall carbon footprint of your API ecosystem while maintaining service availability.

The key points of traffic shifting include:

* It's an opt-in feature that gives you control over your sustainability preferences
* You can configure different carbon emission thresholds for different backends
* The system prioritizes service availability - if all backends exceed thresholds, traffic is still routed to all backends
* You can combine this feature with your existing load balancing and routing strategies
Supported regions
[Placeholder for supported regions]

### Configuration example
To configure a backend with its Azure region:

```xml
{
  "name": "myBackend",
  "url": "https://mybackend.example.com",
  "protocol": "http",
  "properties": {
    "azureRegion": "westeurope"
  }
}

```

To configure a load balancer with carbon emission thresholds:

```xml

{
  "name": "myLoadBalancer",
  "loadBalancingMethod": "RoundRobin",
  "backends": [
    {
      "name": "backend1",
      "url": "https://backend1.example.com",
      "properties": {
        "azureRegion": "westeurope",
        "maxCarbonEmission": 100
      }
    },
    {
      "name": "backend2",
      "url": "https://backend2.example.com",
      "properties": {
        "azureRegion": "eastus",
        "maxCarbonEmission": 150
      }
    },
    {
      "name": "backend3",
      "url": "https://backend3.example.com",
      "properties": {
        "azureRegion": "westus2",
        "maxCarbonEmission": 120
      }
    }
  ]
}
```

## Get access to sustainability features
Sustainability features in Azure API Management are currently available as a limited preview. To get access:

Sign up for the preview program (link to be provided)
Once approved, you can enable and configure these features in your existing API Management instances
Use the features in your API configuration and policies as described in this article

## Related content
How to configure backends in Azure API Management
API Management policy reference
Azure sustainability documentation