---
title: Concept - Data Share Terminology 
description: What is a Share Subscription in Azure Data Share
author: joannapea

ms.service: azure-data-share
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: joanpo
---
# Azure Data Share Terminology 

Azure Data Share introduces some new concepts related to data sharing. This article explains some commonly used terminology for Azure Data Share. 

## Data Provider

A Data Provider is the entity that is sharing data with their consumers. 

## Data Consumer 

A Data Consumer is the entity that is receiving data from a Data Provider. 

## Data Share

A Data Share is a container that groups datasets. Datasets can be from a number of Azure Data sources that are supported by Azure Data Share. 

## Share Subscription 

A Share Subscription is created when a data consumer accepts a data share invitation from a data provider. Data providers can view active share subscriptions by navigating to **Sent Shares** in their Azure Data Share account, and selecting **Share Subscriptions**.

## Snapshot

A snapshot can be created by a data consumer when they accept a data share invitation. When they accept, they can trigger a full or incremental snapshot of the data shared with them. The snapshot is a copy of the data at the point in time that the data consumer generated the snapshot. 

There are two types of snapshots - full and incremental. A full snapshot contains all the data within the data share. An incremental snapshot contains all the data that has been updated/added since the last snapshot was triggered. 

## Synchronization Settings in Azure Data Share
 
A synchronization setting refers to the frequency that a snapshot is triggered. A synchronization setting may be triggered hourly or daily. 


## Invitation

An invitation from a Data Provider to a potential recipient of an Azure Data Share.

## Recipient

A recipient is someone that receives an invitation to a data share. Typically, a data provider will add recipients to data share that they create. Once the recipient of an invitation accepts the invitation, they become a data consumer.  



