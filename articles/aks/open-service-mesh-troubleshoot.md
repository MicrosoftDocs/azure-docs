---
title: Troubleshooting Open Service Mesh
description: How to troubleshoot Open Service Mesh
services: container-service
ms.topic: article
ms.date: 8/26/2021
ms.custom: mvc, devx-track-azurecli
ms.author: pgibson
---

# Open Service Mesh (OSM) AKS add-on Troubleshooting Guides

When you deploy the OSM AKS add-on, you could possibly experience problems associated with configuration of the service mesh. The following guide will assist you on how to troubleshoot errors and resolve common problems.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Verifying and Troubleshooting OSM components

### Check OSM Controller Deployment

```azurecli-interactive
kubectl get deployment -n kube-system --selector app=osm-controller
```

A healthy OSM Controller would look like this:

```Output
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
osm-controller   1/1     1            1           59m
```

### Check the OSM Controller Pod

```azurecli-interactive
kubectl get pods -n kube-system --selector app=osm-controller
```

A healthy OSM Pod would look like this:

```Output
NAME                            READY   STATUS    RESTARTS   AGE
osm-controller-b5bd66db-wglzl   0/1     Evicted   0          61m
osm-controller-b5bd66db-wvl9w   1/1     Running   0          31m
```

Even though we had one controller evicted at some point, we have another one that is READY 1/1 and Running with 0 restarts. If the column READY is anything other than 1/1 the service mesh would be in a broken state.
Column READY with 0/1 indicates the control plane container is crashing - we need to get logs. See Get OSM Controller Logs from Azure Support Center section below. Column READY with a number higher than 1 after the / would indicate that there are sidecars installed. OSM Controller would most likely not work with any sidecars attached to it.

### Check OSM Controller Service

```azurecli-interactive
kubectl get service -n kube-system osm-controller
```

A healthy OSM Controller service would look like this:

```Output
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)              AGE
osm-controller   ClusterIP   10.0.31.254   <none>        15128/TCP,9092/TCP   67m
```

> [!NOTE]
> The CLUSTER-IP would be different. The service NAME and PORT(S) must be the same as the example above.

### Check OSM Controller Endpoints

```azurecli-interactive
kubectl get endpoints -n kube-system osm-controller
```

A healthy OSM Controller endpoint(s) would look like this:

```Output
NAME             ENDPOINTS                              AGE
osm-controller   10.240.1.115:9092,10.240.1.115:15128   69m
```

### Check OSM Injector Deployment

```azurecli-interactive
kubectl get pod -n kube-system --selector app=osm-injector
```

A healthy OSM Injector deployment would look like this:

```Output
NAME                            READY   STATUS    RESTARTS   AGE
osm-injector-5986c57765-vlsdk   1/1     Running   0          73m
```

### Check OSM Injector Pod

```azurecli-interactive
kubectl get pod -n kube-system --selector app=osm-injector
```

A healthy OSM Injector pod would look like this:

```Output
NAME                            READY   STATUS    RESTARTS   AGE
osm-injector-5986c57765-vlsdk   1/1     Running   0          73m
```

### Check OSM Injector Service

```azurecli-interactive
kubectl get service -n kube-system osm-injector
```

A healthy OSM Injector service would look like this:

```Output
NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
osm-injector   ClusterIP   10.0.39.54   <none>        9090/TCP   75m
```

### Check OSM Endpoints

```azurecli-interactive
kubectl get endpoints -n kube-system osm-injector
```

A healthy OSM endpoint would look like this:

```Output
NAME           ENDPOINTS           AGE
osm-injector   10.240.1.172:9090   75m
```

### Check Validating and Mutating webhooks

```azurecli-interactive
kubectl get ValidatingWebhookConfiguration --selector app=osm-controller
```

A healthy OSM Validating Webhook would look like this:

```Output
NAME              WEBHOOKS   AGE
aks-osm-webhook-osm   1      81m
```

```azurecli-interactive
kubectl get MutatingWebhookConfiguration --selector app=osm-injector
```

A healthy OSM Mutating Webhook would look like this:

```Output
NAME              WEBHOOKS   AGE
aks-osm-webhook-osm   1      102m
```

### Check for the service and the CA bundle of the Validating webhook

```azurecli-interactive
kubectl get ValidatingWebhookConfiguration aks-osm-webhook-osm -o json | jq '.webhooks[0].clientConfig.service'
```

A well configured Validating Webhook Configuration would look exactly like this:

