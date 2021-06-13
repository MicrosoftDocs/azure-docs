---
title: Setting up and responding to alerts from Azure Defender for open-source relational databases
description: Learn how to configure Azure Defender for open-source relational databases to detect anomalous database activities indicating potential security threats to the database.
author: memildin
ms.author: memildin
ms.date: 06/13/2021
ms.topic: how-to
ms.service: security-center
manager: rkarlin
---
# Configure threat protection alerts for your open-source relational databases  

Azure Defender for open-source relational databases detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases in the following open-source relational databases:

- [Azure Database for PostgreSQL](../postgresql/index.yml)
- [Azure Database for MySQL](../mysql/index.yml)
- [Azure Database for MariaDB](../mariadb/index.yml)

Learn more about this Azure Defender plan in [Introduction to Azure Defender for open-source relational databases](defender-for-databases-introduction.md).

## Enable Azure Defender
1. From [the Azure portal](https://portal.azure.com), open the configuration page of the database server you want to protect.
1. From the security settings, select **Azure Defender for [Database type]**. For example, "Azure Defender for MySQL".
1. Enable Azure Defender and select **Save**.

    :::image type="content" source="media/defender-for-databases-usage/enable-defender-for-mysql.png" alt-text="Enable Azure Defender for MySQL":::

    :::image type="content" source="media/defender-for-databases-usage/enable-defender-for-postgresql.png" alt-text="Enable Azure Defender for PostgreSQL":::

## Explore anomalous database activities

Azure Defender sends email notifications when it detects anomalous database activities. The email includes details of the suspicious security event such as:

- the nature of the anomalous activities, 
- database name
- server name
- application name
- event time

The email also provides information on possible causes and recommended actions to investigate and mitigate any potential threats to the database.
 
1. Select the **View recent alerts** link in the email to launch the Azure portal and show the Azure Security Center alerts page, which provides an overview of active threats detected on the database.
    
    :::image type="content" source="media/defender-for-databases-usage/anomalous-activity-report.png" alt-text="Anomalous activity report":::

    View active threats:

    :::image type="content" source="media/security-center-managing-and-responding-alerts/alerts-page.png" alt-text="Active threats":::


2. For additional details and recommended actions for investigating this threat and remediating future threats, select a specific alert.
    
    :::image type="content" source="media/defender-for-databases-usage/specific-alert.png" alt-text="Specific alert":::

## Explore threat detection alerts

Azure Defender alerts are integrated into [Azure Security Center](https://azure.microsoft.com/services/security-center/). A live Azure Defender tile on [Security Center's overview dashboard](overview-page.md) tracks the status of active threats to all your resources including databases.

Select the tile to launch the Azure Security Center alerts page and get an overview of active threats detected on your databases.

For detailed steps and the recommended method to respond to Azure Defender alerts, see [Respond to a security alert](tutorial-security-incident.md#respond-to-a-security-alert).

## Next steps

* Learn more about [Azure Security Center](../security-center/security-center-introduction.md)
* Learn about [the benefits of Azure Defender](azure-defender.md)