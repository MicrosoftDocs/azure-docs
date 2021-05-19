---
title: On-premises application provisioning generic SQL connector 
description: This document describes how to use the On-premises application provisioning generic SQL connector.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: conceptual
ms.workload: identity
ms.date: 03/09/2021
ms.author: billmath
ms.reviewer: arvinh
---
---

# On-premises application provisioning generic SQL connector 

This tutorial describes the steps you need to perform to automatically provision and deprovision users from Azure AD into a SQL DB.  For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).

## Capabilities Supported
- Create users in a SQL DB
- Remove users from a SL DB when they do not require access anymore
- Keep user attributes synchronized between Azure AD and the SQL DB

> [!Note]
> Notable known directories or features not supported: Microsoft Active Directory Domain Services (AD DS), Password Change Notification, Service(PCNS), Exchange provisioning, Delete of Active Sync Devices,Support for TDescurityDescriptor,Oracle Internet Directory (OID)

## Prerequisites

## Step 1. Plan your provisioning deployment
1. Review the steps to configure [on-prem provisioning](https://linkToNewTutorial) 
2. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
3. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
4. Determine what data to [map between Azure AD and ServiceNow](../app-provisioning/customize-application-attributes.md). 

## Step 2. Download and install the provisioning agent and on-prem host

You will need to download the provisioning agent and ECMA connector host to provide connectivity to your application. [Review the detailed steps for downloading and installing the components.]()

## Step 3 Prepare the sample database
On a server running SQL Server, run the SQL script found in [Appendix A](#appendix-a). This script creates a sample database with the name GSQLDEMO. The object model for the created database looks like this picture:  
![Object Model](./media/tutorial-ecma-sql/objectmodel.png)

Also create a user you want to use to connect to the database. In this walkthrough, the user is called FABRIKAM\SQLUser and located in the domain.

## Step 4 Create the ODBC connection file
The Generic SQL Connector is using ODBC to connect to the remote server. First we need to create a file with the ODBC connection information.

1. Start the ODBC management utility on your server:  
   ![ODBC](./media/tutorial-ecma-sql/odbc.png)
2. Select the tab **File DSN**. Click **Add...**.  
   ![ODBC1](./media/tutorial-ecma-sql/odbc-1.png)
3. The out-of-box driver works fine, so select it and click **Next>**.  
   ![ODBC2](./media/tutorial-ecma-sql/odbc-2.png)
4. Give the file a name, such as **GenericSQL**.  
   ![ODBC3](./media/tutorial-ecma-sql/odbc-3.png)
5. Click **Finish**.  
   ![ODBC4](./media/tutorial-ecma-sql/odbc-4.png)
6. Time to configure the connection. Give the data source a good description and provide the name of the server running SQL Server.  
   ![ODBC5](./media/tutorial-ecma-sql/odbc-5.png)
7. Select how to authenticate with SQL. In this case, we use Windows Authentication.  
   ![ODBC6](./media/tutorial-ecma-sql/odbc-6.png)
8. Provide the name of the sample database, **GSQLDEMO**.  
   ![ODBC7](./media/tutorial-ecma-sql/odbc-7.png)
9. Keep everything default on this screen. Click **Finish**.  
   ![ODBC8](./media/tutorial-ecma-sql/odbc-8.png)
10. To verify everything is working as expected, click **Test Data Source**.  
    ![ODBC9](./media/tutorial-ecma-sql/odbc-9.png)
11. Make sure the test is successful.  
    ![ODBC10](./media/tutorial-ecma-sql/odbc-10.png)
12. The ODBC configuration file should now be visible in File DSN.  
    ![ODBC11](./media/tutorial-ecma-sql/odbc-1.png)







## Step 5. Configure the host


## Step 5. Configure provisioning in Azure AD
1. Assign the agents to your application (get steps from preview doc).
2. Provide the URL and secret token (get steps from preview doc). 
2. [Determine who should be in scope for provisioning](https://docs.microsoft.com/azure/active-directory/app-provisioning/define-conditional-rules-for-provisioning-user-accounts).
3. [Assign users to your application](https://docs.microsoft.com/azure/active-directory/manage-apps/add-application-portal-assign-users) if scoping is based on assignment to the application (recommended).
4. [Configure your attribute mappings.](https://docs.microsoft.com/azure/active-directory/app-provisioning/customize-application-attributes)
5. [Provision a user on-demand.](https://docs.microsoft.com/azure/active-directory/app-provisioning/provision-on-demand)
6. Add additional users to your application.
7. Turn provisioning on.

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully.
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion.
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## Troubleshooting tips


## Known issues

* LDAP referrals between servers not supported (RFC 4511/4.1.10)




 
## Appendix A
**SQL script to create the sample database**

```SQL
---Creating the Database---------
Create Database GSQLDEMO
Go
-------Using the Database-----------
Use [GSQLDEMO]
Go
-------------------------------------
USE [GSQLDEMO]
GO
/****** Object:  Table [dbo].[GroupMembers]   ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupMembers](
    [MemberID] [int] NOT NULL,
    [Group_ID] [int] NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[GROUPS]   ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GROUPS](
    [GroupID] [int] NOT NULL,
    [GROUPNAME] [nvarchar](200) NOT NULL,
    [DESCRIPTION] [nvarchar](200) NULL,
    [WATERMARK] [datetime] NULL,
    [OwnerID] [int] NULL,
PRIMARY KEY CLUSTERED
(
    [GroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[USERPHONE]   ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[USERPHONE](
    [USER_ID] [int] NULL,
    [Phone] [varchar](20) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[USERS]   ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USERS](
    [USERID] [int] NOT NULL,
    [USERNAME] [nvarchar](200) NOT NULL,
    [FirstName] [nvarchar](100) NULL,
    [LastName] [nvarchar](100) NULL,
    [DisplayName] [nvarchar](100) NULL,
    [ACCOUNTDISABLED] [bit] NULL,
    [EMPLOYEEID] [int] NOT NULL,
    [WATERMARK] [datetime] NULL,
PRIMARY KEY CLUSTERED
(
    [USERID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [dbo].[GroupMembers]  WITH CHECK ADD  CONSTRAINT [FK_GroupMembers_GROUPS] FOREIGN KEY([Group_ID])
REFERENCES [dbo].[GROUPS] ([GroupID])
GO
ALTER TABLE [dbo].[GroupMembers] CHECK CONSTRAINT [FK_GroupMembers_GROUPS]
GO
ALTER TABLE [dbo].[GroupMembers]  WITH CHECK ADD  CONSTRAINT [FK_GroupMembers_USERS] FOREIGN KEY([MemberID])
REFERENCES [dbo].[USERS] ([USERID])
GO
ALTER TABLE [dbo].[GroupMembers] CHECK CONSTRAINT [FK_GroupMembers_USERS]
GO
ALTER TABLE [dbo].[GROUPS]  WITH CHECK ADD  CONSTRAINT [FK_GROUPS_USERS] FOREIGN KEY([OwnerID])
REFERENCES [dbo].[USERS] ([USERID])
GO
ALTER TABLE [dbo].[GROUPS] CHECK CONSTRAINT [FK_GROUPS_USERS]
GO
ALTER TABLE [dbo].[USERPHONE]  WITH CHECK ADD  CONSTRAINT [FK_USERPHONE_USER] FOREIGN KEY([USER_ID])
REFERENCES [dbo].[USERS] ([USERID])
GO
ALTER TABLE [dbo].[USERPHONE] CHECK CONSTRAINT [FK_USERPHONE_USER]
GO
```

## Appendix B: Configuring the Generic SQL Connector for SQL Server

If you do not have a connector MA, but have SQL Server in your environment, then you can still validate the provisioning process, using the instructions in the Generic SQL Connector guide at [https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericsql](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericsql) and  [https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericsql-step-by-step](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericsql-step-by-step)

After creating an ODBC file, you can then use that file when creating a new Connector.

## Appendix G: Building a demo SQL environment for testing
https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericsql-step-by-step
https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericsql


## Appendix H: Configuring the host using SQL

The following screenshots show you how to configure the host, if you are using the demo environment described above.


## Next Steps

- App provisioning](user-provisioning.md)
