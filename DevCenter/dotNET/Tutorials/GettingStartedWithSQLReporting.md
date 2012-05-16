#Getting started with Windows Azure SQL Reporting#
In this tutorial you will learn about how to manage an instance of SQL Reporting report server and other administrative tasks through SQL Reporting Management portal.

##What is SQL Reporting?
Windows Azure SQL Reporting is a cloud-based reporting service built on Windows Azure and SQL Server Reporting Services technologies. By using SQL Reporting, you can easily provision and deploy reporting solutions to the cloud, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing.

To get started with SQL Reporting, you must have a Windows Azure subscription. You can use an existing subscription, a new subscription, or the free trial subscription. For more information, see [Windows Azure Platform Offers][]. 

##Table of Contents

* [Create a report server][]
* [Create a user and assign roles][]
* [Upload a report][]
* [Download a report][]
* [Run a report : from report server][]
* [Run a report : from SQL Reporting Management Portal][]
* [Create a data source][]
* [Edit a shared data source][]
* [Create a folder][]
* [Edit properties of a folder][]
* [Update permissions on a Report item][]
* [Next Steps][]


<h2 id="CreateRSS">Create a report server</h2>
Use the **Create Server** wizard to quickly and easily create a new report server in SQL Reporting. The wizard guides you though the steps to choose a subscription and region and provide the user name and password of the server administrator.

1. On the taskbar, click **Create** in the **Server** category. The **Create Server** wizard opens. 

	![CreateServerOption][]

2. On the **Create a SQL Reporting server** page, from the **Subscription** list select the subscription to which you want to add the report server. 

	![CreateServerDialog][]

3. From the **Region** list, select a region. You can create only one report server in each region for each subscription. Click **Next**.
4.	On this page, type the user name of the report server administrator and in Password and Confirm Password type the administrator password. 

	Be sure to keep this information in a safe place. You need it to access the report server. 

	![CreateServerCred][]

5.	Click **Finish**.

The report server is created using the specified subscription.
The report server name is a 10 character GUID. If you do not see the server, expand the subscription in which you created it.


<h2 id="CreateUser">Create a user and assign roles</h2>
1.	Click **Manage** in the **User** category of the taskbar. The **Manage Users** dialog box opens. 

	![ManageUserOption][]

2.	Optionally, review the list of existing users. To create a new user, Click **Create User** button. 

	![ManageUserDialog][]

3.	The **Create User** dialog box opens. 
	
	![CreateUserCred][]

4.	 Enter user name and password, select an item role, and optionally assign a system role. Click OK.
	
	_User names must be unique. If you provide a duplicate name, an error message displays and you cannot continue until you change the user name to one that is unique._

5.	**Create User** dialog closes and you return to **Manage Users**.
6.	Click **Close** to end the operation, and return to SQL Reporting portal.


<h2 id="Upload">Upload a report</h2>
1.	Open the SQL Reporting report server to which you want to upload a report. 

	![UploadReportOption][]
	
2.	If you do not want to upload the report to the root of the report server, navigate to the folder to which you want to upload the report. 

	![UploadReportDialog][]
 
3.	On the ribbon of the SQL Reporting portal, click **Upload** in the **Report** category.
4.	The **Upload Report** dialog box opens.

5.	Click the ellipsis (…) button to the right of the Definition file box and browse to the location of the report that you want to upload.

6.	Select the report and click Open.

7.	You return to the **Upload Report** dialog box. The name of the report shows in the Definition file and Name boxes.

8.	Optionally, rename the report by typing a different name in Name.

	_The upload process does not overwrite an existing report with the same name; instead, the upload fails. If you previously uploaded the report to the root of the report server or the same folder, you must either first delete the existing report on the server or use a different name when you upload the report._

	_The report server can host multiple reports with the same names when they are in different folders._ 
9.	Optionally, type a description in the Description box.
 
10.	Click **Upload**.


<h2 id="DownloadReport">Download a report</h2>
1.	Open the SQL Reporting report server from which you want to download a report.

2.	If the report is not in the root SQL Reporting server folder, navigate to the folder that contains the report.
 
3.	The server name, a 10 character identifier such as eny7ct1w32, represents the root folder of the server. It is always the first item in the bread crumbs at the bottom of the Server Home area of the portal.
4.	Click the report in the Report list, click the down arrow to the right of the report name, and then click **download**.

5.	The **Download Report** dialog box opens.
6.	Click the ellipsis (…) next to the Report box and browse to the location where you want to download the report.
 
7.	Type the name of the report, and click Save.
8.	You return to **Download Report** and the name of the report appears in Report.

