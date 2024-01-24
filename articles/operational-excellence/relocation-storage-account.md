---
title: Relocation guidance for Azure Storage Account
description: Learn how to relocate Azure Storage Account to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/17/2024
ms.service: azure-storage
ms.topic: how-to
ms.custom:
  - subject-relocation
---


# Relocation guidance for Azure Storage Account

This article covers relocation guidance for Azure Storage Account across regions.

To relocate Azure Storage account to a new region, you can choose to [redeploy without data migration](#redeploy-without-data) or [redeploy with data migration](#redeploy-with-data-migration) strategies.

**Azure Resource Mover** doesn't support moving Azure Storage accounts. To see which resources Resource Mover supports, see [What resources can I move across regions?](/azure/resource-mover/overview#what-resources-can-i-move-across-regions).

## Redeploy without data

If your Azure Storage Account instance doesn't have any client specific data and the instance itself needs to be moved alone, you can choose to redeploy without data migration. A simple redeployment without data is also your best option for [Azure Queues](/azure/storage/queues/storage-queues-introduction), as no data migration is required for a service that only supports live messaging transactions.

**To redeploy your Storage Account instance without data:**

1. Redeploy the Storage Account instance by using [Bicep, ARM Template, or Terraform](/azure/templates/microsoft.storage/storageaccounts?tabs=json&pivots=deployment-language-arm-template).

1. Depending on your Storage Account deployment, the following dependent resources may need to be deployed and configured in the target region *prior* to relocation:
    - [Virtual Network, Network Security Groups, and User Defined Route](./relocation-virtual-network.md)
    - [Azure Key Vault](./relocation-key-vault.md)
    - [Azure Automation](./relocation-automation.md)
    - [Public IP](/azure/virtual-network/move-across-regions-publicip-portal)
    - [Azure Private Link](./relocation-private-link.md)
    
    To view the available configuration templates, see [the complete Azure Template library](/azure/templates/).

## Redeploy with data migration

To redeploy your storage account with data, you can choose between the following tools:
    
- [AzCopy](#redeploy-using-azcopy) supports Blob and File storage accounts only.
- [Azure Data Factory](#redeploy-using-azure-data-factory) supports all storage types.
- [Azure portal](/azure/storage/common/storage-account-move?tabs=azure-portal)

### Prerequisites

- Identify all Azure Storage Account dependant resources.
- Confirm that all services and features that are used by Azure Storage Account are supported in the target region.
- For preview features, confirm that your subscription is supported in the target region.
- Capture the below list of internal resources/settings of the Storage Account instance.
    - Lifecycle management policies
    - Static websites
    - Event subscriptions
    - Alerts
    - Content Delivery Network (CDN)
- Confirm that the Storage Account instance is deployed in [one of the paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions) with Geo-redundant storage (GRS) or Read-Access Geo-Redundant Storage (RA-GRS) support.
- Depending on your Storage Account deployment, the following dependent resources may need to be deployed and configured in the target region *prior* to relocation:
    - [Virtual Network, Network Security Groups, and User Defined Route](./relocation-virtual-network.md)
    - [Azure Key Vault](./relocation-key-vault.md)
    - [Azure Automation](./relocation-automation.md)
    - [Public IP](/azure/virtual-network/move-across-regions-publicip-portal)
    - [Azure Private Link](./relocation-private-link.md)

    >[!IMPORTANT]
    >If the Storage Account instance is operating in a production layer of a landing zone, such as hosting a static website or CDN, then you must reevaluate dependent resources as per configured resources like Traffic Manager.
- Choose which relocation tool you wish to use:
    - [AzCopy](#redeploy-using-azcopy) supports Blob and File storage accounts only.
    - [Azure Data Factory](#redeploy-using-azure-data-factory) supports all storage types.
    - [Azure portal](/azure/storage/common/storage-account-move?tabs=azure-portal)
    

### Redeploy using AzCopy

AzCopy only supports the following storage types:

| Storage type	| Currently supported method of authorization |
|---------------|---------------------------------------------|
|Blob storage|	Microsoft Entra ID & shared access signature (SAS)|
|Blob storage (hierarchical namespace)	|Microsoft Entra ID & SAS|
|File storage|	SAS only|


>[!NOTE]
>Multiple number of parallel operations in a low-bandwidth environment can increase load on the network connection and prevent the operations from fully completion. Make sure to throttle parallel operations based on actual available network bandwidth.

1. [Export the source Storage Account template](/azure/azure-resource-manager/templates/export-template-portal). 

1. Reconfigure the template parameters for the target, such as Storage Account name, replication type, SKU, target location etc.

1. [Generate an SAS](/azure/storage/blobs/sas-service-create-dotnet) to connect to azure blob storage.

1. Use [AZCopy](/azure/storage/common/storage-use-azcopy-v10) to migrate the data.

    - For Blob storage relocation, run:

    ```
        # cp switch will copy the data
        azcopy cp "https://[srcaccount].blob.core.windows.net?[SAS]" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive
        
        # sync switch will copy the data in case data is not already copied/missing.
        azcopy sync "https://[srcaccount].blob.core.windows.net?[SAS]" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive
    ```

    - For File share relocation, run:

    ```
        # cp switch will copy the data
        azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' --preserve-smb-permissions=true --preserve-smb-info=true
        # sync switch will copy the data in case data is not already copied/missing.
        azcopy sync 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' --preserve-smb-permissions=true --preserve-smb-info=true
    
    ```
    >[!IMPORTANT]
    >To copy the File share along with current NTFS permissions, add the `--preserver-smb-permissions=true` switch.
1. Once the relocation completes, reconfigure the following associated settings that were copied from the source account.
    
    - Network firewall reconfiguration
    - Lifecycle management rules
    - Validate the configuration of the storage account like Secure transfer required, Allow Blob public access, Allow storage account key access etc.
    - Diagnostic settings reconfiguration
    - Source alert configuration.

1. If the source Storage Account is being used for one or more of the following services, you'll need to reconfigure the services on the target storage account.

    - [Static website hosting](/azure/storage/blobs/storage-blob-static-website)
    - [Azure Content Delivery Network](/azure/cdn/cdn-overview). Change the origin of existing CDN to the primary blob service endpoint (or the primary static website endpoint) of your new account.
    - [Azure Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction)


### Redeploy using Azure Data Factory

Azure Data Factory supports all Storage Account types from one region to another. 

>[!TIP]
> You can perform the steps below using a JSON automation script. The JSON can be edited and used as many times as you need.[NEED LINK](). 

**To move your storage account with Data Factory:**

1. You must secure any data store credentials that are to be used with Azure Data factory.
    
    - Store encrypted credentials in an Azure Data Factory managed store.
    - Store credentials in Azure Key Vault.

1. If using a private network connection, you must open the following ports:
    - *.core.windows.net/443
    - Required by the PowerShell encryption cmdlet/8060 (TCP)

1. [Export the source Storage Account template](/azure/azure-resource-manager/templates/export-template-portal). 

1. Reconfigure the template parameters for the target, such as Storage Account name, replication type, SKU, target location etc.

1. Deploy a new or use an existing [Azure Data Factory template](/azure/templates/microsoft.datafactory/factories?tabs=json&pivots=deployment-language-arm-template). 

1. Choose the authentication types for source and target. Azure Data Factory's support for authenticate types depends on the data type that's being migrate. Use the table below to see which authentication types are supported for each storage type.

    | Authentication type	| Azure Blob storage| 	Azure Data Lake Storage Gen2	| Azure Files share	| Azure Table storage| 
    |---------------------------| ----------------------| ---------------------| ------------------| ---------| 
    | Account key authentication| 	Yes	| Yes	| Yes| 	Yes| 
    | Shared access signature authentication	| Yes	| No	| Yes	| Yes| 
    | Service principal authentication	| Yes| 	Yes| 	No| 	No| 
    | System-assigned managed identity authentication| 	Yes| 	Yes	| No| 	No| 
    | User-assigned managed identity authentication| 	Yes	| Yes| 	No| 	No| 

1. [Define Azure Data Factory linked service pipelines and configure connectors](/azure/data-factory/concepts-linked-services?tabs=data-factory) for the migrating data.

    >[!IMPORTANT]
    >If you choose to author a pipeline in JSON, add the `encryption` property and set it to `true` in the connection string.

1. Test the linked service connections. 

1. Configure the validation of data with various file format for pre/post migration. All folders and files that share the same schema in the storage account can be segmented. 

1. Once the relocation completes, reconfigure the following associated settings that were copied from the source account.
    
    - Network firewall reconfiguration
    - Lifecycle management rules
    - Validate the configuration of the storage account like Secure transfer required, Allow Blob public access, Allow storage account key access etc.
    - Diagnostic settings reconfiguration
    - Source alert configuration.

1. If the source Storage Account is being used for one or more of the following services, you'll need to reconfigure the services on the target storage account.

    - [Static website hosting](/azure/storage/blobs/storage-blob-static-website)
    - [Azure Content Delivery Network](/azure/cdn/cdn-overview). Change the origin of existing CDN to the primary blob service endpoint (or the primary static website endpoint) of your new account.
    - [Azure Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction)

### Validate

Once the relocation is complete, the Azure Storage Account needs to be tested and validated. Below are some of the recommended guidelines.

- Run manual or automated smoke and integration tests to ensure that configurations and dependent resources have been properly linked, and that configured data is accessible.

- Test Storage Account components and integration.
