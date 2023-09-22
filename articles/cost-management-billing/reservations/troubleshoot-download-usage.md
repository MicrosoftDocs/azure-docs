---
title: Troubleshoot Azure reservation download usage details
description: This article helps you understand and troubleshoot why the reserved instance usage details download is unavailable in the Azure portal.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: reservations
ms.author: banders
ms.reviewer: nitinarora
ms.topic: troubleshooting
ms.date: 12/06/2022
---

# Troubleshoot Azure reservation download usage details

This article helps you understand and troubleshoot why the reserved instance usage details download is unavailable in the Azure portal.

## Symptoms

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to **Reservations**.
1. Select a reservation.
1. On the reservation overview page, the default view shows usage for the last seven days. You can select **Download as CSV** to download the reservation's usage details.
1. When you change the time range, the option to **Download as CSV** becomes unavailable.
    :::image type="content" source="./media/troubleshoot-download-usage/download-csv-unavailable.png" alt-text="Example showing Download as CSV being unavailable" lightbox="./media/troubleshoot-download-usage/download-csv-unavailable.png" :::

## Cause

Because of technical limitations, Azure doesn't support downloading data for more than a seven-day period. Lengthy periods for customers with large amounts of reservations generate large amounts of data. Returning data through APIs puts a strain on Azure resources.

## Solution

We understand that customers want to download data for longer periods. However, there's currently no way download reservation usage data for long periods.

## Next steps

- For more information about reservations, see [What are Azure Reservations?](save-compute-costs-reservations.md).