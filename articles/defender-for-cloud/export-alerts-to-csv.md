---
title: Download a CSV report
description: Learn how to download and export your alerts and recommendations to a CSV file from Microsoft Defender for Cloud.
author: Elazark
ms.author: Elkrieger
ms.topic: how-to
ms.date: 03/19/2024
#customer intent: As a user, I want to learn how to download a CSV report of all alerts from Microsoft Defender for Cloud so that I can analyze the data.
---

# Download a CSV report

Microsoft Defender for Cloud has the ability to export all alerts and recommendations to a CSV file. This feature is useful when you want to analyze the data in a different tool or share it with others.

> [!TIP]
> Due to Azure Resource Graph limitations, the reports are limited to a file size of 13,000 rows. If you see errors related to too much data being exported, try limiting the output by selecting a smaller set of subscriptions to be exported.

> [!NOTE]
> These reports contain alerts and recommendations for resources from the currently selected subscriptions.

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

## Export alerts to a CSV file

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Security alerts**.

1. Select **Download CSV report**.

    :::image type="content" source="./media/export-alerts-to-csv/download-report.png" alt-text="Screenshot that shows how to download alerts data as a CSV file." lightbox="./media/export-alerts-to-csv/download-report.png":::

## Export recommendations to a CSV file

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Recommendations**.

1. Select **Download CSV report**.

## Next step

> [!div class="nextstepaction"]
> [Security alerts schemas](alerts-schemas.md)
