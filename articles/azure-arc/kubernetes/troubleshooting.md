---
title: "Troubleshoot common Azure Arc-enabled Kubernetes issues"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 03/09/2022
ms.topic: article
description: "Troubleshooting common issues with Azure Arc-enabled Kubernetes clusters and GitOps."
keywords: "Kubernetes, Arc, Azure, containers, GitOps, Flux"
---

# Azure Arc-enabled Kubernetes and GitOps troubleshooting

This document provides troubleshooting guides for issues with Azure Arc-enabled Kubernetes connectivity, permissions, and agents.  It also provides troubleshooting guides for Azure GitOps, which can be used in either Azure Arc-enabled Kubernetes or Azure Kubernetes Service (AKS) clusters.

## General troubleshooting

### Azure CLI

Before using `az connectedk8s` or `az k8s-configuration` CLI commands, check that Azure CLI is set to work against the correct Azure subscription.

```azurecli
az account set --subscription 'subscriptionId'
az account show
```

### Azure Arc agents

All agents for Azure Arc-enabled Kubernetes are deployed as pods in the `azure-arc` namespace. All pods should be running and passing their health checks.

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

### Azure CLI is unable to download Helm chart for Azure Arc agents

If you are using Helm version >= 3.7.0, you will run into the following error when `az connectedk8s connect` is run to connect the cluster to Azure Arc:

```azurecli
az connectedk8s connect -n AzureArcTest -g AzureArcTest
```

```output
Unable to pull helm chart from the registry 'mcr.microsoft.com/azurearck8s/batch1/stable/azure-arc-k8sagents:1.4.0': Error: unknown command "chart" for "helm"
Run 'helm --help' for usage.
```

In this case, you'll need to install a prior version of [Helm 3](https://helm.sh/docs/intro/install/), where version &lt; 3.7.0. After this, run the `az connectedk8s connect` command again to connect the cluster to Azure Arc.

### Insufficient cluster permissions

If the provided kubeconfig file does not have sufficient permissions to install the Azure Arc agents, the Azure CLI command will return an error.

```azurecli
az connectedk8s connect --resource-group AzureArc --name AzureArcCluster
```

```output
Ensure that you have the latest helm version installed before proceeding to avoid unexpected errors.
This operation might take a while...

Error: list: failed to list: secrets is forbidden: User "myuser" cannot list resource "secrets" in API group "" at the cluster scope
```

The user connecting the cluster to Azure Arc should have `cluster-admin` role assigned to them on the cluster.

### Unable to connect OpenShift cluster to Azure Arc

If `az connectedk8s connect` is timing out and failing when connecting an OpenShift cluster to Azure Arc, check the following:

1. The OpenShift cluster needs to meet the version prerequisites: 4.5.41+ or 4.6.35+ or 4.7.18+.

1. Before running `az connectedk8s connnect`, the following command needs to be run on the cluster:

    ```console
    oc adm policy add-scc-to-user privileged system:serviceaccount:azure-arc:azure-arc-kube-aad-proxy-sa
    ```

### Installation timeouts

Connecting a Kubernetes cluster to Azure Arc-enabled Kubernetes requires installation of Azure Arc agents on the cluster. If the cluster is running over a slow internet connection, the container image pull for agents may take longer than the Azure CLI timeouts.

```azurecli
az connectedk8s connect --resource-group AzureArc --name AzureArcCluster
```

```output
Ensure that you have the latest helm version installed before proceeding to avoid unexpected errors.
This operation might take a while...
```
### Helm timeout error

```azurecli
az connectedk8s connect -n AzureArcTest -g AzureArcTest
```

```output
Unable to install helm release: Error: UPGRADE Failed: time out waiting for the condition
```

