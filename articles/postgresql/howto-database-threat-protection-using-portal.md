---
title: Threat Protection - Azure Database for PostgreSQL | Microsoft Docs
description: Threat Protection detects anomalous database activities indicating potential security threats to the database. 
services: postgresql
author: bolzmj
manager: kfile
ms.service: postgresql
ms.topic: article
ms.date: 09/13/2018
ms.author: mbolz

---
# Advanced Threat Protection for Azure Database for PostgreSQL

Advanced Threat Protection for Azure Database for PostgreSQL detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

Threat Protection is part of the Advanced Threat Protection (ATP) offering, which is a unified package for advanced security capabilities. Advanced Threat Protection can be accessed and managed via the [Azure portal](https://portal.azure.com) and is currently in preview.

## Set up threat detection for your database in the Azure portal
1. Launch the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Navigate to the configuration page of the Azure Database for PostgreSQL server you want to protect. In the security settings, select **Threat Protection (Preview)**.
3. On the **Threat Protection (Preview)** configuration page:

   - Enable Advanced Threat Protection on the server.
   - In **Threat Protection Settings**, in the **Send alerts to** text box, provide the list of emails to receive security alerts upon detection of anomalous database activities.
  
   ![Set up threat detection](./media/howto-database-threat-protection-using-portal/set-up-threat-protection.png)

## Explore anomalous database activities upon detection of a suspicious event

You receive an email notification upon detection of anomalous database activities. The email provides information on the suspicious security event including the nature of the anomalous activities, database name, server name, application name, and the event time. In addition, the email provides information on possible causes and recommended actions to investigate and mitigate the potential threat to the database.

![Anomalous activity report](./media/sql-database-threat-detection/anomalous_activity_report.png)
     
1. Click the **View recent SQL alerts** link in the email to launch the Azure portal and show the Azure Security Center alerts page, which provides an overview of active threats detected on the SQL database.

   ![Activty threats](./media/sql-database-threat-detection/active_threats.png)

2. Click a specific alert to get additional details and actions for investigating this threat and remediating future threats.

   For example, SQL injection is one of the most common Web application security issues on the Internet that is used to attack data-driven applications. Attackers take advantage of application vulnerabilities to inject malicious SQL statements into application entry fields, breaching or modifying data in the database. For SQL Injection alerts, the alert’s details include the vulnerable SQL statement that was exploited.

   ![Specific alert](./media/sql-database-threat-detection/specific_alert.png)

## Explore threat detection alerts for your database in the Azure portal

SQL Database Threat Detection integrates its alerts with [Azure Security Center](https://azure.microsoft.com/services/security-center/). A live SQL threat detection tiles within the database and SQL ATP blades in the Azure portal tracks the status of active threats.

Click **Threat detection alert** to launch the Azure Security Center alerts page and get an overview of active SQL threats detected on the database.

   ![Threat detection alert](./media/sql-database-threat-detection/threat_detection_alert.png)
   
   ![Threat detection alert2](./media/sql-database-threat-detection/threat_detection_alert_atp.png)

## Next steps

* Learn more about [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro)
* For more information on pricing, see the [Azure Database for PostgreSQL Pricing page](https://azure.microsoft.com/en-us/pricing/details/postgresql/)  
