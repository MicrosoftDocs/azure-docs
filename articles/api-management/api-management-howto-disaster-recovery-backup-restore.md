---
title: Backup and restore your Azure API Management instance for disaster recovery
titleSuffix: Azure API Management
description: Learn how to use backup and restore operations in Azure API Management to carry out your disaster recovery strategy.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 07/27/2022
ms.author: danlep 
ms.custom: devx-track-azurepowershell
---

# How to implement disaster recovery using service backup and restore in Azure API Management

By publishing and managing your APIs via Azure API Management, you're taking advantage of fault tolerance and infrastructure capabilities that you'd otherwise design, implement, and manage manually. The Azure platform mitigates a large fraction of potential failures at a fraction of the cost.

To recover from availability problems that affect your API Management service, be ready to reconstitute your service in another region at any time. Depending on your recovery time objective, you might want to keep a standby service in one or more regions. You might also try to maintain their configuration and content in sync with the active service according to your recovery point objective. The API management backup and restore capabilities provide the necessary building blocks for implementing disaster recovery strategy.

Backup and restore operations can also be used for replicating API Management service configuration between operational environments, for example, development and staging. Beware that runtime data such as users and subscriptions will be copied as well, which might not always be desirable.

This article shows how to automate backup and restore operations of your API Management instance using an external storage account. The steps shown here use either the [Backup-AzApiManagement](/powershell/module/az.apimanagement/backup-azapimanagement) and [Restore-AzApiManagement](/powershell/module/az.apimanagement/restore-azapimanagement) Azure PowerShell cmdlets, or the [Api Management Service - Backup](/rest/api/apimanagement/current-ga/api-management-service/backup) and [Api Management Service - Restore](/rest/api/apimanagement/current-ga/api-management-service/restore) REST APIs.


> [!WARNING]
> Each backup expires after 30 days. If you attempt to restore a backup after the 30-day expiration period has expired, the restore will fail with a `Cannot restore: backup expired` message.

> [!IMPORTANT]
> Restore operation doesn't change custom hostname configuration of the target service. We recommend to use the same custom hostname and TLS certificate for both active and standby services, so that, after restore operation completes, the traffic can be re-directed to the standby instance by a simple DNS CNAME change.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Prerequisites

* An API Management service instance. If you don't have one, see [Create an API Management service instance](get-started-create-service-instance.md).
* An Azure storage account. If you don't have one, see [Create a storage account](../storage/common/storage-account-create.md).
    * [Create a container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) in the storage account to hold the backup data.
        
* The latest version of Azure PowerShell, if you plan to use Azure PowerShell cmdlets. If you haven't already, [install Azure PowerShell](/powershell/azure/install-azure-powershell).

## Configure storage account access
When running a backup or restore operation, you need to configure access to the storage account. API Management supports two storage access mechanisms: an Azure Storage access key, or an API Management managed identity.

### Configure storage account access key

Azure generates two 512-bit storage account access keys for each storage account. These keys can be used to authorize access to data in your storage account via Shared Key authorization. To view, retrieve, and manage the keys, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md?tabs=azure-portal).

### Configure API Management managed identity

> [!NOTE]
> Using an API Management managed identity for storage operations during backup and restore is supported in API Management REST API version `2021-04-01-preview` or later.

1. Enable a system-assigned or user-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md) in your API Management instance.

    * If you enable a user-assigned managed identity, take note of the identity's **Client ID**.
    * If you will back up and restore to different API Management instances, enable a managed identity in both the source and target instances.
1. Assign the identity the **Storage Blob Data Contributor** role, scoped to the storage account used for backup and restore. To assign the role, use the [Azure portal](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md) or other Azure tools.


## Back up an API Management service

### [PowerShell](#tab/powershell)

[Sign in](/powershell/azure/authenticate-azureps) with Azure PowerShell.

In the following examples:

* An API Management instance named *myapim* is in resource group *apimresourcegroup*.
* A storage account named *backupstorageaccount* is in resource group *storageresourcegroup*. The storage account has a container named *backups*.
* A backup blob will be created with name *ContosoBackup.apimbackup*.

Set variables in PowerShell:

