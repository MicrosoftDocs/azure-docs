---
title: Secure your Azure SQL database | Microsoft Docs
description: Learn about techniques and features to secure your Azure SQL database.
services: sql-database
documentationcenter: ''
author: DRediske
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: sql-database
ms.custom: tutorial-secure
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 05/07/2017
ms.author: daredis

---
# Secure your Azure SQL Database

You can improve the protection of your database against malicious users or unauthorized access with just a few simple steps. In this tutorial you learn to: 

> [!div class="checklist"]
> * Set up firewall rules for your sever and or database
> * Connect to your database using a secure connection string
> * Manage user access
> * Protect your data with encryption
> * Enable SQL Database auditing
> * Enable SQL Database threat detection

To complete this tutorial, make sure you have installed Excel, and the newest version of [SQL Server Management Studio](https://msdn.microsoft.com/library/ms174173.aspx) (SSMS).


## Set up firewall rules for your database

SQL databases are protected by a firewall in Azure. By default, all connections to the server and the databases inside the server are rejected except for connections from other Azure services. The most secure configuration is to set 'Allow access to Azure services' to OFF. If you need to connect to the database from an Azure VM or cloud service, you should create a [Reserved IP](../virtual-network/virtual-networks-reserved-public-ip.md) and allow only the reserved IP address access through the firewall. 

Follow these steps to create a [SQL Database server-level firewall rule](sql-database-firewall-configure.md) for your server to allow connections from a specific IP address. 

1. Log in to the [Azure portal](https://portal.azure.com/).
1. Click **SQL databases** from the left-hand menu and click the database you would like to configure the firewall rule for on the **SQL databases** page. The overview page for your database opens, showing you the fully qualified server name (such as **mynewserver-20170313.database.windows.net**) and provides options for further configuration.

      ![server firewall rule](./media/sql-database-security-tutorial/server-firewall-rule.png) 

2. Click **Set server firewall** on the toolbar as shown in the previous image. The **Firewall settings** page for the SQL Database server opens. 

3. Click **Add client IP** on the toolbar to add the public IP address of the computer connected to the portal with or enter the firewall rule manually and then click **Save**.

      ![set server firewall rule](./media/sql-database-security-tutorial/server-firewall-rule-set.png) 

4. Click **OK** and then click the **X** to close the **Firewall settings** page.

You can now connect to any database in the server with the specified IP address or IP address range.

> [!NOTE]
> SQL Database communicates over port 1433. If you are trying to connect from within a corporate network, outbound traffic over port 1433 may not be allowed by your network's firewall. If so, you will not be able to connect to your Azure SQL Database server unless your IT department opens port 1433.
>

If you require different firewall settings for different databases within the same logical server, you must create a database-level rule for each database. Database-level firewall rules can only be configured by using Transact-SQL statements and only after you have configured the first server-level firewall rule. Follows these steps to create a database-specific firewall rule.

1. Connect to your database, for example using [SQL Server Management Studio](./sql-database-connect-query-ssms.md).

2. In Object Explorer, right-click on the database you want to add a firewall rule for and click **New Query**. A blank query window opens that is connected to your database.

3. In the query window, enter the following query:

    ```sql
    EXECUTE sp_set_database_firewall_rule N'Example DB Rule','0.0.0.4','0.0.0.4';
    ```

4. On the toolbar, click **Execute** to create the firewall rule.

## Connect to your database using a secure connection string

To ensure a secure, encrypted connection between the client and SQL Database, the connection string has to be configured to 1) request an encrypted connection and 2) to not trust the server certificate. This establishes a connection using Transport Layer Security (TLS) and reduces the risk of man-in-the-middle attacks. 
You can obtain correctly configured connection strings for your SQL Database for supported client drivers from the Azure portal as shown for ADO.net in this screenshot.

1. Select **SQL databases** from the left-hand menu, and click your database on the **SQL databases** page.

2. On the **Overview** page for your database, click **Show database connection strings**.

