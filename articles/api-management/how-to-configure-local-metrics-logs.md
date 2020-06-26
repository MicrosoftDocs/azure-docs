---
title: Configure local metrics and logs for Azure API Management self-hosted gateway | Microsoft Docs
description: Learn how to configure local metrics and logs for Azure API Management self-hosted gateway
services: api-management
documentationcenter: ''
author: miaojiang
manager: gwallace
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 04/30/2020
ms.author: apimpm

---

# Configure local metrics and logs for Azure API Management self-hosted gateway

This article provides details for configuring local metrics and logs for the [self-hosted gateway](./self-hosted-gateway-overview.md). For configuring cloud metrics and logs, see [this article](how-to-configure-cloud-metrics-logs.md). 

## Metrics
The self-hosted gateway supports [StatsD](https://github.com/statsd/statsd), which has become a unifying protocol for metrics collection and aggregation. This section walks through the steps for deploying StatsD to Kubernetes, configuring the gateway to emit metrics via StatsD, and using [Prometheus](https://prometheus.io/) to monitor the metrics. 

### Deploy StatsD and Prometheus to the cluster

Below is a sample YAML configuration for deploying StatsD and Prometheus to the Kubernetes cluster where a self-hosted gateway is deployed. It also creates a [Service](https://kubernetes.io/docs/concepts/services-networking/service/) for each. The self-hosted gateway will publish metrics to the StatsD Service. We will access the Prometheus dashboard via its Service.   

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: sputnik-metrics-config
data:
  statsd.yaml: ""
  prometheus.yaml: |
    global:
      scrape_interval:     3s
      evaluation_interval: 3s
    scrape_configs:
      - job_name: 'prometheus'
        static_configs:
          - targets: ['localhost:9090']
      - job_name: 'test_metrics'
        static_configs:
          - targets: ['localhost:9102']
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sputnik-metrics
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sputnik-metrics
  template:
    metadata:
      labels:
        app: sputnik-metrics
    spec:
      containers:
      - name: sputnik-metrics-statsd
        image: prom/statsd-exporter
        ports:
        - name: tcp
          containerPort: 9102
        - name: udp
          containerPort: 8125
          protocol: UDP
        args:
          - --statsd.mapping-config=/tmp/statsd.yaml
          - --statsd.listen-udp=:8125
          - --web.listen-address=:9102
        volumeMounts:
          - mountPath: /tmp
            name: sputnik-metrics-config-files
      - name: sputnik-metrics-prometheus
        image: prom/prometheus
        ports:
        - name: tcp
          containerPort: 9090
        args:
          - --config.file=/tmp/prometheus.yaml
        volumeMounts:
          - mountPath: /tmp
            name: sputnik-metrics-config-files
      volumes:
        - name: sputnik-metrics-config-files
          configMap:
            name: sputnik-metrics-config
---
apiVersion: v1
kind: Service
metadata:
  name: sputnik-metrics-statsd
spec:
  type: NodePort
  ports:
  - name: udp
    port: 8125
    targetPort: 8125
    protocol: UDP
  selector:
    app: sputnik-metrics
---
apiVersion: v1
kind: Service
metadata:
  name: sputnik-metrics-prometheus
spec:
  type: LoadBalancer
  ports:
  - name: http
    port: 9090
    targetPort: 9090
  selector:
    app: sputnik-metrics
```

Save the configurations to a file named `metrics.yaml` and use the below command to deploy everything to the cluster:

```console
kubectl apply -f metrics.yaml
```

Once the deployment finishes, run the below command to check the Pods are running. Note that your pod name will be different. 

```console
kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
sputnik-metrics-f6d97548f-4xnb7        2/2     Running   0          1m
```

Run the below command to check the Services are running. Take a note of the `CLUSTER-IP` and `PORT` of the StatsD Service, we would need it later. You can visit the Prometheus dashboard using its `EXTERNAL-IP` and `PORT`.

```console
kubectl get services
NAME                         TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE
sputnik-metrics-prometheus   LoadBalancer   10.0.252.72   13.89.141.90    9090:32663/TCP               18h
sputnik-metrics-statsd       NodePort       10.0.41.179   <none>          8125:32733/UDP               18h
```

### Configure the self-hosted gateway to emit metrics

Now that both StatsD and Prometheus have been deployed, we can update the configurations of the self-hosted gateway to start emitting  metrics through StatsD. The feature can be enabled or disabled using the `telemetry.metrics.local` key in the ConfigMap of the self-hosted gateway Deployment with additional options. Below is a breakdown of the available options:

| Field  | Default | Description |
| ------------- | ------------- | ------------- |
| telemetry.metrics.local  | `none` | Enables logging through StatsD. Value can be `none`, `statsd`. |
| telemetry.metrics.local.statsd.endpoint  | n/a | Specifies StatsD endpoint. |
| telemetry.metrics.local.statsd.sampling  | n/a | Specifies metrics sampling rate. Value can be between 0 and 1. e.g., `0.5`|
| telemetry.metrics.local.statsd.tag-format  | n/a | StatsD exporter [tagging format](https://github.com/prometheus/statsd_exporter#tagging-extensions). Value can be `none`, `librato`, `dogStatsD`, `influxDB`. |

Here is a sample configuration:

```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
        name: contoso-gateway-environment
    data:
        config.service.endpoint: "<self-hosted-gateway-management-endpoint>"
        telemetry.metrics.local: "statsd"
        telemetry.metrics.local.statsd.endpoint: "10.0.41.179:8125"
        telemetry.metrics.local.statsd.sampling: "1"
        telemetry.metrics.local.statsd.tag-format: "dogStatsD"
```

Update the YAML file of the self-hosted gateway deployment with the above configurations and apply the changes using the below command: 

```console
kubectl apply -f <file-name>.yaml
 ```

To pick up the latest configuration changes, restart the gateway deployment using the below command:

```console
kubectl rollout restart deployment/<deployment-name>
```

### View the metrics

Now we have everything deployed and configured, the self-hosted gateway should report metrics via StatsD. Prometheus will pick up the metrics from StatsD. Go to the Prometheus dashboard using the `EXTERNAL-IP` and `PORT` of the Prometheus Service. 

Make some API calls through the self-hosted gateway, if everything is configured correctly, you should be able to view below metrics:

| Metric  | Description |
| ------------- | ------------- |
| Requests  | Number of API requests in the period |
| DurationInMS | Number of milliseconds from the moment gateway received request until the moment response sent in full |
| BackendDurationInMS | Number of milliseconds spent on overall backend IO (connecting, sending and receiving bytes)  |
| ClientDurationInMS | Number of milliseconds spent on overall client IO (connecting, sending and receiving bytes)  |

## Logs

The self-hosted gateway outputs logs to `stdout` and `stderr` by default. You can easily view the logs using the following command:

```console
kubectl logs <pod-name>
```

If your self-hosted gateway is deployed in Azure Kubernetes Service, you can enable [Azure Monitor for containers](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-overview) to collect `stdout` and `stderr` from your workloads and view the logs in Log Analytics. 

The self-hosted gateway also supports a number of protocols including `localsyslog`, `rfc5424`, and `journal`. The below table summarizes all the options supported. 

| Field  | Default | Description |
| ------------- | ------------- | ------------- |
| telemetry.logs.std  | `text` | Enables logging to standard streams. Value can be `none`, `text`, `json` |
| telemetry.logs.local  | `none` | Enables local logging. Value can be `none`, `auto`, `localsyslog`, `rfc5424`, `journal`  |
| telemetry.logs.local.localsyslog.endpoint  | n/a | Specifies localsyslog endpoint.  |
| telemetry.logs.local.localsyslog.facility  | n/a | Specifies localsyslog [facility code](https://en.wikipedia.org/wiki/Syslog#Facility). e.g., `7` 
| telemetry.logs.local.rfc5424.endpoint  | n/a | Specifies rfc5424 endpoint.  |
| telemetry.logs.local.rfc5424.facility  | n/a | Specifies facility code per [rfc5424](https://tools.ietf.org/html/rfc5424). e.g., `7`  |
| telemetry.logs.local.journal.endpoint  | n/a | Specifies journal endpoint.  |

Here is a sample configuration of local logging:

```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
        name: contoso-gateway-environment
    data:
        config.service.endpoint: "<self-hosted-gateway-management-endpoint>"
        telemetry.logs.std: "text"
        telemetry.logs.local.localsyslog.endpoint: "/dev/log"
        telemetry.logs.local.localsyslog.facility: "7"
```
 
## Next steps

* To learn more about the self-hosted gateway, see [Azure API Management self-hosted gateway overview](self-hosted-gateway-overview.md)
* Learn about [configuring and persisting logs in the cloud](how-to-configure-local-metrics-logs.md)

