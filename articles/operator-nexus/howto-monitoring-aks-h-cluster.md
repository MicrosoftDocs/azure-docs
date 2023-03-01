---
title: "Azure Operator Nexus: Monitoring of AKS-Hybrid cluster"
description: How-to guide for setting up monitoring of AKS-Hybrid cluster on Operator Nexus.
author: mukesh-dua #Required; your GitHub user alias, with correct capitalization.
ms.author: mukeshdua #Required; microsoft alias of author; optional team alias.
ms.service: azure  #Required
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 01/26/2023 #Required; mm/dd/yyyy format.
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Monitoring AKS-hybrid cluster

Each AKS-Hybrid cluster consists of multiple layers:

- Virtual Machines (VMs)
- Kubernetes layer
- Application pods

<!--- IMG ![AKS-Hybrid-Stack](Docs/media/sample-aks-hybrid-stack.png) IMG --->
:::image type="content" source="media/sample-aks-hybrid-stack.png" alt-text="Screenshot of Sample AKS-Hybrid-Stack.":::


Figure: Sample AKS-Hybrid Stack

AKS-Hybrid clusters, on an Operator Nexus instance, are delivered with an _optional_ observability solution, [Container Insights](/azure/azure-monitor/containers/container-insights-overview).
Container Insights captures the logs and metrics from AKS-Hybrid clusters and workloads.
It's solely your discretion whether to enable this tooling or deploy your own telemetry stack.

The AKS-Hybrid cluster with Azure monitoring tool looks like:

<!--- IMG ![AKS-Hybrid with Monitoring Tools](Docs/media/ask-hybrid-w-monitoring-tools.png) IMG --->
:::image type="content" source="media/ask-hybrid-w-monitoring-tools.png" alt-text="Screenshot of AKS-Hybrid with Monitoring Tools.":::


Figure: AKS-Hybrid with Monitoring Tools

## Extension onboarding with CLI using managed identity auth

When enabling Monitoring agents on AKS-Hybrid clusters using CLI, ensure appropriate versions of CLI are installed:

- azure-cli: 2.39.0+
- azure-cli-core: 2.39.0+
- k8s-extension: 1.3.2+
- AKS-Hybrid (for provisioned cluster operation, optional): 0.1.3+
- Resource-graph: 2.1.0+

Documentation for starting with [Azure CLI](/cli/azure/get-started-with-azure-cli), how to install it across [multiple operating systems](/cli/azure/install-azure-cli), and how to install [CLI extensions](/cli/azure/azure-cli-extensions-overview).

Install latest version of the
[necessary CLI extensions](./howto-install-cli-extensions.md).

## Monitoring AKS-hybrid – VM layer

This how-to guide provides steps and utility scripts to [Arc connect](/azure/azure-arc/servers/overview)
the AKS-Hybrid Virtual Machines to Azure and enable monitoring agents on top for collection of System logs from these VMs using [Azure Monitoring Agent](/azure/azure-monitor/agents/agents-overview).
The instructions further capture details on how to set up log data collection into a Log Analytics workspace.

To support these steps, the following resources are provided:

- `arc-connect.env` template file that can be used to create environment variables needed by included scripts
[!INCLUDE [arc-connect.env](./includes/arc-connect.md)]
- `dcr.sh` - script used to create a Data Collection Rule (DCR) that can be used to configure syslog collection
[!INCLUDE [dcr.sh](./includes/dcr.md)]
- `assign.sh` - script used to create a policy that will associate the DCR to all Arc-enabled servers in a resource group
[!INCLUDE [assign.sh](./includes/assign.md)]
- `install.sh` - script used to Arc-enable AKS-Hybrid VMs and install Azure Monitoring Agent on each
[!INCLUDE [install.sh](./includes/install.md)]

### Prerequisites-VM

