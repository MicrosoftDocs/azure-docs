---
title: Configure local metrics and logs for Azure API Management self-hosted gateway | Microsoft Docs
description: Learn how to configure local metrics and logs for Azure API Management self-hosted gateway on a Kubernetes cluster.
services: api-management
author: dlepow
manager: gwallace
ms.service: azure-api-management
ms.topic: article
ms.date: 04/12/2024
ms.author: danlep
---

# Configure local metrics and logs for Azure API Management self-hosted gateway

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

This article provides details for configuring local metrics and logs for the [self-hosted gateway](./self-hosted-gateway-overview.md) deployed on a Kubernetes cluster. For configuring cloud metrics and logs, see [this article](how-to-configure-cloud-metrics-logs.md).

## Metrics

The self-hosted gateway supports [StatsD](https://github.com/statsd/statsd), which has become a unifying protocol for metrics collection and aggregation. This section walks through the steps for deploying StatsD to Kubernetes, configuring the gateway to emit metrics via StatsD, and using [Prometheus](https://prometheus.io/) to monitor the metrics.

### Deploy StatsD and Prometheus to the cluster

The following sample YAML configuration deploys StatsD and Prometheus to the Kubernetes cluster where a self-hosted gateway is deployed. It also creates a [Service](https://kubernetes.io/docs/concepts/services-networking/service/) for each. The self-hosted gateway then publishes metrics to the StatsD Service. We'll access the Prometheus dashboard via its Service.

> [!NOTE]
> The following example pulls public container images from Docker Hub. We recommend that you set up a pull secret to authenticate using a Docker Hub account instead of making an anonymous pull request. To improve reliability when working with public content, import and manage the images in a private Azure container registry. [Learn more about working with public images.](/azure/container-registry/buffer-gate-public-content)

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

Save the configurations to a file named `metrics.yaml`. Use the following command to deploy everything to the cluster:

```console
kubectl apply -f metrics.yaml
```

Once the deployment finishes, run the following command to check the Pods are running. Your pod name will be different.

```console
kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
sputnik-metrics-f6d97548f-4xnb7        2/2     Running   0          1m
```

Run the below command to check the `services` are running. Take a note of the `CLUSTER-IP` and `PORT` of the StatsD Service, which we use later. You can visit the Prometheus dashboard using its `EXTERNAL-IP` and `PORT`.

```console
kubectl get services
NAME                         TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE
sputnik-metrics-prometheus   LoadBalancer   10.0.252.72   13.89.141.90    9090:32663/TCP               18h
sputnik-metrics-statsd       NodePort       10.0.41.179   <none>          8125:32733/UDP               18h
```

### Configure the self-hosted gateway to emit metrics

Now that both StatsD and Prometheus are deployed, we can update the configurations of the self-hosted gateway to start emitting  metrics through StatsD. The feature can be enabled or disabled using the `telemetry.metrics.local` key in the ConfigMap of the self-hosted gateway Deployment with additional options. The following are the available options:

| Field  | Default | Description |
| ------------- | ------------- | ------------- |
| telemetry.metrics.local  | `none` | Enables logging through StatsD. Value can be `none`, `statsd`. |
| telemetry.metrics.local.statsd.endpoint  | n/a | Specifies StatsD endpoint. |
| telemetry.metrics.local.statsd.sampling  | n/a | Specifies metrics sampling rate. Value can be between 0 and 1. Example: `0.5`|
| telemetry.metrics.local.statsd.tag-format  | n/a | StatsD exporter [tagging format](https://github.com/prometheus/statsd_exporter#tagging-extensions). Value can be `none`, `librato`, `dogStatsD`, `influxDB`. |

Here's a sample configuration:

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

Now we have everything deployed and configured, the self-hosted gateway should report metrics via StatsD. Prometheus then picks up the metrics from StatsD. Go to the Prometheus dashboard using the `EXTERNAL-IP` and `PORT` of the Prometheus Service.

Make some API calls through the self-hosted gateway, if everything is configured correctly, you should be able to view below metrics:

| Metric        | Description |
| ------------- | ------------- |
| requests_total  | Number of API requests in the period |
| request_duration_seconds | Number of milliseconds from the moment gateway received request until the moment response sent in full |
| request_backend_duration_seconds | Number of milliseconds spent on overall backend IO (connecting, sending, and receiving bytes)  |
| request_client_duration_seconds | Number of milliseconds spent on overall client IO (connecting, sending, and receiving bytes)  |

## Logs

The self-hosted gateway outputs logs to `stdout` and `stderr` by default. You can easily view the logs using the following command:

```console
kubectl logs <pod-name>
```

If your self-hosted gateway is deployed in Azure Kubernetes Service, you can enable [Azure Monitor for containers](/azure/azure-monitor/containers/container-insights-overview) to collect `stdout` and `stderr` from your workloads and view the logs in Log Analytics.

The self-hosted gateway also supports many protocols including `localsyslog`, `rfc5424`, and `journal`. The following table summarizes all the options supported.

| Field  | Default | Description |
| ------------- | ------------- | ------------- |
| telemetry.logs.std  | `text` | Enables logging to standard streams. Value can be `none`, `text`, `json` |
| telemetry.logs.local  | `auto` | Enables local logging. Value can be `none`, `auto`, `localsyslog`, `rfc5424`, `journal`, `json`  |
| telemetry.logs.local.localsyslog.endpoint  | n/a | Specifies local syslog endpoint. For details, see [using local syslog logs](#using-local-syslog-logs).  |
| telemetry.logs.local.localsyslog.facility  | n/a | Specifies local syslog [facility code](https://en.wikipedia.org/wiki/Syslog#Facility). Example: `7`
| telemetry.logs.local.rfc5424.endpoint  | n/a | Specifies rfc5424 endpoint.  |
| telemetry.logs.local.rfc5424.facility  | n/a | Specifies facility code per [rfc5424](https://tools.ietf.org/html/rfc5424). Example: `7`  |
| telemetry.logs.local.journal.endpoint  | n/a | Specifies journal endpoint.  |
| telemetry.logs.local.json.endpoint | 127.0.0.1:8888 | Specifies UDP endpoint that accepts JSON data: file path, IP:port, or hostname:port.

Here's a sample configuration of local logging:

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

### Using local JSON endpoint

#### Known limitations

- We only support up to 3072 bytes of request/response payload for local diagnostics. Anything above, may break JSON format due to chunking.

### Using local syslog logs

#### Configuring gateway to stream logs

When using local syslog as a destination for logs, the runtime needs to allow streaming logs to the destination. For Kubernetes, a volume needs to be mounted which that matches the destination.

Given the following configuration:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
    name: contoso-gateway-environment
data:
    config.service.endpoint: "<self-hosted-gateway-management-endpoint>"
    telemetry.logs.local: localsyslog
    telemetry.logs.local.localsyslog.endpoint: /dev/log
```

You can easily start streaming logs to that local syslog endpoint:

```diff
apiVersion: apps/v1
kind: Deployment
metadata:
  name: contoso-deployment
  labels:
    app: contoso
spec:
  replicas: 1
  selector:
    matchLabels:
      app: contoso
  template:
    metadata:
      labels:
        app: contoso
    spec:
      containers:
        name: azure-api-management-gateway
        image: mcr.microsoft.com/azure-api-management/gateway:2.5.0
        imagePullPolicy: IfNotPresent
        envFrom:
        - configMapRef:
            name: contoso-gateway-environment
        # ... redacted ...
+       volumeMounts:
+       - mountPath: /dev/log
+         name: logs
+     volumes:
+     - hostPath:
+         path: /dev/log
+         type: Socket
+       name: logs
```

#### Consuming local syslog logs on Azure Kubernetes Service (AKS)

When configuring to use local syslog on Azure Kubernetes Service, you can choose two ways to explore the logs:

- Use [Syslog collection with Container Insights](/azure/azure-monitor/containers/container-insights-syslog)
- Connect & explore logs on the worker nodes

#### Consuming logs from worker nodes

You can easily consume them by getting access to the worker nodes:

1. Create an SSH connection to the node ([docs](/azure/aks/node-access))
2. Logs can be found under `host/var/log/syslog`

For example, you can filter all syslogs to just the ones from the self-hosted gateway:

```shell
$ cat host/var/log/syslog | grep "apimuser"
May 15 05:54:20 aks-agentpool-43853532-vmss000000 apimuser[8]: Timestamp=2023-05-15T05:54:20.0445178Z, isRequestSuccess=True, totalTime=290, category=GatewayLogs, callerIpAddress=141.134.132.243, timeGenerated=2023-05-15T05:54:20.0445178Z, region=Repro, correlationId=aaaa0000-bb11-2222-33cc-444444dddddd, method=GET, url="http://20.126.242.200/echo/resource?param1\=sample", backendResponseCode=200, responseCode=200, responseSize=628, cache=none, backendTime=287, apiId=echo-api, operationId=retrieve-resource, apimSubscriptionId=master, clientProtocol=HTTP/1.1, backendProtocol=HTTP/1.1, apiRevision=1, backendMethod=GET, backendUrl="http://echoapi.cloudapp.net/api/resource?param1\=sample"
May 15 05:54:21 aks-agentpool-43853532-vmss000000 apimuser[8]: Timestamp=2023-05-15T05:54:21.1189171Z, isRequestSuccess=True, totalTime=150, category=GatewayLogs, callerIpAddress=141.134.132.243, timeGenerated=2023-05-15T05:54:21.1189171Z, region=Repro, correlationId=bbbb1111-cc22-3333-44dd-555555eeeeee, method=GET, url="http://20.126.242.200/echo/resource?param1\=sample", backendResponseCode=200, responseCode=200, responseSize=628, cache=none, backendTime=148, apiId=echo-api, operationId=retrieve-resource, apimSubscriptionId=master, clientProtocol=HTTP/1.1, backendProtocol=HTTP/1.1, apiRevision=1, backendMethod=GET, backendUrl="http://echoapi.cloudapp.net/api/resource?param1\=sample"
```
> [!NOTE]
> If you have changed the root with `chroot`, for example `chroot /host`, then the above path needs to reflect that change.

## Next steps

* Learn about the [observability capabilities of the Azure API Management gateways](observability.md).
* Learn more about the [Azure API Management self-hosted gateway](self-hosted-gateway-overview.md).
* Learn about [configuring and persisting logs in the cloud](how-to-configure-cloud-metrics-logs.md).
