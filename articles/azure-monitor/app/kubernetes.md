---
title: Use Application Insights to monitor your Azure Kubernetes Service (AKS) or other Kubernetes hosted applications - Azure Monitor | Microsoft Docs
description: Azure Monitor uses service mesh technology, Istio, on your Kubernetes cluster to provide application monitoring for any Kubernetes hosted application. This allows you to collect Application Insights telemetry pertaining to incoming and outgoing requests to and from pods running in your cluster.
ms.topic: conceptual
author: tokaplan
ms.author: alkaplan
ms.date: 04/25/2019

---

# Zero instrumentation application monitoring for Kubernetes hosted applications with Istio - DEPRECATED

> [!IMPORTANT]
> This functionality is currently being deprecated and will no longer be supported after August 1st, 2020.
> Currently the codeless monitoring can only be enabled for [Java through standalone agent](https://docs.microsoft.com/azure/azure-monitor/app/java-in-process-agent). For other languages, use the SDKs to monitor your apps on AKS: [ASP.Net Core](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core), [ASP.Net](https://docs.microsoft.com/azure/azure-monitor/app/asp-net), [Node.js](https://docs.microsoft.com/azure/azure-monitor/app/nodejs), [JavaScript](https://docs.microsoft.com/azure/azure-monitor/app/javascript), and [Python](https://docs.microsoft.com/azure/azure-monitor/app/opencensus-python).

Azure Monitor now leverages service mesh tech on your Kubernetes cluster to provide out of the box application monitoring for any Kubernetes hosted app. With default Application Insight features like [Application Map](../../azure-monitor/app/app-map.md) to model your dependencies, [Live Metrics Stream](../../azure-monitor/app/live-stream.md) for real-time monitoring, powerful visualizations with the [default dashboard](../../azure-monitor/app/overview-dashboard.md), [Metric Explorer](../../azure-monitor/platform/metrics-getting-started.md), and [Workbooks](../../azure-monitor/platform/workbooks-overview.md). This feature will help users spot performance bottlenecks and failure hotspots across all of their Kubernetes workloads within a selected Kubernetes namespace. By capitalizing on your existing service mesh investments with technologies like Istio, Azure Monitor enables auto-instrumented app monitoring without any modification to your application's code.

> [!NOTE]
> This is one of many ways to perform application monitoring on Kubernetes​​​​​​​. You can also instrument any app hosted in Kubernetes by using the [Application Insights SDK](../../azure-monitor/azure-monitor-app-hub.yml) without the need for a service mesh. To monitor Kubernetes without instrumenting the application with an SDK you can use the below method.

## Prerequisites

- A [Kubernetes cluster](https://docs.microsoft.com/azure/aks/concepts-clusters-workloads).
- Console access to the cluster to run *kubectl*.
- An [Application Insight resource](create-new-resource.md)
- Have a service mesh. If your cluster doesn't have Istio deployed, you can learn how to [install and use Istio in Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/istio-install).

## Capabilities

By using zero instrumentation application monitoring for Kubernetes hosted apps, you will be able to use:

- [Application Map](../../azure-monitor/app/app-map.md)
- [Live Stream Metrics](../../azure-monitor/app/live-stream.md)
- [Dashboards](../../azure-monitor/app/overview-dashboard.md)
- [Metrics Explorer](../../azure-monitor/platform/metrics-getting-started.md)
- [Distributed-tracing](../../azure-monitor/app/distributed-tracing.md)
- [End-to-end transaction monitoring](../../azure-monitor/learn/tutorial-performance.md#identify-slow-server-operations)

## Installation steps

To enable the solution, we'll be performing the following steps:
- Deploy the application (if not already deployed).
- Ensure the application is part of the service mesh.
- Observe collected telemetry.

### Configure your app to work with a service mesh

Istio supports two ways of [instrumenting a pod](https://istio.io/docs/setup/kubernetes/additional-setup/sidecar-injection/).
In most cases, it's easiest to mark the Kubernetes namespace containing your application with the *istio-injection* label:

```console
kubectl label namespace <my-app-namespace> istio-injection=enabled
```

> [!NOTE]
> Since service mesh lifts data off the wire, we cannot intercept the encrypted traffic. For traffic that doesn't leave the cluster, use  an unencrypted protocol (for example, HTTP). For external traffic that must be encrypted, consider [setting up TLS termination](https://kubernetes.io/docs/concepts/services-networking/ingress/#tls) at the ingress controller.

Applications running outside of the service mesh are not affected.

### Deploy your application

- Deploy your application to *my-app-namespace* namespace. If the application is already deployed, and you have followed the automatic
sidecar injection method described above, you need to recreate pods to ensure Istio injects its sidecar; either initiate a
rolling update or delete individual pods and wait for them to be recreated.
- Ensure your application complies with [Istio requirements](https://istio.io/docs/setup/kubernetes/prepare/requirements/).

### Deploy zero instrumentation application monitoring for Kubernetes hosted apps

1. Download and extract an [*Application Insights adapter* release](https://github.com/Microsoft/Application-Insights-Istio-Adapter/releases/).
2. Navigate to */src/kubernetes/* inside the release folder.
3. Edit *application-insights-istio-mixer-adapter-deployment.yaml*
    - edit the value of *ISTIO_MIXER_PLUGIN_AI_INSTRUMENTATIONKEY* environment variable to contain the instrumentation key of the Application Insights resource in Azure portal to contain the telemetry.
    - If necessary, edit the value of *ISTIO_MIXER_PLUGIN_WATCHLIST_NAMESPACES* environment variable to contain a comma-separated list of namespaces for which you would like to enable monitoring. Leave it blank to monitor all namespaces.
4. Apply *every* YAML file found under *src/kubernetes/* by running the following (you must still be inside */src/kubernetes/*):

   ```console
   kubectl apply -f .
   ```

### Verify deployment

- Ensure Application Insights adapter has been deployed:

  ```console
  kubectl get pods -n istio-system -l "app=application-insights-istio-mixer-adapter"
  ```
> [!NOTE]
> In some cases, fine-tuning tuning is required. To include or exclude telemetry for an individual pod from being collected, use *appinsights/monitoring.enabled* label on that pod. This will have priority over all namespace-based configuration. Set *appinsights/monitoring.enabled* to *true* to include the pod, and to *false* to exclude it.

### View Application Insights telemetry

- Generate a sample request against your application to confirm that monitoring is functioning properly.
- Within 3-5 minutes, you should start seeing telemetry appear in the Azure portal. Be sure to check out the *Application Map* section of your Application Insights resource in the Portal.

## Troubleshooting

Below is the troubleshooting flow to use when telemetry doesn't appear in the Azure portal as expected.

1. Ensure the application is under load and is sending/receiving requests in plain HTTP. Since telemetry is lifted off the wire, encrypted traffic is not supported. If there are no incoming or outgoing requests, there will be no telemetry either.
2. Ensure the correct instrumentation key is provided in the *ISTIO_MIXER_PLUGIN_AI_INSTRUMENTATIONKEY* environment variable in *application-insights-istio-mixer-adapter-deployment.yaml*. The instrumentation key is found on the *Overview* tab of the Application Insights resource in the Azure portal.
3. Ensure the correct Kubernetes namespace is provided in the *ISTIO_MIXER_PLUGIN_WATCHLIST_NAMESPACES* environment variable in *application-insights-istio-mixer-adapter-deployment.yaml*. Leave it blank to monitor all namespaces.
4. Ensure your application's pods have been sidecar-injected by Istio. Verify that Istio's sidecar exists on each pod.

   ```console
   kubectl describe pod -n <my-app-namespace> <my-app-pod-name>
   ```
   Verify that there is a container named *istio-proxy* running on the pod.

5. View the Application Insights adapter's traces.

   ```console
   kubectl get pods -n istio-system -l "app=application-insights-istio-mixer-adapter"
   kubectl logs -n istio-system application-insights-istio-mixer-adapter-<fill in from previous command output>
   ```

   The count of received telemetry items is updated once a minute. If it doesn't grow minute over minute - no telemetry is being sent to the adapter by Istio.
   Look for any errors in the log.
6. If it has been established that *Application Insight for Kubernetes* adapter is not being fed telemetry, check Istio's Mixer logs to figure out why it's not sending data to the adapter:

   ```console
   kubectl get pods -n istio-system -l "istio=mixer,app=telemetry"
   kubectl logs -n istio-system istio-telemetry-<fill in from previous command output> -c mixer
   ```
   Look for any errors, especially pertaining to communications with *applicationinsightsadapter* adapter.

## FAQ

For the latest info for the progress on this project, visit the [Application Insights adapter for Istio Mixer project's GitHub](https://github.com/Microsoft/Application-Insights-Istio-Adapter/blob/master/SETUP.md#faq).

## Uninstall

To uninstall the product, for *every* YAML file found under *src/kubernetes/* run:

```console
kubectl delete -f <filename.yaml>
```


## Next steps

To learn more about how Azure Monitor and containers work together visit [Azure Monitor for containers overview](../../azure-monitor/insights/container-insights-overview.md)
