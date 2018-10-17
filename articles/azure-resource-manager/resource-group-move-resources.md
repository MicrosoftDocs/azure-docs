---
title: Move Azure resources to new subscription or resource group | Microsoft Docs
description: Use Azure Resource Manager to move resources to a new resource group or subscription.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac

ms.assetid: ab7d42bd-8434-4026-a892-df4a97b60a9b
ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/25/2018
ms.author: tomfitz

---
# Move resources to new resource group or subscription

This article shows you how to move resources to either a new subscription or a new resource group in the same subscription. You can use the portal, PowerShell, Azure CLI, or the REST API to move resource. The move operations in this article are available to you without any assistance from Azure support.

When moving resources, both the source group and the target group are locked during the operation. Write and delete operations are blocked on the resource groups until the move completes. This lock means you can't add, update, or delete resources in the resource groups, but it doesn't mean the resources are frozen. For example, if you move a SQL Server and its database to a new resource group, an application that uses the database experiences no downtime. It can still read and write to the database.

You can't change the location of the resource. Moving a resource only moves it to a new resource group. The new resource group may have a different location, but that doesn't change the location of the resource.

> [!NOTE]
> This article describes how to move resources within an existing Azure account offering. If you actually want to change your Azure account offering (such as upgrading from pay-as-you-go to pre-pay) while continuing to work with your existing resources, see [Switch your Azure subscription to another offer](../billing/billing-how-to-switch-azure-offer.md).
>
>

## Checklist before moving resources

There are some important steps to perform before moving a resource. By verifying these conditions, you can avoid errors.

1. The source and destination subscriptions must exist within the same [Azure Active Directory tenant](../active-directory/develop/quickstart-create-new-tenant.md). To check that both subscriptions have the same tenant ID, use Azure PowerShell or Azure CLI.

  For Azure PowerShell, use:

  ```powershell
  (Get-AzureRmSubscription -SubscriptionName <your-source-subscription>).TenantId
  (Get-AzureRmSubscription -SubscriptionName <your-destination-subscription>).TenantId
  ```

  For Azure CLI, use:

  ```azurecli-interactive
  az account show --subscription <your-source-subscription> --query tenantId
  az account show --subscription <your-destination-subscription> --query tenantId
  ```

  If the tenant IDs for the source and destination subscriptions aren't the same, use the following methods to reconcile the tenant IDs:

  * [Transfer ownership of an Azure subscription to another account](../billing/billing-subscription-transfer.md)
  * [How to associate or add an Azure subscription to Azure Active Directory](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)

