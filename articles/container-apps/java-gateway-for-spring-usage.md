---
title: Configure settings for the Gateway for Spring component in Azure Container Apps (preview)
description: Learn to configure the Gateway for Spring component in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 09/30/2024
ms.author: wenhaozhang
---

# Configure the Gateway for Spring component in Azure Container Apps (preview)

The Gateway for Spring managed component offers an efficient solution to route API requests and address cross-cutting concerns including security, monitoring/metrics, and resiliency. This article shows you how to configure and manage your Gateway for Spring component.

## Show

You can view the details of an individual component by name using the `show` command.

Before you run the following command, replace placeholders surrounded by `<>` with your values.

```azurecli
az containerapp env java-component gateway-for-spring show \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --name <JAVA_COMPONENT_NAME>
```

## Update

You can update the configuration and routes of Gateway for Spring component using the `update` command.

Before you run the following command, replace placeholders surrounded by `<>` with your values. Supported configurations are listed in the [properties list table](#configurable-properties).

```azurecli
az containerapp env java-component gateway-for-spring update \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --name <JAVA_COMPONENT_NAME> \
  --configuration <CONFIGURATION_KEY>="<CONFIGURATION_VALUE>" \
  --route-yaml <PTAH_TO_ROUTE_YAML_FILE>
```

## List

You can list all registered Java components using the `list` command.

Before you run the following command, replace placeholders surrounded by `<>` with your values.

```azurecli
az containerapp env java-component list \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP>
```


## Allowed configuration list for your Gateway for Spring

The following list details the gateway component properties you can configure for your app. You can find more details in [Spring Cloud Gateway Common application properties](https://docs.spring.io/spring-cloud-gateway/reference/appendix.html) docs.

| Property name | Description | Default value |
|--|--|--|
| `spring.cloud.gateway.default-filters` | List of filter definitions that are applied to every route. | N/A |
| `spring.cloud.gateway.enabled`  | Enables gateway functionality. | `true` |
| `spring.cloud.gateway.fail-on-route-definition-error` | Option to fail on route definition errors, defaults to true. Otherwise, a warning is logged. | `true` |
| `spring.cloud.gateway.handler-mapping.order` | The order of RoutePredicateHandlerMapping. | `1` |
| `spring.cloud.gateway.loadbalancer.use404` | N/A | `false` |  
| `spring.cloud.gateway.discovery.locator.enabled` | Flag that enables DiscoveryClient gateway integration. | `false` |
| `spring.cloud.gateway.discovery.locator.filters` | N/A  |  N/A |
| `spring.cloud.gateway.discovery.locator.include-expression` | SpEL expression that will evaluate whether to include a service in gateway integration or not, defaults to: true. | `true` |
| `spring.cloud.gateway.discovery.locator.lower-case-service-id` | Option to lower case serviceId in predicates and filters, defaults to false. Useful with eureka when it automatically uppercases serviceId. so MYSERIVCE, would match /myservice/** | `false` | 
| `spring.cloud.gateway.discovery.locator.predicates` | N/A  |  N/A |
| `spring.cloud.gateway.discovery.locator.route-id-prefix` | The prefix for the routeId, defaults to discoveryClient.getClass().getSimpleName() + "_". Service Id will be appended to create the routeId. |  N/A |
| `spring.cloud.gateway.discovery.locator.url-expression` | SpEL expression that create the uri for each route, defaults to: 'lb://'+serviceId. | `'lb://'+serviceId` |
| `spring.cloud.gateway.filter.add-request-header.enabled` | Enables the add-request-header filter. | `true` |
| `spring.cloud.gateway.filter.add-request-parameter.enabled` | Enables the add-request-parameter filter. | `true` | 
| `spring.cloud.gateway.filter.add-response-header.enabled` | Enables the add-response-header filter. | `true` |
| `spring.cloud.gateway.filter.circuit-breaker.enabled`  | Enables the circuit-breaker filter. | `true` |
| `spring.cloud.gateway.filter.dedupe-response-header.enabled` |  Enables the dedupe-response-header filter. | `true` |
| `spring.cloud.gateway.filter.fallback-headers.enabled`  | Enables the fallback-headers filter. | `true` |
| `spring.cloud.gateway.filter.hystrix.enabled` | Enables the hystrix filter. | `true` |
| `spring.cloud.gateway.filter.json-to-grpc.enabled` | Enables the JSON to gRPC filter. | `true` |
| `spring.cloud.gateway.filter.local-response-cache.enabled`  | Enables the local-response-cache filter. | `false` |
| `spring.cloud.gateway.filter.local-response-cache.request.no-cache-strategy` | N/A  |  N/A |
| `spring.cloud.gateway.filter.local-response-cache.size` | Maximum size of the cache to evict entries for this route (in KB, MB and GB). | N/A |
| `spring.cloud.gateway.filter.local-response-cache.time-to-live` | Time to expire a cache entry (expressed in s for seconds, m for minutes, and h for hours). | `5m` |
| `spring.cloud.gateway.filter.map-request-header.enabled` | Enables the map-request-header filter. | `true` |
| `spring.cloud.gateway.filter.modify-request-body.enabled` | Enables the modify-request-body filter. | `true` |
| `spring.cloud.gateway.filter.modify-response-body.enabled` | Enables the modify-response-body filter. | `true` | 
| `spring.cloud.gateway.filter.prefix-path.enabled` | Enables the prefix-path filter. | `true` | 
| `spring.cloud.gateway.filter.preserve-host-header.enabled` | Enables the preserve-host-header filter. | `true` | 
| `spring.cloud.gateway.filter.redirect-to.enabled` | Enables the redirect-to filter. | `true` |
| `spring.cloud.gateway.filter.remove-hop-by-hop.headers` | N/A  |  N/A |
| `spring.cloud.gateway.filter.remove-hop-by-hop.order` | N/A  | `0` |  
| `spring.cloud.gateway.filter.remove-request-header.enabled` | Enables the remove-request-header filter. | `true` |
| `spring.cloud.gateway.filter.remove-request-parameter.enabled` | Enables the remove-request-parameter filter. | `true` |
| `spring.cloud.gateway.filter.remove-response-header.enabled` | Enables the remove-response-header filter. | `true` |
| `spring.cloud.gateway.filter.request-header-size.enabled` | Enables the request-header-size filter. | `true` | 
| `spring.cloud.gateway.filter.request-header-to-request-uri.enabled` | Enables the request-header-to-request-uri filter. | `true` | 
| `spring.cloud.gateway.filter.request-rate-limiter.default-key-resolver` |  N/A  |  N/A |
| `spring.cloud.gateway.filter.request-rate-limiter.default-rate-limiter` |  N/A  |  N/A |
| `spring.cloud.gateway.filter.request-rate-limiter.enabled` | Enables the request-rate-limiter filter. | `true` | 
| `spring.cloud.gateway.filter.request-size.enabled` | Enables the request-size filter. | `true` | 
| `spring.cloud.gateway.filter.retry.enabled` | Enables the retry filter. | `true` | 
| `spring.cloud.gateway.filter.rewrite-location-response-header.enabled` | Enables the rewrite-location-response-header filter. | `true` | 
| `spring.cloud.gateway.filter.rewrite-location.enabled` |  Enables the rewrite-location filter. | `true` |
| `spring.cloud.gateway.filter.rewrite-path.enabled` |  Enables the rewrite-path filter. | `true` |
| `spring.cloud.gateway.filter.rewrite-request-parameter.enabled`  | Enables the rewrite-request-parameter filter. | `true` |
| `spring.cloud.gateway.filter.rewrite-response-header.enabled`  | Enables the rewrite-response-header filter. | `true` |
| `spring.cloud.gateway.filter.save-session.enabled` | Enables the save-session filter. | `true` | 
| `spring.cloud.gateway.filter.secure-headers.content-security-policy`|  N/A   | `default-src 'self' https:; font-src 'self' https: data:; img-src 'self' https: data:; object-src 'none'; script-src https:; style-src 'self' https: 'unsafe-inline'` |  
| `spring.cloud.gateway.filter.secure-headers.content-type-options` |   N/A   |`nosniff` |  
| `spring.cloud.gateway.filter.secure-headers.disable` |  N/A  |  N/A |
| `spring.cloud.gateway.filter.secure-headers.download-options` |  N/A | `noopen` |  
| `spring.cloud.gateway.filter.secure-headers.enabled` | Enables the secure-headers filter. | `true` | 
| `spring.cloud.gateway.filter.secure-headers.frame-options` | N/A  | `DENY` |  
| `spring.cloud.gateway.filter.secure-headers.permitted-cross-domain-policies`| N/A  | `none` |  
| `spring.cloud.gateway.filter.secure-headers.referrer-policy` | N/A | `no-referrer` |  
| `spring.cloud.gateway.filter.secure-headers.strict-transport-security` | N/A | `max-age=631138519` |  
| `spring.cloud.gateway.filter.secure-headers.xss-protection-header` | N/A | `1 ; mode=block` |  
| `spring.cloud.gateway.filter.set-path.enabled` | Enables the set-path filter. | `true` |
| `spring.cloud.gateway.filter.set-request-header.enabled`  | Enables the set-request-header filter. | `true` |
| `spring.cloud.gateway.filter.set-request-host-header.enabled` | Enables the set-request-host-header filter. | `true` |
| `spring.cloud.gateway.filter.set-response-header.enabled` | Enables the set-response-header filter. | `true` |
| `spring.cloud.gateway.filter.set-status.enabled` | Enables the set-status filter. |  `true` |
| `spring.cloud.gateway.filter.strip-prefix.enabled` | Enables the strip-prefix filter. |  `true` |
| `spring.cloud.gateway.forwarded.enabled` | Enables the ForwardedHeadersFilter. | `true` |
| `spring.cloud.gateway.global-filter.adapt-cached-body.enabled`  | Enables the adapt-cached-body global filter. | `true` |
| `spring.cloud.gateway.global-filter.forward-path.enabled`  | Enables the forward-path global filter. | `true` |
| `spring.cloud.gateway.global-filter.forward-routing.enabled`  | Enables the forward-routing global filter. | `true` |
| `spring.cloud.gateway.global-filter.load-balancer-client.enabled` | Enables the load-balancer-client global filter. |  `true` |
| `spring.cloud.gateway.global-filter.local-response-cache.enabled` | Enables the local-response-cache filter for all routes, it allows to add a specific configuration at route level using LocalResponseCache filter. | `true` |
| `spring.cloud.gateway.global-filter.netty-routing.enabled` | Enables the netty-routing global filter. | `true` |
| `spring.cloud.gateway.global-filter.netty-write-response.enabled`  | Enables the netty-write-response global filter. | `true` |
| `spring.cloud.gateway.global-filter.reactive-load-balancer-client.enabled` | Enables the reactive-load-balancer-client global filter. |  `true` |
| `spring.cloud.gateway.global-filter.remove-cached-body.enabled` | Enables the remove-cached-body global filter. | `true` |
| `spring.cloud.gateway.global-filter.route-to-request-url.enabled` | Enables the route-to-request-url global filter. | `true` |
| `spring.cloud.gateway.global-filter.websocket-routing.enabled`  | Enables the websocket-routing global filter. | `true` |
| `spring.cloud.gateway.globalcors.add-to-simple-url-handler-mapping` | If global CORS config should be added to the URL handler. | `false` |
| `spring.cloud.gateway.globalcors.cors-configurations` |  N/A  |  N/A |
| `spring.cloud.gateway.redis-rate-limiter.burst-capacity-header`  | The name of the header that returns the burst capacity configuration. | `X-RateLimit-Burst-Capacity` |
| `spring.cloud.gateway.redis-rate-limiter.config` |  N/A  |  N/A |
| `spring.cloud.gateway.redis-rate-limiter.include-headers` | Whether or not to include headers containing rate limiter information, defaults to true. | `true` |
| `spring.cloud.gateway.redis-rate-limiter.remaining-header` | The name of the header that returns number of remaining requests during the current second. | `X-RateLimit-Remaining` |
| `spring.cloud.gateway.redis-rate-limiter.replenish-rate-header` | The name of the header that returns the replenish rate configuration. | `X-RateLimit-Replenish-Rate` |
| `spring.cloud.gateway.redis-rate-limiter.requested-tokens-header`  | The name of the header that returns the requested tokens configuration. | `X-RateLimit-Requested-Tokens` |
| `spring.cloud.gateway.restrictive-property-accessor.enabled`  | Restricts method and property access in SpEL. | `true` |
| `spring.cloud.gateway.predicate.after.enabled`  | Enables the after predicate. | `true` |
| `spring.cloud.gateway.predicate.before.enabled` | Enables the before predicate. | `true` |
| `spring.cloud.gateway.predicate.between.enabled`  | Enables the between predicate. | `true` |
| `spring.cloud.gateway.predicate.cloud-foundry-route-service.enabled` | Enables the cloud-foundry-route-service predicate. | `true` |
| `spring.cloud.gateway.predicate.cookie.enabled` | Enables the cookie predicate. | `true` |
| `spring.cloud.gateway.predicate.header.enabled`  | Enables the header predicate. | `true` |
| `spring.cloud.gateway.predicate.host.enabled` | Enables the host predicate. | `true` |
| `spring.cloud.gateway.predicate.host.include-port` | Include the port in matching the host name. | `true` |
| `spring.cloud.gateway.predicate.method.enabled`| Enables the method predicate. | `true` |
| `spring.cloud.gateway.predicate.path.enabled`  | Enables the path predicate. | `true` |
| `spring.cloud.gateway.predicate.query.enabled`  | Enables the query predicate. | `true` |
| `spring.cloud.gateway.predicate.read-body.enabled` | Enables the read-body predicate. | `true` | 
| `spring.cloud.gateway.predicate.remote-addr.enabled` | Enables the remote-addr predicate. | `true` |
| `spring.cloud.gateway.predicate.weight.enabled` | Enables the weight predicate.  | `true` |
| `spring.cloud.gateway.predicate.xforwarded-remote-addr.enabled` | Enables the xforwarded-remote-addr predicate. | `true` |
| `spring.cloud.gateway.set-status.original-status-header-name` |  The name of the header which contains http code of the proxied request. |  N/A |
| `spring.cloud.gateway.streaming-media-types` |  N/A  |  N/A |
| `spring.cloud.gateway.x-forwarded.enabled` |  If the XForwardedHeadersFilter is enabled. | `true` |
| `spring.cloud.gateway.x-forwarded.for-append`  | If appending X-Forwarded-For as a list is enabled. | `true` |
| `spring.cloud.gateway.x-forwarded.for-enabled`  | If X-Forwarded-For is enabled. | `true` |
| `spring.cloud.gateway.x-forwarded.host-append`  | If appending X-Forwarded-Host as a list is enabled. |  `true` |
| `spring.cloud.gateway.x-forwarded.host-enabled` | If X-Forwarded-Host is enabled. | `true` |
| `spring.cloud.gateway.x-forwarded.order` | The order of the XForwardedHeadersFilter. | `0` |
| `spring.cloud.gateway.x-forwarded.port-append` | If appending X-Forwarded-Port as a list is enabled. | `true` |
| `spring.cloud.gateway.x-forwarded.port-enabled` | If X-Forwarded-Port is enabled. | `true` | 
| `spring.cloud.gateway.x-forwarded.prefix-append`  | If appending X-Forwarded-Prefix as a list is enabled. | `true` |
| `spring.cloud.gateway.x-forwarded.prefix-enabled` | If X-Forwarded-Prefix is enabled. | `true` |
| `spring.cloud.gateway.x-forwarded.proto-append` | If appending X-Forwarded-Proto as a list is enabled. | `true` | 
| `spring.cloud.gateway.x-forwarded.proto-enabled`  | If X-Forwarded-Proto is enabled. | `true` |
| `spring.cloud.gateway.httpclient.compression` | Enables compression for Netty HttpClient. | `false` |
| `spring.cloud.gateway.httpclient.connect-timeout` |  The connect timeout in millis, the default is 30s. |  N/A |
| `spring.cloud.gateway.httpclient.max-header-size` | The max response header size. |  N/A |
| `spring.cloud.gateway.httpclient.max-initial-line-length` | The max initial line length. |  N/A |
| `spring.cloud.gateway.httpclient.pool.acquire-timeout` | Only for type FIXED, the maximum time in millis to wait for acquiring. |  N/A |
| `spring.cloud.gateway.httpclient.pool.eviction-interval`| Perform regular eviction checks in the background at a specified interval. Disabled by default ({@link Duration#ZERO}) | `0` |
| `spring.cloud.gateway.httpclient.pool.max-connections` | Only for type FIXED, the maximum number of connections before starting pending acquisition on existing ones. |  N/A |
| `spring.cloud.gateway.httpclient.pool.max-idle-time` | Time in millis after which the channel will be closed. If NULL, there is no max idle time. |  N/A |
| `spring.cloud.gateway.httpclient.pool.max-life-time` | Duration after which the channel will be closed. If NULL, there is no max life time. |  N/A |
| `spring.cloud.gateway.httpclient.pool.metrics` | Enables channel pools metrics to be collected and registered in Micrometer. Disabled by default. | `false` |
| `spring.cloud.gateway.httpclient.pool.name` | The channel pool map name, defaults to proxy. | `proxy` |
| `spring.cloud.gateway.httpclient.pool.type` | Type of pool for HttpClient to use, defaults to ELASTIC. |  N/A |
| `spring.cloud.gateway.httpclient.response-timeout` | The response timeout. |  N/A |
| `spring.cloud.gateway.httpclient.ssl.close-notify-flush-timeout` | SSL close_notify flush timeout. Default to 3000 ms. | `3000ms` |
| `spring.cloud.gateway.httpclient.ssl.close-notify-read-timeout`| SSL close_notify read timeout. Default to 0 ms. |  `0` |
| `spring.cloud.gateway.httpclient.ssl.handshake-timeout` | SSL handshake timeout. Default to 10000 ms | `10000ms` |
| `spring.cloud.gateway.httpclient.ssl.use-insecure-trust-manager`| Installs the netty InsecureTrustManagerFactory. This is insecure and not suitable for production. |  `false` |
| `spring.cloud.gateway.httpclient.websocket.max-frame-payload-length` | Max frame payload length. |  N/A |
| `spring.cloud.gateway.httpclient.websocket.proxy-ping` | Proxy ping frames to downstream services, defaults to true. | `true` |
| `spring.cloud.gateway.httpclient.wiretap` | Enables wiretap debugging for Netty HttpClient. | `false` |
| `spring.cloud.gateway.httpserver.wiretap` | Enables wiretap debugging for Netty HttpServer. | `false` |
| `spring.cloud.gateway.metrics.enabled` | Enables the collection of metrics data. | `false` |
| `spring.cloud.gateway.metrics.prefix` | The prefix of all metrics emitted by gateway. | `spring.cloud.gateway` |
| `spring.cloud.gateway.metrics.tags` | Tags map that added to metrics. |  N/A |
| `spring.cloud.gateway.observability.enabled` | If Micrometer Observability support should be turned on.  | `true` |

### Common configurations

- Logging related configurations:
  - [**logging.level.***](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-levels)
  - [**logging.group.***](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-groups)
  - Any other configurations under `logging.*` namespace should be forbidden. For example, writing log files by using `logging.file` should be forbidden.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Connect to a managed Gateway for Spring in Azure Container Apps (preview)](java-gateway-for-spring.md)