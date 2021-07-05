---
title: Azure AD ECMA Connector Host generic SQL connector configuration
description: This document describes how to configure the Azure AD ECMA Connector Host generic SQL connector.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 06/06/2021
ms.author: billmath
ms.reviewer: arvinh
---

# Azure AD ECMA Connector Host generic SQL connector configuration

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. You can request access to the capability [here](https://aka.ms/onpremprovisioningpublicpreviewaccess). We will open the preview to more customers and connectors over the next few months as we prepare for general availability.


This document describes how to create a new SQL connector with the Azure AD ECMA Connector Host and how to configure it.  You will need to do this once you have successfully installed Azure AD ECMA Connector Host.  

>[!NOTE] 
> This document covers only the configuration of the Generic SQL connector.  For step-by-step example of setting up the Generic SQL connector, see [Tutorial:  ECMA Connector Host Generic SQL Connector](tutorial-ecma-sql-connector.md)

Installing and configuring the Azure AD ECMA Connector Host is a process. Use the flow below to guide you through the process.

 ![Installation flow](./media/on-premises-sql-connector-configure/flow-1.png)  

For more installation and configuration information see:
   - [Prerequisites for the Azure AD ECMA Connector Host](on-premises-ecma-prerequisites.md)
   - [Installation of the Azure AD ECMA Connector Host](on-premises-ecma-install.md)
   - [Configure the Azure AD ECMA Connector Host and the provisioning agent](on-premises-ecma-configure.md)

Depending on the options you select, some of the wizard screens may or may not be available and the information may be slightly different.  For purposes of this configuration, the user object type is used. Use the information below to guide you in your configuration.

**Supported systems**
* Microsoft SQL Server & SQL Azure
* IBM DB2 10.x
* IBM DB2 9.x
* Oracle 10 & 11g
* Oracle 12c and 18c
* MySQL 5.x
## Create a generic SQL connector

To create a generic SQL connector use the following steps:

 1.  Click on the ECMA Connector Host shortcut on the desktop.
 2.  Select **New Connector**.
     ![Choose new connector](.\media\on-premises-sql-connector-configure\sql-1.png)

 3. On the **Properties** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.
     ![Enter properties](.\media\on-premises-sql-connector-configure\sql-2.png)

     |Property|Description|
     |-----|-----|
     |Name|The name for this connector|
     |Autosync timer (minutes)|Minimum allowed is 120 minutes.|
     |Secret Token|123456 [This must be a string of 10-20 ASCII letters and/or digits.]|
     |Description|The description of the connector|
     |Extension DLL|For a generic sql connector, select Microsoft.IAM.Connector.GenericSql.dll.|
 4. On the **Connectivity** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.
     ![Enter connectivity](.\media\on-premises-sql-connector-configure\sql-3.png)

     |Property|Description|
     |-----|-----|
     |DSN File|The Data Source Name file used to connect to the SQL server|
     |User Name|The username of an individual with rights to the SQL server.  This must be in the form of hostname\sqladminaccount for standalone servers, or domain\sqladminaccount for domain member servers.|
     |Password|The password of the username provided above.|
     |DN is Anchor|Unless the your environment is known to require these settings, leave DN is Anchor and Export Type:Object Replace deselected.|
     |Export TypeObjectReplace||
 5. On the **Schema 1** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.
     ![Enter schema 1](.\media\on-premises-sql-connector-configure\sql-4.png)

     |Property|Description|
     |-----|-----|
     |Object type detection method|The method used to detect the object type the connector will be provisioning.|
     |Fixed value list/Table/View/SP|This should contain User.|
     |Column Name for Table/View/SP||
     |Stored Procedure Parameters||
     |Provide SQL query for detecting object types||
 6. On the **Schema 2** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.  This schema screen maybe slightly different or have additional information depending on the object types that were selected in the previous step.
     ![Enter schema 2](.\media\on-premises-sql-connector-configure\sql-5.png)

     |Property|Description|
     |-----|-----|
     |User:Attribute Detection|This should be set to Table.|
     |User:Table/View/SP|This should contain Employees.|
     |User:Name of Multi-Values Table/Views||
     |User:Stored Procedure Parameters||
     |User:Provide SQL query for detecting object types||
 7. On the **Schema 3** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.  The attributes that you see will depend on the information provided in the previous step.
     ![Enter schema 3](.\media\on-premises-sql-connector-configure\sql-6.png)

     |Property|Description|
     |-----|-----|
     |Select DN attribute for User||
 8. On the **Schema 4** page, review the attributes DataType and the Direction of flow for the connector.  You can adjust them if needed and click Next.
     ![Enter schema 4](.\media\on-premises-sql-connector-configure\sql-7.png)  
 9. On the **Global** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.
     ![Enter global information](.\media\on-premises-sql-connector-configure\sql-8.png)

     |Property|Description|
     |-----|-----|
     |Water Mark Query||
     |Data Source Time Zone|Select the time zone that the data source is located in.|
     |Data Source Date Time Format|Specify the format for the data source.|
     |Use named parameters to execute a stored procedure||
     |Operation Methods||
     |Extension Name||
     |Set Password SP Name||
     |Set Password SP Parameters||
 10. On the **Select partition** page, ensure that the correct partitions are selected and click Next.
     ![Enter partition information](.\media\on-premises-sql-connector-configure\sql-9.png)  

 11. On the **Run Profiles** page, select the run profiles that you wish to use and click Next.
     ![Enter run profiles](.\media\on-premises-sql-connector-configure\sql-10.png)

     |Property|Description|
     |-----|-----|
     |Export|Run profile that will export data to SQL.  This run profile is required.|
     |Full import|Run profile that will import all data from SQL sources specified earlier.|
     |Delta import|Run profile that will import only changes from SQL since the last full or delta import.|
 
 12. On the **Run Profiles** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes. 
     ![Enter Export information](.\media\on-premises-sql-connector-configure\sql-11.png)

     |Property|Description|
     |-----|-----|
     |Operation Method||
     |Table/View/SP||
     |Start Index Parameter Name||
     |End Index Parameter Name||
     |Stored Procedure Parameters||
 
 13. On the **Object Types** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes. 
     ![Enter object types](.\media\on-premises-sql-connector-configure\sql-12.png)

     |Property|Description|
     |-----|-----|
     |Target Object|The object that you are configuring.|
     |Anchor|The attribute that will be used as the objects anchor.  This attribute should be unique in the target system. The Azure AD provisioning service will query the ECMA host using this attribute after the initial cycle. This anchor value should be the same as the anchor value in schema 3.|
     |Query attribute|Used by the ECMA host to query the in-memory cache. This attribute should be unique.|
     |DN|The attribute that is used for the target objects distinguished name.  The autogenerate option should be selected in most cases. If deselected, ensure that the DN attribute is mapped to an attribute in Azure AD that stores the DN in this format: CN = anchorValue, Object = objectType|
 
 14. The ECMA host discovers the attributes supported by the target system. You can choose which of those attributes you would like to expose to Azure AD. These attributes can then be configured in the Azure portal for provisioning.  On the **Select Attributes** page, select attributes from the drop-down to add. 
     ![Enter attributes](.\media\on-premises-sql-connector-configure\sql-13.png)

15. On the **Deprovisioning** page, review the deprovisioning information and make adjustments as necessary. Attributes selected in the previous page will not be available to select in the deprovisioning page. Click Finish.
     ![Enter deprovisioning information](.\media\on-premises-sql-connector-configure\sql-14.png)



## Next Steps

- [App provisioning](user-provisioning.md)
- [Azure AD ECMA Connector Host installation](on-premises-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
- [Tutorial:  ECMA Connector Host Generic SQL Connector](tutorial-ecma-sql-connector.md)
