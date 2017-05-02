---
title: Threat Detection - Azure SQL Database | Microsoft Docs
description: Threat Detection detects anomalous database activities indicating potential security threats to the database. 
services: sql-database
documentationcenter: ''
author: rmatchoro
manager: jhubbard
editor: v-romcal

ms.assetid: b50d232a-4225-46ed-91e7-75288f55ee84
ms.service: sql-database
ms.custom: security-protect
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 05/01/2017
ms.author: ronmat; ronitr

---
# SQL Database Threat Detection

SQL Threat Detection detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

## Overview

SQL Threat Detection provides a new layer of security, which enables customers to detect and respond to potential threats as they occur by providing security alerts on anomalous activities.  Users will receive an alert upon suspicious database activities, potential vulnerabilities, and SQL injection attacks, as well as anomalous database access patterns. SQL Threat Detection alerts provide details of suspicious activity and recommend action on how to investigate and mitigate the threat. Users can explore the suspicious events using [SQL Database Auditing](sql-database-auditing.md) to determine if they result from an attempt to access, breach, or exploit data in the database. Threat Detection makes it simple to address potential threats to the database without the need to be a security expert or manage advanced security monitoring systems.

For example, SQL injection is one of the common Web application security issues on the Internet, used to attack data-driven applications. Attackers take advantage of application vulnerabilities to inject malicious SQL statements into application entry fields, breaching or modifying data in the database.

SQL Threat Detection integrates alerts with [Azure Security Center](https://azure.microsoft.com/en-us/services/security-center/), and, each protected SQL Database server will be billed at the same price as Azure Security Center Standard tier, at $15/node/month, where each protected SQL Database server is counted as one node. We invite you to try it out for 60 days for free. 

## Set up threat detection for your database in the Azure portal
1. Launch the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Navigate to the configuration blade of the SQL Database you want to monitor. In the Settings blade, select **Auditing & Threat Detection**. 
    ![Navigation pane][1]
3. In the **Auditing & Threat Detection** configuration blade turn **ON** Auditing, which will display the threat detection settings.
  
    ![Navigation pane][2]
4. Turn **ON** Threat detection.
5. Configure the list of emails that will receive security alerts upon detection of anomalous database activities.
6. Click **Save** in the **Auditing & Threat detection** blade to save the new or updated auditing and threat detection settings.
       
    ![Navigation pane][3]

## Set up threat detection using PowerShell

For a script example, see [Configure auditing and threat detection using PowerShell](scripts/sql-database-auditing-and-threat-detection-powershell.md).

## Explore anomalous database activities upon detection of a suspicious event
1. You will receive an email notification upon detection of anomalous database activities. <br/>
   The email will provide information on the suspicious security event including the nature of the anomalous activities, database name, server name, application name, and the event time. In addition, the email will provide information on possible causes and recommended actions to investigate and mitigate the potential threat to the database.<br/>
     
    ![Navigation pane][4]
2. The email alert includes a direct link to the SQL Audit log. Clicking on this link launches the Azure portal and opens the SQL Audit records around the time of the suspicious event. Click on an audit record to view more details on the suspicious database activities, making it easier to find the SQL statements that were executed (who accessed, what they did and when) and determine if the event was legitimate or malicious (e.g. application vulnerability to SQL injection was exploited, someone breached sensitive data, etc.).<br/>
   ![Navigation pane][5]


## Explore threat detection alerts for your database in the Azure portal

SQL Database Threat Detection integrates its alerts with [Azure Security Center](https://azure.microsoft.com/en-us/services/security-center/). A live SQL security tile within the database blade in the Azure portal tracks the status of active threats. 

   ![Navigation pane][6]
   
1. Clicking on the SQL security tile launches the Azure Security Center alerts blade and provides an overview of active SQL threats detected on the database. 

  ![Navigation pane][7]

2. Clicking on a specific alert provides additional details and actions for investigating this threat and remediating future threats.

  ![Navigation pane][8]


## Next steps

* Learn more about Threat Detection, visit the [Azure blog](https://azure.microsoft.com/en-us/blog/azure-sql-database-threat-detection-general-availability-in-spring-2017/) 
* Learn more about [Azure SQL Database Auditing](sql-database-auditing.md)
* Learn more about [Azure Security Center](https://docs.microsoft.com/en-us/azure/security-center/security-center-intro)
* For more details on pricing, please see the [SQL Database Pricing page](https://azure.microsoft.com/en-us/pricing/details/sql-database/)  
* For a PowerShell script example, see [Configure auditing and threat detection using PowerShell](scripts/sql-database-auditing-and-threat-detection-powershell.md)



<!--Image references-->
[1]: ./media/sql-database-threat-detection/1_td_click_on_settings.png
[2]: ./media/sql-database-threat-detection/2_td_turn_on_auditing.png
[3]: ./media/sql-database-threat-detection/3_td_turn_on_threat_detection.png
[4]: ./media/sql-database-threat-detection/4_td_email.png
[5]: ./media/sql-database-threat-detection/5_td_audit_record_details.png
[6]: ./media/sql-database-threat-detection/6_td_security_tile_view_alerts.png
[7]: ./media/sql-database-threat-detection/7_td_SQL_security_alerts_list.png
[8]: ./media/sql-database-threat-detection/8_td_SQL_security_alert_details.png


