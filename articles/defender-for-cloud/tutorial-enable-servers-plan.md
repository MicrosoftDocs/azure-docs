---
title: Deploy the Defender for Servers plan - Microsoft Defender for Cloud
titleSuffix: Microsoft Defender for Cloud
description: Learn how to enable the Defender for Servers on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/26/2023
---

# Deploy protection to your servers with Defender for Servers

Defender for Servers brings threat detection and advanced defenses to your Windows and Linux EC2 instances. This plan includes the integrated license for Microsoft Defender for Endpoint, security baselines and OS level assessments, vulnerability assessment scanning, adaptive application controls (AAC), file integrity monitoring (FIM), and more.

Microsoft Defender for Servers includes an automatic, native integration with Microsoft Defender for Endpoint. Learn more, [Protect your endpoints with Defender for Cloud's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md). With this integration enabled, you'll have access to the vulnerability findings from **Microsoft threat and vulnerability management**.

Defender for Servers offers two plan options with that offer different levels of protection and their own cost. You can learn more about Defender for Clouds pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/). 

## Prerequisites

- You'll need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

## Enable the Defender for Servers plan

You can enable the Defender for Servers plan on your Azure subscription, AWS account or GCP project to protect all of your resources within that subscription on the Environment settings page.

**To Enable the Defender for Servers plan**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, toggle the Servers switch to **On**.

    :::image type="content" source="media/tutorial-enable-servers-plan/enable-servers-plan.png" alt-text="Screenshot that shows you how to toggle the Defender for Servers plan to on." lightbox="media/tutorial-enable-servers-plan/enable-servers-plan.png":::

## Select a Defender for Servers plan

When you enable the Defender for Servers plan, you'll then be given the option to select which plan you want to enable. There are two plans you can choose from that offer different levels of protections for your resources. 

The following table summarizes what's included in each plan.

