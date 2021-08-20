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
> The on-premises provisioning preview is currently in an invitation-only preview. To request access to the capability, use the [access request form](https://aka.ms/onpremprovisioningpublicpreviewaccess). We'll open the preview to more customers and connectors over the next few months as we prepare for general availability.

This article describes how to create a new SQL connector with the Azure Active Directory (Azure AD) ECMA Connector Host and how to configure it. You'll need to do this task after you've successfully installed the Azure AD ECMA Connector Host.

>[!NOTE] 
> This article covers only the configuration of the generic SQL connector. For a step-by-step example of how to set up the generic SQL connector, see [Tutorial: ECMA Connector Host generic SQL connector](tutorial-ecma-sql-connector.md)

 This flow guides you through the process of installing and configuring the Azure AD ECMA Connector Host.

 ![Diagram that shows the installation flow.](./media/on-premises-sql-connector-configure/flow-1.png)

For more installation and configuration information, see:
   - [Prerequisites for the Azure AD ECMA Connector Host](on-premises-ecma-prerequisites.md)
   - [Installation of the Azure AD ECMA Connector Host](on-premises-ecma-install.md)
   - [Configure the Azure AD ECMA Connector Host and the provisioning agent](on-premises-ecma-configure.md)

Depending on the options you select, some of the wizard screens might not be available and the information might be slightly different. For purposes of this configuration, the user object type is used. Use the following information to guide you in your configuration. 

#### Supported systems
* Microsoft SQL Server and Azure SQL
* IBM DB2 10.x
* IBM DB2 9.x
* Oracle 10 and 11g
* Oracle 12c and 18c
* MySQL 5.x

## Create a generic SQL connector

To create a generic SQL connector:

 1. Select the ECMA Connector Host shortcut on the desktop.
 1. Select **New Connector**.
 
     ![Screenshot that shows Choose new connector.](.\media\on-premises-sql-connector-configure\sql-1.png)

 1. On the **Properties** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.
 
     ![Screenshot that shows Enter properties.](.\media\on-premises-sql-connector-configure\sql-2.png)

     |Property|Description|
     |-----|-----|
     |Name|The name for this connector.|
     |Autosync timer (minutes)|Minimum allowed is 120 minutes.|
     |Secret Token|123456 (The token must be a string of 10 to 20 ASCII letters and/or digits.)|
     |Description|The description of the connector.|
     |Extension DLL|For a generic SQL connector, select **Microsoft.IAM.Connector.GenericSql.dll**.|
 1. On the **Connectivity** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.
 
     ![Screenshot that shows Enter connectivity.](.\media\on-premises-sql-connector-configure\sql-3.png)

     |Property|Description|
     |-----|-----|
     |DSN File|The Data Source Name file used to connect to the SQL Server instance.|
     |User Name|The username of an individual with rights to the SQL Server instance. It must be in the form of hostname\sqladminaccount for standalone servers or domain\sqladminaccount for domain member servers.|
     |Password|The password of the username just provided.|
     |DN is Anchor|Unless your environment is known to require these settings, don't select the **DN is Anchor** and **Export Type:Object Replace** checkboxes.|
     |Export Type:Object Replace||
 1. On the **Schema 1** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.
 
     ![Screenshot that shows the Schema 1 page.](.\media\on-premises-sql-connector-configure\sql-4.png)

     |Property|Description|
     |-----|-----|
     |Object type detection method|The method used to detect the object type the connector will be provisioning.|
     |Fixed value list/Table/View/SP|This box should contain **User**.|
     |Column Name for Table/View/SP||
     |Stored Procedure Parameters||
     |Provide SQL query for detecting object types||
 1. On the **Schema 2** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes. This schema screen might be slightly different or have additional information depending on the object types you selected in the previous step.
 
     ![Screenshot that shows the Schema 2 page.](.\media\on-premises-sql-connector-configure\sql-5.png)

     |Property|Description|
     |-----|-----|
     |User:Attribute Detection|This property should be set to **Table**.|
     |User:Table/View/SP|This box should contain **Employees**.|
     |User:Name of Multi-Valued Table/Views||
     |User:Store Procedure Parameters||
     |User:Provide SQL query for detecting attributes||
 1. On the **Schema 3** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes. The attributes you see depends on the information you provided in the previous step.
 
     ![Screenshot that shows the Schema 3 page.](.\media\on-premises-sql-connector-configure\sql-6.png)

     |Property|Description|
     |-----|-----|
     |Select DN attribute for User||
 1. On the **Schema 4** page, review the **DataType** attribute and the direction of flow for the connector. You can adjust them if needed and select **Next**.
 
     ![Screenshot that shows the schema 4 page.](.\media\on-premises-sql-connector-configure\sql-7.png)  
 1. On the **Global** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.
 
     ![Screenshot that shows the Global page.](.\media\on-premises-sql-connector-configure\sql-8.png)

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
 1. On the **Select partition** page, ensure that the correct partitions are selected and select **Next**.
 
     ![Screenshot that shows the Select partition page.](.\media\on-premises-sql-connector-configure\sql-9.png)

 1. On the **Run Profiles** page, select the run profiles that you want to use and select **Next**.
 
     ![Screenshot that shows the Run Profiles page.](.\media\on-premises-sql-connector-configure\sql-10.png)

     |Property|Description|
     |-----|-----|
     |Export|Run profile that will export data to SQL. This run profile is required.|
     |Full import|Run profile that will import all data from SQL sources specified earlier.|
     |Delta import|Run profile that will import only changes from SQL since the last full or delta import.|
 
 1. On the **Run Profiles** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.
  
     ![Screenshot that shows Enter Export information.](.\media\on-premises-sql-connector-configure\sql-11.png)

     |Property|Description|
     |-----|-----|
     |Operation Method||
     |Table/View/SP||
     |Start Index Parameter Name||
     |End Index Parameter Name||
     |Stored Procedure Parameters||
 
 1. On the **Object Types** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes. 
 
     ![Screenshot that shows the Object Types page.](.\media\on-premises-sql-connector-configure\sql-12.png)

     |Property|Description|
     |-----|-----|
     |Target object|The object that you're configuring.|
     |Anchor|The attribute that will be used as the object's anchor. This attribute should be unique in the target system. The Azure AD provisioning service will query the ECMA host by using this attribute after the initial cycle. This anchor value should be the same as the anchor value in Schema 3.|
     |Query Attribute|Used by the ECMA host to query the in-memory cache. This attribute should be unique.|
     |DN|The attribute that's used for the target object's distinguished name. The **Autogenerated** checkbox should be selected in most cases. If it isn't selected, ensure that the DN attribute is mapped to an attribute in Azure AD that stores the DN in this format: CN = anchorValue, Object = objectType.|
 
 1. The ECMA host discovers the attributes supported by the target system. You can choose which of those attributes you want to expose to Azure AD. These attributes can then be configured in the Azure portal for provisioning. On the **Select Attributes** page, select attributes from the dropdown list to add.
 
     ![Screenshot that shows the Select Attributes page.](.\media\on-premises-sql-connector-configure\sql-13.png)

1. On the **Deprovisioning** page, review the deprovisioning information and make adjustments as necessary. Attributes selected on the previous page won't be available to select on the **Deprovisioning** page. Select **Finish**.

     ![Screenshot that shows the Deprovisioning page.](.\media\on-premises-sql-connector-configure\sql-14.png)

## Next steps

- [App provisioning](user-provisioning.md)
- [Azure AD ECMA Connector Host installation](on-premises-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
- [Tutorial: ECMA Connector Host generic SQL connector](tutorial-ecma-sql-connector.md)
