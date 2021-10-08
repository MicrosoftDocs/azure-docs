---
title: Collect Spring Cloud Resilience4J Circuit Breaker Metrics with Micrometer
description: How to collect Spring Cloud Resilience4J Circuit Breaker Metrics with Micrometer in Azure Spring Cloud.
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: how-to
ms.date: 12/15/2020
ms.custom: devx-track-java, devx-track-azurecli
---

# Collect Spring Cloud Resilience4J Circuit Breaker Metrics with Micrometer (Preview)

This document explains how to collect Spring Cloud Resilience4j Circuit Breaker Metrics with Application Insights java in-process agent. With this feature you can monitor metrics of resilience4j circuit breaker from Application Insights with Micrometer.

We use the [spring-cloud-circuit-breaker-demo](https://github.com/spring-cloud-samples/spring-cloud-circuitbreaker-demo) to show how it works.

## Prerequisites

* Enable Java In-Process agent from the [Java In-Process Agent for Application Insights guide](./how-to-application-insights.md#enable-java-in-process-agent-for-application-insights).
* Enable dimension collection for resilience4j metrics from the [Application Insights guide](../azure-monitor/app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation).
* Install git, Maven, and Java, if not already in use by the development computer.

## Build and deploy apps

The following procedure builds and deploys apps.

1. Clone and build the demo repository.

```bash
git clone https://github.com/spring-cloud-samples/spring-cloud-circuitbreaker-demo.git
cd spring-cloud-circuitbreaker-demo && mvn clean package -DskipTests
```

2. Create applications with endpoints

```azurecli
az spring-cloud app create --name resilience4j --assign-endpoint \
    -s ${asc-service-name} -g ${asc-resource-group}
az spring-cloud app create --name reactive-resilience4j --assign-endpoint \
    -s ${asc-service-name} -g ${asc-resource-group}
```

3. Deploy applications.

```azurecli
az spring-cloud app deploy -n resilience4j \
    --jar-path ./spring-cloud-circuitbreaker-demo-resilience4j/target/spring-cloud-circuitbreaker-demo-resilience4j-0.0.1.BUILD-SNAPSHOT.jar \
    -s ${service_name} -g ${resource_group}
az spring-cloud app deploy -n reactive-resilience4j \
    --jar-path ./spring-cloud-circuitbreaker-demo-reactive-resilience4j/target/spring-cloud-circuitbreaker-demo-reactive-resilience4j-0.0.1.BUILD-SNAPSHOT.jar \
    -s ${service_name} -g ${resource_group}
```

> [!Note]
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

## Locate Resilence4j Metrics from Portal

1. Select the **Application Insights** Blade from Azure Spring Cloud portal, and select **Application Insights**.

   [ ![resilience4J 0](media/spring-cloud-resilience4j/resilience4J-0.png)](media/spring-cloud-resilience4j/resilience4J-0.PNG)

2. Select **Metrics** from the **Application Insights** page.  Select **azure.applicationinsights** from **Metrics Namespace**.  Also select **resilience4j_circuitbreaker_buffered_calls** metrics with **Average**.

   [ ![resilience4J 1](media/spring-cloud-resilience4j/resilience4J-1.png)](media/spring-cloud-resilience4j/resilience4J-1.PNG)

3. Select **resilience4j_circuitbreaker_calls** metrics and **Average**.

   [ ![resilience4J 2](media/spring-cloud-resilience4j/resilience4J-2.png)](media/spring-cloud-resilience4j/resilience4J-2.PNG)

4. Select **resilience4j_circuitbreaker_calls**  metrics and **Average**. Select **Add filter**, and then select name as **createNewAccount**.

   [ ![resilience4J 3](media/spring-cloud-resilience4j/resilience4J-3.png)](media/spring-cloud-resilience4j/resilience4J-3.PNG)

5. Select **resilience4j_circuitbreaker_calls**  metrics and **Average**.  Then select **Apply splitting**, and select **kind**.

   [ ![resilience4J 4](media/spring-cloud-resilience4j/resilience4J-4.png)](media/spring-cloud-resilience4j/resilience4J-4.PNG)

6. Select **resilience4j_circuitbreaker_calls**, `**resilience4j_circuitbreaker_buffered_calls**, and **resilience4j_circuitbreaker_slow_calls** metrics with **Average**.

   [ ![resilience4J 5](media/spring-cloud-resilience4j/resilience4j-5.png)](media/spring-cloud-resilience4j/resilience4j-5.PNG)

## See also

* [Application insights](./how-to-application-insights.md)
* [Distributed tracing](./how-to-distributed-tracing.md)
* [Circuit breaker dashboard](./tutorial-circuit-breaker.md)
