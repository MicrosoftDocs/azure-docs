---
title: Overview of Hybrid Runbook Worker in Azure Automation
description: This article provides an overview of the Hybrid Runbook Worker, which is a feature of Azure Automation that you can use to run runbooks on machines in your local datacenter or cloud provider.
services: automation
ms.subservice: process-automation
ms.date: 04/05/2019
ms.topic: conceptual
---
# Hybrid Runbook Worker overview

Runbooks in Azure Automation might not have access to resources in other clouds or in your on-premises environment because they run on the Azure cloud platform. You can use the Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on the computer that's hosting the role and against resources in the environment to manage those local resources. Runbooks are stored and managed in Azure Automation and then delivered to one or more assigned computers.

The following image illustrates this functionality:

![Hybrid Runbook Worker overview](media/automation-hybrid-runbook-worker/automation.png)

Each Hybrid Runbook Worker is a member of a Hybrid Runbook Worker group that you specify when you install the agent. A group can include a single agent, but you can install multiple agents in a group for high availability. Each machine can host one hybrid worker reporting to one Automation account.

When you start a runbook on a Hybrid Runbook Worker, you specify the group that it runs on. Each worker in the group polls Azure Automation to see if any jobs are available. If a job is available, the first worker to get the job takes it. The processing time of the jobs queue depends on the Hybrid worker hardware profile and load. You can't specify a particular worker. Hybrid Runbook Workers don't share many of the limits that Azure sandboxes have. They don't have the same limits on disk space, memory, or network sockets. Hybrid Runbook Workers are only limited by the resources on the Hybrid Runbook Worker itself. In addition, Hybrid Runbook Workers do not share the 180-minute [fair share](automation-runbook-execution.md#fair-share) time limit that Azure sandboxes have. To learn more about the service limits for Azure sandboxes and Hybrid Runbook Workers, see the job [limits](../azure-resource-manager/management/azure-subscription-service-limits.md#automation-limits).

## Installation of a Hybrid Runbook Worker

The process to install a Hybrid Runbook Worker depends on the operating system. The table below defines the deployment types.

