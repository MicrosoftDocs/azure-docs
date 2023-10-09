---
title: "Tutorial - Use Circuit Breaker Dashboard with Azure Spring Apps"
description: Learn how to use circuit Breaker Dashboard with Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: tutorial
ms.date: 04/06/2020
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# Tutorial: Use Circuit Breaker Dashboard with Azure Spring Apps

> [!WARNING]
> Hystrix is no longer in active development and is currently in maintenance mode.

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to use Netflix Turbine and Netflix Hystrix on Azure Spring Apps. Spring Cloud [Netflix Turbine](https://github.com/Netflix/Turbine) is widely used to aggregate multiple [Netflix Hystrix](https://github.com/Netflix/Hystrix) metrics streams so that streams can be monitored in a single view using Hystrix dashboard.

> [!NOTE]
> Netflix Hystrix is widely used in many existing Spring apps but it's no longer in active development. If you're developing a new project, you should use Spring Cloud Circuit Breaker implementations like [resilience4j](https://github.com/resilience4j/resilience4j) instead. Different from Turbine shown in this tutorial, the new Spring Cloud Circuit Breaker framework unifies all implementations of its metrics data pipeline into Micrometer, which is also supported by Azure Spring Apps. For more information, see [Collect Spring Cloud Resilience4J Circuit Breaker Metrics with Micrometer (Preview)](./how-to-circuit-breaker-metrics.md).

## Prepare your sample applications

The sample is forked from this [repository](https://github.com/StackAbuse/spring-cloud/tree/master/spring-turbine).

Clone the sample repository to your develop environment:

```bash
git clone https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples.git
cd Azure-Spring-Cloud-Samples/hystrix-turbine-sample
```

Build the three applications that are in this tutorial:

* user-service: A simple REST service that has a single endpoint of /personalized/{id}
* recommendation-service: A simple REST service that has a single endpoint of /recommendations, which is called by user-service.
* hystrix-turbine: A Hystrix dashboard service to display Hystrix streams and a Turbine service aggregating Hystrix metrics stream from other services.

```bash
mvn clean package -D skipTests -f user-service/pom.xml
mvn clean package -D skipTests -f recommendation-service/pom.xml
mvn clean package -D skipTests -f hystrix-turbine/pom.xml
```

## Provision your Azure Spring Apps instance

Follow the steps in the [Provision an instance of Azure Spring Apps](./quickstart.md#32-create-an-azure-spring-apps-instance) section of [Quickstart: Deploy your first application to Azure Spring Apps](quickstart.md).

## Deploy your applications to Azure Spring Apps

These apps don't use **Config Server**, so there's no need to set up **Config Server** for Azure Spring Apps.  Create and deploy as follows:

```azurecli
az configure --defaults \
    group=<resource-group-name> \
    spring=<Azure-Spring-Apps-instance-name>

az spring app create --name user-service --assign-endpoint
az spring app create --name recommendation-service
az spring app create --name hystrix-turbine --assign-endpoint

az spring app deploy \
    --name user-service \
    --artifact-path user-service/target/user-service.jar
az spring app deploy \
    --name recommendation-service \
    --artifact-path recommendation-service/target/recommendation-service.jar
az spring app deploy \
    --name hystrix-turbine \
    --artifact-path hystrix-turbine/target/hystrix-turbine.jar
```

## Verify your apps

After all the apps are running and discoverable, access `user-service` with the path `https://<Azure-Spring-Apps-instance-name>-user-service.azuremicroservices.io/personalized/1` from your browser. If the user-service can access `recommendation-service`, you should get the following output. Refresh the web page a few times if it doesn't work.

```json
[{"name":"Product1","description":"Description1","detailsLink":"link1"},{"name":"Product2","description":"Description2","detailsLink":"link3"},{"name":"Product3","description":"Description3","detailsLink":"link3"}]
```

## Access your Hystrix dashboard and metrics stream

Verify using public endpoints or private test endpoints.

### Using public endpoints

Access hystrix-turbine with the path `https://<SERVICE-NAME>-hystrix-turbine.azuremicroservices.io/hystrix` from your browser.  The following figure shows the Hystrix dashboard running in this app.

:::image type="content" source="media/spring-cloud-circuit-breaker/hystrix-dashboard.png" alt-text="Screenshot of the Hystrix dashboard.":::

Copy the Turbine stream url `https://<SERVICE-NAME>-hystrix-turbine.azuremicroservices.io/turbine.stream?cluster=default` into the text box, and select **Monitor Stream**.  This action displays the dashboard. If nothing shows in the viewer, hit the `user-service` endpoints to generate streams.

:::image type="content" source="media/spring-cloud-circuit-breaker/hystrix-stream.png" alt-text="Screenshot of the Hystrix stream page." lightbox="media/spring-cloud-circuit-breaker/hystrix-stream.png":::

> [!NOTE]
> In production, the Hystrix dashboard and metrics stream should not be exposed to the Internet.

### Using private test endpoints

Hystrix metrics streams are also accessible from `test-endpoint`. As a backend service, we didn't assign a public end-point for `recommendation-service`, but we can show its metrics with test-endpoint at `https://primary:<KEY>@<SERVICE-NAME>.test.azuremicroservices.io/recommendation-service/default/actuator/hystrix.stream`

:::image type="content" source="media/spring-cloud-circuit-breaker/hystrix-test-endpoint-stream.png" alt-text="Screenshot of the Hystrix test-endpoint stream page." lightbox="media/spring-cloud-circuit-breaker/hystrix-test-endpoint-stream.png":::

As a web app, Hystrix dashboard should be working on `test-endpoint`. If it isn't working properly, there may be two reasons: first, using `test-endpoint` changed the base URL from `/` to `/<APP-NAME>/<DEPLOYMENT-NAME>`, or, second, the web app is using absolute path for static resource. To get it working on `test-endpoint`, you might need to manually edit the `<base>` in the front-end files.

## Next steps

* [Provision an instance of Azure Spring Apps](./quickstart.md#32-create-an-azure-spring-apps-instance) section of [Quickstart: Deploy your first application to Azure Spring Apps](quickstart.md).
* [Prepare a Java Spring application for deployment in Azure Spring Apps](how-to-prepare-app-deployment.md)