9.	You cannot change the report name. If you want change the name, update the properties on the report. For more information, see [How to: Update Permissions on Report Server Item (Windows Azure SQL Reporting)][]. 
10.	Click **OK**.


<h2 id="RunReportRS">Run a report : from report server</h2>
1.	In the SQL Reporting portal, expand the subscriptions and click the report server to which you uploaded or deployed the report that you want to run. 

2.	Click the link [Link] next to the Web service URL. 

	![ServerHome][]

3.	If you are not signed in to SQL Reporting, the sign in page opens.
4.	On the sign in page, enter the credentials of a user with permission to run reports.

5.	The report server opens.
6.	Navigate to the folder that contains the report that you want run.

7.	If you want to ascend the folder hierarchy, click To Parent Directory.
	
	_The report server opens at the root folder. If you navigated to a folder, before you clicked [Link], you need to navigate to it again._ 
8.	Click the report name. 
	
	![ReportServer][]

9.	Depending on the type of credentials that the report uses, you might be prompted for a user name and password to access the report data source.
10.	The report renders in the Report Viewer in a new browser window.

11.	If the report has parameters, select parameter values in the Report Viewer and click View Report. 
12.	Optionally, explore the report by displaying different report pages, searching for values in the report, and exporting the report to a different format.



<h2 id="RunReportRMP">Run a report : from SQL Reporting Management Portal</h2>
1.	In the SQL Reporting portal, expand the subscriptions and click the report server to which you uploaded or deployed the report that you want to run.

2.	If the report is not in the root folder of the report server, click through the folder hierarchy to the folder that contains the report. 
3.	In the report server content pane, in the Report list, click the report name.

4.	The report renders in the Report Viewer in a new browser window.
5.	Depending on the type of credentials that the report uses, you might be prompted for a user name and password to access the report data source.

6.	If the report has parameters, select parameter values in the Report Viewer and click View Report.
 
7.	Optionally, explore the report by displaying different report pages, searching for values in the report, and exporting the report to a different format.
8.	For more information, see [Finding and Viewing Reports with a Browser (Report Builder and SSRS)][].



<h2 id="CreateDS">Create a data source</h2>
1.	Open the SQL Reporting server on which you want to create a new shared data source. 

2.	If you do not want the new data source in the root folder of the report server, navigate to the folder in which you want to create the data source. 
3.	On the ribbon, click **Create** in the **Data Source** category on the toolbar. The **Create Data Source** dialog box opens. 

	![CreateDataSourceOption][]

	![CreateDataSourceDialog][]

4.	Type a name in the **Name** box. Names of data sources in a folder must be unique. 
5.	Optionally, type a description in **Description**.

6.	If you want the data source to be available to use in reports, select **Enable**. If you do not want to enable the data source when you first create it, you can do it later when you are ready to use it.
7.	Type or paste a connection string. The format of the connection string is: 
	 
		Data Source= <SQL Azure Database service>; Initial Catalog= <SQL Azure Database>; Encrypt=True;
	
8.	Choose how the data source connects to the Windows Azure SQL Database. You can use either of the following two authentication types:
	* **Prompt for credentials** to prompt users to provide a user name and password when they run the report. Optionally, update the default prompt text: **Type the user name and password to use in order to access the data source:**. 
	* **Credentials stored securely in the report server** to provide a user name and a password that is stored on the report server, separately from the report.
9.	Click **OK**.



<h2 id="EditDS">Edit a shared data source</h2>
1.	Open the SQL Reporting server on which you want to edit a shared data source.
 
2.	Navigate to the folder that contains the data source. 
3.	In the **Data Source** list, click the data source, click the down arrow to the right of the data source name, and then click **Properties**. 

	![EditDataSource][]
 
4.	The **Edit Data Source** dialog box opens.
5.	Edit options. 

6.	Optionally, click **Test Connection** to verify that the updated connection works. 
7.	Click **OK**.


<h2 id="CreateFolder">Create a folder</h2>
1.	Navigate to the folder in which you want to create a new folder.
2.	Breadcrumbs provide a visual presentation of the path from the root folder to the current folder. 

	![CreateFolderOption][]
 
3.	Click **Create** in the **Folder** category on the ribbon.

	![CreateFolderOption][]
 
4.	In **Name**, type the folder name.
5.	Optionally, in **Description**, type a description.

6.	The description is included in the folder entry in the folder list. 
7.	Click **OK**.

8.	By default, a folder inherits the role assignments of its parent folder. After you create the folder, you can update its role assignments. For more information, see [How to: Update Permissions on Report Server Item (Windows Azure SQL Reporting)][].



