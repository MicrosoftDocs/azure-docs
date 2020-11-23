---
title: Synapse workspace for dedicated SQL pool (formerly SQL DW) 
description: This document describes how a customer can access and use their existing SQL DW standalone instance in the Workspace.   
services: synapse-analytics
author: antvgski
manager: igorstan
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql-dw
ms.date: 11/11/2020
ms.author: anvang
ms.reviewer: jrasnick
---

# Synapse workspace for an existing dedicated SQL pool (formerly SQL DW)
All SQL data warehouse customers can now access and use an existing dedicated SQL pool (formerly SQL DW) instance via the Synapse Studio and Workspace, without impacting automation, connections or tooling. This article explains how an existing Azure Synapse Analytics customer can build on and expand their existing Analytics solution by taking advantage of the new feature rich capabilities now available via the Synapse workspace and Studio.   

## Experience 
Now that Synapse workspace is GA a new capability is available in the DW Portal overview blade that allows you to create a Synapse workspace for your existing dedicated SQL pool (formerly SQL DW) instances. This new capability will allow you to connect the logical server that hosts your existing data warehouse instances to a new Synapse workspace. The connection ensures that all of the data warehouses hosted on that server are made accessible from the Workspace and Studio and can be used in conjunction with the Synapse partner services (SQL Serverless, SPARK and ADF). You can begin accessing and using your resources as soon as the provisioning steps have been completed and the connection has been established to the newly created workspace.  
:::image type="content" source="media/workspace-connected-overview/workspace-connected-dw-portal-overview-pre-create.png" alt-text="Connected Synapse workspace":::

## Using Synapse workspace and Studio to access an existing dedicated SQL pool 
When you're using a SQL DW in a workspace then the following applies 
- **SQL resources** All SQL resources will remain hosted on the logical server but access to those resource will then be possible via the workspace and server. 
- **Management operations** All management functions can be initiated from the new workspace or Studio against the connected logical server.
- **Resource move**  Initiating a resource move on a Server connected to a Synapse workspace will cause the link to be broken and you will no longer be able to access your existing dedicated SQL pool (formerly SQL DW) instances. To ensure that the connection between a dedicated SQL pool (formerly SQL DW) host logical server and the Synapse workspace is retained. it is recommended that both resources remain within the same Subscription and Resource group. 
- **Monitoring** Monitoring of all dedicated SQL pool (formerly SQL DW) resources is via the currently currently available dedicated SQL pool (formerly SQL DW) portal. 
- **Access controls**
- **Network security**
- **Studio** SQL pools in the **Data** hub **Object explorer** can be identified as Dedicated SQL pool (formerly SQL DW) instances via the **tool tip**. The tool tip will provide the standard Server  

   
> [!NOTE]
> You should continue to use your normal Azure Resource Management APIs to manage your existing dedicated SQL pool (formerly SQL DW) instances. 

## Next steps

- [Learn more]