---
title: Enable and configure the Defender for Storage plan at scale with an Azure built-in policy
description: Learn how to enable the Microsoft Defender for Storage plan at scale with an Azure built-in policy.
ms.topic: install-set-up-deploy
author: AlizaBernstein
ms.author: v-bernsteina
ms.date: 08/15/2023
---

# Enable and configure at scale with an Azure built-in policy

Enabling Defender for Storage via a policy is recommended because it facilitates enablement at scale and ensures that a consistent security policy is applied across all existing and future storage accounts within the defined scope (such as entire management groups). This keeps the storage accounts protected with Defender for Storage according to the organization's defined configuration.

> [!TIP]
> You can always [configure specific storage accounts](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-subscription#override-defender-for-storage-subscription-level-settings) with custom configurations that differ from the settings configured at the subscription level (override subscription-level settings).

## Azure built-in policy

To enable and configure Defender for Storage at scale with an Azure built-in policy, follow these steps:

1. Sign in to the Azure portal and navigate to the **Policy** dashboard.
1. In the Policy dashboard, select **Definitions** from the left-side menu.
1. In the “Security Center” category, search for and then select **Configure Microsoft Defender for Storage to be enabled**. This policy enables all Defender for Storage capabilities: Activity Monitoring, Malware Scanning and Sensitive Data Threat Detection. You can also get it here: [List of built-in policy definitions](/azure/governance/policy/samples/built-in-policies#security-center). If you want to enable a policy without the configurable features, use **Configure basic Microsoft Defender for Storage to be enabled (Activity Monitoring only)**.
    
    :::image type="content" source="media/defender-for-storage-malware-scan/policy-definitions.png" alt-text="Screenshot that shows where to select policy definitions." lightbox="media/defender-for-storage-malware-scan/policy-definitions.png":::

1. Select the policy and review it.
1. Select **Assign** and edit the policy details. You can fine-tune, edit, and add custom rules to the policy.

    :::image type="content" source="media/defender-for-storage-malware-scan/policy-assign.png" alt-text="Screenshot that shows where to assign the policy." lightbox="media/defender-for-storage-malware-scan/policy-assign.png":::

1. Once you have completed reviewing, select **Review + create**.
1. Select **Create** to assign the policy.

> [!TIP]
> Malware Scanning can be configured to send scanning results to the following: <br>  **Event Grid custom topic** - for near-real time automatic response based on every scanning result. Learn more how to [configure malware scanning to send scanning events to an Event Grid custom topic](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-storage-account#setting-up-event-grid-for-malware-scanning). <br> **Log Analytics workspace** - for storing every scan result in a centralized log repository for compliance and audit. Learn more how to [configure malware scanning to send scanning results to a Log Analytics workspace](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-storage-account#setting-up-logging-for-malware-scanning).

Learn more on how to [set up response for malware scanning](defender-for-storage-configure-malware-scan.md) results.

## Next steps

Learn how to [enable and configure Microsoft Defender for Storage with IaC templates](defender-for-storage-infrastructure-as-code-enablement.md).