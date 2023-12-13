---
title: What is Azure Data Share?
description: Learn about sharing data simply and securely to multiple customers and partners using Azure Data Share.
author:  sidontha
ms.author: sidontha
ms.service: data-share
ms.topic: overview
ms.date: 10/26/2022
ms.custom: references_regions
---
# What is Azure Data Share?

Azure Data Share enables organizations to securely share data with multiple customers and partners. Data providers are always in control of the data that they've shared and Azure Data Share makes it simple to manage and monitor what data was shared, when and by whom.

In today's world, data is viewed as a key strategic asset that many organizations need to simply and securely share with their customers and partners. There are many ways that customers do this today, including through FTP, e-mail, APIs to name a few. Organizations can easily lose track of who they've shared their data with. Sharing data through FTP or through standing up their own API infrastructure is often expensive to provision and administer. There's management overhead associated with using these methods of sharing on a large scale. In addition to accountability, many organizations would like to be able to control, manage, and monitor all of their data sharing in a simple way that stays up to date, so they can derive timely insights.

Using Data Share, a data provider can share data and manage their shares all in one place. They can stay in control of how their data is handled by specifying terms of use for their data share. The data consumer must accept these terms before being able to receive the data. Data providers can specify the frequency at which their data consumers receive updates. Access to new updates can be revoked at any time by the data provider. 

Azure Data Share helps enhance insights by making it easy to combine data from third parties to enrich analytics and AI scenarios. Easily use the power of Azure analytics tools to prepare, process, and analyze data shared with Azure Data Share. 

Both the data provider and data consumer must have an Azure subscription to share and receive data. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).

## Scenarios for Azure Data Share

Azure Data Share can be used in many different industries. For example, a retailer may want to share recent point of sales data with their suppliers. Using Azure Data Share, a retailer can set up a data share containing point of sales data for all of their suppliers and share sales on an hourly or daily basis.

Azure Data Share can also be used to establish a data marketplace for a specific industry. For example, a government or a research institution that regularly shares anonymized data about population growth with third parties. 

Another use case for Azure Data Share is establishing a data consortium. For example, many different research institutions can share data with a single trusted body. Data is analyzed, aggregated or processed using Azure analytics tools and then shared with interested parties. 

## How it works

Azure Data Share currently offers [snapshot-based sharing](#snapshot-based-sharing) and [in-place sharing](#in-place-sharing).

![data share flow](media/data-share-flow.png)

### Snapshot-based sharing

In snapshot-based sharing, data moves from the data provider's Azure subscription and lands in the data consumer's Azure subscription. As a data provider, you provision a data share and invite recipients to the data share. Data consumers receive an invitation to your data share via e-mail. Once a data consumer accepts the invitation, they can trigger a full snapshot of the data shared with them. This data is received into the data consumers storage account. Data consumers can receive regular, incremental updates to the data shared with them so that they always have the latest version of the data. 

Data providers can offer their data consumers incremental updates to the data shared with them through a snapshot schedule. Snapshot schedules are offered on an hourly or a daily basis. When a data consumer accepts and configures their data share, they can subscribe to a snapshot schedule. This is beneficial in scenarios where the shared data is updated regularly, and the data consumer needs the most up-to-date data. 

When a data consumer accepts a data share, they're able to receive the data in a data store of their choice. For example, if the data provider shares data using Azure Blob Storage, the data consumer can receive this data in Azure Data Lake Store. Similarly, if the data provider shares data from an Azure Synapse Analytics, the data consumer can choose whether they want to receive the data into an Azure Data Lake Store, an Azure SQL Database or an Azure Synapse Analytics. If sharing from SQL-based sources, the data consumer can also choose whether they receive data in parquet or csv. 

### In-place sharing

With in-place sharing, data providers can share data where it resides without copying the data. After sharing relationship is established through the invitation flow, a symbolic link is created between the data provider's source data store and the data consumer's target data store. Data consumer can read and query the data in real time using its own data store. Changes to the source data store are available to the data consumer immediately. In-place sharing is currently available for Azure Data Explorer.

## Key capabilities

Azure Data Share enables data providers to:

* Share data from the list of [supported data stores](supported-data-stores.md) with customers and partners outside of your organization

* Keep track of who you have shared your data with

* Choice of snapshot or in-place sharing

* How frequently your data consumers are receiving updates to your data

* Allow your customers to pull the latest version of your data as needed, or allow them to automatically receive incremental changes to your data at an interval defined by you.

Azure Data Share enables data consumers to: 

* View a description of the type of data being shared

* View terms of use for the data

* Accept or reject an Azure Data Share invitation

* Accept data shared with you into a [supported data store](supported-data-stores.md).

* Access data in place or trigger a full or incremental snapshot of shared data

All key capabilities listed above are supported through the Azure portal or via REST APIs. For more details on using Azure Data Share through REST APIs, check out our reference documentation. 

## Supported regions

For a list of Azure regions that make Azure Data Share available, refer to the [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=data-share) page and search for Azure Data Share. 

For metadata stored by Azure Data Share, in Southeast Asia (Singapore), it's stored within the region and for all other supported regions, it's stored in the geo. Azure Data Share doesn't store a copy of the shared data itself. The data is stored in the underlying data store that is being shared. For example, if a data provider stores their data in an Azure Data Lake Storage account located in West US, that is where the data is stored. If they're sharing data with an Azure Storage account located in West Europe via snapshot, typically the data is transferred directly to the Azure Storage account located in West Europe. 

The Azure Data Share service doesn't have to be available in your region to use the service. For example, if you have data stored in an Azure Storage account located in a region where Azure Data Share isn't yet available, you can still use the service to share your data. 

## Next steps

To learn how to start sharing data, continue to the [share your data](share-your-data.md) tutorial.
