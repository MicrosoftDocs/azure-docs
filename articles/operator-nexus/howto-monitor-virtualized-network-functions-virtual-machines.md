---
title: "Azure Operator Nexus: Monitoring of Virtualized Network Function Virtual Machines"
description: How-to guide for setting up monitoring of Virtualized Network Function Virtual Machines on Operator Nexus.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/01/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Monitoring virtual machines (for virtualized network function)

This section discusses the optional tooling available for telecom operators to monitor the Virtualized Network Functions (VNF) workloads. With Azure Monitoring Agent (AMA), logs and performance metrics can be collected from the Virtual Machines (VM) running VNFs. One of the pre-requisites for AMA is Arc connectivity back to Azure (using Azure Arc for Servers).

## Extension onboarding with CLI using managed identity auth

When enabling Monitoring agents on VMs using CLI, ensure appropriate versions of CLI are installed:

- azure-cli: 2.39.0+
- azure-cli-core: 2.39.0+
- Resource-graph: 2.1.0+

Documentation for starting with [Azure CLI](/cli/azure/get-started-with-azure-cli), how to install it across [multiple operating systems](/cli/azure/install-azure-cli), and how to install [CLI extensions](/cli/azure/azure-cli-extensions-overview).

## Arc connectivity

Azure Arc-enabled servers let you manage Linux physical servers and Virtual Machines hosted outside of Azure, such as on-premises cloud environment like Operator Nexus. A hybrid machine is any machine not running in Azure. When a hybrid machine is connected to Azure, it becomes a connected machine, treated as a resource in Azure. Each connected machine has a Resource ID enabling the machine to be included in a resource group.

### Prerequisites

Before you start, be sure to review the [prerequisites](../azure-arc/servers/prerequisites.md) and verify that your subscription, and resources meet the requirements.
Some of the prerequisites are:

- Your VNF VM is connected to CloudServicesNetwork (the network that the VM uses to communicate with Operator Nexus services).
- You have SSH access to your VNF VM.
- Proxies & wget install:
  - Ensure wget is installed.
  - To set the proxy as an environment variable run:

```azurecli
echo "http\_proxy=http://169.254.0.11:3128" \>\> /etc/environment
echo "https\_proxy=http://169.254.0.11:3128" \>\> /etc/environment
```

