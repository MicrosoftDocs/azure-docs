---
title: Deploy Defender for Servers
description: Learn how to enable the Defender for Servers on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 02/05/2024
---

# Deploy Defender for Servers

Defender for Servers in Microsoft Defender for Cloud brings threat detection and advanced defenses to your Windows and Linux machines that run in Azure, Amazon Web Services (AWS), Google Cloud Platform (GCP), and on-premises environments. This plan includes the integrated license for Microsoft Defender for Endpoint, security baselines and OS level assessments, vulnerability assessment scanning, adaptive application controls (AAC), file integrity monitoring (FIM), and more.

Microsoft Defender for Servers includes an automatic, native integration with Microsoft Defender for Endpoint. Learn more, [Protect your endpoints with Defender for Cloud's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md). With this integration enabled, you have access to the vulnerability findings from **Microsoft Defender vulnerability management**.

Defender for Servers offers two plan options with different levels of protection and their own cost. You can learn more about Defender for Cloud's pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Review the [Defender for Servers deployment guide](plan-defender-for-servers.md).

## Enable the Defender for Servers plan

You can [enable the Defender for Servers plan on an Azure subscription, AWS account, or GCP project](#enable-on-an-azure-subscription-aws-account-or-gcp-project), [the Log Analytics workspace level](#enable-the-plan-at-the-log-analytics-workspace-level), or [enable the plan at the resource level](#enable-defender-for-servers-at-the-resource-level).

## Enable on an Azure subscription, AWS account, or GCP project

You can enable the Defender for Servers plan from the Environment settings page to protect all the machines in an Azure subscription, AWS account, or GCP project.

**To enable the Defender for Servers plan**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant Azure subscription, AWS account, or GCP project.

1. On the Defender plans page, toggle the Servers switch to **On**.

    :::image type="content" source="media/tutorial-enable-servers-plan/enable-servers-plan.png" alt-text="Screenshot that shows you how to toggle the Defender for Servers plan to on." lightbox="media/tutorial-enable-servers-plan/enable-servers-plan.png":::

After enabling the plan, you have the ability to [configure the features of the plan](configure-servers-coverage.md) to suit your needs. When you enable Defender for Servers on a subscription, it doesn't extend that coverage to an attached workspace. You need to [enable Defender for Servers on the Log Analytics workspace level](#enable-the-plan-at-the-log-analytics-workspace-level).

### Select a Defender for Servers plan

When you enable the Defender for Servers plan, you're then given the option to select which plan - Plan 1 or Plan 2 - to enable. There are two plans you can choose from that offer different levels of protections for your resources.

Compare the [available features](plan-defender-for-servers-select-plan.md#plan-features) provided by each plan.

**To select a Defender for Servers plan**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant Azure subscription, AWS account, or GCP project.

1. Select **Change plans**.

    :::image type="content" source="media/tutorial-enable-servers-plan/servers-change-plan.png" alt-text="Screenshot that shows you where on the environment settings page to select change plans." lightbox="media/tutorial-enable-servers-plan/servers-change-plan.png":::

1. In the popup window, select **Plan 2** or **Plan 1**.

    :::image type="content" source="media/tutorial-enable-servers-plan/servers-plan-selection.png" alt-text="Screenshot of the popup where you can select plan 1 or plan 2." lightbox="media/tutorial-enable-servers-plan/servers-plan-selection.png":::

1. Select **Confirm**.

1. Select **Save**.

After enabling the plan, you have the ability to [configure the features of the plan](configure-servers-coverage.md) to suit your needs.

## Enable the plan at the Log Analytics workspace level

When you enable Defender for Servers on your subscription, the coverage provided by Defender for Servers isn't automatically extended to your Log Analytics workspaces. You need to enable Defender for Servers on each workspace. Defender for Servers on workspaces only supports Plan 2.

**To enable Defender for Servers on the Log Analytics workspace**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant workspace.

1. Toggle the servers plan to **On**.

    :::image type="content" source="media/tutorial-enable-servers-plan/enable-workspace-servers.png" alt-text="Screenshot that shows the plan enablement page at the Log Analytics workspace level." lightbox="media/tutorial-enable-servers-plan/enable-workspace-servers.png":::

1. Select **Save**.

By enabling Defender for Servers on a Log Analytics workspace, you aren't enabling all of the security protections available. You can also protect your Log Analytics workspaces with [Foundational CSPM](tutorial-enable-cspm-plan.md) and [SQL servers on machines](defender-for-sql-usage.md).

> [!IMPORTANT]
> When you enable Defender for Servers on a workspace, all connected machines will automatically have Plan 2 enabled regardless of their connected subscription's settings.

## Enable Defender for Servers at the resource level

To protect all of your existing and future resources, we recommend you [enable Defender for Servers on your entire Azure subscription](#enable-on-an-azure-subscription-aws-account-or-gcp-project).

You can exclude specific resources or manage security configurations at a lower hierarchy level by enabling the Defender for Servers plan at the resource level. You can enable the plan on the resource level with REST API or at scale.

The supported resource types include:

- Azure VMs.
- On-premises with Azure Arc.
- Azure Virtual Machine Scale Sets Flex.

### Enable Defender for Servers at the resource level with REST API

The ability to enable or disable Defender for Servers at the resource level is available exclusively via REST API. Learn how to [interact with the API](/rest/api/defenderforcloud/pricings) to manage your Defender for Servers at the resource or subscription level.

After enabling the plan, you have the ability to [configure the features of the plan](configure-servers-coverage.md) to suit your needs.

### Enable Defender for Servers at the resource level at scale

Use the following base script file to customize it for your specific needs.

1. [Download and save this file](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Powershell%20scripts/Defender%20for%20Servers%20on%20resource%20level) as a PowerShell file.

1. Run the downloaded file.

1. Set pricing by **tag** or by **resource group**.

1. Follow the rest of the onscreen instructions.

After enabling the plan, you have the ability to [configure the features of the plan](configure-servers-coverage.md) to suit your needs.

## Next steps

[Configure Defender for Servers features](configure-servers-coverage.md).

[Overview of Microsoft Defender for Servers](defender-for-servers-introduction.md).