1. The destination subscription must be registered for the resource provider of the resource being moved. If not, you receive an error stating that the **subscription is not registered for a resource type**. You might encounter this problem when moving a resource to a new subscription, but that subscription has never been used with that resource type.

  For PowerShell, use the following commands to get the registration status:

  ```powershell
  Set-AzureRmContext -Subscription <destination-subscription-name-or-id>
  Get-AzureRmResourceProvider -ListAvailable | Select-Object ProviderNamespace, RegistrationState
  ```

  To register a resource provider, use:

  ```powershell
  Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Batch
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

1. When possible, break large moves into separate move operations. Resource Manager immediately fails attempts to move more than 800 resources in a single operation. However, moving less than 800 resources may also fail by timing out.

1. The service must enable the ability to move resources. To determine whether the move will succeed, [validate your move request](#validate-move). See the sections below in this article of which [services enable moving resources](#services-that-can-be-moved) and which [services don't enable moving resources](#services-that-cannot-be-moved).

## When to call support

You can move most resources through the self-service operations shown in this article. Use the self-service operations to:

* Move Resource Manager resources.
* Move classic resources according to the [classic deployment limitations](#classic-deployment-limitations).

Contact [support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) when you need to:

* Move your resources to a new Azure account (and Azure Active Directory tenant) and you need help with the instructions in the preceding section.
* Move classic resources but are having trouble with the limitations.

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
 "resources": ['<resource-id-1>', '<resource-id-2>'],
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

## Services that can be moved

The following list provides a general summary of Azure services that can be moved to a new resource group and subscription. For greater detail, see [Move operation support for resources](move-support-resources.md).

* Analysis Services
* API Management
* App Service apps (web apps) - see [App Service limitations](#app-service-limitations)
* App Service Certificates
* Application Insights
* Automation
* Azure Active Directory B2C
* Azure Cosmos DB
* Azure Database for MySQL
* Azure Database for PostgreSQL
* Azure DevOps - Azure DevOps organizations with non-Microsoft extension purchases must [cancel their purchases](https://go.microsoft.com/fwlink/?linkid=871160) before they can move the account across subscriptions.
* Azure Maps
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
* Key Vault
* Load Balancers - see [Load Balancer limitations](#lb-limitations)
* Log Analytics
* Logic Apps
* Machine Learning - Machine Learning Studio web services can be moved to a resource group in the same subscription, but not a different subscription. Other Machine Learning resources can be moved across subscriptions.
* Managed Disks - see [Virtual Machines limitations for constraints](#virtual-machines-limitations)
* Managed Identity - user-assigned
* Media Services
* Notification Hubs
* Operational Insights
* Operations Management
* Portal dashboards
* Power BI - both Power BI Embedded and Power BI Workspace Collection
* Public IP - see [Public IP limitations](#pip-limitations)
* Redis Cache - if the Redis Cache instance is configured with a virtual network, the instance can't be moved to a different subscription. See [Virtual Networks limitations](#virtual-networks-limitations).
* Scheduler
* Search
* Service Bus
* Service Fabric
* Service Fabric Mesh
* SignalR Service
* Storage - storage accounts in different regions can't be moved in the same operation. Instead, use separate operations for each region.
* Storage (classic) - see [Classic deployment limitations](#classic-deployment-limitations)
* Stream Analytics - Stream Analytics jobs can't be moved when in running state.
* SQL Database server - database and server must reside in the same resource group. When you move a SQL server, all its databases are also moved. This behavior applies to Azure SQL Database and Azure SQL Data Warehouse databases.
* Time Series Insights
* Traffic Manager
* Virtual Machines - for VMs with managed disks, see [Virtual Machines limitations](#virtual-machines-limitations)
* Virtual Machines (classic) - see [Classic deployment limitations](#classic-deployment-limitations)
* Virtual Machine Scale Sets - see [Virtual Machines limitations](#virtual-machines-limitations)
* Virtual Networks - see [Virtual Networks limitations](#virtual-networks-limitations)
* VPN Gateway

## Services that cannot be moved

The following list provides a general summary of Azure services that can't be moved to a new resource group and subscription. For greater detail, see [Move operation support for resources](move-support-resources.md).

* AD Domain Services
* AD Hybrid Health Service
* Application Gateway
* Azure Database Migration
* Azure Databricks
* Azure Migrate
* Batch AI
* Certificates - App Service Certificates can be moved, but uploaded certificates have [limitations](#app-service-limitations).
* Container Instances
* Container Service
* Data Box
* Dev Spaces
* Dynamics LCS
* Express Route
* Kubernetes Service
* Lab Services - move to new resource group in same subscription is enabled, but cross subscription move isn't enabled.
* Load Balancers - see [Load Balancer limitations](#lb-limitations)
* Managed Applications
* Microsoft Genomics
* NetApp
* Public IP - see [Public IP limitations](#pip-limitations)
* Recovery Services vault - also don't move the Compute, Network, and Storage resources associated with the Recovery Services vault, see [Recovery Services limitations](#recovery-services-limitations).
* SAP HANA on Azure
* Security
* Site Recovery
* StorSimple Device Manager
* Virtual Networks (classic) - see [Classic deployment limitations](#classic-deployment-limitations)

## Virtual Machines limitations

Managed disks are supported for move as of September 24, 2018. 

1. You'll have to register to enable this feature.

  ```azurepowershell-interactive
  Register-AzureRmProviderFeature -FeatureName ManagedResourcesMove -ProviderNamespace Microsoft.Compute
  ```

  ```azurecli-interactive
  az feature register --namespace Microsoft.Compute --name ManagedResourcesMove
  ```

1. The registration request initially returns a state of `Registering`. You can check the current status with:

  ```azurepowershell-interactive
  Get-AzureRmProviderFeature -FeatureName ManagedResourcesMove -ProviderNamespace Microsoft.Compute
  ```

  ```azurecli-interactive
  az feature show --namespace Microsoft.Compute --name ManagedResourcesMove
  ```

1. Wait several minutes for the status to change to `Registered`.

1. After the feature is registered, register the `Microsoft.Compute` resource provider. Perform this step even if the resource provider was previously registered.

  ```azurepowershell-interactive
  Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute
  ```

  ```azurecli-interactive
  az provider register --namespace Microsoft.Compute
  ```

This support means you can also move:

* Virtual machines with the managed disks
* Managed Images
* Managed Snapshots
* Availability sets with virtual machines with managed disks

Here are the constraints that are not yet supported:

* Virtual Machines with certificate stored in Key Vault can be moved to a new resource group in the same subscription, but not across subscriptions.
* Virtual Machines configured with Azure Backup. Use the below workaround to move these Virtual Machines
  * Locate the location of your Virtual Machine.
  * Locate a resource group with the following naming pattern: `AzureBackupRG_<location of your VM>_1` for example, AzureBackupRG_westus2_1
  * If in Azure portal, then check "Show hidden types"
  * If in PowerShell, use the `Get-AzureRmResource -ResourceGroupName AzureBackupRG_<location of your VM>_1` cmdlet
  * If in CLI, use the `az resource list -g AzureBackupRG_<location of your VM>_1`
  * Now locate the resource with type `Microsoft.Compute/restorePointCollections` that has the naming pattern `AzureBackup_<name of your VM that you're trying to move>_###########`
  * Delete this resource
  * After Delete is complete, you will be able to move your Virtual Machine
