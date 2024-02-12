---
title: Deploy telemetry router | Azure Arc-enabled data services
description: Learn how to deploy the Azure Arc Telemetry Router
author: lcwright
ms.author: lancewright
ms.service: azure
ms.topic: how-to 
ms.date: 09/07/2022
ms.custom: template-how-to
---

# Deploy the Azure Arc telemetry Router

> [!NOTE]
>
> - The telemetry router is in Public Preview and should be deployed for **testing purposes only**.
> - While the telemetry router is in Public Preview, be advised that future preview releases could include changes to CRD specs, CLI commands, and/or telemetry router messages.
> - The current preview does not support in-place upgrades of a data controller deployed with the Arc telemetry router enabled. In order to install or upgrade a data controller in a future release, you will need to uninstall the data controller and then re-install.

## What is the Azure Arc Telemetry Router?

The Azure Arc telemetry router enables exporting telemetry data to other monitoring solutions. For this Public Preview, we only support exporting log data to either Kafka or Elasticsearch and metric data to Kafka.

This document specifies how to deploy the telemetry router and configure it to work with the supported exporters.

## Deployment

> [!NOTE]
> 
> The telemetry router currently supports indirectly connected mode only.

### Create a Custom Configuration Profile

After setting up your Kubernetes cluster, you'll need to [create a custom configuration profile](create-custom-configuration-template.md). Next, enable a temporary feature flag that deploys the telemetry router during data controller creation.

### Turn on the Feature Flag

After creating the custom configuration profile, you'll need to edit the profile to add the `monitoring` property with the `enableOpenTelemetry` flag set to `true`. You can set the feature flag by running the following az CLI commands (edit the --path parameter, as necessary):

```bash
az arcdata dc config add --path ./control.json --json-values ".spec.monitoring={}"
az arcdata dc config add --path ./control.json --json-values ".spec.monitoring.enableOpenTelemetry=true"
```

To confirm the flag was set correctly, open the control.json file and confirm the `monitoring` object was added to the `spec` object and `enableOpenTelemetry` is set to `true`.

```yaml
spec:
    monitoring:
        enableOpenTelemetry: true
```

This feature flag requirement will be removed in a future release.

### Create the Data Controller

After creating the custom configuration profile and setting the feature flag, you're ready to [create the data controller using indirect connectivity mode](create-data-controller-indirect-cli.md?tabs=linux). Be sure to replace the `--profile-name` parameter with a `--path` parameter that points to your custom control.json file (see [use custom control.json file to deploy Azure Arc-enabled data controller](create-custom-configuration-template.md))

### Verify Telemetry Router Deployment

When the data controller is created, a TelemetryRouter custom resource is also created. Data controller deployment is marked ready when both custom resources have finished deploying. After the data controller finishes deployment, you can use the following command to verify that the TelemetryRouter exists:

```bash
kubectl describe telemetryrouter arc-telemetry-router -n <namespace>
```

```yaml
apiVersion: arcdata.microsoft.com/v1beta4
  kind: TelemetryRouter
  metadata:
    name: arc-telemetry-router
    namespace: <namespace>
  spec:
    credentials:
    exporters:
    pipelines:
```

At the time of creation, no pipeline or exporters are set up. You can [setup your own pipelines and exporters](adding-exporters-and-pipelines.md) to route metrics and logs data to your own instances of Kafka and Elasticsearch. 

After the TelemetryRouter is deployed, an instance of Kafka (arc-router-kafka) and a single instance of TelemetryCollector (collector-inbound) should be deployed and in a ready state. These resources are system managed and editing them isn't supported. The following pods will be deployed as a result:

- An inbound collector pod - `arctc-collector-inbound-0`
- A kakfa broker pod - `arck-arc-router-kafka-broker-0`
- A kakfa controller pod - `arck-arc-router-kafka-controller-0`


> [!NOTE]
> An outbound collector pod isn't created until at least one pipeline has been added to the telemetry router.
>
> After you create the first pipeline, an additional TelemetryCollector resource (collector-outbound) and pod `arctc-collector-outbound-0` are deployed.

```bash
kubectl get pods -n <namespace>

NAME                                 READY   STATUS      RESTARTS   AGE
arc-bootstrapper-job-4z2vr           0/1     Completed   0          15h
arc-webhook-job-facc4-z7dd7          0/1     Completed   0          15h
arck-arc-router-kafka-broker-0       2/2     Running     0          15h
arck-arc-router-kafka-controller-0   2/2     Running     0          15h
arctc-collector-inbound-0            2/2     Running     0          15h
bootstrapper-8d5bff6f7-7w88j         1/1     Running     0          15h
control-vpfr9                        2/2     Running     0          15h
controldb-0                          2/2     Running     0          15h
logsdb-0                             3/3     Running     0          15h
logsui-fwrh9                         3/3     Running     0          15h
metricsdb-0                          2/2     Running     0          15h
metricsdc-bc4df                      2/2     Running     0          15h
metricsdc-fm7jh                      2/2     Running     0          15h
metricsui-qqgbv                      2/2     Running     0          15h
```

## Related content

- [Add exporters and pipelines to your telemetry router](adding-exporters-and-pipelines.md)
