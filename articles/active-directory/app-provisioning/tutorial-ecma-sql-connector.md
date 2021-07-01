---
title:  Azure AD ECMA Connector Host Generic SQL Connector tutorial
description: This tutorial describes how to use the On-premises application provisioning generic SQL connector.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 07/01/2021
ms.subservice: hybrid
ms.author: billmath
ms.reviewer: arvinh
ms.collection: M365-identity-device-management
---



# Azure AD ECMA Connector Host Generic SQL Connector tutorial

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. You can request access to the capability [here](https://aka.ms/onpremprovisioningpublicpreviewaccess). We will open the preview to more customers and connectors over the next few months as we prepare for general availability.

This tutorial describes the steps you need to perform to automatically provision and deprovision users from Azure AD into a SQL DB.  For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).

This tutorial covers how to setup and use the generic SQL connector with the Azure AD ECMA Connector Host. 

## Step 1 - Prepare the sample database
On a server running SQL Server, run the SQL script found in [Appendix A](#appendix-a). This script creates a sample database with the name CONTOSO.  This is the database that we will be provisioning users in to.


## Step 2 - Create the DSN connection file
The Generic SQL Connector is a DSN file to connect to the SQL server. First we need to create a file with the ODBC connection information.

1. Start the ODBC management utility on your server:  
     ![ODBC management](./media/tutorial-ecma-sql-connector/odbc.png)
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
   ![Microsoft Azure AD Connect Provisioning Agent Package screen](media/on-premises-ecma-install/install-1.png)</br>
 9. After this operation finishes, the configuration wizard starts. Click **Next**.
   ![Welcome screen](media/on-premises-ecma-install/install-2.png)</br>
 10. On the **Select Extension** screen, select **On-premises application provisioning (Azure AD to application)** and click **Next**. 
   ![Select extension](media/on-premises-ecma-install/install-3.png)</br>
 12. Use your global administrator account and sign in to Azure AD.
     ![Azure signin](media/on-premises-ecma-install/install-4.png)</br>
 13.  On the **Agent Configuration** screen, click **Confirm**.
     ![Confirm installation](media/on-premises-ecma-install/install-5.png)</br>
 14.  Once the installation is complete, you should see a message at the bottom of the wizard.  Click **Finish**.
     ![Finish button](media/on-premises-ecma-install/install-6.png)</br>
 15. Click **Close**.
 
## Step 4 - Configure the Azure AD ECMA Connector Host
1. On the desktop, click the ECMA shortcut.
2. Once the ECMA Connector Host Configuration starts, leave the default port 8585 and click **Generate**.  This will generate a certificate.  The auto-generated certificate will be self-signed / part of the trusted root and the SAN matches the hostname.
     ![Configure your settings](.\media\on-premises-ecma-configure\configure-1.png)
3. Click **Save**.

## Step 5 - Create a generic SQL connector
 1.  Click on the ECMA Connector Host shortcut on the desktop.
 2.  Select **New Connector**.
     ![Choose new connector](.\media\on-premises-sql-connector-configure\sql-1.png)

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
     |DSN File|Navigate to the file created at the beginning of the tutorial in Step 2.|
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

      **Anchor** - this attribute should be unique in the target system. The Azure AD provisioning service will query the ECMA host using this attribute after the initial cycle. This anchor value should be the same as the anchor value in schema 3.
 
      **Query attribute** - used by the ECMA host to query the in-memory cache. This attribute should be unique.
 
      **DN** - The autogenerate option should be selected in most cases. If deselected, ensure that the DN attribute is mapped to an attribute in Azure AD that stores the DN in this format: CN = anchorValue, Object = objectType

      ![Enter object types](.\media\tutorial-ecma-sql-connector\conn-12.png)

      |Property|Description|
      |-----|-----|
      |Target Object|User|
      |Anchor|ContosoLogin|
      |Query attribute|AzureID|
      |DN|AzureID|
      |Autogenerated|Checked|
      

 14. On the **Select Attributes** page, add all of the attributes in the drop-down and click **Next**. 
     ![Enter attributes](.\media\tutorial-ecma-sql-connector\conn-13.png)

      The set attribute dropdown will show any attribute that has been discovered in the target system and has **not been** chosen in the previous select attributes page. 
 15. On the **Deprovisioning** page, under **Disable flow**, select **Delete**. Click **Finish**.
     ![Enter deprovisioning information](.\media\tutorial-ecma-sql-connector\conn-14.png)

## Step 6 - Ensure ECMA2Host service is running
1.  On the server the running the Azure AD ECMA Connector Host, click Start.
2. Type run and enter services.msc in the box
3. In the services, ensure that **Microsoft ECMA2Host** is present and running.  If not, click **Start**.
 ![Service is running](.\media\on-premises-ecma-configure\configure-2.png)

## Step 7 - Add Enterprise application
1.  Sign-in to the Azure portal as an application administrator
2. In the portal, navigate to Azure Active Directory, **Enterprise Applications**.
3. Click on **New Application**.
 ![Add new application](.\media\on-premises-ecma-configure\configure-4.png)
4. Search the gallery for **On-premises ECMA app** and click **Create**.

## Step 8 - Configure the application and test
1. Once it has been created, click he **Provisioning page**.
2. Click **get started**.
     ![get started](.\media\on-premises-ecma-configure\configure-6.png)
3. On the **Provisioning page**, change the mode to **Automatic**
     ![Mode to automatic](.\media\on-premises-ecma-configure\configure-7.png)
4. In the on-premises connectivity section, select the agent that you just deployed and click **assign agent(s)**.
     >[!NOTE]
     >After adding the agent, you need to wait 10 minutes for the registration to complete.  The connectivity test will not work until the registration completes.
     >
     >Alternatively, you can force the agent registration to complete by restarting the provisioning agent on your server. Navigating to your server > search for services in the windows search bar > identify the Azure AD Connect Provisioning Agent Service > right click on the service and restart.
   
     ![Restart an agent](.\media\on-premises-ecma-configure\configure-8.png)
5.  After 10 minutes, under the **Admin credentials** section, enter the following URL, replacing "connectorName" portion with the name of the connector on the ECMA Host.

     |Property|Value|
     |-----|-----|
     |Tenant URL|https://localhost:8585/ecma2host_SQL/scim|

6. Enter the secret token value that you defined when creating the connector.
7. Click Test Connection and wait one minute.
     ![Assign an agent](.\media\on-premises-ecma-configure\configure-5.png)
8. Once connection test is successful, click **save**.</br>
     ![Test an agent](.\media\on-premises-ecma-configure\configure-9.png)

## Step 9 - Assign users to application
Now that you have the Azure AD ECMA Connector Host talking with Azure AD you can move on to configuring who is in scope for provisioning. 

1. In the Azure portal select **Enterprise Applications**
2. Click on the **on-premises provisioning** application
3. On the left, under **Manage** click on **Users and groups**
4. Click **Add user/group**
     ![Add user](.\media\tutorial-ecma-sql-connector\app-2.png)
5. Under **Users** click **None selected**
     ![None selected](.\media\tutorial-ecma-sql-connector\app-3.png)
6. Select users from the right and click **Select**.</br>
     ![Select users](.\media\tutorial-ecma-sql-connector\app-4.png)
7. Now click **Assign**.
     ![Assign users](.\media\tutorial-ecma-sql-connector\app-5.png)

## Step 10 - Configure attribute mappings
Now we need to map attributes between the on-premises application and our SQL server.

#### Configure attribute mapping
 1. In the Azure AD portal, under **Enterprise applications**, click he **Provisioning page**.
 2. Click **get started**.
 3. Expand **Mappings** and click **Provision Azure Active Directory Users**
   ![provision a user](.\media\on-premises-ecma-configure\configure-10.png)
 5. Click **Add new mapping**
     ![Add a mapping](.\media\on-premises-ecma-configure\configure-11.png)
 6. Specify the source and target attributes and  and add all of the mappings in the table below.

      |Mapping Type|Source attribute|Target attribute|
      |-----|-----|-----|
      |Direct|userPrincipalName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:ContosoLogin|
      |Direct|objectID|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:AzureID|
      |Direct|mail|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:Email|
      |Direct|givenName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:FirstName|
      |Direct|surName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:LastName|
      |Direct|mailNickname|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:textID|

 7. Click **Save**
     ![Save the mapping](.\media\tutorial-ecma-sql-connector\app-6.png)

## Step 11 - Test provisioning
Now that our attributes are mapped we can test on-demand provisioning with one of our users.
 
 1. In the Azure portal select **Enterprise Applications**
 2. Click on the **on-premises provisioning** application
 3. On the left, click **Provisioning**.
 4. Click **Provision on-demand**
 5. Search for one of your test users and click **Provision**
     ![Test provisioning](.\media\on-premises-ecma-configure\configure-13.png)

### Step 12 - Start provisioning users
 1. Once on-demand provisioning is successful, change back to the provisioning configuration page. Ensure that the scope is set to only assigned users and group, turn **provisioning On**, and click **Save**.
   ![Start provisioning](.\media\on-premises-ecma-configure\configure-14.png)
  2.  Wait several minutes for provisioning to start (it may take up to 40 minutes). You can learn more about the provisioning service performance here. After the provisioning job has been completed, as described in the next section, you can change the provisioning status to Off, and click Save. This will stop the provisioning service from running in the future.

### Step 13 - Verify users have been successfully provisioned
After waiting, check the SQL database to ensure users are being provisioned.
 ![Verify users are provisioned](.\media\on-premises-ecma-configure\configure-15.png)

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




## Next Steps

- [Troubleshoot on-premises application provisioning](on-premises-ecma-troubleshoot.md)
- [Review known limitations](known-issues.md)
- [On-premises provisioning prerequisites](on-premises-ecma-prerequisites.md)
- [Review prerequisites for on-premises provisioning](on-premises-ecma-prerequisites.md)
