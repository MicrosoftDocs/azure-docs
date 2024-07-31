---
title: Explore and investigate Defender for SQL security alerts
description: Learn how to explore and investigate Defender for SQL security alerts in Microsoft Defender for Cloud.
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 07/08/2024
---

# Explore and investigate Defender for SQL security alerts

There are several ways to view Microsoft Defender for SQL alerts in Microsoft Defender for Cloud:

- The **Alerts** page.

- The machine's security page.

- The [workload protections dashboard](workload-protections-dashboard.md).

- Through the direct link provided in the alert's email.

## How to view alerts

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Security alerts**.

1. Select an alert.

Alerts are designed to be self-contained, with detailed remediation steps and investigation information in each one. You can investigate further by using other Microsoft Defender for Cloud and Microsoft Sentinel capabilities for a broader view:

- Enable SQL Server's auditing feature for further investigations. If you're a Microsoft Sentinel user, you can upload the SQL auditing logs from the Windows Security Log events to Sentinel and enjoy a rich investigation experience. [Learn more about SQL Server Auditing](/sql/relational-databases/security/auditing/create-a-server-audit-and-server-audit-specification?preserve-view=true&view=sql-server-ver15).

- To improve your security posture, use Defender for Cloud's recommendations for the host machine indicated in each alert to reduce the risks of future attacks.
  
[Learn more about managing and responding to alerts](managing-and-responding-alerts.yml).

## Related content

For related information, see these resources:

- [Security alerts for SQL Database and Azure Synapse Analytics](alerts-sql-database-and-azure-synapse-analytics.md)
- [Set up email notifications for security alerts](configure-email-notifications.md)
- [Learn more about Microsoft Sentinel](../sentinel/index.yml)
