---
title: 'Azure portal: Create a SQL Managed Instance | Microsoft Docs'
description: Create an Azure SQL Database Managed Instance.
keywords: sql database tutorial, create a sql database managed instance
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''
ms.service: sql-database
ms.custom: managed instance
ms.workload: "Active"
ms.tgt_pltfrm: portal
ms.devlang: 
ms.topic: quickstart
ms.date: 02/28/2018
ms.author: carlrab

---
# Create an Azure SQL Database Managed Instance in the Azure portal

This quick start tutorial walks through how to create an Azure SQL Database Managed Instance using the Azure portal.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Whitelist your subscription

Managed Instance is being released initially as a limited public preview that requires your subscription to be whitelisted. If your subscription is not already whitelisted, use the following steps to be offered and accept preview terms and send a request for whitelisting.

1. Click **Create a resource** in the upper left-hand corner of the Azure portal.
2. Select **SQL Database Managed Instance** and complete the requested preview information.
<!---will add more when I understand this step as it will appear when public preview goes live --->

## Configure a virtual network (VNET)

Managed Instance requires an [Azure Resource Manager (ARM)](../azure-resource-manager/resource-manager-deployment-model.md) virtual network (VNET). Managed Instance must be provisioned in a dedicated subnet of the provided VNET. The following steps show you how to create a new VNET/subnet. The notes within this section show you how to make sure your existing VNET/sybnet is in a valid state if you wish to use an existing VNET.

1. Click **Create a resource** in the upper left-hand corner of the Azure portal.
2. Locate and then click **Virtual Network**, verify the **Resource Manager** is selected as the deployment mode, and then click **Create**.

   ![virtual network create](./media/sql-database-managed-instance-quickstart/virtual-network-create.png)

3. Fill out the virtual network form with the requested information, using the information in the following table and screenshot.

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   | **Name**|Any valid name|For valid virtual network names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|
   | **Address space**|Any valid address range|The virtual network's address name in CIDR notation.|
   |**Subscription**|Your subscription|For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions).|
   |**Resource Group**|Any valid resource group (new or existing)|For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|
   |**Location**|Any valid location| For information about regions, see [Azure Regions](https://azure.microsoft.com/regions/).|
   |**Subnet name**|Any valid subnet name|or valid virtual network names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|
   |**Subnet address range**|Any valid subnet address|The subnet's address range in CIDR notation. It must be contained by the address space of the virtual network|
   |**Service endpoints**|Disabled|Enable one or more service endpoints for this subnet|
   ||||

   ![virtual network create form](./media/sql-database-managed-instance-quickstart/virtual-network-create-form.png)

4. Click **Create**.

## Create new route table and set route table on Managed Instance subnet

Currently, Managed Instance does not support effective routes on the subnet where instances are deployed. Routes can be user-defined (UDR) or BGP routes propagated to network interfaces through ExpressRoute or site-to-site VPN connections.

In case when BGP routes are propagated through Express Route or site-to-site VPN connections, you
need to create 0.0.0.0/0 Next Hop Internet route and apply it to the Managed Instance subnet.

1. Click **Create a resource** in the upper left-hand corner of the Azure portal.
2. Locate and then click **Route table**, and then click **Create** on the Route table page. 

   ![route table create](./media/sql-database-managed-instance-quickstart/route-table-create.png)

3. Fill out the route table form with the requested information, using the information in the following table and screenshot.

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   | **Name**|Any valid name|For valid route table names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|
   |**Subscription**|Your subscription|For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions).|
   |**Resource Group**|Any valid resource group (new or existing)|For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|
   |**Location**|Any valid location| For information about regions, see [Azure Regions](https://azure.microsoft.com/regions/).|
   |**Disable BCP route propogation**|Disabled||
   ||||

   ![route table create form](./media/sql-database-managed-instance-quickstart/route-table-create-form.png)

4. Click **Create**.
5. After the route table has been created, open the newly created route table and click **Routes**.

   ![route table](./media/sql-database-managed-instance-quickstart/route-table.png)

7. Click **Routes** and then click **Add**.

   ![add route](./media/sql-database-managed-instance-quickstart/add-route.png)

8.  Add 0.0.0.0/0 Next Hop Internet route as the **only** route, using the information in the following table and screenshot.

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   | **Route name**|Any valid name|For valid route names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|
   |**Address prefix**|0.0.0.0|The destination IP address in CIDR notation that this route applies to.|
   |**Next hop type**|Internet|The next hop handles the matching packets for this route|
   |||

   ![route](./media/sql-database-managed-instance-quickstart/route.png)

9. Click **OK**.
10. To set this route table on the subnet where Managed Instance is to be deployed, open the virtual network that you created earlier.
11. Click **Subnets** and then click the subnet that you created earlier.

   ![subnet](./media/sql-database-managed-instance-quickstart/subnet.png)

12. Click **Route table** and then select the **myMI_route_table**.

   ![set route table](./media/sql-database-managed-instance-quickstart/set-route-table.png)

13. Click **Save**

   ![set route table-save](./media/sql-database-managed-instance-quickstart/set-route-table-save.png)

## Configure Custom DNS to forward requests to Azure DNS

## Setup Custom DNS as primary and Azure DNS as secondary for the VNet

## Create a Managed Instance

## Create a virtual machine in the same VNET but different subnet

## Install SSMS and connect to the Managed Instance

## Next steps

