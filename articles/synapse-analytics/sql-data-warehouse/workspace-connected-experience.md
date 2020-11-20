---
title: Synapse workspace for dedicated SQL pool (formerly SQL DW) 
description: This document describes how a customer can access and use their existing SQL DW standalone instance in the Workspace.   
services: synapse-analytics
author: antvgski
manager: igorstan
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: dedicated SQL pool (formerly SQL DW) 
ms.date: 11/11/2020
ms.author: anvang
ms.reviewer: jrasnick
---

## Synapse workspace for an existing dedicated SQL pool (formerly SQL DW).

All SQL data warehouse customers can now access and use an existing dedicated SQL pool (formerly SQL DW) instance via the Synapse Studio and Workspace, without impacting automation, connections or tooling. This article explains how an existing Azure Synapse Analytics customer can build on and expand their existing Analytics solution by taking advantage of the new feature rich capabilities now available via the Synapse workspace and Studio.   

## Experience 
Now that Synapse workspace is GA a new capability is available in the DW Portal overview blade that allows you to create a Synapse workspace for your existing dedicated SQL pool (formerly SQL DW) instances. This new capability will allow you to connect the logical server hosts your existing data warehouse instances to a new Synapse workspace. The connection ensures that all of the data warehouses hosted on that server are made accessible from the Workspace and STudio and can be used in conjunction with the Synapse partner services (SQL Serverless, SPARK and ADF). You can begin accessing and using your resources as soon as the provisioning steps have been completed and the connection has been established to the newly created workspace.  
:::image type="content" source="media/workspace-connected-overview/workspace-connected-dw-portal-overview-pre-create.png" alt-text="Connected Synapse workspace":::

## Differences between a Standard Synapse and a connected workspace
The main difference between a standard 

All SQL resources will remain hosted on the logical server but access to those resource will then be possible via the workspace. 
All management functions can be initiated from the new workspace or Studio against the connected logical server.
Fully backwards compatible with no breaking changes

## Resource move
To ensure that the connection between a dedicated SQL pool (formerly SQL DW) host logical server and the Synapse workspace is retained. it is recommended that both resources remain within the same Subscription and Resource group. 

## Monitoring
 
## Studio
--- Link to Piero's doc https://docs.microsoft.com/en-us/azure/synapse-analytics/get-started that will describe how to manage the dw in the studio 

 





Overview
Architecture 
Concepts 
    VNET
    Security
    Connection
    Querying
Partner services
    Spark
    OD
    ADF
Learn more/Next steps links

## Next steps

- [Learn more]