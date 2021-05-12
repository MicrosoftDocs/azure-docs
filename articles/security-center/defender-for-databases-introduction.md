---
title: Azure Defender for open-source relational databases - the benefits and features
description: Learn about the benefits and features of Azure Defender for open-source relational databases such as PostgreSQL, MySQL, and MariaDB
author: memildin
ms.author: memildin
ms.date: 05/13/2021
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for open-source relational databases

This Azure Defender plan brings threat protections for the following open-source relational databases:

- [Azure Database for PostgreSQL](../postgresql/index.yml)
- [Azure Database for MySQL](../mysql/index.yml)
- [Azure Database for MariaDB](../mariadb/index.yml)

Azure Defender detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. The plan makes it simple to address potential threats to databases without the need to be a security expert or manage advanced security monitoring systems.

The feature is available for General Purpose and Memory Optimized servers.

## Availability

| Aspect                             | Details                                                                                                                                    |
|------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                     | Preview<br>[!INCLUDE [Legalese](../../includes/security-center-preview-legal-text.md)]                                                     |
| Pricing:                           | **Azure Defender for open-source relational databases** is billed as shown on [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/)   |
| Protected versions of PostgreSQL:  | General Purpose and Memory Optimized. Learn more in [PostgreSQL pricing tiers](../postgresql/concepts-pricing-tiers.md).   |
| Protected versions of MySQL:       | General Purpose and Memory Optimized. Learn more in [MySQL pricing tiers](../mysql/concepts-pricing-tiers.md).                        |
| Protected versions of MariaDB:     | General Purpose and Memory Optimized. Learn more in [MariaDB pricing tiers](../mariadb/concepts-pricing-tiers.md).                      |
| Clouds:                            | ![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![No](./media/icons/no-icon.png) National/Sovereign (US Gov, China Gov, Other Gov) |
|                                    |                                                                                                                                            |

## What are the benefits of Azure Defender for open-source relational databases?

Azure Defender provides security alerts on anomalous activities so that you can detect potential threats and respond to them as they occur.

When you enable this plan, Azure Defender will provide alerts when it detects suspicious database activities, potential vulnerabilities, and anomalous database access and query patterns.

These alerts appear in Azure Defender's security alerts page and include:

- details of the suspicious activity that triggered them
- the associated MITRE ATT&CK tactic
- recommended actions for how to investigate and mitigate the threat
- options for continuing your investigations with Azure Sentinel

:::image type="content" source="media/defender-for-databases-introduction/defender-alerts.png" alt-text="Some of the security alerts you might see with your databases protected by Azure Defender for open-source relational databases" lightbox="./media/defender-for-databases-introduction/defender-alerts.png":::

## What kind of alerts does Azure Defender for open-source relational databases provide?

Threat intelligence enriched security alerts are triggered when there's:

- **Access from an unusual location:** This alert is triggered when there is a change in the access pattern to the database server, where someone has logged on to the database server from an unusual geographical location. In some cases, the alert detects a legitimate action (a new application or developer maintenance). In other cases, the alert detects a malicious action (former employee, external attacker).

- **Access from an unusual Azure data center:** This alert is triggered when there is a change in the access pattern to the database server, where someone has logged on to the server from an unusual Azure data center that was seen on this server during the recent period. In some cases, the alert detects a legitimate action (your new application in Azure, Power BI, Azure Database for PostgreSQL/MySQL/MariaDB Query Editor). In other cases, the alert detects a malicious action from an Azure resource/service (former employee, external attacker).

- **Access from an unfamiliar principal:** This alert is triggered when there is a change in the access pattern to the database server, where someone has logged on to the server using an unusual principal (Azure Database for PostgreSQL/MySQL/MariaDB user). In some cases, the alert detects a legitimate action (new application, developer maintenance). In other cases, the alert detects a malicious action (former employee, external attacker).

- **Access from a potentially harmful application:** This alert is triggered when a potentially harmful application is used to access the database. In some cases, the alert detects penetration testing in action. In other cases, the alert detects an attack using common attack tools.

- **Brute force attacks:** This alert is triggered when there is an abnormally high number of failed logins with different credentials. In some cases, the alert detects penetration testing in action. In other cases, the alert detects brute force attacks.

> [!TIP]
> View the full list of security alerts for database servers [in the alerts reference page](alerts-reference.md#alerts-osrdb).



## Next steps

In this article, you learned about Azure Defender for open-source relational databases.

> [!div class="nextstepaction"]
> [Enable Azure Defender](enable-azure-defender.md)