```powershell
$apiManagementName="myapim";
$apiManagementResourceGroup="apimresourcegroup";
$storageAccountName="backupstorageaccount";
$storageResourceGroup="storageresourcegroup";
$containerName="backups";
$blobName="ContosoBackup.apimbackup"
```

### Access using storage access key

```powershell
$storageKey = (Get-AzStorageAccountKey -ResourceGroupName $storageResourceGroup -StorageAccountName $storageAccountName)[0].Value

$storageContext = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageKey

Backup-AzApiManagement -ResourceGroupName $apiManagementResourceGroup -Name $apiManagementName `
    -StorageContext $storageContext -TargetContainerName $containerName -TargetBlobName $blobName
```

### Access using managed identity


To configure a managed identity in your API Management instance to access the storage account, see [Configure a managed identity](#configure-api-management-managed-identity), earlier in this article.

#### Access using system-assigned managed identity

```powershell
$storageContext = New-AzStorageContext -StorageAccountName $storageAccountName

Backup-AzApiManagement -ResourceGroupName $apiManagementResourceGroup -Name $apiManagementName `
    -StorageContext $storageContext -TargetContainerName $containerName `
    -TargetBlobName $blobName -AccessType "SystemAssignedManagedIdentity"
```

#### Access using user-assigned managed identity

In this example, a user-assigned managed identity named *myidentity* is in resource group *identityresourcegroup*.

```powershell
$identityName = "myidentity";
$identityResourceGroup = "identityresourcegroup";

$identityId = (Get-AzUserAssignedIdentity -Name $identityName -ResourceGroupName $identityResourceGroup).ClientId

$storageContext = New-AzStorageContext -StorageAccountName $storageAccountName

Backup-AzApiManagement -ResourceGroupName $apiManagementResourceGroup -Name $apiManagementName `
    -StorageContext $storageContext -TargetContainerName $containerName `
    -TargetBlobName $blobName -AccessType "UserAssignedManagedIdentity" ` -identityClientId $identityid
```

Backup is a long-running operation that may take several minutes to complete.

### [REST](#tab/rest)

See [Azure REST API reference](/rest/api/azure/) for information about authenticating and calling Azure REST APIs.

To back up an API Management service, issue the following HTTP request:

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/backup?api-version={api-version}
```

where:

-   `subscriptionId` - ID of the subscription that holds the API Management service you're trying to back up
-   `resourceGroupName` - name of the resource group of your Azure API Management service
-   `serviceName` - the name of the API Management service you're making a backup of specified at the time of its creation
-   `api-version` - a valid REST API version such as `2021-08-01` or `2021-04-01-preview`.

In the body of the request, specify the target storage account name, blob container name, backup name, and the storage access type. If the storage container doesn't exist, the backup operation creates it.

### Access using storage access key

```json
{
    "storageAccount": "{storage account name for the backup}",
    "containerName": "{backup container name}",
    "backupName": "{backup blob name}",
    "accessKey": "{access key for the account}"
}
```

### Access using managed identity

> [!NOTE]
> Using an API Management managed identity for storage operations during backup and restore requires API Management REST API version `2021-04-01-preview` or later.

#### Access using system-assigned managed identity

```json
{
    "storageAccount": "{storage account name for the backup}",
    "containerName": "{backup container name}",
    "backupName": "{backup blob name}",
    "accessType": "SystemAssignedManagedIdentity"
}
```

#### Access using user-assigned managed identity

```json
{
    "storageAccount": "{storage account name for the backup}",
    "containerName": "{backup container name}",
    "backupName": "{backup blob name}",
    "accessType": "UserAssignedManagedIdentity",
    "clientId": "{client ID of user-assigned identity}"
}
```


Set the value of the `Content-Type` request header to `application/json`.

Backup is a long-running operation that may take several minutes to complete. If the request succeeded and the backup process began, you receive a `202 Accepted` response status code with a `Location` header. Make `GET` requests to the URL in the `Location` header to find out the status of the operation. While the backup is in progress, you continue to receive a `202 Accepted` status code. A Response code of `200 OK` indicates successful completion of the backup operation.

---

## Restore an API Management service

> [!CAUTION]
> Avoid changes to the service configuration (for example, APIs, policies, developer portal appearance) while restore operation is in progress. Changes **could be overwritten**.

### [PowerShell](#tab/powershell)

In the following examples, 

* An API Management instance named *myapim* is restored from the backup blob named *ContosoBackup.apimbackup* in storage account *backupstorageaccount*.
* The backup blob is in a container named *backups*.

Set variables in PowerShell:

```powershell
$apiManagementName="myapim";
$apiManagementResourceGroup="apimresourcegroup";
$storageAccountName="backupstorageaccount";
$storageResourceGroup="storageresourcegroup";
$containerName="backups";
$blobName="ContosoBackup.apimbackup"
```

### Access using storage access key

```powershell
$storageKey = (Get-AzStorageAccountKey -ResourceGroupName $storageResourceGroup -StorageAccountName $storageAccountName)[0].Value

