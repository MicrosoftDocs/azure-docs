---
title: Azure Monitor customer-managed key
description: Information and steps to configure Customer-managed key to encrypt data in your Log Analytics workspaces using an Azure Key Vault key.
ms.topic: conceptual
author: yossi-y
ms.author: yossiy
ms.date: 07/29/2021 
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Azure Monitor customer-managed key 

Data in Azure Monitor is encrypted with Microsoft-managed keys. You can use your own encryption key to protect the data and saved queries in your workspaces. When you specify a customer-managed key, that key is used to protect and control access to your data and once configured, any data sent to your workspaces is encrypted with your Azure Key Vault key. Customer-managed keys offer greater flexibility to manage access controls.

We recommend you review [Limitations and constraints](#limitationsandconstraints) below before configuration.

## Customer-managed key overview

[Encryption at Rest](../../security/fundamentals/encryption-atrest.md) is a common privacy and security requirement in organizations. You can let Azure completely manage encryption at rest, while you have various options to closely manage encryption and encryption keys.

Azure Monitor ensures that all data and saved queries are encrypted at rest using Microsoft-managed keys (MMK). Azure Monitor also provides an option for encryption using your own key that is stored in your [Azure Key Vault](../../key-vault/general/overview.md), which gives you the control to revoke the access to your data at any time. Azure Monitor use of encryption is identical to the way [Azure Storage encryption](../../storage/common/storage-service-encryption.md#about-azure-storage-encryption) operates.

Customer-managed key is delivered on [dedicated clusters](./logs-dedicated-clusters.md) providing higher protection level and control. Data ingested to dedicated clusters is being encrypted twice — once at the service level using Microsoft-managed keys or customer-managed keys, and once at the infrastructure level using two different encryption algorithms and two different keys. [Double encryption](../../storage/common/storage-service-encryption.md#doubly-encrypt-data-with-infrastructure-encryption) protects against a scenario where one of the encryption algorithms or keys may be compromised. In this case, the additional layer of encryption continues to protect your data. Dedicated cluster also allows you to protect your data with [Lockbox](#customer-lockbox-preview) control.

Data ingested in the last 14 days is also kept in hot-cache (SSD-backed) for efficient query engine operation. This data remains encrypted with Microsoft keys regardless customer-managed key configuration, but your control over SSD data adheres to [key revocation](#key-revocation). We are working to have SSD data encrypted with Customer-managed key in the second half of 2021.

Log Analytics Dedicated Clusters [pricing model](./logs-dedicated-clusters.md#cluster-pricing-model) requires commitment Tier starting at 500 GB/day and can have values of 500, 1000, 2000 or 5000 GB/day.

## How Customer-managed key works in Azure Monitor

Azure Monitor uses managed identity to grant access to your Azure Key Vault. The identity of the Log Analytics cluster is supported at the cluster level. To allow Customer-managed key protection on multiple workspaces, a new Log Analytics *Cluster* resource performs as an intermediate identity connection between your Key Vault and your Log Analytics workspaces. The cluster's storage uses the managed identity that\'s associated with the *Cluster* resource to authenticate to your Azure Key Vault via Azure Active Directory. 

After the Customer-managed key configuration, new ingested data to workspaces linked to your dedicated cluster gets encrypted with your key. You can unlink workspaces from the cluster at any time. New data then gets ingested to Log Analytics storage and encrypted with Microsoft key, while you can query your new and old data seamlessly.

> [!IMPORTANT]
> Customer-managed key capability is regional. Your Azure Key Vault, cluster and linked Log Analytics workspaces must be in the same region, but they can be in different subscriptions.

![Customer-managed key overview](media/customer-managed-keys/cmk-overview.png)

1. Key Vault
2. Log Analytics *Cluster* resource having managed identity with permissions to Key Vault -- The identity is propagated to the underlay dedicated Log Analytics cluster storage
3. Dedicated Log Analytics cluster
4. Workspaces linked to *Cluster* resource 

### Encryption keys operation

There are 3 types of keys involved in Storage data encryption:

- **KEK** - Key Encryption Key (your Customer-managed key)
- **AEK** - Account Encryption Key
- **DEK** - Data Encryption Key

The following rules apply:

- The Log Analytics cluster storage accounts generate unique encryption key for every storage account, which is known as the AEK.
- The AEK is used to derive DEKs, which are the keys that are used to encrypt each block of data written to disk.
- When you configure your key in Key Vault and reference it in the cluster, Azure Storage sends requests to your Azure Key Vault to wrap and unwrap the AEK to perform data encryption and decryption operations.
- Your KEK never leaves your Key Vault.
- Azure Storage uses the managed identity that's associated with the *Cluster* resource to authenticate and access to Azure Key Vault via Azure Active Directory.

### Customer-Managed key provisioning steps

1. Creating Azure Key Vault and storing key
1. Creating cluster
1. Granting permissions to your Key Vault
1. Updating cluster with key identifier details
1. Linking Log Analytics workspaces

Customer-managed key configuration isn't supported in Azure portal currently and provisioning can be performed via [PowerShell](/powershell/module/az.operationalinsights/), [CLI](/cli/azure/monitor/log-analytics) or [REST](/rest/api/loganalytics/) requests.

### Asynchronous operations and status check

Some of the configuration steps run asynchronously because they can't be completed quickly. The `status` in response can be one of the followings: 'InProgress', 'Updating', 'Deleting', 'Succeeded or 'Failed' with error code.

# [Azure portal](#tab/portal)

N/A

# [Azure CLI](#tab/azure-cli)

N/A

# [PowerShell](#tab/powershell)

N/A

# [REST](#tab/rest)

When using REST, the response initially returns an HTTP status code 202 (Accepted) and header with *Azure-AsyncOperation* property:
```json
"Azure-AsyncOperation": "https://management.azure.com/subscriptions/subscription-id/providers/Microsoft.OperationalInsights/locations/region-name/operationStatuses/operation-id?api-version=2020-08-01"
```

You can check the status of the asynchronous operation by sending a GET request to the endpoint in *Azure-AsyncOperation* header:
```rst
GET https://management.azure.com/subscriptions/subscription-id/providers/microsoft.operationalInsights/locations/region-name/operationstatuses/operation-id?api-version=2020-08-01
Authorization: Bearer <token>
```

---

## Storing encryption key (KEK)

Create or use existing Azure Key Vault in the region that the cluster is planed, then generate or import a key to be used for logs encryption. The Azure Key Vault must be configured as recoverable to protect your key and the access to your data in Azure Monitor. You can verify this configuration under properties in your Key Vault, both *Soft delete* and *Purge protection* should be enabled.

![Soft delete and purge protection settings](media/customer-managed-keys/soft-purge-protection.png)

These settings can be updated in Key Vault via CLI and PowerShell:

- [Soft Delete](../../key-vault/general/soft-delete-overview.md)
- [Purge protection](../../key-vault/general/soft-delete-overview.md#purge-protection) guards against force deletion of the secret / vault even after soft delete

## Create cluster

Clusters support System-assigned managed identity and identity `type` property should be set to `SystemAssigned`. The identity is being generated automatically with the cluster creation and can be used later to grant storage access to your Key Vault for wrap and unwrap operations. 
  
  Identity settings in cluster for System-assigned managed identity
  ```json
  {
    "identity": {
      "type": "SystemAssigned"
      }
  }
  ```

Follow the procedure illustrated in [Dedicated Clusters article](./logs-dedicated-clusters.md#creating-a-cluster). 

## Grant Key Vault permissions

Create access policy in Key Vault to grants permissions to your cluster. These permissions are used by the underlay Azure Monitor storage. Open your Key Vault in Azure portal and click *"Access Policies"* then *"+ Add Access Policy"* to create a policy with these settings:

- Key permissions: select *'Get'*, *'Wrap Key'* and *'Unwrap Key'*.
- Select principal: depending on the identity type used in the cluster (system or user assigned managed identity) enter either cluster name or cluster principal ID for system assigned managed identity or the user assigned managed identity name.

![grant Key Vault permissions](media/customer-managed-keys/grant-key-vault-permissions-8bit.png)

The *Get* permission is required to verify that your Key Vault is configured as recoverable to protect your key and the access to your Azure Monitor data.

## Update cluster with key identifier details

All operations on the cluster require the `Microsoft.OperationalInsights/clusters/write` action permission. This permission could be granted via the Owner or Contributor that contains the `*/write` action or via the Log Analytics Contributor role that contains the `Microsoft.OperationalInsights/*` action.

This step updates Azure Monitor Storage with the key and version to be used for data encryption. When updated, your new key is being used to wrap and unwrap the Storage key (AEK).

>[!IMPORTANT]
>- Key rotation can be automatic or require explicit key update, see [Key rotation](#key-rotation) to determine approach that is suitable for you before updating the key identifier details in cluster.
>- Cluster update should not include both identity and key identifier details in the same operation. If you need to update both, the update should be in two consecutive operations.

![Grant Key Vault permissions](media/customer-managed-keys/key-identifier-8bit.png)

Update KeyVaultProperties in cluster with key identifier details.

The operation is asynchronous and can take a while to complete.

# [Azure portal](#tab/portal)

N/A

# [Azure CLI](#tab/azure-cli)

```azurecli
az monitor log-analytics cluster update --name "cluster-name" --resource-group "resource-group-name" --key-name "key-name" --key-vault-uri "key-uri" --key-version "key-version"
```
# [PowerShell](#tab/powershell)

```powershell
Update-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name" -KeyVaultUri "key-uri" -KeyName "key-name" -KeyVersion "key-version"
```

# [REST](#tab/rest)

```rst
PATCH https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/cluster-name?api-version=2020-08-01
Authorization: Bearer <token> 
Content-type: application/json
 
{
  "properties": {
    "keyVaultProperties": {
      "keyVaultUri": "https://key-vault-name.vault.azure.net",
      "kyName": "key-name",
      "keyVersion": "current-version"
  },
  "sku": {
    "name": "CapacityReservation",
    "capacity": 500
  }
}
```

**Response**

It takes the propagation of the key a few minutes to complete. You can check the update state in two ways:
1. Copy the Azure-AsyncOperation URL value from the response and follow the [asynchronous operations status check](#asynchronous-operations-and-status-check).
2. Send a GET request on the cluster and look at the *KeyVaultProperties* properties. Your recently updated key should return in the response.

A response to GET request should look like this when the key update is complete:
202 (Accepted) and header
```json
{
  "identity": {
    "type": "SystemAssigned",
    "tenantId": "tenant-id",
    "principalId": "principle-id"
    },
  "sku": {
    "name": "capacityReservation",
    "capacity": 500,
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

---

## Link workspace to cluster

> [!IMPORTANT]
> This step should be performed only after the completion of the Log Analytics cluster provisioning. If you link workspaces and ingest data prior to the provisioning, ingested data will be dropped and won't be recoverable.

You need to have 'write' permissions to both your workspace and cluster to perform this operation, which include `Microsoft.OperationalInsights/workspaces/write` and `Microsoft.OperationalInsights/clusters/write`.

Follow the procedure illustrated in [Dedicated Clusters article](./logs-dedicated-clusters.md#link-a-workspace-to-cluster).

## Key revocation

> [!IMPORTANT]
> - The recommended way to revoke access to your data is by disabling your key, or deleting access policy in your Key Vault.
> - Setting the cluster's `identity` `type` to `None` also revokes access to your data, but this approach isn't recommended since you can't revert it without contacting support.

The cluster storage will always respect changes in key permissions within an hour or sooner and storage will become unavailable. Any new data ingested to workspaces linked with your cluster gets dropped and won't be recoverable, data becomes inaccessible and queries on these workspaces fail. Previously ingested data remains in storage as long as your cluster and your workspaces aren't deleted. Inaccessible data is governed by the data-retention policy and will be purged when retention is reached. Ingested data in last 14 days is also kept in hot-cache (SSD-backed) for efficient query engine operation. This gets deleted on key revocation operation and becomes inaccessible.

The cluster's storage periodically checks your Key Vault to attempt to unwrap the encryption key and once accessed, data ingestion and query are resumed within 30 minutes.

## Key rotation

Key rotation has two modes: 
- Auto-rotation - when you you update your cluster with ```"keyVaultProperties"``` but omit ```"keyVersion"``` property, or set it to ```""```, storage will autoamatically use the latest versions.
- Explicit key version update - when you update your cluster and provide key version in ```"keyVersion"``` property, any new key versions require an explicit ```"keyVaultProperties"``` update in cluster, see [Update cluster with Key identifier details](#update-cluster-with-key-identifier-details). If you generate new key version in Key Vault but don't update it in the cluster, the Log Analytics cluster storage will keep using your previous key. If you disable or delete your old key before updating the new key in the cluster, you will get into [key revocation](#key-revocation) state.

All your data remains accessible after the key rotation operation, since data always encrypted with Account Encryption Key (AEK) while AEK is now being encrypted with your new Key Encryption Key (KEK) version in Key Vault.

## Customer-managed key for saved queries and log alerts

The query language used in Log Analytics is expressive and can contain sensitive information in comments you add to queries or in the query syntax. Some organizations require that such information is kept protected under Customer-managed key policy and you need save your queries encrypted with your key. Azure Monitor enables you to store *saved-searches* and *log alerts* queries encrypted with your key in your own storage account when connected to your workspace. 

> [!NOTE]
> Log Analytics queries can be saved in various stores depending on the scenario used. Queries remain encrypted with Microsoft key (MMK) in the following scenarios regardless Customer-managed key configuration: Workbooks in Azure Monitor, Azure dashboards, Azure Logic App, Azure Notebooks and Automation Runbooks.

When you Bring Your Own Storage (BYOS) and link it to your workspace, the service uploads *saved-searches* and *log alerts* queries to your storage account. That means that you control the storage account and the [encryption-at-rest policy](../../storage/common/customer-managed-keys-overview.md) either using the same key that you use to encrypt data in Log Analytics cluster, or a different key. You will, however, be responsible for the costs associated with that storage account. 

**Considerations before setting Customer-managed key for queries**
* You need to have 'write' permissions to both your workspace and Storage Account
* Make sure to create your Storage Account in the same region as your Log Analytics workspace is located
* The *saves searches* in storage is considered as service artifacts and their format may change
* Existing *saves searches* are removed from your workspace. Copy and any *saves searches* that you need before the configuration. You can view your *saved-searches* using  [PowerShell](/powershell/module/az.operationalinsights/get-azoperationalinsightssavedsearch)
* Query history isn't supported and you won't be able to see queries that you ran
* You can link a single storage account to workspace for the purpose of saving queries, but is can be used fro both *saved-searches* and *log alerts* queries
* Pin to dashboard isn't supported
* Fired log alerts will not contains search results or alert query. You can use [alert dimensions](../alerts/alerts-unified-log.md#split-by-alert-dimensions) to get context in the fired alerts.

**Configure BYOS for saved-searches queries**

Link a storage account for *Query* to your workspace -- *saved-searches* queries are saved in your storage account. 

# [Azure portal](#tab/portal)

N/A

# [Azure CLI](#tab/azure-cli)

```azurecli
$storageAccountId = '/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage name>'
az monitor log-analytics workspace linked-storage create --type Query --resource-group "resource-group-name" --workspace-name "workspace-name" --storage-accounts $storageAccountId
```

# [PowerShell](#tab/powershell)

```powershell
$storageAccount.Id = Get-AzStorageAccount -ResourceGroupName "resource-group-name" -Name "storage-account-name"
New-AzOperationalInsightsLinkedStorageAccount -ResourceGroupName "resource-group-name" -WorkspaceName "workspace-name" -DataSourceType Query -StorageAccountIds $storageAccount.Id
```

# [REST](#tab/rest)

```rst
PUT https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.OperationalInsights/workspaces/<workspace-name>/linkedStorageAccounts/Query?api-version=2020-08-01
Authorization: Bearer <token> 
Content-type: application/json
 
{
  "properties": {
    "dataSourceType": "Query", 
    "storageAccountIds": 
    [
      "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"
    ]
  }
}
```

---

After the configuration, any new *saved search* query will be saved in your storage.

**Configure BYOS for log alerts queries**

Link a storage account for *Alerts* to your workspace -- *log alerts* queries are saved in your storage account. 

# [Azure portal](#tab/portal)

N/A

# [Azure CLI](#tab/azure-cli)

```azurecli
$storageAccountId = '/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage name>'
az monitor log-analytics workspace linked-storage create --type ALerts --resource-group "resource-group-name" --workspace-name "workspace-name" --storage-accounts $storageAccountId
```

# [PowerShell](#tab/powershell)

```powershell
$storageAccount.Id = Get-AzStorageAccount -ResourceGroupName "resource-group-name" -Name "storage-account-name"
New-AzOperationalInsightsLinkedStorageAccount -ResourceGroupName "resource-group-name" -WorkspaceName "workspace-name" -DataSourceType Alerts -StorageAccountIds $storageAccount.Id
```

# [REST](#tab/rest)

```rst
PUT https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.OperationalInsights/workspaces/<workspace-name>/linkedStorageAccounts/Alerts?api-version=2020-08-01
Authorization: Bearer <token> 
Content-type: application/json
 
{
  "properties": {
    "dataSourceType": "Alerts", 
    "storageAccountIds": 
    [
      "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"
    ]
  }
}
```

---

After the configuration, any new alert query will be saved in your storage.

## Customer Lockbox (preview)

Lockbox gives you the control to approve or reject Microsoft engineer request to access your data during a support request.

In Azure Monitor, you have this control on data in workspaces linked to your Log Analytics dedicated cluster. The Lockbox control applies to data stored in a Log Analytics dedicated cluster where it’s kept isolated in the cluster’s storage accounts under your Lockbox protected subscription.  

Learn more about [Customer Lockbox for Microsoft Azure](../../security/fundamentals/customer-lockbox-overview.md)

## Customer-Managed key operations

Customer-Managed key is provided on dedicated cluster and these operations are referred in [dedicated cluster article](./logs-dedicated-clusters.md#change-cluster-properties)

- Get all clusters in resource group  
- Get all clusters in subscription
- Update *capacity reservation* in cluster
- Update *billingType* in cluster
- Unlink a workspace from cluster
- Delete cluster

## Limitations and constraints

- The max number of cluster per region and subscription is 2

- The maximum number of workspaces that can be linked to a cluster is 1000

- You can link a workspace to your cluster and then unlink it. The number of workspace link operations on particular workspace is limited to 2 in a period of 30 days.

- Customer-managed key encryption applies to newly ingested data after the configuration time. Data that was ingested prior to the configuration, remains encrypted with Microsoft key. You can query data ingested before and after the Customer-managed key configuration seamlessly.

- The Azure Key Vault must be configured as recoverable. These properties aren't enabled by default and should be configured using CLI or PowerShell:<br>
  - [Soft Delete](../../key-vault/general/soft-delete-overview.md)
  - [Purge protection](../../key-vault/general/soft-delete-overview.md#purge-protection) should be turned on to guard against force deletion of the secret / vault even after soft delete.

- Cluster move to another resource group or subscription isn't supported currently.

- Your Azure Key Vault, cluster and workspaces must be in the same region and in the same Azure Active Directory (Azure AD) tenant, but they can be in different subscriptions.

- Cluster update should not include both identity and key identifier details in the same operation. In case you need to update both, the update should be in two consecutive operations.

- Lockbox isn't available in China currently. 

- [Double encryption](../../storage/common/storage-service-encryption.md#doubly-encrypt-data-with-infrastructure-encryption) is configured automatically for clusters created from October 2020 in supported regions. You can verify if your cluster is configured for double encryption by sending a GET request on the cluster and observing that the `isDoubleEncryptionEnabled` value is `true` for clusters with Double encryption enabled. 
  - If you create a cluster and get an error "<region-name> doesn’t support Double Encryption for clusters.", you can still create the cluster without Double encryption by adding `"properties": {"isDoubleEncryptionEnabled": false}` in the REST request body.
  - Double encryption setting can not be changed after the cluster has been created.

  - Setting the cluster's `identity` `type` to `None` acks also revokes access to your data, but this approach isn't recommended since you can't revert it without contacting support. The recommended way to revoke access to your data is [key revocation](#key-revocation).

  - You can't use Customer-managed key with User-assigned managed identity if your Key Vault is in Private-Link (vNet). You can use System-assigned managed identity in this scenario.

## Troubleshooting

- Behavior with Key Vault availability
  - In normal operation -- Storage caches AEK for short periods of time and goes back to Key Vault to unwrap periodically.
    
  - Key Vault connection errors -- Storage handles transient errors (timeouts, connection failures, DNS issues) by allowing keys to stay in cache for the duration of the availability issue and this overcomes blips and availability issues. The query and ingestion capabilities continue without interruption.
    
- Key Vault access rate -- The frequency that Azure Monitor Storage accesses Key Vault for wrap and unwrap operations is between 6 to 60 seconds.

- If you update your cluster while the cluster is at provisioning or updating state, the update will fail.

- If you get conflict error when creating a cluster – It may be that you have deleted your cluster in the last 14 days and it’s in a soft-delete period. The cluster name remains reserved during the soft-delete period and you can't create a new cluster with that name. The name is released after the soft-delete period when the cluster is permanently deleted.

- Workspace link to cluster will fail if it is linked to another cluster.

- If you create a cluster and specify the KeyVaultProperties immediately, the operation may fail since the
    access policy can't be defined until system identity is assigned to the cluster.

- If you update existing cluster with KeyVaultProperties and 'Get' key Access Policy is missing in Key Vault, the operation will fail.

- If you fail to deploy your cluster, verify that your Azure Key Vault, cluster and linked Log Analytics workspaces are in the same region. The can be in different subscriptions.

- If you update your key version in Key Vault and don't update the new key identifier details in the cluster, the Log Analytics cluster will keep using your previous key and your data will become inaccessible. Update new key identifier details in the cluster to resume data ingestion and ability to query data.

- Some operations are long and can take a while to complete -- these are cluster create, cluster key update and cluster delete. You can check the operation status in two ways:
  1. when using REST, copy the Azure-AsyncOperation URL value from the response and follow the [asynchronous operations status check](#asynchronous-operations-and-status-check).
  2. Send GET request to cluster or workspace and observe the response. For example, unlinked workspace won't have the *clusterResourceId* under *features*.

- Error messages
  
  **Cluster Create**
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

  **Cluster Update**
  -  400 -- Cluster is in deleting state. Async operation is in progress . Cluster must complete its operation before any update operation is performed.
  -  400 -- KeyVaultProperties is not empty but has a bad format. See [key identifier update](#update-cluster-with-key-identifier-details).
  -  400 -- Failed to validate key in Key Vault. Could be due to lack of permissions or when key doesn’t exist. Verify that you [set key and access policy](#grant-key-vault-permissions) in Key Vault.
  -  400 -- Key is not recoverable. Key Vault must be set to Soft-delete and Purge-protection. See [Key Vault documentation](../../key-vault/general/soft-delete-overview.md)
  -  400 -- Operation cannot be executed now. Wait for the Async operation to complete and try again.
  -  400 -- Cluster is in deleting state. Wait for the Async operation to complete and try again.

  **Cluster Get**
    -  404 -- Cluster not found, the cluster may have been deleted. If you try to create a cluster with that name and get conflict, the cluster is in soft-delete for 14 days. You can contact support to recover it, or use another name to create a new cluster. 

  **Cluster Delete**
    -  409 -- Can't delete a cluster while in provisioning state. Wait for the Async operation to complete and try again.

  **Workspace link**
  -  404 -- Workspace not found. The workspace you specified doesn’t exist or was deleted.
  -  409 -- Workspace link or unlink operation in process.
  -  400 -- Cluster not found, the cluster you specified doesn’t exist or was deleted. If you try to create a cluster with that name and get conflict, the cluster is in soft-delete for 14 days. You can contact support to recover it.

  **Workspace unlink**
  -  404 -- Workspace not found. The workspace you specified doesn’t exist or was deleted.
  -  409 -- Workspace link or unlink operation in process.
## Next steps

- Learn about [Log Analytics dedicated cluster billing](./manage-cost-storage.md#log-analytics-dedicated-clusters)
- Learn about [proper design of Log Analytics workspaces](./design-logs-deployment.md)