If you get the above helm timeout issue, you can troubleshoot as follows:

  1. Run the following command:

      ```console
      kubectl get pods -n azure-arc
      ```
  2. Check if the `clusterconnect-agent` or the `config-agent` pods are showing crashloopbackoff, or not all containers are running:
    
      ```output
      NAME                                        READY   STATUS             RESTARTS   AGE
      cluster-metadata-operator-664bc5f4d-chgkl   2/2     Running            0          4m14s
      clusterconnect-agent-7cb8b565c7-wklsh       2/3     CrashLoopBackOff   0          1m15s
      clusteridentityoperator-76d645d8bf-5qx5c    2/2     Running            0          4m15s
      config-agent-65d5df564f-lffqm               1/2     CrashLoopBackOff   0          1m14s
      ```
  3. If the below certificate isn't present, the system assigned managed identity didn't get installed.
    
      ```console
      kubectl get secret -n azure-arc -o yaml | grep name:
      ```
      
      ```output
      name: azure-identity-certificate
      ```
      This could be a transient issue. You can try deleting the Arc deployment by running the `az connectedk8s delete` command and reinstalling it. If you're consistently facing this, it could be an issue with your proxy settings. Please follow [these steps](./quickstart-connect-cluster.md#connect-using-an-outbound-proxy-server) to connect your cluster to Arc via a proxy.
  4. If the `clusterconnect-agent` and the `config-agent` pods are running, but the `kube-aad-proxy` pod is missing, check your pod security policies. This pod uses the `azure-arc-kube-aad-proxy-sa` service account, which doesn't have admin permissions but requires the permission to mount host path.
  

### Helm validation error

