<properties linkid="manage-services-sql-reporting" urlDisplayName="SQL Reporting" pageTitle="SQL Reporting - Windows Azure service management" metaKeywords="" metaDescription="A tutorial that teaches you how to use the Windows Azure Management portal to create and use a SQL Reporting service." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


#Create and use a reporting service in Windows Azure SQL Reporting#

In this tutorial you will learn about how to create and manage a reporting service on Windows Azure SQL Reporting.

##What is SQL Reporting?
SQL Reporting is a cloud-based reporting service built on Windows Azure and SQL Server Reporting Services technologies. By using SQL Reporting, you can easily provision and deploy reporting solutions to the cloud, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing.

To get started with SQL Reporting, you must have a Windows Azure subscription. You can use an existing subscription, a new subscription, or the free trial subscription. For more information, see [Windows Azure Offers][]. 

##Table of Contents

* [Create a report server][]
* [Create a user and assign roles][]
* [Upload a report][]
* [Download a report][]
* [Run a report][]
* [Create a data source][]
* [Create a folder][]
* [Update permissions on a Report item][]
* [Next Steps][]

<h2><a id="CreateRSS"></a>Create a reporting service</h2>
Use Quick Create to easily create a new reporting service in SQL Reporting. You'll choose a region and provide the user name and password of the server administrator.

1. On the navigation pane, click **SQL Reporting**. 

	![SQLReportNavPane][]

2. Click **NEW**, and then click **Quick Create**. 

3. Enter a descriptive name for the service. The service name is used only in the portal. The actual URL used to access the service will be a 10 character GUID.

4. From the **Region** list, select a region. You can create only one reporting service in each region for each subscription.

5. Type the user name of the reporting service administrator and in Password and Confirm Password type the administrator password. 

	Be sure to keep this information in a safe place. You need it to access the report server. 

5.	Click **Create SQL Reporting Service**.

The reporting service is created using the current subscription.
The reporting service name is a 10 character GUID composed of letters and numbers.

<h2><a id="CreateUser"></a>Create a user and assign roles</h2>
1.	Click the name of service you just created. 

	![SQLReportListView][]

2.	Click **Users** at the top of the page, and then click **Create** at the bottom of hte page. 

3.	The **Create a new user** dialog box opens. 

4.	 Enter user name and password, select an item role, such as **Browser**. Click the check mark.
	
	User names must be unique. If you provide a duplicate name, an error message displays and you cannot continue until you change the user name to one that is unique.


<h2><a id="Upload"></a>Upload a report</h2>
1.	Click **Items** at the top of the page to manage items. 

2. Click **Add** , and then click **Upload Report**.
	
3.	The **Upload Report** dialog box opens.

4.	Click the ellipsis (…) button to the right of the Report Definition file box and browse to the location of the report that you want to upload. The report file must be .rdl file type.

5.	Select the report and click **Open**.

7.	You return to the **Upload Report** dialog box. The name of the report shows in the Definition file and Name boxes.

8.	Optionally, rename the report by typing a different name in Name.

	The upload process does not overwrite an existing report with the same name; instead, the upload fails. If you previously uploaded the report to the root of the report server or the same folder, you must either first delete the existing report on the server or use a different name when you upload the report.

	The report server can host multiple reports with the same names when they are in different folders. 

9.	Optionally, type a description in the Description box.
 
10.	Click the check mark to upload the file.

<h2><a id="DownloadReport"></a>Download a report</h2>
1.	On the Items page, you can select an existing report and download it.

2.	Click the report in the Report list, click the down arrow to the right of the report name, and then click **download**.

5.	The **Download Report** dialog box opens.
6.	Click the ellipsis (…) next to the Report box and browse to the location where you want to download the report.
 
7.	Type the name of the report, and click **Save**.

8.	You return to **Download Report** and the name of the report appears in Report.

9.	You cannot change the report name. If you want change the name, update the properties on the report. For more information, see [How to: Update Permissions on Report Server Item (Windows Azure SQL Reporting)][]. 

10.	Close the dialog box.

<h2><a id="RunReportRS"></a>Run a report : from the portal</h2>
1.	In the management portal, click the reporting service to which you uploaded or deployed the report that you want to run. 

2.	On the Dashboard, click the link [Link] next to the Web service URL. 

3.	On the sign in page, enter the credentials of a user with permission to run reports.

4.	The report renders in the Report Viewer in a new browser window.

5.	If the report has parameters, select parameter values in the Report Viewer and click View Report. 

6.	Optionally, explore the report by displaying different report pages, searching for values in the report, and exporting the report to a different format.

<h2><a id="CreateDS"></a>Create a data source</h2>
1.	Use the **Items** page to create a shared data source. 

2.	If you do not want the new data source in the root folder of the report server, navigate to the folder in which you want to create the data source. 

3.	On the ribbon, click **Add** and then click **Create Data Source**. The **Create Data Source** dialog box opens. You must have a SQL Database under the same subscription used for the reporting service. The database for which you are creating the shared data source must exist in the SQL Database instance. 

4.	Type a name in the **Name** box. Names of data sources in a folder must be unique. Optionally, type a description in **Description**.

