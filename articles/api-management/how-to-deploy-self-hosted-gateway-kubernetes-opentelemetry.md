---
title: Deploy self-hosted gateway to Kubernetes with OpenTelemetry integration
description: Learn how to deploy a self-hosted gateway component of Azure API Management on Kubernetes with OpenTelemetry
author: tomkerkhove

ms.service: api-management
ms.workload: mobile
ms.topic: article
ms.author: tomkerkhove
ms.date: 12/17/2021
---

# Deploy self-hosted gateway to Kubernetes with OpenTelemetry integration

This article describes the steps for deploying the self-hosted gateway component of Azure API Management to a Kubernetes cluster and automatically send all metrics to an [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/).

[!INCLUDE [preview](./includes/preview/preview-callout-self-hosted-gateway-opentelemetry.md)]

You learn how to:

> [!div class="checklist"]
> * Configure and deploy a standalone OpenTelemetry Collector on Kubernetes
> * Deploy the self-hosted gateway with OpenTelemetry metrics.
> * Generate metrics by consuming APIs on the self-hosted gateway.
> * Use the metrics from the OpenTelemetry Collector.

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

- [Create an Azure API Management instance](get-started-create-service-instance.md)
- Create an Azure Kubernetes cluster [using the Azure CLI](../aks/learn/quick-kubernetes-deploy-cli.md), [using Azure PowerShell](../aks/learn/quick-kubernetes-deploy-powershell.md), or [using the Azure portal](../aks/learn/quick-kubernetes-deploy-portal.md).
- [Provision a self-hosted gateway resource in your API Management instance](api-management-howto-provision-self-hosted-gateway.md).

## Introduction to OpenTelemetry

