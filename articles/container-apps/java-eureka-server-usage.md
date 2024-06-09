---
title: Configure settings for the Eureka Server for Spring component in Azure Container Apps (preview)
description: Learn to configure the Eureka Server for Spring component in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/15/2024
ms.author: cshoe
---

# Configure settings for the Eureka Server for Spring component in Azure Container Apps (preview)

Eureka Server for Spring is mechanism for centralized service discovery for microservices. Use the following guidance to learn how to configure and manage your Eureka Server for Spring component.

## Show

You can view the details of an individual component by name using the `show` command.

Before you run the following command, replace placeholders surrounded by `<>` with your values.

```azurecli
az containerapp env java-component eureka-server-for-spring show \
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

## Allowed configuration list for your Eureka Server for Spring

The following list details supported configurations. You can find more details in [Spring Cloud Eureka Server](https://cloud.spring.io/spring-cloud-netflix/reference/html/#spring-cloud-eureka-server).

> [!NOTE]
> Please submit support tickets for new feature requests.

### Configuration options

The `az containerapp update` command uses the `--configuration` parameter to control how the Eureka Server for Spring is configured. You can use multiple parameters at once as long as they're separated by a space. You can find more details in [Spring Cloud Eureka Server](https://cloud.spring.io/spring-cloud-netflix/reference/html/#spring-cloud-eureka-server) docs.

The following configuration settings are available on the `eureka.server` configuration property.

| Name | Description | Default value |
|--|--|--|
| `eureka.server.enable-self-preservation` | When enabled, the server keeps track of the number of renewals it should receive from the server. Any time, the number of renewals drops below the threshold percentage as defined by eureka.server.renewal-percent-threshold. The default value is set to `true` in the original Eureka server, but in the Eureka Server Java component, the default value is set to `false`. See [Limitations of Eureka Server for Spring Java component](#limitations)  | false |
| `eureka.server.renewal-percent-threshold`| The minimum percentage of renewals that is expected from the clients in the period specified by eureka.server.renewal-threshold-update-interval-ms. If the renewals drop below the threshold, the expirations are disabled if the eureka.server.enable-self-preservation is enabled. | 0.85 |
| `eureka.server.renewal-threshold-update-interval-ms` | The interval with which the threshold as specified in eureka.server.renewal-percent-threshold needs to be updated. | 0 |
| `eureka.server.expected-client-renewal-interval-seconds` | The interval with which clients are expected to send their heartbeats. Defaults to 30 seconds. If clients send heartbeats with different frequency, say, every 15 seconds, then this parameter should be tuned accordingly, otherwise, self-preservation won't work as expected. | 30 |
| `eureka.server.response-cache-auto-expiration-in-seconds`| Gets the time for which the registry payload should be kept in the cache if it is not invalidated by change events. | 180|
| `eureka.server.response-cache-update-interval-ms` | Gets the time interval with which the payload cache of the client should be updated.| 0 |
| `eureka.server.use-read-only-response-cache`| The com.netflix.eureka.registry.ResponseCache currently uses a two level caching strategy to responses. A readWrite cache with an expiration policy, and a readonly cache that caches without expiry.| true |
| `eureka.server.disable-delta`| Checks to see if the delta information can be served to client or not. | false |
| `eureka.server.retention-time-in-m-s-in-delta-queue`| Get the time for which the delta information should be cached for the clients to retrieve the value without missing it.| 0 |
| `eureka.server.delta-retention-timer-interval-in-ms` | Get the time interval with which the clean up task should wake up and check for expired delta information. | 0 |
| `eureka.server.eviction-interval-timer-in-ms` | Get the time interval with which the task that expires instances should wake up and run.| 60000|
| `eureka.server.sync-when-timestamp-differs` | Checks whether to synchronize instances when timestamp differs. | true |
| `eureka.server.rate-limiter-enabled` | Indicates whether the rate limiter should be enabled or disabled. | false |
| `eureka.server.rate-limiter-burst-size`  | Rate limiter, token bucket algorithm property. | 10 |
| `eureka.server.rate-limiter-registry-fetch-average-rate`| Rate limiter, token bucket algorithm property. Specifies the average enforced request rate. | 500 |
| `eureka.server.rate-limiter-privileged-clients` | A list of certified clients. This is in addition to standard eureka Java clients. | N/A |
| `eureka.server.rate-limiter-throttle-standard-clients` | Indicate if rate limit standard clients. If set to false, only non standard clients will be rate limited. | false |
| `eureka.server.rate-limiter-full-fetch-average-rate` | Rate limiter, token bucket algorithm property. Specifies the average enforced request rate. | 100 |

### Common configurations

- logging related configurations
  - [**logging.level.***](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-levels) 
  - [**logging.group.***](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-groups)
  - Any other configurations under logging.* namespace should be forbidden, for example, writing log files by using `logging.file` should be forbidden.

## Call between applications

This example shows you how to write Java code to call between applications registered with the Eureka Server for Spring component. When container apps are bound with Eureka, they communicate with each other through the Eureka server.

The example creates two applications, a caller and a callee. Both applications communicate among each other using the Eureka Server for Spring component. The callee application exposes an endpoint that is called by the caller application.

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

Now you have a caller and callee application that communicate with each other using Eureka Server for Spring Java components. Make sure both applications are running and bind with the Eureka server before testing the `/call-callee` endpoint in the caller application.

## Limitations

- The Eureka Server Java component comes with a default configuration, `eureka.server.enable-self-preservation`, set to `false`. This default configuration helps avoid times when instances aren't deleted after self-preservation is enabled. If instances are deleted too early, some requests might be directed to nonexistent instances. If you want to change this setting to `true`, you can overwrite it by setting your own configurations in the Java component.

- The Eureka server has only a single replica and doesn't support scaling, making the peer Eureka server feature unavailable.

- The Eureka dashboard isn't available.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Connect to a managed Eureka Server for Spring](java-eureka-server.md)
