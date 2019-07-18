---
title: "Tutorial: Add a SQL Database managed instance to a failover group"
description: Learn to configure a failover group for your Azure SQL database managed instance. 
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.reviewer: sashan, carlrab
manager: jroth
ms.date: 06/27/2019
---
# Tutorial: Add a SQL Database managed instance to a failover group

Add a SQL Database managed instance to a failover group. In this article, you will learn how to:

> [!div class="checklist"]
> - Create a primary managed instance
> - Create a secondary managed instance as part of a [failover group](sql-database-auto-failover-group.md). 
> - Test failover

  > [!NOTE]
  > Creating a managed instance can take a significant amount of time. As a result, this tutorial could take several hours to complete. 
  > Using failover groups with managed instances is in currently in preview. 

## Prerequisites

To complete this tutorial, make sure you have: 

- An Azure subscription, [create a free account](https://azure.microsoft.com/free/) if you don't already have one. 


## 1 - Create resource group and primary managed instance
In this step, you will create the resource group and the primary managed instance for your failover group using the Azure portal. 

1. Sign into the [Azure portal](https://portal.azure.com). 
1. Choose to **Create a resource** on the upper-left hand corner of the Azure portal. 
1. Type `managed instance` in the search box and select the option for Azure SQL Managed Instance. 
1. Select **Create** to launch the **SQL managed instance** creation page. 
1. On the **SQL managed instance** creation page, fill out or select the following values and then select **Create** to create your primary managed instance. 

   The following table shows the values necessary for the primary managed instance:

   | **Field** | Value |
   | --- | --- |
   | **Subscription** |  The subscription where your primary managed instance was created. |
   | **Managed instance name** |Type in a name for your primary managed instance, such as `primary-sql-mi`  | 
   | **Managed instance admin login** | The login you want to use for your primary managed instance, such as `azureuser`. |
   | **Password** | A complex password that will be used by the admin login for the new secondary managed instance.  |
   | **Collation** | The collation for your secondary managed instance. *SQL_Latin1_General_CP1_CI_AS* is provided by default. |
   | **Location**| The location where your managed instance is created.  |
   | **Virtual network**| Create a new virtual network for your managed instance. |
   | **Connection type**| Leave this as **Proxy (Default)** and optionally select the checkbox next to **Enable public endpoint**. |
   | **Resource group**| The resource group where your primary managed instance was created. |
   | &nbsp; | &nbsp; |

   ![Create primary MI](media/sql-database-managed-instance-failover-group-tutorial/primary-sql-mi-values.png)

## 2 - Create a virtual network
In this step, you will create a virtual network for the secondary managed instance. This step is necessary because there is a requirement that the subnet of the primary and secondary managed instances have non-overlapping address ranges. 

To verify the subnet range of your primary virtual network, follow these steps:
1. In the [Azure portal](https://portal.azure.com), navigate to your resource group and select the virtual network for your primary instance. 
1. Select **Subnets** under **Settings** and note the **Address range**. The subnet address range of the virtual network for the secondary managed instance cannot overlap this. 


   ![Primary subnet](media/sql-database-managed-instance-failover-group-tutorial/verify-primary-subnet-range.png)

To create a virtual network, follow these steps:

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** and search for *virtual network*. 
1. Select the **Virtual Network** option published by Microsoft and then select **Create** on the next page. 
1. Fill out the required fields to configure the virtual network for your secondary managed instance, and then select **Create**. 

   The following table shows the values necessary for the secondary virtual network:

    | **Field** | Value |
    | --- | --- |
    | **Name** |  The name for the virtual network to be used by the secondary managed instance, such as `vnet-sql-mi-secondary`. |
    | **Address space** | The address space for your virtual network, such as `10.128.0.0/16`. | 
    | **Subscription** | The subscription where your primary managed instance and resource group reside.  |
    | **Location** | The location where you will deploy your secondary managed instance; this should be different than the location for your primary managed instance.  |
    | **Subnet** | The name for your subnet. `default` is filled in for you by default. |
    | **Address range**| The address range for your subnet. This must be different than the subnet address range used by the virtual network of your primary managed instance, such as `10.128.0.0/24`.  |
    | &nbsp; | &nbsp; |

    ![Secondary virtual network values](media/sql-database-managed-instance-failover-group-tutorial/secondary-virtual-network.png)




## 3 - Create a secondary managed instance
In this step, you will create a secondary managed instance in the Azure portal, which will also configure the networking between the two managed instances. 

1. In the [Azure portal](http://portal.azure.com), select **Create a resource** and search for *Azure SQL Managed Instance*. 
1. Select the **Azure SQL Managed Instance** option published by Microsoft, and then select **Create** on the next page.
1. Fill out the required fields to configure your secondary managed instance. 

   The following table shows the values necessary for the secondary managed instance:
 
    | **Field** | Value |
    | --- | --- |
    | **Subscription** |  The subscription where your primary managed instance is. |
    | **Managed instance name** | The name of your new secondary managed instance, such as `sql-mi-secondary`  | 
    | **Managed instance admin login** | The login you want to use for your new secondary managed instance, such as `azureuser`. |
    | **Password** | A complex password that will be used by the admin login for the new secondary managed instance.  |
    | **Collation** | The collation for your secondary managed instance. *SQL_Latin1_General_CP1_CI_AS* is provided by default. |
    | **Location**| The location where you want to deploy your secondary managed instance. This must be a different region than where your primary managed instance is.  |
    | **Virtual network**| Select the virtual network that was created in section 2, such as `vnet-sql-mi-secondary`. |
    | **Resource group**| The resource group where your primary managed instance is. |
    | &nbsp; | &nbsp; |

1. Select the checkbox next to *I want to use this managed instance as an Instance Failover Group secondary*. 
1. From the **Primary Managed Instance** drop-down, select the managed instance you want to act as the primary.

   ![Secondary MI values](media/sql-database-managed-instance-failover-group-tutorial/secondary-sql-mi-values.png)

## 4 - Create a failover group
In this step, you will create the failover group and add both managed instances to it. 

1. In the [Azure portal](https://portal.azure.com), navigate to **All services** and type in `managed instance` in the search box. 
1. (Optional) Select the star next to **SQL managed instances** to add managed instances as shortcut to your left-hand navigation bar. 
1. Select **SQL managed instances** and select your primary managed instance, such as `sql-mi-primary`. 
1. Under **Settings**, navigate to **Instance Failover Groups** and then choose to **Add group** to open the **Instance Failover Group** page. 

   ![Add a failover group](media/sql-database-managed-instance-failover-group-tutorial/add-failover-group.png)

1. On the **Instance Failover Group** page, type the name of  your failover group, such as `failovergrouptutorial` and then choose the secondary managed instance, such as `sql-mi-secondary` from the drop-down. Select **Create** to create your failover group. 

   ![Create failover group](media/sql-database-managed-instance-failover-group-tutorial/create-failover-group.png)

1. Once failover group deployment is complete, you will be taken back to the **Failover group** page. 

## 5 - Test failover
In this step, you will fail your failover group over to the secondary server, and then fail back using the Azure portal. 

1. Navigate to your managed instance within the [Azure portal](https://portal.azure.com) and select **Instance Failover Groups** under settings. 
1. Review which managed instance is the primary, and which managed instance is the secondary. 
1. Select **Failover** and then select **Yes** on the warning about TDS sessions being disconnected. 

   ![Fail over the failover group](media/sql-database-managed-instance-failover-group-tutorial/failover-mi-failover-group.png)

1. Review which manged instance is the primary and which instance is the secondary. If failover succeeded, the two instances should have switched roles. 

   ![Managed instances have switched roles after failover](media/sql-database-managed-instance-failover-group-tutorial/mi-switched-after-failover.png)

1. Select **Failover** once again to fail the primary instance back to the primary role. 


## Clean up resources
Clean up resources by first deleting the managed instance, then the virtual cluster, then any remaining resources, and finally the resource group. 

1. Navigate to your resource group in the [Azure portal](https://portal.azure.com). 
1. Select the managed instance and then select **Delete**. Type `yes` in the text box to confirm you want to delete the resource and then select **Delete**. This process may take some time to complete in the background, and until it's done, you will not be able to delete the *Virtual cluster* or any other dependent resources. Monitor the delete in the Activity tab to confirm your managed instance has been deleted. 
1. Once the managed instance is deleted, delete the *Virtual cluster* by selecting it in your resource group, and then choosing **Delete**. Type `yes` in the text box to confirm you want to delete the resource and then select **Delete**. 
1. Delete any remaining resources. Type `yes` in the text box to confirm you want to delete the resource and then select **Delete**. 
1. Delete the resource group by selecting **Delete resource group**, typing in the name of the resource group, `myResourceGroup`, and then selecting **Delete**. 

## Next steps

In this tutorial, you configured a failover group between two managed instances. You learned how to:

> [!div class="checklist"]
> - Create a primary managed instance
> - Create a secondary managed instance as part of a [failover group](sql-database-auto-failover-group.md). 
> - Test failover

Advance to the next quickstart on how to connect to your managed instance, and how to restore a database to your managed instance: 

> [!div class="nextstepaction"]
> [Connect to your managed instance](sql-database-managed-instance-configure-vm.md)
> [Restore a database to a managed instance](sql-database-managed-instance-get-started-restore.md)


