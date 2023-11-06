---
title: Troubleshoot Container insights | Microsoft Docs
description: This article describes how you can troubleshoot and resolve issues with Container insights.
ms.topic: conceptual
ms.date: 05/24/2022
ms.reviewer: aul

---

# Troubleshoot Container insights

When you configure monitoring of your Azure Kubernetes Service (AKS) cluster with Container insights, you might encounter an issue that prevents data collection or reporting status. This article discusses some common issues and troubleshooting steps.

## Known error messages

The following table summarizes known errors you might encounter when you use Container insights.

| Error messages  | Action |
| ---- | --- |
| Error message "No data for selected filters"  | It might take some time to establish monitoring data flow for newly created clusters. Allow at least 10 to 15 minutes for data to appear for your cluster.<br><br>If data still doesn't show up, check if the Log Analytics workspace is configured for `disableLocalAuth = true`. If yes, update back to `disableLocalAuth = false`.<br><br>`az resource show  --ids "/subscriptions/[Your subscription ID]/resourcegroups/[Your resource group]/providers/microsoft.operationalinsights/workspaces/[Your workspace name]"`<br><br>`az resource update --ids "/subscriptions/[Your subscription ID]/resourcegroups/[Your resource group]/providers/microsoft.operationalinsights/workspaces/[Your workspace name]" --api-version "2021-06-01" --set properties.features.disableLocalAuth=False` |
| Error message "Error retrieving data" | While an AKS cluster is setting up for health and performance monitoring, a connection is established between the cluster and a Log Analytics workspace. A Log Analytics workspace is used to store all monitoring data for your cluster. This error might occur when your Log Analytics workspace has been deleted. Check if the workspace was deleted. If it was, reenable monitoring of your cluster with Container insights. Then specify an existing workspace or create a new one. To reenable, [disable](container-insights-optout.md) monitoring for the cluster and [enable](container-insights-enable-new-cluster.md) Container insights again. |
| "Error retrieving data" after adding Container insights through `az aks cli` | When you enable monitoring by using `az aks cli`, Container insights might not be properly deployed. Check whether the solution is deployed. To verify, go to your Log Analytics workspace and see if the solution is available by selecting **Legacy solutions** from the pane on the left side. To resolve this issue, redeploy the solution.  Follow the instructions in [Enable Container insights](container-insights-onboard.md). |
| Error message "Missing Subscription registration" | If you receive the error "Missing Subscription registration for Microsoft.OperationsManagement," you can resolve it by registering the resource provider **Microsoft.OperationsManagement** in the subscription where the workspace is defined. For the steps, see [Resolve errors for resource provider registration](../../azure-resource-manager/templates/error-register-resource-provider.md). |
| Error message "The reply url specified in the request doesn't match the reply urls configured for the application: '<application ID\>'." | You might see this error message when you enable live logs. For the solution, see [View container data in real time with Container insights](./container-insights-livedata-setup.md#configure-azure-ad-integrated-authentication). |

To help diagnose the problem, we've provided a [troubleshooting script](https://github.com/microsoft/Docker-Provider/tree/ci_prod/scripts/troubleshoot).


## Authorization error during onboarding or update operation

When you enable Container insights or update a cluster to support collecting metrics, you might receive an error like "The client `<user's Identity>` with object id `<user's objectId>` does not have authorization to perform action `Microsoft.Authorization/roleAssignments/write` over scope."

During the onboarding or update process, granting the **Monitoring Metrics Publisher** role assignment is attempted on the cluster resource. The user initiating the process to enable Container insights or the update to support the collection of metrics must have access to the **Microsoft.Authorization/roleAssignments/write** permission on the AKS cluster resource scope. Only members of the Owner and User Access Administrator built-in roles are granted access to this permission. If your security policies require you to assign granular-level permissions, see [Azure custom roles](../../role-based-access-control/custom-roles.md) and assign permission to the users who require it.

You can also manually grant this role from the Azure portal: Assign the **Publisher** role to the **Monitoring Metrics** scope. For detailed steps, see [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Container insights is enabled but not reporting any information
To diagnose the problem if you can't view status information or no results are returned from a log query:

1. Check the status of the agent by running the following command:

    `kubectl get ds ama-logs --namespace=kube-system`

    The output should resemble the following example, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get ds ama-logs --namespace=kube-system
    NAME       DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
    ama-logs   2         2         2         2            2           beta.kubernetes.io/os=linux   1d
    ```

1. If you have Windows Server nodes, check the status of the agent by running the following command:

    `kubectl get ds omsagent-win --namespace=kube-system`

    The output should resemble the following example, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get ds ama-logs-windows --namespace=kube-system
    NAME                   DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                   AGE
    ama-logs-windows           2         2         2         2            2           beta.kubernetes.io/os=windows   1d
    ```

1. Check the deployment status with agent version **06072018** or later by using the following command:

    `kubectl get deployment ama-logs-rs -n=kube-system`

    The output should resemble the following example, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get deployment omsagent-rs -n=kube-system
    NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE    AGE
    ama-logs   1         1         1            1            3h
    ```

1. Check the status of the pod to verify that it's running by using the command `kubectl get pods --namespace=kube-system`.

    The output should resemble the following example with a status of `Running` for the omsagent:

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

## Container insights agent ReplicaSet Pods aren't scheduled on a non-AKS cluster

Container insights agent ReplicaSet Pods have a dependency on the following node selectors on the worker (or agent) nodes for the scheduling:

```
nodeSelector:
  beta.kubernetes.io/os: Linux
  kubernetes.io/role: agent
```

If your worker nodes don’t have node labels attached, agent ReplicaSet Pods won't get scheduled. For instructions on how to attach the label, see [Kubernetes assign label selectors](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/).

## Performance charts don't show CPU or memory of nodes and containers on a non-Azure cluster

Container insights agent pods use the cAdvisor endpoint on the node agent to gather the performance metrics. Verify the containerized agent on the node is configured to allow `cAdvisor port: 10255` to be opened on all nodes in the cluster to collect performance metrics.

## Non-AKS clusters aren't showing in Container insights

To view the non-AKS cluster in Container insights, read access is required on the Log Analytics workspace that supports this insight and on the Container insights solution resource **ContainerInsights (*workspace*)**.

## Metrics aren't being collected

1. Verify that the cluster is in a [supported region for custom metrics](../essentials/metrics-custom-overview.md#supported-regions).

1. Verify that the **Monitoring Metrics Publisher** role assignment exists by using the following CLI command:

    ``` azurecli
    az role assignment list --assignee "SP/UserassignedMSI for Azure Monitor Agent" --scope "/subscriptions/<subid>/resourcegroups/<RG>/providers/Microsoft.ContainerService/managedClusters/<clustername>" --role "Monitoring Metrics Publisher"
    ```
    For clusters with MSI, the user-assigned client ID for Azure Monitor Agent changes every time monitoring is enabled and disabled, so the role assignment should exist on the current MSI client ID.

1. For clusters with Microsoft Entra pod identity enabled and using MSI:

   - Verify that the required label **kubernetes.azure.com/managedby: aks** is present on the Azure Monitor Agent pods by using the following command:

        `kubectl get pods --show-labels -n kube-system | grep ama-logs`

    - Verify that exceptions are enabled when pod identity is enabled by using one of the supported methods at https://github.com/Azure/aad-pod-identity#1-deploy-aad-pod-identity.

        Run the following command to verify:

        `kubectl get AzurePodIdentityException -A -o yaml`

        You should receive output similar to the following example:

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

## Installation of Azure Monitor Containers Extension fails on an Azure Arc-enabled Kubernetes cluster
The error "manifests contain a resource that already exists" indicates that resources of the Container insights agent already exist on the Azure Arc-enabled Kubernetes cluster. This error indicates that the Container insights agent is already installed. It's installed either through an azuremonitor-containers Helm chart or the Monitoring Add-on if it's an AKS cluster that's connected via Azure Arc. 

The solution to this issue is to clean up the existing resources of the Container insights agent if it exists. Then enable the Azure Monitor Containers Extension.

### For non-AKS clusters
1. Against the K8s cluster that's connected to Azure Arc, run the following command to verify whether the `azmon-containers-release-1` Helm chart release exists or not:

    `helm list  -A`

1. If the output of the preceding command indicates that the `azmon-containers-release-1` exists, delete the Helm chart release:

    `helm del azmon-containers-release-1`

### For AKS clusters
1. Run the following commands and look for the Azure Monitor Agent add-on profile to verify whether the AKS Monitoring Add-on is enabled:

    ```
    az  account set -s <clusterSubscriptionId>
    az aks show -g <clusterResourceGroup> -n <clusterName>
    ```

1. If the output includes an Azure Monitor Agent add-on profile config with a Log Analytics workspace resource ID, this information indicates that the AKS Monitoring Add-on is enabled and must be disabled:

    `az aks disable-addons -a monitoring -g <clusterResourceGroup> -n <clusterName>`

If the preceding steps didn't resolve the installation of Azure Monitor Containers Extension issues, create a support ticket to send to Microsoft for further investigation.

## Duplicate alerts being received
You might have enabled Prometheus alert rules without disabling Container insights recommended alerts. See [Migrate from Container insights recommended alerts to Prometheus recommended alert rules (preview)](container-insights-metric-alerts.md#migrate-from-metric-rules-to-prometheus-rules-preview).

 ## I see info banner "You do not have the right cluster permissions which will restrict your access to Container Insights features. Please reach out to your cluster admin to get the right permission"

Container Insights has historically allowed users to access the Azure portal experience based on the access permission of the Log Analytics workspace. It now checks cluster-level permission to provide access to the Azure portal experience. You might need your cluster admin to assign this permission.

For basic read-only cluster level access, assign the **Monitoring Reader** role for the following types of clusters.

- AKS without Kubernetes role-based access control (RBAC) authorization enabled
- AKS enabled with Microsoft Entra SAML-based single sign-on
- AKS enabled with Kubernetes RBAC authorization
- AKS configured with the cluster role binding clusterMonitoringUser
- [Azure Arc-enabled Kubernetes clusters](../../azure-arc/kubernetes/overview.md)

See [Assign role permissions to a user or group](../../aks/control-kubeconfig-access.md#assign-role-permissions-to-a-user-or-group) for details on how to assign these roles for AKS and [Access and identity options for Azure Kubernetes Service (AKS)](../../aks/concepts-identity.md) to learn more about role assignments.

## I don't see Image and Name property values populated when I query the ContainerLog table

For agent version ciprod12042019 and later, by default these two properties aren't populated for every log line to minimize cost incurred on log data collected. There are two options to query the table that include these properties with their values:

### Option 1

Join other tables to include these property values in the results.

Modify your queries to include `Image` and `ImageTag` properties from the `ContainerInventory` table by joining on `ContainerID` property. You can include the `Name` property (as it previously appeared in the `ContainerLog` table) from the `KubepodInventory` table's `ContainerName` field by joining on the `ContainerID` property. We recommend this option.
          
The following example is a sample detailed query that explains how to get these field values with joins.

```
//Let's say we're querying an hour's worth of logs
let startTime = ago(1h);
let endTime = now();
//Below gets the latest Image & ImageTag for every containerID, during the time window
let ContainerInv = ContainerInventory | where TimeGenerated >= startTime and TimeGenerated < endTime | summarize arg_max(TimeGenerated, *)  by ContainerID, Image, ImageTag | project-away TimeGenerated | project ContainerID1=ContainerID, Image1=Image ,ImageTag1=ImageTag;
//Below gets the latest Name for every containerID, during the time window
let KubePodInv  = KubePodInventory | where ContainerID != "" | where TimeGenerated >= startTime | where TimeGenerated < endTime | summarize arg_max(TimeGenerated, *)  by ContainerID2 = ContainerID, Name1=ContainerName | project ContainerID2 , Name1;
//Now join the above 2 to get a 'jointed table' that has name, image & imagetag. Outer left is safer in case there are no kubepod records or if they're latent
let ContainerData = ContainerInv | join kind=leftouter (KubePodInv) on $left.ContainerID1 == $right.ContainerID2;
//Now join ContainerLog table with the 'jointed table' above and project-away redundant fields/columns and rename columns that were rewritten
//Outer left is safer so you don't lose logs even if we can't find container metadata for loglines (due to latency, time skew between data types, etc.)
ContainerLog
| where TimeGenerated >= startTime and TimeGenerated < endTime
| join kind= leftouter (
  ContainerData
) on $left.ContainerID == $right.ContainerID2 | project-away ContainerID1, ContainerID2, Name, Image, ImageTag | project-rename Name = Name1, Image=Image1, ImageTag=ImageTag1
```

### Option 2

Reenable collection for these properties for every container log line.

If the first option isn't convenient because of query changes involved, you can reenable collecting these fields. Enable the setting `log_collection_settings.enrich_container_logs` in the agent config map as described in the [data collection configuration settings](./container-insights-agent-config.md).

> [!NOTE]
> We don't recommend the second option for large clusters that have more than 50 nodes. It generates API server calls from every node in the cluster to perform this enrichment. This option also increases data size for every log line collected.

## I can't upgrade a cluster after onboarding

Here's the scenario: You enabled Container insights for an Azure Kubernetes Service cluster. Then you deleted the Log Analytics workspace where the cluster was sending its data. Now when you attempt to upgrade the cluster, it fails. To work around this issue, you must disable monitoring and then reenable it by referencing a different valid workspace in your subscription. When you try to perform the cluster upgrade again, it should process and complete successfully.

## Next steps

When monitoring is enabled to capture health metrics for the AKS cluster nodes and pods, these health metrics are available in the Azure portal. To learn how to use Container insights, see [View Azure Kubernetes Service health](container-insights-analyze.md).
