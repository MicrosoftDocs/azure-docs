---
title: 'Configure P2S - SQL Database Managed Instance | Microsoft Docs'
description: Connect to an Azure SQL Database Managed Instance using SQL Server Management Studio using a point-to-site connection from an on-premises client computer.
keywords: 
services: sql-database
author: bonova
ms.reviewer: carlrab, srbozovi
ms.service: sql-database
ms.custom: managed instance
ms.topic: tutorial
ms.date: 09/05/2018
ms.author: bonova
manager: craigg

---
# Connect to an Azure SQL Database Managed Instance from on-premises using a Point-to-Site connection

This quickstart demonstrates how to connect to an Azure SQL Database Managed Instance using SQL Server Management Studio from an on-premises client computer over a point-to-site connection. For information about point-to-site connections, see [About Point-to-Site VPN](../vpn-gateway/point-to-site-about.md)

## Prerequisites

This quickstart:
- Uses as its starting point the resources created in this quickstart: [Create a Managed Instance](sql-database-managed-instance-get-started.md).
- Requires PowerShell 5.1 and Azure PowerShell 5.4.2 or higher your on-premises client computer.
- Requires the newest version of [SQL Server Management Studio][ssms-install-latest-84g] on your on-premises client computer

## Attach a VPN gateway to your Managed Instance virtual network

Run the following PowerShell script to attach a VPN Gateway to the Managed Instance virtual network that you created 
This is done in three steps:
Create and install certificates on client machine
Calculate future VPN Gateway subnet IP range
Deploy ARM template that will attach VPN Gateway to subnet

> [!IMPORTANT]
> To deploy this template user needs to provide public self-signed root certificate data. For detailed information on this and setting up certificates for point-to-site VPN, see [VPN Gaateway certificates](../vpn-gateway/vpn-gateway-certificates-point-to-site.md)

2. Fill out the form with the requested information, using the information in the following table:

## Next steps

- To learn how to connect from an Azure virtual machine, see [Configure a point-to-site connection](sql-database-managed-instance-configure-p2s.md)
- To learn how to connect from an on-premises client computer using a point-to-site connection, see [Configure a point-to-site connection](sql-database-managed-instance-configure-p2s.md)
- For an overview of the connection options for applications, see [Connect your applications to Managed Instance](sql-database-managed-instance-connect-app.md).
- To restore an existing SQL database to a Managed instance, you can use the [Azure Database Migration Service (DMS) for migration](../dms/tutorial-sql-server-to-managed-instance.md) to restore from a database backup file or the [T-SQL RESTORE command](sql-database-managed-instance-get-started-restore.md) to restore from a database backup file.