|OS  |Deployment types  |
|---------|---------|
|Windows     | [PowerShell](automation-windows-hrw-install.md#automated-deployment)<br>[Manual](automation-windows-hrw-install.md#manual-deployment)        |
|Linux     | [Python](automation-linux-hrw-install.md#install-a-linux-hybrid-runbook-worker)        |

The recommended installation method is to use an Automation runbook to completely automate the process of configuring a Windows computer. The second method is to follow a step-by-step procedure to manually install and configure the role. For Linux machines, you run a Python script to install the agent on the machine.

> [!NOTE]
> To manage the configuration of your servers that support the Hybrid Runbook Worker role with State Configuration (DSC), you need to add the servers as DSC nodes. For more information about onboarding, see [Onboard machines for management by State Configuration (DSC)](automation-dsc-onboarding.md).

If you enable [Update Management](automation-update-management.md), any computer that's connected to your Azure Log Analytics workspace is automatically configured as a Hybrid Runbook Worker to support runbooks included for update management. However, the computer is not registered with any Hybrid Runbook Worker groups already defined in your Automation account. 

You can add the computer to a Hybrid Runbook Worker group in your Automation account to support Automation runbooks, as long as you're using the same account for both Update Management and the Hybrid Runbook Worker group membership. This functionality was added to version 7.2.12024.0 of Hybrid Runbook Worker.

When you're familiar with the information in this topic, it's time to deploy the Hybrid Runbook Worker in your environment. For a Windows Hybrid Runbook Worker, see [Deploy a Windows Hybrid Runbook Worker](automation-windows-hrw-install.md). For a Linux worker, see [Deploy a Linux Hybrid Runbook Worker](automation-linux-hrw-install.md).

## <a name="network-planning"></a>Network configuration

### Hybrid Worker role

For the Hybrid Runbook Worker to connect to and register with Azure Automation, it must have access to the port number and the URLs that are described in this section. This access is on top to the [ports and URLs required for Log Analytics agent](../azure-monitor/platform/agent-windows.md) to connect to Azure Monitor logs.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

If you use a proxy server for communication between the agent and the Azure Automation service, ensure that the appropriate resources are accessible. The timeout for requests from the Hybrid Runbook Worker and the Automation services is 30 seconds. After 3 attempts the request will fail. If you use a firewall to restrict access to the internet, you must configure your firewall to permit access. If you use the Log Analytics gateway as a proxy, ensure it is configured for hybrid workers. For instructions on how to do this, see [Configure the Log Analytics gateway for Automation Hybrid Workers](https://docs.microsoft.com/azure/log-analytics/log-analytics-oms-gateway).

The following port and URLs are required for the Hybrid Runbook Worker role to communicate with Automation:

* Port: Only TCP 443 is required for outbound internet access.
* Global URL: *.azure-automation.net
* Global URL of US Gov Virginia: *.azure-automation.us
* Agent service: https://\<workspaceId\>.agentsvc.azure-automation.net

It's recommended to use the addresses listed when defining exceptions. For IP addresses, you can download the [Microsoft Azure Datacenter IP Ranges](https://www.microsoft.com/en-us/download/details.aspx?id=56519). This file is updated weekly, and has the currently deployed ranges and any upcoming changes to the IP ranges.

If you have an Automation account that's defined for a specific region, you can restrict communication to that regional datacenter. The following table provides the DNS record for each region:

| **Region** | **DNS record** |
| --- | --- |
| West Central US | wcus-jobruntimedata-prod-su1.azure-automation.net</br>wcus-agentservice-prod-1.azure-automation.net |
| South Central US |scus-jobruntimedata-prod-su1.azure-automation.net</br>scus-agentservice-prod-1.azure-automation.net |
| East US 2 |eus2-jobruntimedata-prod-su1.azure-automation.net</br>eus2-agentservice-prod-1.azure-automation.net |
| West US 2 |wus2-jobruntimedata-prod-su1.azure-automation.net</br>wus2-agentservice-prod-1.azure-automation.net |
| Canada Central |cc-jobruntimedata-prod-su1.azure-automation.net</br>cc-agentservice-prod-1.azure-automation.net |
| West Europe |we-jobruntimedata-prod-su1.azure-automation.net</br>we-agentservice-prod-1.azure-automation.net |
| North Europe |ne-jobruntimedata-prod-su1.azure-automation.net</br>ne-agentservice-prod-1.azure-automation.net |
| South East Asia |sea-jobruntimedata-prod-su1.azure-automation.net</br>sea-agentservice-prod-1.azure-automation.net|
| Central India |cid-jobruntimedata-prod-su1.azure-automation.net</br>cid-agentservice-prod-1.azure-automation.net |
| Japan East |jpe-jobruntimedata-prod-su1.azure-automation.net</br>jpe-agentservice-prod-1.azure-automation.net |
| Australia Central |ac-jobruntimedata-prod-su1.azure-automation.net</br>ac-agentservice-prod-1.azure-automation.net |
| Australia East |ae-jobruntimedata-prod-su1.azure-automation.net</br>ae-agentservice-prod-1.azure-automation.net |
| Australia South East |ase-jobruntimedata-prod-su1.azure-automation.net</br>ase-agentservice-prod-1.azure-automation.net |
| UK South | uks-jobruntimedata-prod-su1.azure-automation.net</br>uks-agentservice-prod-1.azure-automation.net |
| US Gov Virginia | usge-jobruntimedata-prod-su1.azure-automation.us<br>usge-agentservice-prod-1.azure-automation.us |

For a list of region IP addresses instead of region names, download the [Azure Datacenter IP address](https://www.microsoft.com/download/details.aspx?id=41653) XML file from the Microsoft Download Center.

The Azure Datacenter IP address XML file lists the IP address ranges that are used in the Microsoft Azure datacenters. The file includes compute, SQL, and storage ranges.

An updated file is posted weekly. The file reflects the currently deployed ranges and any upcoming changes to the IP ranges. New ranges that appear in the file aren't used in the datacenters for at least one week.

It's a good idea to download the new XML file every week. Then, update your site to correctly identify services running in Azure. Azure ExpressRoute users should note that this file is used to update the Border Gateway Protocol (BGP) advertisement of Azure space in the first week of each month.

## Update Management addresses for Hybrid Runbook Worker

On top of the standard addresses and ports that the Hybrid Runbook Worker requires, the following addresses are required specifically for Update Management. Communication to these addresses is done over port 443.

|Azure Public  |Azure Government  |
|---------|---------|
|*.ods.opinsights.azure.com     | *.ods.opinsights.azure.us         |
|*.oms.opinsights.azure.com     | *.oms.opinsights.azure.us        |
|*.blob.core.windows.net | *.blob.core.usgovcloudapi.net|

## Running runbooks on a Hybrid Runbook Worker

You might have runbooks that manage resources on the local computer or run against resources in the local environment where a Hybrid Runbook Worker is deployed. In this case, you can choose to run your runbooks on the hybrid worker instead of in an Automation account. Runbooks run on a Hybrid Runbook Worker are identical in structure to those that you run in the Automation account. See [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

### Hybrid Runbook Worker jobs

Hybrid Runbook Worker jobs run under the local **System** account on Windows or the **nxautomation** account on Linux. Azure Automation handles jobs on Hybrid Runbook Workers somewhat differently from jobs run in Azure sandboxes. One key difference is that there's no limit on job duration on the runbook workers. Runbooks run in Azure sandboxes are limited to three hours because of [fair share](automation-runbook-execution.md#fair-share).

If the Hybrid Runbook Worker host machine reboots, any running runbook job restarts from the beginning, or from the last checkpoint for PowerShell Workflow runbooks. After a runbook job is restarted more than three times, it is suspended.

### Runbook permissions for a Hybrid Runbook Worker

Since they access non-Azure resources, runbooks running on a Hybrid Runbook Worker can't use the authentication mechanism typically used by runbooks authenticating to Azure resources. A runbook either provides its own authentication to local resources, or configures authentication using [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-arm.md#grant-your-vm-access-to-a-resource-group-in-resource-manager). You can also specify a Run As account to provide a user context for all runbooks.

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).
* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshooting Hybrid Runbook Workers](troubleshoot/hybrid-runbook-worker.md#general).