---
title: Monitor a new Azure Kubernetes Service (AKS) cluster | Microsoft Docs
description: Learn how to enable monitoring for a new Azure Kubernetes Service (AKS) cluster with Azure Monitor for containers subscription.
ms.topic: conceptual
ms.date: 04/25/2019

---

# Enable monitoring of a new Azure Kubernetes Service (AKS) cluster

This article describes how to set up Azure Monitor for containers to monitor managed Kubernetes cluster hosted on [Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/) that you are preparing to deploy in your subscription.

You can enable monitoring of an AKS cluster using one of the supported methods:

* Azure CLI
* Terraform

## Enable using Azure CLI

To enable monitoring of a new AKS cluster created with Azure CLI, follow the step in the quickstart article under the section [Create AKS cluster](../../aks/kubernetes-walkthrough.md#create-aks-cluster).  

>[!NOTE]
>If you choose to use the Azure CLI, you first need to install and use the CLI locally. You must be running the Azure CLI version 2.0.74 or later. To identify your version, run `az --version`. If you need to install or upgrade the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli). 
>If you have installed the aks-preview CLI extension version 0.4.12 or higher, remove any changes you have made to enable a preview extension as it can override the default Azure CLI behavior since AKS Preview features aren't available in Azure US Governmnet cloud.

## Enable using Terraform

If you are [deploying a new AKS cluster using Terraform](../../terraform/terraform-create-k8s-cluster-with-tf-and-aks.md), you specify the arguments required in the profile [to create a Log Analytics workspace](https://www.terraform.io/docs/providers/azurerm/r/log_analytics_workspace.html) if you do not chose to specify an existing one. 

>[!NOTE]
>If you choose to use Terraform, you must be running the Terraform Azure RM Provider version 1.17.0 or above.

To add Azure Monitor for containers to the workspace, see [azurerm_log_analytics_solution](https://www.terraform.io/docs/providers/azurerm/r/log_analytics_solution.html) and complete the profile by including the [**addon_profile**](https://www.terraform.io/docs/providers/azurerm/r/kubernetes_cluster.html#addon_profile) and specify **oms_agent**. 

After you've enabled monitoring and all configuration tasks are completed successfully, you can monitor the performance of your cluster in either of two ways:

* Directly in the AKS cluster by selecting **Health** in the left pane.
* By selecting the **Monitor Container insights** tile in the AKS cluster page for the selected cluster. In Azure Monitor, in the left pane, select **Health**. 

  ![Options for selecting Azure Monitor for containers in AKS](./media/container-insights-onboard/kubernetes-select-monitoring-01.png)

After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster. 

## Verify agent and solution deployment
With agent version *06072018* or later, you can verify that both the agent and the solution were deployed successfully. With earlier versions of the agent, you can verify only agent deployment.

### Agent version 06072018 or later
Run the following command to verify that the agent is deployed successfully. 

```
kubectl get ds omsagent --namespace=kube-system
```

The output should resemble the following, which indicates that it was deployed properly:

```
User@aksuser:~$ kubectl get ds omsagent --namespace=kube-system 
NAME       DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
omsagent   2         2         2         2            2           beta.kubernetes.io/os=linux   1d
```  

To verify deployment of the solution, run the following command:

```
kubectl get deployment omsagent-rs -n=kube-system
```

The output should resemble the following, which indicates that it was deployed properly:

```
User@aksuser:~$ kubectl get deployment omsagent-rs -n=kube-system 
NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE    AGE
omsagent   1         1         1            1            3h
```

### Agent version earlier than 06072018

To verify that the Log Analytics agent version released before *06072018* is deployed properly, run the following command:  

```
kubectl get ds omsagent --namespace=kube-system
```

The output should resemble the following, which indicates that it was deployed properly:  

```
User@aksuser:~$ kubectl get ds omsagent --namespace=kube-system 
NAME       DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
omsagent   2         2         2         2            2           beta.kubernetes.io/os=linux   1d
```  

## View configuration with CLI
Use the `aks show` command to get details such as is the solution enabled or not, what is the Log Analytics workspace resourceID, and summary details about the cluster.  

```azurecli
az aks show -g <resourceGroupofAKSCluster> -n <nameofAksCluster>
```

After a few minutes, the command completes and returns JSON-formatted information about solution.  The results of the command should show the monitoring add-on profile and resembles the following example output:

```
"addonProfiles": {
    "omsagent": {
      "config": {
        "logAnalyticsWorkspaceResourceID": "/subscriptions/<WorkspaceSubscription>/resourceGroups/<DefaultWorkspaceRG>/providers/Microsoft.OperationalInsights/workspaces/<defaultWorkspaceName>"
      },
      "enabled": true
    }
  }
```

## Next steps

* If you experience issues while attempting to onboard the solution, review the [troubleshooting guide](container-insights-troubleshoot.md)

* With monitoring enabled to collect health and resource utilization of your AKS cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Azure Monitor for containers.
