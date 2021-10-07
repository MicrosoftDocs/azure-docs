---
title: Deploy the Log Analytics agent on Azure Arc-enabled servers
description: This article tells how to deploy the Log Analytics agent on Windows and Linux-based machines registered with Azure Arc-enabled servers in your local datacenter or other cloud environment.
ms.date: 10/06/2021
ms.topic: conceptual 
---

# Deploy the Log Analytics agent on Azure Arc-enabled servers

Azure Monitor supports multiple methods to install the Log Analytics agent and connect your machine or server registered with Azure Arc-enabled servers to the service. Azure Arc-enabled servers supports the Azure VM extension framework, which provides post-deployment configuration and automation tasks, enabling you to simplify management of your hybrid machines like you can with Azure VMs. 

The Log Analytics agent is required if you want to:

* Monitor the operating system, any workloads running on the machine or server, further analyze, and alert using Azure Monitor.
* Perform security monitoring in Azure by using Azure Security Center and Azure Sentinel.
* Manage operating system updates by using Azure Automation Update Management.
* Collect inventory and track changes by using Azure Automation Change Tracking and Inventory.
* Run Automation runbooks directly on the machine and against resources in the environment to manage them by using an Azure Automation Hybrid Runbook Worker.

This article reviews deployment methods for the Log Analytics agent VM extension, available through Azure Arc-enabled servers, to help you determine which works best for your organization.

## Installation options

You can use different methods to install the VM extension using one method or a combination. This section describes each one for you to consider.

### Using Arc-enabled servers

This method supports managing the installation, management, and removal of VM extensions from the Azure portal, using PowerShell, the Azure CLI, or with an Azure Resource Manager template.

#### Advantages

* Can be useful for testing purposes.
* Useful if you have a small number of machines to manage.

#### Disadvantages

* Limited automation when using an Azure Resource Manager template, otherwise it is time consuming.
* Can only focus on a single Arc-enabled server, and not multiple instances.
* Only supports specifying a single workspace to report to. Requires using PowerShell or the Azure CLI to configure the Log Analytics Windows agent VM extension to report to up to three additional workspaces (multihoming is limited to only supporting a total of four workspacee).

### Using Azure Policy

You can use Azure Policy to maintain configuration compliance by using either the **Configure Log Analytics extension on Azure Arc enabled Linux servers** / **Configure Log Analytics extension on Azure Arc enabled Windows servers** policy definition or the **Enable Azure Monitor for VMs** policy initiative.

#### Advantages

* If the VM extension is removed, this method can reinstall it.
* Identifies and installs the VM extension when a new Azure Arc-enabled server is registered with Azure.
* Only supports specifying a single workspace to report to. Requires using PowerShell or the Azure CLI to configure the Log Analytics Windows agent VM extension to report to up to three other workspaces (multihoming is limited by supporting a total of four workspaces).

#### Disadvantages

* The **Configure Log Analytics extension on Azure Arc enabled** *operating system* **servers** policy only installs the Log Analytics VM extension and configures the agent to report to a specified Log Analytics workspace. If you are interested in VM insights to monitor the operating system performance, running processes and dependencies on other resources, then you should apply the policy initiative **Enable Azure Monitor for VMs**. It installs and configures the Log Analytics VM extension and the Dependency agent VM extension, which requires both agents.

## Next steps