3. Review the complete **ADO.NET** connection string.

    ![ADO.NET connection string](./media/sql-database-security-tutorial/adonet-connection-string.png)


## User management

Before creating any users, you must first choose from one of two authentication types supported by Azure SQL Database: 

**SQL Authentication**, which uses username and password for logins and users that are valid only in the context of a specific database within a logical server. 

**Azure Active Directory Authentication**, which uses identities managed by Azure Active Directory. 

If you want to use [Azure Active Directory](./sql-database-aad-authentication.md) to authenticate against SQL Database, a populated Azure Active Directory must exist before you can proceed.

Follow these steps to create a user using SQL Authentication:

1. Connect to your database, for example using [SQL Server Management Studio](./sql-database-connect-query-ssms.md) using your server admin credentials.

2. In Object Explorer, right-click on the database you want to add a new user on and click **New Query**. A blank query window opens that is connected to the selected database.

3. In the query window, enter the following query:

    ```sql
    CREATE USER 'ApplicationUserUser' WITH PASSWORD = 'strong_password';
    ```

4. On the toolbar, click **Execute** to create the user.

5. By default, the user can connect to the database, but has no permissions to read or write data. To grant these permissions to the newly created user, execute the following two commands in a new query window

    ```sql
    ALTER ROLE db_datareader ADD MEMBER 'ApplicationUserUser';
    ALTER ROLE db_datawriter ADD MEMBER 'ApplicationUserUser';
    ```

It is best practice to create these non-administrator accounts at the database level to connect to your database unless you need to execute administrator tasks like creating new users. Please review the [Azure Active Directory tutorial](./sql-database-aad-authentication-configure.md) on how to authenticate using Azure Active Directory.


## Protect your data with encryption

Azure SQL Database transparent data encryption (TDE) automatically encrypts your data at rest, without requiring any changes to the application accessing the encrypted database. To enable TDE for your database, follow these steps:

1. Select **SQL databases** from the left-hand menu, and click your database on the **SQL databases** page. 

2. Click on **Transparent data encryption** to open the configuration page for TDE.

    ![Transparent Data Encryption](./media/sql-database-security-tutorial/transparent-data-encryption-enabled.png)

3. Set **Data encryption** to ON and click **Save**.

The encryption process starts in the background. You can monitor the progress by connecting to SQL Database using [SQL Server Management Studio](./sql-database-connect-query-ssms.md) by querying the encryption_state column of the `sys.dm_database_encryption_keys` view.

## Enable SQL Database auditing

Azure SQL Database Auditing tracks database events and writes them to an audit log in your Azure Storage account. Auditing can help you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate potential security violations. Follow these steps to create a default auditing policy for your SQL database:

1. Select **SQL databases** from the left-hand menu, and click your database on the **SQL databases** page.

2. In the Settings blade, select **Auditing & Threat Detection**.

    ![Auditing Blade](./media/sql-database-security-tutorial/auditing-get-started-settings.png)

3. In the database auditing configuration blade, you can check the **Inherit settings from server** checkbox to designate that this database will be audited according to its server's settings. If this option is checked, you will see a **View server auditing settings** link that allows you to view or modify the server auditing settings from this context.

    ![Inherit settings](./media/sql-database-security-tutorial/auditing-get-started-server-inherit.png)

4. If you prefer to enable  an Audit type (or location?) different from the one specified at the server level, **uncheck** the **Inherit Auditing settings from server** option, turn **ON** Auditing, and choose the **Blob** Auditing Type.

    > If server Blob auditing is enabled, the database configured audit will exist side by side with the server Blob audit.

    ![Turn on auditing](./media/sql-database-security-tutorial/auditing-get-started-turn-on.png)

5. Select **Storage Details** to open the Audit Logs Storage Blade. Select the Azure storage account where logs will be saved, and the retention period, after which the old logs will be deleted, then click **OK** at the bottom. **Tip:** Use the same storage account for all audited databases to get the most out of the auditing reports templates.

    ![Navigation pane](./media/sql-database-security-tutorial/auditing-get-started-storage-details.png)

