---
title: Azure Monitor Logs Dedicated Clusters
description: Customers who ingest more than 1 TB a day of monitoring data may use dedicated rather than shared clusters
ms.subservice: logs
ms.topic: conceptual
author: rboucher
ms.author: robb
ms.date: 09/16/2020
---

# Azure Monitor Logs Dedicated Clusters

Azure Monitor Logs Dedicated Clusters are a deployment option that is available to better serve high-volume customers. Customers that ingest more than 4 TB of data per day will use dedicated clusters. Customers with dedicated clusters can choose the workspaces to be hosted on these clusters.

Other than the support for high volume, there are other benefits of using dedicated clusters:

- **Rate limit** - A customer can have higher ingestion rate limits only on dedicated cluster.
- **Features** - Certain enterprise features are only available on dedicated clusters - specifically customer-managed keys (CMK) and LockBox support. 
- **Consistency** - Customers have their own dedicated resources and so there is no influence from other customers running on the same shared infrastructure.
- **Cost efficiency** - It might be more cost effective to use dedicated cluster as the assigned capacity reservation tiers take into account all cluster ingestion and applies to all its workspaces, even if some of them are small and not eligible for capacity reservation discount.
- **Cross-workspace** queries run faster if all workspaces are on the same cluster.

Dedicated clusters require customers to commit using a capacity of at least 1 TB of data ingestion per day. Migration to a dedicated cluster is simple. There is no data loss or service interruption. 

> [!IMPORTANT]
> Dedicated clusters are approved and fully supported for production deployments. However, due to temporary capacity constraints, we require your pre-register to use the feature. Use your contacts into Microsoft to provide your Subscriptions IDs.

## Management 

Dedicated clusters are managed via an Azure resource that represents Azure Monitor Log clusters. All operations are done on this resource using PowerShell or the REST API.

Once the cluster is created, it can be configured and workspaces linked to it. When a workspace is linked to a cluster, new data sent to the workspace resides on the cluster. Only workspaces that are in the same region as the cluster can be linked to the cluster. Workspaces can be unliked from a cluster with some limitations. More detail on these limitations is included in this article. 

All operations on the cluster level require the `Microsoft.OperationalInsights/clusters/write` action permission on the cluster. This permission could be granted via the Owner or Contributor that contains the `*/write` action or via the Log Analytics Contributor role that contains the `Microsoft.OperationalInsights/*` action. For more information on Log Analytics permissions, see [Manage access to log data and workspaces in Azure Monitor](../platform/manage-access.md). 

## Billing

Dedicated clusters are supported only for workspaces that use per-GB plans with or without capacity reservation tiers. Dedicated clusters have no additional charge for customers that commit to ingest more than 1 TB for such cluster. "Commit to ingest" means they have assigned a capacity reservation tier of at least 1 TB/day on the cluster level. 
While the capacity reservation is attached at the cluster level, there are two options for the actual charging for the data:

- *Cluster* (default) - The capacity reservation costs for your cluster are attributed to the *cluster* resource.
- *Workspaces* - The capacity reservation costs for your cluster are attributed proportionately to the workspaces in the cluster. The *cluster* resource is billed some of the usage if the total ingested data for the day is under the capacity reservation. See [Log Analytics Dedicated Clusters](../platform/manage-cost-storage.md#log-analytics-dedicated-clusters) to learn more about the Cluster pricing model.

For more information on dedicated clusters billing, see [Log Analytics Dedicated Cluster Billing](../platform/manage-cost-storage.md#log-analytics-dedicated-clusters).

## Creating a cluster

You first create cluster resources to begin creating a dedicated cluster.

The following properties must be specified:

- **ClusterName**: Used for administrative purposes. Users are not exposed to this name.
- **ResourceGroupName**: As for any Azure resource, clusters belong to a resource group. We  recommended you use a central IT resource group because clusters are usually shared by many teams in the organization. For more design considerations, review [Designing your Azure Monitor Logs deployment](../platform/design-logs-deployment.md)
- **Location**: A cluster is located in a specific Azure region. Only workspaces located in this region can be linked to this cluster.
- **SkuCapacity**: You must specify the *capacity reservation* level (sku) when creating a *cluster* resource. The *capacity reservation* level can be in the range of 1,000 GB to 3,000 GB per day. You can update it in steps of 100 later if needed. If you need capacity reservation level higher than 3,000 GB per day, contact us at LAIngestionRate@microsoft.com. For more information on cluster costs, see [Manage Costs for Log Analytics clusters](../platform/manage-cost-storage.md#log-analytics-dedicated-clusters)

After you create your *Cluster* resource, you can edit additional properties such as *sku*, *keyVaultProperties, or *billingType*. See more details below.

> [!WARNING]
> Cluster creation triggers resource allocation and provisioning. This operation can take up to an hour to complete. It is recommended to run it asynchronously.

The user account that creates the clusters must have the standard Azure resource creation permission: `Microsoft.Resources/deployments/*` and cluster write permission `(Microsoft.OperationalInsights/clusters/write)`.

### Create 

**PowerShell**

```powershell
invoke-command -scriptblock { New-AzOperationalInsightsCluster -ResourceGroupName {resource-group-name} -ClusterName {cluster-name} -Location {region-name} -SkuCapacity {daily-ingestion-gigabyte} } -asjob

# Check when the job is done
Get-Job

```

**REST**

*Call* 
```rst
PUT https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2020-03-01-preview
Authorization: Bearer <token>
Content-type: application/json

{
  "identity": {
    "type": "systemAssigned"
    },
  "sku": {
    "name": "capacityReservation",
    "Capacity": 1000
    },
  "properties": {
    "billingType": "cluster",
    },
  "location": "<region-name>",
}
```

*Response*

Should be 200 OK and a header.

### Check provisioning status

The provisioning of the Log Analytics cluster takes a while to complete. You can check the provisioning state in two ways:

1. Copy the Azure-AsyncOperation URL value from the response and follow the asynchronous operations status check.

   OR

1. Send a GET request on the *Cluster* resource and look at the *provisioningState* value. The value is *ProvisioningAccount* while provisioning and *Succeeded* when completed.

   ```rst
   GET https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2020-03-01-preview
   Authorization: Bearer <token>
   ```

   **Response**

   ```json
   {
     "identity": {
       "type": "SystemAssigned",
       "tenantId": "tenant-id",
       "principalId": "principal-id"
       },
     "sku": {
       "name": "capacityReservation",
       "capacity": 1000,
       "lastSkuUpdate": "Sun, 22 Mar 2020 15:39:29 GMT"
       },
     "properties": {
       "provisioningState": "ProvisioningAccount",
       "billingType": "cluster",
       "clusterId": "cluster-id"
       },
     "id": "/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.OperationalInsights/clusters/cluster-name",
     "name": "cluster-name",
     "type": "Microsoft.OperationalInsights/clusters",
     "location": "region-name"
   }
   ```

The *principalId* GUID is generated by the managed identity service for the *Cluster* resource.

## Change cluster properties

After you create your *Cluster* resource and it is fully provisioned, you can edit additional properties at the cluster level using PowerShell or REST API. Other than the properties that are available during cluster creation, additional properties can only be set after the cluster has been provisioned:

- **keyVaultProperties**: Used to configure the Azure Key Vault used to provision an [Azure Monitor customer-managed key](../platform/customer-managed-keys.md#cmk-provisioning-procedure). It contains the following parameters:  *KeyVaultUri*, *KeyName*, *KeyVersion*. 
- **billingType** - The *billingType* property determines the billing attribution for the *cluster* resource and its data:
- **Cluster** (default) - The Capacity Reservation costs for your Cluster are attributed to the *Cluster* resource.
- **Workspaces** - The Capacity Reservation costs for your Cluster are attributed proportionately to the workspaces in the Cluster, with the *Cluster* resource being billed some of the usage if the total ingested data for the day is under the Capacity Reservation. See [Log Analytics Dedicated Clusters](../platform/manage-cost-storage.md#log-analytics-dedicated-clusters) to learn more about the Cluster pricing model. 

> [!NOTE]
> The *billingType* property is not supported in PowerShell.
> Cluster property updates might be executed asynchronous and can take a while to complete.

**PowerShell**

```powershell
Update-AzOperationalInsightsCluster -ResourceGroupName {resource-group-name} -ClusterName {cluster-name} -KeyVaultUri {key-uri} -KeyName {key-name} -KeyVersion {key-version}
```

**REST**

> [!NOTE]
> You can update the *Cluster* resource *sku*, *keyVaultProperties* or *billingType* using PATCH.

For example: 

*Call*

```rst
PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2020-03-01-preview
Authorization: Bearer <token>
Content-type: application/json

{
   "sku": {
     "name": "capacityReservation",
     "capacity": 1000
     },
   "properties": {
    "billingType": "cluster",
     "KeyVaultProperties": {
       "KeyVaultUri": "https://<key-vault-name>.vault.azure.net",
       "KeyName": "<key-name>",
       "KeyVersion": "<current-version>"
       }
   },
   "location":"<region-name>"
}
```

"KeyVaultProperties" contains the Key Vault key identifier details.

*Response*

200 OK and header

### Check cluster update status

The propagation of the Key identifier takes a few minutes to complete. You can check the update state in two ways:

- Copy the Azure-AsyncOperation URL value from the response and follow the asynchronous operations status check. 

   OR

- Send a GET request on the *Cluster* resource and look at the *KeyVaultProperties* properties. Your recently updated Key identifier details should return in the response.

   A response to GET request on the *Cluster* resource should look like this when Key identifier update is complete:

   ```json
   {
     "identity": {
       "type": "SystemAssigned",
       "tenantId": "tenant-id",
       "principalId": "principle-id"
       },
     "sku": {
       "name": "capacityReservation",
       "capacity": 1000,
       "lastSkuUpdate": "Sun, 22 Mar 2020 15:39:29 GMT"
       },
     "properties": {
       "keyVaultProperties": {
         "keyVaultUri": "https://key-vault-name.vault.azure.net",
         "kyName": "key-name",
         "keyVersion": "current-version"
         },
        "provisioningState": "Succeeded",
       "billingType": "cluster",
       "clusterId": "cluster-id"
     },
     "id": "/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.OperationalInsights/clusters/cluster-name",
     "name": "cluster-name",
     "type": "Microsoft.OperationalInsights/clusters",
     "location": "region-name"
  }
  ```

## Link a workspace to the cluster

When a workspace is linked to a dedicated cluster, new data that is ingested into the workspace is routed to the new cluster while existing data remains on the existing cluster. If the dedicated cluster is encrypted using customer-managed keys (CMK), only new data is encrypted with the key. The system is abstracting this difference from the users and the users just query the workspace as usual while the system performs cross-cluster queries on the backend.

A cluster can be linked to up to 100 workspaces. Linked workspaces are located in the same region as the cluster. To protect the system backend and avoid fragmentation of data, a workspace can’t be linked to a cluster more than twice a month.

To perform the link operation, you need to have 'write' permissions to both the workspace and the *cluster* resource:

- In the workspace: *Microsoft.OperationalInsights/workspaces/write*
- In the *cluster* resource: *Microsoft.OperationalInsights/clusters/write*

Other than the billing aspects, the linked workspace keeps its own settings such as the length of data retention.
The workspace and the cluster can be in different subscriptions. It's possible for the workspace and cluster to be in different tenants if Azure Lighthouse is used to map both of them to a single tenant.

As any cluster operation, linking a workspace can be performed only after the completion of the Log Analytics cluster provisioning.

> [!WARNING]
> Linking a workspace to a cluster requires syncing multiple backend components and assuring cache hydration. This operation may take up to two hours to complete. We recommended you run it asynchronously.


### Link operations

**PowerShell**

Use the following PowerShell command to link to a cluster:

```powershell
# Find cluster resource ID
$clusterResourceId = (Get-AzOperationalInsightsCluster -ResourceGroupName {resource-group-name} -ClusterName {cluster-name}).id

# Link the workspace to the cluster
invoke-command -scriptblock { Set-AzOperationalInsightsLinkedService -ResourceGroupName {resource-group-name} -WorkspaceName {workspace-name} -LinkedServiceName cluster -WriteAccessResourceId $clusterResourceId } -asjob

# Check when the job is done
Get-Job
```


**REST**

Use the following REST call to link to a cluster:

*Send*

```rst
PUT https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>/linkedservices/cluster?api-version=2020-03-01-preview 
Authorization: Bearer <token>
Content-type: application/json

{
  "properties": {
    "WriteAccessResourceId": "/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/clusters/<cluster-name>"
    }
}
```

*Response*

200 OK and header.

### Using customer-managed keys with linking

If you use customer-managed keys, ingested data is stored encrypted with your managed key after the association operation, which can take up to 90 minutes to complete. 

You can check the workspace association state in two ways:

- Copy the Azure-AsyncOperation URL value from the response and follow the asynchronous operations status check.

- Send a [Workspaces – Get](https://docs.microsoft.com/rest/api/loganalytics/workspaces/get) request and observe the response. The associated workspace has a clusterResourceId under "features".

A send request looks like the following:

*Send*

```rest
GET https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalInsights/workspaces/<workspace-name>?api-version=2020-03-01-preview
Authorization: Bearer <token>
```

*Response*

```json
{
  "properties": {
    "source": "Azure",
    "customerId": "workspace-name",
    "provisioningState": "Succeeded",
    "sku": {
      "name": "pricing-tier-name",
      "lastSkuUpdate": "Tue, 28 Jan 2020 12:26:30 GMT"
    },
    "retentionInDays": 31,
    "features": {
      "legacy": 0,
      "searchVersion": 1,
      "enableLogAccessUsingOnlyResourcePermissions": true,
      "clusterResourceId": "/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.OperationalInsights/clusters/cluster-name"
    },
    "workspaceCapping": {
      "dailyQuotaGb": -1.0,
      "quotaNextResetTime": "Tue, 28 Jan 2020 14:00:00 GMT",
      "dataIngestionStatus": "RespectQuota"
    }
  },
  "id": "/subscriptions/subscription-id/resourcegroups/resource-group-name/providers/microsoft.operationalinsights/workspaces/workspace-name",
  "name": "workspace-name",
  "type": "Microsoft.OperationalInsights/workspaces",
  "location": "region-name"
}
```

## Unlink a workspace from a dedicated cluster

You can unlink a workspace from a cluster. After unlinking a workspace from the cluster, new data associated with this workspace is not sent to the dedicated cluster. Also, the workspace billing is no longer done via the cluster. 
Old data of the unlinked workspace might be left on the cluster. If this data is encrypted using customer-managed keys (CMK), the Key Vault secrets are kept. The system is abstracts this change from Log Analytics users. Users can just query the workspace as usual. The system performs cross-cluster queries on the backend as needed with no indication to users.  

> [!WARNING] 
> There is a limit of two linking operations per workspace within a month. Take time to consider and plan unlinking actions accordingly. 

## Delete a dedicated cluster

A dedicated cluster resource can be deleted. You must unlink all workspaces from the cluster before deleting it. Once the cluster resource is deleted, the physical cluster enters a purge and deletion process. Deletion of a cluster deletes all the data that was stored on the cluster. The data could be from workspaces that were linked to the cluster in the past.

## Next steps

- Learn about [Log Analytics dedicated cluster billing](../platform/manage-cost-storage.md#log-analytics-dedicated-clusters)
- Learn about [proper design of Log Analytics workspaces](../platform/design-logs-deployment.md)
