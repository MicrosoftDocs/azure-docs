---
title: Configure settings for the Admin for Spring component in Azure Container Apps (preview)
description: Learn to configure the Admin for Spring component in Azure Container Apps.
services: container-apps
author: 
ms.service: container-apps
ms.topic: conceptual
ms.date: 05/24/2024
ms.author: 
---

# Configure settings for the Admin for Spring component in Azure Container Apps (preview)

The Admin for Spring managed component offers an administrative interface for Spring Boot web applications that expose actuator endpoints. Use the following guidance to learn how to configure and manage your Admin for Spring component.

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

Before you run the following command, replace placeholders surrounded by `<>` with your values. And the supported configurations are listed in the [table](#allowed-configuration-list-for-your-admin-for-spring).

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

For Container App that wants to connect to the Admin for Spring, you need to add the following dependency in your `pom.xml` file.

```xml
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-client</artifactId>
</dependency>
```

## Allowed configuration list for your Admin for Spring

The following list details supported configurations. You can find more details in [Spring Boot Admin](https://docs.spring-boot-admin.com/current/server.html).


| **Property name**                                               | **Description**                                                  | **Default value**                                                |
| ------------------------------------ | ----------------------------------------------- | ----------------- |
| spring.boot.admin.server.enabled                            | Enables the Spring Boot Admin Server.                        | `true`                                                       |
| spring.boot.admin.context-path                              | The context-path prefixes the path where the Admin Server’s statics assets and API should be served. Relative to the Dispatcher-Servlet. |                                                              |
| spring.boot.admin.monitor.status-interval                   | Time interval to check the status of instances.              | 10,000ms                                                     |
| spring.boot.admin.monitor.status-lifetime                   | Lifetime of status. The status won’t be updated as long the last status isn’t expired. | 10,000ms                                                     |
| spring.boot.admin.monitor.info-interval                     | Time interval to check the info of instances.                | 1m                                                           |
| spring.boot.admin.monitor.info-lifetime                     | Lifetime of info. The info won’t be updated as long the last info isn’t expired. | 1m                                                           |
| spring.boot.admin.monitor.default-timeout                   | Default timeout when making requests. Individual values for specific endpoints can be overridden using `spring.boot.admin.monitor.timeout.*`. | 10,000                                                       |
| spring.boot.admin.monitor.timeout.*                         | Key-Value-Pairs with the timeout per endpointId. Defaults to default-timeout. |                                                              |
| spring.boot.admin.monitor.default-retries                   | Default number of retries for failed requests. Modifying requests (`PUT`, `POST`, `PATCH`, `DELETE`) are never retried. Individual values for specific endpoints can be overridden using `spring.boot.admin.monitor.retries.*`. | 0                                                            |
| spring.boot.admin.monitor.retries.*                         | Key-Value-Pairs with the number of retries per endpointId. Defaults to default-retries. Modifying requests (`PUT`, `POST`, `PATCH`, `DELETE`) are never retried. |                                                              |
| spring.boot.admin.metadata-keys-to-sanitize                 | Metadata values for the keys matching these regex patterns will be sanitized in all json output.Starting from Spring Boot 3, all actuator values are masked by default.Take a look at the Spring Boot documentation in order to configure unsanitizing of values ([Sanitize Sensitive Values](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto.actuator.sanitize-sensitive-values)). | `".**password$", ".\*secret$", ".\*key$", ".\*token$", ".\*credentials.**", ".*vcap_services$"` |
| spring.boot.admin.probed-endpoints                          | For Spring Boot 1.x client applications SBA probes for the specified endpoints using an OPTIONS request. If the path differs from the id you can specify this as id:path (e.g. health:ping).. | `"health", "env", "metrics", "httptrace:trace", "threaddump:dump", "jolokia", "info", "logfile", "refresh", "flyway", "liquibase", "heapdump", "loggers", "auditevents"` |
| spring.boot.admin.instance-proxy.ignored-headers            | Headers not to be forwarded when making requests to clients. | `"Cookie", "Set-Cookie", "Authorization"`                    |
| spring.boot.admin.ui.title                                  | Page-Title to be shown.                                      | `"Spring Boot Admin"`                                        |
| spring.boot.admin.ui.poll-timer.cache                       | Polling duration in ms to fetch new cache data.              | `2500`                                                       |
| spring.boot.admin.ui.poll-timer.datasource                  | Polling duration in ms to fetch new datasource data.         | `2500`                                                       |
| spring.boot.admin.ui.poll-timer.gc                          | Polling duration in ms to fetch new gc data.                 | `2500`                                                       |
| spring.boot.admin.ui.poll-timer.process                     | Polling duration in ms to fetch new process data.            | `2500`                                                       |
| spring.boot.admin.ui.poll-timer.memory                      | Polling duration in ms to fetch new memory data.             | `2500`                                                       |
| spring.boot.admin.ui.poll-timer.threads                     | Polling duration in ms to fetch new threads data.            | `2500`                                                       |
| spring.boot.admin.ui.poll-timer.logfile                     | Polling duration in ms to fetch new logfile data.            | `1000`                                                       |
| spring.boot.admin.ui.enable-toasts                          | Allows to enable toast notifications.                        | `false`                                                      |
|spring.boot.admin.ui.title| Use this option to customize the browsers window title| ""|
|spring.boot.admin.ui.brand| This HTML snippet is rendered in navigation header and defaults to Spring Boot Admin label. By default it shows the SBA logo followed by it’s name.| ""|
| management.scheme       | The scheme is substituted in the service URL and will be used for accessing the actuator endpoints. |                                                              |
| management.address      | The address is substituted in the service URL and will be used for accessing the actuator endpoints. |                                                              |
| management.port         | The port is substituted in the service URL and will be used for accessing the actuator endpoints. |                                                              |
| management.context-path | The path is appended to the service URL and will be used for accessing the actuator endpoints. | `${spring.boot.admin.discovery.converter.management-context-path}` |
| health.path             | The path is appended to the service URL and will be used for the health-checking. Ignored by the `EurekaServiceInstanceConverter`. | `${spring.boot.admin.discovery.converter.health-endpoint}`   |
| spring.boot.admin.discovery.enabled                          | Enables the DiscoveryClient-support for the admin server.    | `true`        |
| spring.boot.admin.discovery.converter.management-context-path | Will be appended to the service-url of the discovered service when the management-url is converted by the `DefaultServiceInstanceConverter`. | `/actuator`   |
| spring.boot.admin.discovery.converter.health-endpoint-path   | Will be appended to the management-url of the discovered service when the health-url is converted by the `DefaultServiceInstanceConverter`. | `"health"`    |
| spring.boot.admin.discovery.ignored-services                 | This services will be ignored when using discovery and not registered as application. Supports simple patterns (e.g. "foo*", "*bar", "foo*bar*"). |               |
| spring.boot.admin.discovery.services                         | This services will be included when using discovery and registered as application. Supports simple patterns (e.g. "foo*", "*bar", "foo*bar*"). | `"*"`         |
| spring.boot.admin.discovery.ignored-instances-metadata       | Instances of services will be ignored if they contain at least one metadata item that matches this list. (e.g. "discoverable=false") |               |
| spring.boot.admin.discovery.instances-metadata               | Instances of services will be included if they contain at least one metadata item that matches this list. (e.g. "discoverable=true") |      

### Common configurations

- logging related configurations
  - [**logging.level.***](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-levels) 
  - [**logging.group.***](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-groups)
  - Any other configurations under logging.* namespace should be forbidden, for example, writing log files by using `logging.file` should be forbidden.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Connect to a managed Admin for Spring](java-admin.md)
> [Tutorial: Integrate the managed Admin for Spring with Eureka Server for Spring](java-admin-eureka-integration.md)
