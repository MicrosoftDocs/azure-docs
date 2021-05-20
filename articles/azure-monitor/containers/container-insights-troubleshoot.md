---
title: How to Troubleshoot Container insights | Microsoft Docs
description: This article describes how you can troubleshoot and resolve issues with Container insights.
ms.topic: conceptual
ms.date: 03/25/2021

---

# Troubleshooting Container insights

When you configure monitoring of your Azure Kubernetes Service (AKS) cluster with Container insights, you may encounter an issue preventing data collection or reporting status. This article details some common issues and troubleshooting steps.

## Authorization error during onboarding or update operation

While enabling Container insights or updating a cluster to support collecting metrics, you may receive an error resembling the following - *The client <user’s Identity>' with object id '<user’s objectId>' does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope*

During the onboarding or update process, granting the **Monitoring Metrics Publisher** role assignment is attempted on the cluster resource. The user initiating the process to enable Container insights or the update to support the collection of metrics must have access to the **Microsoft.Authorization/roleAssignments/write** permission on the AKS cluster resource scope. Only members of the **Owner** and **User Access Administrator** built-in roles are granted access to this permission. If your security policies require assigning granular level permissions, we recommend you view [custom roles](../../role-based-access-control/custom-roles.md) and assign it to the users who require it.

You can also manually grant this role from the Azure portal by performing the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the Azure portal, click **All services** found in the upper left-hand corner. In the list of resources, type **Kubernetes**. As you begin typing, the list filters based on your input. Select **Azure Kubernetes**.
3. In the list of Kubernetes clusters, select one from the list.
2. From the left-hand menu, click **Access control (IAM)**.
3. Select **+ Add** to add a role assignment and select the **Monitoring Metrics Publisher** role and under the **Select** box type **AKS** to filter the results on just the clusters service principals defined in the subscription. Select the one from the list that is specific to that cluster.
4. Select **Save** to finish assigning the role.

## Container insights is enabled but not reporting any information

If Container insights is successfully enabled and configured, but you cannot view status information or no results are returned from a log query, you diagnose the problem by following these steps:

1. Check the status of the agent by running the command:

    `kubectl get ds omsagent --namespace=kube-system`

    The output should resemble the following example, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get ds omsagent --namespace=kube-system
    NAME       DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
    omsagent   2         2         2         2            2           beta.kubernetes.io/os=linux   1d
    ```
2. If you have Windows Server nodes, then check the status of the agent by running the command:

    `kubectl get ds omsagent-win --namespace=kube-system`

    The output should resemble the following example, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get ds omsagent-win --namespace=kube-system
    NAME                   DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                   AGE
    omsagent-win           2         2         2         2            2           beta.kubernetes.io/os=windows   1d
    ```
3. Check the deployment status with agent version *06072018* or later using the command:

    `kubectl get deployment omsagent-rs -n=kube-system`

    The output should resemble the following example, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get deployment omsagent-rs -n=kube-system
    NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE    AGE
    omsagent   1         1         1            1            3h
    ```

4. Check the status of the pod to verify that it is running using the command: `kubectl get pods --namespace=kube-system`

    The output should resemble the following example with a status of *Running* for the omsagent:

    ```
    User@aksuser:~$ kubectl get pods --namespace=kube-system
    NAME                                READY     STATUS    RESTARTS   AGE
    aks-ssh-139866255-5n7k5             1/1       Running   0          8d
    azure-vote-back-4149398501-7skz0    1/1       Running   0          22d
    azure-vote-front-3826909965-30n62   1/1       Running   0          22d
    omsagent-484hw                      1/1       Running   0          1d
    omsagent-fkq7g                      1/1       Running   0          1d
    omsagent-win-6drwq                  1/1       Running   0          1d
    ```

## Error messages

The table below summarizes known errors you may encounter while using Container insights.

| Error messages  | Action |
| ---- | --- |
| Error Message `No data for selected filters`  | It may take some time to establish monitoring data flow for newly created clusters. Allow at least 10 to 15 minutes for data to appear for your cluster. |
| Error Message `Error retrieving data` | While Azure Kubernetes Service cluster is setting up for health and performance monitoring, a connection is established between the cluster and Azure Log Analytics workspace. A Log Analytics workspace is used to store all monitoring data for your cluster. This error may occur when your Log Analytics workspace has been deleted. Check if the workspace was deleted and if it was, you will need to re-enable monitoring of your cluster with Container insights and specify an existing or create a new workspace. To re-enable, you will need to [disable](container-insights-optout.md) monitoring for the cluster and [enable](container-insights-enable-new-cluster.md) Container insights again. |
| `Error retrieving data` after adding Container insights through az aks cli | When enable monitoring using `az aks cli`, Container insights may not be properly deployed. Check whether the solution is deployed. To verify, go to your Log Analytics workspace and see if the solution is available by selecting **Solutions** from the pane on the left-hand side. To resolve this issue, you will need to redeploy the solution by following the instructions on [how to deploy Container insights](container-insights-onboard.md) |

To help diagnose the problem, we have provided a [troubleshooting script](https://github.com/microsoft/Docker-Provider/tree/ci_dev/scripts/troubleshoot).

## Container insights agent ReplicaSet Pods are not scheduled on non-Azure Kubernetes cluster

Container insights agent ReplicaSet Pods has a dependency on the following node selectors on the worker (or agent) nodes for the scheduling:

```
nodeSelector:
  beta.kubernetes.io/os: Linux
  kubernetes.io/role: agent
```

If your worker nodes don’t have node labels attached, then agent ReplicaSet Pods will not get scheduled. Refer to [Kubernetes assign label selectors](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/) for instructions on how to attach the label.

## Performance charts don't show CPU or memory of nodes and containers on a non-Azure cluster

Container insights agent Pods uses the cAdvisor endpoint on the node agent to gather the performance metrics. Verify the containerized agent on the node is configured to allow `cAdvisor port: 10255` to be opened on all nodes in the cluster to collect performance metrics.

## Non-Azure Kubernetes cluster are not showing in Container insights

To view the non-Azure Kubernetes cluster in Container insights, Read access is required on the Log Analytics workspace supporting this Insight and on the Container Insights solution resource **ContainerInsights (*workspace*)**.

## Metrics aren't being collected

1. Verify that the cluster is in a [supported region for custom metrics](../essentials/metrics-custom-overview.md#supported-regions).

2. Verify that the **Monitoring Metrics Publisher** role assignment exists using the following CLI command:

    ``` azurecli
    az role assignment list --assignee "SP/UserassignedMSI for omsagent" --scope "/subscriptions/<subid>/resourcegroups/<RG>/providers/Microsoft.ContainerService/managedClusters/<clustername>" --role "Monitoring Metrics Publisher"
    ```
    For clusters with MSI, the user assigned client id for omsagent changes every time monitoring is enabled and disabled, so the role assignment should exist on the current msi client id. 

3. For clusters with Azure Active Directory pod identity enabled and using MSI:

   - Verify the required label **kubernetes.azure.com/managedby: aks**  is present on the omsagent pods using the following command:

        `kubectl get pods --show-labels -n kube-system | grep omsagent`

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



## Next steps

With monitoring enabled to capture health metrics for both the AKS cluster nodes and pods, these health metrics are available in the Azure portal. To learn how to use Container insights, see [View Azure Kubernetes Service health](container-insights-analyze.md).
