---
title: Configure service endpoint policies for Azure Storage for Azure SQL Managed Instance
description: Learn how to apply service endpoint policies to subnets delegated to Azure SQL Managed Instance. 
services: sql-database
ms.service: sql-managed-instance
ms.subservice: 
ms.custom:
ms.devlang: 
ms.topic: how-to
author: zoranril
ms.author: zoranrilak
ms.reviewer: 
ms.date: 09/24/2021
---

# Configure service endpoint policies for Azure Storage for Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Virtual Network (VNet) [service endpoint policies](../../virtual-network/virtual-network-service-endpoint-policies-overview.md) for Azure Storage allow you to filter egress virtual network traffic to Azure Storage accounts over service endpoint, and allow data exfiltration to only specific Azure Storage accounts. Endpoint policies in subnets delegated to Azure SQL Managed Instance provide granular access control for virtual network traffic from such subnets to Azure Storage when connecting over service endpoint.

## Key benefits

Virtual network service endpoint policies for Azure Storage applied to Azure SQL Managed Instance provide the following benefits:
- __Improved security for your Azure SQL Managed Instance traffic to Azure Storage__
Configuring service endpoint policies for Azure Storage establishes an additional layer of security to prevent erroneous or malicious exfiltration of sensitive or business-critical data into Azure Storage accounts that are not configured according to the data classification. Applying service endpoint policies for Azure Storage to a subnet has the effect of limiting the traffic from that subnet to only those Azure Storage accounts that are listed in the policies.

- __Granular control over which Azure Storage accounts can be accessed__
Service endpoint policy can allow Azure Storage accounts at a subscription level, resource group level, or individual storage account level. In this way, system administrators can establish a granular access control mechanism that matches the purpose of their Azure Storage resources and the corresponding data governance goals.

Service endpoint policies are an “implicit deny” security mechanism, which means that access from within the subnet will be denied to all Azure Storage accounts except those explicitly listed in the policies. Multiple service endpoint policies are treated additively, and all the resources listed in all policies will be made accessible from inside that subnet.

It is important to note that service endpoint policies only affect the connections to Azure Storage that originate from the subnet on which that service endpoint policy is configured. It will not affect, for example, exporting the database to a BACPAC file on premises; Azure Data Factory integrations; the collection of diagnostic information via Azure Diagnostic Settings; nor other mechanisms of data extraction from inside the Managed Instance subnet that do not directly target Azure Storage.

## Limitations

- The feature is available only to virtual networks deployed through the Azure Resource Manager deployment model.
- Service endpoint policies for Azure Storage only apply to subnets that have Azure Storage service endpoints configured.
- Enabling service endpoints for Azure Storage also extends to include paired regions where you deploy the virtual network to support Read-Access Geo-Redundant Storage (RA-GRS) and Geo-Redundant Storage (GRS) traffic.
- Assigning a service endpoint policy to a service endpoint will upgrade the endpoint from regional to global scope. In other words, all traffic to Azure Storage will go through the service endpoint regardless of the region in which the storage account resides.

## Prepare your Azure Storage account inventory

Before you apply your first service endpoint policy to a subnet, compose a list of all Azure Storage accounts which should be accessible by the managed instances hosted in that subnet. If those instances take part in any of the workflows listed below, make sure that all the Azure Storage accounts which should be readable or writable from inside that subnet are included in the service endpoint policies we create later in this guide. We recommend that you first do this on subscription level, then progressively narrow down to resource groups and storage accounts (as explained later).

Workflows that are affected by service endpoint policies include:
- Logging [extended events](../database/xevent-db-diff-from-svr.md) to an Event File target on Azure Storage.
- [Auditing](auditing-configure.md) to Azure Storage.
- Importing data with [BULK INSERT or OPENROWSET(BULK ...)](/sql/relational-databases/import-export/import-bulk-data-by-using-bulk-insert-or-openrowset-bulk-sql-server).
- Performing [copy-only backup](/sql/relational-databases/backup-restore/copy-only-backups-sql-server) to Azure Storage.
- [Restoring](restore-sample-database-quickstart.md) a database from Azure Storage.
- [Azure DMS offline migration](../../dms/tutorial-sql-server-to-managed-instance.md) to Azure SQL Managed Instance.
- [Log Replay Service migration](log-replay-service-migrate.md) to Azure SQL Managed Instance.
- Synchronizing tables using [transactional replication](replication-transactional-overview.md). 

## Enable service endpoint policies for Azure Storage for Azure SQL Managed Instance
We will follow a simplified process that creates and configures a single service endpoint policy suitable for Azure SQL Managed Instance. You can adapt this process to suit your specific needs or to create multiple service endpoint policies.

