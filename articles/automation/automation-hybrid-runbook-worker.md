---
title: Azure Automation Hybrid Runbook Worker Overview
description: Know about Hybrid Runbook Worker. How to install and run the  runbooks on machines in your local datacenter or cloud provider.
services: automation
ms.subservice: process-automation
ms.date: 07/08/2025
ms.topic: overview 
ms.service: azure-automation
ms.author: v-rochak2
author: RochakSingh-blr
---

# Automation Hybrid Runbook Worker overview

[!INCLUDE [./agent-based-user-hybrid-runbook-worker-retirement.md](./includes/agent-based-user-hybrid-runbook-worker-retirement.md)]

Runbooks in Azure Automation might not have access to resources in other clouds or in your on-premises environment because they run on the Azure cloud platform. You can use the Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on the machine hosting the role and against resources in the environment to manage those local resources. Runbooks are stored and managed in Azure Automation and then delivered to one or more assigned machines.

Azure Automation provides native integration of the Hybrid Runbook Worker role through the Azure virtual machine (VM) extension framework, by installing the Hybrid Runbook Worker VM extension. The Azure VM agent is responsible for management of the extension on Azure VMs on Windows and Linux VMs, and [Azure Connected Machine agent](/azure/azure-arc/servers/agent-overview) on Non-Azure machines including [Azure Arc-enabled Servers](/azure/azure-arc/servers/overview) and [Azure Arc-enabled VMware vSphere](/azure/azure-arc/vmware-vsphere/overview). Now there are two Hybrid Runbook Workers installation platforms:
 
| Platform | Description |
|---|---|
|**Extension-based (V2)**  |Installed using the [Hybrid Runbook Worker VM extension](./extension-based-hybrid-runbook-worker-install.md), without any dependency on the Log Analytics agent reporting to an Azure Monitor Log Analytics workspace. **This is the supported platform**.|
|**Agent-based (V1)** - Retired |Installed after the [Log Analytics agent](/azure/azure-monitor/agents/log-analytics-agent) reporting to an Azure Monitor [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-workspace-overview) is completed.|

:::image type="content" source="./media/automation-hybrid-runbook-worker/hybrid-worker-group-platform-inline.png" alt-text="Screenshot of hybrid worker group showing platform field." lightbox="./media/automation-hybrid-runbook-worker/hybrid-worker-group-platform-expanded.png":::

For Hybrid Runbook Worker operations after installation, the process of executing runbooks on Hybrid Runbook Workers is the same. The purpose of the extension-based approach is to simplify the installation and management of the Hybrid Runbook Worker role and remove the complexity working with the agent-based version. The new extension-based installation doesn't affect the installation or management of an agent-based Hybrid Runbook Worker role. Both Hybrid Runbook Worker types can co-exist on the same machine.

## Benefits of extension-based User Hybrid Workers
The extension-based approach greatly simplifies the installation and management of the User Hybrid Runbook Worker, removing the complexity of working with the agent-based approach. Here are some key benefits:
- **Seamless onboarding** – The Agent-based approach for onboarding Hybrid Runbook worker is dependent on the Log Analytics agent, which is a multi-step, time-consuming, and error-prone process. The extension-based approach is no longer dependent on the Log Analytics agent. 
- **Ease of Manageability** – It offers native integration with ARM identity for Hybrid Runbook Worker and provides the flexibility for governance at scale through policies and templates.
- **Microsoft Entra ID based authentication** – It uses a VM system-assigned managed identities provided by Microsoft Entra ID. This centralizes control and management of identities and resource credentials.
- **Unified experience** – It offers an identical experience for managing Azure and off-Azure Arc-enabled machines.
- **Multiple onboarding channels** – You can choose to onboard and manage extension-based workers through the Azure portal, PowerShell cmdlets, Bicep, ARM templates, REST API and Azure CLI. You can also install the extension on an existing Azure VM or Arc-enabled server within the Azure portal experience of that machine through the Extensions blade.
- **Default Automatic upgrade** – It offers Automatic upgrade of minor versions by default, significantly reducing the manageability of staying updated on the latest version. We recommend enabling Automatic upgrades to take advantage of any security or feature updates without the manual overhead. You can also opt out of automatic upgrades at any time. Any major version upgrades are currently not supported and should be managed manually.

