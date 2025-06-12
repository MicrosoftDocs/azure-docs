---  
title: Sentinel data lake permissions
titleSuffix: Microsoft Security  
description: This article describes the permissions required to access the Microsoft Sentinel data lake, ad how to manage those permissions
author: EdB-MSFT  
ms.topic: conceptual
ms.service: microsoft-sentinel
ms.date: 06/04/2025
ms.author: edbaynash  

# Customer intent: As a security engineer andministrator, I want to know hwhich permissions are required to access the Sentinel data lake and how to administer those permissions.

---

# Microsoft Sentinel data lake permissions

This article describes the permissions required to access the Microsoft Sentinel data lake, and how to manage those permissions.

## Read permissions

You can query data and run jobs in the Lake based on your Entra ID roles and permissions.

> [!NOTE]
> "Workspace” in this article refers to a log analytics workspace that is attached to Microsoft Defender and onboarded to Microsoft Sentinel Data Lake.  Learn more about onboarding and attaching workspaces to Defender.

To read tables across the data lake in interactive notebook queries, you will need any of the following roles in Microsoft Entra ID:
+ Global reader 
+ Security reader
+ Security operator 
+ Security administrator
+ Global administrator

Alternatively, you may have access to interactive queries for specific workspaces rather than across the entire data lake. If you have the following permissions on the workspace, you will be able to read the tables within that workspace via interactive queries:
+ Microsoft.operationalinsights/workspaces/read
+ Microsoft.operationalinsights/workspaces/query/read
+ microsoft.operationalinsights/workspaces/tables/read

For providing access to interactive queries specifically against the Default Lake workspace, use Microsoft Defender XDR Unified RBAC: Provide security data basics (read) over the Microsoft Sentinel\Default Lake data collection.

### Write permissions

Write permissions are required to create, update, or delete tables in the data lake.

To write to tables to any workspace in the data lake using interactive notebook queries, you must have one of the following roles in Microsoft Entra ID:
+ Security operator 
+ Security administrator
+ Global administrator

Alternatively, you can have the ability to write output to a specific workspace. If you have the following permissions on the workspace, you will be able to create, update, and delete tables within that workspace:
•	Microsoft.operationalinsights/workspaces/write
•	microsoft.operationalinsights/workspaces/tables/write

### Jobs and scheduling

Jobs are used to schedule queries to run at a specific time or on a recurring basis. To create and manage jobs, you will need the following permissions:

To create and schedule a job, you must have one of the following Microsoft Entra roles: 
+ Security operator 
+ Security administrator
+ Global administrator


## Managing Permissions

To manage permissions for the Microsoft Sentinel data lake...