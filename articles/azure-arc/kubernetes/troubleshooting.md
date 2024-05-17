---
title: "Troubleshoot platform issues for Azure Arc-enabled Kubernetes clusters"
ms.date: 12/15/2023
ms.topic: how-to
ms.custom: devx-track-azurecli
description: "Learn how to resolve common issues with Azure Arc-enabled Kubernetes clusters and GitOps."
---

# Troubleshoot platform issues for Azure Arc-enabled Kubernetes clusters

This document provides troubleshooting guides for issues with Azure Arc-enabled Kubernetes connectivity, permissions, and agents. It also provides troubleshooting guides for Azure GitOps, which can be used in either Azure Arc-enabled Kubernetes or Azure Kubernetes Service (AKS) clusters.

For help troubleshooting issues related to extensions, such as GitOps (Flux v2), Azure Monitor Container Insights, Open Service Mesh, see [Troubleshoot extension issues for Azure Arc-enabled Kubernetes clusters](extensions-troubleshooting.md).

## Azure CLI

Before using `az connectedk8s` or `az k8s-configuration` CLI commands, ensure that Azure CLI is set to work against the correct Azure subscription.

```azurecli
az account set --subscription 'subscriptionId'
az account show
```

## Azure Arc agents

All agents for Azure Arc-enabled Kubernetes are deployed as pods in the `azure-arc` namespace. All pods should be running and passing their health checks.

First, verify the Azure Arc Helm Chart release:

```console
$ helm --namespace default status azure-arc
NAME: azure-arc
LAST DEPLOYED: Fri Apr  3 11:13:10 2020
NAMESPACE: default
STATUS: deployed
REVISION: 5
TEST SUITE: None
```

If the Helm Chart release isn't found or missing, try [connecting the cluster to Azure Arc](./quickstart-connect-cluster.md) again.

If the Helm Chart release is present with `STATUS: deployed`, check the status of the agents using `kubectl`:

```console
$ kubectl -n azure-arc get deployments,pods
NAME                                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/cluster-metadata-operator    1/1     1            1           3d19h
deployment.apps/clusterconnect-agent         1/1     1            1           3d19h
deployment.apps/clusteridentityoperator      1/1     1            1           3d19h
deployment.apps/config-agent                 1/1     1            1           3d19h
deployment.apps/controller-manager           1/1     1            1           3d19h
deployment.apps/extension-events-collector   1/1     1            1           3d19h
deployment.apps/extension-manager            1/1     1            1           3d19h
deployment.apps/flux-logs-agent              1/1     1            1           3d19h
deployment.apps/kube-aad-proxy               1/1     1            1           3d19h
deployment.apps/metrics-agent                1/1     1            1           3d19h
deployment.apps/resource-sync-agent          1/1     1            1           3d19h

NAME                                              READY   STATUS    RESTARTS        AGE
pod/cluster-metadata-operator-74747b975-9phtz     2/2     Running   0               3d19h
pod/clusterconnect-agent-cf4c7849c-88fmf          3/3     Running   0               3d19h
pod/clusteridentityoperator-79bdfd945f-pt2rv      2/2     Running   0               3d19h
pod/config-agent-67bcb94b7c-d67t8                 1/2     Running   0               3d19h
pod/controller-manager-559dd48b64-v6rmk           2/2     Running   0               3d19h
pod/extension-events-collector-85f4fbff69-55zmt   2/2     Running   0               3d19h
pod/extension-manager-7c7668446b-69gps            3/3     Running   0               3d19h
pod/flux-logs-agent-fc7c6c959-vgqvm               1/1     Running   0               3d19h
pod/kube-aad-proxy-84d668c44b-j457m               2/2     Running   0               3d19h
pod/metrics-agent-58fb8554df-5ll67                2/2     Running   0               3d19h
pod/resource-sync-agent-dbf5db848-c9lg8           2/2     Running   0               3d19h
```

