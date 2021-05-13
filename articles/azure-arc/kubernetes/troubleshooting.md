---
title: "Troubleshoot common Azure Arc enabled Kubernetes issues"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 05/13/2021
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Troubleshooting common issues with Arc enabled Kubernetes clusters."
keywords: "Kubernetes, Arc, Azure, containers"
---

# Azure Arc enabled Kubernetes troubleshooting

This document provides troubleshooting guides for issues with connectivity, permissions, and agents.

## General troubleshooting

### Azure CLI

Before using `az connectedk8s` or `az k8s-configuration` CLI commands, check that Azure CLI is set to work against the correct Azure subscription.

```azurecli
az account set --subscription 'subscriptionId'
az account show
```

### Azure Arc agents

All agents for Azure Arc enabled Kubernetes are deployed as pods in the `azure-arc` namespace. All pods should be running and passing their health checks.

First, verify the Azure Arc helm release:

```console
$ helm --namespace default status azure-arc
NAME: azure-arc
LAST DEPLOYED: Fri Apr  3 11:13:10 2020
NAMESPACE: default
STATUS: deployed
REVISION: 5
TEST SUITE: None
```

If the Helm release isn't found or missing, try [connecting the cluster to Azure Arc](./quickstart-connect-cluster.md) again.

If the Helm release is present with `STATUS: deployed`, check the status of the agents using `kubectl`:

```console
$ kubectl -n azure-arc get deployments,pods
NAME                                       READY  UP-TO-DATE  AVAILABLE  AGE
deployment.apps/clusteridentityoperator     1/1       1          1       16h
deployment.apps/config-agent                1/1       1          1       16h
deployment.apps/cluster-metadata-operator   1/1       1          1       16h
deployment.apps/controller-manager          1/1       1          1       16h
deployment.apps/flux-logs-agent             1/1       1          1       16h
deployment.apps/metrics-agent               1/1       1          1       16h
deployment.apps/resource-sync-agent         1/1       1          1       16h

NAME                                            READY   STATUS  RESTART  AGE
pod/cluster-metadata-operator-7fb54d9986-g785b  2/2     Running  0       16h
pod/clusteridentityoperator-6d6678ffd4-tx8hr    3/3     Running  0       16h
pod/config-agent-544c4669f9-4th92               3/3     Running  0       16h
pod/controller-manager-fddf5c766-ftd96          3/3     Running  0       16h
pod/flux-logs-agent-7c489f57f4-mwqqv            2/2     Running  0       16h
pod/metrics-agent-58b765c8db-n5l7k              2/2     Running  0       16h
pod/resource-sync-agent-5cf85976c7-522p5        3/3     Running  0       16h
```

