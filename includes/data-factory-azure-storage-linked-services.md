## Azure Storage Linked Service

The **Azure Storage linked service** allows you to link an Azure storage account to an Azure data factory by using the **account key**. This provides the data factory with global access to the Azure Storage. The following table provides description for JSON elements specific to Azure Storage linked service.

| Property | Description | Required |
| :-------- | :----------- | :-------- |
| type | The type property must be set to: **AzureStorage** | Yes |
| connectionString | Specify information needed to connect to Azure storage for the connectionString property. | Yes |

See the following article for steps to view/copy the account key for an Azure Storage: [View, copy, and regenerate storage access keys](../storage/storage-create-storage-account.md#view-copy-and-regenerate-storage-access-keys).

**Example:**  
  
	{  
		"name": "StorageLinkedService",  
		"properties": {  
			"type": "AzureStorage",  
			"typeProperties": {  
				"connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"  
			}  
		}  
	}  


## Azure Storage Sas Linked Service  
A shared access signature (SAS) provides delegated access to resources in your storage account. This means that you can grant a client limited permissions to objects in your storage account for a specified period of time and with a specified set of permissions, without having to share your account access keys. The SAS is a URI that encompasses in its query parameters all of the information necessary for authenticated access to a storage resource. To access storage resources with the SAS, the client only needs to pass in the SAS to the appropriate constructor or method. For detailed information about SAS, see [Shared Access Signatures: Understanding the SAS Model](../articles/storage/storage-dotnet-shared-access-signature-part-1.md)
  
The Azure Storage SAS linked service allows you to link an Azure Storage Account to an Azure data factory by using a Shared Access Signature (SAS). This provides the data factory with restricted/time-bound access to all/specific resources (blob/container) in the storage. The following table provides description for JSON elements specific to Azure Storage SAS linked service. 

| Property | Description | Required |
| :-------- | :----------- | :-------- |
| type | The type property must be set to: **AzureStorageSas**  | Yes |
| sasUri | Specify Shared Access Signature URI to the Azure Storage resources such as blob, container, or table. See the notes below for details. | Yes | 


**Example:**
  
	{  
		"name": "StorageSasLinkedService",  
		"properties": {  
			"type": "AzureStorageSas",  
			"typeProperties": {  
				"sasUri": "<storageUri>?<sasToken>"   
			}  
		}  
	}  

When creating an **SAS URI**, considering the following:  

- Azure Data Factory supports only **Service SAS**, not Account SAS. See [Types of Shared Access Signatures](../articles/storage/storage-dotnet-shared-access-signature-part-1.md#types-of-shared-access-signatures) for details about these two types.
- Appropriate read/write **permissions** need to be set on objects based on how the linked service (read, write, read/write) will be used in your data factory.
- **Expiry time** needs to be set appropriately. Make sure that the access to Azure Storage objects does not expire within the active period of the pipeline.
- Uri should be created at the right container/blob or Table level based on the need. A SAS Uri to an Azure blob allows the Data Factory service to access that particular blob. A SAS Uri to an Azure blob container allows the Data Factory service to iterate through blobs in that container. If you need to provide access more/fewer objects later, or update the SAS URI, remember to update the linked service with the new URI.   
