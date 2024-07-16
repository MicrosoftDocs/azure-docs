---
title: Configure Defender for Servers features
description: Learn how to configure the different monitoring components that are available in Defender for Servers in Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 02/05/2024
---

# Configure Defender for Servers features

Microsoft Defender for Cloud's Defender for Servers plans contains components that monitor your environments to provide extended coverage on your servers. Each of these components can be enabled, disabled or configured to your meet your specific requirements.

| Component | Availability | Description | Learn more |
|--|--|--|--|
| [Log Analytics agent](plan-defender-for-servers-agents.md) | Plan 1 and Plan 2 | Collects security-related configurations and event logs from the machine and stores the data in your Log Analytics default or custom workspace for analysis. | [Learn more](../azure-monitor/agents/log-analytics-agent.md) about the Log Analytics agent. |
| [Vulnerability assessment for machines](deploy-vulnerability-assessment-defender-vulnerability-management.md) | Plan 1 and Plan 2 |Enables vulnerability assessment on your Azure and hybrid machines. | [Learn more](monitoring-components.md) about how Defender for Cloud collects data. |
| [Endpoint protection](integration-defender-for-endpoint.md) | Plan 1 and Plan 2 | Enables protection powered by Microsoft Defender for Endpoint, including automatic agent deployment to your servers, and security data integration with Defender for Cloud | [Learn more](integration-defender-for-endpoint.md) about endpoint protection. |
| [Agentless scanning for machines](concept-agentless-data-collection.md) | Plan 2 | Scans your machines for installed software and vulnerabilities without relying on agents or impacting machine performance. | [Learn more](concept-agentless-data-collection.md) about agentless scanning for machines. |

When you enable Defender for Servers plan 2, all of these components are toggled to **On** by default.

> [!NOTE]
> The Log Analytics agent (also known as MMA) is set to retire in [August 2024](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). All Defender for Servers features that depend on the AMA, including those described on the [Enable Defender for Endpoint (Log Analytics)](endpoint-protection-recommendations-technical.md) page, will be available through either [Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md) or [agentless scanning](concept-agentless-data-collection.md), before the retirement date. For more information about the roadmap for each of the features that are currently rely on Log Analytics Agent, see [this announcement](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).

## Configure Log Analytics agent

After enabling the Log Analytics agent, you'll be presented with the option to select which workspace should be utilized.

**To configure the Log Analytics agent**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. Locate the Defenders for Servers plan and select **Settings**.

1. On the Log Analytics agent row, select **Edit configuration**.

    :::image type="content" source="media/configure-servers-coverage/edit-configuration-log.png" alt-text="Screenshot that shows you where on the screen you need to select edit configuration, to edit the log analytics agent/azure monitor agent." lightbox="media/configure-servers-coverage/edit-configuration-log.png":::

1. Select either a **Default workspace(s)** or a **Custom workspace** depending on your need.

    :::image type="content" source="media/configure-servers-coverage/auto-provisioning-screen.png" alt-text="Screenshot of the auto provisioning configuration screen with the available options to select." lightbox="media/configure-servers-coverage/auto-provisioning-screen.png":::

1. Select **Apply**.

1. Select **Continue**.

## Configure vulnerability assessment for machines

Vulnerability assessment for machines allows you to select between two vulnerability assessment solutions:

- Microsoft Defender Vulnerability Management
- Microsoft Defender for Cloud integrated Qualys scanner

**To select either of the vulnerability assessment solutions**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. Locate the Defenders for Servers plan and select **Settings**.

1. On the vulnerability assessment for machines row, select **Edit configuration**.

    :::image type="content" source="media/configure-servers-coverage/vulnerability-edit.png" alt-text="Screenshot that shows you where to select edit for vulnerabilities assessment for machines." lightbox="media/configure-servers-coverage/vulnerability-edit.png":::

1. In the Extension deployment configuration window, select either of the solutions depending on your need.

1. Select **Apply**.

1. Select **Continue**.