- Cluster administrator access to the AKS-Hybrid cluster. See [documentation](/azure-stack/aks-hci/create-aks-hybrid-preview-cli#connect-to-the-aks-hybrid-cluster) on
  connecting to the AKS-Hybrid cluster.

- To use Azure Arc-enabled servers, the following Azure resource providers must be registered in the subscription:
  - Microsoft.HybridCompute
  - Microsoft.GuestConfiguration
  - Microsoft.HybridConnectivity

If these resource providers aren't already registered, register them using the following commands:

```azurecli
az account set --subscription "{the Subscription Name}"
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
az provider register --namespace 'Microsoft.HybridConnectivity'
```

- An Azure service principal assigned to the following Azure built-in roles, as needed, on the Azure resource group in which the machines will be connected:

| Role | Needed to |
|----------------------------------------------------------|----------------------------------------------- |
| [Azure Connected Machine Resource Administrator](/azure/role-based-access-control/built-in-roles#azure-connected-machine-resource-administrator)  or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) | Connect Arc-enabled AKS VM server in the resource group and install the Azure Monitoring Agent (AMA)|
| [Monitoring Contributor](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) | Create a [Data Collection Rule (DCR)](/azure/azure-monitor/agents/data-collection-rule-azure-monitor-agent) in the resource group and associate Arc-enabled servers to it |
| [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator), and [Resource Policy Contributor](/azure/role-based-access-control/built-in-roles#resource-policy-contributor) or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) | Needed if wanting to use Azure policy assignment(s) to [ensure Arc-enabled machines are associated to a DCR](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd5c37ce1-5f52-4523-b949-f19bf945b73a) |
| [Kubenetes Extension Contributer](/azure/role-based-access-control/built-in-roles#kubernetes-extension-contributor) | Needed to deploy the K8s extension for Container Insights |

### Environment setup

The scripts included with these instructions can be copied to, and run from an
[Azure Cloud Shell](/azure/cloud-shell/overview) in the Azure portal or any Linux command
prompt where the Kubernetes command line tool (kubectl) and Azure CLI are installed.
See these [instructions](/azure-stack/aks-hci/create-aks-hybrid-preview-cli#connect-to-the-aks-hybrid-cluster)
for connecting to the AKS-Hybrid cluster.

Prior to running any of the included scripts, the following environment variables must be properly defined:

| Environment Variable | Description |
|------------------------|---------------------------------------------------------------|
| SUBSCRIPTION_ID | The ID of the Azure subscription that contains the resource group |
| RESOURCE_GROUP | The resource group name where Arc-enabled server and associated resources will be created |
| LOCATION | The Azure Region where the Arc-enabled servers and associated resources will be created   |
| SERVICE_PRINCIPAL_ID | The appId of the Azure service principal with appropriate role assignment(s) |
| SERVICE_PRINCIPAL_SECRET | The authentication password for the Azure service principal |
| TENANT_ID | The ID of the tenant directory where the service principal exists |

For convenience, the template file, `arc-connect.env` can be modified and used to set the environment variable values.

```bash
# Apply the modified values to the environment
 ./arc-connect.env
```

### Adding a data collection rule (DCR)

Arc-enabled servers must be associated to a DCR in order to enable the collection of log data into a Log Analytics workspace.
The DCR may be created via the Azure portal or CLI. More information on creating a DCR to collect data from the VMs can be found [here](/azure/azure-monitor/agents/data-collection-rule-azure-monitor-agent).

For convenience, a **`dcr.sh`** script is included that will create a DCR in the specified resource group that will configure log collection.

1.Ensure proper [environment setup](#environment-setup) and role [prerequisites](#prerequisites-vm) for the service principal. The DCR will be created in the specified resource group.

2.Create or identify a Log Analytics workspace where log data will be ingested per the DCR.
Set an environment variable, LAW_RESOURCE_ID to its resource ID.
If the Log Analytics workspace name within the resource group is known, the resource ID can be found using the following command:

```bash
export LAW_RESOURCE_ID=$(az monitor log-analytics workspace show -g "${RESOURCE_GROUP}" -n <law name> --query id -o tsv)
```

3.Run the dcr.sh script. It will create a DCR in the specified resource group with name ${RESOURCE_GROUP}-syslog-dcr

```bash
./dcr.sh
```

The DCR may now be viewed and managed from the Azure portal or [CLI](/azure/monitor/data-collection/rule).
By default, the Linux Syslog log level is set to "INFO" but may be updated as needed.

**Note:** If the policy assignment is set up after the Arc-enabled servers are connected, the existing server can be added manually to the DCR or via a policy [remediation task](/azure/governance/policy/how-to/remediate-resources#create-a-remediation-task).

### Associate Arc-enabled server resources to DCR

Once a DCR is created, associate the Arc-enabled server resources to the DCR for logs to flow to the Log Analytics workspace.
There are options for how it can be done:

#### Use Azure portal or CLI to associate selected Arc-enabled servers to DCR

In Azure portal, add Arc-enabled server resource to the DCR using its Resources section.

Use this [link](/cli/azure/monitor/data-collection/rule/association#az-monitor-data-collection-rule-association-create)
for information about associating the resources via the Azure CLI.

### Use Azure policy to manage DCR associations

Another mechanism to associate all Arc-enabled servers within a resource group to the same DCR is to assign a policy to the resource group that will enforce the association.
There's a built-in policy definition, [Configure Linux Arc Machines to be associated with a Data Collection Rule](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd5c37ce1-5f52-4523-b949-f19bf945b73a) which can be assigned to the resource group with a specified DCR as a parameter.
It ensures that all Arc-enabled servers within the resource group would be associated to the same DCR.

This association can be done in the Azure portal by selecting the Assign button from the [policy definition](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd5c37ce1-5f52-4523-b949-f19bf945b73a) page.

For convenience, the **`assign.sh`** script is provided, which will assign the built-in policy to the specified resource group and DCR created with the **`dcr.sh`** script.

1. Ensure proper [environment setup](#environment-setup) and role [prerequisites](#prerequisites-vm) for the service principal to do policy and role assignments.
2. Ensure the DCR is created in the resource group using **`dcr.sh`** scripts as described in [Adding a Data Collection Rule](/azure/azure-monitor/essentials/data-collection-endpoint-overview?tabs=portal#create-a-data-collection-endpoint) section.
3. Run the **`assign.sh`** script. It will create the policy assignment and necessary role assignments.

```bash
./assign.sh
```

#### Connecting Arc-enabled servers and installing azure monitoring agent

The included **`install.sh`** script can be used to Arc-enroll all server VMs that represent the nodes of the AKS-Hybrid cluster.
This script creates a Kubernetes daemonSet on the AKS-Hybrid cluster.
It deploys a pod to each cluster node, connecting each VM to Arc-enabled servers and installing the Azure Monitoring Agent.
The daemonSet also includes a liveness probe that monitors the server connection and AMA processes.

1. Ensure proper environment setup as specified in [Environment Setup](#environment-setup). The current `kubeconfig` context must be set for the AKS-Hybrid cluster for which VMs are to be connected.
2. Kubectl access may be required to the provisioned cluster when configuring the extension. `KUBECONFIG` can be retrieved by running the Azure CLI command:

```azurecli
az hybridaks proxy --resource-group <AKS-Hybrid Cluster Resource Group> --name <AKS-Hybrid Cluster Name> --file <kube-config-filename> &

```

3.Set the `kubeconfig` file for using kubectl:

```bash
export KUBECONFIG=<path-to-kube-config-file>
```

4.Run the **`install.sh`** script from the command prompt with kubectl access to the AKS-Hybrid cluster.

The script will deploy the daemonSet to the cluster. Connection progress can be monitored as follows:

```bash
# Run the install script and observe results
./install.sh
kubectl get pod --selector='name=haks-vm-telemetry'
kubectl logs <podname>
```

Once complete, the message "Server monitoring configured successfully" will appear in the logs.
At that point the Arc-enabled servers will appear as resources within the selected resource group.

**Note:** Associate these connected servers to the [DCR](#associate-arc-enabled-server-resources-to-dcr). If a policy assignment was configured, there may be a delay to see logs.

### Monitoring AKS-hybrid – K8s layer

#### Prerequisites-Kubernetes

There are certain prerequisites the operator should ensure to configure the monitoring tools on AKS-Hybrid clusters.

Container Insights stores its data in a [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-workspace-overview).
A Log Analytics workspace Resource ID will be provided either during the [Cluster Extension Installation](#installing-the-cluster-extension),
or data will funnel into a default Log Analytics workspace in the Azure Subscription in the associated default Resource group (based on Azure Location).

An example for East US may look like follows:

- Log Analytics workspace Name: DefaultWorkspace-\<GUID>-EUS
- Resource group name: DefaultResourceGroup-EUS

A pre-existing _Log Analytics workspace Resource ID_ can be found by running the following Azure CLI commands:

```azurecli
az login

az account set --subscription "<Subscription Name or ID the Log Analytics workspace is in>"

az monitor log-analytics workspace show --workspace-name "<Log Analytics workspace Name>" \
  --resource-group "<Log Analytics workspace Resource Group>" \
  -o tsv --query id
```

If the account running the commands doesn't have the "Contributor" role assignment,
some of the necessary roles for the account (mechanized or not) to be able to deploy
Container Insights and view data in the applicable Log Analytics workspace
(instructions on how to assign roles can be found
[here](/azure/role-based-access-control/role-assignments-steps#step-5-assign-role):

- [Log Analytics Contributor](/azure/azure-monitor/logs/manage-access?tabs=portal#azure-rbac) role: necessary permissions to enable container monitoring on a CNF (provisioned) cluster.
- [Log Analytics Reader](/azure/azure-monitor/logs/manage-access?tabs=portal#azure-rbac) role: non-members of the Log Analytics Contributor role, receive permissions to view data in the Log Analytics workspace once container monitoring is enabled.

#### Installing the cluster extension

Sign-in into the [Azure Cloud Shell](/azure/cloud-shell/overview) to access the cluster:

```azurecli
az login

az account set --subscription "<Subscription Name or ID the Provisioned Cluster is in>"
```

Once, the subscription is set, deploy Container Insights extension on a provisioned AKS-Hybrid cluster using either of the next two commands:

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

#### Using the default Log analytics workspace

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

#### Cluster extension validation

The successful deployment of monitoring agents’ enablement on AKS-Hybrid clusters can be validated using the following command:

```azurecli
az k8s-extension show --name azuremonitor-containers \
  --cluster-name "<Provisioned Cluster Name>" \
  --resource-group "<Provisioned Cluster Resource Group>" \
  --cluster-type provisionedclusters \
  --cluster-resource-provider "microsoft.hybridcontainerservice"
```

Look for a Provisioning State of "Succeeded" for the extension. The "k8s-extension create" command may have also returned the status.

#### Customize logs & metrics collection

Container Insights provides end-users functionality to fine-tune the collection of logs and metrics from AKS-Hybrid clusters -- [Configure Container insights agent data collection](/azure/azure-monitor/containers/container-insights-agent-config).

## Additional resources

- Review [workbooks documentation](/azure/azure-monitor/visualize/workbooks-overview) and then you may use Operator Nexus telemetry [sample Operator Nexus workbooks](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Operator%20Distributed%20Services).
- Review [Azure Monitor Alerts](/azure/azure-monitor/alerts/alerts-overview), how to create [Azure Monitor Alert rules](/azure/azure-monitor/alerts/alerts-create-new-alert-rule?tabs=metric), and use [sample Operator Nexus Alert templates](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Operator%20Distributed%20Services).
