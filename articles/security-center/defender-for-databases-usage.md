---
title: Setting up and responding to alerts from Azure Defender for open-source relational databases
description: Learn how to configure Azure Defender for open-source relational databases to detect anomalous database activities indicating potential security threats to the database.
author: memildin
ms.author: memildin
ms.date: 06/17/2021
ms.topic: how-to
ms.service: security-center
manager: rkarlin
---
# Enable Azure Defender for open-source relational databases and respond to alerts

Azure Defender detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases for the following services:

- [Azure Database for PostgreSQL](../postgresql/index.yml)
- [Azure Database for MySQL](../mysql/index.yml)
- [Azure Database for MariaDB](../mariadb/index.yml)

To get alerts from the Azure Defender plan you'll first need to enable it as [shown below](#enable-azure-defender).

Learn more about this Azure Defender plan in [Introduction to Azure Defender for open-source relational databases](defender-for-databases-introduction.md).

## Enable Azure Defender

1. From [the Azure portal](https://portal.azure.com), open the configuration page of the database server you want to protect.

1. From the security menu on the left, select **Security Center**.

1. If Azure Defender isn't enabled, you'll see a button as shown in the following screenshot. Select **Enable Azure Defender for [Database type]** (for example, "Azure Defender for MySQL") and select **Save**.

    :::image type="content" source="media/defender-for-databases-usage/enable-defender-for-mysql.png" alt-text="Enable Azure Defender for MySQL." lightbox="media/defender-for-databases-usage/enable-defender-for-mysql.png":::

    > [!TIP]
    > This page in the portal will be the same regardless of the database type (PostgreSQL, MySQL, or MariaDB).

## Respond to security alerts

When Azure Defender is enabled on your database, it detects anomalous activities and generates alerts. These alerts are available from multiple locations, including:

- In the Azure portal:
    - **Azure Defender security alerts page** - Shows alerts for all resources protected by Azure Defender in the subscriptions you've got permissions to view.
    - The resource's **Security Center** page - Shows alerts and recommendations for one specific resource, as shown above in [Enable Azure Defender](#enable-azure-defender).
- In the inbox of whoever in your organization has been [designated to receive email alerts](security-center-provide-security-contact-details.md).  

> [!TIP]
> A live tile on [Azure Security Center's overview dashboard](overview-page.md) tracks the status of active threats to all your resources including databases. Select the tile to launch the Azure Defender alerts page and get an overview of active threats detected on your databases.
>
> For detailed steps and the recommended method to respond to Azure Defender alerts, see [Respond to a security alert](tutorial-security-incident.md#respond-to-a-security-alert).


### Respond to email notifications of security alerts

Azure Defender sends email notifications when it detects anomalous database activities. The email includes details of the suspicious security event such as the nature of the anomalous activities, database name, server name, application name, and event time. The email also provides information on possible causes and recommended actions to investigate and mitigate any potential threats to the database.

1. Select the **View the full alert** link in the email to launch the Azure portal and show the alerts page, which provides an overview of active threats detected on the database.
    
    :::image type="content" source="media/defender-for-databases-usage/suspected-brute-force-attack-notification-email.png" alt-text="Azure Defender's email notification about a suspected brute force attack.":::

    View active threats at the subscription level from within the Security Center portal pages:

    :::image type="content" source="media/defender-for-databases-usage/db-alerts-page.png" alt-text="Active threats on one or more subscriptions are shown in Azure Security Center." lightbox="media/defender-for-databases-usage/db-alerts-page.png":::

1. For additional details and recommended actions for investigating the current threat and remediating future threats, select a specific alert.
    
    :::image type="content" source="media/defender-for-databases-usage/specific-alert-details.png" alt-text="Details of a specific alert." lightbox="media/defender-for-databases-usage/specific-alert-details.png":::


> [!TIP]
> For a detailed tutorial on how to handle your alerts, see [Tutorial: Triage, investigate, and respond to security alerts](tutorial-security-incident.md).


## Next steps

- [Automate responses to Security Center triggers](workflow-automation.md)
- [Stream alerts to a SIEM, SOAR, or ITSM solution](export-to-siem.md)
- [Suppress alerts from Azure Defender](alerts-suppression-rules.md)