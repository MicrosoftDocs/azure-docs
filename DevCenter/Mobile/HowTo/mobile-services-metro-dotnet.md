<properties linkid="mobile-how-to-mobile-service-metro-dotNet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Learn how to use Mobile Services in Windows Store apps in C# and Visual Basic" metakeywords="Get started Windows Azure Mobile Services, Azure mobile devices, Azure Windows 8" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps using C#, Visual Basic, and XAML." umbraconavihide="0" disquscomments="1"></properties>

# How to Use Mobile Services in Windows Store Apps
Language: [JavaScript and HTML][] | **VB/C# and XAML**

This guide will demonstrate how to use Windows Azure Mobile Services to easily create a Windows Store app that uses Windows Azure as the backend service for storage and authentication. Because you can develop Windows Store apps using either JavaScript and HTML or C#/VB and XAML, there is a version of this guide for each language.

## Table of Contents
-   [What is Mobile Services][]
-   [Concepts][]
-   [Getting started with Mobile Services][]
	-	[Define the mobile service instance][]
	-	[Add a new storage table][]
	-	[Create a Windows Store application][]
-	[Working with Mobile Services][]
	-	[How to: Add columns to the table index][]
	-	[How to: Authenticate with Windows Live][]
	-	[How to: Manage table permissions][]
	-	[How to: Register scripts on the server][]
	-	[How to: Send push notifications][]
-   [Next Steps][]


### Before you begin
 
Choose your preferred language from the language selector near the top, right side of the page:

-	**VB/C# and XAML**
-	[JavaScript and HTML][]

## <a name="what-is"> </a>What is Mobile Services
Windows Azure Mobile Services is a Windows Azure service offering designed to make it easy to create highly-functional mobile apps using Windows Azure. Mobile Services brings together a set of Windows Azure services that enable backend capabilities for mobile apps.

<div class="dev-callout"> 
<b>Note</b> 
<p>In this preview release, Mobile Services only supports Windows Store apps.</p> 
</div>

## <a name="concepts"> </a>Concepts
The following concepts are important for understanding the capabilities of Mobile Services:

-	**Mobile service instance:** Mobile Services provides a backend for your mobile apps such that each app has a unique mobile service instance. The Windows Azure Preview Management Portal enables you to create and manage your mobile services. You can independently manage settings, tables and scripts for each mobile service instance. 
-	**Tables:** Mobile Services provides structured data storage for your apps in the form of tables. However, unlike tables in Windows Azure SQL Database, Mobile Services dynamically defines table schema based on the data that is uploaded from your app. You can use the Preview Management Portal to manually define and modify indexes and columns in tables. 
-	**Authentication:** In this preview release, Mobile Services supports authentication for Windows Store apps by using Windows Live. Support for identity providers will be expanded in future releases.
-	**Permissions:** Mobile Services allows you to restrict the operations against a table. This can be used to restrict operations to only authenticated users or users that have an application key.
-	**Keys:** Mobile Services supports application keys. While not strictly a security feature, an application key, which is known to your app, can be used to filter out random HTTP requests not originiating from the app. 
-	**Push notifications:** Mobile Services authenticates with the Windows Push Notification Services (WNS) to send notifications.
-	**Scripts:** Mobile Services enables you to inject business logic into the mobile service, such as performing simple validation or authorization and even sending push notifications. The service can execute JavaScript in response to any table operation (create, read, update and delete).


## <a name="getting-started"> </a>Getting started with Mobile Services
This guide 
In this guide, you will complete the following basic steps to create a working Windows Store app that uses Mobile Services:

1.	Register for the Mobile Services preview
2.	Create a new mobile service in the Preview Management Portal.
3.	Complete the tutorial in the Preview Management Portal to create a Windows Store app that accesses the new mobile service. 

Once you have completed the guide, 

### Prerequisities
To complete the tasks in this guide, you will need the following:

- A computer or virtual machine running Windows 8
- Visual Studio 2012 Express for Windows 8
- An active Windows Azure account

###<a name="signup-for-mobile-preview"> </a>Register for the Mobile Services preview

1.	Sign into WindowsAzure.com.

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you do not have a Live ID account, register for one at login.live.com.</p> 
	</div>

2.	Sign up for free trial or use existing subscription.

