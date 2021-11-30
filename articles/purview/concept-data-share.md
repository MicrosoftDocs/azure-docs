---
title: Data Share in Azure Purview
description: Describes the concepts for data share. 
author: jifems
ms.author: jife
ms.service: purview
ms.topic: conceptual
ms.date: 11/05/2021
---

# Understand Purview Data share (preview)

This article provides an overview of the Data Share feature in Azure Purview. 

In today's digital world, organizations have increasing needs to make data accessible to drive business decisions. Seamlessly sharing data for inter-departmental and inter-organizational collaboration can unlock tremendous competitive advantage. Traditionally, data is shared via FTP or API, which are often expensive to provision and maintain. Other adhoc data sharing methods such as e-mail or USBs are hard to scale and keep track of. 

Purview Data Share enables organizations to easily and securely share data both within the organization or cross organizations with business partners and customers. You can share or receive data with just a few clicks. Data providers can centrally manage and monitor data sharing relationships, and revoke sharing at any time. Data consumers can access received data with their own analytics tools and turn data into insights within minutes.

## Data sharing scenarios

Purview Data Share can help with a variety of data sharing scenarios, including:

* Collaborate with external partners across supply chain to optimize operational efficiency, improve agility and customer satisfaction 
* Outsource data transformation and processing to third party ISVs or data aggregators by sharing raw data and receiving normalized data and analytics results back
* Automate sharing of big data (e.g. IoT data, scientific data, satellite and surveillance images or videos, financial market data) in near real time and without data duplication. 
* Share data between different departments within the organization to improve data-driven decisions  


## How data share works

Purview Data Share currently supports sharing of files and folders in-place from Azure Data Lake Storage Gen2 (ADLS Gen2) and Blob storage accounts. A data provider creates a share by specifying what data to share, who to share them with (one or more data consumers), and the terms of use for accessing shared data. Azure Purview sends an invitation to each data consumer, who accepts the invitation and specifies the target storage account in their own Azure subscription to access the shared data. This establishes a sharing relationship between the provider and consumer storage accounts. This sharing relationship provides data consumer read-only access to shared data through the consumer target storage account. Any change to the data in the provider source storage account is reflected in near real-time in the consumer target storage account. The data provider pays for data storage, while the data consumer pays for their own data access transactions and compute.  Provider and consumer storage accounts must be in the same Azure region. Data can be shared from ADLS Gen2 to ADLS Gen2, and Blob to Blob storage accounts.

<br/>

<img src="./media/concept-data-share/data-share-flow.png" alt="Data share flow" width=500/>

## Key capabilities

Purview Data Share enables data providers to:

* Share data within the organization or with partners and customers outside of the organization
* Share data from a list of [supported data stores](purview-connector-overview.md) 
* Share data in-place without data duplication
* Share data with multiple recipients
* Associate terms of use with the shared data
* Centrally manage sharing relationships and keep track of what data is shared with who

Purview Data Share enables data consumers to: 

* Receive an invitation to share data
* View description and terms of use for the shared data  
* Accept or reject a share
* Accept shared data into a [supported data stores](purview-connector-overview.md)
* Access shared data in near real time

All key capabilities listed above are supported through the Purview Studio or via REST APIs. For more details on using Azure Data Share through REST APIs, check out our reference documentation. 

## Supported regions

Purview Data Share feature supports sharing data from ADLS Gen2 and Blob storage accounts. It is currently available in the following Azure regions.

* Purview accounts in East US 2, Canada Central, West Europe, UK South, and Australia East
* ADLS Gen2 and Blob Storage accounts in Canada Central, Canada East, UK South, UK West, Australia East, Australia Southeast, Japan East, Korea South, and South Africa North 

Purview Data Share only stores metadata about your share. It does not store a copy of the shared data itself. The data is stored in the underlying data store that is being shared. You can have your data stored in a different Azure region than your Purview account. For example, you can have your Purview account located in East US 2 and your storage account which stores the data located in South Africa North.

## Get started

Get started with Purview Data Share by following the [Data Share Quick Start](quickstart-data-share.md) to share and receive data stored in Azure Data Lake Storage Gen2 or Blob Storage.

## Additional resources
* [How to Share Data](how-to-share-data.md)
* [How to Receive Shared Data](how-to-receive-share.md)