---
title: Collect Spring Cloud Resilience4J Circuit Breaker Metrics with Micrometer
description: How to collect Spring Cloud Resilience4J Circuit Breaker Metrics with Micrometer in Azure Spring Apps.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 12/15/2020
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Collect Spring Cloud Resilience4J Circuit Breaker Metrics with Micrometer (Preview)

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to collect Spring Cloud Resilience4j Circuit Breaker Metrics with Application Insights Java in-process agent. With this feature you can monitor metrics of resilience4j circuit breaker from Application Insights with Micrometer.

We use the [spring-cloud-circuit-breaker-demo](https://github.com/spring-cloud-samples/spring-cloud-circuitbreaker-demo) to show how it works.

## Prerequisites

* Enable Java In-Process agent from the [Java In-Process Agent for Application Insights guide](./how-to-application-insights.md#manage-application-insights-using-the-azure-portal).
* Enable dimension collection for resilience4j metrics from the [Application Insights guide](../azure-monitor/app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation).
* Install git, Maven, and Java, if not already in use by the development computer.

## Build and deploy apps

Use the following procedure to build and deploy the sample applications.

1. Clone and build the demo repository.

   ```bash
    git clone https://github.com/spring-cloud-samples/spring-cloud-circuitbreaker-demo.git
    cd spring-cloud-circuitbreaker-demo && mvn clean package -DskipTests
   *```

1. Create applications with endpoints.

   ```azurecli
    az spring app create
     --resource-group ${resource-group-name} \
     --name resilience4j \
     --service ${Azure-Spring-Apps-instance-name} \
     --assign-endpoint
    az spring app create \
     --resource-group ${resource-group-name} \
     --service ${Azure-Spring-Apps-instance-name} \
     --name reactive-resilience4j \
     --assign-endpoint
   ```

1. Deploy applications.

   ```azurecli
    az spring app deploy -n resilience4j \
     --jar-path ./spring-cloud-circuitbreaker-demo-resilience4j/target/spring-cloud-circuitbreaker-demo-resilience4j-0.0.1.BUILD-SNAPSHOT.jar \
     -s ${service_name} -g ${resource_group}
    az spring app deploy -n reactive-resilience4j \
    --jar-path ./spring-cloud-circuitbreaker-demo-reactive-resilience4j/target/spring-cloud-circuitbreaker-demo-reactive-resilience4j-0.0.1.BUILD-SNAPSHOT.jar \
    -s ${service_name} -g ${resource_group}
   ```

> [!NOTE]
>
> * Include the required dependency for Resilience4j:
>
>   ```xml
>   <dependency>
>       <groupId>io.github.resilience4j</groupId>
>       <artifactId>resilience4j-micrometer</artifactId>
>   </dependency>
>   <dependency>
>       <groupId>org.springframework.cloud</groupId>
>       <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
>   </dependency>
>   ```
>
> * The customer code must use the API of `CircuitBreakerFactory`, which is implemented as a `bean` automatically created when you include a Spring Cloud Circuit Breaker starter. For details see [Spring Cloud Circuit Breaker](https://spring.io/projects/spring-cloud-circuitbreaker#overview).
>
> * The following 2 dependencies have conflicts with resilient4j packages above.  Be sure the customer does not include them.
>
>   ```xml
>   <dependency>
>       <groupId>org.springframework.cloud</groupId>
>       <artifactId>spring-cloud-starter-sleuth</artifactId>
>   </dependency>
>   <dependency>
>       <groupId>org.springframework.cloud</groupId>
>       <artifactId>spring-cloud-starter-zipkin</artifactId>
>   </dependency>
>   ```
>
>
> Navigate to the URL provided by gateway applications, and access the endpoint from [spring-cloud-circuit-breaker-demo](https://github.com/spring-cloud-samples/spring-cloud-circuitbreaker-demo) as follows:
>
>   ```console
>   /get
>   /get/delay/{seconds}
>   /get/fluxdelay/{seconds}
>   ```

## Locate Resilence4j Metrics on the Azure portal

1. In your Azure Spring Apps instance, select **Application Insights** in the navigation pane and then select **Application Insights** on the page.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/application-insights.png" alt-text="Screenshot of the Azure portal showing the Azure Spring Apps Application Insights page with the Application Insights on the button bar highlighted." lightbox="media/how-to-circuit-breaker-metrics/application-insights.png":::

1. Select **Metrics** in the navigation pane. The Metrics page provides dropdown menus and options from which you will define the charts in this procedure. For all charts, set the **Metric Namespace**, to **azure.applicationinsights**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/chart-menus.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page, with Metrics highlighted in the navigation pane, and with azure-applicationinsights highlighted in the Metric Namespace dropdown menu." lightbox="media/how-to-circuit-breaker-metrics/chart-menus.png":::

1. For the first chart, select **resilience4j_circuitbreaker_buffered_calls** for the **Metric** with the **Aggregation** set to **Avg**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/buffered-calls.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page showing a chart of the circuitbreaker buffered calls metric and averaged." lightbox="media/how-to-circuit-breaker-metrics/buffered-calls.png":::

1. For the next chart, select **resilience4j_circuitbreaker_calls** for the **Metric** with the **Aggregation** set to **Avg**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/calls.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page showing a chart of the circuitbreaker calls metric and averaged." lightbox="media/how-to-circuit-breaker-metrics/calls.png":::

1. Select **resilience4j_circuitbreaker_calls** for the **Metric** with the **Aggregation** set to **Avg**. Select **Add filter** and for the name select **createNewAccount**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/calls-filter.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page showing a chart of the circuitbreaker calls metric, averaged, and with a filter applied." lightbox="media/how-to-circuit-breaker-metrics/calls-filter.png":::

1. Select **resilience4j_circuitbreaker_calls** for the **Metric** with the **Aggregation** set to **Avg**. Select **Apply splitting** and then select **kind**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/calls-splitting.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page showing a chart of the circuitbreaker calls metric, averaged, and with Apply splitting applied." lightbox="media/how-to-circuit-breaker-metrics/calls-splitting.png":::

1. For the last chart, select **resilience4j_circuitbreaker_calls** for the **Metric** with the **Aggregation** set to **Avg**. Select **Add metric** and select **resilience4j_circuitbreaker_buffered_calls** for the **Metric** with the **Aggregation** set to **Avg**. Repeat to add the metric **resilience4j_circuitbreaker_slow_calls** with the **Aggregation** set to **Avg**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/slow-calls.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page showing a chart rendered from two metrics and averaged." lightbox="media/how-to-circuit-breaker-metrics/slow-calls.png":::

## Next steps

* [Application insights](./how-to-application-insights.md)
* [Distributed tracing](./how-to-distributed-tracing.md)
* [Circuit breaker dashboard](./tutorial-circuit-breaker.md)
