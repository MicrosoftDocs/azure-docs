---
title: Enable SAP ASE native compression from Azure Backup 
description: In this article, you'll learn how to enable SAP ASE native compression from Azure Backup.
ms.topic: how-to
ms.date: 11/12/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Enable SAP ASE native compression from Azure Backup

Data compression in SAP ASE reduces storage consumption, accelerates backup and restore times, and enhances overall performance. It is supported for full, differential, and log backups, offering multiple compression levels to balance between performance and storage savings based on your priorities.

## How to Use Compression

You can enable or disable compression in the following scenarios:

1. **Backup Policy Creation**: Configure compression while setting up a backup policy for the database.

    :::image type="content" source="media/enable-native-compression/create-policy.png" alt-text="Screenshot showing how to create backup policy.":::

2. **Ad Hoc Backup**: Enable or disable compression when performing an on-demand backup.

    :::image type="content" source="media/enable-native-compression/enable-compression.png" alt-text="Screenshot showing how to enable compression.":::

## Compression Levels

SAP ASE supports various compression levels, allowing you to choose based on your specific needs:
- **Levels 1-3**: Optimized for faster compression and decompression, prioritizing performance.
- **Levels 4-6**: A balanced approach between performance and storage efficiency.
- **Levels 7-9**: Maximizes storage savings with increased CPU usage.
- **Level 100**: Specialized for certain data types.
- **Level 101**: Advanced compression designed for improved performance with specific data patterns.

## Recommended Setup

For best results, we recommend using compression level 101. When the pre-registration script runs, it adds the compressionLevel parameter to the configuration file, with the default set to 101. You can modify this based on your needs.

## Changing the Compression Level

There are two ways to update the compression level:

- **Pre-registration script**: Run the script with the compression-level parameter and specify your desired value.

>[!Note]
>This parameter is optional.

- **Configuration file**: Manually update the compressionLevel value in the configuration file at the following path: */opt/msawb/etc/config/SAPAse/config.json*

>[!Note]
> By setting the above ASE parameters will lead to increased memory and CPU utilization. We recommend that you monitor the memory consumption and CPU utilization as overutilization might negatively impact the backup and other ASE operations.

## Next steps
