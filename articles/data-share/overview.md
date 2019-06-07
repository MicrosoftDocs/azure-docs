---
title: What is Azure Data Share
description: An overview of Azure Data Share
author: joannapea

ms.service: data-share
ms.topic: overview
ms.date: 07/10/2019
ms.author: joanpo
---
# What is Azure Data Share?

Azure Data Share enables you to easily and securely share your data with your customers and partners outside of your organization in a governed way. It provides a single pane of glass for you to manage data sharing relationships with your customers and partners. 

Azure Data Share enables you to share data through Snapshot-based sharing, which provides incremental updates to the data consumers tenant. In this scenario, data consumers will see the data within their own tenant. Easily connect your data to the rich set of Azure analytics tools such as HDInsight or Databricks for processing and insights. 

When creating a new data share, data providers can specify terms of use that the data consumer needs to agree to before accessing the data. 

Data is shared by adding Azure Data sources into data shares. A Data Share can then be shared with multiple recipients outside of your organization. Once those recipients accept your invitation for sharing data, they become your data consumers. 

## Key capabilities

Azure Data Share enables Data Providers to:

* Share data from Azure Storage, Azure Data Lake Gen1 & Azure Data Lake Gen2 with customers and partners outside of your organization

* Keep track of who you have shared your data with

* How frequently your data consumers are receiving updates to your data

* Allow your customers to pull the latest version of your data as needed, or allow them to automatically receive incremental changes to your data at an interval defined by you

Azure Data Share enables Data Consumers to: 

* View a description of the type of data being shared

* View terms of use for the data

* Accept or reject an Azure Data Share invitation

* Trigger a full or incremental snapshot of a Data Share that an organization has shared with you

* Subscribe to a Data Share to receive the latest copy of the data through incremental snapshot copy

* Accept data shared with you into an Azure Blob Storage or Azure Data Lake Gen2 account

All key capabilities listed above are supported through the Azure or via REST APIs. For more details on using Azure Data Share through REST APIs, check out our reference documentation. 

    ![Supported Scenarios](./media/supported-scenarios.png "Supported Scenarios")

