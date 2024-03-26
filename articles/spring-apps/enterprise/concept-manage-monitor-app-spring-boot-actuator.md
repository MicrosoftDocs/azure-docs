---
title: "Manage and monitor app with Spring Boot Actuator"
description: Learn how to manage and monitor app with Spring Boot Actuator.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: conceptual
ms.date: 03/26/2024
ms.custom: devx-track-java
---

# Manage and monitor app with Spring Boot Actuator

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

Spring Boot Actuator brings production-ready features to your apps. You can effortlessly monitor your app, collect metrics, and understand the status or database activity with this tool. Most importantly, you can gain access to professional-grade tools without needing to build them from scratch.

The actuator exposes vital operational data about your running application, like health status, metrics, information, and more by using the HTTP endpoints or Java Management Extensions (JMX), making it easy to interact with. Once integrated, it provides several default endpoints, and like other Spring modules, it's easily configurable and extendable.

In Azure Spring Apps service instance, actuator is used for enriching metrics by using JMX. It can also work with Application Live View in Enterprise plan to help you get and interact with the data from apps.

:::image type="content" source="media/concept-manage-monitor-app-spring-boot-actuator/data-flow.png" alt-text="Diagram that shows the data flow using Spring Boot Actuator." lightbox="media/concept-manage-monitor-app-spring-boot-actuator/data-flow.png":::

## Configure Spring Boot Actuator

### Add actuator dependency

To add the actuator to a Maven-based project, add the `Starter` dependency:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>
```

This configuration holds true for any Spring Boot version as versions are outlined in the Spring Boot Bill of Materials (BOM).

### Configure actuator endpoint

By default, Spring Boot application exposes the `health` endpoint only.

To observe the configuration and configurable environment, you need to enable `env` and `configprops` endpoints as well.

1. Go to app **Overview** pane, select **Configuration** in the setting menu, and then go to the **Environment variables** configuration page.
1. Add the following properties as in the "key:value" form. This environment opens the following Spring Actuator endpoints: `health`, `env`, and `configprops`.

   ```properties
   management.endpoints.web.exposure.include: health,env,configprops
   ```

1. Select **Save**. Your application restarts automatically and loads the new environment variables.

You can now go back to the app **Overview** pane and wait until the Provisioning Status changes to **Succeeded**.

To view all the endpoints built-in and related configurations, see the [Exposing Endpoints](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-endpoints-exposing-endpoints) section of [Spring Boot Production-ready Features](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html).

## Secure actuator endpoint

When you open the app to public, these actuator endpoints are exposed to public as well. To hide all endpoints, set `management.endpoints.web.exposure.exclude=*`, because `exclude` property takes precedence over the `include` property. This action might block Application Live View in Enterprise plan, or other apps or tools relying on the actuator HTTP endpoint.

In the Enterprise plan, you can disable public endpoint of apps and configure VMware Spring Cloud Gateway to disable actuator access from public. For more informarion, see [Configure VMware Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md) 

## Next steps

* [Metrics for Azure Spring Apps](./concept-metrics.md)
* [App status in Azure Spring Apps](./concept-app-status.md)