All pods should show `STATUS` as `Running` with either `3/3` or `2/2` under the `READY` column. Fetch logs and describe the pods returning an `Error` or `CrashLoopBackOff`. If any pods are stuck in `Pending` state, there might be insufficient resources on cluster nodes. [Scale up your cluster](https://kubernetes.io/docs/tasks/administer-cluster/) can get these pods to transition to `Running` state.

## Connecting Kubernetes clusters to Azure Arc

Connecting clusters to Azure requires both access to an Azure subscription and `cluster-admin` access to a target cluster. If you cannot reach the cluster or you have insufficient permissions, connecting the cluster to Azure Arc will fail.

### Insufficient cluster permissions

If the provided kubeconfig file does not have sufficient permissions to install the Azure Arc agents, the Azure CLI command will return an error.

```azurecli
$ az connectedk8s connect --resource-group AzureArc --name AzureArcCluster
Ensure that you have the latest helm version installed before proceeding to avoid unexpected errors.
This operation might take a while...

Error: list: failed to list: secrets is forbidden: User "myuser" cannot list resource "secrets" in API group "" at the cluster scope
```

The user connecting the cluster to Azure Arc should have `cluster-admin` role assigned to them on the cluster.

### Installation timeouts

Connecting a Kubernetes cluster to Azure Arc enabled Kubernetes requires installation of Azure Arc agents on the cluster. If the cluster is running over a slow internet connection, the container image pull for agents may take longer than the Azure CLI timeouts.

```azurecli
$ az connectedk8s connect --resource-group AzureArc --name AzureArcCluster
Ensure that you have the latest helm version installed before proceeding to avoid unexpected errors.
This operation might take a while...
```

### Helm issue

Helm `v3.3.0-rc.1` version has an [issue](https://github.com/helm/helm/pull/8527) where helm install/upgrade (used by `connectedk8s` CLI extension) results in running of all hooks leading to the following error:

```console
$ az connectedk8s connect -n shasbakstest -g shasbakstest
Ensure that you have the latest helm version installed before proceeding.
This operation might take a while...

Please check if the azure-arc namespace was deployed and run 'kubectl get pods -n azure-arc' to check if all the pods are in running state. A possible cause for pods stuck in pending state could be insufficientresources on the kubernetes cluster to onboard to arc.
ValidationError: Unable to install helm release: Error: customresourcedefinitions.apiextensions.k8s.io "connectedclusters.arc.azure.com" not found
```

To recover from this issue, follow these steps:

1. Delete the Azure Arc enabled Kubernetes resource in the Azure portal.
2. Run the following commands on your machine:
    
    ```console
    kubectl delete ns azure-arc
    kubectl delete clusterrolebinding azure-arc-operator
    kubectl delete secret sh.helm.release.v1.azure-arc.v1
    ```

3. [Install a stable version](https://helm.sh/docs/intro/install/) of Helm 3 on your machine instead of the release candidate version.
4. Run the `az connectedk8s connect` command with the appropriate values to connect the cluster to Azure Arc.

## Configuration management

### General
To help troubleshoot issues with configuration resource, run az commands with `--debug` parameter specified.

```console
az provider show -n Microsoft.KubernetesConfiguration --debug
az k8s-configuration create <parameters> --debug
```

### Create configurations

Write permissions on the Azure Arc enabled Kubernetes resource (`Microsoft.Kubernetes/connectedClusters/Write`) are necessary and sufficient for creating configurations on that cluster.

### Configuration remains `Pending`

```console
kubectl -n azure-arc logs -l app.kubernetes.io/component=config-agent -c config-agent
$ k -n pending get gitconfigs.clusterconfig.azure.com  -o yaml
apiVersion: v1
items:
- apiVersion: clusterconfig.azure.com/v1beta1
  kind: GitConfig
  metadata:
    creationTimestamp: "2020-04-13T20:37:25Z"
    generation: 1
    name: pending
    namespace: pending
    resourceVersion: "10088301"
    selfLink: /apis/clusterconfig.azure.com/v1beta1/namespaces/pending/gitconfigs/pending
    uid: d9452407-ff53-4c02-9b5a-51d55e62f704
  spec:
    correlationId: ""
    deleteOperator: false
    enableHelmOperator: false
    giturl: git@github.com:slack/cluster-config.git
    helmOperatorProperties: null
    operatorClientLocation: azurearcfork8s.azurecr.io/arc-preview/fluxctl:0.1.3
    operatorInstanceName: pending
    operatorParams: '"--disable-registry-scanning"'
    operatorScope: cluster
    operatorType: flux
  status:
    configAppliedTime: "2020-04-13T20:38:43.081Z"
    isSyncedWithAzure: true
    lastPolledStatusTime: ""
    message: 'Error: {exit status 1} occurred while doing the operation : {Installing
      the operator} on the config'
    operatorPropertiesHashed: ""
    publicKey: ""
    retryCountPublicKey: 0
    status: Installing the operator
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```
## Monitoring

Azure Monitor for containers requires its DaemonSet to be run in privileged mode. To successfully set up a Canonical Charmed Kubernetes cluster for monitoring, run the following command:

```console
juju config kubernetes-worker allow-privileged=true
```

## Enable custom locations using service principal

When you are connecting your cluster to Azure Arc or when you are enabling custom locations feature on an existing cluster, you may observe the following warning:

```console
Unable to fetch oid of 'custom-locations' app. Proceeding without enabling the feature. Insufficient privileges to complete the operation.
```

The above warning is observed when you have used a service principal to log into Azure and this service principal doesn't have permissions to get information of the application used by Azure Arc service. Run the following commands to grant the required permissions:

```console
az ad app permission add --id <service-principal-app-id> --api 00000002-0000-0000-c000-000000000000 --api-permissions 3afa6a7d-9b1a-42eb-948e-1650a849e176=Role
az ad app permission admin-consent --id <service-principal-app-id>
```

Once above permissions are granted, you can now proceed to [enabling the custom location feature](custom-locations.md#enable-custom-locations-on-cluster) on the cluster.

## Arc enabled Open Service Mesh

### 1. Check OSM Controller **Deployment**
```bash
kubectl get deployment -n arc-osm-system --selector app=osm-controller
```

A healthy OSM Controller would look like this:
```
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
osm-controller   1/1     1            1           59m
```

### 2. Check the OSM Controller **Pod**
```bash
kubectl get pods -n arc-osm-system --selector app=osm-controller
```

A healthy OSM Controller would look like this:
```
NAME                            READY   STATUS    RESTARTS   AGE
osm-controller-b5bd66db-wglzl   0/1     Evicted   0          61m
osm-controller-b5bd66db-wvl9w   1/1     Running   0          31m
```

Eventhough we had one controller _evicted_ at some point, we have another one which is `READY 1/1` and `Running` with `0` restarts.
If the column `READY` is anything other than `1/1` the service mesh would be in a broken state.
Column `READY` with `0/1` indicates the control plane container is crashing - we need to get logs. See `Get OSM Controller Logs from Azure Support Center` section below.
Column `READY` with a number higher than 1 after the `/` would indicate that there are sidecars installed. OSM Controller would most likely not work with any sidecars attached to it.

### 3. Check OSM Controller **Service**
```bash
kubectl get service -n arc-osm-system osm-controller
```

A healthy OSM Controller would look like this:
```
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)              AGE
osm-controller   ClusterIP   10.0.31.254   <none>        15128/TCP,9092/TCP   67m
```

> Note: The `CLUSTER-IP` would be different. The service `NAME` and `PORT(S)` must be the same as the example above.

### 4. Check OSM Controller **Endpoints**:
```bash
kubectl get endpoints -n arc-osm-system osm-controller
```

A healthy OSM Controller would look like this:
```
NAME             ENDPOINTS                              AGE
osm-controller   10.240.1.115:9092,10.240.1.115:15128   69m
```

If the user's cluster has no `ENDPOINTS` for `osm-controller` this would indicate that the control plane is unhealthy. This may be caused by the OSM Controller pod crashing, or never deployed correctly.

### 5. Check OSM Injector **Deployment**
```bash
kubectl get deployments -n arc-osm-system osm-injector
```

A healthy OSM Injector would look like this:
```
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
osm-injector   1/1     1            1           73m
```

### 6. Check OSM Injector **Pod**
```bash
kubectl get pod -n arc-osm-system --selector app=osm-injector
```

A healthy OSM Injector would look like this:
```
NAME                            READY   STATUS    RESTARTS   AGE
osm-injector-5986c57765-vlsdk   1/1     Running   0          73m
```

Same applies here - the `READY` column must be `1/1`. Any other value would indicate unhealthy osm-injector pod.

### 7. Check OSM Injector **Service**
```bash
kubectl get service -n arc-osm-system osm-injector
```

A healthy OSM Injector would look like this:
```
NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
osm-injector   ClusterIP   10.0.39.54   <none>        9090/TCP   75m
```

Ensure the IP address listed for `osm-injector` service is `9090`. There should be no `EXTERNAL-IP`.

### 8. Check OSM Injector **Endpoints**
```bash
kubectl get endpoints -n arc-osm-system osm-injector
```

A healthy OSM Injector would look like this:
```
NAME           ENDPOINTS           AGE
osm-injector   10.240.1.172:9090   75m
```

For OSM to function there must be at least one endpoint for `osm-injector`. The IP address of the user's OSM Injector endpoints will be different. The port `9090` must be the same.


### 9. Check **Validating** and **Mutating** webhooks:
```bash
kubectl get ValidatingWebhookConfiguration --selector app=osm-controller
```

A helathy Validating Webhook would look like this:
```
NAME              WEBHOOKS   AGE
arc-osm-webhook-osm   1      81m
```

```bash
kubectl get MutatingWebhookConfiguration --selector app=osm-controller
```


A healthy Mutating Webhook would look like this:
```
NAME              WEBHOOKS   AGE
arc-osm-webhook-osm   1      102m
```

Check for the service and the CA bundle of the **Validating** webhook:
```
kubectl get ValidatingWebhookConfiguration arc-osm-webhook-osm -o json | jq '.webhooks[0].clientConfig.service'
```

A well configured Validating Webhook Configuration would look exactly like this:
```json
{
  "name": "osm-config-validator",
  "namespace": "arc-osm-system",
  "path": "/validate-webhook",
  "port": 9093
}
```

Check for the service and the CA bundle of the **Mutating** webhook:
```bash
kubectl get MutatingWebhookConfiguration arc-osm-webhook-osm -o json | jq '.webhooks[0].clientConfig.service'
```

A well configured Mutating Webhook Configuration would look exactly like this:
```
{
  "name": "osm-injector",
  "namespace": "arc-osm-system",
  "path": "/mutate-pod-creation",
  "port": 9090
}
```


We must also check whether OSM Controller has given the Validating (or Mutating) Webhook a CA Bundle.

```bash
kubectl get ValidatingWebhookConfiguration arc-osm-webhook-osm -o json | jq -r '.webhooks[0].clientConfig.caBundle' | wc -c
```

```bash
kubectl get MutatingWebhookConfiguration arc-osm-webhook-osm -o json | jq -r '.webhooks[0].clientConfig.caBundle' | wc -c
```

Example output:
```
1845
```
This number indicates the number of bytes, or the size of the CA Bundle. If this is empty, 0, or some number under a 1000 it would indicate that the CA Bundle is not correctly provisioned. Without a correct CA Bundle the Validating Webhook would be erroring out and prohibiting the user from making changes to the `osm-config` ConfigMap in the `arc-osm-system` namespace.

A sample error when the CA Bundle is incorrect:
- an attepmt to change the `osm-config` ConfigMap:
```bash
kubectl patch ConfigMap osm-config -n arc-osm-system --type merge --patch '{"data":{"config_resync_interval":"2m"}}'
```
- error:
```
Error from server (InternalError): Internal error occurred: failed calling webhook "osm-config-webhook.k8s.io": Post https://osm-config-validator.arc-osm-system.svc:9093/validate-webhook?timeout=30s: x509: certificate signed by unknown authority
```

Workaround for when the **Validating** Webhook Configuration has a bad certificate:
- Option 1. Restart OSM Controller - this will restart the OSM Controller. On start it will overwrite the CA Bundle of both the Mutating and Validating webhooks.
```bash
kubectl rollout restart deployment -n arc-osm-system osm-controller
```

- Option 2. Delete the Validating Webhook  - removing the Validating Webhook makes mutations of the `osm-config` ConfigMap no longer validated. Any patch will go through. The OSM Controller may have to be restarted to quickly rewrite the CA Bundle.
```bash
kubectl delete ValidatingWebhookConfiguration arc-osm-webhook-osm
```

- Option 3. Delete and Patch: The following command will delete the validating webhook, allowing us to add any values, and will immediately try to apply a patch
```bash
kubectl delete ValidatingWebhookConfiguration arc-osm-webhook-osm; kubectl patch ConfigMap osm-config -n arc-osm-system --type merge --patch '{"data":{"config_resync_interval":"15s"}}'
```


### 10. Check the `osm-config` **ConfigMap**

> Note: The OSM Controller does not require for the `osm-config` ConfigMap to be present in the `arc-osm-system` namespace. The controller has reasonable default values for the config and can operate without it.

Check for the existence:
```bash
kubectl get ConfigMap -n arc-osm-system osm-config
```

Check the content of the `osm-config` ConfigMap
```bash
kubectl get ConfigMap -n arc-osm-system osm-config -o json | jq '.data'     
```

```json
{
  "egress": "false",
  "enable_debug_server": "false",
  "enable_privileged_init_container": "false",
  "envoy_log_level": "error",
  "permissive_traffic_policy_mode": "true",
  "prometheus_scraping": "true",
  "service_cert_validity_duration": "24h",
  "tracing_enable": "false",
  "use_https_ingress": "false",
}
```

Refer [OSM ConfigMap documentation](https://github.com/openservicemesh/osm/blob/release-v0.8/docs/content/docs/osm_config_map.md) to understand `osm-config` ConfigMap values.

### 11. Check Namespaces

> Note: The arc-osm-system namespace will never participate in a service mesh and will never be labeled and/or annotated with the key/values below.

We use the `osm namespace add` command to join namespaces to a given service mesh.
When a k8s namespace is part of the mesh (or for it to be part of the mesh) the following must be true:

View the annotations with
```bash
kc get namespace bookbuyer-many-many-8 -o json | jq '.metadata.annotations'
```

The following annotation must be present:
```
{
  "openservicemesh.io/sidecar-injection": "enabled"
}
```


View the labels with
```bash
kc get namespace bookbuyer-many-many-8 -o json | jq '.metadata.labels'
```

The following label must be present:
```
{
  "openservicemesh.io/monitored-by": "osm"
}
```

If a namespace is not annotated with `"openservicemesh.io/sidecar-injection": "enabled"` or not labeled with `"openservicemesh.io/monitored-by": "osm"` the OSM Injector will not add Envoy sidecars.

> Note: After `osm namespace add` is called only **new** pods will be injected with an Envoy sidecar. Existing pods must be restarted with `kubectl rollout restard deployment ...`


### 12. Verify the SMI CRDs:
Check whether the cluster has the required CRDs:
```bash
kubectl get crds
```

We must have the CRDs corresponding to the same OSM upstream version. Refer [OSM release notes](https://github.com/openservicemesh/osm/releases).

Get the versions of the CRDs installed with this command:
```bash
for x in $(kubectl get crds --no-headers | awk '{print $1}' | grep 'smi-spec.io'); do
    kubectl get crd $x -o json | jq -r '(.metadata.name, "----" , .spec.versions[].name, "\n")'
done
```

If CRDs are missing use the following commands to install these on the cluster:
```bash
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/v0.8.2/charts/osm/crds/access.yaml

kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/v0.8.2/charts/osm/crds/specs.yaml

kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/v0.8.2/charts/osm/crds/split.yaml
```