- You have appropriate permissions on VNF VM to be able to run scripts, install package dependencies etc. For more information visit [link](../azure-arc/servers/prerequisites.md#required-permissions) for more details.
- To use Azure Arc-enabled servers, the following Azure resource providers must be registered in your subscription:
  - Microsoft.HybridCompute
  - Microsoft.GuestConfiguration
  - Microsoft.HybridConnectivity

If these resource providers aren't already registered, you can register them using the following commands:

```azurecli
az account set --subscription "{Your Subscription Name}"

az provider register --namespace 'Microsoft.HybridCompute'

az provider register --namespace 'Microsoft.GuestConfiguration'

az provider register --namespace 'Microsoft.HybridConnectivity'
```

### Deployment

You can Arc connect servers in your environment by performing a set of steps manually. The VNF VM can be connected to Azure using a deployment script. Or you can use an automated method by running a template script. The script can be used to automate the download and installation of the agent.

This method requires that you have administrator permissions on the machine to install and configure the agent. On Linux machine, you can deploy the required agentry by using the root account.

The script to automate the download and installation, and to establish the connection with Azure Arc, is available from the Azure portal. To complete the process, take the following steps:

1. From your browser, go to the [Azure portal](https://portal.azure.com/#view/Microsoft_Azure_HybridCompute/HybridVmAddBlade).
2. On the  **Select a method**  page, select the  **Add a single server**  tile, and then select  **Generate script**.
3. On the  **Prerequisites**  page, select **Next** **.**
4. On the  **Resource details**  page, provide the  following information:

5. In the Subscription drop-down list, select the subscription the machine will be managed in.
6. In the  **Resource group**  drop-down list, select the resource group the machine will be managed from.
7. In the  **Region**  drop-down list, select the Azure region to store the server's metadata.
8. In the  **Operating system**  drop-down list, select the operating system of your VNF VM.
9. If the machine is communicating through a proxy server to connect to the internet, specify the proxy server IP address. If a name and port number is used, specify that information.
10. Select  **Next: Tags**.

11. On the  **Tags**  page, review the default  **Physical location tags**  suggested and enter a value, or specify one or more  **Custom tags**  to support your standards.
12. Select  **Next: Download and run script**.
13. On the  **Download and run script**  page, review the summary information, and then select  **Download**. If you still need to make changes, select  **Previous**.

**Note:**

1. Set the exit on error flag up at the top of the script to make sure it fails fast and doesn't give you false success in the end. For example, in Shell script use "set -e" at the top of the script.
2. Add export http\_proxy=\<PROXY\_URL\> and export https\_proxy=\<PROXY\_URL\> to the script along with export statements in the Arc connectivity script. (Proxy IP - 169.254.0.11:3128).

To deploy the `azcmagent` on the server, sign-in to the server with an account that has root access. Change to the folder that you copied the script to and execute it on the server by running the ./OnboardingScript.sh script.

If the agent fails to start after setup is finished, check the logs for detailed error information. The log directory is `/var/opt/azcmagent/log`.

After you install the agent and configure it to connect to Azure Arc-enabled servers, verify that the server is successfully connected at [Azure portal](https://aka.ms/hybridmachineportal).

<!--- IMG ![Sample Arc-Enrolled VM](Docs/media/sample-arc-enrolled-vm.png) IMG --->
:::image type="content" source="media/sample-arc-enrolled-vm.png" alt-text="Screenshot of Sample Arc-Enrolled VM.":::


Figure: Sample Arc-Enrolled VM

### Troubleshooting

**Note:** If you see errors while running script, then fix the errors and rerun the script before moving to the next steps.

Some common reasons for errors:

1. You don't have the required permissions on the VM.
2. wget package isn't installed on the VM.
3. If it fails to install package dependencies, it's because proxy doesn't have the required domains added to the allowed URLs. For example, on Ubuntu, apt fails to install dependencies because it can't reach ".ubuntu.com". Add the required egress endpoints to the proxy.

## Azure monitor agent

The Azure Monitor Agent is implemented as an [Azure VM extension](../virtual-machines/extensions/overview.md) 
ver Arc connected Machines. It also lists the options to create [associations with Data Collection Rules](../azure-monitor/agents/data-collection-rule-azure-monitor-agent.md)
that define which data the agent should collect. Installing, upgrading, or uninstalling the Azure Monitor Agent
won't require you to restart your server.

Ensure that you configure collection of logs and metrics using the Data Collection Rule.

<!--- IMG ![DCR adding source](Docs/media/data-collection-rules-adding-source.png) IMG --->
:::image type="content" source="media/data-collection-rules-adding-source.png" alt-text="Screenshot of DCR adding source.":::

Figure: DCR adding source

**Note:** The metrics configured with DCR should have destination set to Log Analytics Workspace as
it's not supported on Azure Monitor Metrics yet.

<!--- IMG ![DCR adding destination](Docs/media/data-collection-rules-adding-destination.png) IMG --->
:::image type="content" source="media/data-collection-rules-adding-destination.png" alt-text="Screenshot of DCR adding destination.":::

Figure: DCR adding destination

### Pre-requisites

The following prerequisites must be met prior to installing the Azure Monitor Agent:

- **Permissions** : For methods other than using the Azure portal, you must have the following role assignments to install the agent:

| **Built-in role** | **Scopes** | **Reason** |
| --- | --- | --- |
|[Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) [Azure Connected Machine Resource Administrator](../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)| Azure Arc-enabled servers | To deploy the agent |
| Any role that includes the action _Microsoft.Resources/deployments/_\* | Subscription and/orResource group and/or | To deploy Azure Resource Manager templates |

### Installing Azure Monitoring Agent

Once, the Virtual Machines are Arc connected, ensure that you create a local file from your [Azure Cloud Shell](../cloud-shell/overview.md) with name "settings.json" to provide the proxy information:

<!--- IMG ![Settings.json file](Docs/media/azure-monitor-agent-settings.png) IMG --->
:::image type="content" source="media/azure-monitor-agent-settings.png" alt-text="Screenshot of Settings.json file.":::

Figure: settings.json file

Then use the following command to install the Azure Monitoring agent on these Azure Arc-enabled servers:

```azurecli
az connectedmachine extension create --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --type AzureMonitorLinuxAgent --machine-name \<arc-server-name\> --resource-group \<resource-group-name\> --location \<arc-server-location\> --type-handler-version "1.21.1" --settings settings.json
```

To collect data from virtual machines by using Azure Monitor Agent, you'll need to:

1. Create [Data Collection Rules (DCRs)](../azure-monitor/essentials/data-collection-rule-overview.md)that define which data Azure Monitor Agent sends to which destinations.

2. Associate the Data Collection Rule to specific Virtual Machines.

#### Data Collection Rule via Portal

The steps to create a DCR and associate it to a Log Analytics Workspace can be found [here](../azure-monitor/agents/data-collection-rule-azure-monitor-agent.md?tabs=portal).

Lastly verify if you're getting the logs in the Log Analytics Workspace specified.

#### Data collection rule via CLI

Following are the commands to create and associate DCR to enable collection of logs and metrics from these Virtual Machines.

**Create DCR:**

```azurecli
az monitor data-collection rule create --name \<name-for-dcr\> --resource-group \<resource-group-name\> --location \<location-for-dcr\> --rule-file \<rules-file\> [--description] [--tags]
```

An example rules-file:

<!--- IMG ![Sample DCR rule file](Docs/media/sample-data-collection-rule.png) IMG --->
:::image type="content" source="media/sample-data-collection-rule.png" alt-text="Screenshot of Sample DCR rule file.":::

**Associate DCR:**

```azurecli
az monitor data-collection rule association create --name \<name-for-dcr-association\> --resource \<connected-machine-resource-id\> --rule-id \<dcr-resource-id\> [--description]
```

## Additional resources

- Review [workbooks documentation](../azure-monitor/visualize/workbooks-overview.md) and then you may use Operator Nexus telemetry [sample Operator Nexus workbooks](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Operator%20Nexus).
- Review [Azure Monitor Alerts](../azure-monitor/alerts/alerts-overview.md), how to create [Azure Monitor Alert rules](../azure-monitor/alerts/alerts-create-new-alert-rule.md?tabs=metric), and use [sample Operator Nexus Alert templates](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Operator%20Nexus).
