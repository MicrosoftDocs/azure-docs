---
title: Azure Monitor Logs Dedicated Clusters
description: Customers meeting the minimum commitment tier could use dedicated clusters
ms.topic: conceptual
author: yossi-y
ms.author: yossiy
ms.date: 07/29/2021
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Azure Monitor Logs Dedicated Clusters

Azure Monitor Logs Dedicated Clusters are a deployment option that enables advanced capabilities for Azure Monitor Logs customers. Customers can select which of their Log Analytics workspaces should be hosted on dedicated clusters.

Dedicated clusters require customers to commit for at least 500 GB of data ingestion per day. You can migrate an existing workspace to a dedicated cluster with no data loss or service interruption. 

Capabilities that require dedicated clusters:

- **[Customer-managed Keys](../logs/customer-managed-keys.md)** - Encrypt the cluster data using keys that are provided and controlled by the customer.
- **[Lockbox](../logs/customer-managed-keys.md#customer-lockbox-preview)** - Control Microsoft support engineers access requests to your data.
- **[Double encryption](../../storage/common/storage-service-encryption.md#doubly-encrypt-data-with-infrastructure-encryption)** - Protects against a scenario where one of the encryption algorithms or keys may be compromised. In this case, the additional layer of encryption continues to protect your data.
- **[Availability Zones](../../availability-zones/az-overview.md)** - Protect your data from datacenter failures with zones being separated physically by locations and equipped with independent power, cooling, and networking. The physical separation in zones and independent infrastructure makes an incident far less likely since the workspace can rely on the resources from any of the zones. Dedicated clusters are created with availability zones enabled for data resiliency in regions that [Azure has availability zones](../../availability-zones/az-overview.md#azure-regions-with-availability-zones). Availability zones configuration in cluster can’t be altered once created and settings can be verified in cluster’s property `isAvailabilityZonesEnabled`. [Azure Monitor availability zones](./availability-zones.md) covers broader parts of the service and when available in your region, extends your Azure Monitor resiliency automatically.
- **[Multi-workspace](../logs/cross-workspace-query.md)** - If a customer is using more than one workspace for production it might make sense to use dedicated cluster. Cross-workspace queries will run faster if all workspaces are on the same cluster. It might also be more cost effective to use dedicated cluster as the assigned commitment tier takes into account all cluster ingestion and applies to all its workspaces, even if some of them are small and not eligible for commitment tier discount.


## Management 

Dedicated clusters are managed with an Azure resource that represents Azure Monitor Log clusters. Operations are performed programmatically using [CLI](/cli/azure/monitor/log-analytics/cluster), [PowerShell](/powershell/module/az.operationalinsights) or the [REST](/rest/api/loganalytics/clusters).

Once a cluster is created, workspaces can be linked to it and new ingested data to them is stored on the cluster. Workspaces can be unlinked from a cluster at any time and new data is stored in shared Log Analytics clusters. The link and unlink operation doesn't affect your queries and the access to data before and after the operation with subjection to retention in workspaces. The Cluster and workspaces must be in the same region to allow linking.

All operations on the cluster level require the `Microsoft.OperationalInsights/clusters/write` action permission on the cluster. This permission could be granted via the Owner or Contributor that contains the `*/write` action or via the Log Analytics Contributor role that contains the `Microsoft.OperationalInsights/*` action. For more information on Log Analytics permissions, see [Manage access to log data and workspaces in Azure Monitor](./manage-access.md). 


## Cluster pricing model

Log Analytics Dedicated Clusters use a Commitment Tier (formerly called capacity reservations) pricing model of at least 500 GB/day. Any usage above the tier level will be billed at effective per-GB rate of that Commitment Tier. Commitment Tier pricing information is available at the [Azure Monitor pricing page]( https://azure.microsoft.com/pricing/details/monitor/).  

The cluster Commitment Tier level is configured programmatically with Azure Resource Manager using the `Capacity` parameter under `Sku`. The `Capacity` is specified in units of GB and can have values of 500, 1000, 2000 or 5000 GB/day.

There are two modes of billing for usage on a cluster. These can be specified by the `billingType` parameter when configuring your cluster. 

1. **Cluster (default)**: Billing for ingested data is done at the cluster level. The ingested data quantities from each workspace associated to a cluster are aggregated to calculate the daily bill for the cluster. 

2. **Workspaces**: The Commitment Tier costs for your Cluster are attributed proportionately to the workspaces in the cluster, by each workspace's data ingestion volume (after accounting for per-node allocations from [Microsoft Defender for Cloud](../../security-center/index.yml) for each workspace.) This full details of this pricing model are explained [here](./manage-cost-storage.md#log-analytics-dedicated-clusters). 

If your workspace is using legacy Per Node pricing tier, when it is linked to a cluster it will be billed based on data ingested against the cluster's Commitment Tier, and no longer Per Node. Per-node data allocations from Microsoft Defender for Cloud will continue to be applied.

Complete details are billing for Log Analytics dedicated clusters are available [here](./manage-cost-storage.md#log-analytics-dedicated-clusters).

## Create a dedicated cluster

You must specify the following properties when you create a new dedicated cluster:

- **ClusterName**
- **ResourceGroupName**: You should use a central IT resource group because clusters are usually shared by many teams in the organization. For more design considerations, review [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md).
- **Location**
- **SkuCapacity**: The Commitment Tier (formerly called capacity reservations) can be set to 500, 1000, 2000 or 5000 GB/day. For more information on cluster costs, see [Manage Costs for Log Analytics clusters](./manage-cost-storage.md#log-analytics-dedicated-clusters). 

The user account that creates the clusters must have the standard Azure resource creation permission: `Microsoft.Resources/deployments/*` and cluster write permission `Microsoft.OperationalInsights/clusters/write` by having in their role assignments this specific action or `Microsoft.OperationalInsights/*` or `*/write`.

After you create your cluster resource, you can edit additional properties such as *sku*, *keyVaultProperties, or *billingType*. See more details below.

You can have up to 2 active clusters per subscription per region. If the cluster is deleted, it is still reserved for 14 days. You can have up to 4 reserved clusters per subscription per region (active or recently deleted).

> [!NOTE]
> Cluster creation triggers resource allocation and provisioning. This operation can take a few hours to complete.
> Dedicated cluster is billed once provisioned regardless data ingestion and it's recommended to prepare the deployment to expedite the provisioning and workspaces link to cluster. Verify the following:
> - A list of initial workspace to be linked to cluster is identified
> - You have permissions to subscription intended for the cluster and any workspace to be linked

**CLI**
```azurecli
az account set --subscription "cluster-subscription-id"

az monitor log-analytics cluster create --no-wait --resource-group "resource-group-name" --name "cluster-name" --location "region-name" --sku-capacity "daily-ingestion-gigabyte"

# Wait for job completion when `--no-wait` was used
$clusterResourceId = az monitor log-analytics cluster list --resource-group "resource-group-name" --query "[?contains(name, "cluster-name")].[id]" --output tsv
az resource wait --created --ids $clusterResourceId --include-response-body true
```

**PowerShell**

```powershell
Select-AzSubscription "cluster-subscription-id"

New-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name" -Location "region-name" -SkuCapacity "daily-ingestion-gigabyte" -AsJob

# Check when the job is done when `-AsJob` was used
Get-Job -Command "New-AzOperationalInsightsCluster*" | Format-List -Property *
```

**REST API**

*Call* 

```rest
PUT https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2021-06-01
Authorization: Bearer <token>
Content-type: application/json

{
  "identity": {
    "type": "systemAssigned"
    },
  "sku": {
    "name": "capacityReservation",
    "Capacity": 500
    },
  "properties": {
    "billingType": "Cluster",
    },
  "location": "<region>",
}
```

*Response*

Should be 202 (Accepted) and a header.

### Check cluster provisioning status

The provisioning of the Log Analytics cluster takes a while to complete. Use one of the following methods to check the *ProvisioningState* property. The value is *ProvisioningAccount* while provisioning and *Succeeded* when completed.

**CLI**

```azurecli
az account set --subscription "cluster-subscription-id"

az monitor log-analytics cluster show --resource-group "resource-group-name" --name "cluster-name"
```

**PowerShell**

```powershell
Select-AzSubscription "cluster-subscription-id"

Get-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name"
```
 
**REST API**

Send a GET request on the cluster resource and look at the *provisioningState* value. The value is *ProvisioningAccount* while provisioning and *Succeeded* when completed.

  ```rest
  GET https://management.azure.com/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.OperationalInsights/clusters/cluster-name?api-version=2021-06-01
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
      "name": "capacityreservation",
      "capacity": 500
    },
    "properties": {
      "provisioningState": "ProvisioningAccount",
      "clusterId": "cluster-id",
      "billingType": "Cluster",
      "lastModifiedDate": "last-modified-date",
      "createdDate": "created-date",
      "isDoubleEncryptionEnabled": false,
      "isAvailabilityZonesEnabled": false,
      "capacityReservationProperties": {
        "lastSkuUpdate": "last-sku-modified-date",
        "minCapacity": 500
      }
    },
    "id": "/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.OperationalInsights/clusters/cluster-name",
    "name": "cluster-name",
    "type": "Microsoft.OperationalInsights/clusters",
    "location": "cluster-region"
  }
  ```

The *principalId* GUID is generated by the managed identity service at cluster creation.

---


## Link a workspace to a cluster

When a Log Analytics workspace is linked to a dedicated cluster, new data ingested to the workspace is routed to the new cluster while existing data remains on the existing cluster. If the dedicated cluster is encrypted using customer-managed keys (CMK), only new data is encrypted with the key. The system abstracts this difference, so you can query the workspace as usual while the system performs cross-cluster queries in the background.

A cluster can be linked to up to 1,000 workspaces. Linked workspaces are located in the same region as the cluster. To protect the system backend and avoid fragmentation of data, a workspace can't be linked to a cluster more than twice a month.

To perform the link operation, you need to have 'write' permissions to both the workspace and the cluster resource:

- In the workspace: *Microsoft.OperationalInsights/workspaces/write*
- In the cluster resource: *Microsoft.OperationalInsights/clusters/write*

Other than the billing aspects, the linked workspace keeps its own settings such as the length of data retention.

The workspace and the cluster can be in different subscriptions. It's possible for the workspace and cluster to be in different tenants if Azure Lighthouse is used to map both of them to a single tenant.

Linking a workspace can be performed only after the completion of the Log Analytics cluster provisioning.

> [!WARNING]
> Linking a workspace to a cluster requires syncing multiple backend components and assuring cache hydration. Since this operation may take up to two hours to complete, you should you run it asynchronously.

Use the following commands to link a workspace to a cluster:

**CLI**
```azurecli
# Find cluster resource ID
az account set --subscription "cluster-subscription-id"
$clusterResourceId = az monitor log-analytics cluster list --resource-group "resource-group-name" --query "[?contains(name, "cluster-name")].[id]" --output tsv

# Link workspace
az account set --subscription "workspace-subscription-id"
az monitor log-analytics workspace linked-service create --no-wait --name cluster --resource-group "resource-group-name" --workspace-name "workspace-name" --write-access-resource-id $clusterResourceId

# Wait for job completion when `--no-wait` was used
$workspaceResourceId = az monitor log-analytics workspace list --resource-group "resource-group-name" --query "[?contains(name, "workspace-name")].[id]" --output tsv
az resource wait --deleted --ids $workspaceResourceId --include-response-body true
```

**PowerShell**

```powershell
Select-AzSubscription "cluster-subscription-id"

# Find cluster resource ID
$clusterResourceId = (Get-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name").id

Select-AzSubscription "workspace-subscription-id"

# Link the workspace to the cluster
Set-AzOperationalInsightsLinkedService -ResourceGroupName "resource-group-name" -WorkspaceName "workspace-name" -LinkedServiceName cluster -WriteAccessResourceId $clusterResourceId -AsJob

# Check when the job is done
Get-Job -Command "Set-AzOperationalInsightsLinkedService" | Format-List -Property *
```

**REST API**

Use the following REST call to link to a cluster:

*Send*

```rest
PUT https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>/linkedservices/cluster?api-version=2021-06-01 
Authorization: Bearer <token>
Content-type: application/json

{
  "properties": {
    "WriteAccessResourceId": "/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/clusters/<cluster-name>"
    }
}
```

*Response*

202 (Accepted) and header.

---

### Check workspace link status
  
When a cluster is configured with customer-managed keys, data ingested to the workspaces after the link operation completion is stored encrypted with your managed key. The workspace link operation can take up to 90 minutes to complete and you can check the state by sending Get request to workspace and observe if *clusterResourceId* property is present in the response under *features*.

**CLI**
```azurecli
az account set --subscription "workspace-subscription-id"

az monitor log-analytics workspace show --resource-group "resource-group-name" --workspace-name "workspace-name"
```

**PowerShell**

```powershell
Select-AzSubscription "workspace-subscription-id"

Get-AzOperationalInsightsWorkspace -ResourceGroupName "resource-group-name" -Name "workspace-name"
```

**REST API**

*Call*

```rest
GET https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>?api-version=2021-06-01
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
  "location": "region"
}
```

---


## Change cluster properties

After you create your cluster resource and it is fully provisioned, you can edit additional properties using CLI, PowerShell or REST API. The additional properties that can be set after the cluster has been provisioned include the following:

- **keyVaultProperties** - Contains the key in Azure Key Vault with the following parameters: *KeyVaultUri*, *KeyName*, *KeyVersion*. See [Update cluster with Key identifier details](../logs/customer-managed-keys.md#update-cluster-with-key-identifier-details).
- **Identity** - The identity used to authenticate to your Key Vault. This can be System-assigned or User-assigned.
- **billingType** - Billing attribution for the cluster resource and its data. Includes on the following values:
  - **Cluster (default)** - The costs for your cluster are attributed to the cluster resource.
  - **Workspaces** - The costs for your cluster are attributed proportionately to the workspaces in the Cluster, with the cluster resource being billed some of the usage if the total ingested data for the day is under the commitment tier. See [Log Analytics Dedicated Clusters](./manage-cost-storage.md#log-analytics-dedicated-clusters) to learn more about the cluster pricing model.


>[!IMPORTANT]
>Cluster update should not include both identity and key identifier details in the same operation. If you need to update both, the update should be in two consecutive operations.

> [!NOTE]
> The *billingType* property is not supported in CLI.

## Get all clusters in resource group

**CLI**

```azurecli
az account set --subscription "cluster-subscription-id"

az monitor log-analytics cluster list --resource-group "resource-group-name"
```

**PowerShell**

```powershell
Select-AzSubscription "cluster-subscription-id"

Get-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name"
```

**REST API**

*Call*

```rest
GET https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters?api-version=2021-06-01
Authorization: Bearer <token>
```

*Response*
  
```json
{
  "value": [
    {
      "identity": {
        "type": "SystemAssigned",
        "tenantId": "tenant-id",
        "principalId": "principal-id"
      },
      "sku": {
        "name": "capacityreservation",
        "capacity": 500
      },
      "properties": {
        "provisioningState": "Succeeded",
        "clusterId": "cluster-id",
        "billingType": "Cluster",
        "lastModifiedDate": "last-modified-date",
        "createdDate": "created-date",
        "isDoubleEncryptionEnabled": false,
        "isAvailabilityZonesEnabled": false,
        "capacityReservationProperties": {
          "lastSkuUpdate": "last-sku-modified-date",
          "minCapacity": 500
        }
      },
      "id": "/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.OperationalInsights/clusters/cluster-name",
      "name": "cluster-name",
      "type": "Microsoft.OperationalInsights/clusters",
      "location": "cluster-region"
    }
  ]
}
```

---



## Get all clusters in subscription

**CLI**

```azurecli
az account set --subscription "cluster-subscription-id"

az monitor log-analytics cluster list
```

**PowerShell**

```powershell
Select-AzSubscription "cluster-subscription-id"

Get-AzOperationalInsightsCluster
```
**REST API**

*Call*

```rest
GET https://management.azure.com/subscriptions/<subscription-id>/providers/Microsoft.OperationalInsights/clusters?api-version=2021-06-01
Authorization: Bearer <token>
```
    
*Response*
    
The same as for 'clusters in a resource group', but in subscription scope.

---


## Update commitment tier in cluster

When the data volume to your linked workspaces change over time and you want to update the Commitment Tier level appropriately. The tier is specified in units of GB and can have values of 500, 1000, 2000 or 5000 GB/day. Note that you don't have to provide the full REST request body but should include the sku.

**CLI**

```azurecli
az account set --subscription "cluster-subscription-id"

az monitor log-analytics cluster update --resource-group "resource-group-name" --name "cluster-name"  --sku-capacity 500
```

### PowerShell

```powershell
Select-AzSubscription "cluster-subscription-id"

Update-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name" -SkuCapacity 500
```

### REST API

*Call*

```rest
PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2021-06-01
Authorization: Bearer <token>
Content-type: application/json

{
  "sku": {
    "name": "capacityReservation",
    "Capacity": 2000
  }
}
```

---


### Update billingType in cluster

The *billingType* property determines the billing attribution for the cluster and its data:
- *Cluster* (default) -- The billing is attributed to the Cluster resource
- *Workspaces* -- The billing is attributed to linked workspaces proportionally. When data volume from all workspaces is below the Commitment Tier level, the remaining volume is attributed to the cluster

**REST**

*Call*

```rest
PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2021-06-01
Authorization: Bearer <token>
Content-type: application/json

{
  "properties": {
    "billingType": "Workspaces"
    },
    "location": "region"
}
```

### Unlink a workspace from cluster

You can unlink a workspace from a cluster. After unlinking a workspace from the cluster, new data associated with this workspace is not sent to the dedicated cluster. Also, the workspace billing is no longer done via the cluster. 
Old data of the unlinked workspace might be left on the cluster. If this data is encrypted using customer-managed keys (CMK), the Key Vault secrets are kept. The system is abstracts this change from Log Analytics users. Users can just query the workspace as usual. The system performs cross-cluster queries on the backend as needed with no indication to users.  

> [!WARNING] 
> There is a limit of two link operations for a specific workspace within a month. Take time to consider and plan unlinking actions accordingly.

Use the following commands to unlink a workspace from cluster:

**CLI**

```azurecli
az account set --subscription "workspace-subscription-id"

az monitor log-analytics workspace linked-service delete --resource-group "resource-group-name" --workspace-name "workspace-name" --name cluster
```

**PowerShell**

```powershell
Select-AzSubscription "workspace-subscription-id"

# Unlink a workspace from cluster
Remove-AzOperationalInsightsLinkedService -ResourceGroupName "resource-group-name" -WorkspaceName {workspace-name} -LinkedServiceName cluster
```

---


## Delete cluster

It's recommended that you unlink all workspaces from a dedicated cluster before deleting it. You need to have *write* permissions on the cluster resource. When deleting a cluster, you are losing access to all data ingested to the cluster from linked workspaces and from workspaces that were linked previously. This operation is not reversible. If you delete your cluster when workspaces are linked, these get unlinked automatically and new data get ingested to Log Analytics storage instead.

A cluster resource that was deleted in the last 14 days is kept in soft-delete state and its name remained reserved. After the soft-delete period, the cluster is permanently deleted and it's name can be used.

> [!WARNING] 
> - The recovery of soft-deleted clusters isn't supported and it can't be recovered once deleted.
> - There is a limit of 4 clusters per subscription. Both active and soft-deleted clusters are counted as part of this. Customers should not create recurrent procedures that create and delete clusters. It has a significant impact on Log Analytics backend systems.

Use the following commands to delete a cluster:

**CLI**
```azurecli
az account set --subscription "cluster-subscription-id"

az monitor log-analytics cluster delete --resource-group "resource-group-name" --name $clusterName
```

**PowerShell**

```powershell
Select-AzSubscription "cluster-subscription-id"

Remove-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name"
```

**REST API**

Use the following REST call to delete a cluster:

```rest
DELETE https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2021-06-01
Authorization: Bearer <token>
```

  **Response**

  200 OK

---



## Limits and constraints

- A maximum of two active clusters can be created in each region and subscription.

- A maximum number of four reserved clusters (active or recently deleted) can be created in each region and subscription.

- A maximum of 1,000 Log Analytics workspaces can be linked to a cluster.

- A maximum of two workspace link operations on particular workspace is allowed in 30 day period.

- Moving a cluster to another resource group or subscription isn't currently supported.

- Cluster update should not include both identity and key identifier details in the same operation. In case you need to update both, the update should be in two consecutive operations.

- Lockbox isn't currently available in China. 

- [Double encryption](../../storage/common/storage-service-encryption.md#doubly-encrypt-data-with-infrastructure-encryption) is configured automatically for clusters created from October 2020 in supported regions. You can verify if your cluster is configured for double encryption by sending a GET request on the cluster and observing that the `isDoubleEncryptionEnabled` value is `true` for clusters with Double encryption enabled. 
  - If you create a cluster and get an error "region-name doesn't support Double Encryption for clusters.", you can still create the cluster without Double encryption by adding `"properties": {"isDoubleEncryptionEnabled": false}` in the REST request body.
  - Double encryption setting can not be changed after the cluster has been created.

## Troubleshooting

- If you get conflict error when creating a cluster, it may be that you have deleted your cluster in the last 14 days and it's in a soft-delete state. The cluster name remains reserved during the soft-delete period and you can't create a new cluster with that name. The name is released after the soft-delete period when the cluster is permanently deleted.

- If you update your cluster while the cluster is at provisioning or updating state, the update will fail.

- Some operations are long and can take a while to complete. These are *cluster create*, *cluster key update* and *cluster delete*. You can check the operation status by sending GET request to cluster or workspace and observe the response. For example, unlinked workspace won't have the *clusterResourceId* under *features*.

- Workspace link to cluster will fail if it is linked to another cluster.

## Error messages
  
### Cluster Create

-  400 -- Cluster name is not valid. Cluster name can contain characters a-z, A-Z, 0-9 and length of 3-63.
-  400 -- The body of the request is null or in bad format.
-  400 -- SKU name is invalid. Set SKU name to capacityReservation.
-  400 -- Capacity was provided but SKU is not capacityReservation. Set SKU name to capacityReservation.
-  400 -- Missing Capacity in SKU. Set Capacity value to 500, 1000, 2000 or 5000 GB/day.
-  400 -- Capacity is locked for 30 days. Decreasing capacity is permitted 30 days after update.
-  400 -- No SKU was set. Set the SKU name to capacityReservation and Capacity value to 500, 1000, 2000 or 5000 GB/day.
-  400 -- Identity is null or empty. Set Identity with systemAssigned type.
-  400 -- KeyVaultProperties are set on creation. Update KeyVaultProperties after cluster creation.
-  400 -- Operation cannot be executed now. Async operation is in a state other than succeeded. Cluster must complete its operation before any update operation is performed.

### Cluster Update

-  400 -- Cluster is in deleting state. Async operation is in progress . Cluster must complete its operation before any update operation is performed.
-  400 -- KeyVaultProperties is not empty but has a bad format. See [key identifier update](../logs/customer-managed-keys.md#update-cluster-with-key-identifier-details).
-  400 -- Failed to validate key in Key Vault. Could be due to lack of permissions or when key doesn't exist. Verify that you [set key and access policy](../logs/customer-managed-keys.md#grant-key-vault-permissions) in Key Vault.
-  400 -- Key is not recoverable. Key Vault must be set to Soft-delete and Purge-protection. See [Key Vault documentation](../../key-vault/general/soft-delete-overview.md)
-  400 -- Operation cannot be executed now. Wait for the Async operation to complete and try again.
-  400 -- Cluster is in deleting state. Wait for the Async operation to complete and try again.

### Cluster Get

 -  404 -- Cluster not found, the cluster may have been deleted. If you try to create a cluster with that name and get conflict, the cluster is in soft-delete for 14 days. You can contact support to recover it, or use another name to create a new cluster. 

### Cluster Delete

 -  409 -- Can't delete a cluster while in provisioning state. Wait for the Async operation to complete and try again.

### Workspace link

-  404 -- Workspace not found. The workspace you specified doesn't exist or was deleted.
-  409 -- Workspace link or unlink operation in process.
-  400 -- Cluster not found, the cluster you specified doesn't exist or was deleted. If you try to create a cluster with that name and get conflict, the cluster is in soft-delete for 14 days. You can contact support to recover it.

### Workspace unlink
-  404 -- Workspace not found. The workspace you specified doesn't exist or was deleted.
-  409 -- Workspace link or unlink operation in process.

## Next steps

- Learn about [Log Analytics dedicated cluster billing](./manage-cost-storage.md#log-analytics-dedicated-clusters)
- Learn about [proper design of Log Analytics workspaces](../logs/design-logs-deployment.md)
