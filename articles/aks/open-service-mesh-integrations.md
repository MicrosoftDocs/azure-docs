---
title: Integrations with Open Service Mesh on Azure Kubernetes Service (AKS)
description: Integrations with Open Service Mesh on Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 03/23/2022
---

# Integrations with Open Service Mesh on Azure Kubernetes Service (AKS)

The Open Service Mesh (OSM) add-on integrates with features provided by Azure as well as open source projects.

> [!IMPORTANT]
> Integrations with open source projects are not covered by the [AKS support policy][aks-support-policy].

## Ingress

Ingress allows for traffic external to the mesh to be routed to services within the mesh. With OSM, you can configure most ingress solutions to work with your mesh, but OSM works best with either [NGINX ingress][osm-nginx] or [Contour ingress][osm-contour]. Open source projects integrating with OSM, including NGINX ingress and Contour ingress, are not covered by the [AKS support policy][aks-support-policy].

Using [Azure Gateway Ingress Controller (AGIC)][agic] for ingress with OSM is not supported and not recommended.

## Metrics observability

Observability of metrics allows you to view the metrics of your mesh and the deployments in your mesh. With OSM, you can use [Prometheus and Grafana][osm-metrics] for metrics observability, but those integrations are not covered by the [AKS support policy][aks-support-policy].

You can also integrate OSM with [Azure Monitor][azure-monitor].

Before you can enable metrics on your mesh to integrate with Azure Monitor:

* Enable Azure Monitor on your cluster
* Enable the OSM add-on for your AKS cluster
* Onboard your application namespaces to the mesh

To enable metrics for a namespace in the mesh use `osm metrics enable`. For example:

```console
osm metrics enable --namespace myappnamespace
```

Create a Configmap in the `kube-system` namespace that enables Azure Monitor to monitor your namespaces. For example, create a `monitor-configmap.yaml` with the following to monitor the `myappnamespace`:

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
          monitor_namespaces = ["myappnamespace"]
metadata:
  name: container-azm-ms-osmconfig
  namespace: kube-system
```

Apply that ConfigMap using `kubectl apply`.

```console
kubectl apply -f monitor-configmap.yaml
```

To access your metrics from the Azure portal, select your AKS cluster, then select *Logs* under *Monitoring*. From the *Monitoring* section, query the `InsightsMetrics` table to view metrics in the enabled namespaces. For example, the following query shows the *envoy* metrics for the *myappnamespace* namespace.

```sh
InsightsMetrics
| where Name contains "envoy"
| extend t=parse_json(Tags)
| where t.app == "myappnamespace"
```

## Automation and developer tools

OSM can integrate with certain automation projects and developer tooling to help operators and developers build and release applications. For example, OSM integrates with [Flagger][osm-flagger] for progressive delivery and [Dapr][osm-dapr] for building applications. OSM's integration with Flagger and Dapr are not covered by the [AKS support policy][aks-support-policy].

## External authorization

External authorization allows you to offload authorization of HTTP requests to an external service. OSM can use external authorization by integrating with [Open Policy Agent (OPA)][osm-opa], but that integration is not covered by the [AKS support policy][aks-support-policy].

## Certificate management

OSM has several types of certificates it uses to operate on your AKS cluster. OSM includes its own certificate manager called Tresor, which is used by default. Alternatively, OSM allows you to integrate with [Hashicorp Vault][osm-hashi-vault], [Tresor][osm-tresor], and [cert-manager][osm-cert-manager], but those integrations are not covered by the [AKS support policy][aks-support-policy].



[agic]: ../application-gateway/ingress-controller-overview.md
[agic-aks]: ../application-gateway/tutorial-ingress-controller-add-on-existing.md
[aks-support-policy]: support-policies.md
[azure-monitor]: ../azure-monitor/overview.md
[nginx]: https://github.com/kubernetes/ingress-nginx
[osm-ingress-policy]: https://release-v1-0.docs.openservicemesh.io/docs/demos/ingress_k8s_nginx/#http-ingress
[osm-nginx]: https://release-v1-0.docs.openservicemesh.io/docs/demos/ingress_k8s_nginx/
[osm-contour]: https://release-v1-0.docs.openservicemesh.io/docs/guides/traffic_management/ingress/#1-using-contour-ingress-controller-and-gateway
[osm-metrics]: https://release-v1-0.docs.openservicemesh.io/docs/guides/observability/metrics/
[osm-dapr]: https://release-v1-0.docs.openservicemesh.io/docs/guides/integrations/dapr/
[osm-flagger]: https://release-v1-0.docs.openservicemesh.io/docs/guides/integrations/flagger/
[osm-opa]: https://release-v1-0.docs.openservicemesh.io/docs/guides/integrations/external_auth_opa/
[osm-hashi-vault]: https://release-v1-0.docs.openservicemesh.io/docs/guides/certificates/#using-hashicorp-vault
[osm-cert-manager]: https://release-v1-0.docs.openservicemesh.io/docs/guides/certificates/#using-cert-manager
[open-source-integrations]: open-service-mesh-integrations.md#additional-open-source-integrations
[osm-traffic-management-example]: https://github.com/MicrosoftDocs/azure-docs/pull/81085/files
[osm-tresor]: https://release-v1-0.docs.openservicemesh.io/docs/guides/certificates/#using-osms-tresor-certificate-issuer