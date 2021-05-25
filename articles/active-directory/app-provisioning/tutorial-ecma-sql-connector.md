---
title: Tutorial:  Azure AD ECMA Host Connector Generic SQL Connector
description: This tutorial describes how to use the On-premises application provisioning generic SQL connector.
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

# Azure AD ECMA Host Connector Generic SQL Connector

This tutorial describes the steps you need to perform to automatically provision and deprovision users from Azure AD into a SQL DB.  For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).

This tutorial covers how to setup and use the generic SQL connector with the Azure AD ECMA Connector Host. Your test environment should mirror the items layed out below before attempting this tutorial.

![Architecure](.\media\tutorial-ecma-sql-connector\sql-1.png)

- This tutorial uses 2 virtual machines.  One is the domain controller (DC1.contoso.com) and the second is an application server(APP1.contoso.com).
- SQL Server 2019 and SQL Server Management Studio is installed on APP1.  
- Both VMs have connectivity to the internet.
- SQL Server Agent has been started
- You have an Azure AD tenant to test with.  This tutorial uses ecmabmcontoso.onmicrosoft.com.  Substitute your tenant with this one.

For additional information on setting up this environment, see [Tutorial: Basic Active Directory environment](../../active directory/cloud sync/tutorial-basic-ad-azure.md)

