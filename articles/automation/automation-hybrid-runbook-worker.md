---
title: Azure Automation Hybrid Runbook Worker overview
description: Know about Hybrid Runbook Worker. How to install and run the  runbooks on machines in your local datacenter or cloud provider.
services: automation
ms.subservice: process-automation
ms.date: 09/17/2023
ms.topic: conceptual 
---

# Automation Hybrid Runbook Worker overview

> [!IMPORTANT]
>  Azure Automation Agent-based User Hybrid Runbook Worker (Windows and Linux) will retire on **31 August 2024** and wouldn't be supported after that date. You must complete migrating existing Agent-based User Hybrid Runbook Workers to Extension-based Workers before 31 August 2024. Moreover, starting **1 November 2023**, creating new Agent-based Hybrid Workers wouldn't be possible. [Learn more](migrate-existing-agent-based-hybrid-worker-to-extension-based-workers.md).

Runbooks in Azure Automation might not have access to resources in other clouds or in your on-premises environment because they run on the Azure cloud platform. You can use the Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on the machine hosting the role and against resources in the environment to manage those local resources. Runbooks are stored and managed in Azure Automation and then delivered to one or more assigned machines.

Azure Automation provides native integration of the Hybrid Runbook Worker role through the Azure virtual machine (VM) extension framework. The Azure VM agent is responsible for management of the extension on Azure VMs on Windows and Linux VMs, and [Azure Connected Machine agent](../azure-arc/servers/agent-overview.md) on Non-Azure machines including [Azure Arc-enabled Servers](../azure-arc/servers/overview.md) and [Azure Arc-enabled VMware vSphere (preview)](../azure-arc/vmware-vsphere/overview.md). Now there are two Hybrid Runbook Workers installation platforms supported by Azure Automation.
 
| Platform | Description |
|---|---|
|**Extension-based (V2)**  |Installed using the [Hybrid Runbook Worker VM extension](./extension-based-hybrid-runbook-worker-install.md), without any dependency on the Log Analytics agent reporting to an Azure Monitor Log Analytics workspace. **This is the recommended platform**.|
|**Agent-based (V1)** |Installed after the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) reporting to an Azure Monitor [Log Analytics workspace](../azure-monitor/logs/log-analytics-workspace-overview.md) is completed.|

:::image type="content" source="./media/automation-hybrid-runbook-worker/hybrid-worker-group-platform-inline.png" alt-text="Screenshot of hybrid worker group showing platform field." lightbox="./media/automation-hybrid-runbook-worker/hybrid-worker-group-platform-expanded.png":::

For Hybrid Runbook Worker operations after installation, the process of executing runbooks on Hybrid Runbook Workers is the same. The purpose of the extension-based approach is to simplify the installation and management of the Hybrid Runbook Worker role and remove the complexity working with the agent-based version. The new extension-based installation doesn't affect the installation or management of an agent-based Hybrid Runbook Worker role. Both Hybrid Runbook Worker types can co-exist on the same machine.

The extension-based Hybrid Runbook Worker only supports the user Hybrid Runbook Worker type, and doesn't include the system Hybrid Runbook Worker required for the Update Management feature.

## Benefits of extension-based User Hybrid Workers
The extension-based approach greatly simplifies the installation and management of the User Hybrid Runbook Worker, removing the complexity of working with the agent-based approach. Here are some key benefits:
- **Seamless onboarding** – The Agent-based approach for onboarding Hybrid Runbook worker is dependent on the Log Analytics agent, which is a multi-step, time-consuming, and error-prone process. The extension-based approach is no longer dependent on the Log Analytics agent. 
- **Ease of Manageability** – It offers native integration with ARM identity for Hybrid Runbook Worker and provides the flexibility for governance at scale through policies and templates.
- **Microsoft Entra ID based authentication** – It uses a VM system-assigned managed identities provided by Microsoft Entra ID. This centralizes control and management of identities and resource credentials.
- **Unified experience** – It offers an identical experience for managing Azure and off-Azure Arc-enabled machines.
- **Multiple onboarding channels** – You can choose to onboard and manage extension-based workers through the Azure portal, PowerShell cmdlets, Bicep, ARM templates, REST API and Azure CLI. You can also install the extension on an existing Azure VM or Arc-enabled server within the Azure portal experience of that machine through the Extensions blade.
- **Default Automatic upgrade** – It offers Automatic upgrade of minor versions by default, significantly reducing the manageability of staying updated on the latest version. We recommend enabling Automatic upgrades to take advantage of any security or feature updates without the manual overhead. You can also opt out of automatic upgrades at any time. Any major version upgrades are currently not supported and should be managed manually.

