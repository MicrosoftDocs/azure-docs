---
title: "Manage and monitor app with Spring Boot Actuator"
description: Learn how to manage and monitor app with Spring Boot Actuator.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: conceptual
ms.date: 05/06/2022
ms.custom: devx-track-java, event-tier1-build-2022
---

# Manage and monitor app with Spring Boot Actuator

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

After deploying new binary to your app, you may want to check the functionality and see information about your running application. This article explains how to access the API from a test endpoint provided by Azure Spring Apps and expose the production-ready features for your app.

## Prerequisites

This article assumes that you have a Spring Boot 2.x application that can be successfully deployed and booted on Azure Spring Apps service.  See [Quickstart: Launch an existing application in Azure Spring Apps using the Azure portal](./quickstart.md)

## Verify app through test endpoint

1. Go to **Application dashboard** and select your app to enter the app overview page.

1. In the **Overview** pane, you should see **Test Endpoint**.  Access this endpoint from command line or browser and observe the API response.

1. Note the **Test endpoint** URI that will be used in the coming section.

>[!TIP]
> * If the app returns a front-end page and references other files through relative path, confirm that your test endpoint ends with a slash (/). This will ensure that the CSS file is loaded correctly.
> * If you view your API from a brower and your browser requires you to enter login credentials to view the page, use [URL decode](https://www.urldecoder.org/) to decode your test endpoint. URL decode returns a URL in the form "https://\<username>:\<password>@\<cluster-name>.test.azureapps.io/\<app-name>/\<deployment-name>".  Use this form to access your endpoint.

## Add actuator dependency

To add the actuator to a Maven-based project, add the 'Starter' dependency:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>
```

Compile the new binary and deploy it to your app.

## Enable production-ready features

Actuator endpoints let you monitor and interact with your application. By default, Spring Boot application exposes `health` and `info` endpoints to show arbitrary application info and health information.

To observe the configuration and configurable environment, we need to enable `env` and `configgrops` endpoints as well.

1. Go to app **Overview** pane, select **Configuration** in the setting menu, go to the **Environment variables** configuration page.
1. Add the following properties as in the "key:value" form. This environment will open the Spring Actuator endpoint "health".

   ```properties
   management.endpoints.web.exposure.include: health
   ```

1. Select the **Save** button, your application will restart automatically and load the new environment variables.

You can now go back to the app overview pane and wait until the Provisioning Status changes to "Succeeded".  There will be more than one running instance.

> [!Note]
> Once you expose the app to public, these actuator endpoints are exposed to public as well. You can hide all endpoints by deleting the environment variables `management.endpoints.web.exposure.include`, and set `management.endpoints.web.exposure.exclude=*`

## View the actuator endpoint to view application information

1. You can now access the url `"<test-endpoint>/actuator/"` to see all endpoints exposed by Spring Boot Actuator.
1. Access url `"<test-endpoint>/actuator/env"`, you can see active profiles used by the app, and all environment variables loaded.
1. If you want to search a specific environment, you can access url  `"<test-endpoint>/actuator/env/{toMatch}"` to view it.

To view all the endpoints built-in, see [Exposing Endpoints](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-endpoints-exposing-endpoints)

## Next steps

* [Understand metrics for Azure Spring Apps](./concept-metrics.md)
* [Understanding app status in Azure Spring Apps](./concept-app-status.md)
