---
title: "Azure Operator Nexus: Monitoring of  Nexus Kubernetes cluster"
description: How-to guide for setting up monitoring of Nexus Kubernetes cluster on Operator Nexus.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/26/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Monitor Nexus Kubernetes cluster

Each Nexus Kubernetes cluster consists of multiple layers:

- Virtual Machines (VMs)
- Kubernetes layer
- Application pods

<!--- IMG ![Nexus Kubernetes Cluster](Docs/media/sample-naks-stack.png) IMG --->
:::image type="content" source="media/sample-naks-stack.png" alt-text="Screenshot of Sample Nexus Kubernetes cluster.":::

Figure: Sample Nexus Kubernetes cluster

On an instance, Nexus Kubernetes clusters are delivered with an _optional_ [Container Insights](/azure/azure-monitor/containers/container-insights-overview) observability solution.
Container Insights captures the logs and metrics from Nexus Kubernetes clusters and workloads.
It's solely your discretion whether to enable this tooling or deploy your own telemetry stack.

The Nexus Kubernetes cluster with Azure monitoring tool looks like:

<!--- IMG ![Nexus Kubernetes cluster with Monitoring Tools](Docs/media/naks-monitoring.png) IMG --->
:::image type="content" source="media/naks-monitoring.png" alt-text="Screenshot of Nexus Kubernetes cluster with Monitoring Tools.":::

Figure: Nexus Kubernetes cluster with Monitoring Tools

## Extension onboarding with CLI using managed identity auth

Documentation for starting with [Azure CLI](/cli/azure/get-started-with-azure-cli), how to install it across [multiple operating systems](/cli/azure/install-azure-cli), and how to install [CLI extensions](/cli/azure/azure-cli-extensions-overview).

Install latest version of the
[necessary CLI extensions](./howto-install-cli-extensions.md).

## Monitor Nexus Kubernetes cluster

This how-to guide provides steps to enable monitoring agents for the collection of System logs from these VMs using [Azure Monitoring Agent](/azure/azure-monitor/agents/agents-overview).
The instructions further capture details on how to set up log data collection into a Log Analytics workspace.

### Prerequisites

- Cluster administrator access to the Nexus Kubernetes cluster.

- To use Azure Arc-enabled servers, register the following Azure resource providers in your subscription:
  - Microsoft.HybridCompute
  - Microsoft.GuestConfiguration
  - Microsoft.HybridConnectivity

Register these resource providers, if not done previously:

```azurecli
az account set --subscription "{the Subscription Name}"
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
az provider register --namespace 'Microsoft.HybridConnectivity'
```

- Assign an Azure service principal to the following Azure built-in roles, as needed.
Assign the service principal to the Azure resource group that has the machines to be connected:

| Role | Needed to |
|----------------------------------------------------------|----------------------------------------------- |
| [Azure Connected Machine Resource Administrator](../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)  or [Contributor](../role-based-access-control/built-in-roles.md#contributor) | Connect Arc-enabled Nexus Kubernetes cluster VM server in the resource group and install the Azure Monitoring Agent (AMA)|
| [Monitoring Contributor](../role-based-access-control/built-in-roles.md#user-access-administrator) or [Contributor](../role-based-access-control/built-in-roles.md#contributor) | Create a [Data Collection Rule (DCR)](/azure/azure-monitor/agents/data-collection-rule-azure-monitor-agent) in the resource group and associate Arc-enabled servers to it |
| [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator), and [Resource Policy Contributor](../role-based-access-control/built-in-roles.md#resource-policy-contributor) or [Contributor](../role-based-access-control/built-in-roles.md#contributor) | Needed if you want to use Azure policy assignment(s) to ensure that a DCR is associated with [Arc-enabled machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd5c37ce1-5f52-4523-b949-f19bf945b73a) |
| [Kubernetes Extension Contributor](../role-based-access-control/built-in-roles.md#kubernetes-extension-contributor) | Needed to deploy the K8s extension for Container Insights |

### Monitor Nexus Kubernetes cluster

#### Prerequisites

There are certain prerequisites the operator should ensure to configure the monitoring tools on Nexus Kubernetes Clusters.

Container Insights stores its data in a [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-workspace-overview).
Log data flows into the workspace whose Resource ID you provided during the installation of the Container Insights extension.
Else, data funnels into a default workspace in the Resource group associated with your subscription (based on Azure location).

An example for East US may look like follows:

- Log Analytics workspace Name: DefaultWorkspace-\<GUID>-EUS
- Resource group name: DefaultResourceGroup-EUS

Run the following command to get a pre-existing _Log Analytics workspace Resource ID_:

```azurecli
az login

az account set --subscription "<Subscription Name or ID the Log Analytics workspace is in>"

az monitor log-analytics workspace show --workspace-name "<Log Analytics workspace Name>" \
  --resource-group "<Log Analytics workspace Resource Group>" \
  -o tsv --query id
```

To deploy
Container Insights and view data in the applicable Log Analytics workspace requires certain role assignments in your account.
For example, the "Contributor" role assignment.
See the instructions for [assigning required roles](../role-based-access-control/role-assignments-steps.md#step-5-assign-role):

- [Log Analytics Contributor](/azure/azure-monitor/logs/manage-access?tabs=portal#azure-rbac) role: necessary permissions to enable container monitoring on a CNF (provisioned) cluster.
- [Log Analytics Reader](/azure/azure-monitor/logs/manage-access?tabs=portal#azure-rbac) role: non-members of the Log Analytics Contributor role, receive permissions to view data in the Log Analytics workspace once you enable container monitoring.

#### Install the cluster extension

Sign-in into the [Azure Cloud Shell](../cloud-shell/overview.md) to access the cluster:

```azurecli
az login

az account set --subscription "<Subscription Name or ID the Provisioned Cluster is in>"
```

Now, deploy Container Insights extension on a provisioned Nexus Kubernetes cluster using either of the next two commands:

#### With customer pre-created Log analytics workspace

```azurecli
az k8s-extension create --name azuremonitor-containers \
  --cluster-name "<Nexus Kubernetes cluster Name>" \
  --resource-group "<Nexus Kubernetes cluster Resource Group>" \
  --cluster-type connectedClusters \
  --extension-type Microsoft.AzureMonitor.Containers \
  --release-train preview \
  --configuration-settings logAnalyticsWorkspaceResourceID="<Log Analytics workspace Resource ID>" \
  amalogsagent.useAADAuth=true
```

#### Use the default Log analytics workspace

```azurecli
az k8s-extension create --name azuremonitor-containers \
  --cluster-name "<Nexus Kubernetes cluster Name>" \
  --resource-group "<Nexus Kubernetes cluster Resource Group>" \
  --cluster-type connectedClusters \
  --extension-type Microsoft.AzureMonitor.Containers \
  --release-train preview \
  --configuration-settings amalogsagent.useAADAuth=true
```

#### Validate Cluster extension

Validate the successful deployment of monitoring agents’ enablement on Nexus Kubernetes Clusters using the following command:

```azurecli
az k8s-extension show --name azuremonitor-containers \
  --cluster-name "<Nexus Kubernetes cluster Name>" \
  --resource-group "<Nexus Kubernetes cluster Resource Group>" \
  --cluster-type connectedClusters
```

Look for a Provisioning State of "Succeeded" for the extension. The "k8s-extension create" command may have also returned the status.

#### Customize logs & metrics collection

Container Insights provides end-users functionality to fine-tune the collection of logs and metrics from Nexus Kubernetes Clusters. See the instructions for [Configure Container insights agent data collection](/azure/azure-monitor/containers/container-insights-data-collection-configure) for more information.


> [!NOTE]
> Container Insights does not collect logs from the `kube-system` namespace by default. To collect logs from the `kube-system` namespace, you must configure the agent to collect logs from the `kube-system` namespace.
> This can be done by removing the `kube-system` namespace from the `excludedNamespaces` field in the ConfigMap following the [`configMap` configuration](/azure/azure-monitor/containers/container-insights-data-collection-configure?tabs=portal#configure-data-collection-using-configmap) approach.
> ```
> [log_collection_settings]
>   [log_collection_settings.stdout]
>     # In the absence of this configmap, default value for enabled is true
>     enabled = true
>     # exclude_namespaces setting holds good only if enabled is set to true
>     # kube-system,gatekeeper-system log collection are disabled by default in the absence of 'log_collection_settings.stdout' setting. If you want to enable kube-system,gatekeeper-system, remove them from the following setting.
>     # If you want to continue to disable kube-system,gatekeeper-system log collection keep the namespaces in the following setting and add any other namespace you want to disable log collection to the array.
>     # In the absence of this configmap, default value for exclude_namespaces = ["kube-system","gatekeeper-system"]
>     exclude_namespaces = ["gatekeeper-system"]
>     # If you want to collect logs from only selective pods inside system namespaces add them to the following setting. Provide namespace:controllerName of the system pod. NOTE: this setting is only for pods in system namespaces
>     # Valid values for system namespaces are: kube-system, azure-arc, gatekeeper-system, kube-public, kube-node-lease, calico-system. The system namespace used should not be present in exclude_namespaces
>     # collect_system_pod_logs = ["kube-system:coredns"]
>
>   [log_collection_settings.stderr]
>     # Default value for enabled is true
>     enabled = true
>     # exclude_namespaces setting holds good only if enabled is set to true
>     # kube-system,gatekeeper-system log collection are disabled by default in the absence of 'log_collection_settings.stderr' setting. If you want to enable kube-system,gatekeeper-system, remove them from the following setting.
>     # If you want to continue to disable kube-system,gatekeeper-system log collection keep the namespaces in the following setting and add any other namespace you want to disable log collection to the array.
>     # In the absence of this configmap, default value for exclude_namespaces = ["kube-system","gatekeeper-system"]
>     exclude_namespaces = ["gatekeeper-system"]
>     # If you want to collect logs from only selective pods inside system namespaces add them to the following setting. Provide namespace:controllerName of the system pod. NOTE: this setting is only for pods in system namespaces
>     # Valid values for system namespaces are: kube-system, azure-arc, gatekeeper-system, kube-public, kube-node-lease, calico-system. The system namespace used should not be present in exclude_namespaces
>     # collect_system_pod_logs = ["kube-system:coredns"]
>```


## Extra resources

- Review [workbooks documentation](/azure/azure-monitor/visualize/workbooks-overview) and then you may use Operator Nexus telemetry sample Operator Nexus workbooks.
- Review [Azure Monitor Alerts](/azure/azure-monitor/alerts/alerts-overview), how to create [Azure Monitor Alert rules](/azure/azure-monitor/alerts/alerts-create-new-alert-rule?tabs=metric), and use sample Operator Nexus Alert templates.