* Virtual Machine Scale Sets with Standard SKU Load Balancer or Standard SKU Public IP cannot be moved
* Virtual machines created from Marketplace resources with plans attached can't be moved across resource groups or subscriptions. Deprovision the virtual machine in the current subscription, and deploy again in the new subscription.


## Virtual Networks limitations

When moving a virtual network, you must also move its dependent resources. For VPN Gateways, you must move IP addresses, virtual network gateways, and all associated connection resources. Local network gateways can be in a different resource group.

To move a peered virtual network, you must first disable the virtual network peering. Once disabled, you can move the virtual network. After the move, reenable the virtual network peering.

You can't move a virtual network to a different subscription if the virtual network contains a subnet with resource navigation links. For example, if a Redis Cache resource is deployed into a subnet, that subnet has a resource navigation link.

## App Service limitations

The limitations for moving App Service resources differ based on whether you're moving the resources within a subscription or to a new subscription.

The limitations described in these sections apply to uploaded certificates, not App Service Certificates. You can move App Service Certificates to a new resource group or subscription without limitations. If you have multiple web apps that use the same App Service Certificate, first move all the web apps, then move the certificate.

### Moving within the same subscription

When moving a Web App _within the same subscription_, you can't move the uploaded SSL certificates. However, you can move a Web App to the new resource group without moving its uploaded SSL certificate, and your app's SSL functionality still works.

If you want to move the SSL certificate with the Web App, follow these steps:

1.	Delete the uploaded certificate from the Web App.
2.	Move the Web App.
3.	Upload the certificate to the moved Web App.

### Moving across subscriptions

When moving a Web App _across subscriptions_, the following limitations apply:

- The destination resource group must not have any existing App Service resources. App Service resources include:
    - Web Apps
    - App Service plans
    - Uploaded or imported SSL certificates
    - App Service Environments
- All App Service resources in the resource group must be moved together.
- App Service resources can only be moved from the resource group in which they were originally created. If an App Service resource is no longer in its original resource group, it must be moved back to that original resource group first, and then it can be moved across subscriptions.

## Classic deployment limitations

The options for moving resources deployed through the classic model differ based on whether you're moving the resources within a subscription or to a new subscription.

### Same subscription

When moving resources from one resource group to another resource group within the same subscription, the following restrictions apply:

* Virtual networks (classic) can't be moved.
* Virtual machines (classic) must be moved with the cloud service.
* Cloud service can only be moved when the move includes all its virtual machines.
* Only one cloud service can be moved at a time.
* Only one storage account (classic) can be moved at a time.
* Storage account (classic) can't be moved in the same operation with a virtual machine or a cloud service.

