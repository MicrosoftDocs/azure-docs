---
title: Trigger test alert for Defender for Storage - Microsoft Defender for Cloud
description: Learn how to create a test alert for Defender for Storage.
author: bmansheim
ms.author: benmansheim
ms.date: 06/16/2022
ms.topic: how-to
---

# Trigger a test alert for Microsoft Defender for Storage

After you enable Defender for Storage, you can create a test alert to demonstrate how Defender for Storage recognizes and alerts on security risks.

## Demonstrate Defender for Storage alerts

To test the security alerts from Microsoft Defender for Storage in your environment, generate the alert "Access from a Tor exit node to a storage account" with the following steps:

1. Open a storage account with [Microsoft Defender for Storage enabled](../storage/common/azure-defender-storage-configure.md).
1. From the sidebar, select “Containers” and open an existing container or create a new one.

    :::image type="content" source="media/defender-for-storage-introduction/opening-storage-container.png" alt-text="Opening a blob container from an Azure Storage account." lightbox="media/defender-for-storage-introduction/opening-storage-container.png":::

1. Upload a file to that container.

    > [!CAUTION]
    > Don't upload a file containing sensitive data.

1. Use the context menu on the uploaded file to select “Generate SAS”.

    :::image type="content" source="media/defender-for-storage-introduction/generate-sas.png" alt-text="The generate SAS option for a file in a blob container.":::

1. Leave the default options and select **Generate SAS token and URL**.

1. Copy the generated SAS URL.

1. On your local machine, open the Tor browser.

    > [!TIP]
    > You can download Tor from the Tor Project site [https://www.torproject.org/download/](https://www.torproject.org/download/).

1. In the Tor browser, navigate to the SAS URL.

1. Download the file you uploaded in step 3.

    Within two hours you'll get the following security alert from Defender for Cloud:

    :::image type="content" source="media/defender-for-storage-introduction/tor-access-alert-storage.png" alt-text="Security alert regarding access from a Tor exit node.":::

## Next steps

For information about how to use Defender for Cloud alerts in your security management processes: 

- [The full list of Microsoft Defender for Storage alerts](alerts-reference.md#alerts-azurestorage)
- [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md)
- [Save Storage telemetry for investigation](../azure-monitor/essentials/diagnostic-settings.md)