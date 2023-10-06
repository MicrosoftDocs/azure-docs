---
title: Disable Container insights on your hybrid Kubernetes cluster
description: This article describes how you can stop monitoring of your hybrid Kubernetes cluster with Container insights.
ms.topic: conceptual
ms.date: 08/21/2023
ms.reviewer: aul
---

# Disable Container insights on your hybrid Kubernetes cluster

This article shows how to disable Container insights for the following Kubernetes environments:

- AKS Engine on Azure and Azure Stack
- OpenShift version 4 and higher
- Azure Arc-enabled Kubernetes (preview)

## How to stop monitoring using Helm

The following steps apply to the following environments:

- AKS Engine on Azure and Azure Stack
- OpenShift version 4 and higher

1. To first identify the Container insights helm chart release installed on your cluster, run the following helm command.

    ```
    helm list
    ```

    The output resembles the following:

    ```
    NAME                            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
    azmon-containers-release-1      default         3               2020-04-21 15:27:24.1201959 -0700 PDT   deployed        azuremonitor-containers-2.7.0   7.0.0-1
    ```

    *azmon-containers-release-1* represents the helm chart release for Container insights.

2. To delete the chart release, run the following helm command.

    `helm delete <releaseName>`

    Example:

    `helm delete azmon-containers-release-1`

    This removes the release from the cluster. You can verify by running the `helm list` command:

    ```
    NAME                            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
    ```

The configuration change can take a few minutes to complete. Because Helm tracks your releases even after you’ve deleted them, you can audit a cluster’s history, and even undelete a release with `helm rollback`.

## How to stop monitoring on Azure Arc-enabled Kubernetes

### Using PowerShell

1. Download and save the script to a local folder that configures your cluster with the monitoring add-on using the following commands:

    ```powershell
    wget https://aka.ms/disable-monitoring-powershell-script -OutFile disable-monitoring.ps1
    ```

2. Configure the `$azureArcClusterResourceId` variable by setting the corresponding values for `subscriptionId`, `resourceGroupName` and `clusterName` representing the resource ID of your Azure Arc-enabled Kubernetes cluster resource.

    ```powershell
    $azureArcClusterResourceId = "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Kubernetes/connectedClusters/<clusterName>"
    ```

3. Configure the `$kubeContext` variable with the **kube-context** of your cluster by running the command `kubectl config get-contexts`. If you want to use the current context, set the value to `""`.

    ```powershell
    $kubeContext = "<kubeContext name of your k8s cluster>"
    ```

4. Run the following command to stop monitoring the cluster.

    ```powershell
    .\disable-monitoring.ps1 -clusterResourceId $azureArcClusterResourceId -kubeContext $kubeContext
    ```

#### Using service principal
The script *disable-monitoring.ps1* uses the interactive device login. If you prefer non-interactive login, you can use an existing service principal or create a new one that has the required permissions as described in [Prerequisites](container-insights-enable-arc-enabled-clusters.md#prerequisites). To use service principal, you have to pass $servicePrincipalClientId, $servicePrincipalClientSecret and $tenantId parameters with values of service principal you have intended to use to enable-monitoring.ps1 script.

```powershell
$subscriptionId = "<subscription Id of the Azure Arc-connected cluster resource>"
$servicePrincipal = New-AzADServicePrincipal -Role Contributor -Scope "/subscriptions/$subscriptionId"

$servicePrincipalClientId =  $servicePrincipal.ApplicationId.ToString()
$servicePrincipalClientSecret = [System.Net.NetworkCredential]::new("", $servicePrincipal.Secret).Password
$tenantId = (Get-AzSubscription -SubscriptionId $subscriptionId).TenantId
```

For example:

```powershell
\disable-monitoring.ps1 -clusterResourceId $azureArcClusterResourceId -kubeContext $kubeContext -servicePrincipalClientId $servicePrincipalClientId -servicePrincipalClientSecret $servicePrincipalClientSecret -tenantId $tenantId
```


### Using bash

1. Download and save the script to a local folder that configures your cluster with the monitoring add-on using the following commands:

    ```bash
    curl -o disable-monitoring.sh -L https://aka.ms/disable-monitoring-bash-script
    ```

2. Configure the `azureArcClusterResourceId` variable by setting the corresponding values for `subscriptionId`, `resourceGroupName` and `clusterName` representing the resource ID of your Azure Arc-enabled Kubernetes cluster resource.

    ```bash
    export AZUREARCCLUSTERRESOURCEID="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Kubernetes/connectedClusters/<clusterName>"
    ```

3. Configure the `kubeContext` variable with the **kube-context** of your cluster by running the command `kubectl config get-contexts`.

    ```bash
    export KUBECONTEXT="<kubeContext name of your k8s cluster>"
    ```

4. To stop monitoring your cluster, there are different commands provided based on your deployment scenario.

    Run the following command to stop monitoring the cluster using the current context.

    ```bash
    bash disable-monitoring.sh --resource-id $AZUREARCCLUSTERRESOURCEID
    ```

    Run the following command to stop monitoring the cluster by specifying a context

    ```bash
    bash disable-monitoring.sh --resource-id $AZUREARCCLUSTERRESOURCEID --kube-context $KUBECONTEXT
    ```

#### Using service principal
The bash script *disable-monitoring.sh* uses the interactive device login. If you prefer non-interactive login, you can use an existing service principal or create a new one that has the required permissions as described in [Prerequisites](container-insights-enable-arc-enabled-clusters.md#prerequisites). To use service principal, you have to pass --client-id, --client-secret and  --tenant-id values of service principal you have intended to use to *enable-monitoring.sh* bash script.

```bash
SUBSCRIPTIONID="<subscription Id of the Azure Arc-connected cluster resource>"
SERVICEPRINCIPAL=$(az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/${SUBSCRIPTIONID}")
SERVICEPRINCIPALCLIENTID=$(echo $SERVICEPRINCIPAL | jq -r '.appId')

SERVICEPRINCIPALCLIENTSECRET=$(echo $SERVICEPRINCIPAL | jq -r '.password')
TENANTID=$(echo $SERVICEPRINCIPAL | jq -r '.tenant')
```

For example:

```bash
bash disable-monitoring.sh --resource-id $AZUREARCCLUSTERRESOURCEID --kube-context $KUBECONTEXT --client-id $SERVICEPRINCIPALCLIENTID --client-secret $SERVICEPRINCIPALCLIENTSECRET  --tenant-id $TENANTID
```

## Next steps

If the Log Analytics workspace was created only to support monitoring the cluster and it's no longer needed, you have to manually delete it. If you are not familiar with how to delete a workspace, see [Delete an Azure Log Analytics workspace](../logs/delete-workspace.md).