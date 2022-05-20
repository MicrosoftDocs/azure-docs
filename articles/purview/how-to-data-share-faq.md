---
title: Data sharing FAQ
description: Microsoft Purview Data Share frequently asked questions
author: jifems
ms.author: jife
ms.service: purview
ms.topic: how-to
ms.date: 05/20/2022
---
# FAQ: Azure Storage in-place data share with Microsoft Purview Data Sharing (preview)

Here are some frequently asked questions for Microsoft Purview Data Sharing. 

## What are the key terms related to data sharing?

* **Data Provider** - Organization which shares data. 
* **Data Consumer** - Organization which receives shared data from a data provider.
* **Share** - A share is a set of data that can be shared from provider to consumer. It is a set of assets. You can have one asset with files/folders from one storage account, and another asset with files/folders from a different storage account
* **Collection** - A [collection](catalog-permissions.md) is a tool Microsoft Purview uses to group assets, sources, shares, and other artifacts into a hierarchy for discoverability and to manage access control. A root collection is created automatically when you create your Microsoft Purview account and you are granted all the roles to the root collection. You can leverage the root collection (default) or create child collections for data sharing.
* **Asset**	- For storage in-place sharing, an asset is a storage account. You can specify a list of files and folders you want to share from the storage account.
* **Recipient**	A recipient is a user or service principal to which the share is sent to. 

##	Can I use API or SDK for storage in-place sharing?
Yes, you can use [REST API](/rest/api/purview/) or [.NET SDK](/dotnet/api/overview/azure/purviewresourceprovider/) for programmatic experience to share data. 

##	What are the roles and permissions required to share data or receive shares?

| **Operations** | **Roles and Permissions** |
|---|---|
|**Data provider**: create share, add asset and recipients, revoke access | **Microsoft Purview collection role**: Data Share Contributor |
| |**Storage account role** checked when adding and updating asset: Owner or Storage Blob Data Owner |
| |**Storage account permissions** checked when adding and updating asset: Microsoft.Authorization/roleAssignments/write OR Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/|
|**Data consumer**: Receive share, map asset, terminate share |**Microsoft Purview collection role**: Data Share Contributor |
| |**Storage account role** checked when mapping asset: Contributor OR Owner OR Storage Blob Data Contributor OR Storage Blob Data Owner |
| |**Storage account permissions** checked when mapping asset: Microsoft.Storage/storageAccounts/write OR Microsoft.Storage/storageAccounts/blobServices/containers/write|	
|**Data consumer**: Access shared data| No share-specific role required. You can access shared data with regular storage account permission just like any other data. Data consumer's ability to apply ACLs for shared data is currently not supported.|

##	How can I share data from containers?
To share data from a container, select all files and folders within a container. 

##	Can I share data in-place with storage account in a different Azure region?
Cross-region in-place data sharing is not currently supported for storage account. Data provider and data consumer's storage accounts need to be in the same Azure region.

##	Is there support for read-write shares?
Storage in-place sharing supports read-only shares. Data consumer cannot write to the shared data. 

To share data back to the data provider, data consumer can create a share and share with the data provider.

## Can I access shared data from analytics tools like Azure Synapse?
Yes, you can access shared data from storage clients as well as Azure analytics tools such as Azure Synapse Analytics Spark and Databricks. You will not be able to access shared data using Azure Data Factory. 

## Does the recipient of the share need to be a user's email address or can I share data with an application?
Through the UI, you can only share data with recipient's Azure login email. 

Through API and SDK, you also send invitation to object ID of a user principal or service principal. In addition, you can optionally specify a tenant ID for which you want the share to be received into.  

## Is the recipient accepting the share only for itself?
When the recipient accepts the share and maps asset to a target storage account, any user or application that has access to the target storage account will be able to access shared data.

## If the recipient leaves the organization, what happens to the received share?
Once the received share is accepted and asset is mapped to a target storage account, any users with appropriate permissions to the target storage account can continue to access the shared data even after the recipient has left the organization.

Once the received share is accepted, any user with Data Share Contributor permission to the Microsoft Purview collection which the share is received into can view and update the received share.

## How do I request an increase in limits for the number of shares?
Data provider's source storage account can support up to 20 targets, and data consumer's target storage account can support up to 100 sources. To request a limit increase, please contact support.

## How do I troubleshoot data sharing issues?
To troubleshoot issues with sharing data, refer to the [Troubleshoot section of How to share data](how-to-share-data.md#troubleshoot). To troubleshoot issues with receiving share, refer to the [Troubleshoot section of How to receive share](how-to-receive-share.md#troubleshoot).

## Next steps
* [Data Sharing Quickstart](quickstart-data-share.md)
* [How to Share Sata](how-to-share-data.md)
* [How to Receive Share](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
