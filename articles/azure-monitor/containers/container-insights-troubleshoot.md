---
title: How to Troubleshoot Container insights | Microsoft Docs
description: This article describes how you can troubleshoot and resolve issues with Container insights.
ms.topic: conceptual
ms.date: 05/24/2022
ms.reviewer: aul

---

# Troubleshooting Container insights

When you configure monitoring of your Azure Kubernetes Service (AKS) cluster with Container insights, you may encounter an issue preventing data collection or reporting status. This article details some common issues and troubleshooting steps.

## Known error messages

The table below summarizes known errors you may encounter while using Container insights.

| Error messages  | Action |
| ---- | --- |
| Error Message `No data for selected filters`  | It may take some time to establish monitoring data flow for newly created clusters. Allow at least 10 to 15 minutes for data to appear for your cluster.<br><br>If data still doesn't show up, check if the configured log analytics workspace is configured for *disableLocalAuth = true*, if  yes, update back to *disableLocalAuth = false*.<br><br>`az resource show  --ids "/subscriptions/[Your subscription ID]/resourcegroups/[Your resource group]/providers/microsoft.operationalinsights/workspaces/[Your workspace name]"`<br><br>`az resource update --ids "/subscriptions/[Your subscription ID]/resourcegroups/[Your resource group]/providers/microsoft.operationalinsights/workspaces/[Your workspace name]" --api-version "2021-06-01" --set properties.features.disableLocalAuth=False` |
| Error Message `Error retrieving data` | While Azure Kubernetes Service cluster is setting up for health and performance monitoring, a connection is established between the cluster and Azure Log Analytics workspace. A Log Analytics workspace is used to store all monitoring data for your cluster. This error may occur when your Log Analytics workspace has been deleted. Check if the workspace was deleted. If it was, you'll need to re-enable monitoring of your cluster with Container insights and either specify an existing workspace or create a new one. To re-enable, you'll need to [disable](container-insights-optout.md) monitoring for the cluster and [enable](container-insights-enable-new-cluster.md) Container insights again. |
| `Error retrieving data` after adding Container insights through az aks cli | When enable monitoring using `az aks cli`, Container insights may not be properly deployed. Check whether the solution is deployed. To verify, go to your Log Analytics workspace and see if the solution is available by selecting **Solutions** from the pane on the left-hand side. To resolve this issue, you'll need to redeploy the solution by following the instructions on [how to deploy Container insights](container-insights-onboard.md) |

To help diagnose the problem, we've provided a [troubleshooting script](https://github.com/microsoft/Docker-Provider/tree/ci_dev/scripts/troubleshoot).

## Authorization error during onboarding or update operation

While enabling Container insights or updating a cluster to support collecting metrics, you may receive an error resembling the following - *The client <user’s Identity>' with object id '<user’s objectId>' does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope*

During the onboarding or update process, granting the **Monitoring Metrics Publisher** role assignment is attempted on the cluster resource. The user initiating the process to enable Container insights or the update to support the collection of metrics must have access to the **Microsoft.Authorization/roleAssignments/write** permission on the AKS cluster resource scope. Only members of the **Owner** and **User Access Administrator** built-in roles are granted access to this permission. If your security policies require assigning granular level permissions, we recommend you view [custom roles](../../role-based-access-control/custom-roles.md) and assign it to the users who require it.

You can also manually grant this role from the Azure portal by performing the following steps:

1. Assign the **Publisher** role to the **Monitoring Metrics** scope.

    For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md). 

## Container insights is enabled but not reporting any information
Use the following steps to  diagnose the problem if you can't view status information or no results are returned from a log query:

1. Check the status of the agent by running the command:

    `kubectl get ds ama-logs --namespace=kube-system`

    The output should resemble the following example, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get ds ama-logs --namespace=kube-system
    NAME       DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
    ama-logs   2         2         2         2            2           beta.kubernetes.io/os=linux   1d
    ```
2. If you have Windows Server nodes, then check the status of the agent by running the command:

    `kubectl get ds omsagent-win --namespace=kube-system`

    The output should resemble the following example, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get ds ama-logs-windows --namespace=kube-system
    NAME                   DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                   AGE
    ama-logs-windows           2         2         2         2            2           beta.kubernetes.io/os=windows   1d
    ```
3. Check the deployment status with agent version *06072018* or later using the command:

    `kubectl get deployment ama-logs-rs -n=kube-system`

    The output should resemble the following example, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get deployment omsagent-rs -n=kube-system
    NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE    AGE
    ama-logs   1         1         1            1            3h
    ```

4. Check the status of the pod to verify that it's running using the command: `kubectl get pods --namespace=kube-system`

    The output should resemble the following example with a status of *Running* for the omsagent:

    ```
    User@aksuser:~$ kubectl get pods --namespace=kube-system
    NAME                                READY     STATUS    RESTARTS   AGE
    aks-ssh-139866255-5n7k5             1/1       Running   0          8d
    azure-vote-back-4149398501-7skz0    1/1       Running   0          22d
    azure-vote-front-3826909965-30n62   1/1       Running   0          22d
    ama-logs-484hw                      1/1       Running   0          1d
    ama-logs-fkq7g                      1/1       Running   0          1d
    ama-logs-windows-6drwq                  1/1       Running   0          1d
    ```

## Container insights agent ReplicaSet Pods aren't scheduled on non-Azure Kubernetes cluster

Container insights agent ReplicaSet Pods has a dependency on the following node selectors on the worker (or agent) nodes for the scheduling:

```
nodeSelector:
  beta.kubernetes.io/os: Linux
  kubernetes.io/role: agent
