---
title: "Manage and monitor app with Spring Boot Actuator"
description: Learn how to manage and monitor app with Spring Boot Actuator.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: conceptual
ms.date: 05/06/2022
ms.custom: devx-track-java
---

# Manage and monitor app with Spring Boot Actuator

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

## What's Spring Boot Actuator?

Spring Boot Actuator brings production-ready features to your apps. You can effortlessly monitor your app, collect metrics, and understand its status or database activity with this tool. The big plus is that you gain access to professional-grade tools without needing to build them from scratch.

The Actuator exposes vital operational data about your running application—like health status, metrics, information, and more—via HTTP endpoints or Java Management Extensions (JMX), making it easy to interact with. Once integrated, it provides several default endpoints, and like other Spring modules, it's highly configurable and extendable.

In Azure Spring Apps service, actuator is used for enriching metrics via JMX. It can also work with Application Live View in Enterprise plan to enable you to get and interact with the data from apps.

:::image type="content" source="media/concept-manage-monitor-app-spring-boot-actuator/data-flow.png" alt-text="Diagram of data flow via actuator." lightbox="media/concept-manage-monitor-app-spring-boot-actuator/data-flow.png":::

## How to configure actuator?

### Add actuator dependency

To add the actuator to a Maven-based project, add the 'Starter' dependency:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>
```

Please note this holds true for any Boot version since versions are outlined in the Spring Boot Bill of Materials (BOM).

### Configure actuator endpoint

By default, Spring Boot application exposes `health` endpoint only.

To observe the configuration and configurable environment, we need to enable `env` and `configprops` endpoints as well.

1. Go to app **Overview** pane, select **Configuration** in the setting menu, go to the **Environment variables** configuration page.
1. Add the following properties as in the "key:value" form. This environment will open the Spring Actuator endpoint `env` and `configprops` in addition to `health`.

   ```properties
   management.endpoints.web.exposure.include: health,env,configprops
   ```

1. Select the **Save** button, your application will restart automatically and load the new environment variables.

You can now go back to the app overview pane and wait until the Provisioning Status changes to "Succeeded".

To view all the endpoints built-in and related configurations, see [Exposing Endpoints](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-endpoints-exposing-endpoints)

## Secure actuator endpoint

Once you expose the app to public, these actuator endpoints are exposed to public as well. You are recommended to hide all endpoints by setting `management.endpoints.web.exposure.exclude=*` because `exclude` property takes precedence over the `include` property. A side effect is Application Live View in Enterprise plan or other apps or tools relying on actuator HTTP endpoint are blocked.

In Enterprise plan, you can disable public endpoint of app and configure fine-designed routing rule in [Spring Cloud Gateway for VMware Tanzu](./how-to-configure-enterprise-spring-cloud-gateway.md) to disable actuator access from public.

## Next steps

* [Understand metrics for Azure Spring Apps](./concept-metrics.md)
* [Understanding app status in Azure Spring Apps](./concept-app-status.md)
