---
title: Use Micrometer metrics for Java SDK in Azure Cosmos DB
description: Learn how to consume Micrometer metrics in the Java SDK for Azure Cosmos DB.
author: TheovanKraay
ms.author: thvankra
services: cosmos-db
ms.service: cosmos-db
ms.custom: devx-track-extended-java
ms.topic: how-to
ms.date: 12/14/2023
---

# Micrometer metrics for Java
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The [Java SDK for Azure Cosmos DB](samples-java.md) implements client metrics using [Micrometer](https://micrometer.io/) for instrumentation in popular observability systems like [Prometheus](https://prometheus.io/). This article includes instructions and code snippets for scraping metrics into Prometheus, taken from [this sample](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/prometheus/async/CosmosClientMetricsQuickStartAsync.java). The full list of metrics provided by the SDK is documented [here](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos/docs/Metrics.md#what-metrics-are-emitted). If your clients are deployed on Azure Kubernetes Service (AKS), you can also use the Azure Monitor managed service for Prometheus with custom scraping, see documentation [here](../../azure-monitor/containers/prometheus-metrics-scrape-configuration-minimal.md).

## Consume metrics from Prometheus

You can download prometheus from [here](https://prometheus.io/download/). To consume Micrometer metrics in the Java SDK for Azure Cosmos DB using Prometheus, first ensure you have imported the required libraries for registry and client:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
    <version>1.6.6</version>
</dependency>

<dependency>
    <groupId>io.prometheus</groupId>
    <artifactId>simpleclient_httpserver</artifactId>
    <version>0.5.0</version>
</dependency>
```

In your application, provide the prometheus registry to the telemetry config. Notice that you can set various diagnostic thresholds, which will help to limit metrics consumed to the ones you are most interested in:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/prometheus/async/CosmosClientMetricsQuickStartAsync.java?name=ClientMetricsConfig)]

Start local HttpServer server to expose the meter registry metrics to Prometheus:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/prometheus/async/CosmosClientMetricsQuickStartAsync.java?name=PrometheusTargetServer)]

Ensure you pass `clientTelemetryConfig` when creating your `CosmosClient`:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/prometheus/async/CosmosClientMetricsQuickStartAsync.java?name=CosmosClient)]


When adding the endpoint for your application client to `prometheus.yml`, add the domain name and port to "targets". For example, if prometheus is running on the same server as your app client, you can add `localhost:8080` to `targets` as below:

```yml
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ["localhost:9090", "localhost:8080"]
```

Now you can consume metrics from Prometheus:  

:::image type="content" source="./media/client-metrics-java/prometheus.png" alt-text="Screenshot of metrics graph in Prometheus explorer." lightbox="./media/client-metrics-java/prometheus.png" border="true":::


## Next steps

- [Monitoring Azure Cosmos DB data reference](../monitor-reference.md)
- [Monitoring Azure resources with Azure Monitor](../../azure-monitor//essentials//monitor-azure-resource.md)
