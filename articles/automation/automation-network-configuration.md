---
title: Azure Automation network configuration details
description: This article provides details of network information required by Azure Automation State Configuration, Azure Automation Hybrid Runbook Worker, Update Management, and Change Tracking and Inventory
ms.topic: conceptual
ms.date: 08/01/2023
---

# Azure Automation network configuration details

This page provides networking details that are required for [Hybrid Runbook Worker and State Configuration](#hybrid-runbook-worker-and-state-configuration), and for [Update Management and Change Tracking and Inventory](#update-management-and-change-tracking-and-inventory).

## Hybrid Runbook Worker and State Configuration

The following port and URLs are required for the Hybrid Runbook Worker, and for [Automation State Configuration](automation-dsc-overview.md) to communicate with Azure Automation.

* Port: Only 443 required for outbound internet access
* Global URL: `*.azure-automation.net`
* Global URL of US Gov Virginia: `*.azure-automation.us`
* Agent service: `https://<workspaceId>.agentsvc.azure-automation.net`

### Network planning for Hybrid Runbook Worker

For either a system or user Hybrid Runbook Worker to connect to and register with Azure Automation, it must have access to the port number and URLs described in this section. The worker must also have access to the [ports and URLs required for the Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) to connect to the Azure Monitor Log Analytics workspace.

If you have an Automation account that's defined for a specific region, you can restrict Hybrid Runbook Worker communication to that regional datacenter. Review the [DNS records used by Azure Automation](how-to/automation-region-dns-records.md) for the required DNS records.

### Configuration of private networks for State Configuration

If your nodes are located in a private network, the port and URLs defined above are required. These resources provide network connectivity for the managed node and allow DSC to communicate with Azure Automation.

If you are using DSC resources that communicate between nodes, such as the [WaitFor resources](/powershell/dsc/reference/resources/windows/waitForAllResource), you also need to allow traffic between nodes. See the documentation for each DSC resource to understand these network requirements.

To understand client requirements for TLS 1.2 or higher, see [TLS 1.2 or higher for Azure Automation](automation-managing-data.md#tls-12-or-higher-for-azure-automation).

## Update Management and Change Tracking and Inventory

The addresses in this table are required both for Update Management and for Change Tracking and Inventory. The paragraph following the table also applies to both.

Communication to these addresses uses **port 443**.

|Azure Public  |Azure Government  |
|---------|---------|
|\*.ods.opinsights.azure.com    | \*.ods.opinsights.azure.us         |
|\*.oms.opinsights.azure.com     | \*.oms.opinsights.azure.us        |
|\*.blob.core.windows.net | \*.blob.core.usgovcloudapi.net|
|\*.azure-automation.net | \*.azure-automation.us|

When you create network group security rules or configure Azure Firewall to allow traffic to the Automation service and the Log Analytics workspace, use the [service tags](../virtual-network/service-tags-overview.md#available-service-tags) **GuestAndHybridManagement** and **AzureMonitor**. This simplifies the ongoing management of your network security rules. To connect to the Automation service from your Azure VMs securely and privately, review [Use Azure Private Link](./how-to/private-link-security.md). To obtain the current service tag and range information to include as part of your on-premises firewall configurations, see [downloadable JSON files](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files).

## Next steps

* Learn about [Automation Update Management overview](update-management\overview.md).
* Learn about [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md).
* Learn about [Change Tracking and Inventory](change-tracking\overview.md).
* Learn about [Automation State Configuration](automation-dsc-overview.md).
