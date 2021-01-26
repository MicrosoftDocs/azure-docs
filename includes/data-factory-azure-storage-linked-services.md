---
author: linda33wj
ms.service: data-factory
ms.topic: include
ms.date: 11/09/2018
ms.author: jingwang
---
### Azure Storage Linked Service
The **Azure Storage linked service** allows you to link an Azure storage account to an Azure data factory by using the **account key**, which provides the data factory with global access to the Azure Storage. The following table provides description for JSON elements specific to Azure Storage linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **AzureStorage** |Yes |
| connectionString |Specify information needed to connect to Azure storage for the connectionString property. |Yes |

For information about how to retrieve the storage account access keys, see [Manage storage account access keys](../articles/storage/common/storage-account-keys-manage.md).

**Example:**  

```json
{
    "name": "StorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
        }
    }
}
```

### Azure Storage Sas Linked Service
A shared access signature (SAS) provides delegated access to resources in your storage account. It allows you to grant a client limited permissions to objects in your storage account for a specified period of time and with a specified set of permissions, without having to share your account access keys. The SAS is a URI that encompasses in its query parameters all the information necessary for authenticated access to a storage resource. To access storage resources with the SAS, the client only needs to pass in the SAS to the appropriate constructor or method. For more information about SAS, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../articles/storage/common/storage-sas-overview.md).

> [!IMPORTANT]
> Azure Data Factory now only supports **Service SAS** but not Account SAS. Note the SAS URL generable from Azure portal or Storage Explorer is an Account SAS, which is not supported.

> [!TIP]
> You can execute below PowerShell commands to generate a Service SAS for your storage account (replace the place-holders and grant the needed permission):
> `$context = New-AzStorageContext -StorageAccountName <accountName> -StorageAccountKey <accountKey>`
> `New-AzStorageContainerSASToken -Name <containerName> -Context $context -Permission rwdl -StartTime <startTime> -ExpiryTime <endTime> -FullUri`

The Azure Storage SAS linked service allows you to link an Azure Storage Account to an Azure data factory by using a Shared Access Signature (SAS). It provides the data factory with restricted/time-bound access to all/specific resources (blob/container) in the storage. The following table provides description for JSON elements specific to Azure Storage SAS linked service. 

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **AzureStorageSas** |Yes |
| sasUri |Specify Shared Access Signature URI to the Azure Storage resources such as blob, container, or table.  |Yes |

**Example:**

```json
{
    "name": "StorageSasLinkedService",
    "properties": {
        "type": "AzureStorageSas",
        "typeProperties": {
            "sasUri": "<Specify SAS URI of the Azure Storage resource>"
        }
    }
}
```

When creating an **SAS URI**, considering the following:  

* Set appropriate read/write **permissions** on objects based on how the linked service (read, write, read/write) is used in your data factory.
* Set **Expiry time** appropriately. Make sure that the access to Azure Storage objects does not expire within the active period of the pipeline.
* Uri should be created at the right container/blob or Table level based on the need. A SAS Uri to an Azure blob allows the Data Factory service to access that particular blob. A SAS Uri to an Azure blob container allows the Data Factory service to iterate through blobs in that container. If you need to provide access more/fewer objects later, or update the SAS URI, remember to update the linked service with the new URI.   

