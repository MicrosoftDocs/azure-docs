---
title: Integrations with Open Service Mesh on Azure Kubernetes Service (AKS)
description: Integrations with Open Service Mesh on Azure Kubernetes Service (AKS)
ms.topic: article
ms.date: 03/23/2022
---

# Integrations with Open Service Mesh on Azure Kubernetes Service (AKS)

The Open Service Mesh (OSM) add-on integrates with features provided by Azure as well as open source projects.

> [!IMPORTANT]
> Integrations with open source projects aren't covered by the [AKS support policy][aks-support-policy].

## Ingress

Ingress allows for traffic external to the mesh to be routed to services within the mesh. With OSM, you can configure most ingress solutions to work with your mesh, but OSM works best with [Web Application Routing][web-app-routing], [NGINX ingress][osm-nginx], or [Contour ingress][osm-contour]. Open source projects integrating with OSM are not covered by the [AKS support policy][aks-support-policy]. 

At this time,  [Azure Gateway Ingress Controller (AGIC)][agic] only works for HTTP backends. If you configure OSM to use AGIC, AGIC will not be used for other backends such as HTTPS and mTLS. 

### Using the Azure Gateway Ingress Controller (AGIC) with the OSM add-on for HTTP ingress

> [!IMPORTANT]
> You can't configure [Azure Gateway Ingress Controller (AGIC)][agic] for HTTPS ingress. 

After installing the AGIC ingress controller, create a namespace for the application service, add it to the mesh using the OSM CLI, and deploy the application service to that namespace:

```console
# Create a namespace
kubectl create ns httpbin

# Add the namespace to the mesh
osm namespace add httpbin

# Deploy the application

export RELEASE_BRANCH=release-v1.2
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm-docs/$RELEASE_BRANCH/manifests/samples/httpbin/httpbin.yaml -n httpbin
```

Verify that the pods are up and running, and have the envoy sidecar injected:

```console
kubectl get pods -n httpbin
```

Example output: 

```console
NAME                      READY   STATUS    RESTARTS   AGE
httpbin-7c6464475-9wrr8   2/2     Running   0          6d20h
```

```console
kubectl get svc -n httpbin
```

Example output:

```console
NAME      TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)     AGE
httpbin   ClusterIP   10.0.92.135   <none>        14001/TCP   6d20h
```

Next, deploy the following `Ingress` and `IngressBackend` configurations to allow external clients to access the `httpbin` service on port `14001`.

```console
kubectl apply -f <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: httpbin
  namespace: httpbin
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: httpbin
            port:
              number: 14001
---
kind: IngressBackend
apiVersion: policy.openservicemesh.io/v1alpha1
metadata:
  name: httpbin
  namespace: httpbin
spec:
  backends:
  - name: httpbin
    port:
      number: 14001 # targetPort of httpbin service
      protocol: http
  sources:
  - kind: IPRange
    name: 10.0.0.0/8
EOF
```

Ensure that both the Ingress and IngressBackend objects have been successfully deployed: 

```console
kubectl get ingress -n httpbin
```

Example output: 

```console
NAME      CLASS    HOSTS   ADDRESS         PORTS   AGE
httpbin   <none>   *       20.85.173.179   80      6d20h
```

```console
kubectl get ingressbackend -n httpbin
```

Example output: 

```console
NAME      STATUS
httpbin   committed
```

Use `kubectl` to display the external IP address of the ingress service.
```console
kubectl get ingress -n httpbin
```

Use `curl` to verify you can access the `httpbin` service using the external IP address of the ingress service.
```console
curl -sI http://<external-ip>/get
```

Confirm you receive a response with `status 200`. 

## Metrics observability

Observability of metrics allows you to view the metrics of your mesh and the deployments in your mesh. With OSM, you can use [Prometheus and Grafana][osm-metrics] for metrics observability, but those integrations aren't covered by the [AKS support policy][aks-support-policy].

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

OSM can integrate with certain automation projects and developer tooling to help operators and developers build and release applications. For example, OSM integrates with [Flagger][osm-flagger] for progressive delivery and [Dapr][osm-dapr] for building applications. OSM's integration with Flagger and Dapr aren't covered by the [AKS support policy][aks-support-policy].

## External authorization

External authorization allows you to offload authorization of HTTP requests to an external service. OSM can use external authorization by integrating with [Open Policy Agent (OPA)][osm-opa], but that integration isn't covered by the [AKS support policy][aks-support-policy].

## Certificate management

OSM has several types of certificates it uses to operate on your AKS cluster. OSM includes its own certificate manager called [Tresor][osm-tresor], which is used by default. Alternatively, OSM allows you to integrate with [Hashicorp Vault][osm-hashi-vault] and [cert-manager][osm-cert-manager], but those integrations aren't covered by the [AKS support policy][aks-support-policy].

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
[web-app-routing]: web-app-routing.md