```json
{
  "name": "osm-config-validator",
  "namespace": "kube-system",
  "path": "/validate-webhook",
  "port": 9093
}
```

### Check for the service and the CA bundle of the Mutating webhook

```azurecli-interactive
kubectl get MutatingWebhookConfiguration aks-osm-webhook-osm -o json | jq '.webhooks[0].clientConfig.service'
```

A well configured Mutating Webhook Configuration would look exactly like this:

```json
{
  "name": "osm-injector",
  "namespace": "kube-system",
  "path": "/mutate-pod-creation",
  "port": 9090
}
```

### Check the `osm-mesh-config` resource

Check for the existence:

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n kube-system
```

Check the content of the OSM MeshConfig

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n kube-system -o yaml
```

```
apiVersion: config.openservicemesh.io/v1alpha1
kind: MeshConfig
metadata:
  creationTimestamp: "0000-00-00A00:00:00A"
  generation: 1
  name: osm-mesh-config
  namespace: kube-system
  resourceVersion: "2494"
  uid: 6c4d67f3-c241-4aeb-bf4f-b029b08faa31
spec:
  certificate:
    serviceCertValidityDuration: 24h
  featureFlags:
    enableEgressPolicy: true
    enableMulticlusterMode: false
    enableWASMStats: true
  observability:
    enableDebugServer: true
    osmLogLevel: info
    tracing:
      address: jaeger.osm-system.svc.cluster.local
      enable: false
      endpoint: /api/v2/spans
      port: 9411
  sidecar:
    configResyncInterval: 0s
    enablePrivilegedInitContainer: false
    envoyImage: mcr.microsoft.com/oss/envoyproxy/envoy:v1.18.3
    initContainerImage: mcr.microsoft.com/oss/openservicemesh/init:v0.9.1
    logLevel: error
    maxDataPlaneConnections: 0
    resources: {}
  traffic:
    enableEgress: true
    enablePermissiveTrafficPolicyMode: true
    inboundExternalAuthorization:
      enable: false
      failureModeAllow: false
      statPrefix: inboundExtAuthz
      timeout: 1s
    useHTTPSIngress: false
```

`osm-mesh-config` resource values:

| Key | Type | Default Value | Kubectl Patch Command Examples |
|-----|------|---------------|--------------------------------|
| spec.traffic.enableEgress | bool | `false` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"enableEgress":true}}}'  --type=merge` |
| spec.traffic.enablePermissiveTrafficPolicyMode | bool | `false` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"enablePermissiveTrafficPolicyMode":true}}}'  --type=merge` |
| spec.traffic.useHTTPSIngress | bool | `false` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"useHTTPSIngress":true}}}'  --type=merge` |
| spec.traffic.outboundPortExclusionList | array | `[]` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"outboundPortExclusionList":6379,8080}}}'  --type=merge` |
| spec.traffic.outboundIPRangeExclusionList | array | `[]` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"outboundIPRangeExclusionList":"10.0.0.0/32,1.1.1.1/24"}}}'  --type=merge` |
| spec.certificate.serviceCertValidityDuration | string | `"24h"` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"certificate":{"serviceCertValidityDuration":"24h"}}}'  --type=merge` |
| spec.observability.enableDebugServer | bool | `false` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"observability":{"serviceCertValidityDuration":true}}}'  --type=merge` |
| spec.observability.tracing.enable | bool | `"jaeger.osm-system.svc.cluster.local"`| `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"observability":{"tracing":{"address": "jaeger.osm-system.svc.cluster.local"}}}}'  --type=merge` |
| spec.observability.tracing.address | string | `"/api/v2/spans"` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"observability":{"tracing":{"endpoint":"/api/v2/spans"}}}}'  --type=merge' --type=merge` |
| spec.observability.tracing.endpoint | string | `false`| `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"observability":{"tracing":{"enable":true}}}}'  --type=merge` |
| spec.observability.tracing.port | int | `9411`| `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"observability":{"tracing":{"port":9411}}}}'  --type=merge` |
| spec.sidecar.enablePrivilegedInitContainer | bool | `false` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"sidecar":{"enablePrivilegedInitContainer":true}}}'  --type=merge` |
| spec.sidecar.logLevel | string | `"error"` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"sidecar":{"logLevel":"error"}}}'  --type=merge` |
| spec.sidecar.maxDataPlaneConnections | int | `0` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"sidecar":{"maxDataPlaneConnections":"error"}}}'  --type=merge` |
| spec.sidecar.envoyImage | string | `"envoyproxy/envoy-alpine:v1.17.2"` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"sidecar":{"envoyImage":"envoyproxy/envoy-alpine:v1.17.2"}}}'  --type=merge` |
| spec.sidecar.initContainerImage | string | `"openservicemesh/init:v0.9.2"` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"sidecar":{"initContainerImage":"openservicemesh/init:v0.9.2"}}}' --type=merge` |
| spec.sidecar.configResyncInterval | string | `"0s"` | `kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"sidecar":{"configResyncInterval":"30s"}}}'  --type=merge` |

