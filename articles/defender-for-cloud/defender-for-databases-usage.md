---
title: Respond to Defender open-source database alerts
description: Configure Microsoft Defender for open-source relational databases to detect potential security threats.
ms.date: 05/01/2024
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
#customer intent: As a reader, I want to learn how to configure Microsoft Defender for open-source relational databases to enhance the security of my databases.
---

# Respond to Defender open-source database alerts

Microsoft Defender for Cloud detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases for the following services:

- [Azure Database for PostgreSQL](../postgresql/index.yml)
- [Azure Database for MySQL](../mysql/index.yml)
- [Azure Database for MariaDB](../mariadb/index.yml)

and for RDS instances on AWS (Preview):

- Aurora PostgreSQL
- Aurora MySQL
- PostgreSQL
- MySQL
- MariaDB

To get alerts from the Microsoft Defender plan you'll first need to enable Defender for open-source relational databases on your [Azure](enable-defender-for-databases-azure.md) or [AWS](enable-defender-for-databases-aws.md) account.

Learn more about this Microsoft Defender plan in [Overview of Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- **AWS users only** - Connect your [AWS account](quickstart-onboard-aws.md).

## Respond to alerts in Defender for Cloud

When Microsoft Defender for Cloud is enabled on your database, it detects anomalous activities and generates alerts. These alerts are available from multiple locations, including:

- In the Azure portal:
  - **Microsoft Defender for Cloud's security alerts page** - Shows alerts for all resources protected by Defender for Cloud in the subscriptions you've got permissions to view.
  - The resource's **Microsoft Defender for Cloud** page - Shows alerts and recommendations for one specific resource.

- In the inbox of whoever in your organization has been [designated to receive email alerts](configure-email-notifications.md).  

> [!TIP]
> A live tile on [Microsoft Defender for Cloud's overview dashboard](overview-page.md) tracks the status of active threats to all your resources including databases. Select the security alerts tile to go to the Defender for Cloud security alerts page and get an overview of active threats detected on your databases.
>
> For detailed steps and the recommended method to respond to security alerts, see [Respond to a security alert](managing-and-responding-alerts.yml#respond-to-a-security-alert).

### Respond to email notifications of security alerts

Defender for Cloud sends email notifications when it detects anomalous database activities. The email includes details of the suspicious security event such as the nature of the anomalous activities, database name, server name, application name, and event time. The email also provides information on possible causes and recommended actions to investigate and mitigate any potential threats to the database.

1. From the email, select the **View the full alert** link to launch the Azure portal and show the security alerts page, which provides an overview of active threats detected on the database.

    :::image type="content" source="media/defender-for-databases-usage/suspected-brute-force-attack-notification-email.png" alt-text="Defender for Cloud's email notification about a suspected brute force attack.":::

    View active threats at the subscription level from within the Defender for Cloud portal pages:

    :::image type="content" source="media/defender-for-databases-usage/db-alerts-page.png" alt-text="Active threats on one or more subscriptions are shown in Microsoft Defender for Cloud." lightbox="media/defender-for-databases-usage/db-alerts-page.png":::

1. For additional details and recommended actions for investigating the current threat and remediating future threats, select a specific alert.

    :::image type="content" source="media/defender-for-databases-usage/specific-alert-details.png" alt-text="Screenshot that shows the details of a specific alert." lightbox="media/defender-for-databases-usage/specific-alert-details.png":::

> [!TIP]
> For a detailed tutorial on how to handle your alerts, see [Manage and respond to alerts](tutorial-security-incident.md).

## Next step

- [Automate responses to Defender for Cloud triggers](workflow-automation.yml)
- [Stream alerts to a SIEM, SOAR, or ITSM solution](export-to-siem.md)
- [Suppress alerts from Defender for Cloud](alerts-suppression-rules.md)