6. If you want to customize the audited events, you can do this via PowerShell or REST API - see the [Automation (PowerShell / REST API)](#subheading-7) section for more details.

7. Click **Save**.


## Enable SQL Database threat detection

Threat Detection provides a new layer of security, which enables customers to detect and respond to potential threats as they occur by providing security alerts on anomalous activities. Users can explore the suspicious events using SQL Database Auditing to determine if they result from an attempt to access, breach or exploit data in the database. Threat Detection makes it simple to address potential threats to the database without the need to be a security expert or manage advanced security monitoring systems.
For example, Threat Detection detects certain anomalous database activities indicating potential SQL injection attempts. SQL injection is one of the common Web application security issues on the Internet, used to attack data-driven applications. Attackers take advantage of application vulnerabilities to inject malicious SQL statements into application entry fields, for breaching or modifying data in the database.

1. Navigate to the configuration blade of the SQL database you want to monitor. In the Settings blade, select **Auditing & Threat Detection**.

    ![Navigation pane](./media/sql-database-security-tutorial/auditing-get-started-settings.png)
2. In the **Auditing & Threat Detection** configuration blade turn **ON** auditing, which will display the threat detection settings.

3. Turn **ON** threat detection.

4. Configure the list of emails that will receive security alerts upon detection of anomalous database activities.

5. Click **Save** in the **Auditing & Threat detection** blade to save the new or updated auditing and threat detection policy.

    ![Navigation pane](./media/sql-database-security-tutorial/td-turn-on-threat-detection.png)

    You will receive an email notification upon detection of anomalous database activities. The email will provide information on the suspicious security event including the nature of the anomalous activities, database name, server name and the event time. In addition, it will provide information on possible causes and recommended actions to investigate and mitigate the potential threat to the database. The next steps walk you through what to do should you receive such an email:

    ![Threat detection email](./media/sql-database-threat-detection-get-started/4_td_email.png)

6. In the email, click on the **Azure SQL Auditing Log** link, which will launch the Azure portal and show the relevant auditing records around the time of the suspicious event.

    ![Audit records](./media/sql-database-threat-detection-get-started/5_td_audit_records.png)

7. Click on the audit records to view more details on the suspicious database activities such as SQL statement, failure reason and client IP.

    ![Record details](./media/sql-database-security-tutorial/6_td_audit_record_details.png)

8. In the Auditing Records blade, click  **Open in Excel** to open a pre-configured excel template to import and run deeper analysis of the audit log around the time of the suspicious event.

    > [!NOTE]
    > In Excel 2010 or later, Power Query and the **Fast Combine** setting is required.

    ![Open records in Excel](./media/sql-database-threat-detection-get-started/7_td_audit_records_open_excel.png)

9. To configure the **Fast Combine** setting - In the **POWER QUERY** ribbon tab, select **Options** to display the Options dialog. Select the Privacy section and choose the second option - 'Ignore the Privacy Levels and potentially improve performance':

    ![Excel fast combine](./media/sql-database-threat-detection-get-started/8_td_excel_fast_combine.png)

10. To load SQL audit logs, ensure that the parameters in the settings tab are set correctly and then select the 'Data' ribbon and click the 'Refresh All' button.

    ![Excel parameters](./media/sql-database-threat-detection-get-started/9_td_excel_parameters.png)

11. The results appear in the **SQL Audit Logs** sheet which enables you to run deeper analysis of the anomalous activities that were detected, and mitigate the impact of the security event in your application.


## Next steps
You can improve the protection of your database against malicious users or unauthorized access with just a few simple steps. In this tutorial you learn to: 

> [!div class="checklist"]
> * Set up firewall rules for your sever and or database
> * Connect to your database using a secure connection string
> * Manage user access
> * Protect your data with encryption
> * Enable SQL Database auditing
> * Enable SQL Database threat detection

* [SQL Database Security Overview](sql-database-security-overview.md).