<h2 id="EditPropFolder">Edit properties of a folder</h2>
1.	Open the SQL Reporting server on which you want to update folder properties. 

2.	If the folder is not in the root of the report server, navigate to the folder that contains the folder that you want. 
	
	_To reverse the navigation, click the breadcrumbs at the bottom of the Server Home area of the portal. The server name, a 10 character identifier such as 8wr5mkxw8i, represents the root folder of the server. It is always the first bread crumb._
 
	![ServerHomePath][]

3.	In the Folder list, click the folder, click the down arrow to the right of the folder name, and then click Properties.

	![FolderProperties][]
 
4.	The Edit Folder dialog box opens.
5.	Update the name and description and click OK. 


<h2 id="UpdatePerm">Update permissions on a Report item</h2>
1.	To update permissions on a report item, Click the row that contains the report items, click the down arrow to the right of the folder, and then click Permissions. The Manage Permissions dialog box opens.

	![FolderProperties][]
 
	To update permissions of a Folder, you can optionally click Permissions in the Folder category of the portal ribbon.
	 
	![Permissions][]

	Roles assignments of an item are automatically inherited from the folder that contains the item.

	By default, the root folder has the permissions granted to the report server administrator. When you update permissions on a folder, permissions on its child folders are updated as well. 
 
	_Because the root folder has no physical folder for you to select, you can set permissions on the root folder of the server only by clicking Permissions in the Folder category on the toolbar._ 

2.	Optionally, locate users by typing in the box next to the search icon or filter by role by selecting a role in the role list that is located to the right of the box.
3.	Click the user for whom you want to update role assignments on the selected folder.

	_The user list includes the report server administrator. This user is grayed out and you cannot change its item roles. The administrator is automatically assigned the Content Manager and System Administrator roles when it is first created. These roles provide the highest permissions and you cannot lessen the administrator’s permissions by assigning item roles with lower permissions._
4.	Select and clear role assignments.

5.	Click **OK**.

<h2 id="NextSteps">Next Steps</h2>

Now that you've learned the basics of SQL Reporting administration, to learn more about SQL Reporting and usage, see [Windows Azure SQL Reporting][] on MSDN.


[Create a report server]: #CreateRSS
[Create a user and assign roles]: #CreateUser
[Upload a report]: #Upload
[Download a report]: #DownloadReport
[Run a report : from report server]: #RunReportRS
[Run a report : from SQL Reporting Management Portal]: #RunReportRMP
[Create a data source]: #CreateDS
[Edit a shared data source]: #EditDS
[Create a folder]: #CreateFolder
[Edit properties of a folder]: #EditPropFolder
[Update permissions on a Report item]: #UpdatePerm
[Next Steps]: #NextSteps


[Windows Azure SQL Reporting]: http://msdn.microsoft.com/en-us/library/windowsazure/gg430130

[SQL Database TechNet WIKI]: http://social.technet.microsoft.com/wiki/contents/articles/2267.sql-azure-technet-wiki-articles-index-en-us.aspx

[Windows Azure Platform Offers]: http://www.windowsazure.com/en-us/

[How to: Update Permissions on Report Server Item (Windows Azure SQL Reporting)]: http://msdn.microsoft.com/en-us/library/windowsazure/hh403965.aspx

[Finding and Viewing Reports with a Browser (Report Builder and SSRS)]: http://technet.microsoft.com/library/dd255286.aspx

[How to: Update Permissions on Report Server Item (Windows Azure SQL Reporting)]: http://msdn.microsoft.com/en-us/library/windowsazure/hh403965.aspx

[Permissions]: media/Permissions_button.png
[FolderProperties]: media/FolderProperties.png
[CreateFolderOption]: media/CreateFolder_button.png
[ServerHomePath]: media/ServerHome_path.png
[EditDataSource]: media/EditDS.png
[CreateDataSourceDialog]: media/CreateDS_dialog.png
[CreateDataSourceOption]: media/CreateDS_button.png
[ReportServer]: media/ReportServer_page.png
[ServerHome]: media/ServerHome.png
[UploadReportDialog]: media/UploadReport_dialog.png
[UploadReportOption]: media/UploadItem_button.png
[CreateUserCred]: media/CreateUser_Credentials.png
[ManageUserDialog]: media/ManagerUser_dialog.png
[ManageUserOption]: media/ManageUser_button.png
[CreateServerCred]: media/CreateServer_Credentials.png
[CreateServerDialog]: media/CreateServer_dialog.png
[CreateServerOption]: media/CreateServer_button.png