[OpenTelemetry](https://opentelemetry.io/) is a set of open-source tools and frameworks for logging, metrics, and tracing in a vendor-neutral way.

[!INCLUDE [preview](./includes/preview/preview-callout-self-hosted-gateway-opentelemetry.md)]

The self-hosted gateway can be configured to automatically collect and send metrics to an [OpenTelemetry Collector](https://opentelemetry.io/docs/concepts/components/#collector). This allows you to bring your own metrics collection and reporting solution for the self-hosted gateway.

> [!NOTE]
> OpenTelemetry is an incubating project of the [Cloud Native Computing Foundation (CNCF) ecosystem](https://www.cncf.io/).

### Metrics

The self-hosted gateway will automatically start measuring the following metrics:

- Requests
- DurationInMs
- BackendDurationInMs
- ClientDurationInMs
- GatewayDurationInMs

They are automatically exported to the configured OpenTelemetry Collector every 1 minute with additional dimensions.

## Deploy the OpenTelemetry Collector

We will start by deploying a standalone OpenTelemetry Collector on Kubernetes by using Helm.

> [!TIP]
> While we will be using the Collector Helm chart, they also provide an [OpenTelemetry Collector Operator](https://github.com/open-telemetry/opentelemetry-helm-charts/tree/main/charts/opentelemetry-operator)

To start with, we have to add the Helm chart repository:
1. Add the Helm repository

    ```console
    helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
    ```

2. Update repo to fetch the latest Helm charts.

   ```console
   helm repo update
   ```

3. Verify your Helm configuration by listing all available charts.

   ```console
   $ helm search repo open-telemetry
   NAME                                    CHART VERSION   APP VERSION     DESCRIPTION
   open-telemetry/opentelemetry-collector  0.8.1           0.37.1          OpenTelemetry Collector Helm chart for Kubernetes
   open-telemetry/opentelemetry-operator   0.4.0           0.37.0          OpenTelemetry Operator Helm chart for Kubernetes
   ```

Now that we have the chart repository configured, we can deploy the OpenTelemetry Collector to our cluster:

1. Create a local configuration file called `opentelemetry-collector-config.yml` with the following configuration:

    ```yaml
    mode: deployment
    config:
      exporters:
        prometheus:
          endpoint: "0.0.0.0:8889"
          namespace: azure_apim
          send_timestamps: true
      service:
        pipelines:
          metrics:
            exporters:
            - prometheus
    service:
      type: LoadBalancer
    ports:
      jaeger-compact:
        enabled: false
      prom-exporter:
        enabled: true
        containerPort: 8889
        servicePort: 8889
        protocol: TCP
    ```

This allows us to use a standalone collector with the Prometheus exporter being exposed on port `8889`. To expose the Prometheus metrics, we are asking the Helm chart to configure a `LoadBalancer` service.

> [!NOTE]
> We are disabling the compact Jaeger port given it uses UDP and `LoadBalancer` service does not allow you to have multiple protocols at the same time.

2. Install the Helm chart with our configuration:

    ```console
    helm install opentelemetry-collector open-telemetry/opentelemetry-collector --values .\opentelemetry-collector-config.yml
    ```

3. Verify the installation by getting all the resources for our Helm chart

    ```console
    $ kubectl get all -l app.kubernetes.io/instance=opentelemetry-collector
    NAME                                           READY   STATUS    RESTARTS   AGE
    pod/opentelemetry-collector-58477c8c89-dstwd   1/1     Running   0          27m

    NAME                              TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)                                                                                       AGE
    service/opentelemetry-collector   LoadBalancer   10.0.175.135   20.103.18.53   14250:30982/TCP,14268:32461/TCP,4317:31539/TCP,4318:31581/TCP,8889:32420/TCP,9411:30003/TCP   27m

    NAME                                      READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/opentelemetry-collector   1/1     1            1           27m

    NAME                                                 DESIRED   CURRENT   READY   AGE
    replicaset.apps/opentelemetry-collector-58477c8c89   1         1         1       27m
    ```
    
4. Take note of the external IP of the service, so we can query it later on.

With our OpenTelemetry Collector installed, we can now deploy the self-hosted gateway to our cluster.

## Deploy the self-hosted gateway

> [!IMPORTANT]
> For a detailed overview on how to deploy the self-hosted gateway with Helm and how to get the required configuration, we recommend reading [this article](how-to-deploy-self-hosted-gateway-kubernetes-helm.md).

In this section, we will deploy the self-hosted gateway to our cluster with Helm and configure it to send OpenTelemetry metrics to the OpenTelemetry Collector.

1. Install the Helm chart and configure it to use OpenTelemetry metrics:

   ```console
   helm install azure-api-management-gateway \
                --set gateway.configuration.uri='<your configuration url>' \
                --set gateway.auth.key='<your auth token>' \
                --set observability.opentelemetry.enabled=true \
                --set observability.opentelemetry.collector.uri=http://opentelemetry-collector:4317 \
                --set service.type=LoadBalancer \
                azure-apim-gateway/azure-api-management-gateway
   ```

> [!NOTE]
> `opentelemetry-collector` in the command above is the name of  the OpenTelemetry Collector. Update the name if your service has a different name.

2. Verify the installation by getting all the resources for our Helm chart
 
    ```console
    $ kubectl get all -l app.kubernetes.io/instance=apim-gateway
    NAME                                                            READY   STATUS    RESTARTS   AGE
    pod/apim-gateway-azure-api-management-gateway-fb77c6d49-rffwq   1/1     Running   0          63m

    NAME                                                TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)                         AGE
    service/apim-gateway-azure-api-management-gateway   LoadBalancer   10.0.67.177   20.71.82.110   8080:32267/TCP,8081:32065/TCP   63m

    NAME                                                        READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/apim-gateway-azure-api-management-gateway   1/1     1            1           63m

    NAME                                                                  DESIRED   CURRENT   READY   AGE
    replicaset.apps/apim-gateway-azure-api-management-gateway-fb77c6d49   1         1         1       63m
    ```
    
3. Take note of the external IP of the self-hosted gateway's service, so we can query it later on.

## Generate and consume the OpenTelemetry metrics

Now that both our OpenTelemetry Collector and the self-hosted gateway are deployed, we can start consuming the APIs to generate metrics.

> [!NOTE]
> We will be consuming the default "Echo API" for this walkthrough.
> 
> Make sure that it is configured to:
> - Allow HTTP requests
> - Allow your self-hosted gateway to expose it

1. Query the Echo API in the self-hosted gateway:

    ```console
    $ curl -i "http://<self-hosted-gateway-ip>:8080/echo/resource?param1=sample&subscription-key=abcdef0123456789"
    HTTP/1.1 200 OK
    Date: Mon, 20 Dec 2021 12:58:09 GMT
    Server: Microsoft-IIS/8.5
    Content-Length: 0
    Cache-Control: no-cache
    Pragma: no-cache
    Expires: -1
    Accept: */*
    Host: echoapi.cloudapp.net
    User-Agent: curl/7.68.0
    X-Forwarded-For: 10.244.1.1
    traceparent: 00-3192030c89fd7a60ef4c9749d6bdef0c-f4eeeee46f770061-01
    Request-Id: |3192030c89fd7a60ef4c9749d6bdef0c.f4eeeee46f770061.
    Request-Context: appId=cid-v1:c24f5e00-aa25-47f2-bbb5-035847e7f52a
    X-Powered-By: Azure API Management - http://api.azure.com/,ASP.NET
    X-AspNet-Version: 4.0.30319
    ```

The self-hosted gateway will now measure the request and send the metrics to the OpenTelemetry Collector.

2. Query Prometheus endpoint on collector on `http://<collector-service-ip>:8889/metrics`. You should see metrics similar to the following:

    ```raw
    # HELP azure_apim_BackendDurationInMs 
    # TYPE azure_apim_BackendDurationInMs histogram
    azure_apim_BackendDurationInMs_bucket{Hostname="20.71.82.110",le="5"} 0 1640093731340
    [...]
    azure_apim_BackendDurationInMs_count{Hostname="20.71.82.110"} 22 1640093731340
    # HELP azure_apim_ClientDurationInMs 
    # TYPE azure_apim_ClientDurationInMs histogram
    azure_apim_ClientDurationInMs_bucket{Hostname="20.71.82.110",le="5"} 22 1640093731340
    [...]
    azure_apim_ClientDurationInMs_count{Hostname="20.71.82.110"} 22 1640093731340
    # HELP azure_apim_DurationInMs 
    # TYPE azure_apim_DurationInMs histogram
    azure_apim_DurationInMs_bucket{Hostname="20.71.82.110",le="5"} 0 1640093731340
    [...]
    azure_apim_DurationInMs_count{Hostname="20.71.82.110"} 22 1640093731340
    # HELP azure_apim_GatewayDurationInMs 
    # TYPE azure_apim_GatewayDurationInMs histogram
    azure_apim_GatewayDurationInMs_bucket{Hostname="20.71.82.110",le="5"} 0 1640093731340
    [...]
    azure_apim_GatewayDurationInMs_count{Hostname="20.71.82.110"} 22 1640093731340
    # HELP azure_apim_Requests 
    # TYPE azure_apim_Requests counter
    azure_apim_Requests{BackendResponseCode="200",BackendResponseCodeCategory="2xx",Cache="None",GatewayId="Docs",Hostname="20.71.82.110",LastErrorReason="None",Location="GitHub",ResponseCode="200",ResponseCodeCategory="2xx",Status="Successful"} 22 1640093731340
    ```

## Cleaning up

Now that the tutorial is over, you can easily clean up your cluster as following:

1. Uninstall the self-hosted gateway Helm chart:
   
   ```console
   helm uninstall apim-gateway
   ```

2. Uninstall the OpenTelemetry Collector:
   
   ```console
   helm uninstall opentelemetry-collector
   ```

## Next steps

- To learn more about the self-hosted gateway, see [Self-hosted gateway overview](self-hosted-gateway-overview.md).
* To learn more about the [observability capabilities of the Azure API Management gateways](observability.md).
- [Deploy self-hosted gateway to Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
