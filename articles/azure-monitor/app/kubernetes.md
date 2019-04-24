---
title: Application Insights for Kubernetes | Microsoft Docs
description: Application Insight for Kubernetes is a monitoring solution that allows you to collect Application Insights telemetry pertaining to incoming and outgoing requests to and from pods running in your Kubernetes cluster. 
services: application-insights
author: lgayhardt
manager: carmonm
ms.service: application-insights
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: lagayhar
---

# Application Insights for Kubernetes

Application Insight for Kubernetes is a monitoring solution that allows you to collect Application Insights telemetry pertaining to incoming and outgoing requests to and from pods running in your Kubernetes cluster without the need for instrumenting the application with an SDK. We utilize service mesh technology called Istio to collect data, so the only requirement is that your Kubernetes deployment is [configured to run with Istio](#deploy-istio).

Since service mesh lifts data off the wire, we cannot intercept encrypted traffic. For traffic that doesn't leave the cluster, use plain unencrypted protocol (for example, HTTP). For external traffic that must be encrypted, consider setting up SSL termination at the ingress controller.

Applications running outside of the service mesh are not affected.

## Prerequisites

- A [Kubernetes cluster](https://docs.microsoft.com/en-us/azure/aks/concepts-clusters-workloads).
- Console access to the cluster to run *kubectl*.
- An [Application Insight resource](create-new-resource.md)


## Installation steps

To enable the solution, we'll be performing the following steps:
- Deploy the service mesh (if not already deployed)
- Deploy the application (if not already deployed)
- Ensure the application is part of the service mesh
- Observe collected telemetry

### Deploy Istio

We are currently using [Istio](https://istio.io/docs/concepts/what-is-istio/) as the service mesh technology. If your cluster doesn't have Istio deployed, you can learn how to [install and use Istio in Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/istio-install) or follow installation instructions on [Istio's official documentation](https://istio.io/docs/setup/kubernetes/).

### Configure your app to work with Istio

Istio supports two ways of [instrumenting a pod](https://istio.io/docs/setup/kubernetes/additional-setup/sidecar-injection/).
In most cases, it's easiest to mark the Kubernetes namespace containing your application with the *istio-injection* label:

```
kubectl label namespace <my-app-namespace> istio-injection=enabled
```

### Deploy your application

- Deploy your application to *my-app-namespace* namespace. If the application is already deployed, and you have followed the automatic
sidecar injection method described above, you need to recreate pods to ensure Istio injects its sidecar; either initiate a
rolling update or delete individual pods and wait for them to be recreated.
- Ensure your application complies with [Istio requirements](https://istio.io/docs/setup/kubernetes/prepare/requirements/).

### Deploy Application Insights for Kubernetes

1. Download and extract an [*Application Insights for Kubernetes* release](https://github.com/Microsoft/Application-Insights-Istio-Adapter/releases/).
2. Navigate to */src/kubernetes/* inside the release folder.
3. Edit *application-insights-istio-mixer-adapter-deployment.yaml*
    - edit the value of *ISTIO_MIXER_PLUGIN_AI_INSTRUMENTATIONKEY* environment variable to contain the instrumentation key of the Application Insights resource in Azure portal to contain the telemetry.
    - If necessary, edit the value of *ISTIO_MIXER_PLUGIN_WATCHLIST_NAMESPACES* environment variable to contain a comma-separated list of namespaces for which you would like to enable monitoring. Leave it blank to monitor all namespaces.
4. Apply *every* YAML file found under *src/kubernetes/* by running the following (you must still be inside */src/kubernetes/*):

   ```
   kubectl apply -f .
   ```

### Verify Application Insights for Kubernetes deployment

- Ensure Application Insights for Kubernetes adapter has been deployed:
  ```
  kubectl get pods -n istio-system -l "app=application-insights-istio-mixer-adapter"
  ```
> [!NOTE]
> In some cases, finer tuning is required. To include or exclude telemetry for an individual pod from being collected, use *appinsights/monitoring.enabled* label on that pod. This will have priority over all namespace-based configuration. Set *appinsights/monitoring.enabled* to *true* to include the pod, and to *false* to exclude it.

### View Application Insights telemetry

- Generate a sample request against your application to confirm that monitoring is functioning properly.
- Within 3-5 minutes, you should start seeing telemetry appear in Azure portal. Be sure to check out the *Application Map* section of your Application Insights resource in the Portal.

### Troubleshooting

Below is the troubleshooting flow to use when telemetry doesn't appear in Azure portal as expected.

1. Ensure the application is under load and is sending/receiving requests in plain HTTP. Since telemetry is lifted off the wire, encrypted traffic is not supported. If there are no incoming or outgoing requests, there will be no telemetry either.
2. Ensure the correct instrumentation key is provided in *ISTIO_MIXER_PLUGIN_AI_INSTRUMENTATIONKEY* environment variable in *application-insights-istio-mixer-adapter-deployment.yaml*. The instrumentation key is found on the *Overview* tab of the Application Insights resource in Azure portal.
3. Ensure the correct Kubernetes namespace is provided in *ISTIO_MIXER_PLUGIN_WATCHLIST_NAMESPACES* environment variable in *application-insights-istio-mixer-adapter-deployment.yaml*. Leave it blank to monitor all namespaces.
4. Ensure your application's pods have been sidecar-injected by Istio. Verify that Istio's sidecar exists on each pod.

   ```
   kubectl describe pod -n <my-app-namespace> <my-app-pod-name>
   ```
   Verify that there is a container named *istio-proxy* running on the pod.

5. View *Application Insights for Kubernetes* adapter's traces.

   ```
   kubectl get pods -n istio-system -l "app=application-insights-istio-mixer-adapter"
   kubectl logs -n istio-system application-insights-istio-mixer-adapter-<fill in from previous command output>
   ```

   The count of received telemetry items is updated once a minute. If it doesn't grow minute over minute - no telemetry is being sent to the adapter by Istio.
   Look for any errors in the log.
6. If it has been established that *Application Insight for Kubernetes* adapter is not being fed telemetry, check Istio's Mixer logs to figure out why it's not sending data to the adapter:

   ```
   kubectl get pods -n istio-system -l "istio=mixer,app=telemetry"
   kubectl logs -n istio-system istio-telemetry-<fill in from previous command output> -c mixer
   ```
   Look for any errors, especially pertaining to communications with *applicationinsightsadapter* adapter.
1. To learn more about how Istio functions, see [Istio's official documentation](https://istio.io/docs/concepts/what-is-istio/).

## FAQ

For the latest info for the progress on this project, visit the [Application Insights adapter for Istio Mixer project's GitHub](https://github.com/Microsoft/Application-Insights-Istio-Adapter/blob/master/SETUP.md#faq).

## Uninstall

To uninstall the product, for *every* YAML file found under *src/kubernetes/* run:

```
kubectl delete -f <filename.yaml>
```

To uninstall Istio, follow instructions [on Istio's documentation](https://istio.io/docs/setup/kubernetes/install/helm/#uninstall).

## Next steps

To learn more about how Azure Monitor and containers work together visit [Azure Monitor for containers overview](../../azure-monitor/insights/container-insights-overview.md)