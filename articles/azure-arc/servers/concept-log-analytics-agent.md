---
title: Deploy the Log Analytics agent on Azure Arc-enabled servers
description: This article tells how to deploy the Log Analytics agent on Windows and Linux-based machines registered with Azure Arc-enabled servers in your local datacenter or other cloud environment.
ms.date: 10/08/2021
ms.topic: conceptual 
---

# Deploy the Log Analytics agent on Azure Arc-enabled servers

Azure Monitor supports multiple methods to install the Log Analytics agent and connect your machine or server registered with Azure Arc-enabled servers to the service. Azure Arc-enabled servers supports the Azure VM extension framework, which provides post-deployment configuration and automation tasks, enabling you to simplify management of your hybrid machines like you can with Azure VMs.

The Log Analytics agent is required if you want to:

* Monitor the operating system, any workloads running on the machine or server using [VM insights](../../azure-monitor/vm/vminsights-overview.md). Further analyze and alert using other features of [Azure Monitor](../../azure-monitor/overview.md).
* Perform security monitoring in Azure by using [Azure Security Center](../../security-center/security-center-introduction.md) or [Azure Sentinel](../../sentinel/overview.md).
* Manage operating system updates by using [Azure Automation Update Management](../../automation/update-management/overview.md).
* Collect inventory and track changes by using [Azure Automation Change Tracking and Inventory](../../automation/change-tracking/overview.md).
* Run Automation runbooks directly on the machine and against resources in the environment to manage them by using an [Azure Automation Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md).

This article reviews the deployment methods for the Log Analytics agent VM extension, across multiple production physical servers or virtual machines in your environment, to help you determine which works best for your organization.

## Installation options

You can use different methods to install the VM extension using one method or a combination. This section describes each one for you to consider.

### Using Arc-enabled servers

This method supports managing the installation, management, and removal of VM extensions from the [Azure portal](manage-vm-extensions-portal.md), using [PowerShell](manage-vm-extensions-powershell.md), the [Azure CLI](manage-vm-extensions-cli.md), or with an [Azure Resource Manager (ARM) template](manage-vm-extensions-template.md).

#### Advantages

* Can be useful for testing purposes.
* Useful if you have a small number of machines to manage.

#### Disadvantages

* Limited automation when using an Azure Resource Manager template, otherwise it is time consuming.
* Can only focus on a single Arc-enabled server, and not multiple instances.
* Only supports specifying a single workspace to report to. Requires using PowerShell or the Azure CLI to configure the Log Analytics Windows agent VM extension to report to up to four workspaces.
* Doesn't support deploying the Dependency agent from the portal. You have to use PowerShell, the Azure CLI, or ARM template.

### Using Azure Policy

You can use Azure Policy to deploy the Log Analytics agent VM extension at-scale to machines in your environment, and maintain configuration compliance. This is accomplished by using either the **Configure Log Analytics extension on Azure Arc enabled Linux servers** / **Configure Log Analytics extension on Azure Arc enabled Windows servers** policy definition, or the **Enable Azure Monitor for VMs** policy initiative.

Azure Policy includes several prebuilt definitions related to Azure Monitor. For a complete list of the built-in policies in the  **Monitoring** category, see [Azure Policy built-in definitions for Azure Monitor](../../azure-monitor/policy-reference.md).

#### Advantages

* If the VM extension is removed, after policy evaluation it reinstalls it.
* Identifies and installs the VM extension when a new Azure Arc-enabled server is registered with Azure.
* Only supports specifying a single workspace to report to. Requires using PowerShell or the Azure CLI to configure the Log Analytics Windows agent VM extension to report to up to four workspaces.

#### Disadvantages

* The **Configure Log Analytics extension on Azure Arc enabled** *operating system* **servers** policy only installs the Log Analytics VM extension and configures the agent to report to a specified Log Analytics workspace. If you are interested in VM insights to monitor the operating system performance, and map running processes and dependencies on other resources, then you should apply the policy initiative **Enable Azure Monitor for VMs**. It installs and configures both the Log Analytics VM extension and the Dependency agent VM extension, which are required.
* Standard compliance evaluation cycle is once every 24 hours. An evaluation scan for a subscription or a resource group can be started with Azure CLI, Azure PowerShell, a call to the REST API, or by using the Azure Policy Compliance Scan GitHub Action. For more information, see [Evaluation triggers](../../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).

### Using Azure Automation

The process automation operating environment in Azure Automation and its support for PowerShell and Python runbooks can enable you to automate the deployment of the Log Analytics agent VM extension at-scale to machines in your environment.

#### Advantages

* Can use a scripted method to automate its deployment and configuration using scripting languages you're familiar with.
* Runs on a schedule that you define and control.
* Authenticate securely to Arc-enabled servers from the Automation account using a managed identity.

#### Disadvantages

* Requires an Azure Automation account.
* Experience authoring and managing runbooks in Azure Automation.
* Creating a runbook based on PowerShell or Python depending on the target operating system.

## Next steps

* To manage operating system updates using Azure Automation Update Management, review [Enable from an Automation account](../../update-management/enable-from-automation-account.md) and then follow the steps to enable machines reporting to the workspace.

* To track changes using Azure Automation Change Tracking and Inventory, review [Enable from an Automation account](../../automation/change-tracking/enable-from-automation-account.md) and then follow the steps to enable machines reporting to the workspace.

* You can use the user Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on servers or machines registered with Arc-enabled servers. See the [Deploy Hybrid Runbook Worker VM extension](../../automation/extension-based-hybrid-runbook-worker-install.md) article.

* To start collecting security-related events with Azure Sentinel, see [onboard to Azure Sentinel](scenario-onboard-azure-sentinel.md), or to collect with Azure Security Center, see [onboard to Azure Security Center](../../security-center/quickstart-onboard-machines.md).

* See the VM insights [Monitor performance](../../azure-monitor/vm/vminsights-performance.md) and [Map depencencies](../../azure/azure-monitor/vm/vminsights-maps.md) articles to see how well your machine is performing and view discovered application components.