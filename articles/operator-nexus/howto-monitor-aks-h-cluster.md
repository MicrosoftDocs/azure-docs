---
title: "Azure Operator Nexus: Monitoring of AKS-Hybrid cluster"
description: How-to guide for setting up monitoring of AKS-Hybrid cluster on Operator Nexus.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/26/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Monitor AKS-hybrid cluster

Each AKS-Hybrid cluster consists of multiple layers:

- Virtual Machines (VMs)
- Kubernetes layer
- Application pods

<!--- IMG ![AKS-Hybrid-Stack](Docs/media/sample-aks-hybrid-stack.png) IMG --->
:::image type="content" source="media/sample-aks-hybrid-stack.png" alt-text="Screenshot of Sample AKS-Hybrid-Stack.":::

Figure: Sample AKS-Hybrid Stack

On an Operator Nexus instance, AKS-Hybrid clusters are delivered with an _optional_ [Container Insights](../azure-monitor/containers/container-insights-overview.md) observability solution.
Container Insights captures the logs and metrics from AKS-Hybrid clusters and workloads.
It's solely your discretion whether to enable this tooling or deploy your own telemetry stack.

The AKS-Hybrid cluster with Azure monitoring tool looks like:

<!--- IMG ![AKS-Hybrid with Monitoring Tools](Docs/media/ask-hybrid-w-monitoring-tools.png) IMG --->
:::image type="content" source="media/ask-hybrid-w-monitoring-tools.png" alt-text="Screenshot of AKS-Hybrid with Monitoring Tools.":::

Figure: AKS-Hybrid with Monitoring Tools

## Extension onboarding with CLI using managed identity auth

When using CLI to enable monitoring agents on AKS-Hybrid clusters, install the following CLI versions:

- azure-cli: 2.39.0+
- azure-cli-core: 2.39.0+
- k8s-extension: 1.3.2+
- AKS-Hybrid (for provisioned cluster operation, optional): 0.1.3+
- Resource-graph: 2.1.0+

Documentation for starting with [Azure CLI](/cli/azure/get-started-with-azure-cli), how to install it across [multiple operating systems](/cli/azure/install-azure-cli), and how to install [CLI extensions](/cli/azure/azure-cli-extensions-overview).

Install latest version of the
[necessary CLI extensions](./howto-install-cli-extensions.md).

## Monitor AKS-hybrid – VM layer

This how-to guide provides steps and utility scripts to [Arc connect](../azure-arc/servers/overview.md)
the AKS-Hybrid Virtual Machines to Azure and enable monitoring agents on top for collection of System logs from these VMs using [Azure Monitoring Agent](../azure-monitor/agents/agents-overview.md).
The instructions further capture details on how to set up log data collection into a Log Analytics workspace.

The following resources provide you with support:

- `arc-connect.env`: use this template file to create environment variables needed by included scripts
[!INCLUDE [arc-connect.env](./includes/arc-connect.md)]
- `dcr.sh`: use this script to create a Data Collection Rule (DCR) to configure syslog collection
[!INCLUDE [dcr.sh](./includes/dcr.md)]
- `assign.sh`: use the script to create a policy to associate the DCR with all Arc-enabled servers in a resource group
[!INCLUDE [assign.sh](./includes/assign.md)]
- `install.sh`: Arc-enable AKS-Hybrid VMs and install Azure Monitoring Agent on each VM
[!INCLUDE [install.sh](./includes/install.md)]

### Prerequisites-VM

