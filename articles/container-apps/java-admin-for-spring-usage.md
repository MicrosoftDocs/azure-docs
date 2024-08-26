---
title: Configure settings for the Admin for Spring component in Azure Container Apps (preview)
description: Learn to configure the Admin for Spring component in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 07/15/2024
ms.author: cshoe
---

# Configure the Spring Boot Admin component in Azure Container Apps

The Admin for Spring managed component offers an administrative interface for Spring Boot web applications that expose actuator endpoints. This article shows you how to configure and manage your Spring component.

## Show

You can view the details of an individual component by name using the `show` command.

Before you run the following command, replace placeholders surrounded by `<>` with your values.

```azurecli
az containerapp env java-component admin-for-spring show \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --name <JAVA_COMPONENT_NAME>
```

## Update

You can update the configuration of an Admin for Spring component using the `update` command.

Before you run the following command, replace placeholders surrounded by `<>` with your values. Supported configurations are listed in the [properties list table](#configurable-properties).

```azurecli
az containerapp env java-component admin-for-spring update \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --name <JAVA_COMPONENT_NAME> \
  --configuration <CONFIGURATION_KEY>="<CONFIGURATION_VALUE>"
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

## Dependency

When you use the admin component in your container app, you need to add the following dependency in your `pom.xml` file. Replace the version number with the latest version available on the [Maven Repository](https://search.maven.org/artifact/de.codecentric/spring-boot-admin-starter-client).

```xml
<dependency>
    <groupId>de.codecentric</groupId>
    <version>3.3.2</version>
    <artifactId>spring-boot-admin-starter-client</artifactId>
</dependency>
```

## Configurable properties

Starting with Spring Boot 2, endpoints other than health and info are not exposed by default. You can expose them by adding the following configuration in your `application.properties` file.

```properties
management.endpoints.web.exposure.include=*
management.endpoint.health.show-details=always
```

## Allowed configuration list for your Admin for Spring

The following list details the admin component properties you can configure for your app. You can find more details in [Spring Boot Admin](https://docs.spring-boot-admin.com/current/server.html) docs.

| Property name | Description | Default value |
|--|--|--|
| `spring.boot.admin.server.enabled` | Enables the Spring Boot Admin Server. | `true` |
| `spring.boot.admin.context-path` | The path prefix where the Admin Server’s statics assets and API are served. Relative to the Dispatcher-Servlet. |  |
| `spring.boot.admin.monitor.status-interval` | Time interval in milliseconds to check the status of instances. | `10,000ms` |
| `spring.boot.admin.monitor.status-lifetime` | Lifetime of status in milliseconds. The status isn't updated as long the last status isn’t expired. | 10,000 ms |
| `spring.boot.admin.monitor.info-interval` | Time interval in milliseconds to check the info of instances. | `1m` |
| `spring.boot.admin.monitor.info-lifetime` | Lifetime of info in minutes. The info isn't as long the last info isn’t expired. | `1m` |
| `spring.boot.admin.monitor.default-timeout` | Default timeout when making requests. Individual values for specific endpoints can be overridden using `spring.boot.admin.monitor.timeout.*`. | `10,000` |
| `spring.boot.admin.monitor.timeout.*` | Key-value pairs with the timeout per `endpointId`. | Defaults to `default-timeout` value. |
| `spring.boot.admin.monitor.default-retries` | Default number of retries for failed requests. Requests that modify data (`PUT`, `POST`, `PATCH`, `DELETE`) are never retried. Individual values for specific endpoints can be overridden using `spring.boot.admin.monitor.retries.*`. | `0` |
| `spring.boot.admin.monitor.retries.*` | Key-value pairs with the number of retries per `endpointId`. Requests that modify data (`PUT`, `POST`, `PATCH`, `DELETE`) are never retried. | Defaults to `default-retries` value. |
| `spring.boot.admin.metadata-keys-to-sanitize` | Metadata values for the keys matching these regex patterns used to  sanitize in all JSON output. Starting from Spring Boot 3, all actuator values are masked by default. For more information about how to configure the unsanitization process, see ([Sanitize Sensitive Values](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto.actuator.sanitize-sensitive-values)). | `".**password$", ".\*secret$", ".\*key$", ".\*token$", ".\*credentials.**", ".*vcap_services$"` |
| `spring.boot.admin.probed-endpoints` | For Spring Boot 1.x client applications Spring Boot Admin probes for the specified endpoints using an `OPTIONS` request. If the path differs from the ID, you can specify this value as `id:path` (for example: `health:ping`) | `"health", "env", "metrics", "httptrace:trace", "threaddump:dump", "jolokia", "info", "logfile", "refresh", "flyway", "liquibase", "heapdump", "loggers", "auditevents"` |
| `spring.boot.admin.instance-proxy.ignored-headers` | Headers not to forwarded when making requests to clients. | `"Cookie", "Set-Cookie", "Authorization"` |
| `spring.boot.admin.ui.title` | The displayed page title. | `"Spring Boot Admin"` |
| `spring.boot.admin.ui.poll-timer.cache` | Polling duration in milliseconds to fetch new cache data. | `2500` |
| `spring.boot.admin.ui.poll-timer.datasource` | Polling duration in milliseconds to fetch new data source data. | `2500` |
| `spring.boot.admin.ui.poll-timer.gc` | Polling duration in milliseconds to fetch new gc data. | `2500` |
| `spring.boot.admin.ui.poll-timer.process` | Polling duration in milliseconds to fetch new process data. | `2500` |
| `spring.boot.admin.ui.poll-timer.memory` | Polling duration in milliseconds to fetch new memory data. | `2500` |
| `spring.boot.admin.ui.poll-timer.threads` | Polling duration in milliseconds to fetch new threads data. | `2500` |
| `spring.boot.admin.ui.poll-timer.logfile` | Polling duration in milliseconds to fetch new logfile data. | `1000` |
| `spring.boot.admin.ui.enable-toasts` | Enables or disables toast notifications. | `false` |
| `spring.boot.admin.ui.title` | Browser's window title value. | "" |
| `spring.boot.admin.ui.brand` | HTML code rendered in the navigation header and defaults to the Spring Boot Admin label. By default the Spring Boot Admin logo is followed by its name. | "" |
| `management.scheme` | Value that is substituted in the service URL used for accessing the actuator endpoints. |  |
| `management.address` | Value that is substituted in the service URL used for accessing the actuator endpoints. |  |
| `management.port` | Value that is substituted in the service URL used for accessing the actuator endpoints. |  |
| `management.context-path` | Value that is appended to the service URL used for accessing the actuator endpoints. | `${spring.boot.admin.discovery.converter.management-context-path}` |
| `health.path` | Value that is appended to the service URL used for health checking. Ignored by the `EurekaServiceInstanceConverter`. | `${spring.boot.admin.discovery.converter.health-endpoint}` |
| `spring.boot.admin.discovery.enabled` | Enables the `DiscoveryClient` support for the admin server. | `true` |
| `spring.boot.admin.discovery.converter.management-context-path` | Value that is appended to the `service-url` of the discovered service when the `management-url` value is converted by the `DefaultServiceInstanceConverter`. | `/actuator` |
| `spring.boot.admin.discovery.converter.health-endpoint-path` | Value that is appended to the `management-url` of the discovered service when the `health-url` value is converted by the `DefaultServiceInstanceConverter`. | `"health"` |
| `spring.boot.admin.discovery.ignored-services` | Services that are ignored when using discovery and not registered as application. Supports simple patterns such as `"foo*"`, `"*bar"`, `"foo*bar*"`. |  |
| `spring.boot.admin.discovery.services` | Services included when using discovery and registered as application. Supports simple patterns such as `"foo*"`, `"*bar"`, `"foo*bar*"`. | `"*"` |
| `spring.boot.admin.discovery.ignored-instances-metadata` | Services ignored if they contain at least one metadata item that matches patterns in this list. Supports patterns such as `"discoverable=false"`. |  |
| `spring.boot.admin.discovery.instances-metadata` | Services included if they contain at least one metadata item that matches patterns in list. Supports patterns such as `"discoverable=true"`. | |

### Common configurations

- Logging related configurations:
  - [**logging.level.***](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-levels)
  - [**logging.group.***](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-groups)
  - Any other configurations under `logging.*` namespace should be forbidden. For example, writing log files by using `logging.file` should be forbidden.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Connect to a managed Admin for Spring](java-admin.md)

## Related content

- [Tutorial: Integrate the managed Admin for Spring with Eureka Server for Spring](java-admin-eureka-integration.md)
