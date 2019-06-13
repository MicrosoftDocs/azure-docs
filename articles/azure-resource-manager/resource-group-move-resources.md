---
title: Move Azure resources to new subscription or resource group | Microsoft Docs
description: Use Azure Resource Manager to move resources to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 05/17/2019
ms.author: tomfitz

---
# Move resources to new resource group or subscription

This article shows you how to move Azure resources to either another Azure subscription or another resource group under the same subscription. You can use the Azure portal, Azure PowerShell, Azure CLI, or the REST API to move resources.

Both the source group and the target group are locked during the move operation. Write and delete operations are blocked on the resource groups until the move completes. This lock means you can't add, update, or delete resources in the resource groups, but it doesn't mean the resources are frozen. For example, if you move a SQL Server and its database to a new resource group, an application that uses the database experiences no downtime. It can still read and write to the database.

Moving a resource only moves it to a new resource group. The move operation can't change the location of the resource. The new resource group may have a different location, but that doesn't change the location of the resource.

> [!NOTE]
> This article describes how to move resources between existing Azure subscriptions. If you actually want to upgrade your Azure subscription (such as switching from free to pay-as-you-go), you need to convert your subscription.
> * To upgrade a free trial, see [Upgrade your Free Trial or Microsoft Imagine Azure subscription to Pay-As-You-Go](..//billing/billing-upgrade-azure-subscription.md).
> * To change a pay-as-you-go account, see [Change your Azure Pay-As-You-Go subscription to a different offer](../billing/billing-how-to-switch-azure-offer.md).
> * If you can't convert the subscription, [create an Azure support request](../azure-supportability/how-to-create-azure-support-request.md). Select **Subscription Management** for the issue type.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## When to call Azure support

You can move most resources through the self-service operations shown in this article. Use the self-service operations to:

* Move Resource Manager resources.
* Move classic resources according to the [classic deployment limitations](#classic-deployment-limitations).

Contact [support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) when you need to:

* Move your resources to a new Azure account (and Azure Active Directory tenant) and you need help with the instructions in the preceding section.
* Move classic resources but are having trouble with the limitations.

## Services that can be moved

The following list provides a general summary of Azure services that can be moved to a new resource group and subscription. For a list of which resource types support move, see [Move operation support for resources](move-support-resources.md).

* Analysis Services
* API Management
* App Service apps (web apps) - see [App Service limitations](#app-service-limitations)
* App Service Certificates - see [App Service Certificate limitations](#app-service-certificate-limitations)
* Automation - Runbooks must exist in the same resource group as the Automation Account.
* Azure Active Directory B2C
* Azure Cache for Redis - if the Azure Cache for Redis instance is configured with a virtual network, the instance can't be moved to a different subscription. See [Virtual Networks limitations](#virtual-networks-limitations).
* Azure Cosmos DB
* Azure Data Explorer
* Azure Database for MariaDB
* Azure Database for MySQL
* Azure Database for PostgreSQL
* Azure DevOps - follow steps to [change the Azure subscription used for billing](/azure/devops/organizations/billing/change-azure-subscription?view=azure-devops).
* Azure Maps
* Azure Monitor logs
* Azure Relay
* Azure Stack - registrations
* Batch
* BizTalk Services
* Bot Service
* CDN
* Cloud Services - see [Classic deployment limitations](#classic-deployment-limitations)
* Cognitive Services
* Container Registry
* Content Moderator
* Cost Management
* Customer Insights
* Data Catalog
* Data Factory
* Data Lake Analytics
* Data Lake Store
* DNS
* Event Grid
* Event Hubs
* Front Door
* HDInsight clusters - see [HDInsight limitations](#hdinsight-limitations)
* Iot Central
* IoT Hubs
* Key Vault - Key Vaults used for disk encryption can't be moved to resource groups in the same subscription or across subscriptions.
* Load Balancers - Basic SKU Load Balancer can be moved. Standard SKU Load Balancer can't be moved.
* Logic Apps
* Machine Learning - Machine Learning Studio web services can be moved to a resource group in the same subscription, but not a different subscription. Other Machine Learning resources can be moved across subscriptions.
* Managed Disks - Managed Disks in Availability Zones can't be moved to a different subscription
* Managed Identity - user-assigned
* Media Services
* Monitor - make sure moving to new subscription doesn't exceed [subscription quotas](../azure-subscription-service-limits.md#monitor-limits)
* Notification Hubs
* Operational Insights
* Operations Management
* Portal dashboards
* Power BI - both Power BI Embedded and Power BI Workspace Collection
* Public IP - Basic SKU Public IP can be moved. Standard SKU Public IP can't be moved.
* Recovery Services vault - enroll in a [preview](#recovery-services-limitations).
* SAP HANA on Azure
* Scheduler
* Search - You can't move several Search resources in different regions in one operation. Instead, move them in separate operations.
* Service Bus
* Service Fabric
* Service Fabric Mesh
* SignalR Service
* Storage - storage accounts in different regions can't be moved in the same operation. Instead, use separate operations for each region.
* Storage (classic) - see [Classic deployment limitations](#classic-deployment-limitations)
* Storage Sync Service
* Stream Analytics - Stream Analytics jobs can't be moved when in running state.
* SQL Database server - database and server must be in the same resource group. When you move a SQL server, all its databases are also moved. This behavior applies to Azure SQL Database and Azure SQL Data Warehouse databases.
* Time Series Insights
* Traffic Manager
* Virtual Machines - see [Virtual Machines limitations](#virtual-machines-limitations)
* Virtual Machines (classic) - see [Classic deployment limitations](#classic-deployment-limitations)
* Virtual Machine Scale Sets - see [Virtual Machines limitations](#virtual-machines-limitations)
* Virtual Networks - see [Virtual Networks limitations](#virtual-networks-limitations)
* VPN Gateway

### Services that cannot be moved

The following list provides a general summary of Azure services that can't be moved to a new resource group and subscription. For greater detail, see [Move operation support for resources](move-support-resources.md).

* AD Domain Services
* AD Hybrid Health Service
* Application Gateway
* Azure Database Migration
* Azure Databricks
* Azure Firewall
* Azure Kubernetes Service (AKS)
* Azure Migrate
* Azure NetApp Files
* Certificates - App Service Certificates can be moved, but uploaded certificates have [limitations](#app-service-limitations).
* Classic Applications
* Container Instances
* Container Service
* Data Box
* Dev Spaces
* Dynamics LCS
* ExpressRoute
* Lab Services - Classroom Labs can't be moved to a new resource group or subscription. DevTest Labs can be moved to a new resource group in the same subscription, but not across subscriptions.
* Managed Applications
* Microsoft Genomics
* Security
* Site Recovery
* StorSimple Device Manager
* Virtual Networks (classic) - see [Classic deployment limitations](#classic-deployment-limitations)

## Limitations

The section provides descriptions of how to handle complicated scenarios for moving resources. The limitations are:

* [Virtual Machines limitations](#virtual-machines-limitations)
* [Virtual Networks limitations](#virtual-networks-limitations)
* [App Service limitations](#app-service-limitations)
* [App Service Certificate limitations](#app-service-certificate-limitations)
* [Classic deployment limitations](#classic-deployment-limitations)
* [Recovery Services limitations](#recovery-services-limitations)
* [HDInsight limitations](#hdinsight-limitations)

### Virtual Machines limitations

You can move virtual machines with the managed disks, managed images, managed snapshots, and availability sets with virtual machines that use managed disks. Managed Disks in Availability Zones can't be moved to a different subscription.

The following scenarios aren't yet supported:

* Virtual Machines with certificate stored in Key Vault can be moved to a new resource group in the same subscription, but not across subscriptions.
* Virtual Machine Scale Sets with Standard SKU Load Balancer or Standard SKU Public IP can't be moved.
* Virtual machines created from Marketplace resources with plans attached can't be moved across resource groups or subscriptions. Deprovision the virtual machine in the current subscription, and deploy again in the new subscription.
* Virtual machines in an existing Virtual Network where the user does not intend to move all resources in the Virtual Network.

To move virtual machines configured with Azure Backup, use the following workaround:

* Find the location of your Virtual Machine.
* Find a resource group with the following naming pattern: `AzureBackupRG_<location of your VM>_1` for example, AzureBackupRG_westus2_1
* If in Azure portal, then check "Show hidden types"
* If in PowerShell, use the `Get-AzResource -ResourceGroupName AzureBackupRG_<location of your VM>_1` cmdlet
* If in CLI, use the `az resource list -g AzureBackupRG_<location of your VM>_1`
* Find the resource with type `Microsoft.Compute/restorePointCollections` that has the naming pattern `AzureBackup_<name of your VM that you're trying to move>_###########`
* Delete this resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.
* After delete is complete, you'll be able to move your Virtual Machine. You can move the vault and virtual machine to the target subscription. After the move, you can continue backups with no loss in data.
* For information about moving Recovery Service vaults for backup, see [Recovery Services limitations](#recovery-services-limitations).

### Virtual Networks limitations

When moving a virtual network, you must also move its dependent resources. For VPN Gateways, you must move IP addresses, virtual network gateways, and all associated connection resources. Local network gateways can be in a different resource group.

To move a virtual machine with a network interface card, you must move all dependent resources. You must move the virtual network for the network interface card, all other network interface cards for the virtual network, and the VPN gateways.

To move a peered virtual network, you must first disable the virtual network peering. Once disabled, you can move the virtual network. After the move, reenable the virtual network peering.

You can't move a virtual network to a different subscription if the virtual network contains a subnet with resource navigation links. For example, if an Azure Cache for Redis resource is deployed into a subnet, that subnet has a resource navigation link.

### App Service limitations

The limitations for moving App Service resources differ based on whether you're moving the resources within a subscription or to a new subscription. If your web app uses an App Service Certificate, see [App Service Certificate limitations](#app-service-certificate-limitations)

#### Moving within the same subscription

When moving a Web App _within the same subscription_, you can't move third-party SSL certificates. However, you can move a Web App to the new resource group without moving its third-party certificate, and your app's SSL functionality still works.

If you want to move the SSL certificate with the Web App, follow these steps:

1. Delete the third-party certificate from the Web App, but keep a copy of your certificate
2. Move the Web App.
3. Upload the third-party certificate to the moved Web App.

#### Moving across subscriptions

When moving a Web App _across subscriptions_, the following limitations apply:

- The destination resource group must not have any existing App Service resources. App Service resources include:
    - Web Apps
    - App Service plans
    - Uploaded or imported SSL certificates
    - App Service Environments
- All App Service resources in the resource group must be moved together.
- App Service resources can only be moved from the resource group in which they were originally created. If an App Service resource is no longer in its original resource group, it must be moved back to that original resource group first, and then it can be moved across subscriptions.

If you don't remember the original resource group, you can find it through diagnostics. For your web app, select **Diagnose and solve problems**. Then, select **Configuration and Management**.

![Select diagnostics](./media/resource-group-move-resources/select-diagnostics.png)

Select **Migration Options**.

![Select migration options](./media/resource-group-move-resources/select-migration.png)

Select the option for recommended steps to move the web app.

![Select recommended steps](./media/resource-group-move-resources/recommended-steps.png)

You see the recommended actions to take before moving the resources. The information includes the original resource group for the web app.

![Recommendations](./media/resource-group-move-resources/recommendations.png)

### App Service Certificate limitations

You can move your App Service Certificate to a new resource group or subscription. If your App Service Certificate is bound to a web app, you must take some steps before moving the resources to a new subscription. Delete the SSL binding and private certificate from the web app before moving the resources. The App Service Certificate doesn't need to be deleted, just the private certificate in the web app.

### Classic deployment limitations

The options for moving resources deployed through the classic model differ based on whether you're moving the resources within a subscription or to a new subscription.

#### Same subscription

When moving resources from one resource group to another resource group within the same subscription, the following restrictions apply:

* Virtual networks (classic) can't be moved.
* Virtual machines (classic) must be moved with the cloud service.
* Cloud service can only be moved when the move includes all its virtual machines.
* Only one cloud service can be moved at a time.
* Only one storage account (classic) can be moved at a time.
* Storage account (classic) can't be moved in the same operation with a virtual machine or a cloud service.

To move classic resources to a new resource group within the same subscription, use the standard move operations through the [portal](#use-portal), Azure PowerShell, Azure CLI, or REST API. You use the same operations as you use for moving Resource Manager resources.

#### New subscription

When moving resources to a new subscription, the following restrictions apply:

* All classic resources in the subscription must be moved in the same operation.
* The target subscription must not have any other classic resources.
* The move can only be requested through a separate REST API for classic moves. The standard Resource Manager move commands don't work when moving classic resources to a new subscription.

To move classic resources to a new subscription, use the REST operations that are specific to classic resources. To use REST, do the following steps:

1. Check if the source subscription can participate in a cross-subscription move. Use the following operation:

   ```HTTP
   POST https://management.azure.com/subscriptions/{sourceSubscriptionId}/providers/Microsoft.ClassicCompute/validateSubscriptionMoveAvailability?api-version=2016-04-01
   ```

     In the request body, include:

   ```json
   {
    "role": "source"
   }
   ```

     The response for the validation operation is in the following format:

   ```json
   {
    "status": "{status}",
    "reasons": [
      "reason1",
      "reason2"
    ]
   }
   ```

2. Check if the destination subscription can participate in a cross-subscription move. Use the following operation:

   ```HTTP
   POST https://management.azure.com/subscriptions/{destinationSubscriptionId}/providers/Microsoft.ClassicCompute/validateSubscriptionMoveAvailability?api-version=2016-04-01
   ```

     In the request body, include:

   ```json
   {
    "role": "target"
   }
   ```

     The response is in the same format as the source subscription validation.
3. If both subscriptions pass validation, move all classic resources from one subscription to another subscription with the following operation:

   ```HTTP
   POST https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.ClassicCompute/moveSubscriptionResources?api-version=2016-04-01
   ```

    In the request body, include:

   ```json
   {
    "target": "/subscriptions/{target-subscription-id}"
   }
   ```

The operation may run for several minutes.

### Recovery Services limitations

 To move a Recovery Services vault, follow these steps: [Move resources to new resource group or subscription](../backup/backup-azure-move-recovery-services-vault.md).

Currently, you can move one Recovery Services vault, per region, at a time. You can't move vaults that back up Azure Files, Azure File Sync, or SQL in IaaS virtual machines.

If a virtual machine doesn't move with the vault, the current virtual machine recovery points stay in the vault until they expire. Whether the virtual machine moved with the vault or not, you can restore the virtual machine from the backup history in the vault.

Recovery Services vault doesn't support cross subscription backups. If you move a vault with virtual machine backup data across subscriptions, you must move your virtual machines to the same subscription, and use the same target resource group to continue backups.

Backup policies defined for the vault are kept after the vault moves. Reporting and monitoring must be set up again for the vault after the move.

To move a virtual machine to a new subscription without moving the Recovery Services vault:

 1. Temporarily stop backup
 1. [Delete the restore point](#virtual-machines-limitations). This operation deletes only the instant recovery points, not the backed-up data in the vault.
 1. Move the virtual machines to the new subscription
 1. Reprotect it under a new vault in that subscription

Move isn't enabled for Storage, Network, or Compute resources used to set up disaster recovery with Azure Site Recovery. For example, suppose you have set up replication of your on-premises machines to a storage account (Storage1) and want the protected machine to come up after failover to Azure as a virtual machine (VM1) attached to a virtual network (Network1). You can't move any of these Azure resources - Storage1, VM1, and Network1 - across resource groups within the same subscription or across subscriptions.

### HDInsight limitations

You can move HDInsight clusters to a new subscription or resource group. However, you can't move across subscriptions the networking resources linked to the HDInsight cluster (such as the virtual network, NIC, or load balancer). In addition, you can't move to a new resource group a NIC that is attached to a virtual machine for the cluster.

When moving an HDInsight cluster to a new subscription, first move other resources (like the storage account). Then, move the HDInsight cluster by itself.

## Checklist before moving resources

There are some important steps to do before moving a resource. By verifying these conditions, you can avoid errors.

1. The source and destination subscriptions must be active. If you have trouble enabling an account that has been disabled, [create an Azure support request](../azure-supportability/how-to-create-azure-support-request.md). Select **Subscription Management** for the issue type.

1. The source and destination subscriptions must exist within the same [Azure Active Directory tenant](../active-directory/develop/quickstart-create-new-tenant.md). To check that both subscriptions have the same tenant ID, use Azure PowerShell or Azure CLI.

   For Azure PowerShell, use:

   ```azurepowershell-interactive
   (Get-AzSubscription -SubscriptionName <your-source-subscription>).TenantId
   (Get-AzSubscription -SubscriptionName <your-destination-subscription>).TenantId
   ```

   For Azure CLI, use:

   ```azurecli-interactive
   az account show --subscription <your-source-subscription> --query tenantId
   az account show --subscription <your-destination-subscription> --query tenantId
   ```

   If the tenant IDs for the source and destination subscriptions aren't the same, use the following methods to reconcile the tenant IDs:

   * [Transfer ownership of an Azure subscription to another account](../billing/billing-subscription-transfer.md)
   * [How to associate or add an Azure subscription to Azure Active Directory](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)

1. The destination subscription must be registered for the resource provider of the resource being moved. If not, you receive an error stating that the **subscription is not registered for a resource type**. You might see this error when moving a resource to a new subscription, but that subscription has never been used with that resource type.

   For PowerShell, use the following commands to get the registration status:

   ```azurepowershell-interactive
   Set-AzContext -Subscription <destination-subscription-name-or-id>
   Get-AzResourceProvider -ListAvailable | Select-Object ProviderNamespace, RegistrationState
   ```

   To register a resource provider, use:

   ```azurepowershell-interactive
   Register-AzResourceProvider -ProviderNamespace Microsoft.Batch
   ```

   For Azure CLI, use the following commands to get the registration status:

   ```azurecli-interactive
   az account set -s <destination-subscription-name-or-id>
   az provider list --query "[].{Provider:namespace, Status:registrationState}" --out table
   ```

   To register a resource provider, use:

   ```azurecli-interactive
   az provider register --namespace Microsoft.Batch
   ```

1. The account moving the resources must have at least the following permissions:

   * **Microsoft.Resources/subscriptions/resourceGroups/moveResources/action** on the source resource group.
   * **Microsoft.Resources/subscriptions/resourceGroups/write** on the destination resource group.

1. Before moving the resources, check the subscription quotas for the subscription you're moving the resources to. If moving the resources means the subscription will exceed its limits, you need to review whether you can request an increase in the quota. For a list of limits and how to request an increase, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).

1. When possible, break large moves into separate move operations. Resource Manager immediately returns an error when there are more than 800 resources in a single operation. However, moving less than 800 resources may also fail by timing out.

1. The service must enable the ability to move resources. To determine whether the move will succeed, [validate your move request](#validate-move). See the sections below in this article of which [services enable moving resources](#services-that-can-be-moved) and which [services don't enable moving resources](#services-that-cannot-be-moved).

## Validate move

The [validate move operation](/rest/api/resources/resources/validatemoveresources) lets you test your move scenario without actually moving the resources. Use this operation to determine if the move will succeed. To run this operation, you need the:

* name of the source resource group
* resource ID of the target resource group
* resource ID of each resource to move
* the [access token](/rest/api/azure/#acquire-an-access-token) for your account

Send the following request:

```
POST https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<source-group>/validateMoveResources?api-version=2018-02-01
Authorization: Bearer <access-token>
Content-type: application/json
```

With a request body:

```json
{
 "resources": ["<resource-id-1>", "<resource-id-2>"],
 "targetResourceGroup": "/subscriptions/<subscription-id>/resourceGroups/<target-group>"
}
```

If the request is formatted correctly, the operation returns:

```
Response Code: 202
cache-control: no-cache
pragma: no-cache
expires: -1
location: https://management.azure.com/subscriptions/<subscription-id>/operationresults/<operation-id>?api-version=2018-02-01
retry-after: 15
...
```

The 202 status code indicates the validation request was accepted, but it hasn't yet determined if the move operation will succeed. The `location` value contains a URL that you use to check the status of the long-running operation.  

To check the status, send the following request:

```
GET <location-url>
Authorization: Bearer <access-token>
```

While the operation is still running, you continue to receive the 202 status code. Wait the number of seconds indicated in the `retry-after` value before trying again. If the move operation validates successfully, you receive the 204 status code. If the move validation fails, you receive an error message, such as:

```json
{"error":{"code":"ResourceMoveProviderValidationFailed","message":"<message>"...}}
```

## Move resources

### <a name="use-portal" />By using Azure portal

To move resources, select the resource group with those resources, and then select the **Move** button.

![move resources](./media/resource-group-move-resources/select-move.png)

Select whether you're moving the resources to a new resource group or a new subscription.

Select the resources to move and the destination resource group. Acknowledge that you need to update scripts for these resources and select **OK**. If you selected the edit subscription icon in the previous step, you must also select the destination subscription.

![select destination](./media/resource-group-move-resources/select-destination.png)

In **Notifications**, you see that the move operation is running.

![show move status](./media/resource-group-move-resources/show-status.png)

When it has completed, you're notified of the result.

![show move result](./media/resource-group-move-resources/show-result.png)

### By using Azure PowerShell

To move existing resources to another resource group or subscription, use the [Move-AzResource](/powershell/module/az.resources/move-azresource) command. The following example shows how to move several resources to a new resource group.

```azurepowershell-interactive
$webapp = Get-AzResource -ResourceGroupName OldRG -ResourceName ExampleSite
$plan = Get-AzResource -ResourceGroupName OldRG -ResourceName ExamplePlan
Move-AzResource -DestinationResourceGroupName NewRG -ResourceId $webapp.ResourceId, $plan.ResourceId
```

To move to a new subscription, include a value for the `DestinationSubscriptionId` parameter.

### By using Azure CLI

To move existing resources to another resource group or subscription, use the [az resource move](/cli/azure/resource?view=azure-cli-latest#az-resource-move) command. Provide the resource IDs of the resources to move. The following example shows how to move several resources to a new resource group. In the `--ids` parameter, provide a space-separated list of the resource IDs to move.

```azurecli
webapp=$(az resource show -g OldRG -n ExampleSite --resource-type "Microsoft.Web/sites" --query id --output tsv)
plan=$(az resource show -g OldRG -n ExamplePlan --resource-type "Microsoft.Web/serverfarms" --query id --output tsv)
az resource move --destination-group newgroup --ids $webapp $plan
```

To move to a new subscription, provide the `--destination-subscription-id` parameter.

### By using REST API

To move existing resources to another resource group or subscription, run:

```HTTP
POST https://management.azure.com/subscriptions/{source-subscription-id}/resourcegroups/{source-resource-group-name}/moveResources?api-version={api-version}
```

In the request body, you specify the target resource group and the resources to move. For more information about the move REST operation, see [Move resources](/rest/api/resources/Resources/MoveResources).

## Next steps

* To learn about the PowerShell cmdlets for managing your resources, see [Using Azure PowerShell with Resource Manager](manage-resources-powershell.md).
* To learn about the Azure CLI commands for managing your resources, see [Using the Azure CLI with Resource Manager](manage-resources-cli.md).
* To learn about portal features for managing your subscription, see [Using the Azure portal to manage resources](resource-group-portal.md).
* To learn about applying a logical organization to your resources, see [Using tags to organize your resources](resource-group-using-tags.md).
