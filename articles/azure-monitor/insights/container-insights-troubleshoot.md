---
title: How to Troubleshoot Azure Monitor for containers | Microsoft Docs
description: This article describes how you can troubleshoot and resolve issues with Azure Monitor for containers.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/27/2018
ms.author: magoedte
---

# Troubleshooting Azure Monitor for containers

When you configure monitoring of your Azure Kubernetes Service (AKS) cluster with Azure Monitor for containers, you may encounter an issue preventing data collection or reporting status. This article details some common issues and troubleshooting steps.

## Authorization error during onboarding or update operation
While enabling Azure Monitor for containers or updating a cluster to support collecting metrics, you may receive an error resembling the following - *The client <user’s Identity>' with object id '<user’s objectId>' does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope*

During the onboarding or update process, granting the **Monitoring Metrics Publisher** role assignment is attempted on the cluster resource. The user initiating the process to enable Azure Monitor for containers or the update to support the collection of metrics must have access to the **Microsoft.Authorization/roleAssignments/write** permission on the AKS cluster resource scope. Only members of the **Owner** and **User Access Administrator** built-in roles are granted access to this permission. If your security policies require assigning granular level permissions, we recommend you view [custom roles](../../role-based-access-control/custom-roles.md) and assign it to the users who require it. 

You can also manually grant this role from the Azure portal by performing the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com). 
2. In the Azure portal, click **All services** found in the upper left-hand corner. In the list of resources, type **Kubernetes**. As you begin typing, the list filters based on your input. Select **Azure Kubernetes**.
3. In the list of Kubernetes clusters, select one from the list.
2. From the left-hand menu, click **Access control (IAM)**.
3. Select **+ Add** to add a role assignment and select the **Monitoring Metrics Publisher** role and under the **Select** box type **AKS** to filter the results on just the clusters service principals defined in the subscription. Select the one from the list that is specific to that cluster.
4. Select **Save** to finish assigning the role. 

## Azure Monitor for containers is enabled but not reporting any information
If Azure Monitor for containers is successfully enabled and configured, but you cannot view status information or no results are returned from a log query, you diagnose the problem by following these steps: 

1. Check the status of the agent by running the command: 

    `kubectl get ds omsagent --namespace=kube-system`

    The output should resemble the following, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get ds omsagent --namespace=kube-system 
    NAME       DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
    omsagent   2         2         2         2            2           beta.kubernetes.io/os=linux   1d
    ```  
2. Check the deployment status with agent version *06072018* or later using the command:

    `kubectl get deployment omsagent-rs -n=kube-system`

    The output should resemble the following example, which indicates that it was deployed properly:

    ```
    User@aksuser:~$ kubectl get deployment omsagent-rs -n=kube-system 
    NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE    AGE
    omsagent   1         1         1            1            3h
    ```

3. Check the status of the pod to verify that it is running using the command: `kubectl get pods --namespace=kube-system`

    The output should resemble the following example with a status of *Running* for the omsagent:

    ```
    User@aksuser:~$ kubectl get pods --namespace=kube-system 
    NAME                                READY     STATUS    RESTARTS   AGE 
    aks-ssh-139866255-5n7k5             1/1       Running   0          8d 
    azure-vote-back-4149398501-7skz0    1/1       Running   0          22d 
    azure-vote-front-3826909965-30n62   1/1       Running   0          22d 
    omsagent-484hw                      1/1       Running   0          1d 
    omsagent-fkq7g                      1/1       Running   0          1d 
    ```

4. Check the agent logs. When the containerized agent gets deployed, it runs a quick check by running OMI commands and displays the version of the agent and provider. 

5. To verify that the agent has been deployed successfully, run the command: `kubectl logs omsagent-484hw --namespace=kube-system`

    The status should resemble the following example:

    ```
    User@aksuser:~$ kubectl logs omsagent-484hw --namespace=kube-system
	:
	:
	instance of Container_HostInventory
	{
	    [Key] InstanceID=3a4407a5-d840-4c59-b2f0-8d42e07298c2
	    Computer=aks-nodepool1-39773055-0
	    DockerVersion=1.13.1
	    OperatingSystem=Ubuntu 16.04.3 LTS
	    Volume=local
	    Network=bridge host macvlan null overlay
	    NodeRole=Not Orchestrated
	    OrchestratorType=Kubernetes
	}
	Primary Workspace: b438b4f6-912a-46d5-9cb1-b44069212abc    Status: Onboarded(OMSAgent Running)
	omi 1.4.2.2
	omsagent 1.6.0.23
	docker-cimprov 1.0.0.31
    ```

## Error messages

The table below summarizes known errors you may encounter while using Azure Monitor for containers.

| Error messages  | Action |  
| ---- | --- |  
| Error Message `No data for selected filters`  | It may take some time to establish monitoring data flow for newly created clusters. Allow at least 10 to 15 minutes for data to appear for your cluster. |   
| Error Message `Error retrieving data` | While Azure Kubenetes Service cluster is setting up for health and performance monitoring, a connection is established between the cluster and Azure Log Analytics workspace. A Log Analytics workspace is used to store all monitoring data for your cluster. This error may occur when your Log Analytics workspace has been deleted or lost. Check whether your workspace is available by reviewing [manage access](../platform/manage-access.md#view-workspace-details). If the workspace is missing, you will need to re-enable monitoring of your cluster with Azure Monitor for containers. To re-enable, you will need to [disable](container-insights-optout.md) monitoring for the cluster and [enable](container-insights-enable-new-cluster.md) Azure Monitor for containers again. |  
| `Error retrieving data` after adding Azure Monitor for containers through az aks cli | When enable monitoring using `az aks cli`, Azure Monitor for containers may not be properly deployed. Check whether the solution is deployed. To do this, go to your Log Analytics workspace and see if the solution is available by selecting **Solutions** from the pane on the left-hand side. To resolve this issue, you will need to redeploy the solution by following the instructions on [how to deploy Azure Monitor for containers](container-insights-onboard.md) |  

To help diagnose the problem, we have provided a troubleshooting script available [here](https://github.com/Microsoft/OMS-docker/tree/ci_feature_prod/Troubleshoot#troubleshooting-script).  

## Next steps
With monitoring enabled to capture health metrics for both the AKS cluster nodes and pods, these health metrics are available in the Azure portal. To learn how to use Azure Monitor for containers, see [View Azure Kubernetes Service health](container-insights-analyze.md).