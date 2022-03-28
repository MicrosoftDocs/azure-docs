---
title: Delete a subnet after deleting a SQL Managed Instance
description: Learn how to delete an Azure virtual network after deleting an Azure SQL Managed Instance. 
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.custom: seo-lt-2019, sqldbrb=1
ms.devlang: 
ms.topic: how-to
author: urosmil
ms.author: urmilano
ms.reviewer: mathoma
ms.date: 03/25/2022
---

# Delete a subnet after deleting an Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article provides guidelines on how to manually delete a subnet after deleting the last Azure SQL Managed Instance residing in it. You can [delete a virtual network subnet](../../virtual-network/virtual-network-manage-subnet.md#delete-a-subnet) only if there are no resources in the subnet.

SQL Managed Instances are deployed into [virtual clusters](connectivity-architecture-overview.md#virtual-cluster-connectivity-architecture). Each virtual cluster is associated with a subnet and **automatically deployed** together with first instance creation. In the same way, a virtual cluster is **automatically removed** together with last instance deletion leaving the subnet empty and ready for removal. 

>[!IMPORTANT]
>There is no need for any manual action on the virtual cluster in order to release the subnet. Once the last virtual cluster is deleted, you can go and delete the subnet.

There are rare circumstances in which create operation can fail and result with deployed empty virtual cluster. Additionally, as instance creation [can be canceled](management-operations-cancel.md), it is possible for a virtual cluster to be deployed with instances residing inside, in a failed to deploy state. Virtual cluster removal will automatically be initiated in these situations and removed in the background.

> [!IMPORTANT]
> - There are no charges for keeping an empty virtual cluster or instances that have failed to create.
> - Deletion of a virtual cluster is a long-running operation lasting for about 1.5 hours (see [SQL Managed Instance management operations](management-operations-overview.md) for up-to-date virtual cluster delete time). The virtual cluster will still be visible in the portal until this process is completed.
> - Only one delete operation can be run on the virtual cluster. All subsequent customer-initiated delete requests will result with an error as delete operation is already in progress.

## Delete a virtual cluster from the Azure portal [DEPRECATED]

> [!IMPORTANT]
> Starting September 1, 2021. all virtual clusters are automatically removed when last instance in the cluster has been deleted. Manual removal of the virtual cluster is not required anymore.

To delete a virtual cluster by using the Azure portal, search for the virtual cluster resources.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Azure portal, with search box highlighted](./media/virtual-cluster-delete/virtual-clusters-search.png)

After you locate the virtual cluster you want to delete, select this resource, and select **Delete**. You're prompted to confirm the virtual cluster deletion.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Azure portal Virtual clusters dashboard, with the Delete option highlighted](./media/virtual-cluster-delete/virtual-clusters-delete.png)

Azure portal notifications will show you a confirmation that the request to delete the virtual cluster has been successfully submitted. The deletion operation itself will last for about 1.5 hours, during which the virtual cluster will still be visible in portal. Once the process is completed, the virtual cluster will no longer be visible and the subnet associated with it will be released for reuse.

> [!TIP]
> If there are no SQL Managed Instances shown in the virtual cluster, and you are unable to delete the virtual cluster, ensure that you do not have an ongoing instance deployment in progress. This includes started and canceled deployments that are still in progress. This is because these operations will still use the virtual cluster, locking it from deletion. Review the **Deployments** tab of the resource group where the instance was deployed to see any deployments in progress. In this case, wait for the deployment to complete, then delete the SQL Managed Instance. The virtual cluster will be synchronously deleted as part of the instance removal.

## Delete a virtual cluster by using the API [DEPRECATED]

> [!IMPORTANT]
> Starting September 1, 2021. all virtual clusters are automatically removed when last instance in the cluster has been deleted. Manual removal of the virtual cluster is not required anymore.

To delete a virtual cluster through the API, use the URI parameters specified in the [virtual clusters delete method](/rest/api/sql/virtualclusters/delete).

## Next steps

- For an overview, see [What is Azure SQL Managed Instance?](sql-managed-instance-paas-overview.md).
- Learn about [connectivity architecture in SQL Managed Instance](connectivity-architecture-overview.md).
- Learn how to [modify an existing virtual network for SQL Managed Instance](vnet-existing-add-subnet.md).
- For a tutorial that shows how to create a virtual network, create an Azure SQL Managed Instance, and restore a database from a database backup, see [Create an Azure SQL Managed Instance (portal)](instance-create-quickstart.md).
- For DNS issues, see [Configure a custom DNS](custom-dns-configure.md).
