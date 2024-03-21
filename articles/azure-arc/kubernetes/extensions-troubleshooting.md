---
title: "Troubleshoot extension issues for Azure Arc-enabled Kubernetes clusters"
ms.date: 12/19/2023
ms.topic: how-to
ms.custom: devx-track-azurecli
description: "Learn how to resolve common issues with Azure Arc-enabled Kubernetes cluster extensions."
---

# Troubleshoot extension issues for Azure Arc-enabled Kubernetes clusters

This document provides troubleshooting tips for common issues related to [cluster extensions](extensions-release.md), such as GitOps (Flux v2) and Open Service Mesh.

For help troubleshooting general issues with Azure Arc-enabled Kubernetes, see [Troubleshoot Azure Arc-enabled Kubernetes issues](troubleshooting.md).

## GitOps (Flux v2)

> [!NOTE]
> The Flux v2 extension can be used in either Azure Arc-enabled Kubernetes clusters or Azure Kubernetes Service (AKS) clusters. These troubleshooting tips generally apply regardless of cluster type.

For general help troubleshooting issues with `fluxConfigurations` resources, run these Azure CLI commands with the `--debug` parameter specified:

```azurecli
az provider show -n Microsoft.KubernetesConfiguration --debug
az k8s-configuration flux create <parameters> --debug
```

### Webhook/dry run errors

If you see Flux fail to reconcile with an error like `dry-run failed, error: admission webhook "<webhook>" does not support dry run`, you can resolve the issue by finding the `ValidatingWebhookConfiguration` or the `MutatingWebhookConfiguration` and setting the `sideEffects` to `None` or `NoneOnDryRun`:

