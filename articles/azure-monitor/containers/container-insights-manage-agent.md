---
title: Manage the Container insights agent
description: Describes how to manage the most common maintenance tasks with the containerized Log Analytics agent used by Container insights.
ms.topic: conceptual
ms.date: 12/19/2023
ms.reviewer: aul
---

# Manage the Container insights agent

Container Insights uses a containerized version of the Log Analytics agent for Linux. After initial deployment, you might need to perform routine or optional tasks during its lifecycle. This article explains how to manually upgrade the agent and disable collection of environmental variables from a particular container.

> [!NOTE]
> If you've already deployed an AKS cluster and enabled monitoring by using either the Azure CLI or a Resource Manager template, you can't use `kubectl` to upgrade, delete, redeploy, or deploy the agent. The template needs to be deployed in the same resource group as the cluster.


## Upgrade the Container insights agent

Container Insights uses a containerized version of the Log Analytics agent for Linux. When a new version of the agent is released, the agent is automatically upgraded on your managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS) and Azure Arc-enabled Kubernetes.

If the agent upgrade fails for a cluster hosted on AKS, this article also describes the process to manually upgrade the agent. To follow the versions released, see [Agent release announcements](https://aka.ms/ci-logs-agent-release-notes).

### Upgrade the agent on an AKS cluster

The process to upgrade the agent on an AKS cluster consists of two steps. The first step is to disable monitoring with Container insights by using the Azure CLI. Follow the steps described in [Disable Container insights on your Kubernetes cluster](kubernetes-monitoring-disable.md) article. By using the Azure CLI, you can remove the agent from the nodes in the cluster without affecting the solution and the corresponding data that's stored in the workspace.

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

Container Insights has shifted the image version and naming convention to [semver format] (https://semver.org/). SemVer helps developers keep track of every change made to software during its development phase and ensures that the software versioning is consistent and meaningful. The old version was in format of ciprod\<timestamp\>-\<commitId\> and win-ciprod\<timestamp\>-\<commitId\>, our first image versions using the Semver format are 3.1.4 for Linux and win-3.1.4 for Windows. 

Semver is a universal software versioning schema that's defined in the format MAJOR.MINOR.PATCH, which follows the following constraints: 

1. Increment the MAJOR version when you make incompatible API changes. 
2. Increment the MINOR version when you add functionality in a backwards compatible manner. 
3. Increment the PATCH version when you make backwards compatible bug fixes.
  
With the rise of Kubernetes and the OSS ecosystem, Container Insights migrate to use semver image following the K8s recommended standard wherein with each minor version introduced, all breaking changes were required to be publicly documented with each new Kubernetes release.   

## Repair duplicate agents

If you manually enabled Container Insights using custom methods prior to October 2022, you can end up with multiple versions of the agent running together. Follow the steps below to clear this duplication. 


1.	Gather details of any custom settings, such as memory and CPU limits on your omsagent containers. 

2.	Review default resource limits for ama-logs and determine if they meet your needs. If not, you may need to create a support topic to help investigate and toggle memory/cpu limits. This can help address the scale limitations issues that some customers encountered previously that resulted in OOMKilled exceptions.

    | OS      | Controller Name  | Default Limits |
    |---|---|---|
    | Linux   | ds-cpu-limit-linux | 500m           |
    | Linux   | ds-memory-limit-linux       | 750Mi          |
    | Linux   | rs-cpu-limit         | 1              |
    | Linux   | rs-memory-limit    | 1.5Gi          |
    | Windows | ds-cpu-limit-windows   | 500m           |
    | Windows | ds-memory-limit-windows  | 1Gi            |


4.	Clean resources from previous onboarding: 

    **If you previously onboarded using helm chart** :
    
    List all releases across namespaces with the following command:
    
    ```console
     helm list --all-namespaces
    ```
    
    Clean the chart installed for Container insights with the following command:
    
    ```console
    helm uninstall <releaseName> --namespace <Namespace>
    ```

    **If you previously onboarded using yaml deployment** :
    
    Download previous custom deployment yaml file with the following command:
    
    ```console
    curl -LO raw.githubusercontent.com/microsoft/Docker-Provider/ci_dev/kubernetes/omsagent.yaml
    ```
    
    Clean the old omsagent chart with the following command:
    
    ```console
    kubectl delete -f omsagent.yaml
    ```

5.	Disable Container insights to clean all related resources using the guidance at [Disable Container insights on your Kubernetes cluster](../containers/kubernetes-monitoring-disable.md)


6.	Re-onboard to Container insights using the guidance at [Enable Container insights on your Kubernetes cluster](kubernetes-monitoring-enable.md)



## Next steps

If you experience issues when you upgrade the agent, review the [troubleshooting guide](container-insights-troubleshoot.md) for support.

