---
title: Enable and configure the Defender for Storage plan at scale using the Azure portal
description: Learn how to enable the Defender for Storage on your Azure subscription for Microsoft Defender for Cloud using the Azure portal.
ms.topic: install-set-up-deploy
author: AlizaBernstein
ms.author: v-bernsteina
ms.date: 08/15/2023
---

# Enable and configure with the Azure portal

We recommend that you enable Defender for Storage on the subscription level. Doing so ensures all current and future storage accounts in the subscription are protected.

> [!TIP]
> You can always [configure specific storage accounts](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-subscription#override-defender-for-storage-subscription-level-settings) with custom configurations that differ from the settings configured at the subscription level (override subscription-level settings).

## [Enable on a subscription (recommended)](#tab/enable-subscription/)

To enable Defender for Storage at the subscription level using the Azure portal:

1. Sign in to the Azure portal.
1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select the subscription for which you want to enable Defender for Storage.

    :::image type="content" source="media/defender-for-storage-malware-scan/azure-portal-enablement-subscription.png" alt-text="Screenshot that shows where to select the subscription." lightbox="media/defender-for-storage-malware-scan/azure-portal-enablement-subscription.png":::

1. On the Defender plans page, locate **Storage** in the list and select **On** and **Save**. If you currently have Defender for Storage enabled with per-transaction pricing, select the **New pricing plan available** link and confirm the pricing change.

    :::image type="content" source="media/defender-for-storage-malware-scan/azure-portal-enablement-turn-on.png" alt-text="Screenshot that shows where to turn on Storage plan." lightbox="media/defender-for-storage-malware-scan/azure-portal-enablement-turn-on.png":::

Microsoft Defender for Storage is now enabled for this subscription, and is fully protected, including on-upload malware scanning and sensitive data threat detection.

If you want to turn off the on-upload malware scanning or sensitive data threat detection, you can select **Settings** and change the status of the relevant feature to **Off** and save the changes.

If you want to change the malware scanning size capping per storage account per month for malware, change the settings in **Edit configuration** and save the changes.

If you want to disable the plan, turn status button to **Off** for the Storage plan on the Defender plans page and save the changes.

## [Enable on a storage account](#tab/enable-storage-account/)

To enable and configure Microsoft Defender for Storage for a specific account using the Azure portal:

1. Sign in to the Azure portal.
1. Navigate to your storage account.
In the storage account menu, in the **Security + networking** section, select **Microsoft Defender for Cloud**.
1. On-upload Malware Scanning and Sensitive data threat detection are enabled by default. You can disable the features by unselecting them.
1. Select  **Enable on storage account**. Microsoft Defender for Storage is now enabled on this storage account.

    :::image type="content" source="media/defender-for-storage-malware-scan/azure-portal-enablement-on-storage-account.png" alt-text="Screenshot that shows where to enable the storage account." lightbox="media/defender-for-storage-malware-scan/azure-portal-enablement-on-storage-account.png":::

    > [!TIP]
    > To configure On-upload malware scanning settings, such as monthly capping, select Settings after Defender for Storage was enabled.

If you want to disable Defender for Storage on the storage account or disable one of the features (on-upload malware scanning or Sensitive data threat detection), select **Settings**, edit the settings, and select **Save**.

---

> [!TIP]
> Malware Scanning can be configured to send scanning results to the following: <br>  **Event Grid custom topic** - for near-real time automatic response based on every scanning result. Learn more how to [configure malware scanning to send scanning events to an Event Grid custom topic](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-storage-account#setting-up-event-grid-for-malware-scanning). <br> **Log Analytics workspace** - for storing every scan result in a centralized log repository for compliance and audit. Learn more how to [configure malware scanning to send scanning results to a Log Analytics workspace](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-storage-account#setting-up-logging-for-malware-scanning).

## Next steps

- Learn how to [enable and Configure the Defender for Storage plan at scale with an Azure built-in policy](defender-for-storage-policy-enablement.md).
- Learn more on how to [set up response for malware scanning](defender-for-storage-configure-malware-scan.md) results.