## Runbook Worker types

There are two types of Runbook Workers - system and user. The following table describes the difference between them.

|Type | Description |
|-----|-------------|
|**System** |Supports a set of hidden runbooks used by the Update Management feature that are designed to install user-specified updates on Windows and Linux machines.<br> This type of Hybrid Runbook Worker isn't a member of a Hybrid Runbook Worker group, and therefore doesn't run runbooks that target a Runbook Worker group. |
|**User** |Supports user-defined runbooks intended to run directly on the Windows and Linux machines. |

Agent-based (V1) Hybrid Runbook Workers rely on the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) reporting to an Azure Monitor [Log Analytics workspace](../azure-monitor/logs/log-analytics-workspace-overview.md). The workspace isn't only to collect monitoring data from the machine, but also to download the components required to install the agent-based Hybrid Runbook Worker.

When Azure Automation [Update Management](./update-management/overview.md) is enabled, any machine connected to your Log Analytics workspace is automatically configured as a system Hybrid Runbook Worker. To configure it as a user Windows Hybrid Runbook Worker, see [Deploy an agent-based Windows Hybrid Runbook Worker in Automation](automation-windows-hrw-install.md) and for Linux, see [Deploy an agent-based Linux Hybrid Runbook Worker in Automation](./automation-linux-hrw-install.md).

## Runbook Worker limits

The following table shows the maximum number of system and user Hybrid Runbook Workers in an Automation account. If you have more than 4,000 machines to manage, we recommend creating another Automation account.

|Worker type| Maximum number supported per Automation Account.|
|---|---|
|System|4000|
|User |4000|

## How does it work?

Each user Hybrid Runbook Worker is a member of a Hybrid Runbook Worker group that you specify when you install the worker. A group can include a single worker, but you can include multiple workers in a group for high availability. Each machine can host one Hybrid Runbook Worker reporting to one Automation account; you can't register the hybrid worker across multiple Automation accounts. A hybrid worker can only listen for jobs from a single Automation account. 

:::image type="content" source="./media/automation-hybrid-runbook-worker/user-hybrid-runbook-worker.png" alt-text="User Hybrid Runbook Worker technical diagram":::

For machines hosting the system Hybrid Runbook worker managed by Update Management, they can be added to a Hybrid Runbook Worker group. But you must use the same Automation account for both Update Management and the Hybrid Runbook Worker group membership.

:::image type="content" source="./media/automation-hybrid-runbook-worker/system-hybrid-runbook-worker.png" alt-text="System Hybrid Runbook Worker technical diagram":::

A Hybrid Worker group with Hybrid Runbook Workers is designed for high availability and load balancing by allocating jobs across multiple Workers. For a successful execution of runbooks, Hybrid Workers must be healthy and give a heartbeat. The Hybrid worker works on a polling mechanism to pick up jobs. If none of the Workers within the Hybrid Worker group has pinged Automation service in the last 30 minutes, it implies that the group did not have any active Workers. In this scenario, jobs will get suspended after three retry attempts. 

When you start a runbook on a user Hybrid Runbook Worker, you specify the group it runs on and can't specify a particular worker. Each active Hybrid Worker in the group will poll for jobs every 30 seconds to see if any jobs are available. The worker picks jobs on a first-come, first-serve basis. Depending on when a job was pushed, whichever Hybrid worker within the Hybrid Worker Group pings the Automation service first picks up the job. The processing time of the jobs queue also depends on the Hybrid worker hardware profile and load. 

­­A single hybrid worker can generally pick up 4 jobs per ping (that is, every 30 seconds). If your rate of pushing jobs is higher than 4 per 30 seconds and no other Worker picks up the job, the job might get suspended with an error. 