Helm `v3.3.0-rc.1` version has an [issue](https://github.com/helm/helm/pull/8527) where helm install/upgrade (used by `connectedk8s` CLI extension) results in running of all hooks leading to the following error:

```azurecli
az connectedk8s connect -n AzureArcTest -g AzureArcTest
```

```output
Ensure that you have the latest helm version installed before proceeding.
This operation might take a while...

Please check if the azure-arc namespace was deployed and run 'kubectl get pods -n azure-arc' to check if all the pods are in running state. A possible cause for pods stuck in pending state could be insufficientresources on the Kubernetes cluster to onboard to arc.
ValidationError: Unable to install helm release: Error: customresourcedefinitions.apiextensions.k8s.io "connectedclusters.arc.azure.com" not found
```

To recover from this issue, follow these steps:

1. Delete the Azure Arc-enabled Kubernetes resource in the Azure portal.
2. Run the following commands on your machine:
    
    ```console
    kubectl delete ns azure-arc
    kubectl delete clusterrolebinding azure-arc-operator
    kubectl delete secret sh.helm.release.v1.azure-arc.v1
    ```

3. [Install a stable version](https://helm.sh/docs/intro/install/) of Helm 3 on your machine instead of the release candidate version.
4. Run the `az connectedk8s connect` command with the appropriate values to connect the cluster to Azure Arc.

### CryptoHash module error

When attempting to onboard Kubernetes clusters to the Azure Arc platform, the local environment (for example, your client console) may return the following error message:

```output
Cannot load native module 'Crypto.Hash._MD5'
```

Sometimes, dependent modules fail to download successfully when adding the extensions `connectedk8s` and `k8s-configuration` through Azure CLI or Azure PowerShell. To fix this problem, manually remove and then add the extensions in the local environment.

To remove the extensions, use:

```azurecli
az extension remove --name connectedk8s

az extension remove --name k8s-configuration
```

To add the extensions, use:

```azurecli
az extension add --name connectedk8s

az extension add --name k8s-configuration
```

## GitOps management

### Flux v1 - General

To help troubleshoot issues with `sourceControlConfigurations` resource (Flux v1), run these az commands with `--debug` parameter specified:

```azurecli
az provider show -n Microsoft.KubernetesConfiguration --debug
az k8s-configuration create <parameters> --debug
```

### Flux v1 - Create configurations

Write permissions on the Azure Arc-enabled Kubernetes resource (`Microsoft.Kubernetes/connectedClusters/Write`) are necessary and sufficient for creating configurations on that cluster.

### `sourceControlConfigurations` remains `Pending` (Flux v1)

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

### Flux v2 - General

To help troubleshoot issues with `fluxConfigurations` resource (Flux v2), run these az commands with `--debug` parameter specified:

```azurecli
az provider show -n Microsoft.KubernetesConfiguration --debug
az k8s-configuration flux create <parameters> --debug
```

### Flux v2 - Webhook/dry run errors

If you see Flux fail to reconcile with an error like `dry-run failed, error: admission webhook "<webhook>" does not support dry run`, you can resolve the issue by finding the `ValidatingWebhookConfiguration` or the `MutatingWebhookConfiguration` and setting the `sideEffects` to `None` or `NoneOnDryRun`:

For more information, see [How do I resolve `webhook does not support dry run` errors?](https://fluxcd.io/docs/faq/#how-do-i-resolve-webhook-does-not-support-dry-run-errors)

### Flux v2 - Error installing the `microsoft.flux` extension

The `microsoft.flux` extension installs the Flux controllers and Azure GitOps agents into your Azure Arc-enabled Kubernetes or Azure Kubernetes Service (AKS) clusters. If the extension is not already installed in a cluster and you create a GitOps configuration resource for that cluster, the extension will be installed automatically.

If you experience an error during installation or if the extension is in a failed state, you can first run a script to investigate.  The cluster-type parameter can be set to `connectedClusters` for an Arc-enabled cluster or `managedClusters` for an AKS cluster. The name of the `microsoft.flux` extension will be "flux" if the extension was installed automatically during creation of a GitOps configuration. Look in the "statuses" object for information.

One example:

```azurecli
az k8s-extension show -g <RESOURCE_GROUP> -c <CLUSTER_NAME> -n flux -t <connectedClusters or managedClusters>
```

```output
"statuses": [
    {
      "code": "InstallationFailed",
      "displayStatus": null,
      "level": null,
      "message": "unable to add the configuration with configId {extension:flux} due to error: {error while adding the CRD configuration: error {Operation cannot be fulfilled on extensionconfigs.clusterconfig.azure.com \"flux\": the object has been modified; please apply your changes to the latest version and try again}}",
      "time": null
    }
  ]
```

Another example:

```azurecli
az k8s-extension show -g <RESOURCE_GROUP> -c <CLUSTER_NAME> -n flux -t <connectedClusters or managedClusters>
```

```output
"statuses": [
    {
      "code": "InstallationFailed",
      "displayStatus": null,
      "level": null,
      "message": "Error: {failed to install chart from path [] for release [flux]: err [cannot re-use a name that is still in use]} occurred while doing the operation : {Installing the extension} on the config",
      "time": null
    }
  ]
```

Another example from the portal:

```console
{'code':'DeploymentFailed','message':'At least one resource deployment operation failed. Please list 
deployment operations for details. Please see https://aka.ms/DeployOperations for usage details.
','details':[{'code':'ExtensionCreationFailed', 'message':' Request failed to https://management.azure.com/
subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerService/
managedclusters/<CLUSTER_NAME>/extensionaddons/flux?api-version=2021-03-01. Error code: BadRequest. 
Reason: Bad Request'}]}
```

For all these cases, possible remediation actions are to force delete the extension, uninstall the Helm release, and delete the `flux-system` namespace from the cluster.

```azurecli
az k8s-extension delete --force -g <RESOURCE_GROUP> -c <CLUSTER_NAME> -n flux -t <managedClusters OR connectedClusters>
```

```console
helm uninstall flux -n flux-system
kubectl delete namespaces flux-system
```

Some other aspects to consider:
    
* For AKS cluster, assure that the subscription has the following feature flag enabled: `Microsoft.ContainerService/AKS-ExtensionManager`.

     ```azurecli
     az feature register --namespace Microsoft.ContainerService --name AKS-ExtensionManager
     ```

* Assure that the cluster does not have any policies that restrict creation of the `flux-system` namespace or resources in that namespace.

With these actions accomplished you can either [re-create a flux configuration](./tutorial-use-gitops-flux2.md) which will install the flux extension automatically or you can re-install the flux extension manually.

### Flux v2 - Installing the `microsoft.flux` extension in a cluster with Azure AD Pod Identity enabled

If you attempt to install the Flux extension in a cluster that has Azure Active Directory (Azure AD) Pod Identity enabled, an error may occur in the extension-agent pod.

```console
{"Message":"2021/12/02 10:24:56 Error: in getting auth header : error {adal: Refresh request failed. Status Code = '404'. Response body: no azure identity found for request clientID <REDACTED>\n}","LogType":"ConfigAgentTrace","LogLevel":"Information","Environment":"prod","Role":"ClusterConfigAgent","Location":"westeurope","ArmId":"/subscriptions/<REDACTED>/resourceGroups/<REDACTED>/providers/Microsoft.Kubernetes/managedclusters/<REDACTED>","CorrelationId":"","AgentName":"FluxConfigAgent","AgentVersion":"0.4.2","AgentTimestamp":"2021/12/02 10:24:56"}
```

The extension status also returns as "Failed".

```console
"{\"status\":\"Failed\",\"error\":{\"code\":\"ResourceOperationFailure\",\"message\":\"The resource operation completed with terminal provisioning state 'Failed'.\",\"details\":[{\"code\":\"ExtensionCreationFailed\",\"message\":\" error: Unable to get the status from the local CRD with the error : {Error : Retry for given duration didn't get any results with err {status not populated}}\"}]}}",
```

The issue is that the extension-agent pod is trying to get its token from IMDS on the cluster in order to talk to the extension service in Azure; however, this token request is being intercepted by pod identity ([details here](../../aks/use-azure-ad-pod-identity.md)). 

The workaround is to create an `AzurePodIdentityException` that will tell Azure AD Pod Identity to ignore the token requests from flux-extension pods.

```console
apiVersion: aadpodidentity.k8s.io/v1
kind: AzurePodIdentityException
metadata:
  name: flux-extension-exception
  namespace: flux-system
spec:
  podLabels:
    app.kubernetes.io/name: flux-extension
```

## Monitoring

Azure Monitor for containers requires its DaemonSet to be run in privileged mode. To successfully set up a Canonical Charmed Kubernetes cluster for monitoring, run the following command:

```console
juju config kubernetes-worker allow-privileged=true
```

## Cluster connect

### Old version of agents used

Usage of older version of agents where Cluster Connect feature was not yet supported will result in the following error:

```azurecli
az connectedk8s proxy -n AzureArcTest -g AzureArcTest
```

```output
Hybrid connection for the target resource does not exist. Agent might not have started successfully.
```

When this occurs, ensure that you are using `connectedk8s` Azure CLI extension of version >= 1.2.0 and [connect your cluster again](quickstart-connect-cluster.md) to Azure Arc. Also, verify that you've met all the [network prerequisites](quickstart-connect-cluster.md#meet-network-requirements) needed for Arc-enabled Kubernetes. If your cluster is behind an outbound proxy or firewall, verify that websocket connections are enabled for `*.servicebus.windows.net` which is required specifically for the [Cluster Connect](cluster-connect.md) feature.

### Cluster Connect feature disabled

If the Cluster Connect feature is disabled on the cluster, then `az connectedk8s proxy` will fail to establish a session with the cluster.

```azurecli
az connectedk8s proxy -n AzureArcTest -g AzureArcTest
```

```output
Cannot connect to the hybrid connection because no agent is connected in the target arc resource.
```

To resolve this error, [enable the Cluster Connect feature](cluster-connect.md#enable-cluster-connect-feature) on your cluster.

## Enable custom locations using service principal

When you are connecting your cluster to Azure Arc or when you are enabling custom locations feature on an existing cluster, you may observe the following warning:

```console
Unable to fetch oid of 'custom-locations' app. Proceeding without enabling the feature. Insufficient privileges to complete the operation.
```

The above warning is observed when you have used a service principal to log into Azure. This is because a service principal doesn't have permissions to get information of the application used by Azure Arc service. To avoid this error, execute the following steps:

1. Login into Azure CLI using your user account. Fetch the Object ID of the Azure AD application used by Azure Arc service:

    ```azurecli
    az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query objectId -o tsv
    ```

1. Login into Azure CLI using the service principal. Use the `<objectId>` value from above step to enable custom locations feature on the cluster:
    - If you are enabling custom locations feature as part of connecting the cluster to Arc, run the following command:

        ```azurecli
        az connectedk8s connect -n <cluster-name> -g <resource-group-name> --custom-locations-oid <objectId>   
        ```

    - If you are enabling custom locations feature on an existing Azure Arc-enabled Kubernetes cluster, run the following command:

        ```azurecli
        az connectedk8s enable-features -n <cluster-name> -g <resource-group-name> --custom-locations-oid <objectId> --features cluster-connect custom-locations
        ```

## Azure Arc-enabled Open Service Mesh

The following troubleshooting steps provide guidance on validating the deployment of all the Open Service Mesh extension components on your cluster.

### Check OSM Controller **Deployment**
```bash
kubectl get deployment -n arc-osm-system --selector app=osm-controller
```

If the OSM Controller is healthy, you will get an output similar to the following output:
```
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
osm-controller   1/1     1            1           59m
```

### Check the OSM Controller **Pod**
```bash
kubectl get pods -n arc-osm-system --selector app=osm-controller
```

If the OSM Controller is healthy, you will get an output similar to the following output:
```
NAME                            READY   STATUS    RESTARTS   AGE
osm-controller-b5bd66db-wglzl   0/1     Evicted   0          61m
osm-controller-b5bd66db-wvl9w   1/1     Running   0          31m
```

Even though we had one controller _evicted_ at some point, we have another one which is `READY 1/1` and `Running` with `0` restarts.
If the column `READY` is anything other than `1/1` the service mesh would be in a broken state.
Column `READY` with `0/1` indicates the control plane container is crashing - we need to get logs. Use the following command to inspect controller logs:
```bash
kubectl logs -n arc-osm-system -l app=osm-controller
```
Column `READY` with a number higher than 1 after the `/` would indicate that there are sidecars installed. OSM Controller would most likely not work with any sidecars attached to it.

### Check OSM Controller **Service**
```bash
kubectl get service -n arc-osm-system osm-controller
```

If the OSM Controller is healthy, you will have the following output:
```
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)              AGE
osm-controller   ClusterIP   10.0.31.254   <none>        15128/TCP,9092/TCP   67m
```

> [!NOTE]
> The `CLUSTER-IP` would be different. The service `NAME` and `PORT(S)` must be the same as seen in the output.

### Check OSM Controller **Endpoints**
```bash
kubectl get endpoints -n arc-osm-system osm-controller
```

If the OSM Controller is healthy, you will get an output similar to the following output:
```
NAME             ENDPOINTS                              AGE
osm-controller   10.240.1.115:9092,10.240.1.115:15128   69m
```

If the user's cluster has no `ENDPOINTS` for `osm-controller` this would indicate that the control plane is unhealthy. This may be caused by the OSM Controller pod crashing, or never deployed correctly.

### Check OSM Injector **Deployment**
```bash
kubectl get deployments -n arc-osm-system osm-injector
```

If the OSM Injector is healthy, you will get an output similar to the following output:
```
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
osm-injector   1/1     1            1           73m
```

### Check OSM Injector **Pod**
```bash
kubectl get pod -n arc-osm-system --selector app=osm-injector
```

If the OSM Injector is healthy, you will get an output similar to the following output:
```
NAME                            READY   STATUS    RESTARTS   AGE
osm-injector-5986c57765-vlsdk   1/1     Running   0          73m
```

The `READY` column must be `1/1`. Any other value would indicate an unhealthy osm-injector pod.

### Check OSM Injector **Service**
```bash
kubectl get service -n arc-osm-system osm-injector
```

If the OSM Injector is healthy, you will get an output similar to the following output:
```
NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
osm-injector   ClusterIP   10.0.39.54   <none>        9090/TCP   75m
```

Ensure the IP address listed for `osm-injector` service is `9090`. There should be no `EXTERNAL-IP`.

### Check OSM Injector **Endpoints**
```bash
kubectl get endpoints -n arc-osm-system osm-injector
```

If the OSM Injector is healthy, you will get an output similar to the following output:
```
NAME           ENDPOINTS           AGE
osm-injector   10.240.1.172:9090   75m
```

For OSM to function, there must be at least one endpoint for `osm-injector`. The IP address of your OSM Injector endpoints will be different. The port `9090` must be the same.


### Check **Validating** and **Mutating** webhooks
```bash
kubectl get ValidatingWebhookConfiguration --selector app=osm-controller
```

If the Validating Webhook is healthy, you will get an output similar to the following output:
```
NAME                     WEBHOOKS   AGE
osm-validator-mesh-osm   1          81m
```

```bash
kubectl get MutatingWebhookConfiguration --selector app=osm-injector
```


If the Mutating Webhook is healthy, you will get an output similar to the following output:
```
NAME                  WEBHOOKS   AGE
arc-osm-webhook-osm   1          102m
```

Check for the service and the CA bundle of the **Validating** webhook
```bash
kubectl get ValidatingWebhookConfiguration osm-validator-mesh-osm -o json | jq '.webhooks[0].clientConfig.service'
```

A well configured Validating Webhook Configuration would have the following output:
```json
{
  "name": "osm-config-validator",
  "namespace": "arc-osm-system",
  "path": "/validate",
  "port": 9093
}
```

Check for the service and the CA bundle of the **Mutating** webhook
```bash
kubectl get MutatingWebhookConfiguration arc-osm-webhook-osm -o json | jq '.webhooks[0].clientConfig.service'
```

A well configured Mutating Webhook Configuration would have the following output:
```
{
  "name": "osm-injector",
  "namespace": "arc-osm-system",
  "path": "/mutate-pod-creation",
  "port": 9090
}
```


Check whether OSM Controller has given the Validating (or Mutating) Webhook a CA Bundle by using the following command:

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
The number in the output indicates the number of bytes, or the size of the CA Bundle. If this is empty, 0, or some number under a 1000, it would indicate that the CA Bundle is not correctly provisioned. Without a correct CA Bundle, the ValidatingWebhook would throw an error.

### Check the `osm-mesh-config` resource

Check for the existence:

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n arc-osm-system
```

Check the content of the OSM MeshConfig

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n arc-osm-system -o yaml
```

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

### Check Namespaces

>[!Note]
>The arc-osm-system namespace will never participate in a service mesh and will never be labeled and/or annotated with the key/values below.

We use the `osm namespace add` command to join namespaces to a given service mesh.
When a kubernetes namespace is part of the mesh, the following must be true:

View the annotations of the namespace `bookbuyer`:
```bash
kubectl get namespace bookbuyer -o json | jq '.metadata.annotations'
```

The following annotation must be present:
```
{
  "openservicemesh.io/sidecar-injection": "enabled"
}
```


View the labels of the namespace `bookbuyer`:
```bash
kubectl get namespace bookbuyer -o json | jq '.metadata.labels'
```

The following label must be present:
```
{
  "openservicemesh.io/monitored-by": "osm"
}
```
Note that if you are not using `osm` CLI, you could also manually add these annotations to your namespaces. If a namespace is not annotated with `"openservicemesh.io/sidecar-injection": "enabled"` or not labeled with `"openservicemesh.io/monitored-by": "osm"` the OSM Injector will not add Envoy sidecars.

>[!Note]
>After `osm namespace add` is called, only **new** pods will be injected with an Envoy sidecar. Existing pods must be restarted with `kubectl rollout restart deployment` command.


### Verify the SMI CRDs
Check whether the cluster has the required CRDs:
```bash
kubectl get crds
```

Ensure that the CRDs correspond to the versions available in the release branch. For example, if you are using OSM-Arc v1.0.0-1, navigate to the [SMI supported versions page](https://docs.openservicemesh.io/docs/overview/smi/) and select v1.0 from the Releases dropdown to check which CRDs versions are in use.

Get the versions of the CRDs installed with the following command:
```bash
for x in $(kubectl get crds --no-headers | awk '{print $1}' | grep 'smi-spec.io'); do
    kubectl get crd $x -o json | jq -r '(.metadata.name, "----" , .spec.versions[].name, "\n")'
done
```

If CRDs are missing, use the following commands to install them on the cluster. If you are using a version of OSM-Arc that is not v1.0, ensure that you replace the version in the command (ex: v1.1.0 would be release-v1.1).

```bash
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-v1.0/cmd/osm-bootstrap/crds/smi_http_route_group.yaml

kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-v1.0/cmd/osm-bootstrap/crds/smi_tcp_route.yaml

kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-v1.0/cmd/osm-bootstrap/crds/smi_traffic_access.yaml

kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-v1.0/cmd/osm-bootstrap/crds/smi_traffic_split.yaml
```

Refer to [OSM release notes](https://github.com/openservicemesh/osm/releases) to see CRD changes between releases.

### Troubleshoot certificate management
Information on how OSM issues and manages certificates to Envoy proxies running on application pods can be found on the [OSM docs site](https://docs.openservicemesh.io/docs/guides/certificates/).

### Upgrade Envoy
When a new pod is created in a namespace monitored by the add-on, OSM will inject an [Envoy proxy sidecar](https://docs.openservicemesh.io/docs/guides/app_onboarding/sidecar_injection/) in that pod. If the envoy version needs to be updated, steps to do so can be found in the [Upgrade Guide](https://docs.openservicemesh.io/docs/guides/upgrade/#envoy) on the OSM docs site.