$storageContext = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageKey

Restore-AzApiManagement -ResourceGroupName $apiManagementResourceGroup -Name $apiManagementName `
    -StorageContext $storageContext -SourceContainerName $containerName -SourceBlobName $blobName
```

### Access using managed identity

To configure a managed identity in your API Management instance to access the storage account, see [Configure a managed identity](#configure-api-management-managed-identity), earlier in this article.

#### Access using system-assigned managed identity

```powershell
$storageContext = New-AzStorageContext -StorageAccountName $storageAccountName

Restore-AzApiManagement -ResourceGroupName $apiManagementResourceGroup -Name $apiManagementName `
    -StorageContext $storageContext -SourceContainerName $containerName `
    -SourceBlobName $blobName -AccessType "SystemAssignedManagedIdentity"
```

#### Access using user-assigned managed identity

In this example, a user-assigned managed identity named *myidentity* is in resource group *identityresourcegroup*.

```powershell
$identityName = "myidentity";
$identityResourceGroup = "identityresourcegroup";

$identityId = (Get-AzUserAssignedIdentity -Name $identityName -ResourceGroupName $identityResourceGroup).ClientId

$storageContext = New-AzStorageContext -StorageAccountName $storageAccountName

Restore-AzApiManagement -ResourceGroupName $apiManagementResourceGroup -Name $apiManagementName `
    -StorageContext $storageContext -SourceContainerName $containerName `
    -SourceBlobName $blobName -AccessType "UserAssignedManagedIdentity" ` -identityClientId $identityid
```

Restore is a long-running operation that may take up to 45 minutes or more to complete. 

### [REST](#tab/rest)

To restore an API Management service from a previously created backup, make the following HTTP request:

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/restore?api-version={api-version}
```

where:

-   `subscriptionId` - ID of the subscription that holds the API Management service you're restoring a backup into
-   `resourceGroupName` - name of the resource group that holds the Azure API Management service you're restoring a backup into
-   `serviceName` - the name of the API Management service being restored into specified at its creation time
-   `api-version` - a valid REST API version such as `2021-08-01` or `2021-04-01-preview`

In the body of the request, specify the existing storage account name, blob container name, backup name, and the storage access type. 

### Access using storage access key

```json
{
    "storageAccount": "{storage account name for the backup}",
    "containerName": "{backup container name}",
    "backupName": "{backup blob name}",
    "accessKey": "{access key for the account}"
}
```

### Access using managed identity

> [!NOTE]
> Using an API Management managed identity for storage operations during backup and restore requires API Management REST API version `2021-04-01-preview` or later.

#### Access using system-assigned managed identity

```json
{
    "storageAccount": "{storage account name for the backup}",
    "containerName": "{backup container name}",
    "backupName": "{backup blob name}",
    "accessType": "SystemAssignedManagedIdentity"
}
```

#### Access using user-assigned managed identity

```json
{
    "storageAccount": "{storage account name for the backup}",
    "containerName": "{backup container name}",
    "backupName": "{backup blob name}",
    "accessType": "UserAssignedManagedIdentity",
    "clientId": "{client ID of user-assigned identity}"
}
```

Set the value of the `Content-Type` request header to `application/json`.

Restore is a long-running operation that may take up to 30 or more minutes to complete. If the request succeeded and the restore process began, you receive a `202 Accepted` response status code with a `Location` header. Make `GET` requests to the URL in the `Location` header to find out the status of the operation. While the restore is in progress, you continue to receive a `202 Accepted` status code. A response code of `200 OK` indicates successful completion of the restore operation.

---

## Constraints

-   Restore of a **backup is guaranteed only for 30 days** since the moment of its creation.
-   While backup is in progress, **avoid management changes in the service** such as pricing tier upgrade or downgrade, change in domain name, and more.
-   **Changes** made to the service configuration (for example, APIs, policies, and developer portal appearance) while backup operation is in process **might be excluded from the backup and will be lost**.
- Backup doesn't capture pre-aggregated log data used in reports shown on the **Analytics** window in the Azure portal.
- [Cross-Origin Resource Sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) should **not** be enabled on the Blob service in the storage account.
-  **The pricing tier** of the service being restored into **must match** the pricing tier of the backed-up service being restored.

## Storage networking constraints

### Access using storage access key

If the storage account is **[firewall][azure-storage-ip-firewall] enabled** and a storage key is used for access, then the customer must **Allow** the set of [Azure API Management control plane IP addresses][control-plane-ip-address] on their storage account for backup or restore to work. The storage account can be in any Azure region except the one where the API Management service is located. For example, if the API Management service is in West US, then the Azure Storage account can be in West US 2 and the customer needs to open the control plane IP 13.64.39.16 (API Management control plane IP of West US) in the firewall. This is because the requests to Azure Storage aren't SNATed to a public IP from compute (Azure API Management control plane) in the same Azure region. Cross-region storage requests will be SNATed to the public IP address.

### Access using managed identity

If an API Management system-assigned managed identity is used to access a firewall-enabled storage account, ensure that the storage account [grants access to trusted Azure services](../storage/common/storage-network-security.md?tabs=azure-portal#grant-access-to-trusted-azure-services).

## What is not backed up
-   **Usage data** used for creating analytics reports **isn't included** in the backup. Use [Azure API Management REST API][azure api management rest api] to periodically retrieve analytics reports for safekeeping.
-   [Custom domain TLS/SSL](configure-custom-domain.md) certificates.
-   [Custom CA certificates](api-management-howto-ca-certificates.md), which includes intermediate or root certificates uploaded by the customer.
-   [Virtual network](api-management-using-with-vnet.md) integration settings.
-   [Managed identity](api-management-howto-use-managed-service-identity.md) configuration.
-   [Azure Monitor diagnostic](api-management-howto-use-azure-monitor.md) configuration.
-   [Protocols and ciphers](api-management-howto-manage-protocols-ciphers.md) settings.
-   [Developer portal](developer-portal-faq.md#is-the-portals-content-saved-with-the-backuprestore-functionality-in-api-management) content.

The frequency with which you perform service backups affects your recovery point objective. To minimize it, we recommend implementing regular backups and performing on-demand backups after you make changes to your API Management service.

## Next steps

Check out the following related resources for the backup/restore process:

-   [Automating API Management Backup and Restore with Logic Apps](https://github.com/Azure/api-management-samples/tree/master/tutorials/automating-apim-backup-restore-with-logic-apps)
- [How to move Azure API Management across regions](api-management-howto-migrate.md)
- API Management **Premium** tier also supports [zone redundancy](../reliability/migrate-api-mgt.md), which provides resiliency and high availability to a service instance in a specific Azure region (location).

[backup an api management service]: #step1
[restore an api management service]: #step2
[azure api management rest api]: /rest/api/apimanagement/apimanagementrest/api-management-rest
[api-management-add-aad-application]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-add-aad-application.png
[api-management-aad-permissions]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-aad-permissions.png
[api-management-aad-permissions-add]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-aad-permissions-add.png
[api-management-aad-delegated-permissions]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-aad-delegated-permissions.png
[api-management-aad-default-directory]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-aad-default-directory.png
[api-management-aad-resources]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-aad-resources.png
[api-management-arm-token]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-arm-token.png
[api-management-endpoint]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-endpoint.png
[control-plane-ip-address]: virtual-network-reference.md#control-plane-ip-addresses
[azure-storage-ip-firewall]: ../storage/common/storage-network-security.md#grant-access-from-an-internet-ip-range
