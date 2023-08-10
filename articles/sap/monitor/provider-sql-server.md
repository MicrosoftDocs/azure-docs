---
title: Configure SQL Server provider for Azure Monitor for SAP solutions 
description: Learn how to configure a SQL Server provider for use with Azure Monitor for SAP solutions.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: article
ms.date: 10/27/2022
ms.author: sujaj
#Customer intent: As a developer, I want to configure a SQL Server provider so that I can use Azure Monitor for SAP solutions for monitoring.
---

# Configure SQL Server for Azure Monitor for SAP solutions

In this how-to guide, you learn how to configure a SQL Server provider for Azure Monitor for SAP solutions through the Azure portal.

## Prerequisites

- An Azure subscription.
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](quickstart-portal.md) or the [quickstart for PowerShell](quickstart-powershell.md).

## Open a Windows port

Open the Windows port in the local firewall of SQL Server and the network security group where SQL Server and Azure Monitor for SAP solutions exist. The default port is 1433.

## Configure SQL Server

Configure SQL Server to accept sign-ins from Windows and SQL Server:

1. Open SQL Server Management Studio.
1. Open **Server Properties** > **Security** > **Authentication**.
1. Select **SQL Server and Windows authentication mode**.
1. Select **OK** to save your changes.
1. Restart SQL Server to complete the changes.

## Create Azure Monitor for SAP solutions user for SQL Server

Create a user for Azure Monitor for SAP solutions to sign in to SQL Server by using the following script. Make sure to replace:

- `<Database to monitor>` with your SAP database's name.
- `<password>` with the password for your user.

You can replace the example information for the Azure Monitor for SAP solutions user with any other SQL username.

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

## Prerequisites to enable secure communication

To enable [TLS 1.2 or higher](enable-tls-azure-monitor-sap-solutions.md), follow the steps in [this article](/sql/database-engine/configure-windows/configure-sql-server-encryption?view=sql-server-ver15&preserve-view=true).

## Install an Azure Monitor for SAP solutions provider

To install the provider from Azure Monitor for SAP solutions:

1. Open the Azure Monitor for SAP solutions resource in the Azure portal.
1. On the resource menu, under **Settings**, select **Providers**.
1. On the provider page, select **Add** to add a new provider.
1. On the **Add provider** page, enter all required information:
    1. For **Type**, select **Microsoft SQL Server**.
    1. For **Name**, enter a name for the provider.
    1. (Optional) Select **Enable secure communication** and choose a certificate type from the dropdown list.
    1. For **Host name**, enter the IP address of the hostname.
    1. For **Port**, enter the port on which SQL Server is listening. The default is 1433.
    1. For **SQL username**, enter a username for the SQL Server account.
    1. For **Password**, enter a password for the account.
    1. For **SID**, enter the SAP system identifier.
    1. Select **Create** to create the provider.
1. Repeat the previous step as needed to create more providers.
1. Select **Review + create** to complete the deployment.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](providers.md)