For more information, see [How do I resolve `webhook does not support dry run` errors?](https://fluxcd.io/docs/faq/#how-do-i-resolve-webhook-does-not-support-dry-run-errors)

### Errors installing the `microsoft.flux` extension

The `microsoft.flux` extension installs the Flux controllers and Azure GitOps agents into your Azure Arc-enabled Kubernetes or Azure Kubernetes Service (AKS) clusters. If the extension isn't already installed in a cluster and you [create a GitOps configuration resource](tutorial-use-gitops-flux2.md) for that cluster, the extension is installed automatically.

If you experience an error during installation, or if the extension is in a failed state, make sure that the cluster doesn't have any policies that restrict creation of the `flux-system` namespace or resources in that namespace.

For an AKS cluster, ensure that the subscription has the `Microsoft.ContainerService/AKS-ExtensionManager` feature flag enabled.

```azurecli
az feature register --namespace Microsoft.ContainerService --name AKS-ExtensionManager
```

After that, run this command to determine if there are other problems. Set the cluster type (`-t`) parameter to `connectedClusters` for an Arc-enabled cluster or `managedClusters` for an AKS cluster. The name of the `microsoft.flux` extension is "flux" if the extension was installed automatically during creation of a GitOps configuration. Look in the `statuses` object for information.

```azurecli
az k8s-extension show -g <RESOURCE_GROUP> -c <CLUSTER_NAME> -n flux -t <connectedClusters or managedClusters>
```

The displayed results can help you determine what went wrong and how to fix it. Possible remediation actions include:

- Force delete the extension by running `az k8s-extension delete --force -g <RESOURCE_GROUP> -c <CLUSTER_NAME> -n flux -t <managedClusters OR connectedClusters>`
- Uninstall the Helm release by running `helm uninstall flux -n flux-system`
- Delete the `flux-system` namespace from the cluster by running `kubectl delete namespaces flux-system`

After that, you can either [recreate a flux configuration](./tutorial-use-gitops-flux2.md), which installs the `microsoft.flux` extension automatically, or you can reinstall the flux extension [manually](extensions.md).

### Errors installing the `microsoft.flux` extension in a cluster with Microsoft Entra Pod Identity enabled

If you attempt to install the Flux extension in a cluster that has Microsoft Entra Pod Identity enabled, an error may occur in the extension-agent pod:

```console
{"Message":"2021/12/02 10:24:56 Error: in getting auth header : error {adal: Refresh request failed. Status Code = '404'. Response body: no azure identity found for request clientID <REDACTED>\n}","LogType":"ConfigAgentTrace","LogLevel":"Information","Environment":"prod","Role":"ClusterConfigAgent","Location":"westeurope","ArmId":"/subscriptions/<REDACTED>/resourceGroups/<REDACTED>/providers/Microsoft.Kubernetes/managedclusters/<REDACTED>","CorrelationId":"","AgentName":"FluxConfigAgent","AgentVersion":"0.4.2","AgentTimestamp":"2021/12/02 10:24:56"}
```

The extension status also returns as `Failed`.

```console
"{\"status\":\"Failed\",\"error\":{\"code\":\"ResourceOperationFailure\",\"message\":\"The resource operation completed with terminal provisioning state 'Failed'.\",\"details\":[{\"code\":\"ExtensionCreationFailed\",\"message\":\" error: Unable to get the status from the local CRD with the error : {Error : Retry for given duration didn't get any results with err {status not populated}}\"}]}}",
```

In this case, the extension-agent pod tries to get its token from IMDS on the cluster. but the token request is intercepted by the [pod identity](../../aks/use-azure-ad-pod-identity.md)). To fix this issue, [upgrade to the latest version](extensions.md#upgrade-extension-instance) of the `microsoft.flux` extension.

### Issues with kubelet identity when installing the `microsoft.flux` extension in an AKS cluster

With AKs clusters, one of the authentication options is *kubelet identity* using a user-assigned managed identity. Using kubelet identity can reduce operational overhead and increases security when connecting to Azure resources such as Azure Container Registry.

To let Flux use kubelet identity, add the parameter `--config useKubeletIdentity=true` when installing the Flux extension.

```console
az k8s-extension create --resource-group <resource-group> --cluster-name <cluster-name> --cluster-type managedClusters --name flux --extension-type microsoft.flux --config useKubeletIdentity=true
```

### Ensuring memory and CPU requirements for `microsoft.flux` extension installation are met

The controllers installed in your Kubernetes cluster with the `microsoft.flux `extension require CPU and memory resources to properly schedule on Kubernetes cluster nodes. Be sure that your cluster is able to meet the minimum memory and CPU resources that may be requested. Note also the maximum limits for potential CPU and memory resource requirements shown here.

| Container Name | Minimum CPU | Minimum memory | Maximum CPU | Maximum memory |
| -------------- | ----------- | -------- |
| fluxconfig-agent | 5 m | 30 Mi | 50 m | 150 Mi |
| fluxconfig-controller | 5 m | 30 Mi | 100 m | 150 Mi |
| fluent-bit | 5 m | 30 Mi | 20 m | 150 Mi |
| helm-controller | 100 m | 64 Mi | 1000 m | 1 Gi |
| source-controller | 50 m | 64 Mi | 1000 m | 1 Gi |
| kustomize-controller | 100 m | 64 Mi | 1000 m | 1 Gi |
| notification-controller | 100 m | 64 Mi | 1000 m | 1 Gi |
| image-automation-controller | 100 m | 64 Mi | 1000 m | 1 Gi |
| image-reflector-controller | 100 m | 64 Mi | 1000 m | 1 Gi |

If you enabled a custom or built-in Azure Gatekeeper Policy that limits the resources for containers on Kubernetes clusters, such as `Kubernetes cluster containers CPU and memory resource limits should not exceed the specified limits`, ensure that either the resource limits on the policy are greater than the limits shown here, or that the `flux-system` namespace is part of the `excludedNamespaces` parameter in the policy assignment.

### Flux v1

> [!NOTE]
> We recommend [migrating to Flux v2](conceptual-gitops-flux2.md#migrate-from-flux-v1) as soon as possible. Support for Flux v1-based cluster configuration resources created prior to January 1, 2024 will end on [May 24, 2025](https://azure.microsoft.com/updates/migrate-your-gitops-configurations-from-flux-v1-to-flux-v2-by-24-may-2025/). Starting on January 1, 2024, you won't be able to create new Flux v1-based cluster configuration resources.

To help troubleshoot issues with the `sourceControlConfigurations` resource in Flux v1, run these Azure CLI commands with `--debug` parameter specified:

```azurecli
az provider show -n Microsoft.KubernetesConfiguration --debug
az k8s-configuration create <parameters> --debug
```

## Azure Monitor Container Insights

This section provides help troubleshooting issues with [Azure Monitor Container Insights for Azure Arc-enabled Kubernetes clusters](/azure/azure-monitor/containers/container-insights-enable-arc-enabled-clusters?toc=%2Fazure%2Fazure-arc%2Fkubernetes%2Ftoc.json&bc=%2Fazure%2Fazure-arc%2Fkubernetes%2Fbreadcrumb%2Ftoc.json&tabs=create-cli%2Cverify-portal).

### Enabling privileged mode for Canonical Charmed Kubernetes cluster

Azure Monitor Container Insights requires its DaemonSet to run in privileged mode. To successfully set up a Canonical Charmed Kubernetes cluster for monitoring, run the following command:

```console
juju config kubernetes-worker allow-privileged=true
```

### Unable to install Azure Monitor Agent (AMA) on Oracle Linux 9.x

When trying to install the Azure Monitor Agent (AMA) on an Oracle Linux (RHEL) 9.x Kubernetes cluster, the AMA pods and the AMA-RS pod might not work properly due to the `addon-token-adapter` container in the pod. With this error, when checking the logs of the `ama-logs-rs` pod, `addon-token-adapter container`, you see output similar to the following:

```output
Command: kubectl -n kube-system logs ama-logs-rs-xxxxxxxxxx-xxxxx -c addon-token-adapter
 
Error displayed: error modifying iptable rules: error adding rules to custom chain: running [/sbin/iptables -t nat -N aad-metadata --wait]: exit status 3: modprobe: can't change directory to '/lib/modules': No such file or directory

iptables v1.8.9 (legacy): can't initialize iptables table `nat': Table does not exist (do you need to insmod?)

Perhaps iptables or your kernel needs to be upgraded.
```

This error occurs because installing the extension requires the `iptable_nat` module, but this module isn't automatically loaded in Oracle Linux (RHEL) 9.x distributions.

To fix this issue, you must explicitly load the `iptables_nat` module on each node in the cluster, using the `modprobe` command `sudo modprobe iptables_nat`. After you have signed into each node and manually added the `iptable_nat` module, retry the AMA installation.

> [!NOTE]
> Performing this step does not make the `iptables_nat` module persistent.  

## Azure Arc-enabled Open Service Mesh

This section provides commands that you can use to validate and troubleshoot the deployment of the [Open Service Mesh (OSM)](tutorial-arc-enabled-open-service-mesh.md) extension components on your cluster.

### Check OSM controller deployment

```bash
kubectl get deployment -n arc-osm-system --selector app=osm-controller
```

If the OSM controller is healthy, you see output similar to:

```output
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
osm-controller   1/1     1            1           59m
```

### Check OSM controller pods

```bash
kubectl get pods -n arc-osm-system --selector app=osm-controller
```

If the OSM controller is healthy, you see output similar to:

```output
NAME                            READY   STATUS    RESTARTS   AGE
osm-controller-b5bd66db-wglzl   0/1     Evicted   0          61m
osm-controller-b5bd66db-wvl9w   1/1     Running   0          31m
```

Even though one controller was *Evicted* at some point, there's another which is `READY 1/1` and `Running` with `0` restarts. If the column `READY` is anything other than `1/1`, the service mesh is in a broken state. Column `READY` with `0/1` indicates the control plane container is crashing.

Use the following command to inspect controller logs:

```bash
kubectl logs -n arc-osm-system -l app=osm-controller
```

Column `READY` with a number higher than `1` after the `/` indicates that there are sidecars installed. OSM Controller generally won't work properly with sidecars attached.

### Check OSM controller service

```bash
kubectl get service -n arc-osm-system osm-controller
```

If the OSM controller is healthy, you see the following output:

```output
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)              AGE
osm-controller   ClusterIP   10.0.31.254   <none>        15128/TCP,9092/TCP   67m
```

> [!NOTE]
> The `CLUSTER-IP` will be different. The service `NAME` and `PORT(S)` should match what is shown here.

### Check OSM controller endpoints

```bash
kubectl get endpoints -n arc-osm-system osm-controller
```

If the OSM controller is healthy, you see output similar to:

```output
NAME             ENDPOINTS                              AGE
osm-controller   10.240.1.115:9092,10.240.1.115:15128   69m
```

If the cluster has no `ENDPOINTS` for `osm-controller`, the control plane is unhealthy. This unhealthy state means that the controller pod crashed or that it was never deployed correctly.

### Check OSM injector deployment

```bash
kubectl get deployments -n arc-osm-system osm-injector
```

If the OSM injector is healthy, you see output similar to:

```output
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
osm-injector   1/1     1            1           73m
```

### Check OSM injector pod

```bash
kubectl get pod -n arc-osm-system --selector app=osm-injector
```

If the OSM injector is healthy, you see output similar to:

```output
NAME                            READY   STATUS    RESTARTS   AGE
osm-injector-5986c57765-vlsdk   1/1     Running   0          73m
```

The `READY` column must be `1/1`. Any other value indicates an unhealthy OSM injector pod.

### Check OSM injector service

```bash
kubectl get service -n arc-osm-system osm-injector
```

If the OSM injector is healthy, you see output similar to:

```output
NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
osm-injector   ClusterIP   10.0.39.54   <none>        9090/TCP   75m
```

Ensure the IP address listed for `osm-injector` service is `9090`. There should be no `EXTERNAL-IP`.

### Check OSM injector endpoints

```bash
kubectl get endpoints -n arc-osm-system osm-injector
```

If the OSM injector is healthy, you see output similar to:

```output
NAME           ENDPOINTS           AGE
osm-injector   10.240.1.172:9090   75m
```

For OSM to function, there must be at least one endpoint for `osm-injector`. The IP address of your OSM injector endpoints will vary, but the port `9090` must be the same.

### Check **Validating** and **Mutating** webhooks

```bash
kubectl get ValidatingWebhookConfiguration --selector app=osm-controller
```

If the **Validating** webhook is healthy, you see output similar to:

```output
NAME                     WEBHOOKS   AGE
osm-validator-mesh-osm   1          81m
```

```bash
kubectl get MutatingWebhookConfiguration --selector app=osm-injector
```

If the **Mutating** webhook is healthy, you see output similar to:

```output
NAME                  WEBHOOKS   AGE
arc-osm-webhook-osm   1          102m
```

Check for the service and the CA bundle of the **Validating** webhook by using this command:

```bash
kubectl get ValidatingWebhookConfiguration osm-validator-mesh-osm -o json | jq '.webhooks[0].clientConfig.service'
```

A well configured **Validating** webhook configuration will have output similar to:

```json
{
  "name": "osm-config-validator",
  "namespace": "arc-osm-system",
  "path": "/validate",
  "port": 9093
}
```

Check for the service and the CA bundle of the **Mutating** webhook by using the following command:

```bash
kubectl get MutatingWebhookConfiguration arc-osm-webhook-osm -o json | jq '.webhooks[0].clientConfig.service'
```

A well configured **Mutating** webhook configuration will have output similar to the:

```output
{
  "name": "osm-injector",
  "namespace": "arc-osm-system",
  "path": "/mutate-pod-creation",
  "port": 9090
}
```

Check whether OSM Controller has given the **Validating** (or **Mutating**) webhook a CA Bundle by using the following command:

```bash
kubectl get ValidatingWebhookConfiguration osm-validator-mesh-osm -o json | jq -r '.webhooks[0].clientConfig.caBundle' | wc -c
```

```bash
kubectl get MutatingWebhookConfiguration arc-osm-webhook-osm -o json | jq -r '.webhooks[0].clientConfig.caBundle' | wc -c
```

Example output:

```bash
1845
```

The number in the output indicates the number of bytes, or the size of the CA Bundle. If the output is empty, 0, or a number under 1000, the CA Bundle isn't correctly provisioned. Without a correct CA Bundle, the `ValidatingWebhook` throws an error.

### Check the `osm-mesh-config` resource

Check for the existence of the resource:

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n arc-osm-system
```

Check the content of the OSM MeshConfig:

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n arc-osm-system -o yaml
```

You should see output similar to:

```yaml
apiVersion: config.openservicemesh.io/v1alpha1
kind: MeshConfig
metadata:
  creationTimestamp: "0000-00-00A00:00:00A"
  generation: 1
  name: osm-mesh-config
  namespace: arc-osm-system
  resourceVersion: "2494"
  uid: 6c4d67f3-c241-4aeb-bf4f-b029b08faa31
spec:
  certificate:
    certKeyBitSize: 2048
    serviceCertValidityDuration: 24h
  featureFlags:
    enableAsyncProxyServiceMapping: false
    enableEgressPolicy: true
    enableEnvoyActiveHealthChecks: false
    enableIngressBackendPolicy: true
    enableMulticlusterMode: false
    enableRetryPolicy: false
    enableSnapshotCacheMode: false
    enableWASMStats: true
  observability:
    enableDebugServer: false
    osmLogLevel: info
    tracing:
      enable: false
  sidecar:
    configResyncInterval: 0s
    enablePrivilegedInitContainer: false
    logLevel: error
    resources: {}
  traffic:
    enableEgress: false
    enablePermissiveTrafficPolicyMode: true
    inboundExternalAuthorization:
      enable: false
      failureModeAllow: false
      statPrefix: inboundExtAuthz
      timeout: 1s
    inboundPortExclusionList: []
    outboundIPRangeExclusionList: []
    outboundPortExclusionList: []
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```

`osm-mesh-config` resource values:

| Key | Type | Default Value | Kubectl Patch Command Examples |
|-----|------|---------------|--------------------------------|
| spec.traffic.enableEgress | bool | `false` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"traffic":{"enableEgress":false}}}'  --type=merge` |
| spec.traffic.enablePermissiveTrafficPolicyMode | bool | `true` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"traffic":{"enablePermissiveTrafficPolicyMode":true}}}'  --type=merge` |
| spec.traffic.outboundPortExclusionList | array | `[]` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"traffic":{"outboundPortExclusionList":[6379,8080]}}}'  --type=merge` |
| spec.traffic.outboundIPRangeExclusionList | array | `[]` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"traffic":{"outboundIPRangeExclusionList":["10.0.0.0/32","1.1.1.1/24"]}}}'  --type=merge` |
| spec.traffic.inboundPortExclusionList | array | `[]` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"traffic":{"inboundPortExclusionList":[6379,8080]}}}'  --type=merge` |
| spec.certificate.serviceCertValidityDuration | string | `"24h"` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"certificate":{"serviceCertValidityDuration":"24h"}}}'  --type=merge` |
| spec.observability.enableDebugServer | bool | `false` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"observability":{"enableDebugServer":false}}}'  --type=merge` |
| spec.observability.osmLogLevel | string | `"info"`| `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"observability":{"tracing":{"osmLogLevel": "info"}}}}'  --type=merge` |
| spec.observability.tracing.enable | bool | `false` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"observability":{"tracing":{"enable":true}}}}'  --type=merge` |
| spec.sidecar.enablePrivilegedInitContainer | bool | `false` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"sidecar":{"enablePrivilegedInitContainer":true}}}'  --type=merge` |
| spec.sidecar.logLevel | string | `"error"` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"sidecar":{"logLevel":"error"}}}'  --type=merge` |
| spec.featureFlags.enableWASMStats | bool | `"true"` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"featureFlags":{"enableWASMStats":"true"}}}'  --type=merge` |
| spec.featureFlags.enableEgressPolicy | bool | `"true"` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"featureFlags":{"enableEgressPolicy":"true"}}}'  --type=merge` |
| spec.featureFlags.enableMulticlusterMode | bool | `"false"` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"featureFlags":{"enableMulticlusterMode":"false"}}}'  --type=merge` |
| spec.featureFlags.enableSnapshotCacheMode | bool | `"false"` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"featureFlags":{"enableSnapshotCacheMode":"false"}}}'  --type=merge` |
| spec.featureFlags.enableAsyncProxyServiceMapping | bool | `"false"` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"featureFlags":{"enableAsyncProxyServiceMapping":"false"}}}'  --type=merge` |
| spec.featureFlags.enableIngressBackendPolicy | bool | `"true"` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"featureFlags":{"enableIngressBackendPolicy":"true"}}}'  --type=merge` |
| spec.featureFlags.enableEnvoyActiveHealthChecks | bool | `"false"` | `kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"featureFlags":{"enableEnvoyActiveHealthChecks":"false"}}}'  --type=merge` |