## Runbook Worker limits

The following table shows the maximum number of system and user Hybrid Runbook Workers in an Automation account. If you have more than 4,000 machines to manage, we recommend creating another Automation account.

|Worker type| Maximum number supported per Automation Account.|
|---|---|
|System|4000|
|User |4000|

## How does it work?

Each user Hybrid Runbook Worker is a member of a Hybrid Runbook Worker group that you specify when you install the worker. A group can include a single worker, but you can include multiple workers in a group for high availability. Each machine can host one Hybrid Runbook Worker reporting to one Automation account; you can't register the hybrid worker across multiple Automation accounts. A hybrid worker can only listen for jobs from a single Automation account. 

:::image type="content" source="./media/automation-hybrid-runbook-worker/user-hybrid-runbook-worker.png" alt-text="User Hybrid Runbook Worker technical diagram":::

A Hybrid Worker group with Hybrid Runbook Workers is designed for high availability and load balancing by allocating jobs across multiple Workers. For a successful execution of runbooks, Hybrid Workers must be healthy and give a heartbeat. The Hybrid worker works on a polling mechanism to pick up jobs. If none of the Workers within the Hybrid Worker group has pinged Automation service in the last 30 minutes, it implies that the group did not have any active Workers. In this scenario, jobs will get suspended after three retry attempts. 

When you start a runbook on a user Hybrid Runbook Worker, you specify the group it runs on and can't specify a particular worker. Each active Hybrid Worker in the group will poll for jobs every 30 seconds to see if any jobs are available. The worker picks jobs on a first-come, first-serve basis. Depending on when a job was pushed, whichever Hybrid worker within the Hybrid Worker Group pings the Automation service first picks up the job. The processing time of the jobs queue also depends on the Hybrid worker hardware profile and load. 

­­A single hybrid worker can generally pick up 4 jobs per ping (that is, every 30 seconds). If your rate of pushing jobs is higher than 4 per 30 seconds and no other Worker picks up the job, the job might get suspended with an error. 

A Hybrid Runbook Worker doesn't have many of the [Azure sandbox](automation-runbook-execution.md#runbook-execution-environment) resource [limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-automation-limits) on disk space, memory, or network sockets. The limits on a hybrid worker are only related to the worker's own resources, and they aren't constrained by the [fair share](automation-runbook-execution.md#fair-share) time limit that Azure sandboxes have.

To control the distribution of runbooks on Hybrid Runbook Workers and when or how the jobs are triggered, you can register the hybrid worker against different Hybrid Runbook Worker groups within your Automation account. Target the jobs against the specific group or groups in order to support your execution arrangement.

## Common Scenarios for User Hybrid Runbook Workers

- To execute Azure Automation runbooks for in-guest VM management directly on an existing Azure virtual machine (VM) and off-Azure server registered as Azure Arc-enabled server or Azure Arc-enabled VMware VM (preview). Azure Arc-enabled servers can be Windows and Linux physical servers and virtual machines hosted outside of Azure, on your corporate network, or other cloud providers. 
- To overcome the Azure Automation sandbox limitation - the common scenarios include executing long-running operations beyond three-hour limit for cloud jobs, performing resource-intensive automation operations, interacting with local services running on-premises or in hybrid environment, run scripts that require elevated permissions.
- To overcome organization restrictions to keep data in Azure for governance and security reasons - as you cannot execute Automation jobs on the cloud, you can run it on an on-premises machine that is onboarded as a User Hybrid Runbook Worker.
- To automate operations on multiple —Off-Azure resources running on-premises or multicloud environments. You can onboard one of those machines as a User Hybrid Runbook Worker and target automation on the remaining machines in the local environment.
- To access other services privately from the Azure Virtual Network (VNet) without opening an outbound internet connection, you can execute runbooks on a Hybrid Worker connected to the Azure VNet.