> [!IMPORTANT]
> If you are already familiar with the steps to create a service endpoint policy, please note that for a service endpoint policy to work with Azure SQL Managed Instance, it must also have a __service alias__ configured. This is explained in steps 4 and 5 below.

### Create a service endpoint policy

1.	Select **+ Create a resource** on the upper-left corner of the Azure portal.
2.	In search pane, type "service endpoint policy" and select **Service endpoint policy** and then select **Create**.

![Create service endpoint policy](../../virtual-network/media/virtual-network-service-endpoint-policies-portal/create-sep-resource.png)

3.	Enter, or select, the following information in **Basics**:
- Subscription: Select your subscription for policy.
- Resource group: Select the resource group where your Azure SQL Managed Instance is located, or select **Create new** and fill in the name for a new resource group.
- Name: _mySEP_
- Location: Select the region of the virtual network hosting the Azure SQL Managed Instance.

![Create service endpoint policy basics](../../virtual-network/media/virtual-network-service-endpoint-policies-portal/create-sep-basics.png)

4. In **Policy definitions**, select **Add an alias** and enter the following information in **Add an alias** pane:
- Service Alias: Select /Services/Azure/ManagedInstance.
- Click on **Add** button at the bottom to finish adding the service alias.

![Add an alias to a service endpoint policy](./media/service-endpoint-policies-configure/add-an-alias.png)

> [!TIP]
> If you are creating multiple service endpoint policies for an Azure SQL Managed Instance’s subnet, we recommend that each such policy contain the **/Services/Azure/ManagedInstance** service alias. Doing so will simplify policy management and prevent errors when reconfiguring policies.

5. In Policy definitions, select **+ Add** under **Resources** and enter or select the following information in **Add a resource** pane:
- Service: Select **Microsoft.Storage**.
- Scope: Select **All accounts in subscription**.
- Subscription: Select a subscription containing the storage account to permit. Refer to your [inventory of Azure Storage accounts created earlier](#prepare-your-azure-storage-account-inventory).
- Click on **Add** button at the bottom to finish adding the resource.
- Add more subscriptions by repeating the above steps as needed.

![Add a resource to a service endpoint policy](./media/service-endpoint-policies-configure/add-a-resource.png)



## Troubleshooting

- cannot assign? remove locks/policies, wait 2h and retry. See Network requirements(link)













This article provides guidelines on how to manually delete a subnet after deleting the last Azure SQL Managed Instance residing in it.

SQL Managed Instances are deployed into [virtual clusters](connectivity-architecture-overview.md#virtual-cluster-connectivity-architecture). Each virtual cluster is associated with a subnet and deployed together with first instance creation. In the same way, a virtual cluster is automatically removed together with last instance deletion leaving the subnet empty and ready for removal. There is no need for any manual action on the virtual cluster in order to release the subnet. Once the last virtual cluster is deleted, you can go and delete the subnet

There are rare circumstances in which create operation can fail and result with deployed empty virtual cluster. Additionally, as instance creation [can be canceled](management-operations-cancel.md), it is possible for a virtual cluster to be deployed with instances residing inside, in a failed state. Virtual cluster removal will automatically be initiated in these situations and removed in the background.

> [!NOTE]
> There are no charges for keeping an empty virtual cluster or instances that have failed to create.

> [!IMPORTANT]
> - The virtual cluster should contain no SQL Managed Instances for the deletion to be successful. This does not include instances that have failed to create. 
> - Deletion of a virtual cluster is a long-running operation lasting for about 1.5 hours (see [SQL Managed Instance management operations](management-operations-overview.md) for up-to-date virtual cluster delete time). The virtual cluster will still be visible in the portal until this process is completed.
> - Only one delete operation can be run on the virtual cluster. All subsequent customer-initiated delete requests will result with an error as delete operation is already in progress.

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

## Delete a virtual cluster by using the API

To delete a virtual cluster through the API, use the URI parameters specified in the [virtual clusters delete method](/rest/api/sql/virtualclusters/delete).

## Next steps

- For an overview, see [What is Azure SQL Managed Instance?](sql-managed-instance-paas-overview.md).
- Learn about [connectivity architecture in SQL Managed Instance](connectivity-architecture-overview.md).
- Learn how to [modify an existing virtual network for SQL Managed Instance](vnet-existing-add-subnet.md).
- For a tutorial that shows how to create a virtual network, create an Azure SQL Managed Instance, and restore a database from a database backup, see [Create an Azure SQL Managed Instance (portal)](instance-create-quickstart.md).
- For DNS issues, see [Configure a custom DNS](custom-dns-configure.md).
