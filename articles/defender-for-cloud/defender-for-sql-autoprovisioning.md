---
title: Migrate to SQL server-targeted Azure Monitoring Agent's autoprovisioning process
description: Learn how to enable SQL server-targeted Azure Monitoring Agent's autoprovisioning process for Defender for SQL.
ms.topic: install-set-up-deploy
ms.author: dacurwin
author: dcurwin
ms.date: 09/21/2023
---

# Migrate to SQL server-targeted Azure Monitoring Agent's (AMA) autoprovisioning process

Microsoft Monitoring Agent (MMA) is being deprecated in August 2024. As a result, a new SQL server-targeted Azure Monitoring Agent (AMA) autoprovisioning process was released. You can learn more about the [Defender for SQL Server on machines Log Analytics Agent's deprecation plan](upcoming-changes.md#defender-for-sql-server-on-machines).

Customers who are using the current **Log Analytics agent/Azure Monitor agent** autoprovisioning process, should migrate to the new **Azure Monitoring Agent for SQL server on machines** autoprovisioning process. The migration process is seamless and provides continuous protection for all machines.

## Migrate to the SQL server-targeted AMA autoprovisioning process

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. Under the Databases plan, select **Action required**.
    :::image type="content" source="media/defender-sql-autoprovisioning/action-required.png" alt-text="Screenshot that shows where the option to select action required is on the Defender plans page." lightbox="media/defender-sql-autoprovisioning/action-required.png":::

    > [!NOTE]
    > If you do not see the action required button, under the Databases plan select **Settings** and then toggle the **Azure Monitoring Agent for SQL server on machines** option to **On**. Then select **Continue** > **Save**.
1. In the pop-up window, select **Enable**.

    :::image type="content" source="media/defender-sql-autoprovisioning/update-sql.png" alt-text="Screenshot that shows you where to select the Azure Monitor Agent on the screen." lightbox="media/defender-sql-autoprovisioning/update-sql.png":::

1. Select **Save**.

Once the SQL server-targeted AMA autoprovisioning process has been enabled, you should disable the **Log Analytics agent/Azure Monitor agent** autoprovisioning process.

> [!NOTE]
> If you have the Defender for Server plan enabled, you will need to [review the Defender for Servers Log Analytics deprecation plan](upcoming-changes.md#defender-for-servers) for Log Analytics agent/Azure Monitor agent dependency before disabling the process. 

## Disable the Log Analytics agent/Azure Monitor agent

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. Under the Database plan, select **Settings**.

1. Toggle the Log Analytics agent/Azure Monitor agent to **Off**.

    :::image type="content" source="media/defender-sql-autoprovisioning/toggle-to-off.png" alt-text="Screenshot that shows where the toggle is for the log analytics agent and the Azure monitor agent toggled to off." lightbox="media/defender-sql-autoprovisioning/toggle-to-off.png":::

1. Select **Continue**.

1. Select **Save**.

## Next steps

For related information, see these resources:
- [How Microsoft Defender for Azure SQL can protect SQL servers anywhere](https://www.youtube.com/watch?v=V7RdB6RSVpc).
- [Security alerts for SQL Database and Azure Synapse Analytics](alerts-reference.md#alerts-sql-db-and-warehouse)
- [Set up email notifications for security alerts](configure-email-notifications.md)
- [Learn more about Microsoft Sentinel](../sentinel/index.yml)
- Check out [common questions](faq-defender-for-databases.yml) about Defender for Databases.