### Check namespaces

>[!Note]
>The arc-osm-system namespace will never participate in a service mesh and will never be labeled or annotated with the key/values shown here.

We use the `osm namespace add` command to join namespaces to a given service mesh. When a Kubernetes namespace is part of the mesh, follow these steps to confirm requirements are met.

View the annotations of the namespace `bookbuyer`:

```bash
kubectl get namespace bookbuyer -o json | jq '.metadata.annotations'
```

The following annotation must be present:

```bash
{
  "openservicemesh.io/sidecar-injection": "enabled"
}
```

View the labels of the namespace `bookbuyer`:

```bash
kubectl get namespace bookbuyer -o json | jq '.metadata.labels'
```

The following label must be present:

```bash
{
  "openservicemesh.io/monitored-by": "osm"
}
```

If you aren't using `osm` CLI, you can also manually add these annotations to your namespaces. If a namespace isn't annotated with `"openservicemesh.io/sidecar-injection": "enabled"`, or isn't labeled with `"openservicemesh.io/monitored-by": "osm"`, the OSM injector won't add Envoy sidecars.

> [!NOTE]
> After `osm namespace add` is called, only **new** pods will be injected with an Envoy sidecar. Existing pods must be restarted with the `kubectl rollout restart deployment` command.

### Verify the SMI CRDs

