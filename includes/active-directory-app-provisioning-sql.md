This document describes the steps you need to perform to automatically provision and deprovision users from Azure Active Directory (Azure AD) into a SQL database.  
 
For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../articles/active-directory/app-provisioning/user-provisioning.md).

>[!IMPORTANT]
>The default verbosity of the logs is set to `Verbose`. If you are using the SQL connector without Windows Integrated Auth, please set the verbosity to `Error` as described [here](https://docs.microsoft.com/azure/active-directory/app-provisioning/on-premises-ecma-troubleshoot).

## Prerequisites for provisioning to a SQL Database

### On-premises prerequisites

 - A target system, such as a SQL database, in which users can be created, updated, and deleted.
 - A Windows Server 2016 or later computer with an internet-accessible TCP/IP address, connectivity to the target system, and with outbound connectivity to login.microsoftonline.com. An example is a Windows Server 2016 virtual machine hosted in Azure IaaS or behind a proxy. The server should have at least 3 GB of RAM.
 - A computer with .NET Framework 4.7.1.

Depending on the options you select, some of the wizard screens might not be available and the information might be slightly different. For purposes of this configuration, the user object type is used. Use the following information to guide you in your configuration. 

#### Supported systems
* Microsoft SQL Server and Azure SQL
* IBM DB2 10.x
* IBM DB2 9.x
* Oracle 10 and 11g
* Oracle 12c and 18c
* MySQL 5.x

Note: The generic SQL connector requires that column names are case-insensitive. MySQL is case-sensitive on Linux and Postgres is case-sensitive across platforms. As a result, they are not currently supported. 

### Cloud requirements

 - An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). 
 
    [!INCLUDE [active-directory-p1-license.md](active-directory-p1-license.md)]
 - The Hybrid identity administrator role for configuring the provisioning agent and the Application Administrator or Cloud Administrator roles for configuring provisioning in the Azure portal.

