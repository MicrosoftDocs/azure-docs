---
title: Observability in Azure Enclave
description: Understand how observability works using Log Analytics and storage accounts in Azure Enclave.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.service: azure-enclave
ai-usage: ai-assisted
ms.date: 9/30/2025
ms.custom: references_region
---

# Observability in Azure Enclave

Azure Enclave provides observability features to support monitoring of workloads and network resources across communities and enclaves. This article describes the available logging destinations, how destinations affect diagnostic settings and flow logs, and how to prepare the `NetworkWatcherRG` resource group.

The following are enabled by default for Azure Enclave resources:
- Log Analytics Workspace is deployed into the Community Managed Resource Group by default
- (Optional) Log Analytics Workspace is deployed into the Enclave Managed Resource Group
- Storage Account is deployed into Enclave Managed Resource Group
- Virtual Network Flow Logs for each enclave are enabled, pointed to the enclave Storage Account, and forwarded to Community and/or Enclave Log Analytics workspace
- Diagnostic Settings are enabled on resources deployed into both Community and Enclave managed Resource Groups

## Centralized and isolated observability

Observability in Azure Enclave is built on a dual-tier logging model that supports both centralized and enclave-isolated diagnostic logging using Azure Monitor, Log Analytics, and Storage Accounts.

### Community-level observability

When you configure it, a **Community** can include a **centralized Log Analytics workspace**. This workspace is designed to:

- Aggregate diagnostics and metrics from all enclaves within the community.
- Provide a single pane of glass for monitoring and querying diagnostics and flow logs.
- Support cross-enclave analytics, alerting, and compliance tracking.

The workspace is created when you select the Community workspace destination. You can use the workspace as a diagnostic destination for supported enclave or workload resources. Runtime-created workspaces currently enable public network access for ingestion and query; network isolation isn't enabled by these provider operations. To configure private access, see [Azure Monitor Private Link scope](/azure/azure-monitor/logs/private-link-security).

> [!Note]
> Diagnostic settings from enclave resources (such as workloads, public IPs, or Application Gateways) can be configured to send logs to the centralized workspace to support unified monitoring.

### Enclave-level observability

When you configure an **Enclave**, it can include an **isolated Log Analytics workspace** that's scoped specifically to that enclave. This workspace supports enclave-level logging use cases and can provide:

- **Storage of virtual network flow logs** when you enable flow-log setup and select the enclave workspace as the destination.
- Optional diagnostic settings for enclave-scoped resources, such as internal workloads and networking components.
- Designed to meet isolation or regulatory requirements that prevent cross-enclave log aggregation.

Administrators can choose to keep enclave diagnostics within this workspace when they select the enclave workspace as the destination.

## Configurable logging destinations

Azure Enclave supports flexible logging configurations that allow resource owners to choose between:

| Logging Destination                   | Purpose                                                    | Default Use |
|---------------------------------------|------------------------------------------------------------|-------------|
| **Community Log Analytics workspace** | Enables centralized monitoring and cross-enclave analytics | Configurable |
| **Enclave Log Analytics workspace**   | Supports enclave-level monitoring and isolation | Configurable |
| **Custom Log Analytics workspace**    | Sends supported flow logs to a customer-selected workspace | Configurable |

You can configure diagnostic settings through the Azure portal, CLI, or Bicep/ARM templates during or after deployment.

> [!IMPORTANT]
> Flow-log destinations are configurable. The provider supports enclave, community, and custom Log Analytics workspaces. Don't assume that flow logs are always sent to the enclave workspace.

## Common observability scenarios

| Scenario                                        | Logging Strategy |
|-------------------------------------------------|------------------|
| **Cross-enclave health dashboard**              | Send diagnostics from all enclaves to the centralized Community Log Analytics workspace |
| **Regulated enclave with strict data controls** | Keep diagnostics within the enclave-specific Log Analytics workspace |
| **Long-term retention for audit purposes**      | Send logs to a Storage Account with policy-controlled retention settings |
| **Network investigation or threat hunting**     | Use the enclave workspace to analyze default virtual network flow logs |

### Configure Network Watcher resource groups

To avoid potential issues with [virtual network flow log](/azure/network-watcher/vnet-flow-logs-overview) creation, ensure you follow the getting started instructions to [configure `NetworkWatcherRG` access](./onboard.md#configure-networkwatcherrg-access).