## Hybrid Runbook Worker installation

To install, see [Deploy an extension-based Windows or Linux user Hybrid Runbook Worker in Automation](./extension-based-hybrid-runbook-worker-install.md).

|Operating System | Deployment Types |
|- |-|
|Windows/Linux |For user Hybrid Runbook Workers, see [Deploy an extension-based Windows or Linux user Hybrid Runbook Worker in Automation](./extension-based-hybrid-runbook-worker-install.md). This is the recommended method.|

>[!NOTE]
> Hybrid Runbook Worker is currently not supported on Azure Virtual Machine Scale Sets.

## <a name="network-planning"></a>Network planning

Check [Azure Automation Network Configuration](automation-network-configuration.md#network-planning-for-hybrid-runbook-worker) for detailed information on the ports, URLs, and other networking details required for the Hybrid Runbook Worker.

### Service tags

Azure Automation supports Azure virtual network service tags, starting with the service tag [GuestAndHybridManagement](../virtual-network/service-tags-overview.md). You can use service tags to define network access controls on [network security groups](../virtual-network/network-security-groups-overview.md#security-rules) or [Azure Firewall](../firewall/service-tags.md). Service tags can be used in place of specific IP addresses when you create security rules. By specifying the service tag name **GuestAndHybridManagement**  in the appropriate source or destination field of a rule, you can allow or deny the traffic for the Automation service. This service tag doesn't support allowing more granular control by restricting IP ranges to a specific region.

The service tag for the Azure Automation service only provides IPs used for the following scenarios:

* Trigger webhooks from within your virtual network.
* Allow Hybrid Runbook Workers or State Configuration agents on your VNet to communicate with the Automation service.

>[!NOTE]
>The service tag **GuestAndHybridManagement** currently doesn't support runbook job execution in an Azure sandbox, only directly on a Hybrid Runbook Worker.

## Support for Impact Level 5 (IL5)

Azure Automation Hybrid Runbook Worker can be used in Azure Government to support Impact Level 5 workloads in either of the following two configurations:

* [Isolated virtual machine](../azure-government/documentation-government-impact-level-5.md#isolated-virtual-machines). When deployed, they consume the entire physical host for that machine providing the necessary level of isolation required to support IL5 workloads.

* [Azure Dedicated Hosts](../azure-government/documentation-government-impact-level-5.md#azure-dedicated-host), which provides physical servers that are able to host one or more virtual machines, dedicated to one Azure subscription.

>[!NOTE]
>Compute isolation through the Hybrid Runbook Worker role is available for Azure Commercial and US Government clouds.

## Runbooks on a Hybrid Runbook Worker

You might have runbooks that manage resources on the local machine or run against resources in the local environment where a user Hybrid Runbook Worker is deployed. In this case, you can choose to run your runbooks on the hybrid worker instead of in an Automation account. Runbooks run on a Hybrid Runbook Worker are identical in structure to those that you run in the Automation account. See [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

### Hybrid Runbook Worker jobs

Hybrid Runbook Worker jobs run under the local **System** account on Windows or the nxautomation account on Linux. Azure Automation handles jobs on Hybrid Runbook Workers differently from jobs run in Azure sandboxes. See [Runbook execution environment](automation-runbook-execution.md#runbook-execution-environment).

If the Hybrid Runbook Worker host machine reboots, any running runbook job restarts from the beginning, or from the last checkpoint for PowerShell Workflow runbooks. After a runbook job is restarted more than three times, it's suspended.

### Runbook permissions for a Hybrid Runbook Worker

Since they access non-Azure resources, runbooks running on a user Hybrid Runbook Worker can't use the authentication mechanism typically used by runbooks authenticating to Azure resources. A runbook either provides its own authentication to local resources, or configures authentication using [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-arm.md#grant-your-vm-access-to-a-resource-group-in-resource-manager). You can also specify a Run As account to provide a user context for all runbooks.

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues](troubleshoot/extension-based-hybrid-runbook-worker.md).
