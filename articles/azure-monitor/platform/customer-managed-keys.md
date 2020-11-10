---
title: Azure Monitor customer-managed key
description: Information and steps to configure Customer-Managed Key to encrypt data in your Log Analytics workspaces using an Azure Key Vault key.
ms.subservice: logs
ms.topic: conceptual
author: yossi-y
ms.author: yossiy
ms.date: 11/09/2020

---

# Azure Monitor customer-managed key 

This article provides background information and steps to configure customer-Managed Keys for your Log Analytics workspaces. Once configured, any data sent to your workspaces is encrypted with your Azure Key Vault key.

We recommend you review [Limitations and constraints](#limitationsandconstraints) below before configuration.

## Customer-managed key overview

[Encryption at Rest](../../security/fundamentals/encryption-atrest.md) is a common privacy and security requirement in organizations. You can let Azure completely manage encryption at rest, while you have various options to closely manage encryption or encryption keys.

Azure Monitor ensures that all data and saved queries are encrypted at rest using Microsoft-managed keys (MMK). Azure Monitor also provides an option for encryption using your own key that is stored in your [Azure Key Vault](../../key-vault/general/overview.md) and used by storage for data encryption. Key can be either [software or hardware-HSM protected](../../key-vault/general/overview.md). Azure Monitor use of encryption is identical to the way [Azure Storage encryption](../../storage/common/storage-service-encryption.md#about-azure-storage-encryption) operates.

The customer-Managed Key capability is delivered on dedicated Log Analytics clusters. It allows you to protect your data with [Lockbox](#customer-lockbox-preview) control and gives you the control to revoke the access to your data at any time. Data ingested in the last 14 days is also kept in hot-cache (SSD-backed) for efficient query engine operation. This data remains encrypted with Microsoft keys regardless customer-Managed Key configuration, but your control over SSD data adheres to [key revocation](#key-revocation). We are working to have SSD data encrypted with Customer-Managed Key in the first half of 2021.

To verify that we have the required capacity to provision dedicated cluster in your region, we require that your subscription is allowed beforehand. Use your Microsoft contact or open support request to get your subscription allowed before you start the Customer-Managed Key configuration.

The [Log Analytics clusters pricing model](./manage-cost-storage.md#log-analytics-dedicated-clusters) uses Capacity Reservations starting at a 1000 GB/day level.

## How Customer-Managed Key works in Azure Monitor

Azure Monitor leverages system-assigned managed identity to grant access to your Azure Key Vault. System-assigned managed identity can only be associated with a single Azure resource while the identity of the Log Analytics cluster is supported at the cluster level -- This dictates that the capability is delivered on a dedicated Log Analytics cluster. To support Customer-Managed Key on multiple workspaces, a new Log Analytics *Cluster* resource performs as an intermediate identity connection between your Key Vault and your Log Analytics workspaces. The Log Analytics cluster storage uses the managed identity that\'s associated with the *Cluster* resource to authenticate to your Azure Key Vault via Azure Active Directory. 

After configuration, any data ingested to workspaces linked to your dedicated cluster gets encrypted with your key in Key Vault. You can unlink workspaces from the cluster at any time. New data then gets ingested to Log Analytics storage and encrypted with Microsoft key, while you can query your new and old data seamlessly.


![Customer-Managed Key overview](media/customer-managed-keys/cmk-overview.png)

1. Key Vault
2. Log Analytics *Cluster* resource having managed identity with permissions to Key Vault -- The identity is propagated to the underlay dedicated Log Analytics cluster storage
3. Dedicated Log Analytics cluster
4. Workspaces linked to *Cluster* resource 

## Encryption keys operation

There are 3 types of keys involved in Storage data encryption:

- **KEK** - Key Encryption Key (your Customer-Managed Key)
- **AEK** - Account Encryption Key
- **DEK** - Data Encryption Key

The following rules apply:

- The Log Analytics cluster storage accounts generate unique encryption key for every storage account, which is known as the AEK.
- The AEK is used to derive DEKs, which are the keys that are used to encrypt each block of data written to disk.
- When you configure your key in Key Vault and reference it in the cluster, Azure Storage sends requests to your Azure Key Vault to wrap and unwrap the AEK to perform data encryption and decryption operations.
- Your KEK never leaves your Key Vault and in the case of an HSM key, it never leaves the hardware.
- Azure Storage uses the managed identity that's associated with the *Cluster* resource to authenticate and access to Azure Key Vault via Azure Active Directory.

## Customer-Managed Key provisioning procedure

1. Allowing subscription -- The capability is delivered on dedicated Log Analytics clusters. To verify that we have the required capacity in your region, we require that your subscription is allowed beforehand. Use your Microsoft contact to get your subscription allowed.
2. Creating Azure Key Vault and storing key
3. Creating cluster
4. Granting permissions to your Key Vault
5. Linking Log Analytics workspaces

Customer-Managed Key configuration isn't supported in Azure portal and provisioning is performed via [PowerShell](https://docs.microsoft.com/powershell/module/az.operationalinsights/), [CLI](https://docs.microsoft.com/cli/azure/monitor/log-analytics) or [REST](https://docs.microsoft.com/rest/api/loganalytics/) requests.

### Asynchronous operations and status check

Some of the configuration steps run asynchronously because they can't be completed quickly. When using REST requests in configuration, the response initially returns an HTTP status code 200 (OK) and header with *Azure-AsyncOperation* property when accepted:
```json
"Azure-AsyncOperation": "https://management.azure.com/subscriptions/subscription-id/providers/Microsoft.OperationalInsights/locations/region-name/operationStatuses/operation-id?api-version=2020-08-01"
```

Then you can check the status of the asynchronous operation by sending a GET request to the *Azure-AsyncOperation* header value:
```rst
GET https://management.azure.com/subscriptions/subscription-id/providers/microsoft.operationalInsights/locations/region-name/operationstatuses/operation-id?api-version=2020-08-01
Authorization: Bearer <token>
```

The response contains information about the operation and its *Status*. It can be one of the followings:

Operation is in progress
```json
{
    "id": "Azure-AsyncOperation URL value from the GET operation",
    "name": "operation-id", 
    "status" : "InProgress", 
    "startTime": "2017-01-06T20:56:36.002812+00:00",
}
```

Key identifier update operation is in progress
```json
{
    "id": "Azure-AsyncOperation URL value from the GET operation",
    "name": "operation-id", 
    "status" : "Updating", 
    "startTime": "2017-01-06T20:56:36.002812+00:00",
    "endTime": "2017-01-06T20:56:56.002812+00:00",
}
```

Cluster delete is in progress -- When you delete a cluster that has linked workspaces, unlinking operation is performed for each of the workspaces asynchronously and the operation can take a while.
This isn’t relevant when you delete a cluster with no linked workspace -- In this case the cluster is deleted immediately.
```json
{
    "id": "Azure-AsyncOperation URL value from the GET operation",
    "name": "operation-id", 
    "status" : "Deleting", 
    "startTime": "2017-01-06T20:56:36.002812+00:00",
    "endTime": "2017-01-06T20:56:56.002812+00:00",
}
```

Operation is completed
```json
{
    "id": "Azure-AsyncOperation URL value from the GET operation",
    "name": "operation-id", 
    "status" : "Succeeded", 
    "startTime": "2017-01-06T20:56:36.002812+00:00",
    "endTime": "2017-01-06T20:56:56.002812+00:00",
}
```

Operation failed
```json
{
    "id": "Azure-AsyncOperation URL value from the GET operation",
    "name": "operation-id", 
    "status" : "Failed", 
    "startTime": "2017-01-06T20:56:36.002812+00:00",
    "endTime": "2017-01-06T20:56:56.002812+00:00",
    "error" : { 
        "code": "error-code",  
        "message": "error-message" 
    }
}
```

### Allowing subscription

> [!IMPORTANT]
> Customer-Managed Key capability is regional. Your Azure Key Vault, cluster and linked Log Analytics workspaces must be in the same region, but they can be in different subscriptions.
> To verify that we have the required capacity to provision dedicated cluster in your region, we require that your subscription is allowed beforehand. Use your Microsoft contact or open support request to get your subscription allowed before you start Customer-Managed Key configuration. 

### Storing encryption key (KEK)

Create or use an Azure Key Vault that you already have to generate, or import a key to be used for data encryption. The Azure Key Vault must be configured as recoverable to protect your key and the access to your data in Azure Monitor. You can verify this configuration under properties in your Key Vault, both *Soft delete* and *Purge protection* should be enabled.

![Soft delete and purge protection settings](media/customer-managed-keys/soft-purge-protection.png)

These settings can be updated in Key Vault via CLI and PowerShell:

- [Soft Delete](../../key-vault/general/soft-delete-overview.md)
- [Purge protection](../../key-vault/general/soft-delete-overview.md#purge-protection) guards against force deletion of the secret / vault even after soft delete

### Create cluster

Follow the procedure illustrated in [Dedicated Clusters article](https://docs.microsoft.com/azure/azure-monitor/log-query/logs-dedicated-clusters#creating-a-cluster). 

> [!IMPORTANT]
> Copy and save the response since you will need the details in next steps.

### Grant Key Vault permissions

Create access policy in Key Vault to grants permissions to your cluster. These permissions are used by the underlay Azure Monitor Storage for data encryption. Open your Key Vault in Azure portal and click "Access Policies" then "+ Add Access Policy" to create a policy with these settings:

- Key permissions: select 'Get', 'Wrap Key' and 'Unwrap Key' permissions.
- Select principal: enter the cluster name or principal-id value that returned in the response in the previous step.

![grant Key Vault permissions](media/customer-managed-keys/grant-key-vault-permissions-8bit.png)

The *Get* permission is required to verify that your Key Vault is configured as recoverable to protect your key and the access to your Azure Monitor data.

### Update cluster with Key identifier details

All operations on the cluster require the Microsoft.OperationalInsights/clusters/write action permission. This permission could be granted via the Owner or Contributor that contains the */write action or via the Log Analytics Contributor role that contains the Microsoft.OperationalInsights/* action.

This step updates Azure Monitor Storage with the key and version to be used for data encryption. When updated, your new key is being used to wrap and unwrap the Storage key (AEK).

Select the current version of your key in Azure Key Vault to get the Key identifier details.

![Grant Key Vault permissions](media/customer-managed-keys/key-identifier-8bit.png)

Update KeyVaultProperties in cluster with Key Identifier details.

The operation is asynchronous and can take a while to complete.

```azurecli
az monitor log-analytics cluster update --name "cluster-name" --resource-group "resource-group-name" --key-name "key-name" --key-vault-uri "key-uri" --key-version "key-version"
```

```powershell
Update-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name" -KeyVaultUri "key-uri" -KeyName "key-name" -KeyVersion "key-version"
```

**Response**

It takes the propagation of the Key identifier a few minutes to complete. You can check the update state in two ways:
1. Copy the Azure-AsyncOperation URL value from the response and follow the [asynchronous operations status check](#asynchronous-operations-and-status-check).
2. Send a GET request on the cluster and look at the *KeyVaultProperties* properties. Your recently updated Key identifier details should return in the response.

A response to GET request should look like this when Key identifier update is complete:
200 OK and header
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

### Link workspace to cluster

You need to have 'write' permissions to both your workspace and cluster to perform this operation, which include these actions:

- In workspace: Microsoft.OperationalInsights/workspaces/write
- In cluster: Microsoft.OperationalInsights/clusters/write

> [!IMPORTANT]
> This step should be performed only after the completion of the Log Analytics cluster provisioning. If you link workspaces and ingest data prior to the provisioning, ingested data will be dropped and won't be recoverable.

This operation is asynchronous and can a while to complete.

Follow the procedure illustrated in [Dedicated Clusters article](https://docs.microsoft.com/azure/azure-monitor/log-query/logs-dedicated-clusters#link-a-workspace-to-the-cluster).

## Key revocation

You can revoke access to data by disabling your key, or deleting the cluster's access policy in your Key Vault. The Log Analytics cluster storage will always respect changes in key permissions within an hour or sooner and Storage will become unavailable. Any new data ingested to workspaces linked with your cluster gets dropped and won't be recoverable, data is inaccessible and queries to these workspaces fail. Previously ingested data remains in storage as long as your cluster and your workspaces aren't deleted. Inaccessible data is governed by the data-retention policy and will be purged when retention is reached. 

Ingested data in last 14 days is also kept in hot-cache (SSD-backed) for efficient query engine operation. This gets deleted on key revocation operation and becomes inaccessible as well.

Storage periodically polls your Key Vault to attempt to unwrap the encryption key and once accessed, data ingestion and query resume within 30 minutes.

## Key rotation

Customer-Managed Key rotation requires an explicit update to the cluster with the new key version in Azure Key Vault. Follow the instructions in "Update cluster with Key identifier details" step. If you don't update the new key identifier details in the cluster, the Log Analytics cluster storage will keep using your previous key for encryption. If you disable or delete your old key before updating the new key in the cluster, you will get into [key revocation](#key-revocation) state.

All your data remains accessible after the key rotation operation, since data always encrypted with Account Encryption Key (AEK) while AEK is now being encrypted with your new Key Encryption Key (KEK) version in Key Vault.

## Customer-Managed Key for queries

The query language used in Log Analytics is expressive and can contain sensitive information in comments you add to queries or in the query syntax. Some organizations require that such information is kept protected under Customer-Managed Key policy and you need save your queries encrypted with your key. Azure Monitor enables you to store *saved-searches* and *log-alerts* queries encrypted with your key in your own storage account when connected to your workspace. 

> [!NOTE]
> Log Analytics queries can be saved in various stores depending on the scenario used. Queries remain encrypted with Microsoft key (MMK) in the following scenarios regardless Customer-Managed Key configuration: Workbooks in Azure Monitor, Azure dashboards, Azure Logic App, Azure Notebooks and Automation Runbooks.

When you Bring Your Own Storage (BYOS) and link it to your workspace, the service uploads *saved-searches* and *log-alerts* queries to your storage account. That means that you control the storage account and the [encryption-at-rest policy](../../storage/common/customer-managed-keys-overview.md) either using the same key that you use to encrypt data in Log Analytics cluster, or a different key. You will, however, be responsible for the costs associated with that storage account. 

**Considerations before setting Customer-Managed Key for queries**
* You need to have 'write' permissions to both your workspace and Storage Account
* Make sure to create your Storage Account in the same region as your Log Analytics workspace is located
* The *saves searches* in storage is considered as service artifacts and their format may change
* Existing *saves searches* are removed from your workspace. Copy and any *saves searches* that you need before the configuration. You can view your *saved-searches* using  [PowerShell](/powershell/module/az.operationalinsights/get-azoperationalinsightssavedsearch)
* Query history isn't supported and you won't be able to see queries that you ran
* You can link a single storage account to workspace for the purpose of saving queries, but is can be used fro both *saved-searches* and *log-alerts* queries
* Pin to dashboard isn't supported

**Configure BYOS for saved-searches queries**

Link a storage account for *Query* to your workspace -- *saved-searches* queries are saved in your storage account. 

```powershell
$storageAccount.Id = Get-AzStorageAccount -ResourceGroupName "resource-group-name" -Name "storage-account-name"
New-AzOperationalInsightsLinkedStorageAccount -ResourceGroupName "resource-group-name" -WorkspaceName "workspace-name" -DataSourceType Query -StorageAccountIds $storageAccount.Id
```

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

After the configuration, any new *saved search* query will be saved in your storage.

**Configure BYOS for log-alerts queries**

Link a storage account for *Alerts* to your workspace -- *log-alerts* queries are saved in your storage account. 

```powershell
$storageAccount.Id = Get-AzStorageAccount -ResourceGroupName "resource-group-name" -Name "storage-account-name"
New-AzOperationalInsightsLinkedStorageAccount -ResourceGroupName "resource-group-name" -WorkspaceName "workspace-name" -DataSourceType Alerts -StorageAccountIds $storageAccount.Id
```

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

After the configuration, any new alert query will be saved in your storage.

## Customer Lockbox (preview)
Lockbox gives you the control to approve or reject Microsoft engineer request to access your data during a support request.

In Azure Monitor, you have this control on data in workspaces linked to your Log Analytics dedicated cluster. The Lockbox control applies to data stored in a Log Analytics dedicated cluster where it’s kept isolated in the cluster’s storage accounts under your Lockbox protected subscription.  

Learn more about [Customer Lockbox for Microsoft Azure](../../security/fundamentals/customer-lockbox-overview.md)

## Customer-Managed Key operations

- **Get all clusters in a resource group**
  
  ```azurecli
  az monitor log-analytics cluster list --resource-group "resource-group-name"
  ```

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

- **Get all clusters in a subscription**

  ```azurecli
  az monitor log-analytics cluster list
  ```

  ```powershell
  Get-AzOperationalInsightsCluster
  ```

  ```rst
  GET https://management.azure.com/subscriptions/<subscription-id>/providers/Microsoft.OperationalInsights/clusters?api-version=2020-08-01
  Authorization: Bearer <token>
  ```
    
  **Response**
    
  The same response as for 'cluster in a resource group', but in subscription scope.

- **Update *capacity reservation* in cluster**

  When the data volume to your linked workspaces change over time and you want to update the capacity reservation level appropriately. Follow the [update cluster](#update-cluster-with-key-identifier-details) and provide your new capacity value. It can be in the range of 1000 to 3000 GB per day and in steps of 100. For level higher than 3000 GB per day, reach your Microsoft contact to enable it. Note that you don’t have to provide the full REST request body but should include the sku:

  ```azurecli
  az monitor log-analytics cluster update --name "cluster-name" --resource-group "resource-group-name" --sku-capacity daily-ingestion-gigabyte
  ```

  ```powershell
  Update-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name" -SkuCapacity daily-ingestion-gigabyte
  ```

  ```rst
  PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2020-08-01
  Authorization: Bearer <token>
  Content-type: application/json

  {
    "sku": {
      "name": "capacityReservation",
      "Capacity": daily-ingestion-gigabyte
    }
  }
  ```

- **Update *billingType* in cluster**

  The *billingType* property determines the billing attribution for the cluster and its data:
  - *cluster* (default) -- The billing is attributed to the subscription hosting your Cluster resource
  - *workspaces* -- The billing is attributed to the subscriptions hosting your workspaces proportionally
  
  Follow the [update cluster](#update-cluster-with-key-identifier-details) and provide your new billingType value. Note that you don’t have to provide the full REST request body and should include the *billingType*:

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

- **Unlink workspace**

  You need 'write' permissions on the workspace and cluster to perform this operation. You can unlink a workspace from your cluster at any time. New ingested data after the unlink operation is stored in Log Analytics storage and encrypted with Microsoft key. You can query you data that was ingested to your workspace before and after the unlink seamlessly as long as the cluster is provisioned and configured with valid Key Vault key.

  This operation is is asynchronous and can a while to complete.

  ```azurecli
  az monitor log-analytics workspace linked-service delete --resource-group "resource-group-name" --name "cluster-name" --workspace-name "workspace-name"
  ```

  ```powershell
  Remove-AzOperationalInsightsLinkedService -ResourceGroupName "resource-group-name" -Name "workspace-name" -LinkedServiceName cluster
  ```

  ```rest
  DELETE https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>/linkedservices/cluster?api-version=2020-08-01
  Authorization: Bearer <token>
  ```

  - **Check workspace link status**
  
  Perform Get operation on the workspace and observe if *clusterResourceId* property is present in the response under *features*. A linked workspace will have the *clusterResourceId* property.

  ```azurecli
  az monitor log-analytics cluster show --resource-group "resource-group-name" --name "cluster-name"
  ```

  ```powershell
  Get-AzOperationalInsightsWorkspace -ResourceGroupName "resource-group-name" -Name "workspace-name"
  ```

- **Delete your cluster**

  You need 'write' permissions on the cluster to perform this operation. A soft-delete operation is performed to allow the recovery of your cluster including its data within 14 days, whether the deletion was accidental or intentional. The cluster name remains reserved during the soft-delete period and you can't create a new cluster with that name. After the soft-delete period, the cluster name is released and your cluster and its data are permanently deleted and are non-recoverable. Any linked workspace gets unlinked from the cluster on delete operation. New ingested data is stored in Log Analytics storage and encrypted with Microsoft key. 
  
  The unlink operation is asynchronous and can take up to 90 minutes to complete.

  ```azurecli
  az monitor log-analytics cluster delete --resource-group "resource-group-name" --name "cluster-name"
  ```
 
  ```powershell
  Remove-AzOperationalInsightsCluster -ResourceGroupName "resource-group-name" -ClusterName "cluster-name"
  ```

  ```rst
  DELETE https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>?api-version=2020-08-01
  Authorization: Bearer <token>
  ```
  
- **Recover your cluster and your data** 
  
  A cluster that was deleted in the last 14 days is in soft-delete state and can be recovered with its data. Since all workspaces got unlinked from the cluster deletion, you need to re-link your workspaces after the cluster's recovery. The recovery operation is currently performed manually by the product group. Use your Microsoft channel or open support request for recovery of deleted cluster.

## Limitations and constraints

- Customer-Managed Key is supported on dedicated Log Analytics cluster and suitable for customers sending 1TB per day or more.

- The max number of cluster per region and subscription is 2

- The maximum of linked workspaces to cluster is 1000

- You can link a workspace to your cluster and then unlink it. The number of workspace link operations on particular workspace is limited to 2 in a period of 30 days.

- Workspace link to cluster should be carried ONLY after you have verified that the Log Analytics cluster provisioning was completed. Data sent to your workspace prior to the completion will be dropped and won't be recoverable.

- Customer-Managed Key encryption applies to newly ingested data after the configuration time. Data that was ingested prior to the configuration, remains encrypted with Microsoft key. You can query data ingested before and after the Customer-Managed Key configuration seamlessly.

- The Azure Key Vault must be configured as recoverable. These properties aren't enabled by default and should be configured using CLI or PowerShell:<br>
  - [Soft Delete](../../key-vault/general/soft-delete-overview.md)
  - [Purge protection](../../key-vault/general/soft-delete-overview.md#purge-protection) should be turned on to guard against force deletion of the secret / vault even after soft delete.

- Cluster move to another resource group or subscription isn't supported currently.

- Your Azure Key Vault, cluster and linked workspaces must be in the same region and in the same Azure Active Directory (Azure AD) tenant, but they can be in different subscriptions.

- Workspace link to cluster will fail if it is linked to another cluster.

## Troubleshooting

- Behavior with Key Vault availability
  - In normal operation -- Storage caches AEK for short periods of time and goes back to Key Vault to unwrap periodically.
    
  - Transient connection errors -- Storage handles transient errors (timeouts, connection failures, DNS issues) by allowing keys to stay in cache for a short while longer and this overcomes any small blips in availability. The query and ingestion capabilities continue without interruption.
    
  - Live site -- unavailability of about 30 minutes will cause the Storage account to become unavailable. The query capability is unavailable and ingested data is cached for several hours using Microsoft key to avoid data loss. When access to Key Vault is restored, query becomes available and the temporary cached data is ingested to the data-store and encrypted with Customer-Managed Key.

  - Key Vault access rate -- The frequency that Azure Monitor Storage accesses Key Vault for wrap and unwrap operations is between 6 to 60 seconds.

- If you create a cluster and specify the KeyVaultProperties immediately, the operation may fail since the
    access policy can't be defined until system identity is assigned to the cluster.

- If you update existing cluster with KeyVaultProperties and 'Get' key Access Policy is missing in Key Vault, the operation will fail.

- If you get conflict error when creating a cluster – It may be that you have deleted your cluster in the last 14 days and it’s in a soft-delete period. The cluster name remains reserved during the soft-delete period and you can't create a new cluster with that name. The name is released after the soft-delete period when the cluster is permanently deleted.

- If you update your cluster while an operation is in progress, the operation will fail.

- If you fail to deploy your cluster, verify that your Azure Key Vault, cluster and linked Log Analytics workspaces are in the same region. The can be in different subscriptions.

- If you update your key version in Key Vault and don't update the new key identifier details in the cluster, the Log Analytics cluster will keep using your previous key and your data will become inaccessible. Update new key identifier details in the cluster to resume data ingestion and ability to query data.

- Some operations are long and can take a while to complete -- these are cluster create, cluster key update and cluster delete. You can check the operation status in two ways:
  1. when using REST, copy the Azure-AsyncOperation URL value from the response and follow the [asynchronous operations status check](#asynchronous-operations-and-status-check).
  2. Send GET request to cluster or workspace and observe the response. For example, unlinked workspace won't have the *clusterResourceId* under *features*.

- For support and help related to customer managed key, use your contacts into Microsoft.

- Error messages
  
  Cluster Create:
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

  Cluster Update
  -  400 -- Cluster is in deleting state. Async operation is in progress . Cluster must complete its operation before any update operation is performed.
  -  400 -- KeyVaultProperties is not empty but has a bad format. See [key identifier update](#update-cluster-with-key-identifier-details).
  -  400 -- Failed to validate key in Key Vault. Could be due to lack of permissions or when key doesn’t exist. Verify that you [set key and access policy](#grant-key-vault-permissions) in Key Vault.
  -  400 -- Key is not recoverable. Key Vault must be set to Soft-delete and Purge-protection. See [Key Vault documentation](../../key-vault/general/soft-delete-overview.md)
  -  400 -- Operation cannot be executed now. Wait for the Async operation to complete and try again.
  -  400 -- Cluster is in deleting state. Wait for the Async operation to complete and try again.

  Cluster Get:
    -  404 -- Cluster not found, the cluster may have been deleted. If you try to create a cluster with that name and get conflict, the cluster is in soft-delete for 14 days. You can contact support to recover it, or use another name to create a new cluster. 

  Cluster Delete
    -  409 -- Can't delete a cluster while in provisioning state. Wait for the Async operation to complete and try again.

  Workspace link:
  -  404 -- Workspace not found. The workspace you specified doesn’t exist or was deleted.
  -  409 -- Workspace link or unlink operation in process.
  -  400 -- Cluster not found, the cluster you specified doesn’t exist or was deleted. If you try to create a cluster with that name and get conflict, the cluster is in soft-delete for 14 days. You can contact support to recover it.

  Workspace unlink:
  -  404 -- Workspace not found. The workspace you specified doesn’t exist or was deleted.
  -  409 -- Workspace link or unlink operation in process.