Check whether the cluster has the required Custom Resource Definitions (CRDs) by using the following command:

```bash
kubectl get crds
```

Ensure that the CRDs correspond to the versions available in the release branch. To confirm which CRD versions are in use, visit the [SMI supported versions page](https://docs.openservicemesh.io/docs/overview/smi/) and select your version from the **Releases** dropdown.

Get the versions of the installed CRDs with the following command:

```bash
for x in $(kubectl get crds --no-headers | awk '{print $1}' | grep 'smi-spec.io'); do
    kubectl get crd $x -o json | jq -r '(.metadata.name, "----" , .spec.versions[].name, "\n")'
done
```

If CRDs are missing, use the following commands to install them on the cluster. Replace the version in these commands as needed (for example, v1.1.0 would be release-v1.1).

```bash
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-v1.0/cmd/osm-bootstrap/crds/smi_http_route_group.yaml

kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-v1.0/cmd/osm-bootstrap/crds/smi_tcp_route.yaml

kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-v1.0/cmd/osm-bootstrap/crds/smi_traffic_access.yaml

kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-v1.0/cmd/osm-bootstrap/crds/smi_traffic_split.yaml
```

To see CRD changes between releases, refer to the [OSM release notes](https://github.com/openservicemesh/osm/releases).

### Troubleshoot certificate management

For information on how OSM issues and manages certificates to Envoy proxies running on application pods, see the [OSM docs site](https://docs.openservicemesh.io/docs/guides/certificates/).

### Upgrade Envoy

When a new pod is created in a namespace monitored by the add-on, OSM injects an [Envoy proxy sidecar](https://docs.openservicemesh.io/docs/guides/app_onboarding/sidecar_injection/) in that pod. If the Envoy version needs to be updated, follow the steps in the [Upgrade Guide](https://docs.openservicemesh.io/docs/guides/upgrade/#envoy) on the OSM docs site.

## Next steps

- Learn more about [cluster extensions](conceptual-extensions.md).
- View general [troubleshooting tips for Arc-enabled Kubernetes clusters](extensions-troubleshooting.md).
