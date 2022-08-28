---
title: "Tutorial - Use Circuit Breaker Dashboard with Azure Spring Apps"
description: Learn how to use circuit Breaker Dashboard with Azure Spring Apps.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: tutorial
ms.date: 04/06/2020
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Tutorial: Use Circuit Breaker Dashboard with Azure Spring Apps

> [!WARNING]
> Hystrix is no longer in active development and is currently in maintenance mode.

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

Spring [Cloud Netflix Turbine](https://github.com/Netflix/Turbine) is widely used to aggregate multiple [Hystrix](https://github.com/Netflix/Hystrix) metrics streams so that streams can be monitored in a single view using Hystrix dashboard. This tutorial demonstrates how to use them on Azure Spring Apps.

> [!NOTE]
> Netflix Hystrix is widely used in many existing Spring apps but it is no longer in active development. If you are developing new project, use instead Spring Cloud Circuit Breaker implementations like [resilience4j](https://github.com/resilience4j/resilience4j). Different from Turbine shown in this tutorial, the new Spring Cloud Circuit Breaker framework unifies all implementations of its metrics data pipeline into Micrometer, which is also supported by Azure Spring Apps. [Learn More](./how-to-circuit-breaker-metrics.md).

## Prepare your sample applications

The sample is forked from this [repository](https://github.com/StackAbuse/spring-cloud/tree/master/spring-turbine).

Clone the sample repository to your develop environment:

```bash
git clone https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples.git
cd Azure-Spring-Cloud-Samples/hystrix-turbine-sample
```

Build the 3 applications that will be used in this tutorial:

* user-service: A simple REST service that has a single endpoint of /personalized/{id}
* recommendation-service: A simple REST service that has a single endpoint of /recommendations, which will be called by user-service.
* hystrix-turbine: A Hystrix dashboard service to display Hystrix streams and a Turbine service aggregating Hystrix metrics stream from other services.

```bash
mvn clean package -D skipTests -f user-service/pom.xml
mvn clean package -D skipTests -f recommendation-service/pom.xml
mvn clean package -D skipTests -f hystrix-turbine/pom.xml
```

## Provision your Azure Spring Apps instance

Follow the procedure, [Provision a service instance on the Azure CLI](./quickstart.md#provision-an-instance-of-azure-spring-apps).

## Deploy your applications to Azure Spring Apps

These apps do not use **Config Server**, so there is no need to set up **Config Server** for Azure Spring Apps.  Create and deploy as follows:

```azurecli
az spring app create -n user-service --assign-endpoint
az spring app create -n recommendation-service
az spring app create -n hystrix-turbine --assign-endpoint

az spring app deploy -n user-service --jar-path user-service/target/user-service.jar
az spring app deploy -n recommendation-service --jar-path recommendation-service/target/recommendation-service.jar
az spring app deploy -n hystrix-turbine --jar-path hystrix-turbine/target/hystrix-turbine.jar
```

## Verify your apps

After all the apps are running and discoverable, access `user-service` with the path `https://<username>-user-service.azuremicroservices.io/personalized/1` from your browser. If the user-service can access `recommendation-service`, you should get the following output. Refresh the web page a few times if it doesn't work.

```json
[{"name":"Product1","description":"Description1","detailsLink":"link1"},{"name":"Product2","description":"Description2","detailsLink":"link3"},{"name":"Product3","description":"Description3","detailsLink":"link3"}]
```

## Access your Hystrix dashboard and metrics stream

Verify using public endpoints or private test endpoints.

### Using public endpoints

Access hystrix-turbine with the path `https://<SERVICE-NAME>-hystrix-turbine.azuremicroservices.io/hystrix` from your browser.  The following figure shows the Hystrix dashboard running in this app.

![Hystrix dashboard](media/spring-cloud-circuit-breaker/hystrix-dashboard.png)

Copy the Turbine stream url `https://<SERVICE-NAME>-hystrix-turbine.azuremicroservices.io/turbine.stream?cluster=default` into the text box, and select **Monitor Stream**.  This will display the dashboard. If nothing shows in the viewer, hit the `user-service` endpoints to generate streams.

![Hystrix stream](media/spring-cloud-circuit-breaker/hystrix-stream.png)
Now you can experiment with the Circuit Breaker Dashboard.

> [!NOTE]
> In production, the Hystrix dashboard and metrics stream should not be exposed to the Internet.

### Using private test endpoints

Hystrix metrics streams are also accessible from `test-endpoint`. As a backend service, we didn't assign a public end-point for `recommendation-service`, but we can show its metrics with test-endpoint at `https://primary:<KEY>@<SERVICE-NAME>.test.azuremicroservices.io/recommendation-service/default/actuator/hystrix.stream`

![Hystrix test-endpoint stream](media/spring-cloud-circuit-breaker/hystrix-test-endpoint-stream.png)

As a web app, Hystrix dashboard should be working on `test-endpoint`. If it is not working properly, there may be two reasons: first, using `test-endpoint` changed the base URL from `/` to `/<APP-NAME>/<DEPLOYMENT-NAME>`, or, second, the web app is using absolute path for static resource. To get it working on `test-endpoint`, you might need to manually edit the `<base>` in the front-end files.

## Next steps

* [Provision a service instance on the Azure CLI](./quickstart.md#provision-an-instance-of-azure-spring-apps)
* [Prepare a Java Spring application for deployment in Azure Spring Apps](how-to-prepare-app-deployment.md)
