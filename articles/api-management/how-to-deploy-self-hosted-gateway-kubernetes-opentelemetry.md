---
title: Deploy a Self-Hosted Gateway to Kubernetes with OpenTelemetry
description: Learn how to deploy a self-hosted gateway component of Azure API Management on Kubernetes with OpenTelemetry integration.
author: tomkerkhove

ms.service: azure-api-management
ms.topic: how-to
ms.author: tomkerkhove
ms.date: 02/19/2026
---

# Deploy a self-hosted gateway to Kubernetes with OpenTelemetry integration

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

This article explains how to deploy the self-hosted gateway component of Azure API Management to a Kubernetes cluster, and automatically send all metrics to an [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/).

You learn how to:

> [!div class="checklist"]
> * Configure and deploy a standalone OpenTelemetry Collector on Kubernetes.
> * Deploy the self-hosted gateway with OpenTelemetry metrics.
> * Generate metrics by consuming APIs on the self-hosted gateway.
> * Use the metrics from the OpenTelemetry Collector.

## Prerequisites

- Create an [Azure API Management instance](get-started-create-service-instance.md).
- Create an Azure Kubernetes cluster [using the Azure CLI](/azure/aks/learn/quick-kubernetes-deploy-cli), [using Azure PowerShell](/azure/aks/learn/quick-kubernetes-deploy-powershell), or [using the Azure portal](/azure/aks/learn/quick-kubernetes-deploy-portal).
- Provision a [self-hosted gateway resource in your API Management instance](api-management-howto-provision-self-hosted-gateway.md).
- Install [Helm](https://helm.sh/docs/intro/install/).

## Introduction to OpenTelemetry

[OpenTelemetry](https://opentelemetry.io) is a set of open-source tools and frameworks for logging, metrics, and tracing in a vendor-neutral way.

The self-hosted gateway can be configured to automatically collect and send metrics to an [OpenTelemetry Collector](https://opentelemetry.io/docs/concepts/components/#collector). This allows you to bring your own metrics collection and reporting solution for the self-hosted gateway.

> [!NOTE]
> OpenTelemetry is an incubating project of the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io) ecosystem.

### Metrics

The self-hosted gateway automatically starts measuring the following metrics:

- Requests
- DurationInMs
- BackendDurationInMs
- ClientDurationInMs
- GatewayDurationInMs

They're automatically exported to the configured OpenTelemetry Collector every minute with additional dimensions.

## Deploy the OpenTelemetry Collector

Start by deploying a standalone OpenTelemetry Collector on Kubernetes by using Helm.

> [!TIP]
> Although we use the Collector Helm chart, they also provide an [OpenTelemetry Collector Operator](https://github.com/open-telemetry/opentelemetry-helm-charts/tree/main/charts/opentelemetry-operator).

To start with, add the Helm chart repository.

1. Add the Helm repository by using the following command.

    ```console
    helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
    ```

1. Update the repo to fetch the latest Helm charts.

   ```console
   helm repo update
   ```

1. Verify your Helm configuration by listing all available charts.

   ```console
   helm search repo open-telemetry
   ```

   The following example shows the available charts.

   ```output
   NAME                                    CHART VERSION   APP VERSION     DESCRIPTION
   open-telemetry/opentelemetry-collector  0.8.1           0.37.1          OpenTelemetry Collector Helm chart for Kubernetes
   open-telemetry/opentelemetry-operator   0.4.0           0.37.0          OpenTelemetry Operator Helm chart for Kubernetes
   ```

Now that you have the chart repository configured, you can deploy the OpenTelemetry Collector to your cluster:

1. Create a local configuration file called *opentelemetry-collector-config.yml* with the following configuration:

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

    This allows us to use a standalone collector with the Prometheus exporter being exposed on port `8889`. To expose the Prometheus metrics, we ask the Helm chart to configure a `LoadBalancer` service.

    > [!NOTE]
    > You are disabling the compact Jaeger port because it uses UDP, and `LoadBalancer` service doesn't allow you to have multiple protocols at the same time.

1. Install the Helm chart with your configuration.

    ```console
    helm install opentelemetry-collector open-telemetry/opentelemetry-collector --values ./opentelemetry-collector-config.yml
    ```

1. Verify the installation by getting all the resources for your Helm chart.

    ```console
    kubectl get all -l app.kubernetes.io/instance=opentelemetry-collector
    ```

    ```output
    NAME                                           READY   STATUS    RESTARTS   AGE
    pod/opentelemetry-collector-58477c8c89-dstwd   1/1     Running   0          27m

    NAME                              TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)                                                                                       AGE
    service/opentelemetry-collector   LoadBalancer   10.0.175.135   20.103.18.53   14250:30982/TCP,14268:32461/TCP,4317:31539/TCP,4318:31581/TCP,8889:32420/TCP,9411:30003/TCP   27m

    NAME                                      READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/opentelemetry-collector   1/1     1            1           27m

    NAME                                                 DESIRED   CURRENT   READY   AGE
    replicaset.apps/opentelemetry-collector-58477c8c89   1         1         1       27m
    ```
    
1. Take note of the external IP of the service, so you can query it later on.

With your OpenTelemetry Collector installed, you can now deploy the self-hosted gateway to your cluster.

## Deploy the self-hosted gateway

> [!IMPORTANT]
> For a detailed overview on how to deploy the self-hosted gateway with Helm and how to get the required configuration, see [Deploy a self-hosted gateway to Kubernetes by using Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md).

In this section, you deploy the self-hosted gateway to your cluster with Helm and configure it to send OpenTelemetry metrics to the OpenTelemetry Collector.

[!INCLUDE [api-management-self-hosted-gateway-authentication](../../includes/api-management-self-hosted-gateway-authentication.md)]

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
    > `opentelemetry-collector` in this command is the name of the OpenTelemetry Collector. Update the name if your service has a different name.

1. Verify the installation by getting all the resources for the Helm chart.
 
    ```console
    kubectl get all -l app.kubernetes.io/instance=apim-gateway
    ```

    ```output
    NAME                                                            READY   STATUS    RESTARTS   AGE
    pod/apim-gateway-azure-api-management-gateway-fb77c6d49-rffwq   1/1     Running   0          63m

    NAME                                                TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)                         AGE
    service/apim-gateway-azure-api-management-gateway   LoadBalancer   10.0.67.177   20.71.82.110   8080:32267/TCP,8081:32065/TCP   63m

    NAME                                                        READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/apim-gateway-azure-api-management-gateway   1/1     1            1           63m

    NAME                                                                  DESIRED   CURRENT   READY   AGE
    replicaset.apps/apim-gateway-azure-api-management-gateway-fb77c6d49   1         1         1       63m
    ```
    
1. Take note of the external IP of the self-hosted gateway's service, so you can query it later on.

## Generate and consume the OpenTelemetry metrics

Now that both your OpenTelemetry Collector and the self-hosted gateway are deployed, you can start consuming the APIs to generate metrics.

> [!NOTE]
> You consume the default *Echo API* for this walkthrough.
> 
> Make sure that it's configured to:
> - Allow HTTP requests
> - Allow your self-hosted gateway to expose it

1. Query the Echo API in the self-hosted gateway.

    ```console
    curl -i "http://<self-hosted-gateway-ip>:8080/echo/resource?param1=sample&subscription-key=abcdef0123456789"
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
    Request-Context: appId=cid-v1:00001111-aaaa-2222-bbbb-3333cccc4444
    X-Powered-By: Azure API Management - http://api.azure.com/,ASP.NET
    X-AspNet-Version: 4.0.30319
    ```

    The self-hosted gateway measures the request and sends the metrics to the OpenTelemetry Collector.

1. Query Prometheus endpoint on collector on `http://<collector-service-ip>:8889/metrics`. You should see metrics similar to the following example:

    ```output
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

## Clean up resources

After you complete the tutorial, you can easily clean up your cluster by using the following commands.

1. Uninstall the self-hosted gateway Helm chart.
   
   ```console
   helm uninstall apim-gateway
   ```

1. Uninstall the OpenTelemetry Collector.
   
   ```console
   helm uninstall opentelemetry-collector
   ```

## Related content

* [Self-hosted gateway overview](self-hosted-gateway-overview.md)
* [Observability in Azure API Management](observability.md)
* [Deploy an Azure API Management gateway on Azure Arc](how-to-deploy-self-hosted-gateway-azure-arc.md)
