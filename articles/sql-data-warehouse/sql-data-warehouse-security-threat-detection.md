---
title: Threat detection - Azure SQL Data Warehouse | Microsoft Docs
description: Configure threat detection and explore suspicious events in Azure SQL Data Warehouse.
services: sql-data-warehouse
author: kavithaj
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 04/17/2018
ms.author: kavithaj
ms.reviewer: igorstan
---

# Threat detection in Azure SQL Data Warehouse
Configure threat detection and explore suspicious events in Azure SQL Data Warehouse.

## What is threat detection
Threat Detection detects anomalous database activities indicating potential security threats to the database. 

Threat Detection provides a new layer of security, which enables customers to detect and respond to potential threats as they occur by providing security alerts on anomalous activities. Users can explore the suspicious events using [Azure SQL Data Warehouse Auditing](sql-data-warehouse-auditing-overview.md) to determine if they result from an attempt to access, breach or exploit data in the data warehouse.
Threat Detection makes it simple to address potential threats to the data warehouse without the need to be a security expert or manage advanced security monitoring systems.

For example, Threat Detection detects certain anomalous database activities indicating potential SQL injection attempts. SQL injection is one of the common Web application security issues on the Internet, used to attack data-driven applications. Attackers take advantage of application vulnerabilities to inject malicious SQL statements into application entry fields, for breaching or modifying data in the database.

## Set up threat detection for your database
1. Launch the Azure Portal at [https://portal.azure.com](https://portal.azure.com).
2. Navigate to the configuration blade of the SQL Data Warehouse you want to monitor. In the Settings blade, select **Auditing & Threat Detection**.
   
    ![Navigation pane](media/sql-data-warehouse-security-threat-detection/1_td_click_on_settings.png)
3. In the **Auditing & Threat Detection** configuration blade turn **ON** auditing, which will display the Threat detection settings.
   
    ![Navigation pane](media/sql-data-warehouse-security-threat-detection/2_td_turn_on_auditing.png)
4. Turn **ON** Threat detection.
5. Configure the list of emails that will receive security alerts upon detection of anomalous data warehouse activities.
6. Click **Save** in the **Auditing & Threat detection** configuration blade to save the new or updated auditing and threat detection policy.
   
    ![Navigation pane](media/sql-data-warehouse-security-threat-detection/3_td_turn_on_threat_detection.png)

## Explore anomalous data warehouse activities upon detection of a suspicious event
1. You will receive an email notification upon detection of anomalous database activities. <br/>
   The email will provide information on the suspicious security event including the nature of the anomalous activities, database name, server name and the event time. In addition, it will provide information on possible causes and recommended actions to investigate and mitigate the potential threat to the database.<br/>
   
    ![Navigation pane](media/sql-data-warehouse-security-threat-detection/4_td_email.png)
2. In the email, click on the **Azure SQL Auditing Log** link, which will launch the Azure portal and show the relevant Auditing records around the time of the suspicious event.
   
    ![Navigation pane](media/sql-data-warehouse-security-threat-detection/5_td_audit_records.png)
3. Click on the audit records to view more details on the suspicious database activities such as SQL statement, failure reason and client IP.
   
    ![Navigation pane](media/sql-data-warehouse-security-threat-detection/6_td_audit_record_details.png)
4. In the Auditing Records blade, click  **Open in Excel** to open a pre-configured excel template to import and run deeper analysis of the audit log around the time of the suspicious event.<br/>
   **Note:** In Excel 2010 or later, Power Query and the **Fast Combine** setting is required
   
    ![Navigation pane](media/sql-data-warehouse-security-threat-detection/7_td_audit_records_open_excel.png)
5. To configure the **Fast Combine** setting - In the **POWER QUERY** ribbon tab, select **Options** to display the Options dialog. Select the Privacy section and choose the second option - 'Ignore the Privacy Levels and potentially improve performance':
   
    ![Navigation pane](media/sql-data-warehouse-security-threat-detection/8_td_excel_fast_combine.png)
6. To load SQL audit logs, ensure that the parameters in the settings tab are set correctly and then select the 'Data' ribbon and click the 'Refresh All' button.
   
    ![Navigation pane](media/sql-data-warehouse-security-threat-detection/9_td_excel_parameters.png)
7. The results appear in the **SQL Audit Logs** sheet which enables you to run deeper analysis of the anomalous activities that were detected, and mitigate the impact of the security event in your application.

## Next steps
For more security information, see [Secure a data warehouse](sql-data-warehouse-overview-manage-security.md).
