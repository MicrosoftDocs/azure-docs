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

The Log Analytics agent for Windows and Linux is required to support Update Management for both data collection, and the Automation system Hybrid Runbook Worker role to support Update Management runbooks used to manage the assessment and update deployments on the machine. 

On Azure VMs, if the Log Analytics agent isn't already installed, when you enable Update Management for the VM, it is automatically installed and configured to report to the Log Analytics workspace linked to the Automation account Update Management is enabled in. 

Non-Azure VMs or servers need to have the Log Analytics agent for Windows or Linux installed and reporting to the workspace linked to the Automation account Update Management is enabled in. We recommend installing the Log Analytics agent for Windows or Linux by first connecting your machine to [Azure Arc enabled servers](../../azure-arc/servers/overview.md), and then use Azure Policy to assign the [Deploy Log Analytics agent to Linux or Windows Azure Arc machines](../../governance/policy/samples/built-in-policies.md#monitoring) built-in policy. Alternatively, if you plan to monitor the machines with [VM insights](../../azure-monitor/vm/vminsights-overview.md), instead use the [Enable Azure Monitor for VMs](../../governance/policy/samples/built-in-initiatives.md#monitoring) initiative.

If you're enabling a machine that's currently managed by Operations Manager, a new agent isn't required. The workspace information is added to the agents configuration when you connect the management group to the Log Analytics workspace.

Having a machine registered for Update Management in more than one Log Analytics workspace (also referred to as multihoming) isn't supported.

## <a name="ports"></a> Step 4 - Network planning

To prepare your network to support Update Management, you may need to configure some infrastructure components. For example, open firewall ports to pass the communications used by Update Management and Azure Monitor.

Review [Azure Automation Network Configuration](../automation-network-configuration.md) for detailed information on the ports, URLs, and other networking details required for Update Management, including the Hybrid Runbook Worker role. To connect to the Automation service from your Azure VMs securely and privately, review [Use Azure Private Link](../how-to/private-link-security.md). 

For Windows machines, you must also allow traffic to any endpoints required by Windows Update agent. You can find an updated list of required endpoints in [Issues related to HTTP/Proxy](/windows/deployment/update/windows-update-troubleshooting#issues-related-to-httpproxy). If you have a local [Windows Server Update Services](/windows-server/administration/windows-server-update-services/plan/plan-your-wsus-deployment) deployment, you must also allow traffic to the server specified in your [WSUS key](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry).

For Red Hat Linux machines, see [IPs for the RHUI content delivery servers](../../virtual-machines/workloads/redhat/redhat-rhui.md#the-ips-for-the-rhui-content-delivery-servers) for required endpoints. For other Linux distributions, see your provider documentation.

If your IT security policies do not allow machines on the network to connect to the internet, you can set up a [Log Analytics gateway](../../azure-monitor/agents/gateway.md) and then configure the machine to connect through the gateway to Azure Automation and Azure Monitor.

## Step 5 - Permissions

To create and manage update deployments, you need specific permissions. To learn about these permissions, see [Role-based access - Update Management](../automation-role-based-access-control.md#update-management-permissions).

## Step 6 - Windows Update client

Azure Automation Update Management relies on the Windows Update client to download and install Windows updates. There are specific group policy settings that are used by Windows Update Agent (WUA) on machines to connect to Windows Server Update Services (WSUS) or Microsoft Update. These group policy settings are also used to successfully scan for software update compliance, and to automatically update the software updates. To review our recommendations, see [Configure Windows Update settings for Update Management](configure-wuagent.md).

## Step 7 - Plan deployment targets

Update Management allows you to target updates to a dynamic group representing Azure or non-Azure machines, so you can ensure that specific machines always get the right updates at the most convenient times. A dynamic group is resolved at deployment time and is based on the following criteria:

* Subscription
* Resource groups
* Locations
* Tags 

For non-Azure machines, a dynamic group uses saved searches, also called [computer groups](../../azure-monitor/logs/computer-groups.md). Update deployments scoped to a group of machines is only visible from the Automation account in the Update Management **Deployment schedules** option, not from a specific Azure VM.

Alternatively, updates can be managed only for a selected Azure VM. Update deployments scoped to the specific machine are visible from both the machine and from the Automation account in Update Management **Deployment schedules** option. 

## Next steps

Enable Update Management and select machines to be managed using one of the following methods:

- Using an Azure [Resource Manager template](enable-from-template.md) to deploy Update Management to a new or existing Automation account and Azure Monitor Log Analytics workspace in your subscription. It does not configure the scope of machines that should be managed, this is performed as a separate step after using the template.

- From your [Automation account](enable-from-automation-account.md) for one or more Azure and non-Azure machines, including Arc enabled servers.

- Using the **Enable-AutomationSolution** [runbook](enable-from-runbook.md) method.

- For a [selected Azure VM](enable-from-vm.md) from the **Virtual machines** page in the Azure portal. This scenario is available for Linux and Windows VMs.

- For [multiple Azure VMs](enable-from-portal.md) by selecting them from the **Virtual machines** page in the Azure portal.