### Check Namespaces

> [!NOTE]
> The kube-system namespace will never participate in a service mesh and will never be labeled and/or annotated with the key/values below.

We use the `osm namespace add` command to join namespaces to a given service mesh.
When a k8s namespace is part of the mesh (or for it to be part of the mesh) the following must be true:

View the annotations with

```azurecli-interactive
kubectl get namespace bookbuyer -o json | jq '.metadata.annotations'
```

The following annotation must be present:

```Output
{
  "openservicemesh.io/sidecar-injection": "enabled"
}
```

View the labels with

```azurecli-interactive
kubectl get namespace bookbuyer -o json | jq '.metadata.labels'
```

The following label must be present:

```Output
{
  "openservicemesh.io/monitored-by": "osm"
}
```

If a namespace is not annotated with `"openservicemesh.io/sidecar-injection": "enabled"` or not labeled with `"openservicemesh.io/monitored-by": "osm"` the OSM Injector will not add Envoy sidecars.

> [!NOTE]
> After `osm namespace add` is called only **new** pods will be injected with an Envoy sidecar. Existing pods must be restarted with `kubectl rollout restart deployment ...`

### Verify the SMI CRDs:

Check whether the cluster has the required CRDs:

```azurecli-interactive
kubectl get crds
```

We must have the following installed on the cluster:

- httproutegroups.specs.smi-spec.io
- tcproutes.specs.smi-spec.io
- trafficsplits.split.smi-spec.io
- traffictargets.access.smi-spec.io
- udproutes.specs.smi-spec.io

Get the versions of the CRDs installed with this command:

```azurecli-interactive
osm mesh list
```

Expected output:

```
MESH NAME   MESH NAMESPACE   VERSION   ADDED NAMESPACES
osm         kube-system      v0.9.2

MESH NAME   MESH NAMESPACE   SMI SUPPORTED
osm         kube-system      HTTPRouteGroup:v1alpha4,TCPRoute:v1alpha4,TrafficSplit:v1alpha2,TrafficTarget:v1alpha3

To list the OSM controller pods for a mesh, please run the following command passing in the mesh's namespace
        kubectl get pods -n <osm-mesh-namespace> -l app=osm-controller
```

OSM Controller v0.9.2 requires the following versions:

- traffictargets.access.smi-spec.io - [v1alpha3](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-access/v1alpha3/traffic-access.md)
- httproutegroups.specs.smi-spec.io - [v1alpha4](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-specs/v1alpha4/traffic-specs.md#httproutegroup)
- tcproutes.specs.smi-spec.io - [v1alpha4](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-specs/v1alpha4/traffic-specs.md#tcproute)
- udproutes.specs.smi-spec.io - Not supported
- trafficsplits.split.smi-spec.io - [v1alpha2](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-split/v1alpha2/traffic-split.md)
- \*.metrics.smi-spec.io - [v1alpha1](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-metrics/v1alpha1/traffic-metrics.md)

If CRDs are missing use the following commands to install these on the cluster:

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/v0.9.2/charts/osm/crds/access.yaml
```

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/v0.8.2/charts/osm/crds/specs.yaml
```

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/v0.9.2/charts/osm/crds/split.yaml
```

### Certificate management

Information on how OSM issues and manages certificates to Envoy proxies running on application pods can be found on the [OpenServiceMesh docs site](https://docs.openservicemesh.io/docs/guides/certificates/).

### Upgrading Envoy

When a new pod is created in a namespace monitored by the add-on, OSM will inject an [envoy proxy sidecar](https://docs.openservicemesh.io/docs/guides/app_onboarding/sidecar_injection/) in that pod. Information regarding how to update the envoy version can be found in the [Upgrade Guide](https://docs.openservicemesh.io/docs/getting_started/upgrade/#envoy) on the OpenServiceMesh docs site.