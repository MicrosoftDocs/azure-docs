---
 title: include file
 description: include file
 author: kgremban
 ms.topic: include
 ms.date: 09/27/2024
 ms.author: kgremban
ms.custom: include file
---

1. Clone or download the Azure IoT Operations repo to your local machine: [azure-iot-operations.git](https://github.com/Azure/azure-iot-operations.git).

   > [!NOTE]
   > The repo contains the deployment definition of Azure IoT Operations, and samples that include the sample dashboards used in this article.

1. Browse to the following path in your local copy of the repo:

   *azure-iot-operations\tools\setup-3p-obs-infra*

1. Create a file called `otel-collector-values.yaml` and paste the following code into it to define an OpenTelemetry Collector:

   ```yml
   mode: deployment
   fullnameOverride: aio-otel-collector
   image:
     repository: otel/opentelemetry-collector
     tag: 0.107.0
   config:
     processors:
       memory_limiter:
         limit_percentage: 80
         spike_limit_percentage: 10
         check_interval: '60s'
     receivers:
       jaeger: null
       prometheus: null
       zipkin: null
       otlp:
         protocols:
           grpc:
             endpoint: ':4317'
           http:
             endpoint: ':4318'
     exporters:
       prometheus:
         endpoint: ':8889'
         resource_to_telemetry_conversion:
           enabled: true
     service:
       extensions:
         - health_check
       pipelines:
         metrics:
           receivers:
             - otlp
           exporters:
             - prometheus
         logs: null
         traces: null
       telemetry: null
     extensions:
       memory_ballast:
         size_mib: 0
   resources:
     limits:
       cpu: '100m'
       memory: '512Mi'
   ports:
     metrics:
       enabled: true
       containerPort: 8889
       servicePort: 8889
       protocol: 'TCP'
     jaeger-compact:
       enabled: false
     jaeger-grpc:
       enabled: false
     jaeger-thrift:
       enabled: false
     zipkin:
       enabled: false
   ```

1. In the `otel-collector-values.yaml` file, make a note of the following values that you use in the `az iot ops init` command when you deploy Azure IoT Operations on the cluster:

   * **fullnameOverride**
   * **grpc.endpoint**
   * **check_interval**

1. Save and close the file.

1. Deploy the collector by running the following commands:

   ```shell
   kubectl get namespace azure-iot-operations || kubectl create namespace azure-iot-operations
   helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts

   helm repo update
   helm upgrade --install aio-observability open-telemetry/opentelemetry-collector -f otel-collector-values.yaml --namespace azure-iot-operations
   ```