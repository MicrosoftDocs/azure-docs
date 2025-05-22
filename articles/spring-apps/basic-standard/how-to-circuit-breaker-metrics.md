---
title: Collect Spring Cloud Resilience4J Circuit Breaker Metrics with Micrometer
description: How to collect Spring Cloud Resilience4J Circuit Breaker Metrics with Micrometer in Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 02/21/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
zone_pivot_groups: spring-apps-tier-selection
---

# Collect Spring Cloud Resilience4J Circuit Breaker Metrics with Micrometer (Preview)

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article shows you how to collect Spring Cloud Resilience4j Circuit Breaker Metrics with Application Insights Java in-process agent. With this feature, you can monitor the metrics of Resilience4j circuit breaker from Application Insights with Micrometer.

The demo [spring-cloud-circuit-breaker-demo](https://github.com/spring-cloud-samples/spring-cloud-circuitbreaker-demo) shows how the monitoring works.

## Prerequisites

* Install Git, Maven, and Java, if not already installed on the development computer.

## Build and deploy apps

Use the following steps to build and deploy the sample applications.

1. Use the following command to clone and build the demo repository:

   ```bash
   git clone https://github.com/spring-cloud-samples/spring-cloud-circuitbreaker-demo.git
   cd spring-cloud-circuitbreaker-demo && mvn clean package -DskipTests
   ```

::: zone pivot="sc-standard"

1. Use the following command to create an Azure Spring Apps service instance:


   ```azurecli
   az spring create \
       --resource-group ${resource-group-name} \
       --name ${Azure-Spring-Apps-instance-name}
   ```

1. Use the following commands to create the applications with endpoints:


   ```azurecli
   az spring app create \
       --resource-group ${resource-group-name} \
       --service ${Azure-Spring-Apps-instance-name} \
       --name resilience4j \
       --assign-endpoint
   az spring app create \
       --resource-group ${resource-group-name} \
       --service ${Azure-Spring-Apps-instance-name} \
       --name reactive-resilience4j \
       --assign-endpoint
   ```

1. Use the following commands to deploy the applications:


   ```azurecli
   az spring app deploy \
       --resource-group ${resource-group-name} \
       --service ${Azure-Spring-Apps-instance-name} \
       --name resilience4j \
       --env resilience4j.circuitbreaker.instances.backendA.registerHealthIndicator=true \
       --artifact-path ./spring-cloud-circuitbreaker-demo-resilience4j/target/spring-cloud-circuitbreaker-demo-resilience4j-0.0.1-SNAPSHOT.jar
   az spring app deploy \
       --resource-group ${resource-group-name} \
       --service ${Azure-Spring-Apps-instance-name} \
       --name reactive-resilience4j \
       --env resilience4j.circuitbreaker.instances.backendA.registerHealthIndicator=true \
       --artifact-path ./spring-cloud-circuitbreaker-demo-reactive-resilience4j/target/spring-cloud-circuitbreaker-demo-reactive-resilience4j-0.0.1-SNAPSHOT.jar
   ```

::: zone-end

::: zone pivot="sc-enterprise"

1. Use the following command to create an Azure Spring Apps service instance:


   > [!NOTE]
   > If your subscription has never been used to create an Enterprise plan instance of Azure Spring Apps, you must run the following command:

   >
   > ```azurecli
   > az term accept \
   >     --publisher vmware-inc 
   >     --product azure-spring-cloud-vmware-tanzu-2 
   >     --plan asa-ent-hr-mtr
   > ```

   ```azurecli
   az spring create \
       --resource-group ${resource-group-name} \
       --name ${Azure-Spring-Apps-instance-name} \
       --sku Enterprise
   ```

1. Use the following commands to create applications with endpoints:

   ```azurecli
   az spring app create \
       --resource-group ${resource-group-name} \
       --service ${Azure-Spring-Apps-instance-name} \
       --name resilience4j \
       --assign-endpoint
   az spring app create \
       --resource-group ${resource-group-name} \
       --service ${Azure-Spring-Apps-instance-name} \
       --name reactive-resilience4j \
       --assign-endpoint
   ```

1. Use the following commands to deploy the applications:


   ```azurecli
   az spring app deploy \
       --resource-group ${resource-group-name} \
       --service ${Azure-Spring-Apps-instance-name} \
       --name resilience4j \
       --env resilience4j.circuitbreaker.instances.backendA.registerHealthIndicator=true \
       --artifact-path ./spring-cloud-circuitbreaker-demo-resilience4j/target/spring-cloud-circuitbreaker-demo-resilience4j-0.0.1-SNAPSHOT.jar
   az spring app deploy \
       --resource-group ${resource-group-name} \
       --service ${Azure-Spring-Apps-instance-name} \
       --name reactive-resilience4j \
       --env resilience4j.circuitbreaker.instances.backendA.registerHealthIndicator=true \
       --artifact-path ./spring-cloud-circuitbreaker-demo-reactive-resilience4j/target/spring-cloud-circuitbreaker-demo-reactive-resilience4j-0.0.1-SNAPSHOT.jar
   ```

::: zone-end

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
> * Your code must use the `CircuitBreakerFactory` API, which is implemented as a `bean` automatically created when you include a Spring Cloud Circuit Breaker starter. For more information, see [Spring Cloud Circuit Breaker](https://spring.io/projects/spring-cloud-circuitbreaker#overview).
>
> * The following two dependencies have conflicts with Resilient4j packages.  Be sure you don't include them.
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
>   /delay/{seconds}
>   /fluxdelay/{seconds}
>   ```

## Locate Resilence4j Metrics on the Azure portal

::: zone pivot="sc-standard"

1. In your Azure Spring Apps instance, select **Application Insights** in the navigation pane and then select **Application Insights** on the page.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/application-insights.png" alt-text="Screenshot of the Azure portal that shows the Azure Spring Apps Application Insights page with Application Insights highlighted." lightbox="media/how-to-circuit-breaker-metrics/application-insights.png":::


   > [!NOTE]
   > If you don't enable Application Insights, you can enable the Java In-Process agent. For more information, see the [Manage Application Insights using the Azure portal](./how-to-application-insights.md#manage-application-insights-using-the-azure-portal) section of [Use Application Insights Java In-Process Agent in Azure Spring Apps](./how-to-application-insights.md).

1. Enable dimension collection for resilience4j metrics. For more information, see the [Custom metrics dimensions and preaggregation](/azure/azure-monitor/app/pre-aggregated-metrics-log-metrics#custom-metrics-dimensions-and-preaggregation) section of [Log-based and preaggregated metrics in Application Insights](/azure/azure-monitor/app/pre-aggregated-metrics-log-metrics).

1. Select **Metrics** in the navigation pane. The **Metrics** page provides dropdown menus and options to define the charts in this procedure. For all charts, set **Metric Namespace** to **azure.applicationinsights**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/chart-menus.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page with Metric Namespace menu open and azure-applicationinsights option highlighted." lightbox="media/how-to-circuit-breaker-metrics/chart-menus.png":::


1. Set **Metric** to **resilience4j_circuitbreaker_buffered_calls**, and then set **Aggregation** to **Avg**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/buffered-calls.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page that shows a chart with circuit breaker buffered calls and average aggregation." lightbox="media/how-to-circuit-breaker-metrics/buffered-calls.png":::


1. Set **Metric** to **resilience4j_circuitbreaker_calls**, and then set **Aggregation** to **Avg**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/calls.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page that shows a chart with circuit breaker calls and average aggregation." lightbox="media/how-to-circuit-breaker-metrics/calls.png":::


1. Set **Metric** to **resilience4j_circuitbreaker_calls**, and then set **Aggregation** to **Avg**. Select **Add filter** and set **Name** to **Delay**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/calls-filter.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page that shows a chart with circuit breaker calls, average aggregation and Delay Filter." lightbox="media/how-to-circuit-breaker-metrics/calls-filter.png":::


1. Set **Metric** to **resilience4j_circuitbreaker_calls**, and then set **Aggregation** to **Avg**. Select **Apply splitting** and set **Split by** to **kind**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/calls-splitting.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page that shows a chart with circuit breaker calls, average aggregation, and splitting." lightbox="media/how-to-circuit-breaker-metrics/calls-splitting.png":::


1. Set **Metric** to **resilience4j_circuitbreaker_calls**, and then set **Aggregation** to **Avg**. Select **Add metric** and set **Metric** to **resilience4j_circuitbreaker_buffered_calls**, and then set **Aggregation** to **Avg**. Select **Add metric** again and set **Metric** to **resilience4j_circuitbreaker_slow_calls**, and then set **Aggregation** set to **Avg**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/slow-calls.png" alt-text="Screenshot of the Azure portal that shows the Application Insights Metrics page with the chart described in this step." lightbox="media/how-to-circuit-breaker-metrics/slow-calls.png":::


::: zone-end

::: zone pivot="sc-enterprise"

1. In your Azure Spring Apps instance, select **Application Insights** in the navigation pane and then select the default **Application Insights** on the page.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/application-insights-enterprise.png" alt-text="Screenshot of the Azure portal that shows the Azure Spring Apps Application Insights page with the default Application Insights instance highlighted." lightbox="media/how-to-circuit-breaker-metrics/application-insights-enterprise.png":::


   > [!NOTE]
   > If there's no default Application Insights available, you can enable the Java In-Process agent. For more information, see the [Manage Application Insights using the Azure portal](./how-to-application-insights.md#manage-application-insights-using-the-azure-portal) section of [Use Application Insights Java In-Process Agent in Azure Spring Apps](./how-to-application-insights.md).

1. Enable dimension collection for resilience4j metrics. For more information, see the [Custom metrics dimensions and preaggregation](/azure/azure-monitor/app/pre-aggregated-metrics-log-metrics#custom-metrics-dimensions-and-preaggregation) section of [Log-based and preaggregated metrics in Application Insights](/azure/azure-monitor/app/pre-aggregated-metrics-log-metrics).

1. Select **Metrics** in the navigation pane. The **Metrics** page provides dropdown menus and options to define the charts in this procedure. For all charts, set **Metric Namespace** to **azure.applicationinsights**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/chart-menus.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page with the Metric Namespace menu open and azure.applicationinsights highlighted." lightbox="media/how-to-circuit-breaker-metrics/chart-menus.png":::


1. Set **Metric** to **resilience4j_circuitbreaker_buffered_calls**, and then set **Aggregation** to **Avg**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/buffered-calls.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page that shows a chart with circuit breaker buffered calls and average aggregation." lightbox="media/how-to-circuit-breaker-metrics/buffered-calls.png":::


1. Set **Metric** to **resilience4j_circuitbreaker_calls**, and then set **Aggregation** to **Avg**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/calls.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page that shows a chart with circuit breaker calls and average aggregation." lightbox="media/how-to-circuit-breaker-metrics/calls.png":::


1. Set **Metric** to **resilience4j_circuitbreaker_calls**, and then set **Aggregation** to **Avg**. Select **Add filter** and set **Name** to **Delay**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/calls-filter.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page that shows a chart with circuit breaker calls, average aggregation and delay filter." lightbox="media/how-to-circuit-breaker-metrics/calls-filter.png":::


1. Set **Metric** to **resilience4j_circuitbreaker_calls**, and then set **Aggregation** to **Avg**. Select **Apply splitting** and set **Split by** to **kind**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/calls-splitting.png" alt-text="Screenshot of the Azure portal Application Insights Metrics page that shows a chart with circuit breaker calls, average aggregation, and splitting." lightbox="media/how-to-circuit-breaker-metrics/calls-splitting.png":::


1. Set **Metric** to **resilience4j_circuitbreaker_calls**, and then set **Aggregation** to **Avg**. Select **Add metric** and set **Metric** to **resilience4j_circuitbreaker_buffered_calls**, and then set **Aggregation** to **Avg**. Select **Add metric** again and set **Metric** to **resilience4j_circuitbreaker_slow_calls**, and then set **Aggregation** set to **Avg**.

   :::image type="content" source="media/how-to-circuit-breaker-metrics/slow-calls.png" alt-text="Screenshot of the Azure portal that shows the Application Insights Metrics page with the chart described in this step." lightbox="media/how-to-circuit-breaker-metrics/slow-calls.png":::

::: zone-end

## Next steps

* [Application insights](./how-to-application-insights.md)
* [Circuit breaker dashboard](./tutorial-circuit-breaker.md)
