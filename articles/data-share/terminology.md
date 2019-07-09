---
title: Azure Data Share Preview Terminology 
description: Azure Data Share Preview Terminology
author: joannapea

ms.service: data-share
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: joanpo
---
# Azure Data Share Preview Concepts 

Azure Data Share Preview introduces some new terminology related to data sharing. This article explains some frequently used terms that you may see used throughout the service. 

## Data Provider

A Data Provider is the organization that is sharing data with their consumers. Typically the data provider can be an owner or a curator of the data. Data providers want to share data of various types. Some examples of data that a data provider may want to share include raw data, such as point of sales or time series data. A data provider may also want to share pre-processed, curated data that already contains analytics and insights. 

## Data Consumer 

A Data Consumer is the organization that is receiving data from a data provider. The data consumer may be wanting to join the shared data with their own data to derive insights. In some cases, the data consumer may be receiving data that has already been processed. 

## Data Share

A data share is a group of datasets that are shared as a single entity. Datasets can be from a number of Azure data sources that are supported by Azure Data Share. Currently, Azure Data Share supports Azure Blob Storage and Azure Data Lake Store. 

## Share Subscription 

A Share Subscription is created when a data consumer accepts a data share invitation from a data provider. Data providers can view active share subscriptions by navigating to **Sent Shares** in their Azure Data Share account, and selecting **Share Subscriptions**.

A data consumer can check if they have an active share subscription by navigating to **Received Shares** and viewing the status of their received shares. 

## Snapshot

A snapshot can be created by a data consumer when they accept a data share invitation. When they accept an invitation, they can trigger a full snapshot of the data shared with them. The snapshot is a copy of the data at the point in time that the data consumer generated the snapshot. 

There are two types of snapshots - full and incremental. A full snapshot contains all the data within the data share. An incremental snapshot contains all the data that has been updated/added since the last snapshot was triggered. 

## Snapshot settings in Azure Data Share
 
A data provider can enable a snapshot setting for a data share. This setting enables data consumers to receive incremental updates as they occur. This setting should be enabled if the data provider would like their data consumers to receive  updates to data that has been shared. 

If a data provider enables this setting, a recurrence interval can be selected. The recurrence interval can be hourly or daily. 

A data consumer has the option to opt-in to this snapshot schedule to receive incremental updates, which includes any data that has changed since they first generated a new snapshot. 

## Invitation

A data provider can invite multiple recipients to their data share. They can do so by adding recipients to the data share. Invitations can also be added after a data share has been created. 

A data provider can delete an invitation after it has been sent. Note that if a data provider deletes an invitation after it has been accepted, the data consumer can still have an active share subscription. If the data provider deletes an invitation and it has not yet been accepted, the data consumer will not be able to accept it. 

## Recipient

A recipient is someone that receives an invitation to a data share. Typically, a data provider will add recipients to data share that they create. Once the recipient of an invitation accepts the invitation, they become a data consumer.  

## Next steps

To learn how to start sharing data, continue to the [share your data](share-your-data.md) tutorial.

