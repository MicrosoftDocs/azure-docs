---
title: Sustainability Features in Azure API Management (Preview)
description: Learn about gateway features in Azure API Management that help reduce carbon emissions of APIs and help customers meet their environmental sustainability goals.
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 09/03/2025
ms.author: danlep
ai-usage: ai-assisted
#customer intent: As an IT admin, I want to shift API traffic to backend regions with lower carbon intensity so that I can minimize emissions from my services.
---
# Environmentally sustainable APIs in Azure API Management (preview)

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

This article introduces features in Azure API Management that help you reduce the carbon footprint of your API traffic. Use the features to adjust API traffic based on carbon emissions in different Azure regions.

> [!NOTE]
> * Environmental sustainability features are currently in limited preview. To sign up, complete the form. <!-- Link to form -->
> * These features are currently available in [select regions](#region-availability) in the Azure API Management classic tiers (Developer, Basic, Standard, Premium).

<!--Required API versions? -->

## About sustainable APIs

Organizations are increasingly focused on reducing their environmental impact through their digital infrastructure. 

API Management lets you achieve these goals with features that help:

* [Shape API traffic](#traffic-shaping) based on carbon emissions in your API Management service's region
* [Shift and load-balance API traffic](#traffic-shifting) to backend regions with lower carbon intensity

By optimizing how your APIs handle traffic based on environmental factors, you can:

* Reduce carbon emissions of your API traffic
* Support corporate sustainability initiatives and environmental commitments
* Demonstrate environmental responsibility to stakeholders

## Traffic shaping

<!-- Is context variable only available for primary region? -->

Traffic shaping lets you adjust API behavior based on relative carbon emission levels in your API Management service's primary region. API Management exposes the `context.Deployment.SustainabilityInfo.CurrentCarbonIntensity` [context variable](api-management-policy-expressions.md#ContextVariables), which indicates the current carbon emission category for the region where your API Management instance is running. The five emission categories are qualitative (Very Low, Low, Medium, High, Very High) and are derived from internal Microsoft data sources.

Use this context variable in your policies to enable more intensive traffic processing during periods of low carbon emissions, or reduce processing during high carbon emissions.

### Example: Adjust behavior in high carbon emission periods

In the following example, API Management extends cache durations, implements stricter rate limiting, and reduces logging detail during high carbon emission periods.

```xml
<policies>
    [...]
    <inbound>
        <base />

<choose>
  <when condition="@(context.Deployment.SustainabilityInfo.CurrentCarbonIntensity == 'High')">
    <!-- Policies for high carbon emission periods -->
    <cache-store duration="3600" />
    <rate-limit-by-key calls="100" renewal-period="60" counter-key="@(context.Request.IpAddress)" />
    <set-variable name="enableDetailedLogging" value="false" />
  </when>
  <when condition="@(context.Deployment.SustainabilityInfo.CurrentCarbonIntensity == 'Medium')">
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

### Example:  Expose carbon intensity information

This example shows how to access the current carbon intensity and propagate it to the backend or in logs.

```xml
<policies>
    [...]
    <outbound>
        <base />
        <set-header name="X-Sustainability-CarbonEmission" exists-action="override">
            <value>@(context.Deployment.SustainabilityInfo.CurrentCarbonIntensity.ToString())</value>
        </set-header>
    </outbound>
    [...]
</policies>
```

## Traffic shifting

Traffic shifting requires configuring a [backend](backends.md) resource in a specific Azure region. Then, in a load-balanced backend pool, specify the maximum acceptable carbon emission level for the regionalized backend. Similar to the emission categories for the API Management instance, the emission thresholds for backends are qualitative and range from Very Low to Very High. 

This capability, combined with your existing load balancing and routing strategies, helps you prioritize backends in regions with relatively lower carbon emissions.

At runtime:

* API Management automatically routes traffic to "greener" backends -  those with emissions below your specified threshold
* When emissions exceed the specified thresholds for all backends, API Management routes traffic to all backends based on their remaining load balancing configuration to ensure service availability.

<!--Is there an updated diagram? -->

:::image type="content" source="media/sustainability/traffic-shifting.png" alt-text="Diagram of shifting traffic to a backend with lower emissions in load-balanced pool.":::

### Configuration example

First, configure a backend that is preferred based on carbon intensity in a [supported Azure region](#region-availability) by setting the `azureRegion` property:

```json
{
    "type": "Microsoft.ApiManagement/service/backends", 
    "apiVersion": "2023-09-01-preview", 
    "name": "sustainable-backend", 
    "properties": {
        "url": "https://mybackend.example.com",
        "protocol": "http",
        "azureRegion": "westeurope",
        [...]
  }
}
```

Then, use the regionalized backend in a load-balanced pool and define the emission threshold using a `preferredCarbonEmission` property. In this example, if the carbon intensity exceeds `Medium`, the `sustainable-backend` is deprioritized compared with the other backend in the pool.


```json
{
    [...]
    "properties": {
        "description": "Load balancer for multiple backends",
        "type": "Pool",
        "pool": {
            "services": [
                {
                    "id": "<sustainable-backend-id>",
                    "weight": 1,
                    "priority": 1,
                    "preferredCarbonEmission": "Medium"
                }
                {
                    "id": "<regular-backend-id>",
                    "weight": 1,
                    "priority": 2
                }
            ]
        }
    }
} 
```

## Region availability

The environmental sustainability features are available in the following Azure regions:

* East Asia
* West Central US
* Australia Southeast
* Brazil South
* Japan East
* UK South
* West US 2
* Central India
* East US
* UK West
* Australia East
* Canada Central
* Canada East
* Central US
* Germany West Central
* Japan West
* North Europe
* Norway East
* South Africa North
* Southeast Asia
* Switzerland North
* UAE North
* East US 2
* France South
* Israel Central
* Italy North
* Jio India West
* Mexico Central
* Poland Central
* Qatar Central
* South India
* Spain Central
* Sweden Central
* Switzerland West
* Taiwan North
* Taiwan North West
* West Europe
* West US
* West US 3
* New Zealand North
* Indonesia Central


## Related content

* [Backends](backends.md)
* [API Management policy reference](api-management-policies.md)
* [Sustainable workloads in Azure](/azure/well-architected/sustainability/sustainability-get-started)
* [Carbon optimization in Azure](/azure/carbon-optimization/overview)
* [Microsoft for sustainability](https://www.microsoft.com/sustainability/cloud)