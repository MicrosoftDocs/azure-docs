---
title: Manage the Container insights agent | Microsoft Docs
description: This article describes how to manage the most common maintenance tasks with the containerized Log Analytics agent used by Container insights.
ms.topic: conceptual
ms.date: 07/21/2020
ms.reviewer: aul
---

# Manage the Container insights agent

Container Insights uses a containerized version of the Log Analytics agent for Linux. After initial deployment, you might need to perform routine or optional tasks during its lifecycle. This article explains how to manually upgrade the agent and disable collection of environmental variables from a particular container.

>[!NOTE]
>The Container Insights agent name has changed from OMSAgent to Azure Monitor Agent, along with a few other resource names. This article reflects the new name. Update your commands, alerts, and scripts that reference the old name. Read more about the name change in [our blog post](https://techcommunity.microsoft.com/t5/azure-monitor-status-archive/name-update-for-agent-and-associated-resources-in-azure-monitor/ba-p/3576810). 
>

## Upgrade the Container insights agent

Container Insights uses a containerized version of the Log Analytics agent for Linux. When a new version of the agent is released, the agent is automatically upgraded on your managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS) and Azure Arc-enabled Kubernetes.

If the agent upgrade fails for a cluster hosted on AKS, this article also describes the process to manually upgrade the agent. To follow the versions released, see [Agent release announcements](https://aka.ms/ci-logs-agent-release-notes).

### Upgrade the agent on an AKS cluster

The process to upgrade the agent on an AKS cluster consists of two steps. The first step is to disable monitoring with Container insights by using the Azure CLI. Follow the steps described in the [Disable monitoring](container-insights-optout.md?#azure-cli) article. By using the Azure CLI, you can remove the agent from the nodes in the cluster without affecting the solution and the corresponding data that's stored in the workspace.

>[!NOTE]
>While you're performing this maintenance activity, the nodes in the cluster aren't forwarding collected data. Performance views won't show data between the time you removed the agent and installed the new version.
>

The second step is to install the new version of the agent. Follow the steps described in [Enable monitoring by using the Azure CLI](container-insights-enable-new-cluster.md#enable-using-azure-cli) to finish this process.

After you've reenabled monitoring, it might take about 15 minutes before you can view updated health metrics for the cluster. You have two methods to verify the agent upgraded successfully:

* Run the command `kubectl get pod <ama-logs-agent-pod-name> -n kube-system -o=jsonpath='{.spec.containers[0].image}'`. In the status returned, note the value under **Image** for Azure Monitor Agent in the **Containers** section of the output.
* On the **Nodes** tab, select the cluster node. On the **Properties** pane to the right, note the value under **Agent Image Tag**.

The version of the agent shown should match the latest version listed on the [Release history](https://github.com/microsoft/docker-provider/tree/ci_feature_prod) page.

### Upgrade the agent on a hybrid Kubernetes cluster

Perform the following steps to upgrade the agent on a Kubernetes cluster that runs on:

* Self-managed Kubernetes clusters hosted on Azure by using the AKS engine.
* Self-managed Kubernetes clusters hosted on Azure Stack or on-premises by using the AKS engine.

If the Log Analytics workspace is in commercial Azure, run the following command:

```console
$ helm upgrade --set omsagent.secret.wsid=<your_workspace_id>,omsagent.secret.key=<your_workspace_key>,omsagent.env.clusterName=<my_prod_cluster> incubator/azuremonitor-containers
```

If the Log Analytics workspace is in Microsoft Azure operated by 21Vianet, run the following command:

```console
$ helm upgrade --set omsagent.domain=opinsights.azure.cn,omsagent.secret.wsid=<your_workspace_id>,omsagent.secret.key=<your_workspace_key>,omsagent.env.clusterName=<your_cluster_name> incubator/azuremonitor-containers
```

If the Log Analytics workspace is in Azure US Government, run the following command:

```console
$ helm upgrade --set omsagent.domain=opinsights.azure.us,omsagent.secret.wsid=<your_workspace_id>,omsagent.secret.key=<your_workspace_key>,omsagent.env.clusterName=<your_cluster_name> incubator/azuremonitor-containers
```

## Disable environment variable collection on a container

Container Insights collects environmental variables from the containers running in a pod and presents them in the property pane of the selected container in the **Containers** view. You can control this behavior by disabling collection for a specific container either during deployment of the Kubernetes cluster or after by setting the environment variable `AZMON_COLLECT_ENV`. This feature is available from the agent version ciprod11292018 and higher.

To disable collection of environmental variables on a new or existing container, set the variable `AZMON_COLLECT_ENV` with a value of `False` in your Kubernetes deployment YAML configuration file.

```yaml
- name: AZMON_COLLECT_ENV  
  value: "False"  
```

Run the following command to apply the change to Kubernetes clusters other than Azure Red Hat OpenShift: `kubectl apply -f  <path to yaml file>`. To edit ConfigMap and apply this change for Azure Red Hat OpenShift clusters, run the following command:

```bash
oc edit configmaps container-azm-ms-agentconfig -n openshift-azure-logging
```

This command opens your default text editor. After you set the variable, save the file in the editor.

To verify the configuration change took effect, select a container in the **Containers** view in Container insights. In the property pane, expand **Environment Variables**. The section should show only the variable created earlier, which is `AZMON_COLLECT_ENV=FALSE`. For all other containers, the **Environment Variables** section should list all the environment variables discovered.

To reenable discovery of the environmental variables, apply the same process you used earlier and change the value from `False` to `True`. Then rerun the `kubectl` command to update the container.

```yaml
- name: AZMON_COLLECT_ENV  
  value: "True"  
```  
## Semantic version update of container insights agent version

Container Insights has shifted the image version and naming convention to [semver format] (https://semver.org/). SemVer helps developers keep track of every change made to a software during its development phase and ensures that the software versioning is consistent and meaningful. The old version was in format of ciprod\<timestamp\>-\<commitId\> and win-ciprod\<timestamp\>-\<commitId\>, our first image versions using the Semver format are 3.1.4 for Linux and win-3.1.4 for Windows. 

Semver is a universal software versioning schema that's defined in the format MAJOR.MINOR.PATCH, which follows the following constraints: 

1. Increment the MAJOR version when you make incompatible API changes. 
2. Increment the MINOR version when you add functionality in a backwards compatible manner. 
3. Increment the PATCH version when you make backwards compatible bug fixes.
  
With the rise of Kubernetes and the OSS ecosystem, Container Insights migrate to use semver image following the K8s recommended standard wherein with each minor version introduced, all breaking changes were required to be publicly documented with each new Kubernetes release.   

## Repair duplicate agents

Customers who manually enable Container Insights using custom methods prior to October 2022 can end up with multiple versions of our agent running together. To clear this duplication, customers are recommended to follow the steps below: 

### Migration guidelines for AKS clusters 

1.	Get details of customer's custom settings, such as memory and CPU limits on omsagent containers. 

2.	Review Resource Limits: 

Current ama-logs default limit are below

| OS      | Controller Name  | Default Limits |
|---|---|---|
| Linux   | ds-cpu-limit-linux | 500m           |
| Linux   | ds-memory-limit-linux       | 750Mi          |
| Linux   | rs-cpu-limit         | 1              |
| Linux   | rs-memory-limit    | 1.5Gi          |
| Windows | ds-cpu-limit-windows   | 500m           |
| Windows | ds-memory-limit-windows  | 1Gi            |

Validate whether the current default settings and limits meet the customer's needs. And if not, create support tickets under containerinsights agent to help investigate and toggle memory/cpu limits for the customer. Through doing this, it can help address the scale limitations issues that some customers encountered previously that resulted in OOMKilled exceptions.

3.	Fetch current Azure analytic workspace ID since we're going to re-onboard the container insights.

```console
az aks show -g  $resourceGroupNameofCluster -n $nameofTheCluster | grep logAnalyticsWorkspaceResourceID`
```

4.	Clean resources from previous onboarding: 

**For customers that previously onboarded to containerinsights through helm chart** :

•	List all releases across namespaces with command:

```console
 helm list --all-namespaces
```

•	Clean the chart installed for containerinsights (or azure-monitor-containers) with command:

```console
helm uninstall <releaseName> --namespace <Namespace>
```
	
**For customers that previously onboarded to containerinsights through yaml deployment** :

•	Download previous custom deployment yaml file:

```console
curl -LO raw.githubusercontent.com/microsoft/Docker-Provider/ci_dev/kubernetes/omsagent.yaml
```

•	Clean the old omsagent chart:

```console
kubectl delete -f omsagent.yaml
```

5.	Disable container insights to clean all related resources with aks command: [Disable Container insights on your Azure Kubernetes Service (AKS) cluster - Azure Monitor | Microsoft Learn](https://learn.microsoft.com/azure/azure-monitor/containers/container-insights-optout)

```console
az aks disable-addons -a monitoring -n MyExistingManagedCluster -g MyExistingManagedClusterRG
```

6.	Re-onboard to containerinsights with the workspace fetched from step 3 using [the steps outlined here](https://learn.microsoft.com/azure/azure-monitor/containers/container-insights-enable-aks?tabs=azure-cli#specify-a-log-analytics-workspace)



## Next steps

If you experience issues when you upgrade the agent, review the [troubleshooting guide](container-insights-troubleshoot.md) for support.

