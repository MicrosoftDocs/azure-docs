---
title: Configure monitoring coverage for Defender for Servers
description: 
ms.topic: install-set-up-deploy
ms.date: 01/21/2024
---

# Configure monitoring coverage

Microsoft Defender for Cloud's Defender for Servers plan 2 has components that can be enabled and configured to provide extra protections to your environments. 

| Component | Description | Learn more |
|:--:|:--:|:--:|
| [Log Analytics agent](plan-defender-for-servers-agents.md) | Collects security-related configurations and event logs from the machine and stores the data in your Log Analytics default or custom workspace for analysis. | [Learn more](../azure-monitor/agents/log-analytics-agent.md) about the Log Analytics agent. |
| [Vulnerability assessment for machines](deploy-vulnerability-assessment-defender-vulnerability-management.md) | Enables vulnerability assessment on your Azure and hybrid machines. | [Learn more](monitoring-components.md) about how Defender for Cloud collects data. |
| [Endpoint protection](integration-defender-for-endpoint.md) | Enables protection powered by Microsoft Defender for Endpoint, including automatic agent deployment to your servers, and security data integration with Defender for Cloud | [Learn more](integration-defender-for-endpoint.md) about endpoint protection |
| [Agentless scanning for machines](concept-agentless-data-collection.md) | Scans your machines for installed software and vulnerabilities without relying on agents or impacting machine performance. | [Learn more](concept-agentless-data-collection.md) about agentless scanning for machines. |

By default, When you enable Defender for Servers plan 2, all of these components will be toggled to **On**.

## Configure Log Analytics agent

After enabling the Log Analytics agent, you'll be presented with the option to select which workspace should be utilized.

**To configure the Log Analytics agent**:

1. Select **Edit configuration**.

    :::image type="content" source="media/tutorial-enable-servers-plan/edit-configuration-log.png" alt-text="Screenshot that shows you where on the screen you need to select edit configuration, to edit the log analytics agent/azure monitor agent." lightbox="media/tutorial-enable-servers-plan/edit-configuration-log.png":::

1. Select either a **Default workspace(s)** or a **Custom workspace** depending on your need.

    :::image type="content" source="media/tutorial-enable-servers-plan/auto-provisioning-screen.png" alt-text="Screenshot of the auto provisioning configuration screen with the available options to select." lightbox="media/tutorial-enable-servers-plan/auto-provisioning-screen.png":::

1. Select **Apply**.

## Configure vulnerability assessment for machines

Vulnerability assessment for machines allows you to select between two vulnerability assessment solutions:

- Microsoft Defender Vulnerability Management
- Microsoft Defender for Cloud integrated Qualys scanner

**To select either of the vulnerability assessment solutions**:

1. Select **Edit configuration**.

    :::image type="content" source="media/tutorial-enable-servers-plan/vulnerability-edit.png" alt-text="Screenshot that shows you where to select edit for vulnerabilities assessment for machines." lightbox="media/tutorial-enable-servers-plan/vulnerability-edit.png":::

1. In the Extension deployment configuration window, select either of the solutions depending on your need.

1. Select **Apply**.

## Configure endpoint protection

With Microsoft Defender for Servers, you enable the protections provided by [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint?view=o365-worldwide) to your server resources. Defender for Endpoint includes automatic agent deployment to your servers, and security data integration with Defender for Cloud.

**To configure endpoint protection**:

1. Toggle the switch to **On**.

## Configure agentless scanning for machines

Defender for Cloud has the ability to scan your Azure machines for installed software and vulnerabilities without requiring you to install agents, have network connectivity or affect your machine's performance.

**To configure agentless scanning for machines**:

1. Select **Edit configuration**.

    :::image type="content" source="media/tutorial-enable-servers-plan/agentless-scanning-edit.png" alt-text="Screenshot that shows where you need to select to edit the configuration of the agentless scanner." lightbox="media/tutorial-enable-servers-plan/agentless-scanning-edit.png":::

1. Enter a tag name and tag value for any machines to be excluded from scans.

1. Select **Apply**.

Learn more about agentless scanning and how to [enable agentless scanning](enable-agentless-scanning-vms.md) on other cloud environments.