---
title: Enable SQL server-targeted Azure Monitoring Agent's autoprovisioning
description: Learn how to enable SQL Server-targeted Azure Monitoring Agent's autoprovisioning process for Defender for SQL.
ms.topic: install-set-up-deploy
ms.author: dacurwin
author: dcurwin
ms.date: 09/18/2023
---

# Enable SQL server-targeted Azure Monitoring Agent's (AMA) autoprovisioning process (PReview)

Microsoft Monitoring Agent (MMA) will be retired in August 2024. As a result, a new SQL Server-targeted Azure Monitoring Agent autoprovisioning process was released in Public Preview to replace the current process being deprecated. Learn more about the [Defender for SQL Server on machines Log Analytics Agent's upcoming deprecation plan](upcoming-changes.md#defender-for-sql-server-on-machines).

Customers who are using the Microsoft Monitoring Agent process will be asked to migrate to the SQL Server-targeted Azure Monitoring Agent (AMA) (Preview) autoprovisioning process process.

## Enable the autoprovisioning process

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. Under the Database plan, select **Settings**.

    :::image type="content" source="media/defender-sql-autoprovisioning/partial-settings.png" alt-text="Screenshot that shows where the option to select settings is on the Defender plans page." lightbox="media/defender-sql-autoprovisioning/partial-settings.png":::

1. Select **Edit configuration**.

    :::image type="content" source="media/defender-sql-autoprovisioning/edit-configuration.png" alt-text="Screenshot that shows where to select edit configuration on the settings and monitoring screen." lightbox="media/defender-sql-autoprovisioning/edit-configuration.png":::

1. Select **Azure Monitor Agent**.

    :::image type="content" source="media/defender-sql-autoprovisioning/azure-monitor-agent.png" alt-text="Screenshot that shows you where to select the Azure Monitor Agent on the screen." lightbox="media/defender-sql-autoprovisioning/azure-monitor-agent.png":::

1. Select either **Default workspace**. You can also learn how to [configure a custom workspace](#configure-custom-destination-log-analytics-workspace).

1. Select **Apply**.

Once the 