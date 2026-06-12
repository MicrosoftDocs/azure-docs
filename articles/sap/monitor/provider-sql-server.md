---
title: Configure SQL Server provider for Azure Monitor for SAP solutions
description: Configure a SQL Server provider for Azure Monitor for SAP solutions to collect performance metrics and health data from SQL Server databases in your SAP environment.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 04/09/2026
ms.author: jacobjaygbay
ms.custom: sfi-ropc-nochange
# Customer intent: As a developer, I want to configure a SQL Server provider for Azure Monitor for SAP solutions, so that I can effectively monitor my SAP environment using Azure's monitoring capabilities.
---

# Configure SQL Server provider for Azure Monitor for SAP solutions

In Azure Monitor for SAP solutions, a *provider* connects to a component in your SAP landscape and collects monitoring data from it. When your SAP environment uses a SQL Server database, add a SQL Server provider to collect performance and operational data from that database. For more information about providers, see [Providers in Azure Monitor for SAP solutions](providers.md).

In this article, you configure a SQL Server provider through the Azure portal, including the firewall, authentication, and user permissions that the provider requires.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](quickstart-portal.md) or the [quickstart for PowerShell](quickstart-powershell.md).

## Open a Windows port

Open the Windows port in the local firewall and the network security group (NSG) where SQL Server and Azure Monitor for SAP solutions exist.

1. On the SQL Server host, open the local Windows Firewall and allow inbound traffic on the SQL Server port (default **1433**).
1. In the Azure portal, open the NSG for the subnet where SQL Server and Azure Monitor for SAP solutions exist, and add an inbound rule for the same port.

## Configure SQL Server

Configure SQL Server to accept sign-ins from Windows and SQL Server:

1. Open SQL Server Management Studio.
1. Open **Server Properties** > **Security** > **Authentication**.
1. Select **SQL Server and Windows authentication mode**.
1. Select **OK** to save your changes.
1. To complete the changes, restart SQL Server.

## Create an Azure Monitor for SAP solutions user for SQL Server

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

## Enable secure communication

To enable [TLS 1.2 or higher](enable-tls-azure-monitor-sap-solutions.md), follow the steps in [Configure SQL Server encryption](/sql/database-engine/configure-windows/configure-sql-server-encryption?view=sql-server-ver15&preserve-view=true).

## Install an Azure Monitor for SAP solutions provider

To install the provider from Azure Monitor for SAP solutions:

1. Open the Azure Monitor for SAP solutions resource in the Azure portal.
1. On the resource menu, under **Settings**, select **Providers**.
1. On the provider page, select **Add** to add a new provider.
1. On the **Add provider** page, enter all required information:
   1. For **Type**, select **Microsoft SQL Server**.
   1. For **Name**, enter a name for the provider.
   1. (Optional) Select **Enable secure communication** and select a certificate type from the dropdown list.
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