## Prepare the sample database
On a server running SQL Server, run the SQL script found in [Appendix A](#appendix-a). This script creates a sample database with the name CONTOSO. This is the database that you'll be provisioning users into.


## Create the DSN connection file
The generic SQL connector is a DSN file to connect to the SQL server. First, you need to create a file with the ODBC connection information.

 1. Start the ODBC management utility on your server.  Use the 64-bit version.
     ![Screenshot that shows ODBC management.](./media/active-directory-app-provisioning-sql/odbc.png)</br>
 2. Select the **File DSN** tab, and select **Add**. 
     ![Screenshot that shows the File DSN tab.](./media/active-directory-app-provisioning-sql/dsn-2.png)</br>
 3. Select **SQL Server Native Client 11.0** and select **Next**. 
     ![Screenshot that shows choosing a native client.](./media/active-directory-app-provisioning-sql/dsn-3.png)</br>
 4. Give the file a name, such as **GenericSQL**, and select **Next**. 
     ![Screenshot that shows naming the connector.](./media/active-directory-app-provisioning-sql/dsn-4.png)</br>
 5. Select **Finish**. 
     ![Screenshot that shows Finish.](./media/active-directory-app-provisioning-sql/dsn-5.png)</br>
 6. Now configure the connection. Enter **APP1** for the name of the server and select **Next**.
     ![Screenshot that shows entering a server name.](./media/active-directory-app-provisioning-sql/dsn-6.png)</br>
 7. Keep Windows authentication and select **Next**.
     ![Screenshot that shows Windows authentication.](./media/active-directory-app-provisioning-sql/dsn-7.png)</br>
 8. Enter the name of the sample database, which is **CONTOSO**.
     ![Screenshot that shows entering a database name.](./media/active-directory-app-provisioning-sql/dsn-8.png)
 9. Keep everything default on this screen, and select **Finish**.
     ![Screenshot that shows selecting Finish.](./media/active-directory-app-provisioning-sql/dsn-9.png)</br>
 10. To check everything is working as expected, select **Test Data Source**. 
     ![Screenshot that shows Test Data Source.](./media/active-directory-app-provisioning-sql/dsn-10.png)</br>
 11. Make sure the test is successful.
     ![Screenshot that shows success.](./media/active-directory-app-provisioning-sql/dsn-11.png)</br>
 12. Select **OK** twice. Close the ODBC Data Source Administrator.



## Download, install and configure the Azure AD Connect Provisioning Agent Package

 1. [Download](https://aka.ms/OnPremProvisioningAgent) the provisioning agent and copy it onto the virtual machine or server that has connectivity to your SQL server.
     >[!NOTE]
     >Please use different provisioning agents for on-premises application provisioning and Azure AD Connect Cloud Sync / HR-driven provisioning. All three scenarios should not be managed on the same agent. 
 1. Open the provisioning agent installer, agree to the terms of service, and select **next**.
 1. Open the provisioning agent wizard, and select **On-premises provisioning** when prompted for the extension you want to enable.
 1. Provide credentials for an Azure AD administrator when you're prompted to authorize. Hybrid identity administrator or global administrator is required.
 1. Select **Confirm** to confirm the installation was successful.
 1. Sign in to the Azure portal.
 1. Go to **Enterprise applications** > **Add a new application**.
 1. Search for the **On-premises ECMA app** application, and add it to your tenant.
 1. Navigate to the provisioning page of your application.
 1. Select **Get started**.
 1. On the **Provisioning** page, change the mode to **Automatic**.
     ![Screenshot that shows changing the mode to Automatic.](.\media\active-directory-app-provisioning-sql\configure-7.png)</br>
 1. On the **On-Premises Connectivity** section, select the agent that you just deployed and select **Assign Agent(s)**.

  
 ## Configure the Azure AD ECMA Connector Host certificate
 1. Launch the Microsoft ECMA2Host Configuration Wizard from the start menu.
 2. After the ECMA Connector Host Configuration starts, leave the default port **8585** and select **Generate** to generate a certificate. The autogenerated certificate will be self-signed as part of the trusted root. The SAN matches the host name.
     ![Screenshot that shows configuring your settings.](.\media\active-directory-app-provisioning-sql\configure-1.png)
 3. Select **Save**.

## Create a generic SQL connector
 1. Select the ECMA Connector Host shortcut on the desktop.
 2. Select **New Connector**.
     ![Screenshot that shows choosing New Connector.](.\media\active-directory-app-provisioning-sql\sql-3.png)</br>
 3. On the **Properties** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
     ![Screenshot that shows entering properties.](.\media\active-directory-app-provisioning-sql\conn-1.png)

     |Property|Value|
     |-----|-----|
     |Name|SQL|
     |Autosync timer (minutes)|120|
     |Secret Token|Enter your own key here. It should be 12 characters minimum.|
     |Extension DLL|For a generic SQL connector, select **Microsoft.IAM.Connector.GenericSql.dll**.|
4. On the **Connectivity** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
     ![Screenshot that shows the Connectivity page.](.\media\active-directory-app-provisioning-sql\conn-2.png)</br>
     
     |Property|Description|
     |-----|-----|
     |DSN File|The Data Source Name file used to connect to the SQL Server instance.|
     |User Name|The username of an individual with rights to the SQL Server instance. It must be in the form of hostname\sqladminaccount for standalone servers or domain\sqladminaccount for domain member servers.|
     |Password|The password of the username just provided.|
     |DN is Anchor|Unless your environment is known to require these settings, don't select the **DN is Anchor** and **Export Type:Object Replace** checkboxes.|
 5. On the **Schema 1** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
     ![Screenshot that shows the Schema 1 page.](.\media\active-directory-app-provisioning-sql\conn-3.png)</br>

     |Property|Value|
     |-----|-----|
     |Object type detection method|Fixed Value|
     |Fixed value list/Table/View/SP|User|
 6. On the **Schema 2** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
     ![Screenshot that shows the Schema 2 page.](.\media\active-directory-app-provisioning-sql\conn-4.png)</br>
 
     |Property|Value|
     |-----|-----|
     |User:Attribute Detection|Table|
     |User:Table/View/SP|Employees|
 7. On the **Schema 3** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
     ![Screenshot that shows the Schema 3 page.](.\media\active-directory-app-provisioning-sql\conn-5.png)

     |Property|Description|
     |-----|-----|
     |Select Anchor for :User|User:ContosoLogin|
     |Select DN attribute for User|AzureID|
8. On the **Schema 4** page, leave the defaults and select **Next**.
     ![Screenshot that shows the Schema 4 page.](.\media\active-directory-app-provisioning-sql\conn-6.png)</br>
 9. On the **Global** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.
     ![Screenshot that shows the Global page.](.\media\active-directory-app-provisioning-sql\conn-7.png)</br>
     
     |Property|Description|
     |-----|-----|
     |Data Source Date Time Format|yyyy-MM-dd HH:mm:ss|
 10. On the **Partitions** page, select **Next**.
     ![Screenshot that shows the Partitions page.](.\media\active-directory-app-provisioning-sql\conn-8.png)</br>
 11. On the **Run Profiles** page, keep the **Export** checkbox selected. Select the **Full import** checkbox and select **Next**.
     ![Screenshot that shows the Run Profiles page.](.\media\active-directory-app-provisioning-sql\conn-9.png)</br>
     
     |Property|Description|
     |-----|-----|
     |Export|Run profile that will export data to SQL. This run profile is required.|
     |Full import|Run profile that will import all data from SQL sources specified earlier.|
     |Delta import|Run profile that will import only changes from SQL since the last full or delta import.|
 12. On the **Export** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes. 
     ![Screenshot that shows the Export page.](.\media\active-directory-app-provisioning-sql\conn-10.png)</br>
     
     |Property|Description|
     |-----|-----|
     |Operation Method|Table|
     |Table/View/SP|Employees|
 13. On the **Full Import** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes. 
     ![Screenshot that shows the Full Import page.](.\media\active-directory-app-provisioning-sql\conn-11.png)</br>
     
     |Property|Description|
     |-----|-----|
     |Operation Method|Table|
     |Table/View/SP|Employees|
 14. On the **Object Types** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.   
      - **Anchor**: This attribute should be unique in the target system. The Azure AD provisioning service will query the ECMA host by using this attribute after the initial cycle. This anchor value should be the same as the anchor value in schema 3.
      - **Query Attribute**: Used by the ECMA host to query the in-memory cache. This attribute should be unique.
      - **DN**: The **Autogenerated** option should be selected in most cases. If it isn't selected, ensure that the DN attribute is mapped to an attribute in Azure AD that stores the DN in this format: CN = anchorValue, Object = objectType.  For additional information on anchors and the DN see [About anchor attributes and distinguished names](../articles/active-directory/app-provisioning/on-premises-application-provisioning-architecture.md#about-anchor-attributes-and-distinguished-names).
     ![Screenshot that shows the Object Types page.](.\media\active-directory-app-provisioning-sql\conn-12.png)</br>
     
     |Property|Description|
     |-----|-----|
     |Target object|User|
     |Anchor|ContosoLogin|
     |Query Attribute|AzureID|
     |DN|AzureID|
     |Autogenerated|Checked|      
 15. The ECMA host discovers the attributes supported by the target system. You can choose which of those attributes you want to expose to Azure AD. These attributes can then be configured in the Azure portal for provisioning.On the **Select Attributes** page, add all the attributes in the dropdown list and select **Next**. 
     ![Screenshot that shows the Select Attributes page.](.\media\active-directory-app-provisioning-sql\conn-13.png)</br>
      The **Attribute** dropdown list shows any attribute that was discovered in the target system and *wasn't* chosen on the previous **Select Attributes** page. 
 
 16. On the **Deprovisioning** page, under **Disable flow**, select **Delete**. Please note that attributes selected on the previous page won't be available to select on the Deprovisioning page. Select **Finish**.
     ![Screenshot that shows the Deprovisioning page.](.\media\active-directory-app-provisioning-sql\conn-14.png)</br>


## Ensure the ECMA2Host service is running
 1. On the server the running the Azure AD ECMA Connector Host, select **Start**.
 2. Enter **run** and enter **services.msc** in the box.
 3. In the **Services** list, ensure that **Microsoft ECMA2Host** is present and running. If not, select **Start**.
     ![Screenshot that shows the service is running.](.\media\active-directory-app-provisioning-sql\configure-2.png)



## Test the application connection
 1. Sign in to the Azure portal.
 2. Go to **Enterprise applications** and the **On-premises ECMA app** application.
 3. Go to **Edit Provisioning**.
 4. Under the **Admin credentials** section, enter the following URL. Replace the `{connectorName}` portion with the name of the connector on the ECMA host. You can also replace `localhost` with the host name.

 |Property|Value|
 |-----|-----|
 |Tenant URL|https://localhost:8585/ecma2host_{connectorName}/scim|

 5. Enter the **Secret Token** value that you defined when you created the connector.
     >[!NOTE]
     >If you just assigned the agent to the application, please wait 10 minutes for the registration to complete. The connectivity test won't work until the registration completes. Forcing the agent registration to complete by restarting the provisioning agent on your server can speed up the registration process. Go to your server, search for **services** in the Windows search bar, identify the **Azure AD Connect Provisioning Agent Service**, right-click the service, and restart.
 7. Select **Test Connection**, and wait one minute.
     ![Screenshot that shows assigning an agent.](.\media\active-directory-app-provisioning-sql\configure-5.png)
 7. After the connection test is successful, select **Save**.</br>
     ![Screenshot that shows testing an agent.](.\media\active-directory-app-provisioning-sql\configure-9.png)
## Assign users to an application
Now that you have the Azure AD ECMA Connector Host talking with Azure AD, you can move on to configuring who's in scope for provisioning. 

>[!IMPORTANT]
>If you were signed in using a Hybrid identity administrator role, you need to sign-out and sign-in with an account that has the app administrator or global admininistrator role, for this section.  The Hybrid identity administrator role does not have permissions to assign users to applications.

 1. In the Azure portal, select **Enterprise applications**.
 2. Select the **On-premises provisioning** application.
 3. On the left, under **Manage**, select **Users and groups**.
 4. Select **Add user/group**.
     ![Screenshot that shows adding a user.](.\media\active-directory-app-provisioning-sql\app-2.png)
5. Under **Users**, select **None Selected**.
     ![Screenshot that shows None Selected.](.\media\active-directory-app-provisioning-sql\app-3.png)
 6. Select users from the right and select the **Select** button.</br>
     ![Screenshot that shows Select users.](.\media\active-directory-app-provisioning-sql\app-4.png)
 7. Now select **Assign**.
     ![Screenshot that shows Assign users.](.\media\active-directory-app-provisioning-sql\app-5.png)

## Configure attribute mappings
Now you need to map attributes between the on-premises application and your SQL server.

#### Configure attribute mapping
 1. In the Azure AD portal, under **Enterprise applications**, select the **Provisioning** page.
 2. Select **Get started**.
 3. Expand **Mappings** and select **Provision Azure Active Directory Users**.
     ![Screenshot that shows provisioning a user.](.\media\active-directory-app-provisioning-sql\configure-10.png)</br>
4. Select **Add New Mapping**.
     ![Screenshot that shows Add New Mapping.](.\media\active-directory-app-provisioning-sql\configure-11.png)</br>
 5. Specify the source and target attributes, and add all the mappings in the following table.
     ![Screenshot that shows saving the mapping.](.\media\active-directory-app-provisioning-sql\app-6.png)</br>
     
     |Mapping type|Source attribute|Target attribute|
     |-----|-----|-----|
     |Direct|userPrincipalName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:ContosoLogin|
     |Direct|objectID|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:AzureID|
     |Direct|mail|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:Email|
     |Direct|givenName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:FirstName|
     |Direct|surName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:LastName|
     |Direct|mailNickname|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:textID|
 
 6. Select **Save**.
     
## Test provisioning
Now that your attributes are mapped, you can test on-demand provisioning with one of your users.
 
 1. In the Azure portal, select **Enterprise applications**.
 2. Select the **On-premises provisioning** application.
 3. On the left, select **Provisioning**.
 4. Select **Provision on demand**.
 5. Search for one of your test users, and select **Provision**.
     ![Screenshot that shows testing provisioning.](.\media\active-directory-app-provisioning-sql\configure-13.png)

## Start provisioning users
 1. After on-demand provisioning is successful, change back to the provisioning configuration page. Ensure that the scope is set to only assigned users and groups, turn provisioning **On**, and select **Save**.
 
    ![Screenshot that shows Start provisioning.](.\media\active-directory-app-provisioning-sql\configure-14.png)
2. Wait several minutes for provisioning to start. It might take up to 40 minutes. After the provisioning job has been completed, as described in the next section, you can change the provisioning status to **Off**, and select **Save**. This action stops the provisioning service from running in the future.

## Check that users were successfully provisioned
After waiting, check the SQL database to ensure users are being provisioned.

 ![Screenshot checking that users are provisioned.](.\media\active-directory-app-provisioning-sql\configure-15.png)

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





