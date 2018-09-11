---
title: 'Connect client VM - Azure SQL Database Managed Instance | Microsoft Docs'
description: Connect to an Azure SQL Database Managed Instance using SQL Server Management Studio from an Azure virtual machine.
keywords: 
services: sql-database
author: jovanpop-msft
ms.reviewer: carlrab, srbozovi, bonova
ms.service: sql-database
ms.custom: managed instance
ms.topic: quickstart
ms.date: 09/06/2018
ms.author: jovanpop
manager: craigg

---
# Configure Azure VM to connect to an Azure SQL Database Managed Instance

This quickstarts demonstrates how to connect to an Azure SQL Database Managed Instance using SQL Server Management Studio (SSMS)  from an Azure virtual machine.  

## Prerequisites

This quickstart uses as its starting point the resources created in this quickstart: [Create a Managed Instance](sql-database-managed-instance-get-started.md).

## Create a virtual machine in the new subnet in the VNet

The following steps show you how to create a virtual machine in the same VNet in which the Managed Instance is being created. 

## Prepare client machine

Since SQL Managed Instance is placed in your private Virtual Network, you need to create an Azure VM with some installed SQL client tool like SQL Server Management Studio or SQL Operations Studio to connect to the Managed Instance and execute queries. This quickstart uses SQL Server Management Studio.

The easiest way to create a client virtual machine with all nesseccary tools is to use the Azure Resource Manager templates.

1. Click on the following button to create a client virtual machine and install SQL Server Management Studio (make sure that you are signed-in to the Azure portal in another browser tab):

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjovanpop-msft%2Fazure-quickstart-templates%2Fsql-win-vm-w-tools%2F201-vm-win-vnet-sql-tools%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

2. Fill out the form with the requested information, using the information in the following table:

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   |**Managed instance name**|Any valid name|For valid names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|
   |**Managed instance admin login**|Any valid user name|For valid names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). Do not use "serveradmin" as that is a reserved server-level role.| 
   |**Password**|Any valid password|The password must be at least 16 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.md#what-are-the-password-requirements-when-creating-a-vm).|
   |**Resource Group**|The resource group that you specified in the [Create Managed Instance](sql-database-managed-instance-get-started.md) quickstart.|This must be the resource group in which the VNet exists.|
   |**Location**|The location that you previously selected|For information about regions, see [Azure Regions](https://azure.microsoft.com/regions/).|
   |**Virtual network**|The virtual network for your managed instance| Existing VNET that you created in the [Creatie a Managed Instance](sql-database-managed-instance-get-started.md) quickstart.|

   ![create client VM](./media/sql-database-managed-instance-configure-vm/create-client-sql-vm.png)

   If you used the suggested VNet name and the default subnet in [creating your Managed Instance](sql-database-managed-instance-get-started.md), you don't need to change last two parameters. Otherwise you should change these values to the values that you entered when you set up the network environment.

3. Select the **I agree to terms and conditions stated above** checkbox.
4. Click **Purchase** to deploy the Azure VM in your network.

## Connect to virtual machine

The following steps show you how to connect to your newly created virtual machine using a remote desktop connection.

1. After deployment completes, go to the virtual machine resource.

    ![VM](./media/sql-database-managed-instance-configure-vm/vm.png)  

2. Click **Connect**. 
   
   A Remote Desktop Protocol file (.rdp file) form appears with the public IP address and port number for the virtual machine. 

    ![RDP form](./media/sql-database-managed-instance-configure-vm/rdp.png)  

3. Click **Download RDP File**.
 
   > [!NOTE]
   > You can also use SSH to connect to your VM.

4. Close the **Connect to virtual machine** form.
5. To connect to your VM, open the downloaded RDP file. 
6. When prompted, click **Connect**. On a Mac, you need an RDP client such as this [Remote Desktop Client](https://itunes.apple.com/us/app/microsoft-remote-desktop/id715768417?mt=12) from the Mac App Store.

6. Enter the user name and password you specified when creating the virtual machine, then click **Ok**.

7. You may receive a certificate warning during the sign-in process. Click **Yes** or **Continue** to proceed with the connection.

You are connected to your virtual machine in the Server Manager dashboard.

## Retrieve your fully-qualified server name

1. Open your Managed Instance resource in the Azure portal.
2. On the **Overview** tab, locate the **Host** property and copy the fully-qualified host address for the Managed Instance.

   The name is similar to this: **quickstartbmi.neu15011648751ff.database.windows.net**.

## Use SSMS to connect to the Managed Instance

1. In the virtual machine, open SQL Server Management Studio (SSMS).
 
   It will take a few moments to open as it needs to complete its configuration as this is the first time SSMS has been started.
2. In the **Connect to Server** dialog box, enter the fully qualified **host name** for your Managed Instance in the **Server name** box, select **SQL Server Authentication**, provide your login and password, and then click **Connect**.

    ![ssms connect](./media/sql-database-managed-instance-configure-vm/ssms-connect.png)  

After you connect, you can view your system and user databases in the Databases node, and various objects in the Security, Server Objects, Replication, Management, SQL Server Agent, and XEvent Profiler nodes.

## Next steps

- For a quickstart showing how to connect from an on-premises client computer using a point-to-site connection, see [Configure a point-to-site connection](sql-database-managed-instance-configure-p2s.md)
- For an overview of the connection options for applications, see [Connect your applications to Managed Instance](sql-database-managed-instance-connect-app.md).
- To restore an existing SQL Server database from on-premises to a Managed instance, you can use the [Azure Database Migration Service (DMS) for migration](../dms/tutorial-sql-server-to-managed-instance.md) to restore from a database backup file or the [T-SQL RESTORE command](sql-database-managed-instance-get-started-restore.md) to restore from a database backup file.
