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

- **Rate limit** - A customer can have higher [ingestion rate limits](../service-limits.md#data-ingestion-volume-rate) only on dedicated cluster.
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


## Cluster pricing model

Log Analytics Dedicated Clusters use a Capacity Reservation pricing model which of at least 1000 GB/day. Any usage above the reservation level will be billed at the Pay-As-You-Go rate.  Capacity Reservation pricing information is available at the [Azure Monitor pricing page]( https://azure.microsoft.com/pricing/details/monitor/).  

The cluster capacity reservation level is configured via programmatically with Azure Resource Manager using the `Capacity` parameter under `Sku`. The `Capacity` is specified in units of GB and can have values of 1000 GB/day or more in increments of 100 GB/day.

There are two modes of billing for usage on a cluster. These can be specified by the `billingType` parameter when configuring your cluster. 

1. **Cluster**: in this case (which is the default), billing for ingested data is done at the cluster level. The ingested data quantities from each workspace associated to a cluster is aggregated to calculate the daily bill for the cluster. 

2. **Workspaces**: the Capacity Reservation costs for your Cluster are attributed proportionately to the workspaces in the Cluster (after accounting for per-node allocations from [Azure Security Center](https://docs.microsoft.com/azure/security-center/) for each workspace.)

More details are billing for Log Analytics dedicated clusters are available [here]( https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#log-analytics-dedicated-clusters).


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
New-AzOperationalInsightsCluster -ResourceGroupName {resource-group-name} -ClusterName {cluster-name} -Location {region-name} -SkuCapacity {daily-ingestion-gigabyte} -AsJob

# Check when the job is done
Get-Job -Command "New-AzOperationalInsightsCluster*" | Format-List -Property *
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

The provisioning of the Log Analytics cluster takes a while to complete. You can check the provisioning state in several ways:

- Run Get-AzOperationalInsightsCluster PowerShell command with the resource group name and check the ProvisioningState property. The value is *ProvisioningAccount* while provisioning and *Succeeded* when completed.
  ```powershell
  New-AzOperationalInsightsCluster -ResourceGroupName {resource-group-name} 
  ```

- Copy the Azure-AsyncOperation URL value from the response and follow the asynchronous operations status check.

- Send a GET request on the *Cluster* resource and look at the *provisioningState* value. The value is *ProvisioningAccount* while provisioning and *Succeeded* when completed.

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
     "capacity": <capacity-reservation-amount-in-GB>
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
Set-AzOperationalInsightsLinkedService -ResourceGroupName {resource-group-name} -WorkspaceName {workspace-name} -LinkedServiceName cluster -WriteAccessResourceId $clusterResourceId -AsJob

# Check when the job is done
Get-Job -Command "Set-AzOperationalInsightsLinkedService" | Format-List -Property *
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


You need 'write' permissions on the *Cluster* resource to perform this operation. A soft-delete operation is performed to allow the recovery of your *Cluster* resource including its data within 14 days, whether the deletion was accidental or intentional. The *Cluster* resource name remains reserved during the soft-delete period and you can't create a new cluster with that name. After the soft-delete period, the *Cluster* resource name is released, your *Cluster* resource and data are permanently deleted and are non-recoverable. Any associated workspace gets disassociated from the *Cluster* resource on delete operation. New ingested data is stored in Log Analytics storage and encrypted with Microsoft key. 

  A *Cluster* resource that was deleted in the last 14 days is in soft-delete state and can be recovered with its data. Since all workspaces got disassociated from the *Cluster* resource with *Cluster* resource deletion, you need to re-associate your workspaces after the recovery for CMK encryption. The recovery operation is performed manually by the product group currently. Use your Microsoft channel for recovery requests.


  
  The workspaces disassociated operation is asynchronous and can take up to 90 minutes to complete.

  ```powershell
  Remove-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name"
  ```

  ```rst
  DELETE https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2020-08-01
  Authorization: Bearer <token>
  ```

  **Response**

  200 OK





##################################

## CMK management

- **Get all *Cluster* resources for a resource group**
  
  ```powershell
  Get-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name"
  ```

  ```rst
  GET https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters?api-version=2020-08-01
  Authorization: Bearer <token>
  ```

  **Response**
  
  ```json
  {
    "value": [
      {
        "identity": {
          "type": "SystemAssigned",
          "tenantId": "tenant-id",
          "principalId": "principal-Id"
        },
        "sku": {
          "name": "capacityReservation",
          "capacity": 1000,
          "lastSkuUpdate": "Sun, 22 Mar 2020 15:39:29 GMT"
          },
        "properties": {
           "keyVaultProperties": {
              "keyVaultUri": "https://key-vault-name.vault.azure.net",
              "keyName": "key-name",
              "keyVersion": "current-version"
              },
          "provisioningState": "Succeeded",
          "billingType": "cluster",
          "clusterId": "cluster-id"
        },
        "id": "/subscriptions/subscription-id/resourcegroups/resource-group-name/providers/microsoft.operationalinsights/workspaces/workspace-name",
        "name": "cluster-name",
        "type": "Microsoft.OperationalInsights/clusters",
        "location": "region-name"
      }
    ]
  }
  ```

- **Get all *Cluster* resources for a subscription**
  
  ```powershell
  Get-AzOperationalInsightsCluster
  ```

  ```rst
  GET https://management.azure.com/subscriptions/<subscription-id>/providers/Microsoft.OperationalInsights/clusters?api-version=2020-08-01
  Authorization: Bearer <token>
  ```
    
  **Response**
    
  The same response as for '*Cluster* resources for a resource group', but in subscription scope.

- **Update *capacity reservation* in *Cluster* resource**

  When the data volume to your associated workspaces change over time and you want to update the capacity reservation level appropriately. Follow the [update *Cluster* resource](#update-cluster-resource-with-key-identifier-details) and provide your new capacity value. It can be in the range of 1000 to 3000 GB per day and in steps of 100. For level higher than 3000 GB per day, reach your Microsoft contact to enable it. Note that you don’t have to provide the full REST request body but should include the sku:

  ```powershell
  Update-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name" -SkuCapacity "daily-ingestion-gigabyte"
  ```

  ```rst
  PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2020-08-01
  Authorization: Bearer <token>
  Content-type: application/json

  {
    "sku": {
      "name": "capacityReservation",
      "Capacity": 1000
    }
  }
  ```

- **Update *billingType* in *Cluster* resource**

  The *billingType* property determines the billing attribution for the *Cluster* resource and its data:
  - *cluster* (default) -- The billing is attributed to the subscription hosting your Cluster resource
  - *workspaces* -- The billing is attributed to the subscriptions hosting your workspaces proportionally
  
  Follow the [update *Cluster* resource](#update-cluster-resource-with-key-identifier-details) and provide your new billingType value. Note that you don’t have to provide the full REST request body and should include the *billingType*:

  ```rst
  PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2020-08-01
  Authorization: Bearer <token>
  Content-type: application/json

  {
    "properties": {
      "billingType": "cluster",
      }  
  }
  ``` 

- **Disassociate workspace**

  You need 'write' permissions on the workspace and *Cluster* resource to perform this operation. You can disassociate a workspace from your *Cluster* resource at any time. New ingested data after the de-association operation is stored in Log Analytics storage and encrypted with Microsoft key. You can query you data that was ingested to your workspace before and after the de-association seamlessly as long as the *Cluster* resource is provisioned and configured with valid Key Vault key.

  This operation is is asynchronous and can a while to complete.

  ```powershell
  Remove-AzOperationalInsightsLinkedService -ResourceGroupName "resource-group-name" -Name "workspace-name" -LinkedServiceName cluster
  ```

  ```rest
  DELETE https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>/linkedservices/cluster?api-version=2020-08-01
  Authorization: Bearer <token>
  ```

  **Response**

  200 OK and header.

  Ingested data after the disassociation operation is stored in Log Analytics storage, this can take 90 minutes to complete. You can check the workspace de-association state in two ways:

  1. Copy the Azure-AsyncOperation URL value from the response and follow the [asynchronous operations status check](#asynchronous-operations-and-status-check).
  2. Send a [Workspaces – Get](/rest/api/loganalytics/workspaces/get) request and observe the response, disassociated workspace won't have the *clusterResourceId* under *features*.

- **Check workspace association status**
  
  Perform Get operation on the workspace and observe if *clusterResourceId* property is present in the response under *features*. Associated workspace will have the *clusterResourceId* property.

  ```powershell
  Get-AzOperationalInsightsWorkspace -ResourceGroupName "resource-group-name" -Name "workspace-name"
  ```
## Troubleshooting

- Behavior with Key Vault availability
  - In normal operation -- Storage caches AEK for short periods of time and goes back to Key Vault to unwrap periodically.
    
  - Transient connection errors -- Storage handles transient errors (timeouts, connection failures, DNS issues) by allowing keys to stay in cache for a short while longer and this overcomes any small blips in availability. The query and ingestion capabilities continue without interruption.
    
  - Live site -- unavailability of about 30 minutes will cause the Storage account to become unavailable. The query capability is unavailable and ingested data is cached for several hours using Microsoft key to avoid data loss. When access to Key Vault is restored, query becomes available and the temporary cached data is ingested to the data-store and encrypted with CMK.

  - Key Vault access rate -- The frequency that Azure Monitor Storage accesses Key Vault for wrap and unwrap operations is between 6 to 60 seconds.

- If you create a *Cluster* resource and specify the KeyVaultProperties immediately, the operation may fail since the
    access policy can't be defined until system identity is assigned to the *Cluster* resource.

- If you update existing *Cluster* resource with KeyVaultProperties and 'Get' key Access Policy is missing in Key Vault, the operation will fail.

- If you get conflict error when creating a *Cluster* resource – It may be that you have deleted your *Cluster* resource in the last 14 days and it’s in a soft-delete period. The *Cluster* resource name remains reserved during the soft-delete period and you can't create a new cluster with that name. The name is released after the soft-delete period when the *Cluster* resource is permanently deleted.

- If you update your *Cluster* resource while an operation is in progress, the operation will fail.

- If you fail to deploy your *Cluster* resource, verify that your Azure Key Vault, *Cluster* resource and associated Log Analytics workspaces are in the same region. The can be in different subscriptions.

- If you update your key version in Key Vault and don't update the new key identifier details in the *Cluster* resource, the Log Analytics cluster will keep using your previous key and your data will become inaccessible. Update new key identifier details in the *Cluster* resource to resume data ingestion and ability to query data.

- Some operations are long and can take a while to complete -- these are *Cluster* create, *Cluster* key update and *Cluster* delete. You can check the operation status in two ways:
  1. when using REST, copy the Azure-AsyncOperation URL value from the response and follow the [asynchronous operations status check](#asynchronous-operations-and-status-check).
  2. Send GET request to *Cluster* or workspace and observe the response. For example, disassociated workspace won't have the *clusterResourceId* under *features*.

- For support and help related to customer managed key, use your contacts into Microsoft.

- Error messages
  
  *Cluster* resource Create:
  -  400 -- Cluster name is not valid. Cluster name can contain characters a-z, A-Z, 0-9 and length of 3-63.
  -  400 -- The body of the request is null or in bad format.
  -  400 -- SKU name is invalid. Set SKU name to capacityReservation.
  -  400 -- Capacity was provided but SKU is not capacityReservation. Set SKU name to capacityReservation.
  -  400 -- Missing Capacity in SKU. Set Capacity value to 1000 or higher in steps of 100 (GB).
  -  400 -- Capacity in SKU is not in range. Should be minimum 1000 and up to the max allowed capacity which is available under ‘Usage and estimated cost’ in your workspace.
  -  400 -- Capacity is locked for 30 days. Decreasing capacity is permitted 30 days after update.
  -  400 -- No SKU was set. Set the SKU name to capacityReservation and Capacity value to 1000 or higher in steps of 100 (GB).
  -  400 -- Identity is null or empty. Set Identity with systemAssigned type.
  -  400 -- KeyVaultProperties are set on creation. Update KeyVaultProperties after cluster creation.
  -  400 -- Operation cannot be executed now. Async operation is in a state other than succeeded. Cluster must complete its operation before any update operation is performed.

  *Cluster* resource Update
  -  400 -- Cluster is in deleting state. Async operation is in progress . Cluster must complete its operation before any update operation is performed.
  -  400 -- KeyVaultProperties is not empty but has a bad format. See [key identifier update](#update-cluster-resource-with-key-identifier-details).
  -  400 -- Failed to validate key in Key Vault. Could be due to lack of permissions or when key doesn’t exist. Verify that you [set key and access policy](#grant-key-vault-permissions) in Key Vault.
  -  400 -- Key is not recoverable. Key Vault must be set to Soft-delete and Purge-protection. See [Key Vault documentation](../../key-vault/general/soft-delete-overview.md)
  -  400 -- Operation cannot be executed now. Wait for the Async operation to complete and try again.
  -  400 -- Cluster is in deleting state. Wait for the Async operation to complete and try again.

    *Cluster* resource Get:
    -  404 -- Cluster not found, the cluster may have been deleted. If you try to create a cluster with that name and get conflict, the cluster is in soft-delete for 14 days. You can contact support to recover it, or use another name to create a new cluster. 

  *Cluster* resource Delete
    -  409 -- Can't delete a cluster while in provisioning state. Wait for the Async operation to complete and try again.

  Workspace association:
  -  404 -- Workspace not found. The workspace you specified doesn’t exist or was deleted.
  -  409 -- Workspace association or disassociation operation in process.
  -  400 -- Cluster not found, the cluster you specified doesn’t exist or was deleted. If you try to create a cluster with that name and get conflict, the cluster is in soft-delete for 14 days. You can contact support to recover it.

  Workspace disassociation:
  -  404 -- Workspace not found. The workspace you specified doesn’t exist or was deleted.
  -  409 -- Workspace association or disassociation operation in process.

###########################################################



## Next steps

- Learn about [Log Analytics dedicated cluster billing](../platform/manage-cost-storage.md#log-analytics-dedicated-clusters)
- Learn about [proper design of Log Analytics workspaces](../platform/design-logs-deployment.md)
