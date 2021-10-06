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

This article reviews deployment methods available through Azure Arc-enabled servers to help you determine which works best for your organization depending on your requirements.

## Installation options

The Log Analytics agent is available as an Azure VM extension and can be installed in the following ways:

* Directly from Arc-enabled servers from the portal, using PowerShell, the Azure CLI, or with an Azure Resource Manager template.
* Using Azure Policy by using either the **Configure Log Analytics extension on Azure Arc enabled Linux servers** / **Configure Log Analytics extension on Azure Arc enabled Windows servers** policy definition or the **Enable Azure Monitor for VMs** policy initiative.

The difference between the policy definition and the policy initiative is the **Configure Log Analytics extension on Azure Arc enabled <OS type> servers** policy only installs the Log Analytics VM extension and configures the agent to report to a specified Log Analytics workspace. If you are interested in VM insights to monitor the operating system performance, running processes and dependencies on other resources, then you should apply the policy initiative **Enable Azure Monitor for VMs**. It installs and configures the Log Analytics VM extension and the Dependency agent VM extension, which are both required.