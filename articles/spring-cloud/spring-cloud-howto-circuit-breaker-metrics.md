---
title: Collect Spring Cloud Resilience4J Circuit Breaker Metrics 
description: How to collect Spring Cloud Resilience4J Circuit Breaker Metrics. 
author:  MikeDodaro
ms.author: brendanm
ms.service: spring-cloud
ms.topic: how-to
ms.date: 12/15/2020
ms.custom: devx-track-java
---

# Collect Spring Cloud Resilience4J Circuit Breaker Metrics (Preview)

This document explains how to collect Spring Cloud Resilience4j Circuit Breaker Metrics with Application Insights java in-process agent.  With this feature you can monitor metrics of resilience4j circuit breaker from Application Insights.

We use the [spring-cloud-circuit-breaker-demo](https://github.com/spring-cloud-samples/spring-cloud-circuitbreaker-demo) to show how it works.

## Enable Java in process agent

Enable Java In-Process agent from this [guide](https://review.docs.microsoft.com/azure/spring-cloud/spring-cloud-howto-application-insights?branch=pr-en-us-139984#enable-java-in-process-agent-for-application-insights).

## Enable dimension collection from Application Insights

Enable dimension collection for resilience4j metrics from this [guide](https://docs.microsoft.com/azure/azure-monitor/app/pre-aggregated-metrics-log-metrics#custom-metrics-dimensions-and-pre-aggregation).

## Build and deploy apps

The following procedure builds and deploys apps.

1. Clone demo repository

```
git clone https://github.com/spring-cloud-samples/spring-cloud-circuitbreaker-demo.git
```

2. Create applications with endpoints

```
az spring-cloud app create --name resilience4j --is-public \
    -s ${asc-service-name} -g ${asc-resource-group}
az spring-cloud app create --name reactive-resilience4j --is-public \
    -s ${asc-service-name} -g ${asc-resource-group}
```

3. Deploy applications.

```
az spring-cloud app deploy -n resilience4j \
    --jar-path ./spring-cloud-circuitbreaker-demo-resilience4j/target/spring-cloud-circuitbreaker-demo-resilience4j-0.0.1.BUILD-SNAPSHOT.jar \
    -s ${service_name} -g ${resource_group}
az spring-cloud app deploy -n reactive-resilience4j \
    --jar-path ./spring-cloud-circuitbreaker-demo-reactive-resilience4j/target/spring-cloud-circuitbreaker-demo-reactive-resilience4j-0.0.1.BUILD-SNAPSHOT.jar \
    -s ${service_name} -g ${resource_group}
```

> Note:
>
> * Include the required dependency for Resilience4j:
>
>   ```
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
> * The customer application must support application code with a reference to the CircuitBreakerFactory, [Spring Cloud Circuit Breaker](https://spring.io/projects/spring-cloud-circuitbreaker0#overview).
>
> * The following 2 dependencies have conflicts with resilient4j packages above.  Be sure the customer does not include them.
>
>   ```
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

Navigate to the URL provided by gateway application, and access the endpoint from [spring-cloud-circuit-breaker-demo](https://github.com/spring-cloud-samples/spring-cloud-circuitbreaker-demo) as follows:

```
/get
/get/delay/{seconds}
/get/fluxdelay/{senconds}
```

## Locate Resilence4j Metrics from Portal

1. Select the **Application Insights** Blade from Azure Spring Cloud portal, and click **Application Insights**.

   [ ![resilience4J 0](media/spring-cloud-resilience4j/resilience4J-0.PNG)](media/spring-cloud-resilience4j/resilience4J-0.PNG)

2. Select **Metics** from the **Application Insights** page.  Select **azure.applicationinsights** from **Metrics Namespace**.  Also select **resilience4j_circuitbreaker_buffered_calls** metrics with **Average**.

   [ ![resilience4J 1](media/spring-cloud-resilience4j/resilience4J-1.PNG)](media/spring-cloud-resilience4j/resilience4J-1.PNG)

3. Select **resilience4j_circuitbreaker_calls** metrics and **Average**.

   [ ![resilience4J 2](media/spring-cloud-resilience4j/resilience4J-2.PNG)](media/spring-cloud-resilience4j/resilience4J-2.PNG)

4. Select **resilience4j_circuitbreaker_calls**  metrics and **Average**.  Click **Add filter**, and then select name as **createNewAccount**.

   [ ![resilience4J 3](media/spring-cloud-resilience4j/resilience4J-3.PNG)](media/spring-cloud-resilience4j/resilience4J-3.PNG)

5. Select **resilience4j_circuitbreaker_calls**  metrics and **Average**.  Then click **Apply splitting**, and select **kind**.

   [ ![resilience4J 4](media/spring-cloud-resilience4j/resilience4J-4.PNG)](media/spring-cloud-resilience4j/resilience4J-4.PNG)

6.. Select **resilience4j_circuitbreaker_calls**, `**resilience4j_circuitbreaker_buffered_calls**, and **resilience4j_circuitbreaker_slow_calls** metrics with **Average**.

   ![resilience4J 5](media/spring-cloud-resilience4j/resilience4j-5.PNG)

## See also

* Application insights TBD