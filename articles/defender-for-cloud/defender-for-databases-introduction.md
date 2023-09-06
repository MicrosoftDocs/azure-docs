---
title: Microsoft Defender for open-source relational databases - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for open-source relational databases such as PostgreSQL, MySQL, and MariaDB
ms.date: 06/19/2022
ms.topic: overview
ms.author: dacurwin
author: dcurwin
---

# Overview of Microsoft Defender for open-source relational databases

This plan brings threat protections for the following open-source relational databases:

- [Azure Database for PostgreSQL](../postgresql/index.yml)
- [Azure Database for MySQL](../mysql/index.yml)
- [Azure Database for MariaDB](../mariadb/index.yml)

Defender for Cloud detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. The plan makes it simple to address potential threats to databases without the need to be a security expert or manage advanced security monitoring systems.

## Availability

| Aspect | Details |
|--|:-|
| Release state: | General availability (GA) |
| Pricing: | **Microsoft Defender for open-source relational databases** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) |
| Supported environments:|:::image type="icon" source="./media/icons/yes-icon.png"::: PaaS<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Arc-enabled machines |
| Protected versions of PostgreSQL: | Single Server - General Purpose and Memory Optimized. Learn more in [PostgreSQL pricing tiers](../postgresql/concepts-pricing-tiers.md). |
| Protected versions of MySQL: | Single Server - General Purpose and Memory Optimized. Learn more in [MySQL pricing tiers](../mysql/concepts-pricing-tiers.md). |
| Protected versions of MariaDB: | General Purpose and Memory Optimized. Learn more in [MariaDB pricing tiers](../mariadb/concepts-pricing-tiers.md). |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br> :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Microsoft Azure operated by 21Vianet |

## What are the benefits of Microsoft Defender for open-source relational databases?

Defender for Cloud provides security alerts on anomalous activities so that you can detect potential threats and respond to them as they occur.

When you enable this plan, Defender for Cloud will provide alerts when it detects anomalous database access and query patterns as well as suspicious database activities.

These alerts appear in Defender for Cloud's security alerts page and include:

- details of the suspicious activity that triggered them
- the associated MITRE ATT&CK tactic
- recommended actions for how to investigate and mitigate the threat
- options for continuing your investigations with Microsoft Sentinel

:::image type="content" source="media/defender-for-databases-introduction/defender-alerts.png" alt-text="Some of the security alerts you might see with your databases protected by Microsoft Defender for open-source relational databases." lightbox="./media/defender-for-databases-introduction/defender-alerts.png":::

## What kind of alerts does Microsoft Defender for open-source relational databases provide?

Threat intelligence enriched security alerts are triggered when there are:

- **Anomalous database access and query patterns** - For example, an abnormally high number of failed sign-in attempts with different credentials (a brute force attempt)
- **Suspicious database activities** - For example, a legitimate user accessing an SQL Server from a breached computer which communicated with a crypto-mining C&C server
- **Brute-force attacks** – With the ability to separate simple brute force from brute force on a valid user or a successful brute force

> [!TIP]
> View the full list of security alerts for database servers [in the alerts reference page](alerts-reference.md#alerts-osrdb).



## Next steps

In this article, you learned about Microsoft Defender for open-source relational databases.

> [!div class="nextstepaction"]
> [Enable enhanced protections](enable-enhanced-security.md)
