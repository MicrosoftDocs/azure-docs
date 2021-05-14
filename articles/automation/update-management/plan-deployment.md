---
title: Azure Automation Update Management Deployment Plan
description: This article describes the considerations and decisions to be made to prepare deployment of Azure Automation Update Management.
services: automation
ms.subservice: update-management
ms.date: 05/13/2021
ms.topic: conceptual
---

# Plan your Update Management deployment

## Step 1 - Automation account

Update Management is an Azure Automation feature, and therefore requires an Automation account. You can use an existing Automation account in your subscription, or create a new account dedicated only for Update Management and no other Automation features.

## Step 2 - Azure Monitor Logs

Update Management depends on a Log Analytics workspace to store the collected assessment and update status log data from the managed machines, which also enables detailed analysis and alerts in Azure Monitor. If you are new to Azure Monitor Logs and the Log Analytics workspace, you should review the [Design a Log Analytics workspace](../../azure-monitor/logs/design-logs-deployment.md) deployment guide. 

## Step 3 - Log Analytics agent

The Log Analytics agent for Windows and Linux is required to support Update Management. On Azure VMs, if it isn't already installed, when you enable Update Management for the VM, it is automatically installed and configured. 

## <a name="ports"></a> Step 4 - Network planning

To prepare your network to support Update Management, you may need to configure some infrastructure components. For example, open firewall ports to pass the communications used by Update Management and Azure Monitor.

Review [Azure Automation Network Configuration](../automation-network-configuration.md) for detailed information on the ports, URLs, and other networking details required for Update Management. To connect to the Automation service from your Azure VMs securely and privately, review [Use Azure Private Link](../how-to/private-link-security.md). 

For Windows machines, you must also allow traffic to any endpoints required by Windows Update agent. You can find an updated list of required endpoints in [Issues related to HTTP/Proxy](/windows/deployment/update/windows-update-troubleshooting#issues-related-to-httpproxy). If you have a local [Windows Server Update Services](/windows-server/administration/windows-server-update-services/plan/plan-your-wsus-deployment) deployment, you must also allow traffic to the server specified in your [WSUS key](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry).

For Red Hat Linux machines, see [IPs for the RHUI content delivery servers](../../virtual-machines/workloads/redhat/redhat-rhui.md#the-ips-for-the-rhui-content-delivery-servers) for required endpoints. For other Linux distributions, see your provider documentation.

For information about ports required for the Hybrid Runbook Worker, see [Update Management addresses for Hybrid Runbook Worker](../automation-hybrid-runbook-worker.md#update-management-addresses-for-hybrid-runbook-worker).

If your IT security policies do not allow machines on the network to connect to the internet, you can set up a [Log Analytics gateway](../../azure-monitor/agents/gateway.md) and then configure the machine to connect through the gateway to Azure Automation and Azure Monitor.

## Step 5 - 

## Enable Update Management

Here are the ways that you can enable Update Management and select machines to be managed:

- Using an Azure [Resource Manager template](enable-from-template.md) to deploy Update Management to a new or existing Automation account and Azure Monitor Log Analytics workspace in your subscription. It does not configure the scope of machines that should be managed, this is performed as a separate step after using the template.

- From your [Automation account](enable-from-automation-account.md) for one or more Azure and non-Azure machines, including Arc enabled servers.

- Using the **Enable-AutomationSolution** [runbook](enable-from-runbook.md) method.

- For a [selected Azure VM](enable-from-vm.md) from the **Virtual machines** page in the Azure portal. This scenario is available for Linux and Windows VMs.

- For [multiple Azure VMs](enable-from-portal.md) by selecting them from the **Virtual machines** page in the Azure portal.

> [!NOTE]
> Update Management requires linking a Log Analytics workspace to your Automation account. For a definitive list of supported regions, see [Azure Workspace mappings](../how-to/region-mappings.md). The region mappings don't affect the ability to manage VMs in a separate region from your Automation account.