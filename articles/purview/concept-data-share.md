---
title: Data Share in Microsoft Purview
description: Describes the concepts for data share. 
author: jifems
ms.author: jife
ms.service: purview
ms.topic: conceptual
ms.date: 05/10/2022
---

# Understand Microsoft Purview Data Sharing (preview)

This article provides an overview of the data sharing feature in Microsoft Purview. 

In today's digital world, organizations have increasing needs to make data accessible to drive business decisions. Seamlessly sharing data for inter-departmental and inter-organizational collaboration can unlock tremendous competitive advantage. Traditionally, data is shared via FTP or API, which are often expensive to provision and maintain. Other adhoc data sharing methods such as e-mail or USBs are hard to scale and keep track of. 

Microsoft Purview Data Sharing enables organizations to easily and securely share data both within the organization or cross organizations with business partners and customers. You can share or receive data with just a few clicks. Data providers can centrally manage and monitor data sharing relationships, and revoke sharing at any time. Data consumers can access received data with their own analytics tools and turn data into insights within minutes.

## Data sharing scenarios

Microsoft Purview Data Sharing can help with a variety of data sharing scenarios, including:

* Collaborate with external partners across supply chain to optimize operational efficiency, improve agility and customer satisfaction 
* Outsource data transformation and processing to third party ISVs or data aggregators by sharing raw data and receiving normalized data and analytics results back
* Automate sharing of big data (e.g. IoT data, scientific data, satellite and surveillance images or videos, financial market data) in near real time and without data duplication. 
* Share data between different departments within the organization to improve data-driven decisions  


## How data sharing works

Microsoft Purview Data Sharing currently supports sharing of files and folders in-place from Azure Data Lake Storage Gen2 (ADLS Gen2) and Blob storage accounts. A data provider creates a share by specifying what data to share and who to share them with (one or more data consumers). Purview sends an invitation to each data consumer, who accepts the invitation and specifies the target storage account in their own Azure subscription to access the shared data. This establishes a sharing relationship between the provider and consumer storage accounts. This sharing relationship provides data consumer read-only access to shared data through the consumer target storage account. Any change to the data in the provider source storage account is reflected in near real-time in the consumer target storage account. The data provider pays for data storage, while the data consumer pays for their own data access transactions and compute.  Provider and consumer storage accounts must be in the same Azure region. Data can be shared from ADLS Gen2 to ADLS Gen2, and Blob to Blob storage accounts.

<br/>

<img src="./media/concept-data-share/data-share-flow.png" alt="Data share flow" width=500/>

## Key capabilities

Microsoft Purview Data Sharing enables data providers to:

* Share data within the organization or with partners and customers outside of the organization
* Share data from a list of [supported data stores](purview-connector-overview.md) 
* Share data in-place without data duplication
* Share data with multiple recipients
* Centrally manage sharing relationships and keep track of what data is shared with who

Microsoft Purview Data Sharing enables data consumers to: 

* Receive an invitation to share data
* View description of the shared data  
* Accept or reject a share
* Accept shared data into [supported data stores](purview-connector-overview.md)
* Access shared data in near real time

All key capabilities listed above are supported through the Microsoft Purview governance portal or via REST APIs. For more details on using data sharing through REST APIs, check out our reference documentation. 

## Where data is stored

Microsoft Purview Data Sharing only stores metadata about your share. It does not store a copy of the shared data itself. The data is stored in the underlying data store that is being shared. You can have your data stored in a different Azure region than your Purview account. For example, you can have your Purview account located in East US 2 and your storage account which stores the data located in UK South.

## Get started

Get started with Microsoft Purview Data Sharing by following the [Data Share Quick Start](quickstart-data-share.md) to share and receive data stored in Azure Data Lake Storage Gen2 or Blob Storage.

## Additional resources
* [FAQ for Data Share](how-to-data-share-faq.md)
* [How to Share Data](how-to-share-data.md)
* [How to Receive Shared Data](how-to-receive-share.md)