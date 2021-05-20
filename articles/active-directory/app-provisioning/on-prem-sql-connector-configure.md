---
title: Azure AD ECMA Connector Host generic SQL connector configuration
description: This document describes how to configure the Azure AD ECMA Connector Host generic SQL connector.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 03/09/2021
ms.author: billmath
ms.reviewer: arvinh
---
---

# Azure AD ECMA Connector Host generic SQL configuration

This document describes how to create a new SQL connector with the Azure AD ECMA Connector Host and how to configure it.  You will need to do this once you have successfully installed Azure AD ECMA Connector Host.  

Depending on the options you select, some of the wizard screens may or may not be available and the information may be slightly different.  For purposes of this configuration, the user object type is used. Use the information below to guide you in your configuration.


## Create a generic SQL connector

To create a generic SQL connector use the following steps:

 1.  Click on the ECMA Connector Host shortcut on the desktop.
 2.  Select **New Connector**.
     ![Choose new connector](.\media\on-prem-sql-connector-configure\sql-1.png)

 3. On the **Properties** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.
     ![Enter properties](.\media\on-prem-sql-connector-configure\sql-2.png)

     |Property|Description|
     |-----|-----|
     |Name|The name for this connector|
     |Autosync timer (minutes)||
     |Secret Token||
     |Description||
     |Extension DLL|For a generic sql connector, select Microsoft.IAM.Connector.GenericSql.dll.|
 4. On the **Connectivity** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.
     ![Enter connectivity](.\media\on-prem-sql-connector-configure\sql-3.png)

     |Property|Description|
     |-----|-----|
     |DSN File|The Data Source Name file used to connect to the SQL server|
     |User Name|The username of an individual with rights to the SQL server.|
     |Password|The password of the username provided above.|
     |DN is Anchor||
     |Export TypeObjectReplace||
 5. On the **Schema 1** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.
     ![Enter schema 1](.\media\on-prem-sql-connector-configure\sql-4.png)

     |Property|Description|
     |-----|-----|
     |Object type detection method||
     |Fixed value list/Table/View/SP||
     |Column Name for Table/View/SP||
     |Stored Procedure Parameters||
     |Provide SQL query for detecting object types||
 6. On the **Schema 2** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.  This schema screen maybe slightly different or have additional information depending on the object types that were selected in the previous step.
     ![Enter schema 2](.\media\on-prem-sql-connector-configure\sql-5.png)

     |Property|Description|
     |-----|-----|
     |User:Attribute Detection||
     |User:Table/View/SP||
     |User:Name of Multi-Values Table/Views||
     |User:Stored Procedure Parameters||
     |User:Provide SQL query for detecting object types||


## Next Steps

- App provisioning](user-provisioning.md)
