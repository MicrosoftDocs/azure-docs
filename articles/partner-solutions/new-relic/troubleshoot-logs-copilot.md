---
title: Troubleshoot log forwarding with Azure Copilot in Azure Native New Relic Service
description: Learn how to use Azure Copilot to diagnose and resolve log forwarding issues in Azure Native New Relic Service.
ms.topic: troubleshooting-general
ms.service: partner-services
ms.subservice: new-relic
author: shijojoy
ms.author: shijoy
ms.date: 06/16/2026
---

# Troubleshoot log forwarding with Azure Copilot in Azure Native New Relic Service

This article describes how to use Microsoft Copilot in Azure to diagnose and resolve log forwarding issues in Azure Native New Relic Service.

## Overview

Microsoft Copilot in Azure provides an integrated troubleshooting experience for Azure Native New Relic Service. It acts as a virtual support engineer that understands your resource context, runs diagnostic checks, and suggests remediation steps directly within the Azure portal. This capability helps you resolve common issues without raising a support ticket.

## Prerequisites

- An active Azure subscription with an Azure Native New Relic Service resource.
- The `NewRelic.Observability` resource provider registered in your subscription.
- Access to [Microsoft Copilot in Azure](/azure/copilot/overview).

## Supported scenarios

In the current release, Copilot provides deep troubleshooting for **log forwarding issues**. For metrics and agent-related issues, Copilot provides links to relevant documentation and general guidance.

### Log forwarding issues

Copilot can diagnose the following log forwarding problems:

| Issue | Description |
|-------|-------------|
| Monitoring disabled | The monitoring status for the New Relic resource is set to disabled, which stops all log forwarding. |
| Subscription-level log forwarding disabled | Log forwarding isn't enabled at the subscription level, so no resources in the subscription send logs to New Relic. |
| Resource-level log forwarding disabled | Log forwarding isn't enabled for specific resources, even though subscription-level forwarding is active. |
| Diagnostic settings limit reached | Azure allows a maximum of five diagnostic settings per resource. If this limit is reached, new diagnostic settings for New Relic can't be created. |
| Resource lock preventing diagnostic setting deletion | A read-only or delete lock on the resource or resource group prevents the removal or modification of diagnostic settings. |
| Resource lock preventing diagnostic setting creation | A read-only lock on the resource or resource group prevents the creation of new diagnostic settings. |

## Use Copilot to troubleshoot log forwarding

You can access Copilot from anywhere in the Azure portal. Use one of the following approaches:

### Option 1: Start from the New Relic resource

1. In the [Azure portal](https://portal.azure.com), go to your Azure Native New Relic Service resource.
1. Select **Copilot** from the toolbar or the side panel.
1. Describe your issue in natural language. For example:
   - *"Logs are missing in my New Relic dashboard"*
   - *"Why aren't my App Service logs reaching New Relic?"*
   - *"Debug log ingestion failure for my resources"*

### Option 2: Start from any page in the Azure portal

1. Open Copilot from the top navigation bar.
1. Ask a troubleshooting question that includes context about your New Relic resource. For example:
   - *"Logs are missing for my App Service in New Relic"*
   - *"My subscription logs aren't being forwarded to New Relic"*

If Copilot can't automatically determine the resource context, it prompts you to provide the resource name or subscription details.

## Diagnostic checks performed by Copilot

When you report a log forwarding issue, Copilot automatically runs the following checks:

### 1. Monitoring status

Copilot verifies whether the monitoring status for your New Relic resource is enabled. If monitoring is disabled, no logs, metrics, or other telemetry data are sent to New Relic.

**Remediation:** Enable monitoring on the New Relic resource overview page.

### 2. Log forwarding configuration

Copilot checks whether log forwarding is enabled at both the subscription level and the individual resource level.

**Remediation:** Go to your New Relic resource, select **Monitored resources**, and enable log forwarding for the affected subscription or resources.

### 3. Diagnostic settings validation

Copilot inspects diagnostic settings on the affected resources to verify that:

- A diagnostic setting exists that routes logs to New Relic.
- The diagnostic setting hasn't been accidentally deleted or modified.
- The total number of diagnostic settings hasn't reached the maximum limit of five per resource.

**Remediation:**
- If the diagnostic setting is missing, reconfigure log forwarding from the New Relic resource.
- If the limit is reached, remove unused diagnostic settings to make room for the New Relic configuration.

### 4. Resource lock detection

Copilot checks for resource locks (read-only or delete) on the resource or its parent resource group that might block changes to diagnostic settings.

**Remediation:**
- Identify the lock from the **Locks** page of the resource or resource group.
- Temporarily remove the lock to allow diagnostic setting changes.
- Reapply the lock after the configuration is complete.

## Metrics and agent issues

For metrics and agent-related issues, Copilot provides general guidance and links to the following resources:

- [Manage Azure Native New Relic Service](manage.md) for metrics configuration.
- [Troubleshoot Azure Native New Relic Service](troubleshoot.md) for agent installation and uninstallation issues.

Deep diagnostic support for metrics and agent issues is planned for a future release.

## Sample prompts

Use the following prompts to get started with Copilot troubleshooting:

- *"Logs are missing in my New Relic dashboard"*
- *"New Relic isn't receiving logs from my App Service"*
- *"Why did log forwarding stop for my resources?"*
- *"Debug log ingestion failure"*
- *"Logs missing for my virtual machine in New Relic"*

## Limitations

- Deep troubleshooting is currently limited to log forwarding issues.
- Copilot requires the resource context to run diagnostics. Provide the resource name or navigate to the resource before starting the conversation.
- Copilot can't modify resource configurations on your behalf. You need to apply the suggested remediations manually.

## Get support

If Copilot can't resolve your issue, you can:

- [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request) for Azure Native New Relic Service.
- Contact [New Relic support](https://support.newrelic.com) for issues related to the New Relic platform.

## Related content

- [What is Azure Native New Relic Service?](overview.md)
- [Troubleshoot Azure Native New Relic Service](troubleshoot.md)
- [Microsoft Copilot in Azure overview](/azure/copilot/overview)
