---
title:  Azure AD ECMA Connector Host generic SQL connector tutorial
description: This tutorial describes how to use the on-premises application provisioning generic SQL connector.
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



# Azure AD ECMA Connector Host generic SQL connector tutorial

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. To request access to the capability, use the [access request form](https://aka.ms/onpremprovisioningpublicpreviewaccess). We'll open the preview to more customers and connectors over the next few months as we prepare for general availability.

This tutorial describes the steps you need to perform to automatically provision and deprovision users from Azure Active Directory (Azure AD) into SQL Database. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).

This tutorial covers how to set up and use the generic SQL connector with the Azure AD ECMA Connector Host. 

## Step 1 - Prepare the sample database
On a server running SQL Server, run the SQL script found in [Appendix A](#appendix-a). This script creates a sample database with the name CONTOSO. This is the database that you'll be provisioning users into.


## Step 2 - Create the DSN connection file
The generic SQL connector is a DSN file to connect to the SQL server. First, you need to create a file with the ODBC connection information.

1. Start the ODBC management utility on your server.
  
     ![Screenshot that shows ODBC management.](./media/tutorial-ecma-sql-connector/odbc.png)
1. Select the tab **File DSN**. Select **Add**. 
 
     ![Screenshot that shows Add file dsn.](./media/tutorial-ecma-sql-connector/dsn-2.png)
1. Select SQL Server Native Client 11.0 and select **Next**. 
 
     ![Screenshot that shows Choose native client.](./media/tutorial-ecma-sql-connector/dsn-3.png)
1. Give the file a name, such as **GenericSQL**, and select **Next**. 
 
     ![Screenshot that shows Name the connector.](./media/tutorial-ecma-sql-connector/dsn-4.png)
1. Select **Finish**. 
 
     ![Screenshot that shows Finish.](./media/tutorial-ecma-sql-connector/dsn-5.png)
1. Now configure the connection. Enter **APP1** for the name of the server and select **Next**.

     ![Screenshot that shows Enter server name.](./media/tutorial-ecma-sql-connector/dsn-6.png)
1. Keep Windows Authentication and select **Next**.

     ![Screenshot that shows Windows authentication](./media/tutorial-ecma-sql-connector/dsn-7.png)
1. Provide the name of the sample database, **CONTOSO**.

     ![Screenshot that shows Enter database name](./media/tutorial-ecma-sql-connector/dsn-8.png)
1. Keep everything default on this screen. Select **Finish**.

     ![Screenshot that shows Select finish](./media/tutorial-ecma-sql-connector/dsn-9.png)
1. To check everything is working as expected, select **Test Data Source**. 
 
     ![Screenshot that shows Test data source](./media/tutorial-ecma-sql-connector/dsn-10.png)
1. Make sure the test is successful.

     ![Screenshot that shows Success](./media/tutorial-ecma-sql-connector/dsn-11.png)
1. Select **OK**. Select **OK**. Close ODBC Data Source Administrator.

## Step 3 - Download and install the Azure AD Connect Provisioning Agent Package

 1. Sign in to the server you'll use with enterprise admin permissions.
 1. Sign in to the Azure portal, and then go to **Azure Active Directory**.
 1. In the left menu, select **Azure AD Connect**.
 1. Select **Manage cloud sync** > **Review all agents**.
 1. Download the Azure AD Connect provisioning agent package from the Azure portal.
 1. Accept the terms and select download.
 1. Run the Azure AD Connect provisioning installer AADConnectProvisioningAgentSetup.msi.
 1. On the **Microsoft Azure AD Connect Provisioning Agent Package** screen, accept the licensing terms and select **Install**.
 
    ![Screenshot that shows Microsoft Azure AD Connect Provisioning Agent Package screen](media/on-premises-ecma-install/install-1.png)</br>
 1. After this operation finishes, the configuration wizard starts. Select **Next**.
 
    ![Screenshot that shows Welcome screen.](media/on-premises-ecma-install/install-2.png)</br>
 1. On the **Select Extension** screen, select **On-premises application provisioning (Azure AD to application)** and select **Next**. 
 
    ![Screenshot that shows Select extension.](media/on-premises-ecma-install/install-3.png)</br>
 1. Use your global administrator account and sign in to Azure AD.
 
     ![Screenshot that shows Azure sign-in.](media/on-premises-ecma-install/install-4.png)</br>
 1. On the **Agent Configuration** screen, select **Confirm**.
 
     ![Screenshot that shows Confirm installation.](media/on-premises-ecma-install/install-5.png)</br>
 1. After the installation is complete, you should see a message at the bottom of the wizard. Select **Finish**.
 
     ![Screenshot that shows Finish button.](media/on-premises-ecma-install/install-6.png)</br>
 1. Select **Close**.
 
## Step 4 - Configure the Azure AD ECMA Connector Host
1. On the desktop, select the ECMA shortcut.
1. After the ECMA Connector Host Configuration starts, leave the default port 8585 and select **Generate**. This will generate a certificate. The auto-generated certificate will be self-signed / part of the trusted root and the SAN matches the hostname.

     ![Screenshot that shows Configure your settings.](.\media\on-premises-ecma-configure\configure-1.png)
1. Select **Save**.

## Step 5 - Create a generic SQL connector
 1. Select on the ECMA Connector Host shortcut on the desktop.
 1. Select **New Connector**.
 
     ![Screenshot that shows Choose new connector.](.\media\on-premises-sql-connector-configure\sql-1.png)

 1. On the **Properties** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
 
     ![Screenshot that shows Enter properties.](.\media\tutorial-ecma-sql-connector\conn-1.png)

     |Property|Value|
     |-----|-----|
     |Name|SQL|
     |Autosync timer (minutes)|120|
     |Secret Token|Enter your own key here. It should be 12 characters minimum.|
       |Extension DLL|For a generic sql connector, select Microsoft.IAM.Connector.GenericSql.dll.|
 1. On the **Connectivity** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
 
     ![Screenshot that shows Enter connectivity.](.\media\tutorial-ecma-sql-connector\conn-2.png)

     |Property|Value|
     |-----|-----|
     |DSN File|Navigate to the file created at the beginning of the tutorial in Step 2.|
     |User Name|contoso\administrator|
     |Password|the administrators password.|
 1. On the **Schema 1** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
 
     ![Screenshot that shows Enter schema 1.](.\media\tutorial-ecma-sql-connector\conn-3.png)

     |Property|Value|
     |-----|-----|
     |Object type detection method|Fixed Value|
     |Fixed value list/Table/View/SP|User|
 1. On the **Schema 2** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
 
     ![Screenshot that shows Enter schema 2.](.\media\tutorial-ecma-sql-connector\conn-4.png)

     |Property|Value|
     |-----|-----|
     |User:Attribute Detection|Table|
     |User:Table/View/SP|Employees|
 1. On the **Schema 3** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
 
     ![Screenshot that shows Enter schema 3.](.\media\tutorial-ecma-sql-connector\conn-5.png)

     |Property|Description|
     |-----|-----|
     |Select Anchor for :User|User:ContosoLogin|
     |Select DN attribute for User|AzureID|
 1. On the **Schema 4** page, leave the defaults and select **Next**.
 
     ![Screenshot that shows Enter schema 4.](.\media\tutorial-ecma-sql-connector\conn-6.png)
 1. On the **Global** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.
 
     ![Screenshot that shows Enter global information.](.\media\tutorial-ecma-sql-connector\conn-7.png)

     |Property|Description|
     |-----|-----|
     |Data Source Date Time Format|yyyy-MM-dd HH:mm:ss|
 1. On the **Select partition** page, select **Next**.
 
     ![Screenshot that shows Enter partition information.](.\media\tutorial-ecma-sql-connector\conn-8.png)

 1. On the **Run Profiles** page, keep **Export** and add **Full Import**. Select **Next**.
 
     ![Screenshot that shows Enter run profiles.](.\media\tutorial-ecma-sql-connector\conn-9.png)

 1. On the **Export** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes. 
 
     ![Screenshot that shows Enter Export information.](.\media\tutorial-ecma-sql-connector\conn-10.png)

     |Property|Description|
     |-----|-----|
     |Operation Method|Table|
     |Table/View/SP|Employees|
 
 1. On the **Full Import** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes. 
 
     ![Screenshot that shows Enter Full import information.](.\media\tutorial-ecma-sql-connector\conn-11.png)

     |Property|Description|
     |-----|-----|
     |Operation Method|Table|
     |Table/View/SP|Employees|
 
 1. On the **Object Types** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.

      - **Anchor**: This attribute should be unique in the target system. The Azure AD provisioning service will query the ECMA host using this attribute after the initial cycle. This anchor value should be the same as the anchor value in schema 3.
      - **Query attribute**: Used by the ECMA host to query the in-memory cache. This attribute should be unique.
      - **DN**: The autogenerate option should be selected in most cases. If deselected, ensure that the DN attribute is mapped to an attribute in Azure AD that stores the DN in this format: CN = anchorValue, Object = objectType

        ![Screenshot that shows Enter object types.](.\media\tutorial-ecma-sql-connector\conn-12.png)

      |Property|Description|
      |-----|-----|
      |Target Object|User|
      |Anchor|ContosoLogin|
      |Query attribute|AzureID|
      |DN|AzureID|
      |Autogenerated|Checked|
      

 1. On the **Select Attributes** page, add all the attributes in the dropdown list and select **Next**. 
 
     ![Screenshot that shows Enter attributes.](.\media\tutorial-ecma-sql-connector\conn-13.png)

      The set attribute dropdown will show any attribute that has been discovered in the target system and has *not been* chosen in the previous select attributes page. 
 1. On the **Deprovisioning** page, under **Disable flow**, select **Delete**. Select **Finish**.
 
     ![Screenshot that shows Enter deprovisioning information.](.\media\tutorial-ecma-sql-connector\conn-14.png)

## Step 6 - Ensure ECMA2Host service is running
1. On the server the running the Azure AD ECMA Connector Host, select **Start**.
1. Enter **run** and enter **services.msc** in the box.
1. In the services, ensure that **Microsoft ECMA2Host** is present and running. If not, select **Start**.

   ![Screenshot that shows Service is running.](.\media\on-premises-ecma-configure\configure-2.png)

## Step 7 - Add Enterprise application
1. Sign in to the Azure portal as an application administrator
1. In the portal, navigate to Azure Active Directory, **Enterprise Applications**.
1. Select **New Application**.

   ![Screenshot that shows Add new application.](.\media\on-premises-ecma-configure\configure-4.png)
1. Search the gallery for **On-premises ECMA app** and select **Create**.

## Step 8 - Configure the application and test
1. After it has been created, select the **Provisioning** page.
1. Select **Get started**.

     ![Screenshot that shows get started.](.\media\on-premises-ecma-configure\configure-1.png)
1. On the **Provisioning page**, change the mode to **Automatic**.

     ![Screenshot that shows Mode to automatic.](.\media\on-premises-ecma-configure\configure-7.png)
1. In the on-premises connectivity section, select the agent that you just deployed and select **Assign Agent(s)**.
     >[!NOTE]
     >After you added the agent, you need to wait 10 minutes for the registration to complete. The connectivity test won't work until the registration completes.
     >
     >Alternatively, you can force the agent registration to complete by restarting the provisioning agent on your server. Go to your server > search for services in the windows search bar > identify the Azure AD Connect Provisioning Agent Service > right-click the service, and restart.
   
     ![Screenshot that shows Restart an agent.](.\media\on-premises-ecma-configure\configure-8.png)
1.  After 10 minutes, under the **Admin credentials** section, enter the following URL, replacing "connectorName" portion with the name of the connector on the ECMA Host.

     |Property|Value|
     |-----|-----|
     |Tenant URL|https://localhost:8585/ecma2host_SQL/scim|

1. Enter the secret token value that you defined when creating the connector.
1. Select **Test Connection** and wait one minute.

     ![Screenshot that shows Assign an agent.](.\media\on-premises-ecma-configure\configure-5.png)
1. After connection test is successful, select **Save**.</br>

     ![Screenshot that shows Test an agent.](.\media\on-premises-ecma-configure\configure-9.png)

## Step 9 - Assign users to application
Now that you have the Azure AD ECMA Connector Host talking with Azure AD, you can move on to configuring who is in scope for provisioning. 

1. In the Azure portal, select **Enterprise Applications**.
1. Select the **on-premises provisioning** application.
1. On the left, under **Manage** select **Users and groups**.
1. Select **Add user/group**.

     ![Screenshot that shows Add user.](.\media\tutorial-ecma-sql-connector\app-2.png)
1. Under **Users**, select **None selected**.

     ![Screenshot that shows None selected.](.\media\tutorial-ecma-sql-connector\app-3.png)
1. Select users from the right and select the **Select** button.</br>

     ![Screenshot that shows Select users.](.\media\tutorial-ecma-sql-connector\app-4.png)
1. Now select **Assign**.

     ![Screenshot that shows Assign users.](.\media\tutorial-ecma-sql-connector\app-5.png)

## Step 10 - Configure attribute mappings
Now you need to map attributes between the on-premises application and your SQL server.

#### Configure attribute mapping
 1. In the Azure AD portal, under **Enterprise applications**, select the **Provisioning** page.
 1. Select **Get started**.
 1. Expand **Mappings** and select **Provision Azure Active Directory Users**.
 
    ![Screenshot that shows provision a user.](.\media\on-premises-ecma-configure\configure-10.png)
 1. Select **Add new mapping**.
 
     ![Screenshot that shows Add a mapping.](.\media\on-premises-ecma-configure\configure-11.png)
 1. Specify the source and target attributes and add all of the mappings in the table that follows.

      |Mapping Type|Source attribute|Target attribute|
      |-----|-----|-----|
      |Direct|userPrincipalName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:ContosoLogin|
      |Direct|objectID|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:AzureID|
      |Direct|mail|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:Email|
      |Direct|givenName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:FirstName|
      |Direct|surName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:LastName|
      |Direct|mailNickname|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:textID|

 1. Select **Save**.
 
     ![Screenshot that shows Save the mapping.](.\media\tutorial-ecma-sql-connector\app-6.png)

## Step 11 - Test provisioning
Now that your attributes are mapped, you can test on-demand provisioning with one of your users.
 
 1. In the Azure portal select **Enterprise Applications**.
 1. Select the **on-premises provisioning** application.
 1. On the left, select **Provisioning**.
 1. Select **Provision on-demand**.
 1. Search for one of your test users and select **Provision**.
 
     ![Screenshot that shows Test provisioning.](.\media\on-premises-ecma-configure\configure-13.png)

## Step 12 - Start provisioning users
 1. After on-demand provisioning is successful, change back to the provisioning configuration page. Ensure that the scope is set to only assigned users and groups, turn **provisioning On**, and select **Save**.
 
    ![Screenshot that shows Start provisioning.](.\media\on-premises-ecma-configure\configure-14.png)
 1. Wait several minutes for provisioning to start (it may take up to 40 minutes). You can learn more about the provisioning service performance here. After the provisioning job has been completed, as described in the next section, you can change the provisioning status to *Off*, and select **Save**. This will stop the provisioning service from running in the future.

## Step 13 - Check that users were successfully provisioned
After waiting, check the SQL database to ensure users are being provisioned.

 ![Screenshot that shows checking that users are provisioned.](.\media\on-premises-ecma-configure\configure-15.png)

## Appendix A
Use the following SQL script to create the sample database.

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




## Next steps

- [Troubleshoot on-premises application provisioning](on-premises-ecma-troubleshoot.md)
- [Review known limitations](known-issues.md)
- [On-premises provisioning prerequisites](on-premises-ecma-prerequisites.md)
- [Review prerequisites for on-premises provisioning](on-premises-ecma-prerequisites.md)
