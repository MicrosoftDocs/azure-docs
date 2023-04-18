---
title: Troubleshoot collection of Prometheus metrics in Azure Monitor (preview)
description: Steps that you can take if you aren't collecting Prometheus metrics as expected.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
ms.reviewer: aul
---

# Troubleshoot collection of Prometheus metrics in Azure Monitor (preview)

Follow the steps in this article to determine the cause of Prometheus metrics not being collected as expected in Azure Monitor.

Note that the ReplicaSet pod scrapes metrics from `kube-state-metrics` and custom scrape targets in the `ama-metrics-prometheus-config` configmap. The DaemonSet pods scrape metrics from the following targets on their respective node: `kubelet`, `cAdvisor`, `node-exporter`, and custom scrape targets in the `ama-metrics-prometheus-config-node` configmap. The pod that you will want to view the logs and the Prometheus UI for will depend on which scrape target you are investigating.

## Pod status

Check the pod status with the following command:

```
kubectl get pods -n kube-system | grep ama-metrics
```

- There should be one `ama-metrics-xxxxxxxxxx-xxxxx` replicaset pod, one `ama-metrics-ksm-*` pod, and an `ama-metrics-node-*` pod for each node on the cluster.
- Each pod state should be `Running` and have an equal number of restarts to the number of configmap changes that have been applied:

:::image type="content" source="media/prometheus-metrics-troubleshoot/pod-status.png" alt-text="Screenshot showing pod status." lightbox="media/prometheus-metrics-troubleshoot/pod-status.png":::

If each pod state is `Running` but one or more pods have restarts, run the following command:

```
kubectl describe pod <ama-metrics pod name> -n kube-system
```

- This provides the reason for the restarts. Pod restarts are expected if configmap changes have been made. If the reason for the restart is `OOMKilled`, the pod can't keep up with the volume of metrics. See the scale recommendations for the volume of metrics.

If the pods are running as expected, the next place to check is the container logs.

## Container logs
View the container logs with the following command:

```
kubectl logs <ama-metrics pod name> -n kube-system -c prometheus-collector
```

 At startup, any initial errors are printed in red, while warnings are printed in yellow. (Viewing the colored logs requires at least PowerShell version 7 or a linux distribution.)

- Verify if there's an issue with getting the authentication token:
    - The message *No configuration present for the AKS resource* will be logged every 5 minutes. 
    * The pod will restart every 15 minutes to try again with the error: *No configuration present for the AKS resource*.
- Verify there are no errors with parsing the Prometheus config, merging with any default scrape targets enabled, and validating the full config.
- Verify there are no errors from MetricsExtension regarding authenticating with the Azure Monitor workspace.
- Verify there are no errors from the OpenTelemetry collector about scraping the targets.

Run the following command:

```
kubectl logs <ama-metrics pod name> -n kube-system -c addon-token-adapter
```

- This will show an error if there's an issue with authenticating with the Azure Monitor workspace. Following is an example of logs with no issues:
- 
:::image type="content" source="media/prometheus-metrics-troubleshoot/addon-token-adapter.png" alt-text="Screenshot showing addon token log." lightbox="media/prometheus-metrics-troubleshoot/addon-token-adapter.png" :::

If there are no errors in the logs, the Prometheus interface can be used for debugging to verify the expected configuration and targets being scraped.

## Prometheus interface

Every `ama-metrics-*` pod has the Prometheus Agent mode User Interface available on port 9090/ Port forward into either the replicaset or the daemonset to check the config, service discovery and targets endpoints as described below. This is used to verify the custom configs are correct, the intended targets have been discovered for each job, and there are no errors with scraping specific targets.

Run the command `kubectl port-forward <ama-metrics pod> -n kube-system 9090`.

- Open a browser to the address `127.0.0.1:9090/config`. This will have the full scrape configs. Verify all jobs are included in the config.
:::image type="content" source="media/prometheus-metrics-troubleshoot/config-ui.png" alt-text="Screenshot showing configuration jobs." lightbox="media/prometheus-metrics-troubleshoot/config-ui.png":::


- Go to `127.0.0.1:9090/service-discovery` to view the targets discovered by the service discovery object specified and what the relabel_configs have filtered the targets to be. For example, if missing metrics from a certain pod, you can find if that pod was discovered and what its URI is. You can then use this URI when looking at the targets to see if there are any scrape errors. 
:::image type="content" source="media/prometheus-metrics-troubleshoot/service-discovery.png" alt-text="Screenshot showing service discovery." lightbox="media/prometheus-metrics-troubleshoot/service-discovery.png":::


- Go to `127.0.0.1:9090/targets` to view all jobs, the last time the endpoint for that job was scraped, and any errors 
:::image type="content" source="media/prometheus-metrics-troubleshoot/targets.png" alt-text="Screenshot showing targets." lightbox="media/prometheus-metrics-troubleshoot/targets.png":::

If there are no issues and the intended targets are being scraped, you can view the exact metrics being scraped by enabling debug mode.

## Debug mode

The metrics addon can be configured to run in debug mode by changing the configmap setting `enabled` under `debug-mode` to `true` by following the instructions [here](prometheus-metrics-scrape-configuration.md#debug-mode). This mode can affect performance and should only be enabled for a short time for debugging purposes.

When enabled, all Prometheus metrics that are scraped are hosted at port 9090. Run the following command:

```
kubectl port-forward <ama-metrics pod name> -n kube-system 9091
``` 

Go to `127.0.0.1:9091/metrics` in a browser to see if the metrics were scraped by the OpenTelemetry Collector. This can be done for every `ama-metrics-*` pod. If metrics aren't there, there could be an issue with the metric or label name lengths or the number of labels. See below for the service limits for Prometheus metrics.

## Metric names, label names & label values

Agent based scraping currently has the limitations in the following table:

| Property | Limit |
|:---|:---|
| Label name length | Less than or equal to 511 characters. When this limit is exceeded for any time-series in a job, the entire scrape job will fail, and metrics will be dropped from that job before ingestion. You can see up=0 for that job and also target Ux will show the reason for up=0. |
| Label value length | Less than or equal to 1023 characters. When this limit is exceeded for any time-series in a job, the entire scrape job will fail, and metrics will be dropped from that job before ingestion. You can see up=0 for that job and also target Ux will show the reason for up=0. |
| Number of labels per timeseries | Less than or equal to 63. When this limit is exceeded for any time-series in a job, the entire scrape job will fail, and metrics will be dropped from that job before ingestion. You can see up=0 for that job and also target Ux will show the reason for up=0. |
| Metric name length | Less than or equal to 511 characters. When this limit is exceeded for any time-series in a job, only that particular series will be dropped. MetricextensionConsoleDebugLog will have traces for the dropped metric. |

## Next steps

- [Check considerations for collecting metrics at high scale](prometheus-metrics-scrape-scale.md).