3.	Make sure you are signed into [WindowsAzure.com][] with your Azure subscription, browse to the [Preview Management Portal][Management Portal preview]. 

4.	In the Mobile Services section, \*\**do something here*\*\*.

5.	\*\**Add other instructions as appropriate.*\*\*

###<a name="define-mobile-service-instance"> </a>Define the mobile service instance 
At this point, you must login to the Preview Management Portal to create a new mobile service instance.

1.	Log into the [Preview Management Portal][Management Portal preview]. 
2.	At the bottom of the navigation pane, click **+NEW**.

	![][0]

3.	Click **Mobile Service** and then click **Custom Create**.

	![][1]
	
	This displays the **Create a mobile service** dialog box.

4.	In **URL**, type a subdomain name to use in the URI for the mobile services instance. Click the check icon to varify that the name is available. Select the region for your mobile services instance from the **Region** drop-down list box.
	
	![][2]

	(Move this to the help drawer??)The entry can contain from 3-24 lowercase letters and numbers. This value becomes the host name within the URI that is used to address the mobile service instance, and must be globally unique in Mobile Services.

5.	From **Database**, click **Create a new SQL Database**. Mobile Services will create a new SQL Database for your mobile service instance. Click the right arrow button to go to the next page.

	![][3]

6.	In **New Database**, type the name of the database in **Name** and provide administrator credentials in **Admin Name** and **Password**. Make sure that **Configure my database automatically** is checked, and then click the check icon.

	![][4]

You now have a new service instance and a new SQL Database instance that can be used by your mobile application. Next, you will create a table in which to store application data.

###<a name="add-storage-table"></a>Add a new storage table
1.	In the [Preview Management Portal][Management Portal preview], click **Mobile Services**. Then click the name of the new mobile service to open the dashboard.

	![][5]

2.	Click **Storage** and then click **Add a storage collection**. 

	![][6] 

3.	In **Create new storage collection**, name the new table **SampleCollection** and click **Create**. 

	![][7]

4.	Now you have an empty table that can be used to store data from your app.

	![][8]

	By default, table schema is inferred when data is sent to the service in JavaScript Object Notation (JSON). You can create as many tables as needed by your application. 

Next, you will complete the quickstart tutorial in the Preview Management Portal and insert data into this table. 

###<a name="create-metro-app"></a>Create a Windows Store app
Once you have created a mobile service instance, the Preview Management Portal will auto-generate a quickstart tutorial based on the new service configuration. You can select the type of application (for the preview, only Windows Store apps are available) and the programming language for the snippets provided to you in the quickstart.

1.	In the [Preview Management Portal][Management Portal preview], click **Mobile Services**. Then click the name of the new mobile service to open the dashboard.

	![][5]

2.	In the dashboard for the selected mobile service instance, click **Quickstart**. Then select the language for the client application, in this case either **C#** or **Visual Basic**.

	![][9]

3.	Follow the instructions in the quickstart tutorial to create your first Mobile Services-based app in Visual Studio 2012 Express for Windows 8.

## <a name="working-with-mobile"> </a>Working with Mobile Services
You are now ready to perform the following How To's in this guide:

-	[How to: Manage keys][]
-	[How to: Add columns to the table index][]
-	[How to: Authenticate with Windows Live][]
-	[How to: Manage table permissions][]
-	[How to: Register scripts on the server][]
-	[How to: Send push notifications][]

### <a name="managing-keys"> </a>How to: Manage keys
The Preview Management Portal can be used to obtain and generate the applicatoin key for your service. This key is presented by your app when making requests to the mobile service instance and can be used to limit access to data. For more information, see [How to: Manage table permissions][].

1.	In the [Preview Management Portal][Management Portal preview], click **Mobile Services**. Then click the name of the new mobile service to open the dashboard.

	![][5]

2.	In the dashboard, click **View Keys**. 

	![][14]

3.	In **Access Keys**, select and copy the **Application Key** value. This value is used by your app when accessing restricted table resources. 

	![][15]

	You can also choose to regenerate the application key. However, regenerating this key will break existing versions of your app and require you to update to the new key value redistribute the app.

###	<a name="how-to-add-index"> </a>How to: Add columns to the index

You can often improve the performance of your mobile service instance by adding to the table index columns that are frequently referenced in queries from your app. 

