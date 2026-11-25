---
title: Configure Azure Bastion RDP/SSH Vision (Preview)
description: Learn how Azure Bastion RDP Vision and SSH Vision use AI to analyze RDP session recordings and SSH command logs, and how to enable them and review their insights.
author: mialdrid
ms.author: allensu
ms.service: azure-bastion
ms.topic: how-to
ms.date: 11/03/2026
ms.custom: references_regions, ignite-2026
# Customer intent: "As a cloud administrator, I want to use AI to analyze recorded Bastion RDP sessions and SSH command logs, so that I can quickly find potentially risky activity and validate it against the original session evidence."
---

# Configure RDP/SSH Vision (Preview)

This article explains how Azure Bastion RDP Vision and SSH Vision work, and helps you enable them and review the insights that they provide.

> [!IMPORTANT]
> RDP Vision, SSH Vision, and SSH command logging are currently in preview. To learn about the legal terms that apply to Azure features that are in preview, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How RDP Vision and SSH Vision work

RDP Vision and SSH Vision provide AI-generated insights based on graphical RDP session recordings and SSH command logs. After a session ends, Bastion reviews the session data, identifies potentially risky behavior, and surfaces it in the Azure portal. Instead of watching an entire recording or reading through every command that was run, you can go straight to the activity that might need your attention.

| | RDP Vision | SSH Vision |
| --- | --- | --- |
| **Analyzes** | Graphical [session recordings](session-recording.md) of RDP sessions | Command logs of SSH sessions |
| **Requires** | Session recording | Command logging |
| **Points you to** | The exact time in the recording when the activity occurred | The exact command that was run |
| **You validate by** | Opening the recording at that point | Finding the command in the SSH log |

For each analyzed session, the AI insights include:

* **A session summary**: A short description of what happened during the session, and why any of the activity might be risky.
* **An overall risk level**: The highest level of risk identified in the session, so you can decide which sessions to review first.
* **Categorized risky actions**: Each action identified as potentially risky is assigned a category, such as *Privilege escalation* or *Suspicious user behavior*, a severity level, such as **High** or **Medium**, and a confidence level.
* **The exact evidence**: For RDP sessions, the time range in the recording when each action occurred. For SSH sessions, the exact command that was run.

You then review the original evidence to confirm what happened. For an RDP insight, you open the recording at the point where the activity occurred. For an SSH insight, you find the command in the session's command log and review it along with the commands around it.

Examples of potentially risky activity that RDP Vision and SSH Vision can surface include:

* Adding a user account to the local Administrators group.
* Disabling host firewall protection on a virtual machine.
* Storing application secrets or credentials in a plain-text file.
* Attempting to run commands with elevated privileges, or to change sudo configuration, from an SSH session.

RDP Vision and SSH Vision analyze sessions after they end. They don't block activity or end sessions while they're in progress, and insights are intended to help you prioritize your investigation, not to replace your review of the original evidence.

## Considerations

