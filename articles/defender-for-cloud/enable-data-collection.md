---
title: Configure monitoring extensions for Microsoft Defender for Cloud
description: Learn how to set up the monitoring extensions, such as Azure Monitor Agent (AMA), used by Microsoft Defender for Cloud.
author: bmansheim
ms.author: benmansheim
ms.topic: quickstart
ms.date: 09/12/2022
ms.custom: mode-other
---
# Configure auto provisioning for agents and extensions from Microsoft Defender for Cloud

Microsoft Defender for Cloud uses monitoring extensions, such as Azure Monitor Agent, to collect data from your resources. Each Defender plan has its own requirements for monitoring extensions, so you need to make sure that the required extensions are deployed to your resources to get all of the benefits of each plan. When an extension is on, the extension is installed on existing machines and on new machines that are created in the subscription.

If you manually turn on an extension, Defender for Cloud automatically deploys that extension to your resources. When you turn off an extension, the extension isn't installed on new machines, but it's also not uninstalled from existing machines.

The Defender plans show you the monitoring coverage for each Defender plan, and you can configure monitoring settings for some plans.

:::image type="content" source="media/enable-data-collection/defender-plans.png" alt-text="Screenshot of monitoring coverage of Microsoft Defender for Cloud extensions." lightbox="media/enable-data-collection/defender-plans.png":::

The available extensions are:

- [Azure Monitor Agent](extensions-azure-monitor-agent.md)
- [Log Analytics agent](extensions-log-analytics-agent.md)
- [Microsoft Defender for Endpoint](extensions-defender-for-endpoint.md)
- [Vulnerability assessment](extensions-vulnerability-assessment.md)
- [Defender for Containers](extensions-defender-for-containers.md)
- [Guest Configuration](extensions-guest-configuration.md)

## Prerequisites

To get started with Defender for Cloud, you'll need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

## Enable monitoring extensions



<a name="offprovisioning"></a>

To turn off monitoring extensions of an agent:

- Go to the Defender plans and turn off the plan that uses the extension and select **Save**.
- For Defender plans that have monitoring settings, go to the settings of the Defender plan, turn off the extension, and select **Save**.

> [!NOTE]
>  Disabling auto provisioning does not remove the extensions from the effected workloads. For information on removing the OMS extension, see [How do I remove OMS extensions installed by Defender for Cloud](./faq-data-collection-agents.yml#how-do-i-remove-oms-extensions-installed-by-defender-for-cloud-).
>

## Troubleshooting

- To identify monitoring agent network requirements, see [Troubleshooting monitoring agent network requirements](troubleshooting-guide.md#mon-network-req).
- To identify manual onboarding issues, see [How to troubleshoot Operations Management Suite onboarding issues](https://support.microsoft.com/help/3126513/how-to-troubleshoot-operations-management-suite-onboarding-issues).

## Next steps

This page explained how to enable monitoring extensions. Learn more about:

- Defender for Cloud [monitoring extensions](extensions-overview.md)
- [Setting up email notifications](configure-email-notifications.md) for security alerts
- Protecting workloads with [enhanced security features](enhanced-security-features-overview.md)