All pods should show `STATUS` as `Running` with either `3/3` or `2/2` under the `READY` column. Fetch logs and describe the pods returning an `Error` or `CrashLoopBackOff`. If any pods are stuck in `Pending` state, there might be insufficient resources on cluster nodes. [Scaling up your cluster](https://kubernetes.io/docs/tasks/administer-cluster/) can get these pods to transition to `Running` state.

## Resource provisioning failed/Service timeout error

If you see these errors, check [Azure status](https://azure.status.microsoft/en-us/status) to see if there are any active events impacting the status of the Azure Arc-enabled Kubernetes service. If so, wait until the service event has been resolved, then try onboarding again after [deleting the existing connected cluster resource](quickstart-connect-cluster.md#clean-up-resources). If there are no service events, and you continue to face issues while onboarding, [open a support ticket](/azure/azure-portal/supportability/how-to-create-azure-support-request) so we can investigate the problem.

## Overage claims error

If you receive an overage claim, make sure that your service principal isn't part of more than 200 Microsoft Entra groups. If this is the case, you must create and use another service principal that isn't a member of more than 200 groups, or remove the original service principal from some of its groups and try again.

An overage claim may also occur if you have configured an outbound proxy environment without allowing the endpoint `https://<region>.obo.arc.azure.com:8084/` for outbound traffic.

If neither of these apply, [open a support request](/azure/azure-portal/supportability/how-to-create-azure-support-request) so we can look into the issue.

## Issues when connecting Kubernetes clusters to Azure Arc

Connecting clusters to Azure Arc requires access to an Azure subscription and `cluster-admin` access to a target cluster. If you can't reach the cluster, or if you have insufficient permissions, connecting the cluster to Azure Arc will fail. Make sure you've met all of the [prerequisites to connect a cluster](quickstart-connect-cluster.md#prerequisites).

> [!TIP]
> For a visual guide to troubleshooting connection issues, see [Diagnose connection issues for Arc-enabled Kubernetes clusters](diagnose-connection-issues.md).

### DNS resolution issues

Visit [Debugging DNS Resolution](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/) for help resolving issues with DNS resolution on your cluster.

### Outbound network connectivity issues

Issues with outbound network connectivity from the cluster may arise for different reasons. First make sure all of the [network requirements](network-requirements.md) have been met.

If you encounter connectivity issues, and your cluster is behind an outbound proxy server, make sure you've passed proxy parameters during the onboarding of your cluster and that the proxy is configured correctly. For more information, see [Connect using an outbound proxy server](quickstart-connect-cluster.md#connect-using-an-outbound-proxy-server).

You may see an error similar to the following:

`An exception has occurred while trying to execute the cluster diagnostic checks in the cluster. Exception: Unable to pull cluster-diagnostic-checks helm chart from the registry 'mcr.microsoft.com/azurearck8s/helmchart/stable/clusterdiagnosticchecks:0.1.2': Error: failed to do request: Head "https://mcr.microsoft.com/v2/azurearck8s/helmchart/stable/clusterdiagnosticchecks/manifests/0.1.2": dial tcp xx.xx.xx.219:443: i/o timeout`

This error occurs when the `https://k8connecthelm.azureedge.net` endpoint is blocked. Be sure that your network allows connectivity to this endpoint and meets all of the other [networking requirements](network-requirements.md).

### Unable to retrieve MSI certificate

Problems retrieving the MSI certificate are usually due to network issues. Check to make sure all of the [network requirements](network-requirements.md) have been met, then try again.

### Insufficient cluster permissions

If the provided kubeconfig file doesn't have sufficient permissions to install the Azure Arc agents, the Azure CLI command returns an error: `Error: list: failed to list: secrets is forbidden: User "myuser" cannot list resource "secrets" in API group "" at the cluster scope`

To resolve this issue, ensure that the user connecting the cluster to Azure Arc has the `cluster-admin` role assigned.

### Unable to connect OpenShift cluster to Azure Arc

If `az connectedk8s connect` is timing out and failing when connecting an OpenShift cluster to Azure Arc:

1. Ensure that the OpenShift cluster meets the version prerequisites: 4.5.41+ or 4.6.35+ or 4.7.18+.

1. Before you run `az connectedk8s connnect`, run this command on the cluster:

    ```console
    oc adm policy add-scc-to-user privileged system:serviceaccount:azure-arc:azure-arc-kube-aad-proxy-sa
    ```

### Installation timeouts

Connecting a Kubernetes cluster to Azure Arc-enabled Kubernetes requires installation of Azure Arc agents on the cluster. If the cluster is running over a slow internet connection, the container image pull for agents may take longer than the Azure CLI timeouts.

### Helm timeout error

You may see the error `Unable to install helm release: Error: UPGRADE Failed: time out waiting for the condition`. To resolve this issue, try the following steps:

1. Run the following command:

    ```console
    kubectl get pods -n azure-arc
    ```

2. Check if the `clusterconnect-agent` or the `config-agent` pods are showing `crashloopbackoff`, or if not all containers are running:

    ```output
    NAME                                        READY   STATUS             RESTARTS   AGE
    cluster-metadata-operator-664bc5f4d-chgkl   2/2     Running            0          4m14s
    clusterconnect-agent-7cb8b565c7-wklsh       2/3     CrashLoopBackOff   0          1m15s
    clusteridentityoperator-76d645d8bf-5qx5c    2/2     Running            0          4m15s
    config-agent-65d5df564f-lffqm               1/2     CrashLoopBackOff   0          1m14s
    ```

3. If the `azure-identity-certificate` isn't present, the system assigned managed identity hasn't been installed.

   ```console
   kubectl get secret -n azure-arc -o yaml | grep name:
   ```

   ```output
   name: azure-identity-certificate
   ```

   To resolve this issue, try deleting the Arc deployment by running the `az connectedk8s delete` command and reinstalling it. If the issue continues to happen, it could be an issue with your proxy settings. In that case, [try connecting your cluster to Azure Arc via a proxy](./quickstart-connect-cluster.md#connect-using-an-outbound-proxy-server) to connect your cluster to Arc via a proxy. Also verify that all of the [network prerequisites](network-requirements.md) have been met.

4. If the `clusterconnect-agent` and the `config-agent` pods are running, but the `kube-aad-proxy` pod is missing, check your pod security policies. This pod uses the `azure-arc-kube-aad-proxy-sa` service account, which doesn't have admin permissions but requires the permission to mount host path.

5. If the `kube-aad-proxy` pod is stuck in `ContainerCreating` state, check whether the kube-aad-proxy certificate has been downloaded onto the cluster.

   ```console
   kubectl get secret -n azure-arc -o yaml | grep name:
   ```

   ```output
   name: kube-aad-proxy-certificate
   ```

   If the certificate is missing, [delete the deployment](quickstart-connect-cluster.md#clean-up-resources) and try onboarding again, using a different name for the cluster. If the problem continues, [open a support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

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

## Cluster connect issues

If your cluster is behind an outbound proxy or firewall, verify that websocket connections are enabled for `*.servicebus.windows.net`, which is required specifically for the [Cluster Connect](cluster-connect.md) feature. Additionally, make sure you're using the latest version of the `connectedk8s` Azure CLI extension if you're experiencing problems using cluster connect.

If the `clusterconnect-agent` and `kube-aad-proxy` pods are missing, then the cluster connect feature is likely disabled on the cluster. If so, `az connectedk8s proxy` will fail to establish a session with the cluster, and you may see an error reading `Cannot connect to the hybrid connection because no agent is connected in the target arc resource.`

To resolve this error, enable the cluster connect feature on your cluster:

```azurecli
az connectedk8s enable-features --features cluster-connect -n $CLUSTER_NAME -g $RESOURCE_GROUP
```

For more information, see [Use cluster connect to securely connect to Azure Arc-enabled Kubernetes clusters](cluster-connect.md).

## Enable custom locations using service principal

When connecting your cluster to Azure Arc or enabling custom locations on an existing cluster, you may see the following warning:

```console
Unable to fetch oid of 'custom-locations' app. Proceeding without enabling the feature. Insufficient privileges to complete the operation.
```

This warning occurs when you use a service principal to log into Azure, and the service principal doesn't have the necessary permissions. To avoid this error, follow these steps:

1. Sign in into Azure CLI using your user account. Retrieve the Object ID of the Microsoft Entra application used by Azure Arc service:

    ```azurecli
    az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query objectId -o tsv
    ```

1. Sign in into Azure CLI using the service principal. Use the `<objectId>` value from the previous step to enable custom locations on the cluster:

   * To enable custom locations when connecting the cluster to Arc, run `az connectedk8s connect -n <cluster-name> -g <resource-group-name> --custom-locations-oid <objectId>`
   * To enable custom locations on an existing Azure Arc-enabled Kubernetes cluster, run `az connectedk8s enable-features -n <cluster-name> -g <resource-group-name> --custom-locations-oid <objectId> --features cluster-connect custom-locations`

## Next steps

* Get a visual walkthrough of [how to diagnose connection issues](diagnose-connection-issues.md).
* View [troubleshooting tips related to cluster extensions](extensions-troubleshooting.md).
