---
title: Configure settings for the Spring Cloud Eureka Server component in Azure Container Apps (preview)
description: Learn to configure the Spring Cloud Eureka Server component in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/15/2024
ms.author: cshoe
---

# Configure settings for the Spring Cloud Eureka Server component in Azure Container Apps (preview)

Spring Cloud Eureka Server is mechanism for centralized service discovery for microservices. Use the following guidance to learn how to configure and manage your Spring Cloud Eureka Server component.

## Show

You can view the details of an individual component by name using the `show` command.

Before you run the following command, replace placeholders surrounded by `<>` with your values.

```azurecli
az containerapp env java-component spring-cloud-eureka show \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --name <JAVA_COMPONENT_NAME>
```

## List

You can list all registered Java components using the `list` command.

Before you run the following command, replace placeholders surrounded by `<>` with your values.

```azurecli
az containerapp env java-component list \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP>
```

## Unbind

To remove a binding from a container app, use the `--unbind` option.

Before you run the following command, replace placeholders surrounded by `<>` with your values.

``` azurecli
az containerapp update \
  --name <APP_NAME> \
  --unbind <JAVA_COMPONENT_NAME> \
  --resource-group <RESOURCE_GROUP>
```

## Allowed configuration list for your Spring Cloud Eureka

The following list details supported configurations. You can find more details in [Spring Cloud Eureka Server](https://cloud.spring.io/spring-cloud-netflix/reference/html/#spring-cloud-eureka-server).

> [!NOTE]
> Please submit support tickets for new feature requests.

### Configuration options

The `az containerapp update` command uses the `--configuration` parameter to control how the Spring Cloud Eureka Server is configured. You can use multiple parameters at once as long as they're separated by a space. You can find more details in [Spring Cloud Eureka Server](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_discovery_first_bootstrap_using_eureka_and_webclient) docs.

The following configuration settings are available on the `eureka.server` configuration property.

| Name | Description | Default Value|
|--|--|--|
| `enable-self-preservation` | When enabled, the server keeps track of the number of renewals it should receive from the server. Anytime, the number of renewals drops below the threshold percentage as defined by `renewal-percent-threshold`. The default value is set to `true` in the original Eureka server, but in the Eureka Server Java component, the default value is set to `false`. See [Limitations of Spring Cloud Eureka Java component](#limitations)  | `false` |
| `renewal-percent-threshold` | The minimum percentage of renewals expected from the clients in the period specified by `renewal-threshold-update-interval-ms`. If renewals drop below the threshold, expirations are disabled when `enable-self-preservation` is enabled. | `0.85` |
| `renewal-threshold-update-interval-ms` | The interval at which the threshold as specified in `renewal-percent-threshold` is updated. | `0` |
| `expected-client-renewal-interval-seconds` | The interval at which clients are expected to send their heartbeats. The default value is to `30` seconds. If clients send heartbeats at a different frequency, make this value match the sending frequency to ensure self-preservation works as expected. | `30` |
| `response-cache-auto-expiration-in-seconds` | Gets the time the registry payload is kept in the cache when not invalidated by change events. | `180` |
| `response-cache-update-interval-ms` | Gets the time interval the payload cache of the client is updated.| `0` |
| `use-read-only-response-cache` | The `com.netflix.eureka.registry.ResponseCache` uses a two level caching strategy to responses. A `readWrite` cache with an expiration policy, and a `readonly` cache that caches without expiry.| `true` |
| `disable-delta` | Checks to see if the delta information is served to client or not. | `false` |
| `retention-time-in-m-s-in-delta-queue` | Gets the time delta information is cached for the clients to retrieve the value without missing it. | `0` |
| `delta-retention-timer-interval-in-ms` | Get the time interval the cleanup task wakes up to check for expired delta information. | `0` |
| `eviction-interval-timer-in-ms` | Gets the time interval the task that expires instances wakes up and runs.| `60000` |
| `sync-when-timestamp-differs` | Checks whether to synchronize instances when timestamp differs. | `true` |
| `rate-limiter-enabled` | Indicates whether the rate limiter is enabled or disabled. | `false` |
| `rate-limiter-burst-size`  | The rate limiter, token bucket algorithm property. | 10 |
| `rate-limiter-registry-fetch-average-rate` | The rate limiter, token bucket algorithm property. Specifies the average enforced request rate. | `500` |
| `rate-limiter-privileged-clients` | List of certified clients is in addition to standard Eureka Java clients. | N/A |
| `rate-limiter-throttle-standard-clients` | Indicates if rate limit standard clients. If set to `false`, only nonstandard clients are rate limited. | `false` |
| `rate-limiter-full-fetch-average-rate` | Rate limiter, token bucket algorithm property. Specifies the average enforced request rate. | `100` |

### Common configurations

- logging related configurations
  - [**logging.level.***](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-levels) 
  - [**logging.group.***](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-groups)
  - Any other configurations under logging.* namespace should be forbidden, for example, writing log files by using `logging.file` should be forbidden.

## Call between applications

This example shows you how to write Java code to call between applications registered with the Spring Cloud Eureka component. When container apps are bound with Eureka, they communicate with each other through the Eureka server.

The example creates two applications, a caller and a callee. Both applications communicate among each other using the Spring Cloud Eureka component. The callee application exposes an endpoint that is called by the caller application.

1. Create the callee application. Enable the Eureka client in your Spring Boot application by adding the `@EnableDiscoveryClient` annotation to your main class.

    ```java
    @SpringBootApplication
    @EnableDiscoveryClient
    public class CalleeApplication {
    	public static void main(String[] args) {
    		SpringApplication.run(CalleeApplication.class, args);
    	}
    }
    ````

1. Create an endpoint in the callee application that is called by the caller application.

    ```java
    @RestController
    public class CalleeController {
    
        @GetMapping("/call")
        public String calledByCaller() {
            return "Hello from Application callee!";
        }
    }
    ```

1. Set the callee application's name in the application configuration file. For example, *application.yml*.

    ```yaml
    spring.application.name=callee
    ```

1. Create the caller application.

    Add the `@EnableDiscoveryClient` annotation to enable Eureka client functionality. Also, create a `WebClient.Builder` bean with the `@LoadBalanced` annotation to perform load-balanced calls to other services.

    ```java
    @SpringBootApplication
    @EnableDiscoveryClient
    public class CallerApplication {
    	public static void main(String[] args) {
    		SpringApplication.run(CallerApplication.class, args);
    	}
    
    	@Bean
    	@LoadBalanced
    	public WebClient.Builder loadBalancedWebClientBuilder() {
    		return WebClient.builder();
    	}
    }
    ```

1. Create a controller in the caller application that uses the `WebClient.Builder` to call the callee application using its application name, callee.

    ```java
    @RestController
    public class CallerController { 
        @Autowired
        private WebClient.Builder webClientBuilder;
     
        @GetMapping("/call-callee")
        public Mono<String> callCallee() {
            return webClientBuilder.build()
                .get()
                .uri("http://callee/call")
                .retrieve()
                .bodyToMono(String.class);
        }
    }
    ```

Now you have a caller and callee application that communicate with each other using Spring Cloud Eureka Java components. Make sure both applications are running and bind with the Eureka server before testing the `/call-callee` endpoint in the caller application.

## Limitations

- The Eureka Server Java component comes with a default configuration, `eureka.server.enable-self-preservation`, set to `false`. This default configuration helps avoid times when instances aren't deleted after self-preservation is enabled. If instances are deleted too early, some requests might be directed to nonexistent instances. If you want to change this setting to `true`, you can overwrite it by setting your own configurations in the Java component.

- The Eureka server has only a single replica and doesn't support scaling, making the peer Eureka server feature unavailable.

- The Eureka dashboard isn't available.

## Next steps

> [!div class="nextstepaction"]
> [Use Spring Cloud Eureka Server](spring-cloud-eureka-server.md)