## Step 1 - Prepare the sample database
On a server running SQL Server, run the SQL script found in [Appendix A](#appendix-a). This script creates a sample database with the name CONTOSO.  This is the database that we will be provisioning users in to.


## Step 2 - Create the DSN connection file
The Generic SQL Connector is a DSN file to connect to the SQL server. First we need to create a file with the ODBC connection information.

1. Start the ODBC management utility on your server:  
     ![ODBC](./media/tutorial-ecma-sql-connector/odbc.png)
2. Select the tab **File DSN**. Click **Add...**.  
     ![Add file dsn](./media/tutorial-ecma-sql-connector/dsn-2.png)
3. Select SQL Server Native Client 11.0 and click **Next**.  
     ![Choose native client](./media/tutorial-ecma-sql-connector/dsn-3.png)
4. Give the file a name, such as **GenericSQL** and click **Next**.  
     ![Name the connector](./media/tutorial-ecma-sql-connector/dsn-4.png)
5. Click **Finish**.  
     ![Finish](./media/tutorial-ecma-sql-connector/dsn-5.png)
6. Now configure the connection.  Enter **APP1** for the name of the server and click **Next**.
     ![Enter server name](./media/tutorial-ecma-sql-connector/dsn-6.png)
7. Keep Windows Authentication and click **Next**.  
     ![Windows authentication](./media/tutorial-ecma-sql-connector/dsn-7.png)
8. Provide the name of the sample database, **CONTOSO**.  
     ![Enter database name](./media/tutorial-ecma-sql-connector/dsn-8.png)
9. Keep everything default on this screen. Click **Finish**.
     ![Click finish](./media/tutorial-ecma-sql-connector/dsn-9.png)
10. To verify everything is working as expected, click **Test Data Source**.  
     ![Test data source](./media/tutorial-ecma-sql-connector/dsn-10.png)
11. Make sure the test is successful.  
     ![Success](./media/tutorial-ecma-sql-connector/dsn-11.png)
12. Click **OK**.  Click **OK**.  Close ODBC Data Source Administrator.

## Step 3 -  Download and install the Azure AD Connect Provisioning Agent Package

 1. Sign in to the server you'll use with enterprise admin permissions.
 2. Sign in to the Azure portal, and then go to **Azure Active Directory**.
 3. In the left menu, select **Azure AD Connect**.
 4. Select **Manage cloud sync** > **Review all agents**.
 5. Download the Azure AD Connect provisioning agent package from the Azure portal.
 6. Accept the terms and click download.
 7. Run the Azure AD Connect provisioning installer AADConnectProvisioningAgentSetup.msi.
 8. On the **Microsoft Azure AD Connect Provisioning Agent Package** screen, accept the licensing terms and select **Install**.
   ![Microsoft Azure AD Connect Provisioning Agent Package screen](media/on-prem-ecma-install/install-1.png)</br>
 9. After this operation finishes, the configuration wizard starts. Click **Next**.
   ![Welcome screen](media/on-prem-ecma-install/install-2.png)</br>
 10. On the **Select Extension** screen, select **On-premises application provisioning (Azure AD to application)** and click **Next**. 
   ![Select extension](media/on-prem-ecma-install/install-3.png)</br>
 12. Use your global administrator account and sign in to Azure AD.
     ![Azure signin](media/on-prem-ecma-install/install-4.png)</br>
 13.  On the **Agent Configuration** screen, click **Confirm**.
     ![Confirm installation](media/on-prem-ecma-install/install-5.png)</br>
 14.  Once the installation is complete, you should see a message at the bottom of the wizard.  Click **Finish**.
     ![Click finish](media/on-prem-ecma-install/install-6.png)</br>
 15. Click **Close**.
 
## Step 4 - Configure the Azure AD ECMA Connector Host
1. On the desktop, click the ECMA shortcut.
2. Once the ECMA Connector Host Configuration starts, leave the default port 8585 and click **Generate**.  This will generate a certificate.
     ![Configure your settings](.\media\on-prem-ecma-configure\configure-1.png)
3. Click **Save**.

## Step 5 - Create a generic SQL connector
 1.  Click on the ECMA Connector Host shortcut on the desktop.
 2.  Select **New Connector**.
     ![Choose new connector](.\media\on-prem-sql-connector-configure\sql-1.png)

 3. On the **Properties** page, fill in the boxes with the values specified in the table below and click **Next**.
     ![Enter properties](.\media\tutorial-ecma-sql-connector\conn-1.png)

     |Property|Value|
     |-----|-----|
     |Name|SQL|
     |Autosync timer (minutes)|120|
     |Secret Token|Enter your own key here.  It should be 12 characters minimum.|
       |Extension DLL|For a generic sql connector, select Microsoft.IAM.Connector.GenericSql.dll.|
 4. On the **Connectivity** page, fill in the boxes with the values specified in the table below and click **Next**.
     ![Enter connectivity](.\media\tutorial-ecma-sql-connector\conn-2.png)

     |Property|Value|
     |-----|-----|
     |DSN File|Navigate to the file created at the begining of the tutorial in Step 2.|
     |User Name|contoso\administrator|
     |Password|the administrators password.|
 5. On the **Schema 1** page, fill in the boxes with the values specified in the table below and click **Next**.
     ![Enter schema 1](.\media\tutorial-ecma-sql-connector\conn-3.png)

     |Property|Value|
     |-----|-----|
     |Object type detection method|Fixed Value|
     |Fixed value list/Table/View/SP|User|
 6. On the **Schema 2** page,fill in the boxes with the values specified in the table below and click **Next**.
     ![Enter schema 2](.\media\tutorial-ecma-sql-connector\conn-4.png)

     |Property|Value|
     |-----|-----|
     |User:Attribute Detection|Table|
     |User:Table/View/SP|Employees|
 7. On the **Schema 3** page, fill in the boxes with the values specified in the table below and click **Next**.
     ![Enter schema 3](.\media\tutorial-ecma-sql-connector\conn-5.png)

     |Property|Description|
     |-----|-----|
     |Select Anchor for :User|User:ContosoLogin|
     |Select DN attribute for User|AzureID|
 8. On the **Schema 4** page, leave the defaults and click **Next**.
     ![Enter schema 4](.\media\tutorial-ecma-sql-connector\conn-6.png)  
 9. On the **Global** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes.
     ![Enter global information](.\media\tutorial-ecma-sql-connector\conn-7.png)

     |Property|Description|
     |-----|-----|
     |Data Source Date Time Format|yyyy-MM-dd HH:mm:ss|
 10. On the **Select partition** page, click **Next**.
     ![Enter partition information](.\media\tutorial-ecma-sql-connector\conn-8.png)  

 11. On the **Run Profiles** page, keep **Export** and add **Full Import**.  Click **Next**.
     ![Enter run profiles](.\media\tutorial-ecma-sql-connector\conn-9.png)

 12. On the **Export** page, fill in the boxes and click next.  Use the table below the image for guidance on the individual boxes. 
     ![Enter Export information](.\media\tutorial-ecma-sql-connector\conn-10.png)

     |Property|Description|
     |-----|-----|
     |Operation Method|Table|
     |Table/View/SP|Employees|
 
 12. On the **Full Import** page, fill in the boxes and click **Next**.  Use the table below the image for guidance on the individual boxes. 
     ![Enter Full import information](.\media\tutorial-ecma-sql-connector\conn-11.png)

     |Property|Description|
     |-----|-----|
     |Operation Method|Table|
     |Table/View/SP|Employees|
 
 13. On the **Object Types** page, fill in the boxes and click **Next**.  Use the table below the image for guidance on the individual boxes. 
     ![Enter object types](.\media\tutorial-ecma-sql-connector\conn-12.png)

     |Property|Description|
     |-----|-----|
     |Target Object|User|
     |Anchor|ContosoLogin|
     |Query attribute|AzureID|
     |DN|AzureID|
 
 14. On the **Select Attributes** page, add all of the attributes in the drop-down and click **Next**. 
     ![Enter attributes](.\media\tutorial-ecma-sql-connector\conn-13.png)

15. On the **Deprovisioning** page, under **Disable flow**, select **Delete**. Click **Finish**.
     ![Enter deprovisioning information](.\media\tutorial-ecma-sql-connector\conn-14.png)

#### Step 6 - Ensure ECMA2Host service is running
1.  On the server the running the Azure AD ECMA Connector Host, click Start.
2. Type run and enter services.msc in the box
3. In the services, ensure that **Microsoft ECMA2Host** is present and running.  If not, click **Start**.
 ![Service is running](.\media\on-prem-ecma-configure\configure-2.png)

#### Step 7 - Add Enterprise application
1.  Sign-in to the Azure portal as an application administrator
2. In the portal, navigate to Azure Active Directory, **Enterpirse Applications**.
3. Click on **New Application**.
 ![Add new application](.\media\on-prem-ecma-configure\configure-4.png)
4. Search the gallery for the test application **on-premises provisioning** and click **Create**.
 ![Add new application](.\media\tutorial-ecma-sql-connector\app-1.png)

## Step 8 - Configure the applicaion and test
 1. Once it has been created, click he **Provisioning page**.
 2. Click **get started**.
 ![get started](.\media\on-prem-ecma-configure\configure-6.png)
 3. On the **Provisioning page**, change the mode to **Automatic**
   ![Add new application](.\media\on-prem-ecma-configure\configure-7.png)
 4. In the on-premises connectivity section, select the agent that you just deployed and click assign agent(s).
   >[!NOTE]
   >After adding the agent, you need to wait 10 minutes for the registration to complete.  The connectivity test will not work until the registration completes.
   >
   >Alternatively, you can force the agent registration to complete by restarting the provisioning agent on your server. Navigating to your server > search for services in the windows search bar > identify the Azure AD Connect Provisioning Agent Service > right click on the service and restart.
   
   ![Assign an agent](.\media\on-prem-ecma-configure\configure-8.png)
 7.  After 10 minutes, under the **Admin credentials** section, enter the following URL, replacing "connectorName" portion with the name of the connector on the ECMA Host.
 
   https://localhost:8585/ecma2host_connectorName/scim

   For example, if the connector you created was named SQL, the url would be:
 
   https://localhost:8585/ecma2host_SQL/scim
  
  
 6. Enter the secret token value that you defined when creating the connector.
 7. Click Test Connection and wait one minute.
  ![Assign an agent](.\media\on-prem-ecma-configure\configure-5.png)
 9. Once connection test is successful, click **save**.
 ![Assign an agent](.\media\on-prem-ecma-configure\configure-9.png)


















## Step 6. Configure provisioning in Azure AD
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
Create Database CONTOSO
Go
-------Using the Database-----------
Use [CONTOSO]
Go
-------------------------------------

/****** Object:  Table [dbo].[Employees]    Script Date: 1/6/2020 7:18:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Employees](
	[ContosoLogin] [nvarchar](128) NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](128) NULL,
	[InternalGUID] [uniqueidentifier] NULL,
	[AzureID] [uniqueidentifier] NULL,
	[textID] [nvarchar](128) NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF_Employees_InternalGUID]  DEFAULT (newid()) FOR [InternalGUID]
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