## Configure endpoint protection

With Microsoft Defender for Servers, you enable the protections provided by [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint) to your server resources. Defender for Endpoint includes automatic agent deployment to your servers, and security data integration with Defender for Cloud.

To configure endpoint protection:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. Locate the Defenders for Servers plan and select **Settings**.

1. On the Endpoint protection row, toggle the switch to **On**.

1. Select **Continue**.

### The effect on Microsoft Defender for Endpoint deployment

The Microsoft Defender for Endpoint integration is included with Defender for Cloud's Defender for Servers plan. When you enable Defender for Endpoint within the plan, it triggers an automatic deployment to affiliated virtual machines (VMs) on the subscription. If a VM already has Defender for Endpoint deployed, it won't be redeployed.

To avoid unintentional agent deployments, exclude individual existing VMs before or at the same time you enable the plan at the subscription level. VMs on the exclusion list won't have Defender for Endpoint deployed when the plan is enabled.

It's recommended to exclude VMs during or shortly after creation to avoid unintentional deployments on a subscription with plan 1 or plan 2 already enabled.

> [!NOTE]
> Defender for Servers doesn't uninstall Defender for Endpoint deployments when you disable plan 1 or plan 2 at the subscription or resource level. To manually remove Defender for Endpoint on your machine, follow the [offboard devices](/microsoft-365/security/defender-endpoint/offboard-machines) steps.

## Configure agentless scanning for machines

Defender for Cloud has the ability to scan your Azure machines for installed software and vulnerabilities without requiring you to install agents, have network connectivity or affect your machine's performance.

**To configure agentless scanning for machines**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. Locate the Defenders for Servers plan and select **Settings**.

1. Locate the Agentless scanning for machines row.

1. Select **Edit configuration**.

    :::image type="content" source="media/configure-servers-coverage/agentless-scanning-edit.png" alt-text="Screenshot that shows where you need to select to edit the configuration of the agentless scanner." lightbox="media/configure-servers-coverage/agentless-scanning-edit.png":::

1. Enter a tag name and tag value for any machines to be excluded from scans.

1. Select **Apply**.

1. Select **Continue**.

Learn more about agentless scanning and how to [enable agentless scanning](enable-agentless-scanning-vms.md) on other cloud environments.

## Defender for Servers feature status

Defender for Cloud provides you with the ability to check if your resources have Defender for Cloud enabled on them.

**To check the coverage status of your resources**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Inventory**.

1. Locate the Defender for Cloud column:

    :::image type="content" source="media/configure-servers-coverage/select-inventory.png" alt-text="Screenshot that shows you where to select Inventory from the main menu." lightbox="media/configure-servers-coverage/select-inventory.png":::

> [!NOTE]
> Defender for Server's settings for each resource are inherited by the subscription-level settings by default. Once you change settings at the resource level, the resource will no longer inherit settings from its parent subscription unless you delete the settings you configured.

You can also check the coverage for all of all your subscriptions and resources using the [Coverage workbook](custom-dashboards-azure-workbooks.md#coverage-workbook).

## Disable Defender for Servers plan or features

To disable The Defender for Servers plan or any of the features of the plan, navigate to the Environment settings page of the relevant subscription or workspace and toggle the relevant switch to **Off**.

> [!NOTE]
> When you disable the Defender for Servers plan on a subscription, it doesn't disable it on a workspace. To disable the plan on a workspace, you must navigate to the plans page for the workspace and toggle the switch to **Off**.

### Disable Defender for Servers on the resource level

To disable The Defender for Servers plan or any of the features of the plan, navigate to the subscription or workspace and toggle the plan to **Off**.

On the resource level, you can enable or disable Defender for Servers plan 1. Plan 2 can only be disabled at the resource level

For example, it’s possible to enable Defender for Servers plan 2 at the subscription level and disable specific resources within the subscription. You can't enable plan 2 only on specific resources.

## Next steps

[Plan a Defender for Servers deployment](plan-defender-for-servers.md).