To move classic resources to a new resource group within the same subscription, use the standard move operations through the [portal](#use-portal), [Azure PowerShell](#use-powershell), [Azure CLI](#use-azure-cli), or [REST API](#use-rest-api). You use the same operations as you use for moving Resource Manager resources.

### New subscription

When moving resources to a new subscription, the following restrictions apply:

* All classic resources in the subscription must be moved in the same operation.
* The target subscription must not contain any other classic resources.
* The move can only be requested through a separate REST API for classic moves. The standard Resource Manager move commands don't work when moving classic resources to a new subscription.

To move classic resources to a new subscription, use the REST operations that are specific to classic resources. To use REST, perform the following steps:

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

## Recovery Services limitations

Move isn't enabled for Storage, Network, or Compute resources used to set up disaster recovery with Azure Site Recovery.

For example, suppose you have set up replication of your on-premises machines to a storage account (Storage1) and want the protected machine to come up after failover to Azure as a virtual machine (VM1) attached to a virtual network (Network1). You can't move any of these Azure resources - Storage1, VM1, and Network1 - across resource groups within the same subscription or across subscriptions.

To move a VM enrolled in **Azure backup** between resource groups:
 1. Temporarily stop backup and retain backup data
 2. Move the VM to the target resource group
 3. Reprotect it under the same/new vault
Users can restore from the available restore points created before the move operation.
If the user moves the backed-up VM across subscriptions, step 1 and step 2 remain the same. In step 3, user needs to protect the VM under a new vault present/ created in the target subscription. Recovery Services vault doesn't support cross subscription backups.

## HDInsight limitations

You can move HDInsight clusters to a new subscription or resource group. However, you can't move across subscriptions the networking resources linked to the HDInsight cluster (such as the virtual network, NIC, or load balancer). In addition, you can't move to a new resource group a NIC that is attached to a virtual machine for the cluster.

When moving an HDInsight cluster to a new subscription, first move other resources (like the storage account). Then, move the HDInsight cluster by itself.

## Search limitations

You can't move multiple Search resources placed in different regions all at once.
In such a case, you need to move them separately.

## <a name="lb-limitations"></a> Load Balancer limitations

Basic SKU Load Balancer can be moved.
Standard SKU Load Balancer can't be moved.

## <a name="pip-limitations"></a> Public IP limitations

Basic SKU Public IP can be moved.
Standard SKU Public IP can't be moved.

## Use portal

To move resources, select the resource group containing those resources, and then select the **Move** button.

![move resources](./media/resource-group-move-resources/select-move.png)

Select whether you're moving the resources to a new resource group or a new subscription.

Select the resources to move and the destination resource group. Acknowledge that you need to update scripts for these resources and select **OK**. If you selected the edit subscription icon in the previous step, you must also select the destination subscription.

![select destination](./media/resource-group-move-resources/select-destination.png)

In **Notifications**, you see that the move operation is running.

![show move status](./media/resource-group-move-resources/show-status.png)

When it has completed, you're notified of the result.

![show move result](./media/resource-group-move-resources/show-result.png)

## Use PowerShell

To move existing resources to another resource group or subscription, use the [Move-AzureRmResource](/powershell/module/azurerm.resources/move-azurermresource) command. The following example shows how to move multiple resources to a new resource group.

```powershell
$webapp = Get-AzureRmResource -ResourceGroupName OldRG -ResourceName ExampleSite
$plan = Get-AzureRmResource -ResourceGroupName OldRG -ResourceName ExamplePlan
Move-AzureRmResource -DestinationResourceGroupName NewRG -ResourceId $webapp.ResourceId, $plan.ResourceId
```

To move to a new subscription, include a value for the `DestinationSubscriptionId` parameter.

## Use Azure CLI

To move existing resources to another resource group or subscription, use the [az resource move](/cli/azure/resource?view=azure-cli-latest#az-resource-move) command. Provide the resource IDs of the resources to move. The following example shows how to move multiple resources to a new resource group. In the `--ids` parameter, provide a space-separated list of the resource IDs to move.

```azurecli
webapp=$(az resource show -g OldRG -n ExampleSite --resource-type "Microsoft.Web/sites" --query id --output tsv)
plan=$(az resource show -g OldRG -n ExamplePlan --resource-type "Microsoft.Web/serverfarms" --query id --output tsv)
az resource move --destination-group newgroup --ids $webapp $plan
```

To move to a new subscription, provide the `--destination-subscription-id` parameter.

## Use REST API

To move existing resources to another resource group or subscription, run:

```HTTP
POST https://management.azure.com/subscriptions/{source-subscription-id}/resourcegroups/{source-resource-group-name}/moveResources?api-version={api-version}
```

In the request body, you specify the target resource group and the resources to move. For more information about the move REST operation, see [Move resources](/rest/api/resources/Resources/MoveResources).

## Next steps

* To learn about PowerShell cmdlets for managing your subscription, see [Using Azure PowerShell with Resource Manager](powershell-azure-resource-manager.md).
* To learn about Azure CLI commands for managing your subscription, see [Using the Azure CLI with Resource Manager](xplat-cli-azure-resource-manager.md).
* To learn about portal features for managing your subscription, see [Using the Azure portal to manage resources](resource-group-portal.md).
* To learn about applying a logical organization to your resources, see [Using tags to organize your resources](resource-group-using-tags.md).