A Hybrid Runbook Worker doesn't have many of the [Azure sandbox](automation-runbook-execution.md#runbook-execution-environment) resource [limits](../azure-resource-manager/management/azure-subscription-service-limits.md#automation-limits) on disk space, memory, or network sockets. The limits on a hybrid worker are only related to the worker's own resources, and they aren't constrained by the [fair share](automation-runbook-execution.md#fair-share) time limit that Azure sandboxes have.

To control the distribution of runbooks on Hybrid Runbook Workers and when or how the jobs are triggered, you can register the hybrid worker against different Hybrid Runbook Worker groups within your Automation account. Target the jobs against the specific group or groups in order to support your execution arrangement.

## Common Scenarios for User Hybrid Runbook Workers

- To execute Azure Automation runbooks for in-guest VM management directly on an existing Azure virtual machine (VM) and off-Azure server registered as Azure Arc-enabled server or Azure Arc-enabled VMware VM (preview). Azure Arc-enabled servers can be Windows and Linux physical servers and virtual machines hosted outside of Azure, on your corporate network, or other cloud providers. 
- To overcome the Azure Automation sandbox limitation - the common scenarios include executing long-running operations beyond three-hour limit for cloud jobs, performing resource-intensive automation operations, interacting with local services running on-premises or in hybrid environment, run scripts that require elevated permissions.
- To overcome organization restrictions to keep data in Azure for governance and security reasons - as you cannot execute Automation jobs on the cloud, you can run it on an on-premises machine that is onboarded as a User Hybrid Runbook Worker.
- To automate operations on multiple —Off-Azure resources running on-premises or multicloud environments. You can onboard one of those machines as a User Hybrid Runbook Worker and target automation on the remaining machines in the local environment.
- To access other services privately from the Azure Virtual Network (VNet) without opening an outbound internet connection, you can execute runbooks on a Hybrid Worker connected to the Azure VNet.


## Hybrid Runbook Worker installation

The process to install a user Hybrid Runbook Worker depends on the operating system. The table below defines the deployment types.

