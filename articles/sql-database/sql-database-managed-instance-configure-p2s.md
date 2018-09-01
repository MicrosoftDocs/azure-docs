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

This quickstart demonstrates how to connect to an Azure SQL Database Managed Instance using SQL Server Management Studio from an on-premises client computer over a Point-to-site connection. For information about Point-to-site connections, see [About Point-to-Site VPN](../vpn-gateway/point-to-site-about.md)

## Prerequisites

This quickstart uses as its starting point the resources created in this quickstart: [Create a Managed Instance](sql-database-managed-instance-get-started.md).

## Create a virtual network gateway configured for point-to-site connections

Since SQL Managed Instance is placed in your private Virtual Network, to connect to it with SQL Server Management Studio, you need to create a virtual network gateway in the Managed Instance VNet.

The easiest way to create a client virtual machine with all nesseccary tools is to use the Azure Resource Manager templates.

1. Click on the following button (make sure that you are signed-in to the Azure portal in another browser tab):Use the following template to create a virtual network gateway in the Managed Instance VNet.

> [!IMPORTANT]
> To deploy this template user needs to provide public self-signed root certificate data. For detailed information on this and setting up certificates for point-to-site VPN, see [VPN Gaateway certificates](../vpn-gateway/vpn-gateway-certificates-point-to-site.md)

2. Fill out the form with the requested information, using the information in the following table:

## Next steps

Now that you have learned how to connect to your Managed Instance from an Azure virtual machine, you are ready to learn how to connect from an on-premises client computer using a [Point-to-site connection](sql-database-managed-instance-connect-p2s.md)