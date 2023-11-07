---
title: Protect your servers with Defender for Servers
description: Learn how to enable the Defender for Servers on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/29/2023
---

# Protect your servers with Defender for Servers

Defender for Servers in Microsoft Defender for Cloud brings threat detection and advanced defenses to your Windows and Linux machines that run in Azure, Amazon Web Services (AWS), Google Cloud Platform (GCP), and on-premises environments. This plan includes the integrated license for Microsoft Defender for Endpoint, security baselines and OS level assessments, vulnerability assessment scanning, adaptive application controls (AAC), file integrity monitoring (FIM), and more.

Microsoft Defender for Servers includes an automatic, native integration with Microsoft Defender for Endpoint. Learn more, [Protect your endpoints with Defender for Cloud's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md). With this integration enabled, you have access to the vulnerability findings from **Microsoft threat and vulnerability management**.

Defender for Servers offers two plan options with different levels of protection and their own cost. You can learn more about Defender for Cloud's pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Review the [Defender for Servers deployment guide](plan-defender-for-servers.md).

## Enable the Defender for Servers plan

You can enable the Defender for Servers plan from the Environment settings page to protect all the machines in an Azure subscription, AWS account, or GCP project.

**To enable the Defender for Servers plan**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, toggle the Servers switch to **On**.

    :::image type="content" source="media/tutorial-enable-servers-plan/enable-servers-plan.png" alt-text="Screenshot that shows you how to toggle the Defender for Servers plan to on." lightbox="media/tutorial-enable-servers-plan/enable-servers-plan.png":::

## Select a Defender for Servers plan

When you enable the Defender for Servers plan, you're then given the option to select which plan - Plan 1 or Plan 2 - to enable. There are two plans you can choose from that offer different levels of protections for your resources.

[Review what's included each plan](plan-defender-for-servers-select-plan.md#plan-features).

**To select a Defender for Servers plan**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant Azure subscription, AWS account, or GCP project.

1. Select **Change plans**.

    :::image type="content" source="media/tutorial-enable-servers-plan/servers-change-plan.png" alt-text="Screenshot that shows you where on the environment settings page to select change plans." lightbox="media/tutorial-enable-servers-plan/servers-change-plan.png":::

1. In the popup window, select **Plan 2** or **Plan 1**.

    :::image type="content" source="media/tutorial-enable-servers-plan/servers-plan-selection.png" alt-text="Screenshot of the popup where you can select plan 1 or plan 2.":::

1. Select **Confirm**.

1. Select **Save**.

## Configure monitoring coverage

There are three components that can be enabled and configured to provide extra protections to your environments in the Defender for Servers plans.

| Component | Description | Learn more |
|:--:|:--:|:--:|
| [Log Analytics agent/Azure Monitor agent](plan-defender-for-servers-agents.md) | Collects security-related configurations and event logs from the machine and stores the data in your Log Analytics workspace for analysis. | [Learn more](../azure-monitor/agents/log-analytics-agent.md) about the Log Analytics agent. |
| Vulnerability assessment for machines | Enables vulnerability assessment on your Azure and hybrid machines. | [Learn more](monitoring-components.md) about how Defender for Cloud collects data. |
| [Agentless scanning for machines](concept-agentless-data-collection.md) | Scans your machines for installed software and vulnerabilities without relying on agents or impacting machine performance. | [Learn more](concept-agentless-data-collection.md) about agentless scanning for machines. |

Toggle the corresponding switch to **On**, to enable any of these options.

### Configure Log Analytics agent/Azure Monitor agent

After enabling the Log Analytics agent/Azure Monitor agent, you'll be presented with the option to select either the Log Analytics agent or the Azure Monitor agent and which workspace should be utilized.

**To configure the Log Analytics agent/Azure Monitor agent**:

1. Select **Edit configuration**.

    :::image type="content" source="media/tutorial-enable-servers-plan/edit-configuration-log.png" alt-text="Screenshot that shows you where on the screen you need to select edit configuration, to edit the log analytics agent/azure monitor agent." lightbox="media/tutorial-enable-servers-plan/edit-configuration-log.png":::

1. In the Auto provisioning configuration window, select one of the following two agent types:

    - **Log Analytic Agent (Default)** - Collects security-related configurations and event logs from the machine and stores the data in your Log Analytics workspace for analysis.

    - **Azure Monitor Agent (Preview)** - Collects security-related configurations and event logs from the machine and stores the data in your Log Analytics workspace for analysis.

    :::image type="content" source="media/tutorial-enable-servers-plan/auto-provisioning-screen.png" alt-text="Screenshot of the auto provisioning configuration screen with the available options to select." lightbox="media/tutorial-enable-servers-plan/auto-provisioning-screen.png":::

1. Select either a **Default workspace(s)** or a **Custom workspace** depending on your need.

1. Select **Apply**.

### Configure vulnerability assessment for machines

Vulnerability assessment for machines allows you to select between two vulnerability assessment solutions:

- Microsoft Defender vulnerability management
- Microsoft Defender for Cloud integrated Qualys scanner

**To select either of the vulnerability assessment solutions**:

1. Select **Edit configuration**.

    :::image type="content" source="media/tutorial-enable-servers-plan/vulnerability-edit.png" alt-text="Screenshot that shows you where to select edit for vulnerabilities assessment for machines." lightbox="media/tutorial-enable-servers-plan/vulnerability-edit.png":::

1. In the Extension deployment configuration window, select either of the solutions depending on your need.

1. Select **Apply**.

### Configure agentless scanning for machines (preview)

Defender for Cloud has the ability to scan your Azure machines for installed software and vulnerabilities without requiring you to install agents, have network connectivity or affect your machine's performance.

**To configure agentless scanning for machines**:

1. Select **Edit configuration**.

    :::image type="content" source="media/tutorial-enable-servers-plan/agentless-scanning-edit.png" alt-text="Screenshot that shows where you need to select to edit the configuration of the agentless scanner." lightbox="media/tutorial-enable-servers-plan/agentless-scanning-edit.png":::

1. Enter a tag name and tag value for any machines to be excluded from scans.

1. Select **Apply**.

## Next steps

[Overview of Microsoft Defender for Servers](defender-for-servers-introduction.md)
