---
title: Observability in Azure Virtual Enclaves
description: Understand how observability works using Log Analytics and storage accounts in Azure Virtual Enclaves.
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 06/19/2025
ms.custom: references_region
---

# Observability in Azure Virtual Enclaves

Azure Virtual Enclaves provides built-in observability features to support secure, scalable, and centralized monitoring of mission-critical environments. These capabilities help Community Managers and Enclave Owners enforce compliance, investigate anomalies, and ensure operational health across isolated workloads.

The following are enabled by default for Azure Virtual Enclaves resources:
- Log Analytics Workspace is deployed into the Community Managed Resource Group by default
- (Optional) Log Analytics Workspace is deployed into the Enclave Managed Resource Group
- Storage Account is deployed into Enclave Managed Resource Group
- vNet Flow Logs for each Virtual Enclave are enabled, pointed to the Enclave Storage Account, and forwarded to Community and/or Enclave Log-A
- Diagnostic Settings are enabled on resources deployed into both Community and Enclave managed Resource Groups

## Centralized and isolated observability

Observability in Azure Virtual Enclaves is built on a dual-tier logging model that supports both centralized and enclave-isolated diagnostic logging using Azure Monitor, Log Analytics, and Storage Accounts.

### Community-level observability

Every **Community** created in Azure Virtual Enclaves includes a **centralized Log Analytics workspace**. This workspace is designed to:

- Aggregate diagnostics and metrics from all enclaves within the community.
- Provide a single pane of glass for monitoring and querying diagnostics and flow logs.
- Support cross-enclave analytics, alerting, and compliance tracking.

This workspace is automatically provisioned when the Community is deployed and can be selected as the diagnostic destination by enclave or workload owners during deployment or update operations and is not network isolated by default. 

> [!Note]
> Diagnostic settings from enclave resources (such as workloads, public IPs, or Application Gateways) can be configured to send logs to the centralized workspace to support unified monitoring.

### Enclave-level observability

In addition to the Community workspace, each **Enclave** is provisioned with an **isolated Log Analytics workspace** scoped specifically to that enclave. This workspace is optimized for enclave-level logging use cases and includes the following characteristics:

- **Default storage of vNet flow logs**, which are enabled automatically for every enclave.
- Optional diagnostic settings for enclave-scoped resources, such as internal workloads and networking components.
- Designed to meet isolation or regulatory requirements that prevent cross-enclave log aggregation.

Administrators may choose to keep enclave diagnostics private by sending logs only to this isolated workspace.

## Configurable logging destinations

Azure Virtual Enclaves supports flexible logging configurations that allow resource owners to choose between:

| Logging Destination | Purpose | Default Use |
|---------------------|---------|-------------|
| **Community Log Analytics workspace** | Enables centralized monitoring and cross-enclave analytics | Optional |
| **Enclave Log Analytics workspace** | Maintains enclave-level isolation and data sovereignty | Default for vNet Flow Logs |

You can configure diagnostic settings through the Azure Portal, CLI, or Bicep/ARM templates during or after deployment.

> [!Important]
> vNet Flow Logs are always sent to the enclave-specific workspace by default to ensure network-level visibility is preserved, even in isolated environments.

## Common observability scenarios

| Scenario | Logging Strategy |
|----------|------------------|
| **Cross-enclave health dashboard** | Send diagnostics from all enclaves to the centralized Community Log Analytics workspace |
| **Regulated enclave with strict data controls** | Keep diagnostics within the enclave-specific Log Analytics workspace |
| **Long-term retention for audit purposes** | Send logs to a Storage Account with policy-controlled retention settings |
| **Network investigation or threat hunting** | Use the enclave workspace to analyze default vNet flow logs |

## Next steps

To configure logging in your environment, see:

- [Enable diagnostics for an enclave](./configure-diagnostics-enclave.md)
- [Configure centralized logging for your community](./configure-diagnostics-community.md)
- [Analyze vNet Flow Logs in Log Analytics](./analyze-vnet-flows.md)
- [Integrate Log Analytics with Sentinel](./connect-loganalytics-sentinel.md)