- Cluster administrator access to the AKS-Hybrid cluster. See [documentation](/azure-stack/aks-hci/create-aks-hybrid-preview-cli#connect-to-the-aks-hybrid-cluster) on
  connecting to the AKS-Hybrid cluster.

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
| [Azure Connected Machine Resource Administrator](../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)  or [Contributor](../role-based-access-control/built-in-roles.md#contributor) | Connect Arc-enabled AKS VM server in the resource group and install the Azure Monitoring Agent (AMA)|
| [Monitoring Contributor](../role-based-access-control/built-in-roles.md#user-access-administrator) or [Contributor](../role-based-access-control/built-in-roles.md#contributor) | Create a [Data Collection Rule (DCR)](../azure-monitor/agents/data-collection-rule-azure-monitor-agent.md) in the resource group and associate Arc-enabled servers to it |
| [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator), and [Resource Policy Contributor](../role-based-access-control/built-in-roles.md#resource-policy-contributor) or [Contributor](../role-based-access-control/built-in-roles.md#contributor) | Needed if you want to use Azure policy assignment(s) to ensure that a DCR is associated with [Arc-enabled machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd5c37ce1-5f52-4523-b949-f19bf945b73a) |
| [Kubernetes Extension Contributor](../role-based-access-control/built-in-roles.md#kubernetes-extension-contributor) | Needed to deploy the K8s extension for Container Insights |

### Environment setup

Copy and run the included scripts. You can run them from an
[Azure Cloud Shell](../cloud-shell/overview.md), in the Azure portal. Or you can run them from a Linux command
prompt where the Kubernetes command line tool (kubectl) and Azure CLI are installed.
See these [instructions](/azure-stack/aks-hci/create-aks-hybrid-preview-cli#connect-to-the-aks-hybrid-cluster)
for connecting to the AKS-Hybrid cluster.

Prior to running the included scripts, define the following environment variables:

| Environment Variable | Description |
|------------------------|---------------------------------------------------------------|
| SUBSCRIPTION_ID | The ID of the Azure subscription that contains the resource group |
| RESOURCE_GROUP | The resource group name where Arc-enabled server and associated resources are created |
| LOCATION | The Azure Region where the Arc-enabled servers and associated resources are created   |
| SERVICE_PRINCIPAL_ID | The appId of the Azure service principal with appropriate role assignment(s) |
| SERVICE_PRINCIPAL_SECRET | The authentication password for the Azure service principal |
| TENANT_ID | The ID of the tenant directory where the service principal exists |

For convenience, you can modify the template file, `arc-connect.env`, to set the environment variable values.

```bash
# Apply the modified values to the environment
 ./arc-connect.env
```

### Add a data collection rule (DCR)

Associate the Arc-enabled servers with a DCR to enable the collection of log data into a Log Analytics workspace.
You can create the DCR via the Azure portal or CLI.
Information on creating a DCR to collect data from the VMs is available [here](../azure-monitor/agents/data-collection-rule-azure-monitor-agent.md).

The included **`dcr.sh`** script creates a DCR, in the specified resource group, that will configure log collection.

1. Ensure proper [environment setup](#environment-setup) and role [prerequisites](#prerequisites-vm) for the service principal. The DCR is created in the specified resource group.

2. Create or identify a Log Analytics workspace for log data ingestion as per the DCR.
Set an environment variable, LAW_RESOURCE_ID to its resource ID.
Retrieve the resource ID for a known Log Analytics workspace name:

```bash
export LAW_RESOURCE_ID=$(az monitor log-analytics workspace show -g "${RESOURCE_GROUP}" -n <law name> --query id -o tsv)
```

3. Run the dcr.sh script. It creates a DCR in the specified resource group with name ${RESOURCE_GROUP}-syslog-dcr

```bash
./dcr.sh
```

View/manage the DCR from the Azure portal or [CLI](/cli/azure/monitor/data-collection/rule).
By default, the Linux Syslog log level is set to "INFO". You can change the log level as needed.

> [!NOTE]
> Manually, or via a policy, associate servers created prior to the DCR's creation.
See [remediation task](../governance/policy/how-to/remediate-resources.md#create-a-remediation-task).

### Associate Arc-enabled server resources to DCR

Associate the Arc-enabled server resources to the created DCR for logs to flow to the Log Analytics workspace.
There are options for associating servers with DCRs.

#### Use Azure portal or CLI to associate selected Arc-enabled servers to DCR

In Azure portal, add Arc-enabled server resource to the DCR using its Resources section.

Use this [link](/cli/azure/monitor/data-collection/rule/association#az-monitor-data-collection-rule-association-create)
for information about associating the resources via the Azure CLI.

### Use Azure policy to manage DCR associations

Assign a policy to the resource group to enforce the association.
There's a built-in policy definition, to associate [Linux Arc Machines with a DCR](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd5c37ce1-5f52-4523-b949-f19bf945b73a). Assign the policy to the resource group with DCR as a parameter.
It ensures association of all Arc-enabled servers, within the resource group, with the same DCR.

In the Azure portal, select the `Assign` button from the [policy definition](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd5c37ce1-5f52-4523-b949-f19bf945b73a) page.

For convenience, the provided **`assign.sh`** script assigns the built-in policy to the specified resource group and DCR created with the **`dcr.sh`** script.

1. Ensure proper [environment setup](#environment-setup) and role [prerequisites](#prerequisites-vm) for the service principal to do policy and role assignments.
2. Create the DCR, in the resource group, using **`dcr.sh`** script as described in [Adding a Data Collection Rule](../azure-monitor/essentials/data-collection-endpoint-overview.md?tabs=portal#create-a-data-collection-endpoint) section.
3. Run the **`assign.sh`** script. It creates the policy assignment and necessary role assignments.

```bash
./assign.sh
```

#### Connect Arc-enabled servers and install Azure monitoring agent

Use the included **`install.sh`** script to Arc-enroll all server VMs that represent the nodes of the AKS-Hybrid cluster.
This script creates a Kubernetes daemonSet on the AKS-Hybrid cluster.
It deploys a pod to each cluster node, connecting each VM to Arc-enabled servers and installing the Azure Monitoring Agent (AMA).
The `daemonSet` also includes a liveness probe that monitors the server connection and AMA processes.

1. Set the environment as specified in [Environment Setup](#environment-setup). Set the current `kubeconfig` context for the AKS-Hybrid cluster VMs.
2. Permit `Kubectl` access to the provisioned cluster. Retrieve `KUBECONFIG` by running the Azure CLI command:

```azurecli
az hybridaks proxy --resource-group <AKS-Hybrid Cluster Resource Group> --name <AKS-Hybrid Cluster Name> --file <kube-config-filename> &
```

3. Set the `kubeconfig` file for using kubectl:

```bash
export KUBECONFIG=<path-to-kube-config-file>
```

4. Run the **`install.sh`** script from the command prompt with kubectl access to the AKS-Hybrid cluster.

The script deploys the `daemonSet` to the cluster. Monitor the progress as follows:

```bash
# Run the install script and observe results
./install.sh
kubectl get pod --selector='name=haks-vm-telemetry'
kubectl logs <podname>
```

On completion, the system logs the message "Server monitoring configured successfully".
At that point, the Arc-enabled servers appear as resources within the selected resource group.

> [!NOTE]
> Associate these connected servers to the [DCR](#associate-arc-enabled-server-resources-to-dcr).
After you configure a policy, there may be some delay to observe the logs in Azure Log Analytics Workspace

### Monitor AKS-hybrid – K8s layer

#### Prerequisites-Kubernetes

There are certain prerequisites the operator should ensure to configure the monitoring tools on AKS-Hybrid clusters.

Container Insights stores its data in a [Log Analytics workspace](../azure-monitor/logs/log-analytics-workspace-overview.md).
Log data flows into the workspace whose Resource ID you provided during the initial scripts covered in the ["Add a data collection rule (DCR)"](#add-a-data-collection-rule-dcr) section.
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

- [Log Analytics Contributor](../azure-monitor/logs/manage-access.md?tabs=portal#azure-rbac) role: necessary permissions to enable container monitoring on a CNF (provisioned) cluster.
- [Log Analytics Reader](../azure-monitor/logs/manage-access.md?tabs=portal#azure-rbac) role: non-members of the Log Analytics Contributor role, receive permissions to view data in the Log Analytics workspace once you enable container monitoring.

#### Install the cluster extension

Sign-in into the [Azure Cloud Shell](../cloud-shell/overview.md) to access the cluster:

```azurecli
az login

az account set --subscription "<Subscription Name or ID the Provisioned Cluster is in>"
```

Now, deploy Container Insights extension on a provisioned AKS-Hybrid cluster using either of the next two commands:

#### With customer pre-created Log analytics workspace

```azurecli
az k8s-extension create --name azuremonitor-containers \
  --cluster-name "<Provisioned Cluster Name>" \
  --resource-group "<Provisioned Cluster Resource Group>" \
  --cluster-type provisionedclusters \
  --cluster-resource-provider "microsoft.hybridcontainerservice" \
  --extension-type Microsoft.AzureMonitor.Containers \
  --release-train preview \
  --configuration-settings logAnalyticsWorkspaceResourceID="<Log Analytics workspace Resource ID>" \
  amalogsagent.useAADAuth=true
```

#### Use the default Log analytics workspace

```azurecli
az k8s-extension create --name azuremonitor-containers \
  --cluster-name "<Provisioned Cluster Name>" \
  --resource-group "<Provisioned Cluster Resource Group>" \
  --cluster-type provisionedclusters \
  --cluster-resource-provider "microsoft.hybridcontainerservice" \
  --extension-type Microsoft.AzureMonitor.Containers \
  --release-train preview \
  --configuration-settings amalogsagent.useAADAuth=true
```

#### Validate Cluster extension

Validate the successful deployment of monitoring agents’ enablement on AKS-Hybrid clusters using the following command:

```azurecli
az k8s-extension show --name azuremonitor-containers \
  --cluster-name "<Provisioned Cluster Name>" \
  --resource-group "<Provisioned Cluster Resource Group>" \
  --cluster-type provisionedclusters \
  --cluster-resource-provider "microsoft.hybridcontainerservice"
```

Look for a Provisioning State of "Succeeded" for the extension. The "k8s-extension create" command may have also returned the status.

#### Customize logs & metrics collection

Container Insights provides end-users functionality to fine-tune the collection of logs and metrics from AKS-Hybrid clusters--[Configure Container insights agent data collection](../azure-monitor/containers/container-insights-agent-config.md).

## Extra resources

- Review [workbooks documentation](../azure-monitor/visualize/workbooks-overview.md) and then you may use Operator Nexus telemetry [sample Operator Nexus workbooks](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Operator%20Distributed%20Services).
- Review [Azure Monitor Alerts](../azure-monitor/alerts/alerts-overview.md), how to create [Azure Monitor Alert rules](../azure-monitor/alerts/alerts-create-new-alert-rule.md?tabs=metric), and use [sample Operator Nexus Alert templates](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Operator%20Distributed%20Services).
