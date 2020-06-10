---
title: How to manage the Azure Monitor for containers agent | Microsoft Docs
description: This article describes managing the most common maintenance tasks with the containerized Log Analytics agent used by Azure Monitor for containers.
ms.topic: conceptual
ms.date: 05/12/2020

---

# How to manage the Azure Monitor for containers agent

Azure Monitor for containers uses a containerized version of the Log Analytics agent for Linux. After initial deployment, there are routine or optional tasks you may need to perform during its lifecycle. This article details on how to manually upgrade the agent and disable collection of environmental variables from a particular container. 

## How to upgrade the Azure Monitor for containers agent

Azure Monitor for containers uses a containerized version of the Log Analytics agent for Linux. When a new version of the agent is released, the agent is automatically upgraded on your managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS) and Azure Red Hat OpenShift version 3.x. For a [hybrid Kubernetes cluster](container-insights-hybrid-setup.md) and Azure Red Hat OpenShift version 4.x, the agent is not managed, and you need to manually upgrade the agent.

If the agent upgrade fails for a cluster hosted on AKS or Azure Red Hat OpenShift version 3.x, this article also describes the process to manually upgrade the agent. To follow the versions released, see [agent release announcements](https://github.com/microsoft/docker-provider/tree/ci_feature_prod).

### Upgrade agent on AKS cluster

The process to upgrade the agent on AKS clusters consists of two straight forward steps. The first step is to disable monitoring with Azure Monitor for containers using Azure CLI. Follow the steps described in the [Disable monitoring](container-insights-optout.md?#azure-cli) article. Using Azure CLI allows us to remove the agent from the nodes in the cluster without impacting the solution and the corresponding data that is stored in the workspace. 

>[!NOTE]
>While you are performing this maintenance activity, the nodes in the cluster are not forwarding collected data, and performance views will not show data between the time you remove the agent and install the new version. 
>

To install the new version of the agent, follow the steps described in the [enable monitoring using Azure CLI](container-insights-enable-new-cluster.md#enable-using-azure-cli), to complete this process.  

After you've re-enabled monitoring, it might take about 15 minutes before you can view updated health metrics for the cluster. To verify the agent upgraded successfully, run the command: `kubectl logs omsagent-484hw --namespace=kube-system`

The status should resemble the following example, where the value for *omi* and *omsagent* should match the latest version specified in the [agent release history](https://github.com/microsoft/docker-provider/tree/ci_feature_prod).  

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
	omi 1.4.2.5
	omsagent 1.6.0-163
	docker-cimprov 1.0.0.31

### Upgrade agent on hybrid Kubernetes cluster

Perform the following steps to upgrade the agent on a Kubernetes cluster running on:

* Self-managed Kubernetes clusters hosted on Azure using AKS Engine.
* Self-managed Kubernetes clusters hosted on Azure Stack or on-premises using AKS Engine.
* Red Hat OpenShift version 4.x.

If the Log Analytics workspace is in commercial Azure, run the following command:

```
$ helm upgrade --name myrelease-1 \
--set omsagent.secret.wsid=<your_workspace_id>,omsagent.secret.key=<your_workspace_key>,omsagent.env.clusterName=<my_prod_cluster> incubator/azuremonitor-containers
```

If the Log Analytics workspace is in Azure China, run the following command:

```
$ helm upgrade --name myrelease-1 \
--set omsagent.domain=opinsights.azure.cn,omsagent.secret.wsid=<your_workspace_id>,omsagent.secret.key=<your_workspace_key>,omsagent.env.clusterName=<your_cluster_name> incubator/azuremonitor-containers
```

If the Log Analytics workspace is in Azure US Government, run the following command:

```
$ helm upgrade --name myrelease-1 \
--set omsagent.domain=opinsights.azure.us,omsagent.secret.wsid=<your_workspace_id>,omsagent.secret.key=<your_workspace_key>,omsagent.env.clusterName=<your_cluster_name> incubator/azuremonitor-containers
```

### Upgrade agent on Azure Red Hat OpenShift v4

Perform the following steps to upgrade the agent on a Kubernetes cluster running on Azure Red Hat OpenShift version 4.x. 

>[!NOTE]
>Azure Red Hat OpenShift version 4.x only supports running in the Azure commercial cloud.
>

```
$ helm upgrade --name myrelease-1 \
--set omsagent.secret.wsid=<your_workspace_id>,omsagent.secret.key=<your_workspace_key>,omsagent.env.clusterId=<azureAroV4ResourceId> incubator/azuremonitor-containers
```

## How to disable environment variable collection on a container

Azure Monitor for containers collects environmental variables from the containers running in a pod and presents them in the property pane of the selected container in the **Containers** view. You can control this behavior by disabling collection for a specific container either during deployment of the Kubernetes cluster, or after by setting the environment variable *AZMON_COLLECT_ENV*. This feature is available from the agent version – ciprod11292018 and higher.  

To disable collection of environmental variables on a new or existing container, set the variable **AZMON_COLLECT_ENV** with a value of **False** in your Kubernetes deployment yaml configuration file. 

```  
- name: AZMON_COLLECT_ENV  
  value: "False"  
```  

Run the following command to apply the change to Kubernetes clusters other than Azure Red Hat OpenShift): `kubectl apply -f  <path to yaml file>`. To edit ConfigMap and apply this change for Azure Red Hat OpenShift clusters, run the command:

``` bash
oc edit configmaps container-azm-ms-agentconfig -n openshift-azure-logging
```

This opens your default text editor. After setting the variable, save the file in the editor.

To verify the configuration change took effect, select a container in the **Containers** view in Azure Monitor for containers, and in the property panel, expand **Environment Variables**.  The section should show only the variable created earlier - **AZMON_COLLECT_ENV=FALSE**. For all other containers, the Environment Variables section should list all the environment variables discovered.

To re-enable discovery of the environmental variables, apply the same process earlier and change the value from **False** to **True**, and then rerun the `kubectl` command to update the container.  

```  
- name: AZMON_COLLECT_ENV  
  value: "True"  
```  

## Next steps

If you experience issues while upgrading the agent, review the [troubleshooting guide](container-insights-troubleshoot.md) for support.
