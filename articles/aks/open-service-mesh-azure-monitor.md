---
title: Configure Monitoring and Observability with Open Service Mesh on Azure Kubernetes Service (AKS)
description: Configure Monitoring and Observability with Open Service Mesh on Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 8/26/2021
ms.author: pgibson
---

# Configure Monitoring and Observability with Open Service Mesh on Azure Kubernetes Service (AKS)

Both Azure Monitor and Azure Application Insights assist with maximizing the availability and performance of your applications and services. These services deliver a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

The OSM AKS add-on will have deep integrations into both of these Azure services, and provide a seamless Azure experience for viewing and responding to critical KPIs provided by OSM metrics.

## Enable Azure Monitor

Once the OSM AKS add-on has been enabled on the AKS cluster, Azure Monitor needs to be enabled in the cluster via Azure portal. Click on the AKS cluster, navigate to the "Insights" tab under "Monitoring," and select "Enable."

Once Azure Monitor has been enabled, you should be able to see the following pods in the kube-system namespace:

```
kube-system     omsagent-5pn4c                        1/1     Running   0          24m
kube-system     omsagent-6r6zt                        1/1     Running   0          24m
kube-system     omsagent-j8xrh                        1/1     Running   0          24m
kube-system     omsagent-rs-74b8f7dfd8-rp5vx          1/1     Running   1          24m
```

## Enable metrics in OSM monitored namespaces

For metrics to be scraped from a particular namespace monitored by the mesh, the following command needs to be run:

```sh
osm metrics enable --namespace <namespace>
```

For instance, if you are running the [bookstore demo](https://docs.openservicemesh.io/docs/getting_started/quickstart/manual_demo/), you would run the `osm metrics enable` command on the following namespaces:

```sh
osm metrics enable --namespace bookbuyer
osm metrics enable --namespace bookstore
osm metrics enable --namespace bookthief
osm metrics enable --namespace bookwarehouse
```

## Apply ConfigMap

Create the following ConfigMap in `kube-system`, which will tell AzMon what namespaces should be monitored. For instance, for the bookbuyer / bookstore demo, the ConfigMap would look as follows:

```yaml
kind: ConfigMap
apiVersion: v1
data:
  schema-version: v1
  config-version: ver1
  osm-metric-collection-configuration: |-
    # OSM metric collection settings
    [osm_metric_collection_configuration]
      [osm_metric_collection_configuration.settings]
          # Namespaces to monitor
          monitor_namespaces = ["bookstore", "bookbuyer", "bookthief", "bookwarehouse"]
metadata:
  name: container-azm-ms-osmconfig
  namespace: kube-system
```

## View metrics in the Azure portal

In Azure portal, select the Kubernetes cluster and then the "Logs" tab under "Monitoring." You should be now able to query the `InsightsMetrics` table to view metrics in the enabled namespaces. For instance, if you wanted to see the envoy metrics for `bookbuyer`, you would use the following query:

```sh
InsightsMetrics
| where Name contains "envoy"
| extend t=parse_json(Tags)
| where t.app == "bookbuyer"
```

## Additional information

For more information on how to enable and configure Azure Monitor and Azure Application Insights for the OSM AKS add-on, visit the [Azure Monitor for OSM](https://aka.ms/azmon/osmpreview) page.

In addition, there are open source tools you can use with OSM for observability. For more information, see the [OSM Observability][osm-observeability].

[osm-observeability]: https://docs.openservicemesh.io/docs/guides/observability/