1.	In the [Preview Management Portal][Management Portal preview], click **Mobile Services**. Then click the name of the new mobile service to open the dashboard.

	![][5]

2.	In the dashboard for the selected mobile service instance, click **Storage** and then click the table to manage.

	![][10]

1.	Click **Columns** and then click a column to add to the index.

	![][11]

2.	Click **Set Index**. This adds the column to the index for the table.


###	<a name="how-to-authenticate-mobile"> </a>How to: Authenticate with Windows Live
\[TODO\] Authentication...

### <a name="how-to-table-permissions"> </a>How to: Manage table permissions
Mobile Services allows you to specifically set the permissions for insert, update, delete, and query operations on tables. You can choose between the following permission levels:

-	**Everyone**&mdash;any client can perform the operation against the table.
-	**Anybody with the application key**&mdash;the operation requires the key distributed with the mobile app
-	**Only authenticated users**&mdash;the operation requires that the client be authenticated. For more information, see [How to: Authenticate with Windows Live].
-	**Only scripts and admins**&mdash;the operation is restricted to only service administrators and scripts registered on the server. For more information, see [How to: Register scripts on the server].

1.	In the [Preview Management Portal][Management Portal preview], click **Mobile Services**. Then click the name of the new mobile service to open the dashboard.

	![][5]

2.	In the dashboard for the selected mobile service instance, click **Storage** and then click the table to manage.

	![][10]

3.	Click **Permissions** and select the required permission level for each table operation from the drop-down list boxes. When done, click **Save**.

	![][12]


###	<a name="how-to-register-scripts-mobile"> </a>How to: Register scripts on the server
With Mobile Services, you can register JavaScript "scriptlets" against specific table operations. The scriptlet is executed whenever the table operation occurs. This enables you to inject business logic, such as logging or notifications, into your service based on data access events.

1.	In the [Preview Management Portal][Management Portal preview], click **Mobile Services**. Then click the name of the new mobile service to open the dashboard.

	![][5]

2.	In the dashboard for the selected mobile service instance, click **Storage** and then click the table to manage.

	![][10]

3.	Click **Scripts** and select the table operation that will invoke the script. Then type or paste your JavaScript code into the code editor window and click **Save**.

	![][13]

	The code editor will highlight any apparent problems with your code syntax. However, the code editor does not validate the script before saving. 

###	<a name="how-to-send-push-mobile"> </a>How to: Send push notifications
\[TODO\] These are the steps to send push notifications

## <a name="next-steps"> </a>Next Steps
Next steps are...

<!-- Anchors. -->
[What is Mobile Services]:#what-is
[Concepts]:#concepts
[Getting started with Mobile Services]:#getting-started
[Define the mobile service instance]:#define-mobile-service-instance
[Add a new storage table]:#add-storage-table
[Create a Windows Store application]:#create-metro-app
[Working with Mobile Services]:#working-with-mobile
[How to: Manage keys]:#managing-keys
[How to: Add columns to the table index]:#how-to-add-index
[How to: Authenticate with Windows Live]:#how-to-authenticate-mobile
[How to: Manage table permissions]:#how-to-table-permissions
[How to: Send push notifications]:#how-to-send-push-mobile
[How to: Register scripts on the server]:#how-to-register-scripts-mobile
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../../Shared/Media/plus-new.PNG
[1]: ../Media/mobile-create.png
[2]: ../Media/mobile-create-page1-name.png
[3]: ../Media/mobile-new-database.png
[4]: ../Media/mobile-new-database2.png
[5]: ../Media/mobile-services-selection.png
[6]: ../Media/mobile-service-storage.png
[7]: ../Media/mobile-create-storage-table.png
[8]: ../Media/mobile-service-tables.png
[9]: ../Media/mobile-portal-quickstart.png
[10]: ../Media/mobile-select-table.png
[11]: ../Media/mobile-set-index.png
[12]: ../Media/mobile-table-perms.png
[13]: ../Media/mobile-register-scriptlet.png
[14]: ../Media/mobile-service-keys.png
[15]: ../Media/mobile-view-keys.png 
[16]:  

<!-- URLs. -->
[JavaScript and HTML]: mobile-services-metro-javascript
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal preview]: https://manage.windowsazure.com/