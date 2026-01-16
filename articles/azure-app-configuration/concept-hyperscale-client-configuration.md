---
title: Hyperscale configuration delivery for client applications with Azure App Configuration (Preview) 
description: Learn how to use hyperscale configuration delivery to your applications via Azure Front Door.
author: avanigupta
ms.author: avgupta
ms.service: azure-app-configuration
ms.topic: concept-article 
ms.date: 12/02/2025
---

# Hyperscale configuration delivery for client applications (preview) 

When it comes to consuming configuration, client applications have different requirements than server applications. They can't store secrets, they operate on a much larger scale, and users expect instant startup times from anywhere in the world. To meet the requirements of client-side application configuration, Azure App Configuration provides integration with Azure Front Door. Azure Front Door's edge-based content delivery network combined with Azure App Configuration's centralized configuration management enables client applications anywhere to get configuration fast, reliably and anonymously.

## CDN-accelerated configuration delivery with Azure Front Door

App Configuration gives developers a single, consistent place to define configuration settings and feature flags. By integrating Azure App Configuration with Azure Front Door, your configuration data is centrally managed through Azure App Configuration while being cached and distributed through Azure's content delivery network. This architecture is valuable for client-facing applications including mobile, desktop, and browser-based applications.

## System architecture

:::image type="content" source="media/hyperscale-configuration-architecture.png" alt-text="Architecture diagram for integration of Azure Front Door with Azure App Configuration."

How it works
- Client applications retrieve configuration through Azure Front Door endpoints without authentication, eliminating the security risk of embedding credentials in client-side code.
- Azure Front Door uses Managed Identity to authenticate with Azure App Configuration securely.
- A configurable subset of key-values, feature flags, or snapshots are exposed through Azure Front Door.
- Edge caching enables high throughput and low latency configuration delivery.

This architecture eliminates the need for custom proxies or gateways while providing secure, efficient configuration delivery to client applications.

## Developer scenarios

CDN-delivered configuration unlocks a range of client application scenarios:

- Client-side feature rollouts for UI components
- A/B testing or targeted experiences using feature flags
- Control AI/LLM model parameters and UI behaviors through configuration
- Dynamically control client-side agent behavior, safety modes, and guardrail settings through configuration
- Consistent behavior for clients using snapshot-based configuration

> [!NOTE]
> This feature is currently available only in the Azure public cloud. 

## Recommendations and considerations

### Security

Configuration exposed through Azure Front Door is publicly accessible without authentication, making proper security controls essential. Implement the following strategies to protect your configuration data from unintended exposure.

#### Use a dedicated App Configuration store

Consider using a dedicated App Configuration store for client-facing configuration delivered through Azure Front Door. This store should contain only nonsensitive settings that are safe for public consumption. This isolation strategy limits potential impact if configuration is inadvertently exposed, ensuring that sensitive data remains protected.

#### Role Based Access Control using Managed Identity

Azure Front Door accesses App Configuration data using either a system-assigned managed identity or a user-assigned managed identity. The selected identity must be assigned the `App Configuration Data Reader` role to retrieve configuration data. When you create the Azure Front Door endpoint through the App Configuration portal, this role assignment is created automatically. The portal displays a warning if the role assignment creation process encounters any issues. Restrict the managed identity to the `App Configuration Data Reader` role only and avoid assigning any roles with write permissions.

### Request scoping

Configure one or more filters to control which requests are allowed to pass through Azure Front Door. This prevents anonymous clients from bypassing the CDN cache through excessive or malformed requests that could overwhelm App Configuration and trigger service throttling.

#### Request scoping through key-value filters

- Configure Azure Front Door filters to precisely match your application's configuration requirements. Only expose the exact key patterns your application uses. For example, if your application loads keys with the `"App1:"` prefix, configure the Azure Front Door rule to allow only `"App1:"` keys, not broader patterns like `"App"`.

- If your application loads feature flags, provide `".appconfig.featureflag/{YOUR-FEATURE-FLAG-PREFIX}"` filter for the Key with *Starts with* operator.

- If you're using App Configuration provider libraries and your application loads ONLY feature flags, you should add two key filters in the Azure Front Door rules - one for `ALL` keys with no label and second for all keys starting with `".appconfig.featureflag/{YOUR-FEATURE-FLAG-PREFIX}"`. This is because App Configuration provider libraries load all key-values with no label by default when no key-value selector is specified. 

#### Request scoping through multiple Azure Front Door endpoints

Create separate Azure Front Door endpoints for applications with different configuration requirements. Rather than combining multiple filter rules in a single endpoint, each application connects to its dedicated endpoint with precisely scoped filters. This approach prevents applications from accessing each other's configuration data and simplifies filter management.

### Failover and load balancing

Client applications rely on Azure Front Door for failover and load balancing, as they don't connect directly to App Configuration. To enable automatic failover and geo-redundant configuration delivery, configure your App Configuration replicas as origins in the Azure Front Door endpoint. For details on how origin groups improve availability and performance, see [Azure Front Door routing methods](/azure/frontdoor/routing-methods)

### Caching

Configure Azure Front Door cache duration to balance configuration freshness and origin load. Azure Front Door controls the caching behavior, which means updates from App Configuration can only be seen by your application after the Front Door cache expires. This cache expiration time effectively becomes the minimum time before your app can observe new configuration values, regardless of how frequently the app checks for changes. 

We recommend setting Azure Front Door cache TTL to at least 10 minutes and application refresh interval to at least 1 minute. With these settings, configuration updates may take up to 11 minutes to propagate: Azure Front Door 10 minute cache TTL plus up to 1 minute until the next application refresh. 

You can choose appropriate refresh interval values that fit your application. Shorter cache durations will increase the number of requests routed through Azure Front Door. This model provides eventual consistency, not real-time propagation, which is expected for CDN-based delivery. Learn more about [Caching with Azure Front Door](/azure/frontdoor/front-door-caching).

> [!NOTE]
> Azure Front Door makes no guarantees about the amount of time that the content is stored in the cache. Cached content may be removed from the edge cache before the content expiration if the content isn't frequently used. Additionally, if App Configuration is unreachable, Azure Front Door may continue serving stale data from cache to maintain application availability. 

## Next steps

> [!div class="nextstepaction"]
> [Set up Azure Front Door with App Config](./how-to-connect-azure-front-door.md)

## Related content

- [Load Configuration from Azure Front Door in Client Applications](./how-to-load-azure-front-door-configuration-provider.md)

