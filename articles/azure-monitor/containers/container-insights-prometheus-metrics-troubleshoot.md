---
title: Troubleshoot collection of Prometheus metrics in Azure Monitor
description: Steps that you can take if you aren't collecting Prometheus metrics as expected.
ms.topic: conceptual
ms.date: 05/24/2022
ms.reviewer: aul
---

# Troubleshoot collection of Prometheus metrics in Azure Monitor

Follow the steps in this article to determine the cause of Prometheus metrics not being collected as expected.

## Pods Status

Check the pod status with the command `kubectl get pods -n kube-system | grep ama-metrics` and check the status of the pods.

:::image type="content" source="media/container-insights-prometheus-metrics-troubleshoot/pod-status.png" lightbox="media/container-insights-prometheus-metrics-troubleshoot/pod-status.png" alt-text="Screenshot showing pod status.":::

If pod state is `Running` but has restarts, run `kubectl describe pod <ama-metrics pod> -n kube-system`.

If the reason for the restart is `OOMKilled`, the pod cannot keep up with the volume of metrics. The memory limit can be increased using the values in the helm chart for both the replicaset and the daemonset. Pod restarts are expected if configmap changes have been made.

## Container Logs
View the container logs with the command `kubectl get logs <ama-metrics pod> -n kube-system`.

- Check there are no errors with parsing the Prometheus config, merging with any default scrape targets enabled, and validating the full config.
- Check if there are errors from MetricsExtension for authenticating with the MDM account.
- Check if there are errors from the OpenTelemetry collector for scraping.

Run the command `kubectl logs <ama-metrics pod> -n kube-system -c addon-token-adapter`.

:::image type="content" source="media/container-insights-prometheus-metrics-troubleshoot/addon-token-adapter.png" lightbox="media/container-insights-prometheus-metrics-troubleshoot/addon-token-adapter.png" alt-text="Screenshot showing addon token log.":::

Run the command `kubectl logs <ama-metrics pod> -n kube-system -c prometheus-collector`.

     
- At startup, any initial errors will be printed in red. Warnings will be printed in yellow. To view colors, you require at least PowerShell version 7 or a linux distribution.
- If there's an issue getting the auth token.
    - The message *No configuration present for the AKS resource* will be logged every 5 minutes. 
    * The pod will restart every 15 minutes to try again with the error: *No configuration present for the AKS resource*.


Run the command `kubectl describe pod ama-metrics -n kube-system`. This should provide the reason for any restarts. If `otelcollector` is not running, the container may have been OOM-killed. See the scale recommendations for the volume of metrics.


## Prometheus interface

Port forward into either the replicaset or the daemonset to check the config, service discovery and targets endpoints as described below.

Run the command `kubectl port-forward <ama-metrics pod> -n kube-system 9090`.


Open a browser to the address `127.0.0.1:9090/config`. This will have the full scrape configs. Check that the job is listed.

:::image type="content" source="media/container-insights-prometheus-metrics-troubleshoot/config-ui.png" lightbox="media/container-insights-prometheus-metrics-troubleshoot/config-ui.png" alt-text="Screenshot showing configuration jobs.":::


Go to `127.0.0.1:9090/service-discovery` to view the targets discovered by the service discovery object specified and what the relabel_configs have filtered the targets to 

:::image type="content" source="media/container-insights-prometheus-metrics-troubleshoot/service-discovery.png" lightbox="media/container-insights-prometheus-metrics-troubleshoot/service-discovery.png" alt-text="Screenshot showing service discovery.":::


Go to `127.0.0.1:9090/targets` to view all jobs, the last time the endpoint for that job was scraped, and any errors 

:::image type="content" source="media/container-insights-prometheus-metrics-troubleshoot/targets.png" lightbox="media/container-insights-prometheus-metrics-troubleshoot/targets.png" alt-text="Screenshot showing targets.":::


Check that all custom configs are correct, the targets have been discovered for the job, and there are no errors scraping specific targets.

For example, if you're missing metrics from a certain pod:
- Go to /config to check if scrape job is present with correct settings.
- Go to /service-discovery to find the url of the discovered pod.
- Go to /targets to see if there's an issue scraping that url.
- If there's no issue, follow debug-mode instructions, and see if metrics expected are there.
- If metrics are not there, it could be an issue with the name length or number of labels. See service limits for Prometheus metrics.

## Debug mode
The metrics addon can be configured to run in debug mode by changing the setting `enabled` to true following from [here](https://github.com/Azure/prometheus-collector/blob/temp/documentation/otelcollector/docs/publicpreviewdocs/rashmi/ama-metrics-settings-readme.md#debug-mode). This mode can affect performance and should only be enabled for a short time for debugging purposes


An extra server is created that hosts all the metrics scraped. Run `kubectl port-forward <ama-metrics pod> -n kube-system 9091` and go to `127.0.0.1:9091/metrics` in a browser to see if the metrics were scraped by the OpenTelemetry Collector. This can be done for both the replicaset and daemonset pods if advanced mode is enabled 



### Metric names, label names & label values

Agent based scraping currently has the limitations in the following table:

| Property | Limit |
|:---|:---|
| Label name length | Less than or equal to 511 characters. When this limit is exceeded for any time-series in a job, the entire scrape job will fail, and metrics will be dropped from that job before ingestion. You can see up=0 for that job and also target Ux will show the reason for up=0. |
| Label value length | Less than or equal to 1023 characters. When this limit is exceeded for any time-series in a job, the entire scrape job will fail, and metrics will be dropped from that job before ingestion. You can see up=0 for that job and also target Ux will show the reason for up=0. |
| Number of labels per timeseries | Less than or equal to 63. When this limit is exceeded for any time-series in a job, the entire scrape job will fail, and metrics will be dropped from that job before ingestion. You can see up=0 for that job and also target Ux will show the reason for up=0. |
| Metric name length | Less than or equal to 511 characters. When this limit is exceeded for any time-series in a job, only that particular series will be dropped. MetricextensionConsoleDebugLog will have traces for the dropped metric. |