|Operating System  |Deployment Types  |
|---------|---------|
|Windows | [Automated](automation-windows-hrw-install.md#automated-deployment)<br>[Manual](automation-windows-hrw-install.md#manual-deployment). |
|Linux   | [Manual](automation-linux-hrw-install.md#install-a-linux-hybrid-runbook-worker) |
|Either  | For user Hybrid Runbook Workers, see [Deploy an extension-based Windows or Linux user Hybrid Runbook Worker in Automation](./extension-based-hybrid-runbook-worker-install.md). This is the recommended method. |

>[!NOTE]
> Hybrid Runbook Worker is currently not supported on VM Scale Sets.

## <a name="network-planning"></a>Network planning

Check [Azure Automation Network Configuration](automation-network-configuration.md#network-planning-for-hybrid-runbook-worker) for detailed information on the ports, URLs, and other networking details required for the Hybrid Runbook Worker.

### Proxy server use

If you use a proxy server for communication between Azure Automation and machines running the Log Analytics agent, ensure that the appropriate resources are accessible. The timeout for requests from the Hybrid Runbook Worker and Automation services is 30 seconds. After three attempts, a request fails.

### Firewall use

If you use a firewall to restrict access to the Internet, you must configure the firewall to permit access. If using the Log Analytics gateway as a proxy, ensure that it's configured for Hybrid Runbook Workers. See [Configure the Log Analytics gateway for Automation Hybrid Runbook Workers](../azure-monitor/agents/gateway.md).

### Service tags

Azure Automation supports Azure virtual network service tags, starting with the service tag [GuestAndHybridManagement](../virtual-network/service-tags-overview.md). You can use service tags to define network access controls on [network security groups](../virtual-network/network-security-groups-overview.md#security-rules) or [Azure Firewall](../firewall/service-tags.md). Service tags can be used in place of specific IP addresses when you create security rules. By specifying the service tag name **GuestAndHybridManagement**  in the appropriate source or destination field of a rule, you can allow or deny the traffic for the Automation service. This service tag doesn't support allowing more granular control by restricting IP ranges to a specific region.

The service tag for the Azure Automation service only provides IPs used for the following scenarios:

* Trigger webhooks from within your virtual network
* Allow Hybrid Runbook Workers or State Configuration agents on your VNet to communicate with the Automation service

>[!NOTE]
>The service tag **GuestAndHybridManagement** currently doesn't support runbook job execution in an Azure sandbox, only directly on a Hybrid Runbook Worker.

## Support for Impact Level 5 (IL5)

Azure Automation Hybrid Runbook Worker can be used in Azure Government to support Impact Level 5 workloads in either of the following two configurations:

* [Isolated virtual machine](../azure-government/documentation-government-impact-level-5.md#isolated-virtual-machines). When deployed, they consume the entire physical host for that machine providing the necessary level of isolation required to support IL5 workloads.

* [Azure Dedicated Hosts](../azure-government/documentation-government-impact-level-5.md#azure-dedicated-host), which provides physical servers that are able to host one or more virtual machines, dedicated to one Azure subscription.

>[!NOTE]
>Compute isolation through the Hybrid Runbook Worker role is available for Azure Commercial and US Government clouds.

### Update Management addresses for Hybrid Runbook Worker

In addition to the standard addresses and ports required for the Hybrid Runbook Worker, Update Management has other network configuration requirements described under the [network planning](./update-management/plan-deployment.md#ports) section.

## Azure Automation State Configuration on a Hybrid Runbook Worker

You can run [Azure Automation State Configuration](automation-dsc-overview.md) on a Hybrid Runbook Worker. To manage the configuration of servers that support the Hybrid Runbook Worker, you must add the servers as DSC nodes. See [Enable machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md).

## Runbooks on a Hybrid Runbook Worker

You might have runbooks that manage resources on the local machine or run against resources in the local environment where a user Hybrid Runbook Worker is deployed. In this case, you can choose to run your runbooks on the hybrid worker instead of in an Automation account. Runbooks run on a Hybrid Runbook Worker are identical in structure to those that you run in the Automation account. See [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

### Hybrid Runbook Worker jobs

Hybrid Runbook Worker jobs run under the local **System** account on Windows or the [nxautomation account](automation-runbook-execution.md#log-analytics-agent-for-linux) on Linux. Azure Automation handles jobs on Hybrid Runbook Workers differently from jobs run in Azure sandboxes. See [Runbook execution environment](automation-runbook-execution.md#runbook-execution-environment).

If the Hybrid Runbook Worker host machine reboots, any running runbook job restarts from the beginning, or from the last checkpoint for PowerShell Workflow runbooks. After a runbook job is restarted more than three times, it's suspended.

### Runbook permissions for a Hybrid Runbook Worker

Since they access non-Azure resources, runbooks running on a user Hybrid Runbook Worker can't use the authentication mechanism typically used by runbooks authenticating to Azure resources. A runbook either provides its own authentication to local resources, or configures authentication using [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-arm.md#grant-your-vm-access-to-a-resource-group-in-resource-manager). You can also specify a Run As account to provide a user context for all runbooks.

## View system Hybrid Runbook Workers

After the Update Management feature is enabled on Windows or Linux machines, you can inventory the list of system Hybrid Runbook Workers group in the Azure portal. You can view up to 2,000 workers in the portal by selecting the tab **System hybrid workers group** from the option **Hybrid workers group** from the left-hand pane for the selected Automation account.

:::image type="content" source="./media/automation-hybrid-runbook-worker/system-hybrid-workers-page.png" alt-text="Automation account system hybrid worker groups page" border="false" lightbox="./media/automation-hybrid-runbook-worker/system-hybrid-workers-page.png":::

If you have more than 2,000 hybrid workers, to get a list of all of them, you can run the following PowerShell script:

```powershell
"Get-AzSubscription -SubscriptionName "<subscriptionName>" | Set-AzContext
$workersList = (Get-AzAutomationHybridWorkerGroup -ResourceGroupName "<resourceGroupName>" -AutomationAccountName "<automationAccountName>").Runbookworker
$workersList | export-csv -Path "<Path>\output.csv" -NoClobber -NoTypeInformation"
```

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues](troubleshoot/hybrid-runbook-worker.md#general).