| Feature | Details | Defender for Servers Plan 1 | Defender for Servers Plan 2 |
|:---|:---|:---:|:---:|
| **Unified view** | The Defender for Cloud portal displays Defender for Endpoint alerts. You can then drill down into Defender for Endpoint portal, with additional information such as the alert process tree, the incident graph, and a detailed machine timeline showing historical data up to six months.| :::image type="icon" source="./media/icons/yes-icon.png":::  Available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Automatic MDE provisioning** | Automatic provisioning of Defender for Endpoint on Azure, AWS, and GCP resources. | :::image type="icon" source="./media/icons/yes-icon.png":::  Available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Microsoft Defender Vulnerability Management** |  Discover vulnerabilities and misconfigurations in real time with Microsoft Defender for Endpoint, without other agents or periodic scans. [Learn more](deploy-vulnerability-assessment-defender-vulnerability-management.md). | :::image type="icon" source="./media/icons/yes-icon.png":::  Available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Threat detection for OS-level (Agent-based)** | Defender for Servers and Microsoft Defender for Endpoint (MDE) detect threats at the OS level, including VM behavioral detections and **Fileless attack detection**, which generates detailed security alerts that accelerate alert triage, correlation, and downstream response time.<br>[Learn more](alerts-reference.md#alerts-windows) | :::image type="icon" source="./media/icons/yes-icon.png":::  Available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Threat detection for network-level (Agentless)** | Defender for Servers detects threats directed at the control plane on the network, including network-based detections for Azure virtual machines. | :::image type="icon" source="media/icons/no-icon.png" border="false"::: <br> Not available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Microsoft Defender Vulnerability Management Add-on** | See a deeper analysis of the security posture of your protected servers, including risks related to browser extensions, network shares, and digital certificates. [Learn more](deploy-vulnerability-assessment-defender-vulnerability-management.md). | :::image type="icon" source="media/icons/no-icon.png" border="false"::: <br> Not available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Security Policy and Regulatory Compliance** | Customize a security policy for your subscription and also compare the configuration of your resources with requirements in industry standards, regulations, and benchmarks. | :::image type="icon" source="media/icons/no-icon.png" border="false"::: <br> Not available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Integrated vulnerability assessment powered by Qualys** | Use the Qualys scanner for real-time identification of vulnerabilities in Azure and hybrid VMs. Everything's handled by Defender for Cloud. You don't need a Qualys license or even a Qualys account. [Learn more](deploy-vulnerability-assessment-vm.md). | :::image type="icon" source="media/icons/no-icon.png" border="false"::: <br> Not available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available  |
| **Log Analytics 500 MB free data ingestion** | Defender for Cloud uses Azure Monitor to collect data from Azure VMs and servers, using the Log Analytics agent. | :::image type="icon" source="media/icons/no-icon.png" border="false"::: <br> Not available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Adaptive application controls (AAC)** | [AACs](adaptive-application-controls.md) in Defender for Cloud define allowlists of known safe applications for machines.  | :::image type="icon" source="media/icons/no-icon.png" border="false"::: <br> Not available |:::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **File Integrity Monitoring (FIM)** | [FIM](file-integrity-monitoring-overview.md) (change monitoring) examines files and registries for changes that might indicate an attack. A comparison method is used to determine whether suspicious modifications have been made to files. | :::image type="icon" source="media/icons/no-icon.png" border="false"::: <br> Not available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Just-in-time VM access for management ports** | Defender for Cloud provides [JIT access](just-in-time-access-overview.md), locking down machine ports to reduce the machine's attack surface.| :::image type="icon" source="media/icons/no-icon.png" border="false"::: <br> Not available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Adaptive network hardening** | Filtering traffic to and from resources with network security groups (NSG) improves your network security posture. You can further improve security by [hardening the NSG rules](adaptive-network-hardening.md) based on actual traffic patterns. | :::image type="icon" source="media/icons/no-icon.png" border="false"::: <br> Not available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |
| **Docker host hardening** | Defender for Cloud assesses containers hosted on Linux machines running Docker containers, and compares them with the Center for Internet Security (CIS) Docker Benchmark. [Learn more](harden-docker-hosts.md). | :::image type="icon" source="media/icons/no-icon.png" border="false"::: <br> Not available | :::image type="icon" source="./media/icons/yes-icon.png":::  Available |

If you would like to learn more about the different plan options for Defender for Servers, you can see [Overview of Microsoft Defender for Servers](defender-for-servers-introduction.md).

**To select a Defender for Servers plan**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant Azure subscription, AWS account or GCP project.

1. Select **Change plans**.

    :::image type="content" source="media/tutorial-enable-servers-plan/servers-change-plan.png" alt-text="Screnshot that shows you where on the environment settings page to select change plans." lightbox="media/tutorial-enable-servers-plan/servers-change-plan.png":::

1. In the popup window, select **Plan 2** or **Plan 1**.

    :::image type="content" source="media/tutorial-enable-servers-plan/servers-plan-selection.png" alt-text="Screenshot of the popup where you can select plan 1 or plan 2.":::

1. Select **Confirm**.

## Configure monitoring coverage

There are three components that can be enabled and configured to provide extra protections to your environments in the Defender for Servers plans.

| Component | Description | Learn more |
|--|--|--|
| Log Analytics agent/Azure Monitor agent | Collects security-related configurations and event logs from the machine and stores the |data in your Log Analytics workspace for analysis. | [Learn more](../azure-monitor/agents/log-analytics-agent.md) about the Log Analytics agent. |
| Vulnerability assessment for machines | Enables vulnerability assessment on your Azure and hybrid machines. | [Learn more](monitoring-components.md) about how Defender for Cloud collects data. |
| Agentless scanning for machines (preview) | Scans your machines for installed software and vulnerabilities without relying on agents or impacting machine performance. | [Learn more](concept-agentless-data-collection.md) about agentless scanning for machines. |

Toggle the corresponding switch to **On**, to enable any of these options.

:::image type="content" source="media/tutorial-enable-servers-plan/compnents-on.png" alt-text="Screenshot that shows where you need to select On, in order to enable each component of the servers plan." lightbox="media/tutorial-enable-servers-plan/compnents-on.png":::

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

## Clean up resources

There's no need to clean up any resources for this tutorial.

## Next steps

[Overview of Microsoft Defender for Servers](defender-for-servers-introduction.md)