5.	If you want the data source to be available to use in reports, select **Enable**. If you do not want to enable the data source when you first create it, you can do it later when you are ready to use it.

6.	Type or paste a connection string. The format of the connection string is: 
	 
		Data Source= <SQL Database service>; Initial Catalog= <SQL Database instance>; Encrypt=True;
	
8.	Choose how the data source connects to the SQL Database instance. You can use either of the following two authentication types:

	* **Prompt for credentials** to prompt users to provide a user name and password when they run the report. Optionally, update the default prompt text: **Type the user name and password to use in order to access the data source:**. 
	* **Credentials stored securely in the report server** to provide a user name and a password that is stored on the report server, separately from the report.

9.	Close the dialog box.

<h2><a id="CreateFolder"></a>Create a folder</h2>
1.	Navigate to the folder in which you want to create a new folder.

2.	Breadcrumbs provide a visual presentation of the path from the root folder to the current folder. 
 
3.	Click **Create** in the **Folder** category on the ribbon.
 
4.	In **Name**, type the folder name.
5.	Optionally, in **Description**, type a description.

6.	The description is included in the folder entry in the folder list. 
7.	Click **OK**.

8.	By default, a folder inherits the role assignments of its parent folder. After you create the folder, you can update its role assignments. For more information, see [How to: Update Permissions on Report Server Item (Windows Azure SQL Reporting)][].

<h2><a id="UpdatePerm"></a>Update permissions on a Report item</h2>

1.	To update permissions on a report item, Click the row that contains the report items, click the down arrow to the right of the folder, and then click Permissions. The Manage Permissions dialog box opens.
 
	To update permissions of a Folder, you can optionally click Permissions in the Folder category of the portal ribbon.

	Roles assignments of an item are automatically inherited from the folder that contains the item.

	By default, the root folder has the permissions granted to the report server administrator. When you update permissions on a folder, permissions on its child folders are updated as well. 
 
	Because the root folder has no physical folder for you to select, you can set permissions on the root folder of the server only by clicking Permissions in the Folder category on the toolbar. 

2.	Optionally, locate users by typing in the box next to the search icon or filter by role by selecting a role in the role list that is located to the right of the box.

3.	Click the user for whom you want to update role assignments on the selected folder.

	The user list includes the report server administrator. This user is grayed out and you cannot change its item roles. The administrator is automatically assigned the Content Manager and System Administrator roles when it is first created. These roles provide the highest permissions and you cannot lessen the administrator’s permissions by assigning item roles with lower permissions.

4.	Select and clear role assignments.

5.	Close the dialog box.

<h2><a id="NextSteps"></a>Next Steps</h2>

Now that you've learned the basics of SQL Reporting administration, see [Windows Azure SQL Reporting][] on MSDN.


[Create a report server]: #CreateRSS
[Create a user and assign roles]: #CreateUser
[Upload a report]: #Upload
[Download a report]: #DownloadReport
[Run a report]: #RunReportRS
[Create a data source]: #CreateDS
[Create a folder]: #CreateFolder
[Update permissions on a Report item]: #UpdatePerm
[Next Steps]: #NextSteps


[Windows Azure SQL Reporting]: http://msdn.microsoft.com/en-us/library/windowsazure/gg430130

[SQL Database TechNet WIKI]: http://social.technet.microsoft.com/wiki/contents/articles/2267.sql-azure-technet-wiki-articles-index-en-us.aspx

[Windows Azure Offers]: http://www.windowsazure.com/en-us/

[How to: Update Permissions on Report Server Item (Windows Azure SQL Reporting)]: http://msdn.microsoft.com/en-us/library/windowsazure/hh403965.aspx

[Finding and Viewing Reports with a Browser (Report Builder and SSRS)]: http://technet.microsoft.com/library/dd255286.aspx

[How to: Update Permissions on Report Server Item (Windows Azure SQL Reporting)]: http://msdn.microsoft.com/en-us/library/windowsazure/hh403965.aspx

[SQLReportNavPane]: ../media/SQLReportNavPane.png
[SQLReportListView]:../media/SQLReportListView.png
[Permissions]: ../media/Permissions_button.png
[FolderProperties]: ../media/FolderProperties.png
[CreateFolderOption]: ../media/CreateFolder_button.png
[ServerHomePath]: ../media/ServerHome_path.png
[EditDataSource]: ../media/EditDS.png
[CreateDataSourceDialog]: ../media/CreateDS_dialog.png
[CreateDataSourceOption]: ../media/CreateDS_button.png
[ReportServer]: ../media/ReportServer_page.png
[ServerHome]: ../media/ServerHome.png
[UploadReportDialog]: ../media/UploadReport_dialog.png
[UploadReportOption]: ../media/UploadItem_button.png
[CreateUserCred]: ../media/CreateUser_Credentials.png
[ManageUserDialog]: ../media/ManagerUser_dialog.png
[ManageUserOption]: ../media/ManageUser_button.png
[CreateServerCred]: ../media/CreateServer_Credentials.png
[CreateServerDialog]: ../media/CreateServer_dialog.png
[CreateServerOption]: ../media/CreateServer_button.png
