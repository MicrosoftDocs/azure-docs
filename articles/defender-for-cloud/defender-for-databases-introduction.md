---
title: What is Defender for open-source databases
description: Learn about the benefits and features of Microsoft Defender for open-source relational databases such as PostgreSQL, MySQL, and MariaDB
ms.date: 05/01/2024
ms.topic: overview
ms.author: dacurwin
author: dcurwin
#customer intent: As a reader, I want to understand the purpose and features of Microsoft Defender for open-source relational databases so that I can make informed decisions about its usage.
---

# What is Microsoft Defender for open-source relational databases

Defender for Cloud detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. The plan makes it simple to address potential threats to databases without the need to be a security expert or manage advanced security monitoring systems.

## Availability

Check out the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) for pricing information for Microsoft Defender for open-source relational databases.

Defender for open-source relational database is supported on PaaS environments for Azure and AWS and not on Azure Arc-enabled machines.

This plan brings threat protections for the following open-source relational databases on Azure:

**Protected versions of [Azure Database for PostgreSQL](../postgresql/index.yml) include**:

- Single Server - General Purpose and Memory Optimized. Learn more in [PostgreSQL Single Server pricing tiers](../postgresql/concepts-pricing-tiers.md).
- Flexible Server - all pricing tiers.

**Protected versions of [Azure Database for MySQL](../mysql/index.yml) include**:

- Single Server - General Purpose and Memory Optimized. Learn more in [MySQL pricing tiers](../mysql/concepts-pricing-tiers.md).
- Flexible Server - all pricing tiers.

**Protected versions of [Azure Database for MariaDB](../mariadb/index.yml) include**:

- General Purpose and Memory Optimized. Learn more in [MariaDB pricing tiers](../mariadb/concepts-pricing-tiers.md).

For RDS instances on AWS (Preview):

- Aurora PostgreSQL
- Aurora MySQL
- PostgreSQL
- MySQL
- MariaDB

View [cloud availability](support-matrix-cloud-environment.md#cloud-support) for Defender for open-source relational databases

## What are the benefits of Microsoft Defender for open-source relational databases?

Defender for Cloud provides multicloud alerts on anomalous activities so that you can detect potential threats and respond to them as they occur.

When you enable this plan, Defender for Cloud will provide alerts when it detects anomalous database access and query patterns as well as suspicious database activities.

These alerts appear in Defender for Cloud's multicloud alerts page and include:

- details of the suspicious activity that triggered them
- the associated MITRE ATT&CK tactic
- recommended actions for how to investigate and mitigate the threat
- options for continuing your investigations with Microsoft Sentinel

:::image type="content" source="media/defender-for-databases-introduction/defender-alerts.png" alt-text="Some of the multicloud alerts you might see with your databases protected by Microsoft Defender for open-source relational databases." lightbox="./media/defender-for-databases-introduction/defender-alerts.png":::

## What kind of alerts does Microsoft Defender for open-source relational databases provide?

Threat intelligence enriched multicloud alerts are triggered when there are:

- **Anomalous database access and query patterns** - For example, an abnormally high number of failed sign-in attempts with different credentials (a brute force attempt).
- **Suspicious database activities** - For example, a legitimate user accessing an SQL Server from a breached computer which communicated with a crypto-mining C&C server.
- **Brute-force attacks** – With the ability to separate simple brute force or a successful brute force.

> [!TIP]
> View the full list of multicloud alerts for database servers [in the alerts reference page](alerts-reference.md#alerts-for-open-source-relational-databases).

## Related articles

- [Enable Microsoft Defender for open-source relational databases and respond to alerts](defender-for-databases-usage.md)
- [Common questions about Defender for Databases](faq-defender-for-databases.yml)
