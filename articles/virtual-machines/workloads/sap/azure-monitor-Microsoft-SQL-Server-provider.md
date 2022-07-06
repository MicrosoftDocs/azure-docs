---
title: Azure Monitor for SAP Solutions providers - MS SQL Server | Microsoft Docs
description: This article provides details to configure Microsoft SQL Server for Azure monitor for SAP solutions.
author: sujaj
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: article
ms.date: 07/06/2022
ms.author: sujaj

---



# **Microsoft SQL Server Provider**

## Prerequisites

#### Port

The Windows port the SQL Server is using for connections (default is 1433) should be opened in the local firewall of the SQL Server machine and the Azure network security group (NSG) for the Azure network the SQL Server and the "Azure Monitor for SAP Solutions" are placed in.

#### SQL Server

The SQL Server must be configured with mixed authentication mode, means it must accept the login from Windows Logins as well as SQL Server logins. You can find this option in the SQL Server Management Studio -> Server Properties -> Security -> Authentication -> SQL Server and Windows authentication mode. A SQL Server restart is required after changing this option.

#### SQL Server Login and User

A SQL Server Login and User should be created, using the following script. Please ensure to replace \<Database to monitor\> with your SAP database name and \<password\> with the real password of the login. The example login and user AMFSS can be used or replaced with any other SQL login and username of your choice:

```sql
USE [<Database to monitor>]
DROP USER [AMS]
GO
USE [master]
DROP USER [AMS]
DROP LOGIN [AMS]
GO
CREATE LOGIN [AMS] WITH 
    PASSWORD=N'<password>', 
    DEFAULT_DATABASE=[<Database to monitor>], 
    DEFAULT_LANGUAGE=[us_english], 
    CHECK_EXPIRATION=OFF, 
    CHECK_POLICY=OFF
CREATE USER AMS FOR LOGIN AMS
ALTER ROLE [db_datareader] ADD MEMBER [AMS]
ALTER ROLE [db_denydatawriter] ADD MEMBER [AMS]
GRANT CONNECT TO AMS
GRANT VIEW SERVER STATE TO AMS
GRANT VIEW ANY DEFINITION TO AMS
GRANT EXEC ON xp_readerrorlog TO AMS
GO
USE [<Database to monitor>]
CREATE USER [AMS] FOR LOGIN [AMS]
ALTER ROLE [db_datareader] ADD MEMBER [AMS]
ALTER ROLE [db_denydatawriter] ADD MEMBER [AMS]
GO
```

## Provider installation

Select Add provider from Azure Monitor for SAP solutions resource, and then:

!["SQL1"](./media/SQL-Server-Provider-Details.png)

For Type, select Microsoft SQL Server.

!["SQL2"](./media/SQL-Server-Provider.png)

1. Configure providers for each instance of database by entering all required information.
2. Enter the IP address of the hostname and the port the SQL Server is listening on (default is 1433).
3. For the database user please specify a SQL Server user and the password for this user. As SID please specify your SAP System ID (SID).
4. When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment.