* This feature requires the Premium SKU.
* Analysis runs after a session ends. RDP Vision and SSH Vision don't block activity or end sessions while they're in progress.
* Only sessions recorded after you enable RDP Vision or SSH Vision are analyzed. Sessions recorded earlier aren't analyzed.
* Insights are AI-generated and might not identify all risky activity. Use insights to prioritize your investigation, and validate each insight against the original recording or command log.
* You can't currently customize the behaviors that RDP Vision and SSH Vision detect.
* Session recording applies to RDP and SSH connections together. You can't enable session recording for only one protocol.
* Session recording and command logging aren't available via native client at this time. Sessions made via native client aren't analyzed.
* Command logs are written to the same storage container that's used for session recording.
* The [session recording considerations](session-recording.md#considerations) also apply to RDP Vision and SSH Vision.
* You can currently configure RDP Vision, SSH Vision, and command logging only in the Azure portal.

## Prerequisites

* To use RDP Vision and SSH Vision during preview, access the Azure portal at [https://preview.portal.azure.com](https://preview.portal.azure.com).
* Azure Bastion is deployed, or you plan to deploy it, to a virtual network in a [supported region](#supported-regions). See [Quickstart: Deploy Azure Bastion from the Azure portal](quickstart-host-portal.md) for steps.
* Bastion is configured to use the **Premium SKU** for this feature. To check your SKU and upgrade it if necessary, see [View or upgrade a SKU](upgrade-sku.md).
* A storage account container is configured for session recording, and Bastion can access it by using a managed identity (recommended) or a SAS URL. For steps, see [Configure storage account container](session-recording.md#configure-storage-account-container) and [Configure storage access](session-recording.md#config-storage).
* The virtual machine that you connect to is either deployed to the virtual network that contains the bastion host or to a virtual network that is directly peered to the Bastion virtual network.
* To view recordings, command logs, and analysis results, users must have the **Storage Blob Data Reader** role on the storage account.

## Supported regions

During preview, RDP Vision, SSH Vision, and command logging are available in the following regions:

* Central US EUAP
* East Asia
* East US 2 EUAP
* UK South
* West Central US

## Enable RDP Vision and SSH Vision

Use the **Configuration** page of your bastion host to enable RDP Vision, SSH Vision, and the session data that each one analyzes. The settings are grouped by protocol:

| Group | Setting | What it does | Required for |
| --- | --- | --- | --- |
| **RDP Auditing** | Session Recording | Records and stores graphical VM sessions. | RDP Vision |
| **RDP Auditing** | RDP Vision (Preview) | Uses AI to analyze session recordings and generate security insights and anomaly reports. | |
| **SSH Auditing** | Session Recording | The same setting as Session Recording under RDP Auditing. Selecting it in either group enables recording for both protocols. | |
| **SSH Auditing** | Command Logging (Preview) | Captures all SSH commands run during sessions, for compliance and security auditing. | SSH Vision |
| **SSH Auditing** | SSH Vision (Preview) | Uses AI to analyze SSH command logs and detect suspicious activity or policy violations. | |

You can enable RDP Vision and SSH Vision when you create a new bastion host, or you can configure them later, after deploying Bastion.

### Steps for new Bastion deployments

When you manually configure and deploy a bastion host, you can enable RDP Vision and SSH Vision at the time of deployment. For comprehensive steps to deploy Bastion, see [Deploy Bastion from the Azure portal](quickstart-host-portal.md).

> [!IMPORTANT]
> If you enable RDP Vision or SSH Vision when you create a bastion host, you must also configure the target storage container and the identity that Bastion uses to access it during the same deployment. The deployment fails if RDP Vision or SSH Vision is enabled without the storage resource and identity configuration. Before you start, [create the storage account and container](session-recording.md#configure-storage-account-container). After the bastion host is deployed and its DNS name is available, follow the CORS configuration steps in the same section before viewing recordings.

1. In the [Azure portal](https://preview.portal.azure.com), select **Create a Resource**.
1. Search for **Azure Bastion** and select **Create**.
1. Fill in the values by using manual settings, and ensure you select a [supported region](#supported-regions) and the **Premium SKU**.
1. Select the features that you want to enable:
   1. For RDP Vision, under **RDP Auditing**, select **Session Recording** and **RDP Vision (Preview)**.
   1. For SSH Vision, under **SSH Auditing**, select **Command Logging (Preview)** and **SSH Vision (Preview)**.
1. Specify the storage container and the identity that Bastion uses to access it.
1. Review your details and select **Create**. Bastion immediately begins creating your bastion host. This process takes about 10 minutes to complete.

### Steps for existing Bastion deployments

If you already deployed Bastion, ensure that the [storage container and storage access](#prerequisites) are configured. Then use the following steps to enable RDP Vision and SSH Vision.

1. In the [Azure portal](https://preview.portal.azure.com), go to your Bastion resource.
1. In the left pane, under **Settings**, select **Configuration**.
1. For Tier, select **Premium** if it isn't already selected. These features require the Premium SKU.
1. To enable RDP Vision:
   1. Under **RDP Auditing**, select **Session Recording** if it isn't already selected.
   1. Select **RDP Vision (Preview)**.
1. To enable SSH Vision:
   1. Under **SSH Auditing**, select **Command Logging (Preview)**.
   1. Select **SSH Vision (Preview)**.
1. Select **Apply**. Bastion immediately begins updating the settings for your bastion host. Updates take about 10 minutes.

After you enable RDP Vision or SSH Vision, Bastion analyzes each new session after it ends. Bastions don't analyze sessions recorded before you enabled RDP Vision or SSH Vision.

> [!NOTE]
> The time it takes RDP Vision and SSH Vision to process RDP recordings and SSH command logs varies.

## View RDP Vision and SSH Vision results

You can view AI analysis results on the **Session recordings** page of your bastion host, alongside your recordings.

1. In the [Azure portal](https://preview.portal.azure.com), go to your **Bastion** host.
1. In the left pane, under **Settings**, select **Session recordings**.

   The page shows the storage account and container that Bastion uses, and lists your recorded sessions. For each session, the list shows the session name, protocol, a **View recording** link (and, for SSH sessions, a **View SSH logs** link), a **View AI analysis** link in the **Session Insights** column, the session length, and the date the session was created. To find a session, search by session name prefix. The search is case-sensitive.

1. For the session that you want to review, select **View AI analysis**. The **Protocol** column shows whether a session is RDP or SSH. For RDP sessions, **View AI analysis** opens the RDP Vision insights. For SSH sessions, it opens the SSH Vision insights.

   If **View AI analysis** isn't shown for a session, the session was recorded before RDP Vision or SSH Vision was enabled, or the analysis is still processing. To check for new results, select **Refresh**.

Each analysis opens with an overview of the session:

* **Overall risk**: The highest risk level identified in the session, such as **High risk** or **Medium risk**.
* **Data analyzed**: The type of data that was analyzed (**Graphical recording** for RDP or **SSH commands** for SSH) and the number of events or commands that were identified.
* **Severity counts**: The number of insights at each severity level.
* **Summary**: A description of the activity in the session and why parts of it might be risky.

### Review RDP Vision insights

For RDP sessions, the **Insights Timeline** lists each insight in the order it occurred during the session.

Each insight includes the following information:

| Field | Description |
| --- | --- |
| Time range | The start and end time of the activity in the recording. |
| Severity | How critical the activity might be, such as **High** or **Medium**. |
| Description | A short description of the activity. |
| Category | The type of activity, such as *Suspicious user behavior* or *Privilege escalation*. |
| Confidence | How confident the analysis is in the insight. |
| Thumbnail | A frame from the recording at the time of the activity. |

To validate an insight, select **Launch Recording Player**. The recording opens at the point where the activity occurred, so you can review the user's actions in context.

### Review SSH Vision insights

For SSH sessions, the **Commands** list shows each command that SSH Vision identified as potentially risky.

Each command includes the following information:

| Field | Description |
| --- | --- |
| Command | The command that you ran. Select the copy icon to copy the command. |
| Description | What the command attempted to do and its result. |
| Category | The type of activity, such as *Privilege escalation attempt* or *User creation*. |
| Severity | How critical the command might be, such as **Medium**. |
| Confidence | How confident the analysis is in the insight. |

To validate an insight:

1. Select the copy icon next to the command.
1. On the **Session recordings** page, for the same session, select **View SSH logs** to open the command log.
1. Search for the command to review it in context with the commands around it.

## Pricing

Billing for RDP Vision and SSH Vision isn't active during the current preview. Standard charges for your Bastion Premium deployment and your storage account still apply. For Bastion pricing, see [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion/).

## Next steps

* Learn how to [configure Bastion session recording](session-recording.md) and set up storage access.
* Learn about [Azure Bastion configuration settings](configuration-settings.md), including [RDP Vision and SSH Vision](configuration-settings.md#vision).
* Learn about the different [Azure Bastion SKU tiers](bastion-sku-comparison.md) and choose the right one for your requirements.
* Learn about [frequently asked questions for Azure Bastion](bastion-faq.md).