```

If your worker nodes don’t have node labels attached, then agent ReplicaSet Pods will not get scheduled. Refer to [Kubernetes assign label selectors](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/) for instructions on how to attach the label.

## Performance charts don't show CPU or memory of nodes and containers on a non-Azure cluster

Container insights agent pods use the cAdvisor endpoint on the node agent to gather the performance metrics. Verify the containerized agent on the node is configured to allow `cAdvisor port: 10255` to be opened on all nodes in the cluster to collect performance metrics.

## Non-Azure Kubernetes cluster aren't showing in Container insights

To view the non-Azure Kubernetes cluster in Container insights, Read access is required on the Log Analytics workspace supporting this Insight and on the Container Insights solution resource **ContainerInsights (*workspace*)**.

## Metrics aren't being collected

1. Verify that the cluster is in a [supported region for custom metrics](../essentials/metrics-custom-overview.md#supported-regions).

2. Verify that the **Monitoring Metrics Publisher** role assignment exists using the following CLI command:

    ``` azurecli
    az role assignment list --assignee "SP/UserassignedMSI for Azure Monitor Agent" --scope "/subscriptions/<subid>/resourcegroups/<RG>/providers/Microsoft.ContainerService/managedClusters/<clustername>" --role "Monitoring Metrics Publisher"
    ```
    For clusters with MSI, the user assigned client ID for Azure Monitor Agent changes every time monitoring is enabled and disabled, so the role assignment should exist on the current msi client ID. 

3. For clusters with Azure Active Directory pod identity enabled and using MSI:

   - Verify the required label **kubernetes.azure.com/managedby: aks**  is present on the Azure Monitor Agent pods using the following command:

        `kubectl get pods --show-labels -n kube-system | grep ama-logs`

    - Verify that exceptions are enabled when pod identity is enabled using one of the supported methods at https://github.com/Azure/aad-pod-identity#1-deploy-aad-pod-identity.

        Run the following command to verify:

        `kubectl get AzurePodIdentityException -A -o yaml`

        You should receive output similar to the following:

        ```
        apiVersion: "aadpodidentity.k8s.io/v1"
        kind: AzurePodIdentityException
        metadata:
        name: mic-exception
        namespace: default
        spec:
        podLabels:
        app: mic
        component: mic
        ---
        apiVersion: "aadpodidentity.k8s.io/v1"
        kind: AzurePodIdentityException
        metadata:
        name: aks-addon-exception
        namespace: kube-system
        spec:
        podLabels:
        kubernetes.azure.com/managedby: aks
        ```

## Installation of Azure Monitor Containers Extension fail with an error containing “manifests contain a resource that already exists” on Azure Arc Enabled Kubernetes cluster
The error _manifests contain a resource that already exists_ indicates that resources of the Container Insights agent already exist on the Azure Arc Enabled Kubernetes cluster. This indicates that the container insights agent is already installed, either through azuremonitor-containers HELM chart or Monitoring Addon if it's AKS Cluster that's connected Azure Arc. The solution to this issue is to clean up the existing resources of container insights agent if it exists. Then enable Azure Monitor Containers Extension.

### For non-AKS clusters 
1.	Against the K8s cluster that's connected to Azure Arc,  run below command to verify whether the azmon-containers-release-1  helm chart release exists or not:

    `helm list  -A`

2.	If the output of the above command indicates that azmon-containers-release-1  exists, delete the helm chart release:

    `helm del azmon-containers-release-1`

### For AKS clusters
1.	Run the following commands and look for Azure Monitor Agent addon profile to verify whether the AKS monitoring addon is enabled:

    ```
    az  account set -s <clusterSubscriptionId>
    az aks show -g <clusterResourceGroup> -n <clusterName>
    ```

2.	If the output includes an Azure Monitor Agent addon profile config with a log analytics workspace resource ID, this indicates that AKS Monitoring addon is enabled and needs to be disabled:

    `az aks disable-addons -a monitoring -g <clusterResourceGroup> -n <clusterName>`

If above steps didn’t resolve the installation of Azure Monitor Containers Extension issues, create a ticket to Microsoft for further investigation.


## Next steps

With monitoring enabled to capture health metrics for both the AKS cluster nodes and pods, these health metrics are available in the Azure portal. To learn how to use Container insights, see [View Azure Kubernetes Service health](container-insights-analyze.md).
