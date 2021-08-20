---
title:  Azure AD ECMA Connector Host generic SQL connector tutorial
description: This tutorial describes how to use the on-premises application provisioning generic SQL connector.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 07/13/2021
ms.subservice: hybrid
ms.author: billmath
ms.reviewer: arvinh
ms.collection: M365-identity-device-management
---



# Azure AD ECMA Connector Host generic SQL connector tutorial

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. To request access to the capability, use the [access request form](https://aka.ms/onpremprovisioningpublicpreviewaccess). We'll open the preview to more customers and connectors over the next few months as we prepare for general availability.

This tutorial describes the steps you need to perform to automatically provision and deprovision users from Azure Active Directory (Azure AD) into a SQL database. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).

This tutorial covers how to set up and use the generic SQL connector with the Azure AD ECMA Connector Host. 

## Prepare the sample database
On a server running SQL Server, run the SQL script found in [Appendix A](#appendix-a). This script creates a sample database with the name CONTOSO. This is the database that you'll be provisioning users into.


## Create the DSN connection file
The generic SQL connector is a DSN file to connect to the SQL server. First, you need to create a file with the ODBC connection information.

1. Start the ODBC management utility on your server.
  
     ![Screenshot that shows ODBC management.](./media/tutorial-ecma-sql-connector/odbc.png)
1. Select the **File DSN** tab, and select **Add**. 
 
     ![Screenshot that shows the File DSN tab.](./media/tutorial-ecma-sql-connector/dsn-2.png)
1. Select **SQL Server Native Client 11.0** and select **Next**. 
 
     ![Screenshot that shows choosing a native client.](./media/tutorial-ecma-sql-connector/dsn-3.png)
1. Give the file a name, such as **GenericSQL**, and select **Next**. 
 
     ![Screenshot that shows naming the connector.](./media/tutorial-ecma-sql-connector/dsn-4.png)
1. Select **Finish**. 
 
     ![Screenshot that shows Finish.](./media/tutorial-ecma-sql-connector/dsn-5.png)
1. Now configure the connection. Enter **APP1** for the name of the server and select **Next**.

     ![Screenshot that shows entering a server name.](./media/tutorial-ecma-sql-connector/dsn-6.png)
1. Keep Windows authentication and select **Next**.

     ![Screenshot that shows Windows authentication.](./media/tutorial-ecma-sql-connector/dsn-7.png)
1. Enter the name of the sample database, which is **CONTOSO**.

     ![Screenshot that shows entering a database name.](./media/tutorial-ecma-sql-connector/dsn-8.png)
1. Keep everything default on this screen, and select **Finish**.

     ![Screenshot that shows selecting Finish.](./media/tutorial-ecma-sql-connector/dsn-9.png)
1. To check everything is working as expected, select **Test Data Source**. 
 
     ![Screenshot that shows Test Data Source.](./media/tutorial-ecma-sql-connector/dsn-10.png)
1. Make sure the test is successful.

     ![Screenshot that shows success.](./media/tutorial-ecma-sql-connector/dsn-11.png)
1. Select **OK** twice. Close the ODBC Data Source Administrator.

## Download and install the Azure AD Connect Provisioning Agent Package

 1. Sign in to the server you'll use with enterprise admin permissions.
 1. Sign in to the Azure portal, and then go to **Azure Active Directory**.
 1. On the menu on the left, select **Azure AD Connect**.
 1. Select **Manage cloud sync** > **Review all agents**.
 1. Download the Azure AD Connect Provisioning Agent Package from the Azure portal.
 1. Accept the terms and select **Download**.
 1. Run the Azure AD Connect provisioning installer AADConnectProvisioningAgentSetup.msi.
 1. On the **Microsoft Azure AD Connect Provisioning Agent Package** screen, select **Install**.
 
    ![Screenshot that shows the Microsoft Azure AD Connect Provisioning Agent Package screen.](media/on-premises-ecma-install/install-1.png)</br>
 1. After this operation finishes, the configuration wizard starts. Select **Next**.
 
    ![Screenshot that shows the Welcome screen.](media/on-premises-ecma-install/install-2.png)</br>
 1. On the **Select Extension** screen, select **On-premises application provisioning (Azure AD to application)** and select **Next**. 
 
    ![Screenshot that shows the Select Extension screen.](media/on-premises-ecma-install/install-3.png)</br>
 1. Use your global administrator account and sign in to Azure AD.
 
     ![Screenshot that shows the Azure sign-in screen.](media/on-premises-ecma-install/install-4.png)</br>
 1. On the **Agent configuration** screen, select **Confirm**.
 
     ![Screenshot that shows confirming the installation.](media/on-premises-ecma-install/install-5.png)</br>
 1. After the installation is complete, you should see a message at the bottom of the wizard. Select **Exit**.
 
     ![Screenshot that shows the Exit button.](media/on-premises-ecma-install/install-6.png)</br>
 
## Configure the Azure AD ECMA Connector Host
1. On the desktop, select the ECMA shortcut.
1. After the ECMA Connector Host Configuration starts, leave the default port **8585** and select **Generate** to generate a certificate. The autogenerated certificate will be self-signed as part of the trusted root. The SAN matches the host name.

     ![Screenshot that shows configuring your settings.](.\media\on-premises-ecma-configure\configure-1.png)
1. Select **Save**.

## Create a generic SQL connector
 1. Select the ECMA Connector Host shortcut on the desktop.
 1. Select **New Connector**.
 
     ![Screenshot that shows choosing New Connector.](.\media\on-premises-sql-connector-configure\sql-1.png)

 1. On the **Properties** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
 
     ![Screenshot that shows entering properties.](.\media\tutorial-ecma-sql-connector\conn-1.png)

     |Property|Value|
     |-----|-----|
     |Name|SQL|
     |Autosync timer (minutes)|120|
     |Secret Token|Enter your own key here. It should be 12 characters minimum.|
       |Extension DLL|For a generic SQL connector, select **Microsoft.IAM.Connector.GenericSql.dll**.|
 1. On the **Connectivity** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
 
     ![Screenshot that shows the Connectivity page.](.\media\tutorial-ecma-sql-connector\conn-2.png)

     |Property|Value|
     |-----|-----|
     |DSN File|Go to the file created at the beginning of the tutorial in "Create the DSN connection file."|
     |User Name|contoso\administrator|
     |Password|Enter the administrator's password.|
 1. On the **Schema 1** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
 
     ![Screenshot that shows the Schema 1 page.](.\media\tutorial-ecma-sql-connector\conn-3.png)

     |Property|Value|
     |-----|-----|
     |Object type detection method|Fixed Value|
     |Fixed value list/Table/View/SP|User|
 1. On the **Schema 2** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
 
     ![Screenshot that shows the Schema 2 page.](.\media\tutorial-ecma-sql-connector\conn-4.png)

     |Property|Value|
     |-----|-----|
     |User:Attribute Detection|Table|
     |User:Table/View/SP|Employees|
 1. On the **Schema 3** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
 
     ![Screenshot that shows the Schema 3 page.](.\media\tutorial-ecma-sql-connector\conn-5.png)

     |Property|Description|
     |-----|-----|
     |Select Anchor for :User|User:ContosoLogin|
     |Select DN attribute for User|AzureID|
 1. On the **Schema 4** page, leave the defaults and select **Next**.
 
     ![Screenshot that shows the Schema 4 page.](.\media\tutorial-ecma-sql-connector\conn-6.png)
 1. On the **Global** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.
 
     ![Screenshot that shows the Global page.](.\media\tutorial-ecma-sql-connector\conn-7.png)

     |Property|Description|
     |-----|-----|
     |Data Source Date Time Format|yyyy-MM-dd HH:mm:ss|
 1. On the **Partitions** page, select **Next**.
 
     ![Screenshot that shows the Partitions page.](.\media\tutorial-ecma-sql-connector\conn-8.png)

 1. On the **Run Profiles** page, keep the **Export** checkbox selected. Select the **Full import** checkbox and select **Next**.
 
     ![Screenshot that shows the Run Profiles page.](.\media\tutorial-ecma-sql-connector\conn-9.png)

 1. On the **Export** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes. 
 
     ![Screenshot that shows the Export page.](.\media\tutorial-ecma-sql-connector\conn-10.png)

     |Property|Description|
     |-----|-----|
     |Operation Method|Table|
     |Table/View/SP|Employees|
 
 1. On the **Full Import** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes. 
 
     ![Screenshot that shows the Full Import page.](.\media\tutorial-ecma-sql-connector\conn-11.png)

     |Property|Description|
     |-----|-----|
     |Operation Method|Table|
     |Table/View/SP|Employees|
 
 1. On the **Object Types** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.

      - **Anchor**: This attribute should be unique in the target system. The Azure AD provisioning service will query the ECMA host by using this attribute after the initial cycle. This anchor value should be the same as the anchor value in schema 3.
      - **Query Attribute**: Used by the ECMA host to query the in-memory cache. This attribute should be unique.
      - **DN**: The **Autogenerated** option should be selected in most cases. If it isn't selected, ensure that the DN attribute is mapped to an attribute in Azure AD that stores the DN in this format: CN = anchorValue, Object = objectType.

        ![Screenshot that shows the Object Types page.](.\media\tutorial-ecma-sql-connector\conn-12.png)

      |Property|Description|
      |-----|-----|
      |Target object|User|
      |Anchor|ContosoLogin|
      |Query Attribute|AzureID|
      |DN|AzureID|
      |Autogenerated|Checked|
      

 1. On the **Select Attributes** page, add all the attributes in the dropdown list and select **Next**. 
 
     ![Screenshot that shows the Select Attributes page.](.\media\tutorial-ecma-sql-connector\conn-13.png)

      The **Attribute** dropdown list shows any attribute that was discovered in the target system and *wasn't* chosen on the previous **Select Attributes** page. 
 1. On the **Deprovisioning** page, under **Disable flow**, select **Delete**. Select **Finish**.
 
     ![Screenshot that shows the Deprovisioning page.](.\media\tutorial-ecma-sql-connector\conn-14.png)

## Ensure ECMA2Host service is running
1. On the server the running the Azure AD ECMA Connector Host, select **Start**.
1. Enter **run** and enter **services.msc** in the box.
1. In the **Services** list, ensure that **Microsoft ECMA2Host** is present and running. If not, select **Start**.

   ![Screenshot that shows the service is running.](.\media\on-premises-ecma-configure\configure-2.png)

## Add an enterprise application
1. Sign in to the Azure portal as an application administrator
1. In the portal, go to **Azure Active Directory** > **Enterprise applications**.
1. Select **New application**.

   ![Screenshot that shows adding a new application.](.\media\on-premises-ecma-configure\configure-4.png)
1. Search the gallery for **On-premises ECMA app** and select **Create**.

## Configure the application and test
1. After it has been created, select the **Provisioning** page.
1. Select **Get started**.

     ![Screenshot that shows get started.](.\media\on-premises-ecma-configure\configure-1.png)
1. On the **Provisioning** page, change the mode to **Automatic**.

     ![Screenshot that shows changing the mode to Automatic.](.\media\on-premises-ecma-configure\configure-7.png)
1. In the **On-Premises Connectivity** section, select the agent that you just deployed and select **Assign Agent(s)**.
     >[!NOTE]
     >After you add the agent, wait 10 minutes for the registration to complete. The connectivity test won't work until the registration completes.
     >
     >Alternatively, you can force the agent registration to complete by restarting the provisioning agent on your server. Go to your server, search for **services** in the Windows search bar, identify the **Azure AD Connect Provisioning Agent Service**, right-click the service, and restart.
   
     ![Screenshot that shows restarting an agent.](.\media\on-premises-ecma-configure\configure-8.png)
1.  After 10 minutes, under the **Admin credentials** section, enter the following URL. Replace the `connectorName` portion with the name of the connector on the ECMA host. You can also replace `localhost` with the host name.

     |Property|Value|
     |-----|-----|
     |Tenant URL|https://localhost:8585/ecma2host_connectorName/scim|

1. Enter the **Secret Token** value that you defined when you created the connector.
1. Select **Test Connection**, and wait one minute.

     ![Screenshot that shows assigning an agent.](.\media\on-premises-ecma-configure\configure-5.png)
1. After the connection test is successful, select **Save**.</br>

     ![Screenshot that shows testing an agent.](.\media\on-premises-ecma-configure\configure-9.png)

## Assign users to an application
Now that you have the Azure AD ECMA Connector Host talking with Azure AD, you can move on to configuring who's in scope for provisioning. 

1. In the Azure portal, select **Enterprise applications**.
1. Select the **On-premises provisioning** application.
1. On the left, under **Manage**, select **Users and groups**.
1. Select **Add user/group**.

     ![Screenshot that shows adding a user.](.\media\tutorial-ecma-sql-connector\app-2.png)
1. Under **Users**, select **None Selected**.

     ![Screenshot that shows None Selected.](.\media\tutorial-ecma-sql-connector\app-3.png)
1. Select users from the right and select the **Select** button.</br>

     ![Screenshot that shows Select users.](.\media\tutorial-ecma-sql-connector\app-4.png)
1. Now select **Assign**.

     ![Screenshot that shows Assign users.](.\media\tutorial-ecma-sql-connector\app-5.png)

## Configure attribute mappings
Now you need to map attributes between the on-premises application and your SQL server.

#### Configure attribute mapping
 1. In the Azure AD portal, under **Enterprise applications**, select the **Provisioning** page.
 1. Select **Get started**.
 1. Expand **Mappings** and select **Provision Azure Active Directory Users**.
 
    ![Screenshot that shows provisioning a user.](.\media\on-premises-ecma-configure\configure-10.png)
 1. Select **Add New Mapping**.
 
     ![Screenshot that shows Add New Mapping.](.\media\on-premises-ecma-configure\configure-11.png)
 1. Specify the source and target attributes, and add all the mappings in the following table.

      |Mapping type|Source attribute|Target attribute|
      |-----|-----|-----|
      |Direct|userPrincipalName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:ContosoLogin|
      |Direct|objectID|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:AzureID|
      |Direct|mail|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:Email|
      |Direct|givenName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:FirstName|
      |Direct|surName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:LastName|
      |Direct|mailNickname|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:textID|

 1. Select **Save**.
 
     ![Screenshot that shows saving the mapping.](.\media\tutorial-ecma-sql-connector\app-6.png)

## Test provisioning
Now that your attributes are mapped, you can test on-demand provisioning with one of your users.
 
 1. In the Azure portal, select **Enterprise applications**.
 1. Select the **On-premises provisioning** application.
 1. On the left, select **Provisioning**.
 1. Select **Provision on demand**.
 1. Search for one of your test users, and select **Provision**.
 
     ![Screenshot that shows testing provisioning.](.\media\on-premises-ecma-configure\configure-13.png)

## Start provisioning users
 1. After on-demand provisioning is successful, change back to the provisioning configuration page. Ensure that the scope is set to only assigned users and groups, turn provisioning **On**, and select **Save**.
 
    ![Screenshot that shows Start provisioning.](.\media\on-premises-ecma-configure\configure-14.png)
 1. Wait several minutes for provisioning to start. It might take up to 40 minutes. After the provisioning job has been completed, as described in the next section, you can change the provisioning status to **Off**, and select **Save**. This action stops the provisioning service from running in the future.

## Check that users were successfully provisioned
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
